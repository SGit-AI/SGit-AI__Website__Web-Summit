# A mock of Silvio's command centre, redesigned (design@web-summit.silvio, 7 November 2026, at Silvio's word:
# "use your dashboard designer skills"; mocks only: the real command centre, people/silvio/app/ and assets/cc/,
# is not touched). Reads snapshot.json (a trimmed copy of the live people/silvio/app/data.json, v0.2.939,
# built 2026-11-07 04:21 UTC) and writes mock.htm beside it, as at that moment.
# Run: python3 -I people/silvio/lab/cc/make.py            Refresh the snapshot: python3 -I make.py --snapshot data.json
import json, os, sys, html
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, 'snapshot.json')
if len(sys.argv) > 2 and sys.argv[1] == '--snapshot':
    d = json.load(open(sys.argv[2], encoding='utf-8'))
    keep = {k: d[k] for k in ['built_at', 'version', 'person', 'summit', 'standups', 'workstreams', 'decisions', 'agents']}
    keep['issues'] = [{k: i[k] for k in ['id', 'title', 'area', 'due', 'due_at', 'recurring', 'status', 'picked_by', 'stream', 'named', 'file']} for i in d['issues'] if i.get('named')]
    keep['activity'] = [a for a in d['activity'] if a.get('mine')][:12]
    json.dump(keep, open(SNAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
D = json.load(open(SNAP, encoding='utf-8'))
esc = lambda s: html.escape(str(s or ''), quote=True)
def cut(s, n):
    s = str(s or '')
    return s if len(s) <= n else s[:n].rsplit(' ', 1)[0].rstrip(',;:') + '…'
NOW = datetime.fromisoformat(D['built_at'].replace('Z', '+00:00'))
iso = lambda s: datetime.fromisoformat(s.replace('Z', '+00:00'))
REPO = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/'
SITE = 'https://web-summit.sgit.ai/'

def urgency(i):
    if i['status'] == 'done': return 'done'
    if i.get('recurring'): return 'daily'
    if not i.get('due_at'): return 'none'
    h = (iso(i['due_at']) - NOW).total_seconds() / 3600
    return 'overdue' if h < 0 else 'today' if h <= 24 else 'soon' if h <= 72 else 'later'
def late(i):
    h = (NOW - iso(i['due_at'])).total_seconds() / 3600
    return f'{int(h // 24)} d late' if h >= 24 else f'{max(1, int(h))} h late'
def first_name(s): return s.split('@')[0] if '@' in s else s

named = D['issues']; opn = [i for i in named if i['status'] != 'done']
for i in opn: i['u'] = urgency(i)
opn.sort(key=lambda i: (['overdue', 'today', 'soon', 'daily', 'later', 'none'].index(i['u']), i.get('due_at') or '9'))
C = dict(open=len(opn), overdue=sum(i['u'] == 'overdue' for i in opn), today=sum(i['u'] in ('today', 'soon') for i in opn),
         done=sum(i['status'] == 'done' for i in named), total=len(named),
         picked=sum(i['status'] in ('picked', 'in progress') for i in opn), nobody=sum(i['status'] == 'open' and not i['picked_by'] for i in opn),
         decisions=len(D['decisions']))
C['openrest'] = C['open'] - C['picked']
oldest = max((NOW - iso(i['due_at'])).days for i in opn if i['u'] == 'overdue') if C['overdue'] else 0

# identity colours (the dataviz reference palette, slots 1 to 4, validated: names always printed beside them)
SC = {'outreach': ('#2a78d6', 'Outreach'), 'video': ('#eb6834', 'Video'), 'local': ('#1baf7a', 'Local and procurement'), 'pm': ('#eda100', 'Agentic PM')}
def stream(i):
    c, n = SC.get(i.get('stream') or '', ('#9b9a94', 'Team'))
    return f'<span class="st"><i style="background:{c}"></i>{esc(n)}</span>'

def task(i):
    who = i['picked_by']
    owner = f'<span class="own">{esc(first_name(who.split(",")[0]))}</span>' if who else '<span class="own none">Nobody yet</span>'
    act = '' if who else '<span class="acts"><button>Give to an agent</button><button class="ghost">I take it</button></span>'
    tag = {'overdue': f'<span class="late">{late(i)}</span>', 'today': '<span class="tdy">today 23:59</span>'}.get(i['u'], f'<span class="lat">{esc(i["due"])}</span>')
    return f'<li><a class="id" href="{REPO}{esc(i["file"])}">{esc(i["id"])}</a><div class="tt"><a href="{REPO}{esc(i["file"])}">{esc(i["title"])}</a><div class="meta">{stream(i)}{owner}</div></div><div class="rt">{tag}{act}</div></li>'

groups = [('Overdue', [i for i in opn if i['u'] == 'overdue'], 'g-late'), ('Due today', [i for i in opn if i['u'] in ('today', 'soon')], 'g-today'), ('Later', [i for i in opn if i['u'] not in ('overdue', 'today', 'soon')], '')]
tasks_html = ''.join(f'<h3 class="{cls}">{t} <span>{len(l)}</span></h3><ul class="tasks">{"".join(task(i) for i in l)}</ul>' for t, l, cls in groups if l)

def since(s): return f'{(NOW - iso(s)).days} d'
dec_html = ''.join(f'''<li><div class="dq">{esc(x["what"])}</div>{(chr(60) + "div class=rec" + chr(62) + "<b>Recommended:</b> " + esc(cut(x["recommend"], 170)) + "</div>") if x.get("recommend") else ""}
<div class="dm"><a href="{REPO}board/">{esc(x["issue"])}</a> · waiting {since(x["since"])}<span class="acts"><button>Agree</button><button class="ghost">Discuss at stand-up</button></span></div></li>''' for x in D['decisions'])

def ws_row(w):
    iss = [i for i in named if i['id'] in w['issues']]; done = sum(i['status'] == 'done' for i in iss); tot = len(w['issues'])
    lt = sum(1 for i in iss if i['status'] != 'done' and urgency(i) == 'overdue')
    nxt = next((i for i in sorted(iss, key=lambda i: i.get('due_at') or '9') if i['status'] != 'done'), None)
    c, n = SC.get(w['id'], ('#9b9a94', w['name']))
    pct = round(100 * done / tot) if tot else 0
    return f'<tr><td><span class="st"><i style="background:{c}"></i><b>{esc(w["name"])}</b></span><small>{esc(w["agent"])}</small></td><td class="bar"><span class="track"><span style="width:{max(pct, 2)}%;background:{c}"></span></span><small>{done} of {tot} done</small></td><td>{f"<span class=late>{lt} late</span>" if lt else "<span class=ok>on time</span>"}</td><td>{("<b>" + esc(nxt["id"]) + "</b> " + esc(cut(nxt["title"], 40))) if nxt else "nothing open"}</td></tr>'
ws_html = ''.join(ws_row(w) for w in D['workstreams'])

ag = sorted(D['agents'], key=lambda a: -a.get('commits_24h', 0)); mx = max([a.get('commits_7d', 0) for a in ag] + [1])
ag_html = ''.join(f'<tr><td><b>{esc(a["short"])}</b></td><td class="bar"><span class="track"><span style="width:{max(2, round(100 * a.get("commits_7d", 0) / mx))}%;background:#2a78d6"></span></span></td><td class="n">{a.get("commits_24h", 0)}</td><td class="n">{a.get("commits_7d", 0)}</td></tr>' for a in ag)

def hm(s): return iso(s).strftime('%H:%M')
act_html = ''.join(f'<li><time>{hm(a["at"])}</time><span><b>{esc(a["agent"].split("@")[0])}</b> {esc(a["subject"].split(": ", 1)[-1][:110])}</span></li>' for a in D['activity'][:6])
today_items = [('13:00', 'Team stand-up', 'Bring your decisions'), ('18:00', 'Team stand-up', 'Bring your decisions')] + [('23:59', f'{i["id"]} due', i['title'][:60]) for i in opn if i['u'] in ('today',)]
agenda_html = ''.join(f'<li><time>{t}</time><span><b>{esc(a)}</b><small>{esc(b)}</small></span></li>' for t, a, b in sorted(today_items))
_t = (iso(D['summit']['opening']) - NOW).total_seconds(); days_to = f'{int(_t // 86400)} d {int(_t % 86400 // 3600)} h'
seg = [(C['done'], 'Done', '#0ca30c'), (C['picked'], 'With an agent', '#2a78d6'), (C['openrest'], 'Not started', '#c9c7bf')]
seg_html = ''.join(f'<span class="seg" style="flex:{n};background:{c}" title="{l}: {n}"><b>{n}</b></span>' for n, l, c in seg if n)
seg_leg = ''.join(f'<span><i style="background:{c}"></i>{l} {n}</span>' for n, l, c in seg if n)

PAGE = f'''<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<!-- LAB MOCK, not the command centre: a redesign of Silvio's command centre by design@web-summit.silvio from the real data of {esc(D["version"])} ({esc(D["built_at"])}). people/silvio/lab/cc/make.py -->
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Command centre, redesigned · lab mock</title>
<link rel="stylesheet" href="https://promptugal.news/assets/fonts.css">
<style>
:root{{--bg:#f5f5f2;--card:#fcfcfb;--ink:#0b0b0b;--ink2:#52514e;--muted:#7a7972;--rule:#e6e4dd;--blue:#2a78d6;--crit:#d03b3b;--warn:#fab219;--warnink:#8a5a00;--good:#0ca30c;--sans:'IBM Plex Sans',system-ui,sans-serif;--mono:'IBM Plex Mono',ui-monospace,monospace;--serif:Newsreader,Georgia,serif}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 var(--sans)}}a{{color:inherit;text-decoration:none}}a:hover{{text-decoration:underline}}
button{{font:600 12px var(--sans);border:1px solid var(--ink);background:var(--ink);color:#fff;border-radius:7px;padding:5px 9px;cursor:pointer}}button.ghost{{background:transparent;color:var(--ink);border-color:var(--rule)}}
.lab{{font:500 12px var(--mono);background:#fff;border-bottom:1px solid var(--rule);color:var(--ink2);padding:7px 16px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}}.lab a{{text-decoration:underline}}
.app{{display:grid;grid-template-columns:208px 1fr;min-height:100vh}}
.side{{border-right:1px solid var(--rule);background:#fff;padding:16px 12px;position:sticky;top:0;height:100vh;overflow:auto}}
.me{{display:flex;gap:10px;align-items:center;padding:6px 6px 14px;border-bottom:1px solid var(--rule);margin-bottom:10px}}.me img{{width:38px;height:38px;border-radius:50%;object-fit:cover}}.me b{{display:block}}.me small{{color:var(--muted);font-size:12px}}
.side nav a{{display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-radius:8px;color:var(--ink2);font-weight:500}}.side nav a.on{{background:var(--bg);color:var(--ink);font-weight:600}}
.side nav small{{font:600 10px var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--muted);display:block;margin:14px 10px 4px}}
.pill{{font:700 11px var(--sans);border-radius:999px;padding:1px 7px}}.pill.r{{background:#fbe5e5;color:var(--crit)}}.pill.a{{background:#fff1cc;color:var(--warnink)}}
main{{padding:18px 24px 40px;max-width:1360px}}
.top{{display:flex;align-items:center;gap:16px;flex-wrap:wrap}}.top h1{{font:600 24px var(--sans);margin:0;letter-spacing:-.01em}}.top .sub{{color:var(--ink2)}}.sp{{flex:1}}
.ask{{display:flex;align-items:center;gap:8px;border:1px solid var(--rule);background:#fff;border-radius:10px;padding:6px 6px 6px 12px;min-width:min(440px,100%)}}.ask input{{flex:1;border:0;font:14px var(--sans);outline:0;background:transparent}}.ask span{{font:600 13px var(--mono);color:var(--blue)}}
.cd{{font:12px var(--mono);color:var(--ink2);border:1px solid var(--rule);border-radius:999px;padding:4px 10px;background:#fff}}.cd b{{color:var(--ink)}}
.act{{display:grid;grid-template-columns:1.3fr 1fr 1fr 1.6fr;gap:12px;margin:16px 0}}
.tile{{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:14px 16px}}
.tile .l{{font:600 12px var(--sans);color:var(--ink2);display:flex;align-items:center;gap:6px}}.tile .v{{font:600 34px/1.1 var(--sans);letter-spacing:-.02em;margin-top:4px}}.tile .s{{color:var(--muted);font-size:12px}}
.tile.hero{{border-color:#f1c4c4;background:#fff7f7}}.tile.hero .v{{font-size:52px;color:var(--crit)}}
.tile.wait .v{{color:var(--warnink)}}
.ic{{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:5px;font-size:11px;font-weight:700;color:#fff}}.ic.r{{background:var(--crit)}}.ic.a{{background:var(--warn);color:#3b2a00}}.ic.b{{background:var(--blue)}}
.segbar{{display:flex;gap:2px;height:28px;margin:10px 0 8px}}.seg{{border-radius:4px;display:flex;align-items:center;padding-left:8px;min-width:24px}}.seg b{{font:600 12px var(--sans);color:#fff}}.seg[style*="#c9c7bf"] b{{color:var(--ink)}}
.leg{{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--ink2)}}.leg i{{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px}}
.cols{{display:grid;grid-template-columns:1.25fr 1fr;gap:16px}}
.card{{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:14px 16px;margin-bottom:16px}}
.card>header{{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}}.card h2{{font:600 15px var(--sans);margin:0}}.card header a{{font-size:12px;color:var(--blue);font-weight:600}}
.card h3{{font:600 11px var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--ink2);margin:12px 0 2px;display:flex;gap:6px}}.card h3 span{{color:var(--muted)}}.card h3.g-late{{color:var(--crit)}}
.tasks{{list-style:none;margin:0;padding:0}}.tasks li{{display:grid;grid-template-columns:62px 1fr auto;gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--rule)}}
.g-late+.tasks li{{border-left:3px solid var(--crit);padding-left:8px}}
.id{{font:500 12px var(--mono);color:var(--muted)}}.tt a{{font-weight:600}}.meta{{display:flex;gap:12px;font-size:12px;color:var(--ink2);margin-top:2px;flex-wrap:wrap}}
.st{{display:inline-flex;align-items:center;gap:6px}}.st i{{width:8px;height:8px;border-radius:50%;display:inline-block}}
.own{{color:var(--ink2)}}.own:before{{content:"→ "}}.own.none{{color:var(--crit);font-weight:600}}
.rt{{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:5px}}.acts{{display:flex;gap:5px}}
.late{{font:600 12px var(--sans);color:var(--crit)}}.late:before{{content:"● "}}.tdy{{font:600 12px var(--sans);color:var(--warnink)}}.lat{{font-size:12px;color:var(--muted)}}.ok{{font-size:12px;color:var(--good);font-weight:600}}
.dec{{list-style:none;margin:0;padding:0}}.dec li{{padding:10px 0;border-top:1px solid var(--rule)}}.dq{{font-weight:600}}.rec{{font-size:13px;color:var(--ink2);margin:3px 0 6px}}.dm{{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;color:var(--muted);flex-wrap:wrap}}
.card.decide{{border-color:#f3dc9c;background:#fffcf2}}
.tl{{list-style:none;margin:0;padding:0}}.tl li{{display:grid;grid-template-columns:52px 1fr;gap:8px;padding:7px 0;border-top:1px solid var(--rule)}}.tl time{{font:600 12px var(--mono);color:var(--blue)}}.tl small{{display:block;color:var(--muted)}}
table{{width:100%;border-collapse:collapse;font-size:13px}}td{{padding:8px 6px;border-top:1px solid var(--rule);vertical-align:middle}}td small{{display:block;color:var(--muted);font-size:11px}}
th{{text-align:left;font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:4px 6px}}
.bar{{min-width:140px}}.track{{display:block;height:8px;border-radius:4px;background:#ecebe5;overflow:hidden}}.track span{{display:block;height:8px;border-radius:4px}}td.n{{text-align:right;font-variant-numeric:tabular-nums}}
.feed{{list-style:none;margin:0;padding:0}}.feed li{{display:grid;grid-template-columns:46px 1fr;gap:8px;padding:6px 0;border-top:1px solid var(--rule);font-size:13px}}.feed time{{font:12px var(--mono);color:var(--muted)}}
.three{{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:16px}}
.note{{font-size:12px;color:var(--muted);margin-top:8px}}
@media (max-width:1100px){{.act{{grid-template-columns:1fr 1fr}}.cols,.three{{grid-template-columns:1fr}}}}
main{{min-width:0}}.cols>*,.three>*{{min-width:0}}
@media (max-width:760px){{.app{{grid-template-columns:minmax(0,1fr)}}.ask{{min-width:0;width:100%}}.top .sp{{display:none}}.side{{position:static;height:auto;display:none}}main{{padding:14px}}.tasks li{{grid-template-columns:1fr auto}}.tasks .id{{display:none}}.act{{grid-template-columns:1fr 1fr}}.tile.hero .v{{font-size:42px}}}}
</style></head><body>
<div class="lab"><span>LAB MOCK · Silvio's command centre, redesigned · not the real one (it is unchanged)</span><span>Data: {esc(D["version"])}, {NOW.strftime("%d %b %H:%M")} UTC · <a href="{SITE}people/silvio/app/index.html">The real command centre</a> · <a href="{SITE}people/silvio/lab/index.html">The lab</a></span></div>
<div class="app"><aside class="side"><div class="me"><img src="{SITE}people/silvio/photo.jpg" alt=""><span><b>Silvio Switha</b><small>{esc(D["person"]["role"])}</small></span></div>
<nav><a class="on" href="#">Today</a><a href="#">My tasks <span class="pill r">{C["overdue"]} late</span></a><a href="#">Decisions <span class="pill a">{C["decisions"]}</span></a><small>Work</small><a href="#">Workstreams</a><a href="#">Team board</a><a href="#">My agents</a><small>Connect</small><a href="#">Inbox and email</a><a href="#">Calendar</a><small>More</small><a href="#">Reports</a><a href="#">Settings</a></nav></aside>
<main>
<div class="top"><div><h1>Up early, Silvio.</h1><div class="sub">Saturday 7 November · {C["overdue"]} late, {C["decisions"]} decisions only you can make, {C["today"]} due today.</div></div><span class="sp"></span>
<span class="cd">Opening Night in <b>{days_to}</b></span><label class="ask"><span>&gt;_</span><input placeholder="Ask Claude: brief me for today"><button>Ask</button></label></div>

<section class="act" aria-label="Act now">
<div class="tile hero"><div class="l"><span class="ic r">!</span>Overdue</div><div class="v">{C["overdue"]}</div><div class="s">of your {C["open"]} open tasks · the oldest {oldest} days late · {C["nobody"]} with nobody on them</div></div>
<div class="tile wait"><div class="l"><span class="ic a">?</span>Decisions on you</div><div class="v">{C["decisions"]}</div><div class="s">only you can answer</div></div>
<div class="tile"><div class="l"><span class="ic b">◷</span>Due today</div><div class="v">{C["today"]}</div><div class="s">by 23:59 UTC</div></div>
<div class="tile"><div class="l">Your {C["total"]} tasks</div><div class="segbar" role="img" aria-label="{C['done']} done, {C['picked']} with an agent, {C['openrest']} not started">{seg_html}</div><div class="leg">{seg_leg}</div></div>
</section>

<div class="cols"><section class="card"><header><h2>Your tasks, by urgency</h2><a href="#">All {C["open"]} open →</a></header>{tasks_html}</section>
<div><section class="card decide"><header><h2>Decisions only you can make</h2><a href="#">All {C["decisions"]} →</a></header><ul class="dec">{dec_html}</ul></section>
<section class="card"><header><h2>Today</h2><a href="#">Calendar →</a></header><ul class="tl">{agenda_html}</ul></section></div></div>

<div class="three"><section class="card"><header><h2>Workstreams</h2><a href="#">Open →</a></header><table><tr><th>Stream</th><th>Progress</th><th>Late</th><th>Next</th></tr>{ws_html}</table></section>
<section class="card"><header><h2>Your agents</h2><a href="#">All {len(ag)} →</a></header><table><tr><th>Agent</th><th>Last 7 days</th><th class="n">24 h</th><th class="n">7 d</th></tr>{ag_html}</table><p class="note">Commits per agent, from git.</p></section>
<section class="card"><header><h2>What your agents did</h2><a href="#">All →</a></header><ul class="feed">{act_html}</ul><p class="note">Only your agents' commits; the team's are one click away.</p></section></div>
</main></div>
<link rel="stylesheet" href="{SITE}people/silvio/lab/design.css">
</body></html>'''
open(os.path.join(HERE, 'mock.htm'), 'w', encoding='utf-8').write(PAGE)
print(json.dumps(C), 'oldest', oldest)
