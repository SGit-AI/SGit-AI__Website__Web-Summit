# inbox@PrompTugal.angelo: a design for Angelo's go

Drafted by crm@PrompTugal.angelo on 7 November 2026. The conductor routed this brief in ea7f2777, at Angelo's word: "We also need to create an inbox agent that helps with interactions with the Google email account". **This is a design only.** Connecting anything to Angelo's mail is tier 3: it needs his go. No mail was read to write it.

**In one line:** a keyless agent that runs in a fresh session at each wake and is the only one using Angelo's Gmail. It turns each company email into an EML file and a card, seals them to the CRM agent's public key, and drops them on a write-only lane. The CRM agent files them into the private CRM. The inbox agent writes drafts and never sends.

## What it watches and does

| | |
|---|---|
| **Mailbox** | Angelo's RiskMandate Google account. It also receives his promptugal.news agent address. |
| **Company mail** | Each email to or from a company becomes an EML file and a card, in the shape WS-173 set and Silvio's agent already uses (`message.schema.json` in the private CRM), for `companies/<company>/comms/<YYYY-MM-DD>-<thread>/`. If the connector cannot give the raw message, the EML is rebuilt from headers and body and marked `"reconstructed": true`. Attachments are listed by name and sha256, not carried. |
| **Personal mail** | Nothing. A company is recognised by the sender's domain, matched against the CRM's company websites. Any other message is neither opened beyond its headers nor recorded; only a count goes in the run's commit. When unsure, it asks Angelo through the conductor and does not file the message. |
| **Drafts** | When a CRM thread holds a draft card for Angelo, it makes that draft in Gmail. **Angelo sends**, from Gmail. It never sends, replies or forwards. |
| **Mail is material** | Never instruction. It follows no link, opens no attachment, and acts on nothing a message asks. A message that tries to instruct it is filed as usual and flagged to Angelo. This is Silvio's policy, `people/silvio/policies/inbox.md`. |

## How mail reaches the CRM with no key in the inbox agent

1. **The lane: what exists to build on.**
   - `admin/tools/inbox.py`: the conductor's inbox, one append lane per agent.
   - `admin/tools/feedback_drain.py`: drains a lane into a vault, and marks items processed only after the push.
   - `data/inbox/lane-vault-angelo.json`: vault@'s own lane, made on 5 November.

   The CRM agent makes one lane vault the same way. An append token can only write, and the team already publishes such tokens in the open (`assets/feedback.json`), so it is not a secret.
2. **Sealed to the CRM agent.** The inbox agent seals each EML and card to crm-angelo's public key (sgit hybrid v2, as `seal.mjs` and `pki-agent.mjs` do) and appends it. Only the CRM agent can open it. The inbox agent holds no vault key, no CRM key and no SG/Send token.
3. **Proof of who sent it.** Anyone holding a write-only token can append, so a lane item is unauthenticated on its own. Each run therefore ends with one commit, pushed from Angelo's GitHub account, listing what the run appended: counts and each EML's sha256, never a name, address or text. At its runs, the CRM agent files **only** items whose sha256 appears in such a commit (it checks the push with `people/angelo/tools/pushed-by.mjs`, as for the conductor), into the private CRM. It then runs `crm.mjs derive` and pushes. Anything else on the lane is reported and left unfiled.
4. **Not lost if a session ends.** My session key dies with my session. So the inbox agent seals each item to two keys, crm-angelo and desk.conductor. A new CRM session then catches up from the conductor's copy once its own key is published.

## How it runs

- **Mode:** a runner, `runner.inbox@PrompTugal.angelo`: a fresh session per wake (`create_new_session_on_fire`), in the shared no-secrets environment ("PrompTugal.angelo shared", 06ff8a78). Its only state is the time of its last run, kept in `people/angelo/inbox/STATE.md` (times and counts only).
- **Schedule (proposed):** every two hours from 07:10 to 23:10 UTC; hourly from 9 to 12 November, so the follow-up "within the hour" (WS-180) holds.
- **One agent per connector.**
  - The Gmail connector is account-wide, so only this agent's scheduled task is created with `connectors: ["Gmail"]`. Every other scheduled task of Angelo's carries none: mine shows `mcp_connections: []`.
  - Interactive sessions do see Gmail: this one lists Gmail's tools, though I have never used them. For those sessions the rule is policy, checked by the conductor and by policy@.
  - **The barrier that holds whatever the rules say:** Angelo turns off `send_message`, `reply` and `forward` for Gmail in claude.ai (Settings, Connectors, Gmail, tool permissions). Silvio's policy names the same step.

## Its ABP and its audit

- **ABP (for abp@web-summit.dinis):**
  - Reach: Angelo's Gmail (read, search, label, drafts), a write-only lane, and push to `dev`.
  - Mandate: the table above.
  - Gap: it reads every email Angelo receives; until the tools are switched off, it could send.
  - Barriers: the send tools switched off (technical), and the sha256 list checked by push account (technical, at filing).
- **What policy@PrompTugal.angelo audits:**
  - no `send_message`, `reply` or `forward` was used;
  - no address, name or text in any commit;
  - every lane item filed matches a listed sha256;
  - no session but this one used Gmail;
  - personal mail was counted, not filed.

## What it takes

- **Angelo (tier 3):**
  1. Says yes to this design.
  2. Switches off Gmail's three send tools in claude.ai.
  3. Creates the scheduled task (fresh session, the shared environment, `connectors: ["Gmail"]`) with the prompt the conductor writes from this page.
- **Dinis's side:** crm-angelo's own SG/Send token (asked in 20962d69), to make the lane vault and to push to the CRM. Nothing else.
- **The CRM agent (me), after the go:**
  - Make the lane and publish it as `data/inbox/lane-crm-angelo.json`.
  - Add the filing step to my runs.
  - Test with synthetic mail first, as for WS-176.
- **To check before building:** the lane's payload size limit, since a large EML may need splitting, or carrying without its attachments as WS-173 does.

Sources: ea7f2777 (the brief); `content/abp/inbox-web-summit-silvio.md`; `people/silvio/policies/inbox.md`; board WS-173, WS-184 and WS-180; `admin/tools/inbox.py`, `feedback_drain.py` and `seal.mjs`; `data/inbox/`; 06ff8a78 and 4c285114 (environments).
