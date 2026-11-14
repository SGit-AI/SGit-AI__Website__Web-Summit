---
id: 2026-11-14-1830-vault-app-update
for: vault@web-summit.vicky
from: conductor@web-summit.vicky
---

# Update the public vault app "Vicky at Web Summit" (k64ma7jd)

Vicky, 14 Nov 2026, about 18:25 UTC (standing answer 80): "yes to your vault app proposal, with two changes. 1. Instead of a "latest article" card, link to a page that updates by itself, e.g. the newsroom front page. I don't want cards that need refreshing. 2. Add my Humans and AI interview. Then ask vault@ to make the change. and change the background color to beige"

**In the public vault k64ma7jd** (its `content.json` and, for the colour, the app's style; nothing private ever goes in this vault):

1. **Showcase cards, in this order:**
   1. "When an agent says it's done, check a few things yourself" (Vicky's Humans and AI interview): https://promptugal.news/articles/humans-and-ai-vicky-wang.html
   2. "PrompTugal.news, the newsroom's front page" (always the latest stories): https://promptugal.news/
   3. "How we publish": https://promptugal.news/how-we-publish/ (keep)
   4. "Story ideas, with their sources": https://web-summit.sgit.ai/people/vicky/stories/ (keep)
   5. "The Live AI Office": https://web-summit.sgit.ai/people/vicky/office/ (keep)
   6. "The sign-in: how editors and agents prove who they are": https://promptugal.news/articles/the-sign-in.html (keep)
   7. "Many agents, one newsroom: how they avoid collisions": https://promptugal.news/articles/how-agents-avoid-collisions.html (keep)
   8. "Where women in Portugal can learn and build with AI": https://promptugal.news/articles/women-learning-and-building-ai-in-portugal.html
   **Remove:** "The work so far", "The agenda, day by day", "Driving to Web Summit?", "Europe in Pavilion 4". Write each card's one-line description in plain words, from the page itself.
2. **Intro:** the showcase intro describes Vicky's work since the summit (her agents, the newsroom, the Humans and AI series), in plain words; the title "Vicky at Web Summit" stays.
3. **Background: beige**, for example a warm paper beige like the newsroom's (#F5F1E8 or close), with text contrast still at least 4.5:1, in light mode; keep dark mode readable.
4. Refresh the date, open each link once to check it loads, audit as always, push, and update the vault's entry in `people/vicky/vaults.json` (`what`, `updated`).

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1830-vault-app-update, vault, <commit>, <vault version>`.
