# WS-181: the page and its two modes (a draft for Angelo)

By dev@PrompTugal.angelo, 6 November 2026. This is the page half of WS-181; the two vaults and the sync are
vault@PrompTugal.angelo's half, in [vaults.md](vaults.md), and this draft follows it. **Nothing is built before Angelo's
go**, and no real location is stored before security@web-summit.dinis has reviewed both halves.

The ask, Angelo's notes of the 12:00 stand-up: *"coordinate the team and our logistics using the page Angelo has been
putting together in the command center, we need to know where everybody is"*, in two vaults, one public and one
private, and in two modes, *"the local storage and the vault storage so that it works offline but syncs online"*.

## 1. What the page shows

A new view in Angelo's command centre, **Where** (`#where`), the fifth beside Kanban, Collaboration, Summit days and
Replay. It is the team's, not only Angelo's: anyone on the team whose browser holds their site key sees it.

- **The board: one line per person.** Name, place, what they are doing next, until when, and how old the line is.
  - Places come from a short fixed list: stand, Centre Stage, a numbered hall, the press room, the venue, the hotel,
    in town, off.
  - The vault keeps names, never coordinates. The page never asks the browser for its location.
  - A line older than 3 hours fades. Older than 12 hours, it reads "not seen since …".
- **Now and next: the team's logistics.** Collections, shifts and meetings, each with who, where and when, and a
  "done" tap.
  - Public items come from the public vault: the stand's hours, the team's talks, shifts named by role. The page also
    reuses what Summit days already draws (data/events.json, the stand-ups).
  - Private items come from the private vault.
- **Offline banner.** "Offline: the board as of 14:05; 2 updates waiting to send" is the same pattern as the
  command-centre offline copy (WS-84).

## 2. Updating your own line in two taps (phone first)

1. **Tap a place.** A row of large buttons, the six places you used last first.
2. **Tap "next".** Optional: a short list (at the stand, a talk, a meeting, a collection, a break, travelling) and an
   "until" (30 min, 1 h, 2 h, end of day).

That is the update; free text is optional and limited to 80 characters. Undo appears for 5 seconds. You can only
change your own line: the page signs it with your site key, and the vault agent refuses a line signed by anyone else.

## 3. The two modes

| | Local storage (always) | Vault storage (when online) |
|---|---|---|
| **Reads** | The last board the page opened is kept in IndexedDB, stamped with when. The page opens on it at once, with or without a network. | In the background the page reads the public vault (its published read key) and the private vault (its key, sealed to you), then replaces the local copy. |
| **Writes** | Your update goes on the board at once and into a local queue. | The queue is sent oldest first, each update signed and sealed, to the private vault's append lane. A sent update leaves the queue only when the lane has accepted it. |
| **Where** | IndexedDB in your browser: the board copy, your queue, and the vault key (non-extractable, see section 5). | The two vaults, vault@PrompTugal.angelo's. |

**When the two disagree:**
- **Your own line.** The newest record by your own timestamp wins. A late, older update never overwrites a newer one.
  Your queued update shows as yours, marked "sending", until the vault has it.
- **Logistics items.** These are events (created, done, moved), not edits to one shared file, so two people never
  overwrite each other. If two "moved" events cross, the later one wins and the board shows "moved twice" on that item.
- **The board can lag.** It updates when vault@PrompTugal.angelo drains the lane, so your own updates show from your
  queue until then. I suggest a drain every 10 minutes during summit hours; that frequency is vault@'s to set.

The service worker (`people/angelo/app/sw.js`) already serves the page itself offline. Vault data never goes through
it: vault data lives in IndexedDB, under the page's own control, so turning offline off (`?offline=off`) also clears it.

## 4. Where it lives and what it reuses

- **The view:** `people/angelo/app/` (where.js, a view in app.js, styles in app.css). This is Angelo's part of the
  command centre.
- **Reused, not copied:**
  - `assets/keyring.js`: the person's key in the browser, which opens sealed envelopes and signs.
  - `assets/crm.js`'s private-vault reading: it opens the vault key in memory, reads the vault, and decrypts each record
    for its readers.
  - `assets/feedback.js`'s append lane: write-only, sealed in the browser to the agent's key.
- **Shared code:** a small helper may be needed, for example "sign and seal one record to a lane", which feedback.js
  does today without signing. Under Angelo's rule of ce069603 I would add it in place, after the protocol's five
  steps, For: its owner. If its owner is busy, I would send a draft instead.
- **A limit found in step 1 (the gate's rule 22, WS-164):** a script under people/ may not use the keyring, IndexedDB
  or data/sealed/. So the real version's key-handling half (opening the private vault, signing an update) must be a
  site script in assets/, for its owner, with Angelo's view drawing only what that script hands it. Step 1 keeps its
  demo store in localStorage for the same reason.
- **Never in this repository:** anyone's place or line. The build never sees the private vault, the page's data.json
  holds no location, and no location goes in the public vault.

## 5. What security@web-summit.dinis should review (adding to vaults.md's five)

1. **Where the opened vault key lives.** I propose a non-extractable CryptoKey in IndexedDB, as keyring.js holds the
   person's key, so the board opens offline. The alternative is memory only, which works offline only while the tab
   stays open. "Lock" and `?offline=off` delete it.
2. **The local copy on a lost phone.** The board copy in IndexedDB can be read by whoever holds an unlocked phone. Should
   it be encrypted at rest with the same key, and cleared after 24 hours unopened?
3. **Signing in the page.** The update is signed with the person's site key in the browser (keyring.js's `sign`). Is the
   site key the right key, or should each person have a key just for this?
4. **Replay and denial.** The append lane accepts anything. The vault agent drops unsigned records, but someone holding
   the token could fill the lane. Is a rate limit at the lane needed, or is dropping at drain time enough?
5. **The place list itself:** coarse enough? "Hotel" says little; a hotel's name would say a lot, so none is ever
   stored.

## 6. Built in steps, after Angelo's go and security's review

1. **The view with demo data** (built 6 November, at Angelo's go: `#where` in his command centre, where.js): made-up names, clearly marked, no vault. Two-tap update, local queue, offline banner,
   tested at desktop and phone width. Angelo tries it.
2. **The public vault read:** stand hours, talks and shifts. Public data only, so it can ship before review.
3. **The private vault**, once security has reviewed and vault@ has its own SG/Send token (vaults.md, "Blocked"):
   reading, then the signed and sealed updates.
4. **After the summit:** the view says the vault is gone and clears the local copy.

## For Angelo: three choices

- **(a) Who sees the board:** the whole team (my default, matching vaults.md), or each person choosing who sees their
  line. This is the same question as vaults.md's (b).
- **(b) The place list:** the eight above, or your own.
- **(c) Step 1 now:** a demo with no real data, so you can try the two taps and the offline mode before any vault
  exists.
