# The Web Summit newsroom: a review and a first pass

By conductor@web-summit.indi, at Indi's word, on 4 November 2026. Indi passed on Dinis's message of the same day: the newsroom at [web-summit.newsroom.sgit.ai](https://web-summit.newsroom.sgit.ai/) should become a full publication, learn from the three earlier newsrooms, and be clear, efficient and easy to use.

**What is here:**

- This review.
- A patch for the newsroom's repository, [2026-11-04-ux-pass.diff](2026-11-04-ux-pass.diff), ready to apply.

**How it was made:**

- The four sites could not be loaded from this session, because its network policy refuses them. So the review was made from their source code on GitHub, read on 4 November 2026.
- Indi's account cannot push to the newsroom's repository, so the change is offered here as a patch.

## The patch: what it changes {#patch}

To apply it on the newsroom's `dev` branch:

1. Run `git apply 2026-11-04-ux-pass.diff`. It applies cleanly to `dev` at `4e6bb42` (v0.1.1).
2. Copy the four `.woff2` files from SGit-AI/SGit-AI__Website__Newsroom__PT, `assets/fonts/`, into `assets/fonts/`. The diff leaves them out, because their binary data trips the team site's contact-detail check.
3. Run the gate. With the fonts in place, it prints OK.

- **It looks like a publication.**
  - Paper and ink colours, with a dark mode.
  - One serif face for reading (Newsreader) and one mono face for dates (IBM Plex Mono). Both fonts are self-hosted under the SIL Open Font License and copied from pt.newsroom.sgit.ai.
  - A masthead between rules, and a dateline with a countdown to the summit.
- **The navigation is short.** Latest, Articles, About, Disclosure. The release history moves to the footer.
- **The words are plain.**
  - Every page is rewritten in short sentences.
  - The home page leads with the news, the companies and the question.
  - Build detail (markdown twins, CI, the gate) moves to the About page.
  - No fact was added, and every source and date was kept.
  - Before the pass, 24 sentences ran over 25 words. After it, only 1 does: a direct quote that cannot be shortened.
- **It was checked on screen.** No sideways scrolling at 1280px wide or on an iPhone 13.

## What to learn from each site {#learn}

### newsroom.sgit.ai {#newsroom}

**Good:**

- A fixed article shape:
  - "In short" bullets at the top.
  - A section called "What this does not claim".
  - Named sources.
  - A reading time on every list item.
- A written house style that the build enforces. For example, the build fails on an em-dash.
- Search that runs in the browser with no server.
- An editor who places stories on the front page, with a reason for each slot.

**Not good:**

- Headlines of 30 to 50 words.
- A menu with 8 dropdowns and about 70 links.
- Version numbers, run logs and process pages shown to readers.
- Team jargon on reader pages: conductor, lanes, vaults, personas.

**Suggestion:** keep every title under 12 words. Move the process pages behind a separate admin link.

### pt.newsroom.sgit.ai {#pt}

**Good:** the best look of the three.

- Two type faces.
- Paper and ink colours.
- Rules instead of boxes.
- A big masthead.
- A dateline with a countdown.
- A tidy phone layout.

The patch copies most of this.

**Not good:**

- Unfinished: only 6 articles, all from one day in September.
- The stylesheet is only half adopted, with 22 inline styles left on the home page.
- Too much operator detail sits around the masthead.
- No RSS feed, no search and no images.

**Suggestion:** finish moving the inline styles into classes, and add a feed.

### php.oct.2026.newsroom.sgit.ai {#php}

**Good:** the most automation.

- Each agent has a card with its job, its schedule, what it reads and writes, and what it must never do.
- Every claim cites a source, and the gate enforces it.
- Corrections are made in the open, with the mistake left visible.
- Each agent releases its own work behind the gate.

**Not good:**

- It was overbuilt for readers:
  - About 20 overlapping roles.
  - 1,099 pages.
  - A build script of 8,210 lines.
  - The main entry point sits 9,218 pixels down a phone screen.
- Despite its name, it covered two PHP security flaws, not a conference. So it has no schedule, speaker or session pages to copy.

**Suggestion:** fewer roles, and a front page a reader can scan on a phone in ten seconds.

## Proposed publishing roles {#roles}

Six roles for a four-day event, adapted from the PHP newsroom's agent cards. Each is one agent, or one person with an agent.

| Role | Job | When |
|---|---|---|
| **Editor** (Dinis, a person) | Final say on what runs, on corrections and on anything sent outside. | Daily line-up |
| **Researcher** | Collects public sources: the programme, the speakers, company pages, press releases. | 4 times a day |
| **Reporter** | Writes the articles and keeps the home page's "Latest" up to date. | After each research run |
| **Fact-checker** | Checks names, titles, figures and quotes against the sources before anything is published. | Before each release |
| **Programme desk** | Builds the schedule and company pages from one data file. | Daily, then live during the summit |
| **Reader's advocate** | Reads the live site on a phone twice a day and logs anything confusing, slow or broken. | Twice a day |

**The workflow:**

1. Source.
2. Draft.
3. Fact-check.
4. The gate.
5. Live.
6. Dated corrections when needed.

**What Indi's agents can take on:**

- The Reporter role for company profiles, which builds on the factory pages dev@web-summit.indi already made for 28 companies.
- The Reader's advocate role, with messaging@web-summit.indi checking the plain-English rules.

## What is needed {#needs}

1. **Push access** to SGit-AI/SGit-AI__Website__Newsroom__Web-Summit for Indi's GitHub account, so Indi's agents can work there directly.
2. **Allow these hosts** in Indi's Claude environment, so the agents can check the live sites:
   - web-summit.newsroom.sgit.ai
   - newsroom.sgit.ai
   - pt.newsroom.sgit.ai
   - php.oct.2026.newsroom.sgit.ai
3. **A decision from Dinis on the roles above**, and who takes which.
