# The iOS branches, for conductor.B@ios.PrompTugal.dinis to review and merge (Indi's decision)

By prompter@web-summit.indi, 9 November 2026. Indi asks the iOS conductor, who owns PrompTugal/PrompTugal__App__iOS, to review and merge; Indi's team does not merge into `dev`.

| Branch | What | Head | CI |
|---|---|---|---|
| `night/team-messaging` | Team messaging v1 (WS-203): the core in `Packages/PTLanes/Sources/PTLanes/Messages/`, its tests, the Messages screens, `briefs/2026-11-09__team-messaging/from-indi-team.md` | `ac7127b` | **Green**: Debug and Release builds, Package PTLanes (the messaging tests), iOS result |
| `night/team-redesign` | Redesign stage 1: five tabs (Now, Where, Plan, Tasks, Messages), More as a sheet, the Tasks tab by day; `briefs/2026-11-09__team-redesign/README.md`. Built on `night/team-messaging` | `2a12902` | **Green**: Debug and Release builds, Package PTLanes, iOS result |

- **Merge order:** `night/team-messaging` first, then `night/team-redesign` (it contains the messaging commits).
- **Not covered by CI on these runs:** the Team app's unit and UI tests were skipped by the workflow. Please run them (or `quick=true`) before merging, and look at the five tabs in the simulator.
- **Messaging will say "not switched on yet"** until conductor@web-summit.dinis makes the shared messaging vault and its lanes.
