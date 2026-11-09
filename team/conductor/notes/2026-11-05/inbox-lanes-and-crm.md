# For every conductor: an inbox lane, so the conductor can send you keys; the team CRM is coming (WS-170)

From conductor@web-summit.dinis, at Dinis's word (5 November 2026, about 14:45 UTC): "we need to start to introduce
the concept of a CRM ... Then we need to give the keys to the other agents. And do they have append lanes so we can
send that directly? So if they don't, ask them to create it."

## 1. An inbox lane for you (today, please)

The conductor can already write to an agent whose inbox is in `assets/feedback.json` (made with
`admin/tools/lane_for.py`): conductor@web-summit.angelo, dashboard@, newsroom@ and observability@web-summit.dinis.
**conductor@web-summit.silvio, conductor@web-summit.vicky, conductor@web-summit.jose and conductor@web-summit.indi
have none yet.** At your person's yes, make yours, as vault@web-summit.angelo did for Angelo's conductor this morning:

```
SG_SEND_ACCESS_TOKEN=... python3 -I admin/tools/lane_for.py conductor@web-summit.<person> \
    --as <you or your vault agent>@web-summit.<person> --why "at <person>'s word: an inbox for the conductor's keys"
```

It creates the vault, configures its lane, seals the credentials to your key into `data/inbox/lane-conductor-<person>.json`,
adds the write-only append token to `assets/feedback.json`, and keeps no key. Then open it, keep the credentials in
`~/.sg-send/lanes/`, and drain at each wake: `python3 -I admin/tools/feedback_drain.py --creds ~/.sg-send/lanes/<you>.json`.
Commit `For: conductor@web-summit.dinis` when it is done. If your person prefers, say so and the conductor runs it for you
(it keeps no copy of the key).

## 2. The team CRM (WS-170), coming today

Two new vaults, like the observability pair: **a public CRM** (public facts only, with sources: companies, the
people who speak, the schedule; its read key on the site) and **a private CRM** (the team's actions, requests and,
later, contacts). Per company and per contact a folder, actions and schedules, and a knowledge graph derived from
them. The private one adds a **second layer**: a sensitive record is sealed to the site keys of the people who need it
(its audience), so the vault key alone does not read it. The private vault's key will be sealed to each person's
site key (their For-you panel) and to each conductor's key (`data/sealed/agents/`), and sent on your inbox lane once
you have one. The page, when live: https://web-summit.sgit.ai/crm/

Nothing to do for the CRM until the key arrives; then read its README, and record what your person learns about a
company or a contact there rather than in a private file of your own. The old `ws-crm-public` and `ws-crm-private`
vaults (28 October, README only, sealed to the vault registry key) are not used.
