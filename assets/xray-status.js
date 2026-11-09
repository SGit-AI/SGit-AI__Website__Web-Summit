// The X-ray requests from the booth (WS-194, dev@web-summit.silvio, 8 November 2026, at Silvio's word): reads
// data/xray/jobs/index.json (kept by xray@web-summit.dinis with admin/tools/xray-jobs.mjs) and shows one line per job,
// newest first, with its state and, when ready, its link. Refreshes every minute; reads only this site's own data.
(() => {
    'use strict'
    const pre = [...document.querySelectorAll('pre')].find(p => /^\s*$/.test(p.textContent) && p.querySelector('code.language-xray-status')) || document.querySelector('code.language-xray-status')
    const host = document.createElement('div'); host.className = 'xs'
    const anchor = pre && (pre.closest('pre') || pre)
    if (anchor) anchor.replaceWith(host); else (document.querySelector('main') || document.body).appendChild(host)
    const up = document.body.dataset.up || '../../'
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const ago = at => { const t = Date.parse(at || ''); if (isNaN(t)) return ''; const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC' }
    const STATES = ['queued', 'running', 'ready', 'failed', 'refused']
    const css = `.xs{display:grid;gap:10px;margin:16px 0}.xs-sum{display:flex;flex-wrap:wrap;gap:8px;font-size:.9em}.xs-sum span{padding:2px 10px;border-radius:999px;border:1px solid currentColor;opacity:.85}
.xs-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:baseline;padding:10px 12px;border:1px solid rgba(127,127,127,.35);border-radius:8px}
.xs-row b{font-size:1.05em;overflow-wrap:anywhere}.xs-st{font-size:.8em;font-weight:600;padding:2px 10px;border-radius:999px;white-space:nowrap}
.xs-meta{grid-column:1/-1;font-size:.85em;opacity:.8}.xs-st.queued{background:rgba(160,120,20,.18)}.xs-st.running{background:rgba(40,90,200,.18)}.xs-st.ready{background:rgba(30,140,80,.22)}.xs-st.failed,.xs-st.refused{background:rgba(180,40,40,.18)}
.xs-empty{opacity:.8}`
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st)
    async function load() {
        let j = null
        try { const r = await fetch(`${up}data/xray/jobs/index.json`, { cache: 'no-store' }); j = r.ok ? await r.json() : null } catch { j = null }
        const jobs = ((j && j.jobs) || []).filter(x => x && x.subject).sort((a, b) => String(b.requested_at || '').localeCompare(String(a.requested_at || '')))
        if (!j) { host.innerHTML = '<p class="xs-empty">The request list could not be loaded. Check the connection and wait a minute.</p>'; return }
        if (!jobs.length) { host.innerHTML = `<p class="xs-empty">No requests yet. Request one from <a href="${up}xray/index.html">the X-ray</a>: type a name that is not ready and press Request.</p>`; return }
        const count = STATES.map(s => [s, jobs.filter(x => x.state === s).length]).filter(([, n]) => n)
        host.innerHTML = `<div class="xs-sum" aria-label="Summary">${count.map(([s, n]) => `<span>${n} ${esc(s)}</span>`).join('')}<span>updated ${esc(ago(j.updated))}</span></div>` +
            jobs.map(x => `<div class="xs-row"><b>${x.state === 'ready' && /^[a-z0-9-]+$/.test(x.slug || '') ? `<a href="${up}xray/${esc(x.slug)}/index.html">${esc(x.subject)}</a>` : esc(x.subject)}</b><span class="xs-st ${STATES.includes(x.state) ? esc(x.state) : ''}">${esc(x.state || '?')}</span><span class="xs-meta">Requested ${esc(ago(x.requested_at))}${x.ready_at ? ` · ready ${esc(ago(x.ready_at))}` : x.started_at ? ` · started ${esc(ago(x.started_at))}` : ''}${x.note ? ` · ${esc(x.note)}` : ''}</span></div>`).join('')
    }
    load(); setInterval(load, 60000)
})()
