#!/usr/bin/env node
// n8n-build.test.mjs: the two Code nodes of people/jose/dev/n8n-build-guide.md, run the way n8n runs them (an async
// function body with $input and $), on every two-hourly report in content/reports/ and, with --live, on the live site.
// Run: node people/jose/dev/n8n-build/n8n-build.test.mjs [--live]
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..', '..', '..', '..')
const AsyncFunction = (async () => {}).constructor
const node = f => new AsyncFunction('$input', '$', fs.readFileSync(path.join(here, f), 'utf8'))
const findNewest = node('find-newest-report.js'), draft = node('draft-messages.js')
const run = async (indexMd, reportMd) => {
    const [found] = await findNewest({ first: () => ({ json: { data: indexMd } }) })
    const [out] = await draft({ first: () => ({ json: { data: reportMd } }) }, () => ({ first: () => found }))
    return { found: found.json, msg: out.json }
}
let passed = 0
const test = async (name, fn) => { await fn(); passed++; console.log('ok  ' + name) }
const check = (msg, id) => {
    assert.equal(msg.id, id)
    assert.ok(msg.text_whatsapp.length < 1000 && msg.text_whatsapp.includes(msg.link))
    for (const p of [msg.template_when, msg.template_points]) assert.ok(!/[\n\t]| {5}/.test(p) && p.length <= 900, p)
    assert.ok(msg.template_points.includes(msg.link))
    assert.ok(msg.text_slack.includes(`<${msg.link}|`))
}

await test('the guide pastes exactly these two files (n8n-build-guide.md, its js blocks)', async () => {
    const blocks = [...fs.readFileSync(path.join(here, '..', 'n8n-build-guide.md'), 'utf8').matchAll(/```js\n([\s\S]*?)```/g)].map(m => m[1])
    assert.deepEqual(blocks, ['find-newest-report.js', 'draft-messages.js'].map(f => fs.readFileSync(path.join(here, f), 'utf8')))
})
await test('the newsletter is skipped and the newest two-hourly report is found', async () => {
    const idx = '- [The newsletter](2026-11-04-newsletter/index.html): x\n- [What happened: Wednesday 4 November, 22:57](2026-11-04-2257/index.html): A summary.\n'
    const { found, msg } = await run(idx, '## What happened\n\n1. **One.** a\n2. **Two.** b\n3. **Three.** c\n4. **Four.** d\n\n## Who did what\n')
    assert.equal(found.id, '2026-11-04-2257')
    assert.equal(found.source_url, 'https://web-summit.sgit.ai/reports/2026-11-04-2257/index.md')
    assert.equal(msg.template_when, 'Wed 4 Nov, 22:57')
    assert.equal(msg.template_points, 'One; Two; Three; and 1 more. Read it at https://web-summit.sgit.ai/reports/2026-11-04-2257/')
    check(msg, '2026-11-04-2257')
})
await test('a report without numbered points falls back to its summary', async () => {
    const { msg } = await run('- [What happened: Thursday 5 November, 10:57](2026-11-05-1057/index.html): A quiet morning.\n', '## What happened\n\nNothing numbered.\n')
    assert.equal(msg.template_points, 'A quiet morning. Read it at https://web-summit.sgit.ai/reports/2026-11-05-1057/')
    check(msg, '2026-11-05-1057')
})
await test('no report in the list stops the run with a clear error', async () => {
    await assert.rejects(run('nothing\n', ''), /No two-hourly report found/)
})
const dir = path.join(root, 'content', 'reports')
for (const f of fs.readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}-\d{4}\.md$/.test(f))) {
    await test(`the real report ${f}`, async () => {
        const id = f.replace(/\.md$/, '')
        const { msg } = await run(`- [x](${id}/index.html): y\n`, fs.readFileSync(path.join(dir, f), 'utf8'))
        check(msg, id)
    })
}
if (process.argv.includes('--live')) await test('the live site, as the HTTP Request nodes would fetch it', async () => {
    const get = async u => { const r = await fetch(u); assert.ok(r.ok, u); return r.text() }
    const idx = await get('https://web-summit.sgit.ai/reports/index.md')
    const [found] = await findNewest({ first: () => ({ json: { data: idx } }) })
    const { msg } = await run(idx, await get(found.json.source_url))
    check(msg, found.json.id)
    console.log('    ' + msg.text_whatsapp.split('\n')[0] + ' | template: ' + msg.template_when + ' / ' + msg.template_points.slice(0, 70) + '...')
})
console.log(`${passed} passed`)
