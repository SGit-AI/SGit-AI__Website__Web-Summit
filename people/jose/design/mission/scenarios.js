// The states the brief's screenshots and golden checks use, made from one frozen snapshot of the real data
// (fixture.json: reference/data.mjs at 2026-11-03T02:00Z). Every change to the real data is named in `note`.
// A classic script: window.JoseCCScenarios in a browser, module.exports in node. By designer@web-summit.jose.
(function (root) {
    'use strict'
    const clone = o => JSON.parse(JSON.stringify(o))
    // the one decision really waiting on Jose (people/jose/dev/README.md, "Waiting on Jose"); asks.json does not exist yet
    const WS39_ASK = { id: 'ws39-route', title: 'Choose the WS-39 broadcast route', detail: 'The WhatsApp Groups API cannot post into the team’s existing group. dev proposes: n8n sends you the draft and you forward it; Slack next. A number that posts by itself is Dinis’s call.',
        options: ['n8n sends me the draft, I forward it', 'Slack first', 'a gateway that posts into the group (Dinis decides)'], issue: 'WS-39', by: 'dev@web-summit.jose', source: 'people/jose/dev/WS-39-findings.md', added: '2026-11-03T01:18:35Z', status: 'open' }
    function addRuns(d, name, times, subject) {
        const a = d.agents.find(x => x.name === name)
        for (const t of times) { a.runs.unshift(t); d.feed.push({ at: t, who: a.full, subject, tags: ['yours'], hash: null, link: null, example: true }) }
        a.last = { hash: null, at: times[times.length - 1], subject }
        d.feed.sort((x, y) => y.at.localeCompare(x.at))
    }
    function scenarios(fixture) {
        const S = {}
        // all clear: the real data at Tue 3 Nov 02:10, with the WS-39 route and the two stand-up decisions answered
        S.clear = (() => { const d = clone(fixture); d.asks = []; d.standup = []
            return { id: 'clear', label: 'All clear', d, now: Date.parse('2026-11-03T02:10:00Z'), seen: Date.parse('2026-11-03T01:00:00Z'),
                note: 'Example: the real data at Tue 3 Nov 02:10 UTC, with the WS-39 route and your two stand-up decisions marked answered.' } })()
        // overdue and quiet: Wed 4 Nov 08:40. Conductor, dashboard and designer runs since are assumed; dev made none
        S.alert = (() => { const d = clone(fixture); d.asks = [clone(WS39_ASK)]; d.standup = []; d.built_at = '2026-11-04T08:15:00.000Z'
            addRuns(d, 'conductor', ['2026-11-03T07:25:00Z', '2026-11-03T12:25:00Z', '2026-11-03T17:25:00Z', '2026-11-04T07:25:00Z'], 'scheduled run (assumed for this example)')
            addRuns(d, 'dashboard', ['2026-11-03T07:36:00Z', '2026-11-03T12:36:00Z', '2026-11-03T17:36:00Z', '2026-11-04T07:36:00Z'], 'scheduled run (assumed for this example)')
            addRuns(d, 'designer', ['2026-11-03T15:20:00Z'], 'spec for dev (assumed for this example)')
            return { id: 'alert', label: 'Overdue + quiet', d, now: Date.parse('2026-11-04T08:40:00Z'), seen: Date.parse('2026-11-03T18:10:00Z'),
                note: 'Example: the real data at Wed 4 Nov 08:40 UTC. The conductor’s, dashboard’s and designer’s runs since Tue are assumed; dev has made none since Tue 01:18, and the 13:00 decisions were recorded.' } })()
        // stale: Tue 3 Nov 08:20, the 02:00 build still the newest (nothing else changed)
        S.stale = (() => { const d = clone(fixture); d.asks = [clone(WS39_ASK)]
            return { id: 'stale', label: 'Stale', d, now: Date.parse('2026-11-03T08:20:00Z'), seen: Date.parse('2026-11-03T02:00:00Z'),
                note: 'Example: the real data at Tue 3 Nov 08:20 UTC with no build since 02:00, so the page is 6 h old.' } })()
        // first visit: Tue 3 Nov 02:10, nothing remembered, so "new" is the last 24 hours
        S.first = (() => { const d = clone(fixture); d.asks = [clone(WS39_ASK)]
            return { id: 'first', label: 'First visit', d, now: Date.parse('2026-11-03T02:10:00Z'), seen: null,
                note: 'Example: the real data at Tue 3 Nov 02:10 UTC on a first visit (nothing remembered: the last 24 h are new). The WS-39 ask is the one dev will put in asks.json.' } })()
        return S
    }
    const api = { scenarios, WS39_ASK }
    if (typeof module !== 'undefined' && module.exports) module.exports = api
    else root.JoseCCScenarios = api
})(typeof window !== 'undefined' ? window : this)
