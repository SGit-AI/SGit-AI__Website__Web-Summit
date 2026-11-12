// GAMMA-Ray on everyone's command centre (dashboard@web-summit.silvio, 10 November 2026; built in Silvio's Lab first).
// GAMMA-Ray is a DRAFT standard by gamma-ray@web-summit.dinis (https://gamma-ray.sgit.ai/): it rates one AI agent on
// freedom (1 to 5) and governance (0 to 4); an agent is held at the highest freedom its governance supports, and the
// distance is RiskMandate's gap. This card only READS the draft: the levels, questions and indicators live from
// gamma-ray.sgit.ai, the two example scans of our own agents there, and Silvio's agents' scans from web-summit.sgit.ai.
// Only our own agents ("ours"): never a third party, never visitor data, never the developers' sealed gaps.
// Levels are computed here with the same rules as build/model.mjs (score), at commit 7b5e582 (v0.0.2): see score().
(function () {
    'use strict'
    const GR = 'https://gamma-ray.sgit.ai/', ME = String(window.CC_ME || 'silvio').replace(/[^a-z0-9-]/g, ''), WHO = String(window.CC_FIRST || ME), WS = 'https://web-summit.sgit.ai/people/' + ME + '/', MODEL = 'build/model.mjs @ 4ed253c'
    const EXAMPLES = ['riskmandate-publisher', 'promptugal-newsroom-team']
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
    const safeUrl = u => /^https:\/\/[^\s"'<>]+$/i.test(String(u || '')) ? String(u) : ''
    const st = { data: null, err: '', sel: '', loading: false, view: (() => { try { return localStorage.getItem('cc.gamma.view') || 'circuit' } catch { return 'circuit' } })(), tour: 0 }

    // ---- the rules: a port of build/model.mjs (ladder, GOV, score), line for line (gamma-ray commit 4ed253c, v0.0.5) ----
    // An indicator is a statement fact (counts with any grade) or an operation fact (counts only when observed or
    // measured; otherwise CLAIMED: shown, not counted). I23 and I45 are read from a measured grant, never from words.
    const STRONG = new Set(['observed', 'measured'])
    const GOV = [
        [1, [['what it is for is written down', ['I20']], ['a policy in force, or written rules', ['I34', 'I47']]]],
        [2, [['a named owner or accountable person', ['I30', 'I32']], ['a person can approve or stop', ['I38', 'I39']], ['its actions are logged', ['I41']]]],
        [3, [['the grant is enumerated, from a measured profile', ['I23']], ['every capability that cannot be undone is behind a boundary', ['I45']], ['it is monitored in operation', ['I43']]]],
        [4, [['test or evaluation results are published', ['I50']], ['an independent check', ['I52', 'I63', 'I64']]]]
    ]
    function ladder(y) {
        const any = (...ids) => ids.some(y)
        let f = 1
        if (y('I16') || (y('I07') && any('I02', 'I03', 'I04', 'I05'))) f = 2
        if (y('I08') && any('I17', 'I18', 'I19')) f = 3
        if (f === 3 && any('I04', 'I10', 'I11')) f = 4
        if (f === 4 && any('I12', 'I13') && any('I18', 'I19')) f = 5
        let g = 0, missing = []
        for (const [lvl, parts] of GOV) { const not = parts.filter(p => !p[1].some(y)); if (not.length) { missing = not.map(p => ({ for: lvl, need: p[0], ids: p[1] })); break } g = lvl }
        return { freedom: f, governance: g, missing }
    }
    function score(scan, levels, I, lens) {
        const A = scan.answers, undo = Object.fromEntries(lens.capabilities.map(c => [c.id, c.undo])), rows = scan.grant ? scan.grant.rows : null
        const irreversible = rows ? rows.filter(r => undo[r.capability] === 'no') : [], loose = irreversible.filter(r => r.barrier !== 'boundary')
        const refused = rows && scan.mandate ? rows.filter(r => (scan.mandate.do_not_want || []).includes(r.capability)) : []
        const fromGrant = rows ? { I23: rows.filter(r => STRONG.has(r.evidence)).length * 2 >= rows.length, I45: irreversible.length > 0 && loose.length === 0 } : { I23: false, I45: false }
        const eligible = id => A[id] && (I.get(id).needs === 'statement' || STRONG.has(A[id].g))
        if (scan.kind === 'product-shape') {
            const configs = (scan.configurations || [{ id: 'shipped', name: 'As shipped', note: '', on: [] }]).map(c => {
                const on = id => A[id] && (A[id].m === 'default' || (A[id].m === 'available' && c.on.includes(A[id].cfg)))
                const l = ladder(on), ids = Object.keys(A).filter(on)
                return { ...c, freedom: l.freedom, controls: ids.filter(id => I.get(id).question > 'Q05'), added: ids.filter(id => A[id].m === 'available') }
            })
            const fs_ = configs.map(c => c.freedom)
            return { product: true, freedom: configs[0].freedom, freedomMax: Math.max(...fs_), configs, governance: null, held: null, workOrder: [], evidenced: Object.values(A).filter(a => a.m !== 'available').length, available: Object.values(A).filter(a => a.m === 'available').length, irreversible: irreversible.length, loose: loose.length }
        }
        const claimed = ladder(id => id in fromGrant && rows ? fromGrant[id] || !!A[id] : !!A[id])
        const ev = ladder(id => id in fromGrant ? fromGrant[id] : eligible(id))
        const clears = g => levels.governance[g].clears
        const work = []
        for (const r of refused.filter(r => r.barrier !== 'boundary')) work.push({ type: 'refused', text: `\`${r.capability}\` is refused by the mandate and is in the grant with ${r.barrier === 'none' ? 'nothing' : 'only a ' + r.barrier} in the way`, capability: r.capability })
        if (rows && loose.length) work.push({ type: 'unbounded', text: `${loose.length} of the ${irreversible.length} capabilities in the grant whose effect cannot be undone are not behind a boundary: ${loose.map(r => '`' + r.capability + '`').join(', ')}` })
        for (const x of ev.missing) { const cl = x.ids.filter(id => A[id] && !(id in fromGrant)); work.push({ type: cl.length ? 'claimed' : 'missing', for: x.for, need: x.need, ids: x.ids, text: cl.length ? `${x.need}: stated, but known only as ${cl.map(id => A[id].g).join(', ')}; it has to be observed or measured to count` : (x.ids.some(id => id in fromGrant) ? (rows ? `${x.need}` : `${x.need}: no grant has been measured`) : `${x.need}: not evidenced`) }) }
        const held = Math.min(ev.freedom, clears(ev.governance)), claimedHeld = Math.min(claimed.freedom, clears(claimed.governance))
        return { product: false, freedom: ev.freedom, governance: ev.governance, clears: clears(ev.governance), held, gap: ev.freedom - held, claimed: { governance: claimed.governance, held: claimedHeld }, nextLevel: ev.missing.length ? ev.missing[0].for : null, workOrder: work,
            evidenced: Object.keys(A).filter(eligible).length, claimedOnly: Object.keys(A).filter(id => !eligible(id)).length, available: 0, irreversible: irreversible.length, loose: loose.length, refused: refused.length }
    }
    window.GammaScore = score   // for the Lab's tests

    const getJSON = async (u, ms = 8000) => { const c = new AbortController(), t = setTimeout(() => c.abort(), ms); try { const r = await fetch(u, { signal: c.signal, cache: 'no-cache' }); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json() } finally { clearTimeout(t) } }
    async function load() {
        if (st.loading || st.data) return; st.loading = true; paint()
        let d = null
        try {
            const [levels, questions, indicators, versions, lens, ...ex] = await Promise.all([getJSON(GR + 'data/levels.json'), getJSON(GR + 'data/questions.json'), getJSON(GR + 'data/indicators.json'), getJSON(GR + 'data/versions.json'), getJSON(GR + 'data/lens.json'), ...EXAMPLES.map(x => getJSON(GR + 'data/scans/' + x + '.json'))])
            let mine = [], mineNote = ''
            // which scans to look for: an index if gamma-ray@web-summit.silvio publishes one, else Silvio's agents plus the files known to the Lab's snapshot
            try {
                let names = []
                try { const ix = await getJSON(WS + 'gamma-ray/scans/index.json', 4000); names = (Array.isArray(ix) ? ix : ix.files || []).map(x => String(x).replace(/\.json$/, '')) } catch {
                    const ag = await getJSON(WS + 'agents.json').catch(() => []); let known = []; 
                    names = [...new Set([...ag.map(a => String(a.name || '').split('@')[0]), ...known])] }
                names = names.filter(x => /^[a-z0-9.-]+$/.test(x))
                const got = await Promise.allSettled(names.map(x => getJSON(WS + 'gamma-ray/scans/' + x + '.json')))
                mine = got.filter(x => x.status === 'fulfilled').map(x => x.value); mineNote = mine.length ? `${mine.length} of ${WHO}'s agents scanned and published` : `${WHO}'s agents' scans are not published yet`
            } catch { mineNote = `${WHO}'s agents' scans are not published yet` }
            d = { live: true, at: new Date().toISOString(), version: (versions[0] || {}).version || '?', levels, questions, indicators, lens, scans: [...ex, ...mine], mineNote }
        } catch (e) {
            st.err = 'GAMMA-Ray could not be read from gamma-ray.sgit.ai just now (DATA UNAVAILABLE). Try again in a minute.'
        }
        if (d) {
            const lv = d.levels; d.I = new Map(d.indicators.map(i => [i.id, i]))
            d.scans = d.scans.filter(s => s && s.ours === true && s.answers && s.kind !== 'product-shape').map(s => { const { freedom, governance, clears, held, workOrder, gap, potential, evidenced, available, g, claimed, nextLevel, claimedOnly, irreversible, loose, refused, product, ...raw } = s; return { ...raw, ...score(raw, lv, d.I, d.lens), published: { freedom, governance, held, gap } } })
        }
        st.data = d; st.loading = false; if (d && !st.sel && d.scans[0]) st.sel = ''; paint()
    }

    // ---- views ----
    const fName = (d, f) => ((d.levels.freedom.find(x => x.level === f) || {}).name || '')
    const gName = (d, g) => ((d.levels.governance.find(x => x.level === g) || {}).name || '')
    function quadrant(d) {
        const W = 640, H = 380, L = 96, T = 20, CW = (W - L - 20) / 5, CH = (H - T - 46) / 5
        const cx = f => L + (f - 0.5) * CW, cy = g => T + (4 - g + 0.5) * CH
        let cells = ''
        for (let g = 0; g <= 4; g++) for (let f = 1; f <= 5; f++) { const ok = f <= d.levels.governance[g].clears; cells += `<rect x="${L + (f - 1) * CW}" y="${T + (4 - g) * CH}" width="${CW}" height="${CH}" class="${ok ? 'gq-held' : 'gq-gap'}"/>` }
        const axes = [1, 2, 3, 4, 5].map(f => `<text x="${cx(f)}" y="${H - 26}" class="gq-ax" text-anchor="middle">${f} · ${esc(fName(d, f))}</text>`).join('') + [0, 1, 2, 3, 4].map(g => `<text x="${L - 8}" y="${cy(g) + 4}" class="gq-ax" text-anchor="end">${g} · ${esc(gName(d, g))}</text>`).join('')
        const groups = new Map(); for (const s of d.scans) { const k = s.freedom + ',' + s.governance; (groups.get(k) || groups.set(k, []).get(k)).push(s) }
        let gaps = '', pts = ''
        for (const [k, ss] of groups) { const [f, g] = k.split(',').map(Number), held = ss[0].held
            if (f > held) gaps += `<line x1="${cx(held)}" y1="${cy(g)}" x2="${cx(f)}" y2="${cy(g)}" class="gq-gapline"/><circle cx="${cx(held)}" cy="${cy(g)}" r="5" class="gq-heldpt"/>`
            const sel = ss.some(s => s.id === st.sel)
            pts += `<g class="gq-pt${sel ? ' on' : ''}" data-gr="${esc(ss[0].id)}" role="button" tabindex="0" aria-label="${esc(ss.map(s => s.name).join(', '))}"><title>${esc(ss.map(s => s.name).join('\n'))}</title><circle cx="${cx(f)}" cy="${cy(g)}" r="${Math.min(22, 9 + ss.length * 1.4)}"/><text x="${cx(f)}" y="${cy(g) + 4}" text-anchor="middle">${ss.length}</text></g>` }
        return `<svg class="gq" viewBox="0 0 ${W} ${H}" role="img" aria-label="Freedom by governance, one point per agent">${cells}${axes}<text x="${L + (W - L - 20) / 2}" y="${H - 6}" class="gq-t" text-anchor="middle">freedom: what it does on its own →</text><text x="14" y="${T + (H - T - 46) / 2}" class="gq-t" transform="rotate(-90 14 ${T + (H - T - 46) / 2})" text-anchor="middle">governance: how it is controlled →</text>${gaps}${pts}</svg>
<p class="gq-key"><i class="k-held"></i> held: its governance supports this freedom <i class="k-gap"></i> beyond what its governance supports <i class="k-line"></i> the gap: from the level held to its freedom</p>`
    }
    // ---- the circuit: the same picture as the Universe's circuit ----
    // agents on the left, every indicator on a numbered bus, the level rules in the middle, the result on the right
    const RULES = { freedom: [[2, 'suggests', 'I16 · or I07 with I02-I05', ['I16', 'I07', 'I02', 'I03', 'I04', 'I05']], [3, 'acts', 'I08 with I17, I18 or I19', ['I08', 'I17', 'I18', 'I19']], [4, 'acts widely', 'level 3 with I04, I10 or I11', ['I04', 'I10', 'I11']], [5, 'coordinates', 'I12 or I13, with I18 or I19', ['I12', 'I13', 'I18', 'I19']]],
        governance: [[1, 'stated', 'I20 · I34 or I47', ['I20', 'I34', 'I47']], [2, 'owned', 'I30/I32 · I38/I39 · I41', ['I30', 'I32', 'I38', 'I39', 'I41']], [3, 'bounded', 'I23 · I45 · I43', ['I23', 'I45', 'I43']], [4, 'proven', 'I50 · I52/I63/I64', ['I50', 'I52', 'I63', 'I64']]] }
    const SHIRT = { dinis: '#7D879E', nimay: '#4F7BFF', angelo: '#2ED48C', jose: '#FF8A3D', vicky: '#A877FF', silvio: '#FF3347', indi: '#FFD23F' }
    const opCol = s => new RegExp('\\.' + ME + '$|' + WHO, 'i').test(s.name + ' ' + (s.operator || '')) ? (SHIRT[ME] || '#FF3347') : /promptugal|newsroom/i.test(s.id) ? '#A877FF' : '#3EE6C1'
    const glints = w => (w.match(/<path[^>]*class="bc-w[^"]*\b(?:sel|team|hold)\b[^"]*"[^>]*\/>/g) || []).map((x, k) => x.replace(/class="bc-w([^"]*)"/, (m, c) => `class="bc-glint${/\bsel\b/.test(c) ? ' sel' : ''}" style="animation-delay:-${(k * 0.37) % 2.4}s"`).replace(/ style="stroke:[^"]*"(?= style)/, '')).join('')
    function circuit(d) {
        const s = d.scans.find(x => x.id === st.sel) || d.scans[0]; if (!s) return ''
        st.sel = s.id
        const ind = d.indicators, W = 1400, BX = 455, BT = 24, rowsH = 22 + 1 * 17 + 6, gapY = 8, H = Math.max(700, 16 + d.scans.length * (rowsH + gapY)), BB = H - 40, step = (BB - BT) / Math.max(1, ind.length - 1)
        const tick = new Map(ind.map((x, k) => [x.id, BT + k * step])), cut = (x, n) => (x = String(x == null ? '' : x)).length > n ? x.slice(0, n - 1) + '…' : x
        const tx = (x, y, v, cls, a) => `<text x="${x}" y="${y}" class="${cls}"${a ? ` text-anchor="${a}"` : ''}>${esc(v)}</text>`
        const node = (x, y, w, head, hc, rows, cls = '', data = '') => { let o = `<g class="bc-n ${cls}"${data}><rect x="${x}" y="${y}" width="${w}" height="${22 + rows.length * 17 + 6}" rx="3" class="bc-body"/><rect x="${x}" y="${y}" width="${w}" height="18" rx="3" style="fill:${hc}"/>${tx(x + 8, y + 13, head, 'bc-ht')}`
            rows.forEach((r, k) => { const ry = y + 22 + k * 17 + 11; o += `<circle cx="${x}" cy="${ry - 4}" r="2.6" class="bc-port"/><circle cx="${x + w}" cy="${ry - 4}" r="2.6" class="bc-port" style="fill:${r[2] || '#7F97A8'}"/>${r[3] ? `<rect x="${x + 8}" y="${ry - 9}" width="22" height="7" rx="1" style="fill:${r[3]}"/>${tx(x + 36, ry, r[0], 'bc-t')}` : r[4] != null ? `<rect x="${x + 8}" y="${ry - 9}" width="8" height="8" class="bc-box${r[4] ? ' on' : ''}"/>${tx(x + 22, ry, r[0], 'bc-t')}` : tx(x + 8, ry, r[0], 'bc-t')}${tx(x + w - 8, ry, r[1], 'bc-v', 'end')}` })
            return o + '</g>' }
        const pY = (y, k) => y + 22 + k * 17 + 7
        let W1 = '', W2 = '', W3 = '', nodes = ''
        // the agents
        d.scans.forEach((x, k) => { const y = 8 + k * (rowsH + gapY), on = x.id === s.id
            nodes += node(20, y, 250, cut(x.name, 30).toLowerCase(), on ? '#F5E14A' : opCol(x), [['f ' + x.freedom + ' · g ' + x.governance, 'held ' + x.held + ' · gap ' + x.gap, x.gap ? '#FF5C7A' : '#3DDC97']], on ? 'hit' : '', ` data-gr="${esc(x.id)}" role="button" tabindex="0"`)
            for (const id of Object.keys(x.answers || {})) if (tick.has(id)) { const sy = pY(y, 0), ty = tick.get(id), av = x.answers[id].m === 'available'
                W1 += `<path class="bc-w${on ? ' sel' : ''}${av ? ' hold' : ''}" style="stroke:${opCol(x)}" d="M270 ${sy} C 300 ${sy}, ${BX - 40} ${ty}, ${BX} ${ty}"/>` } })
        // the bus of indicators
        nodes += `<g class="bc-bus"><rect x="${BX - 6}" y="${BT - 14}" width="12" height="${BB - BT + 28}" rx="3"/>${ind.map((x, k) => { const has = !!(s.answers || {})[x.id]; return `<g><title>${esc(x.id + ' · ' + x.text)}</title><circle cx="${BX}" cy="${tick.get(x.id)}" r="${has ? 3.6 : 2.2}" style="fill:${has ? '#F5E14A' : '#2B4256'}"/>${k % 5 === 0 ? tx(BX - 12, tick.get(x.id) + 3, x.id, 'bc-num', 'end') : ''}</g>` }).join('')}${tx(BX + 4, BB + 22, 'indicator bus · ' + ind.length, 'bc-m')}</g>`
        // the rules: freedom and governance ladders
        const y_ = id => { const a = (s.answers || {})[id], i0 = d.I.get(id); return !!a && !!i0 && (i0.needs === 'statement' || STRONG.has(a.g)) }
        const NX = 640, NW = 270, FY = 8, GY = 170
        const fRows = RULES.freedom.map(([l, name, rule]) => [l + ' · ' + name, s.freedom >= l ? '✓' : '·', s.freedom >= l ? '#3DDC97' : '#2B4256', , s.freedom >= l])
        const gRows = RULES.governance.map(([l, name, rule]) => [l + ' · ' + name, s.governance >= l ? '✓' : (s.nextLevel === l ? 'next' : s.claimed && s.claimed.governance >= l ? 'claimed' : '·'), s.governance >= l ? '#3DDC97' : s.nextLevel === l ? '#FF5C7A' : '#2B4256', , s.governance >= l])
        nodes += node(NX, FY, NW, 'freedom · what it does on its own', '#4FA8FF', [['1 · answers', '✓', '#3DDC97', , true], ...fRows])
        nodes += node(NX, GY, NW, 'governance · how it is controlled', '#FF8A5C', [['0 · unstated', '✓', '#3DDC97', , true], ...gRows])
        for (const [axis, Y0] of [['freedom', FY], ['governance', GY]]) RULES[axis].forEach(([l, , , ids], k) => { for (const id of ids) if (tick.has(id)) { const ty = tick.get(id), ry = pY(Y0, k + 1), on = y_(id)
            const cl = !on && !!(s.answers || {})[id]; W2 += `<path class="bc-w${on ? ' sel' : cl ? ' claim' : ''}" style="stroke:${axis === 'freedom' ? '#4FA8FF' : '#FF8A5C'}" d="M${BX} ${ty} C ${BX + 150} ${ty}, ${NX - 150} ${ry}, ${NX} ${ry}"/>` } })
        // the gate and the work order
        const WY = 330, wo = s.workOrder || []
        nodes += node(NX, WY, NW, 'gate · the level held', '#FF6B5C', [['clears', 'freedom ' + s.clears, '#FF6B5C'], ['held at', String(s.held), '#F5E14A', '#F5E14A'], ['gap', String(s.gap), s.gap ? '#FF5C7A' : '#3DDC97', s.gap ? '#FF5C7A' : '']])
        nodes += node(NX, WY + 110, NW, 'work order · to raise governance', '#F4C6FF', wo.length ? wo.slice(0, 4).map(w => [cut(w.need || w.text, 30), (w.ids || []).join(' '), w.type === 'claimed' ? '#F5C542' : '#F4C6FF', , false]) : [['nothing missing for the next level', '']])
        W2 += `<path class="bc-w sel" d="M${NX + NW} ${pY(GY, s.governance)} C ${NX + NW + 50} ${pY(GY, s.governance)}, ${NX + NW + 50} ${pY(WY, 0)}, ${NX + NW} ${pY(WY, 0)}"/><path class="bc-w sel" d="M${NX} ${pY(FY, s.freedom - 1)} C ${NX - 60} ${pY(FY, s.freedom - 1)}, ${NX - 60} ${pY(WY, 2)}, ${NX} ${pY(WY, 2)}"/>`
        // the result
        const RX = 1080, RW = 300
        nodes += node(RX, 8, RW, 'result · ' + cut(s.name, 34).toLowerCase(), '#3EE6C1', [['freedom', s.freedom + ' · ' + fName(d, s.freedom), '#4FA8FF'], ['governance', s.governance + ' · ' + gName(d, s.governance), '#FF8A5C'], ['held at', String(s.held), '#F5E14A'], ['gap (RiskMandate)', String(s.gap), '#FF5C7A', s.gap ? '#FF5C7A' : '']])
        nodes += node(RX, 150, RW, 'result · claimed (self-reported)', '#B39DFF', [['if every claim were observed', 'held ' + (s.claimed ? s.claimed.held : '—'), '#B39DFF'], ['answers that count', String(s.evidenced), '#3DDC97'], ['claimed only', String(s.claimedOnly), '#F5C542']])
        nodes += node(RX, 270, RW, 'human · operator', '#FFC1E3', [['operator', cut(s.operator || '—', 22), '#FFC1E3'], ['tier', 'Public', '#7F97A8'], ['read', cut(s.read || '—', 14)]])
        const pub = s.published && s.published.held != null
        nodes += node(RX, 390, RW, 'check · against gamma-ray.sgit.ai', pub ? (s.published.held === s.held ? '#3DDC97' : '#FF5C7A') : '#7F97A8', [[pub ? (s.published.held === s.held && s.published.freedom === s.freedom && s.published.governance === s.governance ? 'same as published' : 'differs from published') : 'computed here only', pub ? 'held ' + s.published.held : MODEL.split(' @ ')[1], pub && s.published.held === s.held ? '#3DDC97' : '#7F97A8', , true]])
        W3 += `<path class="bc-w sel" d="M${NX + NW} ${pY(WY, 1)} C ${NX + NW + 90} ${pY(WY, 1)}, ${RX - 90} ${pY(8, 2)}, ${RX} ${pY(8, 2)}"/><path class="bc-w sel" d="M${NX + NW} ${pY(WY + 110, 0)} C ${NX + NW + 90} ${pY(WY + 110, 0)}, ${RX - 90} ${pY(150, 0)}, ${RX} ${pY(150, 0)}"/><path class="bc-w" style="stroke:#FFC1E3" d="M${NX + NW} ${pY(WY, 2)} C ${NX + NW + 90} ${pY(WY, 2)}, ${RX - 90} ${pY(270, 0)}, ${RX} ${pY(270, 0)}"/>`
        const ans = Object.entries(s.answers || {}), nAns = d.scans.reduce((n, x) => n + Object.keys(x.answers || {}).length, 0), wires = (W1 + W2 + W3).split('<path').length - 1
        const byHeld = [1, 2, 3, 4, 5].map(l => d.scans.filter(x => x.held === l).length), mx = Math.max(1, ...byHeld)
        return `<div class="bm-circuit gr-circ"><div class="bc-strip"><span>GAMMA-RAY <b>${esc(d.version)}</b></span><span>AGENTS <b>${d.scans.length}</b></span><span>INDICATORS <b>${ind.length}</b></span><span>QUESTIONS <b>${d.questions.length}</b></span><span>ANSWERS <b class="y">${nAns}</b></span><span>WIRES <b>${wires}</b></span><span>TIER <b>Public</b></span><span class="r">DRAFT · NOT REVIEWED</span></div>
<div class="bc-title" style="--c:${opCol(s)}"><div><b>${String(d.scans.indexOf(s)).padStart(2, '0')} ${s.gap ? 'GAP ' + s.gap : 'HELD'} · ${esc(s.name)}</b><small>freedom ${s.freedom} · governance ${s.governance} · held at ${s.held}${wo[0] ? ' · next: ' + esc(wo[0].need || wo[0].text) : ''}</small></div><div class="bc-tools"><button type="button" class="bc-tour" data-gr-tour aria-pressed="${!!st.tour}">${st.tour ? '■ Stop' : '▶ Play'}</button></div></div>
<div class="bc-scroll"><svg class="bc-svg hot" viewBox="0 0 ${W} ${H}" role="img" aria-label="Each agent's answers on the indicator bus, through the level rules, to its held level and gap">${W1}${W2}${W3}${glints(W1 + W2 + W3)}${nodes}</svg></div>
<div class="bc-panels"><section><h4>Answers <em>${s.evidenced} count · ${s.claimedOnly} claimed</em></h4><ol class="bc-log">${ans.slice(0, 16).map(([id, a]) => `<li><span>${esc(id)}</span><i style="color:${STRONG.has(a.g) || (d.I.get(id) || {}).needs === 'statement' ? '#3EE6C1' : '#F5C542'}">${esc(STRONG.has(a.g) || (d.I.get(id) || {}).needs === 'statement' ? 'counts' : 'claimed')}</i>${safeUrl(a.e) ? `<a href="${esc(safeUrl(a.e))}" target="_blank" rel="noopener">${esc(cut(a.n || '', 60))}</a>` : esc(cut(a.n || '', 60))}</li>`).join('')}</ol></section>
<section><h4>Held levels <em>${d.scans.length} agents</em></h4>${byHeld.map((n, k) => `<p class="bc-disp"><span>held ${k + 1}</span><b style="color:${k + 1 >= 4 ? '#3DDC97' : k + 1 === 3 ? '#F5E14A' : '#FF5C7A'}">${'#'.repeat(Math.round(n / mx * 14))}<i>${'·'.repeat(14 - Math.round(n / mx * 14))}</i></b><em>${n}</em><small>${esc(fName(d, k + 1).toLowerCase())}</small></p>`).join('')}<p class="bc-note">how many agents are held at each freedom level</p></section>
<section class="bc-code"><h4>${esc(s.id)}.json <em>${esc(s.read || '')}</em></h4><ol>${ans.slice(0, 14).map(([id, a], n) => `<li><span>${String(n + 1).padStart(2, '0')}</span><b class="k-mandate">"${esc(id)}"</b>: { m: <b class="k-licence">"${esc(a.m || '')}"</b>, g: "${esc(a.g || '')}" }</li>`).join('')}</ol></section>
<section><h4>Graph <em>${esc(MODEL)}</em></h4><dl class="bc-dl"><div><dt>agents</dt><dd>${d.scans.length}</dd></div><div><dt>held at 3 or more</dt><dd class="y">${d.scans.filter(x => x.held >= 3).length}</dd></div><div><dt>with a gap</dt><dd class="r">${d.scans.filter(x => x.gap > 0).length}</dd></div><div><dt>average gap</dt><dd class="r">${(d.scans.reduce((n, x) => n + x.gap, 0) / Math.max(1, d.scans.length)).toFixed(1)}</dd></div><div><dt>answers</dt><dd>${nAns}</dd></div></dl><p class="bc-big">${s.held}<small>/${s.freedom}</small></p><p class="bc-note">this agent: held at ${s.held}, its freedom ${s.freedom} · a draft, not reviewed</p></section></div></div>`
    }
    function table(d) {
        return `<div class="gr-table"><table><thead><tr><th>Agent</th><th>Freedom</th><th>Governance</th><th>Held at</th><th>Gap</th><th>What would raise its governance</th></tr></thead><tbody>${d.scans.map(s => `<tr class="${s.id === st.sel ? 'on' : ''}"><td><button type="button" class="gr-name" data-gr="${esc(s.id)}">${esc(s.name)}</button><small>${esc(s.operator || '')}</small></td><td>${s.freedom} · ${esc(fName(d, s.freedom))}</td><td>${s.governance} · ${esc(gName(d, s.governance))}</td><td><b>${s.held}</b></td><td><b class="gr-gap g${Math.min(3, s.gap)}">${s.gap}</b></td><td>${s.workOrder.length ? `<ol>${s.workOrder.slice(0, 3).map(w => `<li>${esc(w.text || w.need)}${w.ids ? ` <small>(${esc(w.ids.join(', '))}${w.for ? ', for level ' + w.for : ''})</small>` : ''}</li>`).join('')}</ol>` : '<span class="note">nothing missing for the next level</span>'}</td></tr>`).join('')}</tbody></table></div>`
    }
    function detail(d) {
        const s = d.scans.find(x => x.id === st.sel); if (!s) return `<section class="cc-card gr-detail"><p class="note">Tap an agent (in the table or on the grid) to see its answers, each with its evidence.</p></section>`
        const ne = s.not_evidenced && typeof s.not_evidenced === 'object' ? s.not_evidenced : {}
        const qs = d.questions.map(q => `<div class="gr-q"><h4><span class="gr-axis ${esc(q.axis)}">${esc(q.axis)}</span> ${esc(q.text)}</h4><ul>${q.indicators.map(id => { const ind = d.I.get(id) || { text: id, tier: 'public' }, a = s.answers[id], tier = ind.tier ? ind.tier[0].toUpperCase() + ind.tier.slice(1) : 'Public'
            return a ? `<li class="yes"><b>${esc(id)}</b> ${esc(ind.text)}<span class="gr-ans">${esc(a.n || '')}</span><small>${safeUrl(a.e) ? `<a href="${esc(safeUrl(a.e))}" target="_blank" rel="noopener">evidence</a>` : 'no https evidence link'} · ${esc(a.g || 'self-reported')} · ${esc(a.m || 'deployed')} · tier ${esc(tier)}${a.read ? ' · read ' + esc(a.read) : ''}</small></li>`
                : `<li class="no"><b>${esc(id)}</b> ${esc(ind.text)}<span class="gr-ne">not evidenced</span>${ne[id] ? `<small>${esc(ne[id])}</small>` : ''}</li>` }).join('')}</ul></div>`).join('')
        const pub = s.published && s.published.held != null ? (s.published.held === s.held && s.published.freedom === s.freedom && s.published.governance === s.governance ? `<span class="ok">same as gamma-ray.sgit.ai publishes</span>` : `<span class="warn">differs from what gamma-ray.sgit.ai publishes (${s.published.freedom}/${s.published.governance}/held ${s.published.held})</span>`) : ''
        return `<section class="cc-card gr-detail"><header><h3>${esc(s.name)}</h3><p>${esc(s.what || '')}</p><p class="note">Freedom ${s.freedom}, governance ${s.governance}, held at ${s.held}, gap ${s.gap}. ${pub} ${s.note ? esc(s.note) : ''}</p></header>${qs}</section>`
    }
    function html() {
        const d = st.data
        if (st.err) return `<section class="cc-card"><p>${esc(st.err)}</p></section>`
        if (!d) return `<section class="cc-card"><p>Reading GAMMA-Ray…</p></section>`
        // in the clean shell (Silvio, 12 November): one thin bar like the Universe's (the tabs, the name, the state), and the
        // standard's full disclosure as a footnote under the circuit; the classic page keeps its header
        const head = `<section class="cc-card gr-head"><h2>GAMMA-Ray</h2><p class="gr-warn">GAMMA-Ray ${esc(d.version)}, a draft standard, not reviewed by a second reader; Public tier: from public pages only.</p>
<p class="note">${d.live ? `Read live from gamma-ray.sgit.ai at ${esc(d.at.slice(11, 16))} UTC.` : `This page could not read gamma-ray.sgit.ai live (${esc(d.why || 'blocked')}), so it shows the Lab's snapshot of ${esc(d.version)}, taken ${esc(String(d.at).slice(0, 16).replace('T', ' '))} UTC.`} ${esc(d.mineNote || '')}. Levels computed here with the rules of ${MODEL}. Only our own agents; "not evidenced" is never a "no". <a href="${GR}" target="_blank" rel="noopener">The standard</a></p></section>`
        const sw = `<div class="gr-switch" role="group" aria-label="View"><button type="button" data-gr-view="circuit" aria-pressed="${st.view === 'circuit'}">Circuit</button><button type="button" data-gr-view="grid" aria-pressed="${st.view !== 'circuit'}">Grid</button></div>`
        const body = `${st.view === 'circuit' ? `<section class="cc-card gr-circwrap">${circuit(d)}</section>${detail(d)}` : `<div class="gr-grid"><section class="cc-card">${quadrant(d)}</section>${detail(d)}</div>`}<section class="cc-card">${table(d)}</section>`
        if (document.documentElement.classList.contains('cc-shell')) return `<div class="gr-bar">${sw}<span class="gr-name">GAMMA-Ray</span><span class="gr-state"><span class="gr-chip" title="GAMMA-Ray ${esc(d.version)}, a draft standard, not reviewed by a second reader; Public tier: from public pages only.">Draft · not reviewed</span><span class="gr-live${d.live ? '' : ' snap'}">${d.live ? `Live · read ${esc(d.at.slice(11, 16))} UTC` : 'Snapshot'}</span><a class="gr-std" href="${GR}" target="_blank" rel="noopener">The standard ↗</a></span></div>${body}<div class="gr-foot">${head}</div>`
        return `${head}
${sw}${body}`
    }
    function paint() { const el = document.getElementById('gamma'); if (el) el.innerHTML = html() }
    const tour = on => { clearInterval(st.tour); st.tour = 0; if (on && st.data) { let k = Math.max(0, st.data.scans.findIndex(x => x.id === st.sel)); st.tour = setInterval(() => { if (!document.getElementById('gamma') || st.view !== 'circuit') return tour(false); k = (k + 1) % st.data.scans.length; st.sel = st.data.scans[k].id; paint() }, 3500) } paint() }
    document.addEventListener('click', e => { const v = e.target.closest && e.target.closest('[data-gr-view],[data-gr-tour]'); if (!v || !document.getElementById('gamma') || !document.getElementById('gamma').contains(v)) return; if (v.dataset.grView) { st.view = v.dataset.grView; try { localStorage.setItem('cc.gamma.view', st.view) } catch {} ; paint() } else tour(!st.tour) })
    document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-gr]'); if (!t || !document.getElementById('gamma') || !document.getElementById('gamma').contains(t)) return; if (st.tour) { clearInterval(st.tour); st.tour = 0 } st.sel = st.view === 'circuit' ? t.dataset.gr : (t.dataset.gr === st.sel ? '' : t.dataset.gr); paint() })
    document.addEventListener('keydown', e => { const t = e.target.closest && e.target.closest('.gq-pt, .gr-circ .bc-n[data-gr]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })) } })
    const X = window.CC_EXTRA = window.CC_EXTRA || { views: {} }; X.views = X.views || {}
    X.views.gamma = { label: 'GAMMA-Ray', icon: 'flag', render: () => '<div id="gamma"></div>', after: () => { paint(); load() } }
})()
;(function () {
    // each box keeps its own colour in the new card design (Silvio, 11 November): read the colour of a box's header strip
    // and hand it to the card as --c, so the stylesheet can tint the glass, the mark on the left and the title
    const tag = () => document.querySelectorAll('#gamma .gr-circ .bc-n').forEach(g => { if (g.dataset.c) return; const h = g.querySelector(':scope > rect:nth-of-type(2)'); const c = h && h.style.fill; if (c) { g.dataset.c = c; g.style.setProperty('--c', c) } })
    new MutationObserver(tag).observe(document.documentElement, { childList: true, subtree: true })
})()
