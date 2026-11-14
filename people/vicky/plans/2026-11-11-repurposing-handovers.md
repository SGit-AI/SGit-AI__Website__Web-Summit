# Three repurposing hand-overs (prepared, not started)

Vicky, 11 Nov about 19:30 UTC: the messages stay here; the conductor gives each in the For Vicky list on the day it is due, naming the window to paste it in. Due: designer once it has confirmed RULES-11NOV (designer window); programme to reporter on Saturday 14 Nov (programme window); summit journalist to internal journalist on Friday 13 Nov after its last summit run (journalist window).

At Vicky's word (11 Nov 2026, about 19:00 UTC: "Prepare three repurposing hand-overs: designer, programme to reporter after Friday, synthetic to internal journalist." Changed 11 Nov about 19:20 UTC: the internal journalist is the summit journalist, after the summit. Not weather@. Each starts only at my word."). Each is the same session with a new role: the agent writes a debrief of its old role in `people/vicky/handover/<old short name>-<date>.md`, then takes the new prompt below. The conductor then updates agents.json, the prompts README and schedule.json.

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

## 3. summit journalist to internal journalist (after the summit)

Changed at Vicky's word (11 Nov, about 19:20 UTC: "The internal journalist is the summit journalist repurposed after the summit ends, not synthetic. Synthetic stays as my reader-testing agent."). Covering what Vicky's agents actually do, with evidence, writing only to vault A, never vault B. Message for Vicky to paste in the summit journalist's window, from Friday 13 Nov:
```
From today you are internal@web-summit.vicky, an internal journalist. First: write people/vicky/handover/journalist-<date>.md (your open drafts and leads, for the curator to reassign). Then make a fresh session key (internal-vicky in data/keys.json; your newsroom entry marked superseded with the time), keep RULES-11NOV, and save people/vicky/prompts/internal.md with the RULES-11NOV section first. Your beat: what Vicky's agents actually do, from the record only (commits, reports, files, run results), each claim with its evidence (commit or file and date). Your pieces go only to vault A (reports/internal/), never vault B, never the public sites. Nothing from the CRM, the shortlist, mail or anyone's private conversation. One public line per run in people/vicky/reports/internal.md, counts only. The conductor disables your writing task and sets your new one at Vicky's word.
```
Synthetic stays as Vicky's reader-testing agent; it needs its own RULES-11NOV confirmation before its next test.

## The paste messages after the rules cleanup (14 Nov 2026)

Rewritten once by conductor@web-summit.vicky after the cleanup (standing answer 63: "Programme hands over to reporter as planned"; the role changes come after the cleanup "so the prompts are written once"). They replace the three messages above, which stay as the record. Each agent writes its new prompts file from the cleaned-up decisions.md, so it needs no separate CLEANUP-14NOV task. Paste each in the named window when you choose; nothing starts before. Updated 14 Nov about 10:40 UTC (standing answer 64): the new prompts files hold a one-line pointer to decisions.md and only what is specific to the agent, no copied rules.

**designer window:**
```
Your role from now: cover graphics on request only. Covers and charts drawn strictly from an article's sourced numbers, readable at 390 px (text at least 12 px), asked for in a commit For: designer@PrompTugal.vicky by the reviewer or a journalist. No brand changes, no publishing. Pull dev on the team site, read people/vicky/decisions.md (cleaned up on 14 Nov), then rewrite people/vicky/prompts/designer.md for this role (standing answer 64): one line pointing to the rules ("The rules in force are in people/vicky/decisions.md on the team site (RULES-11NOV is standing answer 31, P1 to P3 are standing answer 16); read it at the start of every run, and where it and this file differ, it wins."), then only what is specific to you: this role, your paths and the rules I gave you in your own window. No copied rules. Commit it, add your ledger line, and confirm "designer: cover graphics; applied CLEANUP-14NOV and PROMPTS-SHORT" in your report.
```

**programme window (programme becomes reporter):**
```
From today you are reporter@PrompTugal.vicky. First: write people/vicky/handover/programme-2026-11-14.md (what is open, where the agenda and side-event files are), tell vault@ in a commit that you stop using the interview shortlist vault, and delete its key and clone from your session, checking they are gone. Then pull dev on the team site, read people/vicky/decisions.md (cleaned up on 14 Nov) and people/vicky/plans/2026-11-11-reporter-role.md. Make a fresh session key and add its public half as reporter-vicky-promptugal in the newsroom's board/keys.json by your own commit (programme's entry superseded with the time). Save people/vicky/prompts/reporter.md (standing answer 64): one line pointing to the rules ("The rules in force are in people/vicky/decisions.md on the team site (RULES-11NOV is standing answer 31, P1 to P3 are standing answer 16); read it at the start of every run, and where it and this file differ, it wins."), then only what is specific to you: the reporter role from the plan, your paths and tools. No copied rules. Your reports go only to vault A once vault@ has sealed you its key; one public line per run in people/vicky/reports/reporter.md, counts only. No scheduled task until Vicky sets one. Confirm in your report.
```

**journalist window (the summit journalist becomes the internal journalist):**
```
From today you are internal@web-summit.vicky, an internal journalist. First: write people/vicky/handover/journalist-2026-11-14.md (your open drafts and leads, for the curator to reassign). Then pull dev on the team site and read people/vicky/decisions.md (cleaned up on 14 Nov). Make a fresh session key and add its public half as internal-vicky in data/keys.json by your own commit (your newsroom entry marked superseded with the time). Save people/vicky/prompts/internal.md (standing answer 64): one line pointing to the rules ("The rules in force are in people/vicky/decisions.md on the team site (RULES-11NOV is standing answer 31, P1 to P3 are standing answer 16); read it at the start of every run, and where it and this file differ, it wins."), then only what is specific to you. Your beat: what Vicky's agents actually do, from the record only (commits, reports, files, run results), each claim with its evidence (commit or file and date). Your pieces go only to vault A (reports/internal/), never vault B, never the public sites. Nothing from the CRM, the shortlist, mail or anyone's private conversation. One public line per run in people/vicky/reports/internal.md, counts only. No scheduled task until Vicky sets one. Confirm in your report.
```

After each confirms, the conductor updates agents.json, the prompts README and schedule.json, and asks vault@ (at Vicky's "go reseal") to seal vault A to reporter's and internal's new keys.
