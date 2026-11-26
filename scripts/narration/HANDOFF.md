# Sacred Scroll narration — handoff to the PC

This is the state of the narration project, so a fresh Claude Code session (or a person) on the PC can
continue without the original conversation. Verified on the Mac it was built on unless marked **(PC: check)**.

## Goal
Narrate the whole Bible (KJV + Apocrypha: 81 books / 1,361 chapters / ~931k words / ~100 h of audio) in one
voice, one file per chapter, with verse timings so the app can highlight and jump to verses, and get it into the
app by uploading to the audio server. Text lives in `constants/bible/data/kjva.json`.

## The PC
Windows PC (assumed), **NVIDIA GeForce RTX 4060 (8 GB VRAM), 64 GB RAM**. The Mac (Apple M5) renders about 0.9x real
time, so ~100 h of audio is ~5 days there; the 4060 should be faster — guess 2–3 days, **measure it** on the first chapter.
- 8 GB of VRAM is the limit: stay on the **OmniVoice** engine and render one verse at a time (this pipeline does).
  Do not use the `indextts2` engine and do not use VoiceStudio's *Audiobook* mode (it ran the Mac out of memory).
- Keep other GPU-heavy things (browser hardware acceleration, games, video apps) closed while rendering.
- Needs: Python 3, **ffmpeg + ffprobe on PATH**, Node.js (for `npx wrangler`), Claude Code, git.

## Decisions already made (do not re-litigate)
- **Voice: `Real_Juice`** (own-voice consent recorded in VoiceStudio). *Not* "Black Ad Man", *not* "Hester".
- **Words go to the voice exactly as written** — no respelling, no "LORD"→"Lord", no hath→has.
- **Pauses: "light"** (script default `--pauses light`): `[pause 450ms]` after `; :`, `[pause 700ms]` after `. ? !` inside a
  verse, **0.8 s** between verses. No extra pause on commas (that version was rejected).
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
3. **Pilot:** `python scripts/narration/narrate_chapter.py "Genesis" 1 --profile <ID> --out <dir>` → listen; note the time it prints.
4. **Run the queue** (OT, NT, then Apocrypha; resumable; uploads each book as it finishes):
   `python scripts/narration/narrate_queue.py --profile <ID> --narrator-id twelve-scents-v1 --upload`
   To do some books first: add `--only "Psalms,Proverbs,Matthew,Mark,Luke,John"`. Progress: `~/Desktop/Narration/queue.log`
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

## Quality check inside the pipeline
Each verse is transcribed back and compared with the scripture text (`compare()` in `narrate_chapter.py`); a flagged verse is
regenerated up to twice and the best take kept; whatever still differs is listed for listening. Tolerated: words split/joined
("every thing"), true homophones (fowl/foul, seas/sees), names spelled differently, digits ("905"). **Not** tolerated: any other word
change (hath/has, ye/yea, blessed/bless are errors). Known benign flag: Genesis 1:12 ("and"→"an").
**(PC: check)** the PC's ASR may mis-hear differently from `mlx-whisper`: after the pilot, look at whether flags are ASR noise
or real voice errors before trusting a whole run; loosen `compare()` only for noise, never for real word changes.

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
- Book order beyond the default; whether to also render the Apocrypha now.
- Scene sounds later (branch `scene-sounds`): sites to approve are listed in `SCENE_SOUNDS.md` on that branch.

## Prompt to paste into Claude Code on the PC
> I'm continuing the Sacred Scroll narration project on this Windows PC (RTX 4060 8 GB, 64 GB RAM). Read
> `scripts/narration/HANDOFF.md` in this repo first and follow its "Plan for the PC session". VoiceStudio is installed here.
> Help me register its MCP server, recreate the `Real_Juice` voice from the files I copied
> (`Real_Juice_reference.mp3` + `Real_Juice_reference_text.txt`), match the settings table, run the Genesis 1 pilot with the default
> light pauses and tell me the render speed, then start the queue with `--upload` once I've approved the pilot.
