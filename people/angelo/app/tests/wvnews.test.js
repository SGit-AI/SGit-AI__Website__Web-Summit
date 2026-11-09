// wvnews: the work view's live read of the newsroom (work-newsroom.js; spec-work-view.md, answer 4), no browser, against a saved
// copy of stories.json (tests/wv-stories.json, titles and files dropped): each published story one doc to PT News from its maker,
// moves into draft, fact-check or review docs to Drafts and proposals; a day-only step at 09:00 UTC and marked; nothing kept but
// id, maker, time; a changed shape draws nothing and says so; live, only what is new since the last read flies, and the poller
// reads again and reports a failed read.
const path = require('path'), fs = require('fs')
const N = require('../work-newsroom.js')
let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
const J = JSON.parse(fs.readFileSync(path.join(__dirname, 'wv-stories.json'), 'utf8'))
if (N.check(J)) fail('the saved copy fails its own check: ' + N.check(J))
const L = N.deliveries(J), pubs = J.stories.filter(s => s.history.some(h => h.column === 'published' && h.by)).length
const toNews = L.filter(d => d.dest === 'news'), toDrafts = L.filter(d => d.dest === 'drafts')
if (toNews.length !== pubs) fail(`published: ${toNews.length} deliveries for ${pubs} stories`)
if (new Set(toNews.map(d => d.id)).size !== toNews.length) fail('a story published twice')
if (!toDrafts.length || toDrafts.some(d => d.icon !== 'doc')) fail('drafts')
if (L.some(d => !/^(pt:[a-z0-9-]+:[a-z0-9.-]+|[a-z0-9.-]+@web-summit\.[a-z0-9-]+)$/.test(d.maker))) fail('a maker not in the map\'s names')
const day = L.find(d => d.dayOnly), timed = L.find(d => !d.dayOnly)
if (!day || new Date(day.at).getUTCHours() !== 9 || new Date(day.at).getUTCMinutes() !== 0) fail('a day-only step not at 09:00 UTC')
if (!timed) fail('no timed step read (some steps carry a minute)')
if (L.some(d => Object.keys(d).sort().join() !== 'at,dayOnly,dest,icon,id,key,maker')) fail('a delivery keeps more than id, maker and time')
if (/"(title|file|summary|headline)"/.test(JSON.stringify(L))) fail('text kept')
if (N.viewId('journalist@PrompTugal.dinis') !== 'pt:dinis:journalist' || N.viewId('curator@web-summit.vicky') !== 'curator@web-summit.vicky' || N.viewId(null) !== null) fail('viewId')
// a changed shape: nothing drawn, and the reason
const broken = { stories: [{ id: 'x', steps: [] }] }
if (!N.check(broken) || N.deliveries(broken).length) fail('a changed shape was drawn')
// live: only the new step flies, at once
const seen = new Set(L.map(d => d.key)), J2 = JSON.parse(JSON.stringify(J)), now = Date.parse('2026-11-08T17:00:00Z')
J2.stories[0].history.push({ column: 'review', at: '2026-11-08', by: 'reviewer@PrompTugal.vicky' })
const F = N.fresh(seen, N.deliveries(J2), now)
if (F.length !== 1 || F[0].at !== now || F[0].dest !== 'drafts') fail('fresh: ' + JSON.stringify(F))
// the poller: a first read fills, a second read reports the new one, a failed read says so; then it stops
;(async () => {
 const calls = [], errs = [], lists = []; let n = 0, pending = null
 const fakeFetch = async () => { n++; if (n === 3) return { ok: false, status: 503 }; return { ok: true, json: async () => n === 1 ? J : J2 } }
 const P = N.poll({ fetch: fakeFetch, onList: (a, b) => lists.push(b.length), onError: e => errs.push(e), setTimeout: f => { pending = f; return 1 }, clearTimeout: () => { pending = null } })
 for (let i = 0; i < 3; i++) { await new Promise(r => setImmediate(r)); await new Promise(r => setImmediate(r)); if (i < 2 && pending) { const f = pending; pending = null; f() } }
 await new Promise(r => setImmediate(r)); P.stop()
 if (lists.join() !== '0,1' || errs.length !== 1) fail(`poll: lists ${lists}, errors ${errs}`)
 console.log(JSON.stringify({ stories: J.stories.length, toNews: toNews.length, toDrafts: toDrafts.length, dayOnly: L.filter(d => d.dayOnly).length, reads: n }))
 console.log(ok ? 'PASS' : 'FAIL')
})()
