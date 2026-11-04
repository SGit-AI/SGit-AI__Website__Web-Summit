---
title: "Observability pack 3: the data vault, its identity and its lanes"
summary: The telemetry vaults layout, the drain key pair and where it is kept, lanes.json with five lanes (and why), the enum key and the write key, the vault app manifest with its permissions, and the link to the app vault.
---
## The layout of the data vault {#layout}

```
README.md                         what this vault is (private)
index.html                        loads telemetry-ux/app/telemetry-app.js and calls TelemetryApp.render({ sg, mount })
.vault/app.json                   the vault-app manifest (below)
.vault/owner/ro-links.json        the read-only links the owner made
telemetry-ux.link.json            the link to the app vault, read-only, pinned to its latest version
identity/public-bundle.json       the drain key's public half (RSA-4096 encrypt, ECDSA P-256 sign, fingerprints)
identity/lane-public.json         what the site publishes: endpoint, vault id, lane 1's token, the recipient key
identity/lanes.json               every lane, in the order a page tries them (below)
identity/drain-key.json           the drain key, passphrase-protected
identity/private/                 the drain key in the clear (PKCS8, and the sgit key-store folder), so whoever opens
                                  the vault can drain with no other secret: "the vault key is the master key"
drain/<YYYY-MM-DD>.jsonl          the opened events, one JSON line each, sorted keys (PRIVATE: has city and region)
reports/<YYYY-MM-DD>.json         the day's counts; reports/latest.json the newest; reports/classes.json the sessions' classes
```

## lanes.json {#lanes}

```
{ "v": 1,
  "about": "Each token only writes ... lane 1 is the site's first token, lanes 2 and up are derived from this vault's write key ...
            The enum key that lists and fetches every lane is derived from this vault's read key; it is not stored here.",
  "endpoint": "https://dev.send.sgraph.ai",
  "vault_id": "<id>",
  "lanes": [ { "name": "site telemetry, lane 1", "append_token": "<64 hex>", "used_by": "assets/telemetry.js on <site>" },
             { "name": "site telemetry, lane 2", "append_token": "<64 hex>", "used_by": "assets/telemetry.js, when the lanes before it answer 507" } ] }
```

**Why several lanes:** a lane holds at most 1,000 pending files of 5 MB; when it is full the write answers **507**. On 27 October the PHP site's traffic filled lane 1 between drains, so it added lanes 2 to 5 and the script tries them in order. Configure all of them in one call: `configure` **replaces** the anchor list (send every anchor, old and new).

## The keys and capabilities {#keys}

| Capability | Derived from | Can |
|---|---|---|
| **append token** (one per lane) | random, or derived from the write key | write to its lane, nothing else; published |
| **enum key** | the vault's read key | list, fetch, mark processed (the drain) |
| **write key** | the vault key (`Vault__Crypto().derive_keys_from_vault_key(key)['write_key']`, prefix stripped first) | configure lanes, purge; with the SG/Send access token |
| **drain key pair** | `sgit pki keygen` | decrypt the events; sign the reports |
| **vault key** | `sgit create` | everything: the master key |

## The vault app manifest, `.vault/app.json` {#app-json}

```
{ "entry": "index.html", "present": true, "auto_open": true, "title": "Who reads <site>", "hud": { "mode": "minimal" },
  "permissions": { "fs": { "read": true, "write": ["drain/", "reports/"] },
                   "append": { "list": true, "read": true, "markProcessed": true } } }
```

So opening the vault in the browser runs the app, which may read everything, write only `drain/` and `reports/`, and list, read and mark the lanes (draining from the browser). Note, from sgit.ai's append-lanes page: from a vault app, `list`, `fetch` and `markProcessed` act on the **open** vault only; only `write` crosses vaults.

## The link to the app vault, `telemetry-ux.link.json` {#link}

```
{ "vault_id": "<app vault id>", "ref_id": "lk-telemetry-ux", "type": "vault", "label": "The telemetry application (read-only)",
  "pin": { "mode": "latest" } }
```
