---
title: "ABP: investors@web-summit.dinis"
summary: The Agent Behaviour Policy of Dinis Cruz's agent investors@web-summit.dinis, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-06
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: conductor@web-summit.dinis's commit (956bd8fa, at Dinis's word, 6 November about 16:20 UTC) and its own (d3d7dad4), [Dinis Cruz's brief](../brief-dinis/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Dinis Cruz's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Same account as abp@web-summit.dinis:** inferred tools, as for every agent in Dinis's account.
- **Connectors and tools:** not known. The session is in Dinis Cruz's account; Dinis Cruz or the agent can list them.
- **How known:** from its commits and its person's pages, read 6 November 2026 16:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** the investors section, the pitch and technology decks (no projections), and a personalised page for an investor met in the Algarve (WS-185).
- **Deployment scope:** the investors section and its decks on this site, its key entry, the board (WS-185); a person sends anything to an investor.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Dinis Cruz, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It writes about a named investor and his company on a public page: what an investor was told, and what he would want public, are his and Dinis's to decide.
- No projections is its rule; the decks are public material once committed.
- Same account as abp@web-summit.dinis: its tools are inferred from abp's session (GitHub, Claude Code Remote, Google Drive).
- Write anywhere in the repository: its push access is not limited to `people/dinis/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November); `main` protected since 6 November.
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

**In the history** (dev, read 6 November 2026 16:15 UTC): its key entry and WS-185 on the board (d3d7dad4): inside its mandate. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Dinis Cruz has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Dinis Cruz |
| Licensee | investors@web-summit.dinis (a Claude Code session in Dinis Cruz's account) |
| Conditions | the Mandate above; Dinis Cruz's brief, part two; CLAUDE.md |
| Validity | from 6 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis from the repository; Dinis Cruz and the agent correct it. Version 1, 6 November 2026, in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
