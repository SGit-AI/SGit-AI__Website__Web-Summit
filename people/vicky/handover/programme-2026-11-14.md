# Hand-over: programme@PrompTugal.vicky, 14 November 2026

From the programme desk's session, at Vicky's word (14 November 2026, in this desk's window: "From today you are reporter@PrompTugal.vicky"; the plan is `people/vicky/plans/2026-11-11-repurposing-handovers.md`). The same session continues as reporter@PrompTugal.vicky, so nobody takes over the programme desk; this note records where its work is and what stays open. Public: no key, token, contact detail, shortlist name or anything from a private vault.

## Where the desk's files are

- **The agenda:** `desks/programme/agenda.json` in the newsroom (PrompTugal/PrompTugal__News__Website, branch dev). 225 items from 10 to 12 November, last changed at 12:45 UTC on 11 November (commit 74ba1180e). Its sessions came from machine reads of Web Summit's schedule, which stopped on 11 November (standing answer 31). Dinis's front page and the derived data (`newsroom/tools/derive.mjs`) read it, so its shape must not change. Its `gaps` list 4 entries from the team's `data/events.json` whose pages answered 404.
- **Thursday's side events:** `desks/programme/side-events-2026-11-12.md` (commit c7d2eb20b): 68 events listed by lisbontechfringe.com; 1 checked at its organiser's own page, 67 left as unchecked pointers (their pages are on Luma or Meetup, which no agent reads by machine).
- **The personal-account twin's notes** (10 and 11 November): `desks/programme/notes/` (run summaries, two hand-overs, the rules it saved).
- **Reports:** `people/vicky/reports/programme.md` on the team site. **Prompts:** `people/vicky/prompts/programme.md` (kept as the record).

## Open

- **The agenda's Web Summit data waits on Dinis.** The freeze (standing answer 31, rule 7) was retired on 14 November (standing answer 63), but the agenda is not re-sourced (standing answer 49), and nothing copied from Web Summit's site is deleted or changed until Dinis decides (standing answer 31, rule 3). No agent owns the file now.
- **The 4 sessions in the agenda's `gaps`** were never found again.
- **The 67 side-event pointers** were never checked by a person; Thursday is over, so they matter only if someone writes about those events.

## The interview shortlist

Handed back to vault@web-summit.vicky on 14 November (commit For: vault@web-summit.vicky): 10 names and 4 reserves, all in the confidential shortlist vault, which also holds its overview script (`tools/build.mjs`) and its audit log. Dinis had not picked when this desk stopped. This session deleted its copy of the vault's key and its clone the same day. The vault's key was sealed to this desk's first key, `programme-vicky` (ids only); vault@ and Vicky keep the key.

## Keys and the scheduled task

- **Keys:** `programme-vicky-2-promptugal` (newsroom `board/keys.json`, made 11 November) is superseded on 14 November by `reporter-vicky-promptugal`. `programme-vicky` on the team site's `data/keys.json` was this desk's first key.
- **Scheduled task:** "programme@PrompTugal.vicky daily run", `trig_01RhHHq7KU16JfguhbU1d7HU`, disabled since 13 November (standing answer 43), not deleted. The reporter has no task until Vicky sets one.

## What this session learnt

- In every fresh container the newsroom clone's `origin` came back as the old SGit-AI address; a `pushInsteadOf` to the PrompTugal address and a check before each push kept every push on the right repository.
- `release.sh` derives the newsroom's data itself; a desk commits only its own folder.
- Keep dropped items in a data file others link to (marked `past`), or the gate breaks a link elsewhere.
- Read a vault audit's result before every push, not only the first one.
- A scheduled wake can arrive hours late: check the time it fired against the rules in force before running it.
