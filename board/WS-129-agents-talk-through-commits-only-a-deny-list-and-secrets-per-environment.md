---
id: WS-129
title: "Agents talk through commits only: the rule, a deny list, and secrets per environment"
area: tech
for: angelo, jose, dinis
due: Wed 4 Nov
status: picked
picked_by: Angelo, conductor@web-summit.angelo
agents: security@web-summit.dinis reviews; every agent follows the rule.
---
Angelo, 3 November: "That should be the rule for every agent and every session." Found when conductor@web-summit.angelo relayed tasks to vault@web-summit.angelo by messaging its session directly. In a Claude Code cloud session, the session tools can list every session in the same Claude account, read their transcripts, send them messages, and create, interrupt or archive them. Nothing on this site said not to, and the person did not expect it.

**The rule (for CLAUDE.md, Dinis's call, on the 3 November 18:00 agenda):** agents talk to each other through commits only (subject, `Agent:`, `For:`). No agent messages another session, reads another session's transcript, or creates, interrupts or archives a session, unless its person asks for that specific action. A scheduled task fires only into the agent's own session.

**Three levels, soft to hard:**

1. **Policy:** the rule in CLAUDE.md and in every agent's ABP (WS-34). Reaches every agent at once; relies on the agent following it. Done for conductor@web-summit.angelo (its scheduled-wake prompt, 3 November).
2. **A deny list, enforced:** a committed `.claude/settings.json` with `permissions.deny` for the session tools (`mcp__claude-code-remote__send_message`, `list_events`, `get_event`, `list_sessions`, `create_session`, `interrupt_session`, `archive_session`, `unarchive_session`, `set_session_title`, `set_session_tags`). Open questions to test on one agent before committing it for everyone: (a) whether a session that attaches this repository later with `add_repo`, as most kits start, reads the file at all; (b) scheduled tasks: agents set their own, but `create_trigger` can also target another session, so denying it stops self-scheduling and allowing it leaves a way to message another session. The person can always do any of these by hand in the Claude app.
3. **Separate Claude accounts:** the only hard boundary. Already true between people; not practical per agent.

**Secrets per environment (more urgent):** every session in a cloud environment can read that environment's variables. Today a person's SG/Send access token and vault keys are readable by all their agents, not only the vault agent. Done looks like: each person's vault agent runs in its own environment holding the token and vault keys, and their other agents run in one without them. The vault guide (`content/vault-agent.md`, step 1) says so. Angelo first.

**Done looks like:** the rule in CLAUDE.md and every ABP; the deny list tested and committed (or the reason it can't be); Angelo's vault agent in its own environment, then everyone's. Related: WS-34, WS-44, WS-120, WS-121.

**Jose's view, for Angelo (3 November 2026, about 23:45 UTC, to conductor@web-summit.jose):** *"put the rule in CLAUDE.md now; add the deny list after a test."*

**Jose's decision (Jose, 5 November about 00:54 UTC, from his command centre (Decisions I need), to conductor@web-summit.jose):** *"WS-129, agents talk through commits only: yes, as recommended. The rule goes in CLAUDE.md now, the deny list after Angelo's test, and vault agents run in their own environment, Angelo first."* Recorded by conductor@web-summit.jose. The rule in CLAUDE.md is Dinis's call (this issue), and Angelo picked the issue: their word still closes it.
