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

    // can this browser make the clip? 'webcodecs' (Chrome, Edge, Safari 17 and later, on a secure page), else 'mediarecorder' (the
    // fallback below, with a note for the button), or '' with the reason. force = 'mediarecorder' tries the fallback (the tests).
    async function support(shape = 'square', force) {
        const [width, height] = SIZES[shape] || SIZES.square
        try {
            if (root.VideoEncoder && root.VideoFrame && force !== 'mediarecorder') {
                const r = await root.VideoEncoder.isConfigSupported({ codec: CODEC, width, height, bitrate: 2e6, framerate: FPS })
                if (r && r.supported) return { way: 'webcodecs' }
            }
        } catch { }
        if (recType() && root.HTMLCanvasElement && root.HTMLCanvasElement.prototype.captureStream) return { way: 'mediarecorder', note: 'Made in real time by this browser\'s recorder: keep this tab in front until it is done. Colours may look a little flat.' }
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
    // ---- the fallback, where WebCodecs is missing (Safari before 17): MediaRecorder's own H.264 MP4. It comes out fragmented (moof
    // and mdat pairs, no fast start: WhatsApp may take it as a file), so defrag() reads its samples and the muxer writes them again
    // as one fast-start file, unchanged (no re-encoding). It records in real time, so a slow machine drops frames; and it stays full
    // range (yuvj420p): the samples are not touched, and flagging them limited would shift the colours. Both are said in the button.
    const recType = () => { try { const R = root.MediaRecorder; for (const t of ['video/mp4;codecs=avc1.4D0028', 'video/mp4;codecs=avc1', 'video/mp4']) if (R && R.isTypeSupported(t)) return t } catch { } return '' }
    function boxes(b, from, to) {
        const out = []; let i = from
        while (i + 8 <= to) {
            let n = b.getUint32(i), h = 8; const t = String.fromCharCode(b.getUint8(i + 4), b.getUint8(i + 5), b.getUint8(i + 6), b.getUint8(i + 7))
            if (n === 1) { n = b.getUint32(i + 8) * 2 ** 32 + b.getUint32(i + 12); h = 16 } else if (n === 0) n = to - i
            if (n < h || i + n > to) break
            out.push({ t, at: i, body: i + h, end: i + n }); i += n
        }
        return out
    }
    const kid = (b, x, t) => boxes(b, x.body, x.end).find(y => y.t === t)
    const path = (b, x, ...ts) => { for (const t of ts) { x = x && kid(b, x, t); if (!x) return null } return x }
    // a fragmented MP4's video samples: { width, height, codec, avcC, timescale, samples: [{ data, key, t, d, cto }] } (times in the track's units)
    function defrag(buf) {
        const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf), b = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), top = boxes(b, 0, u8.length)
        const moov = top.find(x => x.t === 'moov'); if (!moov) throw new Error('no moov')
        const trak = boxes(b, moov.body, moov.end).find(x => x.t === 'trak' && path(b, x, 'mdia', 'hdlr') && String.fromCharCode(...u8.subarray(path(b, x, 'mdia', 'hdlr').body + 8, path(b, x, 'mdia', 'hdlr').body + 12)) === 'vide')
        if (!trak) throw new Error('no video track')
        const tkhd = kid(b, trak, 'tkhd'), trackId = b.getUint32(tkhd.body + (u8[tkhd.body] === 1 ? 20 : 12))
        const mdhd = path(b, trak, 'mdia', 'mdhd'), timescale = b.getUint32(mdhd.body + (u8[mdhd.body] === 1 ? 20 : 12))
        const stsd = path(b, trak, 'mdia', 'minf', 'stbl', 'stsd'), avc1 = boxes(b, stsd.body + 8, stsd.end)[0]
        if (!avc1 || !/^avc[13]$/.test(avc1.t)) throw new Error('not H.264')
        const width = b.getUint16(avc1.body + 24), height = b.getUint16(avc1.body + 26)
        const avcCb = boxes(b, avc1.body + 78, avc1.end).find(x => x.t === 'avcC'); if (!avcCb) throw new Error('no avcC')
        const avcC = u8.slice(avcCb.body, avcCb.end), codec = 'avc1.' + [1, 2, 3].map(i => avcC[i].toString(16).padStart(2, '0')).join('').toUpperCase()
        const trex = (() => { const mvex = kid(b, moov, 'mvex'); return mvex && boxes(b, mvex.body, mvex.end).find(x => x.t === 'trex' && b.getUint32(x.body + 4) === trackId) })()
        const dflt = trex ? { d: b.getUint32(trex.body + 12), s: b.getUint32(trex.body + 16), f: b.getUint32(trex.body + 20) } : { d: 0, s: 0, f: 0 }
        const samples = []; let next = 0
        for (const moof of top.filter(x => x.t === 'moof')) for (const traf of boxes(b, moof.body, moof.end).filter(x => x.t === 'traf')) {
            const tfhd = kid(b, traf, 'tfhd'), tf = b.getUint32(tfhd.body) & 0xffffff; if (b.getUint32(tfhd.body + 4) !== trackId) continue
            let o = tfhd.body + 8, base = moof.at; const d = { ...dflt }
            if (tf & 1) { base = b.getUint32(o) * 2 ** 32 + b.getUint32(o + 4); o += 8 }
            if (tf & 2) o += 4
            if (tf & 8) { d.d = b.getUint32(o); o += 4 }
            if (tf & 0x10) { d.s = b.getUint32(o); o += 4 }
            if (tf & 0x20) { d.f = b.getUint32(o); o += 4 }
            const tfdt = kid(b, traf, 'tfdt'); let t = tfdt ? (u8[tfdt.body] === 1 ? b.getUint32(tfdt.body + 4) * 2 ** 32 + b.getUint32(tfdt.body + 8) : b.getUint32(tfdt.body + 4)) : next
            for (const trun of boxes(b, traf.body, traf.end).filter(x => x.t === 'trun')) {
                const rf = b.getUint32(trun.body) & 0xffffff, v1 = u8[trun.body] === 1, n = b.getUint32(trun.body + 4); let q = trun.body + 8, pos = base
                if (rf & 1) { pos = base + b.getInt32(q); q += 4 }
                let first = null; if (rf & 4) { first = b.getUint32(q); q += 4 }
                for (let i = 0; i < n; i++) {
                    let dur = d.d, size = d.s, fl = i === 0 && first !== null ? first : d.f, cto = 0
                    if (rf & 0x100) { dur = b.getUint32(q); q += 4 }
                    if (rf & 0x200) { size = b.getUint32(q); q += 4 }
                    if (rf & 0x400) { fl = b.getUint32(q); q += 4; if (i === 0 && first !== null) fl = first }
                    if (rf & 0x800) { cto = v1 ? b.getInt32(q) : b.getUint32(q); q += 4 }
                    if (pos + size > u8.length) throw new Error('a sample runs past the file')
                    samples.push({ data: u8.slice(pos, pos + size), key: !(fl & 0x10000), t, d: dur, cto }); pos += size; t += dur
                }
            }
            next = t
        }
        if (!samples.length) throw new Error('no samples')
        return { width, height, codec, avcC, timescale, samples }
    }
    // the samples written again as one fast-start MP4, unchanged
    function refrag(buf, M) {
        const v = defrag(buf), target = new M.ArrayBufferTarget(), us = x => Math.round(x * 1e6 / v.timescale)
        const muxer = new M.Muxer({ target, video: { codec: 'avc', width: v.width, height: v.height }, fastStart: 'in-memory', firstTimestampBehavior: 'offset' })
        const t0 = v.samples[0].t; let first = true
        for (const s of v.samples) {
            muxer.addVideoChunkRaw(s.data, s.key ? 'key' : 'delta', us(s.t - t0), us(s.d), first ? { decoderConfig: { codec: v.codec, codedWidth: v.width, codedHeight: v.height, description: v.avcC } } : undefined, s.cto ? us(s.cto) : undefined)
            first = false
        }
        muxer.finalize(); return { buffer: target.buffer, frames: v.samples.length, codec: v.codec }
    }
    // the fallback's maker: the same frames, drawn in real time on a canvas MediaRecorder records, then refrag()
    async function record(o) {
        const p = plan(o), { width, height, fps, frames } = p, type = recType(); if (!type) throw new Error('no H.264 recorder')
        const M = o.Mp4Muxer || await loadMuxer(o.base)
        const cv = o.canvas || Object.assign(root.document.createElement('canvas'), { width, height }); cv.width = width; cv.height = height
        const cx = cv.getContext('2d', { alpha: false }), stream = cv.captureStream(fps), parts = []
        const rec = new root.MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: p.bitrate })
        rec.ondataavailable = e => { if (e.data && e.data.size) parts.push(e.data) }
        const done = new Promise(ok => { rec.onstop = ok })
        const paint = async i => { await o.draw(cx, i, o.fromMs + i * p.msPerFrame); if (o.caption !== false) caption(cx, width, height, o.fromMs, o.toMs, !!o.light) }
        await paint(0); rec.start(1000); const t0 = performance.now()
        try {
            for (let i = 1; i < frames; i++) {
                if (o.signal && o.signal.aborted) throw new Error('cancelled')
                const wait = t0 + i * 1000 / fps - performance.now(); if (wait > 0) await new Promise(r => setTimeout(r, wait))
                await paint(i); if (o.onProgress && (i % 10 === 0 || i === frames - 1)) o.onProgress(i + 1, frames)
            }
            await new Promise(r => setTimeout(r, 1000 / fps))
        } finally { rec.stop(); for (const t of stream.getTracks()) t.stop(); await done }
        const raw = new Uint8Array(await new root.Blob(parts).arrayBuffer()), out = refrag(raw, M)
        const blob = new root.Blob([out.buffer], { type: 'video/mp4' })
        return { blob, name: fileName(o.fromMs, o.toMs), bytes: blob.size, chunks: out.frames, keyframes: null, plan: p, way: 'mediarecorder', recorded: type }
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
    return { FPS, MAX_S, MAX_BYTES, CODEC, SIZES, MUXER, i420, plan, spanWords, fileName, captionText, caption, support, loadMuxer, make, record, defrag, refrag, recType, save, svgImage }
})
