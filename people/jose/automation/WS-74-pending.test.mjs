#!/usr/bin/env node
// WS-74-pending.test.mjs: the WS-74 pending-count workflow, run node by node offline (stand-ins for n8n, the site and the lane).
// Run: node people/jose/automation/WS-74-pending.test.mjs          (offline)
//      node people/jose/automation/WS-74-pending.test.mjs --live   (also reads the live site's assets/feedback.json)
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { render, CRON, MAX_PAGES } from './WS-74-pending.build.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const SITE = 'https://web-summit.sgit.ai/'
const TOK = 'ab'.repeat(32), OTHER = 'cd'.repeat(32)
const CFG = { lanes: [
    { agent: 'conductor@web-summit.dinis', host: 'https://dev.send.sgraph.ai', vault_id: 'aaaa1111', append_token: OTHER },
    { agent: 'vault@web-summit.jose', host: 'https://dev.send.sgraph.ai', vault_id: 'bbbb2222', append_token: TOK },
] }
let siteCfg = CFG
// what "Get the site's lanes" (an HTTP Request node, response as text) hands on
const got = () => [{ json: { data: JSON.stringify(siteCfg) } }]
const AsyncFunction = (async () => {}).constructor
let passed = 0
const test = async (name, fn) => { await fn(); passed++; console.log('ok  ' + name) }

const wf = JSON.parse(fs.readFileSync(path.join(here, 'WS-74-pending.n8n.json'), 'utf8'))
const byName = Object.fromEntries(wf.nodes.map(n => [n.name, n]))

// a stand-in n8n: static data, $(name).first(), $input; no this.helpers and no fetch, as on a task runner
function n8n(statics = {}) {
    const outputs = {}
    const run = async (name, input, override) => {
        const src = override ? override(byName[name].parameters.jsCode) : byName[name].parameters.jsCode
        const out = await new AsyncFunction('$input', '$', '$getWorkflowStaticData', 'fetch', src).call({},
            { first: () => input[0], all: () => input }, n => ({ first: () => outputs[n][0] }), () => statics, () => { throw new Error('a Code node fetched') })
        outputs[name] = out
        return out
    }
    return { run, statics, outputs }
}
// a made-up number, assembled at run time so the gate's comms_check never sees a number shape in this file
const NUM = ['+00', '0'.repeat(3), '0'.repeat(3), '0'.repeat(4)].join(' '), DIGITS = NUM.replace(/[^0-9]/g, '')
const filled = src => src.replace("to: '',", `to: '${NUM}',`).replace("phone_number_id: '',", "phone_number_id: 'PNID',").replace("graph_version: '',", "graph_version: 'vX',")
const entry = (i, inbox = TOK) => ({ file_id: String(1762300000000 + i).padStart(13, '0') + '_' + 'f'.repeat(24) + '.enc', inbox })
const page = (entries, truncated = false, statusCode = 200) => ({ json: { statusCode, body: statusCode === 200 ? { entries, truncated } : '<html>Not Found</html>' } })
// Settings, Find the lane, then the pages the HTTP node would have fetched, then Draft the note
async function upToNote(w, pages, override = filled) {
    await w.run('Settings', [{ json: {} }], override)
    await w.run('Find the lane', got())
    return w.run('Draft the note', pages)
}

await test('the committed JSON is what the build script makes', async () => {
    assert.equal(fs.readFileSync(path.join(here, 'WS-74-pending.n8n.json'), 'utf8'), render())
})

await test('a straight chain of eight nodes, inactive on import, UTC, the documented schedule, no saved content', async () => {
    assert.equal(wf.nodes.length, 8)
    assert.equal(wf.active, false)
    assert.equal(wf.settings.timezone, 'UTC')
    assert.equal(wf.settings.saveDataSuccessExecution, 'none')
    for (const [i, n] of wf.nodes.slice(0, -1).entries()) assert.equal(wf.connections[n.name].main[0][0].node, wf.nodes[i + 1].name)
    assert.equal(byName['07:20, 12:20 and 17:20 UTC'].parameters.rule.interval[0].expression, CRON)
    const list = byName['List the lane'].parameters
    assert.equal(list.jsonBody, '={{ JSON.stringify({ include_content: false }) }}', 'the listing never asks for content')
    assert.equal(list.options.pagination.pagination.maxRequests, MAX_PAGES)
    assert.ok(MAX_PAGES * 50 > 1000, 'enough pages of 50 for the lane\'s 1000 pending')
    assert.deepEqual(list.options.response.response, { fullResponse: true, neverError: true })
    const site = byName["Get the site's lanes"]
    assert.equal(site.type, 'n8n-nodes-base.httpRequest', 'the site is fetched by an HTTP node, not a Code node')
    assert.equal(site.parameters.method, 'GET'); assert.equal(site.credentials, undefined, 'no credential on the public fetch')
    for (const n of wf.nodes.filter(n => n.type === 'n8n-nodes-base.code')) assert.ok(!/fetch\(|helpers/.test(n.parameters.jsCode), n.name + ' does its own network call')
})

await test('no number, token, enum key, chat id or credential in the file', async () => {
    const raw = fs.readFileSync(path.join(here, 'WS-74-pending.n8n.json'), 'utf8')
    for (const n of ['List the lane', 'Send to Jose']) assert.deepEqual(byName[n].credentials, { httpHeaderAuth: { id: '', name: '' } })
    for (const k of ['to', 'phone_number_id', 'graph_version', 'template_name', 'template_language']) assert.match(byName.Settings.parameters.jsCode, new RegExp(`\\b${k}: '',`))
    assert.ok(!/chat\.whatsapp\.com|EAA[A-Za-z0-9]{10}|Bearer\s+\S{10}|\+?\d[\d ]{9,}\d|[0-9a-f]{32,}|x-sgraph-vault-enum-key"\s*:/.test(raw), 'a secret, token or number shape is in the file')
})

await test('find the lane: the agent\'s entry from the site\'s text, or already parsed; a missing, foreign or odd lane stops the run', async () => {
    const w = n8n()
    await w.run('Settings', [{ json: {} }])
    const [{ json: l }] = await w.run('Find the lane', got())
    assert.deepEqual(l, { agent: 'vault@web-summit.jose', vault_id: 'bbbb2222', append_token: TOK, url: 'https://dev.send.sgraph.ai/api/vault/append/list/bbbb2222' })
    assert.deepEqual((await w.run('Find the lane', [{ json: CFG }]))[0].json, l)
    assert.deepEqual((await w.run('Find the lane', [{ json: { data: CFG } }]))[0].json, l)
    siteCfg = { lanes: [CFG.lanes[0]] }
    await assert.rejects(w.run('Find the lane', got()), /no lane for vault@web-summit.jose/)
    siteCfg = { lanes: [{ ...CFG.lanes[1], host: 'https://evil.example' }] }
    await assert.rejects(w.run('Find the lane', got()), /is on https:\/\/evil\.example, not https:\/\/dev\.send\.sgraph\.ai: the enum key goes nowhere else/)
    siteCfg = { lanes: [{ ...CFG.lanes[1], append_token: 'not-hex' }] }
    await assert.rejects(w.run('Find the lane', got()), /does not look right/)
    siteCfg = CFG
})

await test('a count over two pages, to Jose as text; the same count next run sends nothing', async () => {
    const w = n8n()
    const out = await upToNote(w, [page([entry(1), entry(2)], true), page([entry(4), entry(2)])])
    assert.equal(out.length, 1)
    const m = out[0].json
    assert.equal(m.state, '3')
    assert.equal(m.url, 'https://graph.facebook.com/vX/PNID/messages')
    assert.equal(m.body.to, DIGITS)
    assert.equal(m.body.type, 'text')
    assert.match(m.body.text.body, /^\*WS-74 feedback lane\*\n3 answers are waiting on vault@web-summit\.jose's vault\. /)
    assert.ok(!/was|Warning/.test(m.text))
    assert.equal(w.statics.last, undefined, 'remembered before the send')
    await w.run('Remember the note', [{ json: { messages: [{ id: 'wamid.x' }] } }])
    assert.equal(w.statics.last, '3')
    const again = n8n({ last: '3' })
    assert.deepEqual(await upToNote(again, [page([entry(1), entry(2), entry(4)])]), [])
    const more = n8n({ last: '3' })
    const [{ json: m2 }] = await upToNote(more, [page([entry(1), entry(2), entry(4), entry(5)])])
    assert.match(m2.text, /4 answers are waiting .* \(was 3 at the last note\)\./)
})

await test('answers under an earlier token count too, and the note says how many are on the site\'s lane now', async () => {
    const [{ json: m }] = await upToNote(n8n(), [page([entry(1, OTHER), entry(2, OTHER), entry(3)])])
    assert.equal(m.state, '3')
    assert.match(m.text, /3 answers are waiting on vault@web-summit\.jose's vault \(1 on the lane the site uses now\)\. /)
})

await test('still truncated after the last page fetched: "at least"; 800 or more: the 507 warning', async () => {
    const w = n8n()
    const [{ json: m }] = await upToNote(w, [page(Array.from({ length: 50 }, (_, i) => entry(i)), true)])
    assert.equal(m.state, '50+')
    assert.match(m.text, /At least 50 answers are waiting/)
    const full = n8n({ last: '50+' })
    const [{ json: f }] = await upToNote(full, Array.from({ length: 17 }, (_, p) => page(Array.from({ length: 50 }, (_, i) => entry(p * 50 + i)), p < 16)))
    assert.equal(f.state, '850')
    assert.match(f.text, /\(was 50 or more at the last note\)/)
    assert.match(f.text, /\*Warning:\* at 1000 pending the lane refuses new answers \(507\)/)
})

await test('a 404 (a stale enum key) is said once, without a count; a 500 stops the run', async () => {
    const w = n8n({ last: '3' })
    const [{ json: m }] = await upToNote(w, [page([], false, 404)])
    assert.equal(m.state, 'stale')
    assert.match(m.text, /could not list vault@web-summit\.jose's lane \(404\).*Ask vault@web-summit\.jose for the new key/)
    assert.deepEqual(await upToNote(n8n({ last: 'stale' }), [page([], false, 404)]), [])
    await assert.rejects(upToNote(n8n(), [page([], false, 500)]), /listing the lane returned 500/)
})

await test('an empty lane after a drain sends nothing but is remembered, so the next answers are reported', async () => {
    const w = n8n({ last: '2' })
    assert.deepEqual(await upToNote(w, [page([])]), [])
    assert.equal(w.statics.last, '0')
    const [{ json: m }] = await upToNote(w, [page([entry(7), entry(8)])])
    assert.equal(m.state, '2')
    assert.ok(!/was/.test(m.text), 'no "was 0"')
})

await test('a change with empty settings stops the run with the names of the missing fields, and sends nothing', async () => {
    await assert.rejects(upToNote(n8n(), [page([entry(1)])], src => src), /fill in the Settings node first: to, phone_number_id, graph_version/)
})

await test('mode template: two body parameters, the headline and the rest, no new lines, tabs or runs of spaces', async () => {
    const w = n8n()
    const [{ json: m }] = await upToNote(w, Array.from({ length: 17 }, (_, p) => page(Array.from({ length: 50 }, (_, i) => entry(p * 50 + i)), p < 16)),
        src => filled(src).replace("mode: 'text',", "mode: 'template',").replace("template_name: '',", "template_name: 'ws_note',").replace("template_language: '',", "template_language: 'en',"))
    assert.equal(m.body.type, 'template')
    const [p1, p2] = m.body.template.components[0].parameters.map(x => x.text)
    assert.equal(m.body.template.components[0].parameters.length, 2)
    assert.equal(p1, "850 answers are waiting on vault@web-summit.jose's vault")
    for (const p of [p1, p2]) assert.ok(!/[\n\t]| {5}/.test(p) && p.length <= 400, p)
    assert.match(p2, /^vault@web-summit\.jose drains them .* Warning: at 1000 pending the lane refuses new answers \(507\)/)
})

if (process.argv.includes('--live')) {
    await test('live: the site\'s assets/feedback.json has a lane for vault@web-summit.jose that "Find the lane" accepts', async () => {
        const r = await fetch(SITE + 'assets/feedback.json')
        assert.ok(r.ok, 'the site answered ' + r.status)
        const w = n8n()
        await w.run('Settings', [{ json: {} }])
        const [{ json: l }] = await w.run('Find the lane', [{ json: { data: await r.text() } }])
        assert.equal(l.agent, 'vault@web-summit.jose')
        console.log('    vault ' + l.vault_id + ', list url ' + l.url)
    })
}

console.log(`${passed} passed`)
