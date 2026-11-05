// The team's sticker vote (WS-167; conductor@web-summit.dinis, 5 November 2026, at Dinis's word). The page and the
// vault "dance": this page holds the vault's published read key (data/stickers-vote.json) and uses it to render the
// vault in a frame, to list the vote lanes (who has a ballot waiting: a lane with a pending file, no ballot opened) and
// to read results.json from the vault (the leaderboard, written by the drain).
// Round 2 (Dinis: "pick the top 6 ... I can reorder them ... on the right hand side, you show me the top 6, and that's
// what I click submit"): a team person whose browser holds their site key (assets/keyring.js) ranks up to ten (round 4: "can you allow 10 votes?"; CFG.max_ranking) of the
// stickers in the panel on the right (a bottom sheet on a phone), reorders them by drag (pointer events) or by the up and
// down buttons, marks any "not for me", and submits. The browser opens their sealed lane token, signs
// {type: v2, person, ranking, not_for_me, at} with their key, seals {vote, signed, sig, key} to the vault's drain key
// (sgit hybrid v2, as assets/feedback.js does) and writes it to their lane. The newest ballot counts (Borda points).
// A person who holds the vault key sealed to them (data/sealed/<id>/*-stickers-vault-key.json) can open the vault with
// full access here: the key is opened in memory on a press, never written to the page source or stored.
// Everything from the network reaches the page as text.
(() => {
    'use strict'
    const mount = document.getElementById('sticker-vote')
    if (!mount) return
    const up = document.body.dataset.up || ''
    let KR = null                                   // assets/keyring.js loads after this script: read it at DOMContentLoaded
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const LS = {
        get(k, d) { try { const v = localStorage.getItem('sv.' + k); return v === null ? d : JSON.parse(v) } catch { return d } },
        set(k, v) { try { localStorage.setItem('sv.' + k, JSON.stringify(v)) } catch { } }
    }
    const te = new TextEncoder()
    const hex = buf => Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
    const sha256 = async bytes => hex(await crypto.subtle.digest('SHA-256', typeof bytes === 'string' ? te.encode(bytes) : bytes))
    const first = n => String(n || '').split(' ')[0]
    const $ = sel => mount.querySelector(sel)
    let MAX = 10                                    // CFG.max_ranking (data/stickers-vote.json), read at start
    let CFG = null, ME = null, PENDING = {}, RESULTS = null
    // round 5 (Dinis: "allow the drag to occur in empty spaces ... I could leave a couple gaps"): RANK is MAX fixed slots,
    // each an id or null; a tap fills the first empty one; full means no empty slot
    let RANK = [], NFM = []                         // the ballot being built: the slots, and "not for me"
    const filled = () => RANK.filter(x => x != null)
    const firstEmpty = () => RANK.indexOf(null)
    let VPICK = {}, FACE = {}                       // round 3: the favourite variant per sticker (a heart), the variant showing

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
        const key = await enumKey(), byLane = {}, pending = {}
        for (const l of CFG.lanes) byLane[l.lane] = l.person
        let after = null
        for (let n = 0; n < 20; n++) {
            const r = await fetch(`${CFG.endpoint}/api/vault/append/list/${CFG.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': key }, body: JSON.stringify({ include_content: false, limit: 200, ...(after ? { after_file_id: after } : {}) }) })
            if (!r.ok) throw new Error(`the lanes answered ${r.status}`)
            const j = await r.json(), got = j.entries || []
            for (const e of got) { const p = byLane[await sha256(e.inbox)]; if (p) pending[p] = (pending[p] || 0) + 1 }
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
    const canVote = () => !!(ME && ME.lane) && Date.now() < Date.parse(CFG.closes_at)
    const voted = () => { const v = new Set(Object.keys(PENDING)); for (const x of (RESULTS && RESULTS.voters) || []) v.add(x.person); return v }
    function layout() {
        mount.innerHTML = `
<div class="sv-band">
  <div class="sv-intro" data-intro></div>
  <div class="sv-side">
    <div class="sv-clock"><span class="sv-l">Closes in</span><b data-cd>--</b><span class="sv-l">${esc(new Date(CFG.closes_at).toISOString().slice(11, 16))} UTC today</span></div>
    <div class="sv-team"><span class="sv-l">The team <b data-count></b></span><ul class="sv-people" data-people></ul></div>
    <div class="sv-chip" data-me role="status" aria-live="polite"></div>
  </div>
</div>
<p class="sv-msg" data-msg role="status" aria-live="polite" hidden></p>
<div class="sv-main">
  <ol class="sv-grid" data-grid></ol>
  <aside class="sv-panel" data-panel aria-label="My top ${MAX}">
    <button type="button" class="sv-ph" data-sheet aria-expanded="false"><b>My top ${MAX}</b><span data-filled>0 of ${MAX}</span><span class="sv-chev" aria-hidden="true"></span></button>
    <div class="sv-pbody">
      <p class="sv-hint">Tap a sticker to put it in the first empty slot, or drag it onto a slot. Drag a row (or its ⋮⋮ handle on a phone) onto an empty slot to move it, onto another to swap; gaps are fine. Slot 1 gets ${MAX} points, slot ${MAX} gets 1, an empty slot nothing. Keyboard: focus a slot, Space to pick up, arrows to move, Space to drop.</p>
      <p class="sr" aria-live="assertive" data-live></p>
      <ol class="sv-slots" data-slots></ol>
      <div class="sv-nfm"><b>Not for me</b><ul data-nfm></ul></div>
    </div>
    <button type="button" class="sv-go" data-submit disabled>Submit my top ${MAX}</button>
    <p class="sv-last" data-last></p>
  </aside>
</div>
<h2 id="the-leaderboard">The leaderboard</h2>
<p class="meta" data-rnote>Reading the count from the vault...</p>
<ol class="sv-bars" data-bars></ol>
<section class="sv-full" data-full hidden aria-label="The vault, full access"></section>
<h2 id="the-vault">The vault, full size</h2>
<p>The same stickers, at full resolution, rendered from the encrypted vault by SG/Vault with this page's read key: a full-screen gallery (arrow keys, swipe, a lightbox) and the leaderboard. <a data-vaultlink target="_blank" rel="noopener">Open it in a new tab</a>.</p>
<div class="sv-vault" data-vault><button type="button" class="sv-open" data-openvault>Open the vault here</button></div>`
        // round 5 (Dinis: "somebody arriving for the first time needs to be told what to do"): the page title and the
        // four steps from the markdown ("How to vote") move into the band's left column; the twin keeps them as text
        const intro = $('[data-intro]'), h1 = document.querySelector('main > h1'), hv = document.getElementById('how-to-vote')
        if (h1) intro.appendChild(h1)
        if (hv) { const ol = hv.nextElementSibling; hv.remove(); if (ol && ol.tagName === 'OL') { ol.classList.add('sv-steps'); intro.appendChild(ol) } }
        intro.appendChild($('[data-me]'))                             // you, under the steps (the band's left column)
        let grp = null
        $('[data-grid]').innerHTML = CFG.stickers.map((s, i) => `${s.group_title && s.group !== grp && (grp = s.group) ? `<li class="sv-group"><h3>${esc(s.group_title)}</h3></li>` : ''}<li class="sv-card" style="--i:${i}" data-id="${s.id}"><div class="sv-cin">
<button type="button" class="sv-face" data-add aria-label="${esc(s.id + '. ' + s.name)}: add to my top ${MAX}"><span class="sv-img"><img src="${esc(up + s.thumb)}" alt="" width="480" height="480" loading="lazy"><span class="sv-num">${s.id}</span><span class="sv-rank" data-rank></span><span class="sv-pts" data-n></span></span>
<b>${esc(s.name)}</b><span class="sv-words">${esc(s.words)}</span><span class="sv-joke">${esc(s.joke)}</span></button>
${s.variants && s.variants.length > 1 ? `<span class="sv-vars" role="group" aria-label="Variants of ${esc(s.name)}"><button type="button" class="sv-vstep" data-vstep="-1" aria-label="Previous variant">‹</button>${s.variants.map((v, k) => `<button type="button" class="sv-dot" data-v="${k}" aria-label="Variant ${v.v}"${k ? '' : ' aria-current="true"'}></button>`).join('')}<button type="button" class="sv-vstep" data-vstep="1" aria-label="Next variant">›</button><button type="button" class="sv-heart" data-heart aria-pressed="false" title="This one: my favourite variant"><span aria-hidden="true">♡</span> this one</button></span>` : ''}
<span class="sv-acts"><button type="button" class="sv-add" data-add>Add to my top ${MAX}</button><button type="button" class="sv-no" data-no aria-pressed="false" title="Not for me"><span aria-hidden="true">👎</span><span class="sr">Not for me</span></button></span></div></li>`).join('')
        $('[data-grid]').addEventListener('click', e => {
            const li = e.target.closest('.sv-card'); if (!li || NOCLICK) return
            const id = +li.dataset.id
            const dot = e.target.closest('[data-v]'), stp = e.target.closest('[data-vstep]')
            if (dot || stp) { const n = sticker(id).variants.length; flip(id, dot ? +dot.dataset.v : ((FACE[id] || 0) + +stp.dataset.vstep + n) % n); return }
            if (e.target.closest('[data-heart]')) return heart(id)
            if (e.target.closest('[data-no]')) toggleNfm(id); else if (e.target.closest('[data-add]')) toggleRank(id)
        })
        $('[data-slots]').addEventListener('click', e => {
            const b = e.target.closest('button[data-act]'); if (!b) return
            const id = +b.closest('[data-sid]').dataset.sid, i = RANK.indexOf(id), act = b.dataset.act
            if (act === 'up' && i > 0) swap(i, i - 1)                       // with the neighbour, empty or not
            else if (act === 'down' && i < MAX - 1) swap(i, i + 1)
            else if (act === 'rm') RANK[i] = null
            else return
            draw(); const again = $(`[data-sid="${id}"] [data-act="${act}"]`); if (again && !again.disabled) again.focus()
        })
        $('[data-nfm]').addEventListener('click', e => { const b = e.target.closest('[data-unno]'); if (b) toggleNfm(+b.dataset.unno) })
        $('[data-sheet]').onclick = () => { const open = !mount.classList.contains('sv-sheet-open'); mount.classList.toggle('sv-sheet-open', open); $('[data-sheet]').setAttribute('aria-expanded', String(open)) }
        $('[data-submit]').onclick = submit
        $('[data-vaultlink]').href = CFG.vault_url
        $('[data-openvault]').onclick = openVault
        dragging(); keyboard()
        requestAnimationFrame(() => mount.classList.add('sv-in'))
    }
    function toggleRank(id) {
        if (!canVote()) return refuse(id)
        const i = RANK.indexOf(id)
        if (i >= 0) RANK[i] = null
        else if (firstEmpty() < 0) { refuse(id); say(`Your top ${MAX} is full: remove one in the panel first, or drag this sticker onto a slot to replace it.`, 'warn'); return }
        else { RANK[firstEmpty()] = id; NFM = NFM.filter(x => x !== id); bump() }
        draw()
    }
    function swap(a, b) { [RANK[a], RANK[b]] = [RANK[b], RANK[a]] }
    function place(id, k) {                                          // a sticker onto slot k: moves within the panel, or replaces
        const from = RANK.indexOf(id)
        if (from === k) return
        if (from >= 0) swap(from, k); else { RANK[k] = id; NFM = NFM.filter(x => x !== id); bump() }
    }
    // variants (round 3): the dots and arrows flip the face; the heart marks the one showing as the favourite
    function flip(id, k) {
        FACE[id] = k
        const li = $(`.sv-card[data-id="${id}"]`), v = sticker(id).variants[k]
        li.querySelector('.sv-img img').src = up + v.thumb
        li.querySelectorAll('[data-v]').forEach((d, j) => d.toggleAttribute('aria-current', j === k))
        draw()
    }
    function heart(id) {
        if (!canVote()) return refuse(id)
        const v = sticker(id).variants[FACE[id] || 0].v
        if (VPICK[id] === v) delete VPICK[id]; else VPICK[id] = v
        draw()
    }
    function toggleNfm(id) {
        if (!canVote()) return refuse(id)
        if (NFM.includes(id)) NFM = NFM.filter(x => x !== id); else { NFM.push(id); RANK = RANK.map(x => x === id ? null : x) }
        draw()
    }
    function refuse(id) {
        const li = $(`.sv-card[data-id="${id}"]`); li.classList.remove('nope'); void li.offsetWidth; li.classList.add('nope')
        if (!ME) { const m = $('[data-me]'); m.classList.remove('sv-flash'); void m.offsetWidth; m.classList.add('sv-flash'); say('The vote is for the team: add your key first (the Add your key box at the top of the page).', 'warn') }
    }
    function bump() { const p = $('[data-filled]'); p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump') }
    function say(t, kind) { const m = $('[data-msg]'); m.className = 'sv-msg' + (kind === 'bad' ? ' sv-bad' : kind === 'warn' ? ' sv-warn' : ''); m.textContent = t; m.hidden = !t; clearTimeout(say.t); if (kind !== 'bad') say.t = setTimeout(() => { m.hidden = true }, 6000) }
    function draw() {                                            // the cards and the panel, from RANK and NFM
        for (const li of mount.querySelectorAll('.sv-card')) {
            const id = +li.dataset.id, r = RANK.indexOf(id), no = NFM.includes(id)
            const hb = li.querySelector('[data-heart]')
            if (hb) { const s = sticker(id), showing = s.variants[FACE[id] || 0].v, on = VPICK[id] === showing; hb.setAttribute('aria-pressed', String(on)); hb.innerHTML = `<span aria-hidden="true">${on ? '♥' : '♡'}</span> ${VPICK[id] && !on ? `v${VPICK[id]} is my favourite` : on ? 'my favourite' : 'this one'}` }
            li.classList.toggle('ranked', r >= 0); li.classList.toggle('nfm', no)
            li.querySelector('[data-rank]').textContent = r >= 0 ? '#' + (r + 1) : ''
            li.querySelector('.sv-add').textContent = r >= 0 ? `#${r + 1} in my top ${MAX} · remove` : firstEmpty() < 0 ? `Top ${MAX} is full` : `Add to my top ${MAX}`
            li.querySelector('[data-no]').setAttribute('aria-pressed', String(no))
            li.querySelector('.sv-face').setAttribute('aria-label', `${id}. ${sticker(id).name}: ${r >= 0 ? `number ${r + 1} in my top ${MAX}, press to remove` : `add to my top ${MAX}`}`)
        }
        const slots = []
        for (let k = 0; k < MAX; k++) {
            const id = RANK[k]
            if (!id) { slots.push(`<li class="sv-slot empty" data-k="${k}" tabindex="0" aria-label="Slot ${k + 1}, empty"><span class="sv-pos">${k + 1}</span><span class="sv-sname">${k === firstEmpty() ? 'Empty: the next tap goes here' : 'Empty'}</span></li>`); continue }
            const s = sticker(id)
            slots.push(`<li class="sv-slot" data-sid="${id}" data-k="${k}" tabindex="0" aria-label="Slot ${k + 1}: ${esc(s.name)}, ${MAX - k} points"><span class="sv-handle" data-drag title="Drag to move or swap" aria-hidden="true">⋮⋮</span><span class="sv-pos">${k + 1}</span><img src="${esc(up + s.thumb)}" alt="" width="40" height="40"><span class="sv-sname"><span class="sv-sn">${esc(s.name)}</span><small>${MAX - k} pt${k === MAX - 1 ? '' : 's'}</small></span>
<span class="sv-sb"><button type="button" data-act="up" aria-label="Move ${esc(s.name)} up"${k === 0 ? ' disabled' : ''}>▲</button><button type="button" data-act="down" aria-label="Move ${esc(s.name)} down"${k === MAX - 1 ? ' disabled' : ''}>▼</button><button type="button" data-act="rm" aria-label="Remove ${esc(s.name)}">✕</button></span></li>`)
        }
        $('[data-slots]').innerHTML = slots.join('')
        $('[data-nfm]').innerHTML = NFM.length ? NFM.map(id => `<li><button type="button" data-unno="${id}" title="Undo: not for me">${esc(id + '. ' + sticker(id).name)} <span aria-hidden="true">✕</span></button></li>`).join('') : '<li class="sv-none">None yet: press 👎 on a sticker you would not put on your laptop.</li>'
        const n = filled().length
        $('[data-filled]').textContent = `${n} of ${MAX}`
        const b = $('[data-submit]'); b.disabled = !n || !canVote(); b.textContent = n ? `Submit my top ${MAX} (${n} picked)` : `Submit my top ${MAX}`
        mount.classList.toggle('sv-has', n > 0)
    }
    // ---------- drag and drop (round 5): a floating copy follows the pointer, the row it left is a dashed placeholder, the
    // slot under the pointer lights up ("drop here" when empty, "swap" when filled). An empty slot takes it (a move), a
    // filled one swaps. Mouse: drag the row or a sticker card; touch: the row's handle (a card is tap-to-add on touch).
    // Escape, or dropping outside the slots, puts it back. The list scrolls itself near its top and bottom edges.
    const live = t => { const l = $('[data-live]'); if (l) { l.textContent = ''; setTimeout(() => { l.textContent = t }, 30) } }
    let DRAG = null, NOCLICK = false
    function dragging() {
        const list = $('[data-slots]'), grid = $('[data-grid]'), body = $('.sv-pbody')
        const begin = (e, kind, id, from, srcEl) => {
            if (!canVote() || (e.pointerType === 'mouse' && e.button !== 0)) return
            DRAG = { kind, id, from, srcEl, touch: e.pointerType !== 'mouse', x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, pid: e.pointerId, on: false, ghost: null, target: null, raf: 0 }
        }
        list.addEventListener('pointerdown', e => {
            const row = e.target.closest('.sv-slot[data-sid]'); if (!row || e.target.closest('button')) return
            if (e.pointerType !== 'mouse' && !e.target.closest('[data-drag]')) return     // touch: the handle only, so the list still scrolls
            begin(e, 'slot', +row.dataset.sid, +row.dataset.k, row); if (DRAG && e.pointerType === 'mouse') e.preventDefault()
        })
        grid.addEventListener('pointerdown', e => {
            const face = e.target.closest('.sv-face'); if (!face || e.pointerType !== 'mouse') return
            const li = face.closest('.sv-card'); begin(e, 'card', +li.dataset.id, RANK.indexOf(+li.dataset.id), li.querySelector('.sv-img') || li)
        })
        grid.addEventListener('dragstart', e => e.preventDefault())
        addEventListener('pointermove', e => {
            if (!DRAG || e.pointerId !== DRAG.pid) return
            DRAG.x = e.clientX; DRAG.y = e.clientY
            if (!DRAG.on) {
                if (Math.hypot(DRAG.x - DRAG.x0, DRAG.y - DRAG.y0) < 6) return            // a tap stays a tap
                start()
            }
            e.preventDefault(); follow(); hover(); edges()
        }, { passive: false })
        addEventListener('pointerup', e => { if (DRAG && e.pointerId === DRAG.pid) finish(true) })
        addEventListener('pointercancel', e => { if (DRAG && e.pointerId === DRAG.pid) finish(false) })
        addEventListener('keydown', e => { if (DRAG && DRAG.on && e.key === 'Escape') { e.preventDefault(); finish(false) } })
        function start() {
            const d = DRAG, r = d.srcEl.getBoundingClientRect(), s = sticker(d.id)
            d.on = true; d.rect = r
            const g = document.createElement('div')
            g.className = d.kind === 'card' ? 'sv-ghost card' : 'sv-slot sv-ghost'
            if (d.kind === 'slot') { g.innerHTML = d.srcEl.innerHTML; g.style.width = r.width + 'px' }
            else g.innerHTML = `<img src="${esc(up + s.thumb)}" alt="" width="44" height="44"><b>${esc(s.name)}</b>`
            document.body.appendChild(g); d.ghost = g
            d.dx = d.kind === 'slot' ? d.x0 - r.left : 30; d.dy = d.kind === 'slot' ? d.y0 - r.top : 26
            if (d.touch) d.dy = r.height + 14                         // on touch the row floats above the finger, so the slot below stays visible
            if (d.kind === 'slot') d.srcEl.classList.add('placeholder')
            mount.classList.add('sv-dragging')
            if (matchMedia('(max-width: 56rem)').matches && !mount.classList.contains('sv-sheet-open')) $('[data-sheet]').click()
            live(`Picked up ${s.name}. Drop it on a slot.`)
        }
        function follow() { DRAG.ghost.style.transform = `translate(${DRAG.x - DRAG.dx}px, ${DRAG.y - DRAG.dy}px) rotate(-2deg) scale(1.04)` }
        function hover() {
            const el = document.elementFromPoint(DRAG.x, DRAG.y), slot = el && el.closest && el.closest('.sv-slot')
            const t = slot && list.contains(slot) ? +slot.dataset.k : null
            if (t === DRAG.target) return
            list.querySelectorAll('.drop-empty, .drop-swap').forEach(x => x.classList.remove('drop-empty', 'drop-swap'))
            DRAG.target = t
            if (t !== null && t !== DRAG.from) slot.classList.add(RANK[t] == null ? 'drop-empty' : 'drop-swap')
        }
        function edges() {                                            // auto-scroll the slot list near its edges
            cancelAnimationFrame(DRAG.raf)
            const r = body.getBoundingClientRect(), y = DRAG.y, zone = 44
            const v = y < r.top + zone && y > r.top - 60 ? -Math.ceil((r.top + zone - y) / 4) : y > r.bottom - zone && y < r.bottom + 60 ? Math.ceil((y - r.bottom + zone) / 4) : 0
            if (!v) return
            const step = () => { if (!DRAG || !DRAG.on) return; body.scrollTop += v; DRAG.target = undefined; hover(); DRAG.raf = requestAnimationFrame(step) }
            DRAG.raf = requestAnimationFrame(step)
        }
        function finish(drop) {
            const d = DRAG; DRAG = null
            if (!d || !d.on) return
            cancelAnimationFrame(d.raf); mount.classList.remove('sv-dragging'); NOCLICK = d.kind === 'card'
            setTimeout(() => { NOCLICK = false }, 50)
            const t = drop ? d.target : null, s = sticker(d.id)
            if (t != null && t !== d.from) {
                const was = RANK[t]
                if (d.kind === 'slot') swap(d.from, t); else place(d.id, t)
                d.ghost.remove(); draw()
                const row = list.querySelector(`[data-k="${t}"]`); if (row) { row.classList.add('landed'); row.scrollIntoView({ block: 'nearest' }) }
                live(`${s.name} is now in slot ${t + 1}` + (was != null && was !== d.id ? (d.kind === 'slot' ? `, swapped with ${sticker(was).name}.` : `; ${sticker(was).name} went back to the stickers.`) : '.'))
                return
            }
            const back = d.kind === 'slot' ? d.srcEl.getBoundingClientRect() : d.rect      // cancel: glide back, then vanish
            d.ghost.classList.add('back'); d.ghost.style.transform = `translate(${back.left}px, ${back.top}px) rotate(0) scale(${d.kind === 'slot' ? 1 : 0.6})`
            setTimeout(() => { d.ghost.remove(); draw() }, 260)
            live(`${s.name}: not moved.`)
        }
    }
    // keyboard: Space picks up the focused slot, the arrows move it (a swap with the neighbour, empty or not), Space drops,
    // Escape puts everything back
    function keyboard() {
        const list = $('[data-slots]')
        let held = null, before = null
        const focus = k => { const r = list.querySelector(`[data-k="${k}"]`); if (r) { r.focus(); r.classList.toggle('held', held !== null) } }
        list.addEventListener('keydown', e => {
            const row = e.target.closest('.sv-slot'); if (!row || e.target !== row || !canVote()) return
            const k = +row.dataset.k
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                if (held === null) { if (RANK[k] == null) return; held = k; before = RANK.slice(); draw(); focus(k); live(`Picked up ${sticker(RANK[k]).name} in slot ${k + 1}. Arrows to move, Space to drop, Escape to cancel.`) }
                else { const id = RANK[held]; held = null; draw(); focus(k); live(`Dropped ${sticker(id).name} in slot ${k + 1}.`) }
            } else if (held !== null && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault()
                const to = held + (e.key === 'ArrowUp' ? -1 : 1); if (to < 0 || to >= MAX) return
                const other = RANK[to]; swap(held, to); held = to; draw(); focus(to)
                live(`${sticker(RANK[to]).name}: slot ${to + 1}${other != null ? `, swapped with ${sticker(other).name}` : ''}.`)
            } else if (held !== null && e.key === 'Escape') { e.preventDefault(); RANK = before; held = null; draw(); focus(k); live('Cancelled: nothing moved.') }
        })
    }
    function people() {
        const v = voted()
        $('[data-people]').innerHTML = CFG.lanes.map(l => `<li class="${v.has(l.person) ? 'yes' : ''}${ME && ME.person === l.person ? ' me' : ''}" title="${esc(l.name)}${v.has(l.person) ? ': has voted' : ': not yet'}"><span>${esc(first(l.name).slice(0, 1))}</span>${esc(first(l.name))}</li>`).join('')
        $('[data-count]').textContent = `${v.size} of ${CFG.lanes.length} voted`
        me()
    }
    // the person, compact, in the band: "You are Dinis · voted 10:42 · ballot of 7", or for a visitor "Team only: add your key"
    function me() {
        const box = $('[data-me]'), last = LS.get('last', null), mine = last && ME && last.person === ME.person ? last : null
        box.style.removeProperty('--c')
        if (!ME) { box.className = 'sv-chip visitor'; box.innerHTML = `<button type="button" data-addkey><span aria-hidden="true">🔑</span> <b>Team only:</b> add your key to vote</button>`; box.querySelector('[data-addkey]').onclick = () => { const a = document.querySelector('.addkey'); if (a) { a.scrollIntoView({ behavior: 'smooth' }); const t = a.querySelector('[data-paste], textarea'); if (t) t.focus() } }; return }
        if (ME.colour) box.style.setProperty('--c', ME.colour)
        const who = `<span class="av" aria-hidden="true">${esc(first(ME.name).slice(0, 1))}</span><span>You are <b>${esc(first(ME.name))}</b>`
        if (!ME.lane) { box.className = 'sv-chip'; box.innerHTML = `${who} · no lane yet (ask conductor@web-summit.dinis)</span>`; return }
        const shut = Date.now() >= Date.parse(CFG.closes_at), n = mine ? mine.ranking.filter(x => x != null).length : 0
        box.className = 'sv-chip' + (mine || voted().has(ME.person) ? ' done' : '')
        box.innerHTML = who + ' · ' + (shut ? 'voting has closed' : mine ? `voted ${esc(String(mine.at).slice(11, 16))} UTC · ballot of ${n}` : voted().has(ME.person) ? 'voted' : '<b>not voted yet</b>') + '</span>'
        $('[data-last]').textContent = mine ? `Last submitted ${String(mine.at).slice(11, 16)} UTC: ${mine.ranking.map((id, k) => `${k + 1}. ${id != null && sticker(id) ? sticker(id).name : '(empty)'}`).join(', ')}${mine.not_for_me && mine.not_for_me.length ? `; not for me: ${mine.not_for_me.map(id => sticker(id).name).join(', ')}` : ''}${Object.keys(mine.variant_pick || {}).length ? `; favourite variant: ${Object.entries(mine.variant_pick).map(([k, v]) => `${sticker(+k).name} v${v}`).join(', ')}` : ''}.` : ''
    }
    // the leaderboard as a bar race: rows enter in sticker order, then slide into their places while the bars grow
    function favourite(x) {                                      // the most hearted variant: "favourite: v2 (3)"
        const h = x && x.variant_hearts; if (!h) return ''
        const [v, n] = Object.entries(h).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0] || []
        return v ? ` · ♥ favourite: v${esc(v)} (${n})` : ''
    }
    function results() {
        const note = $('[data-rnote]'), ol = $('[data-bars]')
        if (!RESULTS) return
        const n = RESULTS.voters_count || 0, by = {}
        for (const x of RESULTS.ranking || []) by[x.id] = x
        const pts = id => (by[id] && by[id].points != null ? by[id].points : ((RESULTS.counts || {})[id] || 0))
        const max = Math.max(1, ...CFG.stickers.map(s => pts(s.id)))
        note.textContent = n ? `${n} ballot${n === 1 ? '' : 's'} counted (drained ${String(RESULTS.as_of || '').replace('T', ' ').slice(0, 16)} UTC). Points by slot: slot 1 = ${MAX} ... slot ${MAX} = 1, an empty slot nothing (an earlier top 6 counts by position too). Ballots waiting in a lane are counted at the next drain.`
            : 'No ballots counted yet: they wait, sealed, in the lanes until Angelo, Jose, Indi or Dinis drain them.'
        ol.innerHTML = CFG.stickers.map(s => { const x = by[s.id] || {}; return `<li data-bid="${s.id}"><span class="sv-place"></span><img src="${esc(up + s.thumb)}" alt="" width="40" height="40" loading="lazy"><span class="sv-t"><i style="--w:${(100 * pts(s.id) / max).toFixed(1)}%"></i><span>${esc(s.id + '. ' + s.name)}${(x.in_top || x.top6) ? ` · in ${x.in_top || x.top6} top ${MAX}${(x.in_top || x.top6) === 1 ? '' : 's'}` : ''}${x.not_for_me ? ` · 👎 ${x.not_for_me}` : ''}${favourite(x)}</span></span><b>${pts(s.id)}</b></li>` }).join('')
        const order = CFG.stickers.slice().sort((a, b) => pts(b.id) - pts(a.id) || ((by[b.id] || {}).in_top || (by[b.id] || {}).top6 || 0) - ((by[a.id] || {}).in_top || (by[a.id] || {}).top6 || 0) || a.id - b.id)
        setTimeout(() => {
            const rows = [...ol.children], before = new Map(rows.map(r => [r, r.getBoundingClientRect().top]))
            order.forEach((s, k) => { const r = ol.querySelector(`[data-bid="${s.id}"]`); r.querySelector('.sv-place').textContent = pts(s.id) ? k + 1 : ''; ol.appendChild(r) })
            for (const r of rows) { const d = before.get(r) - r.getBoundingClientRect().top; r.style.transform = `translateY(${d}px)`; r.style.transition = 'none' }
            requestAnimationFrame(() => requestAnimationFrame(() => { ol.classList.add('go'); for (const r of rows) { r.style.transition = ''; r.style.transform = '' } }))
        }, 500)
        for (const s of CFG.stickers) {
            const li = $(`.sv-card[data-id="${s.id}"]`), v = pts(s.id)
            li.querySelector('[data-n]').textContent = v ? `${v} pt${v === 1 ? '' : 's'}` : ''
            li.classList.toggle('lead', !!(RESULTS.leader && RESULTS.leader.id === s.id && v))
        }
    }
    function tick() {
        const ms = Date.parse(CFG.closes_at) - Date.now(), el = $('[data-cd]')
        if (ms <= 0) { el.textContent = 'closed'; mount.classList.add('sv-closed'); return }
        const h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60
        el.textContent = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    function openVault() {
        $('[data-vault]').innerHTML = `<p class="sv-fbtns"><button type="button" data-vwin>Open the vault in a new window</button></p><iframe title="The ws-stickers-vote vault, rendered read-only by SG/Vault" src="${esc(CFG.vault_url)}" allow="fullscreen" allowfullscreen loading="lazy"></iframe>`
        $('[data-vwin]').onclick = () => window.open(CFG.vault_url, '_blank', 'noopener')
    }

    // ---------- for a person who holds the vault key sealed to them: a link to the full-access page ----------
    // (Dinis, 5 November 2026: "move that 'open vault' to a new page/section where the main voting page just has a link to it")
    async function fullAccess() {
        if (!ME) return
        let files = []
        try { const j = await (await fetch(up + 'me.json', { cache: 'no-cache' })).json(); files = ((j.people || {})[ME.person] || {}).sealed || [] } catch { return }
        if (!files.some(x => /-stickers-vault-key\.json$/.test(x))) return
        const box = $('[data-full]'); box.hidden = false
        box.innerHTML = `<p><b>You can drain the votes.</b> The vault key is sealed to you: <a href="vault/index.html">open the vault with full access</a> on its own page.</p>`
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

    // ---------- submitting ----------
    async function submit() {
        const btn = $('[data-submit]')
        if (!filled().length || !canVote()) return
        btn.disabled = true; btn.textContent = 'Sealing...'
        try {
            const lane = await KR.open(ME.lane.sealed_token)
            if (!lane || lane.person !== ME.person || !/^[0-9a-f]{16,128}$/.test(lane.append_token || '')) throw new Error('the lane token did not open for you')
            const v = { type: 'web-summit.sticker-vote/v2', person: ME.person, ranking: (() => { const r = RANK.slice(0, MAX); while (r.length && r[r.length - 1] == null) r.pop(); return r })(), not_for_me: NFM.filter(x => !RANK.includes(x)), at: new Date().toISOString() }
            if (Object.keys(VPICK).length) v.variant_pick = Object.fromEntries(Object.entries(VPICK).map(([k, x]) => [String(k), x]))
            const signed = JSON.stringify(v)
            const sig = await KR.sign(signed)
            const enc = await seal(CFG.drain_public_key, JSON.stringify({ vote: v, signed, sig, key: KR.fingerprint }))
            btn.textContent = 'Sending...'
            // a 404 is retried: for a few minutes after the lanes are re-issued, some server instances still hold the old
            // anchor list (measured on 5 November); a 404 stored nothing, so retrying cannot write a ballot twice
            let r
            for (const wait of [0, 1500, 3000, 6000, 10000]) {
                if (wait) { btn.textContent = 'Retrying...'; await new Promise(ok => setTimeout(ok, wait)) }
                r = await fetch(`${CFG.endpoint}/api/vault/append/write/${CFG.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: lane.append_token, payload: btoa(enc) }) })
                if (r.status !== 404) break
            }
            if (!r.ok) throw new Error(r.status === 404 ? 'the lane refused the token (404): ask for the lanes to be re-issued' : r.status === 507 ? 'your lane is full (507): it needs a drain' : `the lane said ${r.status}`)
            LS.set('last', { person: ME.person, ranking: v.ranking, not_for_me: v.not_for_me, variant_pick: v.variant_pick || {}, at: v.at })
            btn.textContent = 'Submitted!'; confetti()
            PENDING[ME.person] = (PENDING[ME.person] || 0) + 1
            me(); people()
            setTimeout(() => draw(), 1600)
            refresh()
        } catch (e) {
            btn.disabled = false; btn.textContent = 'Try again'
            say('The ballot did not go: ' + (e.message || e), 'bad')
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
        MAX = Math.max(1, Math.min(24, +CFG.max_ranking || 10)); RANK = Array(MAX).fill(null)
        layout(); tick(); setInterval(tick, 1000)
        if (KR) { try { await KR.ready } catch { } }
        if (KR && KR.person) { const l = CFG.lanes.find(x => x.person === KR.person); ME = { person: KR.person, name: l ? l.name : KR.person, lane: l || null } }
        if (ME) fetch(up + 'me.json', { cache: 'no-cache' }).then(r => r.json()).then(j => { const p = (j.people || {})[ME.person]; if (p) { ME.colour = p.colour; if (p.name) ME.name = p.name; me() } }).catch(() => { })
        const last = LS.get('last', null)
        if (last && ME && last.person === ME.person) { (last.ranking || []).slice(0, MAX).forEach((id, k) => { if (id != null && sticker(id) && !RANK.includes(id)) RANK[k] = id }); NFM = (last.not_for_me || []).filter(id => sticker(id) && !RANK.includes(id)); for (const [k, x] of Object.entries(last.variant_pick || {})) { const st = sticker(+k); if (st && st.variants && st.variants.some(y => y.v === x)) VPICK[+k] = x } }
        mount.classList.toggle('sv-can', canVote())
        me(); draw(); people()
        refresh(); setInterval(refresh, 30000)
        fullAccess()
        readResults().then(r => { RESULTS = r; results(); people() }).catch(e => { $('[data-rnote]').textContent = 'The leaderboard is inside the vault (below): this browser could not read it directly (' + (e.message || e) + ').' })
        const v = $('[data-vault]')
        if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { io.disconnect(); if (!v.querySelector('iframe')) openVault() } }, { rootMargin: '200px' }); io.observe(v) }
    }
    if (document.readyState === 'complete') start(); else addEventListener('DOMContentLoaded', start)   // deferred scripts run while 'interactive'
})()
