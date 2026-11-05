// /people/silvio/competitive/: the competitive analysis for Web Summit 2026 (Silvio's ask, 5 November 2026),
// by outreach@web-summit.silvio. Built from people/silvio/competitive/companies.json; called from people/silvio/pages.mjs.
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const GROUP = { closest: ['Closest to us', 'h'], overlap: ['Overlaps in part', 'm'], neighbour: ['Neighbour', 'n'] }

const CSS = `<style>
.cmp{--ink:#14212b;--soft:#56656f;--line:#d5dde2;--card:#ffffff;--bg2:#f2f5f7;--us:#0b6e69;--us2:#d9efed;--h:#b4432a;--h2:#f7e2dc;--m:#a86a07;--m2:#f6ebd5;--n:#4b6577;--n2:#e3eaef;color:var(--ink)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .cmp{--ink:#e4ecf0;--soft:#9aabb6;--line:#2a3a45;--card:#16222b;--bg2:#111a20;--us:#4cc3b8;--us2:#163a3a;--h:#ec8b72;--h2:#3e2420;--m:#e0b05a;--m2:#3a2f18;--n:#9fb6c6;--n2:#22313b}}
:root[data-theme=dark] .cmp{--ink:#e4ecf0;--soft:#9aabb6;--line:#2a3a45;--card:#16222b;--bg2:#111a20;--us:#4cc3b8;--us2:#163a3a;--h:#ec8b72;--h2:#3e2420;--m:#e0b05a;--m2:#3a2f18;--n:#9fb6c6;--n2:#22313b}
.cmp .lead{font-size:1.1rem;color:var(--soft);max-width:60rem}
.cmp .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:1rem 0}
.cmp .kpi{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 16px}.cmp .kpi b{display:block;font-size:2rem;line-height:1.1;color:var(--us)}.cmp .kpi span{color:var(--soft);font-size:.9rem}
.cmp .panel{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:16px;margin:1rem 0;overflow-x:auto}
.cmp svg{width:100%;min-width:540px;height:auto;display:block}.cmp svg text{font-family:inherit}
.cmp .legend{display:flex;flex-wrap:wrap;gap:16px;font-size:.9rem;color:var(--soft)}.cmp .dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:middle}
.cmp .three{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.cmp .box{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px;min-width:0}.cmp .box.us{border-color:var(--us);background:var(--us2)}
.cmp .box h3{margin:.2rem 0 .5rem}.cmp .box ul,.cmp .box ol{margin:0;padding-left:1.2rem}.cmp .box li{margin:.35rem 0}
.cmp .t-lead{border-top:4px solid var(--us)}.cmp .t-behind{border-top:4px solid var(--h)}.cmp .t-do{border-top:4px solid var(--m)}
.cmp .tag{font-size:.75rem;color:var(--soft);text-transform:uppercase;letter-spacing:.06em}
.cmp .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.cmp .card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px;display:grid;gap:8px;align-content:start;min-width:0}
.cmp .card .hd{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.cmp .card h3{margin:0}
.cmp .pill{font-size:.72rem;letter-spacing:.05em;text-transform:uppercase;padding:2px 8px;border-radius:99px;white-space:nowrap}
.cmp .p-h{background:var(--h2);color:var(--h)}.cmp .p-m{background:var(--m2);color:var(--m)}.cmp .p-n{background:var(--n2);color:var(--n)}.cmp .p-us{background:var(--us2);color:var(--us)}
.cmp blockquote{margin:0;font-weight:600;border-left:3px solid var(--line);padding-left:10px}
.cmp dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:.92rem}.cmp dt{color:var(--soft);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;padding-top:2px}.cmp dd{margin:0;min-width:0}
.cmp .differ{background:var(--us2);border-radius:6px;padding:8px 10px;font-size:.92rem}.cmp .learn{background:var(--m2);border-radius:6px;padding:8px 10px;font-size:.92rem}
.cmp .card.usc{border:2px solid var(--us)}
</style>`

function map(D) {
    const colour = { closest: 'var(--h)', overlap: 'var(--m)', neighbour: 'var(--n)' }
    const ax = (x, y, t, a = 'start', r = '') => `<text x="${x}" y="${y}" fill="var(--soft)" font-size="11" text-anchor="${a}"${r}>${t}</text>`
    const dots = D.companies.map(c => {
        const right = c.x > 430
        return `<circle cx="${c.x}" cy="${c.y}" r="${c.group === 'closest' ? 9 : 7}" fill="${colour[c.group]}"/><text x="${right ? c.x - 12 : c.x + 12}" y="${c.y + 4}" fill="var(--ink)" font-size="13" text-anchor="${right ? 'end' : 'start'}"${c.group === 'closest' ? ' font-weight="700"' : ''}>${esc(c.name.replace(/ \(.*\)/, ''))}</text>`
    }).join('')
    return `<svg viewBox="0 0 680 440" role="img" aria-label="Map of ${D.companies.length} companies and RiskMandate: before or after the agent acts, record or software">
<rect x="60" y="20" width="600" height="380" fill="var(--card)" stroke="var(--line)"/>
<line x1="360" y1="20" x2="360" y2="400" stroke="var(--line)" stroke-dasharray="4 4"/><line x1="60" y1="210" x2="660" y2="210" stroke="var(--line)" stroke-dasharray="4 4"/>
${ax(70, 420, 'BEFORE THE AGENT ACTS')}${ax(650, 420, 'AFTER IT ACTS', 'end')}${ax(20, 30, 'A RECORD PEOPLE SIGN', 'end', ' transform="rotate(-90 20 30)"')}${ax(20, 400, 'SOFTWARE THAT BLOCKS', 'start', ' transform="rotate(-90 20 400)"')}
<circle cx="120" cy="70" r="11" fill="var(--us)"/><text x="138" y="68" fill="var(--us)" font-size="16" font-weight="800">RiskMandate</text><text x="138" y="85" fill="var(--soft)" font-size="12">reach, mandate, gap, licence</text>
${dots}</svg>`
}

export function competitive(ROOT) {
    const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/silvio/competitive/companies.json'), 'utf8'))
    const stage = Object.fromEntries(D.stages.map(s => [s.id, s]))
    const n = D.companies.length, ws = D.companies.filter(c => c.web_summit.startsWith('Web Summit')).length
    const card = c => `<article class="card"><div class="hd"><h3>${esc(c.name)}</h3><span class="pill p-${GROUP[c.group][1]}">${GROUP[c.group][0]}</span></div>
<blockquote>"${esc(c.headline)}"</blockquote><dl><dt>Offer</dt><dd>${esc(c.offer)}</dd><dt>Action</dt><dd>${esc(c.action)}</dd><dt>Stage</dt><dd>${esc(stage[c.stage].label)}</dd><dt>At Web Summit</dt><dd>${esc(c.web_summit)}</dd><dt>Source</dt><dd><a href="${esc(c.source)}">their site</a>, read ${esc(D.read_on)}</dd></dl>
<p class="differ"><b>Where we differ:</b> ${esc(c.differ)}</p><p class="learn"><b>What we learn:</b> ${esc(c.learn)}</p></article>`
    const body = `<div class="cmp">
<p class="lead">Who else at Web Summit 2026 works on controlling AI agents, how each one presents itself, and where RiskMandate is different. Each one covers part of the problem: who the agent is, what it may spend, what it said, what it decided. RiskMandate writes down, before the agent acts, what it can reach, what it was authorised to do and the gap between the two, and ends in a licence to operate.</p>
<div class="kpis"><div class="kpi"><b>${n}</b><span>companies, their own websites read on ${esc(D.read_on)}</span></div><div class="kpi"><b>${ws}</b><span>on Web Summit's own pages; the rest from their site or a third-party list</span></div><div class="kpi"><b>0</b><span>end in a licence to operate</span></div></div>
<h2 id="map">1. Where each one sits</h2>
<p>Left to right: does it act before the agent does something, or record what happened after? Top to bottom: a record people read and sign, or software that blocks and allows. The placement is our judgement from their websites.</p>
<div class="panel">${map(D)}</div>
<div class="legend"><span><i class="dot" style="background:var(--h)"></i>Closest to us</span><span><i class="dot" style="background:var(--m)"></i>Overlaps in part</span><span><i class="dot" style="background:var(--n)"></i>Neighbour</span></div>
<h2 id="chain">2. Before, during, after</h2>
<div class="three">${D.stages.map(s => `<div class="box${s.id === 'before' ? ' us' : ''}"><span class="tag">${esc(s.label)}</span><h3>${s.id === 'before' ? 'RiskMandate' : esc(D.companies.filter(c => c.stage === s.id).map(c => c.name.replace(/ \(.*\)/, '')).join(', '))}</h3><p>${esc(s.text)}</p></div>`).join('')}</div>
<p>Most of these products can be a barrier in an Agent Behaviour Policy ("barrier: Hexgate, checked on every tool call"), so most of them are partners as much as competitors.</p>
<h2 id="gaps">3. Where we lead, where we are behind, what we do next</h2>
<div class="three"><div class="box t-lead"><h3>Where we lead</h3><ul>${D.lead.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="box t-behind"><h3>Where we are behind</h3><ul>${D.behind.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="box t-do"><h3>Before 12 November</h3><ol>${D.todo.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div></div>
<h2 id="companies">4. Each company, in its own words</h2>
<div class="cards"><article class="card usc"><div class="hd"><h3>${esc(D.us.name)}</h3><span class="pill p-us">Us</span></div><blockquote>"${esc(D.us.headline)}"</blockquote><dl><dt>Offer</dt><dd>${esc(D.us.offer)}</dd><dt>Action</dt><dd>${esc(D.us.action)}</dd><dt>At Web Summit</dt><dd>our stand on 12 November, between Booths A1-30</dd><dt>Source</dt><dd><a href="${esc(D.us.source)}">riskmandate.ai</a></dd></dl></article>${D.companies.map(card).join('')}</div>
<p class="meta">Built by <code>people/silvio/competitive/page.mjs</code> from <code>people/silvio/competitive/companies.json</code>. ${esc(D.about)}</p></div>`
    const md = `Who else at Web Summit 2026 works on controlling AI agents, how each presents itself, and where RiskMandate differs. Read on ${D.read_on}.\n\n## Before, during, after\n\n${D.stages.map(s => `- ${s.label}: ${s.id === 'before' ? 'RiskMandate' : D.companies.filter(c => c.stage === s.id).map(c => c.name).join(', ')}. ${s.text}`).join('\n')}\n\n## Where we lead\n\n${D.lead.map(x => `- ${x}`).join('\n')}\n\n## Where we are behind\n\n${D.behind.map(x => `- ${x}`).join('\n')}\n\n## Before 12 November\n\n${D.todo.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n## The companies\n\n${D.companies.map(c => `### ${c.name} (${GROUP[c.group][0].toLowerCase()})\n\n- Headline: "${c.headline}"\n- Offer: ${c.offer}\n- Action: ${c.action}\n- At Web Summit: ${c.web_summit}\n- Where we differ: ${c.differ}\n- What we learn: ${c.learn}\n- Source: ${c.source} (read ${D.read_on})`).join('\n\n')}\n\n${D.about}\n`
    return { rel: 'people/silvio/competitive/index.html', title: 'Competitive analysis: who else controls AI agents at Web Summit', description: `${n} companies at Web Summit 2026 that work on controlling AI agents, how each presents itself, and where RiskMandate differs: before, during and after the agent acts.`, body, md, head: CSS }
}
