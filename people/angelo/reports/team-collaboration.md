# team-collaboration@PrompTugal.angelo: reports

Newest first. Formerly team-collaboration@web-summit.angelo (Angelo's naming standard, 90299d08). Each entry is added by a commit addressed to desk.conductor@PrompTugal.angelo.

## 7 November 2026, 13:30 UTC: current state and open questions (before Angelo compacts this session)

Written at Angelo's ask: "write your current state and open questions to your report and commit, then I'll compact." This entry is enough to resume from.

### What I am and do

- **Mandate:** the team's collaboration. That covers the stand-up calendar, a brief before each stand-up, the record after it (decisions only in the decider's own words, follow-ups with an owner and a due time), the collaboration map, and a daily note on bottlenecks. The issues are WS-96 (record), WS-97 (note and map) and WS-150 (deck slides).
- **The record is mine and the deck is the conductor's.** conductor@web-summit.dinis's deck shows the agenda before a stand-up. I write the record after it, and the next deck reads it (settled 4 November, 1b60a458, confirmed by Angelo's conductor).
- **Under Angelo's protocol** (`people/angelo/kit/README.md#protocol`):
  - Work comes from the conductor in commits. I check each with `node people/angelo/tools/pushed-by.mjs <sha>` and act only if it was pushed from riskmandate-angelo or the-neuronin, within the three tiers. Tier 3 never acts on a commit alone.
  - I report in commits `For: desk.conductor@PrompTugal.angelo`.
  - The direct-change rule applies (five steps against clashes).
  - When Angelo talks to me directly, each exchange ends with a commit to the conductor.
- **Identity:** session key `sha256:c1cb85a164aa1852` (encryption `sha256:d802c378d28e8c5a`). Its entry in `data/keys.json` is `team-collaboration-angelo`, with `renamed_to` set (Angelo: "keep the keys"). agent-log takes my name in lower case (its name check refuses capitals), and signs by key: `--key sha256:c1cb85a164aa1852`.
- **Token check (66b37f04): `SG_SEND_ACCESS_TOKEN` was not set.** I checked this shell and a login shell, printing nothing. It is not in `~/.bashrc` or `~/.profile`, and there is no `.sg_vault/local/token` copy on disk. Nothing needed removing.

### Schedule (scheduled tasks into this session)

| Task | Cron (UTC) | Does |
|---|---|---|
| `team-collaboration@PrompTugal.angelo wake` (trig_01Tkxapu2HzzFBMofBGekxyc) | `40 7,11,17 * * *` | 07:40 the daily note (WS-97); 11:40 and 17:40 the brief for the 12:00 and the 18:00 |
| `... debrief wake` (trig_01CMwjDw2MnJxNvwHMyfrhkC) | `15 13,19 * * *` | the record of the 12:00 and the 18:00 (WS-96) |
| `... inbox wake` (trig_01K75zq12FiMfHqhuVAqUnf1) | `45 9,21 * * *` | the conductor's commits, decisions recorded overnight |

Since 9cb95b3e (Angelo: "Go with your recommendations"):

- A run with nothing to do commits nothing. Its ledger line waits in the session's scratchpad (`ledger-pending.jsonl`) and goes into the next real commit (my file in `people/angelo/ledger/`, which kept its old name).
- I push to dev only, through `admin/tools/release.sh`, never to the session's `claude/*` branch.
- Every run ends with agent-log (WS-160) and measure.mjs (WS-148).

### Tools I keep (people/angelo/tools/, read-only)

- `pushed-by.mjs <sha>`: which GitHub account pushed a commit. It follows the activity API's cursor and exits 1 unless the account is Angelo's.
- `standup-show.mjs`:
  - `--rank` gives the five things that need us today, with the counts strip.
  - `--deck` gives slides for the deck.
  - With no flag, it gives the one-page fragment.
- `team-map.mjs`: the whole team as one map. It draws the active only by default, and `--all` brings back everyone. One node per agent across renames (`<role>@<person>`, with desk. and runner. dropped). Names are kept as written, because the gate's comms_check knows only `@web-summit.` and `@PrompTugal.`. `--json` feeds Angelo's command centre.

### The record (WS-96), as of now

- **Written:**
  - 4 November 12:00 and 18:00, from Jose's notes.
  - 5 November 12:00, from Angelo's notes: one decision (generic business cards for those present) and nine follow-ups.
  - 6 November 12:00, from Angelo's notes: five directions, WS-180 to WS-183 and WS-115.
  - Decisions recorded between stand-ups: Jose on WS-134, Silvio on WS-48 (Monday's merch collection).
- **Pending, with no notes and no transcript:** the 18:00s of 3, 5 and 6 November. A newsroom decision at the 6 November 18:00 shows only as a side effect (17548bfe). I asked conductor@web-summit.vicky for the words and have had no answer.
- **Did not happen:** 7 November 12:00. Its agenda carries to the 18:00.
- **Overtaken:** the WS-23 new-date item.

### What the board and the team look like (the 7 November 07:45 note, WS-97)

- **125 issues overdue, 78 of them unowned.** The parking list is ready (45 to park, 21 kept) and waits for Vicky and Dinis.
- **21 of 22 open decisions include Dinis.**
- **The 18:00s leave no record.**
- **The work has spread out:** Dinis's agents made 16% of commits in the last 24 hours, Vicky's 139 and Angelo's 138.

### Open questions, each with my recommendation

1. **Who confirms the record (WS-107)?** Vicky chose option 2 (I draft, the chair confirms). The agents settled who writes it. Dinis's and Angelo's lines are still missing. *Recommendation:* Angelo says one line at the next stand-up: "decided: WS-107: option 2".
2. **Park the late, unowned issues?** This is for Vicky and Dinis. *Recommendation:* yes, all 45 now, two days before Lisbon.
3. **Notes at the 18:00s.** Without a note-taker or a transcript, I cannot write a record. *Recommendation:* the chair names a note-taker in the first minute of each stand-up. Dinis turning on Meet transcripts (WS-98) would land them in Angelo's Drive, which my debrief runs already search.
4. **WS-150, the deck's "What needs us today".** The patch to `show_deck.py` (`people/angelo/proposals/WS-150/`) was routed to conductor@web-summit.dinis on 5 November and not applied. Under the direct-change rule (ce069603) I could now apply it myself, after the five steps. *Recommendation:* apply it before Monday's 12:00, unless the deck's owner objects. That is tier 2: say so to the owner.
5. **The stand-up calendar.** The two series still invite Nimay at his agent workgroup account. The second address Angelo gave for him was refused by Calendar, likely because it does not exist. No addresses here: the repository is public. The series end Sunday 8 November. *Recommendation:* Angelo decides whether the series run on through the summit (10 to 12 November) or stop. Calendar changes are tier 3, his own go.
6. **The daily note's measures** will mean less once the summit starts. *Recommendation:* from Monday, switch the note to the summit days: meetings booked, leads passed on (WS-29), and follow-ups owed. Angelo or the conductor to confirm.
