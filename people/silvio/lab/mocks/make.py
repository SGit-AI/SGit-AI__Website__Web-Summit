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


# =========================================================================================================
# Round 2 (Silvio, 6 November 2026, evening): "mix the best newspaper with the best AI and tech platforms",
# bold, not pale: highlights that grab the eye. Each sets its own colours (the palette buttons are hidden).
# =========================================================================================================
OWN = 'html[data-pal][data-mode]{%s}.pals{display:none!important}'
WMD = '<img class="wmx" src="assets/brand/promptugal-wordmark-dark.svg" alt="PrompTugal.news">'
WML = '<img class="wmx" src="assets/brand/promptugal-wordmark-light.svg" alt="PrompTugal.news">'
HL = lambda t: t.replace('2.5 billion euros', '<mark>2.5 billion euros</mark>')
def ticker(items):
    row = ''.join(f'<a href="{i["href"]}"><time>{esc(i["when"])}</time> {esc(cut(i["title"], 70))}</a>' for i in items)
    return f'<div class="tk"><div class="tk-in">{row}{row}</div></div>'
TK_CSS = '''.tk{overflow:hidden;white-space:nowrap}.tk-in{display:inline-flex;gap:42px;animation:tk 60s linear infinite;padding:11px 0}.tk:hover .tk-in{animation-play-state:paused}
.tk a{font:500 13px var(--sans)}.tk time{font:600 12px var(--mono);opacity:.75;margin-right:6px}@keyframes tk{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.tk-in{animation:none;flex-wrap:wrap}}'''
week = today + short_day(days[1]['items'])[:3] + (short_day(days[2]['items'])[:2] if len(days) > 2 else [])

# --- E: The Front Page (the New York Times' authority x MIT Technology Review's colour) -------------------
def mock_e():
    css = OWN % '--paper:#fbfaf6;--ink:#111418;--red:#ff5a3c;--green:#0d3b33;--rule:#dcd8cc;--muted:#5d6266;--card:#ffffff;--solid:#0d3b33;--on:#ffffff' + '''
.w{max-width:1260px;margin:0 auto;padding:0 16px}
.dl{display:flex;flex-wrap:wrap;gap:4px 16px;justify-content:space-between;font:12px var(--mono);color:var(--muted);padding:10px 0}
.mast{text-align:center;padding:6px 0 4px}.mast .wmx{height:64px;margin:0 auto}
.nv{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;font:600 13px var(--sans);padding:12px 0;border-top:1px solid var(--ink);border-bottom:4px solid var(--ink)}
.band{background:#0d3b33;color:#fff;margin-top:22px}
.band .w{display:grid;grid-template-columns:1.15fr .85fr;gap:36px;padding:26px 16px 28px;align-items:center}
.kk{font:700 12px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:#5be0b3}
.band h1{font:600 46px/1.06 var(--serif);margin:8px 0 12px;letter-spacing:-.015em}
mark{background:linear-gradient(transparent 58%,#5be0b3 58%);color:inherit;padding:0 2px}
.band h1 mark{background:linear-gradient(transparent 72%,rgba(91,224,179,.5) 72%)}
.band p{font-size:17px;line-height:1.5;color:#d6e6e1;margin:0 0 12px}
.band .by{font:12px var(--mono);color:#a8c7bf}.band .badge{color:#5be0b3}
.band figure{margin:0 0 0 auto;max-width:440px;background:#fff;padding:8px;border-radius:4px;box-shadow:0 20px 44px rgba(0,0,0,.3);transform:rotate(.6deg)}
.dl [data-cd] b{font:600 1em var(--mono)}
.live{background:#111418;color:#fff;display:flex;align-items:center}.live b{flex:0 0 auto;background:#ff5a3c;font:700 12px var(--sans);letter-spacing:.1em;padding:12px 16px}
.cols{display:grid;grid-template-columns:280px 1fr 300px;gap:0;padding:30px 0}
.cols>section{padding:0 24px}.cols>section+section{border-left:1px solid var(--rule)}.cols>section:first-child{padding-left:0}.cols>section:last-child{padding-right:0}
.h{font:800 12px var(--sans);letter-spacing:.14em;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid var(--ink);margin:0 0 6px}
.brf li{display:grid;grid-template-columns:44px 1fr;padding:12px 0;border-bottom:1px solid var(--rule);list-style:none}
.brf ol{margin:0;padding:0;counter-reset:n}.brf li{counter-increment:n}
.brf li:before{content:counter(n);font:700 34px/1 var(--serif);color:#0d3b33}
.brf a{font:600 17px/1.25 var(--serif)}.brf small{display:block;font:11px var(--sans);text-transform:uppercase;letter-spacing:.08em;color:#c2410c;margin-top:4px}
.st{display:grid;grid-template-columns:1fr 150px;gap:18px;padding:16px 0;border-bottom:1px solid var(--rule)}
.st h2{font:600 24px/1.15 var(--serif);margin:4px 0 6px}.st p{margin:0;color:var(--muted);font-size:15px}.st img{border:1px solid var(--rule)}
.st .k{font:700 11px var(--sans);letter-spacing:.1em;text-transform:uppercase;color:#c2410c}
.st.big{grid-template-columns:1fr}.st.big h2{font-size:32px}
.nx li{list-style:none;padding:10px 0;border-bottom:1px solid var(--rule);font:15px/1.3 var(--serif)}.nx ul{margin:0;padding:0}
.nx time{display:inline-block;font:700 11px var(--mono);background:#0d3b33;color:#fff;padding:2px 6px;border-radius:3px;margin-bottom:4px}
.nums{background:#5be0b3;color:#0d3b33}.nums .w{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:28px 16px}
.nums b{display:block;font:700 64px/1 var(--serif);letter-spacing:-.03em}.nums span{font:600 13px var(--sans);text-transform:uppercase;letter-spacing:.08em}
.wmx{height:28px;width:auto}
''' + TK_CSS + '''
@media (max-width:1000px){.band .w,.cols{grid-template-columns:1fr}.cols>section{padding:0!important;border:0!important;margin-bottom:26px}.band h1{font-size:38px}.band figure{margin:0 auto}.nums .w{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.mast .wmx{height:42px}.nv{justify-content:flex-start;flex-wrap:nowrap;overflow-x:auto}.band h1{font-size:30px}.st{grid-template-columns:1fr 96px}.nums b{font-size:44px}.dl span:last-child{display:none}}
'''
    sec = arts[:4]
    body = f'''<div class="w"><div class="dl"><span>Friday 6 November 2026</span><span>Opening Night in <span data-cd>3 days</span></span><span>Lisbon · Independent</span></div>
<header class="mast"><a href="index.html">{WML}</a></header><nav class="nv">{nav()}</nav></div>
<section class="band"><div class="w"><div><div class="kk">{esc(hero['kicker'])}</div><h1><a href="{hero['href']}">{HL(esc(hero['title']))}</a></h1><p>{esc(hero['summary'])}</p><div class="by">{esc(hero['byline'])}</div>{BADGE}</div>
<figure><a href="{hero['href']}"><img src="{hero['img']}" alt="{esc(hero['alt'])}" fetchpriority="high"></a></figure></div></section>
<div class="live"><b>THIS WEEK</b>{ticker(week)}</div>
<div class="w"><div class="cols">
<section class="brf"><h2 class="h">The briefing</h2><ol>{''.join(f'<li><span><a href="{a["href"]}">{esc(a["title"])}</a><small>{esc(a["kicker"])}</small></span></li>' for a in arts[4:9])}</ol></section>
<section>{''.join(f'<article class="st{" big" if n == 0 else ""}"><div><div class="k">{esc(a["kicker"])}</div><h2><a href="{a["href"]}">{esc(a["title"])}</a></h2><p>{esc(cut(a["summary"], 170))}</p>{BADGE}</div>{"" if n == 0 else f"<a href={chr(34)}{a[chr(104)+chr(114)+chr(101)+chr(102)]}{chr(34)}><img src={chr(34)}{a[chr(105)+chr(109)+chr(103)]}{chr(34)} alt={chr(34)}{chr(34)} loading=lazy></a>"}</article>' for n, a in enumerate(sec))}</section>
<section class="nx"><h2 class="h">Now and next</h2><ul>{''.join(f'<li><time>{esc(i["when"])}</time><br><a href="{i["href"]}">{esc(cut(i["title"], 90))}</a></li>' for i in week[:6])}</ul><div style="margin-top:18px">{radar()}</div></section>
</div></div>
<section class="nums"><div class="w"><div><b>{N['companies']}</b><span>companies followed</span></div><div><b>{N['events']}</b><span>events this week</span></div><div><b>{N['articles']}</b><span>stories, signed</span></div><div><b>9–12</b><span>November, Lisbon</span></div></div></section>
<div class="w" style="padding:30px 16px 60px;max-width:860px">{prompt_bar(True)}</div>'''
    return page('e', 'The Front Page', css, body, '')

# --- F: Signal (The Information's seriousness x Hugging Face and Hacker News' ranked feeds, dark) ---------
# v2 (Silvio, 6 November evening: "optimise the space, not all big, we need to see a lot at once"): a compact
# hero, three dense columns from the first screen, smaller type and tighter rows.
def mock_f():
    LIGHT = '--paper:#f7f8fc;--ink:#151733;--red:#e11d74;--green:#0e9f7e;--rule:#e3e5f0;--muted:#5a5f7d;--card:#ffffff;--solid:#6d4aff;--on:#ffffff;--a1:#6d4aff;--a2:#0891b2;--a3:#0e9f7e;--glow1:rgba(109,74,255,.18);--glow2:rgba(8,145,178,.14);--hl:rgba(109,74,255,.14);--sh:0 1px 2px rgba(21,23,51,.04),0 8px 24px rgba(21,23,51,.06)'
    DARK = '--paper:#0a0c16;--ink:#eef0ff;--red:#ff6b9a;--green:#7cf3c4;--rule:#232741;--muted:#9aa0c3;--card:#12152a;--solid:#7c5cff;--on:#ffffff;--a1:#a78bfa;--a2:#22d3ee;--a3:#7cf3c4;--glow1:rgba(124,92,255,.5);--glow2:rgba(34,211,238,.3);--hl:rgba(124,243,196,.12);--sh:none'
    css = f'html[data-pal][data-mode]{{{LIGHT}}}html[data-pal][data-mode=dark]{{{DARK}}}.pals [data-p]{{display:none}}' + '''
body{font-size:15px}
.w{max-width:1320px;margin:0 auto;padding:0 16px}
.glow{position:relative;overflow:hidden;border-bottom:1px solid var(--rule);background:linear-gradient(180deg,var(--card),var(--paper))}
.glow:before{content:"";position:absolute;inset:-60% -10% auto;height:520px;background:radial-gradient(closest-side,var(--glow1),transparent 70%),radial-gradient(closest-side at 78% 45%,var(--glow2),transparent 70%);filter:blur(10px);pointer-events:none}
.hd{position:relative;display:flex;align-items:center;gap:18px;padding:12px 0}.hd nav{display:flex;gap:16px;font:500 13px var(--sans);color:var(--muted);flex-wrap:wrap}.sp{flex:1}
.hero{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;padding:14px 0 18px}
.pill{display:inline-block;font:600 11px var(--mono);color:var(--a1);border:1px solid var(--a1);background:var(--hl);border-radius:999px;padding:4px 10px}
.hero h1{font:600 40px/1.05 var(--serif);margin:10px 0 6px;letter-spacing:-.015em}
.grad{background:linear-gradient(90deg,var(--a1),var(--a2) 60%,var(--a3));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{font-size:15px;color:var(--muted);margin:0}
.hero .pb{background:var(--card);border:1.5px solid transparent;background-image:linear-gradient(var(--card),var(--card)),linear-gradient(90deg,var(--a1),var(--a2));background-origin:border-box;background-clip:padding-box,border-box;box-shadow:0 6px 24px var(--glow1)}
.hero .pb input{padding:11px 10px;font-size:15px}.pcs{margin-top:8px}.pc{font-size:12px!important;padding:3px 10px!important}
.stats{display:flex;gap:22px;margin-top:12px;font:11px var(--mono);color:var(--muted);flex-wrap:wrap;align-items:baseline}.stats b{font:600 20px var(--sans);color:var(--ink);margin-right:5px}
.stats [data-cd] b{font-size:inherit;margin:0}
.tkw{border-bottom:1px solid var(--rule);background:var(--card);color:var(--ink)}.tk-in{padding:8px 0}.tk a{font-size:12px}.tk time{color:var(--a1);opacity:1}
.g{display:grid;grid-template-columns:1.25fr 1fr .8fr;gap:22px;padding:18px 0 50px}
.h{display:flex;justify-content:space-between;align-items:baseline;font:700 11px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 8px;padding-bottom:6px;border-bottom:1px solid var(--rule)}
.h a{color:var(--a1);text-transform:none;letter-spacing:0;font-weight:600}
.lead{display:grid;grid-template-columns:44% 1fr;gap:14px;background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:10px;margin-bottom:16px;box-shadow:var(--sh)}
.lead img{border-radius:9px}.lead h2{font:600 22px/1.12 var(--serif);margin:6px 0}.lead p{color:var(--muted);margin:0 0 6px;font-size:14px;line-height:1.4}
mark{background:linear-gradient(transparent 55%,var(--hl) 55%);color:var(--a1);font-weight:700;padding:0 2px}
.rk{counter-reset:r;margin:0;padding:0}
.rk li{list-style:none;counter-increment:r;display:grid;grid-template-columns:30px 1fr 46px;gap:10px;align-items:center;padding:7px 6px;border-bottom:1px solid var(--rule);transition:background .15s;border-radius:8px}
.rk li:hover{background:var(--card);box-shadow:var(--sh)}
.rk li:before{content:counter(r,decimal-leading-zero);font:700 17px var(--sans);background:linear-gradient(180deg,var(--a1),var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent}
.rk h3{font:600 15px/1.25 var(--serif);margin:2px 0 0}.rk img{border-radius:6px;border:1px solid var(--rule)}
.chip{display:inline-block;font:700 9.5px var(--sans);letter-spacing:.08em;text-transform:uppercase;border-radius:5px;padding:2px 6px}
.c0{background:rgba(109,74,255,.12);color:#5b3be0}.c1{background:rgba(8,145,178,.12);color:#0b7790}.c2{background:rgba(14,159,126,.12);color:#0b7f65}.c3{background:rgba(225,29,116,.10);color:#c0175f}
[data-mode=dark] .c0{color:#c4b5fd;background:rgba(167,139,250,.16)}[data-mode=dark] .c1{color:#67e8f9;background:rgba(34,211,238,.14)}[data-mode=dark] .c2{color:#7cf3c4;background:rgba(124,243,196,.14)}[data-mode=dark] .c3{color:#ff9dbb;background:rgba(255,107,154,.14)}
.mg{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.mg article{background:var(--card);border:1px solid var(--rule);border-radius:12px;overflow:hidden;transition:transform .15s,border-color .15s;box-shadow:var(--sh)}
.mg article:hover{transform:translateY(-2px);border-color:var(--a1)}
.mg img{aspect-ratio:16/10;object-fit:cover;object-position:top;width:100%}.mg .t{padding:8px 10px 10px}.mg h3{font:600 14px/1.25 var(--serif);margin:4px 0 0}
.side>div{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:12px;margin-bottom:14px;box-shadow:var(--sh)}
.side .radar{border:0;padding:0;background:none}.rr{font-size:12px!important;padding:3px 0!important}.rr u{background:linear-gradient(90deg,var(--a1),var(--a2))!important;opacity:1!important}.radar .rh b{color:var(--a1)!important}
.tl li{list-style:none;padding:6px 0 6px 12px;border-left:2px solid var(--a1);margin-left:3px;font:14px/1.3 var(--serif)}.tl ul{margin:0;padding:0}
.tl time{display:block;font:600 10.5px var(--mono);color:var(--a1)}
.badge{color:var(--a3);font-size:10px!important}
.wmx{height:24px;width:auto}.wmx.dk{display:none}[data-mode=dark] .wmx.lt{display:none}[data-mode=dark] .wmx.dk{display:inline}
''' + TK_CSS + '''
@media (max-width:1100px){.g{grid-template-columns:1fr 1fr}.side{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:14px}.side>div{margin:0}}
@media (max-width:760px){.hero,.g,.side{grid-template-columns:1fr}.hd nav{display:none}.hero h1{font-size:30px}.lead{grid-template-columns:1fr}}
'''
    kc = lambda k: 'c0' if 'Portugal' in k else 'c1' if 'Europe' in k else 'c2' if 'summit' in k.lower() or 'robot' in k.lower() else 'c3'
    chip = lambda a: f'<span class="chip {kc(a["kicker"])}">{esc(cut(a["kicker"], 26))}</span>'
    body = f'''<div class="glow"><div class="w"><header class="hd"><a href="index.html">{WML.replace('class="wmx"','class="wmx lt"')}{WMD.replace('class="wmx"','class="wmx dk"')}</a><span class="sp"></span><nav>{nav()}</nav></header>
<section class="hero"><div><span class="pill">✦ An AI newsroom · about 30 agents, 3 editors · every fact signed</span>
<h1>What matters in AI in Portugal, <span class="grad">right now.</span></h1>
<p>The companies, the people and the sessions at Web Summit Lisbon, ranked, sourced and explained.</p></div>
<div>{prompt_bar()}<div class="stats"><span><b>{N['companies']}</b>companies</span><span><b>{N['events']}</b>events</span><span><b>{N['articles']}</b>stories</span><span><b data-cd>3 days</b>to Opening Night</span></div></div></section></div></div>
<div class="tkw">{ticker(week)}</div>
<div class="w"><div class="g"><section>
<article class="lead"><a href="{hero['href']}"><img src="{hero['img']}" alt="{esc(hero['alt'])}" fetchpriority="high"></a><div><span class="chip c0">Top story</span><h2><a href="{hero['href']}">{HL(esc(hero['title']))}</a></h2><p>{esc(cut(hero['summary'], 150))}</p>{BADGE}</div></article>
<h2 class="h">Top signals today <a href="articles/index.html">All {N['articles']} →</a></h2>
<ol class="rk">{''.join(f'<li><div>{chip(a)}<h3><a href="{a["href"]}">{esc(a["title"])}</a></h3></div><a href="{a["href"]}"><img src="{a["img"]}" alt="" loading="lazy"></a></li>' for a in arts[:9])}</ol></section>
<section><h2 class="h">More stories <a href="articles/index.html">All →</a></h2><div class="mg">{''.join(f'<article><a href="{a["href"]}"><img src="{a["img"]}" alt="" loading="lazy"></a><div class="t">{chip(a)}<h3><a href="{a["href"]}">{esc(a["title"])}</a></h3></div></article>' for a in arts[9:15])}</div></section>
<aside class="side"><div>{radar(7)}</div><div class="tl"><h2 class="h">In Lisbon this week <a href="summit/index.html">Agenda →</a></h2><ul>{''.join(f'<li><time>{esc(i["when"])}</time><a href="{i["href"]}">{esc(cut(i["title"], 70))}</a></li>' for i in week[:7])}</ul></div></aside>
</div></div>'''
    return page('f', 'Signal', css, body, '')

# --- G: The Magazine (Every and Wired's covers x Platformer's colour x a newspaper's sections) --------------
def mock_g():
    css = OWN % '--paper:#fffaf3;--ink:#16131f;--red:#ff6a4d;--green:#3b5bfd;--rule:#ecdfcf;--muted:#625b6e;--card:#ffffff;--solid:#16131f;--on:#ffffff' + '''
.w{max-width:1240px;margin:0 auto;padding:0 16px}
.hd{display:flex;align-items:center;gap:18px;padding:14px 0}.hd .wmx{height:28px}.hd nav{display:flex;gap:18px;font:600 13px var(--sans);flex-wrap:wrap}.sp{flex:1}
.cover{background:linear-gradient(120deg,#ff6a4d 0%,#ff4f8b 38%,#7b61ff 100%);color:#fff;border-radius:28px;margin:8px 16px 0;overflow:hidden;position:relative}
.cover:after{content:"";position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:rgba(255,255,255,.12)}
.cover .in{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:36px;padding:54px 48px;max-width:1240px;margin:0 auto}
.issue{font:600 12px var(--mono);letter-spacing:.1em;opacity:.85}
.cover h1{font:600 74px/.98 var(--serif);margin:14px 0 18px;letter-spacing:-.025em}
.cover h1 i{font-style:italic;background:#ffd23f;color:#16131f;padding:0 10px;border-radius:8px;display:inline-block;transform:rotate(-1.5deg)}
.cover p{font-size:19px;opacity:.92;max-width:30em;margin:0 0 22px}
.lines a{display:block;border-top:1px solid rgba(255,255,255,.35);padding:12px 0;font:600 19px/1.25 var(--serif)}
.lines small{display:block;font:700 11px var(--sans);letter-spacing:.1em;text-transform:uppercase;opacity:.8;margin-bottom:3px}
.cover figure{margin:0;align-self:center;background:#fff;border-radius:18px;padding:10px;box-shadow:0 30px 70px rgba(30,0,60,.35);transform:rotate(1.5deg)}
.cover figure img{border-radius:10px}
.cover .pb{margin-top:6px}.cover .pc{color:#fff;border-color:rgba(255,255,255,.45);background:transparent}
.sun{background:#ffd23f;margin:22px 16px 0;border-radius:22px}.sun .in{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:26px 36px;max-width:1240px;margin:0 auto}
.sun b{display:block;font:700 70px/1 var(--serif);letter-spacing:-.04em}.sun span{font:700 12px var(--sans);text-transform:uppercase;letter-spacing:.08em}
.secs{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:34px 0}
.sec{border-radius:22px;padding:22px;color:#fff}.sec h2{font:600 30px var(--serif);margin:0 0 4px}.sec .sub{font:600 12px var(--sans);text-transform:uppercase;letter-spacing:.1em;opacity:.85;margin-bottom:10px}
.sec a.s{display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:center;padding:12px 0;border-top:1px solid rgba(255,255,255,.3);font:600 17px/1.25 var(--serif)}
.sec img{border-radius:10px}
.s0{background:#3b5bfd}.s1{background:#16131f}.s2{background:#0f9d7a}
mark{background:#ffd23f;color:#16131f;padding:0 4px;border-radius:4px}
.feat{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center;padding:10px 0 60px}
.feat h2{font:600 44px/1.05 var(--serif);margin:8px 0}.feat .k{font:700 12px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:#ff4f8b}
.feat p{font-size:18px;color:var(--muted)}.feat img{border-radius:22px;box-shadow:0 20px 50px rgba(22,19,31,.15)}
.wmx{height:28px;width:auto}
@media (max-width:1000px){.cover .in,.feat{grid-template-columns:1fr}.secs{grid-template-columns:1fr}.cover .in{padding:36px 24px}.sun .in{grid-template-columns:1fr 1fr;padding:22px}.hd nav{display:none}}
@media (max-width:600px){.cover{margin:6px 8px 0;border-radius:20px}.cover h1{font-size:44px}.sun{margin:16px 8px 0}.sun b{font-size:48px}.feat h2{font-size:32px}}
'''
    groups = [('Portugal', 'Startups, money and the country', lambda k: 'Portugal' in k, 's0'),
              ('Europe', 'Brussels, funding, the continent', lambda k: 'Europe' in k, 's1'),
              ('The summit', 'Announcements, robots, the days', lambda k: not ('Portugal' in k or 'Europe' in k), 's2')]
    secs = ''.join(f'<section class="sec {c}"><div class="sub">{esc(s)}</div><h2>{esc(t)}</h2>' + ''.join(f'<a class="s" href="{a["href"]}"><img src="{a["img"]}" alt="" loading="lazy"><span>{esc(a["title"])}</span></a>' for a in [a for a in arts if f(a['kicker'])][:4]) + '</section>' for t, s, f, c in groups)
    feat = arts[0]
    body = f'''<div class="w"><header class="hd"><a href="index.html">{WML}</a><span class="sp"></span><nav>{nav()}</nav></header></div>
<section class="cover"><div class="in"><div><div class="issue">WEB SUMMIT EDITION · FRIDAY 6 NOVEMBER 2026 · OPENING NIGHT IN <span data-cd>3 DAYS</span></div>
<h1>The universe of AI in <i>Portugal</i>, mapped.</h1><p>The companies, the people and the events, and how they connect. Written by AI agents, checked by editors, every fact signed.</p>
<div class="lines"><a href="{hero['href']}"><small>Cover story</small>{HL(esc(hero['title']))}</a>{''.join(f'<a href="{a["href"]}"><small>{esc(a["kicker"])}</small>{esc(a["title"])}</a>' for a in arts[1:3])}</div></div>
<figure><a href="{hero['href']}"><img src="{hero['img']}" alt="{esc(hero['alt'])}" fetchpriority="high"></a></figure></div></section>
<section class="sun"><div class="in"><div><b>{N['companies']}</b><span>companies followed</span></div><div><b>{N['events']}</b><span>events this week</span></div><div><b>{N['articles']}</b><span>stories, signed</span></div><div><b>{N['agents']}</b><span>AI agents on the desk</span></div></div></section>
<div class="w"><div style="max-width:820px;margin:34px auto 0">{prompt_bar(True)}</div><div class="secs">{secs}</div>
<article class="feat"><a href="{feat['href']}"><img src="{feat['card']}" alt="{esc(feat['alt'])}" loading="lazy"></a><div><div class="k">{esc(feat['kicker'])}</div><h2><a href="{feat['href']}">{esc(feat['title'])}</a></h2><p>{esc(feat['summary'])}</p>{BADGE}</div></article></div>'''
    return page('g', 'The Magazine', css, body, '')

for k, f in [('a', mock_a), ('b', mock_b), ('c', mock_c), ('d', mock_d), ('e', mock_e), ('f', mock_f), ('g', mock_g)]:
    open(os.path.join(HERE, f'{k}.htm'), 'w', encoding='utf-8').write(f())
print(json.dumps(dict(articles=len(arts), days=len(days), fields=fields)))
