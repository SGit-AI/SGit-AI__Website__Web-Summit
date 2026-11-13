// The follow-up list (followups@web-summit.indi, 13 November 2026, at Indi's word, with Dinis's note: "you should be
// using a CRM vault to publish your contacts since the sites can't contain that data"). Nothing about a contact is on
// this site: the list is one sealed record in the private CRM (ws-team-crm-private), actions/<RECORD>.sealed.json,
// envelope ws-crm-env-1, sealed to everyone with a site key. This page opens it the way assets/crm.js does: the private
// CRM's vault key sealed to you (layer 1, opened in memory by WSKeyring), then the record's own key sealed to you
// (layer 2). Everything stays in this browser's memory. Saving (WS-217): when assets/crm-follow-ups.json names a drop
// box, a tick or a note seals the WHOLE list again in this browser to the same audience (assets/crm-seal.js, public keys
// only), signs it with your key, and appends it to the drop box with a write-only token; conductor@web-summit.indi files
// the newest signed save into the private CRM (admin/tools/crm_followups.mjs drain). Until it is filed, this browser
// keeps the sealed save (ciphertext only) and shows it, so a reload does not lose it.
(() => {
    'use strict'
    const mount = document.getElementById('crm-follow-ups'); if (!mount) return
    const up = document.body.dataset.up || ''
    const RECORD = 'actions/2026-11-13-ws-follow-ups.sealed.json'
    const TAGS = ['Customer', 'Investor', 'Partner', 'Other'], LABEL = { Investor: 'Investors', Customer: 'Customers', Partner: 'Partners', Other: 'Other', All: 'Everyone' }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    const safe = u => /^https:\/\/(www\.)?linkedin\.com\//.test(String(u || '')) ? u : ''
    let CFG = null, KR = null, REC = null, filter = 'Customer', LANE = null, CUR = null, BASE = null, PK = [], AK = [], timer = null, saving = false, again = false

    // the vault library pinned on this site (the same files and steps as assets/crm.js)
    const LIB = 'assets/vendor/sg-vault/2026-11-04/'
    const LIB_FILES = ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js', 'sg-vault/sg-vault-ref-manager.js', 'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js', 'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js', 'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js']
    const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('could not load ' + src)); document.head.appendChild(s) })
    const lib = async () => { if (!window.SGVault) for (const f of LIB_FILES) await loadScript(up + LIB + f) }
    async function openWithVaultKey(vaultKey) {
        await lib()
        const { passphrase, vaultId } = SGVaultCrypto.parseVaultKey(SGVaultCrypto.stripKeyPrefix(vaultKey))
        const k = await SGVaultCrypto.deriveKeys(passphrase, vaultId)
        const raw = new Uint8Array(await crypto.subtle.exportKey('raw', k.readKey))
        let s = ''; for (const x of raw) s += String.fromCharCode(x)
        return SGVault.openReadOnly(new SGSend({ endpoint: CFG.endpoint }), vaultId, btoa(s), k.refFileId)
    }
    async function readJson(v, file) {
        const parts = file.split('/'), name = parts.pop()
        let p = ''
        for (const part of parts) { p += '/' + part; if (v.needsLoading && v.needsLoading(p)) await v.loadSubTreeOnDemand(p) }
        return JSON.parse(new TextDecoder().decode(await v.getFile('/' + parts.join('/'), name)))
    }
    async function openRecord(env, r) {
        const { cek } = await KR.open(r.env)
        const key = await crypto.subtle.importKey('raw', b64d(cek), { name: 'AES-GCM' }, false, ['decrypt'])
        return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(env.iv) }, key, b64d(env.ct))))
    }

    const say = html => { mount.innerHTML = html }
    async function start() {
        KR = window.WSKeyring || null
        try { CFG = await (await fetch(up + 'data/crm.json', { cache: 'no-cache' })).json() } catch { return say('<p class="meta">Could not load data/crm.json.</p>') }
        if (KR) { try { await KR.ready } catch { } }
        if (!KR || !KR.person) return say('<p><b>Team only.</b> The list opens in a browser that holds your site key (the <b>Add your key</b> box at the top of every page). Without it this page shows nothing: no names are on this site.</p>')
        let files = []
        try { const j = await (await fetch(up + 'me.json', { cache: 'no-cache' })).json(); files = ((j.people || {})[KR.person] || {}).sealed || [] } catch { }
        const f = files.filter(x => x.endsWith(CFG.private.key_file_suffix)).sort().pop()
        if (!f) return say(`<p>The private CRM's key is not sealed to ${esc(KR.person)} yet, so the list cannot open here. Ask conductor@web-summit.dinis.</p>`)
        let env
        try { env = await (await fetch(up + f, { cache: 'no-cache' })).json() } catch { return say('<p class="meta">Could not fetch your sealed key.</p>') }
        if (env.key !== KR.fingerprint) return say(`<p>The private CRM's key is sealed to ${esc(KR.person)}'s key ${esc(env.key)}, but this browser holds ${esc(KR.fingerprint)}. Add your current key first.</p>`)
        say(`<p>Signed in as <b>${esc(KR.person)}</b>. Opening decrypts the list in this browser's memory only.</p><p><button type="button" class="crm-go" data-open>Open the follow-up list</button></p><div data-out></div>`)
        mount.querySelector('[data-open]').onclick = e => open(env, e.target)
    }
    async function open(keyEnv, btn) {
        btn.disabled = true; btn.textContent = 'Opening...'
        const out = mount.querySelector('[data-out]')
        try {
            const m = await KR.open(keyEnv), vk = (m.fields || {})['Vault key']
            if (!vk) throw new Error('the sealed message holds no vault key')
            const v = await openWithVaultKey(vk)
            let env
            try { env = await readJson(v, RECORD) } catch { throw new Error('the list is not in the private CRM yet (it is being filed by Indi\'s conductor)') }
            const r = (env.recipients || []).find(x => x.to === KR.person && x.key === KR.fingerprint)
            if (!r) throw new Error(`the list is sealed to ${(env.audience || []).join(', ')}, not to this key`)
            // a save of yours not yet filed: kept here sealed, opened again with your key
            let pend = null; try { pend = JSON.parse(localStorage.getItem('ws-fu-pending') || 'null') } catch { }
            if (pend && pend.env && String(pend.env.at) > String(env.at)) { const pr = (pend.env.recipients || []).find(x => x.to === KR.person && x.key === KR.fingerprint); if (pr) { try { REC = await openRecord(pend.env, pr); REC.pending = true } catch { } } }
            else { try { localStorage.removeItem('ws-fu-pending') } catch { } }
            if (!REC) REC = await openRecord(env, r)
            REC.sealedAt = env.at; CUR = env; BASE = REC.pending ? pend.env.at : env.at
            try { LANE = await (await fetch(up + 'assets/crm-follow-ups.json', { cache: 'no-cache' })).json() } catch { LANE = null }
            if (LANE && !(LANE.append_token && LANE.vault_id && (env.audience || []).includes(KR.person))) LANE = null
            if (LANE) {
                try { [PK, AK] = await Promise.all(['data/person-keys.json', 'data/keys.json'].map(async f => (await (await fetch(up + f, { cache: 'no-cache' })).json()).keys)) } catch { LANE = null }
                if (LANE && !window.WSCrmSeal) { try { await loadScript(up + 'assets/crm-seal.js') } catch { LANE = null } }
            }
            btn.closest('p').hidden = true
            try { const f = localStorage.getItem('ws-fu-filter'); if (f && (f === 'All' || TAGS.includes(f))) filter = f } catch { }
            render()
        } catch (e) { btn.disabled = false; btn.textContent = 'Try again'; out.innerHTML = `<p class="meta">Could not open it: ${esc(e.message || e)}</p>` }
    }
    function render() {
        const out = mount.querySelector('[data-out]'), all = REC.contacts || []
        const left = t => all.filter(c => !c.followed_up && (t === 'All' || (c.tag || 'Other') === t)).length
        const shown = all.filter(c => filter === 'All' || (c.tag || 'Other') === filter)
        const todo = shown.filter(c => !c.followed_up), done = shown.filter(c => c.followed_up)
        const n = all.filter(c => c.followed_up).length
        const item = c => `<li class="fu-row${c.followed_up ? ' fu-done' : ''}"><input type="checkbox" data-tick="${esc(c.id)}" ${LANE ? '' : 'disabled'} ${c.followed_up ? 'checked' : ''} aria-label="${c.followed_up ? 'Followed up' : 'Not followed up yet'}: ${esc(c.name)}">
<div class="fu-who"><b>${esc(c.name)}</b> <span class="fu-tag fu-${esc((c.tag || 'Other').toLowerCase())}">${esc(c.tag || 'Other')}</span><span class="fu-role">${esc(c.role || 'Role not added yet')}</span>
<span class="meta">${[c.met ? 'Connected ' + esc(c.met) : '', c.followed_up && c.followed_up_at ? 'Followed up ' + esc(String(c.followed_up_at).slice(0, 10)) : '', 'Owner ' + esc(c.owner || '')].filter(Boolean).join(' · ')}</span>
${LANE ? `<textarea class="fu-note-in" data-note="${esc(c.id)}" rows="1" placeholder="Add a note, for example: sent email 14 Nov" aria-label="Note for ${esc(c.name)}">${esc(c.note || '')}</textarea>` : c.note ? `<span class="fu-note">${esc(c.note)}</span>` : ''}</div>
${safe(c.linkedin) ? `<a href="${esc(c.linkedin)}" rel="noopener">LinkedIn</a>` : ''}</li>`
        out.innerHTML = `<div class="fu-head"><p class="fu-count"><b>${n} of ${all.length}</b> followed up</p><div class="fu-bar"><i style="width:${all.length ? Math.round(n / all.length * 100) : 0}%"></i></div></div>
<div class="fu-pills" role="group" aria-label="Show one category">${[...TAGS, 'All'].map(t => `<button type="button" data-f="${t}" class="fu-pill fu-${t.toLowerCase()}" aria-pressed="${t === filter}">${LABEL[t]} <span>${left(t)}</span></button>`).join('')}</div>
<h3>To follow up: ${esc(filter === 'All' ? 'everyone' : LABEL[filter].toLowerCase())}</h3>
<ul class="fu-list">${todo.length ? todo.map(item).join('') : '<li class="meta">Nobody left in this category.</li>'}</ul>
<details class="fu-donebox"><summary>Followed up (${done.length})</summary><ul class="fu-list">${done.length ? done.map(item).join('') : '<li class="meta">Nobody ticked yet.</li>'}</ul></details>
<p class="meta" data-status>${LANE ? (REC.pending ? 'Your last save is waiting to be filed into the private CRM by conductor@web-summit.indi. It shows for others once filed.' : 'Tick someone or add a note: it is sealed in this browser, signed with your key and sent to the drop box. Others see it once conductor@web-summit.indi files it.') : `Read-only here until the drop box is set up (WS-217). To tick someone or add a note, use the working copy${REC.working_copy && /^https:\/\/claude\.ai\//.test(REC.working_copy) ? ` (<a href="${esc(REC.working_copy)}" rel="noopener">open it</a>; ask Indi to share it with you)` : ''}.`} Filed ${esc(REC.sealedAt || '')}${REC.updated_by ? ', last saved by ' + esc(REC.updated_by) : ''}.</p>`
        if (LANE) {
            out.onchange = e => { const t = e.target.closest('[data-tick]'); if (!t) return; const c = all.find(x => x.id === t.dataset.tick); if (!c) return; c.followed_up = t.checked; c.followed_up_at = t.checked ? new Date().toISOString() : null; c.followed_up_by = t.checked ? KR.person : null; queue(); render() }
            out.addEventListener('focusout', e => { const t = e.target.closest && e.target.closest('[data-note]'); if (!t) return; const c = all.find(x => x.id === t.dataset.note); if (!c || (c.note || '') === t.value.trim()) return; c.note = t.value.trim().slice(0, 1000); queue() })
        }
        out.querySelector('.fu-pills').onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return; filter = b.dataset.f; try { localStorage.setItem('ws-fu-filter', filter) } catch { } render() }
    }
    // ---------- saving: the whole list, sealed and signed, to the drop box ----------
    const status = t => { const s = mount.querySelector('[data-status]'); if (s) s.textContent = t }
    const b64u = s => { const b = new TextEncoder().encode(s); let o = ''; for (let i = 0; i < b.length; i += 0x8000) o += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(o) }
    function queue() { clearTimeout(timer); status('Saving...'); timer = setTimeout(save, 1200) }
    async function save() {
        if (saving) { again = true; return }
        saving = true
        try {
            const { sealedAt, pending, ...rec } = REC
            rec.updated_at = new Date().toISOString(); rec.updated_by = KR.person
            const env = await window.WSCrmSeal.seal(rec, { audience: CUR.audience, agents: CUR.agents || [], personKeys: PK, agentKeys: AK, by: KR.person })
            const env_json = JSON.stringify(env)
            const msg = { v: 'ws-followups-save-1', path: RECORD, base_at: BASE, env_json, signed: { person: KR.person, key: KR.fingerprint, sig: await KR.sign(env_json) } }
            const r = await fetch(`${LANE.host}/api/vault/append/write/${LANE.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: LANE.append_token, payload: b64u(JSON.stringify(msg)) }) })
            if (!r.ok) throw new Error(r.status === 404 ? 'the drop box refused the token' : r.status === 413 ? 'too big for one save' : r.status === 507 ? 'the drop box is full: it has not been collected' : 'the drop box answered ' + r.status)
            BASE = env.at; REC.updated_by = KR.person; REC.pending = true
            try { localStorage.setItem('ws-fu-pending', JSON.stringify({ env })) } catch { }
            status('Saved to the drop box, sealed and signed. Others see it once conductor@web-summit.indi files it into the private CRM.')
        } catch (e) { status('Not saved: ' + (e.message || e) + '. Your change is still on this page; try again.') }
        finally { saving = false; if (again) { again = false; save() } }
    }
    if (document.readyState === 'complete') start(); else addEventListener('DOMContentLoaded', start)
})()
