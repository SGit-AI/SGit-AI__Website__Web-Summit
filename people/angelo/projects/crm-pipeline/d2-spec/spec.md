---
title: "crm-pipeline-d2: the client pipeline on the private CRM, spec (B with A's board)"
by: bravo.large.worker@PrompTugal.angelo (role spec), for crm-pipeline.pm@PrompTugal.angelo
written: 2026-11-13
for: Angelo's read
issue: WS-170
status: ready for Angelo's read
---
# The client pipeline: spec

**In one screen.** The pipeline is a **Pipeline tab inside the private CRM vault's own app** (B), drawn as A's board: stage columns with the loop on desktop, my list by due date on a phone, the ten-second add, the record with its history. Every change is **one event line** appended by **one writer agent, crm@PrompTugal.angelo**, into a **monthly log file per writer**, and a derived **pipeline/index.json** the app reads in one go. After a year that is about 30 files, not about 4,000, so the vault host's slow start (WS-170) is not made worse. Browsers and other people's agents never write the vault directly: they **drop a sealed request** for the writer, the same answer for agents now and browsers later. Indi's 19 follow-ups are the first import, with Indi's and Dinis's yes.

Sources (all material): the design, people/angelo/projects/crm-pipeline/d1-design/design.md (on pool/crm-pipeline-d1); the project's BRIEF.md and STATE.md (here); board/WS-170-the-team-crm.md; board/WS-189-the-summit-desk-writes-to-the-private-crm.md; board/WS-217-the-follow-up-list-in-the-private-crm.md (on dev); admin/tools/crm.mjs; admin/tools/crm_app.html.tpl; assets/crm-mail.js.

## Angelo's decisions (quoted, not improved)

- The pick: "B with A's board, go ahead".
- Contacts: "Those who'll have access to the vault are only the members of the team and they are allowed to see the contacts because we're all part of this work."
- The plan: "Yes, go ahead" (nobody reads or writes the vault before this spec; then one agent with its own access token, asked of Dinis through Angelo, writes).

## 1. The vault layout

d1 proposed one folder per company with one file per event. That is right as a model and wrong as storage for this host: WS-170 measured the public vault's app stuck on "Reading vault..." for over two minutes at **891 files in about 570 folders** (5 November). The private vault had 349 graph nodes on 13 November (people/indi/followups/filed-2026-11-13.md, on dev).

**File count after a year** (estimate, no measurement possible without reading the vault, which is tier 3):

| Assumption | Value |
|---|---|
| Companies entering the pipeline | about 300 (Indi's 19 on day one; Silvio's 50 ranked companies in people/silvio/outreach/; the stand) |
| Events per company in a year | about 12 (add, a few stage moves, follow-ups, notes) |
| d1's layout (folder + record.json + events/ + one file per event) | about 300 + 300 + 300 + 3,600 = **4,500 files and folders**, five times the hang |
| This spec's layout (below) | about 12 logs per writer + 1 index + 1 schema = **about 15 to 40 files** |

**Recommended layout** (in ws-team-crm-private only, never in this repository):

```
pipeline/README.md                      what this folder is, written once
pipeline/log/<yyyy-mm>/<writer>.jsonl   append-only, one line per event; only <writer> ever writes this file
pipeline/index.json                     derived: one row per company, rebuilt by the writer after each append
contacts/<slug>/contact.json            existing CRM layout; the writer adds "consent" and links, never a second copy
companies/<slug>/company.json           existing; the pipeline links to it
```

**An event line** (about 250 bytes):

```
{"v":1,"id":"<writer>-<yyyymmddThhmmssZ>-<n>","at":"<iso>","by":"<person id>","via":"<agent name or browser>",
 "company":"<slug>","kind":"<kind>", ...fields of that kind}
```

| kind | fields | folds to |
|---|---|---|
| created | name (of the company), contact (contacts/ slug, optional), stage, owner, due, what, source (stand, meeting, list) | a new row |
| stage | from, to | stage |
| owner | to | owner |
| followup | due, what | due, next |
| done | (the current follow-up) | clears due and next |
| snooze | due | due |
| note | text | history only |
| consent | contact, given, how | on the contact |
| redact | target (event id or contact), reason | see section 5 |

**Stages:** to_contact, to_follow_up, in_conversation, call_booked (the loop), proposal, won, parked. Any move is allowed; leaving won or parked is shown in history as "reopened". The loop is a drawing, not a rule.

**How state folds:** read every log, sort by (at, id), apply in order; the last event of each kind wins. The writer refuses a "stage" event whose `from` is not the current stage (a stale change) and answers the asker.

**Two writers at once:** they never touch the same file, because each writer owns its own log file. A vault push from two writers at once changes different files and merges; the index is the one shared file, and it is derived, so a clash on it is settled by rebuilding it from the logs. With one writer (the plan), there is no second writer at all until Dinis says so.

**Who rebuilds the index, and when:** the writer, after each append, in the same push. `crm.mjs derive` (Dinis's) can later add one graph node per pipeline row, so the CRM's search finds them (a question for Dinis, below).

## 2. The app (B with A's board)

**Where:** admin/tools/crm_app.html.tpl builds the private vault's app (`crm.mjs app private`). It already loads a separate module for one tab: the Mail tab mounts `window.WSCrmMail` from assets/crm-mail.js. The pipeline follows the same pattern, so the template changes by a few lines only:

- crm_app.html.tpl: one more entry in `TYPES` (Pipeline, shown when pipeline/index.json exists), a `<section id="pipeline">` and a `pipelineMode()` like `mailMode()`; the Pipeline tab first for the private vault, as Mail is today.
- A new module, `assets/crm-pipeline.js` (new): `WSCrmPipeline.mount(root, { readText })`, reading pipeline/index.json at once and a month's log only when a record's history is opened. Inlined into the app by `crm.mjs app` the way crm-mail.js is (Dinis's build: tier 3).

**Screens** (d1's components, B's palette: the app's own `--green`, `--line`, `--card` tokens; no new palette):

| Screen | Phone (up to 760 px, the app's breakpoint) | Desktop |
|---|---|---|
| Board | my list by due date: Late, Today, Next; mine by default, "everyone" one tap | one column per stage; the loop's three columns in one dashed frame with a return arrow; won and parked as ends |
| Add | a sheet: company (match against companies/ and the index: "Silvio is already on this"), stage chips, owner (me), follow-up quick picks (tomorrow, Monday, a week), note, consent | the same, as a dialog |
| Record | full screen: stage strip, next step with Done and Snooze, Move to, contact and consent, history | a side panel beside the board |

Components: stage chip, due chip (in words, not colour only), owner tag (first name), card, loop frame, my-day list, add sheet, record panel. 44 px targets. Every value from the vault reaches the page as text (the app's rule today).

**Writing from the app:** until section 3's drop box exists, Add, Move, Done and Snooze build the request and show "sent to the writer" only when a drop exists; before that, the tab is read-only and the add shows "ask your agent". No token in a browser.

**Speed:** the tab reads one file (index.json: about 300 rows of about 200 bytes, about 60 KB) and a month's log on demand (about 300 lines, about 75 KB). The host's start time depends on the vault's total file count; this layout adds about 30 files a year. **Measure before d3 ships:** load time of the private app today and after the import (the writer reports both); if over ten seconds, propose to Dinis compacting the oldest logs into `pipeline/log/<yyyy>.jsonl`.

## 3. The writer

| Option | For | Against |
|---|---|---|
| **crm@PrompTugal.angelo (recommended)** | already Angelo's CRM agent (people/angelo/meetings/README.md, steps 2 and 4); already holds the private vault key (data/sealed/agents/crm@web-summit.angelo/); a token for crm-angelo already asked of Dinis (WS-170, 5 November) | it serves Angelo's meetings too; one agent for two jobs |
| a new pipeline@PrompTugal.angelo | one job, clean lane | a new key, a new seal of the vault key, a new token ask: three tier-3 steps more |

**The tool** (new, in people/angelo/tools/, Angelo's lane, about 200 lines): `pipeline.mjs append <event.json>` (validate the kind and fields, refuse a stale `from`, append to this month's log), `pipeline.mjs index` (fold, write pipeline/index.json), `pipeline.mjs apply <drop>` (open a sealed request, then append and index), each ending with one `sgit push` using the writer's own `SG_SEND_ACCESS_TOKEN` from its environment, as admin/tools/crm.mjs `push()` does. Tested first against a scratch copy with made-up data only.

**How a team member asks (one answer for agents now and browsers later):** a **drop**: a request (one event, as above) **sealed to the writer's key** (ws-crm-env-1, as `crm.mjs seal --agents` makes) and left where the writer reads it.

- **Their own agent** (each person's conductor or crm@ already holds the vault key): seals the request and commits the sealed file to the writer's inbox lane. Only ciphertext enters this repository. Never a plain request in a commit: this repository is public.
- **Angelo's meetings workflow, step 4:** crm@ is the writer, so it appends directly.
- **A browser, later** (WS-189 q4, WS-217's drop box): the app seals the same request to the writer's public key in the browser (no token in the browser) and appends it to the writer's append lane, as the feedback lanes do (WS-114). WS-119's warning applies: a lane anyone can append to needs a signature check, so the writer applies only a request signed by a person key in data/person-keys.json or an agent key in data/keys.json.

**Session keys die with the session** (CLAUDE.md): when the writer's key changes, drops sealed to the old key cannot be opened. So the writer publishes its current key on the keys page before taking drops, and senders read it from there each time.

## 4. The first import: Indi's 19

What exists (WS-217, on dev): one sealed record, `actions/2026-11-13-ws-follow-ups.sealed.json` in the private vault, sealed to Dinis, Silvio, Angelo, Jose, Vicky, Indi and crm-dinis; each contact with name, public role, connected, category, stage (all "to follow up"), owner, followed up, note, a LinkedIn profile; the page content/crm-follow-ups.md with assets/crm-follow-ups.js (on dev), owned by followups@web-summit.indi.

**The tension:** Indi's record seals each contact; Angelo's decision says the vault key is enough. Both protect the same people from the same outsiders; the difference is that sealing also hides the list from vault-key holders outside its audience (agents such as inbox@ and dev@ of other people). Reconciled this way, only with Indi's and Dinis's yes:

1. Indi's agent (followups@ or conductor@web-summit.indi) reseals the record to add the writer (`crm.mjs reseal --agents crm-angelo`). Nobody else opens it.
2. The writer turns each contact into a `created` event (stage to_follow_up, owner as listed, category as a note) and a contacts/ entry with consent "connected at Web Summit, consent to follow up not recorded" until the owner records it.
3. The page /crm/follow-ups/ points to the Pipeline tab; Indi's agent retires it (her files, her call); the sealed record is removed from the vault head once Indi agrees.

If Indi wants the list to stay sealed, the alternative is: the pipeline keeps only company, stage, owner and due for those rows, and the contact stays in her sealed record. Recommendation: the reseal, since it is the team's shared list by Angelo's decision; but it is Indi's to agree.

## 5. Security and privacy

- **Who reads, plainly:** everyone who holds the private vault key. From the file names in data/sealed/: the six people (dinis, angelo, silvio, jose, vicky, indi), their conductors, and CRM agents (crm@ of Angelo, Dinis, Jose, Silvio); possibly other agents of theirs (data/sealed/agents/ lists inbox@, dev@ and vault@ agents too; which hold this key is Dinis's to confirm). "The team" therefore includes the team's agents. The proposal to the team should say so.
- **Who writes:** the writer only, with its own SG/Send access token, held in its own cloud environment (people/angelo/kit/README.md, "one cloud environment per agent"). Never a person's token.
- **Consent:** every contact carries `consent` (given, how, when, by whom); the add asks for it; nothing beyond name, role and company is kept until it is given.
- **Deletion:** a `redact` event alone is not deletion, it only hides. Deletion is: remove contacts/<slug>/; rewrite that contact's lines in the month logs with the text replaced by "[removed]" (the one allowed edit, done by the writer, recorded by the redact event); rebuild the index. **The vault's history still holds the old files.** Removing them from history needs Dinis's answer (d1's question 4): a purge if sgit has one, otherwise moving the current tree to a fresh vault with a new key and retiring the old one. Until then, the honest promise is "removed from what the team sees, not from the vault's history".
- **Nothing in this repository:** no contact, note or screenshot; only made-up data in tests and mocks; drops committed only sealed.

## 6. Build steps (smallest useful first)

| # | Role, size | Files | Done when |
|---|---|---|---|
| 1 | build, small | people/angelo/tools/pipeline.mjs (new), a made-up test log | append, index and apply pass on made-up data; no vault touched |
| 2 | build, large | assets/crm-pipeline.js (new); a static preview fed by made-up data | board, phone list and record render at 390 and 1280 px; read-only |
| 3 | build, small, after Dinis's go | admin/tools/crm_app.html.tpl (the tab, a few lines), admin/tools/crm.mjs (inline the module), under the five steps, For: conductor@web-summit.dinis | `crm.mjs app private` builds; the tab shows "no pipeline yet" |
| 4 | writer run, after the token | the vault: pipeline/README.md, the first log, index.json | the writer's first push; app load time measured before and after |
| 5 | writer run, after Indi's yes | the vault: the 19 as events | the board shows 19 rows; Indi's page retired by her agent |
| 6 | build, large, after Dinis's drop-box answer | assets/crm-pipeline.js (add, move, done, snooze as sealed drops); pipeline.mjs apply | a made-up drop from a browser lands as one event |
| 7 | check, large | none (a cold reader) | the spec's "how we know" below holds |

**How we know it works:** a team member adds a made-up company in ten seconds on a phone and sees it on the board after the writer's run; the board shows every company's stage and owner and what is late; the app opens in under ten seconds; the gate prints OK; git log of this repository shows no contact.

## Tier 3: questions, not actions (for the lead, then Angelo)

1. **Dinis's go** to add the Pipeline tab to crm_app.html.tpl and crm.mjs (his files, the five steps). Recommend: ask, with proposal-dinis.md.
2. **A token** for the writer (crm-angelo, asked 5 November; the ask renewed). Recommend: crm@PrompTugal.angelo as the writer.
3. **Browser writing:** Dinis's answer to WS-189 q4 and WS-217's drop box; one answer for both. Recommend: the sealed, signed drop above.
4. **Indi's import:** Angelo's go to ask Indi (through her agent, For: followups@web-summit.indi) to reseal to the writer. Recommend: yes, after Dinis's go.
5. **Deletion from history:** Dinis's answer (purge or fresh vault). Recommend: ask now, promise only what is true until then.
6. **Who holds the vault key:** Dinis to confirm the list in section 5, so the proposal to the team says it exactly.
