# WS-181: the two vaults and the sync (a draft for Angelo)

By vault@PrompTugal.angelo, 6 November 2026. This is the vault half of the design. The page and its two modes belong to dev@PrompTugal.angelo. **Nothing gets built before Angelo's go**, and no real location is stored before security@web-summit.dinis has reviewed it (the list at the end).

## The split

| | Public vault: `ws-team-logistics-public` | Private vault: `ws-team-logistics-private` |
|---|---|---|
| Holds | What may be public: the stand's hours, the team's talks and sessions (from the official programme), venue areas, shifts named by role | Where each person is and what they do next, collections, meetings, anything personal |
| Who reads | Anyone: its read key is published on /vaults/ after an audit (`vault-audit.mjs`) | The team's people only. The vault key is sealed to each person's site key (`data/person-keys.json`), not published |
| Who writes | vault@PrompTugal.angelo, from the agenda and the programme | Each person writes **their own line only**, through an append lane (below). The vault agent files the updates |
| Never | A person's whereabouts, a phone number, a hotel | A home or hotel address, and any exact pin the person did not choose that time (see "Zones by default", below) |

The CRM made the same split on 5 November (WS-170), with records sealed to their readers, so this follows a pattern the team already uses.

## How a person updates their line from a phone (writes)

1. The page holds no vault key. It holds the private vault's **append token**, which can only write: it cannot list, read or delete. It also holds the vault agent's public key, the same arrangement as the feedback pane.
2. The update is a small JSON record (`{person, place, doing_next, until, at}`). It is **signed with the person's site key** and **sealed to the vault agent's key**, then appended. An unsigned or unverifiable update is dropped, because the lane token is in the page.
3. vault@PrompTugal.angelo drains the lane at each run, verifies the signature against `data/person-keys.json`, and writes the record to `where/<person>.json` in the private vault. It then commits and pushes **with its own SG/Send token** (the token rule: it has none yet, see "Blocked").

## Offline first (the page's two modes, the vault side)

- **On the phone:** the page keeps the last copy it read, plus a queue of the person's own unsent updates, in local storage. With no network it still shows the last known board ("as of <time>") and accepts updates into the queue.
- **When back online:** the queue is sent oldest first, and each update is appended to the lane as above. Appends need no session, so a flaky venue network loses nothing that was queued.
- **Conflicts:** few, by design. Each person owns only their own line, so the newest record **by the person's own timestamp** wins, and an older record that arrives late never replaces a newer one. For logistics items (collections, meetings) the records are events (`created`, `done`, `moved`), not edits to a shared file, so two people never overwrite each other.
- **Reading:** the team's devices read the private vault with its vault key, which the page opens with the person's own key (sealed to it). It is cached for offline use, and older than 12 hours it shows as stale.

## The hard part: a vault remembers everything

A vault keeps every commit, so **every past location stays readable to whoever holds the private vault's key**, for as long as the vault exists. To limit that:
- zones by default; an exact pin only when the person chooses it, and it expires (below);
- a summit-only vault: after the summit (by 14 November) it is deleted from the server (`sgit vault delete-on-remote`), and nothing from it is copied anywhere;
- the key is sealed only to people, not to every agent, and the vault agent holds it in its session only.

## What security@web-summit.dinis should review before real locations are stored

1. Whether the private vault's readers should be all the team's people, or each person choosing who sees their line.
2. The append token in a page: write-only, but anyone can append. Signed updates and drop-if-unsigned cover this; is that enough?
3. The vault key in the browser: sealed to the person's key, opened in the page. Where it lives once opened, and when it is cleared.
4. The deletion after the summit, and who confirms it.
5. Whether zones are coarse enough, and the pin's expiry (below).

## Blocked, and what Angelo decides

- **Blocked:** creating and pushing either vault needs vault@PrompTugal.angelo's **own SG/Send token** (asked of Dinis on 5 November, 20962d69). It has none, and it will not push with Angelo's.
- **For Angelo:** (a) go or no go on this split; (b) readers of the private vault: the whole team, or chosen per person; (c) whether the vault is deleted after the summit.

## Zones by default, an exact pin only by a person's choice (Angelo, 7 November: "Agreed on C", 592d1096)

- **By default a line holds a zone:** a building, hall or area from a short list ("stand", "Hall 2", "hotel", "off"), never coordinates.
- **An exact pin is a deliberate second step,** taken by the person each time (a meeting spot, our base), never remembered as a default. The record carries `pin: {lat, lon, label, until}` beside the zone, signed with the rest of the update.
- **Who sees a pin:** the same readers as the private vault (the team), never the public layer. A person's public opt-in (below) publishes a zone only, never a pin.
- **A pin expires** (`until`, at most a few hours). After that the board shows the zone alone. Note that the vault still holds the pin in its history, which is why the vault is deleted after the summit (above).
- **No pin for a home or a hotel:** the page offers pins only for venue spots and our base.

## Venues on PrompTugal.news (c7d26a01), the vault side

Added 7 November 2026 by vault@PrompTugal.angelo. dev@PrompTugal.angelo's page.md leads, and this says what may be shown and what stays sealed.

- **The public venue map is the newsroom's, and stays the newsroom's.** It shows venues, halls, stages, the stand and the talks: public facts with their sources. Nothing about a person.
- **Our team's locations come only from the private vault** (above), drawn on that map **only in the team's view**: a device that holds the private vault's key, opened with the person's own key. The newsroom's page never fetches the private vault itself. The team's view adds a layer in the browser.
- **"Optionally public, if we decide to be trackable": each person for themselves, never by default.**
  - The opt-in is the person's own signed record ("show my place publicly until <time>"), checked against `data/person-keys.json`. Nobody can opt someone else in.
  - **A public location must not go into a vault.** A vault keeps every commit, so a public vault would publish that person's location history for good, even after they opt out. Instead, the newsroom page reads a small live file that holds only the current opted-in places, with an expiry. The file is replaced, not appended, and it holds named places only.
  - An opt-out takes effect at the next write. Anything already seen or cached cannot be recalled, and the page should say so before someone opts in.
- **What dev@PrompTugal.dinis (the newsroom) would need to change**, sent under the protocol's five steps once Angelo approves: (1) the venue map accepts an optional team layer supplied by the browser; (2) the newsroom reads the opted-in places file and shows those people, with "until <time>"; (3) nothing else. Its My day stays as it is: browser first, a vault if the reader opens one.
- **For security@web-summit.dinis:** the opted-in places file (who writes it, how a stale entry expires), and whether a person's public place should be coarser than their team place.
