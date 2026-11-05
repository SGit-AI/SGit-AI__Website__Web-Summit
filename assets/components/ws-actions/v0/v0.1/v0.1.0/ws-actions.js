/**
 * ws-actions — a person's actions on their cards: kept in this browser, sent signed and sealed to their dashboard
 * agent's vault lane, and known as processed when the site says so.
 *
 * One queue, shared by the cockpit (assets/cockpit.js) and the focus pages (ws-focus-queue): localStorage 'ck.q',
 * entries { uid, ref, title, issue, action, option, words, delegate..., at, state: 'draft' | 'sent' | 'processed', sent_at }.
 * Sending: one message signed with the person's key in this browser (assets/keyring.js, window.WSKeyring), sealed to
 * the agent's public key (sgit's hybrid v2 envelope) and appended to its lane (assets/feedback.json); the agent
 * applies it (admin/tools/cockpit_apply.mjs) and writes each outcome by uid to people/<id>/cockpit-log.json, which
 * the build carries into dashboard.json as `processed`.
 * Every change fires 'ws-actions:changed' on document (and 'ck-changed' on window, which assets/me.js listens to).
 *
 * @module ws-actions
 * @version 0.1.0
 */
const KEY = 'ck.q'

export const ACTIONS = Object.freeze({
    decide   : { icon: '✓', verb: 'Decided' },
    done     : { icon: '✓', verb: 'Done' },
    delegate : { icon: '→', verb: 'Delegated' },
    details  : { icon: '?', verb: 'Need more details' },
    mine     : { icon: '★', verb: "It's mine" },
    note     : { icon: '✎', verb: 'Note' },
    later    : { icon: '⏸', verb: 'Later' },
    drop     : { icon: '✕', verb: 'No decision needed' },
    now      : { icon: '↑', verb: 'Do this first' },
})

export const uid = () => Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)

export function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
export function save(q) {
    try { localStorage.setItem(KEY, JSON.stringify(q)) } catch { }
    document.dispatchEvent(new CustomEvent('ws-actions:changed', { detail: { count: q.length }, bubbles: true, composed: true }))
    window.dispatchEvent(new Event('ck-changed'))
    return q
}

// what an action says, in one line: also the words the agent records
export function sentence(a) {
    const v = (ACTIONS[a.action] || { verb: a.action }).verb, w = a.words ? a.words : ''
    if (a.action === 'decide') return `Decided: ${[a.option, w].filter(Boolean).join('. ')}`
    if (a.action === 'delegate') return `Delegated to ${a.delegate_name || a.delegate}${w ? ': ' + w : ''}`
    if (a.action === 'done') return `Done${a.option || w ? ': ' + [a.option, w].filter(Boolean).join('. ') : ''}`
    return `${v}${a.option || w ? ': ' + [a.option, w].filter(Boolean).join('. ') : ''}`
}

// one draft per card: a second answer before sending replaces it; after sending, a new entry is added
export function add(entry) {
    const q = load(), d = q.findIndex(e => e.ref === entry.ref && e.state === 'draft')
    const e = { ...entry, uid: d >= 0 ? q[d].uid : uid(), at: new Date().toISOString(), state: 'draft' }
    if (d >= 0) q[d] = e; else q.push(e)
    save(q)
    return e
}
export function remove(id) { return save(load().filter(e => e.uid !== id)) }

// the layer an entry is in, given the processed list from dashboard.json
export function layer(e, processed) {
    const p = processed && processed[e.uid]
    if (p) return p.status === 'applied' ? 'done' : 'refused'
    return e.state === 'draft' ? 'draft' : 'sent'
}
export const processedMap = list => Object.fromEntries((list || []).map(p => [p.uid, p]))
export const latestFor = (ref, q = load()) => q.filter(e => e.ref === ref).slice(-1)[0]
export const acted = (ref, processed, q = load()) => { const e = latestFor(ref, q); return !!e && layer(e, processed) !== 'refused' }

// ---------- the lane: the same envelope as assets/feedback.js ----------
const b64 = bytes => { let s = ''; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b); return btoa(s) }
const unpem = pem => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
async function seal(pem, text) {
    const S   = crypto.subtle
    const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
    const aes = await S.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
    const iv  = crypto.getRandomValues(new Uint8Array(12))
    const c   = await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
    const w   = await S.encrypt({ name: 'RSA-OAEP' }, pub, await S.exportKey('raw', aes))
    return btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) }))
}

export async function laneFor(lanesUrl, agent) {
    const r = await fetch(lanesUrl, { cache: 'no-cache' })
    if (!r.ok) return null
    const j = await r.json()
    return (j.lanes || []).find(l => l.agent === agent) || null
}

// send every draft as one signed message; returns how many went
export async function send(lane) {
    const KR = window.WSKeyring
    if (!lane) throw new Error('no lane for the dashboard agent')
    if (!KR || !KR.person) throw new Error('no key in this browser')
    const q = load(), list = q.filter(e => e.state === 'draft')
    if (!list.length) return 0
    const page  = { url: location.href.split('#')[0].split('?')[0], path: location.pathname, title: document.title }
    const items = list.map(a => ({ id: a.uid, at: a.at, kind: 'decision', choice: a.action, text: `${a.title}: ${sentence(a)}`, quote: '', images: [], page, cockpit: a }))
    const items_json = JSON.stringify(items)
    const signed     = { person: KR.person, key: KR.fingerprint, alg: 'ECDSA-P256-SHA256-P1363', sig: await KR.sign(items_json) }
    const msg        = { type: 'web-summit.feedback/v1', to: lane.agent, site: location.origin, sent_at: new Date().toISOString(), public: false, opened_at: new Date().toISOString(), hp: '', from: `${KR.person} (signed with their key in this browser), from ${location.pathname}`, signed, items_json, items }
    const r = await fetch(`${lane.host}/api/vault/append/write/${lane.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: lane.append_token, payload: btoa(await seal(lane.recipient.encrypt, JSON.stringify(msg))) }) })
    if (!r.ok) throw new Error(r.status === 507 ? 'the lane is full: the agent has not drained it' : `the lane said ${r.status}`)
    const t = new Date().toISOString()
    for (const e of q) if (e.state === 'draft') { e.state = 'sent'; e.sent_at = t }
    save(q)
    return list.length
}
