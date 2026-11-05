// The team CRM on the site (WS-170; conductor@web-summit.dinis, 5 November 2026, at Dinis's word). Draws the two layers,
// then browses the PUBLIC CRM read with its published read key (data/crm.json), with the vault UI's own library pinned
// on this site (as assets/stickers-vote.js reads results.json). For a person whose browser holds their site key
// (assets/keyring.js) and who has the private CRM's key sealed to them (data/sealed/<id>/*-team-crm-key.json, listed in
// me.json): "Open the private CRM" opens that vault key in memory only (never stored, never written into the page), reads
// the private vault, and decrypts each ws-crm-env-1 record whose audience includes them: their recipient entry is a
// ws-ecies-1 envelope that WSKeyring.open turns into {cek}, and the CEK opens the record with AES-256-GCM.
// Everything from a vault reaches the page as text.
(() => {
    'use strict'
    const mount = document.getElementById('crm'); if (!mount) return
    const up = document.body.dataset.up || ''
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const $ = s => mount.querySelector(s)
    const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    let CFG = null, KR = null, PUB = null, PRIV = null, TAB = 'company'

    // ---------- the vault library (pinned copy), and reading files ----------
    const LIB = 'assets/vendor/sg-vault/2026-11-04/'
    const LIB_FILES = ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js', 'sg-vault/sg-vault-ref-manager.js', 'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js', 'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js', 'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js']
    const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('could not load ' + src)); document.head.appendChild(s) })
    let LIBP = null                                                       // load the twelve files once, even when two reads start together
    const lib = () => LIBP || (LIBP = (async () => { if (!window.SGVault) for (const f of LIB_FILES) await loadScript(up + LIB + f) })())
    async function openWithReadKey(readKey, vaultId) {
        await lib()
        const c = await SGVaultCrypto.deriveReadOnlyCreds(vaultId, readKey.replace(/^sgit_public_read_/, ''))
        return SGVault.openReadOnly(new SGSend({ endpoint: CFG.endpoint }), c.vaultId, c.readKeyB64, c.refFileId)
    }
    async function openWithVaultKey(vaultKey) {                 // the vault key stays in this function's memory
        await lib()
        const { passphrase, vaultId } = SGVaultCrypto.parseVaultKey(SGVaultCrypto.stripKeyPrefix(vaultKey))
        const k = await SGVaultCrypto.deriveKeys(passphrase, vaultId)
        const raw = new Uint8Array(await crypto.subtle.exportKey('raw', k.readKey))
        let s = ''; for (const x of raw) s += String.fromCharCode(x)
        return SGVault.openReadOnly(new SGSend({ endpoint: CFG.endpoint }), vaultId, btoa(s), k.refFileId)
    }
    async function readFile(v, file) {
        const parts = file.split('/'), name = parts.pop()
        let p = ''
        for (const part of parts) { p += '/' + part; if (v.needsLoading && v.needsLoading(p)) await v.loadSubTreeOnDemand(p) }
        return new TextDecoder().decode(await v.getFile('/' + parts.join('/'), name))
    }
    const readJson = async (v, f) => JSON.parse(await readFile(v, f))

    // ---------- the diagram: two layers ----------
    function diagram() {
        return `<figure class="crm-fig"><svg class="wide" viewBox="0 0 760 270" role="img" aria-labelledby="crm-fig-t crm-fig-d">
<title id="crm-fig-t">The two layers of the team CRM</title><desc id="crm-fig-d">Layer 1: the vault key opens the private vault, sealed to each person and their conductor. Layer 2: inside it, a sensitive record is encrypted with its own key, and that key is sealed to each person in the record's audience, so reading it needs the vault key and the person's own key.</desc>
<rect class="crm-v pub" x="10" y="20" width="220" height="230" rx="16"/><text class="crm-h" x="120" y="48" text-anchor="middle">Public CRM</text>
<text x="120" y="72" text-anchor="middle">read key: published</text><text x="120" y="104" text-anchor="middle">companies · contacts</text><text x="120" y="126" text-anchor="middle">schedules · graph</text><text x="120" y="160" text-anchor="middle">public facts, each</text><text x="120" y="180" text-anchor="middle">with its source</text>
<rect class="crm-v priv" x="270" y="20" width="480" height="230" rx="16"/><text class="crm-h" x="510" y="48" text-anchor="middle">Private CRM: layer 1, the vault key</text>
<text x="510" y="70" text-anchor="middle">sealed to each person's key and their conductor's</text>
<rect class="crm-rec" x="292" y="88" width="130" height="64" rx="10"/><text x="357" y="114" text-anchor="middle">a plain record</text><text x="357" y="134" text-anchor="middle">any key holder</text>
<rect class="crm-seal" x="442" y="88" width="290" height="144" rx="12"/><text class="crm-h" x="587" y="112" text-anchor="middle">layer 2: a sealed record</text>
<text x="587" y="134" text-anchor="middle">AES-256-GCM, its own key (CEK)</text>
<rect class="crm-k" x="458" y="148" width="80" height="28" rx="14"/><text x="498" y="167" text-anchor="middle">CEK → Dinis</text>
<rect class="crm-k" x="546" y="148" width="80" height="28" rx="14"/><text x="586" y="167" text-anchor="middle">CEK → Indi</text>
<rect class="crm-k agent" x="634" y="148" width="86" height="28" rx="14"/><text x="677" y="167" text-anchor="middle">CEK → agent</text>
<text x="587" y="204" text-anchor="middle">opens only with the vault key</text><text x="587" y="222" text-anchor="middle">and your own key, in your browser</text>
<rect class="crm-rec" x="292" y="166" width="130" height="64" rx="10"/><text x="357" y="186" text-anchor="middle">keys/public-crm</text><text x="357" y="206" text-anchor="middle">sealed to everyone</text><text x="357" y="222" text-anchor="middle">with a site key</text>
</svg>
<svg class="narrow" viewBox="0 0 360 600" role="img" aria-labelledby="crm-fig-t2"><title id="crm-fig-t2">The two layers of the team CRM, stacked</title>
<rect class="crm-v pub" x="10" y="10" width="340" height="120" rx="16"/><text class="crm-h" x="180" y="40" text-anchor="middle">Public CRM</text>
<text x="180" y="66" text-anchor="middle">read key: published</text><text x="180" y="90" text-anchor="middle">companies · contacts · schedules · graph</text><text x="180" y="112" text-anchor="middle">public facts, each with its source</text>
<rect class="crm-v priv" x="10" y="150" width="340" height="440" rx="16"/><text class="crm-h" x="180" y="180" text-anchor="middle">Private CRM: layer 1, the vault key</text>
<text x="180" y="204" text-anchor="middle">sealed to each person and their conductor</text>
<rect class="crm-rec" x="30" y="222" width="140" height="64" rx="10"/><text x="100" y="250" text-anchor="middle">a plain record</text><text x="100" y="270" text-anchor="middle">any key holder</text>
<rect class="crm-rec" x="190" y="222" width="140" height="64" rx="10"/><text x="260" y="246" text-anchor="middle">keys/public-crm</text><text x="260" y="266" text-anchor="middle">sealed to everyone</text><text x="260" y="282" text-anchor="middle">with a site key</text>
<rect class="crm-seal" x="30" y="306" width="300" height="266" rx="12"/><text class="crm-h" x="180" y="334" text-anchor="middle">layer 2: a sealed record</text>
<text x="180" y="358" text-anchor="middle">AES-256-GCM under its own key (CEK)</text>
<rect class="crm-k" x="60" y="378" width="240" height="30" rx="15"/><text x="180" y="398" text-anchor="middle">CEK sealed to Dinis's key</text>
<rect class="crm-k" x="60" y="416" width="240" height="30" rx="15"/><text x="180" y="436" text-anchor="middle">CEK sealed to Indi's key</text>
<rect class="crm-k agent" x="60" y="454" width="240" height="30" rx="15"/><text x="180" y="474" text-anchor="middle">CEK sealed to an agent's key</text>
<text x="180" y="516" text-anchor="middle">opens only with the vault key</text><text x="180" y="538" text-anchor="middle">and your own key, in your browser</text>
</svg><figcaption>Holding the private vault key alone shows that a sealed record exists, its kind and who it is for; never what it says.</figcaption></figure>`
    }

    // ---------- the browser ----------
    const TYPES = [['company', 'Companies'], ['contact', 'Contacts'], ['schedule', 'Schedules']]
    const label = n => n.label || n.id
    const sub = n => n.type === 'company' ? [n.kind === 'organisation' ? 'organisation' : n.category, n.country].filter(Boolean).join(' · ')
        : n.type === 'contact' ? [n.role, n.organisation].filter(Boolean).join(', ')
        : n.type === 'schedule' ? [n.date, n.start, n.where].filter(Boolean).join(' · ')
        : n.type === 'action' ? [n.state, n.due && 'due ' + n.due, n.owner].filter(Boolean).join(' · ') : ''
    function layout() {
        mount.innerHTML = `${diagram()}
<section class="crm-box" aria-labelledby="crm-pub-h"><h2 id="crm-pub-h">Browse the public CRM</h2>
<p class="meta" data-pubnote>Opening the public CRM with its published read key...</p>
<p class="crm-win"><button type="button" data-pubwin>Open the public CRM in a new window</button> <span class="meta">(the vault itself in SG/Vault; it holds about 900 files, so it can take a while to open)</span></p>
<div class="crm-bar"><div class="crm-tabs" data-tabs></div><input type="search" data-q placeholder="Search names, roles, sessions..." aria-label="Search the public CRM"></div>
<div class="crm-cols"><ol class="crm-list" data-list></ol><div class="crm-detail" data-detail><p class="meta">Pick a record: its facts, its sources, and a graph of what it is linked to.</p></div></div></section>
<section class="crm-box crm-private" aria-labelledby="crm-priv-h"><h2 id="crm-priv-h">The private CRM</h2><div data-priv><p class="meta">Checking whether this browser holds a key...</p></div></section>`
        $('[data-q]').addEventListener('input', list)
        $('[data-pubwin]').onclick = () => window.open(CFG.public.vault_url, '_blank', 'noopener')
    }
    function tabs() {
        $('[data-tabs]').innerHTML = TYPES.map(([k, n]) => `<button type="button" data-t="${k}" aria-pressed="${k === TAB}">${n} (${PUB.nodes.filter(x => x.type === k && x.file).length})</button>`).join('')
        $('[data-tabs]').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { TAB = b.dataset.t; tabs(); list() } }
    }
    function list() {
        const q = $('[data-q]').value.trim().toLowerCase()
        const rows = PUB.nodes.filter(n => n.file && (q ? (label(n) + ' ' + sub(n)).toLowerCase().includes(q) : n.type === TAB))
            .sort((a, b) => a.type === 'schedule' && b.type === 'schedule' ? ((a.date || '') + (a.start || '')).localeCompare((b.date || '') + (b.start || '')) : label(a).localeCompare(label(b))).slice(0, 300)
        $('[data-list]').innerHTML = rows.length ? rows.map(n => `<li><button type="button" data-id="${esc(n.id)}"><b>${esc(label(n))}</b><span>${esc(q ? n.type + ' · ' : '')}${esc(sub(n))}</span></button></li>`).join('') : '<li class="meta">Nothing matches.</li>'
        $('[data-list]').onclick = e => { const b = e.target.closest('[data-id]'); if (b) show(b.dataset.id) }
    }
    async function show(id) {
        const n = PUB.by[id], d = $('[data-detail]'); if (!n) return
        mount.querySelectorAll('[data-list] [aria-current]').forEach(x => x.removeAttribute('aria-current'))
        const btn = mount.querySelector(`[data-list] [data-id="${CSS.escape(id)}"]`); if (btn) btn.setAttribute('aria-current', 'true')
        d.innerHTML = `<h3>${esc(label(n))}</h3><p class="meta">${esc(n.type)}${n.file ? ' · ' + esc(n.file) : ''}</p><div data-rec><p class="meta">Reading...</p></div>${graph(id)}`
        d.querySelector('svg').addEventListener('click', e => { const g = e.target.closest('[data-n]'); if (g && PUB.by[g.dataset.n] && PUB.by[g.dataset.n].file) show(g.dataset.n) })
        if (!n.file) { d.querySelector('[data-rec]').innerHTML = ''; return }
        try { d.querySelector('[data-rec]').innerHTML = fields(await readJson(PUB.v, n.file)) } catch (e) { d.querySelector('[data-rec]').innerHTML = `<p class="meta">Could not read it: ${esc(e.message || e)}</p>` }
    }
    function fields(r) {
        r = { ...r }
        if (r.topics && r.topic_names) r.topics = r.topics.map(t => r.topic_names[t] || t)
        if (Array.isArray(r.aliases)) r.aliases = r.aliases.map(a => typeof a === 'string' ? a : a.name).filter((a, i, x) => a && a !== r.name && x.indexOf(a) === i)
        const rows = Object.entries(r).filter(([k, v]) => !['id', 'type', 'topic_names', 'updated_by', 'about'].includes(k) && v != null && !(Array.isArray(v) && !v.length))
        return `<dl class="crm-dl">${rows.map(([k, v]) => `<dt>${esc(k.replace(/_/g, ' '))}</dt><dd>${k === 'sources' ? v.map(s => `<a href="${esc(/^https?:/.test(s.url) ? s.url : '#')}" rel="noopener">${esc(s.url.replace(/^https?:\/\//, '').slice(0, 70))}</a> <span class="meta">read ${esc(s.read_at || '')}</span>`).join('<br>') : k === 'website' && /^https?:/.test(v) ? `<a href="${esc(v)}" rel="noopener">${esc(v)}</a>` : esc(typeof v === 'string' ? v : Array.isArray(v) && v.every(x => typeof x === 'string') ? v.join(', ') : JSON.stringify(v))}</dd>`).join('')}</dl>`
    }
    // a small force graph: the record and what it links to, one hop (colours from the site's tokens, by class)
    function graph(id) {
        const near = PUB.edges.filter(e => e.from === id || e.to === id).slice(0, 30)
        const ids = [...new Set([id, ...near.flatMap(e => [e.from, e.to])])]
        const W = 560, H = 300, P = ids.map((x, i) => ({ id: x, x: W / 2 + (i ? Math.cos(i * 2.4) * 140 : 0), y: H / 2 + (i ? Math.sin(i * 2.4) * 100 : 0), vx: 0, vy: 0 })), at = Object.fromEntries(P.map(p => [p.id, p]))
        for (let it = 0; it < 220; it++) {
            for (const a of P) for (const b of P) { if (a === b) continue; const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + 0.01; a.vx += dx * 45 / d2; a.vy += dy * 45 / d2 }
            for (const e of near) { const a = at[e.from], b = at[e.to], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, f = (d - 110) / d * 0.05; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f }
            for (const p of P) { if (p.id === id) { p.x = W / 2; p.y = H / 2; continue } p.x = Math.max(24, Math.min(W - 24, p.x + p.vx)); p.y = Math.max(16, Math.min(H - 16, p.y + p.vy)); p.vx *= 0.5; p.vy *= 0.5 }
        }
        const node = p => { const n = PUB.by[p.id] || { id: p.id, type: p.id.split(':')[0] }; return `<g data-n="${esc(p.id)}" class="t-${esc(n.type)}${p.id === id ? ' me' : ''}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.id === id ? 10 : 6.5}"/><text x="${(p.x + 9).toFixed(1)}" y="${(p.y + 4).toFixed(1)}">${esc(label(n).slice(0, 26))}</text></g>` }
        return `<svg class="crm-g" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label(PUB.by[id] || { id }))} and the ${near.length} records it is linked to">${near.map(e => { const a = at[e.from], b = at[e.to]; return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}"/><text class="verb" x="${((a.x + b.x) / 2).toFixed(1)}" y="${((a.y + b.y) / 2).toFixed(1)}">${esc(e.verb)}</text>` }).join('')}${P.map(node).join('')}</svg><p class="meta">${near.length} link${near.length === 1 ? '' : 's'}${near.length === 30 ? ' (the first 30)' : ''}. Click a node to open it.</p>`
    }

    // ---------- the private CRM: layer 1 (the vault key, sealed to you) and layer 2 (each record's audience) ----------
    async function privatePanel() {
        const box = $('[data-priv]')
        if (!KR || !KR.person) { box.innerHTML = `<p>Team only. The private CRM opens in a browser that holds your site key (the <b>Add your key</b> box at the top of every page), for a person the private CRM's key is sealed to.</p>`; return }
        let files = []
        try { const j = await (await fetch(up + 'me.json', { cache: 'no-cache' })).json(); files = ((j.people || {})[KR.person] || {}).sealed || [] } catch { }
        const f = files.filter(x => x.endsWith(CFG.private.key_file_suffix)).sort().pop()
        if (!f) { box.innerHTML = `<p>No key for the private CRM is sealed to ${esc(KR.person)} yet. Ask conductor@web-summit.dinis (<code>crm.mjs seal-keys</code>).</p>`; return }
        let env
        try { env = await (await fetch(up + f, { cache: 'no-cache' })).json() } catch { box.innerHTML = '<p>Could not fetch the sealed key.</p>'; return }
        if (env.key !== KR.fingerprint) { box.innerHTML = `<p>The private CRM's key is sealed to ${esc(KR.person)}'s key ${esc(env.key)}, but this browser holds ${esc(KR.fingerprint)}: add your current key, or ask for the key to be sealed again.</p>`; return }
        box.innerHTML = `<p>The private CRM's key is sealed to you (${esc(KR.person)}). Opening it decrypts it in this browser's memory only, reads the private vault, and opens the records sealed to you.</p><p><button type="button" class="crm-go" data-open>Open the private CRM</button></p><div data-out></div>`
        box.querySelector('[data-open]').onclick = () => openPrivate(env, box)
    }
    async function openPrivate(env, box) {
        const out = box.querySelector('[data-out]'), btn = box.querySelector('[data-open]')
        btn.disabled = true; btn.textContent = 'Opening...'
        try {
            const m = await KR.open(env), vk = (m.fields || {})['Vault key']
            if (!vk) throw new Error('the sealed message holds no vault key')
            const v = await openWithVaultKey(vk)                              // layer 1
            const nodes = (await readJson(v, 'graph/nodes.json')).nodes.filter(n => n.file)
            btn.hidden = true
            // the private vault in a new window: the key goes only into that window's address fragment (never sent to a server)
            const win = document.createElement('p'); win.className = 'crm-win'
            win.innerHTML = '<button type="button">Open the private CRM in a new window</button> <span class="meta">(SG/Vault, with full access: the key stays in the address fragment of that window)</span>'
            win.querySelector('button').onclick = () => window.open('https://dev.vault.sgraph.ai/#' + vk, '_blank', 'noopener')
            out.before(win)
            out.innerHTML = `<p class="meta">${nodes.length} record${nodes.length === 1 ? '' : 's'} in ${esc(CFG.private.name)} (${esc(CFG.private.vault_id)}). Layer 2: each sealed record opens only if you are in its audience.</p><ol class="crm-plist">${nodes.map(n => `<li data-f="${esc(n.file)}"><b>${esc(n.sealed ? '🔒 ' + n.type : label(n))}</b> <span class="meta">${esc(n.file)}</span><div class="crm-pbody meta">${n.sealed ? 'Opening...' : esc(sub(n))}</div></li>`).join('')}</ol>`
            for (const n of nodes.filter(n => n.sealed)) {
                const li = out.querySelector(`[data-f="${CSS.escape(n.file)}"]`), body = li.querySelector('.crm-pbody')
                try {
                    const e = await readJson(v, n.file), r = e.recipients.find(x => x.to === KR.person && x.key === KR.fingerprint)
                    if (!r) { body.textContent = `Sealed to ${e.audience.join(', ')}: not you.`; li.classList.add('not-you'); continue }
                    const rec = await openRecord(e, r)                         // layer 2
                    li.classList.add('opened'); li.querySelector('b').textContent = '🔓 ' + (rec.title || rec.id)
                    body.classList.remove('meta')
                    body.innerHTML = rec.type === 'vault-key' ? `<p>The public CRM's full vault key (write access to ${esc(rec.vault)}), opened in memory. <button type="button" data-copy>Copy it</button> <span class="meta" data-msg></span></p>` : fields(Object.fromEntries(Object.entries(rec).filter(([k]) => !['title', 'sources'].includes(k))))
                    const c = body.querySelector('[data-copy]'); if (c) c.onclick = async () => { try { await navigator.clipboard.writeText(rec.vault_key); body.querySelector('[data-msg]').textContent = 'Copied.' } catch { body.querySelector('[data-msg]').textContent = 'This browser did not allow copying.' } }
                    body.insertAdjacentHTML('beforeend', `<p class="meta">Sealed to ${esc(e.audience.join(', '))}${(e.agents || []).length ? ' and agents ' + esc(e.agents.join(', ')) : ''}, by ${esc(e.sealed_by)} at ${esc(e.at)}.</p>`)
                } catch (err) { body.textContent = 'Could not open it: ' + (err.message || err) }
            }
        } catch (e) { btn.disabled = false; btn.textContent = 'Try again'; out.innerHTML = `<p class="meta">Could not open the private CRM: ${esc(e.message || e)}</p>` }
    }
    async function openRecord(env, r) {
        const { cek } = await KR.open(r.env)                                     // ws-ecies-1 to your site key
        const key = await crypto.subtle.importKey('raw', b64d(cek), { name: 'AES-GCM' }, false, ['decrypt'])
        return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(env.iv) }, key, b64d(env.ct))))
    }

    async function start() {
        KR = window.WSKeyring || null
        try { CFG = await (await fetch(up + 'data/crm.json', { cache: 'no-cache' })).json() } catch { mount.innerHTML = '<p class="meta">Could not load data/crm.json.</p>'; return }
        layout()
        if (KR) { try { await KR.ready } catch { } }
        privatePanel()
        try {
            const v = await openWithReadKey(CFG.public.read_key, CFG.public.vault_id)
            const [nodes, edges] = await Promise.all([readJson(v, 'graph/nodes.json'), readJson(v, 'graph/edges.json')])
            PUB = { v, nodes: nodes.nodes, edges: edges.edges, by: Object.fromEntries(nodes.nodes.map(n => [n.id, n])) }
            const c = t => PUB.nodes.filter(n => n.type === t && n.file).length
            $('[data-pubnote]').innerHTML = `${c('company')} companies and organisations, ${c('contact')} contacts, ${c('schedule')} schedule items; ${PUB.nodes.length} nodes and ${PUB.edges.length} links in the graph. Read live from <a href="${esc(CFG.public.vault_url)}" rel="noopener">${esc(CFG.public.name)}</a> (${esc(CFG.public.vault_id)}) with its published read key.`
            tabs(); list()
        } catch (e) { $('[data-pubnote]').textContent = 'Could not open the public CRM: ' + (e.message || e) }
    }
    if (document.readyState === 'complete') start(); else addEventListener('DOMContentLoaded', start)   // after assets/keyring.js
})()
