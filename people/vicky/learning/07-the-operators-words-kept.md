# The operator's words, kept

**The question:** Dinis gives his team its direction mostly by talking, in voice memos and chat. How do his words reach 26 agents who wake hours later with no memory of the conversation, and how does that compare with Vicky's rules given in chat?

**Short answer:** Dinis talks to one agent, his conductor. The conductor writes his words down close to word for word, one file per topic, in `board/guidance/`, and adds a line to a "New from Dinis" table, newest first. Every agent reads that table at every wake. The verbatim record is the source: where an agent's reading of his words and the words themselves disagree, the words win.

Vicky's rules end up in three places: `decisions.md`, each agent's own prompts file, and the inbox page. Most of them were given in each agent's own chat window. So a rule can be known to one agent only until the conductor turns it into a standing answer. Standing answer 14 ("single-window routing", 7 November) already moves her toward Dinis's shape.

By scout@web-summit.vicky, 7 November 2026, 22:20 UTC (scheduled run). Sources:

- in the newsroom (PrompTugal/PrompTugal__News__Website, dev, v0.1.645): `board/guidance/README.md` and its 20 files, among them `2026-11-06-budgets-capture-not-block.md` and `2026-11-06-feedback-reading-and-vicky.md`; `board/guidance/memos/2026-11-06-the-night-memos.md`; `board/guidance/2026-11-06-the-ideas-ledger.md`; `CLAUDE.md` ("Hourly runs");
- on the team site (dev, v0.2.1148): `people/vicky/decisions.md`, `people/vicky/inbox.md`, `people/vicky/prompts/*.md`.

The mentor has not answered Q4 to Q6 on this topic; its latest note to Vicky is from 4 November.

---

## 1. What Dinis's agents do, and why it works

### One listener, one folder

- **Dinis speaks to the conductor,** in its session, usually as dictated voice memos.
- **The conductor keeps his words in `board/guidance/`,** one file per piece, named `<date>-<topic>.md`. Each file starts with:
  - the source, for example "Dinis in the conductor's session (spoken, transcribed; the message ends mid-sentence at 'And')";
  - who keeps it;
  - his words in quotation marks, close to word for word;
  - and then, separately, "What follows for the team".
- **The rule in CLAUDE.md:** every agent reads this folder at each wake and works to it. "Guidance is his word; what agents write about it elsewhere is not."

### "New from Dinis", read first

The README opens with a table: "New from Dinis (read first at every wake; newest first)". Each row has the UTC time, the point in one bold line and the file it lives in. The table has 17 rows, all from 6 November, from 10:10 (budgets never block) to 22:55 (the same width on every page). An agent waking at 23:00 reads the top rows and knows what changed since its last wake without opening 20 files.

### The verbatim record, and readings of it

- **Every memo of the night, verbatim.** On Dinis's word ("an in depth review of all the voice memos I gave you last night ... so we don't miss ideas"), the conductor saved every message he typed or dictated that night in `board/guidance/memos/2026-11-06-the-night-memos.md`. Only contact details were left out, and the file says so. Its first line: "These are Dinis's words, as he gave them. They are the source; the guidance files and the ideas ledger are readings of them. Where a reading and this file disagree, this file wins."
- **An ideas ledger.** The 494 ideas in those memos and the 18:00 stand-up, one row each, with when, where captured, status and owner (`2026-11-06-the-ideas-ledger.md`). An idea he mentioned once at 03:00 has an owner, so it is not lost.

### How a later word overrides an earlier one

The newer file says what it replaces, in the same voice. "Budgets: capture and adjust, do not block" (10:10) quotes him ("we really shouldn't be blocking agents due to budget restrictions") and then states what follows: an agent over its line keeps working, and the release script does not refuse a push for budget. The older budgets text still stands as history. The newest row in the table is what an agent reads first.

### Why it works

- **An agent hours later builds what he said, not what someone remembered.** The first-night debrief names this as a lesson: "Everything in Dinis's words, kept ... is why agents waking hours later, with no memory of the call, still build what he asked for."
- **One listener means one record.** The 26 agents never have to compare notes on what Dinis said to each of them.
- **Quotes separate his words from the reading of them,** so a reviewer can tell an agent's interpretation from his instruction.

### Seen while reading: Vicky's publishing is recorded on Dinis's side

`2026-11-06-feedback-reading-and-vicky.md` (about 12:00 UTC, 6 November) quotes Dinis: "Great, and that is ok what Vicky did." It follows that Vicky's `@PrompTugal.vicky` agents may publish on PrompTugal.news, and that the gate keeps accepting any active key in `board/keys.json`. That is the condition P7 was held for: the reviewer's permission recorded in the newsroom's own record. The permission was recorded at 12:00 on 6 November, minutes after my note 01 went out. My notes did not catch it until tonight.

---

## 2. How Vicky's agents do it today

- **`decisions.md` is the shared rule book,** read at the start of every run: when to decide alone, when to ask, 18 standing answers (dated, "Vicky's words") and "Updates for agents". The conductor keeps it, guarded.
- **Each agent's prompts file** (`people/vicky/prompts/<short name>.md`, 19 files) keeps that agent's startup prompt and the standing rules Vicky gave it in chat, word for word. Since P2 every agent re-reads its own file each run, and since SA16 each file carries P1 to P3.
- **`inbox.md`** tells people and agents whom to write to.

### Where it differs from Dinis's

- **Vicky talks to many windows.** A rule she gives the reviewer lives in the reviewer's prompts file. Other agents learn it only when the conductor turns it into a standing answer. Several standing answers began that way, as one agent's question that turned out to be several agents' question. Standing answer 14 (7 November) now routes routine answers and rule updates through the conductor's window. That is Dinis's "one listener", adopted for briefs.
- **Standing answers are readings, not always quotes.** Most say "Vicky's words", but several are summaries in the conductor's voice, for example SA14 and SA17. There is no file of her words as given that would win when a summary and the words differ.
- **No "new since your last run" view.** An agent reads all of `decisions.md` (114 lines) every run, and "Updates for agents" tracks confirmations, not what is new since a given time.
- **No ideas ledger.** An idea Vicky mentions in passing is kept only if the agent she said it to writes it down.

---

## 3. Proposals

Numbered after note 06. Each is ready to paste into "Updates for agents", or marked for Vicky where it is her decision.

**P28. "New from Vicky" at the top of decisions.md.** *For: conductor@web-summit.vicky.*
> Keep a short table at the top of `people/vicky/decisions.md`: "New from Vicky (newest first)": the UTC time, the point in one line, and where it lives (a standing answer, an update, a prompts file). Add a row whenever Vicky gives a new rule or answer, in any window you learn of; keep the last 48 hours. Agents: read this table first at every run.

Cost: a few hundred tokens per new rule for the conductor. For each agent, the table is small and replaces nothing. Benefit: an agent waking at 20:00 sees what changed since 08:00 in ten lines, as Dinis's agents do.

**P29. Pass on a rule that other agents need too.** *For: every agent of Vicky's.*
> When Vicky gives you, in your own window, a rule or answer that other agents of hers would need too, add it to your report For: conductor@web-summit.vicky with her words in quotes and the time, so the conductor can make it a standing answer. Leave out private names (P27).

Cost: a line in a report, now and then. Benefit: a rule given in one window reaches the others within a day. Today that depends on Vicky repeating herself or the conductor noticing.

**P30. Keep Vicky's standing words as she gave them.** *For: Vicky (her decision), then the conductor.*
> When Vicky gives a standing rule to the conductor, the conductor saves her words as given, with the time, in `people/vicky/words/<date>.md` (public material only: no private names, nothing from a vault), and the standing answer links to them. Where a standing answer and her words disagree, her words win.

Cost: small, only on new rules. A tension to decide first: P27 (accepted) says not to copy any prompt into a public file, except each agent's prompts file at Vicky's word. This would be a second exception, for her rules only and only if she says yes. Benefit: the same as Dinis's verbatim memos. A summary can be checked against what she said, and an idea said once is not lost.

Not proposed: an ideas ledger like Dinis's 494 rows. It came from one night of long voice memos. Vicky's rules come in shorter messages that the standing answers already capture. P30 would make one possible later if she wants it.
