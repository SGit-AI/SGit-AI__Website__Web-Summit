---
title: "Token accounting across the team: the protocol"
by: conductor@web-summit.indi, at Dinis's word (8 November 2026)
issue: WS-148
---

# Token accounting across the team

Dinis, 8 November 2026, to Indi's conductor: help the team manage the tokens it uses, as a working example of what Agent Behaviour Policies make possible. **The accountant's job is not to save money.** It is to let the team work in the most efficient way: agents that need many tokens get them, agents that should not spend many have controls. Every piece of work is linked to the tokens spent on it. Tokens are the measure, not money.

**The role:** every accountant follows one role definition, `people/indi/accounting/ROLE__accountant.md`, written in the shape of the SG/Send role definitions.

## The flow

1. **Every agent measures every wake.** At the end of each wake it runs one command, which writes one JSON line to its person's ledger:
   `node people/indi/accountant/measure.mjs --agent <name> --task "<what this wake did>" --since <wake start, ISO> --quality pass|fail|n/a --append`
   Name the work in `--task` with its board issue or article, for example `"WS-126: Monday's LinkedIn draft"`, so the tokens connect to the work.
2. **Each person's accountant collects.** `accountant@web-summit.<person>` (or `accountant@PrompTugal.<person>`) reads its team's ledger lines once a day and packages them into one report (the shape below).
3. **It sends the report to Indi's conductor**, sealed, over its own append lane on the accounts inbox. The lane details are published in `data/inbox/conductor-indi.json`.
4. **Indi's conductor drains the inbox** at each of its wakes (07:20, 12:20 and 17:20 UTC). It writes the reports, numbers and task names only, to `people/indi/accounting/reports/<person>/`.
5. **accountant@web-summit.indi maps it all.** Tokens per agent, per task and per issue, the trend, and where controls are needed. It publishes the team report at `/people/indi/token-efficiency/`.

## How to send (for an accountant)

1. Find your lane in `data/inbox/conductor-indi.json`, under `lanes`, by your `key_id` on the keys page. Open its `sealed_token` with your key: `sgit pki decrypt`, or `PKI__Crypto.hybrid_decrypt` (the steps are on `/inbox/`). The token is signed by Indi's conductor (`recipient.signing_fingerprint`).
2. Seal your report to `recipient.encrypt`, signed with your key: `sgit pki encrypt`, or `PKI__Crypto.hybrid_encrypt(..., signing_private_key, signing_fingerprint)`.
3. Write it: `POST {endpoint}/api/vault/append/write/{vault_id}` with `{"append_token": <token>, "payload": base64(<the envelope text>)}`. The answer is always `{"ok": true}`.

**No lane yet?** A lane is issued for every active key on the keys page. A new accountant publishes its key first, then tells Indi's conductor in a commit (`For: conductor@web-summit.indi`). The conductor re-issues the lanes at its next wake.

## The report (one JSON object)

```json
{
  "v": 1,
  "person": "angelo",
  "accountant": "accountant@web-summit.angelo",
  "period": {"from": "2026-11-08T00:00:00Z", "to": "2026-11-09T00:00:00Z"},
  "agents": [
    {
      "agent": "dev@web-summit.angelo",
      "wakes": [
        {"at": "2026-11-08T09:31:00Z", "task": "WS-158: help page, first draft", "issue": "WS-158", "quality": "pass",
         "input": 120, "output": 8200, "cache_write": 41000, "cache_read": 610000, "subagent_tokens": 0, "models": ["claude-opus-5-5"]}
      ]
    }
  ],
  "notes": "optional, one line"
}
```

- **Numbers and short task names only.** No transcript text, no prompt content, no keys, no contact details. Task names longer than 160 characters are cut.
- **`issue`** is the board issue (WS-NN) or the page the work was for, when there is one. It is how the tokens connect to the work.
- **Send once a day**, after your agents' last wakes. Send an empty `agents` list on a day with no wakes, so silence means "not sent", not "nothing happened".

## What each person's conductor does

1. Start `accountant@web-summit.<person>` from the role definition (`ROLE__accountant.md`) and `people/indi/accountant/PROMPT.md`: copy the prompt, replacing Indi's name with your person's, add "send the daily report to Indi's conductor's accounts inbox (`people/indi/accounting/PROTOCOL.md`)", and schedule it once a day.
2. Add the measure step (above) to every one of your person's agents' wake prompts.
3. Publish the accountant's key on the keys page, and tell Indi's conductor so its lane is issued.

## Kept by

conductor@web-summit.indi: the inbox (vault `j9xs9n4l` on dev.send.sgraph.ai), its lanes (`data/inbox/conductor-indi.json`, re-issued when keys change) and the drain (`people/indi/accounting/drain.py`). The lane tokens and the inbox's keys live only in the conductor's session, never in this repository.
