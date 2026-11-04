#!/usr/bin/env python3
"""Three RiskMandate business card concepts (A Band, B Seal, C Poster) for two sample people, indi and dinis.

    BARLOW_DIR=<dir with BarlowCondensed-*.ttf> python3 team/designer/print/concepts-rm/make-concepts.py
    node team/designer/print/concepts-rm/render-concepts.mjs     (the PNG previews, sheets and PDFs)

Same method as team/designer/print/make-print.py: every letter is an outlined path (fontTools), the QR is the person's
team/designer/qr/qr-meet-<id>.svg path, unchanged, black on its white panel with the 4-module quiet zone, at 24 mm.
Each side is also written as a live-text copy (live/) for editing. The RiskMandate seal is not in the repository, so
each file has one placeholder group, id="rm-logo", at the seal's size and position, its clear space kept free.
Writes checks.json: every text item's size, fill, background, contrast and box, for the checks in the README.
Needs fontTools (a scratch venv is fine), Barlow Condensed (SIL OFL 1.1) and Inter (SIL OFL 1.1). Apache-2.0.
By designer@web-summit.dinis.
"""
import html, json, os, re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
D = json.load(open(os.path.join(ROOT, 'data/design.json')))
PEOPLE = {p['id']: p for p in D['people']}
BARLOW = os.environ.get('BARLOW_DIR', os.path.expanduser('~/.cache/web-summit-fonts'))
INTER = os.environ.get('INTER_DIR', '/usr/share/fonts/opentype/inter')
FONTS = {}
for w in ['Light', 'SemiBold', 'Bold', 'ExtraBold']: FONTS['bc-' + w] = TTFont(os.path.join(BARLOW, f'BarlowCondensed-{w}.ttf'))
for w in ['Medium', 'SemiBold', 'Bold']: FONTS['in-' + w] = TTFont(os.path.join(INTER, f'Inter-{w}.otf'))
LIVE = {'bc': 'Barlow Condensed', 'in': 'Inter'}
WEIGHT = {'Light': 300, 'Medium': 500, 'SemiBold': 600, 'Bold': 700, 'ExtraBold': 800}

# the palette: the brand's container and green, white, and the person's colour as the only accent
DARK, GREEN, WHITE, BLACK = '#161615', '#1A7F5A', '#FFFFFF', '#000000'
# roles from data/team.json, shortened to one line (the brief asks for it); the full roles are in the README
ROLE = {'dinis': 'Operator: the strategy', 'indi': 'The message and outreach'}
SITE = 'web-summit.sgit.ai'
TW, TH, B = 85, 55, 3
W, H = TW + 2 * B, TH + 2 * B
SAFE = (B + 4, B + 4, B + TW - 4, B + TH - 4)   # 7, 7, 84, 54
PT = 25.4 / 72                                   # mm per point

class Side:
    def __init__(s, title): s.title, s.out, s.live, s.items, s.logo = title, [], [], [], None
    def add(s, frag, live=None): s.out.append(frag); s.live.append(frag if live is None else live)

def width1(txt, f):
    f = FONTS[f]; cmap = f.getBestCmap(); hm = f['hmtx']
    return sum(hm[cmap.get(ord(c), '.notdef')][0] for c in txt) / f['head'].unitsPerEm

def cap(f): return FONTS[f]['OS/2'].sCapHeight / FONTS[f]['head'].unitsPerEm

def text(side, txt, f, size, x, y, fill, bg, anchor='start', role='text'):
    """One line, outlined, baseline at y; also a live <text> copy; records the item for the checks."""
    txt = txt.replace("'", '’'); font = FONTS[f]; gs = font.getGlyphSet(); cmap = font.getBestCmap(); hm = font['hmtx']
    s = size / font['head'].unitsPerEm; wd = width1(txt, f) * size
    x0 = x - wd / 2 if anchor == 'middle' else x - wd if anchor == 'end' else x
    pen = SVGPathPen(gs, ntos=lambda v: f'{v:.3f}'.rstrip('0').rstrip('.')); bp = BoundsPen(gs); cur = 0
    for c in txt:
        n = cmap.get(ord(c), '.notdef'); t = (s, 0, 0, -s, x0 + cur * s, y)
        gs[n].draw(TransformPen(pen, t)); gs[n].draw(TransformPen(bp, t)); cur += hm[n][0]
    fam, wt = f.split('-')
    side.add(f'<path d="{pen.getCommands()}" fill="{fill}"/>',
             f'<text x="{x0:.3f}" y="{y:.3f}" font-family="{LIVE[fam]}" font-weight="{WEIGHT[wt]}" font-size="{size:.3f}" fill="{fill}">{html.escape(txt)}</text>')
    side.items.append({'text': txt, 'font': f, 'size_mm': round(size, 3), 'size_pt': round(size / PT, 2), 'fill': fill, 'bg': bg,
                       'box': [round(v, 2) for v in bp.bounds], 'role': role})
    return wd

def fit(txt, f, size, room): return min(size, room / width1(txt.replace("'", '’'), f))

def wrap(txt, f, size, room):
    words, lines = txt.split(' '), ['']
    for w_ in words:
        t = (lines[-1] + ' ' + w_).strip()
        if width1(t.replace("'", '’'), f) * size <= room: lines[-1] = t
        else: lines.append(w_)
    return lines

def wordmark(side, x, baseline, width, fill, bg):
    """RISK MANDATE in condensed capitals, set in type: RISK light, MANDATE bold, as on the merch."""
    gap = 0.22; size = width / (width1('RISK', 'bc-Light') + gap + width1('MANDATE', 'bc-Bold'))
    text(side, 'RISK', 'bc-Light', size, x, baseline, fill, bg, role='wordmark')
    text(side, 'MANDATE', 'bc-Bold', size, x + (width1('RISK', 'bc-Light') + gap) * size, baseline, fill, bg, role='wordmark')
    return size, cap('bc-Bold') * size

def logo(side, x, y, size, variant, bg):
    """The placeholder for the RiskMandate seal (the supplied SVG or EPS replaces this group as it is, at this size)."""
    assert side.logo is None, 'one rm-logo per file'
    grey = '#8C8C8C' if bg == WHITE else '#9A9A9A'; cs = size / 2
    side.logo = {'x': x, 'y': y, 'size': size, 'clear': cs, 'variant': variant}
    lab = Side('')
    for i, l in enumerate(['RM', 'LOGO']): text(lab, l, 'in-Medium', 2.5, x + size / 2, y + size / 2 - 0.6 + i * 3.1, grey, bg, 'middle', role='placeholder')
    head = (f'<g id="rm-logo" data-placeholder="true" data-variant="{variant}" data-size-mm="{size}" data-clear-space-mm="{cs}">'
            f'<desc>Placeholder for the RiskMandate seal, {variant} cut, {size} x {size} mm at ({x}, {y}) in this file. Replace this '
            f'group with the supplied SVG or EPS, unaltered, scaled to {size} mm wide. Keep {cs} mm clear on every side.</desc>'
            f'<rect x="{x}" y="{y}" width="{size}" height="{size}" fill="none" stroke="{grey}" stroke-width="0.15"/>')
    side.add(head + ''.join(lab.out) + '</g>', head + ''.join(lab.live) + '</g>')
    side.items += lab.items

def qr(side, pid, x, y, code=24):
    """The person's code, its path bytes unchanged: a white panel the size of the code and quiet zone, black modules."""
    t = open(os.path.join(ROOT, 'team/designer/qr', f'qr-meet-{pid}.svg')).read()
    d = re.search(r'<path d="([^"]+)"', t).group(1); n = int(re.search(r'viewBox="0 0 (\d+)', t).group(1))
    panel = code * n / (n - 8); s = panel / n
    side.add(f'<g id="qr" transform="translate({x:.3f},{y:.3f}) scale({s:.5f})"><rect width="{n}" height="{n}" fill="{WHITE}"/><path d="{d}" fill="{BLACK}"/></g>')
    side.qr = {'x': x, 'y': y, 'panel': panel, 'code': code, 'module': code / (n - 8), 'path_sha': __import__('hashlib').sha256(d.encode()).hexdigest()}
    return panel

def rect(side, x, y, w, h, fill): side.add(f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" fill="{fill}"/>')

def doc(side, body, bg):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">'
            f'<title>{html.escape(side.title)}</title><rect x="0" y="0" width="{W}" height="{H}" fill="{bg}"/>{"".join(body)}</svg>\n')

def asks(side, x, y0, room, bg):
    for i, l in enumerate(['Meet me', 'Book a meeting', 'Talk to my agent']):
        text(side, l, 'in-SemiBold', fit('Talk to my agent', 'in-SemiBold', 3.4, room), x, y0 + i * 5.0, DARK, bg)

def url(side, pid, x, y0, bg, anchor='start'):
    text(side, SITE, 'in-Medium', 2.7, x, y0, GREEN, bg, anchor, role='url')
    text(side, f'/meet/{pid}/', 'in-Medium', 2.7, x, y0 + 3.6, GREEN, bg, anchor, role='url')

def quoted(p): return f'“{p["line"]}”'

# ---- concept A: Band. C1, refined: the band, the seal and the wordmark on the front, the band again on the back ----
def band_front(pid):
    p = PEOPLE[pid]; s = Side(f"{p['first']}: RiskMandate card, concept A Band, front, trim 85 x 55 mm, 3 mm bleed")
    rect(s, 0, 0, B + 9, H, p['colour']); s.bg = WHITE; x = 18; room = SAFE[2] - x
    text(s, p['name'], 'bc-Bold', fit(p['name'], 'bc-Bold', 7.4, room), x, 17.5, DARK, WHITE, role='name')
    text(s, ROLE[pid], 'in-Medium', 2.7, x, 23, GREEN, WHITE, role='role')
    for i, l in enumerate(wrap(quoted(p), 'in-SemiBold', 3.5, room)): text(s, l, 'in-SemiBold', 3.5, x, 31.5 + i * 4.6, DARK, WHITE, role='line')
    logo(s, x, 41, 9, 'containered', WHITE)
    _, ch = wordmark(s, x + 9 + 4.5, 45.5, 32, DARK, WHITE)
    # the wordmark sits on the seal's centre line: move it down by half its cap height
    s.out[-2:] = []; s.live[-2:] = []; s.items[-2:] = []
    wordmark(s, x + 9 + 4.5, 45.5 + ch / 2, 32, DARK, WHITE)
    return s

def band_back(pid):
    p = PEOPLE[pid]; s = Side(f"{p['first']}: RiskMandate card, concept A Band, back, trim 85 x 55 mm, 3 mm bleed")
    rect(s, B + TW - 9, 0, 9 + B, H, p['colour']); s.bg = WHITE
    panel = qr(s, pid, 7.5, (H - 24 * 37 / 29) / 2); x = 7.5 + panel + 4.5; room = (B + TW - 9 - 4) - x
    asks(s, x, 21, room, WHITE); url(s, pid, x, 40.5, WHITE)
    return s

# ---- concept B: Seal. The front is the brand alone, the knockout seal on the container colour; the back is the person ----
def seal_front(pid):
    p = PEOPLE[pid]; s = Side(f"{p['first']}: RiskMandate card, concept B Seal, front, trim 85 x 55 mm, 3 mm bleed"); s.bg = DARK
    logo(s, W / 2 - 8, 11, 16, 'knockout', DARK)
    _, ch = wordmark(s, 0, 0, 40, WHITE, DARK); s.out[-2:] = []; s.live[-2:] = []; s.items[-2:] = []
    wordmark(s, W / 2 - 20, 35.5 + ch, 40, WHITE, DARK)
    text(s, 'Agents with a Mandate', 'in-Medium', 2.8, W / 2, 47.5, WHITE, DARK, 'middle', role='tagline')
    return s

def seal_back(pid):
    p = PEOPLE[pid]; s = Side(f"{p['first']}: RiskMandate card, concept B Seal, back, trim 85 x 55 mm, 3 mm bleed"); s.bg = WHITE
    panel = 24 * 37 / 29; qx = SAFE[2] - panel; qr(s, pid, qx, (H - panel) / 2)
    x = 7.5; room = qx + 3.3 - 4 - x   # to 4 mm short of the code itself (the panel's quiet zone is white on white)
    text(s, p['name'], 'bc-Bold', fit(p['name'], 'bc-Bold', 7.4, room), x, 16.5, DARK, WHITE, role='name')
    rect(s, x, 19.2, 12, 1.2, p['colour'])
    text(s, ROLE[pid], 'in-Medium', fit(ROLE[pid], 'in-Medium', 2.7, room), x, 25.5, GREEN, WHITE, role='role')
    for i, l in enumerate(wrap(quoted(p), 'in-SemiBold', 3.2, room)): text(s, l, 'in-SemiBold', 3.2, x, 32.5 + i * 4.3, DARK, WHITE, role='line')
    url(s, pid, x, 46.8, WHITE)
    return s

# ---- concept C: Poster. The person's colour full bleed, the name big in condensed type; the back carries the seal ----
def poster_front(pid):
    p = PEOPLE[pid]; s = Side(f"{p['first']}: RiskMandate card, concept C Poster, front, trim 85 x 55 mm, 3 mm bleed")
    bg = p['colour']; ink = p['ink'].upper() if len(p['ink']) == 7 else p['ink']; s.bg = bg; x = 7.5; room = SAFE[2] - x
    size = fit(p['name'], 'bc-ExtraBold', 10.5, room)
    text(s, p['name'], 'bc-ExtraBold', size, x, 7.3 + 0.76 * size, ink, bg, role='name')
    text(s, ROLE[pid], 'in-Medium', 2.7, x, 20.5, ink, bg, role='role')
    rect(s, x, 24.2, 14, 0.8, ink)
    for i, l in enumerate(wrap(quoted(p), 'bc-SemiBold', 5.4, room)): text(s, l, 'bc-SemiBold', 5.4, x, 31.8 + i * 5.6, ink, bg, role='line')
    wordmark(s, x, 52.6, 30, ink, bg)
    return s

def poster_back(pid):
    p = PEOPLE[pid]; s = Side(f"{p['first']}: RiskMandate card, concept C Poster, back, trim 85 x 55 mm, 3 mm bleed"); s.bg = WHITE
    panel = 24 * 37 / 29; qx = SAFE[2] - panel; qr(s, pid, qx, (H - panel) / 2)
    logo(s, 9, 9, 9, 'containered', WHITE)
    _, ch = wordmark(s, 0, 0, 24, DARK, WHITE); s.out[-2:] = []; s.live[-2:] = []; s.items[-2:] = []
    wordmark(s, 9 + 9 + 4.5, 13.5 + ch / 2, 24, DARK, WHITE)
    room = qx + 3.3 - 4 - 9
    asks(s, 9, 30, room, WHITE); url(s, pid, 9, 46.5, WHITE)
    rect(s, 0, H - B - 1.5, qx - 2, 1.5 + B, p['colour'])   # the accent: a strip at the foot, clear of the seal and the code
    return s

CONCEPTS = {'a-band': (band_front, band_back), 'b-seal': (seal_front, seal_back), 'c-poster': (poster_front, poster_back)}
SAMPLE = ['indi', 'dinis']

def lum(h):
    h = h.lstrip('#'); h = ''.join(c * 2 for c in h) if len(h) == 3 else h
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; c = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def contrast(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)

report = {}
for cid, makers in CONCEPTS.items():
    os.makedirs(os.path.join(HERE, cid, 'live'), exist_ok=True)
    for pid in SAMPLE:
        for side_name, mk in zip(['front', 'back'], makers):
            s = mk(pid); name = f'{pid}-card-{side_name}.svg'
            open(os.path.join(HERE, cid, name), 'w').write(doc(s, s.out, s.bg))
            open(os.path.join(HERE, cid, 'live', name), 'w').write(doc(s, s.live, s.bg))
            for it in s.items: it['contrast'] = round(contrast(it['fill'], it['bg']), 2)
            report[f'{cid}/{name}'] = {'bg': s.bg, 'items': s.items, 'logo': s.logo, 'qr': getattr(s, 'qr', None), 'safe': SAFE}
json.dump(report, open(os.path.join(HERE, 'checks.json'), 'w'), indent=1)
print('wrote', len(report), 'card sides in', ', '.join(CONCEPTS))
