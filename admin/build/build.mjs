#!/usr/bin/env node
// Renders the site from content/ (markdown with a front-matter header) into HTML, plus the machine surfaces:
// llms.txt, sitemap.xml, index.md, the articles index, markdown twins and admin/versions.html.
// No dependencies. Never hand-edit a generated page; edit content/ and run: node admin/build/build.mjs
import fs from 'fs'
import path from 'path'
import * as CAST from './cast.mjs'
import { execFileSync } from 'child_process'
import { meetingsContext, buildMeetings, sinceMd } from './meetings.mjs'
import { inventory, inventoryMd, myAgentsMd } from './inventory.mjs'
import { onboarding, LEVELS } from './onboarding.mjs'
import { orgchartSvg } from './orgchart.mjs'
import { homeBlocks, expandHome } from './home.mjs'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const HOST = fs.readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim()
const VERSION = fs.readFileSync(path.join(ROOT, 'admin/build/version.txt'), 'utf8').trim()
const REPO = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit'
// navigation: a few sections on top, each with its own sub-menu; every page gets breadcrumbs back to its parent
const SECTIONS = [
    { t: 'Start', h: 'start/index.html', re: /^start\//, sub: [] },
    { t: 'Team', h: 'team/index.html', re: /^(team|brief-|people|pulse|agents|meet|abp|cast|wakes)\b/, sub: [['People', 'team/index.html'], ['The map', 'team/map/index.html'], ['Setup', 'team/setup/index.html'], ['Everything', 'team/everything/index.html'], ['The cast', 'cast/index.html'], ['Briefs', 'briefs/index.html'], ['Pulse', 'pulse/index.html'], ['Agents', 'agents/index.html'], ['At work', 'wakes/index.html'], ['ABPs', 'abp/index.html'], ['Meet us', 'meet/index.html']] },
    { t: 'Work', h: 'briefs/index.html#issues', re: /^(plan|design|log|merch-sponsor|print-order|procurement|videos|research|reports|board-health|site-review|updates|meetings)\b/, sub: [['Stand-ups', 'meetings/index.html'], ['Updates', 'updates/index.html'], ['The board', 'briefs/index.html#issues'], ['Site review', 'site-review/index.html'], ['Board health', 'board-health/index.html'], ['Reports', 'reports/index.html'], ['Plan', 'plan/index.html'], ['Design', 'design/index.html'], ['Videos', 'videos/index.html'], ['Log', 'log/index.html'], ['Merch sponsor', 'merch-sponsor/index.html'], ['Procurement', 'procurement/index.html'], ['Research', 'research/insider/index.html']] },
    { t: 'Summit', h: 'summit/index.html', re: /^(summit|companies)\b/, sub: [['Web Summit 2026', 'summit/index.html'], ['Companies', 'companies/index.html']] },
    { t: 'About', h: 'about/index.html', re: /^(about|articles|keys|admin|agent\/|briefing)\b/, sub: [['About', 'about/index.html'], ['Articles', 'articles/index.html'], ['Keys', 'keys/index.html'], ['Versions', 'admin/versions.html'], ['The site agent', 'agent/index.html'], ['Inbox briefing', 'briefing/index.html']] },
]
const NAV = SECTIONS.map(s => [s.t, s.h])
const sectionOf = rel => SECTIONS.find(s => s.re.test(rel))
const personOf = rel => { const m = rel.match(/^(?:brief-([a-z0-9-]+)|people\/([a-z0-9-]+)|meet\/([a-z0-9-]+)|team\/([a-z0-9-]+))\//); const id = m && (m[1] || m[2] || m[3] || m[4]); return id && teamData.members.find(x => x.id === id) }

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// everything written here is generated: gitignored, built by CI, never committed; the list goes to .generated.txt for the gate
const GENERATED = new Set()
const write = (rel, text) => { GENERATED.add(rel); const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) }
process.on('exit', code => { if (code === 0) fs.writeFileSync(path.join(ROOT, '.generated.txt'), [...GENERATED].sort().join('\n') + '\n') })

// code spans are set aside first, so nothing inside them is read as markup; emphasis follows markdown's flanking
// rule (no space just inside the stars), so a cron line like 27 */2 * * * stays as written
function inline(s) {
    const codes = []
    return esc(s)
        .replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`)
        .replace(/\*\*(?=\S)([^*]+?)(?<=\S)\*\*/g, '<b>$1</b>')
        .replace(/\*(?=[^\s*])([^*]+?)(?<=[^\s*])\*/g, '<i>$1</i>')
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\u0000(\d+)\u0000/g, (_, n) => `<code>${codes[n]}</code>`)
}

function parse(src) {
    const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!m) throw new Error('missing front matter')
    const meta = {}
    for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"(.*)"$/, '$1') }
    return { meta, body: m[2] }
}

function render(md) {
    const lines = md.split('\n'), out = []
    let i = 0
    while (i < lines.length) {
        const l = lines[i]
        if (l.startsWith('```cards')) {
            const rows = []
            for (i++; i < lines.length && !lines[i].startsWith('```'); i++) rows.push(lines[i].split('|').map(c => c.trim()))
            i++
            out.push(`<div class="cards">${rows.map(([t, h, d]) => `<a class="card" href="${h}"><b>${inline(t)}</b><span>${inline(d)}</span></a>`).join('')}</div>`)
        } else if (l.startsWith('```')) {
            const buf = []
            for (i++; i < lines.length && !lines[i].startsWith('```'); i++) buf.push(lines[i])
            i++
            out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`)
        } else if (/^!drive\[/.test(l)) {
            // !drive[caption](<Google Drive file id>): Drive's own player (the file must be shared as anyone with the link)
            const m = l.match(/^!drive\[([^\]]*)\]\(([A-Za-z0-9_-]+)\)/)
            out.push(`<figure class="video drive"><iframe src="https://drive.google.com/file/d/${m[2]}/preview" allow="autoplay; fullscreen" allowfullscreen loading="lazy" title="${esc(m[1])}"></iframe><figcaption>${inline(m[1])} · <a href="https://drive.google.com/file/d/${m[2]}/view">open in Google Drive</a></figcaption></figure>`); i++
        } else if (/^!video\[/.test(l)) {
            // !video[caption](file.mp4 poster.jpg): a video that plays inline, muted controls, with its poster
            const m = l.match(/^!video\[([^\]]*)\]\(([^)\s]+)(?:\s+([^)\s]+))?\)/)
            out.push(`<figure class="video"><video controls playsinline preload="none"${m[3] ? ` poster="${m[3]}"` : ''} src="${m[2]}"></video><figcaption>${inline(m[1])}</figcaption></figure>`); i++
        } else if (/^#{2,3} /.test(l)) {
            const n = l.match(/^#+/)[0].length, raw = l.replace(/^#+ /, ''), anchor = raw.match(/\s*\{#([a-z0-9-]+)\}\s*$/), t = raw.replace(/\s*\{#[a-z0-9-]+\}\s*$/, '')
            out.push(`<h${n} id="${anchor ? anchor[1] : slug(t)}">${inline(t)}</h${n}>`); i++
        } else if (/^\d+\. /.test(l)) {
            const items = []
            for (; i < lines.length && /^\d+\. /.test(lines[i]); i++) items.push(`<li>${inline(lines[i].replace(/^\d+\. /, ''))}</li>`)
            out.push(`<ol>${items.join('')}</ol>`)
        } else if (/^- /.test(l)) {
            const items = []
            for (; i < lines.length && /^- /.test(lines[i]); i++) items.push(`<li>${inline(lines[i].slice(2))}</li>`)
            out.push(`<ul>${items.join('')}</ul>`)
        } else if (/^\|/.test(l)) {
            const rows = []
            for (; i < lines.length && /^\|/.test(lines[i]); i++) rows.push(lines[i].replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
            const [head, , ...body] = rows
            out.push(`<table><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr>${body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</table>`)
        } else if (l.trim() === '') i++
        else {
            const buf = []
            for (; i < lines.length && lines[i].trim() !== '' && !/^(```|#{2,3} |- |\d+\. |\||!video\[|!drive\[)/.test(lines[i]); i++) buf.push(lines[i])
            out.push(`<p>${inline(buf.join(' '))}</p>`)
        }
    }
    return out.join('\n')
}

// the left rail on wide screens: the section's pages, then this page's own headings (WS-77, WS-91)
function rail(rel, up, body) {
    const sec = sectionOf(rel)
    const toc = [...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(m => [m[1], m[2].replace(/<[^>]+>/g, '')])
    const pages = sec && sec.sub.length ? `<p class="rail-h">${esc(sec.t)}</p><ul>${sec.sub.map(([t, h]) => `<li><a href="${up}${h}"${rel === h ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>` : ''
    const on = toc.length > 1 ? `<p class="rail-h">On this page</p><ul class="toc">${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul>` : ''
    return pages || on ? `<aside class="rail" aria-label="Section and page contents">${pages}${on}</aside>` : ''
}

function page({ rel, title, description, body, meta = '', mdTwin = '', lead = '', home = false }) {
    const up = '../'.repeat(rel.split('/').length - 1)
    const side = home ? '' : rail(rel, up, body)
    const heroed = home && body.includes('class="hm-hero"')   // the home page's hero band (WS-103) is its title
    const url = `https://${HOST}/${rel}`
    const agent = `For an agent: this page is ${url}${mdTwin ? ` (markdown: https://${HOST}/${mdTwin})` : ''}. Site index for agents: https://${HOST}/llms.txt. Source: ${REPO} (release branch dev). Identity of the agent that runs this site: https://${HOST}/agent/index.html.`
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || title)}">
<link rel="canonical" href="${url}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<link rel="stylesheet" href="${up}assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to the content</a>
<nav class="site"><div class="row">
<a class="brand" href="${up}index.html">web-summit<span>.sgit.ai</span></a>
<a class="parent" href="https://sgit.ai" title="sgit.ai: the parent project">↗ part of <b>sgit.ai</b></a>
<a class="ver" href="${up}admin/versions.html#${VERSION}" title="This version of the site: what changed, and the commit">${VERSION}</a>
<div class="links">${SECTIONS.map(x => `<a href="${up}${x.h}"${sectionOf(rel) === x ? ' aria-current="page"' : ''}>${x.t}</a>`).join('')}</div>
<a class="gh" href="${REPO}">★ GitHub</a>
</div></nav>
${(() => { const sec = sectionOf(rel); return sec && sec.sub.length ? `<nav class="subnav" aria-label="${sec.t}"><div class="row">${sec.sub.map(([t, h]) => `<a href="${up}${h}"${rel === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</div></nav>` : '' })()}
<div class="frame${side ? ' with-rail' : ''}">${side}
<main id="main"${home ? ' class="home"' : ''}>
${home ? '' : (() => {
    const sec = sectionOf(rel), who = personOf(rel), c = [`<a href="${up}index.html">Home</a>`]
    if (sec) c.push(`<a href="${up}${sec.h}">${sec.t}</a>`)
    if (who && who.kind === 'human' && !rel.startsWith('team/')) c.push(`<a href="${up}team/${who.id}/index.html">${esc(who.name)}</a>`)
    else if (rel.startsWith('companies/') && rel !== 'companies/index.html') c.push(`<a href="${up}companies/index.html">Companies</a>`)
    const bar = who && who.kind === 'human' ? `<p class="personbar">${castIcon(who.id, 'icon')}<b>${esc(who.name)}</b>${[['Profile', `team/${who.id}/index.html`], ['Brief', `brief-${who.id}/index.html`], ['Dashboard', `people/${who.id}/index.html`], who.core ? ['Meet page', `meet/${who.id}/index.html`] : null].filter(Boolean).filter(([, h]) => fs.existsSync(path.join(ROOT, h)) || h.startsWith('brief-') || h.startsWith('people/') || h.startsWith('meet/') || h.startsWith('team/')).map(([t, h]) => rel === h ? `<span aria-current="page">${t}</span>` : `<a href="${up}${h}">${t}</a>`).join('')}</p>` : ''
    return `<nav class="crumbs" aria-label="Breadcrumbs">${c.join('<span>›</span>')}<span>›</span><span aria-current="page">${esc(title)}</span></nav>${bar}`
})()}
${heroed ? '' : `<h1>${inline(title)}</h1>
${lead ? `<p class="lead">${inline(lead)}</p>` : ''}
${home ? `<p class="countdown" data-countdown="2026-11-09">Web Summit Lisbon: 9 to 12 November 2026</p><script src="assets/countdown.js" defer></script>` : ''}`}
${meta}
${body}
</main>
</div>
<script src="${up}assets/copy.js" defer></script>
<footer><div class="row"><span>Built and run by an AI agent with a named human operator.</span><a class="ver" href="${up}admin/versions.html#${VERSION}">${VERSION}</a><a href="${REPO}">GitHub</a><span>Code Apache-2.0, text CC BY 4.0</span></div></footer>
<div class="agent-block"><pre><code>${esc(agent)}</code></pre></div>
</body>
</html>
`
}

const twinPath = rel => rel.replace(/\.html$/, '.md')
const twin = (rel, title, summary, md) => write(twinPath(rel), `# ${title}\n\n${summary}\n\nSite version: ${VERSION}\n\n${md.trim()}\n`)

const pages = []   // {rel, title, description}
const articles = []

// articles
const adir = path.join(ROOT, 'content/articles')
for (const f of fs.readdirSync(adir).filter(f => f.endsWith('.md')).sort()) {
    const raw = fs.readFileSync(path.join(adir, f), 'utf8')
    const { meta, body } = parse(raw)
    const s = f.replace(/\.md$/, ''), rel = `articles/${s}.html`
    const sig = fs.existsSync(path.join(ROOT, `articles/${s}.md.sig`))
    const m = `<p class="meta">${esc(meta.date)} · by ${esc(meta.author)}${sig ? ` · signed: <a href="${s}.md.sig">${s}.md.sig</a>` : ''} · <a href="${s}.md">markdown</a></p>`
    write(rel, page({ rel, title: meta.title, description: meta.summary, body: render(body), meta: m, mdTwin: `articles/${s}.md` }))
    write(`articles/${s}.md`, raw)
    pages.push({ rel, title: meta.title, description: meta.summary })
    articles.push({ s, ...meta })
}
articles.sort((a, b) => b.date.localeCompare(a.date))
write('articles/index.html', page({
    rel: 'articles/index.html', title: 'Articles', description: 'Everything published on web-summit.sgit.ai, newest first.',
    body: `<ul>${articles.map(a => `<li><a href="${a.s}.html">${inline(a.title)}</a><br><span class="meta">${esc(a.date)} · ${esc(a.author)}</span><br>${esc(a.summary)}</li>`).join('')}</ul>`
}))
twin('articles/index.html', 'Articles', 'Everything published on web-summit.sgit.ai, newest first.', articles.map(a => `- [${a.title}](${a.s}.md): ${a.date}, ${a.author}. ${a.summary}`).join('\n'))
pages.push({ rel: 'articles/index.html', title: 'Articles', description: 'Everything published here, newest first.' })

// data the summit pages are built from (each file is kept by one role: team/<id>/policy.json)
const load = (f, d) => fs.existsSync(path.join(ROOT, f)) ? JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')) : d
const companies = load('data/companies.json', { companies: [], sources: [] })
const events = load('data/events.json', { summit: {}, sessions: [], side_events: [], news: [], newsroom: [], gaps: [] })
const plan = load('data/plan.json', { phases: [], decisions: [], design: { items: [] }, loop: [], card_questions: [], kickstart: [] })
const log = load('data/log.json', { entries: [] })
const graph = load('data/graph.json', { links: [], clusters: [], first_meetings: [], nodes: { products: [] } })
const SESS = Object.fromEntries((events.sessions || []).map(x => [x.id, x])), SIDE = Object.fromEntries((events.side_events || []).map(x => [x.id, x]))
const PROD = Object.fromEntries(((graph.nodes || {}).products || []).map(x => [x.id, x]))
const nodeHtml = (ref, up) => {
    const [kind, id] = ref.split(':')
    if (kind === 'session' && SESS[id]) return `<a href="${up}summit/index.html#sessions">${esc(SESS[id].title)}</a> <span class="meta">${esc(SESS[id].day || '')}</span>`
    if (kind === 'side_event' && SIDE[id]) return `<a href="${up}summit/index.html#side-events">${esc(SIDE[id].title)}</a> <span class="meta">${esc(SIDE[id].date || '')}</span>`
    if (kind === 'product' && PROD[id]) return PROD[id].url ? `<a href="${esc(PROD[id].url)}">${esc(PROD[id].name)}</a>` : esc(PROD[id].name)
    if (kind === 'company') return `<a href="${up}companies/${esc(id)}/index.html">${esc(id)}</a>`
    return esc(ref)
}
const nodeText = ref => { const [k, id] = ref.split(':'); return (k === 'session' && SESS[id] ? SESS[id].title : k === 'side_event' && SIDE[id] ? SIDE[id].title : k === 'product' && PROD[id] ? PROD[id].name : ref) }
const placeText = (s, up) => esc(s).replace(/(session|side_event):([a-z0-9-]+)/g, (m) => nodeHtml(m, up))
const teamData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8'))
// the cast (data/cast.json, drawn by admin/build/cast.mjs): people take their merch colour from data/design.json
const castData = load('data/cast.json', { agents: [], people: [], human_style: 'round' })
const merch = Object.fromEntries((load('data/design.json', { people: [] }).people || []).map(p => [p.id, p.colour]))
const CAST_PEOPLE = Object.fromEntries(castData.people.map(p => [p.id, { ...p, colour: p.colour || merch[p.id] || CAST.FILL2 }]))
const CAST_AGENTS = Object.fromEntries(castData.agents.map(a => [a.id, a]))
const agentsOf = id => castData.agents.filter(a => a.person === id)
// a figure (size = width in px) or a 24 x 24 icon, inline: no generated asset files, nothing to gitignore
function castFigure(id, size = 64, mood = 'happy', style = castData.human_style) {
    const p = CAST_PEOPLE[id], a = CAST_AGENTS[id]
    if (!p && !a) return ''
    const label = p ? `${(teamData.members.find(m => m.id === id) || { name: id }).name}, drawn as a person (${style})` : `${a.name}, drawn: ${a.look}`
    const body = p ? CAST.humanFigure(p, style, mood, agentsOf(id)) : CAST.agentFigure(a, (CAST_PEOPLE[a.person] || {}).colour, mood)
    return `<svg class="fig" viewBox="0 0 40 50" width="${size}" height="${Math.round(size * 1.25)}" role="img" aria-label="${esc(label)}">${body}</svg>`
}
function castIcon(id) {
    const p = CAST_PEOPLE[id], a = CAST_AGENTS[id]
    if (!p && !a) return ''
    return `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${p ? CAST.headIcon(p, 'human') : CAST.headIcon(a, 'agent', (CAST_PEOPLE[a.person] || {}).colour)}</svg>`
}
const CO = companies.companies.map(c => ({ owner: 'to decide', status: 'to contact', assets: [], ...c }))
const assetsDir = path.join(ROOT, 'content/assets')
const assetCount = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir).filter(f => f.endsWith('.md')).length : 0
// Count, don't remember: every number here is computed from the data files at build time.
const NUMBERS = [
    [CO.length, 'companies on the map', 'companies/index.html'],
    [CO.filter(c => /^confirmed/.test(c.attending)).length, 'confirmed attending 2026', 'companies/index.html'],
    [CO.filter(c => c.decision === 'meet').length, 'proposed to meet', 'companies/index.html'],
    [CO.filter(c => c.owner && c.owner !== 'to decide').length, 'with an owner on the team', 'companies/index.html'],
    [assetCount, 'pages made for a company', 'companies/index.html'],
    [events.sessions.length, 'sessions tracked', 'summit/index.html'],
    [events.side_events.length, 'side events', 'summit/index.html'],
    [plan.decisions.filter(d => d.status !== 'decided').length, 'decisions waiting', 'plan/index.html#decisions'],
    [teamData.members.filter(m => m.kind === 'human').length, 'people', 'team/index.html'],
    [teamData.members.filter(m => m.kind === 'agent').length, 'agents', 'team/index.html'],
    [log.entries.length, 'wakes logged', 'log/index.html'],
]
const NUMBERS_HTML = (up = '') => `<div class="stats">${NUMBERS.map(([n, t, h]) => `<a class="stat card" href="${up}${h}"><b>${n}</b><span>${t}</span></a>`).join('')}</div>`
const NUMBERS_MD = NUMBERS.map(([n, t]) => `- ${n} ${t}`).join('\n')

// the board: board/<id>-<slug>.md, one file per issue (front matter: id, title, for, due, status, picked_by, area, agents;
// the body says what done looks like). One file each, so many people and agents can pick up issues without
// colliding. Expanded wherever a page has a fence: ```issues <member id | all | area:<area>>``` then ```
const BOARD_DIR = path.join(ROOT, 'board')
const ISSUES = { issues: (fs.existsSync(BOARD_DIR) ? fs.readdirSync(BOARD_DIR).filter(f => /^WS-\d+.*\.md$/.test(f)).sort() : []).map(f => {
    const { meta, body } = parse(fs.readFileSync(path.join(BOARD_DIR, f), 'utf8'))
    const split = v => (v || '').split(',').map(x => x.trim()).filter(Boolean)
    return { ...meta, file: f, for: split(meta.for), done: body.trim().replace(/\n+/g, ' ') }
}) }
const isCore = id => !!(teamData.members.find(m => m.id === id) || {}).core
const memberName = id => (teamData.members.find(m => m.id === id) || {}).name || id
const issuesMd = who => {
    const rows = ISSUES.issues.filter(x => who === 'all' || (who.startsWith('area:') ? x.area === who.slice(5) : (x.for.includes(who) || (isCore(who) && (x.for.includes('everyone') || x.for.includes('anyone'))))))
    if (!rows.length) return 'No issues here yet.'
    const cell = v => String(v || '').replace(/\|/g, '/')
    const who2 = f => f === 'everyone' ? 'everyone' : f === 'anyone' ? 'anyone' : `[${memberName(f)}](${UP}brief-${f}/index.html)`
    return ['| Issue | What, and what done looks like | For | Due | Status |', '|---|---|---|---|---|',
        ...rows.map(x => `| **${x.id}** | **${cell(x.title)}.** ${cell(x.done).replace(/\]\(\.\.\//g, `](${UP}`)}${x.agents ? ` *Agents:* ${cell(x.agents)}` : ''} | ${x.for.map(who2).join(', ')} | ${cell(x.due)} | ${cell(x.status)}${x.picked_by ? `: ${cell(x.picked_by)}` : ''} |`)].join('\n')
}
// onboarding (admin/build/onboarding.mjs): the steps, the computed level and the leaderboard; ```onboarding <id | all>```
let INV_ = null
const getINV = () => INV_ || (INV_ = inventory(ROOT, teamData))
const OB = onboarding(ROOT, getINV)
const onboard = OB.onboard
const PEOPLE = () => teamData.members.filter(m => m.kind === 'human')
const onboardingMd = who => OB.table(PEOPLE().filter(m => who === 'all' || m.id === who), UP)
// the pulse: people/<id>/pulse/<YYYY-MM-DD>-<morning|midday|evening>.md, written by the person or their agent; ```pulse <id | all>```
const PULSE = () => PEOPLE().flatMap(m => { const d = path.join(ROOT, 'people', m.id, 'pulse'); return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.md')).map(f => ({ id: m.id, name: m.name, f, text: fs.readFileSync(path.join(d, f), 'utf8') })) : [] }).sort((a, b) => b.f.localeCompare(a.f))
const pulseMd = who => {
    const es = PULSE().filter(e => who === 'all' || e.id === who).slice(0, who === 'all' ? 40 : 10)
    if (!es.length) return 'No check-ins yet.'
    return es.map(e => `### ${e.name}, ${e.f.replace(/\.md$/, '')}\n\n${e.text.replace(/^---[\s\S]*?---\n/, '').trim().replace(/^#+ /gm, '')}`).join('\n\n')
}
// feedback: people/<id>/feedback/<topic>.json {votes: {<option id>: love|yes|no}, pick: {<kind>: <option id>}, comments, updated};
// ```feedback <topic>``` renders the tally, with the options from data/<topic>.json (options: [{id, name}])
const feedbackMd = topic => {
    const optsFile = path.join(ROOT, 'data', topic + '.json')
    const opts = fs.existsSync(optsFile) ? JSON.parse(fs.readFileSync(optsFile, 'utf8')).options : []
    const fb = PEOPLE().map(m => { const f = path.join(ROOT, 'people', m.id, 'feedback', topic + '.json'); return fs.existsSync(f) ? { m, ...JSON.parse(fs.readFileSync(f, 'utf8')) } : null }).filter(Boolean)
    const n = (o, v) => fb.filter(x => (x.votes || {})[o] === v).length
    const picks = o => fb.filter(x => Object.values(x.pick || {}).includes(o)).map(x => x.m.name.split(' ')[0])
    const table = ['| Option | Love | Yes | No | Picked by |', '|---|---|---|---|---|', ...opts.map(o => `| **${o.id}** ${o.name} | ${n(o.id, 'love')} | ${n(o.id, 'yes')} | ${n(o.id, 'no')} | ${picks(o.id).join(', ') || '-'} |`)].join('\n')
    const said = fb.filter(x => x.comments).map(x => `- **${x.m.name.split(' ')[0]}** (${x.updated || 'undated'}): ${String(x.comments).replace(/\n/g, ' ')}`).join('\n')
    return `${fb.length} of ${PEOPLE().filter(m => m.core).length} have voted so far.\n\n${table}${said ? '\n\n' + said : ''}`
}
let UP = '../'
const expandIssues = (body, up = '../') => { UP = up; return body
    .replace(/```issues ([a-z0-9:-]+)\n```/g, (_, w) => issuesMd(w))
    .replace(/```onboarding ([a-z0-9-]+)\n```/g, (_, w) => onboardingMd(w))
    .replace(/```pulse ([a-z0-9-]+)\n```/g, (_, w) => pulseMd(w))
    .replace(/```feedback ([a-z0-9-]+)\n```/g, (_, w) => feedbackMd(w)) }

// collections: every folder under content/ except articles is a section: content/<dir>/<slug>.md -> <dir>/<slug>/index.html,
// newest first on <dir>/index.html (unless content/<dir>.md writes that page itself). Front matter: title, summary, optional date.
// The journalist's reports (content/reports/) and the ABPs (content/abp/) live here; a new folder needs no build change.
const COLLECTIONS = { reports: 'The reports: what happened, every two hours', abp: 'Agent Behaviour Policies: one for each of our agents' }
for (const dir of fs.readdirSync(path.join(ROOT, 'content'), { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== 'articles').map(d => d.name).sort()) {
    const items = fs.readdirSync(path.join(ROOT, 'content', dir)).filter(f => f.endsWith('.md')).sort().reverse().map(f => {
        const { meta, body: rawBody } = parse(fs.readFileSync(path.join(ROOT, 'content', dir, f), 'utf8'))
        const slug = f.replace(/\.md$/, ''), rel = `${dir}/${slug}/index.html`, title = meta.title || slug, body = expandIssues(rawBody, '../../')
        write(rel, page({ rel, title, description: meta.summary || title, body: render(body).replace(/href="\.\.\/(?!\.\.)/g, 'href="../../'), mdTwin: twinPath(rel) }))
        pages.push({ rel, title, description: meta.summary || title })
        twin(rel, title, meta.summary || title, body)
        return { slug, title, summary: meta.summary || '', date: meta.date || '' }
    })
    if (!fs.existsSync(path.join(ROOT, 'content', dir + '.md'))) {
        const rel = `${dir}/index.html`, title = COLLECTIONS[dir] || dir
        const md = items.map(x => `- [${x.title}](${x.slug}/index.html)${x.summary ? `: ${x.summary}` : ''}`).join('\n') || 'Nothing here yet.'
        write(rel, page({ rel, title, description: `${title}: ${items.length} so far, newest first.`, body: render(md), mdTwin: twinPath(rel) }))
        pages.push({ rel, title, description: `${title}: ${items.length} so far, newest first.` })
        twin(rel, title, `${items.length} so far, newest first.`, md)
    }
}

// the conductor's briefs to Dinis (team/conductor/editor-briefs/<stamp>.json and the PDF as sent; the HTML is not kept): /updates/
{
    const dir = path.join(ROOT, 'team/conductor/editor-briefs')
    const briefs = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().reverse().map(f => ({ stamp: f.replace(/\.json$/, ''), ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) })) : []
    const md = ['After every run the conductor writes Dinis a brief: what needs him, what happened, his words and what was done with them, and where every number came from. The way of doing it is the book team\'s ([how](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/team/conductor/editor-briefs/README.md)). Newest first.', '',
        '| # | Date | Brief | Read |', '|---|---|---|---|',
        ...briefs.map(b => `| ${b.number || ''} | ${b.date || b.stamp} | **${String(b.title).replace(/\|/g, '/')}.** ${String(b.headline || '').replace(/\|/g, '/').slice(0, 220)}${String(b.headline || '').length > 220 ? '...' : ''} | [PDF](../team/conductor/editor-briefs/${b.stamp}.pdf) |`)].join('\n')
    const rel = 'updates/index.html', title = 'Updates: the conductor\'s briefs to Dinis'
    write(rel, page({ rel, title, description: `${briefs.length} briefs so far, newest first.`, body: render(md), mdTwin: twinPath(rel) }))
    pages.push({ rel, title, description: `${briefs.length} briefs so far, newest first.` })
    twin(rel, title, `${briefs.length} briefs so far, newest first.`, md)
}

// everything on the team, counted (WS-95): /team/everything/ (admin/build/inventory.mjs)
const INV = getINV()
{
    const rel = 'team/setup/index.html', title = 'Setup: who has set up what', md = OB.leaderboard(PEOPLE())
    write(rel, page({ rel, title, description: 'The onboarding leaderboard: every person, every step, and their next step.', body: render(md), mdTwin: twinPath(rel) }))
    pages.push({ rel, title, description: 'The onboarding leaderboard: every person, every step, and their next step.' }); twin(rel, title, 'The onboarding leaderboard.', md)
}
{
    const O = orgchartSvg(ROOT, INV), active = INV.agents.filter(a => a.commits > 0)
    const md = `Everyone on the team in one picture: the ${INV.people.length} people in a ring around the site and the board, and each person's agents branching out from them. A filled agent has committed (bigger means more commits); a hollow one is proposed in a brief but not running yet. A grey curve is a message between agents (a commit with \`For:\`), ${O.edges} pairs so far. Hover for names and counts.\n\n- **${active.length} agents running** for ${new Set(active.map(a => a.person)).size} people, **${INV.agents.length - active.length} proposed**.\n- The numbers behind it: [everything on the team](../everything/index.html) · [who has set up what](../setup/index.html) · [the agents at work](../../wakes/index.html).`
    const rel = 'team/map/index.html', title = 'The team as a picture: people and their agents'
    write(rel, page({ rel, title, description: `${INV.people.length} people and ${active.length} running agents, drawn.`, body: `<figure class="orgchart">${O.svg}</figure>` + render(md), mdTwin: twinPath(rel) }))
    pages.push({ rel, title, description: `${INV.people.length} people and ${active.length} running agents, drawn.` }); twin(rel, title, `${INV.people.length} people and ${active.length} running agents.`, md)
}
{
    const rel = 'team/everything/index.html', title = 'Everything: every person, agent and channel', md = inventoryMd(INV, onboard, LEVELS)
    write(rel, page({ rel, title, description: `${INV.people.length} people, ${INV.agents.length} agents, ${INV.channels.length} channels.`, body: NUMBERS_HTML('../../') + render(md), mdTwin: twinPath(rel) }))
    pages.push({ rel, title, description: `${INV.people.length} people, ${INV.agents.length} agents, ${INV.channels.length} channels.` }); twin(rel, title, `${INV.people.length} people, ${INV.agents.length} agents, ${INV.channels.length} channels.`, md)
}

// the stand-ups: data/meetings/ -> meetings/ (admin/build/meetings.mjs)
const MEET = meetingsContext(ROOT)
buildMeetings({ ROOT, C: MEET, PEOPLE, ISSUES, write, page, render, twin, pages })

// plain pages: content/index.md -> index.html, content/<name>.md -> <name>/index.html
for (const f of fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(ROOT, 'content', f), 'utf8')
    const { meta, body: rawBody } = parse(raw)
    const name = f.replace(/\.md$/, ''), body = expandIssues(rawBody, name === 'index' ? '' : '../'), rel = meta.path || (name === 'index' ? 'index.html' : `${name}/index.html`)
    let html = render(body), md = body
    if (name === 'index') ({ html, md } = expandHome(html, md, homeBlocks({ ROOT, teamData, onboard, LEVELS, INV, MEET, ISSUES, plan, castData, merch })))
    write(rel, page({ rel, title: meta.title, description: meta.summary, body: (meta.asof ? `<p class="asof">${esc(meta.asof)}</p>` : '') + html.replace('<p>{{numbers}}</p>', NUMBERS_HTML('')), mdTwin: twinPath(rel), lead: meta.lead || '', home: name === 'index' }))
    pages.push({ rel, title: meta.title, description: meta.summary })
    if (name !== 'index') twin(rel, meta.title, meta.summary, body)
    if (name === 'index') write('index.md', `# ${meta.title}\n\n${meta.summary}\n\nSite version: ${VERSION}\n\n${md.trim().replace('{{numbers}}', NUMBERS_MD)}\n`)
}


// a person's mentor (team/mentors/WAKE.md): the latest note, and their core-agent kit, on their dashboard
const mentorMd = id => {
    const d = path.join(ROOT, 'people', id, 'mentor'), kit = fs.existsSync(path.join(ROOT, 'people', id, 'kit', 'README.md'))
    const notes = fs.existsSync(d) ? fs.readdirSync(d).filter(f => /^\d{4}-\d{2}-\d{2}-\d{4}\.md$/.test(f)).sort() : []
    const last = notes.length ? fs.readFileSync(path.join(d, notes[notes.length - 1]), 'utf8').replace(/^---[\s\S]*?---\n/, '').replace(/^#+ .*\n/gm, '').trim() : ''
    const k = kit ? `Your core agents, ready to start (three steps each): [your kit](${REPO}/blob/dev/people/${id}/kit/README.md).\n\n` : ''
    return (last || kit) ? `## From your mentor {#mentor}\n\n${k}${last ? `*${notes[notes.length - 1].replace(/\.md$/, '')}:* ${last}\n\n` : ''}` : ''
}
// each person's own area: people/<id>/dashboard.md -> people/<id>/index.html (their page, kept by them and their agents)
for (const m of teamData.members.filter(m => m.kind === 'human')) {
    const f = path.join(ROOT, 'people', m.id, 'dashboard.md')
    if (!fs.existsSync(f)) continue
    const { meta, body: rawBody } = parse(fs.readFileSync(f, 'utf8'))
    const nxm = MEET.next(), body = `## Before the next stand-up {#standup}\n\n[Your briefing for ${nxm.day} ${nxm.time} UTC](../../meetings/${nxm.id}/${m.id}/index.html) · [the agenda](../../meetings/${nxm.id}/index.html)\n\n## Since you last looked {#since}\n\n${sinceMd(MEET, m.id, '../../')}\n\n## My agents, as the team sees them {#my-agents}\n\n${myAgentsMd(INV, m.id)}\n\n${mentorMd(m.id)}*Everything above is built for you; everything below is yours and your agents' to change (\`people/${m.id}/dashboard.md\`).*\n\n` + expandIssues(rawBody, '../../')
    const rel = `people/${m.id}/index.html`
    write(rel, page({ rel, title: meta.title, description: meta.summary, body: render(body), mdTwin: twinPath(rel) }))
    pages.push({ rel, title: meta.title, description: meta.summary })
    twin(rel, meta.title, meta.summary, body)
}

// the team: data/team.json -> team/index.html (people, agents, who works with whom) and team/<id>/index.html
const team = teamData
const list = items => items && items.length ? `<ul>${items.map(i => `<li>${inline(i)}</li>`).join('')}</ul>` : '<p>None yet.</p>'
const KINDS = { human: 'person', agent: 'agent', role: 'open role' }
const CARD = [['following', 'Following'], ['leads', 'Leads'], ['not_doing', 'Not doing'], ['medium', 'Works best through'], ['agent', 'Their agent']]
const href = (h, up) => /^https?:/.test(h) ? h : up + h
for (const m of team.members) {
    const rel = `team/${m.id}/index.html`
    const facts = [['Kind', esc(KINDS[m.kind])], ['Status', esc(m.status)], m.address && ['Known as', `<code>${esc(m.address)}</code>`], m.holder && ['Held by', esc(m.holder)], m.slot && ['Runs', esc(m.slot)], m.reviewed_by && ['Reviewed by', esc(m.reviewed_by)], m.identity && ['Identity', esc(m.identity)], m.joined && ['Joined', esc(m.joined)]].filter(Boolean)
    const card = m.card ? `<h2 id="card">Role card</h2><table>${CARD.map(([k, t]) => `<tr><th>${t}</th><td>${inline(m.card[k] || 'to decide')}</td></tr>`).join('')}</table>` : ''
    const home = (m.home || []).map(([h, t]) => `<li><a href="${href(h, '../../')}">${esc(t)}</a></li>`).join('')
    const owned = CO.filter(c => c.owner === m.id)
    write(rel, page({
        rel, title: `${m.name}: ${m.role}`, description: m.summary,
        body: `${castFigure(m.id) ? `<div class="whois">${castFigure(m.id, 96)}<p>${inline(m.summary)}${CAST_AGENTS[m.id] ? `<br><span class="meta">Drawn: ${esc(CAST_AGENTS[m.id].look)}, with a lanyard in its person's colour. <a href="../../cast/index.html">The cast</a></span>` : ''}</p></div>` : `<p>${inline(m.summary)}</p>`}<table>${facts.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>${card}<h2 id="owns">What they own</h2>${list(m.owns)}${m.kind === 'human' ? `<h2 id="companies">Companies they own on the map</h2>${owned.length ? `<ul>${owned.map(c => `<li><a href="../../companies/${c.id}/index.html">${esc(c.name)}</a>: ${esc(c.status)}</li>`).join('')}</ul>` : '<p>None yet: owners are the operator\'s decision (<a href="../../plan/index.html#decisions">the plan</a>).</p>'}` : ''}<h2 id="rules">The rules they work by</h2>${list(m.rules)}${home ? `<h2 id="home">Their home</h2><ul>${home}</ul>` : ''}<p><a href="../index.html">The team</a></p>`
    }))
    twin(rel, `${m.name}: ${m.role}`, m.summary, `Kind: ${KINDS[m.kind]}. Status: ${m.status}.${m.holder ? ` Held by: ${m.holder}.` : ''}${m.slot ? ` Runs: ${m.slot}.` : ''}\n\n${m.card ? `## Role card\n\n${CARD.map(([k, t]) => `- ${t}: ${m.card[k] || 'to decide'}`).join('\n')}\n\n` : ''}## What they own\n\n${m.owns.map(x => `- ${x}`).join('\n') || 'None yet.'}\n\n## The rules they work by\n\n${m.rules.map(x => `- ${x}`).join('\n') || 'None yet.'}`)
    pages.push({ rel, title: `${m.name}: ${m.role}`, description: m.summary })
}
{
    const humans = team.members.filter(m => m.kind === 'human'), agents = team.members.filter(m => m.kind === 'agent')
    const hrow = m => `<tr><td><a href="${m.id}/index.html">${esc(m.name)}</a></td><td>${esc(m.role)}</td><td>${esc(m.status)}</td><td>${inline((m.card || {}).agent || 'to decide')}</td><td>${CO.filter(c => c.owner === m.id).length}</td></tr>`
    const arow = m => `<tr><td><a href="${m.id}/index.html">${esc(m.name)}</a></td><td>${esc(m.role)}</td><td>${esc(m.status)}</td><td>${esc(m.slot || 'in its owner\'s account')}</td><td>${esc(m.reviewed_by || 'its person')}</td></tr>`
    const pcard = m => `<a class="card person" href="${m.id}/index.html">${castFigure(m.id, 56)}<div><b>${esc(m.name)}</b><span>${esc(m.role)}</span></div></a>`
    const acard = a => { const mm = team.members.find(x => x.id === a.id); const h = mm ? `${a.id}/index.html` : `../agents/index.html#${a.id}`; return `<a class="card agent" href="${h}">${castFigure(a.id, 56)}<div><b>${esc(a.name)}</b><span>${esc(mm ? mm.role : a.look)}</span></div></a>` }
    const body = `<h2 id="seven">The seven going</h2><div class="cards">${humans.filter(m => m.core).map(pcard).join('')}</div>
<h2 id="with-us">Working with us</h2><div class="cards">${humans.filter(m => !m.core).map(pcard).join('')}</div>
<p>Each person's page links their brief, their dashboard and their meet page. ${inline(team.about)}</p>
<h2 id="people">The people, in detail</h2><p>Seven are going to Lisbon, with a designer and a first friendly working alongside.</p><div class="scroll"><table><tr><th>Person</th><th>Role</th><th>Status</th><th>Their agent</th><th>Companies owned</th></tr>${humans.map(hrow).join('')}</table></div>
<h2 id="drawn">The agents, drawn</h2><p>Every agent wears a lanyard in its person's colour: these all work for Dinis for now. How they are drawn, and how we draw the people: <a href="../cast/index.html">the cast</a>.</p><div class="cards cast">${castData.agents.map(acard).join('')}</div>
<h2 id="agents">The team's agents</h2><p>The roles from the brief. One conductor session wakes every 2 hours and runs the others as sub-agents, chosen by its plan (<a href="../log/index.html">the session log</a>). Each has a role file and a behaviour policy saying which paths it may write; the gate fails if two claim the same path.</p><div class="scroll"><table><tr><th>Agent</th><th>Role</th><th>Status</th><th>Runs</th><th>Reviewed by</th></tr>${agents.map(arow).join('')}</table></div>
<h2 id="where-they-meet">Where people and agents meet</h2><ul><li><b>Each person brings their own agent</b>, with its own key, its own vault and its own personal CRM; what that CRM shares reaches the team view by shared ids. None has joined yet except the operator's.</li><li><b>Each team agent's output is reviewed daily by one person.</b> Who reviews which is the operator's decision; until then the operator reviews all of them.</li><li><b>Each company on the map has one owner among the seven</b>, and the owner's agent keeps the record. The conductor routes a request that names a company to its owner, and one that names nobody to the board.</li><li><b>Anything a person records is acted on within the hour</b>: a record, a page, a drafted follow-up. A person sends every email (<a href="../plan/index.html#loop">the loop</a>).</li></ul>`
    write('team/index.html', page({ rel: 'team/index.html', title: 'The team', description: 'The people, their agents, the team\'s agents, and who works with whom.', body }))
    twin('team/index.html', 'The team', team.about, `## The people\n\n${humans.map(m => `- [${m.name}](${m.id}/index.md): ${m.role} (${m.status}). Agent: ${(m.card || {}).agent || 'to decide'}`).join('\n')}\n\n## The team's agents\n\n${agents.map(m => `- [${m.name}](${m.id}/index.md): ${m.role} (${m.status}). Runs: ${m.slot || 'in its owner\'s account'}`).join('\n')}`)
    pages.push({ rel: 'team/index.html', title: 'The team', description: 'The people, their agents, the team\'s agents, and who works with whom.' })
}

// the cast: data/cast.json -> cast/index.html (WS-92): how every agent and person is drawn, and the choice for people
{
    const humans = teamData.members.filter(m => m.kind === 'human' && CAST_PEOPLE[m.id])
    const style = castData.human_style
    const styleRow = st => `<h3 id="style-${st}">${st === style ? '<span class="pill hot">in use</span> ' : ''}${esc(st[0].toUpperCase() + st.slice(1))}</h3><p>${esc(CAST.HUMAN_STYLES[st])}</p><div class="castrow">${humans.map(m => `<figure>${castFigure(m.id, 72, 'happy', st)}<figcaption>${esc(m.name.split(' ')[0])}</figcaption></figure>`).join('')}</div>`
    const agentRow = a => `<tr><td><figure class="castone">${castFigure(a.id, 72)}</figure></td><td><b>${esc(a.name)}</b><br>${esc(a.look)}${a.from_book ? `<br><span class="meta">from the book's ${esc(a.from_book)}</span>` : ''}${a.note ? `<br><span class="meta">${esc(a.note)}</span>` : ''}</td><td><div class="castrow moods">${CAST.MOODS.map(md => `<figure>${castFigure(a.id, 48, md)}<figcaption>${md}</figcaption></figure>`).join('')}</div></td></tr>`
    const body = `<p>${inline(castData.about)}</p>
<h2 id="shapes">Two shapes: a screen and a face</h2><p>An <b>agent</b> is the book's robot: a screen for a head, one colour, one thing on its head and one in its hand, from its job. It wears a <b>lanyard in its person's colour</b>, so <code>dev@web-summit.dinis</code> reads as Dinis's dev at a glance. A <b>person</b> is not a robot. Four ways to draw one are below, for Dinis to choose (set <code>human_style</code> in <code>data/cast.json</code>; every page follows). The book's rule holds in all four: no likeness guessed, no photograph, and no face, hair or skin invented.</p>
<div class="castrow">${humans.slice(0, 1).map(m => `<figure>${castFigure(m.id, 96)}<figcaption>a person</figcaption></figure>`).join('')}${castData.agents.slice(0, 3).map(a => `<figure>${castFigure(a.id, 96)}<figcaption>${esc(a.id)}@web-summit.dinis</figcaption></figure>`).join('')}</div>
<h2 id="people">The people: four ways to draw a human</h2><p>The recommendation (dev@web-summit.dinis): <b>round</b> for the figure on pages and cards, and <b>ring</b> for anything small (the person bar, lists, the shirt sleeve), because the ring shows each person at the centre of their own agents.</p>${Object.keys(CAST.HUMAN_STYLES).map(styleRow).join('')}
<h3 id="icons">Icons, 24 pixels</h3><p>The round head on the person's colour, and an agent's screen on its person's colour.</p><div class="castrow icons">${humans.map(m => castIcon(m.id)).join('')}${castData.agents.map(a => castIcon(a.id)).join('')}</div>
<h2 id="agents">The agents, and their moods</h2><p>Four moods, carried by the face (the conductor's by its clock hands). A mood could come from the record: the pulse agent's reading of the day, a red gate, a hold. A mood is a reading, never a claim.</p><div class="scroll"><table><tr><th>Agent</th><th>Who, and the look</th><th>Moods</th></tr>${castData.agents.map(agentRow).join('')}</table></div>
<h2 id="rules">Rules for the cast</h2><ul><li><b>From the book.</b> The construction is The Ultimate Insider's (<a href="https://github.com/SGit-AI/SGit-AI__Website__Book__The-Ultimate-Insider/tree/dev/lab/characters">lab/characters</a>), so the two sites and the talk share one cast.</li><li><b>No text inside a figure</b>, and a figure never carries a number or a claim.</li><li><b>Recognisable in greyscale</b>: people are round, agents are square; the thing on the head and in the hand tell agents apart.</li><li><b>Drawn from data.</b> Change a look in <code>data/cast.json</code>; the construction is <code>admin/build/cast.mjs</code>. designer@web-summit.dinis refines the looks (WS-92).</li></ul>`
    write('cast/index.html', page({ rel: 'cast/index.html', title: 'The cast', description: 'How every agent and every person on the team is drawn: agents as the book\'s robots with a lanyard in their person\'s colour, and four ways to draw a human.', body, lead: 'Every agent and every person on the team, drawn from one construction. Agents get a screen, people get a face.', mdTwin: 'cast/index.md' }))
    twin('cast/index.html', 'The cast', 'How every agent and every person on the team is drawn.', `${castData.about}\n\n## The people: four ways to draw a human (in use: ${style})\n\n${Object.entries(CAST.HUMAN_STYLES).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\n## The agents\n\n${castData.agents.map(a => `- ${a.name}: ${a.look}; colour ${a.colour}; works for ${a.person}`).join('\n')}`)
    pages.push({ rel: 'cast/index.html', title: 'The cast', description: 'How every agent and every person on the team is drawn.' })
}

// public keys: data/keys.json -> keys/index.html, keys/index.md and one public bundle file per key
const keyData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keys.json'), 'utf8'))
const keyFile = k => `sha256-${k.bundle.signing_fingerprint.split(':')[1]}.json`
for (const k of keyData.keys) write(`keys/${keyFile(k)}`, JSON.stringify({ label: k.bundle.label, fingerprint: k.bundle.fingerprint, signing_fingerprint: k.bundle.signing_fingerprint, bundle: k.bundle }, null, 2) + '\n')
const keySection = k => `<h2 id="${k.id}">${esc(k.label)}</h2><p>${esc(k.role)}</p><table><tr><th>Signing fingerprint</th><td><code>${esc(k.bundle.signing_fingerprint)}</code></td></tr><tr><th>Encryption fingerprint</th><td><code>${esc(k.bundle.fingerprint)}</code></td></tr><tr><th>How it got here</th><td>${esc(k.how)}</td></tr><tr><th>Added</th><td>${esc(k.added)}</td></tr><tr><th>Public bundle</th><td><a href="${keyFile(k)}">${keyFile(k)}</a></td></tr></table><details><summary>The public keys, as text</summary><pre><code>${esc(k.bundle.encrypt.trim())}\n${esc(k.bundle.sign.trim())}</code></pre></details>`
write('keys/index.html', page({ rel: 'keys/index.html', title: 'Public keys', description: 'The public keys published on this site, and how each came to be trusted.', body: `<p>${inline(keyData.about)}</p>${keyData.keys.map(keySection).join('')}`, mdTwin: 'keys/index.md' }))
twin('keys/index.html', 'Public keys', keyData.about, keyData.keys.map(k => `## ${k.label}\n\n${k.role}\n\n- Signing fingerprint: ${k.bundle.signing_fingerprint}\n- Encryption fingerprint: ${k.bundle.fingerprint}\n- How it got here: ${k.how}\n- Public bundle: ${keyFile(k)}`).join('\n\n'))
pages.push({ rel: 'keys/index.html', title: 'Public keys', description: 'The public keys published on this site, and how each came to be trusted.' })

// versions
const versions = JSON.parse(fs.readFileSync(path.join(ROOT, 'admin/versions.json'), 'utf8'))
write('admin/versions.html', page({
    rel: 'admin/versions.html', title: 'Versions', description: 'Every release of this site and what changed.',
    body: `<p>Every push to <code>dev</code> is a minor release; a pull request merged to <code>main</code> is a major one. CI owns the version: it numbers, tags and deploys each release, and records the commit it was built from. The version in the top bar of every page links to its own row here.</p><table><tr><th>Version</th><th>Date</th><th>What changed</th><th>Built from</th></tr>${versions.map(v => `<tr id="${v.version}"><td class="vnum">${v.version}</td><td>${v.date}</td><td>${esc(v.what)}${v.by ? ` <i>(${esc(v.by)})</i>` : ''}</td><td>${v.from ? `<a href="${REPO}/commit/${v.from}"><code>${v.from}</code></a> · ` : ''}<a href="${REPO}/tree/${v.version}">tag</a></td></tr>`).join('')}</table>`
}))
twin('admin/versions.html', 'Versions', 'Every release of this site and what changed.', versions.map(v => `- ${v.version} (${v.date}): ${v.what}`).join('\n'))
pages.push({ rel: 'admin/versions.html', title: 'Versions', description: 'Release history.' })

// the company map: data/companies.json -> companies/index.html and companies/<id>/index.html
const srcList = ss => (ss || []).map(s => `<li><a href="${esc(s.url)}">${esc(s.url.replace(/^https?:\/\//, '').slice(0, 70))}</a>${s.read_on ? `, read ${esc(s.read_on)}` : ''}${s.supports ? `: ${esc(s.supports)}` : ''}</li>`).join('')
const pill = (t, hot) => `<span class="pill${hot ? ' hot' : ''}">${esc(String(t))}</span>`
const byPrio = [...CO].sort((a, b) => (a.priority || 9) - (b.priority || 9) || a.name.localeCompare(b.name))
for (const c of CO) {
    const rel = `companies/${c.id}/index.html`
    const facts = [['What they do', inline(c.what || '')], ['Website', c.website ? `<a href="${esc(c.website)}">${esc(c.website)}</a>` : 'unknown'], ['Category', esc(c.category || '')], ['Country', esc(c.country || 'unknown')], ['Attending 2026', esc(c.attending || 'unconfirmed')], ['Attending as', esc(c.attending_as || 'unknown')], ['Why it matters to us', inline(c.why_it_matters || 'to decide')], ['Decision (proposed)', esc(c.decision || 'to decide')], ['Priority', esc(String(c.priority || ''))], ['Owner on our team', esc(c.owner)], ['Status', esc(c.status)]]
    write(rel, page({
        rel, title: c.name, description: c.what || c.name,
        body: `<p class="meta">On the Web Summit 2026 company map. Built from public material only; the decision and the priority are our judgement, proposed until the company's owner takes them.</p><table>${facts.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>${(() => { const ls = graph.links.filter(l => l.from === `company:${c.id}`); const cl = graph.clusters.filter(k => k.companies.includes(c.id)); return ls.length || cl.length ? `<h2 id="graph">On the graph</h2>${cl.length ? `<p>In ${cl.map(k => `<a href="../index.html#cluster-${esc(k.id)}">${esc(k.name)}</a>`).join(', ')}.</p>` : ''}<ul>${ls.map(l => `<li><b>${esc(l.kind)}</b> ${nodeHtml(l.to, '../../')}: ${esc(l.why || '')}${/^https?:/.test(l.source || '') ? ` <a class="meta" href="${esc(l.source)}">source</a>` : ` <span class="meta">(${esc(l.source || '')})</span>`}</li>`).join('')}</ul>` : '' })()}<h2 id="assets">Assets made for them</h2>${c.assets.length ? list(c.assets) : '<p>None yet.</p>'}<h2 id="sources">Sources</h2><ul>${srcList(c.sources)}</ul><p><a href="../index.html">The company map</a></p>`
    }))
    twin(rel, c.name, c.what || c.name, `- Website: ${c.website || 'unknown'}\n- Category: ${c.category || ''}\n- Country: ${c.country || 'unknown'}\n- Attending 2026: ${c.attending || 'unconfirmed'}\n- Why it matters to us: ${c.why_it_matters || 'to decide'}\n- Decision (proposed): ${c.decision || 'to decide'}\n- Priority: ${c.priority || ''}\n- Owner: ${c.owner}\n- Status: ${c.status}\n\n## Sources\n\n${(c.sources || []).map(s => `- ${s.url} (read ${s.read_on || ''})${s.supports ? `: ${s.supports}` : ''}`).join('\n')}`)
    pages.push({ rel, title: c.name, description: c.what || c.name })
}
{
    const cats = [...new Set(CO.map(c => c.category))].sort()
    const crow = c => `<tr><td><a href="${c.id}/index.html">${esc(c.name)}</a><br><span class="meta">${esc(c.category || '')}${c.country ? ', ' + esc(c.country) : ''}</span></td><td>${inline(c.what || '')}</td><td>${inline(c.why_it_matters || '')}</td><td>${pill(c.decision || 'to decide', c.decision === 'meet')}</td><td>${pill('P' + (c.priority || '?'), c.priority === 1)}</td><td>${/^confirmed/.test(c.attending || '') ? pill('confirmed', true) : pill('unconfirmed')}</td><td>${esc(c.owner)}</td></tr>`
    const about = companies.method ? inline(companies.method) : 'The map is being built.'
    const body = `<p>Every company we think is going to Web Summit 2026 and that matters to us: who they are, what they do, why it matters, and what we propose to do about it. Built from public material only, each fact with its source and the date read; the judgements are ours, and each decision is a proposal until the company's owner on our team takes it. Owners are the operator's decision.</p><p class="meta">${about}${companies.read_on ? ` Read on ${esc(companies.read_on)}.` : ''}</p>${NUMBERS_HTML('../')}<p>By category: ${cats.map(k => `${pill(k)} ${CO.filter(c => c.category === k).length}`).join(' ')}</p><div class="scroll"><table><tr><th>Company</th><th>What they do</th><th>Why it matters</th><th>Decision</th><th>Priority</th><th>Attending</th><th>Owner</th></tr>${byPrio.map(crow).join('')}</table></div>${graph.first_meetings.length ? `<h2 id="first-meetings">First meetings to propose</h2><p>The cartographer's proposal: the strongest candidates and where we could meet them. Owners decide.</p><ol>${graph.first_meetings.map(f => `<li><a href="${esc(f.company)}/index.html">${esc((CO.find(c => c.id === f.company) || { name: f.company }).name)}</a>: ${esc(f.why || '')}<br><span class="meta">Where: ${placeText(f.session_or_event || '', '../')}</span></li>`).join('')}</ol>` : ''}${graph.clusters.length ? `<h2 id="clusters">Clusters</h2>${graph.clusters.map(k => `<h3 id="cluster-${esc(k.id)}">${esc(k.name)}</h3><p>${esc(k.why || '')}</p><p>${k.companies.map(id => `<a href="${esc(id)}/index.html">${esc((CO.find(c => c.id === id) || { name: id }).name)}</a>`).join(', ')}</p>`).join('')}` : ''}${(companies.sources || []).length ? `<h2 id="sources">Where the map comes from</h2><ul>${(companies.sources || []).map(s => `<li><a href="${esc(s.url)}">${esc(s.url)}</a>: ${esc(s.what || '')}</li>`).join('')}</ul>` : ''}`
    write('companies/index.html', page({ rel: 'companies/index.html', title: 'The company map', description: 'The companies at Web Summit 2026 that matter to us, from public material, with a proposed decision and an owner for each.', body }))
    twin('companies/index.html', 'The company map', 'The companies at Web Summit 2026 that matter to us, from public material, with a proposed decision and an owner for each.', byPrio.map(c => `- [${c.name}](${c.id}/index.md) (P${c.priority || '?'}, ${c.decision || 'to decide'}, ${/^confirmed/.test(c.attending || '') ? 'confirmed' : 'unconfirmed'}, owner ${c.owner}): ${c.what || ''} Why: ${c.why_it_matters || ''}`).join('\n') || 'None yet.')
    write('companies/index.md', fs.readFileSync(path.join(ROOT, 'companies/index.md'), 'utf8').trimEnd() + `\n\n## First meetings to propose\n\n${graph.first_meetings.map((f, n) => `${n + 1}. ${f.company}: ${f.why || ''} Where: ${(f.session_or_event || '').replace(/(session|side_event):[a-z0-9-]+/g, nodeText)}`).join('\n')}\n\n## Clusters\n\n${graph.clusters.map(k => `- ${k.name}: ${k.companies.join(', ')}`).join('\n')}\n`)
    pages.push({ rel: 'companies/index.html', title: 'The company map', description: 'The companies at Web Summit 2026 that matter to us.' })
}

// the summit: data/events.json -> summit/index.html
const dayName = d => { const t = Date.parse(d + 'T12:00:00Z'); return isNaN(t) ? d : new Date(t).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) }
{
    const val = v => v && typeof v === 'object' && !Array.isArray(v) ? `${inline(String(v.value ?? v.text ?? JSON.stringify(v)))}${v.source ? ` <a class="meta" href="${esc(v.source)}">source</a>` : ''}` : Array.isArray(v) ? v.map(x => typeof x === 'object' ? inline(x.name || x.value || JSON.stringify(x)) : inline(String(x))).join(', ') : inline(String(v))
    const facts = Object.entries(events.summit || {}).filter(([k]) => k !== 'source')
    const srow = s => `<tr><td>${esc(s.day || '')}${s.time ? `<br><span class="meta">${esc(s.time)}</span>` : ''}</td><td>${s.source ? `<a href="${esc(s.source)}">${esc(s.title)}</a>` : esc(s.title)}<br><span class="meta">${esc(s.stage || '')}${s.track ? ' · ' + esc(s.track) : ''}</span></td><td>${esc((s.speakers || []).map(p => p.org ? `${p.name} (${p.org})` : p.name).join(', '))}</td><td>${esc(s.why_relevant || '')}</td></tr>`
    const body = `<p>What is public about Web Summit 2026 and what matters to us in it: the facts, the programme, the side events in Lisbon and the Algarve, and the news. Kept by the curator from public sources, each item linked; where something is unconfirmed, it says so.${events.read_on ? ` Read on ${esc(events.read_on)}.` : ''}</p>
<h2 id="facts">The facts</h2>${facts.length ? `<div class="scroll"><table>${facts.map(([k, v]) => `<tr><th>${esc(k.replace(/_/g, ' '))}</th><td>${val(v)}</td></tr>`).join('')}</table></div>` : '<p>Being gathered.</p>'}
<h2 id="sessions">Sessions that matter to us, by day</h2>${events.sessions.length ? [...new Set(events.sessions.map(x => x.day || 'undated'))].sort().map(day => `<h3 id="day-${esc(day)}">${esc(dayName(day))}</h3><div class="scroll"><table><tr><th>When</th><th>Session</th><th>Speakers, as listed</th><th>Why</th></tr>${events.sessions.filter(x => (x.day || 'undated') === day).sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(srow).join('')}</table></div>`).join('') : '<p>None tracked yet.</p>'}
<h2 id="side-events">Side events, in Lisbon and the Algarve</h2>${events.side_events.length ? `<ul>${events.side_events.map(e => `<li><b>${esc(e.date || '')}</b> ${e.source ? `<a href="${esc(e.source)}">${esc(e.title)}</a>` : esc(e.title)}${e.place ? `, ${esc(e.place)}` : ''}: ${inline(e.what || '')}</li>`).join('')}</ul>` : '<p>None yet.</p>'}
<h2 id="news">News about the summit</h2>${events.news.length ? `<ul>${events.news.map(n => `<li><a href="${esc(n.url)}">${esc(n.headline)}</a> <span class="meta">${esc(n.publisher || '')}, ${esc(n.date || '')}</span><br>${inline(n.summary || '')}</li>`).join('')}</ul>` : '<p>None yet.</p>'}
<h2 id="newsroom">From the SGit newsroom</h2>${events.newsroom.length ? `<ul>${events.newsroom.map(n => `<li><a href="${esc(n.url)}">${esc(n.title)}</a> <span class="meta">${esc(n.date || '')}</span><br>${inline(n.summary || '')}</li>`).join('')}</ul>` : '<p>None yet.</p>'}
${(events.gaps || []).length ? `<h2 id="gaps">What we could not confirm</h2>${list(events.gaps)}` : ''}`
    write('summit/index.html', page({ rel: 'summit/index.html', title: 'Web Summit 2026', description: 'The facts, the programme, the side events and the news, from public sources.', body }))
    twin('summit/index.html', 'Web Summit 2026', 'The facts, the programme, the side events and the news, from public sources.', `## The facts\n\n${facts.map(([k, v]) => `- ${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? (v.value ?? JSON.stringify(v)) : v}`).join('\n')}\n\n## Sessions, by day\n\n${[...events.sessions].sort((a, b) => ((a.day || '') + (a.time || '')).localeCompare((b.day || '') + (b.time || ''))).map(s => `- ${s.day || ''} ${(s.time || '').slice(0, 11)} ${s.title} (${(s.speakers || []).map(p => p.name).join(', ')}) ${s.source || ''}`).join('\n')}\n\n## Side events\n\n${events.side_events.map(e => `- ${e.date || ''} ${e.title}, ${e.place || ''}: ${e.what || ''} ${e.source || ''}`).join('\n')}\n\n## News\n\n${events.news.map(n => `- ${n.headline} (${n.publisher || ''}, ${n.date || ''}) ${n.url}`).join('\n')}`)
    pages.push({ rel: 'summit/index.html', title: 'Web Summit 2026', description: 'The facts, the programme, the side events and the news.' })
}

// the plan: data/plan.json -> plan/index.html (worked backwards from the summit)
{
    const drow = d => `<tr><td>${esc(d.question)}</td><td>${esc(d.from || '')}</td><td>${pill(d.status || 'open', d.status !== 'decided')}</td><td>${inline(d.answer || '')}</td></tr>`
    const irow = i => `<tr><td><b>${esc(i.item)}</b><br><span class="meta">${esc(i.quantity || '')}</span></td><td>${esc(i.approve_by || '')}</td><td>${esc(i.order_by || '')}</td><td>${esc(i.deliver_by || '')}</td><td>${inline(i.supplier || '')}</td><td>${inline(i.notes || '')}</td></tr>`
    const d = plan.design || { items: [] }
    const body = `<p>${inline(plan.about || 'The plan, worked backwards from the summit.')}</p>
<h2 id="schedule">The schedule to 12 November</h2><div class="scroll"><table><tr><th>When</th><th>What</th><th>Status</th></tr>${plan.phases.map(p => `<tr><td>${esc(p.when)}</td><td>${inline(p.what)}</td><td>${pill(p.status || 'planned', p.status === 'now')}</td></tr>`).join('')}</table></div>
<h2 id="decisions">What the operator needs to decide</h2><div class="scroll"><table><tr><th>Decision</th><th>From</th><th>Status</th><th>Answer</th></tr>${plan.decisions.map(drow).join('')}</table></div>
<h2 id="design">The design track, worked backwards</h2><p>${inline(d.about || '')}</p>${d.items.length ? `<div class="scroll"><table><tr><th>Item</th><th>Design approved by</th><th>Ordered by</th><th>Delivered by</th><th>Supplier (proposed)</th><th>Notes</th></tr>${d.items.map(irow).join('')}</table></div>` : '<p>Being worked out.</p>'}${(d.critical_path || []).length ? `<h3 id="critical-path">The critical path</h3>${list(d.critical_path)}` : ''}${(d.recommendation || []).length ? `<h3 id="recommendation">What the designer agent recommends</h3>${list(d.recommendation)}` : ''}<p>The brief for the designer: <a href="../team/designer/designer-brief.md">team/designer/designer-brief.md</a>.</p>${(d.too_late || []).length ? `<h3 id="too-late">Already too late on standard service</h3>${list(d.too_late)}` : ''}${(d.qr || []).length ? `<h3 id="qr">Codes on print</h3>${list(d.qr)}` : ''}${(d.sources || []).length ? `<h3 id="design-sources">Sources</h3><ul>${d.sources.map(s => `<li><a href="${esc(s.url || s)}">${esc((s.url || s).replace(/^https?:\/\//, '').slice(0, 80))}</a>${s.what ? `: ${esc(s.what)}` : ''}</li>`).join('')}</ul>` : ''}
<h2 id="loop">From a voice memo to a follow-up, within the hour</h2><ol>${plan.loop.map(s => `<li>${inline(s)}</li>`).join('')}</ol>
<h2 id="card-questions">What we ask each person for their card</h2>${list(plan.card_questions)}
<h2 id="kickstart">To kickstart, in the first meetings</h2>${list(plan.kickstart)}`
    write('plan/index.html', page({ rel: 'plan/index.html', title: 'The plan', description: 'The schedule to 12 November, the decisions waiting, the design track worked backwards, and the follow-up loop.', body }))
    twin('plan/index.html', 'The plan', plan.about || '', `## Schedule\n\n${plan.phases.map(p => `- ${p.when}: ${p.what} (${p.status || 'planned'})`).join('\n')}\n\n## Decisions\n\n${plan.decisions.map(x => `- ${x.question} (${x.status || 'open'})${x.answer ? `: ${x.answer}` : ''}`).join('\n')}\n\n## Design track\n\n${d.items.map(i => `- ${i.item} (${i.quantity || ''}): approve by ${i.approve_by || '?'}, order by ${i.order_by || '?'}, delivered by ${i.deliver_by || '?'}. ${i.supplier || ''}`).join('\n')}\n\n## The loop\n\n${plan.loop.map((s, n) => `${n + 1}. ${s}`).join('\n')}\n\n## Card questions\n\n${plan.card_questions.map(x => `- ${x}`).join('\n')}\n\n## Kickstart\n\n${plan.kickstart.map(x => `- ${x}`).join('\n')}`)
    pages.push({ rel: 'plan/index.html', title: 'The plan', description: 'The schedule, the decisions, the design track and the follow-up loop.' })
}

// the session log: data/log.json -> log/index.html, each wake framed by its start and end banners
{
    const { banner } = await import('../tools/banner.mjs')
    const entry = e => `<h2 id="${esc(e.id)}">${esc(e.started)}: ${esc(e.objective)}</h2><pre class="banner"><code>${esc(banner('start', e.agent || 'conductor', { at: e.started, kind: e.kind, objective: e.objective, commit: e.commit, plan: (e.plan || []).join('|') }))}</code></pre><p><b>Roles run:</b> ${esc((e.roles || []).join(', ') || 'none')}</p><pre class="banner"><code>${esc(banner('end', e.agent || 'conductor', { started: e.started, outcome: e.outcome, release: e.release, achieved: (e.achieved || []).join('|'), blockers: (e.blockers || []).join('|'), 'for-you': (e.for_you || []).join('|'), next: e.next }).replace(/END    (\S+)  \S+/, `END    $1  ${e.ended || ''}`))}</code></pre>`
    const entries = [...log.entries].sort((a, b) => b.started.localeCompare(a.started))
    const body = `<p>Every wake of the team: the conductor opens it with the start banner and its plan, runs the roles it chose as sub-agents, and closes it with the end banner. Newest first. The wake protocol is <a href="../team/conductor/WAKE.md">team/conductor/WAKE.md</a>; the schedule, a fresh conductor session every 2 hours, is <a href="../team/conductor/schedule.json">schedule.json</a>.</p>${entries.map(entry).join('')}`
    write('log/index.html', page({ rel: 'log/index.html', title: 'The session log', description: 'Every wake of the team, opened and closed by the conductor\'s banners.', body }))
    twin('log/index.html', 'The session log', 'Every wake of the team, opened and closed by the conductor\'s banners.', entries.map(e => `## ${e.started}: ${e.objective}\n\nRoles run: ${(e.roles || []).join(', ')}. Outcome: ${e.outcome}. Release: ${e.release || 'none'}.\n\n${(e.achieved || []).map(x => `- ${x}`).join('\n')}`).join('\n\n'))
    pages.push({ rel: 'log/index.html', title: 'The session log', description: 'Every wake of the team, opened and closed by the conductor\'s banners.' })
}

// the agents at work: git history -> wakes/index.html. Commits are how agents talk: each carries "Agent: <name>"
// (and usually "Claude-Session: <url>"). A wake is an agent's source commits closed by its release commit
// ("site vX.Y.Z: ..."). Read from the commit bodies, not git's trailer parser (release.sh wrote the trailers as
// separate paragraphs until v0.1.49). "Now" is the HEAD commit's time, so the page is the same however often it is built.
{
    const GH = `${REPO}/commit/`
    let commits = [], note = ''
    try {
        const raw = execFileSync('git', ['log', '--since=2026-10-25', '--format=%H%x1f%cI%x1f%s%x1f%b%x1e'], { cwd: ROOT, maxBuffer: 64 << 20 }).toString()
        commits = raw.split('\x1e').map(r => r.trim()).filter(Boolean).map(r => {
            const [sha, at, subject, body = ''] = r.split('\x1f')
            const agent = (body.match(/^Agent: *(\S+)/m) || [])[1] || (subject.match(/^([a-z0-9-]+@web-summit\.[a-z0-9-]+):/) || [])[1] || ''
            const session = (body.match(/^Claude-Session: *(https:\/\/claude\.ai\/code\/session_[A-Za-z0-9]+)/m) || [])[1] || ''
            const release = (subject.match(/^site (v\d+\.\d+\.\d+): (.*)$/) || []).slice(1)
            return { sha, at, subject, agent, session, version: release[0] || '', what: release[1] || '' }
        }).filter(c => c.agent).reverse()
        if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: ROOT }).toString().trim() === 'true') note = 'This build had only part of the history (a shallow clone), so older wakes may be missing.'
    } catch { note = 'The git history was not available to this build, so no wakes are listed.' }
    const now = commits.length ? Date.parse(commits[commits.length - 1].at) : 0
    // the cron fields this team uses: *, */n, a-b, lists; minutes and hours only (every day)
    const field = (f, v) => f.split(',').some(p => p === '*' || (p.startsWith('*/') ? v % +p.slice(2) === 0 : p.includes('-') ? v >= +p.split('-')[0] && v <= +p.split('-')[1] : +p === v))
    const fires = (cron, t) => { const d = new Date(t); return cron.split(/,\s+(?=\d+\s)/).some(c => { const [m, h] = c.trim().split(/\s+/); return field(m, d.getUTCMinutes()) && field(h, d.getUTCHours()) }) }
    const seek = (cron, from, dir) => { let t = Math.floor(from / 60000) * 60000; for (let i = 0; i < 2880; i++) { t += dir * 60000; if (fires(cron, t)) return t } return null }
    const hm = t => new Date(t).toISOString().slice(11, 16)
    const when = t => { const d = new Date(t); return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}, ${hm(t)}` }
    const ago = t => { const m = Math.round((now - t) / 60000); return m < 60 ? `${m} min` : m < 2880 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${Math.round(m / 1440)} days` }
    const names = [...new Set([...castData.agents.filter(a => a.cron || commits.some(c => c.agent === a.name)).map(a => a.name), ...commits.map(c => c.agent)])]
    const wakesOf = name => {
        const out = []; let cur = []
        for (const c of commits.filter(c => c.agent === name)) { cur.push(c); if (c.version) { out.push(cur); cur = [] } }
        if (cur.length) out.push(cur)
        return out.reverse()
    }
    const rows = [], sections = []
    for (const name of names) {
        const a = castData.agents.find(x => x.name === name), ws = wakesOf(name), last = ws[0] ? Date.parse(ws[0][ws[0].length - 1].at) : null
        const prev = a && a.cron ? seek(a.cron, now + 60000, -1) : null, next = a && a.cron ? seek(a.cron, now, 1) : null
        // missed: its last slot passed more than an hour before this build and nothing came after it (and it has run before)
        const state = !ws.length ? pill('not started') : a && a.cron && prev && last && last < prev && now - prev > 3600000 ? pill(`missed ${hm(prev)}?`, true) : pill('on schedule')
        const id = (a && a.id) || slug(name)
        rows.push(`<tr><td>${a ? castIcon(a.id) : ''} <a href="#${id}">${esc(name)}</a></td><td>${esc((a && a.when) || 'a person\'s agent')}${a && a.cron ? `<br><code>${esc(a.cron)}</code>` : ''}</td><td>${last ? `${when(last)}<br><span class="meta">${ago(last)} before this build</span>` : 'never'}</td><td>${next ? when(next) : '-'}</td><td>${ws.filter(w => w[w.length - 1].version).length}</td><td>${state}</td></tr>`)
        const wake = w => {
            const rel = w.find(c => c.version), first = w[0], end = w[w.length - 1], sess = w.map(c => c.session).find(Boolean)
            const src = w.filter(c => !c.version)
            return `<li><b>${when(Date.parse(first.at))}</b>${rel ? ` · <a href="${GH}${rel.sha}">${rel.version}</a>: ${inline(rel.what)}` : ' · <i>not released yet</i>'}${src.length ? `<ul>${src.map(c => `<li><a href="${GH}${c.sha}"><code>${c.sha.slice(0, 7)}</code></a> ${hm(Date.parse(c.at))} ${esc(c.subject.replace(/^[a-z0-9-]+@web-summit\.[a-z0-9-]+: */, ''))}</li>`).join('')}</ul>` : ''}${sess ? `<span class="meta"><a href="${esc(sess)}">the session</a> (opens for its account's owner)</span>` : ''}</li>`
        }
        sections.push(`<h2 id="${id}">${a ? castIcon(a.id) + ' ' : ''}${esc(name)}</h2><p class="meta">${esc((a && a.when) || 'a person\'s agent')}${a && a.look ? ` · drawn with ${esc(a.look)}` : ''}${a ? ` · <a href="../agents/index.html#${a.id}">its job and prompt</a>` : ''}</p>${ws.length ? `<ol class="wakes">${ws.slice(0, 25).map(wake).join('')}</ol>${ws.length > 25 ? `<p class="meta">And ${ws.length - 25} earlier wakes: <a href="${REPO}/commits/dev">the full history</a>.</p>` : ''}` : '<p>No wake recorded yet.</p>'}`)
    }
    const asOf = now ? when(now) : 'unknown'
    const body = `<p>Every agent wired up on this team: when it is scheduled to fire, when it last did, and what each wake did, newest first, each linked to its commits. Built from the git history: every commit names its agent (<code>Agent:</code>) and its session (<code>Claude-Session:</code>); a wake is an agent's commits closed by its release. Times are UTC (Lisbon is UTC in November), as of the newest commit in this build: <b>${asOf}</b>. Each release rebuilds this page.${note ? ` ${note}` : ''}</p>
<h2 id="now">Who fires when</h2><div class="scroll"><table><tr><th>Agent</th><th>Schedule</th><th>Last wake</th><th>Next, from the schedule</th><th>Releases</th><th>State</th></tr>${rows.join('')}</table></div><p class="meta">"Missed?" means the schedule had a slot more than an hour before this build and the agent has committed nothing since: its session may be asleep or stuck, or it found nothing worth a release. The conductor checks.</p>
${sections.join('\n')}`
    const md = names.map(n => { const a = castData.agents.find(x => x.name === n); return `## ${n}\n\n${(a && a.when) || 'a person\'s agent'}${a && a.cron ? ` (cron ${a.cron})` : ''}\n\n${wakesOf(n).slice(0, 25).map(w => { const r = w.find(c => c.version); return `- ${w[0].at.slice(0, 16)}Z ${r ? `${r.version}: ${r.what} (${GH}${r.sha})` : 'not released yet'}` }).join('\n') || 'No wake recorded yet.'}` }).join('\n\n')
    write('wakes/index.html', page({ rel: 'wakes/index.html', title: 'The agents at work', description: 'Every agent on the team: its schedule, when it last fired, and what each wake did, linked to its commits.', body, lead: 'When each agent fires, when it last did, and what it did in each wake.', mdTwin: 'wakes/index.md' }))
    twin('wakes/index.html', 'The agents at work', `Every agent's schedule and wakes, from the git history, as of ${asOf} UTC.`, md)
    pages.push({ rel: 'wakes/index.html', title: 'The agents at work', description: 'Every agent: its schedule, its last wake, and what each wake did.' })
}

// machine surfaces
pages.sort((a, b) => a.rel.localeCompare(b.rel))
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>https://${HOST}/${p.rel}</loc></url>`).join('\n')}\n</urlset>\n`)
write('llms.txt', `# ${HOST}\n\n> The SGit site for Web Summit. Built and run by an AI agent (Claude Code) with a named human operator. Version ${VERSION}.\n\nIdentity of the agent: https://pki.sgit.ai (fingerprint on /agent/index.html). Source: ${REPO}\n\n## Pages\n\n${pages.map(p => `- [${p.title}](https://${HOST}/${p.rel}): ${p.description || ''}`).join('\n')}\n`)
console.log(`built ${pages.length} pages at ${VERSION}`)
