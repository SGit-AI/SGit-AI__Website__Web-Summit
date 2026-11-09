# Brief: Jose's own command centre, with a Mission view

Agreed with Jose on 4 November 2026. Written by `designer@web-summit.jose` for `dev@web-summit.jose`, who builds it. The one brief, as of now; its history is in git. It follows the pattern of Angelo's own app (`people/angelo/app/BRIEF.md`).

## Purpose and limits

- **An app of Jose's own in `people/jose/app/`:** its own `data.mjs`, `app.js` and `app.css`, which `admin/build/build.mjs` uses for Jose's page in place of the shared ones, as it does for Silvio and Angelo. **Nothing outside `people/jose/` changes, and nobody else's page is touched.** Jose's words: "I don't want to change others."
- **Extend the shared command centre, never copy it.**
  - `data.mjs` imports `admin/build/commandcentre.mjs`, keeps everything it returns and adds to it.
  - `app.js` loads the shared front end (`assets/cc/app.js`) and adds one view beside the shared ones.
  - `app.css` imports the shared stylesheet (`@import url('../../../assets/cc/app.css')`) and adds only the view's styles.

  So every fix to the shared app still reaches Jose's, and the switcher row, the other views, Ask Claude and the theme stay as they are.
- **A command centre like Angelo's** (Jose, 5 November): the shared app, plus **Mission** (`#mission`, Jose's own, the first view) and Angelo's three views, **Kanban**, **Team and the machine** and **Summit days** (slices 7 to 9). The shared views stay in the menu; the classic dashboard (`/people/jose/`) is untouched.
- **What Jose asked to fix**, from his live page on 4 November:
  - his agents are wrong: the conductor and designer are missing, the never-run ones are listed, and there are no schedules;
  - there are too many numbers ("36 open · 32 due within 72 h") and too little signal;
  - there is no view of what needs him now.
- **Phone first:** Jose reads it on his phone. Every tap target at least 44 px, motion under 200 ms and none under reduced motion.
- **Public by design:** everything comes from public files in the repository. No contact details, numbers or keys. Anything derived is labelled.

## The reference

The rules are already written and tested, next to this brief. Copy, import or rewrite them; the brief says what is meant.

| File | What it is |
|---|---|
| [`model.js`](model.js) | The rules as pure functions: `parseDue`, `cronTimes`, `slots`, `health`, `model` (the whole view's state against `now`), `openBoard` (slice 7's preset). A classic script: runs in a browser (`window.JoseCC`) and in node. |
| [`check.mjs`](check.mjs) | 88 golden checks: every `due:` form on the board, the crons, health edge cases, and the four states of the screenshots. `node people/jose/design/mission/check.mjs` must print `OK`. |
| [`fixture.json`](fixture.json), [`scenarios.js`](scenarios.js) | The real data at 3 November 02:00 UTC, and the four states built from it, each change named. |
| [Phone, all clear](preview-all-clear-phone.jpg) · [phone, overdue and quiet](preview-overdue-quiet-phone.jpg) · [desktop, overdue and quiet](preview-overdue-quiet-desktop.jpg) | The layout and the rules as Jose picked them. **The colours here are the preview's, not the build's:** the view uses the shared tokens (see "The look"). |

## Slices (each released and usable on its own)

| # | Slice | Depends on |
|---|---|---|
| 0 | Jose's own app, working the same as today: the shared app extended, not copied; the gate green | none |
| 1 | Jose's agents corrected, in the shared views too | 0 |
| 2 | The Mission view, read-only: attention line, three counts, needs me now, the machinery, brief, mentor, opening night | 1 |
| 3 | Agent health and run ticks in Mission, redrawn on the clock; the stale warning | 1, 2 |
| 4 | New since I last looked | 2 |
| 5 | Decisions in `config.json`, with a status | 2 |
| 6 | Mission as the first view (Jose's decision: from slice 3 on) | 3 |
| 7 | Kanban, from Angelo's, with Jose's "open issues" layout | 0 |
| 8 | Team and the machine, from Angelo's | 0 |
| 9 | Summit days, from Angelo's | 0 |
| later | Messages to Jose's conductor, card moves, the map: as in Angelo's brief | Jose's person key and a lane for his conductor |

### 0. Jose's own app, working the same as today

- `people/jose/app/data.mjs`: `build(root, person, now)` returns `CC.build(root, person, now)` unchanged; `summaryMd(d, now)` returns `CC.summaryMd(d, now)`. Export `frontMatter` and `dueAt` from the shared module, as Angelo's does.
- `app.js` loads `../../../assets/cc/app.js`; `app.css` is the shared `@import`.
- **Done when** Jose's page looks and works exactly as before, the gate prints OK, and nobody else's `data.json` changes. To check: build before and after, then diff every other person's `data.json`.

### 1. Jose's agents, corrected (on Jose's page only)

Today the shared list is `data/team.json`'s agents plus the dashboard agent, so Jose's page shows automation, dev, helper and dashboard, and no schedules.

- **Sources, in order:** `people/jose/agents.json` (kept by Jose's conductor); any `<name>@web-summit.jose` that committed in the last 7 days (subject `<name>: …` or trailer `Agent: <name>`, release commits left out); then `data/team.json` for any name not yet seen.
- **Each agent keeps the shared shape** (`name`, `short`, `colour`, `job`, `schedule`, `status`, `commits_24h`, `commits_7d`, `last_at`, `last_subject`), so the shared agents view shows the right list. Add three fields:
  - `schedule_utc`: the times from the cron in `agents.json` (`cronTimes`), or `[]`;
  - `on_demand`: `true` when there is no cron;
  - `runs`: commit times, newest first, at most 40.
- **`job`** comes from `agents.json`. **`schedule`** is the cron's times written out ("07:20, 12:20, 17:20 UTC"), or "on demand".
- **Agents that never committed** keep `status: "proposed"`, as now.
- **Done when** Jose's agents view lists conductor, dashboard, dev, designer and the other agents that commit for him, each with a schedule or "on demand".

### 2. The Mission view, read-only

One more entry in the shared menu and the phone's tab bar, **Mission** (`#mission`), drawn into the shared `#cc-view`. Angelo's `app.js` shows how: a `MutationObserver` adds the menu entry after each shared render and draws the view when the address asks for it. Top to bottom, as Jose asked:

1. **One attention line:** the first thing that is true, in this order:
   - an overdue issue: Jose's own first, then unpicked, then picked by someone else, the most overdue first;
   - a quiet agent (slice 3);
   - a decision waiting;
   - a late agent;
   - an issue of Jose's due within 24 h;
   - shared issues due within 24 h;
   - else "All clear. Next stand-up HH:MM."

   It always ends "Derived: <why>", and adds "N more to act on" when there is more than one Act item. This is `model().attn`.
2. **Three counts: Overdue, Quiet, Decide.** No other numbers here. Each count links to its section. At zero it is muted and says "none". Above zero it takes the accent, a triangle and its word, and names what it counts (for example "WS-33", "dev", "1 waiting on you").
3. **Needs me now:** each with its word.
   - overdue issues, one row each (Overdue);
   - decisions: open `config.json` decisions and the agenda's open decision items for Jose (Decide);
   - Jose's items at the next stand-up (Stand-up);
   - Jose's own issues due within 24 h (Due);
   - **shared issues due within 24 h as one row**: "14 shared issues due in the next 24 h, nobody has picked 12 of them", with their ids. A single one gets its own row.
4. **New since I last looked** (slice 4; until then, the last 24 h).
5. **My agents** (slice 3; until then, last run and next run).
6. **The machinery:** the channel issues (WS-39 for now; the list in `config.json`, `channels`), then the technical board shared with Angelo, the five most pressing, and a link to the board.
7. **Brief, mentor, opening night:**
   - the conductor's latest numbered brief (`people/jose/briefs/`);
   - the mentor's latest note (`people/jose/mentor/`), marked when more than a day old;
   - days to opening night (Mon 9 Nov, 18:00 UTC), one line each, each with a link.

**The rules that matter** (all in `model.js`):

- **Which issues:** open issues whose `for:` lists jose, or which Jose or one of his agents picked. "Everyone" issues are left out, because the board can't say whether Jose's part is done. "Own" means Jose picked it, or it is for Jose alone.
- **Due dates:**
  - a range ("Tue 3 to Wed 4 Nov") is due at its last date;
  - a time ("Tue 3 Nov, 13:00") is due at that time;
  - otherwise at 23:59 UTC that day;
  - "daily", "every", "from …" and "then daily" are recurring and never overdue;
  - "later" has no date.

  The shared parser treats "from Wed 4 Nov" as a deadline; Mission must not.
- **Stand-up items:** from `data/meetings/<id>/`, open, `for:` listing jose or added by one of his agents. The current or next meeting is the first that started at most 30 minutes ago.
- **Done when** the four states in `check.mjs` show the attention line and counts it expects (run `model()` on `fixture.json` in the browser at those times), and the view works at 390 px and 1280 px.

### 3. Agent health and run ticks

- **OK, Late or Quiet, worked out in the browser against the current time**, never at build time.
- **A slot is judged 40 minutes after it.** A commit counts for the slot whose window holds it, from 10 minutes before that slot to 10 minutes before the next. Only slots after the agent's first commit count.
- **OK:** the newest judged slot ran, or none is due yet. **Late:** only the newest was missed. **Quiet:** two or more in a row.
- **On demand** (no cron: the designer today) is never judged and never counted in Quiet. It reads "On demand", "next: on demand", and shows its commits as dots. Jose's decision.
- **Each row:** name, state word with its icon, "last run HH:MM · next HH:MM", the ticks and the last commit's subject. When Late or Quiet, the reason instead of the subject ("missed 2 runs in a row (09:30, 15:30)"), wrapped, not cut off.
- **Ticks:** the last 8 judged slots, filled when it ran and hatched in the accent when it missed, with a sentence for screen readers.
- **On the clock:** the view redraws every 60 s while visible, and fetches `data.json` again every 5 minutes. When `built_at` changes it redraws and announces "Updated" once, politely. No live region that re-reads the page.
- **Stale:** the build time is always shown. Past 3 hours, a warning at the top of Mission: "Stale: this page was built N h ago, so your agents may have run since", with a link to the CI runs. Every Late or Quiet row says the same in a few words.
- **Done when** the health cases in `check.mjs` pass in the view's code, and an open page turns an agent Late at slot + 40 min without a reload.

### 4. New since I last looked

- **The last visit** is kept in this browser, under a key of its own (`jose-mission.seen`), apart from the shared store's `cc.` keys.
- **When it is written:** when the page is hidden after being visible for at least 3 seconds, and when Jose taps "Mark all as seen". A reload does not clear the marks.
- **The marks:** items after the last visit get a New mark under a "New since HH:MM" divider, then "Earlier". A first visit, or a private window, falls back to the last 24 h.
- **The list:** Jose's agents' commits, commits `For:` jose or his agents, commits naming his issues, and the journalist's reports. Newest first, each on at most two lines, 8 shown, then "Show all N".
- **Done when** the four states' `newCount` in `check.mjs` match.

### 5. Decisions in `config.json`, with a status

- **Where:** Jose's decisions live in `people/jose/app/config.json`, `decisions`, the field the shared engine already reads. Jose's conductor keeps the list; any agent may add one, with its source. Jose's decision.
- **The fields** are the shared engine's (`who`, `what`, `issue`, `since`, `source`, `recommend`), plus two:
  - `by`: the agent that asked;
  - `status`: `open`, `answered` or `dropped`.

  An answered one also holds the answer in Jose's words, and when.
- **What `data.mjs` does:** after `CC.build`, it keeps only open ones in `d.decisions`, so closed decisions leave both the shared views and Mission.
- **Example:** `{"who": "Jose", "what": "Choose the WS-39 broadcast route", "issue": "WS-39", "since": "2026-11-03T01:18:35Z", "source": "people/jose/dev/WS-39-findings.md", "by": "dev@web-summit.jose", "status": "answered", "answer": "route 3 now, Slack next, no gateway", "answered": "2026-11-03T23:48:13Z"}`. Jose decided WS-39 on 3 November, so this one goes in already answered.
- **Keep it public:** no contact details, numbers or keys in `config.json`. The gate checks `people/`.

### 6. Mission first (Jose's decision, 4 November)

Jose's decision: **Mission opens first, from slice 3 on.** Until agent health is in, the attention line and the Quiet count cannot see a quiet agent, so the shared Home stays first.

- The page opens on `#mission` when the address names no other view. A link to another view (`…/app/#tasks`) still opens that view.
- The shared Home stays one tap away in the menu and the tab bar; the switcher row is unchanged.
- One rule in `app.js`, so it is easy to undo if Jose changes his mind.

### Slices 7 to 9: Angelo's three views, copied (Jose, 5 November)

Angelo's own command centre (`people/angelo/app/`, by dev@web-summit.angelo) adds three views to the shared app, all read-only and live: Kanban, Team and the machine, and Summit days. Jose wants the same. Their code is not tied to Angelo: who counts as "me" comes from the data's `person`; only `kanban-core.js`'s self-test and its global name (`AngeloKanban`) mention him.

- **Copy, don't load.** Copy what the three views need into `people/jose/app/`:
  - from `data.mjs`: `kanban()`, `collab()` and `summitDays()`;
  - from `app.js`: the three views and the menu entries;
  - from `app.css`: the `.ak-*` styles;
  - and `kanban-core.js`, renamed `JoseKanban`, with its self-test made Jose's.

  Write in each file which commit of Angelo's it came from (`17201cb`, 5 November 2026, is the newest today). Loading Angelo's files from his folder would let every change he makes for himself change Jose's page, or break it. A copy is Jose's own, and nobody else's page changes either way.
- **Credit and courtesy:** each copied file keeps a line saying it is from Angelo's app, by dev@web-summit.angelo.
- **"Me" is Jose:** `for:` lists jose, or Jose or one of his agents picked it. His agents are the corrected list from slice 1, which uses the same rule as Mission.
- **Everything else as Angelo's brief describes it** (`people/angelo/app/BRIEF.md`, sections 1, 2 and 5):
  - the kanban's filters, layout, sort and bookmarkable views;
  - the collaboration board's people, agents and the machine;
  - the public schedule by day.

  Dev may take Angelo's later fixes when Jose's page would benefit, saying in the commit which ones.

#### 7. Kanban, with Jose's "open issues" layout

Jose's ask (5 November): the briefs page's list (157 issues, done ones included, each with its full text) is too long. He wants **only the open ones, easy to read, in his own app only**; the team page stays as it is. Angelo's kanban already shows only what is not done and can set its columns by due, so there is no separate view: Jose's layout is a **preset** of the kanban.

- **The preset "Open issues",** one tap from the kanban's top bar, and a bookmarkable address (`#kanban?…`):
  - every issue on the board that is not done (not only Jose's), with done and dropped left out;
  - columns by due, most urgent first: Overdue, Due today, This week, Later, Ongoing, No date;
  - within a column, earliest due first, then by number.
- **Each column says** its count and how many nobody has picked.
- **On a card:** "nobody yet" is in bold, not in the accent; it is a fact, not an alarm. Overdue cards say how late ("2 days late").
- **Filters for this preset,** on top of the kanban's own: **All open**, **Nobody yet** and **Mine**.
- **Done issues:** a line at the bottom says how many there are and that they are hidden, with a way to show them.
- **The grouping rule is `openBoard(issues, now, filter)` in `model.js`,** checked in `check.mjs`. It keys rows by file, because two board files share WS-106. Use it, or make the kanban's due buckets agree with it: they must give the same counts.
- **Previews from the real board on 5 November,** in the shared dark colours: [all open, phone](preview-open-issues-phone.jpg) (135 open: 72 overdue, 32 due today, 18 this week, 11 ongoing, 2 with no date) and [mine, phone](preview-open-issues-mine-phone.jpg) (35). In the build they are the kanban's columns: one column at a time on a phone, as Angelo's does.
- **Done when** the preset's counts on Jose's page match `openBoard` on the same `data.json`.

#### 8. Team and the machine

As Angelo's: the last release and the gate, CI (with the page saying what it cannot see), agents and keys, then everyone with their level, agents, picked work and next run. Nothing changes for Jose except who is "me".

#### 9. Summit days

As Angelo's: the event's public schedule from `data/events.json` and the stand-ups, by day, with sources. Each person's own calendar waits for their consent, as in Angelo's brief.

#### Later: messages, card moves, the map

As Angelo's slices 3, 4, 6 and 8. They need Jose's person key, a lane for his conductor, and the signature rule in his conductor's rules, as Angelo's do. Not started until Jose asks.

**Done when** (slices 7 to 9) each view works on Jose's page at 390 px and 1280 px with Jose as "me", and nobody else's `data.json` or page changes. To check: build before and after, then diff the others' `data.json`.

## The look

- **The shared look:** Mission uses the shared tokens (`--rm-*`, dark and light), so it reads as part of the same app. Its sections are the shared card style, with lists inside each card, not a card per item.
- **One accent, for Act and New only.** Add one token in `app.css`:
  - dark: `--jm-act: #FF9A52` (9.0:1 on `--rm-bg`, 7.8:1 on `--rm-surface`);
  - light: `#C2410C` (5.2:1 on white, 4.9:1 on the light `--rm-bg`), because the dark one is too pale on white (2.1:1).

  Everything else is the shared greys.
- **Three levels, each always with a word and an icon:** Act (triangle, accent), Watch (clock, primary text), OK (tick, muted text). "On demand" is a word with no icon. Colour is never the only signal.
- **Numbers and times** in a mono font with tabular figures. Section labels small, upper case, a little letter-spacing.
- **Accessibility:** text contrast at least 4.5:1 in both themes (check the accent on every surface it sits on). Every link and button at least 44 px tall. Transitions 150 ms on colour only, none under reduced motion. Focus always visible.

## Who does what

- **`dev@web-summit.jose`** builds and releases each slice in `people/jose/app/`, with the convention (`Agent: dev@web-summit.jose`), and says in each commit what it tried and learned.
- **`designer@web-summit.jose`** (me) checks each slice on a phone and on a wide screen against this brief before Jose is told it is ready, and answers questions about it.
- **`conductor@web-summit.jose`** keeps `decisions` in `config.json` (slice 5) and `agents.json` (slice 1's first source).
- **Jose** decides anything this brief gets wrong.
