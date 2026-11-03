#!/usr/bin/env node
// Everything in comms/, data/, team/, people/ and board/ is public, forever. This refuses contact details
// and key shapes in them (content/ too once WS-88 is settled; the key shapes are admin/build/secrets.cjs, shared with the gate's check 5).
// Exported for validate.js; run on its own: node admin/tools/comms_check.mjs
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import secrets from '../build/secrets.cjs'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
// agent names are <agent>@web-summit.<person>, where <person> is a member id in data/team.json: a name, not an address
const PEOPLE = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8')).members.map(m => m.id))
const agentName = m => { const d = m.match(/@web-summit\.([a-z0-9-]+)$/); return !!d && PEOPLE.has(d[1]) }
const RULES = [
    [/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?/g, 'an email address', m => agentName(m) || /@web-summit$|noreply@|example\.(com|org)$/.test(m)],
    [/(?:\+|00)\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g, 'a phone number', () => false],
    ...secrets.KEY_RULES.map(([re, what]) => [new RegExp(re.source, 'g'), what, () => false]),
]
function walk(d, out = []) { if (!fs.existsSync(d)) return out; for (const n of fs.readdirSync(d)) { const p = path.join(d, n); fs.statSync(p).isDirectory() ? walk(p, out) : out.push(p) } return out }
// what the build wrote (.generated.txt) is checked through its sources; every other non-binary file is read
const generated = () => { const g = path.join(ROOT, '.generated.txt'); return new Set(fs.existsSync(g) ? fs.readFileSync(g, 'utf8').split('\n').filter(Boolean) : []) }
// content/ joins once WS-88 settles whether a role address (the Drive service account, in content/abp/) may be public;
// until then content/ is key-scanned by the gate's check 5 only
export function check(dirs = ['comms', 'data', 'team', 'people', 'board']) {
    const errors = [], gen = generated()
    for (const f of dirs.flatMap(d => walk(path.join(ROOT, d)))) {
        if (secrets.BINARY.test(f) || gen.has(path.relative(ROOT, f))) continue
        const t = fs.readFileSync(f, 'utf8')
        for (const [re, what, allowed] of RULES) for (const m of t.matchAll(re)) if (!allowed(m[0])) errors.push(`${path.relative(ROOT, f)}: looks like ${what}: ${m[0].slice(0, 12)}…`)
    }
    // the generated public JSON that pages read in the browser (WS-123): built from the sources above, but assembled,
    // so it is checked as it ships too. me.json is every person's For-you slice; data.json each command centre's
    const published = ['me.json', ...(fs.existsSync(path.join(ROOT, 'people')) ? fs.readdirSync(path.join(ROOT, 'people')).map(id => `people/${id}/app/data.json`) : [])]
    for (const rel of published.filter(r => fs.existsSync(path.join(ROOT, r)))) {
        const t = fs.readFileSync(path.join(ROOT, rel), 'utf8')
        for (const [re, what, allowed] of RULES) for (const m of t.matchAll(re)) if (!allowed(m[0])) errors.push(`${rel} (generated): looks like ${what}: ${m[0].slice(0, 12)}…`)
    }
    return errors
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const e = check(); if (e.length) { console.error(e.map(x => 'FAIL ' + x).join('\n')); process.exit(1) } console.log('comms check: OK')
}
