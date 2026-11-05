// The sticker vote's vault with full access (WS-159), its own page at Dinis's word (5 November 2026: "move that 'open
// vault' to a new page/section where the main voting page just has a link to it"). For a person whose browser holds the
// key the vault key is sealed to (data/sealed/<id>/*-stickers-vault-key.json): the sealed message is opened in memory on a
// press, never written to the page or stored; the vault is shown in a frame, with a new-window link, the key (masked) and
// the drain passphrase. By conductor@web-summit.dinis.
(() => {
    'use strict'
    const mount = document.getElementById('sticker-vault')
    if (!mount) return
    const up = document.body.dataset.up || ''
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const say = h => { mount.innerHTML = `<p class="meta">${h}</p>` }
    async function start() {
        const KR = window.WSKeyring
        if (!KR) return say('This page needs the site keyring (assets/keyring.js).')
        try { await KR.ready } catch { }
        if (!KR.person) return say('Add your key first (the box at the top of the page): the vault key is sealed to the drainers\' keys.')
        let files = []
        try { const j = await (await fetch(up + 'me.json', { cache: 'no-cache' })).json(); files = ((j.people || {})[KR.person] || {}).sealed || [] } catch { return say('Could not read me.json.') }
        const f = files.filter(x => /-stickers-vault-key\.json$/.test(x)).sort().pop()
        if (!f) return say(`The vault key is not sealed to you (${esc(KR.person)}). Angelo, Jose, Indi and Dinis drain the votes; anyone can look at the vault read-only on <a href="../index.html">the vote page</a>.`)
        let env
        try { env = await (await fetch(up + f, { cache: 'no-cache' })).json() } catch { return say('Could not read your sealed message.') }
        const box = document.createElement('section'); box.className = 'sv-full'; mount.innerHTML = ''; mount.appendChild(box)
        if (env.key !== KR.fingerprint) { box.innerHTML = `<h2 id="full-access">Open the vault (full access)</h2><p>The vault key is sealed to your key ${esc(env.key)}, but this browser holds a different key (${esc(KR.fingerprint || 'none')}). Add your current key (the latest link your conductor gave you) and reload.</p>`; return }
        box.innerHTML = `<h2 id="full-access">Open the vault (full access)</h2><p>The vault key is sealed to your key${env.at ? ` (${esc(String(env.at).slice(0, 10))})` : ''}. It opens here, in this browser's memory only, when you press the button: never stored, never in the page. It gives write access, so use it to drain the votes: in the vault host add the SG/Send access token (the lock button), then Drain the votes with the passphrase below.</p>
<p class="sv-fbtns"><button type="button" class="sv-open" data-fopen>Open the vault (full access)</button></p><div data-fbody></div>`
        box.querySelector('[data-fopen]').onclick = async () => {
            const body = box.querySelector('[data-fbody]')
            let m
            try { m = await KR.open(env) } catch (e) { body.textContent = 'Your key could not open it: ' + (e.message || e); return }
            const fields = m.fields || {}, vk = fields['Vault key'], pass = fields['Drain passphrase']
            if (!vk) { body.textContent = 'The sealed message has no vault key.'; return }
            const url = 'https://dev.vault.sgraph.ai/#' + encodeURIComponent(vk)
            body.innerHTML = `<p class="sv-fbtns"><button type="button" data-fwin>Open in a new window</button>${pass ? ' <button type="button" data-fpass>Copy the drain passphrase</button>' : ''} <span class="meta" data-fmsg></span></p><p>This is the <b>full vault key</b> (it ends in <code>:${esc(vk.split(':').pop())}</code>; the public read key on this page does not). The vault host still says <b>Read-only</b> until you press its 🔒 button and paste the SG/Send access token: only then can it write, and the Drain panel appears.</p><p class="sv-vk"><code data-fkey>${esc(vk.slice(0, 10))}…${esc(vk.slice(-9))}</code><button type="button" data-fshow>Show</button><button type="button" data-fcopy>Copy the vault key</button></p><div class="sv-vault"></div>`
            body.querySelector('[data-fshow]').onclick = e => { const k = body.querySelector('[data-fkey]'), on = e.target.textContent === 'Show'; k.textContent = on ? vk : vk.slice(0, 10) + '…' + vk.slice(-9); e.target.textContent = on ? 'Hide' : 'Show' }
            body.querySelector('[data-fcopy]').onclick = async () => { try { await navigator.clipboard.writeText(vk); body.querySelector('[data-fmsg]').textContent = 'Vault key copied.' } catch { body.querySelector('[data-fmsg]').textContent = 'This browser did not allow copying: press Show and copy it by hand.' } }
            const frame = document.createElement('iframe')
            frame.title = 'The ws-stickers-vote vault, opened with full access'; frame.allow = 'fullscreen; clipboard-write'; frame.allowFullscreen = true
            frame.src = url
            body.querySelector('.sv-vault').appendChild(frame)
            body.querySelector('[data-fwin]').onclick = () => window.open(url, '_blank', 'noopener')
            const pb = body.querySelector('[data-fpass]')
            if (pb) pb.onclick = async () => { try { await navigator.clipboard.writeText(pass); body.querySelector('[data-fmsg]').textContent = 'Copied.' } catch { body.querySelector('[data-fmsg]').textContent = 'This browser did not allow copying; the passphrase is in your sealed message (For you panel).' } }
            box.querySelector('[data-fopen]').hidden = true
        }
    }
    if (document.readyState === 'complete') start(); else addEventListener('DOMContentLoaded', start)
})()
