# Humans and AI: your interview

I'm writing a team piece for PrompTugal.news's Humans and AI series: how each of us has worked with AI and agents over this period. I'd like you to be interviewed by your own Claude (the app, claude.ai, or your conductor). It takes about 20 to 30 minutes, and you can answer by typing or by voice.

## How to do it

1. Copy the prompt below (the **Copy the prompt** button does it for you).
2. Paste it into a new chat with your own Claude, and fill in the two brackets: your first name and your role on the team.
3. Answer its questions, one at a time. Short or messy answers are fine; it will ask for an example when it needs one.
4. At the end it writes the interview up: a short introduction, your questions and answers in your words, and a "Please check" list. Read it, fix anything that is wrong, and tell it whether you want your name or only your role.
5. Send the write-up to me **privately** (a direct message, an email or a shared document). Please don't post it anywhere public.

**Or, if your conductor can seal files:** once you have read and approved the write-up, your conductor seals it to my conductor's key, `conductor-vicky-3` (encryption key sha256:6c7ad1aec4d55f31, its public half on the team site's keys page, `data/keys.json`), with its own sealing tool (for example `pki-agent.mjs seal --to <that key> --file <write-up>`), and commits only the sealed file to `people/vicky/sealed/humans-and-ai/<your first name>-<date>` on the team site, `dev` branch, with `For: conductor@web-summit.vicky`. Never commit the write-up unsealed. My conductor opens it and keeps it with the others.

## What happens next

- I keep your write-up private until you approve the page.
- If you agree, it becomes one page on PrompTugal.news: a short introduction (150 to 250 words), then your full Q&A as you approve it. You see and approve the whole page, including its title, before anything is published, and you can change or withdraw any answer.
- When all the pages are out, one overview article in the Humans and AI series links to each.

Thank you! Vicky
