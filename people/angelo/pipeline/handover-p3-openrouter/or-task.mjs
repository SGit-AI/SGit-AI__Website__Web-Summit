#!/usr/bin/env node
// or-task.mjs: hand one model task to OpenRouter. Prompt file in, JSON out,
// usage and cost appended to usage.jsonl beside this script.
//
//   node or-task.mjs --prompt p.md --out out.json [--input a.md --input b.md ...]
//        [--tier cheap|strong] [--batch 25] [--trim 2400] [--max-tokens 8000]
//        [--cap 0.50] [--task "one line"] [--dry]
//
// The prompt must ask for one JSON object. With --input, the files are appended
// to the prompt (each as "=== FILE: path ===" then its text), --batch files per
// request; array fields of the replies are concatenated into one object.
// --trim N keeps the first and last N/2 characters of a longer file.
// Hard cap: the run refuses any request whose worst-case cost (prices from
// /api/v1/models) would take the run's spend over --cap USD (at most 0.50).
// The key: OPENROUTER_API_KEY, else the placeholder "proxy-injected" (the
// environment's proxy adds the real key). The key and headers are never logged.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1; without the proxy
// the key is never added (401). Re-run once with it set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status ?? 1);
}

const TIERS = { cheap: 'google/gemini-2.5-flash-lite', strong: 'google/gemini-2.5-flash' };
const API = 'https://openrouter.ai/api/v1';
const HARD_CAP = 0.50;
const LOG = join(dirname(fileURLToPath(import.meta.url)), 'usage.jsonl');

const a = { input: [], tier: 'cheap', batch: 25, trim: 0, 'max-tokens': 8000, cap: HARD_CAP, task: '' };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const k = argv[i].replace(/^--/, '');
  if (k === 'dry') { a.dry = true; continue; }
  const v = argv[++i];
  if (k === 'input') a.input.push(v); else a[k] = v;
}
if (!a.prompt || !a.out) { console.error('usage: --prompt <file> --out <file> [--input <file>]...'); process.exit(2); }
const model = TIERS[a.tier] || a.tier;
const cap = Math.min(Number(a.cap), HARD_CAP);
const key = process.env.OPENROUTER_API_KEY || 'proxy-injected';
const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

const trim = (t) => { const n = Number(a.trim); return n && t.length > n ? t.slice(0, n / 2) + '\n[...]\n' + t.slice(-n / 2) : t; };
const base = readFileSync(a.prompt, 'utf8');
const groups = [];
if (!a.input.length) groups.push([]);
for (let i = 0; i < a.input.length; i += Number(a.batch)) groups.push(a.input.slice(i, i + Number(a.batch)));
const bodyOf = (g) => base + g.map((f) => `\n\n=== FILE: ${f} ===\n${trim(readFileSync(f, 'utf8'))}`).join('');

const models = (await (await fetch(`${API}/models`)).json()).data;
const m = models.find((x) => x.id === model);
if (!m) { console.error(`unknown model ${model}`); process.exit(2); }
const pIn = Number(m.pricing.prompt), pOut = Number(m.pricing.completion);

let spent = 0; const merged = {}; let failed = 0;
for (const [n, g] of groups.entries()) {
  const text = bodyOf(g);
  const worst = (text.length / 2.5) * pIn + Number(a['max-tokens']) * pOut; // 2.5 chars per token, pessimistic
  if (spent + worst > cap) { console.error(`refused: request ${n + 1} could cost ${worst.toFixed(4)} USD, spent ${spent.toFixed(4)}, cap ${cap}`); failed++; break; }
  if (a.dry) { console.log(`dry: request ${n + 1}, ${g.length} files, ${text.length} chars, worst case ${worst.toFixed(4)} USD`); continue; }
  const t0 = Date.now();
  let res, d, tries = 0;
  for (const wait of [2, 4, 8, 16, 0]) { // retry rate limits (429) and 5xx, backing off
    tries++;
    res = await fetch(`${API}/chat/completions`, { method: 'POST', headers, body: JSON.stringify({
      model, messages: [{ role: 'user', content: text }], max_tokens: Number(a['max-tokens']),
      temperature: 0, response_format: { type: 'json_object' }, usage: { include: true } }) });
    d = await res.json().catch(() => ({}));
    if (!(res.status === 429 || res.status >= 500) || !wait) break;
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
  const u = d.usage || {};
  spent += u.cost || 0;
  let ok = false;
  try {
    const raw = d.choices[0].message.content.replace(/^```(json)?\s*|\s*```$/g, '');
    const j = JSON.parse(raw);
    for (const [k, v] of Object.entries(j)) merged[k] = Array.isArray(v) ? (merged[k] || []).concat(v) : v;
    ok = true;
  } catch { failed++; console.error(`request ${n + 1}: no JSON (HTTP ${res.status}${d.error ? ', ' + d.error.message : ''})`); }
  appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString().slice(0, 16) + 'Z', task: a.task, tier: a.tier,
    model: d.model || model, id: d.id, files: g.length, prompt_tokens: u.prompt_tokens, completion_tokens: u.completion_tokens,
    cost_usd: u.cost, ms: Date.now() - t0, tries, ok }) + '\n');
}
if (!a.dry) writeFileSync(a.out, JSON.stringify(merged, null, 1) + '\n');
console.log(`requests ${groups.length}, failed ${failed}, spent ${spent.toFixed(5)} USD, model ${model}`);
process.exit(failed ? 1 : 0);
