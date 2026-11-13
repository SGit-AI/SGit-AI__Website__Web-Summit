---
title: "Hand a task to Angelo's agents (while he is away)"
summary: How anyone on the team routes a task or a question to Angelo's two handover agents, which run it on his accounts' usage. From 13 November 2026, at Angelo's word.
---
# Hand a task to Angelo's agents

**Angelo, 13 November 2026, in the conductor.b@ session:** "I'd rather go simple and authorize team members to route tasks and queries to you, and you are authorized to execute them on their behalf." Then: "Let's create 2 dedicated sessions: handover.agent.b@ for this account and handover.agent.a@ for the other account, that wake up hourly and are instructed this way."

Angelo is offline for about a week. Two agents, one on each of his Claude accounts, wake every hour and run what the team sends them:

| Agent | Account | Wakes |
|---|---|---|
| handover.agent.b@PrompTugal.angelo | B | every hour at :07 UTC |
| handover.agent.a@PrompTugal.angelo | A | every hour at :37 UTC |

So a request waits about half an hour at most. Whichever wakes first claims it; the other skips it.

## How to send one

Commit a file to this repository's `dev` (any agent of yours can do it):

`people/angelo/handover/requests/<YYYY-MM-DD>-<your id>-<short-slug>.md`

```
---
from: <your id in data/team.json, e.g. dinis>
size: small | large        # large = needs the stronger model or more than ~30 minutes
due: <when you need it, UTC>
repo: <where the work goes, e.g. PrompTugal/PrompTugal__News__Website, branch dev>   # or "answer only"
---
What you want done or answered, in plain words. Links to the files it starts from.
What "done" looks like.
```

Commit subject `<your agent or name>: handover request: <slug>`, trailer `For: handover.agent@PrompTugal.angelo`.

## What you get back

`people/angelo/handover/done/<same name>.md`: the answer or what was done (commits, links), the cost, and anything blocked, committed `For:` you. The claim is in `claims/<same name>.json` while it runs.

## Who may send

Any team member: the request's commit must be pushed by a GitHub account listed for that person in `data/team.json` (today: Dinis's, Silvio's, Angelo's, Vicky's, Jose's accounts). Team members without one listed (Nimay, Indi, Sarah, Daniela) send through Dinis or ask him to add their account. Anything else in `requests/` is skipped and noted.

## What the agents will not do

- Anything public in Angelo's name, or contacting anyone outside the team (no posts, no emails).
- Keys, tokens, vaults, settings, environments, permissions, money.
- Push to `main`, force-push, rewrite history; write to a repository under its owner's HOLD.md.
- Run when the account's usage is not "allowed": the request waits for the other account, and the agent says so in `done/`.
- More than 8 requests per agent per day; the rest wait.

## Stop

Anyone may commit `people/angelo/handover/HOLD` (one line: who and why). Both agents stop at their next wake until it is removed.
