// Silvio's command centre (people/silvio/app/): the approved V4 design over real repository data.
// Reads data.json (built from board/WS-*.md, data/team.json, people/silvio/ and git history at every release).
// No credentials, no private data, no network calls beyond data.json; private services are reached by handing off
// to them (Gmail, Google Calendar, Claude), and the page says so. Kept by Silvio's agents.
(() => {
    'use strict'
    const root = document.getElementById('cc')
    if (!root) return
    const html = document.documentElement

    // ---------- small helpers ----------
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const store = {
        get(k, d) { try { const v = localStorage.getItem('cc.' + k); return v === null ? d : JSON.parse(v) } catch { return d } },
        set(k, v) { try { localStorage.setItem('cc.' + k, JSON.stringify(v)) } catch { /* private mode: the page still works */ } },
    }
    const $ = (s, el = document) => el.querySelector(s)
    const $$ = (s, el = document) => [...el.querySelectorAll(s)]
    const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const fmtTime = d => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const fmtDay = d => new Date(d).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
    const ago = d => { const m = Math.round((Date.now() - new Date(d)) / 6e4); return m < 1 ? 'now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }
    const rel = d => { const m = Math.round((new Date(d) - Date.now()) / 6e4), a = Math.abs(m), s = a < 60 ? `${a} min` : a < 1440 ? `${Math.round(a / 60)} h` : `${Math.round(a / 1440)} d`; return m >= 0 ? `in ${s}` : `${s} late` }
    const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString()

    // ---------- icons (inline, stroke) ----------
    const P = {
        home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
        tasks: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
        streams: 'M4 6h7v5H4zM13 6h7v5h-7zM4 13h7v5H4zM13 13h7v5h-7z',
        board: 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z',
        wait: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
        agents: 'M8 4h8v6H8zM12 10v3M6 13h12v7H6zM9 16h.01M15 16h.01',
        inbox: 'M3 6h18v12H3zM3 7l9 6 9-6',
        cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
        claude: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
        reports: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
        settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
        more: 'M5 12h.01M12 12h.01M19 12h.01',
        search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
        sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
        moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
        mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
        send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
        plus: 'M12 5v14M5 12h14',
        ext: 'M14 3h7v7M10 14L21 3M21 14v7H3V3h7',
        copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
        alert: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
        check: 'M20 6L9 17l-5-5',
        prog: 'M12 3a9 9 0 1 0 9 9',
        flag: 'M4 22V4M4 4h13l-2 4 2 4H4',
        x: 'M18 6L6 18M6 6l12 12',
        speak: 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
        github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-6.9a5.4 5.4 0 0 0-1.5-3.7 5 5 0 0 0-.1-3.8s-1.2-.4-3.9 1.5a13.4 13.4 0 0 0-7 0C6.3 1.6 5.1 2 5.1 2a5 5 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.5 6.4 6.9a3.4 3.4 0 0 0-.9 2.6V22',
        back: 'M15 18l-6-6 6-6',
    }
    const ico = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`

    // ---------- theme: dark by default, light designed ----------
    const applyTheme = () => {
        const pref = store.get('theme', 'dark')
        const t = pref === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : pref
        html.setAttribute('data-theme', t)
    }
    html.classList.add('cc-on'); applyTheme()

    // ---------- data ----------
    let D = null
    const ME = 'silvio'
    const streamOf = id => D.workstreams.find(w => w.id === id)
    const STREAM_TONE = { outreach: 'outreach', video: 'video', local: 'procurement', sponsor: 'local', pm: 'conductor', team: 'slate' }
    const streamName = id => id === 'team' ? 'Team-wide' : (streamOf(id) || {}).name || 'Other'

    // urgency is derived from the due date (the board has no priority field) and the page says so
    const urgency = i => {
        if (i.status === 'done') return { k: 'done', label: 'Done', tone: 'green' }
        if (i.recurring) return { k: 'ongoing', label: 'Daily', tone: 'blue' }
        if (!i.due_at) return { k: 'none', label: 'No date', tone: 'slate' }
        const h = (new Date(i.due_at) - Date.now()) / 36e5
        if (h < 0) return { k: 'overdue', label: 'Overdue', tone: 'red' }
        if (h <= 24) return { k: 'p1', label: 'Due in 24 h', tone: 'red' }
        if (h <= 72) return { k: 'soon', label: 'Due soon', tone: 'orange' }
        return { k: 'later', label: 'Later', tone: 'slate' }
    }
    const STATUS = { open: ['To do', 'slate'], picked: ['In progress', 'blue'], blocked: ['Waiting', 'yellow'], done: ['Done', 'green'] }
    const statusOf = i => STATUS[i.status] || [i.status, 'slate']
    const pickedByMe = i => /silvio/i.test(i.picked_by)
    const waitingOn = i => i.status === 'blocked' ? 'blocked (see the issue)' : (i.status === 'picked' && i.picked_by && !pickedByMe(i)) ? i.picked_by : ''
    const firstPara = b => (b || '').split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '')
    const ghBlob = f => `${D.repo}/blob/${D.branch}/${f}`
    const ghEdit = f => `${D.repo}/edit/${D.branch}/${f}`
    // board bodies link relative to /briefs/; this page sits three levels down
    const mdInline = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${esc(/^https?:/.test(u) ? u : u.replace(/^\.\.\//, '../../../'))}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`)
    const md = s => (s || '').split(/\n\s*\n/).map(p => /^\s*([-*]|\d+\.) /.test(p) ? `<ul>${p.split('\n').map(l => `<li>${mdInline(l.replace(/^\s*([-*]|\d+\.) /, ''))}</li>`).join('')}</ul>` : `<p>${mdInline(p)}</p>`).join('')

    const named = () => D.issues.filter(i => i.named)
    const openNamed = () => named().filter(i => i.status !== 'done')

    // ---------- state ----------
    const S = { view: 'home', scope: store.get('scope', 'named'), stream: 'all', status: 'all', window: 'all', q: '', boardScope: 'mine', boardCol: 'open', voiceLang: store.get('lang', 'en-GB') }
    const VIEWS = [
        ['home', 'Command centre', 'home'], ['tasks', 'My tasks', 'tasks'], ['streams', 'Workstreams', 'streams'], ['board', 'Team board', 'board'],
        ['waiting', 'Waiting and decisions', 'wait'], ['agents', 'My agents', 'agents'], ['inbox', 'Inbox and email', 'inbox'], ['calendar', 'Calendar', 'cal'],
        ['ask', 'Ask Claude', 'claude'], ['reports', 'Reports', 'reports'], ['settings', 'Settings', 'settings'],
    ]
    const counts = () => {
        const o = openNamed(), u = o.map(urgency)
        return {
            open: o.length, overdue: u.filter(x => x.k === 'overdue').length, soon: u.filter(x => x.k === 'p1' || x.k === 'soon').length,
            picked: o.filter(i => i.status === 'picked').length, waiting: o.filter(i => waitingOn(i)).length + D.decisions.length,
            done: named().filter(i => i.status === 'done').length, total: named().length,
        }
    }

    // ---------- shell ----------
    function shell() {
        const c = counts()
        const badge = { tasks: c.overdue ? [c.overdue, 'red'] : [c.open, ''], waiting: [c.waiting, 'yellow'] }
        const navItem = ([id, label, icon]) => `<a href="#${id}" data-view="${id}"${S.view === id ? ' aria-current="page"' : ''} title="${esc(label)}">${ico(icon)}<span class="lbl">${esc(label)}</span>${badge[id] && badge[id][0] ? `<span class="badge ${badge[id][1]}">${badge[id][0]}</span>` : ''}</a>`
        root.innerHTML = `<div class="cc">
<div class="cc-layout">
  <aside class="cc-side" aria-label="Command centre">
    <div class="cc-brand"><span class="cc-mark" aria-hidden="true">R</span><div><b>RiskMandate</b><span>Silvio Command Center</span></div></div>
    <div class="cc-me"><span class="cc-avatar" aria-hidden="true">SS</span><div><b>${esc(D.person.name)}</b><span>${esc(D.person.role)}</span></div></div>
    <nav class="cc-nav" aria-label="Views">
      ${VIEWS.slice(0, 2).map(navItem).join('')}
      <span class="grp">Work</span>${VIEWS.slice(2, 6).map(navItem).join('')}
      <span class="grp">Connect</span>${VIEWS.slice(6, 9).map(navItem).join('')}
      <span class="grp">More</span>${VIEWS.slice(9).map(navItem).join('')}
    </nav>
    <div class="foot">Data ${esc(D.version)} · ${esc(ago(D.built_at))}<br><a href="../index.html">Classic dashboard</a> · <a href="../../../index.html">Site</a></div>
  </aside>
  <div class="cc-main">
    <header class="cc-top">
      <div class="title" id="cc-title"></div><div class="grow"></div>
      <form class="cc-search" role="search" id="cc-search"><label class="sr" for="cc-q">Search the board</label>${ico('search', '')}<input id="cc-q" type="search" placeholder="Search issues, WS-NN, people…" value="${esc(S.q)}"></form>
      <button class="cc-iconbtn" id="cc-theme" type="button" aria-label="Switch to ${html.dataset.theme === 'dark' ? 'light' : 'dark'} mode">${ico(html.dataset.theme === 'dark' ? 'sun' : 'moon', '')}</button>
      <div class="cc-today"><time id="cc-clock"></time><br><span>${esc(TZ)}</span></div>
    </header>
    <div class="cc-content" id="cc-view" tabindex="-1"></div>
    <div class="cc-ask" id="cc-askbar">
      <span class="wave" aria-hidden="true">${ico('mic', '')}</span>
      <div class="lbl"><b>Ask Claude</b><span>Voice or text, handed to Claude</span></div>
      <form id="cc-askform"><label class="sr" for="cc-askq">Ask Claude</label><input id="cc-askq" placeholder="Speak or type… e.g. “brief me for today”" autocomplete="off">
      <button class="cc-iconbtn cc-mic" type="button" data-mic="cc-askq" aria-pressed="false" aria-label="Dictate">${ico('mic', '')}</button>
      <button class="cc-btn gold" type="submit" aria-label="Prepare the prompt">${ico('send', '')}</button></form>
    </div>
  </div>
</div>
<nav class="cc-tabs" aria-label="Views">
  ${[['home', 'Home', 'home'], ['tasks', 'Tasks', 'tasks'], ['board', 'Board', 'board'], ['inbox', 'Inbox', 'inbox']].map(([id, l, i]) => `<a href="#${id}"${S.view === id ? ' aria-current="page"' : ''}>${ico(i, '')}${l}${id === 'tasks' && c.overdue ? `<span class="badge">${c.overdue}</span>` : ''}</a>`).join('')}
  <button type="button" id="cc-more"${['streams', 'waiting', 'agents', 'calendar', 'ask', 'reports', 'settings'].includes(S.view) ? ' aria-current="page"' : ''}>${ico('more', '')}More</button>
</nav>
</div>`
        $('#cc-theme').onclick = () => { store.set('theme', html.dataset.theme === 'dark' ? 'light' : 'dark'); applyTheme(); render() }
        $('#cc-search').onsubmit = e => { e.preventDefault(); S.q = $('#cc-q').value.trim(); S.scope = 'board'; go('tasks') }
        $('#cc-askform').onsubmit = e => { e.preventDefault(); S.askDraft = $('#cc-askq').value.trim(); go('ask') }
        $('#cc-more').onclick = moreSheet
        bindMics(root)
        tick()
    }
    const tick = () => { const el = $('#cc-clock'); if (el) el.textContent = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + fmtTime(Date.now()) }
    setInterval(tick, 30e3)

    // ---------- pieces ----------
    const chip = (label, tone, plain) => `<span class="chip t-${tone}${plain ? ' plain' : ''}">${esc(label)}</span>`
    const streamChip = id => id ? chip(streamName(id), STREAM_TONE[id] || 'slate') : ''
    const taskRow = (i, compact) => {
        const u = urgency(i), [sl, st] = statusOf(i), w = waitingOn(i)
        return `<button class="cc-task t-${u.tone}${compact ? ' compact' : ''}" type="button" data-issue="${esc(i.id)}">
<span class="bar"></span>
<span><span class="t"><span class="id">${esc(i.id)}</span>${esc(i.title)}</span>
<span class="meta">${streamChip(i.stream)}${chip(sl, st)}${u.k !== 'done' && u.k !== 'later' && u.k !== 'none' ? chip(u.label, u.tone) : ''}${i.picked_by ? `<span class="chip t-slate plain">Picked: ${esc(i.picked_by.slice(0, 40))}</span>` : `<span class="chip t-slate plain">Nobody picked</span>`}${w ? chip('Waiting on ' + w.slice(0, 30), 'yellow') : ''}</span>
<span class="dw">Done when: ${esc(firstPara(i.body))}</span></span>
<span class="due"><b>${esc(i.due ? i.due.replace(/^daily from /, 'daily · ') : 'no date')}</b>${i.due_at && !i.recurring && i.status !== 'done' ? esc(rel(i.due_at)) : ''}</span>
</button>`
    }
    const card = (title, inner, opts = {}) => `<section class="cc-card ${opts.cls || ''}" aria-labelledby="h-${opts.id || title.replace(/\W+/g, '')}"><header><h2 id="h-${opts.id || title.replace(/\W+/g, '')}">${esc(title)}</h2>${opts.more ? `<button class="more" type="button" data-go="${opts.more}">View all →</button>` : ''}${opts.extra || ''}</header>${inner}</section>`
    const empty = t => `<div class="cc-empty">${t}</div>`
    const srcLine = () => `<p class="cc-src"><span>Live from the repository: <a href="${D.repo}/tree/dev/board" target="_blank" rel="noopener">board/WS-*.md</a>, data/team.json, git history</span><span>Built ${esc(fmtDay(D.built_at))} ${esc(fmtTime(D.built_at))} (${esc(D.version)})</span><span>Urgency is derived from due dates: the board has no priority field</span></p>`

    // ---------- views ----------
    const V = {}
    V.home = () => {
        const c = counts(), o = openNamed().slice(0, 6)
        const hour = new Date().getHours(), greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
        const toSummit = Math.max(0, Math.ceil((new Date(D.summit.opening) - Date.now()) / 864e5))
        const kpi = (key, label, val, sub, tone, icon) => `<button class="cc-kpi" type="button" data-kpi="${key}"><span class="ic t-${tone}">${ico(icon, '')}</span><span><span class="lbl">${label}</span><span class="val num">${val}</span><span class="sub">${sub}</span></span></button>`
        return `
<section class="cc-hero"><div class="grow"><h1>${greet}, Silvio.</h1><p>${c.open} open issues named for you · ${c.soon} due within 72 hours · ${D.decisions.length} decisions waiting · <b>${toSummit} days</b> to Web Summit opening night.</p></div>
<div class="cc-actions"><button class="cc-btn gold" type="button" data-go="ask">${ico('claude', '')}Ask Claude</button><button class="cc-btn tint t-green" type="button" data-new>${ico('plus', '')}New task</button><button class="cc-btn tint t-conductor" type="button" data-go="board">${ico('board', '')}Team board</button><button class="cc-btn tint t-blue" type="button" data-go="waiting">${ico('wait', '')}Decisions</button></div></section>
<div class="cc-kpis">
${kpi('open', 'My tasks', c.open, `of ${c.total} named for me`, 'blue', 'tasks')}
${kpi('soon', 'Due in 72 h', c.soon, 'derived from due dates', 'orange', 'flag')}
${kpi('overdue', 'Overdue', c.overdue, c.overdue ? 'act today' : 'none late', 'red', 'alert')}
${kpi('picked', 'In progress', c.picked, 'status: picked', 'blue', 'prog')}
${kpi('waiting', 'Waiting / decisions', c.waiting, 'on others or on me', 'yellow', 'wait')}
${kpi('done', 'Completed', c.done, 'status: done', 'green', 'check')}
</div>
<div class="cc-grid">
${card("Today's priority tasks", o.length ? `<div class="cc-list">${o.map(i => taskRow(i, true)).join('')}</div>` : empty('Nothing open is named for you.'), { cls: 'cc-span-5', more: 'tasks', id: 'prio' })}
${card('Workstreams', streamsProgress(), { cls: 'cc-span-4', more: 'streams', id: 'ws' })}
${card('Inbox and email', inboxMini(), { cls: 'cc-span-3', more: 'inbox', id: 'inb' })}
${card("Today's agenda", agendaRows(Date.now(), true), { cls: 'cc-span-4', more: 'calendar', id: 'ag' })}
${card('Team activity', activityRows(8), { cls: 'cc-span-5', id: 'act', extra: `<span class="note" style="margin-left:auto">last 48 h, from git</span>` })}
${card('Decisions I need', decisionRows(4), { cls: 'cc-span-3', more: 'waiting', id: 'dec' })}
</div>${srcLine()}`
    }

    const filtered = () => {
        let l = S.scope === 'board' ? D.issues.slice() : S.scope === 'team' ? D.issues.filter(i => i.mine) : named()
        if (S.stream !== 'all') l = l.filter(i => i.stream === S.stream)
        if (S.status === 'active') l = l.filter(i => i.status !== 'done'); else if (S.status !== 'all') l = l.filter(i => i.status === S.status)
        if (S.window !== 'all') {
            const end = new Date(); end.setHours(23, 59, 59, 999)
            const lim = S.window === 'today' ? end : S.window === 'week' ? new Date(end.getTime() + 6 * 864e5) : null
            l = l.filter(i => i.status !== 'done' && (S.window === 'later' ? (i.due_at && new Date(i.due_at) > new Date(end.getTime() + 6 * 864e5)) : (i.due_at && new Date(i.due_at) <= lim) || urgency(i).k === 'overdue'))
        }
        if (S.q) { const q = S.q.toLowerCase(); l = l.filter(i => `${i.id} ${i.title} ${i.for.join(' ')} ${i.picked_by} ${i.area} ${i.body}`.toLowerCase().includes(q)) }
        return l
    }
    const seg = (key, opts) => `<div class="cc-seg" role="group" aria-label="${key}">${opts.map(([v, l]) => `<button type="button" data-set="${key}" data-val="${v}" aria-pressed="${S[key] === v}">${l}</button>`).join('')}</div>`
    V.tasks = () => {
        const l = filtered()
        return `<div class="cc-filters">
${seg('window', [['today', 'Today'], ['week', 'This week'], ['later', 'Upcoming'], ['all', 'All']])}
${seg('scope', [['named', 'Named for me'], ['team', '+ team-wide'], ['board', 'Whole board']])}
<label class="sr" for="f-stream">Workstream</label><select id="f-stream" data-sel="stream"><option value="all">All workstreams</option>${D.workstreams.map(w => `<option value="${w.id}"${S.stream === w.id ? ' selected' : ''}>${esc(w.name)}</option>`).join('')}<option value="team"${S.stream === 'team' ? ' selected' : ''}>Team-wide</option></select>
<label class="sr" for="f-status">Status</label><select id="f-status" data-sel="status">${[['all', 'Any status'], ['active', 'Not done'], ['open', 'To do'], ['picked', 'In progress'], ['blocked', 'Waiting'], ['done', 'Done']].map(([v, t]) => `<option value="${v}"${S.status === v ? ' selected' : ''}>${t}</option>`).join('')}</select>
${S.q ? `<button class="cc-btn ghost" type="button" data-clearq>${ico('x', '')}“${esc(S.q)}”</button>` : ''}
<span style="flex:1"></span><button class="cc-btn primary" type="button" data-new>${ico('plus', '')}New task</button></div>
<p class="note" aria-live="polite">${l.length} issue${l.length === 1 ? '' : 's'} · sorted by due date</p>
${l.length ? `<div class="cc-list">${l.map(i => taskRow(i)).join('')}</div>` : empty('No issue matches these filters. <button class="cc-btn ghost" type="button" data-reset>Reset filters</button>')}${srcLine()}`
    }

    const streamsProgress = () => `<div class="cc-prog">${D.workstreams.map(w => {
        const l = D.issues.filter(i => i.stream === w.id), d = l.filter(i => i.status === 'done').length, pct = l.length ? Math.round(d / l.length * 100) : 0
        const next = l.filter(i => i.status !== 'done')[0]
        return `<div class="p t-${STREAM_TONE[w.id]}"><span class="dot-ic">${esc(w.name[0])}</span><div><div class="name">${esc(w.name)}<small>${d} of ${l.length} done${next ? ` · next ${esc(next.id)} ${esc(next.due)}` : ''}</small></div><div class="cc-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(w.name)} progress"><i style="width:${Math.max(pct, 2)}%"></i></div></div><span class="pct num">${pct}%</span></div>`
    }).join('')}</div>`
    V.streams = () => `<div class="cc-grid">${D.workstreams.map(w => {
        const l = D.issues.filter(i => i.stream === w.id), ag = D.agents.find(a => a.name === w.agent)
        return card(w.name, `<p class="note" style="margin-bottom:10px">${esc(w.goal)}</p>
<div class="cc-filters" style="margin-bottom:12px">${chip('Agent: ' + w.agent.split('@')[0] + (ag ? ` (${ag.status})` : ''), ag && ag.status === 'active' ? 'green' : ag && ag.status === 'joined' ? 'blue' : 'slate')}${chip('With: ' + w.with, 'slate', true)}</div>
${l.length ? `<div class="cc-list">${l.map(i => taskRow(i, true)).join('')}</div>` : empty('No issues on the board yet.')}`, { cls: 'cc-span-6', id: 'w-' + w.id })
    }).join('')}</div>
${card('Ideas (no issues yet)', `<p class="note">“We need to pick Silvio's brain: what should we do that we aren't?” (your brief). One idea a day to the stand-up: <button class="cc-btn" type="button" data-prompt="idea">${ico('claude', '')}Draft an idea with Claude</button></p>`, { id: 'ideas' })}${srcLine()}`

    V.board = () => {
        const base = S.boardScope === 'mine' ? D.issues.filter(i => i.mine) : D.issues
        const cols = [['open', 'To do', 'slate'], ['picked', 'In progress', 'blue'], ['blocked', 'Waiting on someone', 'yellow'], ['done', 'Done', 'green']]
        return `<div class="cc-filters">${seg('boardScope', [['mine', 'Mine and team-wide'], ['all', 'Everyone (' + D.issues.length + ')']])}<span class="note">Status changes are made in the issue's file (edit on GitHub, or ask your agent): the board files stay the only source of truth.</span></div>
<div class="cc-seg cc-boardtabs" role="tablist" aria-label="Board column">${cols.map(([k, l]) => `<button type="button" role="tab" data-set="boardCol" data-val="${k}" aria-pressed="${S.boardCol === k}">${l} (${base.filter(i => i.status === k).length})</button>`).join('')}</div>
<div class="cc-board">${cols.map(([k, l, t]) => { const items = base.filter(i => i.status === k); return `<section class="cc-col${S.boardCol === k ? ' on' : ''}" aria-label="${l}"><h3>${chip(l, t)}<span class="n">${items.length}</span></h3>${items.length ? items.map(i => taskRow(i, true)).join('') : empty('Empty')}</section>` }).join('')}</div>${srcLine()}`
    }

    const decisionRows = n => `<div class="cc-rows">${D.decisions.slice(0, n || 99).map(x => `<div class="cc-row wide"><div class="what"><b>${esc(x.who)}:</b> ${esc(x.what)}<small>${x.issue ? esc(x.issue) + ' · ' : ''}<a href="../../../${esc(x.source.startsWith('board/') ? 'briefs/index.html#issues' : x.source)}">source</a> · waiting ${esc(ago(x.since).replace(' ago', ''))}</small></div><span class="chip t-${x.who === 'Silvio' ? 'orange' : 'yellow'}">${x.who === 'Silvio' ? 'On me' : 'On ' + esc(x.who)}</span></div>`).join('')}</div>`
    V.waiting = () => {
        const w = D.issues.filter(i => i.mine && waitingOn(i))
        const unpicked = openNamed().filter(i => !i.picked_by && ['overdue', 'p1', 'soon'].includes(urgency(i).k))
        return `<div class="cc-grid">
${card('Decisions I need', decisionRows() + `<p class="note" style="margin-top:10px">From the print order brief, the sponsor page, WS-101 and the team roster. Waiting time is counted from when each was raised; take this list to the 13:00 and 18:00 UTC stand-ups.</p>`, { cls: 'cc-span-6', id: 'dec2' })}
${card('Waiting on others', w.length ? `<div class="cc-list">${w.map(i => taskRow(i, true)).join('')}</div>` : empty('None of your issues is blocked or held by someone else right now.'), { cls: 'cc-span-6', id: 'won' })}
${card('Due soon and nobody has picked them', unpicked.length ? `<div class="cc-list">${unpicked.map(i => taskRow(i, true)).join('')}</div>` : empty('Every urgent issue has someone on it.'), { cls: 'cc-span-12', id: 'unp' })}
${card('Messages for me and my agents (48 h)', D.messages.length ? `<div class="cc-rows">${D.messages.map(m => `<div class="cc-row"><span class="when">${esc(fmtTime(m.at))}</span><span class="what">${esc(m.subject)}<small>${esc(m.agent)} · <a href="${D.repo}/commit/${esc(m.hash)}" target="_blank" rel="noopener">${esc(m.hash)}</a></small></span><span class="side">${esc(ago(m.at))}</span></div>`).join('')}</div>` : empty('No commit is addressed to you (For:) in the last 48 hours.'), { cls: 'cc-span-12', id: 'msg' })}
</div>${srcLine()}`
    }

    V.agents = () => `<p class="note">An agent is <b>active</b> when it has committed under its own name (the same rule as the site's inventory), <b>joined</b> when your onboarding records it joining, and <b>proposed</b> when it is in your brief or kit but not running yet.</p>
<div class="cc-agents">${D.agents.map(a => { const st = { active: 'green', joined: 'blue', proposed: 'slate' }[a.status]; return `<section class="cc-card cc-agent t-${a.colour}"><div class="hd"><span class="bot">${ico('agents', '')}</span><div><div class="nm">${esc(a.name)}</div><div class="st">${chip(a.status, st)}</div></div></div>
<p class="note">${esc(a.job)}</p><dl><dt>Schedule</dt><dd>${esc(a.schedule || 'not scheduled')}</dd><dt>Commits</dt><dd class="num">${a.commits_24h} in 24 h · ${a.commits_7d} in 7 days</dd><dt>Last seen</dt><dd>${a.last_at ? esc(ago(a.last_at)) : 'never'}</dd>${a.last_subject ? `<dt>Last</dt><dd>${esc(a.last_subject.replace(/^[^:]+: /, ''))}</dd>` : ''}</dl>
${a.status !== 'active' ? `<a class="cc-btn" href="${D.repo}/blob/dev/people/silvio/kit/README.md" target="_blank" rel="noopener">${ico('ext', '')}Start it (kit)</a>` : `<a class="cc-btn" href="../../../agents/index.html">${ico('agents', '')}On the agents page</a>`}</section>` }).join('')}</div>${srcLine()}`

    // ---------- inbox: a handoff, never content on a public page ----------
    const inboxMini = () => `<div class="cc-conn t-blue"><span class="dot"></span><div><b>Gmail: through Claude</b><p>Your Claude sessions can read your Gmail. This public page never shows mail.</p><div class="acts"><a class="cc-btn" href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener">${ico('ext', '')}Open Gmail</a><button class="cc-btn" type="button" data-prompt="triage">${ico('claude', '')}Triage</button></div></div></div>`
    V.inbox = () => `<div class="cc-grid">
${card('Connections', `<div class="cc-list">
<div class="cc-conn t-green"><span class="dot"></span><div><b>Gmail in your Claude sessions: connected</b><p>Checked on 3 November 2026 from Silvio's Claude Code session through the Gmail connector (labels only, no message read). Claude can search, read, label and draft; a person sends every message.</p></div></div>
<div class="cc-conn t-slate"><span class="dot"></span><div><b>Gmail on this page: off, by design</b><p>This page is published on GitHub Pages, so anything on it is public. No unread counts, senders or subjects are shown here. A private inbox view needs a private app with your own Google sign-in (see Settings).</p></div></div>
</div>`, { cls: 'cc-span-6', id: 'conn' })}
${card('Open your mail', `<div class="cc-list">
<a class="cc-btn" href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener">${ico('inbox', '')}Inbox</a>
<a class="cc-btn" href="https://mail.google.com/mail/u/0/#search/is%3Aunread" target="_blank" rel="noopener">${ico('search', '')}Unread</a>
<a class="cc-btn" href="https://mail.google.com/mail/u/0/#search/web+summit" target="_blank" rel="noopener">${ico('search', '')}Web Summit threads</a>
<a class="cc-btn" href="https://mail.google.com/mail/u/0/#search/t-shirts+OR+hoodies+OR+orcamento+OR+quote" target="_blank" rel="noopener">${ico('search', '')}Printer replies</a>
<a class="cc-btn" href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noopener">${ico('copy', '')}Drafts your agents left</a>
</div><p class="note" style="margin-top:10px">On a phone these open the Gmail app or mobile Gmail, in the account you are signed in to.</p>`, { cls: 'cc-span-6', id: 'open' })}
${card('Let Claude work the inbox', `<div class="cc-list">
<button class="cc-btn" type="button" data-prompt="triage">${ico('claude', '')}Triage my inbox</button>
<button class="cc-btn" type="button" data-prompt="printers">${ico('claude', '')}Check printer replies against WS-48</button>
<button class="cc-btn" type="button" data-prompt="email2task">${ico('claude', '')}Turn emails into board tasks (drafts)</button>
<button class="cc-btn" type="button" data-prompt="followups">${ico('claude', '')}Draft follow-ups I owe</button>
</div><p class="note" style="margin-top:10px">Each button prepares a prompt with your board context; you paste it into Claude, where the Gmail connector does the reading. Nothing is sent without you.</p>`, { cls: 'cc-span-12', id: 'work' })}
</div>`

    // ---------- calendar: the repository's agenda, plus your own Google Calendar if you add it on this device ----------
    const agendaItems = day => {
        const d0 = new Date(day); d0.setHours(0, 0, 0, 0); const d1 = new Date(d0.getTime() + 864e5)
        const items = []
        for (const t of D.standups.times_utc) { const [h, m] = t.split(':'); const at = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), d0.getUTCDate(), +h, +m)); if (at >= d0 && at < d1) items.push({ at, what: `Team stand-up (${t} UTC)`, sub: 'Bring “Decisions I need”', tone: 'conductor' }) }
        for (const i of openNamed()) if (i.due_at && !i.recurring && new Date(i.due_at) >= d0 && new Date(i.due_at) < d1) items.push({ at: new Date(i.due_at), what: `${i.id} due: ${i.title}`, sub: /T23:59/.test(i.due_at) ? 'end of day' : '', tone: urgency(i).tone, issue: i.id })
        const op = new Date(D.summit.opening); if (op >= d0 && op < d1) items.push({ at: op, what: 'Web Summit opening night', sub: 'Lisbon', tone: 'gold' })
        return items.sort((a, b) => a.at - b.at)
    }
    const agendaRows = (day, compact) => { const l = agendaItems(day); return l.length ? `<div class="cc-rows">${l.slice(0, compact ? 6 : 99).map(x => `<div class="cc-row"><span class="when">${/end of day/.test(x.sub) ? 'EOD' : esc(fmtTime(x.at))}</span><span class="what">${x.issue ? `<a href="#tasks" data-issue="${esc(x.issue)}">${esc(x.what)}</a>` : esc(x.what)}${x.sub ? `<small>${esc(x.sub)}</small>` : ''}</span><span class="side"><span class="cc-dot t-${x.tone === 'gold' ? 'local' : x.tone}" aria-hidden="true"></span></span></div>`).join('')}</div>` : empty('Nothing from the board or the stand-ups today.') }
    V.calendar = () => {
        const days = []; for (let k = 0; k < 10; k++) { const d = new Date(); d.setDate(d.getDate() + k); days.push(d) }
        const calId = store.get('calId', '')
        return `<div class="cc-grid">
${card('Agenda from the repository', days.map(d => `<h3 style="font:600 15px/22px var(--rm-font);margin:14px 0 4px">${esc(fmtDay(d))}${sameDay(d, Date.now()) ? ' · today' : ''}</h3>${agendaRows(d)}`).join('') + `<p class="note" style="margin-top:12px">Stand-ups (13:00 and 18:00 UTC, WS-96) and your issues' due dates, in your time zone (${esc(TZ)}). Web Summit: ${esc(D.summit.label)}.</p>`, { cls: 'cc-span-5', id: 'agenda' })}
${card('Google Calendar', `<div class="cc-list">
<div class="cc-conn t-slate"><span class="dot"></span><div><b>No Google Calendar connector in Claude yet</b><p>Checked on 3 November 2026: Silvio's Claude session has Gmail and Google Drive, not Calendar. Adding the Google Calendar connector at claude.ai (Settings, Connectors) would let Claude read your schedule; this public page still would not.</p></div></div>
<div class="cc-conn t-blue"><span class="dot"></span><div><b>Your calendar, on this device only</b><p>Enter your calendar ID (usually your Google address). It is saved only in this browser, never in the repository; Google shows your events only if you are signed in to that account here. Some browsers block this; then use “Open Google Calendar”.</p>
<form class="acts" id="cal-form"><label class="sr" for="cal-id">Calendar ID</label><input id="cal-id" type="text" inputmode="email" autocomplete="off" placeholder="your calendar ID" value="${esc(calId)}" style="flex:1;min-width:200px"><button class="cc-btn primary" type="submit">Show</button>${calId ? '<button class="cc-btn" type="button" id="cal-clear">Forget</button>' : ''}</form></div></div>
<div class="acts"><a class="cc-btn" href="https://calendar.google.com/calendar/r/day" target="_blank" rel="noopener">${ico('ext', '')}Open Google Calendar</a><button class="cc-btn" type="button" data-prompt="schedule">${ico('claude', '')}Plan my day with Claude</button></div>
${calId ? `<iframe class="cc-cal" title="Your Google Calendar (agenda)" src="https://calendar.google.com/calendar/embed?mode=AGENDA&showTitle=0&showPrint=0&ctz=${encodeURIComponent(TZ)}&src=${encodeURIComponent(calId)}" loading="lazy" referrerpolicy="no-referrer"></iframe>` : ''}
</div>`, { cls: 'cc-span-7', id: 'gcal' })}
</div>`
    }

    // ---------- Claude: a prompt workflow with your board context, voice in, voice out ----------
    const context = () => {
        const o = openNamed().slice(0, 16).map(i => `- ${i.id} ${i.title} (due ${i.due || 'no date'}, ${i.status}${i.picked_by ? ', picked by ' + i.picked_by : ''})`).join('\n')
        return `Context from my command centre (web-summit.sgit.ai/people/silvio/app/, data ${D.version}, ${fmtDay(D.built_at)}):\nOpen issues named for me:\n${o}\nDecisions waiting:\n${D.decisions.map(x => `- ${x.who}: ${x.what}`).join('\n')}\nThe board is board/WS-*.md in SGit-AI/SGit-AI__Website__Web-Summit (branch dev).`
    }
    const RULES = 'Rules: draft only, send nothing, change nothing outside people/silvio/ and the board without asking me; public material only in the repository; no contact details there.'
    const PROMPTS = {
        brief: ['Brief me for today', 'Brief me for today: what is due, what is blocked, which decisions I must chase, and the three things I should do first. Check my Gmail for anything that changes this.'],
        triage: ['Triage my inbox', 'Triage my Gmail inbox: list what needs a reply from me today, what is about Web Summit, the merch or outreach, and draft replies (as Gmail drafts) for the urgent ones. Do not send anything. Do not copy email content into the repository.'],
        printers: ['Printer replies', 'Read the replies from the printers for the merch order (WS-48) in my Gmail. For each: can they deliver 21 T-shirts and 7 hoodies in seven colours by Friday 6 November, price, what they need from us and by when. Give me a table, then update people/silvio/dashboard.md#printers without naming a printer or a price unless they agreed to be published.'],
        email2task: ['Emails to tasks', 'Find emails in my Gmail from the last 3 days that need work from the team. For each, propose a board issue (board/WS-NN-slug.md with id, title, area, for, due, status: open, and a body that says what done looks like), using only public facts. Show me the drafts before committing.'],
        followups: ['Follow-ups', 'List the follow-ups I owe (WS-24 and my Gmail sent folder), and draft each as a Gmail draft for me to send.'],
        schedule: ['Plan my day', 'Plan my day around the 13:00 and 18:00 UTC stand-ups and my due issues. If you can read my Google Calendar, use it; if not, say so and plan from the board.'],
        task: ['Plan this issue', 'Make a plan of at most five steps to finish this issue, say what you can do yourself and what you need from me, and wait for my go.'],
        idea: ['An idea', 'Help me shape one idea for the stand-up: what should the team do before Web Summit that it is not doing? Give me three options with the cost and the first step of each.'],
        outreach: ['Outreach targets', 'Start WS-25 and WS-26: propose the first five companies from https://web-summit.sgit.ai/companies/index.md with why each and a first message (drafts only), then the plan to 50 by Thursday.'],
    }
    V.ask = () => {
        const draft = S.askDraft || ''
        return `<div class="cc-grid">
${card('Ask Claude', `<div class="cc-filters" style="margin-bottom:12px">${Object.entries(PROMPTS).filter(([k]) => k !== 'task').map(([k, [l]]) => `<button class="cc-btn" type="button" data-prompt="${k}">${esc(l)}</button>`).join('')}</div>
<label class="f" for="ask-text">Your request (type, or press the microphone and speak)</label>
<textarea id="ask-text" placeholder="e.g. Brief me for today">${esc(draft)}</textarea>
<div class="cc-filters" style="margin-top:10px">
<button class="cc-btn cc-mic" type="button" data-mic="ask-text" aria-pressed="false">${ico('mic', '')}<span>Dictate</span></button>
<label class="sr" for="ask-lang">Speech language</label><select id="ask-lang">${[['en-GB', 'English (UK)'], ['en-US', 'English (US)'], ['pt-PT', 'Português (PT)'], ['pt-BR', 'Português (BR)']].map(([v, l]) => `<option value="${v}"${S.voiceLang === v ? ' selected' : ''}>${l}</option>`).join('')}</select>
<label style="display:inline-flex;gap:8px;align-items:center;min-height:44px;font:500 14px/20px var(--rm-font)"><input type="checkbox" id="ask-ctx" checked> Add my board context</label></div>
<p class="note" id="mic-status" aria-live="polite" style="margin-top:6px">${speechOK() ? 'Speech is turned into text by your browser; nothing is recorded by this page.' : 'Dictation is not available in this browser: type instead, or use your keyboard’s microphone.'}</p>
<div class="cc-filters" style="margin-top:14px">
<button class="cc-btn gold" type="button" id="ask-open">${ico('ext', '')}Copy and open Claude</button>
<button class="cc-btn" type="button" id="ask-copy">${ico('copy', '')}Copy prompt</button>
<button class="cc-btn" type="button" id="ask-speak">${ico('speak', '')}Read my day aloud</button></div>`, { cls: 'cc-span-7', id: 'askc' })}
${card('How this works', `<div class="cc-list">
<div class="cc-conn t-green"><span class="dot"></span><div><b>Works now</b><p>Dictation (browser speech-to-text), templates with your live board context, copy to clipboard, open Claude in a new tab or the app, and reading your day aloud (the page's own numbers, spoken by your device).</p></div></div>
<div class="cc-conn t-yellow"><span class="dot"></span><div><b>A handoff, not a chat</b><p>This public page has no Claude key and never will. The prompt is copied; paste it into Claude (it is also passed in the link, which Claude may or may not pre-fill). Claude's own connectors (Gmail, Drive, GitHub) do the work there.</p></div></div>
<div class="cc-conn t-slate"><span class="dot"></span><div><b>Later: a real assistant</b><p>Conversational voice and answers on the page need a private backend holding a Claude API key behind your own sign-in. Not on GitHub Pages.</p></div></div>
</div>`, { cls: 'cc-span-5', id: 'how' })}
</div>`
    }

    V.reports = () => {
        const o = openNamed(), byDay = {}
        for (const i of o) { const k = i.recurring ? 'daily' : i.due_at ? fmtDay(i.due_at) : 'no date'; byDay[k] = (byDay[k] || 0) + 1 }
        const max = Math.max(1, ...Object.values(byDay)), bars = (rows, mx, tone) => `<div class="cc-bars">${rows.map(([l, n, t]) => `<div class="b t-${t || tone}"><span title="${esc(l)}">${esc(l)}</span><div class="cc-track"><i style="width:${Math.max(2, n / mx * 100)}%"></i></div><span class="num">${n}</span></div>`).join('')}</div>`
        const streams = D.workstreams.map(w => [w.name, D.issues.filter(i => i.stream === w.id && i.status !== 'done').length, STREAM_TONE[w.id]])
        const agents = D.agents.map(a => [a.short, a.commits_7d, a.colour])
        const statuses = Object.entries(STATUS).map(([k, [l, t]]) => [l, named().filter(i => i.status === k).length, t])
        const people = {}; for (const a of D.activity) { const p = (a.agent.split('.').pop() || 'unsigned'); people[p] = (people[p] || 0) + 1 }
        return `<div class="cc-grid">
${card('My open issues by due day', bars(Object.entries(byDay).map(([k, n]) => [k, n]), max, 'orange'), { cls: 'cc-span-6', id: 'r1' })}
${card('Open by workstream', bars(streams, Math.max(1, ...streams.map(s => s[1])), 'blue'), { cls: 'cc-span-6', id: 'r2' })}
${card('My issues by status', bars(statuses, Math.max(1, ...statuses.map(s => s[1])), 'slate'), { cls: 'cc-span-4', id: 'r3' })}
${card('My agents: commits in 7 days', bars(agents, Math.max(1, ...agents.map(s => s[1])), 'conductor'), { cls: 'cc-span-4', id: 'r4' })}
${card('Team commits in 48 h, by person', bars(Object.entries(people).sort((a, b) => b[1] - a[1]).map(([k, n]) => [k, n, k === 'silvio' ? 'local' : 'dev']), Math.max(1, ...Object.values(people)), 'dev'), { cls: 'cc-span-4', id: 'r5' })}
</div>${srcLine()}`
    }

    V.settings = () => `<div class="cc-grid">
${card('Appearance', `<div class="cc-filters">${['dark', 'light', 'system'].map(t => `<button class="cc-btn${store.get('theme', 'dark') === t ? ' primary' : ''}" type="button" data-theme-set="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div><p class="note" style="margin-top:10px">Dark is the default. Your choice is saved in this browser only.</p>`, { cls: 'cc-span-6', id: 's1' })}
${card('This device', `<div class="cc-rows"><div class="cc-row wide"><span class="what">Time zone<small>From your device</small></span><span class="side">${esc(TZ)}</span></div><div class="cc-row wide"><span class="what">Speech language<small>For dictation</small></span><span class="side">${esc(S.voiceLang)}</span></div><div class="cc-row wide"><span class="what">Calendar ID<small>Saved only here</small></span><span class="side">${store.get('calId', '') ? 'set' : 'not set'}</span></div></div>`, { cls: 'cc-span-6', id: 's2' })}
${card('Connections', `<div class="cc-rows">
${[['GitHub board (read)', 'Live at every release: board/WS-*.md, team, git history', 'green', 'working'], ['GitHub board (write)', 'Through GitHub’s editor or your agents; no token on this page', 'green', 'handoff'], ['Gmail', 'Connected in your Claude sessions; never shown on this public page', 'blue', 'via Claude'], ['Google Calendar', 'No connector in Claude yet; optional embed on this device', 'yellow', 'partial'], ['Claude', 'Prompt handoff with your board context', 'blue', 'handoff'], ['Voice', 'Browser speech-to-text and read-aloud', speechOK() ? 'green' : 'yellow', speechOK() ? 'working' : 'not in this browser'], ['Notifications', 'Not built: a static page cannot push', 'slate', 'not available']].map(([a, b, t, s]) => `<div class="cc-row wide"><span class="what"><b>${a}</b><small>${b}</small></span>${chip(s, t)}</div>`).join('')}
</div>`, { cls: 'cc-span-12', id: 's3' })}
${card('Privacy', `<p class="note">This page is public on GitHub Pages, like the whole site: it shows only what the repository already publishes. No email, calendar event, contact detail, supplier name or price appears here. Settings live in your browser. A private inbox, calendar and conversational assistant need a private app with your own Google and Claude sign-in; the page is built so those can be added as separate panels without changing the design.</p>`, { cls: 'cc-span-12', id: 's4' })}
</div>`

    const activityRows = n => D.activity.length ? `<div class="cc-rows">${D.activity.slice(0, n).map(a => `<div class="cc-row"><span class="when">${esc(fmtTime(a.at))}</span><span class="what">${esc(a.subject.replace(/^[a-z0-9-]+@web-summit\.[a-z0-9-]+: /, ''))}<small>${esc(a.agent || 'unsigned')}${a.mine ? ' · yours' : ''}</small></span><span class="side">${esc(ago(a.at))}</span></div>`).join('')}</div>` : empty('No commits in the last 48 hours.')

    // ---------- task drawer and new task ----------
    function openIssue(id) {
        const i = D.issues.find(x => x.id === id); if (!i) return
        const u = urgency(i), [sl, st] = statusOf(i)
        overlay(`<div class="cc-drawer" role="dialog" aria-modal="true" aria-labelledby="dr-h">
<button class="cc-iconbtn close" type="button" data-close aria-label="Close">${ico('x', '')}</button>
<p class="note">${esc(i.id)} · ${esc(i.area)}</p><h2 id="dr-h">${esc(i.title)}</h2>
<div class="cc-filters">${streamChip(i.stream)}${chip(sl, st)}${chip(u.label, u.tone)}</div>
<div class="cc-rows"><div class="cc-row wide"><span class="what">Due</span><span class="side">${esc(i.due || 'no date')}</span></div><div class="cc-row wide"><span class="what">For</span><span class="side">${esc(i.for.join(', '))}</span></div><div class="cc-row wide"><span class="what">Picked by</span><span class="side">${esc(i.picked_by || 'nobody yet')}</span></div>${i.agents ? `<div class="cc-row wide"><span class="what">Agents</span><span class="side" style="white-space:normal;text-align:right">${esc(i.agents)}</span></div>` : ''}</div>
<h3 style="font:600 16px/24px var(--rm-font)">Done when</h3><div class="body">${md(i.body)}</div>
<div class="cc-filters"><a class="cc-btn" href="${ghBlob(i.file)}" target="_blank" rel="noopener">${ico('github', '')}Open on GitHub</a><a class="cc-btn primary" href="${ghEdit(i.file)}" target="_blank" rel="noopener">${ico('ext', '')}Pick up / update / done</a><button class="cc-btn gold" type="button" data-prompt="task" data-for="${esc(i.id)}">${ico('claude', '')}Ask Claude</button></div>
<p class="note">To pick it up, set <code>picked_by:</code> and <code>status: picked</code>; to finish, <code>status: done</code> and where the result is (board/README.md). GitHub's editor commits as you; your agents can do the same.</p></div>`)
    }
    function newTask() {
        const next = 'WS-' + (Math.max(...D.issues.map(i => +i.id.slice(3) || 0)) + 1)
        overlay(`<div class="cc-drawer" role="dialog" aria-modal="true" aria-labelledby="nt-h">
<button class="cc-iconbtn close" type="button" data-close aria-label="Close">${ico('x', '')}</button>
<h2 id="nt-h">New task: ${next}</h2><p class="note">Creates <code>board/${next}-….md</code> on GitHub's own page, signed in as you. Nothing is written until you press “Commit” there. If someone took ${next} meanwhile, change the number.</p>
<form class="form" id="nt">
<label class="f full">Title (required)<input name="title" required maxlength="90"></label>
<label class="f">Area<select name="area">${['outreach', 'content', 'merch', 'pm', 'tech', 'ops'].map(a => `<option>${a}</option>`).join('')}</select></label>
<label class="f">Due<input name="due" type="date" required min="${new Date().toISOString().slice(0, 10)}"></label>
<label class="f full">For (people, comma separated)<input name="for" value="silvio"></label>
<label class="f full">Done when (required)<textarea name="body" required placeholder="What does done look like? Public facts only, no contact details."></textarea></label>
<div class="full cc-filters"><button class="cc-btn primary" type="submit">${ico('github', '')}Review and create on GitHub</button><button class="cc-btn" type="button" id="nt-copy">${ico('copy', '')}Copy for my agent</button></div>
</form></div>`)
        const f = $('#nt')
        const file = () => {
            const v = Object.fromEntries(new FormData(f)), slug = v.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)
            const d = v.due ? new Date(v.due + 'T12:00:00Z') : null, due = d ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(',', '') : ''
            return { name: `board/${next}-${slug}.md`, text: `---\nid: ${next}\ntitle: ${v.title.trim()}\narea: ${v.area}\nfor: ${v.for.trim()}\ndue: ${due}\nstatus: open\npicked_by:\n---\n${v.body.trim()}\n` }
        }
        f.onsubmit = e => { e.preventDefault(); if (!f.reportValidity()) return; const x = file(); window.open(`${D.repo}/new/${D.branch}?filename=${encodeURIComponent(x.name)}&value=${encodeURIComponent(x.text)}`, '_blank', 'noopener') }
        $('#nt-copy').onclick = () => { if (!f.reportValidity()) return; const x = file(); copy(`Add this issue to the board as ${x.name}, commit with the convention (Issue: ${next}), and release:\n\n${x.text}`) }
    }
    function moreSheet() {
        overlay(`<div class="cc-sheet" role="dialog" aria-modal="true" aria-label="More views">${VIEWS.filter(([id]) => !['home', 'tasks', 'board', 'inbox'].includes(id)).map(([id, l, i]) => `<a href="#${id}" data-close>${ico(i, '')}${esc(l)}</a>`).join('')}</div>`)
    }
    let lastFocus = null
    function overlay(inner) {
        closeOverlay(); lastFocus = document.activeElement
        const w = document.createElement('div'); w.id = 'cc-ov'; w.className = 'cc'; w.innerHTML = `<div class="cc-scrim" data-close></div>${inner}`
        document.body.appendChild(w); bind(w); bindMics(w)
        const f = w.querySelector('input, select, textarea, button:not([data-close]), a'); (f || w.querySelector('button')).focus()
    }
    function closeOverlay() { const w = $('#cc-ov'); if (w) { w.remove(); if (lastFocus) lastFocus.focus() } }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay() })

    // ---------- clipboard, Claude, speech ----------
    function toast(t) { const el = document.createElement('div'); el.className = 'cc-toast'; el.setAttribute('role', 'status'); el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2600) }
    async function copy(t) { try { await navigator.clipboard.writeText(t); toast('Copied') } catch { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); toast('Copied') } catch { toast('Copy failed: select and copy by hand') } a.remove() } }
    const fullPrompt = () => { const t = ($('#ask-text') || {}).value || ''; const ctx = $('#ask-ctx') ? $('#ask-ctx').checked : true; return `${t.trim()}\n\n${ctx ? context() + '\n\n' : ''}${RULES}`.trim() }
    function usePrompt(key, forId) {
        const [, text] = PROMPTS[key]; const i = forId && D.issues.find(x => x.id === forId)
        S.askDraft = i ? `${text}\n\nIssue ${i.id}: ${i.title} (due ${i.due}). Done when: ${firstPara(i.body)} (${ghBlob(i.file)})` : text
        closeOverlay(); if (S.view === 'ask') { $('#ask-text').value = S.askDraft; $('#ask-text').focus() } else go('ask')
    }
    const speechOK = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    let rec = null
    function bindMics(scope) {
        $$('[data-mic]', scope).forEach(b => b.onclick = () => {
            const target = document.getElementById(b.dataset.mic), status = $('#mic-status')
            if (!speechOK()) { toast('Dictation is not available in this browser'); return }
            if (rec) { rec.stop(); return }
            const R = window.SpeechRecognition || window.webkitSpeechRecognition; rec = new R()
            rec.lang = S.voiceLang; rec.interimResults = true; rec.continuous = false
            const base = target.value ? target.value.trim() + ' ' : ''
            rec.onresult = e => { target.value = base + [...e.results].map(r => r[0].transcript).join('') }
            rec.onerror = e => { toast(e.error === 'not-allowed' ? 'Microphone permission was refused' : 'Dictation stopped: ' + e.error) }
            rec.onend = () => { b.setAttribute('aria-pressed', 'false'); rec = null; if (status) status.textContent = 'Dictation finished: check the text, then copy or open Claude.' }
            b.setAttribute('aria-pressed', 'true'); if (status) status.textContent = 'Listening… speak now (press again to stop).'
            try { rec.start() } catch { rec = null; b.setAttribute('aria-pressed', 'false') }
        })
    }
    function speakDay() {
        if (!('speechSynthesis' in window)) { toast('Read-aloud is not available in this browser'); return }
        const c = counts(), top = openNamed().slice(0, 3)
        const text = `You have ${c.open} open issues. ${c.overdue} overdue, ${c.soon} due in the next three days. First: ${top.map(i => `${i.title}, due ${i.due}`).join('. ')}. ${D.decisions.length} decisions are waiting, starting with: ${D.decisions[0] ? D.decisions[0].what : 'none'}.`
        speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = S.voiceLang.startsWith('pt') ? 'en-GB' : S.voiceLang; speechSynthesis.speak(u)
    }

    // ---------- events ----------
    function bind(scope) {
        $$('[data-go]', scope).forEach(b => b.onclick = () => go(b.dataset.go))
        $$('[data-issue]', scope).forEach(b => b.onclick = e => { e.preventDefault(); openIssue(b.dataset.issue) })
        $$('[data-new]', scope).forEach(b => b.onclick = newTask)
        $$('[data-close]', scope).forEach(b => b.addEventListener('click', () => setTimeout(closeOverlay)))
        $$('[data-prompt]', scope).forEach(b => b.onclick = () => usePrompt(b.dataset.prompt, b.dataset.for))
        $$('[data-set]', scope).forEach(b => b.onclick = () => { S[b.dataset.set] = b.dataset.val; if (b.dataset.set === 'scope') store.set('scope', S.scope); render() })
        $$('[data-sel]', scope).forEach(s => s.onchange = () => { S[s.dataset.sel] = s.value; render() })
        $$('[data-kpi]', scope).forEach(b => b.onclick = () => { const k = b.dataset.kpi; Object.assign(S, { scope: 'named', stream: 'all', q: '', status: { picked: 'picked', done: 'done' }[k] || 'active', window: { soon: 'week', overdue: 'today' }[k] || 'all' }); go(k === 'waiting' ? 'waiting' : 'tasks') })
        $$('[data-reset]', scope).forEach(b => b.onclick = () => { Object.assign(S, { stream: 'all', status: 'all', window: 'all', q: '' }); render() })
        $$('[data-clearq]', scope).forEach(b => b.onclick = () => { S.q = ''; render() })
        $$('[data-theme-set]', scope).forEach(b => b.onclick = () => { store.set('theme', b.dataset.themeSet); applyTheme(); render() })
        const cf = $('#cal-form', scope); if (cf) cf.onsubmit = e => { e.preventDefault(); store.set('calId', $('#cal-id').value.trim()); render() }
        const cc = $('#cal-clear', scope); if (cc) cc.onclick = () => { store.set('calId', ''); render() }
        const lang = $('#ask-lang', scope); if (lang) lang.onchange = () => { S.voiceLang = lang.value; store.set('lang', lang.value) }
        const ao = $('#ask-open', scope); if (ao) ao.onclick = () => { const p = fullPrompt(); if (!p) return; copy(p); window.open('https://claude.ai/new?q=' + encodeURIComponent(p.slice(0, 6000)), '_blank', 'noopener') }
        const ac = $('#ask-copy', scope); if (ac) ac.onclick = () => copy(fullPrompt())
        const as = $('#ask-speak', scope); if (as) as.onclick = speakDay
        const at = $('#ask-text', scope); if (at) at.oninput = () => { S.askDraft = at.value }
    }

    // ---------- routing ----------
    function go(v) { if (location.hash !== '#' + v) location.hash = v; else render() }
    function render() {
        const v = (location.hash.slice(1) || 'home'); S.view = V[v] ? v : 'home'
        const y = window.scrollY
        shell()
        const meta = VIEWS.find(x => x[0] === S.view)
        $('#cc-title').innerHTML = `${esc(meta[1])}<small>${S.view === 'home' ? 'RiskMandate · Web Summit 2026' : 'Silvio Command Center'}</small>`
        $('#cc-view').innerHTML = V[S.view]()
        $('#cc-askbar').hidden = S.view === 'ask'
        document.title = `${meta[1]} · Silvio's command centre`
        bind(root)
        window.scrollTo(0, S.lastView === S.view ? y : 0)
        if (S.lastView && S.lastView !== S.view) $('#cc-view').focus({ preventScroll: true })
        S.lastView = S.view
    }
    window.addEventListener('hashchange', () => { closeOverlay(); render() })
    matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', () => { if (store.get('theme', 'dark') === 'system') { applyTheme(); render() } })

    fetch(root.dataset.src || 'data.json', { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json() }).then(d => { D = d; render() })
        .catch(e => { html.classList.remove('cc-on'); root.innerHTML = `<p class="note">The command centre could not load its data (${esc(e.message)}); the summary below is the same data as text.</p>` })
})()
