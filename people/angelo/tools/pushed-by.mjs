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
// The activity API pages with a cursor (Link: <...&after=...>; rel="next"); &page= is ignored, so follow the
// cursor until every commit asked about is placed, or MAX_PAGES (fixed 5 November, after vault@web-summit.angelo's a2bd8430).
const MAX_PAGES = 30
const nextOf = link => (String(link || '').match(/<([^>]+)>;\s*rel="next"/) || [])[1]
// GitHub's next link names the repository by numeric id; the agent proxy accepts only repos/<owner>/<repo>, so keep the cursor, swap the path
const canon = u => u && u.replace(/^https:\/\/api\.github\.com\/repositories\/\d+\/activity\?/, API.split('?')[0] + '?')
const viaGh = url => {                                   // authenticated, through the proxy
  const raw = execFileSync('gh', ['api', '-i', url.replace('https://api.github.com/', '')], { encoding: 'utf8', maxBuffer: 64 << 20 })
  const cut = raw.search(/\r?\n\r?\n/), head = raw.slice(0, cut), body = raw.slice(cut).trim()
  return { list: JSON.parse(body), next: nextOf((head.match(/^link:\s*(.*)$/im) || [])[1]) }
}
const viaFetch = async url => {                          // anonymous fallback
  const r = await fetch(url, { headers: { accept: 'application/vnd.github+json', 'user-agent': 'pushed-by.mjs' } })
  if (!r.ok) throw new Error(`activity API: ${r.status}`)
  return { list: await r.json(), next: nextOf(r.headers.get('link')) }
}
const placed = (s, e) => anc(s, e.after) && !(/^0+$/.test(e.before)) && !anc(s, e.before)
let url = API, pages = 0
const found = new Map()                                  // sha -> the push event that brought it
while (url && pages < MAX_PAGES && found.size < shas.length) {
  let r
  try { r = viaGh(url) } catch { try { r = await viaFetch(url) } catch (e) { console.error(e.message); process.exit(2) } }
  pages++; url = canon(r.next)
  for (const e of r.list) for (const s of shas) if (!found.has(s) && placed(s, e)) found.set(s, e)   // only the new page
}
let bad = 0
for (const s of shas) {
  const e = found.get(s)
  const who = e?.actor?.login || `unknown (not found in ${pages} page(s) of pushes, or not on dev)`
  const ok = ANGELO.includes(who)
  if (!ok) bad++
  console.log(`${s.slice(0, 9)} ${who} ${e?.timestamp || ''} ${ok ? 'ANGELO' : 'NOT-ANGELO'}`)
}
process.exit(bad ? 1 : 0)
