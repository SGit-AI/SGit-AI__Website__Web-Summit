// ws (backlog 0c4, spec-work-view.md part 3), no browser: deliveries.mjs's packIssues() makes the nine busiest workstreams and
// "other" from a fixture, in deliveries.json's packed form, every flight a doc; issueTitles() keeps titles short; readIssues() on
// this clone reads Issue: trailers only; the built workstreams.json has that shape and holds no subject, body or file name.
const path = require('path'), fs = require('fs')
const ROOT = path.join(__dirname, '../../../..'), fails = [], fail = m => { fails.push(m); console.log('  FAIL', m) }
;(async () => {
  const W = await import(path.join(ROOT, 'people/angelo/tools/deliveries.mjs'))
  const at = m => new Date(Date.UTC(2026, 10, 8, 0, m)).toISOString(), list = []
  for (let i = 1; i <= 12; i++) for (let k = 0; k < 20 - i; k++) list.push({ at: at(i * 30 + k), maker: 'dev@PrompTugal.angelo', issue: 'WS-' + String(i).padStart(2, '0'), sha: 'a' + i + 'b' + k })
  const P = W.packIssues(list, '2026-11-08T00:00:00Z', { 'WS-01': 'The first' })
  if (P.dests.length !== 10 || P.dests[0] !== 'WS-01' || P.dests[9] !== 'other' || P.dests.includes('WS-10')) fail('dests ' + P.dests)
  if (P.names['WS-01'] !== 'WS-01 The first' || P.names['WS-02'] !== 'WS-02' || P.names.other !== 'other workstreams') fail('names ' + JSON.stringify(P.names))
  if (P.rows.length !== list.length || P.rows.some(r => P.icons[r[2]] !== 'doc')) fail('rows')
  const other = P.rows.filter(r => P.dests[r[3]] === 'other').length; if (other !== 10 + 9 + 8) fail('other ' + other)
  const T = W.issueTitles(ROOT); if (!Object.keys(T).length || Object.values(T).some(t => t.length > 20)) fail('titles ' + JSON.stringify(Object.entries(T).find(([, t]) => t.length > 20)))
  const R = W.readIssues(ROOT, { since: '2026-11-07T00:00:00Z' }); if (!R.length || R.some(d => !/^WS-\d{2,}$/.test(d.issue) || !d.maker || Object.keys(d).join() !== 'at,maker,issue,sha')) fail('readIssues ' + JSON.stringify(R[0]))
  const f = path.join(ROOT, 'people/angelo/app/workstreams.json')
  if (!fs.existsSync(f)) fail('workstreams.json not built (run the build first)')
  else { const J = JSON.parse(fs.readFileSync(f, 'utf8')); if (J.dests.length !== 10 || !J.rows.length || J.rows.some(r => r.length !== 6) || Object.keys(J).sort().join() !== 'built_at,dests,from,icons,makers,names,repos,rows') fail('workstreams.json ' + Object.keys(J)) }
  console.log(JSON.stringify({ dests: P.dests.length, read: R.length }))
  console.log(fails.length ? 'FAIL' : 'PASS'); process.exit(fails.length ? 1 : 0)
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL'); process.exit(1) })
