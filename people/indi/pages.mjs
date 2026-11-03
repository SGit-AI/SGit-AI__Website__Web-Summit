// The factory (WS-27): one infographic page per target company, built from people/indi/factory/companies.json
// (our analysis) and data/companies.json (the sourced facts). Called by admin/build/build.mjs; written by
// dev@web-summit.indi. Every graphic is inline SVG or HTML, so it reads without JavaScript; factory.js only adds
// "expand to fill the screen".
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const PAL = ['#cdefe3', '#e3ddf7', '#ffe1d0', '#fff3c4', '#d6ecfa', '#f9d9e3']  // mint, lavender, peach, butter, sky, rose
const EDGE = ['#7cc9ad', '#a99be0', '#f0a37f', '#e5c75c', '#86bde6', '#e597b0']
const HEAD = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@600;800&display=swap"><link rel="stylesheet" href="FACTORY/factory.css"><script src="FACTORY/factory.js" defer></script>'

// wrap text into SVG lines of about n characters
function lines(t, n) {
    const out = []; let cur = ''
    for (const w of String(t).split(/\s+/)) { if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w } else cur = (cur + ' ' + w).trim() }
    if (cur) out.push(cur); return out
}
const tspans = (t, x, y, n, lh = 17) => { const ls = lines(t, n); const y0 = y - (ls.length - 1) * lh / 2; return ls.map((l, i) => `<tspan x="${x}" y="${y0 + i * lh}">${esc(l)}</tspan>`).join('') }

// 1. what it does: a flow, the company -> what it makes -> who uses it -> where agents come in
function flowSvg(name, steps) {
    const all = [name, ...steps], w = 170, gap = 40, W = all.length * w + (all.length - 1) * gap
    const box = (t, i) => { const x = i * (w + gap); return `<rect x="${x}" y="20" width="${w}" height="100" rx="${i ? 18 : 50}" fill="${PAL[i % 6]}" stroke="${EDGE[i % 6]}" stroke-width="2"/><text x="${x + w / 2}" y="70" text-anchor="middle" class="${i ? 'sv' : 'sv svb'}">${tspans(t, x + w / 2, 70, 17)}</text>` }
    const arrow = i => { const x = i * (w + gap) + w; return `<path d="M${x + 4} 70 H${x + gap - 6}" stroke="#8a87a0" stroke-width="2.5" marker-end="url(#ah)"/>` }
    return `<svg class="ig-svg" viewBox="-4 0 ${W + 8} 140" role="img" aria-label="Flow: ${esc(all.join(' to '))}"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#8a87a0"/></marker></defs>${all.map(box).join('')}${all.slice(0, -1).map((_, i) => arrow(i)).join('')}</svg>`
}

// 2. the risks: a mind map, the company in the middle and one shape per risk
function mindSvg(name, risks) {
    const cx = 400, cy = 190, pos = risks.length === 3 ? [[150, 80], [650, 80], [400, 318]] : [[150, 70], [650, 70], [150, 310], [650, 310]]
    const shape = (k, x, y) => [
        `<circle cx="${x}" cy="${y}" r="62"/>`,
        `<polygon points="${[0, 1, 2, 3, 4, 5].map(a => `${x + 78 * Math.cos(Math.PI / 3 * a)},${y + 58 * Math.sin(Math.PI / 3 * a)}`).join(' ')}"/>`,
        `<rect x="${x - 82}" y="${y - 48}" width="164" height="96" rx="26"/>`,
        `<ellipse cx="${x}" cy="${y}" rx="86" ry="56"/>`][k % 4]
    const nodes = risks.map((r, i) => { const [x, y] = pos[i]; const c = (i + 2) % 6
        return `<path d="M${cx} ${cy} Q${(cx + x) / 2} ${y} ${x} ${y}" fill="none" stroke="${EDGE[c]}" stroke-width="3" stroke-dasharray="${i % 2 ? '6 5' : '0'}"/><g fill="${PAL[c]}" stroke="${EDGE[c]}" stroke-width="2">${shape(i, x, y)}</g><text x="${x}" y="${y}" text-anchor="middle" class="sv">${tspans(r.t, x, y, 14)}</text>` })
    return `<svg class="ig-svg" viewBox="40 0 720 380" role="img" aria-label="Mind map of the risks for ${esc(name)}: ${esc(risks.map(r => r.t).join('; '))}">${nodes.join('')}<ellipse cx="${cx}" cy="${cy}" rx="110" ry="54" fill="#fff" stroke="#3b3a4a" stroke-width="2.5"/><text x="${cx}" y="${cy}" text-anchor="middle" class="sv svb">${tspans(`Agent risks for ${name}`, cx, cy, 18)}</text></svg>`
}

// 3. how RiskMandate helps: Reach (the dome), Mandate (the ring), the Gap between; then the five steps as chevrons
function rmgSvg(h) {
    return `<svg class="ig-svg ig-rmg" viewBox="0 0 300 300" role="img" aria-label="Reach, Mandate and the Gap between them"><circle cx="150" cy="150" r="140" fill="#d6ecfa" stroke="#86bde6" stroke-width="2"/><circle cx="150" cy="185" r="70" fill="#fff3c4" stroke="#e5c75c" stroke-width="5"/><text x="150" y="45" text-anchor="middle" class="sv svb">Reach</text><text x="150" y="68" text-anchor="middle" class="sv">${esc(h.reach_short || 'what it can touch')}</text><text x="150" y="180" text-anchor="middle" class="sv svb">Mandate</text><text x="150" y="200" text-anchor="middle" class="sv">${esc(h.mandate_short || 'what it may do')}</text><text x="62" y="120" text-anchor="middle" class="sv svg-gap">the Gap</text></svg>`
}
const STEPS = [['reach', 'Reach', 'what it can actually access or affect'], ['mandate', 'Mandate', 'what the business authorised'], ['gap', 'Gap', 'the difference: the risk'], ['barriers', 'Barriers', 'what really stands in the way'], ['provenance', 'Provenance', 'who owns it, who reviewed it, which version']]
const chevrons = h => `<ol class="ig-chev">${STEPS.map(([k, t, d], i) => `<li style="--c:${PAL[(i + 4) % 6]};--e:${EDGE[(i + 4) % 6]}"><b>${t}</b><span class="ig-def">${d}</span><span>${esc(h[k])}</span></li>`).join('')}</ol>`

const twoCols = (n, l) => `<div class="ig-two"><div class="ig-col ig-n"><h4>In normal terms</h4>${n}</div><div class="ig-col ig-l"><h4>In lay terms</h4>${l}</div></div>`
const panel = (id, num, title, graphic, n, l, cls = '') => `<section class="ig-panel ${cls}" id="${id}"><header><span class="ig-num">${num}</span><h2>${title}</h2><button class="ig-expand" type="button" aria-label="Expand ${esc(title)} to fill the screen">⤢ Expand</button></header><div class="ig-graphic">${graphic}</div>${twoCols(n, l)}</section>`
const p = t => `<p>${esc(t)}</p>`
const riskList = (rs, k) => `<ul class="ig-risks">${rs.map((r, i) => `<li style="--c:${PAL[(i + 2) % 6]}"><b>${esc(r.t)}.</b> ${esc(r[k])}</li>`).join('')}</ul>`

export function build(ROOT) {
    const F = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/indi/factory/companies.json'), 'utf8'))
    const facts = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/companies.json'), 'utf8')).companies.map(c => [c.id, c]))
    const out = [], cards = []
    for (const c of F.companies) {
        const f = facts[c.id]; if (!f) throw new Error(`people/indi/factory/companies.json: ${c.id} is not in data/companies.json`)
        const rel = `people/indi/factory/${c.id}/index.html`, title = `${f.name}: the factory infographic`
        const description = `${f.name} in three pictures, each in normal terms and in lay terms: what it does, the risks it faces from AI agents, and how RiskMandate helps. Our analysis, from public sources.`
        const src = f.sources.map(s => `<li><a href="${esc(s.url)}">${esc(new URL(s.url).hostname)}</a>, read ${esc(s.read_on)}: ${esc(s.supports)}</li>`).join('')
        const body = `<div class="ig" data-company="${esc(c.id)}">
<div class="ig-top"><span class="ig-chip" style="--c:${PAL[0]}">${esc(f.category)}</span><span class="ig-chip" style="--c:${PAL[4]}">${esc(f.country)}</span><span class="ig-chip" style="--c:${PAL[3]}">at Web Summit: ${esc(f.attending_as)}</span><span class="ig-chip" style="--c:${PAL[1]}">our decision: ${esc(f.decision)}, priority ${esc(f.priority)}</span></div>
<p class="ig-tag">${esc(c.tagline)}</p>
${panel('what', 1, 'What the company does', flowSvg(f.name, c.flow), p(f.what) + p(c.what_n), p(c.what_l))}
${panel('risks', 2, 'The risks it faces, especially from AI agents', mindSvg(f.name, c.risks), riskList(c.risks, 'n'), riskList(c.risks, 'l'))}
${panel('helps', 3, 'How RiskMandate helps', `<div class="ig-helps">${rmgSvg(c.helps)}${chevrons(c.helps)}</div>`, p(c.helps.n), p(c.helps.l), 'ig-last')}
<p class="ig-opener"><b>A first line for the conversation:</b> ${esc(c.opener)}</p>
<details class="ig-src"><summary>Sources and method</summary><p>The facts in grey (what it does) are from <a href="../../../../companies/${esc(c.id)}/index.html">the company map</a>, which cites:</p><ul>${src}</ul><p>The risks and how RiskMandate helps are <b>our analysis</b>, written by dev@web-summit.indi on ${esc(F.written)} from those facts and RiskMandate's model as this site explains it (<a href="../../../../videos/reach-mandate-gap/index.html">Reach, Mandate, Gap</a>; <a href="../../../../abp/conductor-web-summit-dinis/index.html">an Agent Behaviour Policy in practice</a>). They are not the company's own statements and name no incident. A person reviews each before it is used.</p></details>
<p><a href="../index.html">All the factory's companies</a></p></div>`
        const md = `${c.tagline}\n\n## 1. What the company does\n\nFlow: ${[f.name, ...c.flow].join(' → ')}\n\n- **Normal:** ${f.what} ${c.what_n}\n- **Lay:** ${c.what_l}\n\n## 2. The risks it faces, especially from AI agents\n\n${c.risks.map(r => `- **${r.t}.** Normal: ${r.n} Lay: ${r.l}`).join('\n')}\n\n## 3. How RiskMandate helps\n\n${STEPS.map(([k, t]) => `- **${t}:** ${c.helps[k]}`).join('\n')}\n\n- **Normal:** ${c.helps.n}\n- **Lay:** ${c.helps.l}\n\n**A first line for the conversation:** ${c.opener}\n\nSources: ${f.sources.map(s => `${s.url} (read ${s.read_on})`).join('; ')}. The risks and the help are our analysis (dev@web-summit.indi, ${F.written}), not the company's statements.\n`
        out.push({ rel, title, description, body, md, head: HEAD.replaceAll('FACTORY', '..') })
        cards.push({ c, f })
    }
    const R = F.riskmandate
    const idx = `<div class="ig">
<p class="ig-tag">${esc(F.intro)}</p>
${panel('model', '★', 'RiskMandate in one picture', `<div class="ig-helps">${rmgSvg({ reach_short: 'what it can touch', mandate_short: 'what it may do' })}${chevrons(R)}</div>`, p(R.n), p(R.l), 'ig-last')}
<h2 id="companies">The companies (${cards.length})</h2>
<div class="ig-grid">${cards.map(({ c, f }, i) => `<a class="ig-card" style="--c:${PAL[i % 6]};--e:${EDGE[i % 6]}" href="${esc(c.id)}/index.html"><b>${esc(f.name)}</b><span class="ig-mini">${esc(f.category)} · ${esc(f.country)}</span><span>${esc(c.tagline)}</span></a>`).join('')}</div>
<p class="meta">Built from <code>people/indi/factory/companies.json</code> by <code>people/indi/pages.mjs</code> (WS-27). The companies are those marked "meet" on <a href="../../../companies/index.html">the company map</a>. Each page: the sourced facts, then our analysis, side by side in normal and lay terms; every panel expands to fill the screen.</p></div>`
    const idxMd = `${F.intro}\n\n## RiskMandate in one picture\n\n${STEPS.map(([k, t]) => `- **${t}:** ${R[k]}`).join('\n')}\n\n- **Normal:** ${R.n}\n- **Lay:** ${R.l}\n\n## The companies\n\n${cards.map(({ c, f }) => `- [${f.name}](${c.id}/index.md): ${c.tagline}`).join('\n')}\n`
    out.unshift({ rel: 'people/indi/factory/index.html', title: 'The factory: one infographic per company', description: `What each target company does, the risks it faces from AI agents and how RiskMandate helps, in pictures and in normal and lay terms: ${cards.length} companies (WS-27).`, body: idx, md: idxMd, head: HEAD.replaceAll('FACTORY', '.') })
    return out
}
