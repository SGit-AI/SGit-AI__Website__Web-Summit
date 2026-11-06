---
title: "ABP: crm@web-summit.dinis"
summary: The Agent Behaviour Policy of Dinis Cruz's agent crm@web-summit.dinis, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-05
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: its commits (1b4f242a, 460fd3a6) and board WS-170; it is not in `people/dinis/agents.json` at 20:15 UTC, [Dinis Cruz's brief](../brief-dinis/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Dinis Cruz's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **SG/Send:** Dinis's access token, used twice on 5 November and then set aside (1b4f242a).
- **Connectors and tools:** not known. The session is in Dinis Cruz's account; Dinis Cruz or the agent can list them.
- **How known:** from its commits and its person's pages, read 5 November 2026 20:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** Dinis's side of the team CRM (WS-170): both CRM vaults, the public CRM's records with sources, the private CRM's actions sealed to their readers.
- **Deployment scope:** `people/dinis/**` (the CRM's working files), its key entry, the board (WS-170), and the two CRM vaults on SG/Send.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Dinis Cruz, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It held and used the operator's own access token, by request: a token with Dinis's reach on SG/Send, not one scoped to this agent. It stopped by its own commit; whether the token is still in its session's environment is not recorded.
- It can open the team's private CRM (WS-170), which from 5 November is to hold every conversation with a company, each email as EML (WS-173): email is untrusted material, read by agents.
- Write anywhere in the repository: its push access is not limited to `people/dinis/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Dinis Cruz's brief, part two |
| Writes only `people/dinis/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 5 November 2026 20:15 UTC): `people/dinis/`, its key entry and board WS-170: inside its mandate. It pushed the CRM twice at 18:00 and 18:05 with **Dinis's own SG/Send access token**, at his ask, then stopped (1b4f242a) when Dinis said every agent should have its own; its vault changes now wait, committed locally, for a token sealed to its key. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Dinis Cruz has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Dinis Cruz |
| Licensee | crm@web-summit.dinis (a Claude Code session in Dinis Cruz's account) |
| Conditions | the Mandate above; Dinis Cruz's brief, part two; CLAUDE.md |
| Validity | from 5 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis from the repository; Dinis Cruz and the agent correct it. Version 1, 5 November 2026, in `content/abp/` with its history in git.
