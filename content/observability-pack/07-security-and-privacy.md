---
title: "Observability pack 7: security and privacy rules"
summary: What the PHP site promised its readers and what we keep: no IP, no cookie, Do Not Track honoured, a strict Content-Security-Policy, every event an untrusted claim, keys kept where they belong, and what must never reach the repository.
---
## Kept from the PHP site {#kept}

- **No IP address is captured or stored**, at any step; the site has no server and no logs. The geolocation lookup is made by the browser itself; the IP in its answer is never read.
- **No cookie, no user-agent string**; a session id that dies with the tab.
- **Do Not Track and Global Privacy Control** stop everything, including the lookup.
- **A Content-Security-Policy** that allows exactly the vault host and the two lookup services, so no third party can be added by a data change without a security review.
- **A disclosure on every page**, linking the stats page, and a pause switch.
- **Every event is an untrusted claim**: the token and the public key are published, so rows can be forged or flooded. The drain counts; it never trusts. Strings from events reach a page only as text (never HTML).
- **The security review** of each step (the PHP site's location lookup went through advisory SA-2026-030 and was accepted by the editor).

## Ours, in addition {#ours}

- **The vault key, the drain key, the enum key and the SG/Send access token never enter a repository** (the gate refuses anything shaped like a key), never a page, never a message.
- **Per-person reads only for the team, only for people with a key**, and said on the team's start page: it is how the team manages, not watching.
- **The agent lane carries no secrets and no private content**: URLs, commit ids, counts. A URL with a token in it is redacted before it is logged.
- **Signed events are verified** against `data/person-keys.json`; a failed signature is recorded as a finding, not silently dropped.

## Keys handed over for this pack {#handover}

Dinis handed the conductor the PHP site's two observability vault keys on 4 November 2026 (sealed to its key, signed by his DC Vault Registry key, expiring 11 November). They are kept outside every repository, for study only. Jose's agents make **their own** vaults and keys; the PHP site's are not reused or copied. The app vault's read key (code only) can be shared with observability@web-summit.jose, sealed to its key, on Dinis's or Jose's ask.
