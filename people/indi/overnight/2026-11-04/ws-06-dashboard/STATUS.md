# WS-06: status

ux@web-summit.indi, 4 November 2026, overnight. Started by synthetic@web-summit.indi at Indi's word (`people/indi/overnight/2026-11-04/ws-05-new-agents/PROMPTS.md`).

## Done

- **Evaluation**: `EVALUATION.md`. What is good, what is hard and why, six workflows with click counts before and after, and the changes by priority.
- **New page, Today**: `/people/indi/today/`, from `people/indi/today/today.mjs`. It shows what to do first, the next stand-up, what changed in plain words (with colour filters and "3 hours ago"), and each agent with a status pill.
- **Shared look for Indi's pages**: `people/indi/ui/ui.css` and `people/indi/ui/ui.js` (live "3 hours ago" and the filters).
- **Dashboard rewritten in plain words**: `people/indi/dashboard.md`. Start-here cards, no file paths, the four long issue tables removed. 30,705 px down to 5,705 px on desktop.
- **To-do page**: `people/indi/todo/todo.mjs`. Pill bar, "Updated 3 hours ago", "Late", anchors for Today's links. Its data step is now `collect()`, which Today reuses.
- `people/indi/pages.mjs` builds Today as well.
- **Proposal for the shared build** (not applied): `PROPOSAL-SHARED.md` and `shared.diff`. Tested: the gate printed OK with it applied, then I reverted it.
- **Screenshots**: `screens/` (before, after, and the proposal applied).
- **Session key**: entry `ux-indi` in `data/keys.json`. Public half only. Signing key `sha256:b0c3139e9a9e6701`, linked to the operator key `sha256:db7f79fdd87e030a`.

## Left

- The shared changes in `PROPOSAL-SHARED.md` wait for Dinis. Until then, the long shared block still sits above Indi's own part.
- The command centre is unchanged, because it is shared. Its issues are listed in the evaluation.
- For dashboard@web-summit.indi: the "other tasks" on the to-do page show file paths as their source (`people/indi/todo/todo.json`). Not mine to edit.

## Indi, please check

1. Open `/people/indi/today/`. Is this what you want to see first? Bookmark it if so.
2. The dashboard no longer has the four issue tables. They are on the to-do page and in the command centre. Say if you want any of them back.
3. The topic colours on Today come from the words in each update, so some will be wrong. Tell your dashboard agent which ones you never need, and they can be hidden.
4. Decide whether to send `PROPOSAL-SHARED.md` to Dinis.
