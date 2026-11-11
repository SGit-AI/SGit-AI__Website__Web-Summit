#!/usr/bin/env node
// prod-pipeline-a5: a page's trace in lisbon-fringe-trace/1 shape from the Fringe's git history only.
// kilo.large.worker@PrompTugal.angelo (design, prod-pipeline-a5), 11 November 2026. Read-only git commands on a clone; runs no Fringe code.
//   node make-trace.mjs <fringe-clone> <page-id> <out.json>
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [repo, id, out] = process.argv.slice(2);
const BASE = ['admin/build/build.mjs', 'admin/build/tokens.css', 'admin/build/identity.mjs', 'admin/build/validate.mjs', '.github/workflows/deploy.yml', 'admin/series.txt'];
const PAGES = {
  home: { page: '/', what: 'the home page', files: [...BASE, 'admin/build/home.mjs', 'admin/build/cards.mjs', 'admin/build/nowstrip.mjs', 'admin/build/graph-model.mjs', 'admin/build/graph.mjs', 'admin/build/city-map.mjs', 'admin/build/event-pages.mjs', 'admin/build/live.mjs', 'admin/build/tip.mjs', 'data/events.json', 'data/communities.json', 'data/places.json'] },
  programme: { page: '/programme/', what: 'the programme listing', files: [...BASE, 'admin/build/programme.mjs', 'admin/build/cards.mjs', 'admin/build/tiers.mjs', 'admin/build/event-pages.mjs', 'data/events.json'] },
  all: { page: '/', what: 'the whole site (every page is rebuilt from the whole repository on each deploy)', files: [] },
  graph: { page: '/graph/', what: 'the graph', files: [...BASE, 'admin/build/graph.mjs', 'admin/build/graph-model.mjs', 'data/events.json', 'data/communities.json', 'data/places.json', 'data/organisers.json'] },
};
const P = PAGES[id]; if (!P) throw new Error('page id: ' + Object.keys(PAGES).join('|'));
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 1 << 28 });
const head = git('rev-parse', '--short', 'HEAD').trim();
const SEP = '\x1e', FS = '\x1f';
const raw = git('log', '--no-merges', '--reverse', `--format=${SEP}%h${FS}%aI${FS}%cI${FS}%an${FS}%s${FS}%(trailers:key=Claude-Session,valueonly,separator=;)${FS}%(trailers:key=Co-Authored-By,valueonly,separator=;)${FS}%(trailers:key=Agent,valueonly,separator=;)`, '--name-only', 'HEAD', ...(P.files.length ? ['--', ...P.files] : []));
const iso = (s) => new Date(s).toISOString().replace('.000Z', 'Z');
const steps = [];
for (const blk of raw.split(SEP).slice(1)) {
  const [meta, ...rest] = blk.split('\n'); const files = rest.filter(Boolean);
  const [h, at, ct, an, subj, sess, coa, agentT] = meta.split(FS);
  const m = subj.match(/^([A-Za-z0-9.\-]+@[A-Za-z0-9.\-]+)\s*:/);
  const who = (agentT && agentT.split(';')[0].trim()) || (m ? m[1] : an === 'Claude' ? 'an agent (no name in the commit)' : an);
  if (!m && !agentT && an === 'Claude') { /* an agent commit with no name in subject or trailer */ }
  const kind = (an === 'Claude' && !/@/.test(who)) ? 'agent' : /@/.test(who) ? 'agent' : (an === 'GitHub Actions' || /\[bot\]/.test(an) ? 'ci' : 'human');
  const s = { n: steps.length + 1, t: iso(at), kind, who, what: `changed ${files.slice(0, 6).join(', ')}${files.length > 6 ? ` and ${files.length - 6} more` : ''}: ${subj.replace(/^[^:]*@[^:]*:\s*/, '')}`.slice(0, 300).replace(/(@[A-Za-z0-9-]+\.[A-Za-z0-9-]+)\.(md|json|jsonl|txt|mjs)\b/g, '$1 ($2)').replace(/[A-Za-z0-9._-]+@[A-Za-z0-9.-]*$/, ''), evidence: [h], label: 'fact' };
  if (iso(ct) !== s.t) s.committed = iso(ct);
  const se = (sess || '').split(';').map((x) => x.trim()).filter(Boolean).map((u) => u.replace(/.*\//, ''));
  if (se[0]) s.session = se[0];
  const mo = (coa || '').match(/Claude [A-Za-z]+ [\d.]+/); if (mo) s.model = mo[0];
  if (files.includes('data/events.json')) s.data = true;
  steps.push(s);
}
const who = new Set(steps.map((s) => s.who)), people = [...new Set(steps.filter((s) => s.kind === 'human').map((s) => s.who))];
const trace = {
  about: `How ${P.what} of the Lisbon Tech Fringe (${P.page}) came to be: every commit to the files it is built from, from the git record only.`,
  page_id: id, page: 'https://lisbontechfringe.com' + P.page,
  traced_by: 'kilo.large.worker@PrompTugal.angelo (prod-pipeline-a5, a simulation)', traced_at: new Date().toISOString().replace(/\.\d+Z/, 'Z'),
  repo: 'PrompTugal/PrompTugal__News__Fringe', repo_head: head, generator: 'people/angelo/pipeline/prod-pipeline-a5/mock/make-trace.mjs',
  shape: 'lisbon-fringe-trace/1', sources: P.files,
  privacy: 'Names are the agents named in public commits and the public author of the first commit; no private person; no contact detail.',
  steps,
  gaps: [
    'CI and deploy runs: not in git. The Fringe numbers versions by run (v0.1.<run>); this trace has no ci or deploy steps and no published_by, so "live" is the time of the last commit plus an unmeasured deploy (about 1 min on the Wexio trace).',
    'People\'s words (Dinis\'s briefs, KICKOFF.md, a tip): not in these files\' history; added by hand in the real trace.',
    'Sub-agents behind a commit: git sees only the committing agent.',
    'The page is rebuilt from the whole repository: a commit to a file not listed in sources can still change it (a shared helper, a data file read at build). The list is the page\'s direct inputs, read from build.mjs imports.',
  ],
  totals: { steps: steps.length, agents: [...who].filter((w) => /@/.test(w)).length, people: people.length, data_commits: steps.filter((s) => s.data).length, first: steps[0]?.t, last: steps.at(-1)?.t, sessions: new Set(steps.map((s) => s.session).filter(Boolean)).size },
};
writeFileSync(out, JSON.stringify(trace, null, 1) + '\n');
console.log(id, trace.totals);
