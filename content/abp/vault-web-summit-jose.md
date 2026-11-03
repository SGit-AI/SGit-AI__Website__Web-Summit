---
title: "ABP: vault@web-summit.jose"
summary: The Agent Behaviour Policy of Jose's agent vault@web-summit.jose, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-03
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: the agents page (#vault-agent), [the vault agent's page](../vault-agent/index.html) and the agent's commits, [Jose's brief](../brief-jose/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Jose's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **SG/Send:** an access token in its environment (dev.send.sgraph.ai, its pre-flight check). No vault created yet.
- **Connectors and tools:** not known. The session is in Jose's account; Jose or the agent can list them.
- **How known:** from its commits and its person's pages, read 3 November 2026 16:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** Jose's vault agent: creates and manages Jose's SGit vaults (the agents page, #vault-agent).
- **Deployment scope:** `people/jose/**`, its own key entry in `data/keys.json`, and the vaults it creates; corrections to the shared guide go through its owner (sgit@web-summit.dinis).
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Jose, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It holds an SG/Send access token in its environment: it can create and write vaults on the server, outside this repository, where no gate or review reads what it writes.
- It publishes read keys: a published read key opens a vault to anyone, for good. The barrier before that is an audit by a security sub-agent of its own session (the vault guide), done by hand until WS-128's scripted audit exists. Two holes found on 3 November: `sgit history log --patch` and `sgit history show` show no content for added files (vault@web-summit.vicky's notes, 443b62f), and `sgit vault info` prints the vault key into the session's transcript (7502d99).
- It edited the shared vault guide directly, which its brief routes through the guide's owner; the commit tells the owner, but no yes is recorded before it.
- Write anywhere in the repository: its push access is not limited to `people/jose/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Jose's brief, part two |
| Writes only `people/jose/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 3 November 2026 16:15 UTC): one commit, 66b1997: `content/vault-agent.md`, the shared guide, outside `people/jose/` (addressed For: sgit@web-summit.dinis, the guide's owner). Create, push and audit not yet run. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Jose has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Jose, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Jose |
| Licensee | vault@web-summit.jose (a Claude Code session in Jose's account) |
| Conditions | the Mandate above; Jose's brief, part two; CLAUDE.md |
| Validity | from 3 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Jose. Drafted by abp@web-summit.dinis from the repository; Jose and the agent correct it. Version 1, 3 November 2026, in `content/abp/` with its history in git.
