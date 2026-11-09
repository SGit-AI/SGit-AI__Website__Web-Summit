// The work view's live read of the newsroom (backlog 0f2; spec-work-view.md, "The newsroom, read live", Angelo's answer 4).
// dev.work@PrompTugal.angelo. The page reads PrompTugal.news's own published stories.json (CORS open, cached 10 minutes)
// every two minutes, with no GitHub API and no token. A story's newest `published` step is a doc flying from its `by` to
// PT News; each move into a draft, fact-check or review column, a doc to Drafts and proposals. Kept per delivery: the story's
// id (to tell one from another), the maker and the time; never a title or a file. A step dated with a day only lands at 09:00
// UTC that day, marked dayOnly (question 7, taken as recommended). Pure functions plus a small poller; window.AngeloWorkNews
// in the browser, module.exports in node.
(function (root, make) {
    const m = make()
    if (typeof module === 'object' && module.exports) module.exports = m
    else root.AngeloWorkNews = m
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'
    const URL_STORIES = 'https://promptugal.news/api/v1/newsroom/stories.json'
    const POLL_MS = 2 * 60 * 1000
    const TO_DRAFTS = /^(draft|drafting|fact-check|review)$/
    const NAME = /^([a-z0-9][a-z0-9.-]*)@(web-summit|promptugal)\.([a-z0-9-]+)$/i
    // the name the map draws an agent by (data.mjs's viewId): a PrompTugal agent is pt:<person>:<role>
    const viewId = n => { const m = String(n || '').trim().match(NAME); if (!m) return null; return /^promptugal$/i.test(m[2]) ? `pt:${m[3].toLowerCase()}:${m[1].toLowerCase()}` : `${m[1].toLowerCase()}@web-summit.${m[3].toLowerCase()}` }
    // a step's time: a full time as it is; a day alone at 09:00 UTC, dayOnly
    function when(at) {
        const s = String(at || '')
        if (/^\d{4}-\d\d-\d\d$/.test(s)) return { t: Date.parse(s + 'T09:00:00Z'), dayOnly: true }
        const t = Date.parse(/T\d\d:\d\d(:\d\d)?Z?$/.test(s) && !/Z$/.test(s) ? s + 'Z' : s); return { t, dayOnly: false }
    }
    // the file's shape, checked before anything is drawn: a missing field means "draw nothing from the newsroom, and say so"
    function check(J) {
        if (!J || !Array.isArray(J.stories)) return 'no stories list'
        for (const s of J.stories) { if (!s || typeof s.id !== 'string' || !Array.isArray(s.history)) return 'a story without id or history'; for (const h of s.history) if (!h || typeof h.column !== 'string' || !('at' in h) || !('by' in h)) return 'a step without column, at or by' }
        return ''
    }
    // stories.json to deliveries: { at (ms), maker, icon, dest, id, dayOnly, key }; a step with no known maker or time is left out
    function deliveries(J) {
        if (check(J)) return []
        const out = []
        for (const s of J.stories) {
            const pub = s.history.filter(h => h.column === 'published' && viewId(h.by) && when(h.at).t).sort((a, b) => when(b.at).t - when(a.at).t)[0]
            if (pub) { const w = when(pub.at); out.push({ at: w.t, maker: viewId(pub.by), icon: 'doc', dest: 'news', id: s.id, dayOnly: w.dayOnly, key: `${s.id}|published|${pub.at}` }) }
            for (const h of s.history) if (TO_DRAFTS.test(h.column) && viewId(h.by)) { const w = when(h.at); if (w.t) out.push({ at: w.t, maker: viewId(h.by), icon: 'doc', dest: 'drafts', id: s.id, dayOnly: w.dayOnly, key: `${s.id}|${h.column}|${h.at}|${h.by}` }) }
        }
        return out.sort((a, b) => a.at - b.at)
    }
    // live: what is new since the last read flies now (a day-only step cannot say when it happened today, so it flies when seen)
    function fresh(prevKeys, list, now) { return list.filter(d => !prevKeys.has(d.key)).map(d => ({ ...d, at: d.dayOnly ? now : Math.min(d.at, now) })) }

    // the poller: reads every two minutes; onList(all, newOnes) after each good read; onError(reason) when the file is missing or
    // its shape changed (the view then says so in its corner). The first read only fills the list (nothing "new" on load).
    function poll({ fetch: F = (typeof fetch !== 'undefined' ? fetch : null), url = URL_STORIES, every = POLL_MS, onList = () => { }, onError = () => { }, setTimeout: T = setTimeout, clearTimeout: X = clearTimeout } = {}) {
        let seen = null, timer = 0, alive = true
        const tick = async () => {
            if (!alive) return
            try {
                const r = await F(url, { cache: 'no-cache' }); if (!r.ok) throw new Error('HTTP ' + r.status)
                const J = await r.json(), bad = check(J); if (bad) { onError('the newsroom\'s file changed shape: ' + bad); return }
                const list = deliveries(J), now = Date.now(), news = seen ? fresh(seen, list, now) : []
                seen = new Set(list.map(d => d.key)); onList(list, news)
            } catch (e) { onError('the newsroom could not be read') }
            finally { if (alive) timer = T(tick, every) }
        }
        tick()
        return { stop() { alive = false; X(timer) } }
    }

    return { URL_STORIES, POLL_MS, viewId, when, check, deliveries, fresh, poll }
})
