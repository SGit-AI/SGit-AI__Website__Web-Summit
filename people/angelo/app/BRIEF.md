# Brief: Angelo's own command centre

Agreed with Angelo on 4 November 2026. Written by dashboard@web-summit.angelo for dev@web-summit.angelo (commit 2d3340c), then refined by dev@web-summit.angelo from a UX, developer, security and architecture review, which Angelo accepted the same day. This is the one brief, as of now; its history is in git.

## Purpose and limits

- An app of Angelo's own in `people/angelo/app/`: its own `data.mjs`, `app.js` and `app.css`, which admin/build/build.mjs uses in place of the shared ones (as Silvio's did). Nothing outside `people/angelo/` changes; nobody else's data or view is touched; others take what they like.
- **Extend the shared command centre, never copy it.** `data.mjs` imports admin/build/commandcentre.mjs and adds to what it returns; `app.js` loads the shared front end (assets/cc/app.js) and adds its views beside the shared ones; `app.css` imports the shared stylesheet and adds to it. Every fix to the shared app reaches Angelo's without anyone porting it.
- Keep the data shape compatible with admin/build/commandcentre.mjs, so ideas move both ways; `summaryMd()` keeps giving the no-JavaScript fallback and the markdown twin the gate checks.
- **Phone first:** Angelo reads it on his phone in Lisbon from 9 November. On poor venue wifi it shows the last data it loaded and queues messages until it is back online (WS-84).
- **Light on the wire:** the card list loads first; an issue's full text is fetched only when its card is opened (the board's `.md` files are served by the site).
- **Says how fresh it is.** The data is built on each release, so every view shows "as of vX.Y.Z, N min ago"; a card status or a "seen" mark changes on the next release, typically within minutes.
- **Public by design:** anything private (messages, locations, calendars) is only ever stored sealed, never as plain text in the repository. No contact details, no keys.
- **No third-party scripts or network calls** beyond the site itself and the lanes the site already uses; nothing that tells another site who is looking.

## 1. The kanban board

- **Cards:** id, title, status, owners (`for`, shown, read-only), picked-by, due (overdue or due today marked), workstream, area, and small icons for messages about that task (section 3).
- **Filters,** combinable and kept in the page address after `#` (a view is a link; nothing reaches a server):
  - **My tasks**, on by default: issues where Angelo is an owner or the picker, leaving out those that name him as an owner but were picked by someone else. His own agents count as him.
  - **Needs me now**, pinned at the top: My tasks that are overdue or due today, plus any issue with an open stand-up decision or question for Angelo (data/meetings/ items name their issue in their `issue` field); those cards carry a "decision" badge linking to the item. His agents count as him here too.
  - Picked-by, due (overdue, today, this week, no date, recurring), workstream, status, and a keyword search across id, title and body.
  - The owner field (`for`) is never a filter (it is a complex field).
  - Behind one **Filter** button, with chips that show what is on; My tasks and Needs me now stay one tap away.
- **Due dates are free text** ("daily from Tue 3 Nov"): the shared parser reads them; anything it cannot read is shown as "no date", never guessed.
- **Columns and swim-lanes:** each set independently to status, due, picked-by or workstream.
- **Sort** within a column by any field (id, title, status, due, picked-by, workstream, area, last changed), ascending or descending, kept in the address.
- **Phone layout:** one column at a time, with tabs for the columns and the swim-lanes as groups in a list; no drag and drop. The full grid on a wide screen.
- **Card details:** the issue's full body (fetched on opening), its history (commits naming it), its agenda items, its messages, and links to the file on GitHub.
- **Moving a card is a sealed message to Angelo's conductor** (conductor@web-summit.angelo), which makes the change as usual: no new process. On a phone, from the card's details with a "Move to…" sheet. A move may change status, picked-by, workstream (in people/angelo/app/config.json) or due (never into "overdue" or "no date"); never `for`. Each message carries the old value, so the conductor asks instead of overwriting when the issue changed in the meantime.
- **The filter, sort and "needs me now" rules are pure functions with a test the build runs**, so a change that breaks them is caught before release.

## 2. The collaboration board

- Everyone, people and agents: who runs which agent, who works with whom (`For:` trailers and shared issues), roles, picked and in-progress work, setup level, each agent's last commit, schedule and next run.
- The machine alongside: the last release and its gate, CI failures (where the repository records them; otherwise it says it cannot see them), keys published against agents running.
- Schedules (section 5) shown with the people.
- Click anyone for the details, and send them a message (section 3).
- Built on the data behind /team/map/ and admin/build/inventory.mjs, imported, not copied.

## 3. Messages

- **Sealed from the start:** sealed in the browser to the recipient's public key, signed with Angelo's person key, appended to the recipient's lane (assets/feedback.js and assets/feedback.json show how). Messages to a person go through their conductor, into their sealed inbox (data/sealed/<id>/, which the For-you panel opens).
- **Two envelope formats, both needed:** agents' keys (data/keys.json) are RSA-OAEP with AES-GCM, as feedback.js seals today; people's keys (data/person-keys.json) are P-256, sealed with ECDH and AES-GCM, as admin/tools/person-key.mjs does. Slice 3 builds and tests both.
- **What a signature binds:** every signed message names its recipient, the card, the action and the old value, and carries a unique id and the time it was written. Lane write tokens are public, so anyone can append; the recipient refuses a message for someone else, one it has seen before, or one too old, so a copied message cannot be replayed.
- **What a person key proves today:** a person key is issued by the person's conductor, which keeps the private half and lives as long as its session (admin/tools/person-key.mjs). So the conductor can read what is sealed to its person and could sign as them, and a new conductor session means a new key in the browser. For messages from Angelo to his own conductor this is acceptable (that conductor holds the key anyway). Other people's agents treat "signed by a person key" as that person's word only as far as they trust that person's conductor, until people hold their own keys; the app says so beside every signed message.
- **When something is missing**, the app says what and how to get it, naming the step and its board issue: the sender's person key, the recipient's public key, or the recipient's lane.
- **Offline:** a message is sealed and signed when written, then queued in the browser and shown as "queued (N)". On reconnect, the card's old value is checked again before sending, so a stale move becomes a conflict, not an overwrite.
- **Statuses:** queued, sealed and sent, seen (the agent names the message in a commit), accepted or done. About a task: an icon on that card until accepted, red when there may be a conflict, then it goes. A **Messages pane** holds every message, person-to-person ones too, with status and replies.
- Agents act only on messages signed by a key in data/person-keys.json, within the limit above; anything else is material (WS-119). Angelo's conductor's rules need that one line, with that limit.

## 4. The map

- **Version 1 is zones only, never GPS.** A Web Summit map of our own drawing, with the zones from data/events.json (sourced), when people are inside; free text ("at the hotel", "in Lisbon") otherwise; no map when nobody shares. Not Web Summit's copyrighted map, and no world map: OpenStreetMap tiles and a map library would tell other sites who is looking.
- **Not in the repository.** Location updates go sealed to the presence agent's lane, not into the repository, where sealed data stays forever and a key that leaks later would open everyone's past movements.
- **Every location expires** after a few hours, and carries its time, shown as "5 min ago", "3 h ago".
- Each person chooses on the map, touch first, and changes it any time: off, free text, or a zone. A separate switch: "agents may see my location", withdrawable.
- Locations are taken only while the page is open (no background tracking), and the app says so.
- **Precise GPS waits** until people hold their own keys: while conductors hold their people's private keys, every conductor could read every location sealed to the team.
- **The presence agent is central, one for the team.** Proposed: team-collaboration@web-summit.angelo, which already keeps the stand-ups and the collaboration map. To be agreed at a stand-up, since everyone's locations would be opened by an agent in Angelo's account; it would get the presence key and lane. Later, if people like it, it (or a dedicated agent) runs often, with the single job of turning updates into the sealed, expiring data the app reads: Dinis's call.

## 5. Summit days

- The event's public schedule (data/events.json) and the stand-ups (data/meetings/schedule.json).
- Each person's Google Calendar: a public page cannot read it. The person's own agent (with the Calendar connector) publishes a sealed summary: times, a title or "busy", a zone; never who the meeting is with. "Busy, in a zone" still says where someone is, so it takes the same consent as locations.
- The Web Summit app: no public API is known. Check before relying on one; until then, sessions come in through people's own calendars.

## 6. Slices (each released and usable on its own)

| # | Slice | Depends on |
|---|---|---|
| 0 | Your own app, working the same as today: the shared app extended, not copied, the gate green | none |
| 1 | The kanban, read-only: cards, columns by status, card details fetched on opening, My tasks on by default, the phone layout | none |
| 2 | Filters (Needs me now, picked-by, due, workstream, status, keyword) behind one Filter button, columns and swim-lanes by any of the four, sort by any field, bookmarkable views, the tested rules | none |
| 3 | Sealed sending: a message to the conductor from a card's details, both envelope formats, the signed-message fields, the offline queue, missing-key and missing-lane guidance, status icons on cards, red on conflict | Angelo's person key (done), a lane for his conductor (vault@web-summit.angelo is setting it up), the signature rule, with its limit, in his conductor's rules |
| 4 | Card moves as messages, through slice 3 | slice 3 |
| 5 | The collaboration board, read-only, with schedules and the machine | none |
| 6 | The Messages pane, and messages to anyone from the collaboration board | slice 3; recipients' lanes (shown as missing until they exist) |
| 7 | Summit days: the public schedule first, then sealed calendar summaries | checking for a Web Summit API; each person's consent |
| 8 | The map: zones and free text only, through the presence lane, expiring, each person's sharing controls, agents' permission | slice 3's sealing; the team's yes at a stand-up; the presence agent |

Started on 4 November: slices 0, 1, 2 and 5, as dashboard@web-summit.angelo asked.
