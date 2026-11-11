---
title: The command centre: what changed
summary: What changed in everyone's command centre on 4, 5 and 7 November 2026, release by release: calmer lists, the Links folder, the For me bell, sorted messages, event mode for Web Summit, the team's photos, event mode made clean on phones and iPads, and two brains (My brain and the Summit brain) as a 3D map. Kept by dev@web-summit.silvio, the agent of Silvio Switha, who owns the command centres with dev@web-summit.dinis.
---
Every person on the team has a command centre at `/people/<id>/app/`: the page to open first, on a phone, an iPad or a computer. It is one engine for everyone (`assets/cc/`, built by `admin/build/commandcentre.mjs`), so every change below reached all nine command centres at once. Each change was tried first on a private test copy (Silvio's Lab), tested as a person would use it on an iPhone, an iPad and a computer, in the dark and the light theme, then released.

Open yours: [Dinis](../people/dinis/app/index.html) · [Silvio](../people/silvio/app/index.html) · [Nimay](../people/nimay/app/index.html) · [Angelo](../people/angelo/app/index.html) · [Vicky Wang](../people/vicky/app/index.html) · [Daniela](../people/daniela/app/index.html) · [Indi](../people/indi/app/index.html) · [Jose](../people/jose/app/index.html) · [Sarah](../people/sarah/app/index.html). On a phone, add it to the home screen (Safari: Share, then Add to Home Screen).

## 7 November {#nov-7}

A calmer, more professional command centre for everyone, tried first on Silvio's private test page (the Lab), tested on iPhone, iPad and computer in both themes, then released. Nothing in Angelo's or Jose's own views was changed: their Kanban, Team and the machine, Summit days, Replay and Where stay exactly as they built them.

### Calmer and clearer {#calm}

- **The menu, grouped by colour:** Work (blue), Web Summit (gold), Connect (green), More (grey); shorter names (Overview, Decisions, Inbox); compact rows; the open page is marked in its group's colour.
- **The bar of names is gone.** Tap your own name (top left; on a phone, your photo) to open the team, with their photos, and open anyone's command centre from there.
- **One top bar:** the page title, the search, one group of tools (Kanban, For me, Links, light or dark) and the date on one line.
- **Lighter pages:** sections are a title and a hairline instead of boxes inside boxes; task lists are rows with a thin colour bar; secondary buttons read as links; smaller, calmer type; the numbers in one strip, in plain words ("next 3 days", "you are on it").
- **One button system:** gold for the main action, outlined for the second, plain for the rest; at least 44 px tall on phones and iPads.
- **Ask Claude** is the round button at the bottom right on every screen; tap it to type or speak.

### Kanban for everyone {#kanban}

- **The board button in the top bar** opens every task as cards in columns (To do, In progress, Done); tap it again to go back where you were.
- **Group by** status, due date, person or area; **filters**: Mine or Team, Overdue, Due this week, Nobody picked it, and a search.
- **Drag a card** to another column, or use its ⋯ menu, to change its status: the change is shown as pending, with the link to save it in the issue's file on GitHub (the board files stay the truth). Tap a card to open the task.
- In **Angelo's and Jose's** command centres the button opens their own Kanban.

### Decisions first (WS-06) {#decisions}

What waits on you sits right under the greeting, with how long it has been waiting, and a link to all decisions.

### Summit desk {#summit-desk}

A **Summit desk** link (Web Summit, in the menu) opens the team's private page for the stand: the visitor demo, the plan and the brain. It is a private claude.ai page, shared by Silvio; nothing about visitors is ever on this public site. Next, the Summit desk is rebuilt to read and write the team's private CRM ([/crm/](../crm/index.html)), so the stand and the outreach share one list.

### Tokens: what our agents spend {#tokens}

**10 November 2026 (dashboard@web-summit.silvio, at Silvio's word):** a **Tokens** view on every command centre.
- **What it reads, live:** every agent ledger on the site (`people/<id>/ledger/*.jsonl`, `people/<id>/accountant/ledger/*.jsonl`). These are written by the agents themselves with `measure.mjs`, one line per run: calls, models, input, output, cache writes and cache reads.
- **Running totals:** a running total from one long session is counted once; only what is new counts.
- **What it shows:**
  - the team by day, stacked by person;
  - the agents that spend most;
  - four totals: estimated cost, runs logged, tokens without cache reads, and cache reads.
- **The comparison:** the same tokens at other models' list prices (two smaller Claude tiers, Z.ai's GLM-5.3, the family Revolut moved to, DeepSeek, and Revolut's own reported self-hosted figure). Each price links to its source.
- **Not a bill:**
  - the costs are estimates at list prices in US dollars;
  - another model would not use the same tokens or do the same work;
  - people whose agents write no ledger are shown as **not measured**, never as zero.

### The Universe: one map with layers {#brain}

**10 November 2026, afternoon: the Universe reads live.** Every time it opens, it reads its sources at that moment:
- the team and each person's agents.json;
- every Agent Behaviour Policy, from the /abp/ pages;
- the role policies;
- each agent's latest commit, from GitHub's API on dev;
- the Web Summit layer, from the public CRM vault, joined to our company map and open summit tasks.

It reads again every five minutes while the map is open, and says "● LIVE, read hh:mm UTC". The last reading on a device opens the map at once while the new one arrives. If a source does not answer, it falls back to the last snapshot and says "as of" instead. The agents' gaps are still shown only in a developer's browser, with their key.

**10 November 2026, morning (dashboard@web-summit.silvio, at Silvio's word, for the whole team):**

- **A cleaner command centre for everyone.**
  - The menu keeps the daily views: Overview, My tasks, Team board, Universe, GAMMA-Ray, Inbox and Ask Claude. **More** opens the rest and remembers whether it was open.
  - Views a person's own page adds, such as Angelo's Kanban, Team and the machine, Where and Summit days, stay where they were and stay visible.
  - Lists show the essentials: the number, the title and the due date. The **Details** switch in the top bar shows everything, and opening a task still shows all of it.
- **Universo ✦, every graph in one place (11 November).** A new view at the top of the Web Summit menu, in the new look: Constellation (3D), Team (the fan: cards, gold lines to every agent, the agent's own policy in the panel), Three shields (the 300 enforcement runs of 11 November, a replay), X-Ray (13 companies, the searches of 7 November, a replay), GAMMA-Ray (the public scans read on 10 November) and Conversation. Click a person and the camera flies in and opens their fan; zoom with + / − or a pinch; the path at the top leads back. Portuguese or English. Agents, policies and conversations are read live; the barriers figure is shown to developers only.
  - It is built on **[Gravity](../lib/gravity/index.html)**, a universe visualization library with versions and a latest folder, so the same views can draw other systems (the [library index](../lib/index.html)).
- **The Universe on every command centre, in three views.**
  - **Map** is the 3D map in light points. The glass balloons are gone.
  - **Circuit**, drawn after Silvio's reference images, shows each person's agents on a numbered bus, through their behaviour policy, barriers, the gate and the owner, to the resources their policies name. The selected agent's path is lit, its team glows in their T-shirt colour, and four panels sit below (run log, dispatch, the agent's policy, graph). **Play** walks through the agents.
  - The agents' open gaps and barriers are still shown to the developers only, with their key.
  - **Talk** shows who talks to whom. An agent's commit with a `For:` trailer naming another agent or person is a message. Each line joins two of them: a thicker line means more messages, and a glowing line means one in the last 15 minutes. Tap a point to light only its conversations. It opens on **All read**, with every agent in the last commits. **● Now** keeps only the last 15 minutes, and **Last 1h** and **Last 3h** sit between them. It reads the last 300 commits on `dev` from GitHub every two minutes, and shows the last reading straight away. The agents talk asynchronously, through commits, not in a live chat. Four panels sit below: the messages, the busiest pairs, the tasks in play and the people.
- **GAMMA-Ray on every command centre.**
  - It reads the draft standard live from gamma-ray.sgit.ai, with the same rules as its build/model.mjs, and shows the two example scans of our own agents and the person's own agents' scans, once they are published.
  - It has two views: a circuit (answers on an indicator bus, the level rules, the level held and the gap) and the freedom-by-governance grid.
  - It says plainly that the standard is a draft not yet reviewed, and that "not evidenced" is never a "no".

**10 November 2026 (dashboard@web-summit.silvio, at Silvio's word):** the two brains became **one map, the Universe** (in the menu, Web Summit), now on the command centres of **Silvio, Angelo, Jose and Dinis**. One menu of layers above the map, each switched on or off and remembered on this device:

- **Agents & policies:** our team's agents and their behaviour policies, from the public policies on this site ([/abp/](../abp/index.html)), with the time they were read ("as of"). Tap an agent to see who owns it and what it does.
- **Web Summit:** the Summit brain below (the public CRM joined to our team, our company map and our tasks).
- **My notes:** your own second brain, in your browser only.

A button switches the look between **light points** (best for the whole map) and **glass balloons** in the team's T-shirt colours (best with a few layers on). **The agents' open gaps and barriers, and the panels built on them, are for the developers only (Silvio, Dinis and Angelo):** they are not in the public file (`assets/cc/universe.json`); they are sealed to each developer's person key (`data/sealed/<id>/universe-gaps.json`) and open only in a browser that holds that key. Everyone else sees the map and who each agent is. (The policies themselves, with their gaps, are still public on the /abp/ pages: that is Dinis's to decide.)

What follows is the earlier note, of 7 November.

On the command centres of **Silvio, Angelo and Jose** (at Silvio's word; the others' command centres are unchanged), tried first in Silvio's Lab, then brought here. Nothing that Angelo or Jose built was removed or changed: their own views, Kanban and menus stay as they are, and the brain is added beside them.

- **My brain** (in the menu, Web Summit): the second brain from *The Second Brain Build*: capture anything, Claude organises it into a linked wiki, ask it questions. It is kept **in your browser only**; nothing you capture is sent to this site. Export keeps a copy.
- **The Summit brain**, one tap away at the top of the map: Web Summit 2026 from the **public CRM** (companies, organisations, speakers, sessions, pitches, side events, topics; about 790 points and 1,260 links) joined to what this site already has: the team, our company map with the reason for each company, and our open summit tasks, all around RiskMandate at stand A1-30. Public facts only. With nothing in My brain yet, the map opens on the Summit brain.
- **The 3D map:** glass balloons in a sky of small stars; bigger balloons have more links; tap one to read it; search lights the matches. **Each of us is a balloon in our T-shirt colour** (from the print set, [/print/](../print/index.html)), as luminous glass: Dinis smoked obsidian (black), Nimay sapphire (blue), Angelo emerald (green), Jose amber (orange), Vicky amethyst (purple), Silvio ruby (red), Indi gold (yellow).
- **Tidy controls:** the legend (tap a kind to show or hide it) and the map's buttons sit in one row above the map, next to "How the brain works", so the map itself stays clean.
- **Full screen:** fills the screen with the map and keeps everything at hand (find, which brain, the legend and the buttons, at the bottom); Esc or the button brings it back. **Cinema** stays the stand's mode: nothing on screen, turning by itself.
- **No outside calls:** the 3D libraries (3d-force-graph 1.80.1 and three 0.186.1) are bundled on this site (`assets/cc/brain-libs.js`) and load only when the map opens.

## 5 November {#nov-5}

### Event mode, clean on phones and iPads {#event-clean}

During Web Summit (9 to 12 November, or now from Settings → Event mode) the home page is made for standing in a hall with a minute to spare:

- **Your day first.** The greeting shrinks to one line, with the **+** for a new task; your day at Web Summit comes straight after it. The summary, the countdown and the What's new card move below.
- **On an iPad or a computer, your day and the sessions side by side.** On a phone, one under the other.
- **Bigger day buttons** (Mon 9 to Thu 12), across the card, easy to tap.
- **The Claude bar folds to the microphone** on phones and, in event mode, on iPads too; tap it to type or speak.
- With event mode off, nothing changes.

Tested on iPhone SE, iPhone 14, iPhone 14 Pro Max, Pixel 7, iPad Mini and iPad Pro 11 (upright and on its side), a 1280 px laptop and a 1440 px desktop, on all nine command centres.

### The team's photos {#photos} (v0.2.450, v0.2.451)

The people chips at the top and the profile card show a photo where there is one (`people/<id>/photo.jpg`, 256 px square, no metadata), and the initials where there is none or the photo does not load. **Each person confirms their own photo** through their own agent, by Friday 6 November ([WS-163](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/board/WS-163-each-person-confirms-their-own-photo.md)); a photo not confirmed comes down and the initials come back. How people are shown on the rest of the site is Dinis's call (WS-92). No photo yet? Send a square one to Silvio, or add `people/<you>/photo.jpg` yourself.

### The For me bell, sorted messages, event mode, What's new {#forme} (v0.2.422)

- **🔔 For me**: the bell at the top counts what needs you (tasks due now or late, decisions only you can make, messages that ask you something). Tap it for the list. It lives in the page: it does not send notifications to the phone.
- **📩 Messages**: the ones that ask you something come first; the team's updates and your own agents' reports are folded.
- **📅 Event mode**: from 9 to 12 November your home page starts with your day at Web Summit: the stand-ups, opening night, the side events and what is due that day. Tap ☆ on a session to add it to your day; the stars are kept on your device.
- **What's new**: a card at the top of the home page with the latest changes, until you close it.

## 4 November {#nov-4}

### Calmer lists and the Links folder {#calm} (v0.2.389)

- **Done tasks fold away** under "✓ done"; open tasks come first, the most urgent at the top: Overdue, Today, This week, Later.
- **Calm colours**: red only for late, orange for today, the rest quiet; the status chip only when a task is not simply open.
- **The board's Done column** shows the last three, with "Show all".
- **🔗 Links**: every site the team uses in one place (the chain button at the top). Add your own in `people/<you>/app/config.json`: public links only, never a private document or anything with a password or key.

## Still to come {#next}

- **Your key on every device before Monday 9 November** ([WS-166](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/board/WS-166-every-person-s-key-on-every-device-before-web-summit.md)): until a browser holds your key, the "Add your key" box sits above your day and takes most of a phone's screen. Open your key link on every phone, iPad and computer you will carry; the box goes and your day is at the top. Nimay, Daniela and Sarah: your keys come from conductor@web-summit.dinis.
- Photos for Nimay, Daniela and Sarah, if they want one.

Ideas and problems: tell Silvio, or open an issue on [the board](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/board).
