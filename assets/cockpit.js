// The cockpit: a person's first dashboard (Dinis, 5 November 2026), drawn from people/<id>/dashboard.json, which the
// build writes at every release (admin/build/cockpit.mjs). Top: what only you can do, then the decisions, ranked, each
// with its options, the recommendation, your own words, and delegate to someone. Your answers wait in this browser
// (the outbox) until you send them: one message, signed with your key in this browser (assets/keyring.js), sealed to
// the dashboard agent's public key and appended to its vault lane (assets/feedback.json, the same envelope as the
// feedback pane), so the lane sees ciphertext only. The dashboard agent drains the lane, records each decision in your
// words (data/meetings/, admin/tools/agenda.mjs decide), tells whoever it concerns with a commit For:, and the card goes
// at the next release. Unsigned answers are never acted on. Written by dashboard@web-summit.dinis.
(() => {
    'use strict'
    const root = document.getElementById('ck')
    if (!root) return
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const LS = { get(k, d) { try { const v = localStorage.getItem('ck.' + k); return v === null ? d : JSON.parse(v) } catch { return d } }, set(k, v) { try { localStorage.setItem('ck.' + k, JSON.stringify(v)) } catch { } } }
    const ago = t => { if (!t) return 'never'; const m = Math.round((Date.now() - new Date(t)) / 6e4); return m < 60 ? `${Math.max(1, m)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }
    const hhmm = t => new Date(t).toISOString().slice(11, 16)
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const meetLabel = id => { const m = String(id || '').match(/^\d{4}-(\d\d)-(\d\d)-(\d\d)(\d\d)/); return m ? `${+m[2]} ${MON[+m[1] - 1]} ${m[3]}:${m[4]}` : id }
    const until = t => { const m = Math.round((new Date(t) - Date.now()) / 6e4); return m <= 0 ? 'now' : m < 60 ? `in ${m} min` : `in ${Math.floor(m / 60)} h ${m % 60} min` }
    const dot = h => h == null ? 'off' : h < 6 ? 'ok' : h < 24 ? 'warn' : 'bad'
    const greet = () => { const h = new Date().getHours(); return h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 18 ? 'Good afternoon' : h >= 18 && h < 23 ? 'Good evening' : 'Working late' }
    let D = null, LANE = null, out = LS.get('out', {}), sent = LS.get('sent', {}), open = LS.get('open', {}), showAll = false
    const save = () => { LS.set('out', out); LS.set('sent', sent); LS.set('open', open) }
    const KR = () => window.WSKeyring
    const signer = () => KR() && KR().person
    const mine = () => signer() && D && signer() === D.person.id

    // ---------- sealing and the lane: the same envelope as assets/feedback.js (sgit's hybrid v2) ----------
    const b64 = bytes => { let s = ''; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b); return btoa(s) }
    const unpem = pem => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
    async function seal(pem, text) {
        const S = crypto.subtle
        const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
        const aes = await S.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const c = await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
        const w = await S.encrypt({ name: 'RSA-OAEP' }, pub, await S.exportKey('raw', aes))
        return btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) }))
    }
    async function append(text) {
        const r = await fetch(`${LANE.host}/api/vault/append/write/${LANE.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: LANE.append_token, payload: btoa(await seal(LANE.recipient.encrypt, text)) }) })
        if (!r.ok) throw new Error(r.status === 507 ? 'the lane is full: the agent has not drained it' : `the lane said ${r.status}`)
    }

    // ---------- what an answer says, in one line (also what the agent records) ----------
    const sentence = a => a.action === 'decide' ? `Decided: ${a.option || ''}${a.option && a.words ? '. ' : ''}${a.words || ''}`
        : a.action === 'delegate' ? `Delegated to ${a.delegate_name}${a.words ? ': ' + a.words : ''}`
        : a.action === 'done' ? `Done${a.words ? ': ' + a.words : ''}`
        : a.action === 'later' ? `Not now: move it after the summit's first push${a.words ? '. ' + a.words : ''}`
        : a.action === 'drop' ? `Drop it: no decision needed${a.words ? '. ' + a.words : ''}`
        : a.action === 'now' ? 'Do this first' : a.action
    const queue = (ref, a) => { out[ref] = { ...a, ref, at: new Date().toISOString() }; save(); draw() }

    async function send() {
        const list = Object.values(out)
        if (!list.length || !LANE || !mine()) return
        const btn = root.querySelector('[data-send]'); if (btn) { btn.disabled = true; btn.textContent = 'Sending…' }
        try {
            const items = list.map(a => ({ id: a.ref.replace(/[^a-z0-9]+/gi, '-').slice(-40) + '-' + Date.now().toString(36), at: a.at, kind: 'decision', choice: a.action, text: `${a.title}: ${sentence(a)}`, quote: '', images: [],
                page: { url: location.href.split('#')[0].split('?')[0], path: location.pathname, title: document.title }, cockpit: a }))
            const items_json = JSON.stringify(items), me = KR()
            const signed = { person: me.person, key: me.fingerprint, alg: 'ECDSA-P256-SHA256-P1363', sig: await me.sign(items_json) }
            await append(JSON.stringify({ type: 'web-summit.feedback/v1', to: LANE.agent, site: location.origin, sent_at: new Date().toISOString(), public: false, opened_at: new Date().toISOString(), hp: '', from: `${me.person} (signed with their key in this browser), from the cockpit`, signed, items_json, items }))
            const t = new Date().toISOString(); for (const a of list) sent[a.ref] = { at: t, line: sentence(a) }
            out = {}; save(); toast(`Sent ${list.length}, signed and sealed to ${LANE.agent}.`)
        } catch (e) { toast(`Not sent: ${e.message}. Your answers are still here.`) }
        draw()
    }
    function toast(t) { const el = document.createElement('div'); el.className = 'ck-toast'; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 5000) }

    // ---------- drawing ----------
    const delegateSel = (ref) => `<select data-dg="${esc(ref)}" aria-label="Delegate to"><option value="">Delegate to…</option>${D.delegates.map(p => `<option value="${esc(p.id)}">${esc(p.first)}</option>`).join('')}</select>`
    const state = ref => out[ref] ? `<p class="ck-state q">Ready to send: <b>${esc(sentence(out[ref]))}</b> <button type="button" class="lnk" data-undo="${esc(ref)}">undo</button></p>`
        : sent[ref] ? `<p class="ck-state s">Sent ${esc(hhmm(sent[ref].at))} UTC: ${esc(sent[ref].line)}. Waiting for ${esc(D.lane.agent)} to record it (${esc(D.lane.drained)}).</p>` : ''

    const onlyCard = (x, i) => `<article class="ck-card only${out[x.file] ? ' queued' : ''}${sent[x.file] ? ' sent' : ''}" data-ref="${esc(x.file)}">
<div class="ck-h"><span class="ck-n">${i + 1}</span><div><h3>${esc(x.id)}: ${esc(x.title)}</h3><p class="ck-why">${esc(x.why)}${x.due ? ` · due ${esc(x.due)}` : ''}</p></div></div>
<p>${esc(x.action)}</p>
${state(x.file)}
<div class="ck-acts">${x.link ? `<a class="ck-btn go" href="${esc(x.link)}" target="_blank" rel="noopener">Do it now ↗</a>` : ''}<button type="button" class="ck-btn" data-act="done" data-ref="${esc(x.file)}">Done</button>${delegateSel(x.file)}<button type="button" class="ck-btn ghost" data-act="later" data-ref="${esc(x.file)}">Later</button><a class="ck-btn ghost" href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/${esc(x.file)}" title="the issue's file">${esc(x.id)}</a></div>
</article>`

    const decCard = (x, i) => {
        const isOpen = open[x.ref] ?? i < 3, rec = (x.recommend || '').toLowerCase()
        const opts = x.options.length ? x.options : (x.type === 'question' ? [] : ['Yes', 'No'])
        const pick = (out[x.ref] && out[x.ref].option) || ''
        return `<article class="ck-card dec${out[x.ref] ? ' queued' : ''}${sent[x.ref] ? ' sent' : ''}" data-ref="${esc(x.ref)}">
<div class="ck-h"><span class="ck-n">${i + 1}</span><div><h3><button type="button" class="ck-tgl" data-tgl="${esc(x.ref)}" aria-expanded="${isOpen}">${esc(x.title)}</button></h3>
<p class="ck-why"><span class="ck-tag ${esc(x.type)}">${esc(x.type)}</span>${x.issue ? `<span class="ck-tag">${esc(x.issue)}</span>` : ''} ${esc(x.why)} · from ${esc(x.by)}${x.with.length ? ` · with ${esc(x.with.join(', '))}` : ''}</p></div></div>
${state(x.ref)}
${isOpen ? `<div class="ck-body">${x.detail ? `<p class="ck-detail${x.detail.length > 320 ? ' clamp' : ''}" tabindex="0" title="click to read it all">${esc(x.detail)}</p>` : ''}
${x.recommend ? `<p class="ck-rec"><b>Recommended:</b> ${esc(x.recommend)}</p>` : ''}
${opts.length ? `<div class="ck-opts" role="group" aria-label="Options">${opts.map(o => `<button type="button" class="ck-opt${pick === o ? ' on' : ''}${rec && rec.includes(o.toLowerCase().slice(0, 24)) ? ' rec' : ''}" data-opt="${esc(o)}" data-ref="${esc(x.ref)}">${esc(o)}</button>`).join('')}</div>` : ''}
<textarea data-words="${esc(x.ref)}" rows="2" placeholder="In your words (optional; for a question, your answer)">${esc((out[x.ref] && out[x.ref].words) || '')}</textarea>
<div class="ck-acts"><button type="button" class="ck-btn go" data-act="decide" data-ref="${esc(x.ref)}">Decide</button>${delegateSel(x.ref)}<button type="button" class="ck-btn ghost" data-act="now" data-ref="${esc(x.ref)}">Do this first</button><button type="button" class="ck-btn ghost" data-act="later" data-ref="${esc(x.ref)}">Later</button><button type="button" class="ck-btn ghost" data-act="drop" data-ref="${esc(x.ref)}">No decision needed</button><a class="ck-btn ghost" href="../../meetings/${esc(x.first_meeting)}/index.html">on the agenda since ${esc(meetLabel(x.first_meeting))}</a></div></div>` : ''}
</article>`
    }

    const agentRow = a => `<li class="ck-ag"><span class="ck-dot ${dot(a.idle_h)}" title="${a.idle_h == null ? 'no commit in a week' : 'last commit ' + ago(a.last_at)}"></span><b title="${esc(a.name)}">${esc(a.short)}${a.person !== D.person.id ? `<i>.${esc(a.person)}</i>` : ''}</b><span class="ck-ago">${esc(a.last_at ? ago(a.last_at) : 'quiet')}</span><span class="ck-last" title="${esc(a.last)}">${esc(a.last || a.job)}</span></li>`

    function draw() {
        const H = D.health, n = Object.keys(out).length, today = new Date().toISOString().slice(0, 10)
        const ms = D.milestones.filter(m => m.at >= today).slice(0, 4)
        const decs = showAll ? D.decisions : D.decisions.slice(0, 7)
        const canAct = mine()
        root.innerHTML = `<header class="ck-top">
<div><p class="ck-kick">${esc(new Date().toUTCString().slice(0, 22))} UTC · ${esc(D.version)}</p><h1>${greet()}, ${esc(D.person.first)}.</h1>
<p class="ck-sum"><b>${D.only_you.length}</b> only you can do · <b>${D.decisions.length}</b> decisions waiting · <b>${H.board.late}</b> issues overdue · next stand-up <a href="${esc(D.standup.briefing)}">${esc(until(D.standup.at))}</a> (${esc(hhmm(D.standup.at))} UTC)</p></div>
<nav class="ck-links">${D.links.map(([t, h]) => `<a href="${esc(h)}">${esc(t)}</a>`).join('')}</nav>
</header>
${canAct ? '' : `<p class="ck-note">${signer() ? `You are signed in as <b>${esc(signer())}</b>: this is ${esc(D.person.first)}'s cockpit, so you can read it, and only ${esc(D.person.first)}'s signed answers are acted on.` : `<b>To decide from here, add your key to this browser</b> (<a href="../../start/index.html">the start page</a>): every answer is signed with it, and nothing unsigned is acted on. You can still read everything.`}</p>`}
<div class="ck-grid">
<div class="ck-main">
<section id="only-you" class="ck-sec"><h2>Only you can do this <span>${D.only_you.length}</span></h2><p class="ck-sub">Ranked by who is blocked, then how late. One click each.</p>
${D.only_you.length ? D.only_you.map(onlyCard).join('') : '<p class="ck-empty">Nothing waits on you alone.</p>'}</section>
<section id="decide" class="ck-sec"><h2>Decide <span>${D.decisions.length}</span></h2><p class="ck-sub">Ranked by: blocks someone, overdue, urgent, waiting longest. Choose an option (★ is the recommendation), add your words, then <b>Decide</b>, or <b>Delegate</b> it to someone who can.</p>
${decs.map(decCard).join('')}
${D.decisions.length > 7 ? `<button type="button" class="ck-btn ghost wide" data-all>${showAll ? 'Show the top seven' : `Show all ${D.decisions.length}`}</button>` : ''}</section>
</div>
<aside class="ck-side">
<section class="ck-sec"><h2>Today and next</h2><ul class="ck-ms"><li><b>${esc(hhmm(D.standup.at))}</b> <a href="${esc(D.standup.briefing)}">stand-up, your briefing</a></li>${ms.map(m => `<li><b>${esc(new Date(m.at + 'T12:00:00Z').toUTCString().slice(0, 11))}</b> <a href="${esc(m.link)}">${esc(m.what)}</a></li>`).join('')}</ul></section>
<section class="ck-sec" id="agents"><h2>Your agents <span>${D.agents.mine.filter(a => a.idle_h != null && a.idle_h < 24).length}/${D.agents.mine.length} active</span></h2><ul class="ck-ags">${D.agents.mine.map(agentRow).join('')}</ul></section>
<section class="ck-sec"><h2>The team's agents <span>${D.agents.team_active_24h}/${D.agents.team_total} in 24 h</span></h2><ul class="ck-ags">${D.agents.team.map(agentRow).join('')}</ul><p class="ck-sub"><a href="../../wakes/index.html">all of them at work</a> · <a href="../../team/map/index.html">the map</a></p></section>
<section class="ck-sec" id="health"><h2>The machine</h2><div class="ck-tiles">
<a href="../../admin/versions.html"><b>${H.releases_today}</b><span>releases today</span></a><a href="../../wakes/index.html"><b>${H.commits_today}</b><span>commits today</span></a>
<a href="../../board-health/index.html"><b>${H.board.open}</b><span>issues open</span></a><a href="../../board-health/index.html" class="${H.board.late ? 'bad' : ''}"><b>${H.board.late}</b><span>overdue</span></a>
<a href="../../board-health/index.html"><b>${H.board.unowned}</b><span>unowned</span></a><a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/security/reviews"><b>${esc(H.security_review ? meetLabel(H.security_review) : '–')}</b><span>last security review</span></a></div>
<p class="ck-sub">Last release ${esc(ago(H.last_release))}. Since you last acknowledged: ${H.since.releases} releases, ${H.since.commits} commits.</p></section>
<section class="ck-sec"><h2>Setup</h2><p class="ck-setup">${D.setup.map(p => `<span class="lv l${p.level}" title="L${p.level}">${esc(p.first)} <b>L${p.level}</b></span>`).join('')}</p></section>
<section class="ck-sec ck-how"><h2>Where your answers go</h2><ol>
<li>They wait in this browser (the bar at the bottom) until you press <b>Send</b>.</li>
<li>Sent as one message, <b>signed with your key</b> in this browser, <b>sealed to ${esc(D.lane.agent)}'s key</b>, and appended to its vault lane: the lane stores ciphertext only.</li>
<li><b>${esc(D.lane.agent)}</b> drains it ${esc(D.lane.drained)}: it records each decision in your words on the agenda, sets the delegate on the board, and tells them and the conductor with a commit <code>For:</code>.</li>
<li>The card leaves this page at the next release. Anything unsigned is never acted on.</li></ol></section>
</aside></div>
<div class="ck-out${n ? ' on' : ''}" role="region" aria-label="Your answers, not sent yet"><span><b>${n}</b> answer${n === 1 ? '' : 's'} ready</span>${n ? `<span class="ck-out-list">${Object.values(out).map(a => esc(a.title.slice(0, 40)) + ': ' + esc(sentence(a).slice(0, 50))).join(' · ')}</span>` : ''}<button type="button" class="ck-btn go" data-send${n && canAct && LANE ? '' : ' disabled'}>Send signed to ${esc(D.lane.agent.split('@')[0])}@</button></div>`
        wire()
    }

    const find = ref => D.only_you.find(x => x.file === ref) || D.decisions.find(x => x.ref === ref)
    const words = ref => { const t = root.querySelector(`textarea[data-words="${CSS.escape(ref)}"]`); return t ? t.value.trim() : (out[ref] && out[ref].words) || '' }
    function wire() {
        root.querySelectorAll('[data-tgl]').forEach(b => b.onclick = () => { const r = b.dataset.tgl; open[r] = !(open[r] ?? b.getAttribute('aria-expanded') === 'true'); save(); draw() })
        root.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => { const r = b.dataset.ref, x = find(r); queue(r, { action: 'decide', title: x.title, issue: x.issue || x.id || '', option: b.dataset.opt, words: words(r) }) })
        root.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
            const r = b.dataset.ref, x = find(r), a = b.dataset.act, w = words(r), cur = out[r] || {}
            if (a === 'decide' && !cur.option && !w) { toast('Choose an option or write your answer first.'); return }
            queue(r, { action: a, title: x.title, issue: x.issue || x.id || '', option: a === 'decide' ? cur.option || '' : '', words: w })
        })
        root.querySelectorAll('[data-dg]').forEach(s => s.onchange = () => { const r = s.dataset.dg, x = find(r), p = D.delegates.find(d => d.id === s.value); if (p) queue(r, { action: 'delegate', title: x.title, issue: x.issue || x.id || '', delegate: p.id, delegate_name: p.first, delegate_agent: p.agent, words: words(r) }) })
        root.querySelectorAll('textarea[data-words]').forEach(t => t.oninput = () => { const r = t.dataset.words; if (out[r]) { out[r].words = t.value.trim(); save() } })
        root.querySelectorAll('[data-undo]').forEach(b => b.onclick = () => { delete out[b.dataset.undo]; save(); draw() })
        root.querySelectorAll('.ck-detail.clamp').forEach(p => p.onclick = () => p.classList.toggle('full'))
        const all = root.querySelector('[data-all]'); if (all) all.onclick = () => { showAll = !showAll; draw() }
        const s = root.querySelector('[data-send]'); if (s) s.onclick = send
    }

    Promise.all([fetch(root.dataset.src, { cache: 'no-cache' }).then(r => r.json()), fetch(root.dataset.lanes, { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null), KR() ? KR().ready.catch(() => null) : null])
        .then(([d, lanes]) => {
            D = d; LANE = lanes && (lanes.lanes || []).find(l => l.agent === D.lane.agent) || null
            // a sent answer whose card is gone has been recorded: forget it
            const live = new Set([...D.only_you.map(x => x.file), ...D.decisions.map(x => x.ref)]); for (const r of Object.keys(sent)) if (!live.has(r)) delete sent[r]; save()
            document.documentElement.classList.add('ck-on'); draw()
        })
        .catch(e => { root.innerHTML = `<p class="ck-note">The cockpit could not load (${esc(e.message)}); the same data is below as text.</p>` })
})()
