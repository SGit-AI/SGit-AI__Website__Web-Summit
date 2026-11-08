// The map's work view, live (backlog 0f2; spec: people/angelo/proposals/live-map/spec-work-view.md, approved 8 November).
// dev.work@PrompTugal.angelo. Feeds work-draw.js on the live graph: deliveries.json (built beside live.json) read about once a
// minute and each new delivery played at its real moment, the same few minutes behind as the exchanges; the newsroom's own
// published file read every two minutes (work-newsroom.js), a new step flying when first seen. The squares' counts are for the last
// 24 hours. Nothing older than the delay plays on opening. Says in the view's corner when the newsroom cannot be read.
// mount(host, o): host is live.js's host (it carries host.lvGraph once the graph is drawn, and fires 'lv-graph' when it redraws).
// o: base (the app's folder), delayMs (4 minutes), every (60 s), newsEvery (2 min), newsUrl, win. Returns { destroy }.
(function (root) {
    'use strict'
    const DAY = 864e5
    function mount(host, o = {}) {
        const A = root.AngeloWork, Dr = root.AngeloWorkDraw, News = root.AngeloWorkNews, win = o.win || root
        const base = o.base || '', delay = o.delayMs != null ? o.delayMs : 4 * 6e4, every = o.every || 6e4
        let V = null, alive = true, timer = 0, newsPoll = null, note = null, newsFirst = true
        const seen = new Set(), past = []            // keys already shown; every delivery known, for the counts: { at, dest }
        const timers = new Set()
        const later = (fn, ms) => { const t = win.setTimeout(() => { timers.delete(t); if (alive) fn() }, Math.max(0, ms)); timers.add(t) }
        const recount = () => { if (!V) return; const now = Date.now(), c = Object.fromEntries(A.DESTS.map(d => [d, 0])); for (const d of past) if (d.at > now - DAY && d.at <= now - (d.news ? 0 : delay)) c[d.dest]++; V.counts(c) }
        // a batch of new deliveries ({ at, maker, icon, dest, key }): merged by minute and destination, each flying at at + delay
        // (one that reached us later than that flies at once, a beat apart)
        function play(list, now, lag) {
            const fresh = list.filter(d => !seen.has(d.key)); for (const d of fresh) { seen.add(d.key); past.push({ at: d.at, dest: d.dest, news: !lag }) }
            const M = A.merge(fresh.map(d => ({ min: Math.floor(d.at / 6e4), dest: d.dest, icon: d.icon, maker: d.maker, sha: d.key })))
            let late = 0
            for (const m of M) { const due = m.min * 6e4 + lag - now; later(() => { if (V) { V.fly([m], win.performance.now()); recount() } }, due > 0 ? due : 350 * late++) }
        }
        const rowsOf = W => { const from = Date.parse(W.from); return A.unpack(W).map(d => ({ at: from + d.min * 6e4, maker: d.maker, icon: d.icon, dest: d.dest, key: (d.repo || '') + ':' + d.sha + ':' + d.dest })) }
        async function read(first) {
            try {
                const r = await win.fetch(new URL(base + 'deliveries.json', win.location.href).href, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status)
                const list = rowsOf(await r.json()), now = Date.now()
                if (first) for (const d of list) if (d.at <= now - delay) { seen.add(d.key); past.push({ at: d.at, dest: d.dest }) }
                play(list, now, delay); recount()
            } catch { }
            if (alive) timer = win.setTimeout(() => read(false), every)
        }
        function say(text) {
            const wrap = host.querySelector('.lv'); if (!wrap) return
            if (!text) { if (note) { note.remove(); note = null } return }
            if (!note) { note = wrap.ownerDocument.createElement('div'); note.className = 'wv-note'; note.style.cssText = 'position:absolute;left:10px;bottom:8px;font:500 12px/1.3 var(--rm-font,system-ui,sans-serif);color:var(--rm-text-muted,#9EB2C7);pointer-events:none'; wrap.appendChild(note) }
            note.textContent = text
        }
        function attach(G) {
            if (!alive || !G) return
            if (V) V.destroy()
            V = Dr.attach(G, { base }); recount()
        }
        const onGraph = e => attach(e.detail || host.lvGraph)
        host.addEventListener('lv-graph', onGraph)
        if (host.lvGraph) attach(host.lvGraph)
        read(true)
        if (News) newsPoll = News.poll({ fetch: (u, x) => win.fetch(u, x), url: o.newsUrl || News.URL_STORIES, every: o.newsEvery || News.POLL_MS, setTimeout: (f, ms) => win.setTimeout(f, ms), clearTimeout: t => win.clearTimeout(t),
            onList: (all, news) => {
                say('')
                if (newsFirst) { newsFirst = false; for (const d of all) { seen.add('news|' + d.key); past.push({ at: d.at, dest: d.dest, news: true }) } }
                play(news.map(d => ({ ...d, key: 'news|' + d.key })), Date.now(), 0); recount()
            },
            onError: why => say(why) })
        return { destroy() { alive = false; win.clearTimeout(timer); for (const t of timers) win.clearTimeout(t); timers.clear(); if (newsPoll) newsPoll.stop(); host.removeEventListener('lv-graph', onGraph); if (V) V.destroy(); V = null; say('') }, view: () => V }
    }
    root.AngeloWorkLive = { mount }
})(typeof self !== 'undefined' ? self : this)
