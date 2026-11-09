---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026, overnight
prompt: 2 of 5
---
# Prompt 2: the PrompTugal Team app, redesigned

**What it is:** a new design for the Team app (the private iPhone app the team tests through TestFlight), so it becomes one place to see where everyone is, what is planned, and what everyone is doing.

**Why it matters:** at the summit there is a lot going on at once. Today it takes three or more taps to find a teammate, and you cannot tell the team where you are at all.

## See it and tap through it

**The clickable prototype (a phone you can tap on, in your browser):** https://claude.ai/artifact/5mPaRudVP26GSzKSqeG7jq

It is private to your account. Share it from the page's Share menu if you want the team to see it. The names are the team's, but every place, time and task in it is made up to show the design.

## What is good in today's app (kept)

- **"My day"** already pulls together your stand-up, what waits on you and your agents.
- **The summit agenda works with no internet**, which matters in a crowded venue.
- **"Where is everyone"** already works out who will be together, from the talks people saved.
- **It is private.** Dinis decided the Team app is the only app allowed to hold private team data.

## What gets in the way today (fixed)

- **Too many screens.** About 30 screens in 10 groups. On a phone, 4 tabs and a "More" list of about 25 items.
- **Repeats.** Several screens appear twice: once built into the app, once as a copy of the website.
- **Three "home" screens** (My day, Team home, The team) that overlap.
- **Technical names**, such as "Wakes" and "Observability".
- **No quick way to say where you are**, and no way to plan a meetup.

## The new design: five tabs

| Tab | What you see | Taps for the main job |
|---|---|---|
| **Now** | What is next for you, a row of buttons to say where you are, the team right now (a face per person, coloured by place), and what needs you | 0 to see your next thing; 2 to say where you are |
| **Where** | Everyone grouped by place (stand, a talk, a hall, a meeting, hotel, in town, off), or a simple plan of the venue with a dot per person | 1 to see everyone; 1 more for one person's details |
| **Plan** | One calendar for Monday to Thursday: Web Summit's events, our stand-ups and stand shifts, and team meetups. Below it, which hotel each person is at (team only) | 1 to see the day; 4 to plan a meetup and tell the WhatsApp group |
| **Tasks** | Everyone's tasks in six groups: Outreach, Meetings, The stand, Content, Logistics, Agents. Filters: Mine, Everyone, Overdue | 1 |
| **More** | News, Agents, Briefings, Vault, Messages to agents, Settings | 1 to 2 |

### How it looks and feels

- **Soft pastel colours with dark text**, the same palette as your dashboard and factory pages, in light and dark mode.
- **Lexend for text**, a font designed to be easy to read, at a comfortable size that grows with the phone's text-size setting.
- **Each place has a colour, an icon and a word**, so colour is never the only clue.
- **Big buttons** (at least a fingertip wide), and the main action of each screen at the bottom, where your thumb is.

## Your requests, one by one

1. **Organising meetups, linked to other events like Web Summit.** The Plan tab shows Web Summit's events next to ours. "+ Meetup" asks what, where, when and who, in four taps, then adds it to the team's plan and to your phone's calendar.
2. **Communicating: WhatsApp, not a new chat.** The app does not add its own chat. Every person card and every meetup has a "WhatsApp" button that opens WhatsApp with the message already written. The workflow:
   1. Plan the meetup in the app.
   2. Tap "tell the WhatsApp group".
   3. WhatsApp opens with "Coffee at our stand in 30 min: Indi, Vicky. Reply 👍" ready to send.
   4. You press send.
3. **Knowing where people are and when.** The Where tab and the faces on the Now tab. Updating takes two taps: where you are, then for how long.
4. **A live location finder like Find My or Life360.** Built in a privacy-first way:
   - **By default you choose a place** (stand, a hall, hotel, in town). The app never reads your phone's GPS. This is the design Angelo approved on Saturday 7 November.
   - **A live pin is an extra you switch on for one hour at a time.** It is designed but switched off until the team's security agent has checked it, which is the rule the team set for anyone's location.
5. **A dashboard of everyone's tasks, by category.** The Tasks tab.
6. **The plan, the calendar, hotels, where people are and what they are doing.** Plan (calendar and hotels), Where (where and what), Now (a summary).

## What is done, and what is not yet

| Item | State |
|---|---|
| Review of today's app | **Done** |
| New design and clickable prototype | **Done** |
| A step-by-step brief for the agents who build the iPhone app, ready to paste | **Done** (in your prompt library, and sent to Dinis's agents) |
| The new design built into the real app and on your phone through TestFlight | **Not yet.** See below |

### Why it is not on your phone yet

- **Only Dinis's agents can change the iPhone app's code.** Your account can read it but not change it. Your conductor agent is in the same account, so it cannot either.
- **This session cannot build iPhone apps.** Apple's tools only run on a Mac, and the cloud computers run Linux.
- So I wrote the work up as a brief Dinis's iPhone agents can follow first time, and sent it to them through the team's usual commit messages. Once one of them starts it, the new app reaches TestFlight by itself, through the factory line described in prompt 1.
- **To speed it up:** ask Dinis to give his iPhone conductor agent the brief (one sentence is enough: "build the Team app redesign in Indi's brief").

### Decisions only you, Dinis or Angelo can make

- **Hotels:** Angelo's approved design says the team's private vault never holds a hotel address. The prototype shows only a hotel's name, to the team only. See Questions.
- **The live pin:** it needs the security agent's review, and Dinis's yes.
