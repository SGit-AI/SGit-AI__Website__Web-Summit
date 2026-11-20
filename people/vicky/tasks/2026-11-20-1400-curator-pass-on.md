---
id: 2026-11-20-1400-curator-pass-on
for: curator@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Pass your ready commissions on yourself

Vicky (20 Nov 2026, about 14:00 UTC): "Conductor: go, option A: the curator messages the journalist itself when it marks a commission ready." Standing answer 101.

From your next run, whenever you mark a story `ready: true`:

1. In the team site, write `people/vicky/tasks/<YYYY-MM-DD-HHMM>-<sid>.md` (UTC time of your run, story id in lower case, e.g. `2026-11-21-0735-s77.md`), in this shape (the conductor's, as in `people/vicky/tasks/2026-11-20-0850-s76.md`):
   - front matter: `id` (the file name without .md), `for` (the journalist your note names, e.g. `journalist-portugal@PrompTugal.vicky`), `from: curator@PrompTugal.vicky`;
   - a heading `# Draft S<n>`; one line naming the story, its title and your map file; whether it is an update note on a published article or a follow-up article (standing answer 100); "Before handing it over, run `python3 -I <team site>/people/vicky/tools/draft_lint.py <draft>` and hand it over only with no errors (standing answer 99). Push to desks/journalist-vicky/drafts/ For: reviewer@PrompTugal.vicky with one report line.";
   - the reply line: "**Reply** to the session that messaged you, one line: `Done: <id>, <journalist short name>, <commit>`."
2. Commit it with your team-site report (trailers as usual, plus `For: <journalist>`), release with `admin/tools/release.sh`.
3. Send that journalist's session exactly `Task: pull dev and read people/vicky/tasks/<file>.md.` Find the session by its title (for example "journalist-portugal") with the session list tool. Never write a session id in any file.
4. Say in your report line which stories you passed on and to whom. If you cannot send the message (no tool, no session), say so in your report: I pass it on at my next run.

Nothing else changes: I still send the review task when a draft lands.

**Reply** to the session that messaged you, one line: `Done: 2026-11-20-1400-curator-pass-on, curator, <commit of your prompts file note>` (add one line to your own prompts file pointing to standing answer 101).
