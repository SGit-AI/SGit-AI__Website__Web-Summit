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

    // embedded under Team and the machine's map (#collab), the timeline keeps its state in r_-prefixed keys of that address
    // (r_p, r_k, r_a, r_i, r_sel, r_m, r_r) and takes its window from the map's own w; standalone it is #replay as before
    function parse(hash, embed) {
        const i = hash.indexOf('?'), q0 = new URLSearchParams(i < 0 ? '' : hash.slice(i + 1))
        const q = embed ? { get: k => k === 'w' ? q0.get('w') : q0.get('r_' + k) } : q0
        const list = k => (q.get(k) || '').split(',').filter(Boolean)
        const w = q.get('w'); return { w: WINDOWS[w] ? w : '24h', p: list('p'), k: list('k'), a: q.get('a') || '', i: q.get('i') || '', sel: q.get('sel') || '', m: q.get('m') !== '0', r: q.get('r') === '1', c: q.get('c') === '1' }
    }
    function toHash(s, embed) {
        if (embed) {
            const i = location.hash.indexOf('?'), q = new URLSearchParams(i < 0 ? '' : location.hash.slice(i + 1)), set = (k, v) => { if (v) q.set('r_' + k, v); else q.delete('r_' + k) }
            set('p', s.p.join(',')); set('k', s.k.join(',')); set('a', s.a); set('i', s.i); set('sel', s.sel); set('m', s.m ? '' : '0'); set('r', s.r ? '1' : '')
            q.set('map', '1'); const t = q.toString().replace(/%2C/g, ',').replace(/%3A/g, ':'); return '#collab' + (t ? '?' + t : '')
        }
        const q = []; if (s.w !== '24h') q.push('w=' + s.w); if (s.p.length) q.push('p=' + s.p.join(',')); if (s.k.length) q.push('k=' + s.k.join(','))
        if (s.a) q.push('a=' + encodeURIComponent(s.a)); if (s.i) q.push('i=' + encodeURIComponent(s.i)); if (s.sel) q.push('sel=' + s.sel); if (!s.m) q.push('m=0'); if (s.r) q.push('r=1'); if (s.c) q.push('c=1')
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

    let play = null   // { raf, last, t, speed }
    // the map's clock (mountFlow) and the embedded timeline share one moment: the map says where it is, the timeline follows,
    // and a commit picked on the timeline moves the map there
    let flowApi = null, embedClock = null
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
        const { D, title, note, ownTitle, ago } = ctx, R = D.replay, E = !!ctx.embed
        if (play) { cancelAnimationFrame(play.raf); play = null }
        if (title && !E) title.innerHTML = `${ownTitle('Replay')}<small>${esc((D.person.name || D.person.id).split(' ')[0])}'s command centre</small>`
        if (!R) { view.innerHTML = '<p class="note">Replay has no data in this build.</p>'; return }
        const s = parse(location.hash, E), nowMin = Math.round((Date.now() - Date.parse(R.from)) / 6e4)
        if (E) setTimeout(() => { if (flowApi) flowApi.pick(s.sel) }, 0)   // the map, drawn before this timeline, picks out the commit's agent
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
        const W = s.c ? innerWidth - 24 : Math.max(320, (view.clientWidth || 960)), LW = phone ? 72 : 170, TOP = 34, RH = s.c ? Math.max(8, Math.min(22, Math.floor((innerHeight - 140 - TOP) / Math.max(1, rows.length)))) : phone ? 26 : 20
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
        view.innerHTML = `<div class="${E ? 'rp rp-embed' : 'ak rp'}${s.c ? ' rp-clip' : ''}">${s.c ? `<header class="rp-cliphead"><b>The team at work: ${esc(WINDOWS[s.w][0].toLowerCase())}, in 60 seconds</b><span data-rp-now></span><button type="button" class="cc-btn" data-rp-exit>Close the clip</button></header>` : note()}
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
<p class="note">${ev.length} commits and releases shown. Tap a dot for the commit;  an arc is a commit's For: line, from its agent to the agent or person it is for. Kinds are read from each commit (who it is from and to), so they are a guide, not a record.</p>
${s.r ? `<p class="note rp-runnote">${RUNS === 'loading' || !RUNS ? 'Reading the agents\' run logs from observability\'s public vault…' : RUNS instanceof Error ? `The run logs could not be read (${esc(RUNS.message)}).` : `${runMarks.length} runs shown (▮, green when signed), from the latest ${RUNS.length} the agents logged (WS-160); runs carry no duration, so each is a mark at its minute.`}</p>` : ''}
<div class="rp-wrap">${rows.length ? svg : '<p class="note">Nothing in this window for these filters.</p>'}</div>
${sel ? detail(R, sel) : ''}
<p class="ak-fresh">As of ${esc(D.version)}, built ${esc(ago(D.built_at))}: every commit on dev since 2 November up to that release.</p>
</div>`
        if (E) {   // the map's controls serve both: no play bar and no window of its own here
            const bar = view.querySelector('.rp-play'); if (bar) bar.remove()
            const tl = [...view.querySelectorAll('.rp-bar .ak-sel')].find(l => /^Time/.test(l.textContent)); if (tl) tl.remove()
            const fr = view.querySelector('.ak-fresh'); if (fr) fr.remove()
        }
        bind(view, ctx, s, start, end, x)
        if (s.r && !RUNS && R.runs) loadRuns(R.runs, location.href, () => { if (view.isConnected && (E ? /^#collab(\?|$)/ : /^#replay(\?|$)/).test(location.hash)) render(view, ctx) })
    }

    function detail(R, e) {
        const a = R.agents[e[1]], d = at(R, e[0])
        return `<section class="cc-card rp-detail" aria-label="The commit"><h3 class="ak-h3">${esc(KINDS[e[2]][0])}</h3><b>${esc(e[5])}</b>
<p class="note">${esc(a.name)} · ${esc(dayLabel(d))} ${esc(hhmm(d))} UTC${e[3].length ? ` · to ${esc(e[3].map(i => R.targets[i]).join(', '))}` : ''}</p>
<p>${e[4].map(n => `<a class="chip plain" href="#kanban?m=0&t=open,picked,in%20progress,done&o=WS-${n}">WS-${n}</a>`).join(' ')} <a href="${esc(R.repo)}/commit/${esc(e[6])}">The commit on GitHub</a></p></section>`
    }

    function bind(view, ctx, s, start, end, x) {
        const go = patch => { const open = !!view.querySelector('.rp-filters[open]'); history.replaceState(history.state, '', location.pathname + location.search + toHash({ ...s, ...patch }, ctx.embed)); render(view, ctx); const f = view.querySelector('.rp-filters'); if (f && open) f.open = true }
        view.querySelectorAll('[data-rp]').forEach(b => b.onclick = () => { const k = b.dataset.rp, v = b.dataset.v; go({ [k]: s[k].includes(v) ? s[k].filter(x => x !== v) : [...s[k], v] }) })
        const rr = view.querySelector('[data-rp-r]'); if (rr) rr.onclick = () => go({ r: !s.r })
        const mm = view.querySelector('[data-rp-m]'); if (mm) mm.onclick = () => go({ m: !s.m })
        const w = view.querySelector('[data-rp-w]'); if (w) w.onchange = () => go({ w: w.value })
        const a = view.querySelector('[data-rp-a]'); if (a) a.onchange = () => go({ a: a.value })
        const i = view.querySelector('[data-rp-i]'); if (i) { let t; i.oninput = () => { clearTimeout(t); t = setTimeout(() => { go({ i: i.value }); const n = view.querySelector('[data-rp-i]'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length) } }, 300) } }
        view.querySelectorAll('circle.rp-e').forEach(c => c.onclick = () => { if (ctx.embed && flowApi && c.dataset.h !== s.sel) flowApi.seek(+c.dataset.t); go({ sel: c.dataset.h === s.sel ? '' : c.dataset.h }) })
        // playback: dots after the playhead fade; the pointer walks the sorted dots so each frame touches only what changed
        const dots = [...view.querySelectorAll('.rp-e')].sort((p, q) => +p.dataset.t - +q.dataset.t)
        const head = view.querySelector('.rp-head'), now = view.querySelector('[data-rp-now]'), scrub = view.querySelector('[data-rp-scrub]'), btn = view.querySelector('[data-rp-play]'), speed = view.querySelector('[data-rp-speed]')
        const R = ctx.D.replay
        let shown = dots.length
        const rateNow = () => s.c ? Math.max(1, (end - start) / 60) : +(speed ? speed.value : 60)
        const arcs = [...view.querySelectorAll('.rp-arc')], playing = () => !!play
        function seek(t) {
            t = Math.max(start, Math.min(end, t))
            while (shown > 0 && +dots[shown - 1].dataset.t > t) dots[--shown].classList.add('fut')
            while (shown < dots.length && +dots[shown].dataset.t <= t) dots[shown++].classList.remove('fut')
            // slice 3: the messages of the last 90 minutes before the playhead are drawn bright, so each one lights up as it happens
            if (arcs.length && playing()) for (const a of arcs) a.classList.toggle('now', +a.dataset.t <= t && +a.dataset.t > t - 90)
            if (head) { head.setAttribute('x1', x(t)); head.setAttribute('x2', x(t)) }
            if (now) now.textContent = `${dayLabel(at(R, t))} ${hhmm(at(R, t))} UTC`
            if (scrub && +scrub.value !== Math.round(t)) scrub.value = Math.round(t)
            return t
        }
        // embedded: follow the map's clock
        if (embedClock) removeEventListener('ak-clock', embedClock)
        embedClock = null
        if (ctx.embed) { embedClock = e => { if (view.isConnected) seek(e.detail) }; addEventListener('ak-clock', embedClock); if (flowApi && flowApi.at() != null) seek(flowApi.at()) }
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
        const cb = view.querySelector('[data-rp-clip]'); if (cb) cb.onclick = () => go({ c: true, sel: '' })
        const ex = view.querySelector('[data-rp-exit]'); if (ex) ex.onclick = () => go({ c: false })
        if (s.c) { if (!window.__rpEsc) { window.__rpEsc = true; addEventListener('keydown', e => { if (e.key === 'Escape' && parse(location.hash).c) { const b = document.querySelector('[data-rp-exit]'); if (b) b.click() } }) } if (btn) setTimeout(() => btn.click(), 400) }
    }

    // ---------- playback on another view's map (Team and the machine's map; Angelo, 6 November: "apply all these
    // enhancements to the existing map there rather than creating a new one") ----------
    // mountFlow(host, o) puts Replay's clock on a map that is already drawn: o.svg (the map's <svg>), o.pos (node id ->
    // {x, y, person, kind}), o.place(person, n) (where that person's n agents sit in this layout), o.ctrl(a, b) (the
    // control point its links curve through), o.colOf(person), o.nodeOf(name) (the node a commit's agent or For: target
    // lands on, or null), o.keep(from, to) (the map's focus), o.w (the window).
    // While it plays back (Angelo, 6 November): an agent joins the map the first time it is used (its first commit, or
    // the first message to it) and stays; it grows with the messages it has sent so far and never shrinks; each person's
    // agents are re-arranged around them as more arrive, gliding to their new places. Each For: line is a dot that
    // travels, in its sender's colour, from its agent to its target in one second of playback; the line under it shows
    // until the dot arrives and fades one second after the pair's last message. The controls are Replay's.
    const POOL = 160, TRAVEL_S = 1, FADE_S = 1
    // the shared shell redraws the page from time to time, which rebuilds the map: where the playback was is kept here,
    // per map (o.key: window, layout, focus), and picked up again by the new map
    let flowState = { key: '', t: null, playing: false, speed: '' }
    function mountFlow(host, o) {
        const R = o.D && o.D.replay, bar = host.querySelector('[data-tmf]'); if (!R || !bar || !o.svg) return
        const w = WINDOWS[o.w] ? o.w : '24h', nowMin = Math.round((Date.now() - Date.parse(R.from)) / 6e4), end = nowMin, start = WINDOWS[w][1] ? Math.max(0, end - WINDOWS[w][1]) : 0
        const lowerBound = (arr, v, key) => { let lo = 0, hi = arr.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (key(arr[mid]) <= v) lo = mid + 1; else hi = mid } return lo }
        const isAgent = id => { const n = o.pos.get(id); return !!n && n.kind === 'a' }
        // ---- the history: since 2 November, so an agent used before the window is already there when it starts ----
        const firstUse = new Map(), sentAt = new Map(), use = (id, t) => { if (isAgent(id) && !(firstUse.get(id) <= t)) firstUse.set(id, t) }
        for (const e of R.events) if (e[1] >= 0) {
            const from = o.nodeOf(R.agents[e[1]].name); if (!from) continue
            use(from, e[0])
            for (const ti of e[3]) { const to = o.nodeOf(R.targets[ti]); if (!to || to === from) continue; use(to, e[0]); if (isAgent(from)) { if (!sentAt.has(from)) sentAt.set(from, []); sentAt.get(from).push(e[0]) } }
        }
        for (const [id, n] of o.pos) if (n.kind === 'a' && n.first) use(id, Math.max(0, Math.round((Date.parse(n.first) - Date.parse(R.from)) / 6e4)))   // a newsroom agent: its first commit there
        for (const [id, n] of o.pos) if (n.kind === 'a' && n.runsAs && firstUse.has(n.runsAs)) use(id, firstUse.get(n.runsAs))                          // a runner: with the agent it works as
        for (const a of sentAt.values()) a.sort((x, y) => x - y)
        // each person's agents in the order they arrived; one that is never used stays off the map
        const byPerson = new Map()
        for (const [id, t] of [...firstUse].sort((x, y) => x[1] - y[1] || (x[0] < y[0] ? -1 : 1))) { const p = o.pos.get(id).person; if (!byPerson.has(p)) byPerson.set(p, []); byPerson.get(p).push([id, t]) }
        // ---- the window's messages ----
        const ev = R.events.filter(e => e[0] >= start && e[0] <= end)
        const msgs = [], pairs = new Map()
        for (const e of ev) if (e[1] >= 0) { const from = o.nodeOf(R.agents[e[1]].name); if (!from) continue; for (const ti of e[3]) { const to = o.nodeOf(R.targets[ti]); if (!to || to === from || !o.keep(from, to)) continue; const k = from + '|' + to; if (!pairs.has(k)) pairs.set(k, { i: pairs.size, from, to, ts: [] }); msgs.push({ t: e[0], from, to, pair: pairs.get(k) }) } }
        msgs.sort((x, y) => x.t - y.t); for (const m of msgs) m.pair.ts.push(m.t)
        const acts = ev.filter(e => e[1] >= 0 && o.nodeOf(R.agents[e[1]].name)).sort((x, y) => x[0] - y[0])
        const P = [...pairs.values()], maxN = Math.max(1, ...P.map(p => p.ts.length)), f1 = n => n.toFixed(1)
        // ---- the layers, under the nodes ----
        const NS = 'http://www.w3.org/2000/svg', nodesG = o.svg.querySelector('.tm-nodes')
        const gl = document.createElementNS(NS, 'g'); gl.setAttribute('class', 'tmf-links')
        gl.innerHTML = P.map(p => `<path class="z" stroke="${o.colOf((o.pos.get(p.from) || {}).person) || 'var(--rm-text-muted)'}"/>`).join('')
        const gp = document.createElementNS(NS, 'g'); gp.setAttribute('class', 'tmf-pulses')
        gp.innerHTML = Array.from({ length: POOL }, () => '<circle r="5" class="z"/>').join('')
        o.svg.insertBefore(gl, nodesG); o.svg.insertBefore(gp, nodesG)
        const links = [...gl.children], pulses = [...gp.children]
        // ---- the agent nodes: their parts, and where they are now (cur) and are going (tgt) ----
        const N = new Map()
        for (const g of o.svg.querySelectorAll('.tm-a[data-tm-f]')) {
            const id = g.dataset.tmF, n = o.pos.get(id); if (!n) continue
            let label = g.querySelector('text'); if (!label) { label = document.createElementNS(NS, 'text'); label.setAttribute('class', 'tmf-l'); label.setAttribute('x', f1(n.x)); label.textContent = n.label; g.appendChild(label) }
            N.set(id, { g, n, dot: g.querySelector('circle:not(.tm-kr), rect'), ring: g.querySelector('.tm-kr'), label, cur: null, tgt: null, r: -1, on: null })
        }
        const pos = id => { const a = N.get(id); return a && a.cur ? a.cur : o.pos.get(id) }
        const ctrl = (a, b) => o.ctrl(a, b)
        // ---- the record's own events (spec-live-map.md section 2, data.json's replay.live): a key mark on an agent while it
        // holds a published key (grey once its keys have ended), a thin gold ring once it has a lane for sealed messages, and a
        // gold dot from one to another for each sealed file, "a key handed over" and nothing more (decision 1) ----
        const L = R.live && !R.live.error ? R.live : { keys: [], handovers: [], lanes: [] }
        const mark = (g, cls) => { const e = document.createElementNS(NS, 'path'); e.setAttribute('class', cls); g.appendChild(e); return e }
        for (const [t, who, st] of L.keys || []) { const a = N.get(o.nodeOf(who)); if (!a) continue; if (!a.keys) a.keys = []; a.keys.push([t, st === 'published' ? 1 : -1]) }
        for (const [t, who] of L.lanes || []) { const a = N.get(o.nodeOf(who)); if (a && !(a.lane <= t)) a.lane = t }
        for (const a of N.values()) {
            if (a.keys) { let c = 0; a.keys = a.keys.sort((x, y) => x[0] - y[0]).map(([t, d]) => [t, c = Math.max(0, c + d)]); a.km = mark(a.g, 'tmf-km') }
            if (a.lane != null) a.lr = mark(a.g, 'tmf-lr')
        }
        const seals = (L.handovers || []).filter(([t]) => t >= start && t <= end).map(([t, by, to]) => ({ t, from: o.nodeOf(by), to: o.nodeOf(to) })).filter(m => m.from && m.to && m.from !== m.to && o.keep(m.from, m.to))
        const gs = document.createElementNS(NS, 'g'); gs.setAttribute('class', 'tmf-seals')
        gs.innerHTML = Array.from({ length: 8 }, () => '<circle r="6.5" class="z"><title>a key handed over</title></circle>').join('')
        o.svg.insertBefore(gs, nodesG)
        const sealDots = [...gs.children]; let sfly = []
        // a sealed message an agent says it sent or verified (in its own commit): a dot with a lock at the sender, in its colour,
        // linked to that commit; it swells and fades. Never the message or the subject, only "sent" or "verified".
        const said = (L.messages || []).filter(([t]) => t >= start && t <= end).map(([t, who, k, h]) => ({ t, from: o.nodeOf(who), k, h })).filter(m => m.from && N.has(m.from))
        const gm = document.createElementNS(NS, 'g'); gm.setAttribute('class', 'tmf-msgs')
        gm.innerHTML = Array.from({ length: 4 }, () => '<a class="z" target="_blank" rel="noopener"><title></title><circle r="7"/><path d="M-2.6 -0.4h5.2v3.8h-5.2zM-1.6 -0.4v-1.4a1.6 1.6 0 0 1 3.2 0v1.4"/></a>').join('')
        o.svg.appendChild(gm)                                   // above the nodes, so its link can be clicked
        const msgDots = [...gm.children]; let mfly = []
        bar.innerHTML = `<div class="rp-play tmf-play">
  <button type="button" class="cc-btn" data-tmf-play aria-pressed="false">▶ Play back</button>
  <label class="ak-sel"><span>Time</span><select data-tmf-w>${Object.entries(WINDOWS).map(([k, [l]]) => `<option value="${k}"${k === w ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
  <label class="ak-sel"><span>Speed</span><select data-tmf-speed>${SPEEDS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>
  <label class="ak-sel"><span>Jump to</span><select data-tmf-jump><option value="">a stand-up…</option>${R.standups.filter(([m]) => m >= start && m <= end).map(([m, id]) => `<option value="${m}">${esc(dayLabel(at(R, m)))} ${esc(id.slice(-4, -2))}:${esc(id.slice(-2))}</option>`).join('')}</select></label>
  <input type="range" class="rp-scrub" data-tmf-scrub min="${start}" max="${end}" value="${end}" step="1" aria-label="Time">
  <b class="rp-now" data-tmf-now>${esc(dayLabel(at(R, end)))} ${esc(hhmm(at(R, end)))} UTC</b>
</div><p class="tmf-tick" data-tmf-tick aria-live="off">${msgs.length} messages in this window. Press Play back: agents join the map the first time they are used and gather around their person; each message travels from its agent, in its sender's colour, to the agent or person it is for, along a line that fades when they stop talking.</p>`
        const btn = bar.querySelector('[data-tmf-play]'), speed = bar.querySelector('[data-tmf-speed]'), scrub = bar.querySelector('[data-tmf-scrub]'), now = bar.querySelector('[data-tmf-now]'), tick = bar.querySelector('[data-tmf-tick]')
        bar.querySelector('[data-tmf-w]').onchange = e => o.setWindow(e.target.value)
        const rate = () => +speed.value
        const nameOf = n => n.startsWith('pt:') ? n.split(':')[2] : n.split('@')[0]
        let T = end, on = false, playing = false, raf = 0, lastTs = 0, lastTick = '', hot = new Set(), counts = new Map(), fly = [], travel = 1
        // ---- the state at time T (who is on the map and where they should be, the lines, the dots in flight) ----
        function state() {
            travel = Math.max(1, rate() * TRAVEL_S)
            const fade = Math.max(1, rate() * FADE_S)
            let total = 0
            for (const [p, list] of byPerson) {
                const k = lowerBound(list, T, x => x[1]); total += k
                if (counts.get(p) === k) continue
                counts.set(p, k)
                const spots = k ? o.place(p, k) : [], P0 = o.pos.get(p)
                list.forEach(([id], i) => { const a = N.get(id); if (!a) return; if (i < k) { a.tgt = spots[i]; if (!a.on) { a.cur = { x: P0 ? P0.x : a.n.x, y: P0 ? P0.y : a.n.y }; a.on = true; a.g.classList.remove('tmf-gone'); a.g.classList.remove('tmf-born'); void a.g.getBBox; a.g.classList.add('tmf-born') } } else if (a.on !== false) { a.on = false; a.g.classList.add('tmf-gone') } })
            }
            for (const [id, a] of N) if (a.on === null) { a.on = false; a.g.classList.add('tmf-gone') }   // never used: off the map
            // size: the messages sent so far
            for (const [id, a] of N) { if (!a.on) continue; const ts = sentAt.get(id), n = ts ? lowerBound(ts, T, x => x) : 0, r = Math.min(13, 3.5 + 1.3 * Math.sqrt(n)); if (Math.abs(r - a.r) < 0.05) continue; a.r = r; size(a) }
            // keys and lanes: as they were at T, on the agents that are on the map
            for (const a of N.values()) {
                if (a.km) { const k = lowerBound(a.keys, T, x => x[0]), st = !a.on || !k ? '' : a.keys[k - 1][1] > 0 ? 'on' : 'end'; if (st !== a.kst) { a.kst = st; a.g.classList.toggle('tmf-key', st === 'on'); a.g.classList.toggle('tmf-keyend', st === 'end') } }
                if (a.lr) { const ln = !!a.on && T >= a.lane; if (ln !== a.ln) { a.ln = ln; a.g.classList.toggle('tmf-lane', ln) } }
            }
            // lines: lit while a dot is on its way, then fading
            for (const p of P) {
                const k = lowerBound(p.ts, T, x => x), last = k ? p.ts[k - 1] : null, ends = isOn(p.from) && isOn(p.to)
                const op = last == null || !ends ? 0 : T <= last + travel ? 1 : Math.max(0, 1 - (T - last - travel) / fade), el = links[p.i], vis = op > 0.03
                if (vis !== p.vis) { el.classList.toggle('z', !vis); p.vis = vis }
                if (vis) { const ow = (0.8 + 4.2 * Math.sqrt(k / maxN)).toFixed(2), oo = (0.15 + 0.65 * op).toFixed(2); if (ow !== p.ow) el.setAttribute('stroke-width', p.ow = ow); if (oo !== p.oo) el.setAttribute('stroke-opacity', p.oo = oo) }
            }
            const sent = lowerBound(msgs, T, m => m.t), lo = lowerBound(msgs, T - travel, m => m.t); fly = msgs.slice(Math.max(lo, sent - POOL), sent)
            const ms = lowerBound(said, T, m => m.t); mfly = said.slice(Math.max(lowerBound(said, T - travel * 3, m => m.t), ms - msgDots.length), ms)
            const ss = lowerBound(seals, T, m => m.t); sfly = seals.slice(Math.max(lowerBound(seals, T - travel * 2, m => m.t), ss - sealDots.length), ss)
            // busy: committed in the last moment of playback
            const busy = new Set()
            for (let i = lowerBound(acts, T - travel * 1.5, e => e[0]); i < acts.length && acts[i][0] <= T; i++) busy.add(o.nodeOf(R.agents[acts[i][1]].name))
            for (const id of hot) if (!busy.has(id)) { const a = N.get(id); if (a) a.g.classList.remove('tmf-hot') }
            for (const id of busy) if (!hot.has(id)) { const a = N.get(id); if (a) a.g.classList.add('tmf-hot') }
            hot = busy
            const e = acts[lowerBound(acts, T, x => x[0]) - 1], key = e ? e[6] : ''
            if (key !== lastTick) { lastTick = key; tick.innerHTML = e ? `<b>${esc(hhmm(at(R, e[0])))}</b> ${esc(nameOf(R.agents[e[1]].name))}${e[3].length ? ' → ' + esc(e[3].map(i => nameOf(R.targets[i])).join(', ')) : ''}: ${esc(e[5])}` : '' }
            now.textContent = `${dayLabel(at(R, T))} ${hhmm(at(R, T))} UTC · ${total} agent${total === 1 ? '' : 's'}`
            if (+scrub.value !== Math.round(T)) scrub.value = Math.round(T)
            flowState.t = T
            dispatchEvent(new CustomEvent('ak-clock', { detail: T }))
        }
        const isOn = id => { const a = N.get(id); return a ? !!a.on : true }
        function size(a) {
            const { x, y } = a.n, r = a.r
            if (a.dot.tagName === 'rect') { const s = r * 1.6; a.dot.setAttribute('x', f1(x - s / 2)); a.dot.setAttribute('y', f1(y - s / 2)); a.dot.setAttribute('width', f1(s)); a.dot.setAttribute('height', f1(s)) }
            else a.dot.setAttribute('r', f1(r))
            if (a.ring) a.ring.setAttribute('r', f1(r + 5))
            if (a.km) { const cx = x + r * 0.8 + 3, cy = y - r * 0.8 - 3; a.km.setAttribute('d', `M${f1(cx - 2)} ${f1(cy)}a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M${f1(cx + 2)} ${f1(cy)}h4.5m-1.6 0v2`) }
            if (a.lr) { const q = r + 2.5; a.lr.setAttribute('d', `M${f1(x - q)} ${f1(y)}a${f1(q)} ${f1(q)} 0 1 0 ${f1(2 * q)} 0a${f1(q)} ${f1(q)} 0 1 0 ${f1(-2 * q)} 0`) }
            a.label.setAttribute('y', f1(y - r - 6))
        }
        // ---- drawing what moves: the agents gliding to their places, the lines and dots that follow them ----
        function paint(dt) {
            let moving = false
            const k = 1 - Math.exp(-dt * 5)
            for (const a of N.values()) {
                if (!a.on || !a.tgt) continue
                const dx = a.tgt.x - a.cur.x, dy = a.tgt.y - a.cur.y
                if (Math.abs(dx) + Math.abs(dy) > 0.4) { a.cur.x += dx * k; a.cur.y += dy * k; moving = true } else { a.cur.x = a.tgt.x; a.cur.y = a.tgt.y }
                const tx = f1(a.cur.x - a.n.x), ty = f1(a.cur.y - a.n.y); if (tx !== a.tx || ty !== a.ty) { a.tx = tx; a.ty = ty; a.g.setAttribute('transform', `translate(${tx} ${ty})`) }
            }
            for (const p of P) if (p.vis) { const a = pos(p.from), b = pos(p.to), q = ctrl(a, b); links[p.i].setAttribute('d', `M${f1(a.x)} ${f1(a.y)}Q${f1(q.x)} ${f1(q.y)} ${f1(b.x)} ${f1(b.y)}`) }
            pulses.forEach((c, i) => {
                const m = fly[i]; if (!m) { if (!c.classList.contains('z')) c.classList.add('z'); return }
                const a = pos(m.from), b = pos(m.to), q = ctrl(a, b), u = Math.min(1, Math.max(0, (T - m.t) / travel)), v = 1 - u
                c.setAttribute('cx', f1(v * v * a.x + 2 * v * u * q.x + u * u * b.x)); c.setAttribute('cy', f1(v * v * a.y + 2 * v * u * q.y + u * u * b.y))
                c.setAttribute('fill', o.colOf((o.pos.get(m.from) || {}).person) || 'var(--rm-text-muted)'); c.classList.remove('z')
            })
            sealDots.forEach((c, i) => {
                const m = sfly[i]; if (!m) { if (!c.classList.contains('z')) c.classList.add('z'); return }
                const a = pos(m.from), b = pos(m.to), q = ctrl(a, b), u = Math.min(1, Math.max(0, (T - m.t) / (travel * 2))), v = 1 - u
                c.setAttribute('cx', f1(v * v * a.x + 2 * v * u * q.x + u * u * b.x)); c.setAttribute('cy', f1(v * v * a.y + 2 * v * u * q.y + u * u * b.y)); c.classList.remove('z')
            })
            msgDots.forEach((g, i) => {
                const m = mfly[i]; if (!m) { if (!g.classList.contains('z')) g.classList.add('z'); return }
                const a = pos(m.from), d = 0.75 * (Math.max(4, N.get(m.from).r) + 7), u = Math.min(1, Math.max(0, (T - m.t) / (travel * 3))), sc = (1 + 0.6 * Math.sin(Math.PI * Math.min(1, u * 2))).toFixed(2)
                if (g.dataset.h !== m.h) { g.dataset.h = m.h; g.setAttribute('href', `${R.repo}/commit/${m.h}`); g.firstChild.textContent = `a sealed message ${m.k}`; g.querySelector('circle').setAttribute('fill', o.colOf((o.pos.get(m.from) || {}).person) || 'var(--rm-text-muted)') }
                g.setAttribute('transform', `translate(${f1(a.x + d)} ${f1(a.y - d)}) scale(${sc})`); g.style.opacity = (1 - 0.7 * u).toFixed(2); g.classList.remove('z')
            })
            return moving
        }
        // one loop: it advances the clock while playing, and runs while anything still moves
        function frame(ts) {
            raf = 0; if (!host.isConnected) return
            const dt = Math.min(0.1, (ts - (lastTs || ts)) / 1000); lastTs = ts
            if (playing) { T = Math.min(end, T + dt * rate()); state(); if (T >= end) stop() }
            const moving = paint(dt)
            if (playing || moving) raf = requestAnimationFrame(frame); else lastTs = 0
        }
        const kick = () => { if (!raf) { lastTs = 0; raf = requestAnimationFrame(frame) } }
        function seek(t) { T = Math.max(start, Math.min(end, t)); if (!on) { on = true; o.svg.classList.add('tm-replay') } state(); kick(); return T }
        const key = o.key || w
        if (flowState.key !== key) flowState = { key, t: null, playing: false, speed: flowState.speed }
        if (flowState.speed) speed.value = flowState.speed
        function stop() { playing = false; flowState.playing = false; btn.textContent = '▶ Play back'; btn.setAttribute('aria-pressed', 'false') }
        function play() { playing = true; flowState.playing = true; btn.textContent = '❚❚ Pause'; btn.setAttribute('aria-pressed', 'true'); kick() }
        scrub.oninput = () => { stop(); seek(+scrub.value) }
        const j = bar.querySelector('[data-tmf-jump]'); j.onchange = () => { if (j.value) { stop(); seek(+j.value) } }
        speed.onchange = () => { flowState.speed = speed.value; if (on) seek(T) }
        btn.onclick = () => { if (playing) return stop(); seek(+scrub.value >= end ? start : +scrub.value); play() }
        // picked up after a redraw: the same moment, still playing if it was
        if (flowState.t != null) { seek(flowState.t); if (flowState.playing) play() }
        // a commit picked on the timeline: its agent is picked out on the map (a dashed ring and its name), until another is picked or it is cleared
        const pick = sha => {
            for (const v of N.values()) v.g.classList.remove('tmf-pick')
            const e = sha && R.events.find(x => x[6] === sha && x[1] >= 0), from = e && o.nodeOf(R.agents[e[1]].name), v = from && N.get(from)
            if (v) v.g.classList.add('tmf-pick')
        }
        flowApi = { seek, at: () => flowState.t, pick }
        return { seek, msgs: msgs.length }
    }

    root.AngeloReplay = { render, parse, mountFlow }
})(typeof self !== 'undefined' ? self : this)
