// Small build-time SVG charts anyone can call (WS-123, item 3; dev@web-summit.dinis, 3 November 2026). Each returns an
// SVG string with no colour in it: every mark carries a class (ch-*) and the look lives in assets/site.css on the
// site's tokens, so designer@web-summit.dinis can restyle every chart in one place (WS-123, item 2) without touching
// this file. No dependencies, no JavaScript in the page; each chart has a title and a text fallback for screen readers.

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const hm = t => new Date(t).toISOString().slice(11, 16)

/**
 * One day of runs, a row per agent: dayTimeline({ day: 'YYYY-MM-DD', now: ms, rows: [{ label, href?, marks: [{ t: ms,
 * state: 'met'|'missed'|'due'|'extra', title }] }] }). Times are UTC across 00:00 to 24:00, with the quiet hours
 * (22:00 to 07:00 UTC, the team's) shaded and a line at now when now falls inside the day.
 */
export function dayTimeline({ day, now, rows, quiet = [[0, 7], [22, 24]], width = 960, label = 'Today, every scheduled run' }) {
    const L = 230, R = 16, T = 26, H = 26, w = width - L - R, h = rows.length * H
    const t0 = Date.parse(day + 'T00:00:00Z'), x = t => L + (t - t0) / 864e5 * w
    const out = [`<svg class="ch ch-tl" viewBox="0 0 ${width} ${T + h + 34}" role="img" aria-labelledby="tl-t tl-d"><title id="tl-t">${esc(label)}, ${esc(day)} (UTC)</title>`]
    const summary = rows.map(r => `${r.label}: ${['met', 'missed', 'due'].map(s => `${r.marks.filter(m => m.state === s).length} ${s}`).join(', ')}`).join('; ')
    out.push(`<desc id="tl-d">${esc(summary)}</desc>`)
    for (const [a, b] of quiet) out.push(`<rect class="ch-quiet" x="${x(t0 + a * 36e5).toFixed(1)}" y="${T}" width="${(w * (b - a) / 24).toFixed(1)}" height="${h}"/>`)
    for (let k = 0; k <= 24; k += 3) { const X = x(t0 + k * 36e5).toFixed(1); out.push(`<line class="ch-grid" x1="${X}" x2="${X}" y1="${T}" y2="${T + h}"/><text class="ch-axis" x="${X}" y="${T - 8}" text-anchor="middle">${String(k).padStart(2, '0')}:00</text>`) }
    rows.forEach((r, i) => {
        const y = T + i * H + H / 2
        out.push(`<line class="ch-row" x1="${L}" x2="${L + w}" y1="${y}" y2="${y}"/>`)
        const name = `<text class="ch-label" x="${L - 10}" y="${y + 4}" text-anchor="end">${esc(r.label)}</text>`
        out.push(r.href ? `<a href="${esc(r.href)}">${name}</a>` : name)
        for (const m of r.marks) {
            const X = x(m.t).toFixed(1), tip = `<title>${esc(m.title || `${hm(m.t)} ${m.state}`)}</title>`
            if (m.state === 'missed') out.push(`<g class="ch-missed">${tip}<circle cx="${X}" cy="${y}" r="6"/><path d="M${+X - 3} ${y - 3}l6 6M${+X + 3} ${y - 3}l-6 6"/></g>`)
            else out.push(`<circle class="ch-${m.state}" cx="${X}" cy="${y}" r="${m.state === 'extra' ? 3.5 : 6}">${tip}</circle>`)
        }
    })
    if (now >= t0 && now < t0 + 864e5) { const X = x(now).toFixed(1); out.push(`<line class="ch-now" x1="${X}" x2="${X}" y1="${T - 4}" y2="${T + h}"/><text class="ch-nowl" x="${X}" y="${T + h + 16}" text-anchor="middle">now ${hm(now)}</text>`) }
    const lx = L, ly = T + h + 30, key = [['met', 'ran (a commit within the hour)'], ['missed', 'slot passed, nothing'], ['due', 'still to come'], ['extra', 'a wake outside its slots']]
    let X = lx
    key.forEach(([s, t]) => { out.push(s === 'missed' ? `<g class="ch-missed"><circle cx="${X}" cy="${ly - 4}" r="5"/><path d="M${X - 2.5} ${ly - 6.5}l5 5M${X + 2.5} ${ly - 6.5}l-5 5"/></g>` : `<circle class="ch-${s}" cx="${X}" cy="${ly - 4}" r="${s === 'extra' ? 3.5 : 5}"/>`, `<text class="ch-key" x="${X + 10}" y="${ly}">${t}</text>`); X += 34 + t.length * 6.4 })
    out.push('</svg>')
    return out.join('')
}

/**
 * The board, burning down to a date: burndown({ series: [{ day: 'YYYY-MM-DD', open, opened, closed }], target:
 * 'YYYY-MM-DD', label }). A line of the issues still open at the end of each day, bars of the issues closed that day,
 * and a dashed line from today's open count to none on the target day: the pace the board needs.
 */
export function burndown({ series, target, width = 960, height = 300, label = 'The board, burning down' }) {
    if (!series.length) return ''
    const L = 48, R = 20, T = 20, B = 44, w = width - L - R, h = height - T - B
    const days = [...series.map(s => s.day)], last = series[series.length - 1]
    for (let d = Date.parse(last.day + 'T12:00:00Z') + 864e5; d <= Date.parse(target + 'T12:00:00Z'); d += 864e5) days.push(new Date(d).toISOString().slice(0, 10))
    const n = days.length, max = Math.max(1, ...series.map(s => s.open), ...series.map(s => s.closed)), top = Math.ceil(max / 10) * 10
    const x = k => L + (n === 1 ? w / 2 : k * w / (n - 1)), y = v => T + h - v / top * h, bw = Math.max(4, Math.min(22, w / n * 0.5))
    const out = [`<svg class="ch ch-bd" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="bd-t bd-d"><title id="bd-t">${esc(label)}, to ${esc(target)}</title>`,
        `<desc id="bd-d">${esc(`${last.open} open on ${last.day}; ${series.reduce((a, s) => a + s.closed, 0)} closed since ${series[0].day}; ${n - series.length} days to ${target}.`)}</desc>`]
    for (let v = 0; v <= top; v += top / 5) out.push(`<line class="ch-grid" x1="${L}" x2="${L + w}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="ch-axis" x="${L - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${v}</text>`)
    days.forEach((d, k) => out.push(`<text class="ch-axis" x="${x(k).toFixed(1)}" y="${T + h + 18}" text-anchor="middle">${d.slice(8)}</text>`))
    series.forEach((s, k) => { if (s.closed) out.push(`<rect class="ch-done" x="${(x(k) - bw / 2).toFixed(1)}" y="${y(s.closed).toFixed(1)}" width="${bw.toFixed(1)}" height="${(T + h - y(s.closed)).toFixed(1)}"><title>${s.day}: ${s.closed} closed, ${s.opened} opened</title></rect>`) })
    out.push(`<polyline class="ch-open" points="${series.map((s, k) => `${x(k).toFixed(1)},${y(s.open).toFixed(1)}`).join(' ')}"/>`)
    series.forEach((s, k) => out.push(`<circle class="ch-open-pt" cx="${x(k).toFixed(1)}" cy="${y(s.open).toFixed(1)}" r="3.5"><title>${s.day}: ${s.open} open</title></circle>`))
    out.push(`<line class="ch-pace" x1="${x(series.length - 1).toFixed(1)}" y1="${y(last.open).toFixed(1)}" x2="${x(n - 1).toFixed(1)}" y2="${y(0).toFixed(1)}"/>`)
    out.push(`<text class="ch-key" x="${(x(series.length - 1) + 12).toFixed(1)}" y="${(y(last.open) - 10).toFixed(1)}">${esc(target.slice(8))} Nov: none open needs ${Math.ceil(last.open / Math.max(1, n - series.length))} a day</text>`)
    out.push(`<text class="ch-axis" x="${L}" y="${height - 6}">day of the month (UTC)</text></svg>`)
    return out.join('')
}

/**
 * One person's agents, as a picture: agentsMap({ person: { id, name }, agents: [{ name, commits, last, job }],
 * talks: [{ from, to, n }] }). The person in the middle; their agents around them, each sized by its commits (hollow
 * when it has not run yet); on the outside, whoever those agents wrote to ("For:" in their commits), a line each,
 * thicker for more messages. Agents of other people and people are told apart by shape, as on the cast: square, round.
 */
export function agentsMap({ person, agents, talks, width = 900, height = 600 }) {
    const C = { x: width / 2, y: height / 2 }, R1 = 140, R2 = 280, short = n => n.replace(/@web-summit\./, '@')
    const out = [`<svg class="ch ch-map" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="map-t-${person.id} map-d-${person.id}"><title id="map-t-${person.id}">${esc(person.name)}'s agents, and who they write to</title>`]
    const mine = [...agents].sort((a, b) => b.commits - a.commits), pos = {}
    mine.forEach((a, k) => { const ang = -Math.PI / 2 + 2 * Math.PI * k / Math.max(1, mine.length); pos[a.name] = { x: C.x + R1 * Math.cos(ang), y: C.y + R1 * Math.sin(ang), ang } })
    pos[person.id] = { x: C.x, y: C.y, ang: 0, self: true }   // an agent writing to its own person draws in to the middle
    const outs = [...new Set(talks.filter(t => pos[t.from] && !pos[t.to]).map(t => t.to))]
    const weight = to => talks.filter(t => t.to === to).reduce((s, t) => s + t.n, 0)
    outs.sort((a, b) => weight(b) - weight(a)).splice(10)
    outs.forEach((to, k) => { const ang = -Math.PI / 2 + Math.PI / Math.max(1, outs.length) + 2 * Math.PI * k / Math.max(1, outs.length); pos[to] = { x: C.x + R2 * Math.cos(ang), y: C.y + R2 * Math.sin(ang), ang, other: true } })
    out.push(`<desc id="map-d-${person.id}">${esc(`${mine.length} agents (${mine.filter(a => a.commits).length} running); they wrote to ${outs.length ? outs.map(short).join(', ') : 'nobody outside yet'}.`)}</desc>`)
    for (const t of talks) { const a = pos[t.from], b = pos[t.to]; if (!a || !b || a === b) continue; if (b.self) { out.push(`<line class="ch-talk" style="stroke-width:${Math.min(6, 0.8 + Math.sqrt(t.n)).toFixed(1)}" x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${C.x}" y2="${C.y}"><title>${esc(`${short(t.from)} wrote to ${person.name.split(' ')[0]} ${t.n} time${t.n > 1 ? 's' : ''}`)}</title></line>`); continue } out.push(`<path class="ch-talk" style="stroke-width:${Math.min(6, 0.8 + Math.sqrt(t.n)).toFixed(1)}" d="M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${C.x},${C.y} ${b.x.toFixed(1)},${b.y.toFixed(1)}"><title>${esc(`${short(t.from)} wrote to ${short(t.to)} ${t.n} time${t.n > 1 ? 's' : ''}`)}</title></path>`) }
    for (const a of mine) { const q = pos[a.name]; out.push(`<line class="ch-own" x1="${C.x}" y1="${C.y}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}"/>`) }
    out.push(`<circle class="ch-person" cx="${C.x}" cy="${C.y}" r="38"/><text class="ch-label ch-mid" x="${C.x}" y="${C.y + 5}" text-anchor="middle">${esc(person.name.split(' ')[0])}</text>`)
    const lab = (q, r, text, cls = 'ch-label') => { const l = Math.cos(q.ang) < -0.15, rr = Math.cos(q.ang) > 0.15; return `<text class="${cls}" x="${(q.x + (l ? -r - 6 : rr ? r + 6 : 0)).toFixed(1)}" y="${(q.y + (l || rr ? 4 : Math.sin(q.ang) < 0 ? -r - 7 : r + 15)).toFixed(1)}" text-anchor="${l ? 'end' : rr ? 'start' : 'middle'}">${esc(text)}</text>` }
    for (const a of mine) {
        const q = pos[a.name], r = a.commits ? 7 + Math.min(16, Math.sqrt(a.commits) * 2.2) : 7
        out.push(`<g><title>${esc(`${a.name}: ${a.commits ? `${a.commits} commits, last ${a.last} UTC` : 'not running yet'}${a.job ? ` · ${a.job}` : ''}`)}</title><rect class="${a.commits ? 'ch-agent' : 'ch-agent idle'}" x="${(q.x - r).toFixed(1)}" y="${(q.y - r).toFixed(1)}" width="${(2 * r).toFixed(1)}" height="${(2 * r).toFixed(1)}" rx="${(r * 0.3).toFixed(1)}"/>${lab(q, r, a.name.split('@')[0])}</g>`)
    }
    for (const to of outs) { const q = pos[to], human = !/@/.test(to); out.push(`<g><title>${esc(to)}: ${weight(to)} messages</title>${human ? `<circle class="ch-other" cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="8"/>` : `<rect class="ch-other" x="${(q.x - 7).toFixed(1)}" y="${(q.y - 7).toFixed(1)}" width="14" height="14" rx="3"/>`}${lab(q, 8, short(to), 'ch-key')}</g>`) }
    out.push('</svg>')
    return out.join('')
}
