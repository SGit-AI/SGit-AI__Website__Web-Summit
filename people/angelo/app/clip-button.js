// The map's "Download clip" (backlog 0f3; spec: people/angelo/proposals/live-map/spec-work-view.md, part 2, approved by Angelo on
// 8 November). dev.work@PrompTugal.angelo. A button on Team and the machine's playback bar that makes a video of exactly what the
// map plays back (its layout, focus, window, speed, Exchanges or Work, light or dark) as an MP4 that WhatsApp plays inline, with
// clip.js (WebCodecs H.264 into a fast-start MP4; MediaRecorder where WebCodecs is missing; never a WebM).
// Frames are drawn on the clip's own clock, frame by frame (replay.js flow().step, work-replay.js clock()), so a slow machine
// makes the same clip, more slowly, with a progress bar and a Cancel. Each frame is the map's own drawing as a picture, with the
// map's rules and the page's colours inside it (as live.js's pop-out does); tooltips and the tick line under the map are never
// drawn, so no commit's text reaches the video: only what the map shows, and clip.js's caption (the range in UTC, the site).
// Runs in the browser as window.AngeloClipButton; app.js mounts it once the playback is on the map.
(function (root) {
    'use strict'
    const SHAPES = [['square', 'Square'], ['tall', '9:16'], ['wide', '16:9']]   // square by default (Angelo's answer 5)
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
    let cssCache = null

    // the map's rules and the page's colours, for the picture of one frame (no animation: each frame is a still)
    function frameCss(doc, svgText) {
        const vars = new Set(), rules = [], names = t => { for (const m of t.matchAll(/--[\w-]+/g)) vars.add(m[0]) }
        if (!cssCache) {
            cssCache = []
            for (const sh of doc.styleSheets) { let rs; try { rs = sh.cssRules } catch { continue } for (const r of rs) if (r.selectorText && /\.(tm-|tmf-|wv-|lv-work)/.test(r.selectorText)) cssCache.push(r.cssText) }
        }
        for (const r of cssCache) { rules.push(r); names(r) }
        names(svgText)
        const cs = root.getComputedStyle(doc.documentElement)
        return `svg{${[...vars].map(v => `${v}:${cs.getPropertyValue(v).trim()}`).filter(x => !/:$/.test(x)).join(';')};font-family:system-ui,-apple-system,"Segoe UI",sans-serif}\n` +
            rules.join('\n') + '\n*{animation:none!important;transition:none!important}\n.tm-svg title{display:none}'
    }
    // the logos as data (a picture made from an svg loads nothing from outside itself), read once
    const dataUrls = new Map()
    async function inlineImages(svg) {
        for (const im of svg.querySelectorAll('image')) {
            const href = im.getAttribute('href') || im.getAttribute('xlink:href'); if (!href || href.startsWith('data:') || dataUrls.has(href)) continue
            try {
                const blob = await (await root.fetch(new URL(href, svg.ownerDocument.baseURI).href)).blob()
                dataUrls.set(href, await new Promise((ok, no) => { const r = new root.FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(blob) }))
            } catch { dataUrls.set(href, '') }
        }
    }
    // a copy of the map for one frame: its frame widened to all that is drawn (the names outside the rim, on a phone in rows above
    // and below, are drawn past the map's own frame), made square about its centre, and the logos as data
    function frameCopy(svg) {
        const c = svg.cloneNode(true), vb = (svg.getAttribute('viewBox') || '0 0 1000 1000').split(/[\s,]+/).map(Number)
        let [x0, y0, x1, y1] = [vb[0], vb[1], vb[0] + vb[2], vb[1] + vb[3]]
        try { const b = svg.getBBox(); if (b.width && b.height) { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height) } } catch { }
        const side = Math.max(x1 - x0, y1 - y0) * 1.02, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
        c.setAttribute('viewBox', [cx - side / 2, cy - side / 2, side, side].map(v => +v.toFixed(1)).join(' '))
        for (const im of c.querySelectorAll('image')) { const u = dataUrls.get(im.getAttribute('href') || im.getAttribute('xlink:href')); if (u) im.setAttribute('href', u); else if (u === '') im.remove() }
        return c
    }
    // the picture of the map now, centred on a w x h frame filled with the page's background, above the caption
    async function paintFrame(cx, svg, w, h, bg, C) {
        cx.fillStyle = bg; cx.fillRect(0, 0, w, h)
        const c = frameCopy(svg), text = new root.XMLSerializer().serializeToString(c)
        const side = Math.round(Math.min(w, h * 0.86)), img = await C.svgImage(c, frameCss(svg.ownerDocument, text), side, side)
        cx.drawImage(img, Math.round((w - side) / 2), Math.round((h * 0.93 - side) / 2), side, side)
    }

    // mount(host, o): host is the map's section (it holds the playback bar, [data-tmf]); o.work() the work view on the map, if on
    // (app.js's drawCollab.wv); o.base the app's folder. Returns { destroy }.
    function mount(host, o = {}) {
        const doc = host.ownerDocument, bar = host.querySelector('[data-tmf]'), C = root.AngeloClip, R = root.AngeloReplay
        if (!bar || !C || !R || host.querySelector('[data-clip]')) return null
        const box = doc.createElement('div'); box.className = 'tmf-clip'; box.setAttribute('data-clip', '')
        box.innerHTML = `<button type="button" class="cc-btn" data-clip-go title="A video of this playback that WhatsApp plays inline (MP4, H.264)">⤓ Download clip</button>
<label class="ak-sel"><span>Shape</span><select data-clip-shape>${SHAPES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>
<span class="tmf-clipst" data-clip-st aria-live="polite"></span>`
        bar.insertAdjacentElement('afterend', box)
        const go = box.querySelector('[data-clip-go]'), shape = box.querySelector('[data-clip-shape]'), st = box.querySelector('[data-clip-st]')
        let busy = null
        const say = (t, cancel) => { st.innerHTML = esc(t) + (cancel ? ' <button type="button" class="cc-btn" data-clip-cancel>Cancel</button>' : ''); const c = st.querySelector('[data-clip-cancel]'); if (c) c.onclick = () => busy && busy.abort() }
        go.onclick = async () => {
            if (busy) return
            const F = R.flow(), svg = host.querySelector('.tm-svg'); if (!F || !F.step || !svg) { say('Press Play back once, then try again.'); return }
            const sh = shape.value, can = await C.support(sh); if (!can.way) { say(can.why); return }
            const [start, end] = F.range(), fromMs = F.ms(start), toMs = F.ms(end), speed = F.rate() * 6e4
            const p = C.plan({ fromMs, toMs, speed, shape: sh })
            const toUse = mount.MAX_S && p.seconds > mount.MAX_S ? fromMs + mount.MAX_S * p.speed : toMs   // mount.MAX_S: the tests' short clip
            const light = doc.documentElement.getAttribute('data-theme') === 'light', bg = root.getComputedStyle(doc.documentElement).getPropertyValue('--rm-bg').trim() || (light ? '#fff' : '#07111F')
            const W = o.work && o.work(), V = W && W.view && W.view(), dt = 1 / C.FPS
            let clockMs = 0
            busy = new AbortController(); go.disabled = true; shape.disabled = true
            const back = F.at(); F.stop()
            if (W && W.clock) W.clock(() => clockMs)
            say((p.warning ? p.warning + '. ' : '') + 'Making the clip…', true)
            await inlineImages(svg)
            const draw = async (cx, i, t) => {
                clockMs = i * 1000 / C.FPS
                F.step(start + (t - fromMs) / 6e4, i ? dt : 1)        // the first frame settles the agents in their places
                if (V) V.step(clockMs)
                await paintFrame(cx, svg, cx.canvas.width, cx.canvas.height, bg, C)
            }
            const opts = { fromMs, toMs: toUse, speed: p.speed, shape: sh, light, draw, base: o.base, signal: busy.signal,
                onProgress: (d, n) => say(`${p.warning ? p.warning + '. ' : ''}Making the clip: ${Math.round(d / n * 100)}%`, true) }
            try {
                const out = can.way === 'webcodecs' ? await C.make(opts) : await C.record(opts)
                const how = await C.save(out.blob, out.name)
                say(how === 'shared' ? 'Shared.' : how === 'cancelled' ? 'Not shared.' : `Downloaded ${out.name} (${(out.bytes / 1e6).toFixed(1)} MB).${can.note ? ' ' + can.note : ''}`)
                mount.last = { name: out.name, bytes: out.bytes, way: can.way, frames: out.plan.frames }
            } catch (e) {
                say(busy.signal.aborted ? 'Cancelled.' : 'The clip could not be made: ' + (e && e.message || e))
            } finally {
                if (W && W.clock) W.clock(null)
                busy = null; go.disabled = false; shape.disabled = false
                const F2 = R.flow(); if (F2) F2.seek(back != null ? back : end)   // the map back where it was, on the screen's clock
            }
        }
        return { destroy: () => { if (busy) busy.abort(); box.remove() } }
    }
    root.AngeloClipButton = { mount, frameCss, SHAPES }
})(typeof self !== 'undefined' ? self : this)
