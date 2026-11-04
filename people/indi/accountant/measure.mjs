#!/usr/bin/env node
// Token use of this Claude Code session, from its own transcript. Numbers only: no message text is read out.
// Usage: node people/indi/accountant/measure.mjs --agent <name@web-summit.indi> [--task "<what this wake did>"]
//        [--since <ISO time>] [--quality pass|fail|n/a] [--append]
// --append adds one JSON line to people/indi/accountant/ledger/<agent>.jsonl (commit it; it holds no secret).
// Reads ~/.claude/projects/*/<session>.jsonl (the newest, or $CLAUDE_TRANSCRIPT) and its subagents/*.jsonl.
// Each API message is counted once (by message id). Cache reads are kept apart: they cost about a tenth of input.
import fs from 'fs'; import path from 'path'; import os from 'os'
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf('--' + k); return i < 0 ? d : (a[i + 1] ?? true) }
const agent = arg('agent'); if (!agent) { console.error('measure: --agent <name> is required'); process.exit(2) }
const since = arg('since') ? Date.parse(arg('since')) : 0
const root = path.join(os.homedir(), '.claude', 'projects')
const all = fs.existsSync(root) ? fs.readdirSync(root).flatMap(d => fs.readdirSync(path.join(root, d)).filter(f => f.endsWith('.jsonl')).map(f => path.join(root, d, f))) : []
const main = process.env.CLAUDE_TRANSCRIPT || all.sort((x, y) => fs.statSync(y).mtimeMs - fs.statSync(x).mtimeMs)[0]
if (!main) { console.error('measure: no transcript found under ' + root); process.exit(2) }
const subdir = path.join(main.replace(/\.jsonl$/, ''), 'subagents')
const subs = fs.existsSync(subdir) ? fs.readdirSync(subdir).filter(f => f.endsWith('.jsonl')).map(f => path.join(subdir, f)) : []
const K = ['input_tokens', 'output_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens']
function tally(files) {
  const seen = new Set(), t = { calls: 0, by_model: {} }; K.forEach(k => t[k] = 0)
  for (const f of files) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    let e; try { e = JSON.parse(line) } catch { continue }
    const m = e && e.message, u = m && m.usage; if (!u || seen.has(m.id)) continue
    if (since && e.timestamp && Date.parse(e.timestamp) < since) continue
    seen.add(m.id); t.calls++; t.by_model[m.model] = (t.by_model[m.model] || 0) + 1
    K.forEach(k => t[k] += u[k] || 0)
  }
  t.total = K.reduce((s, k) => s + t[k], 0); t.total_without_cache_reads = t.total - t.cache_read_input_tokens
  return t
}
const row = { at: new Date().toISOString(), agent, task: arg('task', null), quality: arg('quality', 'n/a'),
  since: arg('since', null), session: tally([main]), subagents: { count: subs.length, ...tally(subs) } }
const line = JSON.stringify(row)
if (arg('append')) {
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname), 'ledger'); fs.mkdirSync(dir, { recursive: true })
  fs.appendFileSync(path.join(dir, agent.replace(/[^a-z0-9@.-]/gi, '_') + '.jsonl'), line + '\n')
}
console.log(line)
