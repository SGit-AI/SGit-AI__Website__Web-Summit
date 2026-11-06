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
