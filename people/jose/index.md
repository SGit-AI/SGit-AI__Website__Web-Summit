# Jose's dashboard

The page Jose Bota sees first: their issues, their onboarding, their pulse, and whatever else they choose. Theirs to change, with their agents.

Site version: v0.1.29

This page is Jose's, kept by Jose and Jose's agents in `people/jose/dashboard.md`. It starts the same as everyone's: change it to show what you want to see when you wake up, take ideas from the others, and the best of them go on the main page.

## Today {#today}

- **My focus:** Make the team's machinery run: automation, messaging channels, and the technical work Jose and Angelo share.
- **My brief:** [Brief for Jose](../../brief-jose/index.html)
- **The board:** [all issues](../../briefs/index.html#issues) · **The team's pulse:** [pulse](../../pulse/index.html) · **What happened:** [home](../../index.html)

## My issues {#issues}

| Issue | What, and what done looks like | For | Due | Status |
|---|---|---|---|---|
| **WS-01** | **Get to L1: a dedicated Claude account for this work.** A Claude account (or a dedicated project in yours) used only for Web Summit, with a first session that has read [the start page](../../start/index.html) and your brief. Tick claude in your onboarding file. | everyone | Tue 3 Nov | open |
| **WS-02** | **Get to L2: GitHub, push access to this repository, and an email you can send from.** Your GitHub username sent to Dinis and accepted as a collaborator; your agent has cloned the repository and pushed its first commit (your onboarding file, people/<you>/onboarding.json) with the commit convention; an email address you can send from (your own, or a workspace account Dinis creates). | everyone | Tue 3 Nov | open |
| **WS-03** | **Get to L3: a PKI key registered on pki.sgit.ai, and access to the team's vaults.** You registered on [pki.sgit.ai](https://pki.sgit.ai/people/how.html) (a passkey, a key pair made in the browser, your GitHub as evidence), Dinis has verified you as the anchor, and your public bundle is in people/<you>/key.json. The vault keys come to you sealed to that key. | everyone | Wed 4 Nov | open |
| **WS-04** | **Get to L4: a Claude session on a schedule.** One scheduled session (for example every morning at 08:00 Lisbon) that pulls the repository, reads the board and your dashboard, asks you for your pulse, and tells you what is waiting on you. | everyone | Wed 4 Nov | open |
| **WS-05** | **Get to L5 and L6: several agents, then several scheduled sessions.** Your agents named by the convention (`<agent>@web-summit.<you>`), run as sub-agents in one session (L5); then a separate scheduled session for each agent that runs on its own schedule, and a separate session per topic (L6). | everyone | Thu 5 Nov | open |
| **WS-06** | **Make your dashboard yours.** people/<you>/dashboard.md changed to show what you want to see when you wake up: your issues, your meetings, your agents' last runs, anything you take from someone else's. Others will copy the best ideas into the main page. | everyone | Wed 4 Nov | open |
| **WS-07** | **Pulse check-in, three times a day.** Morning, midday and evening: your agent interviews you for two minutes (or you type) and commits people/<you>/pulse/<date>-<slot>.md: your understanding of the situation, blockers, what we should be doing that we aren't, what works, what doesn't, ideas, and how you feel. Public, on [the pulse page](../../pulse/index.html). | everyone | daily from Tue 3 Nov | open |
| **WS-08** | **Fill in your card.** Answers to the questions at the end of your brief, committed to people/<you>/card.md or sent to Dinis. | everyone | Tue 3 Nov | open |
| **WS-18** | **The demos we run at the summit.** Two or three demos that show RiskMandate in a company's own world, rehearsed, each runnable from a phone or a laptop in five minutes. | [Nimay Parekh](../../brief-nimay/index.html), [Dinis Cruz](../../brief-dinis/index.html), [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Wed 4 Nov | open |
| **WS-19** | **The card-to-analysis loop, tried on three companies.** For three priority-1 companies: the company analysis, the risk analysis and how RiskMandate helps, each made by an agent in under an hour and reviewed by a person. This is what happens to every card at the summit. | [Nimay Parekh](../../brief-nimay/index.html), [Indi Gupte](../../brief-indi/index.html), anyone | Wed 4 Nov | open |
| **WS-26** | **The big outreach: 50 targets for Thursday and Friday.** Fifty companies and people at the summit, sourced, each with an owner and a drafted message, ready to send on Thu 5 and Fri 6. | [Silvio Switha](../../brief-silvio/index.html), [Indi Gupte](../../brief-indi/index.html), anyone | Thu 5 Nov | open |
| **WS-27** | **The factory: a page or vault per target company.** For each target: its analysis, its risk analysis, how RiskMandate helps, published so the message can link to it. A pipeline where anyone can pick up the next company. *Agents:* factory@web-summit.indi makes them; a person reviews each. | [Indi Gupte](../../brief-indi/index.html), anyone | from Thu 5 Nov | open |
| **WS-30** | **Owners for the 20 priority-1 companies.** Each priority-1 company on the [map](../../companies/index.html) has one owner among the seven. | everyone | Tue 3 Nov | open |
| **WS-32** | **The sessions each person attends.** 3 to 6 sessions each from the [summit page](../../summit/index.html), with the speakers worth meeting. | everyone | Sat 7 Nov | open |
| **WS-33** | **Make the repository safe for everyone to commit to all the time.** Everyone's agents push many times a day without colliding: the release script (admin/tools/release.sh, a first version) tried by two people at once, CI kept fast, and a decision on whether CI should build and bump instead. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Tue 3 Nov | open |
| **WS-34** | **Behaviour policies for every agent and every person.** A behaviour policy for each agent on the team (what it may read, write and never do) and for each person, made by interviewing them with their agent; the gate checks them. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Wed 4 Nov | open |
| **WS-35** | **Help each person through setup (L1 to L4).** Everyone at L4 by Wednesday evening; what went wrong written down for the next person. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Tue 3 to Wed 4 Nov | open |
| **WS-36** | **A conductor of conductors.** How the agents in everyone's accounts coordinate: who opens what, how they talk (commit trailers), how a stuck agent is noticed. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html), [Dinis Cruz](../../brief-dinis/index.html) | Thu 5 Nov | open |
| **WS-37** | **Observability lanes on the site.** Who visits, what they read, where they came from, shown as a page we can all read. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Thu 5 Nov | open |
| **WS-38** | **Encrypted materials on the site, readable only by named team members.** A file published on the site that only the named people's PKI keys can open (for example the week's vault access keys), and the steps to do it again. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Thu 5 Nov | open |
| **WS-39** | **A WhatsApp number in the team group, and the RiskMandate Slack.** A number that broadcasts updates to the team's WhatsApp group (Jose's n8n flow), and/or a channel in the RiskMandate Slack, carrying the journalist's reports. | [Jose Bota](../../brief-jose/index.html) | Wed 4 Nov | open |
| **WS-40** | **Hosting for Silvio's videos.** Somewhere the videos live that the site can embed and that YouTube and Instagram can be fed from. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html), [Silvio Switha](../../brief-silvio/index.html) | Wed 4 Nov | open |
| **WS-41** | **The pulse app.** Better than files: the agent interview prompt, a reminder at each slot, and a view of the team's pulse over time. (The files version works now.) | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html), [Vicky](../../brief-vicky/index.html) | Wed 4 Nov | open |
| **WS-42** | **Billing on our sites, like newsroom.sgit.ai.** The same billing element as newsroom.sgit.ai on this site and on every site we make for others. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Thu 5 Nov | open |
| **WS-43** | **An agent wellness questionnaire.** The pulse, for the agents: what they understand, what blocks them, what they would change. After the humans are in line. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Fri 6 Nov | open |
| **WS-44** | **Secure harness policies (an experiment, not a priority).** A first secure harness policy tried on one agent. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | later | open |
| **WS-45** | **Keys page from everyone's key files.** /keys/ lists every people/<id>/key.json, so the team's public keys are in one place. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Wed 4 Nov | open |
| **WS-51** | **Technical articles: what we did and how.** Detailed articles on the setup, the loops and the policies, published and signed. | anyone, [Angelo](../../brief-angelo/index.html) | from Wed 4 Nov | open |
| **WS-55** | **Everyone's shirt and hoodie: size, colour, message.** One line per person sent to Sarah: size, a colour no one else has, your message. | everyone | Mon 2 Nov | open |
| **WS-61** | **Try the voice memo to follow-up loop once.** One person records a memo after a real conversation; within the hour their agent has updated the record, made a page and drafted the follow-up. | anyone | Sat 7 Nov | open |
| **WS-62** | **Vote on the design.** Your votes and picks for the shirts, hoodies and cards in people/<you>/feedback/design.json ([the design page](../../design/index.html#vote) says how), with what you would change. *Agents:* Your agent shows you the options and commits your answers. | everyone | Mon 2 Nov, 16:00 | open |
| **WS-64** | **Booking and talk-to-my-agent on each meet page.** Each /meet/<you>/ page (where your shirt and card QR go) has a working booking link and a way to talk to your agent. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html), everyone | Thu 5 Nov | open |
| **WS-65** | **Stop rewriting ~160 pages on every release.** A release changes only the files it is about: content in JSON and markdown, rendered dynamically or built by CI, every gate check kept, CI faster. Before and after numbers in admin/metrics.json. *Agents:* dev@web-summit.dinis (then dev@web-summit.angelo) does a refactoring pass every wake. | [Angelo](../../brief-angelo/index.html), [Jose Bota](../../brief-jose/index.html) | Wed 4 Nov | open |

## My onboarding {#onboarding}

| Person | Level | Claude | GitHub | Can push | Email | PKI key | Vaults | Scheduled | Several sessions | Updated |
|---|---|---|---|---|---|---|---|---|---|---|
| [Jose Bota](../../people/jose/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |

## My pulse {#pulse}

No check-ins yet.
