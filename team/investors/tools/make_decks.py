#!/usr/bin/env python3
"""The investor decks (investors@web-summit.dinis, WS-185, 6 November 2026): the pitch deck and the technology deck as
HTML fragments, team/investors/decks/<slug>.deck, rendered by admin/build/build.mjs at /investors/<slug>/ and presented
by assets/deck.js (arrow keys, F, A, Esc), as the stand-up decks are. The PDFs: team/investors/tools/deck_pdf.cjs.
Rule for every slide (Dinis, 6 November 2026): no numbers and no projections; every claim is one the investor pages
source. Usage: python3 -I team/investors/tools/make_decks.py"""
import os, html
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.join(ROOT, 'team', 'investors', 'decks')
UP = '../../'  # from investors/<slug>/index.html to the site root

CSS = """<style>
.deck{--paper:var(--surface);font-size:17px}.deck *{box-sizing:border-box}
.deck .slide{position:relative;aspect-ratio:16/9;background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:2.2em 2.6em;margin:0 0 1.6em;overflow:hidden;display:flex;flex-direction:column}
.deck .slide h1{font:800 3.2em/1.05 Georgia,serif;margin:.3em 0}.deck .slide h2{font:700 1.7em/1.2 Georgia,serif;margin:0 0 .8em;border:0;padding:0}
.deck .slide-n{position:absolute;right:1em;bottom:.6em;font:600 .75em ui-monospace,monospace;color:var(--ink-2)}
.deck .kick{font:700 .8em ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin:0}.deck .big{font-size:1.25em}
.deck .cover{display:flex;flex-direction:column;justify-content:center;height:100%}
.deck .cap{color:var(--ink-2);font-size:.85em;margin:auto 0 0}.deck ul,.deck ol{margin:.4em 0 0;padding-left:1.2em}.deck li{margin:.35em 0}
.deck .cols{display:grid;grid-template-columns:repeat(var(--n,3),1fr);gap:1em;margin:.4em 0}
.deck .box{border:1px solid var(--line);border-radius:12px;padding:.8em 1em;background:var(--surface-2);font-size:.9em}.deck .box b{display:block;font-size:1.1em;margin-bottom:.3em}
.deck .box.hi{border:2px solid var(--accent)}
.deck .flow{display:flex;gap:.5em;align-items:stretch;margin:.6em 0}.deck .flow>div{flex:1;border:1px solid var(--line);border-radius:12px;padding:.7em;background:var(--surface-2);font-size:.85em}.deck .flow>i{align-self:center;font-style:normal;color:var(--accent);font-weight:800}
.deck .flow b{display:block}
.deck table{border-collapse:collapse;width:100%;font-size:.85em}.deck td,.deck th{border:1px solid var(--line);padding:.35em .55em;text-align:left;vertical-align:top}
.deck .quote{font:italic 1.25em/1.4 Georgia,serif;border-left:4px solid var(--accent);padding-left:.8em;margin:.6em 0}
.deck .tag{display:inline-block;font:700 .7em ui-monospace,monospace;padding:.1em .5em;border-radius:6px;background:var(--accent-soft);margin-left:.3em}
.deck.one .slide{display:none;margin:0}.deck.one .slide.current{display:flex}.deck.one>:not(.slide):not(.deck-bar){display:none}
.deck .deck-bar{display:flex;align-items:center;gap:.5em;flex-wrap:wrap;margin:.8em 0 1.2em}.deck .deck-bar button,.deck .deck-pdf{font:inherit;font-size:.9em;font-weight:700;padding:.45em .9em;border-radius:10px;border:1px solid var(--line-2);background:var(--surface);color:var(--ink);cursor:pointer;text-decoration:none}
.deck .deck-bar [data-prev],.deck .deck-bar [data-next]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);min-width:3em}.deck .deck-bar button:disabled{opacity:.35;cursor:default}
.deck .deck-pos{font:600 .9em ui-monospace,monospace;min-width:4.5em;text-align:center}.deck .deck-gap{flex:1}
.deck.all .deck-bar{position:sticky;bottom:0;background:var(--bg);padding:.5em 0;margin:0}
.deck.full,.deck:fullscreen{position:fixed;inset:0;z-index:1000;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1vh 2vw;font-size:clamp(14px,1.45vw,26px)}
.deck.full .slide.current,.deck:fullscreen .slide.current{width:min(96vw,150vh)}.deck.full .deck-bar,.deck:fullscreen .deck-bar{width:min(96vw,150vh);margin:.6em 0 0}
html.deck-on body{overflow:hidden}
@media (max-width:760px){.deck .slide{aspect-ratio:auto;min-height:70vh;padding:1.1em;overflow:visible}.deck .cols{grid-template-columns:1fr}.deck .flow{flex-direction:column}.deck .flow>i{transform:rotate(90deg)}.deck .slide h1{font-size:2.1em}.deck .slide h2{font-size:1.35em}.deck .deck-gap{display:none}}
@media print{.deck .deck-bar{display:none}}
</style>"""

E = html.escape
def a(href, text): return f'<a href="{UP}{href}">{text}</a>'
def boxes(items, n=None, hi=()): return f'<div class="cols" style="--n:{n or len(items)}">' + ''.join(f'<div class="box{" hi" if i in hi else ""}"><b>{t}</b>{d}</div>' for i, (t, d) in enumerate(items)) + '</div>'
def flow(items): return '<div class="flow">' + '<i>›</i>'.join(f'<div><b>{t}</b>{d}</div>' for t, d in items) + '</div>'
def ul(items): return '<ul>' + ''.join(f'<li>{x}</li>' for x in items) + '</ul>'
def cover(kick, title, sub, cap): return f'<div class="cover"><p class="kick">{kick}</p><h1>{title}</h1><p class="big">{sub}</p><p class="cap">{cap}</p></div>'

PITCH = [
    ('Cover', cover('My Feeds · for investors · Web Summit Lisbon 2026', 'An agentic team that is already working, from the Algarve',
        'People with teams of AI agents under written mandates, building and selling in the open. The team is in place; we are looking for investors for it.',
        'No numbers and no projections, on purpose: the first six months to a year are for discovering the market by selling. Every claim is sourced on ' + a('investors/index.html', 'the investor pages') + '.')),
    ('The problem', '<h2>Agents can do the work now. Who runs them, and who says what they may do?</h2>' + boxes([
        ('Experts do not scale', 'A teacher, a consultant, an advisor sells hours; the work around each hour (site, bookings, preparation, follow-up) eats them.'),
        ('Teams have chats, not teams', 'Anyone can open an AI chat. Few have agents that run on a schedule, with keys, budgets, a record and a person who decides.'),
        ('Nobody owns the gap', 'An agent that can read your email can send it. Between what it can do and what it was asked to do is a gap nobody controls.')])
        + '<p class="cap">Sources: ' + a('investors/market/index.html', 'the market') + '.</p>'),
    ('What we do', '<h2>We make and run agentic teams, and show the work before we sell it</h2>' + boxes([
        ('For an expert', 'their own agentic team, under rules they set: the first is being made for our first friendly.'),
        ('For a team', 'a site, a board, a conductor, a briefing for each person: what this team runs on.'),
        ('For an organisation', 'a sourced picture of their world in days, corrected by them: PrompTugal.news.'),
        ('For a company running agents', 'a mandate for each agent and the gap made visible: RiskMandate.')], n=4)
        + '<p class="quote">"RiskMandate has to be shown, not explained."</p><p class="cap">The team\'s strategy, 1 November 2026. ' + a('investors/positioning/index.html', 'Positioning') + '.</p>'),
    ('Proof, this week', '<h2>Not a mock-up: it is running, in public</h2>' + ul([
        '<b>This site</b>: every person, agent, key, policy, decision and release of the Web Summit team, built from a brief on 30 October. ' + a('team/index.html', 'The team') + ', ' + a('agents/index.html', 'the agents') + ', ' + a('abp/index.html', 'the policies') + '.',
        '<b>PrompTugal.news</b>: a newsroom on technology and AI in Portugal, built the same week, every fact with its source.',
        '<b>The first partner who used it</b>: on 6 November Algarve Evolution read the page about itself and asked for a paragraph to be changed. It treated the work as its own.',
        '<b>RiskMandate on ourselves</b>: a published behaviour policy for every agent we run.'])
        + '<p class="cap">' + a('investors/story/index.html', 'The story') + '.</p>'),
    ('How we make money', '<h2>The code is free. We sell the execution.</h2>' + boxes([
        ('1. Services', 'fixed scope, then changes as asked: a workflow running, a portrait of their world, an event site, a deck. <span class="tag">designed</span>'),
        ('2. Customised agentic teams', 'set up in the buyer\'s own accounts with keys, policies and a conductor, then kept running. <span class="tag">first one in progress</span>'),
        ('3. Packages', 'what sells itself once asked for often enough: a schedule, a summit brief, a vault ticket. <span class="tag">one on sale</span>')])
        + '<p class="quote">"The business model that follows is selling customisation."</p><p class="cap">Dinis Cruz, The value of constraints, 16 October 2026. ' + a('investors/business-model/index.html', 'How we make money') + '.</p>'),
    ('Go-to-market', '<h2>Show it in the buyer\'s world, then sell what they ask for</h2>' + flow([
        ('Make', 'something about them, from public sources'), ('Send', 'a link, from a person'), ('Listen', 'for "can you change this?"'),
        ('Wish list', 'their own AI interviews them'), ('Sell', 'what they asked for; a package on the seventh ask')])
        + ul(['<b>Channels</b>: Web Summit (our stand, 12 November), PrompTugal.news, introducers and ecosystems starting in the Algarve, partners who sell with us, writing in the open.',
              '<b>Usage first, then the sale</b>; a person sends every bill and every email.'])
        + '<p class="cap">' + a('investors/go-to-market/index.html', 'Go-to-market') + '.</p>'),
    ('Open source', '<h2>Open source, because the technology was never the moat</h2><div class="cols" style="--n:2"><div><p class="quote">"The code is open source. The execution is not forkable."</p>'
        + ul(['A fork gets today\'s position, not the pace.', 'What is sold is trust: every line can be read by a buyer or an auditor.', 'Anyone can fork, so customers, founders and investors are protected from each other.']) + '</div>'
        + '<div class="box"><b>The honest weakness</b>The open-source site calls this its most contestable claim. Our answer: keep the pace visible, every release and decision in public, so it can be judged.</div></div>'
        + '<p class="cap">open-source.sgit.ai; The fork next door, 16 October 2026. ' + a('investors/open-source/index.html', 'Open source and the moat') + '.</p>'),
    ('The team', '<h2>The team is already in place</h2>' + boxes([
        ('Dinis Cruz', 'founder and operator: The Cyber Boardroom, MyFeeds.ai, sgit.ai, RiskMandate.ai; CISO; former OWASP Board'),
        ('Nimay Parekh', 'business, positioning, investors'), ('Angelo · Jose Bota', 'engineering, the agents, automation'),
        ('Vicky Wang', 'project management'), ('Silvio Switha', 'ideas, outreach, the Algarve, video'),
        ('Indi Gupte · Sarah', 'the message and examples · design'), ('Daniela', 'the first friendly: the first customised team'),
        ('Their agents', 'each person runs their own; the team runs shared ones')], n=4, hi=(0,))
        + '<p class="cap">' + a('investors/team/index.html', 'The team') + '.</p>'),
    ('The company', '<h2>My Feeds: a technology company in the Algarve</h2><div class="cols" style="--n:2"><div>' + ul([
        '<b>MYFEEDS AI, UNIPESSOAL, LDA</b>, a single-member private limited company.',
        'Seat: <b>Loulé, district of Faro</b>.', 'Activity: computer programming and consultancy.',
        'Incorporated in October 2025; the public directories list no dissolution.']) + '</div>'
        + '<div class="box"><b>Still to settle, said plainly</b>The official register is to be checked by a person; who owns and manages it, from a register; and which company sells what, between My Feeds and The Cyber Boardroom Limited (UK). Dinis\'s to set out.</div></div>'
        + '<p class="cap">Racius and eInforma, read 6 November 2026. ' + a('investors/company/index.html', 'The company') + '.</p>'),
    ('The investment', '<h2>What it is for: time, selling, and scaling the agentic team</h2>' + ul([
        '<b>The first six months to a year</b>: discover the market by selling services and customised agentic teams.',
        '<b>Scale the agentic team</b>: more agents, more people running them, the tools that turn one-off work into packages.',
        '<b>Minimal costs by design</b>, so Dinis expects the company to be profitable very fast: his expectation, not a projection.',
        '<b>In rounds</b>, as traction shows; the conversation is how much of the company you want to hold.'])
        + '<p class="quote">"The worst possible time to raise money is before you are profitable."</p><p class="cap">Dinis Cruz, 21 September 2026. ' + a('investors/investment/index.html', 'The investment') + '.</p>'),
    ('Next', cover('Tell us what you think', 'Read it, question it, and tell us what is missing',
        'Reply to the person who sent you the link, or let your own AI interview you with ' + a('investors/feedback/index.html#prompt', 'our feedback prompt') + '. These pages and this deck change as we get traction; every change is a public commit.',
        a('investors/index.html', 'web-summit.sgit.ai/investors') + ' · ' + a('investors/technology-deck/index.html', 'the technology deck') + ' · kept by investors@web-summit.dinis')),
]

TECH = [
    ('Cover', cover('My Feeds · the technology · for investors', 'How the agentic team works',
        'People with teams of AI agents; agents with keys and written mandates; every change checked and released in the open; private things sealed.',
        'All of it runs on this site today, unless a slide says otherwise. ' + a('investors/how-it-works/index.html', 'How it works') + '.')),
    ('The operating model', '<h2>A person, their agents, and a public record</h2>' + flow([
        ('A person', 'decides, approves, sends'), ('Their conductor', 'plans and runs the other agents, briefs the person'),
        ('Their agents', 'outreach, design, vaults, video, project management'), ('Commits', 'the work and the messages, with name, issue and recipient'),
        ('The gate', 'build and checks; red means no release'), ('Live', 'a numbered release, in public')])
        + ul(['Names say whose agent did what: <code>&lt;role&gt;@web-summit.&lt;person&gt;</code>.', 'Two decision meetings a day; a briefing for each person before each one.'])
        + '<p class="cap">' + a('agents/index.html', 'The agents') + ' · ' + a('meetings/index.html', 'the stand-ups') + '.</p>'),
    ('Identity', '<h2>A key for every agent</h2>' + boxes([
        ('Made in its own session', 'each agent generates its key where it runs; the private half never leaves the session.'),
        ('Published, not registered', 'only the public half is published, on the keys page, by the agent\'s own push.'),
        ('Dies with the session', 'a new session makes a new key and links it to its operator\'s key.')])
        + ul(['Messages, vault keys and feedback are sealed to these keys in the browser or the session.', 'Identities on pki.sgit.ai; the operator confirms by QR code or publication.'])
        + '<p class="cap">' + a('keys/index.html', 'The keys') + '.</p>'),
    ('Mandates', '<h2>RiskMandate, applied to ourselves</h2>' + boxes([
        ('Reach', 'what the agent can actually access or affect'), ('Mandate', 'what its person asked it to do'),
        ('Gap', 'the difference between the two'), ('Barrier', 'what really holds it: a rule, a review or a technical control, with evidence')], n=4)
        + '<p>Every agent on the team has a published behaviour policy in this shape. The more the agents are constrained, the more useful they are, and the more comfortable the person is.</p>'
        + '<p class="cap">' + a('abp/index.html', 'The policies') + ' · riskmandate.ai, Agent Behaviour Policy.</p>'),
    ('Release', '<h2>Every change through a gate, every release in public</h2>' + ul([
        '<b>One repository, everyone commits</b>; generated pages are never committed: the pipeline builds them.',
        '<b>The gate</b> must pass: links resolve, no contact details or secrets, signed articles, no em-dashes, every script parses.',
        '<b>CI owns the version</b>: nobody who pushes writes a number; each release is tagged and deployed.',
        '<b>A markdown twin for every page</b> and llms.txt, so other agents can read the site.'])
        + '<p class="cap">' + a('admin/versions.html', 'Every release') + ' · newsroom.sgit.ai, CI owns the version.</p>'),
    ('Private by design', '<h2>Public by default; private things sealed, and a person sends</h2>' + boxes([
        ('Encrypted vaults', 'sgit and SG/Send: zero-knowledge storage, the server sees ciphertext only.'),
        ('A private CRM', 'contacts, emails and call notes live only there, sealed to named keys.'),
        ('The comms protocol', 'agents draft; a person reads, sends from their own address, and the reply is filed.')])
        + '<p class="cap">' + a('comms-protocol/index.html', 'The comms protocol') + ' · ' + a('crm/index.html', 'the team CRM') + ' · sgit.ai.</p>'),
    ('Open stack', '<h2>Built on open pieces, and open itself</h2>' + boxes([
        ('Claude', 'the reasoning engine, in scheduled sessions'), ('GitHub', 'code, board and record; static sites'),
        ('sgit · SG/Send', 'encrypted vaults'), ('pki.sgit.ai', 'agent identities'), ('RiskMandate', 'the policy model')], n=5)
        + '<p>Our own code is Apache-2.0; text and data CC BY 4.0. A buyer can read everything before paying and keep it if they leave.</p>'
        + '<p class="cap">' + a('investors/open-source/index.html', 'Why open source') + '.</p>'),
    ('Honest status', '<h2>What runs, what partly runs, what is designed</h2><table><tr><th>Runs</th><th>Partly</th><th>Designed</th></tr>'
        + '<tr><td>this site and its gate and releases; agent keys and policies; the stand-ups and briefings; PrompTugal.news with sourced pages, maps and an event programme</td>'
        + '<td>vaults a customer creates on the live site (a key is issued by hand); search and an "ask the site" chat; infographics on the pages</td>'
        + '<td>a personal schedule for each attendee; a customised agentic team as a product (the first is being made by hand)</td></tr></table>'
        + '<p class="cap">This site\'s REALITY.md and PrompTugal.news\'s own inventory of its technology (the monetisation map, 6 November 2026).</p>'),
    ('For a customer', cover('What a customer gets', 'The same model, in their own accounts',
        'Their own agents with their own keys and policies, a conductor that briefs them, and a person on our side who sets it up, checks it and changes it as they ask. They see it running before they pay, and keep it if they leave.',
        a('investors/index.html', 'web-summit.sgit.ai/investors') + ' · ' + a('investors/pitch-deck/index.html', 'the pitch deck') + ' · ' + a('investors/feedback/index.html', 'feedback'))),
]

DECKS = {
    'pitch-deck': ('The pitch deck: an agentic team, from the Algarve', 'The pitch for investors in slides: the problem, what we do, the proof, how we make money, the go-to-market, open source, the team, the company and what the investment is for. No numbers and no projections, on purpose.', PITCH),
    'technology-deck': ('The technology deck: how the agentic team works', 'The technology for investors in slides: the operating model, a key for every agent, mandates, the gate and the releases, private by design, the open stack, and an honest status of what runs.', TECH),
}

os.makedirs(OUT, exist_ok=True)
for slug, (title, summary, slides) in DECKS.items():
    body = ''.join(f'<section class="slide" aria-label="{E(label)}">{inner}</section>\n' for label, inner in slides)
    frag = (f'<!-- title: {title} -->\n<!-- summary: {summary} -->\n{CSS}\n'
            f'<p>{a("investors/index.html", "For investors")} · keys ← → · F fullscreen · A all slides. The plain-text version is this page\'s markdown twin (index.md).</p>\n'
            f'<div class="deck one" data-pdf="{UP}assets/investors/{slug}.pdf">\n{body}</div>\n<script src="{UP}assets/deck.js" defer></script>\n')
    open(os.path.join(OUT, slug + '.deck'), 'w').write(frag)
    print(f'{slug}: {len(slides)} slides')
