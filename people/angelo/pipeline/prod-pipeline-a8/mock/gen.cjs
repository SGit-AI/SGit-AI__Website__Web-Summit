// prod-pipeline-a8 (golf.large.worker@PrompTugal.angelo): the little timeline, three options, from ../data/timeline.json
// (the Fringe's public release feed). Writes one fragment per variant here, injects each before </main> of a saved copy of the
// live event page (the copies stay in the scratch dir, never committed) and screenshots it at 320, 390 and 1280 px.
//   node gen.cjs <scratch dir holding live/d909.html and live/swyb.html> [--no-shots]
const fs = require('fs'), path = require('path');
const A = path.resolve(__dirname, '..'), S = process.argv[2], noShots = process.argv.includes('--no-shots');
const T = JSON.parse(fs.readFileSync(`${A}/data/timeline.json`, 'utf8'));
const css = fs.readFileSync(`${__dirname}/timeline.css`, 'utf8');
const hm = (t) => t.slice(11, 16), v = (s) => s.replace('v0.1.', 'v.');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const say = { added: 'added', changed: 'changed', rechecked: 're-checked', removed: 'removed' };
const what = (m) => m.kind === 'changed' && m.fields.length ? m.fields.join(', ').replace('ical_uid', 'calendar id').replace('read_at', 'read time') : say[m.kind];

// The kept file (the fix, simulated): DISTRICT 909's two steps as the feed would hold them if nothing fell off. The add and its
// version are from the Fringe's git (b096ccb, A7's live_in v0.1.422); v0.1.501 is in today's feed, with read_at listed, not skipped.
const KEPT = { ...T.pages['district-909'], marks: [
  { version: 'v0.1.422', t: '2026-11-11T17:50:43Z', kind: 'added', fields: [], url: 'https://lisbontechfringe.com/changes/v0.1.422/' },
  { ...T.pages['district-909'].marks[0], kind: 'changed', fields: ['read_at'] }], working_now: false };

function head(P) {
  const n = (k) => P.marks.filter((m) => m.kind === k).length, ch = n('changed') + n('removed'), rc = n('rechecked'), last = P.marks.at(-1);
  const bits = [n('added') ? `<b>Added</b> ${hm(P.marks.find((m) => m.kind === 'added').t)}` : '', ch ? `<b>changed ${ch}&times;</b>` : '', rc ? `re-checked ${rc}&times;` : ''].filter(Boolean);
  return `${bits.join(', ')} · last ${hm(last.t)} UTC${P.working_now ? `<span class="ph-live">${last.kind === 'rechecked' ? 'Checked just now' : 'Being updated now'}</span>` : ''}`;
}
const foot = (extra, key = '') => `<p class="ph-f">${key}<span>From the site's release feed${extra}</span></p>`;
const wrap = (id, inner) => `<section class="ph" data-flow="strip" aria-labelledby="ph-${id}">\n<div class="ph-top"><p class="ph-k" id="ph-${id}">This page's history</p><a href="https://lisbontechfringe.com/changes/">All changes</a></div>\n${inner}\n</section>`;

// A: the track. Time-placed, then eased so no two 44 px targets overlap (min gap 18 % of the rail); at most 6 marks, older fold.
function track(P, id) {
  const cut = P.marks[0].kind !== 'added';          // the feed lost the start: a dashed lead-in says so
  let M = P.marks.slice(-5); const L0 = cut ? 12 : 0, t = (m) => Date.parse(m.t), a = t(M[0]), b = t(M.at(-1)) || a + 1;
  let x = M.map((m) => L0 + (100 - L0) * (b > a ? (t(m) - a) / (b - a) : 1));
  const gap = Math.min(20, (100 - L0) / Math.max(1, M.length - 1));
  for (let i = 1; i < x.length; i++) x[i] = Math.max(x[i], x[i - 1] + gap);
  const over = x.at(-1) - 100; if (over > 0) for (let i = x.length - 1, s = over; i >= 0 && s > 0; i--) { x[i] -= s; if (i && x[i] - x[i - 1] >= gap) s = 0; }
  const marks = M.map((m, i) => { const last = i === M.length - 1, now = last && P.working_now;
    return `<a class="ph-m ${m.kind}${now ? ' now' : ''}" style="left:${x[i].toFixed(1)}%" href="${m.url}" aria-label="${v(m.version)}, ${hm(m.t)} UTC: ${what(m)}"><i style="animation-delay:${(0.25 + i * 0.09).toFixed(2)}s"></i></a>`; });
  const lab = (i, cls) => `<span class="ph-l ${cls}" style="left:${x[i].toFixed(1)}%" data-flow-label><strong>${hm(M[i].t)}</strong>${esc(what(M[i]))}</span>`;
  const labels = M.length === 1 ? [lab(0, 'end')] : [lab(0, x[0] < 15 ? 'start' : ''), lab(M.length - 1, 'end')];
  const key = `<span class="ph-key">${P.marks.some((m) => m.kind === 'added') ? '<b class="ad"><i></i>added</b>' : ''}${P.marks.some((m) => m.kind === 'changed') ? '<b><i></i>changed</b>' : ''}${P.marks.some((m) => m.kind === 'rechecked') ? '<b class="rc"><i></i>re-checked</b>' : ''}${P.working_now ? '<b class="nw"><i></i>now</b>' : ''}</span>`;
  return wrap(id, `<p class="ph-h">${head(P)}</p>\n<div class="ph-track">${cut ? '<span class="ph-rail lead" title="older than the feed"></span>' : ''}<span class="ph-rail" style="left:${cut ? L0 : 0}%"></span>\n${marks.join('\n')}\n${labels.join('')}</div>\n${foot(cut ? ' (it keeps about 4 hours; older steps not shown)' : '', key)}`);
}
// B: chips, newest first.
function chips(P, id) {
  const li = P.marks.slice().reverse().map((m, i) => `<li class="${m.kind}${!i && P.working_now ? ' now' : ''}"><a href="${m.url}" style="animation-delay:${(i * 0.06).toFixed(2)}s"><strong data-flow-label>${hm(m.t)}</strong><span data-flow-label>${esc(what(m))}</span></a></li>`);
  return wrap(id, `<p class="ph-h">${head(P)}</p>\n<ul class="ph-chips">${li.join('')}</ul>\n${foot('')}`);
}
// C: the day strip, one cell per hour from 11:00 to 22:00 UTC.
function day(P, id) {
  const cells = []; for (let h = 11; h <= 22; h++) { const ms = P.marks.filter((m) => +m.t.slice(11, 13) === h);
    const k = ms.some((m) => m.kind !== 'rechecked') ? 'changed' : ms.length ? 'rechecked' : '', now = h === 22 && P.working_now ? ' now' : '';
    cells.push(ms.length ? `<a class="${k}${now}" href="${ms[0].url}" aria-label="${h}:00 UTC: ${ms.map(what).join(', ')}" data-flow-label>${h}</a>` : `<span data-flow-label>${h}</span>`); }
  return wrap(id, `<p class="ph-h">${head(P)}</p>\n<div class="ph-day">${cells.join('')}</div>\n${foot(', hours in UTC')}`);
}
// The one-sentence form (A4's rule: a history of one step gets a sentence, no line).
function one(P, id) {
  const m = P.marks[0];
  return wrap(id, `<a class="ph-one" href="${m.url}" data-flow-label>One step in the site's release feed: <u>${what(m)} at ${hm(m.t)} UTC (${v(m.version)})</u>. Its older steps, from when it was added, have dropped out of the feed, which keeps about 4 hours.</a>`);
}

const VARIANTS = [
  ['d909-today', 'd909', T.pages['district-909'], one],
  ['d909-kept', 'd909', KEPT, track],
  ['swyb-a-track', 'swyb', T.pages['show-what-you-build'], track],
  ['swyb-b-chips', 'swyb', T.pages['show-what-you-build'], chips],
  ['swyb-c-day', 'swyb', T.pages['show-what-you-build'], day],
];
const WIDTHS = [[320, 640], [390, 844], [1280, 800]];
(async () => {
  const pw = noShots ? null : require('playwright'), b = pw && await pw.chromium.launch(); fs.mkdirSync(`${S}/sim`, { recursive: true });
  for (const [id, src, P, fn] of VARIANTS) {
    const frag = fn(P, id), live = fs.readFileSync(`${S}/live/${src}.html`, 'utf8');
    fs.writeFileSync(`${__dirname}/${id}.htm`, `<!-- prod-pipeline-a8: injected before </main> of ${P.page} (saved ${T.built_at}), styled by timeline.css. -->\n${frag}\n`);
    const sim = live.replace(/<head>/i, `<head><base href="${P.page}">`).replace(/<\/head>/i, `<style>${css}</style></head>`).replace(/<\/main>/i, frag + '</main>');
    fs.writeFileSync(`${S}/sim/${id}.html`, sim);
    if (!b) continue;
    for (const [w, h] of WIDTHS) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 1000 ? 2 : 1, isMobile: w < 760 });
      const pg = await ctx.newPage(); await pg.goto('file://' + `${S}/sim/${id}.html`, { waitUntil: 'load' });
      const el = await pg.$('section.ph'); await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(1400);
      const r = await el.boundingBox(); const top = Math.max(0, r.y - 90);
      await pg.screenshot({ path: `${A}/shots/${id}-${w}.png`, clip: { x: 0, y: top, width: w, height: Math.min(h, r.y + r.height + 30 - top) } });
      if (w === 390 && id === 'swyb-a-track') { await pg.reload(); const e2 = await pg.$('section.ph'); await e2.scrollIntoViewIfNeeded(); await pg.waitForTimeout(120);
        const r2 = await e2.boundingBox(); await pg.screenshot({ path: `${A}/shots/${id}-390-loading.png`, clip: { x: 0, y: Math.max(0, r2.y - 10), width: w, height: r2.height + 20 } }); }
      await ctx.close();
    }
  }
  if (b) await b.close();
  console.log('a8 mocks:', VARIANTS.map((x) => x[0]).join(', '));
})();
