// spec-live-map.md section 2: the record's own events in data.json's replay.live (keys, "a key handed over", lanes), and the
// never list (data-and-who-may-see-it.md): no sealed file's name, no token, no key, no vault id. No browser: the data only.
const fs = require('fs'), path = require('path')
const ROOT = path.resolve(__dirname, '../../../..')
;(async () => { let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/angelo/app/data.json'), 'utf8')), L = d.replay.live
 if (!L || L.error) { fail('no live section ' + JSON.stringify(L)); return console.log('FAIL') }
 const name = n => typeof n === 'string' && n.length > 1 && n.length < 60
 const sorted = a => a.every((e, i) => !i || a[i - 1][0] <= e[0])
 for (const [k, kinds] of [['keys', ['published', 'ended']], ['handovers', null], ['lanes', ['inbox', 'feedback']]]) {
  const a = L[k] || []
  if (!a.length) fail(k + ': none')
  if (!sorted(a)) fail(k + ': not in time order')
  for (const e of a) if (!Number.isInteger(e[0]) || !name(e[1]) || (kinds ? !kinds.includes(e[2]) : !name(e[2])) || e.length !== 3) { fail(k + ': bad ' + JSON.stringify(e)); break }
 }
 // every sealed file is one handover at most, and none says what it was
 const sealed = []; const walk = p => fs.readdirSync(p, { withFileTypes: true }).forEach(e => e.isDirectory() ? walk(path.join(p, e.name)) : sealed.push(e.name.replace(/\.json$/, '')))
 walk(path.join(ROOT, 'data/sealed'))
 if (L.handovers.length > sealed.length) fail('more handovers than sealed files')
 const text = JSON.stringify(L)
 for (const n of sealed) if (text.includes(n) || text.includes(n.replace(/^[\dT-]+Z-/, ''))) fail('a sealed file name: ' + n)
 // what a sealed file was (its kind) is never said: outside the agents' names, no word of the files' names appears
 const bare = text.replace(/"(pt:[a-z0-9-]+:)?[a-z0-9.-]+(@[a-z0-9.-]+)?"/gi, '""')
 if (/[0-9a-f]{32,}|BEGIN [A-Z ]*KEY|sgit_|crm|sticker|hello|profile|video|outreach|meeting/i.test(text.replace(/[a-z0-9.-]+@(web-summit|promptugal)\.[a-z0-9-]+|pt:[a-z0-9-]+:[a-z0-9.-]+/gi, ''))) fail('something more than names and times')
 if (bare.replace(/[\[\]{}:,0-9"-]/g, '').length) fail('a value that is not a name or a time: ' + bare.replace(/[\[\]{}:,0-9"-]/g, '').slice(0, 60))
 // the never list itself drops a section that holds a leak, and keeps a clean one
 const { neverList } = await import(path.join(ROOT, 'people/angelo/app/data.mjs'))
 const leak = [[1, 'a', 'b' + sealed[0]], [1, 'a', 'f'.repeat(40)], [1, '-----BEGIN PUBLIC KEY-----', 'b']]
 for (const x of leak) if (!neverList(ROOT, { handovers: [x] }).error) fail('never list let through ' + JSON.stringify(x).slice(0, 60))
 if (neverList(ROOT, { handovers: [[1, 'conductor@web-summit.dinis', 'dinis']] }).error) fail('never list dropped a clean one')
 console.log(JSON.stringify({ keys: L.keys.length, handovers: L.handovers.length, lanes: L.lanes.length, bytes: text.length, sealed: sealed.length }))
 console.log(ok ? 'PASS' : 'FAIL') })()
