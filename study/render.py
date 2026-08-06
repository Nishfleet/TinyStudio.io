#!/usr/bin/env python3
"""Write the newest snapshot's numbers into the public pages.

The study is advertised as refreshed daily, so the figures on the site cannot be
hand-typed — they would be a lie within 24 hours. This rewrites the marked spans
from the latest snapshot and nothing else.

  python3 study/render.py            # rewrite pages from the newest snapshot
  python3 study/render.py --check    # exit 1 if the pages are out of date

Only content inside data-study="..." spans is touched.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SNAPS = os.path.join(HERE, "snapshots")
PAGES = ["index.html", "audit.html", "pricing.html", "specimen.html"]

WORDS = {0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six",
         7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve",
         13: "thirteen", 14: "fourteen", 15: "fifteen", 16: "sixteen", 17: "seventeen",
         18: "eighteen", 19: "nineteen", 20: "twenty"}
TENS = {2: "twenty", 3: "thirty", 4: "forty", 5: "fifty", 6: "sixty", 7: "seventy",
        8: "eighty", 9: "ninety"}


def spell(n):
    if n in WORDS:
        return WORDS[n]
    if n < 100:
        t, r = divmod(n, 10)
        return TENS[t] + (f"-{WORDS[r]}" if r else "")
    return str(n)


def newest():
    files = sorted(f for f in os.listdir(SNAPS) if f.endswith(".json"))
    if not files:
        raise SystemExit("no snapshots — run study/scan.py first")
    with open(os.path.join(SNAPS, files[-1])) as fh:
        return json.load(fh)


def values(s):
    return {
        "no_price": str(s["no_price"]),
        "readable": str(s["readable"]),
        "no_price_word": spell(s["no_price"]),
        "readable_word": spell(s["readable"]),
        "no_faq_word": spell(s["no_faq"]),
        "attempted_word": spell(s["attempted"]),
        "blocked_word": spell(s["attempted"] - s["readable"]),
        "industries_word": spell(s["industries"]),
        "geographies_word": spell(s["geographies"]),
    }


def main():
    snap = newest()
    vals = values(snap)
    check = "--check" in sys.argv
    stale = []

    for page in PAGES:
        path = os.path.join(ROOT, "public", page)
        if not os.path.exists(path):
            continue
        src = open(path).read()

        def sub(m):
            key = m.group(1)
            return f'<span data-study="{key}">{vals.get(key, m.group(2))}</span>'

        out = re.sub(r'<span data-study="([a-z_]+)">(.*?)</span>', sub, src, flags=re.S)
        if out != src:
            if check:
                stale.append(page)
            else:
                open(path, "w").write(out)
                print(f"  {page}: updated")

    if check and stale:
        print("stale: " + ", ".join(stale))
        return 1
    if check:
        print(f"pages match snapshot {snap['date']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
