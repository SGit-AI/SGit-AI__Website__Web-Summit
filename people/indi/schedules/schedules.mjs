// Indi's agents and their scheduled tasks, as a pastel infographic: /people/indi/schedules/.
// One day-at-a-glance timeline, then one card per agent: its own timeline and a mind map of what it does each wake.
// The data is people/indi/schedules/schedules.json, kept by conductor@web-summit.indi from the scheduled tasks in
// Indi's Claude account. Every graphic is inline SVG, so the page reads without JavaScript.
import fs from 'node:fs'
import path from 'node:path'
import { nav } from '../today/today.mjs'   // the pill bar shared with Indi's other pages (WS-06)

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const HEAD = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@700;800&display=swap"><link rel="stylesheet" href="schedules.css"><link rel="stylesheet" href="../ui/ui.css"><script src="../ui/ui.js" defer></script>'
const FILL = { lav: '#e6e0f8', mint: '#d3f0e4', sky: '#d9ecfa', peach: '#ffe3d3', butter: '#fff2c6', rose: '#f9dbe4' }
const EDGE = { lav: '#a99be0', mint: '#7cc9ad', sky: '#86bde6', peach: '#efa784', butter: '#e2c35c', rose: '#e59bb3' }
const mins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

// wrap text into SVG lines of about n characters
function wrap(t, n) {
    const out = []; let cur = ''
    for (const w of String(t).split(/\s+/)) { if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w } else cur = (cur + ' ' + w).trim() }
    if (cur) out.push(cur); return out
}

// the whole day: one lane per scheduled agent, a dot at each wake (06:00 to 20:00)
function daySvg(S) {
    const X0 = 150, W = 780, H0 = 6 * 60, H1 = 20 * 60, lane = 46, top = 40
    const x = m => X0 + (m - H0) / (H1 - H0) * W, H = top + S.length * lane + 20
    const ticks = []; for (let h = 6; h <= 20; h += 2) ticks.push(`<line x1="${x(h * 60)}" y1="${top - 6}" x2="${x(h * 60)}" y2="${H - 16}" class="tk"/><text x="${x(h * 60)}" y="${top - 14}" text-anchor="middle" class="tl">${String(h).padStart(2, '0')}:00</text>`)
    const lanes = S.map((a, i) => {
        const y = top + i * lane + lane / 2, f = FILL[a.colour], e = EDGE[a.colour], dash = a.status === 'planned' ? ' stroke-dasharray="6 5"' : ''
        const dots = a.times.map(t => `<circle cx="${x(mins(t))}" cy="${y}" r="11" fill="${f}" stroke="${e}" stroke-width="3"${dash}/><text x="${x(mins(t))}" y="${y - 17}" text-anchor="middle" class="tt">${t}</text>`).join('')
        return `<rect x="${X0 - 8}" y="${y - 17}" width="${W + 16}" height="34" rx="17" fill="${f}" opacity=".45"/><text x="${X0 - 18}" y="${y + 5}" text-anchor="end" class="ln">${esc(a.name)}${a.status === 'planned' ? ' *' : ''}</text>${dots}`
    })
    return `<svg class="sc-svg" viewBox="0 0 960 ${H}" role="img" aria-label="A day of Indi's agents: ${esc(S.map(a => `${a.name} at ${a.times.join(', ')}`).join('; '))}">${ticks.join('')}${lanes.join('')}</svg>`
}

// one agent's day: a sun-to-moon bar with its wakes
function stripSvg(a) {
    const X0 = 20, W = 600, x = m => X0 + m / 1440 * W, e = EDGE[a.colour], f = FILL[a.colour]
    const marks = [0, 6, 12, 18, 24].map(h => `<text x="${x(h * 60)}" y="72" text-anchor="middle" class="tl">${String(h % 24).padStart(2, '0')}:00</text>`).join('')
    const dots = a.times.map(t => `<path d="M${x(mins(t))} 20 v12" stroke="${e}" stroke-width="3"/><circle cx="${x(mins(t))}" cy="42" r="10" fill="#fff" stroke="${e}" stroke-width="3"/><text x="${x(mins(t))}" y="14" text-anchor="middle" class="tt">${t}</text>`).join('')
    return `<svg class="sc-strip" viewBox="0 0 640 80" role="img" aria-label="${esc(a.name)} wakes at ${esc(a.times.join(', '))} UTC"><defs><linearGradient id="g-${a.id}" x1="0" x2="1"><stop offset="0" stop-color="#d9d6ee"/><stop offset=".3" stop-color="${f}"/><stop offset=".7" stop-color="${f}"/><stop offset="1" stop-color="#d9d6ee"/></linearGradient></defs><rect x="${X0}" y="34" width="${W}" height="16" rx="8" fill="url(#g-${a.id})"/>${marks}${dots}</svg>`
}

// what it does: the agent in the middle, four branches (each wake, reads, writes, tells you)
function mindSvg(a) {
    const cx = 380, cy = 240, e = EDGE[a.colour], f = FILL[a.colour]
    const box = (title, items, bx, by, k) => {
        const ls = items.flatMap(t => wrap(t, 31).map((l, j) => (j ? '   ' : '• ') + l)).slice(0, 9)
        const h = 38 + ls.length * 19, y0 = by - h / 2
        return `<path d="M${cx} ${cy} Q${(cx + bx) / 2} ${by} ${bx} ${by}" fill="none" stroke="${e}" stroke-width="3"${k % 2 ? ' stroke-dasharray="7 6"' : ''}/><rect x="${bx - 150}" y="${y0}" width="300" height="${h}" rx="20" fill="${f}" stroke="${e}" stroke-width="2"/><text x="${bx - 132}" y="${y0 + 25}" class="mt">${esc(title)}</text>${ls.map((l, j) => `<text x="${bx - 132}" y="${y0 + 47 + j * 19}" class="mi">${esc(l)}</text>`).join('')}`
    }
    const B = [['Every wake, it', a.each, 160, 125], ['It reads', a.reads, 600, 125], ['It writes', a.writes, 160, 360], ['It tells you', [a.tells], 600, 360]]
    const name = wrap(a.name, 12)
    return `<svg class="sc-svg" viewBox="0 0 760 480" role="img" aria-label="Mind map of the ${esc(a.name)} agent: every wake it ${esc(a.each.join('; '))}. It reads ${esc(a.reads.join('; '))}. It writes ${esc(a.writes.join('; '))}. It tells you: ${esc(a.tells)}.">${B.map((b, k) => box(...b, k)).join('')}<circle cx="${cx}" cy="${cy}" r="62" fill="#fff" stroke="${e}" stroke-width="4"/>${name.map((l, j) => `<text x="${cx}" y="${cy + 6 - (name.length - 1) * 11 + j * 22}" text-anchor="middle" class="mc">${esc(l)}</text>`).join('')}</svg>`
}

export function build(ROOT) {
    const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/indi/schedules/schedules.json'), 'utf8'))
    const S = [...D.scheduled].sort((p, q) => mins(p.times[0]) - mins(q.times[0])), run = S.filter(a => a.status === 'running')
    const wakes = run.reduce((n, a) => n + a.times.length, 0)
    const tiles = [[run.length, 'agents on a timetable', 'lav'], [wakes, 'wake-ups every day', 'mint'], [D.oncall.length, 'agents that work when asked', 'peach'], [S.length - run.length, 'timetable planned, not started', 'butter']]
    const card = a => `<section class="ag ${a.colour}" id="${esc(a.id)}">
<header><span class="dot"></span><h3>${esc(a.name)}</h3><span class="st ${a.status}">${a.status === 'running' ? 'Running' : 'Planned, not started'}</span></header>
<p class="what">${esc(a.what)}</p>
<p class="when"><b>Wakes at</b> ${a.times.map(t => `<span class="time">${t}</span>`).join(' ')} <span class="muted">every day, UTC</span></p>
<div class="scroll">${stripSvg(a)}</div>
<div class="scroll">${mindSvg(a)}</div>
<p class="chat">Its chat: <b>${esc(a.chat)}</b></p>
</section>`
    const body = `<div class="sc">
<div class="ux">${nav('../', 'schedules')}</div>
<p class="lead">Your agents, and when each one wakes up on its own. One colour per agent. Times are UTC, the same as Lisbon and London in November.</p>
<div class="tiles">${tiles.map(([n, l, c]) => `<div class="tile ${c}"><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div>
<section><h2><span class="pill lav">1</span> A day at a glance</h2>
<div class="frame">${daySvg(S)}</div>
<p class="muted hint">On a phone, slide the pictures sideways to see all of them.</p>
<p class="muted">* Planned: the timetable is set in your kit, but the agent has not been started yet.</p></section>
<section><h2><span class="pill mint">2</span> Each agent on a timetable</h2>
<div class="cards">${S.map(card).join('')}</div></section>
<section><h2><span class="pill peach">3</span> Agents that work when you ask</h2>
<p class="muted">No timetable: open their chat and give them a job.</p>
<div class="oc">${D.oncall.map(o => `<div class="o ${o.colour}"><span class="ic">${esc(o.name[0])}</span><b>${esc(o.name)}</b><span>${esc(o.what)}</span><span class="c">${esc(o.chat)}</span></div>`).join('')}</div></section>
<p class="meta">Built by <code>people/indi/schedules/schedules.mjs</code> from <code>people/indi/schedules/schedules.json</code>. ${esc(D.about)}</p>
</div>`
    const md = `${D.about}\n\n## A day at a glance\n\n${S.map(a => `- **${a.name}**${a.status === 'planned' ? ' (planned, not started)' : ''}: ${a.times.join(', ')} UTC`).join('\n')}\n\n## Each agent on a timetable\n\n${S.map(a => `### ${a.name}\n\n${a.what}\n\n- **Wakes at:** ${a.times.join(', ')} UTC (cron \`${a.cron}\`)${a.status === 'planned' ? ', planned, not started' : ''}\n- **Every wake, it:** ${a.each.join('; ')}\n- **It reads:** ${a.reads.join('; ')}\n- **It writes:** ${a.writes.join('; ')}\n- **It tells you:** ${a.tells}\n- **Its chat:** ${a.chat}`).join('\n\n')}\n\n## Agents that work when you ask\n\n${D.oncall.map(o => `- **${o.name}:** ${o.what} (chat: ${o.chat})`).join('\n')}\n`
    return [{ rel: 'people/indi/schedules/index.html', title: "Indi's agents: who wakes when", description: `Indi's agents as one picture: ${run.length} on a timetable with ${wakes} wake-ups a day, one planned, and ${D.oncall.length} that work when asked. A timeline and a mind map for each.`, body, md, head: HEAD }]
}
