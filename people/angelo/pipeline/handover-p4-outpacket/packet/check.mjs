#!/usr/bin/env node
// Our side of packet 2026-11-11-a1-paths-in-angelo-pipeline (handover-p4-outpacket). Read-only; no key, no network.
//   node check.mjs shape <spec.json|packet.json>
//     the rules packets.mjs `new` enforces (Fringe, abp/tools/packets.mjs v1), plus: each input pinned to a commit, text present
//   node check.mjs answer <result.json> --ws DIR --news DIR --fringe DIR
//     the A0 half: for each path a runner returned, does it exist on origin/dev of each clone (a glob or placeholder: any match)
//     prints the JSON answer to the packet's task; it does NOT check the result's signature (packets.mjs verify does)
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const [cmd, file] = process.argv.slice(2);
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

if (cmd === 'shape') {
  const j = read(file), s = j.body || j, bad = [];
  for (const k of ['id', 'altitude', 'from', 'for', 'mandate', 'grant', 'prompt', 'inputs', 'output']) if (!(k in s)) bad.push('missing ' + k);
  if (!['A1', 'A2'].includes(s.altitude)) bad.push('altitude must be A1 or A2');
  if (s.altitude === 'A1' && (s.grant || []).length) bad.push('an A1 packet carries no grant (R12)');
  if (!String(s.prompt).includes('{{input}}')) bad.push('prompt has no {{input}}');
  if (!Array.isArray(s.output?.required) || !s.output.required.length) bad.push('output.required empty');
  for (const i of s.inputs || []) if (!i.id || !/^[0-9a-f]{40}$/.test(i.commit || '') || !i.text) bad.push('input not pinned or empty: ' + i.id);
  const signed = !!(j.sig && j.by?.fp);
  console.log(JSON.stringify({ id: s.id, altitude: s.altitude, inputs: (s.inputs || []).length, signed, ok: !bad.length, problems: bad }));
  process.exitCode = bad.length ? 1 : 0;
} else if (cmd === 'answer') {
  const r = read(file), outs = (r.body || r).outputs || [];
  const repos = { web_summit: arg('--ws'), newsroom: arg('--news'), fringe: arg('--fringe') };
  const trees = Object.fromEntries(Object.entries(repos).map(([k, d]) => [k, execSync('git ls-tree -r -t --name-only origin/dev', { cwd: d, maxBuffer: 1e8 }).toString().split('\n').filter(Boolean)]));
  const toRe = (p) => new RegExp('^' + p.replace(/^\.?\//, '').replace(/\/$/, '').replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/<[^>]*>/g, '[^/]+') + '$');
  const answer = [];
  for (const o of outs) for (const p of o.error ? [] : o.paths || []) {
    const path = typeof p === 'string' ? p : p.path, re = toRe(path);
    answer.push({ named_in: o.input, path, ...Object.fromEntries(Object.entries(trees).map(([k, t]) => [k, t.some((x) => re.test(x))])) });
  }
  const errors = outs.filter((o) => o.error).map((o) => o.input);
  console.log(JSON.stringify({ packet: (r.body || r).packet, runner: (r.body || r).runner, checked_against: 'origin/dev of each clone', paths: answer, inputs_without_answer: errors }, null, 1));
} else console.log('usage: node check.mjs shape <spec.json|packet.json> | answer <result.json> --ws DIR --news DIR --fringe DIR');
