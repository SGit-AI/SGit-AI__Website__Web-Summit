---
title: "How it works: people with agentic teams, agents with mandates"
summary: The operating model in plain terms. Each person runs a team of AI agents; each agent has a key, a written policy and a person it answers to; agents talk through commits; every change passes a gate and is released in the open; private things live in encrypted vaults and a person sends every message.
---
For the detail, with diagrams, see [the technology deck](../../investors/technology-deck/index.html).

## The model in six parts {#parts}

1. **A person, and their agents.** Each person on the team runs their own agents in their own sessions: a conductor that plans and runs the others, a dashboard that briefs them, and agents for their own work. Agents are named `<role>@web-summit.<person>`, so it is always clear whose agent did what ([the agents](../../agents/index.html)).
2. **A key for every agent.** Each agent makes its own cryptographic key in its session and publishes only the public half ([the keys](../../keys/index.html)). Messages and secrets are sealed to those keys. A key dies with its session; a new session makes a new one.
3. **A mandate for every agent.** Each agent has a published behaviour policy: what it can reach, what it was asked to do, the gap, and the barrier that holds it ([the policies](../../abp/index.html)). This is RiskMandate applied to ourselves.
4. **Commits are how agents talk.** Work, hand-overs and messages are commits in one public repository, with the agent's name, the issue and who it is for. Anyone can read the record.
5. **A gate before anything goes live.** Every change is built and checked automatically; a red check means no release. Continuous integration numbers each release ([why](https://newsroom.sgit.ai/articles/ci-owns-the-version.html)); the history is [public](../../admin/versions.html).
6. **People decide and send.** Agents draft; a person approves and sends every email, from their own address. Private things (contacts, emails, call notes) live only in the team's private, encrypted records ([the comms protocol](../../comms-protocol/index.html)). Twice a day the people meet to decide ([the stand-ups](../../meetings/index.html)).

## What it is built on {#stack}

- **Claude** as the reasoning engine, in scheduled sessions.
- **GitHub** for the code, the board and the record; static sites with a markdown twin of every page, so other agents can read them.
- **sgit** and **SG/Send** for encrypted vaults: zero-knowledge storage that the server cannot read ([sgit.ai](https://sgit.ai/)).
- **pki.sgit.ai** for the agents' identities.
- **RiskMandate's** model for the policies ([riskmandate.ai](https://riskmandate.ai/)).

All of our own code is open source (Apache-2.0); the text and data are CC BY 4.0 ([why](../../investors/open-source/index.html)).

## What a customer gets {#customer}

The same model, for them: a team of agents in their own accounts and repositories, with their own keys and policies, a conductor that briefs them, and a person on our side who sets it up, checks it and changes it as they ask. They can see it running before they pay, and keep it if they leave. The first is being made for one person, our first friendly ([Daniela's brief](../../brief-daniela/index.html)).

## What is not finished {#gaps}

Honest gaps, as the site's own record keeps them ([REALITY.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/REALITY.md)): several pieces run only partly (for example, a customer cannot yet create a vault on the live site without a key issued by hand), and the personal schedule for each attendee is designed but not built. PrompTugal.news's own inventory of its technology found that, of 32 pieces, about half run and half partly run ([the monetisation map](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/customers/monetisation-map.md)).
