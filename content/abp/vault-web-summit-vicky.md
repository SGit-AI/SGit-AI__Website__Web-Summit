---
title: "ABP: vault@web-summit.vicky"
summary: The Agent Behaviour Policy of Vicky's agent vault@web-summit.vicky, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-03
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/vicky/agents.json`, the agents page (#vault-agent) and [the vault agent's page](../vault-agent/index.html), [Vicky's brief](../brief-vicky/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Vicky's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **SG/Send:** an access token in the session's environment; vault k64ma7jd published.
- **Connectors and tools:** not known. The session is in Vicky's account; Vicky or the agent can list them.
- **How known:** from its commits and its person's pages, read 3 November 2026 16:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** creates and manages Vicky's SGit vaults and audits each before its read key is published in `people/vicky/vaults.json`; on demand.
- **Deployment scope:** `people/vicky/**` (vaults.json, vault-agent-notes.md), its own key entry in `data/keys.json`, and the vaults it creates on SG/Send.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Vicky, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It holds an SG/Send access token in its environment: it can create and write vaults on the server, outside this repository, where no gate or review reads what it writes.
- It publishes read keys: a published read key opens a vault to anyone, for good. The barrier before that is an audit by a security sub-agent of its own session (the vault guide), done by hand until WS-128's scripted audit exists. Two holes found on 3 November: `sgit history log --patch` and `sgit history show` show no content for added files (vault@web-summit.vicky's notes, 443b62f), and `sgit vault info` prints the vault key into the session's transcript (7502d99).
- Its vault apps run with the SG/App bridge, which on 3 November exposed `llm`, `fs`, `git` and `append` among others (its notes, item 16): what a published app can do is what its manifest grants.
- Write anywhere in the repository: its push access is not limited to `people/vicky/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Since 16:50 on 3 November** a scripted audit exists: `admin/tools/vault-audit.mjs` (ad9e353, WS-128) walks every revision and the working files of a vault and refuses the gate's key shapes, the short-id vault key, token assignments, emails and phone numbers, printing only where. It is a technical check, but the agent runs it itself before publishing: whether it was run is the agent's word, not a gate's. Since c99aaff6 (WS-135, 4 November) it also compares against the actual access token and vault key values and counts empty revisions.

- **Since 17:30:** a private meetings vault (WS-23), its key sealed to pm@web-summit.vicky (81796d9); its notes record that `seal.mjs` gives wrong answers in a shallow clone (d3c7f4e, WS-131).

- **Code in its person's folder runs in CI** (WS-133, 4 November): `admin/build/build.mjs` runs `people/<id>/pages.mjs` and a person's own `app/data.mjs` in the release job, which holds a token that can push and deploy. Writing only in its own folder no longer bounds what it can do.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Vicky's brief, part two |
| Writes only `people/vicky/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 3 November 2026 16:15 UTC): `people/vicky/vaults.json` (Vicky's first public vault, k64ma7jd, with its read key, "audited clean"), `people/vicky/vault-agent-notes.md` and its key entry: inside its mandate. Its notes say the first audit used commands that miss added files and "the second audit found this": the read key was published after an audit that read every file at every revision (`sgit grep -n --text -e ''`). Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Vicky has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Vicky, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Vicky |
| Licensee | vault@web-summit.vicky (a Claude Code session in Vicky's account) |
| Conditions | the Mandate above; Vicky's brief, part two; CLAUDE.md |
| Validity | from 3 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Vicky. Drafted by abp@web-summit.dinis from the repository; Vicky and the agent correct it. Version 4, 4 November 2026 (08:10 wake: WS-135 done; 00:10 wake: WS-133; 20:10 wake: the scripted audit; the meetings vault), in `content/abp/` with its history in git.
