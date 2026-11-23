"""Step 2 of photo sourcing (v1 seed only). For each species in wiki.json, looks up candidate photos on
Wikimedia Commons (the article's lead image first, then other JPEGs in the article), reads each file's
licence metadata, and picks the first candidate that passes the rules below. Writes commons.json.

Rules (any failure = try the next candidate):
  - JPEG photograph, at least 800 px wide
  - licence is CC0, Public Domain, CC BY or CC BY-SA (any version). Never NC, ND, GFDL-only or unknown.
  - file categories/description do not suggest an illustration, drawing, painting, museum specimen,
    taxidermy, skeleton, 3D render, map or diagram
Overrides: overrides.json maps "Common name" -> a Commons file name, or a list tried in order, when a manual pick is needed.
Usage: python3 fetch_commons.py"""
import json, os, re, sys, time, urllib.parse, urllib.request, hashlib, gzip

HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'EduGameImageFetcher/1.0 (one-off educational image licensing check)'
API = 'https://commons.wikimedia.org/w/api.php'
CACHE = os.path.join(HERE, 'cache')
BAD_WORDS = re.compile(r'illustrat|drawing|painting|lithograph|engraving|\bplates?\b|specimen|museum|taxiderm|'
                       r'mounted|stuffed|skeleton|skull|render|3d model|\bcgi\b|diagram|\bmap\b|clip ?art|'
                       r'cartoon|sculpture|statue|fossil|pinned|collection of|scan of|book', re.I)
OK_LIC = re.compile(r'^(cc0|cc-zero|public domain|pd|pd-.*|cc[- ]by(-sa)?[- ][0-9.]+.*|cc by(-sa)? [0-9.]+.*)$', re.I)


def get(params):
    q = API + '?' + urllib.parse.urlencode(params)
    cf = os.path.join(CACHE, 'c_' + hashlib.md5(q.encode()).hexdigest() + '.json')
    if os.path.exists(cf):
        return json.load(open(cf))
    for attempt in range(12):
        req = urllib.request.Request(q, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                b = r.read()
                if r.headers.get('Content-Encoding') == 'gzip':
                    b = gzip.decompress(b)
                d = json.loads(b)
                json.dump(d, open(cf, 'w'))
                time.sleep(2)
                return d
        except Exception as e:
            print('retry', attempt, e, file=sys.stderr)
            time.sleep(20 * (attempt + 1))
    raise SystemExit('failed ' + q)


def strip(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html or '')).strip()


LIC_TEMPLATES = [
    (re.compile(r'^(cc-zero|cc0|cc-0)$', re.I), 'CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/', 0),
    (re.compile(r'^(pd-[a-z0-9-]+|public ?domain)$', re.I), 'Public domain', 'https://en.wikipedia.org/wiki/Public_domain', 0),
    (re.compile(r'^cc-by[- ]([0-9.]+)', re.I), 'CC BY {}', 'https://creativecommons.org/licenses/by/{}/', 1),
    (re.compile(r'^cc-by-sa[- ]([0-9.]+)', re.I), 'CC BY-SA {}', 'https://creativecommons.org/licenses/by-sa/{}/', 2),
    (re.compile(r'^cc-by-sa-all$', re.I), 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 2),
]


def raw(title):
    url = 'https://commons.wikimedia.org/w/index.php?' + urllib.parse.urlencode({'title': 'File:' + title, 'action': 'raw'})
    cf = os.path.join(CACHE, 'f_' + hashlib.md5(url.encode()).hexdigest() + '.txt')
    if os.path.exists(cf):
        t = open(cf, encoding='utf-8').read()
        return None if t == '__404__' else t
    for attempt in range(10):
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                b = r.read()
                if r.headers.get('Content-Encoding') == 'gzip':
                    b = gzip.decompress(b)
                t = b.decode('utf-8')
                open(cf, 'w', encoding='utf-8').write(t)
                time.sleep(1.2)
                return t
        except urllib.error.HTTPError as e:
            if e.code == 404:
                open(cf, 'w').write('__404__')
                return None
            print('retry', attempt, title, e, file=sys.stderr)
            time.sleep(15 * (attempt + 1))
        except Exception as e:
            print('retry', attempt, title, e, file=sys.stderr)
            time.sleep(15 * (attempt + 1))
    return None


def wiki_to_text(v):
    v = re.sub(r'<!--.*?-->', '', v, flags=re.S)
    v = re.sub(r'\{\{\s*[Cc]reator:([^}|]+)[^}]*\}\}', r'\1', v)
    v = re.sub(r'\{\{\s*(?:[Uu]ser|[Uu]|[Ff]lickr ?user)[^|}]*\|([^}|]+)[^}]*\}\}', r'\1', v)
    v = re.sub(r'\[\[[^\]|]*\|([^\]]+)\]\]', r'\1', v)
    v = re.sub(r'\[\[(?:User:)?([^\]]+)\]\]', r'\1', v)
    v = re.sub(r'\[(?:https?:)?//\S+\s+([^\]]+)\]', r'\1', v)
    v = re.sub(r'\[(?:https?:)?//\S+\]', '', v)
    v = re.sub(r'\{\{[^{}]*\}\}', '', v)
    v = re.sub(r'<[^>]+>', '', v)
    v = re.sub(r"'{2,}", '', v)
    v = re.sub(r'\s+', ' ', v).strip(' *:;,.-')
    return v


def field(text, name):
    m = re.search(r'\|\s*' + name + r'\s*=(.*?)(?=\n\s*\||\n\}\})', text, re.S | re.I)
    return m.group(1).strip() if m else ''


def parse_file(title, text):
    """Licence, author, categories and description from a Commons file page's wikitext."""
    names = []
    for m in re.finditer(r'\{\{\s*([^{}|]+?)\s*(\|[^{}]*)?\}\}', text):
        n = m.group(1).strip()
        names.append(n)
        if n.lower() in ('self', 'self2') and m.group(2):
            names += [p.strip() for p in m.group(2).split('|')[1:] if '=' not in p]
    expanded = []
    for n in names:  # cc-by-sa-2.5,2.0,1.0 -> each version
        m = re.match(r'^(cc-by(?:-sa)?)-([0-9.,]+)', n, re.I)
        if m:
            expanded += [m.group(1) + '-' + v for v in m.group(2).split(',')]
        else:
            expanded.append(n)
    best = None
    for n in expanded:
        if re.search(r'-nc|-nd|noncommercial', n, re.I):
            continue
        for rx, label, url, rank in LIC_TEMPLATES:
            m = rx.match(n)
            if m:
                ver = m.group(1) if m.groups() else ''
                ver = re.sub(r'[^0-9.]', '', ver)
                cand = (rank, -float(ver or 0), label.format(ver), url.format(ver))
                if best is None or cand < best:
                    best = cand
    cats = re.findall(r'\[\[\s*Category\s*:\s*([^\]|]+)', text, re.I)
    author = wiki_to_text(field(text, 'author') or field(text, 'artist') or field(text, 'photographer'))
    desc = wiki_to_text(field(text, 'description'))[:500]
    source = wiki_to_text(field(text, 'source'))[:200]
    return {'licence': best[2] if best else None, 'licence_url': best[3] if best else None,
            'author': author or 'Unknown', 'categories': cats, 'description': desc, 'source_note': source,
            'templates': expanded[:40]}


def file_urls(title):
    fn = title.replace(' ', '_')
    h = hashlib.md5(fn.encode('utf-8')).hexdigest()
    q = urllib.parse.quote(fn)
    orig = 'https://upload.wikimedia.org/wikipedia/commons/%s/%s/%s' % (h[0], h[:2], q)
    thumb = 'https://upload.wikimedia.org/wikipedia/commons/thumb/%s/%s/%s/1280px-%s' % (h[0], h[:2], q, q)
    return orig, thumb


def judge(title, info):
    if info is None:
        return 'no Commons file page (may be a local non-free file)'
    if not re.search(r'\.(jpe?g|png)$', title, re.I):
        return 'not a JPEG or PNG photo'
    if not info['licence']:
        return 'no accepted licence (templates: %s)' % ', '.join(info['templates'][:8])
    text = ' '.join(info['categories']) + ' ' + info['description'] + ' ' + title
    m = BAD_WORDS.search(text)
    if m:
        return 'looks like non-photo/specimen (%s)' % m.group(0)
    return None


def main():
    sp = json.load(open(os.path.join(HERE, 'wiki.json')))
    ov_path = os.path.join(HERE, 'overrides.json')
    overrides = json.load(open(ov_path)) if os.path.exists(ov_path) else {}
    excluded_path = os.path.join(HERE, 'excluded_files.json')
    excluded = set(json.load(open(excluded_path))) if os.path.exists(excluded_path) else set()
    cands = {}
    for x in sp:
        c = []
        if x['common'] in overrides:
            o = overrides[x['common']]
            c += o if isinstance(o, list) else [o]
        else:
            if x.get('lead_image'):
                c.append(x['lead_image'])
            c += [o for o in x.get('other_images', []) if o not in c]
        c = [t.replace('_', ' ').strip() for t in c]
        c = [t[0].upper() + t[1:] for t in c if t and t not in excluded]
        cands[x['common']] = c[:12]
    for x in sp:
        for t in cands[x['common']]:
            text = raw(t)
            m = re.match(r'\s*#REDIRECT\s*\[\[\s*(?:File|Image):([^\]|]+)', text or '', re.I)
            if m:
                t = m.group(1).strip()
                text = raw(t)
            info = parse_file(t, text) if text is not None else None
            why = judge(t, info)
            if why:
                x.setdefault('rejected', []).append([t, why])
                continue
            orig, thumb = file_urls(t)
            x['chosen'] = dict(info, file=t, page='https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(t.replace(' ', '_')),
                               original_url=orig, thumb_url=thumb)
            break
        print(x['group'], x['common'], '->', x.get('chosen', {}).get('file'), x.get('chosen', {}).get('licence'), file=sys.stderr)
    json.dump(sp, open(os.path.join(HERE, 'commons.json'), 'w'), indent=1, ensure_ascii=False)
    for x in sp:
        if not x.get('chosen'):
            print('NONE', x['group'], x['common'], x.get('rejected'))


main()
