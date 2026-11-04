#!/usr/bin/env node
// Which GitHub account pushed a commit to dev? (the protocol, people/angelo/kit/README.md#protocol)
//   node people/angelo/tools/pushed-by.mjs <sha> [<sha> ...]
// Prints "<sha> <account> <time>" per commit, and exits 1 if any was not pushed from Angelo's accounts.
// A commit is attributed to the push whose range (before..after] contains it, from GitHub's activity API.
// Read-only: it fetches and prints, nothing more.
import { execFileSync } from 'node:child_process'
const ANGELO = ['riskmandate-angelo', 'the-neuronin']
const API = 'https://api.github.com/repos/SGit-AI/SGit-AI__Website__Web-Summit/activity?ref=refs/heads/dev&per_page=100'
const git = (...a) => { try { execFileSync('git', a, { stdio: 'ignore' }); return true } catch { return false } }
const anc = (a, b) => git('merge-base', '--is-ancestor', a, b)
const shas = process.argv.slice(2)
if (!shas.length) { console.error('usage: pushed-by.mjs <sha> [...]'); process.exit(2) }
let events = []
const ghApi = page => JSON.parse(execFileSync('gh', ['api', `${API.replace('https://api.github.com/', '')}&page=${page}`], { encoding: 'utf8', maxBuffer: 32 << 20 }))
const anon = async page => { const r = await fetch(`${API}&page=${page}`, { headers: { accept: 'application/vnd.github+json', 'user-agent': 'pushed-by.mjs' } }); if (!r.ok) throw new Error(`activity API: ${r.status}`); return r.json() }
for (let page = 1; page <= 3; page++) {
  let a
  try { a = ghApi(page) } catch { try { a = await anon(page) } catch (e) { console.error(e.message); process.exit(2) } }
  events.push(...a); if (a.length < 100) break
}
let bad = 0
for (const s of shas) {
  const e = events.find(e => anc(s, e.after) && !(/^0+$/.test(e.before)) && !anc(s, e.before))
  const who = e?.actor?.login || 'unknown (older than the activity window, or not on dev)'
  const ok = ANGELO.includes(who)
  if (!ok) bad++
  console.log(`${s.slice(0, 9)} ${who} ${e?.timestamp || ''} ${ok ? 'ANGELO' : 'NOT-ANGELO'}`)
}
process.exit(bad ? 1 : 0)
