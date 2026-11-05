// The cockpit: a person's first dashboard (Dinis, 5 November 2026), drawn from people/<id>/dashboard.json, which the
// build writes at every release (admin/build/cockpit.mjs). On the left: what only you can do, then the decisions,
// ranked, then what is happening. On the right: YOUR ACTIONS, one entry per click, kept in this browser (localStorage),
// in three layers: to send (amber), sent but not processed yet (blue), processed (green, or red if refused). Submit, at
// the top of that panel, sends every entry still to send as one message, signed with your key in this browser
// (assets/keyring.js), sealed to the dashboard agent's public key and appended to its vault lane (assets/feedback.json;
// the same envelope as the feedback pane), so the lane sees ciphertext only. The dashboard agent drains the lane,
// applies what you signed (admin/tools/cockpit_apply.mjs), and writes each entry's outcome, by its id, to
// people/<id>/cockpit-log.json; the next release carries it here as `processed`, and the entry turns green. Unsigned
// answers are never acted on. Written by dashboard@web-summit.dinis.
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
    const uid = () => Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)

    // the actions: [{uid, ref, title, issue, action, option, words, delegate..., at, state: 'draft'|'sent', sent_at}]
    let D = null, LANE = null, Q = LS.get('q', []), openEntry = LS.get('openEntry', ''), openCard = LS.get('open', {}), showAll = false, busy = false
    const save = () => { LS.set('q', Q); LS.set('openEntry', openEntry); LS.set('open', openCard) }
    const KR = () => window.WSKeyring
    const signer = () => KR() && KR().person
    const mine = () => signer() && D && signer() === D.person.id
    const P = () => Object.fromEntries((D.processed || []).map(p => [p.uid, p]))
    const layer = e => { const p = P()[e.uid]; return p ? (p.status === 'applied' ? 'done' : 'refused') : e.state === 'sent' ? 'sent' : 'draft' }
    const latest = ref => Q.filter(e => e.ref === ref).slice(-1)[0]

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

    // ---------- what an action says, in one line (also what the agent records) ----------
    const sentence = a => a.action === 'decide' ? `Decided: ${a.option || ''}${a.option && a.words ? '. ' : ''}${a.words || ''}`
        : a.action === 'delegate' ? `Delegated to ${a.delegate_name}${a.words ? ': ' + a.words : ''}`
        : a.action === 'done' ? `Done${a.words ? ': ' + a.words : ''}`
        : a.action === 'later' ? `Later${a.words ? ': ' + a.words : ''}`
        : a.action === 'drop' ? `No decision needed${a.words ? ': ' + a.words : ''}`
        : a.action === 'now' ? 'Do this first' : a.action
    const ICON = { decide: '✓', delegate: '→', done: '✓', later: '⏸', drop: '✕', now: '↑' }
    function add(ref, a) {
        // a second click on the same card before sending replaces that card's draft; once sent, a new entry is added
        const d = Q.findIndex(e => e.ref === ref && e.state === 'draft')
        const e = { ...a, ref, uid: d >= 0 ? Q[d].uid : uid(), at: new Date().toISOString(), state: 'draft' }
        if (d >= 0) Q[d] = e; else Q.push(e)
        openEntry = e.uid; save(); draw()
    }

    async function send() {
        const list = Q.filter(e => e.state === 'draft')
        if (!list.length || !LANE || !mine() || busy) return
        busy = true; draw()
        try {
            const items = list.map(a => ({ id: a.uid, at: a.at, kind: 'decision', choice: a.action, text: `${a.title}: ${sentence(a)}`, quote: '', images: [],
                page: { url: location.href.split('#')[0].split('?')[0], path: location.pathname, title: document.title }, cockpit: a }))
            const items_json = JSON.stringify(items), me = KR()
            const signed = { person: me.person, key: me.fingerprint, alg: 'ECDSA-P256-SHA256-P1363', sig: await me.sign(items_json) }
            await append(JSON.stringify({ type: 'web-summit.feedback/v1', to: LANE.agent, site: location.origin, sent_at: new Date().toISOString(), public: false, opened_at: new Date().toISOString(), hp: '', from: `${me.person} (signed with their key in this browser), from the cockpit`, signed, items_json, items }))
            const t = new Date().toISOString(); for (const e of list) { e.state = 'sent'; e.sent_at = t }
            save(); toast(`Sent ${list.length}, signed and sealed to ${LANE.agent}.`)
        } catch (e) { toast(`Not sent: ${e.message}. Your actions are still here.`) }
        busy = false; draw()
    }
    function toast(t) { const el = document.createElement('div'); el.className = 'ck-toast'; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 5000) }
    const nextDrain = () => { const d = new Date(); d.setUTCMinutes(6, 0, 0); if (d <= new Date()) d.setUTCHours(d.getUTCHours() + 1); if (d.getUTCHours() < 7) d.setUTCHours(7); if (d.getUTCHours() > 22) { d.setUTCDate(d.getUTCDate() + 1); d.setUTCHours(7) } return d }

    // ---------- the cards (left) ----------
    const delegateSel = ref => `<select data-dg="${esc(ref)}" aria-label="Delegate to"><option value="">Delegate to…</option>${D.delegates.map(p => `<option value="${esc(p.id)}">${esc(p.first)}</option>`).join('')}</select>`
    const badge = ref => { const e = latest(ref); if (!e) return ''; const l = layer(e); return `<button type="button" class="ck-badge ${l}" data-entry="${esc(e.uid)}">${l === 'draft' ? 'to send' : l === 'sent' ? 'sent, not processed' : l === 'done' ? 'processed' : 'refused'}: ${esc(sentence(e))}</button>` }
    const cardCls = ref => { const e = latest(ref); return e ? ' st-' + layer(e) : '' }

    const onlyCard = (x, i) => `<article class="ck-card only${cardCls(x.file)}" data-ref="${esc(x.file)}">
<div class="ck-h"><span class="ck-n">${i + 1}</span><div><h3>${esc(x.id)}: ${esc(x.title)}</h3><p class="ck-why">${esc(x.why)}${x.due ? ` · due ${esc(x.due)}` : ''}</p></div></div>
<p>${esc(x.action)}</p>${badge(x.file)}
<div class="ck-acts">${x.link ? `<a class="ck-btn go" href="${esc(x.link)}" target="_blank" rel="noopener">Do it now ↗</a>` : ''}<button type="button" class="ck-btn" data-act="done" data-ref="${esc(x.file)}">Done</button>${delegateSel(x.file)}<button type="button" class="ck-btn ghost" data-act="later" data-ref="${esc(x.file)}">Later</button><a class="ck-btn ghost" href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/${esc(x.file)}" title="the issue's file">${esc(x.id)}</a></div>
</article>`

    const decCard = (x, i) => {
        const isOpen = openCard[x.ref] ?? i < 3, rec = (x.recommend || '').toLowerCase()
        const opts = x.options.length ? x.options : (x.type === 'question' ? [] : ['Yes', 'No'])
        const e = latest(x.ref), pick = e && e.state === 'draft' ? e.option : ''
        return `<article class="ck-card dec${cardCls(x.ref)}" data-ref="${esc(x.ref)}">
<div class="ck-h"><span class="ck-n">${i + 1}</span><div><h3><button type="button" class="ck-tgl" data-tgl="${esc(x.ref)}" aria-expanded="${isOpen}">${esc(x.title)}</button></h3>
<p class="ck-why"><span class="ck-tag ${esc(x.type)}">${esc(x.type)}</span>${x.issue ? `<span class="ck-tag">${esc(x.issue)}</span>` : ''} ${esc(x.why)} · from ${esc(x.by)}${x.with.length ? ` · with ${esc(x.with.join(', '))}` : ''}</p></div></div>
${badge(x.ref)}
${isOpen ? `<div class="ck-body">${x.detail ? `<p class="ck-detail${x.detail.length > 320 ? ' clamp' : ''}" tabindex="0" title="click to read it all">${esc(x.detail)}</p>` : ''}
${x.recommend ? `<p class="ck-rec"><b>Recommended:</b> ${esc(x.recommend)}</p>` : ''}
${opts.length ? `<div class="ck-opts" role="group" aria-label="Options">${opts.map(o => `<button type="button" class="ck-opt${pick === o ? ' on' : ''}${rec && rec.includes(o.toLowerCase().slice(0, 24)) ? ' rec' : ''}" data-opt="${esc(o)}" data-ref="${esc(x.ref)}">${esc(o)}</button>`).join('')}</div>` : ''}
<textarea data-words="${esc(x.ref)}" rows="2" placeholder="In your words (optional; for a question, your answer)">${esc(e && e.state === 'draft' ? e.words || '' : '')}</textarea>
<div class="ck-acts"><button type="button" class="ck-btn go" data-act="decide" data-ref="${esc(x.ref)}">Decide</button>${delegateSel(x.ref)}<button type="button" class="ck-btn ghost" data-act="now" data-ref="${esc(x.ref)}">Do this first</button><button type="button" class="ck-btn ghost" data-act="later" data-ref="${esc(x.ref)}">Later</button><button type="button" class="ck-btn ghost" data-act="drop" data-ref="${esc(x.ref)}">No decision needed</button><a class="ck-btn ghost" href="../../meetings/${esc(x.first_meeting)}/index.html">on the agenda since ${esc(meetLabel(x.first_meeting))}</a></div></div>` : ''}
</article>`
    }
    const agentRow = a => `<li class="ck-ag"><span class="ck-dot ${dot(a.idle_h)}" title="${a.idle_h == null ? 'no commit in a week' : 'last commit ' + ago(a.last_at)}"></span><b title="${esc(a.name)}">${esc(a.short)}${a.person !== D.person.id ? `<i>.${esc(a.person)}</i>` : ''}</b><span class="ck-ago">${esc(a.last_at ? ago(a.last_at) : 'quiet')}</span><span class="ck-last" title="${esc(a.last)}">${esc(a.last || a.job)}</span></li>`

    // ---------- your actions (right) ----------
    const entry = e => {
        const l = layer(e), p = P()[e.uid], o = openEntry === e.uid
        return `<li class="ck-e ${l}${o ? ' open' : ''}"><button type="button" class="ck-e-h" data-entry="${esc(e.uid)}" aria-expanded="${o}"><span class="ck-e-i">${ICON[e.action] || '•'}</span><span class="ck-e-t"><b>${esc(sentence(e).split(':')[0])}</b> ${esc(e.title)}</span><span class="ck-e-w">${esc(ago(l === 'draft' ? e.at : l === 'sent' ? e.sent_at : p.applied_at))}</span></button>
${o ? `<div class="ck-e-d"><dl>
<dt>What</dt><dd>${esc(sentence(e))}</dd>
<dt>On</dt><dd>${esc(e.title)}${e.issue ? ` (${esc(e.issue)})` : ''}</dd>
${e.delegate_name ? `<dt>To</dt><dd>${esc(e.delegate_name)} and <code>${esc(e.delegate_agent)}</code></dd>` : ''}
<dt>Clicked</dt><dd>${esc(hhmm(e.at))} UTC</dd>
${e.sent_at ? `<dt>Sent</dt><dd>${esc(hhmm(e.sent_at))} UTC, signed, to <code>${esc(D.lane.agent)}</code></dd>` : ''}
${l === 'sent' ? `<dt>Next</dt><dd>picked up at the next drain, ${esc(hhmm(nextDrain()))} UTC, then shown here after the release that follows</dd>` : ''}
${p ? `<dt>${l === 'done' ? 'Processed' : 'Refused'}</dt><dd>${esc(hhmm(p.applied_at))} UTC: ${esc(p.result)}${p.commit ? ` (<code>${esc(p.commit)}</code>)` : ''}</dd>` : ''}
<dt>Id</dt><dd><code>${esc(e.uid)}</code></dd></dl>
<div class="ck-acts">${l === 'draft' ? `<button type="button" class="ck-btn ghost" data-del="${esc(e.uid)}">Remove</button>` : ''}${l === 'done' || l === 'refused' ? `<button type="button" class="ck-btn ghost" data-del="${esc(e.uid)}">Clear</button>` : ''}<button type="button" class="ck-btn ghost" data-goto="${esc(e.ref)}">Show the card</button></div></div>` : ''}</li>`
    }
    function panel() {
        const by = { draft: [], sent: [], done: [], refused: [] }; for (const e of Q) by[layer(e)].push(e)
        const n = by.draft.length, canAct = mine()
        const group = (k, t, sub) => by[k].length ? `<h3 class="ck-g ${k}">${t} <span>${by[k].length}</span></h3>${sub ? `<p class="ck-sub">${sub}</p>` : ''}<ul class="ck-es">${by[k].slice().reverse().map(entry).join('')}</ul>` : ''
        return `<div class="ck-panel" aria-label="Your actions">
<div class="ck-p-top"><h2>Your actions</h2>
<button type="button" class="ck-btn go big" data-send${n && canAct && LANE && !busy ? '' : ' disabled'}>${busy ? 'Sending…' : n ? `Submit ${n} signed` : 'Nothing to submit'}</button>
<p class="ck-sub">${canAct ? `To <code>${esc(D.lane.agent)}</code>, signed with your key and sealed to its key. It is processed ${esc(D.lane.drained)}.` : signer() ? `Signed in as <b>${esc(signer())}</b>: only ${esc(D.person.first)}'s signed actions are acted on.` : `<b>Add your key to this browser to submit</b> (<a href="../../start/index.html">the start page</a>). Your actions are kept here meanwhile.`}</p></div>
<div class="ck-p-list">${Q.length ? group('draft', 'To send', 'Kept in this browser until you submit. Click one for the details.') + group('sent', 'Sent, not processed yet', 'Waiting for the dashboard agent to record them.') + group('refused', 'Refused', 'Not applied: see why, and send again.') + group('done', 'Processed', 'Recorded on the site. Clear them when you have seen them.') : '<p class="ck-empty">Nothing yet. Every click on a card (Decide, Delegate, Done, Later...) adds an entry here; you can check them, then submit them together.</p>'}
${by.done.length + by.refused.length ? `<button type="button" class="ck-btn ghost wide" data-clear>Clear the processed</button>` : ''}</div>
</div>`
    }

    function draw() {
        const H = D.health, today = new Date().toISOString().slice(0, 10), ms = D.milestones.filter(m => m.at >= today).slice(0, 4)
        const decs = showAll ? D.decisions : D.decisions.slice(0, 7)
        const sx = root.querySelector('.ck-p-list') ? root.querySelector('.ck-p-list').scrollTop : 0
        root.innerHTML = `<header class="ck-top">
<div><p class="ck-kick">${esc(new Date().toUTCString().slice(0, 22))} UTC · ${esc(D.version)}</p><h1>${greet()}, ${esc(D.person.first)}.</h1>
<p class="ck-sum"><b>${D.only_you.length}</b> only you can do · <b>${D.decisions.length}</b> decisions waiting · <b>${H.board.late}</b> issues overdue · next stand-up <a href="${esc(D.standup.briefing)}">${esc(until(D.standup.at))}</a> (${esc(hhmm(D.standup.at))} UTC)</p></div>
<nav class="ck-links">${D.links.map(([t, h]) => `<a href="${esc(h)}">${esc(t)}</a>`).join('')}</nav>
</header>
<div class="ck-grid">
<div class="ck-main">
<section id="only-you" class="ck-sec"><h2>Only you can do this <span>${D.only_you.length}</span></h2><p class="ck-sub">Ranked by who is blocked, then how late. One click each.</p>
${D.only_you.length ? D.only_you.map(onlyCard).join('') : '<p class="ck-empty">Nothing waits on you alone.</p>'}</section>
<section id="decide" class="ck-sec"><h2>Decide <span>${D.decisions.length}</span></h2><p class="ck-sub">Ranked by: blocks someone, overdue, urgent, waiting longest. Choose an option (★ is the recommendation), add your words, then <b>Decide</b>, or <b>Delegate</b> it to someone who can.</p>
${decs.map(decCard).join('')}
${D.decisions.length > 7 ? `<button type="button" class="ck-btn ghost wide" data-all>${showAll ? 'Show the top seven' : `Show all ${D.decisions.length}`}</button>` : ''}</section>
<section id="happening" class="ck-sec"><h2>What is happening</h2><div class="ck-info">
<div class="ck-box"><h3>Today and next</h3><ul class="ck-ms"><li><b>${esc(hhmm(D.standup.at))}</b> <a href="${esc(D.standup.briefing)}">stand-up, your briefing</a></li>${ms.map(m => `<li><b>${esc(new Date(m.at + 'T12:00:00Z').toUTCString().slice(0, 11))}</b> <a href="${esc(m.link)}">${esc(m.what)}</a></li>`).join('')}</ul></div>
<div class="ck-box" id="health"><h3>The machine</h3><div class="ck-tiles">
<a href="../../admin/versions.html"><b>${H.releases_today}</b><span>releases today</span></a><a href="../../wakes/index.html"><b>${H.commits_today}</b><span>commits today</span></a>
<a href="../../board-health/index.html"><b>${H.board.open}</b><span>issues open</span></a><a href="../../board-health/index.html" class="${H.board.late ? 'bad' : ''}"><b>${H.board.late}</b><span>overdue</span></a>
<a href="../../board-health/index.html"><b>${H.board.unowned}</b><span>unowned</span></a><a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/security/reviews"><b>${esc(H.security_review ? meetLabel(H.security_review) : '–')}</b><span>last security review</span></a></div>
<p class="ck-sub">Last release ${esc(ago(H.last_release))}. Since you last acknowledged: ${H.since.releases} releases, ${H.since.commits} commits.</p></div>
<div class="ck-box" id="agents"><h3>Your agents <span>${D.agents.mine.filter(a => a.idle_h != null && a.idle_h < 24).length}/${D.agents.mine.length} active</span></h3><ul class="ck-ags">${D.agents.mine.map(agentRow).join('')}</ul></div>
<div class="ck-box"><h3>The team's agents <span>${D.agents.team_active_24h}/${D.agents.team_total} in 24 h</span></h3><ul class="ck-ags">${D.agents.team.map(agentRow).join('')}</ul><p class="ck-sub"><a href="../../wakes/index.html">all of them at work</a> · <a href="../../team/map/index.html">the map</a></p></div>
<div class="ck-box"><h3>Setup</h3><p class="ck-setup">${D.setup.map(p => `<span class="lv l${p.level}" title="L${p.level}">${esc(p.first)} <b>L${p.level}</b></span>`).join('')}</p></div>
<div class="ck-box ck-how"><h3>Where your actions go</h3><ol>
<li>Each click adds an entry on the right, kept in this browser, until you press <b>Submit</b>.</li>
<li>Submit sends them as one message, <b>signed with your key</b>, <b>sealed to ${esc(D.lane.agent)}'s key</b>, on its vault lane: the lane stores ciphertext only.</li>
<li><b>${esc(D.lane.agent)}</b> drains it ${esc(D.lane.drained)}, records each action in your words, sets delegates on the board and tells them with a commit <code>For:</code>, and writes each outcome to <code>people/${esc(D.person.id)}/cockpit-log.json</code>.</li>
<li>The next release brings the outcome here: the entry turns green, and the card leaves the page. Anything unsigned is never acted on.</li></ol></div>
</div></section>
</div>
<aside class="ck-side">${panel()}</aside>
</div>`
        const pn = root.querySelector('.ck-p-list'); if (pn) pn.scrollTop = sx
        wire()
    }

    const find = ref => D.only_you.find(x => x.file === ref) || D.decisions.find(x => x.ref === ref) || (Q.find(e => e.ref === ref) || {})
    const words = ref => { const t = root.querySelector(`textarea[data-words="${CSS.escape(ref)}"]`); return t ? t.value.trim() : '' }
    function wire() {
        root.querySelectorAll('[data-tgl]').forEach(b => b.onclick = () => { const r = b.dataset.tgl; openCard[r] = b.getAttribute('aria-expanded') !== 'true'; save(); draw() })
        root.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => { const r = b.dataset.ref, x = find(r); add(r, { action: 'decide', title: x.title, issue: x.issue || x.id || '', option: b.dataset.opt, words: words(r) }) })
        root.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
            const r = b.dataset.ref, x = find(r), a = b.dataset.act, w = words(r), cur = latest(r)
            const option = a === 'decide' && cur && cur.state === 'draft' ? cur.option || '' : ''
            if (a === 'decide' && !option && !w) { toast('Choose an option or write your answer first.'); return }
            add(r, { action: a, title: x.title, issue: x.issue || x.id || '', option, words: w })
        })
        root.querySelectorAll('[data-dg]').forEach(s => s.onchange = () => { const r = s.dataset.dg, x = find(r), p = D.delegates.find(d => d.id === s.value); if (p) add(r, { action: 'delegate', title: x.title, issue: x.issue || x.id || '', delegate: p.id, delegate_name: p.first, delegate_agent: p.agent, words: words(r) }) })
        root.querySelectorAll('textarea[data-words]').forEach(t => t.oninput = () => { const e = latest(t.dataset.words); if (e && e.state === 'draft') { e.words = t.value.trim(); save() } })
        root.querySelectorAll('[data-entry]').forEach(b => b.onclick = () => { openEntry = openEntry === b.dataset.entry ? '' : b.dataset.entry; save(); draw() })
        root.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { Q = Q.filter(e => e.uid !== b.dataset.del); save(); draw() })
        root.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => { const c = root.querySelector(`.ck-card[data-ref="${CSS.escape(b.dataset.goto)}"]`); if (c) { c.scrollIntoView({ behavior: 'smooth', block: 'center' }); c.classList.add('flash'); setTimeout(() => c.classList.remove('flash'), 1500) } else toast('That card is no longer on the page: it was recorded.') })
        root.querySelectorAll('.ck-detail.clamp').forEach(p => p.onclick = () => p.classList.toggle('full'))
        const cl = root.querySelector('[data-clear]'); if (cl) cl.onclick = () => { Q = Q.filter(e => ['draft', 'sent'].includes(layer(e))); save(); draw() }
        const all = root.querySelector('[data-all]'); if (all) all.onclick = () => { showAll = !showAll; draw() }
        const s = root.querySelector('[data-send]'); if (s) s.onclick = send
    }

    Promise.all([fetch(root.dataset.src, { cache: 'no-cache' }).then(r => r.json()), fetch(root.dataset.lanes, { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null), KR() ? KR().ready.catch(() => null) : null])
        .then(([d, lanes]) => {
            D = d; LANE = lanes && (lanes.lanes || []).find(l => l.agent === D.lane.agent) || null
            // the first version kept one answer per card ('out', 'sent'): carry any over as entries
            const old = LS.get('out', null); if (old) { for (const a of Object.values(old)) Q.push({ ...a, uid: uid(), state: 'draft' }); try { localStorage.removeItem('ck.out'); localStorage.removeItem('ck.sent') } catch { } }
            // processed entries older than a week leave on their own
            const P0 = P(), wk = Date.now() - 7 * 864e5; Q = Q.filter(e => !P0[e.uid] || Date.parse(P0[e.uid].applied_at) > wk); save()
            document.documentElement.classList.add('ck-on'); draw()
        })
        .catch(e => { root.innerHTML = `<p class="ck-note">The cockpit could not load (${esc(e.message)}); the same data is below as text.</p>` })
})()
