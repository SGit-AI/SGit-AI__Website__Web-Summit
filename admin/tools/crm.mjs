#!/usr/bin/env node
// The team CRM (WS-170; conductor@web-summit.dinis, 5 November 2026, at Dinis's word: "a fundamental CRM where you have
// contacts, you have actions, you have schedules, a folder per company, a folder per contact, basically semantic knowledge
// graphs for everybody ... a layer of protection ... encoded with the public keys ... a double encrypted layer ... two
// CRMs, like the observability: a public one, and you can also put the key of the public CRM in the private CRM").
//
// Two vaults on dev.send.sgraph.ai, one layout:
//   companies/<slug>/company.json (+ notes.md)   contacts/<slug>/contact.json   actions/<YYYY-MM-DD>-<slug>.json
//   schedules/<YYYY-MM-DD>/<slug>.json           graph/nodes.json, graph/edges.json (DERIVED: `derive`)
//   schemas/*.json   README.md   index.html (the vault app)   app.json, .vault/app.json
// ws-team-crm-public: public facts only (the newsroom's companies, organisations, people as the summit lists them, and the
// agenda), each with its sources; its read key is published (data/crm.json). ws-team-crm-private: the team's own records.
//
// Layer 1 is the vault (its key). Layer 2 is per record: a sensitive record is <name>.sealed.json, envelope ws-crm-env-1:
//   {v, id, kind, audience: [person ids], recipients: [{to, key, env}], iv, ct, sealed_by, at}
// ct = AES-256-GCM of the record JSON (tag appended) under a random CEK; each person's recipient entry is a ws-ecies-1
// envelope of {"cek": base64} to their site key (data/person-keys.json), opened in the browser by window.WSKeyring.open;
// an agent's entry (to: its data/keys.json id) is sgit's hybrid v2 of {"cek"} to its RSA key. So reading needs both keys.
//
//   node admin/tools/crm.mjs create                        the two vaults (once); keys in ~/.sg-send/crm/ (0600)
//   node admin/tools/crm.mjs seed-public                   public records from the newsroom's data/, derive, push
//   node admin/tools/crm.mjs seed-private                  the six requests (WS-165) sealed, keys/public-crm.sealed.json, push
//   node admin/tools/crm.mjs seal --audience dinis,silvio [--agents conductor-silvio] --in rec.json --out x.sealed.json
//   node admin/tools/crm.mjs open --person <id> x.sealed.json         (the issuer only: ~/.sg-send/issued/<id>.json)
//   node admin/tools/crm.mjs reseal --audience a,b [--agents ...] x.sealed.json   who can read: a new CEK, a new ct
//   node admin/tools/crm.mjs audience x.sealed.json
//   node admin/tools/crm.mjs derive [public|private]       rebuild graph/ from the plain records (sealed: a node only)
//   node admin/tools/crm.mjs app [public|private]          rebuild index.html, app.json, README.md, schemas/; push
//   node admin/tools/crm.mjs seal-keys                     the private vault key to every person (and their conductors)
//   node admin/tools/crm.mjs site                          data/crm.json for the page /crm/ (the public read key, never a vault key)
// --root <repo> uses another copy of this repository (a scratch copy for tests); --crm <dir> another key folder.
// Prints counts and paths, never a key.
import fs from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'
import { execFileSync } from 'child_process'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const args = process.argv.slice(2)
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))), cmd = pos[0]   // options are --name value
const opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : undefined }
const ROOT = path.resolve(opt('root') || path.join(HERE, '../..'))
const CRM = path.resolve(opt('crm') || path.join(os.homedir(), '.sg-send/crm'))
const NEWSROOM = path.resolve(opt('newsroom') || '/home/user/PrompTugal__News__Website')
const AGENT = 'conductor@web-summit.dinis'
const HOST = 'https://dev.send.sgraph.ai'
const VAULTS = { public: 'ws-team-crm-public', private: 'ws-team-crm-private' }
const fail = m => { console.error('crm: ' + m); process.exit(1) }
const say = m => console.log('crm: ' + m)
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z')
const b64 = b => Buffer.from(b).toString('base64')
const rj = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const wj = (f, o, mode) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 2) + '\n', mode ? { mode } : undefined); if (mode) fs.chmodSync(f, mode) }
const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
const keysFile = path.join(CRM, 'vaults.json')
const vaults = () => fs.existsSync(keysFile) ? rj(keysFile) : fail(`no ${keysFile}: run create first`)
const vdir = which => vaults()[which].dir
const sgit = (dir, ...a) => execFileSync('sgit', a, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] }).toString()

// ---------- the people and the agents who can be recipients ----------
const personKeys = () => rj(path.join(ROOT, 'data/person-keys.json')).keys.filter(k => k.status === 'active')
const agentKeys = () => rj(path.join(ROOT, 'data/keys.json')).keys.filter(k => (k.status == null || k.status === 'active') && (k.bundle || {}).encrypt)
const agentOf = k => k.agent || ((k.bundle || {}).label || k.label || '').split(' ')[0]

// ---------- ws-ecies-1 to a person's site key (the same steps as admin/tools/person-key.mjs and assets/keyring.js) ----------
function ecies(person, plain) {
    const k = personKeys().find(x => x.person === person) || fail(`no active site key for ${person}`)
    const eph = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
    const secret = crypto.diffieHellman({ privateKey: eph.privateKey, publicKey: crypto.createPublicKey({ key: k.encrypt, format: 'jwk' }) })
    const key = Buffer.from(crypto.hkdfSync('sha256', secret, Buffer.alloc(0), Buffer.from('ws-ecies-1'), 32)), iv = crypto.randomBytes(12)
    const c = crypto.createCipheriv('aes-256-gcm', key, iv), ct = Buffer.concat([c.update(Buffer.from(JSON.stringify(plain))), c.final(), c.getAuthTag()])
    const epk = eph.publicKey.export({ format: 'jwk' })
    return { v: 'ws-ecies-1', to: person, key: k.fingerprint, by: AGENT, at: now(), epk: { kty: 'EC', crv: 'P-256', x: epk.x, y: epk.y }, iv: b64(iv), ct: b64(ct) }
}
function eciesOpen(person, env) {
    const f = path.join(os.homedir(), '.sg-send/issued', person + '.json')
    if (!fs.existsSync(f)) fail(`no private key for ${person} here (only the session that issued it holds one)`)
    const p = rj(f)
    if (env.key !== p.fingerprint) fail(`sealed to ${env.key}, the key held here for ${person} is ${p.fingerprint}`)
    const secret = crypto.diffieHellman({ privateKey: crypto.createPrivateKey({ key: p.encrypt, format: 'jwk' }), publicKey: crypto.createPublicKey({ key: env.epk, format: 'jwk' }) })
    const key = Buffer.from(crypto.hkdfSync('sha256', secret, Buffer.alloc(0), Buffer.from('ws-ecies-1'), 32)), buf = Buffer.from(env.ct, 'base64')
    const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(env.iv, 'base64')); d.setAuthTag(buf.subarray(buf.length - 16))
    return JSON.parse(Buffer.concat([d.update(buf.subarray(0, buf.length - 16)), d.final()]).toString())
}
// sgit's hybrid v2 (as `sgit pki encrypt` writes it; PKI__Crypto.hybrid_decrypt opens it): RSA-OAEP-SHA256 wraps AES-256-GCM
function hybrid(pem, text) {
    const aes = crypto.randomBytes(32), iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', aes, iv)
    const ct = Buffer.concat([c.update(Buffer.from(text)), c.final(), c.getAuthTag()])
    const w = crypto.publicEncrypt({ key: pem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, aes)
    return b64(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(ct) }))
}

// ---------- ws-crm-env-1 ----------
function seal(record, audience, agents = []) {
    const cek = crypto.randomBytes(32), iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', cek, iv)
    const ct = Buffer.concat([c.update(Buffer.from(JSON.stringify(record))), c.final(), c.getAuthTag()])
    const recipients = audience.map(p => { const env = ecies(p, { cek: b64(cek) }); return { to: p, key: env.key, env } })
    for (const id of agents) {
        const k = agentKeys().find(x => x.id === id) || fail(`no active agent key ${id} in data/keys.json`)
        recipients.push({ to: id, agent: agentOf(k), key: k.bundle.fingerprint, env: hybrid(k.bundle.encrypt, JSON.stringify({ cek: b64(cek) })) })
    }
    return { v: 'ws-crm-env-1', id: record.id, kind: record.type || record.kind || 'record', audience, agents, recipients, iv: b64(iv), ct: b64(ct), sealed_by: AGENT, at: now() }
}
function unseal(env, person) {
    const r = env.recipients.find(x => x.to === person) || fail(`${person} is not in the audience (${env.audience.join(', ')})`)
    const { cek } = eciesOpen(person, r.env), buf = Buffer.from(env.ct, 'base64')
    const d = crypto.createDecipheriv('aes-256-gcm', Buffer.from(cek, 'base64'), Buffer.from(env.iv, 'base64')); d.setAuthTag(buf.subarray(buf.length - 16))
    return JSON.parse(Buffer.concat([d.update(buf.subarray(0, buf.length - 16)), d.final()]).toString())
}
const openAny = env => {                                          // reseal: open with any audience member whose key this session issued
    const p = env.audience.find(x => fs.existsSync(path.join(os.homedir(), '.sg-send/issued', x + '.json'))) || fail('no audience member\'s key is held here, so it cannot be resealed from this session')
    return unseal(env, p)
}

// ---------- the graph, derived from the records ----------
function walk(dir) { const out = []; if (!fs.existsSync(dir)) return out; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { if (e.name.startsWith('.')) continue; const f = path.join(dir, e.name); if (e.isDirectory()) out.push(...walk(f)); else out.push(f) } return out }
function derive(dir) {
    const nodes = new Map(), edges = []
    const node = (id, type, label, extra = {}) => { if (!nodes.has(id)) nodes.set(id, { id, type, label, ...extra }); else { const n = nodes.get(id); if (extra.file) { n.label = label; n.type = type } Object.assign(n, extra) } return id }
    const edge = (from, verb, to) => { if (from && to) edges.push({ from, verb, to }) }
    for (const f of walk(dir).filter(f => /^(companies|contacts|actions|schedules|keys)\//.test(path.relative(dir, f)) && f.endsWith('.json'))) {
        const rel = path.relative(dir, f), r = rj(f)
        if (r.v === 'ws-crm-env-1') { node(`${r.kind}:${r.id}`, r.kind, `${r.kind} (sealed)`, { file: rel, sealed: true, audience: r.audience }); continue }
        if (r.type === 'company') {
            const id = node(`company:${r.id}`, 'company', r.name, { file: rel, kind: r.kind, country: r.country, category: r.category, what: r.what, website: r.website, attending_as: r.attending_as })
            for (const t of r.topics || []) edge(id, 'about', node(t, 'topic', r.topic_names?.[t] || t.split(':')[1]))
        } else if (r.type === 'contact') {
            const id = node(`contact:${r.id}`, 'contact', r.name, { file: rel, role: r.role, organisation: r.organisation })
            if (r.company) edge(id, 'works_at', node(r.company, 'company', r.organisation))
            for (const s of r.sessions || []) edge(id, 'speaks_at', s)
        } else if (r.type === 'schedule') {
            const id = node(`schedule:${r.id}`, 'schedule', r.title, { file: rel, kind: r.kind, date: r.date, start: r.start, end: r.end, where: r.where, track: r.track })
            if (r.part_of) edge(id, 'part_of', node(r.part_of, 'event', r.part_of_name || r.part_of.split(':')[1]))
            for (const h of r.hosted_by || []) edge(h, 'hosts', id)
            if (r.organised_by) edge(r.organised_by, 'organises', id)
        } else if (r.type === 'action') {
            const id = node(`action:${r.id}`, 'action', r.title, { file: rel, state: r.state, due: r.due, owner: r.owner })
            if (r.owner) edge(node(`person:${r.owner}`, 'person', r.owner), 'owns', id)
            if (r.company) edge(id, 'about', r.company)
            if (r.contact) edge(id, 'about', r.contact)
        }
    }
    for (const e of edges) for (const id of [e.from, e.to]) if (!nodes.has(id)) node(id, id.split(':')[0], id.split(':')[1])
    const at = now()
    wj(path.join(dir, 'graph/nodes.json'), { derived: { by: 'admin/tools/crm.mjs derive', at }, count: nodes.size, nodes: [...nodes.values()] })
    wj(path.join(dir, 'graph/edges.json'), { derived: { by: 'admin/tools/crm.mjs derive', at }, count: edges.length, edges })
    return [nodes.size, edges.length]
}

// ---------- the vaults ----------
const SCHEMAS = {
    'company.schema.json': { title: 'A company or organisation', type: 'object', required: ['id', 'type', 'name', 'sources', 'updated_at', 'updated_by'], properties: { id: { type: 'string' }, type: { const: 'company' }, kind: { enum: ['company', 'organisation'] }, name: { type: 'string' }, website: { type: ['string', 'null'] }, what: { type: ['string', 'null'] }, category: { type: ['string', 'null'] }, country: { type: ['string', 'null'] }, attending: { type: ['string', 'null'] }, attending_as: { type: ['string', 'null'] }, topics: { type: 'array', items: { type: 'string' } }, sources: { $ref: '#/$defs/sources' }, updated_at: { type: 'string' }, updated_by: { type: 'string' } }, $defs: { sources: { type: 'array', items: { type: 'object', required: ['url', 'read_at'], properties: { url: { type: 'string' }, read_at: { type: 'string' } } } } } },
    'contact.schema.json': { title: 'A contact: in the public CRM only what the summit lists (name, role, organisation)', type: 'object', required: ['id', 'type', 'name', 'sources', 'updated_at', 'updated_by'], properties: { id: { type: 'string' }, type: { const: 'contact' }, kind: { enum: ['person'] }, name: { type: 'string' }, role: { type: ['string', 'null'] }, organisation: { type: ['string', 'null'] }, company: { type: ['string', 'null'] }, sessions: { type: 'array', items: { type: 'string' } }, sources: { type: 'array' }, updated_at: { type: 'string' }, updated_by: { type: 'string' } } },
    'action.schema.json': { title: 'An action or request', type: 'object', required: ['id', 'type', 'title', 'kind', 'owner', 'state', 'updated_at', 'updated_by'], properties: { id: { type: 'string' }, type: { const: 'action' }, title: { type: 'string' }, kind: { enum: ['meeting', 'invitation', 'supplier', 'idea', 'request', 'follow-up'] }, owner: { type: 'string' }, due: { type: ['string', 'null'] }, state: { enum: ['new', 'acknowledged', 'proposed', 'booked', 'done', 'followed-up', 'closed', 'declined'] }, company: { type: ['string', 'null'] }, contact: { type: ['string', 'null'] }, next_step: { type: ['string', 'null'] }, links: { type: 'array', items: { type: 'string' } }, sources: { type: 'array' }, updated_at: { type: 'string' }, updated_by: { type: 'string' } } },
    'schedule.schema.json': { title: 'A schedule item: a session, a meeting, stand time', type: 'object', required: ['id', 'type', 'title', 'date', 'sources', 'updated_at', 'updated_by'], properties: { id: { type: 'string' }, type: { const: 'schedule' }, kind: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' }, start: { type: ['string', 'null'] }, end: { type: ['string', 'null'] }, where: { type: ['string', 'null'] }, track: { type: ['string', 'null'] }, part_of: { type: ['string', 'null'] }, speakers: { type: 'array' }, hosted_by: { type: 'array' }, sources: { type: 'array' }, updated_at: { type: 'string' }, updated_by: { type: 'string' } } },
    'sealed.schema.json': { title: 'ws-crm-env-1: a record sealed to an audience (layer 2)', type: 'object', required: ['v', 'id', 'kind', 'audience', 'recipients', 'iv', 'ct', 'sealed_by', 'at'], properties: { v: { const: 'ws-crm-env-1' }, id: { type: 'string' }, kind: { type: 'string' }, audience: { type: 'array', items: { type: 'string' } }, agents: { type: 'array', items: { type: 'string' } }, recipients: { type: 'array', items: { type: 'object', required: ['to', 'key', 'env'] } }, iv: { type: 'string' }, ct: { type: 'string' }, sealed_by: { type: 'string' }, at: { type: 'string' } } },
}
function appFiles(which) {
    const dir = vdir(which)
    const tpl = fs.readFileSync(path.join(HERE, 'crm_app.html.tpl'), 'utf8')
    // the origins whose /crm/ page may answer the app's unseal requests; CRM_APP_ORIGINS adds one for a test (then rebuild without it)
    const origins = ['https://web-summit.sgit.ai', ...(process.env.CRM_APP_ORIGINS || '').split(',').filter(o => /^https?:\/\/[a-z0-9.-]+(:\d+)?$/.test(o))]
    fs.writeFileSync(path.join(dir, 'index.html'), tpl.replace("const WHICH = /*__WHICH__*/''", `const WHICH = /*__WHICH__*/${JSON.stringify(which)}`).replace("const BRIDGE_ORIGINS = /*__ORIGINS__*/['https://web-summit.sgit.ai']", `const BRIDGE_ORIGINS = /*__ORIGINS__*/${JSON.stringify(origins)}`))
    const manifest = { entry: 'index.html', present: true, auto_open: true, title: which === 'public' ? 'The team CRM (public)' : 'The team CRM (private)', hud: { mode: 'minimal' }, permissions: { fs: { read: true } } }
    wj(path.join(dir, 'app.json'), manifest); wj(path.join(dir, '.vault/app.json'), manifest)
    for (const [f, s] of Object.entries(SCHEMAS)) wj(path.join(dir, 'schemas', f), { $schema: 'https://json-schema.org/draft/2020-12/schema', ...s })
    fs.writeFileSync(path.join(dir, 'README.md'), fs.readFileSync(path.join(HERE, `crm_${which}_README.md.tpl`), 'utf8'))
}
function push(which, msg) {
    const dir = vdir(which)
    try { sgit(dir, 'commit', '-m', msg) } catch (e) { if (!/nothing to commit/i.test(String(e.stdout) + String(e.stderr))) throw e }
    sgit(dir, 'push'); say(`${VAULTS[which]} pushed: ${msg}`)
}

if (cmd === 'create') {
    fs.mkdirSync(CRM, { recursive: true, mode: 0o700 }); fs.chmodSync(CRM, 0o700)
    if (fs.existsSync(keysFile)) fail('the vaults exist already (' + keysFile + ')')
    const base = path.join(os.homedir(), 'vaults'), out = {}
    fs.mkdirSync(base, { recursive: true })
    for (const [which, name] of Object.entries(VAULTS)) {
        execFileSync('sgit', ['create', '--base-url', HOST, '--token', process.env.SG_SEND_ACCESS_TOKEN || fail('SG_SEND_ACCESS_TOKEN is not set'), name], { cwd: base, stdio: ['ignore', 'pipe', 'pipe'] })
        const dir = path.join(base, name), vk = fs.readFileSync(path.join(dir, '.sg_vault/local/vault_key'), 'utf8').trim()
        const rk = execFileSync('python3', ['-I', '-c', 'import sys;from sgit_ai.crypto.Vault__Crypto import Vault__Crypto as V;k=V().derive_keys_from_vault_key(sys.stdin.read().strip());print(k["vault_id"]+" "+k["read_key"])'], { input: vk }).toString().trim().split(' ')
        out[which] = { name, dir, vault_id: rk[0], read_key_public: 'sgit_public_read_' + rk[1] }
        fs.writeFileSync(path.join(CRM, `${which}.vault_key`), vk + '\n', { mode: 0o600 })
        say(`${name}: ${rk[0]} (vault key in ${path.join(CRM, which + '.vault_key')})`)
    }
    wj(keysFile, out, 0o600)
} else if (cmd === 'seed-public') {
    const dir = vdir('public'), NR = path.join(NEWSROOM, 'data'), by = AGENT, at = now()
    const read = (d, f) => fs.readdirSync(path.join(NR, d)).filter(x => fs.existsSync(path.join(NR, d, x, f))).map(x => rj(path.join(NR, d, x, f)))
    const topics = Object.fromEntries(read('topics', 'topic.json').map(t => [`topic:${t.id}`, t.name]))
    const ref = r => r ? r.replace(/^(organisation|company):/, 'company:') : null
    let n = { companies: 0, contacts: 0, schedules: 0 }
    for (const c of read('companies', 'company.json')) {
        const src = rj(path.join(NR, 'companies', c.id, 'sources.json')).sources, eg = fs.existsSync(path.join(NR, 'companies', c.id, 'edges.json')) ? rj(path.join(NR, 'companies', c.id, 'edges.json')).edges : []
        const t = eg.filter(e => e.verb === 'filed_under').map(e => e.to)
        const rec = { id: c.id, type: 'company', kind: 'company', name: c.name, website: c.website || null, what: c.what || null, category: c.category || null, country: c.country || null, attending: c.attending || null, attending_as: c.attending_as || null, aliases: c.aliases || [], topics: t, topic_names: Object.fromEntries(t.map(x => [x, topics[x] || x])), sources: src.map(s => ({ url: s.url, read_at: s.read_on, supports: s.supports })), updated_at: at, updated_by: by }
        wj(path.join(dir, 'companies', c.id, 'company.json'), rec)
        fs.writeFileSync(path.join(dir, 'companies', c.id, 'notes.md'), `# ${c.name}\n\n${c.what || ''}\n\nPublic facts only, each with its source: ${src.map(s => `<${s.url}> (read ${s.read_on})`).join(', ')}.\n`)
        n.companies++
    }
    for (const o of read('organisations', 'organisation.json')) {
        wj(path.join(dir, 'companies', o.id, 'company.json'), { id: o.id, type: 'company', kind: 'organisation', name: o.name, aliases: o.names_as_listed || [], website: o.website || null, sources: (o.sources || []).map(s => ({ url: s.url, read_at: s.read_at })), updated_at: at, updated_by: by })
        n.companies++
    }
    for (const p of read('people', 'person.json')) {
        const sessions = [...new Set((p.listings || []).map(l => l.event).filter(Boolean).map(e => e.replace(/^event:/, 'schedule:')))]
        wj(path.join(dir, 'contacts', p.id, 'contact.json'), { id: p.id, type: 'contact', kind: 'person', name: p.name, role: p.role || null, organisation: p.organisation || null, company: ref(p.org), sessions, sources: [...new Map((p.listings || []).map(l => [l.source, { url: l.source, read_at: l.read_at }])).values()], about: 'As the summit lists them: name, role, organisation. Nothing else, ever, in this public vault.', updated_at: at, updated_by: by })
        n.contacts++
    }
    for (const e of read('events', 'event.json')) {
        if (!e.date) continue
        const rec = { id: e.id, type: 'schedule', kind: e.kind, title: e.title, date: e.date, start: e.start || null, end: e.end || null, where: e.where || null, place: e.place || null, track: e.track || null, part_of: e.part_of || null, part_of_name: e.part_of === 'event:web-summit-lisbon-2026' ? 'Web Summit Lisbon 2026' : null, organised_by: ref(e.organised_by), speakers: (e.speakers || []).map(s => ({ contact: s.person ? s.person.replace(/^person:/, 'contact:') : null, as_listed: s.as_listed, company: ref(s.org) })), hosted_by: (e.hosted_by || []).map(h => ref(typeof h === 'string' ? h : h.org)).filter(Boolean), sources: e.source_url ? [{ url: e.source_url, read_at: e.read_at }] : [], updated_at: at, updated_by: by }
        wj(path.join(dir, 'schedules', e.date, e.id + '.json'), rec)
        n.schedules++
    }
    appFiles('public')
    const [nn, ne] = derive(dir)
    say(`public: ${n.companies} companies and organisations, ${n.contacts} contacts, ${n.schedules} schedule items; graph ${nn} nodes, ${ne} edges`)
    push('public', `seed: public facts from the newsroom's data/ (${n.companies} companies, ${n.contacts} contacts, ${n.schedules} schedules)`)
} else if (cmd === 'seed-private') {
    const dir = vdir('private'), at = now(), src = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/board/WS-165-one-vault-for-the-requests-we-receive.md'
    // the six open requests from the RiskMandate.ai agent's proposal (WS-165); owners where the board names one, else Dinis
    const REQ = [
        ['int-meeting-in-lisbon', 'INT.: a meeting in Lisbon', 'meeting', 'dinis', 'Agree a time and place in Lisbon'],
        ['founders-night-pitch', 'Founders Night: a pitch on 9 November', 'invitation', 'dinis', 'Confirm the pitch slot and prepare it', '2026-11-09'],
        ['prontaprint-chiswick-cards', 'ProntaPrint Chiswick: the business cards, collection 6 November', 'supplier', 'indi', 'Collect the cards (WS-155)', '2026-11-06'],
        ['talk-book-paperbacks', 'Two paperbacks of the talk\'s book (London quotes)', 'supplier', 'dinis', 'Choose a quote and order'],
        ['stand-monitor', 'The stand\'s monitor (Web Summit sold out: bring our own)', 'supplier', 'dinis', 'Decide who brings a monitor to the stand'],
        ['riskmandate-for-schools', 'RiskMandate for schools (Indi\'s idea)', 'idea', 'indi', 'Write the idea up for the team'],
    ]
    for (const [id, title, kind, owner, next, due] of REQ) {
        const rec = { id: `2026-11-05-${id}`, type: 'action', kind, title, owner, owner_note: owner === 'indi' && id !== 'riskmandate-for-schools' ? 'WS-155 names Indi (designer) for the files' : id === 'riskmandate-for-schools' ? 'Indi\'s idea' : 'no owner listed in WS-165: Dinis until assigned', due: due || null, state: 'new', company: null, contact: null, next_step: next, links: [src], sources: [{ url: src, read_at: at }], updated_at: at, updated_by: AGENT }
        wj(path.join(dir, 'actions', `2026-11-05-${id}.sealed.json`), seal(rec, [...new Set(['dinis', owner])]))
    }
    const v = vaults().public
    const keyRec = { id: 'public-crm', type: 'vault-key', title: 'The public CRM\'s vault key (write access to ws-team-crm-public)', vault: v.name, vault_id: v.vault_id, vault_key: fs.readFileSync(path.join(CRM, 'public.vault_key'), 'utf8').trim(), note: 'Write the public CRM with it: public facts only, each with its source.', updated_at: at, updated_by: AGENT }
    wj(path.join(dir, 'keys', 'public-crm.sealed.json'), seal(keyRec, personKeys().map(k => k.person)))
    appFiles('private')
    const [nn, ne] = derive(dir)
    say(`private: ${REQ.length} actions sealed (Dinis and the owner), keys/public-crm.sealed.json (everyone with a site key); graph ${nn} nodes, ${ne} edges`)
    push('private', 'seed: the six requests from WS-165 (sealed), the public CRM key (sealed to everyone with a site key)')
} else if (cmd === 'seal') {
    const audience = (opt('audience') || fail('--audience')).split(',').filter(Boolean), agents = (opt('agents') || '').split(',').filter(Boolean)
    const env = seal(rj(opt('in') || fail('--in')), audience, agents)
    wj(opt('out') || fail('--out'), env); say(`sealed ${env.id} to ${[...audience, ...agents].join(', ')}: ${opt('out')}`)
} else if (cmd === 'open') {
    console.log(JSON.stringify(unseal(rj(args[args.length - 1]), opt('person') || fail('--person')), null, 2))
} else if (cmd === 'reseal') {
    const f = args[args.length - 1], env = rj(f), rec = openAny(env)
    const audience = (opt('audience') || fail('--audience')).split(',').filter(Boolean), agents = (opt('agents') || (env.agents || []).join(',')).split(',').filter(Boolean)
    wj(f, seal(rec, audience, agents)); say(`resealed ${env.id}: ${env.audience.join(', ')} -> ${audience.join(', ')} (a new CEK)`)
} else if (cmd === 'audience') {
    const env = rj(args[args.length - 1]); console.log(`${env.id} (${env.kind}): ${env.audience.join(', ')}${(env.agents || []).length ? '; agents ' + env.agents.join(', ') : ''}; sealed by ${env.sealed_by} at ${env.at}`)
} else if (cmd === 'derive') {
    for (const w of pos[1] ? [pos[1]] : ['public', 'private']) { const [n, e] = derive(vdir(w)); say(`${w}: ${n} nodes, ${e} edges`) }
} else if (cmd === 'app') {
    for (const w of pos[1] ? [pos[1]] : ['public', 'private']) { appFiles(w); derive(vdir(w)); push(w, 'the app, schemas and README rebuilt') }
} else if (cmd === 'seal-keys') {
    const stamp = now().replace(/:\d\dZ$/, 'Z').replace(/[-:]/g, '').replace(/^(\d{4})(\d\d)(\d\d)T/, '$1-$2-$3T'), v = vaults().private
    const vk = fs.readFileSync(path.join(CRM, 'private.vault_key'), 'utf8').trim()
    for (const k of personKeys()) {
        const out = path.join(ROOT, 'data/sealed', k.person, `${stamp}-team-crm-key.json`)
        wj(out, ecies(k.person, { title: 'The team CRM: the private vault\'s key', text: `This is the vault key of ${v.name} (${v.vault_id}), the team's private CRM (WS-170). With it and your own key (the one in this browser) you read what is sealed to you there: open /crm/ on the site and press Open the private CRM. It also gives write access to the private CRM, so keep it in your password manager. From ${AGENT}.`, fields: { 'Vault key': vk, 'Vault id': v.vault_id } }))
        say(`sealed to ${k.person}: ${path.relative(ROOT, out)}`)
    }
    execFileSync('python3', ['-I', path.join(HERE, 'crm_agents.py'), '--root', ROOT, '--stamp', stamp, '--vault-id', v.vault_id, '--name', v.name, '--key-file', path.join(CRM, 'private.vault_key')], { stdio: 'inherit' })
} else if (cmd === 'site') {                                                 // data/crm.json: what the site page needs, keys excepted
    const v = vaults(), when = now()
    wj(path.join(ROOT, 'data/crm.json'), {
        about: "The team CRM (WS-170, admin/tools/crm.mjs). The public CRM's read key is published on purpose: it reads public facts only. The private CRM's vault key is sealed to each person (data/sealed/<id>/*-team-crm-key.json) and to their conductors (data/sealed/agents/); its sensitive records are sealed again, to an audience (ws-crm-env-1).",
        agent: AGENT, updated: when, endpoint: HOST,
        public: { name: v.public.name, vault_id: v.public.vault_id, read_key: v.public.read_key_public, vault_url: `https://dev.vault.sgraph.ai/#${v.public.read_key_public}:${v.public.vault_id}` },
        private: { name: v.private.name, vault_id: v.private.vault_id, key_file_suffix: '-team-crm-key.json' },
        envelope: 'ws-crm-env-1',
    })
    say('data/crm.json written (the public read key, the private vault id)')
} else fail('usage: create | seed-public | seed-private | seal | open | reseal | audience | derive | app | seal-keys | site (see the top of this file)')
