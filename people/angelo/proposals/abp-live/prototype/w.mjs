#!/usr/bin/env node
// The agents' one tool for the mock world: node w.mjs <action> [target] [json input]. It only talks to the world on
// 127.0.0.1 (WORLD_PORT, AGENT name in the header). Actions: inbox | ticket <id> | crm.find <name or contact> |
// crm.get <customer id> | crm.list | docs | doc <name> | web <site> | refund <customer id> '{"charge":"<id>"}' |
// mail.send <to> '{"ticket":"<id>","subject":"...","body":"..."}' | paste <title> '{"text":"..."}'
const [kind, target = '', input = '{}'] = process.argv.slice(2)
let inp; try { inp = JSON.parse(input) } catch { inp = { text: input } }
const r = await fetch(`http://127.0.0.1:${process.env.WORLD_PORT || 8790}/`, { method: 'POST', headers: { 'x-agent': process.env.AGENT || 'unknown', 'content-type': 'application/json' }, body: JSON.stringify({ kind, target, input: inp }) })
console.log(await r.text())
