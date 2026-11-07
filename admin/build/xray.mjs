// The RiskMandate X-ray (xray@web-summit.dinis, 7 November 2026, for the booth at Web Summit, 9 to 12 November):
// data/xray/<slug>/xray.json -> xray/<slug>/index.html (readable without JavaScript: what the subject does, its agents,
// each use case's reach, mandate, gap and controls, the simulation, incidents, leads, questions and every source with
// its URL and the date read) and xray/<slug>/deck/index.html (8 to 10 slides, presented by assets/deck.js).
// /xray/ itself is content/xray.md; its ```xray fence becomes the mount for assets/xray.js plus the list of subjects.
// What a model says is a lead; only facts whose sources were read reach a page. RiskMandate's words are its own,
// from riskmandate.ai/llms.txt, and nothing else is claimed for it.
import fs from 'fs'
import path from 'path'
import { esc } from './text.mjs'

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
        out.push({ slug, subject: x.subject || slug, kind: x.kind || 'company', tagline: x.tagline || '', status: x.status || 'prepared', read_on: x.read_on || '', x })
    }
    return out.sort((a, b) => (a.status === 'prepared' ? 0 : 1) - (b.status === 'prepared' ? 0 : 1) || a.subject.localeCompare(b.subject))
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
        h.push(`<p class="meta">${esc(KINDS[s.kind] || s.kind)} · ${esc(s.status)}${x.read_on ? ` · sources read on ${esc(x.read_on)}` : ''} · <a href="deck/index.html">the deck</a> · <a href="../index.html">X-ray another name</a></p>`)
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
        sl('The questions we would ask', `<p class="kick">The questions we would ask</p><h2>We have not asked them yet</h2><ol class="big">${(x.questions || []).slice(0, 6).map(q => `<li>${esc(q)}</li>`).join('')}</ol><p class="cap"><a href="../index.html">The full X-ray</a> · built by xray@web-summit.dinis</p>`)
        const dTitle = `${s.subject}: the X-ray deck`, dDesc = `${s.subject}, X-rayed by RiskMandate, in ${slides.length} slides: what it does, its agents, reach against mandate, the simulation, sources and our questions.`
        const deck = `<p><a href="../index.html">The full X-ray of ${esc(s.subject)}</a> · keys ← → · F fullscreen · A all slides. The plain-text version is this page's markdown twin (index.md).</p><div class="deck xd">${slides.join('\n')}</div><script src="../../../assets/deck.js?v=${VERSION}" defer></script>`
        write(deckRel, page({ rel: deckRel, title: dTitle, description: dDesc, body: deck, mdTwin: deckRel.replace(/\.html$/, '.md'), head: `<link rel="stylesheet" href="../../../assets/xray/xray.css?v=${VERSION}">` }))
        pages.push({ rel: deckRel, title: dTitle, description: dDesc })
        const strip = t => t.replace(/<section[^>]*aria-label="([^"]*)"[^>]*>/g, '\n\n---\n\n').replace(/<h[12][^>]*>/g, '\n## ').replace(/<li[^>]*>/g, '\n- ').replace(/<br>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim()
        twin(deckRel, dTitle, dDesc, `The full X-ray: [../index.md](../index.md)\n\n${strip(slides.join('\n'))}`)
    }
}
