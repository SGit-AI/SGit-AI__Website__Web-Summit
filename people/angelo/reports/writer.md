# writer@PrompTugal.angelo: reports

Newest first. A short line per piece of work, for desk.conductor@PrompTugal.angelo. The newsroom side of each piece is in the newsroom's `desks/writer-angelo/` (PrompTugal/PrompTugal__News__Website).

## 7 November 2026, evening (prompted by Angelo: "Please go ahead")

- **The guide made interactive inside the PrompTugal.news article**, on the newsroom branch `work/writer-angelo` (ccd77f7b), for dev@PrompTugal.dinis to review and bring onto dev: a feature (`newsroom/build/features/guides.mjs`), a script and stylesheet (`assets/guides/`) that read the article's own tables, and a "Find your guide" section with the questionnaire as markdown. Gate OK; tested at phone and desktop, light and dark, and with scripts off.
- **Open:** dev@'s review; it may wait on Dinis's answer about Angelo's agents in the newsroom. Until it merges, the article links to the interactive copy on the team site.

## 7 November 2026, 18:45 UTC (prompted by Angelo: "pick up tasks that are waiting on you")

- **checker@PrompTugal.vicky's fact-check of WS125** (newsroom b0a6e7c0): five findings and one smaller, all taken after re-reading each source; the article re-signed (newsroom v0.1.604), the check file updated. The interactive guide's fragment brought into line in the same way (dev@ last changed it at 11:42).
- **Dinis's conductor** put the contributor ask in Dinis's brief at 12:52 (newsroom e7d6f972); no answer yet.
- Nothing else waits on this desk: dev@'s re-sync (c5814aec) was done at 11:42; the LinkedIn pack is with Angelo.

## 7 November 2026, afternoon (prompted by Angelo: "Ok I've done everything for today")

- **LinkedIn, done by Angelo today:** headline, the top of his About, the line in his consultant entry, the Project with its Media and skills, the announcement post with the image (Web Summit's participant card with our band below it, made in this session, kept out of the repository: it has his photo), and Featured (post, film, guide, graph).
- **Next, from the pack** (`proposals/social/README.md`): Sunday morning the communication graph, Sunday evening the guide; Monday to Thursday as planned; Jose to agree to being named on Thursday.
- **Open, for Angelo:** Dinis's answer on the contributor ask (newsroom c8810c39) and on his agents' key question; dev@'s re-sync of the interactive guide's text.

## 7 November 2026, 12:40 UTC (prompted by Angelo)

- **LinkedIn (WS-126):** drafts reworked with Angelo through the morning (`proposals/social/README.md`): "collaborating with the RiskMandate team" rather than a title at RiskMandate; a line in his consultant entry plus a Project; Featured for summit visitors; the declaration post with his meet page; how it fits WS-126, Jose's channels (WS-175) and Silvio's video pack.
- **Asked Dinis, at Angelo's word** ("Please ask Dinis to add me as a technical content contributor or something"): newsroom `desks/writer-angelo/asks/2026-11-07-angelo-as-contributor.md` (c8810c39 there, For: Dinis and conductor@PrompTugal.dinis), with the key and authorisation questions alongside. PrompTugal.news has no contributors section today.

## 7 November 2026, 11:05 UTC (prompted by Angelo: "Yes to all 3")

- **The interactive guide is live** at https://web-summit.sgit.ai/people/angelo/guide/index.html: `people/angelo/pages.mjs` places dev@'s fragment in a site page (styles scoped, tested at 1280 px light and 390 px dark: no errors, every control works). Linked from WS-125's board issue and from the article.
- **The article is corrected and re-signed** (newsroom f69f0aee, v0.1.511): dev@'s seven fixes and policy@'s eight points, the two outside claims re-read at the source (riskmandate.ai/abp.html, sharness.ai).
- **Open, for dev@PrompTugal.angelo:** the fragment still has the wording policy@ flagged. Re-sync it with the corrected article, as at 10:03; the page follows the fragment at the next release. I did not edit it: you changed it at 10:03.
- **Open, for Angelo:** ask Dinis to confirm his authorisation in his own words; and his answer to his agents' question on another operator's key in the newsroom.
- **LinkedIn drafts done** (WS-126): `people/angelo/proposals/social/README.md`: the profile (three headlines, About, Featured, the RiskMandate entry), four posts to Monday (the communication graph first), and the company page. Open, for Angelo: what his profile shows today; posts as himself only or the page too; the consultancy line left out (what RiskMandate offers is for Dinis and Nimay).
- **Next:** the interactivity inside the article itself (a newsroom feature), after dev@ re-syncs the fragment.

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
