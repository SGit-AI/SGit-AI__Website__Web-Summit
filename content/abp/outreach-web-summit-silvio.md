---
title: "ABP: outreach@web-summit.silvio"
summary: The Agent Behaviour Policy of Silvio Switha's agent outreach@web-summit.silvio, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-05
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: Silvio's brief (part two, outreach@) and the agent's commits, [Silvio Switha's brief](../brief-silvio/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Silvio Switha's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Silvio's Gmail:** 28 drafts written there (03c3b62e); send rights not recorded.
- **Connectors and tools:** not known. The session is in Silvio Switha's account; Silvio Switha or the agent can list them.
- **How known:** from its commits and its person's pages, read 5 November 2026 04:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** Silvio's outreach: targets, personal emails drafted in Silvio's mail for Silvio to send, and follow-ups (WS-25, WS-26).
- **Deployment scope:** `people/silvio/**`, the board (WS-25, WS-26) and the agenda; drafts in Silvio's Gmail, which Silvio sends.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Silvio Switha, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It writes drafts in Silvio's Gmail: whether that connection can also send is not recorded; the rule that Silvio sends is in its brief, and the drafts wait for the conductor's two lines and Dinis's yes.
- Two agents of Silvio's draft to the same companies (its Gmail drafts and conductor@web-summit.silvio's messages.json); it asked which wins, rather than draft over the other's.
- Write anywhere in the repository: its push access is not limited to `people/silvio/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Proposed as an editor of the team CRM** (WS-172, cd594eb5): write access for each person's outreach agent, once it has a session key; not yet in place.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Silvio Switha's brief, part two |
| Writes only `people/silvio/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 5 November 2026 04:15 UTC): `people/silvio/`, board WS-25 and WS-26, and a decision for Dinis on the 5 November 13:00 agenda: inside its mandate. Its commit: 28 emails drafted overnight in Silvio's Gmail for Silvio to send, after Dinis's yes on the briefing. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Silvio Switha has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Silvio Switha, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Silvio Switha |
| Licensee | outreach@web-summit.silvio (a Claude Code session in Silvio Switha's account) |
| Conditions | the Mandate above; Silvio Switha's brief, part two; CLAUDE.md |
| Validity | from 5 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Silvio Switha. Drafted by abp@web-summit.dinis from the repository; Silvio Switha and the agent correct it. Version 2, 5 November 2026 (16:10 wake: CRM editor proposed), in `content/abp/` with its history in git.
