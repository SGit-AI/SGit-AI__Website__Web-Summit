/* The clean command centre (Silvio, 11 November 2026): the Universe's look on every page, one font (Barlow condensed),
   the side menu hidden behind a ☰ button, a row of flow buttons on top, a full-screen button, views that open with a zoom.
   Two modes, switched inside the ☰ menu: Client (only UNIVERSO ✦ and GRAVITY on top, for the stand) and Work (also
   VISÃO GERAL and TAREFAS). Adds the GRAVITY view (the library's page). By dashboard@web-summit.silvio. */
(function () {
    const X = window.CC_EXTRA = window.CC_EXTRA || {}; X.views = X.views || {}
    const SITE = 'https://web-summit.sgit.ai/', FONTS = 'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@300;400;500;600&family=Barlow+Condensed:wght@500;600&display=swap'
    const get = k => { try { return localStorage.getItem(k) } catch { return null } }, put = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
    let MODE = get('cc.mode') || 'work'
    const FLOWS = { client: [['stand', 'Universo ✦'], ['gravity', 'Gravity']], work: [['home', 'Visão geral'], ['stand', 'Universo ✦'], ['gravity', 'Gravity'], ['tasks', 'Tarefas']] }
    const html = document.documentElement
    if (![...document.querySelectorAll('link')].some(l => l.href === FONTS)) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS; document.head.appendChild(l) }
    const css = document.createElement('style'); css.id = 'cc-shell-css'; css.textContent = `
html.cc-shell { --rm-font: "Barlow Semi Condensed", "Arial Narrow", ui-sans-serif, system-ui, sans-serif; }
html.cc-shell body, html.cc-shell .cc, html.cc-shell .cc * { font-family: "Barlow Semi Condensed", "Arial Narrow", ui-sans-serif, system-ui, sans-serif; }
html.cc-shell .cc code, html.cc-shell .cc pre, html.cc-shell .cc kbd { font-family: ui-monospace, Menlo, monospace; }
html.cc-shell[data-theme="dark"] body, html.cc-shell:not([data-theme]) body { background: radial-gradient(1100px 700px at 30% 40%, #0E3330 0%, transparent 62%), radial-gradient(900px 600px at 90% 90%, #0B2826 0%, transparent 60%), #04100F fixed; }
html.cc-shell[data-theme="dark"] .cc-main, html.cc-shell[data-theme="dark"] .cc-top { background: transparent; }
html.cc-shell[data-theme="dark"] .cc-top { background: rgba(4,16,15,.72); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(150,230,215,.14); }
html.cc-shell .cc-layout { grid-template-columns: minmax(0, 1fr); }
html.cc-shell .cc-side { position: fixed; inset: 0 auto 0 0; width: 290px; z-index: 60; transform: translateX(-105%); transition: transform .45s cubic-bezier(.2,.8,.2,1); background: rgba(4,18,18,.96); backdrop-filter: blur(18px); border-right: 1px solid rgba(150,230,215,.3); }
html.cc-shell.cc-drawer .cc-side { transform: none; box-shadow: 40px 0 80px rgba(0,0,0,.6); }
html.cc-shell .cc-scrim { position: fixed; inset: 0; z-index: 55; background: rgba(0,0,0,.45); opacity: 0; pointer-events: none; transition: opacity .3s; }
html.cc-shell.cc-drawer .cc-scrim { opacity: 1; pointer-events: auto; }
html.cc-shell .cc-top { gap: 10px; }
html.cc-shell .cc-top .title, html.cc-shell .cc-top .cc-mark, html.cc-shell .cc-top .cc-search { display: none; }
html.cc-shell .cc-tools .cc-iconbtn:hover { background: rgba(67,217,198,.12) !important; color: #fff !important; }
html.cc-shell .cc-tools .cc-iconbtn[aria-current] { background: rgba(67,217,198,.16) !important; color: #43D9C6 !important; }
html.cc-shell .cc-detailsbtn { background: transparent !important; border: 0 !important; color: #CFE3DF !important; border-radius: 999px !important; font: 600 13px "Barlow Condensed", sans-serif !important; letter-spacing: 1.4px; text-transform: uppercase; }
html.cc-shell .cc-detailsbtn:hover, html.cc-shell .cc-detailsbtn[aria-pressed="true"] { background: rgba(67,217,198,.12) !important; color: #fff !important; }
html.cc-shell .cc-forme .cc-count { background: #FF4D6D !important; color: #fff !important; border: 2px solid #04100F !important; box-shadow: 0 0 10px rgba(255,77,109,.6); font-family: "Barlow Semi Condensed", sans-serif !important; }
html.cc-shell .cc-today { display: none !important; }
.cc-when { display: grid; text-align: right; line-height: 1.05; padding-right: 4px; } .cc-when b { font: 500 21px "Barlow Semi Condensed", sans-serif; color: #EAF6F3; } .cc-when small { font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.6px; text-transform: uppercase; color: #8EADA8; }
html.cc-shell .cc-tools { position: relative; gap: 8px !important; background: transparent !important; border: 0 !important; padding: 0 !important; backdrop-filter: none; }
html.cc-shell .cc-tools > .cc-iconbtn, html.cc-shell .cc-burger, html.cc-shell .cc-fsbtn { width: 38px !important; height: 38px !important; border-radius: 50% !important; border: 1px solid rgba(150,230,215,.32) !important; background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.12), rgba(10,30,30,.75) 60%) !important; color: #DCEBE8 !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 6px 14px rgba(0,0,0,.4); transition: transform .2s, box-shadow .2s; }
html.cc-shell .cc-burger { border-radius: 12px !important; }
html.cc-shell .cc-tools > .cc-iconbtn:hover, html.cc-shell .cc-fsbtn:hover, html.cc-shell .cc-burger:hover { transform: translateY(-2px); color: #fff !important; box-shadow: 0 0 0 1px rgba(67,217,198,.6), 0 0 18px rgba(67,217,198,.35); }
.cc-moremenu { position: absolute; right: 0; top: 48px; z-index: 70; width: 230px; padding: 8px; border-radius: 14px; background: rgba(4,18,18,.97); border: 1px solid rgba(150,230,215,.32); box-shadow: 0 24px 50px rgba(0,0,0,.6); display: grid; gap: 2px; animation: cczin .3s cubic-bezier(.2,.8,.2,1) both; }
.cc-moremenu[hidden] { display: none; }
.cc-moremenu .cc-moreitem { all: unset; cursor: pointer; display: flex !important; gap: 10px; align-items: center; width: auto !important; height: auto !important; padding: 9px 10px !important; border-radius: 10px !important; background: transparent !important; color: #CFE3DF !important; font: 600 13px "Barlow Condensed", sans-serif !important; letter-spacing: 1.4px; text-transform: uppercase; }
.cc-moremenu .cc-moreitem:hover { background: rgba(67,217,198,.1) !important; color: #fff !important; }
.cc-moremenu .cc-detailsbtn .lbl { display: inline !important; }
html.cc-shell .cc-today-x { font: 500 14px "Barlow Semi Condensed", sans-serif !important; color: #8EADA8 !important; }
html.cc-shell .cc-burger, html.cc-shell .cc-fsbtn { border-color: rgba(150,230,215,.22) !important; background: rgba(10,30,30,.6) !important; color: #CFE3DF; }
html.cc-shell .cc-burger:hover, html.cc-shell .cc-fsbtn:hover { background: rgba(67,217,198,.12) !important; color: #fff; }
.cc-burger, .cc-fsbtn { all: unset; cursor: pointer; flex: none; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 10px; border: 1px solid rgba(150,230,215,.3); background: rgba(0,0,0,.2); color: inherit; }
.cc-burger:focus-visible, .cc-fsbtn:focus-visible, .cc-flow button:focus-visible { outline: 2px solid #FBE2AE; outline-offset: 2px; }
.cc-flow { flex: 1; display: flex; gap: 6px; justify-content: center; overflow-x: auto; scrollbar-width: none; min-width: 0; }
.cc-flow button { all: unset; cursor: pointer; white-space: nowrap; font: 600 14px "Barlow Condensed", "Arial Narrow", sans-serif !important; text-transform: uppercase; letter-spacing: 1.4px; padding: 8px 16px; border-radius: 999px; color: var(--rm-text-muted, #8EADA8); }
.cc-flow button:hover { color: var(--rm-text, #EAF6F3); }
.cc-flow button[aria-current="page"] { color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); box-shadow: 0 0 22px rgba(217,178,110,.45); }
html.cc-shell .cc-nav a, html.cc-shell .cc-nav .grp { text-transform: uppercase; letter-spacing: 1.2px; font-family: "Barlow Condensed", "Arial Narrow", sans-serif !important; }
.cc-modes { display: flex; gap: 4px; padding: 4px; margin: 8px 6px 4px; border-radius: 999px; border: 1px solid rgba(150,230,215,.25); }
.cc-modes button { all: unset; cursor: pointer; flex: 1; text-align: center; padding: 7px 0; border-radius: 999px; font: 600 13px "Barlow Condensed", sans-serif !important; letter-spacing: 1.4px; text-transform: uppercase; color: var(--rm-text-muted, #8EADA8); }
.cc-modes button[aria-pressed="true"] { background: linear-gradient(180deg, #FBE2AE, #D9B26E); color: #10170F; }
html.cc-shell #cc-view.cc-zin > * { animation: cczin .6s cubic-bezier(.2,.8,.2,1) both; }
@keyframes cczin { from { opacity: 0; transform: scale(.94); filter: blur(5px); } }
html.cc-shell .cc-gravity { min-height: calc(100vh - 120px); display: grid; align-content: start; gap: 18px; }
.gv-sub { box-sizing: border-box; display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; padding: 4px; border-radius: 999px; border: 1px solid rgba(150,230,215,.18); background: rgba(0,0,0,.25); width: max-content; max-width: 100%; margin: 0 auto; }
.gv-sub button { all: unset; cursor: pointer; font: 600 13px "Barlow Condensed", sans-serif !important; letter-spacing: 1.4px; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; color: #8EADA8; }
.gv-sub button[aria-current="page"] { color: #EAF6F3; background: rgba(67,217,198,.16); box-shadow: inset 0 0 0 1px rgba(67,217,198,.5); }
.gv-body { animation: cczin .55s cubic-bezier(.2,.8,.2,1) both; }
.gv-hero { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 30px; align-items: center; max-width: 1000px; margin: 30px auto; }
.gv-hero h2 { margin: 0 0 8px; font: 600 40px "Barlow Condensed", sans-serif; } .gv-hero p { font-size: 18px; line-height: 1.5; color: #CFE3DF; margin: 0 0 10px; } .gv-hero .gv-k { font: 600 13px "Barlow Condensed", sans-serif; letter-spacing: 1.6px; text-transform: uppercase; color: #D9B26E; }
.gv-pearl { width: 180px; height: 180px; border-radius: 50%; display: block; margin: auto; background: radial-gradient(circle at 35% 30%, #fff, color-mix(in srgb, var(--c) 30%, #fff) 22%, var(--c) 62%, #1a1206); box-shadow: 0 0 70px color-mix(in srgb, var(--c) 60%, transparent), 0 0 0 22px rgba(0,0,0,.4), 0 0 0 23px rgba(150,230,215,.18); animation: gvbr 4s ease-in-out infinite; }
@keyframes gvbr { 50% { transform: scale(1.04); } }
.gv-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; max-width: 1200px; margin: 10px auto; width: 100%; }
.gv-step, .gv-card { position: relative; padding: 16px 16px 16px 20px; border-radius: 12px; background: rgba(12,32,32,.9); border: 1px solid var(--c); box-shadow: 0 0 6px color-mix(in srgb, var(--c) 30%, transparent), 0 12px 28px rgba(0,0,0,.45); display: grid; gap: 4px; }
.gv-step::before, .gv-card::before { content: ""; position: absolute; left: -2px; top: 16px; width: 4px; height: 26px; border-radius: 2px; background: var(--c); box-shadow: 0 0 8px var(--c); }
.gv-step em { font-style: normal; font: 500 30px "Barlow Semi Condensed", sans-serif; color: var(--c); } .gv-step b, .gv-card b { font: 600 18px "Barlow Condensed", sans-serif; letter-spacing: .4px; } .gv-step span, .gv-card p { color: #A9C2BE; margin: 0; }
.gv-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; max-width: 1200px; margin: 10px auto; width: 100%; } .gv-card a { color: #FBE2AE; font-weight: 600; text-decoration: none; overflow-wrap: anywhere; } .gv-card a:hover { text-decoration: underline; }
.gv-api { display: grid; grid-template-columns: minmax(0, 380px) minmax(0, 1fr); gap: 16px; } .gv-api pre { margin: 0; padding: 18px; border-radius: 12px; background: rgba(0,0,0,.35); border: 1px solid rgba(150,230,215,.18); color: #DCEBE8; font: 13px/1.6 ui-monospace, Menlo, monospace; overflow: auto; }
.gv-api iframe { width: 100%; min-height: calc(100vh - 220px); border: 1px solid rgba(150,230,215,.18); border-radius: 12px; background: #04100F; }
@media (max-width: 800px) { .gv-hero, .gv-api { grid-template-columns: minmax(0, 1fr); } .gv-sub { width: auto; border-radius: 16px; } .gv-pearl { width: 120px; height: 120px; } .gv-hero h2 { font-size: 32px; } }
html.cc-shell .cc-gravity, html.cc-shell .cc-gravity * { min-width: 0; } .gv-steps, .gv-cards { grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); }
/* embedded view (the Universe's GAMMA-Ray tab shows this page's circuit): no chrome */
html.cc-embed .cc-top, html.cc-embed .cc-side, html.cc-embed .cc-scrim, html.cc-embed .cc-today { display: none !important; } html.cc-embed .cc-content { padding-top: 8px; }
html.cc-shell .cc-gravity iframe { width: 100%; min-height: calc(100vh - 130px); border: 1px solid rgba(150,230,215,.18); border-radius: 16px; background: #04100F; }
@media (max-width: 700px) { html.cc-shell .cc-top { flex-wrap: wrap; height: auto; padding: 8px 12px; row-gap: 6px; } .cc-flow { order: 9; flex: 1 0 100%; justify-content: flex-start; } html.cc-shell .cc-whobtn { display: none; } }
@media (prefers-reduced-motion: reduce) { html.cc-shell #cc-view.cc-zin > *, html.cc-shell .cc-side { animation: none; transition: none; } }`
    document.head.appendChild(css)
    html.classList.add('cc-shell')
    if (/[?&]embed\b/.test(location.search)) html.classList.add('cc-embed')
    const view = () => (location.hash.slice(1) || 'home').split(/[?&]/)[0]
    function inject() {
        const top = document.querySelector('.cc-top'); if (!top) return
        if (!top.querySelector('.cc-burger')) { const b = document.createElement('button'); b.type = 'button'; b.className = 'cc-burger'; b.setAttribute('aria-label', 'Menu'); b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'; b.onclick = () => html.classList.toggle('cc-drawer'); top.prepend(b) }
        let f = top.querySelector('.cc-flow'); if (!f) { f = document.createElement('nav'); f.className = 'cc-flow'; f.setAttribute('aria-label', 'Flow'); const g = top.querySelector('.grow'); g ? g.replaceWith(f) : top.appendChild(f) }
        const v = view(); f.innerHTML = FLOWS[MODE].map(([k, l]) => `<button type="button" data-flow="${k}" ${k === v ? 'aria-current="page"' : ''}>${l}</button>`).join('')
        if (!top.querySelector('.cc-fsbtn')) { const s = document.createElement('button'); s.type = 'button'; s.className = 'cc-fsbtn'; s.setAttribute('aria-label', 'Ecrã inteiro'); s.title = 'Ecrã inteiro'; s.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'; s.onclick = () => { const d = document.documentElement; if (document.fullscreenElement) document.exitFullscreen(); else if (d.requestFullscreen) d.requestFullscreen().catch(() => {}) }; top.appendChild(s) }
        const side = document.querySelector('.cc-side'); if (side && !side.querySelector('.cc-modes')) { const m = document.createElement('div'); m.className = 'cc-modes'; m.setAttribute('role', 'group'); m.setAttribute('aria-label', 'Modo'); side.prepend(m) }
        const m = side && side.querySelector('.cc-modes'); if (m) m.innerHTML = [['client', 'Cliente'], ['work', 'Trabalho']].map(([k, l]) => `<button type="button" data-mode="${k}" aria-pressed="${k === MODE}">${l}</button>`).join('')
        const tools = top.querySelector('.cc-tools')
        if (tools && !tools.querySelector('.cc-morebtn')) {
            const menu = document.createElement('div'); menu.className = 'cc-moremenu'; menu.hidden = true
            const add = (el, label) => { if (!el) return; el.classList.add('cc-moreitem'); const s = document.createElement('span'); s.className = 'cc-morelbl'; s.textContent = label; el.appendChild(s); menu.appendChild(el) }
            add(tools.querySelector('#cc-details'), ''); add(tools.querySelector('a.cc-iconbtn'), 'Quadro'); add(tools.querySelector('#cc-links'), 'Links')
            const mb = document.createElement('button'); mb.type = 'button'; mb.className = 'cc-iconbtn cc-morebtn'; mb.setAttribute('aria-label', 'Mais'); mb.title = 'Mais'; mb.setAttribute('aria-haspopup', 'menu'); mb.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h.01M12 12h.01M19 12h.01"/></svg>'
            mb.onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; mb.setAttribute('aria-expanded', String(!menu.hidden)) }
            tools.appendChild(mb); tools.appendChild(menu)
            const theme = tools.querySelector('#cc-theme'); if (theme) tools.prepend(theme)
            const when = document.createElement('div'); when.className = 'cc-when'; when.innerHTML = '<b></b><small></small>'; tools.before(when)
            const tick = () => { const d = new Date(); when.querySelector('b').textContent = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }); when.querySelector('small').textContent = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()] + ' ' + d.getDate() + ' ' + ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()] }
            tick(); setInterval(tick, 20000)
            document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) { menu.hidden = true; mb.setAttribute('aria-expanded', 'false') } })
        }
        if (!document.querySelector('.cc-scrim')) { const sc = document.createElement('div'); sc.className = 'cc-scrim'; sc.onclick = () => html.classList.remove('cc-drawer'); document.body.appendChild(sc) }
    }
    document.addEventListener('click', e => { const f = e.target.closest && e.target.closest('[data-flow]'); if (f) { location.hash = '#' + f.dataset.flow; return }
        const m = e.target.closest && e.target.closest('[data-mode]'); if (m) { MODE = m.dataset.mode; put('cc.mode', MODE); inject(); if (!FLOWS[MODE].some(f => f[0] === view())) location.hash = '#' + FLOWS[MODE][0][0]; return }
        if (e.target.closest && e.target.closest('.cc-side a')) html.classList.remove('cc-drawer') })
    addEventListener('keydown', e => { if (e.key === 'Escape') html.classList.remove('cc-drawer') })
    addEventListener('hashchange', () => { html.classList.remove('cc-drawer'); const cv = document.getElementById('cc-view'); if (cv) { cv.classList.remove('cc-zin'); void cv.offsetWidth; cv.classList.add('cc-zin') } setTimeout(inject, 30) })
    new MutationObserver(() => { const top = document.querySelector('.cc-top'); if (top && (!top.querySelector('.cc-flow') || !top.querySelector('.cc-burger'))) inject() }).observe(document.body, { childList: true, subtree: true })
    inject()
    // GRAVITY: its own world with its own sub-menu (Silvio, 11 November): Sobre · Camadas · Exemplos · Dados e API · Versões
    const GSUB = [['sobre', 'Sobre'], ['camadas', 'Camadas'], ['exemplos', 'Exemplos'], ['api', 'Dados e API'], ['versoes', 'Versões']]
    let gsub = 'sobre'
    const pearl = c => `<span class="gv-pearl" style="--c:${c}"></span>`
    const GP = {
        sobre: () => `<div class="gv-hero">${pearl('#D9B26E')}<div><h2>Gravity</h2><p>A biblioteca por trás do Universo ✦. Desenha qualquer sistema como um universo: um núcleo, os seus <b>centros de gravidade</b>, o que <b>orbita</b> cada um, e o <b>tráfego</b> entre eles. Entra-se num centro com um zoom e vê-se por uma lente; abre-se o detalhe de um elemento. A mesma visualização serve a nossa equipa de agentes, um festival, ou workloads espalhados por várias clouds.</p><p class="gv-k">Uma biblioteca · um ficheiro · versões fixas · PT e EN · ecrã inteiro · plugins</p></div></div>`,
        camadas: () => `<div class="gv-steps">${[['Núcleo', 'o centro de tudo', '#D9B26E'], ['Centros de gravidade', 'as pessoas, os locais, as clouds', '#A58BFF'], ['Nós', 'o que orbita cada centro', '#43D9C6'], ['Fluxos', 'o tráfego entre nós, com luz a viajar', '#FF7FB0'], ['Lente', 'o leque de cartões sobre um centro', '#F2B544'], ['Detalhe', 'o painel de um elemento', '#3DDC97'], ['Plugins', 'vistas extra: escudos, X-Ray, GAMMA-Ray', '#4FD1F5']].map(([h, s, c], i) => `<div class="gv-step" style="--c:${c}"><em>${i + 1}</em><b>${h}</b><span>${s}</span></div>`).join('')}</div>`,
        exemplos: () => `<div class="gv-cards">${[['RiskMandate · ao vivo', 'Pessoas como centros, os seus agentes como nós, as mensagens entre agentes como fluxos, a política de cada agente como detalhe. Três escudos, X-Ray e GAMMA-Ray como plugins.', '#stand', 'Abrir o Universo ✦', '#A58BFF'], ['Lisbon Tech Fringe · em construção', 'Locais e temas como centros, sessões e eventos como nós, as pessoas a circular como fluxos; o tempo e a agenda como plugins. Feito pelo agente gravity@lisbon-tech-fringe.silvio.', '', '', '#43D9C6'], ['Multi-cloud · próximo', 'Clouds e ambientes como centros, workloads como nós, pedidos e jobs entre ambientes como fluxos. O trabalho do Dinis e do Angelo.', '', '', '#F2B544']].map(([h, p, href, cta, c]) => `<div class="gv-card" style="--c:${c}"><b>${h}</b><p>${p}</p>${href ? `<a href="${href}">${cta} ›</a>` : ''}</div>`).join('')}</div>`,
        api: () => `<div class="gv-api"><pre><code>Gravity.mount(elemento, {
  lang: 'pt',
  data: {
    core:    { label },
    centres: [{ id, label, color }],
    nodes:   [{ id, centre, label, ok }],
    flows:   [{ from, to, count, at }],
    feed:    [{ at, from, to: [], text }]
  },
  strings, detail(id, api), metric, views: [plugins]
})</code></pre><iframe src="${SITE}lib/gravity/index.html" title="Gravity: a documentação" loading="lazy"></iframe></div>`,
        versoes: () => `<div class="gv-cards">${[['latest', 'sempre a mais recente', SITE + 'lib/gravity/latest/gravity.js', '#3DDC97'], ['v0.1.0', 'fixa, nunca muda', SITE + 'lib/gravity/v0/v0.1/v0.1.0/gravity.js', '#D9B26E']].map(([h, s, u, c]) => `<div class="gv-card" style="--c:${c}"><b>${h}</b><p>${s}</p><a href="${u}" target="_blank" rel="noopener">${u.replace(SITE, '/')}</a></div>`).join('')}</div>`
    }
    const gpaint = () => { const h = document.getElementById('cc-gravity'); if (!h) return; h.innerHTML = `<nav class="gv-sub" aria-label="Gravity">${GSUB.map(([k, l]) => `<button type="button" data-gsub="${k}" ${k === gsub ? 'aria-current="page"' : ''}>${l}</button>`).join('')}</nav><div class="gv-body">${GP[gsub]()}</div>` }
    document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-gsub]'); if (b) { gsub = b.dataset.gsub; gpaint(); const v = document.getElementById('cc-view'); if (v) { v.classList.remove('cc-zin'); void v.offsetWidth; v.classList.add('cc-zin') } } })
    X.views.gravity = { label: 'Gravity', icon: 'brain', render: () => '<section class="cc-gravity" id="cc-gravity"></section>', after: gpaint }
})()
