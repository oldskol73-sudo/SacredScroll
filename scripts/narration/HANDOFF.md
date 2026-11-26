# Sacred Scroll narration — handoff to another machine

This file is the state of the narration project as decided so far, so a fresh Claude Code
session (or a person) on another computer can continue without the original conversation.
Everything below is verified on the Mac it was built on unless marked **(PC: check)**.

## Goal
Narrate the whole Bible (KJV + Apocrypha, 81 books / 1,361 chapters / ~931k words / ~100 h of
audio) in one voice, one chapter file per chapter, with verse timings so the app can highlight and
jump to verses. Text lives in `constants/bible/data/kjva.json`.

## Decisions already made (do not re-litigate)
- **Voice: `Real_Juice`** (own-voice consent recorded in VoiceStudio). *Not* "Black Ad Man", *not* "Hester".
- **Words are sent to the voice exactly as written** — no respelling, no "LORD"→"Lord", no hath→has.
- **Pauses: "light"** (`--pauses light`, the script default): `[pause 450ms]` after `; :`, `[pause 700ms]`
  after `. ? !` inside a verse, and **0.8 s** between verses. Commas get no extra pause (version C was rejected).
- **Engine: OmniVoice** on the GPU. The `indextts2` engine is far too slow (4.8x real time on GPU) and ran out
  of memory in VoiceStudio's Audiobook mode — do **not** use Audiobook mode; use the per-verse pipeline here.
- Output per chapter: `<Book>_<NNN>.m4a` (mono AAC 64 kbps, loudness-normalised) + `<Book>_<NNN>.json`
  (verse start/end times, `constants/audio/types.ts` `ChapterAudioMetadata`).
- Only Genesis 1 exists in the final voice, and it was rendered **before** the pause decision, so it must be
  **re-rendered** with light pauses. The 16 Genesis chapters in "Black Ad Man" on the Mac are to be discarded.
- Rendering speed on the Mac (Apple M5): about 0.9x real time. A faster PC is the reason for moving.

## VoiceStudio settings to match
VoiceStudio talks over MCP at `http://127.0.0.1:3900/mcp/` with header `X-OmniVoice-Client-Id: claude-code`.
Register it in Claude Code on the PC:
`claude mcp add --transport http voicestudio http://127.0.0.1:3900/mcp/ --header "X-OmniVoice-Client-Id: claude-code"`

| Setting (Mac `data/prefs.json`) | Value | PC |
|---|---|---|
| `tts_backend` | `omnivoice` | same |
| `performance_profile.global` | `quality` | same |
| `compute_device` | `mps` (Apple GPU) | **(PC: check)** CUDA if NVIDIA, otherwise CPU is too slow |
| `asr_backend` | `mlx-whisper` (Mac-only) | **(PC: check)** whichever ASR VoiceStudio uses there; see QA note |
| `llm_backend` | `off` | same |
| `watermark.invisible` | `false` | same |
| `generation_history_cap` | `0` | same |

VoiceStudio also has **Cloud settings sync** (Settings → sync, "Choose what to sync", devices,
"use choices of device") — turn it on in both installs to copy preferences instead of matching by hand.

### Recreate the voice on the PC
Voice profiles are per-install, so the PC needs the profile created again (its id will differ — pass it with `--profile`).
Files to copy from the Mac (`~/Desktop/Narration-Transfer/`): `Real_Juice_reference.mp3`, `Real_Juice_reference_text.txt`.
In VoiceStudio clone a voice named `Real_Juice` from that recording with that exact reference text, **language Auto,
instruction `male`**, no seed. Then render the two pilot verses and compare by ear with the existing Genesis 1.
On the Mac the profile id is `039f13b8`.

## How to run (Python 3, ffmpeg + ffprobe on PATH)
```
# one chapter, to see everything work (default output ~/Desktop/Narration/<Book>/)
python3 scripts/narration/narrate_chapter.py "Genesis" 1 --profile <PC_PROFILE_ID> --out <dir>
# a whole book, resumable (skips chapters whose .m4a and .json already exist)
python3 scripts/narration/narrate_book.py "Genesis" --profile <PC_PROFILE_ID> --out <dir>
# the rest of the Bible in order (OT, NT, then Apocrypha), waits for any running job named by --wait-for
python3 scripts/narration/narrate_queue.py --profile <PC_PROFILE_ID> --narrator-id twelve-scents-v1 --wait-for "none"
# upload one finished book to the server
python3 scripts/narration/upload_to_r2.py "Genesis" --src <dir>
```
Windows notes: `caffeinate` (used when launching on the Mac) does not exist — keep the PC awake another way;
`lsof` is only used to print memory use and failures there are ignored; use `python` instead of `python3` if needed;
paths in the scripts default to `~/Desktop/Narration`.

### Quality check inside the pipeline
Each verse is transcribed back and compared with the scripture text (`compare()` in `narrate_chapter.py`); a flagged
verse is regenerated up to twice and the best take kept; what still differs is listed for a listen-by-ear check.
Tolerated: words split/joined ("every thing"), true homophones (fowl/foul, seas/sees), names spelled differently,
digits ("905" = nine hundred and five). **Not** tolerated: any other word change. Known benign flag: Genesis 1:12 ("and"→"an").
**(PC: check)** the ASR on the PC may mis-hear differently from `mlx-whisper`; re-render Genesis 1 first and see
whether the flags look like ASR noise or real voice errors before trusting a whole run.

## Server (Cloudflare R2)
- Account: devpublisher@twelvescentspub.com (`wrangler login` must be done on the PC too).
- Bucket `twelve-scent-publishing`; custom domain **`https://audio.twelvescentspub.com`** (zone `twelvescentspub.com`).
- Layout the app reads: `<Book_slug>/<Book_slug>_<NNN>.json` and `.m4a` (see `constants/audio/config.ts`).
  Book slugs replace spaces with `_` and drop parentheses, e.g. `1_Samuel`, `Ecclesiasticus_Sirach`.
- Currently on the server: `Genesis/Genesis_001.{m4a,json}` only (pre-pause version). Re-upload overwrites it.

## App
Repo `oldskol73-sudo/SacredScroll` (iOS) and `oldskol73-sudo/sacred-scroll-sdk57` (Android), both on `main`.
iOS app version 1.0.1, Expo SDK 58. `PremiumNarrationService` plays a chapter from the server, or from the bundle if one is
registered in `constants/audio/bundledNarration.ts` (currently empty). Chapters with no audio fall back to the iPhone voice.

## Still to decide / do
1. **Scene sounds** (the owner wants immersive ambience: water, wind, thunder, birds, fire…). Open question: bake into the
   audio, or ship as a separate toggleable layer (preferred: shared loops in the app + a per-chapter cue sheet, with ducking)?
   Sound sources must be CC0 / licensed for commercial app use, with a license log. Nothing built yet.
2. Re-render Genesis 1 with light pauses; then decide the book order and start the full run.
3. Hosting cost is negligible (R2: about 3 GB, no download fees). The app itself can only bundle roughly Genesis; the rest streams.

## Prompt to paste into Claude Code on the PC
> I'm continuing the Sacred Scroll narration project on this PC. Read `scripts/narration/HANDOFF.md` in the repo
> (`oldskol73-sudo/SacredScroll`) first. VoiceStudio is installed here; help me register its MCP server, recreate the
> `Real_Juice` voice from the files I copied (`Real_Juice_reference.mp3` + `Real_Juice_reference_text.txt`), match the
> settings in the table, then re-render Genesis 1 with the default light pauses so I can compare it to the Mac version.
