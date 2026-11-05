// The history, read once per build (dev@web-summit.dinis, 5 November 2026, WS-65): eight modules each ran their own
// `git log` over the whole history for the same commits, about a second of a 3.6 s build. Each now filters this list.
// One record per commit, newest first: sha, at (committer date, ISO), t (ms), an (author), s (subject), b (body, trimmed).
// `since` filters as git's --since does, on the committer date; a string without a zone is local time, as git reads it.
import { execFileSync } from 'child_process'

let memo = null
export function history(root) {
    return memo ??= (() => {
        try {
            return execFileSync('git', ['log', '--format=%H%x1f%cI%x1f%an%x1f%s%x1f%b%x1e'], { cwd: root, maxBuffer: 256 << 20 }).toString()
                .split('\x1e').map(r => r.replace(/^\n/, '')).filter(r => r.trim()).map(r => {
                    const [sha, at, an, s, b = ''] = r.split('\x1f')
                    return { sha, at, t: Date.parse(at), an, s, b: b.trim() }
                })
        } catch { return [] }
    })()
}
export const since = (root, when) => { const from = typeof when === 'number' ? when : Date.parse(when); return history(root).filter(c => c.t >= from) }
