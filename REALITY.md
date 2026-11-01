# Reality: what exists on 1 November 2026 (site v0.1.16)

A thing that is not in this file does not exist, whatever a brief says. Kept current by whoever ships.

## Exists
- The site at https://web-summit.sgit.ai: markdown in `content/` and data in `data/`, rendered by `admin/build/build.mjs`, gated by `admin/build/validate.js` (16 checks). Pages: home with a live countdown and computed numbers, the company map (one page per company), the summit (facts, sessions, side events, news), the plan (schedule, decisions, design track, the follow-up loop, card questions), the team (people, agents, where they meet; a page each), the session log, articles (one), briefing for the inbox agent, keys, the agent, about, participant disclosure, versions.
- The briefs, published in full in `BRIEF.md`: the team brief (30 Oct) and part two (31 Oct).
- The pipeline: validate, tag, deploy (`.github/workflows/deploy-pages.yml`). A push to `dev` tags the next minor, a push to `main` the next major. From v0.1.11 runs no longer cancel each other (`cancel-in-progress: false`).
- The team template: a `ROLE.md`, `policy.json` and `status.json` for each of eight agent roles (conductor, researcher, cartographer, writer, curator, analyst, designer, security) in `team/<id>/`; the gate fails if two policies claim the same path. The wake protocol (`team/conductor/WAKE.md`), the schedule (`team/conductor/schedule.json`), the tools (`admin/tools/start.mjs`, `banner.mjs`, `wake.mjs`, `comms_check.mjs`), the hold (`team/<id>/HOLD.md`, which stops `start.mjs`), and the board and mailroom as files (`comms/`, empty).
- The roster (`data/team.json`): the operator, six unnamed seats for the other people going, the designer's seat, the eight agent roles, and the operator's inbox agent (onboarding). Only the operator is named.
- The conductor role is held by conductor.2@web-summit (key `sha256:a8a24ce1af856a95`, from 1 November); the first session, conductor@web-summit, has ended.
- Six vaults on dev.send.sgraph.ai: public and private for the CRM, the messages (Email-FS) and the task board (Issues-FS). Each holds only a README. Keys are held outside the repository.
- `/keys/`: three public keys: the registry agent that keeps the team's vault keys (handed over as a QR code), and the two conductor session keys (confirmed by their push).

- The company map (`data/companies.json`): 88 companies, from the first page of each websummit.com list and the public 2026 session pages, read 1 November 2026; the graph (`data/graph.json`): 88 companies, 165 links, 8 clusters, 12 proposed first meetings; notes on how to re-read the lists in `team/researcher/notes.md`.

- The summit feed (`data/events.json`): facts, 80 sessions, 29 side events, 20 news items, 15 newsroom articles and 11 gaps, read 1 November 2026; notes in `team/curator/notes.md`.

- Final QR codes for the flyer, banner, stickers and tees, tested (`team/designer/qr/`). The personal card codes wait on names.
- Wake records with all five steps (`team/conductor/wakes/`); the first scheduled wake ran at 02:28 UTC on 1 November.

- A draft article, The agent security map of Web Summit 2026 (`team/writer/drafts/`), unpublished until the operator agrees who signs.

## Does not exist yet
- Owners for any company, any role card filled, any person named other than the operator, any personal agent joined.
- Any asset (a page made for a company), any meeting booked, any email drafted from this site, any number of links sent or pages opened.
- Personal CRMs, shared ids in use across them, and any data in the team's CRM vaults.
- Separate sessions per role: today the roles run as sub-agents of the conductor's session.
- A release script that verifies the live site, the `review/` folder, the Agent Contact file, a row on nfrs.sgit.ai, a key file and QR per role in the template's layout.
- Any print order, quote or approved design. The dates to meet are on the plan page (design approved by Mon 2 Nov 14:00).
