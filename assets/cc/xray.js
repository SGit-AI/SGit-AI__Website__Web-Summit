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
   - What the search cost is hidden unless "Mostrar custo" is on (Silvio's call).
   - Each search shows A CORRIDA (the orchestrator, the four agents at their times, the collector, the vault) and O ALCANCE
     (the company's AI agents, use cases and what they can reach, gaps in red), after xray@'s run view on /xray/ (Silvio's
     mock, approved 11 November); the fan of leads is one tap away. */
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
            agents_run: ((x.run && x.run.agents) || []).map(a => ({ id: a.id, label: a.label, model: a.model || '', ms: a.ms || 0, cit: a.citations || 0, leads: a.leads || 0 })), at: x.run && x.run.at,
            aiag: (x.agents || []).map(a => ({ id: a.id, n: a.name, w: a.what || '' })),
            ucs: (x.use_cases || []).map(u => ({ id: u.id, n: u.name, agent: u.agent, reach: (u.reach || []).map(r => ({ id: r.id, k: r.kind, w: r.what, src: r.sources || [] })), gap: (u.gap || []).map(g => ({ w: g.what, r: g.reach || [] })), mandate: (u.mandate || []).map(m => m.what), who: u.who || '', controls: (u.controls || []).map(c => c.what), sim: (u.simulation || []).map(t => ({ t: t.t, actor: t.actor, action: t.action, reach: t.reach, inm: !!t.in_mandate, note: t.note || '' })) })),
            sources: (x.sources || []).map(s => ({ id: s.id, p: s.publisher || host(s.url), u: s.url, k: s.kind })),
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
          top: () => '',
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
        A.SR.addEventListener('click', e => { if (e.target.closest('[data-relive]') && cur) go(cur.name, true) })
        setInterval(tick, 200) },
      show(anim) { F.open(anim) }, zoom(k) { F.zoom(k) } }
    const $$ = id => document.getElementById(id)
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
        if (x) { cur = x; R = { ph: 'idle' }; $$('xin').value = x.name; F.draw(true); rvFor(x); return }
        if (!KEY) { cur = null; R = { ph: 'idle' }; F.draw(true); api.SR.querySelector('.panel').innerHTML = `<p class="ph">X-Ray</p><h2>${esc(q)}</h2><div class="ai"><b>⚠ Falta a chave neste aparelho</b>Para pesquisar uma empresa nova ao vivo, toca em CHAVE e escreve a frase da equipa (ou cola a chave). Sem ela, só abrem as empresas já pesquisadas (em EMPRESAS).</div>`; rvNoKey(q); return }
        live(q) }
    async function live(q) { cur = null; R = { ph: 'live', t0: performance.now(), name: q }; F.draw(true)
        try { await loadAsk() } catch (e) { R = { ph: 'idle' }; F.draw(false); api.SR.querySelector('.panel').innerHTML = `<h2>${esc(q)}</h2><div class="ai"><b>Não consegui carregar a pergunta dos agentes</b>${esc(String(e && e.message || e))}</div>`; return }
        const ids = Object.keys(AGENTS), res = [], run = LIVERUN = { ids, done: {}, cost: 0 }; rvStart(q, ids.map(id => ({ id, label: AGENTS[id].label, model: AGENTS[id].model })), 'live')
        await Promise.all(ids.map(id => runAgent(id, q, KEY, r => { if (LIVERUN !== run) return; res.push(r); run.cost += r.cost || 0
            const part = liveResult(q, res); run.done[id] = { n: part.leads.filter(l => l.m === id).length, error: r.error, ms: r.ms, cit: (r.cites || []).length }; cur = part; R = { ph: 'live', t0: R.t0, name: q }
            F.draw(false) })))
        if (LIVERUN !== run) return
        const fin = liveResult(q, ids.map(id => res.find(r => r.id === id)).filter(Boolean)); LIVERUN = null; cur = fin; R = { ph: 'idle' }
        if (fin.leads.length) { LIVE = [fin, ...LIVE.filter(y => y.slug !== fin.slug)].slice(0, 30); put(LIVEK, JSON.stringify(LIVE)) }
        F.st.card = 'leads'; F.draw(true); rvLiveDone(fin) }
    let last = ''
    function tick() { const xas = $$('xas'); if (xas) xas.innerHTML = agentsLine(); if (!F) return
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
        if (t.closest('#costb')) { COST = !COST; put(COSTK, COST ? '1' : '0'); $$('costb').setAttribute('aria-pressed', String(COST)); if (F) F.draw(false); return }
        if (t.closest('[data-xmode]')) { setMode(MODE === 'run' ? 'fan' : 'run'); return }
        const mn = t.closest('[data-min]'); if (mn) { const b = $$('xb-' + mn.dataset.min); b.classList.remove('max'); b.classList.toggle('min'); mn.textContent = b.classList.contains('min') ? '+' : '–'; return }
        const mx = t.closest('[data-max]'); if (mx) { const b = $$('xb-' + mx.dataset.max); b.classList.remove('min'); b.classList.toggle('max'); document.documentElement.classList.toggle('xr-maxed', !!document.querySelector('.xr-box.max')); return }
        const ly = t.closest('[data-lay]'); if (ly) { LAY = ly.dataset.lay; document.querySelectorAll('[data-lay]').forEach(b => b.setAttribute('aria-pressed', String(b === ly))); if (LASTX && RV) rvReach(LASTX, { ...RV, stop: false, relayout: true, instant: true }); return }
        const sc = t.closest('[data-scn]'); if (sc && SCX) { const d = $$('xr-det'); if (d) d.hidden = true; const b = $$('xb-scn'); if (b) b.classList.remove('min'); rvScn(SCX, sc.dataset.scn); return }
        const ab = t.closest('[data-abp]'); if (ab) { ABP = ab.dataset.abp === '1'; document.querySelectorAll('[data-abp]').forEach(b => b.setAttribute('aria-pressed', String(b === ab))); SCN_PLAY(); return }
        if (t.closest('[data-scnplay]')) { SCN_PLAY(); return }
        if (t.closest('[data-xagain]')) { if (cur) { if (cur.kind === 'prep') R = { ph: 'replay', t0: performance.now() }; rvFor(cur, true) } return }
        if (t.closest('[data-relive]')) { if (cur) go(cur.name, true); return }
        const sb = t.closest('[data-sug]'); if (sb) { $$('xin').value = sb.dataset.sug; $$('sug').hidden = true; go(sb.dataset.sug); return }
        if (!t.closest('.sug, #xin')) { const s = $$('sug'); if (s) s.hidden = true }
        if (!t.closest('.kdlg, #keyb')) { const d = $$('kdlg'); if (d) d.hidden = true } }
    function onInput(e) { if (e.target.id !== 'xin') return; const raw = e.target.value.trim(), q = raw.toLowerCase(), box = $$('sug'); if (!q) { box.hidden = true; return }
        const done = new Map(all().map(x => [x.name.toLowerCase(), x])), names = [...new Map([...all().map(x => ({ l: x.name })), ...PT].map(c => [c.l.toLowerCase(), c])).values()]
        const hit = names.filter(c => c.l.toLowerCase().includes(q)).sort((a, b) => a.l.toLowerCase().indexOf(q) - b.l.toLowerCase().indexOf(q) || a.l.localeCompare(b.l)).slice(0, 8)
        const tagOf = l => { const d = done.get(l.toLowerCase()); return d ? (d.kind === 'live' ? '<em>neste aparelho · não revista</em>' : '<em class="done">✓ já pesquisada</em>') : '<em>pesquisar ao vivo</em>' }
        box.innerHTML = (hit.some(c => c.l.toLowerCase() === q) ? '' : `<button type="button" data-sug="${esc(raw)}">«${esc(raw)}»<em>pesquisar ao vivo</em></button>`) + hit.map(c => `<button type="button" data-sug="${esc(c.l)}">${esc(c.l)}${tagOf(c.l)}</button>`).join('') + `<p class="src">${PT.length ? PT.length + ' empresas da Web Summit, da lista do PrompTugal.news' : 'A lista do PrompTugal.news não respondeu; qualquer nome serve.'}</p>`; box.hidden = false }
    function onKey(e) { if (e.target && e.target.id === 'kwords' && e.key === 'Enter') { e.preventDefault(); unseal(); return } if (e.key === 'Escape' && document.querySelector('.xr-box.max')) { document.querySelectorAll('.xr-box.max').forEach(b => b.classList.remove('max')); document.documentElement.classList.remove('xr-maxed'); return } if (e.key === 'Escape') { const s = $$('sug'), d = $$('kdlg'); if (s) s.hidden = true; if (d) d.hidden = true } }

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

    // ---------- A CORRIDA and O ALCANCE: the run view under the search ----------
    const NS = 'http://www.w3.org/2000/svg', KIND = { code: ['#4F9BFF', 'código'], data: ['#FF7FB0', 'dados'], system: ['#F2B544', 'sistemas'], money: ['#3DDC97', 'dinheiro'], people: ['#A58BFF', 'pessoas'], outside: ['#FF9F43', 'mundo exterior'] }
    const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
    const st = (p, x, y, txt, cls, a) => { const t = sv('text', Object.assign({ x, y, class: cls }, a || {}), p); if (a && a.fill) t.style.fill = a.fill; t.textContent = txt; return t }
    let MODE = 'run', RV = null
    function setMode(m) { MODE = m; const r = $$('xr-run'), f = $$('xr-stage'), b = $$('xr-modeb'); if (r) r.hidden = m !== 'run'; if (f) f.hidden = m !== 'fan' || sub !== 'search'; if (b) b.textContent = m === 'run' ? 'Ver as pistas no leque ›' : '‹ A corrida e o alcance'; if (m === 'fan' && F) requestAnimationFrame(() => F.draw(true)) }
    function rvDefs(svg) { const d = sv('defs', {}, svg); d.innerHTML = '<radialGradient id="xr-pg"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#FBE2AE"/><stop offset="1" stop-color="#8a6a32"/></radialGradient><radialGradient id="xr-pt"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#9FF0E4"/><stop offset="1" stop-color="#14665d"/></radialGradient><filter id="xr-gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' }
    function bot(p, x, y, k, col, kind) { const G = sv('g', { transform: `translate(${x} ${y}) scale(${k})` }, p)
        sv('circle', { cx: 0, cy: 0, r: 34, fill: col, 'fill-opacity': .07, stroke: col, 'stroke-opacity': .3 }, G)
        sv('line', { x1: 0, y1: -24, x2: 0, y2: -15, stroke: col, 'stroke-width': 2 }, G); sv('circle', { cx: 0, cy: -26, r: 3.5, fill: col, filter: 'url(#xr-gl)' }, G)
        if (kind === 'orch') sv('path', { d: 'M-11 -17 L-11 -24 L-5.5 -19.5 L0 -26 L5.5 -19.5 L11 -24 L11 -17 Z', fill: '#FBE2AE', stroke: '#D9B26E', 'stroke-width': 1, filter: 'url(#xr-gl)' }, G)
        sv('rect', { x: -17, y: -15, width: 34, height: 24, rx: 8, fill: 'rgba(8,26,26,.95)', stroke: col, 'stroke-width': 2.2 }, G)
        sv('rect', { x: -12, y: -10, width: 24, height: 14, rx: 5, fill: col, 'fill-opacity': .12 }, G)
        for (const ex of [-6, 6]) sv('circle', { cx: ex, cy: -3, r: 3, fill: col, filter: 'url(#xr-gl)' }, G)
        sv('rect', { x: -11, y: 12, width: 22, height: 11, rx: 4, fill: 'rgba(8,26,26,.95)', stroke: col, 'stroke-opacity': .7, 'stroke-width': 1.6 }, G)
        if (kind === 'coll') sv('path', { d: 'M-16 24 L16 24 L11 31 L-11 31 Z', fill: col, 'fill-opacity': .35, stroke: col, 'stroke-width': 1.4 }, G)
        return G }
    const say = h => { const l = $$('xr-log'); if (!l) return; const p = document.createElement('p'); p.innerHTML = h; l.appendChild(p); l.scrollTop = 1e6 }
    const status = (txt, done) => { const s = $$('xr-st'); if (s) { s.className = 'xr-status' + (done ? ' done' : ''); s.querySelector('span').textContent = txt } }
    const rvFor = (x, anim) => rvStart(x.name, x.agents_run.map(a => ({ id: a.id, label: a.label, model: a.model || '' })), x.kind === 'prep' ? (anim ? 'replay' : 'done') : 'saved', x)
    function rvNoKey(q) { if (RV) RV.stop = true; status('Falta a chave · ' + q); const l = $$('xr-log'); if (l) l.innerHTML = ''; say(`<b>${esc(q)}</b>: para pesquisar ao vivo, toca em CHAVE e escreve a frase da equipa.`) }
    function rvStart(name, agents, mode, x) { if (!$$('xr-runsvg')) return; if (RV) RV.stop = true; const V = RV = { stop: false, t0: performance.now(), mode, x, name, run: mode === 'live' ? LIVERUN : null, instant: mode === 'done' || mode === 'saved' }
        $$('xr-log').innerHTML = ''; $$('xr-det').hidden = true; status((mode === 'live' ? 'Ao vivo · a pesquisar ' : V.instant ? 'A abrir ' : 'A pesquisar ') + name); if ($$('xr-scnsvg')) rvScnWait(mode === 'live')
        $$('xr-runsub').textContent = mode === 'replay' || mode === 'done' ? `replay da pesquisa real de ${String(x.read).split('-').reverse().join('/')}${x.at ? ' às ' + String(x.at).slice(11, 16) + ' UTC' : ''}` : mode === 'live' ? 'ao vivo, agora' : 'pesquisada ao vivo neste aparelho · ' + x.read
        const s = $$('xr-runsvg'); s.innerHTML = ''; rvDefs(s)
        const O = [320, 70], C = [320, 450], VA = [320, 548], boxes = [[40, 165], [340, 165], [40, 305], [340, 305]], BW = 260, BH = 108, paths = []
        agents.slice(0, 4).forEach((a, i) => { const [bx, by] = boxes[i], cx0 = bx + BW / 2
            paths.push([sv('path', { d: `M${O[0]} ${O[1] + 30} C ${O[0]} ${by - 40}, ${cx0} ${O[1] + 60}, ${cx0} ${by}`, fill: 'none', stroke: '#FBE2AE', 'stroke-opacity': .35, 'stroke-width': 1.2, 'stroke-dasharray': '4 5' }, s), sv('path', { d: `M${cx0} ${by + BH} C ${cx0} ${C[1] - 40}, ${C[0]} ${by + BH + 40}, ${C[0]} ${C[1] - 30}`, fill: 'none', stroke: ACOL[i], 'stroke-opacity': .25, 'stroke-width': 1.2, 'stroke-dasharray': '4 5' }, s)]) })
        sv('line', { x1: C[0], y1: C[1] + 30, x2: VA[0], y2: VA[1] - 28, stroke: '#FBE2AE', 'stroke-opacity': .4, 'stroke-dasharray': '4 5' }, s)
        const pearl = (x0, y0, r, g, label, sub1) => { const G = sv('g', {}, s); bot(G, x0, y0, 1.15, g === 'xr-pg' ? '#FBE2AE' : '#43D9C6', g === 'xr-pg' ? 'orch' : 'coll'); st(G, x0 + r + 26, y0 - 2, label, 'xr-l', { 'font-size': 22 }); return st(G, x0 + r + 26, y0 + 20, sub1, 'xr-n', { 'font-size': 15 }) }
        pearl(O[0], O[1], 24, 'xr-pg', 'Orquestrador', `manda «${name.length > 22 ? name.slice(0, 21) + '…' : name}» a ${agents.length} agentes`)
        const cT = pearl(C[0], C[1], 22, 'xr-pt', 'Coletor', '0 fontes citadas')
        const VG = sv('g', {}, s); sv('rect', { x: VA[0] - 24, y: VA[1] - 24, width: 48, height: 48, rx: 10, fill: 'rgba(30,24,10,.9)', stroke: '#FBE2AE', 'stroke-width': 2, filter: 'url(#xr-gl)' }, VG); sv('circle', { cx: VA[0], cy: VA[1], r: 12, fill: 'none', stroke: '#FBE2AE', 'stroke-width': 2 }, VG); st(VG, VA[0] + 44, VA[1] - 2, 'Cofre', 'xr-l', { 'font-size': 22 }); const vT = st(VG, VA[0] + 44, VA[1] + 20, '…', 'xr-n', { 'font-size': 15 })
        const cards = agents.slice(0, 4).map((a, i) => { const [bx, by] = boxes[i], G = sv('g', {}, s)
            const rect = sv('rect', { x: bx, y: by, width: BW, height: BH, rx: 12, fill: 'rgba(8,26,26,.92)', stroke: ACOL[i], 'stroke-opacity': .35, 'stroke-width': 1.4 }, G)
            bot(G, bx + 34, by + BH / 2 + 2, .62, ACOL[i]); const ring = sv('circle', { cx: bx + 34, cy: by + BH / 2 + 2, r: 24, fill: 'none', stroke: ACOL[i], 'stroke-width': 2.5, 'stroke-dasharray': '0 200', transform: `rotate(-90 ${bx + 34} ${by + BH / 2 + 2})` }, G)
            st(G, bx + 66, by + 30, a.label, 'xr-l', { 'font-size': 18 }); st(G, bx + 66, by + 49, a.model.length > 30 ? a.model.slice(0, 29) + '…' : a.model, 'xr-s xr-mono', { 'font-size': 12 })
            return { a, i, rect, ring, t1: st(G, bx + 66, by + 74, 'à espera…', 'xr-n', { 'font-size': 15 }), t2: st(G, bx + 66, by + 94, '', 'xr-s', { 'font-size': 13 }), done: false } })
        const dots = []; cards.forEach(c => { for (let k = 0; k < 3; k++) dots.push({ c, k, d: sv('circle', { r: 3, fill: '#FBE2AE', filter: 'url(#xr-gl)', opacity: 0 }, s) }) })
        const rs = $$('xr-reachsvg'); rs.innerHTML = ''; rvDefs(rs); st(rs, 320, 300, 'O alcance aparece quando a pesquisa acabar', 'xr-s', { 'text-anchor': 'middle', 'font-size': 15 }); $$('xr-reachsub').textContent = 'o que os agentes de IA da empresa conseguem alcançar'
        say(`<b>Orquestrador</b>: a mandar «${esc(name)}» aos ${agents.length} agentes de pesquisa.`)
        const res = i => { const a = cards[i].a; if (mode === 'live') { const d = V.run && V.run.done[a.id]; return d ? { done: true, ms: d.ms, cit: d.cit, leads: d.n, error: d.error } : { done: false } }
            const r = x.agents_run.find(y => y.id === a.id) || {}; return mode === 'replay' ? (performance.now() - V.t0 >= r.ms ? { done: true, ...r } : { done: false, ms: r.ms }) : { done: true, ...r } }
        let collected = 0, sealedAt = 0
        const frame = now => { if (V.stop || !s.isConnected) return; const t = V.instant ? 1e7 : now - V.t0
            cards.forEach(c => { const r = res(c.i), p = r.done ? 1 : mode === 'replay' ? Math.min(1, t / Math.max(1, r.ms)) : Math.min(.95, t / 25000); c.ring.setAttribute('stroke-dasharray', `${p * 151} 200`)
                if (!r.done) { c.t1.textContent = (t / 1000).toFixed(1) + ' s'; c.rect.setAttribute('stroke-opacity', .35 + .3 * Math.abs(Math.sin(t / 300))) }
                else if (!c.done) { c.done = true; c.rect.setAttribute('stroke-opacity', r.error ? .9 : .9); if (r.error) { c.rect.setAttribute('stroke', '#FF4D6D'); c.t1.textContent = 'não respondeu'; c.t2.textContent = String(r.error).slice(0, 34); say(`<em>${esc(c.a.label)}</em>: não respondeu (${esc(String(r.error).slice(0, 80))}).`) }
                    else { c.t1.textContent = `${r.cit} fontes · ${(r.ms / 1000).toFixed(1)} s`; c.t2.textContent = `${r.leads} pistas`; paths[c.i][1].setAttribute('stroke-opacity', .8); collected += r.cit || 0; cT.textContent = `${collected} fontes citadas`; say(`<em>${esc(c.a.label)}</em> (${esc(c.a.model)}): ${r.cit} fontes, ${r.leads} pistas, em ${(r.ms / 1000).toFixed(1)} s.`)
                        const ev = ((mode === 'live' ? (cur && cur.leads) : x && x.leads) || []).filter(l => l.m === c.a.id).slice(0, 2); ev.forEach(l => say(`<span class="xr-ev">↳ «${esc(l.c.slice(0, 130))}${l.c.length > 130 ? '…' : ''}» <i>${esc(l.p || host(l.u) || '')}</i></span>`)) } } })
            dots.forEach(o => { const path = o.c.done ? paths[o.c.i][1] : paths[o.c.i][0], L = path.getTotalLength(), u = ((t / 1400) + o.k / 3) % 1; if (sealedAt) { o.d.setAttribute('opacity', 0); return } const pt = path.getPointAtLength(u * L); o.d.setAttribute('cx', pt.x); o.d.setAttribute('cy', pt.y); o.d.setAttribute('opacity', .9); o.d.setAttribute('fill', o.c.done ? ACOL[o.c.i] : '#FBE2AE') })
            if (cards.every(c => c.done) && !sealedAt && mode !== 'live') { sealedAt = t; const xx = V.x
                if (xx.kind === 'prep') { vT.textContent = `${xx.sources.length} fontes seladas`; say(`<b>Coletor</b>: leu as fontes por trás das pistas; ${xx.sources.length} fontes guardadas, ${xx.leads.filter(l => l.st === 'confirmed').length} de ${xx.leads.length} pistas confirmadas.`); say(`<b>Cofre</b>: ${xx.sources.length} fontes seladas. A desenhar o alcance…`) }
                else { vT.textContent = `${xx.sources.length} fontes citadas, por ler`; say(`<b>Coletor</b>: ${xx.leads.length} pistas e ${xx.sources.length} fontes citadas; ficam por ler e rever (xray@).`) }
                setTimeout(() => { if (!V.stop) { rvReach(xx, V); rvScn(xx) } }, V.instant ? 0 : 500) }
            if (mode === 'live' && V.fin && !sealedAt) { sealedAt = t; const xx = V.fin; vT.textContent = `${xx.sources.length} fontes citadas, por ler`; say(`<b>Coletor</b>: ${xx.leads.length} pistas e ${xx.sources.length} fontes citadas; ficam neste aparelho, por ler e rever (xray@).`); setTimeout(() => { if (!V.stop) { rvReach(xx, V); rvScn(xx) } }, 500) }
            requestAnimationFrame(frame) }
        requestAnimationFrame(frame) }
    function rvLiveDone(fin) { if (RV && RV.mode === 'live') RV.fin = fin }
    let LAY = 'radial', LASTX = null
    // where a node goes: level 0 the company, 1 its AI agents, 2 the use cases, 3 what they reach, 4 the sources; f in 0..1 along the level
    function place(level, f) { if (LAY === 'tree') return { x: level === 0 ? 320 : 30 + f * 580, y: [52, 160, 280, 410, 545][level], side: level === 0 ? null : 'b' }
        if (LAY === 'rtl') return { x: [588, 470, 345, 205, 62][level], y: level === 0 ? 300 : 34 + f * 532, side: level === 0 ? null : level === 4 ? 'l' : 'l' }
        const a = -Math.PI / 2 + f * Math.PI * 2, r = [0, 100, 175, 248, 292][level]; return { x: 320 + r * Math.cos(a), y: 300 + r * Math.sin(a), side: level === 0 ? null : Math.cos(a) >= 0 ? 'r' : 'l', a } }
    function rvReach(x, V) { const s = $$('xr-reachsvg'); if (!s) return; LASTX = x; s.innerHTML = ''; rvDefs(s); const cx = 320, cy = 300, inst = V.instant || V.relayout
        const dd = s.querySelector('defs'); dd.insertAdjacentHTML('beforeend', '<radialGradient id="xr-beam" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(320 300) scale(300)"><stop offset="0" stop-color="#43D9C6" stop-opacity=".35"/><stop offset="1" stop-color="#43D9C6" stop-opacity="0"/></radialGradient>')
        if (LAY === 'radial') { const rings = sv('g', { class: 'xr-rings' }, s); for (const r of [100, 175, 248, 292]) sv('circle', { cx, cy, r, class: 'xr-orb' }, rings) }
        else for (let l = 1; l < 5; l++) { const a = place(l, 0), b = place(l, 1); sv('line', { x1: LAY === 'tree' ? 14 : a.x, y1: LAY === 'tree' ? a.y : 18, x2: LAY === 'tree' ? 626 : b.x, y2: LAY === 'tree' ? b.y : 582, class: 'xr-orb' }, s) }
        const beam = LAY === 'radial' && !inst ? sv('path', { d: `M${cx} ${cy} L${cx + 300} ${cy} A300 300 0 0 0 ${cx + 300 * Math.cos(-.55)} ${cy + 300 * Math.sin(-.55)} Z`, fill: 'url(#xr-beam)', class: 'xr-beam' }, s) : null
        const gS = sv('g', {}, s), gE = sv('g', {}, s), gF = sv('g', {}, s), gN = sv('g', {}, s)
        const AG = (x.aiag || x.ai.map((a, i) => ({ id: 'l' + i, n: a.n, w: a.w })))
        const UC = x.ucs || (x.uses || []).map((u, i) => ({ id: 'lu' + i, n: u.n, agent: null, reach: [], gap: [], mandate: [] }))
        const ag = AG.map(a => ({ ...a, ucs: UC.filter(u => u.agent === a.id) })), orphan = UC.filter(u => !AG.some(a => a.id === u.agent))
        if (orphan.length) ag.push({ id: '_', n: x.kind === 'live' ? 'Casos de uso' : 'Outros', w: '', ucs: orphan })
        if (!ag.length) st(s, cx, cy + 80, 'Os agentes não encontraram agentes de IA desta empresa.', 'xr-s', { 'text-anchor': 'middle', 'font-size': 15 })
        const units = a => Math.max(1.5, a.ucs.reduce((k, u) => k + Math.max(1, u.reach.length), 0)), tot = ag.reduce((k, a) => k + units(a), 0) || 1
        const C0 = place(0, 0), later = [], flows = [], reachAt = {}; let f0 = 0
        const edge = (p1, p2, cls, glow) => { const e = sv('path', { d: `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`, class: 'xr-e ' + cls + (inst ? ' on' : ''), pathLength: 1 }, gE); if (!inst) requestAnimationFrame(() => e.classList.add('on')); if (glow) flows.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, col: glow }); return e }
        ag.forEach(a => { const span = units(a) / tot, A = place(1, f0 + span / 2)
            later.push(() => { edge(C0, A, 'ag', '#A58BFF'); rvNode(gN, A.x, A.y, 11, '#6E56CF', a.n, { t: 'Agente de IA', h: a.n, p: a.w, k: '#A58BFF' }, A.side, 13, false, inst) })
            let b0 = f0; a.ucs.forEach(u => { const us = Math.max(1, u.reach.length) / units(a) * span, U = place(2, b0 + us / 2), gaps = new Set(u.gap.flatMap(g => g.r))
                later.push(() => { edge(A, U, 'uc', '#4F9BFF'); rvNode(gN, U.x, U.y, 7, '#2E6FD8', u.n, { t: 'Caso de uso', h: u.n, p: u.mandate[0] ? 'Mandato (ilustrativo): ' + u.mandate[0] : '', k: '#4F9BFF', gap: u.gap[0] && u.gap[0].w, uc: u.id }, U.side, 11.5, false, inst) })
                u.reach.forEach((r, k) => { const P = place(3, b0 + (k + .5) / Math.max(1, u.reach.length) * us), col = (KIND[r.k] || ['#8EADA8'])[0], gp = gaps.has(r.id)
                    if (LAY === 'radial' && k % 2) { const a = Math.atan2(P.y - cy, P.x - cx); P.x = cx + 264 * Math.cos(a); P.y = cy + 264 * Math.sin(a) }
                    reachAt[r.id] = [P, r.src || []]
                    later.push(() => { const e = edge(U, P, gp ? 'gap' : 'rc', gp ? '#FF4D6D' : col); if (!gp) e.style.stroke = col
                        rvNode(gN, P.x, P.y, 9, col, String(r.k || '?')[0].toUpperCase(), { t: 'Alcance · ' + ((KIND[r.k] || [0, r.k])[1]), h: r.w, k: col, gap: gp && (u.gap.find(g => g.r.includes(r.id)) || {}).w }, null, 9, gp, inst) }) })
                b0 += us })
            f0 += span })
        const SRC = (x.sources || []).slice(0, 48), sAt = {}
        SRC.forEach((so, i) => { const P = place(4, (i + .5) / SRC.length); if (so.id) sAt[so.id] = P
            later.push(() => { const g = sv('g', { class: 'xr-src', tabindex: 0, role: 'button', 'aria-label': so.p || host(so.u) }, gS); sv('circle', { cx: P.x, cy: P.y, r: 2.6, class: 'xr-star' }, g); sv('circle', { cx: P.x, cy: P.y, r: 10, fill: 'transparent' }, g)
                const open = () => { const d = $$('xr-det'); d.style.setProperty('--k', '#CFE3DF'); d.innerHTML = `<button type="button" class="x" aria-label="Fechar">✕</button><b>Fonte pública</b><h3>${esc(so.p || host(so.u))}</h3>${so.u ? `<p><a href="${esc(so.u)}" target="_blank" rel="noopener noreferrer" style="color:#43D9C6">${esc(host(so.u))} ›</a></p>` : ''}`; d.hidden = false; d.querySelector('.x').onclick = () => { d.hidden = true } }
                g.addEventListener('click', open); g.addEventListener('keydown', e => { if (e.key === 'Enter') open() }) }) })
        later.push(() => { for (const id in reachAt) { const [P, ss] = reachAt[id]; for (const sid of ss.slice(0, 3)) if (sAt[sid]) { const e = sv('path', { d: `M${P.x} ${P.y} L${sAt[sid].x} ${sAt[sid].y}`, class: 'xr-e cite' + (inst ? ' on' : ''), pathLength: 1 }, gS); if (!inst) requestAnimationFrame(() => e.classList.add('on')) } } })
        const core = sv('g', {}, s); sv('circle', { cx: C0.x, cy: C0.y, r: 40, class: 'xr-pulse' }, core); sv('circle', { cx: C0.x, cy: C0.y, r: 46, fill: 'none', stroke: '#43D9C6', 'stroke-opacity': .25 }, core); sv('circle', { cx: C0.x, cy: C0.y, r: 34, fill: 'url(#xr-pt)', filter: 'url(#xr-gl)' }, core)
        st(core, C0.x, C0.y + 5, x.name.length > 14 ? x.name.slice(0, 13) + '…' : x.name, 'xr-l', { 'text-anchor': 'middle', 'font-size': x.name.length > 10 ? 12.5 : 15.5, fill: '#03201C', 'font-weight': 700 })
        const gapsN = UC.reduce((k, u) => k + u.gap.length, 0), reachN = UC.reduce((k, u) => k + u.reach.length, 0)
        if (inst) later.forEach(f => f()); else later.forEach((f, i) => setTimeout(() => { if (!V.stop && s.isConnected) f() }, 55 * i))
        const dots = []; const flowTick = () => { if (V.stop || !s.isConnected || s.dataset.gen !== gen) return
            while (dots.length < Math.min(flows.length, 26)) { const f = flows[Math.floor(Math.random() * flows.length)]; dots.push({ f, u: 0, sp: .004 + Math.random() * .006, d: sv('circle', { r: 2.2, fill: f.col, filter: 'url(#xr-gl)' }, gF) }) }
            for (let i = dots.length - 1; i >= 0; i--) { const o = dots[i]; o.u += o.sp; if (o.u >= 1) { o.d.remove(); dots.splice(i, 1); continue } o.d.setAttribute('cx', o.f.x1 + (o.f.x2 - o.f.x1) * o.u); o.d.setAttribute('cy', o.f.y1 + (o.f.y2 - o.f.y1) * o.u); o.d.setAttribute('opacity', Math.sin(o.u * Math.PI)) }
            requestAnimationFrame(flowTick) }
        const gen = String(Math.random()); s.dataset.gen = gen
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(() => requestAnimationFrame(flowTick), inst ? 0 : 55 * later.length)
        const finish = () => { if (V.stop || !s.isConnected) return; if (beam) beam.classList.add('off')
            if (V.relayout) return
            if (x.kind === 'prep') say(`<b>Alcance</b>: ${AG.length} agentes de IA, ${UC.length} casos de uso, ${reachN} coisas que conseguem alcançar, ${SRC.length} fontes, <span class="xr-bad">${gapsN} falhas</span> entre o que alcançam e o que está autorizado.`)
            else say(`<b>Alcance</b>: ${AG.length} agentes de IA e ${UC.length} casos de uso encontrados; o mapa completo do que alcançam fica depois da leitura das fontes (xray@).`)
            status('Pronto · ' + x.name, true); $$('xr-reachsub').textContent = x.kind === 'prep' ? `${AG.length} agentes de IA · ${reachN} alcances · ${gapsN} falhas · ${SRC.length} fontes` : `${AG.length} agentes de IA · não revisto` }
        if (inst) finish(); else setTimeout(finish, 55 * later.length + 300) }
    function rvNode(p, x0, y0, r, col, label, info, side, fs, gap, inst) { const G = sv('g', { class: 'xr-node' + (inst ? ' on' : ''), tabindex: 0, role: 'button', 'aria-label': info.h }, p); if (!inst) requestAnimationFrame(() => requestAnimationFrame(() => G.classList.add('on')))
        if (gap) sv('circle', { cx: x0, cy: y0, r: r + 6, class: 'xr-gapring' }, G)
        sv('circle', { class: 'core', cx: x0, cy: y0, r, fill: col, 'fill-opacity': .92, stroke: '#04100F', 'stroke-width': 2, filter: 'url(#xr-gl)' }, G)
        if (side == null) st(G, x0, y0 + 3.5, label, 'xr-l', { 'text-anchor': 'middle', 'font-size': fs, fill: '#04100F' })
        else { const max = side === 'b' ? 16 : 22, t = label.length > max ? label.slice(0, max - 1) + '…' : label
            if (side === 'b') st(G, x0, y0 + r + 14, t, 'xr-l xr-halo', { 'text-anchor': 'middle', 'font-size': fs - 1 })
            else st(G, x0 + (side === 'r' ? r + 6 : -r - 6), y0 + 4, t, 'xr-l xr-halo', { 'text-anchor': side === 'r' ? 'start' : 'end', 'font-size': fs }) }
        const open = () => { $$('xr-reachsvg').querySelectorAll('.xr-node.sel').forEach(n => n.classList.remove('sel')); G.classList.add('sel'); const d = $$('xr-det'); d.style.setProperty('--k', info.k); d.innerHTML = `<button type="button" class="x" aria-label="Fechar">✕</button><b>${esc(info.t)}</b><h3>${esc(info.h)}</h3>${info.p ? `<p>${esc(info.p)}</p>` : ''}${info.gap ? `<div class="gapt"><b>Falha</b>${esc(info.gap)}</div>` : ''}${info.uc ? `<p style="margin-top:8px"><button type="button" class="xr-ghost" data-scn="${esc(info.uc)}">Ver este cenário ›</button></p>` : ''}`; d.hidden = false; d.querySelector('.x').onclick = () => { d.hidden = true; G.classList.remove('sel') } }
        G.addEventListener('click', open); G.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }) }

    // ---------- O CENÁRIO: one plausible scenario on top of what exists; the mandate, the reach, the gap, with and without an ABP ----------
    let SCX = null, SCU = null, ABP = false, SCT = null
    function rvScnWait(live) { const s = $$('xr-scnsvg'); if (!s) return; clearTimeout(SCT); s.innerHTML = ''; rvDefs(s); st(s, 320, 300, live ? 'O cenário fica pronto depois da leitura das fontes (xray@)' : 'O cenário aparece quando a pesquisa acabar', 'xr-s', { 'text-anchor': 'middle', 'font-size': 15 }); $$('xr-scnpick').innerHTML = ''; $$('xr-scnsteps').innerHTML = ''; $$('xr-scnsub').textContent = 'mandato · alcance · falha · política' }
    function rvScn(x, ucId) { SCX = x; const ucs = (x.ucs || []).filter(u => u.sim && u.sim.length); if (!ucs.length) { rvScnWait(x.kind === 'live'); return }
        SCU = ucs.find(u => u.id === ucId) || (SCU && ucs.find(u => u.id === SCU.id)) || ucs[0]
        $$('xr-scnpick').innerHTML = ucs.map(u => `<button type="button" class="xr-chip" data-scn="${esc(u.id)}" aria-pressed="${u === SCU}">${esc(u.n.length > 46 ? u.n.slice(0, 45) + '…' : u.n)}</button>`).join('')
        $$('xr-scnsub').textContent = `${ucs.length} cenários · escolhe um`
        drawScn(); }
    function drawScn() { const u = SCU, x = SCX, s = $$('xr-scnsvg'); if (!u || !s) return; clearTimeout(SCT); s.innerHTML = ''; rvDefs(s); const cx = 320, cy = 280, RM = 92, RR = 205
        s.querySelector('defs').insertAdjacentHTML('beforeend', '<pattern id="xr-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#FF4D6D" stroke-opacity=".22" stroke-width="3"/></pattern>')
        sv('circle', { cx, cy, r: RR + 18, fill: 'none', stroke: '#8EADA8', 'stroke-opacity': .25, 'stroke-dasharray': '4 6' }, s)
        sv('circle', { cx, cy, r: RR, fill: 'url(#xr-hatch)', stroke: '#FF4D6D', 'stroke-opacity': .35 }, s)
        sv('circle', { cx, cy, r: RM, fill: 'rgba(30,26,12,.96)', stroke: '#FBE2AE', 'stroke-width': 2, filter: 'url(#xr-gl)' }, s)
        st(s, cx, cy - 34, 'MANDATO', 'xr-l', { 'text-anchor': 'middle', 'font-size': 14, fill: '#FBE2AE', 'letter-spacing': 2 })
        st(s, cx, cy - 16, 'o que lhe pedem', 'xr-s', { 'text-anchor': 'middle', 'font-size': 12 })
        st(s, cx, cy + RM + 30, 'FALHA', 'xr-l', { 'text-anchor': 'middle', 'font-size': 13, fill: '#FF8FA3', 'letter-spacing': 2 }); st(s, cx, cy + RM + 46, 'o que consegue e não lhe pediram', 'xr-s', { 'text-anchor': 'middle', 'font-size': 11.5 })
        st(s, cx, cy - RR - 26, 'ALCANCE · o que consegue fazer', 'xr-l', { 'text-anchor': 'middle', 'font-size': 13, fill: '#CFE3DF', 'letter-spacing': 1.5 })
        const ag = (x.aiag || []).find(a => a.id === u.agent), botG = sv('g', {}, s); bot(botG, cx, cy + 22, .7, '#FBE2AE', 'orch'); st(s, cx, cy + 62, ag ? (ag.n.length > 20 ? ag.n.slice(0, 19) + '…' : ag.n) : 'o agente', 'xr-n', { 'text-anchor': 'middle', 'font-size': 13 })
        const gaps = new Set(u.gap.flatMap(g => g.r)), RP = {}
        u.reach.forEach((r, i) => { const a = -Math.PI / 2 + (i + .5) / u.reach.length * Math.PI * 2, X = cx + RR * Math.cos(a), Y = cy + RR * Math.sin(a), col = (KIND[r.k] || ['#8EADA8'])[0]; RP[r.id] = { X, Y, a, col }
            const g = sv('g', { class: 'xr-node on', tabindex: 0, role: 'button', 'aria-label': r.w }, s); if (gaps.has(r.id)) sv('circle', { cx: X, cy: Y, r: 20, class: 'xr-gapring' }, g)
            sv('circle', { class: 'core', cx: X, cy: Y, r: 14, fill: col, stroke: '#04100F', 'stroke-width': 2, filter: 'url(#xr-gl)' }, g); st(g, X, Y + 4.5, String(r.k || '?')[0].toUpperCase(), 'xr-l', { 'text-anchor': 'middle', 'font-size': 12, fill: '#04100F' })
            const right = Math.cos(a) >= 0, w = r.w.length > 26 ? r.w.slice(0, 25) + '…' : r.w; st(g, X + (Math.abs(Math.cos(a)) < .3 ? 0 : right ? 22 : -22), Y + (Math.abs(Math.cos(a)) < .3 ? (Math.sin(a) < 0 ? -22 : 30) : 4), w, 'xr-s xr-halo', { 'text-anchor': Math.abs(Math.cos(a)) < .3 ? 'middle' : right ? 'start' : 'end', 'font-size': 11.5 })
            const open = () => { const d = $$('xr-scndet'); d.style.setProperty('--k', col); d.innerHTML = `<b>Alcance · ${esc((KIND[r.k] || [0, r.k])[1])}</b>${esc(r.w)}${gaps.has(r.id) ? `<span class="gapt">Falha: ${esc((u.gap.find(q => q.r.includes(r.id)) || {}).w || '')}</span>` : ''}`; d.hidden = false }
            g.addEventListener('click', open); g.addEventListener('keydown', e => { if (e.key === 'Enter') open() }) })
        const trail = sv('g', {}, s), agent = sv('circle', { cx, cy, r: 7, fill: '#FBE2AE', filter: 'url(#xr-gl)' }, s)
        const steps = u.sim, list = $$('xr-scnsteps')
        list.innerHTML = `<div class="xr-scnhead"><div class="xr-mand"><b>Mandato (ilustrativo)</b>${u.mandate.map(m => `<span>${esc(m.replace(/^Illustrative:\s*/i, ''))}</span>`).join('')}</div>${u.who ? `<p class="xr-who">${esc(u.who.slice(0, 220))}${u.who.length > 220 ? '…' : ''}</p>` : ''}</div>
<div class="xr-abp"><div class="xr-seg" role="group" aria-label="Política"><button type="button" data-abp="0" aria-pressed="${!ABP}">Sem política</button><button type="button" data-abp="1" aria-pressed="${ABP}">Com política (ABP)</button></div><button type="button" class="xr-play" data-scnplay>▶ Simular</button></div>
<ol class="xr-steps">${steps.map((t, i) => `<li data-i="${i}"><span class="n">${esc(String(t.t || i + 1))}</span><span class="w">${esc(t.action.replace(/\s*\(illustrative\)\s*$/i, ''))}</span><span class="r"></span></li>`).join('')}</ol>
<p class="xr-verdict" id="xr-verdict"></p><p class="xr-abpnote">Uma ABP (política de comportamento do agente) diz, por escrito, o que o agente pode fazer e o que não pode. A RiskMandate mede o alcance e regista as provas; nunca está no caminho das ações: só lê.</p>${x.slug && x.kind === 'prep' ? `<p><a class="xr-ghost" href="${SITE}abp-make/index.html?x=${encodeURIComponent(x.slug)}&uc=${encodeURIComponent(u.id)}" target="_blank" rel="noopener">Faz a ABP deste agente ›</a></p>` : ''}`
        $$('xr-scndet').hidden = true
        let i = -1; const play = () => { i++; trail.innerHTML = trail.innerHTML; const lis = list.querySelectorAll('.xr-steps li'); lis.forEach(l => l.classList.remove('cur'))
            if (i >= steps.length) { const out = steps.filter(t => !t.inm).length; $$('xr-verdict').innerHTML = ABP ? `<b class="ok">Com a ABP:</b> as ${out} ações fora do mandato ficaram assinaladas, cada uma com a sua prova.` : `<b class="bad">Sem política:</b> ${out} ações fora do mandato aconteceram e ninguém as viu.`; agent.setAttribute('cx', cx); agent.setAttribute('cy', cy); return }
            const t = steps[i], P = RP[t.reach], li = lis[i]; li.classList.add('cur'); li.scrollIntoView({ block: 'nearest' })
            const a = P ? P.a : -Math.PI / 2 + i, tx = t.inm ? cx + 58 * Math.cos(a) : (P ? P.X : cx + RR * Math.cos(a)), ty = t.inm ? cy + 58 * Math.sin(a) : (P ? P.Y : cy + RR * Math.sin(a))
            const col = t.inm ? '#3DDC97' : ABP ? '#F2B544' : '#FF4D6D'
            const ln = sv('path', { d: `M${cx} ${cy} L${tx} ${ty}`, class: 'xr-e on', pathLength: 1, style: `stroke:${col};stroke-width:2.2;stroke-opacity:.9` }, trail)
            agent.setAttribute('cx', tx); agent.setAttribute('cy', ty); agent.setAttribute('fill', col)
            if (!t.inm && ABP) { const fl = sv('g', {}, trail); sv('circle', { cx: tx, cy: ty, r: 24, fill: 'none', stroke: '#F2B544', 'stroke-width': 2.5, class: 'xr-flag' }, fl); st(fl, tx, ty - 28, '⚑ assinalado', 'xr-l', { 'text-anchor': 'middle', 'font-size': 12, fill: '#F2B544' }) }
            li.querySelector('.r').innerHTML = t.inm ? '<em class="in">✓ dentro do mandato</em>' : ABP ? `<em class="flag">⚑ fora do mandato · assinalado</em>${t.note ? `<small>${esc(t.note)}</small>` : ''}` : '<em class="out">✕ fora do mandato · ninguém viu</em>'
            li.classList.add(t.inm ? 'in' : ABP ? 'flag' : 'out')
            SCT = setTimeout(play, matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1700) }
        SCN_PLAY = () => { clearTimeout(SCT); i = -1; trail.innerHTML = ''; $$('xr-verdict').innerHTML = ''; list.querySelectorAll('.xr-steps li').forEach(l => { l.className = ''; l.querySelector('.r').innerHTML = '' }); play() } }
    let SCN_PLAY = () => {}

    // ---------- the world: sub-menu and the three pages ----------
    const CSS = `html.cc-shell .cc-xray { display: grid; gap: 0; position: relative; isolation: isolate; } .cc-xray > *:not(.xr-sky) { position: relative; z-index: 1; } .cc-xray > .xr-top { z-index: 20; } .cc-xray > .xr-sub { z-index: 21; }
.xr-sky { position: fixed; inset: 0; z-index: 0; pointer-events: none; display: block; background: radial-gradient(1300px 900px at 22% 40%, #0F3A35 0%, #0A2522 38%, #061412 68%, #040D0C 100%); }
.cc-xray .xr-top { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; max-width: 1440px; margin: 12px auto 0; padding: 0 16px; width: 100%; box-sizing: border-box; font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; color: #EAF6F3; }
.cc-xray .xr-qw { position: relative; width: min(400px, 100%); } .cc-xray .xr-ow { position: relative; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.cc-xray .xq { display: flex; gap: 6px; padding: 4px; border-radius: 999px; background: rgba(4,20,20,.85); border: 1px solid rgba(150,230,215,.3); }
.cc-xray .xq input { all: unset; flex: 1; min-width: 0; padding: 5px 12px; font: 500 15px "Barlow Semi Condensed", sans-serif; color: #EAF6F3; } .cc-xray .xq input::placeholder { color: #5F7D79; }
.cc-xray .xq button { all: unset; cursor: pointer; padding: 5px 14px; border-radius: 999px; font: 600 12.5px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); }
.cc-xray .xq button:focus-visible, .cc-xray .tog:focus-visible, .cc-xray .sug button:focus-visible, .cc-xray .xr-ghost:focus-visible, .cc-xray .xr-node:focus-visible { outline: 2px solid #FBE2AE; outline-offset: 2px; }
.cc-xray .team { font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #FBE2AE; padding: 4px 9px; border-radius: 999px; border: 1px solid rgba(251,226,174,.4); }
.cc-xray .tog { all: unset; cursor: pointer; display: inline-flex; gap: 7px; align-items: center; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #8EADA8; padding: 4px 10px 4px 7px; border-radius: 999px; border: 1px solid rgba(150,230,215,.3); background: rgba(0,0,0,.3); }
.cc-xray .sw i { width: 22px; height: 12px; border-radius: 999px; background: rgba(150,230,215,.2); position: relative; } .cc-xray .sw i::after { content: ""; position: absolute; left: 2px; top: 2px; width: 8px; height: 8px; border-radius: 50%; background: #8EADA8; transition: left .2s; } .cc-xray .sw[aria-pressed="true"] { color: #EAF6F3; border-color: rgba(251,226,174,.6); } .cc-xray .sw[aria-pressed="true"] i { background: rgba(251,226,174,.45); } .cc-xray .sw[aria-pressed="true"] i::after { left: 12px; background: #FBE2AE; }
.cc-xray .kd { width: 8px; height: 8px; border-radius: 50%; background: #FF4D6D; box-shadow: 0 0 6px #FF4D6D; } .cc-xray .kd.on { background: #3DDC97; box-shadow: 0 0 6px #3DDC97; }
.cc-xray .xas { display: flex; gap: 6px; flex-wrap: wrap; } .cc-xray .xa { position: relative; overflow: hidden; isolation: isolate; font: 500 12px "Barlow Semi Condensed", sans-serif; color: #CFE3DF; padding: 2px 9px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--c) 50%, transparent); background: rgba(0,0,0,.3); } .cc-xray .xa i { position: absolute; left: 0; top: 0; bottom: 0; background: color-mix(in srgb, var(--c) 22%, transparent); z-index: -1; } .cc-xray .xa b { color: var(--c); font-weight: 600; }
.cc-xray .sug { position: absolute; left: 0; top: calc(100% + 6px); z-index: 30; width: 100%; max-height: 320px; overflow: auto; padding: 6px; border-radius: 12px; background: rgba(4,18,18,.97); border: 1px solid rgba(150,230,215,.3); box-shadow: 0 20px 40px rgba(0,0,0,.6); box-sizing: border-box; } .cc-xray .sug[hidden], .cc-xray .kdlg[hidden], .cc-xray .xr-det[hidden], .cc-xray [hidden] { display: none !important; }
.cc-xray .sug button { all: unset; cursor: pointer; display: flex; justify-content: space-between; gap: 8px; width: 100%; box-sizing: border-box; padding: 6px 9px; border-radius: 8px; font: 500 14px "Barlow Semi Condensed", sans-serif; color: #EAF6F3; } .cc-xray .sug button:hover { background: rgba(67,217,198,.12); } .cc-xray .sug em { font-style: normal; font: 600 10.5px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #8EADA8; white-space: nowrap; } .cc-xray .sug em.done { color: #3DDC97; } .cc-xray .sug .src { margin: 0; padding: 5px 9px 2px; font: 500 11.5px "Barlow Semi Condensed", sans-serif; color: #5F7D79; }
.cc-xray .kdlg { position: absolute; left: 0; top: calc(100% + 8px); z-index: 30; width: min(320px, calc(100vw - 32px)); display: grid; gap: 8px; padding: 14px; border-radius: 14px; background: rgba(4,18,18,.97); border: 1px solid rgba(251,226,174,.45); box-shadow: 0 20px 40px rgba(0,0,0,.6); font: 14px "Barlow Semi Condensed", sans-serif; color: #CFE3DF; box-sizing: border-box; } .cc-xray .kdlg b { font: 600 15px "Barlow Condensed", sans-serif; letter-spacing: 1px; text-transform: uppercase; color: #FBE2AE; } .cc-xray .kdlg p { margin: 0; font-size: 13px; color: #8EADA8; }
.cc-xray .kdlg input { all: unset; padding: 7px 10px; border-radius: 8px; border: 1px solid rgba(150,230,215,.3); background: rgba(0,0,0,.35); color: #EAF6F3; font: 500 14px monospace; } .cc-xray .kr { display: flex; gap: 6px; flex-wrap: wrap; } .cc-xray .kr button { all: unset; cursor: pointer; padding: 5px 12px; border-radius: 999px; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; border: 1px solid rgba(150,230,215,.3); color: #CFE3DF; } .cc-xray .kr button:first-child { color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); border: 0; } .cc-xray .kdlg small { color: #3DDC97; font-size: 12.5px; } .cc-xray .kdlg small.bad { color: #FF9AAE; } .cc-xray .kdlg details { font-size: 13px; color: #8EADA8; } .cc-xray .kdlg summary { cursor: pointer; } .cc-xray .kdlg .words { font: 600 20px "Barlow Condensed", sans-serif; letter-spacing: 1px; color: #FBE2AE; text-align: center; padding: 8px; border-radius: 10px; border: 1px dashed rgba(251,226,174,.5); } .cc-xray .kdlg textarea { all: unset; box-sizing: border-box; width: 100%; height: 70px; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(150,230,215,.3); background: rgba(0,0,0,.35); color: #CFE3DF; font: 11px monospace; word-break: break-all; white-space: pre-wrap; overflow: auto; }
.cc-xray .xr-status { display: flex; align-items: center; gap: 8px; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.4px; text-transform: uppercase; color: #FBE2AE; } .cc-xray .xr-status i { width: 8px; height: 8px; border-radius: 50%; background: #FBE2AE; box-shadow: 0 0 8px #FBE2AE; animation: xrblink 1.2s infinite; } .cc-xray .xr-status.done, .cc-xray .xr-status.done i { color: #3DDC97; } .cc-xray .xr-status.done i { background: #3DDC97; box-shadow: 0 0 8px #3DDC97; animation: none; } @keyframes xrblink { 50% { opacity: .3 } }
.cc-xray .xr-ghost { all: unset; cursor: pointer; padding: 5px 13px; border-radius: 999px; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #CFE3DF; border: 1px solid rgba(150,230,215,.3); white-space: nowrap; } .cc-xray .xr-ghost:hover { color: #fff; border-color: rgba(251,226,174,.5); }
#xr-run { max-width: 1440px; margin: 12px auto 60px; padding: 0 16px; display: grid; gap: 14px; box-sizing: border-box; width: 100%; font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; color: #EAF6F3; }
#xr-run .xr-stages { display: flex; gap: 14px; align-items: flex-start; }
#xr-run .xr-box { flex: 1 1 0; min-width: 0; transition: flex .35s ease; } #xr-run #xb-reach { flex-grow: 1.15; } #xr-run .xr-box.min { flex: 0 0 210px; } #xr-run .xr-box.min > :not(h2) { display: none !important; } #xr-run .xr-box.min > h2 small { display: none; }
#xr-run .xr-box.max { position: fixed; z-index: 80; left: 12px; right: 12px; top: 64px; bottom: 12px; overflow: auto; background: rgba(6,20,19,.98); } #xr-run .xr-box.max > svg { max-height: calc(100vh - 170px); width: auto; max-width: 100%; margin: 0 auto; }
#xr-run .xr-tools { display: inline-flex; gap: 4px; margin-left: 8px; } #xr-run .xr-box > h2 small + .xr-tools { margin-left: 8px; } #xr-run .xr-tb { all: unset; cursor: pointer; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 7px; border: 1px solid rgba(150,230,215,.25); color: #CFE3DF; font: 600 13px "Barlow Semi Condensed", sans-serif; } #xr-run .xr-tb:hover { border-color: var(--c); color: #fff; } #xr-run .xr-tb:focus-visible { outline: 2px solid #FBE2AE; }
#xr-run .xr-lay, #xr-run .xr-seg { display: inline-flex; gap: 2px; padding: 3px; border-radius: 999px; border: 1px solid rgba(150,230,215,.18); background: rgba(0,0,0,.3); margin: 8px 12px 0; } #xr-run .xr-lay button, #xr-run .xr-seg button { all: unset; cursor: pointer; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; color: #8EADA8; } #xr-run .xr-lay button[aria-pressed="true"], #xr-run .xr-seg button[aria-pressed="true"] { color: #EAF6F3; background: rgba(67,217,198,.16); box-shadow: inset 0 0 0 1px rgba(67,217,198,.5); }
#xr-run .xr-beam.off { opacity: 0; transition: opacity 1.2s; }
#xr-run .xr-pick { display: flex; gap: 6px; flex-wrap: wrap; padding: 10px 12px 0; } #xr-run .xr-chip { all: unset; cursor: pointer; font: 500 12.5px "Barlow Semi Condensed", sans-serif; color: #CFE3DF; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(255,127,176,.35); background: rgba(0,0,0,.25); } #xr-run .xr-chip[aria-pressed="true"] { color: #10170F; background: linear-gradient(180deg, #FFB3D0, #FF7FB0); border-color: transparent; } #xr-run .xr-chip:focus-visible, #xr-run .xr-play:focus-visible { outline: 2px solid #FBE2AE; outline-offset: 2px; }
#xr-run .xr-scnbody { padding: 0 14px 14px; font-size: 13.5px; color: #CFE3DF; } #xr-run .xr-mand { display: grid; gap: 4px; padding: 9px 11px; border-radius: 10px; border: 1px solid rgba(251,226,174,.45); background: rgba(40,32,12,.5); } #xr-run .xr-mand b { font: 600 11.5px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #FBE2AE; } #xr-run .xr-who { margin: 6px 0 0; color: #8EADA8; font-size: 12.5px; }
#xr-run .xr-abp { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 10px 0 4px; } #xr-run .xr-abp .xr-seg { margin: 0; } #xr-run .xr-play { all: unset; cursor: pointer; padding: 5px 14px; border-radius: 999px; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); }
#xr-run .xr-steps { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 4px; max-height: 260px; overflow: auto; } #xr-run .xr-steps li { display: grid; grid-template-columns: 22px 1fr; gap: 2px 8px; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(150,230,215,.08); } #xr-run .xr-steps li .n { color: #5F7D79; font-weight: 600; } #xr-run .xr-steps li .r { grid-column: 2; } #xr-run .xr-steps li.cur { border-color: rgba(251,226,174,.6); background: rgba(251,226,174,.06); }
#xr-run .xr-steps em { font-style: normal; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.1px; text-transform: uppercase; } #xr-run .xr-steps em.in { color: #3DDC97; } #xr-run .xr-steps em.out { color: #FF8FA3; } #xr-run .xr-steps em.flag { color: #F2B544; } #xr-run .xr-steps small { display: block; color: #E8D3A4; font-size: 12.5px; margin-top: 2px; }
#xr-run .xr-verdict { margin: 10px 0 0; font-size: 14px; } #xr-run .xr-verdict b.ok { color: #F2B544; } #xr-run .xr-verdict b.bad { color: #FF8FA3; } #xr-run .xr-abpnote { margin: 8px 0; color: #5F7D79; font-size: 12px; }
#xr-run .xr-scndet { margin: 0 14px 10px; padding: 9px 11px; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--k, #FBE2AE) 55%, transparent); background: rgba(4,18,18,.9); font-size: 13px; color: #CFE3DF; } #xr-run .xr-scndet b { display: block; font: 600 11.5px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: var(--k); } #xr-run .xr-scndet .gapt { display: block; margin-top: 6px; color: #FFC2CD; }
#xr-run .xr-flag { transform-box: fill-box; transform-origin: center; animation: xrring 1.6s ease-out infinite; } #xr-run .xr-ev { color: #A9C2BE; } #xr-run .xr-ev i { color: #5F7D79; font-style: normal; }
html.xr-maxed .cc-top { z-index: 90; }
#xr-run .xr-box { position: relative; border-radius: 14px; background: rgba(10,28,28,.72); border: 1px solid color-mix(in srgb, var(--c) 50%, transparent); box-shadow: 0 0 8px color-mix(in srgb, var(--c) 16%, transparent), 0 14px 30px rgba(0,0,0,.35); overflow: hidden; }
#xr-run .xr-box > h2 { margin: 0; display: flex; align-items: center; gap: 10px; padding: 10px 14px 8px 18px; font: 600 12.5px "Barlow Condensed", sans-serif; letter-spacing: 1.5px; text-transform: uppercase; color: var(--c); border-bottom: 1px solid color-mix(in srgb, var(--c) 22%, transparent); }
#xr-run .xr-box > h2::before { content: ""; position: absolute; left: -1px; top: 11px; width: 3px; height: 16px; border-radius: 2px; background: var(--c); box-shadow: 0 0 8px var(--c); } #xr-run .xr-box > h2 small { color: #8EADA8; font: 500 12.5px "Barlow Semi Condensed", sans-serif; letter-spacing: 0; text-transform: none; margin-left: auto; text-align: right; }
#xr-run svg { display: block; width: 100%; height: auto; } #xr-run .xr-l { font-family: "Barlow Condensed", sans-serif; font-weight: 600; fill: #EAF6F3; } #xr-run .xr-s { font-family: "Barlow Semi Condensed", sans-serif; fill: #8EADA8; } #xr-run .xr-mono { font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; } #xr-run .xr-n { font-family: "Barlow Semi Condensed", sans-serif; fill: #FBE2AE; font-weight: 600; }
#xr-run .xr-node { cursor: pointer; opacity: 0; transform: scale(.2); transform-box: fill-box; transform-origin: center; transition: opacity .5s, transform .6s cubic-bezier(.3, 1.5, .5, 1); outline: none; } #xr-run .xr-node.on { opacity: 1; transform: none; }
#xr-run .xr-node.sel .core, #xr-run .xr-node:focus-visible .core { stroke: #fff; stroke-width: 2.5; }
#xr-run .xr-orb { fill: none; stroke: rgba(150,230,215,.09); stroke-dasharray: 3 7; } #xr-run .xr-rings { transform-origin: 320px 300px; animation: xrspin 90s linear infinite; }
#xr-run .xr-beam { transform-origin: 320px 300px; animation: xrspin 7s linear infinite; }
#xr-run .xr-e { fill: none; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .8s ease-out; } #xr-run .xr-e.on { stroke-dashoffset: 0; }
#xr-run .xr-e.ag { stroke: #A58BFF; stroke-opacity: .6; stroke-width: 1.6; } #xr-run .xr-e.uc { stroke: #4F9BFF; stroke-opacity: .5; stroke-width: 1.3; } #xr-run .xr-e.rc { stroke-opacity: .45; stroke-width: 1.1; } #xr-run .xr-e.gap { stroke: #FF4D6D; stroke-opacity: .85; stroke-width: 1.8; } #xr-run .xr-e.cite { stroke: #8EADA8; stroke-opacity: .16; stroke-width: .7; }
#xr-run .xr-gapring { fill: none; stroke: #FF4D6D; stroke-width: 1.8; stroke-dasharray: 4 3; transform-box: fill-box; transform-origin: center; animation: xrspin 6s linear infinite; }
#xr-run .xr-pulse { fill: none; stroke: #43D9C6; stroke-width: 2; transform-box: fill-box; transform-origin: center; animation: xrring 2.4s ease-out infinite; }
#xr-run .xr-star { fill: #CFE3DF; filter: drop-shadow(0 0 3px #CFE3DF); } #xr-run .xr-src { cursor: pointer; animation: xrtw 3s ease-in-out infinite; } #xr-run .xr-src:nth-child(3n) { animation-delay: -1s; } #xr-run .xr-src:nth-child(3n+1) { animation-delay: -2s; }
#xr-run .xr-halo { paint-order: stroke; stroke: #04100F; stroke-width: 3px; stroke-linejoin: round; }
@keyframes xrspin { to { transform: rotate(360deg) } } @keyframes xrring { 0% { transform: scale(1); opacity: .8 } 100% { transform: scale(1.9); opacity: 0 } } @keyframes xrtw { 50% { opacity: .45 } }
@media (prefers-reduced-motion: reduce) { #xr-run .xr-rings, #xr-run .xr-beam, #xr-run .xr-gapring, #xr-run .xr-pulse, #xr-run .xr-src { animation: none; } #xr-run .xr-node { transition: none; } }
#xr-run .xr-node:hover .core { filter: brightness(1.3); } #xr-run .xr-node:hover .core { filter: brightness(1.3); }
#xr-run .xr-legend { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; padding: 0 12px 12px; } #xr-run .xr-legend span { font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--k) 55%, transparent); color: var(--k); background: color-mix(in srgb, var(--k) 10%, transparent); }
#xr-run .xr-det { position: absolute; right: 12px; top: 48px; width: min(320px, calc(100% - 24px)); padding: 12px 14px; border-radius: 12px; background: rgba(4,18,18,.96); border: 1px solid color-mix(in srgb, var(--k, #FBE2AE) 55%, transparent); box-shadow: 0 20px 40px rgba(0,0,0,.6); font-size: 13.5px; color: #CFE3DF; box-sizing: border-box; } #xr-run .xr-det b { display: block; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: var(--k, #FBE2AE); margin-bottom: 4px; } #xr-run .xr-det h3 { margin: 0 0 6px; font: 600 16px "Barlow Condensed", sans-serif; color: #EAF6F3; } #xr-run .xr-det p { margin: 0; } #xr-run .xr-det .gapt { margin-top: 8px; padding: 7px 9px; border-radius: 8px; border: 1px solid rgba(255,77,109,.5); color: #FFC2CD; } #xr-run .xr-det .gapt b { color: #FF8FA3; } #xr-run .xr-det .x { all: unset; cursor: pointer; position: absolute; right: 10px; top: 8px; color: #8EADA8; }
#xr-run .xr-log { font: 14px/1.7 "Barlow Semi Condensed", "Arial Narrow", sans-serif; padding: 10px 16px 12px; color: #CFE3DF; min-height: 110px; max-height: 210px; overflow: auto; } #xr-run .xr-log p { margin: 0; } #xr-run .xr-log p::before { content: "› "; color: #43D9C6; } #xr-run .xr-log b { color: #FBE2AE; font-weight: 500; } #xr-run .xr-log em { color: #43D9C6; font-style: normal; } #xr-run .xr-bad { color: #FF8FA3; }
@media (max-width: 1180px) { #xr-run .xr-stages { flex-wrap: wrap; } #xr-run .xr-box { flex: 1 1 100%; } #xr-run #xb-run { flex: 1 1 calc(50% - 7px); } #xr-run #xb-reach { flex: 1 1 calc(50% - 7px); } #xr-run .xr-box.min { flex: 1 1 100%; } }
@media (max-width: 780px) { #xr-run #xb-run, #xr-run #xb-reach { flex: 1 1 100%; } }
.xr-sub { display: flex; gap: 2px; padding: 3px; border-radius: 999px; border: 1px solid rgba(150,230,215,.18); background: rgba(0,0,0,.3); width: max-content; max-width: calc(100% - 32px); margin: 10px auto 0; overflow-x: auto; scrollbar-width: none; }
.xr-sub button { all: unset; cursor: pointer; font: 600 12px "Barlow Condensed", "Arial Narrow", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; color: #8EADA8; white-space: nowrap; } .xr-sub button:hover { color: #EAF6F3; }
.xr-sub button[aria-current="page"] { color: #EAF6F3; background: rgba(67,217,198,.16); box-shadow: inset 0 0 0 1px rgba(67,217,198,.5); } .xr-sub .n { color: #FBE2AE; margin-left: 4px; } .xr-sub button:focus-visible { outline: 2px solid #FBE2AE; }
#xr-stage { min-height: calc(100vh - 160px); } #xr-stage[hidden] { display: none; }
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
    const GCSS = `#wrap { border-radius: 0 !important; border: 0 !important; min-height: calc(100vh - 110px) !important; } .fan { height: calc(100vh - 160px) !important; min-height: 520px; } .subv, .crumbs, #livepill, .lang, .subr > .pill { display: none !important; }
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
    // the sky: the Universe's glow
    // the background: the Universe's deep teal glow, as in the fan (Silvio's picture, 11 November): no stars, no planets
    function sky(root) { const c = document.createElement('div'); c.className = 'xr-sky'; c.setAttribute('aria-hidden', 'true'); root.prepend(c) }
    let booted = null
    function boot() { if (booted) return booted
        booted = Promise.all([Promise.all(XSLUGS.map(s => getJ(SITE + 'data/xray/' + s + '/xray.json').catch(() => null))), getJ(PTCOS).catch(() => null), loadScript(GRAVITY), getJ(SEALED).catch(() => null)])
            .then(([xs, pt, , sealed]) => { SEAL = sealed && sealed.ct ? sealed : null; X = xs.filter(Boolean).map(prep); PT = ((pt && pt.items) || []).map(i => ({ id: i.id, l: String(i.label || '') })).filter(c => c.l) })
        booted.catch(() => { booted = null }); return booted }
    async function paint() { const root = document.getElementById('cc-xray'); if (!root) return
        root.innerHTML = `<nav class="xr-sub" id="xr-sub" aria-label="X-Ray">${navHTML()}</nav>
<div class="xr-top" id="xr-top"><div class="xr-qw"><form class="xq" id="xq" autocomplete="off"><input id="xin" aria-label="Nome de uma empresa" placeholder="Qualquer empresa da Web Summit…" autocomplete="off" spellcheck="false"><button>▶ X-Ray</button></form><div class="sug" id="sug" hidden></div></div>
<div class="xr-ow"><span class="team">🔒 Só equipa</span><button type="button" class="tog" id="keyb" aria-expanded="false"><span class="kd" id="kd"></span>Chave</button><button type="button" class="tog sw" id="costb" aria-pressed="${COST}"><i></i>Mostrar custo</button><div class="kdlg" id="kdlg" hidden></div></div>
<span class="xr-status" id="xr-st"><i></i><span>A abrir</span></span><div class="xas" id="xas"></div><span style="flex:1"></span><button type="button" class="xr-ghost" data-xagain>↻ Ver outra vez</button><button type="button" class="xr-ghost" id="xr-modeb" data-xmode>Ver as pistas no leque ›</button></div>
<div id="xr-run"><div class="xr-stages"><section class="xr-box" id="xb-run" style="--c:#FBE2AE"><h2>A corrida <small id="xr-runsub"></small><span class="xr-tools"><button type="button" class="xr-tb" data-min="run" aria-label="Minimizar">–</button><button type="button" class="xr-tb" data-max="run" aria-label="Ecrã inteiro">⛶</button></span></h2><svg id="xr-runsvg" viewBox="0 0 640 600" role="img" aria-label="A corrida dos agentes de pesquisa"></svg></section>
<section class="xr-box" id="xb-reach" style="--c:#43D9C6"><h2>O alcance <small id="xr-reachsub"></small><span class="xr-tools"><button type="button" class="xr-tb" data-min="reach" aria-label="Minimizar">–</button><button type="button" class="xr-tb" data-max="reach" aria-label="Ecrã inteiro">⛶</button></span></h2><div class="xr-lay" role="group" aria-label="Disposição"><button type="button" data-lay="radial" aria-pressed="true">Radial</button><button type="button" data-lay="tree" aria-pressed="false">Árvore</button><button type="button" data-lay="rtl" aria-pressed="false">Da direita</button></div><svg id="xr-reachsvg" viewBox="0 0 640 600" role="img" aria-label="O mapa do alcance"></svg><div class="xr-legend">${Object.values(KIND).map(([c, l]) => `<span style="--k:${c}">${l}</span>`).join('')}<span style="--k:#FF4D6D">falha</span></div><div class="xr-det" id="xr-det" hidden></div></section>
<section class="xr-box" id="xb-scn" style="--c:#FF7FB0"><h2>O cenário <small id="xr-scnsub"></small><span class="xr-tools"><button type="button" class="xr-tb" data-min="scn" aria-label="Minimizar">–</button><button type="button" class="xr-tb" data-max="scn" aria-label="Ecrã inteiro">⛶</button></span></h2><div class="xr-pick" id="xr-scnpick"></div><svg id="xr-scnsvg" viewBox="0 0 640 560" role="img" aria-label="O cenário: o mandato, o alcance e a falha"></svg><div class="xr-scndet" id="xr-scndet" hidden></div><div class="xr-scnbody" id="xr-scnsteps"></div></section></div>
<section class="xr-box" style="--c:#4FD1F5"><h2>O que aconteceu <small>passo a passo</small></h2><div class="xr-log" id="xr-log"></div></section></div>
<div id="xr-stage" hidden><p style="padding:24px;color:#8EADA8">A abrir o X-Ray…</p></div><div id="xr-other"></div>`
        sky(root); root.addEventListener('click', onClick); root.addEventListener('input', onInput); root.addEventListener('keydown', onKey)
        root.addEventListener('submit', e => { if (e.target.id !== 'xq') return; e.preventDefault(); const v = $$('xin').value; $$('sug').hidden = true; if (v.trim().length >= 2) go(v) })
        kdot()
        try { await boot() } catch (e) { document.getElementById('xr-stage').innerHTML = `<p style="padding:24px;color:#FF9AAE">O X-Ray não abriu agora (${esc(String(e && e.message || e).slice(0, 80))}). Tenta outra vez dentro de um minuto.</p>`; return }
        if (!document.getElementById('cc-xray')) return
        document.getElementById('xr-sub').innerHTML = navHTML()
        const stg = document.getElementById('xr-stage'); stg.innerHTML = ''; F = null; stg.hidden = false
        await window.Gravity.mount(stg, { lang: 'pt', css: GCSS, start: 'xr', strings: { askX: ['Pergunta sobre esta empresa…', 'Ask about this company…'] }, data: { core: { label: 'X-Ray' }, centres: [{ id: 'x', label: 'X-Ray', color: '#43D9C6' }], nodes: X.map(x => ({ id: x.slug, centre: 'x', label: x.name, ok: true })), flows: [], feed: [] }, views: [view], liveLabel: null })
        if (!cur) { cur = X.find(x => x.slug === 'feedzai') || X[0] || null; R = { ph: 'idle' } }
        if (F) { const i = $$('xin'); if (i && cur) i.value = cur.name; F.draw(true) }
        if (cur) rvFor(cur)
        show(sub) }
    function show(k) { sub = k; const n = document.getElementById('xr-sub'); if (n) n.innerHTML = navHTML()
        const st = document.getElementById('xr-stage'), o = document.getElementById('xr-other'); if (!st || !o) return
        const top = document.getElementById('xr-top'), run = document.getElementById('xr-run'); if (top) top.hidden = k !== 'search'; if (run) run.hidden = k !== 'search' || MODE !== 'run'
        st.hidden = k !== 'search' || MODE !== 'fan'; o.innerHTML = k === 'search' ? '' : PAGES[k]()
        if (k === 'search' && MODE === 'fan' && F) requestAnimationFrame(() => F.draw(true))
        const v = document.getElementById('cc-view'); if (v) { v.classList.remove('cc-zin'); void v.offsetWidth; v.classList.add('cc-zin') } }
    document.addEventListener('click', e => { const t = e.target; if (!t.closest) return
        const b = t.closest('[data-xsub]'); if (b) { show(b.dataset.xsub); return }
        const c = t.closest('[data-xco]'); if (c) { const x = all().find(y => y.slug === c.dataset.xco); if (!x) return; MODE = 'run'; show('search'); setMode('run'); cur = x; R = { ph: 'idle' }; if (F) { const i = $$('xin'); if (i) i.value = x.name; F.st.card = 'leads'; F.st.sel = -1; F.draw(true) } rvFor(x); return }
        if (t.closest('[data-xclear]')) { LIVE = []; put(LIVEK, null); if (cur && cur.kind === 'live') cur = X[0] || null; show('cos') } })
    X0.views.xray = { label: 'X-Ray', icon: 'brain', render: () => '<section class="cc-xray" id="cc-xray"></section>', after: paint }
})()
