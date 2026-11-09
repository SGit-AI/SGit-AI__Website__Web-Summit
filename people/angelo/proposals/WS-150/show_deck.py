#!/usr/bin/env python3
"""The stand-up's deck (conductor@web-summit.dinis, 4 November 2026): slides built from the repository (git log,
data/team.json, data/person-keys.json, the board) plus screenshots in assets/shows/<meeting id>/, written as an HTML
fragment to team/conductor/shows/<meeting id>.show; the build renders it at /meetings/<id>/show/ and assets/deck.js
presents it (arrow keys, F, Esc). Usage: python3 -I team/conductor/tools/show_deck.py <meeting id> <since ISO> <prev meeting ISO>"""
import subprocess, re, collections, json, sys, html, os, datetime
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
os.chdir(ROOT)
MID, SINCE, PREV = sys.argv[1], sys.argv[2], sys.argv[3]
E = html.escape
IMG = f'../../../assets/shows/{MID}/'
COL = {'dinis': '#111827', 'vicky': '#7c3aed', 'jose': '#0e7490', 'indi': '#c2410c', 'angelo': '#15803d', 'silvio': '#b91c1c', 'nimay': '#1d4ed8', 'daniela': '#a16207', 'sarah': '#be185d'}
team = json.load(open('data/team.json'))
humans = [m for m in team['members'] if m['kind'] == 'human']
NAME = {m['id']: m['name'] for m in humans}
log = subprocess.run(['git', 'log', f'--since={SINCE}', '--format=%cI\x1f%s'], capture_output=True, text=True).stdout.splitlines()
rel, rows = 0, []
for l in log:
    at, s = l.split('\x1f', 1)
    if s.startswith('site v'): rel += 1; continue
    m = re.match(r'([a-z-]+)@web-summit\.([a-z]+): (.*)', s)
    if m: rows.append((at, m.group(2), m.group(1), m.group(3)))
per = collections.Counter(p for _, p, _, _ in rows)
since = collections.Counter(p for at, p, _, _ in rows if at >= PREV)
agents = collections.defaultdict(set)
for _, p, a, _ in rows: agents[p].add(a)
hours = sorted({at[:13] for at, *_ in rows})
first = datetime.datetime.fromisoformat(SINCE.replace('Z', '+00:00'))
H = [(first + datetime.timedelta(hours=k)).strftime('%Y-%m-%dT%H') for k in range(int((datetime.datetime.now(datetime.timezone.utc) - first).total_seconds() // 3600) + 1)]
grid = collections.defaultdict(collections.Counter)
for at, p, *_ in rows: grid[p][at[:13]] += 1
people = [p for p, _ in per.most_common()]
keys = json.load(open('data/person-keys.json'))['keys']
klist = sorted({k['person'] for k in keys if k['status'] == 'active'})
akeys = len(json.load(open('data/keys.json'))['keys'])
roster_agents = sum(len(m.get('agents', [])) for m in humans)
active_agents = sum(len(a) for a in agents.values())

def heat():
    w, h, lw = 1000, 34, 110
    cw = (w - lw) / len(H); mx = max([c for g in grid.values() for c in g.values()] or [1])
    out = [f'<svg viewBox="0 0 {w} {h * len(people) + 30}" class="heat" role="img" aria-label="Commits per hour, per person">']
    for r, p in enumerate(people):
        y = r * h
        out.append(f'<text x="0" y="{y + 22}" class="hl">{E(NAME.get(p, p).split()[0])}</text>')
        for i, hh in enumerate(H):
            n = grid[p].get(hh, 0)
            if n: out.append(f'<rect x="{lw + i * cw:.1f}" y="{y + 4}" width="{cw - 1.5:.1f}" height="{h - 8}" rx="3" fill="{COL.get(p, "#555")}" opacity="{0.25 + 0.75 * n / mx:.2f}"><title>{E(NAME.get(p, p))}, {hh[11:]}:00 UTC: {n}</title></rect>')
            else: out.append(f'<rect x="{lw + i * cw:.1f}" y="{y + 15}" width="{cw - 1.5:.1f}" height="4" rx="2" class="nil"/>')
    for i, hh in enumerate(H):
        if hh[11:] in ('00', '06', '12', '18'): out.append(f'<text x="{lw + i * cw:.1f}" y="{h * len(people) + 20}" class="hx">{hh[8:10]} Nov {hh[11:]}:00</text>')
    out.append('</svg>'); return ''.join(out)

def bars(counter, label):
    mx = max(counter.values() or [1])
    return '<div class="bars">' + ''.join(f'<div class="b"><span>{E(NAME.get(p, p).split()[0])}</span><i style="width:{n / mx * 100:.0f}%;background:{COL.get(p, "#555")}"></i><b>{n}</b></div>' for p, n in counter.most_common()) + f'</div><p class="cap">{label}</p>'

def dots():
    out = ''
    for p in people:
        a = sorted(agents[p])
        out += f'<div class="dotrow"><span>{E(NAME.get(p, p).split()[0])}</span><span class="ds">' + ''.join(f'<i style="background:{COL.get(p, "#555")}" title="{E(x)}@web-summit.{p}"></i>' for x in a) + f'</span><em>{len(a)}: {E(", ".join(a))}</em></div>'
    return out

def shot(f, cap): return f'<figure class="shot"><img src="{IMG}{f}" alt="{E(cap)}" loading="lazy"><figcaption>{E(cap)}</figcaption></figure>'
def items(l): return '<ul>' + ''.join(f'<li>{x}</li>' for x in l) + '</ul>'
def recent(p, n=6): return [f'{E(a)}: {E(s[:110])}' for at, q, a, s in rows if q == p][:n]

S = []
SCH = json.load(open('data/meetings/schedule.json'))
MTIME = SCH.get('moves', {}).get(MID) or f'{MID[-4:-2]}:{MID[-2:]}'
MDAY = datetime.date.fromisoformat(MID[:10])
DAYS = (datetime.date(2026, 11, 9) - MDAY).days
COVER = {'2026-11-04-1800': 'The 18:00 debrief'}.get(MID, f'The {MTIME} stand-up')
S.append(('cover', f'''<div class="cover"><p class="kick">RiskMandate · Web Summit Lisbon 2026 · the team</p><h1>{COVER}</h1>
<p class="big">{MDAY:%A} {MDAY.day} {MDAY:%B %Y} · {MTIME} Lisbon · <b>{DAYS} days</b> to opening night (Mon 9 Nov), our stand Thu 12 Nov</p>
<div class="tiles"><div><b>{len(rows)}</b>agent commits since the last stand-up</div><div><b>{rel}</b>releases</div><div><b>{active_agents}</b>agents at work since then</div><div><b>{len(klist)} of 7</b>people with a site key</div></div>
<p class="cap">Built from the repository at {datetime.datetime.now(datetime.timezone.utc):%H:%M} UTC. Nobody was asked what they did.</p></div>'''))
# Angelo, signed message of 4 November 17:25: "a section at the top for urgent, late, logistics open points"
def board():
    out = []
    for f in sorted(os.listdir('board')):
        if not re.match(r'WS-\d+.*\.md$', f): continue
        t = open(os.path.join('board', f)).read(); m = re.match(r'---\n(.*?)\n---', t, re.S)
        if not m: continue
        meta = {}
        for l in m.group(1).split('\n'):
            if ':' in l: k, v = l.split(':', 1); meta[k.strip()] = v.strip().strip('"')
        meta['file'] = f; out.append(meta)
    return out
today = datetime.datetime.now(datetime.timezone.utc).day
def dday(d):
    m = re.search(r'(\d{1,2}) Nov', d or ''); return int(m.group(1)) if m and 'daily' not in (d or '') else None
B = [x for x in board() if x.get('status') not in ('done',)]
late = sorted([x for x in B if dday(x.get('due')) is not None and dday(x.get('due')) < today], key=lambda x: dday(x['due']))
urgent = [x for x in B if dday(x.get('due')) == today]
logi = [x for x in B if x.get('area') in ('merch', 'ops') or re.search(r'print|merch|shirt|hoodie|collect|travel|hotel|badge|ticket|booth|the stand(?![-\w])', x.get('title', ''), re.I)]
def row(x, tone): return f'<li class="{tone}"><b>{E(x["id"])}</b> {E(x.get("title", "")[:95])} <span>{E(x.get("due", ""))} · {E(x.get("for", ""))} · {E(x.get("status", ""))}</span></li>'
# WS-150 (Angelo, 5 November): the generic 'Open points first' slide is gone; its counts move to the strip on 'What needs us today'
S.append(('The day, hour by hour', f'<h2>Who worked when: commits per hour, per person (their agents), since the last stand-up</h2>{heat()}<p class="cap">Each square is an hour; darker is more.</p>'))
S.append(('The agents', f'<h2>{active_agents} agents did work today; {akeys} keys on the keys page</h2>{dots()}<p class="cap">One dot per agent that committed under its own name since the last stand-up.</p>'))
# the meeting's own story: team/conductor/shows/<meeting id>.py, run here with everything above in scope (S, shot,
# items, bars, per, agents, since, E, ...); the generated slides above are the same for every meeting
NARR = f'team/conductor/shows/{MID}.py'
if os.path.exists(NARR): exec(open(NARR).read())

# WS-150 (Angelo's brief, 5 November; people/angelo/proposals/WS-150/): the meeting's "To decide" slide becomes "What needs us
# today": at most five, ranked by what blocks Lisbon, from team-collaboration@web-summit.angelo's ranking
# (people/angelo/tools/standup-show.mjs --rank, read-only), with the counts strip slide 2 used to carry. Follow-ups stay last.
def needs_us_today():
    try:
        r = json.loads(subprocess.run(['node', 'people/angelo/tools/standup-show.mjs', '--rank', '.', MID], capture_output=True, text=True, check=True).stdout)
    except Exception as e:
        return None
    lu = len([x for x in late if not x.get('picked_by')])
    NEED = {'Decide': 'n-dec', 'Write': 'n-wri', 'Do': 'n-wri', 'Needs owner': 'n-own'}
    rows_ = ''.join(f'<li class="{E(t["tone"])}"><span class="nn">{i}</span><div class="nt"><b>{E(t["title"])}</b><span>{E(t["sub"])}</span></div><span class="no">{E(t["owner"])}</span><span class="nd {NEED.get(t["need"], "n-dec")}">{E(t["need"])}</span><span class="nb">{E(t["by"])}</span></li>' for i, t in enumerate(r['top'], 1))
    strip = f'<div class="nstrip"><span><b>{len(late)}</b> late · <b>{lu}</b> with no owner: park them?</span><span><b>{len(urgent)}</b> due today</span><span>Logistics before Lisbon: <b>{len(logi)}</b></span><span>Full list: the board</span></div>'
    return f'<h2>{["Nothing", "One thing", "Two things", "Three things", "Four things", "Five things"][len(r["top"])]} that need us today</h2><p class="cap nsub">Ranked by what blocks Lisbon (Mon 9 Nov). One owner each. Everything else is on the board.</p><ol class="needs">{rows_}</ol>{strip}'
_n = needs_us_today()
if _n:
    _i = next((k for k, (t, _) in enumerate(S) if t in ('To decide now', 'To decide')), None)
    if _i is not None: S[_i] = ('What needs us today', _n)
    else:
        _f = next((k for k, (t, _) in enumerate(S) if t == 'Follow-ups'), len(S)); S.insert(_f, ('What needs us today', _n))
_f = [x for x in S if x[0] == 'Follow-ups']
S = [x for x in S if x[0] != 'Follow-ups'] + _f

css = '''
.deck{--paper:var(--surface);font-size:17px}.deck *{box-sizing:border-box}
.deck .slide{position:relative;aspect-ratio:16/9;background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:2.2em 2.6em;margin:0 0 1.6em;overflow:hidden;display:flex;flex-direction:column}
.deck .slide h1{font:800 3.4em/1.05 Georgia,serif;margin:.4em 0}.deck .slide h2{font:700 1.75em/1.2 Georgia,serif;margin:0 0 1em;border:0;padding:0}
.deck .slide-n{position:absolute;right:1em;bottom:.6em;font:600 .75em ui-monospace,monospace;color:var(--ink-2)}
.deck .kick{font:700 .8em ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}.deck .big{font-size:1.25em}
.deck .cover{display:flex;flex-direction:column;justify-content:center;height:100%}
.deck .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:.8em;margin:1em 0}.deck .tiles div{border:1px solid var(--line);border-radius:12px;padding:.8em 1em;color:var(--ink-2);font-size:.9em;background:var(--surface-2)}.deck .tiles b{display:block;font:800 2.3em/1.1 Georgia,serif;color:var(--ink)}
.deck .cap{color:var(--ink-2);font-size:.9em;margin:.4em 0 0}.deck ul,.deck ol{margin:.6em 0 0;padding-left:1.2em;font-size:1em}.deck li{margin:.3em 0}
.deck .two{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:minmax(0,1fr);gap:1em;min-height:0;flex:1 1 0}.deck .shot{margin:0;display:flex;flex-direction:column;min-height:0;height:100%}
.deck .shot img{width:100%;flex:1 1 0;min-height:0;object-fit:cover;object-position:top;border:1px solid var(--line);border-radius:10px}.deck .shot figcaption{font-size:.8em;color:var(--ink-2);margin-top:.3em}
.deck .two+ul{font-size:.82em;margin-top:.5em;flex:none}
.deck .heat{width:100%}.deck .heat .hl{font:600 14px system-ui;fill:var(--ink)}.deck .heat .hx{font:11px ui-monospace,monospace;fill:var(--ink-2)}.deck .heat .nil{fill:var(--line)}
.deck .bars .b{display:grid;grid-template-columns:110px 1fr 40px;gap:.8em;align-items:center;margin:.35em 0}.deck .bars i{display:block;height:20px;border-radius:5px}
.deck .dotrow{display:grid;grid-template-columns:90px 22em 1fr;gap:.6em;align-items:center;margin:.5em 0}.deck .dotrow i{display:inline-block;width:22px;height:22px;border-radius:6px;margin-right:4px}.deck .dotrow em{font-style:normal;color:var(--ink-2);font-size:.85em}
.deck .keys{display:grid;grid-template-columns:repeat(4,1fr);gap:1em;margin:1em 0}.deck .keys .k{border:2px dashed var(--line-2);border-radius:14px;padding:1em;opacity:.6}.deck .keys .k.on{border:2px solid var(--c);opacity:1}.deck .keys b{display:block;font-size:1.3em}.deck .keys span{color:var(--ink-2)}
.deck .raci{border-collapse:collapse;font-size:.95em;width:100%}.deck .raci td,.deck .raci th{border:1px solid var(--line);padding:.35em .5em;text-align:center}.deck .raci td:first-child{text-align:left}
.deck .rA{background:var(--accent);color:var(--accent-ink);font-weight:800}.deck .rR{background:var(--accent-soft);font-weight:700}.deck .rC{color:var(--ink)}.deck .rI{color:var(--ink-2)}
.deck .three{display:grid;grid-template-columns:repeat(3,1fr);gap:1em;min-height:0;flex:1 1 0;overflow:hidden}.deck .three h3{margin:0 0 .3em;font-size:1em}.deck .pts{list-style:none;padding:0;margin:0;font-size:.72em}.deck .pts li{margin:.25em 0;padding-left:.5em;border-left:4px solid var(--line-2)}.deck .pts li.late{border-color:var(--warm)}.deck .pts li.today{border-color:var(--accent)}.deck .pts span{display:block;color:var(--ink-2)}.deck .decide li{font-size:1.1em;margin:.5em 0}
.deck.one .slide{display:none;margin:0}.deck.one .slide.current{display:flex}.deck.one>:not(.slide):not(.deck-bar){display:none}
.deck .deck-bar{display:flex;align-items:center;gap:.5em;flex-wrap:wrap;margin:.8em 0 1.2em}.deck .deck-bar button,.deck .deck-pdf{font:inherit;font-size:.9em;font-weight:700;padding:.45em .9em;border-radius:10px;border:1px solid var(--line-2);background:var(--surface);color:var(--ink);cursor:pointer;text-decoration:none}
.deck .deck-bar [data-prev],.deck .deck-bar [data-next]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);min-width:3em}.deck .deck-bar button:disabled{opacity:.35;cursor:default}
.deck .deck-pos{font:600 .9em ui-monospace,monospace;min-width:4.5em;text-align:center}.deck .deck-gap{flex:1}
.deck.all .deck-bar{position:sticky;bottom:0;background:var(--bg);padding:.5em 0;margin:0}
.deck.full,.deck:fullscreen{position:fixed;inset:0;z-index:1000;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1vh 2vw;font-size:clamp(14px,1.45vw,26px)}
.deck.full .slide.current,.deck:fullscreen .slide.current{width:min(96vw,150vh)}.deck.full .deck-bar,.deck:fullscreen .deck-bar{width:min(96vw,150vh);margin:.6em 0 0}
html.deck-on body{overflow:hidden}
.deck .nsub{margin:-.7em 0 .9em}.deck .needs{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.45em;flex:1 1 0;min-height:0}
.deck .needs li{display:grid;grid-template-columns:2.2em 1fr 9em 8em 5em;align-items:center;gap:.6em;background:var(--surface-2);border-radius:12px;border-left:6px solid #d97706;padding:.45em .9em;margin:0}
.deck .needs li.hot{border-left-color:#c0392b}.deck .needs .nn{font:400 1.5em Georgia,serif;color:var(--ink-2)}.deck .needs .nt b{display:block;font-size:1.05em;line-height:1.2}.deck .needs .nt span{color:var(--ink-2);font-size:.8em}
.deck .needs .no{font-weight:600}.deck .needs .nd{justify-self:start;font:700 .72em system-ui;letter-spacing:.06em;text-transform:uppercase;border-radius:99px;padding:.3em .8em}
.deck .n-dec{background:#fde2e0;color:#b42318}.deck .n-wri{background:#dcf3e6;color:#16794c}.deck .n-own{background:#fdf0d5;color:#a15c07}.deck .needs .nb{text-align:right;font-weight:600}
.deck .nstrip{display:flex;flex-wrap:wrap;gap:.6em;margin-top:.8em;font-size:.85em}.deck .nstrip span{background:var(--surface-2);border-radius:10px;padding:.35em .8em}
@media (max-width:760px){.deck .needs li{grid-template-columns:2em 1fr;}.deck .needs .no,.deck .needs .nd,.deck .needs .nb{grid-column:2}}
@media (max-width:760px){.deck .slide{aspect-ratio:auto;min-height:70vh;padding:1.1em;overflow:visible}.deck .two,.deck .tiles,.deck .keys,.deck .three{grid-template-columns:1fr}.deck .two{flex:none}.deck .shot img{flex:none;height:auto;max-height:45vh}
.deck .slide h1{font-size:2.2em}.deck .slide h2{font-size:1.35em}.deck .dotrow{grid-template-columns:5em 1fr}.deck .dotrow em{grid-column:1/-1}.deck .raci{font-size:.75em}.deck .bars .b{grid-template-columns:5em 1fr 2.5em}.deck .three{flex:none;overflow:visible}.deck .deck-gap{display:none}}
@media print{.deck .deck-bar{display:none}}
'''
frag = f'<style>{css}</style>\n<div class="deck one" data-pdf="{IMG}deck.pdf">' + ''.join(f'<section class="slide" aria-label="{E(t)}">{b}</section>' for t, b in S) + '</div>\n<script src="../../../assets/deck.js" defer></script>\n'
os.makedirs('team/conductor/shows', exist_ok=True)
open(f'team/conductor/shows/{MID}.show', 'w').write(frag)
print(f'{len(S)} slides -> team/conductor/shows/{MID}.show ({len(frag)} bytes)')
