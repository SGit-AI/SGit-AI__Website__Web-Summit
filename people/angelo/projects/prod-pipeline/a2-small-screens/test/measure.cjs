#!/usr/bin/env node
// a2-small-screens: measure a flow diagram on small and portrait screens; exit 1 when a limit breaks.
// foxtrot.large.worker@PrompTugal.angelo (build, prod-pipeline A2), 11 November 2026. Read only: it opens pages, changes nothing.
//
//   node people/angelo/projects/prod-pipeline/a2-small-screens/test/measure.cjs [url-or-file] [--shots dir] [--json file] [--only strip|plot]
//
// Default target: the Tech Fringe's live trace page (the strip and the swim lanes). A local .htm or .html file works too
// (the prototypes in ../proto/). Uses the pre-installed Playwright; no other dependency.

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const DEFAULT = 'https://lisbontechfringe.com/traces/2026-11-11-ptw-classroom-deep-work-wexio/';
const VIEWPORTS = [
  { id: 'p320', w: 320, h: 640, what: 'small phone, portrait' },
  { id: 'p360', w: 360, h: 760, what: 'phone, portrait' },
  { id: 'p390', w: 390, h: 844, what: 'phone, portrait' },
  { id: 'p430', w: 430, h: 932, what: 'large phone, portrait' },
  { id: 'l740', w: 740, h: 360, what: 'phone, landscape' },
  { id: 't768', w: 768, h: 1024, what: 'tablet, portrait' },
  { id: 'd1280', w: 1280, h: 800, what: 'desktop' },
];
// The limits proposed in findings.md. share = the component's height as a share of the screen's height.
const LIMITS = {
  minText: 12,            // px, smallest rendered text inside the component
  minTap: 44,             // px, smallest side of a tap target (WCAG 2.5.5)
  pageScroll: false,      // no page-level horizontal scroll
  overlaps: 0,            // labels overlapping each other
  clipped: 0,             // labels cut off by their box
};
// Each component: where it lives and its share limit (the strip goes under every page; the plot is a page's subject).
const COMPONENTS = {
  strip: { sel: '.tstrip, [data-flow="strip"]', maxShare: 0.33, labels: '.ts-lab, .ts-t, .ts-who, [data-flow-label]' },
  plot:  { sel: '.tr-fig, [data-flow="plot"]', maxShare: 0.6, firstScreen: true, labels: '.tr-lab, .tr-chip, .tr-tick, .tr-gl, .tr-brk span, .tr-out span, [data-flow-label]' },
};

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const shots = opt('--shots'), jsonOut = opt('--json'), only = opt('--only');
const target = args[0] || DEFAULT;
const url = /^https?:/.test(target) ? target : 'file://' + path.resolve(target);

function inPage({ sel, labels, firstScreen }) {
  const el = document.querySelector(sel);
  if (!el) return null;
  const vw = window.innerWidth, vh = window.innerHeight;
  const vis = (e) => { const s = getComputedStyle(e), r = e.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && r.width > 0 && r.height > 0 && !e.closest('[hidden]'); };
  const r = el.getBoundingClientRect();
  const top = r.top + scrollY;
  // smallest text: every visible text node with letters
  let minText = Infinity, minTextWhat = '';
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    const p = n.parentElement; if (!p || !/\w/.test(n.textContent) || !vis(p)) continue;
    const fs = parseFloat(getComputedStyle(p).fontSize);
    if (fs < minText) { minText = fs; minTextWhat = n.textContent.trim().slice(0, 24); }
  }
  // tap targets
  let minTap = Infinity, minTapWhat = '', under44 = 0, under24 = 0, taps = 0;
  for (const a of el.querySelectorAll('a[href], button, summary, [role=button], input, select')) {
    if (!vis(a)) continue; const b = a.getBoundingClientRect(), m = Math.min(b.width, b.height); taps++;
    if (m < 44) under44++; if (m < 24) under24++;
    if (m < minTap) { minTap = m; minTapWhat = (a.getAttribute('aria-label') || a.textContent || a.className).trim().slice(0, 24); }
  }
  // labels: overlapping each other, or cut off by a clipping ancestor or their own box
  const labs = [...el.querySelectorAll(labels)].filter(vis).map((e) => ({ e, b: e.getBoundingClientRect() }));
  let overlaps = 0, clipped = 0; const bad = [];
  for (let i = 0; i < labs.length; i++) for (let j = i + 1; j < labs.length; j++) {
    const a = labs[i].b, c = labs[j].b;
    if (labs[i].e.contains(labs[j].e) || labs[j].e.contains(labs[i].e)) continue;
    const ix = Math.min(a.right, c.right) - Math.max(a.left, c.left), iy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
    if (ix > 1 && iy > 1) { overlaps++; if (bad.length < 4) bad.push(`overlap: "${labs[i].e.textContent.trim().slice(0, 14)}" / "${labs[j].e.textContent.trim().slice(0, 14)}"`); }
  }
  for (const { e, b } of labs) {
    let cut = e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible', scrolls = false;
    for (let p = e.parentElement; p && !cut; p = p.parentElement) {
      const s = getComputedStyle(p); if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
      if (/auto|scroll/.test(s.overflowX + s.overflowY)) { scrolls = true; break; }   // a scroller: the label is reachable, not cut
      const q = p.getBoundingClientRect(); if (b.left < q.left - 1 || b.right > q.right + 1 || b.top < q.top - 1 || b.bottom > q.bottom + 1) cut = true;
      if (p === el) break;
    }
    if (!scrolls && (b.right > vw + 1 || b.left < -1)) cut = true;
    if (cut) { clipped++; if (bad.length < 6) bad.push(`clipped: "${e.textContent.trim().slice(0, 18)}"`); }
  }
  // a scroll inside the component (allowed, reported)
  let innerScroll = false; for (const e of [el, ...el.querySelectorAll('*')]) { const s = getComputedStyle(e);
    if (/auto|scroll/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 1 && vis(e)) { innerScroll = true; break; } }
  const firstShare = Math.max(0, Math.min(vh, r.bottom + scrollY) - Math.max(0, top)) / vh;
  return {
    top: Math.round(top), height: Math.round(r.height), share: +(r.height / vh).toFixed(2), firstShare: +firstShare.toFixed(2),
    startsOnFirstScreen: top < vh, minText: minText === Infinity ? null : minText, minTextWhat,
    taps, minTap: minTap === Infinity ? null : +minTap.toFixed(1), minTapWhat, under44, under24,
    labels: labs.length, overlaps, clipped, bad, innerScroll,
    pageScroll: document.documentElement.scrollWidth > vw + 1,
  };
}

(async () => {
  const browser = await chromium.launch();
  const rows = []; let fails = 0;
  for (const v of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: shots ? 2 : 1, isMobile: v.w < 760, hasTouch: v.w < 1000 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(300);
    if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, `${v.id}-first-screen.png`) }); }
    for (const [id, c] of Object.entries(COMPONENTS)) {
      if (only && only !== id) continue;
      const m = await page.evaluate(inPage, c);
      if (!m) continue;
      const broke = [];
      if (m.share > c.maxShare) broke.push(`share ${m.share} > ${c.maxShare}`);
      if (c.firstScreen && !m.startsOnFirstScreen) broke.push('not on the first screen');
      if (m.minText !== null && m.minText < LIMITS.minText) broke.push(`text ${m.minText}px < ${LIMITS.minText}`);
      if (m.minTap !== null && m.minTap < LIMITS.minTap) broke.push(`tap ${m.minTap}px < ${LIMITS.minTap} (${m.under44}/${m.taps})`);
      if (m.pageScroll) broke.push('page scrolls sideways');
      if (m.overlaps > LIMITS.overlaps) broke.push(`${m.overlaps} overlaps`);
      if (m.clipped > LIMITS.clipped) broke.push(`${m.clipped} clipped`);
      fails += broke.length ? 1 : 0;
      rows.push({ viewport: `${v.w}x${v.h}`, what: v.what, component: id, ...m, broke });
      if (shots && v.w <= 430 || shots && v.id === 'd1280') {
        const h = await page.$(c.sel.split(',')[0].trim()) || await page.$(c.sel.split(',')[1].trim());
        if (h && (v.id === 'p320' || v.id === 'p390' || v.id === 'd1280')) await h.screenshot({ path: path.join(shots, `${v.id}-${id}.png`) }).catch(() => {});
      }
    }
    await ctx.close();
  }
  await browser.close();
  console.log(`a2 measure: ${url}`);
  console.log('| viewport | part | share | 1st screen | min text | min tap (<44) | overlaps | clipped | inner scroll | page scroll | result |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of rows) console.log(`| ${r.viewport} | ${r.component} | ${r.share} | ${r.firstShare} | ${r.minText ?? '-'} | ${r.minTap ?? '-'} (${r.under44}/${r.taps}) | ${r.overlaps} | ${r.clipped} | ${r.innerScroll ? 'yes' : 'no'} | ${r.pageScroll ? 'YES' : 'no'} | ${r.broke.length ? 'FAIL: ' + r.broke.join('; ') : 'ok'} |`);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(rows, null, 1) + '\n');
  console.log(fails ? `FAIL: ${fails} of ${rows.length} measurements break a limit` : `OK: ${rows.length} measurements within the limits`);
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error('a2 measure: could not run:', e.message); process.exit(2); });
