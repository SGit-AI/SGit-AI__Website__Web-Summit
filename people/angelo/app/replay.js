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
        const w = q.get('w'); return { w: WINDOWS[w] ? w : '24h', p: list('p'), k: list('k'), a: q.get('a') || '', i: q.get('i') || '', sel: q.get('sel') || '' }
    }
    function toHash(s) {
        const q = []; if (s.w !== '24h') q.push('w=' + s.w); if (s.p.length) q.push('p=' + s.p.join(',')); if (s.k.length) q.push('k=' + s.k.join(','))
        if (s.a) q.push('a=' + encodeURIComponent(s.a)); if (s.i) q.push('i=' + encodeURIComponent(s.i)); if (s.sel) q.push('sel=' + s.sel)
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

    let play = null   // { raf, last, t, speed }
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
            else { rows.push({ kind: 'head', label: p.name }); for (const [a, i] of mine) rows.push({ kind: 'agent', label: a.short, title: a.name, idx: [i] }) }
        }
        const W = Math.max(320, view.clientWidth || 960), LW = phone ? 72 : 170, RH = phone ? 26 : 20, TOP = 34
        const H = TOP + rows.length * RH + 8, span = Math.max(60, end - start)
        const x = m => LW + (m - start) / span * (W - LW - 12)
        const rowOf = new Map(); rows.forEach((r, n) => (r.idx || []).forEach(i => rowOf.set(i, n)))
        // the label spacing follows the width: the first step that leaves about 56 px between labels
        const ppm = (W - LW - 12) / span, step = [60, 120, 180, 360, 720, 1440, 2880, 5760].find(st => st * ppm >= 56) || 5760
        const ticks = []; for (let m = Math.ceil(start / step) * step; m <= end; m += step) ticks.push(m)
        const sel = ev.find(e => e[1] >= 0 && e[6] === s.sel)
        const svg = `<svg class="rp-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Commits as a timeline, ${ev.length} shown">
<g class="rp-grid">${ticks.map(m => `<line x1="${x(m)}" x2="${x(m)}" y1="${TOP - 6}" y2="${H}"/><text x="${x(m) + 3}" y="12">${step >= 1440 ? esc(dayLabel(at(R, m))) : esc(m % 1440 === 0 ? dayLabel(at(R, m)) : hhmm(at(R, m)))}</text>`).join('')}</g>
<g class="rp-stand">${R.standups.filter(([m]) => m >= start && m <= end).map(([m, id]) => `<line x1="${x(m)}" x2="${x(m)}" y1="${TOP - 10}" y2="${H}"/><text x="${x(m) + 3}" y="${TOP - 12}">stand-up ${esc(id.slice(-4, -2))}:${esc(id.slice(-2))}</text>`).join('')}</g>
${rows.map((r, n) => `<g class="rp-row ${r.kind}"><rect x="0" y="${TOP + n * RH}" width="${W}" height="${RH}"/><text x="6" y="${TOP + n * RH + RH / 2 + 4}">${esc(r.label)}${r.title ? `<title>${esc(r.title)}</title>` : ''}</text></g>`).join('')}
<g class="rp-rel">${ev.filter(e => e[1] < 0).map(e => `<line class="rp-e" data-t="${e[0]}" x1="${x(e[0])}" x2="${x(e[0])}" y1="${TOP - 4}" y2="${TOP}"><title>${esc(e[5])} by CI, ${esc(hhmm(at(R, e[0])))} UTC</title></line>`).join('')}</g>
<g class="rp-dots">${ev.filter(e => e[1] >= 0 && rowOf.has(e[1])).map(e => `<circle class="rp-e${e[6] === s.sel ? ' on' : ''}" data-t="${e[0]}" data-h="${esc(e[6])}" cx="${x(e[0]).toFixed(1)}" cy="${TOP + rowOf.get(e[1]) * RH + RH / 2}" r="${phone ? 4 : 3.5}" fill="${KINDS[e[2]][1]}"><title>${esc(R.agents[e[1]].name)}, ${esc(hhmm(at(R, e[0])))} UTC: ${esc(e[5])}</title></circle>`).join('')}</g>
<line class="rp-head" x1="${x(end)}" x2="${x(end)}" y1="${TOP - 10}" y2="${H}"/></svg>`
        const chip = (k, v, l, on, col) => `<button type="button" class="rp-chip${on ? ' on' : ''}" data-rp="${k}" data-v="${esc(v)}" aria-pressed="${on}">${col ? `<i style="background:${col}"></i>` : ''}${esc(l)}</button>`
        const agentOpts = [...agentsSeen].map(i => R.agents[i].name).sort()
        view.innerHTML = `<div class="ak rp">${note()}
<details class="rp-filters"${phone ? '' : ' open'}><summary>Filters${s.p.length + s.k.length + (s.a ? 1 : 0) + (s.i ? 1 : 0) ? ` <b>${s.p.length + s.k.length + (s.a ? 1 : 0) + (s.i ? 1 : 0)}</b>` : ''}</summary>
<div class="rp-bar">
  <label class="ak-sel"><span>Time</span><select data-rp-w>${Object.entries(WINDOWS).map(([k, [l]]) => `<option value="${k}"${k === s.w ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
  <label class="ak-sel"><span>Agent</span><select data-rp-a><option value="">All agents</option>${agentOpts.map(n => `<option${n === s.a ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
  <label class="ak-q"><span>Issue</span><input type="search" data-rp-i value="${esc(s.i)}" placeholder="WS-34" inputmode="numeric"></label>
</div>
<div class="rp-chips" role="group" aria-label="People">${R.people.map(p => chip('p', p.id, p.name.split(' ')[0], s.p.includes(p.id))).join('')}</div>
<div class="rp-chips" role="group" aria-label="Kinds">${Object.entries(KINDS).map(([k, [l, c]]) => chip('k', k, l, s.k.includes(k), c)).join('')}${chip('k', 'r', 'Release by CI', s.k.includes('r'), 'var(--rm-green)')}</div>
</details>
<div class="rp-play">
  <button type="button" class="cc-btn" data-rp-play aria-pressed="false">▶ Play</button>
  <label class="ak-sel"><span>Speed</span><select data-rp-speed>${SPEEDS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>
  <label class="ak-sel"><span>Jump to</span><select data-rp-jump><option value="">a stand-up…</option>${R.standups.filter(([m]) => m >= start && m <= end).map(([m, id]) => `<option value="${m}">${esc(dayLabel(at(R, m)))} ${esc(id.slice(-4, -2))}:${esc(id.slice(-2))}</option>`).join('')}</select></label>
  <input type="range" class="rp-scrub" data-rp-scrub min="${start}" max="${end}" value="${end}" step="1" aria-label="Time">
  <b class="rp-now" data-rp-now>${esc(dayLabel(at(R, end)))} ${esc(hhmm(at(R, end)))} UTC</b>
</div>
<p class="note">${ev.length} commits and releases shown. Tap a dot for the commit. Kinds are read from each commit (who it is from and to), so they are a guide, not a record.</p>
<div class="rp-wrap">${rows.length ? svg : '<p class="note">Nothing in this window for these filters.</p>'}</div>
${sel ? detail(R, sel) : ''}
<p class="ak-fresh">As of ${esc(D.version)}, built ${esc(ago(D.built_at))}: every commit on dev since 2 November up to that release.</p>
</div>`
        bind(view, ctx, s, start, end, x)
    }

    function detail(R, e) {
        const a = R.agents[e[1]], d = at(R, e[0])
        return `<section class="cc-card rp-detail" aria-label="The commit"><h3 class="ak-h3">${esc(KINDS[e[2]][0])}</h3><b>${esc(e[5])}</b>
<p class="note">${esc(a.name)} · ${esc(dayLabel(d))} ${esc(hhmm(d))} UTC${e[3].length ? ` · to ${esc(e[3].map(i => R.targets[i]).join(', '))}` : ''}</p>
<p>${e[4].map(n => `<a class="chip plain" href="#kanban?m=0&t=open,picked,in%20progress,done&o=WS-${n}">WS-${n}</a>`).join(' ')} <a href="${esc(R.repo)}/commit/${esc(e[6])}">The commit on GitHub</a></p></section>`
    }

    function bind(view, ctx, s, start, end, x) {
        const go = patch => { const open = !!view.querySelector('.rp-filters[open]'); history.replaceState(history.state, '', location.pathname + location.search + toHash({ ...s, ...patch })); render(view, ctx); const f = view.querySelector('.rp-filters'); if (f && open) f.open = true }
        view.querySelectorAll('[data-rp]').forEach(b => b.onclick = () => { const k = b.dataset.rp, v = b.dataset.v; go({ [k]: s[k].includes(v) ? s[k].filter(x => x !== v) : [...s[k], v] }) })
        const w = view.querySelector('[data-rp-w]'); if (w) w.onchange = () => go({ w: w.value })
        const a = view.querySelector('[data-rp-a]'); if (a) a.onchange = () => go({ a: a.value })
        const i = view.querySelector('[data-rp-i]'); if (i) { let t; i.oninput = () => { clearTimeout(t); t = setTimeout(() => { go({ i: i.value }); const n = view.querySelector('[data-rp-i]'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length) } }, 300) } }
        view.querySelectorAll('circle.rp-e').forEach(c => c.onclick = () => go({ sel: c.dataset.h === s.sel ? '' : c.dataset.h }))
        // playback: dots after the playhead fade; the pointer walks the sorted dots so each frame touches only what changed
        const dots = [...view.querySelectorAll('.rp-e')].sort((p, q) => +p.dataset.t - +q.dataset.t)
        const head = view.querySelector('.rp-head'), now = view.querySelector('[data-rp-now]'), scrub = view.querySelector('[data-rp-scrub]'), btn = view.querySelector('[data-rp-play]'), speed = view.querySelector('[data-rp-speed]')
        const R = ctx.D.replay
        let shown = dots.length
        function seek(t) {
            t = Math.max(start, Math.min(end, t))
            while (shown > 0 && +dots[shown - 1].dataset.t > t) dots[--shown].classList.add('fut')
            while (shown < dots.length && +dots[shown].dataset.t <= t) dots[shown++].classList.remove('fut')
            if (head) { head.setAttribute('x1', x(t)); head.setAttribute('x2', x(t)) }
            if (now) now.textContent = `${dayLabel(at(R, t))} ${hhmm(at(R, t))} UTC`
            if (scrub && +scrub.value !== Math.round(t)) scrub.value = Math.round(t)
            return t
        }
        const stop = () => { if (play) cancelAnimationFrame(play.raf); play = null; if (btn) { btn.textContent = '▶ Play'; btn.setAttribute('aria-pressed', 'false') } }
        if (scrub) scrub.oninput = () => { stop(); seek(+scrub.value) }
        const j = view.querySelector('[data-rp-jump]'); if (j) j.onchange = () => { if (j.value) { stop(); seek(+j.value) } }
        if (btn) btn.onclick = () => {
            if (play) return stop()
            let t = +scrub.value >= end ? seek(start) : +scrub.value
            play = { last: performance.now(), raf: 0 }; btn.textContent = '❚❚ Pause'; btn.setAttribute('aria-pressed', 'true')
            const tick = ts => { if (!play) return; const dt = (ts - play.last) / 1000; play.last = ts; t = seek(t + dt * +speed.value); if (t >= end) return stop(); play.raf = requestAnimationFrame(tick) }
            play.raf = requestAnimationFrame(tick)
        }
    }

    root.AngeloReplay = { render, parse }
})(typeof self !== 'undefined' ? self : this)
