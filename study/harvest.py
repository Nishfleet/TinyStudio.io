#!/usr/bin/env python3
"""Grow the corpus from OpenStreetMap.

Hand-picked URLs cap out in the dozens. OSM carries a `website` tag on millions
of real businesses, is openly licensed (ODbL), and has a free query API — so the
corpus can reach thousands without scraping anyone or paying for a list.

  python3 study/harvest.py --dry-run     # show what would be added
  python3 study/harvest.py               # append new sites to corpus.json

Existing entries are never modified and never duplicated. Attribution: data
© OpenStreetMap contributors.
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.join(HERE, "corpus.json")
OVERPASS = ["https://overpass-api.de/api/interpreter",
            "https://overpass.kumi.systems/api/interpreter",
            "https://overpass.osm.ch/api/interpreter"]

# bbox: south, west, north, east
CITIES = {
    # Europe
    "London": (51.42,-0.28,51.60,0.05), "Paris": (48.81,2.24,48.90,2.42),
    "Milan": (45.42,9.10,45.52,9.24), "Zurich": (47.34,8.48,47.43,8.60),
    "Geneva": (46.18,6.10,46.24,6.19), "Monaco": (43.72,7.40,43.76,7.44),
    "Munich": (48.10,11.49,48.18,11.63), "Frankfurt": (50.09,8.60,50.16,8.72),
    "Berlin": (52.47,13.32,52.55,13.46), "Vienna": (48.18,16.32,48.24,16.42),
    "Madrid": (40.40,-3.72,40.46,-3.66), "Barcelona": (41.37,2.13,41.42,2.20),
    "Rome": (41.88,12.45,41.93,12.52), "Lisbon": (38.70,-9.18,38.75,-9.12),
    "Amsterdam": (52.34,4.84,52.39,4.93), "Brussels": (50.82,4.33,50.87,4.40),
    "Copenhagen": (55.66,12.53,55.71,12.61), "Stockholm": (59.31,18.03,59.35,18.10),
    "Oslo": (59.90,10.70,59.94,10.79), "Dublin": (53.32,-6.29,53.37,-6.22),
    "Athens": (37.96,23.71,38.00,23.77), "Istanbul": (41.02,28.96,41.08,29.05),
    # Americas
    "New York": (40.66,-74.05,40.85,-73.87), "Miami": (25.70,-80.31,25.86,-80.13),
    "Los Angeles": (33.98,-118.50,34.14,-118.24), "San Francisco": (37.75,-122.47,37.81,-122.39),
    "Chicago": (41.86,-87.68,41.93,-87.60), "Boston": (42.33,-71.11,42.38,-71.04),
    "Toronto": (43.63,-79.42,43.69,-79.34), "Aspen": (39.17,-106.85,39.21,-106.79),
    "Palm Beach": (26.66,-80.06,26.75,-80.02), "Fort Lauderdale": (26.09,-80.17,26.16,-80.09),
    "Mexico City": (19.39,-99.20,19.45,-99.14), "Sao Paulo": (-23.60,-46.70,-23.54,-46.62),
    # Middle East, Asia, Pacific
    "Dubai": (25.05,55.10,25.30,55.40), "Abu Dhabi": (24.44,54.33,24.51,54.42),
    "Doha": (25.27,51.50,25.33,51.55), "Riyadh": (24.66,46.65,24.74,46.76),
    "Singapore": (1.24,103.68,1.42,103.92), "Hong Kong": (22.24,114.12,22.34,114.24),
    "Tokyo": (35.65,139.69,35.71,139.78), "Seoul": (37.50,126.97,37.55,127.05),
    "Shanghai": (31.20,121.44,31.26,121.52), "Mumbai": (18.90,72.81,19.00,72.88),
    "Sydney": (-33.92,151.15,-33.83,151.28), "Melbourne": (-37.83,144.94,-37.79,145.00),
    "Auckland": (-36.87,174.73,-36.83,174.79), "Cape Town": (-33.95,18.39,-33.90,18.45),
}

# OSM tag -> our industry label. Chosen for high-consideration, high-ticket trades.
TAGS = {
    # original set
    'shop=jewelry': "Jewellery & watches", 'shop=watches': "Jewellery & watches",
    'office=estate_agent': "Property", 'shop=car;car_repair': "Automotive",
    'amenity=dentist': "Dentistry", 'shop=beauty': "Beauty & aesthetics",
    'leisure=spa': "Spas & wellness", 'shop=hairdresser': "Salons",
    'amenity=clinic': "Clinics", 'office=lawyer': "Legal",
    'office=financial_advisor': "Wealth management", 'shop=interior_decoration': "Interior design",
    'shop=boutique': "Boutique retail", 'shop=tailor': "Tailoring",
    'shop=art': "Art & galleries", 'office=architect': "Architecture",
    'shop=furniture': "Furniture", 'shop=optician': "Optical",
    # niche trades
    'shop=antiques': "Antiques", 'craft=goldsmith': "Goldsmiths",
    'craft=jeweller': "Goldsmiths", 'shop=perfumery': "Perfumery",
    'shop=wine': "Fine wine", 'shop=chocolate': "Chocolatiers",
    'shop=musical_instrument': "Instruments", 'craft=piano_tuner': "Instruments",
    'shop=shoes': "Footwear", 'craft=shoemaker': "Footwear",
    'shop=leather': "Leather goods", 'shop=bag': "Leather goods",
    'shop=fabric': "Fabric & textiles", 'craft=upholsterer': "Upholstery",
    'craft=carpenter': "Joinery", 'craft=stonemason': "Stonemasonry",
    'shop=kitchen': "Kitchens", 'shop=bathroom_furnishing': "Bathrooms",
    'shop=carpet': "Rugs & carpets", 'shop=frame': "Framing",
    'shop=hifi': "Audio", 'shop=camera': "Photographic",
    'craft=photographer': "Photography", 'shop=florist': "Florists",
    'shop=garden_centre': "Landscaping", 'craft=gardener': "Landscaping",
    'shop=swimming_pool': "Pools", 'craft=hvac': "Climate control",
    'office=insurance': "Insurance", 'office=accountant': "Accountancy",
    'office=notary': "Notaries", 'office=tax_advisor': "Tax advisory",
    'office=travel_agent': "Travel", 'amenity=veterinary': "Veterinary",
    'leisure=fitness_centre': "Fitness", 'shop=cosmetics': "Cosmetics",
    'shop=herbalist': "Herbal & supplements", 'shop=hearing_aids': "Audiology",
    'shop=medical_supply': "Medical supply", 'shop=bicycle': "Cycling",
    'shop=outdoor': "Outdoor & field sports", 'shop=gift': "Gifting",
    'shop=deli': "Fine food", 'shop=cheese': "Fine food",
    'shop=security': "Security", 'shop=locksmith': "Security",
}

BAD_HOST = re.compile(
    r"(facebook|instagram|twitter|x\.com|linkedin|tiktok|youtube|wa\.me|whatsapp"
    r"|google\.|goo\.gl|bit\.ly|linktr\.ee|yelp\.|tripadvisor|booksy|treatwell"
    r"|fresha|squareup|wixsite|business\.site|weebly|blogspot|wordpress\.com)", re.I)


def query(bbox, attempt=0):
    """One request per city covering every trade.

    Per-trade queries meant 3,072 requests and Overpass rate-limited immediately,
    which is fair — it is a free shared service. A union selector gets the same
    data in 48 requests.
    """
    sel = ""
    for tag in TAGS:
        key, _, vals = tag.partition("=")
        for v in vals.split(";"):
            for kind in ("node", "way"):
                sel += f'{kind}["{key}"="{v}"]["website"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});'
    q = f"[out:json][timeout:180];({sel});out tags;"
    endpoint = OVERPASS[attempt % len(OVERPASS)]
    req = urllib.request.Request(
        endpoint, data=urllib.parse.urlencode({"data": q}).encode(),
        headers={"User-Agent": "TinyStudio-market-study/1.0 (research; contact via tinystudio.io)"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        return json.load(resp).get("elements", [])


def industry_of(tags):
    """Derive our label from whichever selector the element matched."""
    for tag, label in TAGS.items():
        key, _, vals = tag.partition("=")
        if tags.get(key) in vals.split(";"):
            return label
    return None


def clean(url):
    url = (url or "").strip()
    if not url:
        return None
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    try:
        p = urllib.parse.urlparse(url)
    except ValueError:
        return None
    if p.scheme not in ("http", "https") or "." not in p.netloc:
        return None
    if BAD_HOST.search(p.netloc):        # aggregators and socials are not the business's own site
        return None
    return f"{p.scheme}://{p.netloc}"    # homepage only — the study is about homepages


def main():
    dry = "--dry-run" in sys.argv
    corpus = json.load(open(CORPUS))
    seen = {c["url"].split("//")[1].split("/")[0].replace("www.", "").lower() for c in corpus}
    added, per_city = [], {}

    for city, bbox in CITIES.items():
        elements = []
        for attempt in range(3):
            try:
                elements = query(bbox, attempt)
                break
            except Exception as exc:
                print(f"  ! {city} attempt {attempt + 1}: {str(exc)[:50]}", file=sys.stderr, flush=True)
                time.sleep(20 * (attempt + 1))
        for el in elements:
            tags = el.get("tags", {})
            industry = industry_of(tags)
            url = clean(tags.get("website"))
            if not (industry and url):
                continue
            host = url.split("//")[1].replace("www.", "").lower()
            if host in seen:
                continue
            seen.add(host)
            added.append({"industry": industry, "geo": city, "url": url})
            per_city[city] = per_city.get(city, 0) + 1
        print(f"  {city}: +{per_city.get(city, 0)}", flush=True)
        time.sleep(8)               # one polite pause per city, not per trade

    print(f"\n{len(added)} new sites · corpus {len(corpus)} -> {len(corpus) + len(added)}")
    if not dry:
        json.dump(corpus + added, open(CORPUS, "w"), indent=1)
        print("corpus.json written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
