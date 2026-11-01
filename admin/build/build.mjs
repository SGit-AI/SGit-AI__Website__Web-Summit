#!/usr/bin/env node
// Renders the site from content/ (markdown with a front-matter header) into HTML, plus the machine surfaces:
// llms.txt, sitemap.xml, index.md, the articles index, markdown twins and admin/versions.html.
// No dependencies. Never hand-edit a generated page; edit content/ and run: node admin/build/build.mjs
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const HOST = fs.readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim()
const VERSION = fs.readFileSync(path.join(ROOT, 'admin/build/version.txt'), 'utf8').trim()
const REPO = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit'
const NAV = [['Companies', 'companies/index.html'], ['Summit', 'summit/index.html'], ['Plan', 'plan/index.html'], ['Team', 'team/index.html'], ['Log', 'log/index.html'], ['Articles', 'articles/index.html'], ['Keys', 'keys/index.html'], ['About', 'about/index.html'], ['Versions', 'admin/versions.html']]

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const write = (rel, text) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) }

function inline(s) {
    return esc(s)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\*([^*]+)\*/g, '<i>$1</i>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
}

function parse(src) {
    const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!m) throw new Error('missing front matter')
    const meta = {}
    for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim() }
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
        } else if (/^#{2,3} /.test(l)) {
            const n = l.match(/^#+/)[0].length, raw = l.replace(/^#+ /, ''), anchor = raw.match(/\s*\{#([a-z0-9-]+)\}\s*$/), t = raw.replace(/\s*\{#[a-z0-9-]+\}\s*$/, '')
            out.push(`<h${n} id="${anchor ? anchor[1] : slug(t)}">${inline(t)}</h${n}>`); i++
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
            for (; i < lines.length && lines[i].trim() !== '' && !/^(```|#{2,3} |- |\|)/.test(lines[i]); i++) buf.push(lines[i])
            out.push(`<p>${inline(buf.join(' '))}</p>`)
        }
    }
    return out.join('\n')
}

function page({ rel, title, description, body, meta = '', mdTwin = '', lead = '', home = false }) {
    const up = '../'.repeat(rel.split('/').length - 1)
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
<div class="links">${NAV.map(([t, h]) => `<a href="${up}${h}"${rel === h || rel.startsWith(h.replace('index.html', '')) && h.endsWith('index.html') && h !== 'index.html' ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</div>
<a class="gh" href="${REPO}">★ GitHub</a>
</div></nav>
<main id="main"${home ? ' class="home"' : ''}>
<h1>${inline(title)}</h1>
${lead ? `<p class="lead">${inline(lead)}</p>` : ''}
${home ? `<p class="countdown" data-countdown="2026-11-09">Web Summit Lisbon: 9 to 12 November 2026</p><script src="assets/countdown.js" defer></script>` : ''}
${meta}
${body}
</main>
<footer><div class="row"><span>Built and run by an AI agent with a named human operator.</span><a class="ver" href="${up}admin/versions.html">${VERSION}</a><a href="${REPO}">GitHub</a><span>Code Apache-2.0, text CC BY 4.0</span></div></footer>
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
const teamData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8'))
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

// plain pages: content/index.md -> index.html, content/<name>.md -> <name>/index.html
for (const f of fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(ROOT, 'content', f), 'utf8')
    const { meta, body } = parse(raw)
    const name = f.replace(/\.md$/, ''), rel = meta.path || (name === 'index' ? 'index.html' : `${name}/index.html`)
    write(rel, page({ rel, title: meta.title, description: meta.summary, body: (meta.asof ? `<p class="asof">${esc(meta.asof)}</p>` : '') + render(body).replace('<p>{{numbers}}</p>', NUMBERS_HTML('')), mdTwin: twinPath(rel), lead: meta.lead || '', home: name === 'index' }))
    pages.push({ rel, title: meta.title, description: meta.summary })
    if (name !== 'index') twin(rel, meta.title, meta.summary, body)
    if (name === 'index') write('index.md', `# ${meta.title}\n\n${meta.summary}\n\nSite version: ${VERSION}\n\n${body.trim().replace('{{numbers}}', NUMBERS_MD)}\n`)
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
        body: `<p>${inline(m.summary)}</p><table>${facts.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>${card}<h2 id="owns">What they own</h2>${list(m.owns)}${m.kind === 'human' ? `<h2 id="companies">Companies they own on the map</h2>${owned.length ? `<ul>${owned.map(c => `<li><a href="../../companies/${c.id}/index.html">${esc(c.name)}</a>: ${esc(c.status)}</li>`).join('')}</ul>` : '<p>None yet: owners are the operator\'s decision (<a href="../../plan/index.html#decisions">the plan</a>).</p>'}` : ''}<h2 id="rules">The rules they work by</h2>${list(m.rules)}${home ? `<h2 id="home">Their home</h2><ul>${home}</ul>` : ''}<p><a href="../index.html">The team</a></p>`
    }))
    twin(rel, `${m.name}: ${m.role}`, m.summary, `Kind: ${KINDS[m.kind]}. Status: ${m.status}.${m.holder ? ` Held by: ${m.holder}.` : ''}${m.slot ? ` Runs: ${m.slot}.` : ''}\n\n${m.card ? `## Role card\n\n${CARD.map(([k, t]) => `- ${t}: ${m.card[k] || 'to decide'}`).join('\n')}\n\n` : ''}## What they own\n\n${m.owns.map(x => `- ${x}`).join('\n') || 'None yet.'}\n\n## The rules they work by\n\n${m.rules.map(x => `- ${x}`).join('\n') || 'None yet.'}`)
    pages.push({ rel, title: `${m.name}: ${m.role}`, description: m.summary })
}
{
    const humans = team.members.filter(m => m.kind === 'human'), agents = team.members.filter(m => m.kind === 'agent')
    const hrow = m => `<tr><td><a href="${m.id}/index.html">${esc(m.name)}</a></td><td>${esc(m.role)}</td><td>${esc(m.status)}</td><td>${inline((m.card || {}).agent || 'to decide')}</td><td>${CO.filter(c => c.owner === m.id).length}</td></tr>`
    const arow = m => `<tr><td><a href="${m.id}/index.html">${esc(m.name)}</a></td><td>${esc(m.role)}</td><td>${esc(m.status)}</td><td>${esc(m.slot || 'in its owner\'s account')}</td><td>${esc(m.reviewed_by || 'its person')}</td></tr>`
    const body = `<p>${inline(team.about)}</p>
<h2 id="people">The people</h2><p>Seven are going to Lisbon, plus a designer with very little time. A seat is named only after its person says yes to what the card says.</p><div class="scroll"><table><tr><th>Person</th><th>Role</th><th>Status</th><th>Their agent</th><th>Companies owned</th></tr>${humans.map(hrow).join('')}</table></div>
<h2 id="agents">The team's agents</h2><p>The roles from the brief. One conductor session wakes every 2 hours and runs the others as sub-agents, chosen by its plan (<a href="../log/index.html">the session log</a>). Each has a role file and a behaviour policy saying which paths it may write; the gate fails if two claim the same path.</p><div class="scroll"><table><tr><th>Agent</th><th>Role</th><th>Status</th><th>Runs</th><th>Reviewed by</th></tr>${agents.map(arow).join('')}</table></div>
<h2 id="where-they-meet">Where people and agents meet</h2><ul><li><b>Each person brings their own agent</b>, with its own key, its own vault and its own personal CRM; what that CRM shares reaches the team view by shared ids. None has joined yet except the operator's.</li><li><b>Each team agent's output is reviewed daily by one person.</b> Who reviews which is the operator's decision; until then the operator reviews all of them.</li><li><b>Each company on the map has one owner among the seven</b>, and the owner's agent keeps the record. The conductor routes a request that names a company to its owner, and one that names nobody to the board.</li><li><b>Anything a person records is acted on within the hour</b>: a record, a page, a drafted follow-up. A person sends every email (<a href="../plan/index.html#loop">the loop</a>).</li></ul>`
    write('team/index.html', page({ rel: 'team/index.html', title: 'The team', description: 'The people, their agents, the team\'s agents, and who works with whom.', body }))
    twin('team/index.html', 'The team', team.about, `## The people\n\n${humans.map(m => `- [${m.name}](${m.id}/index.md): ${m.role} (${m.status}). Agent: ${(m.card || {}).agent || 'to decide'}`).join('\n')}\n\n## The team's agents\n\n${agents.map(m => `- [${m.name}](${m.id}/index.md): ${m.role} (${m.status}). Runs: ${m.slot || 'in its owner\'s account'}`).join('\n')}`)
    pages.push({ rel: 'team/index.html', title: 'The team', description: 'The people, their agents, the team\'s agents, and who works with whom.' })
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
    body: `<p>Every push to <code>dev</code> is a minor release (v0.1.x); every push to <code>main</code> is a major one. CI tags the release.</p><table><tr><th>Version</th><th>Date</th><th>What changed</th></tr>${versions.map(v => `<tr><td class="vnum">${v.version}</td><td>${v.date}</td><td>${esc(v.what)}</td></tr>`).join('')}</table>`
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
        body: `<p class="meta">On the Web Summit 2026 company map. Built from public material only; the decision and the priority are our judgement, proposed until the company's owner takes them.</p><table>${facts.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table><h2 id="assets">Assets made for them</h2>${c.assets.length ? list(c.assets) : '<p>None yet.</p>'}<h2 id="sources">Sources</h2><ul>${srcList(c.sources)}</ul><p><a href="../index.html">The company map</a></p>`
    }))
    twin(rel, c.name, c.what || c.name, `- Website: ${c.website || 'unknown'}\n- Category: ${c.category || ''}\n- Country: ${c.country || 'unknown'}\n- Attending 2026: ${c.attending || 'unconfirmed'}\n- Why it matters to us: ${c.why_it_matters || 'to decide'}\n- Decision (proposed): ${c.decision || 'to decide'}\n- Priority: ${c.priority || ''}\n- Owner: ${c.owner}\n- Status: ${c.status}\n\n## Sources\n\n${(c.sources || []).map(s => `- ${s.url} (read ${s.read_on || ''})${s.supports ? `: ${s.supports}` : ''}`).join('\n')}`)
    pages.push({ rel, title: c.name, description: c.what || c.name })
}
{
    const cats = [...new Set(CO.map(c => c.category))].sort()
    const crow = c => `<tr><td><a href="${c.id}/index.html">${esc(c.name)}</a><br><span class="meta">${esc(c.category || '')}${c.country ? ', ' + esc(c.country) : ''}</span></td><td>${inline(c.what || '')}</td><td>${inline(c.why_it_matters || '')}</td><td>${pill(c.decision || 'to decide', c.decision === 'meet')}</td><td>${pill('P' + (c.priority || '?'), c.priority === 1)}</td><td>${/^confirmed/.test(c.attending || '') ? pill('confirmed', true) : pill('unconfirmed')}</td><td>${esc(c.owner)}</td></tr>`
    const about = companies.method ? inline(companies.method) : 'The map is being built.'
    const body = `<p>Every company we think is going to Web Summit 2026 and that matters to us: who they are, what they do, why it matters, and what we propose to do about it. Built from public material only, each fact with its source and the date read; the judgements are ours, and each decision is a proposal until the company's owner on our team takes it. Owners are the operator's decision.</p><p class="meta">${about}${companies.read_on ? ` Read on ${esc(companies.read_on)}.` : ''}</p>${NUMBERS_HTML('../')}<p>By category: ${cats.map(k => `${pill(k)} ${CO.filter(c => c.category === k).length}`).join(' ')}</p><div class="scroll"><table><tr><th>Company</th><th>What they do</th><th>Why it matters</th><th>Decision</th><th>Priority</th><th>Attending</th><th>Owner</th></tr>${byPrio.map(crow).join('')}</table></div>${(companies.sources || []).length ? `<h2 id="sources">Where the map comes from</h2><ul>${(companies.sources || []).map(s => `<li><a href="${esc(s.url)}">${esc(s.url)}</a>: ${esc(s.what || '')}</li>`).join('')}</ul>` : ''}`
    write('companies/index.html', page({ rel: 'companies/index.html', title: 'The company map', description: 'The companies at Web Summit 2026 that matter to us, from public material, with a proposed decision and an owner for each.', body }))
    twin('companies/index.html', 'The company map', 'The companies at Web Summit 2026 that matter to us, from public material, with a proposed decision and an owner for each.', byPrio.map(c => `- [${c.name}](${c.id}/index.md) (P${c.priority || '?'}, ${c.decision || 'to decide'}, ${/^confirmed/.test(c.attending || '') ? 'confirmed' : 'unconfirmed'}, owner ${c.owner}): ${c.what || ''} Why: ${c.why_it_matters || ''}`).join('\n') || 'None yet.')
    pages.push({ rel: 'companies/index.html', title: 'The company map', description: 'The companies at Web Summit 2026 that matter to us.' })
}

// the summit: data/events.json -> summit/index.html
{
    const val = v => v && typeof v === 'object' && !Array.isArray(v) ? `${inline(String(v.value ?? v.text ?? JSON.stringify(v)))}${v.source ? ` <a class="meta" href="${esc(v.source)}">source</a>` : ''}` : Array.isArray(v) ? v.map(x => typeof x === 'object' ? inline(x.name || x.value || JSON.stringify(x)) : inline(String(x))).join(', ') : inline(String(v))
    const facts = Object.entries(events.summit || {}).filter(([k]) => k !== 'source')
    const srow = s => `<tr><td>${esc(s.day || '')}${s.time ? `<br><span class="meta">${esc(s.time)}</span>` : ''}</td><td>${s.source ? `<a href="${esc(s.source)}">${esc(s.title)}</a>` : esc(s.title)}<br><span class="meta">${esc(s.stage || '')}${s.track ? ' · ' + esc(s.track) : ''}</span></td><td>${esc((s.speakers || []).map(p => p.org ? `${p.name} (${p.org})` : p.name).join(', '))}</td><td>${esc(s.why_relevant || '')}</td></tr>`
    const body = `<p>What is public about Web Summit 2026 and what matters to us in it: the facts, the programme, the side events in Lisbon and the Algarve, and the news. Kept by the curator from public sources, each item linked; where something is unconfirmed, it says so.${events.read_on ? ` Read on ${esc(events.read_on)}.` : ''}</p>
<h2 id="facts">The facts</h2>${facts.length ? `<div class="scroll"><table>${facts.map(([k, v]) => `<tr><th>${esc(k.replace(/_/g, ' '))}</th><td>${val(v)}</td></tr>`).join('')}</table></div>` : '<p>Being gathered.</p>'}
<h2 id="sessions">Sessions that matter to us</h2>${events.sessions.length ? `<div class="scroll"><table><tr><th>When</th><th>Session</th><th>Speakers, as listed</th><th>Why</th></tr>${events.sessions.map(srow).join('')}</table></div>` : '<p>None tracked yet.</p>'}
<h2 id="side-events">Side events, in Lisbon and the Algarve</h2>${events.side_events.length ? `<ul>${events.side_events.map(e => `<li><b>${esc(e.date || '')}</b> ${e.source ? `<a href="${esc(e.source)}">${esc(e.title)}</a>` : esc(e.title)}${e.place ? `, ${esc(e.place)}` : ''}: ${inline(e.what || '')}</li>`).join('')}</ul>` : '<p>None yet.</p>'}
<h2 id="news">News about the summit</h2>${events.news.length ? `<ul>${events.news.map(n => `<li><a href="${esc(n.url)}">${esc(n.headline)}</a> <span class="meta">${esc(n.publisher || '')}, ${esc(n.date || '')}</span><br>${inline(n.summary || '')}</li>`).join('')}</ul>` : '<p>None yet.</p>'}
<h2 id="newsroom">From the SGit newsroom</h2>${events.newsroom.length ? `<ul>${events.newsroom.map(n => `<li><a href="${esc(n.url)}">${esc(n.title)}</a> <span class="meta">${esc(n.date || '')}</span><br>${inline(n.summary || '')}</li>`).join('')}</ul>` : '<p>None yet.</p>'}
${(events.gaps || []).length ? `<h2 id="gaps">What we could not confirm</h2>${list(events.gaps)}` : ''}`
    write('summit/index.html', page({ rel: 'summit/index.html', title: 'Web Summit 2026', description: 'The facts, the programme, the side events and the news, from public sources.', body }))
    twin('summit/index.html', 'Web Summit 2026', 'The facts, the programme, the side events and the news, from public sources.', `## The facts\n\n${facts.map(([k, v]) => `- ${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? (v.value ?? JSON.stringify(v)) : v}`).join('\n')}\n\n## Sessions\n\n${events.sessions.map(s => `- ${s.day || ''} ${s.title} (${(s.speakers || []).map(p => p.name).join(', ')}) ${s.source || ''}`).join('\n')}\n\n## Side events\n\n${events.side_events.map(e => `- ${e.date || ''} ${e.title}, ${e.place || ''}: ${e.what || ''} ${e.source || ''}`).join('\n')}\n\n## News\n\n${events.news.map(n => `- ${n.headline} (${n.publisher || ''}, ${n.date || ''}) ${n.url}`).join('\n')}`)
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
<h2 id="design">The design track, worked backwards</h2><p>${inline(d.about || '')}</p>${d.items.length ? `<div class="scroll"><table><tr><th>Item</th><th>Design approved by</th><th>Ordered by</th><th>Delivered by</th><th>Supplier (proposed)</th><th>Notes</th></tr>${d.items.map(irow).join('')}</table></div>` : '<p>Being worked out.</p>'}${(d.too_late || []).length ? `<h3 id="too-late">Already too late on standard service</h3>${list(d.too_late)}` : ''}${(d.qr || []).length ? `<h3 id="qr">Codes on print</h3>${list(d.qr)}` : ''}${(d.sources || []).length ? `<h3 id="design-sources">Sources</h3><ul>${d.sources.map(s => `<li><a href="${esc(s.url || s)}">${esc((s.url || s).replace(/^https?:\/\//, '').slice(0, 80))}</a>${s.what ? `: ${esc(s.what)}` : ''}</li>`).join('')}</ul>` : ''}
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

// machine surfaces
pages.sort((a, b) => a.rel.localeCompare(b.rel))
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>https://${HOST}/${p.rel}</loc></url>`).join('\n')}\n</urlset>\n`)
write('llms.txt', `# ${HOST}\n\n> The SGit site for Web Summit. Built and run by an AI agent (Claude Code) with a named human operator. Version ${VERSION}.\n\nIdentity of the agent: https://pki.sgit.ai (fingerprint on /agent/index.html). Source: ${REPO}\n\n## Pages\n\n${pages.map(p => `- [${p.title}](https://${HOST}/${p.rel}): ${p.description || ''}`).join('\n')}\n`)
console.log(`built ${pages.length} pages at ${VERSION}`)
