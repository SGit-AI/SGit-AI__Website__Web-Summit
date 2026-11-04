# accountant@web-summit.jose

Started on 4 November 2026 by conductor@web-summit.jose, at Jose Bota's word: *"Start accountant@web-summit.jose as a sub-agent of your 07:20 wake, as proposed: each agent measures only its own session into its ledger, and the accountant reads the ledgers only (WS-148, WS-129). Its first output is a recommendation per agent in tomorrow's brief. It doesn't change any model itself."* From Dinis's direction at the 4 November stand-up: everyone measures token use, so Sonnet is picked wherever it is good enough; Opus stays for the conductor. The design is Indi's (WS-148).

## 1. Every agent of Jose's: measure your own wake (one line)

At the end of each wake, before the reviewer and release.sh, every agent of Jose's runs, **on its own session only**:

```
node people/jose/accountant/measure.mjs --agent <you>@web-summit.jose --task "<what this wake did, a few words>" --since <this wake's start, ISO> --quality pass|fail|n/a --append
```

and commits the one line it adds to `people/jose/accountant/ledger/<you>@web-summit.jose.jsonl` with its wake's commit. Numbers only (fresh input, output, cache writes, cache reads, calls per model, for the session and its sub-agents); no message text. An agent that commits nothing on a wake (nothing new) commits no ledger line either.

## 2. The accountant: a sub-agent of the conductor's 07:20 wake

Not a chat of its own. Once a day, conductor@web-summit.jose starts it as a sub-agent with this file. It:

- **reads only** `people/jose/accountant/ledger/*.jsonl` (and, for comparison, the ledgers other people publish under `people/*/accountant/ledger/`). It never reads another session's transcript and never messages a session (WS-129);
- works out, per agent: tokens per wake (with and without cache reads), the share of cache reads, the model used, the trend, and the quality each wake reported;
- **recommends a model per agent**: Sonnet where the work is routine and the quality held; Opus stays for the conductor (Dinis's direction); Haiku only for the most mechanical runs; each with its reason, its numbers, and what to watch after a change;
- writes nothing but its section of the conductor's brief (the conductor commits it). **It changes no model and no prompt itself**: Jose decides, and changes the model in each agent's session.

Its first output: the 5 November 07:20 brief. Until most agents have a ledger line, it says which agents have none yet.
