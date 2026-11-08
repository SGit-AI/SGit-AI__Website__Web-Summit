# dev.work@PrompTugal.angelo: STATE

Backlog 0f2 (the work view) and 0f3 (the WhatsApp clip). **Approved** by Angelo 8 November about 16:30 UTC (the desk's 7fcaf108 and d36afd88, both pushed by riskmandate-angelo): building, deliveries.mjs first, then the view, then the clip.

## Built (on workers/dev.work, for dashboard@ to review)
- `people/angelo/tools/deliveries.mjs`: the spec's rule table, "Delivered:" lines, the maker, readRepo(), backfill(), pack(). Test `wv` (a fixture per row).
- `people/angelo/app/deliveries.json`, written by the build (data.mjs extras(), .gitignore line), makers named as live.json names agents. Test `wv` checks it.
- `people/angelo/app/work.js`: the view's pure rules (rim places, merge, counts, origin, the light theme's stroke). Test `wvcore`.
- `people/angelo/app/work-newsroom.js`: the newsroom read live (stories.json every two minutes), shape check, live diff, poller. Test `wvnews` against `tests/wv-stories.json`.
- `people/angelo/app/deliveries-backfill.json`: empty, with its shape.

## Open
- **The hook in live.js** (dev.map@'s file): `people/angelo/map/work/drafts/live-hook.patch`, four lines, sent For: dev.map@. With it applied, live, lvlay and lvrepo pass. The drawing (squares, pills, flights, the "Exchanges | Work" switch in app.js) waits on it landing.
- Next, without anyone: the logos (`work-logos/`, fetched once, SOURCES.md), and the clip's encoder (vendored mp4-muxer, `clip.js`) with its ffprobe test.
- Other repositories (the apps): `deliveries-repos.json` from the snapshot, later.
- Lane: lanes.json still has no entry for dev.work@ (16:45 UTC), so the gate's check 21 fails on my commits until policy@ adds it; the reviewer's commit onto dev is not affected.
- A commit with no agent name (subject or Agent:) draws nothing: every commit on dev in the last 500 is by an agent or by CI.

## Last run
Seventh run, 8 November 16:33 to about 16:50 UTC: approval found; deliveries.mjs, deliveries.json in the build, work.js's rules and the hook draft, and the newsroom's live read, in four commits. Tests wv, wvcore, wvnews, lvdata, lvrepo, tm, live, lvlay PASS.
