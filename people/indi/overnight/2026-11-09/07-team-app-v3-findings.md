---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026
---
# The Team app, version 3: what seven synthetic users found

**What this is:** the third version of the Team app prototype, built from your choices, then tested by seven synthetic users (invented people, played by AI helpers, who tap through it and report as that person would). Their findings, what I fixed, and what the app still needs to beat Slack.

**The prototype (private to your account; share it from its Share menu):** https://claude.ai/artifact/AXQraRZaeupJrP4dbgxMFY

## 1. What version 3 is

- **Today's look kept:** beige, white cards, serif headlines, red labels, gold initials, the floating tab bar.
- **Now (draft D):** your day as one timeline, starting with where you are. "Needs you" shows your late tasks first.
- **Where (draft E):** the team's faces first, then the venue plan or a list by place.
- **Plan (draft D):** each day as a timeline, with tasks due that day and the hotels below.
- **Tasks (new):** a to-do list like Microsoft To Do. No big numbers: counts are small text. Five layouts to compare (buttons beside the phone):
  1. **Lists:** smart lists at the top, quiet sections by kind of work.
  2. **By day:** Late, Today, Tomorrow, Later. **The current default.**
  3. **By person:** a face and each person's tasks.
  4. **Focus:** your three for today, the rest folded into one line per kind of work.
  5. **Compact:** one line per task, the densest.
- **To-do basics in every layout:** tick off; see and untick completed tasks; add; star; due dates with a red "Late" label; search; task details with "Move the date", "Give it to" and an editable WhatsApp nudge that is logged on the task.

## 2. The seven synthetic users

| Who (invented) | Their angle | Ease | Speed | Fits work | Team talks | vs Slack | Favourite Tasks layout |
|---|---|---|---|---|---|---|---|
| Marta, stand lead | One hand, busy floor | 4 | 4 | 3 | 3 | 4 | Lists |
| Priya, project manager | Late work and owners | 4 | 4 | 3 | 3 | 4 | By day |
| Tom, back office | Not at the venue | 4 | 4 | 3 | 4 | 4 | By person |
| Leo, new intern | Not technical | 3 | 4 | 3 | 3 | 4 | Focus |
| Sam, engineer | Speed and data | 4 | 5 | 2 | 2 | 3 | By day |
| Ana, startup COO (buyer) | 40 staff, fewer tools | 4 | 4 | 2 | 2 | 2 | By person |
| David, VP at an Apple-sized company (buyer) | Privacy and scale | 4 | 4 | 2 | 3 | 3 | By day |

Scores are 1 to 5. **Ease and speed are strong everywhere (4 to 5).** The weak scores are "fits my real work" and "helps the team talk", for the reasons in section 4.

## 3. What they found, and what I fixed (in the prototype now)

| Finding | Raised by | Fixed |
|---|---|---|
| Late tasks not marked everywhere; Now did not put them first | 5 of 7 | A red "Late" label on every late task; Now and lists put late first; a "Late" smart list; "By day" opens on Everyone |
| Nothing to do with a late task | Priya, Ana | Task details: Move the date, Give it to someone, and a nudge you can read and edit before WhatsApp, logged on the task |
| A new task got a list and date without asking | Marta, Sam | A row under the add box shows list, due date and owner, and you change them before saving; the message names where it went |
| The person card covered the tab bar, with no close button | Tom, Ana | A close button, and the tabs always work |
| "Meet here" was a whole form for "come now" | Marta | "Ask to come over": one tap, WhatsApp opens with "Can you come to the stand now?", and it is added to Plan |
| A new meetup did not appear in Plan | Tom | It appears at once, marked "Sent to the WhatsApp group" |
| No search | Sam, David | Search on Tasks and on Where |
| "Agents" and "Vault" meant nothing | Leo | Plain descriptions, and each opens a short explanation |
| Hotel buried; Silvio missing | Leo, Tom | "Tonight: Team hotel A" on Now; Silvio listed |
| Undo vanished too fast | Leo | 8 seconds, and it names the task |
| Nothing said who sees your place | David | One line on Where: team only, places never GPS, kept 12 hours, turn off in Settings |

## 4. What the app still needs to beat Slack (not in the prototype)

Both buyers said the same thing: **the "who is where, what is next, what is late" picture is already better than Slack, but it is not yet a Slack replacement.** In order of how often it came up:

1. **Late work that acts on its own:** a notification to the owner, then to their manager if it stays late, with one-tap reassign. (Ana's "the feature that would make me sign".)
2. **Chat that is not tied to WhatsApp:** let each company choose WhatsApp, Slack, Teams, iMessage or email for the hand-off. Many companies ban WhatsApp for work.
3. **Privacy an admin controls:** location off by default, who can see it, how long it is kept, and a "who saw me" log. Needed for big companies and works councils (staff committees).
4. **Search everywhere and quick add.**
5. **Scale to hundreds:** teams and groups, "my people", and a team picker on Where and Tasks.
6. **Fit with company systems:** single sign-on, the staff directory, and Outlook or Google calendars.
7. **Plans beyond an event:** repeating weeks and shifts, not only Monday to Thursday.

**What a buyer said they would pay:** Ana (startup COO) about 4 to 6 euros a person a month if it replaced a location app and part of Asana; about 10 euros if it also replaced Slack. These are synthetic opinions, not market research: the ten developer conversations (your card in 06) are the real test.

## 5. Ticks that really update the team's list

**In the prototype,** ticks stay in your browser only. **In the real app** (written into the brief for Dinis's iPhone agents, step "5b"):

1. You tick a task. The phone saves it at once, so it is never lost without signal.
2. The app sends the change to the team site's files on GitHub (where the team's code and lists are kept):
   - a board task (one of the team's numbered issues) is marked "done";
   - a personal task is ticked in your own task list.
3. Every teammate's app checks for changes every minute, so they see it within about a minute. The website shows it after its next update.
4. If two people change the same task at once, the app fetches the latest and tries again.

**This needs Dinis's yes** (see Questions): each person gets their own access key, limited to the team site's files, kept locked in the phone; and the app saves changes to the site under names like "app@web-summit.indi".

## 6. What is done

| Item | State |
|---|---|
| Version 3 prototype, revised after the tests | **Done** |
| Seven synthetic user tests | **Done** (this page) |
| The brief for Dinis's iPhone agents, version 4 (your mix, the Tasks tab, the fixes, live sync) | **Done**, in your prompt library |
| Building it into the real app | **Waiting** for Dinis (on today's 12:00 stand-up) |
| Live ticks on the team site | **Waiting** for Dinis's yes to the access keys |
