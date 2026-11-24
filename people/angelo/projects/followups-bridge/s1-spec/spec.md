---
title: "The follow-ups bridge: spec (s1)"
by: spec@PrompTugal.angelo (alpha.large.worker@PrompTugal.angelo)
written: 2026-11-24
for: Angelo, through followups-bridge.pm@PrompTugal.angelo
status: draft for Angelo's read
---
# The follow-ups bridge: spec

## Summary (one screen)

- **What:** /crm/follow-ups/ stays the one list. It gains a log of actions per contact, stage, next step and date, an "in progress by" marker, three views and a spreadsheet import. It keeps its key gate and its sealing.
- **The one big change:** a save stops being "the whole list, newest wins". Each save is a small sealed batch of **events** (added a contact, logged an action, moved a stage). The drain files each person's events in **their own append-only file** in the private CRM. The page reads every file and folds them, so two people never overwrite each other.
- **Filing within the hour** needs an agent that drains the drop box every hour. Today only conductor@web-summit.indi can, and it has been quiet since 16 Nov. **Recommended:** a new filer of Angelo's, with its own drop box, its own SG/Send token from Dinis, and the private CRM's key sealed to it. All of this is tier 3, so it is asked as questions below.
- **Works with no new token:** the event format, the fold, the new fields, the views, the import, a person's own unsaved and unfiled entries (shown at once in their browser). Filing needs the drop box's private half and a token.
- **Dinis's model:** contact maps to crm.org/1 and crm.person/1. Stage, owner and next step map to crm.lead/1. The action log becomes **crm.action/1, proposed to Dinis**. Stages map with one loss ("call booked"). His model allows a vault's own stage list, which avoids the loss.
- **First step, before any build:** Angelo's 35 are probably a whole-list save waiting in the drop box. They must be filed by the drop box's holder **before** the new save format ships, or a new drain could pass them over.
- **Build:** eight small steps. The first two need nobody: the event model and fold, with made-up data, then the drain's new format tested offline.

Every person below is made up and labelled so. Paths outside this repository are marked `Cell__Email:` (AgentiCCells/AgentiCCells__Cell__Email, branch work/crm.dev.a, read at 3ed3f45, 24 Nov 02:01 UTC).

## 1. Records and fields

**Today** (assets/crm-follow-ups.js, the add form and `render()`): one sealed record, `actions/2026-11-13-ws-follow-ups.sealed.json`, holding `contacts[]` with `id, name, role, met, tag, stage, owner, note, linkedin, followed_up, followed_up_at, followed_up_by, added_by, added_at`, plus `updated_at, updated_by` on the record.

**Dinis's model** (`Cell__Email:crm/model/crm.mjs`): one JSON file per record; ids are a prefix and 8 hex characters (`newId`, :221); times are ISO to the second with Z (:27); due dates are `yyyy-mm-dd` (:28); last contact and follow-ups are derived, never stored (:11).

| Bridge field | Where it lives today | Dinis's field | Note |
|---|---|---|---|
| contact id | `contacts[].id` (name slug + time) | `crm.person/1 id` (`p-xxxxxxxx`) | the move script makes new ids and keeps a map |
| name | `name` | `crm.person/1 name`, `first` | |
| company | inside `role` | `crm.org/1 name` (unique, :230) | **new field** `company`; import splits it out |
| role | `role` | `crm.person/1 role` | |
| category | `tag` (Customer, Investor, Partner, Other) | `crm.org/1 kind` (prospect, customer, investor, partner, event, community, other; :218) | lower-cased; one to one |
| LinkedIn | `linkedin` | none | **proposed to Dinis**: `links[]` on crm.person/1; else kept in a note |
| email | never (the page refuses it) | `crm.person/1 emails[]`, **required** (:246) | **question to Dinis:** make it optional; else a person without one cannot move |
| source: who met them | `added_by` (approximate) | none | **new** `met_by`; moves as the first crm.action/1 (channel `in_person`) |
| source: where, when | `met` (date only) | none | **new** `met_where`, `met_on`; same first action |
| owner | `owner` | `crm.lead/1 owner` (:61) | a team id from data/team.json |
| stage | `stage` (all "to follow up") | `crm.lead/1 stage` (:60) | section 2 |
| next step, date | none | `crm.lead/1 next_step`, `next_step_due` (:62, :63) | **new** `next_step`, `next_due` |
| in progress by | none | none | **new**, derived from `claim` events; not moved (it is short-lived) |
| last touch | `followed_up_at` (one tick) | derived, never stored (:11) | derived from the newest action's `done_on` |
| followed up | `followed_up` tick | none | kept for old saves; shown as "has an action logged" |
| note | `note` (one, overwritten) | none | becomes an action of channel `note`; never overwritten again |

A lead is one per **company** in Dinis's model (:57). A contact with no company gets an org named after the person, marked `kind: other`, by the move script.

**The action-log entry, proposed to Dinis as `crm.action/1`** (in his shape: schema first, `newId('a')`, one file per record at `crm/actions/<id>.json`, references by id, `<verb>_by` and `<verb>_at`):

```
{ "schema": "crm.action/1", "id": "a-3f9c01ab", "org": "o-…", "person": "p-…",
  "channel": "email|linkedin|call|in_person|note|other", "summary": "one line",
  "notes": "optional text", "done_on": "2026-11-20",
  "added_by": "angelo", "added_at": "2026-11-24T10:00:00Z" }
```

`done_on` is when it happened (an import brings past actions); `added_at` is when it was written. A builder that throws and a check in `checkCrm` (:49) would come with it, as Dinis's other records do. The bridge stores the same fields with the bridge's contact id in place of `org` and `person`.

## 2. Stages

| Angelo's seven | Dinis's six | Back again |
|---|---|---|
| to contact | new | new → to contact |
| to follow up | contacted | contacted → to follow up |
| in conversation | talking | talking → in conversation |
| call booked | talking | (lost: comes back as in conversation) |
| proposal | proposal | proposal |
| won | won | won |
| parked | parked | parked |

- **Lost going over:** "call booked" against "in conversation". The move script writes `next_step: "call booked"` when the lead has no other next step, and an action `channel: call, summary: "call booked"`, so the fact survives in the history.
- **Lost coming back:** nothing; Dinis's six all have a place.
- **Better:** Dinis's model reads a vault's own list from `crm/stages.json` (`Cell__Email:crm/model/crm.mjs`:42). If the team vault uses Angelo's seven there, the move loses nothing. A question for Dinis (section 6).
- The loop (to follow up, in conversation, call booked, until won or parked) is a drawing, as in people/angelo/projects/crm-pipeline/d2-spec/spec.md section 1: any move is allowed and recorded.

## 3. Import

**The template, one file, two sheets** (or two CSV files with the same names): a team member fills **contacts** in about ten minutes and adds **actions** only for people already followed up.

`contacts`: `name*, company, role, category*, met_by, met_where, met_on, owner, stage, next_step, next_due, linkedin, note` (* required; `met_by` and `owner` default to the person importing; `stage` defaults to "to follow up").

`actions`: `name*, company, done_on*, channel*, by, summary*, notes` (`by` defaults to the importer; `name` and `company` match a row in contacts or one already on the list).

**Made-up example** (all invented people):

```
name,company,role,category,met_by,met_where,met_on,owner,stage,next_step,next_due,linkedin,note
Ana Exemplo (made up),Fictícia Lda,CTO,Customer,angelo,stand A1-30,2026-11-11,angelo,in conversation,send the deck,2026-11-27,,asked about agent audit
Bruno Inventado (made up),Modelo Capital,Partner,Investor,silvio,Centre Stage,2026-11-12,silvio,to follow up,,,,
```
```
name,company,done_on,channel,by,summary,notes
Ana Exemplo (made up),Fictícia Lda,2026-11-18,email,angelo,thank-you note and deck,
```

**Reading files in the browser.**

| Option | Size and licence | For | Against |
|---|---|---|---|
| **CSV + a small XLSX reader (recommended)** | about 150 lines of our own; no licence question | an .xlsx is a zip of XML: the browser's own `DecompressionStream('deflate-raw')` and `DOMParser` read the first two sheets and the shared strings; no new dependency on a page that opens keys | dates and formulas need care (Excel dates are numbers: convert from 1899-12-30); tested on made-up files from Excel, Numbers and Google Sheets |
| SheetJS, vendored | hundreds of KB (measure before choosing); Apache-2.0 community edition, current builds from its own CDN rather than npm | reads everything | a large third-party script on the page that holds the team's keys; one more thing to pin and review |
| CSV only | none | smallest | asks every person to "save as CSV" |

**Checks before anything is saved** (shown as a table of rows with a reason on each refused one; nothing is sent until the person presses "Add these N"):
- No email address or phone number in any cell (the page's own patterns, `contact` and `phone` in assets/crm-follow-ups.js): "Row 4: that looks like a phone number. Leave contact details out."
- Required cells present; category and channel from the lists; stage from Angelo's seven or Dinis's six (mapped); dates as `yyyy-mm-dd` or `dd/mm/yyyy`; owner and `by` a team id in data/team.json.
- LinkedIn only as `https://www.linkedin.com/…` (the page's `safe()`).
- At most 300 rows a file (one save stays far under the drain's 400,000-character limit in admin/tools/crm_followups.mjs).

**De-duplication** against the list as it is: the same LinkedIn page, or the same name (lower case, accents removed) and the same company, is a match. A match shows "Already on the list (owner silvio): skip, or add only the new actions". Same name with a different company shows "Possible duplicate" and asks. Rows inside one file are checked the same way.

**The 15 minutes:** download the template (a link on the page, made-up example rows included), fill it (10 minutes), upload, read the check table, press Add (2 minutes), see the rows at once as "yours, waiting to be filed", and everyone's within the hour (section 4).

## 4. Saving

**Today:** each change seals the **whole** list in the browser (assets/crm-seal.js), signs it and appends it to the drop box (vault 5xsk56gw, assets/crm-follow-ups.json). `crm_followups.mjs drain`, run only by conductor@web-summit.indi, files the newest save. Since 14 Nov it keeps a save made on another copy in the drop box as a CONFLICT, so it is not lost; but that person has to make the change again, and nothing is seen until the drain runs (none since 16 Nov).

**The fix: per-person, append-only events.**
- **Message:** `ws-followups-events-1` = `{v, path, env_json, signed}` as today, but `env_json` seals `{ "events": [ … ] }`, the changes since this browser's last save, not the list. Same audience, same recipient checks, same signature.
- **An event:** `{ "id": "e-<8 hex>", "at": "<iso>", "by": "<person>", "contact": "<id>", "kind": "add|edit|action|stage|owner|next|claim|release", …fields }`. `action` carries crm.action/1's fields.
- **Filing:** the drain appends each accepted message, still sealed, as one line to `actions/ws-follow-ups/<yyyy-mm>/<person>.jsonl` in the private CRM (one file per person a month: about 6 to 12 files a month, well under the 891 files at which WS-170 saw the app hang). Only that person's signed saves go into that file. The drain never opens anything, as now.
- **The page folds:** the base record (today's sealed list), then every log line it can open, sorted by `(at, id)`. Adds and actions only ever add. For a field (stage, owner, next step), the latest event wins **and** the row shows "changed by silvio 5 min after angelo" when two changes to the same field come within a day, so nobody is silently overruled.
- **Your own entries at once:** the browser keeps its sealed unfiled events (as it keeps the pending save today) and folds them in, marked "waiting to be filed".
- **Old saves:** the drain still files `ws-followups-save-1` whole-list saves as now, so a page in an old tab loses nothing. The new page writes only events.
- **Order matters:** the drain must understand `ws-followups-events-1` **before** the page sends it. Today's drain refuses an unknown message as "not a follow-up save" **and marks it processed**, so it would be dropped.

**Filing every hour: who, with what.**

| Option | Needs | For | Against |
|---|---|---|---|
| A. conductor@web-summit.indi drains hourly | Indi's go; it already holds the drop box's private half | no new key or token | quiet since 16 Nov; the reason for this project |
| **B. a filer of Angelo's (recommended)** | an SG/Send token from Dinis; the private CRM's key sealed to the filer; a new drop box made with `crm_followups.mjs lane`; an hourly wake | in Angelo's hands; the filer never opens the list (it only moves ciphertext and holds no record key) | four tier-3 steps; a session key dies with its session, so the filer is a long-lived desk session woken hourly, and a reclaimed container means a new key and a new seal |
| C. Dinis's crm agent (crm-dinis) drains | Dinis's go | already holds the vault | his time and priorities |

**Where B runs:** one long-lived cloud session holding its session key, the lane's private half (`~/.sg-send/lanes/`, never committed) and the token, woken every hour by a scheduled task into that same session. It runs `drain`, and writes one line a run (counts only) to its own state file. If it stops, the page says "last filed at …" from the newest log line, so the team sees it.

## 5. Views

| View | What | Phone (390 px) | Desktop |
|---|---|---|---|
| **Mine** (default) | owner is me, or in progress by me | one card a contact: name, company, stage chip, next step and date, "last touch 6 days ago by angelo", in-progress tag | a table: name, company, owner, stage, next step, due, last touch, in progress |
| **Due this week** | next date up to Sunday, late ones first, marked "late" in words | the same cards, grouped Late, Today, This week | the table, sorted by date |
| **By stage** | Angelo's seven, counts on each | one stage at a time, chips to switch (the category pills' pattern) | seven columns; the loop's three framed together |
| **Everyone** | all, sorted by last touch, oldest first | cards | the table |

- **A contact opened:** its log, newest first (who, when, channel, summary, notes), a one-line "Log an action" form (channel, date defaulting to today, summary, notes), stage, owner, next step and date, and "I'm on it" / "Done with it" (a `claim` lasts three days unless renewed, then lapses).
- **Category** stays as a filter on every view.
- **Who sees what:** the key gate as it is. Without a site key the page shows nothing. With a key in the list's audience (Dinis, Silvio, Angelo, Jose, Vicky, Indi), everything, per Angelo's decision of 13 Nov that the team may see all contacts (people/angelo/projects/crm-pipeline/STATE.md). A person outside the audience sees "the list is sealed to …", as today. Adding someone to the audience means a reseal: tier 3 for its holder.

## 6. Tier 3: questions for Angelo, with a recommendation

1. **Angelo's 35 in the drop box.** Ask Indi (or his conductor) to run `drain` once now, before any change. *Recommend:* yes, first; it needs no change to anything.
2. **Who files hourly.** *Recommend:* B, a filer of Angelo's; A only if Indi says his conductor will run hourly.
3. **For B, from Dinis:** an SG/Send access token for the filer, and the private CRM's key sealed to the filer's key. *Recommend:* one note from Angelo, drafted by the next step, sent by Angelo.
4. **The old drop box.** Retire it once it is empty, or let both drains run. *Recommend:* one drop box, the filer's; the page switches when assets/crm-follow-ups.json changes.
5. **Changing Indi's files** (the page, crm-seal.js, crm_followups.mjs, his README): covered by Angelo's word of 24 Nov; each commit `For: conductor@web-summit.indi` with an `Outside:` trailer. *Recommend:* also a one-line heads-up to Indi from Angelo.
6. **The vault layout:** a new folder `actions/ws-follow-ups/` in the private CRM. *Recommend:* ask Dinis in the same note; it changes none of his files.
7. **For Dinis's model, proposals only:** crm.action/1; email optional on crm.person/1; a LinkedIn link field; the team vault's `crm/stages.json` with Angelo's seven. *Recommend:* all four in the same note.
8. **The ask to the team** (the snapshot in 15 minutes): drafted with the template, sent by Angelo once step 6 below is live.
9. **Never:** contact details in this repository, nor in the list (names and roles only, as the page enforces).

## 7. Build plan (smallest useful first)

| # | Step | Files | Whose | Tested with | Undo |
|---|---|---|---|---|---|
| 0 | File the waiting saves (question 1) | none | Indi's conductor | `drain --dry`, then `drain` | nothing to undo |
| 1 | The event model and fold: event shapes, checks, fold, conflict notes, last touch, claim lapse | `assets/crm-follow-ups-model.js` (new; plain functions, no keys) and a test in this project's folder | ours, Outside: assets/ | node, made-up contacts and events; two people editing one field | delete the file |
| 2 | The drain reads `ws-followups-events-1` and files per-person logs; whole-list saves unchanged | admin/tools/crm_followups.mjs | Indi's | `--dry` and a temporary folder standing in for the vault, made-up signed messages from test keys | revert the commit |
| 3 | The page reads the logs and folds; new fields shown; read-only | assets/crm-follow-ups.js | Indi's | a local build with a made-up sealed record and logs | revert |
| 4 | Writing events: log an action, stage, owner, next step, claim; own unfiled entries shown | assets/crm-follow-ups.js | Indi's | made-up record; ships only after step 2 drains in production | revert; old saves still file |
| 5 | The views: mine, due this week, by stage, everyone; 390 px and desktop | assets/crm-follow-ups.js, the page's CSS | Indi's | Playwright screenshots at 390 px and 1280 px, made-up data | revert |
| 6 | Import: template, CSV, the small XLSX reader, checks, de-duplication | `assets/crm-follow-ups-import.js` (new), content/crm-follow-ups.md | ours / Indi's | made-up files from Excel, Numbers, Google Sheets; a file with a phone number and a duplicate | revert |
| 7 | The hourly filer (questions 2 to 4) | a new drop box in assets/crm-follow-ups.json | ours, after Angelo's go and Dinis's token | `drain --dry` hourly for a day, then live | point the file back at the old drop box |
| 8 | Load and check: Indi's 19 are the base; Angelo's 35 filed (step 0) or re-imported; Angelo reads and accepts | none | Angelo | done when, below | n/a |

The move script to Dinis's model (section 1's table, section 2's mapping) is written when his site is ready; it is not part of this bridge.

**Done when** (from BRIEF.md): a team member opens /crm/follow-ups/ with their key, uploads their spreadsheet, sees every contact with owner, stage, last touch and log, adds a log entry, and sees everyone's entries within an hour without clashing; Angelo's 35 and Indi's 19 are in it; Angelo has read and accepted it.
