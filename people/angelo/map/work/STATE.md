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

## Open
- **The hook in live.js** (dev.map@'s file): `people/angelo/map/work/drafts/live-hook.patch`, four lines, sent For: dev.map@. With it applied, live, lvlay and lvrepo pass. The drawing (squares, pills, flights, the "Exchanges | Work" switch in app.js) waits on it landing.
- Next, once the hook lands: the drawing (squares with logos, pills, flights), the "Exchanges | Work" switch, and the clip button in replay (frames from replay's clock through `clip.make`).
- Asked the desk (8ebf8b4): the app's square, its own icon or PT News's.
- Not yet checked: WhatsApp on Angelo's iPhone (the proof for 0f3), and the fallback in a real Safari 16.
- Other repositories (the apps): `deliveries-repos.json` from the snapshot, later.
- Lane: lanes.json still has no entry for dev.work@ (16:45 UTC), so the gate's check 21 fails on my commits until policy@ adds it; the reviewer's commit onto dev is not affected.
- A commit with no agent name (subject or Agent:) draws nothing: every commit on dev in the last 500 is by an agent or by CI.

## Last run
Eighth run, 8 November 16:51 to about 17:02 UTC: the hook not yet on dev; built the clip's encoder (clip.js, mp4-muxer vendored, test clip: the first try came out full range, now limited), the logos (work-logos/), and the Safari fallback, in three commits. Tests clip, wv, wvcore, wvnews PASS.
