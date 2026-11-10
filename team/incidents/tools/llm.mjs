#!/usr/bin/env node
// The model ledger's one wrapper (incident.dev@web-summit.dinis, 10 November 2026, WS-214; ROADMAP P0.4, Dinis's direction ~19:15):
// every model call the incident team makes goes through call() here, ours or OpenRouter's, so every call is stored and counted.
//   - the RAW record (request, response, error) goes to the raw store: INCIDENT_RAW_DIR (default ~/.incident-raw), never this
//     repository; when that folder is an sgit vault checkout, its owner commits and pushes it (sgit), the wrapper only writes;
//   - ONE LEDGER LINE per call goes to team/incidents/ledger/<UTC date>.jsonl (INCIDENT_LEDGER_DIR): when, task, agent, provider,
//     model asked and served, tokens in and out, the cost the provider reported, latency, status, the day's cap, and the raw
//     record's name and sha256. No prompt or answer text in the ledger: that stays in the raw store (press text may not be ours to publish);
//   - a DAILY CAP (LLM_DAILY_CAP_USD, default 5): a call is refused, and the refusal recorded, once the day's ledger reaches it.
// Key: OPEN_ROUTER_KEY from the environment only (as admin/tools/xray-search.mjs). Until Dinis adds it (ROADMAP question 2), run
// with --mock (a canned answer, no network) or a dummy key (the call is made, refused 401, and recorded as an error).
// A prototype until the incident site's repository exists; then it moves there with the raw store on the data lane (J2).
//
// As a module:  import { call } from './llm.mjs'; const r = await call({ task: 'WS-214/curate', agent: 'curator@…', model, messages })
// From a shell: node team/incidents/tools/llm.mjs --task WS-214/test --agent incident.dev@web-summit.dinis [--model M] [--mock] "prompt"
//               node team/incidents/tools/llm.mjs --summary [YYYY-MM-DD]
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../../..')
const LEDGER_DIR = process.env.INCIDENT_LEDGER_DIR || path.join(REPO, 'team/incidents/ledger')
const RAW_DIR = process.env.INCIDENT_RAW_DIR || path.join(os.homedir(), '.incident-raw')
const CAP = +(process.env.LLM_DAILY_CAP_USD || 5)
const DEFAULT_MODEL = process.env.LLM_MODEL || 'anthropic/claude-haiku-5.5'
const PROVIDERS = {
    openrouter: { url: 'https://openrouter.ai/api/v1/chat/completions', key: () => process.env.OPEN_ROUTER_KEY },
}

const day = (d = new Date()) => d.toISOString().slice(0, 10)
const ledgerFile = (d = day()) => path.join(LEDGER_DIR, `${d}.jsonl`)
export function readLedger(d = day()) { try { return fs.readFileSync(ledgerFile(d), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) } catch { return [] } }
export const spentToday = () => readLedger().reduce((s, l) => s + (l.cost_usd || 0), 0)

function inRepo(p) { const r = path.relative(REPO, path.resolve(p)); return !r.startsWith('..') && !path.isAbsolute(r) }
if (inRepo(RAW_DIR)) throw new Error(`llm.mjs: INCIDENT_RAW_DIR (${RAW_DIR}) is inside the repository; raw captures never go to git`)

function writeRaw(rec) {
    const dir = path.join(RAW_DIR, rec.at.slice(0, 10)); fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
    const name = `${rec.id}.json`, body = JSON.stringify(rec, null, 1) + '\n'
    fs.writeFileSync(path.join(dir, name), body, { mode: 0o600 })
    return { raw: `${rec.at.slice(0, 10)}/${name}`, raw_sha256: crypto.createHash('sha256').update(body).digest('hex').slice(0, 16), raw_bytes: Buffer.byteLength(body) }
}
function appendLedger(line) { fs.mkdirSync(LEDGER_DIR, { recursive: true }); fs.appendFileSync(ledgerFile(line.at.slice(0, 10)), JSON.stringify(line) + '\n') }

// the one call. Returns { text, line } (line: the ledger line written); never throws for a provider error: it is recorded and returned
export async function call({ task, agent, model = DEFAULT_MODEL, messages, max_tokens = 2000, provider = 'openrouter', mock = false, extra = {} }) {
    if (!task || !agent || !Array.isArray(messages)) throw new Error('call({ task, agent, messages }) needs all three')
    const at = new Date().toISOString(), id = `${at.replace(/[-:.]/g, '').slice(0, 15)}-${crypto.randomBytes(4).toString('hex')}`
    const base = { at: at.slice(0, 19) + 'Z', id, task, agent, provider: mock ? 'mock' : provider, model, cap_usd: CAP }
    const request = { model, messages, max_tokens, usage: { include: true }, ...extra }
    const spent = spentToday()
    if (!mock && spent >= CAP) {
        const line = { ...base, status: 'refused_cap', spent_today_usd: +spent.toFixed(4), tokens_in: 0, tokens_out: 0, cost_usd: 0, latency_ms: 0 }
        appendLedger(line); return { text: null, line }
    }
    const t0 = Date.now(); let status = 'ok', response = null, error = null, text = null
    try {
        if (mock) response = { model: model + ' (mock)', choices: [{ message: { role: 'assistant', content: 'mock answer to: ' + String(messages.at(-1).content).slice(0, 80) }, finish_reason: 'stop' }], usage: { prompt_tokens: 12, completion_tokens: 8, cost: 0 } }
        else {
            const P = PROVIDERS[provider]; if (!P) throw new Error('unknown provider ' + provider)
            const c = new AbortController(), timer = setTimeout(() => c.abort(), 120000)
            try {
                const r = await fetch(P.url, { method: 'POST', signal: c.signal, headers: { Authorization: `Bearer ${P.key() || 'missing'}`, 'Content-Type': 'application/json', 'X-Title': 'WS-214 incident team' }, body: JSON.stringify(request) })
                const body = await r.text(); try { response = JSON.parse(body) } catch { response = { raw: body.slice(0, 4000) } }
                if (!r.ok) { status = 'http_' + r.status; error = (response.error && response.error.message) || body.slice(0, 300) }
            } finally { clearTimeout(timer) }
        }
        if (response && response.choices) text = response.choices[0]?.message?.content ?? null
    } catch (e) { status = 'error'; error = String(e.message || e) }
    const ms = Date.now() - t0, u = (response && response.usage) || {}
    const raw = writeRaw({ ...base, request, response, error, latency_ms: ms })
    const line = { ...base, model_served: response && response.model || null, status, tokens_in: u.prompt_tokens ?? 0, tokens_out: u.completion_tokens ?? 0, cost_usd: typeof u.cost === 'number' ? u.cost : 0, latency_ms: ms, ...raw, ...(error ? { error: String(error).slice(0, 200) } : {}) }
    appendLedger(line)
    return { text, line }
}

export function summary(d = day()) {
    const L = readLedger(d), by = k => L.reduce((m, l) => { const v = l[k] || '?'; m[v] = m[v] || { calls: 0, cost_usd: 0, tokens_in: 0, tokens_out: 0 }; m[v].calls++; m[v].cost_usd += l.cost_usd || 0; m[v].tokens_in += l.tokens_in || 0; m[v].tokens_out += l.tokens_out || 0; return m }, {})
    return { day: d, calls: L.length, cost_usd: +L.reduce((s, l) => s + (l.cost_usd || 0), 0).toFixed(6), cap_usd: CAP, by_model: by('model'), by_agent: by('agent'), by_status: by('status') }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : undefined }, has = k => a.includes('--' + k)
    if (has('summary')) { console.log(JSON.stringify(summary(a[a.indexOf('--summary') + 1] || day()), null, 1)); process.exit(0) }
    const rest = []; for (let i = 0; i < a.length; i++) { if (['--task', '--agent', '--model'].includes(a[i])) i++; else if (!a[i].startsWith('--')) rest.push(a[i]) }
    const prompt = rest.join(' ')
    if (!opt('task') || !opt('agent') || !prompt) { console.error('usage: llm.mjs --task T --agent A [--model M] [--mock] "prompt"   |   llm.mjs --summary [date]'); process.exit(2) }
    const { text, line } = await call({ task: opt('task'), agent: opt('agent'), model: opt('model') || DEFAULT_MODEL, mock: has('mock'), messages: [{ role: 'user', content: prompt }] })
    console.log(JSON.stringify(line)); if (text) console.log(text)
    process.exit(line.status === 'ok' ? 0 : 1)
}
