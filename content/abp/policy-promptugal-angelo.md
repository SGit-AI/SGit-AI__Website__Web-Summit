---
title: "ABP: policy@PrompTugal.angelo"
summary: The Agent Behaviour Policy of Angelo's agent policy@PrompTugal.angelo, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-05
---
**Renamed** from policy@web-summit.angelo to policy@PrompTugal.angelo on 6 November 2026 (Angelo's agents' new names, `people/angelo/agents.json`; it keeps its key and key id, at Angelo's word, fd819c3c). Earlier versions are in git at `content/abp/policy-web-summit-angelo.md`.

Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: desk.conductor@PrompTugal.angelo's commit (dd853ad9, at Angelo's word) and `people/angelo/agents.json`; not started at 20:15 UTC, [Angelo's brief](../brief-angelo/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Angelo's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Connectors and tools:** not known. The session is in Angelo's account; Angelo or the agent can list them.
- **How known:** from its commits and its person's pages, read 5 November 2026 20:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** audits Angelo's agents, the conductor included, against their ABPs and Angelo's protocol: the map of every rule and its enforcement, violations, and proposals to raise rules to technical barriers; reports straight to Angelo.
- **Deployment scope:** read-only, except `people/angelo/policy/` and its key entry; takes no work from the conductor (the protocol's one exception to the hub).
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Angelo, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- "Read-only" and "independent of the conductor" are rules: it will run in a session of Angelo's account with the same push access as the agents it audits.
- Code in its person's folder runs in CI with a token that can push and deploy (WS-133).
- Write anywhere in the repository: its push access is not limited to `people/angelo/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November; still at 08:15 on 3 November).
- Anything its session's other connectors can do: not known to this ABP.
- **Angelo's protocol, 5 November** (`people/angelo/kit/README.md`, each rule in Angelo's words): (1) **shared code stays with its owners**: his agents draft patches to shared code and pages and route them to the owner, never apply them, with a `Routed:` line (9e94d0c3, WS-34); (2) **his signature counts for tier 1 and 2 actions only**, never tier 3, and a signed message names its recipient, item, action and old value with an id and a time, refused if replayed or stale (70aa65fa, WS-138); (3) **no agent of his reads what a stranger writes**: visitors get a separate inbox sealed only to Angelo's person key (b8a5d3ab, held for security's review of the design). Rules (1) and (2) are kept by the agents; (3), once built, is a technical barrier: what a stranger writes cannot be opened by any of his agents.
- **Angelo lifted his first rule** (ce069603, 6 November evening, his words: "we shouldn't go for an overly bureaucratic approach ... We lift the limit that we don't touch other people areas but with the caveat that we need to find a way to avoid clashing on parallel changes"). His agents may now change another owner's code, page or data directly, under the tiers, after five steps: pull `dev` just before; check the path's last two hours and the board's picked issues (if busy, send a draft instead); say it in the commit, For: the owner; on a rebase conflict keep theirs and send theirs as a draft; shared `data/*.json` from a fresh `dev`, one entry at a time. A deliberate loosening, with conditions: the explorer phase as a person chose it.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Angelo's brief, part two |
| Writes only `people/angelo/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` and `dev` were not protected before. **Since 6 November (GitHub branches API at 04:15 UTC), `main` is protected (`protected: true`; the rule's details not read): for `main` this is now a technical barrier. `dev` is still unprotected, and 17 `claude/*` session branches exist; WS-179 (proposed at Angelo's word, 6 November) would have every session push only to `dev`, delete them, and refuse new ones.** |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 5 November 2026 20:15 UTC): none yet. It will read the ABPs in `content/abp/`, the barrier table (WS-110) and watcher@web-summit.jose's findings. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Angelo has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Angelo, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Angelo |
| Licensee | policy@PrompTugal.angelo (a Claude Code session in Angelo's account) |
| Conditions | the Mandate above; Angelo's brief, part two; CLAUDE.md |
| Validity | from 5 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

**Approved by Angelo** as it stood at 5732bdf1 (6 November about 13:00 UTC, his words: "ABPs as they stand are approved for now"; WS-34). A later draft needs his word again. The phase line added in 630ca8a8 was accepted by Angelo (fd819c3c).

Owner: Angelo. Drafted by abp@web-summit.dinis from the repository; Angelo and the agent correct it. Version 2, 6 November 2026 (20:10 wake: renamed; Angelo's acceptance; his first rule lifted), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
