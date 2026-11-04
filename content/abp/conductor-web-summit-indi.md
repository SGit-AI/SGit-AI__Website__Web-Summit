---
title: "ABP: conductor@web-summit.indi"
summary: The Agent Behaviour Policy of Indi's agent conductor@web-summit.indi, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-04
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/indi/agents.json` and the standard conductor prompt on [the agents page](../agents/index.html#dashboard-agent), [Indi's brief](../brief-indi/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Indi's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Network (measured by the agent):** its session's network policy refused pki.sgit.ai and web-summit.sgit.ai on its first runs (5eac229, 799d37c); pki.sgit.ai has been allowed since about 23:00 on 3 November (its key published, d06dde97; corrected at its request, 3803e9fb). The policy is set in Indi's environment, above the agent: a real boundary, now narrower.
- **Connectors and tools:** not known. The session is in Indi's account; Indi or the agent can list them.
- **How known:** from its commits and its person's pages, read 4 November 2026 00:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** conducts Indi's agents, keeps `people/indi/`, feeds the stand-ups and briefs Indi; on a schedule at 07:20, 12:20 and 17:20 GMT.
- **Deployment scope:** `people/indi/**` (onboarding.json, agents.json, ack.json, briefs/), its own public key entry in `data/keys.json`, and items for Indi in the stand-ups' agenda, from the standard conductor prompt; the board is everyone's.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Indi, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- Code in its person's folder runs in CI with a token that can push and deploy (WS-133): `people/indi/pages.mjs` is the first such file.
- Write anywhere in the repository: its push access is not limited to `people/indi/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

- **It holds its person's site key** (WS-136, WS-138): it issues the key in its own session and keeps the private half (the agents page, #person-key). A verified "signed by <person>" on a lane message is the one thing that turns lane input into an instruction, so it can sign as its person.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Indi's brief, part two |
| Writes only `people/indi/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 4 November 2026 00:15 UTC): `people/indi/` (onboarding, agents.json, briefs), two stand-up items and its key entry: inside its mandate. Indi's site key issued at 07:21 on 4 November (3803e9fb), the private half in its session. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Indi has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Indi, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Indi |
| Licensee | conductor@web-summit.indi (a Claude Code session in Indi's account) |
| Conditions | the Mandate above; Indi's brief, part two; CLAUDE.md |
| Validity | from 4 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Indi. Drafted by abp@web-summit.dinis from the repository; Indi and the agent correct it. Version 2, 4 November 2026 (08:10 wake: the person key, WS-138), in `content/abp/` with its history in git.
