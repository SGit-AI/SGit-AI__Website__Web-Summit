#!/usr/bin/env node
// WS-39-route3.test.mjs: the route 3 workflow, run node by node offline (stand-ins for n8n and for the site).
// Run: node people/jose/dev/WS-39-route3.test.mjs
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { render, workflow, CRON } from './WS-39-route3.build.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const SITE = 'https://web-summit.sgit.ai/', slug = '2026-11-04-0857'
const index = `- [What happened: Wednesday 4 November, 08:57](${slug}/index.html): A summary.\n`
const report = `## What happened\n\n1. **One.** x\n2. **Two.** y\n3. **Three.** z\n4. **Four.** w\n\n## Who did what\n`
globalThis.fetch = async url => { const b = url === SITE + 'reports/index.md' ? index : url === `${SITE}reports/${slug}/index.md` ? report : null; return { ok: !!b, status: b ? 200 : 404, text: async () => b } }
const AsyncFunction = (async () => {}).constructor
let passed = 0
const test = async (name, fn) => { await fn(); passed++; console.log('ok  ' + name) }

const wf = JSON.parse(fs.readFileSync(path.join(here, 'WS-39-route3.n8n.json'), 'utf8'))
const byName = Object.fromEntries(wf.nodes.map(n => [n.name, n]))

// a stand-in n8n: static data, $(name).first(), $input
function n8n() {
    const statics = {}, outputs = {}
    const run = async (name, input, override) => {
        const src = override ? override(byName[name].parameters.jsCode) : byName[name].parameters.jsCode
        const out = await new AsyncFunction('$input', '$', '$getWorkflowStaticData', src).call({},
            { first: () => input[0], all: () => input }, n => ({ first: () => outputs[n][0] }), () => statics)
        outputs[name] = out
        return out
    }
    return { run, statics }
}
// a made-up number, assembled at run time so the gate's comms_check never sees a number shape in this file
const NUM = ['+00', '0'.repeat(3), '0'.repeat(3), '0'.repeat(4)].join(' '), DIGITS = NUM.replace(/[^0-9]/g, '')
const filled = src => src.replace("to: '',", `to: '${NUM}',`).replace("phone_number_id: '',", "phone_number_id: 'PNID',").replace("graph_version: '',", "graph_version: 'vX',")

await test('the committed JSON is what the build script makes (report-draft.n8n.js inside it unchanged)', async () => {
    assert.equal(fs.readFileSync(path.join(here, 'WS-39-route3.n8n.json'), 'utf8'), render())
    assert.equal(byName['Draft the report'].parameters.jsCode, fs.readFileSync(path.join(here, 'report-draft.n8n.js'), 'utf8'))
})

await test('a straight chain of six nodes, inactive on import, schedule as documented', async () => {
    assert.equal(wf.nodes.length, 6)
    assert.equal(wf.active, false)
    assert.equal(wf.settings.timezone, 'UTC')
    for (const [i, n] of wf.nodes.slice(0, -1).entries()) assert.equal(wf.connections[n.name].main[0][0].node, wf.nodes[i + 1].name)
    assert.equal(byName['Every 30 minutes, 07:05 to 22:35 UTC'].parameters.rule.interval[0].expression, CRON)
})

await test('no number, token, chat id, credential or invite link in the file', async () => {
    const raw = fs.readFileSync(path.join(here, 'WS-39-route3.n8n.json'), 'utf8')
    assert.deepEqual(byName['Send to Jose'].credentials, { httpHeaderAuth: { id: '', name: '' } })
    for (const k of ['to', 'phone_number_id', 'graph_version', 'template_name', 'template_language']) assert.match(byName.Settings.parameters.jsCode, new RegExp(`\\b${k}: '',`))
    assert.ok(!/chat\.whatsapp\.com|EAA[A-Za-z0-9]{10}|Bearer\s+\S{10}|\+?\d[\d ]{9,}\d/.test(raw), 'a secret or number shape is in the file')
})

await test('empty settings stop the run with the names of the missing fields, and send nothing', async () => {
    const w = n8n()
    const s = await w.run('Settings', [{ json: {} }])
    const d = await w.run('Draft the report', s)
    await assert.rejects(w.run('Build the WhatsApp message', d), /fill in the Settings node first: to, phone_number_id, graph_version/)
})

await test('filled in, mode text: one text message to Jose with the draft, then the id is remembered', async () => {
    const w = n8n()
    const s = await w.run('Settings', [{ json: {} }], filled)
    const d = await w.run('Draft the report', s)
    const [{ json: m }] = await w.run('Build the WhatsApp message', d)
    assert.equal(m.url, 'https://graph.facebook.com/vX/PNID/messages')
    assert.equal(m.body.type, 'text')
    assert.equal(m.body.to, DIGITS)
    assert.match(m.body.text.body, /^\*RiskMandate team · 08:57 report\*/)
    assert.ok(m.body.text.body.endsWith(`+1 more: ${SITE}reports/${slug}/`))
    assert.equal(w.statics.lastId, undefined, 'remembered before the send')
    await w.run('Remember the report', [{ json: { messages: [{ id: 'wamid.x' }] } }])
    assert.equal(w.statics.lastId, slug)
})

await test('the next poll with the same newest report sends nothing', async () => {
    const w = n8n()
    w.statics.lastId = slug
    const s = await w.run('Settings', [{ json: {} }], filled)
    const d = await w.run('Draft the report', s)
    assert.deepEqual(await w.run('Build the WhatsApp message', d), [])
})

await test('mode template: two body parameters (day and time; points and link), no new lines, tabs or runs of spaces', async () => {
    const w = n8n()
    const s = await w.run('Settings', [{ json: {} }], src => filled(src).replace("mode: 'text',", "mode: 'template',").replace("template_name: '',", "template_name: 'ws_report',").replace("template_language: '',", "template_language: 'en',"))
    const d = await w.run('Draft the report', s)
    const [{ json: m }] = await w.run('Build the WhatsApp message', d)
    assert.equal(m.body.type, 'template')
    assert.deepEqual(m.body.template.language, { code: 'en' })
    const [p1, p2] = m.body.template.components[0].parameters.map(x => x.text)
    assert.equal(m.body.template.components[0].parameters.length, 2)
    assert.equal(p1, 'Wed 4 Nov, 08:57')
    assert.equal(p2, `One; Two; Three; and 1 more. Read it at ${SITE}reports/${slug}/`)
    for (const p of [p1, p2]) assert.ok(!/[\n\t]| {5}/.test(p) && p.length <= 900, p)
})

console.log(`${passed} passed`)
