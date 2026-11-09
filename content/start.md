---
title: Start here
summary: The one page for the Web Summit 2026 team. Find your name, open your brief, paste your prompt into your own Claude, and get connected (Claude, GitHub, email, a PKI key, a schedule). Then how we work, the pulse, and the dates. Everyone champions RiskMandate.
---
**Today, Monday: vote on the shirts, hoodies and cards on [the design page](../design/index.html#vote).**

**Team: start here.** Find your name, open your brief, and paste the prompt from it into your own Claude. Your agent then takes you through getting connected, one step at a time. Everything here is public, on purpose: how we work is part of what we show.

## Find your name {#people}

| Who | Focus | Brief | Dashboard | Prompt |
|---|---|---|---|---|
| **Dinis Cruz** | Operator: RiskMandate, the strategy, the senior meetings | [your brief](../brief-dinis/index.html) | [your dashboard](../people/dinis/index.html) | [your prompt](../brief-dinis/index.html#prompt) |
| **Nimay Parekh** | Business, positioning, outreach and investors | [your brief](../brief-nimay/index.html) | [your dashboard](../people/nimay/index.html) | [your prompt](../brief-nimay/index.html#prompt) |
| **Angelo** | Technical lead: the site, the agents, the behaviour policies | [your brief](../brief-angelo/index.html) | [your dashboard](../people/angelo/index.html) | [your prompt](../brief-angelo/index.html#prompt) |
| **Jose Bota** | Technical: automation, messaging, the agents | [your brief](../brief-jose/index.html) | [your dashboard](../people/jose/index.html) | [your prompt](../brief-jose/index.html#prompt) |
| **Vicky Wang** | Project manager: the structure, the deadlines, the logistics | [your brief](../brief-vicky/index.html) | [your dashboard](../people/vicky/index.html) | [your prompt](../brief-vicky/index.html#prompt) |
| **Silvio Switha** | Ideas, outreach, local, and video | [your brief](../brief-silvio/index.html) | [your dashboard](../people/silvio/index.html) | [your prompt](../brief-silvio/index.html#prompt) |
| **Indi Gupte** | The message, outreach, and the factory of examples | [your brief](../brief-indi/index.html) | [your dashboard](../people/indi/index.html) | [your prompt](../brief-indi/index.html#prompt) |
| **Sarah** | Designer: the shirts, hoodies, cards and flyer | [your brief](../brief-sarah/index.html) | [your dashboard](../people/sarah/index.html) | [your prompt](../brief-sarah/index.html#prompt) |
| **Daniela** | The first friendly: an agentic team for Daniela's teaching | [your brief](../brief-daniela/index.html) | [your dashboard](../people/daniela/index.html) | [your prompt](../brief-daniela/index.html#prompt) |

## What we are doing {#what}

- **We are all RiskMandate.** Everyone champions it: the message, the examples, the demos, the meetings. Other things will happen through it, but this is the focus.
- **Now to Wednesday (2 to 4 Nov): set up the team.** Everyone connected, the workflow and the loops in place, lots of brainstorming, everyone aligned, and the agents running on their own schedules.
- **Thursday (5 Nov): the targets.** Who we should be talking to, then the big outreach on Thursday and Friday.
- **By Saturday (7 Nov): the plan.** Who we meet, who is booked, who is excited to meet us, who can connect the dots, and a detailed schedule for each of us.
- **10 to 12 Nov: the summit.** Our stand day is Thursday 12.

## Get connected: the workflow {#levels}

The first priority for everyone, in this order. Where you are is on [the setup leaderboard](../team/setup/index.html), worked out from what you have done: the steps you do by hand go in `people/<you>/onboarding.json` (your agent writes it), and the rest the site sees for itself.

| Level | What it means |
|---|---|
| **L1** | You are logged in to your RiskMandate Workspace email, and to the Claude team account with that email. |
| **L2** | You have a GitHub account and can push to [this repository](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit). |
| **L3** | Your **conductor agent** is running and has committed. |
| **L4** | Your **dashboard agent** is running, and your agents have published their keys. |
| **L5** | Your agents run on a schedule. |
| **L6** | You can open the team's vaults: fully wired. |

```onboarding all
```

### The steps, for you and your agent {#steps}

Not technical? Read [the plain-language guide](../onboarding-guide/index.html) alongside these steps. Stuck? [The help page](../help/index.html) answers the setup questions the team has asked most.

1. **Workspace email (L1).** Log in to the RiskMandate Google Workspace account Dinis made for you. Its agent alias is where invitations and your agents' mail arrive. This is how the stand-up invites reach you.
2. **Claude (L1).** Log in to the Claude team account with that same email. Open a new session for each agent you start.
3. **GitHub (L2).** Create a GitHub account with your Workspace email, send Dinis the username, and accept the invitation to `SGit-AI/SGit-AI__Website__Web-Summit`. Your agents push with it.
4. **Your conductor agent (L3).** In a new Claude session, paste the prompt from your brief. It is `conductor@web-summit.<you>`: it runs your other agents, keeps `people/<you>/` (your onboarding, `agents.json`, your dashboard's own part), and its first commit puts you at L3.
5. **Your dashboard agent (L4).** In another session, start `dashboard@web-summit.<you>` with the prompt on [the agents page](../agents/index.html#dashboard-agent). It keeps your dashboard, the page you read first, from [the templates](../dashboards/index.html), and asks you what you want on it.
6. **Agent keys (L4).** Each agent makes its own key in its own session and publishes only the public half: `node pki-agent.mjs keygen --session` ([the tool](https://pki.sgit.ai/agents/pki-agent.mjs)), then an entry for it on the keys page (`data/keys.json`), committed by that agent. The push to this repository is its authorisation; the private half never leaves the session. No browser and no website registration needed.
7. **A schedule (L5).** Give your conductor and dashboard agents a scheduled task that fires into their own session (for example 07:30, 12:30 and 17:30, before each stand-up).
8. **The vaults (L6).** Start your **vault agent** (`vault@web-summit.<you>`). It gets an SG/Send access token of its own: one per agent, issued by Dinis and sealed to the agent's key, never your token, never in chat. Then it can make and publish your own vaults: [your vault agent, step by step](../vault-agent/index.html). Angelo, Jose and Silvio are done. Team vault keys are sealed to your agents' keys and arrive as a QR code or over the conductor's inbox lane. The private vault holds what cannot be public (meetings, contacts).

## How we work {#how}

- **After you talk to a lead at the summit:** [from a conversation to an article](../lead-to-article/index.html), six steps: ask for a yes, record a 30-second memo, your agent drafts the private follow-up that evening, and an article only if they agreed.
- **The website is the centre**, for the humans and for the agents. Every page has a markdown twin (`index.md`) for agents, and [llms.txt](../llms.txt) lists them all.
- **Never push to `main`** (you, or any of your agents): only `dev`. A major release is a pull request to `main` that Dinis merges.
- **One repository, everyone commits.** Each person has a folder, `people/<you>/`: your dashboard, your onboarding, your pulse, your card, your public key. The board is `board/`, one file per issue.
- **Names:** `<agent>@web-summit.<person>`, for example `pm@web-summit.vicky`. The conductor that keeps this site is `conductor@web-summit.dinis`.
- **Commits are how agents talk to each other.** Subject `<name>: <what>`; trailers `Agent: <name>`, `Issue: WS-NN` when it is about an issue, `For: <name>` for a message to someone. Read what is for you with `git log --grep "For: .*web-summit.<you>"`.
- **Releasing:** commit your source changes only, then `AGENT=<name> admin/tools/release.sh "<one sentence>"`. It rebases, runs the gate, pushes (retrying if someone pushed first) and waits for the live site. **CI owns the version** ([why](https://newsroom.sgit.ai/articles/ci-owns-the-version.html)): never write a number, `version.txt` or `versions.json`; CI numbers each release `site vX.Y.Z: <your subject>`, tags it and deploys it.
- **Issues:** [the board](../briefs/index.html#issues). Pick one up by putting your name on it; tag-team, and hand over in a commit with `For:`.
- **Your dashboard is yours.** Make it the page you want to see when you wake up. We copy the best ideas into the main page.
- **Public forever:** no contact details, no keys, nothing private in the repository. Private things go in the private vault.
- **The team's agents** (conductor, journalist, pulse, security, designer, dev) run on a schedule in Dinis's account: [the agents and their prompts](../agents/index.html).
- **The videos:** watch and comment on Silvio's RiskMandate videos: [the videos](../videos/index.html#feedback).
- **Today (Monday): the design.** Vote on the shirts, hoodies and cards: [the design sprint](../design/index.html#vote).

## The stand-ups {#standups}

Two a day, **12:00 and 18:00** (Lisbon = UTC; the midday one moved from 13:00 on 5 November, by the team's vote): for deciding, not for reporting. Before each one, read **your briefing**: it is on your dashboard and on [the stand-ups page](../meetings/index.html): the decisions and questions for you, your issues due, and what happened since you last looked.

- **Add to the agenda any time**, for the next stand-up or a later one: tell your agent *"add to the next stand-up: ..."* (a decision, a question, an idea or a quick sync).
- **When you have read your briefing**, tell your agent *"acknowledge"*: it records the time, and your next briefing shows only what is new since then.
- **Your dashboard has two parts**: the top is built for you (the next stand-up, since you last looked); below it is yours, which you and your agents change as you like.

## The pulse {#pulse}

Three times a day (morning, midday, evening), your agent interviews you for two minutes, or you type, and commits `people/<you>/pulse/<YYYY-MM-DD>-<morning|midday|evening>.md`. Public, on [the pulse page](../pulse/index.html). The questions:

1. What is your understanding of where we are?
2. What is blocking you?
3. What should we be doing that we aren't?
4. What's working, and what isn't?
5. Any good ideas?
6. How are you feeling, in general?

The pulse agent reads them all and flags anything early. Later we do the same for the agents.

## For your agent {#prompt}

If you don't have your brief to hand, this works for anyone. Replace `<you>` with your id from the table (dinis, nimay, angelo, jose, vicky, silvio, indi, sarah, daniela):

```
You work for <you> on the Web Summit 2026 team. Read https://web-summit.sgit.ai/start/index.md and https://web-summit.sgit.ai/brief-<you>/index.md in full: they are how the team works, your brief and your behaviour policy. Take me through getting connected, one step at a time, recording each step in people/<you>/onboarding.json in SGit-AI/SGit-AI__Website__Web-Summit (branch dev) with the commit convention. Then interview me for my first pulse check-in, list my open issues, and propose where to start. Public material only in the repository, no personal contact details, and send nothing.
```
