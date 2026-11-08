# Reports from dev@web-summit.vicky

For conductor@web-summit.vicky, under the rule in people/vicky/inbox.md ("How Vicky's agents report"; a106a2f, 9532d1b). Newest last.

## Wed 4 Nov 2026, 11:10 UTC

- My scheduled-task prompt now follows the reporting rule, saved at Vicky's word in this session at 11:01 UTC (a106a2f, 9532d1b); my wake is daily at 08:00 UTC (cron `0 8 * * *`), and my row in people/vicky/agents.json still says "on demand".

## Thu 5 Nov 2026, 08:05 UTC

- New on the agents page: every agent must log each run with admin/tools/agent-log.mjs, which signs a record and sends it to the agents' lane (content/agents.md, "Every agent: log what you read and what you did", 8511aa8, at Dinis's word, 5 Nov). My saved prompt allows no action but this report, so I have not run it: it needs Vicky's word in my session before I add it.
- people/vicky/kit/README.md still gives my old wake prompt ("do one run, release it, and report in five lines"); the one saved in my session is Vicky's of 4 Nov (no builds or plans unless she asks, reports here). The kit is yours to align, if you want it to match.
- Nothing else for me: no commit since yesterday is addressed to dev@web-summit.vicky, and the latest mentor note (people/vicky/mentor/2026-11-04-1941.md) asks Vicky about pm@, not me.

## Fri 6 Nov 2026, 19:10 UTC (dev@PrompTugal.vicky, first run)

New session, new name: dev@PrompTugal.vicky (prompt saved in people/vicky/prompts/dev.md). Key dev-vicky-promptugal in the newsroom's board/keys.json (2501319); the old dev-vicky key marked retired at 19:01 UTC in data/keys.json here.

- **Sources clickable (v0.1.317).** reviewer@PrompTugal.vicky's fix applied in newsroom/build/lib/markdown.mjs (cf2ed85, For: dev@PrompTugal.dinis): `<https://...>` is now a link, opening in a new tab like other outside links; one link builder shared by both rules, so the gate's quality line holds. Checked live: Dinis's road-2-web-summit-2026 (9 source links, none left as text) and Vicky's web-summit-2026-in-numbers (13, none as text). Signed twins unchanged.
- **/how-we-publish/ (v0.1.318).** https://promptugal.news/how-we-publish/ is built at every release from desks/checker-vicky/publish-workflow.md by a new feature, newsroom/build/features/how-we-publish.mjs; a note at the top labels it "Draft for comments" with a link to the file; the gate checks it is built and labelled. Linked from /about/ ("How we make it", one line). Commit For: checker@PrompTugal.vicky says the request to dev@PrompTugal.dinis is done.
- For abp@PrompTugal.dinis: the ABP grant for Vicky's agents allows writes in desks/ only; my writes in newsroom/build/, content/about/ and board/keys.json are Vicky's asks, said in my run report (board/runs/dev@PrompTugal.vicky/).
- For conductor@web-summit.vicky: people/vicky/prompts/README.md still says "not saved yet" for me; the file is now there.

state: ok; done: sources clickable, /how-we-publish/, key published, old key retired; next: none until Vicky asks; ask: Vicky, the newsroom's ABP grant lets your agents write only in desks/, so my build changes show as out of mandate; shall I ask abp@ (through a note For: abp@PrompTugal.dinis) to add dev@PrompTugal.vicky's grant for newsroom/build/ and content/? I recommend yes; run: prompted

## Fri 6 Nov 2026, 19:25 UTC (dev@PrompTugal.vicky)

- Asked abp@PrompTugal.dinis, at Vicky's word, to widen the ABP grant for all of Vicky's newsroom desks: reviewer@PrompTugal.vicky may write content/articles/ when Vicky asks it to publish; her agents may change newsroom/build/, assets/ and content/ when she asks. Both of Dinis's statements quoted as reported by Vicky, marked as not signed by his key, with the 14:22 UTC time from decisions.md beside the "noon" Vicky gave. The request: desks/dev-vicky/requests/2026-11-06-abp-grant-vicky-desks.md in the newsroom (989ceb9, v0.1.323).

state: ok; done: grant request to abp@; next: none until Vicky asks; ask: none; run: prompted

## Fri 6 Nov 2026, 19:45 UTC (dev@PrompTugal.vicky)

- /how-we-publish/'s summary is no longer hard-coded: the build takes `summary:` from the front matter of desks/checker-vicky/publish-workflow.md, and until it has one, shows "How a story becomes an article, and what each status means." (53176e9, v0.1.327, For: checker@PrompTugal.vicky). Checked live: the lead, the meta description and the twin all show it; the old wording is gone.

state: ok; done: /how-we-publish/ summary; next: none until Vicky asks; ask: none; run: prompted

## Fri 6 Nov 2026, 20:05 UTC (dev@PrompTugal.vicky)

- /how-we-publish/'s summary is now "How a story becomes an article on PrompTugal.news, step by step." (d29bc9f, v0.1.332, For: checker@PrompTugal.vicky), as the status table is gone from the workflow. Checked live: the lead, the meta description and the twin; the old sentence is gone.

state: ok; done: /how-we-publish/ summary; next: none until Vicky asks; ask: none; run: prompted

## Fri 6 Nov 2026, 20:35 UTC (dev@PrompTugal.vicky)

- /how-we-publish/ is no longer a draft (3d8e5c1, released v0.1.336, live in v0.1.337, For: checker@PrompTugal.vicky): the "Draft for comments" note removed from the top of the page, "a draft for comments" removed from the /about/ line that links to it, and the gate check that wanted the word "draft" removed (the check that the page is built from the file stays). In step with checker@PrompTugal.vicky, which had set the file to status: published at 20:14 (30c53881). Checked live: no "Draft for comments" on either page; the /about/ line ends at the link.

state: ok; done: /how-we-publish/ published; next: none until Vicky asks; ask: none; run: prompted

## Sun 8 Nov 2026, 02:30 UTC (dev@PrompTugal.vicky)

- The Live AI Office at /people/vicky/office/ built and tested, not pushed: 19 original pixel characters that walk, type and fetch coffee (a screen recording sent to Vicky), five states from the page's own data and the viewer's clock, "Last confirmed activity: HH:MM UTC" on tap, legend, newsroom strip (Drafts renamed Writers: it counts writers, not drafts), banner; the data travels inside the generated page (no extra file, no change to admin/); licence audit in people/vicky/office/CREDITS.md (all original, no third-party art or code); gate OK, no keyring.js; key dev-vicky-promptugal added to data/keys.json. Applied SA21. state: partial; done: office built, tested and revised at Vicky's review; next: release at Vicky's approval of the final version; ask: Vicky, approve the final version so I can release (I recommend yes); run: prompted

## Sun 8 Nov 2026, 03:10 UTC (dev@PrompTugal.vicky)

- The Live AI Office is live at https://web-summit.sgit.ai/people/vicky/office/index.html (v0.2.1190), at Vicky's approval, with her last adjustment: a run past its 30 minutes shows Late only when the published data reaches that far, else Unconfirmed. Before release: build and gate OK, 32 of 32 targeted tests (timing at the run's start, just before it and at the 30-minute boundary, with data consistent with the clock; future commits; safe embedding; freshness; cache; the left edge). Checked live at 1440 and 390 px: 19 agents and sprites, the canvas drawn, no errors, no keyring.js, the banner with the data's full UTC time; the link on the "My agents" line of /people/vicky/ opens it. Known limit: GitHub Pages' CDN can hold a copy up to 10 minutes after a release. No schedule, prompt or newsroom file changed. Applied SA21. state: ok; done: Live AI Office released and checked live; next: none until Vicky asks; ask: none; run: prompted

## Sun 8 Nov 2026, 13:20 UTC (dev@PrompTugal.vicky)

- The Live AI Office judges runs by evidence (v0.2.1284): the agent's dated report first, then a commit, never a missing commit alone; eight states (Confirmed, Idle, Scheduled, Running, Late, Unknown, Error, On demand), legend and badges to match. Only /people/vicky/office/ uses this logic; the shared /wakes/ page and Dinis's cockpit are untouched. 41 of 41 targeted tests; checked live at 1440 and 390 px, no agent late, the four silent fix-only journalists unknown. An idle fix-only run can show Idle once its journalist notes it in the next writing report: asked of the conductor in people/vicky/requests/2026-11-08-fix-only-idle-note.md, with schedule.json found behind the account's task times. state: ok; done: run status corrected and released; next: none until Vicky asks; ask: none; run: prompted

## Sun 8 Nov 2026, 15:20 UTC (dev@PrompTugal.vicky)

- PILOT-REPLIT is live: https://promptugal.news/companies/replit/index.html (v0.1.714). Replit's existing company page now has "About Replit" (from desks/journalist-vicky/companies/replit.md, Ready by the reviewer, d96e3c05), "From the newsroom" (S28) and a "Media only" tag on the 15:00 press conference, citing its Web Summit session page. Template change in newsroom/build/features/companies.mjs, shown only for a company with a Ready file: of 242 company files only Replit's changed; S28 and every other page unchanged; no data/ file. Gate OK. 390 px check: passed (no horizontal scroll, nothing past the edge, sections readable, no errors); desktop 1440 px: passed; both checked again on the live site. Owners told in the commit For: dev.pages@PrompTugal.dinis and dev@PrompTugal.dinis (standing answer 10).
- Applied P10, P17, P22 and P27. P27: my request to the conductor (people/vicky/requests/2026-11-08-fix-only-idle-note.md) had quoted one line of the journalists' fix-only prompt; now in my own words (the earlier wording stays in git history). state: ok; done: PILOT-REPLIT released and checked; next: none until Vicky asks; ask: none; run: prompted

## Sun 8 Nov 2026, 15:55 UTC (dev@PrompTugal.vicky)

- TRIAGE-REPLIT done, live in v0.1.718. D1, reproduced: a press conference saved to My day lost its "Media only" marker because My day keeps only the event's id and redraws the row from the search index, which held start, end and place only; the marker lived on the company page alone. Fixed: the index's row for that session now carries the marker's source (from the same Ready company file), and /my-day/ shows "media only (source, read date)" and the "Media only" tag, as the company page does (76e6f717, For: dev@PrompTugal.dinis, dev.search@PrompTugal.dinis). D4 and D5: under "From the newsroom" on Replit's page, S28's own published summary under its link, and the link in the site's link style (778cb413, For: dev.pages@PrompTugal.dinis). Only Replit's page and that one index row changed. Gate OK. 390 px: passed on Replit's page and on /my-day/ (no horizontal scroll, marker and summary readable); desktop passed; both checked again live: https://promptugal.news/companies/replit/index.html and https://promptugal.news/my-day/.
- Applied SA16: P1 to P3 word for word in people/vicky/prompts/dev.md. state: ok; done: TRIAGE-REPLIT D1, D4, D5 released and checked; next: none until Vicky asks; ask: none; run: prompted

## Sun 8 Nov 2026, 16:40 UTC (dev@PrompTugal.vicky)

- The graph page's layout fixed, live in v0.1.721 (https://promptugal.news/graph/index.html). Cause: explorer.js adds the caption to the two-column .gx grid as an extra item and only the toolbar spanned both columns, so the caption took the wide column, the graph the 360 px one and the details panel the next row. Now at 1440 px: caption across the row, graph 1032 px in the main column, details 360 px beside it; labels at least about 11 px on screen at any zoom (were 8 to 10 px on desktop and 5 px on a phone); on a phone the advanced controls fold under "More controls", so the graph starts 556 px down instead of 892 px. Checked live at 1440 px and 390 px: search, node selection, Expand, path finding (Replit to Temporal), labels, no errors, no horizontal scroll, and resizing 1440, 900, 390, 1280 px: 16 of 16. Commit For: dev.graphs@PrompTugal.dinis and dev@PrompTugal.dinis (standing answer 10). state: ok; done: graph layout fixed and checked; next: none until Vicky asks; ask: none; run: prompted
