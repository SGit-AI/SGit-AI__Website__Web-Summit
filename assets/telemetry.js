// Page views for the team site (WS-37), built by conductor@web-summit.jose on 4 November 2026 at Jose Bota's word, from
// the observability pack (/observability-pack/, the PHP newsroom's assets/telemetry.js). One event per page per tab,
// sealed here to the drain key (sgit hybrid v2, the same envelope as assets/feedback.js) and written to a write-only
// append lane of the private data vault ws-observability-data; on 507 (a lane full) the next lane is tried.
// No IP address, no cookie, no user-agent string. Do Not Track and Global Privacy Control send nothing; so does the
// pause switch in the footer. A team member whose browser holds their site key (assets/keyring.js) is named and the
// event is signed with that key; the drain verifies it against data/person-keys.json. Never blocks, never shows an error.
(() => {
    'use strict'
    try {
        const nav = navigator
        const dnt = nav.doNotTrack === '1' || window.doNotTrack === '1' || nav.globalPrivacyControl === true
        const LS = { get: k => { try { return localStorage.getItem('ws.telemetry.' + k) } catch { return null } }, set: (k, v) => { try { v === null ? localStorage.removeItem('ws.telemetry.' + k) : localStorage.setItem('ws.telemetry.' + k, v) } catch { } } }
        const script = document.currentScript, base = script ? script.src.replace(/telemetry\.js(\?.*)?$/, '') : '/assets/'
        const paused = () => LS.get('off') === '1'

        // the disclosure and the pause switch, in the footer of every page
        const footer = () => {
            const row = document.querySelector('footer .row'); if (!row || row.querySelector('.tm-note')) return
            const s = document.createElement('span'); s.className = 'tm-note'
            const b = document.createElement('button'); b.type = 'button'; b.style.cssText = 'font:inherit;background:none;border:0;padding:0;text-decoration:underline;cursor:pointer;color:inherit'
            if (dnt) { s.textContent = 'Page views: off (Do Not Track or Global Privacy Control is on).'; row.appendChild(s); return }
            const draw = () => { s.firstChild && s.firstChild.nodeType === 3 && s.removeChild(s.firstChild); s.insertBefore(document.createTextNode(paused() ? 'Page views: paused on this device. ' : 'Page views are counted (no IP, no cookie). '), b); b.textContent = paused() ? 'Resume' : 'Pause' }
            b.onclick = () => { LS.set('off', paused() ? null : '1'); draw() }
            s.appendChild(b); draw(); row.appendChild(s)
        }
        const safeFooter = () => { try { footer() } catch { } }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeFooter); else safeFooter()
        if (dnt || paused()) return

        const SS = { get: k => { try { return sessionStorage.getItem('ws.telemetry.' + k) } catch { return null } }, set: (k, v) => { try { sessionStorage.setItem('ws.telemetry.' + k, v) } catch { } } }
        let sid = SS.get('sid'); if (!sid) { sid = [...crypto.getRandomValues(new Uint8Array(4))].map(x => x.toString(16).padStart(2, '0')).join(''); SS.set('sid', sid) }
        const sent = JSON.parse(SS.get('sent') || '[]'), path = location.pathname
        if (sent.includes(path)) return

        const b64 = bytes => { let s = ''; for (const x of new Uint8Array(bytes)) s += String.fromCharCode(x); return btoa(s) }
        const unpem = pem => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
        async function seal(pem, text) {
            const S = crypto.subtle
            const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
            const aes = await S.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
            const iv = crypto.getRandomValues(new Uint8Array(12))
            const c = await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
            const w = await S.encrypt({ name: 'RSA-OAEP' }, pub, await S.exportKey('raw', aes))
            return btoa(btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) })))   // the lane takes base64 of the .enc text
        }
        // automation by class only, never the user-agent string itself
        const ua = nav.userAgent || ''
        const agent = nav.webdriver ? 'webdriver' : /HeadlessChrome|PhantomJS/.test(ua) ? 'headless'
            : /Googlebot/i.test(ua) ? 'googlebot' : /bingbot/i.test(ua) ? 'bingbot' : /bot|crawl|spider|slurp/i.test(ua) ? 'bot' : ''
        const w = window.innerWidth || 1024
        const ver = (document.querySelector('a.ver') || {}).textContent || ''
        let ref = ''; try { ref = document.referrer ? new URL(document.referrer).host : '' } catch { }
        const ev = { v: 1, site: location.host, ver: ver.trim(), ts: new Date().toISOString().slice(0, 16) + 'Z', sid, path, ref,
            lang: nav.language || '', screen: w < 600 ? 'phone' : w < 1000 ? 'tablet' : 'desktop', tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || '') }
        if (agent) ev.agent = agent

        const send = async () => {
            if (paused()) return
            const cfg = await (await fetch(base + 'telemetry.json', { cache: 'no-cache' })).json()
            if (!cfg.enabled || !cfg.lanes || !cfg.lanes.length) return
            const KR = window.WSKeyring
            if (KR) { try { await Promise.race([KR.ready, new Promise(r => setTimeout(r, 1500))]) } catch { } }
            if (KR && KR.person) {
                ev.person = KR.person
                const over = JSON.stringify(ev)
                ev.sig = { key: KR.fingerprint, alg: 'ECDSA-P256-SHA256-P1363', sig: await KR.sign(over), over }
            }
            const payload = await seal(cfg.recipient.encrypt, JSON.stringify(ev))
            for (const token of cfg.lanes) {
                const r = await fetch(`${cfg.endpoint}/api/vault/append/write/${cfg.vault_id}`, { method: 'POST', keepalive: true,
                    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: token, payload }) })
                if (r.status !== 507) { if (r.ok) { sent.push(path); SS.set('sent', JSON.stringify(sent)) } return }
            }
        }
        const go = () => send().catch(() => { })
        if (document.readyState === 'complete') setTimeout(go, 0); else window.addEventListener('load', go)
    } catch { }
})()
