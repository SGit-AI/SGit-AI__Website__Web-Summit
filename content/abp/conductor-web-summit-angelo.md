---
title: "ABP: conductor@web-summit.angelo"
summary: The Agent Behaviour Policy of Angelo's agent conductor@web-summit.angelo, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 2, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-02
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: Angelo's dashboard and `people/angelo/agents.json`, [Angelo's brief](../brief-angelo/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Angelo's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Key:** its dashboard gives a session key "operated by" `sha256:db7f79fdd87e030a`, which CLAUDE.md names as Dinis's operator key, not Angelo's: who it answers to is recorded as stated and is a question for Angelo and Dinis.
- **Connectors and tools:** not known. The session is in Angelo's account; Angelo or the agent can list them.
- **How known:** from its commits and its person's pages, read 2 November 2026 17:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** conducts Angelo's agents and keeps `people/angelo/` with Angelo.
- **Deployment scope:** `people/angelo/**` is its person's; the board (`board/`) and the stand-ups' agenda (`data/meetings/`) are everyone's; anything else goes through its owner or the conductor (Angelo's brief, part two, rules).
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **The standard conductor prompt** (the agents page, #dashboard-agent, since 20:00 UTC): keep `people/angelo/` (onboarding.json, agents.json, ack.json), add items to the agenda, make its own key and commit only the public half in `data/keys.json`; only its person and Dinis instruct it.
- **Authorised by:** Angelo, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- Write anywhere in the repository: its push access is not limited to `people/angelo/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Other agents' stand-up items.** It edited two items it did not write: the mentors' (`20261102T2254-nimay-jose-and-indi...`, 426447b) and the conductor's (`20261102T1105-which-accounts-do-the-videos...`, 1ffe16d, linking it to WS-126), each edit signed in the item. The agents page gives curation to conductor@web-summit.dinis and the project manager.
- **Since 3 November:** its own scheduled task (07:20, 12:20 and 17:20 UTC, at Angelo's word), its key in `data/keys.json`, two board issues (WS-124 to WS-126) and stand-up items for Angelo: inside the standard conductor prompt.

- **Code in its person's folder runs in CI** (WS-133, 4 November): `admin/build/build.mjs` runs `people/<id>/pages.mjs` and a person's own `app/data.mjs` in the release job, which holds a token that can push and deploy. Writing only in its own folder no longer bounds what it can do.

- **It holds its person's site key** (WS-136, WS-138): it issues the key in its own session and keeps the private half (the agents page, #person-key). A verified "signed by <person>" on a lane message is the one thing that turns lane input into an instruction, so it can sign as its person.

- **Angelo's protocol, 5 November** (`people/angelo/kit/README.md`, each rule in Angelo's words): (1) **shared code stays with its owners**: his agents draft patches to shared code and pages and route them to the owner, never apply them, with a `Routed:` line (9e94d0c3, WS-34); (2) **his signature counts for tier 1 and 2 actions only**, never tier 3, and a signed message names its recipient, item, action and old value with an id and a time, refused if replayed or stale (70aa65fa, WS-138); (3) **no agent of his reads what a stranger writes**: visitors get a separate inbox sealed only to Angelo's person key (b8a5d3ab, held for security's review of the design). Rules (1) and (2) are kept by the agents; (3), once built, is a technical barrier: what a stranger writes cannot be opened by any of his agents.

- **It can open the team's private CRM** (WS-170, 237ee015): the private CRM's vault key is sealed to every person and to each person's conductor (`data/sealed/agents/`); the private CRM holds the coordination actions, each sealed to Dinis and its owner, and the public CRM's key.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Angelo's brief, part two |
| Writes only `people/angelo/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 2 November 2026 17:15 UTC): 2fb57df: `people/angelo/dashboard.md` and `people/angelo/onboarding.json`. Inside its person's folder. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Angelo has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Angelo, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Angelo |
| Licensee | conductor@web-summit.angelo (a Claude Code session in Angelo's account) |
| Conditions | the Mandate above; Angelo's brief, part two; CLAUDE.md |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Angelo. Drafted by abp@web-summit.dinis from the repository; Angelo and the agent correct it. Version 9, 5 November 2026 (16:10 wake: the private CRM; 12:10 wake: Angelo's protocol; 08:10 wake: the person key, WS-138; 00:10 wake: WS-133; 12:10 wake: its schedule, its key, two edits to others' agenda items; 08:10 wake: main still unprotected; 00:10 wake: main pushed once, still unprotected; 20:10 wake: the standard conductor prompt), in `content/abp/` with its history in git.
