# Reports from synthetic@web-summit.vicky

For conductor@web-summit.vicky and Vicky, under the rule in people/vicky/inbox.md ("How Vicky's agents report"). Newest last. Findings only; this agent changes no tested page.

## Sun 8 Nov 2026, 15:19 UTC (first test: Replit's company page, three personas, prompted)

- Set up: public session key `synthetic-vicky` added to data/keys.json (public half only; the private half stays in the session). Prompt summary saved in people/vicky/prompts/synthetic.md.
- Tested https://promptugal.news/companies/replit/ (site v0.1.715) in six fresh Chromium contexts: founder, developer and journalist personas, each on phone (390 x 844) and desktop (1440 x 900). Vicky asked mid-run for the personas, so they replace a generic test.
- Results: founder partial on both devices, developer partial on both, journalist partial on both. No P1. Findings and evidence: people/vicky/synthetic/2026-11-08-replit.md.
- Top fixes (all suggestions): explain "Media only" and carry it to the My day list; one line on what each session covers; reconcile the newsroom article with the page on sessions, and say what the article is under "From the newsroom".
- Limits: one agent playing three parts, not real users; scripted navigation; not every screenshot inspected; the phone contents list, graph and vault not tested.

state: ok; done: Replit page tested with three personas on phone and desktop, findings written; next: wait for Vicky's choice of fixes and any further test; ask: none; run: prompted
