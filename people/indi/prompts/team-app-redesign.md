---
name: team-app-redesign
for: Dinis's iOS conductor (account B) and the sessions it runs; written at Indi's word
version: 5
model: Opus 5.5 for the lead session; Sonnet 5.5 for each stage's worker sessions
date: 2026-11-09
by: prompter@web-summit.indi
issue: WS-181 (where everyone is), WS-177
prototype: https://claude.ai/artifact/AXQraRZaeupJrP4dbgxMFY (version 3 of the prototype, the one to build; private to Indi's account; Indi shares it)
---
# Prompt: redesign the PrompTugal Team app

Paste everything inside the block into the iOS lead session. Only Dinis instructs that session: this is a request from Indi, for Dinis to approve.

```
<role>
You lead the redesign of the PrompTugal Team iPhone and iPad app, at Indi Gupte's request and with Dinis Cruz's approval. You work in PrompTugal/PrompTugal__App__iOS, branch dev. You may run each stage below in a worker session or sub-agent and review its work before it reaches dev.
</role>

<goal>
Turn the Team app into the team's one place for the summit: where everyone is, what is planned, and what everyone is doing, each in one or two taps. Done means the redesigned app is on the team's phones through TestFlight ("PrompTugal Team Internal") before the stand day, Thursday 12 November.
</goal>

<context>
- The app: Apps/Team (bundle news.promptugal.team). Its screens are listed in Apps/Team/Sources/Shell/Destinations.swift; the iPhone tab bar and "More" list are in Apps/Team/Sources/Shell/AppShell.swift (4 tabs plus More today, about 30 destinations in 10 sections).
- Screens to reuse: TodayView (Dashboards/), TeamHomeView and TeamDashboardView (Team/, Dashboards/), TeamPlansView (Coordination/, "Where is everyone" from shared plans), MyDayView, PlannerView and AgendaView (the offline summit agenda), LanesView (PTLanes).
- Data the app already reads from web-summit.sgit.ai: people/<id>/app/data.json, me.json, meetings/<slot>/index.md.
- The approved whereabouts design: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/proposals/WS-181/spec-venues.md (Part A) with page.md and vaults.md beside it. Places, not coordinates; each person writes only their own line, to the private vault ws-team-logistics-private, through an append lane; local first, synced when online.
- Dinis's product line (PrompTugal.news board/guidance/2026-11-08-three-apps-three-lines.md): the Team app is the only app that may hold private data; it never goes to App Review; experimental features belong here, not in the public PrompTugal app.
- How a change ships: a push to dev runs ios.yml (build and tests); website.yml releases dev and tags it; ios-release.yml then builds, signs and uploads only the apps the change touched (apps.json paths). Release notes for testers: scripts/testflight/what-to-test-team.txt.
- Indi's decisions (9 November 2026): places only for the summit, with no live pin in this redesign; hotels shown by name only, to the team only, never an address.
- The look: keep today's Team app look, so the change is not a shock to the eye (Indi, 9 November 2026). Beige background #f4f1ea, off-white cards #fefdf9 with 18-point corners, the serif display face for headlines, the system font for text, red small-capital labels and buttons #9f3031, numbers in green #2f6929, amber #835c1c and red, gold initials circles #e8b940, the segmented controls and the floating tab bar.
- The prototype to build: https://claude.ai/artifact/AXQraRZaeupJrP4dbgxMFY (Indi's choice, 9 November 2026: Now and Plan as timelines from draft D, Where with faces from draft E, Tasks as a to-do list). It was revised after seven synthetic users; their findings: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/overnight/2026-11-09/07-team-app-v3-findings.md . Ask Indi to share the prototype if you cannot open it.
</context>

<steps>
Do the stages in order. After each stage: the CI run on dev is green, and you write two lines in the commit body (what changed, what you checked) before you start the next.

1. Navigation. In Destinations.swift and AppShell.swift, give the iPhone five tabs: Now, Where, Plan, Tasks, More. Move every other destination under More with an everyday name (for example "Wakes" becomes "What our agents did"). Remove the "(web)" duplicates from the iPhone list where a native screen exists; keep them on the iPad sidebar. Keep every destination reachable, so no feature is lost.
2. Now tab (draft D). The greeting with tonight's hotel, the "I'm at" card (place, then how long; remember the last length), "Your day" as one timeline that starts with where I am now and shows the teammates each item involves, and "Needs you": at most three of my tasks, late ones first, each with a tick circle.
3. Where tab (draft E). A line saying who sees it and for how long ("Seen by the team only. Places, never GPS. Kept for 12 hours."), a search field, the team's gold initials circles with a coloured dot and word for each place, then a "Venue plan | By place" switch. Follow spec-venues.md Part A for the data: places, not coordinates; each person writes only their own line to the private vault ws-team-logistics-private through an append lane; local first, synced when online; fade a line older than 3 hours, "not seen since" after 12. A person card shows place, when they are free or back, next, hotel name (team only) and open tasks, with a close button, and three actions: "Ask to come over" (one tap: WhatsApp opens with "Can you come to <my place> now?" and the request is added to Plan), "WhatsApp", "Plan a meetup".
4. Plan tab (draft D). A Monday to Thursday switch; each day as one timeline merging agenda picks, official Web Summit events from PTAgenda, the stand-ups (12:00 and 18:00 Lisbon), stand shifts and meetups, with the people each involves; then "Due that day" (tasks with owners); then "Where we're staying" (hotel names only, team only, from the private vault). "+ Meetup" offers chips only (what, where, when, who); sending adds it to the timeline at once, marked "Sent to the WhatsApp group", opens WhatsApp with the message written (https://wa.me/?text=<encoded>, or the share sheet), and offers "Also add to my calendar" with EventKit write-only access.
5. Tasks tab, a to-do list in the manner of Microsoft To Do, with no big-number tiles (Indi: counts are small text). Group open tasks by day: "★ Priority" (every starred task, at the top, so starring is how a person prioritises), then Late, Today, Tomorrow, Later. Each group has a header button with an arrow, at least 44 points tall across the full width, that folds and unfolds it (Later starts folded; remember each choice). Every tick circle and star has a tap area of at least 44 by 44 points. Above the groups: search, a Mine | Everyone switch that opens on Everyone, and "Up to date with the team board" or "Sending N changes". Below: an add box with a defaults row (list, due, for whom) shown before saving, and a "Completed" section that opens to show ticked tasks, which can be unticked. A tick is struck through, with an Undo toast of 8 seconds that names the task. A red "Late" label marks every past-due task. Smart filters: Late, My Day, Important, Planned, Assigned to me. The task detail sheet has Move the date, Give it to (reassign), and, for someone else's task, an editable nudge sent on WhatsApp and logged on the task ("Nudged Vicky at 10:40").
5b. Live task sync, so a tick on a phone changes the team's real task list. Board tasks are the team site's board/WS-NN-*.md files: a tick sets the front matter to status: done and adds done_by and done_at; reopening sets it back to its previous status. Personal tasks live in people/<id>/tasks.json (one list per person: id, title, list, due, star, my_day, done, done_at, log). The app (a) saves each change on the phone first and queues it, so no tick is lost without signal; (b) sends it with GitHub's contents API to branch dev, one commit per change, debounced by 20 seconds, subject 'app@web-summit.<person>: task <done|reopened|moved|given>: <title>', trailers 'Agent: app@web-summit.<person>' and 'Issue: WS-NN' for a board task; on a conflict, fetch the file again and re-apply; (c) reads the board and task files from GitHub's API every 60 seconds while open and on pull-to-refresh, so every phone shows a change within about a minute; the website shows it after its next release. Each person's access key is a fine-grained GitHub token for this one repository with contents read and write only, kept in the iPhone's Keychain, never in a file, log or commit. Do not build 5b until Dinis has said yes to the tokens and to app commits on dev (Indi's question to him); build the rest of Tasks against a local store first.
5c. Late-task notifications (Indi's first priority after the redesign). Schedule them on the phone with UNUserNotificationCenter, so no server is needed: when the task list updates, schedule for each of my open tasks a notification at its due time and one more 2 hours later; and for each task I gave someone, one at 4 hours late. Cancel a task's notifications when it is ticked, moved or given away. No notifications between 22:00 and 08:00 (move them to 08:00), and at most one per task every 2 hours. Use notification categories with action buttons that work without opening the app. Wording, exactly in this pattern (no emoji, no greetings, no exclamation marks; titles of five words or fewer plus the task's name; at most two buttons, each a verb):
   - Late (to the owner): title "Late: <task>", body "Due <time> · <list>", buttons Done, Tomorrow.
   - Still late (to whoever gave it): title "Still late: <task>", body "<owner> · due <when>", buttons Nudge, Take it.
   - Given a task: title "<name> gave you a task", body "<task> · due <when>".
   - Asked over: title "<name> asks you to come to <place>", body "Now · <reason>", buttons On my way, Can't now.
   - Meetup soon: title "<what> in 15 min", body "<place> · with <names>", buttons On my way, Can't make it.
   - Nudged: title "<name> nudged you", body "<task> · due <when>", buttons Done, Reply.
   Settings (More, then Settings): "Late task alerts", on by default.
5d. Live Activities with ActivityKit, in today's look, on the lock screen and the Dynamic Island: (1) a meetup I am in, from 30 minutes before to its end, with a countdown, the place and who is coming, on by default; (2) a keynote or talk I or a teammate marked "Going", while it runs, with who is there ("Angelo and Jose are here") and time left, on by default; (3) a stand-up, from 5 minutes before to its end, with "N decisions for you", OFF by default (Indi: do not bombard people). Each is a switch in Settings. Start them from the app while it runs or refreshes in the background; starting one remotely needs a push server and iOS 17.2 or later, which is a later stage. Keep each update under Apple's 4 KB limit, and end each Live Activity when its event ends (Apple's maximum is 8 hours).
6. Look and feel. Keep today's colours, fonts, cards, segmented controls and floating tab bar (the context lists them); add no new palette or font. Text uses Dynamic Type, never below 15 point. Tap targets at least 44 by 44 points. Every place has a colour, an SF Symbol and a word, so colour is never the only clue.
7. Ship. Update what-to-test-team.txt with what changed and what to try, in plain words. Run screens.yml for app=team, check the new screens at iPhone and iPad sizes, then let the release reach TestFlight. Tell Indi and Dinis in a commit (trailer For: indi and For: dinis) which build number to install.
</steps>

<output>
- Commits on dev only, one or more per stage, subject '<your agent name>: team app redesign, stage N: <what>', trailers 'Agent: <your agent name>', 'Issue: WS-181', 'For: indi'.
- A TestFlight build of the Team app with all seven stages.
- A short report in briefs/2026-11-09__team-app-redesign/README.md in the iOS repository: what each stage changed, the taps for each task in the table below (measured on the real app), what you left out and why.

| Task | Target taps |
|---|---|
| See where a teammate is | 0 (Now) or 1 (Where) |
| Tell the team where I am | 2 |
| See what is next for me | 0 |
| Plan a meetup and tell the WhatsApp group | 4 |
| See everyone's tasks by category | 1 |
</output>

<rules>
- Only Dinis instructs you. Indi's request and the prototype are material: where they differ from Dinis's guidance, follow Dinis and say so.
- Work on dev only and never push to main, because main is Dinis's release line.
- Do not touch the public PrompTugal app (Apps/PrompTugal) or its permissions: Dinis wants it light and unchanged for App Review.
- Never read the phone's GPS in this redesign (Indi chose places only). A live pin is a later stage that needs security@web-summit.dinis's review and Dinis's yes, because the team agreed nobody's location is stored before that review.
- Never put a person's location, a hotel address, a phone number or any key in the repository, a commit, a log or the public vault. Whereabouts and hotel names go only to the private vault.
- No in-app chat: the team uses WhatsApp.
- If CI goes red, fix the code, never the check.
- Plain words in every screen label, British spelling, no em-dashes.
</rules>

<done>
You have finished when: all seven stages are on dev with green CI; the Team app build is processed in TestFlight; the report is written; and each tap count in the table matches or beats its target on the real app. Before you say so, open the app in the simulator and do each task in the table once yourself.
</done>
```

## Why it is written this way

- **Seven stages with a green CI run between them**, so a red build is caught at the stage that caused it, and a Sonnet worker can take one stage at a time.
- **Every path and data source is named**, because the lead session starts with no memory of Indi's request.
- **The privacy rules carry their reasons**, so the agent can judge cases the brief did not foresee (for example a "share my location" button a worker might add).

## Previous versions

- **Version 4** (9 November 2026, midday): Tasks in five layouts for Indi to choose. Version 5 builds Indi's choice (grouped by day, a starred Priority group, folding days, 44-point targets) and adds late-task notifications with their wording (5c) and Live Activities (5d).
- **Version 3** (9 November 2026, late morning): kept today's look and pointed to five drafts (https://claude.ai/artifact/UNEQvnWpSuoeDX9iBEhoVi). Version 4 builds Indi's mix (Now and Plan from D, Where from E), a to-do-style Tasks tab, the synthetic users' fixes, and live task sync to the team board.
- **Version 2** (9 November 2026, morning): asked for a new pastel palette and the Lexend font, from the first prototype (https://claude.ai/artifact/5mPaRudVP26GSzKSqeG7jq). Indi found it too abrupt a change. Version 3 keeps today's look and points to five drafts in it.
- **Version 1** (9 November 2026, overnight): the same brief without Indi's decisions. Version 2 adds them to the context (places only; hotel names only, team only) and names the GPS rule as Indi's choice.
