// Dinis's lab (4 November 2026, at Dinis's word): browser-only experiments towards one end-to-end MVP: from a
// conversation about a company, a person or a scenario, an Agent Behaviour Policy, researched, written, animated and
// kept in a vault. The map of experiments is people/dinis/lab/experiments.json; the studio (experiment 1) is
// people/dinis/lab/studio.js. Called by admin/build/build.mjs (people/<id>/pages.mjs); written by dev@web-summit.dinis.
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inl = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
const STATUS = { built: 'built, try it', next: 'next', planned: 'planned', research: 'researched, to build' }

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
        { rel: 'people/dinis/lab/studio/index.html', title: 'The policy studio', description: 'A chat with Claude that uses the tools you choose to research a company or scenario and write its Agent Behaviour Policy, with an animated picture.', body: studio, md: studioMd, head: head('../') + '<script src="../studio.js" defer></script>' },
    ]
}
