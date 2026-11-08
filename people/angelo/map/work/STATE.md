# dev.work@PrompTugal.angelo: STATE

Backlog 0f2 (the work view) and 0f3 (the WhatsApp clip). **Approved** by Angelo 8 November about 16:30 UTC (the desk's 7fcaf108 and d36afd88, both pushed by riskmandate-angelo): building, deliveries.mjs first, then the view, then the clip.

## Built (on workers/dev.work, for dashboard@ to review)
- `people/angelo/tools/deliveries.mjs`: the spec's rule table, "Delivered:" lines, the maker, readRepo(), backfill(), pack(). Test `wv` (a fixture per row).
- `people/angelo/app/deliveries.json`, written by the build (data.mjs extras(), .gitignore line), makers named as live.json names agents. Test `wv` checks it.
- `people/angelo/app/work.js`: the view's pure rules (rim places, merge, counts, origin, the light theme's stroke). Test `wvcore`.
- `people/angelo/app/work-newsroom.js`: the newsroom read live (stories.json every two minutes), shape check, live diff, poller. Test `wvnews` against `tests/wv-stories.json`.
- `people/angelo/app/deliveries-backfill.json`: empty, with its shape.
- `people/angelo/app/clip.js` (0f3): sizes, caps, caption, file name; WebCodecs H.264 Main 4.0 as limited-range I420 into a fast-start MP4; the fallback for Safari before 17 (MediaRecorder, its fragmented file rewritten as one fast-start MP4); share or download. `vendor/mp4-muxer-5.2.2/` (MIT, sha256 in SOURCE.txt). Test `clip` (ffprobe).
- `people/angelo/app/work-logos/`: PT News (light, dark) and LinkedIn favicons, SOURCES.md; the rest plain marks.
- `people/angelo/app/work-draw.js`: the drawing on the hook's layer: squares on the rim (logos), name pills outside it (12 px or more; on a phone in rows above and below with leaders), counts, flights in the maker's colour, merges, landing light. Test `wvdraw` (1280 and 390 px, dark and light).
- `people/angelo/app/work-live.js`: the live feed: deliveries.json each minute, 4 minutes behind; the newsroom every two; counts for 24 h; the corner note. Test `wvlive`.

## Open
- **The hook in live.js** (dev.map@'s file): `people/angelo/map/work/drafts/live-hook.patch`, four lines, sent For: dev.map@; not on dev or workers/dev.map at 18:00 UTC (dev.map@ changed live.js at 17:09, so it stays a draft). wvdraw and wvlive serve live.js with the hook added and say so.
- Next, once the hook lands: the "Exchanges | Work" switch in app.js (`AngeloWorkLive.mount(host, { base })`, scripts work.js, work-draw.js, work-newsroom.js, work-live.js), the legend (one line under the graph on a phone), replay over the full history, and the clip button (frames from replay's clock through `clip.make`).
- Look: PT News's square sits close to dev.map@'s logos and LIVE at the hexagon's top; for dashboard@'s review.
- Testing: the branch is based on dev of 09:49; tests run on a worktree of origin/dev with this branch's work files laid over (the old live.js here lacks what the hook uses).
- Asked the desk (8ebf8b4): the app's square, its own icon or PT News's.
- Not yet checked: WhatsApp on Angelo's iPhone (the proof for 0f3), and the fallback in a real Safari 16.
- Other repositories (the apps): `deliveries-repos.json` from the snapshot, later.
- Lane: lanes.json still has no entry for dev.work@ (18:00 UTC), so the gate's check 21 fails on my commits until policy@ adds it.

## Last run
Ninth run, 8 November 17:51 to about 18:05 UTC: no commits For: me since the last; the hook not yet on dev. Built the drawing (work-draw.js, test wvdraw) and the live feed (work-live.js, test wvlive), in two commits. Tests wvdraw, wvlive, wvcore, wv PASS.
