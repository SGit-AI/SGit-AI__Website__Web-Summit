// "Add your key", big, on every page, for everyone, until this browser holds one (Dinis, 4 November 2026: "that button
// needs to be really big ... for everybody ... until this is done, something is really missing"). Three ways in, all
// working on an iPhone: tap the link your conductor gave you (it opens the site with the key), paste it (one tap on
// "Paste my key"), or choose the file it came in. A QR image works where the browser can read QR codes (BarcodeDetector).
// Uses assets/keyring.js; the key is stored non-extractable in this browser only. By conductor@web-summit.dinis.
(() => {
    'use strict'
    const KR = window.WSKeyring
    if (!KR) return
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    KR.ready.then(() => {
        if (KR.person) return
        const main = document.getElementById('main'); if (!main) return
        const box = document.createElement('section'); box.className = 'addkey'; box.setAttribute('aria-label', 'Add your key')
        box.innerHTML = `<div class="ak-head"><span class="ak-icon" aria-hidden="true">🔑</span><div><h2>Add your key</h2><p>Your conductor agent gives you a key (a link, a text file or a QR code). Add it once in each browser you use: the site then knows it is you, opens what is sealed to you, and signs your messages to your agents. It stays in this browser only.</p></div></div>
<div class="ak-actions"><button type="button" class="ak-big" data-paste>Paste my key</button><label class="ak-file">Choose the file<input type="file" accept=".txt,text/plain,image/*" data-file hidden></label></div>
<details class="ak-more"><summary>Or paste it here by hand</summary><form><label class="sr" for="ak-text">Your key link</label><textarea id="ak-text" rows="3" placeholder="https://web-summit.sgit.ai/#key=…" autocomplete="off" spellcheck="false"></textarea><button type="submit">Add</button></form></details>
<p class="ak-msg" role="status" aria-live="polite"></p>
<p class="ak-help">No key yet? Ask your conductor: <em>"issue me a key for the site"</em>. It is on the <a href="${esc(document.body.dataset.up || '')}start/index.html">start page</a> too.</p>`
        const say = (t, bad) => { const m = box.querySelector('.ak-msg'); m.textContent = t; m.classList.toggle('bad', !!bad) }
        const add = async text => {
            try { const who = await KR.add(text); try { localStorage.setItem('ws.me', who) } catch { } say(`Added: you are ${who}. Reloading…`); setTimeout(() => location.reload(), 600) }
            catch (e) { say(`That did not work: ${e.message}. Copy the whole link (it starts with https://web-summit.sgit.ai/#key=) and try again.`, true) }
        }
        box.querySelector('[data-paste]').onclick = async () => {
            try { const t = await navigator.clipboard.readText(); if (!t) throw new Error('the clipboard is empty'); await add(t) }
            catch (e) { box.querySelector('.ak-more').open = true; box.querySelector('#ak-text').focus(); say('This browser did not let the page read the clipboard: paste into the box below instead (press and hold, then Paste).', true) }
        }
        box.querySelector('[data-file]').onchange = async e => {
            const f = e.target.files[0]; if (!f) return
            if (/^text\/|\.txt$/i.test(f.type || f.name)) return add(await f.text())
            if ('BarcodeDetector' in window) {
                try { const codes = await new window.BarcodeDetector({ formats: ['qr_code'] }).detect(await createImageBitmap(f)); if (codes[0]) return add(codes[0].rawValue) } catch { }
            }
            say('This browser cannot read a QR code from a picture: use the text file or the link instead (or scan the QR with another phone\'s camera).', true)
        }
        box.querySelector('form').onsubmit = e => { e.preventDefault(); add(box.querySelector('#ak-text').value) }
        main.insertBefore(box, main.firstChild)
    })
})()
