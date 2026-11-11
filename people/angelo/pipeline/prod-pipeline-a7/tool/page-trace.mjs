#!/usr/bin/env node
// page-trace.mjs: every commit (and other interaction) behind a Lisbon Tech Fringe page, by Angelo's definition
// (11 Nov 2026): "each and every commit (and other interactions?) that have contributed to get the page to the
// current state, let's leave the template changes to their own pages."
// Node 18, no dependencies, read-only git. Usage:
//   node page-trace.mjs <path to a PrompTugal__News__Fringe clone> --out <dir>
// Writes <dir>/<page>.trace.json (shape lisbon-fringe-trace/1, adapted) for the six pages below.
// The same clone at the same head gives the same files: traced_at is the head commit's time, not the clock.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const repo = args[0];
const outDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : '.';
if (!repo) { console.error('usage: node page-trace.mjs <fringe clone> --out <dir>'); process.exit(2); }
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });
const SITE = 'https://lisbontechfringe.com';

// A page's own sources. Anything under admin/build/, assets/, .github/ or admin/ that is not listed here is
// the shared template: counted in one line, not a step.
const PAGES = [
  { file: 'district-909', page: '/e/2026-11-11-district-909-back-where-it-all-started/', event: '2026-11-11-district-909-back-where-it-all-started', also: ['DISTRICT 909'] },
  { file: 'storm-summit', page: '/e/2026-11-11-storm-summit-stormsummit-app/', event: '2026-11-11-storm-summit-stormsummit-app', also: ['stormsummit.app'] },   // not "Storm Summit": too common a phrase during Storm Charles,
  { file: 'me', page: '/me/', own: ['admin/build/me.mjs', 'assets/me/me.js', 'data/inboxes/conductor.fringe-promptugal.json'], work: ['work/26-dinis-key-and-talk.md'] },
  { file: 'tip', page: '/tip/', own: ['admin/build/tip.mjs', 'assets/tip/tip.js', 'data/inboxes/lane-tips.json', 'data/inboxes/researcher.2.fringe-dinis.json', 'data/tips-status.json'], work: ['work/41-tip-intake.md'] },
  { file: 'home', page: '/', own: ['admin/build/home.mjs', 'data/event-images.json'], listing: true },
  { file: 'programme', page: '/programme/', own: ['admin/build/programme.mjs'], listing: true },
];
const TEMPLATE = /^(admin\/|assets\/|\.github\/)/;
const EVENTS = 'data/events.json', ORGS = 'data/organisers.json';

// --- git records ---------------------------------------------------------------------------------------
const FMT = '%x1e%H%x1f%aI%x1f%an%x1f%s%x1f%b%x1f';
function commits(extra) {   // [{sha, t, who, what, body, files[]}]
  return git('log', '--no-renames', `--format=${FMT}`, '--name-only', ...extra).split('\x1e').filter(Boolean).map((r) => {
    const [sha, at, an, s, body, rest] = r.split('\x1f');
    const agent = /^Agent:\s*(\S+)/m.exec(body);
    return { sha, t: new Date(at).toISOString().replace('.000Z', 'Z'), who: agent ? agent[1] : an, what: s, body, files: rest.split('\n').map((x) => x.trim()).filter(Boolean) };
  });
}
const show = (sha, f) => { try { return JSON.parse(git('show', `${sha}:${f}`)); } catch { return null; } };
const parentOf = (sha) => { try { return git('rev-parse', `${sha}^`).trim(); } catch { return null; } };
const tagCache = new Map();
const firstTag = (sha) => {   // the first CI version tag that holds the commit (CI tags the tree it deployed)
  if (!tagCache.has(sha)) tagCache.set(sha, git('tag', '--contains', sha, '--sort=v:refname', '--list', 'v*').split('\n')[0] || null);
  return tagCache.get(sha);
};
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Every version of events.json, entries by id, each commit's change set (added, changed, removed ids).
const evList = (j) => (j && (Array.isArray(j) ? j : j.events)) || [];
const evHist = commits(['--', EVENTS]).reverse().map((c) => {
  const cur = evList(show(c.sha, EVENTS)), p = parentOf(c.sha), prev = p ? evList(show(p, EVENTS)) : [];
  const a = new Map(prev.map((e) => [e.id, JSON.stringify(e)])), b = new Map(cur.map((e) => [e.id, JSON.stringify(e)]));
  const added = [...b.keys()].filter((k) => !a.has(k)), removed = [...a.keys()].filter((k) => !b.has(k));
  const changed = [...b.keys()].filter((k) => a.has(k) && a.get(k) !== b.get(k));
  return { ...c, cur, prev, added, removed, changed };
});
const head = git('rev-parse', 'HEAD').trim();
const headTime = new Date(git('log', '-1', '--format=%cI').trim()).toISOString().replace('.000Z', 'Z');
const nowEvents = evList(show(head, EVENTS));

const step = (c, role, why, files, extra = {}) => ({ t: c.t, sha: c.sha.slice(0, 7), kind: 'commit', who: c.who, what: c.what, files, role, why, live_in: firstTag(c.sha), deploy_time: 'gap', ...extra });
const asks = (c) => (c.body.split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, ' ').match(/[^.\n]*(passed on|at [A-Z][a-z]+'s word|asked by|relayed by|brief)[^.\n]*/g) || []).map((s) => s.trim());

function templateLine(since, own = []) {   // commits to shared build files (not the page's own) since its first step
  const n = commits([...(since ? [`--since=${since}`] : []), '--', 'admin', 'assets', '.github']).filter((c) => c.files.some((f) => TEMPLATE.test(f) && !own.includes(f))).length;
  return { shared_template_commits_since_first_step: n, line: `The shared template changed ${n} times since; see its own page.` };
}

// --- an event page ------------------------------------------------------------------------------------
function eventTrace(P) {
  const e = nowEvents.find((x) => x.id === P.event);
  if (!e) throw new Error(`${P.event} not in ${EVENTS} at ${head}`);
  const match = (x) => x && (x.id === e.id || (e.url && x.url === e.url));
  const steps = new Map(), interactions = [];
  // (a) its own data entry: every commit that added or changed it (matched by id or source URL)
  for (const c of evHist) {
    const before = c.prev.find(match), after = c.cur.find(match);
    if (JSON.stringify(before) === JSON.stringify(after)) continue;
    const fields = !before ? ['(added)'] : !after ? ['(removed)'] : Object.keys({ ...before, ...after }).filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
    steps.set(c.sha, step(c, 'contributed', `changed its entry in ${EVENTS}: ${fields.join(', ')}`, [EVENTS]));
    if (after?.read_at && after.read_at !== before?.read_at) interactions.push({ t: after.read_at, kind: 'source-read', who: c.who, what: `read ${after.url} (the entry's read_at, set in ${c.sha.slice(0, 7)})`, evidence: [c.sha.slice(0, 7), after.url], role: 'contributed', ...(after.seen_at && after.read_at < after.seen_at ? { note: `read_at is earlier than seen_at (${after.seen_at}): the record contradicts itself; the page shows this read_at` } : {}) });
    if (after?.seen_at && after.seen_at !== before?.seen_at) interactions.push({ t: after.seen_at, kind: 'source-read', who: c.who, what: `first seen (the entry's seen_at)`, evidence: [c.sha.slice(0, 7)], role: 'contributed' });
    for (const a of asks(c)) interactions.push({ t: 'unknown', before: c.t, kind: 'ask', who: 'a person (as the commit body says)', what: a, evidence: [c.sha.slice(0, 7)], role: 'contributed' });
  }
  // its organiser's curated entry (data/organisers.json), which the page names and links
  const orgNames = String(e.organiser || '').split(/\s+(?:with|and|&|x)\s+|,\s*/i).map((s) => s.replace(/\(.*?\)/g, '').trim()).filter((s) => s.length > 3);
  for (const c of commits(['--', ORGS])) {
    const p = parentOf(c.sha), pick = (j) => JSON.stringify(((j && j.organisers) || []).filter((o) => orgNames.some((n) => JSON.stringify(o).toLowerCase().includes(n.toLowerCase()))));
    if (pick(show(c.sha, ORGS)) !== pick(p ? show(p, ORGS) : null)) steps.set(c.sha, step(c, 'contributed', `changed its organiser's entry in ${ORGS}`, [ORGS]));
  }
  // (b) other records that name it (id, source URL, name, short names): related unless they changed what it shows
  const terms = [e.id, e.url, e.name, ...(P.also || [])].filter(Boolean);
  for (const term of terms) {
    for (const c of commits(['-i', `-G${reEsc(term)}`])) {   // without --pickaxe-all, git lists only the files that matched
      if (steps.has(c.sha)) { const s = steps.get(c.sha); s.matched = [...new Set([...(s.matched || []), term])]; continue; }
      const own = c.files.filter((f) => !TEMPLATE.test(f) && f !== EVENTS);
      if (!own.length) {
        if (c.files.includes(EVENTS)) steps.set(c.sha, step(c, 'related', `names it in ${EVENTS} without changing its entry`, c.files, { matched: [term] }));
        continue;   // a template file that names it: the template's own page
      }
      steps.set(c.sha, step(c, 'related', `names it in ${own.join(', ')}; shows nothing on the page`, c.files, { matched: [term] }));
    }
  }
  return finish(P, steps, interactions, { event_id: e.id, source_url: e.url });
}

// --- a page with its own builder (and, for listings, every event) -------------------------------------
function ownTrace(P) {
  const steps = new Map(), interactions = [];
  for (const c of commits(['--', ...P.own])) steps.set(c.sha, step(c, 'contributed', `changed its own source: ${c.files.filter((f) => P.own.includes(f)).join(', ')}`, c.files.filter((f) => P.own.includes(f))));
  for (const c of P.work?.length ? commits(['--', ...P.work]) : []) if (!steps.has(c.sha)) steps.set(c.sha, step(c, 'related', `the work item that asked for it and tracks it: ${P.work.join(', ')}`, c.files.filter((f) => P.work.includes(f))));
  let feed = null;
  if (P.listing) {
    const by = {};
    for (const c of evHist) {
      const n = c.added.length + c.changed.length + c.removed.length;
      if (!n) continue;
      const why = [c.added.length && `${c.added.length} added`, c.changed.length && `${c.changed.length} changed`, c.removed.length && `${c.removed.length} removed`].filter(Boolean).join(', ');
      const s = steps.get(c.sha);
      if (s) { s.why += `; events: ${why}`; s.files.push(EVENTS); } else steps.set(c.sha, step(c, 'contributed', `events data: ${why}`, [EVENTS], { events: { added: c.added.length, changed: c.changed.length, removed: c.removed.length } }));
      const g = (by[c.who] ||= { commits: 0, added: 0, changed: 0, removed: 0 });
      g.commits++; g.added += c.added.length; g.changed += c.changed.length; g.removed += c.removed.length;
    }
    const agents = Object.entries(by).sort((a, b) => b[1].commits - a[1].commits).map(([who, g]) => ({ who, ...g }));
    feed = { events_now: nowEvents.length, commits_to_events_data: agents.reduce((a, g) => a + g.commits, 0), agents };
  }
  return finish(P, steps, interactions, feed ? { events_feed: feed } : {});
}

function finish(P, steps, interactions, extra) {
  const list = [...steps.values(), ...interactions].sort((a, b) => String(a.t === 'unknown' ? a.before : a.t).localeCompare(String(b.t === 'unknown' ? b.before : b.t)) || (b.t === 'unknown') - (a.t === 'unknown'));
  list.forEach((s, i) => { s.n = i + 1; });
  const first = list.find((s) => s.kind === 'commit')?.t;
  const counts = list.reduce((a, s) => { a[s.role] = (a[s.role] || 0) + 1; return a; }, {});
  return {
    shape: 'lisbon-fringe-trace/1 (adapted: role contributed|related, live_in, deploy_time)',
    about: `Every commit and interaction behind ${SITE}${P.page}, by Angelo's definition (11 Nov 2026); template changes are not steps.`,
    page: SITE + P.page, ...extra,
    traced_by: 'mike.large.worker@PrompTugal.angelo (prod-pipeline-a7)', generator: 'people/angelo/pipeline/prod-pipeline-a7/tool/page-trace.mjs',
    repo: 'PrompTugal/PrompTugal__News__Fringe', repo_head: head.slice(0, 7), traced_at: headTime,
    privacy: 'Public commits only; persons by role; no contact detail.',
    totals: { steps: list.length, ...counts },
    template: templateLine(first, P.own),
    steps: list,
    gaps: [
      'deploy_time: the deploy runs are in the Fringe\'s GitHub Actions, not readable here; live_in is the first CI version tag (v<series>.<run>) that holds the commit; its deploy time is not known.',
      'A person\'s words outside git (chat, voice) appear only where a commit body quotes or names them.',
      'A sub-agent behind a commit is not visible unless the commit says so.',
    ],
  };
}

mkdirSync(outDir, { recursive: true });
for (const P of PAGES) {
  const tr = P.event ? eventTrace(P) : ownTrace(P);
  writeFileSync(join(outDir, `${P.file}.trace.json`), JSON.stringify(tr, null, 1) + '\n');
  console.log(`${P.file}: ${tr.totals.steps} steps (${tr.totals.contributed || 0} contributed, ${tr.totals.related || 0} related); ${tr.template.line}`);
}
