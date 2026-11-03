#!/usr/bin/env python3
"""The print files for the RiskMandate merch (Web Summit 2026 team), from data/design.json and team/designer/print/final.json.

    python3 team/designer/print/make-print.py        (run from the repository root; needs fontTools and Inter, see below)

For each of the seven: the T-shirt front and back, the hoodie chest and back, and the business card front and back, as
print files at their real size in millimetres, every letter converted to outlines (a printer needs no font), and the
person's QR code (team/designer/qr/qr-meet-<id>.svg, made by make-qr.mjs and read back by two decoders) as a vector, black
on a white panel with its quiet zone. Then render.mjs (Chromium, as in the cloud sessions) makes a PDF of each at exact size
and a 300 dpi PNG with a transparent background of each garment print; a proof per person shows them on the garment colour;
everything goes in one zip for the printers, and content/print.md (the page /print/) is written from the same data.

RiskMandate only (Dinis, 2 November 2026): no sponsor, no other brand, no Web Summit name or logo on anything printed.

Needs: pip install fonttools (a scratch venv is fine), and the Inter font (OFL; /usr/share/fonts/opentype/inter/ in the cloud
sessions, or https://rsms.me/inter/). Apache-2.0. By designer@web-summit.dinis.
"""
import html, json, os, re, subprocess, sys, zipfile
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
HERE = os.path.join(ROOT, 'team/designer/print')
D = json.load(open(os.path.join(ROOT, 'data/design.json')))
F = json.load(open(os.path.join(HERE, 'final.json')))
PEOPLE = {p['id']: p for p in D['people']}
TEES = {t['id']: t for t in D['tees']}
HOODIES = {h['id']: h for h in D['hoodies']}
FONTDIR = os.environ.get('INTER_DIR', '/usr/share/fonts/opentype/inter')
FONTS = {w: TTFont(os.path.join(FONTDIR, f'Inter-{w}.otf')) for w in ['Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black']}
WHITE, BLACK = '#FFFFFF', '#000000'
SITE = 'https://web-summit.sgit.ai'

def cap_height(w):
    f = FONTS[w]; return f['OS/2'].sCapHeight / f['head'].unitsPerEm

def width1(txt, w):  # advance width of a line at a font size of 1
    txt = txt.replace("'", "\u2019"); f = FONTS[w]; cmap = f.getBestCmap(); hm = f['hmtx']
    return sum(hm[cmap.get(ord(c), '.notdef')][0] for c in txt) / f['head'].unitsPerEm

def text(txt, w, size, x, y, fill, anchor='middle'):
    """One line of text as an outlined path; (x, y) is the baseline at the anchor. Apostrophes are set typographic."""
    txt = txt.replace("'", "\u2019")
    f = FONTS[w]; gs = f.getGlyphSet(); cmap = f.getBestCmap(); hm = f['hmtx']; s = size / f['head'].unitsPerEm
    wd = width1(txt, w) * size
    x0 = x - wd / 2 if anchor == 'middle' else x - wd if anchor == 'end' else x
    pen = SVGPathPen(gs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
    cur = 0
    for c in txt:
        n = cmap.get(ord(c), '.notdef')
        gs[n].draw(TransformPen(pen, (s, 0, 0, -s, x0 + cur * s, y)))
        cur += hm[n][0]
    d = pen.getCommands()
    return f'<path d="{d}" fill="{fill}"/>' if d else ''

def fit(lines, w, width, cap):
    return min(cap, width / max(width1(l, w) for l in lines))

def qr(pid, x, y, code_mm):
    """The person's code, vector: a white panel the size of the code and its 4-module quiet zone, black modules."""
    t = open(os.path.join(ROOT, 'team/designer/qr', f'qr-meet-{pid}.svg')).read()
    d = re.search(r'<path d="([^"]+)"', t).group(1); n = int(re.search(r'viewBox="0 0 (\d+)', t).group(1))
    panel = code_mm * n / (n - 8); s = panel / n
    return f'<g transform="translate({x:.2f},{y:.2f}) scale({s:.4f})"><rect width="{n}" height="{n}" fill="{WHITE}"/><path d="{d}" fill="{BLACK}"/></g>', panel

def svg(w, h, body, title, bg=None):
    b = f'<rect x="0" y="0" width="{w:.2f}" height="{h:.2f}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.2f}mm" height="{h:.2f}mm" viewBox="0 0 {w:.2f} {h:.2f}"><title>{html.escape(title)}</title>{b}{body}</svg>\n'

def stack(blocks, width):
    """Blocks top to bottom, centred: each (kind, ...) -> body, height. Kinds: lines, qr, gap."""
    body, y = '', 0.0
    for b in blocks:
        if b[0] == 'gap': y += b[1]; continue
        if b[0] == 'qr':
            g, panel = qr(b[1], (width - b[2] * 37 / 29) / 2, y, b[2]); body += g; y += panel; continue
        _, ls, w, size, fill, lead = b
        ch = cap_height(w) * size
        for i, l in enumerate(ls):
            y += ch if i == 0 else size * lead
            body += text(l, w, size, width / 2, y, fill)
    return body, y

def ink(p): return WHITE if p['ink'].lower() in ('#fff', '#ffffff') else BLACK

def person_parts(pid):
    p = PEOPLE[pid]; fp = next(x for x in F['people'] if x['id'] == pid); t = TEES[fp['tee']]
    front = fp.get('front', t['front']); sub = fp.get('sub', t.get('sub'))
    return p, fp, t, front, sub

def tee_front(pid):
    p, fp, t, front, sub = person_parts(pid); W = F['garments']['tee']['front']['width_mm']; c = ink(p)
    size = fit(front, 'ExtraBold', W, 52)
    blocks = [('lines', front, 'ExtraBold', size, c, 1.12)]
    if sub: blocks += [('gap', size * 0.45), ('lines', [sub], 'Medium', min(size * 0.42, W / width1(sub, 'Medium')), c, 1.2)]
    if 'RISK' not in ''.join(front):  # the name on every front, under the line (T5's line is the name)
        blocks += [('gap', size * 0.75), ('lines', ['RISKMANDATE'], 'Black', 100 / width1('RISKMANDATE', 'Black'), c, 1)]
    body, h = stack(blocks, W)
    return svg(W, h + 1, body, f"{p['first']}: T-shirt front ({fp['tee']}), print {W} mm wide"), W, h + 1

def back_blocks(pid, W, lines, code, c, big_cap):
    p = PEOPLE[pid]; blocks = []
    if lines:
        s = fit(lines, 'ExtraBold', W, big_cap); blocks += [('lines', lines, 'ExtraBold', s, c, 1.12), ('gap', s * 0.6)]
    scan = f"SCAN TO MEET {p['first'].upper()}"
    blocks += [('qr', pid, code), ('gap', 9), ('lines', [scan], 'ExtraBold', min(10, W / width1(scan, 'ExtraBold')), c, 1),
               ('gap', 5), ('lines', ['book a meeting · talk to my agent'], 'Medium', min(6.5, W / width1('book a meeting · talk to my agent', 'Medium')), c, 1),
               ('gap', 12), ('lines', ['RISKMANDATE'], 'Black', (W * 0.55) / width1('RISKMANDATE', 'Black'), c, 1)]
    return blocks

def tee_back(pid):
    p, fp, t, front, sub = person_parts(pid); W = F['garments']['tee']['back']['width_mm']
    body, h = stack(back_blocks(pid, W, t.get('back') if not t.get('chest') else None, F['garments']['tee']['qr_code_mm'], ink(p), 40), W)
    return svg(W, h + 1, body, f"{p['first']}: T-shirt back, print {W} mm wide"), W, h + 1

def hoodie_chest(pid):
    p = PEOPLE[pid]; W = F['garments']['hoodie']['chest']['width_mm']
    body, h = stack([('lines', ['RISKMANDATE'], 'Black', W / width1('RISKMANDATE', 'Black'), ink(p), 1)], W)
    return svg(W, h + 0.5, body, f"{p['first']}: hoodie chest, print {W} mm wide"), W, h + 0.5

def hoodie_back(pid):
    p = PEOPLE[pid]; hd = HOODIES[F['garments']['hoodie']['design']]; W = F['garments']['hoodie']['back']['width_mm']
    body, h = stack(back_blocks(pid, W, hd['back'], F['garments']['hoodie']['qr_code_mm'], ink(p), 70), W)
    return svg(W, h + 1, body, f"{p['first']}: hoodie back ({hd['id']}), print {W} mm wide"), W, h + 1

def card(pid, side):
    """C1: white, a band in the person's colour, their name and line; the back their QR. Trim 85 x 55, 3 mm bleed."""
    p = PEOPLE[pid]; C = F['card']; tw, th = C['trim_mm']; b = C['bleed_mm']; W, H = tw + 2 * b, th + 2 * b
    dark = ink(p) == WHITE
    if side == 'front':
        body = f'<rect x="0" y="0" width="{b + 9}" height="{H}" fill="{p["colour"]}"/>'
        x = b + 15
        body += text(p['name'], 'Bold', min(5.6, (tw - 18) / width1(p['name'], 'Bold')), x, b + 17, '#111111', 'start')
        body += text('RiskMandate', 'Medium', 3.0, x, b + 22.6, '#555555', 'start')
        line = f"“{p['line']}”"; ls = [line]
        if width1(line, 'SemiBold') * 3.2 > tw - 18:  # two lines, split near the middle at a space
            words = line.split(' '); k = max(range(1, len(words)), key=lambda i: -abs(len(' '.join(words[:i])) - len(line) / 2)); ls = [' '.join(words[:k]), ' '.join(words[k:])]
        for i, l in enumerate(ls): body += text(l, 'SemiBold', min(3.2, (tw - 18) / width1(l, 'SemiBold')), x, b + 33 + i * 4.4, '#111111', 'start')
        body += text('RISKMANDATE', 'Black', 2.9, x, b + th - 6, p['colour'] if dark else '#111111', 'start')
        return svg(W, H, body, f"{p['first']}: business card front (C1), trim {tw} x {th} mm, {b} mm bleed", bg=WHITE), W, H
    g, panel = qr(pid, b + 4.5, b + (th - C['qr_code_mm'] * 37 / 29) / 2, C['qr_code_mm'])
    x = b + 4.5 + panel + 4
    body = g + ''.join(text(l, 'Bold', 3.5, x, b + 19 + i * 5.6, '#111111', 'start') for i, l in enumerate(['Meet me', 'Book a meeting', 'Talk to my agent']))
    body += text('web-summit.sgit.ai', 'Medium', 2.5, x, b + 41, '#555555', 'start') + text(f'/meet/{pid}/', 'Medium', 2.5, x, b + 44.4, '#555555', 'start')
    return svg(W, H, body, f"{p['first']}: business card back (C1), trim {tw} x {th} mm, {b} mm bleed", bg=WHITE), W, H

TEE = 'M120,30 L165,10 Q200,40 235,10 L280,30 L380,90 L345,150 L305,128 L305,470 L95,470 L95,128 L55,150 L20,90 Z'
HOOD = 'M110,60 Q200,-10 290,60 L380,120 L350,190 L310,165 L310,480 L90,480 L90,165 L50,190 L20,120 Z'
def place(svgtext, x, y, w):  # a print file inside a proof, scaled to w proof units wide
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svgtext); vw, vh = float(m.group(1)), float(m.group(2))
    inner = re.sub(r'^<svg[^>]*>|</svg>\s*$', '', svgtext.strip()); inner = re.sub(r'<title>.*?</title>', '', inner)
    return f'<svg x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{w * vh / vw:.1f}" viewBox="0 0 {vw} {vh}">{inner}</svg>'

def proof(pid, files):
    """What Dinis signs off: the files as printed, on the garment colour, about to scale (a chest 500 mm wide)."""
    p = PEOPLE[pid]; col = p['colour']; k = 210 / 500  # proof units per mm on the garment
    def garment(shape, x, label): return f'<g transform="translate({x},0)"><path d="{shape}" fill="{col}" stroke="#00000033"/></g><text x="{x + 200}" y="505" font-family="Inter, Arial" font-size="14" text-anchor="middle" fill="#333">{label}</text>'
    tf, tb, hc, hb = (files[n][0] for n in ['tee-front', 'tee-back', 'hoodie-chest', 'hoodie-back'])
    tw = F['garments']['tee']; hw = F['garments']['hoodie']
    body = garment(TEE, 0, 'T-shirt front') + place(tf, 200 - tw['front']['width_mm'] * k / 2, 40 + tw['front']['from_collar_mm'] * k, tw['front']['width_mm'] * k)
    body += garment(TEE, 400, 'T-shirt back') + place(tb, 600 - tw['back']['width_mm'] * k / 2, 40 + tw['back']['from_collar_mm'] * k, tw['back']['width_mm'] * k)
    body += garment(HOOD, 800, 'Hoodie front') + f'<rect x="940" y="360" width="120" height="70" rx="12" fill="#00000014"/>' + place(hc, 1030, 175, hw['chest']['width_mm'] * k)
    body += garment(HOOD, 1200, 'Hoodie back') + place(hb, 1400 - hw['back']['width_mm'] * k / 2, 60 + hw['back']['from_collar_mm'] * k * 0.6, hw['back']['width_mm'] * k)
    cf, cb = files['card-front'][0], files['card-back'][0]
    body += f'<g transform="translate(1630,30)">{place(cf, 0, 0, 260)}<text x="130" y="194" font-family="Inter, Arial" font-size="14" text-anchor="middle" fill="#333">Card front</text></g>'
    body += f'<g transform="translate(1630,280)">{place(cb, 0, 0, 260)}<text x="130" y="194" font-family="Inter, Arial" font-size="14" text-anchor="middle" fill="#333">Card back</text></g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 520" width="1920" height="520"><title>{html.escape(p["first"])}: the final set, for sign-off</title><rect width="1920" height="520" fill="#f4f4f2"/>{body}</svg>\n'

def cmyk(hexc):  # a naive conversion, for the printer's reference only: the printer matches by eye or Pantone
    r, g, b = (int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5)); k = 1 - max(r, g, b)
    if k >= 1: return (0, 0, 0, 100)
    return tuple(round(v * 100) for v in ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k))

# ---- make everything ----
OUT = os.path.join(HERE, 'files'); os.makedirs(os.path.join(HERE, 'proofs'), exist_ok=True)
manifest = []
for fp in F['people']:
    pid = fp['id']; os.makedirs(os.path.join(OUT, pid), exist_ok=True); files = {}
    for name, fn in [('tee-front', tee_front), ('tee-back', tee_back), ('hoodie-chest', hoodie_chest), ('hoodie-back', hoodie_back),
                     ('card-front', lambda i: card(i, 'front')), ('card-back', lambda i: card(i, 'back'))]:
        s, w, h = fn(pid); files[name] = (s, w, h)
        rel = f'files/{pid}/{pid}-{name}'
        open(os.path.join(HERE, rel + '.svg'), 'w').write(s)
        manifest.append({'svg': rel + '.svg', 'pdf': rel + '.pdf', 'png': None if name.startswith('card') else rel + '.png', 'w': round(w, 2), 'h': round(h, 2)})
    open(os.path.join(HERE, 'proofs', f'{pid}.svg'), 'w').write(proof(pid, files))
    for name in files: fp.setdefault('_size', {})[name] = (round(files[name][1]), round(files[name][2]))
json.dump(manifest, open(os.path.join(HERE, 'files', 'manifest.json'), 'w'), indent=1)
subprocess.run(['node', os.path.join(HERE, 'render.mjs'), HERE], check=True)

# one card PDF per person with both sides is what most card printers ask for: render.mjs makes <id>-card.pdf too
# ---- the zip for the printers ----
README = f"""RiskMandate merch: print files (Web Summit 2026 team)
Made by designer@web-summit.dinis from data/design.json and team/designer/print/final.json. Page: {SITE}/print/

RiskMandate only: no sponsor, no other brand, no Web Summit name or logo.
One folder per person. In each:
  <id>-tee-front.*    T-shirt front, print {F['garments']['tee']['front']['width_mm']} mm wide, top {F['garments']['tee']['front']['from_collar_mm']} mm below the collar
  <id>-tee-back.*     T-shirt back, print {F['garments']['tee']['back']['width_mm']} mm wide, top {F['garments']['tee']['back']['from_collar_mm']} mm below the collar
  <id>-hoodie-chest.* Hoodie left chest, {F['garments']['hoodie']['chest']['width_mm']} mm wide
  <id>-hoodie-back.*  Hoodie back, print {F['garments']['hoodie']['back']['width_mm']} mm wide, top {F['garments']['hoodie']['back']['from_collar_mm']} mm below the collar
  <id>-card.pdf       Business card, 2 pages (front, back), {F['card']['trim_mm'][0]} x {F['card']['trim_mm'][1]} mm trim + {F['card']['bleed_mm']} mm bleed
Files: .svg and .pdf are vector at 100% (text converted to outlines, no fonts needed); .png is 300 dpi with a
transparent background, at the print size. Print each at 100%, never scaled to fit.
Ink: white (#FFFFFF) or black (#000000) as given, on the garment colour. The QR code: black on its own white
panel, never recoloured, never cropped into its white border. Nothing on the sleeves.
Garments: {F['garments']['tee']['count_each']} T-shirts and {F['garments']['hoodie']['count_each']} hoodie per person, in the person's colour (see the page).
Cards: {F['card']['count_each']} per person, {F['card']['stock']}.
"""
open(os.path.join(HERE, 'files', 'README.txt'), 'w').write(README)
zp = os.path.join(HERE, 'riskmandate-print-files.zip')
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(os.path.join(HERE, 'files', 'README.txt'), 'riskmandate-print-files/README.txt')
    for fp in F['people']:
        for f in sorted(os.listdir(os.path.join(OUT, fp['id']))):
            if f.endswith(('-card-front.pdf', '-card-back.pdf')): continue
            z.write(os.path.join(OUT, fp['id'], f), f"riskmandate-print-files/{fp['id']}/{f}")
print('print files:', len(manifest), 'items for', len(F['people']), 'people; zip', os.path.getsize(zp) // 1024, 'KB')

# ---- the page: content/print.md ----
def mmx(s): return f'{s[0]} x {s[1]} mm'
U = '../team/designer/print'
rows = []
for fp in F['people']:
    p = PEOPLE[fp['id']]; pid = fp['id']; t = TEES[fp['tee']]; front = fp.get('front', t['front']); sub = fp.get('sub', t.get('sub'))
    so = fp.get('signed_off'); status = f"**signed off** by {so['by']}, {so['at']}" if so else '**waiting for Dinis**'
    c, m, y, k = cmyk(p['colour'])
    rows.append(f"""### {p['name']} {{#{pid}}}

[![{p['first']}: the final set]({U}/proofs/{pid}.svg)]({U}/proofs/{pid}.svg)

| | |
|---|---|
| **Sign-off** | {status} |
| **Colour** | {p['colour']} (about C{c} M{m} Y{y} K{k}); ink **{'white' if ink(p) == WHITE else 'black'}** |
| **T-shirt ({fp['tee']}), x {F['garments']['tee']['count_each']}** | front: "{' '.join(front)}"{f' / "{sub}"' if sub else ''}; back: {'"' + ' '.join(t['back']) + '", ' if t.get('back') and not t.get('chest') else ''}the QR to {SITE}/meet/{pid}/ |
| **Hoodie ({F['garments']['hoodie']['design']}), x {F['garments']['hoodie']['count_each']}** | chest: RISKMANDATE; back: "{' '.join(HOODIES[F['garments']['hoodie']['design']]['back'])}", the QR |
| **Card ({F['card']['design']}), x {F['card']['count_each']}** | "{p['line']}" |
| **T-shirt files** | front [SVG]({U}/files/{pid}/{pid}-tee-front.svg) · [PDF]({U}/files/{pid}/{pid}-tee-front.pdf) · [PNG]({U}/files/{pid}/{pid}-tee-front.png) ({mmx(fp['_size']['tee-front'])}); back [SVG]({U}/files/{pid}/{pid}-tee-back.svg) · [PDF]({U}/files/{pid}/{pid}-tee-back.pdf) · [PNG]({U}/files/{pid}/{pid}-tee-back.png) ({mmx(fp['_size']['tee-back'])}) |
| **Hoodie files** | chest [SVG]({U}/files/{pid}/{pid}-hoodie-chest.svg) · [PDF]({U}/files/{pid}/{pid}-hoodie-chest.pdf) · [PNG]({U}/files/{pid}/{pid}-hoodie-chest.png) ({mmx(fp['_size']['hoodie-chest'])}); back [SVG]({U}/files/{pid}/{pid}-hoodie-back.svg) · [PDF]({U}/files/{pid}/{pid}-hoodie-back.pdf) · [PNG]({U}/files/{pid}/{pid}-hoodie-back.png) ({mmx(fp['_size']['hoodie-back'])}) |
| **Card files** | [PDF, both sides]({U}/files/{pid}/{pid}-card.pdf) (91 x 61 mm with bleed); front [SVG]({U}/files/{pid}/{pid}-card-front.svg) · back [SVG]({U}/files/{pid}/{pid}-card-back.svg) |
{f"| **Changed** | {fp['note']} |" if fp.get('note') else ''}""".rstrip())
waiting = [PEOPLE[x['id']]['first'] for x in F['people'] if not x.get('signed_off')]
allso = not waiting and all(F['items_signed_off'].values())
G, C = F['garments'], F['card']
page = f"""---
title: Print files: the RiskMandate merch
summary: Everything a printer needs for the Web Summit 2026 team's RiskMandate merch (7 x 3 T-shirts, 7 hoodies, 7 x 100 business cards), as vector files at their real size with a zip of the lot, and the final set for Dinis to sign off person by person. RiskMandate only.
---
**{'Signed off: ready to print.' if allso else 'Waiting for sign-off: do not print yet.'}** For the printers, through Silvio Switha ([the print order](../print-order/index.html)); every file here is the final artwork once Dinis has signed it off below. Made by **designer@web-summit.dinis** from `data/design.json` and `team/designer/print/final.json` (`team/designer/print/make-print.py`).

[**Download everything (zip, {os.path.getsize(zp) // 1024} KB)**]({U}/riskmandate-print-files.zip): one folder per person, with a README.

## The order {{#order}}

| Item | How many | Print | Notes |
|---|---|---|---|
| **T-shirts** | {G['tee']['count_each']} per person, 7 colours: {G['tee']['count_each'] * 7} | front {G['tee']['front']['width_mm']} mm wide, top {G['tee']['front']['from_collar_mm']} mm below the collar; back {G['tee']['back']['width_mm']} mm wide, top {G['tee']['back']['from_collar_mm']} mm below the collar | {G['tee']['method']}. Blank: {G['tee']['blank']}. |
| **Hoodies** | {G['hoodie']['count_each']} per person: 7 | chest: {G['hoodie']['chest']['where']}, {G['hoodie']['chest']['width_mm']} mm wide; back {G['hoodie']['back']['width_mm']} mm wide, top {G['hoodie']['back']['from_collar_mm']} mm below the collar | {G['hoodie']['method']}, in the person's colour. |
| **Business cards** | {C['count_each']} per person: {C['count_each'] * 7} | {C['trim_mm'][0]} x {C['trim_mm'][1]} mm trim, {C['bleed_mm']} mm bleed all round, {C['safe_mm']} mm safe area | {C['stock']}. |

## The rules {{#rules}}

{chr(10).join('- ' + r for r in F['rules'])}
- **Files:** SVG and PDF are vector at 100%, every letter converted to outlines, so no fonts are needed. PNG is 300 dpi with a transparent background, at the print size. Print at 100%, never scaled to fit.
- **Ink:** white or black, as given for each person, on the garment's colour. The colours below are the garment colours; the CMYK values are a naive conversion for reference: match the blank to the colour, or tell Silvio the nearest you have.
- **The QR code** is black on its own white panel with its quiet zone: never recolour it, crop into the white border, or print it smaller than given ({G['tee']['qr_code_mm']} mm on a T-shirt, {G['hoodie']['qr_code_mm']} mm on a hoodie, {C['qr_code_mm']} mm on a card). Each person's code goes on that person's items only.
- **Sizes:** {F['sizes']}

## The seven, for sign-off {{#seven}}

Dinis: check each person's set (the proof shows the files as printed, on the garment colour) and say "sign off <name>" or what to change; the hoodie and the card design are signed off once for everyone. Waiting: {', '.join(waiting) if waiting else 'nobody'}. Hoodie: {'signed off' if F['items_signed_off']['hoodie'] else 'waiting'}. Card: {'signed off' if F['items_signed_off']['card'] else 'waiting'}.

{chr(10).join(rows)}

## Checked {{#checked}}

- Every QR code decodes to its own person's meet page with two independent decoders (zxing-cpp and pki.sgit.ai's reader), at error correction M with a 4-module quiet zone, and every meet page answers (2 November 2026). The code in every final file was read back as printed, and each is its own person's: the 14 garment backs by `team/designer/print/check-print.py`, the 7 card backs by the same decoder. Before printing: scan each from a 100% office print, as in `team/designer/qr/README.md`.
- Nothing printed carries a sponsor, another brand, or the Web Summit name or logo.
"""
open(os.path.join(ROOT, 'content/print.md'), 'w').write(page)
print('content/print.md written')
