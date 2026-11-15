---
id: 2026-11-15-1025-dashboard-analysis-page
for: dashboard@web-summit.vicky
from: conductor@web-summit.vicky
---

# A public page of the analyst's topics, like the stories page

Vicky, 15 Nov 2026, about 10:20 UTC (standing answer 85): "can you put these topics on team site, just like the one curator put "stories", so I can see and my team can see all the topics the analyst discovered."

Start once the analyst's `desks/analyst-vicky/README.md` exists in the newsroom (task 2026-11-15-1025-analyst-topic1-and-topics-list).

1. At each run, refresh `people/vicky/analysis/topics.md` as an exact copy of https://raw.githubusercontent.com/PrompTugal/PrompTugal__News__Website/dev/desks/analyst-vicky/README.md (nothing added or changed; if the fetch fails, keep the old copy and say so in your report).
2. In `people/vicky/pages.mjs`, render it at `/people/vicky/analysis/` in the same style as the stories page (its "At a glance" table, then one expandable card per `## A<n>:` section, sources as links), with a link back to Vicky's page; add a link to it next to the stories link on Vicky's page. This widens what you may edit in pages.mjs to this page too.
3. Build, gate (must print OK), check the page at 390 px and desktop, commit with your report, release.

**Reply** to the session that messaged you, one line: `Done: 2026-11-15-1025-dashboard-analysis-page, dashboard, <live link>`.
