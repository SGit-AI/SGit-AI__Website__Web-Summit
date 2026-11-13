# Hand-over: conductor@web-summit.vicky, 14 November 2026

Written by the outgoing conductor session (key `conductor-vicky-2`) on 13 Nov at Vicky's word (about 19:00 UTC: "prepare everything for a handover tomorrow after your 08:45 brief: the handover file, the start-up material I paste into the new session, the scheduled tasks to move, and which vault keys need resealing"). Planned for Friday under standing answer 43, postponed by Dinis's hold. Public material only (P27): no prompt text beyond what is already public, no keys, session ids, contact details, interview names, mail or anything from vault B.

## First, in the new session (in this order)

1. Read `CLAUDE.md`, `people/vicky/decisions.md` (the "Rules in force" index first; standing answers 31 to 60 are the ones in play), `people/vicky/prompts/conductor.md` (the brief, the relay and every standing rule by date), then this note. Where they and this note disagree, decisions.md and conductor.md win.
2. **Your key:** `node pki-agent.mjs keygen --session` (tool from https://pki.sgit.ai/agents/pki-agent.mjs; run Node with `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`). Public half only, in your own commits: `conductor-vicky-3` in this site's `data/keys.json` and `conductor-vicky-3-promptugal` in the newsroom's `board/keys.json`; mark `conductor-vicky-2` (and `conductor-vicky-2-promptugal`) retired with the time.
3. **Your two scheduled tasks**, firing into your own session, prompts word for word from `people/vicky/prompts/conductor.md`: the morning brief `45 8 * * *` and the evening relay `45 20 * * *` (UTC). Update `people/vicky/schedule.json` with the new ids. The midday check stays off (standing answer 55's plan, as restored on 13 Nov).
4. **Session ids** for messaging Vicky's agents and reading usage: find them with `list_sessions` by title (conductor, pm, logistics, dashboard, researcher, curator, programme, journalist-summit, journalist-portugal, journalist-europe, journalist-ai, journalist-connections, reviewer, checker, scout, dev (newsroom), reader-testing). Keep them in your scratchpad only, never in a repository (P6 as lifted by standing answers 41 and 42: message only Vicky's own team-account agents, each message only `Task: pull dev and read people/vicky/tasks/<file>.md.`; they reply `Done: ...`).
5. Ask vault@ to reseal vaults A and B to your key (below), and open both links when they arrive. Keep each key in a 0600 file under `~/.sg-send/vault-keys/`, never printed or committed. Vault B is Vicky's ideas: nothing from it goes into a public file, brief or task file.
6. Commit as `conductor@web-summit.vicky: <what>` with `Agent: conductor@web-summit.vicky`, `Issue:`, `For:`; release with `AGENT=conductor@web-summit.vicky SKIP_LIVE=1 admin/tools/release.sh "<sentence>"`. Newsroom pushes only for `desks/conductor-vicky/requests/`, your key, and what Vicky asks (`newsroom/tools/release.sh`, on the `dev` branch). Never `main`, never force.

## Keys and vaults

| Item | Held by the outgoing session | What happens |
|---|---|---|
| Vault A (`wyt9jdeo`, the agents' tools) | key sealed by vault@ to `conductor-vicky-2` | vault@ reseals it to `conductor-vicky-3`; the outgoing session deletes its copy at the switch |
| Vault B (`lhsdkd4x`, Vicky's ideas) | key sealed by vault@ to `conductor-vicky-2` | the same |
| Team CRM key | not held since 9 Nov | nothing (only if Vicky asks) |
| Inbox lane | none ("inbox lane: none") | nothing; the lane re-issue still waits on Dinis's conductor |

## Scheduled tasks firing into the outgoing session

| Task | Id | State | At the switch |
|---|---|---|---|
| morning brief 08:45 | trig_016G4zCbDfCSU5A7mcAy3wq4 | enabled | disable after the new one exists |
| evening relay 20:45 | trig_01Xh41C12RjjrZQ14R6EEPHy | enabled | disable after the new one exists |
| midday check 12:50 | trig_01BWSDV2eWe5d4Z5rvr3gJkC | disabled | leave |
| 17:30 check | trig_01JBMeid4ogSPQwGi4EehQaN | disabled | leave |
| one-offs of 11 to 13 Nov (06:30 switch, takedown step 2, image move, coverage review, SA39 signed test) | in schedule.json | disabled, done or cancelled | leave |

Vicky's agents' tasks fire into their own sessions and do not move.

## In progress and waiting (13 Nov, about 19:15 UTC)

| What | Waiting on | Where |
|---|---|---|
| S63 (women in Portugal learning and building with AI): Fix first, six points | journalist-ai, then the reviewer's re-check (and publish under R-PUB-1) | `desks/reviewer-vicky/reviews/S63.md` (newsroom); task `2026-11-13-1855-s63-fix.md` |
| STYLE.md "Write like a person" rules, applied to new drafts; one before-and-after sample with a cost for the rest (published articles unchanged until Vicky picks) | reviewer | task `2026-11-13-1900-style-plain.md`; sample `desks/reviewer-vicky/reviews/style-sample-2026-11-13.md` |
| Check S62 got the style pass (published about when the rules arrived) | reviewer's reply | as above |
| Update notes rewritten (past tense, short, no semicolons; count to Vicky) | reviewer, after the sample | task `2026-11-13-1850-update-notes.md` |
| Web Summit links still on the live company pages (template and derived data) | conductor@PrompTugal.dinis | newsroom `desks/conductor-vicky/requests/2026-11-13-1810-company-pages-web-summit-links.md` |
| Akamai and Persona company pages held | Vicky (a person reads their sites, not today) | review `company-takedown-step2-2026-11-13.md` |
| Scout's prompt to "whole team, reusable only"; its weekly run is set for Sundays 18:47 UTC | scout's Done | task `2026-11-13-1645-scout-whole-team-weekly.md` |
| SA58-THEMES: researcher and curator apply themes 1 to 5 from 14 Nov | their 07:15 and 07:35 reports ("applied SA58-THEMES") | `people/vicky/reports/` |
| SA54-LEDGER: every agent logs each run, generic titles | agents' reports | `people/vicky/ledger/` |
| Humans and AI story 1 (Vicky's own path): **held completely**; nobody drafts or researches it | Vicky, after the weekend | standing answer 58 |
| Interview vault; inbox lanes for the agents' new keys | Dinis | brief "Dinis / stand-up" items |
| Portuguese edition, Portugal banner | Dinis's to decide; leave | standing answer 58 |
| The router (WS-213): held | Vicky | standing answer 54 |

## Numbering

Next standing answer **61**. Next brief **10** (brief 9 was 12 Nov; no brief on 13 Nov, the hold). The curator's storylines continue from **S64**.

## Checklist for Vicky

- [ ] `conductor-vicky-3` on both keys pages by the new session's own commit; `conductor-vicky-2` marked retired.
- [ ] Two new scheduled tasks (08:45 brief, 20:45 relay) fire into the new session; the old two disabled; schedule.json updated.
- [ ] vault@ resealed vaults A and B to `conductor-vicky-3`, and the new session opened both.
- [ ] The old session deleted its vault keys and commits nothing more.
