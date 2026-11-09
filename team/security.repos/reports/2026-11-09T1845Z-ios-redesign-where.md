# Focused review: Team app redesign 1.1 and stages 2 to 4 (Now, Where, Plan) (9 November 2026, 18:45 UTC)

By security.repos@web-summit.dinis (WS-188, WS-181). conductor@web-summit.dinis asked for it by message at 18:14. Read only.
- **What I read:** PrompTugal/PrompTugal__App__iOS `dev`'s `2f3fb58` (redesign 1.1), `7306842` (stages 2 to 4) and merge `5e50a3a`, with a focus on location in "Where".
- **Earlier coverage:** run 5's scan included these commits. This is the line-by-line read.

## Verdict

**No finding. The location point holds, and more strictly than asked:** the Team app reads no location at all.

| Point asked | Result | Where |
|---|---|---|
| Location read only with the person's consent | **Holds: no location is read.** There is no CoreLocation, `CLLocationManager`, `requestWhenInUseAuthorization`, `showsUserLocation` or location button anywhere in `Apps/` or `Packages/` on `dev`, and no `NSLocation…` purpose string in any project or xcconfig. A "place" is a word the person taps ("I'm at …"), never GPS. | `Apps/Team/Sources/Redesign/RedesignParts.swift:6-8, 71-120` |
| Kept on the device or in the summit vault, never in the repo | **Holds.** A place is kept in `UserDefaults` on the iPhone (`PlaceShare`), with an expiry (`until`). It is shared only when the person taps, as a sealed `kind: "location"` message to the team group over WS-203 messaging (`store.send(..., group: "team", kind: "location")`, line 100), so the lane server never sees it. Until messaging is on, it stays on the phone, and the app says so. Nothing is written to the repository. | `RedesignParts.swift:73-104` |
| Zones by default | **Holds.** Places are a fixed list of named zones (`TeamPlace`). Stale places show as "Not seen". Other people's places are read only from opened team-group messages. | `RedesignParts.swift:108-120`, `RedesignTabs.swift:96-127` |
| Other data | Meetups are kept in `UserDefaults` and, if the person chooses, sent sealed in Messages or handed to the system share sheet (WhatsApp, Messages), which the person sends. There are no contact details and no network calls beyond messaging. | `RedesignTabs.swift:182-193, 293-344` |
| The event app's line | **Holds.** All the changes are in `Apps/Team/`, plus one display tweak in PTAgenda's `MyDayView.swift`. The App Store event app gains no permission. | (diff) |

## For later

A brief on `dev`, `802ba88` ("the news app from Dinis's first real use … location while in use"), plans **location for the public event app**. That would add a permission and change the App Store privacy answers. Under content/apps.md it must be stated in the commit and the privacy manifest when it comes. I will check it then.

*security.repos@web-summit.dinis · For prompter@web-summit.indi and conductor@web-summit.dinis.*
