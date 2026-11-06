// Angelo's command centre, front end (dev@web-summit.angelo, 4 November 2026; brief: BRIEF.md beside this file).
// It loads the shared front end (assets/cc/app.js), never a copy of it, and adds Angelo's views beside the shared ones:
// the shared app keeps its shell, views and routing; when the address is one of Angelo's views (#kanban…), this file
// draws into the shared #cc-view after each shared render. The kanban's rules are in kanban-core.js (tested at build).
(() => {
    'use strict'
    const here = document.currentScript ? document.currentScript.src : location.href
    const load = rel => new Promise((ok, no) => { const s = document.createElement('script'); s.src = new URL(rel, here).href; s.onload = ok; s.onerror = no; document.head.appendChild(s) })
    const root = document.getElementById('cc')
    // the kanban's rules first, then the shared app; if the rules fail to load, the shared app still runs
    // the data file is fetched once (WS-84: 385 KB on the venue's wifi): this file starts the request, and the shared
    // front end's own fetch of the same file is handed a copy of that one response instead of a second download
    const DATA = root ? new URL(root.dataset.src || 'data.json', location.href).href : ''
    const once = DATA ? fetch(DATA, { cache: 'no-cache' }) : null
    if (once) {
        const orig = window.fetch
        window.fetch = function (u, o) {
            let url = ''; try { url = new URL(typeof u === 'string' ? u : u.url, location.href).href } catch { }
            if (url === DATA) { window.fetch = orig; return once.then(r => r.clone()) }
            return orig.apply(this, arguments)
        }
    }
    load('kanban-core.js').catch(() => null).then(() => load('replay.js').catch(() => null)).then(() => load('../../../assets/cc/app.js')).then(() => { if (root && window.AngeloKanban) start() })

    // ---------- offline (WS-84 step 1, at Angelo's go): sw.js stores this page and what it loads ----------
    // ?offline=off unregisters the worker and deletes its store (remembered in this browser); ?offline=on turns it back on
    const OFF_KEY = 'ak.offline', q = new URLSearchParams(location.search).get('offline')
    const lsGet = k => { try { return localStorage.getItem(k) } catch { return null } }, lsSet = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch { } }
    if (q === 'off') lsSet(OFF_KEY, 'off'); if (q === 'on') lsSet(OFF_KEY, null)
    const SW = 'serviceWorker' in navigator ? navigator.serviceWorker : null
    const scope = new URL('./', here).href
    if (SW && lsGet(OFF_KEY) === 'off') {
        // the worker still serving this page is told first (it stops storing and deletes its store), then removed
        if (SW.controller) SW.controller.postMessage({ type: 'forget' })
        SW.getRegistrations().then(rs => Promise.all(rs.filter(r => r.scope === scope).map(r => r.unregister())))
            .then(() => self.caches ? caches.keys() : []).then(ks => Promise.all(ks.filter(k => k.startsWith('ak-offline-')).map(k => caches.delete(k)))).catch(() => null)
    } else if (SW) {
        SW.register(new URL('sw.js', here).href, { scope }).then(() => SW.ready).then(reg => {
            // store everything this first visit loaded, so the page opens next time without a connection
            const urls = [location.href, DATA, ...performance.getEntriesByType('resource').map(e => e.name)]
            ;(reg.active || reg.waiting || reg.installing).postMessage({ type: 'keep', urls })
        }).catch(() => null)
    }
    // the copy this page shows: when the data came from the store, say so above every view
    if (once) once.then(r => {
        const at = r.headers.get('x-ak-stored'); if (!at || !root) return
        const when = new Date(at), t = when.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
        root.insertAdjacentHTML('beforebegin', `<div class="ak-offbar" role="status">Offline: the copy from ${t} (${Math.max(1, Math.round((Date.now() - when) / 6e4))} min ago). It refreshes when you are back online.</div>`)
    }).catch(() => null)

    const clean = t => String(t ?? '').replace(/^"(.*)"$/, '$1')
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const ago = d => { const m = Math.round((Date.now() - new Date(d)) / 6e4); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }
    const ico = p => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`
    const KANBAN_ICON = 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z'
    const REPLAY_ICON = 'M4 5h16v14H4zM10 9l5 3-5 3z'
    const SUMMIT_ICON = 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h3v3H8z'
    const TEAM_ICON = 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.1a4 4 0 0 1 0 7.8M22 21v-1a6 6 0 0 0-4-5.6'
    const PHONE = matchMedia('(max-width: 767px)')

    function start() {
        const K = window.AngeloKanban
        let D = null, failed = ''
        const route = () => (location.hash.match(/^#(kanban|collab|summit|replay)(\?|$)/) || [])[1] || ''
        const mine = () => !!route()
        once.then(r => r.ok ? r.clone().json() : Promise.reject(new Error(r.status))).then(d => { D = d; nav(); loadCockpit(); if (mine()) draw() }).catch(e => { failed = e.message; if (mine()) draw() })

        // after every shared render (it rebuilds the shell): add the Kanban entry, and draw the kanban when it is asked for
        new MutationObserver(() => { nav(); if (mine()) draw() }).observe(root, { childList: true })
        window.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (route() === 'kanban' && K.parseState(location.hash).open) closeCard(); if (route() === 'collab' && cstate().p) closePerson() })

        const ownName = () => D ? `${(D.person.name || D.person.id).split(' ')[0]}'s own` : 'Your own'
        const OWN_TIP = 'Only in this command centre: the team\'s shared command centre does not have it'
        // the mark by a view's title, and its explanation, shown once until dismissed
        const ownTitle = t => `${esc(t)} <span class="ak-own" title="${esc(OWN_TIP)}">✦<span class="ak-own-t"> ${esc(ownName())}</span></span>`
        const ownNote = () => { let seen = false; try { seen = localStorage.getItem('ak.ownSeen') === '1' } catch { } return seen ? '' : `<div class="ak-ownnote" role="note"><span><b>✦ ${esc(ownName())}</b> marks the views only in this command centre: Kanban, Team and the machine, Summit days, Replay. The rest are the team's shared views.</span><button type="button" class="cc-btn" data-ak-ownok>Got it</button></div>` }
        root.addEventListener('click', e => { if (e.target.closest('[data-ak-ownok]')) { try { localStorage.setItem('ak.ownSeen', '1') } catch { } const n = root.querySelector('.ak-ownnote'); if (n) n.remove() } })
        function nav() {
            const side = root.querySelector('.cc-nav [data-view="board"]')
            // the views only in this command centre, in a group of their own, each with the same mark (Angelo, 5 November)
            if (side && !root.querySelector('.cc-nav [data-view="kanban"]')) { const grp = [...root.querySelectorAll('.cc-nav .grp')].find(g => /connect/i.test(g.textContent)); (grp || side).insertAdjacentHTML(grp ? 'beforebegin' : 'afterend', `<span class="grp ak-grp" title="${esc(OWN_TIP)}">✦ ${esc(ownName())}</span><a href="#kanban" data-view="kanban" title="Kanban">${ico(KANBAN_ICON)}<span class="ak-mk" aria-hidden="true">✦</span><span class="lbl">Kanban</span></a><a href="#collab" data-view="collab" title="Team and the machine">${ico(TEAM_ICON)}<span class="ak-mk" aria-hidden="true">✦</span><span class="lbl">Team and the machine</span></a><a href="#summit" data-view="summit" title="Summit days">${ico(SUMMIT_ICON)}<span class="ak-mk" aria-hidden="true">✦</span><span class="lbl">Summit days</span></a><a href="#replay" data-view="replay" title="Replay">${ico(REPLAY_ICON)}<span class="ak-mk" aria-hidden="true">✦</span><span class="lbl">Replay</span></a>`) }
            const g = root.querySelector('.cc-nav .ak-grp'); if (g) g.textContent = `✦ ${ownName()}`
            // phones: the Board tab opens the kanban (with My tasks off it is the whole team's board)
            const tab = root.querySelector('.cc-tabs a[href="#board"]')
            if (tab) { tab.setAttribute('href', '#kanban'); tab.lastChild.textContent = 'Kanban ✦'; tab.title = OWN_TIP }
            if (mine()) {
                root.querySelectorAll('.cc-nav [aria-current], .cc-tabs [aria-current]').forEach(a => a.removeAttribute('aria-current'))
                root.querySelectorAll(route() === 'kanban' ? '.cc-nav [data-view="kanban"], .cc-tabs a[href="#kanban"]' : `.cc-nav [data-view="${route()}"]`).forEach(a => a.setAttribute('aria-current', 'page'))
            }
        }

        // ---------- state: the address is the view; filter changes replace it, opening a card adds to history ----------
        const state = () => K.parseState(location.hash)
        function set(patch, push = false) {
            const h = K.stateToHash({ ...state(), ...patch })
            if (push) location.hash = h
            else { history.replaceState(history.state, '', location.pathname + location.search + h); draw() }
        }
        const closeCard = () => { if (history.state && history.state.akCard) history.back(); else set({ open: '' }) }

        // ---------- drawing ----------
        function draw() {
            if (route() === 'collab') return drawCollab()
            if (route() === 'summit') return drawSummit()
            if (route() === 'replay') return drawReplay()
            const view = root.querySelector('#cc-view'), title = root.querySelector('#cc-title')
            if (!view) return
            const first = D ? (D.person.name || D.person.id).split(' ')[0] : ''
            if (title) title.innerHTML = `${ownTitle('Kanban')}<small>${esc(first)}'s command centre</small>`
            document.title = `Kanban · ${first}'s command centre`
            if (!D) { view.innerHTML = failed ? `<p class="note">The kanban could not load its data (${esc(failed)}); the summary below the page is the same data as text.</p>` : '<p class="note">Loading the board…</p>'; return }
            const s = state(), now = new Date(), ctx = D.kanban
            const shown = K.filter(D.issues, s, ctx, now)
            const needN = D.issues.filter(i => K.needsMe(i, ctx, now)).length
            view.innerHTML = `<div class="ak">${ownNote()}
<nav class="ak-switch" aria-label="More views"><a href="#collab">Team and the machine → <span class="ak-mk" aria-hidden="true">✦</span></a><a href="#summit">Summit days → <span class="ak-mk" aria-hidden="true">✦</span></a><a href="#replay">Replay → <span class="ak-mk" aria-hidden="true">✦</span></a></nav>
${toolbar(s, shown.length, needN)}
${chips(s)}
${s.now ? decideFirst() : ''}
${shown.length ? board(shown, s, now) : `<div class="cc-card ak-empty"><p>No cards match this view.</p><button class="cc-btn" type="button" data-ak-reset>Back to my open tasks</button></div>`}
<p class="ak-fresh">As of ${esc(D.version)}, built ${esc(ago(D.built_at))}. Cards change on the next release, usually within minutes.${D.kanban.shallow ? ' This build had only part of the git history (a shallow clone), so last changes and histories may read short.' : ''}</p>
</div>${s.open ? details(s.open, now) : ''}`
            bind(view, s)
            if (s.now) mountCockpit()
            if (s.open) loadBody(s.open)
        }

        function toolbar(s, n, needN) {
            const sel = (name, value, opts, label) => `<label class="ak-sel"><span>${label}</span><select data-ak="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`
            const fields = Object.entries(K.FIELDS)
            const active = s.pick.length + s.due.length + s.ws.length + (s.q ? 1 : 0) + (sameList(s.st, K.DEFAULTS.st) ? 0 : 1)
            return `<div class="ak-bar">
<div class="ak-quick" role="group" aria-label="Quick filters">
  <button type="button" class="ak-tog" data-ak-tog="mine" aria-pressed="${s.mine}">My tasks</button>
  <button type="button" class="ak-tog" data-ak-tog="now" aria-pressed="${s.now}">Needs me now${needN ? ` <b>${needN}</b>` : ''}</button>
  <span class="ak-count">${n} card${n === 1 ? '' : 's'}</span>
</div>
<div class="ak-panels">
<details class="ak-panel"><summary>Filter${active ? ` <b>${active}</b>` : ''}</summary><div class="ak-pop">
  <label class="ak-q"><span>Search id, title and text</span><input type="search" data-ak="q" value="${esc(s.q)}" placeholder="e.g. key, WS-35"></label>
  ${checks('st', 'Status', K.STATUS_ORDER.map(x => [x, x.charAt(0).toUpperCase() + x.slice(1)]), s.st)}
  ${checks('due', 'Due', K.DUE_ORDER.map(x => [x, K.DUE_LABEL[x]]), s.due)}
  ${checks('pick', 'Picked by', [[D.kanban.me, 'Me (and my agents)'], ...Object.entries(D.kanban.people).filter(([id]) => id !== D.kanban.me).map(([id, nm]) => [id, nm]), ['nobody', 'Nobody yet'], ['other', 'Someone else']], s.pick)}
  ${checks('ws', 'Workstream', [...Object.entries(D.kanban.streams).map(([id, w]) => [id, w.name]), ['none', 'No workstream']], s.ws)}
  <button type="button" class="cc-btn" data-ak-reset>Reset to my open tasks</button>
</div></details>
<details class="ak-panel"><summary>Layout</summary><div class="ak-pop ak-layout">
  ${sel('col', s.col, fields, 'Columns')}
  ${sel('lane', s.lane, [['', 'None'], ...fields.filter(([v]) => v !== s.col)], 'Swim-lanes')}
  ${sel('sort', s.sort, Object.entries(K.SORTS), 'Sort by')}
  ${sel('dir', s.dir, [['asc', 'Ascending'], ['desc', 'Descending']], 'Order')}
</div></details>
</div></div>`
        }
        const sameList = (a, b) => a.slice().sort().join() === b.slice().sort().join()
        const checks = (name, label, opts, on) => `<fieldset class="ak-checks"><legend>${label}</legend>${opts.map(([v, l]) => `<label><input type="checkbox" data-ak-list="${name}" value="${esc(v)}"${on.includes(v) ? ' checked' : ''}> ${esc(l)}</label>`).join('')}</fieldset>`

        // what is on, as removable chips, so a filtered view never looks like an empty board
        function chips(s) {
            const c = []
            const name = (k, v) => k === 'st' ? v : k === 'due' ? K.DUE_LABEL[v] : k === 'pick' ? (v === D.kanban.me ? 'me' : v === 'nobody' ? 'nobody' : v === 'other' ? 'someone else' : D.kanban.people[v] || v) : v === 'none' ? 'no workstream' : (D.kanban.streams[v] || {}).name || v
            const label = { st: 'Status', due: 'Due', pick: 'Picked by', ws: 'Workstream' }
            for (const k of ['st', 'due', 'pick', 'ws']) if (s[k].length && !(k === 'st' && sameList(s.st, K.DEFAULTS.st))) c.push([k, `${label[k]}: ${s[k].map(v => name(k, v)).join(', ')}`])
            if (k0(s)) c.push(['q', `“${s.q}”`])
            return c.length ? `<div class="ak-chips">${c.map(([k, l]) => `<button type="button" class="ak-chip" data-ak-clear="${k}" aria-label="Remove ${esc(l)}">${esc(l)} <span aria-hidden="true">×</span></button>`).join('')}</div>` : ''
        }
        const k0 = s => !!(s.q || '').trim()

        function board(shown, s, now) {
            const ctx = D.kanban, cols = K.groups(shown, s.col, ctx, now)
            const lanes = s.lane ? K.groups(shown, s.lane, ctx, now) : [{ key: '', label: '', items: shown }]
            const cardsOf = (items) => K.sort(items, s.sort, s.dir, ctx, now).map(i => card(i, s, now)).join('')
            if (PHONE.matches) {
                const tab = cols.find(c => c.key === s.tab) || cols[0]
                return `<div class="ak-tabs" role="tablist" aria-label="${esc(K.FIELDS[s.col])}">${cols.map(c => `<button type="button" role="tab" data-ak-tab="${esc(c.key)}" aria-selected="${c.key === tab.key}">${esc(c.label)} <b>${c.items.length}</b></button>`).join('')}</div>
<div class="ak-list" role="tabpanel">${lanes.map(l => { const items = tab.items.filter(i => !s.lane || K.groupOf(i, s.lane, ctx, now) === l.key); return items.length ? `${s.lane ? `<h3 class="ak-lane">${esc(l.label)} <b>${items.length}</b></h3>` : ''}${cardsOf(items)}` : '' }).join('')}</div>`
            }
            return lanes.map(l => {
                const inLane = i => !s.lane || K.groupOf(i, s.lane, ctx, now) === l.key
                return `${s.lane ? `<h3 class="ak-lane">${esc(l.label)} <b>${l.items.length}</b></h3>` : ''}<div class="ak-grid" style="--n:${cols.length}">${cols.map(c => { const items = c.items.filter(inLane); return `<section class="ak-col" aria-label="${esc(c.label)}"><header>${esc(c.label)} <b>${items.length}</b></header>${cardsOf(items)}</section>` }).join('')}</div>`
            }).join('')
        }

        // one-click answers: the cockpit's own front end (assets/cockpit.js) draws its decide part here and signs, seals and
        // sends what Angelo clicks to his conductor's lane; this file only hosts it (window.WSCockpit.mount). Until the
        // cockpit offers that, the read-only list below stands in.
        let ckLoaded = false
        function loadCockpit() {
            if (ckLoaded || !D || !D.cockpit || D.cockpit.error) return; ckLoaded = true
            const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = new URL('../../../assets/cockpit.css', here).href; document.head.appendChild(css)
            window.WSCockpitConfig = { src: URL.createObjectURL(new Blob([JSON.stringify(D.cockpit)], { type: 'application/json' })), lanes: new URL('../../../assets/feedback.json', here).href, only: 'decide' }
            import(new URL('../../../assets/cockpit.js', here).href).then(() => { if (route() === 'kanban' && state().now) draw() }).catch(() => null)
        }
        const mountCockpit = () => { const el = root.querySelector('#ak-ck'); if (el && window.WSCockpit) window.WSCockpit.mount(el) }

        // the cockpit's ranking (admin/build/cockpit.mjs): what waits on Angelo's word, highest first, each with why
        function decideFirst() {
            const C = D.cockpit; if (!C) return ''
            if (window.WSCockpit && !C.error) return `<section class="ak-decide-live" aria-label="Decide first"><h3 class="ak-h3">Decide first</h3><div id="ak-ck"></div><p class="note">Your answers are signed with your key in this browser and sent to ${esc(C.lane.agent)}, which acts on them for tier 1 and 2 only.</p></section>`
            const list = [...(C.only_you || []), ...(C.decisions || [])].sort((a, b) => b.score - a.score)
            if (!list.length) return C.error ? `<p class="note">The ranking could not be built (${esc(C.error)}).</p>` : ''
            const item = x => `<li class="ak-dec"><span class="ak-score" title="The cockpit's score: higher is more urgent">${esc(x.score)}</span><div><span class="ak-meta"><span class="chip ${x.type === 'question' ? 't-blue' : x.type === 'decision' ? 't-orange' : 't-red'}">${esc(x.type === 'only-you' ? 'only you' : x.type)}</span>${x.issue ? `<a class="chip plain" href="#kanban?n=1&o=${esc(x.issue)}">${esc(x.issue)}</a>` : ''}</span><b class="ak-dt">${esc(clean(x.title))}</b>${x.why ? `<span class="ak-why">Why here: ${esc(x.why)}</span>` : ''}${x.recommend ? `<span class="note">Recommended: ${esc(x.recommend)}</span>` : ''}${x.meeting ? `<a class="note" href="../../../meetings/${esc(x.meeting)}/index.html">On the agenda since ${esc(x.meeting)}</a>` : ''}</div></li>`
            return `<section class="cc-card ak-decide" aria-label="Decide first"><h3 class="ak-h3">Decide first <b>${list.length}</b></h3><ol>${list.slice(0, 8).map(item).join('')}</ol>${list.length > 8 ? `<p class="note">and ${list.length - 8} more, lower down.</p>` : ''}<p class="note">Ranked by the cockpit (only you can do it, who it blocks, overdue, how long it has waited). One-click decide, delegate, now and later come next: signed with your key, sent to ${esc(C.lane.agent)}.</p></section>`
        }
        function card(i, s, now) {
            const ctx = D.kanban, due = K.dueBucket(i, now), p = K.pickers(i, ctx)
            const tone = { overdue: 't-red', today: 't-yellow', week: 't-blue' }[due] || 't-slate'
            const st = { open: 't-slate', picked: 't-blue', 'in progress': 't-yellow', done: 't-green' }[i.status] || 't-slate'
            const dec = (ctx.agenda[i.id] || []).find(a => a.forMe && a.status === 'open')
            const who = p.length ? p.map(x => x === ctx.me ? 'me' : x === 'other' ? 'someone else' : (ctx.people[x] || x).split(' ')[0]).join(', ') : ''
            return `<article class="ak-card${K.needsMe(i, ctx, now) ? ' ak-need' : ''}">
<button type="button" class="ak-open" data-ak-card="${esc(i.id)}"><span class="ak-id">${esc(i.id)}</span><span class="ak-title">${esc(clean(i.title))}</span></button>
<div class="ak-meta"><span class="chip ${st}">${esc(i.status)}</span><span class="chip ${tone}">${esc(i.recurring ? 'recurring' : i.due || 'no date')}</span>${who ? `<span class="chip plain">${esc(who)}</span>` : ''}${i.stream && ctx.streams[i.stream] ? `<span class="chip plain">${esc(ctx.streams[i.stream].name)}</span>` : ''}${dec ? `<a class="chip t-orange" href="../../../${esc(dec.page)}" title="${esc(dec.title)}">decision</a>` : ''}</div>
<p class="ak-for">For ${esc((i.for || []).join(', ') || 'nobody named')}</p>
</article>`
        }

        function details(id, now) {
            const i = D.issues.find(x => x.id === id)
            if (!i) return ''
            const ctx = D.kanban, p = K.pickers(i, ctx), gh = `${D.repo}/blob/${D.branch}/${i.file}`
            const row = (k, v) => v ? `<div><dt>${k}</dt><dd>${v}</dd></div>` : ''
            const hist = ctx.history[id] || [], ag = ctx.agenda[id] || []
            return `<div class="ak-scrim" data-ak-close></div><aside class="ak-sheet" role="dialog" aria-modal="true" aria-labelledby="ak-h" tabindex="-1">
<header><div><span class="ak-id">${esc(i.id)}</span><h2 id="ak-h">${esc(clean(i.title))}</h2></div><button type="button" class="cc-btn" data-ak-close>Close</button></header>
<dl class="ak-dl">${row('Status', esc(i.status))}${row('Owners', esc((i.for || []).join(', ')))}${row('Picked by', esc(i.picked_by || 'nobody yet'))}${row('Due', `${esc(i.due || 'no date')} (${esc(K.DUE_LABEL[K.dueBucket(i, now)].toLowerCase())})`)}${row('Workstream', esc(i.stream && ctx.streams[i.stream] ? ctx.streams[i.stream].name : 'none'))}${row('Area', esc(i.area))}${row('Last changed', ctx.changed[id] ? esc(ago(ctx.changed[id])) : '')}${row('Agents', esc(i.agents))}</dl>
<section><h3>The issue</h3><div class="ak-body" id="ak-body"><p class="note">Loading the full text…</p></div></section>
<section><h3>At the stand-ups</h3>${ag.length ? `<ul>${ag.map(a => `<li><a href="../../../${esc(a.page)}">${esc(a.title)}</a> <span class="note">${esc(a.type)}, ${esc(a.status)}${a.forMe ? ', for you' : ''} (${esc(a.meeting)})</span></li>`).join('')}</ul>` : '<p class="note">No stand-up item names this issue.</p>'}</section>
<section><h3>History</h3>${hist.length ? `<ul>${hist.map(c => `<li><a href="${esc(D.repo)}/commit/${esc(c.h)}">${esc(c.h)}</a> ${esc(c.s)} <span class="note">${esc(ago(c.at))}</span></li>`).join('')}</ul>` : '<p class="note">No commit in the last 30 days names this issue.</p>'}</section>
<section><h3>Messages</h3><p class="note">Messages about this task, and moving it, come with sealed sending (slices 3 and 4).</p></section>
<p><a class="cc-btn" href="${esc(gh)}">The file on GitHub</a></p>
</aside>`
        }

        // the issue's full text, fetched when its card is opened (the board's .md files are served by the site)
        const bodies = {}
        function loadBody(id) {
            const i = D.issues.find(x => x.id === id), el = () => root.querySelector('#ak-body')
            if (!i || !el()) return
            const show = t => { const e = el(); if (e) e.innerHTML = md(t, new URL('../../../' + i.file, location.href)) }
            if (bodies[id]) return show(bodies[id])
            fetch(new URL('../../../' + i.file, location.href), { cache: 'no-cache' }).then(r => r.ok ? r.text() : Promise.reject(new Error(r.status)))
                .then(t => { bodies[id] = t.replace(/^---\n[\s\S]*?\n---\n?/, ''); show(bodies[id]) })
                .catch(() => show(i.body || ''))
        }
        // a little markdown: paragraphs, lists, bold, code and links (http(s) or relative to the issue's file); the rest is text
        function md(t, base) {
            const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
                .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, u) => { let h; try { h = new URL(u.replace(/&amp;/g, '&'), base) } catch { return txt } return /^https?:$/.test(h.protocol) ? `<a href="${esc(h.href)}">${txt}</a>` : txt })
            return String(t || '').trim().split(/\n{2,}/).map(b => /^\s*[-*] /.test(b) ? `<ul>${b.split(/\n(?=\s*[-*] )/).map(x => `<li>${inline(x.replace(/^\s*[-*] /, ''))}</li>`).join('')}</ul>` : `<p>${inline(b).replace(/\n/g, '<br>')}</p>`).join('')
        }

        function bind(view, s) {
            view.querySelectorAll('[data-ak-tog]').forEach(b => b.onclick = () => set({ [b.dataset.akTog]: !s[b.dataset.akTog] }))
            view.querySelectorAll('select[data-ak]').forEach(x => x.onchange = () => { set({ [x.dataset.ak]: x.value, ...(x.dataset.ak === 'col' ? { tab: '', lane: s.lane === x.value ? '' : s.lane } : {}) }); reopen('Layout') })
            view.querySelectorAll('[data-ak-list]').forEach(x => x.onchange = () => { const k = x.dataset.akList; set({ [k]: [...view.querySelectorAll(`[data-ak-list="${k}"]:checked`)].map(c => c.value) }); reopen('Filter') })
            const q = view.querySelector('input[data-ak="q"]')
            if (q) { let t; q.oninput = () => { clearTimeout(t); t = setTimeout(() => { set({ q: q.value }); reopen('Filter', true) }, 250) } }
            view.querySelectorAll('[data-ak-clear]').forEach(b => b.onclick = () => set({ [b.dataset.akClear]: b.dataset.akClear === 'q' ? '' : K.DEFAULTS[b.dataset.akClear].slice() }))
            view.querySelectorAll('[data-ak-reset]').forEach(b => b.onclick = () => set({ ...K.DEFAULTS, st: K.DEFAULTS.st.slice(), pick: [], due: [], ws: [] }))
            view.querySelectorAll('[data-ak-tab]').forEach(b => b.onclick = () => set({ tab: b.dataset.akTab }))
            view.querySelectorAll('[data-ak-card]').forEach(b => b.onclick = () => { history.pushState({ akCard: true }, ''); set({ open: b.dataset.akCard }) })
            view.querySelectorAll('[data-ak-close]').forEach(b => b.onclick = closeCard)
            const sheet = view.querySelector('.ak-sheet'); if (sheet) sheet.focus()
        }
        // keep a panel open while its controls are used (each change redraws the view)
        function reopen(name, focusQ) {
            const d = [...root.querySelectorAll('#cc-view .ak-panel')].find(x => x.querySelector('summary').textContent.startsWith(name))
            if (d) d.open = true
            if (focusQ) { const q = root.querySelector('#cc-view input[data-ak="q"]'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length) } }
        }

        // ---------- the collaboration board (slice 5): everyone, people and agents, and the machine ----------
        const cstate = () => { const i = location.hash.indexOf('?'); const p = new URLSearchParams(i < 0 ? '' : location.hash.slice(i + 1)); return { p: p.get('p') || '', map: p.get('map') === '1', f: p.get('f') || '' } }
        const setC = c => { const q = []; if (c.map) q.push('map=1'); if (c.f) q.push('f=' + encodeURIComponent(c.f)); if (c.p) q.push('p=' + encodeURIComponent(c.p)); history.replaceState(history.state, '', location.pathname + location.search + '#collab' + (q.length ? '?' + q.join('&') : '')); drawCollab() }
        const openPerson = id => { history.pushState({ akCard: true }, ''); history.replaceState(history.state, '', location.pathname + location.search + '#collab?p=' + encodeURIComponent(id)); drawCollab() }
        const closePerson = () => { if (history.state && history.state.akCard) history.back(); else { history.replaceState(history.state, '', location.pathname + location.search + '#collab'); drawCollab() } }
        const initials = n => String(n).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
        // the next run, from the times a schedule names ("07:20, 12:20 and 17:20 UTC"): the next of them, today or tomorrow
        function nextRun(schedule, now = new Date()) {
            const times = [...String(schedule || '').matchAll(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g)].map(m => +m[1] * 60 + +m[2])
            if (!times.length) return null
            const mins = now.getUTCHours() * 60 + now.getUTCMinutes(), later = times.filter(t => t > mins).sort((a, b) => a - b)
            const t = later.length ? later[0] : Math.min(...times), wait = later.length ? t - mins : t + 1440 - mins
            const hm = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')} UTC`
            return { label: hm, wait: wait < 60 ? `in ${wait} min` : `in ${Math.round(wait / 60)} h` }
        }
        const lastAgo = l => l ? ago(l.replace(' ', 'T') + ':00Z') : 'no commit yet'
        const kanbanLink = id => `#kanban?m=0&t=open,picked,in%20progress,done&o=${encodeURIComponent(id)}`

        function drawCollab() {
            const view = root.querySelector('#cc-view'), title = root.querySelector('#cc-title')
            if (!view) return
            const first = D ? (D.person.name || D.person.id).split(' ')[0] : ''
            if (title) title.innerHTML = `${ownTitle('Team and the machine')}<small>${esc(first)}'s command centre</small>`
            document.title = `Team and the machine · ${first}'s command centre`
            if (!D || !D.collab) { view.innerHTML = failed ? `<p class="note">The board could not load its data (${esc(failed)}).</p>` : '<p class="note">Loading the team…</p>'; return }
            const C = D.collab, M = C.machine, name = id => (C.people.find(p => p.id === id) || { name: id }).name
            const max = Math.max(1, ...C.links.map(l => l.messages + l.shared))
            view.innerHTML = `<div class="ak">${ownNote()}
<nav class="ak-switch" aria-label="More views"><a href="#kanban">← Kanban <span class="ak-mk" aria-hidden="true">✦</span></a><a href="#summit">Summit days → <span class="ak-mk" aria-hidden="true">✦</span></a></nav>
<section class="ak-machine" aria-label="The machine">
  <div class="cc-card"><h3>Last release</h3>${M.release ? `<p class="ak-big">${esc(M.release.version)}</p><p class="note">${esc(M.release.date)}: ${esc(M.release.what)}</p><p class="note">A release exists only when the gate passed.</p>` : '<p class="note">No release recorded.</p>'}</div>
  <div class="cc-card"><h3>CI</h3><p class="note">This page cannot see CI runs or their failures; GitHub can.</p><p><a href="${esc(M.ci)}">The deploy runs on GitHub</a></p></div>
  <div class="cc-card"><h3>Agents and keys</h3><p class="ak-big">${M.active48h} <small>at work in 48 h, of ${M.agents}</small></p><p class="note">${M.activeWithKey} of them have a key on the keys page.</p>${M.activeWithoutKey.length ? `<details><summary>${M.activeWithoutKey.length} at work without a published key</summary><ul>${M.activeWithoutKey.map(n => `<li>${esc(n)}</li>`).join('')}</ul></details>` : ''}</div>
</section>
<section aria-label="People"><h3 class="ak-lane">People and their agents</h3><div class="ak-people">${C.people.map(p => {
                const runs = p.agents.map(a => nextRun(a.schedule)).filter(Boolean)
                const next = p.agents.map(a => ({ a, r: nextRun(a.schedule) })).filter(x => x.r).sort((x, y) => parseInt(x.r.wait) * (/h$/.test(x.r.wait) ? 60 : 1) - parseInt(y.r.wait) * (/h$/.test(y.r.wait) ? 60 : 1))[0]
                return `<button type="button" class="ak-person" data-ak-person="${esc(p.id)}"><span class="ak-av">${esc(initials(p.name))}</span><span class="ak-pn"><b>${esc(p.name)}</b><small>${esc(p.role)}</small></span><span class="ak-meta"><span class="chip ${p.level >= 4 ? 't-green' : p.level >= 2 ? 't-blue' : 't-slate'}">L${esc(p.level)}</span><span class="chip plain">${p.agents.length} agent${p.agents.length === 1 ? '' : 's'}</span>${p.work.length ? `<span class="chip t-yellow">${p.work.length} picked</span>` : ''}</span>${next ? `<small class="note">Next run: ${esc(next.a.name.split('@')[0])} ${esc(next.r.wait)}</small>` : runs.length ? '' : '<small class="note">No schedule recorded</small>'}</button>`
            }).join('')}</div></section>
${teamMap()}
<section aria-label="Who works with whom"><h3 class="ak-lane">Who works with whom</h3><p class="note">Messages: commits from one person's agents to another's (For: lines, last 7 days). Shared: open issues they both own.</p>
<ul class="ak-links">${C.links.slice(0, 14).map(l => `<li><span>${esc(name(l.a))} and ${esc(name(l.b))}</span><span class="ak-barw"><span class="ak-barf" style="width:${Math.round((l.messages + l.shared) / max * 100)}%"></span></span><small class="note">${l.messages} messages, ${l.shared} shared</small></li>`).join('')}</ul></section>
<p class="ak-fresh">As of ${esc(D.version)}, built ${esc(ago(D.built_at))}. Next runs are worked out in this browser from each agent's recorded schedule.</p>
</div>${cstate().p ? personSheet(cstate().p) : ''}`
            view.querySelectorAll('[data-ak-person]').forEach(b => b.onclick = () => openPerson(b.dataset.akPerson))
            const tm = view.querySelector('[data-tm-toggle]'); if (tm) tm.onclick = () => setC({ ...cstate(), map: !cstate().map, f: '' })
            view.querySelectorAll('[data-tm-f]').forEach(g => g.onclick = () => { const c = cstate(); setC({ ...c, f: c.f === g.dataset.tmF ? '' : g.dataset.tmF }) })
            view.querySelectorAll('[data-ak-close]').forEach(b => b.onclick = closePerson)
            const sh = view.querySelector('.ak-sheet'); if (sh) sh.focus()
        }

        // the whole team as one map (WS-97, Angelo's ask, 6 November): people on a ring, their agents fanned around them,
        // an arc for each pair that wrote to each other in the last 7 days (team-map.mjs's data); tap anyone to focus them
        const TM_COL = ['var(--rm-role-conductor)', 'var(--rm-role-dev)', 'var(--rm-gold)', 'var(--rm-role-video)', 'var(--rm-green)', 'var(--rm-role-outreach)', 'var(--rm-orange)', 'var(--rm-blue)', 'var(--rm-red)']
        function teamMap() {
            const c = cstate(), M = D.collab && D.collab.map
            const head = `<section class="cc-card tm" aria-label="The whole team as one map"><div class="tm-top"><h3 class="ak-h3">The whole team as one map</h3><button type="button" class="cc-btn" data-tm-toggle aria-pressed="${c.map}">${c.map ? 'Hide the map' : 'Show the map'}</button></div>`
            if (!c.map) return head + `<p class="note">Everyone and their agents, and who wrote to whom in the last 7 days${M && M.totals ? ` (${M.totals.people} people, ${M.totals.agents} agents, ${M.totals.messages} messages)` : ''}.</p></section>`
            if (!M || M.error) return head + `<p class="note">The map's data is missing from this build${M && M.error ? ` (${esc(M.error)})` : ''}.</p></section>`
            const S = 1000, C = S / 2, RP = 300, RA = 120, col = new Map(M.people.map((p, i) => [p.id, TM_COL[i % TM_COL.length]])), pos = new Map()
            M.people.forEach((p, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / M.people.length; pos.set(p.id, { x: C + RP * Math.cos(a), y: C + RP * Math.sin(a), a, kind: 'p', label: p.name.split(' ')[0], person: p.id }) })
            for (const p of M.people) {
                const mine = M.agents.filter(a => a.person === p.id), P = pos.get(p.id), spread = Math.min(Math.PI * 0.95, 0.16 * mine.length + 0.3)
                mine.forEach((a, k) => { const t = P.a + (mine.length > 1 ? -spread / 2 + k * spread / (mine.length - 1) : 0), rr = RA + (k % 2) * 34; pos.set(a.id, { x: P.x + rr * Math.cos(t), y: P.y + rr * Math.sin(t), kind: 'a', label: a.short, person: p.id, family: a.family, commits: a.commits, name: a.id.startsWith('pt:') ? `${a.short}, PrompTugal (${a.id.split(':')[1]})` : a.id }) })
            }
            const near = id => !c.f || id === c.f || (pos.get(id) || {}).person === c.f && !String(c.f).includes('@')
            const links = M.links.filter(l => pos.has(l.from) && pos.has(l.to))
            const max = Math.max(1, ...links.map(l => l.n))
            const path = l => { const a = pos.get(l.from), b = pos.get(l.to), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; return `M${a.x.toFixed(0)} ${a.y.toFixed(0)}Q${(mx + (C - mx) * 0.55).toFixed(0)} ${(my + (C - my) * 0.55).toFixed(0)} ${b.x.toFixed(0)} ${b.y.toFixed(0)}` }
            const lit = l => c.f && (l.from === c.f || l.to === c.f || (!c.f.includes('@') && ((pos.get(l.from) || {}).person === c.f || (pos.get(l.to) || {}).person === c.f)))
            const svg = `<svg class="tm-svg" viewBox="0 0 ${S} ${S}" role="img" aria-label="${M.totals.people} people and ${M.totals.agents} agents, and who wrote to whom">
<g class="tm-links">${links.map(l => `<path d="${path(l)}" stroke="${col.get((pos.get(l.from) || {}).person) || 'var(--rm-text-muted)'}" stroke-width="${(0.6 + 3.4 * Math.sqrt(l.n / max)).toFixed(2)}" class="${c.f ? (lit(l) ? 'on' : 'off') : ''}"><title>${esc((pos.get(l.from) || {}).name || l.from)} to ${esc((pos.get(l.to) || {}).name || (pos.get(l.to) || {}).label || l.to)}: ${l.n}</title></path>`).join('')}</g>
<g class="tm-nodes">${[...pos.entries()].map(([id, n]) => n.kind === 'p'
                ? `<g class="tm-p${c.f && !near(id) ? ' off' : ''}" data-tm-f="${esc(id)}" tabindex="0" role="button" aria-label="${esc(n.label)}"><circle cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="26" fill="${col.get(id)}"/><text x="${n.x.toFixed(0)}" y="${(n.y + 5).toFixed(0)}">${esc(n.label)}</text></g>`
                : `<g class="tm-a${c.f && !near(id) && !(c.f.includes('@') ? links.some(l => lit(l) && (l.from === id || l.to === id)) : false) ? ' off' : ''}" data-tm-f="${esc(id)}"><${n.family !== 'web-summit' ? 'rect' : 'circle'} ${n.family !== 'web-summit' ? `x="${(n.x - 7).toFixed(0)}" y="${(n.y - 7).toFixed(0)}" width="14" height="14" transform="rotate(45 ${n.x.toFixed(0)} ${n.y.toFixed(0)})"` : `cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="${(4 + Math.min(8, Math.sqrt(n.commits || 0))).toFixed(1)}"`} fill="${col.get(n.person)}"/><title>${esc(n.name)}: ${n.commits || 0} commits${n.family !== 'web-summit' ? ' (PrompTugal)' : ''}</title>${c.f && (n.person === c.f || id === c.f) ? `<text class="tm-al" x="${n.x.toFixed(0)}" y="${(n.y - 12).toFixed(0)}">${esc(n.label)}</text>` : ''}</g>`).join('')}</g></svg>`
            const L = M.left_out || {}
            return head + `<p class="note">${M.totals.people} people and ${M.totals.agents} agents active in the last ${M.days} days (${M.totals.promptugal} of them PrompTugal's, the diamonds), and ${M.totals.messages} messages; an arc is a pair that wrote to each other, wider for more. Tap a person or an agent to focus them${c.f ? `; focused on <b>${esc(c.f)}</b>, tap again to clear` : ''}.${L.agents ? ` Left out, not active: ${L.agents} agents${(L.people || []).length ? ` and ${esc(L.people.join(', '))}` : ''}.` : ''}</p><div class="tm-wrap">${svg}</div><p class="note">From team-collaboration@web-summit.angelo's team-map.mjs, built with this release.</p></section>`
        }

        function personSheet(id) {
            const C = D.collab, p = C.people.find(x => x.id === id)
            if (!p) return ''
            const name = x => (C.people.find(q => q.id === x) || { name: x }).name
            const links = C.links.filter(l => l.a === id || l.b === id)
            return `<div class="ak-scrim" data-ak-close></div><aside class="ak-sheet" role="dialog" aria-modal="true" aria-labelledby="ak-h" tabindex="-1">
<header><div><span class="ak-id">Level L${esc(p.level)}</span><h2 id="ak-h">${esc(p.name)}</h2><p class="note">${esc(p.role)}</p></div><button type="button" class="cc-btn" data-ak-close>Close</button></header>
<section><h3>Agents</h3>${p.agents.length ? `<ul class="ak-agents">${p.agents.map(a => { const r = nextRun(a.schedule); return `<li><b>${esc(a.name)}</b>${a.key ? ' <span class="chip t-green">key</span>' : ' <span class="chip t-slate">no key</span>'}<br>${a.job ? `<span>${esc(a.job)}</span><br>` : ''}<span class="note">Last commit ${esc(lastAgo(a.last))}, ${a.commits} in all${r ? `; next run ${esc(r.label)}, ${esc(r.wait)}` : a.schedule ? '' : '; no schedule recorded'}</span></li>` }).join('')}</ul>` : '<p class="note">No agent yet.</p>'}</section>
<section><h3>Picked and in progress</h3>${p.work.length ? `<ul>${p.work.map(w => `<li><a href="${kanbanLink(w.id)}">${esc(w.id)}</a> ${esc(clean(w.title))} <span class="note">${esc(w.status)}</span></li>`).join('')}</ul>` : '<p class="note">Nothing picked right now.</p>'}</section>
<section><h3>Works with</h3>${links.length ? `<ul>${links.map(l => `<li>${esc(name(l.a === id ? l.b : l.a))} <span class="note">${l.messages} messages, ${l.shared} shared issues</span></li>`).join('')}</ul>` : '<p class="note">No messages or shared issues recorded.</p>'}</section>
<section><h3>Send a message</h3><p class="note">Sealed messages to anyone come with slice 6, once sealed sending (slice 3) works.</p></section>
</aside>`
        }

        // ---------- summit days (slice 7): the public schedule the team sourced, and the stand-ups ----------
        const VIDEOS = [['Your AI has access. Does it have permission? (30 s)', 'riskmandate-access-permission-30s.mp4', 'access-21.jpg'], ['Reach, Mandate, Gap (53 s)', 'riskmandate-reach-mandate-gap.mp4', 'reach-14.jpg'], ['RiskMandate Stories: fifty new agents (2 min 44 s)', 'riskmandate-stories-fifty-new-agents.mp4', 'stories-6.jpg']]
        const DAYNAME = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
        const startMin = t => { const m = String(t || '').match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/); return m ? +m[1] * 60 + +m[2] : -1 }
        const endMin = t => { const m = String(t || '').match(/\b(?:[01]?\d|2[0-3])[:.][0-5]\d\s*[-–]\s*([01]?\d|2[0-3])[:.]([0-5]\d)\b/); return m ? +m[1] * 60 + +m[2] : -1 }
        const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
        const sstate = () => { const i = location.hash.indexOf('?'); return { day: new URLSearchParams(i < 0 ? '' : location.hash.slice(i + 1)).get('day') || '' } }
        const dayList = (S, today) => {
            const set = new Set(S.sessions.map(x => x.day))
            for (const x of S.side) for (let d = x.range.from; d <= x.range.to && d <= '2026-11-30'; d = new Date(Date.parse(d + 'T00:00:00Z') + 864e5).toISOString().slice(0, 10)) set.add(d)
            if (S.standups.from) for (let d = S.standups.from; d <= S.standups.until; d = new Date(Date.parse(d + 'T00:00:00Z') + 864e5).toISOString().slice(0, 10)) set.add(d)
            return [...set].filter(d => d >= today).sort()
        }
        function itemsOn(S, day) {
            const out = []
            if (S.standups.from && day >= S.standups.from && day <= S.standups.until) for (const t of S.standups.slots) {
                const id = `${day}-${t.replace(':', '')}`
                out.push({ kind: 'standup', title: 'Stand-up', start: startMin(t), end: startMin(t) + 30, time: `${t}`, place: 'the team call', what: 'Decisions first, then questions, ideas and syncs. Read your briefing before.', link: S.standups.meetings.includes(id) ? `../../../meetings/${id}/index.html` : '' })
            }
            for (const x of S.sessions.filter(x => x.day === day)) out.push({ kind: 'session', title: x.title, start: startMin(x.time), end: endMin(x.time), time: x.time.replace(/\s*\(Lisbon.*\)$/, ''), place: x.stage, who: x.speakers.join('; '), what: x.why, source: x.source })
            for (const x of S.side.filter(x => day >= x.range.from && day <= x.range.to)) { const multi = x.range.from !== x.range.to; out.push({ kind: 'side', title: x.title, start: multi ? -1 : startMin(x.when), end: multi ? -1 : endMin(x.when), time: multi ? `${DAYNAME(x.range.from)} to ${DAYNAME(x.range.to)}` : (x.when.split(',').slice(1).join(',').trim() || 'all day'), place: x.place, what: x.what, source: x.source }) }
            return out.sort((a, b) => a.start - b.start || a.title.localeCompare(b.title))
        }
        function drawSummit() {
            const view = root.querySelector('#cc-view'), title = root.querySelector('#cc-title')
            if (!view) return
            const first = D ? (D.person.name || D.person.id).split(' ')[0] : ''
            if (title) title.innerHTML = `${ownTitle('Summit days')}<small>${esc(first)}'s command centre</small>`
            document.title = `Summit days · ${first}'s command centre`
            if (!D || !D.summit_days) { view.innerHTML = failed ? `<p class="note">The schedule could not load (${esc(failed)}).</p>` : '<p class="note">Loading the schedule…</p>'; return }
            const S = D.summit_days, now = new Date(), today = now.toISOString().slice(0, 10), mins = now.getUTCHours() * 60 + now.getUTCMinutes()
            const days = dayList(S, today), day = days.includes(sstate().day) ? sstate().day : days[0]
            const items = day ? itemsOn(S, day) : []
            const live = day === today ? items.filter(x => x.start >= 0 && x.start <= mins && (x.end < 0 ? mins - x.start < 60 : mins < x.end)) : []
            const next = day === today ? items.find(x => x.start > mins) : null
            const tag = { standup: ['Stand-up', 't-conductor'], session: ['Session', 't-blue'], side: ['Side event', 't-orange'] }
            const row = x => `<article class="ak-card ak-ev${live.includes(x) ? ' ak-live' : ''}${next === x ? ' ak-next' : ''}"><div class="ak-evt"><b>${esc(x.start >= 0 ? hhmm(x.start) : '')}</b><small>${esc(x.start >= 0 ? x.time.replace(/^\d\d?[:.]\d\d\s*/, '') : x.time)}</small></div><div class="ak-evb"><span class="ak-meta"><span class="chip ${tag[x.kind][1]}">${tag[x.kind][0]}</span>${live.includes(x) ? '<span class="chip t-green">now</span>' : next === x ? '<span class="chip t-yellow">next</span>' : ''}</span><span class="ak-title">${x.link ? `<a href="${esc(x.link)}">${esc(x.title)}</a>` : esc(x.title)}</span>${x.place ? `<span class="note">${esc(x.place)}</span>` : ''}${x.who ? `<span class="note">${esc(x.who)}</span>` : ''}${x.what ? `<span>${esc(x.what)}</span>` : ''}${x.source ? `<a class="note" href="${esc(x.source)}">Source</a>` : ''}</div></article>`
            view.innerHTML = `<div class="ak">${ownNote()}
<nav class="ak-switch" aria-label="More views"><a href="#kanban">← Kanban <span class="ak-mk" aria-hidden="true">✦</span></a><a href="#collab">Team and the machine → <span class="ak-mk" aria-hidden="true">✦</span></a></nav>
${days.length ? `<div class="ak-tabs" role="tablist" aria-label="Days">${days.map(d => `<button type="button" role="tab" data-ak-day="${d}" aria-selected="${d === day}">${d === today ? 'Today' : esc(DAYNAME(d))}</button>`).join('')}</div>` : ''}
${day ? `<h3 class="ak-lane">${esc(DAYNAME(day))}${day === today ? ' (today)' : ''} <b>${items.length}</b></h3><p class="note">Times are Lisbon time, which is UTC in November.</p><div class="ak-list">${items.map(row).join('') || '<p class="note">Nothing on this day.</p>'}</div>` : '<p class="note">Nothing left on the schedule.</p>'}
<section class="cc-card ak-vids"><h3 class="ak-h3">The videos, for the stand</h3><p class="note">${VIDEOS.map(v => esc(v[0])).join(' · ')}. Keep them on this device to play them without wifi (about 21 MB).</p><div class="ak-vrow">${VIDEOS.map(([t, f, poster]) => `<video controls preload="none" playsinline src="../../../assets/video/${esc(f)}" poster="../../../assets/video/${esc(poster)}" aria-label="${esc(t)}"></video>`).join('')}</div><p><button type="button" class="cc-btn" data-ak-keepvids${navigator.serviceWorker ? '' : ' disabled'}>Keep the videos for offline</button> <span class="note" data-ak-vidnote>${navigator.serviceWorker ? '' : 'This browser cannot keep pages offline.'}</span></p></section>
<details class="cc-card ak-ess"><summary>Essentials: dates, venue, Night Summit, badges, getting there, wifi</summary><dl class="ak-dl">${S.essentials.map(([k, v]) => `<div><dt>${esc(k.replace(/_/g, ' '))}</dt><dd>${esc(v.value)} <a href="${esc(v.source)}">Source</a></dd></div>`).join('')}</dl></details>
<div class="cc-card"><h3 class="ak-h3">What this view knows</h3><p class="note">${esc(S.api)} Read on ${esc(S.read_on)}; the schedule is still growing.</p>${S.gaps.length ? `<ul class="note">${S.gaps.map(g => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}<p class="note">Your own meetings come later: each person's agent publishes a sealed summary of their calendar, with their consent (the brief, section 5).</p></div>
<p class="ak-fresh">As of ${esc(D.version)}, built ${esc(ago(D.built_at))}.</p>
</div>`
            const kv = view.querySelector('[data-ak-keepvids]')
            if (kv) kv.onclick = async () => {
                const note = view.querySelector('[data-ak-vidnote]'); kv.disabled = true; note.textContent = 'Keeping them…'
                try {
                    const reg = await navigator.serviceWorker.ready
                    navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'kept') { note.textContent = 'Kept: they play here without wifi.'; kv.disabled = false } }, { once: true })
                    reg.active.postMessage({ type: 'keep', urls: VIDEOS.flatMap(([, f, p]) => [new URL('../../../assets/video/' + f, location.href).href, new URL('../../../assets/video/' + p, location.href).href]) })
                } catch { note.textContent = 'Could not keep them here.'; kv.disabled = false }
            }
            view.querySelectorAll('[data-ak-day]').forEach(b => b.onclick = () => { history.replaceState(history.state, '', location.pathname + location.search + '#summit?day=' + b.dataset.akDay); drawSummit() })
            const sel = view.querySelector('[data-ak-day][aria-selected="true"]'); if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest', inline: 'center' })
        }
        // Replay (replay.js): the team's commits since 2 November, as a timeline you can filter and play back
        function drawReplay() {
            const view = root.querySelector('#cc-view'), title = root.querySelector('#cc-title')
            if (!view) return
            if (!D || !window.AngeloReplay) { view.innerHTML = failed ? `<p class="note">Replay could not load (${esc(failed)}).</p>` : '<p class="note">Loading Replay…</p>'; return }
            document.title = `Replay · ${(D.person.name || D.person.id).split(' ')[0]}'s command centre`
            window.AngeloReplay.render(view, { D, title, note: ownNote, ownTitle, ago })
        }
        window.addEventListener('popstate', () => { if (mine()) draw() })
        PHONE.addEventListener?.('change', () => { if (mine()) draw() })
        nav(); if (mine()) draw()
    }
})()
