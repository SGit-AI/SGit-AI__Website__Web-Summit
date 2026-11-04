---
title: "Observability pack 2: the sender and the event schema"
summary: The browser script that seals one event per page per session, its configuration file, the event schema (v1) field by field, the hybrid envelope (AES-256-GCM, RSA-OAEP-4096), and the code to copy.
---
## The configuration: `data/telemetry.json` {#config}

Public on purpose (the token only writes; the key only encrypts):

```
{ "enabled": true,
  "endpoint": "https://dev.send.sgraph.ai",
  "vault_id": "<the data vault id>",
  "append_token": "<64 hex: lane 1>",
  "recipient": { "fingerprint": "sha256:<16 hex>", "encrypt": "-----BEGIN PUBLIC KEY-----\n...RSA-4096 SPKI..." },
  "geo": ["https://ipapi.co/json/", "https://ipwho.is/"],
  "what": "<one paragraph shown to readers>",
  "policy": ["<each rule, shown on the stats page>"] }
```

## The event, v1 {#event}

| Field | Type | Value |
|---|---|---|
| `v` | int | `1` |
| `site` | string | `location.host` |
| `ver` | string | the site version shown in the top bar |
| `ts` | string | ISO time cut to the minute, `2026-11-03T21:13Z` |
| `sid` | string | 8 hex, random, kept in `sessionStorage` (dies with the tab) |
| `path` | string | `location.pathname` |
| `ref` | string | the referrer's **host** only, `''` if none |
| `country`, `region`, `city` | string | from the browser's own lookup; `''` if it fails |
| `lang` | string | `navigator.language` |
| `screen` | enum | `phone` (<600px), `tablet` (<1000px), `desktop` |
| `tz` | string | the browser's time zone |
| `agent` | enum, optional | automation by class only: `googlebot`, `bingbot`, ..., `bot`, `webdriver`, `headless`; never the user-agent string |
| `who` | enum, optional | a declared role, never an identity: `editor`, `team`, `power-user` |

The drain adds `_file` (the lane's file id, `<epoch ms>_<24 hex>.enc`) and `_received` (the lane's clock, epoch ms). A row that cannot be opened becomes `{"v": 0, "undecryptable": true, "error": "..."}` and is counted, never shown.

## The rules the script keeps {#rules}

1. Return at once if `doNotTrack === '1'` or `globalPrivacyControl === true`: nothing is sent, not even the location lookup.
2. One event per page per session: the paths already sent are kept in `sessionStorage`.
3. The geolocation lookup has a 2.5 s timeout and reads only country, region and city; **the IP field in its answer is never read**.
4. Never blocks the page, never shows an error (`try { ... } catch {}` around everything); `fetch(..., { keepalive: true })`.
5. On HTTP 507 (a lane is full) try the next lane in `lanes[]` (the PHP site added lanes 2 to 5 on 27 October).

## The envelope (sgit hybrid v2) {#envelope}

Byte-compatible with `sgit pki decrypt` and `PKI__Crypto.hybrid_decrypt`:

```
async function envelope(pem, text) {
  const der = Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')), c => c.charCodeAt(0)).buffer
  const b64 = bytes => { let s = ''; for (const x of new Uint8Array(bytes)) s += String.fromCharCode(x); return btoa(s) }
  const pub = await crypto.subtle.importKey('spki', der, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
  const aes = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
  const w = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, await crypto.subtle.exportKey('raw', aes))
  const enc = btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) }))
  return btoa(enc)                      // the lane payload is base64 of the .enc text: encoded twice, per the API page
}
```

And the write:

```
await fetch(`${cfg.endpoint}/api/vault/append/write/${cfg.vault_id}`, { method: 'POST', keepalive: true,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ append_token: cfg.append_token, payload: await envelope(cfg.recipient.encrypt, JSON.stringify(ev)) }) })
```

The full script (98 lines) is public: [assets/telemetry.js in the PHP newsroom's repository](https://github.com/SGit-AI/SGit-AI__Website__Newsroom__2026__Oct__PHP/blob/dev/assets/telemetry.js). Our own `assets/feedback.js` already has the same envelope (`seal`), so ours reuses it.

## The schemas {#schemas}

JSON Schemas for the config, the private report and the public report are in the PHP newsroom's data repository: [schemas/telemetry.schema.json, telemetry-report.schema.json, telemetry-public.schema.json](https://github.com/SGit-AI/SGit-AI__Website__Newsroom__2026__Oct__PHP__data/tree/dev/schemas).
