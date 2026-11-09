// Backlog 0c3 (6), Angelo, 8 November: "The timeline in the team and the machine page should be independently collapsed, so that
// it doesn't load a huge amount of data for nothing." The timeline is closed by default, on its own (the map open or closed makes
// no difference), and remembered on this device; the commits since 2 November are out of data.json (replay-events.json), fetched
// only when the map or the timeline is opened; closing it drops its filters from the address; an old #replay link still opens it.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp }), p = await ctx.newPage(), errs = [], ev = []; p.on('pageerror', e => errs.push(e.message))
  p.on('request', r => { if (/replay-events\.json/.test(r.url())) ev.push(r.url()) })
  const tl = () => p.evaluate(() => ({ btn: (document.querySelector('[data-ak-tl-toggle]') || {}).textContent || '', exp: (document.querySelector('[data-ak-tl-toggle]') || { getAttribute: () => '' }).getAttribute('aria-expanded'), svg: !!document.querySelector('.rp-embed .rp-svg'), dots: document.querySelectorAll('.rp-embed .rp-e').length, play: !!document.querySelector('[data-tmf-play]'), hash: location.hash, overflow: document.documentElement.scrollWidth - innerWidth }))
  // 1. the page as it opens: map and timeline closed; data.json without the commits, and they are not fetched
  await p.goto(U + '#collab', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-ak-tl-toggle]', { timeout: 8000 }).catch(() => fail('no timeline toggle'))
  const dj = await p.evaluate(async () => { const t = await (await fetch('data.json')).text(); return { len: t.length, events: 'events' in (JSON.parse(t).replay || {}) } })
  const a = await tl()
  if (dj.events) fail('data.json still holds replay.events')
  if (a.exp !== 'false' || a.svg || ev.length) fail('closed at first: ' + JSON.stringify({ ...a, fetched: ev.length }))
  // 2. opened with the map closed: the commits fetched once, the timeline drawn
  await p.click('[data-ak-tl-toggle]'); await p.waitForSelector('.rp-embed .rp-svg', { timeout: 8000 }).catch(() => fail('timeline did not open'))
  const b2 = await tl(); await p.screenshot({ path: `${S}/tmtlc-open-${n}.png`, fullPage: true })
  if (b2.exp !== 'true' || b2.dots < 3 || ev.length !== 1 || b2.play || b2.overflow > 1) fail('opened: ' + JSON.stringify({ ...b2, fetched: ev.length }))
  // 3. remembered on this device; the map opened beside it plays, and the commits are not fetched again
  await p.goto(U + '#collab?map=1', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]', { timeout: 8000 }).catch(() => fail('no playback'))
  await p.waitForSelector('.rp-embed .rp-svg', { timeout: 8000 }).catch(() => fail('not remembered open'))
  const c = await tl()
  if (!c.svg || !c.play) fail('remembered: ' + JSON.stringify(c))
  // a filter on the timeline, then closed: the filter leaves the address, and it stays closed after a reload; the map still plays
  await p.evaluate(() => { history.replaceState(null, '', location.pathname + '#collab?map=1&r_p=angelo') }); await p.click('[data-ak-tl-toggle]'); await p.waitForTimeout(200)
  const d = await tl()
  if (d.svg || /r_|tl=/.test(d.hash) || !d.hash.includes('map=1') || !d.play) fail('closed: ' + JSON.stringify(d))
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]', { timeout: 8000 }).catch(() => fail('no playback after reload'))
  const e = await tl(); await p.screenshot({ path: `${S}/tmtlc-closed-${n}.png`, fullPage: true })
  if (e.svg || e.exp !== 'false') fail('closed after reload: ' + JSON.stringify(e))
  // 4. an old Replay link opens it, whatever this device remembers
  await p.goto(U + '#replay?w=72h', { waitUntil: 'networkidle' }); await p.waitForSelector('.rp-embed .rp-svg', { timeout: 8000 }).catch(() => fail('#replay did not open the timeline'))
  console.log(n, JSON.stringify({ dataJson: dj.len, a, b: b2, c, d, e, fetched: ev.length }), errs)
  if (errs.length) fail('errors ' + errs.join(' | ')); await ctx.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
