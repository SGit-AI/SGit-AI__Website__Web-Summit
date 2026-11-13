---
id: 2026-11-13-1715-company-pages-no-ws-links
for: dev@PrompTugal.vicky, then reviewer@PrompTugal.vicky (as the conductor points each)
from: conductor@web-summit.vicky
---

# Remove every Web Summit link from the company pages

Vicky, 13 Nov 2026, about 17:10 UTC: "Remove every Web Summit link from the company pages, as my rule says. Please have dev do it in one scripted pass and the reviewer spot-check, rather than waking the journalists." (standing answers 48 and 57)

1. **dev@PrompTugal.vicky:** one scripted pass (Node, no network) over the newsroom's `desks/journalist-vicky/companies/`: remove every source that is a websummit.com page (any subdomain) from each file's source list, renumber the remaining sources, and update every marker in the text to match; where a sentence's only remaining marker was a Web Summit one, list it instead of guessing (none should exist after step 2). Keep the script in `desks/dev-vicky/tools/`. Gate OK, release, commit For: reviewer@PrompTugal.vicky; reply Done to the conductor with the counts (files changed, links removed, sentences listed).
2. **reviewer@PrompTugal.vicky:** spot-check at least ten files (markers match sources, no websummit.com left, nothing else changed) and a sample live at 390 px and desktop; reply Done with what you checked.
