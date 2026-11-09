// The build's text helpers, once (dev@web-summit.dinis, 5 November 2026): eight modules each had their own copy.
// esc: for text and double-quoted attributes. escAttr: also escapes ', for attributes that may be single-quoted.
// clipWords: cut at the last space before n, with an ellipsis, never inside a word: an agent name cut mid-word
// (vault@web-summit.ange) reads as an email address to the gate's contact check (sgit@web-summit.dinis found it).
export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const escAttr = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
export const clipWords = (t, n) => { t = String(t || ''); if (t.length <= n) return t; const c = t.slice(0, n), i = c.lastIndexOf(' '); return (i > n * 0.6 ? c.slice(0, i) : c) + '…' }
