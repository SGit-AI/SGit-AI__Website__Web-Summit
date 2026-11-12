# If the team account nears its usage limit: moving the busiest agents to Vicky's personal account

At Vicky's word (12 Nov 2026, about 21:00 UTC, standing answer 53): "When my account's usage reaches about 90% of the weekly or 5-hour limit, warn me at the top of For Vicky, and give me the steps to move my most-used agents to my personal account before it runs out."

Public file: no session ids, keys, tokens or vault contents.

## How the conductor knows

- **What it can see:** each session's usage record (`get_session`, usage numbers only, P6) includes the account's rate-limit state: which limit applies (five-hour or weekly), whether it is "allowed" or in a warning state, and when it resets. It does **not** give a percentage. The warning state is the closest signal to "about 90%"; the exact threshold is set by the service, not by us.
- **When it looks:** at every wake (08:45 brief, 20:45 relay) and every time it hands work on in the on-demand pipeline. If any of Vicky's sessions shows a warning state or "using overage", the next thing Vicky reads from the conductor starts with a line: **"Usage: the team account is near its <five-hour or weekly> limit (resets <time>). Steps to move agents below."** If the conductor is not awake, it cannot warn: the Claude app's own usage warning is the backstop.
- **Once the limit is reached**, every session on the account stops, including the conductor's, until the reset. That is why the steps below are hers to run, from her personal account.

## Who moves first (busiest by the 12 Nov 08:50 reading; the order is re-checked at the warning)

1. reviewer, 2. journalist-ai, 3. the summit journalist, 4. journalist-connections, 5. curator. The researcher has no twin on the personal account (its old key there is Dinis's), so it waits for the reset; dashboard, checker and the rest wait too.

The personal account still has a paused twin for the reviewer, the five journalists, the curator, programme, the checker and dev (the 11 Nov hand-over, the newsroom's `desks/conductor-vicky/HANDOVER-to-team-conductor-2026-11-11.md`, section 5), and conductor.B. So moving is waking a twin, not building a new agent.

## The steps (Vicky, about 10 minutes)

1. **On the team account, stop the agent first** (one session per role, never two): the conductor disables that agent's scheduled task if it has one (at her word, given in the warning line's reply). On-demand agents need nothing: the conductor simply stops messaging them.
2. **On the personal account, open conductor.B's window** and paste: `Conductor.B: the team account is near its limit. Wake <agent list> for Vicky's desks. Each pulls dev, reads people/vicky/decisions.md on the team site (standing answers 31 to 53 apply), confirms in one report line, and works on demand from you. Re-enable only the wakes I name.`
3. **Each twin's key:** its personal-account key is still in the newsroom's board/keys.json marked superseded. The twin makes a fresh key and adds it by its own commit, marking the team key superseded, as on 11 Nov (standing answer 32). Lanes: as before, from conductor@PrompTugal.dinis.
4. **Work routing while moved:** the team conductor (if still running) commits requests to `desks/conductor-vicky/requests/from-team/`; conductor.B relays them. If the team conductor is stopped too, Vicky gives work in conductor.B's window.
5. **After the reset, move back** the same way as 11 Nov: each team session confirms, then conductor.B pauses the twin's wake.

## What it costs

Nothing extra while it waits. Moving shifts usage to the personal account's own limits; it does not reduce it.
