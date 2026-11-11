#!/usr/bin/env node
// prod-pipeline-a5: open big live Tech Fringe pages, put A3's strip at their foot (in the browser only), measure it with
// A2's check (the inPage function of measure.cjs at 91d6bff, passed in as a file) and take screenshots.
// kilo.large.worker@PrompTugal.angelo (design), 11 November 2026. Read only: it opens public pages and changes nothing there.
//   node sim.cjs <measure.cjs> <a3-strip.htm> <out-dir>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [measureFile, a3Strip, out] = process.argv.slice(2);
const here = __dirname;
// A2's measurement, unchanged: the in-page function from measure.cjs
const src = fs.readFileSync(measureFile, 'utf8');
const inPage = eval('(' + src.slice(src.indexOf('function inPage'), src.indexOf('\n}\n', src.indexOf('function inPage')) + 2) + ')');
// A3's CSS for the strip only, its tokens scoped to the strip so the host page keeps its own
const css = fs.readFileSync(path.join(here, 'flow.css'), 'utf8');
const vars = css.match(/:root\{color-scheme:light dark;([\s\S]*?)\}\n@media/)[1];
const dark = css.match(/:root:not\(\[data-theme="light"\]\)\{([^}]*)\}/)[1];
const stripCss = `.fs{${vars}}@media (prefers-color-scheme:dark){.fs{${dark}}}.fs *{box-sizing:border-box}.fs a:focus-visible{outline:3px solid var(--focus)}`
  + css.slice(css.indexOf('/* ---- the strip'), css.indexOf('/* ---- the trace page')) + '.fs{max-width:1100px;margin:20px auto;font:16px/1.5 var(--sans);color:var(--ink)}.fs ol{margin:0}';
const a3 = fs.readFileSync(a3Strip, 'utf8'); const a3html = a3.slice(a3.indexOf('<section class="fs"'), a3.indexOf('</section>') + 10);
const S = (id) => JSON.parse(fs.readFileSync(path.join(here, `strip-${id}.json`), 'utf8'));
const SITE = 'https://lisbontechfringe.com';
const PAGES = [
  { id: 'home', url: SITE + '/', variants: { asis: S('home').asis, rules: S('home').rules, running: S('home').running }, land: true },
  { id: 'programme', url: SITE + '/programme/', variants: { asis: S('programme').asis, rules: S('programme').rules } },
  { id: 'graph', url: SITE + '/graph/', variants: { asis: S('graph').asis, rules: S('graph').rules } },
  { id: 'wexio', url: SITE + '/e/2026-11-11-ptw-classroom-deep-work-wexio/', variants: { asis: a3html } },
];
const VP = [{ id: '320', w: 320, h: 640 }, { id: '390', w: 390, h: 844 }, { id: '1280', w: 1280, h: 800 }, { id: '740x360', w: 740, h: 360, only: 'home' }];
const COMP = { sel: '[data-flow="strip"]', maxShare: 0.33, labels: '[data-flow-label], .fs-t' };

(async () => {
  const browser = await chromium.launch(); const rows = [];
  fs.mkdirSync(out, { recursive: true });
  for (const p of PAGES) for (const v of VP) {
    if (v.only && v.only !== p.id) continue;
    for (const dsf of [1, 2]) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: dsf, isMobile: v.w < 760, hasTouch: v.w < 1000 });
      const page = await ctx.newPage();
      const t0 = Date.now(); await page.goto(p.url, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(800);
      const host = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, title: document.title, oldStrip: !!document.querySelector('.tstrip'), footer: !!document.querySelector('footer') }));
      for (const [k, html] of Object.entries(p.variants)) {
        if (dsf === 2 && !(v.id === '390' || v.id === '1280' || (v.id === '320' && k === 'rules') || v.id === '740x360')) continue;
        await page.evaluate(({ html, stripCss }) => {
          document.querySelectorAll('[data-flow="strip"],#a5css').forEach((e) => e.remove());
          document.querySelectorAll('.tstrip').forEach((e) => { e.style.display = 'none'; });   // A3 replaces the Fringe's strip
          const st = document.createElement('style'); st.id = 'a5css'; st.textContent = stripCss; document.head.append(st);
          const d = document.createElement('div'); d.innerHTML = html; const sec = d.firstElementChild;
          const f = document.querySelector('body > footer, footer'); f ? f.before(sec) : document.body.append(sec);
        }, { html, stripCss });
        await page.waitForTimeout(150);
        if (dsf === 1) {
          const m = await page.evaluate(inPage, COMP);
          const broke = [];
          if (m.share > 0.33) broke.push(`share ${m.share}`); if (m.minText < 12) broke.push(`text ${m.minText}px`);
          if (m.minTap < 44) broke.push(`tap ${m.minTap}px`); if (m.pageScroll) broke.push('page scrolls sideways');
          if (m.overlaps) broke.push(`${m.overlaps} overlaps`); if (m.clipped) broke.push(`${m.clipped} clipped`);
          rows.push({ page: p.id, variant: k, viewport: `${v.w}x${v.h}`, screens: +(host.h / v.h).toFixed(1), pageHeight: host.h, ...m, broke, load_ms: Date.now() - t0 });
        } else {
          const el = await page.$('[data-flow="strip"]'); await el.scrollIntoViewIfNeeded();
          await page.evaluate(() => { const r = document.querySelector('[data-flow="strip"]').getBoundingClientRect(); window.scrollBy(0, r.bottom - innerHeight + 120); });
          await page.waitForTimeout(150);
          await page.screenshot({ path: path.join(out, `${p.id}-${k}-${v.id}.png`) });
        }
      }
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'measure-live.json'), JSON.stringify(rows, null, 1) + '\n');
  const lines = ['| page | strip | viewport | page height (screens) | strip share | min text | min tap (<44) | overlaps | clipped | page scroll | result |', '|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of rows) lines.push(`| ${r.page} | ${r.variant} | ${r.viewport} | ${r.screens} | ${r.share} | ${r.minText} | ${r.minTap} (${r.under44}/${r.taps}) | ${r.overlaps} | ${r.clipped} | ${r.pageScroll ? 'YES' : 'no'} | ${r.broke.length ? 'FAIL: ' + r.broke.join('; ') : 'ok'} |`);
  fs.writeFileSync(path.join(out, 'measure-live.md'), lines.join('\n') + '\n'); console.log(lines.join('\n'));
})().catch((e) => { console.error(e); process.exit(2); });
