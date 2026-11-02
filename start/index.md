# Start here

The one page for the Web Summit 2026 team. Find your name, open your brief, paste your prompt into your own Claude, and get connected (Claude, GitHub, email, a PKI key, a schedule). Then how we work, the pulse, and the dates. Everyone champions RiskMandate.

Site version: v0.1.27

**Team: start here.** Find your name, open your brief, and paste the prompt from it into your own Claude. Your agent then takes you through getting connected, one step at a time. Everything here is public, on purpose: how we work is part of what we show.

## Find your name {#people}

| Who | Focus | Brief | Dashboard | Prompt |
|---|---|---|---|---|
| **Dinis Cruz** | Operator: RiskMandate, the strategy, the senior meetings | [your brief](../brief-dinis/index.html) | [your dashboard](../people/dinis/index.html) | [your prompt](../brief-dinis/index.html#prompt) |
| **Nimay Parekh** | Business, positioning, outreach and investors | [your brief](../brief-nimay/index.html) | [your dashboard](../people/nimay/index.html) | [your prompt](../brief-nimay/index.html#prompt) |
| **Angelo** | Technical lead: the site, the agents, the behaviour policies | [your brief](../brief-angelo/index.html) | [your dashboard](../people/angelo/index.html) | [your prompt](../brief-angelo/index.html#prompt) |
| **Jose Bota** | Technical: automation, messaging, the agents | [your brief](../brief-jose/index.html) | [your dashboard](../people/jose/index.html) | [your prompt](../brief-jose/index.html#prompt) |
| **Vicky** | Project manager: the structure, the deadlines, the logistics | [your brief](../brief-vicky/index.html) | [your dashboard](../people/vicky/index.html) | [your prompt](../brief-vicky/index.html#prompt) |
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

## Get connected: the levels {#levels}

The first priority for everyone. Your agent records your level in `people/<you>/onboarding.json`; the table below is built from those files.

| Level | What it means |
|---|---|
| **L0** | Not connected. |
| **L1** | A dedicated Claude account (or a dedicated project) for this work. |
| **L2** | GitHub: you can push to [this repository](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit), and you have an email you can send from. |
| **L3** | A PKI key registered on pki.sgit.ai, and access to the team's vaults. |
| **L4** | A Claude session on a schedule (for example every morning). |
| **L5** | Several agents run inside one Claude session. |
| **L6** | Several Claude sessions, each on its own schedule. Use a separate session for each agent that runs on its own schedule, and a separate session per topic. |

| Person | Level | Claude | GitHub | Can push | Email | PKI key | Vaults | Scheduled | Several sessions | Updated |
|---|---|---|---|---|---|---|---|---|---|---|
| [Dinis Cruz](../people/dinis/index.html) | L6 several Claude sessions on schedules | yes | yes | yes | yes | yes | yes | yes | yes | 2026-11-02 |
| [Silvio Switha](../people/silvio/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |
| [Nimay Parekh](../people/nimay/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |
| [Angelo](../people/angelo/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |
| [Vicky](../people/vicky/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |
| [Daniela](../people/daniela/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |
| [Indi Gupte](../people/indi/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |
| [Jose Bota](../people/jose/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |
| [Sarah](../people/sarah/index.html) | L0 not connected | not yet | not yet | not yet | not yet | not yet | not yet | not yet | not yet | never |

### The steps, for you and your agent {#steps}

1. **Claude (L1).** A dedicated Claude account or project. Paste the prompt from your brief into a new session.
2. **GitHub (L2).** Send your GitHub username to Dinis; accept the invitation to `SGit-AI/SGit-AI__Website__Web-Summit`. Your agent clones it (branch `dev`) and pushes its first commit: your `people/<you>/onboarding.json`.
3. **Email (L2).** An address you can send from: your own, or a workspace account Dinis creates for you.
4. **PKI key (L3).** Register at [pki.sgit.ai](https://pki.sgit.ai/people/how.html): a passkey, a key pair made in your browser, your GitHub account as evidence. Dinis, the anchor, verifies you. Commit your public bundle (never the private key) as `people/<you>/key.json`. Each of your agents makes its own key with [pki-agent](https://pki.sgit.ai/agents/pki-agent.mjs) (`node pki-agent.mjs keygen --name "<agent>@web-summit.<you>"`) and links to yours (`node pki-agent.mjs operator <your fingerprint>`).
5. **Vaults (L3).** Dinis seals the team's vault keys to your key; you open them with your key. The private vault holds what can't be public (meetings, contacts).
6. **A schedule (L4).** One scheduled session that pulls the repository each morning, reads your dashboard and the board, asks you for your pulse, and tells you what is waiting on you.
7. **More agents (L5, L6).** Name them by the convention, run them as sub-agents first, then give each scheduled agent its own session.

## How we work {#how}

- **The website is the centre**, for the humans and for the agents. Every page has a markdown twin (`index.md`) for agents, and [llms.txt](../llms.txt) lists them all.
- **One repository, everyone commits.** Each person has a folder, `people/<you>/`: your dashboard, your onboarding, your pulse, your card, your public key. The board is `board/`, one file per issue.
- **Names:** `<agent>@web-summit.<person>`, for example `pm@web-summit.vicky`. The conductor that keeps this site is `conductor@web-summit.dinis`.
- **Commits are how agents talk to each other.** Subject `<name>: <what>`; trailers `Agent: <name>`, `Issue: WS-NN` when it is about an issue, `For: <name>` for a message to someone. Read what is for you with `git log --grep "For: .*web-summit.<you>"`.
- **Releasing:** commit your source changes only, then `AGENT=<name> admin/tools/release.sh "<one sentence>"`. It rebases, bumps the version, builds, runs the gate, pushes (retrying if someone pushed first) and checks the live site.
- **Issues:** [the board](../briefs/index.html#issues). Pick one up by putting your name on it; tag-team, and hand over in a commit with `For:`.
- **Your dashboard is yours.** Make it the page you want to see when you wake up. We copy the best ideas into the main page.
- **Public forever:** no contact details, no keys, nothing private in the repository. Private things go in the private vault.
- **The team's agents** (conductor, journalist, pulse, security) run on a schedule in Dinis's account; [the list](../brief-dinis/index.html#team-agents).

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
