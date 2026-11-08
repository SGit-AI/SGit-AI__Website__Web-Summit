// Token efficiency across the team's agents: /people/indi/token-efficiency/.
// The words are people/indi/token-efficiency/REPORT.md (also the page's markdown twin); the tiles and the chart come
// from figures.json, counted from the team's ledgers by conductor@web-summit.indi with the method of
// accountant@web-summit.indi (people/indi/accountant/PROMPT.md). Inline SVG, so it reads without JavaScript.
import fs from 'node:fs'
import path from 'node:path'
import { nav } from '../today/today.mjs'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const HEAD = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@700;800&display=swap"><link rel="stylesheet" href="../schedules/schedules.css"><link rel="stylesheet" href="te.css"><link rel="stylesheet" href="../ui/ui.css"><script src="../ui/ui.js" defer></script>'
const M = n => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1e3)}k`

// a small markdown renderer for this one report: headings, paragraphs, lists (one level of nesting), tables, bold, code
const inline = t => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
function render(md) {
    const L = md.split('\n'), out = []; let i = 0
    while (i < L.length) {
        const l = L[i]
        if (!l.trim()) { i++; continue }
        if (/^# /.test(l)) { i++; continue }   // the page title comes from the build
        let m
        if ((m = l.match(/^(#{2,3}) (.*)/))) { out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); i++; continue }
        if (/^\|/.test(l)) {
            const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++])
            const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
            const [h, , ...b] = rows
            out.push(`<div class="te-table"><table><thead><tr>${cells(h).map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${b.map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)
            continue
        }
        if (/^(\d+\.|-) /.test(l)) {
            const ol = /^\d+\./.test(l), items = []
            while (i < L.length && (/^(\d+\.|-) /.test(L[i]) || /^ {2,}- /.test(L[i]))) {
                if (/^ {2,}- /.test(L[i])) { items[items.length - 1].sub.push(L[i].replace(/^ +- /, '')); i++; continue }
                items.push({ t: L[i].replace(/^(\d+\.|-) /, ''), sub: [] }); i++
            }
            out.push(`<${ol ? 'ol' : 'ul'}>${items.map(it => `<li>${inline(it.t)}${it.sub.length ? `<ul>${it.sub.map(s => `<li>${inline(s)}</li>`).join('')}</ul>` : ''}</li>`).join('')}</${ol ? 'ol' : 'ul'}>`)
            continue
        }
        const para = []; while (i < L.length && L[i].trim() && !/^(#|\||\d+\. |- )/.test(L[i])) para.push(L[i++])
        out.push(`<p>${inline(para.join(' '))}</p>`)
    }
    return out.join('\n')
}

// one bar per person: fresh tokens, and a tenth of cache reads (how the cost is counted)
function barsSvg(F) {
    const P = Object.entries(F.people), max = Math.max(...P.map(([, v]) => v.fresh + 0.1 * v.cr)), W = 560, X0 = 110
    const rows = P.map(([n, v], k) => {
        const y = 30 + k * 56, f = v.fresh / max * W, c = 0.1 * v.cr / max * W
        return `<text x="${X0 - 12}" y="${y + 22}" text-anchor="end" class="ln">${esc(n)}</text><rect x="${X0}" y="${y}" width="${f}" height="32" rx="10" fill="#d9ecfa" stroke="#86bde6" stroke-width="2"/><rect x="${X0 + f}" y="${y}" width="${c}" height="32" rx="10" fill="#f9dbe4" stroke="#e59bb3" stroke-width="2"/><text x="${X0 + f + c + 10}" y="${y + 22}" class="tt">${M(v.fresh + 0.1 * v.cr)} (${v.wakes} wakes)</text>`
    })
    const H = 30 + P.length * 56 + 34
    return `<svg class="sc-svg" viewBox="0 0 820 ${H}" role="img" aria-label="Token cost by person: ${esc(P.map(([n, v]) => `${n} ${M(v.fresh + 0.1 * v.cr)}, of which cache reads ${Math.round(0.1 * v.cr / (v.fresh + 0.1 * v.cr) * 100)}%`).join('; '))}">${rows.join('')}<rect x="${X0}" y="${H - 22}" width="18" height="14" rx="4" fill="#d9ecfa" stroke="#86bde6"/><text x="${X0 + 26}" y="${H - 10}" class="tl">fresh tokens</text><rect x="${X0 + 150}" y="${H - 22}" width="18" height="14" rx="4" fill="#f9dbe4" stroke="#e59bb3"/><text x="${X0 + 176}" y="${H - 10}" class="tl">cache reads (counted at a tenth)</text></svg>`
}

export function build(ROOT) {
    const dir = path.join(ROOT, 'people/indi/token-efficiency')
    const md = fs.readFileSync(path.join(dir, 'REPORT.md'), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '')
    const F = JSON.parse(fs.readFileSync(path.join(dir, 'figures.json'), 'utf8')), T = F.total
    const share = Math.round(0.1 * T.cr / T.cost * 100), cons = Math.round((1 - T.cons / T.cost) * 100), best = Math.round((1 - T.best / T.cost) * 100)
    const tiles = [[T.wakes, `measured wakes, ${T.agents} agents`, 'lav'], [M(T.cost), 'tokens (fresh + a tenth of cache reads)', 'sky'], [`${share}%`, 'of it is cache reads', 'rose'], [`${cons} to ${best}%`, 'could be saved, same output', 'mint']]
    const body = `<div class="sc te">
<div class="ux">${nav('../', 'tokens')}</div>
<p class="lead">How the team's agents use Claude, from their own token records, 4 to 8 November 2026. And ten rules to get the same output for less.</p>
<div class="tiles">${tiles.map(([n, l, c]) => `<div class="tile ${c}"><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div>
<section><h2><span class="pill sky">1</span> Who spends what</h2><div class="frame">${barsSvg(F)}</div>
<p class="muted">Only Angelo's, Jose's and two of Indi's agents write token records so far.</p></section>
<section class="te-body"><h2><span class="pill mint">2</span> The analysis and the rules</h2>
${render(md)}
</section>
<p class="meta">Built by <code>people/indi/token-efficiency/page.mjs</code> from <code>REPORT.md</code> and <code>figures.json</code>. Read on ${esc(F.read_at.replace('T', ' ').replace('Z', ' UTC'))}. See also <a href="../schedules/index.html">who wakes when</a>.</p>
</div>`
    return [{ rel: 'people/indi/token-efficiency/index.html', title: 'Token efficiency: the team\'s agents', description: `${T.wakes} measured wakes from ${T.agents} agents cost ${M(T.cost)} tokens, ${share}% of it cache reads. The same output could cost ${cons}% to ${best}% less. Ten rules, ready for an ABP.`, body, md, head: HEAD }]
}
