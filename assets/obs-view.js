// The observability explorer (observability@web-summit.dinis, 5 November 2026, at Dinis Cruz's word: "more like Kibana,
// with everything linked to everything"). ```obs-view <punch|explore> <person> <vault>``` renders <div class="obs-view">.
//
// Everything is read in this browser straight out of the public vault (aym98gsm) from its published read key: the page
// derives the vault's address, fetches ciphertext, decrypts it, and walks ONLY the folders it needs (latest/ first, then
// <day>/day.json or <day>/<hh>/hour.json when you drill in), so each view costs a few small files. The drain made those
// files already massaged (LETS: load, extract, transform, save; admin/tools/obs_lets.py); this code only draws them.
// Vault strings reach the page as text (textContent), never as HTML.
//
// "Behind the scenes" (the button on the right): every encrypted object fetched and decrypted, the files read, who this
// browser is, the vaults and their links. When the browser holds Dinis's site key it also opens the vault keys sealed to
// it (people/dinis/observability/sealed-keys.json), links each vault opened with its vault key, and drains the lanes from
// here: list and fetch with the enum key, open each record with the drain key (shown, so you see your own actions), write
// them still sealed to the data vault's inbox/ (the hourly drain verifies and folds them in), push, mark processed.
// State is the URL hash: #view=page&path=/start/&day=2026-11-05 (back and forward work).
(() => {
    'use strict'
    const boxes = [...document.querySelectorAll('.obs-view')]; if (!boxes.length || !window.SGVaultEmbed) return
    const GROUPS = ['readers', 'team', 'synthetic', 'crawlers']
    const LABEL = { readers: 'Readers', team: 'Team (by key)', synthetic: 'Synthetic', crawlers: 'Crawlers' }
    const COLOR = { readers: '#2f6fdb', team: '#1f9d6b', synthetic: '#c47a12', crawlers: '#8a6bd1' }
    const BASE = boxes[0].dataset.base || ''
    const EXPLORE = BASE + 'observability/index.html'
    const fmt = n => (n || 0).toLocaleString('en-GB')
    const secs = s => { s = Math.round(s || 0); return s < 60 ? s + 's' : Math.floor(s / 60) + 'm ' + (s % 60) + 's' }
    const enc = new TextEncoder(), dec = new TextDecoder()
    const h = (tag, attrs = {}, kids = []) => {
        const e = document.createElement(tag)
        for (const [k, v] of Object.entries(attrs || {})) if (v != null) k === 'text' ? e.textContent = v : k === 'style' ? e.style.cssText = v : k.startsWith('on') ? e.addEventListener(k.slice(2), v) : e.setAttribute(k, v)
        for (const c of [].concat(kids)) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)))
        return e
    }
    const code = t => h('code', { text: t })

    // ------------------------------------------------------------------ behind the scenes: the log and the pane
    const LOG = [], FILES = [], listeners = []
    const t0 = performance.now()
    const log = (kind, msg, extra) => { const e = { t: ((performance.now() - t0) / 1000).toFixed(2), kind, msg, extra }; LOG.push(e); listeners.forEach(f => f(e)) }
    const pane = h('aside', { class: 'obsd-pane', hidden: '' })
    // a side panel like the feedback pane: the page moves left to make room (html.obsd-docked), the left edge drags to resize
    const setOpen = open => { pane.hidden = !open; toggle.classList.toggle('on', open); document.documentElement.classList.toggle('obsd-docked', open); try { localStorage.setItem('ws.obsd.pane', open ? '1' : '0') } catch { } }
    const toggle = h('button', { type: 'button', class: 'obsd-toggle', title: 'What happens behind the scenes', text: 'Behind the scenes', onclick: () => setOpen(pane.hidden) })
    const setW = w => { w = Math.round(Math.max(300, Math.min(w, innerWidth * 0.7, 1100))); document.documentElement.style.setProperty('--obsd-w', w + 'px'); return w }
    try { const w = +localStorage.getItem('ws.obsd.w'); if (w) setW(w) } catch { }
    const grip = h('div', { class: 'obsd-grip', role: 'separator', 'aria-orientation': 'vertical', 'aria-label': 'Drag to resize', tabindex: '0' })
    grip.onpointerdown = e => { e.preventDefault(); grip.setPointerCapture(e.pointerId); grip.classList.add('on') }
    grip.onpointermove = e => { if (grip.classList.contains('on')) setW(innerWidth - e.clientX) }
    grip.onpointerup = e => { grip.classList.remove('on'); try { localStorage.setItem('ws.obsd.w', parseInt(getComputedStyle(document.documentElement).getPropertyValue('--obsd-w'))) } catch { } }
    grip.onkeydown = e => { const d = { ArrowLeft: 40, ArrowRight: -40 }[e.key]; if (d) { e.preventDefault(); const w = setW((parseInt(getComputedStyle(document.documentElement).getPropertyValue('--obsd-w')) || 440) + d); try { localStorage.setItem('ws.obsd.w', w) } catch { } } }
    const sec = (title, body) => h('section', {}, [h('h4', { text: title }), body])
    const whoBox = h('div'), vaultBox = h('div'), actBox = h('div'), filesBox = h('div'), logBox = h('ol', { class: 'obsd-log' })
    pane.append(grip, h('header', {}, [h('b', { text: 'Behind the scenes' }), h('button', { type: 'button', text: '×', onclick: () => setOpen(false) })]),
        sec('Who this browser is', whoBox), sec('The vaults', vaultBox), sec('Actions', actBox), sec('Encrypted files read', filesBox), sec('Log', logBox))
    listeners.push(e => { logBox.append(h('li', { class: 'k-' + e.kind }, [h('span', { text: e.t + 's' }), ' ', h('b', { text: e.kind }), ' ', e.msg])); logBox.scrollTop = logBox.scrollHeight })
    const drawFiles = () => { filesBox.textContent = ''; filesBox.append(h('table', {}, [h('tr', {}, ['File', 'Objects', 'Bytes', 'ms'].map(x => h('th', { text: x }))),
        ...FILES.map(f => h('tr', {}, [h('td', {}, [code(f.path)]), h('td', { text: f.objects }), h('td', { text: fmt(f.bytes) }), h('td', { text: f.ms })]))]),
        h('p', { class: 'obsd-m', text: `${FILES.length} files, ${fmt(FILES.reduce((a, f) => a + f.bytes, 0))} bytes of ciphertext, all decrypted here with Web Crypto.` })) }
    document.body.append(toggle, pane)
    try { if (localStorage.getItem('ws.obsd.pane') === '1') setOpen(true) } catch { }

    // ------------------------------------------------------------------ a lazy reader: walks only the path it needs
    const cfg = { endpoint: boxes[0].dataset.endpoint, vault_id: boxes[0].dataset.vault, read_key: boxes[0].dataset.key.replace(/^sgit_public_read_/, '') }
    let R = null, root = null; const trees = new Map(), jsons = new Map(); let objs = 0, bytes = 0
    async function openVault() {
        if (R) return
        log('vault', `importing the read key of ${cfg.vault_id} (AES-GCM to decrypt, HMAC-SHA256 to derive ids)`)
        R = await new window.SGVaultEmbed.Reader(cfg).init()
        const raw = R.raw.bind(R)
        R.raw = async p => { const s = performance.now(), b = await raw(p); objs++; bytes += b.length; log('fetch', `${p.split('/').slice(0, 2).join('/')}/${p.split('/').pop().slice(0, 22)}… ${fmt(b.length)} bytes, ${Math.round(performance.now() - s)} ms`); return b }
        const refId = 'ref-pid-muw-' + await R.fileId('sg-vault-v1:file-id:ref:' + cfg.vault_id)
        log('derive', `HEAD's id is ${refId}: computed from the key, never asked of the server`)
        const ref = JSON.parse(dec.decode(await R.decrypt(await R.raw('bare/refs/' + refId))))
        const commit = await R.objJson(ref.commit_id)
        log('decrypt', `the ref points at commit ${ref.commit_id.slice(0, 24)}…; its tree is the vault's root`)
        root = commit.tree_id
    }
    async function tree(id) {
        if (trees.has(id)) return trees.get(id)
        const t = await R.objJson(id), m = {}
        for (const e of t.entries || []) m[await R.decB64(e.name_enc)] = e
        trees.set(id, m); return m
    }
    async function readJson(path) {
        if (jsons.has(path)) return jsons.get(path)
        const p = (async () => {
            await openVault(); const s = performance.now(), o0 = objs, b0 = bytes
            let id = root, entry = null
            const parts = path.split('/')
            for (let i = 0; i < parts.length; i++) {
                const m = await tree(id); entry = m[parts[i]]
                if (!entry) throw new Error('not in the vault: ' + path)
                if (i < parts.length - 1) id = entry.tree_id
            }
            const text = dec.decode(await R.obj(entry.blob_id))
            const f = { path, objects: objs - o0, bytes: bytes - b0, ms: Math.round(performance.now() - s) }
            FILES.push(f); drawFiles(); log('file', `${path}: ${f.objects} objects, ${fmt(f.bytes)} bytes, decrypted in ${f.ms} ms`)
            return JSON.parse(text)
        })()
        jsons.set(path, p); p.catch(() => jsons.delete(path)); return p
    }

    // ------------------------------------------------------------------ links and the hash
    const state = () => Object.fromEntries(new URLSearchParams(location.hash.replace(/^#/, '')))
    const href = s => EXPLORE + '#' + new URLSearchParams(Object.entries(s).filter(([, v]) => v != null && v !== '')).toString()
    const go = (label, s, cls) => h('a', { href: href(s), class: cls, text: label })
    const site = path => BASE.replace(/\/?$/, '/') + path.replace(/^\//, '')
    const pageLink = (path, extra = {}) => h('span', { class: 'obsv-pl' }, [go(path, { view: 'page', path, ...extra }, 'obsv-path'), ' ', h('a', { href: site(path), class: 'obsv-open', title: 'open the page itself', text: '↗' })])
    const agentLink = a => go(a, { view: 'agent', agent: a })
    const personLink = p => go(p, { view: 'person', person: p })
    const dayLink = (d, extra) => go(d, { view: 'day', day: d, ...extra })
    const urlLink = u => { const m = u.match(/^https:\/\/web-summit\.sgit\.ai(\/.*)$/); if (m) return pageLink(m[1].replace(/index\.(md|html)$/, '')); return go(u, { view: 'url', url: u }, 'obsv-path') }

    // ------------------------------------------------------------------ small parts
    const table = (head, rows, num = []) => h('div', { class: 'obsv-scroll' }, [h('table', {}, [
        h('thead', {}, [h('tr', {}, head.map((c, i) => h('th', { class: num.includes(i) ? 'n' : '', text: c })))]),
        h('tbody', {}, rows.length ? rows.map(r => h('tr', {}, r.map((c, i) => h('td', { class: num.includes(i) ? 'n' : '' }, [c == null ? '' : c])))) : [h('tr', {}, [h('td', { colspan: head.length, class: 'obsv-m', text: 'Nothing yet.' })])])])])
    const tiles = (t, extra = []) => h('div', { class: 'obsv-tiles' }, [...GROUPS.map(g => h('a', { href: href({ ...state(), group: g }), class: state().group === g ? 'sel' : '' }, [h('b', { text: fmt(t[g].views) }), h('span', {}, [h('i', { style: `background:${COLOR[g]}` }), t[g].tabs === '' ? `${LABEL[g]}: views` : `${LABEL[g]} · ${fmt(t[g].tabs)} tabs · ${fmt(t[g].reads)} reads`])])), ...extra])
    const NS = 'http://www.w3.org/2000/svg'
    function bars(series, linkOf, title) {   // series: [[label, {group: n}]]; stacked bars, each one a link
        const W = 1000, H = 120, n = Math.max(series.length, 24), step = (W - 30) / n, bw = Math.max(3, Math.min(40, step - 3))
        const max = Math.max(1, ...series.map(([, v]) => GROUPS.reduce((a, g) => a + (v[g] || 0), 0)))
        const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H + 18}`); svg.setAttribute('class', 'obsv-bars'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', title)
        series.forEach(([label, v], i) => {
            const a = document.createElementNS(NS, 'a'); a.setAttribute('href', linkOf(label)); let y = H, x = 30 + i * step
            for (const g of GROUPS) { const val = v[g] || 0; if (!val) continue; const hh = (H - 6) * val / max; y -= hh
                const r = document.createElementNS(NS, 'rect'); Object.entries({ x, y, width: bw, height: hh, fill: COLOR[g] }).forEach(([k, val2]) => r.setAttribute(k, val2)); a.append(r) }
            const hit = document.createElementNS(NS, 'rect'); Object.entries({ x, y: 0, width: bw, height: H, fill: 'transparent' }).forEach(([k, val2]) => hit.setAttribute(k, val2)); a.append(hit)
            const tt = document.createElementNS(NS, 'title'); tt.textContent = `${label}: ` + GROUPS.map(g => `${v[g] || 0} ${g}`).join(', '); a.append(tt)
            if (n <= 31 || i % Math.ceil(n / 24) === 0) { const t = document.createElementNS(NS, 'text'); t.setAttribute('x', x); t.setAttribute('y', H + 13); t.textContent = label.length > 5 ? label.slice(-5) : label; a.append(t) }
            svg.append(a)
        })
        const m = document.createElementNS(NS, 'text'); m.setAttribute('x', 0); m.setAttribute('y', 10); m.textContent = String(max); svg.append(m)
        return svg
    }
    const legend = () => h('p', { class: 'obsv-m' }, GROUPS.flatMap(g => [h('i', { class: 'dot', style: `background:${COLOR[g]}` }), LABEL[g] + '  ']))
    const human = v => (v.readers || 0) + (v.team || 0)
    const chips = s => { const keys = Object.keys(s).filter(k => k !== 'view'); return h('p', { class: 'obsv-chips' }, [
        go('Overview', {}, 'chip' + (s.view ? '' : ' sel')), ...['dash', 'graph', 'agents', 'pages', 'people'].map(v => go({ dash: 'Dashboard', graph: 'Graph', agents: 'Agents', pages: 'Pages', people: 'People' }[v], { view: v }, 'chip' + (s.view === v ? ' sel' : ''))),
        ...keys.map(k => h('a', { class: 'chip f', href: href(Object.fromEntries(Object.entries(s).filter(([x]) => x !== k))), title: 'remove this filter', text: `${k}: ${s[k]} ×` }))]) }
    const groupRows = (pages, s) => (s.group ? pages.filter(p => p.views[s.group]) : pages)

    // ------------------------------------------------------------------ the views
    const V = {}
    V.day = async (out, s) => {
        const d = await readJson(`${s.day}/day.json`)
        out.append(h('h3', { text: `${s.day}: by hour` }), tiles(d.totals), bars(d.hours.map(([hh, v]) => [hh + ':00', v]), l => href({ view: 'hour', day: s.day, hour: l.slice(0, 2) }), 'Views per hour'), legend())
        V._period(out, d, s)
    }
    V.hour = async (out, s) => {
        const d = await readJson(`${s.day}/${s.hour}/hour.json`)
        out.append(h('h3', {}, [dayLink(s.day), ` ${s.hour}:00 to ${s.hour}:59 UTC`]), tiles(d.totals))
        V._period(out, d, s)
    }
    V._period = (out, d, s) => {
        const pages = groupRows(d.pages.map(p => ({ ...p, total: GROUPS.reduce((a, g) => a + p.views[g], 0) })), s).sort((a, b) => b.total - a.total)
        out.append(h('div', { class: 'obsv-two' }, [
            h('div', {}, [h('h3', { text: 'Pages' }), table(['Page', 'Views', 'Readers', 'Team', 'Synthetic', 'Reads'], pages.map(p => [pageLink(p.path, { day: s.day }), p.total, p.views.readers, p.views.team, p.views.synthetic, p.reads]), [1, 2, 3, 4, 5])]),
            h('div', {}, [h('h3', { text: 'The team' }), table(['Person', 'Page', 'Views', 'Reads', 'Time'], d.team.map(t => [personLink(t.person), pageLink(t.path), t.views, t.reads, t.reads ? secs(t.visible_s) : '–']), [2, 3, 4])])]))
        out.append(h('h3', { text: 'Agent runs' }), table(['Run', 'Agent', 'Trigger', 'Read', 'Did', 'Signed', 'Note'], d.runs.map(r => [r.run, agentLink(r.agent), r.trigger || '', (r.read || []).length, (r.did || []).length, r.signed ? 'yes' : 'no', r.notes || '']), [3, 4]))
    }
    V.pages = async (out, s) => {
        const P = await readJson('latest/pages.json')
        out.append(h('h3', { text: `Every page (${P.pages.length})` + (s.group ? `, with ${LABEL[s.group]} views` : '') }),
            table(['Page', 'Views', 'Readers', 'Team', 'Synthetic', 'Crawlers', 'Reads', 'Avg time', 'Avg scroll'], groupRows(P.pages, s).map(p => [pageLink(p.path), fmt(p.total), p.views.readers, p.views.team, p.views.synthetic, p.views.crawlers, p.reads, p.reads ? secs(p.read_s_avg) : '–', p.reads ? p.scroll_avg + '%' : '–']), [1, 2, 3, 4, 5, 6, 7, 8]))
    }
    V.page = async (out, s) => {
        const [P, T, W] = await Promise.all([readJson('latest/pages.json'), readJson('latest/team.json'), readJson('latest/widgets.json')])
        const p = P.pages.find(x => x.path === s.path)
        out.append(h('h3', {}, [code(s.path), ' ', h('a', { href: site(s.path), text: 'open the page ↗' }), ' · ', go('its graph', { view: 'graph', path: s.path })]))
        if (p) out.append(tiles(Object.fromEntries(GROUPS.map(g => [g, { views: p.views[g], tabs: '', reads: '' }]))), h('p', { text: `${p.reads} reads${p.reads ? `, on average ${secs(p.read_s_avg)} visible and ${p.scroll_avg}% down` : ''}.` }),
            h('h3', { text: 'Days' }), table(['Day', 'Views'], p.days.map(([d, n]) => [dayLink(d), n]), [1]))
        const who = Object.entries(T.people).flatMap(([person, rows]) => rows.filter(r => r.path === s.path).map(r => [personLink(person), r.views, r.reads, r.reads ? secs(r.visible_s) : '–', r.max_scroll + '%', r.last]))
        out.append(h('h3', { text: 'Who on the team read it' }), table(['Person', 'Views', 'Reads', 'Time', 'Scroll', 'Last'], who, [1, 2, 3, 4]))
        const F = await readJson('latest/flows.json'), sum = (rows, i) => { const m = {}; for (const r of rows) m[r[i]] = (m[r[i]] || 0) + r[3]; return Object.entries(m).sort((a, b) => b[1] - a[1]) }
        const inc = F.edges.filter(e => e[1] === s.path && (!s.group || e[2] === s.group)), outg = F.edges.filter(e => e[0] === s.path && (!s.group || e[2] === s.group))
        out.append(h('div', { class: 'obsv-two' }, [h('div', {}, [h('h3', { text: 'Came from' }), table(['Page', 'Tabs'], sum(inc, 0).map(([p, n]) => [pageLink(p), n]), [1])]),
            h('div', {}, [h('h3', { text: 'Went on to' }), table(['Page', 'Tabs'], sum(outg, 1).map(([p, n]) => [pageLink(p), n]), [1])])]))
        const ri = W.read_index[s.path] || { agents: {} }
        out.append(h('h3', { text: 'Agents that read it' }), table(['Agent', 'Last run'], Object.entries(ri.agents).map(([a, t]) => [agentLink(a), t])))
    }
    V.people = async out => {
        const T = await readJson('latest/team.json')
        out.append(h('h3', { text: 'The team, known by their site key' }), table(['Person', 'Pages', 'Views', 'Reads', 'Last'], Object.entries(T.people).map(([p, rows]) => [personLink(p), rows.length, rows.reduce((a, r) => a + r.views, 0), rows.reduce((a, r) => a + r.reads, 0), rows.reduce((a, r) => a > r.last ? a : r.last, '')]), [1, 2, 3]),
            h('p', { class: 'obsv-m', text: 'A signature from a key a conductor issued can also come from that conductor\'s session (WS-138).' }))
    }
    V.person = async (out, s) => {
        const T = await readJson('latest/team.json'), rows = T.people[s.person] || []
        out.append(h('h3', { text: `${s.person}: ${rows.length} pages` }), table(['Page', 'Views', 'Reads', 'Time visible', 'Deepest scroll', 'Last'], rows.map(r => [pageLink(r.path), r.views, r.reads, r.reads ? secs(r.visible_s) : '–', r.reads ? r.max_scroll + '%' : '–', r.last]), [1, 2, 3, 4]))
    }
    V.agents = async out => {
        const A = await readJson('latest/agents.json'), ran = A.agents.filter(a => a.runs), silent = A.agents.filter(a => !a.runs)
        out.append(h('h3', { text: `${ran.length} agents have logged runs; ${silent.length} with a key have not` }),
            table(['Agent', 'Runs', 'Signed', 'md', 'html', 'files', 'repo', 'Did', 'Checklist', 'Last run'], ran.map(a => { const n = Object.values(a.checklist).filter(Boolean).length
                return [agentLink(a.agent), a.runs, `${a.signed}/${a.runs}`, a.read_md, a.read_html, a.read_file || 0, a.read_repo, a.did, h('span', { class: n === A.expect.length ? 'obsv-ok' : 'obsv-warn', text: `${n}/${A.expect.length}` }), a.last] }), [1, 3, 4, 5, 6, 7]),
            h('h3', { text: 'Not logging yet' }), h('p', {}, silent.flatMap((a, i) => [i ? ', ' : '', agentLink(a.agent)])))
    }
    const CHECK = { claude_md: 'CLAUDE.md, the repository\'s rules', agents_page: 'the agents page (its own section)', brief: 'its brief', abp: 'its ABP', board: 'the board' }
    V.agent = async (out, s) => {
        const A = await readJson('latest/agents.json'), a = A.agents.find(x => x.agent === s.agent)
        if (!a) { out.append(h('p', { text: 'No such agent.' })); return }
        out.append(h('h3', { text: a.agent }), h('p', { text: a.runs ? `${a.runs} runs (${a.signed} signed) from ${a.first} to ${a.last} UTC; triggers: ${Object.entries(a.triggers).map(([k, v]) => `${k || 'unsaid'} ${v}`).join(', ')}. Read ${a.read_md} Markdown, ${a.read_html} HTML, ${a.read_file || 0} other files, ${a.read_repo} repository files; did ${a.did} things.` : 'Has a key on the keys page but has never logged a run.' }),
            h('h3', { text: 'Has it read what every agent should?' }), h('ul', { class: 'obsv-check' }, Object.entries(a.checklist).map(([k, ok]) => h('li', { class: ok ? 'obsv-ok' : 'obsv-warn', text: `${ok ? '✓' : '✗'} ${CHECK[k] || k}` }))),
            h('h3', { text: 'Everything it read' }), table(['URL or file', 'As', 'Times', 'Last'], a.reads.map(r => [urlLink(r.url), r.as, r.times, r.last]), [2]),
            h('h3', { text: 'What it did' }), table(['Run', 'What'], a.done.map(x => [x.run, x.commit ? h('span', {}, [h('a', { href: `https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/${x.commit}`, text: x.commit }), ' ', x.subject || '']) : x.release ? 'release ' + x.release : x.file ? 'file ' + x.file : x.message_to ? 'message to ' + x.message_to : (x.note || '')])))
    }
    V.url = async (out, s) => {
        const A = await readJson('latest/agents.json')
        out.append(h('h3', {}, [code(s.url)]), table(['Agent', 'As', 'Times', 'Last'], A.agents.flatMap(a => a.reads.filter(r => r.url === s.url).map(r => [agentLink(a.agent), r.as, r.times, r.last])), [2]))
    }
    V.dash = async (out, s) => {
        const [W, T, A] = await Promise.all([readJson('latest/widgets.json'), readJson('latest/team.json'), readJson('latest/agents.json')])
        // has X read Y
        const who = h('select', {}, [h('option', { value: '', text: 'anyone' }), ...Object.keys(T.people).map(p => h('option', { value: 'p:' + p, text: p })), ...A.agents.filter(a => a.runs).map(a => h('option', { value: 'a:' + a.agent, text: a.agent }))])
        const what = h('input', { type: 'text', placeholder: '/brief-vicky/ or a URL', value: s.path || '' }), ans = h('div', { class: 'obsv-ans' })
        const ask = () => { ans.textContent = ''; let k = what.value.trim().replace(/^https:\/\/web-summit\.sgit\.ai/, '').replace(/index\.(html|md)$/, ''); if (!k) return
            const ri = W.read_index[k] || W.read_index[k + '/'] || { people: {}, agents: {} }, sel = who.value
            const rows = [...Object.entries(ri.people).map(([p, t]) => ['person', p, t]), ...Object.entries(ri.agents).map(([a, t]) => ['agent', a, t])].filter(([kd, n]) => !sel || sel === (kd === 'person' ? 'p:' : 'a:') + n)
            ans.append(rows.length ? table(['', 'Who', 'Last'], rows.map(([kd, n, t]) => [kd, kd === 'person' ? personLink(n) : agentLink(n), t])) : h('p', { class: 'obsv-warn', text: sel ? 'No: not read yet (or not with their key in the browser).' : 'Nobody, yet.' })) }
        what.addEventListener('change', ask); who.addEventListener('change', ask)
        out.append(h('div', { class: 'obsv-card' }, [h('h3', { text: 'Has X read Y?' }), h('p', {}, [who, ' ', what, ' ', h('button', { type: 'button', text: 'Ask', onclick: ask })]), ans]))
        out.append(h('div', { class: 'obsv-two' }, [
            h('div', { class: 'obsv-card' }, [h('h3', { text: `Agents silent for 24 hours (${W.silent_24h.length})` }), table(['Agent', 'Last run', 'Hours'], W.silent_24h.slice(0, 50).map(([a, l, hr]) => [agentLink(a), l || 'never', hr == null ? '–' : hr]), [2])]),
            h('div', { class: 'obsv-card' }, [h('h3', { text: 'Checklist incomplete' }), table(['Agent', 'Has not read'], W.checklist_incomplete.filter(([a]) => A.agents.find(x => x.agent === a && x.runs)).map(([a, miss]) => [agentLink(a), miss.map(m => CHECK[m] || m).join(', ')]))])]))
        out.append(h('div', { class: 'obsv-two' }, [
            h('div', { class: 'obsv-card' }, [h('h3', { text: 'Acted without reading the board' }), table(['Agent', 'Runs that did', 'of runs'], W.acted_without_board.map(([a, n, r]) => [agentLink(a), n, r]), [1, 2])]),
            h('div', { class: 'obsv-card' }, [h('h3', { text: 'Markdown or HTML?' }), table(['Agent', 'md', 'html', 'files', 'repo', 'tokens/run'], W.md_vs_html.map(([a, m, x, f, r, t]) => [agentLink(a), m, x, f, r, t || '–']), [1, 2, 3, 4, 5])])]))
    }
    V.graph = async (out, s) => {   // pages as nodes, tabs moving between them as edges; a small force layout, no library
        const [F, P] = await Promise.all([readJson('latest/flows.json'), readJson('latest/pages.json')])
        let edges = F.edges.filter(e => !s.group || e[2] === s.group)
        const agg = {}; for (const [a, b, , n] of edges) agg[a + '\u0000' + b] = (agg[a + '\u0000' + b] || 0) + n
        edges = Object.entries(agg).map(([k, n]) => [...k.split('\u0000'), n])
        if (s.path) { const near = new Set([s.path, ...edges.filter(e => e[0] === s.path || e[1] === s.path).flatMap(e => [e[0], e[1]])]); edges = edges.filter(e => near.has(e[0]) && near.has(e[1])) }
        const views = Object.fromEntries(P.pages.map(p => [p.path, s.group ? p.views[s.group] : p.total]))
        const names = [...new Set(edges.flatMap(e => [e[0], e[1]]))]
        out.append(h('h3', { text: `How tabs move between pages${s.path ? ' around ' + s.path : ''}${s.group ? ' (' + LABEL[s.group] + ')' : ''}: ${names.length} pages, ${edges.length} links` }),
            h('p', { class: 'obsv-m', text: 'A circle is a page (its size: views); a line is tabs going from one page to the next (its width: how many). Click a page to open its view; filter by group with the tiles on the overview.' }))
        if (!names.length) { out.append(h('p', { text: 'No movement between pages yet.' })); return }
        const W = 1000, H = 640, N = names.map((n, i) => ({ n, x: W / 2 + 260 * Math.cos(2 * Math.PI * i / names.length), y: H / 2 + 220 * Math.sin(2 * Math.PI * i / names.length), vx: 0, vy: 0 }))
        const ix = Object.fromEntries(N.map((d, i) => [d.n, i])), L = edges.map(([a, b, n]) => ({ a: N[ix[a]], b: N[ix[b]], n }))
        for (let it = 0; it < 300; it++) {
            for (const p of N) for (const q of N) { if (p === q) continue; const dx = p.x - q.x, dy = p.y - q.y, d2 = Math.max(dx * dx + dy * dy, 100), f = 2200 / d2; p.vx += dx * f / 40; p.vy += dy * f / 40 }
            for (const { a, b } of L) { const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - 120) / d * 0.03; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f }
            for (const p of N) { p.vx += (W / 2 - p.x) * 0.002; p.vy += (H / 2 - p.y) * 0.002; p.x = Math.min(W - 60, Math.max(60, p.x + p.vx)); p.y = Math.min(H - 20, Math.max(20, p.y + p.vy)); p.vx *= 0.6; p.vy *= 0.6 }
        }
        const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'obsv-graph')
        const defs = document.createElementNS(NS, 'defs'); defs.innerHTML = '<marker id="obsv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity=".5"/></marker>'; svg.append(defs)
        const maxE = Math.max(1, ...L.map(l => l.n)), maxV = Math.max(1, ...names.map(n => views[n] || 1))
        const rad = n => 5 + 16 * Math.sqrt((views[n] || 1) / maxV)
        for (const l of L) { const dx = l.b.x - l.a.x, dy = l.b.y - l.a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, r = rad(l.b.n) + 3
            const ln = document.createElementNS(NS, 'line'); Object.entries({ x1: l.a.x, y1: l.a.y, x2: l.b.x - dx / d * r, y2: l.b.y - dy / d * r, stroke: 'currentColor', 'stroke-opacity': .35, 'stroke-width': 1 + 4 * l.n / maxE, 'marker-end': 'url(#obsv-arrow)' }).forEach(([k, v]) => ln.setAttribute(k, v))
            const tt = document.createElementNS(NS, 'title'); tt.textContent = `${l.a.n} → ${l.b.n}: ${l.n} tabs`; ln.append(tt); svg.append(ln) }
        for (const p of N) { const a = document.createElementNS(NS, 'a'); a.setAttribute('href', href({ view: 'page', path: p.n, group: s.group }))
            const c = document.createElementNS(NS, 'circle'); Object.entries({ cx: p.x, cy: p.y, r: rad(p.n), fill: p.n === s.path ? '#c47a12' : '#2f6fdb', 'fill-opacity': .8 }).forEach(([k, v]) => c.setAttribute(k, v))
            const t = document.createElementNS(NS, 'text'); Object.entries({ x: p.x + rad(p.n) + 3, y: p.y + 4 }).forEach(([k, v]) => t.setAttribute(k, v)); t.textContent = p.n.length > 34 ? '…' + p.n.slice(-33) : p.n
            const tt = document.createElementNS(NS, 'title'); tt.textContent = `${p.n}: ${views[p.n] || 0} views`; a.append(c, t, tt); svg.append(a) }
        out.append(svg)
        out.append(h('h3', { text: 'The links, busiest first' }), table(['From', 'To', 'Tabs'], edges.sort((a, b) => b[2] - a[2]).slice(0, 40).map(([a, b, n]) => [pageLink(a), pageLink(b), n]), [2]))
    }
    // ------------------------------------------------------------------ the dashboard (the design agent's SIEM spec, 5 November)
    // range: hour | today (default) | day | 48h | all; groups: a comma list (all four by default); every mark is a link
    const gsel = s => (s.groups ? s.groups.split(',').filter(g => GROUPS.includes(g)) : GROUPS)
    const gsum = (v, s) => gsel(s).reduce((a, g) => a + ((v && v[g]) || 0), 0)
    const gonly = (v, s) => Object.fromEntries(GROUPS.map(g => [g, gsel(s).includes(g) ? (v[g] || 0) : 0]))
    const rel = t => { if (!t) return 'never'; const ms = Date.now() - Date.parse(t.length === 16 ? t.replace('Z', ':00Z') : t); if (isNaN(ms)) return t; const m = Math.round(ms / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 48 * 60 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }
    const svgEl = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e }
    function spark(vals, color, w = 90, hgt = 22) {
        const svg = svgEl('svg', { viewBox: `0 0 ${w} ${hgt}`, class: 'obsx-spark', width: w, height: hgt })
        if (vals.length < 2) return svg
        const max = Math.max(1, ...vals), step = w / (vals.length - 1)
        svg.append(svgEl('polyline', { points: vals.map((v, i) => `${(i * step).toFixed(1)},${(hgt - 2 - (hgt - 4) * v / max).toFixed(1)}`).join(' '), fill: 'none', stroke: color, 'stroke-width': 1.6 }))
        return svg
    }
    const panel = (title, cols, body, more) => h('section', { class: `obsx-p c${cols}` }, [h('header', {}, [h('h3', { text: title }), more || null]), body])
    const empty = t => h('p', { class: 'obsx-empty', text: t })
    async function period(s) {   // the data behind a range: totals, pages, team, referrers, screens, runs, series, previous
        const [S, TL] = await Promise.all([readJson('latest/summary.json'), readJson('latest/timeline.json')])
        const lastKey = TL.hours.length ? TL.hours[TL.hours.length - 1][0] : ''
        const range = s.range || (s.day ? 'day' : 'today')
        if (range === 'hour') {
            const day = s.day || lastKey.slice(0, 10), hh = s.hour || lastKey.slice(11, 13), d = await readJson(`${day}/${hh}/hour.json`)
            const i = TL.hours.findIndex(x => x[0] === `${day}T${hh}`), prev = i > 0 ? TL.hours[i - 1][1] : null
            return { S, TL, range, label: `${day} ${hh}:00–${hh}:59 UTC`, day, hour: hh, totals: d.totals, pages: d.pages, team: d.team, referrers: d.referrers, screens: d.screens, runs: d.runs,
                series: Array.from({ length: 60 }, (_, m) => { const mm = String(m).padStart(2, '0'), f = (d.minutes || []).find(x => x[0] === mm); return [mm, f ? f[1] : {}] }), unit: 'minute', prev }
        }
        if (range === 'today' || range === 'day') {
            const day = s.day || (S.days.length ? S.days[S.days.length - 1][0] : ''), d = await readJson(`${day}/day.json`)
            const i = S.days.findIndex(x => x[0] === day), prev = i > 0 ? S.days[i - 1][1] : null
            return { S, TL, range, label: day, day, totals: d.totals, pages: d.pages, team: d.team, referrers: d.referrers, screens: d.screens, runs: d.runs, teamHours: d.team_hours,
                series: Array.from({ length: 24 }, (_, x) => { const hh = String(x).padStart(2, '0'), f = d.hours.find(y => y[0] === hh); return [`${day}T${hh}`, f ? f[1] : {}] }), unit: 'hour', prev }
        }
        const [P, T, RU] = await Promise.all([readJson('latest/pages.json'), readJson('latest/team.json'), readJson('latest/runs.json')])
        const hours = range === '48h' ? TL.hours.slice(-48) : TL.hours, before = range === '48h' ? TL.hours.slice(-96, -48) : []
        const sumG = rows => Object.fromEntries(GROUPS.map(g => [g, rows.reduce((a, r) => a + (r[1][g] || 0), 0)]))
        return { S, TL, range, label: range === '48h' ? 'the last 48 hours' : 'all time', totals: S.totals, pages: P.pages, team: Object.entries(T.people).flatMap(([p, rows]) => rows.map(r => ({ person: p, ...r }))),
            referrers: S.referrers, screens: S.screens, runs: RU.runs, series: hours.map(x => [x[0], x[1]]), unit: 'hour', prev: before.length ? sumG(before) : null }
    }
    function toolbar(s) {
        const range = s.range || (s.day ? 'day' : 'today'), set = (o) => href({ ...s, ...o })
        const seg = h('span', { class: 'obsx-seg' }, [['hour', 'This hour'], ['today', 'Today'], ['48h', '48 h'], ['all', 'All']].map(([r, l]) => h('a', { href: set({ range: r, day: null, hour: null }), class: range === r ? 'on' : '', text: l })))
        const dayPick = h('select', { class: 'obsx-day', title: 'a day', onchange: e => { location.hash = new URLSearchParams(Object.entries({ ...s, range: 'day', day: e.target.value, hour: '' }).filter(([, v]) => v)).toString() } }, [h('option', { value: '', text: '📅 day' })])
        readJson('latest/summary.json').then(S => S.days.slice().reverse().forEach(([d]) => dayPick.append(h('option', { value: d, text: d, selected: s.day === d ? '' : null }))))
        const sel = gsel(s)
        const pills = h('span', { class: 'obsx-pills' }, GROUPS.map(g => { const on = sel.includes(g), next = on ? sel.filter(x => x !== g) : [...sel, g]
            return h('a', { href: set({ groups: next.length === GROUPS.length || !next.length ? null : next.join(',') }), class: 'pill' + (on ? ' on' : ''), title: 'click: show or hide; the colours are the legend' }, [h('i', { style: `background:${COLOR[g]}` }), LABEL[g]]) }))
        const q = h('input', { type: 'search', class: 'obsx-q', placeholder: 'Search a page, person or agent  ( / )', list: 'obsx-ix' }), dl = h('datalist', { id: 'obsx-ix' })
        Promise.all([readJson('latest/pages.json'), readJson('latest/team.json'), readJson('latest/agents.json')]).then(([P, T, A]) => {
            for (const p of P.pages) dl.append(h('option', { value: p.path })); for (const p of Object.keys(T.people)) dl.append(h('option', { value: '@' + p })); for (const a of A.agents) dl.append(h('option', { value: a.agent })) })
        q.addEventListener('change', () => { const v = q.value.trim(); if (!v) return; location.hash = new URLSearchParams(v.startsWith('/') ? { view: 'page', path: v } : v.startsWith('@') ? { view: 'person', person: v.slice(1) } : { view: 'agent', agent: v }).toString() })
        const refresh = h('select', { class: 'obsx-ref', title: 'auto-refresh', onchange: e => { try { localStorage.setItem('ws.obsx.refresh', e.target.value) } catch { } armRefresh() } }, [['0', '⟳ off'], ['60', '⟳ 60 s'], ['300', '⟳ 5 min']].map(([v, l]) => h('option', { value: v, text: l, selected: refreshSecs() === +v ? '' : null })))
        const stamp = h('span', { class: 'obsx-stamp' })
        readJson('latest/summary.json').then(S => { stamp.textContent = `as of ${S.generated.slice(11)} · ${rel(S.generated)}`; if (Date.now() - Date.parse(S.generated.replace('Z', ':00Z')) > 70 * 60000) stamp.classList.add('old') })
        const views = h('span', { class: 'obsx-views' }, [['', 'Overview'], ['dash', 'Policies'], ['graph', 'Graph'], ['agents', 'Agents'], ['pages', 'Pages'], ['people', 'People']].map(([v, l]) => h('a', { href: href(v ? { view: v } : {}), class: (s.view || '') === v ? 'on' : '', text: l })))
        const keys = Object.keys(s).filter(k => !['view', 'range', 'groups'].includes(k))
        const chipsRow = keys.length ? h('span', { class: 'obsx-chips' }, keys.map(k => h('a', { href: href(Object.fromEntries(Object.entries(s).filter(([x]) => x !== k))), title: 'remove this filter', text: `${k}: ${s[k]} ✕` }))) : null
        return h('div', { class: 'obsx-bar' }, [h('div', { class: 'row' }, [seg, dayPick, pills, q, dl, h('span', { class: 'grow' }), refresh, stamp, drainControl]), h('div', { class: 'row' }, [views, chipsRow])])
    }
    let refreshTimer = null
    const refreshSecs = () => { try { return +(localStorage.getItem('ws.obsx.refresh') || 0) } catch { return 0 } }
    function armRefresh() { clearInterval(refreshTimer); const n = refreshSecs(); if (n) refreshTimer = setInterval(() => { jsons.clear(); trees.clear(); R = null; log('view', 'auto-refresh: reading the vault again'); render() }, n * 1000) }

    function timeline(p, s, F, D) {
        const W = 1000, H = 190, L = 34, n = p.series.length || 1, step = (W - L) / n, bw = Math.max(2, step - (n > 60 ? 1 : 3))
        const tot = p.series.map(([, v]) => gsum(v, s)), max = Math.max(1, ...tot)
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H + 46}`, class: 'obsx-tl', role: 'img', 'aria-label': 'traffic by group' })
        for (let k = 1; k <= 3; k++) { const y = H - (H - 10) * k / 3; svg.append(svgEl('line', { x1: L, x2: W, y1: y, y2: y, class: 'grid' })); const t = svgEl('text', { x: 0, y: y + 3 }); t.textContent = Math.round(max * k / 3); svg.append(t) }
        let lastDay = ''
        p.series.forEach(([key, v], i) => {
            const x = L + i * step, a = svgEl('a', { href: p.unit === 'minute' ? href({ ...s, view: '' }) : href({ ...s, range: 'hour', day: key.slice(0, 10), hour: key.slice(11, 13) }) })
            let y = H
            for (const g of GROUPS) { if (!gsel(s).includes(g)) continue; const val = v[g] || 0; if (!val) continue; const hh = (H - 10) * val / max; y -= hh; a.append(svgEl('rect', { x, y, width: bw, height: hh, fill: COLOR[g], rx: 1 })) }
            a.append(svgEl('rect', { x, y: 0, width: Math.max(bw, step), height: H, fill: 'transparent' }))
            const tt = svgEl('title', {}); tt.textContent = `${p.unit === 'minute' ? key + ' min' : key.replace('T', ' ') + ':00'} · ` + GROUPS.filter(g => gsel(s).includes(g)).map(g => `${LABEL[g]} ${v[g] || 0}`).join(' · '); a.append(tt)
            svg.append(a)
            const lab = p.unit === 'minute' ? (i % 10 === 0 ? key : '') : (n <= 24 || i % Math.ceil(n / 24) === 0 ? key.slice(11, 13) : '')
            if (lab) { const t = svgEl('text', { x, y: H + 12 }); t.textContent = lab; svg.append(t) }
            if (p.unit === 'hour' && key.slice(0, 10) !== lastDay) { if (lastDay) svg.append(svgEl('line', { x1: x - 1, x2: x - 1, y1: 0, y2: H + 40, class: 'day' })); const t = svgEl('text', { x: x + 2, y: H + 40, class: 'dl' }); t.textContent = key.slice(5, 10); svg.append(t); lastDay = key.slice(0, 10) }
        })
        // the lane: agent runs (ticks), drains (triangles), signature findings (red dots)
        const ly = H + 26, idxOf = ts => { if (!ts) return -1; if (p.unit === 'minute') return ts.slice(0, 13) === `${p.day}T${p.hour}` ? +ts.slice(14, 16) : -1; return p.series.findIndex(([k]) => k === ts.slice(0, 13)) }
        const lane = svgEl('g', {}); svg.append(svgEl('line', { x1: L, x2: W, y1: ly, y2: ly, class: 'grid' })); svg.append(lane)
        for (const r of p.runs || []) { const i = idxOf(r.run); if (i < 0) continue; const x = L + i * step + bw / 2; const m = svgEl('line', { x1: x, x2: x, y1: ly - 6, y2: ly + 6, class: 'run' }); const tt = svgEl('title', {}); tt.textContent = `agent run · ${r.agent} · ${r.run}`; m.append(tt); lane.append(m) }
        for (const d of D) { const i = idxOf(d.at); if (i < 0) continue; const x = L + i * step + bw / 2; const m = svgEl('path', { d: `M${x - 4},${ly - 9}L${x + 4},${ly - 9}L${x},${ly - 3}z`, class: 'drain' }); const tt = svgEl('title', {}); tt.textContent = `drain · ${d.by} · ${d.records} records · ${d.at}`; m.append(tt); lane.append(m) }
        for (const f of F) { const i = idxOf(f.ts); if (i < 0) continue; const x = L + i * step + bw / 2; const m = svgEl('circle', { cx: x, cy: ly + 9, r: 2.6, class: 'sec' }); const tt = svgEl('title', {}); tt.textContent = `signature finding · ${f.reason} · ${f.claimed_key}`; m.append(tt); lane.append(m) }
        const t = svgEl('text', { x: 0, y: ly + 3 }); t.textContent = 'events'; svg.append(t)
        return svg
    }
    const KCOL = { agent: '#4f46e5', team: '#1f9d6b', traffic: '#2f6fdb', security: '#d1343b', drain: '#5b6470' }
    function feedPanel(p, s, FE, F, D) {
        const inRange = ts => p.range === 'hour' ? ts.startsWith(`${p.day}T${p.hour}`) : (p.range === 'today' || p.range === 'day') ? ts.startsWith(p.day) : true
        let ev = [...FE.events.filter(e => e.kind !== 'traffic' || gsel(s).includes(e.group)),
            ...F.recent.map(f => ({ ...f, ts: f.ts, kind: 'security', what: f.kind })), ...D.map(d => ({ ...d, ts: d.at, kind: 'drain' }))].filter(e => e.ts && inRange(e.ts)).sort((a, b) => b.ts.localeCompare(a.ts))
        const counts = {}; for (const e of ev) counts[e.kind] = (counts[e.kind] || 0) + 1
        const kf = s.kind; if (kf) ev = ev.filter(e => e.kind === kf)
        const list = h('ol', { class: 'obsx-feed' }, ev.slice(0, 120).map(e => h('li', { style: `--k:${KCOL[e.kind]}` }, [h('time', { text: e.ts.slice(11, 16) }), h('b', { text: e.kind }),
            ...(e.kind === 'agent' ? [agentLink(e.agent), ' ', h('span', { class: e.signed ? 'obsv-ok' : 'obsv-warn', text: e.signed ? '✓' : 'unsigned' }), ` ${e.read} read · ${e.did} did`, e.notes ? h('small', { text: ' ' + e.notes }) : null]
              : e.kind === 'team' ? [personLink(e.person), ` ${e.type} `, pageLink(e.path), e.type === 'read' ? ` ${secs(e.visible_s)} · ${e.scroll}%` : '']
              : e.kind === 'traffic' ? [h('i', { class: 'dot', style: `background:${COLOR[e.group]}` }), `${e.n} ${e.group} → `, pageLink(e.path)]
              : e.kind === 'security' ? [`${e.what} signature, ${e.reason} · `, code(e.claimed_key || '?'), e.path ? [' on ', pageLink(e.path)] : '']
              : [`${e.by} drained ${e.records} records`]) ])))
        const chips = h('span', { class: 'obsx-kinds' }, Object.entries(counts).map(([k, n]) => h('a', { href: href({ ...s, kind: kf === k ? null : k }), class: kf === k ? 'on' : '', style: `--k:${KCOL[k]}`, text: `${k} ${n}` })))
        return panel('Live activity', 4, ev.length ? list : empty('Nothing in this range yet. Traffic appears after a drain (hourly, or Drain now).'), chips)
    }
    function topPages(p, s) {
        const rows = p.pages.map(x => ({ ...x, total: gsum(x.views, s) })).filter(x => x.total).sort((a, b) => b.total - a.total).slice(0, 15), max = Math.max(1, ...rows.map(r => r.total))
        const PG = {}; readJson('latest/pages.json').then(P => P.pages.forEach(x => PG[x.path] = x))
        return panel('Top pages', 5, rows.length ? table(['Page', '', 'Views', 'Reads', 'Time', 'Scroll'], rows.map(r => {
            const bar = h('span', { class: 'obsx-sbar', title: GROUPS.map(g => `${LABEL[g]} ${r.views[g]}`).join(' · ') }, GROUPS.filter(g => gsel(s).includes(g) && r.views[g]).map(g => h('a', { href: href({ view: 'page', path: r.path, groups: g }), style: `width:${(100 * r.views[g] / max).toFixed(1)}%;background:${COLOR[g]}` })))
            return [pageLink(r.path), bar, fmt(r.total), r.reads || '–', r.reads ? secs(r.visible_s / r.reads) : '–', r.reads ? Math.round(r.scroll_sum / r.reads) + '%' : '–'] }), [2, 3, 4, 5]) : empty('No page views in this range for the groups shown.'), go('all ⤢', { view: 'pages' }))
    }
    function heatmap(p, T) {
        if (!p.teamHours) return panel('The team, hour by hour', 3, empty('Choose Today, This hour or a day to see who read when.'))
        const people = [...new Set([...Object.keys(T.people), ...Object.keys(p.teamHours)])].sort()
        const max = Math.max(1, ...Object.values(p.teamHours).flatMap(o => Object.values(o).map(c => c[0])))
        const grid = h('div', { class: 'obsx-heat' }, [h('span'), ...Array.from({ length: 24 }, (_, i) => h('span', { class: 'hh', text: i % 6 ? '' : String(i).padStart(2, '0') })),
            ...people.flatMap(pp => [personLink(pp), ...Array.from({ length: 24 }, (_, i) => { const hh = String(i).padStart(2, '0'), c = (p.teamHours[pp] || {})[hh]
                const lvl = c ? Math.min(4, 1 + Math.floor(3 * c[0] / max)) : 0
                return c ? h('a', { class: 'c l' + lvl, href: href({ range: 'hour', day: p.day, hour: hh }), title: `${pp} · ${hh}:00 · ${c[0]} views, ${c[1]} reads · ${c[2].join(', ')}` }) : h('span', { class: 'c l0' }) })])])
        return panel('The team, hour by hour', 3, grid)
    }
    const CHECKS = ['claude_md', 'agents_page', 'brief', 'abp', 'board']
    function agentsHealth(A, RU) {
        const now = Date.now(), age = a => a.last ? (now - Date.parse(a.last.replace('Z', ':00Z'))) / 3600000 : Infinity
        const status = a => !a.runs ? 'red' : age(a) > 24 || a.acted_blind > 0 && a.runs === a.acted_blind ? 'red' : age(a) > 2 || a.signed < a.runs || !CHECKS.every(c => a.checklist[c]) ? 'amber' : 'green'
        const order = { red: 0, amber: 1, green: 2 }
        const byHour = {}; const keys = []; for (let i = 47; i >= 0; i--) { const d = new Date(now - i * 3600000); keys.push(d.toISOString().slice(0, 13)) }
        for (const r of RU.runs) (byHour[r.agent] = byHour[r.agent] || {})[r.run.slice(0, 13)] = ((byHour[r.agent] || {})[r.run.slice(0, 13)] || 0) + 1
        const ran = A.agents.filter(a => a.runs).sort((a, b) => order[status(a)] - order[status(b)] || (b.last || '').localeCompare(a.last || ''))
        const silent = A.agents.filter(a => !a.runs).length
        return panel(`Agents health · ${ran.length} logging, ${silent} silent`, 8, table(['', 'Agent', 'Last run', 'Runs', 'Signed', 'md · html · other', 'Checklist', 'Acted blind', '48 h'], ran.map(a => {
            const tot = Math.max(1, a.read_md + a.read_html + (a.read_file || 0))
            return [h('i', { class: 'obsx-light ' + status(a), title: status(a) }), agentLink(a.agent), h('span', { title: a.last, text: rel(a.last) }), a.runs, `${a.signed}/${a.runs}`,
                h('span', { class: 'obsx-mix', title: `md ${a.read_md} · html ${a.read_html} · other ${a.read_file || 0} · repo files ${a.read_repo}` }, [h('i', { style: `width:${100 * a.read_md / tot}%;background:#1f9d6b` }), h('i', { style: `width:${100 * a.read_html / tot}%;background:#c47a12` }), h('i', { style: `width:${100 * (a.read_file || 0) / tot}%;background:#8a6bd1` })]),
                h('span', { class: 'obsx-checks' }, CHECKS.map(c => h('i', { class: a.checklist[c] ? 'y' : '', title: (a.checklist[c] ? 'read: ' : 'not read: ') + (CHECK[c] || c) }))),
                a.acted_blind ? h('span', { class: 'obsv-warn', text: String(a.acted_blind) }) : '–', spark(keys.map(k => (byHour[a.agent] || {})[k] || 0), '#4f46e5', 80, 18)] }), [3]),
            go(`all ${A.agents.length} ⤢`, { view: 'agents' }))
    }
    function security(F, p) {
        const inRange = ts => p.range === 'hour' ? ts.startsWith(`${p.day}T${p.hour}`) : (p.range === 'today' || p.range === 'day') ? ts.startsWith(p.day) : true
        const rows = F.recent.filter(f => inRange(f.ts || ''))
        return panel(`Security events · ${rows.length}`, 4, rows.length ? h('div', {}, [
            h('p', { class: 'obsx-sub', text: 'Signatures that failed: the record is kept, counted as anonymous, never trusted. ' + F.by_reason.map(([r, n]) => `${r}: ${n}`).join(' · ') }),
            table(['When', 'Kind', 'Reason', 'Key claimed'], rows.slice(0, 12).map(f => [f.ts.slice(5, 16).replace('T', ' '), f.kind, f.reason, code((f.claimed_key || '').slice(0, 24))]))])
            : empty('No signature failures in this range.'))
    }
    function flowMini(FL, s) {
        const agg = {}; for (const [a, b, g, n] of FL.edges) if (gsel(s).includes(g)) agg[a + '\u0000' + b] = (agg[a + '\u0000' + b] || 0) + n
        const edges = Object.entries(agg).map(([k, n]) => [...k.split('\u0000'), n]).sort((a, b) => b[2] - a[2]).slice(0, 14)
        if (!edges.length) return panel('How readers move', 6, empty('No movement between pages yet.'))
        const left = [...new Set(edges.map(e => e[0]))], right = [...new Set(edges.map(e => e[1]))], W = 1000, rowH = 26, H = Math.max(left.length, right.length) * rowH + 10
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'obsx-flow' }), max = Math.max(...edges.map(e => e[2]))
        const ly = p => 18 + left.indexOf(p) * rowH, ry = p => 18 + right.indexOf(p) * rowH
        for (const [a, b, n] of edges) { const path = svgEl('path', { d: `M330,${ly(a) - 4} C500,${ly(a) - 4} 500,${ry(b) - 4} 670,${ry(b) - 4}`, class: 'e', 'stroke-width': 1 + 7 * n / max }); const tt = svgEl('title', {}); tt.textContent = `${a} → ${b}: ${n} tabs`; path.append(tt); svg.append(path) }
        const label = (p, x, y, anchor) => { const a = svgEl('a', { href: href({ view: 'page', path: p }) }); const t = svgEl('text', { x, y, 'text-anchor': anchor }); t.textContent = p.length > 42 ? '…' + p.slice(-41) : p; a.append(t); svg.append(a) }
        left.forEach(p => label(p, 320, ly(p), 'end')); right.forEach(p => label(p, 680, ry(p), 'start'))
        return panel('How readers move: page → next page', 6, svg, go('full graph ⤢', { view: 'graph' }))
    }
    function refScreens(p) {
        const R = (p.referrers || []).slice(0, 8), max = Math.max(1, ...R.map(r => r[1]))
        const sc = Object.fromEntries((p.screens || []).filter(x => x[0])), tot = Object.values(sc).reduce((a, b) => a + b, 0) || 1
        return [panel('Where readers came from', 3, R.length ? h('div', { class: 'obsx-hbars' }, R.map(([host, n]) => h('div', {}, [h('span', { text: host }), h('i', { style: `width:${100 * n / max}%` }), h('b', { text: String(n) })]))) : empty('No referrers in this range: visitors arrived directly.')),
            panel('Screens', 3, Object.keys(sc).length ? h('div', {}, [h('div', { class: 'obsx-stack' }, ['phone', 'tablet', 'desktop'].filter(k => sc[k]).map((k, i) => h('i', { style: `width:${100 * sc[k] / tot}%;background:${['#2f6fdb', '#8a6bd1', '#1f9d6b'][i]}`, title: `${k} ${sc[k]}` }))),
                h('p', { class: 'obsx-sub', text: ['phone', 'tablet', 'desktop'].map(k => `${k} ${sc[k] || 0}`).join(' · ') })]) : empty('No screens recorded in this range.'))]
    }
    function drainsLog(D) {
        return panel('Drains', 6, D.length ? table(['When', 'By', 'Records', 'Via'], D.slice(0, 10).map(d => [h('span', { title: d.at, text: `${d.at.slice(5).replace('T', ' ')} · ${rel(d.at)}` }), d.by === 'hourly' ? h('span', { class: 'obsx-badge', text: 'hourly' }) : personLink(d.by), d.records, d.via]), [2]) : empty('No drain recorded yet.'))
    }
    function policies(W, A) {
        const ran = new Set(A.agents.filter(a => a.runs).map(a => a.agent))
        const li = (items, f) => h('ul', { class: 'obsx-list' }, items.slice(0, 8).map(f))
        return panel('Agent policies', 6, h('div', { class: 'obsx-pol' }, [
            h('div', {}, [h('b', { text: `Silent for 24 h · ${W.silent_24h.length}` }), li(W.silent_24h, ([a, l]) => h('li', {}, [agentLink(a), h('small', { text: ' ' + (l ? rel(l) : 'never') })]))]),
            h('div', {}, [h('b', { text: `Checklist incomplete · ${W.checklist_incomplete.filter(([a]) => ran.has(a)).length}` }), li(W.checklist_incomplete.filter(([a]) => ran.has(a)), ([a, m]) => h('li', {}, [agentLink(a), h('small', { text: ' no ' + m.join(', ') })]))]),
            h('div', {}, [h('b', { text: `Acted without the board · ${W.acted_without_board.length}` }), li(W.acted_without_board, ([a, n, r]) => h('li', {}, [agentLink(a), h('small', { text: ` ${n} of ${r} runs` })]))])]), go('policies ⤢', { view: 'dash' }))
    }
    V.overview = async (out, s) => {
        const p = await period(s)
        const [FE, F, DR, A, RU, T, W, FL] = await Promise.all(['feed', 'findings', 'drains', 'agents', 'runs', 'team', 'widgets', 'flows'].map(n => readJson(`latest/${n}.json`)))
        const D = DR.drains
        // KPI strip: views per group (sparkline over the last 24 hours, delta against the previous equal period)
        const sp = p.TL.hours.slice(-24)
        const tile = (label, val, sub, sparkVals, color, prev, link, cls) => { const d = prev == null ? null : prev ? Math.round(100 * (val - prev) / prev) : (val ? 100 : 0)
            return h('a', { class: 'obsx-kpi ' + (cls || ''), href: link }, [h('span', { class: 'l', text: label }), h('b', { text: fmt(val) }),
                d == null ? null : h('span', { class: 'd ' + (d > 0 ? 'up' : d < 0 ? 'down' : ''), text: `${d > 0 ? '▲' : d < 0 ? '▼' : '='}${Math.abs(d)}%` }), h('span', { class: 's', text: sub }), spark(sparkVals, color)]) }
        const teamPeople = new Set(p.team.map(t => t.person)).size
        const runsN = (p.runs || []).length, signedN = (p.runs || []).filter(r => r.signed).length
        const inR = ts => p.range === 'hour' ? ts.startsWith(`${p.day}T${p.hour}`) : (p.range === 'today' || p.range === 'day') ? ts.startsWith(p.day) : true
        const secN = F.recent.filter(f => inR(f.ts || '')).length
        out.append(h('p', { class: 'obsx-range', text: `Showing ${p.label}` + (gsel(s).length < 4 ? ` · ${gsel(s).map(g => LABEL[g]).join(', ')}` : '') }))
        out.append(h('div', { class: 'obsx-kpis' }, [
            ...GROUPS.filter(g => gsel(s).includes(g)).map(g => tile(LABEL[g], p.totals[g].views, `${fmt(p.totals[g].tabs)} tabs · ${fmt(p.totals[g].reads)} reads`, sp.map(x => x[1][g] || 0), COLOR[g], p.prev ? p.prev[g] || 0 : null, href({ ...s, groups: g }))),
            tile('Team members', teamPeople, `of ${Object.keys(T.people).length} seen ever, by key`, sp.map(x => x[4] || 0), '#1f9d6b', null, href({ view: 'people' })),
            tile('Agent runs', runsN, `${signedN} signed · ${new Set((p.runs || []).map(r => r.agent)).size} agents`, sp.map(x => x[3] || 0), '#4f46e5', null, href({ view: 'agents' })),
            tile('Security', secN, 'signature findings', [], '#d1343b', null, href({ ...s, kind: 'security' }), secN ? 'bad' : '')]))
        const grid = h('div', { class: 'obsx-grid' })
        grid.append(panel(`Traffic · per ${p.unit}`, 8, h('div', {}, [timeline(p, s, F.recent, D), h('p', { class: 'obsx-sub', text: p.unit === 'minute' ? 'Each bar is a minute. Ticks below: agent runs; ▼ drains; red dots: signature findings.' : 'Click a bar for that hour, by minute. Ticks below: agent runs; ▼ drains; red dots: signature findings.' })])),
            feedPanel(p, s, FE, F, D), topPages(p, s), heatmap(p, T), agentsHealth(A, RU), security(F, p), flowMini(FL, s), ...refScreens(p), drainsLog(D), policies(W, A))
        out.append(grid)
    }
    V.punch = async out => {
        const S = await readJson('latest/summary.json'), today = S.days[S.days.length - 1] || ['', {}]
        const d = today[0] ? await readJson(`${today[0]}/day.json`) : null
        const people = d ? new Set(d.team.map(t => t.person)).size : 0, agents = d ? new Set(d.runs.map(r => r.agent)).size : 0
        const top = d ? d.pages.map(p => [p.path, p.views.readers + p.views.team]).sort((a, b) => b[1] - a[1])[0] : null
        out.append(h('div', { class: 'obsv-punch' }, [
            h('a', { href: href({ view: 'day', day: today[0] }) }, [h('b', { text: fmt(human(today[1])) }), h('span', { text: 'human views today' })]),
            h('a', { href: href({ view: 'people' }) }, [h('b', { text: String(people) }), h('span', { text: 'of the team read, by key' })]),
            h('a', { href: href({ view: 'agents' }) }, [h('b', { text: String(agents) }), h('span', { text: 'agents logged runs' })])]))
        out.append(bars(S.last48.map(([k, v]) => [k, v]), k => href({ view: 'hour', day: k.slice(0, 10), hour: k.slice(11, 13) }), 'The last 48 hours'))
        if (top && top[1]) out.append(h('p', {}, ['Most read today: ', pageLink(top[0]), ` (${top[1]}). `, go('Explore →', {})]))
    }

    // ------------------------------------------------------------------ Dinis: the keys sealed to him, and the drain
    let KEYS = null
    async function whoIsThis() {
        for (let i = 0; i < 30 && !window.WSKeyring; i++) await new Promise(r => setTimeout(r, 100))   // keyring.js loads after this script
        const KR = window.WSKeyring
        if (KR) { try { await Promise.race([KR.ready, new Promise(r => setTimeout(r, 2000))]) } catch { } }
        whoBox.textContent = ''
        if (!KR || !KR.person) { whoBox.append(h('p', { text: 'Anonymous: this browser holds no site key. Everything here is read with the vault\'s public read key.' })); log('who', 'no site key in this browser'); return null }
        whoBox.append(h('p', {}, ['Signed in by key as ', h('b', { text: KR.person }), ' (', code(KR.fingerprint), '). The private half is a non-extractable CryptoKey in this browser\'s IndexedDB: the page can use it, never read it.']))
        log('who', `this browser holds ${KR.person}'s site key ${KR.fingerprint}`)
        return KR.person
    }
    function drawVaults() {
        vaultBox.textContent = ''
        const rk = boxes[0].dataset.key
        vaultBox.append(h('p', {}, ['Public data ', code(cfg.vault_id), ': ', h('a', { href: `https://dev.vault.sgraph.ai/#${rk}%3A${cfg.vault_id}`, target: '_blank', rel: 'noopener', text: 'open read-only ↗' })]))
        if (KEYS) for (const v of KEYS.vaults) vaultBox.append(h('p', {}, [`${v.name} `, code(v.vault_id), ': ', h('a', { href: `https://dev.vault.sgraph.ai/#${encodeURIComponent(v.vault_key)}`, target: '_blank', rel: 'noopener', text: 'open with its vault key ↗' })]))
    }
    async function openKeys(env) {
        log('seal', `opening people/dinis/observability/sealed/${ME}.json (ws-ecies-1, sealed to ${env.key}) with this browser's key`)
        KEYS = await window.WSKeyring.open(env)
        log('seal', `opened: ${KEYS.vaults.length} vault keys and an access token, kept in this page's memory only`)
        drawVaults(); drawActions()
    }
    // the drain: a compact control in the toolbar and a drawer (the design spec): the same eight steps with their times,
    // a progress bar and a timer, the records just drained (filterable), and the last five drains. The four people whose
    // keys the vault keys are sealed to may drain: Dinis, Jose, Angelo, Silvio (Dinis, 5 November).
    const DRAINERS = ['dinis', 'jose', 'angelo', 'silvio']
    let ME = ''
    const STEPS = ['Load the vault library', 'Open the data vault with its vault key (PBKDF2, 600,000 iterations)', 'Derive the enum key from the read key',
        'List the five lanes', 'Read the drain key from identity/private/', 'Fetch and open the records', 'Write them, still sealed, to inbox/ and push', 'Mark them processed']
    const drainControl = h('span', { class: 'obsx-drain' })
    const drawer = h('aside', { class: 'obsx-drawer', hidden: '' })
    const stepList = h('ol', { class: 'obsd-steps' }), status = h('span', { class: 'obsd-status' }), justBox = h('div'), lastBox = h('div'), prog = h('div', { class: 'obsx-prog' })
    let running = false, timer = null, started = 0, stepT = [], lastRows = []
    const runBtn = h('button', { type: 'button', class: 'obsd-run', text: 'Drain now', onclick: () => runDrain() })
    drawer.append(h('header', {}, [h('b', { text: 'Drain the lanes' }), h('button', { type: 'button', class: 'x', text: '×', title: 'close (the drain keeps running)', onclick: () => { drawer.hidden = true } })]),
        h('div', { class: 'obsx-dhead' }, [runBtn, status]), prog, stepList, justBox, h('h4', { text: 'Last drains' }), lastBox,
        h('p', { class: 'obsd-m', text: 'Your browser holds your key, which opens the vault keys sealed to you; the records go to the data vault still sealed, and the hourly drain verifies them and adds them to the stats. The full log is in Behind the scenes.' }))
    document.body.append(drawer)
    const step = (i, st, detail) => { const li = stepList.children[i]; if (!li) return; const was = li.className; li.className = st; li.querySelector('small').textContent = detail || ''
        if (st === 'run' && was !== 'run') { stepT[i] = performance.now(); log('step', `${i + 1}/${STEPS.length} ${STEPS[i]}${detail ? ': ' + detail : ''}`) }
        if ((st === 'done' || st === 'skip') && stepT[i]) li.querySelector('em').textContent = `${Math.round(performance.now() - stepT[i])} ms`
        prog.style.setProperty('--p', `${100 * [...stepList.children].filter(x => x.className === 'done' || x.className === 'skip').length / STEPS.length}%`) }
    async function drawLast() {
        lastBox.textContent = ''
        try { const D = (await readJson('latest/drains.json')).drains.slice(0, 5); lastBox.append(D.length ? h('ul', { class: 'obsx-list' }, D.map(d => h('li', {}, [`${d.at.slice(5).replace('T', ' ')} · ${d.by} · ${d.records} records `, h('small', { text: rel(d.at) })]))) : h('p', { class: 'obsd-m', text: 'None yet.' })) } catch { }
    }
    async function drawControl() {
        let last = null; try { last = (await readJson('latest/drains.json')).drains[0] } catch { }
        const lastTxt = last ? `last: ${last.by} · ${rel(last.at)} · ${last.records} rec` : 'no drain yet'
        drainControl.textContent = ''                                       // after the await, so two calls cannot both append
        if (KEYS) drainControl.append(h('button', { type: 'button', class: 'obsx-dbtn' + (running ? ' busy' : ''), onclick: () => { drawer.hidden = false; drawLast() } }, [running ? '⏳ Draining…' : '⬇ Drain']), h('small', { text: ' ' + lastTxt }))
        else drainControl.append(h('small', { class: 'obsd-m', text: lastTxt }))
    }
    function runDrain() {
        if (running) return
        running = true; runBtn.disabled = true; runBtn.textContent = 'Draining…'; justBox.textContent = ''; stepT = []
        stepList.textContent = ''; STEPS.forEach(t => stepList.append(h('li', {}, [t, ' ', h('small'), h('em')])))
        started = performance.now(); timer = setInterval(() => { status.textContent = `${((performance.now() - started) / 1000).toFixed(1)} s` }, 100); drawControl()
        drain().then(n => { status.textContent = `done in ${((performance.now() - started) / 1000).toFixed(1)} s: ${n} records` })
            .catch(x => { status.textContent = 'stopped: ' + (x && x.message || x); log('error', String(x && x.message || x)); const cur = stepList.querySelector('.run'); if (cur) cur.className = 'err' })
            .finally(() => { clearInterval(timer); running = false; runBtn.disabled = false; runBtn.textContent = 'Drain again'; drawControl() })
    }
    function showJust(rows, filter = 'all') {
        lastRows = rows; justBox.textContent = ''
        if (!rows.length) { justBox.append(h('p', { class: 'obsd-m', text: 'Nothing was waiting in the lanes.' })); return }
        const mine = rows.filter(e => e.person === ME).length
        const F = { all: () => true, mine: e => e.person === ME, team: e => e.person, agents: e => e.type === 'web-summit.agent-run/v1', traffic: e => e.type !== 'web-summit.agent-run/v1' && !e.person }
        const sel = rows.filter(F[filter])
        justBox.append(h('h4', { text: `Just drained: ${rows.length} records, ${mine} of them yours` }),
            h('p', { class: 'obsx-kinds' }, Object.keys(F).map(k => h('a', { href: '#', class: k === filter ? 'on' : '', text: `${k} ${rows.filter(F[k]).length}`, onclick: e => { e.preventDefault(); showJust(lastRows, k) } }))),
            h('div', { class: 'obsx-just' }, [table(['When', 'What', 'Page or agent', 'Who', 'Time'], sel.sort((a, b) => String(b.ts || b.run).localeCompare(String(a.ts || a.run))).map(e => e.type === 'web-summit.agent-run/v1'
                ? [(e.run || '').slice(11, 16), 'agent run', agentLink(e.agent), e.sig ? 'signed' : 'unsigned', `${(e.read || []).length} read`]
                : [(e.ts || '').slice(11, 16), e.type, pageLink(e.path), e.person ? e.person + (e.sig ? ' ✓' : '') : e.agent || 'anonymous', e.type === 'read' ? `${secs(e.visible_s)} · ${e.scroll}%` : '']))]))
    }
    function drawActions() {
        actBox.textContent = ''
        if (!KEYS) { actBox.append(h('p', { class: 'obsd-m', text: 'Only for Dinis, Jose, Angelo and Silvio: the vault keys are sealed to their site keys.' })); return }
        actBox.append(h('button', { type: 'button', text: 'Open the drain', onclick: () => { drawer.hidden = false; drawLast() } }), h('p', { class: 'obsd-m', text: 'Or ⬇ Drain in the toolbar.' }))
        drawControl()
    }
    let libP = null
    const loadLib = () => libP || (libP = (async () => {
        const dir = BASE + 'assets/vendor/sg-vault/2026-11-04/'
        for (const f of ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js', 'sg-vault/sg-vault-ref-manager.js', 'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js', 'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js', 'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js'])
            await new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = dir + f; sc.onload = ok; sc.onerror = () => no(new Error('could not load ' + f)); document.head.append(sc) })
        log('lib', 'loaded the SG/Vault library (12 scripts, pinned copy on this site)')
    })())
    const b64 = buf => { let s = ''; for (const x of new Uint8Array(buf)) s += String.fromCharCode(x); return btoa(s) }
    const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    async function drain() {
        step(0, 'run'); await loadLib(); step(0, 'done')
        const data = KEYS.vaults.find(v => v.vault_id === 'kuuqr3do'), ep = KEYS.endpoint
        const sgSend = new SGSend({ endpoint: ep, token: KEYS.access_token })
        step(1, 'run', 'kuuqr3do'); log('vault', 'opening the data vault kuuqr3do with its vault key (PBKDF2, 600,000 iterations, twice)…')
        const vault = await SGVault.open(sgSend, SGVaultCrypto.stripKeyPrefix(data.vault_key), { cloneBranch: 'obs-browser-' + ME })
        step(1, 'done', vault.writable ? 'writable' : 'read-only'); step(2, 'run')
        const rk = await vault.readKeyRawBytes()
        const enumKey = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array([...enc.encode('sg-inbox-enum:'), ...rk])))].map(x => x.toString(16).padStart(2, '0')).join('')
        log('derive', `enum key = SHA-256("sg-inbox-enum:" || read key): ${enumKey.slice(0, 8)}… (lists and fetches every lane)`)
        step(2, 'done', enumKey.slice(0, 8) + '…'); step(3, 'run')
        const api = async (op, body) => { const r = await fetch(`${ep}/api/vault/append/${op}/kuuqr3do`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': enumKey }, body: JSON.stringify(body) }); if (!r.ok) throw new Error(`${op}: HTTP ${r.status}`); return r.json() }
        const entries = []; let after = null
        for (;;) { const r = await api('list', { include_content: false, limit: 200, ...(after ? { after_file_id: after } : {}) }); entries.push(...(r.entries || [])); if (!r.truncated || !(r.entries || []).length) break; after = r.entries[r.entries.length - 1].file_id }
        log('lanes', `${entries.length} records pending`); step(3, 'done', `${entries.length} waiting`)
        if (!entries.length) { for (let i = 4; i < STEPS.length; i++) step(i, 'skip', 'nothing to do'); showJust([]); return 0 }
        step(4, 'run')
        if (vault.needsLoading('/identity')) await vault.loadSubTreeOnDemand('/identity')
        if (vault.needsLoading('/identity/private')) await vault.loadSubTreeOnDemand('/identity/private')
        const pem = dec.decode(await vault.getFile('/identity/private', 'private_key.pem'))
        const key = await crypto.subtle.importKey('pkcs8', unb64(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt'])
        log('key', 'the drain key (RSA-OAEP 4096) read from identity/private/ and imported non-extractable'); step(4, 'done', 'RSA-OAEP 4096'); step(5, 'run', `0 of ${entries.length}`)
        const byLane = {}; for (const e of entries) (byLane[e.inbox] = byLane[e.inbox] || []).push(e.file_id)
        const lines = [], shown = []
        for (const [token, ids] of Object.entries(byLane)) for (let i = 0; i < ids.length; i += 50) {
            const r = await api('fetch', { inbox: token, file_ids: ids.slice(i, i + 50) })
            for (const f of r.files || []) {
                lines.push(JSON.stringify({ file_id: f.file_id, lane: token.slice(0, 6), content: f.content }))
                try {
                    const env = JSON.parse(atob(atob(f.content)))
                    const aes = await crypto.subtle.importKey('raw', await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, unb64(env.w)), 'AES-GCM', false, ['decrypt'])
                    const ev = JSON.parse(dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(env.i) }, aes, unb64(env.c))))
                    shown.push(ev); log('record', ev.type === 'web-summit.agent-run/v1' ? `agent run: ${ev.agent}, ${(ev.read || []).length} read` : `${ev.type} ${ev.path} ${ev.person ? 'by ' + ev.person + ' (signed)' : ev.agent ? '(' + ev.agent + ')' : '(anonymous)'} ${ev.type === 'read' ? ev.visible_s + 's, ' + ev.scroll + '%' : ''}`)
                } catch (e) { log('record', 'could not open one record: ' + e.message) }
                step(5, 'run', `${lines.length} of ${entries.length}`)
            }
        }
        step(5, 'done', `${shown.length} opened`); showJust(shown.slice()); step(6, 'run')
        const name = `browser-${ME}-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`
        if (vault.needsLoading('/inbox')) await vault.loadSubTreeOnDemand('/inbox')
        if (!vault.listFolder('/inbox')) await vault.createFolder('/inbox')
        await vault.addFile('/inbox', name, enc.encode(lines.join('\n') + '\n'))
        log('vault', `committed inbox/${name} (${lines.length} records, still sealed): one encrypted commit`)
        await vault.pushIfMatch()
        log('vault', 'pushed (compare-and-swap on the named branch)'); step(6, 'done', name); step(7, 'run')
        for (const [token, ids] of Object.entries(byLane)) for (let i = 0; i < ids.length; i += 100) await api('mark-processed', { inbox: token, file_ids: ids.slice(i, i + 100) })
        log('lanes', `${entries.length} records marked processed; the hourly drain folds them into the stats`); step(7, 'done', `${entries.length}`)
        return entries.length
    }

    // ------------------------------------------------------------------ boot
    const style = h('style', { text: `
.obs-view table{width:100%;border-collapse:collapse;font-size:14px}.obs-view th,.obs-view td{text-align:left;padding:5px 8px;border-bottom:1px solid #8883;vertical-align:top}.obs-view th{font-size:12px;opacity:.75}.obs-view .n{text-align:right;font-variant-numeric:tabular-nums}.obs-view code,.obsv-path{font-family:ui-monospace,monospace;font-size:12px;word-break:break-all}.obsv-scroll{overflow-x:auto}
.obsv-tiles,.obsv-punch{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:10px 0}.obsv-tiles>a,.obsv-punch>a{border:1px solid #8884;border-radius:8px;padding:8px 10px;text-decoration:none;color:inherit}.obsv-tiles>a.sel{outline:2px solid #1f9d6b}.obsv-tiles b,.obsv-punch b{display:block;font-size:24px}.obsv-punch b{font-size:32px}.obsv-tiles span,.obsv-punch span{font-size:12px;opacity:.8}.obsv-tiles i,.dot{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px}
.obsv-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px}.obs-view h3{font-size:15px;margin:16px 0 6px}.obsv-ok{color:#1f9d6b}.obsv-warn{color:#c47a12}.obsv-check{list-style:none;padding:0}.obsv-m,.obsd-m{font-size:12px;opacity:.75}
.obsv-bars{width:100%;height:auto}.obsv-bars text{fill:currentColor;opacity:.6;font-size:10px}.obsv-bars a:hover rect{opacity:.8}.obsv-chips{display:flex;flex-wrap:wrap;gap:6px}.obsv-chips .chip{border:1px solid #8885;border-radius:14px;padding:2px 10px;font-size:13px;text-decoration:none}.obsv-chips .chip.sel{background:#1f9d6b;color:#fff;border-color:#1f9d6b}.obsv-chips .chip.f{background:#8881}
.obsv-graph{width:100%;height:auto;border:1px solid #8883;border-radius:8px}.obsv-graph text{fill:currentColor;font:11px ui-monospace,monospace}.obsv-graph a:hover circle{fill-opacity:1;stroke:currentColor}.obsv-open{text-decoration:none;opacity:.55;font-size:12px}.obsv-open:hover{opacity:1}
.obsv-card{border:1px solid #8884;border-radius:8px;padding:4px 12px 10px;margin:10px 0}.obsv-card input{min-width:240px}
.obsd-toggle{position:fixed;right:0;top:45%;z-index:60;writing-mode:vertical-rl;transform:rotate(180deg);border:1px solid #8886;border-right:0;border-radius:0 8px 8px 0;background:#1d1d1b;color:#fff;padding:10px 6px;font:12px system-ui;cursor:pointer}.obsd-toggle.on{right:min(var(--obsd-w,440px),92vw)}
.obsd-pane{position:fixed;top:0;right:0;bottom:0;width:min(var(--obsd-w,440px),92vw);z-index:59;overflow:auto;background:#16171a;color:#e8e6e1;font:12px/1.45 ui-monospace,monospace;padding:10px 12px;box-shadow:-4px 0 18px #0005}.obsd-pane header{display:flex;justify-content:space-between;align-items:center;font:14px system-ui;margin-bottom:6px}.obsd-pane header button{background:none;border:0;color:inherit;font-size:20px;cursor:pointer}
.obsd-pane h4{font:600 12px system-ui;margin:12px 0 4px;color:#9fd3b9;text-transform:uppercase;letter-spacing:.04em}.obsd-pane a{color:#8fb8ff}.obsd-pane code{color:#ffd28a;background:none;padding:0;border:0;word-break:break-all;font-size:11px}.obsd-pane table{width:100%;border-collapse:collapse}.obsd-pane td,.obsd-pane th{padding:2px 4px;border-bottom:1px solid #fff1;text-align:left;background:none;color:inherit}.obsd-pane th{opacity:.6;font-weight:600}
.obsd-pane button{font:12px system-ui;padding:5px 10px;border-radius:6px;border:1px solid #9fd3b9;background:#1f3a2e;color:#fff;cursor:pointer}.obsd-drain{border:2px solid #1f9d6b;border-radius:10px;padding:10px 14px;margin:10px 0}.obsd-drain .obsd-run{font:600 14px system-ui;padding:6px 16px;border-radius:8px;border:0;background:#1f9d6b;color:#fff;cursor:pointer}.obsd-drain .obsd-run:disabled{opacity:.6}.obsd-status{font:600 13px ui-monospace,monospace;margin:0 8px}.obsd-steps{margin:8px 0 0 18px;padding:0;font-size:13px}.obsd-steps li{opacity:.45;padding:1px 0}.obsd-steps li small{margin-left:6px;opacity:.8;font-family:ui-monospace,monospace}.obsd-steps li.run{opacity:1;font-weight:600}.obsd-steps li.run::after{content:' ⏳'}.obsd-steps li.done{opacity:.9}.obsd-steps li.done::after{content:' ✓';color:#1f9d6b}.obsd-steps li.skip{opacity:.5}.obsd-steps li.err{opacity:1;color:#c0392b}.obsd-steps li.err::after{content:' ✗'}
html.obsd-docked body{margin-right:var(--obsd-w,440px)}html.obsd-docked .fb-btn{right:calc(var(--obsd-w,440px) + 16px)}
.obsd-grip{position:fixed;top:0;bottom:0;right:calc(min(var(--obsd-w,440px),92vw) - 4px);width:8px;cursor:col-resize;touch-action:none;z-index:1}.obsd-grip:hover,.obsd-grip.on{background:#9fd3b955}
@media (max-width:760px){html.obsd-docked body{margin-right:0}.obsd-grip{display:none}}
body[data-section="observability"] .frame{max-width:none}body[data-section="observability"] nav.site .row,body[data-section="observability"] footer .row{max-width:none}
.obsx-bar{position:sticky;top:var(--obsx-top,0);z-index:20;background:var(--bg,#faf9f5);border-bottom:1px solid var(--line,#e5e1d5);padding:8px 0;margin:0 0 10px}.obsx-bar .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:3px 0}.obsx-bar .grow{flex:1}
.obsx-seg{display:inline-flex;border:1px solid var(--line-2,#d5d0c2);border-radius:8px;overflow:hidden}.obsx-seg a{padding:4px 10px;font-size:13px;text-decoration:none;color:inherit;border-right:1px solid var(--line,#e5e1d5)}.obsx-seg a:last-child{border:0}.obsx-seg a.on{background:var(--accent,#0f766e);color:#fff}
.obsx-bar select,.obsx-q{font:13px system-ui;padding:4px 8px;border:1px solid var(--line-2,#d5d0c2);border-radius:8px;background:var(--surface,#fff);color:inherit}.obsx-q{min-width:260px}
.obsx-pills{display:inline-flex;gap:4px;flex-wrap:wrap}.obsx-pills .pill{font-size:12px;padding:3px 9px;border-radius:14px;border:1px solid var(--line-2,#d5d0c2);text-decoration:none;color:inherit;opacity:.45}.obsx-pills .pill.on{opacity:1}.obsx-pills i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px}
.obsx-stamp{font:12px ui-monospace,monospace;color:var(--ink-2,#5c5f66)}.obsx-stamp.old{color:#c47a12;font-weight:600}
.obsx-views{display:inline-flex;gap:2px}.obsx-views a{font-size:13px;padding:3px 10px;border-radius:6px;text-decoration:none;color:inherit}.obsx-views a.on{background:var(--surface-2,#f2f0e9);font-weight:600}
.obsx-chips{display:inline-flex;gap:6px;flex-wrap:wrap}.obsx-chips a{font-size:12px;padding:2px 9px;border-radius:12px;background:var(--surface-2,#f2f0e9);text-decoration:none;color:inherit}
.obsx-drain .obsx-dbtn{font:600 13px system-ui;padding:5px 12px;border-radius:8px;border:0;background:#1f9d6b;color:#fff;cursor:pointer}.obsx-drain .obsx-dbtn.busy{background:#c47a12}.obsx-drain small{font-size:12px;color:var(--ink-2,#5c5f66)}
.obsx-range{font-size:13px;color:var(--ink-2,#5c5f66);margin:4px 0}
.obsx-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:6px 0 12px}.obsx-kpi{display:grid;grid-template-columns:1fr auto;grid-template-areas:"l d" "b sp" "s sp";background:var(--surface,#fff);border:1px solid var(--line,#e5e1d5);border-radius:10px;padding:9px 12px;text-decoration:none;color:inherit;box-shadow:var(--shadow)}
.obsx-kpi .l{grid-area:l;font:600 11px system-ui;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-2,#5c5f66)}.obsx-kpi b{grid-area:b;font-size:28px;font-variant-numeric:tabular-nums;line-height:1.15}.obsx-kpi .d{grid-area:d;font:600 12px system-ui;color:var(--ink-2,#5c5f66)}.obsx-kpi .d.up{color:#1f9d6b}.obsx-kpi .d.down{color:#c47a12}.obsx-kpi .s{grid-area:s;font-size:11px;color:var(--ink-2,#5c5f66)}.obsx-kpi .obsx-spark{grid-area:sp;align-self:end}.obsx-kpi.bad b{color:#d1343b}
.obsx-grid{container-type:inline-size;align-items:start;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}
.obsx-p{background:var(--surface,#fff);border:1px solid var(--line,#e5e1d5);border-radius:10px;padding:10px 12px;box-shadow:var(--shadow);min-width:0}.obsx-p header{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:6px}.obsx-p header h3{margin:0!important;font:600 12px system-ui!important;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-2,#5c5f66)}.obsx-p header a{font-size:12px}
.c3{grid-column:span 3}.c4{grid-column:span 4}.c5{grid-column:span 5}.c6{grid-column:span 6}.c8{grid-column:span 8}.c12{grid-column:span 12}
@container (max-width:1100px){.c3,.c4,.c5,.c6,.c8{grid-column:span 6}.c8{grid-column:span 12}}
@container (max-width:700px){.c3,.c4,.c5,.c6,.c8{grid-column:span 12}}
.obsx-empty{color:var(--ink-2,#5c5f66);font-size:13px;margin:10px 0}.obsx-sub{font-size:12px;color:var(--ink-2,#5c5f66);margin:4px 0}
.obsx-tl{width:100%;height:auto}.obsx-tl text{fill:currentColor;opacity:.55;font:10px ui-monospace,monospace}.obsx-tl .grid{stroke:currentColor;opacity:.12}.obsx-tl .day{stroke:currentColor;opacity:.25;stroke-dasharray:2 3}.obsx-tl .dl{opacity:.8}.obsx-tl a:hover rect{filter:brightness(1.15)}.obsx-tl .run{stroke:#4f46e5;stroke-width:2}.obsx-tl .drain{fill:#5b6470}.obsx-tl .sec{fill:#d1343b}
.obsx-feed{list-style:none;margin:0;padding:0;max-height:430px;overflow:auto;font-size:12px}.obsx-feed li{border-left:3px solid var(--k);padding:3px 6px;margin:2px 0;background:var(--surface-2,#f2f0e9);border-radius:0 6px 6px 0;line-height:1.4}.obsx-feed time{font-family:ui-monospace,monospace;opacity:.7;margin-right:6px}.obsx-feed b{font:600 10px system-ui;text-transform:uppercase;color:var(--k);margin-right:6px}.obsx-feed small{opacity:.7}
.obsx-kinds{display:inline-flex;gap:4px;flex-wrap:wrap}.obsx-kinds a{font-size:11px;padding:1px 7px;border-radius:10px;border:1px solid var(--k,#8886);text-decoration:none;color:inherit}.obsx-kinds a.on{background:var(--k,#1f9d6b);color:#fff}
.obsx-sbar{display:flex;height:10px;min-width:90px;border-radius:3px;overflow:hidden;background:var(--surface-2,#f2f0e9)}.obsx-sbar a{display:block;height:100%}
.obsx-heat{display:grid;grid-template-columns:auto repeat(24,1fr);gap:2px;font-size:11px;align-items:center}.obsx-heat .hh{font:9px ui-monospace,monospace;opacity:.6;white-space:nowrap;overflow:visible;width:0}.obsx-heat .c{display:block;height:14px;border-radius:2px;border:1px solid var(--line,#e5e1d5)}.obsx-heat .l1{background:#d6f0e3}.obsx-heat .l2{background:#9fdcbf}.obsx-heat .l3{background:#5cc196}.obsx-heat .l4{background:#1f9d6b}.obsx-heat>a:not(.c){padding-right:6px;white-space:nowrap}
.obsx-light{display:inline-block;width:10px;height:10px;border-radius:50%}.obsx-light.green{background:#1f9d6b}.obsx-light.amber{background:#c47a12}.obsx-light.red{background:#d1343b}
.obsx-mix{display:flex;width:90px;height:8px;border-radius:3px;overflow:hidden;background:var(--surface-2,#f2f0e9)}.obsx-mix i{display:block;height:100%}
.obsx-checks{display:inline-flex;gap:2px}.obsx-checks i{display:inline-block;width:10px;height:10px;border-radius:2px;border:1px solid #1f9d6b}.obsx-checks i.y{background:#1f9d6b}
.obsx-flow{width:100%;height:auto}.obsx-flow text{fill:currentColor;font:11px ui-monospace,monospace}.obsx-flow .e{fill:none;stroke:#2f6fdb;stroke-opacity:.35}.obsx-flow .e:hover{stroke-opacity:.8}
.obsx-hbars>div{display:grid;grid-template-columns:minmax(80px,40%) 1fr auto;gap:6px;align-items:center;font-size:12px;margin:3px 0}.obsx-hbars i{display:block;height:8px;background:#2f6fdb;border-radius:2px}.obsx-hbars span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.obsx-stack{display:flex;height:16px;border-radius:4px;overflow:hidden}.obsx-stack i{display:block;height:100%}
.obsx-badge{font-size:11px;padding:1px 7px;border-radius:9px;background:var(--surface-2,#f2f0e9)}
.obsx-pol{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;font-size:12px}.obsx-list{list-style:none;padding:0;margin:4px 0;font-size:12px}.obsx-list li{margin:2px 0}.obsx-list small{opacity:.7}
.obsx-p table{font-size:12px!important}.obsx-p th,.obsx-p td{padding:3px 6px!important}
.obsx-drawer{position:fixed;top:0;bottom:0;right:0;width:min(480px,94vw);z-index:58;background:var(--surface,#fff);color:var(--ink,#1c1d21);border-left:1px solid var(--line-2,#d5d0c2);box-shadow:-8px 0 24px rgb(0 0 0/.12);overflow:auto;padding:12px 16px}html.obsd-docked .obsx-drawer{right:min(var(--obsd-w,440px),92vw)}
.obsx-drawer header{display:flex;justify-content:space-between;align-items:center;font-size:16px}.obsx-drawer .x{border:0;background:none;font-size:22px;cursor:pointer;color:inherit}.obsx-drawer h4{font:600 12px system-ui;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-2,#5c5f66);margin:14px 0 4px}
.obsx-dhead{display:flex;align-items:center;gap:8px;margin:8px 0}.obsx-dhead .obsd-run{font:600 14px system-ui;padding:6px 16px;border-radius:8px;border:0;background:#1f9d6b;color:#fff;cursor:pointer}.obsx-dhead .obsd-run:disabled{opacity:.6}
.obsx-prog{height:6px;border-radius:3px;background:var(--surface-2,#f2f0e9);position:relative;overflow:hidden}.obsx-prog::after{content:'';position:absolute;left:0;top:0;bottom:0;width:var(--p,0%);background:#1f9d6b;transition:width .2s}
.obsx-drawer .obsd-steps li em{float:right;font:11px ui-monospace,monospace;opacity:.6;font-style:normal}.obsx-just{max-height:320px;overflow:auto}.obsx-drawer table{font-size:12px;width:100%;border-collapse:collapse}.obsx-drawer th,.obsx-drawer td{padding:3px 6px;border-bottom:1px solid var(--line,#e5e1d5);text-align:left;vertical-align:top}.obsx-drawer .obsv-path{font-size:11px}
.obsd-log{list-style:none;padding:0;margin:0;max-height:40vh;overflow:auto}.obsd-log li{padding:1px 0;border-bottom:1px solid #fff1}.obsd-log li span{opacity:.5}.obsd-log b{color:#9fd3b9}.obsd-log .k-error b{color:#ff8a8a}.obsd-log .k-record b{color:#ffd28a}` })
    document.head.append(style)
    const render = async () => {
        for (const box of boxes) {
            const out = box.querySelector('[data-out]'), note = box.querySelector('[data-note]'), s = state(), started = performance.now()
            const mode = box.dataset.view === 'punch' ? 'punch' : (s.view || box.dataset.view || 'overview')
            out.textContent = ''
            if (mode !== 'punch') { out.append(toolbar(s.view ? s : (box.dataset.view && !['explore', 'overview'].includes(box.dataset.view) ? { ...s, view: box.dataset.view } : s))); drawControl() }
            const body = h('div'); out.append(body)
            try {
                await (V[mode === 'explore' ? 'overview' : mode] || V.overview)(body, s)
                const S = await readJson('latest/summary.json')
                note.textContent = `Decrypted in your browser from vault ${cfg.vault_id}: ${FILES.length} files, ${fmt(bytes)} bytes · as of ${S.generated} UTC · refreshed hourly · ${Math.round(performance.now() - started)} ms`
            } catch (e) { note.textContent = 'Could not read the vault: ' + (e && e.message || e); log('error', String(e && e.message || e)) }
        }
    }
    window.addEventListener('hashchange', () => { log('view', location.hash || '#overview'); render() })
    document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { const q = document.querySelector('.obsx-q'); if (q) { e.preventDefault(); q.focus() } } if (e.key === 'Escape') drawer.hidden = true })
    const navH = () => { const n = document.querySelector('nav.site'); const st = n && getComputedStyle(n).position; document.documentElement.style.setProperty('--obsx-top', (n && (st === 'sticky' || st === 'fixed') ? n.offsetHeight : 0) + 'px') }
    navH(); window.addEventListener('resize', navH)
    render(); armRefresh()
    drawVaults(); drawActions()
    whoIsThis().then(async person => {
        if (!DRAINERS.includes(person)) { drawControl(); return }
        ME = person
        try { const env = await (await fetch(BASE + `people/dinis/observability/sealed/${person}.json`, { cache: 'no-cache' })).json(); await openKeys(env) }
        catch (e) { log('error', 'could not open the sealed vault keys: ' + e.message) }
    })
})()
