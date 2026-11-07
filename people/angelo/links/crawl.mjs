// dev.links@PrompTugal.angelo: link crawler for promptugal.news.
//   node crawl.mjs <workdir> <firstPage> <lastPage>   (pages are 0-based positions in sitemap.xml order)
// <workdir> holds sitemap.xml (fetched first), unchecked.txt (external links to check first, one per line) and
// receives out.json. Rules: at most 1 request a second per host, one User-Agent naming us, 2,000 requests a run.
// The request counter is raised BEFORE each request is sent (run 1 counted late and overshot), so it cannot overshoot.
import fs from 'node:fs'
const UA = 'dev.links@PrompTugal.angelo (link checker for promptugal.news; https://web-summit.sgit.ai/people/angelo/)'
const [dir, first = 0, last = 1e9] = [process.argv[2], +process.argv[3], +process.argv[4]]
const MAXREQ = 2000
let reqs = 0
const sleep = ms => new Promise(r => setTimeout(r, ms))
const nextSlot = new Map()
const budget = () => reqs < MAXREQ
async function req(url, method) {
  if (!budget()) throw Object.assign(new Error('budget'), { budget: true })
  reqs++                                              // counted before sending
  const host = new URL(url).host
  const at = Math.max(Date.now(), nextSlot.get(host) || 0)
  nextSlot.set(host, at + 1000)                       // reserve this host's next second synchronously
  if (at > Date.now()) await sleep(at - Date.now())
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 15000)
  try { return await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA }, signal: c.signal }) } finally { clearTimeout(t) }
}
async function check(url) {
  try {
    let r = await req(url, 'HEAD')
    if (r.status >= 400) r = await req(url, 'GET')
    return r.status
  } catch (e) { return e.budget ? 'not checked (budget)' : 'ERR ' + (e.cause?.code || e.name) }
}
const sm = fs.readFileSync(`${dir}/sitemap.xml`, 'utf8')
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
const inSitemap = new Set(urls)
const results = {}
const pre = fs.existsSync(`${dir}/unchecked.txt`) ? fs.readFileSync(`${dir}/unchecked.txt`, 'utf8').split('\n').filter(Boolean) : []
const byHost = ts => { const m = new Map(); for (const t of ts) { const h = new URL(t).host; if (!m.has(h)) m.set(h, []); m.get(h).push(t) } return m }
const runHosts = ts => Promise.all([...byHost(ts)].map(async ([, list]) => { for (const t of list) results[t] = await check(t) }))
// A. the links the last run could not reach for budget
await runHosts(pre)
// B. the next pages
const links = new Map(), pageStatus = {}
let n = 0
for (const u of urls.slice(first, last)) {
  if (!budget()) break
  try {
    const r = await req(u, 'GET'); pageStatus[u] = r.status
    if (r.status !== 200) continue
    const html = await r.text(); n++
    for (const m of html.matchAll(/<a\s[^>]*href\s*=\s*["']([^"'#][^"']*)["']/gi)) {
      const h = m[1].replace(/&amp;/g, '&')
      if (/^(mailto:|tel:|javascript:|data:)/i.test(h)) continue
      let abs; try { abs = new URL(h, u).href.split('#')[0] } catch { continue }
      if (!/^https?:/.test(abs)) continue
      if (!links.has(abs)) links.set(abs, new Set()); links.get(abs).add(u)
    }
  } catch (e) { pageStatus[u] = e.budget ? 'not fetched (budget)' : 'ERR ' + (e.cause?.code || e.name) }
}
// C. internal links to pages not in the sitemap, then new external links
const internal = [], external = []
for (const t of links.keys()) {
  if (t in results) continue
  if (new URL(t).host === 'promptugal.news') { if (!inSitemap.has(t)) internal.push(t) } else external.push(t)
}
for (const t of internal) results[t] = await check(t)
await runHosts(external)
fs.writeFileSync(`${dir}/out.json`, JSON.stringify({ reqs, pagesFetched: n, totalPages: urls.length, pageStatus, results, links: Object.fromEntries([...links].map(([k, v]) => [k, [...v]])) }))
console.log('done', { reqs, pagesFetched: n, totalPages: urls.length, checked: Object.keys(results).length })
