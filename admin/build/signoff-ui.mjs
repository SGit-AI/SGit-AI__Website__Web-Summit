// The Official Sign-off on /print/ (WS-113), drawn at every build from the signatures themselves, so the page can never
// say "approved" when the files or the signatures say otherwise. The mechanism is procurement@web-summit.silvio's
// admin/tools/signoff.mjs (check(): each person's status, verified against data/keys.json and the files' sha256); this
// draws it, by designer@web-summit.dinis. Placeholders in content/print.md, each alone on its line:
//   {{signoff-summary}}   the bar at the top: how many sets are signed, and whether the files may go to the printer
//   {{signoff-download:<KB>}}  the zip button: "Draft: not for print" until every set and the shared designs are approved
//   {{signoff-shared}}    the hoodie and the card, signed once by Dinis (team/designer/print/final.json: items_signed_off)
//   {{signoff:<id>}}      a person's badge, their signature block (or how to sign), and the files they signed, with hashes
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execFileSync } from 'child_process'
import { check } from '../tools/signoff.mjs'

import { esc } from './text.mjs'
const BADGE = {
    approved: ['ok', 'APPROVED'], 'changes requested': ['warn', 'CHANGES REQUESTED'], superseded: ['warn', 'SUPERSEDED: RE-SIGN'],
    unsigned: ['warn', 'NOT YET SIGNED WITH A KEY'], 'bad signature': ['bad', 'BAD SIGNATURE'], awaiting: ['wait', 'AWAITING SIGN-OFF'],
}
const badge = st => { const [k, t] = BADGE[st] || ['wait', st.toUpperCase()]; return `<span class="so-badge so-${k}">${t}</span>` }

export function signoffBlocks(ROOT) {
    const rows = check('print'), byId = Object.fromEntries(rows.map(r => [r.person, r]))
    const F = JSON.parse(fs.readFileSync(path.join(ROOT, 'team/designer/print/final.json'), 'utf8'))
    const shared = Object.entries(F.items_signed_off || {}).map(([k, v]) => ({ item: k, design: k === 'hoodie' ? F.garments.hoodie.design : F.card.design, v }))
    const approved = rows.filter(r => r.status === 'approved').length, sharedOk = shared.every(s => s.v)
    const final = approved === rows.length && sharedOk
    const commitOf = rel => { try { return execFileSync('git', ['log', '-1', '--format=%h', '--', rel], { cwd: ROOT }).toString().trim() } catch { return '' } }
    const files = id => { const d = path.join(ROOT, 'team/designer/print/files', id); return fs.existsSync(d) ? fs.readdirSync(d).filter(f => !f.startsWith('.')).sort().map(f => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(d, f))).digest('hex')]) : [] }
    const waiting = rows.filter(r => r.status !== 'approved').map(r => r.name.split(' ')[0])
    const summary = {
        html: `<div class="so-summary so-${final ? 'ok' : 'wait'}"><b>${final ? 'Signed off: final, ready to print.' : 'Draft: not for print yet.'}</b> <span>${approved} of ${rows.length} sets signed off${waiting.length ? ` (waiting: ${esc(waiting.join(', '))})` : ''}; hoodie and card: ${sharedOk ? 'signed off' : 'awaiting Dinis'}.</span></div>`,
        md: `**${final ? 'Signed off: final, ready to print.' : 'Draft: not for print yet.'}** ${approved} of ${rows.length} sets signed off${waiting.length ? ` (waiting: ${waiting.join(', ')})` : ''}; hoodie and card: ${sharedOk ? 'signed off' : 'awaiting Dinis'}.`,
    }
    const download = kb => {
        const href = '../team/designer/print/riskmandate-print-files.zip'
        return { html: `<p><a class="so-download so-${final ? 'ok' : 'wait'}" href="${href}">${final ? 'Final, signed: send to the printer' : 'Draft: not for print'} <small>(zip, ${esc(kb)} KB: one folder per person, with a README)</small></a></p>`,
            md: `[${final ? 'Final, signed: send to the printer' : 'Draft: not for print'} (zip, ${kb} KB)](${href})` }
    }
    const sharedB = { html: `<div class="so-shared">${shared.map(s => `<p>${badge(s.v ? 'approved' : 'awaiting')} <b>The ${esc(s.item)} (${esc(s.design)})</b>, for everyone: ${s.v ? `signed off by ${esc(s.v.by)}, ${esc(s.v.at)}` : 'Dinis signs it once for all seven.'}</p>`).join('')}</div>`,
        md: shared.map(s => `- The ${s.item} (${s.design}): ${s.v ? `signed off by ${s.v.by}, ${s.v.at}` : 'awaiting Dinis'}`).join('\n') }
    const person = id => {
        const r = byId[id]; if (!r) return { html: '', md: '' }
        const rel = `people/${id}/signoff/print.json`, c = r.by ? commitOf(rel) : ''
        const sig = r.by ? `<blockquote class="so-sig"><p>“${esc(r.said)}”</p><p class="meta">${esc(r.name)}, ${r.decision === 'changes' ? 'asking for changes' : 'approved'}${r.note ? `: ${esc(r.note)}` : ''}. Signed by <code>${esc(r.by)}</code>${r.key ? ` with key <a href="../keys/index.html#${esc(r.key)}">${esc(r.fingerprint)}</a>` : r.fingerprint ? ` with key ${esc(r.fingerprint)}` : ''}, ${esc(r.at)}${c ? `, commit <a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/${c}">${c}</a>` : ''}.${r.why ? ` <b>${esc(r.why)}</b>` : ''}</p></blockquote>` : ''
        const how = r.status === 'approved' ? '' : `<details class="so-how"${r.status === 'awaiting' ? ' open' : ''}><summary>How to sign ${esc(r.name.split(' ')[0])}'s set</summary><p>${esc(r.name.split(' ')[0])}: tell your agent <i>"sign off my print set"</i> (or what to change). Your agent runs, with your own words:</p><pre><code>node admin/tools/signoff.mjs sign --person ${esc(id)} --by &lt;agent&gt;@web-summit.${esc(id)} --said "&lt;your words&gt;"
node pki-agent.mjs sign people/${esc(id)}/signoff/print.json
git add people/${esc(id)}/signoff/ &amp;&amp; git commit -m "&lt;agent&gt;@web-summit.${esc(id)}: print sign-off" -m "Agent: &lt;agent&gt;@web-summit.${esc(id)}" -m "Issue: WS-113"
AGENT=&lt;agent&gt;@web-summit.${esc(id)} admin/tools/release.sh "${esc(id)}'s print set signed off"</code></pre><p class="meta">To ask for changes: <code>--decision changes --note "what to change"</code>. The agent's key must be on the keys page.</p></details>`
        const fl = files(id)
        const list = `<details class="so-files"><summary>The ${fl.length} files${r.by ? ' as signed' : ''}, with their sha256</summary><ul>${fl.map(([f, h]) => `<li><code>${esc(f)}</code> <code class="meta">${h.slice(0, 12)}</code></li>`).join('')}</ul></details>`
        return { html: `<div class="so-set">${badge(r.status)}${sig}${how}${list}</div>`, md: `**Sign-off: ${(BADGE[r.status] || [, r.status])[1]}**${r.by ? `. "${r.said}", signed by ${r.by}${r.fingerprint ? ` with key ${r.fingerprint}` : ''}, ${r.at}.` : '.'}` }
    }
    return { summary, download, shared: sharedB, person, final }
}

export function expandSignoff(html, md, ROOT) {
    const B = signoffBlocks(ROOT)
    const one = (re, f) => { html = html.replace(new RegExp(`<p>${re}</p>`, 'g'), (...m) => f(...m.slice(1)).html); md = md.replace(new RegExp(re, 'g'), (...m) => f(...m.slice(1)).md) }
    one('\\{\\{signoff-summary\\}\\}', () => B.summary)
    one('\\{\\{signoff-download:(\\d+)\\}\\}', kb => B.download(kb))
    one('\\{\\{signoff-shared\\}\\}', () => B.shared)
    one('\\{\\{signoff:([a-z0-9-]+)\\}\\}', id => B.person(id))
    return { html, md }
}
