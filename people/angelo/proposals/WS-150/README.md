# WS-150: one decision slide, not two (Angelo's brief, 5 November)

From the 5 November 12:00 stand-up (Angelo's note: the "Open points first: urgent, late, logistics" slide is "really hard to consume, not only it's a lot of info, it's also not focused on urgent or important tasks"), and Angelo's review of the deck the same day.

**Angelo's choices:** no new slides, enhance what is there; and keep the order: "it's good to first go through the updates and overall review and then take action".

1. **Remove** the generic slide 2, "Open points first: urgent, late, logistics" (`team/conductor/tools/show_deck.py`, the `late`, `urgent`, `logi` block). It lists up to 27 rows sorted by date, oldest first (so the top is stale setup items), and 51 of its 73 late items have no owner.
2. **Upgrade, in place near the end**, the meeting's "To decide at this stand-up" slide into **"What needs us today"**, in the layout of `what-needs-us-today-mockup.png`: at most five items, decisions and urgent actions together, ranked by what blocks Lisbon (blocks someone, needs a decision, summit-critical, no owner, due soon); each with one owner, what is needed (Decide, Write, Needs owner) and by when; and one strip at the bottom with the counts slide 2 used to carry (late, of which unowned, with "park them?"; due today; logistics before Lisbon; the board).
3. **Fill it from team-collaboration's ranking** (`people/angelo/tools/standup-show.mjs --deck`, the "Decide now" cards), so each meeting's `.py` no longer writes the list by hand. The five items in the mock-up were picked by hand, as an example.
4. **Keep "Follow-ups, each with an owner"** last, opening with the follow-ups carried from the previous stand-up.

Net: one slide fewer, nothing repeated.

## The draft (team-collaboration@web-summit.angelo, 5 November, 16:00 UTC)

- **`show_deck.patch`** (a `git apply` patch to `team/conductor/tools/show_deck.py`) and **`show_deck.py`** (the patched file, for reading). It removes the generic slide 2 and keeps its counts. After the meeting's own `.py` runs, it replaces that meeting's "To decide now" slide with **"What needs us today"**, or inserts it before "Follow-ups" when a meeting has none. "Follow-ups" always comes last. The meeting's `.py` no longer writes the decision list. If the ranking fails, the meeting's own slide stays.
- **The ranking:** `node people/angelo/tools/standup-show.mjs --rank . <meeting id>` (read-only, JSON). At most five items: the open decisions, plus board issues due within two days that are summit-critical or unowned. Each is scored by needs a decision, summit-critical (print, merch, garments, cards, the stand, travel, offers, leads, the app, outreach), due or late, unowned, and how often it was carried. Each item carries one or two owners, what is needed (Decide, Do, Needs owner) and by when. The strip shows late (and unowned: "park them?"), due today, logistics before Lisbon, and the board.
- **Tested** on today's 12:00 in a scratch checkout: the patch applies cleanly, the deck has 11 slides instead of 12, and "What needs us today" sits before "Follow-ups", which is last. Rendered with the deck's CSS: `what-needs-us-today-draft.png`. The strip reads 73 late, 51 with no owner, 37 due today and 18 logistics, the mock-up's numbers.
- **One difference from the mock-up:** its five were picked by hand, and mixed decisions with "Write" actions. Today the ranking puts five decisions first, because 21 are open. Board actions reach the list only when they are summit-critical, or late or due with no owner. The weights are at the top of the `--rank` block, easy to tune.
- **Not in the patch:** "Follow-ups, each with an owner" opening with the ones carried from the last stand-up. That is the meeting's own `.py` content. team-collaboration writes them in WS-96's record within the hour of each stand-up, for the deck to read.
