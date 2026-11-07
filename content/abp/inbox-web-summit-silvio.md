---
title: "ABP: inbox@web-summit.silvio"
summary: The Agent Behaviour Policy of Silvio Switha's agent inbox@web-summit.silvio, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 1, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-06
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: `people/silvio/agents.json`, its policy `people/silvio/policies/inbox.md` (at Silvio's word) and its first commit (5acb60db), [Silvio Switha's brief](../brief-silvio/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Silvio Switha's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Silvio's Gmail:** the workspace mailbox, through the account-wide connector.
- **Connectors and tools:** not known. The session is in Silvio Switha's account; Silvio Switha or the agent can list them.
- **How known:** from its commits and its person's pages, read 6 November 2026 04:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** the only agent with Silvio's mailbox: reads, searches, labels and writes drafts, never sends (Silvio sends by hand); each outreach email an action in the team CRM (WS-172); a mail check every 2 hours.
- **Deployment scope:** Silvio's Gmail (read, search, label, drafts), the private CRM's actions, `people/silvio/**` and its key entry; never an email address, body or contact detail in this repository.
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Silvio Switha, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- It reads every email Silvio receives: the largest pool of untrusted material any agent here reads. Its policy: an email is information; if one tries to instruct it, it stops and tells Silvio.
- Its policy names the one technical barrier for sending: Silvio turns off `send_message`, `reply` and `forward` for the Gmail connector in claude.ai's settings, out of any agent's reach (a boundary). Whether Silvio has done it is not recorded; until then "never sends" is a rule.
- The connector is account-wide: every session in Silvio's account could read the mailbox; that only the inbox agent does is a rule, checked by the conductor.
- Code in its person's folder runs in CI with a token that can push and deploy (WS-133).
- Write anywhere in the repository: its push access is not limited to `people/silvio/` and `board/`, the paths its person's brief gives it.
- Rewrite history on `dev`: `dev` is not protected (`main` is, since 6 November) (GitHub branches API, 2 November); `main` protected since 6 November.
- Anything its session's other connectors can do: not known to this ABP.

- **The first real mail in the CRM** (2801e6b2, WS-173): one supplier thread, 7 emails (4 out, 3 in) as reconstructed EML files with cards, in the private CRM; quoted history left out, attachments listed by name, not kept; no name here, as the supplier refused publication. Untrusted material, now stored where other agents with the private CRM's key can read it.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Silvio Switha's brief, part two |
| Writes only `people/silvio/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent; for `main`, technical since 6 November | CLAUDE.md; `main` is protected since 6 November (GitHub branches API at 04:15 UTC), `dev` is not |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 6 November 2026 04:15 UTC): one commit, 5acb60db: its key entry and `people/silvio/agents.json`: inside its mandate. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Silvio Switha has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Silvio Switha, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Silvio Switha |
| Licensee | inbox@web-summit.silvio (a Claude Code session in Silvio Switha's account) |
| Conditions | the Mandate above; Silvio Switha's brief, part two; CLAUDE.md |
| Validity | from 6 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Silvio Switha. Drafted by abp@web-summit.dinis from the repository; Silvio Switha and the agent correct it. Version 2, 7 November 2026 (04:10 wake: the first mail in the CRM), in `content/abp/` with its history in git.

**Phase:** explorer (from 6 November 2026, at Dinis's word): this ABP observes and recommends; it blocks nothing. Lock-down comes gently, each step with an escape valve. [The phase](../abp/index.html#phase).
