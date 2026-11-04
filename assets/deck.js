// A slide deck on a page (Dinis, 4 November 2026, after the estate's HTML decks on sgit.ai): every slide is a
// <section class="slide"> inside <div class="deck">. It opens as a normal deck, one slide at a time, with controls
// under it: back, forward, the slide number, fullscreen, all slides, and the PDF (data-pdf on the deck). Keys: ← →,
// space, Home, End, F (fullscreen), A (all slides), Esc. Swipe left or right on a phone. #s<N> links a slide.
// No dependencies. By conductor@web-summit.dinis.
(() => {
    'use strict'
    const deck = document.querySelector('.deck'); if (!deck) return
    const slides = [...deck.querySelectorAll('.slide')]; if (!slides.length) return
    slides.forEach((s, i) => { s.id = 's' + (i + 1); const n = document.createElement('span'); n.className = 'slide-n'; n.textContent = `${i + 1} / ${slides.length}`; s.appendChild(n) })
    const pdf = deck.dataset.pdf
    const bar = document.createElement('div'); bar.className = 'deck-bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Slide controls')
    bar.innerHTML = `<button type="button" data-prev aria-label="Previous slide">◀</button><span class="deck-pos" aria-live="polite"></span><button type="button" data-next aria-label="Next slide">▶</button>`
        + `<span class="deck-gap"></span><button type="button" data-full>⛶ Fullscreen</button><button type="button" data-all>All slides</button>${pdf ? `<a class="deck-pdf" href="${pdf}" download>⬇ PDF</a>` : ''}`
    deck.appendChild(bar)
    const pos = bar.querySelector('.deck-pos')
    let cur = 0, mode = 'one'
    const show = i => {
        cur = Math.max(0, Math.min(slides.length - 1, i))
        slides.forEach((s, k) => s.classList.toggle('current', k === cur))
        pos.textContent = `${cur + 1} / ${slides.length}`
        bar.querySelector('[data-prev]').disabled = cur === 0; bar.querySelector('[data-next]').disabled = cur === slides.length - 1
        if (mode === 'one') history.replaceState(null, '', '#s' + (cur + 1))
    }
    const setMode = m => {
        mode = m; deck.classList.toggle('one', m === 'one'); deck.classList.toggle('all', m === 'all')
        bar.querySelector('[data-all]').textContent = m === 'all' ? 'One at a time' : 'All slides'
        if (m === 'all') { exitFull(); slides[cur].scrollIntoView({ block: 'start' }) } else show(cur)
    }
    const full = () => document.fullscreenElement || deck.classList.contains('full')
    const enterFull = () => { if (deck.requestFullscreen) deck.requestFullscreen().catch(() => deck.classList.add('full')); else deck.classList.add('full'); document.documentElement.classList.add('deck-on') }
    const exitFull = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); deck.classList.remove('full'); document.documentElement.classList.remove('deck-on') }
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && !deck.classList.contains('full')) document.documentElement.classList.remove('deck-on') })
    bar.querySelector('[data-prev]').onclick = () => show(cur - 1)
    bar.querySelector('[data-next]').onclick = () => show(cur + 1)
    bar.querySelector('[data-full]').onclick = () => { if (mode !== 'one') setMode('one'); full() ? exitFull() : enterFull() }
    bar.querySelector('[data-all]').onclick = () => setMode(mode === 'all' ? 'one' : 'all')
    slides.forEach((s, i) => s.addEventListener('click', e => { if (mode !== 'all' || e.target.closest('a,button')) return; cur = i; setMode('one') }))
    let x0 = null
    deck.addEventListener('touchstart', e => { x0 = e.touches[0].clientX }, { passive: true })
    deck.addEventListener('touchend', e => { if (x0 === null || mode !== 'one') return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); x0 = null })
    document.addEventListener('keydown', e => {
        if (e.target.closest('input,textarea,select')) return
        if (e.key === 'a' || e.key === 'A') return setMode(mode === 'all' ? 'one' : 'all')
        if (mode !== 'one') return
        if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); show(cur + 1) }
        else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); show(cur - 1) }
        else if (e.key === 'Home') show(0)
        else if (e.key === 'End') show(slides.length - 1)
        else if (e.key === 'f' || e.key === 'F') full() ? exitFull() : enterFull()
        else if (e.key === 'Escape') exitFull()
    })
    const m = location.hash.match(/^#s(\d+)$/); cur = m ? Number(m[1]) - 1 : 0
    setMode(new URLSearchParams(location.search).get('view') === 'all' ? 'all' : 'one')
})()
