// wv: the work view's rule table (backlog 0f2, spec-work-view.md), no browser. Each row of the spec's table with a fixture
// commit; "Delivered:" lines by kind and by path; a release and a review hidden; one icon per destination; the backfill's
// shas all real commits; and the list read from this repository's own history holds names, kinds and times only.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process')
const ROOT = path.resolve(__dirname, '../../../..')
;(async () => {
 const D = await import(path.join(ROOT, 'people/angelo/tools/deliveries.mjs'))
 let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const one = (files, body = '', subject = 'dev.work@PrompTugal.angelo: x') => D.classify({ subject, body, files }).map(d => `${d.icon}>${d.dest}`).sort().join(' ')
 const cases = [
  // [row, files, expected]
  ['hidden-inner: STATE', ['people/angelo/map/work/STATE.md'], ''],
  ['hidden-inner: RUNNER', ['people/angelo/conductor/RUNNER.md'], ''],
  ['hidden-inner: version files', ['REALITY.md', 'version.txt', 'admin/versions.json', 'admin/metrics.json', 'data/log.json'], ''],
  ['hidden-inner: ledger, estimates, pulse, policy', ['people/angelo/ledger/x.jsonl', 'people/angelo/estimates/x.jsonl', 'people/dinis/pulse/2026-11-08.md', 'people/angelo/policy/lanes.json'], ''],
  ['hidden-inner: a sealed file', ['data/' + 'sealed/crm-key.sealed'], ''],
  ['hidden-inner: snapshots', ['people/angelo/app/repos-events.json', 'people/angelo/app/promptugal.json', 'people/angelo/app/deliveries-backfill.json'], ''],
  ['hidden-inner: generated pages', ['team/index.html', 'companies/acme.html', 'about/index.md', 'articles/x.md', 'content/articles/x.md.sig'], ''],
  ['keys', ['data/keys.json'], 'key>keys'],
  ['keys: person keys', ['data/person-keys.json', 'people/angelo/key.json'], 'key>keys'],
  ['research', ['people/angelo/research/acme.md'], 'doc>research'],
  ['crm', ['data/crm.json'], 'record>crm'],
  ['crm: a crm folder', ['people/angelo/crm/notes.json', 'data/companies.json'], 'record>crm'],
  ['drafts: proposals', ['people/angelo/proposals/live-map/spec-work-view.md'], 'doc>drafts'],
  ['drafts: drafts and fragments', ['people/angelo/links/drafts/x.patch', 'people/dinis/x.fragment'], 'doc>drafts'],
  ['drafts: an HTML preview under people/', ['people/angelo/preview.html'], 'doc>drafts'],
  ['app', ['people/angelo/app/live.js'], 'cog>app'],
  ['app: its HTML is the app, not a draft', ['people/angelo/app/index.html'], 'cog>app'],
  ['infra: workflows', ['.github/workflows/deploy-pages.yml'], 'cog>infra'],
  ['infra: tools', ['admin/tools/agent-log.mjs', 'people/angelo/tools/deliveries.mjs'], 'cog>infra'],
  ['infra: other code', ['scripts/x.py'], 'cog>infra'],
  ['hidden-comms: content and board', ['content/start.md', 'board/WS-08-map.md'], ''],
  ['hidden-comms: people\'s own pages', ['people/angelo/dashboard.md', 'content/brief-angelo.md'], ''],
  ['site: assets', ['assets/cc/app.css'], 'cog>site'],
  ['site: the build (not infrastructure)', ['admin/build/build.mjs'], 'cog>site'],
  ['hidden-other: an unnamed data file', ['data/team.json', 'README.md'], ''],
  ['one icon per destination', ['data/keys.json', 'people/angelo/key.json', 'people/angelo/app/a.js', 'people/angelo/app/b.js'], 'cog>app key>keys'],
 ]
 for (const [row, files, want] of cases) { const got = one(files); if (got !== want) fail(`${row}: ${JSON.stringify(files)} gave "${got}", not "${want}"`) }
 // a release and a review never travel, whatever they touch
 if (one(['data/keys.json'], '', 'site v0.2.1331: dev@PrompTugal.angelo: x')) fail('a release travelled')
 if (one(['people/angelo/app/live.js'], 'Agent: dashboard@PrompTugal.angelo', 'review: bring workers/dev.map\'s new work onto dev')) fail('a review travelled')
 // "Delivered:" lines: the kind first; an older line by the path it names; the same delivery as a file rule counts once
 const dl = [
  ['Delivered: email draft, a note to a company', 'envelope>email'],
  ['Delivered: post, the Sunday post', 'post>linkedin'],
  ['Delivered: article, a piece on promptugal.news', 'doc>news'],
  ['Delivered: brief, a company', 'doc>research'],
  ['Delivered: record, a CRM entry', 'record>crm'],
  ['Delivered: the venue map, people/angelo/app/where.js', 'cog>app'],
  ['Delivered: the spec https://web-summit.sgit.ai/people/angelo/proposals/live-map/spec-work-view.md', 'doc>drafts'],
  ['Delivered: something with neither a kind nor a path', ''],
  ['Delivered: a page under content/start.md', ''],
 ]
 for (const [line, want] of dl) { const got = one([], `Scheduled run.\n${line}\n`); if (got !== want) fail(`${line} gave "${got}", not "${want}"`) }
 if (one(['people/angelo/proposals/x/spec.md'], 'Delivered: spec, the spec people/angelo/proposals/x/spec.md') !== 'doc>drafts') fail('a Delivered: line counted twice')
 // the maker: the subject's lead, else the Agent: trailer; none, nothing
 if (D.maker('dev.work@PrompTugal.angelo: x') !== 'dev.work@PrompTugal.angelo') fail('maker from the subject')
 if (D.maker('review: x', 'Agent: dashboard@' + 'promptugal.angelo') !== 'dashboard@PrompTugal.angelo') fail('maker from Agent:')
 if (D.maker('a commit by nobody', '') !== null) fail('a maker invented')
 // the backfill: every sha a real commit of this repository (fetched if the clone is shallow), names, kinds and times only
 const BF = path.join(ROOT, 'people/angelo/app/deliveries-backfill.json'), bf = JSON.parse(fs.readFileSync(BF, 'utf8'))
 for (const e of bf.entries) {
  const keys = Object.keys(e).sort().join(','); if (keys !== 'agent,at,destination,kind,sha') fail(`backfill entry with fields ${keys}`)
  let real = true; try { execFileSync('git', ['cat-file', '-e', e.sha + '^{commit}'], { cwd: ROOT, stdio: 'ignore' }) } catch { real = false }
  if (!real) fail(`backfill sha ${e.sha} is not a commit here`)
 }
 if (D.backfill(BF).length !== bf.entries.length) fail('a backfill entry was left out (an unknown kind or destination?)')
 // this repository's own history: only names, kinds, times and short shas; every icon and destination known
 const list = D.readRepo(ROOT, { since: '2026-11-02T00:00:00Z' }), P = D.pack(list, '2026-11-02T00:00:00Z')
 const shape = P.rows.every(r => r.length === 6 && Number.isInteger(r[0]) && r[2] >= 0 && r[3] >= 0 && /^[0-9a-f]{7,12}$/.test(r[5]))
 const text = /"(subject|body|message|text|file|files|title|recipient)"/.test(JSON.stringify(P))
 const files = /\.(md|json|mjs|js|html)\b/.test(JSON.stringify(P))
 console.log(JSON.stringify({ deliveries: list.length, makers: P.makers.length, by: Object.fromEntries(D.DESTS.map((d, i) => [d, P.rows.filter(r => r[3] === i).length])) }))
 if (!list.length || !shape || text || files) fail(`the list: ${list.length} rows, shape ${shape}, text ${text}, file names ${files}`)
 // the build's deliveries.json beside live.json (data.mjs's extras): the same shape, makers named as live.json names agents
 const DJ = path.join(ROOT, 'people/angelo/app/deliveries.json'), LJ = path.join(ROOT, 'people/angelo/app/live.json')
 if (fs.existsSync(DJ) && fs.existsSync(LJ)) {
  const W = JSON.parse(fs.readFileSync(DJ, 'utf8')), L = JSON.parse(fs.readFileSync(LJ, 'utf8'))
  const same = W.from === L.from && W.rows.length > 0 && W.rows.every(r => r.length === 6 && r[1] < W.makers.length && W.icons[r[2]] && W.dests[r[3]])
  const named = L.agents.filter(a => W.makers.includes(a)).length, raw = W.makers.filter(m => /@promptugal\./i.test(m)).length
  console.log(JSON.stringify({ built: W.rows.length, sharedNames: named, rawPtNames: raw }))
  if (!same || !named || raw || /"(subject|body|message|text|title)"/.test(JSON.stringify(W))) fail('deliveries.json: shape, names or text')
 } else console.log('  (deliveries.json not built: run the build first; run.sh does)')
 console.log(ok ? 'PASS' : 'FAIL')
})()
