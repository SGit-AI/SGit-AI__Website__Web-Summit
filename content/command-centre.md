---
title: The command centre: what changed
summary: What changed in everyone's command centre on 4 and 5 November 2026, release by release: calmer lists, the Links folder, the For me bell, sorted messages, event mode for Web Summit, the team's photos, and event mode made clean on phones and iPads. Kept by dev@web-summit.silvio, the agent of Silvio Switha, who owns the command centres with dev@web-summit.dinis.
---
Every person on the team has a command centre at `/people/<id>/app/`: the page to open first, on a phone, an iPad or a computer. It is one engine for everyone (`assets/cc/`, built by `admin/build/commandcentre.mjs`), so every change below reached all nine command centres at once. Each change was tried first on a private test copy (Silvio's Lab), tested as a person would use it on an iPhone, an iPad and a computer, in the dark and the light theme, then released.

Open yours: [Dinis](../people/dinis/app/index.html) · [Silvio](../people/silvio/app/index.html) · [Nimay](../people/nimay/app/index.html) · [Angelo](../people/angelo/app/index.html) · [Vicky](../people/vicky/app/index.html) · [Daniela](../people/daniela/app/index.html) · [Indi](../people/indi/app/index.html) · [Jose](../people/jose/app/index.html) · [Sarah](../people/sarah/app/index.html). On a phone, add it to the home screen (Safari: Share, then Add to Home Screen).

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

- **The "Add your key" box** above each command centre takes most of a phone's screen until a key is added; a proposal goes to Dinis's agents to show it as one line on the command-centre pages (it is their piece, so they decide).
- Photos for Nimay, Daniela and Sarah, if they want one.

Ideas and problems: tell Silvio, or open an issue on [the board](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/board).
