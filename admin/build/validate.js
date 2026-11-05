#!/usr/bin/env node
// web-summit.sgit.ai pre-release gate. Run from anywhere: node admin/build/validate.js
// Any failure exits 1: no tag, no publish. Checks, in order:
//   1. version agreement: version.txt vs every page badge, the versions table, llms.txt and index.md
//   2. internal links: every relative href/src in every .html file resolves
//   3. canonical host: every page declares a canonical and og:url on the host in CNAME
//   4. the agent surface: llms.txt names every section hub; sitemap.xml and the tree agree both ways
//   5. key-leak tripwire: nothing may look like an sgit vault key or a PEM private key
//   6. div balance
//   7. every page ends with an agent block
//   8. every article has a markdown twin, and a .sig that names a signer
//  12. every page has its .md twin and is named in llms.txt; no page is an orphan (reachable from index.html by links)
//  11. assets/site.css writes colour only between tokens:start and tokens:end
//  10. no source file is gitignored: a build tool that is not in the repository cannot be run by CI
//   9. the generated pages are up to date with content/ (build.mjs would change nothing)
//  13. behaviour policies: no two roles claim the same path; every ROLE.md names start.mjs and banner.mjs
//  14. the company map: every company has a source with a URL and the date read
//  15. public forever: no email, phone number or key shape in comms/, data/ or team/
//  16. every closed wake record has its five steps
//  22. no person's script beside keyring.js, and none that reaches for the keyring or data/sealed/ (WS-164)
//  21. every URL in a built page is http(s), mailto, a fragment or relative: no javascript:, data: or vbscript: (WS-132)
//  18. briefs (WS-112): warnings only, never a failure: more than three asks, or next / sources / wide not a list
'use strict'
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const errors = []
const rel = f => path.relative(ROOT, f).split(path.sep).join('/')
// every file is read once, however many checks look at it (WS-65: the gate read each page 4-5 times)
const cache = new Map()
const text = f => { if (!cache.has(f)) cache.set(f, fs.readFileSync(f, 'utf8')); return cache.get(f) }
const read = p => text(path.join(ROOT, p))

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        if (['.git', '.github', 'node_modules', '.sg_vault', '.cache'].includes(name)) continue   // .cache: gitignored build caches, never committed or published
        const p = path.join(dir, name)
        if (fs.statSync(p).isDirectory()) walk(p, out); else out.push(p)
    }
    return out
}
// 9. the build touches no tracked file: generated output is gitignored and built by CI, never committed. Run FIRST:
// the gate makes the one build it checks (snapshot, build, snapshot), and every check below reads that fresh output.
// It used to run in the middle, after the callers had built once already, so each gate run built the site twice
// (dev@web-summit.dinis, 3 November). Callers no longer need to build before validating; if they do, nothing breaks.
try {
    const snap = () => execFileSync('git', ['diff', 'HEAD', '--stat'], { cwd: ROOT }).toString() + execFileSync('git', ['status', '--porcelain'], { cwd: ROOT }).toString()
    const before = snap()
    execFileSync('node', [path.join(__dirname, 'build.mjs')], { cwd: ROOT, stdio: 'pipe' })
    const after = snap()
    if (before !== after) errors.push('build.mjs changed a tracked file: generated output must be gitignored and never committed (see .gitignore)')
} catch (e) { console.error(`FAIL build.mjs failed: ${(e.stderr || e.message).toString().slice(-2000)}`); process.exit(1) }

const files = walk(ROOT)
const htmlFiles = files.filter(f => f.endsWith('.html'))

// 1. version agreement
const VERSION = read('admin/build/version.txt').trim()
if (!/^v\d+\.\d+\.\d+$/.test(VERSION)) errors.push(`version.txt does not carry a vX.Y.Z version: "${VERSION}"`)
for (const f of htmlFiles) {
    for (const m of text(f).matchAll(/class="ver"[^>]*>(v\d+\.\d+\.\d+)</g)) {
        if (m[1] !== VERSION) errors.push(`${rel(f)}: version badge ${m[1]} != ${VERSION}`)
    }
}
for (const extra of ['llms.txt', 'index.md']) if (!read(extra).includes(VERSION)) errors.push(`${extra} does not mention ${VERSION}`)
const vers = read('admin/versions.html')
if (!vers.includes(`class="vnum">${VERSION}<`)) errors.push(`admin/versions.html has no row for ${VERSION}`)
const rows = [...vers.matchAll(/class="vnum">(v\d+\.\d+\.\d+)</g)].map(m => m[1])
if (new Set(rows).size !== rows.length) errors.push('admin/versions.html lists a version more than once')

// 2. internal links
for (const f of htmlFiles) {
    for (const m of text(f).matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
        if (/^(https?:|mailto:|data:|\/\/)/.test(m[1])) continue
        // a query string (assets' ?v=<version>, for cache-busting) is not part of the file: the file itself must exist
        if (!fs.existsSync(path.resolve(path.dirname(f), m[1].replace(/\?.*$/, '')))) errors.push(`${rel(f)}: broken link -> ${m[1]}`)
    }
}

// 3. canonical host
const HOST = read('CNAME').trim()
if (!/^[a-z0-9.-]+$/.test(HOST)) errors.push(`CNAME does not carry a hostname: "${HOST}"`)
for (const f of htmlFiles) {
    const t = text(f)
    if (!/rel="canonical"/.test(t)) errors.push(`${rel(f)}: no canonical link`)
    const claimed = [...t.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g), ...t.matchAll(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/g)].map(m => m[1])
    for (const u of claimed) if (!u.startsWith(`https://${HOST}/`)) errors.push(`${rel(f)}: canonical/og:url is not on ${HOST} -> ${u}`)
}

// 4. the agent surface
const llms = read('llms.txt')
for (const h of htmlFiles.map(rel).filter(p => p.endsWith('/index.html') && p.split('/').length === 2)) {
    if (!llms.includes(h)) errors.push(`llms.txt does not name the section hub /${h}`)
}
const listed = [...read('sitemap.xml').matchAll(new RegExp(`<loc>https://${HOST}/([^<]+)</loc>`, 'g'))].map(m => m[1])
for (const p of listed) if (!fs.existsSync(path.join(ROOT, p))) errors.push(`sitemap.xml lists a page that does not exist: /${p}`)
for (const f of htmlFiles) if (!listed.includes(rel(f))) errors.push(`sitemap.xml is missing ${rel(f)}`)

// 5. key-leak tripwire: every text file, one list of shapes (admin/build/secrets.cjs), and its fixtures must all be caught
const secrets = require('./secrets.cjs')
errors.push(...secrets.selfTest())
for (const f of files) {
    if (secrets.BINARY.test(f)) continue
    for (const what of secrets.keyHits(text(f))) errors.push(`${rel(f)}: contains ${what}`)
}

// 6. div balance, 7. agent block
for (const f of htmlFiles) {
    const t = text(f)
    const open = (t.match(/<div\b/g) || []).length, close = (t.match(/<\/div>/g) || []).length
    if (open !== close) errors.push(`${rel(f)}: ${open} <div> vs ${close} </div>`)
    if (!/class="agent-block"[\s\S]*<\/div>\s*<\/body>/.test(t)) errors.push(`${rel(f)}: does not end with an agent block`)
}

// 8. articles: markdown twin and signature
for (const f of files.filter(f => /^articles\/[^/]+\.html$/.test(rel(f)) && rel(f) !== 'articles/index.html')) {
    const md = rel(f).replace(/\.html$/, '.md')
    if (!fs.existsSync(path.join(ROOT, md))) { errors.push(`${rel(f)}: no markdown twin ${md}`); continue }
    if (!fs.existsSync(path.join(ROOT, md + '.sig'))) { errors.push(`${md}: not signed (no ${md}.sig)`); continue }
    try {
        const s = JSON.parse(read(md + '.sig'))
        if (!/^sha256:[0-9a-f]{16}$/.test(s.fingerprint) || !s.signature) errors.push(`${md}.sig: no signer fingerprint or signature`)
    } catch { errors.push(`${md}.sig: not JSON`) }
}

// 9. (now first, before everything it checks: see the top of this file)

// 12. twins, llms.txt and orphans
for (const f of htmlFiles) {
    const r = rel(f), twin = r.replace(/\.html$/, '.md')
    if (!fs.existsSync(path.join(ROOT, twin))) errors.push(`${r}: no markdown twin ${twin}`)
    if (!llms.includes(`/${r}`)) errors.push(`llms.txt does not name /${r}`)
}
{
    const seen = new Set(['index.html']), queue = ['index.html']
    while (queue.length) {
        const cur = queue.pop(), dir = path.dirname(cur)
        for (const m of read(cur).matchAll(/href="([^"#]+)(?:#[^"]*)?"/g)) {
            if (/^(https?:|mailto:|data:|\/\/)/.test(m[1]) || !m[1].endsWith('.html')) continue
            const t = path.normalize(path.join(dir, m[1])).split(path.sep).join('/')
            if (!seen.has(t) && fs.existsSync(path.join(ROOT, t))) { seen.add(t); queue.push(t) }
        }
    }
    for (const f of htmlFiles) if (!seen.has(rel(f))) errors.push(`${rel(f)}: nothing links to it (an orphan page)`)
}

// 11. colour only through tokens: no literal colour in site.css outside the tokens block
{
    const css = read('assets/site.css')
    const outside = css.replace(/\/\* tokens:start \*\/[\s\S]*?\/\* tokens:end \*\//, '').replace(/\/\*[\s\S]*?\*\//g, '')
    if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(outside)) errors.push('assets/site.css: a literal colour outside the tokens block')
}

// 10. no source file is gitignored (CI only sees what git tracks; this broke the first release); generated files are, on purpose
try {
    const gen = new Set((fs.existsSync(path.join(ROOT, '.generated.txt')) ? read('.generated.txt') : '').split('\n').filter(Boolean).concat(['.generated.txt']))
    const sources = files.map(rel).filter(f => !gen.has(f))
    const ignored = execFileSync('git', ['check-ignore', '--no-index', ...sources], { cwd: ROOT }).toString().split('\n').filter(Boolean)
    for (const f of ignored) errors.push(`${f}: is gitignored, so CI will not have it`)
} catch (e) { if (e.status !== 1) errors.push(`git check-ignore failed: ${e.message}`) }

// 21. no live code in a URL (WS-132 part 1): every href, src, action and formaction in every built page is http(s), mailto,
// a fragment or relative. Entities are decoded and control characters dropped first, as a browser does, so
// java&#115;cript: or a tab inside the scheme is caught too. build.mjs's safeUrl() keeps markdown from making one
{
    const ent = s => s.replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(+d)).replace(/&colon;/gi, ':').replace(/&tab;|&newline;/gi, '').replace(/&amp;/gi, '&')
    const bad = v => { const m = ent(v).replace(/[\u0000-\u0020]/g, '').match(/^([a-z][a-z0-9+.-]*):/i); return m && !/^(https?|mailto)$/i.test(m[1]) }
    if (!bad('java&#115;cript:x') || !bad('JaVa\tScRiPt:x') || !bad('data:text/html,x') || bad('https://x') || bad('a/b:c') || bad('#x')) errors.push('validate.js: check 21 fixtures failed')
    for (const f of htmlFiles) for (const m of read(rel(f)).matchAll(/\s(?:href|src|action|formaction|xlink:href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi))
        if (bad(m[1] ?? m[2] ?? m[3])) errors.push(`${rel(f)}: a URL with a scheme that can run code: ${(m[1] ?? m[2] ?? m[3]).slice(0, 30)} (WS-132)`)
}

// 22. a person's script never sits beside a person's key (WS-164, security@web-summit.dinis): (a) no built page that runs a
// script from people/ also loads keyring.js; (b) no script a browser runs from people/ (.js files) reaches for the
// keyring, IndexedDB, the page's links or data/sealed/ (security's list, with "sealed" narrowed to the sealed folder:
// the word alone is in people's prose, as in "sealed sending comes with slice 3")
{
    const REACH = /WSKeyring|ws-keyring|indexedDB|document\.links|data\/sealed\//
    for (const f of files.filter(f => rel(f).startsWith('people/') && f.endsWith('.js'))) { const m = read(rel(f)).match(REACH); if (m) errors.push(`${rel(f)}: a person's script uses ${m[0]} (WS-164: the keyring and sealed items are the site's scripts' only)`) }
    for (const f of htmlFiles) {
        const h = read(rel(f)); if (!h.includes('assets/keyring.js')) continue
        const own = [...h.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]).find(src => !/^https?:/.test(src) && path.posix.normalize(path.posix.join(path.posix.dirname(rel(f)), src)).startsWith('people/'))
        if (own) errors.push(`${rel(f)}: loads keyring.js beside a person's script ${own} (WS-164)`)
    }
}

// 17. prose has no em-dashes (the estate's house style; the guidance on sgit.ai lists it in every gate)
for (const dir of ['content', 'board', 'people']) for (const f of walk(path.join(ROOT, dir)).filter(f => f.endsWith('.md'))) if (read(rel(f)).includes('\u2014')) errors.push(`${rel(f)}: an em-dash in prose (use a colon, a comma or a full stop)`)

// 18. every script parses: the site's own .js files and every inline script in a generated page
{
    const vm = require('vm'), parse = (code, where) => { try { new vm.Script(code, { filename: where }) } catch (e) { errors.push(`${where}: script does not parse: ${e.message}`) } }
    for (const f of files.filter(f => f.endsWith('.js') && rel(f).startsWith('assets/'))) { const c = read(rel(f)); if (!/^\s*(import|export)\s/m.test(c)) parse(c, rel(f)) }
    for (const f of htmlFiles) for (const m of read(rel(f)).matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="(?:application\/ld\+json|application\/json|module)")[^>]*>([\s\S]*?)<\/script>/g)) if (m[1].trim()) parse(m[1], rel(f) + ' (inline script)')
}

// 13. behaviour policies: every agent role has ROLE.md and policy.json; no two policies claim the same path;
//     every ROLE.md names start.mjs and banner.mjs (the wake protocol, team/conductor/WAKE.md)
{
    const team = JSON.parse(read('data/team.json'))
    const pols = []
    for (const m of team.members.filter(m => m.kind === 'agent' && fs.existsSync(path.join(ROOT, 'team', m.id, 'policy.json')))) {
        const role = read(`team/${m.id}/ROLE.md`)
        for (const tool of ['admin/tools/start.mjs', 'admin/tools/banner.mjs']) if (!role.includes(tool.split('/').pop())) errors.push(`team/${m.id}/ROLE.md does not name ${tool}`)
        const p = JSON.parse(read(`team/${m.id}/policy.json`))
        if (p.agent !== m.id) errors.push(`team/${m.id}/policy.json names agent ${p.agent}`)
        pols.push([m.id, p.scope.writes])
    }
    const toRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*') + '$')
    const sample = g => g.replace(/\*\*/g, 'x/y').replace(/\*/g, 'x')
    for (let i = 0; i < pols.length; i++) for (let j = i + 1; j < pols.length; j++) for (const a of pols[i][1]) for (const b of pols[j][1]) {
        if (toRe(a).test(sample(b)) || toRe(b).test(sample(a))) errors.push(`policies overlap: ${pols[i][0]} writes ${a}, ${pols[j][0]} writes ${b}`)
    }
}

// 14. the company map: every company has an id, a name, an attending status and at least one source with a URL and the date read
{
    const c = JSON.parse(read('data/companies.json')), ids = new Set()
    for (const co of c.companies || []) {
        if (!/^[a-z0-9-]+$/.test(co.id || '')) errors.push(`data/companies.json: bad id "${co.id}"`)
        if (ids.has(co.id)) errors.push(`data/companies.json: duplicate id ${co.id}`); ids.add(co.id)
        if (!co.name || !co.attending) errors.push(`data/companies.json: ${co.id} has no name or attending status`)
        if (!(co.sources || []).length || co.sources.some(s => !/^https?:\/\//.test(s.url || '') || !s.read_on)) errors.push(`data/companies.json: ${co.id} has a fact without a source URL and a date read`)
    }
}

// 15. public forever: no email address, phone number or key shape in comms/, data/, team/, people/ or board/ (admin/tools/comms_check.mjs)
try { execFileSync('node', [path.join(__dirname, '..', 'tools', 'comms_check.mjs')], { cwd: ROOT, stdio: 'pipe' }) }
catch (e) { errors.push(`comms_check: ${(e.stdout || '').toString()}${(e.stderr || '').toString()}`.trim()) }

// 19. me.json, every person's For-you slice (WS-123): its shape, one entry per person on the roster, links that resolve
//     (its contact details are checked by check 15 with the rest of the generated public JSON)
try {
    const me = JSON.parse(read('me.json')), team = JSON.parse(read('data/team.json'))
    if (me.version !== VERSION) errors.push(`me.json: version ${me.version} is not ${VERSION}`)
    if (isNaN(Date.parse(me.built_at))) errors.push('me.json: built_at is not a time')
    const want = team.members.filter(m => m.kind === 'human' && fs.existsSync(path.join(ROOT, 'people', m.id))).map(m => m.id).sort(), got = Object.keys(me.people || {}).sort()
    if (want.join() !== got.join()) errors.push(`me.json: people are ${got.join(', ') || 'none'}, the roster says ${want.join(', ')}`)
    const SHAPE = { id: 'string', name: 'string', first: 'string', role: 'string', level: 'number', level_name: 'string', open: 'number', overdue: 'number', soon: 'number', urgent: 'array', decisions: 'array', agents: 'array', messages: 'array', daily: 'array', days: 'array', since: 'object', briefing: 'string', standup: 'string', links: 'object' }
    const kind = v => Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v
    for (const [id, p] of Object.entries(me.people || {})) {
        for (const [k, t] of Object.entries(SHAPE)) if (kind(p[k]) !== t) errors.push(`me.json: ${id}.${k} is ${kind(p[k])}, not ${t}`)
        if (p.id !== id) errors.push(`me.json: ${id} carries id ${p.id}`)
        for (const u of p.urgent || []) if (!/^WS-\d+$/.test(u.id || '') || !u.title) errors.push(`me.json: ${id} has an urgent item without an issue id or title`)
        if ((p.daily || []).length !== (p.days || []).length) errors.push(`me.json: ${id}.daily and days differ in length`)
        for (const rel of [p.briefing, ...Object.values(p.links || {})].filter(Boolean)) if (!fs.existsSync(path.join(ROOT, rel))) errors.push(`me.json: ${id} links to ${rel}, which does not exist`)
    }
} catch (e) { errors.push(`me.json: ${e.message}`) }

// 16. every wake record that is closed has its five steps (admin/tools/wake.mjs check)
try { execFileSync('node', [path.join(__dirname, '..', 'tools', 'wake.mjs'), 'check'], { cwd: ROOT, stdio: 'pipe' }) }
catch (e) { errors.push(`wake check: ${(e.stderr || '').toString()}`.trim()) }

// 17. every print sign-off verifies: signature, key exactly the signing agent's, agent bound to its person (WS-116)
try { execFileSync('node', [path.join(__dirname, '..', 'tools', 'signoff.mjs'), 'verify'], { cwd: ROOT, stdio: 'pipe' }) }
catch (e) { errors.push(`sign-off check: ${(e.stdout || '').toString().split('\n').filter(l => /bad signature/.test(l)).join('; ')}`.trim()) }

// 18. the briefs' shape (WS-112): printed as warnings, never a failure, so a brief is never held back by its form
const warnings = []
try {
    const dirs = [path.join(ROOT, 'team/conductor/editor-briefs'), ...fs.readdirSync(path.join(ROOT, 'people')).map(id => path.join(ROOT, 'people', id, 'briefs'))]
    for (const d of dirs.filter(d => fs.existsSync(d) && fs.statSync(d).isDirectory())) for (const f of fs.readdirSync(d).filter(f => f.endsWith('.json'))) {
        let b; try { b = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) } catch { warnings.push(`brief ${path.relative(ROOT, path.join(d, f))}: not valid JSON`); continue }
        const rel = path.relative(ROOT, path.join(d, f)), asks = (b.for_you || []).filter(a => a && a.ask)
        if (asks.length > 3) warnings.push(`brief ${rel}: ${asks.length} asks (at most three)`)
        for (const k of ['next', 'sources', 'wide']) if (k in b && !Array.isArray(b[k])) warnings.push(`brief ${rel}: "${k}" is a ${typeof b[k]}, not a list`)
    }
} catch (e) { warnings.push(`briefs: ${e.message}`) }
if (warnings.length) console.log(warnings.map(w => 'WARN ' + w).join('\n'))

if (errors.length) { console.error(errors.map(e => 'FAIL ' + e).join('\n')); process.exit(1) }
console.log(`OK ${VERSION}: ${htmlFiles.length} pages`)
