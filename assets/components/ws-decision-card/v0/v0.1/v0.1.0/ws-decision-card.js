/**
 * ws-decision-card — one card, drawn from its kind (data/cards/<kind>.json, a JSON module): the ask, how to think
 * about it, the evidence (the issue, the agenda, the commits, the people), the links you need (each saying where it
 * goes), the relationships as a small graph, the priority and what makes it, and the answers that fit this kind of
 * decision, each previewing its side effects before you choose.
 *
 * Set .card (an item of dashboard.json's only_you or decisions), .kind (its JSON module), .delegates, .person.
 * Fires 'ws-card:answer' { entry } on document when an answer is chosen.
 * Written by dashboard@web-summit.dinis, 5 November 2026, at Dinis's word.
 *
 * @module ws-decision-card
 * @version 0.1.0
 */
import { WsComponent } from '../../../../ws-shared/v0/v0.1/v0.1.0/ws-component.js'
import { esc, ago, linkTo, fill } from '../../../../ws-shared/v0/v0.1/v0.1.0/ws-shared.js'

const GRAPH_COLOURS = Object.freeze({ item: 'var(--accent)', person: 'var(--warm)', agent: 'var(--sent)', issue: 'var(--warn)', done: 'var(--ok)', meeting: 'var(--wait)' })

class WsDecisionCard extends WsComponent {
    static jsUrl = import.meta.url
    static template = `<article class="card" id="card" aria-live="polite"></article>`
    get resourceName() { return 'ws-decision-card' }

    set card(v)      { this._card = v; this._chosen = null; this._render() }
    get card()       { return this._card }
    set kind(v)      { this._kind = v; this._render() }
    set delegates(v) { this._delegates = v || []; this._render() }
    set person(v)    { this._person = v }

    onReady() { this._render() }

    // ---------- the side effects of an answer, said before it is chosen ----------
    _effects(a) {
        const c = this._card, out = [], who = (c.blocks || []).join(', ')
        if (a.action === 'done')     out.push(`${c.issue || c.id} is marked done on the board, in your words`, who && `unblocks ${who}`)
        if (a.action === 'decide')   out.push('recorded as decided, in your words, with the time', 'leaves the stand-up agenda', who && `unblocks ${who}`)
        if (a.action === 'delegate') out.push(`goes to ${a.delegate_name || a.delegate || 'them'}: their conductor is told by a commit For:`, 'leaves your list')
        if (a.action === 'details')  out.push(`asks ${c.evidence.by || c.by || 'whoever raised it'} for more, with your question`, 'stays on your list')
        if (a.action === 'mine')     out.push("set as yours on the board: you'll do it", 'moves to the top of your list')
        if (a.action === 'later')    out.push('drops down your ranking; nothing else changes')
        if (a.action === 'drop')     out.push('closed as no decision needed', who && `${who} is told it is not waiting on you`)
        if (a.effects) out.push(...a.effects.map(x => fill(x, c.params)))
        return out.filter(Boolean)
    }

    _answers() {
        const c = this._card, k = this._kind || {}, out = []
        // a decision's own options come first, the recommended one starred
        if (c.options && c.options.length) {
            const rec = (c.recommend || '').toLowerCase()
            for (const o of c.options) out.push({ id: 'opt:' + o, label: o, action: 'decide', option: o, rec: !!rec && rec.includes(o.toLowerCase().slice(0, 24)) })
        }
        for (const a of k.answers || []) if (!(c.options && c.options.length && ['yes', 'no'].includes(a.id))) out.push({ ...a, label: fill(a.label, c.params), option: a.option ? fill(a.option, c.params) : '' })
        return out
    }

    _graph() {
        const g = this._card.graph
        if (!g || g.nodes.length < 2) return ''
        const W = 360, H = 210, cx = W / 2, cy = H / 2, others = g.nodes.slice(1), R = 78
        const pos = others.map((n, i) => { const t = -Math.PI / 2 + i * 2 * Math.PI / others.length; return { n, x: cx + Math.cos(t) * R * 1.55, y: cy + Math.sin(t) * R } })
        const edge = id => (g.edges.find(e => e.to === id) || {}).rel || ''
        return `<figure class="graph"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="How ${esc(g.nodes[0].label)} relates to people, agents, issues and meetings">
${pos.map(p => `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" class="e"/><text x="${((cx + p.x) / 2).toFixed(1)}" y="${((cy + p.y) / 2 - 3).toFixed(1)}" class="el">${esc(edge(p.n.id))}</text>`).join('')}
<circle cx="${cx}" cy="${cy}" r="22" fill="${GRAPH_COLOURS.item}"/><text x="${cx}" y="${cy + 4}" class="cl">${esc(g.nodes[0].label)}</text>
${pos.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="6" fill="${GRAPH_COLOURS[p.n.kind] || 'var(--ink-2)'}"/><text x="${p.x.toFixed(1)}" y="${(p.y + 17).toFixed(1)}" class="nl">${esc(p.n.label.length > 22 ? p.n.label.slice(0, 21) + '…' : p.n.label)}</text>`).join('')}
</svg><figcaption>${Object.entries({ person: 'people', agent: 'agents', issue: 'open issues', done: 'done issues', meeting: 'agenda' }).filter(([k]) => g.nodes.some(n => n.kind === k)).map(([k, t]) => `<span><i style="background:${GRAPH_COLOURS[k]}"></i>${t}</span>`).join('')}</figcaption></figure>`
    }

    _evidence(block) {
        const c = this._card, ev = c.evidence || {}
        switch (block) {
            case 'ask':       { const t = c.action || c.detail || ''; return t ? `<section class="ask"><h3>What is asked</h3>${t.length > 420 ? `<details><summary>${esc(t.slice(0, 380).replace(/\s+\S*$/, ''))}… <span>read it all</span></summary><p>${esc(t)}</p></details>` : `<p>${esc(t)}</p>`}</section>` : '' }
            case 'recommend': return c.recommend ? `<section class="rec"><h3>Recommended</h3><p>${esc(c.recommend)}</p></section>` : ''
            case 'why':       return `<section><h3>Why it is here</h3><p>${esc(c.why || '')}${c.due ? ` · due ${esc(c.due)}` : ''}${c.by ? ` · from <code>${esc(c.by)}</code>` : ''}</p></section>`
            case 'issue':     return ev.issue ? `<section class="issue"><h3>The issue ${linkTo(ev.issue.url, ev.issue.id)}</h3><p class="meta">${esc(ev.issue.status)}${ev.issue.due ? ` · due ${esc(ev.issue.due)}` : ''} · for ${esc((ev.issue.for || []).join(', '))}${ev.issue.picked_by ? ` · picked by ${esc(ev.issue.picked_by)}` : ' · nobody picked it'}</p><p class="body">${esc(ev.issue.body)}</p>${ev.issue.agents ? `<p class="meta">${esc(ev.issue.agents)}</p>` : ''}</section>` : ''
            case 'agenda':    return ev.agenda && ev.agenda.length ? `<section><h3>On the agenda</h3><ul>${ev.agenda.map(a => `<li><span class="tag ${esc(a.status)}">${esc(a.status)}</span> ${linkTo(`../../../../meetings/${a.meeting}/index.html`, a.title)} <small>${esc(a.meeting)}, by ${esc(a.by)}</small></li>`).join('')}</ul></section>` : ''
            case 'commits':   return ev.commits && ev.commits.length ? `<section><h3>What happened, from the commits</h3><ul class="commits">${ev.commits.map(x => `<li>${linkTo(x.url, x.h)} <small>${esc(ago(x.at))}</small> ${esc(x.s)}</li>`).join('')}</ul></section>` : ''
            case 'people':    return ev.related && ev.related.length ? `<section><h3>Related issues</h3><ul>${ev.related.map(r => `<li><span class="tag ${/^(done|closed)/i.test(r.status) ? 'decided' : 'open'}">${esc(r.status)}</span> <b>${esc(r.id)}</b> ${esc(r.title)}</li>`).join('')}</ul></section>` : ''
            default: return ''
        }
    }

    _render() {
        const root = this.shadowRoot && this.shadowRoot.getElementById('card')
        const c = this._card, k = this._kind
        if (!root || !c || !k) return
        const seen = new Set(), links = [...(c.link ? [['Do it now', c.link]] : []), ...(k.links || []).map(([t, u]) => [fill(t, c.params), fill(u, c.params)])].filter(([, u]) => u && !/\{[a-z_]+\}/.test(u) && !seen.has(u) && seen.add(u))
        const answers = this._answers(), ch = this._chosen
        root.innerHTML = `<header>
<p class="kicker">${esc(k.label)}${c.issue || c.id ? ` · ${esc(c.issue || c.id)}` : ''}</p>
<h2>${esc(c.title)}</h2>
<p class="prio" title="The priority score and what makes it">priority <b>${esc(c.score)}</b>${(c.score_parts || []).map(([t, n]) => `<span class="${n < 0 ? 'neg' : ''}">${esc(t)} <b>${n > 0 ? '+' : ''}${esc(n)}</b></span>`).join('')}</p>
</header>
<div class="cols">
<div class="left">
${(k.evidence || []).filter(b => b === 'ask' || b === 'recommend').map(b => this._evidence(b)).join('')}
${k.think && k.think.length ? `<section class="think"><h3>How to think about it</h3><ol>${k.think.map(t => `<li>${esc(fill(t, c.params))}</li>`).join('')}</ol></section>` : ''}
${links.length ? `<section class="links"><h3>What you need</h3><p>${links.map(([t, u]) => linkTo(u, t)).join('')}</p></section>` : ''}
${(k.evidence || []).filter(b => b !== 'ask' && b !== 'recommend').map(b => this._evidence(b)).join('')}
${this._graph() ? `<section><h3>How it connects</h3>${this._graph()}</section>` : ''}
</div>
<div class="right">
<h3>Your answer</h3>
<div class="answers">${answers.map((a, i) => `<button type="button" class="ans${a.primary || a.rec ? ' primary' : ''}${ch && ch.id === a.id ? ' on' : ''}" data-i="${i}"><kbd>${i + 1}</kbd>${a.rec ? '★ ' : ''}${esc(a.label)}</button>`).join('')}</div>
<p class="fx" id="fx">${ch ? `<b>If you choose this:</b> ${this._effects(ch).map(esc).join('; ')}.` : 'Hover or focus an answer to see what it will do.'}</p>
${ch && ch.input ? `<label class="in"><span>${esc(ch.input.placeholder || 'Your answer')}</span><input id="val" type="${ch.input.type === 'number' ? 'number' : 'text'}" autocomplete="off"></label>` : ''}
<label class="in"><span>In your words (optional)</span><textarea id="words" rows="2" placeholder="Anything they should know"></textarea></label>
<div class="row">${ch ? `<button type="button" class="go" id="confirm">Record: ${esc(ch.label)} <kbd>↵</kbd></button><button type="button" class="ghost" id="cancel">Back</button>` : ''}</div>
<h3>Or</h3>
<div class="row">
<select id="dg" aria-label="Send it to someone else"><option value="">For someone else: send to…</option>${(this._delegates || []).map(p => `<option value="${esc(p.id)}">${esc(p.first)}${p.role ? ' · ' + esc(p.role.slice(0, 40)) : ''}</option>`).join('')}</select>
<button type="button" class="ghost" data-q="details"><kbd>d</kbd> Need more details</button>
<button type="button" class="ghost" data-q="mine"><kbd>m</kbd> It's mine</button>
<button type="button" class="ghost" data-q="later"><kbd>l</kbd> Later</button>
<button type="button" class="ghost" data-q="note"><kbd>n</kbd> Just a note</button>
</div>
</div>
</div>`
        this._wire(root, answers)
    }

    _wire(root, answers) {
        const fx = root.querySelector('#fx'), c = this._card
        const preview = a => { if (fx && !this._chosen) fx.innerHTML = `<b>If you choose this:</b> ${this._effects(a).map(esc).join('; ')}.` }
        root.querySelectorAll('.ans').forEach(b => {
            const a = answers[+b.dataset.i]
            b.onmouseenter = b.onfocus = () => preview(a)
            b.onclick = () => this.choose(a)
        })
        root.querySelectorAll('[data-q]').forEach(b => {
            const a = { id: b.dataset.q, action: b.dataset.q, label: b.textContent.replace(/^\S+\s/, '').trim(), input: b.dataset.q === 'details' ? { placeholder: 'What do you need to know?' } : b.dataset.q === 'note' ? { placeholder: 'Your note' } : null }
            b.onmouseenter = b.onfocus = () => preview(a)
            b.onclick = () => this.choose(a)
        })
        const dg = root.querySelector('#dg')
        if (dg) dg.onchange = () => { const p = (this._delegates || []).find(d => d.id === dg.value); if (p) this.choose({ id: 'dg:' + p.id, action: 'delegate', label: `Send to ${p.first}`, delegate: p.id, delegate_name: p.first, delegate_agent: p.agent }) }
        const ok = root.querySelector('#confirm'); if (ok) ok.onclick = () => this.confirm()
        const no = root.querySelector('#cancel'); if (no) no.onclick = () => { this._chosen = null; this._render() }
        const v = root.querySelector('#val'); if (v) { v.focus(); v.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); this.confirm() } } }
    }

    // the keyboard (the focus page forwards keys): 1..9 an answer, d m l n the quick ones, Enter to record
    key(k) {
        const answers = this._answers()
        if (/^[1-9]$/.test(k) && answers[+k - 1]) { this.choose(answers[+k - 1]); return true }
        const q = { d: 'details', m: 'mine', l: 'later', n: 'note' }[k]
        if (q) { const b = this.shadowRoot.querySelector(`[data-q="${q}"]`); if (b) b.click(); return true }
        if (k === 'Enter' && this._chosen) { this.confirm(); return true }
        if (k === 'Escape' && this._chosen) { this._chosen = null; this._render(); return true }
        return false
    }
    choose(a) {
        this._chosen = a
        if (!a.input && ['later', 'mine', 'drop'].includes(a.action) && !a.primary) { this.confirm(); return }
        this._render()
    }
    confirm() {
        const a = this._chosen, c = this._card, r = this.shadowRoot
        if (!a) return
        const val = r.querySelector('#val') ? r.querySelector('#val').value.trim() : '', words = r.querySelector('#words') ? r.querySelector('#words').value.trim() : ''
        if (a.input && !val && ['details', 'note'].includes(a.action)) { r.querySelector('#val').focus(); return }
        const option = [a.option, val].filter(Boolean).join(a.option && /up to$/.test(a.option) ? ' ' : a.option ? ': ' : '')
        const entry = { ref: c.ref || c.file, title: c.title, issue: c.issue || c.id || '', action: a.action, option, words: a.action === 'note' || a.action === 'details' ? [val, words].filter(Boolean).join('. ') : words,
            ...(a.delegate ? { delegate: a.delegate, delegate_name: a.delegate_name || a.delegate, delegate_agent: a.delegate_agent || a.delegate } : {}), answer: a.id, kind: this._kind.kind }
        if (a.action === 'note' || a.action === 'details') entry.option = ''
        this._chosen = null
        document.dispatchEvent(new CustomEvent('ws-card:answer', { detail: { entry }, bubbles: true, composed: true }))
    }
}
customElements.define('ws-decision-card', WsDecisionCard)
