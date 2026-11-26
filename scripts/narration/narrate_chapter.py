#!/usr/bin/env python3
"""Narrate one Bible chapter with VoiceStudio (MCP, http://127.0.0.1:3900/mcp/).

One generate_speech call per verse (small pieces keep the GPU from running out
of memory and give exact verse timings). The text is sent exactly as written in the
scripture data — no respelling, no word changes. Each take is transcribed straight back
and compared with the scripture text; a flagged verse is regenerated (up to
--retries times) and the best take is kept. Then: trim silence -> stitch with a
short pause -> normalize loudness -> AAC .m4a, plus the verse-timing JSON the app
fetches (see constants/audio/types.ts ChapterAudioMetadata).

usage: narrate_chapter.py "Genesis" 1 [--profile f9e18e18] [--out DIR] [--only 1-5] [--retries 2]
Resumable: verse takes already in OUT/<stem>_verses are reused (and re-checked).
"""
import argparse, base64, difflib, glob, json, os, re, subprocess, sys, time, urllib.request, wave

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA = os.path.join(REPO, "constants/bible/data/kjva.json")
MCP = "http://127.0.0.1:3900/mcp/"
DEFAULT_PAUSES = "light"
PAUSE_S = 0.8           # silence between verses (decided: "light" pauses sound right)
NARRATOR_ID = "twelve-scents-v1"
VERSION = "narrator_v1"
# Silence added after punctuation inside a verse, via VoiceStudio's inline [pause Nms] markers
# (the words themselves are never touched). "light" = clause/sentence breaks only; "full" adds commas.
PAUSES_MS = {
    "none": {},
    "light": {";": 450, ":": 450, ".": 700, "?": 700, "!": 700},
    "full": {",": 250, ";": 450, ":": 450, ".": 700, "?": 700, "!": 700},
}


def with_pauses(text, mode):
    """Insert [pause Nms] after punctuation that is followed by more text in the same verse."""
    table = PAUSES_MS[mode]
    if not table:
        return text
    return re.sub(r"([,;:.?!])(\s+)(?=\S)", lambda m: f"{m.group(1)} [pause {table[m.group(1)]}ms] " if m.group(1) in table else m.group(0), text)


# Words that sound identical, so a transcriber can only guess the spelling. Nothing else is
# treated as equal: "hath"/"has", "ye"/"yea", "blessed"/"bless" etc. all count as errors.
HOMOPHONES = {frozenset(p) for p in [("fowl", "foul"), ("seas", "sees"), ("sea", "see"), ("hart", "heart")]}


# ---------------------------------------------------------------- MCP client
class MCPClient:
    def __init__(self):
        self.sid = None
        self.n = 0
        self._post({"jsonrpc": "2.0", "id": self._id(), "method": "initialize", "params": {
            "protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "claude-code", "version": "1.0"}}})
        self._post({"jsonrpc": "2.0", "method": "notifications/initialized"}, expect=False)

    def _id(self):
        self.n += 1
        return self.n

    def _post(self, body, expect=True, timeout=900):
        h = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream",
             "X-OmniVoice-Client-Id": "claude-code"}
        if self.sid:
            h["mcp-session-id"] = self.sid
        resp = urllib.request.urlopen(urllib.request.Request(MCP, data=json.dumps(body).encode(), headers=h, method="POST"), timeout=timeout)
        self.sid = self.sid or resp.headers.get("mcp-session-id")
        raw = resp.read().decode()
        if not expect:
            return None
        for line in raw.splitlines():
            if line.startswith("data: "):
                return json.loads(line[6:])
        return None

    def call(self, tool, args, timeout=900):
        d = self._post({"jsonrpc": "2.0", "id": self._id(), "method": "tools/call", "params": {"name": tool, "arguments": args}}, timeout=timeout)
        r = d["result"]
        text = "".join(c.get("text", "") for c in r.get("content", []) if c.get("type") == "text")
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            raise RuntimeError(text[:300])


class Voice:
    """MCP client that reconnects (new session) if the connection drops mid-run."""
    def __init__(self):
        self.client = MCPClient()

    def call(self, tool, args):
        try:
            return self.client.call(tool, args)
        except Exception as first:
            if "unsupported" in str(first) or "profile" in str(first).lower():
                raise
            time.sleep(5)
            self.client = MCPClient()
            return self.client.call(tool, args)


# ---------------------------------------------------------------- text
def book_slug(book):
    return re.sub(r"\s+", "_", re.sub(r"[()]", "", book).strip())


def words(s):
    return re.findall(r"[a-z0-9']+", s.lower().replace("’", "'"))


ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
        "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]


def number_words(n):
    """905 -> ['nine','hundred','and','five'] — the way the KJV spells numbers out."""
    if n < 20:
        return [ONES[n]]
    if n < 100:
        return [TENS[n // 10]] + ([ONES[n % 10]] if n % 10 else [])
    if n < 1000:
        rest = n % 100
        return [ONES[n // 100], "hundred"] + (["and"] + number_words(rest) if rest else [])
    rest = n % 1000
    return number_words(n // 1000) + ["thousand"] + ((["and"] if rest < 100 else []) + number_words(rest) if rest else [])


def spoken_tokens(heard_text):
    """The transcriber writes digits ("905"); the scripture spells them out. Expand to words."""
    out = []
    for t in words(heard_text):
        out += number_words(int(t)) if t.isdigit() and int(t) < 1000000 else [t]
    return out


def mid_sentence_capitals(text):
    """Words capitalized in the middle of a sentence — names (and Lord/God)."""
    out = set()
    for m in re.finditer(r"[A-Za-z']+", text):
        before = text[:m.start()].rstrip()
        if m.group(0)[0].isupper() and before and before[-1] not in ".?!:;":
            out.add(m.group(0).lower())
    return out


def compare(want_text, heard_text):
    """Hard errors between the scripture text and what the transcriber heard.
    Ignored: words split/joined differently ("every thing"/"everything"), words that sound
    identical, and a name (capitalized mid-sentence) spelled slightly differently. Counted: any word that
    is missing, extra, or replaced by a different word."""
    want, got = words(want_text), spoken_tokens(heard_text)
    if "".join(want) == "".join(got):
        return []
    names = mid_sentence_capitals(want_text)
    sm = difflib.SequenceMatcher(a=want, b=got, autojunk=False)
    errors = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        a, b = want[i1:i2], got[j1:j2]
        if "".join(a) == "".join(b):
            continue
        if tag == "replace" and len(a) == len(b):
            for x, y in zip(a, b):
                if frozenset((x, y)) in HOMOPHONES:
                    continue
                if x in names and difflib.SequenceMatcher(a=x, b=y).ratio() >= 0.8:
                    continue                                # a name the transcriber spelled differently
                errors.append(f"{x}->{y}")
            continue
        errors += [f"-{w}" for w in a] + [f"+{w}" for w in b]
    return errors


# ---------------------------------------------------------------- audio
def abs_path(path):
    """~, $VAR and %VAR% expanded, and made absolute (a relative path breaks ffmpeg's concat list)."""
    return os.path.abspath(os.path.expandvars(os.path.expanduser(path)))


def require_profile(voice, profile):
    """Stop early if the voice id isn't in VoiceStudio — otherwise it quietly renders in some other voice."""
    r = voice.call("list_voices", {})
    profiles = r if isinstance(r, list) else (r.get("voices") or r.get("profiles") or [])
    if not any(p.get("id") == profile for p in profiles):
        listing = "\n".join(f"    {p.get('id')}  {p.get('name')}" for p in profiles)
        raise SystemExit(f"Voice profile '{profile}' was not found in VoiceStudio. Use the id of Real_Juice from this list:\n{listing}")


def ff_path(path):
    """A path as ffmpeg's concat list wants it: forward slashes, quotes escaped (matters on Windows)."""
    return path.replace("\\", "/").replace("'", "'\\''")


def sh(*cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def wav_seconds(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


def narrate_chapter(book, chapter, profile, out, voice, retries=2, only=None, log=print, narrator_id=NARRATOR_ID,
                    pauses=DEFAULT_PAUSES, verse_gap=PAUSE_S):
    out = abs_path(out)
    stem = f"{book_slug(book)}_{chapter:03d}"
    vdir = os.path.join(out, f"{stem}_verses")
    os.makedirs(vdir, exist_ok=True)
    # Verse takes are reused on a re-run, so they must come from the same voice and pause setting: if
    # either changed since they were made, throw them away rather than silently mixing voices.
    sig = f"{profile}|{pauses}"
    sig_file = os.path.join(vdir, "render.sig")
    earlier_takes = glob.glob(os.path.join(vdir, "*.raw.wav"))
    tagged = open(sig_file, encoding="utf-8").read().strip() if os.path.exists(sig_file) else None
    if earlier_takes and tagged != sig:
        # Different voice/pauses — or no tag at all (made by an older version, so the voice is unknown): never reuse.
        log("    earlier takes were made with a different voice/pause setting, or can't be identified - discarding them and re-rendering")
        for f in glob.glob(os.path.join(vdir, "*.wav")):
            os.remove(f)
    open(sig_file, "w", encoding="utf-8").write(sig)
    verses = json.load(open(DATA, encoding="utf-8"))[book][str(chapter)]
    if only:
        lo, hi = only
        verses = [v for v in verses if lo <= v["n"] <= hi]
    t0 = time.time()
    flagged, takes = [], 0
    timing = {"engine": 0.0, "check": 0.0, "audio": 0.0}      # seconds spent by VoiceStudio generating / transcribing
    try:
        health = voice.call("check_health", {})
    except Exception:
        health = {}
    log(f"    engine: {health.get('engine')} on {health.get('device')}")

    # 1) one take per verse, checked against the text; regenerate flagged verses
    for v in verses:
        raw_wav = os.path.join(vdir, f"{v['n']:03d}.raw.wav")
        spoken = with_pauses(v["text"], pauses)             # the words are exactly as written; only silences are added
        best_errs, best_bytes = None, None
        for attempt in range(retries + 1):
            if attempt == 0 and os.path.exists(raw_wav):
                data = open(raw_wav, "rb").read()          # resume: reuse, but still check
            else:
                for gen_try in range(1, 4):
                    try:
                        r = voice.call("generate_speech", {"text": spoken, "language": "English", "profile_id": profile, "format": "wav"})
                        data = base64.b64decode(r["wav_base64"]); takes += 1
                        timing["engine"] += float(r.get("generation_time_s") or 0)
                        timing["audio"] += float(r.get("audio_duration_s") or 0)
                        break
                    except Exception as e:
                        log(f"    verse {v['n']} generation error ({gen_try}/3): {e}")
                        if gen_try == 3:
                            raise
                        time.sleep(20 * gen_try)
            tr = voice.call("transcribe", {"audio_base64": base64.b64encode(data).decode(), "language": "English"})
            timing["check"] += float(tr.get("transcription_time_s") or 0)
            heard = tr.get("text", "")
            errs = compare(v["text"], heard)
            if best_errs is None or len(errs) < len(best_errs):
                best_errs, best_bytes = errs, data
            if not errs:
                break
        open(raw_wav, "wb").write(best_bytes)
        if best_errs:
            flagged.append({"verse": v["n"], "errors": best_errs})
            log(f"    verse {v['n']:>2} still differs after {retries + 1} takes: {best_errs}")

    # 2) trim silence at both ends of every take
    trimmed = []
    trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse"
    for v in verses:
        raw_wav = os.path.join(vdir, f"{v['n']:03d}.raw.wav"); tw = os.path.join(vdir, f"{v['n']:03d}.wav")
        sh("ffmpeg", "-y", "-i", raw_wav, "-af", trim, "-ar", "24000", "-ac", "1", tw)
        trimmed.append(tw)

    # 3) stitch with a pause, recording each verse's start/end
    silence = os.path.join(vdir, "pause.wav")
    sh("ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(verse_gap), "-c:a", "pcm_s16le", silence)
    listing = os.path.join(vdir, "concat.txt"); timings = []; cursor = 0.0
    with open(listing, "w") as f:
        for i, (v, tw) in enumerate(zip(verses, trimmed)):
            d = wav_seconds(tw)
            timings.append({"verse": v["n"], "start": round(cursor, 3), "end": round(cursor + d, 3)})
            cursor += d
            f.write(f"file '{ff_path(tw)}'\n")
            if i < len(verses) - 1:
                f.write(f"file '{ff_path(silence)}'\n"); cursor += verse_gap
    joined = os.path.join(vdir, "chapter.wav")
    sh("ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listing, "-c:a", "pcm_s16le", joined)

    # 4) loudness-normalize (same gain for the whole chapter) and encode AAC
    m4a = os.path.join(out, f"{stem}.m4a")
    sh("ffmpeg", "-y", "-i", joined, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ar", "24000", "-ac", "1", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", m4a)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", m4a], capture_output=True, text=True).stdout)

    # 5) timing metadata in the app's ChapterAudioMetadata shape (written last: its presence = chapter done)
    meta = {"book": book, "chapter": chapter, "audioFile": f"{stem}.m4a", "duration": round(dur, 3),
            "version": VERSION, "narratorId": narrator_id, "verses": timings}
    qa_dir = os.path.join(out, "_qa"); os.makedirs(qa_dir, exist_ok=True)
    wall = time.time() - t0
    json.dump({"stem": stem, "flagged": flagged, "takes": takes, "profile": profile, "pauses": pauses,
               "device": health.get("device"), "engine": health.get("engine"),
               "audio_seconds": round(cursor, 1), "render_seconds": round(wall, 1),
               "engine_seconds": round(timing["engine"], 1), "check_seconds": round(timing["check"], 1),
               "other_seconds": round(wall - timing["engine"] - timing["check"], 1)},
              open(os.path.join(qa_dir, f"{stem}.qa.json"), "w"), indent=1)
    json.dump(meta, open(os.path.join(out, f"{stem}.json"), "w"), indent=2)
    return {"stem": stem, "verses": len(verses), "audio_s": cursor, "seconds": wall, "takes": takes, "flagged": flagged,
            "engine_s": timing["engine"], "check_s": timing["check"], "device": health.get("device")}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("book"); ap.add_argument("chapter", type=int)
    ap.add_argument("--profile", default="f9e18e18")
    ap.add_argument("--out", default=None)
    ap.add_argument("--only", default=None, help="verse range like 1-5 (test)")
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--narrator-id", default=NARRATOR_ID)
    ap.add_argument("--pauses", choices=list(PAUSES_MS), default=DEFAULT_PAUSES)
    ap.add_argument("--verse-gap", type=float, default=PAUSE_S)
    a = ap.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    out = abs_path(a.out or f"~/Desktop/Narration/{book_slug(a.book)}")
    os.makedirs(out, exist_ok=True)
    only = tuple(int(x) for x in a.only.split("-")) if a.only else None
    voice = Voice()
    require_profile(voice, a.profile)
    r = narrate_chapter(a.book, a.chapter, a.profile, out, voice, a.retries, only, log=lambda s: print(s, flush=True), narrator_id=a.narrator_id,
                         pauses=a.pauses, verse_gap=a.verse_gap)
    print(f"DONE {r['stem']}: {r['audio_s']:.0f}s audio, {r['verses']} verses, {r['takes']} new takes, {r['seconds']:.0f}s; flagged: {r['flagged'] or 'none'}")
    print(f"TIME  render {r['seconds']:.0f}s = voice engine {r['engine_s']:.0f}s + word-check {r['check_s']:.0f}s + other {r['seconds'] - r['engine_s'] - r['check_s']:.0f}s"
          f"  |  {r['seconds'] / max(r['audio_s'], 1):.1f}x the audio length  |  device: {r['device']}")


if __name__ == "__main__":
    main()
