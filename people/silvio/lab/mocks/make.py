# The PrompTugal.news front-page mock options (design@web-summit.silvio, 6 November 2026, at Silvio's word).
# Reads the lab copy (../front.htm) for the real stories, agenda and counts, and writes a.htm to d.htm here.
# Each mock is an original design; the lessons it takes from other news sites are in ../README.md.
# Run: python3 -I people/silvio/lab/mocks/make.py
import re, html, os, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = open(os.path.join(HERE, '..', 'front.htm'), encoding='utf-8').read()
txt = lambda h: html.unescape(re.sub(r'<[^>]+>', '', h)).strip()
esc = lambda s: html.escape(str(s), quote=True)
def cut(s, n):
    s = str(s).rstrip('.… ')
    if len(s) <= n: return s
    return s[:n].rsplit(' ', 1)[0].rstrip(',;:') + '…'

# --- the real content, from the snapshot ---------------------------------------------------------------
arts = []
for m in re.finditer(r'<li><a href="(articles/[^"]+)"><picture>.*?<img src="([^"]+)" alt="([^"]*)".*?</picture></a>\s*<strong><a[^>]*>(.*?)</a></strong>\s*<em>(.*?)</em>\s*<code>(.*?)</code>', SRC, re.S):
    href, img, alt, title, summ, meta = m.groups()
    kicker, _, date = txt(meta).partition(' · ')
    arts.append(dict(href=href, img=img, card=img.replace('--thumb', '--card'), alt=txt(alt), title=txt(title), summary=txt(summ), kicker=kicker, date=date))
hero_m = re.search(r'href="(articles/web-summit-ten-lisbon-years\.html)".*?<img src="([^"]+)" alt="([^"]*)"', SRC, re.S)
hero = dict(href=hero_m.group(1), img=hero_m.group(2), card=hero_m.group(2), alt=txt(hero_m.group(3)), title="Web Summit's ten Lisbon years: 2.5 billion euros, says EY",
            summary="A report by EY, released at Web Summit's press conference on 5 November, puts the event's impact on Portugal's economy at almost 2.5 billion euros over ten editions. The figures, what they count, and what an earlier government study found.",
            kicker='Portugal, Web Summit, Economy, Startups', date='Friday 6 November', byline='journalist@PrompTugal.dinis · 4 min read · signed')
arts = [a for a in arts if a['href'] != hero['href']]

days = []
for m in re.finditer(r'<h3 id="[^"]+">(.*?)</h3>\s*<ul class="agenda">(.*?)</ul>', SRC, re.S):
    items = []
    for li in re.findall(r'<li>(.*?)</li>', m.group(2), re.S):
        when = txt(re.search(r'<strong>(.*?)</strong>', li).group(1))
        a = re.search(r'<a href="([^"]+)">(.*?)</a>', li)
        em = txt(re.search(r'<em>(.*?)</em>', li).group(1)) if '<em>' in li else ''
        items.append(dict(when=when, href=a.group(1), title=txt(a.group(2)), where=em))
    days.append(dict(day=txt(m.group(1)), items=items))

def short_day(items):
    # registration desks repeat; fold them into one line
    reg = [i for i in items if i['title'].startswith('Registration')]
    rest = [i for i in items if not i['title'].startswith('Registration')]
    if reg:
        rest.append(dict(when=reg[0]['when'], href=reg[0]['href'], title=f'Registration open: collect your lanyard ({len(reg)} desks)', where='Airport T1, Pavilhão de Portugal and more'))
    return sorted(rest, key=lambda i: (i['when'] != 'All day', i['when']))

fields = [(txt(a), int(b)) for a, b in re.findall(r'<a href="companies/[^"]*">([^<]+)</a>\s*<(?:span|code|b|em)[^>]*>(\d+)<', SRC)][:8] or \
    [('Security', 30), ('AI agents', 22), ('Other', 19), ('Developer tools', 18), ('Governance, risk and compliance', 15), ('Platforms', 8), ('Portuguese startups', 5), ('Investors', 3)]
PAL = {
 # name: (paper, ink, accent2 (--red), accent (--green), rule, muted, card, solid, on-solid) light / dark
 'atlantico': (('#f7f9fb', '#1e2a38', '#d0704f', '#2f6f9f', '#e3e8ee', '#5f6b7a', '#ffffff', '#2f6f9f', '#ffffff'),
               ('#11161c', '#e8edf2', '#e8977b', '#7fb3dc', '#26303b', '#9aa7b5', '#171e26', '#7fb3dc', '#0e141a')),
 'salvia':    (('#f8f8f4', '#23302a', '#c0704f', '#4f7d63', '#e3e6dc', '#66706a', '#ffffff', '#4f7d63', '#ffffff'),
               ('#121512', '#e9ece6', '#e09a7c', '#8fbf9f', '#2a302b', '#a2aca5', '#181d19', '#8fbf9f', '#101511')),
 'azulejo':   (('#fbfaf7', '#1c2440', '#c98a2b', '#3557a8', '#e7e4dc', '#626a80', '#ffffff', '#3557a8', '#ffffff'),
               ('#10131c', '#e9ebf3', '#e6b45e', '#8aa6e8', '#262b3a', '#a0a7bb', '#161a26', '#8aa6e8', '#0f1320')),
 'classic':   (('#f6f3ec', '#121317', '#c52830', '#006600', '#d8d4cb', '#666860', '#fffdf8', '#121317', '#f6f3ec'),
               ('#121317', '#f6f3ec', '#f07278', '#6dbb7e', '#44453f', '#b4b6ad', '#1b1c21', '#f6f3ec', '#121317')),
}
_v = lambda t: ';'.join(f'--{k}:{c}' for k, c in zip(['paper', 'ink', 'red', 'green', 'rule', 'muted', 'card', 'solid', 'on'], t))
PALETTES = '\n'.join(f'[data-pal={k}]{{{_v(l)}}}' for k, (l, d) in PAL.items()) + '\n' + ''.join(f'[data-mode=dark][data-pal={k}]{{{_v(d)}}}' for k, (l, d) in PAL.items())
PAL_JS = '''<script>(function(){var h=document.documentElement,k='pt-lab-palette';function set(p){h.dataset.pal=p;document.querySelectorAll('.pals [data-p]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.p===p)});try{localStorage.setItem(k,p)}catch(e){}}var s=null;try{s=localStorage.getItem(k)}catch(e){}set(s||'atlantico');var mk='pt-lab-mode';function sm(m){h.dataset.mode=m;document.querySelectorAll('.pals [data-m]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.m===m)});try{localStorage.setItem(mk,m)}catch(e){}}var m=null;try{m=localStorage.getItem(mk)}catch(e){}sm(m==='dark'?'dark':'light');document.querySelectorAll('.pals [data-m]').forEach(function(b){b.onclick=function(){sm(b.dataset.m)}});document.querySelectorAll('.pals [data-p]').forEach(function(b){b.onclick=function(){set(b.dataset.p)}})})();</script>'''

N = dict(companies=120, articles=22, events=218, days_to_go=3, agents=30)

# --- the AI parts, shared: the prompt bar, the radar, the provenance badge, the live countdown ---------------
PROMPTS = ['Which AI agent companies are at Web Summit?', 'What is on Tuesday for security?', 'Who is in Pavilion 4?', 'Portuguese startups raising money']
def prompt_bar(big=False):
    chips = ''.join(f'<a class="pc" href="search/index.html">{esc(q)}</a>' for q in PROMPTS)
    return f'''<form class="pb{' big' if big else ''}" action="search/index.html"><span class="pr">&gt;_</span><input name="q" placeholder="Ask PrompTugal anything" aria-label="Ask PrompTugal"><button>Ask ✦</button></form><div class="pcs">{chips}</div>'''
def radar(n=6):
    rows = [(k, v) for k, v in fields[:n + 1] if k != 'Other'][:n]
    mx = max(v for _, v in rows)
    return '<div class="radar"><div class="rh"><b>✦ AI radar</b><span>companies we follow, by field</span></div>' + ''.join(
        f'<a class="rr" href="companies/index.html"><span>{esc(k)}</span><i><u style="width:{round(100*v/mx)}%"></u></i><code>{v}</code></a>' for k, v in rows) + '</div>'
BADGE = '<span class="badge" title="Written by an AI agent, fact-checked, signed, with every source linked">✦ agent-written · checked · signed</span>'
COUNTDOWN_JS = '''<script>(function(){var t=Date.UTC(2026,10,9,20,0,0);function f(){var d=Math.max(0,t-Date.now()),D=Math.floor(d/864e5),H=Math.floor(d/36e5)%24,M=Math.floor(d/6e4)%60,S=Math.floor(d/1e3)%60;document.querySelectorAll('[data-cd]').forEach(function(e){e.innerHTML='<b>'+D+'</b>d <b>'+H+'</b>h <b>'+String(M).padStart(2,'0')+'</b>m <b>'+String(S).padStart(2,'0')+'</b>s'})}f();setInterval(f,1000)})();</script>'''
AI_CSS = '''
.pb{display:flex;align-items:center;border:1px solid var(--rule);border-radius:14px;background:var(--card);overflow:hidden;box-shadow:var(--shadow)}
.pb .pr{font:600 15px var(--mono);color:var(--green);padding:0 4px 0 14px}
.pb input{flex:1;min-width:0;border:0;padding:13px 10px;font:16px var(--sans);background:transparent;color:var(--ink);outline:0}
.pb input::placeholder{color:var(--muted)}
.pb button{border:0;background:var(--solid);color:var(--on);border-radius:10px;margin:5px;font:600 15px var(--sans);padding:0 20px;align-self:stretch;cursor:pointer}
.pb.big input{font-size:18px;padding:17px 10px}
.pcs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 0}.pc{font:13px var(--sans);border:1px solid var(--rule);background:var(--card);border-radius:999px;padding:4px 12px;color:var(--muted)}.pc:before{content:"↳ "}
@media (max-width:640px){.pcs{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;justify-content:flex-start!important}.pc{flex:0 0 auto}.pb input{font-size:15px}}
.radar{border:1px solid var(--rule);border-radius:12px;background:var(--card);padding:12px 14px}
.radar .rh{display:flex;justify-content:space-between;gap:8px;align-items:baseline;margin-bottom:6px;font:12px var(--sans);color:var(--muted)}.radar .rh b{font:700 12px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--green);white-space:nowrap}
.rr{display:grid;grid-template-columns:minmax(0,1.3fr) 1fr 26px;gap:8px;align-items:center;font:13px var(--sans);padding:4px 0}.rr span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr i{display:block;height:8px;border-radius:4px;background:var(--rule)}.rr u{display:block;height:8px;border-radius:4px;background:var(--green);opacity:.85}.rr code{font:12px var(--mono);text-align:right}
.badge{display:inline-block;font:500 11px var(--mono);color:var(--green);border:1px solid currentColor;border-radius:999px;padding:1px 8px;margin-top:6px;white-space:nowrap}
[data-cd] b{font-family:var(--sans);font-size:1.15em}
@keyframes blink{50%{opacity:0}}.cur{display:inline-block;width:.45em;height:.9em;background:var(--green);vertical-align:-2px;animation:blink 1s steps(1) infinite;margin-left:6px}
@media (prefers-reduced-motion:reduce){.cur,.dot{animation:none}}
'''

# --- shared head and lab banner ---------------------------------------------------------------------------
def page(key, name, css, body, title):
    return f'''<!doctype html>
<html lang="en-GB" data-pal="atlantico" data-mode="light">
<head>
<meta charset="utf-8">
<!-- LAB MOCK {key.upper()}, not the original: {name}. Made by design@web-summit.silvio on 6 November 2026 from the lab copy's real content (people/silvio/lab/mocks/make.py). Links go to the live site. -->
<base href="https://promptugal.news/">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Mock {key.upper()}: {esc(name)} · PrompTugal.news lab</title>
<link rel="stylesheet" href="assets/fonts.css">
<style>
:root{{--serif:Newsreader,Georgia,serif;--sans:'IBM Plex Sans',Arial,sans-serif;--mono:'IBM Plex Mono',ui-monospace,monospace;--shadow:0 1px 2px rgba(20,30,50,.05),0 6px 20px rgba(20,30,50,.06)}}
{PALETTES}
*{{box-sizing:border-box}}html{{-webkit-text-size-adjust:100%}}
body{{margin:0;background:var(--paper);color:var(--ink);font-family:var(--serif);line-height:1.45}}
a{{color:inherit;text-decoration:none}}a:hover{{text-decoration:underline;text-underline-offset:3px}}
img{{max-width:100%;height:auto;display:block}}
.lab{{font:500 12px/1.4 var(--mono);background:var(--card);color:var(--muted);border-bottom:1px solid var(--rule);padding:8px 16px;display:flex;gap:8px 14px;flex-wrap:wrap;justify-content:space-between;align-items:center}}
.pals button{{font:500 12px var(--sans);border:1px solid var(--rule);background:var(--paper);color:var(--ink);border-radius:999px;padding:3px 10px;margin-left:4px;cursor:pointer}}.pals button[aria-pressed=true]{{background:var(--solid);color:var(--on);border-color:var(--solid)}}
.lab a{{text-decoration:underline}}
.wm{{height:28px;width:auto}}.wm.dk{{display:none}}
[data-mode=dark] .wm.lt{{display:none}}[data-mode=dark] .wm.dk{{display:inline}}
.mono{{font-family:var(--mono)}}.sans{{font-family:var(--sans)}}
{AI_CSS}
{css}
</style>
</head>
<body>
<div class="lab"><span>LAB MOCK {key.upper()} · {esc(name)} · not the live site</span><span class="pals">Colours: <button data-p="atlantico">Atlântico</button><button data-p="salvia">Sálvia</button><button data-p="azulejo">Azulejo</button><button data-p="classic">Classic</button> · <button data-m="light">Light</button><button data-m="dark">Dark</button></span><span><a href="https://web-summit.sgit.ai/people/silvio/lab/index.html">All options</a> · <a href="https://promptugal.news/">The original</a></span></div>
{body}
{COUNTDOWN_JS}
{PAL_JS}
<link rel="stylesheet" href="https://web-summit.sgit.ai/people/silvio/lab/design.css">
<script src="https://web-summit.sgit.ai/people/silvio/lab/design.js" data-design="{key}"></script>
</body>
</html>
'''

WM = '<img class="wm lt" src="assets/brand/promptugal-wordmark-light.svg" alt="PrompTugal.news"><img class="wm dk" src="assets/brand/promptugal-wordmark-dark.svg" alt="PrompTugal.news">'
NAV = ['Now', 'Agenda', 'News', 'Companies', 'People', 'Portugal', 'The graph', 'About']
NAVH = ['index.html', 'summit/index.html', 'articles/index.html', 'companies/index.html', 'people/index.html', 'portugal/index.html', 'graph/index.html', 'about/index.html']
nav = lambda cls='': ''.join(f'<a class="{cls}" href="{h}">{t}</a>' for t, h in zip(NAV, NAVH))
today = short_day(days[0]['items']) if days else []

# --- A: The Edition (a broadsheet front page, strict hierarchy) -------------------------------------------
def mock_a():
    lead2, rest = arts[:2], arts[2:]
    briefing = arts[2:8]
    grid = arts[8:14]
    css = '''
.wrap{max-width:1240px;margin:0 auto;padding:0 16px}
.top{display:flex;justify-content:space-between;align-items:center;font:12px var(--mono);color:var(--muted);padding:10px 0;border-bottom:1px solid var(--rule)}
.top .cd{color:var(--green);font-weight:600}
.plate{text-align:center;padding:22px 0 10px}.plate .wm{height:58px;margin:0 auto}
.motto{font:italic 17px var(--serif);color:var(--muted);margin:6px 0 0}
.nav{display:flex;justify-content:center;gap:22px;flex-wrap:wrap;font:600 12px var(--sans);letter-spacing:.08em;text-transform:uppercase;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:12px 0;margin-top:14px}
.ask{max-width:760px;margin:22px auto 4px}.ask .pcs{justify-content:center}
.page{display:grid;grid-template-columns:270px 1fr 300px;gap:28px;padding:24px 0}
.page>section+section{border-left:1px solid var(--rule);padding-left:28px}
.h{font:600 11px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--green);border-top:1px solid var(--rule);padding-top:8px;margin:0 0 12px}
.brief ol{margin:0;padding:0;list-style:none;counter-reset:b}
.brief li{counter-increment:b;display:grid;grid-template-columns:22px 1fr;gap:6px;padding:10px 0;border-bottom:1px solid var(--rule);font-size:15px;line-height:1.35}
.brief li:before{content:counter(b);font:600 13px var(--mono);color:var(--red)}
.brief li b{display:block;font-weight:600}
.k{font:600 11px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--green)}
.lead h1{font-size:42px;line-height:1.08;margin:8px 0 10px;letter-spacing:-.01em;font-weight:500}
.lead p.dek{font-size:19px;color:var(--muted);margin:0 0 8px}
.by{font:12px var(--mono);color:var(--muted)}
.lead figure{margin:0 0 14px;border-radius:12px;overflow:hidden;background:var(--card);box-shadow:var(--shadow)}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:22px;border-top:1px solid var(--rule);padding-top:18px}
.duo h2{font-size:23px;line-height:1.15;margin:6px 0}.duo p{font-size:15px;color:var(--muted);margin:0}
.now .day{font:600 13px var(--sans);margin:14px 0 4px}
.now li{list-style:none;display:grid;grid-template-columns:62px 1fr;gap:8px;padding:8px 0;border-bottom:1px solid var(--rule);font-size:15px;line-height:1.3}
.now ul{margin:0;padding:0}.now time{font:12px var(--mono);color:var(--muted);padding-top:2px}
.now small{display:block;color:var(--muted);font:12px var(--sans);margin-top:3px}
.strip{display:flex;gap:4px;margin-bottom:10px}.strip span{flex:1;text-align:center;font:11px var(--mono);border:1px solid var(--rule);padding:5px 0}.strip .on{background:var(--solid);color:var(--on)}.strip .ws{color:var(--green);border-color:var(--green)}
.more{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;border-top:1px solid var(--rule);padding:22px 0 40px}
.more article{display:grid;grid-template-columns:92px 1fr;gap:12px}.more h3{font-size:18px;line-height:1.2;margin:4px 0}.more p{margin:0;font-size:14px;color:var(--muted)}
.more img{border:1px solid var(--rule)}
@media (max-width:1000px){.page{grid-template-columns:1fr}.page>section+section{border-left:0;padding-left:0}.brief{order:2}.more{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.lead h1{font-size:32px}.duo,.more{grid-template-columns:1fr}.plate .wm{height:40px}.nav{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap;gap:16px}.top .r{display:none}}
'''
    strip = ''.join(f'<span class="{c}">{d}</span>' for d, c in [('Fri 6', 'on'), ('Sat 7', ''), ('Sun 8', ''), ('Mon 9', ''), ('Tue 10', 'ws'), ('Wed 11', 'ws'), ('Thu 12', 'ws')])
    body = f'''<div class="wrap">
<div class="top"><span>Friday 6 November 2026 · Lisbon</span><span class="cd">Opening Night in <span data-cd>3 days</span></span><span class="r">Search · Ask · Sign in</span></div>
<header class="plate"><a href="index.html">{WM}</a><p class="motto">Mapping the universe of AI in Portugal. Every fact sourced.</p></header>
<nav class="nav">{nav()}</nav>
<div class="ask">{prompt_bar()}</div>
<main class="page">
<section class="brief"><h2 class="h">The briefing</h2><ol>{''.join(f'<li><span><b><a href="{a["href"]}">{esc(a["title"])}</a></b><span class="by">{esc(a["kicker"])}</span></span></li>' for a in briefing[:5])}</ol><div style="margin-top:18px">{radar()}</div></section>
<section class="lead"><figure><a href="{hero['href']}"><img src="{hero['img']}" alt="{esc(hero['alt'])}" fetchpriority="high"></a></figure>
<div class="k">{esc(hero['kicker'])}</div><h1><a href="{hero['href']}">{esc(hero['title'])}</a></h1><p class="dek">{esc(hero['summary'])}</p><div class="by">{esc(hero['byline'])}</div>{BADGE}
<div class="duo">{''.join(f'<article><div class="k">{esc(a["kicker"])}</div><h2><a href="{a["href"]}">{esc(a["title"])}</a></h2><p>{esc(a["summary"])}</p></article>' for a in lead2)}</div></section>
<section class="now"><h2 class="h">Now and next</h2><div class="strip">{strip}</div><div class="day">Today</div><ul>{''.join(f'<li><time>{esc(i["when"])}</time><span><a href="{i["href"]}">{esc(cut(i["title"], 90))}</a><small>{esc(i["where"])}</small></span></li>' for i in today)}</ul>
<div class="day">Saturday</div><ul>{''.join(f'<li><time>{esc(i["when"])}</time><span><a href="{i["href"]}">{esc(cut(i["title"], 90))}</a><small>{esc(i["where"])}</small></span></li>' for i in short_day(days[1]['items'])[:3])}</ul></section>
</main>
<section class="more">{''.join(f'<article><a href="{a["href"]}"><img src="{a["img"]}" alt="{esc(a["alt"])}" loading="lazy"></a><div><div class="k">{esc(a["kicker"])}</div><h3><a href="{a["href"]}">{esc(a["title"])}</a></h3><p>{esc(cut(a["summary"], 120))}</p></div></article>' for a in grid)}</section>
</div>'''
    return page('a', 'The Edition', css, body, '')

# --- B: Summit Live (mobile-first, built for the four days in Lisbon) -------------------------------------
def mock_b():
    css = '''
.bar{position:sticky;top:0;z-index:5;background:var(--paper);border-bottom:1px solid var(--rule)}
.bar .in{max-width:1180px;margin:0 auto;padding:10px 16px;display:flex;align-items:center;gap:14px}
.bar .wm{height:24px}.sp{flex:1}
.pill{font:600 12px var(--sans);border:1px solid var(--ink);border-radius:999px;padding:6px 12px}
.pill.ask{background:var(--solid);color:var(--on)}
.live{background:var(--solid);color:var(--on)}
.live .in{max-width:1180px;margin:0 auto;padding:12px 16px;display:flex;gap:18px;align-items:center;font:13px var(--mono);overflow-x:auto;white-space:nowrap}
.dot{width:9px;height:9px;border-radius:50%;background:var(--red);display:inline-block;margin-right:6px;animation:p 1.6s infinite}
@keyframes p{50%{opacity:.25}}
.cd b{font-size:22px;font-family:var(--sans);margin-right:4px}
.wrap{max-width:1180px;margin:0 auto;padding:0 16px}
.days{display:flex;gap:8px;overflow-x:auto;padding:16px 0;scrollbar-width:none}
.days a{flex:0 0 auto;min-width:86px;border:1px solid var(--rule);border-radius:12px;padding:8px 12px;font:12px var(--sans);background:var(--card)}
.days a b{display:block;font-size:15px}.days a.on{background:var(--solid);color:var(--on);border-color:var(--ink)}.days a.ws{border-color:var(--green)}.days a.ws b{color:var(--green)}.days a.on b{color:var(--paper)}
.cols{display:grid;grid-template-columns:1.1fr .9fr;gap:28px;padding-bottom:30px}
h2.s{font:700 13px var(--sans);letter-spacing:.06em;text-transform:uppercase;margin:8px 0 12px;display:flex;justify-content:space-between}
h2.s a{font-weight:500;color:var(--green);text-transform:none;letter-spacing:0}
.tl{position:relative;margin:0;padding:0 0 0 22px;list-style:none;border-left:2px solid var(--rule)}
.tl li{position:relative;padding:0 0 16px}
.tl li:before{content:"";position:absolute;left:-29px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--paper);border:2px solid var(--ink)}
.tl li.now:before{background:var(--red);border-color:var(--red)}
.tl time{font:12px var(--mono);color:var(--muted)}.tl h3{margin:2px 0;font-size:19px;line-height:1.2}.tl small{font:12px var(--sans);color:var(--muted)}
.save{font:600 12px var(--sans);border:1px solid var(--rule);border-radius:8px;padding:4px 10px;margin-top:6px;display:inline-block;background:var(--card)}
.cards{display:grid;gap:14px}
.card{display:grid;grid-template-columns:110px 1fr;gap:14px;background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:12px;box-shadow:var(--shadow)}
.card img{border-radius:8px}.card h3{font-size:18px;line-height:1.2;margin:3px 0}.card p{margin:0;font-size:14px;color:var(--muted)}
.k{font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--red)}
.lead{background:var(--card);border:1px solid var(--rule);border-radius:16px;overflow:hidden;margin-bottom:14px}
.lead .t{padding:14px 16px}.lead h1{font-size:30px;line-height:1.1;margin:6px 0}.lead p{margin:0;color:var(--muted)}
.tools{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:6px 0 18px}
.tools a{border:1px solid var(--rule);border-radius:12px;padding:12px;font:600 13px var(--sans);background:var(--card);text-align:center}
.tools a span{display:block;font-size:22px;margin-bottom:4px}
.tab{position:fixed;bottom:0;left:0;right:0;background:var(--paper);border-top:1px solid var(--rule);display:none;justify-content:space-around;padding:8px 0 calc(8px + env(safe-area-inset-bottom));font:600 11px var(--sans)}
.tab a{text-align:center}.tab span{display:block;font-size:18px}
@media (max-width:900px){.cols{grid-template-columns:1fr}.tab{display:flex}body{padding-bottom:64px}.bar .pill:not(.ask){display:none}.tools{grid-template-columns:repeat(2,1fr)}}
'''
    dlist = [('Fri 6', 'Today', 'on'), ('Sat 7', '4 items', ''), ('Sun 8', '3 items', ''), ('Mon 9', 'Opening', 'ws'), ('Tue 10', 'Day 1', 'ws'), ('Wed 11', 'Day 2', 'ws'), ('Thu 12', 'Day 3', 'ws'), ('Fri 13', 'After', '')]
    tl = today + short_day(days[1]['items'])[:2]
    body = f'''<div class="bar"><div class="in"><a href="index.html">{WM}</a><span class="sp"></span><a class="pill" href="search/index.html">Search</a><a class="pill" href="login/index.html">My day</a><a class="pill ask" href="index.html">Ask</a></div></div>
<div class="live"><div class="in"><span><span class="dot"></span>LIVE DESK</span><span>Opening Night in <span data-cd>3 days</span></span><span>✦ {N['agents']} AI agents on the desk</span><span>Registration opens Sat 09:30 · Airport T1</span><span>{N['articles']} stories · {N['events']} events · {N['companies']} companies · every fact sourced</span></div></div>
<div class="wrap">
<div style="margin-top:18px">{prompt_bar()}</div>
<nav class="days">{''.join(f'<a class="{c}" href="summit/index.html"><b>{d}</b>{s}</a>' for d, s, c in dlist)}</nav>
<div class="tools"><a href="summit/index.html"><span>🗓</span>Agenda</a><a href="articles/your-first-day-at-web-summit.html"><span>🧭</span>First day guide</a><a href="companies/index.html"><span>🏢</span>Companies</a><a href="graph/index.html"><span>🕸</span>The graph</a></div>
<div class="cols">
<section><h2 class="s">Today and next <a href="summit/index.html">Full agenda →</a></h2><ol class="tl">{''.join(f'<li class="{"now" if n == 0 else ""}"><time>{esc(i["when"])}</time><h3><a href="{i["href"]}">{esc(cut(i["title"], 100))}</a></h3><small>{esc(i["where"])}</small><br><span class="save">☆ Add to my day</span></li>' for n, i in enumerate(tl))}</ol><div style="margin-top:8px">{radar()}</div></section>
<section><h2 class="s">Latest <a href="articles/index.html">All stories →</a></h2>
<article class="lead"><a href="{hero['href']}"><img src="{hero['img']}" alt="{esc(hero['alt'])}" fetchpriority="high"></a><div class="t"><div class="k">{esc(hero['kicker'])}</div><h1><a href="{hero['href']}">{esc(hero['title'])}</a></h1><p>{esc(cut(hero['summary'], 160))}</p>{BADGE}</div></article>
<div class="cards">{''.join(f'<article class="card"><a href="{a["href"]}"><img src="{a["img"]}" alt="{esc(a["alt"])}" loading="lazy"></a><div><div class="k">{esc(a["kicker"])}</div><h3><a href="{a["href"]}">{esc(a["title"])}</a></h3><p>{esc(a["date"])}</p>{BADGE}</div></article>' for a in arts[:7])}</div></section>
</div></div>
<nav class="tab"><a href="index.html"><span>●</span>Now</a><a href="summit/index.html"><span>🗓</span>Agenda</a><a href="articles/index.html"><span>📰</span>News</a><a href="companies/index.html"><span>🏢</span>Companies</a><a href="login/index.html"><span>☆</span>My day</a></nav>'''
    return page('b', 'Summit Live', css, body, '')

# --- C: The Atlas (the mandate first: AI in Portugal as a map you can enter) ------------------------------
def mock_c():
    mx = max(v for _, v in fields)
    css = '''
.wrap{max-width:1240px;margin:0 auto;padding:0 16px}
.hd{display:flex;align-items:center;gap:20px;padding:14px 0;border-bottom:1px solid var(--rule)}
.hd nav{display:flex;gap:18px;font:500 13px var(--sans);flex-wrap:wrap}.hd .sp{flex:1}
.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:36px;padding:42px 0 30px;align-items:center}
.hero h1{font-size:56px;line-height:1.02;margin:0 0 14px;letter-spacing:-.02em;font-weight:500}.hero h1 em{color:var(--green);font-style:italic}
.hero p{font-size:19px;color:var(--muted);margin:0 0 18px;max-width:34em}
.q{display:flex;border:2px solid var(--ink);border-radius:10px;overflow:hidden;background:var(--card)}
.q input{flex:1;border:0;padding:14px;font:16px var(--sans);background:transparent;color:var(--ink)}.q button{border:0;background:var(--solid);color:var(--on);font:600 15px var(--sans);padding:0 20px}
.chips{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px}.chips a{font:13px var(--sans);border:1px solid var(--rule);border-radius:999px;padding:4px 12px}
.nums{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:14px;overflow:hidden}
.nums>div{background:var(--card);padding:18px}.nums>div>b{display:block;font:600 40px var(--sans);letter-spacing:-.02em}.nums span{font:12px var(--mono);color:var(--muted)}
.fields{grid-column:1/-1;background:var(--card);padding:16px 18px}
.f{display:grid;grid-template-columns:190px 1fr 34px;gap:10px;align-items:center;font:13px var(--sans);padding:4px 0}
.f i{display:block;height:10px;border-radius:5px;background:var(--green)}.f code{font:12px var(--mono);text-align:right}
.h{font:700 12px var(--sans);letter-spacing:.1em;text-transform:uppercase;margin:34px 0 14px;display:flex;justify-content:space-between;border-top:1px solid var(--rule);padding-top:10px}
.h a{color:var(--green);letter-spacing:0;text-transform:none;font-weight:500}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.grid article{background:var(--card);border:1px solid var(--rule);border-radius:14px;overflow:hidden;box-shadow:var(--shadow)}
.grid .t{padding:12px 14px 16px}.grid h3{font-size:18px;line-height:1.2;margin:4px 0}.grid p{font-size:14px;color:var(--muted);margin:0}
.grid article.big{grid-column:span 2}.eyebrow{font:500 12px var(--mono);color:var(--green);margin-bottom:12px}.fields .radar{border:0;padding:0;background:none}.cdl{font:13px var(--mono);margin:10px 0 0;color:var(--muted)}.grid article.big h3{font-size:28px}
.k{font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--green)}
.rmg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:10px 0 50px}
.rmg div{border:1px solid var(--rule);border-radius:12px;padding:16px;background:var(--card)}.rmg b{font:600 13px var(--mono);color:var(--red)}.rmg h4{font-size:22px;margin:4px 0}.rmg p{margin:0;color:var(--muted);font-size:15px}
@media (max-width:1000px){.hero{grid-template-columns:1fr}.grid{grid-template-columns:1fr 1fr}.hd nav{display:none}}
@media (max-width:640px){.hero h1{font-size:38px}.grid{grid-template-columns:1fr}.grid article.big{grid-column:auto;grid-row:auto}.grid article.big h3{font-size:22px}.rmg{grid-template-columns:1fr}.f{grid-template-columns:120px 1fr 28px}.nums>div>b{font-size:30px}}
'''
    g = [hero] + arts[:6]  # big card + 6 = two full rows of four
    body = f'''<div class="wrap">
<header class="hd"><a href="index.html">{WM}</a><span class="sp"></span><nav>{nav()}</nav></header>
<section class="hero"><div><div class="eyebrow">✦ An AI newsroom · {N['agents']} agents, 3 editors · Web Summit Lisbon 2026</div><h1>The universe of AI in <em>Portugal</em>, mapped<span class="cur"></span></h1><p>The companies, the people, the events and how they connect, every fact with its source. Web Summit Lisbon 2026 is our first edition.</p>
{prompt_bar(True)}</div>
<div class="nums"><div><b>{N['companies']}</b><span>companies followed</span></div><div><b>{N['events']}</b><span>events, Fri to Thu</span></div><div><b>{N['articles']}</b><span>stories, signed</span></div>
<div class="fields">{radar(7)}<p class="cdl">Opening Night in <span data-cd>3 days</span></p></div></div></section>
<h2 class="h">The stories <a href="articles/index.html">All {N['articles']} →</a></h2>
<div class="grid">{''.join(f'<article class="{"big" if n == 0 else ""}"><a href="{a["href"]}"><img src="{a["card"] if n == 0 else a["img"]}" alt="{esc(a["alt"])}" loading="lazy"></a><div class="t"><div class="k">{esc(a["kicker"])}</div><h3><a href="{a["href"]}">{esc(a["title"])}</a></h3><p>{esc(cut(a["summary"], 150 if n == 0 else 90))}</p>{BADGE}</div></article>' for n, a in enumerate(g))}</div>
<h2 class="h">Our question, for every agent we see <a href="riskmandate/index.html">How we ask →</a></h2>
<div class="rmg"><div><b>01 · REACH</b><h4>What can it actually do?</h4><p>What it can touch: the systems, the data, the money.</p></div><div><b>02 · MANDATE</b><h4>What is it asked to do?</h4><p>What its owner authorised and expects.</p></div><div><b>03 · GAP</b><h4>Who controls the difference?</h4><p>Where reach exceeds mandate, the exposure lives.</p></div></div>
</div>'''
    return page('c', 'The Atlas', css, body, '')

# --- D: The Brief (reading first, one column, built to be skimmed in two minutes) -------------------------
def mock_d():
    css = '''
.wrap{max-width:720px;margin:0 auto;padding:0 16px}
.hd{display:flex;align-items:center;justify-content:space-between;padding:22px 0 12px}
.hd .wm{height:30px}.sub{font:600 13px var(--sans);background:var(--solid);color:var(--on);border-radius:6px;padding:8px 14px}
.date{font:12px var(--mono);color:var(--muted);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:8px 0;display:flex;justify-content:space-between}
.date{flex-wrap:wrap;gap:4px 12px}.date b{color:var(--green)}
.intro{font-size:21px;line-height:1.45;margin:26px 0}
.intro::first-letter{font-size:3.2em;float:left;line-height:.9;margin:4px 8px 0 0;font-weight:600;color:var(--red)}
.k{font:600 11px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--red)}
.top h1{font-size:36px;line-height:1.1;margin:6px 0 12px}
.why{background:var(--card);border-left:4px solid var(--green);padding:14px 18px;margin:16px 0;font-size:17px}
.why b{font:700 12px var(--sans);letter-spacing:.06em;text-transform:uppercase;display:block;margin-bottom:6px;color:var(--green)}
.why ul{margin:0;padding-left:18px}
.read{font:600 14px var(--sans);color:var(--green)}
.h{font:700 12px var(--sans);letter-spacing:.1em;text-transform:uppercase;margin:40px 0 4px;padding-top:10px;border-top:2px solid var(--ink)}
.list article{padding:16px 0;border-bottom:1px solid var(--rule);display:grid;grid-template-columns:1fr 84px;gap:16px;align-items:start}
.list h2{font-size:21px;line-height:1.2;margin:4px 0 6px}.list p{margin:0;font-size:16px;color:var(--muted)}
.list img{border-radius:6px;border:1px solid var(--rule)}
.five{counter-reset:f;margin:0;padding:0;list-style:none}
.five li{counter-increment:f;display:grid;grid-template-columns:40px 1fr;padding:12px 0;border-bottom:1px solid var(--rule);font-size:17px}
.five li:before{content:counter(f,decimal-leading-zero);font:600 15px var(--mono);color:var(--red)}
.five small{display:block;font:13px var(--sans);color:var(--muted)}
.nl{background:var(--solid);color:var(--on);border-radius:14px;padding:22px;margin:40px 0}
.nl h3{margin:0 0 6px;font-size:24px}.nl p{margin:0 0 14px;opacity:.8}
.nl form{display:flex;gap:8px}.nl input{flex:1;border:0;border-radius:8px;padding:12px;font:15px var(--sans)}.nl button{border:0;border-radius:8px;background:var(--on);color:var(--solid);font:600 15px var(--sans);padding:0 18px}
.ft{font:12px var(--mono);color:var(--muted);padding:20px 0 50px;border-top:1px solid var(--rule)}
@media (max-width:560px){.top h1{font-size:28px}.list article{grid-template-columns:1fr 64px}.nl form{flex-direction:column}.nl button{padding:12px}}
'''
    five = today + short_day(days[1]['items'])[:2]
    body = f'''<div class="wrap">
<header class="hd"><a href="index.html">{WM}</a><a class="sub" href="newsletter/index.html">Get the daily</a></header>
<div class="date"><span>Friday 6 November 2026</span><b>Opening Night in <span data-cd>3 days</span></b><span>2 min read</span></div>
<p class="intro">Good morning. Ten years of Web Summit in Lisbon get a price tag, Brazil sends a startup mission, and Portugal Tech Week starts today. Here is what matters before the doors open on Monday.</p>
<section class="top"><div class="k">The big one · {esc(hero['kicker'])}</div><h1><a href="{hero['href']}">{esc(hero['title'])}</a></h1>
<a href="{hero['href']}"><img src="{hero['img']}" alt="{esc(hero['alt'])}" style="border:1px solid var(--rule);border-radius:8px"></a>
<div class="why"><b>✦ The 20-second version · by our agents, checked by an editor</b><ul><li>EY puts the total impact of ten editions at about 2.5 billion euros.</li><li>Portugal's startups grew 132% over the decade, from 2,193 to 5,091.</li><li>An earlier government study found the first four editions' impact "well below the first estimate".</li></ul></div>
<a class="read" href="{hero['href']}">Read the full story: 4 min →</a> {BADGE}<div style="margin-top:22px">{prompt_bar()}</div></section>
<h2 class="h">Also today</h2><div class="list">{''.join(f'<article><div><div class="k">{esc(a["kicker"])}</div><h2><a href="{a["href"]}">{esc(a["title"])}</a></h2><p>{esc(a["summary"])}</p></div><a href="{a["href"]}"><img src="{a["img"]}" alt="{esc(a["alt"])}" loading="lazy"></a></article>' for a in arts[:5])}</div>
<h2 class="h">On the calendar</h2><ol class="five">{''.join(f'<li><span><a href="{i["href"]}">{esc(cut(i["title"], 95))}</a><small>{esc(i["when"])} · {esc(i["where"])}</small></span></li>' for i in five)}</ol>
<div class="nl"><h3>The daily, in your inbox</h3><p>One email each morning of the summit. What is on, what we found, sourced.</p><form action="newsletter/index.html"><input placeholder="Your work email" aria-label="Email"><button>Subscribe</button></form></div>
<p class="ft">Independent. Not affiliated with Web Summit. Powered by RiskMandate. <a href="about/participant.html">Our disclosure</a> · <a href="llms.txt">For AI agents</a></p>
</div>'''
    return page('d', 'The Brief', css, body, '')

for k, f in [('a', mock_a), ('b', mock_b), ('c', mock_c), ('d', mock_d)]:
    open(os.path.join(HERE, f'{k}.htm'), 'w', encoding='utf-8').write(f())
print(json.dumps(dict(articles=len(arts), days=len(days), fields=fields)))
