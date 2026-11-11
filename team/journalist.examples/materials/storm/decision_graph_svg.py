#!/usr/bin/env python3
"""Draw decision-graph.json (the storm) on a time axis, one lane per kind of authority, so the lead times show.
  python3 team/journalist.examples/materials/storm/decision_graph_svg.py  ->  decision-graph.svg beside it
Solid edges: a source says one decision follows the other. Dashed: analysis. Hollow nodes: nothing announced yet, or a source
our tools cannot read. A bar: a decision that happened but whose time no source gives (drawn over its possible window)."""
import json, os, re
from datetime import datetime, timezone
from html import escape as e
HERE = os.path.dirname(os.path.abspath(__file__))
g = json.load(open(f'{HERE}/decision-graph.json'))
T = lambda s: datetime.fromisoformat(s.replace('Z', '+00:00'))
T0, T1 = T('2026-11-09T12:00Z'), T('2026-11-11T22:00Z')
LW, W, TOP, LH = 190, 1400, 120, 86
LANES = ['weather', 'civil protection', 'government', 'sea and port', 'city', 'transport', 'the summit', 'next']
H = TOP + LH * len(LANES) + 96
X = lambda t: LW + (W - LW - 30) * (T(t) - T0).total_seconds() / (T1 - T0).total_seconds()
Y = lambda lane: TOP + LANES.index(lane) * LH + LH / 2 - 4
C = {'done': '#1f5f8b', 'unknown_time': '#1f5f8b', 'not_read': '#8a8984', 'not_announced': '#c96442'}
o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Inter, -apple-system, Segoe UI, Helvetica, Arial, sans-serif">',
     f'<rect width="{W}" height="{H}" fill="#faf9f5"/>',
     '<text x="30" y="44" font-size="26" font-weight="700" fill="#141413">The storm: who decided what, and how far ahead</text>',
     f'<text x="30" y="74" font-size="15" fill="#5e5d59">From the weather desk\'s sources, as of {g["as_of"][11:16]} UTC on {int(g["as_of"][8:10])} November. Lisbon time = UTC. Red rain Wednesday 09:00, ended 15:00; wind orange from 07:16, ended 15:56; sea warnings to 03:00.</text>',
     '<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#5e5d59"/></marker></defs>']
for i, l in enumerate(LANES):
    y = TOP + i * LH
    o.append(f'<rect x="20" y="{y}" width="{W-40}" height="{LH-8}" rx="10" fill="#5e5d59" fill-opacity="{0.05 if i % 2 else 0.09}"/>')
    o.append(f'<text x="34" y="{y+LH/2}" font-size="14" font-weight="700" fill="#141413">{e(l)}</text>')
ev = g['event']; ex0, ex1 = X(ev['from']), X(ev['to'])
o.append(f'<rect x="{ex0}" y="{TOP-14}" width="{ex1-ex0}" height="{LH*len(LANES)+6}" fill="#8a3b1f" fill-opacity="0.10"/>')
_bx, _ba = ((X(g['as_of']) + 6, 'start') if ex0 <= X(g['as_of']) <= ex1 else ((ex0 + ex1) / 2, 'middle'))
o.append(f'<text x="{_bx}" y="{TOP-20}" font-size="13" font-weight="700" fill="#8a3b1f" text-anchor="{_ba}">red rain in Lisbon</text>')
now = X(g['as_of'])
o.append(f'<line x1="{now}" y1="{TOP-14}" x2="{now}" y2="{TOP+LH*len(LANES)-8}" stroke="#141413" stroke-dasharray="2 3"/><text x="{now+5 if now > ex1 else now-5}" y="{TOP-20}" font-size="12" fill="#141413" text-anchor="{"start" if now > ex1 else "end"}">as of {g["as_of"][11:16]}</text>')
for h in range(0, 59, 6):
    t = datetime.fromtimestamp(T0.timestamp() + h * 3600, timezone.utc); x = LW + (W - LW - 30) * h / 58
    lab = t.strftime('%a %H:%M') if t.hour == 0 or h == 0 else t.strftime('%H:%M')
    o.append(f'<line x1="{x}" y1="{TOP+LH*len(LANES)-8}" x2="{x}" y2="{TOP+LH*len(LANES)}" stroke="#5e5d59"/><text x="{x}" y="{TOP+LH*len(LANES)+16}" font-size="11.5" fill="#5e5d59" text-anchor="middle">{lab}</text>')
# positions: grouped nodes at the same time and lane are drawn once, their decisions listed
pos, groups = {}, {}
for n in g['nodes']:
    if n['at']: x = X(n['at'])
    elif n.get('at_window'): x = (X(n['at_window'][0]) + X(n['at_window'][1])) / 2
    else: x = now + 14
    key = (n['lane'], round(x))
    groups.setdefault(key, []).append(n); pos[n['id']] = (x, Y(n['lane']))
arr = []
for ed in g['edges']:
    (x1, y1), (x2, y2) = pos[ed['from']], pos[ed['to']]
    if (x1, y1) == (x2, y2): continue
    d = '' if ed['kind'] == 'sourced' else ' stroke-dasharray="5 4"'
    mx = (x1 + x2) / 2
    arr.append(f'<path d="M{x1},{y1} C{mx},{y1} {mx},{y2} {x2-8},{y2}" fill="none" stroke="#5e5d59" stroke-width="1.4" marker-end="url(#a)"{d}/>')
o += arr
BARS, DOTS, LABELS = [], [], []
for (lane, _), ns in groups.items():
    n = ns[0]; x, y = pos[n['id']]; col = C[n['status']]
    if n.get('at_window'):
        a, b = X(n['at_window'][0]), X(n['at_window'][1])
        BARS.append(f'<rect x="{a}" y="{y-5}" width="{b-a}" height="10" rx="5" fill="{col}" fill-opacity="0.18" stroke="{col}" stroke-dasharray="4 3"/>')
    fill = col if n['status'] == 'done' else '#ffffff'
    DOTS.append(f'<circle cx="{x}" cy="{y}" r="7" fill="{fill}" stroke="{col}" stroke-width="2"/>')
    lines = ['what may come next, as of ' + n['at'][11:16]] if lane == 'next' else [ns[0]['who'].split(' (')[0] + (f', {n["at"][11:16]}' if n['at'] and n['status'] == 'done' else '')]
    if len(ns) > 1 and lane != 'next': lines.append('; '.join(m.get('short', m['decision'].split(';')[0]) for m in ns))
    else:
        for m in ns: lines.append((m['who'].split(' (')[0] + ': ' if lane == 'next' else '') + {'not_read': 'not readable: ', 'not_announced': '' if lane == 'next' else 'nothing yet: ', 'unknown_time': 'time not known: '}.get(m['status'], '') + m.get('short', m['decision'].split(';')[0]))
    anchor, tx = ('end', x - 12) if x > W - 330 else ('start', x + 12)
    below = bool(n.get('at_window') or n.get('label_below'))
    for j, t in enumerate(lines[:4]):
        t = t if len(t) < 58 else t[:56] + '...'
        ty = (y + 22 + j * 14) if below else (y - 4 + j * 14 if len(lines) <= 2 else y - 14 + j * 14)
        LABELS.append(f'<text x="{tx}" y="{ty}" font-size="{12 if j==0 else 11.5}" font-weight="{700 if j==0 else 400}" fill="#141413" text-anchor="{anchor}" stroke="#f3f2ee" stroke-width="4" stroke-linejoin="round" paint-order="stroke">{e(t)}</text>')
o += BARS + LABELS + DOTS
lt = '; '.join(f'{x["from"]}: {x.get("to_event", "")} before'.replace('-', ' ') for x in g['lead_times'] if x.get('to_event'))
o.append(f'<text x="30" y="{H-46}" font-size="12.5" fill="#141413"><tspan font-weight="700">Lead times to the red wind, as issued:</tspan> IPMA names the storm 46 h 43 min before; issues the red wind 28 h 41 min before; ANEPC\'s public warning 39 h 30 min; the government\'s alert 23 h 50 min. </text>')
o.append(f'<text x="30" y="{H-28}" font-size="12" fill="#5e5d59">Solid: a source says this follows that. Dashed: analysis, not a sourced fact. Hollow: nothing announced yet, or a source our tools cannot read. Bar: happened, time not known.</text>')
o.append(f'<text x="30" y="{H-10}" font-size="12" fill="#5e5d59">Drawn by journalist.examples@web-summit.dinis from decision-graph.json, built on weather@PrompTugal.vicky\'s live.md and decision-chain.md and decision-graph.json (PrompTugal__News__Website, eca7b396 and 358fa21b).</text>')
o.append('</svg>')
open(f'{HERE}/decision-graph.svg', 'w').write(re.sub(r'(?<![\d.v])(\d+\.\d)\d{3,}(?![\d.])', r'\1', '\n'.join(o)) + '\n')  # coordinates to one decimal (never inside a version like v0.2.1733)
print('decision-graph.svg')
