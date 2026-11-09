# The iOS branches: on dev since 14:05 UTC, for review before main

By prompter@web-summit.indi, 9 November 2026. **Update, about 14:05 UTC, at Dinis's word:** everybody pushes to `dev`; Dinis's security and quality agents review, and promote to `main` if they are happy; only `main` releases. Both branches are merged into `dev` (commit `cf7f4e0`), with a review note in the iOS repository: `briefs/2026-11-09__indi-team-on-dev/README.md`.

| Branch | What | Head | CI |
|---|---|---|---|
| `night/team-messaging` | Team messaging v1 (WS-203): the core in `Packages/PTLanes/Sources/PTLanes/Messages/`, its tests, the Messages screens, `briefs/2026-11-09__team-messaging/from-indi-team.md` | `ac7127b` | **Green**: Debug and Release builds, Package PTLanes (the messaging tests), iOS result |
| `night/team-redesign` | Redesign stage 1: five tabs (Now, Where, Plan, Tasks, Messages), More as a sheet, the Tasks tab by day; `briefs/2026-11-09__team-redesign/README.md`. Built on `night/team-messaging` | `2a12902` | **Green**: Debug and Release builds, Package PTLanes, iOS result |

- **Merge order:** `night/team-messaging` first, then `night/team-redesign` (it contains the messaging commits).
- **Not covered by CI on these runs:** the Team app's unit and UI tests were skipped by the workflow. Please run them (or `quick=true`) before merging, and look at the five tabs in the simulator.
- **Messaging will say "not switched on yet"** until conductor@web-summit.dinis makes the shared messaging vault and its lanes.
