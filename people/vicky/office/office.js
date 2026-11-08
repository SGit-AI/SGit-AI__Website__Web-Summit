// The Live AI Office (people/vicky/office/), dev@PrompTugal.vicky, 8 November 2026, at Vicky's word (decisions.md, SA21).
// Plain Canvas 2D, no library, no external script. Every minute it reads the office's data (built at each site release from
// public facts) and, with the viewer's clock, works out each agent's state:
//   confirmed  a report entry or a commit shows the run (solid badge, its time); a commit is not required
//   idle       the agent's report says the run found nothing to do (soft badge, "idle HH:MM")
//   scheduled  the next run is due at the time shown and has not started (dashed badge, "due HH:MM")
//   running    inferred: within the run's expected 30 minutes, not yet confirmed (faded, "running?")
//   late       the run should have finished, and the report the agent writes on every run is not there, with data
//              recent enough to tell
//   unknown    the data cannot tell: too old, a fix-only run (silent when there is nothing to fix), or no dated report
//   error      the latest report says blocked, failed or URGENT
//   on demand  works only when Vicky asks (no times for the inbox or the vault agent)
// Agents walk between their room, their desk and the lounge as their state changes. All the art is original
// (sprites/, drawn by make-sprites.mjs; CREDITS.md). Written from scratch: no code copied from any other project.
(() => {
    'use strict'
    const canvas = document.getElementById('office-canvas')
    if (!canvas || !canvas.getContext) return
    const ctx = canvas.getContext('2d')
    const detail = document.getElementById('office-detail'), banner = document.getElementById('office-banner')
    const rows = document.getElementById('office-rows'), strip = document.getElementById('office-strip')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    const dark = matchMedia('(prefers-color-scheme: dark)')
    const MIN = 60e3, LATE = 30 * MIN, SOON = 60 * MIN

    // ---- rooms, in the order they are laid out; slots are desks (26 logical px each) ----
    const ROOMS = [
        { id: 'research', name: 'Research', slots: 2, extra: 'shelf' },
        { id: 'stories', name: 'Storylines', slots: 2, extra: 'board' },
        { id: 'writing', name: 'Writing desks', slots: 5 },
        { id: 'review', name: 'Review', slots: 2, extra: 'plant' },
        { id: 'coord', name: 'Coordination', slots: 4, extra: 'board' },
        { id: 'logistics', name: 'Logistics and design', slots: 2, extra: 'boxes' },
        { id: 'ondemand', name: 'On demand', slots: 3, extra: 'door' },
        { id: 'lounge', name: 'Lounge', slots: 6, lounge: true },
    ]
    const SLOT = 26, ROOM_H = 86, WALL = 14, HALL = 12, PAD = 6
    // the hall along the left edge, where agents walk between rows: a figure is 16 px wide, drawn from its centre, so
    // the walking line sits 9 px in and the rooms start 14 px in; nothing walks outside the canvas
    const GUT = 14, HALL_X = 9
    // the furniture sheet's frames: [x, y, w, h] (make-sprites.mjs)
    const FURN = { desk: [0, 0, 24, 24], chair: [24, 0, 16, 24], plant: [40, 0, 16, 24], sofa: [56, 0, 32, 24], coffee: [88, 0, 16, 24], shelf: [104, 0, 16, 24], board: [120, 0, 32, 24], boxes: [152, 0, 16, 24], tray: [168, 0, 16, 24], door: [184, 0, 8, 24] }

    // ---- images ----
    const imgs = {}
    const load = name => imgs[name] || (imgs[name] = Object.assign(new Image(), { src: `sprites/${name}.png` }))
    load('furniture')

    // ---- theme: the site's tokens, read from its stylesheet, plus the office's own floor colours ----
    let C = {}
    function theme() {
        const cs = getComputedStyle(document.documentElement), v = n => cs.getPropertyValue(n).trim()
        const d = dark.matches
        C = {
            ink: v('--ink') || (d ? '#ecebe6' : '#1c1d21'), ink2: v('--ink-2') || '#5c5f66', surface: v('--surface') || (d ? '#1c1c19' : '#fff'),
            ok: v('--ok') || '#146c43', okSoft: v('--ok-soft') || '#e3f4ea', warn: v('--warn') || '#9a5b00', warnSoft: v('--warn-soft') || '#fdf1dc', bad: v('--bad') || '#b42318',
            wait: v('--wait') || '#5c5f66', waitSoft: v('--wait-soft') || '#eeede8', line: v('--line-2') || '#d5d0c2',
            hall: d ? '#1b1a17' : '#ebe7dd', wall: d ? '#2f2c27' : '#d8cdb8', wallEdge: d ? '#3c3832' : '#c5b89f',
            floor: d ? ['#2a2622', '#27241f'] : ['#efe4cf', '#e8dcc4'], lounge: d ? ['#24282b', '#212528'] : ['#e3ecef', '#dbe6ea'], rug: d ? '#3a2f3f' : '#d9c7de', onSolid: d ? '#10130f' : '#ffffff',
        }
    }

    // ---- layout: rooms flow into rows that fit the width; a hall under each row, joined at the left edge ----
    let S = 2, W = 0, H = 0, layout = []
    function doLayout() {
        const css = canvas.parentElement.clientWidth || 360
        S = css >= 960 ? 3 : 2
        W = Math.floor(css / S)
        const want = r => PAD * 2 + r.slots * SLOT + (r.extra ? 18 : 0)
        const out = []; let row = [], used = 0, y = 0
        const flush = () => {
            if (!row.length) return
            const spare = W - GUT - 2 - used, add = Math.floor(spare / row.length); let x = GUT
            for (const r of row) { const w = r._w + add; out.push({ ...r, x, y, w, h: ROOM_H, hallY: y + ROOM_H + HALL / 2 }); x += w }
            y += ROOM_H + HALL; row = []; used = 0
        }
        for (const r of ROOMS) { const w = Math.min(want(r), W - GUT - 2); if (used + w > W - GUT - 2) flush(); row.push({ ...r, _w: w }); used += w }
        flush()
        layout = out; H = y
        const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1))
        canvas.width = W * S * dpr; canvas.height = H * S * dpr
        canvas.style.height = (H * S) + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.imageSmoothingEnabled = false
        for (const a of agents) place(a, true)
    }
    const room = id => layout.find(r => r.id === id)
    // a desk's spot: its left x and the desk's top y (logical px)
    function desk(a) {
        const r = room(a.area); if (!r) return { x: 0, y: 0 }
        const mates = agents.filter(b => b.area === a.area), i = mates.indexOf(a)
        const left = r.x + PAD + (r.extra === 'shelf' || r.extra === 'board' ? 18 : 0) + Math.floor((r.w - PAD * 2 - (r.extra ? 18 : 0) - r.slots * SLOT) / 2)
        return { x: left + i * SLOT, y: r.y + WALL + 20 }
    }
    // feet positions
    const atDesk = a => { const d = desk(a); return { x: d.x + 12, y: d.y + 17 } }
    const inRoom = a => { const d = desk(a); return { x: d.x + 12, y: d.y + 40 } }
    function inLounge(a, k) {
        const r = room('lounge'); if (!r) return inRoom(a)
        const n = Math.max(1, Math.floor((r.w - 40) / 16)), j = k % (n * 2)
        return { x: r.x + 30 + (j % n) * 16 + (Math.floor(j / n) ? 8 : 0), y: r.y + WALL + 34 + Math.floor(j / n) * 14 }
    }
    const coffee = () => { const r = room('lounge'); return r ? { x: r.x + r.w - 22, y: r.y + WALL + 38 } : null }

    // paths: out of the room by its door (the middle of its lower edge), along the hall, up the left edge, into the next room
    function route(a, to) {
        const from = { x: a.x, y: a.y }, rf = roomAt(from), rt = roomAt(to)
        if (rf && rt && rf === rt) return [to]
        const pts = []
        if (rf) pts.push({ x: from.x, y: rf.y + rf.h - 4 }, { x: from.x, y: rf.hallY })
        const hy1 = rf ? rf.hallY : from.y, hy2 = rt ? rt.hallY : to.y
        if (hy1 !== hy2) pts.push({ x: HALL_X, y: hy1 }, { x: HALL_X, y: hy2 })
        if (rt) pts.push({ x: to.x, y: hy2 }, { x: to.x, y: rt.y + rt.h - 4 })
        pts.push(to)
        return pts
    }
    const roomAt = p => layout.find(r => p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y <= r.y + r.h)

    // ---- the data and the states ----
    let data = null, agents = []
    const hm = d => d.toISOString().slice(11, 16)
    function dues(a, now) {
        const day = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()), out = []
        for (const t of a.cron) { const [h, m] = t.split(':').map(Number); for (const k of [-1, 0, 1]) out.push(day + k * 864e5 + (h * 60 + m) * MIN) }
        return out.sort((x, y) => x - y)
    }
    const dataAt = () => { const t = data && data.data_at ? Date.parse(data.data_at) : NaN; return isNaN(t) ? -Infinity : t }
    // A run's evidence, best first: a dated entry in the agent's report (its time and state word), then a commit carrying
    // its name. A commit supports, but is never required: an idle run often commits nothing. Nothing later than the
    // viewer's clock counts. With no evidence, a run is late only when the agent must report on every run (SA16), the run is
    // not one that may end silently (a fix-only follow-up), and the published data reaches past the run's window;
    // otherwise it is unknown.
    function stateOf(a, nowMs) {
        const runs = (a.runs || []).map(r => ({ ...r, t: Date.parse(r.at) })).filter(r => r.t <= nowMs).sort((x, y) => y.t - x.t)
        const commits = (a.confirmed || []).map(Date.parse).filter(t => t <= nowMs).sort((x, y) => y - x)
        const base = { lastRun: runs[0] || null, lastCommit: commits[0] ?? null }
        const top = runs[0]
        if (top ? top.urgent || top.state === 'blocked' || top.state === 'failed' : a.urgent || a.status === 'blocked')
            return { ...base, kind: 'error', why: `its latest report says ${top && top.urgent || !top && a.urgent ? 'URGENT' : (top ? top.state : a.status)}` }
        if (a.on_demand) return { ...base, kind: 'ondemand' }
        const ds = dues(a, new Date(nowMs)), last = [...ds].reverse().find(t => t <= nowMs), next = ds.find(t => t > nowMs)
        const from = last == null ? -Infinity : last - 5 * MIN
        const rep = runs.find(r => r.t >= from), com = commits.find(t => t >= from)
        if (rep || com != null) {
            const kind = rep && rep.state === 'idle' ? 'idle' : 'confirmed', at = rep ? rep.t : com, by = rep ? `report (${rep.state || 'no state word'})` : 'commit'
            // the last run's outcome stays in view until 15 minutes before the next run (a journalist's fix-only run comes an
            // hour after its writing run, so an hour would hide every idle result)
            if (next != null && next - nowMs <= 15 * MIN && nowMs - at >= LATE) return { ...base, kind: 'scheduled', due: next, prev: kind, at }
            return { ...base, kind, at, by, working: kind === 'confirmed' && nowMs - at < LATE, next }
        }
        if (last == null) return next != null ? { ...base, kind: 'scheduled', due: next } : { ...base, kind: 'unconfirmed', why: 'none' }
        if (nowMs - last < LATE) return { ...base, kind: 'inferred', due: last, next }
        const unknown = why => ({ ...base, kind: 'unconfirmed', due: last, next, why })
        if (dataAt() < last + LATE) return unknown('data')
        if ((a.quiet || []).includes(hm(new Date(last)))) return unknown('quiet')
        if (!a.reports_every_run) return unknown('noreport')
        return { ...base, kind: 'late', due: last, next }
    }
    const LABEL = { confirmed: 'Confirmed', idle: 'Idle', scheduled: 'Scheduled', inferred: 'Running (inferred)', late: 'Late', unconfirmed: 'Unknown', error: 'Error', ondemand: 'On demand' }
    // the details under the office when a figure is tapped: one fact a line, every time in UTC, with its day when it is
    // not today (by the UTC calendar)
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    function when(t) {
        const d = new Date(t), n = new Date()
        const same = d.getUTCFullYear() === n.getUTCFullYear() && d.getUTCMonth() === n.getUTCMonth() && d.getUTCDate() === n.getUTCDate()
        return `${hm(d)} UTC` + (same ? '' : `, ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`)
    }
    const UNKNOWN = {
        data: 'its run was due over 30 minutes ago, but the published data is older than that, so it cannot be told yet whether it ran',
        quiet: 'a fix-only run leaves no record when there is nothing to fix, so whether this one ran cannot be told',
        noreport: 'this agent keeps no dated report, so whether its run happened cannot be told from the data',
        none: 'no run on record',
    }
    function describe(a) {
        const s = a.state, lines = [], hidden = a.short === 'inbox' || a.short === 'vault'   // Vicky (SA21): none of their activity
        const why = {
            confirmed: s.working ? `its ${s.by} shows it at work now` : `its ${s.by} shows the run`,
            idle: 'its report says the run found nothing to do',
            scheduled: 'its next run is due and has not started yet', inferred: 'it is within its run\'s expected 30 minutes; not confirmed yet',
            late: 'its run should have finished by now, and its report, which it writes on every run, is not there', error: s.why,
            unconfirmed: UNKNOWN[s.why], ondemand: 'works only when Vicky asks',
        }[s.kind]
        lines.push(`State: ${LABEL[s.kind]} (${why})`)
        const r = s.lastRun, c = s.lastCommit
        if (hidden) lines.push('Activity times: not shown for this agent')
        else if (r || c != null) {
            const useRun = r && (c == null || r.t >= c - 10 * MIN)
            lines.push(`Last confirmed activity: ${when(useRun ? r.t : c)} (${useRun ? `report: ${r.state || 'no state word'}` : 'commit'})`)
            if (useRun && c != null && c > r.t) lines.push(`Last commit: ${when(c)}`)
        } else lines.push('Last confirmed activity: none on record')
        if (s.kind === 'inferred' || s.kind === 'late' || s.kind === 'unconfirmed') if (s.due) lines.push(`Run due: ${when(s.due)}`)
        const next = s.kind === 'scheduled' ? s.due : s.next
        if (next) lines.push(`Next run due: ${when(next)}`)
        return { title: `${a.short}: ${a.role}`, lines }
    }
    function show(a) {
        if (!detail) return
        if (!a) { detail.innerHTML = ''; return }
        const d = describe(a)
        detail.innerHTML = `<b>${esc(d.title)}</b><br>` + d.lines.map(esc).join('<br>')
    }
    const pill = a => {
        const s = a.state
        return { confirmed: () => hm(new Date(s.at)), idle: () => 'idle ' + hm(new Date(s.at)), scheduled: () => s.due ? 'due ' + hm(new Date(s.due)) : 'due', inferred: () => 'running?', late: () => 'late', unconfirmed: () => 'unknown', error: () => '!', ondemand: () => 'on demand' }[s.kind]()
    }

    // where each state puts an agent
    function goal(a) {
        const s = a.state
        if (s.kind === 'ondemand') return inRoom(a)
        if (s.kind === 'scheduled' && s.due && s.due - Date.now() <= SOON) return inLounge(a, a.loungeSpot)
        if (s.kind === 'inferred' || s.kind === 'late' || s.kind === 'error' || (s.kind === 'confirmed' && s.working)) return atDesk(a)
        return inRoom(a)
    }
    function place(a, snap) {
        const g = goal(a)
        a.home = g
        if (snap || reduce.matches || a.x == null) { a.x = g.x; a.y = g.y; a.path = []; return }
        const end = a.path.length ? a.path[a.path.length - 1] : { x: a.x, y: a.y }
        if (Math.abs(end.x - g.x) > 0.5 || Math.abs(end.y - g.y) > 0.5) { a.path = route(a, g); a.trip = null }
    }

    function apply(json) {
        data = json
        const old = Object.fromEntries(agents.map(a => [a.short, a]))
        let k = 0
        agents = (json.agents || []).map((x, i) => Object.assign(old[x.short] || { x: null, y: null, path: [], seed: 97 * (i + 3), loungeSpot: 0, nextTrip: 0 }, x))
        agents.forEach(a => { load(a.short); a.loungeSpot = k++ })
        fresh()
        if (strip && json.newsroom) strip.innerHTML = json.newsroom.map(n => `<li><span class="st">${esc(n.stage)}</span><b>${esc(n.count)}${n.of ? ` <small>of ${esc(n.of)}</small>` : ''}</b>${esc(n.unit)}</li>`).join('')
        tick(true)
        if (!layout.length) doLayout(); else agents.forEach(a => place(a, a.x == null))
    }
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
    // recompute the states with the viewer's clock (each second); update the table's "Now" column when one changes
    function tick(force) {
        const now = Date.now()
        for (const a of agents) {
            const s = stateOf(a, now), key = [s.kind, s.working, s.due, s.at, s.why, s.lastRun && s.lastRun.t, s.lastCommit].join('|')
            if (key !== a.key || force) {
                a.state = s; a.key = key
                if (layout.length) place(a, false)
                const cell = rows && rows.querySelector(`tr[data-agent="${CSS.escape(a.short)}"] .office-state`)
                if (cell) cell.innerHTML = `<span class="office-key k-${s.kind}">${esc(pill(a))}</span>` + (s.kind === 'ondemand' ? '' : ` ${LABEL[s.kind]}`)
            }
        }
        if (selected) show(selected)
    }
    // the data is inside the page (an office-data block, written at each site release): read it from this page first,
    // then every minute from a fresh copy of the page, so a release since the page was opened shows up without a reload
    const parse = html => JSON.parse(new DOMParser().parseFromString(html, 'text/html').getElementById('office-data').textContent)
    // On load: the data in this page, then at once a fresh copy of the page, then every minute. cache: 'no-store' and a
    // new query each time keep the browser's own cache out of it. The CDN in front of GitHub Pages is not bypassed (it
    // ignores the query and the request's cache headers; checked 8 Nov 2026) and may answer with a copy up to 10 minutes
    // old (max-age=600), so a release reaches an open page within about 10 minutes of going live. A copy older than the
    // data already shown (one CDN node behind another) is ignored. A failed check keeps the data and says so in the banner.
    let checkedAt = 0, failedSince = 0
    async function refresh(first) {
        if (first) { const el = document.getElementById('office-data'); if (el) try { apply(JSON.parse(el.textContent)) } catch { } }
        try {
            const r = await fetch(`${location.pathname}?t=${Date.now()}`, { cache: 'no-store' })
            if (!r.ok) throw new Error(r.status)
            const json = parse(await r.text())
            checkedAt = Date.now(); failedSince = 0
            if (!data || !data.data_at || (json.data_at || '') >= data.data_at) apply(json); else fresh()
        } catch { if (!failedSince) failedSince = Date.now(); fresh() }
    }
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const full = t => { const d = new Date(t); return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${hm(d)} UTC` }
    const STALE = 8 * 60 * MIN   // no release for 8 hours: the overnight gap between Vicky's runs is 7
    // the banner, from text nodes only: the data's own time (when the site published it) and, apart, when this browser checked
    function fresh() {
        if (!banner || !data) return
        const now = Date.now(), at = data.data_at ? Date.parse(data.data_at) : NaN, warn = []
        const line = (txt, bold) => { const e = document.createElement(bold ? 'b' : 'span'); e.textContent = txt; return e }
        banner.replaceChildren(line('Near-live: updated with each site release, last data '), line(isNaN(at) ? 'unknown' : full(at), true), line('.'))
        if (failedSince) warn.push(`Could not check for new data since ${hm(new Date(failedSince))} UTC; the office shows the data above, which may be out of date.`)
        if (!isNaN(at) && now - at > STALE) warn.push(`This data is ${Math.floor((now - at) / (60 * MIN))} hours old: no site release since then, so later work is not shown and runs past due show as unknown.`)
        if (!isNaN(at) && at - now > MIN) warn.push("This device's clock is behind the data's time; states may be wrong.")
        const p = document.createElement('span'); p.className = 'office-checked'
        p.textContent = checkedAt ? ` Checked for new data by this browser at ${hm(new Date(checkedAt))} UTC; it checks every minute.` : ' Checking for new data...'
        banner.append(p)
        banner.classList.toggle('office-stale', warn.length > 0)
        for (const w of warn) { const e = document.createElement('span'); e.className = 'office-warn'; e.textContent = ' ' + w; banner.append(e) }
    }

    // ---- drawing ----
    function sprite(name, fx, x, y, alpha) {
        const im = imgs[name]; if (!im || !im.complete || !im.naturalWidth) return
        ctx.globalAlpha = alpha; ctx.drawImage(im, fx * 16, 0, 16, 24, Math.round(x) * S, Math.round(y) * S, 16 * S, 24 * S); ctx.globalAlpha = 1
    }
    function furn(name, x, y, part) {
        const im = imgs.furniture, f = FURN[name]; if (!im || !im.complete || !im.naturalWidth) return
        const [sx, sy, w, h] = f, top = part === 'lower' ? 11 : 0
        ctx.drawImage(im, sx, sy + top, w, h - top, Math.round(x) * S, Math.round(y + top) * S, w * S, (h - top) * S)
    }
    function floor(r) {
        const [a, b] = r.lounge ? C.lounge : C.floor, t = 8
        for (let y = r.y + WALL; y < r.y + r.h; y += t) for (let x = r.x; x < r.x + r.w; x += t) { ctx.fillStyle = ((x - r.x) / t + (y - r.y) / t) % 2 ? a : b; ctx.fillRect(x * S, y * S, Math.min(t, r.x + r.w - x) * S, Math.min(t, r.y + r.h - y) * S) }
        ctx.fillStyle = C.wall; ctx.fillRect(r.x * S, r.y * S, r.w * S, WALL * S)
        ctx.fillStyle = C.wallEdge; ctx.fillRect(r.x * S, (r.y + WALL - 2) * S, r.w * S, 2 * S); ctx.fillRect(r.x * S, r.y * S, S, r.h * S); ctx.fillRect((r.x + r.w - 1) * S, r.y * S, S, r.h * S)
        // the door: a gap in the lower edge, in the middle
        ctx.fillStyle = C.wallEdge; ctx.fillRect(r.x * S, (r.y + r.h - 1) * S, r.w * S, S)
        ctx.fillStyle = C.hall; ctx.fillRect((r.x + r.w / 2 - 7) * S, (r.y + r.h - 1) * S, 14 * S, S)
        ctx.fillStyle = C.ink2; ctx.font = `600 ${S === 3 ? 13 : 11}px system-ui, sans-serif`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'
        ctx.fillText(r.name, (r.x + 4) * S, (r.y + WALL / 2 - 1) * S)
    }
    function roundRect(x, y, w, h, rad) { ctx.beginPath(); ctx.moveTo(x + rad, y); ctx.arcTo(x + w, y, x + w, y + h, rad); ctx.arcTo(x + w, y + h, x, y + h, rad); ctx.arcTo(x, y + h, x, y, rad); ctx.arcTo(x, y, x + w, y, rad); ctx.closePath() }
    // a label's centre, moved in so the whole label (w css px wide) stays on the canvas
    const inside = (cx, w) => Math.min(Math.max(cx, w / 2 + 3), W * S - w / 2 - 3)   // 3 px: a badge's outline is 1.5 px wide
    function badge(a, cx, top, odd, space) {
        const s = a.state, text = pill(a), fs = S === 3 ? 12 : 10
        ctx.font = `600 ${fs}px ui-monospace, SFMono-Regular, Menlo, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        // a badge wider than a desk would cover its neighbour's: every other one sits a row higher
        const w = Math.max(fs + 6, ctx.measureText(text).width + 10), h = fs + 6, x = inside(cx, w) - w / 2, y = top - h - 2 - (odd && w > space - 2 ? h + 2 : 0)
        roundRect(x, y, w, h, h / 2)
        let fg = C.ink
        ctx.setLineDash([]); ctx.lineWidth = 1.5
        if (s.kind === 'confirmed') { ctx.fillStyle = C.ok; ctx.fill(); fg = C.onSolid }
        else if (s.kind === 'idle') { ctx.fillStyle = C.okSoft; ctx.fill(); ctx.strokeStyle = C.ok; ctx.stroke(); fg = C.ok }
        else if (s.kind === 'scheduled') { ctx.fillStyle = C.surface; ctx.fill(); ctx.setLineDash([3, 2]); ctx.strokeStyle = C.ink2; ctx.stroke(); ctx.setLineDash([]) }
        else if (s.kind === 'inferred') { ctx.fillStyle = C.surface; ctx.globalAlpha = .75; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = C.line; ctx.stroke(); fg = C.ink2 }
        else if (s.kind === 'late') { ctx.fillStyle = C.warnSoft; ctx.fill(); ctx.strokeStyle = C.warn; ctx.stroke(); fg = C.warn }
        else if (s.kind === 'unconfirmed') { ctx.fillStyle = C.surface; ctx.fill(); ctx.setLineDash([1.5, 2]); ctx.strokeStyle = C.ink2; ctx.stroke(); ctx.setLineDash([]); fg = C.ink2 }
        else if (s.kind === 'error') { ctx.fillStyle = C.bad; ctx.fill(); fg = C.onSolid }
        else { ctx.fillStyle = C.waitSoft; ctx.fill(); ctx.strokeStyle = C.line; ctx.stroke(); fg = C.wait }
        ctx.fillStyle = fg; ctx.fillText(text, x + w / 2, y + h / 2 + .5)
    }
    function tag(a, cx, y, i) {
        const fs = S === 3 ? 11 : 9
        ctx.font = `${fs}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
        const t = a.short.replace('journalist-', 'j-'), w = ctx.measureText(t).width + 6, yy = y + (i % 2 ? fs + 2 : 0)
        cx = inside(cx, w)
        ctx.globalAlpha = .85; ctx.fillStyle = C.surface; ctx.fillRect(cx - w / 2, yy, w, fs + 3); ctx.globalAlpha = 1
        ctx.fillStyle = C.ink; ctx.fillText(t, cx, yy + 1)
    }

    let t0 = performance.now(), last = t0, selected = null
    function frame(nowP) {
        const dt = Math.min(100, nowP - last) / 1000; last = nowP
        const now = Date.now(), still = reduce.matches
        // walking: 28 logical px a second along the path; idle agents now and then fetch a coffee from the lounge
        for (const a of agents) {
            if (!a.state) continue
            if (!still && a.path.length) {
                const p = a.path[0], dx = p.x - a.x, dy = p.y - a.y, d = Math.hypot(dx, dy), step = 28 * dt
                if (d <= step) { a.x = p.x; a.y = p.y; a.path.shift() } else { a.x += dx / d * step; a.y += dy / d * step }
                a.walking = true
            } else a.walking = false
            const resting = a.state.kind === 'confirmed' && !a.state.working || a.state.kind === 'idle' || a.state.kind === 'scheduled' && !(a.state.due && a.state.due - now <= SOON)
            if (!still && resting && !a.path.length && room('lounge')) {
                if (!a.nextTrip) a.nextTrip = now + 15e3 + (a.seed * 7919 % 50) * 1e3
                if (now > a.nextTrip && !a.trip) { const c = coffee(); a.trip = 'out'; a.path = route(a, { x: c.x - (a.seed % 5) * 6, y: c.y + (a.seed % 3) * 4 }); a.nextTrip = now + 6e3 }
                else if (a.trip === 'out' && now > a.nextTrip) { a.trip = 'back'; a.path = route(a, a.home); a.nextTrip = now + 40e3 + (a.seed * 104729 % 60) * 1e3 }
                else if (a.trip === 'back' && !a.path.length) a.trip = null
            }
        }
        // the floor plan
        ctx.clearRect(0, 0, W * S, H * S)
        ctx.fillStyle = C.hall; ctx.fillRect(0, 0, W * S, H * S)
        for (const r of layout) floor(r)
        // things to draw, back to front by their feet
        const items = []
        for (const r of layout) {
            if (r.lounge) {
                items.push({ y: r.y + WALL + 22, draw: () => furn('sofa', r.x + 24, r.y + WALL - 2) })
                items.push({ y: r.y + WALL + 22, draw: () => furn('sofa', r.x + 58, r.y + WALL - 2) })
                items.push({ y: r.y + WALL + 30, draw: () => furn('coffee', r.x + r.w - 26, r.y + WALL + 6) })
                items.push({ y: r.y + WALL + 22, draw: () => furn('plant', r.x + 4, r.y + WALL - 2) })
                ctx.fillStyle = C.rug; ctx.fillRect((r.x + 28) * S, (r.y + WALL + 26) * S, Math.min(80, r.w - 60) * S, 24 * S)
                continue
            }
            const ex = r.extra, ex1 = r.x + 4
            if (ex === 'shelf') items.push({ y: r.y + WALL + 18, draw: () => furn('shelf', ex1, r.y + WALL - 4) })
            if (ex === 'board') items.push({ y: r.y + WALL + 14, draw: () => furn('board', r.x + r.w - 36, r.y - 6) })
            if (ex === 'plant') items.push({ y: r.y + WALL + 20, draw: () => furn('plant', r.x + r.w - 18, r.y + WALL - 4) })
            if (ex === 'boxes') items.push({ y: r.y + WALL + 22, draw: () => furn('boxes', r.x + r.w - 18, r.y + WALL - 2) })
            if (ex === 'door') { items.push({ y: r.y + WALL + 18, draw: () => furn('door', r.x + r.w - 12, r.y + WALL - 8) }); items.push({ y: r.y + WALL + 18, draw: () => furn('tray', r.x + r.w - 30, r.y + WALL + 4) }) }
            for (const a of agents.filter(b => b.area === r.id)) {
                const d = desk(a), sat = a.state && !a.walking && Math.abs(a.x - (d.x + 12)) < 1 && Math.abs(a.y - (d.y + 17)) < 1
                items.push({ y: d.y + 24, draw: () => furn('desk', d.x, d.y, sat ? 'lower' : 'full') })
            }
        }
        const tags = []
        for (const a of agents) {
            if (!a.state) continue
            const s = a.state, d = desk(a), sat = !a.walking && Math.abs(a.x - (d.x + 12)) < 1 && Math.abs(a.y - (d.y + 17)) < 1
            const tt = nowP / 1000 + (a.seed % 10) / 10
            let fx = still ? 0 : Math.floor(tt * 1.5) % 2
            if (a.walking) fx = 2 + Math.floor(tt * 8) % 4
            else if (sat && (s.kind === 'confirmed' || s.kind === 'inferred')) fx = still ? 6 : 6 + Math.floor(tt * 4) % 2
            const alpha = s.kind === 'inferred' || s.kind === 'unconfirmed' ? .45 : s.kind === 'late' ? .6 : 1
            items.push({ y: a.y, draw: () => sprite(a.short, fx, a.x - 8, a.y - 24, alpha) })
            tags.push(a)
        }
        items.sort((p, q) => p.y - q.y).forEach(it => it.draw())
        // badges and name tags on top; at a desk the tag goes under the desk, so it never covers a face
        tags.forEach((a, i) => {
            const d = desk(a), sat = !a.walking && Math.abs(a.y - (d.y + 17)) < 1
            const lr = roomAt(a), lounging = !!(lr && lr.lounge); badge(a, a.x * S, (a.y - 25) * S, (lounging ? a.loungeSpot : agents.filter(m => m.area === a.area).indexOf(a)) % 2 === 1, (lounging ? 16 : SLOT) * S)
            tag(a, a.x * S, (sat ? d.y + 25 : a.y + 1) * S, a.area === 'lounge' || !sat ? i : 0)
            if (a === selected) { ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([]); ctx.strokeRect((a.x - 10) * S, (a.y - 26) * S, 20 * S, 27 * S) }
        })
        requestAnimationFrame(frame)
    }

    // tap or click a figure: who it is and what we know, under the office
    canvas.addEventListener('click', e => {
        const b = canvas.getBoundingClientRect(), x = (e.clientX - b.left) / S, y = (e.clientY - b.top) / S
        const hit = agents.filter(a => x >= a.x - 9 && x <= a.x + 9 && y >= a.y - 26 && y <= a.y + 2).sort((p, q) => q.y - p.y)[0]
        selected = hit || null
        show(hit)
    })

    theme()
    dark.addEventListener('change', theme)
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(doLayout, 150) })
    refresh(true).then(() => { if (!layout.length) doLayout(); requestAnimationFrame(frame) })
    setInterval(refresh, 60e3)
    setInterval(fresh, 30e3)
    setInterval(() => tick(false), 1e3)
})()
