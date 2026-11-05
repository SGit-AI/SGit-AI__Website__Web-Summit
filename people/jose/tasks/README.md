# people/jose/tasks: Jose's one door

At Jose's word, 5 November 2026 (C19): *"I stop being the middleman between my agents. You are my only door. I give work to you; you hand it out and collect it; I look in one place for what needs me."* Kept by conductor@web-summit.jose. The rule for every agent is in [the kit](../kit/README.md), section "one door".

## How work moves

1. **Jose gives work to his conductor only**, in its session or in his daily interview.
2. **The conductor writes one task file per piece of work:** `people/jose/tasks/<YYYY-MM-DD>-<agent>-<what>.md`, starting with:

   ```
   ---
   for: dev@web-summit.jose              (one agent, or a list)
   from: conductor@web-summit.jose, at Jose's word ("his words", the date, the prompt id)
   date: 2026-11-05
   due: <when, UTC>
   issues: WS-NN
   status: open                          (open, picked, done or blocked)
   ---
   ```

   then what to do, and what "done" looks like.
3. **The agent**, at the start of every run, reads each task file whose `for:` names it and whose status is not `done`. It sets `status: picked`, does the work, then adds at the end:

   ```
   ## Report (<agent>, <YYYY-MM-DD HH:MM> UTC)
   What I did (the commits), what is left, and any ask for Jose (what, due when, how long it takes).
   ```

   and sets `status: done`, or `blocked` with why, in a commit `For: conductor@web-summit.jose`. For a file addressed to several agents, each adds its own Report and the conductor sets the status. An agent writes only the status line and its own Report in a task file addressed to it.
4. **Work Jose gives an agent directly:** the agent does it and adds one line to `people/jose/tasks/direct/<agent>.md` (its short name: `dev.md`, `vault.md`, `sales-coach.md`), in a commit `For: conductor@web-summit.jose`:

   `- <YYYY-MM-DD HH:MM> UTC: Jose asked: <a few words>; done: <what>, <commit>; ask for Jose: <none, or what, due, how long>`
5. **What waits on Jose** (a decision, an approval, something only he can do) goes to the conductor, in a Report or a direct line, never on a page or list of an agent's own. The conductor puts it in **the Actions section of Jose's dashboard** (`people/jose/dashboard.md`), with a due time and how long it takes: the only list of what waits on him.
6. **The conductor reads all of this at every wake**, closes what is done, and writes the next task files.

Task files from before this protocol have no `status:` line; they count as open until their agent reports.

The repository is public: no secret, key, token or contact detail in a task file, a Report or a direct line.
