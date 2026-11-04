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
S.append(('cover', f'''<div class="cover"><p class="kick">RiskMandate · Web Summit Lisbon 2026 · the team</p><h1>The 18:00 debrief</h1>
<p class="big">Wednesday 4 November 2026 · 18:00 Lisbon · <b>5 days</b> to opening night (Mon 9 Nov), our stand Thu 12 Nov</p>
<div class="tiles"><div><b>{len(rows)}</b>agent commits since yesterday's 18:00</div><div><b>{rel}</b>releases</div><div><b>{active_agents}</b>agents at work today</div><div><b>{len(klist)} of 7</b>people with a site key</div></div>
<p class="cap">Built from the repository at {datetime.datetime.now(datetime.timezone.utc):%H:%M} UTC. Nobody was asked what they did.</p></div>'''))
S.append(('The day, hour by hour', f'<h2>Who worked when: commits per hour, per person (their agents), since yesterday 18:00</h2>{heat()}<p class="cap">The night is not empty: Indi\'s factory at 23:00, Jose\'s agents from 23:40 to 02:00, Dinis\'s journalist every two hours. Each square is an hour; darker is more.</p>'))
S.append(('The agents', f'<h2>{active_agents} agents did work today; {akeys} keys on the keys page</h2>{dots()}<p class="cap">One dot per agent that committed under its own name since yesterday 18:00.</p>'))
S.append(('Since the 14:30 stand-up', f'<h2>Since the 14:30 stand-up</h2>{bars(since, "Commits since 14:30, by person (their agents).")}' + items([
    '<b>Jose</b>: the team site now sends its page views (WS-37): two vaults, five lanes, an hourly drain; a view signed with his key verified',
    '<b>Silvio</b>: the merch is <b>ordered</b>; the sleeve logo confirmed by Dinis in person; Vicky\'s colours settled',
    '<b>Vicky</b>: the newsroom\'s two vaults exist; her researcher\'s second run; the outreach plan from her meeting with Nimay',
    '<b>Indi</b>: synthetic users re-tested the cards and the /meet/ pages; the most important thing each person did, on every show page (WS-149); an accountant agent (WS-148)',
    '<b>Angelo</b>: his own command centre, a kanban and a "team and the machine" board',
    '<b>Dinis\'s agents</b>: the observability pack; incident WS-151 found and fixed ("Only you can do this" first)'])))
S.append(('Indi', f'<h2>Indi: the factory, overnight</h2><div class="two">{shot("indi-factory-index.jpg", "The factory: one infographic per company")}{shot("indi-factory.jpg", "Hexamind, one of 28 companies, in normal and lay terms")}</div>' + items([
    f'<b>{per["indi"]} commits</b> from <b>{len(agents["indi"])} agents</b> ({E(", ".join(sorted(agents["indi"])))}), the first on schedule overnight',
    '<b>The factory</b> (dev@indi, 23:00 to 23:14): an infographic for <b>all 28 companies</b> we want to meet: what it does, its risk from agents, how RiskMandate helps',
    '<b>Business cards</b>: three concepts, six round-2 designs, tested by synthetic users (Record picked by 4 of 5)',
    '<b>The newsroom</b>: a review of the three earlier newsrooms and a patch that makes ours a publication (WS-141)'])))
S.append(('Indi: cards and tests', f'<h2>Indi: the cards, and agents that test like users</h2><div class="two">{shot("indi-cards.jpg", "/cards/: the designs, one at a time, for a phone")}{shot("indi-dash.jpg", "Indi\'s dashboard")}</div>'))
S.append(('Vicky', f'<h2>Vicky: {per["vicky"]} commits from {len(agents["vicky"])} agents</h2><div class="two">{shot("vicky-guide.jpg", "The plain-language onboarding guide (WS-100)")}{shot("vicky-dash.jpg", "Vicky\'s dashboard")}</div>' + items([
    '<b>The onboarding guide</b>, written from her own setup: steps 1 to 9, exact button names (pm@vicky)',
    '<b>The newsroom</b>: her researcher\'s first runs (19 captures on the summit and Portugal, then Europe and the Gender in Tech report); the research vault (pack mode) and the interview shortlist vault',
    '<b>Logistics</b>: the print date, who collects, her colours; <b>one report a day</b> from every agent to her conductor',
    '<b>Outreach</b>: the plan from her meeting with Nimay; the hot-leads rule drafted'])))
S.append(('Jose', f'<h2>Jose: observability, live in an afternoon</h2><div class="two">{shot("jose-dash.jpg", "Jose\'s dashboard")}{shot("keys.jpg", "The keys page: every agent\'s public key")}</div>' + items([
    '<b>The team site sends its page views</b> (17:08): two vaults (data, private; the app, published), <b>five lanes</b>, an hourly drain and one from inside the vault',
    'A page view sent <b>with Jose\'s site key</b> was verified as Jose: the first signed visit',
    '<b>A reviewer agent</b> that holds his conductor\'s and dashboard\'s work until it is right (two wrong claims caught)',
    '<b>Hack the Agent</b> and <b>ReachCheck</b> offered as stand demos (WS-108); WhatsApp reports through n8n (WS-39)'])))
S.append(('Angelo', f'<h2>Angelo: his own command centre</h2><div class="two">{shot("angelo-kanban.jpg", "Angelo\'s team board: the kanban")}{shot("angelo-app.jpg", "Angelo\'s command centre, extended, not copied")}</div>' + items([
    '<b>Slices 0 to 5</b> of his command centre: the kanban, filters, bookmarkable views, people and agents and the machine',
    '<b>team-collaboration@angelo</b> moved today\'s stand-up and keeps the debriefs (it still needs the transcript)',
    'The technical parts of the onboarding guide; <b>Give feedback</b> in one click (WS-140)'])))
S.append(('Silvio', f'<h2>Silvio: the merch is ordered</h2><div class="two">{shot("print-next.jpg", "/print/: the next set (generic QR, the RiskMandate mark)")}{shot("home.jpg", "The home page")}</div>' + items([
    '<b>Ordered</b> with the chosen printer; layouts and invoice on Thursday; collection asked for Monday 9 Nov',
    'The sleeves carry the RiskMandate logo (Silvio\'s choice, Dinis\'s word in person, 17:03)',
    'Vicky\'s purple T-shirts and lavender hoodie; a printer that declined publication recorded as no'])))
S.append(('Dinis\'s agents', f'<h2>Dinis\'s agents: {per["dinis"]} commits from {len(agents["dinis"])} agents</h2><div class="two">{shot("newsroom-brief.jpg", "The newsroom\'s brief pack: Dinis\'s vision, verbatim, and nine pages")}{shot("dinis-app.jpg", "Dinis\'s command centre")}</div>' + items([
    '<b>The newsroom</b>: the brief pack live; the newsroom agent\'s site; Indi\'s and Vicky\'s desks starting',
    '<b>Keys flying</b>: five people with keys, signed messages verified, the big "Add your key" on every page',
    '<b>The observability pack</b> (from the PHP site\'s vaults), picked up by Jose within the hour',
    '<b>Incident WS-151</b>: why WS-145 was buried; found, fixed, "Only you can do this" first'])))
S.append(('Keys', f'<h2>Keys: who can be known by the site</h2><div class="keys">' + ''.join(f'<div class="k {"on" if m["id"] in klist else ""}" style="--c:{COL.get(m["id"], "#555")}"><b>{E(m["name"].split()[0])}</b><span>{"key issued" if m["id"] in klist else "no key yet"}</span></div>' for m in humans if m['id'] not in ('daniela', 'sarah')) + '</div><p class="cap">WS-136. Next: Silvio and Nimay. Then the vault-to-vault lanes (WS-120), and signed page views for everyone (WS-37).</p>'))
S.append(('The 14:30, looked back', '<h2>The 14:30 stand-up: what we know came out of it</h2>' + items([
    '<b>Settled since, outside the call</b>: the merch ordered (Silvio); the sleeve logo (Dinis, in person); Vicky\'s colours; the generic QR accepted by Dinis (in chat) and the next print set ready on /print/#next',
    '<b>Not on the record</b>: no decision from the 14:30 was written down; team-collaboration@angelo still waits for the transcript (WS-96, WS-107)',
    '<b>Asked of Dinis and still open</b>: Indi\'s write access to the newsroom (WS-145), Indi\'s patch and the desks split (WS-141); protect main (WS-105)',
    '<b>Raised by Dinis after it</b>: briefs as pages with "I have read this", a RACI per person, observability for people and agents (now live for the site)'])))
RACI = [('The newsroom', 'A', 'I', 'C', 'I', 'R', 'I', 'R'), ('Merch and print', 'A', 'R', 'I', 'I', 'C', 'I', 'C'), ('Observability', 'A', 'I', 'I', 'C', 'I', 'R', 'I'),
        ('Keys and identity', 'A', 'R', 'R', 'R', 'R', 'R', 'R'), ('Outreach: the first five, the message', 'C', 'R', 'A', 'I', 'R', 'I', 'C'), ('The site and the home page', 'A', 'I', 'I', 'R', 'I', 'C', 'C'),
        ('Stand-ups and decisions', 'A', 'I', 'I', 'R', 'C', 'I', 'I'), ('Onboarding (the guide)', 'I', 'I', 'I', 'C', 'A', 'I', 'C')]
hdr = ['Dinis', 'Silvio', 'Nimay', 'Angelo', 'Vicky', 'Jose', 'Indi']
S.append(('RACI, a first cut', '<h2>RACI, a first cut for Dinis to mark up</h2><table class="raci"><tr><th>Workstream</th>' + ''.join(f'<th>{h}</th>' for h in hdr) + '</tr>' + ''.join('<tr><td>' + E(r[0]) + '</td>' + ''.join(f'<td class="r{x}">{x}</td>' for x in r[1:]) + '</tr>' for r in RACI) + '</table><p class="cap"><b>R</b> does it · <b>A</b> answers for it (one per row) · <b>C</b> is asked first · <b>I</b> is told. Each person\'s dashboard will lead with their A and R rows.</p>'))
S.append(('To decide now', '<h2>To decide at this stand-up</h2><ol class="decide">' + ''.join(f'<li>{x}</li>' for x in [
    '<b>The RACI</b>: accept the first cut, or mark it up now',
    '<b>The newsroom</b>: write access for Indi (WS-145) and Vicky; apply Indi\'s patch; the desks split (WS-141)',
    '<b>Observability</b>: a public vault for the team\'s reads (per person), counts only for everyone else; who sees /stats/',
    '<b>Print</b>: the next set on /print/#next (generic QR, the RiskMandate mark, Vicky Wang): yes; who collects on Monday',
    '<b>WS-151</b>: "Only you can do this" first on Dinis\'s dashboard, and on everyone\'s',
    '<b>Who records the decisions</b> (WS-107): team-collaboration@angelo drafts, the chair confirms (Vicky\'s choice)']) + '</ol>'))
S.append(('Follow-ups', '<h2>Follow-ups, each with an owner</h2>' + items([
    '<b>Silvio and Nimay</b>: add their site keys tonight (their conductors issue them)',
    '<b>Jose</b>: /stats/ with the team\'s reads; the agent lane (every agent logs what it read and did)',
    '<b>Indi and Vicky</b>: the newsroom\'s first desks running from its brief pack; three articles by Saturday',
    '<b>The designer</b>: the print set\'s re-signs as soon as Dinis says yes on /print/#next',
    '<b>Dinis\'s conductor</b>: briefs as pages with "I have read this"; the RACI on every dashboard; this deck before every stand-up'])))

css = '''
.deck{--paper:var(--surface);font-size:17px}.deck *{box-sizing:border-box}
.deck .deck-bar{display:flex;gap:1em;align-items:center;margin:0 0 1em}.deck .deck-bar button{font:inherit;font-weight:700;padding:.5em 1em;border-radius:10px;border:0;background:var(--accent);color:var(--accent-ink);cursor:pointer}
.deck .deck-help{color:var(--ink-2);font-size:.85em}
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
.deck .decide li{font-size:1.1em;margin:.5em 0}
.deck.presenting{position:fixed;inset:0;z-index:1000;background:var(--bg);padding:2vh 2vw;display:flex;align-items:center;justify-content:center}
.deck.presenting>:not(.slide):not(.deck-bar){display:none}.deck.presenting .deck-bar{position:fixed;top:.6em;left:1em;z-index:2}.deck.presenting .slide{display:none;width:min(96vw,170vh);margin:0;font-size:clamp(14px,1.45vw,26px)}.deck.presenting .slide.current{display:flex}
html.deck-on body{overflow:hidden}
@media (max-width:760px){.deck .slide{aspect-ratio:auto;padding:1.2em}.deck .two,.deck .tiles,.deck .keys{grid-template-columns:1fr}.deck .slide h1{font-size:2.2em}}
'''
frag = f'<style>{css}</style>\n<div class="deck">' + ''.join(f'<section class="slide" aria-label="{E(t)}">{b}</section>' for t, b in S) + '</div>\n<script src="../../../assets/deck.js" defer></script>\n'
os.makedirs('team/conductor/shows', exist_ok=True)
open(f'team/conductor/shows/{MID}.show', 'w').write(frag)
print(f'{len(S)} slides -> team/conductor/shows/{MID}.show ({len(frag)} bytes)')
