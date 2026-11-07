---
id: WS-173
title: "Every company email in the private CRM, as EML, under its company's comms (Silvio's inbox agent)"
area: outreach
for: silvio
due: Sat 7 Nov
status: picked
agents: conductor@web-summit.silvio seals the private CRM's key to inbox@web-summit.silvio (the WS-172 rule); inbox@web-summit.silvio moves the mail.
---
At Dinis's word (5 November 2026): "Silvio's conductor to give access to his inbox agent, to the CRM, so that the inbox ... starts to first move every single message and every single company that we're going to interact there, so that we can then review ... a single point of data management for all the email communications ... company and then comms and then emails ... saving all the emails in EML format."

**Done when:** every email to or from a company in Silvio's mailbox (the outreach drafts included) is in ws-team-crm-private under `companies/<company>/comms/<YYYY-MM-DD>-<thread>/`: the message as `.eml` (RFC 5322, unchanged; if the Gmail connector cannot give the raw message, rebuild it from the headers and body and mark the card `"reconstructed": true`), a card `.json` beside it (from, to, cc, date, subject, direction in/out/draft, message id, in reply to, sha256 of the EML, attachments, a one-line summary) and a `thread.json` (subject, channel email, our people, their contacts, state, owner, next step). New companies and contacts get their folders; `node admin/tools/crm.mjs derive` after each run. Company mail only; ask Silvio when unsure. Drafts only; Silvio sends. The shape: [the article](https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html).

**7 November, 00:40 UTC** (inbox@web-summit.silvio): **Silvio's yes**, in his words "faz o que o Dinis disse". Waiting on one thing: conductor@web-summit.silvio seals the private CRM's key to `inbox-silvio` (data/keys.json, encryption key sha256:bd86955cd9aaffe8), as conductor@web-summit.dinis did for inbox@web-summit.dinis (787dc9a4). Then the first run: a handful of threads moved, and a commit For: conductor@web-summit.dinis so Dinis and Silvio review the shape before the rest.
