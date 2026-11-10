#!/usr/bin/env python3
"""The parser path Dinis described (about 17:00 UTC, 10 Nov) against what the commits show, stage by stage.
From reporter@web-summit.dinis's trace storm-weather-desk (parser_workflow). Writes path-vs-reality.svg beside it."""
import os
from html import escape as e
HERE = os.path.dirname(os.path.abspath(__file__))
STAGES = [
  ('1. a raw source', 'an agent hits raw JSON|or a page where one|small part matters',
   'done', 'IPMA\'s JSON read at 14:23;|then 8 sources mapped:|which a machine can read'),
  ('2. a request', 'it asks the conductor:|"can somebody build|a parser?"',
   'skipped', 'skipped: the desk|built its readers itself|(17:51, watch.mjs)'),
  ('3. the architect', 'an architect writes|the plan as a|markdown file',
   'self', 'the desk wrote it:|one storm page,|a proposal (17:52)'),
  ('4. developer, designer', 'a developer builds it,|a designer maps it',
   'half', 'readers: the desk (17:51);|the page: asked of dev.graphs@|and designer@ (18:13)'),
  ('5. a UI', 'checked; a UI turns|noise into signal',
   'notyet', 'not yet'),
]
COL = {'done': ('#1f5f8b', ''), 'self': ('#1f5f8b', ''), 'half': ('#1f5f8b', ' stroke-dasharray="6 4"'), 'skipped': ('#8a8984', ' stroke-dasharray="4 4"'), 'notyet': ('#c96442', ' stroke-dasharray="4 4"')}
W, BW, GAP, X0 = 1400, 218, 18, 200
o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 520" font-family="Inter, -apple-system, Segoe UI, Helvetica, Arial, sans-serif">',
     f'<rect width="{W}" height="520" fill="#faf9f5"/>',
     '<text x="30" y="44" font-size="26" font-weight="700" fill="#141413">The parser path: what Dinis described, and what the agents did</text>',
     '<text x="30" y="74" font-size="15" fill="#5e5d59">Five hands in the plan; one agent, the weather desk, did four of them itself, then asked for a developer and a designer</text>',
     '<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#5e5d59"/></marker></defs>']
for row, (lab, sub, y) in enumerate([('the plan', 'Dinis, about 17:00', 110), ('the record', 'the commits, to 18:14', 290)]):
    o.append(f'<rect x="20" y="{y}" width="{W-40}" height="160" rx="10" fill="{"#8a3b1f" if row == 0 else "#1f5f8b"}" fill-opacity="0.08"/>')
    o.append(f'<text x="34" y="{y+72}" font-size="16" font-weight="700" fill="#141413">{lab}</text><text x="34" y="{y+94}" font-size="12.5" fill="#5e5d59">{sub}</text>')
    for i, (title, plan, st, real) in enumerate(STAGES):
        x = X0 + i * (BW + GAP); bx, by = x, y + 16
        stroke, dash = ('#8a3b1f', '') if row == 0 else COL[st]
        o.append(f'<rect x="{bx}" y="{by}" width="{BW}" height="128" rx="9" fill="#ffffff" stroke="{stroke}" stroke-width="1.8"{dash}/>')
        o.append(f'<text x="{bx+12}" y="{by+26}" font-size="14" font-weight="700" fill="#141413">{e(title)}</text>')
        for j, t in enumerate((plan if row == 0 else real).split('|')):
            o.append(f'<text x="{bx+12}" y="{by+52+j*19}" font-size="13" fill="#141413">{e(t)}</text>')
        if i < 4:
            o.append(f'<path d="M{bx+BW+2},{by+64} H{bx+BW+GAP-2}" stroke="#5e5d59" stroke-width="1.5" marker-end="url(#a)"{" stroke-dasharray=\"4 4\"" if row == 1 and st == "skipped" else ""}/>')
o.append('<text x="30" y="486" font-size="12" fill="#5e5d59">Solid: done. Dashed blue: partly done. Grey dashed: skipped. Orange dashed: not yet. Times UTC, 10 November 2026.</text>')
o.append('<text x="30" y="506" font-size="12" fill="#5e5d59">Drawn by journalist.examples@web-summit.dinis from reporter@web-summit.dinis\'s trace storm-weather-desk (parser_workflow) and PrompTugal__News__Website\'s commits 78d3a0cd, cc99e9b2, d826acce.</text>')
o.append('</svg>')
open(f'{HERE}/path-vs-reality.svg', 'w').write('\n'.join(o) + '\n'); print('path-vs-reality.svg')
