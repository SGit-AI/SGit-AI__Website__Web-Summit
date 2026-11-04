// A deck on a page (Dinis, 4 November 2026, after the estate's HTML decks on sgit.ai): every slide is a <section
// class="slide"> inside <div class="deck">. The page shows them all, one after another; Present shows one at a time,
// with the arrow keys (or a click on the right or left half), F for fullscreen, Esc back to all, and #s<N> in the
// address so a slide can be linked. No dependencies. By conductor@web-summit.dinis.
(() => {
    'use strict'
    const deck = document.querySelector('.deck'); if (!deck) return
    const slides = [...deck.querySelectorAll('.slide')]; if (!slides.length) return
    slides.forEach((s, i) => { s.id = 's' + (i + 1); const n = document.createElement('span'); n.className = 'slide-n'; n.textContent = `${i + 1} / ${slides.length}`; s.appendChild(n) })
    const bar = document.createElement('div'); bar.className = 'deck-bar'
    bar.innerHTML = '<button type="button" data-present>▶ Present</button><span class="deck-help">← → to move · F fullscreen · Esc all slides</span>'
    deck.prepend(bar)
    let cur = 0, on = false
    const show = i => { cur = Math.max(0, Math.min(slides.length - 1, i)); slides.forEach((s, k) => s.classList.toggle('current', k === cur)); history.replaceState(null, '', '#s' + (cur + 1)) }
    const present = (i = cur) => { on = true; deck.classList.add('presenting'); document.documentElement.classList.add('deck-on'); show(i) }
    const stop = () => { on = false; deck.classList.remove('presenting'); document.documentElement.classList.remove('deck-on'); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); slides[cur].scrollIntoView({ block: 'start' }) }
    bar.querySelector('[data-present]').onclick = () => present(0)
    slides.forEach((s, i) => s.addEventListener('dblclick', () => on ? stop() : present(i)))
    deck.addEventListener('click', e => { if (!on || e.target.closest('a,button')) return; show(cur + (e.clientX > innerWidth / 2 ? 1 : -1)) })
    document.addEventListener('keydown', e => {
        if (e.target.closest('input,textarea,select')) return
        if (!on && (e.key === 'p' || e.key === 'P')) return present()
        if (!on) return
        if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); show(cur + 1) }
        else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); show(cur - 1) }
        else if (e.key === 'Home') show(0)
        else if (e.key === 'End') show(slides.length - 1)
        else if (e.key === 'f' || e.key === 'F') { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else deck.requestFullscreen && deck.requestFullscreen().catch(() => {}) }
        else if (e.key === 'Escape') stop()
    })
    const m = location.hash.match(/^#s(\d+)$/); if (m) present(Number(m[1]) - 1)
})()
