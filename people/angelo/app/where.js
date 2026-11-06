// Where: the team's whereabouts and logistics (WS-181 step 1; dev@PrompTugal.angelo, 6 November 2026, at Angelo's go:
// "Go with step 1"). The design is people/angelo/proposals/WS-181/page.md. This step is a DEMO: made-up people and
// items, and no vault. Everything lives in this browser (localStorage, "ak.where.demo.*"; a person's script may not use
// IndexedDB, WS-164); the "vault" is a store on this
// device, so the two modes can be tried: local first (the board opens from the copy kept here, updates go into a
// queue), and the sync (the queue is sent oldest first when online; "Try offline" holds it). Nothing leaves the browser,
// and the browser's location is never asked for.
(function (root) {
    'use strict'
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const PLACES = ['Stand', 'Centre Stage', 'Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Press room', 'Venue', 'Hotel', 'In town', 'Off']
    const NEXT = ['At the stand', 'A talk', 'A meeting', 'A collection', 'A break', 'Travelling']
    const UNTIL = [['30 min', 30], ['1 h', 60], ['2 h', 120], ['End of day', 'eod']]
    const UNDO_MS = 5000, SEND_MS = 450, FADE_H = 3, GONE_H = 12, ME = 'you'
    const DB = 'ak.where.demo.'

    // ---------- the store on this device: localStorage, or memory if the browser refuses it (a private window) ----------
    const mem = new Map()
    async function get(k) { try { const v = localStorage.getItem(DB + k); if (v !== null) return JSON.parse(v) } catch { } return mem.get(k) }
    async function put(k, v) { mem.set(k, v); try { localStorage.setItem(DB + k, JSON.stringify(v)) } catch { } }
    async function wipe() { mem.clear(); try { for (const k of Object.keys(localStorage)) if (k.startsWith(DB)) localStorage.removeItem(k) } catch { } }

    // ---------- the demo's made-up team and items, placed relative to now ----------
    function seed(now) {
        const m = n => new Date(now - n * 6e4).toISOString(), inM = n => new Date(now + n * 6e4).toISOString()
        const vault = [
            { type: 'line', person: 'ana', place: 'Stand', next: 'At the stand', until: inM(50), at: m(8) },
            { type: 'line', person: 'bruno', place: 'Centre Stage', next: 'A talk', until: inM(25), at: m(40) },
            { type: 'line', person: 'carla', place: 'Hall 2', next: 'A meeting', until: inM(70), note: 'with a partner, back for the 16:00 shift', at: m(115) },
            { type: 'line', person: 'duarte', place: 'Press room', next: 'A break', at: m(4 * 60 + 10) },
            { type: 'line', person: 'eva', place: 'Hotel', next: 'Travelling', at: m(14 * 60) },
            { type: 'line', person: ME, place: 'Venue', next: 'A talk', at: m(65) },
            { type: 'item', id: 'i1', kind: 'Collection', what: 'Badges for the two late arrivals', where: 'Badge pickup', when: inM(35), who: 'bruno', at: m(300) },
            { type: 'item', id: 'i2', kind: 'Shift', what: 'Stand: the demo screen', where: 'Stand', when: inM(90), who: ME, at: m(300) },
            { type: 'item', id: 'i3', kind: 'Meeting', what: 'Debrief over coffee', where: 'Venue', when: inM(150), who: 'everyone', at: m(240) },
            { type: 'item', id: 'i4', kind: 'Collection', what: 'Stickers from the printer', where: 'In town', when: inM(-20), who: 'carla', at: m(500) },
        ]
        return { vault, queue: [], recent: [], syncedAt: new Date(now).toISOString(), offline: false }
    }
    const NAMES = { ana: 'Ana', bruno: 'Bruno', carla: 'Carla', duarte: 'Duarte', eva: 'Eva', [ME]: 'You', everyone: 'Everyone' }

    // ---------- the rules (pure; selfTest() runs them) ----------
    // a person's line: the newest record by its own timestamp wins, wherever it is (sent or still queued)
    function lines(records) { const by = new Map(); for (const r of records) if (r.type === 'line') { const c = by.get(r.person); if (!c || r.at > c.at) by.set(r.person, r) } return by }
    // logistics are events: an item is created, then done or moved; two people never overwrite each other's edit
    function items(records) {
        const by = new Map()
        for (const r of [...records].sort((a, b) => a.at.localeCompare(b.at))) {
            if (r.type === 'item') by.set(r.id, { ...r, done: false, moves: 0 })
            else if (r.type === 'done' && by.has(r.id)) by.get(r.id).done = r.at
            else if (r.type === 'moved' && by.has(r.id)) { const it = by.get(r.id); it.when = r.when; it.moves++ }
        }
        return [...by.values()]
    }
    const ageH = (r, now) => (now - Date.parse(r.at)) / 36e5
    const freshness = (r, now) => ageH(r, now) >= GONE_H ? 'gone' : ageH(r, now) >= FADE_H ? 'old' : 'ok'
    function selfTest() {
        const t = (h, m) => `2026-11-10T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`
        const ok = (c, m) => { if (!c) throw new Error('where self-test: ' + m) }
        const L = lines([{ type: 'line', person: 'a', place: 'Stand', at: t(10, 5) }, { type: 'line', person: 'a', place: 'Hotel', at: t(9, 0) }])
        ok(L.get('a').place === 'Stand', 'a late, older update does not replace a newer one')
        const I = items([{ type: 'done', id: 'x', at: t(11, 0) }, { type: 'item', id: 'x', when: t(12, 0), at: t(8, 0) }, { type: 'moved', id: 'x', when: t(13, 0), at: t(10, 0) }, { type: 'moved', id: 'x', when: t(14, 0), at: t(10, 30) }])
        ok(I[0].done && I[0].when === t(14, 0) && I[0].moves === 2, 'events apply in time order; the later move wins and is counted')
        const now = Date.parse(t(12, 0))
        ok(freshness({ at: t(11, 0) }, now) === 'ok' && freshness({ at: t(8, 30) }, now) === 'old' && freshness({ at: t(0, 0) }, now) === 'gone', 'fades after 3 h, "not seen since" after 12 h')
        return true
    }

    // ---------- state, loaded once; every change is written back to this device ----------
    let S = null, loading = null, timer = null, wired = false, sending = false, undo = null, picked = false, view = null, ctx = null
    const save = () => Promise.all(['vault', 'queue', 'recent', 'syncedAt', 'offline', 'pins'].map(k => put(k, S[k])))
    async function load() {
        const vault = await get('vault')
        if (!vault) { S = { ...seed(Date.now()), pins: [] }; await save(); return }
        S = { vault, queue: (await get('queue')) || [], recent: (await get('recent')) || [], syncedAt: (await get('syncedAt')) || '', offline: !!(await get('offline')), pins: (await get('pins')) || [] }
    }
    const online = () => navigator.onLine !== false && !S.offline
    const all = () => [...S.vault, ...S.queue]

    // the sync: when online, the queue is sent oldest first, one at a time; your own newest update waits out its undo
    async function tick() {
        if (!S || sending || !online()) return
        const r = S.queue[0]; if (!r || (undo && undo.at === r.at && Date.now() - undo.t < UNDO_MS)) return
        sending = r.at; draw()
        await new Promise(ok => setTimeout(ok, SEND_MS))
        if (!online() || S.queue[0] !== r) { sending = false; draw(); return }
        S.queue.shift(); S.vault.push(r); S.syncedAt = new Date().toISOString(); sending = false
        await save(); draw()
    }
    async function add(rec) { S.queue.push(rec); await save() }

    // ---------- the venue map (Angelo, 6 November: "the actual (or closest representation of) map spanning across all the
    // venues, including the ability to set new pins with a label ... to setup our base or identify meeting spots") ----------
    // The map is OpenStreetMap's, drawn with Leaflet (loaded from cdnjs only when this view opens; offline, the pins show
    // as a list). The venues' positions are OpenStreetMap's own (Nominatim, read 6 November 2026), not guessed. The team's
    // pins are places, never people: a person's line still names a place, and the map counts who is at each.
    const VENUES = [
        { id: 'v-meo', label: 'MEO Arena (Centre Stage)', short: 'MEO Arena', kind: 'venue', lat: 38.7684689, lng: -9.0939002, src: 'https://www.openstreetmap.org/way/821784762' },
        { id: 'v-fil', label: 'FIL, Pavilions 1 to 5 (our stand: Pavilion 1, A1-30)', short: 'FIL · our stand P1', kind: 'venue', lat: 38.7709304, lng: -9.0939393, src: 'https://www.openstreetmap.org/way/821641463' },
        { id: 'v-oriente', label: 'Oriente station (metro, train)', short: 'Oriente', kind: 'venue', lat: 38.7678490, lng: -9.1016705, src: 'https://www.openstreetmap.org/way/189718436' },
        { id: 'v-pp', label: 'Pavilhão de Portugal', kind: 'venue', lat: 38.7663417, lng: -9.0949798, src: 'https://www.openstreetmap.org/relation/3266709' },
    ]
    // which pin a place from the short list belongs to (the halls and the stand are in FIL; Centre Stage is the arena)
    const PLACE_PIN = { 'Stand': 'v-fil', 'Hall 1': 'v-fil', 'Hall 2': 'v-fil', 'Hall 3': 'v-fil', 'Hall 4': 'v-fil', 'Centre Stage': 'v-meo', 'Venue': 'v-fil' }
    const PIN_KINDS = [['base', 'Our base'], ['meet', 'Meeting spot'], ['other', 'Other']]
    const LEAFLET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/'
    let pinMode = false, pending = null, pinKind = 'meet', pinLabel = '', lmap = null, mapEl = null, layer = null, lfail = false, lloading = null
    function leaflet() {
        if (root.L && root.L.map) return Promise.resolve(root.L)
        if (lloading) return lloading
        const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = LEAFLET + 'leaflet.min.css'; document.head.appendChild(css)
        return lloading = new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = LEAFLET + 'leaflet.min.js'; sc.onload = () => ok(root.L); sc.onerror = no; document.head.appendChild(sc) })
            .catch(() => { lfail = true; lloading = null; draw() })
    }
    const pinOf = (place, pins) => { const own = pins.find(x => x.label === place); return own ? own.id : PLACE_PIN[place] || '' }
    function whoAt(L) { const by = {}; for (const [p, r] of L) { if (freshness(r, Date.now()) === 'gone') continue; const id = pinOf(r.place, S.pins); if (id) (by[id] = by[id] || []).push(NAMES[p] || p) } return by }
    function mapSection(L) {
        const pins = [...VENUES, ...S.pins], at = whoAt(L)
        const list = pins.map(x => `<li class="aw-pin aw-pin-${x.kind}"><button type="button" class="ak-chip" data-aw-pin-go="${esc(x.id)}">${esc(x.label)}</button>${at[x.id] ? ` <span class="note">${esc(at[x.id].join(', '))}</span>` : ''}${x.kind !== 'venue' ? ` <span class="note">(${esc((PIN_KINDS.find(k => k[0] === x.kind) || [, ''])[1])})</span> <button type="button" class="aw-x" data-aw-pin-del="${esc(x.id)}" aria-label="Remove the pin ${esc(x.label)}">Remove</button>` : ''}</li>`).join('')
        const form = pending ? `<form class="aw-pinf"><input type="text" maxlength="40" required placeholder="Its label, e.g. Our base, Coffee by Hall 2" aria-label="The pin's label" value="${esc(pinLabel)}"><div class="aw-pink" role="group" aria-label="Kind">${PIN_KINDS.map(([k, l]) => `<button type="button" class="ak-chip" data-aw-pin-kind="${k}" aria-pressed="${pinKind === k}">${l}</button>`).join('')}</div><button type="submit" class="cc-btn">Save the pin</button><button type="button" class="ak-tog" data-aw-pin-cancel>Cancel</button></form>` : ''
        return `<section class="cc-card aw-map"><div class="aw-maph"><h3 class="ak-h3">The venue map</h3><button type="button" class="ak-tog" data-aw-pin-add aria-pressed="${pinMode}">${pinMode ? (pending ? 'Placing a pin…' : 'Tap the map where the pin goes') : '＋ Add a pin'}</button></div>
${lfail ? '<p class="note">The map could not load (offline?). The pins, as a list:</p>' : '<div class="aw-map-slot"></div>'}${form}
<ul class="aw-pins" style="list-style:none;padding:0">${list}</ul>
<p class="note">Map © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors. Grey pins are the venues (OpenStreetMap's positions); yours are gold for a base, blue for a meeting spot. Each shows who is there now, from the team's lines. Places only: never a person's location.</p></section>`
    }
    function mountMap(L) {
        const slot = view.querySelector('.aw-map-slot'); if (!slot) return
        if (!mapEl) {
            mapEl = document.createElement('div'); mapEl.className = 'aw-leaf'
            // its size set here, not only in app.css: the offline store can serve this script with an older app.css (Angelo
            // saw an empty map box on 6 November), and a Leaflet map in a box with no height draws nothing
            Object.assign(mapEl.style, { height: matchMedia('(max-width: 767px)').matches ? '300px' : '380px', width: '100%', borderRadius: '12px', overflow: 'hidden', margin: '10px 0' })
        }
        slot.appendChild(mapEl)
        leaflet().then(Lf => {
            if (!Lf || !mapEl.isConnected) return
            if (!lmap) {
                lmap = Lf.map(mapEl, { scrollWheelZoom: false }).fitBounds(VENUES.map(v => [v.lat, v.lng]), { padding: [30, 30] })
                Lf.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(lmap)
                lmap.on('click', e => { if (!pinMode) return; pending = e.latlng; draw(); const i = view.querySelector('.aw-pinf input'); if (i) i.focus() })
            }
            lmap.invalidateSize()
            if (layer) layer.remove()
            layer = Lf.layerGroup().addTo(lmap)
            const at = whoAt(lines(all()))
            for (const x of [...VENUES, ...S.pins]) {
                const n = (at[x.id] || []).length
                Lf.marker([x.lat, x.lng], { icon: Lf.divIcon({ className: `aw-mk aw-mk-${x.kind}`, html: `<span>${esc(x.short || x.label)}${n ? ` · ${n} here` : ''}</span>`, iconSize: null }) })
                    .bindPopup(`<b>${esc(x.label)}</b>${n ? `<br>${esc(at[x.id].join(', '))}` : ''}${x.src ? `<br><a href="${x.src}" target="_blank" rel="noopener">OpenStreetMap</a>` : ''}`).addTo(layer)
            }
            if (pending) Lf.circleMarker(pending, { radius: 9, color: '#e8b33a', weight: 3 }).addTo(layer)
        })
    }

    // ---------- drawing ----------
    const lisbon = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' })
    const untilText = u => !u ? '' : u === 'eod' ? 'until the end of the day' : `until ${lisbon(u)}`
    function draw() {
        if (!view || !view.isConnected || !ctx) return
        const focus = view.querySelector('.aw-note input:focus, .aw-pinf input:focus'); if (focus) return // never under someone's typing
        const now = Date.now(), L = lines(all()), mine = L.get(ME), I = items(all())
        const queued = S.queue.length, off = !online()
        const status = off
            ? `<b>Offline${S.offline ? ' (tried)' : ''}:</b> the board as of ${S.syncedAt ? lisbon(S.syncedAt) : 'never'}${queued ? `; ${queued} update${queued > 1 ? 's' : ''} waiting to send` : '; nothing waiting'}.`
            : queued ? `<b>Sending</b> ${queued} update${queued > 1 ? 's' : ''}, oldest first${undo && Date.now() - undo.t < UNDO_MS ? ' (yours waits 5 s, so you can undo)' : ''}…` : `<b>Synced</b> at ${lisbon(S.syncedAt)}.`
        // fixed order (Angelo, 6 November: the buttons "change text as I click": they were reordered, most recent first,
        // so the button under the finger took another place's name). The team's own pins follow the list.
        const placeOrder = [...new Set([...PLACES, ...S.pins.map(x => x.label)])]
        const row = (p, r) => {
            const f = freshness(r, now), q = S.queue.some(x => x === r)
            return `<li class="aw-line aw-${f}${p === ME ? ' aw-me' : ''}"><span class="aw-who">${esc(NAMES[p] || p)}</span><span class="aw-place">${esc(r.place)}</span><span class="aw-what">${esc(r.next || '')}${r.until ? ` <span class="note">${esc(untilText(r.until))}</span>` : ''}${r.note ? `<br><span class="note">${esc(r.note)}</span>` : ''}</span><span class="aw-age note">${f === 'gone' ? `not seen since ${esc(lisbon(r.at))}` : esc(ctx.ago(r.at))}${q ? ' · <i>sending</i>' : ''}</span></li>`
        }
        const team = [...L.entries()].sort((a, b) => a[0] === ME ? -1 : b[0] === ME ? 1 : b[1].at.localeCompare(a[1].at))
        const open = I.filter(i => !i.done).sort((a, b) => a.when.localeCompare(b.when)), done = I.filter(i => i.done)
        const item = i => `<li class="aw-item${Date.parse(i.when) < now && !i.done ? ' aw-late' : ''}"><span class="aw-kind">${esc(i.kind)}</span><span><b>${esc(i.what)}</b><br><span class="note">${esc(i.where)}, ${esc(lisbon(i.when))}${Date.parse(i.when) < now ? ' (past)' : ''} · ${esc(NAMES[i.who] || i.who)}${i.moves > 1 ? ' · moved twice' : ''}</span></span>${i.done ? `<span class="note">done ${esc(lisbon(i.done))}</span>` : `<button type="button" class="ak-chip" data-aw-done="${esc(i.id)}">Done</button>`}</li>`
        view.innerHTML = `${ctx.note()}<nav class="ak-switch" aria-label="More views"><a href="#kanban">← Kanban <span class="ak-mk" aria-hidden="true">✦</span></a><a href="#summit">Summit days → <span class="ak-mk" aria-hidden="true">✦</span></a></nav><section class="aw">
<div class="aw-demo" role="note"><b>Demo.</b> Made-up people and items; nothing leaves this browser. The "vault" here is a store on this device, so you can try the two modes: updates go into a queue first and are sent when online. Step 1 of WS-181 (the design: <a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/proposals/WS-181/page.md">page.md</a>); the real vaults come after security's review.</div>
<div class="aw-status${off ? ' aw-off' : ''}" role="status" aria-live="polite"><span>${status}</span><span class="aw-btns"><button type="button" class="ak-tog" data-aw-offline aria-pressed="${S.offline}">Try offline</button><button type="button" class="ak-tog" data-aw-reset>Reset the demo</button></span></div>
${mapSection(L)}
<section class="cc-card aw-mine"><h3 class="ak-h3">Your line</h3>
<p class="aw-now">${mine ? `<b>${esc(mine.place)}</b>${mine.next ? `, ${esc(mine.next.toLowerCase())}` : ''}${mine.until ? ` ${esc(untilText(mine.until))}` : ''} <span class="note">(${esc(ctx.ago(mine.at))})</span>` : 'Not set yet.'}${undo && Date.now() - undo.t < UNDO_MS && S.queue.some(x => x.at === undo.at) ? ` <button type="button" class="ak-chip" data-aw-undo>Undo</button>` : ''}</p>
<p class="aw-step">1. Where are you?</p><div class="aw-grid" role="group" aria-label="Where are you">${placeOrder.map(p => `<button type="button" class="aw-b" data-aw-place="${esc(p)}"${mine && mine.place === p ? ' aria-pressed="true"' : ''}>${esc(p)}</button>`).join('')}</div>
${picked ? `<p class="aw-step">2. What next? <span class="note">(optional)</span></p><div class="aw-grid aw-next" role="group" aria-label="What next">${NEXT.map(n => `<button type="button" class="aw-b" data-aw-next="${esc(n)}"${mine && mine.next === n ? ' aria-pressed="true"' : ''}>${esc(n)}</button>`).join('')}</div>
<div class="aw-until" role="group" aria-label="Until">${UNTIL.map(([l, v]) => `<button type="button" class="ak-chip" data-aw-until="${v}">${esc(l)}</button>`).join('')}</div>
<form class="aw-note"><input type="text" maxlength="80" placeholder="A short note (optional, 80 characters)" aria-label="A short note" value="${esc(mine && mine.note || '')}"><button type="submit" class="cc-btn">Add</button></form>` : ''}
</section>
<section class="cc-card"><h3 class="ak-h3">The team</h3><ul class="aw-lines">${team.map(([p, r]) => row(p, r)).join('')}</ul><p class="note">A line fades after ${FADE_H} hours and reads "not seen since" after ${GONE_H}. Places only, from a short list: never an address, never the phone's location.</p></section>
<section class="cc-card"><h3 class="ak-h3">Now and next</h3><ul class="aw-items">${open.map(item).join('') || '<li class="note">Nothing open.</li>'}</ul>${done.length ? `<details class="aw-donel"><summary>Done (${done.length})</summary><ul class="aw-items">${done.map(item).join('')}</ul></details>` : ''}</section>
<details class="cc-card aw-how"><summary>How the two modes work</summary><ul>
<li><b>Local first.</b> This board is kept on this device and opens from it at once, with or without wifi. Your updates show straight away and wait in a queue.</li>
<li><b>Synced when online.</b> The queue is sent oldest first. Your newest update waits 5 seconds, so you can undo it.</li>
<li><b>Conflicts.</b> Each person writes only their own line, and the newest by its own time wins: an older update that arrives late never replaces a newer one. Collections, shifts and meetings are events (created, done, moved), so two people never overwrite each other.</li>
<li><b>In the real version</b> (after security's review), the queue goes to the team's private vault, signed with your key, and the board is read from the vaults. Nobody's place is ever in the repository or a public vault.</li></ul></details>
</section>`
        mountMap(L)
        if (!view.__aw) { view.__aw = true; view.addEventListener('click', onClick); view.addEventListener('submit', onSubmit); view.addEventListener('input', e => { if (e.target.closest('.aw-pinf')) pinLabel = e.target.value }) }
    }
    async function setMine(patch, fresh) {
        const cur = lines(all()).get(ME) || {}
        const q = S.queue.findLast ? S.queue.findLast(r => r.type === 'line' && r.person === ME) : [...S.queue].reverse().find(r => r.type === 'line' && r.person === ME)
        // a second tap amends the update still waiting; otherwise it is a new record
        if (!fresh && q && sending !== q.at) Object.assign(q, patch)
        else { const r = { type: 'line', person: ME, place: cur.place, next: fresh ? '' : cur.next, until: fresh ? '' : cur.until, note: fresh ? '' : cur.note, ...patch, at: new Date().toISOString() }; S.queue.push(r); undo = { at: r.at, t: Date.now() } }
        if (undo) undo.t = Date.now()
        await save(); draw()
    }
    async function onClick(e) {
        const b = e.target.closest('button'); if (!b || !view.contains(b)) return
        const d = b.dataset
        if (d.awPlace !== undefined) { S.recent = [d.awPlace, ...S.recent.filter(p => p !== d.awPlace)].slice(0, 6); picked = true; return setMine({ place: d.awPlace }, true) }
        if (d.awNext !== undefined) return setMine({ next: d.awNext })
        if (d.awUntil !== undefined) { const u = d.awUntil === 'eod' ? 'eod' : new Date(Date.now() + +d.awUntil * 6e4).toISOString(); return setMine({ until: u }) }
        if ('awUndo' in d) { if (undo) S.queue = S.queue.filter(r => r.at !== undo.at); undo = null; picked = false; await save(); return draw() }
        if (d.awDone) { await add({ type: 'done', id: d.awDone, at: new Date().toISOString() }); return draw() }
        if ('awOffline' in d) { S.offline = !S.offline; await save(); return draw() }
        if ('awPinAdd' in d) { pinMode = !pinMode; pending = null; return draw() }
        if ('awPinCancel' in d) { pinMode = false; pending = null; pinLabel = ''; return draw() }
        if (d.awPinKind !== undefined) { pinKind = d.awPinKind; return draw() }
        if (d.awPinDel) { S.pins = S.pins.filter(x => x.id !== d.awPinDel); await save(); return draw() }
        if (d.awPinGo) { const x = [...VENUES, ...S.pins].find(v => v.id === d.awPinGo); if (x && lmap) lmap.setView([x.lat, x.lng], 18); return }
        if ('awReset' in d) { await wipe(); S = null; undo = null; picked = false; sending = false; pinMode = false; pending = null; await load(); return draw() }
    }
    async function onSubmit(e) {
        if (e.target.closest('.aw-pinf')) {
            e.preventDefault(); const label = e.target.querySelector('input').value.trim().slice(0, 40)
            if (!label || !pending) return
            S.pins.push({ id: 'p' + Date.now().toString(36), label, kind: pinKind, lat: +pending.lat.toFixed(6), lng: +pending.lng.toFixed(6), at: new Date().toISOString(), by: ME })
            pinMode = false; pending = null; pinLabel = ''; e.target.querySelector('input').blur(); await save(); return draw()
        }
        if (!e.target.closest('.aw-note')) return
        e.preventDefault(); const v = e.target.querySelector('input').value.trim().slice(0, 80); e.target.querySelector('input').blur()
        await setMine({ note: v })
    }

    // app.js calls this whenever the view is shown (and after every shared render)
    function render(v, c) {
        view = v; ctx = c
        if (c.title) c.title.innerHTML = `${c.ownTitle('Where')}<small>the team, now and next</small>`
        if (!timer) {
            timer = setInterval(() => { if (!view || !view.isConnected) { clearInterval(timer); timer = null; return } tick(); if (undo && Date.now() - undo.t > UNDO_MS + 200 && Date.now() - undo.t < UNDO_MS + 1300) draw() }, 500)
        }
        if (!wired) { wired = true; setInterval(() => { if (view && view.isConnected && !sending) draw() }, 60000); addEventListener('online', draw); addEventListener('offline', draw) }
        if (!S) { v.innerHTML = '<p class="note">Opening the board kept on this device…</p>'; if (!loading) loading = load().then(draw); return }
        draw()
    }
    const api = { render, selfTest, lines, items, freshness, PLACES, DB }
    if (typeof module === 'object' && module.exports) module.exports = api
    else root.AngeloWhere = api
})(typeof self !== 'undefined' ? self : this)
