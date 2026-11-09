---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026
---
# Chat, calls, notifications and Live Activities in the Team app

**What this is:** how the Team app could get its own chat and calls, the two pathways for calls, and how late-task notifications and Live Activities (the live cards on an iPhone's lock screen) would work and be worded.

**Why it matters:** the aim is to show that a simple, efficient team app can beat Slack at the everyday basics: knowing what is late, talking to the team, and seeing what is happening right now.

**The prototype, with the lock screen preview (button beside the phone):** https://claude.ai/artifact/AXQraRZaeupJrP4dbgxMFY

## 1. Tasks, as you asked (in the prototype now)

- **Grouped by day:** Late, Today, Tomorrow, Later.
- **Starred tasks go to the top**, into a "★ Priority" group, so the important ones are always first.
- **Each group folds:** tap its header (with the arrow) to close or open it. "Later" starts folded.
- **Big buttons:** every tick circle, star and group header is at least 44 by 44 points, Apple's minimum for an easy tap.

## 2. Late tasks that notify the owner (first to build)

**How it works:**
1. **At the due time**, the owner gets: *"Late: Print 50 business cards"*, *"Due 10:00 · The stand"*, with buttons **Done** and **Tomorrow**.
2. **Two hours later**, if still open, the same once more.
3. **Four hours late**, the person who gave the task gets: *"Still late: Book a room for Wednesday"*, *"Vicky · due yesterday"*, with **Nudge** and **Take it**.
4. **Quiet hours:** nothing between 22:00 and 08:00, and never more than one reminder per task every two hours.

**The simplest way to build it (no new server):** the iPhone itself sets the reminders. When the app updates its task list, it schedules a reminder on the phone for each task's due time. A manager's phone does the same for tasks they gave. If a task is ticked off before then, the reminder is cancelled. This works with the app closed.

**Later, if needed:** a small server sends the reminders instead, so they also reach someone whose app has not opened for a while.

## 3. How every notification is worded

| Rule | Example |
|---|---|
| The title says what happened, in five words or fewer | "Late: Print 50 business cards" |
| The second line says when, who or where | "Due 10:00 · The stand" |
| At most two buttons, each a verb | "Done" · "Tomorrow" |
| No emoji, no greeting, no exclamation marks | Not "Hey Indi! 👋 Don't forget..." |
| Name the person first when someone asks you something | "Jose asks you to come to the stand" |

**The full set:**

| When | Title | Second line | Buttons |
|---|---|---|---|
| Your task is late | Late: [task] | Due [time] · [list] | Done · Tomorrow |
| It stays late (to whoever gave it) | Still late: [task] | [owner] · due [when] | Nudge · Take it |
| Someone gives you a task | [name] gave you a task | [task] · due [when] | (none) |
| Someone asks you over | [name] asks you to come to [place] | Now · [reason] | On my way · Can't now |
| A meetup is soon | [what] in 15 min | [place] · with [names] | On my way · Can't make it |
| You are nudged | [name] nudged you | [task] · due [when] | Done · Reply |
| A new message (with chat, section 5) | [name] | The message's first line | Reply |

## 4. Live Activities

**What they are:** a live card on the lock screen and at the top of the screen (the "Dynamic Island" on newer iPhones) that updates itself, like a delivery tracker. Apple lets one stay live for up to 8 hours and on the lock screen for up to 12 ([Apple](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities)).

| Live Activity | Starts | Shows | Default |
|---|---|---|---|
| **A meetup you are in** | 30 minutes before | Countdown, place, who is coming | On |
| **A keynote or talk** you or a teammate marked "Going" | When it starts | "Angelo and Jose are here", time left | On |
| **A stand-up** | 5 minutes before | Time, "2 decisions for you" | **Off** (you switch it on) |

Each can be switched off in More, then Settings. The prototype shows them on its lock screen.

**How it is built:** Apple's ActivityKit. The app starts the card itself when it knows about the event (for example on your own meetup). To start one when the app is closed, for example when a teammate arrives at a keynote, a server sends a "push to start", which needs iOS 17.2 or later; each update can hold at most 4 KB of data ([Apple](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities)).

## 5. Our own chat in the app

**What you asked for:** profile pictures, "is typing" bubbles, read receipts, times on messages, forwarding, direct messages, group messages, adding new people, and notifications.

### Three ways to build it

| | A. A ready-made chat service (Stream) | B. Open-source chat we host (Matrix) | C. Built on the team's own vaults |
|---|---|---|---|
| **What it is** | A company runs the chat; we add their iPhone kit | The open system behind the Element app; we run our own server | Messages stored in the team's encrypted vaults |
| **Typing, read receipts, times, groups, direct messages** | Built in ([Stream](https://getstream.io/chat/sdk/swiftui/)) | Built in | We build each one; typing and read receipts are hard without a live connection |
| **Encryption** | On their servers | End-to-end, audited ([Element](https://element.io/blog/element-x-ignition/)) | End-to-end (our vaults) |
| **Who holds the messages** | The chat company | Us | Us |
| **Time to a working chat** | About 1 to 2 weeks | About 3 to 6 weeks | Months |
| **Cost** | Free tier for very small companies, then per user; check the current terms ([Stream](https://getstream.io/tutorials/swiftui-chat/)) | A small server | Our time |
| **Fits the team's privacy rules** | Needs the security agent's review: messages leave our control | Yes | Yes |

**My recommendation:** **B, Matrix**, if the team is willing to run one small server. It gives every feature you listed, keeps messages encrypted and in the team's hands (as the team's vaults do), and the same system also does calls (section 6). **A, Stream**, if speed matters more than owning the messages, after the security agent's yes.

### The workflow, step by step (Matrix)

1. **Decide** (Dinis and the security agent): our own Matrix server, and where it runs.
2. **Set up the server** and one account per team member, linked to their team identity.
3. **Add chat to the Team app** with Matrix's iPhone kit (the same one the Element app uses).
4. **Build the screens in today's look:** a **Chat** entry on each person's card and in More (it does not need its own tab yet), a list of conversations, and the conversation screen with photos, "is typing", read ticks and times.
5. **Groups:** "The whole team", plus one per area (the stand, outreach). Adding a new person adds them to "The whole team".
6. **Forwarding:** a long press on a message, then "Forward".
7. **Notifications:** "[name]" and the first line of the message, through Apple's notifications.
8. **Test** with two or three people for a day, then the whole team.
9. **Keep WhatsApp** as the default until the team chooses to switch.

## 6. Calls: two pathways

### Pathway 1: the shortcut (days)

- A **Call** button on each person's card offers: **WhatsApp**, **Phone** and **FaceTime** (iPhone to iPhone).
- Phone and FaceTime ring at once. WhatsApp opens the chat with that person, then you tap the call button (WhatsApp has no public link that starts a call straight away).
- **Needs:** each person's phone number in the team's private vault, never in the repository.

### Pathway 2: our own calls in the app (weeks)

1. **A call server** that carries the audio and video. LiveKit is open source and can run on our own server; Matrix's calls use it too.
2. **The app's call screens:** a call button, the call screen, mute, speaker, video on or off.
3. **Apple's native call screen (CallKit):** an incoming call rings like a normal phone call, even on the lock screen. LiveKit's iPhone kit supports this ([LiveKit](https://www.mintlify.com/livekit/client-sdk-swift/platforms/callkit-integration)).
4. **Waking the phone for a call (PushKit):** a special kind of notification wakes the app when a call comes in. Apple requires such apps to show the native call screen ([Apple](https://developer.apple.com/documentation/pushkit/responding-to-voip-notifications-from-pushkit)).
5. **A small server** to start calls and send those wake-up notifications.
6. **Test** on the team's phones through TestFlight, then add group calls.

**My recommendation:** **Pathway 1 now** (it works at the summit), **Pathway 2 after the summit**, together with Matrix chat, so chat and calls are one system.

## 7. What is done and what is next

| Item | State |
|---|---|
| Tasks by day, Priority, folding days, big buttons | **Done** (prototype) |
| Notifications and Live Activities: design and wording | **Done** (prototype and this page) |
| Chat: three options and a step-by-step workflow | **Done** (this page) |
| Calls: two pathways | **Done** (this page) |
| The brief for Dinis's iPhone agents | **Updated** (version 5: tasks by day, late-task notifications, Live Activities, the wording rules) |
| Building any of it | **Waiting** for Dinis (Team app item on today's stand-ups) |
