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
    const toggle = h('button', { type: 'button', class: 'obsd-toggle', title: 'What happens behind the scenes', text: 'Behind the scenes', onclick: () => { pane.hidden = !pane.hidden; toggle.classList.toggle('on', !pane.hidden); try { localStorage.setItem('ws.obsd.pane', pane.hidden ? '0' : '1') } catch { } } })
    const sec = (title, body) => h('section', {}, [h('h4', { text: title }), body])
    const whoBox = h('div'), vaultBox = h('div'), actBox = h('div'), filesBox = h('div'), logBox = h('ol', { class: 'obsd-log' })
    pane.append(h('header', {}, [h('b', { text: 'Behind the scenes' }), h('button', { type: 'button', text: '×', onclick: () => toggle.click() })]),
        sec('Who this browser is', whoBox), sec('The vaults', vaultBox), sec('Actions', actBox), sec('Encrypted files read', filesBox), sec('Log', logBox))
    listeners.push(e => { logBox.append(h('li', { class: 'k-' + e.kind }, [h('span', { text: e.t + 's' }), ' ', h('b', { text: e.kind }), ' ', e.msg])); logBox.scrollTop = logBox.scrollHeight })
    const drawFiles = () => { filesBox.textContent = ''; filesBox.append(h('table', {}, [h('tr', {}, ['File', 'Objects', 'Bytes', 'ms'].map(x => h('th', { text: x }))),
        ...FILES.map(f => h('tr', {}, [h('td', {}, [code(f.path)]), h('td', { text: f.objects }), h('td', { text: fmt(f.bytes) }), h('td', { text: f.ms })]))]),
        h('p', { class: 'obsd-m', text: `${FILES.length} files, ${fmt(FILES.reduce((a, f) => a + f.bytes, 0))} bytes of ciphertext, all decrypted here with Web Crypto.` })) }
    document.body.append(toggle, pane)
    try { if (localStorage.getItem('ws.obsd.pane') === '1') { pane.hidden = false; toggle.classList.add('on') } } catch { }

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
    V.overview = async (out, s) => {
        const S = await readJson('latest/summary.json')
        out.append(tiles(S.totals, [h('a', { href: href({ view: 'agents' }) }, [h('b', { text: fmt(S.agents.runs) }), h('span', { text: `Agent runs · ${S.agents.count} agents · ${fmt(S.agents.signed)} signed` })])]))
        out.append(h('h3', { text: 'By day (click a day for its hours)' }), bars(S.days.map(([d, v]) => [d, v]), d => href({ view: 'day', day: d }), 'Views per day'))
        out.append(h('h3', { text: 'The last 48 hours (click an hour)' }), bars(S.last48.map(([k, v]) => [k, v]), k => href({ view: 'hour', day: k.slice(0, 10), hour: k.slice(11, 13) }), 'Views per hour'), legend())
        const P = await readJson('latest/pages.json')
        out.append(h('div', { class: 'obsv-two' }, [
            h('div', {}, [h('h3', {}, [go('Pages', { view: 'pages', group: s.group })]), table(['Page', 'Views', 'Readers', 'Team', 'Reads'], groupRows(P.pages, s).slice(0, 12).map(p => [pageLink(p.path), fmt(p.total), fmt(p.views.readers), fmt(p.views.team), fmt(p.reads)]), [1, 2, 3, 4])]),
            h('div', {}, [h('h3', {}, [go('Latest agent runs', { view: 'agents' })]), table(['Run', 'Agent', 'Read', 'Did'], S.agents.latest.map(([run, a, r, d]) => [run.slice(5).replace('T', ' '), agentLink(a), r, d]), [2, 3])])]))
        if (S.referrers.length) out.append(h('h3', { text: 'Where readers came from' }), table(['Host', 'Views'], S.referrers.map(([r, n]) => [r, n]), [1]))
    }
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
        log('seal', `opening people/dinis/observability/sealed-keys.json (ws-ecies-1, sealed to ${env.key}) with this browser's key`)
        KEYS = await window.WSKeyring.open(env)
        log('seal', `opened: ${KEYS.vaults.length} vault keys and an access token, kept in this page's memory only`)
        drawVaults(); drawActions()
    }
    // the drain's own panel, at the top of the explorer (Dinis only): a button, the steps as they run, a timer, and
    // the records just drained, so "a drain takes a little while" is something you can watch
    const STEPS = ['Load the vault library', 'Open the data vault with its vault key (PBKDF2, 600,000 iterations)', 'Derive the enum key from the read key',
        'List the five lanes', 'Read the drain key from identity/private/', 'Fetch and open the records', 'Write them, still sealed, to inbox/ and push', 'Mark them processed']
    const panel = h('div', { class: 'obsd-drain', hidden: '' })
    const stepList = h('ol', { class: 'obsd-steps' }), status = h('span', { class: 'obsd-status' }), justBox = h('div')
    let running = false, timer = null, started = 0
    const step = (i, state, detail) => { const li = stepList.children[i]; if (!li) return; const was = li.className; li.className = state; li.querySelector('small').textContent = detail || ''; if (state === 'run' && was !== 'run') log('step', `${i + 1}/${STEPS.length} ${STEPS[i]}${detail ? ': ' + detail : ''}`) }
    const runBtn = h('button', { type: 'button', class: 'obsd-run', text: 'Drain now', onclick: () => runDrain() })
    panel.append(h('div', { class: 'obsd-head' }, [h('b', { text: 'Your drain' }), ' ', runBtn, ' ', status,
        h('span', { class: 'obsd-m', text: ' Only this browser can do this: it holds your key, which opens the vault keys sealed to you.' })]), stepList, justBox)
    function runDrain() {
        if (running) return
        running = true; runBtn.disabled = true; runBtn.textContent = 'Draining…'; justBox.textContent = ''
        stepList.textContent = ''; STEPS.forEach(t => stepList.append(h('li', {}, [t, ' ', h('small')])))
        started = performance.now(); timer = setInterval(() => { status.textContent = `${((performance.now() - started) / 1000).toFixed(1)} s` }, 100)
        if (pane.hidden) toggle.click()
        drain().then(n => { status.textContent = `done in ${((performance.now() - started) / 1000).toFixed(1)} s: ${n} records` })
            .catch(x => { status.textContent = 'stopped: ' + (x && x.message || x); log('error', String(x && x.message || x)); const cur = stepList.querySelector('.run'); if (cur) cur.className = 'err' })
            .finally(() => { clearInterval(timer); running = false; runBtn.disabled = false; runBtn.textContent = 'Drain again' })
    }
    function showJust(rows) {
        justBox.textContent = ''
        if (!rows.length) { justBox.append(h('p', { class: 'obsd-m', text: 'Nothing was waiting in the lanes.' })); return }
        const mine = rows.filter(e => e.person === 'dinis').length
        justBox.append(h('h3', { text: `Just drained: ${rows.length} records, ${mine} of them yours` }),
            table(['When (UTC)', 'What', 'Page or agent', 'Who', 'Time', 'Scroll'], rows.sort((a, b) => String(b.ts || b.run).localeCompare(String(a.ts || a.run))).map(e => e.type === 'web-summit.agent-run/v1'
                ? [e.run, 'agent run', agentLink(e.agent), e.sig ? 'signed' : 'unsigned', `${(e.read || []).length} read`, `${(e.did || []).length} did`]
                : [e.ts, e.type, pageLink(e.path), e.person ? e.person + (e.sig ? ' (signed)' : '') : e.agent || 'anonymous', e.type === 'read' ? secs(e.visible_s) : '', e.type === 'read' ? e.scroll + '%' : '']), [4, 5]),
            h('p', { class: 'obsd-m', text: 'These are in the data vault now; the hourly drain (at :47) verifies them and adds them to the stats above.' }))
    }
    function drawActions() {
        actBox.textContent = ''
        if (!KEYS) { actBox.append(h('p', { class: 'obsd-m', text: 'Only for Dinis: the vault keys are sealed to his site key.' })); return }
        actBox.append(h('button', { type: 'button', text: 'Drain now', onclick: () => runDrain() }), h('p', { class: 'obsd-m', text: 'Or use the panel at the top of the page; the steps and the records appear there and in this log.' }))
        const host = boxes.find(b => b.dataset.view !== 'punch')
        if (host && !panel.parentNode) { host.insertBefore(panel, host.querySelector('[data-out]')) }
        panel.hidden = false
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
        const vault = await SGVault.open(sgSend, SGVaultCrypto.stripKeyPrefix(data.vault_key), { cloneBranch: 'obs-dinis-browser' })
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
        const name = `browser-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`
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
.obsd-toggle{position:fixed;right:0;top:45%;z-index:60;writing-mode:vertical-rl;transform:rotate(180deg);border:1px solid #8886;border-right:0;border-radius:0 8px 8px 0;background:#1d1d1b;color:#fff;padding:10px 6px;font:12px system-ui;cursor:pointer}.obsd-toggle.on{right:min(440px,92vw)}
.obsd-pane{position:fixed;top:0;right:0;bottom:0;width:min(440px,92vw);z-index:59;overflow:auto;background:#16171a;color:#e8e6e1;font:12px/1.45 ui-monospace,monospace;padding:10px 12px;box-shadow:-4px 0 18px #0005}.obsd-pane header{display:flex;justify-content:space-between;align-items:center;font:14px system-ui;margin-bottom:6px}.obsd-pane header button{background:none;border:0;color:inherit;font-size:20px;cursor:pointer}
.obsd-pane h4{font:600 12px system-ui;margin:12px 0 4px;color:#9fd3b9;text-transform:uppercase;letter-spacing:.04em}.obsd-pane a{color:#8fb8ff}.obsd-pane code{color:#ffd28a;background:none;padding:0;border:0;word-break:break-all;font-size:11px}.obsd-pane table{width:100%;border-collapse:collapse}.obsd-pane td,.obsd-pane th{padding:2px 4px;border-bottom:1px solid #fff1;text-align:left;background:none;color:inherit}.obsd-pane th{opacity:.6;font-weight:600}
.obsd-pane button{font:12px system-ui;padding:5px 10px;border-radius:6px;border:1px solid #9fd3b9;background:#1f3a2e;color:#fff;cursor:pointer}.obsd-drain{border:2px solid #1f9d6b;border-radius:10px;padding:10px 14px;margin:10px 0}.obsd-drain .obsd-run{font:600 14px system-ui;padding:6px 16px;border-radius:8px;border:0;background:#1f9d6b;color:#fff;cursor:pointer}.obsd-drain .obsd-run:disabled{opacity:.6}.obsd-status{font:600 13px ui-monospace,monospace;margin:0 8px}.obsd-steps{margin:8px 0 0 18px;padding:0;font-size:13px}.obsd-steps li{opacity:.45;padding:1px 0}.obsd-steps li small{margin-left:6px;opacity:.8;font-family:ui-monospace,monospace}.obsd-steps li.run{opacity:1;font-weight:600}.obsd-steps li.run::after{content:' ⏳'}.obsd-steps li.done{opacity:.9}.obsd-steps li.done::after{content:' ✓';color:#1f9d6b}.obsd-steps li.skip{opacity:.5}.obsd-steps li.err{opacity:1;color:#c0392b}.obsd-steps li.err::after{content:' ✗'}
.obsd-log{list-style:none;padding:0;margin:0;max-height:40vh;overflow:auto}.obsd-log li{padding:1px 0;border-bottom:1px solid #fff1}.obsd-log li span{opacity:.5}.obsd-log b{color:#9fd3b9}.obsd-log .k-error b{color:#ff8a8a}.obsd-log .k-record b{color:#ffd28a}` })
    document.head.append(style)
    const render = async () => {
        for (const box of boxes) {
            const out = box.querySelector('[data-out]'), note = box.querySelector('[data-note]'), s = state(), started = performance.now()
            const mode = box.dataset.view === 'punch' ? 'punch' : (s.view || box.dataset.view || 'overview')
            out.textContent = ''
            if (mode !== 'punch') out.append(chips(s.view ? s : (box.dataset.view && box.dataset.view !== 'explore' && box.dataset.view !== 'overview' ? { view: box.dataset.view } : s)))
            const body = h('div'); out.append(body)
            try {
                await (V[mode === 'explore' ? 'overview' : mode] || V.overview)(body, s)
                const S = await readJson('latest/summary.json')
                note.textContent = `Decrypted in your browser from vault ${cfg.vault_id}: ${FILES.length} files, ${fmt(bytes)} bytes · as of ${S.generated} UTC · refreshed hourly · ${Math.round(performance.now() - started)} ms`
            } catch (e) { note.textContent = 'Could not read the vault: ' + (e && e.message || e); log('error', String(e && e.message || e)) }
        }
    }
    window.addEventListener('hashchange', () => { log('view', location.hash || '#overview'); render() })
    render()
    drawVaults(); drawActions()
    whoIsThis().then(async person => {
        if (person !== 'dinis') return
        try { const env = await (await fetch(BASE + 'people/dinis/observability/sealed-keys.json', { cache: 'no-cache' })).json(); await openKeys(env) }
        catch (e) { log('error', 'could not open the sealed vault keys: ' + e.message) }
    })
})()
