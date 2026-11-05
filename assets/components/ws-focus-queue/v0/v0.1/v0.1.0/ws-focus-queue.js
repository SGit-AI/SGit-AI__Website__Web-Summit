/**
 * ws-focus-queue — one queue of cards, one card at a time, with nothing else on the screen (Dinis, 5 November:
 * "undivided attention ... focus entirely on clearing that backlog"). The cards come from people/<id>/dashboard.json
 * (only_you or decisions), each drawn by ws-decision-card from its kind (data/cards/<kind>.json); a chat per card
 * (ws-card-chat). Filter by kind, by who is involved, by "blocks someone" or "overdue", or search; order by priority
 * or by your own order (drag in the list, or move up and down, kept in this browser). An answer goes to your actions
 * (ws-actions) and the next card opens; Submit sends them, signed.
 *
 * Keys: ← → (or j k) previous and next · 1-9 an answer · d details · m mine · l later · n note · Enter record ·
 * Esc back · / search · s submit.
 *
 * @module ws-focus-queue
 * @version 0.1.0
 */
import { WsComponent } from '../../../../ws-shared/v0/v0.1/v0.1.0/ws-component.js'
import { esc, hhmm } from '../../../../ws-shared/v0/v0.1/v0.1.0/ws-shared.js'
import * as A from '../../../../ws-actions/v0/v0.1/v0.1.0/ws-actions.js'
import '../../../../ws-decision-card/v0/v0.1/v0.1.0/ws-decision-card.js'
import '../../../../ws-card-chat/v0/v0.1/v0.1.0/ws-card-chat.js'

const QUEUES = Object.freeze({ only_you: 'Only you can do this', decisions: 'Decide' })
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch { } } }

class WsFocusQueue extends WsComponent {
    static jsUrl = import.meta.url
    static template = `<div class="fq">
  <header class="bar" id="bar"></header>
  <div class="tools" id="tools"></div>
  <div class="stage">
    <aside class="list" id="list" aria-label="The queue"></aside>
    <main class="main">
      <div id="empty" class="empty" hidden></div>
      <ws-decision-card id="card"></ws-decision-card>
      <ws-card-chat id="chat"></ws-card-chat>
    </main>
  </div>
</div>`
    get resourceName() { return 'ws-focus-queue' }

    async onReady() {
        this._queue = this.dataset.queue || 'only_you'
        this._f = ls.get('ws.focus.filter.' + this._queue, { kind: '', who: '', blocks: false, late: false, q: '', order: 'priority' })
        this._order = ls.get('ws.focus.order.' + this._queue, [])
        this._notice = ''
        try {
            const [d, lane] = await Promise.all([fetch(this.dataset.src, { cache: 'no-cache' }).then(r => r.json()), A.laneFor(this.dataset.lanes, 'dashboard@web-summit.' + (this.dataset.person || 'dinis'))])
            this._D = d; this._lane = lane; this._P = A.processedMap(d.processed)
        } catch (e) { this.shadowRoot.getElementById('empty').hidden = false; this.shadowRoot.getElementById('empty').textContent = `The cards could not load (${e.message}).`; return }
        if (window.WSKeyring) await window.WSKeyring.ready.catch(() => null)
        document.addEventListener('ws-card:answer', e => this._answer(e.detail.entry))
        document.addEventListener('ws-actions:changed', () => this._drawBar())
        document.addEventListener('keydown', e => this._key(e))
        const want = (location.hash || '').slice(1)
        this._cur = want || ''
        this._draw()
    }

    // ---------- the cards: not acted on, filtered, ordered ----------
    _all() { return (this._D[this._queue] || []).filter(c => !A.acted(c.ref, this._P)) }
    _items() {
        const f = this._f, q = (f.q || '').toLowerCase()
        let xs = this._all().filter(c => (!f.kind || c.kind === f.kind) && (!f.who || [...(c.blocks || []), ...(c.with || []), ...((c.evidence && c.evidence.issue && c.evidence.issue.for) || [])].includes(f.who))
            && (!f.blocks || (c.blocks || []).length) && (!f.late || /overdue/.test(c.why || '')) && (!q || (c.title + ' ' + (c.detail || '') + ' ' + (c.action || '') + ' ' + (c.issue || c.id || '')).toLowerCase().includes(q)))
        if (f.order === 'mine' && this._order.length) xs = xs.slice().sort((a, b) => { const i = this._order.indexOf(a.ref), j = this._order.indexOf(b.ref); return (i < 0 ? 1e6 : i) - (j < 0 ? 1e6 : j) || b.score - a.score })
        else xs = xs.slice().sort((a, b) => b.score - a.score)
        return xs
    }
    _current(xs = this._items()) { return xs.find(c => c.ref === this._cur) || xs[0] }

    _go(delta) { const xs = this._items(), i = xs.indexOf(this._current(xs)); const n = xs[Math.max(0, Math.min(xs.length - 1, i + delta))]; if (n) { this._cur = n.ref; this._draw() } }
    _move(delta) {
        const xs = this._items(), c = this._current(xs); if (!c) return
        const order = xs.map(x => x.ref), i = order.indexOf(c.ref), j = i + delta
        if (j < 0 || j >= order.length) return
        ;[order[i], order[j]] = [order[j], order[i]]
        this._order = order; this._f.order = 'mine'; this._save(); this._draw()
    }
    _save() { ls.set('ws.focus.filter.' + this._queue, this._f); ls.set('ws.focus.order.' + this._queue, this._order) }

    _answer(entry) {
        const e = A.add(entry), xs = this._items(), next = xs[0]
        this._notice = `Recorded: ${A.sentence(e)}. It waits in your actions until you submit.`
        this._cur = next ? next.ref : ''
        this._draw()
    }
    async _send() {
        try { const n = await A.send(this._lane); this._notice = n ? `Sent ${n}, signed and sealed to ${this._lane.agent}. Processed at the next drain, about ${hhmm(this._nextDrain())} UTC.` : 'Nothing to send.' }
        catch (e) { this._notice = `Not sent: ${e.message}. Your answers are still here.` }
        this._draw()
    }
    _nextDrain() { const d = new Date(); d.setUTCMinutes(6, 0, 0); if (d <= new Date()) d.setUTCHours(d.getUTCHours() + 1); if (d.getUTCHours() < 7) d.setUTCHours(7); if (d.getUTCHours() > 22) { d.setUTCDate(d.getUTCDate() + 1); d.setUTCHours(7) } return d }

    _key(e) {
        const t = e.composedPath()[0], typing = t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)
        if (typing) { if (e.key === 'Escape') t.blur(); return }
        if (e.metaKey || e.ctrlKey || e.altKey) return
        const card = this.shadowRoot.getElementById('card')
        if (e.key === 'ArrowRight' || e.key === 'j') { e.preventDefault(); this._go(1) }
        else if (e.key === 'ArrowLeft' || e.key === 'k') { e.preventDefault(); this._go(-1) }
        else if (e.key === '/') { e.preventDefault(); const s = this.shadowRoot.getElementById('q'); if (s) s.focus() }
        else if (e.key === 's') { e.preventDefault(); this._send() }
        else if (card && card.key && card.key(e.key)) e.preventDefault()
    }

    // ---------- drawing ----------
    _drawBar() {
        const r = this.shadowRoot, q = A.load(), draft = q.filter(e => e.state === 'draft').length
        const sent = q.filter(e => A.layer(e, this._P) === 'sent').length, KR = window.WSKeyring
        const can = KR && KR.person === (this.dataset.person || 'dinis') && this._lane
        const all = this._D, xs = this._items(), c = this._current(xs), i = xs.indexOf(c)
        r.getElementById('bar').innerHTML = `<a class="back" href="${esc(this.dataset.back || '../../index.html')}">← Dashboard</a>
<nav class="tabs">${Object.entries(QUEUES).map(([k, t]) => `<a href="${k === this._queue ? '#' : `../${k === 'only_you' ? 'only-you' : 'decide'}/index.html`}"${k === this._queue ? ' aria-current="page"' : ''}>${esc(t)} <b>${(all[k] || []).filter(x => !A.acted(x.ref, this._P)).length}</b></a>`).join('')}</nav>
<span class="pos">${xs.length ? `${i + 1} of ${xs.length}` : '0'}${xs.length < this._all().length ? ` <small>(${this._all().length - xs.length} filtered out)</small>` : ''}</span>
<span class="nav"><button type="button" id="prev" title="Previous (←)"${i <= 0 ? ' disabled' : ''}>←</button><button type="button" id="next" title="Next (→)"${i < 0 || i >= xs.length - 1 ? ' disabled' : ''}>→</button></span>
<span class="out">${sent ? `<span class="sent">${sent} sent, not processed</span>` : ''}<button type="button" class="go" id="send"${draft && can ? '' : ' disabled'} title="${can ? 'Send your actions, signed with your key (s)' : 'Add your key to this browser to send'}">${draft ? `Submit ${draft} signed` : 'Nothing to submit'}</button></span>
${this._notice ? `<p class="notice" role="status">${esc(this._notice)}</p>` : ''}`
        r.getElementById('prev').onclick = () => this._go(-1)
        r.getElementById('next').onclick = () => this._go(1)
        r.getElementById('send').onclick = () => this._send()
    }
    _drawTools() {
        const r = this.shadowRoot, f = this._f, all = this._all(), K = this._D.kinds || {}
        const kinds = [...new Set(all.map(c => c.kind))], who = [...new Set(all.flatMap(c => [...(c.blocks || []), ...(c.with || [])]))].sort()
        r.getElementById('tools').innerHTML = `<input id="q" type="search" placeholder="Search (/)" value="${esc(f.q || '')}">
<select id="fk" aria-label="Kind"><option value="">Every kind</option>${kinds.map(k => `<option value="${esc(k)}"${f.kind === k ? ' selected' : ''}>${esc((K[k] && K[k].label) || k)}</option>`).join('')}</select>
<select id="fw" aria-label="Who is involved"><option value="">Anyone involved</option>${who.map(w => `<option value="${esc(w)}"${f.who === w ? ' selected' : ''}>${esc(w)}</option>`).join('')}</select>
<label><input type="checkbox" id="fb"${f.blocks ? ' checked' : ''}> blocks someone</label><label><input type="checkbox" id="fl"${f.late ? ' checked' : ''}> overdue</label>
<span class="ord">Order: <button type="button" id="op" class="${f.order !== 'mine' ? 'on' : ''}">by priority</button><button type="button" id="om" class="${f.order === 'mine' ? 'on' : ''}">my order</button><button type="button" id="up" title="Move this card up">↑</button><button type="button" id="dn" title="Move this card down">↓</button></span>`
        const set = (k, v) => { this._f[k] = v; this._save(); this._draw() }
        r.getElementById('q').oninput = e => { this._f.q = e.target.value; this._save(); this._drawList(); this._drawBar(); this._drawCard() }
        r.getElementById('fk').onchange = e => set('kind', e.target.value)
        r.getElementById('fw').onchange = e => set('who', e.target.value)
        r.getElementById('fb').onchange = e => set('blocks', e.target.checked)
        r.getElementById('fl').onchange = e => set('late', e.target.checked)
        r.getElementById('op').onclick = () => set('order', 'priority')
        r.getElementById('om').onclick = () => { if (!this._order.length) this._order = this._items().map(x => x.ref); set('order', 'mine') }
        r.getElementById('up').onclick = () => this._move(-1)
        r.getElementById('dn').onclick = () => this._move(1)
    }
    _drawList() {
        const r = this.shadowRoot, xs = this._items(), c = this._current(xs), K = this._D.kinds || {}
        const el = r.getElementById('list')
        el.innerHTML = `<ol>${xs.map(x => `<li draggable="true" data-ref="${esc(x.ref)}"${x === c ? ' aria-current="true"' : ''}><button type="button" data-go="${esc(x.ref)}"><span class="sc">${esc(x.score)}</span><span class="t">${esc(x.issue || x.id ? (x.issue || x.id) + ': ' : '')}${esc(x.title)}</span><small>${esc((K[x.kind] && K[x.kind].label) || x.kind)}${(x.blocks || []).length ? ' · blocks ' + esc(x.blocks.join(', ')) : ''}</small></button></li>`).join('')}</ol>`
        el.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { this._cur = b.dataset.go; this._draw() })
        let drag = null
        el.querySelectorAll('li').forEach(li => {
            li.ondragstart = () => { drag = li.dataset.ref; li.classList.add('dragging') }
            li.ondragend = () => li.classList.remove('dragging')
            li.ondragover = e => e.preventDefault()
            li.ondrop = e => { e.preventDefault(); if (!drag || drag === li.dataset.ref) return; const order = this._items().map(x => x.ref).filter(x => x !== drag); order.splice(order.indexOf(li.dataset.ref), 0, drag); this._order = order; this._f.order = 'mine'; this._save(); this._draw() }
        })
    }
    _drawCard() {
        const r = this.shadowRoot, xs = this._items(), c = this._current(xs)
        const card = r.getElementById('card'), chat = r.getElementById('chat'), empty = r.getElementById('empty')
        if (!c) {
            card.hidden = chat.hidden = true; empty.hidden = false
            empty.innerHTML = this._all().length ? '<h2>Nothing matches the filters.</h2><p>Clear a filter above to see the rest.</p>' : `<h2>All clear.</h2><p>Nothing left in ${esc(QUEUES[this._queue])}. ${A.load().some(e => e.state === 'draft') ? 'Submit your answers at the top.' : ''}</p>`
            return
        }
        card.hidden = chat.hidden = false; empty.hidden = true
        this._cur = c.ref
        if (history.replaceState) history.replaceState(null, '', '#' + encodeURIComponent(c.ref))
        card.kind = (this._D.kinds || {})[c.kind]; card.delegates = this._D.delegates; card.person = this._D.person; card.card = c
        chat.kind = (this._D.kinds || {})[c.kind]; chat.card = c
    }
    _draw() { this._cur = this._cur && decodeURIComponent(this._cur); this._drawTools(); this._drawList(); this._drawBar(); this._drawCard() }
}
customElements.define('ws-focus-queue', WsFocusQueue)
