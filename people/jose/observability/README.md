# The team site's observability: two vaults, five lanes, two drains (WS-37)

Built by conductor@web-summit.jose on 4 November 2026, at Jose Bota's word ("creating the two vaults (data and
observability ux) and then wire up the website to send traffic to you ... run on a hourly schedule to drain the append
lanes (start with 5 just in case) and it should also be possible to drain the vault from inside the data vault"), from
[the observability pack](https://web-summit.sgit.ai/observability-pack/index.html) and the PHP newsroom's public code.

## What runs

| Part | Where | What it does |
|---|---|---|
| The sender | `assets/telemetry.js`, `assets/telemetry.json`, loaded on every page by `admin/build/build.mjs` | one event per page per tab (page, referrer host, minute, version, tab id, screen class, language, time zone; never IP, cookie or user-agent), sealed in the browser to the drain key (sgit hybrid v2), written to lane 1, the next lane on 507; off for Do Not Track, Global Privacy Control and Pause; signed by a team member's site key when their browser holds one |
| The data vault | `ws-observability-data` (`1ssnjy23`, dev.send.sgraph.ai), **private** | the drain key (`identity/private/`), five lanes (`identity/lanes.json`), `drain/<date>.jsonl`, `reports/latest.json`, the app manifest |
| The app vault | `ws-observability-ux` (`5rmsy87y`), **code only, read key published** ([/vaults/](https://web-summit.sgit.ai/vaults/index.html#published)) | `app/obs-app.js`: Overview, and Queue & drain; linked read-only by the data vault, with a pinned copy in the data vault's `app/` |
| The hourly drain | `admin/tools/telemetry_drain.py`, run by conductor@web-summit.jose on an hourly scheduled task in its own session (at :07 UTC) | list, fetch, open, verify signatures (active keys only), append (never the same lane file twice), report, push, then mark processed; **from 6 November 2026, 00:07 UTC, it only lists and counts (`--dry`) until the conductor has an SG/Send token of its own** (Dinis's rule of 5 November: no agent pushes a vault with its person's token) |
| The in-vault drain | the data vault's app, Queue & drain | the same steps from the browser, through the vault host's `sg.append` bridge |

**The keys.** The five append tokens and the drain's public key are published (they only write, and only encrypt). The
lanes' enum key is SHA-256 of `sg-inbox-enum:` and the data vault's read key: the vault host's own derivation
(`sg-append.js`), so the CLI drain and the in-vault drain use the same one. The data vault's key is with Jose (his
password manager) and in conductor@web-summit.jose's session only; never in this repository.

## Checked on 4 November 2026

- Each of the five lanes: write, list, fetch, open, mark processed (a self-test per lane).
- From the built site in headless Chromium: two page views written (200), drained by `telemetry_drain.py`; the one sent
  with Jose's site key in the browser verified as Jose. These test rows stay in `drain/2026-11-04.jsonl`, marked
  `agent: webdriver`.
- In the vault host (dev.vault.sgraph.ai): the app loads, the Overview counts the drained rows, and Queue & drain drained
  three new events, pushed and marked them processed. **It writes only when the vault is open writable**: with only the
  vault key it is read-only (`EREADONLY`); add the SG/Send access token in the host first (the lock button).

## How to drain from inside the data vault

1. Open the data vault in SG/Vault with its key (from Jose's password manager).
2. Add the SG/Send access token in the host (the lock button in the top bar), so the vault is writable.
3. Queue & drain, then Drain the lanes now. It says how many it drained, pushed and marked processed.

## Not done yet (the pack's checklist)

- `/stats/` from a public copy of the report (step 6), the newsroom's sender (step 7), the agent lane and
  `admin/tools/agent-log.mjs` (step 8).
- The security review by security@web-summit.dinis of the sender, the lanes and the drains (step 10), asked for in the
  release commit.
- The richer views of the PHP site's app (journeys, classes): this app has Overview and the drain only.
