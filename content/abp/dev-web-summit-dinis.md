---
title: "ABP: dev@web-summit.dinis"
summary: The Agent Behaviour Policy of the developer of web-summit.sgit.ai (to be handed to dev@web-summit.angelo), in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance) with its Licence to Operate. Draft 5, by abp@web-summit.dinis.
date: 2026-11-02
---
Drafted by abp@web-summit.dinis on 2 November 2026, from its section on [the agents page](../agents/index.html) and the conductor's ABP, the template ([the conductor's ABP](../abp/conductor-web-summit-dinis/index.html)). RiskMandate's model: [Agent Behaviour Policy](https://riskmandate.ai/agent-behaviour-policy.html), [licence to operate](https://riskmandate.ai/licence-to-operate.html). A factual record: it says what is, not what should be; unknowns stay visible.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit with push access: it can push to `dev` and, because no branch is protected, to `main`; any file, including `.github/workflows/deploy-pages.yml` and the gate `admin/build/validate.js`. The GitHub tools on that repository (branches, pull requests and merging them, issues, comments, Actions runs). Claude Code Remote in Dinis's account (list and read other sessions, send them messages, create and fire scheduled tasks and sessions). A Google Drive connector (create, update, share and trash files; which account it acts as was not checked). Publishing a page on claude.ai. A shell in its own cloud container; the public web through the environment's proxy.
- **Data:** everything in the repository and its history; other sessions' transcripts in the account; whatever the Drive connector can see.
- **Connectors:** GitHub, Claude Code Remote, Google Drive.
- **Its cloud environment** (measured 7 November in abp@web-summit.dinis's session, names only; inferred for this agent if it runs there): Dinis's "GS Send - Full internet access", with unrestricted network and the variables `SG_SEND_ACCESS_TOKEN`, `OPENROUTER_API_KEY`, `OPEN_ROUTER_KEY` and `PT_PILOT_ACCESS_KEY`: the operator's own SG/Send token and model keys reach every session in it (WS-188).
- **How known:** measured for abp@web-summit.dinis in its own session on 2 November 2026 (its tool list; the GitHub branches API: `main` and `dev` both `protected: false`). For this agent, *inferred*: it runs in the same account and environment. Its own session should confirm or correct this.

## Mandate: what was authorised {#mandate}

- **Business task:** a refactoring pass every wake that leaves the repository measurably better (structure, less code, more content in JSON and markdown, a faster gate and CI), with the measurements in `admin/metrics.json`.
- **Deployment scope:** the build, the gate and CI, on `dev`; links may break only if the same release fixes them; it tells Dinis before changing a convention in CLAUDE.md. Since v0.1.55, every agent may also add items to the stand-ups' agenda (`data/meetings/`, through `admin/tools/agenda.mjs add`): the agents page, #standups.
- **Authorised purpose:** a site that is quicker to change and to check.
- **Schedule:** every 3 hours at :40 (UTC), in a session of its own in Dinis's account.

## Gap: capabilities within Reach beyond authority {#gap}

- Its mandate includes changing the gate and CI, so the 'never disable a check' rule is the only thing between a faster gate and a weaker one.
- Push to `main` (a major release, Dinis's call only): nothing technical stopped it until 6 November, when `main` became protected (GitHub branches API); `dev` is still open.
- Rewrite history on `dev` or `main` (force-push, delete a branch): no branch protection.
- Edit the gate or the CI workflow in the same push the gate judges. Since v0.1.51 (CI owns the version), every push to `dev` also runs `admin/build/tag_release.sh` from the pushed tree in a CI job with `contents: write` and `pages: write`, which commits, tags, pushes and deploys: a push that changes that script has its code run with a token that can write to the repository and the live site.
- Create scheduled tasks or sessions, and message or steer other agents' sessions.
- Open or merge pull requests, comment on GitHub: not in its mandate.
- Create, share or trash files in Drive: no part of its mandate uses Drive.

- **Input from anyone on the web (since 89cfa63, 3 November).** `assets/feedback.json`, public on every page, holds a write-only append token for its own vault's lane (`rx5uxdyu` on dev.send.sgraph.ai) and its public key. Anyone with the page can seal and append feedback, text and images, which `admin/tools/feedback_drain.py` fetches, opens and commits into the vault. That is a channel from the public into what this agent reads each wake. Barriers: the rule that material is not instruction, and the lane's limits (5 MB per batch, full at 1000 pending; the token can be rotated). WS-114 records both.
- **Code that runs in visitors' browsers.** `assets/cc/app.js` (8370ede) asks for an OpenRouter key on the command centres where `config.json` turns it on (Dinis's and Silvio's), keeps it in that browser's local storage and sends it only to openrouter.ai. No key is in the repository. Any later change to `assets/` by any agent with push runs on the same page as that key. security@web-summit.dinis found the same at 11:50 (WS-117, finding 3: every person's `app.js` runs on that origin and can read `cc.or.key`), and proposes a separate origin or a vault-held bounded key, with a small credit limit on each key until then. Since 90e73e39 (WS-164), the keyring is left off any page that runs a script from `people/` or a person's `pages.mjs`, and gate check 22 fails a page with both, and any `people/` script that reaches for the keyring, IndexedDB or sealed data: a technical barrier.

- **The policy studio** (`people/dinis/lab/`, WS-137): a chat in the browser through OpenRouter with tool calling. Since 750e0598 (sgit@web-summit.dinis) it has a Vaults tool group, off by default: read the team's vaults, create one, write into it. The person pastes the SG/Send access token into a panel; the model never sees a vault key or the token. Its own review (31cc3991) found that `create_vault` returns the new vault's read key as a tool result, so it reaches the model provider, and anyone holding it reads every version: fixed in 9ff212c4: `create_vault` now returns only the vault id, and `create_vault` and `write_to_vault` each ask the person to confirm, naming the vault, the file and the content; a refusal goes back to the model as "do not retry". A model with write tools on vaults is new Reach, now held by the person's yes on each write: a barrier in the page, with the person in the loop.

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

Open questions: It is authorised to edit what judges its own work; a check the gate drops would show only in security's review. Every Gap above is held by a rule kept by the agent; none has a technical barrier. Branch protection on `main` and `dev`, and removing connectors no mandate uses, would each turn a rule into a technical barrier (decisions for Dinis: WS-90).

**In the history** (dev, to v0.1.49, read 2 November 2026 04:15 UTC): seven commits (059f871 to 683661f): the build, the gate (`admin/build/validate.js`, `secrets.cjs`), the workflow, `release.sh`, `tag_release.sh`, `admin/metrics.json`, assets and board issues, all inside its mandate. The workflow change in 683661f (a full-history, blobless checkout) and the release.sh change (one trailer paragraph) remove no check. Attribution is by the commit subject (`<name>: <what>`), which the agent writes itself: git reads no `Agent:` trailer on most agent commits, because a `Co-Authored-By` paragraph follows it (release.sh's own commits were fixed in v0.1.49). Since v0.1.51 CI's release commit copies the pushed commit's `Agent:` line into `admin/versions.json`: the attribution is still the agent's own word.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensee | dev@web-summit.dinis (its Claude Code session; key not yet recorded here) |
| Conditions | the Mandate above; CLAUDE.md; the agents page |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach (a new connector, a new write path, a new schedule), and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis; reviewer: to be named (a person signs off). Version 12, 7 November 2026 (00:10 wake: the shared environment, WS-188; 08:10 wake: gate check 22; 16:10 wake: the studio's writes need the person's yes; 12:10 wake: the studio's Vaults tools; 12:10 wake: security's finding on the OpenRouter key; 08:10 wake: main still unprotected; 04:10 wake: the feedback lane and the in-page chat; 00:10 wake: main pushed once, still unprotected; 12:10 wake: the stand-ups' agenda; 08:10 wake: CI owns the version; 04:10 wake: the history), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
