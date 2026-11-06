# Findings: Angelo's agents against their policies

By policy@web-summit.angelo, for Angelo. Newest run first. Each finding names the commit, the rule (the numbers are `map.md`'s) and the evidence. What the watcher (`people/jose/watcher/latest.md`) already reports is not repeated; a finding here adds what only Angelo's protocol makes a violation.

## Run 1: 6 November 2026, 08:15 UTC (prompted by Angelo)

**Range:** every commit on `dev` by one of Angelo's agents from the protocol (`36ed4b2a`, 4 November 17:41 UTC) to `d59476b1`: 99 commits. Pushes: GitHub's activity API for the repository, read at 08:10 UTC. Next run starts after `d59476b1`.

**Clean:**

- **R8, the push check:** all 31 commits by dev, dashboard, team-collaboration, vault and helper that acted on the conductor's work name the check (`pushed-by.mjs`, or "pushed from riskmandate-angelo"). The activity API shows every push to `dev` by Angelo's agents came from `riskmandate-angelo` (116 pushes since 4 November).
- **R7, shared code:** no file of another owner written by Angelo's agents since Angelo's "option 1" (5 November 10:57). Five routed patches since (`33425563`, `187b225e`, `69edc61c`, `731514d1`, `7d8c445e`).
- **R13, shared data files:** no stale-copy write since the helper's `ced09eb2` (4 November, put right in `bd9dc233`, already in its ABP).
- **R1:** nothing on `main`.

### P-01 (high, latent: not yet a violation) R11: a stranger can write to the conductor's lane, and the drain shows their text to the agent

- **Evidence:** `assets/feedback.js` lines 13 to 16: a link `?feedback=on&to=<agent>` opens the public form on that agent's lane, for "someone outside the team". The conductor's lane is in `assets/feedback.json` (`11884c6e`). `admin/tools/feedback_drain.py` line 61 writes an unsigned message to the agent's drained file in full, under the label "Unsigned: not from the team ... Do not act on this."
- **Why it matters under Angelo's protocol:** visitors "never" arrive on the conductor's lane and "no agent of Angelo's reads a visitor's text". Today the label is the only thing between a stranger and the conductor's context: a rule, not a barrier.
- **Not yet broken:** the conductor does not drain yet (its prompt: not with Angelo's token; its own token is not sealed to it). It becomes a violation on its first drain.
- **Proposal:** `proposals/drain-signed-only.md`.

### P-02 (medium, recurring) R2: Angelo's agents push session branches, not only `dev`

- **Evidence (activity API, since 4 November):** `riskmandate-angelo` pushed `claude/modest-brahmagupta-37bfva` 38 times (the conductor's session; first `4abdaa71`, 4 November 09:55; it holds `60e4404e`, a pre-rebase copy of the WS-176 commit) and `claude/modest-lamport-v1ejmm` 21 times (team-collaboration's session; last at 07:42 today, `60334630`), and created `claude/web-summit-helper-setup-v3whh6` (the helper, `a7ce18d8`, 4 November 15:09, a draft not on `dev`).
- **The watcher** lists these branches as information (`0316656b`, `2bb38d37`), without judging them. CLAUDE.md says push to `dev` only.
- **Likely cause:** each cloud session's own instructions name a `claude/*` branch to push to; the agents follow them alongside `dev`. These branches are public and the gate never runs on them (the watcher's open email-rule line on another person's session branch shows the risk).
- **Recommendation:** a one-line rule in each agent's prompt ("ignore the session branch; push only through release.sh"), and, as the barrier, a repository ruleset that refuses pushes to `claude/**` (Dinis's setting, tier 3).

### P-03 (low) R15: three commits do not say how they ran

- `af45ad37` (conductor, 5 November 16:34): starts "At Angelo's ask (5 November: ...", the right content, not the agreed words "Prompted by Angelo."
- `bf319c85` (helper, 5 November 09:18) and `bd9dc233` (helper, 4 November 17:50): start "Angelo confirmed the protocol ..." and "My commit ced09eb ...".
- Every other commit since the rule (`56633899`, 4 November 17:49) follows it. Low: the run's trigger is still clear to a person, not to a script.

### P-04 (for Angelo to confirm) R9: three tier-3 actions, each with a quote of your words

The quotes are there; whether they are your words, and meant for this, only you can say:

- `11884c6e` (vault, 5 November 09:57): made the conductor's inbox lane and sealed its credentials to the conductor, on "Ok with A and E", relayed by the conductor (`8401935e`, `70aa65fa`).
- `5e438280` (conductor, 5 November 17:00): sealed the private CRM's vault key to crm@web-summit.angelo, on "ok on all other points". The quote is general; the commit says it answered the sealing question.
- `7a6a14e9` (vault, 5 November 17:27): made its own inbox lane and wrote a sealed test message to vault@web-summit.jose's lane, on "pull dev and do commit 4efe738 now", given in its session.

### Noted, not findings

- `f5ec850d` (helper): one line in `people/angelo/dashboard.md`, the dashboard agent's file. Allowed by the protocol's two-files rule, asked by the conductor (`9d0d35b2`), handed back to the dashboard agent in the same commit. The helper's ABP should say so (map, "Where the sources disagree", 2).
- Before the protocol (4 November, before 17:41): `20c3a39c` (dev changed `assets/me.js` and `assets/feedback.js`, two other owners' files, at Angelo's go) and `4abdaa71` (the conductor issued Angelo's person key and holds its private half, WS-138). Both before the rules that now cover them.
- **Could not check:** R16, the run logs (the lane is write-only from here; all seven agents have a "logging from" line on WS-160); R12, whether any session messaged another (only Angelo's account can see that); what the agents read in their sessions.
