"""Helper: lists image files named on a Commons gallery page (raw wikitext). Usage: python3 gallery.py "Page name" ..."""
import sys, re, urllib.parse, urllib.request
UA = 'EduGameImageFetcher/1.0 (one-off educational image licensing check)'
for p in sys.argv[1:]:
    url = 'https://commons.wikimedia.org/w/index.php?' + urllib.parse.urlencode({'title': p, 'action': 'raw'})
    try:
        t = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read().decode()
    except Exception as e:
        print('##', p, 'ERR', e); continue
    files = re.findall(r'(?:^|\n|\[\[)(?:File|Image):\s*([^|\]\n]+\.(?:jpe?g|JPE?G))', t)
    print('##', p, len(files))
    for f in files[:40]: print('  ', f.strip())
