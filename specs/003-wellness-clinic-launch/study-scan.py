import re,json,ssl,urllib.request,concurrent.futures as cf
from html.parser import HTMLParser
ctx=ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE
UA={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'}

SITES={
"Wellness clinics":[("London","https://www.harpalclinic.co.uk/"),("London","https://the-hvn.com/"),
 ("London","https://optimisehealth.com/"),("London","https://www.londoncryo.com/"),("London","https://nuutro.co.uk/"),
 ("London","https://www.thewellnesslondon.com/"),("London","https://www.hum2n.com/"),
 ("New York","https://collagenbar.nyc/pages/longevity"),("New York","https://manhattanmedicalarts.com/longevity-wellness"),
 ("New York","https://www.prefusionhealth.com/"),("New York","https://apollohousenyc.com/"),
 ("New York","https://www.merakiintegrative.com/longevity-protocol"),("New York","https://www.patientsmedical.com/"),
 ("Miami","https://vitaflowfl.com/"),("Miami","https://hallongevity.com/"),("Miami","https://alivemiami.com/"),
 ("Miami","https://neomedicineinstitute.com/"),("Miami","https://alphahormones.com/"),("Miami","https://purehealthmiami.com/")],
"Supercar dealers":[("Dubai","https://f1rstmotors.com/"),("Miami","https://www.premierautomiami.com/exotic-cars/"),
 ("Miami","https://www.limitedspec.com/"),("Miami","https://www.exoticshunter.com/"),("Miami","https://www.thecollection.com/"),
 ("Miami","https://pugachev.miami/"),("Dubai","https://luxurysupercarsdubai.com/"),("Miami","https://prestigeluxuryrentals.com/")],
"Luxury real estate":[("London","https://knightsbridgeprimeproperty.com/"),("London","https://jefferies.london/"),
 ("London","https://www.beauchamp.com/"),("London","https://www.mayfairinternationalrealty.com/"),
 ("London","https://eatonpremier.com/")],
"Cosmetic dentistry":[("London","https://www.77harleystreet.co.uk/"),("London","https://marylebonesmileclinic.co.uk/"),
 ("London","https://harleystreetsmileclinic.co.uk/"),("London","https://prodentalclinic.london/"),
 ("London","https://www.harleystreetdentalandimplantclinic.co.uk/"),("London","https://smilelondon.co.uk/"),
 ("London","https://harleystreetdentalartclinic.com/"),("London","https://harleystreetimplantcentre.co.uk/")],
"Wellness centres & spas":[("London","https://www.thirdspace.london/"),("London","https://www.rebaserecovery.com/"),
 ("London","https://www.comohotels.com/london/como-metropolitan-london/wellness"),
 ("London","https://www.corinthia.com/en-gb/london/spa-at-corinthia-london/"),
 ("London","https://www.bulgarihotels.com/en_US/london/spa-and-fitness/the-bulgari-spa"),
 ("Global","https://www.luxewellnessclub.com/en/")],
"Premium HVAC":[("Miami","https://kleinairconditioning.com/"),("Miami","https://www.ameritempac.com/"),
 ("Miami","https://luxury-cooling.com/"),("Miami","https://acpowercomfort.com/"),("Miami","https://www.miamihvac.net/"),
 ("Miami","https://polluxair.com/miami/"),("Miami","https://centralcomfortairconditioning.com/")],
}

class S(HTMLParser):
    def __init__(s):
        super().__init__(); s.txt=[]; s.skip=0; s.inputs=0
    def handle_starttag(s,t,a):
        d=dict(a)
        if t in ('script','style','noscript'): s.skip+=1
        if t in ('input','select','textarea') and d.get('type','text').lower() not in ('hidden','submit','button'): s.inputs+=1
    def handle_endtag(s,t):
        if t in ('script','style','noscript') and s.skip: s.skip-=1
    def handle_data(s,d):
        if not s.skip: s.txt.append(d)

def scan(item):
    vert,(geo,url)=item
    try:
        html=urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=25,context=ctx).read().decode('utf-8','ignore')
        p=S(); p.feed(html); txt=re.sub(r'\s+',' ',' '.join(p.txt))
        price=len(re.findall(r'[£$€]\s?\d',txt))
        return {"vertical":vert,"geo":geo,"host":url.split('//')[1].split('/')[0].replace('www.',''),
                "ok":True,"words":len(txt.split()),"price":price,
                "faq":bool(re.search(r'frequently asked|FAQ',txt,re.I)),"fields":p.inputs}
    except Exception as e:
        return {"vertical":vert,"geo":geo,"host":url.split('//')[1].split('/')[0],"ok":False,"err":str(e)[:40]}

jobs=[(v,s) for v,lst in SITES.items() for s in lst]
with cf.ThreadPoolExecutor(max_workers=12) as ex: rows=list(ex.map(scan,jobs))
ok=[r for r in rows if r["ok"]]
print(f"ATTEMPTED {len(rows)} · READABLE {len(ok)} · {len(SITES)} verticals · {len(set(r['geo'] for r in ok))} geographies\n")
print(f"{'VERTICAL':26}{'n':>4}{'no price':>10}{'no FAQ':>9}{'max fields':>12}")
for v in SITES:
    g=[r for r in ok if r["vertical"]==v]
    if not g: continue
    print(f"{v:26}{len(g):>4}{sum(1 for r in g if r['price']==0):>10}{sum(1 for r in g if not r['faq']):>9}{max(r['fields'] for r in g):>12}")
print(f"\n{'TOTAL':26}{len(ok):>4}{sum(1 for r in ok if r['price']==0):>10}{sum(1 for r in ok if not r['faq']):>9}{max(r['fields'] for r in ok):>12}")
json.dump(rows,open("luxstudy.json","w"),indent=1)
