// spec-live-map.md piece 3: the newsroom's key events and security@PrompTugal.dinis's comms ledger, read by
// people/angelo/tools/promptugal-snapshot.mjs into promptugal.json and folded into data.json's replay.live. Data: the newsroom's
// agents' key events join keys; comms holds [minute, from, to, message|session|sealed] and nothing else (no text, no size). Map: a
// ledger message leaves its sender as a pulse in the sender's colour; a signed inbox message is a lock dot linked to the ledger.
// At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
const LEDGER = 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/security/comms/comms.json';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 const pt = require('../promptugal.json');
 const snapBad = ((pt.comms || {}).rows || []).filter(r => r.length !== 4 || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:00Z$/.test(r[0]) || !/^(message|session|sealed)$/.test(r[3]))
 if (!pt.comms || !pt.comms.rows.length || snapBad.length) fail(`snapshot comms: ${pt.comms ? pt.comms.rows.length : 'none'}, malformed ${JSON.stringify(snapBad.slice(0, 2))}`)
 if (!(pt.keys || []).some(k => k[1].startsWith('pt:'))) fail('snapshot: no newsroom key events')
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['light', 'dark']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U + '#replay?w=all', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg [data-tm-f]', { timeout: 8000 }).catch(() => fail('no map'))
  const seek = v => p.evaluate(v => { const r = document.querySelector('[data-tmf-scrub]'); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })) }, v)
  const L = await p.evaluate(async () => (await (await fetch('data.json')).json()).replay.live)
  const ptKeys = L.keys.filter(k => k[1].startsWith('pt:')).length, bad = (L.comms || []).filter(r => r.length !== 4 || typeof r[0] !== 'number')
  if (!(ptKeys >= 5) || !(L.comms || []).length || bad.length) fail(`${n} ${scheme}: data pt keys ${ptKeys}, comms ${(L.comms || []).length}, malformed ${bad.length}`)
  // a newsroom agent carries a key mark at the end of the window
  await seek(await p.evaluate(() => document.querySelector('[data-tmf-scrub]').max)); await p.waitForTimeout(400)
  const ptMarks = await p.evaluate(() => [...document.querySelectorAll('.tm-a.tmf-key[data-tm-f^="pt:"]')].length)
  // a ledger message: just after it, a pulse sits at its sender, in the sender's colour
  let pulse = null
  for (const [t, f, to] of L.comms.filter(r => r[3] !== 'sealed').slice(0, 15)) {
    await seek(t + 1); await p.waitForTimeout(350)
    // an agent not on the map is drawn at its person, as the map's nodeOf does
    pulse = await p.evaluate(([f, to]) => { const node = x => document.querySelector(`[data-tm-f="${CSS.escape(x)}"]`) || document.querySelector(`.tm-p[data-tm-f="${CSS.escape((x.match(/^pt:([^:]+):/) || x.match(/\.([a-z0-9-]+)$/) || [])[1] || '')}"]`)
      const g = node(f), h = node(to); if (!g || !h || g === h || g.classList.contains('tmf-gone') || h.classList.contains('tmf-gone')) return null
      const d = g.querySelector('circle:not(.tm-kr), rect').getBoundingClientRect(), cx = d.x + d.width / 2, cy = d.y + d.height / 2, col = getComputedStyle(g.querySelector('circle:not(.tm-kr), rect')).fill
      const near = [...document.querySelectorAll('.tmf-pulses circle:not(.z)')].map(c => { const r = c.getBoundingClientRect(); return { dd: Math.hypot(r.x + r.width / 2 - cx, r.y + r.height / 2 - cy), fill: getComputedStyle(c).fill } }).sort((a, b) => a.dd - b.dd)[0]
      return near ? { ...near, col } : { none: true } }, [f, to])
    if (pulse && !pulse.none && pulse.dd < 25) break
  }
  // a signed inbox message from the ledger: a lock dot linked to the ledger
  let lock = null
  for (const [t] of L.comms.filter(r => r[3] === 'sealed').slice(0, 10)) {
    await seek(t + 5); await p.waitForTimeout(300)
    lock = await p.evaluate(u => { const a = [...document.querySelectorAll('.tmf-msgs a:not(.z)')].find(a => a.getAttribute('href') === u); return a ? { title: a.querySelector('title').textContent, fill: getComputedStyle(a.querySelector('circle')).fill } : null }, LEDGER)
    if (lock) break
  }
  if (lock || pulse) await p.locator('.tm-svg').screenshot({ path: `${S}/lvnews-${n}-${scheme}.png` })
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(n, scheme, JSON.stringify({ ptKeys, comms: L.comms.length, ptMarks, pulse, lock, ov }), errs)
  if (!(ptMarks >= 3)) fail(`${n} ${scheme}: ${ptMarks} newsroom agents with a key mark`)
  if (!pulse || pulse.none || !(pulse.dd < 25) || pulse.fill !== pulse.col) fail(`${n} ${scheme}: no ledger message leaving its sender ${JSON.stringify(pulse)}`)
  if (L.comms.some(r => r[3] === 'sealed') && (!lock || lock.title !== 'a sealed message sent' || lock.fill === 'none')) fail(`${n} ${scheme}: the ledger's lock dot ${JSON.stringify(lock)}`)
  if (ov > 1 || errs.length) fail(`${n} ${scheme}: overflow ${ov} errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
