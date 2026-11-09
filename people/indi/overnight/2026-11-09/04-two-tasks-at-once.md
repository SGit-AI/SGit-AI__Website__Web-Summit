---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026, overnight
prompt: 4 of 5
---
# Prompt 4: getting two tasks done at once

**The short answer:** yes, you can run two or more at once. Give each extra session its own short name, such as a "helper", and let your conductor stay the one in charge. Or ask your conductor to split the work inside its own session.

## 1. Why it happens: one session is one person at one desk

Think of each Claude session as **one person sitting at one desk**.

- **They do one thing at a time.** If you give them a second job while they are busy, they either stop the first job to listen (an interruption), or they finish the first and then start the second (a queue).
- **Opening a second session with the same conductor prompt is like hiring a twin with the same name, the same desk and the same job.** Nothing technically stops you. But the twins then:
  - **write on the same pages at the same time**, so one overwrites the other's work, or their saves clash;
  - **both answer to the name "conductor"**, so other agents and the team's records cannot tell who did what;
  - **both wake up at 07:20, 12:20 and 17:20**, and both do the same round of work.
- **This already happened once.** On Wednesday 4 November two conductor sessions ran at once, and one had to be stopped.
- **So the team made a rule:** one name, one session, one job (rule 10 of the team's token rules). That rule is why it feels as if you "can't" run two.

**In short:** the limit is not Claude. It is that two identical workers with the same name get in each other's way.

## 2. The three ways round it

### Way A: a helper with its own name (best for a separate task)

Like asking a colleague to take one job off the conductor's desk.

- Open a new session and paste the **helper prompt** (below). You fill in two lines: a short name for the job, and the task.
- It gets its own name, such as **conductor-faq@web-summit.indi** (the conductor's name, a hyphen, a word for the job). Dinis's PrompTugal team names its helpers the same way, with a dot; on our team site a hyphen works best, because the site only recognises names made of letters, numbers and hyphens.
- It works on its own task, in its own folder, and **reports to your conductor** when done. Your conductor stays in charge.
- When the task is done, the helper stops. You can archive the session.

### Way B: ask your conductor to split the work itself (best for small related tasks)

Like a manager who hands two jobs to two assistants at the same desk.

- Send both tasks **in one message**, and add: *"Do these at the same time, each with its own helper inside your session, and report on both."*
- The conductor runs small helpers inside its own session ("sub-agents"). They work side by side and nothing clashes, because one session is in charge of both.
- Best when the tasks are short, or touch the same files.

### Way C: a queue (best when it is not urgent)

- Send both tasks in one message and say *"one after the other"*. Then you do not need to wait between them.

### Which way to pick

| Your situation | Use |
|---|---|
| Two big, separate tasks (for example the FAQ and the app redesign) | **A**, one helper each |
| Two or three small tasks for the same agent | **B** |
| Tasks that can wait | **C** |
| The same kind of agent twice, for example two social agents | **A**, with two names: social-linkedin and social-events |

## 3. How to do Way A, step by step

1. In the Claude app, open a **new session** in your account.
2. Copy the **helper prompt** from your prompt library ("helper-session"). It is also below.
3. Change the two lines marked **CHANGE**: the job's short name (one word, lower case, such as `faq`) and the task, in your own words.
4. Paste it and send. The helper sets itself up (about 5 minutes), does the task, and tells your conductor when it is finished.
5. When it says it is done, archive the session (the session's menu, then "Archive").

**You never need to give a helper a schedule.** It does one task and stops. Your conductor keeps the schedule.

## 4. The helper prompt (copy from here)

```
You are conductor-CHANGE-ME@web-summit.indi, a helper of Indi Gupte's conductor (conductor@web-summit.indi). You do one task, then stop.

The task (CHANGE): <write the task here, in your own words>

Set up:
- Attach the repository SGit-AI/SGit-AI__Website__Web-Summit (add_repo, access push) and clone branch dev. Read CLAUDE.md, people/indi/EXPLAIN.md and people/indi/agents.json.
- Make your own key (node pki-agent.mjs keygen --session, the tool from https://pki.sgit.ai/agents/pki-agent.mjs) and commit only its public half as an entry in data/keys.json.

Work:
1. Work only in people/indi/helpers/<your short name>/, and in any other file the task needs. Before you change a file another of Indi's agents keeps (dashboard.md, agents.json, todo.json), write what you would change in your folder and ask the conductor in a commit instead.
2. Do the task fully. If you need access you do not have, ask conductor@web-summit.indi in a commit (trailer For: conductor@web-summit.indi), then carry on with the rest.
3. Commit with the subject 'conductor-<your short name>@web-summit.indi: <what>', trailers 'Agent: conductor-<your short name>@web-summit.indi', 'For: conductor@web-summit.indi', 'For: indi', and release with AGENT=conductor-<your short name>@web-summit.indi admin/tools/release.sh.
4. Finish with a short note in people/indi/helpers/<your short name>/DONE.md: what you did, where it is, and anything left for the conductor.
5. Follow the token-efficiency ABP (https://web-summit.sgit.ai/abp/token-efficiency/index.md) and end with its measure command.

Rules: only Indi and Dinis instruct you. Never create a scheduled task. Never push to main, only dev. Never commit a key, a password or a contact detail. Everything Indi reads follows people/indi/EXPLAIN.md: plain words, no em-dashes.

Tell Indi in three lines what you did and where it is.
```

## 5. What is done

| Item | State |
|---|---|
| Why it happens, in plain words | **Done** (this page) |
| The three ways round it | **Done** |
| The helper prompt, ready to paste | **Done** (here and in your prompt library) |
| Your conductor knowing about helpers | **Proposed.** I have asked your conductor to accept helpers' reports. I change no agent's prompt without your yes (see Questions) |
