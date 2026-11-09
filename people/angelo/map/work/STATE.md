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
- The look after dashboard@'s review (de879c5): squares on the four slanted edges (work.js SLOTS), none on the logos/LIVE or the date line; pills step off live.js's furniture; on a phone the hexagon at 94% width with the name rows above and below. wvdraw checks the furniture.
- `people/angelo/app/work-replay.js`: replay's 'ak-clock' to flights per frame (merged) and counts; seeks fly nothing. Test `wvreplay` (node).
- **Replay: done** (c95bce6): mountMap() puts the work view on the Team map while it plays (the map's viewBox opened to 0.84 plus a 7% margin, squares on that rim, deliveries.json over the whole history); "Exchanges | Work" above the playback bar in app.js drawCollab, r_work=1 in the address. Test wvrp.

## Open
- **Review: nothing waiting.** Everything up to the 30th run is on dev or this branch; my branch differs from dev only by STATE and ledger lines.
- **Dumbbell (waiting on the desk):** dashboard@ asked the desk (f4b4ad93, 21db9b6e) to brief me for the page's version of spec-dumbbell.md. I build when the backlog row is there; dashboard@ then ports it to the wallpaper.
- **Branch:** the 14th run's 36 copies of dev's commits are resolved: the 15th run's merge (45253ee) has origin/dev's tree plus my own work, so the branch differs from dev only by my files. Merge origin/dev, never rebase.
- **Seen:** in a 440 px pop-out live.js's layout switch sits over the upper right square (WS-14 / the team site): dev.map@'s furniture, told in b62ea65e.
- **Lane:** policy@ turned check 21 into a FAIL; lanes.json still has `writes: []` for me. d71e6ca8 and 49ce4f13 went out without Outside lines (already pushed, no force-push): the reviewer's commit must carry them. From 423f113f every commit of mine carries its own Outside lines. Gate my own range: LANE_RANGE=<my first commit of the run>^..HEAD. 03267d87 (27th run) also went out without them: the reviewer's commit must carry them; add them before the first commit, every run, STATE and ledger included.
- **0f3 proof:** Angelo sends a clip to himself on WhatsApp on his iPhone; the fallback in a real Safari 16 not checked.
- **0c4 questions (spec part 3), via the desk:** the nine squares fixed over the data's span (built) or per window; retire "Agents and their work".
- **34th run's slip:** I rebased onto origin/workers/dev.work after merging origin/dev, so af173d27's history carries 18 copies of dev's commits (4e278b16 down to f2025b98's copy), already pushed (no force-push). The tree is dev's plus my STATE and ledger line only: reviewer, bring only af173d27's two files (git diff 98438683 af173d27). Next runs: merge, then push with no rebase.
- Testing: merge origin/dev into the branch at the start of a run (16th run: 51d667fe).
- **The apps' repositories (spec rule table, last row): question to the desk, 15th run.** Read 9 November 00:50: PrompTugal__App__iOS dev, 1,141 commits, no Agent: line (makers "Claude", a bot): nothing to draw without inventing a maker. PrompTugal__App__Android dev, 71 commits, 68 with Agent: <role>@promptugal.ai (conductor.android, security.android, release.android, play.android ...), For: Dinis: not <role>@PrompTugal.<person>, so no roster person; repos-snapshot.mjs drops them too (0 events). Build waits on how to name them (Dinis's, as pt:dinis:<role>, or listed as their own group).

## Last run
Thirty-fifth run, 9 November about 21:51 to 22:00 UTC: spec-new-agents.md's last commit checked with pushed-by.mjs --last-touch (e588f4b5, riskmandate-angelo, ANGELO). No commit on dev names me since the 34th run (git log -i --grep dev.work since 20:45); the backlog's only change is the desk's 0-LEADS row for writer@ (6c94d058). Still no backlog row for the dumbbell. **Next, once the desk's backlog row lands: the dumbbell's page version** (people/angelo/proposals/live-map/dumbbell/spec-dumbbell.md). Rows 0f2, 0f3, 0c4 unchanged. Merged origin/dev with no rebase (conflicts only in dev's own files, taken as dev's), so the branch is dev plus my STATE and ledger lines (the 34th's and this one). Seventeenth ledger-only run in a row. No code changed. agent-log sent unsigned (no key).
