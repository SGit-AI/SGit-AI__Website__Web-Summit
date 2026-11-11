#!/usr/bin/env python3
"""Published against first read: each signal of the storm incident as a bar from the moment its source published it
to the moment our team first read it. From reporter@web-summit.dinis's trace 2026-11-10-the-storm-incident.json
(lead_times and the corrected IPMA events of 00:25, from IPMA's CAP feed). Writes lag.svg beside it."""
import os, re
from datetime import datetime
from html import escape as e
HERE = os.path.dirname(os.path.abspath(__file__))
T = lambda s: datetime.fromisoformat(s)
ROWS = [  # signal, published, first read, lag as the trace states it
  ('IPMA names the storm CHARLES', '2026-11-09T13:17', '2026-11-10T16:53', '27 h 36 min'),
  ("IPMA's red wind warning for Lisbon", '2026-11-10T07:18', '2026-11-10T14:23', '7 h 4 min'),
  ("the government's alert (schools, outdoor events)", '2026-11-10T12:10', '2026-11-10T17:01', '4 h 51 min'),
  ("Lisbon's mayor: the summit likely cannot run (press)", '2026-11-10T13:19', '2026-11-10T18:50', '5 h 31 min'),
  ("IPMA's red rain warning for Lisbon", '2026-11-10T16:30', '2026-11-10T17:42', '1 h 12 min'),
  ("the government recommends suspending it (press)", '2026-11-10T17:53', '2026-11-10T18:50', '57 min'),
  ("Web Summit's own page: Day 2 off", '2026-11-10T19:09', '2026-11-10T20:58', '1 h 49 min'),
  ("Web Summit's email to attendees", '2026-11-10T19:38', '2026-11-10T19:48', '10 min'),
  ("IPMA lowers Lisbon's wind to orange", '2026-11-11T07:16', '2026-11-11T07:38', '22 min'),
  ("IPMA shortens Lisbon's warnings (red rain to 15:00)", '2026-11-11T12:33', '2026-11-11T12:46', '13 min'),
]
T0, T1 = T('2026-11-09T12:00'), T('2026-11-11T16:00')
W, LW, TOP, RH = 1400, 400, 120, 58
H = TOP + RH * len(ROWS) + 110
X = lambda s: LW + (W - LW - 40) * (T(s) - T0).total_seconds() / (T1 - T0).total_seconds()
o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Inter, -apple-system, Segoe UI, Helvetica, Arial, sans-serif">',
     f'<rect width="{W}" height="{H}" fill="#faf9f5"/>',
     '<text x="30" y="44" font-size="26" font-weight="700" fill="#141413">How far ahead could we have known? Published, then read by us</text>',
     '<text x="30" y="74" font-size="15" fill="#5e5d59">Each bar runs from when a source published a signal to when our team first read it. The gap is what a better watch would have given us.</text>']
for h in range(0, 53, 6):
    x = LW + (W - LW - 40) * h / 52; t = datetime.fromtimestamp(T0.timestamp() + h * 3600)
    lab = t.strftime('%a %H:%M') if h in (0, 12, 36) else t.strftime('%H:%M')
    o.append(f'<line x1="{x:.1f}" y1="{TOP-10}" x2="{x:.1f}" y2="{TOP+RH*len(ROWS)}" stroke="#d8d5ca" stroke-dasharray="3 4"/><text x="{x:.1f}" y="{TOP+RH*len(ROWS)+18}" font-size="12" fill="#5e5d59" text-anchor="middle">{lab}</text>')
xi = X('2026-11-10T18:35')
o.append(f'<line x1="{xi:.1f}" y1="{TOP-24}" x2="{xi:.1f}" y2="{TOP+RH*len(ROWS)}" stroke="#8a3b1f" stroke-width="1.5"/><text x="{xi-6:.1f}" y="{TOP-30}" font-size="12.5" font-weight="700" fill="#8a3b1f" text-anchor="end">incident declared, 18:35</text>')
for i, (sig, pub, read, lag) in enumerate(ROWS):
    y = TOP + i * RH + RH / 2
    o.append(f'<rect x="20" y="{y-RH/2+4}" width="{W-40}" height="{RH-8}" rx="8" fill="#5e5d59" fill-opacity="{0.05 if i % 2 else 0.09}"/>')
    o.append(f'<text x="34" y="{y+5}" font-size="13.5" fill="#141413">{e(sig)}</text>')
    a, b = X(pub), X(read)
    o.append(f'<rect x="{a:.1f}" y="{y-7}" width="{max(b-a,3):.1f}" height="14" rx="7" fill="#c96442" fill-opacity="0.35"/>')
    o.append(f'<circle cx="{a:.1f}" cy="{y}" r="6" fill="#1f5f8b"/><circle cx="{b:.1f}" cy="{y}" r="6" fill="#ffffff" stroke="#c96442" stroke-width="2"/>')
    tx, anc = (b + 12, 'start') if b < W - 200 else (a - 12, 'end')
    o.append(f'<text x="{tx:.1f}" y="{y+5}" font-size="13" font-weight="700" fill="#141413" text-anchor="{anc}" stroke="#f3f2ee" stroke-width="4" paint-order="stroke">{lag}</text>')
o.append(f'<text x="30" y="{H-48}" font-size="12.5" fill="#141413"><tspan font-weight="700">Blue:</tspan> published by the source. <tspan font-weight="700">Open orange:</tspan> first read by our team. Times UTC (= Lisbon), 9 to 11 November 2026; press items labelled.</text>')
o.append(f'<text x="30" y="{H-28}" font-size="12" fill="#5e5d59">The longest gaps came before the incident was declared. On Wednesday, with IPMA\'s CAP feed watched, IPMA\'s changes reached us in 22 and 13 minutes.</text>')
o.append(f'<text x="30" y="{H-10}" font-size="12" fill="#5e5d59">Drawn by journalist.examples@web-summit.dinis from reporter@web-summit.dinis\'s trace 2026-11-10-the-storm-incident (lead_times; IPMA\'s issue times from its CAP feed, found 23:52).</text>')
o.append('</svg>')
open(f'{HERE}/lag.svg', 'w').write('\n'.join(o) + '\n'); print('lag.svg')
