/**
 * ws-card-chat — a quick chat with Claude about one card (Dinis, 5 November: "even having the ability to have a quick
 * LLM chat about that one"). Uses the person's own OpenRouter key, the one the command centre keeps in this browser
 * (localStorage cc.or.key, sent only to openrouter.ai), and the card's own data as the context. The conversation is
 * kept per card in this browser (ws.chat.<ref>). "Use as a note" turns the last answer into a note on the card.
 *
 * @module ws-card-chat
 * @version 0.1.0
 */
import { WsComponent } from '../../../../ws-shared/v0/v0.1/v0.1.0/ws-component.js'
import { esc } from '../../../../ws-shared/v0/v0.1/v0.1.0/ws-shared.js'

const OR    = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-sonnet-5.5'
const ls    = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch { } } }

class WsCardChat extends WsComponent {
    static jsUrl = import.meta.url
    static template = `<section class="chat"><h3>Ask Claude about this card</h3><div id="log" class="log"></div><form id="f" class="f"></form><p class="note" id="note"></p></section>`
    get resourceName() { return 'ws-card-chat' }

    set card(v) { this._card = v; this._render() }
    set kind(v) { this._kind = v }
    onReady() { this._render() }

    get _key()  { return ls.get('cc.or.key', '') }
    get _slot() { return 'ws.chat.' + ((this._card && (this._card.ref || this._card.file)) || '') }

    _context() {
        const c = this._card, ev = c.evidence || {}
        return [(this._kind && this._kind.chat) || 'Help Dinis decide this card.',
            `Card: ${c.title}`, c.action || c.detail ? `What is asked: ${c.action || c.detail}` : '', c.recommend ? `Recommended: ${c.recommend}` : '',
            c.options && c.options.length ? `Options: ${c.options.join(' | ')}` : '', `Why it is here: ${c.why || ''}`,
            ev.issue ? `The issue ${ev.issue.id} (${ev.issue.status}, due ${ev.issue.due}): ${ev.issue.body}` : '',
            ev.commits && ev.commits.length ? `Recent commits: ${ev.commits.map(x => x.s).join(' / ')}` : '',
            'Answer in under 120 words, plainly. Say what you would choose and why, and what you are unsure of. Never invent facts that are not above.'].filter(Boolean).join('\n')
    }

    _render() {
        const r = this.shadowRoot, c = this._card
        if (!r || !r.getElementById('log') || !c) return
        const log = ls.get(this._slot, [])
        r.getElementById('log').innerHTML = log.length ? log.map(m => `<p class="m ${m.role}"><b>${m.role === 'user' ? 'You' : 'Claude'}</b> ${esc(m.content).replace(/\n/g, '<br>')}</p>`).join('') : '<p class="note">Ask anything about this card: what the risk is, what the recommendation misses, who else should know.</p>'
        const f = r.getElementById('f')
        if (!this._key) {
            f.innerHTML = '<input id="k" type="password" placeholder="Your OpenRouter key (sk-or-…)" autocomplete="off"><button type="submit">Save the key</button>'
            r.getElementById('note').innerHTML = 'Kept in this browser only and sent only to openrouter.ai; the same key your command centre uses. <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener">Make one with a credit limit</a>.'
            f.onsubmit = e => { e.preventDefault(); const k = r.getElementById('k').value.trim(); if (/^sk-or-/.test(k)) { ls.set('cc.or.key', k); this._render() } }
            return
        }
        f.innerHTML = `<input id="q" type="text" placeholder="Ask about this card…" autocomplete="off"><button type="submit">Ask</button>${log.some(m => m.role === 'assistant') ? '<button type="button" id="use">Use as a note</button>' : ''}`
        r.getElementById('note').textContent = this._busy ? 'Thinking…' : 'With your key, through openrouter.ai; the card is the context.'
        f.onsubmit = e => { e.preventDefault(); this.ask(r.getElementById('q').value.trim()) }
        const use = r.getElementById('use')
        if (use) use.onclick = () => { const last = log.filter(m => m.role === 'assistant').slice(-1)[0]; document.dispatchEvent(new CustomEvent('ws-card:answer', { detail: { entry: { ref: c.ref || c.file, title: c.title, issue: c.issue || c.id || '', action: 'note', option: '', words: 'From a chat with Claude: ' + last.content.slice(0, 600) } }, bubbles: true, composed: true })) }
    }

    async ask(q) {
        if (!q || this._busy) return
        const log = ls.get(this._slot, []).concat({ role: 'user', content: q })
        ls.set(this._slot, log); this._busy = true; this._render()
        try {
            const res = await fetch(OR, { method: 'POST', headers: { 'Authorization': `Bearer ${this._key}`, 'Content-Type': 'application/json', 'HTTP-Referer': location.origin + location.pathname, 'X-Title': 'web-summit.sgit.ai focus' },
                body: JSON.stringify({ model: ls.get('cc.or.model', MODEL), messages: [{ role: 'system', content: this._context() }, ...log.slice(-12)] }) })
            const j = await res.json()
            const a = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : `No answer (${(j.error && j.error.message) || res.status})`
            ls.set(this._slot, log.concat({ role: 'assistant', content: String(a) }).slice(-20))
        } catch (e) { ls.set(this._slot, log.concat({ role: 'assistant', content: `Could not reach openrouter.ai: ${e.message}` })) }
        this._busy = false; this._render()
    }
}
customElements.define('ws-card-chat', WsCardChat)
