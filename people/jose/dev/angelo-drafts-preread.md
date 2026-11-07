# Angelo's dev agent's five drafts: a pre-read for Jose

By `dev@web-summit.jose`, 7 November 2026, 15:40 UTC, from the task `people/jose/tasks/2026-11-07-dev-angelo-drafts-preread.md` (at Jose's word, C30: *"Action 7: yes, dev pre-reads Angelo's five drafts for me."*). **Read only:** nothing applied, nothing changed in `people/angelo/`, no comment anywhere. Read on `dev` at `0652ee40`. Each patch was checked with `git apply --check` (all three apply cleanly); the tripwire was also run once in a throwaway worktree, since removed.

## In one table

| Draft | What it is | Touches shared build code? | My advice | Your review |
|---|---|---|---|---|
| **WS-106 item 8**, the leak tripwire | A check before every push for the secret part of any key on the machine | Yes: `admin/tools/release.sh` (one line) and a new `admin/tools/tripwire.mjs` | **Apply before the summit**, through its keeper | 10 min |
| **WS-45**, people's keys on `/keys/` | A "People's keys" section on the keys page | Yes: `admin/build/build.mjs` (9 lines) | **Apply** (low risk); it closes WS-45 | 5 min |
| **WS-76**, video hosting | A measured choice between four options, no patch | No | **Agree option A** (change nothing before Lisbon) | 2 min |
| **WS-36**, a conductor of conductors | Three rules and one view, no patch | Later: `content/agents.md`, each kit, a view in `build.mjs` | **Wait until after the summit**; rules 2 and 3 are a stand-up decision for Dinis | 10 min |
| **WS-78**, a kicker line and colour debt | A line above every page's title, and two new gate checks | Yes: `build.mjs`, `validate.js`, `assets/site.css`; every page | **Wait until after the summit** | 15 min |

Shared build code is kept by `conductor@web-summit.dinis`: "apply" here means you say yes, and its keeper applies it.

## WS-106 item 8: the leak tripwire (`people/angelo/proposals/WS-106/`)

- **What it changes, for whom:** every agent that releases with `admin/tools/release.sh` (all of them). Just before the push, `tripwire.mjs` reads only the lines about to be pushed and refuses if they hold a known secret shape (the gate's own list) or any 24-character window of the secret part of a key under `~/.sg-send/` (session keys, issued person keys). It prints which file matched which local key file, never the secret.
- **What it touches:** shared: one line in `release.sh`, one new file in `admin/tools/` (62 lines added in all).
- **Checked here:** it applies cleanly; it ran in 0.04 s on my pending push and was clean on the last 30 changed files; it reads `module.exports.keyHits` and `BINARY`, which `admin/build/secrets.cjs` exports.
- **Risks and open questions:**
  - It **fails closed**: if `git diff` errors, the push is refused. That is the safe way round, but an agent could be stuck until someone looks.
  - It checks key files only. **It would not have caught the one real leak from Jose's agents** (8fe508f, 3 November: a value matching an access token, which lives in an environment variable, not a key file). Worth asking Angelo's agent to also check the values of the session's credential variables (`SG_SEND_ACCESS_TOKEN`, `SG_VAULT_KEY_*`) the same way, by name, never printed.
  - Vault keys kept in `~/vaults/<name>/.sg_vault/local/` are outside `~/.sg-send/`, so they are covered only through `TRIPWIRE_DIRS`. Worth a default.
- **Advice:** apply before the summit. It stops a real harm, costs nothing on a push, and fails safe. Ask for the two additions above as a follow-up, not a condition.

## WS-45: people's keys on `/keys/` (`people/angelo/proposals/WS-45/`)

- **What it changes, for whom:** the keys page gains a "People's keys" section: each person's name, signing and encryption fingerprints, status, who issued the key and when, and how long it is valid, from `data/person-keys.json`. Everyone who checks a person's key, and anyone sealing to a person.
- **What it touches:** shared: `admin/build/build.mjs`, 9 lines added.
- **Risks:** low. Only public halves are listed, and they are already public in `data/person-keys.json`; the page carries the file's own note that the issuing conductor also holds the private half. It names people beside their keys, which the data file already does.
- **Advice:** apply; it closes WS-45, whose original ask (every `people/<id>/key.json`) was overtaken on 2 November.

## WS-76: video hosting (`people/angelo/proposals/WS-76/`)

- **What it is:** measurements (three videos, 21 MB, in the repository; about 14% of each deploy) and four options: A keep them and add no more, B a media repository on a subdomain, C YouTube embedded, D a paid host. Recommends A until Lisbon, with new videos going to B or C, and C alongside, never instead.
- **What it touches:** nothing now; any later move is one line per video page (Silvio's) and a DNS record (Dinis) for B.
- **Risks:** none in A. C adds an outside player that tracks viewers, which the site has none of today.
- **Advice:** agree A now (no work); leave B, C and D to after the summit with Silvio and Dinis.

## WS-36: a conductor of conductors (`people/angelo/proposals/WS-36/`)

- **What it is:** measured that the team already works through conductors (257 of 320 cross-person messages), and proposes: (1) every person's conductor is their hub, with Angelo's protocol in each kit; (2) conductor@web-summit.dinis as the conductor of conductors; (3) a request between conductors is answered within one wake; (4) a "Waiting between conductors" view.
- **What it touches:** later: each kit (each person's yes), `content/agents.md` (Dinis), `pushed-by.mjs` moved to `admin/tools/`, and a view in `build.mjs`.
- **How it fits Jose's one door (C19):** compatible. Jose's kit already does rule 1, and his conductor already receives work for his agents. Rule 2 lets agents route work to a file's owner directly, copying the sender's conductor; for Jose's agents that still arrives at his conductor, so nothing changes for him.
- **Risks:** rule 3 adds a duty to every conductor's wake in summit week.
- **Advice:** wait until after the summit. If it comes up at a stand-up, Jose's answer can be "my one door already does rule 1; rules 2 and 3 are Dinis's call".

## WS-78: a kicker line and colour debt (`people/angelo/proposals/WS-78/`)

- **What it changes, for whom:** every page gains a line above its title naming its section and the file it is written in, linked on GitHub; gate check 21 fails a page without it; gate check 22 warns about colours outside a tokens block in each stylesheet (260 in the shared command centre, 41 in the feedback pane, and others).
- **What it touches:** shared: `build.mjs`, `validate.js`, `assets/site.css` (25 lines added); every page of the site.
- **Risks:** a visible change to every page two days before the summit, including the pages visitors see from the stand; check 21 makes the gate stricter for every agent at the busiest time.
- **Advice:** wait until after the summit. If anything sooner, only check 22 (a warning, which changes no page).

## Asks for Jose

These go to conductor@web-summit.jose for the Actions list (one door, C19), not kept here.
