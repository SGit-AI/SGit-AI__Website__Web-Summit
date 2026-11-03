// "Who are you?" (Dinis, 3 November 2026): the visitor picks a person, kept in this browser only (localStorage, key
// "ws.me"; the vault comes later), and every page shows a "For you" panel built from /me.json: their issues, the
// decisions waiting on them, their agents, what changed since they last looked, and a 10-day picture of their agents'
// work. Everything in me.json is already public on the site; choosing a person is a view, not a sign-in.
// Elements with data-for="id id" are marked .is-me for the chosen person. Built by conductor@web-summit.dinis;
// the panels' content is kept with dashboard@web-summit.dinis, the look with designer@web-summit.dinis.
(() => {
    'use strict'
    const KEY = 'ws.me', up = document.body.dataset.up || '', section = document.body.dataset.section || 'other'
    const get = () => { try { return localStorage.getItem(KEY) || '' } catch { return '' } }
    const set = v => { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY) } catch { /* private mode */ } }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const ago = d => { if (!d) return 'never'; const m = Math.round((Date.now() - new Date(d)) / 6e4); return m < 60 ? `${Math.max(1, m)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }
    const ini = n => n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const pick = document.getElementById('me-pick'), panel = document.getElementById('for-you')
    if (!pick) return

    const KR = window.WSKeyring, krReady = KR ? KR.ready.catch(() => null) : Promise.resolve(null)
    Promise.all([fetch(up + 'me.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : Promise.reject(r.status)), krReady]).then(([ME]) => {
        const people = Object.values(ME.people)
        const draw = () => {
            const me = ME.people[get()]
            pick.innerHTML = `<label for="me-sel">${me ? `<span class="av" style="--c:${esc(me.colour)}">${esc(ini(me.name))}</span>` : ''}<span class="sr">View the site as</span></label><select id="me-sel" title="Who are you? The site shows what matters to that person (kept in this browser only)"><option value="">${me ? 'Everyone' : 'Who are you?'}</option>${people.map(p => `<option value="${esc(p.id)}"${me && me.id === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select>`
            pick.querySelector('select').onchange = e => { set(e.target.value); draw() }
            document.documentElement.dataset.me = me ? me.id : ''
            document.querySelectorAll('[data-for]').forEach(el => el.classList.toggle('is-me', !!me && el.dataset.for.split(/\s+/).includes(me.id)))
            if (!panel) return
            if (!me) { panel.hidden = true; panel.innerHTML = ''; return }
            panel.hidden = false; panel.style.setProperty('--c', me.colour || '')
            panel.innerHTML = render(me, ME)
            const x = panel.querySelector('[data-me-clear]'); if (x) x.onclick = () => { set(''); draw() }
            if (KR && KR.person === me.id) unlocked(me)
        }
        draw()
        window.addEventListener('storage', e => { if (e.key === KEY) draw() })
    }).catch(() => { pick.hidden = true })

    // a 10-day bar chart of the person's agents' commits (CI's releases left out), drawn inline
    function spark(p) {
        const max = Math.max(1, ...p.daily), w = 8, gap = 3, h = 34
        const bars = p.daily.map((n, i) => `<rect x="${i * (w + gap)}" y="${h - Math.max(n ? 3 : 1, Math.round(n / max * h))}" width="${w}" height="${Math.max(n ? 3 : 1, Math.round(n / max * h))}" rx="2"${i === p.daily.length - 1 ? ' class="today"' : ''}><title>${esc(p.days[i])}: ${n} commits</title></rect>`).join('')
        const total = p.daily.reduce((a, b) => a + b, 0)
        return `<figure class="fy-spark"><svg viewBox="0 0 ${p.daily.length * (w + gap) - gap} ${h}" role="img" aria-label="${total} commits by ${esc(p.first)}'s agents in 14 days">${bars}</svg><figcaption>${total} commits by your agents, ${p.daily.length} days</figcaption></figure>`
    }
    function ring(p) {   // the onboarding level, L0 to L6, as a ring
        const r = 15, c = 2 * Math.PI * r, f = p.level / 6
        return `<a class="fy-ring" href="${up}team/setup/index.html" title="${esc(p.level_name)}"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="${r}" class="bg"/><circle cx="20" cy="20" r="${r}" class="fg" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 20 20)"/></svg><b>L${p.level}</b></a>`
    }
    const issue = i => `<li><a href="${up}briefs/index.html#issues"><code>${esc(i.id)}</code> ${esc(i.title)}</a> <span class="${i.late ? 'late' : 'due'}">${esc(i.due || '')}${i.late ? ', late' : ''}</span></li>`
    const agent = a => `<li><span class="dot ${esc(a.status)}" aria-hidden="true"></span><b>${esc(a.name.split('@')[0])}</b> <span class="muted">${esc(a.status)}${a.last_at ? ', ' + esc(ago(a.last_at)) : ''}</span>${a.last ? `<br><span class="muted">${esc(a.last)}</span>` : ''}</li>`

    // the person's own key is in this browser (assets/keyring.js): open what is sealed to them on the site
    async function unlocked(p) {
        const box = document.createElement('div'); box.className = 'fy-unlocked'
        box.innerHTML = `<h2>Unlocked: only your key opens this</h2><p class="muted">Key ${esc(KR.fingerprint)}, issued to ${esc(p.first)} for this session. <button type="button" data-lock>Remove the key from this browser</button></p><div class="fy-sealed muted">Opening…</div>`
        panel.appendChild(box)
        box.querySelector('[data-lock]').onclick = async () => { await KR.lock(); box.remove() }
        const out = [], files = p.sealed || []
        for (const f of files) {
            try { const env = await (await fetch(up + f, { cache: 'no-cache' })).json(); if (env.key !== KR.fingerprint) continue; out.push({ f, by: env.by, at: env.at, m: await KR.open(env) }) }
            catch (e) { out.push({ f, err: String(e.message || e) }) }
        }
        const show = x => x.err ? `<li class="muted">${esc(x.f)}: could not open (${esc(x.err)})</li>`
            : `<li><b>${esc(x.m.title || x.f.split('/').pop())}</b> <span class="muted">from ${esc(x.by || 'unknown')}, ${esc(ago(x.at))}</span>${x.m.text ? `<br>${esc(x.m.text)}` : ''}${x.m.fields ? `<dl>${Object.entries(x.m.fields).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}</li>`
        box.querySelector('.fy-sealed').outerHTML = out.length ? `<ul class="fy-list">${out.map(show).join('')}</ul>` : '<p class="muted">Nothing sealed to you yet.</p>'
    }

    function render(p, ME) {
        const tiles = [[p.overdue, 'overdue', p.overdue ? 'warn' : ''], [p.soon, 'due in 72 h', ''], [p.decisions.length, 'decisions waiting', p.decisions.length ? 'warn' : ''], [p.since.releases, p.acked ? `releases since you said "seen it" (${ago(p.acked)})` : 'releases in 24 h (tell your agent "acknowledge")', '']]
        // what this section shows first, for this person
        const blocks = {
            home: [['Most urgent for you', p.urgent.length ? `<ul class="fy-list">${p.urgent.slice(0, 3).map(issue).join('')}</ul>` : '<p class="muted">Nothing open is named for you.</p>'], ['Decisions waiting on you', p.decisions.length ? `<ul class="fy-list">${p.decisions.slice(0, 3).map(d => `<li><a href="${up}${esc(d.source)}">${esc(d.what)}</a></li>`).join('')}</ul>` : '<p class="muted">None.</p>']],
            work: [['Your issues, most urgent first', p.urgent.length ? `<ul class="fy-list">${p.urgent.map(issue).join('')}</ul>` : '<p class="muted">Nothing open is named for you.</p>'], ['Messages for you (48 h)', p.messages.length ? `<ul class="fy-list">${p.messages.map(m => `<li>${esc(m.subject)} <span class="muted">${esc(m.from)}, ${esc(ago(m.at))}</span></li>`).join('')}</ul>` : '<p class="muted">No commit addressed to you or your agents.</p>']],
            team: [['Your agents', `<ul class="fy-list">${p.agents.map(agent).join('')}</ul>`], ['Your setup', p.next ? `<p>Next: <b>${esc(p.next.step)}</b>: ${esc(p.next.how)}. <a href="${up}start/index.html#steps">How</a></p>` : '<p>All steps done.</p>']],
            start: [['Your next step', p.next ? `<p><b>${esc(p.next.step)}</b>: ${esc(p.next.how)}. <a href="${up}start/index.html#steps">How</a></p>` : '<p>All steps done: you are fully wired.</p>'], ['Your agents', `<ul class="fy-list">${p.agents.slice(0, 4).map(agent).join('')}</ul>`]],
            summit: [['Before the next stand-up', `<p><a href="${up}${esc(p.briefing)}">Your briefing for ${esc(p.standup)} UTC</a></p>`], ['Decisions waiting on you', p.decisions.length ? `<ul class="fy-list">${p.decisions.slice(0, 3).map(d => `<li><a href="${up}${esc(d.source)}">${esc(d.what)}</a></li>`).join('')}</ul>` : '<p class="muted">None.</p>']],
        }
        const b = blocks[section] || blocks.home
        return `<header><span class="av" style="--c:${esc(p.colour)}">${esc(ini(p.name))}</span><div><b>For you, ${esc(p.first)}</b><span class="muted">${esc(p.level_name)} · ${p.open} open issues · data ${esc(ME.version)}, ${esc(ago(ME.built_at))}</span></div>
<nav class="fy-go"><a href="${up}${esc(p.links.centre)}">Command centre</a><a href="${up}${esc(p.links.dashboard)}">Dashboard</a><a href="${up}${esc(p.briefing)}">Stand-up briefing</a><button type="button" data-me-clear>Not ${esc(p.first)}?</button></nav></header>
<div class="fy-body">${ring(p)}<div class="fy-tiles">${tiles.map(([n, l, t]) => `<div class="${t}"><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div>${spark(p)}</div>
<div class="fy-cols">${b.map(([h, x]) => `<div><h2>${esc(h)}</h2>${x}</div>`).join('')}</div>`
    }
})()
