#!/usr/bin/env python3
"""Round 4: three audience cards, no names (Indi, 4 November 2026): about 200 each for Executives, for GRC (Governance,
Risk and Compliance) and for Security professionals.

    FONTS=<dir> python3 team/designer/print/concepts-rm/make-round4.py

The decision (Indi, 4 November, evening): no individual names; three cards, one per kind of person met at Web Summit; each
has a main line, much bigger, and a tagline, the team's chosen pairs (the shirt fronts, team/designer/print/final.json):
  Executives  "Do you know what your agents are doing?"                      / "Clarity. Control. Confidence."     (T1)
  Security    "Your AI has access. Does it have permission?"                 / "AI Agents. Your Rules."            (T9)
  GRC         "Know their reach. Define their mandate. Control the gap."     / "Govern AI. Grow with Confidence."  (T8)
The audience is never printed: each card is colour-coded instead (designer's choice, all RiskMandate colours): Executives
container black, GRC RiskMandate green, Security RiskMandate blue. The QR is the team's (team/designer/qr/qr-meet.svg,
to https://web-summit.sgit.ai/meet/, unaltered), since a card no longer carries a person.
Writes round4/<n-audience>/team-card-front.svg, -back.svg (+ live/, spec.json). By designer@web-summit.indi. Apache-2.0.
"""
import importlib.util, json, math, os, re, sys
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('r3', os.path.join(HERE, 'make-round3.py'))
r3 = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(r3)
r2, mc = r3.r2, r3.mc
Side, PT, SAFE, QR_PANEL, n, fit, width, cap = mc.Side, mc.PT, mc.SAFE, mc.QR_PANEL, mc.n, mc.fit, mc.width, mc.cap
wrap, lines, G, BC, JB = r2.wrap, r2.lines, r2.G, r2.BC, r2.JB
CONTAINER, INK, TEXT, FG, WHITE, MUTED = r2.CONTAINER, r2.INK, r2.TEXT, r2.FG, r2.WHITE, r2.MUTED
GREEN, GREEN2, BLUE, GOLD = r2.GREEN, r2.GREEN2, r2.BLUE, r2.GOLD
# the brand lockup's wordmark, from the brand's own EPS (the stickers' reader: fetched unaltered into a cache)
_st = importlib.util.spec_from_file_location('st', os.path.join(HERE, '..', 'stickers', 'make-stickers.py'))
st = importlib.util.module_from_spec(_st); _st.loader.exec_module(st)
COPY = r3.COPY
TEAM_URL = 'https://web-summit.sgit.ai/meet/'
# Indi, 4 November, evening: "add 'WebSummit Edition' small font to the front and Meet us between Booths A1-30 on Thursday
# (12th)". The event's name is written as the rest of the site has it (Web Summit, two words); the day is already on the card.
EDITION = 'WEB SUMMIT EDITION'
STAND = 'Meet us between Booths A1-30'
FINAL = {p['id']: p for p in json.load(open(os.path.join(mc.ROOT, 'team/designer/print/final.json')))['people']}

# the three cards: the chosen pairs, read from the shirt fronts they come from; the main line set in three card-width lines
AUDIENCES = {
    '1-executives': {'who': 'Executives', 'from': 'dinis', 'colour': GOLD, 'colour_name': 'RiskMandate gold', 'key': 1,
                     'main': 'Do you know what your agents are doing?', 'lines': ['DO YOU KNOW', 'WHAT YOUR AGENTS', 'ARE DOING?']},
    '2-grc':        {'who': 'GRC: governance, risk and compliance', 'from': 'indi', 'colour': GREEN, 'colour_name': 'RiskMandate green', 'key': 2,
                     'main': 'Know their reach. Define their mandate. Control the gap.', 'lines': ['KNOW THEIR REACH.', 'DEFINE THEIR MANDATE.', 'CONTROL THE GAP.']},
    '3-security':   {'who': 'Security professionals', 'from': 'silvio', 'colour': BLUE, 'colour_name': 'RiskMandate blue', 'key': 2,
                     'main': 'Your AI has access. Does it have permission?', 'lines': ['YOUR AI HAS ACCESS.', 'DOES IT HAVE', 'PERMISSION?']},
}
for a in AUDIENCES.values():
    f = FINAL[a['from']]
    assert ' '.join(a['lines']) == ' '.join(f['front']) == a['main'].upper(), (a['who'], f['front'])   # Indi's words = the shirt's, only re-broken
    a['tagline'] = f['tagline']

def team_qr(s, x, y, mm=24.0):
    """The team's QR file, unaltered, scaled so the 29-module symbol is mm wide (as Side.qr does for a person's)."""
    src = open(os.path.join(mc.ROOT, 'team/designer/qr/qr-meet.svg')).read()
    inner = re.sub(r'^.*?<desc>.*?</desc>', '', src.strip(), flags=re.S); inner = re.sub(r'</svg>\s*$', '', inner)
    k = math.ceil(mm / 29 * 1e6) / 1e6
    s.raw(f'<g id="qr" class="safe" data-role="qr" data-url="{TEAM_URL}" data-src="team/designer/qr/qr-meet.svg" shape-rendering="crispEdges" '
          f'transform="translate({n(x)},{n(y)}) scale({k:.6f})">{inner}</g>')
    s.items.append({'role': 'qr', 'box': [round(x, 2), round(y, 2), round(x + 37 * k, 2), round(y + 37 * k, 2)], 'mm': mm})

# Round 4, design A (Dinis, 5 November 2026, from designer@web-summit.dinis's design pass): every front on the brand's dark
# ground (container #161615), the key line of the main line in the brand's accent for dark (lighter green #22C55E), the
# audience coded by a bar along the bottom (gold, green or blue, all brand tokens) and by the same colour on the back's right.
# "RISK MANDATE.ai" wherever the name is set, so it reads as the address; the knockout seal on the front; the brand lockup and
# riskmandate.ai on the back. Back: 3 mm safe area (was 4), larger type, the QR 26 mm (was 24) (Dinis: "squished").
BAR = 3.5    # the audience bar, on the trimmed card (plus the 3 mm bleed)
def wordmark_ai(s, x, y_mid, capmm, fill):
    """RISK MANDATE (light, bold) and a light .ai: the name as the address."""
    s.wordmark(x, y_mid, capmm, fill)
    size = capmm / cap(BC, 700); w = width('RISK', BC, 300, size) + 0.22 * size + width('MANDATE', BC, 700, size)
    s.text('.ai', BC, 300, size, x + w + 0.15, y_mid + capmm / 2, fill, 'wordmark')

def front(a):
    s = Side(CONTAINER); x = 8
    ls = a['lines']; fam, wt = BC, 800
    size = min(76 / max(width(l, fam, wt, 1) for l in ls), 10.5, 25.5 / (cap(fam, wt) + 0.98 * (len(ls) - 1)))   # 25.5 mm high at most: air above the tagline
    ch = cap(fam, wt) * size
    for i, l in enumerate(ls): s.text(l, fam, wt, size, x, 9 + ch + i * size * 0.98, GREEN2 if i == a['key'] else FG, 'headline')
    s.text(a['tagline'], G, 500, 9 * PT, x, 41.6, FG, 'tagline')
    d = 5.6; cy = 58 - BAR - d / 2 - d / 2 - 0.6                                    # the seal, its clear space above the bar
    s.logo(x + d / 2, cy, d, 'knockout')
    wordmark_ai(s, x + d + d / 2 + 0.2, cy, 2.8, FG)
    s.text(EDITION, JB, 500, 7 * PT, 84, cy + 2.8 / 2, FG, 'event', 'end')
    s.raw(f'<rect x="0" y="{n(58 - BAR)}" width="91" height="{n(3 + BAR)}" fill="{a["colour"]}"/>')   # the bar, into the bleed
    return s, size

def lockup_light(s, x, y, w):
    """The brand's lockup, light version: the containered seal (Side.logo, the supplied file) and the "RiskMandate"
    wordmark as the brand's lockup EPS outlines it, in the lockup's own geometry (the wordmark's right edge = w)."""
    dp, fill = st.eps_path('riskmandate-lockup-light.eps', 'the wordmark, as outlines')
    right = max(float(v) for v in re.findall(r'[MLC]([-\d.]+)', dp)); k = w / right
    s.logo(x + 32 * k, y + 32 * k, 64 * k, 'containered')
    s.raw(f'<g class="safe" data-role="lockup" data-src="brand/riskmandate-lockup-light.eps" transform="translate({n(x)},{n(y)}) scale({k:.6f})"><path d="{dp}" fill="{fill}"/></g>')
    xs = [float(v) for v in re.findall(r'[MLC]([-\d.]+)', dp)]
    s.items.append({'role': 'lockup', 'box': [round(x + min(xs) * k, 2), round(y + 20 * k, 2), round(x + w, 2), round(y + 44 * k, 2)]})
    return 64 * k

def back(a):
    s = Side(WHITE); px = 48.6
    s.raw(f'<rect x="{px}" y="0" width="{n(91 - px)}" height="61" fill="{a["colour"]}"/>')   # the audience colour, as the front's bar
    x = 6.5; h = lockup_light(s, x, 6.5, 36)                                        # 9.4 mm high; its clear space 4.7 mm
    s.text(COPY['abp'].upper(), JB, 500, 7 * PT, x, 6.5 + h + h / 2 + 2.2, MUTED, 'label')
    lines(s, wrap(COPY['badge_tail'], G, 400, 7.8 * PT, px - 2.5 - x), G, 400, 7.8 * PT, x, 27.4, 3.75, TEXT, 'register')
    s.text('WEB SUMMIT LISBON', JB, 500, 7 * PT, x, 40.4, MUTED, 'event')
    s.text('Thursday 12 November', BC, 700, 12 * PT, x, 45.7, INK, 'event')
    s.text(STAND, G, 600, 7.5 * PT, x, 50.0, INK, 'event')
    s.text('riskmandate.ai', G, 600, 8 * PT, x, 54.5, GREEN, 'site')
    q = 26 * 37 / 29; qx = 85 - q; qy = (61 - q - 5.6) / 2
    team_qr(s, qx, qy, 26)                                                          # its own white panel on the colour
    s.text('web-summit.sgit.ai/meet/', G, 500, 7.5 * PT, qx + q / 2, qy + q + 4.2, FG, 'url', 'middle', on=a['colour'])
    return s

def build():
    made = {}
    for cid, a in AUDIENCES.items():
        d = os.path.join(HERE, 'round4', cid); os.makedirs(os.path.join(d, 'live'), exist_ok=True)
        (f, size), b = front(a), back(a)
        main = a['main']
        spec = {'concept': cid, 'name': f'R4-{cid[0]} {a["who"].split(":")[0]}', 'audience': a['who'], 'kind': 'round 4',
                'rationale': f'"{main}" / "{a["tagline"]}" Coded {a["colour_name"]}.',
                'type': 'Barlow Condensed ExtraBold (main line, the shirts\' voice) + Geist (tagline, back) + JetBrains Mono (labels)',
                'notes': [f'Main line {size / PT:.0f} pt, tagline 9 pt: the main line is about {size / (9 * PT):.1f} times the tagline.'],
                'palette': [{'name': nm, 'hex': h, 'cmyk': mc.cmyk(h)} for nm, h in [(a['colour_name'] + ' (the code)', a['colour']), ('Warm white', FG), ('White', WHITE), ('Ink', INK), ('Muted', MUTED)]],
                'files': {}}
        for side, S in (('front', f), ('back', b)):
            title = f'RiskMandate business card for {a["who"]}, {side}. Trim 85 x 55 mm, 3 mm bleed (91 x 61 mm)'
            fn = f'team-card-{side}.svg'
            open(os.path.join(d, fn), 'w').write(S.svg(title))
            open(os.path.join(d, 'live', fn), 'w').write(S.svg(title + ', live text', live=True))
            spec['files'][fn] = {'person': None, 'side': side, 'bg': S.bg, 'items': S.items,
                                 'accent': {'name': a['colour_name'], 'hex': a['colour'], 'cmyk': mc.cmyk(a['colour'])}}
        json.dump(spec, open(os.path.join(d, 'spec.json'), 'w'), indent=1, ensure_ascii=False)
        made[cid] = size
    print('made', ', '.join(f'{c} (main line {s / PT:.1f} pt)' for c, s in made.items()))

if __name__ == '__main__':
    build()
