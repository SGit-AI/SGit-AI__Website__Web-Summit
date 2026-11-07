// The email twin (WS-176; crm@web-summit.angelo, 5 November 2026, at Dinis's word, with Angelo's yes): a mail view of the
// private team CRM, read straight from the vault. One file, used in two places: the private CRM's own vault app
// (admin/tools/crm_app.html.tpl, where `node admin/tools/crm.mjs app` inlines it) and /crm/ after "Open the private CRM"
// (assets/crm.js loads it). Read-only.
//
// What it reads: the graph that `crm.mjs derive` writes, whose `thread` and `message` nodes come from
//   companies/<company>/comms/<YYYY-MM-DD>-<thread>/thread.json        the thread: subject, owner, state, next step...
//   companies/<company>/comms/<YYYY-MM-DD>-<thread>/<stamp>-<in|out|draft>-<id>.json   a message's card
//   companies/<company>/comms/<YYYY-MM-DD>-<thread>/<same name>.eml    the message itself (RFC 5322), the evidence
// and then each thread.json, card and EML when it is opened, through io.readText(path).
//
// Every byte of mail is untrusted. Nothing from a vault is ever parsed as HTML or put into innerHTML: every string reaches
// the page through textContent. An HTML-only email is turned into plain text by removing its tags. Links are shown as
// text, never made clickable; images and other remote content are never loaded. Sizes are capped.
//
//   WSCrmMail.mount(root, { nodes, edges, readText })   draws the inbox, the thread view and the company view in root
//   WSCrmMail.parseEml(text)                             { headers, get(name), text, html, attachments, notes }
//   WSCrmMail.htmlToText(html)                           plain text from HTML, by removing tags (no DOM is involved)
;(function () {
  'use strict'
  const MAX_EML = 5 * 1024 * 1024, MAX_BODY = 200000, MAX_PARTS = 200, MAX_DEPTH = 8

  // ---------- EML (RFC 5322 and MIME), parsed as text ----------
  function decoderFor(charset) {
    try { return new TextDecoder(String(charset || 'utf-8').trim().toLowerCase()) } catch (e) { return new TextDecoder('utf-8') }
  }
  const latin1Bytes = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b }
  function b64Bytes(s) {
    const clean = String(s).replace(/[^A-Za-z0-9+/=]/g, '')
    try { return latin1Bytes(atob(clean.replace(/=+$/, '') + '==='.slice((clean.replace(/=+$/, '').length + 3) % 4))) } catch (e) { return new Uint8Array(0) }
  }
  function qpBytes(s, inHeader) {
    const out = []
    s = String(s).replace(/=\r?\n/g, '')
    for (let i = 0; i < s.length; i++) {
      const c = s[i]
      if (c === '=' && /^[0-9A-Fa-f]{2}$/.test(s.substr(i + 1, 2))) { out.push(parseInt(s.substr(i + 1, 2), 16)); i += 2 }
      else if (inHeader && c === '_') out.push(32)
      else { const code = s.charCodeAt(i); if (code < 128) out.push(code); else for (const b of new TextEncoder().encode(c)) out.push(b) }
    }
    return new Uint8Array(out)
  }
  // =?charset?B|Q?text?= words in a header (RFC 2047); spaces between two encoded words are dropped
  function decodeWords(v) {
    return String(v).replace(/(=\?[^?\s]+\?[BbQq]\?[^?\s]*\?=)\s+(?==\?)/g, '$1').replace(/=\?([^?\s]+)\?([BbQq])\?([^?\s]*)\?=/g, (m, cs, enc, t) => {
      try { return decoderFor(cs.split('*')[0]).decode(/^b$/i.test(enc) ? b64Bytes(t) : qpBytes(t, true)) } catch (e) { return m }
    })
  }
  function splitHead(text) {
    const i = text.search(/\n\n/)
    return i < 0 ? [text, ''] : [text.slice(0, i), text.slice(i + 2)]
  }
  function parseHeaders(block) {
    const out = []
    for (const line of block.split('\n')) {
      if (/^[ \t]/.test(line) && out.length) out[out.length - 1].value += ' ' + line.trim()
      else { const m = /^([!-9;-~]+):[ \t]*(.*)$/.exec(line); if (m) out.push({ name: m[1], value: m[2] }) }
    }
    for (const h of out) h.value = decodeWords(h.value).trim()
    return out
  }
  function params(value) {                                   // 'text/plain; charset="utf-8"; name=a.txt' -> { _: 'text/plain', charset, name }
    const parts = String(value || '').split(';'), p = { _: parts.shift().trim().toLowerCase() }
    for (const x of parts) {
      const m = /^\s*([^=\s]+)\s*=\s*(?:"((?:[^"\\]|\\.)*)"|([^;]*))/.exec(x)
      if (!m) continue
      let k = m[1].toLowerCase(), v = m[2] != null ? m[2].replace(/\\(.)/g, '$1') : m[3].trim()
      if (/\*$/.test(k)) { k = k.replace(/\*\d*\*?$/, ''); const e = /^([^']*)'[^']*'(.*)$/.exec(v); if (e) { try { v = decoderFor(e[1]).decode(qpBytes(e[2].replace(/%([0-9A-Fa-f]{2})/g, '=$1'))) } catch (er) { } } }
      else k = k.replace(/\*\d+$/, '')
      p[k] = (p[k] && /\*\d+/.test(m[1]) ? p[k] : '') + v
    }
    return p
  }
  const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', reg: '®', trade: '™', hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', laquo: '«', raquo: '»', bull: '•', middot: '·', deg: '°', euro: '€', pound: '£', yen: '¥', cent: '¢', szlig: 'ß', ordf: 'ª', ordm: 'º', iexcl: '¡', iquest: '¿' }
  for (const [l, marks] of Object.entries({ a: 'acute grave circ tilde uml ring', e: 'acute grave circ uml', i: 'acute grave circ uml', o: 'acute grave circ tilde uml slash', u: 'acute grave circ uml', c: 'cedil', n: 'tilde', y: 'acute uml' }))
    for (const m of marks.split(' ')) for (const L of [l, l.toUpperCase()]) { const ch = (L + { acute: '\u0301', grave: '\u0300', circ: '\u0302', tilde: '\u0303', uml: '\u0308', ring: '\u030A', cedil: '\u0327', slash: '' }[m]).normalize('NFC'); ENT[L + m] = m === 'slash' ? (L === 'o' ? 'ø' : 'Ø') : ch }
  function htmlToText(html) {
    return String(html)
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style|head|title|template|noscript|svg|math)\b[\s\S]*?<\/\1\s*>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<(p|div|tr|h[1-6]|blockquote|section|article|table|ul|ol)\b[^>]*>/gi, '\n')
      .replace(/<\/(p|div|tr|li|h[1-6]|blockquote|section|article|table|ul|ol)\s*>/gi, '\n')
      .replace(/<li\b[^>]*>/gi, '• ')
      .replace(/<a\b[^>]*\bhref\s*=\s*["']?([^"'\s>]+)[^>]*>([\s\S]*?)<\/a\s*>/gi, (m, href, inner) => inner + ' [' + href + ']')
      .replace(/<[^>]*>/g, '')
      .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
        if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); try { return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : '' } catch (er) { return '' } }
        return ENT[e] ?? ENT[e.toLowerCase()] ?? m
      })
      .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  }
  function parseEml(raw) {
    const notes = []
    let text = String(raw == null ? '' : raw)
    if (text.length > MAX_EML) { text = text.slice(0, MAX_EML); notes.push('The message is larger than 5 MB: only its first 5 MB were read.') }
    text = text.replace(/\r\n?/g, '\n')
    const [hb, body] = splitHead(text), headers = parseHeaders(hb)
    const get = name => { const h = headers.find(x => x.name.toLowerCase() === String(name).toLowerCase()); return h ? h.value : '' }
    const out = { headers, get, text: '', html: '', attachments: [], notes }
    let count = 0
    const leaf = (hs, content) => {
      const g = n => { const h = hs.find(x => x.name.toLowerCase() === n); return h ? h.value : '' }
      const ct = params(g('content-type') || 'text/plain'), cd = params(g('content-disposition')), cte = g('content-transfer-encoding').toLowerCase().trim()
      const name = cd.filename || ct.name || ''
      const bytes = () => cte === 'base64' ? b64Bytes(content) : cte === 'quoted-printable' ? qpBytes(content) : null
      const asText = () => { const b = bytes(); return b ? decoderFor(ct.charset).decode(b) : content }
      if (cd._ === 'attachment' || (name && !/^text\/(plain|html)$/.test(ct._))) {
        const b = bytes()
        out.attachments.push({ name: name || '(no name)', type: ct._, size: b ? b.length : content.length })
      } else if (ct._ === 'text/plain' && !out.text) out.text = asText()
      else if (ct._ === 'text/html' && !out.html) out.html = asText()
      else if (/^message\/rfc822$/.test(ct._)) out.attachments.push({ name: name || 'a forwarded message', type: ct._, size: content.length })
      else if (!/^text\//.test(ct._)) out.attachments.push({ name: name || '(inline ' + ct._ + ')', type: ct._, size: (bytes() || content).length })
    }
    const walk = (hs, content, depth) => {
      if (++count > MAX_PARTS) { if (count === MAX_PARTS + 1) notes.push('More than ' + MAX_PARTS + ' parts: the rest were not read.'); return }
      const ct = params((hs.find(x => x.name.toLowerCase() === 'content-type') || {}).value || 'text/plain')
      if (/^multipart\//.test(ct._) && ct.boundary && depth < MAX_DEPTH) {
        const b = '--' + ct.boundary, lines = content.split('\n'), parts = []
        let cur = null
        for (const l of lines) {
          if (l.trimEnd() === b) { if (cur) parts.push(cur); cur = []; continue }
          if (l.trimEnd() === b + '--') { if (cur) parts.push(cur); cur = null; break }
          if (cur) cur.push(l)
        }
        if (cur) parts.push(cur)
        for (const p of parts) { const [h, c] = splitHead(p.join('\n')); walk(parseHeaders(h), c, depth + 1) }
      } else leaf(hs, content)
    }
    walk(headers, body, 0)
    for (const k of ['text', 'html']) if (out[k].length > MAX_BODY) { out[k] = out[k].slice(0, MAX_BODY); notes.push('The ' + (k === 'text' ? 'text' : 'HTML') + ' is longer than ' + MAX_BODY + ' characters: the rest is not shown.') }
    return out
  }

  // ---------- the views ----------
  const CSS = `
.wsm{--wsm-line:var(--line,#e5e1d5);--wsm-ink:var(--ink,#161615);--wsm-ink2:var(--ink-2,var(--ink2,#5c5f66));--wsm-card:var(--surface,var(--card,#fff));--wsm-soft:var(--accent-soft,var(--soft,#eef6f2));--wsm-acc:var(--accent,var(--green,#1a7f5a));color:var(--wsm-ink)}
.wsm-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px}
.wsm-bar input,.wsm-bar select{font:inherit;padding:6px 10px;border-radius:999px;border:1px solid var(--wsm-line);background:var(--wsm-card);color:var(--wsm-ink)}
.wsm-bar input{flex:1;min-width:12rem}
.wsm-cols{display:grid;grid-template-columns:minmax(0,0.9fr) minmax(0,1.4fr);gap:12px}
.wsm-list{list-style:none;margin:0;padding:0;border:1px solid var(--wsm-line);border-radius:12px;max-height:70vh;overflow:auto;background:var(--wsm-card)}
.wsm-list li{margin:0;border-bottom:1px solid var(--wsm-line)}
.wsm-list button{display:block;width:100%;text-align:left;font:inherit;color:inherit;background:none;border:0;padding:8px 12px;cursor:pointer}
.wsm-list button:hover,.wsm-list button[aria-current=true]{background:var(--wsm-soft)}
.wsm-list .wsm-l1{display:flex;gap:8px;justify-content:space-between;font-size:13px;color:var(--wsm-ink2)}
.wsm-list b{display:block;overflow-wrap:anywhere}
.wsm-view{border:1px solid var(--wsm-line);border-radius:12px;padding:10px 14px;min-height:14rem;background:var(--wsm-card);overflow-wrap:anywhere}
.wsm-view h3{margin:0 0 4px;font-size:18px}
.wsm-meta{color:var(--wsm-ink2);font-size:13px}
.wsm-dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:2px 12px;margin:8px 0;font-size:14px}.wsm-dl dt{color:var(--wsm-ink2)}.wsm-dl dd{margin:0}
.wsm-msg{border:1px solid var(--wsm-line);border-radius:10px;padding:8px 10px;margin:10px 0}
.wsm-msg.out{border-left:4px solid var(--wsm-acc)}.wsm-msg.in{border-left:4px solid #1d4ed8}.wsm-msg.draft{border-left:4px dashed #b45309}
.wsm-dir{display:inline-block;font-size:12px;font-weight:700;border-radius:999px;padding:1px 8px;border:1px solid var(--wsm-line);margin-right:6px}
.wsm-body{white-space:pre-wrap;font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:var(--bg,#f7f6f2);border:1px solid var(--wsm-line);border-radius:8px;padding:8px 10px;max-height:60vh;overflow:auto;margin:6px 0}
.wsm-btn{font:inherit;font-size:13px;border:1px solid var(--wsm-line);background:var(--wsm-card);color:inherit;border-radius:999px;padding:3px 10px;cursor:pointer;margin:2px 4px 2px 0}
.wsm-link{font:inherit;border:0;background:none;color:#1d4ed8;padding:0;cursor:pointer;text-decoration:underline}
.wsm-warn{color:#b45309}
@media (max-width:760px){.wsm-cols{grid-template-columns:1fr}.wsm-list{max-height:45vh}}`

  function mount(root, io) {
    const nodes = (io && io.nodes) || [], edges = (io && io.edges) || [], readText = io.readText
    const el = (t, cls, txt) => { const e = document.createElement(t); if (cls) e.className = cls; if (txt != null) e.textContent = String(txt); return e }
    const btn = (cls, txt, fn) => { const b = el('button', cls, txt); b.type = 'button'; b.onclick = fn; return b }
    if (!document.getElementById('wsm-css')) { const s = el('style'); s.id = 'wsm-css'; s.textContent = CSS; document.head.appendChild(s) }
    const BY = Object.fromEntries(nodes.map(n => [n.id, n]))
    const threads = nodes.filter(n => n.type === 'thread' && n.file)
    const msgsOf = id => nodes.filter(n => n.type === 'message' && n.thread === id).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
    const coName = id => (BY[id] && BY[id].label) || String(id || '').replace(/^company:/, '') || '(no company)'
    const when = d => { const t = Date.parse(d); return isNaN(t) ? String(d || '') : new Date(t).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' }
    for (const t of threads) { const m = msgsOf(t.id); t._n = m.length; t._last = (m.length ? m[m.length - 1].date : '') || t.last_at || t.date || ''; t._lastDir = m.length ? m[m.length - 1].direction : '' ; t._who = m.map(x => [x.from, x.to].join(' ')).join(' ') }

    root.textContent = ''; root.classList.add('wsm')
    if (!threads.length) { root.appendChild(el('p', 'wsm-meta', 'No mail in the CRM yet: threads appear here once companies/<company>/comms/<thread>/ hold them (WS-173) and the graph is derived again.')); return }
    const bar = el('div', 'wsm-bar'), q = el('input'), co = el('select'), ow = el('select')
    q.type = 'search'; q.placeholder = 'Search subjects, companies, people, summaries...'; q.setAttribute('aria-label', 'Search the mail')
    const opts = (sel, first, vals, name) => { sel.appendChild(new Option(first, '')); for (const v of vals) sel.appendChild(new Option(name ? name(v) : v, v)) }
    opts(co, 'Every company', [...new Set(threads.map(t => t.company).filter(Boolean))].sort((a, b) => coName(a).localeCompare(coName(b))), coName)
    opts(ow, 'Every owner', [...new Set(threads.map(t => t.owner).filter(Boolean))].sort())
    co.setAttribute('aria-label', 'Company'); ow.setAttribute('aria-label', 'Owner')
    bar.append(q, co, ow); root.appendChild(bar)
    const cols = el('div', 'wsm-cols'), list = el('ol', 'wsm-list'), view = el('section', 'wsm-view')
    view.appendChild(el('p', 'wsm-meta', 'Pick a thread: its messages in order, each email shown as plain text, and its owner and next step. The company name opens everything we have with that company.'))
    cols.append(list, view); root.appendChild(cols)
    let CUR = null

    function inbox() {
      const s = q.value.trim().toLowerCase(), c = co.value, o = ow.value
      const rows = threads.filter(t => (!c || t.company === c) && (!o || t.owner === o) &&
        (!s || [t.label, coName(t.company), t.owner, t.state, t.next_step, t._who, ...msgsOf(t.id).map(m => m.summary)].join(' ').toLowerCase().includes(s)))
        .sort((a, b) => String(b._last).localeCompare(String(a._last)))
      list.textContent = ''
      for (const t of rows) {
        const li = el('li'), b = btn(null, null, () => thread(t.id))
        if (t.id === CUR) b.setAttribute('aria-current', 'true')
        const l1 = el('span', 'wsm-l1'); l1.append(el('span', null, coName(t.company)), el('span', null, when(t._last)))
        b.append(l1, el('b', null, t.label || '(no subject)'), el('span', 'wsm-meta', [t._n + ' message' + (t._n === 1 ? '' : 's'), t._lastDir && 'last ' + t._lastDir, t.state, t.owner && 'owner ' + t.owner].filter(Boolean).join(' · ')))
        li.appendChild(b); list.appendChild(li)
      }
      if (!rows.length) list.appendChild(el('li', 'wsm-meta', '  Nothing matches.'))
    }
    const dl = pairs => { const d = el('dl', 'wsm-dl'); for (const [k, v] of pairs) { if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue; d.append(el('dt', null, k), el('dd', null, Array.isArray(v) ? v.map(x => typeof x === 'object' ? (x.name || x.email || JSON.stringify(x)) : x).join(', ') : typeof v === 'object' ? JSON.stringify(v) : v)) } return d }
    const readJson = async p => JSON.parse(await readText(p))

    async function thread(id) {
      const t = BY[id]; if (!t) return
      CUR = id; inbox(); view.textContent = ''
      view.appendChild(el('h3', null, t.label || '(no subject)'))
      const line = el('p', 'wsm-meta'); line.append(btn('wsm-link', coName(t.company), () => company(t.company)), document.createTextNode(' · ' + (t.channel || 'email') + ' · ' + t.file)); view.appendChild(line)
      let r = {}; try { r = await readJson(t.file) } catch (e) { view.appendChild(el('p', 'wsm-warn', 'Could not read ' + t.file)) }
      if (CUR !== id) return
      view.appendChild(dl([['owner', r.owner || t.owner], ['state', r.state || t.state], ['next step', r.next_step || t.next_step], ['our people', r.our_people || r.ours], ['their contacts', r.their_contacts || r.contacts], ['messages', String(t._n)]]))
      for (const m of msgsOf(id)) view.appendChild(message(m))
    }
    function message(m) {
      const box = el('article', 'wsm-msg ' + (['in', 'out', 'draft'].includes(m.direction) ? m.direction : ''))
      const head = el('p'); head.append(el('span', 'wsm-dir', m.direction || '?'), el('b', null, m.label || '(no subject)')); box.appendChild(head)
      box.appendChild(el('p', 'wsm-meta', [when(m.date), m.from && 'from ' + m.from, m.to && 'to ' + m.to].filter(Boolean).join(' · ')))
      if (m.summary) box.appendChild(el('p', null, m.summary))
      if (m.reconstructed) box.appendChild(el('p', 'wsm-meta', 'Reconstructed from the headers and body (the raw message was not available).'))
      const more = el('div'); box.appendChild(more)
      const bar = el('p'); box.insertBefore(bar, more)
      bar.appendChild(btn('wsm-btn', 'The card', async e => { e.target.disabled = true; try { const c = await readJson(m.file); more.appendChild(dl(Object.entries(c).filter(([k]) => !['type', 'id'].includes(k)))) } catch (er) { more.appendChild(el('p', 'wsm-warn', 'Could not read ' + m.file)) } }))
      if (m.eml) bar.appendChild(btn('wsm-btn', 'The message (as text)', async e => { e.target.disabled = true; more.appendChild(await emlView(m)) }))
      else box.appendChild(el('p', 'wsm-meta', 'No .eml beside this card.'))
      return box
    }
    async function emlView(m) {
      const out = el('div')
      let raw
      try { raw = await readText(m.eml) } catch (e) { out.appendChild(el('p', 'wsm-warn', 'Could not read ' + m.eml)); return out }
      const p = parseEml(raw)
      out.appendChild(dl(['From', 'To', 'Cc', 'Date', 'Subject', 'Message-ID', 'In-Reply-To'].map(h => [h, p.get(h)])))
      if (m.sha256 && window.crypto && crypto.subtle) {
        try {
          const h = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))), b => b.toString(16).padStart(2, '0')).join('')
          const want = String(m.sha256).replace(/^sha256:/, '').toLowerCase()
          out.appendChild(el('p', h === want ? 'wsm-meta' : 'wsm-warn', h === want ? 'sha256 matches the card.' : 'sha256 does not match the card (the file changed, or it is not plain UTF-8).'))
        } catch (e) { }
      }
      for (const n of p.notes) out.appendChild(el('p', 'wsm-warn', n))
      const body = p.text || (p.html ? htmlToText(p.html) : '')
      if (!p.text && p.html) out.appendChild(el('p', 'wsm-meta', 'An HTML email, shown as plain text: its tags are removed and nothing in it is loaded.'))
      out.appendChild(el('div', 'wsm-body', body || '(no text in this message)'))
      if (p.attachments.length) { out.appendChild(el('p', 'wsm-meta', 'Attachments (listed, not opened):')); const ul = el('ul'); for (const a of p.attachments) ul.appendChild(el('li', null, a.name + ' · ' + a.type + ' · about ' + Math.max(1, Math.round(a.size / 1024)) + ' KB')); out.appendChild(ul) }
      const all = btn('wsm-btn', 'All headers', () => { all.disabled = true; out.appendChild(el('div', 'wsm-body', p.headers.map(h => h.name + ': ' + h.value).join('\n'))) }); out.appendChild(all)
      return out
    }
    async function company(id) {
      CUR = null; co.value = [...co.options].some(o => o.value === id) ? id : ''; inbox(); view.textContent = ''
      view.appendChild(el('h3', null, coName(id)))
      const n = BY[id]; view.appendChild(el('p', 'wsm-meta', 'company' + (n && n.file ? ' · ' + n.file : '')))
      if (n && n.file) { try { const r = await readJson(n.file); view.appendChild(dl([['what', r.what], ['country', r.country], ['website', r.website], ['attending', r.attending_as || r.attending]])) } catch (e) { } }
      const ts = threads.filter(t => t.company === id).sort((a, b) => String(b._last).localeCompare(String(a._last)))
      view.appendChild(el('h4', null, 'Threads (' + ts.length + ')'))
      const ul = el('ul'); for (const t of ts) { const li = el('li'); li.append(btn('wsm-link', t.label || '(no subject)', () => thread(t.id)), el('span', 'wsm-meta', ' · ' + when(t._last) + ' · ' + [t.state, t.owner].filter(Boolean).join(' · '))); ul.appendChild(li) } view.appendChild(ul)
      const acts = edges.filter(e => e.verb === 'about' && e.to === id && BY[e.from] && BY[e.from].type === 'action').map(e => BY[e.from])
      view.appendChild(el('h4', null, 'Actions (' + acts.length + ')'))
      const ua = el('ul'); for (const a of acts) ua.appendChild(el('li', null, (a.label || a.id) + ' · ' + [a.state, a.due && 'due ' + a.due, a.owner].filter(Boolean).join(' · '))); view.appendChild(ua)
    }
    q.addEventListener('input', inbox); co.addEventListener('change', inbox); ow.addEventListener('change', inbox)
    inbox()
  }
  window.WSCrmMail = { mount, parseEml, htmlToText }
})()
