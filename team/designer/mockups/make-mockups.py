#!/usr/bin/env python3
# Mock-ups for the team's merch: T-shirts, hoodies and cards, as SVG, from data/design.json and the QR codes in
# team/designer/qr/ (made by make-qr.mjs, read back). Run from the repository root: python3 team/designer/mockups/make-mockups.py
# Writes assets/design/*.svg. Mock-ups, not print files: the printer gets vector files at its own spec once a design is picked.
import json, os, re, html
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
D = json.load(open(os.path.join(ROOT, 'data/design.json')))
OUT = os.path.join(ROOT, 'assets/design'); os.makedirs(OUT, exist_ok=True)
PEOPLE = {p['id']: p for p in D['people']}
FONT = "Inter, 'Helvetica Neue', Arial, sans-serif"
def qr(pid, x, y, size):
    f = os.path.join(ROOT, 'team/designer/qr', f'qr-meet-{pid}.svg' if pid else 'qr-meet.svg')
    t = open(f).read(); d = re.search(r'<path d="([^"]+)"', t).group(1); n = int(re.search(r'viewBox="0 0 (\d+)', t).group(1))
    s = size / n
    return f'<g transform="translate({x},{y}) scale({s})"><rect width="{n}" height="{n}" fill="#fff"/><path d="{d}" fill="#000"/></g>'
def lines(ls, x, y, size, fill, weight=800, gap=1.12, anchor='middle'):
    return ''.join(f'<text x="{x}" y="{y + i * size * gap:.1f}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{html.escape(l)}</text>' for i, l in enumerate(ls))
def fit(ls, width, maxs):  # crude: size so the longest line fits the print area
    return min(maxs, int(width / max(0.62 * max(len(l) for l in ls), 1)))
TEE = 'M120,30 L165,10 Q200,40 235,10 L280,30 L380,90 L345,150 L305,128 L305,470 L95,470 L95,128 L55,150 L20,90 Z'
HOOD = 'M110,60 Q200,-10 290,60 L380,120 L350,190 L310,165 L310,480 L90,480 L90,165 L50,190 L20,120 Z'
def svg(w, h, body, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><title>{html.escape(title)}</title><rect width="{w}" height="{h}" fill="#f4f4f2"/>{body}</svg>\n'
def back_block(p, ink, y0=165, shape='tee'):
    name = p['first'] if p else 'us'
    b = qr(p['id'] if p else None, 155, y0, 90)
    b += lines([f'SCAN TO MEET {name.upper()}'], 200, y0 + 112, 13, ink, 800)
    b += lines(['book a meeting · talk to my agent'], 200, y0 + 130, 11, ink, 500)
    b += lines(['RISKMANDATE', 'WEB SUMMIT 2026 · LISBON'], 200, y0 + 170, 11, ink, 800, 1.3)
    b += lines(['our stand: Thursday 12 November'], 200, y0 + 205, 10, ink, 500)
    return b
def write(name, text): open(os.path.join(OUT, name), 'w').write(text)
made = []
for c in D['tees']:
    p = PEOPLE[c['sample']]; col, ink = p['colour'], p['ink']
    front = f'<path d="{TEE}" fill="{col}" stroke="#0002"/>'
    if c.get('chest'):
        front += lines(c['front'], 250, 150, 11, ink, 800, anchor='middle')
    else:
        size = fit(c['front'], 190, 34); front += lines(c['front'], 200, 175, size, ink)
        if c.get('sub'): front += lines([c['sub']], 200, 175 + size * 1.12 * len(c['front']) + 14, 14, ink, 500)
    write(f"tee-{c['id']}-front.svg", svg(400, 490, front, f"{c['id']} front, {p['first']}'s colour"))
    back = f'<path d="{TEE}" fill="{col}" stroke="#0002"/>'
    if c.get('back'): back += lines(c['back'], 200, 120, fit(c['back'], 190, 30), ink)
    back += back_block(p, ink, 170 if c.get('back') else 150)
    write(f"tee-{c['id']}-back.svg", svg(400, 490, back, f"{c['id']} back"))
    made += [f"tee-{c['id']}-front.svg", f"tee-{c['id']}-back.svg"]
def seven_body(p):  # one of the seven: their colour, their tee's front, their name at the hem
    c = next(t for t in D['tees'] if t['id'] == p['tee'])
    body = f'<path d="{TEE}" fill="{p["colour"]}" stroke="#0002"/>'
    if c.get('chest'): body += lines(c['front'], 250, 150, 11, p['ink'])
    else:
        size = fit(c['front'], 190, 34); body += lines(c['front'], 200, 175, size, p['ink'])
        if c.get('sub'): body += lines([c['sub']], 200, 175 + size * 1.12 * len(c['front']) + 14, 14, p['ink'], 500)
    return c, body + lines([p['first'].upper()], 200, 455, 14, p['ink'], 800)
for p in D['people']:  # the seven, one each
    c, body = seven_body(p)
    write(f"seven-{p['id']}.svg", svg(400, 490, body, f"{p['first']}: {c['id']}")); made.append(f"seven-{p['id']}.svg")
# the seven side by side, the way people will see three or four of us together on the floor
lineup = ''.join(f'<g transform="translate({i * 400},0)">{seven_body(p)[1]}</g>' for i, p in enumerate(D['people']))
n = len(D['people'])
write('seven-lineup.svg', svg(400 * n, 490, lineup, 'The seven together, a colour and a line each')); made.append('seven-lineup.svg')
for h in D['hoodies']:
    p = PEOPLE[h['sample']]; col, ink = p['colour'], p['ink']
    front = f'<path d="{HOOD}" fill="{col}" stroke="#0002"/><rect x="140" y="360" width="120" height="70" rx="12" fill="#0001"/>' + lines(h['chest'], 255, 200, 11, ink)
    back = f'<path d="{HOOD}" fill="{col}" stroke="#0002"/>' + lines(h['back'], 200, 190, fit(h['back'], 200, 40), ink) + qr(p['id'], 170, 330, 60) + lines(['RISKMANDATE · WEB SUMMIT 2026'], 200, 420, 11, ink)
    write(f"hoodie-{h['id']}-front.svg", svg(400, 500, front, f"{h['id']} front")); write(f"hoodie-{h['id']}-back.svg", svg(400, 500, back, f"{h['id']} back"))
    made += [f"hoodie-{h['id']}-front.svg", f"hoodie-{h['id']}-back.svg"]
def card_front(cd, p):
    col, ink = p['colour'], p['ink']
    if cd['style'] == 'band':
        front = f'<rect x="20" y="20" width="340" height="220" rx="8" fill="#fff" stroke="#0003"/><rect x="20" y="20" width="26" height="220" rx="4" fill="{col}"/>'
        front += lines([p['name']], 66, 92, 24, '#111', 800, anchor='start') + lines([p['role']], 66, 116, 12, '#444', 500, anchor='start')
        front += lines([f"“{p['line']}”"], 66, 160, 12, '#111', 700, anchor='start') + lines(['RISKMANDATE · WEB SUMMIT 2026'], 66, 215, 11, col if p['ink'].lower() in ('#fff', '#ffffff') else '#111', 800, anchor='start')
    else:
        front = f'<rect x="20" y="20" width="340" height="220" rx="8" fill="{col}"/>' + lines(['RISK', 'MANDATE'], 40, 90, 34, ink, 900, 1.0, 'start')
        front += lines([p['name']], 40, 180, 18, ink, 800, anchor='start') + lines(['Web Summit 2026 · Lisbon'], 40, 204, 12, ink, 500, anchor='start')
    return front
for cd in D['cards']:
    p = PEOPLE[cd['sample']]; front = card_front(cd, p)
    back = f'<rect x="20" y="20" width="340" height="220" rx="8" fill="#fff" stroke="#0003"/>' + qr(p['id'], 40, 50, 150)
    back += lines(['Meet me', 'Book a meeting', 'Talk to my agent'], 210, 90, 14, '#111', 700, 1.6, 'start') + lines(['web-summit.sgit.ai', f"/meet/{p['id']}/"], 210, 196, 10, '#444', 500, 1.3, 'start')
    write(f"card-{cd['id']}-front.svg", svg(380, 260, front, f"{cd['id']} front")); write(f"card-{cd['id']}-back.svg", svg(380, 260, back, f"{cd['id']} back"))
    made += [f"card-{cd['id']}-front.svg", f"card-{cd['id']}-back.svg"]
# everyone's card, C1 and C2, on one sheet each, so each person can check their own name, colour and line
for cd in D['cards']:
    cols = 2; rows = -(-len(D['people']) // cols)
    sheet = ''.join(f'<g transform="translate({(i % cols) * 380},{(i // cols) * 260})">{card_front(cd, p)}</g>' for i, p in enumerate(D['people']))
    write(f"cards-{cd['id']}-seven.svg", svg(380 * cols, 260 * rows, sheet, f"{cd['id']}: a card for each of the seven")); made.append(f"cards-{cd['id']}-seven.svg")
print(len(made), 'mock-ups in assets/design/')
