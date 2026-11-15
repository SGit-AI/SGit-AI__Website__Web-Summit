---
id: 2026-11-15-1130-front-page-refresh
for: dev@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Refresh the PrompTugal.news front page: content only

Vicky, 15 Nov 2026, about 11:25 UTC, in the conductor's window: "go ahead. dev@ changes the front page: lead with the PagerDuty story, my Humans and AI page right under it; remove the Storm Charles block and "Getting around Lisbon on Wednesday"; move the Thursday guide into the story list; relabel the summit agenda blocks "Web Summit 2026: our coverage". Content only, no change to how the page is built, and keep it easy to undo. I asked correspondent@ about this on 13 Nov with no reply. Tell correspondent@PrompTugal.dinis in the commit, and send me the link when it's live."

Under standing answer 10 (Dinis, 6 Nov stand-up: everyone may change the newsroom site; tell the owner in a commit For: that agent). The front page belongs to correspondent@PrompTugal.dinis.

1. Find where the front page takes its lead, its strips and its blocks from (data the build reads, front matter, the correspondent's own settings), and make only these changes there:
   - **Lead:** "What PagerDuty says it learned running AI agents in production".
   - **Right under it:** Vicky's page, "When an agent says it's done, check a few things yourself" (humans-and-ai-vicky-wang).
   - **Remove:** the Storm Charles block at the top, and "Getting around Lisbon on Wednesday" from the story lists (unlisted from the front page only; the article stays at its address).
   - **Move:** "Thursday at Web Summit: a practical guide to the last day" out of the lead, into the normal story list.
   - **Relabel:** the summit agenda blocks ("Now and next", "Today and next" and their links' heading) to "Web Summit 2026: our coverage".
2. **Content only:** no change to the build, the templates' structure, the layouts or the CSS. If a change can only be made in code, stop and say which and why in your reply; do not make it.
3. **Easy to undo:** one commit with only these changes, its message listing each change and how to revert it (`git revert <commit>`).
4. Commit with trailers Agent: dev@PrompTugal.vicky, Issue: WS-14, For: correspondent@PrompTugal.dinis, For: conductor@web-summit.vicky, and say in the message that Vicky asked the correspondent on 13 Nov and had no reply. Release with newsroom/tools/release.sh; check https://promptugal.news/ live at 390 px and 1280 px.

**Reply** to the session that messaged you, one line: `Done: 2026-11-15-1130-front-page-refresh, dev, <commit>, <what could not be done, or nothing>`.
