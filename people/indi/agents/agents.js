// "What do the different agents do?": expand a picture's panel to fill the screen, and back (the button or Escape).
document.addEventListener('click', e => {
    const b = e.target.closest('.ae-expand'); if (!b) return
    const p = b.closest('.ae-panel'), on = !p.classList.contains('ae-full')
    document.querySelectorAll('.ae-panel.ae-full').forEach(x => { x.classList.remove('ae-full'); x.querySelector('.ae-expand').textContent = '⤢ Expand' })
    p.classList.toggle('ae-full', on); document.body.classList.toggle('ae-lock', on)
    b.textContent = on ? '✕ Close' : '⤢ Expand'; if (on) p.scrollTop = 0; b.focus()
})
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('.ae-panel.ae-full .ae-expand')?.click() })
