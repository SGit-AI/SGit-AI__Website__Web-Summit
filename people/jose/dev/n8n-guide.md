# Jose's n8n workflows: what they do and how to use them

By `dev@web-summit.jose`, 5 November 2026, for Jose. Written from the repository as it is on `dev` (the workflow files, their tests and their READMEs). **This agent cannot see Jose's n8n instance**, so "active" below means only what the repository shows: nothing in it says either workflow has been imported or activated.

## Summary

| Workflow | Built by | Status | What it does |
|---|---|---|---|
| **WS-39 route 3**: the journalist's report to Jose on WhatsApp | `dev@web-summit.jose` | Complete; tested offline (7 tests pass); not known to be imported; **not active** | Sends the newest two-hourly report to Jose only, as one WhatsApp message he forwards to the team group |
| **WS-74 pending**: answers waiting in the feedback inbox | `automation@web-summit.jose` | Complete; tested offline (11 tests pass); **blocked on Jose's decision about the enum key**; not active | Tells Jose on WhatsApp how many public feedback answers are waiting, only when that number changes |
| `report-draft.n8n.js` | `dev@web-summit.jose` | Complete; tested (its suite passes; it adds one test per real report, so the count grows) | A component, not a workflow: the Code-node script that turns the newest report into WhatsApp and Slack text. Route 3 already contains it. |

**Discussed only, never built:**

- Slack as route 4: it waits for someone with Slack admin to create the app and the channel.
- An n8n-hosted form for WS-74: Jose chose the website's feedback pane instead.
- n8n reminder messages for the pulse (WS-41, way 3): out for now, at Jose's word (`WS-41-plan.md`).

**Jose's own, never seen here:** the WhatsApp flow that Jose's brief says he built in n8n before this project.

To check the tests yourself, from the repository root:

```
for t in people/jose/dev/*.test.mjs people/jose/automation/*.test.mjs; do node "$t" || break; done
```

## 1. WS-39 route 3: the newest report, to Jose on WhatsApp

### Purpose

The official WhatsApp API cannot post into the team's existing group (`WS-39-findings.md`). So n8n sends each new report to Jose, and Jose forwards it by hand. There is no gateway, and a person always does the sending to the group. Decided by Jose on 3 November (board WS-39).

### Status

- Built, and every node run offline against stand-ins for n8n and the site (`WS-39-route3.test.mjs`, 7 tests).
- Never run in a real n8n.
- File: [`WS-39-route3.n8n.json`](WS-39-route3.n8n.json), made by `WS-39-route3.build.mjs`. It imports inactive, with an empty credential and empty settings.

### How it works

Six nodes in a line:

1. **Every 30 minutes, 07:05 to 22:35 UTC** (the schedule node): polls with cron `5,35 7-22 * * *`, workflow time zone UTC. The site has no "new report" event, so the workflow polls.
2. **Settings:** Jose's number and the WhatsApp details. Empty until filled in.
3. **Draft the report:** reads `https://web-summit.sgit.ai/reports/index.md` and the newest report, and builds the text (the code in `report-draft.n8n.js`).
4. **Build the WhatsApp message:** stops quietly if this report was already sent.
5. **Send to Jose:** an HTTP Request to Meta's WhatsApp Cloud API, `POST /<phone number id>/messages`.
6. **Remember the report:** saves which report was sent, only after Meta accepts the message.

What Jose gets (the `three` look):

```
*RiskMandate team · 08:57 report*
Tue 3 Nov · stand-ups 13:00 and 18:00

▸ *Brief 5 to Dinis: three asks before 16:00*
▸ *The morning briefs for the 13:00 stand-up*
▸ *The board's health for Tuesday*

+4 more: https://web-summit.sgit.ai/reports/2026-11-03-0857/
```

### Practical use

A team update at most every two hours during the day. Jose glances at it, then forwards it to the team's WhatsApp group or skips it. Nothing reaches the group without Jose.

### Requirements

- A WhatsApp Business Cloud API number in a Meta app.
- Its access token, as an n8n *Header Auth* credential: name `Authorization`, value `Bearer <the access token>`.
- In the **Settings** node:
  - `phone_number_id`: the business number's Phone number ID (Meta app, WhatsApp, API setup).
  - `to`: Jose's own WhatsApp number, with country code.
  - `graph_version`: the Graph API version the Meta app uses, for example `v23.0`.
- Optional but recommended: an approved message template (see the 24-hour rule below).

No number, token or credential is ever written in the repository: they stay in n8n.

### How to use it

1. In n8n, **Import from file** and choose `WS-39-route3.n8n.json`.
2. On the **Send to Jose** node, n8n shows the credential as missing: create the Header Auth credential above and pick it.
3. Open **Settings** and fill in `to`, `phone_number_id` and `graph_version`. Leave `look: 'three'`, or change it to `'line'` (one line) or `'full'`.
4. Send any message from your phone to the business number. That opens WhatsApp's 24-hour window for text messages.
5. Click **Execute workflow** once. The newest report should arrive on WhatsApp. A manual run always sends it, because n8n doesn't keep the "last sent" memory in test runs.
6. **Activate** the workflow. From then on it sends each new report once.

### Limitations

- **The 24-hour rule, the important one.** In text mode (the default), a message reaches Jose only if he has messaged the business number in the last 24 hours. `automation@web-summit.jose` found a worse effect: Meta can accept the message and report the failure later (error 131047, on a webhook this workflow doesn't have). The workflow will already have marked that report as sent, so that day's reports are lost with no sign. **The fix is template mode:**
  1. In Meta's WhatsApp Manager, create a Utility template whose body is just `{{1}}`, and get it approved.
  2. In **Settings**, set `mode: 'template'`, `template_name` and `template_language` (for example `en`).
  3. In template mode the draft is sent as one line, since a template parameter can't hold new lines.

  Until the template is approved, message the business number once a day.
- The send uses an HTTP Request node, because the field names of n8n's own WhatsApp node couldn't be checked from the agent's session. You may swap it for the native node: the message body to copy is in **Build the WhatsApp message**.
- Never run in a real n8n, so the first import may need small fixes.

Sources and details: [`WS-39-findings.md`](WS-39-findings.md) ("To fill in n8n") and [`../automation/README.md`](../automation/README.md) (the 131047 finding, with its sources).

## 2. WS-74 pending: how many feedback answers are waiting

### Purpose

Strangers can now give feedback on the videos through the site (WS-74). The answers sit encrypted in `vault@web-summit.jose`'s inbox (its append lane) until it collects them. This workflow tells Jose when the number waiting changes, so he knows there is something to read.

### Status

- Built and tested offline by `automation@web-summit.jose` on 4 November (`people/jose/automation/WS-74-pending.test.mjs`, 11 tests).
- **Blocked** until Jose decides about the enum key (below).
- Its paging settings have never run in a real n8n.
- File: [`../automation/WS-74-pending.n8n.json`](../automation/WS-74-pending.n8n.json). It imports inactive, and successful runs save no execution data.

### How it works

Seven nodes in a line:

1. **07:20, 12:20 and 17:20 UTC** (the schedule node).
2. **Settings.**
3. **Find the lane:** reads the inbox's current address from the live site (`assets/feedback.json`), so it follows changes on its own. The host is pinned in Settings, so the key is never sent anywhere else.
4. **List the lane:** asks the vault server for the list of waiting answers only, never their content.
5. **Draft the note.**
6. **Send to Jose:** the same WhatsApp call as route 3.
7. **Remember the note.**

It messages Jose only when the count changes, and warns him from 800 waiting (the inbox refuses new answers at 1,000). It never reads an answer: they are encrypted to the vault agent's key anyway.

### Practical use

For example: *"WS-74 feedback lane: 4 answers are waiting on vault@web-summit.jose's vault (was 3 at the last note)."* That is Jose's cue to ask his vault agent for the summary (`feedback-summary.mjs`) to pass to Silvio.

### Requirements

- **A decision from Jose.** Counting the waiting answers needs the vault's listing key (its enum key). Today it exists only in `vault@web-summit.jose`'s session. Copying it into n8n puts a second copy of a vault credential outside that session, which is the kind of thing WS-129 warns about. The key can list waiting items, fetch their ciphertext and mark them processed; it can't open, write or delete anything.
- The same WhatsApp credential and settings as route 3.

### How to use it (if Jose says yes)

1. Import `people/jose/automation/WS-74-pending.n8n.json`.
2. Get the enum key from `vault@web-summit.jose` in its own session. Never paste it into the repository, a commit or a chat.
3. Create a *Header Auth* credential: name `x-sgraph-vault-enum-key`, value the key. Call it "WS-74 lane enum key" and pick it on **List the lane**.
4. Pick the WhatsApp credential on **Send to Jose**, and fill in **Settings** as for route 3.
5. Click **Execute workflow** once to test, then **Activate**.

### Limitations

- The enum key changes whenever the vault agent starts a new session. The workflow then gets a 404 and tells Jose once to update the key. Nothing is lost: the answers stay waiting.
- It has the same 24-hour WhatsApp issue as route 3.
- Its paging settings (n8n HTTP Request 4.2, up to 25 pages of 50) follow n8n's documented shape but have never run. If they misbehave, turning paging off still works up to 50 answers.
- Right now there is little to count: the five questions went live on 4 November at about 23:40 UTC (commit `39816bd2`, board WS-74).

Details: [`../automation/README.md`](../automation/README.md).

## What this agent needs from Jose

To say what is really live, one of these from Jose's n8n:

- a screenshot of the workflow list, or
- the exported JSON of anything imported.

And, if Jose wants it reviewed, an export of the WhatsApp flow he built before this project. Remove any tokens and numbers before sharing.

## Recommendation: start with route 3

It is the most useful: a team update every couple of hours, with no new work for anyone else. It is also the readiest: complete, tested, and all its decisions already made. It needs only Jose's WhatsApp details and the 24-hour fix.

Set it up in template mode (or message the number daily until the template is approved), run it once by hand, then activate it.

Leave WS-74 pending until Jose has decided about the enum key and the first answers start arriving.
