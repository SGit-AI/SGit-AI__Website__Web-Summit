/* X-RAY: its own world in the command centre (Silvio, 11 November 2026; Dinis's word the same evening), by
   dashboard@web-summit.silvio. On top next to UNIVERSO ✦ and GRAVITY, with a sub-menu: PESQUISAR · EMPRESAS · COMO FUNCIONA.
   Uses the Universe's own fan (https://web-summit.sgit.ai/lib/gravity/): the company as the orb, cards for leads, sources,
   AI agents and questions, the leads fanned out, the panel with the file.
   - The 13 prepared X-rays (data/xray/<slug>/xray.json, reviewed by xray@web-summit.dinis) replay at their agents' real times.
   - Live, for the team only: the same four agents and the same question as admin/tools/xray-search.mjs (the question is
     imported from admin/tools/xray-ask.mjs, one source), called straight from this browser through OpenRouter with a
     disposable, budget-limited key that a team member pastes on the device (Dinis, 11 November: no backend, our devices,
     demo only). The key is kept only in this browser's localStorage; it is never sent anywhere but openrouter.ai and is
     never in the site or the repository. A live result is leads, not facts: shown at once, marked "not reviewed", kept
     only on this device.
   - A team phrase instead of the key (Dinis, 11 November, 21:15 UTC; the phrase is his choice): the key is sealed once with it
     (PBKDF2-SHA-256, 600,000 rounds, then AES-256-GCM, all in the browser) and the sealed file published at
     data/xray/key.sealed.json; on a new device a team member types the three words and the key is opened there.
     The words are never sent or kept anywhere; only the sealed file is public, and it is useless without them.
   - Names are suggested from PrompTugal.news's list of Web Summit companies (promptugal.news/api/v1/companies.json).
   - What the search cost is hidden unless "Mostrar custo" is on (Silvio's call). */
(function () {
    const X0 = window.CC_EXTRA = window.CC_EXTRA || {}; X0.views = X0.views || {}
    const SITE = 'https://web-summit.sgit.ai/', GRAVITY = SITE + 'lib/gravity/latest/gravity.js', ASK = SITE + 'admin/tools/xray-ask.mjs', PTCOS = 'https://promptugal.news/api/v1/companies.json'
    const XSLUGS = ['feedzai', 'klarna', 'booking-com', 'amex-gbt', 'atlassian', 'cloudflare', 'fidelidade', 'manus-ai', 'primitive', 'replit', 'riskmandate', 'salesforce', 'sgit']
    const SEALED = SITE + 'data/xray/key.sealed.json', WORDS = SITE + 'assets/cc/words-en.txt', ROUNDS = 600000
    const KEYK = 'xr.orkey', LIVEK = 'xr.live', COSTK = 'xr.cost'
    const get = k => { try { return localStorage.getItem(k) } catch { return null } }, put = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch {} }
    const getJ = u => fetch(u, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
    const loadScript = src => new Promise((ok, no) => { if (window.Gravity) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s) })
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
    // no contact details on screen: the same redaction as the search tool
    const redact = s => String(s || '').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g, '[endereço removido]').replace(/(?:\+|00)\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g, '[número removido]')
    const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' } }
    const ACOL = ['#4FD1F5', '#3DDC97', '#F2B544', '#A58BFF'], short = l => String(l || '').replace(/ (web )?search$/i, '')
    const pctOf = x => Math.round(x.leads.filter(l => l.st === 'confirmed').length / Math.max(1, x.leads.length) * 100), colOf = p => p >= 90 ? '#3DDC97' : p >= 70 ? '#F2B544' : '#FF4D6D'

    // ---------- data ----------
    const prep = x => { const src = Object.fromEntries((x.sources || []).map(s => [s.id, s]))
        return { kind: 'prep', slug: x.slug, name: x.subject, tag: String(x.tagline || ''), read: x.read_on, cost: x.run && x.run.cost_usd,
            agents_run: ((x.run && x.run.agents) || []).map(a => ({ id: a.id, label: a.label, ms: a.ms || 0, cit: a.citations || 0, leads: a.leads || 0 })),
            sources: (x.sources || []).map(s => ({ p: s.publisher || host(s.url), u: s.url, k: s.kind })),
            leads: (x.leads || []).map(l => ({ c: String(l.claim || ''), st: l.status, m: l.model, p: (src[l.source] || {}).publisher || '', u: (src[l.source] || {}).url || '' })),
            ai: (x.agents || []).map(a => ({ n: a.name, w: a.what || '' })), q: (x.questions || []).map(q => typeof q === 'string' ? q : (q && (q.q || q.question || q.text)) || ''), reading: x.reading } }
    let X = [], PT = [], LIVE = []
    try { LIVE = JSON.parse(get(LIVEK) || '[]') } catch { LIVE = [] }
    const all = () => [...LIVE, ...X]
    let AGENTS = null, ask = null
    const loadAsk = () => AGENTS ? Promise.resolve() : import(ASK).then(m => { AGENTS = m.AGENTS; ask = m.ask })

    // ---------- the live search: four agents in parallel, straight to OpenRouter ----------
    const citationsOf = (j, m) => { const out = []
        for (const x of (m.annotations || [])) { const c = x.url_citation || x; if (c && c.url) out.push({ url: c.url, title: c.title || '' }) }
        for (const u of (j.citations || [])) out.push({ url: typeof u === 'string' ? u : u.url, title: (u && u.title) || '' })
        for (const r of (j.search_results || [])) if (r && r.url) out.push({ url: r.url, title: r.title || '' })
        return [...new Map(out.filter(c => /^https?:/.test(c.url)).map(c => [c.url, c])).values()] }
    async function runAgent(id, subject, key, on) { const a = AGENTS[id], t0 = performance.now()
        const body = { model: a.model, messages: [{ role: 'user', content: ask(subject, 'company') }], max_tokens: a.max_tokens || 2500, usage: { include: true } }
        if (a.plugins) body.plugins = a.plugins
        try { const r = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'X-Title': 'RiskMandate X-ray (stand)' }, body: JSON.stringify(body) })
            const j = await r.json().catch(() => ({}))
            if (!r.ok) return on({ id, label: a.label, ms: performance.now() - t0, error: (j.error && j.error.message) || String(r.status) })
            const m = (j.choices && j.choices[0] && j.choices[0].message) || {}, txt = String(m.content || '').replace(/```(?:json)?/g, '')
            let J = null; try { J = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1)) } catch {}
            on({ id, label: a.label, ms: performance.now() - t0, cost: j.usage ? j.usage.cost : null, cites: citationsOf(j, m), J })
        } catch (e) { on({ id, label: a.label, ms: performance.now() - t0, error: String(e && e.message || e) }) } }
    function liveResult(name, res) { const L = [], S = new Map(), AI = new Map(), uses = [], risks = []; let tag = ''
        const addS = (u, m) => { if (u && /^https?:/.test(u) && !S.has(u)) S.set(u, { p: host(u), u, k: m }) }
        for (const r of res) { if (r.error) continue; const J = r.J || {}; (r.cites || []).forEach(c => addS(c.url, r.id))
            if (!tag && J.what_it_does) tag = redact(J.what_it_does)
            for (const f of (J.facts || [])) if (f && f.claim) { L.push({ c: redact(f.claim), st: 'lead', m: r.id, p: host(f.source), u: f.source || '' }); addS(f.source, r.id) }
            for (const g of (J.ai_agents || [])) if (g && g.name) { if (!AI.has(g.name.toLowerCase())) AI.set(g.name.toLowerCase(), { n: redact(g.name), w: redact(g.what_it_does || ''), m: r.id, u: g.source || '' }); L.push({ c: redact(g.name + ': ' + (g.what_it_does || '')), st: 'lead', m: r.id, p: host(g.source), u: g.source || '' }); addS(g.source, r.id) }
            for (const u of (J.use_cases || [])) if (u && u.name) { uses.push({ n: redact(u.name), w: redact(u.who_uses_it || ''), m: r.id }); addS(u.source, r.id) }
            for (const k of (J.incidents_or_risks || [])) if (k && k.what) { risks.push({ n: redact(k.what), w: redact(k.when || ''), m: r.id }); addS(k.source, r.id) } }
        return { kind: 'live', slug: 'live-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name, tag, read: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
            cost: res.reduce((s, r) => s + (r.cost || 0), 0), agents_run: res.map(r => ({ id: r.id, label: r.label, ms: Math.round(r.ms), cit: (r.cites || []).length, leads: r.error ? 0 : L.filter(l => l.m === r.id).length, error: r.error || '' })),
            sources: [...S.values()], leads: L, ai: [...AI.values()], q: [], uses, risks } }

    // ---------- state ----------
    let sub = 'search', cur = null, R = { ph: 'idle' }, F = null, api = null, COST = get(COSTK) === '1', KEY = get(KEYK) || '', LIVERUN = null
    const elapsed = () => performance.now() - (R.t0 || 0)
    const prog = (a, i) => R.ph === 'replay' ? Math.min(1, elapsed() / Math.max(1, a.ms)) : R.ph === 'live' ? (LIVERUN && LIVERUN.done[a.id] ? 1 : Math.min(.95, elapsed() / 25000)) : 1
    function arrived() { if (!cur) return []; if (R.ph === 'live') return []
        if (R.ph !== 'replay') return cur.leads
        const out = []; cur.agents_run.forEach(a => { const mine = cur.leads.filter(l => String(a.label).toLowerCase().includes(String(l.m || '').toLowerCase())), n = Math.floor(mine.length * prog(a)); out.push(...mine.slice(0, n)) }); return out }
    const readDone = () => R.ph === 'reading' ? Math.min(1, elapsed() / 5000) : R.ph === 'replay' || R.ph === 'live' ? 0 : 1
    const isLive = () => cur && cur.kind === 'live'
    const chipSt = (l, rd) => l.st === 'lead' ? '<span class="chip am">PISTA · NÃO REVISTA</span>' : rd < 1 ? '<span class="chip">PISTA</span>' : l.st === 'confirmed' ? '<span class="chip gr">CONFIRMADA NA FONTE</span>' : l.st === 'unverified' ? '<span class="chip am">POR CONFIRMAR</span>' : '<span class="chip r">SEM FONTE</span>'
    const agentsLine = () => { const list = R.ph === 'live' && LIVERUN ? LIVERUN.ids.map(id => ({ id, label: AGENTS[id].label, ms: 0, leads: LIVERUN.done[id] ? LIVERUN.done[id].n : 0, error: LIVERUN.done[id] && LIVERUN.done[id].error })) : cur ? cur.agents_run : []
        return list.map((a, i) => { const p = prog(a, i), live = R.ph === 'live', d = live && LIVERUN.done[a.id]
            const t = a.error ? '✕' : live ? (d ? '✓ ' + a.leads : (elapsed() / 1000).toFixed(1) + ' s') : p < 1 ? (a.ms * p / 1000).toFixed(1) + ' s' : '✓ ' + a.leads
            return `<span class="xa" style="--c:${a.error ? '#FF4D6D' : ACOL[i % 4]}" title="${esc(a.error || '')}"><i style="width:${p * 100}%"></i>${esc(short(a.label))} <b>${t}</b></span>` }).join('')
            + (COST && cur && (cur.cost || R.ph === 'live') ? `<span class="xa" style="--c:#FBE2AE">Custo <b>$${(R.ph === 'live' ? (LIVERUN ? LIVERUN.cost : 0) : (cur.cost || 0) * (R.ph === 'replay' ? Math.min(1, elapsed() / Math.max(1, ...cur.agents_run.map(a => a.ms))) : 1)).toFixed(3)}</b></span>` : '') }

    // ---------- the fan ----------
    const view = { id: 'xr', label: ['X-Ray', 'X-Ray'], icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
      mount(h, A) { api = A; const { ico, Fan } = A; h.innerHTML = '<div class="fan" id="fan-xr"></div>'
        F = Fan(A.$('fan-xr'), { id: 'xr', start: 'leads', orbCol: '#43D9C6', askPh: 'askX',
          top: () => `<form class="xq" id="xq" autocomplete="off"><input id="xin" aria-label="Nome de uma empresa" placeholder="Qualquer empresa da Web Summit…" autocomplete="off" spellcheck="false"><button>▶ X-Ray</button></form><div class="xopt"><span class="team">🔒 Só equipa</span><button type="button" class="tog" id="keyb" aria-expanded="false"><span class="kd" id="kd"></span>Chave</button><button type="button" class="tog sw" id="costb" aria-pressed="${COST}"><i></i>Mostrar custo</button></div><div class="xas" id="xas"></div><div class="sug" id="sug" hidden></div>
<div class="kdlg" id="kdlg" hidden></div>`,
          title: () => cur ? `X-Ray<br><em>${esc(cur.name)}</em>` : R.ph === 'live' ? `X-Ray<br><em>${esc(R.name)}</em>` : 'X-Ray',
          chips: () => R.ph === 'live' ? '<span class="chip am">A PESQUISAR AO VIVO</span>' : R.ph === 'replay' ? '<span class="chip am">A PESQUISAR</span>' : R.ph === 'reading' ? '<span class="chip am">A LER AS FONTES</span>' : !cur ? '' : isLive() ? '<span class="chip am">AO VIVO · NÃO REVISTO</span>' : `<span class="chip gr">${pctOf(cur)}% CONFIRMADO</span>`,
          cards: () => { if (R.ph === 'live' || !cur) return [{ k: 'leads', n: '…', l: 'Pistas', i: 'q' }, { k: 'src', n: '…', l: 'Fontes', i: 'src' }, { k: 'ag', n: '…', l: 'Agentes de IA', i: 'bot' }, { k: 'qs', n: '…', l: 'Perguntas', i: 'team' }]
            const L = arrived(), rd = readDone(), x = cur, frac = L.length / Math.max(1, x.leads.length)
            if (isLive()) return [{ k: 'leads', n: x.leads.length, l: 'Pistas · não revistas', i: 'q' }, { k: 'src', n: x.sources.length, l: 'Fontes citadas', i: 'src' }, { k: 'ag', n: x.ai.length, l: 'Agentes de IA', i: 'bot' }, { k: 'uses', n: x.uses.length, l: 'Casos de uso', i: 'team' }, { k: 'risks', n: x.risks.length, l: 'Incidentes e riscos', i: 'warn' }]
            return [{ k: 'leads', n: L.length, l: 'Pistas', i: 'q' }, { k: 'ok', n: Math.round(L.filter(l => l.st === 'confirmed').length * rd), l: 'Confirmadas na fonte', i: 'ok' }, { k: 'src', n: Math.round(x.sources.length * frac), l: 'Fontes públicas', i: 'src' }, { k: 'ag', n: rd < 1 ? '…' : x.ai.length, l: 'Agentes de IA', i: 'bot' }, { k: 'qs', n: rd < 1 ? '…' : x.q.length, l: 'Perguntas', i: 'team' }] },
          items: k => { if (R.ph === 'live' || !cur) return []; const L = arrived(), rd = readDone(), x = cur, frac = L.length / Math.max(1, x.leads.length)
            if (k === 'ag') return rd < 1 ? [] : x.ai.map(a => ({ name: a.n, chips: `<span class="chip">AGENTE DE IA</span>${a.m ? `<span class="chip">${esc(a.m)}</span>` : ''}`, a }))
            if (k === 'qs') return rd < 1 ? [] : x.q.map(q => ({ name: q.slice(0, 46) + '…', chips: '<span class="chip am">PERGUNTA</span>', q }))
            if (k === 'uses' || k === 'risks') return x[k].map(u => ({ name: u.n.slice(0, 46) + (u.n.length > 46 ? '…' : ''), chips: `<span class="chip ${k === 'risks' ? 'r' : ''}">${k === 'risks' ? 'RISCO' : 'CASO DE USO'}</span><span class="chip">${esc(u.m)}</span>`, u }))
            if (k === 'src') return x.sources.slice(0, isLive() ? 999 : Math.round(x.sources.length * frac)).map(s => ({ name: s.p || host(s.u) || '—', chips: `<span class="chip">${esc(String(s.k || 'fonte').replace(/-/g, ' ').toUpperCase())}</span>`, s }))
            return (k === 'ok' ? (rd < 1 ? [] : L.filter(l => l.st === 'confirmed')) : L).map(l => ({ name: l.c.slice(0, 46) + (l.c.length > 46 ? '…' : ''), chips: `${chipSt(l, rd)}<span class="chip">${esc(l.m)}</span>`, l })) },
          panel: it => panel(it, ico) })
        A.SR.addEventListener('click', onClick); A.SR.addEventListener('input', onInput); A.SR.addEventListener('keydown', onKey)
        A.SR.addEventListener('submit', e => { if (e.target.id !== 'xq') return; e.preventDefault(); const v = $$('xin').value; $$('sug').hidden = true; if (v.trim().length >= 2) go(v) })
        kdot(); setInterval(tick, 200) },
      show(anim) { F.open(anim) }, zoom(k) { F.zoom(k) } }
    const $$ = id => api && api.SR.getElementById(id)
    const kdot = () => { const d = $$('kd'); if (d) d.className = 'kd' + (KEY ? ' on' : '') }
    const linkTo = u => u && /^https?:/.test(u) ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" style="color:var(--teal)">${esc(host(u))} ›</a>` : ''
    function panel(it, ico) {
        if (R.ph === 'live') return `<p class="ph">${ico('xray', 16)}X-Ray · ao vivo</p><h2>${esc(R.name)}</h2><div class="st"><span><em style="color:var(--gold2);border-color:rgba(251,226,174,.5)">AO VIVO</em> os quatro agentes estão a pesquisar agora</span></div><div class="ai"><b>O que está a acontecer</b>Perplexity, OpenAI, Gemini e OpenRouter recebem a mesma pergunta e pesquisam a web em paralelo. Cada um responde em 3 a 25 segundos; as pistas entram no leque quando chegam.</div>`
        if (!cur) return `<p class="ph">${ico('xray', 16)}X-Ray</p><h2>Escreve o nome de uma empresa</h2><div class="ai"><b>Como funciona</b>Quatro agentes de pesquisa respondem em segundos. As empresas já pesquisadas abrem logo, revistas; uma nova é pesquisada ao vivo com a chave deste aparelho.</div>`
        const x = cur, rd = readDone(), ok = x.leads.filter(l => l.st === 'confirmed').length
        const head = `<p class="ph">${ico('xray', 16)}X-Ray · ${isLive() ? 'ao vivo, ' + esc(x.read) : R.ph === 'idle' ? 'lido a ' + esc(x.read) : 'replay'}</p><h2>${esc(x.name)}</h2>`
        if (it && it.l) return head + `<div class="ai"><b>${it.l.st === 'confirmed' && rd >= 1 ? '✓ Confirmada na fonte' : 'Pista de ' + esc(it.l.m) + (it.l.st === 'lead' ? ' · não revista' : '')}</b>${esc(it.l.c)}<span class="note">${esc(it.l.p || '')} ${linkTo(it.l.u)}</span></div>`
        if (it && it.a) return head + `<div class="ai"><b>${esc(it.a.n)}</b>${esc(it.a.w)}<span class="note">${linkTo(it.a.u)}</span></div>`
        if (it && it.u) return head + `<div class="ai"><b>${esc(it.u.n)}</b>${esc(it.u.w)}</div>`
        if (it && it.q) return head + `<div class="ai"><b>Pergunta para lhes fazer</b>${esc(it.q)}</div>`
        if (it && it.s) return head + `<div class="ai"><b>Fonte pública</b>${esc(it.s.p)}<span class="note">${linkTo(it.s.u)}</span></div>`
        if (R.ph === 'replay' || R.ph === 'reading') return head + `<div class="st"><span><em style="color:var(--gold2);border-color:rgba(251,226,174,.5)">REPLAY</em> da pesquisa real de ${esc(x.read)}</span></div><p class="note" style="color:#CFE3DF">${esc(x.tag)}</p><div class="ai"><b>${R.ph === 'replay' ? 'Os quatro agentes, ao seu tempo real' : 'A ler cada fonte'}</b>${R.ph === 'replay' ? arrived().length + ' pistas até agora.' : 'A leitura real demorou ' + Math.max(1, Math.round(((x.reading && x.reading.seconds) || 0) / 60)) + ' min; aqui encurtada.'}</div>`
        const errs = x.agents_run.filter(a => a.error)
        if (isLive()) return head + `<div class="st"><span><em style="color:var(--gold2);border-color:rgba(251,226,174,.5)">NÃO REVISTO</em> pistas dos agentes; fica só neste aparelho</span></div>${x.tag ? `<p class="note" style="color:#CFE3DF">${esc(x.tag)}</p>` : ''}<div class="rate"><div class="t"><span>Pistas, cada uma com a fonte que o agente citou</span>${COST ? '<em>$' + (x.cost || 0).toFixed(3) + ' esta pesquisa</em>' : ''}</div><div class="n"><strong>${x.leads.length}</strong><span class="d" style="color:var(--dim)">${x.sources.length} fontes · ${x.ai.length} agentes de IA</span></div></div>${x.ai[0] ? `<div class="ai"><b>Agente de IA · ${esc(x.ai[0].n)}</b>${esc(x.ai[0].w.slice(0, 180))}</div>` : ''}${errs.length ? `<div class="ai"><b>Não responderam</b>${errs.map(a => esc(short(a.label)) + ': ' + esc(String(a.error).slice(0, 80))).join('<br>')}</div>` : ''}<p class="note">Uma pista é o que um agente disse; só conta como facto depois de lida a fonte (o xray@ revê).</p>${KEY ? '<button type="button" class="xbtn" data-relive="1">↻ Pesquisar outra vez</button>' : ''}`
        return head + `<p class="note" style="color:#CFE3DF">${esc(x.tag)}</p><div class="rate"><div class="t"><span>Pistas confirmadas na fonte</span>${COST && x.cost ? '<em>$' + x.cost.toFixed(2) + ' esta pesquisa</em>' : ''}</div><div class="n"><strong>${pctOf(x)}%</strong><span class="d" style="color:var(--dim)">${ok} / ${x.leads.length}</span></div></div>${x.ai[0] ? `<div class="ai"><b>Agente de IA · ${esc(x.ai[0].n)}</b>${esc(x.ai[0].w.slice(0, 180))}${x.ai[0].w.length > 180 ? '…' : ''}</div>` : ''}<p class="note">Revisto pelo xray@ · <a href="${SITE}xray/${esc(x.slug)}/" target="_blank" rel="noopener" style="color:var(--teal)">a ficha completa ›</a></p>${KEY ? '<button type="button" class="xbtn" data-relive="1">▶ Pesquisar agora ao vivo</button>' : ''}`
    }
    function go(name, forceLive) { const q = String(name).trim(), lq = q.toLowerCase()
        const x = !forceLive && (all().find(y => y.name.toLowerCase() === lq || y.slug === lq) || (q.length > 3 && all().find(y => y.name.toLowerCase().includes(lq))))
        F.st.card = 'leads'; F.st.sel = -1
        if (x) { cur = x; R = x.kind === 'prep' ? { ph: 'replay', t0: performance.now() } : { ph: 'idle' }; $$('xin').value = x.name; F.draw(true); return }
        if (!KEY) { cur = null; R = { ph: 'idle' }; F.draw(true); api.SR.querySelector('.panel').innerHTML = `<p class="ph">X-Ray</p><h2>${esc(q)}</h2><div class="ai"><b>⚠ Falta a chave neste aparelho</b>Para pesquisar uma empresa nova ao vivo, toca em CHAVE e cola a chave descartável da demo. Sem ela, só abrem as empresas já pesquisadas (em EMPRESAS).</div>`; return }
        live(q) }
    async function live(q) { cur = null; R = { ph: 'live', t0: performance.now(), name: q }; F.draw(true)
        try { await loadAsk() } catch (e) { R = { ph: 'idle' }; F.draw(false); api.SR.querySelector('.panel').innerHTML = `<h2>${esc(q)}</h2><div class="ai"><b>Não consegui carregar a pergunta dos agentes</b>${esc(String(e && e.message || e))}</div>`; return }
        const ids = Object.keys(AGENTS), res = [], run = LIVERUN = { ids, done: {}, cost: 0 }
        await Promise.all(ids.map(id => runAgent(id, q, KEY, r => { if (LIVERUN !== run) return; res.push(r); run.cost += r.cost || 0
            const part = liveResult(q, res); run.done[id] = { n: part.leads.filter(l => l.m === id).length, error: r.error }; cur = part; R = { ph: 'live', t0: R.t0, name: q }
            F.draw(false) })))
        if (LIVERUN !== run) return
        const fin = liveResult(q, ids.map(id => res.find(r => r.id === id)).filter(Boolean)); LIVERUN = null; cur = fin; R = { ph: 'idle' }
        if (fin.leads.length) { LIVE = [fin, ...LIVE.filter(y => y.slug !== fin.slug)].slice(0, 30); put(LIVEK, JSON.stringify(LIVE)) }
        F.st.card = 'leads'; F.draw(true) }
    let last = ''
    function tick() { const xas = $$('xas'); if (!xas) return; xas.innerHTML = agentsLine()
        if (R.ph === 'replay' && cur && cur.agents_run.every(a => elapsed() >= a.ms)) R = { ph: 'reading', t0: performance.now() }
        if (R.ph === 'reading' && elapsed() >= 5000) R = { ph: 'idle' }
        if (R.ph === 'live') { const b = api.SR.querySelector('.orbc'); if (b && cur) { /* partial results already drawn on arrival */ } }
        const sig = R.ph + (cur ? cur.slug + arrived().length : '') + Math.round(readDone() * 4); if (sig !== last && R.ph !== 'live') { last = sig; const keep = F.st.sel; F.draw(false); F.st.sel = keep } else if (R.ph === 'live') last = '' }
    function onClick(e) { const t = e.target
        if (t.closest('#keyb')) { const d = $$('kdlg'); d.hidden = !d.hidden; $$('keyb').setAttribute('aria-expanded', String(!d.hidden)); if (!d.hidden) kpaint(); return }
        if (t.closest('#kopen')) { unseal(); return }
        if (t.closest('#ksave')) { const v = $$('kin').value.trim(); $$('kin').value = ''; if (!v) { kmsg('Cola a chave primeiro.', 1); return } KEY = v; put(KEYK, v); kdot(); kpaint('Guardada neste aparelho.'); return }
        if (t.closest('#kdel')) { KEY = ''; put(KEYK, null); kdot(); kpaint('Apagada deste aparelho.'); return }
        if (t.closest('#kmake')) { makeWords(); return }
        if (t.closest('#kcopy')) { const ta = $$('kblob'); ta.select && ta.select(); (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.reject()).then(() => kmsg('Copiado.'), () => { try { document.execCommand('copy'); kmsg('Copiado.') } catch { kmsg('Seleciona e copia à mão.', 1) } }); return }
        if (t.closest('#costb')) { COST = !COST; put(COSTK, COST ? '1' : '0'); $$('costb').setAttribute('aria-pressed', String(COST)); F.draw(false); return }
        if (t.closest('[data-relive]')) { if (cur) go(cur.name, true); return }
        const sb = t.closest('[data-sug]'); if (sb) { $$('xin').value = sb.dataset.sug; $$('sug').hidden = true; go(sb.dataset.sug); return }
        if (!t.closest('.sug, #xin')) { const s = $$('sug'); if (s) s.hidden = true }
        if (!t.closest('.kdlg, #keyb')) { const d = $$('kdlg'); if (d) d.hidden = true } }
    function onInput(e) { if (e.target.id !== 'xin') return; const raw = e.target.value.trim(), q = raw.toLowerCase(), box = $$('sug'); if (!q) { box.hidden = true; return }
        const done = new Map(all().map(x => [x.name.toLowerCase(), x])), names = [...new Map([...all().map(x => ({ l: x.name })), ...PT].map(c => [c.l.toLowerCase(), c])).values()]
        const hit = names.filter(c => c.l.toLowerCase().includes(q)).sort((a, b) => a.l.toLowerCase().indexOf(q) - b.l.toLowerCase().indexOf(q) || a.l.localeCompare(b.l)).slice(0, 8)
        const tagOf = l => { const d = done.get(l.toLowerCase()); return d ? (d.kind === 'live' ? '<em>neste aparelho · não revista</em>' : '<em class="done">✓ já pesquisada</em>') : '<em>pesquisar ao vivo</em>' }
        box.innerHTML = (hit.some(c => c.l.toLowerCase() === q) ? '' : `<button type="button" data-sug="${esc(raw)}">«${esc(raw)}»<em>pesquisar ao vivo</em></button>`) + hit.map(c => `<button type="button" data-sug="${esc(c.l)}">${esc(c.l)}${tagOf(c.l)}</button>`).join('') + `<p class="src">${PT.length ? PT.length + ' empresas da Web Summit, da lista do PrompTugal.news' : 'A lista do PrompTugal.news não respondeu; qualquer nome serve.'}</p>`; box.hidden = false }
    function onKey(e) { if (e.target && e.target.id === 'kwords' && e.key === 'Enter') { e.preventDefault(); unseal(); return } if (e.key === 'Escape') { const s = $$('sug'), d = $$('kdlg'); if (s) s.hidden = true; if (d) d.hidden = true } }

    // ---------- three words: seal the key once, open it on any team device ----------
    let SEAL = null
    const b64 = u => btoa(String.fromCharCode(...new Uint8Array(u))), unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    // the team phrase: lower case, spaces around it and doubled spaces ignored; letters, digits and hyphens kept ("web-summit-2026")
    const norm = w => String(w || '').toLowerCase().normalize('NFKC').trim().split(/\s+/).filter(Boolean).join(' ')
    async function aesKey(words, salt, rounds) { const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(norm(words)), 'PBKDF2', false, ['deriveKey'])
        return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: rounds }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']) }
    const kmsg = (m, bad) => { const k = $$('kst'); if (k) { k.textContent = m; k.className = bad ? 'bad' : '' } }
    function kpaint(msg) { const d = $$('kdlg'); if (!d) return
        const paste = `<input type="password" id="kin" placeholder="sk-or-…" autocomplete="off"><div class="kr"><button type="button" id="ksave">Guardar</button></div>`
        d.innerHTML = KEY ? `<b>Chave do OpenRouter</b><p>✓ Este aparelho já tem a chave. Fica só neste browser e vai só para openrouter.ai.</p><div class="kr"><button type="button" id="kdel">Apagar deste aparelho</button></div>${SEAL ? '' : `<details><summary>Fechar a chave com a frase da equipa</summary><p>Escreve a frase da equipa (ou deixa vazio para três palavras ao acaso). O ficheiro fechado vai para o site (data/xray/key.sealed.json); sem a frase não serve para nada.</p><input type="text" id="kphrase" placeholder="a frase da equipa" autocomplete="off" autocapitalize="none" spellcheck="false"><div class="kr"><button type="button" id="kmake">Fechar a chave</button></div><div id="kout"></div></details>`}<small id="kst"></small>`
            : SEAL ? `<b>A frase da equipa</b><p>Escreve a frase da equipa para abrir a chave da demo neste aparelho. Só é preciso uma vez.</p><input type="text" id="kwords" placeholder="a frase da equipa" autocomplete="off" autocapitalize="none" spellcheck="false"><div class="kr"><button type="button" id="kopen">Abrir</button></div><details><summary>Ou colar a chave</summary>${paste}</details><small id="kst"></small>`
            : `<b>Chave do OpenRouter</b><p>Guardada só neste aparelho (no browser). Vai só para openrouter.ai; nunca para o site nem para o repositório. Usa a chave descartável da demo, com orçamento limitado.</p>${paste}<small id="kst"></small>`
        if (msg) kmsg(msg); const f = $$('kwords') || $$('kin'); if (f) f.focus() }
    async function unseal() { const w = $$('kwords'); if (!w || !SEAL) return; const words = w.value; if (norm(words).length < 4) { kmsg('Escreve a frase da equipa.', 1); return }
        kmsg('A abrir…'); try { const k = await aesKey(words, unb64(SEAL.salt), SEAL.rounds || ROUNDS), pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(SEAL.iv) }, k, unb64(SEAL.ct))
            KEY = new TextDecoder().decode(pt); put(KEYK, KEY); w.value = ''; kdot(); kpaint('✓ Aberta. A chave fica neste aparelho.'); setTimeout(() => { const d = $$('kdlg'); if (d) d.hidden = true }, 1200)
        } catch { kmsg('Essa frase não abre a chave. Confirma-a.', 1) } }
    async function makeWords() { if (!KEY) return; kmsg('A fechar…'); try { const own = norm(($$('kphrase') || {}).value || '')
        if (own && own.length < 4) throw new Error('a frase é curta demais')
        let words = own; if (!words) { const list = (await fetch(WORDS).then(r => r.text())).split(/\s+/).filter(Boolean); if (list.length < 2048) throw new Error('lista')
        const pick = () => { const u = new Uint32Array(1); crypto.getRandomValues(u); return list[u[0] % list.length] }; words = [pick(), pick(), pick()].join(' ') }
        const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)), k = await aesKey(words, salt, ROUNDS)
        const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(KEY))
        const blob = JSON.stringify({ v: 1, what: 'the X-Ray demo OpenRouter key, sealed with the team phrase', kdf: 'PBKDF2-SHA-256', rounds: ROUNDS, cipher: 'AES-256-GCM', phrase: own ? 'chosen by the team' : 'three BIP-39 English words (assets/cc/words-en.txt)', made: new Date().toISOString().slice(0, 10), salt: b64(salt), iv: b64(iv), ct: b64(ct) }, null, 1)
        $$('kout').innerHTML = `${own ? '<p>Fechada com a frase da equipa.</p>' : `<p>As três palavras (escreve-as já; não aparecem outra vez):</p><div class="words">${esc(words)}</div>`}<p>O ficheiro fechado, para o site (manda-o ao dashboard@; nunca mandes a frase junto):</p><textarea id="kblob" readonly>${esc(blob)}</textarea><div class="kr"><button type="button" id="kcopy">Copiar o ficheiro</button></div>`; kmsg('')
    } catch (e) { kmsg('Não consegui criar: ' + String(e && e.message || e), 1) } }

    // ---------- the world: sub-menu and the three pages ----------
    const CSS = `html.cc-shell .cc-xray { display: grid; gap: 0; }
.xr-sub { display: flex; gap: 2px; padding: 3px; border-radius: 999px; border: 1px solid rgba(150,230,215,.18); background: rgba(0,0,0,.3); width: max-content; max-width: calc(100% - 32px); margin: 10px auto 0; overflow-x: auto; scrollbar-width: none; }
.xr-sub button { all: unset; cursor: pointer; font: 600 12px "Barlow Condensed", "Arial Narrow", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; color: #8EADA8; white-space: nowrap; } .xr-sub button:hover { color: #EAF6F3; }
.xr-sub button[aria-current="page"] { color: #EAF6F3; background: rgba(67,217,198,.16); box-shadow: inset 0 0 0 1px rgba(67,217,198,.5); } .xr-sub .n { color: #FBE2AE; margin-left: 4px; } .xr-sub button:focus-visible { outline: 2px solid #FBE2AE; }
#xr-stage { min-height: calc(100vh - 110px); } #xr-stage[hidden] { display: none; }
.xr-pane { max-width: 1100px; margin: 18px auto 60px; padding: 0 16px; font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; color: #EAF6F3; }
.xr-pane h2 { margin: 0 0 2px; font: 600 20px "Barlow Condensed", "Arial Narrow", sans-serif; } .xr-pane > p { margin: 0 0 14px; color: #8EADA8; font-size: 14px; } .xr-pane h3 { margin: 22px 0 8px; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.4px; text-transform: uppercase; color: #43D9C6; }
.xr-cos { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 190px), 1fr)); gap: 8px; }
.xr-co { all: unset; cursor: pointer; position: relative; display: grid; grid-template-columns: 1fr auto; gap: 1px 8px; padding: 9px 12px 9px 15px; border-radius: 10px; background: rgba(12,32,32,.85); border: 1px solid color-mix(in srgb, var(--c) 55%, transparent); transition: transform .15s, box-shadow .15s; }
.xr-co::before { content: ""; position: absolute; left: -1px; top: 10px; width: 3px; height: 18px; border-radius: 2px; background: var(--c); box-shadow: 0 0 6px var(--c); }
.xr-co:hover { transform: translateY(-2px); box-shadow: 0 0 12px color-mix(in srgb, var(--c) 30%, transparent); } .xr-co:focus-visible { outline: 2px solid #FBE2AE; } .xr-co b { font: 600 15px "Barlow Condensed", sans-serif; } .xr-co strong { font: 500 15px "Barlow Semi Condensed", sans-serif; color: var(--c); } .xr-co span { grid-column: 1 / -1; color: #8EADA8; font-size: 12.5px; }
.xr-how { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr)); gap: 8px; }
.xr-how div { position: relative; padding: 11px 12px 11px 15px; border-radius: 10px; background: rgba(12,32,32,.85); border: 1px solid color-mix(in srgb, var(--c) 55%, transparent); display: grid; gap: 3px; } .xr-how div::before { content: ""; position: absolute; left: -1px; top: 12px; width: 3px; height: 18px; border-radius: 2px; background: var(--c); box-shadow: 0 0 6px var(--c); }
.xr-how em { font-style: normal; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; color: var(--c); } .xr-how b { font: 600 15px "Barlow Condensed", sans-serif; } .xr-how span { color: #A9C2BE; font-size: 13.5px; }
.xr-note { margin-top: 14px; color: #8EADA8; font-size: 13.5px; } .xr-note b { color: #FBE2AE; font-weight: 600; } .xr-clear { all: unset; cursor: pointer; margin-left: 8px; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #8EADA8; border: 1px solid rgba(150,230,215,.3); border-radius: 999px; padding: 2px 9px; }`
    const GCSS = `#wrap { border-radius: 0 !important; border: 0 !important; min-height: calc(100vh - 110px) !important; } .fan { height: calc(100vh - 110px) !important; min-height: 520px; } .subv, .crumbs, #livepill, .lang, .subr > .pill { display: none !important; }
.xq { position: absolute; left: 16px; top: 8px; z-index: 6; display: flex; gap: 6px; padding: 4px; border-radius: 999px; background: rgba(4,20,20,.85); border: 1px solid rgba(150,230,215,.3); width: min(400px, calc(100% - 32px)); }
.xq input { all: unset; flex: 1; min-width: 0; padding: 5px 12px; font: 500 15px "Barlow Semi Condensed", sans-serif; color: #EAF6F3; } .xq input::placeholder { color: #5F7D79; }
.xq button { all: unset; cursor: pointer; padding: 5px 14px; border-radius: 999px; font: 600 12.5px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); } .xq button:focus-visible, .tog:focus-visible, .sug button:focus-visible, .xbtn:focus-visible { outline: 2px solid #FBE2AE; outline-offset: 2px; }
.xopt { position: absolute; left: 432px; top: 12px; z-index: 6; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; } .team { font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #FBE2AE; padding: 4px 9px; border-radius: 999px; border: 1px solid rgba(251,226,174,.4); }
.tog { all: unset; cursor: pointer; display: inline-flex; gap: 7px; align-items: center; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #8EADA8; padding: 4px 10px 4px 7px; border-radius: 999px; border: 1px solid rgba(150,230,215,.3); background: rgba(0,0,0,.3); }
.sw i { width: 22px; height: 12px; border-radius: 999px; background: rgba(150,230,215,.2); position: relative; } .sw i::after { content: ""; position: absolute; left: 2px; top: 2px; width: 8px; height: 8px; border-radius: 50%; background: #8EADA8; transition: left .2s; } .sw[aria-pressed="true"] { color: #EAF6F3; border-color: rgba(251,226,174,.6); } .sw[aria-pressed="true"] i { background: rgba(251,226,174,.45); } .sw[aria-pressed="true"] i::after { left: 12px; background: #FBE2AE; }
.kd { width: 8px; height: 8px; border-radius: 50%; background: #FF4D6D; box-shadow: 0 0 6px #FF4D6D; } .kd.on { background: #3DDC97; box-shadow: 0 0 6px #3DDC97; }
.xas { position: absolute; left: 16px; top: 50px; z-index: 6; display: flex; gap: 6px; flex-wrap: wrap; width: min(420px, calc(100% - 32px)); }
.xa { position: relative; overflow: hidden; isolation: isolate; font: 500 12px "Barlow Semi Condensed", sans-serif; color: #CFE3DF; padding: 2px 9px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--c) 50%, transparent); background: rgba(0,0,0,.3); } .xa i { position: absolute; left: 0; top: 0; bottom: 0; background: color-mix(in srgb, var(--c) 22%, transparent); z-index: -1; } .xa b { color: var(--c); font-weight: 600; }
.sug { position: absolute; left: 16px; top: 46px; z-index: 9; width: min(400px, calc(100% - 32px)); max-height: 320px; overflow: auto; padding: 6px; border-radius: 12px; background: rgba(4,18,18,.97); border: 1px solid rgba(150,230,215,.3); box-shadow: 0 20px 40px rgba(0,0,0,.6); } .sug[hidden], .kdlg[hidden] { display: none; }
.sug button { all: unset; cursor: pointer; display: flex; justify-content: space-between; gap: 8px; width: 100%; box-sizing: border-box; padding: 6px 9px; border-radius: 8px; font: 500 14px "Barlow Semi Condensed", sans-serif; color: #EAF6F3; } .sug button:hover { background: rgba(67,217,198,.12); } .sug em { font-style: normal; font: 600 10.5px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #8EADA8; white-space: nowrap; } .sug em.done { color: #3DDC97; } .sug .src { margin: 0; padding: 5px 9px 2px; font: 500 11.5px "Barlow Semi Condensed", sans-serif; color: #5F7D79; }
.kdlg { position: absolute; left: 432px; top: 46px; z-index: 9; width: min(320px, calc(100% - 32px)); display: grid; gap: 8px; padding: 14px; border-radius: 14px; background: rgba(4,18,18,.97); border: 1px solid rgba(251,226,174,.45); box-shadow: 0 20px 40px rgba(0,0,0,.6); font: 14px "Barlow Semi Condensed", sans-serif; color: #CFE3DF; } .kdlg b { font: 600 15px "Barlow Condensed", sans-serif; letter-spacing: 1px; text-transform: uppercase; color: #FBE2AE; } .kdlg p { margin: 0; font-size: 13px; color: #8EADA8; }
.kdlg input { all: unset; padding: 7px 10px; border-radius: 8px; border: 1px solid rgba(150,230,215,.3); background: rgba(0,0,0,.35); color: #EAF6F3; font: 500 14px monospace; } .kr { display: flex; gap: 6px; flex-wrap: wrap; } .kr button { all: unset; cursor: pointer; padding: 5px 12px; border-radius: 999px; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; border: 1px solid rgba(150,230,215,.3); color: #CFE3DF; } .kr button:first-child { color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); border: 0; } .kdlg small { color: #3DDC97; font-size: 12.5px; } .kdlg small.bad { color: #FF9AAE; } .kdlg details { font-size: 13px; color: #8EADA8; } .kdlg summary { cursor: pointer; } .kdlg .words { font: 600 20px "Barlow Condensed", sans-serif; letter-spacing: 1px; color: #FBE2AE; text-align: center; padding: 8px; border-radius: 10px; border: 1px dashed rgba(251,226,174,.5); } .kdlg textarea { all: unset; box-sizing: border-box; width: 100%; height: 70px; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(150,230,215,.3); background: rgba(0,0,0,.35); color: #CFE3DF; font: 11px monospace; word-break: break-all; white-space: pre-wrap; overflow: auto; }
.xbtn { all: unset; cursor: pointer; justify-self: start; margin-top: 4px; padding: 6px 14px; border-radius: 999px; font: 600 12.5px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); }
.orbt, .kc, .it b, .panel h2, .ph { font-family: "Barlow Condensed", "Arial Narrow", sans-serif !important; } .panel, .it, .kc small { font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif !important; }
@media (max-width: 900px) { .xopt { left: 16px; top: 50px; } .kdlg { left: 16px; top: 84px; } .xas { top: 84px; } }`
    if (!document.getElementById('xr-css')) { const s = document.createElement('style'); s.id = 'xr-css'; s.textContent = CSS; document.head.appendChild(s) }
    const SUB = () => [['search', 'Pesquisar'], ['cos', 'Empresas', all().length], ['how', 'Como funciona']]
    const navHTML = () => SUB().map(([k, l, n]) => `<button type="button" data-xsub="${k}" ${k === sub ? 'aria-current="page"' : ''}>${l}${n ? `<span class="n">${n}</span>` : ''}</button>`).join('')
    const coCard = x => { const live = x.kind === 'live', p = live ? 0 : pctOf(x), c = live ? '#F2B544' : colOf(p); return `<button type="button" class="xr-co" data-xco="${esc(x.slug)}" style="--c:${c}"><b>${esc(x.name)}</b><strong>${live ? 'não revista' : p + '%'}</strong><span>${x.leads.length} pistas · ${x.ai.length} agentes de IA${live ? ' · ' + esc(x.read) : ''}</span></button>` }
    const PAGES = {
        cos: () => `<section class="xr-pane"><h2>Empresas já pesquisadas</h2><p>Toca numa para abrir o seu X-Ray. A cor é a parte das pistas confirmada na fonte.</p><div class="xr-cos">${[...X].sort((a, b) => a.name.localeCompare(b.name)).map(coCard).join('')}</div>${LIVE.length ? `<h3>Pesquisadas ao vivo neste aparelho · não revistas <button type="button" class="xr-clear" data-xclear="1">limpar</button></h3><div class="xr-cos">${LIVE.map(coCard).join('')}</div>` : ''}</section>`,
        how: () => `<section class="xr-pane"><h2>Como funciona</h2><p>Do nome à ficha, em tempo real.</p><div class="xr-how">${[['Um nome', 'qualquer empresa da Web Summit; por agora só a equipa pesquisa', '#D9B26E'], ['Quatro agentes', 'Perplexity, OpenAI, Gemini e OpenRouter pesquisam a web em paralelo: 3 a 25 s', '#4FD1F5'], ['Pistas a chegar', 'cada resposta entra no leque assim que chega, com a fonte que o agente citou', '#43D9C6'], ['Cada pista à fonte', 'um agente de leitura lê a fonte pública; sem fonte, fica marcada', '#3DDC97'], ['Uma pessoa revê', 'ao vivo fica «não revista» neste aparelho; depois de o xray@ rever, entra em Empresas', '#FF7FB0']].map(([h, s, c], i) => `<div style="--c:${c}"><em>PASSO ${i + 1}</em><b>${h}</b><span>${s}</span></div>`).join('')}</div><p class="xr-note"><b>A chave:</b> descartável, com orçamento limitado, colada em cada aparelho da equipa (CHAVE, ao lado da pesquisa). Fica só no browser desse aparelho e vai só para openrouter.ai.</p></section>`
    }
    let booted = null
    function boot() { if (booted) return booted
        booted = Promise.all([Promise.all(XSLUGS.map(s => getJ(SITE + 'data/xray/' + s + '/xray.json').catch(() => null))), getJ(PTCOS).catch(() => null), loadScript(GRAVITY), getJ(SEALED).catch(() => null)])
            .then(([xs, pt, , sealed]) => { SEAL = sealed && sealed.ct ? sealed : null; X = xs.filter(Boolean).map(prep); PT = ((pt && pt.items) || []).map(i => ({ id: i.id, l: String(i.label || '') })).filter(c => c.l) })
        booted.catch(() => { booted = null }); return booted }
    async function paint() { const root = document.getElementById('cc-xray'); if (!root) return
        root.innerHTML = `<nav class="xr-sub" id="xr-sub" aria-label="X-Ray">${navHTML()}</nav><div id="xr-stage"><p style="padding:24px;color:#8EADA8">A abrir o X-Ray…</p></div><div id="xr-other"></div>`
        try { await boot() } catch (e) { document.getElementById('xr-stage').innerHTML = `<p style="padding:24px;color:#FF9AAE">O X-Ray não abriu agora (${esc(String(e && e.message || e).slice(0, 80))}). Tenta outra vez dentro de um minuto.</p>`; return }
        if (!document.getElementById('cc-xray')) return
        document.getElementById('xr-sub').innerHTML = navHTML()
        const st = document.getElementById('xr-stage'); st.innerHTML = ''; F = null
        await window.Gravity.mount(st, { lang: 'pt', css: GCSS, start: 'xr', strings: { askX: ['Pergunta sobre esta empresa…', 'Ask about this company…'] }, data: { core: { label: 'X-Ray' }, centres: [{ id: 'x', label: 'X-Ray', color: '#43D9C6' }], nodes: X.map(x => ({ id: x.slug, centre: 'x', label: x.name, ok: true })), flows: [], feed: [] }, views: [view], liveLabel: null })
        if (!cur) { cur = X.find(x => x.slug === 'feedzai') || X[0] || null; R = cur ? { ph: 'replay', t0: performance.now() } : { ph: 'idle' } }
        if (F) { const i = $$('xin'); if (i && cur) i.value = cur.name; F.draw(true) }
        show(sub) }
    function show(k) { sub = k; const n = document.getElementById('xr-sub'); if (n) n.innerHTML = navHTML()
        const st = document.getElementById('xr-stage'), o = document.getElementById('xr-other'); if (!st || !o) return
        st.hidden = k !== 'search'; o.innerHTML = k === 'search' ? '' : PAGES[k]()
        if (k === 'search' && F) requestAnimationFrame(() => F.draw(true))
        const v = document.getElementById('cc-view'); if (v) { v.classList.remove('cc-zin'); void v.offsetWidth; v.classList.add('cc-zin') } }
    document.addEventListener('click', e => { const t = e.target; if (!t.closest) return
        const b = t.closest('[data-xsub]'); if (b) { show(b.dataset.xsub); return }
        const c = t.closest('[data-xco]'); if (c) { const x = all().find(y => y.slug === c.dataset.xco); if (!x) return; show('search'); cur = x; R = { ph: 'idle' }; if (F) { const i = $$('xin'); if (i) i.value = x.name; F.st.card = 'leads'; F.st.sel = -1; F.draw(true) } return }
        if (t.closest('[data-xclear]')) { LIVE = []; put(LIVEK, null); if (cur && cur.kind === 'live') cur = X[0] || null; show('cos') } })
    X0.views.xray = { label: 'X-Ray', icon: 'brain', render: () => '<section class="cc-xray" id="cc-xray"></section>', after: paint }
})()
