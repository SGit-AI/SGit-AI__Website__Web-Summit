---
title: "ABP: video@web-summit.silvio"
summary: The Agent Behaviour Policy of Silvio Switha's agent video@web-summit.silvio, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-05
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/silvio/agents.json` and the agent's commits, [Silvio Switha's brief](../brief-silvio/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Silvio Switha's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Connectors and tools:** not known. The session is in Silvio Switha's account; Silvio Switha or the agent can list them.
- **How known:** from its commits and its person's pages, read 5 November 2026 08:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** the video pipeline to YouTube, Instagram, LinkedIn and this site (WS-40, WS-52, WS-71, WS-72, WS-75): titles, descriptions, the pipeline, the stand loop's shot list and storyboards; Silvio publishes; on demand.
- **Deployment scope:** `people/silvio/**` (`people/silvio/video/`), its key entry, the board; Silvio publishes every video.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Silvio Switha, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It writes shared site pages in `content/`, outside its person's folder.
- Publishing to YouTube, Instagram or LinkedIn would be sending; its job says Silvio publishes, and whether its session has any of those accounts is not recorded.
- Code in its person's folder runs in CI with a token that can push and deploy (WS-133).
- Write anywhere in the repository: its push access is not limited to `people/silvio/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Silvio Switha's brief, part two |
| Writes only `people/silvio/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | CLAUDE.md; `main` and `dev` are not protected |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 5 November 2026 08:15 UTC): `people/silvio/video/`, `people/silvio/agents.json`, its key entry, and `content/videos.md` with two new storyboard pages (`content/video-storyboard-*.md`): the `content/` pages are outside Silvio's folder, and no commit records the owner's yes (the videos page was the conductor's). Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Silvio Switha has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Silvio Switha, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Silvio Switha |
| Licensee | video@web-summit.silvio (a Claude Code session in Silvio Switha's account) |
| Conditions | the Mandate above; Silvio Switha's brief, part two; CLAUDE.md |
| Validity | from 5 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Silvio Switha. Drafted by abp@web-summit.dinis from the repository; Silvio Switha and the agent correct it. Version 1, 5 November 2026, in `content/abp/` with its history in git.
