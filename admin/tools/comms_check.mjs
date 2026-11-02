#!/usr/bin/env node
// Everything in comms/ and data/ is public, forever. This refuses contact details and key shapes in them.
// Exported for validate.js; run on its own: node admin/tools/comms_check.mjs
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
// agent names are <agent>@web-summit.<person>, where <person> is a member id in data/team.json: a name, not an address
const PEOPLE = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8')).members.map(m => m.id))
const agentName = m => { const d = m.match(/@web-summit\.([a-z0-9-]+)$/); return !!d && PEOPLE.has(d[1]) }
const RULES = [
    [/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?/g, 'an email address', m => agentName(m) || /@web-summit$|noreply@|example\.(com|org)$/.test(m)],
    [/(?:\+|00)\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g, 'a phone number', () => false],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/g, 'a private key', () => false],
    [/sgit_private_(vault|read)_[A-Za-z0-9]/g, 'an sgit private key', () => false],
    [/\b(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16})\b/g, 'an API key', () => false],
]
function walk(d, out = []) { if (!fs.existsSync(d)) return out; for (const n of fs.readdirSync(d)) { const p = path.join(d, n); fs.statSync(p).isDirectory() ? walk(p, out) : out.push(p) } return out }
export function check(dirs = ['comms', 'data', 'team', 'people', 'board']) {
    const errors = []
    for (const f of dirs.flatMap(d => walk(path.join(ROOT, d)))) {
        if (!/\.(md|json|eml|txt)$/.test(f) || /\/index\.md$/.test(f)) continue
        const t = fs.readFileSync(f, 'utf8')
        for (const [re, what, allowed] of RULES) for (const m of t.matchAll(re)) if (!allowed(m[0])) errors.push(`${path.relative(ROOT, f)}: looks like ${what}: ${m[0].slice(0, 12)}…`)
    }
    return errors
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const e = check(); if (e.length) { console.error(e.map(x => 'FAIL ' + x).join('\n')); process.exit(1) } console.log('comms check: OK')
}
