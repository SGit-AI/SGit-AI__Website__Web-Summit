// Jose's command centre, the Mission view: the rules, as pure functions. The reference for people/jose/design/mission/BRIEF.md
// (where the two differ, the brief says what is meant). Not loaded by the site; dev@web-summit.jose may copy or import it.
// A classic script with no imports, so it runs unchanged in a browser (window.JoseCC) and in node (require).
// Everything here is worked out against `now`, in the browser, from data.json: nothing is judged at build time.
// Times are UTC throughout (Lisbon is on UTC in November). By designer@web-summit.jose, 3 November 2026.
(function (root) {
    'use strict'
    const MIN = 6e4, H = 36e5, DAY = 864e5
    const DEFAULTS = { grace_minutes: 40, early_minutes: 10, stale_after_hours: 3, ticks: 8, feed_today: 8, meeting_current_minutes: 30 }
    const ME = /\bjose\b|@web-summit\.jose\b/i
    const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }

    // ---------- due dates on the board (front matter `due:`) ----------
    // "Wed 4 Nov" -> 23:59 that day; "Tue 3 Nov, 13:00" -> 13:00; "Tue 3 to Wed 4 Nov" -> the last date;
    // "daily from Tue 3 Nov", "from Wed 4 Nov", "first note Tue 3 Nov, then daily" -> recurring (never overdue);
    // "later", "" -> no date. "Mon 2 Nov, now" -> 23:59 on 2 Nov.
    function parseDue(s, year) {
        s = String(s || '').trim(); year = year || 2026
        if (!s || /^later\b/i.test(s)) return { at: null, kind: 'none' }
        if (/\bdaily\b|\bevery\b|^from\b/i.test(s)) return { at: null, kind: 'recurring' }
        const all = [...s.matchAll(/(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b(?:,\s*(\d{1,2}):(\d{2}))?/g)]
        if (!all.length) return { at: null, kind: 'none' }
        const m = all[all.length - 1]
        return { at: Date.UTC(year, MONTHS[m[2]], +m[1], m[3] ? +m[3] : 23, m[4] ? +m[4] : 59), kind: 'date' }
    }

    // ---------- schedules: the cron in people/jose/agents.json, "cron 20 7,12,17 * * * (UTC)" ----------
    // minute and hour fields: a number, a list, a range (9-17) or a step (*/2); the other three fields must be *.
    function field(f, max) {
        const out = new Set()
        for (const part of String(f).split(',')) {
            let m
            if (part === '*') for (let i = 0; i <= max; i++) out.add(i)
            else if ((m = part.match(/^\*\/(\d+)$/))) for (let i = 0; i <= max; i += +m[1]) out.add(i)
            else if ((m = part.match(/^(\d+)-(\d+)(?:\/(\d+))?$/))) for (let i = +m[1]; i <= +m[2]; i += +(m[3] || 1)) out.add(i)
            else if (/^\d+$/.test(part) && +part <= max) out.add(+part)
            else return null
        }
        return [...out].sort((a, b) => a - b)
    }
    function cronTimes(schedule) {
        const m = String(schedule || '').match(/\bcron\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/)
        if (!m) return null
        if (m[3] !== '*' || m[4] !== '*' || m[5] !== '*') return null
        const mins = field(m[1], 59), hrs = field(m[2], 23)
        if (!mins || !hrs) return null
        const out = []
        for (const h of hrs) for (const mi of mins) out.push(String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0'))
        return out
    }
    // every slot instant in [from, to], from a list of "HH:MM" UTC times
    function slots(times, from, to) {
        const out = [], d0 = Date.UTC(new Date(from).getUTCFullYear(), new Date(from).getUTCMonth(), new Date(from).getUTCDate())
        for (let d = d0; d <= to; d += DAY) for (const t of times) { const [h, mi] = t.split(':').map(Number), x = d + h * H + mi * MIN; if (x >= from && x <= to) out.push(x) }
        return out.sort((a, b) => a - b)
    }

    // ---------- agent health ----------
    // A slot counts once grace_minutes have passed. A run belongs to the slot whose window holds it:
    // [slot - early, next slot - early). Only slots after the agent's first commit count.
    // OK: the newest counted slot ran (or none is due yet). Late: only the newest was missed. Quiet: two or more in a row.
    // On demand (no schedule): never judged; its commits are shown as dots.
    function health(agent, now, builtAt, o) {
        o = Object.assign({}, DEFAULTS, o || {})
        const runs = (agent.runs || []).map(Date.parse).filter(Number.isFinite).sort((a, b) => a - b)
        const last = runs.length ? runs[runs.length - 1] : null
        const stale = builtAt != null && now - builtAt > o.stale_after_hours * H
        if (!agent.schedule_utc || !agent.schedule_utc.length) {
            return { state: 'on-demand', last, next: null, ticks: [], dots: runs.slice(-o.ticks), missed: [], why: 'runs when asked; not judged', stale }
        }
        const first = runs.length ? runs[0] : now
        const early = o.early_minutes * MIN, grace = o.grace_minutes * MIN
        const all = slots(agent.schedule_utc, first, now + 2 * DAY)
        const counted = all.filter(s => s > first && s + grace <= now)
        const ran = counted.map((s, i) => {
            const next = all[all.indexOf(s) + 1], end = next != null ? next - early : Infinity
            return runs.some(r => r >= s - early && r < end)
        })
        let k = 0
        for (let i = ran.length - 1; i >= 0 && !ran[i]; i--) k++
        const state = k === 0 ? 'ok' : k === 1 ? 'late' : 'quiet'
        const missed = counted.slice(counted.length - k)
        const next = all.find(s => s > now) || null
        const ticks = counted.slice(-o.ticks).map((s, i, arr) => ({ at: s, ran: ran[counted.length - arr.length + i] }))
        const hhmm = t => new Date(t).toISOString().slice(11, 16)
        const why = !counted.length ? 'first scheduled run due ' + (next ? hhmm(next) : 'later')
            : state === 'ok' ? 'ran for its ' + hhmm(counted[counted.length - 1]) + ' slot'
            : state === 'late' ? 'no commit since its ' + hhmm(missed[0]) + ' run was due'
            : 'missed ' + k + ' runs in a row (' + missed.slice(-3).map(hhmm).join(', ') + ')'
        return { state, last, next, ticks, dots: [], missed, why, stale }
    }

    // ---------- the whole page's state ----------
    // d: data.json (see the spec's data contract). seen: when Jose last looked (ms) or null (first visit).
    function model(d, now, seen, o) {
        o = Object.assign({}, DEFAULTS, (d.config || {}), o || {})
        const builtAt = Date.parse(d.built_at), age = now - builtAt
        const stale = age > o.stale_after_hours * H
        const pickedByMe = i => ME.test(i.picked_by || '')
        const pickedByOther = i => !!(i.picked_by || '').trim() && !pickedByMe(i)
        const own = i => pickedByMe(i) || ((i.for || []).length === 1 && i.for[0] === 'jose')
        const issues = (d.issues || []).map(i => { const p = parseDue(i.due); return Object.assign({}, i, { due_at: p.at, due_kind: p.kind, own: own(i), taken: pickedByOther(i) }) })

        // overdue: any open issue named for Jose whose date has passed (recurring ones never are)
        const rank = i => i.own ? 0 : i.taken ? 2 : 1
        const overdue = issues.filter(i => i.due_kind === 'date' && i.due_at < now)
            .map(i => Object.assign(i, { late_by: now - i.due_at }))
            .sort((a, b) => rank(a) - rank(b) || b.late_by - a.late_by || a.id.localeCompare(b.id, 'en', { numeric: true }))
        const soon = issues.filter(i => i.due_kind === 'date' && i.due_at >= now && i.due_at - now <= DAY).sort((a, b) => a.due_at - b.due_at)
        const soonOwn = soon.filter(i => i.own), soonShared = soon.filter(i => !i.own)

        // stand-up items: the current or next meeting is the first whose start is at most 30 minutes ago
        const meetAt = id => { const m = String(id).match(/^(\d{4})-(\d\d)-(\d\d)-(\d\d)(\d\d)$/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : NaN }
        const items = (d.standup || []).map(x => Object.assign({}, x, { at: meetAt(x.meeting) })).filter(x => Number.isFinite(x.at))
        const nextMeetingAt = Math.min(...items.map(x => x.at).filter(t => t >= now - o.meeting_current_minutes * MIN), Infinity)
        const forMe = x => (x.for || []).includes('jose')
        const decideItems = items.filter(x => x.type === 'decision' && forMe(x)).map(x => Object.assign(x, { past: x.at < now - o.meeting_current_minutes * MIN }))
        const otherItems = items.filter(x => !(x.type === 'decision' && forMe(x)) && x.at === nextMeetingAt)
        const asks = (d.asks || []).filter(a => (a.status || 'open') === 'open').sort((a, b) => String(a.added).localeCompare(String(b.added)))
        const decide = asks.map(a => ({ kind: 'ask', a })).concat(decideItems.sort((a, b) => (a.past - b.past) || a.at - b.at).map(x => ({ kind: 'standup', x })))

        // agents
        const agents = (d.agents || []).map(a => Object.assign({}, a, { h: health(a, now, builtAt, o) }))
        const quiet = agents.filter(a => a.h.state === 'quiet'), late = agents.filter(a => a.h.state === 'late')

        // the next stand-up from the schedule (13:00 and 18:00), not only from meetings that have items
        const st = slots(o.standups_utc || ['13:00', '18:00'], now, now + 2 * DAY).find(s => s > now) || null

        // new since: the last visit, or the last 24 hours on a first visit
        const since = seen != null ? seen : now - DAY
        const feed = (d.feed || []).filter(f => Date.parse(f.at) <= now).map(f => Object.assign({}, f, { isNew: Date.parse(f.at) > since }))
        const newCount = feed.filter(f => f.isNew).length

        // the attention line: the first thing that is true, in this order
        const hh = t => new Date(t).toISOString().slice(11, 16)
        const dur = ms => { const m = Math.round(ms / MIN); return m < 60 ? m + ' min' : m < 48 * 60 ? Math.round(m / 60) + ' h' : Math.round(m / 1440) + ' days' }
        const who = i => i.own ? '' : i.taken ? ' (picked by ' + i.picked_by + ')' : ' (nobody has picked it)'
        let attn
        if (overdue.length) { const i = overdue[0]; attn = { level: 'act', text: i.id + ' is ' + dur(i.late_by) + ' overdue: ' + i.title + who(i) + '.', why: 'the most overdue issue for you' + (i.own ? ' that is yours' : '') } }
        else if (quiet.length) { const a = quiet[0]; attn = { level: 'act', text: a.name + ' is quiet: it ' + a.h.why + '.', why: 'an agent of yours missed two or more runs' } }
        else if (decide.length) { const x = decide[0]; attn = x.kind === 'ask' ? { level: 'act', text: x.a.title + (x.a.by ? ' (asked by ' + x.a.by.replace('@web-summit.jose', '') + ')' : '') + '.', why: 'the oldest decision waiting on you' } : { level: 'act', text: x.x.title + (x.x.past ? ' (from the ' + hh(x.x.at) + ' stand-up, not recorded as decided)' : ' (at the ' + hh(x.x.at) + ' stand-up)') + '.', why: 'a stand-up decision for you' } }
        else if (late.length) { const a = late[0]; attn = { level: 'watch', text: a.name + ' is late: ' + a.h.why + '.', why: 'an agent of yours missed one run' } }
        else if (soonOwn.length) { const i = soonOwn[0]; attn = { level: 'watch', text: i.id + ' is due in ' + dur(i.due_at - now) + ': ' + i.title + '.', why: 'the next issue of yours that is due' } }
        else if (soonShared.length === 1) { const i = soonShared[0]; attn = { level: 'watch', text: i.id + ' is due in ' + dur(i.due_at - now) + ': ' + i.title + who(i) + '.', why: 'the next shared issue that is due' } }
        else if (soonShared.length) { const n = soonShared.filter(i => !i.taken).length; attn = { level: 'watch', text: soonShared.length + ' shared issues are due in the next 24 h' + (n === soonShared.length ? ', and nobody has picked any of them' : n ? ', and nobody has picked ' + n + ' of them' : '') + '.', why: 'shared issues due soon' } }
        else attn = { level: 'ok', text: 'All clear.' + (st ? ' Next stand-up ' + hh(st) + '.' : ''), why: 'nothing overdue, quiet, waiting on you or due in 24 h' }
        const acts = overdue.length + quiet.length + decide.length

        const days = Math.floor((Date.parse(o.opening || (d.summit || {}).opening || '2026-11-09T18:00:00Z') - now) / DAY)
        return { now, builtAt, age, stale, issues, overdue, soonOwn, soonShared, decide, otherItems, agents, quiet, late, nextStandup: st, since, firstVisit: seen == null, feed, newCount, attn, acts, days,
            counts: { overdue: overdue.length, quiet: quiet.length, decide: decide.length } }
    }

    const api = { parseDue, cronTimes, slots, health, model, DEFAULTS }
    if (typeof module !== 'undefined' && module.exports) module.exports = api
    else root.JoseCC = api
})(typeof window !== 'undefined' ? window : this)
