# WS-150: one decision slide, not two (Angelo's brief, 5 November)

From the 5 November 12:00 stand-up (Angelo's note: the "Open points first: urgent, late, logistics" slide is "really hard to consume, not only it's a lot of info, it's also not focused on urgent or important tasks"), and Angelo's review of the deck the same day.

**Angelo's choices:** no new slides, enhance what is there; and keep the order: "it's good to first go through the updates and overall review and then take action".

1. **Remove** the generic slide 2, "Open points first: urgent, late, logistics" (`team/conductor/tools/show_deck.py`, the `late`, `urgent`, `logi` block). It lists up to 27 rows sorted by date, oldest first (so the top is stale setup items), and 51 of its 73 late items have no owner.
2. **Upgrade, in place near the end**, the meeting's "To decide at this stand-up" slide into **"What needs us today"**, in the layout of `what-needs-us-today-mockup.png`: at most five items, decisions and urgent actions together, ranked by what blocks Lisbon (blocks someone, needs a decision, summit-critical, no owner, due soon); each with one owner, what is needed (Decide, Write, Needs owner) and by when; and one strip at the bottom with the counts slide 2 used to carry (late, of which unowned, with "park them?"; due today; logistics before Lisbon; the board).
3. **Fill it from team-collaboration's ranking** (`people/angelo/tools/standup-show.mjs --deck`, the "Decide now" cards), so each meeting's `.py` no longer writes the list by hand. The five items in the mock-up were picked by hand, as an example.
4. **Keep "Follow-ups, each with an owner"** last, opening with the follow-ups carried from the previous stand-up.

Net: one slide fewer, nothing repeated.
