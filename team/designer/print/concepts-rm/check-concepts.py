#!/usr/bin/env python3
"""The checks on the RiskMandate card concepts, from checks.json (written by make-concepts.py) and the files themselves.

    python -I team/designer/print/concepts-rm/check-concepts.py     (needs zxing-cpp and pillow, in a scratch venv)

Copy against data/design.json; each QR decoded from the rendered back PNG and its path bytes compared with
team/designer/qr/qr-meet-<id>.svg; size and bleed; everything inside the 4 mm safe zone; 7 pt minimum, the name at
10 pt or more; WCAG AA (4.5:1) for every text; one rm-logo group with its clear space free; no live text left in the
print files; no contact detail and no other brand. Exits non-zero on any failure. Apache-2.0. By designer@web-summit.dinis.
"""
import hashlib, json, pathlib, re, sys
import zxingcpp
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[3]
D = {p['id']: p for p in json.load(open(ROOT / 'data/design.json'))['people']}
R = json.load(open(HERE / 'checks.json'))
ROLE = {'dinis': 'Operator: the strategy', 'indi': 'The message and outreach'}
fails, notes = [], []
def check(ok, what):
    (notes if ok else fails).append(('PASS ' if ok else 'FAIL ') + what)

def inside(box, safe, tol=0.01): return box[0] >= safe[0] - tol and box[1] >= safe[1] - tol and box[2] <= safe[2] + tol and box[3] <= safe[3] + tol
def overlap(a, b): return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]

for rel, r in R.items():
    f = HERE / rel; svg = f.read_text(); pid = f.name.split('-')[0]; p = D[pid]; side = 'front' if 'front' in f.name else 'back'
    safe = r['safe']
    check('width="91mm" height="61mm" viewBox="0 0 91 61"' in svg, f'{rel}: 91 x 61 mm with 3 mm bleed')
    check('<text' not in svg, f'{rel}: every letter outlined (no live text)')
    check(svg.count('id="rm-logo"') <= 1, f'{rel}: at most one rm-logo group')
    texts = [i for i in r['items'] if i['role'] != 'placeholder']
    copy = ' '.join(i['text'] for i in texts)
    allowed = {p['name'], ROLE[pid], '“' + p['line'].replace("'", '’') + '”', 'RISK', 'MANDATE', 'Agents with a Mandate',
               'Meet me', 'Book a meeting', 'Talk to my agent', 'web-summit.sgit.ai', f'/meet/{pid}/'}
    lines = [i['text'] for i in texts if i['role'] == 'line']
    joined = ' '.join(lines)
    for i in texts:
        if i['role'] != 'line': check(i['text'] in allowed, f'{rel}: copy "{i["text"]}" is from the brief')
    if lines: check(joined == '“' + p['line'].replace("'", '’') + '”', f'{rel}: the line reads "{joined}"')
    names = [i for i in texts if i['role'] == 'name']
    for n in names: check(n['text'] == p['name'] and n['size_pt'] >= 10, f'{rel}: name "{n["text"]}" at {n["size_pt"]} pt (10 pt or more)')
    small = min(i['size_pt'] for i in texts)
    check(small >= 7, f'{rel}: smallest text {small} pt (7 pt or more)')
    worst = min(texts, key=lambda i: i['contrast'])
    check(worst['contrast'] >= 4.5, f'{rel}: lowest contrast {worst["contrast"]}:1, "{worst["text"]}" {worst["fill"]} on {worst["bg"]} (AA 4.5:1)')
    out = [i['text'] for i in r['items'] if not inside(i['box'], safe)]
    check(not out, f'{rel}: all text inside the safe zone' + (f' (outside: {out})' if out else ''))
    if r['logo']:
        L = r['logo']; box = [L['x'], L['y'], L['x'] + L['size'], L['y'] + L['size']]
        clear = [box[0] - L['clear'], box[1] - L['clear'], box[2] + L['clear'], box[3] + L['clear']]
        check(inside(box, safe), f'{rel}: seal placeholder {L["size"]} mm, {L["variant"]}, inside the safe zone')
        hits = [i['text'] for i in r['items'] if i['role'] != 'placeholder' and overlap(i['box'], clear)]
        rects = [m for m in re.finditer(r'<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="(#[0-9A-Fa-f]{6})"/>', svg)
                 if float(m.group(3)) < 91 or float(m.group(4)) < 61]
        hits += [m.group(5) for m in rects if overlap([float(m.group(1)), float(m.group(2)), float(m.group(1)) + float(m.group(3)), float(m.group(2)) + float(m.group(4))], clear)]
        if r['qr']: hits += ['qr'] if overlap([r['qr']['x'], r['qr']['y'], r['qr']['x'] + r['qr']['panel'], r['qr']['y'] + r['qr']['panel']], clear) else []
        check(not hits and clear[0] >= 3 and clear[1] >= 3 and clear[2] <= 88 and clear[3] <= 58,
              f'{rel}: seal clear space ({L["clear"]} mm each side) free and inside the trim' + (f' (in it: {hits})' if hits else ''))
        check('data-placeholder="true"' in svg and 'RM LOGO' not in svg, f'{rel}: rm-logo is the labelled placeholder (label outlined)')
    if r['qr']:
        q = r['qr']; src = (ROOT / f'team/designer/qr/qr-meet-{pid}.svg').read_text()
        d = re.search(r'<path d="([^"]+)"', src).group(1)
        check(hashlib.sha256(d.encode()).hexdigest() == q['path_sha'] and d in svg, f'{rel}: QR path bytes identical to qr-meet-{pid}.svg')
        code = [q['x'] + 4 * q['module'], q['y'] + 4 * q['module'], q['x'] + q['panel'] - 4 * q['module'], q['y'] + q['panel'] - 4 * q['module']]
        check(q['code'] >= 24 and inside([q['x'], q['y'], q['x'] + q['panel'], q['y'] + q['panel']], safe),
              f'{rel}: QR {q["code"]} mm (module {q["module"]:.3f} mm), panel {q["panel"]:.2f} mm with the quiet zone, inside the safe zone')
        hits = [i['text'] for i in r['items'] if overlap(i['box'], [q['x'], q['y'], q['x'] + q['panel'], q['y'] + q['panel']])]
        check(not hits, f'{rel}: nothing on the QR or its quiet zone')
        png = HERE / rel.replace('.svg', '.png'); img = Image.open(png).convert('L')
        rs = zxingcpp.read_barcodes(img, formats=zxingcpp.BarcodeFormat.QRCode)
        want = f'https://web-summit.sgit.ai/meet/{pid}/'
        check(len(rs) == 1 and rs[0].text == want, f'{rel}: rendered PNG {img.size[0]} x {img.size[1]} decodes to {rs[0].text if rs else None}')
    live = (HERE / rel.replace(f'/{f.name}', f'/live/{f.name}')).read_text()
    words = ' '.join(re.findall(r'<text[^>]*>([^<]*)</text>', live)) + ' ' + ' '.join(re.findall(r'<(?:title|desc)>([^<]*)<', live))
    bad = re.findall(r'@|mailto|tel:|\+\d|\d{3}[ -]?\d{3}|linkedin|twitter|instagram|web summit|websummit|sponsor', words, re.I)
    check(not bad, f'{rel}: no contact detail and no other brand' + (f' (found {bad})' if bad else ''))
    pngs = [HERE / rel.replace('.svg', '.png')]
    for x in pngs: check(Image.open(x).size == (1004, 650), f'{x.relative_to(HERE)}: preview 1004 x 650 px, trim size at 300 dpi, no bleed')

print('\n'.join(notes + fails))
print(f'\n{len(notes)} passed, {len(fails)} failed')
sys.exit(1 if fails else 0)
