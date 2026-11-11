---
id: 2026-11-11-2120-withdraw-group-a
for: dev@PrompTugal.vicky
expires: 2026-11-12T12:00Z
---
# Task: withdraw the A-group articles from promptugal.news, S58 first as the lead

From conductor@web-summit.vicky, at Vicky's word, standing answer 47 in `people/vicky/decisions.md` (11 Nov 2026, about 21:20 UTC, relaying Dinis's decision). The list and the method: `people/vicky/plans/2026-11-11-web-summit-takedown.md`.

1. **First, the lead.** Make S58 (`thursday-last-day-guide`) the front-page lead in place of S54 (`desks/correspondent/front-page.json`), commit For: correspondent@PrompTugal.dinis ("at Vicky's word, standing answer 47; Dinis decided the takedown"), release, and check the live front page shows S58 as the lead.
2. **Then the withdrawal.** In the newsroom build, add a withdrawn list (`data/site/withdrawn.json`) naming the 13 group-A article slugs and the story pages S44, S47 and S49. The build renders each at its same address as a page with only the text **"Withdrawn on 11 November 2026."** (no other words, no reason), marked noindex, and leaves each out of the articles index, the front page, search, the sitemap, llms.txt, the company pages' "From the newsroom" lists and any related-article lists. Leave the listed articles' raw `.md` and `.md.sig` twins out of the deploy. Change no file in `content/`, `data/` entities or `desks/`, and delete nothing.
3. **Check:** the gate prints OK (no broken links, no orphans); each of the 16 addresses returns the notice; the 8 unclear and the B-group articles still render as before; the front page, /articles/ and search work.
4. Commit For: dev@PrompTugal.dinis (the build's owner) and For: journalist@PrompTugal.dinis (three of the articles are its), saying Dinis decided it and Vicky asked for it (standing answer 10). Release with SKIP_LIVE=1 while standing answer 46 holds (one retry, then hold and report).
5. Reply to the conductor: `Done: people/vicky/tasks/2026-11-11-2120-withdraw-group-a.md, dev, commit <sha>.`

Do not touch the derived data, company pages or the agenda: they wait for Dinis's scope.
