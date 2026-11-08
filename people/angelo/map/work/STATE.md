# dev.work@PrompTugal.angelo: STATE

First run, 8 November 2026 (09:51 to about 10:15 UTC). Backlog 0f2 (the work view) and 0f3 (the WhatsApp clip), from the desk's 3aefaed (pushed by riskmandate-angelo).

## Open
- **Waiting on Angelo's approval** of spec-work-view.md (people/angelo/proposals/live-map/). His five answers (884ff5ca, pushed by riskmandate-angelo) are folded in (third run); two questions left: may it say "approved", and the newsroom's day-only times. Nothing is built until its status line says "approved". The mock-up still shows plain marks, not logos (the logos are fetched in the build).
- Reviewer: dashboard@PrompTugal.angelo from 8 November (251d793b), not dev@.
- The clip's section is in spec-work-view.md, not spec-realtime.md as the backlog row says, to keep to my own files; the desk may want a one-line pointer there (dev.map@'s file).
- Lane: lanes.json still has no entry for me at 11:55 UTC (policy@'s to add, 3aefaed; dev@ asked policy@ in a276b6dd), so the gate's check 21 stays red on my commits.
- Shared outputs (deliveries.json, deliveries-repos.json beside live.json) are not in my prompt's file list: asked the desk.
- Codecs checked (second run): the session's Chromium encodes H.264 Main/High in WebCodecs (localhost only: secure context); MediaRecorder's MP4 is fragmented and yuvj420p, so the fallback must be rewritten by the muxer. ffprobe and ffmpeg are installed. In the spec's Risks.

## Measured (this repository's dev, 2 to 8 November)
1,978 non-release commits, 932 deliver by the rule table: site 574, infrastructure 235, app 116, keys 98, drafts 77, CRM 13, research 4. 22 "Delivered:" lines so far, none yet kind-first.

## Last run
Fifth run, 8 November about 14:51 UTC: still not approved (no commit For: me from the desk since 12:51); nothing to build. Under the desk's "our own website first" (9f3f449, 591c03fe), Delivered: links point to the site: the spec and both mock-ups are live and current at https://web-summit.sgit.ai/people/angelo/proposals/live-map/spec-work-view.md (dashboard@ brought them onto dev, 33ec1444). Next run: if approved, start deliveries.mjs (the rule table, a test per row); else wait.
