import fs from 'node:fs'
const UA = 'dev.links@PrompTugal.angelo (link checker for promptugal.news; https://web-summit.sgit.ai/people/angelo/)'
const BASE = 'https://promptugal.news/'
const MAXREQ = 2000, MAXPAGES = +process.argv[2] || 700
let reqs = 0 // NOTE run 1 overshot the budget: count BEFORE sending (fix in run 2)
const sleep = ms => new Promise(r => setTimeout(r, ms))
const last = new Map()
async function polite(host) { const w = (last.get(host) || 0) + 1000 - Date.now(); last.set(host, Math.max(Date.now(), last.get(host) || 0 + 1000)); if (w > 0) { last.set(host, Date.now() + w); await sleep(w) } }
async function req(url, method) {
  const host = new URL(url).host
  await polite(host); reqs++
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 15000)
  try { return await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA }, signal: c.signal }) } finally { clearTimeout(t) }
}
async function check(url) {
  try {
    let r = await req(url, 'HEAD')
    if (r.status >= 400) r = await req(url, 'GET')
    return r.status
  } catch (e) { return 'ERR ' + (e.cause?.code || e.name) }
}
const sm = fs.readFileSync('/tmp/claude-0/sm.xml', 'utf8')
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
const inSitemap = new Set(urls)
const links = new Map() // target -> Set(pages)
const pageStatus = {}
let n = 0
for (const u of urls.slice(0, MAXPAGES)) {
  try {
    const r = await req(u, 'GET'); pageStatus[u] = r.status
    if (r.status !== 200) continue
    const html = await r.text(); n++
    for (const m of html.matchAll(/<a\s[^>]*href\s*=\s*["']([^"'#][^"']*)["']/gi)) {
      let h = m[1].replace(/&amp;/g, '&')
      if (/^(mailto:|tel:|javascript:|data:)/i.test(h)) continue
      let abs; try { abs = new URL(h, u).href.split('#')[0] } catch { continue }
      if (!/^https?:/.test(abs)) continue
      if (!links.has(abs)) links.set(abs, new Set()); links.get(abs).add(u)
    }
  } catch (e) { pageStatus[u] = 'ERR ' + (e.cause?.code || e.name) }
}
const results = {}
const internal = [], external = new Map()
for (const t of links.keys()) {
  const h = new URL(t).host
  if (h === 'promptugal.news') { if (!inSitemap.has(t) || !(t in pageStatus)) internal.push(t) }
  else { if (!external.has(h)) external.set(h, []); external.get(h).push(t) }
}
const pending = internal.filter(t => !inSitemap.has(t))
for (const t of pending) { if (reqs > MAXREQ - 50) break; results[t] = await check(t) }
await Promise.all([...external].map(async ([h, ts]) => { for (const t of ts) { if (reqs > MAXREQ - 10) { results[t] = 'not checked (budget)'; continue } results[t] = await check(t) } }))
fs.writeFileSync('/tmp/claude-0/sp/out.json', JSON.stringify({ reqs, pagesFetched: n, totalPages: urls.length, pageStatus, results, links: Object.fromEntries([...links].map(([k, v]) => [k, [...v]])) }))
console.log('done', reqs, n)
