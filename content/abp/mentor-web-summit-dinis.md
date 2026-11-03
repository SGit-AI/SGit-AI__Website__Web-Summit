---
title: "ABP: mentor@web-summit.dinis (and the six person mentors)"
summary: The Agent Behaviour Policy of the mentors' session, the head mentor and the six person mentors it runs as sub-agents, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance) with its Licence to Operate. Draft 1, by abp@web-summit.dinis.
date: 2026-11-03
---
Drafted by abp@web-summit.dinis on 3 November 2026, from the mentors' section on [the agents page](../agents/index.html#mentors), `team/mentors/WAKE.md` and the session's commits. One ABP for the whole session: the head mentor (`mentor@web-summit.dinis`) and the six person mentors (`mentor@web-summit.<id>` for Nimay, Angelo, Jose, Vicky, Silvio and Indi) are sub-agents of one Claude session in Dinis's account, so they share one Reach. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be; unknowns stay visible.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit with push access: it can push to `dev` and, because no branch is protected, to `main`; any file, including `.github/workflows/deploy-pages.yml` and the gate `admin/build/validate.js`. The GitHub tools on that repository (branches, pull requests and merging them, issues, comments, Actions runs). Claude Code Remote in Dinis's account (list and read other sessions, send them messages, create and fire scheduled tasks and sessions). A Google Drive connector (create, update, share and trash files; which account it acts as was not checked). Publishing a page on claude.ai. A shell in its own cloud container; the public web through the environment's proxy.
- **Data:** everything in the repository and its history; other sessions' transcripts in the account; whatever the Drive connector can see.
- **Connectors:** GitHub, Claude Code Remote, Google Drive.
- **How known:** measured for abp@web-summit.dinis in its own session on 2 November 2026 (its tool list; the GitHub branches API: `main` and `dev` both `protected: false`). For this agent, *inferred*: it runs in the same account and environment. Its own session should confirm or correct this.

## Mandate: what was authorised {#mandate}

- **Business task:** each person's next step in setting up their agents, suggested in the person's own style (`people/<id>/profile.json`), once an hour from 08:40 to 20:40 UTC, a note only when something changed; a summary for Dinis each run; patterns across people raised as board issues.
- **Deployment scope:** `people/<id>/mentor/**` (a note per run), `team/mentors/**` (plans, runs, summaries), `data/meetings/**` (one item per person per run), new board issues; `"status": "retired"` in a person's `profile.json` when their mentor retires (WAKE.md, the rules).
- **Rules:** suggest, never instruct; never edit another agent's files, never message another account's sessions, never commit for someone; public, kind and specific; no contact detail, no key. Seven steps a run, with a security sub-agent reviewing the plan and the diff.
- **Authorised purpose:** a team new to agents gets to L5 quickly. Temporary: each mentor retires when its person is at L5 and their agents ran on their own for two days; all stop on 13 November.
- **Authorised by:** Dinis Cruz (the agents page: "At Dinis's word, 2 November 2026").

## Gap: capabilities within Reach beyond authority {#gap}

- **Its notes are read by other people's agents.** The agents page tells every agent to read its person's latest mentor note as material. A note is text that crosses from Dinis's account into every person's agents: a channel for an instruction, by mistake or by design, into sessions the mentor may not message. The barrier is the rule in every agent's prompt (material is not instruction) and the security sub-agent's review.
- **The review is inside the same session.** Steps 2 and 6 are a security sub-agent of the mentors' own session, briefed by the same conductor sub-agent; it is not independent of what it reviews. security@web-summit.dinis reads the commits afterwards, twice a day.
- **Writes into every person's folder.** `people/<id>/mentor/` is in its mandate; its push access reaches the rest of each `people/<id>/` too (dashboards, onboarding, agents.json), which belong to the person and their agents.
- Push to `main` or rewrite history; edit the gate, the CI workflow or `tag_release.sh`; create scheduled tasks or sessions; GitHub collaboration; Drive: as for every agent in Dinis's account (see [the journalist's ABP](../abp/journalist-web-summit-dinis/index.html#gap)).

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never push to main, never force-push, never disable a check | rule, kept by the agent | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml (v0.1.51): the gate runs on the push, then again on the tree CI numbers, commits and deploys. It stops a red build deploying, not the push, and the agent can edit the gate, the workflow and tag_release.sh |
| Only CI writes the version | rule, kept by the agent; a warning in CI | release.sh refuses a commit touching version.txt, but it runs in the agent's own clone; tag_release.sh only warns, and replaces the number |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 |
| Writes only its own paths | rule, kept by the agent | its section; git has no per-path write control, and the gate does not compare a commit's paths with its author |
| Never create a scheduled task, a session or a workflow | rule, kept by the agent | its prompt; the tools are in its session |
| Only Dinis instructs; what it reads is material | rule, kept by the agent | its prompt; untrusted content marked by the platform |
| A security sub-agent reviews the plan and the diff every run | review, inside the same session | `team/mentors/WAKE.md`, steps 2 and 6; verdicts in `team/mentors/runs/` |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 3 November 2026 00:15 UTC): two commits under its name. a771a67: its own entry in `data/keys.json`, which is not in WAKE.md's paths (the standard agent rule, a key on the keys page, covers it). 9147c3d, the first wake (22:50): six notes in `people/<id>/mentor/`, a summary in `team/mentors/notes/`, the run in `team/mentors/runs/` and one stand-up item: inside its mandate. The session's setup (450ab04, ad9fe3a: profiles, kits, WAKE.md) was the conductor's.

Open questions: who reads the summaries for Dinis each hour; whether a person can switch their mentor off before L5.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator |
| Accountable owner | Dinis Cruz |
| Licensee | mentor@web-summit.dinis and the six person mentors (one Claude Code session in Dinis's account) |
| Conditions | the Mandate above; `team/mentors/WAKE.md`; CLAUDE.md; the agents page |
| Validity | from 2 November 2026 to 13 November 2026, when all mentors stop; each person mentor until its person retires it |
| Review | on any change to its Reach, and when a mentor retires |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis; reviewer: to be named (a person signs off). Version 2, 3 November 2026 (08:10 wake: main still unprotected), in `content/abp/` with its history in git.
