---
title: "We are the power users: the team app runs our own summit first"
summary: Dinis's voice brief of 9 November 2026. We dogfood our own apps. The team app (private) and the two RiskMandate apps are where we experiment without limit, starting with the problem we have today, a team of six at the summit that does not know where everybody is, which sessions we go to, or how to coordinate. Where is everybody, a team as a person plus a conductor plus agents, feature toggles and live variants, votes and decisions as core primitives, and everyone asking for features.
---
At Dinis's word (9 November 2026, about 11:10 UTC, a voice brief to the main conductor), kept by conductor@web-summit.dinis (WS-201). It follows the three apps' line ([/apps/](../apps/index.html), WS-199).

**Names, from now on.** "The team app" means the private PrompTugal Team app. "The news app" means the public one on the App Store.

## Why: we have the problem, so we build the answer {#why}

*"We already have a problem of management ... we are going to the summit. We don't know which sessions we're going to go. We don't know where everybody is ... how to coordinate our actions. We are a team of 6. Imagine teams of 10, 20, 50, 100 ... if we make it work for ourselves, it will work for others, and that's kind of what we're going to sell."*

We are the power users. Everything that makes the team's own life easier, helps it collaborate better, or makes it coordinate faster is fair game. Think creatively.

## Where: the three apps that are not in the App Store {#where}

The **iOS team app**, the **iOS RiskMandate app** and the **Android RiskMandate app**: *"we can basically experiment as much as possible."* The news app stays light (WS-199). What proves itself here may reach the news app later.

## The first feature: where is everybody {#where-is-everybody}

*"A feature, which I think is ridiculously powerful ... where is everybody."* We have change control, location, vaults and mobile devices. Together they give us an app *"kind of like WhatsApp or Snapchat"* (Snapchat has a map of friends) to coordinate:

- **A live, collaborative map** of the team: who is where, now.
- **Back in time and forward:** where each person has been, and where they are going next (the sessions they plan to attend).
- **Who is seeing what, who is going where:** *"those are not minor things. Those are major functionalities."*
- **Visualisations:** animations, infographics and maps of who's who and what's going on.

**Start from what exists.** WS-181 (Angelo, approved 7 November) already has the design. Eight zones; an exact pin only by a person's own choice, and nothing shared by default. A summit-only private vault, deleted by 14 November. security@web-summit.dinis reviews before any real location is stored. A demo with no real data comes first. The specs are in `people/angelo/proposals/WS-181/`; dev.venues@ is building it. The team app adds the phones' location, the vault sync and the history.

## The model: a team is a person, a conductor and agents {#team}

*"What's a team? A team is basically a conductor, a human plus a conductor plus a bunch of agents."*

- **Each team has its own lane.** Any agent may push to its team's lane.
- **Each person gets their own customised version of the app.** Think in **feature toggles** and **change management**. Many versions can be live at the same time, some wired on and some off. Then comes *"a Darwinian evolution"*: what people use and vote for survives.
- **Make a decision, coordinate, map it out:** *"those are fundamental core primitives for what we're doing."* Decisions, votes and management live in the app too.
- **Show it:** visualise how everything connects, teams, agents and work.

## What it asks of everyone {#ask}

*"Everybody in a team should be asking for features ... everybody from the team needs to experience the power that I have here: the ability to just come up with an idea, come up with a flow, and then have that executed by the team."*

- **Every person:** be critical and attend to the details, ask your conductor for features, and ask our agents to run things for you.
- **Every conductor and agent** on the team app, the RiskMandate apps (iOS and Android) and the team site: experiment, and propose. Open or pick issues under WS-201.
- **The question behind all of it:** *"what is the best way to coordinate ... to work together ... to have a distributed team collaborating in this kind of dynamic environment, making decisions and sharing and making sure that everybody knows where everybody is."*

## First features to build (proposed by the conductor; owners pick) {#first}

1. **Where is everybody, live** (WS-181 into the team app): the zones, opt-in, and the vault.
2. **My summit plan:** each person's sessions for the four days, shown on the same map, so "where are they going" has data.
3. **Make a decision:** a question, its options, votes, the result, all recorded (the decision pages, in the app).
4. **Feature toggles per person:** a variant switch in the team app, with a simple record of who has what on.
5. **The team at a glance:** each person, their conductor and agents, and what each did today (the live graph and the "Team and the machine" view, in the app).
