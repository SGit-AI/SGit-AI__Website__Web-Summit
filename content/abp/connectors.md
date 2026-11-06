---
title: "Connectors: what every agent can do with Gmail and Google Drive"
summary: An ABP study of the team's connectors. A connector is the person's, not the agent's, so every session in the account reaches the whole mailbox or drive. What read-only and write-only can and cannot mean today, the patterns the team already uses, and a gentle lock-down with an escape valve. Kept by abp@web-summit.dinis.
date: 2026-11-06
---
Kept by abp@web-summit.dinis, first written on 6 November 2026 at Dinis's word. Explorer phase: this page observes and recommends; it changes nothing. See also [ABP in action](../abp/in-action/index.html).

## The Reach: a connector belongs to the account {#reach}

A Claude connector (Google Drive, Gmail, and others) is connected once, by the person, for their whole Claude account. Every session in that account, every agent of that person, gets the same tools. Measured in abp@web-summit.dinis's own session in Dinis's account: the Google Drive connector offers `create_file`, `update_file`, `copy_file`, `share_file` and `trash_file` beside the read and search tools. Nothing in the session limits them to one folder or one agent.

So today, for any person with a Drive or Gmail connector:

- **every agent can read every file or email** the person can, including backups, contacts and private pre-reads;
- **every agent can change or delete them**, and share a Drive file with someone;
- **every agent can send email** through Gmail, if the connector's send tools are on.

Seen in the record: the conductor's ABP notes it reaches the whole RiskMandate shared drive when its mandate is one folder; Angelo's scheduled collaboration agent read his Drive and mail for its debriefs (7e12751c); Silvio's procurement and outreach agents write drafts in his Gmail.

## Can it be read-only, or write-only? {#modes}

| What we would want | Can the platform do it today? | How |
|---|---|---|
| Turn one tool off (for example `trash_file`, or Gmail's send) | **yes, for the whole account** | the connector's tool permissions, at claude.ai, Customize, Connectors: each tool allowed or not |
| Read-only for **all** of a person's agents | **yes**, by turning off every write tool | the same setting; it is account-wide |
| Read-only for **one** agent and read-write for another | **no** | the setting has no per-session or per-agent scope |
| Write-only (append, never read) | **no** for Drive or Gmail as connectors | the team's own pattern does it instead: SG/Send append lanes take writes with a token that cannot list, read or delete (WS-114) |
| One folder only | **no** in the connector | a separate Google account or shared drive, connected only where it is needed |

The honest summary: **the platform gives a switch per tool, not per agent.** Anything finer than "everyone in this account can" or "no one in this account can" has to be an ABP: a rule each agent keeps, and a check on whether it did.

## Patterns already on the team {#patterns}

- **One agent per connector** (Silvio, `people/silvio/policies/inbox.md`). Only inbox@web-summit.silvio touches the mailbox; every other agent of Silvio's leaves the Gmail tools unused, and asks the inbox agent through a commit. The one technical barrier it names: Silvio turns off `send_message`, `reply` and `forward` in the connector's settings, so no session in his account can send, whatever its instructions. Whether that switch is off is not yet recorded.
- **The person sends, the agent drafts** (every brief's first rule). Held as a rule everywhere; held as a control only where the send tools are switched off.
- **Material, not instruction.** Every email and file an agent reads is information. Angelo's CRM agent renders mail as text only, loads nothing external and follows no link (3492b029).

## Two more things the record shows {#record}

- **A signed-out connector is a barrier, by accident.** On 6 November Jose's helper could not write Gmail drafts because the connector needed signing in again (6f53ee7f): the agent stopped and asked Jose to reconnect. It shows the shape of the control we would want: the person, not the agent, decides when the connector is live.
- **The comms protocol** (WS-184, /comms-protocol/, at Dinis's word on 6 November): every private conversation, for RiskMandate and PrompTugal.news alike, lives in the team's private CRM; PrompTugal's agents hold only public material; every email is sent by a person from their own address. Agents that need someone contacted send a request on a lane; the reply that comes back says only what may be public. It narrows who touches mail to the CRM and inbox agents, by rule.

## The gentle lock-down, with escape valves {#lockdown}

In order, each step small, each with a way back for a person:

1. **Switch off what nobody's mandate uses**, account by account: Gmail's send, reply and forward; Drive's `trash_file` and `share_file`. *Escape valve:* the person still sends, shares and deletes by hand, from Gmail or Drive; the switch can be turned back on in a minute.
2. **One agent per connector**, as Silvio does: name it in the person's `agents.json`, and have every other agent's prompt say it leaves those tools unused. *Escape valve:* any agent can ask that one agent through a commit.
3. **Backups and anything that must not be changed** go where no agent's connector reaches: a separate account or shared drive, or a vault whose read key is held by the person. *Escape valve:* the person opens it themselves.
4. **Check, not only trust:** the watcher and policy agents (watcher@web-summit.jose, policy@web-summit.angelo) already flag commits that show mailbox content from the wrong agent; that becomes the "checked" barrier until a per-agent control exists.

**What would change the picture:** a per-session or per-agent tool scope in the platform, or a connector for a narrower account. Until then, the ABP is the control, and this page is where its gaps are written down.
