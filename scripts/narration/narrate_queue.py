#!/usr/bin/env python3
"""Wait for the running Genesis job to finish, then narrate the remaining books in order.

usage: narrate_queue.py --profile 376a6b5f --narrator-id hester-v1 [--wait-for "narrate_book.py Genesis"]
Parts: --set ot (Genesis..Malachi), nt (Matthew..Revelation), apocrypha, ot+apocrypha (OT first), nt+apocrypha (NT first), or all.
Chapters already rendered with this voice are skipped. Each book is the resumable
narrate_book.py, so stopping this (kill it and its child) and starting it again continues
where it left off. Output: ~/Desktop/Narration/<Book>/ ; progress: ~/Desktop/Narration/queue.log
"""
import argparse, json, os, subprocess, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import narrate_chapter as nc

ap = argparse.ArgumentParser()
ap.add_argument("--profile", required=True)
ap.add_argument("--narrator-id", required=True)
ap.add_argument("--wait-for", default="none", help='text in another running job\'s command line to wait for ("none" = start now; waiting needs pgrep, i.e. macOS/Linux)')
ap.add_argument("--set", dest="which", choices=["all", "ot", "nt", "apocrypha", "ot+apocrypha", "nt+apocrypha"], default="all",
                help="which part of the Bible: ot, nt, apocrypha, ot+apocrypha (OT first), nt+apocrypha (NT first), or all (OT, NT, Apocrypha)")
ap.add_argument("--upload", action="store_true", help="upload each chapter as it finishes (and sweep up the whole book at the end) to the audio server (needs `npx wrangler login`)")
ap.add_argument("--only", default=None, help='comma-separated books to do, in this order, e.g. "Psalms,Matthew,John"')
a = ap.parse_args()
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

keys = list(json.load(open(nc.DATA, encoding="utf-8")).keys())
assert keys[0] == "Genesis" and keys[38] == "Malachi" and keys[39] == "1 Esdras" and keys[54] == "Matthew", "unexpected book order"
OT, APOCRYPHA, NT = keys[:39], keys[39:54], keys[54:]
books = {"all": OT + NT + APOCRYPHA, "ot": OT, "nt": NT, "apocrypha": APOCRYPHA,
         "ot+apocrypha": OT + APOCRYPHA, "nt+apocrypha": NT + APOCRYPHA}[a.which]
if a.only:
    books = [b.strip() for b in a.only.split(",")]
    assert all(b in keys for b in books), "unknown book name in --only"
os.makedirs(os.path.expanduser("~/Desktop/Narration"), exist_ok=True)
log = open(os.path.expanduser("~/Desktop/Narration/queue.log"), "a", encoding="utf-8")


def say(s):
    log.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')}  {s}\n"); log.flush()


nc.require_profile(nc.Voice(), a.profile)
say(f"queue ready: {len(books)} books after '{a.wait_for}', voice {a.profile} ({a.narrator_id})")
def other_job_running():
    if a.wait_for.strip().lower() in ("", "none"):
        return False
    try:
        return bool(subprocess.run(["pgrep", "-f", a.wait_for], capture_output=True).stdout.strip())
    except FileNotFoundError:        # no pgrep (Windows): nothing to wait for
        return False


while other_job_running():
    time.sleep(60)
say("starting")
for i, book in enumerate(books, 1):
    say(f"[{i}/{len(books)}] {book}: start")
    rc = subprocess.run([sys.executable, "-I", os.path.join(os.path.dirname(os.path.abspath(__file__)), "narrate_book.py"), book,
                         "--profile", a.profile, "--narrator-id", a.narrator_id] + (["--upload"] if a.upload else []),
                        stdout=open(os.path.expanduser(f"~/Desktop/Narration/{nc.book_slug(book)}.log"), "a", encoding="utf-8"), stderr=subprocess.STDOUT).returncode
    if rc == 3:
        say(f"[{i}/{len(books)}] {book}: STOPPED - the speech engine stopped working (out of memory?). Press Flush in VoiceStudio or "
            "quit and reopen it, then run the same command again; finished chapters are skipped.")
        sys.exit(3)
    say(f"[{i}/{len(books)}] {book}: " + ("finished" if rc == 0 else f"finished with some chapters FAILED (exit {rc}) - run the command again to retry them"))
    if a.upload and rc in (0, 1):
        up = subprocess.run([sys.executable, "-I", os.path.join(os.path.dirname(os.path.abspath(__file__)), "upload_to_r2.py"), book],
                            stdout=open(os.path.expanduser(f"~/Desktop/Narration/{nc.book_slug(book)}.log"), "a", encoding="utf-8"), stderr=subprocess.STDOUT)
        say(f"[{i}/{len(books)}] {book}: upload " + ("done" if up.returncode == 0 else f"FAILED (exit {up.returncode}) — run upload_to_r2.py later"))
say("queue complete")
