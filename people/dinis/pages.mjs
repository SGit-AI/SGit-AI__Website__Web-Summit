// Dinis's lab (4 November 2026, at Dinis's word): browser-only experiments towards one end-to-end MVP: from a
// conversation about a company, a person or a scenario, an Agent Behaviour Policy, researched, written, animated and
// kept in a vault. The map of experiments is people/dinis/lab/experiments.json; the studio (experiment 1) is
// people/dinis/lab/studio.js. Called by admin/build/build.mjs (people/<id>/pages.mjs); written by dev@web-summit.dinis.
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inl = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
const STATUS = { built: 'built, try it', next: 'next', planned: 'planned', research: 'researched, to build' }


// PrompTugal.news by place (Dinis, 14 November 2026): /people/dinis/local-sites/, the brief that answers Vicky's
// local-sites plan. Built from people/dinis/local-sites/source.md and its SVG infographics, written by conductor@web-summit.dinis.
function mdPage(md) {
    const link = s => inl(s).replace(/(^|[\s(])(https:\/\/[^\s)<]+)/g, '$1<a href="$2">$2</a>')
    const out = []
    for (const block of md.replace(/\r/g, '').trim().split(/\n\s*\n/)) {
        const L = block.split('\n').filter(l => l.trim()); if (!L.length) continue
        const img = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
        if (img) { out.push(`<figure><img src="${esc(img[2])}" alt="${esc(img[1])}" style="width:100%;height:auto"></figure>`); continue }
        const h = L[0].match(/^(#{1,3}) (.+)$/)
        if (h && L.length === 1) { const n = Math.max(2, h[1].length); out.push(n === 2 && h[1].length === 1 ? '' : `<h${n}>${link(h[2])}</h${n}>`); continue }
        if (L.every(l => /^(- |\d+\. )/.test(l))) { const t = /^\d/.test(L[0]) ? 'ol' : 'ul'; out.push(`<${t}>${L.map(l => `<li>${link(l.replace(/^(- |\d+\. )/, ''))}</li>`).join('')}</${t}>`); continue }
        out.push(`<p>${link(L.join(' '))}</p>`)
    }
    return out.join('\n')
}
function localSites(ROOT) {
    const f = path.join(ROOT, 'people/dinis/local-sites/source.md')
    if (!fs.existsSync(f)) return []
    const src = fs.readFileSync(f, 'utf8')
    return [{ rel: 'people/dinis/local-sites/index.html', title: 'PrompTugal.news by place: Portugal, the Algarve and its towns', description: "Dinis's brief answering Vicky's local-sites plan: one publication, three levels of place, each site a lens on one semantic graph, the PrompTugal test (always AI), and every town in the Algarve first.", body: mdPage(src), md: src }]
}

export function build(ROOT) {
    const E = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/dinis/lab/experiments.json'), 'utf8'))
    const card = e => `<div class="lab-x lab-${esc(e.status)}"><p class="lab-n">${esc(e.id)} · <span>${esc(STATUS[e.status] || e.status)}</span></p><h3 id="${esc(e.id.toLowerCase())}">${esc(e.title)}</h3><p>${inl(e.what)}</p>${e.how ? `<p class="lab-how"><b>How:</b> ${inl(e.how)}</p>` : ''}${e.reuse ? `<p class="lab-how"><b>Reuses:</b> ${inl(e.reuse)}</p>` : ''}<p class="lab-how"><b>Who:</b> ${inl(e.who)}${e.issue ? ` · ${esc(e.issue)}` : ''}</p>${e.try ? `<p><a class="lab-try" href="${esc(e.try)}">Open it</a></p>` : ''}</div>`
    const hub = `<p class="lead">${inl(E.goal)}</p>
<h2 id="flow">The end to end, in one line</h2><p class="lab-flow">${E.flow.map(s => `<span>${esc(s)}</span>`).join('<i>→</i>')}</p>
<h2 id="experiments">The experiments</h2><div class="lab-grid">${E.experiments.map(card).join('')}</div>
<h2 id="rules">The rules every experiment keeps</h2><ul>${E.rules.map(r => `<li>${inl(r)}</li>`).join('')}</ul>
<p class="meta">The map is <code>people/dinis/lab/experiments.json</code>; change it there. Built by <code>people/dinis/pages.mjs</code>.</p>`
    const hubMd = `${E.goal}\n\n## The end to end\n\n${E.flow.join(' → ')}\n\n## The experiments\n\n${E.experiments.map(e => `### ${e.id}: ${e.title} (${STATUS[e.status] || e.status})\n\n${e.what}\n\n${e.how ? `How: ${e.how}\n\n` : ''}${e.reuse ? `Reuses: ${e.reuse}\n\n` : ''}Who: ${e.who}${e.issue ? ` (${e.issue})` : ''}`).join('\n\n')}\n\n## Rules\n\n${E.rules.map(r => `- ${r}`).join('\n')}`
    const studio = `<div id="studio"><noscript><p>The studio runs in the browser: it needs JavaScript.</p></noscript></div>
<p class="meta">Experiment 1 of <a href="../index.html">Dinis's lab</a>. The model is reached through OpenRouter with your own key (the one Ask Claude uses, in this browser only, sent only to openrouter.ai); the tools are functions in <code>studio.js</code>, and you choose which are attached. What you make stays in this browser until you copy or download it. Same-origin caveat: other scripts published on this site could read that key (WS-117), so keep a credit limit on it.</p>`
    const studioMd = 'Experiment 1 of Dinis\'s lab: a chat with Claude in the browser that calls the tools you choose (this site\'s pages and company map, the ABP template, web research, writing the policy, animating the scenario), and builds an Agent Behaviour Policy in RiskMandate\'s terms as it goes. Runs in the browser with your own OpenRouter key; needs JavaScript.'
    const head = rel => `<link rel="stylesheet" href="${rel}studio.css">`
    return [
        { rel: 'people/dinis/lab/index.html', title: "Dinis's lab: from a conversation to an agent policy", description: 'The browser experiments towards an end-to-end MVP: research a company or a scenario, write its Agent Behaviour Policy, animate it, keep it in a vault.', body: hub, md: hubMd, head: head('') },
        { rel: 'people/dinis/lab/studio/index.html', title: 'The policy studio', description: 'A chat with Claude that uses the tools you choose to research a company or scenario and write its Agent Behaviour Policy, with an animated picture.', body: studio, md: studioMd, head: head('../') + '<script src="../studio-vault.js" defer></script><script src="../studio.js" defer></script>' },
        ...localSites(ROOT),
    ]
}
