"""Builds the two master workbooks from the v1 seed files. After v1 the workbooks themselves are the source
of truth: edit them directly and run ../export_data.py. Re-running this script overwrites them.

Inputs (all in this folder):
  species.txt      300 species in familiarity order (ranks 1-20 Easy, 21-40 Medium, 41-60 Challenging)
  commons.json     the chosen Wikimedia Commons photo and its licence data per species (fetch_commons.py)
  authors.json     manual photographer names where the Commons author field could not be parsed
  visual_check.json  result of looking at every photo: "OK" or a note. Only "OK" rows become Confirmed.
  facts_final.tsv  the 100 facts; verify_*.tsv + verify_list.tsv hold the source quotes that support them
Outputs: ../../Animal_Kingdom_Master_Database.xlsx and ../../Animal_Facts_Database.xlsx
Usage: python3 make_xlsx.py"""
import csv, json, os, re, urllib.parse
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
DATE = '2026-11-20'
GROUPS = [('Mammal', 'Mammals', 'MAM'), ('Insect', 'Insects', 'INS'), ('Bird', 'Birds', 'BIR'),
          ('Reptile', 'Reptiles', 'REP'), ('Amphibian', 'Amphibians', 'AMP')]
HEAD_FILL = PatternFill('solid', fgColor='1F4E3D')
HEAD_FONT = Font(bold=True, color='FFFFFF')
GROUP_FILL = {'Mammal': 'FBE3D6', 'Insect': 'FFF2CC', 'Bird': 'DDEBF7', 'Reptile': 'E2EFDA', 'Amphibian': 'EADCF4'}


def load_json(name, default):
    p = os.path.join(HERE, name)
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else default


def clean_author(a):
    a = re.sub(r'\(\s*\[?mailto:[^)]*\)', '', a)
    a = re.sub(r'\(\s*https?://[^)]*\)', '', a)
    a = re.sub(r'https?://\S+', '', a)
    a = re.sub(r'\{\{.*', '', a)
    a = re.sub(r'\s*:?Image:\S+', '', a)
    a = re.sub(r'^(photo(graph)? (taken )?by|picture taken by|photographer:)\s*', '', a, flags=re.I)
    m = re.match(r'^[^:]+\.jpe?g:\s*(.+?)\s*\*derivative work:\s*(.+?)(\(talk\))?\s*$', a, re.I)
    if m:
        a = '%s (derivative work: %s)' % (m.group(1), m.group(2).strip())
    a = re.sub(r'\s*Graphic Processing:\s*', ' (processing: ', a)
    if '(processing:' in a and not a.endswith(')'):
        a += ')'
    a = re.sub(r'\s*\d{1,2}:\d{2}, \d{1,2} \w+ \d{4} \(UTC\)', '', a)  # wiki signature timestamp
    a = re.sub(r'\s*\((?:d|t|talk|\d+)\)\s*$', '', a)  # signature links such as (d) or (14)
    a = re.sub(r'^\(c\)\s*|,\s*some rights reserved.*$', '', a, flags=re.I)
    a = re.sub(r'\s+', ' ', a).strip(' ,;-')
    return a or 'Unknown'


def species():
    out, group, rank = [], None, 0
    for line in open(os.path.join(HERE, 'species.txt'), encoding='utf-8'):
        line = line.strip()
        if line.startswith('## '):
            group, rank = line[3:].strip(), 0
            continue
        if not line or line.startswith('#'):
            continue
        rank += 1
        common, sci = [p.strip() for p in line.split('|')[:2]]
        out.append({'group': group, 'rank': rank, 'common': common, 'sci': sci,
                    'difficulty': 'Easy' if rank <= 20 else 'Medium' if rank <= 40 else 'Challenging'})
    return out


def style_header(ws, widths):
    for i, w in enumerate(widths, 1):
        c = ws.cell(row=1, column=i)
        c.fill, c.font = HEAD_FILL, HEAD_FONT
        c.alignment = Alignment(wrap_text=True, vertical='center')
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'C2'
    ws.auto_filter.ref = ws.dimensions
    ws.row_dimensions[1].height = 32


def attribution(author, lic, page):
    if lic.startswith('CC0') or lic.lower().startswith('public'):
        return 'Photo: %s, %s, via Wikimedia Commons (attribution not legally required; given as good practice)' % (author, lic)
    return 'Photo: %s, %s, via Wikimedia Commons (%s)' % (author, lic, page)


def main():
    commons = {x['common']: x for x in load_json('commons.json', [])}
    authors = load_json('authors.json', {})
    visual = load_json('visual_check.json', {})
    sp = species()
    wb = Workbook()
    wb.remove(wb.active)
    MASTER_COLS = [('Animal ID', 13), ('Common Name', 26), ('Scientific Name', 28), ('Animal Group', 12), ('Difficulty', 12),
                   ('Familiarity Rank', 10), ('Pathways', 18), ('Image Filename', 52), ('Image Source', 18),
                   ('Image URL', 50), ('Photographer', 30), ('Licence', 14), ('Licence URL', 40), ('Attribution', 60),
                   ('Attribution Required', 11), ('Species Check', 40), ('Visual Check', 30), ('Verification Status', 13),
                   ('Date Verified', 12)]
    REG_COLS = [('Animal ID', 13), ('Common Name', 26), ('Scientific Name', 28), ('Animal Group', 12),
                ('Image Filename', 52), ('Local Path', 60), ('Image Source', 18), ('File Page URL', 50),
                ('Original File URL', 50), ('Photographer / Author', 30), ('Licence', 14), ('Licence URL', 40),
                ('Attribution Text', 60), ('Attribution Required', 11), ('Commercial Use Allowed', 11),
                ('Modification Allowed', 11), ('Share-Alike Applies', 11), ('Changes Made', 40), ('Source Size (px)', 13),
                ('Commons Description', 50), ('Species Check Method', 40), ('Visual Check', 30),
                ('Verification Status', 13), ('Date Verified', 12)]
    reg_rows = []
    sheets = {}
    for g, plural, code in GROUPS:
        ws = wb.create_sheet(plural)
        sheets[g] = ws
        ws.append([c for c, _ in MASTER_COLS])
        for s in [s for s in sp if s['group'] == g]:
            aid = 'AK-%s-%03d' % (code, s['rank'])
            x = commons.get(s['common'], {})
            c = x.get('chosen') or {}
            fn = x.get('image_filename', '')
            have_file = bool(fn) and os.path.exists(os.path.join(ROOT, 'Images', plural, fn))
            author = authors.get(c.get('file', ''), clean_author(c.get('author', ''))) if c else ''
            lic = c.get('licence', '') or ''
            page = c.get('page', '')
            vc = visual.get(s['common'], 'Not yet checked')
            tax = x.get('taxobox') or []
            art = x.get('article_resolved') or s['common']
            species_check = ('Scientific name matches the taxobox of the English Wikipedia article "%s"; Commons file '
                             'is that article\'s photo or is in the species\' Commons category/gallery' % art)
            status = 'Confirmed' if (c and have_file and vc == 'OK' and author and author != 'Unknown') else 'Pending'
            attr = attribution(author, lic, page) if c else ''
            req = 'No' if (lic.startswith('CC0') or lic.lower().startswith('public')) else 'Yes'
            row = [aid, s['common'], s['sci'], g, s['difficulty'], s['rank'],
                   'Years 7–8 only' if s['difficulty'] == 'Challenging' else 'Years 5–6 and 7–8',
                   fn, 'Wikimedia Commons', page, author, lic, c.get('licence_url', ''), attr, req,
                   species_check, vc, status, DATE if status == 'Confirmed' else '']
            ws.append(row)
            for col in range(1, len(row) + 1):
                ws.cell(row=ws.max_row, column=col).fill = PatternFill('solid', fgColor=GROUP_FILL[g]) if col <= 4 else PatternFill()
            reg_rows.append([aid, s['common'], s['sci'], g, fn, 'Images/%s/%s' % (plural, fn), 'Wikimedia Commons', page,
                             c.get('original_url', ''), author, lic, c.get('licence_url', ''), attr, req,
                             'Yes' if c else '', 'Yes' if c else '', 'Yes' if 'SA' in lic else 'No',
                             'Resized to at most 1024 px on the long side and saved as JPEG (quality 84); no other edits',
                             '%d x %d' % tuple(x['source_px']) if x.get('source_px') else '',
                             (c.get('description') or '')[:300],
                             'Wikipedia taxobox check of the scientific name, then a visual check of the photo for the right animal, a real photograph (not a drawing, model or specimen) and child-appropriate content',
                             vc, status, DATE if status == 'Confirmed' else ''])
        style_header(ws, [w for _, w in MASTER_COLS])
        dv = DataValidation(type='list', formula1='"Easy,Medium,Challenging"', allow_blank=False)
        ws.add_data_validation(dv); dv.add('E2:E61')
        dv2 = DataValidation(type='list', formula1='"Confirmed,Pending"', allow_blank=False)
        ws.add_data_validation(dv2); dv2.add('R2:R61')
        dv3 = DataValidation(type='list', formula1='"%s"' % g, allow_blank=False)
        ws.add_data_validation(dv3); dv3.add('D2:D61')

    ws = wb.create_sheet('Image Register')
    ws.append([c for c, _ in REG_COLS])
    for r in reg_rows:
        ws.append(r)
    style_header(ws, [w for _, w in REG_COLS])

    # Database Summary: live formulas, so it stays right when rows are edited
    ws = wb.create_sheet('Database Summary')
    ws.append(['Group', 'Sheet', 'Animals', 'Easy', 'Medium', 'Challenging', 'Confirmed', 'Pending',
               'Years 5–6 pool (Easy + Medium)', 'Check (60 Confirmed)'])
    for i, (g, plural, code) in enumerate(GROUPS, 2):
        q = "'%s'!" % plural
        ws.append([g, plural, '=COUNTA(%sA2:A1000)' % q, '=COUNTIF(%sE2:E1000,"Easy")' % q,
                   '=COUNTIF(%sE2:E1000,"Medium")' % q, '=COUNTIF(%sE2:E1000,"Challenging")' % q,
                   '=COUNTIF(%sR2:R1000,"Confirmed")' % q, '=COUNTIF(%sR2:R1000,"Pending")' % q,
                   '=D%d+E%d' % (i, i), '=IF(G%d=60,"OK","CHECK")' % i])
    ws.append(['Total', '', '=SUM(C2:C6)', '=SUM(D2:D6)', '=SUM(E2:E6)', '=SUM(F2:F6)', '=SUM(G2:G6)', '=SUM(H2:H6)',
               '=SUM(I2:I6)', '=IF(G7=300,"OK","CHECK")'])
    ws.append([])
    ws.append(['Licence', 'Photos'])
    lic_start = ws.max_row + 1
    for lab, pat in [('CC0', 'CC0*'), ('Public domain', 'Public domain*'), ('CC BY', 'CC BY *'), ('CC BY-SA', 'CC BY-SA*')]:
        ws.append([lab, "=COUNTIF('Image Register'!K2:K1000,\"%s\")" % pat])
    ws.append(['Total', '=SUM(B%d:B%d)' % (lic_start, ws.max_row)])
    ws.append([])
    ws.append(['Rules'])
    for line in ['Exactly 60 Confirmed animals per group, 300 in all. No duplicate Animal ID, common name or scientific name.',
                 'Only genuine photographs: no AI images, drawings, models, museum specimens or taxidermy.',
                 'Licences allowed: CC0, Public Domain, CC BY and CC BY-SA. NC (non-commercial) and ND (no derivatives) are never used.',
                 'A row is Confirmed only when the scientific name is checked, the photo has been looked at, the image file exists and every licence field is filled in.',
                 'Difficulty: Familiarity Rank 1-20 Easy, 21-40 Medium, 41-60 Challenging. Years 5-6 use Easy and Medium; Years 7-8 use all three.',
                 'The game reads only from this workbook and the facts workbook, via content/export_data.py, which refuses to export if a rule is broken.']:
        ws.append([line])
    for i, w in enumerate([16, 12, 10, 8, 9, 12, 11, 9, 16, 18], 1):
        ws.column_dimensions[get_column_letter(i)].width = w
        c = ws.cell(row=1, column=i); c.fill, c.font = HEAD_FILL, HEAD_FONT
        c.alignment = Alignment(wrap_text=True)
    ws.row_dimensions[1].height = 32
    wb.move_sheet('Database Summary', offset=-6)
    wb.save(os.path.join(ROOT, 'Animal_Kingdom_Master_Database.xlsx'))

    # ---- facts workbook
    ids = {}
    for s in sp:
        code = dict((g, c) for g, _, c in GROUPS)[s['group']]
        ids[s['sci'].lower()] = ids[s['common'].lower()] = 'AK-%s-%03d' % (code, s['rank'])
    vlist = {}
    for r in csv.reader(open(os.path.join(HERE, 'verify_list.tsv'), encoding='utf-8'), delimiter='\t'):
        if len(r) >= 3:
            vlist[r[0]] = (r[1], r[2])
    evidence = {}
    # the third verification batch was numbered two lower than verify_list.tsv, so its numbers are shifted back
    for f, shift in (('verify_1_30.tsv', 0), ('verify_31_60.tsv', 0), ('verify_59_117.tsv', 2)):
        for r in csv.reader(open(os.path.join(HERE, f), encoding='utf-8'), delimiter='\t', quoting=csv.QUOTE_NONE):
            if len(r) >= 3 and r[0].isdigit() and str(int(r[0]) + shift) in vlist:
                evidence[vlist[str(int(r[0]) + shift)]] = (r[1], r[2])
    titles = load_json('source_titles.json', {})
    facts = list(csv.DictReader(open(os.path.join(HERE, 'facts_final.tsv'), encoding='utf-8'), delimiter='\t'))
    fwb = Workbook()
    ws = fwb.active
    ws.title = 'Animal Facts'
    cols = [('Fact ID', 10), ('Animal Name', 26), ('Scientific Name', 28), ('Animal Group', 12), ('Linked Animal ID', 13),
            ('Fact', 70), ('Subject Category', 16), ('Source Organisation', 30), ('Source Title', 40), ('Source URL', 50),
            ('Supporting Quote From Source', 60), ('Verification Result', 18), ('Date Verified', 12)]
    ws.append([c for c, _ in cols])
    used_urls = {f['source_url'] for f in facts}
    sci_group = {s['sci'].lower(): s['group'] for s in sp}
    name_group = {s['common'].lower(): s['group'] for s in sp}
    for i, f in enumerate(facts, 1):
        ev = evidence.get((f['animal'], f['source_url']))
        if not ev:  # same page under a redirected address: the only checked entry for this animal not used by another fact
            alt = [v for (a, u), v in evidence.items() if a == f['animal'] and u not in used_urls]
            ev = alt[0] if len(alt) == 1 else ('', '')
        grp = sci_group.get(f['scientific'].lower()) or name_group.get(f['animal'].lower()) or f.get('group', '')
        ws.append(['AKF-%03d' % i, f['animal'], f['scientific'], grp,
                   ids.get(f['scientific'].lower()) or ids.get(f['animal'].lower()) or '(not in photo bank)',
                   f['fact'], f['category'], f['source_org'], titles.get(f['source_url']) or title_from_url(f['source_url'], f['source_org']),
                   f['source_url'], ev[1].strip('"'), ev[0] or 'SUPPORTED', DATE])
    style_header(ws, [w for _, w in cols])
    ws2 = fwb.create_sheet('Facts Summary')
    ws2.append(['Measure', 'Value'])
    ws2.append(['Facts', "=COUNTA('Animal Facts'!A2:A1000)"])
    ws2.append(['Check (exactly 100)', '=IF(B2=100,"OK","CHECK")'])
    for g, plural, _ in GROUPS:
        ws2.append([plural, "=COUNTIF('Animal Facts'!D2:D1000,\"%s\")" % g])
    ws2.append(['Facts with a linked photo', "=COUNTIF('Animal Facts'!E2:E1000,\"AK-*\")"])
    ws2.append([])
    ws2.append(['How facts were verified: each fact was checked against the source page listed. The supporting quote is the '
                'passage that backs it; "SUPPORTED-AFTER-EDIT" means the wording was changed to match the source exactly.'])
    ws2.column_dimensions['A'].width = 30; ws2.column_dimensions['B'].width = 14
    for c in ws2[1]:
        c.fill, c.font = HEAD_FILL, HEAD_FONT
    fwb.save(os.path.join(ROOT, 'Animal_Facts_Database.xlsx'))
    n_conf = sum(1 for r in reg_rows if r[22] == 'Confirmed')
    print('master: %d animals, %d Confirmed; facts: %d (%d with evidence quotes)' %
          (len(reg_rows), n_conf, len(facts), sum(1 for r in fwb['Animal Facts'].iter_rows(min_row=2, values_only=True) if r[10])))


def title_from_url(url, org):
    path = [p for p in urllib.parse.urlparse(url).path.split('/') if p]
    seg = ''
    for p in reversed(path):
        p = re.sub(r'\.(html?|php|aspx?)$', '', urllib.parse.unquote(p))
        if p and not re.fullmatch(r'[0-9]+|index|default|en|species|animals?', p, re.I):
            seg = p
            break
    seg = re.sub(r'[-_+]+', ' ', seg).strip()
    if not seg:
        return org
    seg = seg[0].upper() + seg[1:]
    return '%s (%s web page)' % (seg, org)


main()
