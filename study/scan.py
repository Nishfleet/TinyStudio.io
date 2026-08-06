#!/usr/bin/env python3
"""Daily read of the luxury-market corpus.

Writes a dated snapshot and prints only what CHANGED since the last one.
The snapshot is the asset: a single scrape is a statistic, a daily series is
a record of who fixed what and when — which nobody else has.

  python3 study/scan.py            # scan, save snapshot, print the delta
  python3 study/scan.py --summary  # also print the full per-industry table

Silent output means nothing moved. Designed for a --no-agent cron.
"""
import concurrent.futures as cf
import json
import os
import re
import ssl
import sys
import urllib.request
from datetime import date, datetime, timezone
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
SNAPS = os.path.join(HERE, "snapshots")
CORPUS = os.path.join(HERE, "corpus.json")

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/126 Safari/537.36"}


class Extract(HTMLParser):
    def __init__(self):
        super().__init__()
        self.txt, self.skip, self.inputs = [], 0, 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "noscript"):
            self.skip += 1
        if tag in ("input", "select", "textarea"):
            if dict(attrs).get("type", "text").lower() not in ("hidden", "submit", "button"):
                self.inputs += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript") and self.skip:
            self.skip -= 1

    def handle_data(self, data):
        if not self.skip:
            self.txt.append(data)


def scan(site):
    host = site["url"].split("//")[1].split("/")[0].replace("www.", "")
    row = {"industry": site["industry"], "geo": site["geo"], "host": host}
    try:
        req = urllib.request.Request(site["url"], headers=UA)
        html = urllib.request.urlopen(req, timeout=25, context=CTX).read().decode("utf-8", "ignore")
        p = Extract()
        p.feed(html)
        txt = re.sub(r"\s+", " ", " ".join(p.txt))
        row.update(ok=True, words=len(txt.split()),
                   price=len(re.findall(r"[£$€]\s?\d", txt)),
                   faq=bool(re.search(r"frequently asked|FAQ", txt, re.I)),
                   fields=p.inputs)
    except Exception as exc:
        row.update(ok=False, err=str(exc)[:60])
    return row


def previous_snapshot():
    if not os.path.isdir(SNAPS):
        return None
    files = sorted(f for f in os.listdir(SNAPS) if f.endswith(".json"))
    if not files:
        return None
    with open(os.path.join(SNAPS, files[-1])) as fh:
        return json.load(fh)


def delta(old, new):
    """Only material changes. Word-count drift is noise and is ignored."""
    if not old:
        return []
    prev = {r["host"]: r for r in old["rows"]}
    out = []
    for r in new:
        p = prev.get(r["host"])
        if not p:
            out.append(f"NEW      {r['host']} ({r['industry']})")
            continue
        if p.get("ok") and not r.get("ok"):
            out.append(f"BLOCKED  {r['host']} — was readable, now {r.get('err', 'unreachable')}")
            continue
        if not p.get("ok") and r.get("ok"):
            out.append(f"BACK     {r['host']} — readable again")
        if not (p.get("ok") and r.get("ok")):
            continue
        if (p["price"] == 0) != (r["price"] == 0):
            out.append(f"PRICE    {r['host']} — "
                       + ("now shows a price" if r["price"] else "removed its price"))
        if p["faq"] != r["faq"]:
            out.append(f"ANSWERS  {r['host']} — "
                       + ("added an answers section" if r["faq"] else "removed its answers section"))
        if abs(p["fields"] - r["fields"]) >= 3:
            out.append(f"FORM     {r['host']} — {p['fields']} to {r['fields']} input fields")
    return out


def main():
    with open(CORPUS) as fh:
        corpus = json.load(fh)
    with cf.ThreadPoolExecutor(max_workers=12) as ex:
        rows = list(ex.map(scan, corpus))
    ok = [r for r in rows if r["ok"]]

    prev = previous_snapshot()
    changes = delta(prev, rows)

    os.makedirs(SNAPS, exist_ok=True)
    snapshot = {
        "date": date.today().isoformat(),
        "scanned_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "attempted": len(rows), "readable": len(ok),
        "industries": len({r["industry"] for r in ok}),
        "geographies": len({r["geo"] for r in ok}),
        "no_price": sum(1 for r in ok if r["price"] == 0),
        "no_faq": sum(1 for r in ok if not r["faq"]),
        "rows": rows,
    }
    with open(os.path.join(SNAPS, f"{snapshot['date']}.json"), "w") as fh:
        json.dump(snapshot, fh, indent=1)

    if "--summary" in sys.argv:
        print(f"{snapshot['date']} · attempted {snapshot['attempted']} · readable {snapshot['readable']} · "
              f"{snapshot['industries']} industries · {snapshot['geographies']} geographies")
        print(f"{'INDUSTRY':26}{'n':>4}{'no price':>10}{'no FAQ':>9}")
        for ind in dict.fromkeys(r["industry"] for r in ok):
            g = [r for r in ok if r["industry"] == ind]
            print(f"{ind:26}{len(g):>4}{sum(1 for r in g if r['price'] == 0):>10}"
                  f"{sum(1 for r in g if not r['faq']):>9}")
        print(f"\n{'TOTAL':26}{len(ok):>4}{snapshot['no_price']:>10}{snapshot['no_faq']:>9}")

    if changes:
        print(f"TinyStudio market scan — {len(changes)} change(s) since "
              f"{prev['date'] if prev else 'first run'}\n")
        for line in changes:
            print(f"  {line}")
        print(f"\nCorpus: {snapshot['readable']}/{snapshot['attempted']} readable across "
              f"{snapshot['industries']} industries.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
