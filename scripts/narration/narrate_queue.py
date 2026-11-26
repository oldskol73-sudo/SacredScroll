#!/usr/bin/env python3
"""Wait for the running Genesis job to finish, then narrate the remaining books in order.

usage: narrate_queue.py --profile 376a6b5f --narrator-id hester-v1 [--wait-for "narrate_book.py Genesis"]
Order: Exodus..Malachi, Matthew..Revelation, then the Apocrypha. Each book is the resumable
narrate_book.py, so stopping this (kill it and its child) and starting it again continues
where it left off. Output: ~/Desktop/Narration/<Book>/ ; progress: ~/Desktop/Narration/queue.log
"""
import argparse, json, os, subprocess, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import narrate_chapter as nc

ap = argparse.ArgumentParser()
ap.add_argument("--profile", required=True)
ap.add_argument("--narrator-id", required=True)
ap.add_argument("--wait-for", default="narrate_book.py Genesis")
a = ap.parse_args()

keys = list(json.load(open(nc.DATA)).keys())
assert keys[0] == "Genesis" and keys[38] == "Malachi" and keys[39] == "1 Esdras" and keys[54] == "Matthew", "unexpected book order"
books = keys[1:39] + keys[54:] + keys[39:54]      # OT, NT, Apocrypha
log = open(os.path.expanduser("~/Desktop/Narration/queue.log"), "a")


def say(s):
    log.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')}  {s}\n"); log.flush()


say(f"queue ready: {len(books)} books after '{a.wait_for}', voice {a.profile} ({a.narrator_id})")
while subprocess.run(["pgrep", "-f", a.wait_for], capture_output=True).stdout.strip():
    time.sleep(60)
say("previous job finished; starting")
for i, book in enumerate(books, 1):
    say(f"[{i}/{len(books)}] {book}: start")
    rc = subprocess.run([sys.executable, "-I", os.path.join(os.path.dirname(os.path.abspath(__file__)), "narrate_book.py"), book,
                         "--profile", a.profile, "--narrator-id", a.narrator_id],
                        stdout=open(os.path.expanduser(f"~/Desktop/Narration/{nc.book_slug(book)}.log"), "a"), stderr=subprocess.STDOUT).returncode
    say(f"[{i}/{len(books)}] {book}: finished (exit {rc})")
say("queue complete")
