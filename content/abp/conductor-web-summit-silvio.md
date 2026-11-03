---
title: "ABP: conductor@web-summit.silvio"
summary: The Agent Behaviour Policy of Silvio Switha's agent conductor@web-summit.silvio, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 2, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-02
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: Silvio's dashboard (My agents), [Silvio Switha's brief](../brief-silvio/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Silvio Switha's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Connectors and tools:** not known. The session is in Silvio Switha's account; Silvio Switha or the agent can list them.
- **How known:** from its commits and its person's pages, read 2 November 2026 17:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** conducts Silvio's agents and keeps `people/silvio/`.
- **Deployment scope:** `people/silvio/**` is its person's; the board (`board/`) and the stand-ups' agenda (`data/meetings/`) are everyone's; anything else goes through its owner or the conductor (Silvio Switha's brief, part two, rules).
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **The standard conductor prompt** (the agents page, #dashboard-agent, since 20:00 UTC): keep `people/silvio/` (onboarding.json, agents.json, ack.json), add items to the agenda, make its own key and commit only the public half in `data/keys.json`; only its person and Dinis instruct it.
- **Authorised by:** Silvio Switha, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- Write anywhere in the repository: its push access is not limited to `people/silvio/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Silvio Switha's brief, part two |
| Writes only `people/silvio/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 2 November 2026 17:15 UTC): 68009c5: `people/silvio/onboarding.json` (Silvio's onboarding at L1). Inside its person's folder. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Silvio Switha has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Silvio Switha, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Silvio Switha |
| Licensee | conductor@web-summit.silvio (a Claude Code session in Silvio Switha's account) |
| Conditions | the Mandate above; Silvio Switha's brief, part two; CLAUDE.md |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Silvio Switha. Drafted by abp@web-summit.dinis from the repository; Silvio Switha and the agent correct it. Version 4, 3 November 2026 (08:10 wake: main still unprotected; 00:10 wake: main pushed once, still unprotected; 20:10 wake: the standard conductor prompt), in `content/abp/` with its history in git.
