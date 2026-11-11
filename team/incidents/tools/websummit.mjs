#!/usr/bin/env node
// Web Summit's own channels, watched for the decision everyone waits for (incident.dev@web-summit.dinis, 10 November 2026, WS-214;
// incident.researcher@'s parser asks in decisions/sources.json: websummit-sitemap, websummit-bluesky). Just the part that matters:
//   sitemap  https://websummit.com/sitemap.xml: the set of <loc> URLs only (lastmod is unreliable: some entries carry the request
//            time); every URL not seen before is recorded with the time we first saw it, and flagged if it matches WATCH
//   bluesky  the organisers' public feed (public.api.bsky.app, no login): the last 10 own posts (no reposts), time, text, link;
//            flagged if the text matches WATCH
//   blog     (J6, the lead's ask at 20:59: the Day 2 decision was on websummit.com at 19:09, at /blog/web-summit/important-event-
//            update-2026/, a path the sitemap does not list; we learned of it 43 minutes later) /blog/ and every /blog/<category>/
//            listing found there or seen before: each page's embedded Next.js data (__NEXT_DATA__) lists its posts with `date` and
//            `modified`; alert on a new post or a changed `modified`. The WordPress REST API answers 404 here (a Next.js front end).
//   sitemaps every sitemap robots.txt names, and any <sitemap> they nest (today: one, sitemap.xml)
// It merges into data/watch/websummit.json: `alerts` only grows (each with first_seen), so a new page or post is never lost
// between reads. Exit code 3 when this read found a new alert, so a caller can react. Labels: fact (the organiser's own channel).
//   --quick  /blog/ only (no category listings, sitemaps or Bluesky): the 2-minute poll (the researcher's ask, 21:03), new slug or
//            changed `modified` alerts; the full read runs on the agents' wakes
// robots.txt is read first and obeyed: a websummit.com path it disallows (today only /api/) is never fetched.
// Two dates per post, each named by its field and read time (the lead's check, 21:03, found they differ): `modified` is the
// listing's Post.modified (WordPress's modified time, through __NEXT_DATA__); `page` holds the post page's own JSON-LD
// datePublished and dateModified, read for posts of the last 48 hours. Times carry no zone; Lisbon is UTC in November.
// Usage: node team/incidents/tools/websummit.mjs <incident dir> [--quick]
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const dir = process.argv[2], QUICK = process.argv.includes('--quick')
if (!dir) { console.error('usage: websummit.mjs <incident dir>'); process.exit(2) }
// after the Wednesday decision (19:38): also Day 3 and the open items (talks, PITCH, side events, tickets), at the lead's word (J5)
const WATCH = /weather|storm|tempest|wednesday|quarta|thursday|quinta|day [23]|dia [23]|clos|suspend|cancel|postpon|reschedul|safety|update|alert|aviso|programme|venue|pitch|ticket|refund|reembols|talk|speaker|stream|online|side event|night summit/i
const SITE = 'https://websummit.com', SITEMAP = SITE + '/sitemap.xml'
const BSKY = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=websummit.bsky.social&limit=20&filter=posts_no_replies'
// robots.txt: the Disallow lines under "User-agent: *", read once per run and obeyed for every websummit.com URL
let DISALLOW = null
const robots = async () => { if (DISALLOW) return DISALLOW; DISALLOW = []; const t = await fetch('https://websummit.com/robots.txt', { headers: { 'user-agent': 'incident-dashboard (public read)' } }).then(r => r.ok ? r.text() : '').catch(() => '')
    let star = false; for (const l of t.split('\n')) { const m = l.match(/^\s*([a-z-]+)\s*:\s*(.*?)\s*$/i); if (!m) continue; const k = m[1].toLowerCase()
        if (k === 'user-agent') star = m[2] === '*'; else if (star && k === 'disallow' && m[2]) DISALLOW.push(m[2]) } return DISALLOW }
const get = async (u, kind) => {
    if (u.startsWith('https://websummit.com/')) { const pth = new URL(u).pathname; if ((await robots()).some(d => pth.startsWith(d))) throw new Error(`${u}: disallowed by robots.txt`) }
    return fetchIt(u, kind) }
const fetchIt = async (u, kind) => { const c = new AbortController(), t = setTimeout(() => c.abort(), 20000); try { const r = await fetch(u, { signal: c.signal, headers: { 'user-agent': 'incident-dashboard (public read)' } }); if (!r.ok) throw new Error(`${u}: HTTP ${r.status}`); return kind === 'json' ? r.json() : r.text() } finally { clearTimeout(t) } }
const now = new Date().toISOString().slice(0, 16) + 'Z'
const file = path.join(dir, 'data', 'watch', 'websummit.json')
const old = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { alerts: [], sitemap: { urls: {} } }
const alerts = old.alerts || [], seen = new Set(alerts.map(a => a.channel === 'blog' ? a.url + '#' + a.modified : a.url)), fresh = [], errors = []

// the sitemap: the URL set, each URL with when we first saw it
const known = (old.sitemap && old.sitemap.urls) || {}, first = !Object.keys(known).length
let urls = known, added = [], lastCount = (old.sitemap && old.sitemap.in_last_read) || 0
if (!QUICK) try {
    let maps = []; try { maps = [...(await get(SITE + '/robots.txt', 'text')).matchAll(/^sitemap:\s*(\S+)/gim)].map(m => m[1]) } catch { }
    if (!maps.length) maps = [SITEMAP]
    const locs = [], done = new Set()
    while (maps.length && done.size < 50) { const m = maps.shift(); if (done.has(m)) continue; done.add(m)
        const xml = await get(m, 'text')
        for (const x of xml.matchAll(/<sitemap>\s*<loc>\s*([^<\s]+)\s*<\/loc>/g)) maps.push(x[1])
        for (const x of xml.matchAll(/<url>\s*<loc>\s*([^<\s]+)\s*<\/loc>/g)) locs.push(x[1]) }
    if (!locs.length) throw new Error('sitemap: no <loc> found (the format changed?)')
    lastCount = new Set(locs).size
    // every URL ever seen is kept (the sitemap's set changes between reads: lis26-live and lis26-homepage-components came and went at
    // 21:11-21:13), so a URL alerts once, the first time it ever appears; `in_last_read` lists the current set's size
    urls = { ...known }; for (const u of locs) urls[u] = known[u] || now
    added = first ? [] : locs.filter(u => !known[u])
    // any new URL is an alert (the lead, 20:59); `match` says whether it also hits a watch word
    for (const u of added) if (!seen.has(u)) { const a = { first_seen: now, channel: 'sitemap', kind: 'new', match: WATCH.test(u), url: u, text: 'new page on websummit.com: ' + u, label: 'fact' }; alerts.push(a); fresh.push(a); seen.add(u) }
} catch (e) { errors.push(String(e.message || e)) }

// the blog: /blog/ and every category listing; posts from each page's __NEXT_DATA__
const oldBlog = (old.blog && old.blog.posts) || {}, firstBlog = !old.blog
const posts36 = Date.now() - 36 * 3600e3
let blog = { listings: [], posts: oldBlog }
try {
    const cats = new Set(((old.blog && old.blog.listings) || []).map(u => u.replace(SITE, '')).filter(u => /^\/blog\/[a-z0-9-]+\/$/.test(u)))
    const found = {}, read = []
    const readListing = async (u) => {
        const h = await get(SITE + u, 'text'); read.push(SITE + u)
        for (const m of h.matchAll(/href="(?:https:\/\/websummit\.com)?(\/blog\/[a-z0-9-]+\/)"/g)) cats.add(m[1])
        const nd = h.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/); if (!nd) throw new Error(u + ': no __NEXT_DATA__ (the page changed?)')
        const walk = o => { if (Array.isArray(o)) return o.forEach(walk); if (!o || typeof o !== 'object') return
            if (o.__typename === 'Post' && o.slug && o.modified) { const cat = (o.category && o.category.slug) || 'blog', url = `${SITE}/blog/${cat}/${o.slug}/`
                const rec = { url, title: String(o.title || '').slice(0, 200), category: cat, date: o.date ? o.date.slice(0, 16) + 'Z' : null, modified: o.modified.slice(0, 16) + 'Z', excerpt: String(o.excerpt || '').replace(/<[^>]+>/g, '').replace(/&hellip;/g, '…').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) }
                // listings disagree (21:33: /blog/ said 20:06, /blog/web-summit/ still 19:58, a cached copy): keep the newest, and each listing's value
                const prev = found[url], by = { ...(prev ? prev.modified_by_listing : {}), [u]: rec.modified }
                found[url] = { ...rec, modified: prev && prev.modified > rec.modified ? prev.modified : rec.modified, modified_by_listing: by } }
            for (const k in o) walk(o[k]) }
        walk(JSON.parse(nd[1]))
    }
    await readListing('/blog/')
    if (QUICK) for (const u of (old.blog && old.blog.listings) || []) if (!read.includes(u)) read.push(u)   // keep the full read's list
    // every category: linked from a listing, seen before, or named by a post (a category with no link on /blog/, e.g. partners)
    const done = new Set(['/blog/'])
    for (let round = 0; round < 3 && !QUICK; round++) {
        for (const p of Object.values(found)) cats.add(`/blog/${p.category}/`)
        const todo = [...cats].filter(c => !done.has(c)).sort(); if (!todo.length) break
        for (const c of todo) { done.add(c); try { await readListing(c) } catch (e) { errors.push(String(e.message || e)) } }
    }
    const merged = { ...oldBlog }
    for (const [url, p] of Object.entries(found)) {
        const was = oldBlog[url], kind = !was ? (firstBlog ? (Math.max(Date.parse(p.date || 0), Date.parse(p.modified)) >= posts36 ? 'recent' : '') : 'new') : (p.modified > was.modified ? 'modified' : '')
        if (was && was.modified > p.modified) p.modified = was.modified   // a cached listing with an older value never moves it back
        merged[url] = { ...p, modified_field: 'listing __NEXT_DATA__ Post.modified', read_at: now, first_seen: was ? was.first_seen : now, ...(was && was.page ? { page: was.page } : {}) }
        const key = url + '#' + p.modified
        if (kind && !seen.has(key)) { const a = { first_seen: now, channel: 'blog', kind, url, title: p.title, at: p.date, modified: p.modified, text: `${p.title}: ${p.excerpt}`, label: 'fact' }; alerts.push(a); fresh.push(a); seen.add(key) }
    }
    // the post page's own dates (JSON-LD), for posts of the last 48 h: read when new, changed, or not read yet (a few pages a run)
    const h48 = Date.now() - 48 * 3600e3
    for (const [url, p] of Object.entries(merged)) {
        if (Math.max(Date.parse(p.date || 0), Date.parse(p.modified)) < h48) continue
        const was = oldBlog[url]; if (was && was.page && was.page.text_sha256 && was.modified === p.modified && QUICK) continue
        try { const h = await get(url, 'text'), pub = (h.match(/"datePublished":"([^"]+)"/) || [])[1], mod = (h.match(/"dateModified":"([^"]+)"/) || [])[1]
            // the post's own words (its __NEXT_DATA__ post.content, tags stripped) and their hash, so a change of text is seen even
            // when the dates say nothing (21:32: Post.modified moved to 20:06 and we could not tell what had changed)
            let text = null; const nd = h.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
            try { const c = nd && JSON.parse(nd[1]).props.pageProps.data.post.content; if (c) text = c.replace(/<[^>]+>/g, ' ').replace(/&#8217;|&rsquo;/g, '’').replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 4000) } catch { }
            const sha = text ? crypto.createHash('sha256').update(text).digest('hex').slice(0, 16) : null, before = was && was.page && was.page.text_sha256
            if (sha && before && sha !== before && !seen.has(url + '#text#' + sha)) { const al = { first_seen: now, channel: 'blog', kind: 'text_changed', url, title: p.title, at: p.date, modified: p.modified, text_sha256: sha, text_before_sha256: before, text: `${p.title}: ${text.slice(0, 300)}`, label: 'fact' }; alerts.push(al); fresh.push(al); seen.add(url + '#text#' + sha) }
            p.page = { field: 'post page JSON-LD datePublished / dateModified; text from __NEXT_DATA__ post.content', date_published: pub ? pub.slice(0, 16) + 'Z' : null, date_modified: mod ? mod.slice(0, 16) + 'Z' : null, read_at: now, text, text_sha256: sha } } catch (e) { errors.push(String(e.message || e)) }
    }
    blog = { listings: read, posts: merged }
} catch (e) { errors.push(String(e.message || e)) }

// Bluesky: the organisers' own posts
let posts = (old.bluesky && old.bluesky.posts) || []
if (QUICK) { /* the page reads Bluesky live; the quick poll leaves it */ }
// only posts newer than the newest post of the last read can raise an alert (the first read only sets the mark), as with the sitemap
const mark = posts.reduce((m, p) => p.at > m ? p.at : m, '')
if (!QUICK) try {
    const d = await get(BSKY, 'json')
    posts = (d.feed || []).filter(f => !f.reason).slice(0, 10).map(f => { const p = f.post, id = p.uri.split('/').pop(); return { at: p.record.createdAt.slice(0, 16) + 'Z', text: p.record.text, url: `https://bsky.app/profile/websummit.bsky.social/post/${id}`, match: WATCH.test(p.record.text) } })
    for (const p of posts) if (mark && p.at > mark && p.match && !seen.has(p.url)) { const a = { first_seen: now, channel: 'bluesky', url: p.url, at: p.at, text: p.text, label: 'fact' }; alerts.push(a); fresh.push(a); seen.add(p.url) }
} catch (e) { errors.push(String(e.message || e)) }

const out = {
    about: "Web Summit's own channels, watched for its decisions (Wednesday 11 November: off, 19:38; now Day 3 and the open items: talks, PITCH, side events, tickets): the blog's listings (polled every 2 minutes, --quick), the sitemaps' URL set and the organisers' Bluesky posts. Written by team/incidents/tools/websummit.mjs (see ../README.md). An alert is a keyword match on the organiser's own channel: read it before you act; a match is not a decision.",
    read_at: now, read_mode: QUICK ? 'quick (/blog/ only)' : 'full', robots_disallow: DISALLOW || [], watch: WATCH.source,
    sitemap: { source: SITEMAP, count: Object.keys(urls).length, in_last_read: lastCount, added_this_read: added, urls },
    blog: { source: SITE + '/blog/ and every /blog/<category>/ (their __NEXT_DATA__)', ...blog },
    bluesky: { source: BSKY, posts },
    alerts, errors,
}
fs.mkdirSync(path.dirname(file), { recursive: true })
fs.writeFileSync(file, JSON.stringify(out, null, 1) + '\n')
console.log(`${file}: blog ${Object.keys(out.blog.posts || {}).length} posts from ${(out.blog.listings || []).length} listings, sitemap ${out.sitemap.count} URLs (${added.length} new${first ? ', first read' : ''}), ${posts.length} posts, ${fresh.length} new alert(s)${errors.length ? ', errors: ' + errors.join('; ') : ''}`)
for (const a of fresh) console.log(`ALERT ${a.channel}: ${a.text.slice(0, 160)} ${a.url}`)
process.exit(fresh.length ? 3 : 0)
