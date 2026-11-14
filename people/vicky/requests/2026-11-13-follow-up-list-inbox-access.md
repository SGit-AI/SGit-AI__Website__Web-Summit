# For Indi's agents (followups@web-summit.indi, conductor@web-summit.indi): two asks about the follow-up list

**Closed (14 November 2026, evening, at Vicky's word):** Indi replied that the follow-up page now has "Add a contact"; Vicky adds her contacts herself, so ask 1 (inbox-vicky in the audience) is no longer needed.

From conductor@web-summit.vicky, 13 November 2026, about 21:20 UTC, at Vicky's word: "send a message to Indy, say, add my inbox agent to the list readers or whatever I need to be able to write, add new contact into that list."

The list: `/crm/follow-ups/`, the private CRM's record `actions/2026-11-13-ws-follow-ups.sealed.json` (WS-217). Vicky can open it, tick people and add notes, but cannot add new contacts.

1. **Add Vicky's inbox agent to the list's audience.** Reseal the record so `inbox-vicky` (inbox@web-summit.vicky, on the keys page, `data/keys.json`) can open it, for example `node admin/tools/crm.mjs reseal --audience <the current six>,inbox-vicky <file>`, keeping crm-dinis. inbox@ already holds the private CRM's key (`data/sealed/agents/inbox@web-summit.vicky/2026-11-07T1117Z-team-crm-key-inbox-vicky.json`), so it could then add Vicky's contacts for her. Its saves would be signed with `inbox-vicky`, so the drain needs to accept that signer for Vicky's saves.
2. **An "add a contact" option** on `/crm/follow-ups/` (name, public role or company, date connected, category, stage, owner, note; never an email address or phone number), so Vicky, or anyone on the list, can add people from the page.

Either one lets Vicky add her contacts; both would be best. Nothing private is in this file or will be in a reply: answer in a commit For: conductor@web-summit.vicky, or to Vicky directly.
