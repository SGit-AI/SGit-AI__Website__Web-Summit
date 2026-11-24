---
title: "Joining Dinis's CRM tool: how our design completes it, the options and the pathways (s2)"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo)
written: 2026-11-24
for: Angelo, through followups-bridge.pm@PrompTugal.angelo
status: draft for Angelo's read
---
# Joining Dinis's CRM tool

## Summary (one screen)

- **His tool already does most of the six.** A log of actions per company, last touch, stages, next step with a date, a "Mine" view, CSV import and safe saving by several people are built and live. Missing: **"in progress by"**, **where we met / who met them**, a **notes** field on actions, **XLSX**, and a **team contacts vault** with its key holders.
- **The one blocker for our lists:** his import and his person record need an **email**. Angelo's 35 and Indi's 19 are names and roles only, so today their people would be skipped. They can still go in as companies with an action. Making email optional is a small change in his code.
- **Angelo's seven stages fit without code.** Each vault reads its own stage list, and a seventh stage ("call booked") is allowed, as long as "new" stays the first stage.
- **What s1 gives him:** the action fields (notes, channel names), the "in progress by" claim, the source fields, the de-duplication rules and the XLSX reader. These are about five small changes to his `crm.mjs` and `app.js`.
- **Recommendation:** go through his **Requests page and a.maestro** for the vault, the keys and the conditions (only Dinis decides those). In the same note, offer to make the five small changes ourselves on his `dev`, if he says yes. Do not fork.
- **What only Dinis decides:** the team contacts vault and who holds its key; security@'s four conditions (lawful basis, removal route, retention, key holders), which must be set before the first import; and whether our agents may push to his repository.

Sources, read 24 Nov 2026 between 16:40 and 17:00 UTC: `Site__Tool__CRM:` is SovereignWebsite/Site__Tool__CRM, branch dev, 998f815 (what https://crm.tool.sovereignweb.site/app/ serves). `Cell__Email:` is AgentiCCells/AgentiCCells__Cell__Email, branch work/crm.dev.a, 1236adb. `newsroom:` is PrompTugal/PrompTugal__News__Website at 98368c1. The app's code is the same in the first two (a sub-agent compared them byte for byte), so every line number below is in `Site__Tool__CRM:site/app/` unless marked. s1 is the spec on branch pool/followups-bridge-s1, file people/angelo/projects/followups-bridge/s1-spec/spec.md (5cfba0d).

## 1. His tool against Angelo's six needs (checked in the code)

| Need (BRIEF.md) | Today | Where |
|---|---|---|
| 1. Every contact in one place, with source and owner | **Partly.** A shared vault holds companies, people and leads. The owner is set per company, on the lead. There is no field for "who met them, where", and the log says "'Where we met' waits for a field" | crm.mjs:265-291; `Cell__Email:crm/notes/log.md` (16:32 entry) |
| 2. An append-only action log | **Built, with two gaps.** It uses `crm.action/1`, one file per action, with the fields id, org, person, kind (email, linkedin, call, meeting, message, note), direction, at, by, summary and logged_at. It has **no notes field**. Append-only holds by habit only: nothing in the code stops an edit or a delete | crm.mjs:330-350; vault.js (writeFiles) |
| 3. Last touch, "in progress by" | Last touch is **built**: it is worked out from mail and actions and shown on the board. "In progress by" is **absent** | crm.mjs:174-187; app.js:200 |
| 4. Stages, next step and date, views | Stages and next step are **built**. Each vault can have its own stage list in `crm/stages.json`. "Mine" is **built** (Today ?who=mine and the owner filter). "Due this week" is **partly** built, as Today's "soon" (due within 7 days). "By stage" is **built** (board order and counts). Sorting by last touch is **absent** | crm.mjs:16-23, 47, 59-67, 353-360, 497-522; app.js:185-192, 279-282 |
| 5. Bulk import with a template | **Built for CSV**, from the template `site/app/template.csv` with the columns at crm.mjs:424. Only `company` is required. It de-duplicates companies by domain, then by name, and people by email, and never changes an existing record. **There is no XLSX. A person with no email is skipped** | crm.mjs:424-492 (skip at :475) |
| 6. Several people saving, nothing lost | **Built.** It checks the vault has not changed since it was read; if it has, it merges, and it refuses on a real conflict ("conflicts: …"). Ids are random | vault.js:105-112; crm.mjs:261 |

**Records** (checkCrm, crm.mjs:56-97):
- `crm.org/1`: id, name, kind, added_by, added_at.
- `crm.person/1`: id, name, first, **emails[] (required, and must be valid)**, org.
- `crm.lead/1`: org, stage (from the vault's list), owner, next_step, next_step_due.
- `crm.link/1`: links a mail thread.
- `crm.action/1`: as in row 2 above.
- Also `crm.stages/1`, `crm.vault/1` and `crm.key/1`.

## 2. How our design completes it

| Gap | What s1 already worked out (s1 section) | Fits his records as | New work |
|---|---|---|---|
| Team contacts vault and key holders | The audience is the six. The key goes to each person's own key (s1 §5). Today all six have the private CRM key sealed to their site key: data/sealed/angelo/2026-11-05T1447Z-team-crm-key.json and data/person-keys.json | His way: each browser makes a key pair on the "You" page (me.js); the keeper seals the vault key to it with `Cell__Email:crm/tools/seal-for.mjs`, handed over as a QR. A new vault is made with `newVaultFiles` (crm.mjs:297) | No code. Dinis's decision (§6), then one seal per person |
| "In progress by" | A `claim` that lapses after three days unless renewed (s1 §5) | Two optional fields on `crm.lead/1`, `claimed_by` and `claimed_until`. Edits keep fields they don't know (`...old`, crm.mjs:360), so older pages lose nothing | His `leadEditFile` and a tag on the board and Today (app.js) |
| Notes on actions | Action fields with `notes` (s1 §1) | An optional `notes` field on `crm.action/1`. s1's `done_on` is his `at`; s1's channels map onto his kinds (in_person becomes meeting) | crm.mjs:330-350, and one textarea in the action form |
| XLSX import | A small XLSX reader of our own, about 150 lines, using the browser's DecompressionStream and DOMParser. No new library on a page that holds keys (s1 §3) | It turns an .xlsx into the same rows his CSV import already takes | One new file in site/app/, plus a button |
| Source, who met them | `met_by`, `met_where`, `met_on`; these become the first action (s1 §1) | **No new field needed:** a first `crm.action/1` with kind `meeting`, by the person who met them, at the date met, and the place in the summary. Two optional import columns, `met_where` and `met_by`, write it | The import columns (crm.mjs:424 onwards) |
| Append-only log | Per-person, append-only events (s1 §4) | His merge already stops overwrites. What is left is a rule: actions are never edited, only added. That is a check in his write path, or simply the team's practice | Optional: refuse an edit to `crm/actions/*` in vault.js |
| Several people saving | s1's fold of events | **Not needed:** his merge-or-refuse does it (vault.js:105-112) | None; s1 §4 is dropped |
| Views | Mine, due this week, by stage, everyone; cards at 390 px (s1 §5) | Mine and by stage exist. "Due this week" becomes a Sunday cut-off on Today's "soon" (crm.mjs:498-508). "Last touch, oldest first" becomes a sort on the board | Two small changes in app.js |
| Email required | s1 keeps contact details out; it asked for email to be optional (s1 §6, q7) | **Option 1 (needs code):** `emails` optional on `crm.person/1` (crm.mjs:283-291, :475). **Option 2 (no code):** import only the company and a first action, and keep the person's name and role in the action's summary | Option 1 is one check and one import rule. This decides whether people go in at all |
| security@'s condition 4 | s1's privacy rules: no email or phone unless the team decides otherwise | `Cell__Email:crm/notes/log.md` (12:30): a person supplies and enters the contacts; no scraping or guessing; contacts stay only in the vault; Dinis sets lawful basis, removal route, retention and key holders before the first import. None of the four is in the code | Words, not code: Dinis's (§6). A one-line "why we hold this" could go in the vault's manifest |

The stage map goes in the team vault's `crm/stages.json`, so no code is needed. A lead's stage only has to be one of that vault's ids (crm.mjs:59-67, :355), and "new" must stay, because it is the default stage (crm.mjs:200, :265). The "Our work" vault already uses its own names in this way (`Cell__Email:crm/notes/log.md`, 16:03).

| Angelo's seven | id in the team vault |
|---|---|
| to contact | new |
| to follow up | contacted |
| in conversation | talking |
| call booked | call_booked (an extra id) |
| proposal | proposal |
| won | won |
| parked | parked |

## 3. What a team can change, and what needs code

| Change | How | Sync with his tool later |
|---|---|---|
| Stage list and names, per vault | Without code: the `crm/stages.json` file in the vault. There is no screen for it, so whoever holds the vault's key writes it once | Easy: it is his own format |
| Vault name, owners, each company's kind | Without code: from the app | Easy |
| Extra fields (claim, notes, met_where) | Needs his code to show them. Edits already keep them (crm.mjs:360) | Easy if he takes them; if not, they are kept but hidden |
| Views (due this week, sort by last touch) | His app.js | Easy if made on his dev; drifts if made in a copy |
| Brand, style | style.css and brand/ belong to a.crm.design (his designer agent); five designs are waiting for Dinis to choose | Leave it to him |
| Import columns, XLSX | His crm.mjs and a new reader file | Easy on his dev |
| Our own copy of the site | Everything is possible | **Hard:** two apps drift within days; his log shows several releases a day |

## 4. Pathways

| | A. Ask his agents | B. We make the changes on his dev | C. Our own layer or copy |
|---|---|---|---|
| How | Requests page (`Site__Tool__CRM:site/app/send/`, sealed to the keeper, filed in `Cell__Email:crm/notes/requests.md`), or through a.maestro (`newsroom:board/team/maestros/from-a.md` is a.maestro's own file, so we cannot write there) | Push small, signed commits to `Site__Tool__CRM` dev under its CLAUDE.md ("Push to dev only, never main. Sign every commit with your own published key") | A copy, or our own page, built on his model |
| Speed | Hours to a day per item. His keeper is busy with the Outbox and design rounds (log 16:05 to 16:32) | Fastest for the five small changes, once he agrees | Slow to start; drifts after that |
| Depends on | Dinis and crm.dev.a | Dinis's yes; our agent's key published where his checks trust it | Nobody at first, then a migration |
| Needs from Angelo (tier 3) | Sending the note; a "You" key in his own browser | His go to work in Dinis's repository; a signing key for that agent | His go to build apart from Dinis, against his word of 24 Nov ("join efforts") |
| Drift risk | None | Low: the changes are in his files, and he reviews them | High |

**Recommendation:** A for what only Dinis decides (the vault, keys and conditions), and B, offered in the same note, for the five small changes. No C.

## 5. Getting the six on, step by step

1. **Angelo first (about 10 min):** open https://crm.tool.sovereignweb.site/app/. It starts in the synthetic demo (app.js:47-62). On the "You" page, make a browser key and show its QR to Dinis. Dinis seals the team vault's key to it, and Angelo opens the vault. Note that `newsroom:board/team/maestros/from-a.md` (12:10Z) says "Still held: Angelo's access (Dinis's direct word)", so this step waits on Dinis.
2. **The team vault (Dinis):** made with Angelo's seven in `crm/stages.json`, with the four conditions written down, and sealed to the six. The RiskMandate CRM vault cannot be used: Dinis said only he and a.maestro hold its key, "nobody else" (log 13:11). The "Our work" vault tracks Dinis's own team work, not contacts.
3. **Loading Angelo's 35 and Indi's 19:** these are tier 3 to reach (see §6). Angelo's 35 are probably in the drop box, or still in his own browser (assets/crm-follow-ups.js keeps an unfiled save, `ws-fu-pending`). Indi's 19 are in the private CRM's sealed list. Whoever holds them fills the CSV template **on their own machine**. The file is never committed and never sent through a chat or a repository; it is uploaded in the browser only. Without the email change, use rows with only `company` and the `last_contact_*` columns, and put the person's name and role in the summary.
4. **Each person, about 15 minutes:**
   - Open the app and make their key (2 minutes).
   - Show the QR to whoever seals (Dinis or his keeper), then open the vault (3 minutes).
   - Download template.csv and fill in their contacts, with the owner and a first action (7 minutes).
   - Import, and read the summary of what was added and what was skipped (2 minutes).
   - Check "Mine" (1 minute).
   - From then on: log each action, and move the stage.

## 6. Tier 3: questions for Angelo, with a recommendation

1. **Send the note to Dinis below?** *Recommend:* yes, as written or shortened.
2. **Join pathway B, so our agent pushes to Dinis's `Site__Tool__CRM` dev, if he agrees?** It needs a key for that agent, published where his checks trust it. *Recommend:* yes, once he says yes, for the five changes only.
3. **Make your own "You" key in his app and hand its QR to Dinis?** *Recommend:* yes, as the first step.
4. **Get your 35 and Indi's 19 out of the drop box or the private CRM into a private CSV?** The fastest way is your own browser's unfiled save; the alternative is asking Indi. *Recommend:* try your browser first.
5. **Emails:** ask Dinis to make email optional, or load the lists without people? *Recommend:* ask; load companies and actions meanwhile.
6. **Close /crm/follow-ups/** once the 54 are in his tool, with a line pointing to the new tool? *Recommend:* yes, after the load is checked.

**Draft note from Angelo to Dinis** (for Angelo to send; nothing is sent by an agent):

> Dinis, I'd like the team to use your CRM tool for Web Summit follow-ups now, rather than build anything of our own. Three things only you can decide:
> 1. A team contacts vault for the six of us (you, Silvio, Jose, Vicky, Indi and me), and who holds its key. Can it have our seven stages in its stages.json?
> 2. security@'s four conditions for it: lawful basis, removal route, retention, key holders. Tell me what you want written, and I'll draft it.
> 3. Can my agents make five small changes on your dev, signed and reviewed by your keeper? They are: email optional on a person, notes on an action, "in progress by" on a lead, where-we-met in the import, and an XLSX reader. Or would you rather your keeper did them?
> Once the vault exists, I'll load my 35 and Indi's 19, and each of us can do the rest in about 15 minutes.

## Done when

- Angelo has read this plan and decided §6.
- The six can open one team vault, and Angelo's 35 and Indi's 19 are in it.
- Each person can log an action and see everyone's within the hour.
