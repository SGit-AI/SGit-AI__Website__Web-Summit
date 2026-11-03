#!/usr/bin/env node
// report-draft.test.mjs: report-draft.mjs and report-draft.n8n.js give the same draft, and the channel texts keep their limits.
// Offline: a made-up list and report, served to both through a stand-in fetch. Run: node people/jose/dev/report-draft.test.mjs
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import * as cli from './report-draft.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const SITE = 'https://web-summit.sgit.ai/'
const slug = '2026-11-03-0057', link = `${SITE}reports/${slug}/`
const index = `# The reports\n\n- [What happened: Tuesday 3 November, 00:57](${slug}/index.html): A summary with <angle> & ampersand.\n- [The newsletter](2026-11-02-newsletter/index.html): not a report\n`
const report = n => `---\ntitle: x\n---\n## What happened\n\n` + Array.from({ length: n }, (_, i) => `${i + 1}. **Point number ${i + 1} is here.** Detail.`).join('\n') + '\n\n## Who did what\n\n1. **Not this.** x\n'
const serve = n => async url => {
    const body = url === SITE + 'reports/index.md' ? index : url === `${SITE}reports/${slug}/index.md` ? report(n) : null
    return { ok: !!body, status: body ? 200 : 404, text: async () => body }
}
const n8nSrc = fs.readFileSync(path.join(here, 'report-draft.n8n.js'), 'utf8')
const AsyncFunction = (async () => {}).constructor
const runN8n = (json, opts = {}) => new AsyncFunction('$input', n8nSrc).call(opts.self || {}, { first: () => ({ json }) })
const strip = d => { const { created_at, ...rest } = d; assert.match(created_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); return rest }
let passed = 0
const test = async (name, fn) => { await fn(); passed++; console.log('ok  ' + name) }

for (const n of [7, 2, 60]) {
    globalThis.fetch = serve(n)
    const item = cli.parseIndex(index)[0]
    for (const look of ['full', 'three', 'line']) {
        await test(`${n} points, look ${look}: n8n equals the CLI`, async () => {
            const make = { full: cli.draft, three: cli.draftThree, line: cli.draftLine }[look]
            const mine = cli.enrich(make(item, report(n)))
            const [{ json }] = await runN8n(look === 'full' ? {} : { look })
            assert.deepEqual(strip(json), strip(mine))
            assert.equal(json.id, slug)
            assert.equal(json.source_url, `${SITE}reports/${slug}/index.md`)
            assert.ok(json.text_whatsapp.length < 1000, `text_whatsapp is ${json.text_whatsapp.length} characters`)
            assert.ok(json.text_whatsapp.includes(link), 'text_whatsapp keeps the link')
            assert.ok(json.text_slack.includes(`<${link}|`), 'text_slack links with Slack mrkdwn')
            assert.ok(!/<angle>| & /.test(json.text_slack), 'text_slack escapes < > &')
        })
    }
}

await test('a text over 1000 characters is cut to under 1000, keeping the link', async () => {
    const long = { slug, link, text: `*Title*\n` + Array.from({ length: 80 }, (_, i) => `• Point ${i}`).join('\n') + `\n\n${link}` }
    const out = cli.enrich(long).text_whatsapp
    assert.ok(out.length < 1000 && out.endsWith(link), `${out.length} characters`)
})

await test('--since the newest: { new: false, id }', async () => {
    globalThis.fetch = serve(7)
    const [{ json }] = await runN8n({ since: slug })
    assert.deepEqual(json, { new: false, id: slug, slug })
})

await test('n8n: uses this.helpers.httpRequest when the Code node has it', async () => {
    globalThis.fetch = async () => { throw new Error('fetch should not be called') }
    const f = serve(7), self = { helpers: { httpRequest: async ({ url }) => (await f(url)).text() } }
    const [{ json }] = await runN8n({ look: 'three' }, { self })
    assert.equal(json.look, 'three')
})

await test('n8n: an unknown look throws', async () => {
    globalThis.fetch = serve(7)
    await assert.rejects(runN8n({ look: 'x' }), /unknown look x/)
})

console.log(`${passed} passed`)
