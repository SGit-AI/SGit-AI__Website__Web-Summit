// /people/silvio/riskmandate-explicado/: the PT/EN switch and the step-by-step simulation (no network, no storage
// beyond the chosen language). By conductor@web-summit.silvio, 8 November 2026.
(() => {
    const root = document.getElementById('xe'); if (!root) return
    // the language switch: every element with data-pt and data-en
    const setLang = l => {
        root.querySelectorAll('[data-pt][data-en]').forEach(e => { e.textContent = e.getAttribute('data-' + l) })
        root.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === l))
        try { localStorage.setItem('xe.lang', l) } catch { }
        tally()
    }
    root.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => setLang(b.dataset.lang))

    // the simulation: each step lights its line and drops a dot inside the mandate (in) or in the gap (out)
    const steps = [...root.querySelectorAll('#xe-steps li')], dots = root.querySelector('#xe-dots'), NS = 'http://www.w3.org/2000/svg'
    let i = 0, timer = null
    const place = (k, n) => { // a fixed position per step, spread around the circle
        const a = -Math.PI / 2 + n * (2 * Math.PI / steps.length) + .3, r = k === 'in' ? 62 : 165
        return [260 + r * Math.cos(a), 270 + r * Math.sin(a)]
    }
    const lang = () => (root.querySelector('[data-lang].on') || {}).dataset?.lang || 'pt'
    function tally() {
        const t = root.querySelector('#xe-tally'); if (!t) return
        const lit = steps.slice(0, i), inn = lit.filter(s => s.dataset.k === 'in').length, out = lit.length - inn
        t.textContent = lang() === 'en' ? `${inn} inside the mandate · ${out} in the gap` : `${inn} dentro do mandato · ${out} na diferença`
    }
    function step() {
        if (i >= steps.length) return false
        const s = steps[i], k = s.dataset.k, [x, y] = place(k, i), col = k === 'in' ? '#2dd4bf' : '#fb7185'
        s.classList.add('lit')
        const g = document.createElementNS(NS, 'g')
        g.innerHTML = `<circle cx="${x}" cy="${y}" r="22" fill="${col}" opacity=".18"><animate attributeName="r" from="6" to="22" dur=".5s" fill="freeze"/></circle><circle cx="${x}" cy="${y}" r="9" fill="${col}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#04201c">${i + 1}</text>`
        dots.appendChild(g); i++; tally(); return true
    }
    function reset() { clearInterval(timer); timer = null; i = 0; dots.innerHTML = ''; steps.forEach(s => s.classList.remove('lit')); tally() }
    root.querySelector('#xe-step').onclick = () => { clearInterval(timer); timer = null; step() }
    root.querySelector('#xe-reset').onclick = reset
    root.querySelector('#xe-play').onclick = () => { if (i >= steps.length) reset(); clearInterval(timer); step(); timer = setInterval(() => { if (!step()) { clearInterval(timer); timer = null } }, 1100) }

    let saved = 'pt'; try { saved = localStorage.getItem('xe.lang') || 'pt' } catch { }
    setLang(saved)
})()
