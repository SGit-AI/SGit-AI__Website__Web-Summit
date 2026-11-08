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

- The Live AI Office at /people/vicky/office/ built and tested, not pushed: 19 original pixel characters, five states from status.json and the viewer's clock, legend, newsroom strip, banner; licence audit in people/vicky/office/CREDITS.md (all original, no third-party art or code); gate OK, no keyring.js; screenshots at 390 px and 1440 px sent to Vicky; key dev-vicky-promptugal added to data/keys.json. Applied SA21. state: partial; done: office built and tested; next: release at Vicky's approval of the screenshots; ask: Vicky, approve the screenshots so I can release (I recommend yes); run: prompted
