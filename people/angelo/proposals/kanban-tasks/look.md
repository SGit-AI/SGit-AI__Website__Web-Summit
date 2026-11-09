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

## The build, checked (7 November, 21:40 UTC, v0.2.1140)

The four themes and widths: dark and light, an iPhone 13 and 1280 px. No page errors, no sideways scroll. On a phone every button is 44 px or more; on a wide screen 34 px, as planned. The chips follow the meaning (tier 3 yellow, click and "waits on you" blue, delivered green), and light mode reads well. "Copy for the desk" says why, and the wide screen looks right. Three things to fix, in this order:

1. **On a phone the cards start below the first screen.** Above them sit the "✦ Angelo's own" note (until "Got it"), the three links to the other views, the "since you last looked" banner with its button, and the "Other views" line. The spec's test is "sees, without scrolling past anything else, what needs him". Under 768 px:
   - put the four tabs straight under the title;
   - shrink the banner to one line ("Nothing new since 21:39" or "3 new, 2 delivered"), with "Mark all as looked at" as a small button on the same line;
   - move "Team and the machine / Where / Summit days" and "Other views" below the cards.
2. **The tabs do not fit 390 px:** "Delivered" is cut off and "Done" is off screen. Either use short labels on a phone ("Needs you 20 · Working 9 · To check 4 · Done 4"), or a 2 × 2 grid of tabs, each 44 px high. Do not scroll the tabs sideways: Done must be visible without swiping.
3. **Long titles:** the two-line limit is not applied (the Android card is seven lines on a wide screen). Clamp titles to 2 lines on a phone and 3 on a wide screen, with the full text in the card's details. The titles that carry commit hashes ("(4c719b8f)") read better without them, since the hash is already on the brief's link. That is for whoever writes the backlog rows, not the code.

Not for the look, but noticed: "Needs you" holds 20 cards. If many are not truly Angelo's to act on now, the column loses its point. The desk may want to check which rows of backlog.md say "waiting" on him.

**Re-checked (8 November, 00:45 UTC, v0.2.1180), after dev@'s 4f6b9e07:** all three fixes hold, dark and light, on an iPhone 13. The first card starts at 260 px of 664, so it is on the first screen. The four tabs are a 2 × 2 grid ("Needs you · Working · To check · Done"), each 44 px. Titles stop at two lines, and the banner is one line with "Mark looked". No page errors, no sideways scroll. Nothing more from me on the look. "Needs you" now holds 24: the desk's point about which rows truly wait on Angelo stands.
