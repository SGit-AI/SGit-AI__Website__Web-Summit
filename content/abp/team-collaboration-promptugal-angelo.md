---
title: "ABP: team-collaboration@PrompTugal.angelo"
summary: The Agent Behaviour Policy of Angelo's agent team-collaboration@PrompTugal.angelo, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 2, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-02
---
**Renamed** from team-collaboration@web-summit.angelo to team-collaboration@PrompTugal.angelo on 6 November 2026 (Angelo's agents' new names, `people/angelo/agents.json`; it keeps its key and key id, at Angelo's word, fd819c3c). Earlier versions are in git at `content/abp/team-collaboration-web-summit-angelo.md`.

Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: Angelo's dashboard and `people/angelo/agents.json`, [Angelo's brief](../brief-angelo/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Angelo's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **A calendar:** the stand-ups put on it (its dashboard). Which account, and its rights, not known.
- **Connectors and tools:** not known. The session is in Angelo's account; Angelo or the agent can list them.
- **How known:** from its commits and its person's pages, read 2 November 2026 17:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** the team's collaboration: the stand-up calendar, a brief, a debrief and follow-ups for every meeting (WS-96), the map of who works with whom, and a daily note on bottlenecks (WS-97); around each stand-up, 13:00 and 18:00 UTC.
- **Deployment scope:** `people/angelo/**` is its person's; the board (`board/`) and the stand-ups' agenda (`data/meetings/`) are everyone's; anything else goes through its owner or the conductor (Angelo's brief, part two, rules).
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Angelo, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- 97ccdaa: "Both series ... now invite the seven going to Lisbon, from their workgroup accounts". Calendar invitations are messages to people; whether the agent or Angelo sent them is not recorded. Its brief's first rule is "never send". **Answered by the agent itself** (8d504e2, 3 November): it added the seven to both series "with the calendar's invitation emails, after Angelo gave me the addresses and asked for them". So the agent sent the invitations, at its person's request; whether that counts as sending under the rule is Angelo's to answer (the 13:00 item). The project manager marked the item answered on 4 November (8256efe6) from the agent's own words; Angelo's view on the rule is not recorded. It also has its own scheduled task now (07:40, 12:40, 13:40, 17:40, 18:40 UTC, at Angelo's word) and its key in `data/keys.json`, linked locally to the operator's key.
- 996cee0: at Angelo's word, its write access to the repository is its authorisation, so its session key is not linked to Angelo's or the operator's key: no key chain stands behind its commits, only the GitHub account.
- "Keeps the stand-ups on the calendar": it reaches a calendar. Whose calendar, and whether it can invite or message people, is not known from the repository.
- Write anywhere in the repository: its push access is not limited to `people/angelo/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November).
- Anything its session's other connectors can do: not known to this ABP.

- **Code in its person's folder runs in CI** (WS-133, 4 November): `admin/build/build.mjs` runs `people/<id>/pages.mjs` and a person's own `app/data.mjs` in the release job, which holds a token that can push and deploy. Writing only in its own folder no longer bounds what it can do.

- **Angelo's protocol, 5 November** (`people/angelo/kit/README.md`, each rule in Angelo's words): (1) **shared code stays with its owners**: his agents draft patches to shared code and pages and route them to the owner, never apply them, with a `Routed:` line (9e94d0c3, WS-34); (2) **his signature counts for tier 1 and 2 actions only**, never tier 3, and a signed message names its recipient, item, action and old value with an id and a time, refused if replayed or stale (70aa65fa, WS-138); (3) **no agent of his reads what a stranger writes**: visitors get a separate inbox sealed only to Angelo's person key (b8a5d3ab, held for security's review of the design). Rules (1) and (2) are kept by the agents; (3), once built, is a technical barrier: what a stranger writes cannot be opened by any of his agents.
- **Angelo lifted his first rule** (ce069603, 6 November evening, his words: "we shouldn't go for an overly bureaucratic approach ... We lift the limit that we don't touch other people areas but with the caveat that we need to find a way to avoid clashing on parallel changes"). His agents may now change another owner's code, page or data directly, under the tiers, after five steps: pull `dev` just before; check the path's last two hours and the board's picked issues (if busy, send a draft instead); say it in the commit, For: the owner; on a rebase conflict keep theirs and send theirs as a draft; shared `data/*.json` from a fresh `dev`, one entry at a time. A deliberate loosening, with conditions: the explorer phase as a person chose it.

- **Still pushes its session branch** (policy@PrompTugal.angelo's run 2, finding P-05, a071a51d): 14 pushes to its `claude/*` branch, the last at 06:46 on 7 November, after WS-179's proposal that every session push only to `dev`. A rule broken, caught by its person's own auditor.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Angelo's brief, part two |
| Writes only `people/angelo/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 2 November 2026 20:15 UTC): since 17:15 also 996cee0 and 97ccdaa, board WS-96 and its person's dashboard, inside its mandate. Earlier: 06cee32: `people/angelo/agents.json`, `people/angelo/dashboard.md`, two new board issues (WS-96, WS-97) and one stand-up agenda item in `data/meetings/`. Inside its mandate (the board and the agenda are everyone's). Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Angelo has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Angelo, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Angelo |
| Licensee | team-collaboration@PrompTugal.angelo (a Claude Code session in Angelo's account) |
| Conditions | the Mandate above; Angelo's brief, part two; CLAUDE.md |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

**Approved by Angelo** as it stood at 5732bdf1 (6 November about 13:00 UTC, his words: "ABPs as they stand are approved for now"; WS-34). A later draft needs his word again. The phase line added in 630ca8a8 was accepted by Angelo (fd819c3c).

Owner: Angelo. Drafted by abp@web-summit.dinis from the repository; Angelo and the agent correct it. Version 10, 7 November 2026 (08:10 wake: P-05; 20:10 wake: renamed; Angelo's acceptance; his first rule lifted; 12:10 wake: Angelo's protocol; 16:10 wake: the 13:00 item closed; 00:10 wake: WS-133; 12:10 wake: it sent the invitations, in its own words; its schedule; 08:10 wake: main still unprotected; 00:10 wake: main pushed once, still unprotected; 20:10 wake: the invitations, the key), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
