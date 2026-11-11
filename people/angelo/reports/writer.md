# writer@PrompTugal.angelo: reports

Newest first. A short line per piece of work, for desk.conductor@PrompTugal.angelo. The newsroom side of each piece is in the newsroom's `desks/writer-angelo/` (PrompTugal/PrompTugal__News__Website).

## 10 November 2026, about 00:30 UTC (prompted by Angelo, with the app screenshots)

- **0-URGENT-4b done** (the conductor's 6d75ae89): the passes article reworked (newsroom 31c2b03e): a colour sample per pass, sampled from the app cards' backgrounds (no person, name or face; the screenshots not committed), his wrist photo removed, the sighting column and lines gone; re-signed.
- **Note for Angelo:** the photo is gone from the site, but it stays in the newsroom's public git history (commit 45e925788); removing it from history would need a force-push, which the rules forbid. It shows a wrist and a wristband only.

## 9 November 2026, about 23:15 UTC (prompted by Angelo: "Both")

- **Published "Web Summit's nineteen passes: who is who, by colour"** with Angelo's ALPHA photo (metadata stripped): https://promptugal.news/articles/web-summit-passes-and-colours.html (v0.1.917); linked from the queues article.
- **The share button is live** on every public page of PrompTugal.news (v0.1.918): dev.venues@'s patch (de6b95a0), plus the writer's fix for the gate (markup as markdown; the schema's entry), tested at 1280 and 390 px. For: dev@PrompTugal.dinis, with what it changes and how to undo it.
- **Next:** the protocols article (0i), design and draft in one run.

## 9 November 2026, 22:45 UTC (prompted by Angelo: "Wake up")

- **0-URGENT-4, the wristbands draft updated** (newsroom v0.1.914): "Web Summit's nineteen passes: who is who, by colour", from the app's pass types and colours (489f32a2) and the ALPHA sighting (089ca508). To publish at Angelo's word; his ALPHA photo not used until he says so.
- **Dinis answered the key and publishing question** (newsroom guidance, 9 Nov 10:55: "everybody in the team is trusted, so they can all push"; "If the agent thinks they're okay, they should do it"). The contributor listing is still open (his /contribute/ page is for outside collaborators).
- **0-LEADS is sheet@'s** (the one-off): no interview sheet in people/angelo/writer/ yet, due Tuesday morning.
- **Next for this desk:** the share-button patch with Angelo (de6b95a0); the protocols article, design and draft in one run (03f1e497).

## 9 November 2026, 16:40 UTC (scheduled run)

- **0-URGENT-3 rewritten in a confident tone** (the conductor's e9bb08dd, Angelo's words): newsroom `desks/writer-angelo/drafts/ac1-authority-checks.md` (v0.1.869), now "Speed where it's safe, control where it matters". The new LinkedIn reply: "Both, by design. For a newspaper, where most changes are public and can be undone, code checks the edges (every push passes a build gate and a check that each agent writes only in its own area) and review covers the judgement. Keys, vaults and anything in my name sit under enforced control. That's how a newsroom and a hundred-plus agents came together in nine days. How it works, and how the same tools tune for other uses: <link>"
- research@ delivered 0r's three public sources (b1f75d2d); the 0r article waits for Angelo's go to start.
- No answer from Dinis; no reviews or changes by others to the guide, the wristband article or this desk; all pages load.

## 9 November 2026, afternoon (prompted by Angelo)

- **0-URGENT-4, drafted:** newsroom `desks/writer-angelo/drafts/wc1-wristband-and-badge.md`, "Your Web Summit wristband and badge: what they're for, and who is who". No public key to the 2026 colours (Web Summit's pages list passes but no colours; its registration page needs a sign-in; attendees' accounts: media green 2022, investor red 2015). The colours table waits on what Angelo sees; to publish once he has sent a few, then grow through the week.
- **0q, drafted:** newsroom `desks/writer-angelo/drafts/gw1-agents-on-google-workspace.md`, "Agents on Google Workspace, step by step": the Workspace admin, the Claude owner, each member; every step on Google's and Claude's help pages.
- **Found, for Angelo:** Claude's Gmail, Calendar and Drive connectors are not read-only (they send, share, move, trash; Claude asks first by default). The setup guide's "test that a send is refused" needs a correction; awaiting his go.

## 9 November 2026, about 14:30 UTC (prompted by Angelo: "Yes, go ahead in that order")

- **0-URGENT-4, the wristband and badge colours: the writer does the research too**, at Angelo's word, so it is ready while the summit is on. research@PrompTugal.angelo: nothing for you on 0-URGENT-4; carry on with 0p and 0r.
- **Then 0q**, agents on Google Workspace, step by step.

## 9 November 2026, midday (prompted by Angelo)

- **The authority-checks draft, reframed at Angelo's word** ("from the perspective of agility"; "the progression of growth"; "the newspaper space where issues are reversible ... the vaults, where we operate in a more controlled way"): newsroom `desks/writer-angelo/drafts/ac1-authority-checks.md` (v0.1.836), "Speed or control: tuning a team of a hundred agents": what speed bought (1 to 9 November: 2,443 releases, 153 agent keys, 44 articles), why it was safe in a newspaper and not in the vaults, what holds today, six settings between speed and control. The LinkedIn reply updated to match. Waits on Angelo's edits or go.
- **Angelo posted his "at Web Summit" LinkedIn post** (drafted here: the e-bike-to-car tickets, the wristbands, the energy; his airport photo).
- **Open, for Angelo:** design the protocols piece (backlog 0i), the companion this draft names; today's demo rehearsal.

## 9 November 2026, about 10:15 UTC (prompted by Angelo: backlog 0-URGENT-3)

- **Draft, for Angelo's review: "A hundred agents: checked by code, or trusted?"** In the newsroom: [desks/writer-angelo/drafts/ac1-authority-checks.md](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/writer-angelo/drafts/ac1-authority-checks.md). The honest answer, every check read in its code or at GitHub today: both, and more upstream than it looks (the gate and the lane check stop the release, not the push; one GitHub account for all of Angelo's agents; the newsroom's main and both repositories' dev unprotected; one secret per environment and Claude Code's permission check hold above the agents). Not published.
- **The LinkedIn reply, draft:** "Thanks, a good question. Honest answer: both, and more of it upstream than I'd like. Code checks run on every push (a build gate, and a check that each agent writes only in its own area), and each agent's secrets stay in its own environment. But some of those checks sit where the agents themselves could reach them, and much of the rest is rules and reviews. I've written up which is which: <link to the article, once published>"
- **Open, for Angelo:** his edits or go on both; the reader's name, role and company only if he wants the reply to address them (research@ could not identify the person from public pages).

## 9 November 2026, morning (scheduled check, then Angelo: "Yes publish.")

- **Published "Web Summit wristbands: where the queues are short, and when"** (newsroom v0.1.811): https://promptugal.news/articles/web-summit-wristband-queues.html. From research@'s registration brief, every source re-read this morning; it says no 2026 queue report exists yet. The scheduled run's push was blocked (no person in the session), so it waited for Angelo's go.
- Overnight: Vicky's reviewer updated T1 to "over a hundred agents"; Vicky's checker closed WS125; security@'s S30 answered by Angelo through the conductor (efab3a66): our code changes notify dev@PrompTugal.dinis and say how to undo them.
- **Open, for Angelo:** today's demo rehearsal (topic and time); when he lands (airport or Pavilhão for the wristband).

## 8 November 2026, about 17:30 UTC (prompted by Angelo: a video for the LinkedIn post)

- **A 53-second square video for the graph post**, at Angelo's word ("a video of the agents map ... from the beginning"; "if we get to show the actual deliverables ... even better"): his command centre's map playing back from 2 November, the commit replay, five live pages (PrompTugal.news home, articles, the graph, the story board, his interactive guide) with captions, and a closing card with the stand (Thursday 12 November, booth A1-30, ALPHA 1, Pavilion 1). Recorded from the public pages; kept out of the repository (sent to Angelo). Angelo posts it himself.
- The "over a hundred agents" line: the conductor's change (b916e1d4) stands; the graph article's count asked of Vicky's desk (newsroom, desks/writer-angelo/asks/2026-11-08-graph-article-count.md), not edited by this desk.

## 8 November 2026, 09:20 UTC (prompted by Angelo: the pending questions, one by one)

- **Angelo confirmed his agents' protocol in this session** (the kit asks it once per agent): "Yes, I confirm".
- **The live demo:** a rehearsal on Monday 9 November (topic, the whole flow once, timed, a one-page script with fallbacks for weak Wi-Fi).
- **policy@'s open point on the questionnaire:** "Both as you propose": posting in public starts at Enforced; company documents at Reviewed, Enforced with personal data. Done in both versions (newsroom v0.1.696; the fragment here), tested.
- **Check-ins:** twice a day to Thursday, about 08:00 and 17:00 Lisbon, into this session; a report only when something needs Angelo.
- **Dinis:** Angelo asks him himself, and this desk nudged his conductors (newsroom reminder commit, For: Dinis, conductor@ and conductor.b@PrompTugal.dinis).
- **Kit:** the writer's line now says it publishes at Angelo's word (Angelo: "Yes to the kit change").
- **Website:** the recommendations for leggiopasqua.com went to Angelo as a PDF for his own agents (not kept here: his personal business); three questions for him in it.

## 8 November 2026, 08:45 UTC (prompted by Angelo: "Get a status update")

- **designer@PrompTugal.dinis read the elevated guide** (ade67367): in brand; its one note (headings under the sticky bar) fixed (newsroom v0.1.694).
- **dev.verify@ flags** on the guide: c3 "contradicted" because the kit README (team site, `kit/README.md#promptugal`) still says journalist@ publishes the writer's pieces, while Angelo had his writer publish; the fix is a line in the kit (the conductor's file, Angelo's protocol: tier 3). c2, c5, c7 "unsupported" for want of a source the models could read.
- **No answer from Dinis** on the contributor ask, keys or authorisation; account B's agents are paused (runner.writer's STATE).
- **Backlog 0g (Angelo's website) is mine**, waiting on Angelo: where leggiopasqua.com lives and how it is edited. LinkedIn moved to social-media@ (0h).

## 7 November 2026, late evening (prompted by Angelo: "Go ahead, in PrompTugal's brand")

- **The PrompTugal article elevated** (newsroom 39e19860, v0.1.655): a hero in the site's dark band, a sticky "read this as" bar with icons that turns on "for you" boxes through the article, reading time and depth, a staircase, deployment tiles, a larger dial, card grids, icons on every questionnaire; all in the site's tokens. Checked live at phone and desktop, light and dark. The team site's copy stays, at Angelo's word.

## 7 November 2026, about 22:00 UTC (prompted by Angelo: "Yep push it")

- **The interactive article is live on PrompTugal.news** (newsroom 3c4a60fd, v0.1.644), pushed by this desk at Angelo's word instead of waiting for dev@PrompTugal.dinis's review; the commit asks dev@ to review after the fact and tells Dinis. Checked on the live site: every control, phone and desktop, no errors; tables and lists without scripts.
- The team site's interactive copy stays; Angelo to decide whether it stays a mirror or points to the article. The Sunday guide post in the LinkedIn pack now has one link, the article.

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

## 10 November: the protocols article, drafted (backlog 0i)

- Draft: newsroom `desks/writer-angelo/drafts/pr1-how-the-protocols-grew.md` (newsroom 070c57f8f, v0.1.928). "Six people, six agent protocols, one week": the shared template, a section per person (Dinis, Angelo, Vicky, Jose, Indi, Silvio), borrowings, five patterns. Public commits only, each claim linked; about forty commits checked at the source.
- Sensitive points (nine) kept out of the body and listed for Angelo in a comment at the end; only those go to the person concerned, at his word.
- Not published: waits for Angelo's review, and under Dinis's big stop.

## 10 November, about 08:55: the authority-checks article is live (0-PUB-AC1)

- Published at Angelo's word ("Ok please push this post and let me know when it's live."; 2ce1fb9f, pushed from his account): https://promptugal.news/articles/speed-where-its-safe-control-where-it-matters.html (newsroom v0.1.973).
- Numbers re-counted this morning: a row for Tuesday 10 November (1,768 team-site and 972 newsroom releases, 158 keys, 52 articles); In short now says ten days, more than 2,700 releases, 52 articles. Signed; gate OK.
- Angelo can now post his LinkedIn reply with the link.
