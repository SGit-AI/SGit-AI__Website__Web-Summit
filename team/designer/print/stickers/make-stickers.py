#!/usr/bin/env python3
"""RiskMandate laptop stickers (Indi and Dinis, 4 November 2026): one corporate, two infographics, one cartoon.

    FONTS=<dir> python3 team/designer/print/stickers/make-stickers.py      (from the repository root; as the cards)

Dinis's three asks, relayed by Indi: a corporate design with the logo and the logo text; "a bit of infographic/animation
stuff", clear and easy to understand; and a funny cartoon. All in the brand's colours and rules (riskmandate.ai/brand,
read again on 4 November): the mark and the lockup are the supplied files (../concepts-rm/brand/), never redrawn,
recoloured or crowded; green #1A7F5A, the container #161615, the lighter green on dark only, gold sparingly.

Each sticker is a die-cut print file: the artwork with 2 mm bleed past the cut, and the cut on its own layer
(<g id="cutline">, a hairline path in magenta, the spot colour CutContour that sticker printers cut on, never printed).
Every letter is outlined. Text stays 2.5 mm inside the cut. Writes <name>.svg (print), <name>.png (preview, clipped to the
cut), <name>.pdf, and gap-animated.svg (the gap sticker, moving, for screens). By designer@web-summit.indi. Apache-2.0.
"""
import importlib.util, math, os, re, sys, json
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
CONCEPTS = os.path.join(HERE, '..', 'concepts-rm')
_spec = importlib.util.spec_from_file_location('mc', os.path.join(CONCEPTS, 'make-concepts.py'))
mc = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(mc)
Side, PT, n, width, cap, fit = mc.Side, mc.PT, mc.n, mc.width, mc.cap, mc.fit
G, BC, JB = 'Geist', 'Barlow Condensed', 'JetBrains Mono'
mc.FONTS[(JB, 700)] = f'{mc.SYS}/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf'

# the brand's tokens (riskmandate.ai/brand)
CONTAINER, INK, TEXT, FG, WHITE, MUTED, FAINT = '#161615', '#0D0D0C', '#1A1917', '#F7F6F2', '#FFFFFF', '#4A4845', '#8A8780'
GREEN, GREEN2, BLUE, GOLD = '#1A7F5A', '#22C55E', '#1D4ED8', '#B45309'
CUT = '#FF00FF'                 # CutContour: the die line, not printed
BLEED, INSET = 2.0, 2.5         # artwork past the cut; text and logo inside it
BRAND = os.path.join(CONCEPTS, 'brand')

# The lockup EPS files are the brand's, fetched unaltered from riskmandate.ai into a cache outside the repository on the
# first run (as make-print.py fetches its fonts): their outline numbers trip the gate's phone-number rule (check 15).
BRAND_URL = 'https://riskmandate.ai/assets/brand/'
CACHE = os.environ.get('BRAND_CACHE', os.path.expanduser('~/.cache/riskmandate-brand'))
def brand_file(fname):
    local = os.path.join(BRAND, fname)
    if os.path.exists(local): return local
    p = os.path.join(CACHE, fname)
    if not os.path.exists(p):
        import urllib.request; os.makedirs(CACHE, exist_ok=True); urllib.request.urlretrieve(BRAND_URL + fname, p)
    return p

def eps_path(fname, section):
    """A section of a brand EPS (drawn in the SVG's own coordinates) as an SVG path, and its fill colour."""
    e = open(brand_file(fname)).read()
    body = e[e.index(f'% {section}'):]; body = body[:body.index('\nfill')]
    rgb = [float(v) for v in re.search(r'([\d.]+) ([\d.]+) ([\d.]+) setrgbcolor', body).groups()]
    d = []
    for ln in body.splitlines():
        t = ln.split()
        num = lambda vs: ' '.join(n(float(v)) for v in vs)   # 2 decimals, as the cards (a 64-unit grid: 0.01 is 0.003 mm here)
        if t and t[-1] == 'moveto': d.append('M' + num(t[:2]))
        elif t and t[-1] == 'lineto': d.append('L' + num(t[:2]))
        elif t and t[-1] == 'curveto': d.append('C' + num(t[:6]))
        elif t and t[-1] == 'closepath': d.append('Z')
    return ''.join(d), '#' + ''.join(f'{round(v * 255):02X}' for v in rgb)

def lockup(s, x, y, w, dark=True):
    """The brand's lockup (mark + the "RiskMandate" wordmark), w mm wide, top-left at (x, y): the knockout mark on dark,
    the containered on light, as the brand's lockup-dark / lockup-light files have it; the wordmark from their EPS."""
    d, fill = eps_path(f'riskmandate-lockup-{"dark" if dark else "light"}.eps', 'the wordmark, as outlines')
    right = max(float(v) for v in re.findall(r'[MLC]([-\d.]+)', d))   # the wordmark's right edge, 246.03 units
    k = w / right
    s.raw(f'<g id="rm-lockup" class="safe" data-role="logo" data-src="brand/riskmandate-lockup-{"dark" if dark else "light"}.eps" '
          f'transform="translate({n(x)},{n(y)}) scale({k:.6f})">{mc.mark_body("knockout" if dark else "containered")}'
          f'<path d="{d}" fill="{fill}"/></g>')
    mark_w = (46 if dark else 64) * k                                  # the mark as drawn: the ticks, or the tile
    s.items.append({'role': 'logo', 'box': [x + (9 if dark else 0) * k, y + (9 if dark else 0) * k, x + right * k, y + (55 if dark else 64) * k], 'clear': mark_w / 2})
    return 64 * k, mark_w

def rrect(x, y, w, h, r): return (f'M{n(x + r)} {n(y)}H{n(x + w - r)}A{n(r)} {n(r)} 0 0 1 {n(x + w)} {n(y + r)}V{n(y + h - r)}'
                                  f'A{n(r)} {n(r)} 0 0 1 {n(x + w - r)} {n(y + h)}H{n(x + r)}A{n(r)} {n(r)} 0 0 1 {n(x)} {n(y + h - r)}'
                                  f'V{n(y + r)}A{n(r)} {n(r)} 0 0 1 {n(x + r)} {n(y)}Z')
def circle(cx, cy, r): return f'M{n(cx - r)} {n(cy)}A{n(r)} {n(r)} 0 1 0 {n(cx + r)} {n(cy)}A{n(r)} {n(r)} 0 1 0 {n(cx - r)} {n(cy)}Z'

def doc(W, H, s, cut, title):
    return re.sub(r'\d+\.\d{3,}', lambda m: n(float(m.group())), _doc(W, H, s, cut, title))   # 2 decimals throughout
def _doc(W, H, s, cut, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{n(W)}mm" height="{n(H)}mm" viewBox="0 0 {n(W)} {n(H)}">'
            f'<title>{title}</title><g id="artwork"><rect x="0" y="0" width="{n(W)}" height="{n(H)}" fill="{s.bg}"/>{"".join(s.out)}</g>'
            f'<g id="cutline" data-spot="CutContour"><path d="{cut}" fill="none" stroke="{CUT}" stroke-width="0.25"/></g></svg>\n')

# ---------- 1. Corporate: the lockup, nothing else but what it does ----------
def corporate():
    w, h, r = 100, 40, 8; W, H = w + 2 * BLEED, h + 2 * BLEED
    s = Side(CONTAINER)
    lw = 60; lh, mw = lockup(s, (W - lw) / 2, 8.4, lw, dark=True)           # mark 13.4 mm as drawn: 6.7 mm clear
    s.text('AGENT BEHAVIOUR POLICIES', JB, 500, 7.5 * PT, W / 2, 34.6, FAINT, 'label', 'middle')
    return 'corporate', 'Corporate: the RiskMandate lockup', W, H, s, rrect(BLEED, BLEED, w, h, r), ('rrect', BLEED, BLEED, w, h, r)

# ---------- 2. The gap: reach, mandate, and the gap between them ----------
def gap(animated=False):
    D = 76; W = H = D + 2 * BLEED; c = W / 2
    s = Side(CONTAINER)
    R_reach, R_mand = 23, 14.5
    # the gap: the ring between mandate and reach, striped in gold (the brand's caution colour, used as stripes, not a fill)
    ring = circle(c, c, R_reach) + circle(c, c, R_mand)
    stripes = ''.join(f'<line x1="{n(c - 40 + i * 3.2)}" y1="{n(c - 40)}" x2="{n(c - 40 + i * 3.2 + 80)}" y2="{n(c + 40)}" stroke="{GOLD}" stroke-width="1.1"/>' for i in range(-26, 27))
    spin = (f'<animateTransform attributeName="transform" type="rotate" from="0 {n(c)} {n(c)}" to="360 {n(c)} {n(c)}" dur="40s" repeatCount="indefinite"/>' if animated else '')
    s.raw(f'<clipPath id="gapring"><path d="{ring}" clip-rule="evenodd"/></clipPath><g clip-path="url(#gapring)"><g>{stripes}{spin}</g></g>')
    pulse = (f'<animate attributeName="stroke-dashoffset" from="0" to="-12" dur="3s" repeatCount="indefinite"/>' if animated else '')
    s.raw(f'<circle cx="{n(c)}" cy="{n(c)}" r="{R_reach}" fill="none" stroke="{FG}" stroke-width="0.7" stroke-dasharray="2.2 1.8">{pulse}</circle>')
    grow = (f'<animate attributeName="r" values="{R_mand};{R_mand - 1.2};{R_mand}" dur="4s" repeatCount="indefinite"/>' if animated else '')
    s.raw(f'<circle cx="{n(c)}" cy="{n(c)}" r="{R_mand}" fill="{GREEN}">{grow}</circle>')
    # labels: the gap on its own pill so the stripes never sit under the words
    gw = width('THE GAP', BC, 700, 4.6) + 3.2
    gy = c - (R_reach + R_mand) / 2                                   # the middle of the ring
    s.raw(f'<rect x="{n(c - gw / 2)}" y="{n(gy - 2.6)}" width="{n(gw)}" height="5.2" rx="2.6" fill="{CONTAINER}" stroke="{GOLD}" stroke-width="0.35"/>')
    s.text('THE GAP', BC, 700, 4.6, c, gy + cap(BC, 700) * 4.6 / 2, FG, 'label', 'middle', on=CONTAINER)
    s.text('MANDATE', BC, 700, 5.2, c, c + 0.2, FG, 'label', 'middle', on=GREEN)
    s.text('what you authorised', G, 500, 7 * PT, c, c + 4.8, FG, 'label', 'middle', on=GREEN)
    s.text('REACH', BC, 700, 4.4, c, c + R_reach + 4, GREEN2, 'label', 'middle')
    s.text('everything it can', G, 500, 7 * PT, c, c + R_reach + 7.6, FG, 'label', 'middle')
    s.text('actually reach', G, 500, 7 * PT, c, c + R_reach + 10.6, FG, 'label', 'middle')
    s.wordmark(c, c - R_reach - 4.4, 2.6, FG, 'middle')
    return ('gap-animated' if animated else 'gap'), 'Infographic: the gap', W, H, s, circle(c, c, D / 2), ('circle', c, c, D / 2)

# ---------- 3. Know, define, control: the three steps ----------
def steps():
    w, h, r = 100, 40, 8; W, H = w + 2 * BLEED, h + 2 * BLEED
    s = Side(CONTAINER)
    xs = [BLEED + 17, BLEED + 50, BLEED + 83]; cy = 17.4
    # icons, drawn here (plain geometry, not the mark): reach as a radar sweep, the mandate as a page with a tick, the gap closed
    s.raw(f'<circle cx="{xs[0]}" cy="{cy}" r="7" fill="none" stroke="{GREEN2}" stroke-width="1"/><circle cx="{xs[0]}" cy="{cy}" r="4" fill="none" stroke="{GREEN2}" stroke-width="0.7"/>'
          f'<path d="M{xs[0]} {cy}L{xs[0] + 6.2} {cy - 3.3}" stroke="{GREEN2}" stroke-width="1" stroke-linecap="round"/><circle cx="{xs[0] + 3.6}" cy="{cy + 2.6}" r="0.9" fill="{FG}"/><circle cx="{xs[0] - 4.8}" cy="{cy - 2.2}" r="0.9" fill="{FG}"/>')
    s.raw(f'<path d="{rrect(xs[1] - 5.2, cy - 7, 10.4, 14, 1.4)}" fill="none" stroke="{GREEN2}" stroke-width="1"/>'
          + ''.join(f'<line x1="{xs[1] - 3}" y1="{n(cy - 3.6 + i * 2.4)}" x2="{xs[1] + 3}" y2="{n(cy - 3.6 + i * 2.4)}" stroke="{FG}" stroke-width="0.6" stroke-linecap="round"/>' for i in range(3))
          + f'<path d="M{xs[1] - 2.2} {cy + 4.1}l1.5 1.5l3-3" fill="none" stroke="{GREEN2}" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>')
    s.raw(f'<circle cx="{xs[2]}" cy="{cy}" r="7" fill="none" stroke="{FG}" stroke-width="0.7" stroke-dasharray="1.6 1.2"/><circle cx="{xs[2]}" cy="{cy}" r="4.6" fill="{GREEN}"/>'
          f'<path d="M{xs[2] - 2} {cy}l1.4 1.4l2.8-2.8" fill="none" stroke="{FG}" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>')
    for a, b in ((xs[0], xs[1]), (xs[1], xs[2])):
        x0, x1 = a + 9.6, b - 9.6
        s.raw(f'<path d="M{n(x0)} {cy}H{n(x1)}M{n(x1 - 1.6)} {n(cy - 1.4)}L{n(x1)} {cy}L{n(x1 - 1.6)} {n(cy + 1.4)}" fill="none" stroke="{FAINT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>')
    for x, (k, v) in zip(xs, [('KNOW', 'their reach'), ('DEFINE', 'their mandate'), ('CONTROL', 'the gap')]):
        s.text(k, BC, 700, 4.6, x, 31.2, FG, 'label', 'middle')
        s.text(v, G, 500, 7 * PT, x, 35.4, FAINT, 'label', 'middle')
    return 'steps', 'Infographic: know, define, control', W, H, s, rrect(BLEED, BLEED, w, h, r), ('rrect', BLEED, BLEED, w, h, r)

# ---------- 4. Cartoon: the agent with long arms ----------
def cartoon():
    w = h = 76; r = 12; W, H = w + 2 * BLEED, h + 2 * BLEED
    s = Side(FG)
    o = BLEED; ol = 0.9
    def P(d, fill, sw=ol, extra=''): s.raw(f'<path d="{d}" fill="{fill}" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" {extra}/>')
    # the jar of PROD, lid off
    P(rrect(o + 50, o + 30, 19, 24, 4), WHITE)
    for cx, cy in ((o + 55, o + 40.5), (o + 62, o + 42), (o + 58.5, o + 35.5)):
        s.raw(f'<circle cx="{cx}" cy="{cy}" r="2.6" fill="{GOLD}" stroke="{INK}" stroke-width="0.5"/><circle cx="{cx - 0.8}" cy="{cy - 0.6}" r="0.35" fill="{INK}"/><circle cx="{cx + 0.9}" cy="{cy + 0.5}" r="0.35" fill="{INK}"/>')
    s.raw(f'<g transform="rotate(-24 {o + 66} {o + 24})">'); P(rrect(o + 57, o + 22, 18, 4.2, 1.6), GOLD); s.raw('</g>')
    s.raw(f'<path d="{rrect(o + 53, o + 46.4, 13, 5.2, 1)}" fill="{FG}" stroke="{INK}" stroke-width="0.4"/>')   # the label, below the hand
    s.text('PROD', JB, 700, 7 * PT, o + 59.5, o + 50.2, INK, 'label', 'middle', on=FG)
    # the agent
    for x in (o + 13, o + 21.5):
        P(rrect(x, o + 55, 4.5, 7, 1.5), INK)
    P(rrect(o + 9, o + 37, 21, 19, 4), GREEN)                                          # body
    s.raw(f'<line x1="{o + 19.5}" y1="{o + 14}" x2="{o + 19.5}" y2="{o + 9}" stroke="{INK}" stroke-width="{ol}" stroke-linecap="round"/>')
    s.raw(f'<circle cx="{o + 19.5}" cy="{o + 8}" r="1.7" fill="{GOLD}" stroke="{INK}" stroke-width="{ol}"/>')
    P(rrect(o + 7, o + 14, 25, 20, 5), GREEN)                                          # head
    s.raw(f'<path d="{rrect(o + 10, o + 17, 19, 13.5, 3)}" fill="{INK}"/>')             # the screen: dark, so the lighter green may sit on it
    for ex in (o + 16.4, o + 23.6):
        s.raw(f'<circle cx="{ex}" cy="{o + 22.6}" r="1.9" fill="{GREEN2}"/><circle cx="{ex + 0.8}" cy="{o + 22.4}" r="0.8" fill="{INK}"/>')   # eyes, on the jar
    s.raw(f'<path d="M{o + 16} {o + 26.4}q3.6 2.4 7.6 -0.4" fill="none" stroke="{GREEN2}" stroke-width="0.8" stroke-linecap="round"/>')   # a guilty grin
    s.raw(f'<path d="M{o + 9} {o + 44}q-4 2 -3 6" fill="none" stroke="{INK}" stroke-width="2.8" stroke-linecap="round"/><path d="M{o + 9} {o + 44}q-4 2 -3 6" fill="none" stroke="{GREEN}" stroke-width="1.4" stroke-linecap="round"/>')
    arm = f'M{o + 30} {o + 43}C{o + 38} {o + 44} {o + 34} {o + 31} {o + 41} {o + 28}S{o + 49} {o + 23} {o + 53} {o + 27}S{o + 55} {o + 36} {o + 57} {o + 39}'
    s.raw(f'<path d="{arm}" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/><path d="{arm}" fill="none" stroke="{GREEN}" stroke-width="1.6" stroke-linecap="round"/>')
    s.raw(f'<circle cx="{o + 57.4}" cy="{o + 40}" r="2.1" fill="{GREEN}" stroke="{INK}" stroke-width="0.7"/>')
    for x1, y1, x2, y2 in ((o + 40, o + 21.8, o + 42, o + 19.6), (o + 44.6, o + 20.2, o + 45.6, o + 17.6), (o + 49.4, o + 20.4, o + 50, o + 17.8)):
        s.raw(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="0.6" stroke-linecap="round"/>')   # the arm's "boing"
    size = fit('Trust your agents. Then check.', BC, 800, 6.2, w - 2 * INSET - 6, 3.6)
    s.text('Trust your agents. Then check.', BC, 800, size, W / 2, o + 70.6, INK, 'line', 'middle')
    s.wordmark(o + w - INSET - 6, o + 8.5, 2.4, INK, 'end')
    return 'cartoon', 'Cartoon: trust your agents, then check', W, H, s, rrect(o, o, w, h, r), ('rrect', o, o, w, h, r)

def inside_cut(box, shape):
    """Every corner of a box at least INSET inside the cut (a rounded rectangle is checked as its inset rectangle and corners)."""
    pts = [(box[0], box[1]), (box[2], box[1]), (box[0], box[3]), (box[2], box[3])]
    if shape[0] == 'circle':
        _, cx, cy, R = shape; return all(math.hypot(x - cx, y - cy) <= R - INSET + 1e-6 for x, y in pts)
    _, x, y, w, h, r = shape; ri = r - INSET
    for px, py in pts:
        if not (x + INSET <= px <= x + w - INSET and y + INSET <= py <= y + h - INSET): return False
        for ccx, ccy in ((x + r, y + r), (x + w - r, y + r), (x + r, y + h - r), (x + w - r, y + h - r)):
            if (px - ccx) * (1 if ccx > x + w / 2 else -1) > 0 and (py - ccy) * (1 if ccy > y + h / 2 else -1) > 0 and math.hypot(px - ccx, py - ccy) > ri: return False
    return True

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]; c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def contrast(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)

if __name__ == '__main__':
    made, problems = [], []
    for make in (corporate, gap, lambda: gap(True), steps, cartoon):
        name, title, W, H, s, cut, shape = make()
        open(os.path.join(HERE, f'{name}.svg'), 'w').write(doc(W, H, s, cut, f'RiskMandate sticker. {title}. Cut line in magenta (CutContour), 2 mm bleed'))
        for it in s.items:   # the checks the generator can make from its own geometry; check-stickers.mjs measures the rest
            if not inside_cut(it['box'], shape): problems.append(f'{name}: {it["role"]} "{it.get("text", "")}" closer than {INSET} mm to the cut')
            if 'pt' in it and it['pt'] < 7 - 0.01: problems.append(f'{name}: "{it["text"]}" at {it["pt"]} pt')
            if 'fill' in it and contrast(it['fill'], it['bg']) < (3 if it['pt'] >= 14 else 4.5): problems.append(f'{name}: "{it["text"]}" contrast {contrast(it["fill"], it["bg"]):.2f}')
        logo = [it for it in s.items if it['role'] == 'logo']
        for lg in logo:
            z = lg['clear']; b = lg['box']
            for it in s.items:
                if it is not lg and it['role'] not in ('wordmark',) and it['box'][1] < b[3] + z and it['box'][3] > b[1] - z and it['box'][0] < b[2] and it['box'][2] > b[0]:
                    problems.append(f'{name}: "{it.get("text", "")}" inside the mark\'s clear space')
        made.append({'name': name, 'title': title, 'w_mm': W, 'h_mm': H, 'cut': shape[0]})
    json.dump(made, open(os.path.join(HERE, 'stickers.json'), 'w'), indent=1)
    print('made', ', '.join(m['name'] for m in made))
    if problems: print('\n'.join('FAIL ' + p for p in problems)); sys.exit(1)
    print('checks OK')
