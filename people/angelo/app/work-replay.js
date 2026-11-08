// The map's work view in replay (backlog 0f2; spec: people/angelo/proposals/live-map/spec-work-view.md, "Live and replay, one
// source"). dev.work@PrompTugal.angelo. Replay (replay.js) announces its clock as an 'ak-clock' event whose detail is the moment
// shown, in minutes since its data's `from`; deliveries.json counts minutes since its own `from`. This file turns that clock into
// what the drawing (work-draw.js's fly and counts) needs: the deliveries that fall in each frame, merged per frame and destination
// (at "1 day a second" a frame covers about 24 minutes, so the screen never floods), and the counts for the window shown. A seek,
// a jump of more than JUMP minutes or the clock going back flies nothing: it only resets the counts. Pure rules here, the same file
// in node for the tests and in the browser as window.AngeloWorkReplay; the wiring waits on the graph's hook (as work-live.js does).
(function (root, make) {
    const m = make()
    if (typeof module === 'object' && module.exports) module.exports = m
    else root.AngeloWorkReplay = m
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'
    const JUMP = 120              // replay minutes: a step longer than this is a seek, not playback (1 day a second is ~24 a frame)
    const lower = (a, x) => { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m].min < x) lo = m + 1; else hi = m } return lo }

    // the offset that maps replay's minutes onto deliveries' minutes: both count from their own `from` (ISO times)
    const offset = (rFrom, wFrom) => Math.round((Date.parse(rFrom) - Date.parse(wFrom)) / 6e4)

    // due(list, last, now): the deliveries with last < min <= now, list sorted by min (work.js's unpack keeps the file's order)
    function due(list, last, now) { return list.slice(lower(list, Math.floor(last) + 1), lower(list, Math.floor(now) + 1)) }

    // one frame's deliveries merged per destination, as one icon each (work.js's merge, with every minute of the frame as one)
    function perFrame(A, slice, now) { return A.merge(slice.map(d => ({ ...d, min: Math.floor(now) }))) }

    // player(A, list, o): o.offset (replay minutes to deliveries' minutes), o.window (minutes the counts cover, default 24 h).
    // at(T, playing) returns { fly: [...merged], counts, seek } for the frame at replay minute T.
    function player(A, list, o = {}) {
        const off = o.offset || 0, win = o.window || 1440
        const L = list.slice().sort((a, b) => a.min - b.min)
        let last = null
        function at(T, playing = true) {
            const now = T + off, step = last == null ? Infinity : now - last
            const seek = !playing || !(step > 0 && step <= JUMP)
            const fly = seek ? [] : perFrame(A, due(L, last, now), now)
            last = now
            const lo = lower(L, Math.floor(now) - win + 1), hi = lower(L, Math.floor(now) + 1), c = Object.fromEntries(A.DESTS.map(d => [d, 0]))
            for (let i = lo; i < hi; i++) c[L[i].dest]++
            return { fly, counts: c, seek }
        }
        return { at, reset: () => { last = null }, size: L.length }
    }

    // wire(V, A, W, o): the browser side. V is work-draw.js's attach(); W the deliveries.json read; o.rFrom replay's `from`.
    // Listens for 'ak-clock' on o.win (default window); a 'stop' (the event replay sends on pause) arrives as the same T again,
    // which flies nothing. Returns a function that unhooks it.
    function wire(V, A, W, o = {}) {
        const win = o.win || root, P = player(A, A.unpack(W), { offset: offset(o.rFrom, W.from), window: o.window })
        const now = () => (win.performance ? win.performance.now() : Date.now())
        const on = e => { if (e.detail == null) return; const r = P.at(+e.detail, true); V.counts(r.counts); if (r.fly.length) V.fly(r.fly, now()) }
        win.addEventListener('ak-clock', on)
        return () => win.removeEventListener('ak-clock', on)
    }

    return { JUMP, offset, due, perFrame, player, wire }
})
