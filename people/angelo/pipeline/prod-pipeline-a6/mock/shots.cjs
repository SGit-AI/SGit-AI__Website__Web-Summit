#!/usr/bin/env node
// prod-pipeline-a6: screenshots of the v2 mocks (mock/strip.htm, mock/trace.htm) and of the v2 strip on two live Tech Fringe
// pages (in the browser only; nothing on the Fringe changes), plus A2's check on the live ones (inPage of measure.cjs, 91d6bff).
// lima.large.worker@PrompTugal.angelo (design), 11 November 2026.   node shots.cjs <measure.cjs> <out-dir>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [measureFile, out] = process.argv.slice(2), here = __dirname;
const src = fs.readFileSync(measureFile, 'utf8');
const inPage = eval('(' + src.slice(src.indexOf('function inPage'), src.indexOf('\n}\n', src.indexOf('function inPage')) + 2) + ')');
const css = fs.readFileSync(path.join(here, 'flow.css'), 'utf8');
const vars = css.match(/:root\{color-scheme:light dark;([\s\S]*?)\}\n@media/)[1];
const dark = css.match(/:root:not\(\[data-theme="light"\]\)\{([^}]*)\}/)[1];
const stripCss = `.fs{${vars}}@media (prefers-color-scheme:dark){.fs{${dark}}}.fs a:focus-visible{outline:3px solid var(--focus)}`
  + css.slice(css.indexOf('/* ---- the strip'), css.indexOf('/* ---- the trace page')) + css.slice(css.indexOf('/* ---- v2')) + '.fs{max-width:1100px;width:calc(100% - 32px);margin:20px auto}';
const SITE = 'https://lisbontechfringe.com';
const LIVE = [
  { id: 'district-909', url: SITE + '/e/2026-11-11-district-909-back-where-it-all-started/', hash: '#small' },
  { id: 'home', url: SITE + '/', hash: '#big', top: true },
  { id: 'home-running', url: SITE + '/', hash: '#running', top: true },
];
const VP = [{ w: 320, h: 640 }, { w: 360, h: 760 }, { w: 390, h: 844 }, { w: 430, h: 932 }, { w: 740, h: 360 }, { w: 768, h: 1024 }, { w: 1280, h: 800 }];
const SHOT = [390, 1280];
(async () => {
  const b = await chromium.launch(); fs.mkdirSync(out, { recursive: true });
  // the strip HTML of each form, as mock/strip.htm writes it
  const forms = {};
  { const p = await b.newPage(); for (const h of ['#small', '#big', '#running']) { await p.goto('file://' + path.join(here, 'strip.htm') + h); await p.reload();
      forms[h] = await p.evaluate(() => ({ strip: document.querySelector('.fs').outerHTML, top: document.getElementById('top').innerHTML })); } await p.close(); }
  // 1. the mocks themselves
  const MOCKS = [['strip.htm', '', 'strip-normal'], ['strip.htm', '#small', 'strip-small'], ['strip.htm', '#big', 'strip-big'], ['strip.htm', '#running', 'strip-running'],
    ['trace.htm', '#small-open', 'trace-small-open'], ['trace.htm', '#big-agent', 'trace-big-agent'], ['trace.htm', '#open', 'trace-normal-open'], ['trace.htm', '', 'trace-normal-closed']];
  for (const [f, h, id] of MOCKS) for (const w of SHOT) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 760 ? 844 : 800 }, deviceScaleFactor: 2, isMobile: w < 760, hasTouch: w < 1000, reducedMotion: 'reduce' });
    const p = await ctx.newPage(); await p.goto('file://' + path.join(here, f) + h); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(out, `${id}-${w}.png`) }); await ctx.close(); }
  // 2. the live pages with the v2 strip
  const rows = [];
  for (const L of LIVE) for (const v of VP) {
    const shoot = SHOT.includes(v.w) && v.h !== 360;
    const ctx = await b.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: shoot ? 2 : 1, isMobile: v.w < 760, hasTouch: v.w < 1000, reducedMotion: 'reduce' });
    const p = await ctx.newPage(); await p.goto(L.url, { waitUntil: 'load', timeout: 90000 }); await p.waitForTimeout(800);
    const hostH = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.evaluate(({ f, stripCss, top }) => {
      document.querySelectorAll('.tstrip').forEach((e) => { e.style.display = 'none'; });
      const s = document.createElement('style'); s.textContent = stripCss; document.head.append(s);
      const d = document.createElement('div'); d.innerHTML = f.strip; const sec = d.firstElementChild;
      const ft = document.querySelector('body > footer, footer'); ft ? ft.before(sec) : document.body.append(sec);
      if (top) { const t = document.createElement('p'); t.className = 'fs'; t.style.cssText = 'border:0;padding:0 16px;margin:0 auto;background:none'; t.innerHTML = f.top.replace('#fs-h', '#' + sec.getAttribute('aria-labelledby'));
        const m = document.querySelector('main') || document.body; m.prepend(t); }
    }, { f: forms[L.hash], stripCss, top: !!L.top });
    await p.waitForTimeout(150);
    const m = await p.evaluate(inPage, { sel: 'section[data-flow="strip"]', maxShare: 0.33, labels: '[data-flow-label], .fs-t' });
    const broke = []; if (m.share > 0.33) broke.push(`share ${m.share}`); if (m.minText < 12) broke.push(`text ${m.minText}px`);
    if (m.minTap < 44) broke.push(`tap ${m.minTap}px`); if (m.pageScroll) broke.push('page scrolls sideways'); if (m.overlaps) broke.push(`${m.overlaps} overlaps`); if (m.clipped) broke.push(`${m.clipped} clipped`);
    rows.push(`| ${L.id} | ${v.w}x${v.h} | ${(hostH / v.h).toFixed(1)} | ${m.share} | ${m.minText} | ${m.minTap} (${m.under44}/${m.taps}) | ${m.overlaps} | ${m.clipped} | ${m.pageScroll ? 'YES' : 'no'} | ${broke.length ? 'FAIL: ' + broke.join('; ') : 'ok'} |`);
    if (shoot) { await p.evaluate(() => { const r = document.querySelector('section[data-flow="strip"]').getBoundingClientRect(); window.scrollBy(0, r.bottom - innerHeight + 120); });
      await p.waitForTimeout(150); await p.screenshot({ path: path.join(out, `live-${L.id}-${v.w}.png`) });
      if (L.top && L.id === 'home') { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100); await p.screenshot({ path: path.join(out, `live-home-top-${v.w}.png`) }); } }
    await ctx.close(); }
  await b.close();
  const fails = rows.filter((r) => r.includes('FAIL')).length;
  const txt = ['A2 check (measure.cjs inPage, 91d6bff) on the v2 strip at the foot of live pages, ' + new Date().toISOString().slice(0, 16) + 'Z',
    '| page | viewport | page height (screens) | strip share | min text | min tap (<44) | overlaps | clipped | page scroll | result |', '|---|---|---|---|---|---|---|---|---|---|', ...rows,
    fails ? `FAIL: ${fails} of ${rows.length}` : `OK: ${rows.length} measurements within the limits`].join('\n') + '\n';
  fs.writeFileSync(path.join(out, 'measure-live.md'), txt); console.log(txt);
})().catch((e) => { console.error(e); process.exit(2); });
