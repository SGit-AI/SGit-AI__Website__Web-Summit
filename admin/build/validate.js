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
//  10. no source file is gitignored: a build tool that is not in the repository cannot be run by CI
//   9. the generated pages are up to date with content/ (build.mjs would change nothing)
'use strict'
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const errors = []
const rel = f => path.relative(ROOT, f).split(path.sep).join('/')
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8')

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        if (['.git', '.github', 'node_modules', '.sg_vault'].includes(name)) continue
        const p = path.join(dir, name)
        if (fs.statSync(p).isDirectory()) walk(p, out); else out.push(p)
    }
    return out
}
const files = walk(ROOT)
const htmlFiles = files.filter(f => f.endsWith('.html'))

// 1. version agreement
const VERSION = read('admin/build/version.txt').trim()
if (!/^v\d+\.\d+\.\d+$/.test(VERSION)) errors.push(`version.txt does not carry a vX.Y.Z version: "${VERSION}"`)
for (const f of htmlFiles) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/class="ver"[^>]*>(v\d+\.\d+\.\d+)</g)) {
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
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
        if (/^(https?:|mailto:|data:|\/\/)/.test(m[1])) continue
        if (!fs.existsSync(path.resolve(path.dirname(f), m[1]))) errors.push(`${rel(f)}: broken link -> ${m[1]}`)
    }
}

// 3. canonical host
const HOST = read('CNAME').trim()
if (!/^[a-z0-9.-]+$/.test(HOST)) errors.push(`CNAME does not carry a hostname: "${HOST}"`)
for (const f of htmlFiles) {
    const t = fs.readFileSync(f, 'utf8')
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

// 5. key-leak tripwire
const KEY_SHAPE = /[A-Za-z0-9_-]{20,}:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
for (const f of files) {
    if (/\.(png|jpg|jpeg|gif|webp|ico|woff2?|zip|pdf)$/.test(f)) continue
    const t = fs.readFileSync(f, 'utf8')
    if (KEY_SHAPE.test(t)) errors.push(`${rel(f)}: contains a vault-key-shaped string`)
    if (/-----BEGIN (RSA |EC )?PRIVATE KEY-----/.test(t)) errors.push(`${rel(f)}: contains a private key`)
}

// 6. div balance, 7. agent block
for (const f of htmlFiles) {
    const t = fs.readFileSync(f, 'utf8')
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

// 9. generated pages are current: rebuild into the same tree and see whether git sees a change
try {
    const snap = () => execFileSync('git', ['diff', 'HEAD', '--stat'], { cwd: ROOT }).toString() + execFileSync('git', ['status', '--porcelain'], { cwd: ROOT }).toString()
    const before = snap()
    execFileSync('node', [path.join(__dirname, 'build.mjs')], { cwd: ROOT, stdio: 'pipe' })
    const after = snap()
    if (before !== after) errors.push('generated pages are stale: run node admin/build/build.mjs and commit the result')
} catch (e) { errors.push(`build.mjs failed: ${e.message}`) }

// 10. nothing the site needs is gitignored (CI only sees what git tracks; this broke the first release)
try {
    const ignored = execFileSync('git', ['check-ignore', '--no-index', ...files.map(rel)], { cwd: ROOT }).toString().split('\n').filter(Boolean)
    for (const f of ignored) errors.push(`${f}: is gitignored, so CI will not have it`)
} catch (e) { if (e.status !== 1) errors.push(`git check-ignore failed: ${e.message}`) }

if (errors.length) { console.error(errors.map(e => 'FAIL ' + e).join('\n')); process.exit(1) }
console.log(`OK ${VERSION}: ${htmlFiles.length} pages`)
