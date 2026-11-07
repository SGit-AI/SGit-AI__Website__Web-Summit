#!/usr/bin/env node
// RiskMandate X-ray: the search fan-out (xray@web-summit.dinis, 7 November 2026).
//   node admin/tools/xray-search.mjs <slug> "<subject>" [company|use-case|industry] [--agents a,b,c] [--dry]
// Runs the search agents in parallel through OpenRouter (OPEN_ROUTER_KEY, read from the environment only, never
// printed or written), each asked the same questions about the subject, and writes what they found, with every
// citation they returned and the cost OpenRouter reported, to data/xray/<slug>/search/<stamp>.json.
// What a model says is a lead, not a fact: it reaches a page only once its source has been read.
import fs from 'node:fs'; import path from 'node:path'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const args = process.argv.slice(2)
const flag = n => { const i = args.indexOf('--' + n); return i < 0 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) }
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1] === '--agents'))
const [slug, subject, kind = 'company'] = pos
if (!slug || !subject || !/^[a-z0-9-]+$/.test(slug)) { console.error('usage: xray-search.mjs <slug> "<subject>" [company|use-case|industry]'); process.exit(2) }
export const AGENTS = {
  perplexity: { label: 'Perplexity search', model: 'perplexity/sonar' },
  openai: { label: 'OpenAI search', model: 'openai/gpt-5.4-nano:online' },
  gemini: { label: 'Gemini search', model: 'google/gemini-3.1-flash-lite:online' },
  openrouter: { label: 'OpenRouter web search', model: 'anthropic/claude-haiku-5.5', plugins: [{ id: 'web', max_results: 6 }], max_tokens: 4000 },
}
const ask = s => `You are a research agent for RiskMandate X-ray. Subject (a ${kind}): "${s}".
Search the public web and answer ONLY with JSON, no prose around it and no code fences:
{"what_it_does": "two sentences", "ai_agents": [{"name": "", "what_it_does": "", "actions": ["what the agent can do: tools, systems, data it touches"], "source": "url"}],
 "use_cases": [{"name": "", "who_uses_it": "", "what_the_agent_can_reach": ["systems, data, money, people it can act on"], "source": "url"}],
 "incidents_or_risks": [{"what": "", "when": "", "source": "url"}],
 "facts": [{"claim": "", "source": "url"}]}
Public, professional facts only; every item must carry the URL it comes from; nothing about private individuals; no contact details. If you find nothing for a field, give an empty list.`
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
  const body = { model: a.model, messages: [{ role: 'user', content: ask(subject) }], max_tokens: a.max_tokens || 2500, usage: { include: true } }
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
if (!flag('dry')) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, stamp + '.json'), redact(JSON.stringify(out, null, 1)) + '\n') }
for (const r of results) console.log(`${r.id.padEnd(11)} ${r.model.padEnd(36)} ${r.error ? 'ERROR ' + r.error : r.dry ? 'dry' : `${r.ms}ms $${r.cost_usd} ${r.citations.length} citations ${r.answer_urls.length} urls ${r.answer ? 'json' : 'raw'} ${r.finish}`}`)
console.log(`total $${out.cost_usd} -> data/xray/${slug}/search/${stamp}.json`)
