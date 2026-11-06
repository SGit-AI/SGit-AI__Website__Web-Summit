# journalist-ai@web-summit.vicky: reports

Vicky's AI and robotics journalist for the Web Summit 2026 newsroom (the technology itself, AI companies and robots at the summit): turns the curator's story candidates on that beat into drafts in desks/journalist-vicky/drafts/ of the newsroom repository, one story at a time when Vicky asks. One short line per piece of work.

## Thu 5 Nov 2026, 20:55 UTC (set-up and S15)

- Session key made and published as journalist-ai-vicky in data/keys.json (signing sha256:c173f1bc39a2ab0d, encryption sha256:96301f62bfbdb04c); pki-agent.mjs matched the sha256 pinned in admin/tools/seal.mjs.
- Draft S15, "Following robotics at Web Summit: from the lineup to Técnico's stand": desks/journalist-vicky/drafts/S15-following-robotics-at-web-summit.md in the newsroom repository (newsroom v0.1.25), status draft, for newsroom@web-summit.dinis.
- Sources, all read 5 Nov at their own addresses: Web Summit's speakers page and the speaker pages for Agibot A3, Galbot G1 and Li Chen (Unitree); Web Summit's schedule; Técnico's announcement (29 Oct, updated 3 Nov).
- Not confirmed: when or on which stage the robots and Li Chen appear (not on the public pages); speakers beyond the first 20 the page shows; the quadruped's model ("Unitree G02" per Técnico). The stage-to-stand link is a suggestion; no source says anyone will meet.

## Fri 6 Nov 2026 (WS-177: S12, not written)

- S12, "A robot among 800 speakers", not drafted: its two sources (Web Summit's speakers page, re-read 6 Nov, the same 20 names as on 5 Nov; Técnico's announcement) are the ones S15 already uses, and its angle (800 speakers, robots listed as speakers) is S15's lead. Told Vicky. An AI-companies angle would need new sources beyond names and job titles.
- Newsroom copy now points at PrompTugal/PrompTugal__News__Website (dev). Prompts and standing rules saved in people/vicky/prompts/journalist-ai.md.

## Fri 6 Nov 2026, 10:55 UTC (rename and schedule)

- Renamed journalist-ai@PrompTugal.vicky (Dinis's new names). The same session key is now also in the newsroom's board/keys.json as journalist-ai-vicky-promptugal (signing sha256:c173f1bc39a2ab0d), newsroom v0.1.219.
- Scheduled task created: daily at 08:00 and 16:00 UTC, the prompt Vicky gave, saved in people/vicky/prompts/journalist-ai.md.
- Found the newsroom remote back on the old SGit-AI address after a session restart; pointed it at PrompTugal/PrompTugal__News__Website before pushing. I check it before every push.

## Fri 6 Nov 2026, 16:10 UTC (scheduled run)

- No hold. No new storyline on my beat: S20 to S23 are Portugal and Connections: Portugal; S12 stays skipped (repeats S15). No draft written.
- Applied P1 (hold check), P2 (re-read my prompts file; it matches), P3 (status block), P5 (my task moved to 08:18 and 16:18 UTC, `18 8,16 * * *`, noted in my prompts file), P10 (noted). P9: `~/.abp/log/` does not exist; I was not shown "ABP (Agent Behaviour Policy) re-anchored" at my last start.
- The newsroom remote was back on the old SGit-AI address after a restart; reset to PrompTugal before pulling. Nothing was pushed there.
- decisions.md: every commit to it is subject-named conductor@web-summit.vicky; I can't see from git which account pushed them.
- state: ok; done: updates applied, no new beat material; next: S-candidates on AI or robotics when the curator adds them; ask: none; run: scheduled

## Fri 6 Nov 2026, 16:20 UTC (scheduled run)

- state: idle

## Fri 6 Nov 2026, about 21:00 UTC (team series, article 1 of 5)

- Draft T1, "Angelo's communication graph: watch our agents talk": desks/journalist-vicky/drafts/t1-angelos-communication-graph.md in the newsroom (pushed f25da575, dev), status draft, For: journalist@PrompTugal.dinis. 616 words.
- Sources, read 6 Nov: Angelo's command centre (#collab?map=1 and #replay) and its data.json (v0.2.862, built 20:26 UTC); people/angelo/tools/team-map.mjs and people/angelo/app/replay.js on the team site; security@PrompTugal.dinis's "What our agents say to each other, counted".
- Not confirmed or left out: that Dinis asked for the graph to be shown (said at the stand-up, no public source); the map's figures move with each release (6 people, 111 agents, 2,915 "For:" lines when read); its "104 PrompTugal" count looks inconsistent with 111 agents, so not quoted. People listed as left out of the map are not named.
- Fixed my own mistake: the file was first named T1-..., and the newsroom gate failed (api/v1/graph/whole.json: a story's source path must be lower case; curator stories take the curator file's path, a non-curator draft its own). Renamed to t1-...; gate green. For dev@PrompTugal.dinis: the graph could lower-case or map non-curator drafts' paths, since STYLE.md names drafts S<n>-....
- state: ok; done: T1 drafted and pushed; next: article 2, who does the work, when Vicky asks; ask: none; run: prompted

## Fri 6 Nov 2026, about 21:15 UTC (T1 screenshots)

- T1 now has two screenshots, taken in my session's browser from the live pages (team site v0.2.871/v0.2.872): the team map ("People ring", full-screen mode, 800 px, WebP 68 KB) and Replay (last 24 hours, phone layout, one row per person, 869 px, WebP 27 KB). In desks/journalist-vicky/drafts/img/, linked by their promptugal.news address as the published articles do; captions link the live views and credit Angelo; short alt text. Newsroom v0.1.343, gate green.
- Note: the map is drawn on a dark background (the page's dark theme in my browser); there is no light version.
- state: ok; done: T1 screenshots; next: article 2 when Vicky asks; ask: none; run: prompted
