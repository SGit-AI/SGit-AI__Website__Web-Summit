// A copy button on every block of code in a page (the agents' prompts above all). No dependencies.
document.querySelectorAll('main pre:not(.banner)').forEach(pre => {
    const b = document.createElement('button')
    b.type = 'button'; b.className = 'copy'; b.textContent = 'Copy'
    b.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText((pre.querySelector('code') || pre).innerText); b.textContent = 'Copied' }
        catch { b.textContent = 'Select and copy' }
        setTimeout(() => { b.textContent = 'Copy' }, 1600)
    })
    pre.classList.add('has-copy'); pre.appendChild(b)
})

// WS-77: on a phone the section's row scrolls sideways; it starts with the current page in view (the top row is short)
for (const row of document.querySelectorAll('nav.subnav .row')) {
    const cur = row.querySelector('[aria-current="page"]')
    if (cur && row.scrollWidth > row.clientWidth) row.scrollLeft = Math.max(0, cur.offsetLeft - row.offsetLeft - 24)
}
