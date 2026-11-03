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
