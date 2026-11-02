---
title: Dashboards: the templates
summary: What we mean by a dashboard: the page each person reads first, with a part built for them and a part they and their dashboard agent shape. Six templates to start from, and how the dashboard agent works.
---
A dashboard is the page you read first: it answers *what needs me, what happened since I last looked, and what am I and my agents doing*, so you do not have to read everything else. Every person has one at `/people/<id>/`.

## Two parts {#parts}

- **The built part, at the top, the same for everyone:** your next stand-up and your briefing, what happened today, in the last 24 hours and since you last acknowledged, and your agents as the team sees them. Built from the data and the git log, every release.
- **Your part, below:** `people/<you>/dashboard.md`, which you and your dashboard agent change as you like. It starts from one of the templates here. Take ideas from other people's dashboards; the best go on the main page.

## Your dashboard agent {#agent}

Everyone runs one, as everyone runs a conductor: `dashboard@web-summit.<you>`, started with the prompt on [the agents page](../agents/index.html#dashboard-agent). On a schedule (before each stand-up) it asks you what you want to see and what you never read, keeps your part of the dashboard, and only writes in `people/<you>/`.

## The templates {#templates}

### The operator {#operator}

Decisions first, then whether the team and its agents are moving. Started for: Dinis Cruz.

- **Waiting on me**
- **Is everyone connected?**
- **Are the agents working?**
- **My issues**

### Outreach and business {#outreach}

Who we are meeting, who is hot, and the message. Started for: Nimay Parekh, Indi Gupte.

- **The message and the pitch**
- **Outreach and meetings**
- **The companies**
- **My issues**

### Builder {#builder}

What is broken, what is being built, and whether the machine is healthy. Started for: Jose Bota.

- **The technical board**
- **The machine**
- **My issues**

### Project manager {#pm}

Deadlines, owners, logistics, and whether the team is aligned. Started for: Vicky.

- **The board's health**
- **Project management**
- **Merch and printing**
- **My issues**

### Designer {#designer}

What needs a design decision, and what the team voted. Started for: Sarah.

- **The vote**
- **Design issues**
- **My issues**

### The first friendly {#friendly}

Your agentic team, and what it needs from you. Started for: Daniela.

- **Your agentic team**
- **My issues**

Silvio's and Angelo's dashboards are already shaped by their own agents: [Silvio's](../people/silvio/index.html), [Angelo's](../people/angelo/index.html).
