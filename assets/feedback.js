// Feedback from any page to an agent's vault, over a write-only append lane (dev@web-summit.dinis, 3 November 2026,
// at Dinis's word). The pattern is the newsroom's reader's log (sgit.ai/docs/briefs/newsroom-reader-log-chat-relay):
// everything is kept in this browser's local storage first, shown in a pane on the right where it can be edited, and
// sent only when the reader presses Submit. Each submission is sealed in the browser to the agent's public key
// (sgit's hybrid v2 envelope: AES-256-GCM, the key wrapped with RSA-OAEP-4096) and appended to the agent's vault
// lane, so the lane server sees ciphertext only. The page holds the lane's append token, which can write and nothing
// else (sgit.ai/api/append-lanes: it cannot list, read or delete). The agent drains the lane with
// admin/tools/feedback_drain.py. Off by default: ?feedback=on turns it on for this device, ?feedback=off turns it off.
(() => {
    'use strict'
    const LS = { get(k, d) { try { const v = localStorage.getItem('fb.' + k); return v === null ? d : JSON.parse(v) } catch { return d } }, set(k, v) { try { localStorage.setItem('fb.' + k, JSON.stringify(v)); return true } catch { return false } }, del(k) { try { localStorage.removeItem('fb.' + k) } catch { } } }
    const q = new URLSearchParams(location.search).get('feedback')
    // WS-74 (dev@web-summit.jose, 4 November 2026, at Jose's word): ?feedback=on&to=<agent> opens on that agent's lane,
    // so a link can send an outsider to the right inbox; an agent not in lanes[] falls back as before
    const qto = new URLSearchParams(location.search).get('to')
    // the public mode (WS-74 item 2 and 4, dev@web-summit.dinis): a link with to= is for someone outside the team, so for
    // this visit only (not remembered, a team member keeps their own lane): no lane list, Comment only, no images (a
    // screenshot can show a contact detail), and two spam signals the drain can check, a honeypot and the time it opened
    const PUBLIC = q === 'on' && !!qto && /^[a-z0-9-]+@web-summit\.[a-z0-9-]+$/.test(qto)
    const OPENED = new Date().toISOString()
    // WS-64 (proposed by dev@web-summit.angelo): a public link is for that visit only, so it does not turn the pane on
    // for later visits (where a stranger would meet the team's pane), and it opens the pane at once (a QR code on a shirt)
    if (q === 'on' && !PUBLIC) LS.set('on', true)
    if (q === 'off') LS.del('on')
    if (!PUBLIC && !LS.get('on', false)) return
    const script = document.currentScript, base = script ? script.src.replace(/feedback\.js(\?.*)?$/, '') : '/assets/'
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const KINDS = PUBLIC ? [['comment', 'Comment']] : [['comment', 'Comment'], ['decision', 'Decision'], ['idea', 'Idea'], ['bug', 'Something wrong']]
    const CHOICES = ['Approve', 'Reject', 'Change it', 'Not now']
    // WS-74's five questions, approved by Jose on 4 November 2026 (dev@web-summit.jose; people/jose/dev/WS-74-plan.md):
    // public mode only; the first is the only required one, the quote tick is off by default, nothing asks who you are
    const REACT = [['love', 'Love it'], ['like', 'Like it'], ['not-for-me', 'Not for me']], SHARE = [['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']]
    const ROLES = [['', 'Prefer not to say'], ['security', 'Security'], ['risk-or-compliance', 'Risk or compliance'], ['builder', 'Builder'], ['investor', 'Investor'], ['press', 'Press'], ['other', 'Other']]
    const radios = (name, opts) => `<div class="row" role="radiogroup">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}"> ${l}</label>`).join(' ')}</div>`
    const PUBQ = `<fieldset class="fb-q"><legend><b>What did you think of it?</b> (required)</legend>${radios('fb-reaction', REACT)}</fieldset>
<label class="meta" for="fb-text"><b>One thing you'd change?</b> (optional)</label>`
    const PUBQ2 = `<fieldset class="fb-q"><legend><b>Would you show it to someone?</b> (optional)</legend>${radios('fb-share', SHARE)}</fieldset>
<label class="meta"><b>Which describes you best?</b> (optional) <select id="fb-role" style="width:auto">${ROLES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>
<label class="meta"><input type="checkbox" id="fb-quote-ok"> You may quote this anonymously on our site</label>`
    const answers = f => ({ reaction: (f.querySelector('input[name=fb-reaction]:checked') || {}).value || '', share: (f.querySelector('input[name=fb-share]:checked') || {}).value || null, role: f.querySelector('#fb-role').value || null, quote_ok: f.querySelector('#fb-quote-ok').checked })
    let CFG = null, items = LS.get('items', []), open = PUBLIC || LS.get('open', false), quote = '', pasted = [], kind = 'comment', draft = PUBLIC ? '' : LS.get('draft', '')
    LS.del('open') // WS-140: Give feedback (assets/me.js) asks for the pane open once, after its reload
    const save = () => { if (!LS.set('items', items)) toast('This browser is out of local storage: submit or delete some items (images take the most room).') }
    const unsent = () => items.filter(i => !i.sent_at)

    // ---------- sealing, as sgit pki encrypt does (byte-compatible with PKI__Crypto.hybrid_decrypt) ----------
    const b64 = bytes => { let s = ''; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b); return btoa(s) }
    const unpem = pem => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
    async function seal(pem, text) {
        const subtle = crypto.subtle
        const pub = await subtle.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
        const aes = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const c = await subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
        const w = await subtle.encrypt({ name: 'RSA-OAEP' }, pub, await subtle.exportKey('raw', aes))
        return btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) }))
    }
    // one append: the lane takes base64 of the .enc text, so the envelope is encoded twice (sgit.ai/api/append-lanes)
    async function append(text) {
        const enc = await seal(CFG.recipient.encrypt, text)
        const r = await fetch(`${CFG.host}/api/vault/append/write/${CFG.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: CFG.append_token, payload: btoa(enc) }) })
        if (!r.ok) throw new Error(r.status === 404 ? 'the lane refused the token (404)' : r.status === 413 ? 'too big for one message (413)' : r.status === 507 ? 'the lane is full: the agent has not drained it (507)' : `the lane said ${r.status}`)
    }

    // ---------- images: pasted or dropped, scaled down so local storage and the 5 MB lane limit hold ----------
    function shrink(file) {
        return new Promise((ok, no) => {
            const img = new Image(), url = URL.createObjectURL(file)
            img.onload = () => { const s = Math.min(1, 1600 / Math.max(img.width, img.height)), cv = document.createElement('canvas'); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url); ok({ name: file.name || 'pasted.jpg', type: 'image/jpeg', w: cv.width, h: cv.height, data: cv.toDataURL('image/jpeg', 0.82) }) }
            img.onerror = () => { URL.revokeObjectURL(url); no(new Error('not an image this browser can read')) }
            img.src = url
        })
    }
    async function takeImages(list, into) {
        for (const f of [...list].filter(f => f.type && f.type.startsWith('image/'))) { try { into.push(await shrink(f)) } catch (e) { toast(e.message) } }
    }

    // ---------- the pane ----------
    const css = `
.fb-btn{position:fixed;right:16px;bottom:16px;z-index:9998;font:600 14px/20px system-ui,sans-serif;padding:10px 14px;border-radius:999px;border:1px solid #0f766e;background:#0f766e;color:#fff;box-shadow:0 4px 14px rgb(0 0 0/.18);cursor:pointer}
.fb-btn b{background:#fff;color:#0f766e;border-radius:999px;padding:0 7px;margin-left:6px}
.fb-pane{position:fixed;top:0;right:0;bottom:0;width:min(var(--fb-w,420px),100vw);z-index:9999;display:flex;flex-direction:column;background:#fff;color:#1c1d21;border-left:1px solid #d5d0c2;font:400 14px/20px system-ui,sans-serif}
html.fb-docked body{margin-right:var(--fb-w,420px)}
.fb-pane .fb-grip{position:absolute;left:-4px;top:0;bottom:0;width:8px;cursor:col-resize;touch-action:none}.fb-pane .fb-grip:hover,.fb-pane .fb-grip.on{background:rgb(15 118 110/.35)}
@media (max-width:760px){html.fb-docked body{margin-right:0}.fb-pane{box-shadow:-8px 0 30px rgb(0 0 0/.15)}.fb-pane .fb-grip{display:none}}
.fb-pane header{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #e5e1d5}.fb-pane header b{flex:1}
.fb-pane .fb-body{flex:1;overflow-y:auto;padding:12px 14px}
.fb-pane textarea,.fb-pane select{width:100%;box-sizing:border-box;font:inherit;border:1px solid #d5d0c2;border-radius:8px;padding:8px;background:#fff;color:inherit}
.fb-pane textarea{min-height:84px;resize:vertical}
.fb-pane button{font:600 13px/18px system-ui,sans-serif;padding:7px 11px;border-radius:8px;border:1px solid #d5d0c2;background:#f2f0e9;color:inherit;cursor:pointer}
.fb-pane button.go{background:#0f766e;border-color:#0f766e;color:#fff}.fb-pane button:disabled{opacity:.5;cursor:default}
.fb-pane .row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0}
.fb-pane .q{border-left:3px solid #0f766e;padding:4px 8px;margin:6px 0;color:#5c5f66;font-style:italic;max-height:5em;overflow:hidden}
.fb-pane .it{border:1px solid #e5e1d5;border-radius:10px;padding:10px;margin:10px 0}
.fb-pane .it.sent{opacity:.75}.fb-pane .meta{font-size:12px;color:#5c5f66}
.fb-pane .imgs{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.fb-pane .imgs span{position:relative}
.fb-pane .imgs img{width:88px;height:66px;object-fit:cover;border-radius:6px;border:1px solid #e5e1d5}
.fb-pane .imgs button{position:absolute;top:2px;right:2px;padding:0 5px;font-size:11px}
.fb-pane h4{margin:16px 0 4px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#5c5f66}
.fb-pane .fb-q{border:0;padding:0;margin:8px 0}.fb-pane .fb-q legend{padding:0;margin-bottom:4px}.fb-pane .fb-q label{margin-right:10px}.fb-pane .fb-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}.fb-pane footer{border-top:1px solid #e5e1d5;padding:10px 14px}.fb-toast{position:fixed;left:50%;bottom:72px;transform:translateX(-50%);z-index:10000;background:#1c1d21;color:#fff;padding:8px 14px;border-radius:8px;font:500 13px/18px system-ui,sans-serif}
@media (prefers-color-scheme:dark){.fb-pane{background:#1c1c19;color:#ecebe6;border-color:#46453d}.fb-pane textarea,.fb-pane select{background:#24241f;border-color:#46453d}.fb-pane button{background:#24241f;border-color:#46453d}.fb-pane .it,.fb-pane header,.fb-pane footer{border-color:#34332d}.fb-pane .meta,.fb-pane h4,.fb-pane .q{color:#a9a59b}}`
    function toast(t) { const el = document.createElement('div'); el.className = 'fb-toast'; el.setAttribute('role', 'status'); el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 3200) }
    const thumbs = (imgs, id) => imgs && imgs.length ? `<div class="imgs">${imgs.map((m, n) => `<span><img src="${m.data}" alt="${esc(m.name)}">${id ? `<button type="button" data-rmimg="${id}:${n}" aria-label="Remove image">×</button>` : ''}</span>`).join('')}</div>` : ''
    const label = k => (KINDS.find(x => x[0] === k) || [, k])[1]
    function itemHtml(i) {
        const where = `<a href="${esc(i.page.url)}">${esc(i.page.title || i.page.path)}</a>`
        if (i.sent_at) return `<div class="it sent"><div class="meta">${esc(label(i.kind))}${i.choice ? `: <b>${esc(i.choice)}</b>` : ''} · ${where} · sent ${esc(i.sent_at.slice(0, 16).replace('T', ' '))} UTC</div>${i.quote ? `<div class="q">${esc(i.quote)}</div>` : ''}<div>${esc(i.text).replace(/\n/g, '<br>')}</div>${thumbs(i.images)}</div>`
        return `<div class="it" data-id="${i.id}"><div class="meta">${esc(label(i.kind))} · ${where} · ${esc(i.at.slice(11, 16))} UTC</div>${i.quote ? `<div class="q">${esc(i.quote)}</div>` : ''}
${i.kind === 'decision' ? `<div class="row">${CHOICES.map(c => `<button type="button" data-choice="${i.id}:${esc(c)}"${i.choice === c ? ' class="go"' : ''}>${esc(c)}</button>`).join('')}</div>` : ''}
<textarea data-edit="${i.id}"${i.answers ? ' maxlength="500"' : ''} aria-label="Edit this item">${esc(i.text)}</textarea>${thumbs(i.images, i.id)}
<div class="row"><button type="button" data-del="${i.id}">Delete</button></div></div>`
    }
    function render() {
        let btn = document.querySelector('.fb-btn'), pane = document.querySelector('.fb-pane')
        if (!btn) { btn = document.createElement('button'); btn.className = 'fb-btn'; btn.type = 'button'; btn.onclick = () => { quote = String(getSelection() || '').trim().slice(0, 600); open = !open; render() }; document.body.appendChild(btn) }
        btn.innerHTML = `Feedback${unsent().length ? `<b>${unsent().length}</b>` : ''}`; btn.setAttribute('aria-expanded', String(open)); btn.hidden = open
        document.documentElement.classList.toggle('fb-docked', open)
        if (!open) { if (pane) pane.remove(); return }
        if (!pane) { pane = document.createElement('aside'); pane.className = 'fb-pane'; pane.setAttribute('aria-label', 'Your feedback'); document.body.appendChild(pane) }
        const u = unsent(), s = items.filter(i => i.sent_at).slice(-20).reverse()
        pane.innerHTML = `<div class="fb-grip" role="separator" aria-orientation="vertical" aria-label="Drag to resize the feedback pane" tabindex="0"></div><header><b>Feedback${CFG ? ` to ${ALL && ALL.lanes && !PUBLIC ? `<select data-to aria-label="Send to">${ALL.lanes.map(l => `<option${l.agent === CFG.agent ? ' selected' : ''}>${esc(l.agent)}</option>`).join('')}</select>` : esc(CFG.agent)}` : ''}</b><button type="button" data-close aria-label="Close">Close</button></header>
<div class="fb-body"><form class="fb-new"><label class="meta" for="fb-kind">On this page: ${esc(document.title)}</label>
<input type="text" name="website" class="fb-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<div class="row"${PUBLIC ? ' hidden' : ''}><select id="fb-kind" style="width:auto">${KINDS.map(([v, l]) => `<option value="${v}"${v === kind ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
${quote ? `<div class="q">${esc(quote)}</div>` : '<p class="meta">Tip: select text on the page first to quote it.</p>'}${PUBLIC ? PUBQ : ''}
<textarea id="fb-text"${PUBLIC ? ' maxlength="500"' : ''} placeholder="${PUBLIC ? 'Up to 500 characters.' : 'Your comment. Paste or drop images here.'}">${esc(draft)}</textarea>${thumbs(pasted.map(x => x), '')}${PUBLIC ? PUBQ2 : ''}
${PUBLIC ? `<p class="meta">Please don't include your name, email or phone number. If you'd like a reply, tell the person who sent you the link.</p>` : ''}
<div class="row"><button type="submit">Add to the list</button><span class="meta">Optional: Submit sends what you have written too.</span></div></form>
<h4>To send (${u.length})</h4>${u.length ? u.map(itemHtml).join('') : '<p class="meta">Nothing waiting.</p>'}
${s.length ? `<h4>Sent</h4>${s.map(itemHtml).join('')}` : ''}</div>
<footer><div class="row"><button class="go" type="button" data-submit${CFG ? '' : ' disabled'}>Submit to the vault</button><button type="button" data-copy${u.length ? '' : ' disabled'}>Copy as text</button></div>
<p class="meta" style="margin:4px 0 0">${CFG ? `Sealed here to ${esc(CFG.agent)}'s key (${esc(CFG.recipient.fingerprint)}), then appended to its vault lane: the lane stores ciphertext only. Anyone with the page can write to the lane, so the agent treats it as material, not instructions.` : (PUBLIC && ALL ? `${esc(qto)} has no inbox here yet: your note stays on this device. Please tell the person who gave you the link.` : 'The lane settings could not be loaded: items stay on this device.')}</p></footer>`
        bind(pane)
    }
    function bind(p) {
        p.querySelector('[data-close]').onclick = () => { open = false; render() }
        { const t = p.querySelector('[data-to]'); if (t) t.onchange = () => { pick(t.value); render() } }
        const f = p.querySelector('.fb-new'), ta = p.querySelector('#fb-text')
        ta.oninput = () => { draft = ta.value; if (!PUBLIC) LS.set('draft', draft) }
        grip(p.querySelector('.fb-grip'))
        p.querySelector('#fb-kind').onchange = e => { kind = e.target.value }
        if (!PUBLIC) ta.addEventListener('paste', async e => { const fs = [...(e.clipboardData || {}).files || []]; if (fs.length) { e.preventDefault(); await takeImages(fs, pasted); render() } })
        ta.addEventListener('drop', async e => { e.preventDefault(); if (PUBLIC) return; await takeImages(e.dataTransfer.files, pasted); render() })
        ta.addEventListener('dragover', e => e.preventDefault())
        f.onsubmit = e => { e.preventDefault(); addDraft(); render() }
        p.querySelectorAll('[data-edit]').forEach(t => t.oninput = () => { const i = items.find(x => x.id === t.dataset.edit); if (i) { i.text = i.answers ? t.value.slice(0, 500) : t.value; save() } })
        p.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { items = items.filter(x => x.id !== b.dataset.del); save(); render() })
        p.querySelectorAll('[data-choice]').forEach(b => b.onclick = () => { const [id, c] = b.dataset.choice.split(/:(.*)/); const i = items.find(x => x.id === id); if (i) { i.choice = i.choice === c ? '' : c; save(); render() } })
        p.querySelectorAll('[data-rmimg]').forEach(b => b.onclick = () => { const [id, n] = b.dataset.rmimg.split(':'); if (!id) { pasted.splice(+n, 1) } else { const i = items.find(x => x.id === id); if (i) i.images.splice(+n, 1); save() } render() })
        const cp = p.querySelector('[data-copy]'); if (cp) cp.onclick = () => navigator.clipboard.writeText(unsent().map(i => `- [${label(i.kind)}${i.choice ? ': ' + i.choice : ''}] ${i.page.title} (${i.page.url})${i.quote ? `\n  > ${i.quote}` : ''}\n  ${i.text}${i.images.length ? ` (${i.images.length} image${i.images.length > 1 ? 's' : ''} not copied)` : ''}`).join('\n')).then(() => toast('Copied'))
        const sb = p.querySelector('[data-submit]'); if (sb) sb.onclick = submit
    }
    // what is in the box (and any images) becomes an item; false when the public form's required answer is missing
    function addDraft() {
        const p = document.querySelector('.fb-pane'); if (!p) return true
        const f = p.querySelector('.fb-new'), text = p.querySelector('#fb-text').value.trim(), a = PUBLIC ? answers(f) : null
        if (a && !a.reaction && (text || !unsent().length)) { toast('Please choose what you thought of it first.'); return false }
        if (!text && !pasted.length && !(a && a.reaction)) return true
        items.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), at: new Date().toISOString(), kind: p.querySelector('#fb-kind').value, text: a ? text.slice(0, 500) : text, quote, choice: a ? REACT.find(r => r[0] === a.reaction)[1] : '', images: pasted, page: { url: location.href.split('#')[0].split('?')[0], path: location.pathname, title: document.title }, ...(a ? { answers: a } : {}) })
        pasted = []; quote = ''; kind = 'comment'; draft = ''; LS.del('draft'); save(); return true
    }
    async function submit() {
        if (!CFG || !addDraft()) return
        const u = unsent(); if (!u.length) { render(); toast('Nothing to send: write something first.'); return }
        render()
        const btn = document.querySelector('[data-submit]'); btn.disabled = true; btn.textContent = 'Sealing and sending…'
        // batches stay well under the lane's 5 MB per message once sealed and encoded twice
        const batches = [[]]; let size = 0
        for (const i of u) { const n = JSON.stringify(i).length; if (size + n > 2.2e6 && batches[batches.length - 1].length) { batches.push([]); size = 0 } batches[batches.length - 1].push(i); size += n }
        let sent = 0
        try {
            for (const b of batches) {
                // signed when the person's key is in this browser (assets/keyring.js): the signature is over items_json, byte for byte
                const KR = window.WSKeyring, me = KR && KR.person, items_json = JSON.stringify(b)
                const signed = me ? { person: me, key: KR.fingerprint, alg: 'ECDSA-P256-SHA256-P1363', sig: await KR.sign(items_json) } : null
                await append(JSON.stringify({ type: 'web-summit.feedback/v1', to: CFG.agent, site: location.origin, sent_at: new Date().toISOString(), public: PUBLIC, opened_at: OPENED, hp: (document.querySelector('.fb-hp') || {}).value || '', from: me ? `${me} (signed with their key in this browser)` : 'the feedback pane on this device (unauthenticated)', ...(signed ? { signed, items_json } : {}), items: b }))
                const at = new Date().toISOString(); b.forEach(i => { i.sent_at = at }); sent += b.length; save()
            }
            toast(`Sent ${sent} to ${CFG.agent}'s vault`)
        } catch (e) { toast(`${sent ? `Sent ${sent}; ` : ''}not sent: ${e.message}. Your items are still here.`) }
        render()
    }
    // the pane is a side panel: the page moves left to make room (html.fb-docked), and the left edge drags to resize;
    // the width is kept on this device. Under 760 px wide it overlays, as there is no room beside it
    const setW = w => { w = Math.round(Math.max(300, Math.min(w, innerWidth * 0.7, 960))); document.documentElement.style.setProperty('--fb-w', w + 'px'); return w }
    setW(LS.get('w', 420))
    function grip(g) {
        if (!g) return
        g.onpointerdown = e => { e.preventDefault(); g.setPointerCapture(e.pointerId); g.classList.add('on') }
        g.onpointermove = e => { if (g.hasPointerCapture(e.pointerId)) setW(innerWidth - e.clientX) }
        g.onpointerup = e => { g.classList.remove('on'); LS.set('w', setW(innerWidth - e.clientX)) }
        g.onkeydown = e => { const d = { ArrowLeft: 40, ArrowRight: -40 }[e.key]; if (d) { e.preventDefault(); LS.set('w', setW(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--fb-w')) + d)) } }
    }
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st)
    // several lanes (feedback.json lanes[], conductor@web-summit.dinis, 4 November): the pane sends to the one chosen
    let ALL = null
    // WS-64: a public link to an agent with no lane opens on no lane (it says so and keeps the note on the device), never on someone else's
    const pick = (to, keep = true) => { if (!ALL) return; const l = (ALL.lanes || [ALL]); CFG = l.find(x => x.agent === to) || (PUBLIC ? null : l[0]); if (keep && CFG) LS.set('to', CFG.agent) }
    fetch(base + 'feedback.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).then(c => { ALL = c; if (c) PUBLIC ? pick(qto, false) : pick(LS.get('to', '')); render() }).catch(() => render())
})()
