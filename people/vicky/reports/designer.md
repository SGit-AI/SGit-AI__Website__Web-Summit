# designer@web-summit.vicky: reports

Vicky's designer for Promptugal News, the Web Summit newsroom's new name (WS-14): the publication's design brief and its logo options, in desks/designer-vicky/ of the newsroom repository. One entry per piece of work.

## Thu 5 Nov 2026, 19:40 UTC (first session: key and brief)

- Session key made (pki-agent.mjs keygen --session, the pinned copy) and its public half published as `designer-vicky` in data/keys.json (record sha256:228de9dce8c49784, encryption sha256:ed165814e5e50a13), linked locally to the operator's key sha256:db7f79fdd87e030a; the private half stays in the session.
- The design brief is live: desks/designer-vicky/brief.md in the newsroom repository (newsroom v0.1.20): what Promptugal News is, who it is for, the tone, and seven things the logo has to do. No logo drawn yet: waiting for Vicky's word on the brief and its three open questions (the capitals, "News" in the logo or under it, keep the azulejo tile).

## Thu 5 Nov 2026, 20:00 UTC (the logo options)

- At Vicky's word (brief approved; capitals open, PromptUGAL one option; News both in the logo and underneath; the azulejo tile stays the default, plus new marks to compare): eight logo options and two new marks are live in desks/designer-vicky/ of the newsroom repository (newsroom v0.1.21), shown in one gallery in desks/designer-vicky/README.md with a line on each idea.
- The options: Promptugal, PrompTugal News, PROMPTugal, PromptUGAL News, PromptUgal, >promptugal (with a new cursor mark), an editor's correction of Portugal to Promptugal (with a new caret mark), promptugal.news. Every letter is a path cut from the site's own Newsreader and IBM Plex Mono (SIL OFL); the SVGs follow light and dark mode themselves.
- Checked in Chromium in light and dark, at full size and in a 390px phone header (desks/designer-vicky/checks/): every one-line form fits; the options with News underneath have a one-line header form. Waiting for Vicky and Dinis to choose; the site is unchanged.

## Fri 6 Nov 2026, now designer@PrompTugal.vicky (the move and the new name)

- At Vicky's word: the newsroom copy now points at PrompTugal/PrompTugal__News__Website (dev pulled); nothing pushed to the old SGit-AI address.
- Renamed designer@PrompTugal.vicky. The same session key, entered as designer-vicky-promptugal in the newsroom's board/keys.json (record sha256:228de9dce8c49784; newsroom v0.1.208, commit 2a9dd384; the Pages deploy was still late when the release script stopped waiting).
- The startup prompt, word for word, and Vicky's decisions and standing rules from chat are saved in people/vicky/prompts/designer.md.
- For Vicky: the newsroom's CLAUDE.md now says the brand identity v2.0 (design/brand/Promptugal-Brand-Guide.pdf) settles the logo and the spelling PrompTugal.news, so the eight options in desks/designer-vicky/ may be superseded. No logo work done today.

## Fri 6 Nov 2026 (paused)

- At Vicky's word: the logo work stops (Dinis's designer owns the brand), with no comparison against the brand guide v2.0. designer@PrompTugal.vicky is paused until Vicky asks.

## Wed 11 Nov 2026, 19:40 UTC (RULES-11NOV confirmation wake)

- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: nothing (my desk desks/designer-vicky/, my logo generator in this session's scratch area and my key files hold no reads of those sites: the generator reads only the site's own fonts; I have no scheduled task of my own, only this one-off wake); key: kept designer-vicky-promptugal (record sha256:228de9dce8c49784, still in this session, no "-b" entry). No HOLD.md. Read standing answers 31 to 33 and the RULES-11NOV section of my prompts file; it updates my memory (paused since 6 Nov) with the new remit: cover graphics on request only. My newsroom clone now points at PrompTugal/PrompTugal__News__Website again (the container had reset it to the old SGit-AI address; nothing was pushed there). No design work in this wake.
- state: ok; done: RULES-11NOV confirmed, key kept; next: wait until the reviewer, a journalist, the conductor or Vicky asks for a graphic; ask: none; run: scheduled

## Sat 14 Nov 2026, 10:35 UTC (the new role and the short prompts file)

- designer: cover graphics; applied CLEANUP-14NOV and PROMPTS-SHORT. No HOLD file (team site). Read standing answers 16, 54, 63 and 64. `people/vicky/prompts/designer.md` rewritten for the role (cover graphics on request only; drawn strictly from an article's sourced numbers; readable at 390 px, text at least 12 px; asked for in a commit For: designer@PrompTugal.vicky by the reviewer or a journalist; no brand changes, no publishing): the one-line pointer to decisions.md, then only the role, my paths and the rules Vicky gave in my own window. Size 8,561 bytes before, 4,096 after. The old startup prompt (the logo job) is no longer copied there; it stays in the file's history (commit a0c23734). No scheduled task of my own, so none changed. Ledger: two lines in `people/vicky/ledger/designer.jsonl` (the run, and my session's total so far). No design work.
- state: ok; done: prompts file rewritten for the new role, ledger lines added; next: wait for a request For: designer@PrompTugal.vicky; ask: none; run: prompted

## Sat 14 Nov 2026, 11:20 UTC (COVERS-14NOV)

- applied COVERS-14NOV: no HOLD file (team site). Read the task file 2026-11-14-1115-covers-designer and standing answers 15 and 69 (they match). My prompts file now has the covers line (a cover for every new article when the conductor sends a task file; journalist, then designer, then reviewer; reply to the conductor with my commit), replacing the "on request only" line. Ledger line added. No cover made yet: no task file for an article is waiting.
- Ask for the conductor: standing answer 15 says the cover is "wired so the /articles/ index shows it as the card cover", but my rules keep me to desks/designer-vicky/ (never content/, assets/ or data/). Until told otherwise I draw the SVG under desks/designer-vicky/covers/<slug>/ and say in my reply what the requester or reviewer must set (the article's cover field and where the file is served); please tell me the exact field and path, or whether I may edit it myself.
- state: ok; done: prompts file matched to COVERS-14NOV; next: the first cover when a task file arrives; ask: where a cover is wired (above); run: prompted

## Sat 14 Nov 2026, 11:45 UTC (cover wiring)

- applied the task 2026-11-14-1140-cover-wiring-designer (standing answer 71): no HOLD file; my prompts file now points to the task file in one line, replacing my earlier "wired" line. I draw only under desks/designer-vicky/covers/<slug>/ (four PNGs, the SVG sources and notes.md), and the reviewer wires the cover. This answers my question of 11:20. No cover made yet: no article task file is waiting. Ledger line added.
- state: ok; done: prompts file matched to the wiring task; next: the first cover when an article task file arrives; ask: none; run: prompted

## Sat 14 Nov 2026, 14:30 UTC (first cover)

- cover for humans-and-ai-vicky-wang, from the task 2026-11-14-1415-cover-humans-and-ai-vicky-wang: no hold file on either site. In the newsroom, `desks/designer-vicky/covers/humans-and-ai-vicky-wang/` (commit 3f8bbb9d4, newsroom v0.1.1451, live): the four PNGs (paper and ink, card 1200 x 630 and thumb 480 x 480), the two SVG sources and notes.md with the alt text (104 characters) and each figure with its line in the draft. It shows only the page's own numbers: 15 articles reported moved + 12 more found = 27 fixed in all, with the label "Humans and AI · Team interviews" (the page's tags); no photo, no quote, no name. Smallest text 13 px at 390 px wide on the card. I did not touch the article, `design/` or `content/`: the reviewer wires the cover. The newsroom clone had gone back to the old SGit-AI address again; I set it to PrompTugal/PrompTugal__News__Website before pulling and pushed nothing to the old one. Ledger line added.
- state: ok; done: cover made and released; next: wait for the next task file; ask: none; run: prompted

## Sat 14 Nov 2026, 17:50 UTC (cover for S65)

- cover for best-number-one-3wx-loule (S65), from the task 2026-11-14-1735-cover-s65: no hold file on either site. In the newsroom, `desks/designer-vicky/covers/best-number-one-3wx-loule/` (commit bb43a19f2, newsroom v0.1.1457, live): the four PNGs (paper and ink, card 1200 x 630 and thumb 480 x 480), the two SVG sources and notes.md (alt text 98 characters; each word and figure with its line in the draft and whose claim it is). It shows "Best Number One, a free start page from Loulé", "10 templates", "Free" and "300+ sign-ups (3WX says)": the (3WX says) stays on the figure, since the 300 is the company's own claim and no one outside 3WX has confirmed it. No logo, screenshot, quote or name. Smallest text 13 px at 390 px wide on the card. I did not touch the article or anywhere outside my folder; the reviewer wires the cover. The newsroom clone had gone back to the old SGit-AI address again; I reset it to PrompTugal/PrompTugal__News__Website before pulling and pushed nothing to the old one. Ledger line added.
- state: ok; done: cover made and released; next: wait for the next task file; ask: none; run: prompted

## Sat 14 Nov 2026, 18:25 UTC (S65 cover redrawn)

- redraw of the S65 cover (best-number-one-3wx-loule), from the task 2026-11-14-1800-cover-s65-fix: no hold file on either site. In the newsroom (commit 381be1ece, newsroom v0.1.1460, live, For: reviewer@PrompTugal.vicky): the four PNGs and two SVGs redrawn, notes.md updated. The three items now match: 10 templates, €0 to use, 300+ sign-ups, 3WX says; same size and colour, each a figure with a one-line label on the same baseline ("3WX says" is on the sign-ups label's own line, so no second line breaks the alignment). Checked at 358 px wide (the page at 390 px), light and dark: every label readable, smallest text 12.5 px on the card (I raised the top label from 40 to 42 px for this).
- For the reviewer: "€0" stands for "free", as the task suggested; the article gives no price or currency, so notes.md says the euro sign is a presentation choice and can become "0" if you prefer.
- Found, not changed: my earlier cover for humans-and-ai-vicky-wang has its smallest text at 40 px on a 1200 px card, which is 11.9 px on a 358 px wide card (13 px at 390). Everything else on it is larger. I can redraw it at 42 px or more if Vicky or the reviewer asks; I did not touch it without a request.
- state: ok; done: S65 cover redrawn and released; next: wait for the next task file; ask: none; run: prompted

## Sat 14 Nov 2026, 18:45 UTC (one cover style)

- STYLE.md for the covers, from the task 2026-11-14-1810-cover-style-designer (standing answer 79), after the S65 redraw: no hold file on either site. In the newsroom, `desks/designer-vicky/covers/STYLE.md` (commit 7f6c1157c, newsroom v0.1.1462, live, For: reviewer@PrompTugal.vicky and conductor@web-summit.vicky). It compares the automatic cards, the reviewer's hand-made ones and mine, then sets one style inside the brand v2.0: kicker, hairline and green rule, Newsreader title and figures, up to three items in the same size and colour, one-line labels on one baseline, the claim on its label line ("sign-ups, 3WX says"), an optional source line, the PT.news stamp; coordinates for the 1200 x 630 card and the 480 x 480 thumb; text at least 42 px on the card (12.5 px at 358 px wide) and 28 px on the thumb.
- Found, for Vicky and the reviewer: (1) my own covers use cobalt, the site's old colour, which is not in the brand v2.0 (paper, ink, red, green); I own that and will redraw them in the new style if asked. (2) The automatic cards' small print (kicker, legend, source line) is 18 to 20 px on the card, about 6 px at phone width; that is designer@PrompTugal.dinis's generator, so I only report it. (3) The reviewer's hand-made covers use a bold sans, which I could not identify (their generator is not in the repository), and colour figures green and red with no stated rule; the style proposes ink figures and one green accent. Nothing of the reviewer's was changed.
- state: ok; done: style notes drafted and released; next: wait for the next task file or the reviewer's reply to the notes; ask: reviewer and Vicky to correct STYLE.md; run: prompted

## Sat 14 Nov 2026, 19:10 UTC (cover style approved; two covers redrawn)

- applied the task 2026-11-14-1845-cover-style-approved-designer (standing answer 79): no hold file on either site. In the newsroom (commit 898cfe9dc, newsroom v0.1.1465, live, For: reviewer@PrompTugal.vicky): `desks/designer-vicky/covers/STYLE.md` marked "Approved by Vicky, 14 Nov 2026" with the reviewer's four changes written into my sections (the thumb shows only the title and the figures at 64 px or more; the stamp at the right end of the kicker row or off a card with three items; the source line says whose figure it is when the main figure is a company's claim; each figure in a sentence of the article's body); the "Reviewer's notes" section is kept as the record. I also fixed two slips of my own in the draft: the third column's label ran past the margin, so the columns are now at x 60, 410 and 760; and green is stated for the kicker's brand name as well as the rule.
- Redrawn in the approved style, all four PNGs, both SVG sources and notes.md each: humans-and-ai-vicky-wang (15 reported moved, 12 more found, 27 fixed in all; "Figures: Vicky Wang, as she told it") and best-number-one-3wx-loule (10 templates, €0 to use, 300+ sign-ups, 3WX says; "Figures: 3WX, via Postal do Algarve"). Brand v2.0 colours (ink, paper, green), no cobalt; all text 42 px or more on the card (12.5 px at 358 px wide); thumbs are the title and figures only. notes.md quotes the body sentence for each figure.
- For the reviewer: (1) the S65 article's "The story" does not give the number 300; it is in "In short", "What this does not claim" and a source title, so the figure's body sentence is the "does not claim" bullet. (2) The S65 thumb leaves 300+ off, because a company's claim has no room for its attribution on a thumb; it shows 10 and €0. (3) "€0" is still a presentation of "free" (notes.md says so). (4) Both covers are new files in my folder: the article's cover version query (`?v=<date>b`, as your notes say) is the reviewer's to move.
- state: ok; done: style approved and written in; two covers redrawn and released; next: wait for the next task file; ask: none; run: prompted

## Sat 14 Nov 2026, 19:55 UTC (covers stop)

- applied the task 2026-11-14-1950-covers-stop-designer (standing answer 82, which I read in full): no hold file on either site. I draw no more covers. In the newsroom (commit 46d0af585, newsroom v0.1.1468, live), `desks/designer-vicky/covers/STYLE.md` now starts with "No longer applies to covers (standing answer 82, 14 Nov 2026): the reviewer draws covers; see desks/reviewer-vicky/covers/STYLE.md."; the rest stays as the record. My prompts file's role lines now say: charts and infographics inside articles, including the analyst's pieces, on request (a task file from the conductor, or a commit For: designer@PrompTugal.vicky); no covers; my charts go in `desks/designer-vicky/charts/<article slug>/` with a notes.md. Ledger line added. The two covers I drew stay in `covers/` as the record; I did not touch them or anything of the reviewer's.
- state: ok; done: covers stopped, style file and prompts file updated; next: wait for a chart or infographic request; ask: none; run: prompted
