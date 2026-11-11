#!/usr/bin/env node
// prod-pipeline-a5: screenshots of the trace page mocks (closed, open, by agent) at 320, 390 and 1280 px, deviceScaleFactor 2,
// and how wide the open lanes are. kilo.large.worker@PrompTugal.angelo (design), 11 November 2026.  node shots-trace.cjs <out-dir>
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const out = process.argv[2], here = __dirname;
const MOCKS = ['a3-trace-wexio', 'trace-home', 'trace-home-rules', 'trace-all', 'trace-all-rules'];
const VP = [{ id: '320', w: 320, h: 640 }, { id: '390', w: 390, h: 844 }, { id: '1280', w: 1280, h: 800 }];
(async () => { const b = await chromium.launch(); const rows = [];
  for (const m of MOCKS) for (const v of VP) for (const st of ['', 'open', 'agent']) {
    if (m.startsWith('a3') && st === 'agent') continue;
    const ctx = await b.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 2, isMobile: v.w < 760, hasTouch: v.w < 1000 });
    const p = await ctx.newPage(); await p.goto('file://' + path.join(here, m + '.htm') + (st ? '#' + st : '')); await p.waitForTimeout(200);
    const r = await p.evaluate(() => { const g = document.querySelector('.grid'), sc = document.querySelector('.sc'), fp = document.querySelector('.fp');
      return { lanes: document.querySelectorAll('.grid .row').length, gridW: g.scrollWidth, boxW: sc.clientWidth, screensWide: +(g.scrollWidth / Math.max(1, sc.clientWidth)).toFixed(1), plotH: Math.round(fp.getBoundingClientRect().height), share: +(fp.getBoundingClientRect().height / innerHeight).toFixed(2), boxH: sc.clientHeight, gridH: g.scrollHeight }; });
    rows.push({ mock: m, view: st || 'closed', viewport: `${v.w}x${v.h}`, ...r });
    if (v.id !== '320' || st !== 'agent') { await p.evaluate(() => document.querySelector('.fp').scrollIntoView()); await p.screenshot({ path: path.join(out, `${m}-${st || 'closed'}-${v.id}.png`) }); }
    await ctx.close(); }
  await b.close();
  const L = ['| mock | view | viewport | lanes | lanes width (in box widths) | box share of screen | lanes height / box height |', '|---|---|---|---|---|---|---|'];
  for (const r of rows) L.push(`| ${r.mock} | ${r.view} | ${r.viewport} | ${r.lanes} | ${r.view === 'closed' ? '-' : r.screensWide} | ${r.share} | ${r.view === 'closed' ? '-' : r.gridH + ' / ' + r.boxH} |`);
  fs.writeFileSync(path.join(out, 'trace-widths.md'), L.join('\n') + '\n'); console.log(L.join('\n')); })();
