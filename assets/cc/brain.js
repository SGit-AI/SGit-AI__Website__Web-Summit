// The Universe, read live (dashboard@web-summit.silvio, 10 November 2026; Silvio: "everything must be in live data").
// Every time the map opens it reads, from their sources, at that moment:
//   - the team (web-summit.sgit.ai/data/team.json) and each person's agents (people/<id>/agents.json);
//   - every Agent Behaviour Policy (the /abp/ pages' markdown twins): Reach, Mandate, Gap, Barriers, Licence to Operate,
//     Provenance; barrier kinds by the curated mapping (security review F4), resources INFERRED from the Reach text;
//   - the role policies (team/<role>/policy.json) and who agreed them;
//   - each agent's latest commit (GitHub's API on the dev branch, the last 100 commits; if GitHub does not answer, none);
//   - the Web Summit layer: the public CRM vault (data/crm.json's read key, the vault library this site pins), joined to
//     the team, our company map (data/companies.json) and our open summit tasks (the person's data.json).
// No session ids (F9), https links only (F8). The agents' gaps and barriers are kept only for a developer's view.
// window.LiveUniverse = { agents({ dev }), summit({ dataUrl }) }: each resolves to the same shapes the map used before.
(function () {
    'use strict'
    const SITE = 'https://web-summit.sgit.ai/', GH = 'https://api.github.com/repos/SGit-AI/SGit-AI__Website__Web-Summit/commits?sha=dev&per_page=100'
    const get = async (u, kind = 'json', ms = 12000) => { const c = new AbortController(), t = setTimeout(() => c.abort(), ms); try { const r = await fetch(u, { signal: c.signal, cache: 'no-cache' }); if (!r.ok) throw new Error(u + ' HTTP ' + r.status); return kind === 'json' ? await r.json() : await r.text() } finally { clearTimeout(t) } }
    // one GitHub read serves both the latest commits and who is working now, for two minutes (GitHub allows 60 an hour per address)
    let GHC = null; const commits = () => { if (GHC && Date.now() - GHC.at < 110000) return GHC.p; const p = get(GH, 'json', 9000); GHC = { at: Date.now(), p }; p.catch(() => { GHC = null }); return p }
    const pool = async (items, n, fn) => { const out = new Array(items.length); let i = 0; await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; try { out[k] = await fn(items[k]) } catch { out[k] = null } } })); return out }
    const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const SESSION = /session_[A-Za-z0-9]+|cse_[A-Za-z0-9]+/g
    const clean = (s, n = 240) => { s = String(s || '').replace(SESSION, '[a session]').replace(/\*\*|`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s*\{#[a-z0-9-]+\}\s*$/, '').trim(); return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…' }
    // the curated mapping of every distinct barrier kind in the ABPs (the same as the Lab's generator, 9 November)
    const KIND = [[/^rule, kept by the agent; for `?main`?, technical since/, 'SPLIT'], [/^technical \(the connector cannot/, 'ENFORCED'], [/^technical, \*\*not yet set/, 'ADVISORY'], [/^technical, in CI/, 'PARTIAL'], [/^technical$/, 'PARTIAL'], [/^review, after the fact/, 'DETECTIVE'], [/^review, before the push, a sub-agent in the agent/, 'ADVISORY'], [/^review, inside the same session/, 'ADVISORY'], [/^rule, kept by the agent/, 'ADVISORY']]
    const WHY = { ENFORCED: 'a platform setting the agent cannot change', PARTIAL: 'technical, but the agent can edit or bypass it (the gate runs in CI the agent can change)', DETECTIVE: 'after the fact: it finds, it does not prevent', ADVISORY: 'a rule the agent keeps itself' }
    const kindOf = k => { k = String(k).trim(); for (const [rx, v] of KIND) if (rx.test(k)) return v; return 'ADVISORY' }
    const RES = [['r-repo', 'The team site repository', /SGit-AI__Website__Web-Summit|the repository|this repository/], ['r-promptugal', 'PrompTugal repository', /PrompTugal__|PrompTugal repo/], ['r-actions', 'GitHub Actions (CI)', /Actions|CI job|deploy-pages/], ['r-sessions', 'Claude Code Remote (other sessions)', /Claude Code Remote|other sessions|scheduled task/], ['r-gmail', 'Gmail connector', /Gmail/], ['r-drive', 'Google Drive connector', /Drive/], ['r-calendar', 'Google Calendar connector', /Calendar/], ['r-vaults', 'SG/Send vaults', /vault|SG\/Send|SG_SEND/], ['r-openrouter', 'OpenRouter (model API)', /OpenRouter|OPENROUTER/], ['r-web', 'The public web', /public web|internet/]]
    const section = (t, name) => { const m = t.match(new RegExp('^## ' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))', 'm')); return m ? m[1] : '' }
    const bullets = (txt, n = 8) => txt.split('\n').filter(l => /^\s*-\s+/.test(l)).map(l => clean(l.replace(/^\s*-\s+/, ''))).slice(0, n)
    const table = txt => txt.split('\n').filter(l => l.trim().startsWith('|')).map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim())).filter(c => c.length && !/^[-: ]*$/.test(c[0]) && c[0] !== 'Barrier' && c[0] !== '')
    const safe = u => /^https:\/\//.test(String(u || '')) ? u : ''

    async function agents(opts = {}) {
        const dev = !!opts.dev
        const team = (await get(SITE + 'data/team.json')).members || []
        const humans = Object.fromEntries(team.filter(m => m.kind === 'human').map(m => [m.id, m.name]))
        const notes = Object.entries(humans).map(([id, name]) => ({ id: 'p-' + id, type: 'person', title: name, links: [], src: 'data/team.json', status: 'REAL' }))
        const A = new Map()
        const lists = await pool(Object.keys(humans), 6, id => get(SITE + 'people/' + id + '/agents.json'))
        Object.keys(humans).forEach((owner, k) => { const d = lists[k]; const lst = Array.isArray(d) ? d : (d && d.agents) || []
            for (const a of lst) { const addr = a.name || ''; if (!addr || A.has(norm(addr))) continue
                A.set(norm(addr), { id: 'a-' + norm(addr), type: 'agent', title: addr, owner, job: clean(a.job, 220), schedule: clean(a.schedule, 160), links: humans[owner] ? ['p-' + owner] : [], ilinks: [], src: `people/${owner}/agents.json`, status: 'REAL' }) } })
        // the policies: every page the /abp/ index links to that has a Reach section
        const idx = await get(SITE + 'abp/index.md', 'text'), slugs = [...new Set([...idx.matchAll(/\(([a-z0-9-]+)\/index\.html\)/g)].map(m => m[1]))]
        const mds = await pool(slugs, 8, s => get(SITE + 'abp/' + s + '/index.md', 'text'))
        const kinds = { ENFORCED: 0, PARTIAL: 0, DETECTIVE: 0, ADVISORY: 0 }, used = {}, policies = []; let open = 0, closed = 0
        slugs.forEach((slug, k) => { const t = mds[k]; if (!t || !/^## Reach/m.test(t)) return
            const m = t.match(/^# ABP:\s*(.+)$/m), addr = m ? m[1].trim() : slug, key = norm(addr), reach = section(t, 'Reach')
            const gap = bullets(section(t, 'Gap'), 10).map(b => { const c = /^(Fixed|Closed)\b/.test(b) || /closed on/i.test(b); c ? closed++ : open++; return { text: b, open: !c } })
            const bars = []; for (const c of table(section(t, 'Barriers'))) { if (c.length < 2) continue; const kd = kindOf(c[1])
                if (kd === 'SPLIT') { bars.push({ text: 'main is protected on GitHub (since 6 November)', kind: 'ENFORCED', raw: clean(c[1], 120), why: WHY.ENFORCED }, { text: clean(c[0], 160), kind: 'ADVISORY', raw: clean(c[1], 120), why: 'for everything but main: ' + WHY.ADVISORY }); kinds.ENFORCED++; kinds.ADVISORY++ }
                else { bars.push({ text: clean(c[0], 160), kind: kd, raw: clean(c[1], 120), why: WHY[kd] }); kinds[kd]++ } }
            const lic = table(section(t, 'Licence to Operate')).filter(c => c.length >= 2 && c[0]).map(c => [clean(c[0], 40), clean(c[1], 160)])
            const vm = section(t, 'Provenance').match(/(Version \d+[^.;(]*)/) || t.match(/(Draft \d+)/)
            const ev = []; for (const [rid, , rx] of RES) { const mm = reach.match(new RegExp('[^.\\n]*(' + rx.source + ')[^.\\n]*')); if (mm) { ev.push({ to: rid, quote: clean(mm[0].replace(/^\s*-\s*/, ''), 200) }); used[rid] = (used[rid] || 0) + 1 } }
            const pol = { id: 'abp-' + slug, type: 'policy', title: 'Policy: ' + addr, agent: addr, links: [], ilinks: ev.map(x => x.to), evidence: ev, src: 'abp/' + slug, url: SITE + 'abp/' + slug + '/index.html', status: 'ADVISORY', reach: bullets(reach, 6), mandate: bullets(section(t, 'Mandate'), 5), gap, barriers: bars, licence: lic, version: vm ? clean(vm[1], 60) : '', phase: 'Explorer phase: observes and recommends; blocks nothing.' }
            if (!A.has(key)) { const mo = (addr.toLowerCase().match(/\.([a-z]+)/g) || []).map(x => x.slice(1)).find(x => humans[x]) || ''; A.set(key, { id: 'a-' + key, type: 'agent', title: addr, owner: mo, job: '', schedule: '', links: humans[mo] ? ['p-' + mo] : [], ilinks: [], src: pol.src, status: 'REAL' }) }
            A.get(key).links.push(pol.id); A.get(key).policy = pol.id; policies.push(pol) })
        for (const [rid, name] of RES) if (used[rid]) notes.push({ id: rid, type: 'resource', title: name, links: [], src: "named in the agents' Reach sections", status: 'REAL' })
        // the latest commit of each agent: the last 100 commits on dev (GitHub), matched on "<agent>: "
        let latest = []
        try { const cs = await commits(); const fmt = d => { const x = new Date(d); return x.toLocaleString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' }) + ' ' + x.toISOString().slice(11, 16) }
            for (const a of A.values()) { const c = cs.find(c => String(c.commit && c.commit.message || '').startsWith(a.title + ':')); if (c) { a.latest = { hash: c.sha.slice(0, 8), at: fmt(c.commit.committer.date), subject: clean(c.commit.message.split('\n')[0].replace(/^[^:]+:\s*/, ''), 140), url: safe(c.html_url) || ('https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/' + c.sha.slice(0, 8)), t: c.commit.committer.date } } }
            latest = [...A.values()].filter(a => a.latest).map(a => ({ ...a.latest, agent: a.title })).sort((x, y) => String(y.t).localeCompare(String(x.t))).slice(0, 8) } catch { }
        // the role policies, and who agreed them
        const ROLES = ['analyst', 'cartographer', 'conductor', 'curator', 'designer', 'researcher', 'security', 'writer']
        const rp = (await pool(ROLES, 8, r => get(SITE + 'team/' + r + '/policy.json'))).filter(Boolean)
        const byOwner = {}; for (const a of A.values()) if (a.owner) byOwner[a.owner] = (byOwner[a.owner] || 0) + 1
        const stats = { agents: A.size, agents_with_policy: [...A.values()].filter(a => a.policy).length, policies: policies.length, role_policies: rp.length, role_policies_agreed: rp.filter(p => p.agreed_by).length, by_owner: Object.fromEntries(Object.entries(byOwner).sort((a, b) => b[1] - a[1])), latest }
        if (dev) Object.assign(stats, { barriers: kinds, gaps_open: open, gaps_closed: closed })
        else for (const p of policies) { delete p.gap; delete p.barriers }
        return { about: "The Agent Universe, read live: the team's own agents in RiskMandate's model, from the site's own pages at this moment.", as_of: new Date().toISOString().slice(0, 16) + 'Z', live: true, stats, notes: [...notes, ...A.values(), ...policies] }
    }

    // ---- the Web Summit layer: the public CRM vault, read with its published key, joined to what we have ----
    const VLIB = SITE + 'assets/vendor/sg-vault/2026-11-04/', VFILES = ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js', 'sg-vault/sg-vault-ref-manager.js', 'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js', 'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js', 'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js']
    const script = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error(src)); document.head.appendChild(s) })
    let VL = null; const vlib = () => VL || (VL = (async () => { if (!window.SGVault) for (const f of VFILES) await script(VLIB + f) })())
    async function readVault(cfg) {
        await vlib()
        const c = await SGVaultCrypto.deriveReadOnlyCreds(cfg.vault_id, cfg.read_key.replace(/^sgit_public_read_/, ''))
        const v = await SGVault.openReadOnly(new SGSend({ endpoint: cfg.endpoint }), c.vaultId, c.readKeyB64, c.refFileId)
        const read = async file => { const parts = file.split('/'), name = parts.pop(); let p = ''; for (const part of parts) { p += '/' + part; if (v.needsLoading && v.needsLoading(p)) await v.loadSubTreeOnDemand(p) } return JSON.parse(new TextDecoder().decode(await v.getFile('/' + parts.join('/'), name))) }
        const [N, E] = await Promise.all([read('graph/nodes.json'), read('graph/edges.json')])
        return { N: Array.isArray(N) ? N : N.nodes, E: Array.isArray(E) ? E : E.edges }
    }
    const KS = { company: 'company', organisation: 'org', contact: 'speaker', session: 'session', summit: 'session', pitch: 'pitch', announcement: 'pitch', 'side-event': 'side', 'night-summit': 'side', festival: 'side', registration: 'hub', topic: 'hub', event: 'hub' }
    const DAY = { '2026-11-09': 'Mon 9', '2026-11-10': 'Tue 10', '2026-11-11': 'Wed 11', '2026-11-12': 'Thu 12' }
    async function summit(opts = {}) {
        const crm = await get(SITE + 'data/crm.json'), cfg = { ...crm.public, endpoint: crm.endpoint }
        const [{ N, E }, team, comp, data] = await Promise.all([readVault(cfg), get(SITE + 'data/team.json'), get(SITE + 'data/companies.json').catch(() => []), opts.dataUrl ? get(opts.dataUrl).catch(() => null) : Promise.resolve(null)])
        const notes = [], byId = new Map()
        for (const n of N) { const k = n.kind || n.type, t = KS[k] || 'note'; let b = []
            if (k === 'company' || k === 'organisation') b = [n.what || '', [n.category, n.country, n.attending_as].filter(Boolean).join(' · ')]
            else if (k === 'contact') b = [[n.role, n.organisation].filter(Boolean).join(', ')]
            else if (['session', 'pitch', 'side'].includes(t) || k === 'registration') b = [[DAY[n.date] || n.date || '', (n.start || '') + (n.end ? '–' + n.end : ''), n.where || ''].filter(Boolean).join(' · ')]
            const note = { id: n.id, kind: 'note', type: t, title: clean(n.label || n.id, 140), bullets: b.filter(Boolean).map(x => clean(x, 200)), tags: [k], links: [], url: safe(n.website), src: 'crm' }; notes.push(note); byId.set(n.id, note) }
        for (const e of E) { const a = byId.get(e.from), z = byId.get(e.to); if (a && z && !a.links.includes(z.id)) a.links.push(z.id) }
        const low = new Map(notes.filter(n => n.type === 'company' || n.type === 'org').map(n => [n.title.toLowerCase().split(' (')[0], n]))
        const hub = { id: 'ours:riskmandate', kind: 'note', type: 'ours', title: 'RiskMandate at Web Summit 2026', bullets: ['Stand A1-30, 9 to 12 November, Lisbon', 'Give agents access. Not free rein.'], tags: ['ours'], links: byId.has('event:web-summit-lisbon-2026') ? ['event:web-summit-lisbon-2026'] : [], src: 'ours' }
        notes.push(hub)
        for (const m of (team.members || []).filter(m => m.kind === 'human')) notes.push({ id: 'ours:p-' + m.id, kind: 'note', type: 'person', title: m.name, bullets: [clean(m.role || m.summary || '', 160)].filter(Boolean), tags: ['team'], links: [hub.id], src: 'ours' })
        for (const c of (Array.isArray(comp) ? comp : comp.companies || [])) { const m = low.get(String(c.name || '').toLowerCase().split(' (')[0]); if (m) { if (c.why_it_matters) m.bullets.push('Why it matters to us: ' + clean(c.why_it_matters, 200)); m.tags.push('on our map'); m.links.push(hub.id) } }
        const people = new Set((team.members || []).filter(m => m.kind === 'human').map(m => m.id))
        for (const i of ((data && data.issues) || []).filter(i => i.status !== 'done' && ['outreach', 'merch', 'riskmandate', 'pm', 'content'].includes(i.area))) {
            const fo = (Array.isArray(i.for) ? i.for : String(i.for || '').split(/[,\s]+/)).map(x => String(x).toLowerCase()).filter(x => people.has(x)).map(x => 'ours:p-' + x)
            notes.push({ id: 'ours:' + i.id, kind: 'note', type: 'issue', title: i.id + ' ' + clean(i.title, 120), bullets: [clean(i.body, 200)].filter(Boolean), tags: ['task', i.area], links: fo.length ? fo : [hub.id], src: 'ours' }) }
        notes.live = true; notes.as_of = new Date().toISOString().slice(0, 16) + 'Z'
        return notes
    }
    // who is working now: the last 100 commits on dev, newest first, each with its agent (the subject's "<agent>: ")
    async function activity() {
        const cs = await commits()
        return cs.map(c => { const msg = String(c.commit && c.commit.message || ''), m = msg.match(/^([A-Za-z0-9._-]+@[A-Za-z0-9._-]+):\s*(.*)/); return { agent: m ? m[1] : '', subject: clean((m ? m[2] : msg).split('\n')[0], 140), at: c.commit.committer.date, hash: c.sha.slice(0, 8), url: safe(c.html_url) } }).filter(x => x.agent)
    }
    window.LiveUniverse = { agents, summit, activity }
})()
;
// The Universe (dashboard@web-summit.silvio, 10 November 2026), on the command centres of Silvio, Angelo, Jose and
// Dinis: one 3D map with layers. "Agents & policies": our agents and their behaviour policies, from the public ABPs on
// this site (universe.json beside this file, with its "as of"). "Web Summit": the public CRM of Web Summit 2026 joined
// to our team, company map and summit tasks (summit-brain.json). "My notes": your own second brain, kept in this
// browser only (nothing is sent to the site). The agents' open gaps and barriers, and the panels built on them, are for
// the developers only: they are sealed to their person keys (data/sealed/<id>/universe-gaps.json, ws-ecies-1) and
// opened in their browser by the site's keyring (assets/keyring.js); everyone else sees the map and who each agent is.
// The 3D libraries (3d-force-graph 1.80.1, three 0.186.1) are bundled in brain-libs.js, same origin, loaded only when
// the map opens. Built in Silvio's Lab first, then brought here at his word.
(function () {
    'use strict'
    const BASE = (document.currentScript && document.currentScript.src || location.href).replace(/[^/]*$/, '')
    const LS = 'cc.brain', COLS = ['inbox', 'wiki', 'outputs']
    const empty = () => ({ inbox: [], notes: [], reports: [] })
    const local = () => { try { return JSON.parse(localStorage.getItem(LS)) || null } catch { return null } }
    let cache = local() || empty(), db = null, sample = null, ready = false
    const changed = () => window.dispatchEvent(new Event('cc-brain'))
    const toDocs = b => ({ inbox: b.inbox, wiki: b.notes.filter(n => n.kind !== 'answer'), outputs: b.notes.filter(n => n.kind === 'answer') })
    // writes one at a time, only what changed
    let queue = Promise.resolve()
    function sync(prev, next) {
        if (!db) return
        const a = toDocs(prev), z = toDocs(next)
        for (const c of COLS) {
            const old = new Map(a[c].map(x => [x.id, JSON.stringify(x)])), now = new Map(z[c].map(x => [x.id, x]))
            for (const [id, x] of now) if (old.get(id) !== JSON.stringify(x)) queue = queue.then(() => db.collection(c).doc(id).set(x)).catch(e => console.warn('brain write', e && e.message))
            for (const id of old.keys()) if (!now.has(id)) queue = queue.then(() => c === 'inbox' ? db.collection(c).doc(id).delete() : db.collection(c).doc(id).set({ deleted: true })).catch(e => console.warn('brain delete', e && e.message))
        }
        if (JSON.stringify(prev.reports) !== JSON.stringify(next.reports)) queue = queue.then(() => db.collection('reports').doc('latest').set({ list: next.reports.slice(0, 10) })).catch(() => {})
    }
    const api = {
        get: () => cache,
        set: b => { const prev = cache; cache = { inbox: b.inbox || [], notes: b.notes || [], reports: b.reports || [] }; try { localStorage.setItem(LS, JSON.stringify(cache)) } catch {} ; if (ready) sync(prev, cache) },
        hasLLM: () => !!sample,
        llm: async prompt => { const r = await sample(prompt, { modelTier: 'default' }); return (r && r.text) || '' },
        where: () => db ? 'this private page' : 'this browser',
        graph, pulse, intro,
        // stop drawing while the map is off screen (left the step or the view); graph() starts it again
        pause: () => { try { if (G.fg && G.holder && !document.body.contains(G.holder)) { stopDemo(); G.fg.pauseAnimation() } } catch {} },
    }
    // how the brain works, in one card: four steps, the colours, and where things come from
    function intro() {
        let hide = false; try { hide = localStorage.getItem('cc.brain.intro') === 'hidden' } catch {}
        if (hide) return `<div class="cc-span-12 bi-again"><button type="button" class="bi-q" data-bi="show" aria-label="How the brain works">?</button><span>How the brain works</span></div>`
        const step = (n, t, d, svg) => `<li><div class="bi-ico" aria-hidden="true">${svg}</div><div><b><span>${n}</span>${t}</b><p>${d}</p></div></li>`
        const I = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`
        return `<section class="cc-card cc-span-12 bi" aria-labelledby="bi-h"><header class="bi-head"><h2 id="bi-h">How the brain works</h2><button type="button" class="more" data-bi="hide">Got it ✕</button></header>
<p class="bi-lead">Your second brain keeps everything about Web Summit in one place and lets Claude connect it. Nothing to sort: you throw things in, Claude files them and links them, and you ask questions.</p>
<ol class="bi-steps">
${step(1, 'Capture', 'Paste anything into <b>Capture</b> (a note, a link, an email, what someone said at the stand). It lands in the <b>Inbox</b>. Visitors at the stand are not in your notes: they are points on the Visitors layer, kept with their visit.', I('<path d="M12 5v14M5 12h14"/>'))}
${step(2, 'Claude organises', '<b>Organise with Claude</b> turns each item into a note in the <b>Wiki</b>: a title, 3 lines of summary, tags, and links to the notes on the same theme. It also reports the themes and anything that contradicts.', I('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'))}
${step(3, 'Ask', '<b>Ask my brain</b> answers only from your notes, and shows which notes it used. If the answer is not there, it says so instead of guessing.', I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'))}
${step(4, 'Save, and it gets sharper', '<b>Save as a note</b> puts a good answer in <b>Outputs</b>, linked to the notes it came from. Next time, the brain uses your own past thinking.', I('<path d="M5 12l4 4L19 6"/>'))}
</ol>
<div class="bi-map"><h3>Reading the map</h3><p>Every point is a note; every line is a link between two notes. Bigger points have more links. Tap a point to read it; <b>Play demo</b> flies through the main themes; <b>Cinema</b> fills the screen for the stand.</p>
<p class="bi-legend">${LEG.map(([k, l]) => `<span><i style="--c:${COL[k]}"></i>${l}</span>`).join('')}</p></div>
<div class="bi-map"><h3>Where things come from</h3><ul>
${db ? '' : '<li><b>Web Summit</b>: the public CRM of Web Summit (companies, speakers, sessions, pitches, side events, topics) joined to our team, our company map and our summit tasks.</li><li><b>Agents &amp; policies</b>: our agents and their behaviour policies, from the public policies on this site. Their open gaps are for the developers only.</li>'}${db ? `<li><b>The Summit demo</b>: every visitor becomes a point on the Visitors layer (kept with the visit, not in your notes), linked to their company, the themes they asked about, who follows up, and their stage in the plan (Visitor → Lead → Meeting → Customer).</li>
<li><b>The plan</b>: the pipeline stages are points of their own, and Dinis's answers to the six questions become notes the brain can quote.</li>` : ''}
<li><b>The site</b>: the tasks, the companies we mapped, the sessions, side events, the team and their agents.</li>
<li><b>You</b>: whatever you capture. ${db ? 'Private: only people who can edit this page can read it.' : 'It stays in this browser only: nothing is sent to the site. <b>Export</b> keeps a copy.'}</li></ul></div></section>`
    }
    document.addEventListener('click', e => { const b2 = e.target.closest && e.target.closest('[data-bi]'); if (!b2) return; try { localStorage.setItem('cc.brain.intro', b2.dataset.bi === 'hide' ? 'hidden' : 'shown') } catch {} ; window.dispatchEvent(new Event('cc-brain')) })
    window.CC_BRAIN = api
    addEventListener('hashchange', () => setTimeout(api.pause, 400))
    // (the Agent Universe is now a layer of the one Universe map, on the brain page)); [4500, 9000].forEach(ms => setTimeout(() => { if (G.fg && G.which === 'universe' && !G.hot.size && !G.demo) { G.fg.zoomToFit(1000, 30); fitRing() } }, ms)) } }
    // the page's own folders, live: another device or Claude Code writing them shows up here
    ;(async () => {
        if (!window.claude || !window.claude.use) return
        try { sample = await window.claude.use('sample') } catch { sample = null }
        try { db = await window.claude.use('db') } catch { db = null }
        if (!db) { changed(); return }
        const parts = { inbox: null, wiki: null, outputs: null, reports: null }
        const merge = () => {
            if (Object.values(parts).some(x => x === null)) return
            cache = { inbox: parts.inbox.sort((x, y) => String(x.at).localeCompare(String(y.at))), notes: [...parts.wiki, ...parts.outputs], reports: parts.reports }
            try { localStorage.setItem(LS, JSON.stringify(cache)) } catch {}
            ready = true; changed(); if (G.fg) G.refresh()
        }
        const t = setTimeout(() => { if (!ready) { db = null; changed() } }, 10000)
        const unpack = docs => { const base = [], own = new Map(), dead = new Set(); for (const d of docs) { const x = d.data() || {}; if (Array.isArray(x.pack)) base.push(...x.pack); else if (x.deleted) dead.add(d.id); else own.set(d.id, { ...x, id: d.id }) } return [...base.filter(n => !own.has(n.id) && !dead.has(n.id)), ...own.values()] }
        for (const c of COLS) db.collection(c).limit(1000).onSnapshot(s => { clearTimeout(t); parts[c] = c === 'inbox' ? s.docs.map(d => ({ ...d.data(), id: d.id })) : unpack(s.docs); merge() }, () => { clearTimeout(t) })
        db.collection('reports').limit(5).onSnapshot(s => { const d = s.docs.find(x => x.id === 'latest'); parts.reports = d ? (d.data().list || []) : []; merge() }, () => { parts.reports = []; merge() })
    })()

    // ---------------- the 3D map, premium: points of light, real glow (bloom), deep space, a geodesic core ----------------
    // One graphics engine for all: 3d-force-graph 1.80.1 as a module, and three 0.186.1 (the version it is built on)
    // for the glow pass, the stars, the core and the ring. Sharp on Retina: pixel ratio up to 2.
    const COL = { hub: '#F2C66D', person: '#E6ECFF', issue: '#E46FD0', company: '#F79A62', session: '#41D3EE', side: '#9B8CFF', agent: '#56E0A8', answer: '#C7A5FF', note: '#EE8FD6', merch: '#F2D27A', visitor: '#FF6B86', speaker: '#A9C7FF', org: '#B9A07A', pitch: '#FF9DB5', ours: '#F2C66D', policy: '#E9C46A', resource: '#8FA6C2' }
    const LEGS = { universe: [['person', 'People'], ['agent', 'Agents (person colour)'], ['policy', 'Policies (ABP)'], ['resource', 'Resources (inferred)']], summit: [['visitor', 'Visitors'], ['ours', 'RiskMandate'], ['person', 'Our team'], ['issue', 'Our tasks'], ['hub', 'Topics'], ['company', 'Companies'], ['org', 'Organisations'], ['speaker', 'Speakers'], ['session', 'Sessions'], ['pitch', 'Pitches'], ['side', 'Side events']] }
    const LEG = [['visitor', 'Visitors'], ['hub', 'Themes'], ['person', 'People'], ['issue', 'Tasks'], ['session', 'Sessions'], ['side', 'Side events'], ['company', 'Companies'], ['agent', 'Agents'], ['note', 'My notes'], ['answer', 'Answers']]
    const LAYERS = [['agents', 'Agents & policies'], ['summit', 'Web Summit'], ['mine', 'My notes'], ['visitors', 'Visitors']]
    const layersSaved = () => { try { const v = JSON.parse(localStorage.getItem('cc.brain.layers')); return Array.isArray(v) ? v : null } catch { return null } }
    const G = { fg: null, holder: null, sig: '', hot: new Set(), hotLinks: new Set(), off: new Set(), raf: 0, opts: {}, demo: null, deco: null, which: 'all', layers: new Set(layersSaved() || LAYERS.map(x => x[0])) }
    let THREE = null, FG = null, Bloom = null
    const libs = async () => { if (FG) return; if (window.BrainLibs) { FG = window.BrainLibs.ForceGraph3D; THREE = window.BrainLibs.THREE; Bloom = window.BrainLibs.UnrealBloomPass; return } await new Promise((ok, no) => { const s = document.createElement('script'); s.src = BASE + 'brain-libs.js'; s.onload = ok; s.onerror = () => no(new Error('brain-libs.js')); document.head.appendChild(s) }); const m = window.BrainLibs; FG = m.ForceGraph3D; THREE = m.THREE; Bloom = m.UnrealBloomPass }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    // each person's balloon in their T-shirt colour (the print set, /print/), as luminous glass:
    // black → smoked obsidian, royal blue → sapphire, green → emerald, orange → amber, purple → amethyst, red → ruby, yellow → gold
    const SHIRT = { dinis: '#7D879E', nimay: '#4F7BFF', angelo: '#2ED48C', jose: '#FF8A3D', vicky: '#A877FF', silvio: '#FF3347', indi: '#FFD23F' }
    const colOf = n => { if (n.type === 'agent' && n.n && SHIRT[n.n.owner]) return SHIRT[n.n.owner]; const m = /^(?:ours:)?p-([a-z]+)$/.exec(n.id || ''); return (m && SHIRT[m[1]]) || COL[n.type] }
    const typeOf = n => n.kind === 'answer' ? 'answer' : (n.type && COL[n.type] ? n.type : 'note')
    // a soft point of light: white-hot centre, the colour, then a long faint halo
    const TEX = {}
    function glow(color) {
        if (TEX[color]) return TEX[color]
        const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d')
        const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
        r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.07, 'rgba(255,255,255,0.9)'); r.addColorStop(0.14, color); r.addColorStop(0.3, color + '66'); r.addColorStop(0.55, color + '18'); r.addColorStop(1, color + '00')
        g.fillStyle = r; g.fillRect(0, 0, s, s)
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return (TEX[color] = t)
    }
    const mix = (hex, to, k) => { const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16); const c = s => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k); return `rgb(${c(16)},${c(8)},${c(0)})` }
    function spark(color) {
        const k = 'spark' + color; if (TEX[k]) return TEX[k]
        const s = 128, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d'), m = s / 2
        const v = parseInt(color.slice(1), 16), rgba = a => `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`
        let r = g.createRadialGradient(m, m, 0, m, m, m); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.12, rgba(1)); r.addColorStop(0.32, rgba(0.35)); r.addColorStop(1, rgba(0))
        g.fillStyle = r; g.fillRect(0, 0, s, s); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return (TEX[k] = tx)
    }
    const HUDC = { person: '#DFF6FF', agent: '#4FD1F5', policy: '#8FB4FF', resource: '#C8F4FF' }
    const styleSaved = () => { try { return localStorage.getItem('cc.brain.style') === 'glass' ? 'glass' : 'hud' } catch { return 'hud' } }
    const hudOn = () => G.which === 'universe' || G.which === 'all'
    const STY_LBL = () => (G.style || styleSaved()) === 'glass' ? 'Light points' : 'Balloons'
    const hudCol = n => n.type === 'agent' ? (SHIRT[n.n && n.n.owner] || '#4FD1F5') : n.type === 'policy' ? (SHIRT[UNI && UNI.pown[n.id]] || '#8FB4FF') : (HUDC[n.type] || COL[n.type] || '#4FD1F5')
    function setHud() {
        const on = hudOn(); if (G.holder) { G.holder.classList.toggle('hud', on); G.holder.classList.toggle('uni', G.which === 'all') }
        const sb = G.dock && G.dock.querySelector('[data-bm="style"]'); if (sb) { sb.hidden = true; sb.querySelector('.lbl').textContent = STY_LBL(); sb.setAttribute('aria-pressed', String(!on)) }
        if (G.fg) G.fg.backgroundColor(on ? '#020509' : '#03040C')
        ;(G.decoAll || []).forEach(o => { if (o !== G.stars) o.visible = !on }); if (G.stars) G.stars.material.opacity = on ? 0.35 : 0.8
    }
    function orb(color) {
        const k = 'glass' + color; if (TEX[k]) return TEX[k]
        const s = 512, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d'), m = s / 2, R = s * 0.4
        const rgba = (hex, al) => { const v = parseInt(hex.slice(1), 16); return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${al})` }
        let r = g.createRadialGradient(m, m, R * 0.98, m, m, R * 1.22)                     // a faint outer glow
        r.addColorStop(0, rgba(color, 0.28)); r.addColorStop(1, rgba(color, 0)); g.fillStyle = r; g.beginPath(); g.arc(m, m, R * 1.22, 0, 7); g.fill()
        r = g.createRadialGradient(m, m, 0, m, m, R)                                          // the glass: almost clear inside, coloured toward the edge
        r.addColorStop(0, rgba(color, 0.03)); r.addColorStop(0.55, rgba(color, 0.06)); r.addColorStop(0.82, rgba(color, 0.24)); r.addColorStop(0.95, rgba(color, 0.7)); r.addColorStop(1, rgba(color, 0.9))
        g.fillStyle = r; g.beginPath(); g.arc(m, m, R, 0, 7); g.fill()
        g.lineWidth = s * 0.006; g.strokeStyle = mix(color, '#FFFFFF', 0.7); g.beginPath(); g.arc(m, m, R - g.lineWidth / 2, 0, 7); g.stroke()   // the rim
        r = g.createLinearGradient(m - R * 0.7, m - R * 0.7, m, m)                             // the window highlight, top-left
        r.addColorStop(0, 'rgba(255,255,255,0.85)'); r.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = r; g.beginPath(); g.ellipse(m - R * 0.36, m - R * 0.42, R * 0.38, R * 0.2, -0.75, 0, 7); g.fill()
        g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(m - R * 0.5, m - R * 0.52, R * 0.06, 0, 7); g.fill()   // a sharp glint
        r = g.createRadialGradient(m + R * 0.42, m + R * 0.5, 0, m + R * 0.42, m + R * 0.5, R * 0.3)   // a soft reflection, bottom-right
        r.addColorStop(0, rgba(mixHex(color, '#FFFFFF', 0.5), 0.45)); r.addColorStop(1, rgba(color, 0)); g.fillStyle = r; g.beginPath(); g.ellipse(m + R * 0.42, m + R * 0.5, R * 0.3, R * 0.14, -0.75, 0, 7); g.fill()
        const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return (TEX[k] = tx)
    }
    const mixHex = (hex, to, k) => { const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16); const c = s => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k); return '#' + [c(16), c(8), c(0)].map(x => x.toString(16).padStart(2, '0')).join('') }
    // a nebula: no bright centre, only a soft wash of colour
    function veil(color) {
        const k = 'veil' + color; if (TEX[k]) return TEX[k]
        const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d')
        const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); r.addColorStop(0, color + '30'); r.addColorStop(0.5, color + '12'); r.addColorStop(1, color + '00')
        g.fillStyle = r; g.fillRect(0, 0, s, s); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return (TEX[k] = tx)
    }
    const sizeOf = n => hudOn() ? (n.type === 'person' ? 13 : n.type === 'resource' ? 16 : n.type === 'ours' ? 18 : n.type === 'hub' ? 12 + Math.min(6, n.deg * 0.1) : n.type === 'policy' ? 6 : 8 + Math.min(9, n.deg * 0.9)) : n.type === 'resource' ? 24 : n.type === 'policy' ? 9 : (n.type === 'agent' && G.which === 'universe') ? 12 + Math.min(6, n.deg) : n.type === 'ours' ? 34 : n.type === 'hub' ? 27 + Math.min(12, n.deg * 0.28) : n.type === 'person' ? 23 + Math.min(7, n.deg * 0.18) : n.type === 'visitor' ? 20 : 11 + Math.min(9, n.deg * 1.0)
    let SUMMIT = null
    // live first (live-universe.js reads every source at this moment); the files beside this page only if a source does not answer
    const LAB_DEV = false   // on the public site only a developer's own key shows the gaps
    const dataLive = () => /(^|\.)web-summit\.sgit\.ai$/.test(location.hostname) ? new URL(((document.getElementById('cc') || {}).dataset || {}).src || 'data.json', location.href).href : 'https://web-summit.sgit.ai/people/silvio/app/data.json'
    // the last live reading on this device opens the map at once; a new reading follows within seconds and replaces it
    const keep = { get: k => { try { const v = JSON.parse(localStorage.getItem('cc.live.' + k)); return v && v.data ? v : null } catch { return null } }, set: (k, data) => { try { localStorage.setItem('cc.live.' + k, JSON.stringify({ at: Date.now(), data })) } catch {} } }
    const redraw = () => { G.sig = ''; try { if (G.dock) { const lg = G.dock.querySelector('.bm-legend'); if (lg) lg.innerHTML = legend() } if (G.refresh) G.refresh(true); placePanels(); circuit() } catch (e) { console.warn('redraw', e) } }
    const summitLive = () => (window.LiveUniverse ? window.LiveUniverse.summit({ dataUrl: dataLive() }) : Promise.reject(new Error('no live reader'))).then(x => { if (!x || !x.length) throw new Error('empty'); const a = Array.from(x); a.live = true; a.as_of = x.as_of; keep.set('summit', { notes: a, as_of: x.as_of }); return a })
    const loadSummit = () => { if (SUMMIT) return Promise.resolve(SUMMIT); const k = keep.get('summit')
        if (k) { SUMMIT = k.data.notes; SUMMIT.live = true; SUMMIT.as_of = k.data.as_of; summitLive().then(x => { const changed = x.length !== SUMMIT.length; SUMMIT = x; if (changed) redraw() }).catch(() => {}); return Promise.resolve(SUMMIT) }
        return summitLive().then(x => (SUMMIT = x)).catch(e => { console.warn('summit live', e && e.message); return fetch(BASE + 'summit-brain.json').then(r => r.json()).then(x => (SUMMIT = x)) }).catch(() => (SUMMIT = [])) }
    let UNI = null
    // the agents' gaps and barriers: in the Lab they come with universe.json; on the public site they are sealed (see devGaps)
    const DEVS = ['silvio', 'dinis', 'angelo']
    const devGaps = async x => {
        try {
            const K = window.WSKeyring; if (!K) return x
            await K.ready.catch(() => null); const who = K.person; if (!who || !DEVS.includes(who)) return x
            const env = await (await fetch(BASE + '../../data/sealed/' + who + '/universe-gaps.json', { cache: 'no-cache' })).json()
            const g = await K.open(env)
            if (!g || g.as_of !== x.as_of) return x
            x.notes.forEach(n => { const d = g.gaps[n.id]; if (d) { n.gap = d.gap; n.barriers = d.barriers } })
            x.stats = { ...x.stats, ...g.stats }
        } catch (e) { console.warn('universe gaps', e && e.message) }
        return x
    }
    const isDev = async () => { const K = window.WSKeyring; if (!K) return LAB_DEV; try { await K.ready } catch {} return ['silvio', 'dinis', 'angelo'].includes(K.person) }
    const prep = x => { x.pown = {}; x.notes.forEach(n => { if (n.type === 'agent' && n.policy) x.pown[n.policy] = n.owner }); x.dev = x.notes.some(n => n.type === 'policy' && Array.isArray(n.gap)) && !!(x.stats && x.stats.barriers); return x }
    const sigU = x => JSON.stringify(x.notes.map(n => [n.id, n.links && n.links.length, n.latest && n.latest.hash, n.gap && n.gap.length]))
    const uniLive = () => (window.LiveUniverse ? isDev().then(dev => window.LiveUniverse.agents({ dev })) : Promise.reject(new Error('no live reader'))).then(x => { prep(x); isDev().then(dev => { if (dev || !x.dev) keep.set('universe' + (dev ? '.dev' : ''), x) }); return x })
    const loadUniverse = () => { if (UNI) return Promise.resolve(UNI)
        return isDev().then(dev => { const k = keep.get('universe' + (dev ? '.dev' : ''))
            if (k) { UNI = prep(k.data); uniLive().then(x => { const ch = sigU(x) !== sigU(UNI); UNI = x; ch ? redraw() : circuit() }).catch(() => {}); return UNI }
            return uniLive().then(x => (UNI = x)).catch(e => { console.warn('universe live', e && e.message); return loadUniverseFile() }) }) }
    // every 5 minutes, while the map is on the screen, read again; redraw only if something changed
    setInterval(() => { if (!UNI || !UNI.live || !G.holder || !document.body.contains(G.holder)) return; const old = JSON.stringify(UNI.notes.map(n => [n.id, n.links && n.links.length, n.latest && n.latest.hash, n.gap && n.gap.length]))
        uniLive().then(x => { if (sigU(x) === old) { UNI.as_of = x.as_of; circuit(); return } UNI = x; redraw() }).catch(() => {}) }, 300000)
    const loadUniverseFile = () => fetch(BASE + 'universe.json').then(r => r.json()).then(x => { x.pown = {}; x.notes.forEach(n => { if (n.type === 'agent' && n.policy) x.pown[n.policy] = n.owner }); return devGaps(x) }).then(x => { x.dev = x.notes.some(n => n.type === 'policy' && Array.isArray(n.gap)) && !!(x.stats && x.stats.barriers); return (UNI = x) }).catch(() => (UNI = { notes: [], stats: null, as_of: '' }))
    const safeUrl = u => /^https:\/\//.test(String(u || '')) ? String(u) : ''
    const loadAll = () => Promise.all([loadUniverse(), loadSummit()])
    function layerNotes() {
        const L = G.layers, out = new Map()
        const put = (n, layer) => { const o = out.get(n.id); if (o) { o.links = [...new Set([...(o.links || []), ...(n.links || [])])]; o.related = [...new Set([...(o.related || []), ...(n.related || [])])]; return } out.set(n.id, { ...n, __layer: layer }) }
        const isLive = n => n.type === 'visitor' || /^h-stage-|^plan-|^c-new-/.test(n.id)
        const deskPts = (window.CC_DESK && window.CC_DESK.points()) || []
        if (L.has('agents') && UNI) UNI.notes.forEach(n => put(n, 'agents'))
        if (L.has('summit') && SUMMIT) SUMMIT.forEach(n => put({ ...n, id: n.id.replace(/^ours:p-/, 'p-'), links: (n.links || []).map(x => x.replace(/^ours:p-/, 'p-')) }, 'summit'))
        if (L.has('mine')) cache.notes.filter(n => !isLive(n)).forEach(n => put(n, 'mine'))
        if (L.has('visitors')) {
            const byTitle = new Map((SUMMIT || []).filter(n => n.type === 'company' || n.type === 'org').map(n => [String(n.title).toLowerCase().split(' (')[0], n.id]))
            ;[...cache.notes.filter(n => /^plan-/.test(n.id)), ...deskPts].forEach(n => put({ ...n, links: [...(n.related || []).map(r => byTitle.get(String(r).toLowerCase().split(' (')[0])).filter(Boolean), 'ours:riskmandate'] }, 'visitors'))
        }
        return [...out.values()]
    }
    const layerCount = k => k === 'agents' ? ((UNI && UNI.notes.length) || 0) : k === 'summit' ? ((SUMMIT && SUMMIT.length) || 0) : k === 'mine' ? cache.notes.filter(n => !(n.type === 'visitor' || /^h-stage-|^plan-|^c-new-/.test(n.id))).length : ((window.CC_DESK && window.CC_DESK.points()) || []).filter(n => n.type === 'visitor').length
    function source() {
        if (G.which === 'all') return layerNotes()
        if (G.which === 'universe') return (UNI && UNI.notes) || []
        if (G.which !== 'summit') return cache.notes
        const live = [...cache.notes.filter(n => /^plan-/.test(n.id)), ...((window.CC_DESK && window.CC_DESK.points()) || [])]
        const byTitle = new Map((SUMMIT || []).filter(n => n.type === 'company' || n.type === 'org').map(n => [String(n.title).toLowerCase().split(' (')[0], n.id]))
        // a visitor links to the CRM's company of the same name, and to RiskMandate
        const liv = live.map(n => ({ ...n, links: [...(n.related || []).map(r => byTitle.get(String(r).toLowerCase().split(' (')[0])).filter(Boolean), 'ours:riskmandate'] }))
        return [...(SUMMIT || []), ...liv]
    }
    function data() {
        const notes = source().filter(n => !G.off.has(typeOf(n)))
        const byTitle = new Map(notes.map(n => [String(n.title).trim().toLowerCase(), n.id]))
        const nodes = notes.map(n => ({ id: n.id, title: n.title, type: typeOf(n), deg: 0, n }))
        const ids = new Set(nodes.map(x => x.id)), seen = new Set(), links = []
        for (const n of notes) for (const to of n.links || []) {
            if (!to || to === n.id || !ids.has(to)) continue
            const k = n.id < to ? n.id + '|' + to : to + '|' + n.id; if (seen.has(k)) continue; seen.add(k); links.push({ source: n.id, target: to, c: COL[typeOf(n)], h: hudCol({ type: typeOf(n), id: n.id, n }) })
        }
        for (const n of notes) for (const to of n.ilinks || []) {
            if (!to || to === n.id || !ids.has(to)) continue
            const k = n.id < to ? n.id + '|' + to : to + '|' + n.id; if (seen.has(k)) continue; seen.add(k); links.push({ source: n.id, target: to, c: '#1E5A6E', inferred: true })
        }
        for (const n of notes) for (const r of n.related || []) {
            const to = byTitle.get(String(r).trim().toLowerCase()); if (!to || to === n.id || !ids.has(to)) continue
            const k = n.id < to ? n.id + '|' + to : to + '|' + n.id; if (seen.has(k)) continue; seen.add(k); links.push({ source: n.id, target: to, c: COL[typeOf(n)], h: hudCol({ type: typeOf(n), id: n.id, n }) })
        }
        const deg = new Map(); links.forEach(l => { deg.set(l.source, (deg.get(l.source) || 0) + 1); deg.set(l.target, (deg.get(l.target) || 0) + 1) })
        nodes.forEach(x => { x.deg = deg.get(x.id) || 0 })
        if (G.which === 'universe' || G.which === 'all') { const ns = nodes.filter(x => x.deg > 0); return { nodes: ns, links } } // loose points (people with no agents) would push the camera away
        if (G.which === 'summit') { // the main network only: loose islands drift off and shrink the view
            const adj = new Map(); links.forEach(l => { (adj.get(l.source) || adj.set(l.source, []).get(l.source)).push(l.target); (adj.get(l.target) || adj.set(l.target, []).get(l.target)).push(l.source) })
            const keep = new Set(['ours:riskmandate']), q = ['ours:riskmandate']; while (q.length) for (const y of adj.get(q.pop()) || []) if (!keep.has(y)) { keep.add(y); q.push(y) }
            const ns = nodes.filter(x => keep.has(x.id) || x.type === 'visitor'); return { nodes: ns, links: links.filter(l => keep.has(l.source) && keep.has(l.target)) } }
        return { nodes, links }
    }
    const sigOf = () => (G.which || 'mine') + ':' + (window.CC_DESK ? window.CC_DESK.sig() : '') + ':' + (hudOn() ? 'h' : 'g') + ':' + [...G.layers].join() + ':' + (SUMMIT ? SUMMIT.length : 0) + ':' + (UNI ? UNI.notes.length : 0) + ':' + cache.notes.length + ':' + cache.notes.map(n => n.id + (n.related || []).length).join(',').length + ':' + [...G.off].join()
    const legend = () => G.which === 'all' ? LAYERS.filter(([k]) => (!G.stand || k === 'agents' || k === 'summit') && (k !== 'visitors' || window.CC_DESK)).map(([k, l]) => `<button type="button" data-bm-layer="${k}" aria-pressed="${G.layers.has(k)}"><i style="--c:${{ agents: '#4FD1F5', summit: '#F79A62', mine: '#EE8FD6', visitors: '#FF6B86' }[k]}"></i>${l}<b class="lc">${layerCount(k)}</b></button>`).join('') : (LEGS[G.which] || LEG).map(([k, l]) => `<button type="button" data-bm-type="${k}" aria-pressed="${!G.off.has(k)}"><i style="--c:${G.which === 'universe' ? (HUDC[k] || COL[k]) : COL[k]}"></i>${l}</button>`).join('')
    const who = () => { const n = (document.querySelector('.cc-me b') || {}).textContent || ''; return n ? n.split(' ')[0] + "'s brain" : 'My brain' }
    function shell() {
        const h = document.createElement('div'); h.className = 'bm'
        h.innerHTML = `<div class="bm-circuit" hidden></div><div class="bm-canvas" aria-label="A 3D map of the brain: drag to turn, pinch or scroll to zoom, tap a point to open the note"></div><div class="bm-vignette" aria-hidden="true"></div><div class="bm-labels" aria-hidden="true"></div>
<div class="bm-top"><div class="bm-title"><b class="bm-name">${G.which === 'all' ? 'Universe' : G.which === 'summit' ? 'Summit brain' : esc(who())}</b><span class="bm-count"></span></div><div class="bm-which" role="group" aria-label="Which brain"><button type="button" data-bm-which="mine" aria-pressed="true">My brain</button><button type="button" data-bm-which="summit" aria-pressed="false">Summit brain</button><button type="button" data-bm-which="universe" aria-pressed="false">Agent Universe</button></div><label class="sr" for="bm-q">Find in the map</label><input id="bm-q" class="bm-q" type="search" placeholder="Find…" autocomplete="off"></div>
<div class="bm-card" hidden></div><div class="bm-hud" aria-hidden="true"><i class="hx"></i><i class="hy"></i><i class="hc"></i><i class="hf tl"></i><i class="hf tr"></i><i class="hf bl"></i><i class="hf br"></i><div class="hleg"></div><p class="hlog">agent universe :: ready</p></div>
<button type="button" class="bm-exit" data-bm="cinema" aria-label="Leave cinema">✕</button>
<div class="bm-msg" hidden></div>`
        G.dock = document.createElement('div'); G.dock.className = 'bm-dock'
        G.dock.innerHTML = `<div class="bm-legend" role="group" aria-label="Show or hide a kind">${legend()}</div><div class="bm-bar" role="group" aria-label="The map"><button type="button" class="bm-btn play" data-bm="demo">▶ Play demo</button><button type="button" class="bm-btn bm-fullbtn" data-bm="full" aria-pressed="false" title="Full screen">${FULL_ICO(false)}<span class="lbl">Full screen</span></button><button type="button" class="bm-btn bm-viewbtn" data-bm="view" aria-pressed="false" title="Switch the Universe between the 3D map and the circuit"><span class="lbl">Circuit</span></button><button type="button" class="bm-btn bm-stylebtn" data-bm="style" aria-pressed="false" title="Switch the look: light points or glass balloons"><span class="lbl">${STY_LBL()}</span></button><button type="button" class="bm-btn" data-bm="cinema">Cinema</button><button type="button" class="bm-btn" data-bm="reset">Reset</button></div>`
        const onClick = e => {
            const t = e.target.closest('[data-bm],[data-bm-type],[data-bm-go],[data-bm-open],[data-bm-which],[data-bm-layer]'); if (!t) return
            if (t.dataset.bmLayer) { const k = t.dataset.bmLayer; G.layers.has(k) ? G.layers.delete(k) : G.layers.add(k); if (!G.stand) try { localStorage.setItem('cc.brain.layers', JSON.stringify([...G.layers])) } catch {} ; stopDemo(); card(null); G.hot.clear(); G.hotLinks.clear(); G.dock.querySelector('.bm-legend').innerHTML = legend(); placePanels(); G.refresh(true); setTimeout(() => { if (G.fg) { G.fg.zoomToFit(1000, 30); fitRing() } }, 2500); return }
            if (t.dataset.bmWhich) { const w = t.dataset.bmWhich; if (w === (G.which || 'mine')) return; G.which = w; G.off.clear(); stopDemo(); card(null); G.hot.clear(); G.hotLinks.clear()
                h.querySelectorAll('[data-bm-which]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bmWhich === w))); h.querySelector('.bm-name').textContent = w === 'summit' ? 'Summit brain' : w === 'universe' ? 'Agent Universe' : who(); G.dock.querySelector('.bm-legend').innerHTML = legend()
                const go = () => { G.refresh(true); setTimeout(() => { G.fg.zoomToFit(1000, 30); fitRing() }, 1800) }; placePanels(); if (w === 'summit') { h.querySelector('.bm-count').textContent = 'Opening the Summit brain…'; loadSummit().then(go) } else if (w === 'universe') { h.querySelector('.bm-count').textContent = 'Opening the Agent Universe…'; loadUniverse().then(() => { placePanels(); go() }) } else go(); return }
            if (t.dataset.bmType) { const k = t.dataset.bmType; G.off.has(k) ? G.off.delete(k) : G.off.add(k); t.setAttribute('aria-pressed', String(!G.off.has(k))); G.refresh(true) }
            else if (t.dataset.bmGo) { const n = G.fg.graphData().nodes.find(x => x.id === t.dataset.bmGo); if (n) focus(n) }
            else if (t.dataset.bmOpen) { G.opts.open && G.opts.open(t.dataset.bmOpen) }
            else if (t.dataset.bm === 'demo') G.demo ? stopDemo() : demo()
            else if (t.dataset.bm === 'view') { G.view = circOn() ? 'map' : 'circuit'; try { localStorage.setItem('cc.brain.view', G.view) } catch {} ; stopDemo(); card(null); circuit(); if (!circOn() && G.fg) setTimeout(() => { G.fg.zoomToFit(800, 30); fitRing() }, 300) }
            else if (t.dataset.bm === 'style') { G.style = hudOn() ? 'glass' : 'hud'; try { localStorage.setItem('cc.brain.style', G.style) } catch {} ; G.refresh(true) }
            else if (t.dataset.bm === 'cinema') cinema()
            else if (t.dataset.bm === 'full') full()
            else if (t.dataset.bm === 'reset') { stopDemo(); G.hot.clear(); G.hotLinks.clear(); card(null); G.fg.zoomToFit(900, 30); paint() }
            else if (t.dataset.bm === 'close') card(null)
        }
        h.addEventListener('click', onClick); G.dock.addEventListener('click', onClick)
        h.querySelector('.bm-q').addEventListener('input', e => {
            const v = e.target.value.trim().toLowerCase(); G.hot.clear(); G.hotLinks.clear()
            if (v.length > 1) G.fg.graphData().nodes.forEach(n => { if ((n.title + ' ' + (n.n.tags || []).join(' ')).toLowerCase().includes(v)) G.hot.add(n.id) })
            paint()
        })
        h.querySelector('.bm-q').addEventListener('keydown', e => { if (e.key !== 'Enter') return; e.preventDefault(); const v = e.target.value.trim().toLowerCase(); const ns = G.fg ? G.fg.graphData().nodes.filter(n => G.hot.has(n.id)) : []; const best = ns.find(n => n.title.toLowerCase() === v) || ns.sort((a, b) => b.deg - a.deg)[0]; if (best) { stopDemo(); focus(best) } })
        return h
    }
    // highlight: the chosen points stay bright, the rest fade into the sky
    function paint() {
        if (!G.fg) return
        const dim = G.hot.size > 0
        G.fg.graphData().nodes.forEach(n => { const sp = n.__sp; if (!sp) return; const on = !dim || G.hot.has(n.id); sp.material.opacity = on ? 1 : 0.12; sp.scale.setScalar(sizeOf(n) * (dim && G.hot.has(n.id) ? 1.35 : 1)) })
        G.fg.linkColor(l => G.hotLinks.has(l) ? '#FFFFFF' : hudOn() ? (l.inferred ? '#1E5A6E' : (l.h || '#2BA3C7')) : l.c).linkOpacity(dim ? 0.05 : hudOn() ? 0.24 : 0.18)
            .linkWidth(l => G.hotLinks.has(l) ? 0.9 : 0)
            .linkDirectionalParticles(l => G.hotLinks.has(l) ? 5 : 0)
    }
    const KLAB = { ENFORCED: 'ENFORCED', PARTIAL: 'PARTIAL', DETECTIVE: 'DETECTIVE', ADVISORY: 'ADVISORY' }
    // on the stand: who the agent is and that it has a written policy; never its gaps or barriers (F9)
    function standCard(n) {
        const N = n.n, P = N.type === 'policy' ? N : N.policy ? UNI.notes.find(x => x.id === N.policy) : null
        const own = N.type === 'person' ? UNI.notes.filter(x => x.type === 'agent' && x.owner === N.id.slice(2)) : []
        const body = N.type === 'agent' ? `${N.job ? `<p>${esc(N.job)}</p>` : ''}<p class="u-meta">Owner: <b>${esc((UNI.notes.find(x => x.id === 'p-' + N.owner) || {}).title || N.owner || 'unknown')}</b></p><p>${P ? 'Works under a written behaviour policy: what it can reach, what it is mandated to do, and its licence to operate.' : 'No written behaviour policy yet.'}</p>`
            : N.type === 'policy' ? `<p>A written behaviour policy for one agent: what it can reach, what it is mandated to do, and its licence to operate.</p>`
            : N.type === 'person' ? `<p>${own.length} agent${own.length === 1 ? '' : 's'}, ${own.filter(x => x.policy).length} with a behaviour policy.</p>` : ''
        return `<button type="button" class="bm-x" data-bm="close" aria-label="Close">✕</button><p class="bm-kind">${esc(N.type)}</p><h3>${esc(N.title)}</h3>${body}<p class="u-meta">Our own team's agents, from the public policies on web-summit.sgit.ai.</p>`
    }
    function uCard(n) {
        const N = n.n, byId = id => UNI.notes.find(x => x.id === id), P = N.type === 'policy' ? N : N.policy ? byId(N.policy) : null
        const sec = (cls, h, body) => body ? `<div class="u-sec ${cls}"><p class="u-h">${h}</p>${body}</div>` : ''
        const ul = a => a && a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''
        let top = ''
        if (N.type === 'agent') top = `${N.job ? `<p>${esc(N.job)}</p>` : ''}<p class="u-meta">Owner: <b>${esc((UNI.notes.find(x => x.id === 'p-' + N.owner) || {}).title || N.owner || 'unknown')}</b>${N.schedule ? ' · ' + esc(N.schedule) : ''}</p>${N.latest ? `<p class="u-meta">Latest commit, as of the build: ${safeUrl(N.latest.url) ? `<a href="${esc(safeUrl(N.latest.url))}" target="_blank" rel="noopener">${esc(N.latest.hash)}</a>` : esc(N.latest.hash)} · ${esc(N.latest.at)} · ${esc(N.latest.subject)}</p>` : ''}${P ? '' : '<p class="u-meta">No behaviour policy found for this agent (DATA UNAVAILABLE).</p>'}`
        else if (N.type === 'person') { const own = UNI.notes.filter(x => x.type === 'agent' && x.owner === N.id.slice(2)); top = `<p>${own.length} agent${own.length === 1 ? '' : 's'}, ${own.filter(x => x.policy).length} with a behaviour policy.</p>` }
        else if (N.type === 'resource') { const who = UNI.notes.filter(x => x.type === 'policy' && (x.ilinks || []).includes(N.id)); top = `<p>Named in the Reach of <b>${who.length}</b> agent polic${who.length === 1 ? 'y' : 'ies'}.</p><p class="u-meta">INFERRED: matched in each policy's Reach text; open a policy to see the sentence.</p>` }
        const pol = P ? sec('reach', 'Reach · what it can access', ul(P.reach)) + sec('mandate', 'Mandate · what it was authorised', ul(P.mandate))
            + sec('gap', 'Gap · beyond its authority', P.gap && P.gap.length ? `<ul>${P.gap.map(g => `<li class="${g.open ? '' : 'u-closed'}">${esc(g.text)}</li>`).join('')}</ul>` : '')
            + sec('bars', 'Barriers · what really stops it', P.barriers && P.barriers.length ? `<ul class="u-bars">${P.barriers.map(b => `<li><b class="u-k ${esc(b.kind.toLowerCase())}">${esc(KLAB[b.kind] || b.kind)}</b> ${esc(b.text)}<small>${esc(b.why)}</small></li>`).join('')}</ul>` : '')
            + sec('lic', 'Licence to Operate', P.licence && P.licence.length ? `<dl class="u-lic">${P.licence.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : '')
            + sec('ev', 'Resources it can reach · inferred', P.evidence && P.evidence.length ? `<ul>${P.evidence.map(e => `<li><b>${esc((byId(e.to) || {}).title || e.to)}</b>: “${esc(e.quote)}”</li>`).join('')}</ul>` : '')
            + `<p class="u-meta">${esc(P.phase)} ${esc(P.version || '')} · source <code>${esc(P.src)}</code>${safeUrl(P.url) ? ` · <a href="${esc(safeUrl(P.url))}" target="_blank" rel="noopener">Read it ↗</a>` : ''}</p>` : ''
        const kind = { agent: 'Agent', policy: 'Behaviour policy · ADVISORY', person: 'Person', resource: 'Resource' }[N.type] || 'Note'
        return `<button type="button" class="bm-x" data-bm="close" aria-label="Close">✕</button><p class="bm-kind"><i style="--c:${colOf(n)}"></i>${esc(kind)}</p><h3>${esc(n.title)}</h3>${top}${pol}`
    }
    function placePanels() {
        if (!G.panels) { G.panels = document.createElement('section'); G.panels.className = 'u-panels cc-span-12'; G.panels.setAttribute('aria-label', 'The Agent Universe in panels') }
        if (!G.uhead) { G.uhead = document.createElement('section'); G.uhead.className = 'u-head cc-span-12'; G.uhead.setAttribute('aria-label', 'The Agent Universe in numbers') }
        const host = G.mapEl && (G.mapEl.closest('.br-mapcard') || G.mapEl)
        if (G.stand || !UNI || !UNI.dev || !(G.which === 'universe' || (G.which === 'all' && G.layers.has('agents'))) || !UNI || !UNI.stats || !host) { G.panels.remove(); G.uhead.remove(); return }
        const S = UNI.stats, N = UNI.notes, asof = String(UNI.as_of).slice(0, 16).replace('T', ' ') + ' UTC', asofL = (UNI.live ? 'live · read ' : 'as of ') + asof
        const nm = id => ((N.find(x => x.id === 'p-' + id) || {}).title || id).split(' ')[0]
        const owners = Object.keys(S.by_owner)
        // header strip: a tag, a line, four counters
        G.uhead.innerHTML = `<div class="uh-tag"><b>RiskMandate · ${G.which === 'all' ? 'Universe' : 'Agent Universe'}</b><small>our own team · read-only · ${esc(asofL)}</small></div><p class="uh-line">${S.agents} agents you haven't audited <span>reach · mandate · gap · barriers · licence to operate</span></p>
<dl class="uh-num"><div><dt>Agents</dt><dd>${S.agents}</dd></div>${G.which === 'all' ? `<div><dt>Summit</dt><dd class="c2">${(SUMMIT || []).length}</dd></div><div><dt>My notes</dt><dd class="c5">${layerCount('mine')}</dd></div>` : ''}<div><dt>Policies</dt><dd class="c2">${S.policies}</dd></div><div><dt>Open gaps</dt><dd class="c3">${S.gaps_open}</dd></div><div><dt>Agreed</dt><dd class="c4">${S.role_policies_agreed}/${S.role_policies}</dd></div></dl>`
        // the legend inside the graph, with counts
        const lg = G.holder && G.holder.querySelector('.hleg'); if (lg) lg.innerHTML = owners.map(k => `<p><i style="--c:${SHIRT[k] || '#4FD1F5'}"></i>${esc(nm(k))}<b>${S.by_owner[k]}</b></p>`).join('') + `<p class="sub">every point keeps its source</p>`
        // the selected agent (default: the policy agent)
        const A = N.find(x => x.id === G.sel && x.type === 'agent') || N.find(x => x.type === 'agent' && x.policy === G.sel) || N.find(x => x.type === 'agent' && x.title === 'abp@web-summit.dinis') || N.find(x => x.type === 'agent' && x.policy)
        const P = A && N.find(x => x.id === A.policy), col = (A && SHIRT[A.owner]) || '#4FD1F5'
        const frame = (n, title, meta, body, cls = '') => `<div class="u-f ${cls}"><p class="u-fh"><span class="u-n">${n}</span>${title}<em>${meta}</em></p>${body}</div>`
        // 01 policy tree: the agent on the left, its sections on the right, joined by curves
        const parts = P ? [['Reach', P.reach.length], ['Mandate', P.mandate.length], ['Gap', P.gap.filter(g => g.open).length + ' open'], ['Barriers', P.barriers.length], ['Licence', P.licence.length ? 'set' : '—'], ['Resources', (P.evidence || []).length + ' inferred']] : []
        const pc = ['#E9C46A', '#4FD1F5', '#FF7A7A', '#4ADE9B', '#B69CFF', '#8FA6C2']
        const tree = P ? `<svg viewBox="0 0 360 230" class="u-tree" role="img" aria-label="The policy of ${esc(A.title)}, by section">${parts.map((x, i) => { const y = 18 + i * 37; return `<path d="M58 115 C150 115 140 ${y} 214 ${y}" stroke="${pc[i]}" stroke-width="1.6" fill="none" opacity=".85"/>` }).join('')}<circle cx="52" cy="115" r="9" fill="${col}"/><circle cx="52" cy="115" r="16" fill="none" stroke="${col}" opacity=".4"/>${parts.map((x, i) => { const y = 18 + i * 37; return `<rect x="214" y="${y - 12}" width="140" height="24" rx="12" fill="#06101A" stroke="${pc[i]}"/><text x="228" y="${y + 4}" fill="#E6F2FA" font-size="11" font-family="ui-monospace,Menlo,monospace">${esc(x[0].toLowerCase())}</text><text x="344" y="${y + 4}" fill="${pc[i]}" font-size="10" text-anchor="end" font-family="ui-monospace,Menlo,monospace">${esc(String(x[1]))}</text>` }).join('')}</svg><p class="u-sub">${esc(A.title)}<br><span>${esc(P.src)}</span></p>` : '<p class="u-sub">No behaviour policy written for this agent yet.</p>'
        // 02 reach vs mandate, side by side
        const box = (h, list, cls) => `<div class="u-pane ${cls}"><p class="u-ph2">${h}</p><ul>${(list || []).slice(0, 4).map(x => `<li>${esc(x.length > 110 ? x.slice(0, 109) + '…' : x)}</li>`).join('')}</ul></div>`
        const og = P ? P.gap.filter(g => g.open).length : 0, tg = P ? P.gap.length : 0
        const rvm = P ? `<div class="u-two2">${box('Reach · can do', P.reach, 'r')}${box('Mandate · may do', P.mandate, 'm')}</div><div class="u-meter"><span>gap</span><i><b style="width:${tg ? Math.round(og / tg * 100) : 0}%"></b></i><span>${og} of ${tg} open</span></div>` : ''
        // 03 barriers gauge: the share that is really enforced
        const B = S.barriers, bt = (B.ENFORCED + B.PARTIAL + B.DETECTIVE + B.ADVISORY) || 1, share = B.ENFORCED / bt, ang = -120 + share * 240
        const PT = (a, r) => [(80 + r * Math.sin(a * Math.PI / 180)).toFixed(1), (78 - r * Math.cos(a * Math.PI / 180)).toFixed(1)], s0 = PT(-120, 56), s1 = PT(120, 56), e1 = PT(ang, 56), nd = PT(ang, 42)
        const dial = `<div class="u-dial"><svg viewBox="0 0 160 120" role="img" aria-label="${B.ENFORCED} of ${bt} barriers enforced"><path d="M${s0[0]} ${s0[1]} A56 56 0 1 1 ${s1[0]} ${s1[1]}" stroke="#1C2B38" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${s0[0]} ${s0[1]} A56 56 0 ${ang + 120 > 180 ? 1 : 0} 1 ${e1[0]} ${e1[1]}" stroke="#4ADE9B" stroke-width="10" fill="none" stroke-linecap="round"/><line x1="80" y1="78" x2="${nd[0]}" y2="${nd[1]}" stroke="#E6F2FA" stroke-width="2"/><circle cx="80" cy="78" r="3" fill="#E6F2FA"/><text x="80" y="104" fill="#E6F2FA" font-size="12" text-anchor="middle" font-family="ui-monospace,Menlo,monospace">${Math.round(share * 100)}% enforced</text></svg><ul class="u-dots">${[['ENFORCED', '#4ADE9B'], ['PARTIAL', '#E9C46A'], ['DETECTIVE', '#7FA7D9'], ['ADVISORY', '#6F8A9C']].map(([k, c]) => `<li><span>${k.toLowerCase()}</span><b style="color:${c}">${B[k]}</b><i>${'●'.repeat(Math.max(1, Math.round(B[k] / bt * 10)))}</i></li>`).join('')}</ul></div><p class="u-sub">barriers that really stop an agent, across ${S.policies} policies</p>`
        // 04 agents grid: one square per agent, in its person's colour; dim without a policy
        const ag = N.filter(x => x.type === 'agent').sort((a, b) => owners.indexOf(a.owner) - owners.indexOf(b.owner))
        const grid = `<div class="u-grid">${ag.map(x => `<i title="${esc(x.title)}" style="background:${SHIRT[x.owner] || '#4FD1F5'};opacity:${x.policy ? 1 : .3}${G.sel && (x.id === G.sel || x.policy === G.sel) ? ';outline:2px solid #fff' : ''}"></i>`).join('')}</div><p class="u-sub">${S.agents_with_policy} with a policy · ${S.agents - S.agents_with_policy} without</p>`
        // 05 agent log; 06 open gaps of the selected agent
        const log = `<ul class="u-log">${(S.latest || []).slice(0, 7).map(c => `<li><span>${esc(c.at)}</span> ${safeUrl(c.url) ? `<a href="${esc(safeUrl(c.url))}" target="_blank" rel="noopener">${esc(c.hash)}</a>` : esc(c.hash)} <b>${esc(c.agent)}</b> ${esc(c.subject)}</li>`).join('')}</ul>`
        const gaps = P ? `<ul class="u-gaps">${P.gap.slice(0, 6).map(g => `<li class="${g.open ? '' : 'u-closed'}"><i>${g.open ? '▲' : '✓'}</i>${esc(g.text.length > 120 ? g.text.slice(0, 119) + '…' : g.text)}</li>`).join('')}</ul>` : '<p class="u-src">This agent has no behaviour policy yet, so none of its gaps is written down. Pick another agent on the map.</p>'
        G.panels.innerHTML = frame('01', 'Policy tree', 'the agent · its sections', tree, 'c1') + frame('02', 'Reach vs mandate', A ? esc(A.title) : '', rvm, 'c2 wide')
            + frame('03', 'Barriers', 'enforced share', dial, 'c3') + frame('04', 'Agents', 'one square each', grid, 'c4') + frame('05', 'Agent log', (UNI.live ? 'live · read ' : 'as of ') + esc(asof), log, 'c5') + frame('06', 'Open gaps', A ? esc(A.title) : '', gaps, 'c6')
        if (G.uhead.nextElementSibling !== host) host.before(G.uhead)
        if (G.panels.previousElementSibling !== host) host.after(G.panels)
    }
    // ---------- the circuit view of the Universe ----------
    const viewSaved = () => { try { return localStorage.getItem('cc.brain.view') === 'circuit' ? 'circuit' : 'map' } catch { return 'map' } }
    const circOn = () => (G.which === 'all' || G.which === 'universe') && (G.view || (G.view = viewSaved())) === 'circuit'
    const glints = w => (w.match(/<path[^>]*class="bc-w[^"]*\b(?:sel|team|hold)\b[^"]*"[^>]*\/>/g) || []).map((x, k) => x.replace(/class="bc-w([^"]*)"/, (m, c) => `class="bc-glint${/\bsel\b/.test(c) ? ' sel' : ''}" style="animation-delay:-${(k * 0.37) % 2.4}s"`).replace(/ style="stroke:[^"]*"(?= style)/, '')).join('')
    function circuit() {
        const box = G.holder && G.holder.querySelector('.bm-circuit'); if (!box) return
        const on = circOn(); G.holder.classList.toggle('circ', on); box.hidden = !on
        const vb = G.dock && G.dock.querySelector('[data-bm="view"]'); if (vb) { vb.hidden = !(G.which === 'all' || G.which === 'universe'); vb.querySelector('.lbl').textContent = on ? 'Map' : 'Circuit'; vb.setAttribute('aria-pressed', String(on)) }
        try { if (G.fg) on ? G.fg.pauseAnimation() : G.fg.resumeAnimation() } catch {}
        if (!on) return
        if (!UNI || !UNI.notes.length) { box.innerHTML = '<p class="bc-msg">Opening the Universe…</p>'; return }
        if (G.which === 'all' && !G.layers.has('agents')) { box.innerHTML = '<p class="bc-msg">Switch on <b>Agents &amp; policies</b> to see the circuit.</p>'; return }
        const N = UNI.notes, S = UNI.stats || {}, byId = new Map(N.map(n => [n.id, n])), dev = !!UNI.dev && !G.stand
        const owners = Object.keys(S.by_owner || {}), col = o => SHIRT[o] || '#4FD1F5', cut = (s, n) => (s = String(s == null ? '' : s)).length > n ? s.slice(0, n - 1) + '…' : s
        const agents = owners.flatMap(o => N.filter(n => n.type === 'agent' && n.owner === o).sort((a, b) => a.title.localeCompare(b.title)))
        const res = N.filter(n => n.type === 'resource'), polOf = a => a.policy ? byId.get(a.policy) : null, sched = a => /cron|every|hourly|daily|each (day|morning|evening)|\d\d:\d\d|\d+ \*|wake/i.test(a.schedule || '')
        const me = ((document.querySelector('.cc-me b') || {}).textContent || '').split(' ')[0].toLowerCase()
        if (!G.bcSel || !byId.get(G.bcSel)) G.bcSel = (agents.find(a => a.owner === me && /^conductor@/.test(a.title)) || agents.find(a => a.owner === me && a.policy) || agents.find(a => a.policy) || agents[0] || {}).id
        const sel = byId.get(G.bcSel), sp = sel && polOf(sel), reachOf = a => { const p = polOf(a); return ((p && p.ilinks) || []).filter(r => byId.has(r)) }
        actLoad(); const lastBy = new Map(); for (const c of (G.act || [])) if (!lastBy.has(c.agent)) lastBy.set(c.agent, c)
        const isNow = a => { const c = lastBy.get(a.title); return !!c && Date.now() - Date.parse(c.at) < 3600000 }
        const W = 1400, H = 700, BX = 292, BT = 24, BB = H - 24, step = (BB - BT) / Math.max(1, agents.length - 1)
        const tick = new Map(agents.map((a, k) => [a.id, BT + k * step]))
        const tx = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" class="${cls}"${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(s)}</text>`
        // a node card: a coloured header and typed rows, each with a port on both sides
        const node = (x, y, w, head, hc, rows, cls = '') => { let s = `<g class="bc-n ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${22 + rows.length * 17 + 6}" rx="3" class="bc-body"/><rect x="${x}" y="${y}" width="${w}" height="18" rx="3" style="fill:${hc}"/>${tx(x + 8, y + 13, head, 'bc-ht')}`
            rows.forEach((r, k) => { const ry = y + 22 + k * 17 + 11; s += `<circle cx="${x}" cy="${ry - 4}" r="2.6" class="bc-port"/><circle cx="${x + w}" cy="${ry - 4}" r="2.6" class="bc-port" style="fill:${r[2] || '#7F97A8'}"/>${r[3] ? `<rect x="${x + 8}" y="${ry - 9}" width="22" height="7" rx="1" style="fill:${r[3]}"/>${tx(x + 36, ry, r[0], 'bc-t')}` : r[4] ? `<rect x="${x + 8}" y="${ry - 9}" width="8" height="8" class="bc-box"/>${tx(x + 22, ry, r[0], 'bc-t')}` : tx(x + 8, ry, r[0], 'bc-t')}${tx(x + w - 8, ry, r[1], 'bc-v', 'end')}` })
            return s + '</g>' }
        const portY = (y, k) => y + 22 + k * 17 + 7
        let W1 = '', W2 = '', W3 = '', W4 = '', nodes = ''
        // column A: the people
        const PY = owners.map((o, k) => 8 + k * Math.floor((H - 12) / Math.max(1, owners.length)))
        owners.forEach((o, k) => { const as = agents.filter(a => a.owner === o), withP = as.filter(a => a.policy).length, last = as.map(a => a.latest).filter(Boolean).sort((a, b) => String(b.at).localeCompare(String(a.at)))[0]
            nodes += node(20, PY[k], 200, ((byId.get('p-' + o) || {}).title || o).split(' ')[0].toLowerCase(), col(o), [['agents', String(as.length)], ['with a policy', String(withP), withP === as.length ? '#3DDC97' : '#F5C542'], ['on a schedule', String(as.filter(sched).length), , , true], ['latest', last ? cut(last.at, 13) : '—']])
            for (const a of as) { const ty = tick.get(a.id), sy = portY(PY[k], 0), on = a.id === G.bcSel
                W1 += `<path data-a="${esc(a.id)}" class="bc-w${on ? ' sel' : sel && a.owner === sel.owner ? ' team' : ''}" style="stroke:${col(o)}" d="M220 ${sy} C 262 ${sy}, 252 ${ty}, ${BX} ${ty}"/>` } })
        // the bus: one numbered line per agent
        nodes += `<g class="bc-bus"><rect x="${BX - 6}" y="${BT - 14}" width="12" height="${BB - BT + 28}" rx="3"/>${agents.map((a, k) => `<g class="bc-tick${a.id === G.bcSel ? ' sel' : ''}${isNow(a) ? ' now' : ''}" data-bc="${esc(a.id)}" role="button" tabindex="0" aria-label="${esc(a.title)}"><title>${esc(a.title)}</title><circle cx="${BX}" cy="${tick.get(a.id)}" r="${a.id === G.bcSel ? 4.5 : 2.6}" style="fill:${a.policy ? col(a.owner) : 'transparent'};${a.policy ? '' : 'stroke:#E6EEF5;stroke-width:1.4'}"/>${k % 5 === 0 ? tx(BX - 12, tick.get(a.id) + 3, String(k).padStart(2, '0'), 'bc-num', 'end') : ''}</g>`).join('')}${tx(BX + 4, BB + 22, 'agent bus', 'bc-m')}</g>`
        // column B: the policy, its barriers, the gate, the owner, and the agents without one
        const tot = k => agents.reduce((n, a) => { const p = polOf(a); return n + ((p && Array.isArray(p[k])) ? p[k].length : 0) }, 0)
        const one = k => sp && Array.isArray(sp[k]) ? sp[k].length : 0, openG = p => p && Array.isArray(p.gap) ? p.gap.filter(g => g.open).length : 0
        const B = S.barriers || null, bt = B ? (B.ENFORCED + B.PARTIAL + B.DETECTIVE + B.ADVISORY) || 1 : 1, kinds = sp && Array.isArray(sp.barriers) ? sp.barriers.reduce((m, b) => (m[b.kind] = (m[b.kind] || 0) + 1, m), {}) : {}
        const NB = { x: 560, w: 230 }, Y = { abp: 8, bar: 150, gate: 280, own: 395, nop: 510 }
        nodes += node(NB.x, Y.abp, NB.w, 'behaviour policy · ABP', '#FF5FA8', [['reach', sp ? String(one('reach')) : '—', '#FF5FA8'], ['mandate', sp ? String(one('mandate')) : '—', '#FF5FA8'], ['gap', dev && sp ? openG(sp) + ' open' : sp ? 'developers' : '—', '#FF5C7A', '#FF5C7A'], ['barriers', dev && sp ? String(one('barriers')) : sp ? 'developers' : '—', '#F5C542'], ['licence', sp ? String(one('licence')) : '—', '#3DDC97', , true], ['version', sp ? cut(String(sp.version || '').replace(/^Version /i, 'v'), 14) : 'none', '#7F97A8']])
        nodes += node(NB.x, Y.bar, NB.w, 'barriers · what really stops it', '#F5C542', dev ? [['enforced', String(kinds.ENFORCED || 0), '#3DDC97', '#3DDC97'], ['partial', String(kinds.PARTIAL || 0), '#F5C542'], ['detective', String(kinds.DETECTIVE || 0), '#4FD1F5'], ['advisory', String(kinds.ADVISORY || 0), '#7F97A8'], ['all policies · enforced', B ? Math.round(B.ENFORCED / bt * 100) + '%' : '—', '#3DDC97']] : [['for the developers only', ''], ['(sealed to their keys)', '']])
        nodes += node(NB.x, Y.gate, NB.w, 'gate · Explorer phase', '#FF8A5C', [['observes', 'yes', '#3DDC97', , true], ['recommends', 'yes', '#3DDC97', , true], ['blocks', 'nothing yet', '#FF5C7A', , true], ['role policies agreed', (S.role_policies_agreed || 0) + '/' + (S.role_policies || 0), '#F5C542']])
        const lic = sp && Array.isArray(sp.licence) ? sp.licence : [], ownerName = sel ? ((byId.get('p-' + sel.owner) || {}).title || sel.owner) : ''
        nodes += node(NB.x, Y.own, NB.w, 'human · owner', '#F4C6FF', [['owner', cut(ownerName, 18), col(sel && sel.owner)], ['authority', cut(((lic.find(l => /authority/i.test(l[0])) || [])[1] || '—').split(',')[0], 18)], ['accountable', cut(((lic.find(l => /accountable/i.test(l[0])) || [])[1] || '—').split(',')[0], 18)], ['schedule', sel && sched(sel) ? 'scheduled' : 'on demand', , , true]])
        nodes += node(NB.x, Y.nop, NB.w, 'no policy yet', '#C9D3DC', [['agents', String(agents.filter(a => !a.policy).length), '#C9D3DC'], ['gap', 'not written down', '#C9D3DC']], 'bc-nopol')
        for (const a of agents) { const ty = tick.get(a.id), on = a.id === G.bcSel, p = polOf(a)
            const tyB = p ? portY(Y.abp, Math.floor((agents.indexOf(a) / agents.length) * 6)) : portY(Y.nop, 0)
            W2 += `<path data-a="${esc(a.id)}" class="bc-w${on ? ' sel' : sel && a.owner === sel.owner ? ' team' : ''}${p ? '' : ' hold'}" style="stroke:${p ? col(a.owner) : '#C9D3DC'}" d="M${BX} ${ty} C ${BX + 160} ${ty}, ${NB.x - 140} ${tyB}, ${NB.x} ${tyB}"/>` }
        if (sp) W2 += `<path class="bc-w sel" d="M${NB.x + NB.w} ${portY(Y.abp, 3)} C ${NB.x + NB.w + 40} ${portY(Y.abp, 3)}, ${NB.x + NB.w + 40} ${portY(Y.bar, 0)}, ${NB.x + NB.w} ${portY(Y.bar, 0)}"/><path class="bc-w sel" d="M${NB.x} ${portY(Y.bar, 3)} C ${NB.x - 40} ${portY(Y.bar, 3)}, ${NB.x - 40} ${portY(Y.gate, 0)}, ${NB.x} ${portY(Y.gate, 0)}"/><path class="bc-w sel" d="M${NB.x + NB.w} ${portY(Y.gate, 2)} C ${NB.x + NB.w + 40} ${portY(Y.gate, 2)}, ${NB.x + NB.w + 40} ${portY(Y.own, 0)}, ${NB.x + NB.w} ${portY(Y.own, 0)}"/>`
        // column C: the resources the policies say the agents reach
        const reach = new Map(res.map(r => [r.id, agents.filter(a => reachOf(a).includes(r.id))])), rl = res.slice().sort((a, b) => reach.get(b.id).length - reach.get(a.id).length)
        const RX = 880, RW = 220, RY = rl.map((r, k) => 8 + k * Math.floor((H - 12) / Math.max(1, rl.length)))
        rl.forEach((r, k) => { const as = reach.get(r.id), selHit = sel && as.includes(sel)
            nodes += node(RX, RY[k], RW, cut(r.title.toLowerCase(), 30), selHit ? '#F5E14A' : '#4FA8FF', [['agents reach it · owners', as.length + ' · ' + new Set(as.map(a => a.owner)).size, '#4FA8FF']], selHit ? 'hit' : '')
            as.forEach((a, m) => { const on = a.id === G.bcSel, sy = portY(Y.abp, 0) + ((agents.indexOf(a) / agents.length) * 100), ty = portY(RY[k], 0) + (m / Math.max(1, as.length - 1)) * 14
                W3 += `<path data-a="${esc(a.id)}" class="bc-w bc-out${on ? ' sel' : sel && a.owner === sel.owner ? ' team' : ''}" style="stroke:${col(a.owner)}" d="M${NB.x + NB.w} ${sy} C ${NB.x + NB.w + 60} ${sy}, ${RX - 60} ${ty}, ${RX} ${ty}"/>` }) })
        // column D: what it adds up to, for the selected agent
        const DX = 1160, DW = 225, rs = sel ? reachOf(sel) : []
        nodes += node(DX, 8, DW, 'result · reach', '#3EE6C1', rs.length ? rs.slice(0, 6).map(r => [cut((byId.get(r) || {}).title || r, 24), '', '#3EE6C1', , true]) : [['no resource named', '']])
        nodes += node(DX, 160, DW, 'result · gaps', '#FF8A5C', dev ? [['open', sp ? String(openG(sp)) : '—', '#FF5C7A', '#FF5C7A'], ['closed', sp ? String(sp.gap.length - openG(sp)) : '—', '#3DDC97'], ['all agents · open', String(S.gaps_open || 0), '#FF5C7A'], ['all agents · closed', String(S.gaps_closed || 0), '#3DDC97']] : [['for the developers only', ''], ['(sealed to their keys)', '']])
        const lt = sel && sel.latest
        nodes += node(DX, 290, DW, 'result · latest commit', '#B39DFF', lt ? [['commit', cut(lt.hash, 10), '#B39DFF'], ['when', cut(lt.at, 16)], ['what', '']] : [['no commit found', '']])
        if (lt) nodes += `<foreignObject x="${DX + 8}" y="${290 + 22 + 3 * 17}" width="${DW - 16}" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="bc-fo">${safeUrl(lt.url) ? `<a href="${esc(safeUrl(lt.url))}" target="_blank" rel="noopener">${esc(cut(lt.subject, 110))}</a>` : esc(cut(lt.subject, 110))}</div></foreignObject>`
        nodes += node(DX, 440, DW, 'human · approve', '#FFC1E3', [['who approves', cut(ownerName.split(' ')[0] || '—', 16), col(sel && sel.owner)], ['agreed by the person', sp && sp.status === 'AGREED' ? 'yes' : 'not yet', '#F5C542', , true], ['phase', 'explorer', '#7F97A8']])
        rl.forEach((r, k) => { if (sel && reach.get(r.id).includes(sel)) W4 += `<path class="bc-w sel" d="M${RX + RW} ${portY(RY[k], 0)} C ${RX + RW + 30} ${portY(RY[k], 0)}, ${DX - 30} ${portY(8, rs.indexOf(r.id))}, ${DX} ${portY(8, Math.min(5, rs.indexOf(r.id)))}"/>` })
        W4 += `<path class="bc-w sel" d="M${NB.x + NB.w} ${portY(Y.abp, 2)} C ${NB.x + NB.w + 200} ${portY(Y.abp, 2)}, ${DX - 200} ${portY(160, 0)}, ${DX} ${portY(160, 0)}"/><path class="bc-w sel" d="M${NB.x + NB.w} ${portY(Y.own, 0)} C ${NB.x + NB.w + 200} ${portY(Y.own, 0)}, ${DX - 200} ${portY(440, 0)}, ${DX} ${portY(440, 0)}"/>`
        // the header strip, the title, the panels
        const asof = String(UNI.as_of || '').slice(0, 16).replace('T', ' '), wires = (W1 + W2 + W3 + W4).split('<path').length - 1, nodesN = owners.length + 5 + rl.length + 4
        const k0 = agents.indexOf(sel), lat = G.act ? G.act.slice(0, 14).map(c => ({ ...c, at: ago(c.at) })) : (S.latest || []).slice(0, 12)
        const code = sp ? [...(sp.reach || []).slice(0, 4).map(x => ['reach', x]), ...(sp.mandate || []).slice(0, 4).map(x => ['mandate', x]), ...(dev && Array.isArray(sp.gap) ? sp.gap.filter(g => g.open).slice(0, 4).map(g => ['gap', g.text]) : []), ...lic.slice(0, 3).map(l => ['licence', l.join(': ')])] : []
        box.innerHTML = `<div class="bc-strip"><span>GRAPH <b>universe</b></span><span>NODES <b>${nodesN}</b></span><span>WIRES <b>${wires}</b></span><span>AGENTS <b>${agents.length}</b></span><span>POLICIES <b class="y">${S.agents_with_policy || 0}</b></span><span>WITHOUT <b class="r">${agents.filter(a => !a.policy).length}</b></span>${G.act ? `<span class="now">ACTIVE NOW <b>${agents.filter(isNow).length}</b> <small>committed in the last hour</small></span>` : ''}${dev ? `<span>OPEN GAPS <b class="r">${S.gaps_open || 0}</b></span>` : ''}${UNI.live ? '<span class="live">● LIVE</span><span>READ <b>' + esc(asof.slice(11)) + ' UTC</b></span>' : '<span>AS OF <b>' + esc(asof) + ' UTC</b></span>'}</div>
<div class="bc-stage"><div class="bc-title" style="--c:${col(sel && sel.owner)}"><div><b>${String(k0).padStart(2, '0')} ${esc(sel ? sel.title : '')}</b><small>${esc(ownerName)}${sel && lastBy.get(sel.title) ? ' · last worked ' + ago(lastBy.get(sel.title).at) : ''} · ${rs.length} resource${rs.length === 1 ? '' : 's'}${sp ? (dev ? ' · ' + openG(sp) + ' open gaps' : ' · a written policy') : ' · no policy yet'}</small></div><div class="bc-tools"><button type="button" class="bc-tour" data-bc-tour aria-pressed="${!!G.bcTour}">${G.bcTour ? '■ Stop' : '▶ Play'}</button><label class="sr" for="bc-pick">Pick an agent</label><select id="bc-pick" class="bc-pick">${agents.map(a => `<option value="${esc(a.id)}"${a.id === G.bcSel ? ' selected' : ''}>${esc(a.title)}</option>`).join('')}</select></div></div>
<div class="bc-scroll"><svg class="bc-svg hot" viewBox="0 0 ${W} ${H}" role="img" aria-label="Each person's agents on the bus, through their behaviour policy, to the resources they reach; the selected agent's path is lit">${W1}${W3}${W2}${W4}${glints(W1 + W3 + W2 + W4)}${nodes}</svg></div></div>
<div class="bc-panels"><section><h4>Run log <em>${G.act ? 'live · ' + esc(G.actRead.toISOString().slice(11, 16)) + ' UTC' : lat.length + ' latest'}</em></h4><ol class="bc-log">${lat.map(c => `<li class="${sel && c.agent === sel.title ? 'on' : ''}"><span>${esc(G.act ? c.at : String(c.at).slice(-5))}</span><i style="color:${col((String(c.agent || '').match(/\.([a-z]+)$/) || [])[1])}">${esc(cut(String(c.agent || '').split('@')[0], 12))}</i>${safeUrl(c.url) ? `<a href="${esc(safeUrl(c.url))}" target="_blank" rel="noopener">${esc(cut(String(c.subject).replace(/^[^:]+:\s*/, ''), 48))}</a>` : esc(cut(c.subject, 48))}</li>`).join('')}</ol></section>
<section><h4>Dispatch <em>${owners.length} people</em></h4>${owners.map(o => { const as = agents.filter(a => a.owner === o), w = Math.round(as.length / Math.max(1, ...owners.map(x => agents.filter(a => a.owner === x).length)) * 14), pct = Math.round(as.filter(a => a.policy).length / Math.max(1, as.length) * 100); return `<p class="bc-disp"><span style="color:${col(o)}">${esc(((byId.get('p-' + o) || {}).title || o).split(' ')[0].toLowerCase())}</span><b style="color:${col(o)}">${'#'.repeat(w)}<i>${'·'.repeat(14 - w)}</i></b><em>${pct}%</em><small>${as.filter(sched).length} sched</small></p>` }).join('')}<p class="bc-note">agents per person · % with a policy · on a schedule</p></section>
<section class="bc-code"><h4>${esc(sel ? sel.title.split('@')[0] : '')}.abp <em>${sp ? esc(cut(sp.version || '', 22)) : 'no policy'}</em></h4><ol>${code.length ? code.map(([k, v], n) => `<li><span>${String(n + 1).padStart(2, '0')}</span><b class="k-${k}">${k}</b> ${esc(cut(v, 80))}</li>`).join('') : '<li><span>01</span>No behaviour policy is written for this agent yet.</li>'}</ol>${sp && safeUrl(sp.url) ? `<a class="bc-read" href="${esc(safeUrl(sp.url))}" target="_blank" rel="noopener">read the whole policy</a>` : ''}</section>
<section><h4>Graph <em>as of ${esc(asof.slice(11))}</em></h4><dl class="bc-dl"><div><dt>nodes</dt><dd>${nodesN}</dd></div><div><dt>wires</dt><dd>${wires}</dd></div><div><dt>agents</dt><dd>${agents.length}</dd></div><div><dt>with a policy</dt><dd class="y">${S.agents_with_policy || 0}</dd></div><div><dt>resources</dt><dd>${res.length}</dd></div><div><dt>role policies agreed</dt><dd class="r">${S.role_policies_agreed || 0}/${S.role_policies || 0}</dd></div>${dev && B ? `<div><dt>enforced barriers</dt><dd>${Math.round(B.ENFORCED / bt * 100)}%</dd></div><div><dt>open gaps</dt><dd class="r">${S.gaps_open || 0}</dd></div>` : ''}</dl><p class="bc-big">${S.agents_with_policy || 0}<small>/${agents.length}</small></p><p class="bc-note">agents with a written policy · blocks nothing yet (Explorer)</p></section></div>`
    }
    // hover a row: its wires light up; tap: the agent's card (public, or with its gaps for a developer)
    const bcHot = id => { const svg = G.holder && G.holder.querySelector('.bc-svg'); if (!svg) return; svg.classList.toggle('hot', !!id); svg.querySelectorAll('.bc-w.on, .bc-row.on').forEach(x => x.classList.remove('on')); if (id) svg.querySelectorAll(`[data-a="${CSS.escape(id)}"], [data-bc="${CSS.escape(id)}"]`).forEach(x => x.classList.add('on')) }
    document.addEventListener('mouseover', e => { const r = e.target.closest && e.target.closest('.bc-row'); if (r && G.holder && G.holder.contains(r)) bcHot(r.dataset.bc); else if (e.target.closest && e.target.closest('.bc-svg') && !G.bcSel) bcHot(null) })
    document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-bc-tour]'); if (b && G.holder && G.holder.contains(b)) bcTour(!G.bcTour) })
    document.addEventListener('keydown', e => { const tk = e.target && e.target.closest && e.target.closest('.bc-tick'); if (tk && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tk.dispatchEvent(new MouseEvent('click', { bubbles: true })) } })
    document.addEventListener('change', e => { if (e.target && e.target.id === 'bc-pick' && G.holder && G.holder.contains(e.target)) { if (G.bcTour) { clearInterval(G.bcTour); G.bcTour = 0 } G.bcSel = e.target.value; circuit() } })
    document.addEventListener('click', e => { const tk = e.target.closest && e.target.closest('.bc-tick'); if (tk && G.holder && G.holder.contains(tk) && UNI) { if (G.bcTour) { clearInterval(G.bcTour); G.bcTour = 0 } G.bcSel = tk.dataset.bc; circuit(); const a = UNI.notes.find(n => n.id === G.bcSel); if (a) card({ id: a.id, title: a.title, type: 'agent', deg: 0, n: { ...a, __layer: 'agents' } }); return } })
    document.addEventListener('click', e => { const r = e.target.closest && e.target.closest('.bc-row'); if (!r || !G.holder || !G.holder.contains(r) || !UNI) return; const a = UNI.notes.find(n => n.id === r.dataset.bc); if (!a) return; G.bcSel = a.id; bcHot(a.id); card({ id: a.id, title: a.title, type: 'agent', deg: 0, n: { ...a, __layer: 'agents' } }) })
    G.act = null; G.actAt = 0
    const actLoad = () => { if (!window.LiveUniverse || !window.LiveUniverse.activity || Date.now() - G.actAt < 110000) return; G.actAt = Date.now(); window.LiveUniverse.activity().then(a => { G.act = a; G.actRead = new Date(); if (circOn()) circuit() }).catch(() => {}) }
    setInterval(() => { if (G.holder && document.body.contains(G.holder) && circOn()) actLoad() }, 120000)
    const ago = iso => { const m = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000)); return m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago' }
    function bcTour(on) {
        clearInterval(G.bcTour); G.bcTour = 0
        if (on && UNI) { const ids = UNI.notes.filter(n => n.type === 'agent' && n.policy).map(n => n.id); let k = Math.max(0, ids.indexOf(G.bcSel)); G.bcTour = setInterval(() => { if (!circOn() || !document.body.contains(G.holder)) return bcTour(false); k = (k + 1) % ids.length; G.bcSel = ids[k]; circuit() }, 3500) }
        circuit()
    }
    function card(n) {
        const c = G.holder.querySelector('.bm-card'); if (!n) { c.hidden = true; return }
        if (UNI && (G.which === 'universe' || (G.which === 'all' && n.n.__layer === 'agents'))) { c.innerHTML = G.stand || !UNI.dev ? standCard(n) : uCard(n); c.hidden = false; if (n.type === 'agent' || n.type === 'policy') { G.sel = n.id; placePanels() } return }
        const rel = G.fg.graphData().links.filter(l => l.source.id === n.id || l.target.id === n.id).map(l => l.source.id === n.id ? l.target : l.source)
        c.innerHTML = `<button type="button" class="bm-x" data-bm="close" aria-label="Close">✕</button><p class="bm-kind"><i style="--c:${colOf(n)}"></i>${esc((LEG.find(x => x[0] === n.type) || [, 'Note'])[1])}${n.n.tags && n.n.tags.length ? ' · ' + n.n.tags.slice(0, 4).map(t => '#' + esc(t)).join(' ') : ''}</p><h3>${esc(n.title)}</h3>
${n.n.untrusted ? '<p class="bm-untrusted">From the stand: kept with the visit, not in your notes. What the visitor typed is shown as plain text.</p>' : ''}${n.n.bullets && n.n.bullets.length ? `<ul>${n.n.bullets.slice(0, 4).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : n.n.body ? `<p>${esc(String(n.n.body).slice(0, 280))}…</p>` : ''}
${rel.length ? `<p class="bm-rel">Related: ${rel.slice(0, 8).map(r => `<button type="button" data-bm-go="${esc(r.id)}">${esc(r.title)}</button>`).join(' · ')}${rel.length > 8 ? ` · +${rel.length - 8}` : ''}</p>` : ''}
<p class="bm-acts">${(G.which === 'summit' && n.n.src) || (G.which === 'all' && n.n.__layer !== 'mine') ? '' : `<button type="button" class="bm-btn" data-bm-open="${esc(n.id)}">Open the note</button>`}${n.n.url ? ` <a class="bm-btn" href="${esc(n.n.url)}" target="_blank" rel="noopener">Source ↗</a>` : ''}</p>`
        c.hidden = false
    }
    function focus(n, ms = 1500) {
        const d = 120 + Math.min(140, n.deg * 6), r = Math.hypot(n.x || 1, n.y || 1, n.z || 1) || 1, k = 1 + d / r
        G.fg.cameraPosition({ x: (n.x || 1) * k, y: (n.y || 1) * k, z: (n.z || 1) * k }, n, ms)
        G.hot = new Set([n.id]); G.hotLinks = new Set()
        G.fg.graphData().links.forEach(l => { if (l.source.id === n.id || l.target.id === n.id) { G.hot.add(l.source.id); G.hot.add(l.target.id); G.hotLinks.add(l) } })
        paint(); card(n)
        const lg = G.holder && G.holder.querySelector('.hlog'); if (lg && hudOn()) { const tm = new Date(); lg.textContent = `${String(tm.getUTCHours()).padStart(2, '0')}.${String(tm.getUTCMinutes()).padStart(2, '0')}  ${n.type} :: ${n.title} matched · ${n.n.src || ''}` }
    }
    // names float over the biggest points (or the highlighted ones), crisp HTML text, nearer ones brighter
    function labels() {
        const box = G.holder && G.holder.querySelector('.bm-labels')
        if (box && G.fg && box.isConnected) {
            const ns = G.fg.graphData().nodes, cam = G.fg.camera()
            const pick = G.hot.size ? ns.filter(n => G.hot.has(n.id)).sort((a, b) => b.deg - a.deg).slice(0, 14) : [...ns].filter(n => n.type === 'hub' || n.type === 'person' || n.type === 'ours' || (hudOn() && (n.type === 'resource' || (n.type === 'hub' && n.deg > 18))) || (G.which === 'summit' && n.deg > 12)).sort((a, b) => b.deg - a.deg).slice(0, 12)
            const placed = [], W = box.clientWidth, H = box.clientHeight
            box.innerHTML = pick.map(n => { const p = G.fg.graph2ScreenCoords(n.x || 0, n.y || 0, n.z || 0); const txt = n.title.length > 30 ? n.title.slice(0, 29) + '…' : n.title, w = txt.length * 7.4 + 20, y = p.y - 14; if (p.x < 0 || p.x > W || y < 60 || y > H - 70) return ''; if (placed.some(q => Math.abs(q.x - p.x) < (q.w + w) / 2 && Math.abs(q.y - y) < 26)) return ''; placed.push({ x: p.x, y, w }); const dist = cam.position.distanceTo({ x: n.x || 0, y: n.y || 0, z: n.z || 0 }); const o = Math.max(0.75, Math.min(1, 1300 / dist)); return `<span class="${n.type === 'hub' || n.type === 'person' ? 'big' : ''}" style="transform:translate(${p.x | 0}px,${y | 0}px);opacity:${o.toFixed(2)}">${esc(txt)}</span>` }).join('')
        }
        if (G.sky) G.sky.rotation.y += 0.00004; if (G.stars) G.stars.material.opacity = 0.7 + Math.sin(performance.now() / 700) * 0.1
        if (G.deco) { const t = performance.now() / 1000; G.deco.core.rotation.y = t * 0.12; G.deco.core.rotation.x = t * 0.05; G.deco.halo.material.opacity = 0.55 + Math.sin(t * 1.3) * 0.12 }
        G.raf = requestAnimationFrame(labels)
    }
    // deep space: far stars, two soft nebulae, the geodesic core with its glow, and the orbit ring
    // a seeded random, value noise and fractal noise, to paint the sky the same way every time
    const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(20261109)
    const P = new Uint8Array(512); { const q = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [q[i], q[j]] = [q[j], q[i]] } for (let i = 0; i < 512; i++) P[i] = q[i & 255] }
    const H = (x, y) => P[(P[x & 255] + y) & 511] / 255, sm = t => t * t * (3 - 2 * t)
    const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = sm(xf), v = sm(yf); const a = H(xi, yi), b = H(xi + 1, yi), c = H(xi, yi + 1), d = H(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v }
    const fbm = (x, y, o = 5) => { let f = 0, a = 0.5, s = 1; for (let i = 0; i < o; i++) { f += a * noise(x * s, y * s); s *= 2; a *= 0.5 } return f }
    function sky() {
        const C = document.createElement('canvas'); C.width = 4096; C.height = 2048; const G2 = C.getContext('2d')
        const bg = G2.createLinearGradient(0, 0, 0, C.height); bg.addColorStop(0, '#020309'); bg.addColorStop(0.5, '#03050D'); bg.addColorStop(1, '#020309'); G2.fillStyle = bg; G2.fillRect(0, 0, C.width, C.height)
        const tint = () => { const t = rng(); return t < 0.6 ? [215, 228, 255] : t < 0.85 ? [255, 246, 232] : t < 0.95 ? [255, 222, 180] : [170, 196, 255] }
        for (let k = 0; k < 7000; k++) { const x = rng() * C.width, y = rng() * C.height, m = Math.pow(rng(), 6), [r, g, b] = tint(); G2.fillStyle = `rgba(${r},${g},${b},${0.18 + m * 0.7})`; G2.beginPath(); G2.arc(x, y, 0.5 + m * 1.3, 0, 7); G2.fill() }
        const tx = new THREE.CanvasTexture(C); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return tx
    }
    function decorate() {
        const sc = G.fg.scene(), add = o => (sc.add(o), (G.decoAll = G.decoAll || []).push(o), o)
        const N = 1400, pos = new Float32Array(N * 3), col = new Float32Array(N * 3)
        for (let i = 0; i < N; i++) { const r = 1800 + Math.random() * 2200, u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u); pos.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3); const w = 0.55 + Math.random() * 0.45; col.set([w * (0.8 + Math.random() * 0.2), w * (0.85 + Math.random() * 0.15), w], i * 3) }
        const gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.BufferAttribute(pos, 3)); gs.setAttribute('color', new THREE.BufferAttribute(col, 3))
        G.stars = add(new THREE.Points(gs, new THREE.PointsMaterial({ size: 1.2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false })))
        const neb = (c, x, y, z, s) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: veil(c), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })); m.position.set(x, y, z); m.scale.setScalar(s); return add(m) }
        try { const cam = G.fg.camera(); cam.far = 30000; cam.updateProjectionMatrix(); const skyM = new THREE.Mesh(new THREE.SphereGeometry(12000, 64, 32), new THREE.MeshBasicMaterial({ map: sky(), side: THREE.BackSide, depthWrite: false, toneMapped: false })); skyM.rotation.set(0.35, 0, 0.5); add(skyM); G.sky = skyM } catch (e) { console.warn('sky', e && e.message) }
        const core = add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(34, 2)), new THREE.LineBasicMaterial({ color: '#7FF3FF', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })))
        const halo = add(new THREE.Sprite(new THREE.SpriteMaterial({ map: glow('#40E6FF'), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }))); halo.scale.setScalar(190)
        const ringPts = []; for (let i = 0; i <= 160; i++) { const a = i / 160 * Math.PI * 2; ringPts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a))) }
        const ring = add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color: '#59D8FF', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })))
        ring.rotation.set(1.2, 0.2, -0.15); ring.scale.setScalar(420)
        G.deco = { core, halo, ring }
    }
    G.refresh = force => {
        if (!G.fg) return; setHud(); circuit(); const s = sigOf(); if (!force && s === G.sig) return; G.sig = s
        const d = data(), big = G.which === 'summit' || G.which === 'universe'
        G.fg.d3Force('charge').strength(big ? -34 : -70); G.fg.d3Force('link').distance(l => (l.source.type === 'hub' || l.target.type === 'hub' || l.source.type === 'ours' || l.target.type === 'ours') ? (big ? 48 : 70) : (big ? 22 : 38))
        G.fitNext = !!force; G.fg.graphData(d); paint()
        const nmEl = G.holder.querySelector('.bm-name'); if (nmEl && G.which === 'all') nmEl.textContent = 'Universe'
        const cnt = G.holder.querySelector('.bm-count'); if (cnt) cnt.textContent = G.which === 'all' ? `${d.nodes.length} points · ${d.links.length} links${UNI && UNI.as_of && G.layers.has('agents') ? (UNI.live ? ' · live, read ' : ' · agents as of ') + String(UNI.as_of).slice(0, 16).replace('T', ' ') + ' UTC' : ''}` : G.which === 'universe' ? (UNI && UNI.notes.length ? `${d.nodes.length} nodes · ${d.links.length} links · as of ${String(UNI.as_of).slice(0, 16).replace('T', ' ')} UTC` : 'DATA UNAVAILABLE') : `${d.nodes.length} notes · ${d.links.length} links`
    }
    async function graph(el, b, opts) {
        G.opts = opts || {}
        // the stand: public layers only, never panels, gaps or anyone's notes; My brain gets its own layers back
        const stand = !!G.opts.stand
        if (stand && !G.stand) { G.layersMine = new Set(G.layers); G.layers = new Set(['agents', 'summit']) }
        if (!stand && G.stand && G.layersMine) { G.layers = G.layersMine; G.layersMine = null }
        if (stand !== !!G.stand) { G.stand = stand; G.which = 'all'; if (G.holder) { G.holder.classList.toggle('stand', stand); const lg = G.dock && G.dock.querySelector('.bm-legend'); if (lg) lg.innerHTML = legend(); card(null) } G.sig = '' }
        const want = G.opts.which || (G.viewWhich === 'universe' ? 'mine' : null); G.viewWhich = G.opts.which || null
        if (!G.holder) G.holder = shell()
        el.appendChild(G.holder); G.holder.classList.toggle('stand', !!G.stand)
        if (G.which === 'all') { const cnt0 = G.holder.querySelector('.bm-count'); if (cnt0 && !UNI) cnt0.textContent = 'Opening the Universe…'; await loadAll(); G.dock.querySelector('.bm-legend').innerHTML = legend() }
        try { if (G.fg) G.fg.resumeAnimation() } catch {}
        G.mapEl = el; if (!G.holder.classList.contains('full')) placeDock(el)
        if (G.stand) [3000, 7000, 11000].forEach(ms => setTimeout(() => { if (G.fg && G.stand && G.mapEl === el && !G.hot.size && !G.demo) { G.fg.zoomToFit(900, 30); fitRing() } }, ms))
        if (want && want !== (G.which || 'mine')) { const btn = G.holder.querySelector(`[data-bm-which="${want}"]`); if (btn) btn.click() }
        setTimeout(placePanels)
        const msg = G.holder.querySelector('.bm-msg')
        if (!cache.notes.length && G.which !== 'all') { msg.hidden = false; msg.textContent = db && !ready ? 'Opening your brain…' : 'Empty for now: capture things above and organise them with Claude, and they appear here.' }
        else msg.hidden = true
        try { await libs() } catch (e) { msg.hidden = false; msg.textContent = 'The 3D map could not load (' + (e.message || e) + ').'; return }
        const cv = G.holder.querySelector('.bm-canvas')
        const size = () => { const r = G.holder.getBoundingClientRect(); if (G.fg && r.width) { G.fg.width(r.width).height(r.height); if (G.bloom) G.bloom.setSize(r.width, r.height) } }
        if (!G.fg) {
            G.fg = new FG(cv, { controlType: 'orbit', rendererConfig: { antialias: true, alpha: false, powerPreference: 'high-performance' } })
                .backgroundColor('#03040C').showNavInfo(false)
                .nodeLabel(n => `<b>${esc(n.title)}</b>`).nodeRelSize(4)
                .nodeThreeObject(n => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hudOn() ? spark(hudCol(n)) : orb(colOf(n)), transparent: true, opacity: 1, depthWrite: false, depthTest: true, toneMapped: false, blending: hudOn() ? THREE.AdditiveBlending : THREE.NormalBlending })); sp.scale.setScalar(sizeOf(n)); n.__sp = sp; return sp })
                .linkColor(l => l.c).linkOpacity(0.22).linkWidth(0)
                .linkDirectionalParticleWidth(1.8).linkDirectionalParticleSpeed(0.0065).linkDirectionalParticleColor(() => '#FFFFFF')
                .d3VelocityDecay(0.28).warmupTicks(80).cooldownTime(8000)
                .onEngineStop(() => { if (G.fitNext && !G.demo && !G.hot.size) { G.fitNext = false; G.fg.zoomToFit(1200, 20); fitRing() } })
                .onNodeClick(n => { stopDemo(); focus(n) })
                .onBackgroundClick(() => { if (!G.demo) { G.hot.clear(); G.hotLinks.clear(); paint(); card(null) } })
            G.fg.d3Force('charge').strength(-70); G.fg.d3Force('link').distance(l => (l.source.type === 'hub' || l.target.type === 'hub') ? 70 : 38)
            try { G.fg.renderer().setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); G.fg.renderer().toneMapping = THREE.ACESFilmicToneMapping; G.fg.renderer().toneMappingExposure = 0.95 } catch {}
            try { if (Bloom) { const r = G.holder.getBoundingClientRect(); G.bloom = new Bloom(new THREE.Vector2(r.width || 800, r.height || 600), 0.35, 0.3, 0.8); G.fg.postProcessingComposer().addPass(G.bloom) } } catch (e) { console.warn('glow off', e && e.message) }
            try { decorate() } catch (e) { console.warn('deco', e && e.message) }
            G.fg.controls().autoRotate = true; G.fg.controls().autoRotateSpeed = 0.3; G.fg.controls().enableDamping = true
            new ResizeObserver(size).observe(G.holder)
            labels()
        } else if (!cv.isConnected) G.holder.prepend(cv)
        size(); G.sig = ''; G.refresh(true)
        setTimeout(() => { G.fg.zoomToFit(1000, 30); fitRing() }, 1700)
    }
    const FULL_ICO = on => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${on ? '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>' : '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'}</svg>`
    function placeDock(el) {
        G.dock.classList.remove('in-full')
        const again = document.querySelector('.bi-again'), mapCard = el.closest('.br-mapcard') || el
        if (again) { again.classList.add('has-dock'); const q = again.querySelector('.bi-q'); if (q) q.title = 'How the brain works'; again.appendChild(G.dock); G.dock.classList.remove('cc-span-12', 'alone') } else { mapCard.before(G.dock); G.dock.classList.add('cc-span-12', 'alone') }
    }
    function full(force) {
        const h = G.holder, on = force === undefined ? !h.classList.contains('full') : force
        if (on === h.classList.contains('full')) return
        h.classList.toggle('full', on); document.documentElement.classList.toggle('bm-full', on)
        const b = G.dock.querySelector('[data-bm="full"]'); b.innerHTML = FULL_ICO(on) + `<span class="lbl">${on ? 'Exit full screen' : 'Full screen'}</span>`; b.title = on ? 'Exit full screen (Esc)' : 'Full screen'; b.setAttribute('aria-pressed', String(on))
        if (on) { G.dock.classList.add('in-full'); h.appendChild(G.dock); if (h.requestFullscreen) h.requestFullscreen().catch(() => {}) }
        else { placeDock(G.mapEl || h.parentElement); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}) }
        card(null); setTimeout(() => { if (G.fg) { G.fg.zoomToFit(900, 20); fitRing() } }, 400)
    }
    function fitRing() { if (!G.deco) return; const ns = G.fg.graphData().nodes; let m = 0; ns.forEach(n => { m = Math.max(m, Math.hypot(n.x || 0, n.y || 0, n.z || 0)) }); G.deco.ring.scale.setScalar(Math.max(200, m * 1.08)) }
    function pulse(ids) {
        if (!G.fg || !ids || !ids.length) return
        G.refresh(true)
        setTimeout(() => {
            const set = new Set(ids); G.hot = new Set(ids); G.hotLinks = new Set()
            G.fg.graphData().links.forEach(l => { if (set.has(l.source.id) || set.has(l.target.id)) { G.hot.add(l.source.id); G.hot.add(l.target.id); G.hotLinks.add(l) } })
            paint(); const n = G.fg.graphData().nodes.find(x => set.has(x.id)); if (n) { G.fg.cameraPosition({ x: (n.x || 1) * 2.4, y: (n.y || 1) * 2.4, z: (n.z || 1) * 2.4 }, n, 1600); card(n) }
        }, 900)
    }
    function demo() {
        const btn = G.dock.querySelector('.play'); btn.textContent = '■ Stop'
        const ns = G.fg.graphData().nodes, hubs = [...ns].sort((a, b) => b.deg - a.deg).slice(0, 8)
        let i = 0; G.fg.controls().autoRotate = false
        const step = () => { if (!G.demo) return; if (i >= hubs.length) { stopDemo(); G.fg.zoomToFit(1200, 30); return } focus(hubs[i++], 1900); G.demo = setTimeout(step, 4300) }
        G.demo = setTimeout(step, 50)
    }
    function stopDemo() { if (G.demo) clearTimeout(G.demo); G.demo = null; const b = G.dock && G.dock.querySelector('.play'); if (b) b.textContent = '▶ Play demo'; if (G.fg) G.fg.controls().autoRotate = true }
    function cinema() {
        const h = G.holder, on = !h.classList.contains('cinema')
        h.classList.toggle('cinema', on); document.documentElement.classList.toggle('bm-cinema', on)
        if (on && h.requestFullscreen) h.requestFullscreen().catch(() => {})
        if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {})
        card(null); G.fg.controls().autoRotateSpeed = on ? 0.8 : 0.3; setTimeout(() => G.fg.zoomToFit(1000, 10), 350)
    }
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && G.holder && G.holder.classList.contains('full') && !G.holder.classList.contains('cinema')) full(false); if (!document.fullscreenElement && G.holder && G.holder.classList.contains('cinema')) { G.holder.classList.remove('cinema'); document.documentElement.classList.remove('bm-cinema'); if (G.fg) G.fg.controls().autoRotateSpeed = 0.3 } })
    document.addEventListener('keydown', e => { if (e.key !== 'Escape' || !G.holder) return; if (G.holder.classList.contains('cinema')) cinema(); else if (G.holder.classList.contains('full')) full(false) })
})()
