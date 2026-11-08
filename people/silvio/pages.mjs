// Silvio's own pages (the people/<id>/pages.mjs contract in admin/build/build.mjs), by conductor@web-summit.silvio.
// /people/silvio/outreach/: the outreach campaign (WS-26) as one infographic, a mock buyer card for three companies,
// and the table of the 50 buyers. Built from people/silvio/outreach/messages.json and buyers.json. Companies and
// public roles only: the channels themselves are in Silvio's sealed tracker (data/sealed/silvio/), never here.
import fs from 'node:fs'
import path from 'node:path'
import { competitive } from './competitive/page.mjs'
import { eventos } from './eventos/page.mjs'
import { lab } from './lab/page.mjs'
import { explica } from './explica/page.mjs'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const CSS = `<style>
.ob{--ink:#1d2433;--soft:#5b6478;--line:#d9dee8;--card:#ffffff;--bg2:#f4f6fa;--a:#2f6fdf;--b:#14a37f;--c:#e0892b;--d:#8a5cd6;--e:#d64f6a;--pt:#14a37f;font-size:16px;color:var(--ink)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .ob{--ink:#e8ecf4;--soft:#a3acbf;--line:#334058;--card:#18202e;--bg2:#111826;--a:#6c9cf0;--b:#3cc9a2;--c:#f0a85a;--d:#a988e8;--e:#ec7a90;--pt:#3cc9a2}}
:root[data-theme=dark] .ob{--ink:#e8ecf4;--soft:#a3acbf;--line:#334058;--card:#18202e;--bg2:#111826;--a:#6c9cf0;--b:#3cc9a2;--c:#f0a85a;--d:#a988e8;--e:#ec7a90;--pt:#3cc9a2}
.ob h2{margin-top:2rem}.ob .lead{font-size:1.1rem;color:var(--soft);max-width:60rem}
.ob .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:1rem 0}
.ob .kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px}.ob .kpi b{display:block;font-size:2rem;line-height:1.1}.ob .kpi span{color:var(--soft);font-size:.9rem}
.ob svg{width:100%;height:auto;display:block}.ob svg text{fill:var(--ink);font-family:inherit}.ob svg .s{fill:var(--soft)}
.ob .panel{background:var(--bg2);border:1px solid var(--line);border-radius:18px;padding:16px;margin:1rem 0}
.ob .mock{background:var(--card);border:2px dashed var(--line);border-radius:18px;padding:18px;margin:1rem 0}
.ob .mock h3{margin:.2rem 0 .6rem}.ob .chips span{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:2px 10px;margin:0 6px 6px 0;font-size:.85rem;color:var(--soft)}
.ob .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.ob .col{border-left:4px solid var(--a);padding:4px 12px}
.ob .col.r{border-color:var(--e)}.ob .col.h{border-color:var(--b)}.ob .col.n{border-color:var(--c)}.ob .col b{display:block;margin-bottom:4px}
.ob .open{background:var(--bg2);border-radius:12px;padding:10px 14px;margin-top:12px}.ob .tag{font-size:.8rem;color:var(--soft);text-transform:uppercase;letter-spacing:.06em}
.ob .tw{overflow-x:auto}.ob table{border-collapse:collapse;width:100%;font-size:.92rem}.ob th,.ob td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.ob .p1{font-weight:700;color:var(--b)}
</style>`

// a horizontal bar chart in SVG: rows of [label, value, colour var]
function bars(rows, w = 760) {
    const max = Math.max(...rows.map(r => r[1])), lh = 34, lw = 230
    return `<svg viewBox="0 0 ${w} ${rows.length * lh + 10}" role="img" aria-label="${esc(rows.map(r => `${r[0]}: ${r[1]}`).join(', '))}">${rows.map(([l, v, c], i) => {
        const y = i * lh + 6, bw = Math.max(4, (w - lw - 50) * v / max)
        return `<text x="${lw - 10}" y="${y + 19}" text-anchor="end" font-size="15">${esc(l)}</text><rect x="${lw}" y="${y + 4}" width="${bw}" height="22" rx="6" fill="var(${c})"/><text x="${lw + bw + 8}" y="${y + 20}" font-size="15" font-weight="700">${v}</text>`
    }).join('')}</svg>`
}

// the campaign as a funnel: lists -> reachable -> emails -> follow-ups -> the stand
function funnel(n) {
    const steps = [
        ['Companies found', n.all, `${n.targets} partners and peers (Indi) + ${n.buyers} buyers`, '--a'],
        ['Reachable', n.reach, `${n.email} by email, ${n.form} by web form (first 50); buyers: channels next`, '--d'],
        ['Emails written', n.written, `English for all, Portuguese for ${n.pt}`, '--c'],
        ['Sent by Silvio', n.sent, 'from Friday 6 November, after Dinis approves', '--b'],
        ['Meetings at the stand', n.met, 'Thursday 12 November, booth A1-30', '--e']]
    const W = 900, H = 64
    return `<svg viewBox="0 0 ${W} ${steps.length * H + 10}" role="img" aria-label="The campaign funnel: ${esc(steps.map(s => `${s[0]} ${s[1]}`).join(', '))}">${steps.map(([t, v, sub, c], i) => {
        const inset = i * 55, y = i * H + 4, w = W - 2 * inset
        return `<path d="M${inset} ${y} H${inset + w} L${inset + w - 28} ${y + H - 8} H${inset + 28} Z" fill="var(${c})" opacity=".18" stroke="var(${c})" stroke-width="2"/><text x="${W / 2}" y="${y + 26}" text-anchor="middle" font-size="18" font-weight="700">${esc(t)}: ${esc(v)}</text><text x="${W / 2}" y="${y + 46}" text-anchor="middle" font-size="13" class="s">${esc(sub)}</text>`
    }).join('')}</svg>`
}

// the dates, as a line with milestones
function timeline() {
    const d = [['Thu 5', 'emails written, channels found'], ['Fri 6', 'priority 1 sent'], ['Sat 7 – Sun 8', 'the rest sent'], ['Mon 9', 'follow-up 1, Web Summit opens'], ['Wed 11', 'follow-up 2: "tomorrow"'], ['Thu 12', 'our stand, A1-30']]
    const W = 900, step = (W - 160) / (d.length - 1)
    return `<svg viewBox="0 0 ${W} 130" role="img" aria-label="Timeline: ${esc(d.map(x => x.join(' ')).join('; '))}"><line x1="40" y1="45" x2="${W - 40}" y2="45" stroke="var(--line)" stroke-width="4"/>${d.map(([day, what], i) => {
        const x = 80 + i * step, last = i === d.length - 1
        return `<circle cx="${x}" cy="45" r="${last ? 14 : 10}" fill="var(${last ? '--e' : '--a'})"/><text x="${x}" y="22" text-anchor="middle" font-size="15" font-weight="700">${esc(day)}</text>${wrap(what, 16).map((l, k) => `<text x="${x}" y="${78 + k * 17}" text-anchor="middle" font-size="13" class="s">${esc(l)}</text>`).join('')}`
    }).join('')}</svg>`
}
const wrap = (t, n) => { const o = []; let c = ''; for (const w of t.split(' ')) { if ((c + ' ' + w).trim().length > n && c) { o.push(c); c = w } else c = (c + ' ' + w).trim() } if (c) o.push(c); return o }

// the mock: one buyer card. Our analysis (risks, how we help, opener) is written here for three buyers only.
const MOCK = {
    fidelidade: {
        does: "Portugal's largest insurer, and an event partner at Web Summit, scouting applied-AI pilots across the group.",
        risks: ['An AI agent that reads claims and policy data can reach far more customer records than its task needs.', 'The insurance supervisor will ask who authorised each automated decision.', 'Pilots multiply fast: nobody holds one list of which agents exist and what they may do.'],
        helps: 'One Agent Behaviour Policy per pilot: what it can reach, what it is allowed to do, the gap, and the controls that hold. The same page for the business, security, the auditor and the reinsurer.',
        opener: 'Os vossos pilotos de IA vão ter de responder a uma pergunta do supervisor: quem autorizou o quê. Nós escrevemos essa resposta, agente a agente.'
    },
    spms: {
        does: "The Portuguese Ministry of Health's shared services: the national health service's digital platforms and the SNS 24 contact centre. Event partner; its chairman speaks.",
        risks: ['Agents in a contact centre that touch patient data are high-risk under the EU AI Act.', 'Many suppliers build on the same platforms: responsibility for an agent is split.', 'Public procurement will need a written mandate for every AI system bought.'],
        helps: 'A behaviour policy as a procurement requirement: every supplier delivers each agent with its reach, its mandate and its evidence, in the same format.',
        opener: 'Cada agente de IA que toca dados de doentes devia trazer escrito o que pode fazer. Podemos mostrar-vos como, em 15 minutos.'
    },
    bunq: {
        does: "A licensed European bank rebuilding its core around generative models for 'truly autonomous banking', from its Web Summit session.",
        risks: ['Autonomous agents that move money are the clearest case of reach beyond mandate.', 'Bank supervisors expect a documented control for every automated action.', 'Each new model release changes what an agent can do; the record must follow the version.'],
        helps: 'A versioned behaviour policy per agent, tied to the model and tools it runs with, that a supervisor can read: reach, mandate, gap, barriers, provenance.',
        opener: 'Autonomous banking needs an answer to one question per agent: what is it allowed to do? We write that down, and show the gap.'
    }
}
function mockCard(b, m) {
    return `<div class="mock" id="mock-${esc(b.id)}"><span class="tag">Mock: buyer card</span><h3>${esc(b.name)}</h3>
<div class="chips"><span>${esc(b.sector)}</span><span>${esc(b.country)}</span><span>${esc(b.attending.replace(/ \(lis26\)/, ''))}</span><span>priority ${esc(b.priority)}</span></div>
<div class="cols"><div class="col"><b>What they do</b>${esc(m.does)}</div>
<div class="col r"><b>Their risk with AI agents</b><ul>${m.risks.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
<div class="col h"><b>How RiskMandate helps</b>${esc(m.helps)}</div>
<div class="col n"><b>How we reach them</b>Public channel: in Silvio's sealed tracker. Email ready: ${b.country === 'Portugal' ? 'Portuguese and English' : 'English'}. Next: the stand, Thursday 12 November.</div></div>
<p class="open"><b>First line:</b> ${esc(m.opener)}</p>
<p class="meta">Source: <a href="${esc(b.source_url)}">Web Summit listing</a>, read ${esc(b.read_on)}. The risks and the help are our analysis, not the company's statements.</p></div>`
}

export function build(ROOT) {
    const rd = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'people/silvio/outreach', f), 'utf8'))
    const M = rd('messages.json').messages, B = rd('buyers.json').buyers, O = rd('online.json').companies
    const pt = M.filter(m => m.pt).length, bpt = B.filter(b => b.country === 'Portugal').length
    const sectorOf = s => /bank|lend|payment|fintech|card|crypto|e-money|financ/i.test(s) ? 'Banks and payments' : /insur/i.test(s) ? 'Insurance' : /health|pharma/i.test(s) ? 'Health and pharma' : /telco|telecom|media|broadcast/i.test(s) ? 'Telecoms and media' : /energy|utilit|charging|EV/i.test(s) ? 'Energy' : /public|govern|agency|council|ministry|universit|EU |european|department/i.test(s) ? 'Public sector' : /consult|IT |services|software|platform/i.test(s) ? 'Consulting and IT' : 'Other corporates'
    const bySector = {}; for (const b of B) { const k = sectorOf(`${b.sector} ${b.name}`); bySector[k] = (bySector[k] || 0) + 1 }
    const sectorRows = Object.entries(bySector).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [k, v, ['--a', '--b', '--c', '--d', '--e'][i % 5]])
    // the first 50's channels (counts only; the channels are sealed): read from the plain counts in README
    const n = { targets: M.length, buyers: B.length, all: M.length + B.length, email: 18, form: 28, reach: 46, written: M.length, pt, sent: 0, met: 0 }
    const pick = ['fidelidade', 'spms', 'bunq'].map(id => B.find(b => b.id === id || b.id.startsWith(id))).filter(Boolean)
    const rows = B.slice().sort((a, b) => a.priority - b.priority || (b.country === 'Portugal') - (a.country === 'Portugal')).map(b =>
        `<tr><td class="${b.priority === 1 ? 'p1' : ''}">${b.priority}</td><td><a href="${esc(b.website)}">${esc(b.name)}</a></td><td>${esc(b.sector)}</td><td>${esc(b.country)}</td><td>${esc(b.why_buyer)}</td><td><a href="${esc(b.source_url)}">listing</a></td></tr>`).join('')
    const body = `<div class="ob">
<p class="lead">Before Web Summit, the companies we want to meet hear from us, and come to our stand at booth A1-30 on 12 November. Kept by conductor@web-summit.silvio for Silvio (WS-26). Agents draft; Silvio sends every email.</p>
<div class="kpis"><div class="kpi"><b>${n.all}</b><span>companies, all confirmed at Web Summit</span></div><div class="kpi"><b>${pt + bpt}</b><span>Portuguese, written to in Portuguese</span></div><div class="kpi"><b>${n.written}</b><span>emails written, each with 2 follow-ups</span></div><div class="kpi"><b>${n.sent}</b><span>sent so far (from Fri 6 Nov)</span></div></div>
<h2 id="campaign">1. The campaign in one picture</h2><div class="panel">${funnel(n)}</div>
<h2 id="dates">2. The dates</h2><div class="panel">${timeline()}</div>
<h2 id="buyers-by-sector">3. Who could buy: the ${B.length} buyers by sector</h2><div class="panel">${bars(sectorRows)}</div>
<p>Indi's 50 are mostly partners and peers (identity, agent platforms, AI security). The buyers are the companies that would pay for an agent behaviour policy: regulated, already running AI, and ${bpt} of them Portuguese.</p>
<h2 id="mock">4. Mock: one infographic card per buyer</h2>
<p>This is the proposal for every buyer, shown for three. Each card answers four questions on one screen: what they do, their risk with AI agents, how RiskMandate helps, and how we reach them, with the first line to say at the stand.</p>
${pick.map(b => mockCard(b, MOCK[Object.keys(MOCK).find(k => b.id.startsWith(k))])).join('')}
<h2 id="table">5. The ${B.length} buyers</h2><div class="tw"><table><thead><tr><th>P</th><th>Company</th><th>Sector</th><th>Country</th><th>Why they could buy</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table></div>
<h2 id="online">6. Online with Dinis: ${O.length} companies not at Web Summit</h2>
<p>Large companies, mostly Portuguese, that are not on any Web Summit 2026 partner or speaker page (checked 5 November). They are invited to a 30-minute online meeting with Dinis in the week of 16 November, so nobody travels. Emails in Portuguese and English: <code>people/silvio/outreach/online.json</code>.</p>
<div class="tw"><table><thead><tr><th>P</th><th>Company</th><th>Sector</th><th>Their AI today</th></tr></thead><tbody>${O.slice().sort((a, b) => a.priority - b.priority).map(o => `<tr><td class="${o.priority === 1 ? 'p1' : ''}">${o.priority}</td><td>${esc(o.company)}</td><td>${esc(o.sector)}</td><td>${o.ai_fact_source ? `<a href="${esc(o.ai_fact_source)}">${esc(o.ai_fact)}</a>` : esc(o.ai_fact)}</td></tr>`).join('')}</tbody></table></div>
<p class="meta">Built by <code>people/silvio/pages.mjs</code> from <code>people/silvio/outreach/messages.json</code> and <code>buyers.json</code> (read on websummit.com, 5 November 2026). Companies and public roles only; no person's contact detail. The channels and replies are sealed to Silvio.</p></div>`
    const md = `Before Web Summit, the companies we want to meet hear from us, and come to our stand at booth A1-30 on 12 November (WS-26).\n\n- Companies: ${n.all} (${n.targets} partners and peers, ${n.buyers} buyers), ${pt + bpt} Portuguese.\n- Emails written: ${n.written}, English for all, Portuguese for ${pt}; two follow-ups each.\n- Dates: Fri 6 priority 1; Sat 7 and Sun 8 the rest; Mon 9 follow-up 1; Wed 11 follow-up 2; Thu 12 the stand.\n\n## Buyers by sector\n\n${sectorRows.map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\n## Mock buyer cards\n\n${pick.map(b => { const m = MOCK[Object.keys(MOCK).find(k => b.id.startsWith(k))]; return `### ${b.name}\n\n- What they do: ${m.does}\n- Risks: ${m.risks.join(' ')}\n- How RiskMandate helps: ${m.helps}\n- First line: ${m.opener}` }).join('\n\n')}\n\n## Online with Dinis: ${O.length} not at Web Summit\n\n${O.map(o => `- ${o.company} (P${o.priority}, ${o.sector}): ${o.ai_fact}`).join('\n')}\n\n## The ${B.length} buyers\n\n| P | Company | Sector | Country | Why |\n|---|---|---|---|---|\n${B.map(b => `| ${b.priority} | ${b.name} | ${b.sector} | ${b.country} | ${String(b.why_buyer).replace(/\|/g, '/')} |`).join('\n')}\n`
    return [{ rel: 'people/silvio/outreach/index.html', title: 'Outreach before Web Summit: the campaign and the buyers', description: `The outreach campaign (WS-26) in one picture: ${n.all} companies confirmed at Web Summit, the emails and dates, the ${B.length} buyers by sector, and a mock infographic card per buyer.`, body, md, head: CSS }, competitive(ROOT), lab(), eventos(ROOT), explica()]
}
