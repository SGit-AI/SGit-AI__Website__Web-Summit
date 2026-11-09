// wvreplay: the work view in replay (work-replay.js, backlog 0f2, spec-work-view.md "Live and replay, one source"), no browser:
// replay's minutes map onto deliveries' minutes by the two files' `from`; playback flies each delivery once, in the frame whose
// minutes hold it, merged per frame and destination (at 1 day a second, eleven deliveries to PT News in one frame are one icon
// with 11); a seek, a jump or the clock going back flies nothing and only resets the counts; the counts cover the window up to the
// moment shown; the whole built deliveries.json played from its start at 1 day a second flies every delivery exactly once.
const path = require('path'), fs = require('fs')
const A = require('../work.js'), R = require('../work-replay.js')
let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
if (R.offset('2026-11-02T01:00:00Z', '2026-11-02T00:00:00Z') !== 60) fail('offset')
const L = [{ min: 10, dest: 'news', icon: 'doc', maker: 'a', sha: '1' }, { min: 11, dest: 'keys', icon: 'key', maker: 'a', sha: '2' }, { min: 30, dest: 'news', icon: 'doc', maker: 'b', sha: '3' }]
  .concat(Array.from({ length: 10 }, (_, i) => ({ min: 40 + i, dest: 'news', icon: 'doc', maker: 'c', sha: 'n' + i })))
const P = R.player(A, L, { offset: 5, window: 20 })
let r = P.at(0); if (!r.seek || r.fly.length) fail('the first frame is a seek and flies nothing')
r = P.at(6); if (r.fly.length !== 2 || r.fly.map(x => x.dest).join() !== 'news,keys') fail('frame 5..11: ' + JSON.stringify(r.fly))
if (r.counts.news !== 1 || r.counts.keys !== 1) fail('counts at 11: ' + JSON.stringify(r.counts))
r = P.at(6); if (r.fly.length) fail('the same moment again (a pause) flies nothing')
r = P.at(20); if (r.fly.length !== 0) fail('nothing between 11 and 25')
r = P.at(44); const f = r.fly.map(x => [x.dest, x.n, x.maker].join(',')).join(';')
if (f !== 'news,11,c') fail('frame 25..49, eleven to PT News merged into one icon with 11 (maker c, who sent most): ' + f)
r = P.at(10); if (!r.seek || r.fly.length) fail('back in time: a seek')
r = P.at(10 + R.JUMP + 1); if (!r.seek || r.fly.length) fail('a jump: a seek')
if (r.counts.news !== 0) fail('counts after the jump (window 20): ' + JSON.stringify(r.counts))
r = R.player(A, L).at(44, false); if (!r.seek) fail('paused is a seek')
// the built file, played from its first minute at 1 day a second (24 minutes a frame): every delivery flies exactly once
const file = path.resolve(__dirname, '../deliveries.json')
if (fs.existsSync(file)) {
  const W = JSON.parse(fs.readFileSync(file, 'utf8')), list = A.unpack(W), Q = R.player(A, list)
  if (list.length) {
    let n = 0, t = list[0].min - 1; Q.at(t)
    while (t < list[list.length - 1].min) { t += 24; for (const x of Q.at(t).fly) n += x.n }
    if (n !== list.length) fail(`the built file: ${n} flown of ${list.length}`)
    console.log(`deliveries.json: ${list.length} played at 1 day a second, ${n} flown`)
  }
} else console.log('note: deliveries.json not built; the built-file check skipped')
console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1)
