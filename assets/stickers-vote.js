// The team's sticker vote (WS-159; conductor@web-summit.dinis, 5 November 2026, at Dinis's word). The page and the
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
    let RANK = [], NFM = []                         // the ballot being built: ids in order, and "not for me"
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
<div class="sv-top">
  <div class="sv-clock"><span class="sv-l">Voting closes in</span><b data-cd>--</b><span class="sv-l">Thursday 5 November, 18:00 UTC</span></div>
  <div class="sv-team"><span class="sv-l">The team <b data-count></b></span><ul class="sv-people" data-people></ul></div>
</div>
<div class="sv-me" data-me role="status" aria-live="polite"></div>
<div class="sv-main">
  <ol class="sv-grid" data-grid></ol>
  <aside class="sv-panel" data-panel aria-label="My top ${MAX}">
    <button type="button" class="sv-ph" data-sheet aria-expanded="false"><b>My top ${MAX}</b><span data-filled>0 of ${MAX}</span><span class="sv-chev" aria-hidden="true"></span></button>
    <div class="sv-pbody">
      <p class="sv-hint">Tap a sticker to add it. Drag the handle, or use the arrows, to put them in order: 1st gets ${MAX} points, ${MAX}th gets 1.</p>
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
        let grp = null
        $('[data-grid]').innerHTML = CFG.stickers.map((s, i) => `${s.group_title && s.group !== grp && (grp = s.group) ? `<li class="sv-group"><h3>${esc(s.group_title)}</h3></li>` : ''}<li class="sv-card" style="--i:${i}" data-id="${s.id}"><div class="sv-cin">
<button type="button" class="sv-face" data-add aria-label="${esc(s.id + '. ' + s.name)}: add to my top ${MAX}"><span class="sv-img"><img src="${esc(up + s.thumb)}" alt="" width="480" height="480" loading="lazy"><span class="sv-num">${s.id}</span><span class="sv-rank" data-rank></span><span class="sv-pts" data-n></span></span>
<b>${esc(s.name)}</b><span class="sv-words">${esc(s.words)}</span><span class="sv-joke">${esc(s.joke)}</span></button>
${s.variants && s.variants.length > 1 ? `<span class="sv-vars" role="group" aria-label="Variants of ${esc(s.name)}"><button type="button" class="sv-vstep" data-vstep="-1" aria-label="Previous variant">‹</button>${s.variants.map((v, k) => `<button type="button" class="sv-dot" data-v="${k}" aria-label="Variant ${v.v}"${k ? '' : ' aria-current="true"'}></button>`).join('')}<button type="button" class="sv-vstep" data-vstep="1" aria-label="Next variant">›</button><button type="button" class="sv-heart" data-heart aria-pressed="false" title="This one: my favourite variant"><span aria-hidden="true">♡</span> this one</button></span>` : ''}
<span class="sv-acts"><button type="button" class="sv-add" data-add>Add to my top ${MAX}</button><button type="button" class="sv-no" data-no aria-pressed="false" title="Not for me"><span aria-hidden="true">👎</span><span class="sr">Not for me</span></button></span></div></li>`).join('')
        $('[data-grid]').addEventListener('click', e => {
            const li = e.target.closest('.sv-card'); if (!li) return
            const id = +li.dataset.id
            const dot = e.target.closest('[data-v]'), stp = e.target.closest('[data-vstep]')
            if (dot || stp) { const n = sticker(id).variants.length; flip(id, dot ? +dot.dataset.v : ((FACE[id] || 0) + +stp.dataset.vstep + n) % n); return }
            if (e.target.closest('[data-heart]')) return heart(id)
            if (e.target.closest('[data-no]')) toggleNfm(id); else if (e.target.closest('[data-add]')) toggleRank(id)
        })
        $('[data-slots]').addEventListener('click', e => {
            const b = e.target.closest('button[data-act]'); if (!b) return
            const id = +b.closest('[data-sid]').dataset.sid, i = RANK.indexOf(id), act = b.dataset.act
            if (act === 'up' && i > 0) [RANK[i - 1], RANK[i]] = [RANK[i], RANK[i - 1]]
            else if (act === 'down' && i < RANK.length - 1) [RANK[i + 1], RANK[i]] = [RANK[i], RANK[i + 1]]
            else if (act === 'rm') RANK.splice(i, 1)
            else return
            draw(); const again = $(`[data-sid="${id}"] [data-act="${act}"]`); if (again && !again.disabled) again.focus()
        })
        $('[data-nfm]').addEventListener('click', e => { const b = e.target.closest('[data-unno]'); if (b) toggleNfm(+b.dataset.unno) })
        $('[data-sheet]').onclick = () => { const open = !mount.classList.contains('sv-sheet-open'); mount.classList.toggle('sv-sheet-open', open); $('[data-sheet]').setAttribute('aria-expanded', String(open)) }
        $('[data-submit]').onclick = submit
        $('[data-vaultlink]').href = CFG.vault_url
        $('[data-openvault]').onclick = openVault
        dragging()
        requestAnimationFrame(() => mount.classList.add('sv-in'))
    }
    function toggleRank(id) {
        if (!canVote()) return refuse(id)
        const i = RANK.indexOf(id)
        if (i >= 0) RANK.splice(i, 1)
        else if (RANK.length >= MAX) { refuse(id); say(`Your top ${MAX} is full: remove one in the panel first.`, 'warn'); return }
        else { RANK.push(id); NFM = NFM.filter(x => x !== id); bump() }
        draw()
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
        if (NFM.includes(id)) NFM = NFM.filter(x => x !== id); else { NFM.push(id); RANK = RANK.filter(x => x !== id) }
        draw()
    }
    function refuse(id) {
        const li = $(`.sv-card[data-id="${id}"]`); li.classList.remove('nope'); void li.offsetWidth; li.classList.add('nope')
        if (!ME) { const m = $('[data-me]'); m.classList.remove('sv-flash'); void m.offsetWidth; m.classList.add('sv-flash') }
    }
    function bump() { const p = $('[data-filled]'); p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump') }
    function say(t, kind) { const m = $('[data-me]'); m.className = 'sv-me' + (kind === 'bad' ? ' sv-bad' : kind === 'warn' ? ' sv-nokey' : ''); m.textContent = t }
    function draw() {                                            // the cards and the panel, from RANK and NFM
        for (const li of mount.querySelectorAll('.sv-card')) {
            const id = +li.dataset.id, r = RANK.indexOf(id), no = NFM.includes(id)
            const hb = li.querySelector('[data-heart]')
            if (hb) { const s = sticker(id), showing = s.variants[FACE[id] || 0].v, on = VPICK[id] === showing; hb.setAttribute('aria-pressed', String(on)); hb.innerHTML = `<span aria-hidden="true">${on ? '♥' : '♡'}</span> ${VPICK[id] && !on ? `v${VPICK[id]} is my favourite` : on ? 'my favourite' : 'this one'}` }
            li.classList.toggle('ranked', r >= 0); li.classList.toggle('nfm', no)
            li.querySelector('[data-rank]').textContent = r >= 0 ? '#' + (r + 1) : ''
            li.querySelector('.sv-add').textContent = r >= 0 ? `#${r + 1} in my top ${MAX} · remove` : RANK.length >= MAX ? `Top ${MAX} is full` : `Add to my top ${MAX}`
            li.querySelector('[data-no]').setAttribute('aria-pressed', String(no))
            li.querySelector('.sv-face').setAttribute('aria-label', `${id}. ${sticker(id).name}: ${r >= 0 ? `number ${r + 1} in my top ${MAX}, press to remove` : `add to my top ${MAX}`}`)
        }
        const slots = []
        for (let k = 0; k < MAX; k++) {
            const id = RANK[k]
            if (!id) { slots.push(`<li class="sv-slot empty"><span class="sv-pos">${k + 1}</span><span class="sv-sname">${k === RANK.length ? 'Tap a sticker to add it' : ''}</span></li>`); continue }
            const s = sticker(id)
            slots.push(`<li class="sv-slot" data-sid="${id}"><span class="sv-handle" data-drag title="Drag to reorder" aria-hidden="true">⋮⋮</span><span class="sv-pos">${k + 1}</span><img src="${esc(up + s.thumb)}" alt="" width="40" height="40"><span class="sv-sname"><span class="sv-sn">${esc(s.name)}</span><small>${MAX - k} pt${k === MAX - 1 ? '' : 's'}</small></span>
<span class="sv-sb"><button type="button" data-act="up" aria-label="Move ${esc(s.name)} up"${k === 0 ? ' disabled' : ''}>▲</button><button type="button" data-act="down" aria-label="Move ${esc(s.name)} down"${k === RANK.length - 1 ? ' disabled' : ''}>▼</button><button type="button" data-act="rm" aria-label="Remove ${esc(s.name)}">✕</button></span></li>`)
        }
        $('[data-slots]').innerHTML = slots.join('')
        $('[data-nfm]').innerHTML = NFM.length ? NFM.map(id => `<li><button type="button" data-unno="${id}" title="Undo: not for me">${esc(id + '. ' + sticker(id).name)} <span aria-hidden="true">✕</span></button></li>`).join('') : '<li class="sv-none">None yet: press 👎 on a sticker you would not put on your laptop.</li>'
        $('[data-filled]').textContent = `${RANK.length} of ${MAX}`
        const b = $('[data-submit]'); b.disabled = !RANK.length || !canVote(); b.textContent = RANK.length ? `Submit my top ${RANK.length}` : `Submit my top ${MAX}`
        mount.classList.toggle('sv-has', RANK.length > 0)
    }
    // drag to reorder, with pointer events (mouse, pen and touch alike); the arrows do the same for keyboards and iPhones
    function dragging() {
        const list = $('[data-slots]')
        let id = null, pid = null
        list.addEventListener('pointerdown', e => {
            const h = e.target.closest('[data-drag]'); if (!h || !canVote()) return
            id = +h.closest('[data-sid]').dataset.sid; pid = e.pointerId
            list.setPointerCapture(pid); e.preventDefault()
            list.classList.add('dragging'); mark()
        })
        list.addEventListener('pointermove', e => {
            if (id === null || e.pointerId !== pid) return
            const rows = [...list.querySelectorAll('.sv-slot:not(.empty)')]
            let to = rows.findIndex(r => { const b = r.getBoundingClientRect(); return e.clientY < b.top + b.height / 2 })
            if (to < 0) to = rows.length - 1
            const from = RANK.indexOf(id)
            if (to !== from && to >= 0) { RANK.splice(from, 1); RANK.splice(to, 0, id); draw(); mark() }
        })
        const end = e => { if (id === null || e.pointerId !== pid) return; id = null; try { list.releasePointerCapture(pid) } catch { } list.classList.remove('dragging'); draw() }
        list.addEventListener('pointerup', end); list.addEventListener('pointercancel', end)
        function mark() { const r = list.querySelector(`[data-sid="${id}"]`); if (r) r.classList.add('lifted') }
    }
    function people() {
        const v = voted()
        $('[data-people]').innerHTML = CFG.lanes.map(l => `<li class="${v.has(l.person) ? 'yes' : ''}${ME && ME.person === l.person ? ' me' : ''}" title="${esc(l.name)}${v.has(l.person) ? ': has voted' : ': not yet'}"><span>${esc(first(l.name).slice(0, 1))}</span>${esc(first(l.name))}</li>`).join('')
        $('[data-count]').textContent = `${v.size} of ${CFG.lanes.length} voted`
    }
    function me() {
        const box = $('[data-me]'), last = LS.get('last', null), mine = last && ME && last.person === ME.person ? last : null
        if (!ME) { box.className = 'sv-me sv-nokey'; box.innerHTML = `<b>Add your key to vote (team only).</b> Your browser needs the site key your conductor gave you: use the <b>Add your key</b> box at the top of this page, then rank your top ${MAX}. Anyone can look; only the team votes.`; return }
        if (!ME.lane) { box.className = 'sv-me sv-nokey'; box.innerHTML = `<b>${esc(first(ME.name || ME.person))}, you have no lane yet.</b> Lanes are issued to the team's site keys; ask conductor@web-summit.dinis to re-issue them (<code>stickers_vote.py lanes</code>).`; return }
        box.className = 'sv-me'
        box.innerHTML = Date.now() >= Date.parse(CFG.closes_at) ? `<b>Voting has closed.</b>`
            : mine ? `<b>Hello ${esc(first(ME.name))}: your ballot is in.</b> Change it in the panel and submit again: your newest ballot counts.`
                : `<b>Hello ${esc(first(ME.name))}: rank your top ${MAX}.</b> Tap a sticker to add it, put them in order in the panel, press 👎 on any that are not for you, then Submit. Your ballot is signed by your key and sealed before it leaves this browser.`
        $('[data-last]').textContent = mine ? `Last submitted ${String(mine.at).slice(11, 16)} UTC: ${mine.ranking.map((id, k) => `${k + 1}. ${sticker(id).name}`).join(', ')}${mine.not_for_me && mine.not_for_me.length ? `; not for me: ${mine.not_for_me.map(id => sticker(id).name).join(', ')}` : ''}${Object.keys(mine.variant_pick || {}).length ? `; favourite variant: ${Object.entries(mine.variant_pick).map(([k, v]) => `${sticker(+k).name} v${v}`).join(', ')}` : ''}.` : ''
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
        note.textContent = n ? `${n} ballot${n === 1 ? '' : 's'} counted (drained ${String(RESULTS.as_of || '').replace('T', ' ').slice(0, 16)} UTC). Borda points: 1st = ${MAX}, ${MAX}th = 1 (an earlier top 6 counts by position too). Ballots waiting in a lane are counted at the next drain.`
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
        $('[data-vault]').innerHTML = `<iframe title="The ws-stickers-vote vault, rendered read-only by SG/Vault" src="${esc(CFG.vault_url)}" allow="fullscreen" allowfullscreen loading="lazy"></iframe>`
    }

    // ---------- the vault with full access, for a person who holds the vault key sealed to them ----------
    async function fullAccess() {
        if (!ME) return
        let files = []
        try { const j = await (await fetch(up + 'me.json', { cache: 'no-cache' })).json(); files = ((j.people || {})[ME.person] || {}).sealed || [] } catch { return }
        const f = files.filter(x => /-stickers-vault-key\.json$/.test(x)).sort().pop()
        if (!f) return
        let env
        try { env = await (await fetch(up + f, { cache: 'no-cache' })).json() } catch { return }
        const box = $('[data-full]'); box.hidden = false
        if (env.key !== KR.fingerprint) { box.innerHTML = `<h2 id="full-access">Open the vault (full access)</h2><p>The vault key is sealed to your key ${esc(env.key)}, but this browser holds a different key (${esc(KR.fingerprint || 'none')}). Add your current key (the latest link your conductor gave you) and reload.</p>`; return }
        box.innerHTML = `<h2 id="full-access">Open the vault (full access)</h2><p>The vault key is sealed to your key${env.at ? ` (${esc(String(env.at).slice(0, 10))})` : ''}. It opens here, in this browser's memory only, when you press the button: never stored, never in the page. It gives write access, so use it to drain the votes: in the vault host add the SG/Send access token (the lock button), then Drain the votes with the passphrase below.</p>
<p class="sv-fbtns"><button type="button" class="sv-open" data-fopen>Open the vault (full access)</button></p><div data-fbody></div>`
        box.querySelector('[data-fopen]').onclick = async () => {
            const body = box.querySelector('[data-fbody]')
            let m
            try { m = await KR.open(env) } catch (e) { body.textContent = 'Your key could not open it: ' + (e.message || e); return }
            const fields = m.fields || {}, vk = fields['Vault key'], pass = fields['Drain passphrase']
            if (!vk) { body.textContent = 'The sealed message has no vault key.'; return }
            const url = 'https://dev.vault.sgraph.ai/#' + encodeURIComponent(vk)
            body.innerHTML = `<p class="sv-fbtns"><button type="button" data-fwin>Open in a new window</button>${pass ? ' <button type="button" data-fpass>Copy the drain passphrase</button>' : ''} <span class="meta" data-fmsg></span></p><p>This is the <b>full vault key</b> (it ends in <code>:${esc(vk.split(':').pop())}</code>; the public read key on this page does not). The vault host still says <b>Read-only</b> until you press its 🔒 button and paste the SG/Send access token: only then can it write, and the Drain panel appears.</p><p class="sv-vk"><code data-fkey>${esc(vk.slice(0, 10))}…${esc(vk.slice(-9))}</code><button type="button" data-fshow>Show</button><button type="button" data-fcopy>Copy the vault key</button></p><div class="sv-vault"></div>`
            body.querySelector('[data-fshow]').onclick = e => { const k = body.querySelector('[data-fkey]'), on = e.target.textContent === 'Show'; k.textContent = on ? vk : vk.slice(0, 10) + '…' + vk.slice(-9); e.target.textContent = on ? 'Hide' : 'Show' }
            body.querySelector('[data-fcopy]').onclick = async () => { try { await navigator.clipboard.writeText(vk); body.querySelector('[data-fmsg]').textContent = 'Vault key copied.' } catch { body.querySelector('[data-fmsg]').textContent = 'This browser did not allow copying: press Show and copy it by hand.' } }
            const frame = document.createElement('iframe')
            frame.title = 'The ws-stickers-vote vault, opened with full access'; frame.allow = 'fullscreen; clipboard-write'; frame.allowFullscreen = true
            frame.src = url
            body.querySelector('.sv-vault').appendChild(frame)
            body.querySelector('[data-fwin]').onclick = () => window.open(url, '_blank', 'noopener')
            const pb = body.querySelector('[data-fpass]')
            if (pb) pb.onclick = async () => { try { await navigator.clipboard.writeText(pass); body.querySelector('[data-fmsg]').textContent = 'Copied.' } catch { body.querySelector('[data-fmsg]').textContent = 'This browser did not allow copying; the passphrase is in your sealed message (For you panel).' } }
            box.querySelector('[data-fopen]').hidden = true
        }
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
        if (!RANK.length || !canVote()) return
        btn.disabled = true; btn.textContent = 'Sealing...'
        try {
            const lane = await KR.open(ME.lane.sealed_token)
            if (!lane || lane.person !== ME.person || !/^[0-9a-f]{16,128}$/.test(lane.append_token || '')) throw new Error('the lane token did not open for you')
            const v = { type: 'web-summit.sticker-vote/v2', person: ME.person, ranking: RANK.slice(0, MAX), not_for_me: NFM.filter(x => !RANK.includes(x)), at: new Date().toISOString() }
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
        MAX = Math.max(1, Math.min(24, +CFG.max_ranking || 10))
        layout(); tick(); setInterval(tick, 1000)
        if (KR) { try { await KR.ready } catch { } }
        if (KR && KR.person) { const l = CFG.lanes.find(x => x.person === KR.person); ME = { person: KR.person, name: l ? l.name : KR.person, lane: l || null } }
        const last = LS.get('last', null)
        if (last && ME && last.person === ME.person) { RANK = (last.ranking || []).filter(id => sticker(id)); NFM = (last.not_for_me || []).filter(id => sticker(id) && !RANK.includes(id)); for (const [k, x] of Object.entries(last.variant_pick || {})) { const st = sticker(+k); if (st && st.variants && st.variants.some(y => y.v === x)) VPICK[+k] = x } }
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
