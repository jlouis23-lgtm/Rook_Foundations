"""Animal Kingdom photo download, run on Louis's Mac (the cloud machine is throttled by Wikimedia).
Downloads each photo in manifest.json (960 px Wikimedia thumbnail, else 1280 px, else the original) into
raw/<Group>/<file>. Large originals are shrunk with macOS `sips`. Standard library only.
Usage: python3 fetch_photos.py"""
import json, os, subprocess, sys, time, urllib.request, urllib.error
HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'FiniteGamesImageFetcher/1.0 (educational game photo download)'
items = json.load(open(os.path.join(HERE, 'manifest.json'), encoding='utf-8'))
ok = fail = 0
for i, it in enumerate(items, 1):
    dest = os.path.join(HERE, 'raw', it['folder'], it['file'])
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 10000:
        ok += 1; continue
    data = None
    for attempt in range(4):
        for u in it['urls']:
            try:
                with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=120) as r:
                    data = r.read(); break
            except urllib.error.HTTPError as e:
                if e.code == 429: time.sleep(20 * (attempt + 1)); break
            except Exception:
                time.sleep(3)
        if data: break
    if not data:
        print('FAILED', it['file'], flush=True); fail += 1; continue
    open(dest, 'wb').write(data)
    if len(data) > 1500000:  # an original: shrink so the long side is 1280 px
        subprocess.run(['sips', '-Z', '1280', dest], capture_output=True)
    ok += 1
    print('%d/%d %s' % (i, len(items), it['file']), flush=True)
    time.sleep(1)
print('DONE ok=%d failed=%d' % (ok, fail))
