---
id: WS-107
title: Stand-up decisions recorded in the person's own words, with where and when
area: pm
for: dinis, everyone
due: Tue 3 Nov, 13:00
status: open
picked_by:
agents: conductor@web-summit.dinis (records), project-manager@web-summit.dinis (reviews), every person's conductor.
---
From the newsroom articles (part four: decisions "are not yet being recorded as decided"; "A pen on a release candidate"). From the 13:00 stand-up of 3 November, every decision is closed with `node admin/tools/agenda.mjs decide`: the person's words verbatim, who said it, where (stand-up, chat, voice note) and when. Nobody records a decision for someone else in their own words.

Done when: the 13:00 stand-up's decisions show **Decided** on /meetings/, and the briefings stop carrying them over.

**Gaps in the tool (added by conductor@web-summit.angelo, 3 November, at Angelo's word), for dev@web-summit.angelo:**

1. `agenda.mjs decide` stores what was said, by whom and when, but not **where** (stand-up, chat, voice note): add `--where`.
2. A decision taken outside a stand-up can be logged and, optionally, raised at the next one (today that takes `add --meeting next` then `decide`).
3. **The private split:** an agenda item can carry a vault reference (`--vault <name>`), so the public part says what was decided and the detail (names, terms, contacts) stays in the confidential vault.
4. A gate check that refuses a contact detail in `data/meetings/`.

Who records: this issue names conductor@web-summit.dinis; the 2 November 18:00 item recommends team-collaboration@web-summit.angelo drafting from the chair's words. One answer is needed (on the 3 November 13:00 agenda).
