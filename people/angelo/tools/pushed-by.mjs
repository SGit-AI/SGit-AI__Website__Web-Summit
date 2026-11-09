#!/usr/bin/env node
// Which GitHub account pushed a commit to dev? (the protocol, people/angelo/kit/README.md#protocol)
//   node people/angelo/tools/pushed-by.mjs --last-touch <path>   THE WORKERS' CHECK (spec-new-agents.md, preamble 1b):
//       the last commit on dev that touched <path>, asked of GitHub's commits API (never git log, whose answer in a
//       shallow clone can be the clone's boundary commit: research@'s false stop, 9 November), then who pushed it
//   node people/angelo/tools/pushed-by.mjs <sha> [<sha> ...]
// Prints "<sha> <account> <time> ANGELO|NOT-ANGELO|UNKNOWN" per commit. Exit 0: all Angelo's; 1: one or more pushed by
// someone else; 3: one or more could not be placed (UNKNOWN is not a "no": retry once, then stop and say so).
// A commit is attributed to the push whose range (before..after] contains it, from GitHub's activity API.
// Fresh sessions have shallow clones (8 November: research@ got "unknown" for a commit Angelo pushed): when the local
// history cannot answer "is A an ancestor of B", GitHub's compare API answers instead, so the result is the same anywhere.
// Pages stop once the pushes are older than the commit itself (a push before a commit cannot carry it).
// Read-only: it fetches and prints, nothing more.
import { execFileSync } from 'node:child_process'
const ANGELO = ['riskmandate-angelo', 'the-neuronin']
const API = 'https://api.github.com/repos/SGit-AI/SGit-AI__Website__Web-Summit/activity?ref=refs/heads/dev&per_page=100'
const git = (...a) => { try { execFileSync('git', a, { stdio: 'ignore' }); return true } catch { return false } }
const gitOut = (...a) => { try { return execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return '' } }
const REPO = 'repos/SGit-AI/SGit-AI__Website__Web-Summit'
const api = async path => {                              // gh (authenticated, through the proxy), else anonymous fetch
  try { return JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] })) } catch { }
  const r = await fetch('https://api.github.com/' + path, { headers: { accept: 'application/vnd.github+json', 'user-agent': 'pushed-by.mjs' } })
  if (!r.ok) throw new Error(`${path}: ${r.status}`)
  return r.json()
}
// is a an ancestor of b (or the same)? locally when both are here and the history between them is whole, else GitHub's compare
const shallow = gitOut('rev-parse', '--is-shallow-repository') === 'true'
const have = x => git('cat-file', '-e', x + '^{commit}')
const ancCache = new Map()
const anc = async (a, b) => {
  const k = a + '..' + b; if (ancCache.has(k)) return ancCache.get(k)
  let v
  if (have(a) && have(b) && (!shallow || git('merge-base', '--is-ancestor', a, b))) v = git('merge-base', '--is-ancestor', a, b)   // a yes is always right; a no only on a whole history
  else { try { const c = await api(`${REPO}/compare/${a}...${b}`); v = c.status === 'ahead' || c.status === 'identical' } catch { v = null } }
  ancCache.set(k, v); return v
}
// when the commit was made: pushes older than that cannot carry it
const timeOf = async s => { const t = gitOut('show', '-s', '--format=%cI', s); if (t) return Date.parse(t); try { return Date.parse((await api(`${REPO}/commits/${s}`)).commit.committer.date) } catch { return NaN } }
let shas = process.argv.slice(2)
const lt = shas.indexOf('--last-touch')
if (lt >= 0) {                                           // the path's last commit on dev, from GitHub, whatever this clone's depth
  const p = shas[lt + 1]
  if (!p) { console.error('usage: pushed-by.mjs --last-touch <path>'); process.exit(2) }
  let c
  try { c = (await api(`${REPO}/commits?sha=dev&per_page=1&path=${encodeURIComponent(p)}`))[0] } catch (e) { console.log(`${p}: unknown (GitHub's commits API: ${e.message}) UNKNOWN`); process.exit(3) }
  if (!c) { console.log(`${p}: unknown (no commit on dev touches it) UNKNOWN`); process.exit(3) }
  console.log(`${p}: last touched on dev by ${c.sha.slice(0, 9)} (${String(c.commit?.message || '').split('\n')[0].slice(0, 80)})`)
  shas = [c.sha]
}
if (!shas.length) { console.error('usage: pushed-by.mjs --last-touch <path> | <sha> [...]'); process.exit(2) }
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
const since = new Map(); for (const s of shas) since.set(s, await timeOf(s))
const known = [...since.values()].filter(Number.isFinite)
const oldest = known.length ? Math.min(...known) - 10 * 6e4 : NaN
// 1. the pushes since the oldest commit asked about (newest first, as the API gives them); none at all if no time is known
let url = known.length ? API + '&activity_type=push' : '', pages = 0, apiError = ''
const events = []
while (url && pages < MAX_PAGES) {
  let r
  try { r = viaGh(url) } catch { try { r = await viaFetch(url) } catch (e) { apiError = e.message; break } }
  pages++; url = canon(r.next); events.push(...r.list)
  const last = r.list.length ? Date.parse(r.list[r.list.length - 1].timestamp) : 0
  if (!last || last < oldest) break                     // every push from here on is older than the commits asked about
}
events.sort((x, y) => Date.parse(x.timestamp) - Date.parse(y.timestamp))
// 2. dev's history is one line: the first push after a commit whose new head contains it is the push that carried it
const found = new Map()
for (const s of shas) {
  const t = since.get(s); if (!Number.isFinite(t)) continue
  for (const e of events) {
    if (Date.parse(e.timestamp) < t - 10 * 6e4) continue
    if (await anc(s, e.after)) { found.set(s, e); break }
  }
}
let bad = 0, unknown = 0
for (const s of shas) {
  const e = found.get(s)
  if (!e) { unknown++; console.log(`${s.slice(0, 9)} unknown (${Number.isFinite(since.get(s)) ? `no push to dev carries it, in ${pages} page(s)` : 'no such commit, here or on GitHub'}${apiError ? '; ' + apiError : ''}) UNKNOWN`); continue }
  const who = e.actor?.login || 'unknown', ok = ANGELO.includes(who)
  if (!ok) bad++
  console.log(`${s.slice(0, 9)} ${who} ${e.timestamp || ''} ${ok ? 'ANGELO' : 'NOT-ANGELO'}`)
}
process.exit(bad ? 1 : unknown ? 3 : 0)
