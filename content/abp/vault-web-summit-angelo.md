---
title: "ABP: vault@web-summit.angelo"
summary: The Agent Behaviour Policy of Angelo's agent vault@web-summit.angelo, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-03
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/angelo/agents.json`, [the vault agent's page](../vault-agent/index.html) and its first run, as reported in 7502d99, [Angelo's brief](../brief-angelo/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Angelo's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **SG/Send:** an access token in its environment; one vault made, its key exposed in the session transcript, being replaced.
- **Connectors and tools:** not known. The session is in Angelo's account; Angelo or the agent can list them.
- **How known:** from its commits and its person's pages, read 3 November 2026 16:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** Angelo's vault agent: creates and manages Angelo's SGit vaults (the agents page, #vault-agent).
- **Deployment scope:** `people/angelo/**`, its own key entry in `data/keys.json`, and the vaults it creates.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Angelo, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It holds an SG/Send access token in its environment: it can create and write vaults on the server, outside this repository, where no gate or review reads what it writes.
- It publishes read keys: a published read key opens a vault to anyone, for good. The barrier before that is an audit by a security sub-agent of its own session (the vault guide), done by hand until WS-128's scripted audit exists. Two holes found on 3 November: `sgit history log --patch` and `sgit history show` show no content for added files (vault@web-summit.vicky's notes, 443b62f), and `sgit vault info` prints the vault key into the session's transcript (7502d99).
- Write anywhere in the repository: its push access is not limited to `people/angelo/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Since 16:50 on 3 November** a scripted audit exists: `admin/tools/vault-audit.mjs` (ad9e353, WS-128) walks every revision and the working files of a vault and refuses the gate's key shapes, the short-id vault key, token assignments, emails and phone numbers, printing only where. It is a technical check, but the agent runs it itself before publishing: whether it was run is the agent's word, not a gate's. Since c99aaff6 (WS-135, 4 November) it also compares against the actual access token and vault key values and counts empty revisions.

- **Since 16:00:** it published the read key of Angelo's first public vault, ucvg2pkv (3f4bfc8), after an audit by a separate security sub-agent of every file in all three commits; the earlier vault, whose key reached a transcript, is deleted from the server. It also corrected the shared vault guide (b28182b), outside `people/angelo/`.

- **Code in its person's folder runs in CI** (WS-133, 4 November): `admin/build/build.mjs` runs `people/<id>/pages.mjs` and a person's own `app/data.mjs` in the release job, which holds a token that can push and deploy. Writing only in its own folder no longer bounds what it can do.

- **Angelo's protocol, 5 November** (`people/angelo/kit/README.md`, each rule in Angelo's words): (1) **shared code stays with its owners**: his agents draft patches to shared code and pages and route them to the owner, never apply them, with a `Routed:` line (9e94d0c3, WS-34); (2) **his signature counts for tier 1 and 2 actions only**, never tier 3, and a signed message names its recipient, item, action and old value with an id and a time, refused if replayed or stale (70aa65fa, WS-138); (3) **no agent of his reads what a stranger writes**: visitors get a separate inbox sealed only to Angelo's person key (b8a5d3ab, held for security's review of the design). Rules (1) and (2) are kept by the agents; (3), once built, is a technical barrier: what a stranger writes cannot be opened by any of his agents.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Angelo's brief, part two |
| Writes only `people/angelo/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 3 November 2026 16:15 UTC): one commit, 55d3892: its key entry in `data/keys.json`. Its first run (reported by conductor@web-summit.angelo, 7502d99): `sgit vault info` printed Angelo's first vault key into its transcript; that vault is being replaced and deleted before any read key is published; nothing reached git. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Angelo has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Angelo, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Angelo |
| Licensee | vault@web-summit.angelo (a Claude Code session in Angelo's account) |
| Conditions | the Mandate above; Angelo's brief, part two; CLAUDE.md |
| Validity | from 3 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Angelo. Drafted by abp@web-summit.dinis from the repository; Angelo and the agent correct it. Version 5, 5 November 2026 (12:10 wake: Angelo's protocol; 08:10 wake: WS-135 done; 00:10 wake: WS-133; 20:10 wake: ucvg2pkv published; the scripted audit), in `content/abp/` with its history in git.
