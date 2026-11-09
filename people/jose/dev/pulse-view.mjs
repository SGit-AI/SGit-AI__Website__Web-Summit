// pulse-view.mjs: Jose's pulse over time, one page, from his own pulse files only (WS-41 step 2, approved by Jose on
// 7 November 2026, C30; dev@web-summit.jose). Called by people/jose/pages.mjs, which the site's build runs.
// Reads people/jose/pulse/<YYYY-MM-DD>-<morning|midday|evening>.md and shows only what they say: which slots have a
// check-in, his blockers (question 2) and his feeling line (question 6) as written, and each check-in in full.
// Nothing is scored, summarised or invented; an empty slot says "no check-in". No script on the page.
import fs from 'node:fs'
import path from 'node:path'

export const SLOTS = ['morning', 'midday', 'evening']
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// one pulse file -> { date, slot, by, answers: [{ n, label, text }] }; the answers as written, "**N. Label.** text"
export function parsePulse(name, text) {
    const m = name.match(/^(\d{4}-\d{2}-\d{2})-(morning|midday|evening)\.md$/)
    if (!m) return null
    const fm = (text.match(/^---\n([\s\S]*?)\n---\n?/) || [])[1] || ''
    const body = text.replace(/^---\n[\s\S]*?\n---\n?/, '')
    const by = ((fm.match(/^by:\s*(.*)$/m) || [])[1] || '').trim()
    const answers = [...body.matchAll(/\*\*(\d)\.\s*([^*]+?)\*\*\s*([\s\S]*?)(?=\n\s*\*\*\d\.|\s*$)/g)]
        .map(a => ({ n: +a[1], label: a[2].trim().replace(/[.:]$/, ''), text: a[3].trim() }))
    return { date: m[1], slot: m[2], by, answers, raw: answers.length ? '' : body.trim() }
}

const days = (from, to) => { const out = []; for (let d = new Date(from + 'T00:00:00Z'); d.toISOString().slice(0, 10) <= to; d.setUTCDate(d.getUTCDate() + 1)) out.push(d.toISOString().slice(0, 10)); return out }
const DAY = d => { const x = new Date(d + 'T00:00:00Z'); return `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][x.getUTCDay()]} ${x.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][x.getUTCMonth()]}` }

// today is passed in so the page and its test agree; the build passes the build day (UTC)
export function pulseView(ROOT, { today = new Date().toISOString().slice(0, 10), start = '2026-11-03' } = {}) {
    const dir = path.join(ROOT, 'people', 'jose', 'pulse')
    const all = (fs.existsSync(dir) ? fs.readdirSync(dir) : []).sort()
        .map(f => parsePulse(f, fs.readFileSync(path.join(dir, f), 'utf8'))).filter(Boolean)
    const at = (d, s) => all.find(p => p.date === d && p.slot === s)
    const range = days(start, today < start ? start : today)
    const answer = (p, n) => (p.answers.find(a => a.n === n) || {}).text || ''
    const rel = 'people/jose/pulse/index.html', title = "Jose's pulse over time"
    const description = `Jose's check-ins from people/jose/pulse/: ${all.length} so far, ${range.length} days since ${DAY(start)}. Only what they say.`

    // HTML
    const cell = (d, s) => at(d, s) ? `<td><a href="#${d}-${s}">check-in</a></td>` : '<td class="none">no check-in</td>'
    const grid = `<table><thead><tr><th>Day</th>${SLOTS.map(s => `<th>${s[0].toUpperCase() + s.slice(1)}</th>`).join('')}</tr></thead><tbody>${range.slice().reverse().map(d => `<tr><th scope="row">${DAY(d)}</th>${SLOTS.map(s => cell(d, s)).join('')}</tr>`).join('')}</tbody></table>`
    const newest = all.slice().reverse()
    const blockers = newest.filter(p => answer(p, 2)).map(p => `<li><b>${DAY(p.date)}, ${p.slot}:</b> ${esc(answer(p, 2))}</li>`).join('')
    const feelings = newest.filter(p => answer(p, 6)).map(p => `<li><b>${DAY(p.date)}, ${p.slot}:</b> ${esc(answer(p, 6))}</li>`).join('')
    const full = newest.map(p => `<section id="${p.date}-${p.slot}"><h3>${DAY(p.date)}, ${p.slot}</h3>${p.by ? `<p class="meta">Taken by ${esc(p.by)}.</p>` : ''}${p.answers.length ? `<dl>${p.answers.map(a => `<dt>${a.n}. ${esc(a.label)}</dt><dd>${esc(a.text)}</dd>`).join('')}</dl>` : `<p>${esc(p.raw)}</p>`}<p class="meta"><a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/pulse/${p.date}-${p.slot}.md">The file</a></p></section>`).join('')
    const intro = `<p>Jose's check-ins, from his own files in <code>people/jose/pulse/</code>, ${all.length} so far. Only what they say: nothing is scored or summarised, and an empty slot is just that. Since 6 November his pulse comes once a day, in the evening, from his daily interview (C19). The team's pulse is on <a href="../../../pulse/index.html">the pulse page</a>.</p>`
    const body = `${intro}<h2 id="days">Day by day</h2>${grid}<h2 id="blockers">What was blocking him</h2>${blockers ? `<ul>${blockers}</ul>` : '<p>None written yet.</p>'}<h2 id="feeling">How he was feeling, in his words</h2>${feelings ? `<ul>${feelings}</ul>` : '<p>None written yet.</p>'}<h2 id="checkins">Each check-in</h2>${full || '<p>None yet.</p>'}<p class="meta">Built by people/jose/pages.mjs (people/jose/dev/pulse-view.mjs, dev@web-summit.jose; WS-41 step 2).</p>`

    // the markdown twin
    const mdCell = (d, s) => at(d, s) ? 'check-in' : 'no check-in'
    const md = [
        `Jose's check-ins, from his own files in \`people/jose/pulse/\`, ${all.length} so far. Only what they say: nothing is scored or summarised. Since 6 November his pulse comes once a day, in the evening, from his daily interview (C19).`, '',
        '## Day by day', '', '| Day | Morning | Midday | Evening |', '|---|---|---|---|',
        ...range.slice().reverse().map(d => `| ${DAY(d)} | ${SLOTS.map(s => mdCell(d, s)).join(' | ')} |`), '',
        '## What was blocking him', '', ...(newest.filter(p => answer(p, 2)).map(p => `- **${DAY(p.date)}, ${p.slot}:** ${answer(p, 2)}`)), ...(blockers ? [] : ['None written yet.']), '',
        '## How he was feeling, in his words', '', ...(newest.filter(p => answer(p, 6)).map(p => `- **${DAY(p.date)}, ${p.slot}:** ${answer(p, 6)}`)), ...(feelings ? [] : ['None written yet.']), '',
        '## Each check-in', '', ...newest.flatMap(p => [`### ${DAY(p.date)}, ${p.slot}`, '', ...(p.answers.length ? p.answers.flatMap(a => [`**${a.n}. ${a.label}.** ${a.text}`, '']) : [p.raw, '']), ]),
    ].join('\n')
    return { rel, title, description, body, md }
}
