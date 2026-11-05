// Observability views on the site (observability@web-summit.dinis, 5 November 2026): ```obs-view <view> <person> <vault>```
// renders <div class="obs-view" data-view=...>. Each reads one file, data/public.json, straight out of the encrypted public
// vault in this browser (sgit.ai's reader, assets/vendor/sgit-ai/2026-11-05/vault-embed.js, from the published read key),
// and draws it with this site's own code: the viewer comes from the site, only the data from the vault, and every string
// from the vault reaches the page as text (textContent), never as HTML.
//   stats   the home page: the four groups, agent runs, the most-read pages, the latest agent runs
//   agents  every agent's runs; #agent=<name> opens one agent: everything it read, what it did, and its checklist
//   pages   every page: views per group, reads, time visible, scroll
//   team    the team's reads, person by person
(() => {
    'use strict'
    const boxes = [...document.querySelectorAll('.obs-view')]; if (!boxes.length || !window.SGVaultEmbed) return
    const GROUPS = ['readers', 'team', 'synthetic', 'crawlers']
    const LABEL = { readers: 'Readers', team: 'The team, by key', synthetic: 'Synthetic', crawlers: 'Crawlers' }
    const COLOR = { readers: '#2f6fdb', team: '#1f9d6b', synthetic: '#c47a12', crawlers: '#8a6bd1' }
    const fmt = n => (n || 0).toLocaleString('en-GB')
    const secs = s => { s = Math.round(s || 0); return s < 60 ? s + 's' : Math.floor(s / 60) + 'm ' + (s % 60) + 's' }
    const h = (tag, attrs = {}, kids = []) => {
        const e = document.createElement(tag)
        for (const [k, v] of Object.entries(attrs)) k === 'text' ? e.textContent = v : k === 'style' ? e.style.cssText = v : e.setAttribute(k, v)
        for (const c of [].concat(kids)) if (c != null) e.append(c.nodeType ? c : document.createTextNode(String(c)))
        return e
    }
    const code = t => h('code', { text: t })
    const tiles = d => h('div', { class: 'obsv-tiles' }, [
        ...GROUPS.map(g => h('div', {}, [h('b', { text: fmt(d.totals[g].views) }), h('span', {}, [h('i', { style: `background:${COLOR[g]}` }), `${LABEL[g]}: views · ${fmt(d.totals[g].sessions)} tabs · ${fmt(d.totals[g].reads)} reads`])])),
        h('div', {}, [h('b', { text: fmt(d.agents.runs) }), h('span', { text: `Agent runs logged · ${fmt(d.agents.signed)} signed · ${fmt(d.agents.by_agent.length)} agents` })])])
    const table = (head, rows, num = []) => h('div', { class: 'obsv-scroll' }, [h('table', {}, [
        h('thead', {}, [h('tr', {}, head.map((c, i) => h('th', { class: num.includes(i) ? 'n' : '', text: c })))]),
        h('tbody', {}, rows.map(r => h('tr', {}, r.map((c, i) => h('td', { class: num.includes(i) ? 'n' : '' }, [c == null ? '' : c])))))])])
    const signed = (a, b) => h('span', { class: a === b ? 'obsv-ok' : 'obsv-warn', text: `${a}/${b}` })
    const agentLink = (base, name) => h('a', { href: `${base}observability/agents/index.html#agent=${encodeURIComponent(name)}`, text: name })
    // the reads every agent is expected to make: the calibration starts here (Dinis, 5 November)
    const EXPECT = [
        ['CLAUDE.md, the repository\'s rules', u => /CLAUDE\.md$/.test(u)],
        ['the agents page (its own section)', u => /\/agents\/(index\.(md|html))?$|content\/agents\.md$/.test(u)],
        ['its brief', u => /brief-[a-z0-9-]+\/|content\/brief-/.test(u)],
        ['its ABP', u => /\/abp\/|content\/abp\//.test(u)],
        ['the board', u => /\/briefs\/|board\//.test(u)]]

    const views = {
        stats(box, d, base) {
            box.append(tiles(d))
            const top = d.pages.filter(p => p.total).slice(0, 6)
            const runs = d.agents.recent.slice(0, 6)
            box.append(h('div', { class: 'obsv-two' }, [
                h('div', {}, [h('h3', { text: 'Most-viewed pages' }), table(['Page', 'Views', 'Readers', 'Team'], top.map(p => [code(p.path), fmt(p.total), fmt(p.views.readers), fmt(p.views.team)]), [1, 2, 3])]),
                h('div', {}, [h('h3', { text: 'Latest agent runs' }), table(['Run (UTC)', 'Agent', 'Read', 'Did'], runs.map(r => [r.run.slice(5).replace('T', ' '), agentLink(base, r.agent), (r.read || []).length, (r.did || []).length]), [2, 3])])]))
        },
        agents(box, d, base) {
            const draw = () => {
                box.textContent = ''
                const m = location.hash.match(/^#agent=(.+)$/), name = m && decodeURIComponent(m[1])
                const a = name && d.agents.by_agent.find(x => x.agent === name)
                if (a) {
                    box.append(h('p', {}, [h('a', { href: '#all', text: '← every agent' })]), h('h3', { text: a.agent }),
                        h('p', { text: `${a.runs} runs, ${a.signed} signed with its key; last ${a.last} UTC. Read ${a.read_md} as Markdown, ${a.read_html} as HTML, ${a.read_repo} repository files; did ${a.did} things.` }))
                    const urls = a.reads.map(r => r.url)
                    box.append(h('h3', { text: 'Has it read what every agent should?' }),
                        h('ul', { class: 'obsv-check' }, EXPECT.map(([label, test]) => { const ok = urls.some(test); return h('li', { class: ok ? 'obsv-ok' : 'obsv-warn', text: `${ok ? '✓' : '✗'} ${label}` }) })))
                    box.append(h('h3', { text: 'Everything it read' }), table(['URL or file', 'As', 'Times', 'Last'], a.reads.map(r => [code(r.url), r.as, r.times, r.last]), [2]))
                    box.append(h('h3', { text: 'What it did' }), table(['Run', 'What'], a.done.map(x => [x.run, x.commit ? [code(x.commit), ' ', x.subject || ''].reduce((s, c) => (s.append(c), s), h('span')) : x.release ? 'release ' + x.release : x.file ? 'file ' + x.file : x.message_to ? 'message to ' + x.message_to : (x.note || '')])))
                    return
                }
                box.append(h('p', { text: `${d.agents.by_agent.length} agents have logged ${fmt(d.agents.runs)} runs. Choose one to see what it read, what it did, and what it has not read yet.` }))
                box.append(table(['Agent', 'Runs', 'Signed', 'Read as md', 'Read as html', 'Repo files', 'Did', 'Checklist', 'Last run'],
                    d.agents.by_agent.map(a => { const urls = a.reads.map(r => r.url); const n = EXPECT.filter(([, t]) => urls.some(t)).length
                        return [agentLink(base, a.agent), a.runs, signed(a.signed, a.runs), a.read_md, a.read_html, a.read_repo, a.did, h('span', { class: n === EXPECT.length ? 'obsv-ok' : 'obsv-warn', text: `${n}/${EXPECT.length}` }), a.last] }), [1, 3, 4, 5, 6]))
                box.append(h('h3', { text: 'What the agents read most' }), table(['URL or file', 'Agents', 'Which'], d.agents.most_read.slice(0, 40).map(([u, who]) => [code(u), who.length, who.join(', ')]), [1]))
            }
            window.addEventListener('hashchange', draw); draw()
        },
        pages(box, d) {
            box.append(tiles(d))
            box.append(table(['Page', 'Views', 'Readers', 'Team', 'Synthetic', 'Crawlers', 'Reads', 'Avg time', 'Avg scroll'],
                d.pages.map(p => [code(p.path), fmt(p.total), fmt(p.views.readers), fmt(p.views.team), fmt(p.views.synthetic), fmt(p.views.crawlers), fmt(p.reads), p.reads ? secs(p.read_s_avg) : '', p.reads ? p.scroll_avg + '%' : '']), [1, 2, 3, 4, 5, 6, 7, 8]))
        },
        team(box, d) {
            const people = [...new Set(d.team.map(r => r.person))].sort()
            if (!people.length) { box.append(h('p', { text: 'No signed page views yet: a person is named only when their browser holds their site key.' })); return }
            for (const p of people) {
                const rows = d.team.filter(r => r.person === p)
                box.append(h('h3', { text: `${p}: ${rows.length} pages` }), table(['Page', 'Views', 'Reads', 'Time visible', 'Deepest scroll', 'Last'],
                    rows.map(r => [code(r.path), r.views, r.reads, secs(r.visible_s), (r.max_scroll || 0) + '%', r.last]), [1, 2, 3, 4]))
            }
            box.append(h('p', { class: 'meta', text: 'A signature from a key a conductor issued can also come from that conductor\'s session (WS-138). Reads with no time visible and no scroll are worth a second look.' }))
        }
    }
    const style = h('style', { text: `.obs-view table{width:100%;border-collapse:collapse;font-size:14px}.obs-view th,.obs-view td{text-align:left;padding:5px 8px;border-bottom:1px solid #8883;vertical-align:top}.obs-view th{font-size:12px;opacity:.75}.obs-view .n{text-align:right;font-variant-numeric:tabular-nums}.obs-view code{font-size:12px;word-break:break-all}.obsv-scroll{overflow-x:auto}.obsv-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:10px 0}.obsv-tiles>div{border:1px solid #8884;border-radius:8px;padding:8px 10px}.obsv-tiles b{display:block;font-size:24px}.obsv-tiles span{font-size:12px;opacity:.8}.obsv-tiles i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px}.obsv-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px}.obs-view h3{font-size:15px;margin:16px 0 6px}.obsv-ok{color:#1f9d6b}.obsv-warn{color:#c47a12}.obsv-check{list-style:none;padding:0}` })
    document.head.append(style)
    let shared = null
    const load = cfg => shared || (shared = (async () => { const r = await new window.SGVaultEmbed.Reader(cfg).init(); await r.open(); return JSON.parse(await r.readText('data/public.json')) })())
    for (const box of boxes) {
        const cfg = { endpoint: box.dataset.endpoint, vault_id: box.dataset.vault, read_key: box.dataset.key.replace(/^sgit_public_read_/, '') }
        const note = box.querySelector('[data-note]'), out = box.querySelector('[data-out]'), t0 = performance.now()
        load(cfg).then(d => {
            note.textContent = `Decrypted in your browser from vault ${cfg.vault_id} in ${Math.round(performance.now() - t0)} ms · as of ${d.generated} UTC · refreshed hourly`
            ;(views[box.dataset.view] || views.stats)(out, d, box.dataset.base || '')
        }).catch(e => { note.textContent = 'Could not read the vault: ' + (e && e.message || e) })
    }
})()
