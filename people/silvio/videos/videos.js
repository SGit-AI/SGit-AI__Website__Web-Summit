// The team's video library (people/silvio/videos/): draws every approved video from the team's videos vault, in the
// browser, with the vault's published read key. By video@web-summit.silvio, 8 November 2026 (redrawn the same evening at
// Silvio's word: one language picker and three buttons per video, cards aligned).
// Small files (library.json, posters) are read through the vault's read API. Watch and Download open SG/Vault's own embed
// at the file's player page in the vault (play/<name>.html), which plays it and saves it with the vault's consent bar.
// If this site can one day fetch the storage itself, the videos go through the vault's presigned
// links, as SG/Vault's own app does. On load the page checks once whether the vault's storage lets this site fetch them:
// if yes, Watch plays in the page and Download saves the file; if not yet, both say so and open the team's vault in a
// new tab (where each file plays and has a Save button), naming the folder and the file. Nothing is sent anywhere.
(() => {
  'use strict'
  const box = document.getElementById('vl'); if (!box) return
  const $ = id => document.getElementById(id)
  const cfg = { endpoint: box.dataset.endpoint, vault_id: box.dataset.vault, read_key: box.dataset.key.replace(/^sgit_public_read_/, '') }
  const APP = box.dataset.app
  const CH = [['all', 'All'], ['linkedin', 'LinkedIn'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['stand', 'The stand screen']]
  const h = (tag, attrs = {}, kids = []) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'text') e.textContent = v; else if (k === 'on') e.addEventListener('click', v); else if (v !== false && v != null) e.setAttribute(k, v) } for (const c of [].concat(kids)) if (c) e.append(c); return e }
  const svg = d => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); for (const [k, v] of Object.entries({ width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' })) s.setAttribute(k, v); const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); s.append(p); return s }
  const I = { play: 'M7 4l13 8-13 8z', down: 'M12 4v11M7 11l5 5 5-5M5 20h14', share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M8 7l4-4 4 4', copy: 'M9 9h10v10H9zM5 15V5h10', out: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5' }
  let R = null, LIB = null, channel = 'all', inPage = false
  const blobs = new Map()
  const presigned = async p => { const j = await (await fetch(cfg.endpoint + '/api/vault/presigned/read-url/' + cfg.vault_id + '/' + p)).json(); const r = await fetch(j.url); if (!r.ok) throw new Error('storage ' + r.status); return new Uint8Array(await r.arrayBuffer()) }
  async function open() {
    if (!window.SGVaultEmbed) throw new Error('the vault reader did not load')
    R = await new window.SGVaultEmbed.Reader(cfg).init()
    const raw = R.raw.bind(R)
    R.raw = async function (p) { try { return await raw(p) } catch (e) { if (!/^bare\/data\//.test(p) || !inPage) throw e; return presigned(p) } }
    await R.open()
    LIB = JSON.parse(await R.readText('library.json'))
    // can this site fetch through the presigned links? one small object (a poster) answers it
    try { const id = R.files[LIB.videos[0].poster]; await presigned('bare/data/' + id); inPage = true } catch { inPage = false }
  }
  const mime = p => /\.mp4$/.test(p) ? 'video/mp4' : /\.html$/.test(p) ? 'text/html' : /\.jpe?g$/.test(p) ? 'image/jpeg' : 'application/octet-stream'
  async function blobOf(p) { if (!blobs.has(p)) blobs.set(p, R.readBytes(p).then(b => new Blob([b], { type: mime(p) })).catch(e => { blobs.delete(p); throw e })); return blobs.get(p) }
  const fname = p => p.split('/').pop()
  function modal(title, kids, onClose) {
    const close = h('button', { type: 'button', class: 'vl-x', text: 'Close' })
    const m = h('div', { class: 'vl-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, [h('div', { class: 'vl-box' }, [h('div', { class: 'vl-top' }, [h('strong', { text: title }), close]), ...kids])])
    const done = () => { m.querySelectorAll('video').forEach(v => { v.pause(); if (v.src.startsWith('blob:')) URL.revokeObjectURL(v.src) }); m.remove(); document.removeEventListener('keydown', esc); if (onClose) onClose() }
    const esc = e => { if (e.key === 'Escape') done() }
    close.addEventListener('click', done); m.addEventListener('click', e => { if (e.target === m) done() }); document.addEventListener('keydown', esc)
    document.body.append(m); close.focus()
  }
  // Watch / Download without leaving the page: SG/Vault's own embed (its origin can fetch the vault's storage), opened at
  // the file's small player page in the vault (library.json: player), which reads the video through the vault app bridge.
  const SGV = 'https://dev.vault.sgraph.ai'
  const KEY = box.dataset.key + ':' + cfg.vault_id
  function embed(title, deepLink, hint) {
    const fr = h('iframe', { class: 'vl-frame', title: title, allow: 'autoplay; fullscreen', src: SGV + '/en-gb/app/?embed=1&parent=' + encodeURIComponent(location.origin) })
    const note = h('p', { class: 'vl-note', text: hint || '' })
    const onMsg = e => { if (e.source !== fr.contentWindow || e.origin !== SGV || !e.data) return
      if (e.data.sg === 'vault-embed-ready') fr.contentWindow.postMessage({ sg: 'vault-open', key: KEY, mode: 'vault', deepLink }, SGV)
      if (e.data.sg === 'vault-error') note.textContent = 'The vault could not open here. Open it in a new tab: ' + APP }
    addEventListener('message', onMsg)
    modal(title, [fr, note], () => removeEventListener('message', onMsg))
  }
  async function busy(b, label, work) { const t = b.querySelector('span'), old = t.textContent; b.disabled = true; t.textContent = label; try { await work() } catch (e) { t.textContent = 'Could not load'; setTimeout(() => { t.textContent = old }, 2500); return } finally { b.disabled = false } t.textContent = old }
  const button = (cls, ic, label, fn) => { const b = h('button', { type: 'button', class: cls }, [svg(ic), h('span', { text: label })]); b.addEventListener('click', () => fn(b)); return b }
  const link = (cls, ic, label) => h('a', { class: 'btn ' + cls, href: APP, target: '_blank', rel: 'noopener' }, [svg(ic), h('span', { text: label })])
  async function copy(text, b) { const t = b.querySelector('span'), old = t.textContent; try { await navigator.clipboard.writeText(text); t.textContent = 'Copied' } catch { t.textContent = 'Use Show text' } setTimeout(() => { t.textContent = old }, 1600) }
  const canShareFiles = !!(navigator.canShare && (() => { try { return navigator.canShare({ files: [new File(['x'], 'x.mp4', { type: 'video/mp4' })] }) } catch { return false } })())
  function card(v) {
    const img = h('img', { alt: 'A frame of ' + v.title, loading: 'lazy' })
    blobOf(v.poster).then(b => { img.src = URL.createObjectURL(b) }).catch(() => { })
    const vids = v.files.filter(f => /\.mp4$/.test(f.path)), extra = v.files.filter(f => !/\.mp4$/.test(f.path))
    let cur = vids[0]
    const textOf = () => (cur.lang === 'pt' ? v.post_pt : v.post_en)
    const where = h('p', { class: 'where' })
    const pre = h('pre', { text: textOf() }), textBox = h('div', { class: 'text' }, [pre])
    const setWhere = () => { where.textContent = ''; pre.textContent = textOf() }
    const picker = vids.length > 1 ? h('label', { class: 'pick' }, [h('span', { text: vids.some(f => /Square|16:9/.test(f.label)) ? 'Format' : 'Language' }),
      (() => { const s = h('select', {}, vids.map((f, i) => h('option', { value: i, text: f.label }))); s.addEventListener('change', () => { cur = vids[+s.value]; setWhere() }); return s })()]) : h('p', { class: 'one', text: vids[0].label === 'EN' ? 'English' : vids[0].label })
    const actions = inPage ? [
      button('play', I.play, 'Watch', b => busy(b, 'Loading…', async () => { const u = URL.createObjectURL(await blobOf(cur.path)); modal(v.title + ' (' + cur.label + ')', [h('video', { controls: '', autoplay: '', playsinline: '', src: u })]) })),
      button('', I.down, 'Download', b => busy(b, 'Fetching…', async () => { const u = URL.createObjectURL(await blobOf(cur.path)); const a = h('a', { href: u, download: fname(cur.path) }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000) })),
      canShareFiles ? button('', I.share, 'Share', b => busy(b, 'Preparing…', async () => { const f = new File([await blobOf(cur.path)], fname(cur.path), { type: 'video/mp4' }); try { await navigator.share({ files: [f], text: textOf(), title: v.title }) } catch (e) { if (e.name !== 'AbortError') throw e } })) : null
    ] : [button('play', I.play, 'Watch', () => embed(v.title + ' (' + cur.label + ')', cur.player || cur.path)), button('', I.down, 'Download', () => embed(v.title + ' (' + cur.label + ')', cur.player || cur.path, 'To save it: press Download under the video, then confirm Download in the bar at the top.'))]
    const toggle = h('button', { type: 'button', class: 'ghost', text: 'Show text' }); toggle.addEventListener('click', () => { textBox.classList.toggle('open'); toggle.textContent = textBox.classList.contains('open') ? 'Hide text' : 'Show text' })
    setWhere()
    return h('article', {}, [
      h('div', { class: 'thumb' }, [img, h('span', { class: 'len', text: v.length })]),
      h('div', { class: 'body' }, [
        h('p', { class: 'aud', text: v.audience }), h('h4', { text: v.title }), h('p', { class: 'shows', text: v.shows }),
        h('div', { class: 'ctl' }, [
          h('div', { class: 'row1' }, [picker, h('span', { class: 'fmt', text: v.formats.join(' · ') })]),
          h('div', { class: 'acts' }, actions),
          where,
          h('div', { class: 'acts' }, [button('post', I.copy, 'Copy text', b => copy(textOf(), b)), toggle]),
          textBox,
          extra.length ? h('div', { class: 'extra' }, extra.map(f => inPage ? button('ghost', I.down, f.label, b => busy(b, 'Fetching…', async () => { const u = URL.createObjectURL(await blobOf(f.path)); const a = h('a', { href: u, download: fname(f.path) }); document.body.append(a); a.click(); a.remove() })) : button('ghost', I.play, f.label, () => embed(f.label, f.path)))) : null
        ])])])
  }
  function draw() {
    const list = LIB.videos.filter(v => channel === 'all' || v.channels.includes(channel))
    $('vl-count').textContent = list.length + (list.length === 1 ? ' video' : ' videos')
    $('vl-ch').replaceChildren(...CH.map(([k, l]) => h('button', { type: 'button', class: k === channel ? 'on' : '', 'aria-pressed': String(k === channel), text: l, on: () => { channel = k; draw() } })))
    $('vl-list').replaceChildren(...LIB.sections.map(s => { const items = list.filter(v => v.section === s.id); return items.length ? h('section', {}, [h('div', { class: 'h' }, [h('h3', { text: s.title }), h('p', { text: s.sub })]), h('div', { class: 'grid' }, items.map(card))]) : null }).filter(Boolean))
    $('vl-status').textContent = ''
    $('vl-status').hidden = true
  }
  const start = () => open().then(draw).catch(e => { $('vl-status').textContent = ''; $('vl-list').replaceChildren(h('p', { text: 'Could not open the videos vault here (' + e.message + '). ' }, [h('a', { href: APP, text: 'Open it in SG/Vault' })])) })
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
})()
