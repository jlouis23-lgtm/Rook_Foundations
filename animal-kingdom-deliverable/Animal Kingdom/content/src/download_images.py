"""Step 3 of photo sourcing (v1 seed only). Downloads each chosen Commons photo (1280 px thumbnail, or the
original when it is smaller), resizes it to at most 1024 px on the long side, saves it as a JPEG in
../../Images/<Group plural>/<group>_<common>_<scientific>.jpg and writes contact sheets for the visual check.
Usage: python3 download_images.py [--sheets-only] [--from-raw DIR]"""
import json, os, re, sys, time, io, urllib.request, unicodedata
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
# Wikimedia asks bulk downloaders to give a contact. It comes from the AK_CONTACT environment variable, never stored here.
UA = 'FiniteGamesImageFetcher/1.0 (educational game; contact: %s)' % os.environ.get('AK_CONTACT', 'none given')
PLURAL = {'Mammal': 'Mammals', 'Insect': 'Insects', 'Bird': 'Birds', 'Reptile': 'Reptiles', 'Amphibian': 'Amphibians'}
SHEETS = os.path.join(HERE, 'sheets')
RAW_FROM = sys.argv[sys.argv.index('--from-raw') + 1] if '--from-raw' in sys.argv else None
RAWDIR = os.path.join(HERE, 'raw_downloads')
os.makedirs(SHEETS, exist_ok=True); os.makedirs(RAWDIR, exist_ok=True)


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r'\(.*?\)', '', s)
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')


def filename(x):
    return '%s_%s_%s.jpg' % (x['group'].lower(), slug(x['common']), slug(x['sci']))


def fetch_one(url):
    """curl is used because Wikimedia throttled Python's urllib far harder than curl for the same requests."""
    import subprocess
    r = subprocess.run(['curl', '-s', '-L', '-A', UA, '-w', '\n%{http_code}', url], capture_output=True, timeout=180)
    body, _, code = r.stdout.rpartition(b'\n')
    code = int(code or 0)
    return (body, 200) if code == 200 and len(body) > 5000 else (None, code)


def fetch_image(c):
    """Polite fetch: the 960 px standard thumbnail first, then 1280 px, then the original. On HTTP 429 it waits
    a full minute (longer each time) before the next request, so the whole run stays under Wikimedia's limits."""
    t = c['thumb_url']
    urls = [t.replace('/1280px-', '/960px-'), t, c['original_url']]
    for rnd in range(12):
        for u in urls:
            b, code = fetch_one(u)
            if b:
                return b
            print('miss', rnd, code, u[-70:], file=sys.stderr)
            if code == 429:
                time.sleep(min(600, 120 * (1 + rnd)))
                break  # retry the same preferred size after the pause
            time.sleep(3)
    return None


def main():
    sp = json.load(open(os.path.join(HERE, 'commons.json')))
    for x in sp:
        c = x.get('chosen')
        if not c:
            continue
        fn = filename(x)
        x['image_filename'] = fn
        dest = os.path.join(ROOT, 'Images', PLURAL[x['group']], fn)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        marker = os.path.join(RAWDIR, fn + '.src')
        if '--sheets-only' in sys.argv or (os.path.exists(dest) and os.path.exists(marker) and open(marker).read() == c['file']):
            continue
        b = None
        if RAW_FROM:  # photos fetched elsewhere (e.g. on Louis's Mac) into RAW_FROM/<Group plural>/<file>
            rp = os.path.join(RAW_FROM, PLURAL[x['group']], fn)
            b = open(rp, 'rb').read() if os.path.exists(rp) else None
        else:
            b = fetch_image(c)
        if not b:
            print('FAILED', x['common'], file=sys.stderr)
            continue
        im = Image.open(io.BytesIO(b))
        im = ImageOps.exif_transpose(im).convert('RGB')
        x['source_px'] = list(im.size)
        im.thumbnail((1024, 1024), Image.LANCZOS)
        im.save(dest, 'JPEG', quality=84, optimize=True, progressive=True)
        open(marker, 'w').write(c['file'])
        print('saved', fn, im.size, file=sys.stderr)
        time.sleep(4)
    json.dump(sp, open(os.path.join(HERE, 'commons.json'), 'w'), indent=1, ensure_ascii=False)
    # contact sheets: 20 per sheet, labelled with group, rank, name and scientific name
    font = ImageFont.load_default()
    items = [x for x in sp if x.get('chosen')]
    for k in range(0, len(items), 20):
        sheet = Image.new('RGB', (5 * 260, 4 * 250), 'white')
        d = ImageDraw.Draw(sheet)
        for i, x in enumerate(items[k:k + 20]):
            p = os.path.join(ROOT, 'Images', PLURAL[x['group']], x['image_filename'])
            if not os.path.exists(p):
                continue
            im = Image.open(p); im.thumbnail((250, 205))
            ox, oy = (i % 5) * 260 + 5, (i // 5) * 250 + 5
            sheet.paste(im, (ox, oy))
            d.text((ox, oy + 208), '%d. %s %d %s' % (k + i + 1, x['group'][:3], x['rank'], x['common'])[:42], fill='black', font=font)
            d.text((ox, oy + 222), x['sci'][:40], fill='black', font=font)
        sheet.save(os.path.join(SHEETS, 'sheet_%02d.jpg' % (k // 20 + 1)), quality=80)


main()
