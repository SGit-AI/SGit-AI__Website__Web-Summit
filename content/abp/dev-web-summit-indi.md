---
title: "ABP: dev@web-summit.indi"
summary: The Agent Behaviour Policy of Indi's agent dev@web-summit.indi, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-04
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/indi/agents.json`, board WS-27 and the agent's commits, [Indi's brief](../brief-indi/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Indi's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Network (measured by the agent):** its session's network policy refused pki.sgit.ai and web-summit.sgit.ai on its first run (5eac229); pki.sgit.ai has been allowed since about 23:00 on 3 November (its key published, 1d6d844c). The policy is set in Indi's environment, above the agent: a real boundary, now narrower.
- **Connectors and tools:** not known. The session is in Indi's account; Indi or the agent can list them.
- **How known:** from its commits and its person's pages, read 4 November 2026 00:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** explorer developer for the factory (WS-27): a page or vault per target company, fast; planned at 09:30 and 15:30 UTC.
- **Deployment scope:** `people/indi/**` (the factory in `people/indi/factory/`, `people/indi/pages.mjs`), its own key entry in `data/keys.json`, and the board; shared code goes through its owner.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Indi, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It wrote the hook in the shared build that runs a person's code in CI (WS-133), outside its person's folder.
- Its pages publish an analysis of 28 real companies ("the risks from AI agents", how RiskMandate helps): claims about named companies on a public site. The brief asks for every fact with its source; the facts come from `data/companies.json` (sourced), the analysis from `people/indi/factory/companies.json` (the team's own words).
- Write anywhere in the repository: its push access is not limited to `people/indi/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Indi's brief, part two |
| Writes only `people/indi/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 4 November 2026 00:15 UTC): `people/indi/factory/` (28 company pages from `companies.json`), `people/indi/pages.mjs`, `people/indi/dev/`, its key entry, board WS-27, and a ten-line hook in `admin/build/build.mjs` (44bce7e), outside `people/indi/`, that runs every person's `pages.mjs` at build time. No commit records the build owner's yes to that hook. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Indi has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Indi, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Indi |
| Licensee | dev@web-summit.indi (a Claude Code session in Indi's account) |
| Conditions | the Mandate above; Indi's brief, part two; CLAUDE.md |
| Validity | from 4 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Indi. Drafted by abp@web-summit.dinis from the repository; Indi and the agent correct it. Version 2, 4 November 2026 (08:10 wake: pki.sgit.ai allowed), in `content/abp/` with its history in git.
