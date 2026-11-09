const { chromium } = require('playwright')
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process')
const S = process.argv[2] || require('os').tmpdir(), BASE = 'http://127.0.0.1:8765/people/angelo/app/'
// clipbtn: the map's "⤓ Download clip" (backlog 0f3; clip-button.js, replay.js flow().step, work-replay.js clock()). On Team and
// the machine's playback, in Work: the button and its shape choice sit under the playback bar (square first); a clip of the window
// (cut to three seconds here: AngeloClipButton.mount.MAX_S) comes down as team-and-the-machine-<from>-<to>.mp4, and ffprobe
// reads H.264, yuv420p in limited range, even sides, 90 frames, moov before mdat, no audio; its picture is not blank and moves
// (the first and last frames differ); the map is handed back to the screen afterwards (Play back still runs). At 1280 px dark and
// 390 px light; the frames are saved beside the screenshots to be looked at.
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
const boxes = b => { const out = []; let i = 0; while (i + 8 <= b.length) { let n = b.readUInt32BE(i); const t = b.toString('latin1', i + 4, i + 8); if (n === 1) n = Number(b.readBigUInt64BE(i + 8)); out.push(t); if (n < 8) break; i += n } return out }
;(async () => {
  const b = await chromium.launch()
  for (const [w, h, scheme, shape] of [[1280, 900, 'dark', 'square'], [390, 844, 'light', 'tall']]) {
    const tag = `${w}-${scheme}`
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, serviceWorkers: 'block', acceptDownloads: true })
    await ctx.addInitScript(t => { try { localStorage.setItem('cc.theme', JSON.stringify(t)) } catch { } }, scheme)
    const p = await ctx.newPage(), errs = []
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|favicon|500|ERR_/.test(m.text())) errs.push(m.text()) })
    await p.goto(BASE + 'index.html#collab?map=1&r_work=1', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]')
    await p.waitForFunction(() => document.querySelectorAll('.tm-svg .wv-sq').length === 10 && document.querySelector('[data-clip-go]'), null, { timeout: 10000 }).catch(() => null)
    const ui = await p.evaluate(() => { const g = document.querySelector('[data-clip-go]'), s = document.querySelector('[data-clip-shape]'), bar = document.querySelector('[data-tmf]'); return g && { text: g.textContent, shapes: [...s.options].map(o => o.value), first: s.value, below: !!(bar.compareDocumentPosition(g) & 4), muxer: !!window.Mp4Muxer, over: document.documentElement.scrollWidth > innerWidth, gw: g.getBoundingClientRect().width } })
    if (!ui) { fail(`${tag}: no Download clip button on the playback`); await ctx.close(); continue }
    if (!/Download clip/.test(ui.text) || ui.shapes.join() !== 'square,tall,wide' || ui.first !== 'square' || !ui.below) fail(`${tag}: the button ${JSON.stringify(ui)}`)
    if (ui.muxer) fail(`${tag}: the muxer loaded before a clip was asked for`)
    if (ui.over) fail(`${tag}: the page scrolls sideways`)
    await p.locator('section.tm').screenshot({ path: `${S}/clipbtn-${tag}.png` })
    await p.evaluate(() => { window.AngeloClipButton.mount.MAX_S = 3 })
    await p.selectOption('[data-clip-shape]', shape)
    const dl = p.waitForEvent('download', { timeout: 120000 }).catch(() => null)
    await p.click('[data-clip-go]')
    const d = await dl
    if (!d) { fail(`${tag}: no download; status: ${await p.textContent('[data-clip-st]')}`); await ctx.close(); continue }
    const name = d.suggestedFilename(), f = path.join(S, `clipbtn-${tag}.mp4`); await d.saveAs(f)
    if (!/^team-and-the-machine-\d{8}-\d{4}-\d{8}-\d{4}\.mp4$/.test(name)) fail(`${tag}: file name ${name}`)
    const buf = fs.readFileSync(f), top = boxes(buf)
    const pr = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-count_frames', '-of', 'json', f], { encoding: 'utf8' }))
    const v = pr.streams.filter(s => s.codec_type === 'video')[0] || {}, audio = pr.streams.filter(s => s.codec_type === 'audio').length
    const want = { square: [1080, 1080], tall: [1080, 1920] }[shape]
    const got = { name, bytes: buf.length, top: top.join(' '), codec: v.codec_name, pix: v.pix_fmt, range: v.color_range, w: v.width, h: v.height, frames: +v.nb_read_frames, audio }
    console.log(tag, JSON.stringify(got))
    if (got.codec !== 'h264' || got.pix !== 'yuv420p' || got.range !== 'tv' || got.w !== want[0] || got.h !== want[1] || got.w % 2 || got.h % 2 || got.frames !== 90 || audio) fail(`${tag}: the file ${JSON.stringify(got)}`)
    if (top.indexOf('moov') < 0 || top.indexOf('moov') > top.indexOf('mdat')) fail(`${tag}: moov is not before mdat (${got.top})`)
    if (buf.length > 15e6) fail(`${tag}: over the size cap`)
    // the picture: not blank, and it moves
    const grab = (sec, out) => { execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(sec), '-i', f, '-frames:v', '1', out]); return execFileSync('ffmpeg', ['-v', 'error', '-ss', String(sec), '-i', f, '-frames:v', '1', '-vf', 'scale=64:64', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']) }
    const g1 = grab(0.1, path.join(S, `clipbtn-${tag}-first.png`)), g2 = grab(2.9, path.join(S, `clipbtn-${tag}-last.png`))
    let diff = 0, mean = 0, vari = 0; for (let i = 0; i < g1.length; i++) { diff += Math.abs(g1[i] - g2[i]); mean += g2[i] } mean /= g2.length; for (const x of g2) vari += (x - mean) ** 2
    const sd = Math.sqrt(vari / g2.length); if (sd < 6) fail(`${tag}: the picture looks blank (sd ${sd.toFixed(1)})`)
    if (diff / g1.length < 0.3) fail(`${tag}: the picture does not move (${(diff / g1.length).toFixed(2)})`)
    // handed back: the status says so, the controls are free, Play back runs on the screen's clock
    const after = await p.evaluate(() => ({ st: document.querySelector('[data-clip-st]').textContent, dis: document.querySelector('[data-clip-go]').disabled, muxer: !!window.Mp4Muxer }))
    if (!/Downloaded team-and-the-machine-/.test(after.st) || after.dis || !after.muxer) fail(`${tag}: after the clip ${JSON.stringify(after)}`)
    await p.$eval('[data-tmf-scrub]', s => { s.value = s.min; s.dispatchEvent(new Event('input')) })
    const v0 = +(await p.$eval('[data-tmf-scrub]', s => s.value)); await p.click('[data-tmf-play]'); await p.waitForTimeout(1500)
    const v1 = +(await p.$eval('[data-tmf-scrub]', s => s.value)); if (!(v1 > v0)) fail(`${tag}: Play back does not run after the clip (${v0} to ${v1})`)
    if (errs.length) fail(`${tag}: page errors ${errs.slice(0, 3).join(' | ')}`)
    await ctx.close()
  }
  await b.close()
  console.log(fails.length ? 'FAIL' : 'PASS')
  process.exit(fails.length ? 1 : 0)
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL'); process.exit(1) })
