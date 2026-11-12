// Make your ABP (conductor@web-summit.indi, 11 November 2026, WS-34), the stand demo for the RiskMandate stand at Web
// Summit Lisbon, 12 November 2026. On /abp-make/: the ABP maker's ten questions (people/indi/prompts/abp-maker.md), one
// at a time, each with a suggested answer drawn from the company's X-ray (data/xray/<slug>/xray.json) or the maker's
// safe defaults; the Agent Behaviour Policy builds beside them from a template, in the browser. Deterministic: no model,
// no API key, no network call but this site's own X-ray record. Nothing typed is stored (no localStorage, no cookie)
// or sent; "Refine with Claude" is a link the visitor chooses to open. Query: ?x=<slug>&uc=<use case id>|a=<agent id>,
// and ?design=a (Interview, the default) | b (Builder) | c (Story): three layouts over one state and one template.
(() => {
    'use strict'
    const main = document.getElementById('main'); if (!main) return
    const up = document.body.dataset.up || ''
    const me = document.currentScript, ver = ((me && me.src) || '').match(/\?v=([^&#]+)/)
    if (!document.querySelector('link[href*="assets/abp-make.css"]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `${up}assets/abp-make.css${ver ? '?v=' + ver[1] : ''}`; document.head.appendChild(l) }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    // shorten to a whole phrase where one ends early enough (a colon, a semicolon, a comma or a bracket), else to a whole
    // word; never mid-word (WS-191: the prefilled answers from the X-ray were cut mid-sentence)
    const clipW = (s, n) => { s = String(s || '').trim(); if (s.length <= n) return s; const c = s.slice(0, n + 1); const at = bs => Math.max(...bs.map(b => c.lastIndexOf(b))), i = at([': ', '; ', ' (']) > n * .3 ? at([': ', '; ', ' (']) : at([', ']); const shut = t => (t.split('(').length > t.split(')').length && t.lastIndexOf(' (') > 0 ? t.slice(0, t.lastIndexOf(' (')) : t); if (i > n * .4) return shut(s.slice(0, i)).replace(/[\s,;:(]+$/, ''); const w = c.lastIndexOf(' '); return shut(s.slice(0, w > 0 ? w : n)).replace(/(\s+(and|or|the|a|an|of|to|in|on|for|with|by|from|its|their|into|which|that|who|at|as|is|are))+$/i, '').replace(/[\s,;:(]+$/, '') + '…' }
    // a short plain version of an X-ray line for a prefilled answer or a one-line summary (WS-34, at Indi's word: "much
    // more simple"): no brackets, no paths, commands or flags, the phrase before a colon or semicolon, at most n words
    const STOPW = /^(and|or|the|a|an|of|to|in|on|for|with|by|from|its|their|into|which|that|who|at|as|is|are|than|but|so|only|not)$/i
    const plain = (t, n) => {
        const x = String(t || '').replace(/^Illustrative:\s*/i, '').replace(/^As [^:]{3,60}:\s*/i, '').replace(/\s*\([^)]*\)/g, '').replace(/[`"]/g, '').trim()
        const words = seg => seg.split(/\s+/).filter(t => t && !/[\/~_=<>{}]|^--?\w|^\w+\.\w+|\(\)$|^\$/.test(t))
        // the first phrase (before a colon, semicolon or dash) with at least two plain words, else the whole text
        let w = x.split(/:\s|;\s|\s[-–]\s/).map(words).find(ws => ws.length >= 2) || words(x)
        if (w.length > n) {
            const c = w.slice(0, n).findIndex((t, i) => i >= 2 && /,$/.test(t))   // a comma early enough ends the phrase
            const r = w.slice(0, n + 1).findIndex((t, i) => i >= 2 && /^(that|which|who|where|whose|when)$/i.test(t))   // so does "that ..."
            w = c >= 0 ? w.slice(0, c + 1) : r >= 0 ? w.slice(0, r) : w.slice(0, n)
            while (w.length > 1 && STOPW.test(w[w.length - 1].replace(/[,.;:]$/, ''))) w.pop()
        }
        const out = w.join(' ').replace(/[,;:.\s]+$/, ''); return out.charAt(0).toUpperCase() + out.slice(1)
    }
    const sentence = s => { s = String(s || '').trim(); return s && !/[.!?…]$/.test(s) ? s + '.' : s }
    const fine = matchMedia('(pointer: fine)')
    const P = new URLSearchParams(location.search)
    const DESIGN = ['a', 'b', 'c'].includes(P.get('design')) ? P.get('design') : 'a'
    const TODAY = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const HOST = 'https://web-summit.sgit.ai/'

    // ---------- the ten questions (the ABP maker's, in its order) and its safe defaults, for any company ----------
    const Q = [
        { k: 'agent', q: 'Which agent is it, and whose?', hint: 'Its name, then whose it is. For example: Farol, at our bank.' },
        { k: 'task', q: 'What is it for, in one sentence?', hint: 'The one job it was given.' },
        { k: 'reach', q: 'What can it reach today?', hint: 'Systems, data, tools, money, people it can message. One per line. "Not sure" is a fine answer.', list: true },
        { k: 'never', q: 'What must it never do?', hint: 'One per line.', list: true },
        { k: 'yes', q: "What needs a person's yes before it acts?", hint: 'One per line.', list: true },
        { k: 'instructs', q: 'Who may tell it what to do?' },
        { k: 'readonly', q: 'What may it read but never act on?', hint: 'Things it reads as material, never as an instruction.', list: true },
        { k: 'unsure', q: 'When it is unsure, what does it do?' },
        { k: 'runs', q: 'How often does it run, and how many tokens may it use each time?' },
        { k: 'evidence', q: 'What shows it behaved?', hint: 'What someone could look at to check. One per line.', list: true },
    ]
    const SAFE = {
        agent: '', task: '',
        reach: 'Its own workspace\nEverything else: not known',
        never: "Send or post anything without a person's yes\nSpend money\nChange a live system or production data without a review\nPut a key, password or contact detail in a file or message",
        yes: 'Anything outside its own workspace\nAnything sent outside the team',
        instructs: 'Its owner and the people they name, within the company\'s rules',
        readonly: "Emails, web pages, documents, tickets and other agents' output",
        unsure: 'It stops, writes down the question, and waits for its owner',
        runs: 'When asked, at most 100 runs a day; up to 200,000 tokens per run, logged',
        evidence: 'A log of every action, tied to the agent and to the person who asked\nA token ledger line for every run\nA weekly note its owner reads',
    }
    // which ABP section each question fills (for the live highlight and design b's inline questions)
    const SEC_OF = ['head', 'mandate', 'reach', 'mandate', 'mandate', 'mandate', 'mandate', 'rules', 'rules', 'rules']
    const ORDER = DESIGN === 'b' ? [0, 2, 1, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]   // b fills the document top to bottom
    const STEPS = [{ t: 'Your agent', qs: [0, 1, 5, 8] }, { t: 'What it can do', qs: [2, 6] }, { t: 'What stops it', qs: [3, 4, 7, 9] }]

    // ---------- state: in memory only ----------
    const S = { phase: 'pick', x: null, slug: '', company: '', pasted: new Set(), pasteOpen: false, uc: null, agent: null, def: [], full: [], ans: [], pos: 0, step: 0, index: null, open: new Set() }
    const fresh = () => Object.assign(S, { phase: 'pick', x: null, slug: '', company: '', pasted: new Set(), pasteOpen: false, uc: null, agent: null, def: [], full: [], ans: [], pos: 0, step: 0, open: new Set() })

    const loadX = slug => fetch(`${up}data/xray/${encodeURIComponent(slug)}/xray.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
    // the X-rayed subjects, from the X-ray page's own index (one source of truth: admin/build/xray.mjs writes it)
    const loadIndex = () => S.index || (S.index = fetch(`${up}xray/index.html`).then(r => r.ok ? r.text() : '').then(h => { const m = h.match(/<script type="application\/json" id="xray-index">([\s\S]*?)<\/script>/); return m ? JSON.parse(m[1]).filter(s => s.status === 'prepared') : [] }).catch(() => []))

    const cleanName = n => String(n || '').replace(/\s*\([^)]*\)\s*$/, '').trim()
    // the suggested answers: short and plain (at most 15 words each); the X-ray's full text is kept in S.full, shown one
    // tap away under the answer and in the ABP's detail
    function defaults() {
        const x = S.x, uc = S.uc, ag = S.agent
        const d = Q.map(q => SAFE[q.k]); S.full = Q.map(() => null)
        if (x && ag) {
            d[0] = `${cleanName(ag.name)}, at ${x.subject}`
            const t = (ag.actions || [])[0] || String(ag.what || '').split(/(?<=\.)\s/)[0]
            d[1] = sentence(plain(t, 15)); if (d[1] !== sentence(t)) S.full[1] = [t]
        } else if (x) d[0] = `Our agent, at ${x.subject}`
        else if (S.company) d[0] = `Our agent, at ${S.company}`
        if (uc && (uc.reach || []).length) {
            const k = Math.min(3, uc.reach.length), per = Math.floor(15 / k)
            d[2] = uc.reach.slice(0, k).map(r => plain(r.what, per)).join('\n'); S.full[2] = uc.reach.map(r => r.what)
            const inGap = [...new Set((uc.gap || []).flatMap(g => g.reach || []))].map(id => (uc.reach || []).find(r => r.id === id)).filter(Boolean)
            if (inGap.length) { d[4] = inGap.slice(0, 2).map(r => `Using ${plain(r.what, 4).replace(/^\w/, c => c.toLowerCase())}`).join('\n') + '\nAnything sent outside the team'; S.full[4] = inGap.map(r => r.what) }
        }
        return d
    }

    // ---------- the ABP, from the answers: one model, two renderers (HTML and Markdown) ----------
    const NOT = /^(not sure|not known|don'?t know|unknown|skip(ped)?|n\/a|-)\s*[.!]?$/i
    const isNot = v => !String(v || '').trim() || NOT.test(String(v).trim())
    const items = v => String(v || '').split(/\n|;\s+/).map(s => s.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean)
    const KIND = t => /review|approv|human|analyst|investigator|counsel|person|sign.?off/i.test(t) ? 'review' : /filter|guardrail|redact|scan|injection|detect|classif|moderat/i.test(t) ? 'content' : /scope|permission|isolat|sandbox|within|token|key|role|least|limit|restrict|separate|environment|read-only|encrypt/i.test(t) ? 'capability' : 'rule'
    function model() {
        const a = i => String(S.ans[i] ?? '').trim()
        const x = S.x, uc = S.uc
        let [name, ...rest] = a(0).split(',')
        name = isNot(a(0)) || !name.trim() ? 'Your agent' : name.trim()
        let owner = rest.join(',').trim().replace(/^(at|run by|by|for|owned by|from)\s+/i, '').replace(/['’]s$/, '').trim()
        if (!owner && x) owner = x.subject
        if (!owner && S.company) owner = S.company
        const ownerS = owner ? `${owner}'s` : 'Its owner\'s'
        const fromX = !!(x && uc && a(2) === S.def[2])
        const reach = isNot(a(2)) ? [{ t: 'Not known yet', unknown: true }] : (fromX ? uc.reach.map(r => r.what) : items(a(2))).map(t => ({ t, unknown: /not (known|sure)|unknown/i.test(t) }))
        const never = isNot(a(3)) ? [] : items(a(3)), yes = isNot(a(4)) ? [] : items(a(4)), ro = isNot(a(6)) ? [] : items(a(6)), ev = isNot(a(9)) ? [] : items(a(9))
        const gaps = []
        if (fromX) for (const g of uc.gap || []) gaps.push(g.what)
        const unk = reach.filter(r => r.unknown)
        if (unk.length) gaps.push(`Some of its reach is not known yet (${unk.map(r => r.t).join('; ')}). Reach that has not been measured is a gap until it is.`)
        if (!fromX && yes.length && !reach.every(r => r.unknown)) gaps.push(`It may act on these without a person's yes unless a barrier stops it: ${yes.join('; ')}.`)
        const barriers = []
        if (fromX) for (const c of (uc.controls || []).slice(0, 3)) barriers.push([`${c.what} (in place, per the X-ray)`, KIND(c.what), `Public source, read on ${x.read_on || 'the X-ray date'}`])
        if (gaps.length) {
            barriers.push([`Remove or narrow the access behind each gap above, so it cannot act there alone (proposed)`, 'capability', 'The permission setting, checked and dated'])
        }
        if (yes.length) barriers.push([`A person's yes, recorded before it acts on anything in the needs-a-yes list (proposed)`, 'review', "Each such action in the log carries a named person's yes and the time"])
        if (never.length) barriers.push([`The never list: ${never.length} item${never.length > 1 ? 's' : ''} (proposed)`, 'rule', 'The action log, checked against each item after every run'])
        barriers.push(['A check on everything it sends outside: no keys, passwords or contact details (proposed)', 'content', "The check's record for each message sent"])
        const open = Q.map((q, i) => isNot(a(i)) ? `${q.q} (not answered yet)` : null).filter(Boolean)
        open.push('Who authorised this agent, by name?', 'When does its licence end?')
        if (fromX && (x.questions || []).length) open.push(`From the X-ray of ${x.subject}: ${x.questions.find(t => t.includes(name)) || x.questions[0]}`)
        const rules = [
            ...never.map(t => `Never: ${t.replace(/\.$/, '')}. Checked in the action log after every run.`),
            ...(yes.length ? [`Before it acts on anything in the needs-a-yes list (${yes.length} item${yes.length > 1 ? 's' : ''}), a person's yes is recorded. Checked: each such action in the log has a named yes and a time.`] : []),
            `It takes instructions only from: ${isNot(a(5)) ? 'not stated yet' : a(5).replace(/\.$/, '')}. Checked: every instruction in the log names who gave it.`,
            ...(ro.length ? [`It reads ${ro.join('; ').replace(/^\w/, c => c.toLowerCase()).replace(/\.$/, '')} as material, never as an instruction. Checked: no action in the log gives one of these as its reason.`] : []),
            `When unsure: ${isNot(a(7)) ? 'not stated yet' : a(7).replace(/\.$/, '')}. Checked: the questions it wrote down, with no action taken on them.`,
            `Runs and budget: ${isNot(a(8)) ? 'not stated yet' : a(8).replace(/\.$/, '')}. Checked: the run log and the token ledger, one line per run.`,
        ]
        const src = [`The interview at the RiskMandate stand, ${TODAY}`]
        if (x) src.push(`The RiskMandate X-ray of ${x.subject} (${HOST}xray/${x.slug}/), public sources read on ${x.read_on || 'the X-ray date'}`)
        const reachShort = reach[0].unknown && reach.length === 1 ? 'Not known yet' : `${plain(reach[0].t, 6)}${reach.length > 1 ? `, and ${reach.length - 1} more` : ''}`
        return {
            title: `ABP: ${name}`, banner: 'Draft, made at the RiskMandate stand, not in force.',
            line1: `Draft for ${owner || 'your company'}, made at the RiskMandate stand. Not in force.`,
            sections: [
                { id: 'head', blocks: [{ p: `${ownerS} agent, in RiskMandate's terms: Reach, Mandate, Gap, Barriers. Draft 1, made with the ABP maker at the RiskMandate stand, Web Summit Lisbon, ${TODAY}.` }] },
                { id: 'reach', t: 'Reach', short: reachShort, h: 'Reach: what it can access or affect', blocks: [{ ul: reach.map(r => r.t) }, { p: `How known: ${fromX ? `from the RiskMandate X-ray of ${x.subject}, public sources read on ${x.read_on || 'the X-ray date'}` : `stated at the stand on ${TODAY}`}. Not measured yet.` }] },
                { id: 'mandate', t: 'Mandate', short: isNot(a(1)) ? 'Not stated yet' : plain(a(1), 9), h: 'Mandate: what was authorised', blocks: [{ dl: [
                    ['Business task', isNot(a(1)) ? 'Not stated yet' : sentence(a(1))],
                    ['Deployment scope', owner ? `${owner}, for the task above` : 'The task above'],
                    ['Never', never.length ? never : ['Not stated yet']],
                    ["Needs a person's yes", yes.length ? yes : ['Not stated yet']],
                    ['Who instructs it', isNot(a(5)) ? 'Not stated yet' : sentence(a(5))],
                    ['Read, never acted on', ro.length ? ro : ['Not stated yet']],
                    ['Authorised by', 'Not named yet (an open question)'],
                ] }] },
                { id: 'gap', t: 'Gap', short: !gaps.length ? 'None named yet' : gaps.length === 1 ? plain(gaps[0], 9) : `${gaps.length} things it can reach beyond its job`, h: 'Gap: what it can reach beyond its authority', blocks: [{ ul: gaps.length ? gaps : ['No gap named yet. Name one thing it can reach that it should not use on its own.'] }] },
                { id: 'barriers', t: 'Barriers', short: `${barriers.length} barriers, ${open.length} open questions`, h: 'Barriers: what stands in the way', blocks: [{ table: { head: ['Barrier', 'Kind', 'Evidence'], rows: barriers } }, { h3: 'Open questions' }, { ul: open }] },
                { id: 'licence', t: 'Licence', short: 'Proposed: 90 days, owner to be named', h: 'Licence to Operate', blocks: [{ table: { head: ['', ''], rows: [
                    ['Authority', owner ? `${owner}, the deployer` : 'The deployer (not named yet)'],
                    ['Accountable owner', `A named person${owner ? ` at ${owner}` : ''} (to be named)`],
                    ['Licensee', name],
                    ['Conditions', 'The Mandate and the rules below, with the proposed barriers in place'],
                    ['Validity', 'Not set. Proposed: 90 days from approval'],
                    ['Review', 'Every 90 days, and after any action outside the Mandate'],
                ] } }] },
                { id: 'rules', t: 'Rules', short: `${rules.length} rules, each one checkable`, h: 'Rules it is checked against', blocks: [{ ol: rules }, ...(ev.length ? [{ p: `Evidence that it behaved: ${ev.join('; ').replace(/\.$/, '')}.` }] : [])] },
                { id: 'provenance', t: 'Provenance', short: `Draft 1, ${TODAY}, made at the stand`, h: 'Provenance', blocks: [{ dl: [
                    ['Owner', owner || 'Not named yet'],
                    ['Drafted by', "The ABP maker's ten questions (abp-maker@web-summit.indi), answered at the RiskMandate stand"],
                    ['Sources', src],
                    ['Version', 'Draft 1'], ['Date', TODAY],
                    ['Status', 'Draft, made at the RiskMandate stand, not in force'],
                    ['Phase', 'Explorer: it observes and recommends, it blocks nothing'],
                ] }] },
            ],
        }
    }
    const blockHtml = b => b.p ? `<p>${esc(b.p)}</p>` : b.h3 ? `<h3>${esc(b.h3)}</h3>` : b.ul ? `<ul>${b.ul.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : b.ol ? `<ol>${b.ol.map(t => `<li>${esc(t)}</li>`).join('')}</ol>`
        : b.dl ? `<dl>${b.dl.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${Array.isArray(v) ? (v.length > 1 ? `<ul>${v.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : esc(v[0])) : esc(v)}</dd>`).join('')}</dl>`
        : b.table ? `<div class="abpm-tw"><table>${b.table.head.some(Boolean) ? `<thead><tr>${b.table.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${b.table.rows.map(r => `<tr>${r.map((c, i) => i === 0 && !b.table.head[0] ? `<th scope="row">${esc(c)}</th>` : `<td>${i === 1 && b.table.head[1] === 'Kind' ? `<span class="abpm-kind k-${esc(c)}">${esc(c)}</span>` : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''
    const secHtml = s => `${s.h ? `<h2>${esc(s.h)}</h2>` : ''}${s.blocks.map(blockHtml).join('')}`
    const cell = s => String(s).replace(/\|/g, '/').replace(/\n/g, ' ')
    const blockMd = b => b.p ? b.p : b.h3 ? `### ${b.h3}` : b.ul ? b.ul.map(t => `- ${t}`).join('\n') : b.ol ? b.ol.map((t, i) => `${i + 1}. ${t}`).join('\n')
        : b.dl ? b.dl.map(([k, v]) => Array.isArray(v) ? (v.length > 1 ? `- **${k}:**\n${v.map(t => `  - ${t}`).join('\n')}` : `- **${k}:** ${v[0]}`) : `- **${k}:** ${v}`).join('\n')
        : b.table ? [`| ${b.table.head.map(h => h || ' ').join(' | ')} |`, `|${b.table.head.map(() => '---').join('|')}|`, ...b.table.rows.map(r => `| ${r.map(cell).join(' | ')} |`)].join('\n') : ''
    const toMd = m => [`# ${m.title}`, `> ${m.banner}`, ...m.sections.map(s => [s.h ? `## ${s.h}` : '', ...s.blocks.map(blockMd)].filter(Boolean).join('\n\n'))].join('\n\n') + '\n'
    // the ABP on screen: the title, one line, then each section as a subtitle with one short line, its detail folded away
    // (tap to open); printing opens them all
    const docHtml = (m, pend) => `<h1 class="abpm-dtitle">${esc(m.title)}</h1><p class="abpm-line1" data-sec="head">${esc(m.line1)}</p>${m.sections.filter(s => s.h).map(s => `<details class="abpm-sec${pend && pend(s.id) ? ' pending' : ''}" data-sec="${s.id}"${S.open.has(s.id) ? ' open' : ''}><summary><b>${esc(s.t)}</b><span>${esc(s.short)}</span></summary><div class="abpm-secb">${s.blocks.map(blockHtml).join('')}</div></details>`).join('')}`

    // ---------- Refine with Claude: a link that carries the maker's prompt and the answers (no iframe: claude.ai refuses framing) ----------
    function claudeUrl() {
        const ans = Q.map((q, i) => `${i + 1}. ${q.q}\n${clipW(String(S.ans[i] || 'not sure').trim() || 'not sure', 600)}`).join('\n\n')
        const prompt = `You are an ABP maker. Help me finish an Agent Behaviour Policy (ABP) for one of my AI agents. I started it at the RiskMandate stand at Web Summit Lisbon on ${TODAY}${S.x ? `, from the RiskMandate X-ray of ${S.x.subject} (${HOST}xray/${S.x.slug}/)` : S.company ? `, for an agent at ${S.company}${S.pasted.size ? ', with answers suggested by a live X-ray in Claude' : ''}` : ''}.

The words, from RiskMandate:
- Reach: what the agent can access or affect today, and how that is known.
- Mandate: what it was authorised to do, and by whom.
- Gap: what is in its Reach but outside its Mandate.
- Barriers: what stands in the way of each gap. Each has a kind: rule (the agent keeps it), review (a person or agent checks), capability (a technical control removes or limits the ability), content (a check on what it writes or sends).
- Licence to Operate: authority, accountable owner, licensee, conditions, validity, review.
- Provenance: owner, who drafted it, sources, version, date, status.

My answers to the ten questions so far:

${ans}

Please:
1. Ask me one question at a time, at most five, about anything vague or "not sure". Start with Reach. Never guess Reach: write "not known" and list it as an open question.
2. Then write the ABP in Markdown with these sections: Reach, Mandate, Gap, Barriers (a table: Barrier, Kind, Evidence; then Open questions), Licence to Operate, Rules it is checked against (numbered, each one testable), Provenance.
3. Check it: every rule names what someone could look at to see it was kept; at least one gap is named; at least one barrier is more than a rule; nothing contradicts; no keys, passwords or contact details.
4. Mark it "Draft, not in force". Plain words, short sentences.

(The questions are from abp-maker@web-summit.indi: ${HOST}abp-creation/)`
        return 'https://claude.ai/new?q=' + encodeURIComponent(prompt)
    }

    // ---------- the page ----------
    document.body.classList.add('abpm-on')
    document.querySelector('.frame')?.classList.add('abpm-frame')
    const kept = [...main.children]
    const teamH = main.querySelector('#team'), notes = document.createElement('details')
    notes.className = 'abpm-notes'; notes.innerHTML = '<summary>Notes for the stand team</summary>'
    if (teamH) { let n = teamH.nextElementSibling; while (n) { const nx = n.nextElementSibling; notes.appendChild(n); n = nx } }
    for (const el of kept) el.hidden = true
    const root = document.createElement('div'); root.id = 'abpm'; root.className = `abpm abpm-${DESIGN}`
    main.prepend(root); main.appendChild(notes)
    const PRIV = '<p class="abpm-priv">Nothing you type is stored or sent anywhere. It stays on this screen until you press Start again.</p>'
    const INFO = '<details class="abpm-i"><summary aria-label="About this page">i</summary><div><p>Enter to go on. Shift+Enter for a new line.</p><p>Nothing you type is stored or sent anywhere. It stays on this screen until you press Start again.</p></div></details>'

    const titleBar = () => `<div class="abpm-bar"><div class="abpm-brand"><b>Make your ABP</b><span>${S.x ? `From the X-ray of <b>${esc(S.x.subject)}</b>${S.agent ? ` · ${esc(cleanName(S.agent.name))}` : ''}` : S.company ? `For <b>${esc(S.company)}</b>` : 'An Agent Behaviour Policy, in ten questions'}</span></div><div class="abpm-bar-acts">${S.phase !== 'pick' && S.x ? '<button type="button" class="abpm-link" data-act="change">Change agent</button>' : ''}${S.phase !== 'pick' ? '<button type="button" class="abpm-link" data-act="restart">Start again</button>' : ''}${INFO}</div></div>`
    const dots = () => `<ol class="abpm-dots" aria-label="Progress">${ORDER.map((qi, p) => `<li><button type="button" data-go="${p}" class="${p < S.pos || S.phase === 'done' ? 'did' : ''}${p === S.pos && S.phase === 'ask' ? ' now' : ''}" aria-label="Question ${p + 1}: ${esc(Q[qi].q)}"${p === S.pos && S.phase === 'ask' ? ' aria-current="step"' : ''}>${p + 1}</button></li>`).join('')}</ol>`
    const srcNote = i => {
        if (!(S.ans[i] === S.def[i] && S.def[i])) return S.def[i] ? '<button type="button" class="abpm-link" data-act="usedef">Put the suggestion back</button>' : ''
        const fromX = S.x && ((i <= 1 && S.agent) || (i === 2 && S.uc && S.def[2] !== SAFE.reach) || (i === 4 && S.def[4] !== SAFE.yes))
        const say = fromX ? `Suggested from ${esc(S.x.subject)}'s X-ray. Keep it or change it.` : S.pasted.has(i) ? "From Claude's X-ray. Keep it or change it." : 'A safe default. Keep it or change it.'
        return S.full[i] && fromX ? `<details class="abpm-full"><summary>${say} <u>Full text</u></summary><ul>${S.full[i].map(t => `<li>${esc(t)}</li>`).join('')}</ul></details>` : say
    }
    const field = (i, label) => `<div class="abpm-q" data-q="${i}"><p class="abpm-qn">${label}</p><label class="abpm-qt" for="abpm-f${i}">${esc(Q[i].q)}</label>
<textarea id="abpm-f${i}" class="abpm-f" data-i="${i}" rows="${Math.min(6, Math.max(1, String(S.ans[i] || '').split('\n').length))}" autocomplete="off" autocapitalize="sentences" spellcheck="true" placeholder="${esc(Q[i].hint || '')}">${esc(S.ans[i] || '')}</textarea>
<p class="abpm-src" data-src="${i}">${srcNote(i)}</p></div>`
    const navBtns = (back, next) => `<div class="abpm-nav"><button type="button" class="abpm-btn ghost" data-act="back"${back ? '' : ' disabled'}>← Back</button><button type="button" class="abpm-btn ghost" data-act="skip">Not sure, skip</button><button type="button" class="abpm-btn" data-act="next">${next}</button></div>`
    const doneActs = () => `<div class="abpm-done-acts"><button type="button" class="abpm-btn" data-act="print">Print or save as PDF</button><button type="button" class="abpm-btn ghost" data-act="copy">Copy as Markdown</button><a class="abpm-btn ghost" data-act="claude" href="${esc(claudeUrl())}" target="_blank" rel="noopener">Refine with Claude ↗</a></div><p class="abpm-status" role="status"></p>`

    // ---------- Paste Claude's X-ray (WS-191): the answer to the X-ray page's live prompt (assets/xray.js, claudeXrayUrl) fills
    // the suggested answers it can read; simple and forgiving: the numbered lines 1 to 10 after "ABP ANSWERS" ----------
    const pasteBox = () => S.x ? '' : `<details class="abpm-paste"${S.pasteOpen ? ' open' : ''}><summary>Paste Claude's X-ray <span>${esc(S.pasteMsg || '(optional)')}</span></summary><div><label class="abpm-sr" for="abpm-paste">Claude's X-ray</label><textarea id="abpm-paste" class="abpm-pastet" rows="5" placeholder="Paste Claude's whole answer here"></textarea><p><button type="button" class="abpm-btn" data-act="paste">Fill the answers</button></p><p class="abpm-paste-st" role="status">${esc(S.pasteMsg || '')}</p></div></details>`
    const LISTQ = new Set([2, 3, 4, 6, 9])
    const nq = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    function parsePasted(text) {
        let t = String(text || '').replace(/\r/g, '').replace(/\*\*|__|`/g, '').replace(/\u2014|\u2013/g, ', ')
        const at = t.search(/ABP ANSWERS/i); if (at >= 0) t = t.slice(at).replace(/^.*\n?/, '')
        const end = t.search(/\n\s*#*\s*SOURCES\b/i); if (end >= 0) t = t.slice(0, end)
        const out = [], seen = new Set()
        let cur = -1
        for (const raw of t.split('\n')) {
            const line = raw.replace(/^\s*#+\s*/, '').trim(); if (!line) continue
            const m = line.match(/^(?:Q(?:uestion)?\s*)?(\d{1,2})\s*[.):-]\s*(.*)$/i)
            if (m && +m[1] >= 1 && +m[1] <= 10 && !seen.has(+m[1] - 1)) { cur = +m[1] - 1; seen.add(cur); out[cur] = m[2]; continue }
            if (cur >= 0) out[cur] = (out[cur] ? out[cur] + '\n' : '') + line.replace(/^[-*•]\s*/, '')
        }
        return out.map((v, i) => {
            if (v == null) return null
            let a = v.trim()
            // drop the question if it was repeated, and an "Answer:" label
            const two = t => nq(t).split(' ').slice(0, 2).join(' ')
            const qm = a.match(/^([^?]{4,140}\?)\s*(\([^)]*\))?\s*[:-]?\s*/); if (qm && two(qm[1]) === two(Q[i].q)) a = a.slice(qm[0].length)
            else if (nq(a).startsWith(nq(Q[i].q))) a = a.slice(Q[i].q.length)
            a = a.replace(/^(answer|a)\s*:\s*/i, '').replace(/^[:\s-]+/, '').trim()
            if (LISTQ.has(i)) a = a.split(/\n|;\s+/).map(x => x.replace(/^[-*•]\s*/, '').trim()).filter(Boolean).join('\n')
            return a || null
        })
    }
    function applyPaste() {
        const ta = root.querySelector('.abpm-pastet'), got = parsePasted(ta ? ta.value : '')
        const n = got.filter(Boolean).length
        S.pasteOpen = true
        if (n < 3) { S.pasteMsg = "Could not read the ten numbered answers, so the safe defaults stay."; return render() }
        got.forEach((v, i) => { if (v && !/^not found\W*$/i.test(v)) { S.def[i] = v; S.ans[i] = v; S.pasted.add(i) } })
        S.pasteMsg = `Filled ${n} of 10 answers from Claude's X-ray. Check each one.`
        S.pasteOpen = false
        render()
    }

    // which sections are still to come (dimmed while the interview has not reached them)
    const firstQ = { head: 0, mandate: 1, reach: 2, gap: 4, barriers: 4, licence: 0, rules: 7, provenance: 0 }
    const pending = id => S.phase === 'ask' && ORDER.indexOf(firstQ[id]) > S.pos

    function render() {
        if (S.phase === 'pick') return renderPick()
        if (DESIGN === 'b') return renderB()
        if (DESIGN === 'c') return renderC()
        return renderA()
    }
    function after(focus) {
        root.querySelectorAll('.abpm-f').forEach(fit)
        if (focus) { const f = root.querySelector(focus); if (f && fine.matches) { f.focus({ preventScroll: true }); const n = f.value.length; f.setSelectionRange(n, n) } }
    }
    function fit(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px' }

    // a: Interview: one big question, the ABP building beside it
    function renderA() {
        const qi = ORDER[S.pos], done = S.phase === 'done'
        root.innerHTML = `${titleBar()}${pasteBox()}${dots()}<div class="abpm-grid"><section class="abpm-card" aria-live="polite">${done
            ? `<p class="abpm-qn">All ten answered</p><h2 class="abpm-qt">Your draft ABP is ready.</h2><p class="abpm-lede">Print it, save it or copy it. A draft, not in force.</p>${doneActs()}<div class="abpm-nav"><button type="button" class="abpm-btn ghost" data-act="back">← Change an answer</button></div>`
            : field(qi, `Question ${S.pos + 1} of 10`) + navBtns(S.pos > 0, S.pos === 9 ? 'Finish ✓' : 'Next →')}</section>
<aside class="abpm-side" aria-label="Your ABP, as it builds"><div class="abpm-doc">${docHtml(model(), pending)}</div></aside></div>`
        after(done ? null : `#abpm-f${qi}`)
        hot(qi)
    }
    function hot(qi) {
        const side = root.querySelector('.abpm-side'), doc = root.querySelector('.abpm-doc'); if (!doc || S.phase !== 'ask') return
        const sec = doc.querySelector(`[data-sec="${SEC_OF[qi]}"]`); if (!sec) return
        sec.classList.add('hot'); if (sec.tagName === 'DETAILS') sec.open = true
        if (side && side.scrollHeight > side.clientHeight + 4) side.scrollTo({ top: Math.max(0, sec.offsetTop - 12), behavior: 'auto' })
    }
    // b: Builder: the document itself, each section with its questions inline
    function renderB() {
        const m = model(), done = S.phase === 'done', active = done ? -1 : ORDER[S.pos]
        const qsIn = { head: [0], reach: [2], mandate: [1, 3, 4, 5, 6], rules: [7, 8, 9] }
        const qBlock = qi => {
            const p = ORDER.indexOf(qi)
            if (qi === active) return `<div class="abpm-inline now">${field(qi, `Question ${p + 1} of 10`)}${navBtns(p > 0, p === 9 ? 'Finish ✓' : 'Next →')}</div>`
            return `<button type="button" class="abpm-inline ${p < S.pos || done ? 'did' : 'todo'}" data-go="${p}"><span class="abpm-qn">Question ${p + 1}</span> <b>${esc(Q[qi].q)}</b>${p < S.pos || done ? `<span class="abpm-ans">${esc(clipW(String(S.ans[qi] || 'not sure').replace(/\n/g, '; '), 140))}</span><span class="abpm-ed">Change</span>` : ''}</button>`
        }
        root.innerHTML = `${titleBar()}${pasteBox()}<div class="abpm-sticky">${dots()}${done ? doneActs() : ''}</div><article class="abpm-doc abpm-build"><p class="abpm-banner">${esc(m.banner)}</p><h1 class="abpm-dtitle">${esc(m.title)}</h1>${m.sections.map(s => `<section class="abpm-sec${pending(s.id) ? ' pending' : ''}" data-sec="${s.id}">${s.h ? `<h2>${esc(s.h)}</h2>` : ''}${(qsIn[s.id] || []).map(qBlock).join('')}<div class="abpm-part">${s.blocks.map(blockHtml).join('')}</div></section>`).join('')}</article>${PRIV}`
        after(done ? null : `#abpm-f${active}`)
        const now = root.querySelector('.abpm-inline.now'); if (now && S.pos > 0) now.scrollIntoView({ block: 'start', behavior: 'auto' })
    }
    function refreshB() {   // on input: only the derived parts and the title change, so the field keeps its focus
        const m = model(), t = root.querySelector('.abpm-dtitle'); if (t) t.textContent = m.title
        for (const s of m.sections) { const p = root.querySelector(`[data-sec="${s.id}"] .abpm-part`); if (p) p.innerHTML = s.blocks.map(blockHtml).join('') }
    }
    // c: Story: three steps, the questions grouped, then the finished ABP
    function renderC() {
        const done = S.phase === 'done', st = STEPS[S.step], answered = done ? 10 : STEPS.slice(0, S.step).reduce((k, s) => k + s.qs.length, 0)
        root.innerHTML = `${titleBar()}${pasteBox()}<ol class="abpm-steps">${[...STEPS, { t: 'Your ABP' }].map((s, k) => `<li class="${(done ? 3 : S.step) === k ? 'now' : k < (done ? 3 : S.step) ? 'did' : ''}"><span>${k + 1}</span>${esc(s.t)}</li>`).join('')}</ol><p class="abpm-count">${answered} of 10 answered</p>${done
            ? `<section class="abpm-card abpm-final"><h2 class="abpm-qt">Your draft ABP is ready.</h2>${doneActs()}<div class="abpm-nav"><button type="button" class="abpm-btn ghost" data-act="back">← Change an answer</button></div></section><div class="abpm-doc">${docHtml(model())}</div>`
            : `<section class="abpm-card"><h2 class="abpm-step-t">Step ${S.step + 1} of 3: ${esc(st.t)}</h2>${st.qs.map(qi => field(qi, `Question ${STEPS.flatMap(s => s.qs).indexOf(qi) + 1} of 10`) + `<p class="abpm-skip1"><button type="button" class="abpm-link" data-act="unsure" data-i="${qi}">Not sure</button></p>`).join('')}
<div class="abpm-nav"><button type="button" class="abpm-btn ghost" data-act="back"${S.step ? '' : ' disabled'}>← Back</button><button type="button" class="abpm-btn" data-act="next">${S.step === 2 ? 'Make my ABP ✓' : 'Next step →'}</button></div><p class="abpm-keys">Enter for the next question · Shift+Enter for a new line</p></section>`}${PRIV}`
        after(done ? null : `#abpm-f${st.qs[0]}`)
    }
    // the picker: a company (from the X-ray's list), then one of its agents
    async function renderPick() {
        root.innerHTML = `${titleBar()}<section class="abpm-card abpm-pick"><p class="abpm-qn">Loading…</p></section>`
        if (S.x) {
            const ucs = S.x.use_cases || []
            root.querySelector('.abpm-pick').innerHTML = `<p class="abpm-qn">${esc(S.x.subject)}</p><h2 class="abpm-qt">Which agent should the ABP be for?</h2><div class="abpm-choices">${ucs.map(u => { const ag = (S.x.agents || []).find(a => a.id === u.agent); return `<button type="button" class="abpm-choice" data-uc="${esc(u.id)}"><b>${esc(cleanName(ag ? ag.name : u.name))}</b><span>${esc(u.name)}</span><i>${(u.gap || []).length} in the gap</i></button>` }).join('')}<button type="button" class="abpm-choice ghost" data-own="1"><b>Another agent</b><span>Start from the safe defaults</span></button></div>`
            return
        }
        const idx = await loadIndex()
        if (S.phase !== 'pick' || S.x) return
        root.querySelector('.abpm-pick').innerHTML = `<h2 class="abpm-qt">Which company's agent?</h2><p class="abpm-lede">Pick a company we have X-rayed and the answers are suggested from its X-ray. Or start from the safe defaults.</p><div class="abpm-choices">${idx.map(s => `<button type="button" class="abpm-choice" data-x="${esc(s.slug)}"><b>${esc(s.subject)}</b><span>${esc(s.kind || '')}</span></button>`).join('')}<button type="button" class="abpm-choice ghost" data-own="1"><b>My own agent</b><span>No X-ray: start from the safe defaults</span></button></div><p class="abpm-lede"><a href="${up}xray/index.html">X-ray a company first →</a></p>`
    }

    function setUrl() {
        const q = new URLSearchParams(); if (S.slug) q.set('x', S.slug); else if (S.company) q.set('company', S.company); if (S.uc) q.set('uc', S.uc.id); else if (S.agent) q.set('a', S.agent.id)
        if (P.get('design')) q.set('design', DESIGN)
        try { history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '')) } catch { }
    }
    function start(uc, agent) {
        S.uc = uc || null; S.agent = agent || (uc && S.x ? (S.x.agents || []).find(a => a.id === uc.agent) : null) || null
        S.pasted = new Set(); S.pasteMsg = ''
        S.def = defaults(); S.ans = S.def.slice(); S.pos = 0; S.step = 0; S.phase = 'ask'
        setUrl(); render(); window.scrollTo({ top: 0 })
    }
    async function pickCompany(slug) {
        root.querySelector('.abpm-pick') && (root.querySelector('.abpm-pick').innerHTML = '<p class="abpm-qn">Reading the X-ray…</p>')
        try { S.x = await loadX(slug); S.slug = slug } catch { S.x = null; S.slug = '' }
        setUrl(); render()
    }
    function restart() { fresh(); setUrl(); render(); window.scrollTo({ top: 0 }) }

    function readField(t) {
        const i = +t.dataset.i; S.ans[i] = t.value
        const sn = root.querySelector(`[data-src="${i}"]`); if (sn) sn.innerHTML = srcNote(i)
        fit(t)
        if (DESIGN === 'a') { const d = root.querySelector('.abpm-doc'); if (d) { d.innerHTML = docHtml(model(), pending); hot(i) } }
        else if (DESIGN === 'b') refreshB()
    }
    function go(p) { S.phase = 'ask'; S.pos = Math.max(0, Math.min(9, p)); render() }
    function next() {
        if (DESIGN === 'c') { if (S.step < 2) { S.step++; render(); window.scrollTo({ top: 0 }) } else { S.phase = 'done'; render(); window.scrollTo({ top: 0 }) } return }
        if (S.pos < 9) go(S.pos + 1); else { S.phase = 'done'; render(); if (DESIGN === 'b') window.scrollTo({ top: 0 }) }
    }
    function back() {
        if (DESIGN === 'c') { if (S.phase === 'done') { S.phase = 'ask'; S.step = 2 } else if (S.step) S.step--; render(); return }
        if (S.phase === 'done') go(9); else if (S.pos) go(S.pos - 1)
    }
    async function copyMd(btn) {
        const md = toMd(model()), st = root.querySelector('.abpm-status')
        let ok = false
        try { await navigator.clipboard.writeText(md); ok = true } catch { }
        if (!ok) { const t = document.createElement('textarea'); t.value = md; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { ok = document.execCommand('copy') } catch { } t.remove() }
        if (st) st.textContent = ok ? 'Copied as Markdown. Paste it anywhere.' : 'Could not copy here. Use Print or save as PDF instead.'
        if (btn && ok) { btn.textContent = 'Copied ✓'; setTimeout(() => { btn.textContent = 'Copy as Markdown' }, 2500) }
    }

    root.addEventListener('input', e => { if (e.target.classList.contains('abpm-f')) readField(e.target) })
    root.addEventListener('keydown', e => {
        const t = e.target
        if (t.classList && t.classList.contains('abpm-f') && e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
            e.preventDefault()
            if (DESIGN === 'c') { const qs = STEPS[S.step].qs, k = qs.indexOf(+t.dataset.i); if (k < qs.length - 1) { const n = root.querySelector(`#abpm-f${qs[k + 1]}`); n.focus(); n.setSelectionRange(n.value.length, n.value.length); return } }
            next()
        }
    })
    root.addEventListener('toggle', e => { if (e.target.classList && e.target.classList.contains('abpm-paste')) S.pasteOpen = e.target.open }, true)
    root.addEventListener('click', e => {
        const sm = e.target.closest('.abpm-sec > summary'); if (sm) { const d = sm.parentElement; if (d.open) S.open.delete(d.dataset.sec); else S.open.add(d.dataset.sec); return }
        const b = e.target.closest('button, a'); if (!b || !root.contains(b)) return
        const act = b.dataset.act
        if (b.dataset.go != null) return go(+b.dataset.go)
        if (b.dataset.x) return pickCompany(b.dataset.x)
        if (b.dataset.uc) return start((S.x.use_cases || []).find(u => u.id === b.dataset.uc))
        if (b.dataset.own) { if (!S.x) { S.slug = '' } return start(null, null) }
        if (act === 'next') return next()
        if (act === 'back') return back()
        if (act === 'skip') { S.ans[ORDER[S.pos]] = 'Not sure'; return next() }
        if (act === 'unsure') { const t = root.querySelector(`#abpm-f${b.dataset.i}`); if (t) { t.value = 'Not sure'; readField(t) } return }
        if (act === 'usedef') { const t = b.closest('.abpm-q').querySelector('.abpm-f'); t.value = S.def[+t.dataset.i]; readField(t); t.focus(); return }
        if (act === 'restart') return restart()
        if (act === 'paste') return applyPaste()
        if (act === 'change') { S.phase = 'pick'; S.uc = null; S.agent = null; setUrl(); return render() }
        if (act === 'print') { window.print(); return }
        if (act === 'copy') return copyMd(b)
        if (act === 'claude') b.href = claudeUrl()   // the newest answers, then the link opens as usual
    })
    let shut = []
    addEventListener('beforeprint', () => { document.body.classList.add('abpm-print'); shut = [...root.querySelectorAll('details.abpm-sec:not([open])')]; shut.forEach(d => { d.open = true }) })
    addEventListener('afterprint', () => { document.body.classList.remove('abpm-print'); shut.forEach(d => { d.open = false }); shut = [] })
    // coming back with the Back button must not show the last visitor's answers
    addEventListener('pageshow', e => { if (e.persisted) restart() })

    // ---------- start: ?x=<slug>&uc=<id> or &a=<id> from the X-ray's button ----------
    ;(async () => {
        const slug = (P.get('x') || '').toLowerCase().replace(/[^a-z0-9-]/g, '')
        if (slug) {
            try { S.x = await loadX(slug); S.slug = slug } catch { S.x = null }
            if (S.x) {
                const uc = (S.x.use_cases || []).find(u => u.id === P.get('uc'))
                const ag = (S.x.agents || []).find(a => a.id === P.get('a'))
                if (uc) return start(uc)
                if (ag) return start((S.x.use_cases || []).find(u => u.agent === ag.id), ag)
            }
        }
        // ?company=<name>: a company not X-rayed yet (from the X-ray's "Make their ABP"); the maker's safe defaults
        const co = String(P.get('company') || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80)
        if (!S.x && co) { S.company = co; return start(null, null) }
        render()
    })()
})()
