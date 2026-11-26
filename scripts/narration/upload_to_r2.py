#!/usr/bin/env python3
"""Upload finished narration to the Cloudflare R2 bucket behind audio.twelvescentspub.com.

usage: upload_to_r2.py "Exodus" [--src ~/Desktop/Narration/Exodus] [--dry-run] [--force]

Uploads every <Book>_<NNN>.m4a + <Book>_<NNN>.json pair found in SRC (a chapter is only
uploaded when BOTH exist) to  <bucket>/<Book_slug>/<file>, the layout the app reads
(constants/audio/config.ts):  https://audio.twelvescentspub.com/<Book>/<Book>_<NNN>.json
Only the book you name is touched — nothing is uploaded automatically. Needs `wrangler login`.
Already-uploaded, unchanged files are skipped (tracked in SRC/_uploaded.json).
"""
import argparse, concurrent.futures, glob, json, os, re, subprocess, sys

BUCKET = "twelve-scent-publishing"
BASE_URL = "https://audio.twelvescentspub.com"
# Short cache: a chapter that is re-rendered keeps its file name, so clients must pick up changes.
CACHE = "public, max-age=3600"
TYPES = {".m4a": "audio/mp4", ".json": "application/json"}


def book_slug(book):
    return re.sub(r"\s+", "_", re.sub(r"[()]", "", book).strip())


def put(key, path):
    ext = os.path.splitext(path)[1]
    r = subprocess.run(["npx", "--yes", "wrangler@latest", "r2", "object", "put", f"{BUCKET}/{key}", "--file", path,
                        "--content-type", TYPES[ext], "--cache-control", CACHE, "--remote"], capture_output=True, text=True)
    return key, r.returncode == 0, (r.stdout + r.stderr)[-300:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("book")
    ap.add_argument("--src", default=None)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true", help="re-upload even if unchanged")
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()

    slug = book_slug(a.book)
    src = os.path.expanduser(a.src or f"~/Desktop/Narration/{slug}")
    ledger_path = os.path.join(src, "_uploaded.json")
    ledger = json.load(open(ledger_path)) if os.path.exists(ledger_path) else {}

    todo = []
    for meta in sorted(glob.glob(os.path.join(src, f"{slug}_[0-9][0-9][0-9].json"))):
        audio = meta[:-5] + ".m4a"
        if not os.path.exists(audio):
            continue
        for path in (audio, meta):              # audio first: the JSON is what makes a chapter "available"
            key = f"{slug}/{os.path.basename(path)}"
            sig = [os.path.getsize(path), int(os.path.getmtime(path))]
            if a.force or ledger.get(key) != sig:
                todo.append((key, path, sig))

    mb = sum(os.path.getsize(p) for _, p, _ in todo) / 1e6
    print(f"{a.book}: {len(todo)} files to upload ({mb:.0f} MB) from {src} -> {BASE_URL}/{slug}/")
    if a.dry_run or not todo:
        for key, _, _ in todo[:6]:
            print("  would upload", key)
        return

    failed = []
    with concurrent.futures.ThreadPoolExecutor(a.workers) as ex:
        futures = {ex.submit(put, k, p): (k, p, s) for k, p, s in todo}
        for i, f in enumerate(concurrent.futures.as_completed(futures), 1):
            key, ok, msg = f.result()
            if ok:
                ledger[key] = futures[f][2]
                json.dump(ledger, open(ledger_path, "w"), indent=1)
            else:
                failed.append(key); print(f"  FAILED {key}: {msg}")
            if i % 10 == 0 or i == len(todo):
                print(f"  {i}/{len(todo)}", flush=True)
    print("done;", "all uploaded" if not failed else f"{len(failed)} failed — re-run to retry")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
