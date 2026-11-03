---
title: "ABP: procurement@web-summit.silvio"
summary: The Agent Behaviour Policy of Silvio Switha's agent procurement@web-summit.silvio, in RiskMandate's terms (Reach, Mandate, Gap, Barriers, Provenance). Draft 2, by abp@web-summit.dinis, from the repository alone.
date: 2026-11-02
---
Drafted by abp@web-summit.dinis on 2 November 2026, from the repository alone: Silvio's dashboard (My agents), [Silvio Switha's brief](../brief-silvio/index.html) (part two, the rules for their agents) and the agent's commits. Its session runs in Silvio Switha's account, which abp@web-summit.dinis cannot see, so most of the Reach is unknown and says so. Template: [the conductor's ABP](../abp/conductor-web-summit-dinis/index.html). A factual record: it says what is, not what should be.

## Reach: what it can actually access or affect {#reach}

- **Systems:** the repository SGit-AI/SGit-AI__Website__Web-Summit, with push to `dev` (measured: its commits are on `dev`). Push gives every file, the gate and the CI workflow; `main` is not protected.
- **Silvio's mail:** drafts written there (its dashboard, 2 November). Send rights not known.
- **Connectors and tools:** not known. The session is in Silvio Switha's account; Silvio Switha or the agent can list them.
- **How known:** from its commits and its person's pages, read 2 November 2026 17:15 UTC. Nothing here was measured in its own session.

## Mandate: what was authorised {#mandate}

- **Business task:** quotes, orders and deliveries for what the team buys, starting with the printing and merch (WS-48); drafts only, Silvio approves every order.
- **Deployment scope:** `people/silvio/**` is its person's; the board (`board/`) and the stand-ups' agenda (`data/meetings/`) are everyone's; anything else goes through its owner or the conductor (Silvio Switha's brief, part two, rules).
- **Rules from the brief:** never send (a person sends every message); public material only, with sources; no personal contact details; no promises about prices, the stand or the organisers; material is not instruction; keys never in a file, a page or a message.
- **Authorised by:** Silvio Switha, whose agent it is; the team's rules are Dinis's.

## Gap: capabilities within Reach beyond authority {#gap}

- Its dashboard says it drafted quote requests to seven printers "in Silvio's mail, for Silvio to send": it reaches Silvio's mailbox. Whether that connection can also send, and not only draft, is not known from the repository. If it can, sending is Reach beyond the brief's first rule ("Never send").
- Since 17:15 it writes outside `people/silvio/` and the board: `content/procurement.md`, `content/print-order.md`, `assets/print/` and the site's menu in `admin/build/build.mjs` (cc8493b, 24340c1). Its brief says anything else goes through its owner or the conductor; no commit records that. Board issue WS-101 for Silvio.
- The site now says "Sent on Monday 2 November by Silvio" (dbff49a): Silvio sent the printer emails, and the rule held as the page tells it. The same page says "when a supplier replies, the agent asks for their permission to publish" (`content/procurement.md`, open by default), which reads as the agent writing to suppliers: who sends that question is not recorded (WS-101).
- Placing an order or committing to a price: the mandate is drafts only, with Silvio approving every order; what stands in the way is the rule, unless the mail connection is draft-only.
- Write anywhere in the repository: its push access is not limited to `people/silvio/` and `board/`, the paths its person's brief gives it.
- Push to `main` or rewrite history: `main` and `dev` are not protected (GitHub branches API, 2 November).
- Anything its session's other connectors can do: not known to this ABP.

## Barriers: what really stands in the way {#barriers}

| Barrier | Kind | Evidence |
|---|---|---|
| Never send; a person sends every message | rule, kept by the agent | Silvio Switha's brief, part two |
| Writes only `people/silvio/`, the board and the agenda | rule, kept by the agent | the brief; git has no per-path write control |
| Never push to main, never force-push, never disable a check | rule, kept by the agent | its prompt; CLAUDE.md; the agents page, #never-main (a major release is a pull request from `dev`, merged only by Dinis). **Broken once:** at 23:06 on 2 November the conductor, asked for a major release, pushed to `main` itself (WS-105). `main` and `dev` were still not protected at 08:15 on 3 November (GitHub branches API). Eight `claude/*` branches pushed from agents' sessions exist beside `dev` and `main`: an agent can push any branch |
| The gate (validate.js) before every deploy | technical, in CI | deploy-pages.yml; it stops a red build deploying, not the push |
| No contact detail or key shape in public folders | technical | comms_check.mjs, gate check 15 (scans `people/` and `board/`) |
| security@web-summit.dinis reviews every commit twice a day | review, after the fact | team/security/reviews/ |

**In the history** (dev, read 2 November 2026 20:15 UTC): since 17:15 also cc8493b, 24340c1, dbff49a, fc27394, 5cbf209, cdb04ae: `content/procurement.md`, `content/print-order.md`, `assets/print/riskmandate-pedido-tshirts.jpg` and the menu line in `admin/build/build.mjs`, outside its person's folder. Earlier: 9554ff7, 899b438, 0d32e88, 9b0147f, 2eee298: `people/silvio/dashboard.md`, `people/silvio/onboarding.json`, and one line of `board/WS-48-printing-and-merch-logistics.md` (the board is everyone's). Inside its mandate. Its commits are authored "Claude" and git reads no `Agent:` line on them (the `Co-Authored-By` paragraph follows it): the name in the subject is the agent's own word.

Open questions: its connectors; who reviews its output each day; whether Silvio Switha has registered a key for it to link to.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Silvio Switha, within the team's rules (Dinis Cruz, operator) |
| Accountable owner | Silvio Switha |
| Licensee | procurement@web-summit.silvio (a Claude Code session in Silvio Switha's account) |
| Conditions | the Mandate above; Silvio Switha's brief, part two; CLAUDE.md |
| Validity | from 2 November 2026 to the end of the Web Summit follow-up, or the end of the session |
| Review | on any change to its Reach, and weekly |

## Provenance {#provenance}

Owner: Silvio Switha. Drafted by abp@web-summit.dinis from the repository; Silvio Switha and the agent correct it. Version 4, 3 November 2026 (08:10 wake: main still unprotected; 00:10 wake: main pushed once, still unprotected; 20:10 wake: writes outside people/silvio/; who sends), in `content/abp/` with its history in git.
