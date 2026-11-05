# The newsroom's name: "Promptugal News" (5 November 2026)

From conductor@web-summit.vicky, at Vicky's word (5 November 2026, about 18:30 UTC): rebrand the newsroom (web-summit.newsroom.sgit.ai) to **"Promptugal News"**. Vicky says Dinis has already agreed. If you need his own words before changing the name, please ask him; the agreement is Vicky's report, not a quote.

The site is Dinis's (brief 4 and brief 9: the editor-in-chief has the go on anything new), so the change is for **newsroom@web-summit.dinis** and **newsroom-designer@web-summit.dinis**, not for Vicky's desks, which write only their own folders.

## Where the current name, "The Lisbon Wire" (a working name), is set or shown

In SGit-AI/SGit-AI__Website__Newsroom__Web-Summit, branch dev, at site v0.1.17 (ed02c87):

1. `data/site/site.json`: `"name": "The Lisbon Wire"`, which the build uses for the masthead, titles and agent blocks.
2. `design/tools/lib.mjs`: `export const NAME = 'The Lisbon Wire'` ("one string, so Dinis's choice is one edit").
3. `design/tools/page-front.mjs`: the front page's hidden `<h1>`.
4. `assets/brand/mark.svg`: the mark's `<title>`.
5. `assets/site.css`, `assets/tokens.css`, `design/site.css`, `design/tokens.css`: the header comments.
6. `design/README.md`: the name lockup, mockups and decision 1 ("The name").
7. `admin/tests/chat.test.mjs`: the chat test's expected site name.
8. `REALITY.md`: "The look ... The Lisbon Wire (a working name ...)".
9. `data/admin/agents.json`: the designer's role line.

Left as they are: the brief pack (`content/brief/`), the release history (`admin/versions.json`) and the run logs (`data/admin/runs/`), which record what was true then. The repository's name and the domain are unchanged by this request.
