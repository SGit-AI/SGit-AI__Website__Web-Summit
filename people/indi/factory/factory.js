// The factory (WS-27): expand a panel to fill the screen, and back (the button or Escape).
document.addEventListener('click', e => {
    const b = e.target.closest('.ig-expand'); if (!b) return
    const p = b.closest('.ig-panel'), on = !p.classList.contains('ig-full')
    document.querySelectorAll('.ig-panel.ig-full').forEach(x => { x.classList.remove('ig-full'); x.querySelector('.ig-expand').textContent = '⤢ Expand' })
    p.classList.toggle('ig-full', on); document.body.classList.toggle('ig-lock', on)
    b.textContent = on ? '✕ Close' : '⤢ Expand'; if (on) p.scrollTop = 0; b.focus()
})
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('.ig-panel.ig-full .ig-expand')?.click() })
