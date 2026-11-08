#!/usr/bin/env node
// RiskMandate X-ray: the search fan-out (xray@web-summit.dinis, 7 November 2026).
//   node admin/tools/xray-search.mjs <slug> "<subject>" [company|use-case|industry] [--agents a,b,c] [--dry]
// Runs the search agents in parallel through OpenRouter (OPEN_ROUTER_KEY, read from the environment only, never
// printed or written), each asked the same questions about the subject, and writes what they found, with every
// citation they returned and the cost OpenRouter reported, to data/xray/<slug>/search/<stamp>.json.
// What a model says is a lead, not a fact: it reaches a page only once its source has been read.
import fs from 'node:fs'; import path from 'node:path'
import { AGENTS, ask, DEFAULT_MAX_TOKENS } from './xray-ask.mjs'   // the agents and the question, shared with the run pages
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const args = process.argv.slice(2)
const flag = n => { const i = args.indexOf('--' + n); return i < 0 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) }
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1] === '--agents'))
const [slug, subject, kind = 'company'] = pos
if (!slug || !subject || !/^[a-z0-9-]+$/.test(slug)) { console.error('usage: xray-search.mjs <slug> "<subject>" [company|use-case|industry]'); process.exit(2) }
export { AGENTS }
const want = flag('agents')
const picked = want && want !== true ? String(want).split(',') : Object.keys(AGENTS)
// citations come back in several shapes: Perplexity's top-level `citations`, url_citation annotations (flat or nested)
function citationsOf(j, m) {
  const out = []
  for (const x of (m.annotations || [])) {
    const c = x.url_citation || x
    if (c && c.url) out.push({ url: c.url, title: c.title || '' })
  }
  for (const u of (j.citations || [])) out.push({ url: typeof u === 'string' ? u : u.url, title: (u && u.title) || '' })
  for (const r of (j.search_results || [])) if (r && r.url) out.push({ url: r.url, title: r.title || '' })
  return [...new Map(out.filter(c => /^https?:/.test(c.url)).map(c => [c.url, c])).values()]
}
// a JSON-only answer carries its sources inside the JSON (url_citation annotations come only with prose), so those
// URLs are kept too, as the URLs the model named: still leads until read
export const urlsIn = v => [...new Set((JSON.stringify(v || '').match(/https?:\/\/[^\s"'<>)\]\\]+/g) || []).map(u => u.replace(/[.,;]+$/, '').replace(/[?&]utm_source=openai$/, '')))]
async function run(id) {
  const a = AGENTS[id], t0 = Date.now()
  if (!a) return { id, model: '?', error: 'no such agent' }
  const body = { model: a.model, messages: [{ role: 'user', content: ask(subject, kind) }], max_tokens: a.max_tokens || DEFAULT_MAX_TOKENS, usage: { include: true } }
  if (a.plugins) body.plugins = a.plugins
  if (flag('dry')) return { id, ...a, dry: true }
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`, 'Content-Type': 'application/json', 'X-Title': 'RiskMandate X-ray' },
      body: JSON.stringify(body) })
    const j = await r.json()
    if (!r.ok) return { id, ...a, error: (j.error && j.error.message) || String(r.status), ms: Date.now() - t0 }
    const m = (j.choices && j.choices[0] && j.choices[0].message) || {}
    let parsed = null; const txt = (m.content || '').replace(/```(?:json)?/g, '')
    try { parsed = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1)) } catch {}
    return { id, ...a, ms: Date.now() - t0, cost_usd: j.usage ? j.usage.cost : null, tokens: j.usage ? { in: j.usage.prompt_tokens, out: j.usage.completion_tokens } : null,
             finish: j.choices && j.choices[0] && j.choices[0].finish_reason, citations: citationsOf(j, m), answer_urls: urlsIn(parsed || txt), answer: parsed, raw: parsed ? undefined : txt }
  } catch (e) { return { id, ...a, error: String(e.message || e), ms: Date.now() - t0 } }
}
if (!process.env.OPEN_ROUTER_KEY && !flag('dry')) { console.error('xray-search: OPEN_ROUTER_KEY is not set in this session'); process.exit(1) }
const results = await Promise.all(picked.map(run))
const stamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
const dir = path.join(ROOT, 'data/xray', slug, 'search')
const out = { subject, kind, slug, run_at: new Date().toISOString(), note: 'What each model said, as leads: not facts until their sources are read.',
  cost_usd: +results.reduce((s, r) => s + (r.cost_usd || 0), 0).toFixed(4), agents: results }
// no contact details in the repository: an address a model quotes is replaced before anything is written
export const redact = s => s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g, '[address removed]')
  // and anything the gate's phone rule (admin/tools/comms_check.mjs) would read as a number, even inside a URL (an SEC
  // filing's accession number did, 7 November): a URL that matches is withheld whole, so no broken link is left
  .replace(/https?:\/\/[^\s"]*(?:\+|00)\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}[^\s"]*/g, '[url withheld: it matches the phone check]')
  .replace(/(?:\+|00)\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g, '[number removed]')
if (!flag('dry')) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, stamp + '.json'), redact(JSON.stringify(out, null, 1)) + '\n') }
for (const r of results) console.log(`${r.id.padEnd(11)} ${r.model.padEnd(36)} ${r.error ? 'ERROR ' + r.error : r.dry ? 'dry' : `${r.ms}ms $${r.cost_usd} ${r.citations.length} citations ${r.answer_urls.length} urls ${r.answer ? 'json' : 'raw'} ${r.finish}`}`)
console.log(`total $${out.cost_usd} -> data/xray/${slug}/search/${stamp}.json`)
