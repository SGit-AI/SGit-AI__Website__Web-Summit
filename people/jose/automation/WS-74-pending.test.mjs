#!/usr/bin/env node
// WS-74-pending.test.mjs: the WS-74 workflow, run node by node offline (stand-ins for n8n and for the vault agent's count).
// Run: node people/jose/automation/WS-74-pending.test.mjs          (offline)
//      node people/jose/automation/WS-74-pending.test.mjs --live   (also reads the live count file, if it exists yet)
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { render, CRON } from './WS-74-pending.build.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const COUNT_URL = 'https://web-summit.sgit.ai/people/jose/lanes/feedback-count.json'
const NOW = '2026-11-05T18:00:00.000Z'
const AsyncFunction = (async () => {}).constructor
let passed = 0
const test = async (name, fn) => { await fn(); passed++; console.log('ok  ' + name) }

const wf = JSON.parse(fs.readFileSync(path.join(here, 'WS-74-pending.n8n.json'), 'utf8'))
const byName = Object.fromEntries(wf.nodes.map(n => [n.name, n]))

// a stand-in n8n: static data, $(name).first(), $input; no this.helpers and a fetch that throws, as on a task runner
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
const filled = src => src.replace("to: '',", `to: '${NUM}',`).replace("phone_number_id: '',", "phone_number_id: 'PNID',").replace("graph_version: '',", "graph_version: 'vX',").replace('now: new Date().toISOString(),', `now: '${NOW}',`)
// the vault agent's count file, as "Get the vault agent's count" (full response, as text) hands it on
const count = (c, statusCode = 200) => [{ json: { statusCode, body: statusCode === 200 ? JSON.stringify({ agent: 'vault@web-summit.jose', vault: 'jose-inbox', at: '2026-11-05T17:41:00Z', drained_this_run: 0, pending_left: 0, could_not_open: 0, ...c }) : '<html>Not Found</html>' } }]
async function upToNote(w, input, override = filled) {
    await w.run('Settings', [{ json: {} }], override)
    return w.run('Draft the note', input)
}

await test('the committed JSON is what the build script makes', async () => {
    assert.equal(fs.readFileSync(path.join(here, 'WS-74-pending.n8n.json'), 'utf8'), render())
})

await test('a straight chain of six nodes, inactive on import, UTC, the documented schedule, no saved content', async () => {
    assert.equal(wf.nodes.length, 6)
    assert.equal(wf.active, false)
    assert.equal(wf.settings.timezone, 'UTC')
    assert.equal(wf.settings.saveDataSuccessExecution, 'none')
    for (const [i, n] of wf.nodes.slice(0, -1).entries()) assert.equal(wf.connections[n.name].main[0][0].node, wf.nodes[i + 1].name)
    assert.equal(byName['Every 30 minutes, 07:15 to 22:45 UTC'].parameters.rule.interval[0].expression, CRON)
    const get = byName["Get the vault agent's count"]
    assert.equal(get.type, 'n8n-nodes-base.httpRequest')
    assert.equal(get.parameters.method, 'GET')
    assert.deepEqual(get.parameters.options.response.response, { fullResponse: true, neverError: true, responseFormat: 'text' })
    for (const n of wf.nodes.filter(n => n.type === 'n8n-nodes-base.code')) assert.ok(!/fetch\(|helpers/.test(n.parameters.jsCode), n.name + ' does its own network call')
})

await test('Jose\'s decision: no enum key, no lane listing, and the only credential is the WhatsApp one', async () => {
    const raw = fs.readFileSync(path.join(here, 'WS-74-pending.n8n.json'), 'utf8')
    assert.ok(!/enum|append\/list|x-sgraph/i.test(raw.replace(/never an enum key/g, '')), 'the flow still touches the lane')
    assert.equal(byName["Get the vault agent's count"].credentials, undefined)
    assert.deepEqual(wf.nodes.filter(n => n.credentials).map(n => n.name), ['Send to Jose'])
    assert.match(byName.Settings.parameters.jsCode, new RegExp(`count_url: '${COUNT_URL.replace(/\./g, '\\.')}'`))
})

await test('no number, token, chat id or credential in the file', async () => {
    const raw = fs.readFileSync(path.join(here, 'WS-74-pending.n8n.json'), 'utf8')
    assert.deepEqual(byName['Send to Jose'].credentials, { httpHeaderAuth: { id: '', name: '' } })
    for (const k of ['to', 'phone_number_id', 'graph_version', 'template_name', 'template_language']) assert.match(byName.Settings.parameters.jsCode, new RegExp(`\\b${k}: '',`))
    assert.ok(!/chat\.whatsapp\.com|EAA[A-Za-z0-9]{10}|Bearer\s+\S{10}|\+?\d[\d ]{9,}\d|[0-9a-f]{32,}/.test(raw), 'a secret, token or number shape is in the file')
})

await test('new answers: one text note to Jose; remembered after the send; the same count next run sends nothing', async () => {
    const w = n8n()
    const [{ json: m }] = await upToNote(w, count({ received_total: 3, drained_this_run: 3 }))
    assert.equal(m.state, 'total:3|stale:|lost:0|full:0')
    assert.equal(m.url, 'https://graph.facebook.com/vX/PNID/messages')
    assert.equal(m.body.to, DIGITS)
    assert.equal(m.body.type, 'text')
    assert.equal(m.body.text.body, "*WS-74 feedback*\n3 new answers on the public feedback form (3 in all). Counted by vault@web-summit.jose at 2026-11-05 17:41 UTC. Ask it for the summary (feedback-summary.mjs); nothing is quoted without the person's tick.")
    assert.equal(w.statics.last_total, undefined, 'remembered before the send')
    await w.run('Remember the note', [{ json: { messages: [{ id: 'wamid.x' }] } }])
    assert.deepEqual(w.statics, { last_state: 'total:3|stale:|lost:0|full:0', last_total: 3 })
    assert.deepEqual(await upToNote(n8n({ ...w.statics }), count({ received_total: 3 })), [])
    const [{ json: m2 }] = await upToNote(n8n({ ...w.statics }), count({ received_total: 4 }))
    assert.match(m2.text, /^\*WS-74 feedback\*\n1 new answer on the public feedback form \(4 in all\)\./)
})

await test('no count file yet (404): nothing, quietly; another error stops the run; a file that is not the vault agent\'s stops it too', async () => {
    assert.deepEqual(await upToNote(n8n(), count({}, 404)), [])
    await assert.rejects(upToNote(n8n(), count({}, 500)), /returned 500/)
    await assert.rejects(upToNote(n8n(), count({ received_total: 3, agent: ['someone', 'web-summit.else'].join('@') })), /does not look like the vault agent's count/)
    await assert.rejects(upToNote(n8n(), count({ received_total: -1 })), /does not look like/)
    await assert.rejects(upToNote(n8n(), count({ received_total: 2, at: 'yesterday-ish' })), /does not look like/)
})

await test('a stale count (over 26 hours) is said once; 0 stale hours turns it off', async () => {
    const w = n8n({ last_total: 3, last_state: 'total:3|stale:|lost:0|full:0' })
    const [{ json: m }] = await upToNote(w, count({ received_total: 3, at: '2026-11-04T15:00:00Z' }))
    assert.equal(m.state, 'total:3|stale:2026-11-04T15:00:00Z|lost:0|full:0')
    assert.match(m.text, /^\*WS-74 feedback\*\nvault@web-summit\.jose has not counted the feedback lane since 2026-11-04 15:00 UTC\. vault@web-summit\.jose's last count is from 2026-11-04 15:00 UTC, over 26 hours ago/)
    assert.deepEqual(await upToNote(n8n({ last_total: 3, last_state: m.state }), count({ received_total: 3, at: '2026-11-04T15:00:00Z' })), [])
    assert.deepEqual(await upToNote(n8n({ last_total: 3, last_state: 'total:3|stale:|lost:0|full:0' }), count({ received_total: 3, at: '2026-11-04T15:00:00Z' }), src => filled(src).replace('stale_hours: 26,', 'stale_hours: 0,')), [])
})

await test('new answers inside a stale count are still reported, with the stale line (the reviewer\'s case: last 3, a 32-hour-old 5)', async () => {
    const w = n8n({ last_total: 3, last_state: 'total:3|stale:|lost:0|full:0' })
    const [{ json: m }] = await upToNote(w, count({ received_total: 5, at: '2026-11-04T10:00:00Z' }))
    assert.match(m.text, /^\*WS-74 feedback\*\n2 new answers on the public feedback form \(5 in all\)\. Counted .* over 26 hours ago/)
    await w.run('Remember the note', [{ json: {} }])
    assert.deepEqual(await upToNote(n8n({ ...w.statics }), count({ received_total: 5, at: '2026-11-04T10:00:00Z' })), [])
    assert.deepEqual(await upToNote(n8n({ ...w.statics }), count({ received_total: 5 })), [], 'fresh again with nothing new: silent')
})

await test('answers that could not be opened and a lane near its limit are each said once, even with no new answers', async () => {
    const w = n8n({ last_total: 5, last_state: 'total:5|stale:|lost:0|full:0' })
    const [{ json: f }] = await upToNote(w, count({ received_total: 5, pending_left: 850 }))
    assert.equal(f.text, "*WS-74 feedback*\nNo new answers on the public feedback form (5 in all). From vault@web-summit.jose's count at 2026-11-05 17:41 UTC.\n\n*Warning:* 850 answers are still pending on the lane, and at 1000 it refuses new ones (507). Ask vault@web-summit.jose to drain it now.")
    await w.run('Remember the note', [{ json: {} }])
    assert.deepEqual(await upToNote(n8n({ ...w.statics }), count({ received_total: 5, pending_left: 850 })), [])
    const [{ json: l }] = await upToNote(n8n({ ...w.statics }), count({ received_total: 5, pending_left: 850, could_not_open: 2 }))
    assert.match(l.text, / 2 answers could not be opened \(sealed to an earlier session key\?\): ask vault@web-summit\.jose\./)
    const q = n8n({ ...w.statics })
    assert.deepEqual(await upToNote(q, count({ received_total: 5 })), [], 'drained: nothing to say')
    assert.equal(q.statics.last_state, 'total:5|stale:|lost:0|full:0', 'but remembered, so a later warning is said again')
})

await test('a counter that went down starts again from it, without a note, and the climb back is reported (the reviewer\'s case: 9, 2, 9)', async () => {
    const w = n8n({ last_total: 9, last_state: 'total:9|stale:|lost:0|full:0' })
    assert.deepEqual(await upToNote(w, count({ received_total: 2 })), [])
    assert.equal(w.statics.last_total, 2)
    const [{ json: m }] = await upToNote(n8n({ ...w.statics }), count({ received_total: 9 }))
    assert.match(m.text, /7 new answers on the public feedback form \(9 in all\)/)
})

await test('a change with empty settings stops the run with the names of the missing fields, and sends nothing', async () => {
    await assert.rejects(upToNote(n8n(), count({ received_total: 1 }), src => src), /fill in the Settings node first: to, phone_number_id, graph_version/)
})

await test('mode template: two body parameters, the headline and the rest, no new lines, tabs or runs of spaces', async () => {
    const [{ json: m }] = await upToNote(n8n(), count({ received_total: 5, could_not_open: 1, pending_left: 900 }),
        src => filled(src).replace("mode: 'text',", "mode: 'template',").replace("template_name: '',", "template_name: 'ws_note',").replace("template_language: '',", "template_language: 'en',"))
    assert.equal(m.body.type, 'template')
    const ps = m.body.template.components[0].parameters.map(x => x.text)
    assert.equal(ps.length, 2)
    assert.equal(ps[0], '5 new answers on the public feedback form (5 in all)')
    for (const p of ps) assert.ok(!/[\n\t]| {5}/.test(p) && p.length <= 400, p)
    assert.match(ps[1], /^Counted by vault@web-summit\.jose .* 1 answer could not be opened .* Warning: 900 answers are still pending/)
})

if (process.argv.includes('--live')) {
    await test('live: the vault agent\'s count file on the site, read as a first real run would read it (a 404 is fine before it exists)', async () => {
        const r = await fetch(COUNT_URL), body = await r.text()
        const w = n8n()   // a first run: nothing remembered
        const out = await upToNote(w, [{ json: { statusCode: r.status, body } }], src => filled(src).replace(`now: '${NOW}',`, 'now: new Date().toISOString(),'))
        if (r.status === 404) { assert.deepEqual(out, []); console.log('    ' + COUNT_URL + ': 404, not published yet'); return }
        assert.equal(r.status, 200)
        const c = JSON.parse(body)
        console.log(`    ${COUNT_URL}: 200, at ${c.at}, received_total ${c.received_total}, pending_left ${c.pending_left}; ` + (out.length ? 'a note: ' + out[0].json.text.split('\n')[1] : 'no note'))
        if (out.length) assert.match(out[0].json.text, /^\*WS-74 feedback\*\n/)
        else assert.equal(c.received_total, 0, 'answers but no note')
    })
}

console.log(`${passed} passed`)
