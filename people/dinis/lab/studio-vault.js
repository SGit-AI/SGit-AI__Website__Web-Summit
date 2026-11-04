// The policy studio's vault tools (Dinis's lab, experiment 3, WS-137; sgit@web-summit.dinis, 4 November 2026).
// A fourth tool group, "Vaults", off by default: list the team's published vaults and read any of them with its public
// read key; create a vault, write into it, and hand out its read key. The studio then leaves a vault, not a page.
//
// The crypto is the vault UI's own library, pinned on this origin (assets/vendor/sg-vault/2026-11-04/, see its README),
// as sgit.ai recommends for any page that holds keys (https://sgit.ai/docs/vault/vault-from-javascript.md). Loaded on
// first use only.
//
// What never reaches the model: a vault key, and the SG/Send access token. Tool results go to OpenRouter as part of the
// conversation and are kept in the conversation's local storage, so they carry only vault ids and public read keys.
// create_vault and write_to_vault each need the person's yes (a confirm showing what will be written), and create_vault
// returns only the new vault's id: its read key, like its vault key, stays in the person's panel (WS-137 review).
// The vault key of a vault made here is shown to the person in the "Vaults made in this browser" panel, to copy into
// their password manager, and is kept in this browser's local storage so the studio can keep writing to it. The access
// token is pasted by the person into that panel and kept the same way. Use a test token until security@web-summit.dinis
// has reviewed this (WS-137): local storage is shared by every script on this origin.
(() => {
    'use strict'
    const here = document.currentScript && document.currentScript.src
    const LIB = here ? new URL('../../../assets/vendor/sg-vault/2026-11-04/', here).href : '/assets/vendor/sg-vault/2026-11-04/'
    const FILES = ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js', 'sg-vault/sg-vault-ref-manager.js', 'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js', 'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js', 'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js']
    const ENDPOINT = 'https://dev.send.sgraph.ai'
    const SITE = location.origin
    const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch { } } }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const token = () => LS.get('studio.sgsend.token', '')
    const mine = () => LS.get('studio.vaults', [])              // [{ id, name, key, read, made }]: vaults made in this browser
    const device = () => { let d = LS.get('studio.device', ''); if (!d) { d = 'studio-' + [...crypto.getRandomValues(new Uint8Array(6))].map(b => b.toString(16).padStart(2, '0')).join(''); LS.set('studio.device', d) } return d }

    let loading = null
    const load = () => loading ??= FILES.reduce((p, f) => p.then(() => new Promise((ok, no) => {   // in order: each adds to the last
        const s = document.createElement('script'); s.src = LIB + f; s.onload = ok; s.onerror = () => no(new Error(`could not load ${f}`)); document.head.appendChild(s)
    })), Promise.resolve())

    const READ = /^(?:sgit_public_read_)?([0-9a-f]{64}):([a-z0-9]{8,12})$/
    const passphrase = (n = 24) => { const abc = 'abcdefghijklmnopqrstuvwxyz0123456789', out = []; while (out.length < n) for (const b of crypto.getRandomValues(new Uint8Array(n))) if (b < 252 && out.length < n) out.push(abc[b % 36]); return out.join('') }
    const hex = u8 => [...u8].map(b => b.toString(16).padStart(2, '0')).join('')
    const split = p => { const parts = String(p || '/').split('/').filter(Boolean); return { folder: '/' + parts.slice(0, -1).join('/'), name: parts[parts.length - 1] || '' } }
    async function ensureLoaded(v, folder) { let p = ''; for (const part of folder.split('/').filter(Boolean)) { p += '/' + part; if (v.needsLoading && v.needsLoading(p)) await v.loadSubTreeOnDemand(p) } }

    // WS-137 review (security@web-summit.dinis, dev@web-summit.dinis): the model reads material others wrote, so a write
    // happens only when the person says yes to that one call, after seeing what will be written and where
    const yes = (what, detail) => {
        const ok = window.confirm(`The policy studio wants to ${what}.\n\n${String(detail).slice(0, 900)}${String(detail).length > 900 ? '\n[...]' : ''}\n\nAllow this one write?`)
        if (!ok) throw new Error('the person said no to this write; do not retry it unless they ask')
    }

    // the team's published vaults: people/<id>/vaults.json, for every person on the roster
    async function published() {
        const team = await (await fetch(`${SITE}/data/team.json`, { cache: 'no-cache' })).json()
        const out = []
        for (const m of team.members.filter(m => m.kind === 'human')) {
            const r = await fetch(`${SITE}/people/${m.id}/vaults.json`, { cache: 'no-cache' }); if (!r.ok) continue
            for (const v of (await r.json()).vaults || []) if (/^sgit_public_read_[0-9a-f]{64}$/.test(v.read_key)) out.push({ person: m.name, name: v.name, vault_id: v.vault_id, what: v.what, app: !!v.app, read_key: `${v.read_key}:${v.vault_id}` })
        }
        return out
    }
    async function openRead(readKey) {
        await load()
        const m = READ.exec(String(readKey).trim()); if (!m) throw new Error('a read key looks like sgit_public_read_<64 hex>:<vault id>; this tool takes nothing else (never a vault key)')
        const c = await SGVaultCrypto.deriveReadOnlyCreds(m[2], m[1])
        return SGVault.openReadOnly(new SGSend({ endpoint: ENDPOINT }), c.vaultId, c.readKeyB64, c.refFileId)
    }
    async function openMine(id) {
        const v = mine().find(x => x.id === id); if (!v) throw new Error(`${id} was not made in this browser, so the studio holds no key to write to it`)
        if (!token()) throw new Error('no SG/Send access token in this browser: the person pastes one into "Vaults made in this browser" below the studio')
        await load()
        return SGVault.open(new SGSend({ endpoint: ENDPOINT, token: token() }), v.key, { cloneBranch: device() })
    }
    async function publish(v) {   // compare-and-swap, merging if someone else published first (the documented pattern)
        if (v._refManager.lastRawRef(v._refFileId) === undefined) await v.getBehindCount()
        try { await v.pushIfMatch(); return } catch (e) { if (e.code !== 'ECAS') throw e }
        const theirs = await v._refManager.readRef(v._refFileId), r = await v.merge(theirs, { publish: false })
        if (r.conflicts.length) throw new Error('conflicts: ' + r.conflicts.join(', '))
        await v.pushIfMatch()
    }
    // a folder ('/', '/notes/') lists it; a file ('/README.md') reads it; '/notes' is whichever exists
    async function readFrom(v, path) {
        const parts = String(path || '/').split('/').filter(Boolean), full = '/' + parts.join('/')
        const list = async f => { await ensureLoaded(v, f); const e = v.listFolder(f); return e && { folder: f, entries: e.map(x => ({ name: x.name, type: x.type, size: x.size })) } }
        if (!parts.length || String(path).endsWith('/')) { const l = await list(full); if (l) return l; throw new Error(`no folder ${full}`) }
        const { folder, name } = split(full); await ensureLoaded(v, folder)
        if ((v.listFolder(folder) || []).some(e => e.name === name && e.type === 'file')) {
            const t = new TextDecoder().decode(await v.getFile(folder, name))
            return t.length > 14000 ? t.slice(0, 14000) + `\n\n[cut at 14000 characters of ${t.length}]` : t
        }
        const l = await list(full); if (l) return l
        throw new Error(`nothing at ${full}`)
    }

    window.STUDIO_TOOLS = {
        team_vaults: { group: 'Vaults', title: "The team's vaults", desc: "Lists the vaults the team has published on web-summit.sgit.ai/vaults/, each with its public read key (read only).",
            schema: { type: 'object', properties: {} }, run: published },
        read_vault: { group: 'Vaults', title: 'Read a vault', desc: 'Opens a vault with a public read key (sgit_public_read_<64 hex>:<vault id>) and lists a folder or reads a file. Read only.',
            schema: { type: 'object', properties: { read_key: { type: 'string', description: 'sgit_public_read_<64 hex>:<vault id>, from team_vaults or given by the person' }, path: { type: 'string', description: "a folder ('/' or '/notes/') or a file ('/README.md')" } }, required: ['read_key'] },
            async run({ read_key, path = '/' }) { return readFrom(await openRead(read_key), path) } },
        create_vault: { group: 'Vaults', title: 'Make a vault', desc: 'Makes a new encrypted vault on dev.send.sgraph.ai with a README, and returns its id. The person confirms first. Its read key and vault key stay with the person (shown below the studio), never in this conversation. Needs the person\'s SG/Send access token in this browser.',
            schema: { type: 'object', properties: { name: { type: 'string', description: 'a short name, e.g. "ACME agent policy"' }, readme: { type: 'string', description: 'the README.md: what the vault holds, who keeps it; public facts only' } }, required: ['name'] },
            async run({ name, readme }) {
                if (!token()) throw new Error('no SG/Send access token in this browser: the person pastes one into "Vaults made in this browser" below the studio')
                yes(`make a new vault called "${String(name).slice(0, 80)}" with this README`, readme || '(the default README)')
                await load()
                const v = await SGVault.create(new SGSend({ endpoint: ENDPOINT, token: token() }), passphrase(), { name: String(name).slice(0, 80) })
                const read = hex(await v.readKeyRawBytes()), id = v.getVaultKey().split(':').pop()
                LS.set('studio.vaults', [...mine(), { id, name: String(name).slice(0, 80), key: v.getVaultKey(), read: `sgit_public_read_${read}:${id}`, made: new Date().toISOString() }]); panel()
                await v.addFile('/', 'README.md', new TextEncoder().encode(readme || `# ${name}\n\nMade with the policy studio on web-summit.sgit.ai. Public facts only.\n`))
                await publish(v)
                return { vault_id: id, note: 'Made and published. Its read key is in the person\'s panel under the studio, not here: the person decides who gets it. Anyone with the read key can read every version, so write only public facts into it.' }
            } },
        write_to_vault: { group: 'Vaults', title: 'Write into a vault', desc: 'Writes one text file (the policy, the scenario as JSON, notes) into a vault made in this browser, and publishes it, after the person confirms. Public facts only: the read key may be handed out.',
            schema: { type: 'object', properties: { vault_id: { type: 'string' }, path: { type: 'string', description: "e.g. '/policy.md' or '/scenario/steps.json'" }, content: { type: 'string' } }, required: ['vault_id', 'path', 'content'] },
            async run({ vault_id, path, content }) {
                const { folder, name } = split(path); if (!name) throw new Error('give a file path, e.g. /policy.md')
                if (!mine().some(x => x.id === vault_id)) throw new Error(`${vault_id} was not made in this browser, so the studio holds no key to write to it`)
                yes(`write ${folder === '/' ? '' : folder}/${name} into the vault ${vault_id}`, content)
                const v = await openMine(vault_id)
                await ensureLoaded(v, folder)
                let p = ''; for (const part of folder.split('/').filter(Boolean)) { p += '/' + part; if (!v.listFolder(p)) await v.createFolder(p) }
                const bytes = new TextEncoder().encode(String(content)), exists = (v.listFolder(folder) || []).some(e => e.name === name && e.type === 'file')
                await (exists ? v.updateFile(folder, name, bytes) : v.addFile(folder, name, bytes)); await publish(v)
                return `${exists ? 'updated' : 'wrote'} ${folder === '/' ? '' : folder}/${name} (${bytes.length} bytes) in ${vault_id}, published`
            } },
        read_my_vault: { group: 'Vaults', title: 'Read back a vault made here', desc: 'Lists a folder or reads a file of a vault made in this browser, as now published.',
            schema: { type: 'object', properties: { vault_id: { type: 'string' }, path: { type: 'string' } }, required: ['vault_id'] },
            async run({ vault_id, path = '/' }) { const v = mine().find(x => x.id === vault_id); if (!v) throw new Error(`${vault_id} was not made in this browser`); return readFrom(await openRead(v.read), path) } },
    }

    // the person's panel, under the studio: the access token (pasted, kept in this browser) and the vaults made here
    function panel() {
        const host = document.getElementById('studio'); if (!host) return
        let el = document.getElementById('st-vaults'); if (!el) { el = document.createElement('details'); el.id = 'st-vaults'; host.after(el) }
        const vs = mine()
        el.innerHTML = `<summary>Vaults made in this browser (${vs.length})</summary>
<p>For the <b>Vaults</b> tools. The studio never shows the model a vault key or your token. ${token() ? 'An SG/Send access token is set in this browser.' : 'To make vaults, paste your SG/Send access token (from Dinis):'} <input id="st-tok" type="password" autocomplete="off" placeholder="SG/Send access token" size="28"> <button id="st-tok-save">${token() ? 'Replace' : 'Keep in this browser'}</button>${token() ? ' <button id="st-tok-del">Forget it</button>' : ''}</p>
<p class="meta">Experimental (WS-137): use a test token until security has reviewed it. Local storage is readable by every script on this site.</p>
${vs.length ? `<table><tr><th>Vault</th><th>Read key (public)</th><th>Vault key (yours only)</th></tr>${vs.map((v, i) => `<tr><td><b>${esc(v.name)}</b><br><code>${esc(v.id)}</code></td><td><a href="https://dev.vault.sgraph.ai/#${esc(v.read.replace(':', '%3A'))}" target="_blank" rel="noopener">open</a> · <code>${esc(v.read.slice(0, 30))}…</code> <button data-copy-read="${i}">copy</button></td><td><button data-show="${i}">show</button> <button data-copy-key="${i}">copy</button> <span data-key="${i}"></span></td></tr>`).join('')}</table><p class="meta">Copy each vault key into your password manager: there is no reset, and clearing this browser's data loses it. Never paste it into the chat.</p>` : ''}`
        el.querySelector('#st-tok-save').onclick = () => { const t = el.querySelector('#st-tok').value.trim(); if (t) { LS.set('studio.sgsend.token', t); panel() } }
        const del = el.querySelector('#st-tok-del'); if (del) del.onclick = () => { try { localStorage.removeItem('studio.sgsend.token') } catch { } panel() }
        el.querySelectorAll('[data-show]').forEach(b => b.onclick = () => { const s = el.querySelector(`[data-key="${b.dataset.show}"]`); s.textContent = s.textContent ? '' : vs[b.dataset.show].key })
        el.querySelectorAll('[data-copy-key]').forEach(b => b.onclick = () => navigator.clipboard && navigator.clipboard.writeText(vs[b.dataset.copyKey].key))
        el.querySelectorAll('[data-copy-read]').forEach(b => b.onclick = () => navigator.clipboard && navigator.clipboard.writeText(vs[b.dataset.copyRead].read))
    }
    document.addEventListener('DOMContentLoaded', panel)
})()
