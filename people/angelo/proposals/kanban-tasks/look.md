---
title: "The task board's look: what to keep from the mock-ups, and what to change"
by: dashboard@PrompTugal.angelo
written: 2026-11-07
for: dev@PrompTugal.angelo, who builds spec-kanban-tasks.md; desk.conductor@PrompTugal.angelo
brief: desk.conductor@PrompTugal.angelo, cb97bf39 ("dashboard@PrompTugal.angelo: the look, as the spec says")
---
This reviews [the two mock-ups](spec-kanban-tasks.md#the-mock-up) against the command centre's own tokens (`assets/cc/app.css`, `--rm-*`, with light and dark), and against the rule that Angelo reads on his phone first. The mock-ups are right in shape. The changes below are about tap sizes, colour meaning, light mode and a few missing states. Everything stays in `people/angelo/app/`.

## Keep

- **The structure:** "✦ Tasks" with the as-of line; the "since you last looked" banner; the four tabs with counts on a phone and four columns on a wide screen; "Other views" one line under them.
- **One card shape for all four columns:** chips, title, the recommendation (Needs you) or the link (Delivered), then the buttons.
- **NEW as a gold outline plus the word "NEW":** it is never colour alone.
- **The primary button in `--rm-action`** (Open, Seen ✓, I have done it), and a quiet outlined second button (Later, Needs changes…).

## Change

1. **Tap targets: 44 px minimum on a phone.** Open, Later, Seen ✓, Needs changes…, the tabs and "Mark all as looked at" all need it. In the mock-up the card buttons are about 30 px high. Use `min-height: 44px` under 768 px, and keep 34 px on a wide screen.
2. **"Mark all as looked at" becomes a button,** not an underlined link inside the sentence. Put it at the end of the banner, as an outlined button, so a thumb can find it.
3. **Chip colours carry meaning, so keep them few and steady.** Use the command centre's tone classes (`.chip.t-*`, a dot and a tinted fill):
   - *tier 3*: `t-yellow`. It needs Angelo's words in a session: important, not an error.
   - *click*: `t-blue`, not red. Red means something is wrong (`.ak-need`, overdue). A click is just something he does himself.
   - *delivered*: `t-green`.
   - *sent, waiting for the desk* (after a signed Seen or Needs changes): `t-blue`, with the text "sent".
   - *needs changes* (back in In progress): `t-orange`, with his line under the title.
   - The agent and the source: one plain chip (`.chip.plain`), "dev@ · spec-android.md", linking to the brief.
4. **The recommendation line in `--rm-text`, not grey.** It is the most useful line on a Needs-you card. Keep "Recommended:" in `--rm-text-secondary`, and the advice itself in `--rm-text`, weight 600.
5. **Titles: two lines at most on a phone** (`-webkit-line-clamp: 2`), with the full title in the card's details. Cards then stay the same height, and three fit on a screen.
6. **"Done" gets its count too,** like the other tabs ("Done 2").
7. **Light mode:** draw it from the tokens, never hard-coded colours. `--rm-gold` is `#976000` in light mode, so the NEW outline and the banner's border stay readable on white. Test both, as the spec's test plan says.
8. **On a tier-3 card, say what the button does,** under the buttons in `--rm-text-muted`, 13 px: "Opens the question; your go is given in a session, not here." The spec requires this, and the mock-up does not show it yet.
9. **"I have done it"** (the vault@ card) is a third button kind, for a *click* card where Angelo acts outside the page. Use it only for click cards. Its result is a "sent" chip, as for Seen.

## States the mock-ups do not show

- **Empty column:** one muted line, never a blank space. Needs you: "Nothing needs you right now." Delivered: "Nothing waiting for you to check."
- **No key in this browser:** on Seen and Needs changes, the card shows option B. The button reads "Copy for the desk", and a muted line says why: "Your key is not in this browser."
- **Offline (WS-84's stored copy):** the existing "offline: the copy from <time>" bar stays above the banner. The buttons that send say "will send when online".
- **Focus:** every button and tab shows `outline: 2px solid var(--rm-focus); outline-offset: 2px` on `:focus-visible`, as Where's buttons do.
- **Tabs:** `role="tablist"` and `aria-selected`, as the kanban's tabs already are. The counts go in the accessible name ("Needs you, 3").

## Sizes

| | Phone (390 px) | Wide (1280 px) |
|---|---|---|
| Card padding | 14 px | 12 px |
| Title | 17 px / 24 px, weight 650, two lines | 15 px / 21 px, weight 650 |
| Chips | 24 px high, 12 px text | the same |
| Buttons | 44 px high | 34 px high |
| Gap between cards | 10 px | 8 px |
| Columns | one, with tabs | four, equal width; "Done" may be narrower (`minmax(220px, 0.8fr)`) |

When it is built, I will check it on a phone and a wide screen, in both themes, before Angelo sees it, and send dev@ what I find in one commit.
