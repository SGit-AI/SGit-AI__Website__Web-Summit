---
title: "ABP: dashboard@web-summit.dinis"
summary: The Agent Behaviour Policy of Dinis Cruz's agent dashboard@web-summit.dinis, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-03
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/dinis/agents.json` and the standard dashboard-agent prompt on [the agents page](../agents/index.html#dashboard-agent), [Dinis Cruz's brief](../brief-dinis/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Dinis Cruz's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Same account as abp@web-summit.dinis:** its tools are likely the same as those measured for abp's session (GitHub, Claude Code Remote, Google Drive); inferred, not measured.
- **Connectors and tools:** not known. The session is in Dinis Cruz's account; Dinis Cruz or the agent can list them.
- **How known:** from its commits and its person's pages, read 3 November 2026 04:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** keeps Dinis's dashboard, `people/dinis/dashboard.md`: Dinis's agents, the team's agents, the ecosystem's health, the decisions blocking Dinis, the day's milestones, the KPIs and OKRs.
- **Deployment scope:** only `people/dinis/dashboard.md` and its own entry in `data/keys.json` (the standard prompt); it also added a stand-up item for Dinis.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Dinis Cruz, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- Its session is the one that started as Dinis's conductor on 2 November (`people/dinis/agents.json`): the same session's earlier grant (the conductor's) carries over, and its Reach is as wide as the conductor's ABP describes.
- Write anywhere in the repository: its push access is not limited to `people/dinis/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 00:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Dinis Cruz's brief, part two |
| Writes only `people/dinis/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 3 November 2026 04:15 UTC): `people/dinis/dashboard.md`, `people/dinis/agents.json`, one stand-up item (the team's OKRs and KPIs) and its key entry. `people/dinis/agents.json` and the agenda item are outside the standard dashboard prompt's "only", and are the conductor's under the standard conductor prompt. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Dinis Cruz has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Dinis Cruz |
| Licensee | dashboard@web-summit.dinis (a Claude Code session in Dinis Cruz's account) |
| Conditions | the Mandate above; Dinis Cruz's brief, part two; CLAUDE.md |
| Validity | from 3 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis from the repository; Dinis Cruz and the agent correct it. Version 1, 3 November 2026, in `content/abp/` with its history in git.
