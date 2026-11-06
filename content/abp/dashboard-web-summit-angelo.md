---
title: "ABP: dashboard@web-summit.angelo"
summary: The Agent Behaviour Policy of Angelo's agent dashboard@web-summit.angelo, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-03
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/angelo/agents.json` and the standard dashboard-agent prompt on [the agents page](../agents/index.html#dashboard-agent), [Angelo's brief](../brief-angelo/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Angelo's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Connectors and tools:** not known. The session is in Angelo's account; Angelo or the agent can list them.
- **How known:** from its commits and its person's pages, read 3 November 2026 12:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** keeps Angelo's command centre (his first view) and the classic dashboard, and asks Angelo one question a run; on a schedule at 07:30, 12:30 and 17:30 UTC.
- **Deployment scope:** `people/angelo/dashboard.md` and its own entry in `data/keys.json` (the standard prompt), and, at Angelo's word, his command centre's `people/angelo/app/config.json`.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Angelo, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- `people/angelo/app/config.json` decides what Angelo's command centre loads and whether its Ask Claude chat is on; the command centre runs on the site's one origin, where every person's `app.js` can read keys kept in the browser (WS-117, security's finding 3). Since 90e73e39 (WS-164), the keyring is left off any page that runs a script from `people/` or a person's `pages.mjs`, and gate check 22 fails a page with both, and any `people/` script that reaches for the keyring, IndexedDB or sealed data: a technical barrier.
- Write anywhere in the repository: its push access is not limited to `people/angelo/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Code in its person's folder runs in CI** (WS-133, 4 November): `admin/build/build.mjs` runs `people/<id>/pages.mjs` and a person's own `app/data.mjs` in the release job, which holds a token that can push and deploy. Writing only in its own folder no longer bounds what it can do.

- **Angelo's protocol, 5 November** (`people/angelo/kit/README.md`, each rule in Angelo's words): (1) **shared code stays with its owners**: his agents draft patches to shared code and pages and route them to the owner, never apply them, with a `Routed:` line (9e94d0c3, WS-34); (2) **his signature counts for tier 1 and 2 actions only**, never tier 3, and a signed message names its recipient, item, action and old value with an id and a time, refused if replayed or stale (70aa65fa, WS-138); (3) **no agent of his reads what a stranger writes**: visitors get a separate inbox sealed only to Angelo's person key (b8a5d3ab, held for security's review of the design). Rules (1) and (2) are kept by the agents; (3), once built, is a technical barrier: what a stranger writes cannot be opened by any of his agents.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Angelo's brief, part two |
| Writes only `people/angelo/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 3 November 2026 12:15 UTC): `people/angelo/dashboard.md`, `people/angelo/app/config.json` and its key entry. `app/config.json` is beyond the standard prompt's "only"; `people/angelo/agents.json` records the command centre as its job. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Angelo has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Angelo, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Angelo |
| Licensee | dashboard@web-summit.angelo (a Claude Code session in Angelo's account) |
| Conditions | the Mandate above; Angelo's brief, part two; CLAUDE.md |
| Validity | from 3 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Angelo. Drafted by abp@web-summit.dinis from the repository; Angelo and the agent correct it. Version 4, 5 November 2026 (12:10 wake: Angelo's protocol; 08:10 wake: gate check 22; 00:10 wake: WS-133), in `content/abp/` with its history in git.
