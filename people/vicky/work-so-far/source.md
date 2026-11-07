# Vicky's agents: the work so far

## Who works for me

Each agent is its own Claude Code session in my account. Most run on a schedule (times in UTC); vault, dev and the paused designer run only when I ask. Each reports to my conductor, which gives me one brief a day at 09:30 UTC.

**Running the team**

- **conductor@web-summit.vicky**: runs the other agents, keeps my records, writes the 09:30 brief and checks in at 21:30.
- **dashboard@web-summit.vicky**: my dashboard and the story ideas page (07:50, 17:45).
- **pm@web-summit.vicky**: board health, alignment, and all writing: guides and write-ups (07:40, 17:40).
- **logistics@web-summit.vicky**: printing, merch and deliveries (08:10, 17:10).
- **vault@web-summit.vicky**: my vaults, only when I open its session.
- **scout@web-summit.vicky**: studies how Dinis's agents work and proposes changes for mine (22:00).

**The newsroom desks, for PrompTugal.news**

- **researcher@web-summit.vicky**: reads public sources on the summit, Portugal, Europe and announcements, one capture per source (07:30, 11:30, 15:30, 19:30).
- **curator@PrompTugal.vicky**: turns the research into storylines, each with its angle and sources, and finds connections between startups, backers and stages (15 minutes after each research run).
- **programme@PrompTugal.vicky**: keeps the public agenda to 12 November (08:15).
- **Five journalists @PrompTugal.vicky**: the summit, Portugal, Europe, AI, and connections; each drafts the storylines on its beat (08:00, 12:00 and 20:00, six minutes apart).
- **reviewer@PrompTugal.vicky**: checks every draft against its sources and the style guide; publishes Ready drafts when I ask (09:00, 13:00, 21:00).
- **checker@PrompTugal.vicky**: fact-checks the articles Dinis's agents write and sends its findings to their authors (09:48, 17:48).
- **dev@PrompTugal.vicky**: changes to the newsroom site, when I ask.
- **designer@PrompTugal.vicky**: drew the logo brief and eight options; paused since Dinis's designer took the brand.

## How a story reaches the page

1. **Find.** The researcher captures each public source, with the date it was read.
2. **Shape.** The curator maps new captures into storylines on the candidates page.
3. **Write.** A journalist drafts each storyline on its beat, reading every source the same day.
4. **Check.** The reviewer checks the draft against each source and the style guide: Ready, or Fix first with the exact fixes.
5. **Go live.** Only Ready drafts are published, at my word. My reviewer publishes when I ask; Dinis approved this on 6 November. Dinis's journalist also publishes Ready drafts.

## What's live

- **13 articles from my desks** on [PrompTugal.news](https://promptugal.news/): 8 published just after midnight on 6 November, 4 at 11:07 and 1 at 17:29.
- **How we publish**: the publish workflow as a page on the site, [promptugal.news/how-we-publish/](https://promptugal.news/how-we-publish/), built by my dev agent from the checker's draft. It is still a draft for both sides to comment on.
- **Clickable sources on every article**: source links on every article now open with one click (my dev agent, 6 November).
- **The story ideas page** on this site: [every storyline with its sources](https://web-summit.sgit.ai/people/vicky/stories/).
- **The public agenda** to 12 November, kept by the programme desk.

## The rules and files I've set up

- **STYLE.md** (the newsroom's `desks/journalist-vicky/STYLE.md`): how my journalists write. It wins over anything I said in chat before it, and every journalist re-reads it before a draft. Sources are written as `[Publisher, "Title"](url)`.
- **decisions.md** (`people/vicky/decisions.md`): every agent reads it at the start of each run. It says when to decide alone and when to ask me (keys, vaults, publishing, sending, deleting, or a conflict with Dinis's agents), lists my standing answers, and carries my "Updates for agents" until each agent confirms them. Only my conductor edits it.
- **Prompts** (`people/vicky/prompts/`): every agent's own prompt and the rules I gave it in chat, saved word for word, so a rule survives when a session forgets. Checked for anything private: nothing found.
- **Schedule** (`people/vicky/schedule.json`): every scheduled task, checked against my account each morning.
- **A hold**: if `people/vicky/HOLD.md` exists, every agent stops and says so. Only I set or lift it, through my conductor.
- **Reports and one brief**: each run ends with a report line and a status (ok, partial, idle or blocked), with at most one question. My conductor gathers every question into one list in the 09:30 brief.

## What we learned and changed today, 6 November

- **Too many questions.** My agents were asking me things they could decide. decisions.md now says when to decide and when to ask, with standing answers for the questions that kept coming back.
- **Rules are re-read, not remembered.** From Dinis's agents: each run re-reads its rules from files. Mine now re-read decisions.md and their own prompts file at every run, and after any compaction.
- **A permission has to be on both sides.** My reviewer published with my approval, and Dinis's watcher flagged it because his side had no record. Dinis confirmed at 14:22 that I may authorise publishing.
- **Spread the runs.** All five journalists started at 08:00 and wrote in one folder. They now start six minutes apart.
- **Know the clock.** The schedule file showed two surprises: the reviewer runs at 08:48 and 16:48, and the old dev agent had no task.
- **New names and new agents.** The newsroom became PrompTugal and my desks took the name `<role>@PrompTugal.vicky`. The checker, the scout and a new dev agent joined.
- **Shorter prompts.** My conductor's scheduled prompts point at one file, so a rule changes in one place.

## What's next

- **Web Summit, 9 to 12 November**: the desks keep drafting and checking; every published article counts.
- **Usage**: from tomorrow's brief, my conductor shows what each session uses, never to stop one.
- **Hooks check**: the newsroom desks report whether Dinis's behaviour-policy hooks run in their sessions; then I decide whether to raise it with Dinis.
- **After the summit**: the proposals on hold, from the scout's notes.
