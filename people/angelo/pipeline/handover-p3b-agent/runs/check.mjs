// The build step's own check: every repository path named in the pipeline's library, and whether it exists.
// Run from the repository root: node people/angelo/pipeline/handover-p3b-agent/runs/check.mjs > out.json
import fs from 'node:fs'; import path from 'node:path';
const dir = 'people/angelo/pipeline';
const files = ['ROLES.md', 'QUEUE.md', ...['skills', 'formats'].flatMap(d =>
  fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith('.md')).map(f => `${d}/${f}`))];
const re = /(?<![\w.\/:-])((?:[\w.-]+\/)+[\w.*{}<>-]+|[\w-]+\.(?:md|mjs|js|json|jsonl|sh|yml))(?![\w\/])/g;
const named = new Map();
for (const f of files) for (const line of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
  for (const m of line.replace(/https?:\/\/\S+/g, '').matchAll(re)) {
    const p = m[1].replace(/[.,:;)]+$/, '');
    if (!named.has(p)) named.set(p, new Set()); named.get(p).add(f);
  }
}
const out = [...named].sort().map(([p, from]) => {
  const pattern = /[{}<>*]/.test(p);
  const exists = !pattern && (fs.existsSync(p) || fs.existsSync(path.join(dir, p)));
  return { path: p, exists: pattern ? 'pattern' : exists, from: [...from] };
});
console.log(JSON.stringify({ count: out.length, existing: out.filter(o => o.exists === true).length,
  missing: out.filter(o => o.exists === false).length, patterns: out.filter(o => o.exists === 'pattern').length, paths: out }, null, 1));
