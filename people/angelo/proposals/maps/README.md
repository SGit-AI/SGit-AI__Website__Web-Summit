# The team's maps: every team's agents, each agent's kind, and renamed agents once, a patch for the inventory's keeper

By dev@web-summit.angelo, 6 November 2026, 14:35 UTC wake, from the conductor (145abf13, Angelo's ask about the conductor's runner). Option 1: nothing shared is applied. The patch is for `admin/build/inventory.mjs`'s keeper (dev@web-summit.dinis, through conductor@web-summit.dinis).

## What was wrong

`admin/build/inventory.mjs` keeps only names `<agent>@web-summit.<person>`. So on `/team/map/`, `/team/everything/` and the command centres:

- every agent named `@PrompTugal.<person>` was missing: Vicky's ten renamed newsroom desks (shown only under their old `@web-summit.` names, from the git log) and Dinis's PrompTugal team;
- a renamed agent counted twice wherever both names appeared;
- nothing said how an agent runs: a long session, scheduled wakes into its own session, or a fresh session each run, like the conductor's new runner.

## `inventory-teams-kinds-renames.patch`

1. **Any team:** a name `<agent>@<team>.<person>` counts when its person is on the roster, both from `agents.json` and from this repository's git log. Each agent gets a `team` field (`web-summit`, `PrompTugal`). Names are matched without regard to case, because the git log and `agents.json` spell PrompTugal differently.
2. **Its kind:** `agentKind(session, schedule)`, exported, reads the agent's own `agents.json` entry:
   - `fresh`: a new session each run;
   - `scheduled`: a cron, times or "hourly", not paused or proposed;
   - `long`: a session with no schedule;
   - `''`: nothing declared.
3. **Renamed once:** an entry with `was: "<old name> until …"` makes the old name an alias. Its commits, first and last move to the new name, and the old one no longer shows.

Measured on a local build with the patch:

| | Result |
|---|---|
| Agents counted | 96, of which 19 are from other teams (PrompTugal) |
| Kinds | 43 scheduled, 1 fresh (`conductor-runner@web-summit.angelo`), 26 long, 26 undeclared |
| A renamed agent | `curator@PrompTugal.vicky` carries its 17 commits since 4 November, with `curator@web-summit.vicky` as its alias, shown once |
| The site | The gate passes; `/team/map/` shows the PrompTugal agents |

Two limits:

- **Counts cover this repository only:** Dinis's PrompTugal agents commit to their own repository, so here they show 0 commits.
- **The output shape is unchanged:** fields are only added (`team`, `kind`, `aliases`), so the pages that read the inventory need no change.

## Angelo's command centre (mine, done)

The whole-team map draws the kind as a ring (solid for scheduled, dashed for fresh, none for long) and explains it once. It shows as soon as the map's data carries `kind`. That data comes from `people/angelo/tools/team-map.mjs`, team-collaboration@web-summit.angelo's tool, which needs one field, `kind: a.kind`, on each agent once the patch lands.
