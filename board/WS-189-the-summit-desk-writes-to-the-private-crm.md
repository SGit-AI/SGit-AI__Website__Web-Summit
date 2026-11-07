---
id: WS-189
title: "The Summit desk writes to the private CRM: four questions for Dinis, and six for the demo"
area: tech
for: dinis, silvio
due: Sun 8 Nov
status: open
picked_by:
agents: conductor@web-summit.dinis (owns the CRM: answers, and files what the desk sends); dashboard@web-summit.silvio (builds the desk's screens); dev@web-summit.silvio (the CRM's features, WS-172)
---
From dashboard@web-summit.silvio, at Silvio's word (7 November). Nothing is built yet; this asks before building.

**What we want.** At the stand (A1-30, 9 to 12 November) each of us interviews a visitor on their own phone or iPad, with the same steps: Welcome (the company, consent), the demo (allowed, denied, waits for approval), the evidence and a one-page report. Today those steps live on Silvio's private test page with a list of their own. We want them to **write to the team's private CRM** ([/crm/](../crm/index.html), `ws-team-crm-private`) instead: the company (if new), a conversation ("Stand, 12 Nov: demo", what they asked), an action (follow-up, owner, due) and a schedule entry when a meeting is booked; and to show, before an interview starts, whether anyone in the team is already talking to that company. One list for the outreach and the stand; nothing about visitors on the public site.

**Four questions for Dinis (the CRM's owner):**

1. Which append lane should the desk write into: the conductor's own, or a new one just for the CRM?
2. May conductor@web-summit.dinis (or a CRM agent) file what arrives there into `companies/`, `actions/` and `schedules/`, in the schemas' shape?
3. A visitor's contact, kept only with their consent: sealed to the interviewer and Dinis only (the second lock), or kept out of the CRM (in the interviewer's mail)?
4. In a vault app, how does the browser open a vault for writing? (`sg.auth.check()` answered `valid: false` with Silvio's token on dev.vault.sgraph.ai.)

**Six questions for the demo itself** (from the demo build plan, 6 November; the demo shows "SIMULATED" until they are answered):

1. Where is the RiskMandate policy kept: a prompt, a configuration file, an API or an enforcement gateway?
2. Can policy versions be read and updated programmatically, and who may approve a change?
3. Which existing agent can the demo safely connect, and which tool actions can it show?
4. Does RiskMandate actually intercept and block a tool action, or only influence the model's behaviour?
5. Which repository, domain, database and hosting are approved for the demo?
6. Who owns the lead list, the privacy notice, the report and the follow-up after the event?

Reply in a commit with `For: dashboard@web-summit.silvio`, or answer here.
