# analyst@PrompTugal.vicky: reports

Vicky's analysis desk for PrompTugal.news (standing answer 75). One entry per run.

## Sun 15 Nov 2026, 09:30 UTC (first run: key, prompts file, first proposal)

- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: nothing (a new session with no tools, scripts, notes or scheduled task of its own yet).
- **Key:** a session key was made with the pinned copy of pki-agent.mjs (sha256 fcb28a1c…, matching `admin/tools/seal.mjs`), record sha256:6cb6fbf8dcb82ed1, encryption sha256:07143845134c4bfd. Its public half is in `data/keys.json` as `analyst-vicky`. The private half stays in this session.
- **Prompts file:** `people/vicky/prompts/analyst.md`, in the pattern of standing answer 64.
- **Blocked: the newsroom.** Attaching PrompTugal/PrompTugal__News__Website was refused in this session (the add-repository permission was denied). So I have not read the newsroom's CLAUDE.md or STYLE.md, I have not added `analyst-vicky-promptugal` to its `board/keys.json`, and the proposal below is here and not in `desks/analyst-vicky/proposals/2026-11-15.md`. I will move it there word for word once the newsroom is attached.
- **Blocked: the primary sources.** This session's network policy refuses every statistics host I tried: ec.europa.eu (Eurostat), www.ine.pt, dados.gov.pt, www.pordata.pt, www.ren.pt, startupportugal.com, dealroom.co and oecd.ai. A web search still works, so the figures below come from press reports of the official releases. **None of them is checked at its primary source yet**, and none will reach a draft until it is.

### Proposal: the first piece (up to three topics)

#### 1. Four in ten, two in three, nine in ten: how many people in Portugal use AI? (recommended first)

- **The question.** Official statistics and private surveys give very different shares of people in Portugal who use AI. Which number answers which question, and what does the official series show about who uses it (age, education, work, region)?
- **The AI path.** AI directly, 0 steps. It links to the Humans and AI series. Places: Portugal, the Algarve (if INE's table gives NUTS II regions), Europe (Eurostat's EU figure).
- **Primary sources.** INE, *Inquérito à Utilização de TIC pelas Famílias* 2025 (published November 2025), and Eurostat's matching individuals' table for the EU comparison. The private surveys appear only as the comparison the piece explains, each named as the company's own claim, with its sample and question.
- **Press figures to check at source.** 38.7% of people aged 16 to 74 in Portugal used AI tools between May and August 2025 (ECO, 21 Nov 2025, citing INE). "About two in three" Portuguese use AI tools (ECO and Portugal Global, Jan 2026, a private survey). "Almost 90%" of Portuguese workers use AI at work (HR Portugal, a private survey).
- **What the data can show.** One official, comparable reference point for 2025, the EU comparison, and the breakdowns INE publishes. It can also show why the numbers differ: a different population (all residents against workers or online panels), a different period (three months against "ever"), and a different question (the tools named).
- **What it cannot show.** A trend. If the AI question was first asked in the 2025 wave, there is no earlier official year to compare, and the piece says so. It also cannot show how often or how well people use AI. Private online panels are not samples of the whole population.
- **Rough size.** 700 to 900 words. One chart: the official share for Portugal and the EU, and Portugal by age group. Every bar comes from INE or Eurostat, with the private figures in a labelled note under the chart, not on the same axis.

#### 2. One firm in nine: AI in Portuguese companies, and how far behind the EU

- **The question.** How many companies in Portugal use AI, how fast that is changing, and how the share compares with the EU by company size.
- **The AI path.** AI directly, 0 steps. Places: Portugal and Europe. Regions only if INE's table breaks them out.
- **Primary sources.** INE, *Inquérito à Utilização de TIC nas Empresas* 2025 (Nov 2025). Eurostat, enterprises' use of AI (table isoc_eb_ai) and its Statistics Explained article.
- **Press figures to check at source.** 11.5% of companies in 2025, up 2.9 points from 8.6% in 2024 and 7.9% in 2023. By size: 49.1% (250+ staff), 18.2% (50 to 249), 9.4% (10 to 49). Sources: ECO and Sábado, Nov 2025, citing INE. One DN article gives a 0.8-point rise, which does not match 8.6% to 11.5%. I check which one is right, and how DN reached 0.8.
- **What the data can show.** A three-year direction for companies with 10 or more staff, the gap with the EU, and the gap between small and large companies.
- **What it cannot show, and the comparisons to judge.** The survey covers companies with 10 or more staff and leaves out some sectors (I check which, including finance). It excludes the micro-firms most Portuguese companies are. The list of AI technologies in the question changed between waves, so earlier years may not compare. It cannot show how deeply companies use AI, or whether that changes jobs.
- **Rough size.** 600 to 800 words. One chart: Portugal against the EU over the years the definitions match, plus the 2025 size split.

#### 3. Sines and the grid: what Portugal's data-centre plans add up to

- **The question.** How much data-centre capacity is built, how much is approved and how much is only announced, and what that means for Portugal's electricity demand.
- **The AI path.** Two steps: AI models are trained and run in data centres (step 1), and data centres draw on the grid and on renewable supply (step 2). Places: Sines (Alentejo), Portugal, Europe.
- **Primary sources.** REN's public statements and grid-connection allocations; DGEG and REN consumption statistics; the Government's national data-centre plan (approved April 2026; I check the resolution in the Diário da República). Start Campus's and EDP's own releases are company claims and attributed as such.
- **Press figures to check at source.** Sines potential IT capacity raised from 495 MW to 1.2 GW after REN's allocation, with the first building at 26 MW (DCD, Construction Digital). Over 2.6 GW "in development" nationally (a market summary). A "44-fold" rise to 1.5 GW (an interview with the Portugal DC association). Demand growth of 4.5% a year to 2035 (attributed to EDP's chief executive).
- **What the data can show.** The gap between capacity built, allocated and announced, and the size of the plans against today's national consumption.
- **What it cannot show.** How much of the capacity will run AI rather than other cloud work: no public source splits it, and the piece says so. Announced capacity is not built capacity. The investment totals are the companies' own figures.
- **Rough size.** 800 to 1,000 words. One chart: built, allocated and announced MW for Sines and nationally, each bar sourced.

**Considered and set aside for now: AI startup funding in Portugal.** Public totals disagree (€886M from TTR against €463M from another tracker for 2024), Dealroom's Portugal breakdown is behind its paywall, and no public source gives an AI share for Portugal. It may come back once the researcher's captures or Startup Portugal's 2025 report can be read at source.

- state: blocked (partly); done: key, prompts file, proposal (unchecked figures); next: move the proposal to the newsroom and check each figure at source once both blocks are lifted; then wait for a task file; run: first run.

**Question for Vicky (my recommendation first):** may this session reach the statistics hosts (ec.europa.eu, www.ine.pt, dados.gov.pt, www.pordata.pt, www.ren.pt, dre.pt, startupportugal.com), and may it attach the newsroom repository? I recommend yes to both. Without them I cannot check a single figure at its primary source or file my work in `desks/analyst-vicky/`. Hosts are added in the environment's settings (Network access, Allowed domains); the newsroom needs the add-repository permission allowed in this session.

## Sun 15 Nov 2026, 09:58 UTC (second session: key, figures checked at source)

- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts and notes; removed: nothing (a new session; its only tool is pki-agent.mjs).
- **Key:** a new session key (pinned copy of pki-agent.mjs, sha256 fcb28a1c… matches `admin/tools/seal.mjs`), record sha256:415487eeebe3bc44, encryption sha256:26498861d27f220c, public half in `data/keys.json` as `analyst-vicky-2`. The first session's `analyst-vicky` is marked superseded (09:55 UTC).
- **Proposal checked:** `people/vicky/proposals/analyst-2026-11-15.md`: three topics, every official figure checked at Eurostat or the Diário da República; the company figures held, DN's 0.8 points was the year before, the private surveys stay unchecked and out, the data-centre market figures are dropped, and topic 3 now rests on RCM 2/2026's own MW figures.
- **Still blocked: the newsroom.** Attaching PrompTugal/PrompTugal__News__Website was refused again (the auto-mode permission check denied the add-repository call). So the proposal is not yet in `desks/analyst-vicky/proposals/2026-11-15.md`, `analyst-vicky-promptugal` is not in the newsroom's `board/keys.json`, and I have not read the newsroom's CLAUDE.md or STYLE.md (needed before any draft, not for the proposal).
- state: blocked (partly); done: key, prompts file updated, proposal checked; next: copy the proposal and key to the newsroom once attached; then wait for a task file; run: first run (second session).

**Question for Vicky (my recommendation first):** may this session attach the newsroom repository? I recommend yes: allow the add-repository call for this session (or add the repository to the environment), and I copy the checked proposal and key there word for word.
