# Promptugal News: the design brief

By designer@web-summit.vicky, Vicky Wang's designer, 5 November 2026 (WS-14). From the stand-up of 5 November. A draft for Vicky and Dinis Cruz to correct before any logo is drawn.

## What it is

**Promptugal News** is the new name of the Web Summit newsroom: a serious publication about tech and AI in Portugal and Europe. The name is two words in one: **prompt**, what you give a model, and **Portugal**, where we report from. *Prompt* takes the place of *Por* in *Portugal*; the tail, *tugal*, is shared.

It starts at Web Summit Lisbon (9 to 12 November 2026) and is meant to outlive it. It is its own publication, not a side project of any product. Its domain, promptugal.news, is not live yet; today the newsroom is served at web-summit.newsroom.sgit.ai, under the name PromptUGAL (set by Dinis on 5 November, in `data/site/site.json`).

## Who it is for

People who already know AI and startups: founders, engineers, investors, the people building and buying the tools, and the journalists who cover them. Most read on a phone, many of them at the venue.

Dinis, at the stand-up: *"If you don't get the prompt joke, you're not the reader."* So we never explain the name. The joke is a password, not a punchline.

## The tone

- **A newspaper, not a startup.** The site already looks like one: paper and ink, a nameplate between rules, every fact sourced and dated. The name is playful; everything around it stays sober. The wit is in the name, so the design does not need to wink as well.
- **Precise.** Short sentences, dates in mono, sources under every claim.
- **From Portugal, for Europe.** Lisbon's azulejo cobalt is already the site's one colour; no flags, no rooster, no tram, no postcard.
- **Independent.** Nothing that could be read as Web Summit's own (their magenta, teal and purple, their geometric sans) or as RiskMandate's (its green, its round seal). The site keeps "Powered by RiskMandate" as a separate line beside the name, never inside the logo.

## What the logo has to do

1. **Make both words readable at once.** A reader should see *prompt* and *Portugal* in the same glance. How the capitals fall decides which word leads, so the options will try different splits: PrompTugal, PromptUgal, PROMPTugal, Promptugal and others.
2. **Read as a publication's nameplate.** It sits where a paper's name sits: centred between rules on the front page, one size down on inner pages.
3. **Work small.** In a phone's header (about 24 to 32px tall, inside 390px with its 16px gutters) and as a favicon or app icon (16 to 32px), where a short form or a single letter has to carry it.
4. **Work in dark mode,** and in one colour (ink on paper, paper on ink, cobalt) with no gradients or shadows, so it survives print, a slide and a badge.
5. **Use only what the site already has:** Newsreader (the serif for reading and the nameplate), IBM Plex Mono (dates, data, and the natural voice of a *prompt*), IBM Plex Sans (the interface), or letters drawn as shapes. Colours from `design/tokens.css`: paper `#f6f3ec`, ink `#121317`, cobalt `#1b4597`, and their dark-mode pairs. Every design is original; no other brand's logo, face or mark.
6. **Live with the tile.** The site's azulejo tile mark (`assets/brand/mark.svg`) stays unless Dinis says otherwise; a logo may sit beside it or bring its own small form.
7. **Be one string to adopt.** Dinis's agents do the rename on the site; each option is a single SVG they can drop in, with no font to install (text in the SVGs is drawn as paths).

## What I will hand over

Once Vicky approves this brief: 5 to 10 options in `desks/designer-vicky/logos/<option>.svg`, each with one line on its idea, all in one gallery in `desks/designer-vicky/README.md`, with each checked in a phone header and in dark mode. I do not change the site; the chosen logo is adopted by Dinis's agents.

## Open questions for Vicky and Dinis

- **The capitals.** The site says PromptUGAL today. Is that the decision, or one of the options? I will treat it as one option among several unless you say it is settled.
- **"News".** Is it part of the logo (Promptugal News) or a line under it, as the site's motto is today?
- **The tile.** Keep the azulejo tile as the small mark, or should the logo bring its own?
