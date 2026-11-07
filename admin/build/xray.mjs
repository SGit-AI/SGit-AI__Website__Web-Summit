// The RiskMandate X-ray (xray@web-summit.dinis, 7 November 2026, for the booth at Web Summit, 9 to 12 November):
// data/xray/<slug>/xray.json -> xray/<slug>/index.html (readable without JavaScript: what the subject does, its agents,
// each use case's reach, mandate, gap and controls, the simulation, incidents, leads, questions and every source with
// its URL and the date read) and xray/<slug>/deck/index.html (8 to 10 slides, presented by assets/deck.js).
// /xray/ itself is content/xray.md; its ```xray fence becomes the mount for assets/xray.js plus the list of subjects.
// What a model says is a lead; only facts whose sources were read reach a page. RiskMandate's words are its own,
// from riskmandate.ai/llms.txt, and nothing else is claimed for it.
import fs from 'fs'
import path from 'path'
import { esc, clipWords } from './text.mjs'
import { ask, DEFAULT_MAX_TOKENS } from '../tools/xray-ask.mjs'

const KINDS = { company: 'a company', 'use-case': 'a use case', industry: 'an industry' }
export const RM_WORDS = { path: 'never in the request path: read-only by design', does: 'measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record' }
const okUrl = u => /^https?:\/\//i.test(String(u || ''))

// every subject, read once: [{ slug, subject, kind, tagline, status, read_on, x }]
export function loadXray(ROOT) {
    const dir = path.join(ROOT, 'data/xray')
    if (!fs.existsSync(dir)) return []
    const out = []
    for (const slug of fs.readdirSync(dir).sort()) {
        const f = path.join(dir, slug, 'xray.json')
        if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(f)) continue
        let x; try { x = JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { throw new Error(`data/xray/${slug}/xray.json: ${e.message}`) }
        out.push({ slug, subject: x.subject || slug, kind: x.kind || 'company', tagline: x.tagline || '', status: x.status || 'prepared', read_on: x.read_on || '', x, search: loadSearch(ROOT, slug) })
    }
    out.sort((a, b) => (a.status === 'prepared' ? 0 : 1) - (b.status === 'prepared' ? 0 : 1) || a.subject.localeCompare(b.subject))
    // searches with no X-ray (experiments): named on /xray/how/, never counted in its totals
    out.experiments = fs.readdirSync(dir).filter(n => /^[a-z0-9-]+$/.test(n) && !fs.existsSync(path.join(dir, n, 'xray.json'))).map(n => loadSearch(ROOT, n)).filter(Boolean).map(r => r.subject || r.slug)
    return out
}
const indexRow = s => ({ slug: s.slug, subject: s.subject, kind: s.kind, tagline: s.tagline, status: s.status, read_on: s.read_on })

// the mount on /xray/, with the subjects as plain links (so they are reachable and readable without JavaScript);
// links are written from the site root (@@/), which page() makes relative
export function xrayIndexHtml(list) {
    const json = JSON.stringify(list.map(indexRow)).replace(/</g, '\\u003c')
    return `<div class="xray" id="xray" data-mode="home"><p class="meta xr-nojs">The scanner (the input, the replay of each run and the graph) needs JavaScript. Every X-ray below is a plain page that reads without it.</p>`
        + (list.length ? `<ul class="xr-list">${list.map(s => `<li><a href="@@/xray/${s.slug}/index.html"><b>${esc(s.subject)}</b></a> <span class="meta">${esc(KINDS[s.kind] || s.kind)}, ${esc(s.status)}${s.read_on ? `, read ${esc(s.read_on)}` : ''}</span><br>${esc(s.tagline)} <a class="meta" href="@@/xray/${s.slug}/deck/index.html">the deck</a></li>`).join('')}</ul>` : '<p>No subject has been X-rayed yet.</p>')
        + `<script type="application/json" id="xray-index">${json}</script></div>`
}
export const xrayIndexMd = list => list.length ? list.map(s => `- [${s.subject}](${s.slug}/index.md) (${KINDS[s.kind] || s.kind}, ${s.status}${s.read_on ? `, read ${s.read_on}` : ''}): ${s.tagline} Deck: [${s.slug}/deck/index.md](${s.slug}/deck/index.md).`).join('\n') : 'No subject has been X-rayed yet.'

// the pages for each subject
export function buildXray({ list, write, page, twin, pages, VERSION }) {
    for (const s of list) {
        const x = s.x, rel = `xray/${s.slug}/index.html`, deckRel = `xray/${s.slug}/deck/index.html`
        const SRC = Object.fromEntries((x.sources || []).map(r => [r.id, r]))
        const cite = ids => (ids || []).filter(Boolean).map(id => SRC[id] ? `<a class="xr-cite" href="#src-${esc(id)}">${esc(id)}</a>` : `<span class="xr-cite">${esc(id)}</span>`).join('')
        const citeMd = ids => (ids || []).length ? ` [${ids.join(', ')}]` : ''
        const title = `${s.subject}: the RiskMandate X-ray`
        const description = `${s.subject}, X-rayed: ${s.tagline || 'what it does, what its agents can reach, the mandate and the gap'}. Every fact with its source and the date read.`
        const run = x.run || { agents: [] }
        const ucs = x.use_cases || [], agents = x.agents || []
        const agentName = id => (agents.find(a => a.id === id) || {}).name || id || ''
        const reachOf = (u, id) => (u.reach || []).find(r => r.id === id)

        // ---------- the HTML page ----------
        const h = []
        h.push(`<p class="meta">${esc(KINDS[s.kind] || s.kind)} · ${esc(s.status)}${x.read_on ? ` · sources read on ${esc(x.read_on)}` : ''} · <a href="deck/index.html">the deck</a> · <a href="run/index.html">how this X-ray was made</a> · <a href="../index.html">X-ray another name</a></p><p class="xr-runlink"><a class="xr-btn" href="run/index.html">What happened: how this X-ray was made →</a></p>`)
        h.push(`<div class="xray" id="xray" data-mode="subject" data-slug="${esc(s.slug)}"><p class="meta xr-nojs">With JavaScript, the graph of this X-ray and a player for each use case's simulation are drawn here. Everything they show is written out below.</p></div>`)
        h.push(`<h2 id="what">What it does</h2><p>${esc((x.what_it_does || {}).text || 'Not yet written.')} ${cite((x.what_it_does || {}).sources)}</p>`)
        h.push(`<h2 id="agents">Its AI agents</h2>${agents.length ? agents.map(a => `<h3 id="agent-${esc(a.id)}">${esc(a.name)}</h3><p>${esc(a.what || '')} ${cite(a.sources)}</p>${(a.actions || []).length ? `<p class="meta">What it can do:</p><ul>${a.actions.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}`).join('') : '<p>None found in the sources we read.</p>'}`)
        h.push(`<h2 id="use-cases">Use cases: reach, mandate and gap</h2><p>For each use case: what the agent can technically <b>reach</b> (from the sources), what a deployer would plausibly <b>authorise</b> (the mandate: illustrative, our judgement), the <b>gap</b> between the two (authority nobody accepted), and the <b>controls</b> that publicly stand in the way.</p>`)
        for (const u of ucs) {
            h.push(`<h3 id="uc-${esc(u.id)}">${esc(u.name)}</h3><p class="meta">The agent: ${esc(agentName(u.agent))}${u.who ? ` · who uses it: ${esc(u.who)}` : ''}</p>`)
            h.push(`<div class="scroll"><table class="xr-t"><tr><th>Reach</th><th>Kind</th><th>Sources</th></tr>${(u.reach || []).map(r => `<tr><td>${esc(r.what)}</td><td><span class="xr-kind xr-k-${esc(r.kind)}">${esc(r.kind)}</span></td><td>${cite(r.sources)}</td></tr>`).join('')}</table></div>`)
            h.push(`<div class="scroll"><table class="xr-t"><tr><th>Mandate (illustrative)</th></tr>${(u.mandate || []).map(m => `<tr><td>${esc(m.what)}</td></tr>`).join('') || '<tr><td>None stated.</td></tr>'}</table></div>`)
            h.push(`<div class="scroll"><table class="xr-t xr-gap"><tr><th>Gap: reach beyond the mandate</th><th>From the reach</th></tr>${(u.gap || []).map(g => `<tr><td>${esc(g.what)}</td><td>${esc((g.reach || []).map(id => (reachOf(u, id) || { what: id }).what).join('; '))}</td></tr>`).join('') || '<tr><td colspan="2">None found.</td></tr>'}</table></div>`)
            h.push(`<div class="scroll"><table class="xr-t"><tr><th>Controls that publicly stand in the way</th><th>Sources</th></tr>${(u.controls || []).map(c => `<tr><td>${esc(c.what)}</td><td>${cite(c.sources)}</td></tr>`).join('') || '<tr><td colspan="2">None found in the sources we read.</td></tr>'}</table></div>`)
            if ((u.simulation || []).length) h.push(`<p><b>The simulation</b>, each action placed against the mandate (RiskMandate is ${esc(RM_WORDS.path)}: it places, it does not stop):</p><ol class="xr-sim">${u.simulation.map(st => { const r = reachOf(u, st.reach); return `<li class="${st.in_mandate ? 'in' : 'out'}"><b>${esc(st.action)}</b> <span class="meta">(${esc(st.actor || 'agent')}${r ? `, reaches ${esc(r.what)}` : ''})</span>: ${st.in_mandate ? 'inside the mandate' : '<b>outside the mandate: in the gap</b>'}${st.note ? `. What RiskMandate's record shows: ${esc(st.note)}` : ''}</li>` }).join('')}</ol>`)
        }
        if ((x.incidents || []).length) h.push(`<h2 id="incidents">Incidents, as reported</h2><ul>${x.incidents.map(i => `<li>${i.when ? `<b>${esc(i.when)}</b>: ` : ''}${esc(i.what)} ${cite(i.sources)}</li>`).join('')}</ul>`)
        h.push(`<h2 id="run">The run</h2><p>The search agents that looked for leads${run.at ? ` on ${esc(run.at)}` : ''}${typeof run.cost_usd === 'number' ? `, for a total cost of $${run.cost_usd.toFixed(4)}` : ''}. What a model says is a lead, not a fact.</p>${(run.agents || []).length ? `<div class="scroll"><table class="xr-t"><tr><th>Agent</th><th>Model</th><th>Time</th><th>Citations</th><th>Leads</th></tr>${run.agents.map(a => `<tr><td>${esc(a.label || a.id)}</td><td><code>${esc(a.model || '')}</code></td><td>${a.ms != null ? (a.ms / 1000).toFixed(1) + ' s' : ''}</td><td>${esc(a.citations ?? '')}</td><td>${esc(a.leads ?? '')}</td></tr>`).join('')}</table></div>` : ''}`)
        h.push(`<h2 id="leads">Leads: what the models claimed, and what we found</h2>${(x.leads || []).length ? `<div class="scroll"><table class="xr-t"><tr><th>Model</th><th>Claim</th><th>Status</th><th>Source</th></tr>${x.leads.map(l => `<tr><td>${esc(l.model)}</td><td>${esc(l.claim)}</td><td><span class="xr-st xr-st-${esc(l.status)}">${esc(l.status)}</span></td><td>${l.source ? cite([l.source]) : ''}</td></tr>`).join('')}</table></div>` : '<p>None recorded.</p>'}`)
        h.push(`<h2 id="questions">The questions we would ask</h2><p class="meta">We have not asked them yet.</p>${(x.questions || []).length ? `<ol>${x.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ol>` : '<p>None yet.</p>'}`)
        h.push(`<h2 id="sources">Sources</h2><ol class="xr-sources">${(x.sources || []).map(r => `<li id="src-${esc(r.id)}"><b>${esc(r.id)}</b> ${okUrl(r.url) ? `<a href="${esc(r.url)}">${esc(r.title || r.url)}</a>` : esc(r.title || r.url)}${r.publisher ? `, ${esc(r.publisher)}` : ''} <span class="meta">(${esc(r.kind || 'other')}${r.read_on ? `, read ${esc(r.read_on)}` : ''})</span><br><span class="meta">${esc(r.url)}</span></li>`).join('')}</ol>`)
        h.push(`<p class="meta">X-rayed by RiskMandate, which ${esc(RM_WORDS.does)} (riskmandate.ai/llms.txt). The mandates are illustrative. Built by xray@web-summit.dinis from <a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/data/xray/${esc(s.slug)}/xray.json">data/xray/${esc(s.slug)}/xray.json</a>.</p>`)
        write(rel, page({ rel, title, description, body: h.join('\n'), mdTwin: rel.replace(/\.html$/, '.md'), head: `<link rel="stylesheet" href="../../assets/xray/xray.css?v=${VERSION}"><script src="../../assets/xray.js?v=${VERSION}" defer></script>` }))
        pages.push({ rel, title, description })

        // ---------- the markdown twin ----------
        const m = []
        m.push(`${KINDS[s.kind] || s.kind}, ${s.status}${x.read_on ? `, sources read on ${x.read_on}` : ''}. The deck: [deck/index.md](deck/index.md).`)
        m.push(`## What it does\n\n${(x.what_it_does || {}).text || 'Not yet written.'}${citeMd((x.what_it_does || {}).sources)}`)
        m.push(`## Its AI agents\n\n${agents.map(a => `### ${a.name}\n\n${a.what || ''}${citeMd(a.sources)}\n\n${(a.actions || []).map(t => `- ${t}`).join('\n')}`).join('\n\n') || 'None found.'}`)
        m.push(`## Use cases: reach, mandate and gap\n\n${ucs.map(u => `### ${u.name}\n\nThe agent: ${agentName(u.agent)}. Who uses it: ${u.who || ''}.\n\nReach:\n\n${(u.reach || []).map(r => `- ${r.what} (${r.kind})${citeMd(r.sources)}`).join('\n')}\n\nMandate (illustrative):\n\n${(u.mandate || []).map(x => `- ${x.what}`).join('\n') || '- none stated'}\n\nGap:\n\n${(u.gap || []).map(g => `- ${g.what}`).join('\n') || '- none found'}\n\nControls:\n\n${(u.controls || []).map(c => `- ${c.what}${citeMd(c.sources)}`).join('\n') || '- none found'}\n\nSimulation:\n\n${(u.simulation || []).map((st, i) => `${i + 1}. ${st.action}: ${st.in_mandate ? 'inside the mandate' : 'outside the mandate, in the gap'}${st.note ? `. What RiskMandate's record shows: ${st.note}` : ''}`).join('\n')}`).join('\n\n')}`)
        if ((x.incidents || []).length) m.push(`## Incidents, as reported\n\n${x.incidents.map(i => `- ${i.when ? i.when + ': ' : ''}${i.what}${citeMd(i.sources)}`).join('\n')}`)
        m.push(`## The run\n\n${run.at || ''}${typeof run.cost_usd === 'number' ? `, total cost $${run.cost_usd.toFixed(4)}` : ''}.\n\n${(run.agents || []).map(a => `- ${a.label || a.id} (${a.model || ''}): ${a.ms != null ? (a.ms / 1000).toFixed(1) + ' s' : ''}, ${a.citations ?? '?'} citations, ${a.leads ?? '?'} leads`).join('\n')}`)
        m.push(`## Leads\n\n${(x.leads || []).map(l => `- ${l.model}: ${l.claim} (${l.status}${l.source ? `, ${l.source}` : ''})`).join('\n') || 'None recorded.'}`)
        m.push(`## The questions we would ask (not asked yet)\n\n${(x.questions || []).map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None yet.'}`)
        m.push(`## Sources\n\n${(x.sources || []).map(r => `- ${r.id}: [${r.title || r.url}](${r.url})${r.publisher ? `, ${r.publisher}` : ''} (${r.kind || 'other'}, read ${r.read_on || '?'})`).join('\n')}`)
        twin(rel, title, description, m.join('\n\n'))

        // ---------- the deck ----------
        const slides = []
        const sl = (label, inner) => slides.push(`<section class="slide" aria-label="${esc(label)}">${inner}</section>`)
        sl('Title', `<div class="cover"><p class="kick">X-rayed by RiskMandate</p><h1>${esc(s.subject)}</h1><p class="big">${esc(s.tagline)}</p><p class="cap">Sources read on ${esc(x.read_on || '')} · web-summit.sgit.ai/xray/${esc(s.slug)}</p></div>`)
        sl('What it does', `<p class="kick">What it does</p><h2>${esc(s.subject)}</h2><p class="big">${esc((x.what_it_does || {}).text || '')}</p><p class="cap">Sources: ${esc(((x.what_it_does || {}).sources || []).join(', '))}</p>`)
        sl('Its agents', `<p class="kick">Its AI agents</p><h2>What acts on its own</h2><div class="cols" style="--n:${Math.min(3, Math.max(1, agents.length))}">${agents.slice(0, 3).map(a => `<div class="box"><b>${esc(a.name)}</b>${esc(a.what || '')}<ul>${(a.actions || []).slice(0, 5).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>`)
        for (const u of ucs.slice(0, 3)) sl(`Use case: ${u.name}`, `<p class="kick">Use case · ${esc(agentName(u.agent))}</p><h2>${esc(u.name)}</h2><div class="cols xd-rmg" style="--n:3"><div class="box"><b>Reach</b><ul>${(u.reach || []).slice(0, 6).map(r => `<li>${esc(r.what)} <span class="tag">${esc(r.kind)}</span></li>`).join('')}</ul></div><div class="box"><b>Mandate (illustrative)</b><ul>${(u.mandate || []).slice(0, 6).map(x => `<li>${esc(x.what)}</li>`).join('')}</ul></div><div class="box hi xd-gap"><b>Gap</b><ul>${(u.gap || []).slice(0, 6).map(g => `<li>${esc(g.what)}</li>`).join('')}</ul></div></div>`)
        const u0 = ucs.find(u => (u.simulation || []).length)
        if (u0) sl('The simulation', `<p class="kick">The simulation · ${esc(u0.name)}</p><h2>Each action, placed against the mandate</h2><ol class="xd-sim">${u0.simulation.slice(0, 7).map(st => `<li class="${st.in_mandate ? 'in' : 'out'}"><b>${esc(st.action)}</b> <span class="tag">${st.in_mandate ? 'in the mandate' : 'in the gap'}</span>${st.note ? `<br><span class="xd-note">The record: ${esc(st.note)}</span>` : ''}</li>`).join('')}</ol>`)
        sl('What RiskMandate gives', `<p class="kick">What RiskMandate gives</p><h2>RiskMandate is ${esc(RM_WORDS.path)}.</h2><p class="quote">It ${esc(RM_WORDS.does)}.</p><p class="cap">riskmandate.ai/llms.txt</p>`)
        const srcs = x.sources || []
        sl('Sources', `<p class="kick">Sources</p><h2>Every fact, with its source and the date read</h2><ul class="xd-src">${srcs.slice(0, 10).map(r => `<li><b>${esc(r.id)}</b> ${okUrl(r.url) ? `<a href="${esc(r.url)}">${esc(r.title || r.url)}</a>` : esc(r.title || r.url)} <span class="tag">${esc(r.kind || 'other')}, read ${esc(r.read_on || '')}</span></li>`).join('')}</ul>${srcs.length > 10 ? `<p class="cap">And ${srcs.length - 10} more on <a href="../index.html#sources">the X-ray page</a>.</p>` : ''}`)
        sl('The questions we would ask', `<p class="kick">The questions we would ask</p><h2>We have not asked them yet</h2><ol class="big">${(x.questions || []).slice(0, 6).map(q => `<li>${esc(q)}</li>`).join('')}</ol><p class="cap"><a href="../index.html">The full X-ray</a> · <a href="../run/index.html">What happened: how this X-ray was made</a> · built by xray@web-summit.dinis</p>`)
        const dTitle = `${s.subject}: the X-ray deck`, dDesc = `${s.subject}, X-rayed by RiskMandate, in ${slides.length} slides: what it does, its agents, reach against mandate, the simulation, sources and our questions.`
        const deck = `<p><a href="../index.html">The full X-ray of ${esc(s.subject)}</a> · keys ← → · F fullscreen · A all slides. The plain-text version is this page's markdown twin (index.md).</p><div class="deck xd">${slides.join('\n')}</div><script src="../../../assets/deck.js?v=${VERSION}" defer></script>`
        write(deckRel, page({ rel: deckRel, title: dTitle, description: dDesc, body: deck, mdTwin: deckRel.replace(/\.html$/, '.md'), head: `<link rel="stylesheet" href="../../../assets/xray/xray.css?v=${VERSION}">` }))
        pages.push({ rel: deckRel, title: dTitle, description: dDesc })
        const strip = t => t.replace(/<section[^>]*aria-label="([^"]*)"[^>]*>/g, '\n\n---\n\n').replace(/<h[12][^>]*>/g, '\n## ').replace(/<li[^>]*>/g, '\n- ').replace(/<br>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim()
        twin(deckRel, dTitle, dDesc, `The full X-ray: [../index.md](../index.md)\n\n${strip(slides.join('\n'))}`)
    }
}

// ======================================================================================================================
// What happened: how each X-ray was made (xray@web-summit.dinis, 7 November 2026, at Dinis's word: "add a big section
// to visualise and explain everything that happened with those agentic calls"). Per subject, /xray/<slug>/run/ walks
// through the run in the order it happened (the ask, each search agent's call, claims to facts, the reading agent, the
// review, the cost), from the raw search record (data/xray/<slug>/search/<stamp>.json) and xray.json's run, leads,
// sources, reading and review. Readable without JavaScript (bars, cards and tables are HTML); assets/xray-run.js draws
// the fan-out, the flow from claims to facts and the presenter mode on top. /xray/how/ is the pipeline and the totals
// across every subject. Every number comes from the files; model text is shown as said (em-dashes become commas).
// ======================================================================================================================
const GH = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/'
const MODELS = ['perplexity', 'openai', 'gemini', 'openrouter']
const STATUSES = [['confirmed', 'confirmed'], ['not-found', 'not found'], ['unverified', 'unverified']]
const SRC_KINDS = ['own-site', 'docs', 'press', 'filing', 'other']
const nodash = s => String(s ?? '').replace(/\s*\u2014\s*/g, ', ')
const E = s => esc(nodash(s))
const secs = ms => (ms / 1000).toFixed(1) + ' s'
const usd = n => typeof n === 'number' ? '$' + n.toFixed(4) : 'not reported'
const int = n => typeof n === 'number' ? n.toLocaleString('en-GB') : ''
const pct = (a, b) => b ? Math.round(100 * a / b) : 0
const mcls = id => MODELS.includes(id) ? `xr-m-${id}` : 'xr-m-other'
const whenUtc = at => { const t = Date.parse(at || ''); return isNaN(t) ? String(at || '') : new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC' }
const KIND_A = { company: 'a company', 'use-case': 'a use case', industry: 'an industry' }

// the newest search record for a subject, or null
export function loadSearch(ROOT, slug) {
    const dir = path.join(ROOT, 'data/xray', slug, 'search')
    if (!fs.existsSync(dir)) return null
    const f = fs.readdirSync(dir).filter(n => /^\d{8}T\d{6}Z\.json$/.test(n)).sort().pop()
    if (!f) return null
    try { return { file: `data/xray/${slug}/search/${f}`, ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) } } catch (e) { throw new Error(`data/xray/${slug}/search/${f}: ${e.message}`) }
}

// everything the run page and the totals need, from the two files
export function runFacts(s) {
    const x = s.x, sr = s.search || { agents: (x.run || {}).agents || [] }
    const leads = x.leads || []
    const count = (arr, k, v) => arr.filter(o => o[k] === v).length
    const itemsIn = an => an ? ['ai_agents', 'use_cases', 'incidents_or_risks', 'facts'].reduce((n, k) => n + (Array.isArray(an[k]) ? an[k].length : 0), 0) : 0
    const agents = (sr.agents || []).map(a => {
        const an = a.answer && typeof a.answer === 'object' ? a.answer : null
        const cites = (a.citations || []).map(c => typeof c === 'string' ? c : c && c.url).filter(Boolean)
        const named = a.answer_urls || []
        const sample = an ? [...(an.facts || []).map(f => f && f.claim), ...(an.ai_agents || []).map(g => g && g.name && `${g.name}: ${g.what_it_does || ''}`)].filter(Boolean).slice(0, 3) : []
        const mine = leads.filter(l => l.model === a.id)
        return {
            id: a.id, label: a.label || a.id, model: a.model || '', ms: a.ms ?? null, cost: typeof a.cost_usd === 'number' ? a.cost_usd : null,
            tin: a.tokens ? a.tokens.in : null, tout: a.tokens ? a.tokens.out : null, finish: a.finish || (a.error ? 'error' : ''), error: a.error || '',
            max_tokens: a.max_tokens || DEFAULT_MAX_TOKENS, web_plugin: (a.plugins || []).some(p => p && p.id === 'web'),
            cites: cites.length, named: named.length, urls: new Set([...cites, ...named]).size, items: itemsIn(an), json: !!an,
            sample: sample.map(t => clipWords(nodash(t).replace(/\s*\[\d+\](\[\d+\])*/g, ''), 240)),
            leads: { total: mine.length, confirmed: count(mine, 'status', 'confirmed'), 'not-found': count(mine, 'status', 'not-found'), unverified: count(mine, 'status', 'unverified') },
        }
    }).sort((a, b) => (MODELS.indexOf(a.id) + 1 || 9) - (MODELS.indexOf(b.id) + 1 || 9))
    const status = Object.fromEntries(STATUSES.map(([k]) => [k, count(leads, 'status', k)]))
    const kinds = Object.fromEntries(SRC_KINDS.map(k => [k, (x.sources || []).filter(r => (SRC_KINDS.includes(r.kind) ? r.kind : 'other') === k).length]))
    const at = sr.run_at || (x.run || {}).at || ''
    const rd = x.reading || null
    const t0 = Date.parse(at), t1 = rd ? Date.parse(rd.finished || '') : NaN
    const cost = typeof sr.cost_usd === 'number' ? sr.cost_usd : agents.reduce((n, a) => n + (a.cost || 0), 0)
    return {
        slug: s.slug, subject: s.subject, typed: sr.subject || s.subject, kind: sr.kind || s.kind, at, file: sr.file || '',
        agents, leads, status, kinds, cost, wall_ms: Math.max(0, ...agents.map(a => a.ms || 0)),
        tin: agents.reduce((n, a) => n + (a.tin || 0), 0), tout: agents.reduce((n, a) => n + (a.tout || 0), 0),
        reading: rd, review: x.review || null, sources: x.sources || [],
        to_read_min: !isNaN(t0) && !isNaN(t1) && t1 > t0 ? Math.round((t1 - t0) / 60000) : null,
    }
}

// ---------- HTML pieces, shared by the run pages and /xray/how/ ----------
const legendHtml = ids => `<p class="xr-key">${ids.map(([cls, label]) => `<span><i class="xr-sw ${cls}"></i>${E(label)}</span>`).join('')}</p>`
// a horizontal stacked bar: parts [{ cls, label, value, text }]
const stackHtml = (parts, label) => { const tot = parts.reduce((n, p) => n + p.value, 0) || 1; return `<div class="xr-stack" role="img" aria-label="${E(label)}">${parts.filter(p => p.value > 0).map(p => `<span class="xr-seg ${p.cls}" style="width:${(100 * p.value / tot).toFixed(2)}%" title="${E(p.label)}: ${E(p.text)}"><b>${E(p.text)}</b></span>`).join('')}</div>` }
// one bar per row, each labelled: rows [{ label, value, text, cls }]
const barsHtml = (rows, cls = '') => { const max = Math.max(1, ...rows.map(r => r.value)); return `<div class="xr-bars ${cls}">${rows.map(r => `<div class="xr-bar-row"><span class="xr-bar-lab">${E(r.label)}</span><span class="xr-bar-track"><span class="xr-bar ${r.cls || ''}" style="width:${(100 * r.value / max).toFixed(2)}%"></span></span><span class="xr-bar-val">${E(r.text ?? r.value)}</span></div>`).join('')}</div>` }
const tilesHtml = tiles => `<div class="xr-tiles">${tiles.map(([n, l]) => `<div class="xr-tile"><b>${E(n)}</b><span>${E(l)}</span></div>`).join('')}</div>`
const statusParts = c => STATUSES.map(([k, w]) => ({ cls: `xr-s-${k}`, label: w, value: c[k] || 0, text: String(c[k] || 0) }))
const RM_PARA = `The X-ray is a demonstration, made by agents. RiskMandate ${RM_WORDS.does}. It is ${RM_WORDS.path} (riskmandate.ai/llms.txt). Nothing on this page claims more for it.`

export function buildXrayRuns({ list, write, page, twin, pages, VERSION }) {
    const head = up => `<link rel="stylesheet" href="${up}assets/xray/xray.css?v=${VERSION}"><script src="${up}assets/xray-run.js?v=${VERSION}" defer></script>`
    const all = []
    for (const s of list) {
        const R = runFacts(s); all.push(R)
        const rel = `xray/${s.slug}/run/index.html`
        const title = `What happened: how the ${s.subject} X-ray was made`
        const description = `How the X-ray of ${s.subject} was made, step by step: the question, the four search agents' calls, their claims checked against the sources, the reading agent, the review and the cost. Every number from the run's own files.`
        const nAg = R.agents.length, nL = R.leads.length, rd = R.reading
        const prompt = ask(R.typed, R.kind)
        const h = [], m = []
        const step = (i, id, name, inner) => `<section class="xr-sec" id="${id}" data-step="${i}"><p class="xr-stepno">Step ${i} of 6</p><h2>${i}. ${name}</h2>${inner}</section>`
        h.push(`<p class="meta"><a href="../index.html">The X-ray of ${E(s.subject)}</a> · <a href="../deck/index.html">the deck</a> · <a href="../../how/index.html">how every X-ray is made</a> · <a href="../../index.html">X-ray another name</a></p>`)
        h.push(`<p class="xr-lede">This page shows what the agents did to make <a href="../index.html">the X-ray of ${E(s.subject)}</a>, in the order it happened. Every number comes from two files: the raw record of the search (<a href="${GH}${E(R.file)}">${E(R.file)}</a>) and the X-ray itself (<a href="${GH}data/xray/${E(s.slug)}/xray.json">data/xray/${E(s.slug)}/xray.json</a>).</p>`)
        h.push(`<div class="xr-walkbar" id="xr-walkbar" hidden></div>`)
        const S = []
        // a. the ask
        S.push(step(1, 'ask', 'The ask', `<p>On <b>${E(whenUtc(R.at))}</b>, xray@web-summit.dinis typed one line into the search tool (<code>admin/tools/xray-search.mjs</code>): <b>"${E(R.typed)}"</b>, as ${E(KIND_A[R.kind] || R.kind)}. It was not typed at the booth: that path is still being built (WS-194).</p>
<div class="xr-viz xr-dark" id="xr-fan" aria-hidden="true"></div>
<p>The search tool is the orchestrator. It sent the <b>same question</b> to <b>${nAg} search agents at the same moment</b>, through OpenRouter, and waited for all of them. Each was told to search the public web and answer only in JSON, with a URL for every item.</p>
<ol class="xr-fan-list">${R.agents.map(a => `<li><i class="xr-sw ${mcls(a.id)}"></i><b>${E(a.label)}</b> <code>${E(a.model)}</code></li>`).join('')}</ol>
<details class="xr-prompt"><summary>The exact question each agent was sent</summary><pre>${E(prompt)}</pre><p class="meta">Rebuilt from <code>admin/tools/xray-ask.mjs</code> with this run's subject and kind. The question has not changed since the first run.</p></details>`))
        m.push(`## 1. The ask\n\nOn ${whenUtc(R.at)}, xray@web-summit.dinis typed "${R.typed}" (${KIND_A[R.kind] || R.kind}) into the search tool (admin/tools/xray-search.mjs). It was not typed at the booth (WS-194). The search tool, the orchestrator, sent the same question to ${nAg} search agents at once, through OpenRouter:\n\n${R.agents.map(a => `- ${a.label} (${a.model})`).join('\n')}\n\nThe exact question:\n\n\`\`\`\n${prompt}\n\`\`\``)
        // b. each search agent's call
        const maxMs = Math.max(1, R.wall_ms), tick = [1000, 2000, 5000, 10000, 20000].find(t => maxMs / t <= 4) || 30000
        const ticks = []; for (let t = 0; t <= maxMs; t += tick) ticks.push(t)
        const gantt = `<div class="xr-gantt" id="xr-gantt" data-max="${maxMs}"><p class="xr-g-clock" aria-hidden="true"></p>${R.agents.map(a => `<div class="xr-g-row"><span class="xr-g-lab">${E(a.label)}</span><span class="xr-g-track"><span class="xr-g-bar ${mcls(a.id)}" data-ms="${a.ms || 0}" style="width:${(100 * (a.ms || 0) / maxMs).toFixed(2)}%"></span></span><span class="xr-g-val">${a.ms != null ? secs(a.ms) : ''}</span></div>`).join('')}<div class="xr-g-axis" aria-hidden="true"><span class="xr-g-lab"></span><span class="xr-g-track">${ticks.map(t => `<i style="left:${(100 * t / maxMs).toFixed(2)}%">${t / 1000} s</i>`).join('')}</span><span class="xr-g-val"></span></div></div>`
        const card = a => `<article class="xr-acard ${mcls(a.id)}"><h3>${E(a.label)}</h3><p class="meta"><code>${E(a.model)}</code>${a.web_plugin ? ', with OpenRouter\'s web search plugin' : ''}</p>${a.error ? `<p><b>It failed:</b> ${E(a.error)}</p>` : ''}<dl>
<dt>Time</dt><dd>${a.ms != null ? secs(a.ms) : 'not recorded'}</dd>
<dt>Tokens in / out</dt><dd>${int(a.tin)} / ${int(a.tout)}</dd>
<dt>Cost</dt><dd>${usd(a.cost)}</dd>
<dt>Finished</dt><dd>${E(a.finish === 'stop' ? 'stop: it finished its answer' : a.finish === 'length' ? `length: cut off at its ${a.max_tokens}-token limit` : a.finish || 'not recorded')}</dd>
<dt>URLs given</dt><dd>${a.urls} (${a.cites} returned as citations, ${a.named} named in its answer)</dd>
<dt>Items in its answer</dt><dd>${a.items}${a.json ? '' : ' (the answer was not JSON)'}</dd>
<dt>Leads checked</dt><dd>${a.leads.total}: ${a.leads.confirmed} confirmed, ${a.leads['not-found']} not found, ${a.leads.unverified} unverified</dd></dl>
${a.sample.length ? `<p class="meta">Some of what it said, word for word:</p><ul class="xr-said">${a.sample.map(t => `<li>${E(t)}</li>`).join('')}</ul>` : ''}</article>`
        S.push(step(2, 'calls', 'Each search agent\'s call', `<p>Each search agent is a model, called through OpenRouter, asked to search the web and answer in JSON. All ${nAg} started together; each bar runs from the moment the question went out to the moment its answer came back. The whole fan-out took <b>${secs(R.wall_ms)}</b>, the time of the slowest.</p>
<div class="xr-viz xr-dark">${gantt}<p class="xr-actions"><button type="button" class="xr-btn" data-gantt-replay hidden>Replay the calls</button></p></div>
<div class="xr-acards">${R.agents.map(card).join('')}</div>
<p class="meta">"Citations" are the URLs OpenRouter returned beside the answer; only Perplexity returns them for a JSON answer. "Named in its answer" are the URLs inside the JSON. Both are leads: nothing is taken from them until a source is read. "Tokens in" is how much each model was given to read: thousands when web results were added to the question, a few hundred when it had little beyond the question itself (see <a href="../../decide/index.html#agents">the experiments</a> on whether Gemini searched at all).</p>`))
        m.push(`## 2. Each search agent's call\n\nEach search agent is a model, called through OpenRouter, asked to search the web and answer in JSON. All started together; the fan-out took ${secs(R.wall_ms)}.\n\n| Agent | Model | Time | Tokens in | Tokens out | Cost | Finish | URLs given | Items in answer | Leads checked |\n|---|---|---|---|---|---|---|---|---|---|\n${R.agents.map(a => `| ${a.label} | ${a.model} | ${a.ms != null ? secs(a.ms) : ''} | ${a.tin ?? ''} | ${a.tout ?? ''} | ${usd(a.cost)} | ${a.finish} | ${a.urls} | ${a.items} | ${a.leads.total} |`).join('\n')}\n\n${R.agents.filter(a => a.sample.length).map(a => `Some of what ${a.label} said:\n\n${a.sample.map(t => `- ${t}`).join('\n')}`).join('\n\n')}`)
        // c. claims to facts
        const notOk = R.leads.filter(l => l.status !== 'confirmed')
        const flowRows = R.agents.map(a => `<tr><td><i class="xr-sw ${mcls(a.id)}"></i>${E(a.label)}</td><td>${a.leads.total}</td>${STATUSES.map(([k]) => `<td>${a.leads[k]}</td>`).join('')}</tr>`).join('')
        S.push(step(3, 'facts', 'From claims to facts', `<p class="xr-big">What a model says is a lead. Only what we read on its source reaches the page.</p>
<p>The reading agent turned the ${nAg} answers into <b>${nL} leads</b>, each tagged with the model that said it, and looked for each one on a source it read. <b>${R.status.confirmed} confirmed</b>, <b>${R.status['not-found']} not found</b>, <b>${R.status.unverified} unverified</b>.</p>
<div class="xr-viz xr-dark" id="xr-sankey" aria-hidden="true"></div>
${stackHtml(statusParts(R.status), `${nL} leads: ${R.status.confirmed} confirmed, ${R.status['not-found']} not found, ${R.status.unverified} unverified`)}
${legendHtml(STATUSES.map(([k, w]) => [`xr-s-${k}`, w]))}
<ul class="xr-defs"><li><b>Confirmed</b>: a source we read says it.</li><li><b>Not found</b>: we read the source, or looked for one, and it does not say it.</li><li><b>Unverified</b>: we could not read the source (for example, the site refused us), so it stays a lead.</li></ul>
<div class="scroll"><table class="xr-t"><tr><th>Agent</th><th>Leads</th><th>Confirmed</th><th>Not found</th><th>Unverified</th></tr>${flowRows}<tr><th>All</th><th>${nL}</th>${STATUSES.map(([k]) => `<th>${R.status[k]}</th>`).join('')}</tr></table></div>
<h3>What did not hold up, and why</h3>${notOk.length ? `<div class="scroll"><table class="xr-t xr-nf"><tr><th>Model</th><th>What the model said</th><th>Status</th><th>Why</th></tr>${notOk.map(l => `<tr><td>${E(l.model)}</td><td>${E(l.claim)}</td><td><span class="xr-st xr-st-${E(l.status)}">${E(l.status)}</span></td><td>${E(l.note || 'No note recorded.')}</td></tr>`).join('')}</table></div>` : '<p>Every lead was confirmed.</p>'}`))
        m.push(`## 3. From claims to facts\n\nWhat a model says is a lead. Only what we read on its source reaches the page. The reading agent turned the answers into ${nL} leads: ${R.status.confirmed} confirmed, ${R.status['not-found']} not found, ${R.status.unverified} unverified.\n\n| Agent | Leads | Confirmed | Not found | Unverified |\n|---|---|---|---|---|\n${R.agents.map(a => `| ${a.label} | ${a.leads.total} | ${a.leads.confirmed} | ${a.leads['not-found']} | ${a.leads.unverified} |`).join('\n')}\n\nWhat did not hold up, and why:\n\n${notOk.map(l => `- ${l.model} (${l.status}): ${nodash(l.claim)} Why: ${nodash(l.note || 'no note recorded')}`).join('\n') || 'Every lead was confirmed.'}`)
        // d. the reading agent
        const kindRows = SRC_KINDS.map(k => ({ label: k, value: R.kinds[k], text: String(R.kinds[k]), cls: 'xr-bar-src' }))
        S.push(step(4, 'reading', 'The reading agent', `<p>${rd ? `${E(rd.by ? rd.by.charAt(0).toUpperCase() + rd.by.slice(1) : 'A reading agent')}. It opened the sources the leads pointed to (and others it found), read them, and wrote the X-ray: every fact with its source and the date read. It finished at ${E(whenUtc(rd.finished))}.` : 'No record of the reading agent was kept for this X-ray.'}</p>
${tilesHtml([[String(R.sources.length), 'sources read'], ...(rd ? [[String(rd.tool_calls), 'tool calls'], [`${Math.floor(rd.seconds / 60)} min ${rd.seconds % 60} s`, 'reading time'], [`${rd.tokens_thousands}k`, 'tokens used']] : [])])}
<h3>The sources, by kind</h3>${barsHtml(kindRows)}
<details class="xr-more"><summary>All ${R.sources.length} sources, with the date each was read</summary><div class="scroll"><table class="xr-t"><tr><th>Id</th><th>Source</th><th>Kind</th><th>Read</th></tr>${R.sources.map(r => `<tr><td>${E(r.id)}</td><td>${okUrl(r.url) ? `<a href="${esc(r.url)}">${E(r.title || r.url)}</a>` : E(r.title || r.url)}${r.publisher ? `, ${E(r.publisher)}` : ''}</td><td>${E(r.kind || 'other')}</td><td>${E(r.read_on || '')}</td></tr>`).join('')}</table></div></details>`))
        m.push(`## 4. The reading agent\n\n${rd ? `${rd.by}. Sources read: ${R.sources.length}. Tool calls: ${rd.tool_calls}. Time: ${rd.seconds} s. Tokens: about ${rd.tokens_thousands} thousand. Finished: ${whenUtc(rd.finished)}.` : 'Not recorded.'}\n\nSources by kind: ${SRC_KINDS.map(k => `${k} ${R.kinds[k]}`).join(', ')}.\n\n${R.sources.map(r => `- ${r.id}: [${nodash(r.title || r.url)}](${r.url}) (${r.kind || 'other'}, read ${r.read_on || '?'})`).join('\n')}`)
        // e. the review
        const rv = R.review
        S.push(step(5, 'review', 'The review', rv ? `<p><b>${E(rv.by)}</b> reviewed the X-ray on ${E(rv.on)} before it was published. What the review changed or checked:</p><ol class="xr-review">${(rv.notes || []).map(n => `<li>${E(n)}</li>`).join('')}</ol>` : '<p>No review was recorded for this X-ray.</p>'))
        m.push(`## 5. The review\n\n${rv ? `${rv.by}, on ${rv.on}:\n\n${(rv.notes || []).map(n => `- ${nodash(n)}`).join('\n')}` : 'No review recorded.'}`)
        // f. what it cost
        const costParts = R.agents.map(a => ({ cls: mcls(a.id), label: a.label, value: a.cost || 0, text: usd(a.cost) }))
        S.push(step(6, 'cost', 'What it cost', `<p>The search cost <b>${usd(R.cost)}</b> in all, as OpenRouter reported it for each call.</p>
${stackHtml(costParts, `Search cost by agent, total ${usd(R.cost)}`)}${legendHtml(R.agents.map(a => [mcls(a.id), `${a.label}: ${usd(a.cost)} (${pct(a.cost || 0, R.cost)}%)`]))}
<p>The reading was done by a Claude Code sub-agent in the session: no OpenRouter spend. Its cost is not recorded in dollars${rd ? `, only as about ${rd.tokens_thousands} thousand tokens` : ''}.</p>
${tilesHtml([[secs(R.wall_ms), 'the search, four agents in parallel'], ...(rd ? [[`${Math.round(rd.seconds / 60)} min`, 'the reading'] ] : []), ...(R.to_read_min != null ? [[`${R.to_read_min} min`, 'from the search starting to the reading finished'] ] : []), [`${int(R.tin)} / ${int(R.tout)}`, 'search tokens in / out']])}
<p class="meta">The time between the search and the start of the reading, and the time the review took, are not recorded.</p>`))
        m.push(`## 6. What it cost\n\nSearch: ${usd(R.cost)} in all (${R.agents.map(a => `${a.label} ${usd(a.cost)}`).join(', ')}). The reading was done by a Claude Code sub-agent in the session: no OpenRouter spend${rd ? `, about ${rd.tokens_thousands} thousand tokens` : ''}. The search took ${secs(R.wall_ms)}${rd ? `; the reading ${rd.seconds} s` : ''}${R.to_read_min != null ? `; ${R.to_read_min} minutes from the search starting to the reading finished` : ''}.`)
        h.push(`<div class="xr-runpage" id="xr-runpage">${S.join('\n')}</div>`)
        h.push(`<h2 id="riskmandate">What RiskMandate is and is not in this</h2><p>${E(RM_PARA)}</p>`)
        m.push(`## What RiskMandate is and is not in this\n\n${RM_PARA}`)
        h.push(`<p class="meta">Built by xray@web-summit.dinis from <a href="${GH}${E(R.file)}">${E(R.file)}</a> and <a href="${GH}data/xray/${E(s.slug)}/xray.json">data/xray/${E(s.slug)}/xray.json</a>. <a href="../../how/index.html">How every X-ray is made</a>.</p>`)
        const data = { subject: nodash(R.subject), typed: nodash(R.typed), agents: R.agents.map(a => ({ id: a.id, label: a.label, model: a.model, ms: a.ms, leads: a.leads })), status: R.status }
        h.push(`<script type="application/json" id="xr-run-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
        const body = nodash(h.join('\n'))
        write(rel, page({ rel, title, description, body, mdTwin: rel.replace(/\.html$/, '.md'), head: head('../../../') }))
        pages.push({ rel, title, description })
        twin(rel, title, description, nodash(`From ${R.file} and data/xray/${s.slug}/xray.json. The X-ray: [../index.md](../index.md). How every X-ray is made: [../../how/index.md](../../how/index.md).\n\n${m.join('\n\n')}`))
    }
    buildHow({ all, exp: list.experiments || [], write, page, twin, pages, head })
}

// /xray/how/: the pipeline, and the totals across every subject
function buildHow({ all, exp, write, page, twin, pages, head }) {
    const rel = 'xray/how/index.html', title = 'How an X-ray is made'
    const description = `How an X-ray is made: a typed name, four search agents, leads checked against sources a reading agent read, a review, then the page. With the totals across all ${all.length} X-rays: cost, tokens, and how often each model's claims held up.`
    const sum = f => all.reduce((n, R) => n + (f(R) || 0), 0)
    const calls = sum(R => R.agents.length), cost = sum(R => R.cost), nL = sum(R => R.leads.length)
    const st = Object.fromEntries(STATUSES.map(([k]) => [k, sum(R => R.status[k])]))
    const kinds = Object.fromEntries(SRC_KINDS.map(k => [k, sum(R => R.kinds[k])]))
    const nSrc = sum(R => R.sources.length), rdCalls = sum(R => R.reading && R.reading.tool_calls), rdSec = sum(R => R.reading && R.reading.seconds), rdTok = sum(R => R.reading && R.reading.tokens_thousands)
    const toRead = all.map(R => R.to_read_min).filter(n => n != null).sort((a, b) => a - b)
    const median = toRead.length ? toRead[Math.floor(toRead.length / 2)] : null
    const per = MODELS.map(id => {
        const as = all.map(R => R.agents.find(a => a.id === id)).filter(Boolean)
        const lead = Object.fromEntries(['total', ...STATUSES.map(([k]) => k)].map(k => [k, as.reduce((n, a) => n + a.leads[k], 0)]))
        return { id, label: (as[0] || {}).label || id, model: (as[0] || {}).model || '', runs: as.length, cost: as.reduce((n, a) => n + (a.cost || 0), 0), ms: as.reduce((n, a) => n + (a.ms || 0), 0) / (as.length || 1), tin: as.reduce((n, a) => n + (a.tin || 0), 0), tout: as.reduce((n, a) => n + (a.tout || 0), 0), urls: as.reduce((n, a) => n + a.urls, 0) / (as.length || 1), lead }
    }).filter(p => p.runs)
    const STEPS = [
        ['A name is typed', 'One line: a company, a use case or an industry.'],
        ['The orchestrator', 'The search tool sends the same question to four search agents at once.'],
        ['Four search agents', 'Each model, called through OpenRouter, is asked to search the web and answer in JSON, with a URL for every item.'],
        ['Leads', 'Every claim in the answers is a lead, tagged with the model that said it. Not a fact yet.'],
        ['The reading agent', 'A Claude Code sub-agent opens the sources and reads them.'],
        ['Sources read', 'Each with its URL and the date read.'],
        ['The verified record', 'xray.json: only what a source we read says, each lead marked confirmed, not found or unverified.'],
        ['The review', 'xray@web-summit.dinis checks the record and changes what does not hold.'],
        ['Page, deck and run log', 'The X-ray page, the deck for the stand, and the run page that shows how it was made.'],
    ]
    const h = [], m = []
    h.push(`<p class="meta"><a href="../index.html">X-ray a name</a> · every X-ray's own story is on its run page, listed below.</p>`)
    h.push(`<p class="xr-lede">An X-ray is made by agents, in nine steps. A model's answer is only ever a lead; a fact reaches the page only once a source has been read. Below: the pipeline, then what happened across all <b>${all.length}</b> X-rays made so far.</p>`)
    h.push(`<div class="xr-viz xr-dark xr-pipe-wrap"><div id="xr-pipe" aria-hidden="true"></div><p class="xr-actions"><button type="button" class="xr-btn" data-pipe-pause hidden>Pause</button></p></div>`)
    h.push(`<ol class="xr-steps">${STEPS.map(([t, d]) => `<li><b>${E(t)}</b>: ${E(d)}</li>`).join('')}</ol>`)
    m.push(`## The pipeline\n\n${STEPS.map(([t, d], i) => `${i + 1}. ${t}: ${d}`).join('\n')}`)
    h.push(`<h2 id="totals">Across every X-ray</h2>${tilesHtml([[String(all.length), 'X-rays'], [String(calls), 'search agent calls'], [usd(cost), 'search cost in all'], [`${int(sum(R => R.tin))} / ${int(sum(R => R.tout))}`, 'search tokens in / out'], [String(nL), 'leads checked'], [`${pct(st.confirmed, nL)}%`, 'confirmed'], [String(nSrc), 'sources read'], [String(rdCalls), 'reading tool calls'], [`${Math.round(rdSec / 60)} min`, 'reading time in all'], [`${rdTok}k`, 'reading tokens'], ...(median != null ? [[`${median} min`, 'search to reading finished (median)']] : [])])}`)
    m.push(`## Across every X-ray\n\n${all.length} X-rays; ${calls} search agent calls; search cost ${usd(cost)}; search tokens ${sum(R => R.tin)} in, ${sum(R => R.tout)} out; ${nL} leads checked, ${st.confirmed} confirmed (${pct(st.confirmed, nL)}%), ${st['not-found']} not found, ${st.unverified} unverified; ${nSrc} sources read; reading: ${rdCalls} tool calls, ${Math.round(rdSec / 60)} minutes, about ${rdTok} thousand tokens${median != null ? `; median ${median} minutes from the search starting to the reading finished` : ''}.`)
    h.push(`<h2 id="models">Each model, against what we read</h2><p>The real result of the experiment: every lead each model gave, across all ${all.length} X-rays, and what reading the sources found. Each bar is one model's leads, split by what happened to them.</p>
<div class="xr-viz xr-dark"><div class="xr-mbars">${per.map(p => `<div class="xr-mrow"><p class="xr-mlab"><i class="xr-sw xr-m-${p.id}"></i><b>${E(p.label)}</b> <code>${E(p.model)}</code> <span>${p.lead.total} leads, ${pct(p.lead.confirmed, p.lead.total)}% confirmed</span></p>${stackHtml(statusParts(p.lead), `${p.label}: ${p.lead.total} leads`)}</div>`).join('')}</div>${legendHtml(STATUSES.map(([k, w]) => [`xr-s-${k}`, w]))}</div>
<div class="scroll"><table class="xr-t"><tr><th>Agent (model)</th><th>Runs</th><th>Leads</th><th>Confirmed</th><th>Not found</th><th>Unverified</th><th>Cost in all</th><th>Average time</th><th>Tokens in / out</th><th>URLs given per run</th></tr>${per.map(p => `<tr><td>${E(p.label)}<br><code>${E(p.model)}</code></td><td>${p.runs}</td><td>${p.lead.total}</td><td>${p.lead.confirmed} (${pct(p.lead.confirmed, p.lead.total)}%)</td><td>${p.lead['not-found']} (${pct(p.lead['not-found'], p.lead.total)}%)</td><td>${p.lead.unverified} (${pct(p.lead.unverified, p.lead.total)}%)</td><td>${usd(p.cost)}</td><td>${secs(p.ms)}</td><td>${int(p.tin)} / ${int(p.tout)}</td><td>${p.urls.toFixed(1)}</td></tr>`).join('')}</table></div>
<p class="meta">A lead is one claim, as the reading agent wrote it down from a model's answer. Unverified mostly means a site refused the reading agent (for example, with a 403), not that the model was wrong.</p>`)
    m.push(`## Each model, against what we read\n\n| Agent | Model | Runs | Leads | Confirmed | Not found | Unverified | Cost in all | Average time | Tokens in / out |\n|---|---|---|---|---|---|---|---|---|---|\n${per.map(p => `| ${p.label} | ${p.model} | ${p.runs} | ${p.lead.total} | ${p.lead.confirmed} (${pct(p.lead.confirmed, p.lead.total)}%) | ${p.lead['not-found']} | ${p.lead.unverified} | ${usd(p.cost)} | ${secs(p.ms)} | ${p.tin} / ${p.tout} |`).join('\n')}`)
    h.push(`<h2 id="sources">Sources read, by kind</h2>${barsHtml(SRC_KINDS.map(k => ({ label: k, value: kinds[k], text: String(kinds[k]), cls: 'xr-bar-src' })))}`)
    m.push(`## Sources read, by kind\n\n${SRC_KINDS.map(k => `- ${k}: ${kinds[k]}`).join('\n')}`)
    h.push(`<h2 id="each">Each X-ray, and how it was made</h2><div class="scroll"><table class="xr-t"><tr><th>Subject</th><th>Searched</th><th>Search cost</th><th>Leads</th><th>Confirmed</th><th>Not found</th><th>Unverified</th><th>Sources</th><th>To read</th></tr>${all.map(R => `<tr><td><a href="../${E(R.slug)}/run/index.html">${E(R.subject)}</a></td><td>${E(whenUtc(R.at))}</td><td>${usd(R.cost)}</td><td>${R.leads.length}</td>${STATUSES.map(([k]) => `<td>${R.status[k]}</td>`).join('')}<td>${R.sources.length}</td><td>${R.to_read_min != null ? R.to_read_min + ' min' : ''}</td></tr>`).join('')}</table></div><p class="meta">"To read": minutes from the search starting to the reading agent finishing.${exp.length ? ` ${exp.length} more searches (${E(exp.join('; '))}) were experiments with no reading, so they are not counted here.` : ''}</p>`)
    m.push(`## Each X-ray\n\n${all.map(R => `- [${R.subject}](../${R.slug}/run/index.md): searched ${whenUtc(R.at)}, ${usd(R.cost)}, ${R.leads.length} leads (${R.status.confirmed} confirmed, ${R.status['not-found']} not found, ${R.status.unverified} unverified), ${R.sources.length} sources${R.to_read_min != null ? `, ${R.to_read_min} minutes to read` : ''}`).join('\n')}${exp.length ? `\n\n${exp.length} more searches (${exp.join('; ')}) were experiments with no reading, and are not counted.` : ''}`)
    const CANNOT = [
        'A name typed at the booth is not run live yet. The request path is being built (WS-194). Every X-ray here was run by xray@web-summit.dinis before the event.',
        'Each search is one call per agent, once. Run again on another day, the same models may give other leads.',
        'The reading agent\'s cost is not recorded in dollars, only in tokens. The search cost is what OpenRouter reported.',
        'The mandates, and the simulation steps placed against them, are illustrative: our judgement of what a deployer would plausibly authorise, not the company\'s own policy.',
        'A site that refuses a reading agent leaves its leads unverified. They are listed, not dropped.',
        'The review is by one agent, xray@web-summit.dinis.',
    ]
    h.push(`<h2 id="cannot">What this cannot do yet</h2><ul>${CANNOT.map(t => `<li>${E(t)}</li>`).join('')}</ul>`)
    m.push(`## What this cannot do yet\n\n${CANNOT.map(t => `- ${t}`).join('\n')}`)
    h.push(`<h2 id="riskmandate">What RiskMandate is and is not in this</h2><p>${E(RM_PARA)}</p>`)
    m.push(`## What RiskMandate is and is not in this\n\n${RM_PARA}`)
    h.push(`<script type="application/json" id="xr-how-data">${JSON.stringify({ steps: STEPS.map(s => s[0]), models: per.map(p => ({ id: p.id, label: p.label })) }).replace(/</g, '\\u003c')}</script>`)
    write(rel, page({ rel, title, description, body: nodash(h.join('\n')), mdTwin: 'xray/how/index.md', head: head('../../') }))
    pages.push({ rel, title, description })
    twin(rel, title, description, nodash(m.join('\n\n')))
}
