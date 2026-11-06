---
title: "ABP: observability@web-summit.dinis"
summary: The Agent Behaviour Policy of Dinis Cruz's agent observability@web-summit.dinis, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-05
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: its commits (56578c23, fe3fea4a, bbf0c007 and others, each "at Dinis's word") and the agents page (#agent-log); it has no section of its own on the agents page at 04:15 UTC, [Dinis Cruz's brief](../brief-dinis/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Dinis Cruz's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Same account as abp@web-summit.dinis:** its tools are inferred from abp's session (GitHub, Claude Code Remote, Google Drive). Its vaults on SG/Send: aym98gsm, p96tiql4 and kuuqr3do.
- **Connectors and tools:** not known. The session is in Dinis Cruz's account; Dinis Cruz or the agent can list them.
- **How known:** from its commits and its person's pages, read 5 November 2026 04:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** the team's observability: the agents' activity lane and its drain (WS-160), page views and reads on the site sealed in the browser and drained into encrypted vaults, the Observability section and live stats on the home page (WS-37).
- **Deployment scope:** `content/observability*`, `assets/obs-*.js`, `admin/tools/` (obs_drain.py, obs_lets.py, agent-log.mjs), `people/dinis/observability/`, its vaults (aym98gsm public, p96tiql4 app, kuuqr3do private); every agent's run record reaches it, sealed.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Dinis Cruz, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- **It watches the people who read the site.** `assets/obs-dinis.js` sends a view and a read for every page load, sealed, from every visitor's browser; the drain sorts readers into team, synthetic, crawlers and the rest, and `public.json` holds no anonymous visitor's detail (fe3fea4a). What a visitor is told is the site's participant disclosure; whether it names this telemetry is not checked here.
- **Every agent's run record comes to it.** The agents' lane carries what each agent read and did, signed by that agent's key; the drain key and the lanes' enum key sit in its private vault kuuqr3do. One session reads the whole team's activity.
- It writes the shared build, `admin/tools/` and the home page, as dev@web-summit.dinis and the journalist also do: no order between them is recorded.
- Code it adds to `assets/` runs on the site's one origin, beside keys held in the browser (WS-117, WS-132); the vault app it runs is in a sandboxed opaque-origin frame, a real barrier for that part.
- Write anywhere in the repository: its push access is not limited to `people/dinis/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Dinis Cruz's brief, part two |
| Writes only `people/dinis/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 5 November 2026 04:15 UTC): `admin/tools/`, `content/observability/`, `assets/obs-view.js` and `assets/obs-live.js`, `admin/build/`, `content/index.md`, `assets/vendor/sgit-ai/` (pinned, sha256 recorded) and `people/dinis/`: the shared build and the home page among them, "at Dinis's word". Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Dinis Cruz has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Dinis Cruz |
| Licensee | observability@web-summit.dinis (a Claude Code session in Dinis Cruz's account) |
| Conditions | the Mandate above; Dinis Cruz's brief, part two; CLAUDE.md |
| Validity | from 5 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Dinis Cruz. Drafted by abp@web-summit.dinis from the repository; Dinis Cruz and the agent correct it. Version 1, 5 November 2026, in `content/abp/` with its history in git.
