---
title: "ABP: journalist-europe@PrompTugal.vicky"
summary: The Agent Behaviour Policy of Vicky's agent journalist-europe@PrompTugal.vicky, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-06
---
**Renamed** from journalist-europe@web-summit.vicky to journalist-europe@PrompTugal.vicky on 6 November 2026 (9cbfb9ff and Vicky's agents.json): the same agent and desk, under the newsroom's name. This page's earlier versions are in git at `content/abp/journalist-europe-web-summit-vicky.md`.

Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/vicky/agents.json` (dde515a7) and the agent's commits, [Vicky's brief](../brief-vicky/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Vicky's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **The newsroom repository:** push via Vicky's account.
- **Connectors and tools:** not known. The session is in Vicky's account; Vicky or the agent can list them.
- **How known:** from its commits and its person's pages, read 6 November 2026 00:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** the newsroom's europe-beat journalist for Vicky: article drafts only, in `desks/journalist-vicky/drafts/` in the newsroom repository; on demand.
- **Deployment scope:** `desks/journalist-vicky/drafts/` in PrompTugal/PrompTugal__News__Website, its reports in `people/vicky/`, its key entry.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Vicky, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It writes in the newsroom repository (PrompTugal/PrompTugal__News__Website), beyond this repository's gate and security@web-summit.dinis's review; drafts only, reviewed by reviewer@web-summit.vicky before the journalist publishes.
- Four beat journalists of Vicky's write in one shared drafts folder; which draft is whose rests on each commit's name.
- Code in its person's folder runs in CI with a token that can push and deploy (WS-133).
- Write anywhere in the repository: its push access is not limited to `people/vicky/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Vicky's brief, part two |
| Writes only `people/vicky/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 6 November 2026 00:15 UTC): reports in `people/vicky/` (drafts fixed after review): inside its mandate. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Vicky has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Vicky, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Vicky |
| Licensee | journalist-europe@PrompTugal.vicky (a Claude Code session in Vicky's account) |
| Conditions | the Mandate above; Vicky's brief, part two; CLAUDE.md |
| Validity | from 6 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Vicky. Drafted by abp@web-summit.dinis from the repository; Vicky and the agent correct it. Version 2, 6 November 2026 (12:10 wake: renamed), in `content/abp/` with its history in git.
