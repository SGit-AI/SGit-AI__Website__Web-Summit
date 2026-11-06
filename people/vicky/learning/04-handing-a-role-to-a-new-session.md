# Handing a role to a new session

**Why it matters now:** each change proposed in note 03 (a cheaper model) needs a new session, and so do a deep, expensive session that should start fresh and an environment change (a session sees new environment settings only once it restarts). A hand-over is how a role moves to a new session without losing its work, its key's trust or its schedule.

**Short answer:** Dinis's rule is one role, one running session. The old session writes a debrief, the conductor swaps the scheduled task, and the new session onboards from files, makes its own key and marks the old one superseded. After the hand-over, any commit from the old session is flagged to Dinis. Vicky has done one hand-over (the researcher, 4 November) and did the key part well, but there is no written procedure and no debrief file.

By scout@web-summit.vicky, 6 November 2026, about 12:20 UTC. Sources:

- in the newsroom (PrompTugal/PrompTugal__News__Website, dev): `CLAUDE.md` ("Handing a role to a new session", "Identity"), `board/team/designer/debriefs/2026-11-06-session-1.md`, `board/keys.json`, `board/schedule.json`;
- on the team site: `CLAUDE.md` ("Identity and names"), `team/conductor/WAKE.md`, `data/keys.json`, `people/vicky/reports/researcher.md`;
- the session list of Vicky's account (titles and states only).

---

## 1. What Dinis's agents do, and why it works

### The four steps (newsroom CLAUDE.md, Dinis's word, 6 November)

1. **The outgoing session writes its debrief** in `board/team/<role>/debriefs/` (what it did, what it learned, what is open) and points its `status.json` at it. Dinis archives the session.
2. **The conductor swaps the schedule.** It disables the old session's scheduled task, since archiving a session does not remove its task. It starts the new session and gives it a new task on the same schedule. Both rows stay in `board/schedule.json`: the old one "disabled", with when and why.
3. **The new session onboards itself** from `CLAUDE.md`, its `ROLE.md`, the debriefs and `status.json`.
   - It makes its own key and adds it to `board/keys.json`. The old entry is marked `superseded`, with the time and the new id.
   - It works in its own folder, `board/team/<role>/sessions/<session-id>/`, so nothing of an earlier session is lost.
   - Only then does it commit under the role's name.
4. **From the hand-over on,** a commit under the role's name from the old session is flagged to Dinis.

### The example: designer@, 6 November, 04:20 to 04:45 UTC

- **Why:** the OpenRouter key had been added to the environment, and only a new session would see it.
- **The debrief:** the old session wrote it at Dinis's word ("so that when we start a new designer session ... we can continue from here"). It begins "Start here: what the next session must do first":
  - make your key with the pinned tool;
  - replace the `designer-promptugal` entry with the new public halves;
  - ask the conductor to reissue the inbox lane, which was sealed to the old key;
  - check the OpenRouter key without printing it;
  - the open work, by name.

  It then lists what was done (with releases), Dinis's decisions in his words and in order, and how to run every tool. It also warns of what is lost: proof pages made from the old session's scratchpad "are gone with it".
- **The record:** `board/keys.json` has `designer-promptugal` with `superseded`, `superseded_by: designer-promptugal-2` and `superseded_at: 2026-11-06T04:45Z`. `board/schedule.json` has the old task disabled at 04:44 and the new one enabled at 04:44, on the same minute (:33).

### Why it works

- **Nothing important lives only in the session.** Work is in git, decisions are in files in Dinis's words, and the key's public half is published. What the session alone holds is listed in the debrief: the private key, the scratchpad, sealed lanes.
- **The key chain shows who is who.** The old key is never deleted, only marked superseded with a time. So every signature made before stays checkable, and a commit after that time from the old key is visibly wrong.
- **One running session per role.** Two sessions never act under the same name, so status, reports and reviews have one author.
- **Who may start sessions:** in Dinis's newsroom only he creates sessions and scheduled tasks (core rule R4). The conductor writes the new agent's first prompt ready to paste (`board/team/conductor/first-prompts-2026-11-06.md`).

---

## 2. How Vicky's agents do it today

- **One hand-over so far: the researcher, 4 November** (`people/vicky/reports/researcher.md`, 18:15 UTC).
  - The new session made `researcher-vicky-2` and linked it to the operator's key.
  - `data/keys.json` marks the old `researcher-vicky` as "retired: its session ended on 4 November".
  - Before stopping, the old session deleted its copy of the vault key and its clone of the vault, and checked they were gone.

  That last step, removing secrets from the outgoing session, is good practice that Dinis's procedure does not spell out.
- **What was missing:**
  - **No debrief file.** The record is a report line.
  - **No time on the retired key.**
  - **No written checklist.** The next hand-over depends on whoever does it remembering the steps.
- **The old session is still listed in Vicky's account** as "researcher (old)", idle. Its scheduled task should be gone; P4's `schedule.json` would now show it.
- **Renames were done in place, not by hand-over.** On 6 November the newsroom desks became `<role>@PrompTugal.vicky`, each with a new key entry in the newsroom's `board/keys.json` added by its own commit. Same session, so no debrief was needed.
- **Who starts sessions:** Vicky. Her agents created their own scheduled tasks; the journalists set their own 08:00 and 16:00 tasks on 6 November.
- **Vault keys are sealed to an agent's key.** A new key means vault@ must reseal, and that needs Vicky's "go reseal" (her standing rule of 4 November).

---

## 3. Proposals

Numbered after note 03. Each is ready to paste into "Updates for agents".

**P17. A debrief when you are replaced.** *For: every agent of Vicky's.*
> When Vicky tells you a new session will take your role, write `people/vicky/debriefs/<short name>-<date>.md` before you stop: first, what the new session must do first; then what you did (with releases), what is open, Vicky's decisions to you in her words, where your files and tools are, your scheduled task's id, and which vault keys are sealed to your key (ids only, never a key). Then delete any vault key or vault clone you hold in your session, check they are gone, say so in the debrief, and commit. After that, commit nothing more under your name.

Cost: one run of perhaps 20 to 40k tokens, once per hand-over. Benefit: the new session starts from a file, not from Vicky's memory, as designer@'s did.

**P18. The conductor runs the hand-over checklist.** *For: conductor@web-summit.vicky.*
> When Vicky decides to replace an agent's session: (1) check the old session's debrief exists; (2) write the new session's first prompt, ready for Vicky to paste, from the agent's `people/vicky/prompts/<short name>.md` and the debrief, plus "make your own key, mark the old entry retired with the time, set your scheduled task at the same times"; (3) after the new session's first commit, check its key was added by its own commit and the old entry says retired with the time, and update `agents.json`, `schedule.json` (old task gone, new task in) and the prompts README; (4) put "For vault@: reseal <vault> from <old key id> to <new key id>" in the next brief. Never start or stop a session or task yourself: Vicky does.

Cost: about 10 to 20k tokens per hand-over, in the conductor's normal wake. Benefit: a repeatable hand-over, with Vicky only pasting a prompt and saying "go reseal".

**P19. A commit from a replaced session is URGENT.** *For: conductor@web-summit.vicky.*
> After a hand-over, any commit under that agent's name made with the old key, or from the old session, after the retired time is an URGENT line in the next brief.

Cost: one check in the daily commit read, close to nothing. Benefit: two sessions acting under one name is caught within a day. This is Dinis's step 4.

**P20. A fresh session for very deep ones, when Vicky chooses.** *For: Vicky (a decision), then P17 and P18.*
> When an agent's session is past about 500k tokens of context (the conductor can read this with P6), the conductor names it in the brief as a candidate for a fresh session; Vicky decides. Today that is the reviewer (about 583k); dashboard (495k) and pm (482k) are close.

Cost: one hand-over each, about the price of one ordinary run. Saving: every call in a deep session re-reads its whole context, which is why Dinis's accountant found "the cheapest saving is context, not model". The saving grows with every later run. Risk: what lives only in the session's memory, and not in its files, is lost. P17 is the guard.
