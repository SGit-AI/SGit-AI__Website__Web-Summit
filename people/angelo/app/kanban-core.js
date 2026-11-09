// The kanban's rules for Angelo's command centre (dev@web-summit.angelo, 4 November 2026; brief: BRIEF.md beside this
// file, section 1). Pure functions, no page and no network: the same file runs in the browser (window.AngeloKanban)
// and at build time (people/angelo/app/data.mjs runs selfTest(), so a broken rule fails the build, not the phone).
(function (root, make) {
    const m = make()
    if (typeof module === 'object' && module.exports) module.exports = m
    else root.AngeloKanban = m
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'

    const STATUS_ORDER = ['open', 'picked', 'in progress', 'done']
    const DUE_ORDER = ['overdue', 'today', 'week', 'later', 'recurring', 'none', 'past']
    const DUE_LABEL = { overdue: 'Overdue', today: 'Due today', week: 'This week', later: 'Later', recurring: 'Recurring', none: 'No date', past: 'Was due (done)' }
    const FIELDS = { status: 'Status', due: 'Due', picked: 'Picked by', stream: 'Workstream' }
    const SORTS = { id: 'Id', title: 'Title', status: 'Status', due: 'Due', picked: 'Picked by', stream: 'Workstream', area: 'Area', changed: 'Last changed' }
    const OPEN_STATUSES = ['open', 'picked', 'in progress']

    // ---------- the view, in the address after # (a view is a link; nothing reaches a server) ----------
    const DEFAULTS = { fm: true, mine: true, now: false, col: 'status', lane: '', sort: 'due', dir: 'asc', pick: [], due: [], ws: [], st: OPEN_STATUSES.slice(), q: '', open: '', tab: '' }
    const KEYS = { fm: 'f', mine: 'm', now: 'n', col: 'c', lane: 'l', sort: 's', dir: 'd', pick: 'p', due: 'u', ws: 'w', st: 't', q: 'q', open: 'o', tab: 'k' }
    const LISTS = ['pick', 'due', 'ws', 'st']

    function parseState(hash) {
        const s = JSON.parse(JSON.stringify(DEFAULTS))
        const i = (hash || '').indexOf('?')
        if (i < 0) return s
        const p = new URLSearchParams(hash.slice(i + 1))
        for (const [k, short] of Object.entries(KEYS)) {
            if (!p.has(short)) continue
            const v = p.get(short)
            if (k === 'mine' || k === 'now' || k === 'fm') s[k] = v === '1'
            else if (LISTS.includes(k)) s[k] = v ? v.split(',').filter(Boolean) : []
            else s[k] = v
        }
        if (!FIELDS[s.col]) s.col = DEFAULTS.col
        if (s.lane && (!FIELDS[s.lane] || s.lane === s.col)) s.lane = ''
        if (!SORTS[s.sort]) s.sort = DEFAULTS.sort
        if (s.dir !== 'asc' && s.dir !== 'desc') s.dir = 'asc'
        return s
    }

    function stateToHash(s, view = 'kanban') {
        const p = []
        for (const [k, short] of Object.entries(KEYS)) {
            const v = s[k], d = DEFAULTS[k]
            const same = LISTS.includes(k) ? (v || []).slice().sort().join(',') === d.slice().sort().join(',') : v === d
            if (same) continue
            p.push(`${short}=${encodeURIComponent(LISTS.includes(k) ? (v || []).join(',') : typeof v === 'boolean' ? (v ? '1' : '0') : v)}`)
        }
        return '#' + view + (p.length ? '?' + p.join('&') : '')
    }

    // ---------- who: picked_by is free text ("Vicky, pm@web-summit.vicky"), read into person ids ----------
    function pickers(issue, ctx) {
        const t = String(issue.picked_by || '').trim()
        if (!t) return []
        const found = new Set()
        // an agent's name, either team (web-summit or PrompTugal, 6 November), its role possibly with a mode (desk.conductor)
        for (const m of t.matchAll(/[a-z0-9][a-z0-9.-]*@(?:web-summit|promptugal)\.([a-z0-9-]+)/gi)) found.add(m[1].toLowerCase())
        const words = t.replace(/[a-z0-9][a-z0-9.-]*@(?:web-summit|promptugal)\.[a-z0-9-]+/gi, ' ').toLowerCase()
        for (const [id, name] of Object.entries(ctx.people || {})) {
            const first = String(name).split(/\s+/)[0].toLowerCase()
            if (new RegExp(`(^|[^a-z])(${first}|${id})([^a-z]|$)`).test(words)) found.add(id)
        }
        return found.size ? [...found] : ['other']
    }

    const owners = issue => (issue.for || []).map(x => String(x).toLowerCase())

    // My tasks: Angelo is the picker (or one of his agents is), or an owner of an issue nobody else picked
    function isMine(issue, ctx) {
        const p = pickers(issue, ctx)
        if (p.includes(ctx.me)) return true
        return owners(issue).includes(ctx.me) && (p.length === 0)
    }

    // ---------- due: Lisbon is on UTC in November, so a day is a UTC day ----------
    function dueBucket(issue, now) {
        if (issue.recurring) return 'recurring'
        if (!issue.due_at) return 'none'
        const t = Date.parse(issue.due_at), n = now.getTime()
        const day = d => new Date(d).toISOString().slice(0, 10)
        if (t < n) return issue.status === 'done' ? 'past' : 'overdue'
        if (day(t) === day(n)) return 'today'
        if (t - n <= 7 * 864e5) return 'week'
        return 'later'
    }

    // Needs me now: my open tasks overdue or due today, and any open issue with a stand-up item waiting on me
    function needsMe(issue, ctx, now) {
        if (issue.status === 'done') return false
        if ((ctx.agenda[issue.id] || []).some(a => a.forMe && a.status === 'open')) return true
        if (!isMine(issue, ctx)) return false
        const b = dueBucket(issue, now)
        return b === 'overdue' || b === 'today'
    }

    // ---------- grouping: one key per card per field ----------
    function groupOf(issue, field, ctx, now) {
        if (field === 'status') return STATUS_ORDER.includes(issue.status) ? issue.status : (issue.status || 'open')
        if (field === 'due') return dueBucket(issue, now)
        if (field === 'picked') return pickers(issue, ctx)[0] || 'nobody'
        if (field === 'stream') return issue.stream || 'none'
        return ''
    }

    function groupLabel(field, key, ctx) {
        if (field === 'status') return key.charAt(0).toUpperCase() + key.slice(1)
        if (field === 'due') return DUE_LABEL[key] || key
        if (field === 'picked') return key === 'nobody' ? 'Nobody yet' : key === 'other' ? 'Someone else' : (ctx.people[key] || key)
        if (field === 'stream') return key === 'none' ? 'No workstream' : ((ctx.streams[key] || {}).name || key)
        return key
    }

    function groupRank(field, key, ctx) {
        if (field === 'status') { const i = STATUS_ORDER.indexOf(key); return i < 0 ? 50 : i }
        if (field === 'due') return DUE_ORDER.indexOf(key)
        if (field === 'picked') return key === ctx.me ? -1 : key === 'nobody' ? 1e3 : key === 'other' ? 999 : 0
        if (field === 'stream') { const ids = Object.keys(ctx.streams); const i = ids.indexOf(key); return key === 'none' ? 1e3 : i < 0 ? 500 : i }
        return 0
    }

    // the columns (or lanes) present in a list of cards, in their natural order
    function groups(issues, field, ctx, now) {
        const seen = new Map()
        for (const i of issues) { const k = groupOf(i, field, ctx, now); if (!seen.has(k)) seen.set(k, { key: k, label: groupLabel(field, k, ctx), items: [] }); seen.get(k).items.push(i) }
        return [...seen.values()].sort((a, b) => groupRank(field, a.key, ctx) - groupRank(field, b.key, ctx) || a.label.localeCompare(b.label))
    }

    // ---------- filters (all combinable) ----------
    function filter(issues, s, ctx, now) {
        const q = (s.q || '').trim().toLowerCase()
        return issues.filter(i => {
            // Needs me now is its own set (my urgent tasks plus stand-up items waiting on me), so My tasks does not narrow it
            if (s.now) { if (!needsMe(i, ctx, now)) return false } else if (s.mine && !isMine(i, ctx)) return false
            if (s.st.length && !s.st.includes(i.status)) return false
            if (s.due.length && !s.due.includes(dueBucket(i, now))) return false
            if (s.ws.length && !s.ws.includes(i.stream || 'none')) return false
            if (s.pick.length) { const p = pickers(i, ctx); if (!s.pick.some(x => x === 'nobody' ? !p.length : p.includes(x))) return false }
            if (q && !`${i.id} ${i.title} ${i.body || ''}`.toLowerCase().includes(q)) return false
            return true
        })
    }

    // ---------- sort within a column ----------
    const num = id => +(String(id).match(/\d+/) || [0])[0]
    function sortKey(i, field, ctx, now) {
        switch (field) {
            case 'id': return num(i.id)
            case 'title': return String(i.title || '').toLowerCase()
            case 'status': return groupRank('status', groupOf(i, 'status', ctx, now), ctx)
            case 'due': return i.recurring ? 8.64e15 - 1 : i.due_at ? Date.parse(i.due_at) : 8.64e15
            case 'picked': return groupLabel('picked', groupOf(i, 'picked', ctx, now), ctx).toLowerCase()
            case 'stream': return groupRank('stream', groupOf(i, 'stream', ctx, now), ctx)
            case 'area': return String(i.area || '~').toLowerCase()
            case 'changed': return ctx.changed[i.id] ? Date.parse(ctx.changed[i.id]) : 0
        }
        return 0
    }
    function sort(issues, field, dir, ctx, now) {
        const f = dir === 'desc' ? -1 : 1
        return issues.slice().sort((a, b) => { const x = sortKey(a, field, ctx, now), y = sortKey(b, field, ctx, now); return (x < y ? -1 : x > y ? 1 : 0) * f || num(a.id) - num(b.id) })
    }

    // ---------- For me: Angelo's tasks in four columns (spec-kanban-tasks.md, approved 7 November, cb97bf39) ----------
    // A task card comes from the build (data.mjs): { id, src: 'backlog'|'open'|'issue'|'delivery', col, title, agent, brief,
    // waits, rec, chip, rank, at }. The rules below only place, order and compare them; nothing is fetched or sent.
    const TASK_COLS = [['need', 'Needs you'], ['progress', 'In progress'], ['delivered', 'Delivered, to check'], ['done', 'Done']]
    const DONE_DAYS = 7
    // hidden: { cardId: untilMs } (Later, kept in this browser); a card hidden until a time past is shown again
    function taskColumns(cards, now, hidden = {}) {
        const t = now.getTime(), by = Object.fromEntries(TASK_COLS.map(([k]) => [k, []]))
        for (const c of cards || []) {
            const col = by[c.col] ? c.col : 'progress'
            if (col === 'done' && c.at && t - Date.parse(c.at) > DONE_DAYS * 864e5) continue
            if (col === 'need' && hidden[c.id] && hidden[c.id] > t) continue
            by[col].push(c)
        }
        const at = c => c.at ? Date.parse(c.at) : 0
        by.need.sort((a, b) => (b.rank || 0) - (a.rank || 0) || at(b) - at(a) || String(a.id).localeCompare(String(b.id)))
        for (const k of ['progress', 'delivered', 'done']) by[k].sort((a, b) => at(b) - at(a) || String(a.id).localeCompare(String(b.id)))
        return TASK_COLS.map(([key, label]) => ({ key, label, items: by[key] }))
    }
    // what changed since he last looked: cards that appeared or moved after that time (none on a first visit)
    function changedSince(cards, since) {
        const t = since ? Date.parse(since) : NaN
        if (!isFinite(t)) return []
        return (cards || []).filter(c => c.at && Date.parse(c.at) > t).map(c => c.id)
    }
    // the copied line for the desk (B, the fallback): one line, the card's id first, so the desk can find it
    function copyLine(card, action, text) {
        const what = String(card.title || '').replace(/\s+/g, ' ').slice(0, 80)
        const line = String(text || '').replace(/\s+/g, ' ').trim()
        return action === 'changes' ? `Needs changes: ${card.id} (${what}): ${line || '(say what)'}` : `Seen: ${card.id} (${what})`
    }

    // ---------- the self-test the build runs ----------
    function selfTest() {
        const now = new Date('2026-11-04T12:00:00Z')
        const ctx = { me: 'angelo', people: { angelo: 'Angelo', jose: 'Jose Bota', vicky: 'Vicky' }, streams: { machine: { name: 'The machine' } }, agenda: { 'WS-4': [{ forMe: true, status: 'open' }] }, changed: { 'WS-1': '2026-11-04T10:00:00Z', 'WS-2': '2026-11-03T10:00:00Z' } }
        const I = [
            { id: 'WS-1', title: 'b', for: ['angelo'], picked_by: '', status: 'open', due_at: '2026-11-03T23:59:00Z', stream: 'machine' },
            { id: 'WS-2', title: 'a', for: ['angelo', 'jose'], picked_by: 'Jose, dev@web-summit.jose', status: 'picked', due_at: '2026-11-04T23:59:00Z' },
            { id: 'WS-3', title: 'c', for: ['vicky'], picked_by: 'Angelo, conductor@web-summit.angelo', status: 'in progress', due_at: null },
            { id: 'WS-4', title: 'd', for: ['everyone'], picked_by: '', status: 'open', due_at: '2026-11-20T23:59:00Z' },
            { id: 'WS-5', title: 'e', for: ['angelo'], picked_by: 'dev@web-summit.angelo', status: 'done', due_at: '2026-11-01T23:59:00Z' },
        ]
        const ok = (c, m) => { if (!c) throw new Error('kanban self-test: ' + m) }
        ok(pickers(I[1], ctx).join() === 'jose', 'picked_by reads the person behind an agent')
        ok(pickers(I[2], ctx).join() === 'angelo', 'his agents count as him')
        ok(pickers({ picked_by: 'desk.conductor@PrompTugal.angelo' }, ctx).join() === 'angelo', 'a PrompTugal name with a mode counts as its person')
        ok(isMine(I[0], ctx) && !isMine(I[1], ctx) && isMine(I[2], ctx) && !isMine(I[3], ctx) && isMine(I[4], ctx), 'My tasks')
        ok(dueBucket(I[0], now) === 'overdue' && dueBucket(I[1], now) === 'today' && dueBucket(I[2], now) === 'none' && dueBucket(I[3], now) === 'later' && dueBucket(I[4], now) === 'past', 'due buckets (done is never overdue)')
        ok(needsMe(I[0], ctx, now) && !needsMe(I[1], ctx, now) && !needsMe(I[2], ctx, now) && needsMe(I[3], ctx, now) && !needsMe(I[4], ctx, now), 'Needs me now')
        const d = parseState('#kanban')
        ok(filter(I, d, ctx, now).map(i => i.id).join() === 'WS-1,WS-3', 'the default view: my open tasks')
        ok(filter(I, { ...d, now: true }, ctx, now).map(i => i.id).join() === 'WS-1,WS-4', 'Needs me now is not narrowed by My tasks')
        ok(filter(I, { ...d, mine: false, st: [], q: 'D' }, ctx, now).map(i => i.id).join() === 'WS-4', 'keyword search')
        ok(filter(I, { ...d, mine: false, st: [], pick: ['nobody'] }, ctx, now).map(i => i.id).join() === 'WS-1,WS-4', 'picked-by: nobody')
        ok(sort(I, 'changed', 'desc', ctx, now)[0].id === 'WS-1' && sort(I, 'title', 'asc', ctx, now)[0].id === 'WS-2', 'sort')
        ok(groups(I, 'due', ctx, now).map(g => g.key).join() === 'overdue,today,later,none,past', 'columns in their natural order')
        const s = parseState('#kanban?m=0&c=due&l=stream&s=id&d=desc&t=done&q=key')
        ok(!s.mine && s.col === 'due' && s.lane === 'stream' && s.sort === 'id' && s.dir === 'desc' && s.st.join() === 'done' && s.q === 'key', 'the address is read back')
        ok(stateToHash(parseState(stateToHash(s))) === stateToHash(s) && stateToHash(d) === '#kanban', 'the address round-trips')
        ok(parseState('#kanban?c=nope&l=nope&s=nope&d=up').col === 'status', 'a bad address falls back to the defaults')
        // For me
        ok(parseState('#kanban').fm === true && parseState('#kanban?f=0').fm === false && stateToHash(parseState('#kanban?f=0')) === '#kanban?f=0', 'For me is the default, and f=0 the old layouts')
        const T = [
            { id: 'A-1', col: 'need', rank: 1, at: '2026-11-04T10:00:00Z' }, { id: 'A-2', col: 'need', rank: 5, at: '2026-11-03T10:00:00Z' },
            { id: 'b-1', col: 'progress', at: '2026-11-04T09:00:00Z' }, { id: 'd-1', col: 'delivered', at: '2026-11-04T11:00:00Z' },
            { id: 'd-0', col: 'done', at: '2026-10-20T11:00:00Z' }, { id: 'd-2', col: 'done', at: '2026-11-02T11:00:00Z' }, { id: 'x', col: 'odd', at: '2026-11-01T00:00:00Z' },
        ]
        const tc = taskColumns(T, now)
        ok(tc.map(c => c.key).join() === 'need,progress,delivered,done' && tc[0].items.map(c => c.id).join() === 'A-2,A-1', 'Needs you by rank first')
        ok(tc[3].items.map(c => c.id).join() === 'd-2' && tc[1].items.map(c => c.id).join() === 'b-1,x', 'Done keeps 7 days; an unknown column reads as in progress')
        ok(taskColumns(T, now, { 'A-2': now.getTime() + 1 })[0].items.map(c => c.id).join() === 'A-1' && taskColumns(T, now, { 'A-2': now.getTime() - 1 })[0].items.length === 2, 'Later hides a card until its time')
        ok(changedSince(T, '2026-11-04T09:30:00Z').join() === 'A-1,d-1' && changedSince(T, '').length === 0, 'what changed since he last looked')
        ok(copyLine({ id: 'd-1', title: 'A  spec' }, 'seen') === 'Seen: d-1 (A spec)' && copyLine({ id: 'd-1', title: 'x' }, 'changes', ' more  tests ') === 'Needs changes: d-1 (x): more tests', 'the copied line')
        return true
    }

    return { TASK_COLS, DONE_DAYS, taskColumns, changedSince, copyLine, FIELDS, SORTS, STATUS_ORDER, DUE_ORDER, DUE_LABEL, OPEN_STATUSES, DEFAULTS, parseState, stateToHash, pickers, isMine, dueBucket, needsMe, groupOf, groupLabel, groups, filter, sort, selfTest }
})
