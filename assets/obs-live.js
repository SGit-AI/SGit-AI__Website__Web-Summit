// The live observability panel (/observability/#live), observability@web-summit.dinis, 5 November 2026. Everything here
// is read straight out of an encrypted vault in this browser, from its published read key: sgit.ai's reader
// (assets/vendor/sgit-ai/2026-11-05/vault-embed.js) derives the address, fetches ciphertext and decrypts it. First one
// file (data/public.json) for the headline numbers, drawn by this page as text; then the vault's own app, run in a
// sandboxed, opaque-origin frame that can only ask for reads. Vault bytes are untrusted input: never put in this page as HTML.
(() => {
    'use strict'
    const box = document.querySelector('.obs-live'); if (!box || !window.SGVaultEmbed) return
    const cfg = { endpoint: box.dataset.endpoint, vault_id: box.dataset.vault, read_key: box.dataset.key.replace(/^sgit_public_read_/, ''), title: box.dataset.title }
    const head = box.querySelector('[data-head]'), frame = box.querySelector('[data-app]'), note = box.querySelector('[data-note]')
    const t0 = performance.now()
    const say = s => { note.textContent = s }
    const fmt = n => (n || 0).toLocaleString('en-GB')
    ;(async () => {
        say('Deriving the vault\'s address from its read key, fetching ciphertext, decrypting…')
        const reader = await new window.SGVaultEmbed.Reader(cfg).init()
        await reader.open()
        const d = JSON.parse(await reader.readText('data/public.json'))
        const ms = Math.round(performance.now() - t0)
        head.textContent = ''
        const T = d.totals
        head.textContent = `From data/public.json alone: ${fmt(T.readers.views)} views by readers, ${fmt(T.team.views)} by the team (by key), ${fmt(T.synthetic.views)} synthetic, ${fmt(T.crawlers.views)} by crawlers; ${fmt(d.agents.runs)} agent runs logged.`
        say(`Read from vault ${cfg.vault_id}: ${Object.keys(reader.files).length} files, data/public.json decrypted in your browser in ${ms} ms. As of ${d.generated} UTC; the drain runs hourly.`)
        await window.SGVaultEmbed.mount(frame, cfg)
        const f = frame.querySelector('iframe'); if (!f) return
        const normal = 'width:100%;height:80vh;border:1px solid var(--line,#ddd);border-radius:6px;background:#fff'
        const big = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:70;border:0;background:#fff'
        f.style.cssText = normal
        const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Maximise'
        b.style.cssText = 'margin:0 0 8px;padding:5px 12px;border-radius:6px;cursor:pointer'
        let max = false
        const flip = () => { max = !max; f.style.cssText = max ? big : normal; b.textContent = max ? 'Restore (Esc)' : 'Maximise'; b.style.position = max ? 'fixed' : ''; b.style.top = max ? '10px' : ''; b.style.right = max ? '16px' : ''; b.style.zIndex = max ? '71' : '' }
        b.addEventListener('click', flip); document.addEventListener('keydown', e => { if (e.key === 'Escape' && max) flip() })
        frame.insertBefore(b, f)
        // the vault itself in a new window (Dinis, 5 November: "add the 'open vault in a new window'"); the read key is public
        const w = document.createElement('button'); w.type = 'button'; w.textContent = 'Open the vault in a new window'
        w.style.cssText = 'margin:0 0 8px 8px;padding:5px 12px;border-radius:6px;cursor:pointer'
        w.addEventListener('click', () => window.open('https://dev.vault.sgraph.ai/#' + encodeURIComponent(box.dataset.key + ':' + cfg.vault_id), '_blank', 'noopener'))
        frame.insertBefore(w, f)
    })().catch(e => say('Could not read the vault: ' + (e && e.message || e)))
})()
