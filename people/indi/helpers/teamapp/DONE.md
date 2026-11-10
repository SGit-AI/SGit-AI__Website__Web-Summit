# Team app, night of 10 November: DONE

From conductor-teamapp@web-summit.indi. For conductor@web-summit.indi, Indi, conductor@ios.PrompTugal.dinis.

## Blocked: nothing left this container

- `add_repo` (push) was refused for both repositories by the session's permission check. The task came as a helper message, not from a person in this session.
- So: no push, no CI, no merge to dev, no TestFlight build, no release of this file. This container has no Xcode, so no build and no screenshots.
- The work is seven commits on stacked local branches, `night/teamapp-1-light` to `night/teamapp-6-messaging`, rebased on dev at 78ce84e (v0.4.87).
- They are in `night-teamapp.bundle`, next to this file. To use it: `git fetch night-teamapp.bundle 'refs/heads/night/*:refs/heads/night/*'`, then push each branch and let the iOS CI run.

## Per change

| # | Change | Status | TestFlight |
|---|---|---|---|
| 1 | Light mode | Coded, untested | none |
| 2 | Tasks: tick animation, "Ticked off" | Coded, untested | none |
| 3 | Where: map button, place detail, team rows | Coded, untested | none |
| 4 | Plan: every session, pills, blocks | Coded, untested | none |
| 5 | No app-switcher cover | Coded, untested | none |
| 6 | Messaging switch-on | Coded, untested | none |

1. **Light mode.** Nothing in dev forces dark: no `preferredColorScheme`, no `UIUserInterfaceStyle`, and the palette has light and dark values. The real fault was white on the pale dark-mode accents (2.3:1). New `Palette.onAccent` (white in light, ink in dark) for badges, send, message avatars and map pins. Contrast tests in both themes. Person avatars keep white on their site colours.
2. **Tasks.** The tick fills and springs, with a haptic, for 0.45 s. The row then moves to "Ticked off", above Late, which folds like the others. Tapping a tick there puts the task back. Reduce Motion skips the pause. "Completed" now holds board-closed tasks only.
3. **Where.**
   - The map entry is a large card with an icon, title and chevron.
   - A detail of up to 80 characters per place, in the same sealed team location message (`place|until|detail`). Older messages still read.
   - "The team" rows ("Indi: at a talk") open to the detail.
   - Zones only, no pin.
4. **Plan.**
   - Source: PrompTugal.news `api/v1/days/<day>.json`. Web Summit has no documented public schedule feed, so I used PrompTugal's, which links each session to websummit.com.
   - Thursday has 55 sessions: our programme, not every Web Summit session.
   - Day pills show days still to come. Days called off come from `assets/live/app-notice.json` (`cancelled_days`), the file the public app reads (dev 3d1acfb), so one change covers both apps.
   - Stage and topic pills come from each session's own place and track, RiskMandate topics first.
   - Morning, afternoon and evening blocks, or by stage. Star to pick. Offline copy.
5. **Switcher.** `PrivacyCover` is removed from the Team shell only. PTCore is unchanged.
6. **Messaging.**
   - New text: "Messaging is off on this iPhone. Switch it on with your details from the team site."
   - A "Switch messaging on" row at the top of Messages, in two taps:
     1. Open my command centre on the team site and copy the details.
     2. Paste, with iOS's PasteButton.
   - It accepts the config, the opened note, or a longer text. It refuses another person's details. The details go in the Keychain and are never logged.
   - The app does not hold the site key: it stays in the browser and cannot be exported. `MessagingDetails.open` (tested) is ready for when it does.

## Checked at the source

Wednesday 11 November is cancelled (Storm Charles, at the government's request); Thursday goes ahead. Press reports (The Portugal News, Yahoo, 10 November). conductor-newsapp@ confirmed it on websummit.com ("Important event update", about 22:25 UTC).

## Left

- Push, CI, iPhone and iPad screenshots, merge to dev, TestFlight.
- The public app was not touched; PTLanes is Team-only.

## Tokens

180,699 without cache reads; 8,462,821 with them (66 calls, no sub-agents). Measured, not appended.
