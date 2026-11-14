# Local sites for PrompTugal.news: a plan for Dinis

Prepared by Vicky's conductor at Vicky's word, 14 November 2026, from Dinis's direction to the team that day: PrompTugal becomes "Portugal Prompt news", with a national and a local level; promptugal.news stays the national site, and local sites are added by zone, for example loule.promptugal.news, and others such as Quarteira, Faro and Silves. **Nothing has been built or changed.** Dinis chooses an option, or suggests changes.

**Dinis has answered (14 November 2026):** option A, with every place its own site, starting at promptugal.news/algarve/ and its towns (subdomains later). Read [his answer](../../../articles/promptugal-by-place.html) and [his brief, PrompTugal.news by place](../../dinis/local-sites/index.html).

## The idea in one paragraph

One set of agents covers every town. Each local story is tagged with its region and town, and each local site shows the stories with its tag. A story can appear on the national site and on its town's site at the same time. No agent per town.

## How it uses the agents we already have

- **The researcher** follows a list of local sources for each zone and tags each capture with its region and town.
- **The curator** commissions local stories like any other and sets their region and town.
- **journalist-portugal** writes them: Portugal is already its beat. Stories about AI at work or startups keep their usual desk and simply carry the town tag too.
- **The analyst** (Vicky's new analysis desk, from 17 November) can read regional data, for example by municipality, and tag its pieces by region.
- **The designer and the reviewer** work as now.

## Categories: region and town tags under Portugal

No new main category. A local story keeps the main category **Portugal** and gets two new fields, **region** (for example Algarve) and **town** (for example Loulé), which drive the local pages. A main category such as "Algarve" or "Local" can come later if local coverage grows large; on Vicky's desks a new main category needs her approval.

## Where to start: Loulé

Loulé first, as in Dinis's example; then Quarteira (in the municipality of Loulé), Faro and Silves.

- **A candidate first story:** Best Number One, the platform from the Loulé agency 3WX, which the regional press reported as launched at Web Summit 2026 (the newsroom's story S65, being written now).
- **Local sources the researcher would follow:** each town's own municipal site and news pages; the regional press, such as Postal do Algarve, A Voz do Algarve, Sul Informação and Barlavento; regional public bodies such as CCDR Algarve and the Universidade do Algarve; and companies' and organisers' own pages. The team's existing source rules still apply.

## Three options

- **A. Tags first, local pages on promptugal.news, subdomains later** (recommended). The local pages start at addresses such as `promptugal.news/loule/` and move to `loule.promptugal.news` when the subdomains exist, without redoing anything. *Needs from Dinis:* yes to the plan and to the build change; the subdomains can follow when he is ready.
- **B. Subdomain sites from the start.** The same tagging, live at `loule.promptugal.news` from the first day. *Needs from Dinis:* the domain and hosting set up first (see below), then the build change.
- **C. A or B, plus a dedicated local desk** (for example a journalist for the Algarve). Only worth it once local stories outgrow journalist-portugal. *Needs from Dinis:* as A or B; the new desk would be Vicky's.

## What needs Dinis

- **The domain and subdomains.** promptugal.news is served by GitHub Pages, which serves one domain per site. So each `<town>.promptugal.news` needs either its own small site, or something in front of the domain that sends each subdomain to its town's pages. That is a choice about his domain and hosting.
- **The brand and the name.** "Portugal Prompt news" changes the brand v2.0, which is his and his designer's. Nothing is renamed until he decides.
- **The list of zones**, and which towns come first.
- **The newsroom build**, owned by dev@PrompTugal.dinis: the region and town fields, a page per town and region with its own list, feed and search, and a "Local" choice in the menu. Vicky's dev@PrompTugal.vicky could do it if Dinis prefers, telling his agents in its commits.

## How to answer

Choose A, B or C, or suggest changes: in a commit `For: conductor@web-summit.vicky`, on the request file `people/vicky/requests/2026-11-14-local-sites-plan.md`, or to Vicky directly.
