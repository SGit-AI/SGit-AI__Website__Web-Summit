# writer@PrompTugal.angelo: reports

Newest first. A short line per piece of work, for desk.conductor@PrompTugal.angelo. The newsroom side of each piece is in the newsroom's `desks/writer-angelo/` (PrompTugal/PrompTugal__News__Website).

## 7 November 2026, 10:00 UTC (prompted by Angelo: "Please check the status")

- **Angelo asked (7 Nov, about 00:20):** all of the guide's interactivity back. I set out three ways: (1) a newsroom feature (`assets/guides/`) that makes the published article itself interactive; (2) the original page in `people/angelo/guide/` on the team site, linked from the article; (3) a raw page in the newsroom's `assets/` (not recommended). **Open, for Angelo:** which one. My recommendation: 2 now, then 1. With his rule of 09:45 (his own agents build; handing over is tier 3), option 1 means our desk writes the feature and asks Angelo before handing it to dev@PrompTugal.dinis for review.
- **Overnight on the article:** live and signed; story WS125 Published; the correspondent put it in "From the newsroom" and the AI beat; designer@ made an image for it.
- **Questions on the newsroom side, both For Dinis, no answer yet:** security@ (00:05 review) and abp@ (4eb0db45) ask whether another operator's agent may hold a key in `board/keys.json` and publish there. Not a hold. If Dinis says no, the key is revoked and journalist@ keeps or moves the article. **Recommendation:** Angelo asks Dinis directly, and asks him to confirm his authorisation in his own words (dev@'s review: it is recorded only in Angelo's words).
- **Fixes waiting:** dev@PrompTugal.angelo's review (d23e255f, `proposals/WS-125/review-dev.md`): the kit link is a 404 (`index.md`; `README.md` works, checked 09:55), and six wording fixes. dev.verify@ flagged seven claims to the journalist; dev@'s review settles five from the record. **Recommendation:** I apply them in one re-signed update, after Angelo's go. policy@'s review is due by 18:00.
- **New work for this desk:** the LinkedIn brief (f391ab59, 4792585f; WS-126). Not started.

## 7 November 2026, 00:10 UTC (prompted by Angelo)

- **WS-125 published** at Angelo's word ("let's refine the article and publish it"): https://promptugal.news/articles/agent-setup-guide.html (newsroom v0.1.380, signed by writer-angelo-promptugal; story WS125 shows Published). Check: `desks/writer-angelo/checks/ws125.md` in the newsroom.
- **Corrected at the source:** RiskMandate's terms are grant, mandate, delta, barrier (not reach and gap); the three levels are ours, not RiskMandate's; SHarness has no "expectation", and its boundary needs a launcher it calls its design; ChatGPT and Gemini cells left out (help pages refused or missing); nine people, not seven; the "owners own" lesson updated to the 6 November rule.
- **Open:** the interactive version (questionnaires, dial). Newsroom articles are markdown and escape HTML, so it needs a host: Angelo's area on the team site, or a feature by dev@PrompTugal.dinis.

## 6 November 2026, 23:40 UTC (prompted by Angelo)

- **WS-125, the agent setup guide, taken back at Angelo's word** ("yes please take it back"): the hand-over to conductor@PrompTugal.dinis in ecd8dc39 is withdrawn. Nobody on that side had started on it (no commit, card or draft in the newsroom from 15:39 to 23:30 UTC). Angelo's writer desk refines it and publishes it on PrompTugal.news.
- **Claimed on the newsroom's story board** as story WS125, assignee writer@PrompTugal.angelo (`desks/writer-angelo/ideas/WS125.md`).
- **Key:** writer-angelo-promptugal in the newsroom's `board/keys.json` (93a2e0db there).
