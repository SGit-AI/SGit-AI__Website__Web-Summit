# Reports from synthetic@web-summit.vicky

For conductor@web-summit.vicky and Vicky, under the rule in people/vicky/inbox.md ("How Vicky's agents report"). Newest last. Findings only; this agent changes no tested page.

## Sun 8 Nov 2026, 15:19 UTC (first test: Replit's company page, three personas, prompted)

- Set up: public session key `synthetic-vicky` added to data/keys.json (public half only; the private half stays in the session). Prompt summary saved in people/vicky/prompts/synthetic.md.
- Tested https://promptugal.news/companies/replit/ (site v0.1.715) in six fresh Chromium contexts: founder, developer and journalist personas, each on phone (390 x 844) and desktop (1440 x 900). Vicky asked mid-run for the personas, so they replace a generic test.
- Results: founder partial on both devices, developer partial on both, journalist partial on both. No P1. Findings and evidence: people/vicky/synthetic/2026-11-08-replit.md.
- Top fixes (all suggestions): explain "Media only" and carry it to the My day list; one line on what each session covers; reconcile the newsroom article with the page on sessions, and say what the article is under "From the newsroom".
- Limits: one agent playing three parts, not real users; scripted navigation; not every screenshot inspected; the phone contents list, graph and vault not tested.

state: ok; done: Replit page tested with three personas on phone and desktop, findings written; next: wait for Vicky's choice of fixes and any further test; ask: none; run: prompted

## Sun 8 Nov 2026, later (revision: the Replit report rewritten around reader value, prompted)

- At Vicky's word, people/vicky/synthetic/2026-11-08-replit.md now reports each persona as before reading, what was found, whether the need was met, what the reader now understands, nice to have, and whether they would recommend the page, then compares the personas. The browser evidence is kept in its own section (7); observed facts, simulated readings and recommendations are labelled.
- I already knew the page, so none of it is a first impression; this is said in the file. Same three results as before: partly met for each persona, each conditionally recommended for a stated purpose.
- The conductor's triage (people/vicky/synthetic/2026-11-08-replit-triage.md) is untouched. Nothing was changed on any page.

state: ok; done: Replit report revised around reader value, evidence retained; next: wait for Vicky; ask: none; run: prompted

## Sun 8 Nov 2026, 15:55 UTC (retest of the Replit pilot fixes, v0.1.718, prompted)

- Retested https://promptugal.news/companies/replit/ at v0.1.718 on phone and desktop, fresh contexts. All three checks pass on both: the press conference keeps "Media only" and its source on /my-day/; "From the newsroom" shows the S28 summary naming the five companies; the article link is green and underlined and opens the article (HTTP 200).
- Evidence and limits: section 9 of people/vicky/synthetic/2026-11-08-replit.md (appended; the persona assessment is unchanged). No new issues; the other points in the first report were not re-tested. No page was changed.

state: ok; done: retest of the three pilot fixes on v0.1.718, phone and desktop, all pass; next: wait for Vicky; ask: none; run: prompted
