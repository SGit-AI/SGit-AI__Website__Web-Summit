# Good morning, Indi: what happened overnight, and what you check

Written by synthetic@web-summit.indi at the end of the overnight run (4 November 2026, about 22:50 UTC). Every task has its own folder here with a `STATUS.md`.

## 1. First: WS-08, "Fill in your card"

Overdue since Tuesday 3 November, and only you can answer it. Tell your conductor five things: your role as you see it, the companies you want to own, the conversations you will lead, your accounts, and how you like a brief.

## 2. What was done

As Dinis asked, each group of tasks ran in its own Claude Code session, on its own model, started and then nudged with its brief (`ws-05-new-agents/PROMPTS.md`). Nothing was sent to anyone outside the team. Nothing was printed or posted.

| Task | Who | Result | Where |
|---|---|---|---|
| WS-05 | synthetic@ | Two new agents suggested and started: **messaging@** and **factory@** (Sonnet 5.5). Also **builder@** (Sonnet) and **ux@** (Opus) for the night. | `ws-05-new-agents/` |
| WS-06 | ux@ | New **Today** page (`/people/indi/today/`) in plain words with pills and colour filters; dashboard rewritten (about 30,700 px tall down to 5,700 on desktop); to-do page polished; evaluation with click counts; a proposal for the shared build, **not applied**. | `ws-06-dashboard/` |
| WS-15 | messaging@ | The RiskMandate message: one paragraph, three openers, card lines, demo recommendation. Draft. | `ws-15-message/MESSAGE.md` |
| WS-19 | factory@ | The card-to-analysis loop on Cisco Outshift, 1Password and Feedzai, with a review checklist. Agent drafts. | `ws-19-card-loop/` |
| WS-22 | messaging@ | Seven pages checked against the draft message, with suggested changes. Nothing changed on the site. | `ws-22-messaging-review/REVIEW.md` |
| WS-26 | factory@ | 50 ranked targets with sources and draft first messages (not sent), and a handover for Silvio. | `ws-26-outreach-targets/` |
| WS-27 | factory@ | How anyone adds the next company, and a review queue of all 28 factory companies (none reviewed yet). | `ws-27-factory/` |
| WS-51 | messaging@ | A technical article on how your agents work overnight. Draft, not published (an article must be signed first). | `ws-51-article/ARTICLE-DRAFT.md` |
| WS-59 | builder@ | Five agents for Daniela, each with a behaviour policy. Draft for Daniela, Angelo and you. | `ws-59-daniela-agents/AGENTS.md` |
| WS-70 | synthetic@ | Links to both recordings (repository, site, Drive). The transcript needs speech-to-text, which this environment blocks; two ways to finish it. | `ws-70-video-links/LINKS.md` |
| WS-99 | synthetic@ | Scheduled tasks created: **dashboard@** 07:30, 12:30, 17:30 UTC; **dev@** 09:30, 15:30 UTC. | `ws-99-dashboard-agent/` |
| WS-109 | messaging@, checked by synthetic@ | The two-minute demo script. Checked against Dinis's article: it matches; use the article's exact question. **For you to check this morning.** | `ws-109-demo/` |
| WS-112 | synthetic@ | The gate now warns on a brief with more than three asks, or a field that should be a list (tested both ways); the review step as a ready prompt. | `ws-112-briefs/` |
| WS-125 | builder@ | The setup guide for everybody else, in three levels. Draft, not linked from the start page. | `ws-125-setup-guide/SETUP-GUIDE.md` |

## 3. Your checks, in order

**This morning (needs you, quick):**

- [ ] **WS-08**: your five answers (above).
- [ ] **WS-109**: read `ws-109-demo/DEMO-SCRIPT.md` and the check at the end of its `STATUS.md`. Decide the test mailbox and chat, and plan one dry run before 9 November.
- [ ] **WS-06**: open `/people/indi/today/` on your phone. Is it what you want first? The four long issue tables left the dashboard (they are on the to-do page and in the Command Centre): say if you want any back. Decide whether to send `ws-06-dashboard/PROPOSAL-SHARED.md` to Dinis.
- [ ] **WS-99**: after 07:30 UTC, check your dashboard shows a new commit from dashboard@. Both dashboard@ and dev@ have an old question waiting for you in their sessions: answer it, or they carry on without.
- [ ] **WS-136**: add your site key. It also removes the "Add your key" box from the top of every page for you.

**Today (drafts that need your yes or someone else's):**

- [ ] **WS-15**: read `MESSAGE.md`, then send it to Nimay to approve. When approved, WS-22's suggestions can be applied.
- [ ] **WS-26**: send Silvio `HANDOVER-SILVIO.md`. He checks the list before anything is sent. Hexamind's attendance is unconfirmed.
- [ ] **WS-19 and WS-27**: a person reviews each analysis with the checklist in `LOOP.md` before any of it is used. Owners in `data/companies.json` are all "to decide".
- [ ] **WS-59 and WS-125**: agree them with Angelo and Daniela.
- [ ] **WS-51**: check the facts, then decide who signs it (a live agent key) before it goes into the articles.
- [ ] **WS-70**: choose how to get the transcript (Silvio's script, or Whisper in another environment).
- [ ] **WS-112**: say yes or no to your conductor using the review step. Adding it for every conductor is Dinis's call. Tell your conductor "acknowledge" for briefs 1 to 8.
- [ ] **WS-05**: after you have read their work, say yes or no to schedules for messaging@ (suggested 11:00 UTC daily) and factory@ (10:00 and 16:00 UTC on 5 and 6 November).

## 4. Good to know

- **All four sessions stopped when done.** The two new agents (messaging@, factory@) wait for your yes to a schedule.
- **Your dashboard agent's prompt** now says to keep ux@'s new design and change only the content.
- **Checked by synthetic@:** no email address, phone number or em dash in any overnight file; the 50 targets hold companies only.
- **One slip:** one status commit went to dev without the release script. CI still ran the gate on it, and the next release published it.
- **Tokens:** estimated about 1.4 million fresh tokens before the run. The accountant (17:30 UTC) will report the measured figure where the agents logged it.
