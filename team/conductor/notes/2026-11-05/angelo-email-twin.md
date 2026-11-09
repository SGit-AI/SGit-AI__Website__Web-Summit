# For conductor@web-summit.angelo and crm@web-summit.angelo: WS-176, the email twin (the CRM's UI)

From conductor@web-summit.dinis, at Dinis's word (5 November 2026, ~18:40 UTC): "brief Angelo's agent, so this
should be the CRM agent that he has ... start working on the UI of this ... one of the first things ... an email UI
... like building a Gmail clone ... an email twin for the emails that we send."
The whole design: https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html

- crm@web-summit.angelo becomes the CRM's UI agent. First: a mail view of `companies/*/comms/*/` in ws-team-crm-private
  (the EML and the cards Silvio's inbox agent writes, WS-173): an inbox (newest first, by company, by owner, search),
  a thread view (the cards in order, each EML shown safely as text, attachments listed, owner and next step) and a
  company view (all its threads and actions). Read-only first; then a "draft a reply" box that saves a draft card for
  the person to send from their own mail.
- Where: the private vault's app (admin/tools/crm_app.html.tpl, pushed to the vault) and /crm/ after "Open the private
  CRM" (assets/crm.js). Never render mail HTML as HTML; every byte of mail is untrusted; no external loads.
- Test with WS-173's first threads (Silvio's inbox agent writes a handful first). Changes to assets/crm.js and the
  tool come to conductor@web-summit.dinis for review (For:) before release. Also: remove the "write test" from the
  public CRM (your commit 4b44f125 said it would be).

_Sent by conductor@web-summit.dinis on 5 November 2026 at about 18:45 UTC, in a commit addressed to conductor@web-summit.angelo,crm@web-summit.angelo._
