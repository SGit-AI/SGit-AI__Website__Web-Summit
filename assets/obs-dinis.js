// observability@web-summit.dinis's experiment sender (5 November 2026, at Dinis Cruz's word), beside Jose's
// assets/telemetry.js (WS-37), into its own vault (assets/obs-dinis.json). Two events per page LOAD (a refresh, or
// coming back to a page, is counted again: Dinis, 5 November, "I just refresh that page, it should show there"):
//   view  when the page loads (the same fields as telemetry.js);
//   read  the first time the tab is hidden or closed: seconds the page was visible and the deepest scroll (percent),
//         so "Vicky opened the brief" can be told from "Vicky read the brief".
// Sealed here to the drain key (sgit hybrid v2, as telemetry.js and feedback.js) and written to a write-only lane; on
// 507 the next lane is tried. Signed with the person's site key when the browser holds one (assets/keyring.js).
// No IP address, no cookie, no user-agent string. Do Not Track, Global Privacy Control and the footer's pause switch
// (telemetry.js's, the same setting) stop it. Never blocks, never shows an error.
(() => {
    'use strict'
    try {
        const nav = navigator
        if (nav.doNotTrack === '1' || window.doNotTrack === '1' || nav.globalPrivacyControl === true) return
        const paused = () => { try { return localStorage.getItem('ws.telemetry.off') === '1' } catch { return false } }
        if (paused()) return
        const SS = { get: k => { try { return sessionStorage.getItem('ws.obsd.' + k) } catch { return null } }, set: (k, v) => { try { sessionStorage.setItem('ws.obsd.' + k, v) } catch { } } }
        const script = document.currentScript, base = script ? script.src.replace(/obs-dinis\.js(\?.*)?$/, '') : '/assets/'
        const note = () => {                                                // beside telemetry.js's disclosure: what this one adds
            try {
                const row = document.querySelector('footer .row'); if (!row || row.querySelector('.obsd-note')) return
                const a = document.createElement('a'); a.className = 'obsd-note'; a.href = base + '../observability/index.html'
                a.textContent = 'Reading time and agent runs too'; row.appendChild(a)
            } catch { }
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', note); else note()
        let sid = SS.get('sid'); if (!sid) { sid = [...crypto.getRandomValues(new Uint8Array(4))].map(x => x.toString(16).padStart(2, '0')).join(''); SS.set('sid', sid) }
        const path = location.pathname
        const done = new Set()                                            // per page LOAD: a refresh or a return is counted again
        const has = t => done.has(t)
        const mark = t => done.add(t)

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
        const ua = nav.userAgent || ''
        const agent = nav.webdriver ? 'webdriver' : /HeadlessChrome|PhantomJS/.test(ua) ? 'headless'
            : /Googlebot/i.test(ua) ? 'googlebot' : /bingbot/i.test(ua) ? 'bingbot' : /bot|crawl|spider|slurp/i.test(ua) ? 'bot' : ''
        const w = window.innerWidth || 1024
        let ref = ''; try { ref = document.referrer ? new URL(document.referrer).host : '' } catch { }
        const common = () => {
            const e = { v: 1, src: 'obs-dinis', site: location.host, ver: ((document.querySelector('a.ver') || {}).textContent || '').trim(),
                ts: new Date().toISOString().slice(0, 16) + 'Z', sid, path, ref, lang: nav.language || '',
                screen: w < 600 ? 'phone' : w < 1000 ? 'tablet' : 'desktop', tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || '') }
            if (agent) e.agent = agent
            return e
        }

        // reading: time visible and the deepest scroll, measured locally, sent once
        let visibleMs = 0, since = document.visibilityState === 'visible' ? performance.now() : null, maxScroll = 0
        const scrolled = () => { const h = document.documentElement, top = window.scrollY || h.scrollTop, all = Math.max(1, h.scrollHeight - window.innerHeight); maxScroll = Math.max(maxScroll, Math.min(100, Math.round(100 * top / all))) }
        window.addEventListener('scroll', scrolled, { passive: true })

        let cfgP = null
        const cfg = () => cfgP || (cfgP = fetch(base + 'obs-dinis.json', { cache: 'no-cache' }).then(r => r.json()))
        const send = async ev => {
            if (paused()) return false
            const c = await cfg(); if (!c.enabled || !c.lanes || !c.lanes.site || !c.lanes.site.length) return false
            const KR = window.WSKeyring
            if (KR) { try { await Promise.race([KR.ready, new Promise(r => setTimeout(r, 1500))]) } catch { } }
            if (KR && KR.person) {
                ev.person = KR.person
                const over = JSON.stringify(ev)
                ev.sig = { key: KR.fingerprint, alg: 'ECDSA-P256-SHA256-P1363', sig: await KR.sign(over), over }
            }
            const payload = await seal(c.recipient.encrypt, JSON.stringify(ev))
            for (const token of c.lanes.site) {
                const r = await fetch(`${c.endpoint}/api/vault/append/write/${c.vault_id}`, { method: 'POST', keepalive: true,
                    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: token, payload }) })
                if (r.status !== 507) return r.ok
            }
            return false
        }
        const view = () => { resend(); if (has('view')) return; send(Object.assign(common(), { type: 'view' })).then(ok => ok && mark('view')).catch(() => { }) }
        const finish = () => {
            if (since !== null) { visibleMs += performance.now() - since; since = null }
            if (has('read')) return
            scrolled(); mark('read')                                          // once per load
            // leaving the page can cut the (asynchronous) seal-and-send short, so the read is kept in this tab first and
            // removed once it is written; the next page loaded in this tab sends any that did not make it
            const ev = Object.assign(common(), { type: 'read', visible_s: Math.min(3600, Math.round(visibleMs / 1000)), scroll: maxScroll })
            const key = 'pending.' + ev.path + '.' + Date.now()
            SS.set(key, JSON.stringify(ev))
            send(ev).then(ok => { if (ok) try { sessionStorage.removeItem('ws.obsd.' + key) } catch { } }).catch(() => { })
        }
        const resend = () => {                                                // reads a previous page in this tab could not finish sending
            try {
                for (const k of Object.keys(sessionStorage).filter(k => k.startsWith('ws.obsd.pending.'))) {
                    const ev = JSON.parse(sessionStorage.getItem(k)); sessionStorage.removeItem(k)
                    send(ev).catch(() => { })
                }
            } catch { }
        }
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') since = performance.now(); else finish() })
        window.addEventListener('pagehide', finish)
        cfg().catch(() => { })                                                  // fetched early, so pagehide need not wait for it
        if (document.readyState === 'complete') setTimeout(view, 0); else window.addEventListener('load', view)
    } catch { }
})()
