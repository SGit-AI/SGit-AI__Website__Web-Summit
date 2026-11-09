---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026, overnight
prompt: 3 of 5
---
# Prompt 3: making iPhone and Android releases equally easy

**What this is:** how our apps get from an agent's change to a tester's phone, what makes it hard, a single way of working for both iPhone and Android, and an idea for a product we could sell to other developers.

**Why it matters:** today the iPhone route works but is slow and fragile, and the Android route does not exist yet. Every hour Dinis spends in Apple's or Google's websites is an hour not spent on RiskMandate.

## 1. The words you need

- **Release:** a new version of an app, sent out to people.
- **Build:** turning the code into an app a phone can install.
- **Signing:** a digital seal on the app that proves who made it. Phones refuse apps without a valid seal.
- **Tester:** a person who installs an app before it is public. On iPhone through TestFlight (Apple's testing app); on Android through Firebase (Google's free testing service) or a download link.
- **Review:** Apple or Google checking an app before strangers can install it.

## 2. How we release today

| Step | iPhone (works since Sunday 8 November) | Android (not built yet) |
|---|---|---|
| Where the code lives | One folder of code for three apps (PrompTugal, Team, RiskMandate) | Two plans, two places: Angelo's PrompTugal Android app and Dinis's RiskMandate Android app |
| What starts a release | An agent saves a change; robots on GitHub do the rest | Planned: the same |
| Building | Only on a Mac. Rented Macs or Dinis's laptop | Any computer |
| Signing | Certificates and profiles made by hand in Apple's website | Planned: Angelo's builds are test-only (no real seal); Dinis's plan uses Google's signing |
| Getting it to testers | TestFlight, automatic for the team | Planned: a download link (Angelo) or Firebase (Dinis) |
| Strangers installing | Apple's review, about 24 hours for the first one | Planned: later |

## 3. The friction: what slows us down, with evidence

Each item comes from the iPhone app's own notes of 7 and 8 November, or the two Android plans.

### On iPhone

1. **The queue for Macs.** GitHub's rented Macs ran about two jobs at a time, so one full check took **one to two hours**. On Dinis's laptop it took **10 to 25 minutes**.
2. **The certificate limit.** Each automatic run made a new Apple certificate. At 05:42 on Sunday the account hit Apple's limit and **every upload failed** until the method was changed.
3. **Hand work in Apple's websites.** About **an hour** of setup per app: app records (Apple's system cannot make them for us), certificates, profiles, permissions and tester groups.
4. **Review for anyone outside the team.** Apple's beta review took **about 24 hours** for the first version.
5. **Moving code between shared parts** caused most of the night's failed builds: a piece moved to a place the app could not see.

### On Android

6. **Two efforts, not one.** Angelo approved a PrompTugal Android app on 7 November; Dinis planned a RiskMandate Android app on 8 November. Different signing, different delivery, different places. That doubles the work and the decisions.
7. **Google's account for a company** needs a company registration number (D-U-N-S), which can take weeks.
8. **Phones that update themselves** need to be company-owned and reset to factory settings first.

### On both

9. **Agents cannot hold the secret keys.** No agent can add secrets to GitHub, so a person must do the signing setup by hand on each platform. This is right for safety, but nobody has made it quick.
10. **Two lists of what to test, two places to look.** Nothing shows, in one place, which version each tester has on each phone.

**The pattern:** the hard parts are not the code. They are the one-off setup with Apple and Google, and the waiting.

## 4. The way of working I propose: one release line, two platforms

Think of one factory line that splits only at the very end into an iPhone door and an Android door.

1. **One list of our apps for both platforms.** Each app has one name, its iPhone identity and its Android identity, and which folders belong to it. The iPhone side already has this list; Android adds a column to it.
2. **One trigger.** An agent saves a change. One new version number is given to both platforms, so the iPhone and Android apps always match.
3. **Only rebuild what changed**, on both platforms (the iPhone side already does this).
4. **Most changes need no new app at all.** Our apps show the website and the team's data. A change to the website or the data reaches both phones within minutes, with no review. Only new phone features (the camera, the calendar, notifications) need a new app.
5. **The one-off setup becomes a checklist a person follows once**, with a script that checks each step. The iPhone checklist exists (about 60 minutes); Android gets the same.
6. **Testers get both the same way:** a notification and one tap. iPhone: TestFlight for the team, with no review. Android: Firebase, with no review.
7. **One "what to test" note** written once, sent to both.
8. **One status page:** which version is on which platform, and whether anything is stuck.
9. **An always-on Mac** for the iPhone builds, so the iPhone side is as fast as Android. This is the biggest single speed-up.

### What has to happen, and who decides

| Action | Who |
|---|---|
| Merge the two Android efforts into one, using the same plan as iPhone | Dinis and Angelo |
| Buy or lend an always-on Mac for builds (or pay for faster rented Macs) | Dinis |
| Start the Google company account now (the registration number takes weeks) | Dinis |
| Write the Android checklist and the matching robot steps | An Android agent, from the brief in your prompt library |
| One status page for both platforms | A developer agent |

The step-by-step brief for the agents is in your prompt library: "mobile release line".

## 5. The product idea: a release line others can buy

**In one sentence:** a service that takes a team's iPhone and Android app from "saved change" to "on testers' phones" with one setup, where AI agents do the work but never hold the keys.

### Who has the problem

- **Small teams building the same app for iPhone and Android**, especially teams using AI agents to write code. The agents write code fast; the release is the slow part.
- **Our own evidence:** two nights of work by a skilled team went mostly on setup, signing and waiting, not on the app.

### What it does

1. **A guided setup** that walks a person through Apple's and Google's websites once, checks each step, and stores the keys safely. (Our 60-minute checklist, turned into a wizard.)
2. **One list of apps, one trigger, both platforms**, as above.
3. **Testers on both platforms the same way.**
4. **A status page** for both platforms.
5. **Agent-safe by design:** agents can build and send out apps but can never see or change the keys. This is RiskMandate's idea applied to releases: the agent's key opens only the doors its job needs.

### Who else does part of this (as I know them; to check)

- **Expo (EAS):** builds and sends both platforms, but only for apps written in React Native.
- **Fastlane:** free tools that automate Apple and Google steps, but a team must set them up and run them.
- **Codemagic and Bitrise:** rented build machines for mobile apps, both platforms.
- **Firebase App Distribution:** sends test versions, mainly for Android; iPhone testers still need extra steps.

**The gap we could fill:** apps written natively (Swift for iPhone, Kotlin for Android) by teams that use AI agents, with the keys kept away from the agents, and the one-off setup made quick.

### How to test the idea this week, at the summit

1. Web Summit has a developer programme, so developers are there.
2. Ask ten developers three questions:
   - How long does your first iPhone release take?
   - Who holds your signing keys, and do your AI tools ever touch them?
   - Would you pay for one setup that sends to both phones?
3. Write their answers down that evening. Ten answers tell us if the problem is real for others.

## 6. What is done, and what is not

| Item | State |
|---|---|
| How releases work today, on both platforms | **Done** (this page) |
| The friction, with evidence | **Done** |
| One way of working for both platforms | **Designed** (this page and the brief) |
| The brief for the agents who would build it | **Done** (your prompt library) |
| Building it | **Not started.** It needs Dinis's and Angelo's yes, and the decisions in the table above |
| The product | **An idea.** It needs the ten conversations first |
