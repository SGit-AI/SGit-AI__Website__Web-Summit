// The replay's "Download clip" (backlog 0f3; spec: people/angelo/proposals/live-map/spec-work-view.md, part 2, approved by Angelo
// on 8 November). dev.work@PrompTugal.angelo. A video of exactly what replay shows, in the one format WhatsApp plays inline: an MP4
// with H.264 video (Main profile, level 4.0, yuv420p), even width and height, the moov box first (fast start), no audio, under
// about 15 MB. Encoded in the browser with WebCodecs and the vendored mp4-muxer (vendor/mp4-muxer-5.2.2/, MIT, loaded only when
// a clip is made). Never a WebM: where H.264 cannot be made, support() says so and nothing is made.
// Frames are drawn as fast as the machine can, on a clock stepped frame by frame (not recorded in real time), so a slow laptop
// makes the same clip, more slowly. This file holds the rules (sizes, caps, the caption, the file name) as pure functions, and
// the encoder; the button in replay waits on the work view landing (the same file runs in node for the tests' pure part).
(function (root, make) {
    const m = make(root)
    if (typeof module === 'object' && module.exports) module.exports = m
    else root.AngeloClip = m
})(typeof self !== 'undefined' ? self : this, function (root) {
    'use strict'
    const FPS = 30, MAX_S = 60, MAX_BYTES = 15e6, CODEC = 'avc1.4D0028'       // Main profile, level 4.0: 1080 x 1920 at 30 fps fits
    const SIZES = { square: [1080, 1080], tall: [1080, 1920], wide: [1920, 1080] }   // square is the default (Angelo's answer 5)
    const MUXER = 'vendor/mp4-muxer-5.2.2/mp4-muxer.js'
    const pad = n => String(n).padStart(2, '0')
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // what a selection becomes: replay's range played at its speed (replay milliseconds per real second); longer than a minute is
    // sped up to fit, with a warning naming the speed. The bitrate keeps the file under the cap, with a tenth to spare.
    function plan({ fromMs, toMs, speed, shape = 'square', fps = FPS } = {}) {
        const span = Math.max(0, toMs - fromMs), size = SIZES[shape] || SIZES.square
        let seconds = speed > 0 ? span / speed : MAX_S, sped = false
        if (seconds > MAX_S) { seconds = MAX_S; sped = true }
        seconds = Math.max(1, Math.round(seconds * fps) / fps)
        const frames = Math.round(seconds * fps)
        const bitrate = Math.min(6e6, Math.floor(MAX_BYTES * 8 * 0.9 / seconds))
        return { width: size[0], height: size[1], fps, frames, seconds, bitrate, msPerFrame: span / frames, speed: span / seconds,
            warning: sped ? `${spanWords(span)} in ${Math.round(seconds)} seconds` : '' }
    }
    function spanWords(ms) {
        const m = Math.round(ms / 6e4)
        if (m < 90) return `${m} minute${m === 1 ? '' : 's'}`
        const h = Math.round(m / 60); if (h < 48) return `${h} hours`
        return `${Math.round(h / 24)} days`
    }
    const stamp = ms => { const d = new Date(ms); return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}` }
    const fileName = (fromMs, toMs) => `team-and-the-machine-${stamp(fromMs)}-${stamp(toMs)}.mp4`
    // the caption at the bottom: the range in UTC and where it is from; no names, no subjects, no text from any commit
    function captionText(fromMs, toMs) {
        const a = new Date(fromMs), b = new Date(toMs), day = d => `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`, hm = d => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
        const range = day(a) === day(b) ? `${day(a)}, ${hm(a)} to ${hm(b)} UTC` : `${day(a)} ${hm(a)} to ${day(b)} ${hm(b)} UTC`
        return [range, 'web-summit.sgit.ai, Team and the machine']
    }
    function caption(cx, w, h, fromMs, toMs, light) {
        const [l1, l2] = captionText(fromMs, toMs), fs = Math.round(Math.min(w, h) / 40)
        cx.save(); cx.textAlign = 'center'; cx.textBaseline = 'alphabetic'
        cx.fillStyle = light ? 'rgba(7,17,31,0.78)' : 'rgba(255,255,255,0.82)'
        cx.font = `600 ${fs}px system-ui, -apple-system, "Segoe UI", sans-serif`; cx.fillText(l1, w / 2, h - fs * 2.6)
        cx.font = `400 ${Math.round(fs * 0.8)}px system-ui, -apple-system, "Segoe UI", sans-serif`; cx.fillText(l2, w / 2, h - fs * 1.2)
        cx.restore()
    }

    // can this browser make the clip? 'webcodecs' (Chrome, Edge, Safari 17 and later, on a secure page), or '' with the reason
    async function support(shape = 'square') {
        const [width, height] = SIZES[shape] || SIZES.square
        try {
            if (root.VideoEncoder && root.VideoFrame) {
                const r = await root.VideoEncoder.isConfigSupported({ codec: CODEC, width, height, bitrate: 2e6, framerate: FPS })
                if (r && r.supported) return { way: 'webcodecs' }
            }
        } catch { }
        // MediaRecorder's MP4 is fragmented and full range (checked 8 November): WhatsApp may take it as a file, so not offered yet
        return { way: '', why: 'This browser cannot make an H.264 video here; try Chrome, Edge or Safari 17 or later.' }
    }
    function loadMuxer(base) {
        if (root.Mp4Muxer) return Promise.resolve(root.Mp4Muxer)
        return new Promise((ok, no) => {
            const s = root.document.createElement('script'); s.src = new URL(MUXER, base || root.document.baseURI).href
            s.onload = () => root.Mp4Muxer ? ok(root.Mp4Muxer) : no(new Error('mp4-muxer did not load')); s.onerror = () => no(new Error('mp4-muxer did not load'))
            root.document.head.appendChild(s)
        })
    }

    // a frame's pixels (RGBA) as I420 in limited range, BT.709: a canvas handed to the encoder as it is comes out full range
    // (yuvj420p, checked 8 November), which phones may not play inline. Chroma is the mean of each 2 x 2 block.
    function i420(px, w, h, out) {
        const Y = out || new Uint8Array(w * h * 3 / 2), U = w * h, V = U + U / 4, cw = w / 2
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const k = (y * w + x) * 4; Y[y * w + x] = 16 + ((0.2126 * px[k] + 0.7152 * px[k + 1] + 0.0722 * px[k + 2]) * 219 / 255 + 0.5) | 0 }
        for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
            let r = 0, g = 0, b = 0; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const k = ((y + dy) * w + x + dx) * 4; r += px[k]; g += px[k + 1]; b += px[k + 2] }
            r /= 4; g /= 4; b /= 4; const l = 0.2126 * r + 0.7152 * g + 0.0722 * b, j = (y / 2) * cw + x / 2
            Y[U + j] = Math.max(16, Math.min(240, 128 + ((b - l) / 1.8556) * 224 / 255 + 0.5 | 0)); Y[V + j] = Math.max(16, Math.min(240, 128 + ((r - l) / 1.5748) * 224 / 255 + 0.5 | 0))
        }
        return Y
    }
    // make the clip: draw(cx, i, t) paints frame i (t = its replay time) on a width x height canvas, and may return a promise.
    // onProgress(done, total); signal (an AbortSignal) cancels. Resolves to { blob, name, bytes, chunks, keyframes }.
    async function make(o) {
        const p = plan(o), { width, height, fps, frames, bitrate } = p
        const M = o.Mp4Muxer || await loadMuxer(o.base)
        const cv = o.canvas || (root.OffscreenCanvas ? new root.OffscreenCanvas(width, height) : Object.assign(root.document.createElement('canvas'), { width, height }))
        cv.width = width; cv.height = height
        const cx = cv.getContext('2d', { alpha: false, willReadFrequently: true }), yuv = new Uint8Array(width * height * 3 / 2)
        const target = new M.ArrayBufferTarget()
        const muxer = new M.Muxer({ target, video: { codec: 'avc', width, height, frameRate: fps }, fastStart: 'in-memory', firstTimestampBehavior: 'offset' })
        let err = null, chunks = 0, keys = 0
        const enc = new root.VideoEncoder({ output: (c, meta) => { chunks++; if (c.type === 'key') keys++; muxer.addVideoChunk(c, meta) }, error: e => { err = e } })
        enc.configure({ codec: CODEC, width, height, bitrate, framerate: fps, avc: { format: 'avc' }, latencyMode: 'quality' })
        const us = 1e6 / fps
        try {
            for (let i = 0; i < frames; i++) {
                if (o.signal && o.signal.aborted) throw new Error('cancelled')
                if (err) throw err
                await o.draw(cx, i, o.fromMs + i * p.msPerFrame)
                if (o.caption !== false) caption(cx, width, height, o.fromMs, o.toMs, !!o.light)
                const f = new root.VideoFrame(i420(cx.getImageData(0, 0, width, height).data, width, height, yuv), { format: 'I420', codedWidth: width, codedHeight: height,
                    timestamp: Math.round(i * us), duration: Math.round(us), colorSpace: { primaries: 'bt709', transfer: 'bt709', matrix: 'bt709', fullRange: false } })
                enc.encode(f, { keyFrame: i % (fps * 2) === 0 }); f.close()
                while (enc.encodeQueueSize > 8) await new Promise(r => setTimeout(r, 4))
                if (o.onProgress && (i % 10 === 0 || i === frames - 1)) o.onProgress(i + 1, frames)
            }
            await enc.flush(); if (err) throw err
        } finally { if (enc.state !== 'closed') enc.close() }
        muxer.finalize()
        const blob = new root.Blob([target.buffer], { type: 'video/mp4' })
        return { blob, name: fileName(o.fromMs, o.toMs), bytes: blob.size, chunks, keyframes: keys, plan: p }
    }
    // hand the file over: the share sheet where it takes files (a phone: straight to WhatsApp), else a download
    async function save(blob, name) {
        const file = root.File ? new root.File([blob], name, { type: 'video/mp4' }) : null
        try { if (file && root.navigator.canShare && root.navigator.canShare({ files: [file] })) { await root.navigator.share({ files: [file] }); return 'shared' } } catch (e) { if (e && e.name === 'AbortError') return 'cancelled' }
        const a = root.document.createElement('a'), u = URL.createObjectURL(blob); a.href = u; a.download = name
        root.document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000); return 'downloaded'
    }
    // the graph as a picture for one frame (the way live.js's pop-out does it): an svg with its styles inlined, drawn as an image
    function svgImage(svg, css, w, h) {
        return new Promise((ok, no) => {
            const c = svg.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.setAttribute('width', w); c.setAttribute('height', h)
            if (css) { const st = root.document.createElementNS('http://www.w3.org/2000/svg', 'style'); st.textContent = css; c.insertBefore(st, c.firstChild) }
            const img = new root.Image(); img.onload = () => ok(img); img.onerror = () => no(new Error('frame did not draw'))
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new root.XMLSerializer().serializeToString(c))
        })
    }
    return { FPS, MAX_S, MAX_BYTES, CODEC, SIZES, MUXER, i420, plan, spanWords, fileName, captionText, caption, support, loadMuxer, make, save, svgImage }
})
