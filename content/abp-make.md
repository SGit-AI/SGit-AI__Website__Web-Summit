---
title: Make your ABP
summary: At the RiskMandate stand, make an Agent Behaviour Policy for one of your AI agents in about two minutes. Ten questions, each with a suggested answer from the X-ray; the policy builds as you go. Nothing you type is stored or sent.
script: abp-make
---
Make an Agent Behaviour Policy (ABP) for one of your AI agents: ten short questions, each with a suggested answer. The draft builds as you go.

This page needs JavaScript: the questions and the draft are drawn here, in your browser. Nothing you type is stored or sent.

## The ten questions {#questions}

1. Which agent is it, and whose?
2. What is it for, in one sentence?
3. What can it reach today?
4. What must it never do?
5. What needs a person's yes?
6. Who may tell it what to do?
7. What may it read but never act on?
8. What does it do when it is unsure?
9. How often does it run, and how many tokens may it use each time?
10. What shows it behaved?

The questions are the ABP maker's ([ABP creation](../abp-creation/index.html)). Start from a company's [X-ray](../xray/index.html) to have the answers suggested from it.

## For the team at the stand {#team}

- **The flow.** X-ray the visitor's company, then press "Make an ABP for one of these agents" and pick an agent. Ten taps make a draft. Print it, save it as a PDF or copy it as Markdown, then press Start again for the next visitor.
- **A company we have not X-rayed.** On the X-ray page, type the name and press "X-ray it live with Claude": claude.ai opens in a new tab with a short X-ray prompt and searches the web. Then press "Make their ABP" (or open `?company=<name>`), open "Paste Claude's X-ray" at the top, paste Claude's whole answer and press "Fill the answers". It reads the ten numbered answers after "ABP ANSWERS"; if it cannot, the safe defaults stay and it says so.
- **Three designs.** Add `?design=a` (Interview, the default), `?design=b` (Builder) or `?design=c` (Story) to the address.
- **No network, no key.** The draft is made in the browser from a template, so it works with no model and no API key. The only data read is this site's own X-ray record.
- **Refine with Claude** opens claude.ai in a new tab with the maker's prompt and the visitor's answers in the address, so a Claude session carries on the interview. claude.ai cannot be shown inside this page (it does not allow framing), so it is a link. It needs a signed-in claude.ai on the stand's laptop, and it is the only button that sends anything anywhere.
- **Simple on screen.** Each part of the ABP is a subtitle with one short line; tap it for the detail. The part the current question fills opens by itself. Suggested answers are short; the X-ray's full text is one tap away under the answer. Printing opens every part.
- **Privacy.** Nothing is kept in the browser's storage. Start again wipes the answers; so does coming back to the page with the Back button.

Made by conductor@web-summit.indi for the RiskMandate stand at Web Summit Lisbon, 12 November 2026 (WS-34), from the ABP maker's questions (people/indi/prompts/abp-maker.md) and Silvio's X-ray records (data/xray/).
