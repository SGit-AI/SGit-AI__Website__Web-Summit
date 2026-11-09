---
name: team-app-redesign
for: Dinis's iOS conductor (account B) and the sessions it runs; written at Indi's word
version: 3
model: Opus 5.5 for the lead session; Sonnet 5.5 for each stage's worker sessions
date: 2026-11-09
by: prompter@web-summit.indi
issue: WS-181 (where everyone is), WS-177
prototype: https://claude.ai/artifact/UNEQvnWpSuoeDX9iBEhoVi (five drafts in today's look; private to Indi's account; Indi shares it)
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
- Five clickable drafts in that look, from almost unchanged (A, "Familiar") to people first (E, "Faces"): https://claude.ai/artifact/UNEQvnWpSuoeDX9iBEhoVi (private to Indi's account; ask Indi to share it). Build the draft Indi picks; until Indi picks, build draft A, the smallest change.
</context>

<steps>
Do the stages in order. After each stage: the CI run on dev is green, and you write two lines in the commit body (what changed, what you checked) before you start the next.

1. Navigation. In Destinations.swift and AppShell.swift, give the iPhone five tabs: Now, Where, Plan, Tasks, More. Move every other destination under More with an everyday name (for example "Wakes" becomes "What our agents did"). Remove the "(web)" duplicates from the iPhone list where a native screen exists; keep them on the iPad sidebar. Keep every destination reachable, so no feature is lost.
2. Now tab. One screen, built from TodayView and TeamHomeView: the next item for me (with how long until it starts), the "I'm at" place buttons, a row of the team (one circle per person, coloured by place, tap for details), and "Needs you" (at most three items). Show the person picker only when no person is chosen.
3. Where tab. Follow spec-venues.md Part A: a list grouped by place, and a "Venue plan" view (a simple drawn plan of MEO Arena, Pavilions 1 to 5, Pavilhão de Portugal and our stand, not a map tile). Updating my place is two taps: a place, then how long (30 min, 1 h, 2 h, rest of day). Fade a line older than 3 hours; older than 12 hours, show "not seen since". Write updates to the local store first and send them on the append lane when online. A person sheet shows place, until, next, hotel name (team only) and two buttons: "Message on WhatsApp" and "Meet here".
4. Plan tab. A Monday to Thursday day strip. One list per day that merges the agenda picks, the official Web Summit events from PTAgenda, the team's stand-ups (12:00 and 18:00 Lisbon) and stand shifts, and team meetups, each with a colour key. "+ Meetup" opens a sheet with four choices (what, where, when, who) and two actions: add it to the team plan in the private vault and open WhatsApp with the message written (https://wa.me/?text=<encoded message>, or the share sheet if WhatsApp is not installed); and add it to the phone's calendar with EventKit (write-only access, with its usage string in Apps/Team/Config). Below the list, "Where we're staying": hotel names grouped by hotel, from the private vault only.
5. Tasks tab. Group every person's open tasks from people/<id>/app/data.json into six categories: Outreach, Meetings, The stand, Content, Logistics, Agents. Show done / total and a progress bar per category, and the filters Mine, Everyone, Overdue. If a task has no category, put it in the category its title fits best and say in the commit how you mapped them.
6. Look and feel. Keep today's colours, fonts, cards, tiles, segmented controls and floating tab bar (the context lists them); add no new palette or font. Text uses Dynamic Type, never below 15 point. Tap targets at least 44 by 44 points. Every place has a colour, an SF Symbol and a word, so colour is never the only clue.
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

- **Version 2** (9 November 2026, morning): asked for a new pastel palette and the Lexend font, from the first prototype (https://claude.ai/artifact/5mPaRudVP26GSzKSqeG7jq). Indi found it too abrupt a change. Version 3 keeps today's look and points to five drafts in it.
- **Version 1** (9 November 2026, overnight): the same brief without Indi's decisions. Version 2 adds them to the context (places only; hotel names only, team only) and names the GPS rule as Indi's choice.
