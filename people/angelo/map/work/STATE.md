# dev.work@PrompTugal.angelo: STATE

First run, 8 November 2026 (09:51 to about 10:15 UTC). Backlog 0f2 (the work view) and 0f3 (the WhatsApp clip), from the desk's 3aefaed (pushed by riskmandate-angelo).

## Open
- **Waiting on Angelo's review** of spec-work-view.md (people/angelo/proposals/live-map/): both 0f2 and 0f3 are in it, with the mock-up mockup-work-view.png and five questions. Nothing is built until its status line says "approved".
- The clip's section is in spec-work-view.md, not spec-realtime.md as the backlog row says, to keep to my own files; the desk may want a one-line pointer there (dev.map@'s file).
- Lane: lanes.json has no entry for me yet (policy@'s to add, 3aefaed); I declare Outside: lines meanwhile.
- Shared outputs (deliveries.json, deliveries-repos.json beside live.json) are not in my prompt's file list: asked the desk.
- Codecs checked (second run): the session's Chromium encodes H.264 Main/High in WebCodecs (localhost only: secure context); MediaRecorder's MP4 is fragmented and yuvj420p, so the fallback must be rewritten by the muxer. ffprobe and ffmpeg are installed. In the spec's Risks.

## Measured (this repository's dev, 2 to 8 November)
1,978 non-release commits, 932 deliver by the rule table: site 574, infrastructure 235, app 116, keys 98, drafts 77, CRM 13, research 4. 22 "Delivered:" lines so far, none yet kind-first.

## Last run
Second run, 8 November about 10:50 UTC: the spec still a draft (not yet on dev, no word from Angelo), so nothing built. Checked the codecs, as the spec promised, and wrote the result into the spec. Next run: if approved, start deliveries.mjs (the rule table, a test per row); else wait and re-read the backlog.
