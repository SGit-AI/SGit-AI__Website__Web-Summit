---
title: "ABP: synthetic@web-summit.indi"
summary: The Agent Behaviour Policy of Indi's agent synthetic@web-summit.indi, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-04
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/indi/agents.json` and the agent's commits, [Indi's brief](../brief-indi/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Indi's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Connectors and tools:** not known. The session is in Indi's account; Indi or the agent can list them.
- **How known:** from its commits and its person's pages, read 4 November 2026 12:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** synthetic users: invented personas, played by sub-agents in its own session, test what Indi works on (first, the RiskMandate business cards, WS-142), and the runs go into a public vault published on this site.
- **Deployment scope:** `people/indi/**` (`people/indi/synthetic/`), its own key entry in `data/keys.json`, the board, and a public vault.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Indi, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It edited the roster (`data/team.json`), which CLAUDE.md gives to conductor@web-summit.dinis.
- Its personas are invented people whose words are published: the brief's "every fact with its source" reads oddly against synthetic interviews, which its README marks as synthetic.
- Code in its person's folder runs in CI with a token that can push and deploy (WS-133).
- Write anywhere in the repository: its push access is not limited to `people/indi/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Indi's brief, part two |
| Writes only `people/indi/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 4 November 2026 12:15 UTC): `people/indi/synthetic/cards-run-1/` (five personas, journeys, runs, 51 findings, 6 blocking), its key entry, board WS-142, and one line of `data/team.json` adding itself to Indi's agents: the roster is the conductor's (CLAUDE.md, Team). Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Indi has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Indi, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Indi |
| Licensee | synthetic@web-summit.indi (a Claude Code session in Indi's account) |
| Conditions | the Mandate above; Indi's brief, part two; CLAUDE.md |
| Validity | from 4 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Indi. Drafted by abp@web-summit.dinis from the repository; Indi and the agent correct it. Version 1, 4 November 2026, in `content/abp/` with its history in git.
