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

### Two brains: My brain and the Summit brain {#brain}

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
