// The PKI section's generated page: /pki/keys/, every key on data/keys.json as a card, and a QR code for each
// ACTIVE key in pki.sgit.ai's own key format, so a person can scan an agent's key with their phone and seal a
// secret to it. By security@web-summit.dinis, 3 November 2026, at Dinis's word ("a page that should have the QR codes
// for everybody ... every agent that exists should have its QR code").
//
// What a QR code carries is pki.sgit.ai/qr/key/v1, exactly as pki-agent.mjs writes and reads it (qrKey, keyCode):
//   { "v": 1, "kind": "pki.sgit.ai/qr/key/v1", "fp": "<signing fingerprint>", "label": "...", "code": "k1.<enc>.<sign>.<label>" }
// The code is the whole public key (both halves), so whoever scans it needs nothing from this site to seal to it, and
// can recompute the fingerprint from the code to check it. The card also links https://pki.sgit.ai/send/#k1.… (sealing
// in the browser, to that key) and the bundle file on /keys/.
//
// A key is shown as:
//   active     a QR code and a send link (status "active" in data/keys.json, or no status and nothing saying it ended)
//   ended      no QR code, so nobody seals a secret to a dead session (status "ended", or its role says it ended)
// and, from git history, when its agent last committed ("last seen"). Quiet for more than 48 hours before the newest
// commit is flagged: a session key may be gone even when nobody marked it ended. Deterministic: no clock is read.
import crypto from 'node:crypto'
import { history } from './gitlog.mjs'
import { qrcode } from './vendor/qrcode-generator-2.0.4.mjs'

const b64url = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const der = pem => Buffer.from(String(pem).replace(/-----[^-]+-----/g, '').replace(/\s/g, ''), 'base64')
const fp = pem => 'sha256:' + crypto.createHash('sha256').update(der(pem)).digest('hex').slice(0, 16)

/** pki-agent.mjs keyCode(bundle), byte for byte */
export const keyCode = b => `k1.${b64url(der(b.encrypt))}.${b64url(der(b.sign))}.${b64url(Buffer.from(b.label || '', 'utf8'))}`
/** pki-agent.mjs qrKey(), byte for byte */
export const qrKeyText = (b) => JSON.stringify({ v: 1, kind: 'pki.sgit.ai/qr/key/v1', fp: b.signing_fingerprint, label: String(b.label || '').slice(0, 80), code: keyCode(b) })

/** one QR code as an inline SVG: black on white (scanners need the contrast in both themes), 4-module quiet zone */
export function qrSvg(text, title) {
    const q = qrcode(0, 'L'); q.addData(text, 'Byte'); q.make()
    const n = q.getModuleCount(), m = 4, size = n + 2 * m
    let d = ''
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) d += `M${x + m} ${y + m}h1v1h-1z`
    return `<svg class="qr" viewBox="0 0 ${size} ${size}" role="img" aria-label="${title.replace(/"/g, '&quot;')}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`
}

const ENDED = /(^|[.:;]\s*)(Ended\b|That session has ended)|\bhas ended\b/i
const agentOf = k => (String(k.bundle.label || k.label || '').match(/^([a-z0-9.-]+@web-summit(?:\.[a-z0-9-]+)?)/) || [])[1] || ''
const personOfAgent = a => (a.match(/@web-summit\.([a-z0-9-]+)$/) || [])[1] || ''

/** the cards' data: one row per key, with its status, its agent, its person and when it was last seen in git */
export function keyRows(ROOT, keyData) {
    let log = []
    log = history(ROOT).map(c => ({ t: c.t / 1000, s: c.s }))
    const newest = log.length ? log[0].t : 0
    return keyData.keys.map(k => {
        const agent = agentOf(k), b = k.bundle
        const status = k.status || (ENDED.test(k.role || '') ? 'ended' : 'active')
        const seen = agent ? log.find(c => c.s.startsWith(agent + ':')) : null
        const quiet = status === 'active' && (!seen || newest - seen.t > 48 * 3600)
        const problems = []
        if (fp(b.encrypt) !== b.fingerprint) problems.push('the encryption fingerprint does not match its key')
        if (fp(b.sign) !== b.signing_fingerprint) problems.push('the signing fingerprint does not match its key')
        return { id: k.id, label: b.label || k.label, role: k.role || '', added: k.added || '', agent, person: personOfAgent(agent), status, quiet, seen: seen ? new Date(seen.t * 1000).toISOString().replace(/:\d\d\.\d+Z$/, 'Z').replace('T', ' ') : '', b, problems }
    })
}

/** the page: { html, md } */
export function keysPage({ ROOT, keyData, teamData, esc }) {
    const rows = keyRows(ROOT, keyData)
    const name = id => (teamData.members.find(m => m.id === id) || {}).name || id
    const groups = new Map()
    for (const r of rows) { const g = r.person ? name(r.person) : 'The team\'s infrastructure'; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(r) }
    const active = rows.filter(r => r.status === 'active'), quiet = active.filter(r => r.quiet), bad = rows.filter(r => r.problems.length)
    const keyFile = r => `../../keys/sha256-${r.b.signing_fingerprint.split(':')[1]}.json`
    const intro = `Every key on [the keys page](../../keys/index.html), as a card: **${active.length} active** (with a QR code), **${rows.length - active.length} ended** (no QR code: nobody seals a secret to a session that is gone)${quiet.length ? `, and **${quiet.length} active but quiet** for more than 48 hours (marked: check before sealing to it)` : ''}.${bad.length ? ` **${bad.length} with a fingerprint that does not match its key.**` : ' Every fingerprint was recomputed from its key at build time and matches.'}

Each QR code is the agent's **whole public key** in pki.sgit.ai's own format (\`pki.sgit.ai/qr/key/v1\`, a \`k1.\` code), so the phone or agent that scans it needs nothing from this site and can check the fingerprint itself. **Send a secret** opens pki.sgit.ai's sealing page with that key filled in; the sealing happens in your browser. Before you seal anything, read [how secrets are given out](../secrets/index.html): **compare the fingerprint with the agent's own word** (WS-106), because anyone who can push here can add a key.`
    const card = r => {
        const head = `<h3>${esc(r.agent || r.label)}</h3><p class="pki-meta"><span class="pki-badge pki-${r.status}${r.quiet ? ' pki-quiet' : ''}">${r.status === 'ended' ? 'ended' : r.quiet ? 'active, quiet' : 'active'}</span> <code>${esc(r.b.signing_fingerprint)}</code></p>`
        const qr = r.status === 'active' && !r.problems.length ? `<a class="pki-qr" href="https://pki.sgit.ai/send/#${keyCode(r.b)}" title="Seal a secret to this key on pki.sgit.ai">${qrSvg(qrKeyText(r.b), `QR code: the public key of ${r.agent || r.label}`)}</a>` : ''
        const facts = `<ul class="pki-facts"><li>Added ${esc(r.added)}; last commit by this agent: ${r.seen ? esc(r.seen) + ' UTC' : 'none found'}</li><li>Encryption <code>${esc(r.b.fingerprint)}</code></li>${r.problems.map(p => `<li class="pki-problem">${esc(p)}</li>`).join('')}<li><a href="${keyFile(r)}">the bundle</a>${r.status === 'active' ? ` · <a href="https://pki.sgit.ai/send/#${keyCode(r.b)}">send a secret</a>` : ''}</li></ul>`
        return `<article class="pki-card pki-${r.status}">${head}${qr}<p class="pki-role">${esc(r.role)}</p>${facts}</article>`
    }
    const html = [...groups].map(([g, rs]) => `<h2>${esc(g)}</h2><div class="pki-grid">${rs.map(card).join('')}</div>`).join('')
    const md = intro + '\n\n' + [...groups].map(([g, rs]) => `## ${g}\n\n` + rs.map(r => `- **${r.agent || r.label}** (${r.status}${r.quiet ? ', quiet' : ''}): signing ${r.b.signing_fingerprint}, encryption ${r.b.fingerprint}; added ${r.added}; last commit ${r.seen || 'none found'}${r.status === 'active' ? `; send a secret: https://pki.sgit.ai/send/#${keyCode(r.b).slice(0, 24)}… (the full code is in the page's QR)` : ''}`).join('\n')).join('\n\n')
    return { intro, html, md, rows }
}
