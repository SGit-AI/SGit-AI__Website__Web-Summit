// Replay: the team's work, played back (people/angelo/proposals/replay/BRIEF.md; dev@web-summit.angelo, 5 November 2026,
// at Angelo's go). Slices 1 and 2: a Gantt of every commit since 2 November, a row per agent grouped by person (on a
// phone, a row per person), coloured by kind, with the stand-ups and CI's releases; filters by time window, person,
// kind, agent and issue, kept in the address; and playback: play, pause, speed, a scrubber, jump to a stand-up.
// The data is built by data.mjs (`replay`) from the git log; nothing here reaches the network.
(function (root) {
    'use strict'
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const KINDS = { w: ['Work', 'var(--rm-text-muted)'], p: ['Report to a conductor', 'var(--rm-blue)'], q: ['Request from a conductor', 'var(--rm-role-conductor)'], d: ['Decision recorded', 'var(--rm-gold)'] }
    const WINDOWS = { '24h': ['Last 24 h', 1440], '72h': ['Last 3 days', 4320], all: ['Since 2 Nov', 0] }
    const SPEEDS = [['60', '1 h a second'], ['360', '6 h a second'], ['1440', '1 day a second']]
    const PHONE = () => matchMedia('(max-width: 767px)').matches

    function parse(hash) {
        const i = hash.indexOf('?'), q = new URLSearchParams(i < 0 ? '' : hash.slice(i + 1))
        const list = k => (q.get(k) || '').split(',').filter(Boolean)
        const w = q.get('w'); return { w: WINDOWS[w] ? w : '24h', p: list('p'), k: list('k'), a: q.get('a') || '', i: q.get('i') || '', sel: q.get('sel') || '', m: q.get('m') !== '0', r: q.get('r') === '1', c: q.get('c') === '1', v: q.get('v') === 'map' ? 'map' : '' }
    }
    function toHash(s) {
        const q = []; if (s.w !== '24h') q.push('w=' + s.w); if (s.p.length) q.push('p=' + s.p.join(',')); if (s.k.length) q.push('k=' + s.k.join(','))
        if (s.a) q.push('a=' + encodeURIComponent(s.a)); if (s.i) q.push('i=' + encodeURIComponent(s.i)); if (s.sel) q.push('sel=' + s.sel); if (!s.m) q.push('m=0'); if (s.r) q.push('r=1'); if (s.c) q.push('c=1'); if (s.v) q.push('v=' + s.v)
        return '#replay' + (q.length ? '?' + q.join('&') : '')
    }
    const at = (R, m) => new Date(Date.parse(R.from) + m * 6e4)
    const hhmm = d => d.toISOString().slice(11, 16)
    const dayLabel = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

    // which events this view shows, and its time span in minutes since 2 November
    function select(R, s, nowMin) {
        const end = nowMin, start = WINDOWS[s.w][1] ? Math.max(0, end - WINDOWS[s.w][1]) : 0
        const issue = +(String(s.i).match(/\d+/) || [0])[0]
        const ev = R.events.filter(e => e[0] >= start && e[0] <= end && (e[1] < 0 ? !s.p.length && !s.a && !issue && (!s.k.length || s.k.includes('r')) : (
            (!s.p.length || s.p.includes(R.agents[e[1]].person)) && (!s.k.length || s.k.includes(e[2])) && (!s.a || R.agents[e[1]].name === s.a) && (!issue || e[4].includes(issue)))))
        return { start, end, ev }
    }

    // the person behind a name: <role>@<team>.<person>, pt:<person>:<role>, or a person's id
    const personOfName = t => { const m = String(t).match(/@(?:web-summit|promptugal)\.([a-z0-9-]+)$/i) || String(t).match(/^pt:([a-z0-9-]+):/); return m ? m[1].toLowerCase() : t }

    // ---------- the map mode (v=map): the team map, played on Replay's clock ----------
    // People on a ring, each one's agents fanned around them (the team map's ring layout), CI at the centre. Each commit's
    // For: line is a message: a pulse that travels from its agent to the agent or person it is for, in one second of
    // playback, coloured by kind; the line between them thickens with every message up to the playhead. An agent glows
    // when it commits. Built from the same events, filters and window as the timeline.
    const MAPCOL = ['var(--rm-role-conductor)', 'var(--rm-role-dev)', 'var(--rm-gold)', 'var(--rm-role-video)', 'var(--rm-green)', 'var(--rm-role-outreach)', 'var(--rm-orange)', 'var(--rm-blue)', 'var(--rm-red)']
    const POOL = 160, TRAVEL_S = 1
    function mapModel(R, s, ev) {
        const S = 1000, C = S / 2, pos = new Map(), col = new Map(R.people.map((p, i) => [p.id, MAPCOL[i % MAPCOL.length]]))
        const aByName = new Map(R.agents.map((a, i) => [a.name, i]))
        const commits = new Map(); for (const e of ev) if (e[1] >= 0) commits.set(e[1], (commits.get(e[1]) || 0) + 1)
        const nodeOfTarget = t => { const i = aByName.get(t); if (i != null && commits.has(i)) return 'a' + i; const p = personOfName(t); return R.people.some(x => x.id === p) ? 'p:' + p : null }
        const msgs = []
        if (s.m) for (const e of ev) if (e[1] >= 0) for (const ti of e[3]) { const to = nodeOfTarget(R.targets[ti]), from = 'a' + e[1]; if (to && to !== from) msgs.push({ t: e[0], from, to, k: e[2], e }) }
        const people = R.people.filter(p => [...commits.keys()].some(i => R.agents[i].person === p.id) || msgs.some(m => m.to === 'p:' + p.id))
        const NP = Math.max(1, people.length), RP = 300
        people.forEach((p, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / NP; pos.set('p:' + p.id, { x: C + RP * Math.cos(a), y: C + RP * Math.sin(a), a, kind: 'p', label: p.name.split(' ')[0], person: p.id }) })
        for (const p of people) {
            const P = pos.get('p:' + p.id), mine = [...commits.entries()].filter(([i]) => R.agents[i].person === p.id).sort((x, y) => y[1] - x[1])
            const rows = mine.length > 16 ? 3 : 2, spread = Math.min(Math.PI * (rows === 3 ? 1.3 : 0.95), (0.16 * mine.length + 0.3) / (rows - 1))
            mine.forEach(([i, n], k) => { const t = P.a + (mine.length > 1 ? -spread / 2 + k * spread / (mine.length - 1) : 0), rr = 100 + (k % rows) * 32, a = R.agents[i]; pos.set('a' + i, { x: P.x + rr * Math.cos(t), y: P.y + rr * Math.sin(t), kind: 'a', label: a.short, name: a.name, person: p.id, n, pt: a.name.startsWith('pt:') }) })
        }
        pos.set('ci', { x: C, y: C, kind: 'ci', label: 'CI' })
        const ctrl = (a, b) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; return { x: mx + (C - mx) * 0.55, y: my + (C - my) * 0.55 } }
        const pairs = new Map()
        for (const m of msgs) { const k = m.from + '|' + m.to; if (!pairs.has(k)) pairs.set(k, { k, i: pairs.size, from: m.from, to: m.to, q: ctrl(pos.get(m.from), pos.get(m.to)), n: 0 }); m.pair = pairs.get(k) }
        msgs.sort((x, y) => x.t - y.t)
        const acts = ev.filter(e => e[1] >= 0).sort((x, y) => x[0] - y[0]), rels = ev.filter(e => e[1] < 0).sort((x, y) => x[0] - y[0])
        return { S, C, pos, col, msgs, pairs: [...pairs.values()], acts, rels, total: msgs.length }
    }
    function mapSvg(Mm, s, KINDS) {
        const { S, pos, col, pairs } = Mm, f = n => n.toFixed(0)
        const nodes = [...pos.entries()].map(([id, n]) => n.kind === 'p'
            ? `<g class="rpm-p${s.p.length && !s.p.includes(n.person) ? ' off' : ''}" data-rpm-p="${esc(n.person)}" role="button" tabindex="0" aria-label="${esc(n.label)}"><circle cx="${f(n.x)}" cy="${f(n.y)}" r="26" fill="${col.get(n.person)}"/><text x="${f(n.x)}" y="${f(n.y + 5)}">${esc(n.label)}</text></g>`
            : n.kind === 'ci' ? `<g class="rpm-ci" data-rpm-id="ci"><circle cx="${f(n.x)}" cy="${f(n.y)}" r="18"/><text x="${f(n.x)}" y="${f(n.y + 4)}">CI</text><title>Releases by CI</title></g>`
            : `<g class="rpm-a${s.a === n.name ? ' sel' : ''}" data-rpm-id="${id}" data-rpm-a="${esc(n.name)}" role="button" tabindex="0" aria-label="${esc(n.name)}">${n.pt ? `<rect x="${f(n.x - 7)}" y="${f(n.y - 7)}" width="14" height="14" transform="rotate(45 ${f(n.x)} ${f(n.y)})" fill="${col.get(n.person)}"/>` : `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${(4 + Math.min(8, Math.sqrt(n.n))).toFixed(1)}" fill="${col.get(n.person)}"/>`}<text class="rpm-l" x="${f(n.x)}" y="${f(n.y - 13)}">${esc(n.label)}</text><title>${esc(n.name.startsWith('pt:') ? n.name.split(':')[2] + ', PrompTugal (' + n.name.split(':')[1] + ')' : n.name)}: ${n.n} commits in this window</title></g>`).join('')
        return `<svg class="rp-svg rpm-svg" viewBox="0 0 ${S} ${S}" role="img" aria-label="The team map, played back: ${Mm.total} messages in this window">
<g class="rpm-links">${pairs.map((p, i) => { const a = pos.get(p.from), b = pos.get(p.to); return `<path class="z" data-rpm-pair="${i}" d="M${f(a.x)} ${f(a.y)}Q${f(p.q.x)} ${f(p.q.y)} ${f(b.x)} ${f(b.y)}" stroke="${col.get(a.person) || 'var(--rm-text-muted)'}"/>` }).join('')}</g>
<g class="rpm-pulses">${Array.from({ length: POOL }, () => '<circle r="5" class="z"/>').join('')}</g>
<g class="rpm-nodes">${nodes}</g></svg>`
    }
    // the map's clock: what has been sent up to t, what is in flight, who is busy
    function mapClock(view, Mm, R, KINDS) {
        const { pos, msgs, pairs, acts, rels } = Mm
        const links = [...view.querySelectorAll('[data-rpm-pair]')], pulses = [...view.querySelectorAll('.rpm-pulses circle')], ticker = view.querySelector('[data-rpm-tick]')
        const nodeEl = new Map([...view.querySelectorAll('[data-rpm-id]')].map(g => [g.dataset.rpmId, g]))
        const tot = new Map(); for (const m of msgs) tot.set(m.pair, (tot.get(m.pair) || 0) + 1)
        const maxN = Math.max(1, ...tot.values())
        let sent = 0, hot = new Set(), lastTick = ''
        const lowerBound = (arr, v, key) => { let lo = 0, hi = arr.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (key(arr[mid]) <= v) lo = mid + 1; else hi = mid } return lo }
        const width = n => (0.8 + 4.2 * Math.sqrt(n / maxN)).toFixed(2)
        return function seek(t, rate) {
            const travel = Math.max(1, rate * TRAVEL_S), changed = new Set()
            while (sent < msgs.length && msgs[sent].t <= t) { msgs[sent].pair.n++; changed.add(msgs[sent].pair); sent++ }
            while (sent > 0 && msgs[sent - 1].t > t) { sent--; msgs[sent].pair.n--; changed.add(msgs[sent].pair) }
            for (const p of changed) { const el = links[p.i]; if (!el) continue; el.classList.toggle('z', p.n <= 0); if (p.n > 0) el.setAttribute('stroke-width', width(p.n)) }
            // in flight: the messages sent in the last second of playback, newest kept if there are more than the pool
            const lo = lowerBound(msgs, t - travel, m => m.t), from = Math.max(lo, sent - POOL), fly = msgs.slice(from, sent)
            const now = new Set()
            pulses.forEach((c, i) => {
                const m = fly[i]; if (!m) { c.classList.add('z'); return }
                const a = pos.get(m.from), b = pos.get(m.to), q = m.pair.q, u = Math.min(1, Math.max(0, (t - m.t) / travel)), v = 1 - u
                c.setAttribute('cx', (v * v * a.x + 2 * v * u * q.x + u * u * b.x).toFixed(1)); c.setAttribute('cy', (v * v * a.y + 2 * v * u * q.y + u * u * b.y).toFixed(1))
                c.setAttribute('fill', KINDS[m.k][1]); c.classList.remove('z'); if (u > 0.8 && m.to[0] === 'a') now.add(m.to)
            })
            // busy: an agent that committed in the last 1.5 s of playback; CI when it released
            for (let i = lowerBound(acts, t - travel * 1.5, e => e[0]); i < acts.length && acts[i][0] <= t; i++) now.add('a' + acts[i][1])
            for (let i = lowerBound(rels, t - travel * 1.5, e => e[0]); i < rels.length && rels[i][0] <= t; i++) now.add('ci')
            for (const id of hot) if (!now.has(id)) { const g = nodeEl.get(id); if (g) g.classList.remove('hot') }
            for (const id of now) if (!hot.has(id)) { const g = nodeEl.get(id); if (g) g.classList.add('hot') }
            hot = now
            // the ticker: the newest commit up to t
            if (ticker) { const all = lowerBound(acts, t, e => e[0]), e = acts[all - 1], key = e ? e[6] : ''; if (key !== lastTick) { lastTick = key; ticker.innerHTML = e ? `<b>${esc(hhmm(at(R, e[0])))}</b> ${esc((R.agents[e[1]].name.startsWith('pt:') ? R.agents[e[1]].name.split(':')[2] + '@PrompTugal.' + R.agents[e[1]].person : R.agents[e[1]].short))}${e[3].length ? ' → ' + esc(e[3].map(i => R.targets[i]).map(x => x.startsWith('pt:') ? x.split(':')[2] : x.split('@')[0]).join(', ')) : ''}: ${esc(e[5])}` : '' } }
        }
    }

    let play = null   // { raf, last, t, speed }
    // slice 4: the agents' runs (WS-160), read in this browser from observability's public vault with its published read key,
    // through the site's vendored reader (assets/vendor/sgit-ai/.../vault-embed.js): only when asked, once per page
    let RUNS = null   // null | 'loading' | [runs] | Error
    function loadRuns(src, base, after) {
        if (RUNS) return; RUNS = 'loading'
        const need = window.SGVaultEmbed ? Promise.resolve() : new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = new URL('../../../assets/vendor/sgit-ai/2026-11-05/vault-embed.js', base).href; sc.onload = ok; sc.onerror = () => no(new Error('the vault reader did not load')); document.head.appendChild(sc) })
        need.then(async () => {
            const dec = new TextDecoder(), R = await new window.SGVaultEmbed.Reader({ endpoint: src.endpoint, vault_id: src.vault_id, read_key: src.read_key.replace(/^sgit_public_read_/, '') }).init()
            const ref = JSON.parse(dec.decode(await R.decrypt(await R.raw('bare/refs/ref-pid-muw-' + await R.fileId('sg-vault-v1:file-id:ref:' + src.vault_id)))))
            let id = (await R.objJson(ref.commit_id)).tree_id, entry = null
            for (const part of src.path.split('/')) { const t = await R.objJson(id); entry = null; for (const e of t.entries || []) if (await R.decB64(e.name_enc) === part) { entry = e; break } if (!entry) throw new Error('not in the vault: ' + src.path); id = entry.tree_id }
            const j = JSON.parse(dec.decode(await R.obj(entry.blob_id)))
            RUNS = (j.runs || []).filter(x => x.agent && x.run)
        }).catch(e => { RUNS = e instanceof Error ? e : new Error(String(e)) }).then(after)
    }
    function render(view, ctx) {
        const { D, title, note, ownTitle, ago } = ctx, R = D.replay
        if (play) { cancelAnimationFrame(play.raf); play = null }
        if (title) title.innerHTML = `${ownTitle('Replay')}<small>${esc((D.person.name || D.person.id).split(' ')[0])}'s command centre</small>`
        if (!R) { view.innerHTML = '<p class="note">Replay has no data in this build.</p>'; return }
        const s = parse(location.hash), nowMin = Math.round((Date.now() - Date.parse(R.from)) / 6e4)
        const { start, end, ev } = select(R, s, nowMin), phone = PHONE()
        // rows: per agent grouped by person; on a phone, per person
        const agentsSeen = new Set(ev.filter(e => e[1] >= 0).map(e => e[1]))
        const rows = []
        for (const p of R.people) {
            const mine = R.agents.map((a, i) => [a, i]).filter(([a, i]) => a.person === p.id && agentsSeen.has(i))
            if (!mine.length) continue
            if (phone) rows.push({ kind: 'person', label: p.name.split(' ')[0], person: p.id, idx: mine.map(([, i]) => i) })
            else { rows.push({ kind: 'head', label: p.name, person: p.id }); for (const [a, i] of mine) rows.push({ kind: 'agent', label: a.short, title: a.name, idx: [i] }) }
        }
        // slice 5, the clip (c=1): the window played full screen in 60 seconds, looping, for a stand-up screen or a screen recording
        const W = s.c ? innerWidth - 24 : Math.max(320, view.clientWidth || 960), LW = phone ? 72 : 170, TOP = 34, RH = s.c ? Math.max(8, Math.min(22, Math.floor((innerHeight - 140 - TOP) / Math.max(1, rows.length)))) : phone ? 26 : 20
        const H = TOP + rows.length * RH + 8, span = Math.max(60, end - start)
        const x = m => LW + (m - start) / span * (W - LW - 12)
        const rowOf = new Map(); rows.forEach((r, n) => (r.idx || []).forEach(i => rowOf.set(i, n)))
        // slice 3, the arcs: each For: target's row, an agent's own row or, for a person (or an agent not shown), their person's row
        const aByName = new Map(R.agents.map((a, i) => [a.name, i])), personRow = new Map(rows.map((r, n) => [r.person, n]).filter(([p]) => p))
        const targetRow = t => { const i = aByName.get(t); if (i != null && rowOf.has(i)) return rowOf.get(i); const p = personOfName(t); return personRow.has(p) ? personRow.get(p) : null }
        const yOf = n => TOP + n * RH + RH / 2
        // slice 4: each run on its agent's row (or its person's), at its minute, within the window and the filters
        const runMarks = s.r && Array.isArray(RUNS) ? RUNS.map(u => { const t = Math.round((Date.parse(u.run.replace(/Z$/, ':00Z')) - Date.parse(R.from)) / 6e4); const i = aByName.get(u.agent); const n = i != null && rowOf.has(i) ? rowOf.get(i) : null; return [u, n, t] }).filter(([u, n, t]) => n != null && t >= start && t <= end && (!s.a || u.agent === s.a)) : []
        const arcs = s.m ? ev.filter(e => e[1] >= 0 && rowOf.has(e[1]) && e[3].length).flatMap(e => e[3].map(ti => [e, targetRow(R.targets[ti])]).filter(([, n]) => n != null && n !== rowOf.get(e[1]))) : []
        const arcPath = (e, n) => { const x0 = x(e[0]), y0 = yOf(rowOf.get(e[1])), y1 = yOf(n), dx = Math.min(46, Math.abs(y1 - y0) / 3 + 6); return `M${x0.toFixed(1)} ${y0}C${(x0 + dx).toFixed(1)} ${y0} ${(x0 + dx).toFixed(1)} ${y1} ${x0.toFixed(1)} ${y1}` }
        // the label spacing follows the width: the first step that leaves about 56 px between labels
        const ppm = (W - LW - 12) / span, step = [60, 120, 180, 360, 720, 1440, 2880, 5760].find(st => st * ppm >= 56) || 5760
        const ticks = []; for (let m = Math.ceil(start / step) * step; m <= end; m += step) ticks.push(m)
        const sel = ev.find(e => e[1] >= 0 && e[6] === s.sel)
        const Mm = s.v === 'map' ? mapModel(R, s, ev) : null
        const svg = `<svg class="rp-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Commits as a timeline, ${ev.length} shown">
<g class="rp-grid">${ticks.map(m => `<line x1="${x(m)}" x2="${x(m)}" y1="${TOP - 6}" y2="${H}"/><text x="${x(m) + 3}" y="12">${step >= 1440 ? esc(dayLabel(at(R, m))) : esc(m % 1440 === 0 ? dayLabel(at(R, m)) : hhmm(at(R, m)))}</text>`).join('')}</g>
<g class="rp-stand">${R.standups.filter(([m]) => m >= start && m <= end).map(([m, id]) => `<line x1="${x(m)}" x2="${x(m)}" y1="${TOP - 10}" y2="${H}"/><text x="${x(m) + 3}" y="${TOP - 12}">stand-up ${esc(id.slice(-4, -2))}:${esc(id.slice(-2))}</text>`).join('')}</g>
${rows.map((r, n) => `<g class="rp-row ${r.kind}"><rect x="0" y="${TOP + n * RH}" width="${W}" height="${RH}"/><text x="6" y="${TOP + n * RH + RH / 2 + 4}">${esc(r.label)}${r.title ? `<title>${esc(r.title)}</title>` : ''}</text></g>`).join('')}
<g class="rp-rel">${ev.filter(e => e[1] < 0).map(e => `<line class="rp-e" data-t="${e[0]}" x1="${x(e[0])}" x2="${x(e[0])}" y1="${TOP - 4}" y2="${TOP}"><title>${esc(e[5])} by CI, ${esc(hhmm(at(R, e[0])))} UTC</title></line>`).join('')}</g>
<g class="rp-arcs">${arcs.map(([e, n]) => `<path class="rp-e rp-arc${e[6] === s.sel ? ' on' : ''}" data-t="${e[0]}" data-h="${esc(e[6])}" d="${arcPath(e, n)}" stroke="${KINDS[e[2]][1]}"/>`).join('')}</g>
<g class="rp-runs">${runMarks.map(([u, n, t]) => `<rect class="rp-e rp-run${u.signed ? ' signed' : ''}" data-t="${t}" x="${(x(t) - 4).toFixed(1)}" y="${TOP + n * RH + 2}" width="8" height="${RH - 4}" rx="2"><title>${esc(u.agent)} ran at ${esc(u.run.slice(11, 16))} UTC (${esc(u.trigger || 'run')}${u.signed ? ', signed' : ''}): read ${(u.read || []).length}, did ${(u.did || []).length}${u.notes ? '. ' + esc(u.notes) : ''}</title></rect>`).join('')}</g>
<g class="rp-dots">${ev.filter(e => e[1] >= 0 && rowOf.has(e[1])).map(e => `<circle class="rp-e${e[6] === s.sel ? ' on' : ''}" data-t="${e[0]}" data-h="${esc(e[6])}" cx="${x(e[0]).toFixed(1)}" cy="${TOP + rowOf.get(e[1]) * RH + RH / 2}" r="${phone ? 4 : 3.5}" fill="${KINDS[e[2]][1]}"><title>${esc(R.agents[e[1]].name)}, ${esc(hhmm(at(R, e[0])))} UTC: ${esc(e[5])}</title></circle>`).join('')}</g>
<line class="rp-head" x1="${x(end)}" x2="${x(end)}" y1="${TOP - 10}" y2="${H}"/></svg>`
        const chip = (k, v, l, on, col) => `<button type="button" class="rp-chip${on ? ' on' : ''}" data-rp="${k}" data-v="${esc(v)}" aria-pressed="${on}">${col ? `<i style="background:${col}"></i>` : ''}${esc(l)}</button>`
        const agentOpts = [...agentsSeen].map(i => R.agents[i].name).sort()
        view.innerHTML = `<div class="ak rp${s.c ? ' rp-clip' : ''}">${s.c ? `<header class="rp-cliphead"><b>The team at work: ${esc(WINDOWS[s.w][0].toLowerCase())}, in 60 seconds</b><span data-rp-now></span><button type="button" class="cc-btn" data-rp-exit>Close the clip</button></header>` : note()}
<details class="rp-filters"${phone ? '' : ' open'}><summary>Filters${s.p.length + s.k.length + (s.a ? 1 : 0) + (s.i ? 1 : 0) ? ` <b>${s.p.length + s.k.length + (s.a ? 1 : 0) + (s.i ? 1 : 0)}</b>` : ''}</summary>
<div class="rp-bar">
  <label class="ak-sel"><span>Time</span><select data-rp-w>${Object.entries(WINDOWS).map(([k, [l]]) => `<option value="${k}"${k === s.w ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
  <label class="ak-sel"><span>Agent</span><select data-rp-a><option value="">All agents</option>${agentOpts.map(n => `<option${n === s.a ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
  <label class="ak-q"><span>Issue</span><input type="search" data-rp-i value="${esc(s.i)}" placeholder="WS-34" inputmode="numeric"></label>
</div>
<div class="rp-chips" role="group" aria-label="People">${R.people.map(p => chip('p', p.id, p.name.split(' ')[0], s.p.includes(p.id))).join('')}</div>
<div class="rp-chips" role="group" aria-label="Kinds">${Object.entries(KINDS).map(([k, [l, c]]) => chip('k', k, l, s.k.includes(k), c)).join('')}${chip('k', 'r', 'Release by CI', s.k.includes('r'), 'var(--rm-green)')}<button type="button" class="rp-chip${s.m ? ' on' : ''}" data-rp-m aria-pressed="${s.m}">↷ Messages between agents</button>${R.runs ? `<button type="button" class="rp-chip${s.r ? ' on' : ''}" data-rp-r aria-pressed="${s.r}">▮ Runs, from the agents' logs</button>` : ''}</div>
</details>
<div class="rp-play">
  <button type="button" class="cc-btn" data-rp-play aria-pressed="false">▶ Play</button>
  <button type="button" class="cc-btn" data-rp-clip title="Full screen, 60 seconds, looping: for a stand-up screen or a screen recording">⛶ Clip: this window in 60 s</button>
  <label class="ak-sel"><span>Speed</span><select data-rp-speed>${SPEEDS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>
  <label class="ak-sel"><span>Jump to</span><select data-rp-jump><option value="">a stand-up…</option>${R.standups.filter(([m]) => m >= start && m <= end).map(([m, id]) => `<option value="${m}">${esc(dayLabel(at(R, m)))} ${esc(id.slice(-4, -2))}:${esc(id.slice(-2))}</option>`).join('')}</select></label>
  <input type="range" class="rp-scrub" data-rp-scrub min="${start}" max="${end}" value="${end}" step="1" aria-label="Time">
  <b class="rp-now" data-rp-now>${esc(dayLabel(at(R, end)))} ${esc(hhmm(at(R, end)))} UTC</b>
</div>
<p class="note">${Mm ? `${ev.length} commits and releases, ${Mm.total} messages in this window. Press Play: each message travels from its agent to the agent or person it is for (coloured by kind), the line between them thickens with every message, and an agent glows when it commits. Tap an agent or a person to filter; CI is at the centre.` : `${ev.length} commits and releases shown. Tap a dot for the commit;`} ${Mm ? '' : ' an arc is a commit\'s For: line, from its agent to the agent or person it is for.'} Kinds are read from each commit (who it is from and to), so they are a guide, not a record.</p>
${s.r ? `<p class="note rp-runnote">${RUNS === 'loading' || !RUNS ? 'Reading the agents\' run logs from observability\'s public vault…' : RUNS instanceof Error ? `The run logs could not be read (${esc(RUNS.message)}).` : `${runMarks.length} runs shown (▮, green when signed), from the latest ${RUNS.length} the agents logged (WS-160); runs carry no duration, so each is a mark at its minute.`}</p>` : ''}
<div class="rp-views" role="group" aria-label="Show as"><button type="button" class="rp-chip${s.v ? '' : ' on'}" data-rp-v="" aria-pressed="${!s.v}">Timeline</button><button type="button" class="rp-chip${s.v ? ' on' : ''}" data-rp-v="map" aria-pressed="${!!s.v}">Map</button></div>
${Mm ? `<div class="rp-wrap rpm-wrap">${Mm.pos.size > 1 ? mapSvg(Mm, s, KINDS) : '<p class="note">Nothing in this window for these filters.</p>'}<p class="rpm-tick" data-rpm-tick aria-live="off"></p></div>` : `<div class="rp-wrap">${rows.length ? svg : '<p class="note">Nothing in this window for these filters.</p>'}</div>`}
${sel ? detail(R, sel) : ''}
<p class="ak-fresh">As of ${esc(D.version)}, built ${esc(ago(D.built_at))}: every commit on dev since 2 November up to that release.</p>
</div>`
        bind(view, ctx, s, start, end, x, Mm)
        if (s.r && !RUNS && R.runs) loadRuns(R.runs, location.href, () => { if (/^#replay(\?|$)/.test(location.hash)) render(view, ctx) })
    }

    function detail(R, e) {
        const a = R.agents[e[1]], d = at(R, e[0])
        return `<section class="cc-card rp-detail" aria-label="The commit"><h3 class="ak-h3">${esc(KINDS[e[2]][0])}</h3><b>${esc(e[5])}</b>
<p class="note">${esc(a.name)} · ${esc(dayLabel(d))} ${esc(hhmm(d))} UTC${e[3].length ? ` · to ${esc(e[3].map(i => R.targets[i]).join(', '))}` : ''}</p>
<p>${e[4].map(n => `<a class="chip plain" href="#kanban?m=0&t=open,picked,in%20progress,done&o=WS-${n}">WS-${n}</a>`).join(' ')} <a href="${esc(R.repo)}/commit/${esc(e[6])}">The commit on GitHub</a></p></section>`
    }

    function bind(view, ctx, s, start, end, x, Mm) {
        const go = patch => { const open = !!view.querySelector('.rp-filters[open]'); history.replaceState(history.state, '', location.pathname + location.search + toHash({ ...s, ...patch })); render(view, ctx); const f = view.querySelector('.rp-filters'); if (f && open) f.open = true }
        view.querySelectorAll('[data-rp]').forEach(b => b.onclick = () => { const k = b.dataset.rp, v = b.dataset.v; go({ [k]: s[k].includes(v) ? s[k].filter(x => x !== v) : [...s[k], v] }) })
        const rr = view.querySelector('[data-rp-r]'); if (rr) rr.onclick = () => go({ r: !s.r })
        const mm = view.querySelector('[data-rp-m]'); if (mm) mm.onclick = () => go({ m: !s.m })
        const w = view.querySelector('[data-rp-w]'); if (w) w.onchange = () => go({ w: w.value })
        const a = view.querySelector('[data-rp-a]'); if (a) a.onchange = () => go({ a: a.value })
        const i = view.querySelector('[data-rp-i]'); if (i) { let t; i.oninput = () => { clearTimeout(t); t = setTimeout(() => { go({ i: i.value }); const n = view.querySelector('[data-rp-i]'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length) } }, 300) } }
        view.querySelectorAll('circle.rp-e').forEach(c => c.onclick = () => go({ sel: c.dataset.h === s.sel ? '' : c.dataset.h }))
        // playback: dots after the playhead fade; the pointer walks the sorted dots so each frame touches only what changed
        const dots = [...view.querySelectorAll('.rp-e')].sort((p, q) => +p.dataset.t - +q.dataset.t)
        const head = view.querySelector('.rp-head'), now = view.querySelector('[data-rp-now]'), scrub = view.querySelector('[data-rp-scrub]'), btn = view.querySelector('[data-rp-play]'), speed = view.querySelector('[data-rp-speed]')
        const R = ctx.D.replay
        let shown = dots.length
        const mapSeek = Mm ? mapClock(view, Mm, R, KINDS) : null
        const rateNow = () => s.c ? Math.max(1, (end - start) / 60) : +(speed ? speed.value : 60)
        if (mapSeek) mapSeek(end, rateNow())
        if (speed) speed.onchange = () => { if (mapSeek && !play) mapSeek(+scrub.value, rateNow()) }
        const arcs = [...view.querySelectorAll('.rp-arc')], playing = () => !!play
        function seek(t) {
            t = Math.max(start, Math.min(end, t))
            while (shown > 0 && +dots[shown - 1].dataset.t > t) dots[--shown].classList.add('fut')
            while (shown < dots.length && +dots[shown].dataset.t <= t) dots[shown++].classList.remove('fut')
            // slice 3: the messages of the last 90 minutes before the playhead are drawn bright, so each one lights up as it happens
            if (arcs.length && playing()) for (const a of arcs) a.classList.toggle('now', +a.dataset.t <= t && +a.dataset.t > t - 90)
            if (mapSeek) mapSeek(t, rateNow())
            if (head) { head.setAttribute('x1', x(t)); head.setAttribute('x2', x(t)) }
            if (now) now.textContent = `${dayLabel(at(R, t))} ${hhmm(at(R, t))} UTC`
            if (scrub && +scrub.value !== Math.round(t)) scrub.value = Math.round(t)
            return t
        }
        const stop = () => { if (play) { cancelAnimationFrame(play.raf); clearTimeout(play.raf) } play = null; arcs.forEach(a => a.classList.remove('now')); if (btn) { btn.textContent = '▶ Play'; btn.setAttribute('aria-pressed', 'false') } }
        if (scrub) scrub.oninput = () => { stop(); seek(+scrub.value) }
        const j = view.querySelector('[data-rp-jump]'); if (j) j.onchange = () => { if (j.value) { stop(); seek(+j.value) } }
        if (btn) btn.onclick = () => {
            if (play) return stop()
            let t = +scrub.value >= end ? seek(start) : +scrub.value
            play = { last: performance.now(), raf: 0 }; btn.textContent = '❚❚ Pause'; btn.setAttribute('aria-pressed', 'true')
            const rate = rateNow()
            const tick = ts => { if (!play) return; const dt = (ts - play.last) / 1000; play.last = ts; t = seek(t + dt * rate); if (t >= end) { if (!s.c) return stop(); play.last = ts + 3000; t = start - 1; play.raf = setTimeout(() => { seek(start); play.raf = requestAnimationFrame(tick) }, 3000); return } play.raf = requestAnimationFrame(tick) }
            play.raf = requestAnimationFrame(tick)
        }
        view.querySelectorAll('[data-rp-v]').forEach(b => b.onclick = () => { stop(); go({ v: b.dataset.rpV, sel: '' }) })
        view.querySelectorAll('[data-rpm-a]').forEach(g => { g.onclick = () => go({ a: g.dataset.rpmA === s.a ? '' : g.dataset.rpmA }); g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.onclick() } } })
        view.querySelectorAll('[data-rpm-p]').forEach(g => { const id = g.dataset.rpmP; g.onclick = () => go({ p: s.p.includes(id) ? s.p.filter(x => x !== id) : [...s.p, id] }); g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.onclick() } } })
        const cb = view.querySelector('[data-rp-clip]'); if (cb) cb.onclick = () => go({ c: true, sel: '' })
        const ex = view.querySelector('[data-rp-exit]'); if (ex) ex.onclick = () => go({ c: false })
        if (s.c) { if (!window.__rpEsc) { window.__rpEsc = true; addEventListener('keydown', e => { if (e.key === 'Escape' && parse(location.hash).c) { const b = document.querySelector('[data-rp-exit]'); if (b) b.click() } }) } if (btn) setTimeout(() => btn.click(), 400) }
    }

    root.AngeloReplay = { render, parse }
})(typeof self !== 'undefined' ? self : this)
