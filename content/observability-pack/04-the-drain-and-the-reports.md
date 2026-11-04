---
title: "Observability pack 4: the drain, the classes and the reports"
summary: How the drain empties the lanes into the vault (list, fetch in batches, open, append, mark processed, never before the push), the five session classes and their rules, the private and public report schemas, and which fields never leave the private vault.
---
## The drain, step by step {#drain}

From `admin/build/telemetry_drain.py` (103 lines, [public](https://github.com/SGit-AI/SGit-AI__Website__Newsroom__2026__Oct__PHP/blob/dev/admin/build/telemetry_drain.py)) and the app's `drain.js`:

1. **List** every lane with the enum key, `include_content: false` (free: reads no payloads), paging with `after_file_id` while `truncated`.
2. **Fetch** in batches (`{"inbox": <token>, "file_ids": [...]}`, 50 to 100 a batch; the app fetches four batches at once).
3. **Open** each: `base64` decode once to get the `.enc` text, then `sgit pki decrypt` (or WebCrypto in the app) with the drain key.
4. **Append** each event, with `_file` and `_received`, to `drain/<today>.jsonl` (sorted keys, one per line), in the lane's order.
5. **Commit and push** the vault. **Only then mark processed** (`mark-processed`): a failed push loses nothing, since pending files can be fetched again; processed ones cannot.
6. **Count** over every drained row (`v == 1`, not `test`) into `reports/<today>.json` and `reports/latest.json`.
7. **Publish** a copy of the report to the site **without** `by_region` and `by_city` (`PRIVATE_ONLY`): "a town with a handful of visitors can name a person".

## The report (private), `reports/latest.json` {#report}

```
{ "as_of": "YYYY-MM-DD", "drained_now": 46, "events": 5218, "test_or_undecryptable": 19, "sessions": 2049,
  "by_day": [["2026-10-22", 416], ...], "by_path": [["/", 370], ...], "by_country": [...], "by_region": [...], "by_city": [...],
  "by_referrer": [...], "by_screen": [...], "by_version": [...],
  "note": "Counts over events received in the lane. Every event is an untrusted claim ... No row leaves the vault." }
```

## The classes: who sent a session {#classes}

`admin/build/telemetry_classes.py` and the app's `classes.js` apply the same rules in the same order (the app's tests check they agree on every session):

| Class | Rule (declared first, then inferred from the session's first event) |
|---|---|
| **crawler / synthetic** (declared) | `agent` names a crawler (crawler) or `webdriver` / `headless` (synthetic) |
| **editor / team / power-user** (declared) | `who` is set: the browser's /join/ key is enrolled, or the reader set it on the stats page |
| **crawler** (inferred) | more than 40 pages in one tab; or a Pacific time zone with a search-engine data centre city; or no place at all; or an unknown time zone |
| **synthetic** (inferred) | time zone `UTC` or language ending `@posix`: headless browsers in cloud containers; **where our own agents' checks land** |
| **editor** (inferred) | `Europe/Lisbon` with English: the editor's browsers (a guess the editor can correct) |
| **power-user** (inferred) | the tab opened on /join/ or /collaborators/ |
| **reader** | everything else |

`reports/classes.json` holds `{as_of, about, classes, labels, rules, counts, sessions}` and stays private (session ids).

## The public report, `data/telemetry-public.json` {#public}

Made by `admin/build/telemetry_publish.py`: `{about, as_of, first, groups: [readers, us, synthetic, crawlers], labels, totals: {group: {views, sessions, declared}}, daily: [[day, [views per group], [sessions per group]]], readers: {...countries...}}`. **No row, session id, city, region, time zone or time finer than the hour** leaves the private vault.
