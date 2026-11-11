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
html.cc-shell .cc-layout { grid-template-columns: minmax(0, 1fr); }
html.cc-shell .cc-side { position: fixed; inset: 0 auto 0 0; width: 290px; z-index: 60; transform: translateX(-105%); transition: transform .45s cubic-bezier(.2,.8,.2,1); background: rgba(4,18,18,.96); backdrop-filter: blur(18px); border-right: 1px solid rgba(150,230,215,.3); }
html.cc-shell.cc-drawer .cc-side { transform: none; box-shadow: 40px 0 80px rgba(0,0,0,.6); }
html.cc-shell .cc-scrim { position: fixed; inset: 0; z-index: 55; background: rgba(0,0,0,.45); opacity: 0; pointer-events: none; transition: opacity .3s; }
html.cc-shell.cc-drawer .cc-scrim { opacity: 1; pointer-events: auto; }
html.cc-shell .cc-top { gap: 10px; }
html.cc-shell .cc-top .title, html.cc-shell .cc-top .cc-mark, html.cc-shell .cc-top .cc-search { display: none; }
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
html.cc-shell .cc-gravity { min-height: calc(100vh - 120px); display: grid; }
html.cc-shell .cc-gravity iframe { width: 100%; min-height: calc(100vh - 130px); border: 1px solid rgba(150,230,215,.18); border-radius: 16px; background: #04100F; }
@media (max-width: 700px) { html.cc-shell .cc-top { flex-wrap: wrap; height: auto; padding: 8px 12px; row-gap: 6px; } .cc-flow { order: 9; flex: 1 0 100%; justify-content: flex-start; } html.cc-shell .cc-whobtn { display: none; } }
@media (prefers-reduced-motion: reduce) { html.cc-shell #cc-view.cc-zin > *, html.cc-shell .cc-side { animation: none; transition: none; } }`
    document.head.appendChild(css)
    html.classList.add('cc-shell')
    const view = () => (location.hash.slice(1) || 'home').split(/[?&]/)[0]
    function inject() {
        const top = document.querySelector('.cc-top'); if (!top) return
        if (!top.querySelector('.cc-burger')) { const b = document.createElement('button'); b.type = 'button'; b.className = 'cc-burger'; b.setAttribute('aria-label', 'Menu'); b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'; b.onclick = () => html.classList.toggle('cc-drawer'); top.prepend(b) }
        let f = top.querySelector('.cc-flow'); if (!f) { f = document.createElement('nav'); f.className = 'cc-flow'; f.setAttribute('aria-label', 'Flow'); const g = top.querySelector('.grow'); g ? g.replaceWith(f) : top.appendChild(f) }
        const v = view(); f.innerHTML = FLOWS[MODE].map(([k, l]) => `<button type="button" data-flow="${k}" ${k === v ? 'aria-current="page"' : ''}>${l}</button>`).join('')
        if (!top.querySelector('.cc-fsbtn')) { const s = document.createElement('button'); s.type = 'button'; s.className = 'cc-fsbtn'; s.setAttribute('aria-label', 'Ecrã inteiro'); s.title = 'Ecrã inteiro'; s.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'; s.onclick = () => { const d = document.documentElement; if (document.fullscreenElement) document.exitFullscreen(); else if (d.requestFullscreen) d.requestFullscreen().catch(() => {}) }; top.appendChild(s) }
        const side = document.querySelector('.cc-side'); if (side && !side.querySelector('.cc-modes')) { const m = document.createElement('div'); m.className = 'cc-modes'; m.setAttribute('role', 'group'); m.setAttribute('aria-label', 'Modo'); side.prepend(m) }
        const m = side && side.querySelector('.cc-modes'); if (m) m.innerHTML = [['client', 'Cliente'], ['work', 'Trabalho']].map(([k, l]) => `<button type="button" data-mode="${k}" aria-pressed="${k === MODE}">${l}</button>`).join('')
        if (!document.querySelector('.cc-scrim')) { const sc = document.createElement('div'); sc.className = 'cc-scrim'; sc.onclick = () => html.classList.remove('cc-drawer'); document.body.appendChild(sc) }
    }
    document.addEventListener('click', e => { const f = e.target.closest && e.target.closest('[data-flow]'); if (f) { location.hash = '#' + f.dataset.flow; return }
        const m = e.target.closest && e.target.closest('[data-mode]'); if (m) { MODE = m.dataset.mode; put('cc.mode', MODE); inject(); return }
        if (e.target.closest && e.target.closest('.cc-side a')) html.classList.remove('cc-drawer') })
    addEventListener('keydown', e => { if (e.key === 'Escape') html.classList.remove('cc-drawer') })
    addEventListener('hashchange', () => { html.classList.remove('cc-drawer'); const cv = document.getElementById('cc-view'); if (cv) { cv.classList.remove('cc-zin'); void cv.offsetWidth; cv.classList.add('cc-zin') } setTimeout(inject, 30) })
    new MutationObserver(() => { const top = document.querySelector('.cc-top'); if (top && (!top.querySelector('.cc-flow') || !top.querySelector('.cc-burger'))) inject() }).observe(document.body, { childList: true, subtree: true })
    inject()
    X.views.gravity = { label: 'Gravity', icon: 'brain', render: () => `<section class="cc-gravity"><iframe src="${SITE}lib/gravity/index.html" title="Gravity: the universe visualization library" loading="lazy"></iframe></section>` }
})()
