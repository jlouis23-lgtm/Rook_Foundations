"""Exports the two master workbooks to content/ak-data.json, which build.js inlines into the game.
The workbooks are the single source of truth: the game has no other question or fact list.

Refuses (exit code 1, nothing written) when a rule is broken, so the game never ships bad data:
  - a missing sheet (Mammals, Insects, Birds, Reptiles, Amphibians, Image Register, Database Summary;
    Animal Facts in the facts workbook)
  - a group without exactly 60 Confirmed animals (use --allow-counts while drafting)
  - a duplicate Animal ID, common name or scientific name anywhere in the bank
  - Animal Group not matching the sheet, Difficulty not Easy/Medium/Challenging, Verification Status
    not Confirmed/Pending, a Confirmed row with an empty photographer/licence/source/image field
  - an image file that does not exist in ../Images/<Group plural>/ or is not named after its group
  - a licence that is not CC0, Public Domain, CC BY or CC BY-SA (NC/ND are refused)
  - not exactly 100 facts, a duplicate fact, or a fact without organisation, URL or date verified
Usage: python3 export_data.py [--allow-counts]
"""
import json, os, re, sys, datetime
from openpyxl import load_workbook

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
MASTER = os.path.join(ROOT, 'Animal_Kingdom_Master_Database.xlsx')
FACTS = os.path.join(ROOT, 'Animal_Facts_Database.xlsx')
ALLOW = '--allow-counts' in sys.argv
GROUPS = [('Mammal', 'Mammals', 'MAMMAL', 'a', 'Mammals have hair or fur and feed their young with milk.'),
          ('Insect', 'Insects', 'INSECT', 'an', 'Insects have six legs and three body parts: head, thorax and abdomen.'),
          ('Bird', 'Birds', 'BIRD', 'a', 'Birds have feathers and a beak, and they lay eggs with hard shells.'),
          ('Reptile', 'Reptiles', 'REPTILE', 'a', 'Reptiles have dry, scaly skin, and most lay eggs on land.'),
          ('Amphibian', 'Amphibians', 'AMPHIBIAN', 'an', 'Amphibians have moist skin and most start life in water, often as tadpoles.')]
OK_LIC = re.compile(r'^(CC0.*|Public domain.*|PD.*|CC BY(-SA)? [0-9.]+.*)$', re.I)
# Words that keep a capital letter inside a sentence ("is actually a Nile crocodile")
PROPER = set('''African American Asian Atlantic Andean Australian Bornean Chinese European Galápagos Greek Indian
Japanese Komodo Malayan Nile West Saharan Texas Panamanian Surinam Lake Titicaca Argentine Vietnamese Iberian Gila
Tasmanian Hercules Goliath Atlas Colorado Canada Amazon Oriental Darwin's Wallace's Jackson's Mexican'''.split())
errors = []


def err(msg):
    errors.append(msg)


def phrase(name):
    words = name.split(' ')
    out = [w if (w in PROPER or w.split('-')[0] in PROPER or w.startswith('(')) else w[0].lower() + w[1:] for w in words]
    s = ' '.join(out)
    s = re.sub(r'\s*\(.*?\)', '', s)  # "peacock (Indian peafowl)" -> "peacock"
    art = 'an' if s[0].lower() in 'aeiou' else 'a'
    return art + ' ' + s


def rows(ws):
    it = ws.iter_rows(values_only=True)
    head = [str(h).strip() if h is not None else '' for h in next(it)]
    for r in it:
        if r is None or all(v is None or str(v).strip() == '' for v in r):
            continue
        yield {head[i]: (r[i] if i < len(r) else None) for i in range(len(head))}


def s(v):
    return '' if v is None else str(v).strip()


def main():
    wb = load_workbook(MASTER, data_only=False)
    for sh in [g[1] for g in GROUPS] + ['Image Register', 'Database Summary']:
        if sh not in wb.sheetnames:
            err('missing sheet ' + sh)
    if errors:
        return
    animals, ids, commons, scis = [], set(), set(), set()
    for g, plural, label, art, explain in GROUPS:
        n = 0
        for r in rows(wb[plural]):
            aid = s(r.get('Animal ID'))
            if not aid:
                continue
            status = s(r.get('Verification Status'))
            if status not in ('Confirmed', 'Pending'):
                err(aid + ' Verification Status must be Confirmed or Pending, not ' + repr(status))
            if s(r.get('Animal Group')) != g:
                err(aid + ' Animal Group is ' + repr(s(r.get('Animal Group'))) + ' but the sheet is ' + plural)
            diff = s(r.get('Difficulty'))
            if diff not in ('Easy', 'Medium', 'Challenging'):
                err(aid + ' bad Difficulty ' + repr(diff))
            for key, seen in (('Animal ID', ids), ('Common Name', commons), ('Scientific Name', scis)):
                v = s(r.get(key)).lower()
                if not v:
                    err(aid + ' empty ' + key)
                elif v in seen:
                    err(aid + ' duplicate ' + key + ': ' + v)
                seen.add(v)
            if status != 'Confirmed':
                continue
            for key in ('Image Filename', 'Image Source', 'Image URL', 'Photographer', 'Licence', 'Licence URL', 'Attribution'):
                if not s(r.get(key)):
                    err(aid + ' Confirmed but ' + key + ' is empty')
            fn = s(r.get('Image Filename'))
            if fn and not fn.startswith(g.lower() + '_'):
                err(aid + ' image name should start with ' + g.lower() + '_: ' + fn)
            if fn and not os.path.exists(os.path.join(ROOT, 'Images', plural, fn)):
                err(aid + ' image file missing: Images/' + plural + '/' + fn)
            lic = s(r.get('Licence'))
            if re.search(r'\bNC\b|\bND\b|non-?commercial|no ?deriv', lic, re.I) or not OK_LIC.match(lic):
                err(aid + ' licence not allowed: ' + lic)
            n += 1
            animals.append({
                'id': aid, 'common': s(r['Common Name']), 'sci': s(r['Scientific Name']), 'group': g,
                'difficulty': diff, 'rank': int(r.get('Familiarity Rank') or 0),
                'phrase': phrase(s(r['Common Name'])),
                'img': 'Images/' + plural + '/' + fn,
                'photographer': s(r['Photographer']), 'licence': lic, 'licenceUrl': s(r['Licence URL']),
                'source': s(r['Image URL']),
            })
        if n != 60 and not ALLOW:
            err('%s has %d Confirmed animals; exactly 60 are required' % (plural, n))

    fwb = load_workbook(FACTS, data_only=False)
    if 'Animal Facts' not in fwb.sheetnames:
        err('facts workbook: missing sheet Animal Facts')
        return
    by_name = {a['common'].lower(): a for a in animals}
    by_sci = {a['sci'].lower(): a for a in animals}
    facts, ftexts, fids = [], set(), set()
    for r in rows(fwb['Animal Facts']):
        fid = s(r.get('Fact ID'))
        if not fid:
            continue
        text = s(r.get('Fact'))
        key = re.sub(r'[^a-z0-9]', '', text.lower())
        if fid in fids:
            err('duplicate Fact ID ' + fid)
        if key in ftexts:
            err(fid + ' duplicate fact text')
        fids.add(fid); ftexts.add(key)
        for k in ('Animal Name', 'Fact', 'Subject Category', 'Source Organisation', 'Source Title', 'Source URL', 'Date Verified'):
            if not s(r.get(k)):
                err(fid + ' empty ' + k)
        if not s(r.get('Source URL')).startswith('http'):
            err(fid + ' Source URL is not a web address')
        a = by_sci.get(s(r.get('Scientific Name')).lower()) or by_name.get(s(r.get('Animal Name')).lower())
        facts.append({'id': fid, 'animal': s(r['Animal Name']), 'sci': s(r.get('Scientific Name')), 'fact': text,
                      'category': s(r['Subject Category']), 'org': s(r['Source Organisation']),
                      'title': s(r['Source Title']), 'url': s(r['Source URL']),
                      'animalId': a['id'] if a else None})
    if len(facts) != 100:
        err('facts workbook has %d facts; exactly 100 are required' % len(facts))
    if errors:
        return
    groups = {g: {'label': label, 'plural': plural, 'article': art, 'explain': explain} for g, plural, label, art, explain in GROUPS}
    out = {'version': datetime.date.today().isoformat(), 'groups': groups, 'animals': animals, 'facts': facts}
    json.dump(out, open(os.path.join(HERE, 'ak-data.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('wrote ak-data.json:', len(animals), 'animals,', len(facts), 'facts')


main()
if errors:
    print('REFUSED - nothing written. %d problem(s):' % len(errors))
    for e in errors[:60]:
        print(' -', e)
    sys.exit(1)
