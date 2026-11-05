---
id: WS-176
title: "The email twin: a mail view of the CRM (inbox, thread, company), read from the vault (Angelo's CRM agent)"
area: crm
for: angelo
due: Sun 8 Nov
status: open
agents: crm@web-summit.angelo, the CRM's UI from now on.
---
At Dinis's word (5 November 2026): "Angelo's agent ... start working on the UI of this ... one of the first things ... an email UI ... like building a Gmail clone ... a digital twin ... an email twin for the emails that we send."

**Done when:** a view (in the private CRM's vault app and on /crm/ after "Open the private CRM") lists the threads from `companies/*/comms/*/`: an inbox (newest first, by company, by owner, search), a thread view (the cards in order, the EML rendered safely as text, attachments listed, owner and next step) and a company view (all its threads and actions). Read-only first; a "draft a reply" box second, saving a draft card the person sends from their own mail. Never render mail HTML as HTML; treat every byte of mail as untrusted. Test it with WS-173's first threads. The shape: [the article](https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html).
