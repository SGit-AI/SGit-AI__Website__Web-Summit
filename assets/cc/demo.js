/* The stand's demo flows (Dinis, 12 November 2026, at the stand, by conductor@web-summit.dinis):
   - VÍDEOS (#reel): the twelve approved stand videos, played in the page straight out of a public SG/Vault, in a loop.
     The videos come from the team's videos vault (h9in5em4, kept by video@web-summit.silvio), cut into 4-second
     fragmented-MP4 pieces under 4 MB each and kept in the stand-reel vault (people/dinis/vaults.json), so every byte
     comes through the vault's read API (which answers any site) and is decrypted here with Web Crypto by
     SGVaultEmbed.Reader. The same trick as PrompTugal.news's interviews (assets/vault-video/vault-video.js there).
     On the left, a thumbnail per video with a tick: the loop plays the ticked ones. Ticks, loop and language are
     remembered on this device (localStorage). Keys: Space play/pause, ← → previous/next, L loop, H hide the list,
     F full screen.
   - PT.NEWS, LISBON TECH FRINGE, STORM, GAMMA-RAY: the team's sites, opened inside the command centre (like SWARM),
     each with a way out to its own window. */
(function () {
    const X = window.CC_EXTRA = window.CC_EXTRA || {}; X.views = X.views || {}
    const SITE = 'https://web-summit.sgit.ai/'
    const READER = SITE + 'assets/vendor/sgit-ai/2026-11-05/vault-embed.js'
    const get = k => { try { return localStorage.getItem(k) } catch { return null } }, put = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

    if (!document.getElementById('cc-demo-css')) { const st = document.createElement('style'); st.id = 'cc-demo-css'; st.textContent = `
.cc-web { display: grid; grid-template-rows: auto 1fr; min-height: calc(100vh - 64px); }
.cc-web .bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 8px 16px; font: 600 13px "Barlow Condensed", "Arial Narrow", sans-serif; letter-spacing: 1.4px; text-transform: uppercase; color: #8EADA8; }
.cc-web .bar a.cc-webgo { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); text-decoration: none; box-shadow: 0 0 16px rgba(217,178,110,.3); } .cc-web .bar a.cc-webgo:hover { color: #000; box-shadow: 0 0 22px rgba(217,178,110,.55); }
.cc-web iframe { width: 100%; height: calc(100vh - 110px); border: 0; border-radius: 16px; background: #04100F; }
.rl { --rl-line: rgba(150,230,215,.18); display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 14px; min-height: calc(100vh - 80px); padding: 6px 4px 10px; color: #EAF6F3; font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; }
.rl.rl-nolist { grid-template-columns: minmax(0, 1fr); } .rl.rl-nolist .rl-list { display: none; }
.rl-list { display: grid; grid-template-rows: auto 1fr; min-height: 0; max-height: calc(100vh - 90px); border: 1px solid var(--rl-line); border-radius: 18px; background: rgba(4,18,18,.6); overflow: hidden; }
.rl-lh { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--rl-line); font: 600 13px "Barlow Condensed", sans-serif; letter-spacing: 1.4px; text-transform: uppercase; color: #8EADA8; }
.rl-lh button { all: unset; cursor: pointer; padding: 3px 8px; border-radius: 999px; color: #CFE3DF; } .rl-lh button:hover { background: rgba(67,217,198,.12); color: #fff; }
.rl-items { overflow-y: auto; padding: 6px; display: grid; gap: 6px; align-content: start; scrollbar-width: thin; }
.rl-item { display: grid; grid-template-columns: 22px 92px 1fr; gap: 9px; align-items: center; padding: 6px; border-radius: 12px; border: 1px solid transparent; cursor: pointer; }
.rl-item:hover { background: rgba(67,217,198,.07); }
.rl-item[aria-current="true"] { border-color: rgba(251,226,174,.7); background: rgba(251,226,174,.08); box-shadow: 0 0 18px rgba(217,178,110,.18); }
.rl-item.off { opacity: .45; }
.rl-item input { width: 18px; height: 18px; accent-color: #43D9C6; cursor: pointer; margin: 0; }
.rl-item .th { position: relative; width: 92px; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; background: #0B2826; }
.rl-item .th img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rl-item .th small { position: absolute; right: 4px; bottom: 3px; padding: 0 4px; border-radius: 4px; background: rgba(0,0,0,.7); font-size: 11px; color: #fff; }
.rl-item b { display: block; font: 500 14px/1.2 "Barlow Semi Condensed", sans-serif; color: #EAF6F3; }
.rl-item span.n { display: block; margin-top: 2px; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.2px; text-transform: uppercase; color: #8EADA8; }
.rl-stage { display: grid; grid-template-rows: auto 1fr auto; gap: 10px; min-width: 0; }
.rl-ctl { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rl-ctl button, .rl-ctl select { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(150,230,215,.28); background: rgba(10,30,30,.6); font: 600 13px "Barlow Condensed", sans-serif; letter-spacing: 1.4px; text-transform: uppercase; color: #CFE3DF; }
.rl-ctl button:hover, .rl-ctl select:hover { color: #fff; box-shadow: 0 0 0 1px rgba(67,217,198,.6), 0 0 14px rgba(67,217,198,.25); }
.rl-ctl button[aria-pressed="true"] { color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); border-color: transparent; }
.rl-ctl button:focus-visible, .rl-ctl select:focus-visible, .rl-item:focus-visible { outline: 2px solid #FBE2AE; outline-offset: 2px; }
.rl-ctl select option { background: #04100F; color: #EAF6F3; }
.rl-ctl .t { flex: 1; min-width: 160px; font: 500 20px "Barlow Condensed", sans-serif; letter-spacing: .4px; color: #EAF6F3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rl-scr { position: relative; display: grid; place-items: center; min-height: 0; border-radius: 18px; overflow: hidden; background: #000; border: 1px solid var(--rl-line); }
.rl-scr video { width: 100%; height: 100%; max-height: calc(100vh - 190px); object-fit: contain; background: #000; display: block; }
.rl-scr:fullscreen video { max-height: 100vh; }
.rl-scr .big { all: unset; cursor: pointer; position: absolute; width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; background: rgba(4,16,15,.7); border: 1px solid rgba(251,226,174,.6); color: #FBE2AE; font-size: 34px; }
.rl-scr .big[hidden] { display: none; }
.rl-bar { height: 4px; border-radius: 4px; background: rgba(150,230,215,.15); overflow: hidden; } .rl-bar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #43D9C6, #FBE2AE); }
.rl-st { font: 500 12px "Barlow Semi Condensed", sans-serif; color: #8EADA8; min-height: 16px; }
@media (max-width: 900px) { .rl { grid-template-columns: minmax(0, 1fr); } .rl-list { max-height: 220px; } .rl-items { grid-auto-flow: column; grid-auto-columns: 230px; overflow-x: auto; overflow-y: hidden; } }
`; document.head.appendChild(st) }

    // ---------- the team's sites, inside the command centre ----------
    const web = (id, label, url, title) => { X.views[id] = { label, icon: 'flag', render: () => `<section class="cc-web"><div class="bar"><span>${esc(label)} · ${esc(url.replace(/^https:\/\//, '').replace(/\/$/, ''))}</span><a class="cc-webgo" href="${esc(url)}" target="_blank" rel="noopener">Abrir o site · Open the website ↗</a></div><iframe src="${esc(url)}" title="${esc(title)}" loading="lazy" referrerpolicy="no-referrer" allow="fullscreen; autoplay"></iframe></section>` } }
    web('ptnews', 'PT.news', 'https://promptugal.news/', 'PrompTugal.news')
    web('fringe', 'Lisbon Tech Fringe', 'https://lisbontechfringe.com/', 'Lisbon Tech Fringe')
    web('storm', 'Storm', 'https://storm-charles.promptugal.news/', 'Storm Charles: the incident site')
    web('gammaray', 'GAMMA-Ray', 'https://gamma-ray.sgit.ai/', 'GAMMA-Ray')

    // ---------- VÍDEOS: the reel ----------
    const LANGS = { en: 'English', pt: 'Português', es: 'Español', fr: 'Français', zh: '中文', hi: 'हिन्दी', wide: '16:9', square: 'Square' }
    let ctx = null  // the reel's state while its view is open: { R, reel, ... }; a new mount starts a new generation
    let gen = 0
    const loadReader = () => window.SGVaultEmbed ? Promise.resolve() : new Promise((ok, no) => { const s = document.createElement('script'); s.src = READER; s.onload = ok; s.onerror = () => no(new Error('the vault reader did not load')); document.head.appendChild(s) })
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    const off = () => { try { return new Set(JSON.parse(get('cc.reel.off') || '[]')) } catch { return new Set() } }
    const pref = () => get('cc.reel.lang') || 'en'
    const pick = v => v.versions.find(x => x.code === pref()) || v.versions.find(x => x.code === 'en') || v.versions.find(x => x.code === 'wide') || v.versions[0]
    const tt = v => (pref() === 'pt' && v.title_pt) || v.title
    const fmt = s => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0')

    X.views.reel = { label: 'Vídeos', icon: 'flag', render: () => `<section class="rl" id="rl">
<aside class="rl-list" aria-label="The videos"><div class="rl-lh"><span style="white-space:nowrap">Vídeos · <span id="rl-n">…</span></span><span style="white-space:nowrap"><button type="button" data-rl="all">Todos</button><button type="button" data-rl="none">Nenhum</button></span></div><div class="rl-items" id="rl-items"><p class="rl-st" style="padding:10px">A abrir o cofre… / Opening the vault…</p></div></aside>
<div class="rl-stage">
  <div class="rl-ctl" role="group" aria-label="Player"><button type="button" data-rl="prev" title="Previous (←)">◀</button><button type="button" data-rl="play" id="rl-play" title="Play / pause (Space)">▶ Play</button><button type="button" data-rl="next" title="Next (→)">▶▶</button><button type="button" data-rl="loop" id="rl-loop" aria-pressed="false" title="Play the ticked videos in a loop (L)">⟲ Loop</button><label class="sr" for="rl-lang">Language</label><select id="rl-lang" title="Language (remembered)"></select><span class="t" id="rl-t"></span><button type="button" data-rl="list" title="Hide or show the list (H)">☰</button><button type="button" data-rl="fs" title="Full screen (F)">⛶</button></div>
  <div class="rl-scr" id="rl-scr"><video id="rl-v" playsinline muted preload="none"></video><button type="button" class="big" id="rl-big" aria-label="Play">▶</button></div>
  <div><div class="rl-bar"><i id="rl-bar"></i></div><p class="rl-st" id="rl-st"></p></div>
</div></section>`, after: mount }

    async function mount() {
        const my = ++gen
        const $ = id => document.getElementById(id)
        const st = t => { const e = $('rl-st'); if (e && my === gen) e.textContent = t }
        try {
            await loadReader()
            if (!ctx) {
                const vs = await fetch(SITE + 'people/dinis/vaults.json', { cache: 'no-cache' }).then(r => r.json())
                const v = (vs.vaults || []).find(x => x.use === 'stand-reel'); if (!v) throw new Error('no stand-reel vault in people/dinis/vaults.json')
                const R = await new window.SGVaultEmbed.Reader({ endpoint: v.endpoint || 'https://dev.send.sgraph.ai', vault_id: v.vault_id, read_key: v.read_key.replace(/^sgit_public_read_/, '') }).init()
                // the reel's vault has ~300 files in 40 folders: read the folders in parallel, not one after another (18 s -> ~2 s)
                R.walk = async function (treeId, prefix) { const tree = await this.objJson(treeId); await Promise.all((tree.entries || []).map(async e => { const name = await this.decB64(e.name_enc), full = prefix ? prefix + '/' + name : name; if (e.tree_id) await this.walk(e.tree_id, full); else this.files[full] = e.blob_id })) }
                await R.open()
                const reel = JSON.parse(await R.readText('reel.json'))
                ctx = { R, reel, posters: new Map(), cur: 0 }
            }
        } catch (e) { const b = $('rl-items'); if (b && my === gen) b.innerHTML = `<p class="rl-st" style="padding:10px;color:#FF9AAE">O cofre não respondeu agora (${esc(e.message || e)}). Tenta outra vez dentro de um minuto.</p>`; return }
        if (my !== gen || !$('rl')) return
        const { R, reel } = ctx, V = reel.videos, video = $('rl-v')
        if (get('cc.reel.list') === 'off') $('rl').classList.add('rl-nolist')
        const loopOn = () => get('cc.reel.loop') !== 'off'
        const paintLoop = () => $('rl-loop').setAttribute('aria-pressed', String(loopOn()))
        const ticked = () => { const o = off(); return V.map((v, i) => i).filter(i => !o.has(V[i].id)) }
        const paintList = () => {
            const o = off()
            $('rl-n').textContent = `${V.length - o.size}/${V.length} no loop`
            $('rl-items').innerHTML = V.map((v, i) => { const p = pick(v); return `<div class="rl-item${o.has(v.id) ? ' off' : ''}" role="button" tabindex="0" data-i="${i}" aria-current="${i === ctx.cur}"><input type="checkbox" data-tick="${esc(v.id)}" ${o.has(v.id) ? '' : 'checked'} aria-label="${esc(v.title)} in the loop" title="In the loop"><span class="th"><img data-poster="${i}" alt=""><small>${fmt(p.duration)}</small></span><span><b>${esc(tt(v))}</b><span class="n">${v.versions.map(x => esc(x.code === 'wide' || x.code === 'square' ? x.label : x.code.toUpperCase())).join(' · ')}</span></span></div>` }).join('')
            V.forEach((v, i) => { const img = document.querySelector(`[data-poster="${i}"]`); if (!img) return
                if (!ctx.posters.has(v.poster)) ctx.posters.set(v.poster, R.readBytes(v.poster).then(b => URL.createObjectURL(new Blob([b], { type: 'image/jpeg' }))).catch(() => ''))
                ctx.posters.get(v.poster).then(u => { if (u) img.src = u }) })
        }
        const paintLang = () => { const v = V[ctx.cur], cur = pick(v)
            $('rl-lang').innerHTML = v.versions.map(x => `<option value="${esc(x.code)}" ${x.code === cur.code ? 'selected' : ''}>${esc(LANGS[x.code] || x.label)}</option>`).join('')
            $('rl-t').textContent = tt(v) }
        paintList(); paintLoop(); paintLang()
        ctx.posters.get(V[ctx.cur].poster)?.then(u => { if (u && my === gen && !video.src) video.poster = u })

        // ---- playback: one MediaSource per video, the pieces fetched a few at a time, the next video's first pieces fetched ahead ----
        const cache = new Map()   // dir+file -> Promise<Uint8Array>, for the pieces fetched ahead
        const read = async (p, tries = 0) => { try { const b = await R.readBytes(p); R.mem.clear(); return b } catch (e) { if (tries >= 4 || !/HTTP (429|5\d\d)|fetch/i.test(String(e && e.message))) throw e; await sleep(1000 * 2 ** tries); return read(p, tries + 1) } }
        const piece = p => { if (cache.has(p)) { const x = cache.get(p); cache.delete(p); return x } return read(p) }
        const man = async dir => { const k = dir + '/manifest.json'; if (!ctx.man) ctx.man = new Map(); if (!ctx.man.has(k)) ctx.man.set(k, read(k).then(b => JSON.parse(new TextDecoder().decode(b)))); return ctx.man.get(k) }
        const ahead = async i => { try { const d = pick(V[i]).dir, m = await man(d); for (const f of [m.init, ...m.segments.slice(0, 3).map(s => s.file)]) { const p = d + '/' + f; if (!cache.has(p)) cache.set(p, read(p).catch(() => null)) } } catch { } }
        const canMSE = mime => { const MS = window.ManagedMediaSource || window.MediaSource; return !!(MS && MS.isTypeSupported && MS.isTypeSupported(mime)) }
        let token = 0
        async function play(i) {
            const t = ++token, alive = () => t === token && my === gen && document.contains(video)
            ctx.cur = i; paintLang(); document.querySelectorAll('.rl-item').forEach(el => el.setAttribute('aria-current', String(+el.dataset.i === i)))
            document.querySelector('.rl-item[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
            $('rl-big').hidden = true; $('rl-bar').style.width = '0'
            const ver = pick(V[i]), dir = ver.dir
            st(`A abrir · Opening "${tt(V[i])}" (${LANGS[ver.code] || ver.label}) from the vault…`)
            const m = await man(dir); if (!alive()) return
            const files = [m.init, ...m.segments.map(s => s.file)]
            ctx.posters.get(V[i].poster)?.then(u => { if (u && alive()) video.poster = u })
            if (canMSE(m.mime)) {
                const Managed = !!window.ManagedMediaSource, MS = window.ManagedMediaSource || window.MediaSource, ms = new MS()
                if (Managed) video.disableRemotePlayback = true
                const old = video.src; video.src = URL.createObjectURL(ms); if (old && old.startsWith('blob:')) URL.revokeObjectURL(old)
                await new Promise(r => ms.addEventListener('sourceopen', r, { once: true })); if (!alive()) return
                ms.duration = m.duration
                const sb = ms.addSourceBuffer(m.mime)
                const add = b => new Promise((ok, no) => { sb.addEventListener('updateend', ok, { once: true }); sb.addEventListener('error', no, { once: true }); sb.appendBuffer(b) })
                const q = []; let n = 0, k = 0
                const take = () => { const f = files[k++]; q.push(piece(dir + '/' + f).then(b => b || read(dir + '/' + f))) }
                while (k < files.length && q.length < 4) take()
                while (q.length) {
                    const b = await q.shift(); if (!alive()) return
                    if (k < files.length) take()
                    await add(b); n++
                    if (n === 2) video.play().catch(() => { $('rl-big').hidden = false })
                    st(`Do cofre ${R.vaultId}, decifrado neste browser · ${n}/${files.length} pieces`)
                }
                if (alive() && ms.readyState === 'open') ms.endOfStream()
            } else {
                const parts = []; for (const f of files) { const b = await piece(dir + '/' + f) || await read(dir + '/' + f); if (!alive()) return; parts.push(b); st(`A decifrar · Decrypting ${parts.length}/${files.length}…`) }
                const old = video.src; video.src = URL.createObjectURL(new Blob(parts, { type: 'video/mp4' })); if (old && old.startsWith('blob:')) URL.revokeObjectURL(old)
                video.play().catch(() => { $('rl-big').hidden = false })
            }
            if (!alive()) return
            st(`Do cofre ${R.vaultId}, decifrado neste browser · ${tt(V[i])} · ${fmt(m.duration)}`)
            const nx = next(i, 1); if (nx != null && nx !== i) ahead(nx)
        }
        const next = (i, d) => { const T = ticked(); if (!T.length) return null; const all = V.map((v, j) => j); let j = i
            for (let s = 0; s < all.length; s++) { j = (j + d + V.length) % V.length; if (T.includes(j)) return j } return null }
        const go = d => { const j = next(ctx.cur, d); if (j != null) play(j).catch(e => st('Não tocou · Playback failed: ' + (e.message || e))) }
        const toggle = () => { if (video.paused) video.play().catch(() => { }); else video.pause() }
        video.addEventListener('play', () => { $('rl-play').textContent = '❚❚ Pause'; $('rl-big').hidden = true })
        video.addEventListener('pause', () => { $('rl-play').textContent = '▶ Play' })
        video.addEventListener('timeupdate', () => { if (video.duration) $('rl-bar').style.width = (video.currentTime / video.duration * 100).toFixed(1) + '%' })
        video.addEventListener('ended', () => { if (!loopOn()) { $('rl-big').hidden = false; return } const T = ticked(); if (!T.length) return
            const j = next(ctx.cur, 1); if (j == null) return; if (j === ctx.cur) { video.currentTime = 0; video.play().catch(() => { }) } else go(1) })
        $('rl-big').onclick = () => { if (!video.src) play(ticked().includes(ctx.cur) ? ctx.cur : (next(ctx.cur, 1) ?? ctx.cur)); else video.play().catch(() => { }) }
        const root = $('rl')
        root.addEventListener('click', e => {
            const tick = e.target.closest('[data-tick]'); if (tick) { const o = off(); tick.checked ? o.delete(tick.dataset.tick) : o.add(tick.dataset.tick); put('cc.reel.off', JSON.stringify([...o])); tick.closest('.rl-item').classList.toggle('off', !tick.checked); $('rl-n').textContent = `${V.length - o.size}/${V.length} no loop`; return }
            const it = e.target.closest('.rl-item'); if (it) { play(+it.dataset.i).catch(er => st('Não tocou · Playback failed: ' + (er.message || er))); return }
            const b = e.target.closest('[data-rl]'); if (!b) return
            const a = b.dataset.rl
            if (a === 'prev') go(-1); else if (a === 'next') go(1)
            else if (a === 'play') { if (!video.src) $('rl-big').onclick(); else toggle() }
            else if (a === 'loop') { put('cc.reel.loop', loopOn() ? 'off' : 'on'); paintLoop() }
            else if (a === 'list') { const h = root.classList.toggle('rl-nolist'); put('cc.reel.list', h ? 'off' : 'on') }
            else if (a === 'fs') { const s = $('rl-scr'); if (document.fullscreenElement) document.exitFullscreen(); else (s.requestFullscreen || s.webkitRequestFullscreen || (() => { })).call(s) }
            else if (a === 'all' || a === 'none') { put('cc.reel.off', JSON.stringify(a === 'all' ? [] : V.map(v => v.id))); paintList() }
        })
        root.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('rl-item')) e.target.click() })
        $('rl-lang').onchange = e => { put('cc.reel.lang', e.target.value); paintList(); play(ctx.cur) }
        if (ctx.keys) document.removeEventListener('keydown', ctx.keys)
        ctx.keys = e => { if (!document.getElementById('rl') || /input|select|textarea/i.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return
            const k = e.key; if (k === ' ') { e.preventDefault(); $('rl-play').click() } else if (k === 'ArrowRight') go(1); else if (k === 'ArrowLeft') go(-1)
            else if (k === 'l' || k === 'L') $('rl-loop').click(); else if (k === 'h' || k === 'H') root.querySelector('[data-rl="list"]').click(); else if (k === 'f' || k === 'F') root.querySelector('[data-rl="fs"]').click() }
        document.addEventListener('keydown', ctx.keys)
        // in a loop, the reel starts by itself (muted: the videos are silent, and browsers only autoplay muted)
        if (loopOn()) { const T = ticked(); if (T.length) play(T.includes(ctx.cur) ? ctx.cur : T[0]).catch(e => st('Não tocou · Playback failed: ' + (e.message || e))) }
        else $('rl-big').hidden = false
    }

    // ---------- BUY NOW: what happens next (Dinis, 12 November): four packages, an infographic each, the tablet ----------
    if (!document.getElementById('cc-buy-css')) { const st = document.createElement('style'); st.id = 'cc-buy-css'; st.textContent = `
.cc-flow button[data-flow="buy"] { color: #10170F !important; background: linear-gradient(180deg, #7CF0C9, #2FBF95) !important; box-shadow: 0 0 20px rgba(67,217,198,.45); }
.cc-flow button[data-flow="buy"][aria-current="page"] { background: linear-gradient(180deg, #FBE2AE, #D9B26E) !important; }
.by { max-width: 1500px; margin: 0 auto; padding: 18px 16px 40px; color: #EAF6F3; font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; }
.by-hd { text-align: center; margin: 6px auto 26px; max-width: 900px; }
.by-hd small { font: 600 13px "Barlow Condensed", sans-serif; letter-spacing: 2.4px; text-transform: uppercase; color: #43D9C6; }
.by-hd h1 { margin: 8px 0 10px; font: 500 clamp(30px, 3.6vw, 50px)/1.05 "Barlow Condensed", sans-serif; letter-spacing: .3px; color: #fff; }
.by-hd h1 em { font-style: normal; color: #FBE2AE; }
.by-hd p { color: #A9C6C1; font-size: 17px; line-height: 1.45; }
.by-arc { display: grid; grid-template-columns: 3fr 1fr; gap: 14px; margin: 0 0 12px; font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.8px; text-transform: uppercase; }
.by-arc span { padding: 7px 12px; border-radius: 999px; text-align: center; border: 1px solid rgba(150,230,215,.25); color: #8EADA8; }
.by-arc span b { color: #EAF6F3; font-weight: 600; }
.by-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; align-items: stretch; }
.by-card { position: relative; display: grid; grid-template-rows: auto auto auto 1fr auto; gap: 12px; padding: 20px 18px 18px; border-radius: 22px; border: 1px solid rgba(150,230,215,.2); background: linear-gradient(180deg, rgba(14,51,48,.55), rgba(4,18,18,.75)); box-shadow: 0 24px 50px rgba(0,0,0,.35); }
.by-card.hot { border-color: rgba(251,226,174,.55); box-shadow: 0 0 0 1px rgba(251,226,174,.25), 0 24px 60px rgba(217,178,110,.18); }
.by-card .rib { position: absolute; top: -11px; left: 18px; padding: 3px 10px; border-radius: 999px; font: 600 11px "Barlow Condensed", sans-serif; letter-spacing: 1.6px; text-transform: uppercase; color: #10170F; background: linear-gradient(180deg, #FBE2AE, #D9B26E); }
.by-card h2 { margin: 0; font: 500 22px/1.1 "Barlow Condensed", sans-serif; color: #fff; letter-spacing: .3px; }
.by-card .pr { font: 500 46px/1 "Barlow Condensed", sans-serif; color: #FBE2AE; } .by-card .pr small { font-size: 15px; color: #8EADA8; letter-spacing: 1px; margin-left: 6px; }
.by-card .lead { color: #CFE3DF; font-size: 15px; line-height: 1.4; }
.by-card svg.ig { width: 100%; height: auto; display: block; margin: 2px 0; }
.by-card ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: 14.5px; color: #CFE3DF; }
.by-card li { display: grid; grid-template-columns: 18px 1fr; gap: 6px; } .by-card li::before { content: "✓"; color: #43D9C6; font-weight: 700; }
.by-card li.tab::before { content: "▣"; color: #FBE2AE; }
.by-cta { display: flex; justify-content: center; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 999px; text-decoration: none; font: 600 15px "Barlow Condensed", sans-serif; letter-spacing: 1.6px; text-transform: uppercase; color: #CFE3DF; border: 1px solid rgba(150,230,215,.35); }
.by-cta:hover { color: #fff; box-shadow: 0 0 0 1px rgba(67,217,198,.6), 0 0 18px rgba(67,217,198,.3); }
.by-cta.buy { color: #10170F; border: 0; background: linear-gradient(180deg, #7CF0C9, #2FBF95); box-shadow: 0 0 22px rgba(67,217,198,.4); }
.by-cta.buy:hover { color: #000; box-shadow: 0 0 30px rgba(67,217,198,.65); }
.by-tab { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 34px; align-items: center; margin: 34px 0 10px; padding: 28px 32px; border-radius: 26px; border: 1px solid rgba(251,226,174,.3); background: radial-gradient(700px 360px at 25% 50%, rgba(67,217,198,.14), transparent 70%), linear-gradient(180deg, rgba(14,51,48,.45), rgba(4,18,18,.8)); }
.by-tab small { font: 600 13px "Barlow Condensed", sans-serif; letter-spacing: 2.4px; text-transform: uppercase; color: #FBE2AE; }
.by-tab h2 { margin: 6px 0 10px; font: 500 38px/1.05 "Barlow Condensed", sans-serif; color: #fff; }
.by-tab p { color: #CFE3DF; font-size: 16px; line-height: 1.5; margin: 0 0 12px; }
.by-tab .chips { display: flex; gap: 8px; flex-wrap: wrap; } .by-tab .chips span { padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(150,230,215,.3); font: 600 12px "Barlow Condensed", sans-serif; letter-spacing: 1.4px; text-transform: uppercase; color: #CFE3DF; }
.by-tab svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 40px 60px rgba(0,0,0,.55)); }
.by-ft { margin-top: 18px; text-align: center; color: #8EADA8; font-size: 13.5px; line-height: 1.5; } .by-ft a { color: #FBE2AE; }
@keyframes bydash { to { stroke-dashoffset: -24; } } .by-card .flow { stroke-dasharray: 5 7; animation: bydash 1.6s linear infinite; }
@keyframes bypulse { 50% { opacity: .35; } } .by-tab .led { animation: bypulse 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .by-card .flow, .by-tab .led { animation: none; } }
@media (max-width: 1200px) { .by-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .by-arc { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .by-grid, .by-tab { grid-template-columns: minmax(0, 1fr); } }
`; document.head.appendChild(st) }
    // an infographic: steps on a line, each a circle with an icon and two short labels; who does it under each (you / agents / a person)
    const ICO = { prompt: 'M4 5h16v11H8l-4 4z', send: 'M3 12l18-8-8 18-2-8z', agents: 'M8 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M12 20c0-3 2-5 4-5s6 2 6 5', person: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-7 8-7s8 3 8 7', doc: 'M6 3h9l4 4v14H6zM9 12h7M9 16h7', talk: 'M4 5h16v10H9l-5 4zM8 9h8', report: 'M5 20V9M10 20V4M15 20v-7M20 20v-11', team: 'M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7z', cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', lock: 'M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3', cut: 'M4 12h16M12 4v16', tune: 'M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6' }
    const ig = steps => { const n = steps.length, W = 300, gap = W / n, y = 46
        return `<svg class="ig" viewBox="0 0 ${W} 112" role="img" aria-label="${esc(steps.map(s => s[1] + ' ' + s[2]).join(', then '))}"><line class="flow" x1="${gap / 2}" y1="${y}" x2="${W - gap / 2}" y2="${y}" stroke="#43D9C6" stroke-width="2" stroke-linecap="round" opacity=".7"/>${steps.map(([ic, a, b, who], i) => { const x = gap / 2 + i * gap, c = who === 'person' ? '#FBE2AE' : who === 'you' ? '#A9C6C1' : '#43D9C6'
            return `<g transform="translate(${x} ${y})"><circle r="21" fill="#04100F" stroke="${c}" stroke-width="2"/><g transform="translate(-9 -9) scale(.75)" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${ICO[ic]}"/></g><text y="-30" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-size="10" letter-spacing="1.2" fill="${c}">${esc((who || 'agents').toUpperCase())}</text><text y="38" text-anchor="middle" font-family="Barlow Semi Condensed, Arial Narrow, sans-serif" font-size="12" fill="#EAF6F3">${esc(a)}</text><text y="52" text-anchor="middle" font-family="Barlow Semi Condensed, Arial Narrow, sans-serif" font-size="12" fill="#8EADA8">${esc(b)}</text></g>` }).join('')}</svg>` }
    const PACKS = [
        { n: 'Agentic', h: 'Your Agent Behaviour Policy', pr: '£500', lead: 'We send you a prompt. You run it on your agent and send back what it finds. Our agents build your Agent Behaviour Policy, a person from our team reviews it, and it comes back to you.',
          ig: [['prompt', 'Our prompt,', 'you run it', 'you'], ['send', 'You send', 'it back', 'you'], ['agents', 'Our agents', 'build the ABP', 'agents'], ['person', 'One of us', 'reviews it', 'person']],
          li: ['The reach, the mandate and the gap of your agent', 'A written note of what changed and why', 'Back in 1 to 3 days from your reply'], cta: ['Buy now', 'https://store.sgit.ai/d/t3/', 1] },
        { n: 'Agentic setup', h: 'Two sessions, a report', pr: '£1,500', lead: 'One hour with you to understand what you run. Our agents and swarms do the work. One hour to present the report and your policies.',
          ig: [['talk', '1 hour:', 'we listen', 'person'], ['agents', 'Our swarms', 'do the work', 'agents'], ['report', 'The report', 'is written', 'agents'], ['talk', '1 hour:', 'we present', 'person']],
          li: ['Agent Behaviour Policies for what you run', 'The report, presented in the second session', 'Your own agentic team'], cta: ['Book it', 'https://riskmandate.ai/pricing.html'] },
        { n: 'Two days', h: 'Understand, then deliver', pr: '£5,000', hot: 'With the tablet', lead: 'We spend a day with you to understand your agents and how they reach your systems. A second day to create and deliver, with more time to prepare the materials.',
          ig: [['cal', 'Day 1:', 'understand', 'person'], ['agents', 'Our swarms', 'prepare', 'agents'], ['cal', 'Day 2:', 'create, deliver', 'person']],
          li: ['Everything in the two sessions, in depth', 'Your own agentic team', 'The RiskMandate tablet, if you want it'], tab: 1, cta: ['Talk to us', 'https://riskmandate.ai/pricing.html'] },
        { n: 'Forward engineering', h: 'Reduce the reach', pr: '£20,000', lead: 'We work with you on enforcement: we cut the reach of your agents with proper controls, shrink the environment they run in, and shape the agentic team around you.',
          ig: [['shield', 'The reach,', 'mapped', 'agents'], ['cut', 'Cut it', 'with controls', 'person'], ['lock', 'Enforced', 'and tested', 'agents'], ['tune', 'A team', 'made for you', 'person']],
          li: ['Enforcement, not only policy', 'A smaller environment, with proper controls', 'An agentic team customised to you', 'The RiskMandate tablet, if you want it'], tab: 1, cta: ['Talk to us', 'https://riskmandate.ai/pricing.html'] }]
    // the RiskMandate tablet: a product shot drawn in SVG (the Universe on its screen, the mark on the back edge)
    const TABLET = `<svg viewBox="0 0 640 460" role="img" aria-label="The RiskMandate tablet: an iPad or Android tablet with the agentic team configured">
<defs><linearGradient id="tb-b" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3B4746"/><stop offset=".5" stop-color="#1B2322"/><stop offset="1" stop-color="#0B1110"/></linearGradient>
<radialGradient id="tb-s" cx=".45" cy=".45" r=".8"><stop offset="0" stop-color="#0E3330"/><stop offset=".7" stop-color="#061716"/><stop offset="1" stop-color="#030A0A"/></radialGradient>
<linearGradient id="tb-g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<g transform="translate(320 236) rotate(-6) translate(-280 -190)">
<rect x="10" y="14" width="560" height="380" rx="34" fill="#000" opacity=".35" transform="translate(14 22)"/>
<rect x="0" y="0" width="560" height="380" rx="34" fill="url(#tb-b)" stroke="#5E6D6B" stroke-width="1.5"/>
<rect x="18" y="18" width="524" height="344" rx="20" fill="url(#tb-s)"/>
<circle cx="280" cy="10" r="2.6" fill="#0A0F0F" stroke="#4A5857"/>
<g transform="translate(280 190)">
<circle r="118" fill="none" stroke="#43D9C6" stroke-opacity=".18"/><circle r="78" fill="none" stroke="#43D9C6" stroke-opacity=".28" stroke-dasharray="3 6"/>
<g stroke="#43D9C6" stroke-opacity=".5" stroke-width="1.2"><line x1="0" y1="0" x2="-96" y2="-60"/><line x1="0" y1="0" x2="104" y2="-44"/><line x1="0" y1="0" x2="-70" y2="84"/><line x1="0" y1="0" x2="88" y2="76"/><line x1="0" y1="0" x2="10" y2="-112"/></g>
<circle r="26" fill="#04100F" stroke="#FBE2AE" stroke-width="2"/><text y="6" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-size="19" fill="#FBE2AE">RM</text>
<g font-family="Barlow Condensed, sans-serif" font-size="11" letter-spacing="1" fill="#CFE3DF">
<circle cx="-96" cy="-60" r="9" fill="#2ED48C"/><text x="-96" y="-76" text-anchor="middle">CONDUCTOR</text>
<circle cx="104" cy="-44" r="9" fill="#A877FF"/><text x="104" y="-60" text-anchor="middle">SECURITY</text>
<circle cx="-70" cy="84" r="9" fill="#FF8A3D"/><text x="-70" y="108" text-anchor="middle">DEV</text>
<circle cx="88" cy="76" r="9" fill="#FFD23F"/><text x="88" y="100" text-anchor="middle">REVIEW</text>
<circle cx="10" cy="-112" r="7" fill="#43D9C6"/></g></g>
<g font-family="Barlow Condensed, sans-serif"><text x="40" y="52" font-size="13" letter-spacing="2" fill="#43D9C6">YOUR AGENTIC TEAM</text><text x="40" y="74" font-size="22" fill="#fff">4 agents · 4 policies</text>
<rect x="404" y="36" width="116" height="30" rx="15" fill="rgba(46,212,140,.15)" stroke="#2ED48C"/><circle class="led" cx="422" cy="51" r="5" fill="#2ED48C"/><text x="434" y="56" font-size="13" letter-spacing="1.4" fill="#2ED48C">ENFORCED</text>
<text x="40" y="340" font-size="12" letter-spacing="1.6" fill="#8EADA8">REACH 12 · MANDATE 9 · GAP 3, EACH WITH A BARRIER</text></g>
<rect x="0" y="0" width="560" height="380" rx="34" fill="url(#tb-g)"/></g>
<g font-family="Barlow Condensed, sans-serif" text-anchor="middle"><text x="320" y="446" font-size="14" letter-spacing="4" fill="#8EADA8">RISKMANDATE · TABLET</text></g></svg>`
    X.views.buy = { label: 'Buy now', icon: 'flag', render: () => `<section class="by">
<header class="by-hd"><small>RiskMandate · what happens next</small><h1>You have seen RiskMandate in action. <em>What is your next step?</em></h1><p>Four ways to start, from a policy for one agent to fewer things your agents can reach. Every level writes your Agent Behaviour Policy: what your agents can do, what you authorised, and the gap between the two.</p></header>
<div class="by-arc"><span><b>Understand and contain:</b> see the reach, name it, put a policy on it</span><span><b>Reduce:</b> cut the reach itself</span></div>
<div class="by-grid">${PACKS.map(p => `<article class="by-card${p.hot ? ' hot' : ''}">${p.hot ? `<span class="rib">${esc(p.hot)}</span>` : ''}<div><small style="font:600 12px 'Barlow Condensed',sans-serif;letter-spacing:1.8px;text-transform:uppercase;color:#43D9C6">${esc(p.n)}</small><h2>${esc(p.h)}</h2></div><div class="pr">${esc(p.pr)}</div>${ig(p.ig)}<div style="display:grid;gap:12px;align-content:start"><p class="lead">${esc(p.lead)}</p><ul>${p.li.map(x => `<li class="${/tablet/.test(x) ? 'tab' : ''}">${esc(x)}</li>`).join('')}</ul></div><a class="by-cta${p.cta[2] ? ' buy' : ''}" href="${esc(p.cta[1])}" target="_blank" rel="noopener">${esc(p.cta[0])} ↗</a></article>`).join('')}</div>
<section class="by-tab"><div>${TABLET}</div><div><small>With the £5,000 and £20,000 packages</small><h2>The RiskMandate tablet</h2><p>An appliance, ready on the day: your agentic team configured on an iPad or an Android tablet, with its policies, its keys and the views you saw here. Hand it to your security team and they can watch the agents and their policies from the first minute.</p><div class="chips"><span>iPad or Android</span><span>Your agentic team, configured</span><span>Your policies on it</span></div></div></section>
<p class="by-ft">Prices in pounds. The £500 package is paid through its standing payment link at <a href="https://store.sgit.ai/d/t3/" target="_blank" rel="noopener">store.sgit.ai</a>; the others start with a conversation. <a href="https://riskmandate.ai/pricing.html" target="_blank" rel="noopener">The levels in full on riskmandate.ai ↗</a></p></section>` }
})()
