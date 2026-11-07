// /people/silvio/competitive/: the competitive analysis for Web Summit 2026 (Silvio's ask, 5 November 2026),
// by outreach@web-summit.silvio. Built from people/silvio/competitive/companies.json; called from people/silvio/pages.mjs.
// Order of the page: the finding and the pitch; overlap against partner fit; before, during, after; the map;
// where we lead and what we need; the plan; the questions; one card per company; how sure we are.
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const GROUP = { closest: ['Closest rivals', 'h'], overlap: ['Partial rivals', 'm'], neighbour: ['Neighbours', 'n'] }
const short = c => c.name.replace(/ \(.*\)/, '')

const CSS = `<style>
.cmp{--ink:#14212b;--soft:#56656f;--line:#d5dde2;--card:#ffffff;--bg2:#f2f5f7;--us:#0b6e69;--us2:#d9efed;--h:#b4432a;--h2:#f7e2dc;--m:#a86a07;--m2:#f6ebd5;--n:#4b6577;--n2:#e3eaef;--off:#e6ebee;color:var(--ink)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .cmp{--ink:#e4ecf0;--soft:#9aabb6;--line:#2a3a45;--card:#16222b;--bg2:#111a20;--us:#4cc3b8;--us2:#163a3a;--h:#ec8b72;--h2:#3e2420;--m:#e0b05a;--m2:#3a2f18;--n:#9fb6c6;--n2:#22313b;--off:#26343e}}
:root[data-theme=dark] .cmp{--ink:#e4ecf0;--soft:#9aabb6;--line:#2a3a45;--card:#16222b;--bg2:#111a20;--us:#4cc3b8;--us2:#163a3a;--h:#ec8b72;--h2:#3e2420;--m:#e0b05a;--m2:#3a2f18;--n:#9fb6c6;--n2:#22313b;--off:#26343e}
.cmp h2{margin-top:2.4rem;scroll-margin-top:80px}.cmp h2 small{display:block;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);font-weight:600;margin-bottom:.2rem}
.cmp .lead{font-size:1.1rem;color:var(--soft);max-width:60rem}
.cmp .pitch{background:var(--us2);border-left:5px solid var(--us);border-radius:8px;padding:14px 18px;margin:1rem 0}.cmp .pitch q{display:block;font-size:1.35rem;font-weight:700;line-height:1.3;quotes:"\\201C" "\\201D"}.cmp .pitch p{margin:.4rem 0 0;color:var(--soft)}
.cmp .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:1rem 0}
.cmp .kpi{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 16px}.cmp .kpi b{display:block;font-size:2rem;line-height:1.1;color:var(--us);font-variant-numeric:tabular-nums}.cmp .kpi span{color:var(--soft);font-size:.9rem}
.cmp .toc{display:flex;flex-wrap:wrap;gap:8px;margin:1rem 0}.cmp .toc a{border:1px solid var(--line);border-radius:99px;padding:4px 12px;font-size:.9rem;text-decoration:none;color:var(--ink);background:var(--card)}.cmp .toc a:hover{border-color:var(--us)}
.cmp .panel{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:16px;margin:1rem 0;overflow-x:auto}
.cmp svg{width:100%;min-width:540px;height:auto;display:block}.cmp svg text{font-family:inherit}
.cmp .legend{display:flex;flex-wrap:wrap;gap:16px;font-size:.9rem;color:var(--soft)}.cmp .dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:middle}
.cmp .mx{display:grid;grid-template-columns:70px repeat(5,minmax(96px,1fr));gap:4px;min-width:560px}
.cmp .mx .ax{font-size:.75rem;color:var(--soft);display:flex;align-items:center;justify-content:center;text-align:center}
.cmp .mx .c{min-height:74px;border-radius:6px;background:var(--card);border:1px solid var(--line);padding:6px;display:flex;flex-direction:column;gap:4px;justify-content:center}
.cmp .mx .c.zp{background:var(--us2)}.cmp .mx .c.zb{background:var(--m2)}.cmp .mx .c.zw{background:var(--h2)}
.cmp .mx .c span{font-size:.82rem;font-weight:700;background:var(--card);border:1px solid var(--line);border-radius:4px;padding:2px 6px;text-align:center}
.cmp .mxlab{display:flex;justify-content:space-between;font-size:.75rem;color:var(--soft);margin:6px 0 0 74px;min-width:486px}
.cmp table{border-collapse:collapse;width:100%;font-size:.92rem}.cmp th,.cmp td{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:middle}.cmp th{font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:var(--soft)}
.cmp .meter{display:inline-flex;gap:3px;vertical-align:middle}.cmp .meter i{width:16px;height:10px;border-radius:2px;background:var(--off)}.cmp .meter.o i.on{background:var(--h)}.cmp .meter.f i.on{background:var(--us)}
.cmp .tw{overflow-x:auto}
.cmp .three{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.cmp .two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.cmp .box{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px;min-width:0}.cmp .box.us{border-color:var(--us);background:var(--us2)}
.cmp .box h3{margin:.2rem 0 .5rem}.cmp .box ul,.cmp .box ol{margin:0;padding-left:1.2rem}.cmp .box li{margin:.35rem 0}
.cmp .t-lead{border-top:4px solid var(--us)}.cmp .t-need{border-top:4px solid var(--h)}
.cmp .tag{font-size:.75rem;color:var(--soft);text-transform:uppercase;letter-spacing:.06em}
.cmp .plan{list-style:none;margin:1rem 0;padding:0;display:grid;gap:0}
.cmp .plan>li{display:grid;grid-template-columns:150px 1fr;gap:16px;padding:12px 0;border-top:1px solid var(--line)}.cmp .plan>li:first-child{border-top:0}
.cmp .plan b.when{color:var(--us)}.cmp .plan ul{margin:0;padding-left:1.1rem}.cmp .plan ul li{margin:.25rem 0}
.cmp .qs{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:8px;list-style:none;padding:0;margin:1rem 0;counter-reset:q}
.cmp .qs li{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px 10px 44px;position:relative;counter-increment:q}.cmp .qs li::before{content:counter(q);position:absolute;left:12px;top:9px;width:22px;height:22px;border-radius:50%;background:var(--us2);color:var(--us);font-weight:700;font-size:.8rem;display:flex;align-items:center;justify-content:center}
.cmp .grp{margin-top:1.4rem}.cmp .grp>h3{display:flex;align-items:center;gap:8px}
.cmp .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px;margin-top:.6rem}
.cmp .card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px;display:grid;gap:8px;align-content:start;min-width:0}
.cmp .card .hd{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.cmp .card h4{margin:0;font-size:1.1rem}
.cmp .pill{font-size:.72rem;letter-spacing:.05em;text-transform:uppercase;padding:2px 8px;border-radius:99px;white-space:nowrap}
.cmp .p-h{background:var(--h2);color:var(--h)}.cmp .p-m{background:var(--m2);color:var(--m)}.cmp .p-n{background:var(--n2);color:var(--n)}.cmp .p-us{background:var(--us2);color:var(--us)}
.cmp blockquote{margin:0;font-weight:600;border-left:3px solid var(--line);padding-left:10px}
.cmp .scores{display:flex;flex-wrap:wrap;gap:14px;font-size:.8rem;color:var(--soft)}
.cmp dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:.92rem}.cmp dt{color:var(--soft);font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;padding-top:3px}.cmp dd{margin:0;min-width:0}
.cmp .note{border-radius:6px;padding:8px 10px;font-size:.92rem}.cmp .note b{display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}
.cmp .n-us{background:var(--us2)}.cmp .n-us b{color:var(--us)}.cmp .n-st{background:var(--m2)}.cmp .n-st b{color:var(--m)}.cmp .n-pa{background:var(--n2)}.cmp .n-pa b{color:var(--n)}
.cmp .card.usc{border:2px solid var(--us)}
.cmp .conf{background:var(--bg2);border:1px solid var(--line);border-radius:8px;padding:14px 16px;color:var(--soft);font-size:.92rem}
@media (max-width:640px){.cmp .plan>li{grid-template-columns:1fr;gap:4px}}
</style>`

const meter = (n, k) => `<span class="meter ${k}" role="img" aria-label="${n} of 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`

// overlap (columns, 1 to 5) against partner fit (rows, 5 down to 1); each company's name in its cell
function matrix(D) {
    const zone = (o, f) => o >= 4 && f >= 4 ? 'zb' : o >= 4 ? 'zw' : f >= 4 ? 'zp' : ''
    let g = `<div class="mx" role="table" aria-label="Competitive overlap against partner fit"><div class="ax"></div>${[1, 2, 3, 4, 5].map(o => `<div class="ax">Overlap ${o}</div>`).join('')}`
    for (const f of [5, 4, 3, 2, 1]) {
        g += `<div class="ax">Fit ${f}</div>`
        for (const o of [1, 2, 3, 4, 5]) g += `<div class="c ${zone(o, f)}">${D.companies.filter(c => c.overlap === o && c.fit === f).map(c => `<span>${esc(short(c))}</span>`).join('')}</div>`
    }
    return `${g}</div><div class="mxlab"><span>← less like us</span><span>more like us →</span></div>`
}

function map(D) {
    const colour = { closest: 'var(--h)', overlap: 'var(--m)', neighbour: 'var(--n)' }
    const ax = (x, y, t, a = 'start', r = '') => `<text x="${x}" y="${y}" fill="var(--soft)" font-size="11" text-anchor="${a}"${r}>${t}</text>`
    const dots = D.companies.map(c => {
        const right = c.x > 430
        return `<circle cx="${c.x}" cy="${c.y}" r="${c.group === 'closest' ? 9 : 7}" fill="${colour[c.group]}"/><text x="${right ? c.x - 12 : c.x + 12}" y="${c.y + 4}" fill="var(--ink)" font-size="13" text-anchor="${right ? 'end' : 'start'}"${c.group === 'closest' ? ' font-weight="700"' : ''}>${esc(short(c))}</text>`
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
    const closest = D.companies.filter(c => c.group === 'closest'), strongFit = D.companies.filter(c => c.fit === 5)
    const card = c => `<article class="card" id="c-${esc(c.id)}"><div class="hd"><h4>${esc(c.name)}</h4><span class="pill p-${GROUP[c.group][1]}">${esc(c.position)}</span></div>
<blockquote>"${esc(c.headline)}"</blockquote>
<div class="scores"><span>Overlap ${meter(c.overlap, 'o')}</span><span>Partner fit ${meter(c.fit, 'f')}</span></div>
<dl><dt>Offer</dt><dd>${esc(c.offer)}</dd><dt>Action</dt><dd>${esc(c.action)}</dd><dt>Stage</dt><dd>${esc(stage[c.stage].label)}</dd><dt>Web Summit</dt><dd>${esc(c.web_summit)}</dd><dt>Source</dt><dd><a href="${esc(c.source)}">their site</a>, read ${esc(D.read_on)}</dd></dl>
<p class="note n-us"><b>Where we differ</b>${esc(c.differ)}</p><p class="note n-st"><b>How we get stronger</b>${esc(c.stronger)}</p><p class="note n-pa"><b>Partnership idea</b>${esc(c.partner)}</p></article>`
    const toc = [['finding', 'The finding'], ['matrix', 'Overlap and fit'], ['chain', 'Before, during, after'], ['map', 'The map'], ['gaps', 'Lead and need'], ['plan', 'The plan'], ['questions', 'Questions'], ['companies', 'The companies'], ['confidence', 'How sure we are']]
    const body = `<div class="cmp">
<p class="lead" id="finding">${esc(D.finding)}</p>
<div class="pitch"><span class="tag">The pitch</span><q>${esc(D.pitch)}</q><p>${esc(D.pitch_note)}</p></div>
<div class="kpis"><div class="kpi"><b>${n}</b><span>companies, their websites read on ${esc(D.read_on)}</span></div><div class="kpi"><b>${closest.length}</b><span>closest rivals: ${esc(closest.map(short).join(' and '))}</span></div><div class="kpi"><b>${strongFit.length}</b><span>strong partner fits: ${esc(strongFit.map(short).join(', '))}</span></div><div class="kpi"><b>0</b><span>end in a licence to operate</span></div></div>
<nav class="toc" aria-label="On this page">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>

<h2 id="matrix">1. Who competes, who could partner</h2>
<p>Each company placed by how much it overlaps with RiskMandate (left to right) and how well it would fit as a partner (top to bottom). ${esc(D.scales)}</p>
<div class="panel">${matrix(D)}</div>
<div class="legend"><span><i class="dot" style="background:var(--us2);border:1px solid var(--us)"></i>Partner first</span><span><i class="dot" style="background:var(--m2);border:1px solid var(--m)"></i>Compete and partner</span><span><i class="dot" style="background:var(--h2);border:1px solid var(--h)"></i>Watch closely</span></div>
<div class="tw"><table><thead><tr><th>Company</th><th>Position</th><th>Overlap</th><th>Partner fit</th></tr></thead><tbody>${D.companies.map(c => `<tr><td><a href="#c-${esc(c.id)}">${esc(c.name)}</a></td><td>${esc(c.position)}</td><td>${meter(c.overlap, 'o')}</td><td>${meter(c.fit, 'f')}</td></tr>`).join('')}</tbody></table></div>

<h2 id="chain">2. Before, during, after</h2>
<div class="three">${D.stages.map(s => `<div class="box${s.id === 'before' ? ' us' : ''}"><span class="tag">${esc(s.label)}</span><h3>${s.id === 'before' ? 'RiskMandate' : esc(D.companies.filter(c => c.stage === s.id).map(short).join(', '))}</h3><p>${esc(s.text)}</p></div>`).join('')}</div>
<p>Most of these products can be a barrier in an Agent Behaviour Policy ("barrier: Hexgate, checked on every tool call"), so most of them are partners as much as competitors.</p>

<h2 id="map">3. Where each one sits</h2>
<p>Left to right: does it act before the agent does something, or record what happened after? Top to bottom: a record people read and sign, or software that blocks and allows. The placement is our judgement from their websites.</p>
<div class="panel">${map(D)}</div>
<div class="legend"><span><i class="dot" style="background:var(--h)"></i>Closest rivals</span><span><i class="dot" style="background:var(--m)"></i>Partial rivals</span><span><i class="dot" style="background:var(--n)"></i>Neighbours</span></div>

<h2 id="gaps">4. Where we lead, and what we need</h2>
<div class="two"><div class="box t-lead"><h3>Where we lead</h3><ul>${D.lead.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="box t-need"><h3>What we need to show</h3><ul>${D.behind.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>

<h2 id="plan">5. The plan for Web Summit</h2>
<ol class="plan">${D.plan.map(p => `<li><b class="when">${esc(p.when)}</b><ul>${p.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></li>`).join('')}</ol>

<h2 id="questions">6. Questions to ask every company</h2>
<ol class="qs">${D.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ol>

<h2 id="companies">7. Each company, in its own words</h2>
<div class="cards"><article class="card usc"><div class="hd"><h4>${esc(D.us.name)}</h4><span class="pill p-us">Us</span></div><blockquote>"${esc(D.us.headline)}"</blockquote><dl><dt>Offer</dt><dd>${esc(D.us.offer)}</dd><dt>Action</dt><dd>${esc(D.us.action)}</dd><dt>Web Summit</dt><dd>our stand on 12 November, between Booths A1-30</dd><dt>Source</dt><dd><a href="${esc(D.us.source)}">riskmandate.ai</a></dd></dl></article></div>
${Object.entries(GROUP).map(([g, [label, k]]) => `<section class="grp"><h3><span class="pill p-${k}">${label}</span></h3><div class="cards">${D.companies.filter(c => c.group === g).map(card).join('')}</div></section>`).join('')}

<h2 id="confidence">8. How sure we are</h2>
<div class="conf"><p>${esc(D.confidence)}</p><p>${esc(D.about)}</p><p>Built by <code>people/silvio/competitive/page.mjs</code> from <code>people/silvio/competitive/companies.json</code>.</p></div>
</div>`
    const md = `${D.finding}\n\n> Pitch: "${D.pitch}" ${D.pitch_note}\n\nRead on ${D.read_on}. ${D.scales}\n\n## Overlap and partner fit\n\n| Company | Position | Overlap | Partner fit |\n|---|---|---|---|\n${D.companies.map(c => `| ${c.name} | ${c.position} | ${c.overlap}/5 | ${c.fit}/5 |`).join('\n')}\n\n## Before, during, after\n\n${D.stages.map(s => `- ${s.label}: ${s.id === 'before' ? 'RiskMandate' : D.companies.filter(c => c.stage === s.id).map(c => c.name).join(', ')}. ${s.text}`).join('\n')}\n\n## Where we lead\n\n${D.lead.map(x => `- ${x}`).join('\n')}\n\n## What we need to show\n\n${D.behind.map(x => `- ${x}`).join('\n')}\n\n## The plan for Web Summit\n\n${D.plan.map(p => `### ${p.when}\n\n${p.items.map(x => `- ${x}`).join('\n')}`).join('\n\n')}\n\n## Questions to ask every company\n\n${D.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n## The companies\n\n${D.companies.map(c => `### ${c.name}: ${c.position}\n\n- Headline: "${c.headline}"\n- Offer: ${c.offer}\n- Action: ${c.action}\n- Overlap ${c.overlap}/5, partner fit ${c.fit}/5\n- At Web Summit: ${c.web_summit}\n- Where we differ: ${c.differ}\n- How we get stronger: ${c.stronger}\n- Partnership idea: ${c.partner}\n- Source: ${c.source} (read ${D.read_on})`).join('\n\n')}\n\n## How sure we are\n\n${D.confidence}\n\n${D.about}\n`
    return { rel: 'people/silvio/competitive/index.html', title: 'Competitive analysis: who else controls AI agents at Web Summit', description: `${n} companies at Web Summit 2026 that work on controlling AI agents: who competes, who could partner, where RiskMandate differs, and the plan for the stand.`, body, md, head: CSS }
}
