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
    load('kanban-core.js').catch(() => null).then(() => load('../../../assets/cc/app.js')).then(() => { if (root && window.AngeloKanban) start() })

    const clean = t => String(t ?? '').replace(/^"(.*)"$/, '$1')
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const ago = d => { const m = Math.round((Date.now() - new Date(d)) / 6e4); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }
    const ico = p => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`
    const KANBAN_ICON = 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z'
    const PHONE = matchMedia('(max-width: 767px)')

    function start() {
        const K = window.AngeloKanban
        let D = null, failed = ''
        const mine = () => /^#kanban(\?|$)/.test(location.hash)
        fetch(root.dataset.src || 'data.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : Promise.reject(new Error(r.status))).then(d => { D = d; if (mine()) draw() }).catch(e => { failed = e.message; if (mine()) draw() })

        // after every shared render (it rebuilds the shell): add the Kanban entry, and draw the kanban when it is asked for
        new MutationObserver(() => { nav(); if (mine()) draw() }).observe(root, { childList: true })
        window.addEventListener('keydown', e => { if (e.key === 'Escape' && mine() && K.parseState(location.hash).open) closeCard() })

        function nav() {
            const side = root.querySelector('.cc-nav [data-view="board"]')
            if (side && !root.querySelector('.cc-nav [data-view="kanban"]')) side.insertAdjacentHTML('afterend', `<a href="#kanban" data-view="kanban" title="Kanban">${ico(KANBAN_ICON)}<span class="lbl">Kanban</span></a>`)
            // phones: the Board tab opens the kanban (with My tasks off it is the whole team's board)
            const tab = root.querySelector('.cc-tabs a[href="#board"]')
            if (tab) { tab.setAttribute('href', '#kanban'); tab.lastChild.textContent = 'Kanban' }
            if (mine()) {
                root.querySelectorAll('.cc-nav [aria-current], .cc-tabs [aria-current]').forEach(a => a.removeAttribute('aria-current'))
                root.querySelectorAll('.cc-nav [data-view="kanban"], .cc-tabs a[href="#kanban"]').forEach(a => a.setAttribute('aria-current', 'page'))
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
            const view = root.querySelector('#cc-view'), title = root.querySelector('#cc-title')
            if (!view) return
            const first = D ? (D.person.name || D.person.id).split(' ')[0] : ''
            if (title) title.innerHTML = `Kanban<small>${esc(first)}'s command centre</small>`
            document.title = `Kanban · ${first}'s command centre`
            if (!D) { view.innerHTML = failed ? `<p class="note">The kanban could not load its data (${esc(failed)}); the summary below the page is the same data as text.</p>` : '<p class="note">Loading the board…</p>'; return }
            const s = state(), now = new Date(), ctx = D.kanban
            const shown = K.filter(D.issues, s, ctx, now)
            const needN = D.issues.filter(i => K.needsMe(i, ctx, now)).length
            view.innerHTML = `<div class="ak">
${toolbar(s, shown.length, needN)}
${chips(s)}
${shown.length ? board(shown, s, now) : `<div class="cc-card ak-empty"><p>No cards match this view.</p><button class="cc-btn" type="button" data-ak-reset>Back to my open tasks</button></div>`}
<p class="ak-fresh">As of ${esc(D.version)}, built ${esc(ago(D.built_at))}. Cards change on the next release, usually within minutes.</p>
</div>${s.open ? details(s.open, now) : ''}`
            bind(view, s)
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
            const ctx = D.kanban, p = K.pickers(i, ctx), gh = `https://github.com/${D.repo}/blob/${D.branch}/${i.file}`
            const row = (k, v) => v ? `<div><dt>${k}</dt><dd>${v}</dd></div>` : ''
            const hist = ctx.history[id] || [], ag = ctx.agenda[id] || []
            return `<div class="ak-scrim" data-ak-close></div><aside class="ak-sheet" role="dialog" aria-modal="true" aria-labelledby="ak-h" tabindex="-1">
<header><div><span class="ak-id">${esc(i.id)}</span><h2 id="ak-h">${esc(clean(i.title))}</h2></div><button type="button" class="cc-btn" data-ak-close>Close</button></header>
<dl class="ak-dl">${row('Status', esc(i.status))}${row('Owners', esc((i.for || []).join(', ')))}${row('Picked by', esc(i.picked_by || 'nobody yet'))}${row('Due', `${esc(i.due || 'no date')} (${esc(K.DUE_LABEL[K.dueBucket(i, now)].toLowerCase())})`)}${row('Workstream', esc(i.stream && ctx.streams[i.stream] ? ctx.streams[i.stream].name : 'none'))}${row('Area', esc(i.area))}${row('Last changed', ctx.changed[id] ? esc(ago(ctx.changed[id])) : '')}${row('Agents', esc(i.agents))}</dl>
<section><h3>The issue</h3><div class="ak-body" id="ak-body"><p class="note">Loading the full text…</p></div></section>
<section><h3>At the stand-ups</h3>${ag.length ? `<ul>${ag.map(a => `<li><a href="../../../${esc(a.page)}">${esc(a.title)}</a> <span class="note">${esc(a.type)}, ${esc(a.status)}${a.forMe ? ', for you' : ''} (${esc(a.meeting)})</span></li>`).join('')}</ul>` : '<p class="note">No stand-up item names this issue.</p>'}</section>
<section><h3>History</h3>${hist.length ? `<ul>${hist.map(c => `<li><a href="https://github.com/${esc(D.repo)}/commit/${esc(c.h)}">${esc(c.h)}</a> ${esc(c.s)} <span class="note">${esc(ago(c.at))}</span></li>`).join('')}</ul>` : '<p class="note">No commit in the last 30 days names this issue.</p>'}</section>
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
        window.addEventListener('popstate', () => { if (mine()) draw() })
        PHONE.addEventListener?.('change', () => { if (mine()) draw() })
        nav(); if (mine()) draw()
    }
})()
