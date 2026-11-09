// The agenda to the summit (WS-143, item 1; dev@web-summit.dinis, 4 November 2026): every dated thing the repository
// knows, from yesterday to the last day of Web Summit, a day at a time, built at every release so it grows and moves as
// the days go by. Pure: data in, data out; the build writes it as /agenda.json and draws it where a page asks
// (```chart agenda```), as a plain list with classes only, so the designer's layout can place and style it.
// Sources: the stand-ups (admin/tools/agenda.mjs slots, data/meetings/), the board's due dates, the plan's dated
// phases (data/plan.json), the summit (data/events.json: badge pickup, opening night, the conference days, the
// sessions that matter, side events). What the data does not have (who of us is where) is listed as missing.

const DAY = 864e5
const MONTHS = { Oct: 9, Nov: 10 }
const WD = /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w* (\d{1,2})(?: (Oct|Nov))?(?:,? (\d{1,2}):(\d{2}))?/
const iso = d => new Date(d).toISOString().slice(0, 10)
import { esc } from './text.mjs'

// "Wed 4 Nov", "Tue 3 Nov, 16:00", "Thu 12" (November 2026 unless it says October); a range or "daily" is not one day
export function parseDue(s, year = 2026) {
    const t = String(s || '')
    if (!t || /^(daily|later|from\b)/i.test(t.trim())) return null
    const m = t.match(WD); if (!m) return null
    const month = MONTHS[m[3] || 'Nov'], at = Date.UTC(year, month, +m[2], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0)
    return { day: iso(at), time: m[4] ? `${m[4].padStart(2, '0')}:${m[5]}` : '', at }
}

// hasPage(slot): whether the build makes that stand-up's own page (meetings.mjs: the next two days, or any with items)
export function buildAgenda({ now, slots, agendaOf, hasPage = () => true, issues, plan, events, from, to = '2026-11-12' }) {
    const start = from || iso(now - DAY), days = new Map()
    for (let d = Date.parse(start + 'T00:00:00Z'); d <= Date.parse(to + 'T00:00:00Z'); d += DAY) days.set(iso(d), [])
    const add = (day, it) => { if (days.has(day)) days.get(day).push(it) }

    // the stand-ups, with what is open on each
    for (const s of slots) {
        const a = agendaOf(s.id), open = a.filter(x => x.status === 'open')
        add(s.day, { kind: 'standup', time: s.time, at: Date.parse(s.at), title: `Stand-up, ${s.time} UTC`, detail: `${open.filter(x => x.type === 'decision').length} decisions and ${open.length - open.filter(x => x.type === 'decision').length} other items open`, href: hasPage(s) ? `meetings/${s.id}/index.html` : 'meetings/index.html' })
    }
    // the board: what is due each day and not done, one entry per day with the issues in it
    const due = new Map()
    for (const i of issues.filter(i => i.status !== 'done')) { const d = parseDue(i.due); if (d && days.has(d.day)) { if (!due.has(d.day)) due.set(d.day, []); due.get(d.day).push({ ...i, time: d.time }) } }
    for (const [day, list] of due) add(day, { kind: 'deadline', time: '', at: Date.parse(day + 'T23:59:00Z'), title: `${list.length} issue${list.length > 1 ? 's' : ''} due`, issues: list.sort((a, b) => (a.time || '99').localeCompare(b.time || '99')).map(i => ({ id: i.id, title: i.title, time: i.time, status: i.status })), href: 'briefs/index.html#issues' })
    // the plan's dated lines (data/plan.json phases): "Thu 12: our day on the stand"
    for (const p of plan.phases || []) { const d = parseDue(p.when); if (d) add(d.day, { kind: 'plan', time: d.time, at: d.at, title: String(p.what).replace(/\*\*/g, '').replace(/\s*\([^)]*brief[^)]*\)/g, '').slice(0, 140), href: 'plan/index.html#schedule' }) }
    // the summit, from its own published facts
    const S = events.summit || {}, src = k => (S[k] && S[k].source) || ''
    if (S.badge_pickup) add('2026-11-07', { kind: 'summit', time: '09:30', at: Date.parse('2026-11-07T09:30:00Z'), title: 'Badge pickup opens (airport T1 and Pavilhão de Portugal)', href: 'summit/index.html#facts', source: src('badge_pickup') })
    if (S.opening_night) { add('2026-11-09', { kind: 'summit', time: '18:00', at: Date.parse('2026-11-09T18:00:00Z'), title: 'Opening Night, Centre Stage', href: 'summit/index.html#facts', source: src('opening_night') }); add('2026-11-09', { kind: 'summit', time: '20:00', at: Date.parse('2026-11-09T20:00:00Z'), title: 'Night Summit, Pavilion 5 (to 23:00)', href: 'summit/index.html#facts', source: src('opening_night') }) }
    if (S.conference_days) for (const d of ['2026-11-10', '2026-11-11', '2026-11-12']) add(d, { kind: 'summit', time: '10:00', at: Date.parse(d + 'T10:00:00Z'), title: 'Web Summit, conference day (about 10:00 to 17:40)', href: 'summit/index.html#facts', source: src('conference_days') })
    const byDay = {}; for (const s of events.sessions || []) if (s.day) (byDay[s.day] ??= []).push(s)
    for (const [d, list] of Object.entries(byDay)) add(d, { kind: 'sessions', time: '', at: Date.parse(d + 'T10:01:00Z'), title: `${list.length} sessions that matter to us`, href: `summit/index.html#day-${d}` })
    for (const e of events.side_events || []) { const m = String(e.date || '').match(/^(\d{4}-\d{2}-\d{2})(?:,? (\d{2}:\d{2}))?/); if (m && !/\(past\)/.test(e.title)) add(m[1], { kind: 'side', time: m[2] || '', at: Date.parse(`${m[1]}T${m[2] || '12:00'}:00Z`), title: e.title, detail: e.place || '', href: 'summit/index.html#side-events', source: e.source || '' }) }

    const today = iso(now), out = []
    for (const [day, items] of days) {
        items.sort((a, b) => a.at - b.at)
        out.push({ day, label: new Date(day + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }), past: day < today, today: day === today, days_to_go: Math.round((Date.parse(day) - Date.parse(today)) / DAY), items })
    }
    const next = out.flatMap(d => d.items.map(i => ({ ...i, day: d.day }))).filter(i => i.at > now && i.kind !== 'deadline').sort((a, b) => a.at - b.at)[0] || null
    if (next) for (const d of out) for (const i of d.items) if (d.day === next.day && i.at === next.at && i.title === next.title) i.next = true
    return { built_at: new Date(now).toISOString(), from: start, to, today, next: next && { day: next.day, time: next.time, title: next.title, href: next.href }, days: out, missing: ['who of us is where, and when (travel, the stand rota): not in the data yet'] }
}

// the agenda as HTML: a list a layout can style (classes ag-*), no colour, no script; past days fold (a <details>)
export function agendaHtml(A, up = '') {
    const item = i => `<li class="ag-item ag-${esc(i.kind)}${i.next ? ' ag-next' : ''}">${i.time ? `<span class="ag-time">${esc(i.time)}</span>` : '<span class="ag-time"></span>'}<a href="${esc(up + i.href)}">${esc(i.title)}</a>${i.next ? ' <b class="ag-flag">next</b>' : ''}${i.detail ? `<span class="ag-detail">${esc(i.detail)}</span>` : ''}${i.issues ? `<ul class="ag-issues">${i.issues.slice(0, 8).map(x => `<li><b>${esc(x.id)}</b> ${esc(x.title)}${x.time ? ` <span class="ag-time">${esc(x.time)}</span>` : ''}</li>`).join('')}${i.issues.length > 8 ? `<li>and ${i.issues.length - 8} more</li>` : ''}</ul>` : ''}</li>`
    const day = d => { const head = `<span class="ag-day">${esc(d.label)}</span>${d.today ? ' <b class="ag-flag">today</b>' : !d.past ? ` <span class="ag-togo">in ${d.days_to_go} day${d.days_to_go > 1 ? 's' : ''}</span>` : ''}`, list = d.items.length ? `<ul>${d.items.map(item).join('')}</ul>` : '<p class="ag-none">Nothing dated yet.</p>'
        return d.past ? `<details class="ag-d ag-past"><summary>${head}</summary>${list}</details>` : `<section class="ag-d${d.today ? ' ag-today' : ''}"><h3>${head}</h3>${list}</section>` }
    return `<div class="ag" data-built="${esc(A.built_at)}">${A.days.map(day).join('')}<p class="ag-missing">${A.missing.map(esc).join(' · ')}</p></div>`
}
export function agendaText(A) {
    return A.days.filter(d => !d.past).map(d => `- **${d.label}${d.today ? ' (today)' : ''}:** ${d.items.length ? d.items.map(i => `${i.time ? i.time + ' ' : ''}${i.title}${i.next ? ' (next)' : ''}`).join('; ') : 'nothing dated yet'}`).join('\n')
}
