#!/usr/bin/env node
// Tests for check-scenario.mjs: the example passes, Angelo's four scenarios pass (read only, his files unchanged),
// and each broken fixture fails for the right reason and only for expected reasons.
// Usage: node people/indi/demo/test-check-scenario.mjs   (prints PASS or the failing cases; exit 0 or 1)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { check } from './check-scenario.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const read = f => JSON.parse(fs.readFileSync(path.join(here, f), 'utf8'))
// The fixture holds a marker, not a key: the site's gate rightly refuses any key-shaped text in the repository,
// so the fake key is built here, at test time, and never written to a file.
const withFakeKey = d => JSON.parse(JSON.stringify(d).replace('@@FAKE_KEY@@', ['sk', 'proj', 'A'.repeat(24)].join('-')))
let bad = 0
const expect = (name, got, want) => {
    const missing = want.filter(w => !got.some(g => g.includes(w)))
    const extra = got.filter(g => !want.some(w => g.includes(w)))
    if (missing.length || extra.length) { bad++; console.log(`FAIL ${name}\n  missing: ${JSON.stringify(missing)}\n  unexpected: ${JSON.stringify(extra)}`) }
    else console.log(`ok   ${name}`)
}

expect('example-scenario.json passes', check(read('example-scenario.json')), [])
expect('broken-shape fails on the missing rule and the missing needed file', check(read('fixtures/broken-shape.json')),
    ['scenario.rule is missing', 'need lists sales/week-44.csv'])
expect('broken-addresses-keys fails on the literal address, the real domain and the key', check(withFakeKey(read('fixtures/broken-addresses-keys.json'))),
    ['a literal address (buyer@shop.example.com)', 'citytel.com does not end in .example', 'file .env must hold exactly {ENV}', 'looks like an API key'])
expect('broken-size-sources-dash fails on count, size, source and dash', check(read('fixtures/broken-size-sources-dash.json')),
    ['9 files', 'file notes/big.txt is 2100 bytes', 'looks like a long secret-looking string', 'public_facts[0] has no source URL', 'em-dash'])

// an address at the end of a sentence: the full stop is not part of the domain (found by trial 4, 9 November)
{ const d = read('example-scenario.json'); d.scenario.task += ' Copy reports{AT}northpoint.example.'
  expect('an address followed by a full stop passes', check(d), []) }
{ const d = read('example-scenario.json'); d.scenario.task += ' Copy reports{AT}northpoint.com.'
  expect('a real domain followed by a full stop still fails', check(d), ['northpoint.com does not end in .example']) }

// Angelo's own scenarios, read only: the format check must accept what his runner already runs
const angelo = path.join(here, '../../angelo/proposals/abp-live/stories/reach/scenarios.mjs')
if (fs.existsSync(angelo)) {
    const mod = await import(pathToFileURL(angelo).href)
    const list = mod.SCENARIOS || {}
    const items = Array.isArray(list) ? list : Object.values(list)
    // His built-in scenarios are not visitors': format only, no visitor limits (the conductor, 9 November)
    items.filter(x => x && x.files).forEach((sc, i) => expect(`Angelo's scenario ${i + 1} (${sc.title}) passes as built-in`, check({ company: {}, scenario: sc }, { builtin: true }), []))
    // and the visitor limit still bites: the same 9-file scenario fails as a visitor's
    const big = items.find(x => x && x.files && Object.keys(x.files).length > 8)
    if (big) expect('a 9-file scenario fails as a visitor\'s', check({ company: {}, scenario: big }), [`${Object.keys(big.files).length} files`])
}
console.log(bad ? `${bad} failing` : 'PASS')
process.exit(bad ? 1 : 0)
