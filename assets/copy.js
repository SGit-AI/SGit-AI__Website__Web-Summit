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
// Every link to a vault (SG/Vault) opens in a new window (Dinis, 5 November 2026: "what is very important is to add
// the 'open vault in a new window' [to] the site"); a key in the link stays in that window's fragment.
document.querySelectorAll('a[href^="https://dev.vault.sgraph.ai"], a[href^="https://vault.sgraph.ai"]').forEach(a => {
    a.target = '_blank'; a.rel = 'noopener'
    if (!a.title) a.title = 'Opens the vault in a new window'
})
