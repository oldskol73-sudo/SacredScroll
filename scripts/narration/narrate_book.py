#!/usr/bin/env python3
"""Narrate every chapter of a book, one after another, resumably.

usage: narrate_book.py "Genesis" [--from 1] [--to 50] [--profile f9e18e18] [--out DIR] [--retries 2]
A chapter is skipped when both OUT/<Book>_<NNN>.m4a and .json already exist, so a
re-run after a stop (or a crash) picks up where it left off. Progress is printed
per chapter; flagged verses (still differing after the retries) are summarised at
the end and kept per chapter in OUT/_qa/.
"""
import argparse, json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import narrate_chapter as nc


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("book")
    ap.add_argument("--from", dest="lo", type=int, default=1)
    ap.add_argument("--to", dest="hi", type=int, default=None)
    ap.add_argument("--profile", default="f9e18e18")
    ap.add_argument("--out", default=None)
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--narrator-id", default=nc.NARRATOR_ID)
    a = ap.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    out = a.out or os.path.expanduser(f"~/Desktop/Narration/{nc.book_slug(a.book)}")
    os.makedirs(out, exist_ok=True)
    chapters = sorted(int(c) for c in json.load(open(nc.DATA, encoding="utf-8"))[a.book])
    chapters = [c for c in chapters if c >= a.lo and (a.hi is None or c <= a.hi)]
    voice = nc.Voice()
    t0 = time.time(); done_audio = 0.0; all_flagged = []

    def log(s):
        print(s, flush=True)

    log(f"{a.book}: {len(chapters)} chapters -> {out}")
    for i, ch in enumerate(chapters, 1):
        stem = f"{nc.book_slug(a.book)}_{ch:03d}"
        if os.path.exists(os.path.join(out, f"{stem}.m4a")) and os.path.exists(os.path.join(out, f"{stem}.json")):
            log(f"[{i:>2}/{len(chapters)}] {stem}: already done, skipping")
            continue
        try:
            r = nc.narrate_chapter(a.book, ch, a.profile, out, voice, a.retries, None, log=log, narrator_id=a.narrator_id)
        except Exception as e:
            log(f"[{i:>2}/{len(chapters)}] {stem}: FAILED ({e}) — will continue; re-run to retry this chapter")
            continue
        done_audio += r["audio_s"]
        for f in r["flagged"]:
            all_flagged.append((stem, f["verse"], f["errors"]))
        log(f"[{i:>2}/{len(chapters)}] {stem}: {r['verses']} verses, {r['audio_s']/60:.1f} min audio, {r['seconds']/60:.1f} min, "
            f"flagged {len(r['flagged'])}  (engine {r['engine_s']/60:.1f} min, check {r['check_s']/60:.1f} min, {r['device']})   | total {done_audio/3600:.2f} h audio in {(time.time()-t0)/3600:.2f} h")

    log("\nFINISHED")
    log(f"flagged verses (still differ after {a.retries + 1} takes — check by ear): {len(all_flagged)}")
    for stem, v, errs in all_flagged:
        log(f"  {stem} verse {v}: {errs}")
    os.makedirs(os.path.join(out, "_qa"), exist_ok=True)
    with open(os.path.join(out, "_qa", "summary.txt"), "w") as f:
        for stem, v, errs in all_flagged:
            f.write(f"{stem} verse {v}: {errs}\n")


if __name__ == "__main__":
    main()
