# Brief: archive your Claude Code sessions

**To:** each member of the Web Summit 2026 team. **From:** Dinis.

## What I'm asking
Archive every Claude Code session on your account into your own encrypted vaults, before the sessions age out or get archived away. They are the record of what we built at Web Summit, and of how our agents behaved while building it.

I've done mine: 581 sessions, 11 vaults, with a master vault and a Sessions Explorer that searches and queries all of them in the browser. Now it's your turn, with the same kit.

## What you get
- **Project vaults, grouped as you choose.** Each one holds the full record of every session: every event, a readable transcript and an analysis.
- **A master vault** with the Sessions Explorer: search, SQL and statistics over all your sessions.
- **A behaviour review of every session.** Each review lists where an agent went beyond its mandate or slipped on the house rules: keys, contact details, pushes, holds. These reviews feed our Agent Behaviour Policies.

Only you hold the keys. Nothing is public.

## What it takes from you
About 10 minutes to start, then a check-in now and then while your agent works, which takes a few hours.
1. Start a new Claude Code cloud session on **Opus**, in an environment with your `SG_SEND_ACCESS_TOKEN` and `pip install sgit-ai==0.27.0`.
2. Put the kit in `~/session-archive`. It is on the team site, at `admin/tools/session-archive/` in the repository SGit-AI/SGit-AI__Website__Web-Summit; `START.md` there has the one-line command.
3. Open `START.md` in the kit and paste the prompt from its Part 2 into the session.
4. Answer the one question your agent asks: which projects your sessions belong to. It proposes a grouping from your session titles.
5. At the end, your agent writes the master link to a file. Keep that link safe: it opens everything.

## What to know
- **Your agent only reads.** It never wakes, messages or changes any of your sessions or scheduled tasks.
- **Safeguard stops are expected.** Anthropic's usage-policy safeguards sometimes stop a helper, and the session it was fetching is then left out. On my account that cost 11 of 581 sessions. Your agent tells you which ones and carries on.
- **Read the high and critical findings at the end.** In my run the reviews found vault keys committed to public repositories. If yours find something still live, rotate that key.
- **Mind your usage.** The export uses a lot of tokens, roughly 50,000 per session.
  - **Check your remaining usage before you start.** If you're near your limit, wait for it to reset.
  - **Or archive in parts:** your agent can do one project vault at a time.

Questions to me. Problems with the kit: tell your agent to write them to a file and send it to me.
