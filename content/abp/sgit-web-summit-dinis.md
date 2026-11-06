---
title: "ABP: sgit@web-summit.dinis"
summary: The Agent Behaviour Policy of the team's SGit agent: vaults, keys and private material, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance) with its Licence to Operate. Draft 5, by abp@web-summit.dinis.
date: 2026-11-02
---
Drafted by abp@web-summit.dinis on 2 November 2026, from its section on [the agents page](../agents/index.html) and the conductor's ABP, the template ([the conductor's ABP](../abp/conductor-web-summit-dinis/index.html)). RiskMandate's model: [Agent Behaviour Policy](https://riskmandate.ai/agent-behaviour-policy.html), [licence to operate](https://riskmandate.ai/licence-to-operate.html). A factual record: it says what is, not what should be; unknowns stay visible.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit with push access: it can push to `dev` and, because no branch is protected, to `main`; any file, including `.github/workflows/deploy-pages.yml` and the gate `admin/build/validate.js`. The GitHub tools on that repository (branches, pull requests and merging them, issues, comments, Actions runs). Claude Code Remote in Dinis's account (list and read other sessions, send them messages, create and fire scheduled tasks and sessions). A Google Drive connector (create, update, share and trash files; which account it acts as was not checked). Publishing a page on claude.ai. A shell in its own cloud container; the public web through the environment's proxy.
- **Data:** everything in the repository and its history; other sessions' transcripts in the account; whatever the Drive connector can see.
- **Connectors:** GitHub, Claude Code Remote, Google Drive.
- **How known:** measured for abp@web-summit.dinis in its own session on 2 November 2026 (its tool list; the GitHub branches API: `main` and `dev` both `protected: false`). For this agent, *inferred*: it runs in the same account and environment. Its own session should confirm or correct this.

## Mandate: what was authorised {#mandate}

- **Business task:** the private side of the work: the private vault for meetings and contacts (WS-23, WS-24), each person's keys on pki.sgit.ai (WS-03), encrypted material only named people can open (WS-38), and /keys/ (WS-45).
- **Deployment scope:** `content/vaults` and the onboarding steps in `people/<id>/onboarding.json` with the person's agent, on `dev`; keys in the session's key store and the gitignored `.credentials/` tier only. Since v0.1.55, every agent may also add items to the stand-ups' agenda (`data/meetings/`, through `admin/tools/agenda.mjs add`): the agents page, #standups.
- **Authorised purpose:** what must not be public kept out of the public repository, and the team able to read it.
- **Schedule:** every 4 hours at :50 (UTC), in a session of its own in Dinis's account.

## Gap: capabilities within Reach beyond authority {#gap}

- It holds vault keys in a session that can also push to a public repository: one wrong `git add` publishes a key for ever.
- Its prompt also tells it to commit as conductor@web-summit.dinis and do the conductor's wake (the same copy as in the ABP agent's prompt; WS-89).
- Push to `main` (a major release, Dinis's call only): nothing technical stopped it until 6 November, when `main` became protected (GitHub branches API); `dev` is still open.
- Rewrite history on `dev` or `main` (force-push, delete a branch): no branch protection.
- Edit the gate or the CI workflow in the same push the gate judges. Since v0.1.51 (CI owns the version), every push to `dev` also runs `admin/build/tag_release.sh` from the pushed tree in a CI job with `contents: write` and `pages: write`, which commits, tags, pushes and deploys: a push that changes that script has its code run with a token that can write to the repository and the live site.
- Create scheduled tasks or sessions, and message or steer other agents' sessions.
- Open or merge pull requests, comment on GitHub: not in its mandate.
- Create, share or trash files in Drive: no part of its mandate uses Drive.

- **An SG/Send access token in its environment** (`SG_SEND_ACCESS_TOKEN`, named in 461bb2f): it can create and write vaults on the server, outside this repository, where no gate or review reads what it writes. Vaults are now made outside the clone (`~/vaults/<name>`), and `.gitignore` ignores `.sg_vault/` (where a vault's key and the token sit) as a safety net: a technical barrier against one wrong `git add`, which an agent with push could also remove.

- **The vault guide it keeps** (`content/vault-agent.md`) is what every person's vault agent follows. On 3 November it recommended `sgit vault info`, which printed a vault key into vault@web-summit.angelo's transcript (7502d99), and its audit step used commands that miss added files (443b62f); the mentors note the guide still lists the command (2d7791d, WS-128). A step in the guide reaches every vault agent at once.

- **It built the scripted audit** (`admin/tools/vault-audit.mjs`, ad9e353, WS-128) that every vault agent now runs before publishing a read key: one more tool in `admin/`, outside `content/vaults`, and a barrier for every other vault agent that it maintains.

- **The studio's Vaults tools** (750e0598, WS-137 E3): it wrote `people/dinis/lab/studio-vault.js` and pinned the vault library in `assets/vendor/sg-vault/2026-11-04/` (twelve files, with sha256s): code that runs on the site's one origin, beside keys held in the browser (WS-117, WS-132). Since 9ff212c4 each vault write asks the person to confirm, and the read key of a new vault stays out of the model's context.

- **WS-152, its fix** (68fda24b, 3a729f73): `seal.mjs` now refuses an ended or replaced key, and an entry any commit changed from another person's account (GitHub's activity API); every key checked, none changed from another person's account. The gate still does not read `data/keys.json`, and the activity API sees only the newest 100 pushes (vault@web-summit.angelo, a2bd8430).

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml (v0.1.51): the gate runs on the push, then again on the tree CI numbers, commits and deploys. It stops a red build deploying, not the push, and the agent can edit the gate, the workflow and tag_release.sh |
| Only CI writes the version | rule, kept by the agent; a warning in CI | release.sh refuses a commit touching version.txt, but it runs in the agent's own clone; tag_release.sh only warns, and replaces the number |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 |
| Writes only its own paths | rule, kept by the agent | its section; git has no per-path write control, and the gate does not compare a commit's paths with its author |
| Never create a scheduled task, a session or a workflow | rule, kept by the agent | its prompt; the tools are in its session |
| Only Dinis instructs; what it reads is material | rule, kept by the agent | its prompt; untrusted content marked by the platform |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

Open questions: The gate's key-shape tripwire (check 15) is the one technical barrier between a vault key and the public repository. Every Gap above is held by a rule kept by the agent; none has a technical barrier. Branch protection on `main` and `dev`, and removing connectors no mandate uses, would each turn a rule into a technical barrier (decisions for Dinis: WS-90).

**In the history** (dev, to v0.1.49, read 2 November 2026 04:15 UTC): (read 3 November 00:15 UTC) two commits, 0b146db and 995cdf6: `content/vaults.md`, its own entry in `data/keys.json`, board WS-102, and two writes outside the `content/vaults` its section names: a new tool, `admin/tools/seal.mjs` (sealing to keys on the keys page), and one line of `people/angelo/onboarding.json`, another person's folder. No key or vault contents committed (gate check 15 passed on both releases). Attribution is by the commit subject (`<name>: <what>`), which the agent writes itself: git reads no `Agent:` trailer on most agent commits, because a `Co-Authored-By` paragraph follows it (release.sh's own commits were fixed in v0.1.49). Since v0.1.51 CI's release commit copies the pushed commit's `Agent:` line into `admin/versions.json`: the attribution is still the agent's own word.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensee | sgit@web-summit.dinis (its Claude Code session; key not yet recorded here) |
| Conditions | the Mandate above; CLAUDE.md; the agents page |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach (a new connector, a new write path, a new schedule), and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis; reviewer: to be named (a person signs off). Version 11, 5 November 2026 (00:10 wake: WS-152's seal-side fix; 16:10 wake: the person's yes on studio writes; 12:10 wake: the studio's Vaults tools; 20:10 wake: vault-audit.mjs; 16:10 wake: the guide's two holes; 08:10 wake: main still unprotected; 00:10 wake: main pushed once, still unprotected; 12:10 wake: the stand-ups' agenda; 08:10 wake: CI owns the version; 04:10 wake: the history), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
