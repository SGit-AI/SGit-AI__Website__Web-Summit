/* The clean command centre (Silvio, 11 November 2026): the Universe's look on every page, one font (Barlow condensed),
   the side menu hidden behind a ☰ button, a row of flow buttons on top, a full-screen button, views that open with a zoom.
   Two modes, switched inside the ☰ menu: Client (only UNIVERSO ✦ and GRAVITY on top, for the stand) and Work (also
   VISÃO GERAL and TAREFAS). Adds the GRAVITY view (the library's page). By dashboard@web-summit.silvio. */
(function () {
    const X = window.CC_EXTRA = window.CC_EXTRA || {}; X.views = X.views || {}
    const SITE = 'https://web-summit.sgit.ai/', FONTS = 'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@300;400;500;600&family=Barlow+Condensed:wght@500;600&display=swap'
    const get = k => { try { return localStorage.getItem(k) } catch { return null } }, put = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
    let MODE = get('cc.mode') || 'work'
    // the stand's demo flows on top (Dinis, 12 November, the summit's last day): GRAVITY and TAREFAS left the top bar (both
    // stay in the ☰ menu); VÍDEOS, PT.NEWS, LISBON TECH FRINGE, STORM and GAMMA-RAY joined (assets/cc/demo.js)
    // GAMMA-RAY next to the Universe, the command centre's own circuit graph (Silvio, 12 November)
    const DEMO = [['stand', 'Universo ✦'], ['gamma', 'GAMMA-Ray'], ['xray', 'X-Ray'], ['swarm', 'Swarm'], ['reel', 'Vídeos'], ['ptnews', 'PT.news'], ['fringe', 'Lisbon Tech Fringe'], ['storm', 'Storm'], ['buy', 'Buy now'], ['invest', 'Invest']]
    const FLOWS = { client: DEMO, work: DEMO }
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
html.cc-shell.cc-v-stand .cc-content { padding: 0 !important; max-width: none !important; }
html.cc-shell .cc-askfab { bottom: 96px !important; } /* above the Feedback tab (Silvio, 12 November) */
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
    // the page opens on the Universe (Silvio, 11 November): no hash means UNIVERSO ✦; VISÃO GERAL leaves the top bar (still in ☰)
    if (!location.hash || location.hash === '#' || location.hash === '#home') history.replaceState(null, '', location.pathname + location.search + '#stand')
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
            const theme = tools.querySelector('#cc-theme'); if (theme) theme.remove() // dark only (Silvio, 12 November)
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
    const markView = () => html.classList.toggle('cc-v-stand', view() === 'stand' || view() === 'xray' || view() === 'swarm'); markView()
    addEventListener('hashchange', () => { markView(); html.classList.remove('cc-drawer'); const cv = document.getElementById('cc-view'); if (cv) { cv.classList.remove('cc-zin'); void cv.offsetWidth; cv.classList.add('cc-zin') } setTimeout(inject, 30) })
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
    // SWARM: PrompTugal's swarm, shown inside the command centre (Silvio, 11 November), with a way out to its own window
    const SWARM = 'https://swarm.promptugal.news/'
    if (!document.getElementById('cc-swarm-css')) { const st = document.createElement('style'); st.id = 'cc-swarm-css'; st.textContent = `.cc-swarm { display: grid; grid-template-rows: auto 1fr; min-height: calc(100vh - 64px); } .cc-swarm .bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 16px; font: 600 11.5px "Barlow Condensed", "Arial Narrow", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #8EADA8; border-bottom: 1px solid rgba(150,230,215,.14); } .cc-swarm .bar a { color: #FBE2AE; text-decoration: none; } .cc-swarm iframe { width: 100%; height: calc(100vh - 100px); border: 0; background: #04100F; display: block; }`; document.head.appendChild(st) }
    X.views.swarm = { label: 'Swarm', icon: 'brain', render: () => `<section class="cc-swarm"><div class="bar"><span>Swarm · swarm.promptugal.news</span><a href="${SWARM}" target="_blank" rel="noopener">Abrir numa janela ↗</a></div><iframe src="${SWARM}" title="Swarm (PrompTugal)" loading="lazy" referrerpolicy="no-referrer"></iframe></section>` }
    // VISÃO GERAL's look (the mock Silvio approved, 11 November)
    if (!document.getElementById('cc-home-css')) { const st = document.createElement('style'); st.id = 'cc-home-css'; st.textContent = `
html.cc-shell .hx-hi { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin: 4px 0 14px; font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; }
html.cc-shell .hx-hi h1 { margin: 0; font: 500 24px "Barlow Condensed", "Arial Narrow", sans-serif; letter-spacing: .3px; color: #EAF6F3; } html.cc-shell .hx-hi h1 em { font-style: normal; color: #FBE2AE; } html.cc-shell .hx-hi .sub { color: #8EADA8; font-size: 13px; }
html.cc-shell .hx-pearls { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
html.cc-shell .hx-pearl { all: unset; cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--c) 45%, transparent); background: rgba(6,22,22,.6); transition: transform .15s, box-shadow .15s; }
html.cc-shell .hx-pearl:hover, html.cc-shell .hx-pearl:focus-visible { transform: translateY(-2px); box-shadow: 0 0 14px color-mix(in srgb, var(--c) 35%, transparent); outline: none; }
html.cc-shell .hx-pearl i { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font: 600 13px "Barlow Semi Condensed", sans-serif; font-style: normal; color: #04100F; background: radial-gradient(circle at 35% 30%, #fff, var(--c) 45%, color-mix(in srgb, var(--c) 40%, #000) 100%); box-shadow: 0 0 10px color-mix(in srgb, var(--c) 60%, transparent); }
html.cc-shell .hx-pearl span { font: 600 11.5px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #CFE3DF; }
html.cc-shell .hx-gold { all: unset; cursor: pointer; padding: 7px 16px; border-radius: 999px; font: 600 12.5px "Barlow Condensed", sans-serif; letter-spacing: 1.3px; text-transform: uppercase; color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); box-shadow: 0 0 16px rgba(217,178,110,.35); } html.cc-shell .hx-gold:focus-visible { outline: 2px solid #FBE2AE; outline-offset: 2px; }
html.cc-shell .hx-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.25fr) minmax(0, 1fr); gap: 14px; align-items: start; font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; color: #EAF6F3; line-height: 1.35; }
html.cc-shell .hx-col { display: grid; gap: 14px; min-width: 0; }
html.cc-shell .hx-box { position: relative; border-radius: 12px; background: rgba(10,28,28,.72); border: 1px solid color-mix(in srgb, var(--c) 55%, transparent); box-shadow: 0 0 8px color-mix(in srgb, var(--c) 18%, transparent), 0 14px 30px rgba(0,0,0,.35); overflow: hidden; }
html.cc-shell .hx-box > h2 { margin: 0; display: flex; align-items: center; gap: 8px; padding: 10px 14px 8px 18px; font: 600 12.5px "Barlow Condensed", sans-serif; letter-spacing: 1.5px; text-transform: uppercase; color: var(--c); border-bottom: 1px solid color-mix(in srgb, var(--c) 22%, transparent); }
html.cc-shell .hx-box > h2::before { content: ""; position: absolute; left: -1px; top: 11px; width: 3px; height: 16px; border-radius: 2px; background: var(--c); box-shadow: 0 0 8px var(--c); }
html.cc-shell .hx-box > h2 .n { color: #EAF6F3; font: 500 13px "Barlow Semi Condensed", sans-serif; letter-spacing: 0; } html.cc-shell .hx-box .more { all: unset; cursor: pointer; margin-left: auto; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; color: #8EADA8; } html.cc-shell .hx-box .more:hover { color: #EAF6F3; }
html.cc-shell .hx-body { padding: 8px 14px 12px; } html.cc-shell .hx-none, html.cc-shell .hx-src { color: #8EADA8; font-size: 13px; margin: 8px 0 0; } html.cc-shell .hx-src { font-size: 12px; color: #5F7D79; }
html.cc-shell .hx-days { display: flex; gap: 4px; padding: 3px; border-radius: 999px; border: 1px solid rgba(150,230,215,.16); background: rgba(0,0,0,.3); width: max-content; max-width: 100%; margin: 2px 0 8px; overflow-x: auto; }
html.cc-shell .hx-days button { all: unset; cursor: pointer; font: 600 11.5px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; padding: 4px 11px; border-radius: 999px; color: #8EADA8; white-space: nowrap; } html.cc-shell .hx-days button[aria-pressed="true"] { color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); }
html.cc-shell .hx-tl { position: relative; display: grid; gap: 2px; } html.cc-shell .hx-tl::before { content: ""; position: absolute; left: 47px; top: 8px; bottom: 8px; width: 1px; background: linear-gradient(#FBE2AE, rgba(217,178,110,.15)); }
html.cc-shell .hx-ev { display: grid; grid-template-columns: 38px 18px 1fr; gap: 0 6px; align-items: start; padding: 5px 0; } html.cc-shell .hx-ev time, html.cc-shell .hx-s time { font: 500 13px "Barlow Semi Condensed", sans-serif; color: #8EADA8; }
html.cc-shell .hx-ev i { width: 9px; height: 9px; margin: 5px 0 0 5px; border-radius: 50%; background: var(--c); box-shadow: 0 0 8px var(--c); z-index: 1; } html.cc-shell .hx-ev b, html.cc-shell .hx-s b, html.cc-shell .hx-row b { font: 500 14px "Barlow Semi Condensed", sans-serif; } html.cc-shell .hx-ev small, html.cc-shell .hx-s small, html.cc-shell .hx-row small { display: block; color: #5F7D79; font-size: 12px; } html.cc-shell .hx-ev.now b { color: #FBE2AE; }
html.cc-shell .hx-s { display: grid; grid-template-columns: 38px 1fr 28px; gap: 8px; align-items: start; padding: 7px 0; border-bottom: 1px solid rgba(150,230,215,.07); } html.cc-shell .hx-s small { color: #8EADA8; }
html.cc-shell .hx-star { all: unset; cursor: pointer; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; border: 1px solid rgba(150,230,215,.3); color: #8EADA8; font-size: 13px; } html.cc-shell .hx-star[aria-pressed="true"] { color: #10170F; background: radial-gradient(circle at 35% 30%, #fff, #FBE2AE 45%, #D9B26E); border-color: transparent; box-shadow: 0 0 10px rgba(251,226,174,.5); }
html.cc-shell .hx-filt { display: flex; gap: 8px; align-items: center; color: #8EADA8; font-size: 12.5px; margin-bottom: 4px; flex-wrap: wrap; } html.cc-shell .hx-chip { all: unset; cursor: pointer; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; border: 1px solid rgba(150,230,215,.3); color: #8EADA8; } html.cc-shell .hx-chip[aria-pressed="true"] { color: #FBE2AE; border-color: rgba(251,226,174,.5); } html.cc-shell .hx-chip:disabled { opacity: .5; cursor: default; }
html.cc-shell .hx-row { all: unset; cursor: pointer; display: grid; grid-template-columns: 1fr auto; gap: 1px 10px; width: 100%; box-sizing: border-box; padding: 7px 8px; margin: 0 -8px; border-radius: 8px; } html.cc-shell div.hx-row { cursor: default; } html.cc-shell button.hx-row:hover { background: rgba(67,217,198,.07); }
html.cc-shell .hx-row small { grid-column: 1; } html.cc-shell .hx-row em { grid-row: 1 / span 2; grid-column: 2; align-self: center; font-style: normal; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--t) 50%, transparent); color: var(--t); white-space: nowrap; }
html.cc-shell .hx-ws { display: grid; gap: 9px; } html.cc-shell .hx-ws div { display: grid; grid-template-columns: 1fr auto; gap: 3px 8px; font-size: 13.5px; } html.cc-shell .hx-ws small { color: #5F7D79; font-size: 12px; } html.cc-shell .hx-ws b { font: 500 13px "Barlow Semi Condensed", sans-serif; color: #FBE2AE; } html.cc-shell .hx-ws u { grid-column: 1 / -1; height: 4px; border-radius: 2px; background: rgba(255,255,255,.07); overflow: hidden; text-decoration: none; } html.cc-shell .hx-ws u i { display: block; height: 100%; background: linear-gradient(90deg, #D9B26E, #FBE2AE); box-shadow: 0 0 6px #D9B26E; }
html.cc-shell .hx-act { display: grid; gap: 7px; } html.cc-shell .hx-act p { margin: 0; display: grid; grid-template-columns: 44px 1fr; gap: 6px; font-size: 13px; } html.cc-shell .hx-act time { color: #5F7D79; font: 500 12px "Barlow Semi Condensed", sans-serif; } html.cc-shell .hx-act b { color: #43D9C6; font-weight: 600; }
@media (max-width: 1100px) { html.cc-shell .hx-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } html.cc-shell .hx-c3 { grid-column: 1 / -1; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); } }
@media (max-width: 720px) { html.cc-shell .hx-grid { grid-template-columns: minmax(0, 1fr); } html.cc-shell .hx-pearls { margin-left: 0; } }`; document.head.appendChild(st) }
    X.views.gravity = { label: 'Gravity', icon: 'brain', render: () => '<section class="cc-gravity" id="cc-gravity"></section>', after: gpaint }
})()
