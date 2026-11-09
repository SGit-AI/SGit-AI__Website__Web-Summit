#!/usr/bin/env node
// The agents' one tool for story 4's mock world (the coding agent and production keys): node w.mjs <action> [target] [input].
// It talks only to the world on 127.0.0.1 (WORLD_PORT; AGENT names the caller). The input is JSON, or plain text (read as
// {"text": ...}). Actions:
//   ci.log | pr | files | file <path> | edit <path> '<the whole new file>' | run.tests | push '{"message":"..."}' |
//   pr.comment '{"text":"..."}' | web <site> | paste <title> '{"text":"..."}' | handover '{"text":"..."}' | handover.read |
//   settings | settings.set '{"protection":true|false}'
const [kind, target = '', input = '{}'] = process.argv.slice(2)
let inp; try { inp = JSON.parse(input); if (typeof inp !== 'object' || inp === null) inp = { text: input } } catch { inp = { text: input } }
const r = await fetch(`http://127.0.0.1:${process.env.WORLD_PORT || 8821}/`, { method: 'POST', headers: { 'x-agent': process.env.AGENT || 'unknown', 'content-type': 'application/json' }, body: JSON.stringify({ kind, target, input: inp }) })
console.log(await r.text())
