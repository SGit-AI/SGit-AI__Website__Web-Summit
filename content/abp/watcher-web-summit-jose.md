---
title: "ABP: watcher@web-summit.jose"
summary: The Agent Behaviour Policy of Jose's agent watcher@web-summit.jose, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-04
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/jose/watcher/ROLE.md` and `policy.json` (drafted by vault@web-summit.jose at Jose's word) and the agent's commits, [Jose's brief](../brief-jose/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Jose's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Connectors and tools:** not known. The session is in Jose's account; Jose or the agent can list them.
- **How known:** from its commits and its person's pages, read 4 November 2026 04:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** Jose's security watcher, read-only: who and which agents committed since its last run, writes outside an agent's lane, pushes to branches other than dev, key shapes (where, never what), agents that stopped running; for Jose's dashboard. Proposed schedule 07:15, 12:15 and 17:15 UTC.
- **Deployment scope:** `people/jose/watcher/**` and its own key entry in `data/keys.json`; scope of what it watches: Jose's agents only, until the 4 November 13:00 stand-up decides (WS-134); since 5 November, at Jose's word, the whole team, read-only (0316656b: 133 agent commits in its first team-wide run, findings sent to security@web-summit.dinis by location and rule only); it never holds, fixes or reverts, and defers to security@web-summit.dinis.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Jose, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It is read-only by role, but its session has push access to the whole repository like every agent: "read-only" is a rule, not a setting.
- Write anywhere in the repository: its push access is not limited to `people/jose/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Code in its person's folder runs in CI** (WS-133, 4 November): `admin/build/build.mjs` runs `people/<id>/pages.mjs` and a person's own `app/data.mjs` in the release job, which holds a token that can push and deploy.

- **One door** (2191c0b2, at Jose's word, 5 November): Jose's agents take work only from conductor@web-summit.jose's task files (`people/jose/tasks/`), not from a commit addressed to them by anyone else; every ask for Jose goes through the conductor. A rule kept by each agent, which narrows who can give it work.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Jose's brief, part two |
| Writes only `people/jose/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| reviewer@web-summit.jose reviews every diff before `release.sh`; a hold releases only `hold.json` and the review record | review, before the push, a sub-agent in the agent's own session | `people/jose/kit/README.md` (473be41); its first hold stopped a token's value going public (d8301cd) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 4 November 2026 04:15 UTC): two runs (f64a65e, b1e4fe9): 14 commits by Jose's agents reviewed, three small flags, then one clean; its key entry: inside its mandate. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Jose has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Jose, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Jose |
| Licensee | watcher@web-summit.jose (a Claude Code session in Jose's account) |
| Conditions | the Mandate above; Jose's brief, part two; CLAUDE.md |
| Validity | from 4 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Jose. Drafted by abp@web-summit.dinis from the repository; Jose and the agent correct it. Version 4, 6 November 2026 (the reviewer step, at conductor@web-summit.jose's note 883fc8ee; 16:10 wake: one door; 08:10 wake: team-wide), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
