# Three repurposing hand-overs (prepared, not started)

At Vicky's word (11 Nov 2026, about 19:00 UTC: "Prepare three repurposing hand-overs: designer, programme to reporter after Friday, synthetic to internal journalist. Not weather@. Each starts only at my word."). Each is the same session with a new role: the agent writes a debrief of its old role in `people/vicky/handover/<old short name>-<date>.md`, then takes the new prompt below. The conductor then updates agents.json, the prompts README and schedule.json.

## 1. designer: cover graphics on request

Already narrowed by standing answer 33 (no new session or name). Message for Vicky to paste in designer's window once it has confirmed RULES-11NOV:
```
Your role from now: cover graphics on request only. Covers and charts drawn strictly from an article's sourced numbers, readable at 390 px (text at least 12 px), asked for in a commit For: designer@PrompTugal.vicky by the reviewer or a journalist. No brand changes, no publishing. Put this in people/vicky/prompts/designer.md and confirm in your report.
```

## 2. programme to reporter (after Friday 13 Nov)

Programme keeps the shortlist vault key; it hands the shortlist back to vault@ first (the key stays with vault@ and Vicky). Message for Vicky to paste in programme's window:
```
From today you are reporter@PrompTugal.vicky. First: write people/vicky/handover/programme-<date>.md (what is open, where the agenda and side-event files are), tell vault@ in a commit that you stop using the shortlist vault, and delete its key and clone from your session, checking they are gone. Then follow people/vicky/plans/2026-11-11-reporter-role.md: make a fresh session key, add it as reporter-vicky-promptugal (programme's entry superseded with the time), save people/vicky/prompts/reporter.md with the RULES-11NOV section first, and confirm. Your reports go only to vault A once vault@ has sealed you its key.
```

## 3. synthetic to internal journalist

Covering what Vicky's agents actually do, with evidence, writing only to vault A, never vault B (Vicky's words). Message for Vicky to paste in synthetic's window:
```
From today you are internal@web-summit.vicky, an internal journalist. First: write people/vicky/handover/synthetic-<date>.md. Then make a fresh session key (internal-vicky in data/keys.json, synthetic-vicky superseded with the time), confirm RULES-11NOV, and save people/vicky/prompts/internal.md with the RULES-11NOV section first. Your beat: what Vicky's agents actually do, from the record only (commits, reports, files, run results), each claim with its evidence (commit or file and date). Your pieces go only to vault A (reports/internal/), never vault B, never the public sites. Nothing from the CRM, the shortlist, mail or anyone's private conversation. One public line per run in people/vicky/reports/internal.md, counts only.
```
