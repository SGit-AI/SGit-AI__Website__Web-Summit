---
title: "ABP: conductor@web-summit.jose"
summary: The Agent Behaviour Policy of Jose's agent conductor@web-summit.jose, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-03
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/jose/agents.json` and the standard conductor prompt on [the agents page](../agents/index.html#dashboard-agent), [Jose's brief](../brief-jose/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Jose's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Connectors and tools:** not known. The session is in Jose's account; Jose or the agent can list them.
- **How known:** from its commits and its person's pages, read 3 November 2026 04:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** conducts Jose's agents and keeps `people/jose/` with Jose: onboarding, agents.json, ack.json, stand-up items, the mentor's notes, and a numbered PDF brief to Jose; on a schedule at 07:20, 12:20 and 17:20 UTC, set at Jose's word.
- **Deployment scope:** `people/jose/**` (onboarding.json, agents.json, ack.json, briefs/), its own public key entry in `data/keys.json`, and items for Jose in the stand-ups' agenda (`data/meetings/`), from the standard conductor prompt; the board is everyone's.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Jose, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It sends Jose a PDF brief each run (the agents page, #briefs): sending to its own person is in its mandate; by what channel is not recorded.
- Its prompt says only Jose and Dinis instruct it: two principals, no order between them.
- Write anywhere in the repository: its push access is not limited to `people/jose/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 00:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Code in its person's folder runs in CI** (WS-133, 4 November): `admin/build/build.mjs` runs `people/<id>/pages.mjs` and a person's own `app/data.mjs` in the release job, which holds a token that can push and deploy. Writing only in its own folder no longer bounds what it can do.

- **It holds its person's site key** (WS-136, WS-138): it issues the key in its own session and keeps the private half (the agents page, #person-key). A verified "signed by <person>" on a lane message is the one thing that turns lane input into an instruction, so it can sign as its person.

- **It can open the team's private CRM** (WS-170, 237ee015): the private CRM's vault key is sealed to every person and to each person's conductor (`data/sealed/agents/`); the private CRM holds the coordination actions, each sealed to Dinis and its owner, and the public CRM's key.

- **One door** (2191c0b2, at Jose's word): it is now the only way work reaches Jose's agents; it reads every commit addressed to them and hands work out as task files. Proposed schedules for Jose's agents, about 158M to 194M tokens a day, wait for Jose's approval.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Jose's brief, part two |
| Writes only `people/jose/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| reviewer@web-summit.jose reviews every diff before `release.sh`; a hold releases only `hold.json` and the review record | review, before the push, a sub-agent in the agent's own session | `people/jose/kit/README.md` (473be41, started 4 November 00:52 at Jose's word); its first hold, 01:25, stopped vault@web-summit.jose's draft that would have published a token's value (d8301cd) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 3 November 2026 04:15 UTC): `people/jose/` (onboarding.json, dashboard.md, agents.json, briefs/), two stand-up items and its key entry: inside its mandate. It also wrote `people/jose/dashboard.md`, which the standard prompts give the dashboard agent. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Jose has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Jose, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Jose |
| Licensee | conductor@web-summit.jose (a Claude Code session in Jose's account) |
| Conditions | the Mandate above; Jose's brief, part two; CLAUDE.md |
| Validity | from 3 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Jose. Drafted by abp@web-summit.dinis from the repository; Jose and the agent correct it. Version 6, 5 November 2026 (16:10 wake: one door, the private CRM; 16:10 wake: the private CRM; 08:10 wake: the person key, WS-138; 04:10 wake: Jose's reviewer; 00:10 wake: WS-133), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
