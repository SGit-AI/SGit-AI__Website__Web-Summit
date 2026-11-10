// Tokens on every command centre (dashboard@web-summit.silvio, 10 November 2026; built in Silvio's Lab first; Silvio: "quanto estão a gastar individualmente e a equipa toda, e compara com os agentes chineses que a Revolut está a usar"). Read live, when the page opens:
// e compara com os agentes chineses que a Revolut está a usar"). Read live, when the page opens:
//   - which ledgers exist: GitHub's tree of the dev branch (one call), every people/<id>/(accountant/)ledger/*.jsonl;
//   - each ledger from the site: one line per session, written by the agent itself with measure.mjs (calls, models,
//     input, output, cache writes, cache reads, and the same for its sub-agents). Self-measured, not a bill.
// Cost is an ESTIMATE at list prices (US dollars per million tokens, read on 10 November 2026 from each provider's
// pricing page), and the comparison asks one question only: "the same tokens, at another model's prices". A different
// model would not use the same tokens or do the same work; Revolut's 90% is its own reported figure.
(function () {
    'use strict'
    const SITE = 'https://web-summit.sgit.ai/', TREE = 'https://api.github.com/repos/SGit-AI/SGit-AI__Website__Web-Summit/git/trees/dev?recursive=1'
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
    const SHIRT = { dinis: '#7D879E', nimay: '#4F7BFF', angelo: '#2ED48C', jose: '#FF8A3D', vicky: '#A877FF', silvio: '#FF3347', indi: '#FFD23F', daniela: '#E86FB0', sarah: '#4FD1F5' }
    // list prices, USD per million tokens: [input, output, cache write (5 min), cache read]
    const PRICE = {
        'claude-opus-5-5': [4, 20, 5, 0.20], 'claude-sonnet-5-5': [2, 10, 2.5, 0.10], 'claude-fable-5-1': [10, 50, 12.5, 0.25], 'claude-haiku-5-5': [0.5, 2.5, 0.625, 0.05]
    }
    const ALT = [
        ['What we pay now', null, 'Each session at its own model\'s list price (mostly Opus 5.5)', 'https://claude.com/pricing'],
        ['Claude Sonnet 5.5', [2, 10, 2.5, 0.10], 'Anthropic, list price', 'https://claude.com/pricing'],
        ['Claude Haiku 5.5', [0.5, 2.5, 0.625, 0.05], 'Anthropic, list price for prompts over 100K tokens', 'https://claude.com/pricing'],
        ['GLM-5.3 (Z.ai API)', [1.4, 4.4, 1.4, 0.26], 'Z.ai, list price; the model family Revolut moved to', 'https://docs.z.ai/guides/overview/pricing'],
        ['GLM-5.3 Flash (Z.ai API)', [0.15, 0.5, 0.15, 0.03], 'Z.ai, list price', 'https://docs.z.ai/guides/overview/pricing'],
        ['DeepSeek V4 Pro (peak)', [1.32, 3.96, 1.32, 0.044], 'DeepSeek, list price at peak hours (off-peak is half)', 'https://api-docs.deepseek.com/quick_start/pricing'],
        ['DeepSeek V4.1 Flash (peak)', [0.3, 1.2, 0.3, 0.006], 'DeepSeek, list price at peak hours (off-peak is half)', 'https://api-docs.deepseek.com/quick_start/pricing'],
        ['GLM self-hosted, Revolut\'s figure', 'flat', 'Revolut\'s own reported $0.30 per million tokens on its own GPUs, every token alike', 'https://dealroom.co/news/169124-revolut-swaps-claude-code-for-a-chinese-open-weight-model-cutting-its-ai/']
    ]
    // what we really pay: the subscriptions, per month, as Dinis said on 10 November ("I run the Ultra, $200 a month; all
    // of you are on about $70"), until each person confirms their own plan
    const PLAN = { dinis: 200 }, PLAN_DEFAULT = 70, PLAN_NOTE = 'as said in the conversation of 10 November; each person to confirm'
    const planOf = o => PLAN[o] || PLAN_DEFAULT
    const st = { exps: [], rows: null, err: '', range: '7d', loading: false, table: false, read: null, files: 0 }
    const get = async (u, kind = 'json', ms = 15000) => { const c = new AbortController(), t = setTimeout(() => c.abort(), ms); try { const r = await fetch(u, { signal: c.signal, cache: 'no-cache' }); if (!r.ok) throw new Error('HTTP ' + r.status); return kind === 'json' ? await r.json() : await r.text() } finally { clearTimeout(t) } }
    const pool = async (items, n, fn) => { const out = []; let i = 0; await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; try { out[k] = await fn(items[k]) } catch { out[k] = null } } })); return out }
    const tok = x => ({ i: (x && x.input_tokens) || 0, o: (x && x.output_tokens) || 0, w: (x && x.cache_creation_input_tokens) || 0, r: (x && x.cache_read_input_tokens) || 0, calls: (x && x.calls) || 0, by: (x && x.by_model) || {} })
    // a session's cost at its own models (tokens split by each model's share of calls), or at one alternative price
    const costAt = (t, p) => (t.i * p[0] + t.o * p[1] + t.w * p[2] + t.r * p[3]) / 1e6
    const ownCost = t => { const ms = Object.entries(t.by).filter(([m]) => PRICE[m]); const n = ms.reduce((s, [, c]) => s + c, 0); if (!n) return costAt(t, PRICE['claude-opus-5-5']); return ms.reduce((s, [m, c]) => s + costAt(t, PRICE[m]) * c / n, 0) }
    const altCost = (t, a) => a === 'flat' ? (t.i + t.o + t.w + t.r) * 0.30 / 1e6 : a ? costAt(t, a) : ownCost(t)

    // measure.mjs without --since counts the WHOLE session so far: an agent that logs every hour from one long session
    // writes a running total. So, per agent, a line without "since" whose every counter is at least the previous such
    // line's is the same session: only the difference is new. A counter that drops means a new session: counted whole.
    const K = ['i', 'o', 'w', 'r', 'calls']
    function dedupe(rows) {
        const prev = new Map()
        rows.sort((a, b) => String(a.at).localeCompare(String(b.at)))
        for (const x of rows) { if (x.since) continue; const p = prev.get(x.key)
            if (p && K.every(k => x.t[k] >= p[k])) { const raw = { ...x.t }; for (const k of K) x.t[k] = x.t[k] - p[k]; const by = {}; for (const [m, c] of Object.entries(raw.by)) by[m] = Math.max(0, c - ((p.by || {})[m] || 0)); x.t.by = Object.values(by).some(Boolean) ? by : raw.by; x.delta = true; prev.set(x.key, raw) }
            else prev.set(x.key, { ...x.t }) }
        return rows
    }
    async function load() {
        if (st.loading) return; st.loading = true; paint()
        try {
            const keep = (() => { try { const v = JSON.parse(localStorage.getItem('cc.live.tokens')); return v && Date.now() - v.at < 600000 ? v : null } catch { return null } })()
            let paths = keep && keep.paths
            if (!paths) { const tr = await get(TREE); const all = (tr.tree || []).map(x => x.path); paths = all.filter(p => /^people\/[a-z0-9-]+\/(accountant\/)?ledger\/[^/]+\.jsonl$/.test(p)); paths.router = all.filter(p => /^people\/[a-z0-9-]+\/router\/experiments\.jsonl$/.test(p)); try { localStorage.setItem('cc.live.tokens', JSON.stringify({ at: Date.now(), paths, router: paths.router })) } catch {} } else paths.router = keep.router || []
            const texts = await pool(paths, 8, p => get(SITE + p.split('/').map(encodeURIComponent).join('/'), 'text'))
            const rows = []
            paths.forEach((p, k) => { const owner = p.split('/')[1], t = texts[k]; if (!t) return
                for (const line of t.split('\n')) { if (!line.trim()) continue; let r; try { r = JSON.parse(line) } catch { continue } if (!r || !r.at || !r.session) continue
                    const s = tok(r.session), a = tok(r.subagents), all = { i: s.i + a.i, o: s.o + a.o, w: s.w + a.w, r: s.r + a.r, calls: s.calls + a.calls, by: { ...a.by } }
                    for (const [m, c] of Object.entries(s.by)) all.by[m] = (all.by[m] || 0) + c
                    rows.push({ at: r.at, since: r.since || null, agent: String(r.agent || '').trim(), key: String(r.agent || '').trim().toLowerCase(), owner, task: String(r.task || '').slice(0, 160), t: all }) } })
            dedupe(rows)
            const ex = await pool(paths.router || [], 4, p => get(SITE + p, 'text'))
            st.exps = ex.flatMap((tx, k) => (tx || '').split('\n').map(l => { try { return JSON.parse(l) } catch { return null } }).filter(x => x && x.at).map(x => ({ ...x, owner: paths.router[k].split('/')[1] }))).sort((a, b) => String(b.at).localeCompare(String(a.at)))
            st.rows = rows; st.files = paths.length; st.read = new Date(); st.err = ''
        } catch (e) { st.err = 'The ledgers could not be read just now (' + ((e && e.message) || 'error') + '). GitHub allows 60 reads an hour per connection; try again in a minute.' }
        st.loading = false; paint()
    }

    const fmtT = n => n >= 1e9 ? (n / 1e9).toFixed(1) + ' B' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? Math.round(n / 1e3) + ' K' : String(n)
    const fmt$ = n => n >= 1000 ? '$' + Math.round(n).toLocaleString('en-US') : n >= 10 ? '$' + n.toFixed(0) : '$' + n.toFixed(2)
    const RANGES = [['24h', 'Last 24 hours', 864e5], ['7d', 'Last 7 days', 7 * 864e5], ['all', 'Everything measured', Infinity]]
    function view() {
        if (st.err) return `<section class="cc-card"><p>${esc(st.err)}</p></section>`
        if (!st.rows) return `<section class="cc-card"><p>Reading every agent's ledger…</p></section>`
        const R = RANGES.find(r => r[0] === st.range) || RANGES[1], since = Date.now() - R[2]
        const rows = st.rows.filter(r => Date.parse(r.at) >= since)
        const sum = (rs, f) => rs.reduce((s, r) => s + f(r), 0)
        const fresh = r => r.t.i + r.t.o + r.t.w
        const cost = sum(rows, r => ownCost(r.t)), sess = rows.length
        // per agent and per person
        const by = new Map(); for (const r of rows) { const x = by.get(r.key) || { agent: r.agent, owner: r.owner, n: 0, cost: 0, fresh: 0, reads: 0, calls: 0 }; x.n++; x.cost += ownCost(r.t); x.fresh += fresh(r); x.reads += r.t.r; x.calls += r.t.calls; by.set(r.key, x) }
        const agents = [...by.values()].sort((a, b) => b.cost - a.cost)
        const owners = [...new Set(st.rows.map(r => r.owner))]
        const perOwner = owners.map(o => ({ o, cost: sum(rows.filter(r => r.owner === o), r => ownCost(r.t)), n: rows.filter(r => r.owner === o).length, ag: new Set(rows.filter(r => r.owner === o).map(r => r.key)).size })).sort((a, b) => b.cost - a.cost)
        const people = ['dinis', 'silvio', 'nimay', 'angelo', 'vicky', 'daniela', 'indi', 'jose', 'sarah'], unmeasured = people.filter(p => !owners.includes(p))
        // chart 1: the team by day, stacked by person (estimated cost)
        const days = []; const nDays = st.range === '24h' ? 1 : st.range === '7d' ? 7 : Math.max(1, Math.ceil((Date.now() - Math.min(...st.rows.map(r => Date.parse(r.at)))) / 864e5))
        for (let d = nDays - 1; d >= 0; d--) { const day = new Date(Date.now() - d * 864e5).toISOString().slice(0, 10); days.push({ day, parts: owners.map(o => ({ o, c: sum(st.rows.filter(r => r.owner === o && r.at.slice(0, 10) === day), r => ownCost(r.t)) })) }) }
        const maxDay = Math.max(1e-9, ...days.map(d => d.parts.reduce((s, p) => s + p.c, 0)))
        const W1 = 640, H1 = 220, bw = Math.min(64, (W1 - 60) / days.length - 10)
        const bars = days.map((d, k) => { let y = H1 - 26; const x = 50 + k * ((W1 - 60) / days.length) + 5; const tot = d.parts.reduce((s, p) => s + p.c, 0)
            const segs = d.parts.filter(p => p.c > 0).map(p => { const h = Math.max(0, (p.c / maxDay) * (H1 - 60) - 2); y -= h + 2; return `<rect x="${x}" y="${y + 2}" width="${bw}" height="${h}" rx="2" style="fill:${SHIRT[p.o] || '#4FD1F5'}"><title>${esc(p.o)} · ${d.day}: ${fmt$(p.c)}</title></rect>` }).join('')
            return `<g class="tk-day">${segs}<text x="${x + bw / 2}" y="${H1 - 10}" text-anchor="middle" class="tk-ax">${esc(d.day.slice(5))}</text>${tot ? `<text x="${x + bw / 2}" y="${y - 4}" text-anchor="middle" class="tk-v">${fmt$(tot)}</text>` : ''}</g>` }).join('')
        const chart1 = `<svg class="tk-svg" viewBox="0 0 ${W1} ${H1}" role="img" aria-label="Estimated cost per day, stacked by person"><line x1="46" x2="${W1 - 6}" y1="${H1 - 26}" y2="${H1 - 26}" class="tk-base"/>${bars}</svg><p class="tk-legend">${owners.map(o => `<span><i style="--c:${SHIRT[o] || '#4FD1F5'}"></i>${esc(o)}</span>`).join('')}</p>`
        // chart 2: per agent (top 15), coloured by its person, labelled directly
        const top = agents.slice(0, 15), maxA = Math.max(1e-9, ...top.map(a => a.cost))
        const chart2 = `<div class="tk-hbars">${top.map(a => `<div class="tk-hrow" title="${esc(a.agent)}: ${fmt$(a.cost)} estimated · ${a.n} sessions · ${fmtT(a.fresh)} tokens without cache reads · ${fmtT(a.reads)} cache reads"><span class="tk-name">${esc(a.agent)}</span><span class="tk-track"><i style="width:${Math.max(1, a.cost / maxA * 100)}%;background:${SHIRT[a.owner] || '#4FD1F5'}"></i></span><b>${fmt$(a.cost)}</b><small>${a.n} sess.</small></div>`).join('')}</div>`
        // chart 3: the same tokens at other models' prices
        const alts = ALT.map(([name, p, note, src]) => ({ name, note, src, c: sum(rows, r => altCost(r.t, p)) })), now = alts[0].c, maxC = Math.max(1e-9, ...alts.map(a => a.c))
        const chart3 = `<div class="tk-hbars tk-cmp">${alts.map((a, k) => `<div class="tk-hrow${k === 0 ? ' now' : ''}" title="${esc(a.note)}"><span class="tk-name">${esc(a.name)}</span><span class="tk-track"><i style="width:${Math.max(0.6, a.c / maxC * 100)}%"></i></span><b>${fmt$(a.c)}</b><small>${k === 0 ? 'now' : now ? (a.c < now ? '−' + Math.round((1 - a.c / now) * 100) + '%' : '+' + Math.round((a.c / now - 1) * 100) + '%') : ''}</small></div>`).join('')}</div>
<p class="note">Prices: ${[...new Set(ALT.map(a => a[3]))].map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(new URL(u).hostname)}</a>`).join(' · ')}. The same tokens priced differently: another model would not use the same tokens, nor do the same work. Revolut's 90% is its own reported figure, with its own engineers and hardware.</p>`
        const sumFresh = sum(rows, fresh), sumReads = sum(rows, r => r.t.r)
        const table = st.table ? `<div class="gr-table"><table><thead><tr><th>Agent</th><th>Person</th><th>Sessions</th><th>Calls</th><th>Tokens (no cache reads)</th><th>Cache reads</th><th>Estimated cost</th></tr></thead><tbody>${agents.map(a => `<tr><td>${esc(a.agent)}</td><td>${esc(a.owner)}</td><td>${a.n}</td><td>${a.calls}</td><td>${fmtT(a.fresh)}</td><td>${fmtT(a.reads)}</td><td>${fmt$(a.cost)}</td></tr>`).join('')}</tbody></table></div>` : ''
        return `<section class="cc-card tk-head"><h2>Tokens: what our agents spend</h2><p class="gr-warn">Measured by each agent itself (measure.mjs, one line per run; a running total from one long session counts only what is new); costs are estimates at list prices in US dollars, not a bill.</p>
<p class="note">Read live at ${esc(st.read.toISOString().slice(11, 16))} UTC from ${st.files} ledgers on the team site. ${(() => { const nm = [...new Set(rows.filter(r => !Object.keys(r.t.by || {}).length).map(r => r.owner))]; return nm.length ? 'Runs that do not record their model (' + nm.map(esc).join(', ') + ') are priced at the team\'s most-used model. ' : '' })()}${unmeasured.length ? 'Not measured yet: <b>' + unmeasured.map(esc).join(', ') + '</b> (their agents write no ledger, so they show nothing here, not zero).' : ''}</p>
<div class="tk-seg" role="group" aria-label="Period">${RANGES.map(([k, l]) => `<button type="button" data-tk-range="${k}" aria-pressed="${st.range === k}">${l}</button>`).join('')}<button type="button" data-tk-table aria-pressed="${st.table}">Table</button><button type="button" data-tk-reload>Read again</button></div>
<div class="tk-tiles"><div><span>Estimated cost</span><b>${fmt$(cost)}</b><small>${esc(R[1].toLowerCase())}</small></div><div><span>Runs logged</span><b>${sess}</b><small>${by.size} agents</small></div><div><span>Tokens, without cache reads</span><b>${fmtT(sumFresh)}</b><small>input, output, cache writes</small></div><div><span>Cache reads</span><b>${fmtT(sumReads)}</b><small>re-reading the same context: cheap, but most of the volume</small></div></div></section>
<div class="tk-grid"><section class="cc-card"><h3>The whole team, by day</h3>${chart1}<p class="tk-people">${perOwner.map(p => `<span style="--c:${SHIRT[p.o] || '#4FD1F5'}"><b>${esc(p.o)}</b> ${fmt$(p.cost)} · ${p.ag} agents · ${p.n} sessions</span>`).join('')}</p></section>
<section class="cc-card"><h3>Each agent (the 15 that spend most)</h3>${top.length ? chart2 : '<p class="note">No session in this period.</p>'}</section></div>
${paidView(rows, R, perOwner)}${routerView()}<section class="cc-card"><h3>The same work at other models' prices</h3><p class="note">${esc(R[1])}: what the tokens above would cost at each model's list price.</p>${chart3}</section>${table}`
    }
    function paidView(rows, R, perOwner) {
        const t0 = Math.min(...st.rows.map(r => Date.parse(r.at))), days = R[2] === Infinity ? Math.max(1, (Date.now() - t0) / 864e5) : R[2] / 864e5
        const P = perOwner.filter(p => p.n).map(p => ({ ...p, paid: planOf(p.o) * days / 30.4 })), mx = Math.max(1e-9, ...P.flatMap(p => [p.paid, p.cost]))
        const tp = P.reduce((s, p) => s + p.paid, 0), tv = P.reduce((s, p) => s + p.cost, 0)
        return `<section class="cc-card"><h3>What we really pay, and what it would cost at API prices</h3><p class="note">${esc(R[1])}. We pay subscriptions, not tokens: ${Object.entries(PLAN).map(([o, v]) => esc(o) + ' $' + v).join(', ')}, everyone else $${PLAN_DEFAULT} a month (${esc(PLAN_NOTE)}). The API value is the same work at list prices: it shows how much each plan returns, and how close it runs to its limit.</p>
<div class="tk-tiles tk-tiles3"><div><span>We pay (the measured people)</span><b>${fmt$(tp)}</b><small>${esc(R[1].toLowerCase())}, pro rata</small></div><div><span>At API prices it would be</span><b>${fmt$(tv)}</b><small>the same tokens</small></div><div><span>Value per dollar paid</span><b>×${tp ? (tv / tp).toFixed(1) : '—'}</b><small>more than ×1 means the plan is the cheaper way</small></div></div>
<div class="tk-hbars tk-paid">${P.map(p => `<div class="tk-pair"><span class="tk-name"><b style="color:${SHIRT[p.o] || '#4FD1F5'}">${esc(p.o)}</b> · ${p.ag} agents</span><span class="tk-two"><span class="tk-track" title="paid ${fmt$(p.paid)}"><i class="paid" style="width:${Math.max(1, p.paid / mx * 100)}%"></i></span><span class="tk-track" title="API value ${fmt$(p.cost)}"><i style="width:${Math.max(1, p.cost / mx * 100)}%;background:${SHIRT[p.o] || '#4FD1F5'}"></i></span></span><b>${fmt$(p.paid)} → ${fmt$(p.cost)}</b><small>×${(p.cost / Math.max(1e-9, p.paid)).toFixed(1)}</small></div>`).join('')}</div>
<p class="tk-legend"><span><i style="--c:#8FA6C2"></i>what the plan costs</span><span><i style="--c:#2ED48C"></i>the same tokens at API prices (each person's colour)</span></p></section>`
    }
    function routerView() {
        const E = st.exps
        if (!E.length) return `<section class="cc-card"><h3>Router experiments: the same sub-tasks on open models</h3><p class="note">No experiments yet. A router agent runs low-risk sub-tasks on open models through OpenRouter, has a Claude model check each result, and logs every try (people/&lt;id&gt;/router/experiments.jsonl: task, kind, model, tokens, the real cost OpenRouter returns, the verdict). Each try appears here as soon as it is committed.</p></section>`
        const ok = E.filter(x => x.verdict === 'pass').length, cost = E.reduce((s, x) => s + (+x.cost_usd || 0), 0)
        const base = E.reduce((s, x) => s + (x.baseline_tokens ? costAt({ i: +x.baseline_tokens.in || 0, o: +x.baseline_tokens.out || 0, w: 0, r: 0 }, PRICE['claude-opus-5-5']) : 0), 0)
        const byModel = new Map(); for (const x of E) { const m = String(x.model || '?'), y = byModel.get(m) || { n: 0, ok: 0, cost: 0 }; y.n++; if (x.verdict === 'pass') y.ok++; y.cost += +x.cost_usd || 0; byModel.set(m, y) }
        return `<section class="cc-card"><h3>Router experiments: the same sub-tasks on open models</h3>
<div class="tk-tiles"><div><span>Tries</span><b>${E.length}</b><small>${new Set(E.map(x => x.owner)).size} people</small></div><div><span>Passed the check</span><b>${Math.round(ok / E.length * 100)}%</b><small>${ok} of ${E.length}, checked by a Claude model</small></div><div><span>Real cost on OpenRouter</span><b>${fmt$(cost)}</b><small>as OpenRouter returned it</small></div><div><span>The same at Claude prices</span><b>${base ? fmt$(base) : '—'}</b><small>${base ? 'from each try\'s estimated baseline' + (cost ? ': ×' + (base / cost).toFixed(0) + ' dearer' : '') : 'no baseline logged yet'}</small></div></div>
<div class="gr-table"><table><thead><tr><th>Model</th><th>Tries</th><th>Passed</th><th>Cost</th></tr></thead><tbody>${[...byModel.entries()].sort((a, b) => b[1].n - a[1].n).map(([m, y]) => `<tr><td>${esc(m)}</td><td>${y.n}</td><td>${y.ok} (${Math.round(y.ok / y.n * 100)}%)</td><td>${fmt$(y.cost)}</td></tr>`).join('')}</tbody></table></div>
<div class="gr-table"><table><thead><tr><th>When</th><th>Task</th><th>Kind</th><th>Model</th><th>Tokens</th><th>Cost</th><th>Verdict</th></tr></thead><tbody>${E.slice(0, 20).map(x => `<tr><td>${esc(String(x.at).slice(5, 16).replace('T', ' '))}</td><td>${esc(String(x.task || '').slice(0, 80))}</td><td>${esc(x.kind || '')}</td><td>${esc(x.model || '')}</td><td>${x.tokens ? fmtT((+x.tokens.in || 0) + (+x.tokens.out || 0)) : '—'}</td><td>${fmt$(+x.cost_usd || 0)}</td><td class="v-${esc(x.verdict || '')}">${esc(x.verdict || '—')}</td></tr>`).join('')}</tbody></table></div></section>`
    }
    function paint() { const el = document.getElementById('tokens'); if (el) el.innerHTML = view() }
    document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-tk-range],[data-tk-table],[data-tk-reload]'); if (!t || !document.getElementById('tokens') || !document.getElementById('tokens').contains(t)) return
        if (t.dataset.tkRange) st.range = t.dataset.tkRange; else if ('tkTable' in t.dataset) st.table = !st.table; else { st.rows = null; try { localStorage.removeItem('cc.live.tokens') } catch {} ; load() } paint() })
    const X = window.CC_EXTRA = window.CC_EXTRA || { views: {} }; X.views = X.views || {}
    X.views.tokens = { label: 'Tokens', icon: 'reports', render: () => '<div id="tokens"></div>', after: () => { paint(); if (!st.rows) load() } }
    window.CCTokens = { ownCost, altCost, PRICE, ALT }
})()
