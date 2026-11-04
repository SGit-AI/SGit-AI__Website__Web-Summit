#!/usr/bin/env python3
"""Three RiskMandate business-card concepts (A Band, B Seal, C Poster), front and back, for two sample people (indi, dinis).

    FONTS=<dir> python3 team/designer/print/concepts-rm/make-concepts.py     (from the repository root; needs fontTools)

FONTS holds Barlow Condensed (Light, Medium, SemiBold, Bold, ExtraBold) and Barlow (Medium, SemiBold) from
github.com/google/fonts (SIL OFL 1.1); Inter and JetBrains Mono (SIL OFL 1.1) are read from the system fonts.

Writes, per concept folder: <id>-card-front.svg / -back.svg (print: 91 x 61 mm, 3 mm bleed, every letter outlined),
live/<id>-card-front.svg / -back.svg (the same layout as live text, for editing), and spec.json (what the sheets and the
checks read). The QR is the person's own team/designer/qr/qr-meet-<id>.svg, embedded byte for byte, scaled only.
The RiskMandate seal is a labelled placeholder (id="rm-logo") until the supplied SVG or EPS is dropped in.
By designer@web-summit.indi. Apache-2.0.
"""
import json, math, os, re, html
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.environ.get('FONTS', os.path.expanduser('~/.cache/web-summit-fonts'))
DESIGN = {p['id']: p for p in json.load(open(os.path.join(ROOT, 'data/design.json')))['people']}
TEAM = {m['id']: m for m in json.load(open(os.path.join(ROOT, 'data/team.json')))['members']}

# ---- the copy, from the brief (content/print.md, data/team.json) ----
# Order as in content/print.md. Name and line from data/design.json (= content/print.md), except Vicky's name, which is
# her own (people/vicky/business-card.json). Role: data/team.json, cut to one line, or the person's own card file.
# poster: the line broken for concept C's big type (the characters unchanged).
PEOPLE = {
    'dinis':  {'role': 'Operator: the strategy, the senior meetings', 'poster': ['Ask me what my', 'agents did today.']},
    'nimay':  {'role': 'Business, positioning, outreach and investors', 'poster': ['My agents have', 'a policy.', 'Do yours?']},
    'angelo': {'role': 'Technical lead: the site, the agents, the behaviour policies', 'poster': ['Ask me how I', 'control my agents.']},
    'jose':   {'role': 'Technical: automation, messaging, the agents', 'poster': ['I brought 6 agents.', 'Ask me why.']},
    'vicky':  {'role': None, 'poster': ['Who’s on the', 'other side of', 'your agent?']},
    'silvio': {'role': 'Ideas, outreach, local, and video', 'poster': ['Agents with', 'a mandate.']},
    'indi':   {'role': 'The message, outreach, and the factory of examples', 'poster': ['Your agents.', 'Your rules.']},
}
for pid, p in PEOPLE.items():
    own = os.path.join(ROOT, f'people/{pid}/business-card.json')
    own = json.load(open(own)) if os.path.exists(own) else {}
    p['name'] = own.get('name', DESIGN[pid]['name']); p['line'] = DESIGN[pid]['line']
    if own.get('title'): p['role'] = own['title']
    p['colour'] = DESIGN[pid]['colour']; p['ink'] = DESIGN[pid]['ink']
    p['url'] = f'https://web-summit.sgit.ai/meet/{pid}/'
    assert ' '.join(p['poster']).replace('’', "'") == p['line'], pid
    assert own.get('title') == p['role'] or p['role'] in TEAM[pid]['role'].replace('RiskMandate, ', ''), pid
ONLY = [a for a in os.sys.argv[1:] if a in PEOPLE] or list(PEOPLE)
ASKS = ['Meet me', 'Book a meeting', 'Talk to my agent']   # the three asks, as on C1 and the merch

# ---- colours ----
WHITE, INK, GREEN, GREY = '#FFFFFF', '#161615', '#1A7F5A', '#8C8C8A'
def ink_for(p): return WHITE if p['ink'].lower() == '#ffffff' else INK

# ---- type ----
SYS = '/usr/share/fonts'
FONTS = {
    ('Barlow Condensed', 300): f'{FD}/BarlowCondensed-Light.ttf', ('Barlow Condensed', 500): f'{FD}/BarlowCondensed-Medium.ttf',
    ('Barlow Condensed', 600): f'{FD}/BarlowCondensed-SemiBold.ttf', ('Barlow Condensed', 700): f'{FD}/BarlowCondensed-Bold.ttf',
    ('Barlow Condensed', 800): f'{FD}/BarlowCondensed-ExtraBold.ttf',
    ('Barlow', 500): f'{FD}/Barlow-Medium.ttf', ('Barlow', 600): f'{FD}/Barlow-SemiBold.ttf',
    ('Inter', 400): f'{SYS}/opentype/inter/Inter-Regular.otf', ('Inter', 500): f'{SYS}/opentype/inter/Inter-Medium.otf',
    ('Inter', 600): f'{SYS}/opentype/inter/Inter-SemiBold.otf',
    ('JetBrains Mono', 400): f'{SYS}/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf',
    ('JetBrains Mono', 500): f'{SYS}/truetype/jetbrains-mono/JetBrainsMono-Medium.ttf',
}
_cache = {}
def font(fam, wt):
    k = (fam, wt)
    if k not in _cache: _cache[k] = TTFont(FONTS[k])
    return _cache[k]
def upm(f): return f['head'].unitsPerEm
def cap(fam, wt): f = font(fam, wt); return f['OS/2'].sCapHeight / upm(f)
def width(txt, fam, wt, size):
    f = font(fam, wt); cm = f.getBestCmap(); hm = f['hmtx']
    return sum(hm[cm.get(ord(c), '.notdef')][0] for c in txt) / upm(f) * size
PT = 25.4 / 72   # mm per point
def n(v): return f'{v:.2f}'.rstrip('0').rstrip('.')

class Side:
    """One side of a card, built twice: outlined (for print) and live text (for editing)."""
    def __init__(self, bg): self.out, self.live, self.items = [], [], []; self.bg = bg
    def raw(self, s): self.out.append(s); self.live.append(s)
    def text(self, txt, fam, wt, size, x, y, fill, role, anchor='start', on=None):
        txt = txt.replace("'", '’')
        w = width(txt, fam, wt, size); x0 = x - w / 2 if anchor == 'middle' else x - w if anchor == 'end' else x
        f = font(fam, wt); gs = f.getGlyphSet(); cm = f.getBestCmap(); hm = f['hmtx']; s = size / upm(f)
        pen = SVGPathPen(gs, ntos=n); cur = 0
        for c in txt:
            g = cm.get(ord(c), '.notdef'); gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x0 + cur * s, y))); cur += hm[g][0]
        bg = on or self.bg
        self.out.append(f'<path class="safe" data-role="{role}" d="{pen.getCommands()}" fill="{fill}"/>')
        self.live.append(f'<text class="safe" data-role="{role}" data-bg="{bg}" x="{n(x0)}" y="{n(y)}" font-family="{fam}" '
                         f'font-weight="{wt}" font-size="{n(size)}" fill="{fill}">{html.escape(txt)}</text>')
        self.items.append({'role': role, 'text': txt, 'font': fam, 'weight': wt, 'pt': round(size / PT, 2), 'fill': fill, 'bg': bg,
                           'box': [round(x0, 2), round(y - cap(fam, wt) * size, 2), round(x0 + w, 2), round(y, 2)]})
        return w
    def wordmark(self, x, y_mid, capmm, fill, anchor='start'):
        """RISK MANDATE: Barlow Condensed, RISK light, MANDATE bold (the merch's wordmark), centred on y_mid."""
        size = capmm / cap('Barlow Condensed', 700); gap = 0.22 * size
        w = width('RISK', 'Barlow Condensed', 300, size) + gap + width('MANDATE', 'Barlow Condensed', 700, size)
        x0 = x - w / 2 if anchor == 'middle' else x; yb = y_mid + capmm / 2
        self.text('RISK', 'Barlow Condensed', 300, size, x0, yb, fill, 'wordmark')
        self.text('MANDATE', 'Barlow Condensed', 700, size, x0 + w - width('MANDATE', 'Barlow Condensed', 700, size), yb, fill, 'wordmark')
        return x0, w
    def logo(self, cx, cy, d, cut):
        """The placeholder for the supplied seal: its exact size and position, a thin grey outline, labelled."""
        f = ('Barlow Condensed', 600); size = min(d * 0.72 / (width('RM LOGO', *f, 1)), d * 0.25)
        r = d / 2; inner = []
        lab = Side(self.bg)
        lab.text('RM LOGO', *f, size, cx, cy + cap(*f) * size / 2, GREY, 'placeholder', 'middle')
        g = (f'<g id="rm-logo" class="safe" data-role="logo" data-cut="{cut}" data-d="{n(d)}">'
             f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r - 0.1)}" fill="none" stroke="{GREY}" stroke-width="0.2"/>')
        self.out.append(g + lab.out[0] + '</g>'); self.live.append(g + lab.live[0] + '</g>')
        self.items.append({'role': 'logo', 'cut': cut, 'd': d, 'box': [round(cx - r, 2), round(cy - r, 2), round(cx + r, 2), round(cy + r, 2)],
                           'clear': d / 2})
    def qr(self, pid, x, y, mm=24.0):
        """The person's own QR file, unaltered, scaled so the 29-module symbol is mm wide; panel = 37 modules."""
        src = open(os.path.join(ROOT, f'team/designer/qr/qr-meet-{pid}.svg')).read()
        inner = re.sub(r'^.*?<desc>.*?</desc>', '', src.strip(), flags=re.S); inner = re.sub(r'</svg>\s*$', '', inner)
        k = math.ceil(mm / 29 * 1e6) / 1e6                                              # never under mm
        self.raw(f'<g id="qr" class="safe" data-role="qr" data-url="{PEOPLE[pid]["url"]}" shape-rendering="crispEdges" '
                 f'transform="translate({n(x)},{n(y)}) scale({k:.6f})">{inner}</g>')
        self.items.append({'role': 'qr', 'box': [round(x, 2), round(y, 2), round(x + 37 * k, 2), round(y + 37 * k, 2)],
                           'modules': [round(x + 4 * k, 2), round(y + 4 * k, 2), round(x + 33 * k, 2), round(y + 33 * k, 2)], 'mm': mm})
        return 37 * k
    def svg(self, title, live=False):
        body = ''.join(self.live if live else self.out)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="91mm" height="61mm" viewBox="0 0 91 61">'
                f'<title>{html.escape(title)}</title><rect x="0" y="0" width="91" height="61" fill="{self.bg}"/>{body}</svg>\n')

B, TRIM_W, TRIM_H = 3, 85, 55
SAFE = (B + 4, B + 4, B + TRIM_W - 4, B + TRIM_H - 4)   # 7, 7, 84, 54
QR_PANEL = 24 * 37 / 29                                   # 30.62 mm: the 24 mm symbol and its 4-module quiet zone

def fit(txt, fam, wt, size, room, floor):
    """Largest size <= size so that txt fits room; never under floor (asserted)."""
    s = min(size, room / width(txt, fam, wt, 1)); assert s >= floor - 1e-6, (txt, s, floor); return s

# ---------------- Concept A: Band (closest to C1) ----------------
def a_front(p):
    s = Side(WHITE)
    s.raw(f'<rect x="0" y="0" width="12" height="61" fill="{p["colour"]}"/>')          # the person's band, full bleed
    x, room = 18, SAFE[2] - 18
    s.text(p['name'], 'Barlow Condensed', 700, fit(p['name'], 'Barlow Condensed', 700, 17 * PT, room, 10 * PT), x, 16.5, INK, 'name')
    s.text(p['role'], 'Barlow', 500, fit(p['role'], 'Barlow', 500, 7.5 * PT, room, 7 * PT), x, 22, GREEN, 'role')
    line = f'“{p["line"]}”'
    s.text(line, 'Barlow Condensed', 600, fit(line, 'Barlow Condensed', 600, 10 * PT, room, 8 * PT), x, 30.5, INK, 'line')
    s.logo(18 + 5.5, 45, 11, 'containered')
    s.wordmark(18 + 11 + 5.5, 45, 3.6, INK)
    return s

def a_back(p, pid):
    s = Side(WHITE)
    s.qr(pid, 9, (61 - QR_PANEL) / 2)
    mtop = (61 - QR_PANEL) / 2 + 4 * 24 / 29                                            # top of the modules
    x = 9 + QR_PANEL + 6
    s.raw(f'<rect x="{n(x)}" y="{n(mtop)}" width="10" height="1.2" fill="{p["colour"]}"/>')
    for i, a in enumerate(ASKS): s.text(a, 'Barlow Condensed', 600, 10 * PT, x, mtop + 6.2 + i * 4.5, INK, 'asks')
    s.text('web-summit.sgit.ai', 'Barlow', 500, 7.5 * PT, x, mtop + 20.6, INK, 'url')
    s.text(f'/meet/{pid}/', 'Barlow', 500, 7.5 * PT, x, mtop + 24, INK, 'url')
    return s

# ---------------- Concept B: Seal (leads with the RiskMandate seal) ----------------
def b_front(p):
    s = Side(INK)
    s.logo(45.5, 24, 16, 'knockout')
    s.wordmark(45.5, 42, 3.2, WHITE, 'middle')
    s.text(p['line'], 'Inter', 500, 7.5 * PT, 45.5, 51, WHITE, 'line', 'middle')
    return s

def b_back(p, pid):
    s = Side(WHITE)
    x, room = 8, SAFE[2] - 8
    s.text(p['name'], 'Barlow Condensed', 700, fit(p['name'], 'Barlow Condensed', 700, 17 * PT, room, 10 * PT), x, 15, INK, 'name')
    s.text(p['role'], 'Inter', 500, fit(p['role'], 'Inter', 500, 7.5 * PT, room, 7 * PT), x, 20.5, GREEN, 'role')
    s.qr(pid, SAFE[0], SAFE[3] - QR_PANEL)
    tx = SAFE[0] + QR_PANEL + 5
    mtop, mbot = SAFE[3] - QR_PANEL + 4 * 24 / 29, SAFE[3] - 4 * 24 / 29                # the QR's module edges
    s.raw(f'<rect x="{n(tx)}" y="{n(mtop)}" width="10" height="1.2" fill="{p["colour"]}"/>')
    for i, a in enumerate(ASKS): s.text(a, 'Inter', 600, 7.5 * PT, tx, mtop + 8 + i * 4.2, INK, 'asks')
    url = f'web-summit.sgit.ai/meet/{pid}/'
    s.text(url, 'Inter', 400, fit(url, 'Inter', 400, 7 * PT, SAFE[2] - tx, 7 * PT), tx, mbot, INK, 'url')
    return s

# ---------------- Concept C: Poster (the card as a small version of the shirt) ----------------
def c_front(p, pid):
    s = Side(WHITE)
    x = 8
    s.text(p['name'], 'Barlow Condensed', 800, fit(p['name'], 'Barlow Condensed', 800, 20 * PT, 76, 10 * PT), x, 16, INK, 'name')
    s.text(p['role'], 'Barlow Condensed', 500, fit(p['role'], 'Barlow Condensed', 500, 8.5 * PT, 76, 7 * PT), x, 21.5, GREEN, 'role')
    qx = SAFE[2] - QR_PANEL
    s.qr(pid, qx, SAFE[3] - QR_PANEL)
    mbot = SAFE[3] - 4 * 24 / 29
    for i, a in enumerate(ASKS): s.text('› ' + a, 'JetBrains Mono', 500, 7.5 * PT, x, mbot - 22 + i * 4.2, INK, 'asks')
    s.text('web-summit.sgit.ai', 'JetBrains Mono', 400, 7 * PT, x, mbot - 3.4, INK, 'url')
    s.text(f'/meet/{pid}/', 'JetBrains Mono', 400, 7 * PT, x, mbot, INK, 'url')
    return s

def c_back(p):
    s = Side(WHITE); ink = ink_for(p)
    s.raw(f'<rect x="0" y="0" width="91" height="40" fill="{p["colour"]}"/>')            # the person's colour; white below holds the seal
    lines = p['poster']; fam, wt = 'Barlow Condensed', 800
    size = min(76 / max(width(l, fam, wt, 1) for l in lines), 13, 26 / (cap(fam, wt) + 0.98 * (len(lines) - 1)))   # fits 76 mm wide, 26 mm tall
    pitch = size * 0.98; ch = cap(fam, wt) * size
    top = 7 + (33 - 7 - (ch + pitch * (len(lines) - 1))) / 2                             # centred in the coloured field's safe area
    for i, l in enumerate(lines): s.text(l, fam, wt, size, 8, top + ch + i * pitch, ink, 'line', on=p['colour'])
    s.logo(8 + 4.25, 49, 8.5, 'containered')
    s.wordmark(8 + 8.5 + 4.25, 49, 3.0, INK)
    return s

CONCEPTS = {
    'a-band': {
        'name': 'A. Band', 'build': lambda p, pid: (a_front(p), a_back(p, pid)),
        'rationale': 'C1 kept, made more RiskMandate: the seal and the green join the band, the role is added and the type is tightened.',
        'palette': [('White', WHITE), ('Container black', INK), ('RiskMandate green', GREEN)],
        'type': 'Barlow Condensed (name, line, asks, wordmark) + Barlow (role, URL)',
        'notes': [
            'The band stays 9 mm wide on the trimmed card, as on C1. A wider band (12 to 15 mm) gives the person\'s colour more weight; narrower than 6 mm and a 1 mm trim drift starts to show.',
            'The role is set in RiskMandate green so the brand colour appears on every card, whatever the person\'s colour. If the team prefers one ink, set it in container black.',
            'The QR is on the back only, as on C1. The front says who; the back says how to carry on. Moving the QR to the front would need the line or the seal to go.',
        ]},
    'b-seal': {
        'name': 'B. Seal', 'build': lambda p, pid: (b_front(p), b_back(p, pid)),
        'rationale': 'The seal leads: a calm, dark brand face, and a white working face where the name and the QR sit together.',
        'palette': [('Container black', INK), ('White', WHITE), ('RiskMandate green', GREEN)],
        'type': 'Barlow Condensed (name, wordmark) + Inter (role, line, asks, URL)',
        'notes': [
            'The front is a full-bleed container black (#161615) with the knockout seal, the cut the brand keeps for dark surfaces. Ask the printer for a rich black so it does not print grey on matt stock.',
            'The person\'s colour appears only as a short rule on the white side, so it never comes near the mark. Dinis\'s colour is near black, so his rule reads as black.',
            'The name and the QR share the white side, so one look gives both. The person\'s line moves to the brand side, under the wordmark; it could move back under the role if the team wants it with the name.',
        ]},
    'c-poster': {
        'name': 'C. Poster', 'build': lambda p, pid: (c_front(p, pid), c_back(p)),
        'rationale': 'The card is a small version of the shirt: the person\'s line, big, in their colour, with the seal on a white strip below.',
        'palette': [('White', WHITE), ('Container black', INK), ('RiskMandate green', GREEN)],
        'type': 'Barlow Condensed (name, role, line, wordmark) + JetBrains Mono (asks, URL)',
        'notes': [
            'The back is the person\'s colour, full bleed, with their line in Barlow Condensed ExtraBold: the same voice as their T-shirt, so card and shirt read as one set across a hall.',
            'The seal sits on its own white strip, with half its width clear on every side, so the mark is never shown on a coloured field and the colour never touches it.',
            'The asks and URL are set in a monospace with a › prompt: the "talk to my agent" idea, a little playful. If it reads too technical, set them in Barlow Condensed as on A.',
        ]},
}

def cmyk(hexc):   # a naive conversion for reference; the printer proofs and matches
    r, g, b = (int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5)); k = 1 - max(r, g, b)
    if k >= 1: return [0, 0, 0, 100]
    return [round(v * 100) for v in ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k)]

spec_all = {}
for cid, C in CONCEPTS.items():
    d = os.path.join(HERE, cid); os.makedirs(os.path.join(d, 'live'), exist_ok=True)
    spec = {'concept': cid, 'name': C['name'], 'rationale': C['rationale'], 'type': C['type'], 'notes': C['notes'],
            'palette': [{'name': nm, 'hex': h, 'cmyk': cmyk(h)} for nm, h in C['palette']], 'files': {}}
    for pid in ONLY:
        p = PEOPLE[pid]; front, back = C['build'](p, pid)
        for side, S in (('front', front), ('back', back)):
            title = f'{p["name"]}: RiskMandate business card, concept {C["name"]}, {side}. Trim 85 x 55 mm, 3 mm bleed (91 x 61 mm)'
            fn = f'{pid}-card-{side}.svg'
            open(os.path.join(d, fn), 'w').write(S.svg(title))
            open(os.path.join(d, 'live', fn), 'w').write(S.svg(title + ', live text', live=True))
            spec['files'][fn] = {'person': pid, 'side': side, 'bg': S.bg, 'items': S.items,
                                 'accent': {'name': f'{p["name"].split()[0]}’s colour', 'hex': p['colour'], 'cmyk': cmyk(p['colour'])}}
    json.dump(spec, open(os.path.join(d, 'spec.json'), 'w'), indent=1, ensure_ascii=False)
    spec_all[cid] = spec
print('made', ', '.join(f'{c}: {len(s["files"])} files' for c, s in spec_all.items()))
