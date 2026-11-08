const { chromium } = require('playwright'); const { execFileSync } = require('child_process'); const fs = require('fs'); const path = require('path')
const S = process.argv[2] || require('os').tmpdir(), BASE = 'http://127.0.0.1:8765/people/angelo/app/'
const C = require('../clip.js')
// the replay's "Download clip" (backlog 0f3, spec-work-view.md part 2), its encoder. Pure part: the sizes even, square by default; a
// selection longer than a minute sped up to fit with a warning naming the speed; the bitrate keeping a minute under 15 MB; the
// file name; the caption holding the range and the site only. In Chromium (served from 127.0.0.1: WebCodecs needs a secure
// page): a five-second square clip and a five-second 9:16 one made from a moving SVG graph, then checked with ffprobe, as
// WhatsApp needs it to play inline: h264, Main profile, yuv420p (limited range), even width and height, moov before mdat
// (fast start), no audio, 150 frames, decoding with no error, the picture changing; and its size scaled to a minute under the cap.
// The encoder does not depend on the page's width, so it runs once (1280 px); the button and the 390 px view come with replay.
// The fallback (MediaRecorder, for Safari before 17), forced in Chromium: its fragmented file rewritten as one fast-start MP4,
// samples unchanged, recorded in real time (120 to 160 frames for five seconds), Baseline or Main, full range allowed.
// What this cannot check: WhatsApp itself (Angelo sends one to himself on his iPhone: the proof that counts), and Safari.
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
// ---- the pure part
for (const [k, [w, h]] of Object.entries(C.SIZES)) if (w % 2 || h % 2) fail(`size ${k} is odd`)
const sq = C.plan({ fromMs: 0, toMs: 5 * 6e4, speed: 6e4 })
if (sq.width !== 1080 || sq.height !== 1080 || sq.frames !== 150 || sq.seconds !== 5 || sq.warning) fail('plan: five minutes at a minute a second ' + JSON.stringify(sq))
const long = C.plan({ fromMs: 0, toMs: 8 * 36e5, speed: 6e4, shape: 'tall' })
if (long.seconds !== 60 || long.frames !== 1800 || long.warning !== '8 hours in 60 seconds' || long.height !== 1920) fail('plan: eight hours sped up ' + JSON.stringify(long))
if (long.bitrate * 60 / 8 > C.MAX_BYTES * 0.9 + 1) fail('plan: a minute over the cap at ' + long.bitrate)
if (C.fileName(Date.UTC(2026, 10, 8, 14, 0), Date.UTC(2026, 10, 8, 16, 30)) !== 'team-and-the-machine-20261108-1400-20261108-1630.mp4') fail('file name')
const cap = C.captionText(Date.UTC(2026, 10, 8, 14, 0), Date.UTC(2026, 10, 8, 16, 30))
if (cap[0] !== '8 Nov, 14:00 to 16:30 UTC' || cap[1] !== 'web-summit.sgit.ai, Team and the machine' || cap.length !== 2) fail('caption ' + JSON.stringify(cap))
console.log('pure', fails.length ? 'FAIL' : 'ok', JSON.stringify({ sq: [sq.frames, sq.bitrate], long: [long.frames, long.bitrate, long.warning] }))
// ---- the MP4's top-level boxes, read directly
const boxes = b => { const out = []; let i = 0; while (i + 8 <= b.length) { let n = b.readUInt32BE(i); const t = b.toString('latin1', i + 4, i + 8); if (n === 1) n = Number(b.readBigUInt64BE(i + 8)); out.push(t); if (n < 8) break; i += n } return out }
const probe = f => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-count_frames', '-of', 'json', f], { encoding: 'utf8' }))
;(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
  await p.goto(BASE + 'tests/README.md'); await p.setContent('<!doctype html><title>clip</title><body></body>')
  await p.addScriptTag({ url: BASE + 'clip.js' })
  for (const [shape, way] of [['square', 'webcodecs'], ['tall', 'webcodecs'], ['square', 'mediarecorder']]) {
    const r = await p.evaluate(async ({ shape, way, base }) => {
      const C = window.AngeloClip, sup = await C.support(shape, way); if (sup.way !== way) return { sup }
      // a stand-in for the graph: an svg of moving dots and lines, drawn per frame as replay's frames will be
      const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1000 1000')
      const from = Date.UTC(2026, 10, 8, 14, 0), to = from + 5 * 6e4; let progress = 0
      const out = await C[way === 'webcodecs' ? 'make' : 'record']({ base, fromMs: from, toMs: to, speed: 6e4, shape, onProgress: (d) => { progress = d },
        draw: async (cx, i) => {
          svg.innerHTML = `<rect width="1000" height="1000" fill="#07111F"/><path d="M500 500 L${200 + i * 4} 300" stroke="#4ea1ff" stroke-width="4"/>` +
            [0, 1, 2, 3, 4, 5].map(k => `<circle cx="${500 + 300 * Math.cos(k + i / 20)}" cy="${500 + 300 * Math.sin(k + i / 20)}" r="24" fill="hsl(${k * 60},70%,60%)"/>`).join('')
          const img = await C.svgImage(svg, '', cx.canvas.width, cx.canvas.height); cx.drawImage(img, 0, 0, cx.canvas.width, cx.canvas.height) } })
      const buf = new Uint8Array(await out.blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000))
      return { sup, name: out.name, bytes: out.bytes, chunks: out.chunks, keyframes: out.keyframes, progress, b64: btoa(s) }
    }, { shape, way, base: BASE })
    const tag = way === 'webcodecs' ? shape : 'fallback'
    if (r.sup.way !== way) { fail(tag + ': not offered here: ' + JSON.stringify(r.sup)); continue }
    const f = path.join(S, `clip-${tag}.mp4`), buf = Buffer.from(r.b64, 'base64'); fs.writeFileSync(f, buf)
    const top = boxes(buf), pr = probe(f), v = pr.streams.filter(s => s.codec_type === 'video'), a = pr.streams.filter(s => s.codec_type === 'audio'), vs = v[0] || {}
    let decodeErr = ''; try { execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'null', '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) } catch (e) { decodeErr = String(e.stderr || e.message).slice(0, 200) }
    // the picture changes: the first and last frames, small, differ
    const grab = sec => execFileSync('ffmpeg', ['-v', 'error', '-ss', String(sec), '-i', f, '-frames:v', '1', '-vf', 'scale=32:32', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'])
    const g1 = grab(0), g2 = grab(4.5); let diff = 0; for (let i = 0; i < g1.length; i++) diff += Math.abs(g1[i] - g2[i])
    const want = C.SIZES[shape]
    const got = { name: r.name, bytes: r.bytes, perMinute: Math.round(r.bytes * 12), top: top.join(' '), codec: vs.codec_name, profile: vs.profile, pix: vs.pix_fmt, range: vs.color_range, w: vs.width, h: vs.height, frames: +vs.nb_read_frames, dur: +pr.format.duration, audio: a.length, keyframes: r.keyframes, diff, decodeErr }
    console.log(tag, JSON.stringify(got))
    const shape0 = shape; { const shape = tag
    // the fallback keeps the recorder's own samples: Baseline or Main, and full range (yuvj420p), said in the button's note
    if (way === 'webcodecs' && (v.length !== 1 || vs.codec_name !== 'h264' || vs.profile !== 'Main' || vs.pix_fmt !== 'yuv420p' || (vs.color_range && vs.color_range !== 'tv'))) fail(shape + ': not h264 Main yuv420p limited range')
    if (way !== 'webcodecs' && (v.length !== 1 || vs.codec_name !== 'h264' || !/Baseline|Main/.test(vs.profile) || !/^yuvj?420p$/.test(vs.pix_fmt))) fail(shape + ': not h264 Baseline or Main 4:2:0')
    if (vs.width !== want[0] || vs.height !== want[1] || vs.width % 2 || vs.height % 2) fail(shape + ': size')
    if (top[0] !== 'ftyp' || top.indexOf('moov') < 0 || top.indexOf('mdat') < 0 || top.indexOf('moov') > top.indexOf('mdat') || top.includes('moof')) fail(shape + ': not fast start: ' + top.join(' '))
    if (a.length) fail(shape + ': has audio')
    if (way === 'webcodecs' ? (got.frames !== 150 || Math.abs(got.dur - 5) > 0.1) : (got.frames < 120 || got.frames > 160 || Math.abs(got.dur - 5) > 0.5)) fail(shape + ': frames or length')
    if (r.progress !== 150) fail(shape + ': progress')
    if (r.bytes * 12 > C.MAX_BYTES) fail(shape + ': a minute would be over the cap')
    if (decodeErr) fail(shape + ': decode error ' + decodeErr)
    if (diff < 500) fail(shape + ': the picture does not change')
    if (!/^team-and-the-machine-20261108-1400-20261108-1405\.mp4$/.test(r.name)) fail(shape + ': name ' + r.name)
  } }
  if (errs.length) fail('page errors: ' + errs.join(' | '))
  await b.close(); console.log(fails.length ? 'FAIL' : 'PASS')
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL') })
