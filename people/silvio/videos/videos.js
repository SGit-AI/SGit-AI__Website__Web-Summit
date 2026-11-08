// The team's video library (people/silvio/videos/): draws every approved video from the team's videos vault, in the
// browser, with the vault's published read key. By video@web-summit.silvio, 8 November 2026.
// Small files (library.json, posters) are read through the vault's read API. Large files (the videos) go through the
// vault's presigned links, as SG/Vault's own app does; if the storage does not yet allow this site's origin, Watch and
// Download open the file's vault in SG/Vault instead, where it plays and has a Save button. Nothing is sent anywhere.
(() => {
  'use strict'
  const box = document.getElementById('vl'); if (!box) return
  const $ = id => document.getElementById(id)
  const cfg = { endpoint: box.dataset.endpoint, vault_id: box.dataset.vault, read_key: box.dataset.key.replace(/^sgit_public_read_/, '') }
  const APP = box.dataset.app
  const CH = [['all', 'All'], ['linkedin', 'LinkedIn'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['stand', 'The stand screen']]
  const h = (tag, attrs = {}, kids = []) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'text') e.textContent = v; else if (k === 'on') e.addEventListener('click', v); else e.setAttribute(k, v) } for (const c of [].concat(kids)) if (c) e.append(c); return e }
  const icon = d => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('width', '14'); s.setAttribute('height', '14'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '2.2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true'); const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); s.append(p); return s }
  const I = { play: 'M7 4l13 8-13 8z', down: 'M12 4v11M7 11l5 5 5-5M5 20h14', share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M8 7l4-4 4 4', copy: 'M9 9h10v10H9zM5 15V5h10' }
  const status = t => { $('vl-status').textContent = t || ''; $('vl-status').hidden = !t }
  let R = null, LIB = null, channel = 'all'
  const blobs = new Map()
  async function open() {
    if (!window.SGVaultEmbed) throw new Error('the vault reader did not load')
    R = await new window.SGVaultEmbed.Reader(cfg).init()
    const raw = R.raw.bind(R)
    R.raw = async function (p) {   // large objects: the vault's presigned link, as SG/Vault does
      try { return await raw(p) } catch (e) {
        if (!/^bare\/data\//.test(p)) throw e
        const j = await (await fetch(this.endpoint + '/api/vault/presigned/read-url/' + this.vaultId + '/' + p)).json()
        const r = await fetch(j.url); if (!r.ok) throw new Error('storage ' + r.status)
        return new Uint8Array(await r.arrayBuffer())
      }
    }
    await R.open()
    LIB = JSON.parse(await R.readText('library.json'))
  }
  const mime = p => /\.mp4$/.test(p) ? 'video/mp4' : /\.html$/.test(p) ? 'text/html' : /\.jpe?g$/.test(p) ? 'image/jpeg' : 'application/octet-stream'
  async function blobOf(p) { if (!blobs.has(p)) blobs.set(p, R.readBytes(p).then(b => new Blob([b], { type: mime(p) })).catch(e => { blobs.delete(p); throw e })); return blobs.get(p) }
  const fname = p => p.split('/').pop()
  function modal(kids) { const m = h('div', { class: 'vl-modal', role: 'dialog', 'aria-modal': 'true' }, [h('button', { class: 'close', text: 'Close', on: () => m.remove() }), ...kids]); m.addEventListener('click', e => { if (e.target === m) m.remove() }); document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { m.remove(); document.removeEventListener('keydown', k) } }); document.body.append(m); m.querySelector('.close').focus(); return m }
  function fallback(f, why) {
    modal([h('p', { text: `This file opens in the team's vault (${why}). There it plays, and its Save button downloads it: folder ${f.path.split('/')[0]}, file ${fname(f.path)}.` }), h('a', { class: 'btn play', href: APP, target: '_blank', rel: 'noopener', text: 'Open the vault' })])
  }
  async function busy(btn, label, work) { const t = btn.lastChild, old = t.textContent; btn.disabled = true; t.textContent = ' ' + label; try { await work() } finally { btn.disabled = false; t.textContent = old } }
  async function watch(f, btn) {
    if (!/\.mp4$/.test(f.path)) return download(f, btn)
    await busy(btn, 'Loading…', async () => {
      try { const b = await blobOf(f.path); const u = URL.createObjectURL(b); const v = h('video', { controls: '', autoplay: '', playsinline: '', src: u }); const m = modal([v]); new MutationObserver((_, o) => { if (!document.body.contains(m)) { v.pause(); URL.revokeObjectURL(u); o.disconnect() } }).observe(document.body, { childList: true }) }
      catch (e) { fallback(f, 'your browser could not fetch it here') }
    })
  }
  async function download(f, btn) {
    await busy(btn, 'Fetching…', async () => {
      try { const b = await blobOf(f.path); const u = URL.createObjectURL(b); const a = h('a', { href: u, download: fname(f.path) }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000) }
      catch (e) { fallback(f, 'your browser could not fetch it here') }
    })
  }
  async function share(v, f, btn) {
    await busy(btn, 'Preparing…', async () => {
      const text = f.lang === 'pt' ? v.post_pt : v.post_en
      try { const b = await blobOf(f.path); const file = new File([b], fname(f.path), { type: mime(f.path) }); if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text, title: v.title }); return } }
      catch (e) { if (e && e.name === 'AbortError') return }
      try { await navigator.clipboard.writeText(text) } catch { }
      fallback(f, 'this device cannot share a file from the page; the post text is copied')
    })
  }
  async function copy(text, btn) { try { await navigator.clipboard.writeText(text); const o = btn.lastChild.textContent; btn.lastChild.textContent = ' Copied'; setTimeout(() => { btn.lastChild.textContent = o }, 1600) } catch { btn.lastChild.textContent = ' Select the text below' } }
  const canShareFiles = !!(navigator.canShare && (() => { try { return navigator.canShare({ files: [new File(['x'], 'x.mp4', { type: 'video/mp4' })] }) } catch { return false } })())
  const btn = (cls, ic, label, fn) => { const b = h('button', { type: 'button', class: cls }, [icon(ic), document.createTextNode(' ' + label)]); b.addEventListener('click', () => fn(b)); return b }
  function card(v) {
    const img = h('img', { alt: 'A frame of ' + v.title, loading: 'lazy' })
    blobOf(v.poster).then(b => { img.src = URL.createObjectURL(b) }).catch(() => { })
    const text = h('div', { class: 'text' }, [h('h5', { text: 'ENGLISH' }), h('pre', { text: v.post_en }), h('h5', { text: 'PORTUGUÊS' }), h('pre', { text: v.post_pt })])
    const mp4 = v.files.filter(f => /\.mp4$/.test(f.path))
    const row = (label, list, make) => list.length ? h('div', { class: 'file' }, [h('span', { class: 'fl', text: label }), h('span', { class: 'fb' }, list.map(make))]) : null
    const files = [
      row('Watch', mp4, f => btn('play', I.play, f.label, b => watch(f, b))),
      row('Download', v.files, f => btn('', I.down, f.label, b => download(f, b))),
      canShareFiles ? row('Share', mp4, f => btn('', I.share, f.label, b => share(v, f, b))) : null]
    const tags = [...v.formats, ...new Set(v.files.filter(f => f.lang !== 'all').map(f => f.lang.toUpperCase()))]
    return h('article', {}, [
      h('div', { class: 'thumb' }, [img, h('span', { class: 'len', text: v.length })]),
      h('div', { class: 'body' }, [h('p', { class: 'aud', text: v.audience }), h('h4', { text: v.title }), h('p', { class: 'shows', text: v.shows }),
        h('div', { class: 'tags' }, tags.map(t => h('span', { text: t }))),
        h('div', { class: 'files' }, files),
        h('div', { class: 'file' }, [h('span', { class: 'fl', text: 'Post text' }), h('span', { class: 'fb' }, [btn('post', I.copy, 'Copy EN', b => copy(v.post_en, b)), btn('post', I.copy, 'Copy PT', b => copy(v.post_pt, b)), h('button', { type: 'button', class: '', text: 'Show', on: e => { text.classList.toggle('open'); e.target.textContent = text.classList.contains('open') ? 'Hide' : 'Show' } })])]),
        text])])
  }
  function draw() {
    const list = LIB.videos.filter(v => channel === 'all' || v.channels.includes(channel))
    $('vl-count').textContent = list.length + (list.length === 1 ? ' video' : ' videos')
    $('vl-ch').replaceChildren(...CH.map(([k, l]) => h('button', { type: 'button', class: k === channel ? 'on' : '', 'aria-pressed': String(k === channel), text: l, on: () => { channel = k; draw() } })))
    $('vl-list').replaceChildren(...LIB.sections.map(s => { const items = list.filter(v => v.section === s.id); return items.length ? h('section', {}, [h('div', { class: 'h' }, [h('h3', { text: s.title }), h('p', { text: s.sub })]), h('div', { class: 'grid' }, items.map(card))]) : null }).filter(Boolean))
  }
  const start = () => open().then(() => { status(''); draw() }).catch(e => { status(''); $('vl-list').replaceChildren(h('p', { text: 'Could not open the videos vault here (' + e.message + '). ' }, [h('a', { href: APP, text: 'Open it in SG/Vault' })])) })
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
})()
