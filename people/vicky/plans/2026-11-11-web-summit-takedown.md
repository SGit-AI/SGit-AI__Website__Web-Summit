> **Vicky's decision, 11 Nov about 21:20 UTC (standing answer 47):** group A and S44, S47, S49 come down now; the unclear ones and group B stay; S58 becomes the front-page lead first; the derived data, company pages and agenda wait for Dinis's scope in the group.

# Plan: Web Summit-derived content off the live sites (for Vicky's yes)

At Vicky's word (11 Nov 2026, about 20:55 UTC, standing answer 45), relaying Dinis: "take all data scraped from Web Summit's site, and the articles built from it, off the live sites. Do not delete or change anything in GitHub or in any vault, they stay as they are. Only what is shown on promptugal.news and the team site comes down." **Nothing is taken down until Vicky says yes.** Inventory read-only at newsroom a5519dde and team site 41ab579f (11 Nov, about 21:00 UTC).

## Articles on promptugal.news (66 published)

### A. Built from machine-read Web Summit data: 13 (proposed: come down)

| Article | Desk |
|---|---|
| [health-startups-by-problem](https://promptugal.news/articles/health-startups-by-problem.html) (S30) | journalist-connections (Vicky) |
| [who-builds-the-parts-of-an-ai-agent](https://promptugal.news/articles/who-builds-the-parts-of-an-ai-agent.html) | journalist-ai (Vicky) |
| [rio-ten-startups-to-lisbon](https://promptugal.news/articles/rio-ten-startups-to-lisbon.html) | journalist (Dinis) |
| [press-conferences-day-by-day](https://promptugal.news/articles/press-conferences-day-by-day.html) (S35) | journalist (Vicky) |
| [plan-your-week-by-field](https://promptugal.news/articles/plan-your-week-by-field.html) | journalist (Dinis) |
| [following-robotics-at-web-summit](https://promptugal.news/articles/following-robotics-at-web-summit.html) | journalist-ai (Vicky) |
| [portugal-on-the-programme](https://promptugal.news/articles/portugal-on-the-programme.html) (S36) | journalist-portugal (Vicky) |
| [five-ai-builders-to-know](https://promptugal.news/articles/five-ai-builders-to-know.html) (S28) | journalist-connections (Vicky) |
| [breakout-startups-thursday-centre-stage](https://promptugal.news/articles/breakout-startups-thursday-centre-stage.html) (S54, the front-page lead) | journalist-connections (Vicky) |
| [europe-in-pavilion-4](https://promptugal.news/articles/europe-in-pavilion-4.html) | journalist-europe (Vicky) |
| [tuesday-10-november-three-ways-in](https://promptugal.news/articles/tuesday-10-november-three-ways-in.html) | journalist-connections (Vicky) |
| [brazil-on-the-stages](https://promptugal.news/articles/brazil-on-the-stages.html) | journalist (Dinis) |
| [teamworks-coaches-agent](https://promptugal.news/articles/teamworks-coaches-agent.html) | journalist-ai (Vicky); light: one listing page for context |

S58 ([thursday-last-day-guide](https://promptugal.news/articles/thursday-last-day-guide.html)) was flagged for citing /schedule/, but its Web Summit facts are Vicky's own browser read, with links only: proposed group B.

### Unclear: 8 (one Web Summit listing page for a minor fact; Vicky decides)

[manus-2-0-agents-own-email-phone-wallet](https://promptugal.news/articles/manus-2-0-agents-own-email-phone-wallet.html) (S48), [what-lovable-deleted](https://promptugal.news/articles/what-lovable-deleted.html) (S42), [glovo-restaurant-agents-getvocal](https://promptugal.news/articles/glovo-restaurant-agents-getvocal.html), [wpp-call-transcripts-to-jira](https://promptugal.news/articles/wpp-call-transcripts-to-jira.html), [gravitee-agent-security-survey](https://promptugal.news/articles/gravitee-agent-security-survey.html), [road-2-web-summit-2026](https://promptugal.news/articles/road-2-web-summit-2026.html) (Dinis's desk), [wednesday-11-november-going-abroad](https://promptugal.news/articles/wednesday-11-november-going-abroad.html) (Dinis's desk), [newsroom-status-four-days-out](https://promptugal.news/articles/newsroom-status-four-days-out.html) (Dinis's desk; about the newsroom).

### B. Only quoting Web Summit's statements, with a link: 11 (proposed: stay)

[web-summit-day-2-refunds](https://promptugal.news/articles/web-summit-day-2-refunds.html) (S45), [red-wind-warning-lisbon-wednesday](https://promptugal.news/articles/red-wind-warning-lisbon-wednesday.html) (S41), [ai-act-first-harmonised-standard](https://promptugal.news/articles/ai-act-first-harmonised-standard.html) (S50), [web-summit-2026-in-numbers](https://promptugal.news/articles/web-summit-2026-in-numbers.html) (borderline), [gender-in-tech-report-2026](https://promptugal.news/articles/gender-in-tech-report-2026.html), [ibm-sports-tech-challenge](https://promptugal.news/articles/ibm-sports-tech-challenge.html), [web-summit-passes-and-colours](https://promptugal.news/articles/web-summit-passes-and-colours.html) (Angelo's desk), [your-first-day-at-web-summit](https://promptugal.news/articles/your-first-day-at-web-summit.html), [driving-to-web-summit](https://promptugal.news/articles/driving-to-web-summit.html), [lisbon-universities-at-web-summit](https://promptugal.news/articles/lisbon-universities-at-web-summit.html), [thursday-last-day-guide](https://promptugal.news/articles/thursday-last-day-guide.html) (S58).

34 articles have no Web Summit source. Story pages S44, S47 and S49 (`/newsroom/stories/`) rest on Web Summit captures and have no article: proposed to come down with A.

## Derived data and the pages that show it

| Data | Live pages | Owner (told Dinis approved, after Vicky's yes) |
|---|---|---|
| `desks/programme/agenda.json` (225 items) and `data/events/` (219 Web Summit events) | /events/, /summit/, /summit/agenda.html, /days/, /my-day/, the home "Today at Web Summit" blocks | programme@PrompTugal.vicky; derive.mjs (ontologist@PrompTugal.dinis) |
| `data/people/` (285) | /people/ and each person page | ontologist@PrompTugal.dinis |
| `data/organisations/` (193 of 269 Web Summit-sourced) | /organisations/ and pages | ontologist@PrompTugal.dinis |
| `data/places/` (45 of 85) | /places/ and pages | ontologist@PrompTugal.dinis |
| `data/companies/` (118 of 120) and `desks/journalist-vicky/companies/` (101 About texts) | /companies/ and 120 company pages, the home company block | ontologist@PrompTugal.dinis; Vicky's journalist desk and reviewer |
| `data/evidence/` (31 Web Summit captures) | /newsroom/stories/ pages | curator@PrompTugal.vicky |
| The front page lead (S54) | / | correspondent@PrompTugal.dinis |
| Team site `data/companies.json` (108 of 110), `data/events.json` (80 sessions), `data/graph.json` | /companies/ and 110 pages, /summit/, the agenda chart, the command centres' summit blocks | Dinis's team (curator@web-summit, cartographer@web-summit) |

## How, so that no page breaks

Pages cannot just vanish: the gate fails on any broken link, and 21 clean articles link to company, organisation or event pages. Proposed:

1. **A withdrawn list**, one new file per site (newsroom `data/site/withdrawn.json`; team site an equivalent), naming the articles and entity types to withdraw.
2. **The build shows a short notice at the same address** ("Withdrawn on 11 November 2026.", nothing else; Vicky, 11 Nov about 21:20 UTC: Web Summit did not ask us; noindex), leaves it out of the articles index, front page, search, sitemap and llms.txt, and empties the home blocks fed by the agenda. Every link still resolves, so the gate stays green.
3. **Raw files** (the JSON under /data/ and /desks/, the API, the .md twins) are left out of the deploy with exclude lines in each site's deploy workflow.
4. **The front page** gets a new lead (correspondent@PrompTugal.dinis) before S54 comes down.

**What it touches in GitHub:** one new list file and build and workflow code on each site. No article, data file, desk file or vault is changed or deleted; everything stays in git history. Any change to a live site is itself a commit, so this is the smallest one.

**Who does it:** the build code belongs to dev@PrompTugal.dinis (newsroom) and Dinis's team (team site). Vicky's dev@PrompTugal.vicky can write it for the newsroom with their agreement (standing answer 10), told that Dinis approved it.
