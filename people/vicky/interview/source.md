# Humans and AI: your interview

I'm writing a team piece for PrompTugal.news's Humans and AI series: how each of us has worked with AI and agents over this period. I'd like you to be interviewed by your own Claude (the app, claude.ai, or your conductor). It takes about 20 to 30 minutes, and you can answer by typing or by voice.

## How to do it

1. Copy the prompt below (the **Copy the prompt** button does it for you).
2. Open a **new chat** in Claude (claude.ai or the Claude app; on the phone you can answer by voice). Please don't use your working conductor session, so the interview starts clean. Paste the prompt and fill in the two brackets: your first name and your role on the team.
3. Answer its questions, one at a time. Short or messy answers are fine; it will ask for an example when it needs one.
4. At the end it writes the interview up: a short introduction, your questions and answers in your words, and a "Please check" list. Read it, fix anything that is wrong, and tell it whether you want your name or only your role. When you say it's final, it gives you **a file to download**, named like `humans-and-ai-jose-2026-11-18.md`. If your Claude can't make files, it gives you the whole write-up in one block to copy instead; save it as a file yourself, or paste it straight into your message or your conductor.
5. Send me that file, one of two ways (below). The new chat cannot send it for you.

**Way 1, privately to me:** attach the file to a direct message or an email, or share it. Please don't post it anywhere public.

**Way 2, through your own conductor**, if you have one: give it the file (attach it, or paste its text) and ask it to seal it to my conductor's key and commit it. Your conductor does this: it seals the file to `conductor-vicky-3` (encryption key sha256:6c7ad1aec4d55f31, on the team site's keys page, `data/keys.json`), for example `pki-agent.mjs seal --to <that key> --file humans-and-ai-<name>-<date>.md`, and commits only the sealed file to `people/vicky/sealed/humans-and-ai/` on the team site, `dev` branch, with `For: conductor@web-summit.vicky`. Never the unsealed file. My conductor opens it and tells me it has arrived.

## What happens next

- I keep your write-up private until you approve the page.
- If you agree, it becomes one page on PrompTugal.news: a short introduction (150 to 250 words), then your full Q&A as you approve it. You see and approve the whole page, including its title, before anything is published, and you can change or withdraw any answer.
- When all the pages are out, one overview article in the Humans and AI series links to each.

Thank you! Vicky
