// The team's sticker vote (WS-159; conductor@web-summit.dinis, 5 November 2026, at Dinis's word). The page and the
// vault "dance": this page holds the vault's published read key (data/stickers-vote.json) and uses it to render the
// vault in a frame, to list the vote lanes (who has a vote waiting: a lane with a pending file, no vote opened) and to
// read results.json from the vault (the count, written by the drain). A team person whose browser holds their site
// key (assets/keyring.js) picks ONE sticker: the page opens their sealed lane token, signs the vote with their key,
// seals {vote, signed, sig, key} to the vault's drain key (sgit hybrid v2, as assets/feedback.js does) and writes it to
// their lane. Changing a vote is allowed: the newest counts. Everything from the network reaches the page as text.
(() => {
    'use strict'
    const mount = document.getElementById('sticker-vote')
    if (!mount) return
    const up = document.body.dataset.up || ''
    let KR = null                                   // assets/keyring.js loads after this script: read it at DOMContentLoaded
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const LS = { get(k, d) { try { const v = localStorage.getItem('sv.' + k); return v === null ? d : JSON.parse(v) } catch { return d } }, set(k, v) { try { localStorage.setItem('sv.' + k, JSON.stringify(v)) } catch { } } }
    const te = new TextEncoder()
    const hex = buf => Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
    const sha256 = async bytes => hex(await crypto.subtle.digest('SHA-256', typeof bytes === 'string' ? te.encode(bytes) : bytes))
    const first = n => String(n || '').split(' ')[0]
    let CFG = null, ME = null, PICK = null, PENDING = {}, RESULTS = null, VOTED_AT = {}

    // ---------- sealing, as sgit pki encrypt does (byte-compatible with PKI__Crypto.hybrid_decrypt; from assets/feedback.js) ----------
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

    // ---------- the lanes, listed with the enum key the vault host derives from the read key ----------
    const readHex = () => CFG.read_key.replace(/^sgit_public_read_/, '')
    async function enumKey() {
        const raw = Uint8Array.from(readHex().match(/../g), h => parseInt(h, 16)), pre = te.encode('sg-inbox-enum:')
        const buf = new Uint8Array(pre.length + raw.length); buf.set(pre); buf.set(raw, pre.length)
        return sha256(buf)
    }
    async function listLanes() {
        const key = await enumKey(), byLane = {}
        for (const l of CFG.lanes) byLane[l.lane] = l.person
        const pending = {}
        let after = null
        for (let n = 0; n < 20; n++) {
            const r = await fetch(`${CFG.endpoint}/api/vault/append/list/${CFG.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': key }, body: JSON.stringify({ include_content: false, limit: 200, ...(after ? { after_file_id: after } : {}) }) })
            if (!r.ok) throw new Error(`the lanes answered ${r.status}`)
            const j = await r.json(), got = j.entries || []
            for (const e of got) {
                const p = byLane[await sha256(e.inbox)]
                if (!p) continue
                pending[p] = (pending[p] || 0) + 1
                const ms = parseInt(String(e.file_id).slice(0, 13), 10)
                if (ms && (!VOTED_AT[p] || ms > VOTED_AT[p])) VOTED_AT[p] = ms
            }
            if (!j.truncated || !got.length) break
            after = got[got.length - 1].file_id
        }
        return pending
    }

    // ---------- results.json, read from the vault with the read key (the vault UI's own library, pinned on this site) ----------
    const LIB = 'assets/vendor/sg-vault/2026-11-04/'
    const LIB_FILES = ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js', 'sg-vault/sg-vault-ref-manager.js', 'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js', 'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js', 'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js']
    const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('could not load ' + src)); document.head.appendChild(s) })
    async function readResults() {
        if (!window.SGVault) for (const f of LIB_FILES) await loadScript(up + LIB + f)
        const c = await SGVaultCrypto.deriveReadOnlyCreds(CFG.vault_id, readHex())
        const ro = await SGVault.openReadOnly(new SGSend({ endpoint: CFG.endpoint }), c.vaultId, c.readKeyB64, c.refFileId)
        return JSON.parse(new TextDecoder().decode(await ro.getFile('/', 'results.json')))
    }

    // ---------- drawing ----------
    const sticker = id => CFG.stickers.find(s => s.id === id)
    const voted = () => {
        const v = new Set(Object.keys(PENDING))
        for (const x of (RESULTS && RESULTS.voters) || []) v.add(x.person)
        return v
    }
    function layout() {
        mount.innerHTML = `
<div class="sv-top">
  <div class="sv-clock" aria-live="off"><span class="sv-l">Voting closes in</span><b data-cd>--</b><span class="sv-l">Thursday 5 November, 18:00 UTC</span></div>
  <div class="sv-team"><span class="sv-l">The team <b data-count></b></span><ul class="sv-people" data-people></ul></div>
</div>
<div class="sv-me" data-me role="status" aria-live="polite"></div>
<ol class="sv-grid" data-grid></ol>
<div class="sv-bar" data-bar hidden><span data-pickname></span><button type="button" class="sv-go" data-vote>Vote</button></div>
<h2 id="the-count">The count</h2>
<p class="meta" data-rnote>Reading the count from the vault...</p>
<ol class="sv-bars" data-bars></ol>
<h2 id="the-vault">The vault, full size</h2>
<p>The same twelve, at full resolution, rendered from the encrypted vault by SG/Vault with this page's read key: a full-screen gallery (arrow keys, swipe, a lightbox) and the count. <a data-vaultlink target="_blank" rel="noopener">Open it in a new tab</a>.</p>
<div class="sv-vault" data-vault><button type="button" class="sv-open" data-openvault>Open the vault here</button></div>`
        const grid = mount.querySelector('[data-grid]')
        grid.innerHTML = CFG.stickers.map((s, i) => `<li class="sv-card" style="--i:${i}" data-id="${s.id}"><button type="button" aria-pressed="false" aria-label="${esc(s.id + '. ' + s.name)}">
<span class="sv-num">${s.id}</span><span class="sv-n" data-n></span><img src="${esc(up + s.thumb)}" alt="" width="480" height="480" loading="lazy">
<b>${esc(s.name)}</b><span class="sv-words">${esc(s.words)}</span><span class="sv-joke">${esc(s.joke)}</span><span class="sv-tick" aria-hidden="true">✓</span></button></li>`).join('')
        grid.addEventListener('click', e => { const li = e.target.closest('.sv-card'); if (li) pick(+li.dataset.id) })
        mount.querySelector('[data-vote]').onclick = vote
        mount.querySelector('[data-vaultlink]').href = CFG.vault_url
        mount.querySelector('[data-openvault]').onclick = openVault
        requestAnimationFrame(() => mount.classList.add('sv-in'))
    }
    function people() {
        const v = voted(), ul = mount.querySelector('[data-people]')
        ul.innerHTML = CFG.lanes.map(l => `<li class="${v.has(l.person) ? 'yes' : ''}${ME && ME.person === l.person ? ' me' : ''}" title="${esc(l.name)}${v.has(l.person) ? ': has voted' : ': not yet'}"><span>${esc(first(l.name).slice(0, 1))}</span>${esc(first(l.name))}</li>`).join('')
        mount.querySelector('[data-count]').textContent = `${v.size} of ${CFG.lanes.length} voted`
    }
    function me() {
        const box = mount.querySelector('[data-me]'), mine = LS.get('mine', null)
        if (!ME) { box.className = 'sv-me sv-nokey'; box.innerHTML = `<b>Add your key to vote (team only).</b> Your browser needs the site key your conductor gave you: use the <b>Add your key</b> box at the top of this page, then pick your favourite. Anyone can look; only the team votes.`; return }
        if (!ME.lane) { box.className = 'sv-me sv-nokey'; box.innerHTML = `<b>${esc(first(ME.name || ME.person))}, you have no lane yet.</b> Lanes are issued to the team's site keys; ask conductor@web-summit.dinis to re-issue them (<code>stickers_vote.py lanes</code>).`; return }
        const shut = Date.now() >= Date.parse(CFG.closes_at)
        box.className = 'sv-me'
        box.innerHTML = shut ? `<b>Voting has closed.</b> ${mine && mine.person === ME.person ? `Your last vote: <b>${esc(sticker(mine.choice).name)}</b>.` : ''}`
            : mine && mine.person === ME.person ? `<b>Hello ${esc(first(ME.name))}: you voted for ${esc(sticker(mine.choice).id + '. ' + sticker(mine.choice).name)}.</b> Changed your mind? Pick another and vote again: your newest vote counts.`
                : `<b>Hello ${esc(first(ME.name))}: pick your one favourite</b> and press Vote. Your vote is signed by your key and sealed before it leaves this browser.`
        if (mine && mine.person === ME.person) mark(mine.choice, 'mine')
    }
    function mark(id, cls) { mount.querySelectorAll('.sv-card').forEach(li => li.classList.toggle(cls, +li.dataset.id === id)) }
    function pick(id) {
        if (!ME || !ME.lane || Date.now() >= Date.parse(CFG.closes_at)) {
            const card = mount.querySelector(`.sv-card[data-id="${id}"]`); card.classList.remove('nope'); void card.offsetWidth; card.classList.add('nope')
            if (!ME) mount.querySelector('[data-me]').classList.add('sv-flash')
            return
        }
        PICK = id
        mount.classList.add('sv-picking'); mark(id, 'picked')
        mount.querySelectorAll('.sv-card button').forEach(b => b.setAttribute('aria-pressed', String(+b.closest('.sv-card').dataset.id === id)))
        const bar = mount.querySelector('[data-bar]'); bar.hidden = false
        mount.querySelector('[data-pickname]').innerHTML = `Your pick: <b>${esc(id + '. ' + sticker(id).name)}</b>`
        const b = mount.querySelector('[data-vote]'); b.disabled = false; b.textContent = 'Vote'
    }
    function results() {
        const note = mount.querySelector('[data-rnote]'), ol = mount.querySelector('[data-bars]')
        if (!RESULTS) return
        const n = RESULTS.voters_count || 0, counts = RESULTS.counts || {}, max = Math.max(1, ...Object.values(counts))
        note.textContent = n ? `${n} vote${n === 1 ? '' : 's'} counted (drained ${String(RESULTS.as_of || '').replace('T', ' ').slice(0, 16)} UTC${RESULTS.changed_votes ? `, ${RESULTS.changed_votes} changed` : ''}). Votes waiting in a lane are counted at the next drain.`
            : 'No votes counted yet: votes wait, sealed, in the lanes until Angelo, Jose or Indi drain them.'
        const order = CFG.stickers.slice().sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0) || a.id - b.id)
        ol.innerHTML = order.map(s => `<li><img src="${esc(up + s.thumb)}" alt="" width="40" height="40" loading="lazy"><span class="sv-t"><i style="--w:${(100 * (counts[s.id] || 0) / max).toFixed(1)}%"></i><span>${esc(s.id + '. ' + s.name)}</span></span><b>${counts[s.id] || 0}</b></li>`).join('')
        requestAnimationFrame(() => setTimeout(() => ol.classList.add('go'), 60))
        for (const s of CFG.stickers) {
            const li = mount.querySelector(`.sv-card[data-id="${s.id}"]`), v = counts[s.id] || 0
            li.querySelector('[data-n]').textContent = v ? `${v} vote${v === 1 ? '' : 's'}` : ''
            li.classList.toggle('lead', !!(RESULTS.leader && RESULTS.leader.id === s.id && v))
        }
    }
    function tick() {
        const ms = Date.parse(CFG.closes_at) - Date.now(), el = mount.querySelector('[data-cd]')
        if (ms <= 0) { el.textContent = 'closed'; mount.classList.add('sv-closed'); return }
        const h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60
        el.textContent = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    function openVault() {
        const box = mount.querySelector('[data-vault]')
        box.innerHTML = `<iframe title="The ws-stickers-vote vault, rendered read-only by SG/Vault" src="${esc(CFG.vault_url)}" allow="fullscreen" allowfullscreen loading="lazy"></iframe>`
    }

    // ---------- confetti, in the site's own colours ----------
    function confetti() {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const cs = getComputedStyle(document.documentElement), cols = ['--st-green', '--st-gold', '--st-blue', '--st-terra', '--accent'].map(v => cs.getPropertyValue(v).trim()).filter(Boolean)
        const cv = document.createElement('canvas'); cv.className = 'sv-confetti'; document.body.appendChild(cv)
        const W = cv.width = innerWidth, H = cv.height = innerHeight, x = cv.getContext('2d')
        const bits = Array.from({ length: 160 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.75, vx: (Math.random() - 0.5) * 16, vy: -10 - Math.random() * 12, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, s: 6 + Math.random() * 8, c: cols[Math.floor(Math.random() * cols.length)] }))
        let t = 0
        const step = () => {
            x.clearRect(0, 0, W, H)
            for (const b of bits) { b.vy += 0.35; b.x += b.vx; b.y += b.vy; b.r += b.vr; x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.c; x.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); x.restore() }
            if (++t < 150) requestAnimationFrame(step); else cv.remove()
        }
        step()
    }

    // ---------- voting ----------
    async function vote() {
        const btn = mount.querySelector('[data-vote]'), id = PICK
        if (!id || !ME || !ME.lane) return
        btn.disabled = true; btn.textContent = 'Sealing...'
        try {
            const lane = await KR.open(ME.lane.sealed_token)
            if (!lane || lane.person !== ME.person || !/^[0-9a-f]{16,128}$/.test(lane.append_token || '')) throw new Error('the lane token did not open for you')
            const v = { type: 'web-summit.sticker-vote/v1', person: ME.person, choice: id, at: new Date().toISOString() }
            const signed = JSON.stringify(v)
            const sig = await KR.sign(signed)
            const enc = await seal(CFG.drain_public_key, JSON.stringify({ vote: v, signed, sig, key: KR.fingerprint }))
            btn.textContent = 'Sending...'
            // a 404 is retried: for a few minutes after the lanes are re-issued, some server instances still hold the old
            // anchor list (measured on 5 November); a 404 stored nothing, so retrying cannot write a vote twice
            let r
            for (const wait of [0, 1500, 3000, 6000, 10000]) {
                if (wait) { btn.textContent = 'Retrying...'; await new Promise(ok => setTimeout(ok, wait)) }
                r = await fetch(`${CFG.endpoint}/api/vault/append/write/${CFG.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: lane.append_token, payload: btoa(enc) }) })
                if (r.status !== 404) break
            }
            if (!r.ok) throw new Error(r.status === 404 ? 'the lane refused the token (404): ask for the lanes to be re-issued' : r.status === 507 ? 'your lane is full (507): it needs a drain' : `the lane said ${r.status}`)
            LS.set('mine', { person: ME.person, choice: id, at: v.at })
            btn.textContent = 'Voted!'; mount.classList.remove('sv-picking'); mark(-1, 'picked'); confetti()
            PENDING[ME.person] = (PENDING[ME.person] || 0) + 1
            me(); people()
            setTimeout(() => { mount.querySelector('[data-bar]').hidden = true }, 1400)
            refresh()
        } catch (e) {
            btn.disabled = false; btn.textContent = 'Try again'
            const box = mount.querySelector('[data-me]'); box.className = 'sv-me sv-bad'; box.textContent = 'The vote did not go: ' + (e.message || e)
        }
    }

    async function refresh() {
        try { PENDING = await listLanes() } catch (e) { console.warn('stickers: the lanes could not be listed', e) }
        people()
    }

    async function start() {
        KR = window.WSKeyring || null
        try { CFG = await (await fetch(up + 'data/stickers-vote.json', { cache: 'no-cache' })).json() }
        catch (e) { mount.innerHTML = '<p class="meta">The vote could not load data/stickers-vote.json.</p>'; return }
        layout(); tick(); setInterval(tick, 1000)
        if (KR) { try { await KR.ready } catch { } }
        if (KR && KR.person) { const l = CFG.lanes.find(x => x.person === KR.person); ME = { person: KR.person, name: l ? l.name : KR.person, lane: l || null } }
        me(); people()
        refresh(); setInterval(refresh, 30000)
        readResults().then(r => { RESULTS = r; results(); people() }).catch(e => { mount.querySelector('[data-rnote]').textContent = 'The count is inside the vault (below): this browser could not read it directly (' + (e.message || e) + ').' })
        const v = mount.querySelector('[data-vault]')
        if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { io.disconnect(); if (!v.querySelector('iframe')) openVault() } }, { rootMargin: '200px' }); io.observe(v) }
    }
    if (document.readyState === 'complete') start(); else addEventListener('DOMContentLoaded', start)   // deferred scripts run while 'interactive'
})()
