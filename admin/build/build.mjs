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
const NAV = [['Articles', 'articles/index.html'], ['Team', 'team/index.html'], ['The agent', 'agent/index.html'], ['About', 'about/index.html'], ['Versions', 'admin/versions.html']]

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
        if (l.startsWith('```')) {
            const buf = []
            for (i++; i < lines.length && !lines[i].startsWith('```'); i++) buf.push(lines[i])
            i++
            out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`)
        } else if (/^#{2,3} /.test(l)) {
            const n = l.match(/^#+/)[0].length, t = l.replace(/^#+ /, '')
            out.push(`<h${n} id="${slug(t)}">${inline(t)}</h${n}>`); i++
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

function page({ rel, title, description, body, meta = '', mdTwin = '' }) {
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
<header><a class="brand" href="${up}index.html">web-summit.sgit.ai</a>${NAV.map(([t, h]) => `<a href="${up}${h}">${t}</a>`).join('')}</header>
<main>
<h1>${inline(title)}</h1>
${meta}
${body}
</main>
<footer>SGit · <a class="ver" href="${up}admin/versions.html">${VERSION}</a> · <a href="${REPO}">GitHub</a> · code Apache-2.0, text CC BY 4.0</footer>
<div class="agent-block"><pre><code>${esc(agent)}</code></pre></div>
</body>
</html>
`
}

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
pages.push({ rel: 'articles/index.html', title: 'Articles', description: 'Everything published here, newest first.' })

// plain pages: content/index.md -> index.html, content/<name>.md -> <name>/index.html
for (const f of fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(ROOT, 'content', f), 'utf8')
    const { meta, body } = parse(raw)
    const name = f.replace(/\.md$/, ''), rel = name === 'index' ? 'index.html' : `${name}/index.html`
    write(rel, page({ rel, title: meta.title, description: meta.summary, body: render(body) }))
    pages.push({ rel, title: meta.title, description: meta.summary })
    if (name === 'index') write('index.md', `# ${meta.title}\n\n${meta.summary}\n\nSite version: ${VERSION}\n\n${body.trim()}\n`)
}


// the team: data/team.json -> team/index.html and team/<id>/index.html
const team = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8'))
const list = items => items.length ? `<ul>${items.map(i => `<li>${inline(i)}</li>`).join('')}</ul>` : '<p>None yet.</p>'
const KINDS = { human: 'person', agent: 'agent', role: 'open role' }
for (const m of team.members) {
    const rel = `team/${m.id}/index.html`
    const facts = [['Kind', KINDS[m.kind]], ['Status', m.status], m.alias && ['Alias', `<code>${esc(m.alias)}</code>`], m.address && ['Known as', `<code>${esc(m.address)}</code>`], m.identity && ['Identity', esc(m.identity)], m.joined && ['Joined', m.joined]].filter(Boolean)
    const home = (m.home || []).map(([h, t]) => `<li><a href="${/^https?:/.test(h) ? h : '../../' + h}">${esc(t)}</a></li>`).join('')
    write(rel, page({
        rel, title: `${m.name}: ${m.role}`, description: m.summary,
        body: `<p>${inline(m.summary)}</p><p class="meta">${facts.map(([k, v]) => `<b>${k}</b> ${k === 'Kind' || k === 'Status' ? esc(v) : v}`).join(' · ')}</p><h2 id="owns">What they own</h2>${list(m.owns)}<h2 id="rules">The rules they work by</h2>${list(m.rules)}${home ? `<h2 id="home">Their home</h2><ul>${home}</ul>` : ''}<p><a href="../index.html">The team</a></p>`
    }))
    pages.push({ rel, title: `${m.name}: ${m.role}`, description: m.summary })
}
const row = m => `<tr><td><a href="${m.id}/index.html">${esc(m.name)}</a></td><td>${esc(m.role)}</td><td>${KINDS[m.kind]}</td><td>${esc(m.status)}</td></tr>`
write('team/index.html', page({
    rel: 'team/index.html', title: 'The team', description: 'Who runs this site: the people, the agent and the roles still open.',
    body: `<p>${inline(team.about)}</p><table><tr><th>Member</th><th>Role</th><th>Kind</th><th>Status</th></tr>${team.members.map(row).join('')}</table><p>How the work is released: <a href="../about/index.html">About</a>.</p>`
}))
pages.push({ rel: 'team/index.html', title: 'The team', description: 'Who runs this site: the people, the agent and the roles still open.' })

// versions
const versions = JSON.parse(fs.readFileSync(path.join(ROOT, 'admin/versions.json'), 'utf8'))
write('admin/versions.html', page({
    rel: 'admin/versions.html', title: 'Versions', description: 'Every release of this site and what changed.',
    body: `<p>Every push to <code>dev</code> is a minor release (v0.1.x); every push to <code>main</code> is a major one. CI tags the release.</p><table><tr><th>Version</th><th>Date</th><th>What changed</th></tr>${versions.map(v => `<tr><td class="vnum">${v.version}</td><td>${v.date}</td><td>${esc(v.what)}</td></tr>`).join('')}</table>`
}))
pages.push({ rel: 'admin/versions.html', title: 'Versions', description: 'Release history.' })

// machine surfaces
pages.sort((a, b) => a.rel.localeCompare(b.rel))
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>https://${HOST}/${p.rel}</loc></url>`).join('\n')}\n</urlset>\n`)
write('llms.txt', `# ${HOST}\n\n> The SGit site for Web Summit. Built and run by an AI agent (Claude Code) with a named human operator. Version ${VERSION}.\n\nIdentity of the agent: https://pki.sgit.ai (fingerprint on /agent/index.html). Source: ${REPO}\n\n## Pages\n\n${pages.map(p => `- [${p.title}](https://${HOST}/${p.rel}): ${p.description || ''}`).join('\n')}\n`)
console.log(`built ${pages.length} pages at ${VERSION}`)
