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

Needs: pip install fonttools (a scratch venv is fine). The font, Barlow Condensed (SIL Open Font License 1.1), is fetched
on the first run from github.com/google/fonts into ~/.cache/web-summit-fonts (or $BARLOW_DIR). Apache-2.0. By designer@web-summit.dinis.
"""
import html, json, os, re, subprocess, sys, zipfile
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
HERE = os.path.join(ROOT, 'team/designer/print')
D = json.load(open(os.path.join(ROOT, 'data/design.json')))
F = json.load(open(os.path.join(HERE, 'final.json')))
# --variant generic: the same set with one QR for everyone on the garment backs (to /meet/, team/designer/qr/qr-meet.svg),
# the cards keeping each person's own code; written to variants/generic/, never over the main set, whose files people sign.
# --page-only: rewrite content/print.md from the data without touching a file (a re-render changes the bytes: a PDF carries
# its creation time, so it would supersede every sign-off).
VARIANT = sys.argv[sys.argv.index('--variant') + 1] if '--variant' in sys.argv else None
PAGE_ONLY = '--page-only' in sys.argv
assert VARIANT in (None, 'generic', 'next'), VARIANT
DEST = os.path.join(HERE, 'variants', VARIANT) if VARIANT else HERE
GENERIC_QR = VARIANT in ('generic', 'next') or F.get('garment_qr') == 'generic'   # one code on the garments (Dinis, 3 Nov, to confirm in this session)
PEOPLE = {p['id']: p for p in D['people']}
TEES = {t['id']: t for t in D['tees']}
HOODIES = {h['id']: h for h in D['hoodies']}
# the poster style Dinis chose (3 November): Barlow Condensed (SIL Open Font License 1.1), fetched once from the Google Fonts
# repository into a cache outside the repository (a font is binary, and the gate reads every file in team/ as text)
FONTDIR = os.environ.get('BARLOW_DIR', os.path.expanduser('~/.cache/web-summit-fonts'))
FONT_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/BarlowCondensed-{w}.ttf'
def font(w):
    p = os.path.join(FONTDIR, f'BarlowCondensed-{w}.ttf')
    if not os.path.exists(p):
        import urllib.request; os.makedirs(FONTDIR, exist_ok=True); urllib.request.urlretrieve(FONT_URL.format(w=w), p)
    return TTFont(p)
WEIGHTS = ['Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold']
FONTS = {w: font(w) for w in WEIGHTS}
# the thinnest stroke of a weight, as a share of the font size: the stem of 'I' x 0.85 (the bars and curves run thinner)
STROKE = {w: 0.85 * (FONTS[w]['glyf']['I'].xMax - FONTS[w]['glyf']['I'].xMin) / FONTS[w]['head'].unitsPerEm for w in WEIGHTS}
MIN_STROKE = [0.0]   # set to the garments' minimum while a garment file is made (DTF holds 1 mm), 0 for the cards
THINNEST = [99.0]    # the thinnest stroke written into the file being made, in mm
def eff(w, size):
    """The weight actually used: the lightest at or above w whose thinnest stroke holds MIN_STROKE at this size."""
    i = WEIGHTS.index(w)
    while MIN_STROKE[0] and i < len(WEIGHTS) - 1 and STROKE[WEIGHTS[i]] * size < MIN_STROKE[0]: i += 1
    return WEIGHTS[i]
WHITE, BLACK = '#FFFFFF', '#000000'
SITE = 'https://web-summit.sgit.ai'

def cap_height(w):
    f = FONTS[w]; return f['OS/2'].sCapHeight / f['head'].unitsPerEm

def width1(txt, w):  # advance width of a line at a font size of 1
    txt = txt.replace("'", "\u2019"); f = FONTS[w]; cmap = f.getBestCmap(); hm = f['hmtx']
    return sum(hm[cmap.get(ord(c), '.notdef')][0] for c in txt) / f['head'].unitsPerEm

def text(txt, w, size, x, y, fill, anchor='middle'):
    """One line of text as an outlined path; (x, y) is the baseline at the anchor. Apostrophes are set typographic."""
    txt = txt.replace("'", "\u2019"); w = eff(w, size); THINNEST[0] = min(THINNEST[0], STROKE[w] * size)
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
    t = open(os.path.join(ROOT, 'team/designer/qr', f'qr-meet-{pid}.svg' if pid else 'qr-meet.svg')).read()   # no id: the team's /meet/
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
        if b[0] == 'rule':  # a short divider: ('rule', width, thickness, fill)
            body += f'<rect x="{(width - b[1]) / 2:.2f}" y="{y:.2f}" width="{b[1]:.2f}" height="{b[2]:.2f}" fill="{b[3]}"/>'; y += b[2]; continue
        if b[0] == 'rm':  # the RiskMandate mark: ('rm', width)
            body += rm_mark(width / 2, y, b[1]); y += b[1]; continue
        if b[0] == 'mark':  # the wordmark, RISK light and MANDATE bold: ('mark', width, fill)
            g, h = mark(width / 2, y, b[1], b[2]); body += g; y += h; continue
        _, ls, w, size, fill, lead = b
        ch = cap_height(w) * size
        for i, l in enumerate(ls):
            y += ch if i == 0 else size * lead
            body += text(l, w, size, width / 2, y, fill)
    return body, y

def mark(cx, top, width, fill):
    """RISK MANDATE, as on the example: RISK light, MANDATE bold, a space between; centred on cx, width wide."""
    gap = 0.22; lw = 'Light'
    for _ in range(3):  # RISK takes a heavier weight where light would print thinner than the minimum stroke
        total = width1('RISK', lw) + gap + width1('MANDATE', 'Bold'); size = width / total; lw = eff('Light', size)
    total = width1('RISK', lw) + gap + width1('MANDATE', 'Bold'); size = width / total
    ch = cap_height('Bold') * size; x0 = cx - width / 2
    return (text('RISK', lw, size, x0, top + ch, fill, 'start') + text('MANDATE', 'Bold', size, x0 + (width1('RISK', lw) + gap) * size, top + ch, fill, 'start')), ch

# the RiskMandate mark, the supplied file (team/designer/print/concepts-rm/brand/, from riskmandate.ai/brand, by
# designer@web-summit.indi): copied as it is, with the RM lettering as the brand's EPS outlines it and the faint inner ring in
# the EPS's flattened colour, so the print file needs no font and has no transparency (as brand/SOURCE.md). The containered
# mark is the brand's default and holds on every garment colour without recolouring. Its thinnest stroke, the inner ring, is
# 1/64 of its width: 64 mm or more keeps the 1 mm rule. Clear space: half its width on every side (the brand's rule).
WITH_MARK = VARIANT == 'next' or bool(F.get('mark_on_garments'))
BRAND = os.path.join(HERE, 'concepts-rm', 'brand')
def _eps_rm():
    e = open(os.path.join(BRAND, 'riskmandate-mark.eps')).read()
    body = e[e.index('% RM, as outlines'):]; body = body[:body.index('\nfill')]; d = []
    for ln in body.splitlines():
        t = ln.split()
        if not t: continue
        if t[-1] == 'moveto': d.append('M' + ' '.join(t[:2]))
        elif t[-1] == 'lineto': d.append('L' + ' '.join(t[:2]))
        elif t[-1] == 'curveto': d.append('C' + ' '.join(t[:6]))
        elif t[-1] == 'closepath': d.append('Z')
    return ''.join(d)
def _eps_inner_ring():
    e = open(os.path.join(BRAND, 'riskmandate-mark.eps')).read(); seg = e[e.index('% the faint inner ring'):]
    rgb = [float(v) for v in re.search(r'\n([\d.]+) ([\d.]+) ([\d.]+) setrgbcolor', seg).groups()]
    return '#' + ''.join(f'{round(v * 255):02X}' for v in rgb)
def rm_mark(cx, top, d):
    """The containered mark, d mm wide (the 64-unit tile), centred on cx, its top at top."""
    src = open(os.path.join(BRAND, 'riskmandate-mark.svg')).read()
    body = re.search(r'</title>(.*)</svg>', src, re.S).group(1).replace('stroke="rgba(247,246,242,.22)"', f'stroke="{_eps_inner_ring()}"')
    fill = re.search(r'<text[^>]*fill="(#[0-9A-Fa-f]{6})"', body).group(1)
    body = re.sub(r'<text[^>]*>RM</text>', f'<path d="{_eps_rm()}" fill="{fill}"/>', body)
    assert '<text' not in body and 'rgba' not in body
    if MIN_STROKE[0]: assert d / 64 >= MIN_STROKE[0] - 1e-9, f'the mark at {d} mm has a {d / 64:.2f} mm ring'
    k = d / 64
    return f'<g transform="translate({cx - d / 2:.2f},{top:.2f}) scale({k:.4f})">' + re.sub(r'\s*\n\s*', '', body) + '</g>'

WITH_SLEEVE = VARIANT == 'next' or bool(F.get('sleeve_mark'))   # the seal on the left sleeve (Silvio, Dinis in person, 4 Nov)
NEXT_OVERRIDES = VARIANT == 'next' or bool(F.get('next_live'))  # a person's hoodie colour and ink (Vicky: lavender, black ink)
def fpers(pid): return next(x for x in F['people'] if x['id'] == pid)
def hoodie_ink(pid):
    o = fpers(pid).get('hoodie_ink') if NEXT_OVERRIDES else None
    return BLACK if o == 'black' else WHITE if o == 'white' else ink(PEOPLE[pid])
def hoodie_colour(pid): return (fpers(pid).get('hoodie_colour') if NEXT_OVERRIDES else None) or PEOPLE[pid]['colour']
def sleeve(pid):
    """The containered seal for the left sleeve, as supplied: the same file on every garment and colour."""
    p = PEOPLE[pid]; W = F['garments']['sleeve']['width_mm']
    return svg(W, W, rm_mark(W / 2, 0, W), f"{p['first']}: the sleeve seal, print {W} mm wide, left sleeve"), W, W

def ink(p): return WHITE if p['ink'].lower() in ('#fff', '#ffffff') else BLACK

def person_parts(pid):
    p = PEOPLE[pid]; fp = next(x for x in F['people'] if x['id'] == pid); t = TEES[fp['tee']]
    front = fp.get('front', t['front']); sub = fp.get('sub', t.get('sub'))
    return p, fp, t, front, sub

def tee_front(pid, W=None, label=''):
    """The example's front: the line in condensed capitals, a divider, the wordmark, the shirt's tagline."""
    p, fp, t, front, sub = person_parts(pid); W = W or F['garments']['tee']['front']['width_mm']; c = ink(p); k = W / 250
    size = fit(front, 'ExtraBold', W, 80)
    blocks = [('lines', front, 'ExtraBold', size, c, 0.98), ('gap', size * 0.55), ('rule', 40 * k, 1.5, c), ('gap', size * 0.5), ('mark', 150 * k, c)]
    if fp.get('tagline'): blocks += [('gap', 5), ('lines', [fp['tagline']], 'Medium', min(11 * k, 150 * k / width1(fp['tagline'], 'Medium')), c, 1)]
    body, h = stack(blocks, W)
    return svg(W, h + 2, body, f"{p['first']}: T-shirt front ({fp['tee']}){label}, print {W} mm wide"), W, h + 2

def back_blocks(pid, W, lines, code, c, big_cap):
    """The example's back: (the hoodie's line,) the wordmark and 'Agents with a Mandate', the person's QR, the three asks."""
    blocks = []
    if lines:
        s_ = fit(lines, 'ExtraBold', W, big_cap); blocks += [('lines', lines, 'ExtraBold', s_, c, 0.98), ('gap', s_ * 0.5), ('rule', 34, 1.2, c), ('gap', s_ * 0.45)]
    mw = min(W * 0.8, 175)
    blocks += [('mark', mw, c), ('gap', 4), ('lines', ['Agents with a Mandate'], 'Medium', mw * 0.11, c, 1), ('gap', 10), ('qr', None if GENERIC_QR else pid, code), ('gap', 10),
               ('lines', ['Meet me', 'Book a meeting', 'Talk to my agent'], 'SemiBold', min(13, W / width1('Talk to my agent', 'SemiBold')), c, 1.25)]
    return blocks

def tee_back(pid):
    p = PEOPLE[pid]; W = F['garments']['tee']['back']['width_mm']
    blocks = back_blocks(pid, W, None, F['garments']['tee']['qr_code_mm'], ink(p), 40)
    if WITH_MARK: blocks = [('rm', 70), ('gap', 35)] + blocks
    body, h = stack(blocks, W)
    return svg(W, h + 2, body, f"{p['first']}: T-shirt back, print {W} mm wide"), W, h + 2

def hoodie_chest(pid):
    p = PEOPLE[pid]; W = 70 if WITH_MARK else F['garments']['hoodie']['chest']['width_mm']
    if WITH_MARK: g, h = rm_mark(W / 2, 0, W), W
    else: g, h = mark(W / 2, 0, W, ink(p))
    return svg(W, h + 0.5, g, f"{p['first']}: hoodie chest, print {W} mm wide"), W, h + 0.5

def hoodie_back(pid):
    p = PEOPLE[pid]; hd = HOODIES[F['garments']['hoodie']['design']]; W = F['garments']['hoodie']['back']['width_mm']
    cap, mh = 80, F['garments']['hoodie']['back'].get('max_height_mm', 9999)
    while True:
        body, h = stack(back_blocks(pid, W, hd['back'], F['garments']['hoodie']['qr_code_mm'], hoodie_ink(pid), cap), W)
        if h + 2 <= mh or cap <= 20: break
        cap -= 1
    return svg(W, h + 2, body, f"{p['first']}: hoodie back ({hd['id']}), print {W} x {h + 2:.0f} mm"), W, h + 2

def card(pid, side):
    """C1: white, a band in the person's colour, their name and line; the back their QR. Trim 85 x 55, 3 mm bleed."""
    p = PEOPLE[pid]; C = F['card']; tw, th = C['trim_mm']; b = C['bleed_mm']; W, H = tw + 2 * b, th + 2 * b
    dark = ink(p) == WHITE
    if side == 'front':
        body = f'<rect x="0" y="0" width="{b + 9}" height="{H}" fill="{p["colour"]}"/>'
        x = b + 15; room = tw - 18
        nm = next(x for x in F['people'] if x['id'] == pid).get('card_name', p['name']) if VARIANT == 'next' or F.get('card_names_live') else p['name']
        body += text(nm, 'Bold', min(7.2, room / width1(nm, 'Bold')), x, b + 16, '#111111', 'start')
        line = f"“{p['line']}”"; ls = [line]
        if width1(line, 'SemiBold') * 4.2 > room:  # two lines, split near the middle at a space
            words = line.split(' '); k = max(range(1, len(words)), key=lambda i: -abs(len(' '.join(words[:i])) - len(line) / 2)); ls = [' '.join(words[:k]), ' '.join(words[k:])]
        for i, l in enumerate(ls): body += text(l, 'SemiBold', min(4.2, room / width1(l, 'SemiBold')), x, b + 27 + i * 5.2, '#111111', 'start')
        g, _ = mark(x + 17, b + th - 10, 34, p['colour'] if dark else '#111111'); body += g
        return svg(W, H, body, f"{p['first']}: business card front (C1), trim {tw} x {th} mm, {b} mm bleed", bg=WHITE), W, H
    g, panel = qr(pid, b + 4.5, b + (th - C['qr_code_mm'] * 37 / 29) / 2, C['qr_code_mm'])
    x = b + 4.5 + panel + 4
    body = g + ''.join(text(l, 'SemiBold', 4.4, x, b + 19 + i * 5.8, '#111111', 'start') for i, l in enumerate(['Meet me', 'Book a meeting', 'Talk to my agent']))
    body += text('web-summit.sgit.ai', 'Medium', 3.0, x, b + 41, '#555555', 'start') + text(f'/meet/{pid}/', 'Medium', 3.0, x, b + 44.6, '#555555', 'start')
    return svg(W, H, body, f"{p['first']}: business card back (C1), trim {tw} x {th} mm, {b} mm bleed", bg=WHITE), W, H

TEE = 'M120,30 L165,10 Q200,40 235,10 L280,30 L380,90 L345,150 L305,128 L305,470 L95,470 L95,128 L55,150 L20,90 Z'
HOOD = 'M110,60 Q200,-10 290,60 L380,120 L350,190 L310,165 L310,480 L90,480 L90,165 L50,190 L20,120 Z'
def place(svgtext, x, y, w):  # a print file inside a proof, scaled to w proof units wide
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svgtext); vw, vh = float(m.group(1)), float(m.group(2))
    inner = re.sub(r'^<svg[^>]*>|</svg>\s*$', '', svgtext.strip()); inner = re.sub(r'<title>.*?</title>', '', inner)
    return f'<svg x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{w * vh / vw:.1f}" viewBox="0 0 {vw} {vh}">{inner}</svg>'

def proof(pid, files):
    """What Dinis signs off: the files as printed, on the garment colour, about to scale (a chest 500 mm wide)."""
    p = PEOPLE[pid]; col = p['colour']; hcol = hoodie_colour(pid); k = 210 / 500  # proof units per mm on the garment
    def garment(shape, x, label, c=None): return f'<g transform="translate({x},0)"><path d="{shape}" fill="{c or col}" stroke="#00000033"/></g><text x="{x + 200}" y="505" font-family="Inter, Arial" font-size="14" text-anchor="middle" fill="#333">{label}</text>'
    tf, tb, hc, hb = (files[n][0] for n in ['tee-front', 'tee-back', 'hoodie-chest', 'hoodie-back'])
    tw = F['garments']['tee']; hw = F['garments']['hoodie']
    body = garment(TEE, 0, 'T-shirt front') + place(tf, 200 - tw['front']['width_mm'] * k / 2, 40 + tw['front']['from_collar_mm'] * k, tw['front']['width_mm'] * k)
    body += garment(TEE, 400, 'T-shirt back') + place(tb, 600 - tw['back']['width_mm'] * k / 2, 40 + tw['back']['from_collar_mm'] * k, tw['back']['width_mm'] * k)
    if WITH_SLEEVE:   # the seal on the wearer's left sleeve: on the right of a front view
        sw = F['garments']['sleeve']['width_mm'] * k; body += place(files['sleeve'][0], 330 - sw / 2, 72, sw)
    body += garment(HOOD, 800, 'Hoodie front', hcol) + f'<rect x="940" y="360" width="120" height="70" rx="12" fill="#00000014"/>' + place(hc, 1030, 175, hw['chest']['width_mm'] * k)
    if WITH_SLEEVE:
        sw = F['garments']['sleeve']['width_mm'] * k; body += place(files['sleeve'][0], 1138 - sw / 2, 120, sw)
    body += garment(HOOD, 1200, 'Hoodie back', hcol) + place(hb, 1400 - hw['back']['width_mm'] * k / 2, 60 + hw['back']['from_collar_mm'] * k * 0.6, hw['back']['width_mm'] * k)
    cf, cb = files['card-front'][0], files['card-back'][0]
    body += f'<g transform="translate(1630,30)">{place(cf, 0, 0, 260)}<text x="130" y="194" font-family="Inter, Arial" font-size="14" text-anchor="middle" fill="#333">Card front</text></g>'
    body += f'<g transform="translate(1630,280)">{place(cb, 0, 0, 260)}<text x="130" y="194" font-family="Inter, Arial" font-size="14" text-anchor="middle" fill="#333">Card back</text></g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 520" width="1920" height="520"><title>{html.escape(p["first"])}: the final set, for sign-off</title><rect width="1920" height="520" fill="#f4f4f2"/>{body}</svg>\n'

def cmyk(hexc):  # a naive conversion, for the printer's reference only: the printer matches by eye or Pantone
    r, g, b = (int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5)); k = 1 - max(r, g, b)
    if k >= 1: return (0, 0, 0, 100)
    return tuple(round(v * 100) for v in ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k))

# ---- make everything ----
OUT = os.path.join(DEST, 'files'); os.makedirs(os.path.join(DEST, 'proofs'), exist_ok=True)
manifest = []
for fp in F['people']:
    pid = fp['id']; os.makedirs(os.path.join(OUT, pid), exist_ok=True); files = {}
    small = F['garments']['tee']['front_small']['width_mm']
    for name, fn in [('tee-front', tee_front), ('tee-front-small', lambda i: tee_front(i, small, " for XS, S and women's")), ('tee-back', tee_back), ('hoodie-chest', hoodie_chest), ('hoodie-back', hoodie_back),
                     ('card-front', lambda i: card(i, 'front')), ('card-back', lambda i: card(i, 'back'))] + ([('sleeve', sleeve)] if WITH_SLEEVE else []):
        MIN_STROKE[0] = 0.0 if name.startswith('card') else F['min_stroke_mm']; THINNEST[0] = 99.0
        s, w, h = fn(pid); files[name] = (s, w, h)
        if not name.startswith('card'):
            assert THINNEST[0] >= F['min_stroke_mm'] - 1e-9, f"{pid} {name}: a stroke of {THINNEST[0]:.2f} mm"
            fp.setdefault('_thinnest', {})[name] = round(THINNEST[0], 2)
        rel = f'files/{pid}/{pid}-{name}'
        if not PAGE_ONLY: open(os.path.join(DEST, rel + '.svg'), 'w').write(s)
        manifest.append({'svg': rel + '.svg', 'pdf': rel + '.pdf', 'png': None if name.startswith('card') else rel + '.png', 'w': round(w, 2), 'h': round(h, 2)})
    if not PAGE_ONLY: open(os.path.join(DEST, 'proofs', f'{pid}.svg'), 'w').write(proof(pid, files))
    for name in files: fp.setdefault('_size', {})[name] = (round(files[name][1]), round(files[name][2]))
if not PAGE_ONLY:
    json.dump(manifest, open(os.path.join(DEST, 'files', 'manifest.json'), 'w'), indent=1)
    subprocess.run(['node', os.path.join(HERE, 'render.mjs'), DEST], check=True)

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
QR codes: {'ONE CODE FOR EVERYONE on the garment backs, to ' + SITE + '/meet/ (the team page); each card keeps its own person' + "'" + 's code' if GENERIC_QR else 'each person' + "'" + 's own code, to ' + SITE + '/meet/<id>/, on their garments and card'}.
"""
zp = os.path.join(DEST, 'riskmandate-print-files' + (f'-{VARIANT}' if VARIANT else '') + '.zip')
if not PAGE_ONLY:
  open(os.path.join(DEST, 'files', 'README.txt'), 'w').write(README)
  with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(os.path.join(DEST, 'files', 'README.txt'), 'riskmandate-print-files/README.txt')
    for fp in F['people']:
        for f in sorted(os.listdir(os.path.join(OUT, fp['id']))):
            if f.endswith(('-card-front.pdf', '-card-back.pdf')): continue
            z.write(os.path.join(OUT, fp['id'], f), f"riskmandate-print-files/{fp['id']}/{f}")
print('print files:', len(manifest), 'items for', len(F['people']), 'people; zip', os.path.getsize(zp) // 1024, 'KB', f'({VARIANT})' if VARIANT else '')
if VARIANT: sys.exit(0)   # a variant is shown on the main page (--page-only), never as a page of its own

# ---- the page: content/print.md ----
def mmx(s): return f'{s[0]} x {s[1]} mm'
U = '../team/designer/print'
NZ = os.path.join(HERE, 'variants', 'next', 'riskmandate-print-files-next.zip')
generic_section = '' if not os.path.exists(NZ) else f"""
## Proposed: the next update, waiting for Dinis to confirm {{#next}}

Everything asked for since the sets above were signed, made once, as one complete set, so everyone signs again only once:

1. **One QR code for everyone on the garments**, to [{SITE}/meet/](../meet/index.html) (the team page): Dinis, as relayed by his conductor and by Silvio's procurement agent (3 November). The cards keep each person's own code.
2. **The RiskMandate mark** (the supplied containered mark, from riskmandate.ai/brand, never recoloured): 70 mm at the top of every T-shirt back, with the brand's clear space, and as the hoodie's chest logo (relayed from Dinis, 3 November). 70 mm keeps its thinnest ring at 1.1 mm.
3. **Vicky's card reads "Vicky Wang"** (Vicky's own word through her agent, 4 November).
4. **The RiskMandate seal on the left sleeve** of every T-shirt and hoodie, 75 mm, as supplied (Silvio's choice, which Dinis confirmed in person on 4 November, as relayed): a file of its own per person, `<id>-sleeve`.
5. **Vicky's hoodie in lavender with black ink** (the printer has no purple hoodie; Vicky's own word, through Silvio): white would not read on lavender.

**🇵🇹 [Em português](../impressao/index.html)** (procurement@web-summit.silvio).

Not in it: the **business cards** in this set are the personal C1 cards; the team now orders the three unnamed team cards instead ([the cards' order page](../cards/print/index.html)). **Not yet the files to print:** the sets above stand until Dinis confirms this update in the designer's session; then it becomes the main set and every set is signed again. Checked as printed: 14 garment backs to /meet/, 7 cards to their own pages.

[Download the proposed set (zip, {os.path.getsize(NZ) // 1024} KB)]({U}/variants/next/riskmandate-print-files-next.zip) · proofs: {' · '.join(f"[{PEOPLE[x['id']]['first']}]({U}/variants/next/proofs/{x['id']}.svg)" for x in F['people'])}
"""
rows = []
for fp in F['people']:
    p = PEOPLE[fp['id']]; pid = fp['id']; t = TEES[fp['tee']]; front = fp.get('front', t['front']); sub = fp.get('sub', t.get('sub'))
    c, m, y, k = cmyk(p['colour'])
    rows.append(f"""### {p['name']} {{#{pid}}}

{{{{signoff:{pid}}}}}

[![{p['first']}: the final set]({U}/proofs/{pid}.svg)]({U}/proofs/{pid}.svg)

| | |
|---|---|
| **Colour** | {p['colour']} (about C{c} M{m} Y{y} K{k}); stock colour: **{fp.get('stock_colour', 'to confirm')}**; ink **{'white' if ink(p) == WHITE else 'black'}** |
| **T-shirt ({fp['tee']}), x {F['garments']['tee']['count_each']}** | front: "{' '.join(front)}", then RISK MANDATE and "{fp.get('tagline', '')}"; back: RISK MANDATE, "Agents with a Mandate", the QR to {SITE}/meet/{pid}/, "Meet me / Book a meeting / Talk to my agent" |
| **Hoodie ({F['garments']['hoodie']['design']}), x {F['garments']['hoodie']['count_each']}** | chest: RISK MANDATE; back: "{' '.join(HOODIES[F['garments']['hoodie']['design']]['back'])}", then the T-shirt's back |
| **Card ({F['card']['design']}), x {F['card']['count_each']}** | "{p['line']}" |
| **T-shirt files** | front [SVG]({U}/files/{pid}/{pid}-tee-front.svg) · [PDF]({U}/files/{pid}/{pid}-tee-front.pdf) · [PNG]({U}/files/{pid}/{pid}-tee-front.png) ({mmx(fp['_size']['tee-front'])}); front for XS, S and women's [SVG]({U}/files/{pid}/{pid}-tee-front-small.svg) · [PDF]({U}/files/{pid}/{pid}-tee-front-small.pdf) · [PNG]({U}/files/{pid}/{pid}-tee-front-small.png) ({mmx(fp['_size']['tee-front-small'])}); back [SVG]({U}/files/{pid}/{pid}-tee-back.svg) · [PDF]({U}/files/{pid}/{pid}-tee-back.pdf) · [PNG]({U}/files/{pid}/{pid}-tee-back.png) ({mmx(fp['_size']['tee-back'])}) |
| **Hoodie files** | chest [SVG]({U}/files/{pid}/{pid}-hoodie-chest.svg) · [PDF]({U}/files/{pid}/{pid}-hoodie-chest.pdf) · [PNG]({U}/files/{pid}/{pid}-hoodie-chest.png) ({mmx(fp['_size']['hoodie-chest'])}); back [SVG]({U}/files/{pid}/{pid}-hoodie-back.svg) · [PDF]({U}/files/{pid}/{pid}-hoodie-back.pdf) · [PNG]({U}/files/{pid}/{pid}-hoodie-back.png) ({mmx(fp['_size']['hoodie-back'])}) |
| **Card files** | [PDF, both sides]({U}/files/{pid}/{pid}-card.pdf) (91 x 61 mm with bleed); front [SVG]({U}/files/{pid}/{pid}-card-front.svg) · back [SVG]({U}/files/{pid}/{pid}-card-back.svg) |
| **Thinnest stroke** | {min(fp['_thinnest'].values()):.1f} mm on the garments (the minimum is {F['min_stroke_mm']:g} mm) |
{f"| **Changed** | {fp['note']} |" if fp.get('note') else ''}""".rstrip())
G, C = F['garments'], F['card']
page = f"""---
title: Print files: the RiskMandate merch
summary: The Official Sign-off of the RiskMandate merch, and everything a printer needs for the Web Summit 2026 team's RiskMandate merch (7 x 3 T-shirts, 7 hoodies, 7 x 100 business cards), as vector files at their real size with a zip of the lot, and the final set for Dinis to sign off person by person. RiskMandate only.
---
**🇵🇹 [Português](../impressao/index.html)**: a versão desta página para a gráfica (procurement@web-summit.silvio).

{{{{signoff-summary}}}}

For the printers, through Silvio Switha ([the print order](../print-order/index.html)); every file here is the final artwork once Dinis has signed it off below. Made by **designer@web-summit.dinis** from `data/design.json` and `team/designer/print/final.json` (`team/designer/print/make-print.py`).

{{{{signoff-download:{os.path.getsize(zp) // 1024}}}}}
{generic_section}

## The order {{#order}}

| Item | How many | Print | Notes |
|---|---|---|---|
| **T-shirts** | {G['tee']['count_each']} per person, 7 colours: {G['tee']['count_each'] * 7} | front {G['tee']['front']['width_mm']} mm wide, top {G['tee']['front']['from_collar_mm']} mm below the collar; back {G['tee']['back']['width_mm']} mm wide, top {G['tee']['back']['from_collar_mm']} mm below the collar | {G['tee']['method']}. Blank: {G['tee']['blank']}. |
| **Hoodies** | {G['hoodie']['count_each']} per person: 7 | chest: {G['hoodie']['chest']['where']}, {G['hoodie']['chest']['width_mm']} mm wide; back {G['hoodie']['back']['width_mm']} mm wide, top {G['hoodie']['back']['from_collar_mm']} mm below the collar | {G['hoodie']['method']}, in the person's colour. |
| **Business cards** | {C['count_each']} per person: {C['count_each'] * 7} | {C['trim_mm'][0]} x {C['trim_mm'][1]} mm trim, {C['bleed_mm']} mm bleed all round, {C['safe_mm']} mm safe area | {C['stock']}. |

## The rules {{#rules}}

{chr(10).join('- ' + r for r in F['rules'])}
- **Style:** the print order's example picture, chosen by Dinis on 3 November: the line in condensed capitals, a divider, RISK MANDATE, a tagline; the back with the wordmark, the QR and the three asks.
- **Files:** SVG and PDF are vector at 100%, every letter converted to outlines, so no fonts are needed. PNG is 300 dpi with a transparent background, at the print size. Print at 100%, never scaled to fit.
- **Ink:** white or black, as given for each person, on the garment's colour. The colours below are the garment colours; the CMYK values are a naive conversion for reference: match the blank to the colour, or tell Silvio the nearest you have.
- **The QR code** is black on its own white panel with its quiet zone: never recolour it, crop into the white border, or print it smaller than given ({G['tee']['qr_code_mm']} mm on a T-shirt, {G['hoodie']['qr_code_mm']} mm on a hoodie, {C['qr_code_mm']} mm on a card). Each person's code goes on that person's items only.
- **Sizes:** {F['sizes']}

## The seven, for sign-off {{#seven}}

**How it is signed** (WS-113): each person signs their own set, through their agent, with the agent's key on [the keys page](../keys/index.html); Dinis signs the shared designs (the hoodie H1 and the card C1) and may sign for anyone on their word. A sign-off covers the exact bytes of the files: if a file changes afterwards, the set shows **superseded** and is signed again. The status of every set is read from the signatures at each build (`admin/tools/signoff.mjs`).

{{{{signoff-shared}}}}

{chr(10).join(rows)}

## Checked {{#checked}}

- Every QR code decodes to its own person's meet page with two independent decoders (zxing-cpp and pki.sgit.ai's reader), at error correction M with a 4-module quiet zone, and every meet page answers (2 November 2026). The code in every final file was read back as printed, and each is its own person's: the 14 garment backs by `team/designer/print/check-print.py`, the 7 card backs by the same decoder. Before printing: scan each from a 100% office print, as in `team/designer/qr/README.md`.
- Nothing printed carries a sponsor, another brand, or the Web Summit name or logo.
"""
open(os.path.join(ROOT, 'content/print.md'), 'w').write(page)
print('content/print.md written')
