#!/usr/bin/env python3
"""Draw one reporter@ trace (team/reporter/traces/<id>.json, ws-trace/1) as a swimlane SVG, in the style of
/pipeline/'s case-study graphics. One lane per actor, one column per step (time is printed, not scaled: the
gaps in these flows run from seconds to hours). Short labels come from the journalist's notes file
(team/journalist.examples/notes/<id>.json: title, subtitle, labels {n: "line1|line2"}, side [n], output).
  Optional in notes: steps [n...] (draw only these), col (column width), edges [[from, to, "dashed"?]] to draw parallel chains instead of one.
  python3 team/journalist.examples/tools/flow_svg.py <id> [trace.json]   ->  assets/examples/<id>.svg
"""
import json, sys, os, re
from html import escape as e

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
tid = sys.argv[1]
trace = json.load(open(sys.argv[2] if len(sys.argv) > 2 else f'{ROOT}/team/reporter/traces/{tid}.json'))
notes = json.load(open(f'{ROOT}/team/journalist.examples/notes/{tid}.json'))
COL = {'person': '#8a3b1f', 'agent': '#1f5f8b', 'ci': '#5e5d59', 'out': '#c96442'}
steps = [s for s in trace['steps'] if not notes.get('steps') or s['n'] in notes['steps']]
lanes = []
for s in steps:
    k = (s['actor']['name'], s['actor']['kind'])
    if k not in lanes: lanes.append(k)
lanes.append(('the output', 'out'))
side = set(notes.get('side', []))
LW, CW, LH, TOP = 210, notes.get('col', 168), 92, 112
W = max(1400, LW + CW * (len(steps) + 1) + 20)
H = TOP + LH * len(lanes) + 88
o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Inter, -apple-system, Segoe UI, Helvetica, Arial, sans-serif">',
     f'<rect width="{W}" height="{H}" fill="#faf9f5"/>',
     f'<text x="30" y="44" font-size="26" font-weight="700" fill="#141413">{e(notes["title"])}</text>',
     f'<text x="30" y="74" font-size="15" fill="#5e5d59">{e(notes["subtitle"])}</text>',
     '<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#5e5d59"/></marker></defs>']
for i, (name, kind) in enumerate(lanes):
    y = TOP + i * LH
    label = {'person': 'a person', 'agent': 'an agent', 'ci': 'CI', 'out': ''}[kind]
    short = name.replace(' (deploy-pages.yml)', '')
    o.append(f'<rect x="20" y="{y}" width="{W-40}" height="{LH-8}" rx="10" fill="{COL[kind]}" fill-opacity="0.10"/>')
    o.append(f'<text x="34" y="{y+38}" font-size="{14 if len(short) <= 24 else 12}" font-weight="700" fill="{COL[kind]}">{e(short)}</text>')
    if label: o.append(f'<text x="34" y="{y+58}" font-size="12" fill="#5e5d59">{label}</text>')
MARK = len(o); ARR = []
def box(col, lane, lines, kind, dashed=False, when=''):
    x = LW + col * CW + 8; y = TOP + lane * LH + 8; w = CW - 22; h = LH - 24
    d = ' stroke-dasharray="5 4"' if dashed else ''
    r = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#ffffff" stroke="{COL[kind]}" stroke-width="1.6"{d}/>']
    for j, t in enumerate(lines[:3]):
        r.append(f'<text x="{x+10}" y="{y+22+j*17}" font-size="12.5" fill="#141413">{e(t)}</text>')
    if when: r.append(f'<text x="{x+w/2}" y="{TOP+LH*len(lanes)+22}" font-size="12" fill="#5e5d59" text-anchor="middle">{e(when)}</text>')
    o.extend(r); return (x, y, w, h)
def when(s):
    if s.get('at'): return s['at'][11:16] + (' (about)' if 'about' in s.get('at_note', '') else '')
    return notes.get('when', {}).get(str(s['n']), 'no time')
pos = {}
for c, s in enumerate(steps):
    li = lanes.index((s['actor']['name'], s['actor']['kind']))
    lines = notes['labels'][str(s['n'])].split('|')
    pos[s['n']] = box(c, li, lines, s['actor']['kind'], dashed=(s['n'] in side or not s['evidence']), when=when(s))
out = box(len(steps), len(lanes) - 1, notes['output'].split('|'), 'out', when=notes.get('output_when', ''))
main = [s['n'] for s in steps if s['n'] not in side]
chain = [pos[n] for n in main]
last_main = main[-1]
chain_end = [pos[n] for n in main if n <= notes.get('output_after', last_main)][-1]
def arrow(a, b, dashed=False):
    x1, y1 = a[0] + a[2], a[1] + a[3] / 2; x2, y2 = b[0], b[1] + b[3] / 2
    d = ' stroke-dasharray="4 4"' if dashed else ''
    mx = (x1 + x2) / 2
    ARR.append(f'<path d="M{x1},{y1} C{mx},{y1} {mx},{y2} {x2},{y2}" fill="none" stroke="#5e5d59" stroke-width="1.5" marker-end="url(#a)"{d}/>')
if 'edges' in notes:
    for a, b, *k in notes['edges']: arrow(pos[a], pos[b], dashed=bool(k))
else:
    for a, b in zip(chain, chain[1:]): arrow(a, b)
    for n in side:
        prev = max(m for m in main if m < n); arrow(pos[prev], pos[n], dashed=True)
x1, y1 = chain_end[0] + chain_end[2], chain_end[1] + chain_end[3] / 2; x2, y2 = out[0], out[1] + out[3] / 2
ARR.append(f'<path d="M{x1},{y1} H{x2-10} V{y2} H{x2}" fill="none" stroke="#5e5d59" stroke-width="1.5" marker-end="url(#a)"/>')  # to the output: right, then down
o[MARK:MARK] = ARR  # arrows under the boxes
o.append(f'<text x="30" y="{H-32}" font-size="12" fill="#5e5d59">Drawn by journalist.examples@web-summit.dinis from {e(notes.get("from", "reporter@web-summit.dinis\'s trace " + tid + " (team/reporter/traces/)"))}.</text>')
o.append(f'<text x="30" y="{H-14}" font-size="12" fill="#5e5d59">Dashed: a side step, or a step with no public evidence. Times UTC, {e(notes.get("date", "10 November 2026"))}. Columns are steps, not to scale.</text>')
o.append('</svg>')
os.makedirs(f'{ROOT}/assets/examples', exist_ok=True)
open(f'{ROOT}/assets/examples/{tid}.svg', 'w').write(re.sub(r'(?<![\d.v])(\d+\.\d)\d{3,}(?![\d.])', r'\1', '\n'.join(o)) + '\n')  # coordinates to one decimal (never inside a version like v0.2.1733)
print(f'assets/examples/{tid}.svg')
