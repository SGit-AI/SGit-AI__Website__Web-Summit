// The follow-up list (followups@web-summit.indi, 13 November 2026, at Indi's word, with Dinis's note: "you should be
// using a CRM vault to publish your contacts since the sites can't contain that data"). Nothing about a contact is on
// this site: the list is one sealed record in the private CRM (ws-team-crm-private), actions/<RECORD>.sealed.json,
// envelope ws-crm-env-1, sealed to everyone with a site key. This page opens it the way assets/crm.js does: the private
// CRM's vault key sealed to you (layer 1, opened in memory by WSKeyring), then the record's own key sealed to you
// (layer 2). Everything stays in this browser's memory; nothing is stored or sent. Read-only for now: ticks and notes
// are made on Indi's working copy (its link is inside the sealed record) until the drop box lands (WS-217).
(() => {
    'use strict'
    const mount = document.getElementById('crm-follow-ups'); if (!mount) return
    const up = document.body.dataset.up || ''
    const RECORD = 'actions/2026-11-13-ws-follow-ups.sealed.json'
    const TAGS = ['Customer', 'Investor', 'Partner', 'Other'], LABEL = { Investor: 'Investors', Customer: 'Customers', Partner: 'Partners', Other: 'Other', All: 'Everyone' }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    const safe = u => /^https:\/\/(www\.)?linkedin\.com\//.test(String(u || '')) ? u : ''
    let CFG = null, KR = null, REC = null, filter = 'Customer'

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
            REC = await openRecord(env, r)
            REC.sealedAt = env.at
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
        const item = c => `<li class="fu-row${c.followed_up ? ' fu-done' : ''}"><input type="checkbox" disabled ${c.followed_up ? 'checked' : ''} aria-label="${c.followed_up ? 'Followed up' : 'Not followed up yet'}: ${esc(c.name)}">
<div class="fu-who"><b>${esc(c.name)}</b> <span class="fu-tag fu-${esc((c.tag || 'Other').toLowerCase())}">${esc(c.tag || 'Other')}</span><span class="fu-role">${esc(c.role || 'Role not added yet')}</span>
<span class="meta">${[c.met ? 'Connected ' + esc(c.met) : '', c.followed_up && c.followed_up_at ? 'Followed up ' + esc(String(c.followed_up_at).slice(0, 10)) : '', 'Owner ' + esc(c.owner || '')].filter(Boolean).join(' · ')}</span>
${c.note ? `<span class="fu-note">${esc(c.note)}</span>` : ''}</div>
${safe(c.linkedin) ? `<a href="${esc(c.linkedin)}" rel="noopener">LinkedIn</a>` : ''}</li>`
        out.innerHTML = `<div class="fu-head"><p class="fu-count"><b>${n} of ${all.length}</b> followed up</p><div class="fu-bar"><i style="width:${all.length ? Math.round(n / all.length * 100) : 0}%"></i></div></div>
<div class="fu-pills" role="group" aria-label="Show one category">${[...TAGS, 'All'].map(t => `<button type="button" data-f="${t}" class="fu-pill fu-${t.toLowerCase()}" aria-pressed="${t === filter}">${LABEL[t]} <span>${left(t)}</span></button>`).join('')}</div>
<h3>To follow up: ${esc(filter === 'All' ? 'everyone' : LABEL[filter].toLowerCase())}</h3>
<ul class="fu-list">${todo.length ? todo.map(item).join('') : '<li class="meta">Nobody left in this category.</li>'}</ul>
<details class="fu-donebox"><summary>Followed up (${done.length})</summary><ul class="fu-list">${done.length ? done.map(item).join('') : '<li class="meta">Nobody ticked yet.</li>'}</ul></details>
<p class="meta">Read-only here for now. To tick someone or add a note, use the working copy${REC.working_copy && /^https:\/\/claude\.ai\//.test(REC.working_copy) ? ` (<a href="${esc(REC.working_copy)}" rel="noopener">open it</a>; ask Indi to share it with you)` : ''}. Saving from this page comes with WS-217. Sealed ${esc(REC.sealedAt || '')} by ${esc(REC.updated_by || '')}.</p>`
        out.querySelector('.fu-pills').onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return; filter = b.dataset.f; try { localStorage.setItem('ws-fu-filter', filter) } catch { } render() }
    }
    if (document.readyState === 'complete') start(); else addEventListener('DOMContentLoaded', start)
})()
