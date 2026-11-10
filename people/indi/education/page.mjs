// RiskMandate for education and children: /people/indi/education/.
// The words are people/indi/education/brief.md (also the page's markdown twin), from Indi's brief of 4 November 2026
// (brief.pdf beside it). Published at Dinis's suggestion, 10 November 2026, by education@web-summit.indi (WS-209).
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const safe = u => /^(https:\/\/|[a-z0-9._-]+(\/[a-z0-9._-]+)*(#[a-z0-9-]+)?$)/i.test(u)
const inline = t => esc(t)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, h) => safe(h.replace(/&amp;/g, '&')) ? `<a href="${h}">${a}</a>` : a)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')

// headings, paragraphs, flat lists and tables: all that brief.md uses
function render(md) {
    const L = md.split('\n'), out = []; let i = 0
    while (i < L.length) {
        const l = L[i]; let m
        if (!l.trim() || /^# /.test(l)) { i++; continue }   // the title comes from the build
        if ((m = l.match(/^(#{2,3}) (.*)/))) { out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); i++; continue }
        if (/^\|/.test(l)) {
            const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++])
            const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
            const [h, , ...b] = rows
            out.push(`<table><thead><tr>${cells(h).map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${b.map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`)
            continue
        }
        if ((m = l.match(/^(\d+\.|-) /))) {
            const tag = m[1] === '-' ? 'ul' : 'ol', items = []
            while (i < L.length && /^(\d+\.|-) /.test(L[i])) items.push(L[i++].replace(/^(\d+\.|-) /, ''))
            out.push(`<${tag}>${items.map(t => `<li>${inline(t)}</li>`).join('')}</${tag}>`)
            continue
        }
        const para = []; while (i < L.length && L[i].trim() && !/^(#|\||-|\d+\.) /.test(L[i]) && !/^\|/.test(L[i])) para.push(L[i++])
        out.push(`<p>${inline(para.join(' '))}</p>`)
    }
    return out.join('\n')
}

export function build(ROOT) {
    const md = fs.readFileSync(path.join(ROOT, 'people/indi/education/brief.md'), 'utf8')
    return [{
        rel: 'people/indi/education/index.html',
        title: 'Safe AI for learning: RiskMandate for education and children',
        description: 'An idea, not yet built: AI helpers for schools that help students learn and keep children safe online, held to plain-language rules that schools and governments set (Agent Behaviour Policies). From Indi Gupte\'s brief of 4 November 2026; come and talk at Web Summit.',
        body: render(md),
        md: md.replace(/^# .*\n+/, ''),
    }]
}
