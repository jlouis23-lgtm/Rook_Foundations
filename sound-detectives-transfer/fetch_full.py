#!/usr/bin/env python3
"""Run on a machine with ordinary internet access (Louis's Mac), next to selected.json.
For every approved photo: re-check its licence at the source, then download the original (or a 1600px rendition)
and shrink it to at most 1600px with sips. Output: full/<KEY>.jpg and register.json (verified licence facts + date).
Resumable: rerun to continue. A photo whose licence no longer passes is recorded with status "rejected" and not downloaded."""
import json, os, re, sys, time, html, hashlib, subprocess, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date
HERE = os.path.dirname(os.path.abspath(__file__))
UA = "EduPhotoSurvey/1.0 (educational image licence survey)"
FULL = os.path.join(HERE, "full"); os.makedirs(FULL, exist_ok=True)
REG = os.path.join(HERE, "register.json")

def fetch(url, binary=False, tries=5):
    err = None
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                b = r.read(); return b if binary else json.loads(b)
        except Exception as e:
            err = e; time.sleep([3, 8, 20, 40, 60][i])
    print("FAIL", err, url[:140], file=sys.stderr, flush=True); return None

def strip(s): return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()

def ok_licence(short):
    s = " " + (short or "").lower().replace("-", " ") + " "
    if any(x in s for x in (" sa ", " nc ", " nd ", "share", "noncommercial", "noderiv", "gfdl", "fair use")): return False
    return s.strip().startswith("cc0") or "public domain" in s or s.strip().startswith("pd") or bool(re.match(r"\s*cc by \d", s))

def check(key, c):
    rec = dict(key=key, source=c["src"], page=c["page"], title=c.get("title", ""), checked=date.today().isoformat())
    if c["src"] == "wikimedia":
        t = c["title"] if c["title"].startswith("File:") else "File:" + c["title"]
        d = fetch("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|sha1|extmetadata"
                  "&iiurlwidth=1600&iiextmetadatafilter=LicenseShortName|LicenseUrl|Artist|Credit|UsageTerms|AttributionRequired|Restrictions"
                  "&titles=" + urllib.parse.quote(t))
        if not d: return dict(rec, status="error", why="no API answer")
        p = next(iter(d["query"]["pages"].values())); ii = (p.get("imageinfo") or [None])[0]
        if not ii: return dict(rec, status="rejected", why="file missing")
        em = ii.get("extmetadata", {}); g = lambda k: strip(em.get(k, {}).get("value"))
        rec.update(licence=g("LicenseShortName"), licence_url=g("LicenseUrl"), creator=g("Artist")[:200], credit=g("Credit")[:300],
                   attribution_required=g("AttributionRequired"), restrictions=g("Restrictions"), w=ii.get("width"), h=ii.get("height"),
                   download_url=(ii.get("thumburl") if (ii.get("width") or 0) > 1600 else ii.get("url")))
    else:
        d = fetch("https://api.openverse.org/v1/images/%s/" % c["ov_id"])
        if not d: return dict(rec, status="error", why="no API answer")
        lic = {"cc0": "CC0 1.0", "pdm": "Public Domain Mark 1.0"}.get(d["license"], "CC BY %s" % d.get("license_version") if d["license"] == "by" else d["license"])
        rec.update(licence=lic, licence_url=d.get("license_url"), creator=d.get("creator") or "", creator_url=d.get("creator_url"),
                   w=d.get("width"), h=d.get("height"), download_url=c["file_url"], openverse_id=c["ov_id"])
    if not ok_licence(rec["licence"]): return dict(rec, status="rejected", why="licence now " + str(rec["licence"]))
    if rec.get("restrictions"): rec["note"] = "restrictions field: " + rec["restrictions"]
    return rec

def work(item):
    key, c = item
    out = os.path.join(FULL, key + ".jpg")
    rec = check(key, c)
    if rec.get("status") in ("rejected", "error"): return rec
    b = fetch(rec["download_url"], binary=True)
    if not b: return dict(rec, status="error", why="download failed")
    tmp = out + ".tmp"; open(tmp, "wb").write(b)
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "90", "-Z", "1600", tmp, "--out", out], capture_output=True)
    os.remove(tmp)
    if not os.path.exists(out): return dict(rec, status="error", why="convert failed")
    rec.update(status="ok", file="full/%s.jpg" % key, sha1=hashlib.sha1(open(out, "rb").read()).hexdigest(), downloaded=date.today().isoformat())
    return rec

def main():
    sel = json.load(open(os.path.join(HERE, "selected.json")))
    reg = json.load(open(REG)) if os.path.exists(REG) else {}
    todo = [(k, c) for k, c in sorted(sel.items()) if reg.get(k, {}).get("status") not in ("ok", "rejected")]
    print(len(sel), "selected,", len(todo), "to do", flush=True)
    with ThreadPoolExecutor(4) as ex:
        for i, rec in enumerate(ex.map(work, todo)):
            reg[rec["key"]] = rec
            if i % 10 == 9: json.dump(reg, open(REG, "w"), indent=1); print(i + 1, "done", flush=True)
            time.sleep(0.3)
    json.dump(reg, open(REG, "w"), indent=1)
    from collections import Counter
    print("finished", Counter(r.get("status") for r in reg.values()))

if __name__ == "__main__":
    main()
