/**
 * ws-shared — the small things every web-summit component needs: escaping, times, and links that say where they go.
 *
 * Dinis, 5 November: "give the user a preview of what's happening ... a little icon ... the GitHub icon, because I
 * now know that's going to open up in GitHub". linkTo() marks every link with where it goes (GitHub, another site,
 * this site) and puts the full address in its title, so a hover previews it.
 *
 * @module ws-shared
 * @version 0.1.0
 */
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export const ago = t => {
    if (!t) return 'never'
    const m = Math.round((Date.now() - new Date(t)) / 6e4)
    return m < 60 ? `${Math.max(1, m)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`
}
export const hhmm = t => new Date(t).toISOString().slice(11, 16)

export const ICONS = Object.freeze({
    github   : '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
    external : '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M6 3H3v10h10v-3M9 2h5v5M14 2 7 9"/></svg>',
    site     : '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="none" stroke="currentColor" stroke-width="1.4" d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"/></svg>',
})

// where a link goes: 'github', 'external' or 'site'; the label it shows next to the icon
export const destination = url => {
    let u
    try { u = new URL(url, location.href) } catch { return { kind: 'site', host: '' } }
    if (u.host === 'github.com') return { kind: 'github', host: 'GitHub', path: u.pathname }
    if (u.host !== location.host) return { kind: 'external', host: u.host.replace(/^www\./, ''), path: u.pathname }
    return { kind: 'site', host: 'this site', path: u.pathname }
}

export const linkTo = (url, label, cls = '') => {
    const d = destination(url), external = d.kind !== 'site'
    const full = new URL(url, location.href).href
    return `<a class="ws-link ws-${d.kind}${cls ? ' ' + cls : ''}" href="${esc(url)}"${external ? ' target="_blank" rel="noopener"' : ''} title="Opens ${esc(d.host)}: ${esc(full)}">${ICONS[d.kind]}<span>${esc(label)}</span>${external && d.kind !== 'github' ? `<small>${esc(d.host)}</small>` : ''}</a>`
}

// "{repo}" style templates, filled from a card's params; a missing param leaves the template visibly unfilled
export const fill = (t, p) => String(t || '').replace(/\{([a-z_]+)\}/g, (m, k) => p && p[k] != null && p[k] !== '' ? p[k] : m)
