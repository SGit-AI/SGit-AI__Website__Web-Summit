// The map's work view in replay (backlog 0f2; spec: people/angelo/proposals/live-map/spec-work-view.md, "Live and replay, one
// source"). dev.work@PrompTugal.angelo. Replay (replay.js) announces its clock as an 'ak-clock' event whose detail is the moment
// shown, in minutes since its data's `from`; deliveries.json counts minutes since its own `from`. This file turns that clock into
// what the drawing (work-draw.js's fly and counts) needs: the deliveries that fall in each frame, merged per frame and destination
// (at "1 day a second" a frame covers about 24 minutes, so the screen never floods), and the counts for the window shown. A seek,
// a jump of more than JUMP minutes or the clock going back flies nothing: it only resets the counts. Pure rules here, the same file
// in node for the tests and in the browser as window.AngeloWorkReplay; mountMap puts it on the map replay plays on.
(function (root, make) {
    const m = make()
    if (typeof module === 'object' && module.exports) module.exports = m
    else root.AngeloWorkReplay = m
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'
    const root = typeof self !== 'undefined' ? self : globalThis   // the browser's window (wire and mountMap); unused in node
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
    // o.t0: replay's moment when wired (the counts show for it at once, before the first tick).
    function wire(V, A, W, o = {}) {
        const win = o.win || root, P = player(A, A.unpack(W), { offset: offset(o.rFrom, W.from), window: o.window })
        let clock = null   // the clip's own clock (clock(fn)), while it records; else the screen's
        const now = () => clock ? clock() : (win.performance ? win.performance.now() : Date.now())
        const on = e => { if (e.detail == null) return; const r = P.at(+e.detail, true); V.counts(r.counts); if (r.fly.length) V.fly(r.fly, now()) }
        if (o.t0 != null) V.counts(P.at(+o.t0, false).counts)
        win.addEventListener('ak-clock', on)
        const off = () => win.removeEventListener('ak-clock', on)
        off.clock = fn => { clock = fn || null; if (V.manual) V.manual(!!fn) }
        return off
    }

    // the viewBox that leaves room for the rim around a map drawn in S units: the map shown at `scale` of the frame, as live.js
    // shows its graph inside the hexagon, so the squares sit outside the outermost agents; plus MARGIN of the frame so the squares,
    // centred on the rim, are not cut at the map's edge
    const MARGIN = 0.07
    const roomy = (S, scale) => { const C = S / 2, h = C / scale * (1 + MARGIN); return [C - h, C - h, 2 * h, 2 * h].map(v => +v.toFixed(2)).join(' ') }

    // mountMap(host, o): the work view on Team and the machine's map while it plays back (replay.js's mountFlow draws the map and
    // sends 'ak-clock'). o.svg (the map's <svg>, S units square), o.pos (node id -> {x, y, person}), o.col (person -> colour),
    // o.rFrom (replay's `from`), o.t0 (its moment now), o.base (the app's folder), o.url (deliveries.json, default base + it),
    // o.W (the file itself, for tests). The map is shown at SCALE of its frame while the work view is on, and put back after.
    // Returns { ready (a promise: true once drawn, false if the file could not be read or it was taken down), destroy }.
    const SCALE = 0.84
    function mountMap(host, o = {}) {
        const win = o.win || root, doc = o.doc || win.document, A = win.AngeloWork, D = win.AngeloWorkDraw, svg = o.svg
        const NS = 'http://www.w3.org/2000/svg', S = A ? A.S : 1000
        let alive = true, V = null, unhook = null, layer = null, vb = null
        const ready = (async () => {
            if (!A || !D || !svg) return false
            let W = o.W
            if (!W) { try { const r = await win.fetch(new URL(o.url || (o.base || '') + 'deliveries.json', win.location.href).href, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); W = await r.json() } catch { return false } }
            if (!alive || !svg.isConnected || !W || !W.rows) return false
            vb = svg.getAttribute('viewBox'); svg.setAttribute('viewBox', roomy(S, SCALE)); svg.classList.add('wv-map')
            layer = doc.createElementNS(NS, 'g'); layer.setAttribute('class', 'lv-work'); svg.appendChild(layer)
            V = D.attach({ svg, pos: o.pos, col: o.col, layer, scale: SCALE, win, doc }, { base: o.base, light: o.light })
            unhook = wire(V, A, W, { rFrom: o.rFrom, t0: o.t0, win, window: o.window })
            return true
        })()
        function destroy() {
            alive = false; if (unhook) unhook(); if (V) V.destroy(); if (layer) layer.remove()
            if (vb != null) { svg.setAttribute('viewBox', vb); svg.classList.remove('wv-map') }
            unhook = V = layer = null; vb = null
        }
        // clock(fn): the clip (clip-button.js) flies the deliveries on its own clock (fn() in milliseconds) and steps them itself with
        // view().step(fn()); clock(null) gives them back to the screen
        return { ready, destroy, view: () => V, clock: fn => { if (unhook && unhook.clock) unhook.clock(fn) } }
    }

    return { JUMP, SCALE, offset, due, perFrame, player, wire, roomy, mountMap }
})
