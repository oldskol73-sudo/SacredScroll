# Sacred Scroll narration — handoff to the PC

This is the state of the narration project, so a fresh Claude Code session (or a person) on the PC can
continue without the original conversation. Verified on the Mac it was built on unless marked **(PC: check)**.

## Goal
Narrate the whole Bible (KJV + Apocrypha: 81 books / 1,361 chapters / ~931k words / ~100 h of audio) in one
voice, one file per chapter, with verse timings so the app can highlight and jump to verses, and get it into the
app by uploading to the audio server. Text lives in `constants/bible/data/kjva.json`.

## Who renders what (decided)
The work is split across two machines, same narrator, both uploading to the same server (different book folders, no overlap):
| Machine | Renders | Voice profile | Audio | Estimated time |
|---|---|---|---|---|
| **PC** (RTX 4060 laptop) | **Old Testament** (39 books, 929 chapters), then the **Apocrypha** (15 books, 172 chapters) (`--set ot+apocrypha`) | `Real Juice_v4` = `37d18c23` | ~73 h | ~37 h (about 1.5 days) |
| **Mac** (Apple M5) | **New Testament** only (27 books, 260 chapters) (`--set nt`) | `Real_Juice` = `039f13b8` | ~18 h | ~45 h (about 1.9 days) |

The Mac is ~5x slower than the PC, so the split gives it the smallest part: both machines finish in about 1.9 days. (Rejected alternative: Apocrypha
on the Mac, which would take ~3.3 days.) To shift work between machines, use `--only "Book1,Book2"` on either side.
Both profiles are the same narrator (the owner confirmed `Real Juice_v4` matches the Mac's `Real_Juice`) and chapters are normalised to the same
loudness (−18 LUFS). Listen across the seams (Malachi → Matthew, and the Apocrypha) to be sure the two machines sound alike.

## The PC
Windows PC (assumed), **NVIDIA GeForce RTX 4060 (8 GB VRAM), 64 GB RAM**.

**Measured speeds (light pauses):**
- Mac (Apple M5): ~2.5–3x the audio length (3 verses = 57 s for 18 s of audio).
- PC, VoiceStudio *Processing device* left on **Auto**: Genesis 1 took 30 min 7 s for 4:44 of audio = **6.4x** (the slow path).
- PC after setting **Settings → Performance → Processing device = NVIDIA GPU (CUDA)** and restarting VoiceStudio: 3 verses = **11 s for
  18 s of audio = 0.6x** (voice engine 8 s + word-check 2 s + other 2 s) — about 5x faster than the Mac. `check_health` now reports
  `omnivoice on cuda (NVIDIA GeForce RTX 4060 Laptop GPU)`.
- Full Genesis 1 on the PC (CUDA): 283 s of audio in 129 s = **0.5x** (voice engine 86 s + word-check 33 s + other 10 s).
- Estimate on the PC: Genesis (3.8 h of audio) ~2 h; the whole Bible (~91 h of audio) ~2 days. It is a **laptop** (RTX 4060 Laptop
  GPU + Intel Arc, Core Ultra 9 185H): keep it plugged in, power mode = Best performance, sleep off, well ventilated; in Windows Graphics
  settings set VoiceStudio/Python to High performance. The speech-to-text backend (faster-whisper large-v3, CUDA) is fast enough as set.
- PC voice ids (profiles are per install): **`Real Juice_v4` = `37d18c23` is the approved narrator on the PC** — the owner confirmed it matches
  the Mac's `Real_Juice`. Use `--profile 37d18c23`. Do **not** use plain `Real_Juice` (`7306a5fb`) or `Real Juice Storyteller` (`3b63bb28`).
  The scripts refuse an unknown id and print the real ones. Takes are tagged with the voice + pause setting (`render.sig`, and the chapter's
  `_qa/*.qa.json`); changing either discards earlier takes, and `narrate_book` re-renders any chapter made with another voice.
- 8 GB of VRAM is the limit: stay on the **OmniVoice** engine and render one verse at a time (this pipeline does).
  Do not use the `indextts2` engine and do not use VoiceStudio's *Audiobook* mode (it ran the Mac out of memory).
- Keep other GPU-heavy things (browser hardware acceleration, games, video apps) closed while rendering.
- Needs: Python 3, **ffmpeg + ffprobe on PATH**, Node.js (for `npx wrangler`), Claude Code, git.

## Decisions already made (do not re-litigate)
- **Voice: `Real_Juice`** on the Mac = **`Real Juice_v4`** (`37d18c23`) on the PC (own-voice consent recorded in VoiceStudio). *Not* "Black Ad Man", *not* "Hester".
- **Words go to the voice exactly as written** — no respelling, no "LORD"→"Lord", no hath→has.
- **Pauses: "light"** (script default `--pauses light`): `[pause 450ms]` after `; :`, `[pause 700ms]` after `. ? !` inside a
  verse, **0.8 s** between verses. No extra pause on commas (that version was rejected).
- **Every chapter file opens with its book and chapter**, spoken by the narrator: "Genesis, chapter one." — the Psalms say "Psalm twenty-three.",
  numbered books say "First Samuel, chapter one.", "Ecclesiasticus, Sirach, chapter forty-four." It is its own take (000), checked like a verse, ~1.7 s long,
  then the usual 0.8 s gap; it is **not** a verse, so the timing file has no entry for it and verse 1 starts ~2.5 s in. `--announce none` turns it off.
  Any chapter rendered before this change (e.g. Genesis 1 on the PC and on the server) lacks it — `narrate_book`/`narrate_queue` re-render it
  automatically (its record has no `announce`), then upload it again.
- **Engine: OmniVoice**, quality profile. Output per chapter: `<Book>_<NNN>.m4a` (mono AAC 64 kbps, loudness-normalised)
  + `<Book>_<NNN>.json` (verse start/end times; shape = `ChapterAudioMetadata` in `constants/audio/types.ts`).
- Genesis 1 exists in this voice on the server but **was rendered before the pause decision** — re-render it.
  Everything the Mac rendered in "Black Ad Man" is to be thrown away (never upload it).
- **Scene sounds (ambient layer + on/off switch) are postponed to a later build.** The finished code is parked on the git
  branch `scene-sounds` (not in `main`; see `SCENE_SOUNDS.md` there). Do not merge it into this build.

## VoiceStudio settings to match
VoiceStudio exposes MCP at `http://127.0.0.1:3900/mcp/` with header `X-OmniVoice-Client-Id: claude-code`. In Claude Code on the PC:
`claude mcp add --transport http voicestudio http://127.0.0.1:3900/mcp/ --header "X-OmniVoice-Client-Id: claude-code"`

| Setting (Mac `data/prefs.json`) | Mac value | PC |
|---|---|---|
| `tts_backend` | `omnivoice` | same |
| `performance_profile.global` | `quality` | same |
| `compute_device` | `mps` (Apple GPU) | **(PC: check)** CUDA on the 4060 |
| `asr_backend` | `mlx-whisper` (Mac-only) | **(PC: check)** whatever VoiceStudio uses there — see Quality check |
| `llm_backend` | `off` | same |
| `watermark.invisible` | `false` | same |
| `generation_history_cap` | `0` | same |

VoiceStudio also has **Cloud settings sync** (Settings → sync: "Choose what to sync", devices, "use choices of device") —
turn it on in both installs to copy preferences instead of matching by hand.

### Recreate the voice on the PC
Profiles are per-install, so create `Real_Juice` again (its id will differ — pass it with `--profile`). Copy from the Mac's
`~/Desktop/Narration-Transfer/`: `Real_Juice_reference.mp3` and `Real_Juice_reference_text.txt`. Clone with that exact reference
text, **language Auto, instruction `male`**, no seed, consent = own voice. Mac profile id: `039f13b8`. Then render Genesis 1 and
compare by ear with the Mac's version (`~/Desktop/Narration-RealJuice/Genesis/`) before starting the long run.

## Plan for the PC session
1. Install the tools above; `git clone` the repo (`oldskol73-sudo/SacredScroll`, branch `main`); `npx wrangler login`
   (account devpublisher@twelvescentspub.com) and check `npx wrangler r2 bucket list` shows `twelve-scent-publishing`.
2. Register the MCP server; recreate the voice; match the settings table; `check_health` should report `omnivoice` on CUDA.
3. **Pilot:** `python scripts/narration/narrate_chapter.py "Genesis" 1 --profile <ID> --out <dir>` → listen; read the TIME line; note the time it prints.
4. **Run the queue — the PC does the Old Testament, then the Apocrypha** (Genesis first; resumable; uploads each book as it finishes; chapters already
   done in this voice — e.g. the approved Genesis 1 — are skipped):
   `python scripts/narration/narrate_queue.py --profile 37d18c23 --narrator-id twelve-scents-v1 --set ot+apocrypha --upload`
   To do some books first: add `--only "Psalms,Proverbs,Isaiah"` (a comma-separated list, in that order). Progress: `~/Desktop/Narration/queue.log`
   and `<Book>.log`; flagged verses are listed at the end of each book log and in `<dir>/_qa/`. Stop = kill the python
   processes; run again to resume.
5. The app needs **no update per book**: it asks the server for a chapter's JSON and falls back to the iPhone voice if it isn't
   there, so books appear as soon as they are uploaded (the build must contain the `audio.twelvescentspub.com` address — it does
   from commit `7ce1e84` on).
6. Listen to the flagged verses; re-render a book's chapter by deleting its `.m4a`/`.json` and running again.

Single commands (Windows: use `python`, not `python3`; paths default to `~/Desktop/Narration/<Book>/`):
```
python scripts/narration/narrate_chapter.py "Genesis" 1 --profile <ID> --out <dir>      # one chapter
python scripts/narration/narrate_book.py   "Genesis" --profile <ID> --out <dir>         # one book, resumable
python scripts/narration/upload_to_r2.py   "Genesis" --src <dir>                        # upload one book (--dry-run to preview)
```
There is no `caffeinate` on Windows — set the PC not to sleep while it renders. `lsof`/`pgrep` are Mac-only and are skipped on Windows.

## The Mac's part (New Testament only)
Run on the Mac (VoiceStudio open, OmniVoice engine, Mac's own profile `Real_Juice` = `039f13b8`; `wrangler` is already logged in there):
`caffeinate -i python3 scripts/narration/narrate_queue.py --profile 039f13b8 --narrator-id twelve-scents-v1 --set nt --upload`
Output goes to `~/Desktop/Narration/<Book>/` (the old "Black Ad Man" Genesis files in `~/Desktop/Narration/Genesis` are obsolete — ignore/delete).
Progress: `~/Desktop/Narration/queue.log`. Stop with `pkill -f narrate_queue.py; pkill -f narrate_book.py`; run again to resume.

## Quality check inside the pipeline
Each verse is transcribed back and compared with the scripture text (`compare()` in `narrate_chapter.py`); a flagged verse is
regenerated up to twice and the best take kept; whatever still differs is listed for listening. Tolerated: words split/joined
("every thing"), true homophones (fowl/foul, seas/sees), names spelled differently, digits ("905"). **Not** tolerated: any other word
change (hath/has, ye/yea, blessed/bless are errors). Known benign flag: Genesis 1:12 ("and"→"an").
**(PC: check)** the PC's ASR may mis-hear differently from `mlx-whisper`: after the pilot, look at whether flags are ASR noise
or real voice errors before trusting a whole run; loosen `compare()` only for noise, never for real word changes.

## If the render is slow (PC)
(Item 1 was the cause on this PC: the device was on Auto.) Work through these in order and re-run a 3-verse test after each (`--only 1-3 --retries 0 --out <tmp>`):
1. The first line of the run prints `engine: omnivoice on <device>`. It must name **CUDA / the RTX 4060**. If it says `cpu`, VoiceStudio
   is not using the GPU: Settings → Performance & Device → compute device → GPU/CUDA; then confirm PyTorch sees CUDA
   (`python -c "import torch; print(torch.cuda.is_available())"` inside VoiceStudio's Python environment) and that the NVIDIA driver is current.
2. While a render runs, `nvidia-smi -l 1` should show high GPU utilisation and VRAM in use. Near-zero use = CPU. VRAM pinned at 8 GB with
   low utilisation = swapping; close other GPU apps (browsers with hardware acceleration, games, video).
3. If `voice engine` is fine but `word-check` is large: VoiceStudio's speech-to-text backend is slow on this PC (the Mac uses `mlx-whisper`;
   a CPU Whisper model can take 10+ s per verse). Choose a faster/smaller ASR backend or GPU ASR in VoiceStudio settings.
4. Windows: power plan = High performance; plugged in; no battery saver. Performance profile `quality` is the intended setting — only try
   `balanced` as an experiment and compare the audio by ear.
5. Report back: the TIME line, device, GPU utilisation, and VoiceStudio's `omnivoice.log` lines with `generation_time_s`.

## Server (Cloudflare R2)
- Bucket `twelve-scent-publishing`; custom domain **`https://audio.twelvescentspub.com`** (zone `twelvescentspub.com`, already attached).
- Layout the app reads: `<Book_slug>/<Book_slug>_<NNN>.json` and `.m4a` (`constants/audio/config.ts`). Book slugs replace spaces with `_`
  and drop parentheses (`1_Samuel`, `Ecclesiasticus_Sirach`). Byte-range requests work (needed for "Start Reading Here").
- On the server now: `Genesis/Genesis_001.{m4a,json}` only (pre-pause version; re-upload overwrites it).
- Cost is negligible (about 3 GB, no download fees). The app can only bundle roughly Genesis; everything else streams.

## App
Repos `oldskol73-sudo/SacredScroll` (iOS) and `oldskol73-sudo/sacred-scroll-sdk57` (Android), both `main`. iOS version 1.0.1, Expo SDK 58,
everything unlocked (paid download). `PremiumNarrationService` plays from the server, or from the bundle if a chapter is registered in
`constants/audio/bundledNarration.ts` (currently empty). Xcode Cloud builds on push to `main`.

## Open
- Rebalance with `--only` if one machine finishes much earlier than the other.
- Scene sounds later (branch `scene-sounds`): sites to approve are listed in `SCENE_SOUNDS.md` on that branch.

## Prompt to paste into Claude Code on the PC
> I'm continuing the Sacred Scroll narration project on this Windows PC (RTX 4060 8 GB, 64 GB RAM). Read
> `scripts/narration/HANDOFF.md` in this repo first and follow its "Plan for the PC session". VoiceStudio is installed here.
> Help me register its MCP server, recreate the `Real_Juice` voice from the files I copied
> (`Real_Juice_reference.mp3` + `Real_Juice_reference_text.txt`), match the settings table, run the Genesis 1 pilot with the default
> light pauses and tell me the render speed, then start the queue for the **Old Testament and the Apocrypha** (`--set ot+apocrypha --upload`, profile `37d18c23`) once I've approved the pilot. The New Testament is being rendered on my Mac — do not render it here.
