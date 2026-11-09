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
    const PLACES = ['Stand', 'Centre Stage', 'Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Press room', 'MEO Arena', 'Pavilhão de Portugal', 'Oriente station', 'Vasco da Gama centre', 'Venue', 'Hotel', 'In town', 'Off']
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
    // venues, including the ability to set new pins with a label"; 7 November: "draw a stylized version of the relevant parts
    // of the map so that it's not too much info ... all contained in the same area"). A drawing, not tiles: OpenStreetMap's
    // own outlines of FIL and its pavilions, the MEO Arena, Pavilhão de Portugal, Oriente station and the Vasco da Gama
    // centre, the two main streets and the river, simplified by people/angelo/tools/venue-map.mjs into venue-map.js (data
    // only; it works offline, from the stored copy). The team's pins are places, never people: a person's line still names
    // a place, and the map counts who is at each.
    const HERE = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || (typeof location !== 'undefined' ? location.href : '')
    const AREA_OF = { 'Stand': 'osm-821643074', 'Hall 1': 'osm-821643074', 'Hall 2': 'osm-821643075', 'Hall 3': 'osm-821643076', 'Hall 4': 'osm-821643077', 'Centre Stage': 'osm-821784762', 'Venue': 'osm-821641463' }
    const PIN_KINDS = [['base', 'Our base'], ['meet', 'Meeting spot'], ['other', 'Other']]
    // mode: '' | 'me' (tap where you are) | 'pin' (tap where a new pin goes); fsMap: the map alone, full screen
    let pinMode = false, meMode = false, exactMode = false, offerExact = false, fsMap = false, pending = null, pinKind = 'meet', pinLabel = '', vmLoading = null, vmFail = false, focusId = ''
    const OFFMAP = ['Hotel', 'In town', 'Off']
    const VM = () => root.AngeloVenueMap || null
    function venueMap() {
        if (VM() || vmFail) return Promise.resolve(VM())
        return vmLoading = vmLoading || new Promise(ok => { const sc = document.createElement('script'); sc.src = new URL('venue-map.js', HERE).href; sc.onload = () => ok(VM()); sc.onerror = () => { vmFail = true; ok(null) }; document.head.appendChild(sc) }).then(m => { draw(); return m })
    }
    // lat/lng <-> the drawing's frame (the generator's projection, kept to its frame)
    const toXY = (f, lat, lng) => [((lng - f.w) / (f.e - f.w)) * f.width, ((f.n - lat) / (f.n - f.s)) * f.height]
    const toLL = (f, x, y) => ({ lat: f.n - (y / f.height) * (f.n - f.s), lng: f.w + (x / f.width) * (f.e - f.w) })
    const pinOf = (place, pins) => { const own = pins.find(x => x.label === place); if (own) return own.id; const M = VM(), a = M && M.areas.find(x => x.label === place); return a ? a.id : AREA_OF[place] || '' }
    function whoAt(L) { const by = {}; for (const [p, r] of L) { if (freshness(r, Date.now()) === 'gone') continue; const id = pinOf(r.place, S.pins); if (id) (by[id] = by[id] || []).push(NAMES[p] || p) } return by }
    function mapSection(L) {
        const M = VM(); if (!M && !vmFail) venueMap()
        const at = whoAt(L), f = M && M.frame, now = Date.now()
        const form = pending ? `<form class="aw-pinf"><input type="text" maxlength="40" required placeholder="Its label, e.g. Our base, Coffee by Pavilion 2" aria-label="The pin's label" value="${esc(pinLabel)}"><div class="aw-pink" role="group" aria-label="Kind">${PIN_KINDS.map(([k, l]) => `<button type="button" class="ak-chip" data-aw-pin-kind="${k}" aria-pressed="${pinKind === k}">${l}</button>`).join('')}</div><button type="submit" class="cc-btn">Save the pin</button><button type="button" class="ak-tog" data-aw-pin-cancel>Cancel</button></form>` : ''
        // the pin picked out: its name, and Remove, right under the map (no list)
        const fp = S.pins.find(x => x.id === focusId)
        const act = fp ? `<div class="aw-act" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0"><b>${esc(fp.label)}</b><span class="note">${esc((PIN_KINDS.find(k => k[0] === fp.kind) || [, ''])[1])}${(at[fp.id] || []).length ? ' · ' + esc(at[fp.id].join(', ')) : ''}</span><button type="button" class="ak-tog" data-aw-pin-del="${esc(fp.id)}">Remove this pin</button></div>` : ''
        // who is not on the map (the hotel, in town, off, or a place the map does not draw): one line, under the map
        const away = [...L.entries()].filter(([, r]) => freshness(r, now) !== 'gone' && r.lat == null && !pinOf(r.place, S.pins))
        const elsewhere = away.length ? `<p class="note" style="margin:6px 0"><b>Elsewhere:</b> ${away.map(([p, r]) => `${esc(NAMES[p] || p)} (${esc(r.place)})`).join(' · ')}</p>` : ''
        let svg = ''
        if (M) {
            const lab = (x, y, t, cls = '') => `<text class="vm-t ${cls}" x="${x}" y="${y}">${esc(t)}</text>`
            const areas = M.areas.map(a => `<path class="vm-a vm-${a.kind}${focusId && focusId !== a.id ? ' vm-dim' : ''}${focusId === a.id ? ' vm-on' : ''}" d="${a.d}" data-aw-focus="${esc(a.id)}" data-aw-area="${esc(a.label)}"><title>${esc(a.label)}</title></path>`).join('')
            const short = { 'Pavilion 1': 'P1', 'Pavilion 2': 'P2', 'Pavilion 3': 'P3', 'Pavilion 4': 'P4' }
            const labels = M.areas.map(a => a.kind === 'site' ? lab(a.c[0] + 115, a.c[1] - 150, 'FIL', 'vm-big') : short[a.label] ? lab(a.c[0], a.c[1] + 8, short[a.label] + (a.id === AREA_OF.Stand ? ' · our stand' : ''), 'vm-in') : lab(a.c[0], a.c[1] + (a.kind === 'arena' ? 8 : 4), a.label, a.kind === 'arena' ? 'vm-in' : 'vm-out')).join('')
            // people, by name, on the map: at the spot they tapped, or stacked beside the building their place names
            const chip = (x, y, t, cls) => { const w = 14 + t.length * 11.5; return `<g class="vm-who ${cls}"><rect x="${(x - w / 2).toFixed(1)}" y="${(y - 15).toFixed(1)}" width="${w.toFixed(1)}" height="28" rx="14"/><text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}">${esc(t)}</text></g>` }
            const stack = {}, people = []
            for (const [p, r] of L) {
                const fr = freshness(r, now); if (fr === 'gone') continue
                const cls = `${p === ME ? 'vm-me' : ''}${fr === 'old' ? ' vm-old' : ''}`, name = NAMES[p] || p
                if (r.lat != null) { const [x, y] = toXY(f, r.lat, r.lng); people.push(`<circle class="vm-spot ${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7"/>` + chip(x, y - 24, name, cls)); continue }
                const id = pinOf(r.place, S.pins), ar = M.areas.find(a => a.id === id), pn = S.pins.find(x => x.id === id)
                const base = ar ? [ar.c[0] + (ar.kind === 'hall' ? 125 : ar.kind === 'arena' ? 0 : 0), ar.c[1] + (ar.kind === 'hall' ? -4 : ar.kind === 'arena' ? -60 : -34)] : pn ? (([x, y]) => [x, y + 50])(toXY(f, pn.lat, pn.lng)) : null
                if (!base) continue
                const k = stack[id] = (stack[id] || 0) + 1
                people.push(chip(base[0], base[1] + (k - 1) * 32 * (ar && ar.kind === 'arena' ? -1 : 1), name, cls))
            }
            const streets = M.streets.map(st => `<path class="vm-s" d="${st.d}"/>`).join('') + M.streets.map(st => `<text class="vm-sl" transform="translate(${st.at[0] - 12} ${st.at[1] + 30}) rotate(${st.angle})">${esc(st.short)}</text>`).join('')
            const pins = S.pins.map(x => { const [px, py] = toXY(f, x.lat, x.lng); return `<g class="vm-pin vm-p-${x.kind}${focusId && focusId !== x.id ? ' vm-dim' : ''}" data-aw-focus="${esc(x.id)}"><path d="M${px} ${py}l-13 -24a15 15 0 1 1 26 0z"/><circle cx="${px}" cy="${py - 34}" r="6" class="vm-dot"/><text class="vm-t vm-pl" x="${px}" y="${py + 24}">${esc(x.label)}</text></g>` }).join('')
            const ghost = pending ? (([px, py]) => `<circle class="vm-ghost" cx="${px}" cy="${py}" r="12"/>`)(toXY(f, pending.lat, pending.lng)) : ''
            const placing = pinMode || meMode || exactMode
            svg = `<div class="vm-wrap" style="margin:10px 0;border-radius:12px;overflow:hidden;background:#13263c${placing ? ';outline:3px dashed #f4c542;cursor:crosshair' : ''}${fsMap ? ';flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center' : ''}"><svg class="vm" style="display:block;width:100%;height:auto${fsMap ? ';max-height:100%' : ''}" viewBox="0 0 ${f.width} ${f.height}" role="img" aria-label="The venue: FIL and its pavilions, the MEO Arena, Pavilhão de Portugal, Oriente station and the Vasco da Gama centre, by the river, with the team on it" data-aw-map>
<style>
.vm-r{fill:#1e4a78;opacity:.55}.vm-rl{fill:#9cc3ea;font:600 22px/1 system-ui,sans-serif;text-anchor:middle;letter-spacing:.2em;opacity:.8}
.vm-s{fill:none;stroke:#7d93ad;stroke-width:9;stroke-linecap:round;stroke-linejoin:round;opacity:.35}.vm-sl{fill:#9fb3c9;font:500 19px/1 system-ui,sans-serif;opacity:.9}
.vm-a{stroke:#c9d6e3;stroke-width:2;cursor:pointer;transition:opacity .2s}.vm-site{fill:#22405f;stroke-dasharray:6 5}.vm-hall{fill:#2f6aa3}.vm-arena{fill:#7a5cc4}.vm-landmark{fill:#4b5f78}.vm-station{fill:#4b5f78}
.vm-a.vm-on{stroke:#fff;stroke-width:4}.vm-dim{opacity:.35}
.vm-t{fill:#eef3f8;font:600 23px/1 system-ui,sans-serif;text-anchor:middle;pointer-events:none;paint-order:stroke;stroke:#0d1b2a;stroke-width:4px}.vm-big{font-size:26px;letter-spacing:.15em;fill:#c9d6e3}.vm-out{font-size:21px}
.vm-pin{cursor:pointer}.vm-pin path{stroke:#0d1b2a;stroke-width:3}.vm-p-base path{fill:#f4c542}.vm-p-meet path{fill:#5fb2f5}.vm-p-other path{fill:#b9a4f0}.vm-dot{fill:#0d1b2a}.vm-pl{font-size:21px}
.vm-who{pointer-events:none}.vm-who rect{fill:#eef3f8;stroke:#0d1b2a;stroke-width:2}.vm-who text{fill:#0d1b2a;font:700 19px/1 system-ui,sans-serif;text-anchor:middle}
.vm-who.vm-me rect{fill:#f4c542}.vm-old{opacity:.55}.vm-spot{fill:#eef3f8;stroke:#0d1b2a;stroke-width:3}.vm-spot.vm-me{fill:#f4c542}
.vm-ghost{fill:none;stroke:#f4c542;stroke-width:4;stroke-dasharray:5 4}
</style>
<path class="vm-r" d="${M.river}"/><text class="vm-rl" x="${f.width - 70}" y="${f.height / 2}" transform="rotate(-90 ${f.width - 70} ${f.height / 2})">Tagus (Tejo)</text>
${streets}${areas}${labels}${pins}${people.join('')}${ghost}</svg></div>`
        }
        const hint = exactMode ? 'Tap your exact spot. It is kept for this update only; your next update is a zone again.' : meMode ? 'Tap the building or the area you are in.' : pinMode ? (pending ? 'Name the pin.' : 'Tap where the pin goes.') : ''
        const fsStyle = fsMap ? ' style="position:fixed;inset:0;z-index:300;margin:0;border-radius:0;display:flex;flex-direction:column;overflow:auto;padding:12px 16px"' : ''
        return `<section class="cc-card aw-map"${fsStyle}><div class="aw-maph" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between"><h3 class="ak-h3">The venue map</h3><span style="display:flex;flex-wrap:wrap;gap:8px">
<button type="button" class="ak-tog" data-aw-me aria-pressed="${meMode}">📍 I'm here</button><button type="button" class="ak-tog" data-aw-pin-add aria-pressed="${pinMode}">＋ Add a pin</button><button type="button" class="ak-tog" data-aw-fs aria-pressed="${fsMap}">${fsMap ? '✕ Close' : '⛶ Full screen'}</button></span></div>
${hint ? `<p class="note" style="margin:6px 0"><b>${hint}</b> <button type="button" class="aw-x" style="background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer" data-aw-pin-cancel>Cancel</button></p>` : ''}
${offerExact && !meMode && !exactMode ? `<p class="note" style="margin:4px 0">Set as a zone. <button type="button" class="ak-chip" data-aw-exact>📌 Pin my exact spot (this time only)</button></p>` : ''}
${meMode ? `<p class="note" style="margin:4px 0">Not at the venue? ${OFFMAP.map(o => `<button type="button" class="ak-chip" data-aw-place="${esc(o)}">${esc(o)}</button>`).join(' ')}</p>` : ''}
${M ? svg : vmFail ? '<p class="note">The map could not load (offline, and not stored yet).</p>' : '<p class="note">Drawing the map…</p>'}${form}${act}${elsewhere}
${fsMap ? '' : `<p class="note">A drawing of the venue, simplified from <a href="https://www.openstreetmap.org/#map=17/38.7700/-9.0960">OpenStreetMap</a> (map data © OpenStreetMap contributors, ODbL). Names on the map are where each of us said we are (you in gold); tap a building or a pin to pick it out. Pins: gold for a base, blue for a meeting spot. Only what you tap: the phone's location is never asked for.</p>`}</section>`
    }
    function mountMap() { }
    function mapClick(e) {
        const svg = e.target.closest('svg[data-aw-map]'); if (!svg || !(pinMode || meMode || exactMode)) return false
        const M = VM(); if (!M) return false
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse())
        // zones by default, an exact spot only by a person's choice, each time (Angelo, 7 November, option C, 592d1096)
        const nearest = () => M.areas.filter(a => a.kind !== 'site').map(a => [a, Math.hypot(a.c[0] - q.x, a.c[1] - q.y)]).sort((x, y) => x[1] - y[1])[0][0]
        if (meMode) {
            // a building (not FIL's outline: its pavilions are what count) names the place; anywhere else, the zone of the
            // nearest building, with no coordinates
            const ar = e.target.closest('[data-aw-area]'), area = ar && ar.dataset.awArea !== 'FIL' ? ar.dataset.awArea : ''
            meMode = false; picked = true; offerExact = true
            setMine({ place: area || 'Near ' + nearest().label, lat: null, lng: null }, true); return true
        }
        if (exactMode) {
            // the deliberate second step: this update only carries the spot; the next "I'm here" is a zone again
            const ll = toLL(M.frame, q.x, q.y), ar = e.target.closest('[data-aw-area]'), area = ar && ar.dataset.awArea !== 'FIL' ? ar.dataset.awArea : ''
            exactMode = false; offerExact = false
            setMine({ place: area || 'Near ' + nearest().label, lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) }); return true
        }
        pending = toLL(M.frame, q.x, q.y); draw(); const i = view.querySelector('.aw-pinf input'); if (i) i.focus()
        return true
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
<p class="aw-step">1. Where are you? <span class="note">Tap <b>📍 I'm here</b> on the map, then your building or area. An exact spot is a second step, only when you choose it.</span></p>
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
        if (mapClick(e)) return
        const fz = e.target.closest('[data-aw-focus]'); if (fz && view.contains(fz)) { focusId = focusId === fz.dataset.awFocus ? '' : fz.dataset.awFocus; return draw() }
        const b = e.target.closest('button'); if (!b || !view.contains(b)) return
        const d = b.dataset
        if (d.awPlace !== undefined) { S.recent = [d.awPlace, ...S.recent.filter(p => p !== d.awPlace)].slice(0, 6); picked = true; meMode = false; exactMode = false; offerExact = false; return setMine({ place: d.awPlace, lat: null, lng: null }, true) }
        if (d.awNext !== undefined) return setMine({ next: d.awNext })
        if (d.awUntil !== undefined) { const u = d.awUntil === 'eod' ? 'eod' : new Date(Date.now() + +d.awUntil * 6e4).toISOString(); return setMine({ until: u }) }
        if ('awUndo' in d) { if (undo) S.queue = S.queue.filter(r => r.at !== undo.at); undo = null; picked = false; await save(); return draw() }
        if (d.awDone) { await add({ type: 'done', id: d.awDone, at: new Date().toISOString() }); return draw() }
        if ('awOffline' in d) { S.offline = !S.offline; await save(); return draw() }
        if ('awPinAdd' in d) { pinMode = !pinMode; meMode = false; exactMode = false; offerExact = false; pending = null; return draw() }
        if ('awExact' in d) { exactMode = true; meMode = false; pinMode = false; return draw() }
        if ('awMe' in d) { meMode = !meMode; pinMode = false; exactMode = false; offerExact = false; pending = null; return draw() }
        if ('awFs' in d) { fsMap = !fsMap; document.body.style.overflow = fsMap ? 'hidden' : ''; return draw() }
        if ('awPinCancel' in d) { pinMode = false; meMode = false; exactMode = false; pending = null; pinLabel = ''; return draw() }
        if (d.awPinKind !== undefined) { pinKind = d.awPinKind; return draw() }
        if (d.awPinDel) { S.pins = S.pins.filter(x => x.id !== d.awPinDel); if (focusId === d.awPinDel) focusId = ''; await save(); return draw() }
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
        if (!wired) { wired = true; addEventListener('keydown', e => { if (e.key === 'Escape' && (fsMap || meMode || pinMode || exactMode)) { fsMap = false; meMode = false; pinMode = false; exactMode = false; pending = null; document.body.style.overflow = ''; draw() } }); setInterval(() => { if (view && view.isConnected && !sending) draw() }, 60000); addEventListener('online', draw); addEventListener('offline', draw) }
        if (!S) { v.innerHTML = '<p class="note">Opening the board kept on this device…</p>'; if (!loading) loading = load().then(draw); return }
        draw()
    }
    const api = { render, selfTest, lines, items, freshness, PLACES, DB }
    if (typeof module === 'object' && module.exports) module.exports = api
    else root.AngeloWhere = api
})(typeof self !== 'undefined' ? self : this)
