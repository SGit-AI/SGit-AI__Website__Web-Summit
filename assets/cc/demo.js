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
.cc-web .bar a { color: #FBE2AE; text-decoration: none; } .cc-web .bar a:hover { color: #fff; }
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
    const web = (id, label, url, title) => { X.views[id] = { label, icon: 'flag', render: () => `<section class="cc-web"><div class="bar"><span>${esc(label)} · ${esc(url.replace(/^https:\/\//, '').replace(/\/$/, ''))}</span><a href="${esc(url)}" target="_blank" rel="noopener">Abrir numa janela ↗</a></div><iframe src="${esc(url)}" title="${esc(title)}" loading="lazy" referrerpolicy="no-referrer" allow="fullscreen; autoplay"></iframe></section>` } }
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
})()
