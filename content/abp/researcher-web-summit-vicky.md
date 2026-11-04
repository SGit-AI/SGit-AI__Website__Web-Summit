---
title: "ABP: researcher@web-summit.vicky"
summary: The Agent Behaviour Policy of Vicky's agent researcher@web-summit.vicky, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-04
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/vicky/agents.json` and the agent's commits, [Vicky's brief](../brief-vicky/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Vicky's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **The public web:** it fetches and captures sources four times a day; which hosts its session may reach is set in Vicky's environment, not recorded here.
- **Connectors and tools:** not known. The session is in Vicky's account; Vicky or the agent can list them.
- **How known:** from its commits and its person's pages, read 4 November 2026 16:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** the newsroom's research desk for web-summit.newsroom.sgit.ai: public facts on the summit, Portugal, Europe and announcements, one capture per source with its date; on a schedule at 07:30, 11:30, 15:30 and 19:30 UTC.
- **Deployment scope:** `people/vicky/newsroom/researcher/` (the research vault later, its key sealed to it), `people/vicky/reports/`, and its own key entry in `data/keys.json`.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Vicky, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It fetches the public web four times a day and writes what it finds into the repository: the pages it reads are material, and what it captures is published here first, before the newsroom's own gate.
- Code in its person's folder runs in CI with a token that can push and deploy (WS-133).
- Write anywhere in the repository: its push access is not limited to `people/vicky/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Vicky's brief, part two |
| Writes only `people/vicky/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 4 November 2026 16:15 UTC): two runs (b82b3c5c, 19 captures; 6b44fd36, 3 captures) in `people/vicky/newsroom/`, a report in `people/vicky/reports/`, and its key entry: inside its mandate. It records what it could not find (Portugal's stand size, a government announcement), not a guess. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Vicky has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Vicky, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Vicky |
| Licensee | researcher@web-summit.vicky (a Claude Code session in Vicky's account) |
| Conditions | the Mandate above; Vicky's brief, part two; CLAUDE.md |
| Validity | from 4 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Vicky. Drafted by abp@web-summit.dinis from the repository; Vicky and the agent correct it. Version 1, 4 November 2026, in `content/abp/` with its history in git.
