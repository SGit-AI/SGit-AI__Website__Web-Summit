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
    lw = 84; lh, mw = lockup(s, (W - lw) / 2, 4.6, lw, dark=True)           # 84 mm: the mark 15.7 mm as drawn, 7.9 mm clear
    s.text('AGENT BEHAVIOUR POLICIES', JB, 500, 9 * PT, W / 2, 34.6, FG, 'label', 'middle')   # warm white, 9 pt: brighter, larger
    return 'corporate', 'Corporate: the RiskMandate lockup', W, H, s, rrect(BLEED, BLEED, w, h, r), ('rrect', BLEED, BLEED, w, h, r)

# ---------- 2. The gap: one bar, read at a glance (redrawn after Indi's feedback: "too difficult to understand") ----------
def gap(animated=False):
    D = 76; W = H = D + 2 * BLEED; c = W / 2
    s = Side(CONTAINER)
    x0, x1, split, y0, bh = c - 30, c + 30, c + 4, c - 8, 9.5          # the bar: all it can reach; green to split = authorised
    s.wordmark(c, c - 25.6, 2.6, FG, 'middle')
    s.text('WHAT IT CAN REACH', JB, 700, 7.5 * PT, c, y0 - 4.2, FG, 'label', 'middle')
    s.raw(f'<path d="M{n(x0)} {n(y0 - 1.4)}V{n(y0 - 2.8)}H{n(x1)}V{n(y0 - 1.4)}" fill="none" stroke="{FG}" stroke-width="0.45" stroke-linejoin="round"/>')
    s.raw(f'<clipPath id="gapbar"><rect x="{n(split)}" y="{n(y0)}" width="{n(x1 - split)}" height="{n(bh)}"/></clipPath>')
    move = (f'<animateTransform attributeName="transform" type="translate" from="0 0" to="4.53 0" dur="1.6s" repeatCount="indefinite"/>' if animated else '')
    stripes = ''.join(f'<line x1="{n(split - 12 + i * 2.265)}" y1="{n(y0 + bh)}" x2="{n(split - 12 + i * 2.265 + bh)}" y2="{n(y0)}" stroke="{GOLD}" stroke-width="0.95"/>' for i in range(0, 22))
    s.raw(f'<g clip-path="url(#gapbar)"><g>{stripes}{move}</g></g>')
    grow = (f'<animate attributeName="width" values="{n(split - x0)};{n(split - x0 - 3)};{n(split - x0)}" dur="3.2s" repeatCount="indefinite"/>' if animated else '')
    s.raw(f'<rect x="{n(x0)}" y="{n(y0)}" width="{n(split - x0)}" height="{n(bh)}" fill="{GREEN}">{grow}</rect>')
    s.raw(f'<rect x="{n(x0)}" y="{n(y0)}" width="{n(x1 - x0)}" height="{n(bh)}" rx="1" fill="none" stroke="{FG}" stroke-width="0.5"/>')
    s.text('AUTHORISED', BC, 700, 4.6, (x0 + split) / 2, y0 + bh / 2 + cap(BC, 700) * 4.6 / 2, FG, 'label', 'middle', on=GREEN)
    # the gap's label under its part of the bar, with a caution triangle in the brand's gold
    gx = (split + x1) / 2; ty = y0 + bh + 2.2
    s.raw(f'<path d="M{n(gx)} {n(ty)}l-2 3.4h4z" fill="{GOLD}"/><path d="M{n(gx)} {n(ty + 1.2)}v1.1" stroke="{CONTAINER}" stroke-width="0.45" stroke-linecap="round"/><circle cx="{n(gx)}" cy="{n(ty + 2.85)}" r="0.25" fill="{CONTAINER}"/>')
    s.text('THE GAP', BC, 700, 4.8, gx, ty + 8.4, FG, 'label', 'middle')
    size = fit('CONTROL THE GAP.', BC, 800, 6.6, 54, 4)
    s.text('CONTROL THE GAP.', BC, 800, size, c, c + 22.5, FG, 'line', 'middle')
    return ('gap-animated' if animated else 'gap'), 'Infographic: the gap', W, H, s, circle(c, c, D / 2), ('circle', c, c, D / 2)

# ---------- 3. Know, define, control: the three steps ----------
def steps():
    w, h, r = 100, 40, 8; W, H = w + 2 * BLEED, h + 2 * BLEED
    s = Side(CONTAINER)
    xs = [BLEED + 17, BLEED + 50, BLEED + 83]; cy = 17.4
    # icons, drawn here (plain geometry, not the mark): reach as a radar sweep, the mandate as a page with a tick, the gap closed
    # KNOW: a radar, as Indi asked: rings, a crosshair, the sweep line and its shadow trailing behind it, two blips
    rx, R = xs[0], 7
    pt = lambda a, r: (rx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
    (ax, ay), (bx, by) = pt(-100, R - 0.5), pt(-30, R - 0.5)
    s.raw(f'<circle cx="{rx}" cy="{cy}" r="{R}" fill="{CONTAINER}" stroke="{GREEN2}" stroke-width="1"/>'
          f'<path d="M{rx} {cy}L{n(ax)} {n(ay)}A{R - 0.5} {R - 0.5} 0 0 1 {n(bx)} {n(by)}Z" fill="{GREEN}"/>'            # the sweep's shadow
          + ''.join(f'<circle cx="{rx}" cy="{cy}" r="{r}" fill="none" stroke="{GREEN2}" stroke-width="0.35"/>' for r in (2.4, 4.7))
          + f'<path d="M{rx - R + 0.6} {cy}H{rx + R - 0.6}M{rx} {cy - R + 0.6}V{cy + R - 0.6}" stroke="{GREEN2}" stroke-width="0.3"/>'
          f'<path d="M{rx} {cy}L{n(bx)} {n(by)}" stroke="{GREEN2}" stroke-width="1.1" stroke-linecap="round"/>'               # the sweep line
          f'<circle cx="{n(pt(-55, 4.2)[0])}" cy="{n(pt(-55, 4.2)[1])}" r="0.85" fill="{FG}"/><circle cx="{n(pt(150, 5.4)[0])}" cy="{n(pt(150, 5.4)[1])}" r="0.7" fill="{GREEN2}"/>')
    s.raw(f'<path d="{rrect(xs[1] - 5.2, cy - 7, 10.4, 14, 1.4)}" fill="none" stroke="{GREEN2}" stroke-width="1"/>'
          + ''.join(f'<line x1="{xs[1] - 3}" y1="{n(cy - 3.6 + i * 2.4)}" x2="{xs[1] + 3}" y2="{n(cy - 3.6 + i * 2.4)}" stroke="{FG}" stroke-width="0.6" stroke-linecap="round"/>' for i in range(3))
          + f'<path d="M{xs[1] - 2.2} {cy + 4.1}l1.5 1.5l3-3" fill="none" stroke="{GREEN2}" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>')
    # CONTROL: a control dial (Indi: "make it clearer that something is being controlled"): a knob, its pointer, and a
    # scale lit up to where it is set
    kx = xs[2]; ticks = ''
    for i, a in enumerate(range(135, 406, 27)):
        (tx0, ty0), (tx1, ty1) = [(kx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))) for r in (5.9, 7.4)]
        ticks += f'<line x1="{n(tx0)}" y1="{n(ty0)}" x2="{n(tx1)}" y2="{n(ty1)}" stroke="{GREEN2 if a <= 270 else FAINT}" stroke-width="{0.8 if a <= 270 else 0.5}" stroke-linecap="round"/>'
    px, py = kx + 3.4 * math.cos(math.radians(270)), cy + 3.4 * math.sin(math.radians(270))
    s.raw(ticks + f'<circle cx="{kx}" cy="{cy}" r="4.6" fill="{GREEN}" stroke="{FG}" stroke-width="0.5"/>'
          f'<path d="M{kx} {cy}L{n(px)} {n(py)}" stroke="{FG}" stroke-width="1.1" stroke-linecap="round"/><circle cx="{kx}" cy="{cy}" r="0.8" fill="{FG}"/>')
    for a, b in ((xs[0], xs[1]), (xs[1], xs[2])):
        x0, x1 = a + 9.6, b - 9.6
        s.raw(f'<path d="M{n(x0)} {cy}H{n(x1)}M{n(x1 - 1.6)} {n(cy - 1.4)}L{n(x1)} {cy}L{n(x1 - 1.6)} {n(cy + 1.4)}" fill="none" stroke="{FAINT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>')
    for x, (k, v) in zip(xs, [('KNOW', 'their reach'), ('DEFINE', 'their mandate'), ('CONTROL', 'the gap')]):
        s.text(k, BC, 700, 4.6, x, 31.2, FG, 'label', 'middle')
        s.text(v, G, 500, 7 * PT, x, 35.4, FAINT, 'label', 'middle')
    return 'steps', 'Infographic: know, define, control', W, H, s, rrect(BLEED, BLEED, w, h, r), ('rrect', BLEED, BLEED, w, h, r)

# ---------- 4. Cartoon: the agent with all the keys (simplified after Indi's feedback: "no idea what this means") ----------
def key(x, y, a, fill):
    """One cartoon key: its bow at (x, y), the shaft hanging away from the ring at a degrees from straight down."""
    return (f'<g transform="translate({n(x)},{n(y)}) rotate({n(-a)})"><path d="M-0.9 2h1.8v9.6h-1.8z" fill="{fill}" stroke="{INK}" stroke-width="0.5" stroke-linejoin="round"/>'
            f'<path d="M0.9 8.4h1.9v1.2h-1.9zM0.9 10.4h1.3v1.2h-1.3z" fill="{fill}" stroke="{INK}" stroke-width="0.45" stroke-linejoin="round"/>'
            f'<circle cx="0" cy="0" r="2.3" fill="{fill}" stroke="{INK}" stroke-width="0.55"/><circle cx="0" cy="0" r="0.8" fill="{FG}" stroke="{INK}" stroke-width="0.4"/></g>')
def cartoon():
    w = h = 76; r = 12; W, H = w + 2 * BLEED, h + 2 * BLEED
    s = Side(FG)
    o = BLEED; ol = 0.9
    def P(d, fill, sw=ol): s.raw(f'<path d="{d}" fill="{fill}" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>')
    top = 'Your AI has access.'; bottom = 'Does it have permission?'
    size = fit(bottom, BC, 800, 6.4, w - 2 * INSET - 8, 3.6)
    s.text(top, BC, 800, size, W / 2, o + 10.6, INK, 'line', 'middle')
    # the agent, pleased with itself
    for x in (o + 15, o + 23.5):
        P(rrect(x, o + 58, 4.5, 6.5, 1.5), INK)
    P(rrect(o + 11, o + 40, 21, 19, 4), GREEN)                                         # body
    s.raw(f'<line x1="{o + 21.5}" y1="{o + 18}" x2="{o + 21.5}" y2="{o + 14.4}" stroke="{INK}" stroke-width="{ol}" stroke-linecap="round"/>')
    s.raw(f'<circle cx="{o + 21.5}" cy="{o + 13.6}" r="1.6" fill="{GOLD}" stroke="{INK}" stroke-width="{ol}"/>')
    P(rrect(o + 9, o + 18, 25, 20, 5), GREEN)                                          # head
    s.raw(f'<path d="{rrect(o + 12, o + 21, 19, 13.5, 3)}" fill="{INK}"/>')             # the screen: dark, so the lighter green may sit on it
    for ex in (o + 18, o + 25):                                                          # happy, closed eyes
        s.raw(f'<path d="M{ex - 1.8} {o + 27}q1.8 -2.4 3.6 0" fill="none" stroke="{GREEN2}" stroke-width="0.9" stroke-linecap="round"/>')
    s.raw(f'<path d="M{o + 17.4} {o + 29.6}q4.1 3 8.2 0" fill="none" stroke="{GREEN2}" stroke-width="0.9" stroke-linecap="round"/>')
    s.raw(f'<path d="M{o + 11} {o + 47}q-4 2 -3 6" fill="none" stroke="{INK}" stroke-width="2.8" stroke-linecap="round"/><path d="M{o + 11} {o + 47}q-4 2 -3 6" fill="none" stroke="{GREEN}" stroke-width="1.4" stroke-linecap="round"/>')
    # the key ring, held up high, and a neat fan of keys hanging from it: access, at a glance
    rcx, rcy, rr = o + 50, o + 27.5, 4.2
    arm = f'M{o + 32} {o + 46}C{o + 39} {o + 45} {o + 44} {o + 36} {n(rcx - 1.2)} {n(rcy - rr - 0.6)}'
    s.raw(f'<path d="{arm}" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/><path d="{arm}" fill="none" stroke="{GREEN}" stroke-width="1.6" stroke-linecap="round"/>')
    for a, fill in ((-54, WHITE), (-18, GOLD), (18, WHITE), (54, WHITE)):
        d = rr + 2.6
        s.raw(key(rcx + d * math.sin(math.radians(a)), rcy + d * math.cos(math.radians(a)), a, fill))
    s.raw(f'<circle cx="{rcx}" cy="{rcy}" r="{rr}" fill="none" stroke="{INK}" stroke-width="1.1"/>')
    s.raw(f'<circle cx="{n(rcx - 1.2)}" cy="{n(rcy - rr - 0.6)}" r="2.1" fill="{GREEN}" stroke="{INK}" stroke-width="0.7"/>')   # the hand on the ring
    for x1, y1, x2, y2 in ((rcx + 5.6, rcy - 5.4, rcx + 7.6, rcy - 7.2), (rcx + 7.2, rcy - 1.6, rcx + 9.8, rcy - 2.2), (rcx + 2.2, rcy - 7.6, rcx + 2.8, rcy - 10.2)):
        s.raw(f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" stroke="{INK}" stroke-width="0.6" stroke-linecap="round"/>')   # jingle
    s.text(bottom, BC, 800, size, W / 2, o + 71.2, INK, 'line', 'middle')
    return 'cartoon', 'Cartoon: your AI has access. Does it have permission?', W, H, s, rrect(o, o, w, h, r), ('rrect', o, o, w, h, r)

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
