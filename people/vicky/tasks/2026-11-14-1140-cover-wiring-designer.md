---
id: 2026-11-14-1140-cover-wiring-designer
for: designer@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Covers: where the designer draws, how the reviewer wires

Vicky, 14 Nov 2026, about 11:40 UTC (standing answer 71): "designer asks who wires a cover into the article. Keep designer to its own folder: it draws covers under desks/designer-vicky/covers/<slug>/, and the reviewer wires the cover into the article when it publishes. Tell both of them the exact field and path."

Draw each cover **only in your own folder**, `desks/designer-vicky/covers/<slug>/` in the newsroom (PrompTugal/PrompTugal__News__Website), where `<slug>` is the article's file name in `content/articles/` without `.md` (the conductor's task file names it). Put there, every time:

- `<slug>--paper--card.png`: 1200 x 630, the light theme
- `<slug>--ink--card.png`: 1200 x 630, the dark theme
- `<slug>--paper--thumb.png`: 480 x 480, light
- `<slug>--ink--thumb.png`: 480 x 480, dark
- the source file(s) you drew from (`.svg`)
- `notes.md`: the alt text (one sentence, what the cover shows, under 300 characters), and each number or label on the cover with the article line and source it comes from

Text at least 12 px at 390 px wide; only the article's sourced facts. Do **not** write in `design/`, `content/articles/` or anywhere outside your folder. When done, reply to the conductor with your commit.

Put this in your own prompts file as a short line pointing to this task file (not a copy), commit (Issue: WS-14, For: conductor@web-summit.vicky), release, and add the ledger line.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1140-cover-wiring-designer, designer, commit <sha>.`
