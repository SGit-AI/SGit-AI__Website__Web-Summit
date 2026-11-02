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
