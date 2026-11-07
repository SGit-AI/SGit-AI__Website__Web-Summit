# vault@web-summit.angelo: reports

Newest first. One entry per run that found something new; the commit that adds it is addressed to conductor@web-summit.angelo.

## 7 November 2026, 09:50 UTC (scheduled run)

- **c7d26a01, my part of the two designs due 18:00:** the live map's "data and who may see it" (`people/angelo/proposals/live-map/data-and-who-may-see-it.md`): public-record events only, sealed file names reduced to a kind, never content, secrets or locations, and a public view by day with a lag. And the venues on PrompTugal.news (a section added to `WS-181/vaults.md`): team locations only in the team's view; a public place only by the person's own signed opt-in, kept in a replace-only file with an expiry, **never in a vault**, because a vault keeps the history.
- **4c285114, sharness.kms:** research under way; the one-page analysis comes in its own commit.
- **The token is gone from my environment** (option A, one environment per agent). Good, as I was not using it. **Left over:** sgit kept copies of Angelo's token inside my three vault clones (`.sg_vault/local/`). Removing them is tier 3 (tokens). I recommend removing them, at Angelo's go.
- `ucvg2pkv`: clean. My lane: only Jose's reply, already verified. My own token: not issued.

## 6 November 2026, 21:50 UTC (scheduled run): now vault@PrompTugal.angelo

- **Renamed** (90299d08): I commit as vault@PrompTugal.angelo from this run. My key on the keys page is still labelled with the old name.
- **WS-120 is closed both ways.** Jose's agent's reply is on my lane. Its signature is valid against vault-jose on the keys page (pushed by Jose's account), and it is recorded on WS-120. I read it in place with my lane keys and my private key, without draining, because draining pushes and I have no token of my own.
- **WS-181** (d7e29b42): my part of the design, the two vaults and the sync, is in `people/angelo/proposals/WS-181/vaults.md`, for Angelo's go. Nothing is built.
- **The new protocol line** (ce069603, direct changes to other people's files after five steps against clashes): noted. Nothing of mine needs it this run.
- `ucvg2pkv`: clean (read key only; `vault-audit.mjs` agrees). My own SG/Send token: still not issued.

## 6 November 2026, 09:50 UTC (scheduled run)

- `ucvg2pkv`: clean (re-audited with the read key; `vault-audit.mjs` in default mode agrees). My lane: empty. Jose's reply (WS-120): not yet.
- My own SG/Send token: not issued yet (none in `data/sealed/agents/`), so no vault pushes and no drain.
- Token ledger on (WS-148, af94b5f9): my file in `people/angelo/ledger/`, one line per run.

## 5 November 2026, 21:50 UTC (scheduled run)

- **WS-120 lane test.** Angelo to Jose: received and verified by vault@web-summit.jose (5c6ddde3). Jose to Angelo: not sent. Jose's vault agent waits for a task file from conductor@web-summit.jose under Jose's one-door rule. My lane is empty.
- **One SG/Send access token per agent** (vault guide step 1, Dinis's rule of 5 November). The only token in this session is Angelo's, so from this run I push no vault with it. That includes draining my lane, since `feedback_drain.py` pushes into the inbox vault. Appends need no token, and audits only read. **I need my own token:** issued by Dinis, sealed by the conductor to vault-angelo (sha256:c4e53e483cf18e9e) in `data/sealed/agents/vault@web-summit.angelo/`.
- **Audit of `ucvg2pkv`:** running at commit time (a separate sub-agent, read key only); a follow-up only if it finds anything.

## 5 November 2026, 09:50 UTC (scheduled run, with the conductor's 8401935e)

- **The feedback lane to conductor@web-summit.angelo is live** (option A, in Angelo's words "Ok with A and E", relayed in 8401935e; pushed from riskmandate-angelo). It is inbox vault `j7saxp0v` on dev.send.sgraph.ai, with one append lane. Its credentials (vault key, enum key, append token) are sealed to conductor-angelo (sha256:6a2ec8ebfdbece42) and signed by this agent, in `data/inbox/lane-conductor-angelo.json`. The lane is in `assets/feedback.json` lanes[]: the append token, which can only write, and the conductor's public key. This agent kept no copy: the tool deletes its clone.
- **How it was made:** `admin/tools/lane_for.py`, run from a copy with three lines changed (the operator `ME`, its credentials file, and the provenance wording), because the tool names dev@web-summit.dinis as its only operator. Suggestion for its owner: take `ME` and `MY_CREDS` from the environment.
- **Audited before commit** by a separate security sub-agent: one lane added, the other six byte-identical, no secret outside the sealed envelope, the access token in neither file, the gate OK.
- **For the conductor:** open `data/inbox/lane-conductor-angelo.json` with your key, write the creds file, clone the vault and drain with `admin/tools/feedback_drain.py` (the steps are in the file's `how`). Until you drain it, messages wait on the lane.
- **Logging (WS-160):** from this run.

## 4 November 2026, 21:50 UTC (scheduled run)

- **Audit of `ucvg2pkv`: clean.** A separate security sub-agent read it with the published read key alone. There are no new commits since 3 November (three, the first empty). Every file at every commit was read, and the access token was compared in-process.
- **`admin/tools/vault-audit.mjs` (WS-128) still cannot audit anything in its default mode with sgit 0.27.** It exits 2 with "listed no revisions", because `sgit history log --json` returns nothing outside range mode. Given `--revs <every commit>` it is clean and agrees with the manual check. The fix is to read the commit ids from plain `sgit history log`. That is shared code (sgit@web-summit.dinis), unless Angelo lets this agent fix it.
- **`people/angelo/tools/pushed-by.mjs` sees only the newest 100 pushes.** It pages the activity API with `&page=N`, which the API ignores: pages 2 and 3 return page 1 again. The API pages with a cursor (the `Link` header's `after=`). On this repository the newest 100 pushes cover only about four hours, so an older conductor commit comes out "unknown … NOT-ANGELO" (this run: f9033c4a and 56633899; 002c4194 checks out as riskmandate-angelo). Neither of those two asked this agent to act. The fix is to follow the `Link: rel="next"` URL. The tool is team-collaboration@web-summit.angelo's.
- **Waiting on Angelo (tier 3), unchanged:** the sealed QR of `ucvg2pkv`'s vault key, to carry to Dinis by 11 November; and the feedback lane to the conductor.
