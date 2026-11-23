"""Step 1 of photo sourcing (v1 seed only). Reads species.txt, fetches each English Wikipedia article's
wikitext (batched, throttled), checks the article's taxobox names the same species, and records the
infobox lead image. Writes wiki.json. Usage: python3 fetch_wiki.py"""
import json, os, re, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'EduGameImageFetcher/1.0 (one-off educational image licensing check)'
API = 'https://en.wikipedia.org/w/api.php'


CACHE = os.path.join(HERE, 'cache')
os.makedirs(CACHE, exist_ok=True)


def get(url, params):
    q = url + '?' + urllib.parse.urlencode(params)
    import hashlib
    cf = os.path.join(CACHE, hashlib.md5(q.encode()).hexdigest() + '.json')
    if os.path.exists(cf):
        return json.load(open(cf))
    for attempt in range(12):
        req = urllib.request.Request(q, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                raw = r.read()
                if r.headers.get('Content-Encoding') == 'gzip':
                    import gzip
                    raw = gzip.decompress(raw)
                d = json.loads(raw)
                json.dump(d, open(cf, 'w'))
                return d
        except Exception as e:
            print('retry', attempt, e, file=sys.stderr)
            time.sleep(30 * (attempt + 1))
    raise SystemExit('failed ' + q)


def load_species():
    out, group = [], None
    for line in open(os.path.join(HERE, 'species.txt'), encoding='utf-8'):
        line = line.strip()
        if not line or line.startswith('# '):
            continue
        if line.startswith('## '):
            group, rank = line[3:], 0
            continue
        parts = [p.strip() for p in line.split('|')]
        rank += 1
        out.append({'group': group, 'rank': rank, 'common': parts[0], 'sci': parts[1],
                    'article': parts[2] if len(parts) > 2 and parts[2] else parts[0]})
    return out


def taxo(text):
    """Return a set of candidate binomials stated by the article's taxobox."""
    names = set()
    g = re.search(r'\|\s*genus\s*=\s*([^\n|}]+)', text)
    s = re.search(r'\|\s*species\s*=\s*([^\n|}]+)', text)
    if g and s:
        names.add((g.group(1).strip() + ' ' + s.group(1).strip()))
    t = re.search(r'\|\s*taxon\s*=\s*([^\n|}]+)', text)
    if t:
        names.add(t.group(1).strip())
    b = re.search(r'\|\s*binomial\s*=\s*([^\n|}]+)', text)
    if b:
        names.add(b.group(1).strip())
    t2 = re.search(r'\|\s*trinomial\s*=\s*([^\n|}]+)', text)
    if t2:
        names.add(t2.group(1).strip())
    clean = set()
    for n in names:
        n = re.sub(r"[\[\]'{}]|<[^>]+>", '', n).strip()
        clean.add(n)
    return clean


def lead_image(text):
    m = re.search(r'\|\s*image\s*=\s*([^\n|]+)', text)
    if not m:
        return None
    v = re.sub(r'<!--.*', '', m.group(1)).strip()
    v = re.sub(r'^\[\[(File|Image):', '', v).split('|')[0].strip()
    v = re.sub(r'^(File|Image):', '', v)
    return v or None


def raw(title):
    import hashlib, gzip
    url = 'https://en.wikipedia.org/w/index.php?' + urllib.parse.urlencode({'title': title, 'action': 'raw'})
    cf = os.path.join(CACHE, 'raw_' + hashlib.md5(url.encode()).hexdigest() + '.txt')
    if os.path.exists(cf):
        return open(cf, encoding='utf-8').read()
    for attempt in range(12):
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                b = r.read()
                if r.headers.get('Content-Encoding') == 'gzip':
                    b = gzip.decompress(b)
                t = b.decode('utf-8')
                open(cf, 'w', encoding='utf-8').write(t)
                time.sleep(1.5)
                return t
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            print('retry', attempt, title, e, file=sys.stderr)
            time.sleep(20 * (attempt + 1))
        except Exception as e:
            print('retry', attempt, title, e, file=sys.stderr)
            time.sleep(20 * (attempt + 1))
    return None


def main():
    sp = load_species()
    for x in sp:
        t = x['article']
        text = raw(t)
        for _ in range(3):
            m = re.match(r'#REDIRECT\s*\[\[([^\]#|]+)', text or '', re.I)
            if not m:
                break
            t = m.group(1).strip()
            text = raw(t)
        if not text:
            x['error'] = 'no article'
            continue
        x['article_resolved'] = t
        x['taxobox'] = sorted(taxo(text))
        x['lead_image'] = lead_image(text)
        x['other_images'] = list(dict.fromkeys(re.findall(r'(?:File|Image):([^|\]\n]+\.(?:jpe?g|JPE?G))', text)))[:25]
    json.dump(sp, open(os.path.join(HERE, 'wiki.json'), 'w'), indent=1, ensure_ascii=False)
    for x in sp:
        ok = any(x['sci'].lower() == n.lower() for n in x.get('taxobox', []))
        if not ok or not x.get('lead_image'):
            print(x['group'], x['rank'], x['common'], '|', x['sci'], '| taxobox', x.get('taxobox'), '| img', x.get('lead_image'), x.get('error', ''))


main()
