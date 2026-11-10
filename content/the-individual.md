---
title: "The individual: from a photo to a unit"
summary: "Dinis's next altitude (10 November 2026). Take a photo of a person's badge, and a sequence starts: the person goes into the private CRM, public research runs, a unit of agents starts for them, and every step lands on a Kanban board in the Team app. The unit's work is visible: how many agents, who did what, and when."
---
At Dinis's word (10 November 2026, about 12:30 UTC, a voice brief after a meeting the night before), WS-210. Last night two people from one company told Dinis they were interested in RiskMandate. Most of the team is already talking to many people like them. The bigger altitude is done (GAMMA-Ray, pt.news, the apps; what Silvio and Andrew have been doing). **Now the individual is the key piece of the puzzle**, and this page maps the pipeline that starts from one photo.

> Dinis: "I need to be able to take a photo of a person, and that needs to trigger a sequence of events that will create research on the person that will start a new agentic team for that ... we need to visualize all the work that was done in the unit ... how many agents and what everybody did."

## The pipeline {#pipeline}

| # | Stage | What happens | Where it lives | Who |
|---|---|---|---|---|
| 1 | **Capture** | A team member photographs the badge (name, company, ticket type) or a business card, and adds a 30-second voice memo: where they met, what interested the person, which yes was given (the [six steps](../lead-to-article/index.html#steps)). | The Team app's camera, sent sealed to the private CRM | The person who met them |
| 2 | **File** | The photo is read on the device: name, company and badge type. A contact record is created in the private CRM, linked to the company's record (or a new one), with the photo and memo beside it. | `contacts/<id>/` in ws-team-crm-private | The member's conductor |
| 3 | **Research** | Public and professional only: the company's own site, its product, its funding and news, the person's public professional role. No contact details are collected, and nothing is taken from behind a login. Every fact carries its source and the date read. | The contact's folder, private | A researcher sub-agent |
| 4 | **Start the unit** | A unit is opened for this person: a card on the board and a small agentic team. It has a conductor for the unit and the agents it needs (research, a GAMMA-Ray scan of the company, a RiskMandate demo prepared on their own agents, a follow-up draft, an article draft if they said yes). | A unit folder in the private CRM, and a card on the board | The member's conductor starts it |
| 5 | **Work** | The agents do their pieces. Each commit names its unit (a new `Unit:` trailer, beside `Agent:`, `Issue:` and `Brief:`). | The vaults and repositories, as now | The unit's agents |
| 6 | **Follow up** | A person sends the follow-up. Agents only draft. A hot lead goes to Nimay or Dinis within a day (WS-29). | The CRM's thread for that person | The person who met them |
| 7 | **Public, if agreed** | Only with their yes: an interview or article on pt.news through the interview pipeline, and the company's GAMMA-Ray card with its claim note. | pt.news, gamma-ray.sgit.ai | The newsroom, gamma.studio@ |

## The board {#board}

One Kanban board in the Team app (private), with one card per person, across these columns:

**Captured → Filed → Researched → Unit running → Follow-up drafted → Followed up → Meeting / demo → Public (if agreed) → Closed**

- Each card shows the person, their company, who met them, and the next step with its owner.
- A card is moved by its stage's evidence (a record, a research note, a sent follow-up), never by hand alone.
- Filters: by team member, by company, by stage, by GAMMA-Ray stage of the company.

## The unit, made visible {#unit}

This is the case study. For each unit, the Team app shows:

- **how many agents** worked on it, and which;
- **what each did**: the commits, records, drafts and pages, in time order;
- **the time** from photo to follow-up, and from photo to meeting;
- **the cost**, from accountant@'s ledger, per unit.

It uses the same trace as [/pipeline/](../pipeline/index.html) (WS-205): read the trailers across the repositories and vaults, group by `Unit:`, and draw the graph. dev@web-summit.angelo's live graph (WS-97) is the engine.

## What stays private {#privacy}

- **The photo, the name and everything about the person stay in the private CRM.** No person's name, photo or details go into a repository, a public page or this page. The [comms protocol](../comms-protocol/index.html) applies.
- Research is public and professional only, with sources. No contact details are collected unless the person gives them.
- A badge photo is for the CRM. It is never published. A person's photo on pt.news needs their own yes.
- Public output (an article, a card) only with their yes. Their company's public facts can appear in the company's own pages as now.

## What exists and what to build {#build}

| Piece | Today | To build | Owner (proposed) |
|---|---|---|---|
| Private CRM, contacts and companies | Yes (ws-team-crm-private) | A `units/` folder and a unit schema | conductor@web-summit.dinis |
| Capture | By hand: a photo sent to a conductor (the first two leads were filed this way, 10 November) | A camera button in the Team app: photo, memo, sealed send | Indi's team |
| Reading the badge | By the conductor | On the device (Apple Vision / ML Kit), with the person confirming | iOS and Android teams |
| Research | Researcher agents exist (pt.news) | A per-contact research step, public only, sourced | researcher@ with the member's conductor |
| The unit's agents | Sub-agents run inside a conductor's session | A unit template: who starts, which agents, a budget | conductor@web-summit.dinis with accountant@ |
| The board | No | The Kanban view in the Team app | Indi's team |
| The unit made visible | /pipeline/ by hand; the live graph | Group by `Unit:`; per-unit view and cost | dev@web-summit.angelo, accountant@ |

## The first case {#first}

The two people Dinis met on the evening of 9 November (one company, ALPHA badges) are filed in the private CRM. Their stage is **Captured**, and research is next. They are the first unit to run end to end.

Next: interview Silvio and Andrew about how they worked at the bigger altitude, for the case study.
