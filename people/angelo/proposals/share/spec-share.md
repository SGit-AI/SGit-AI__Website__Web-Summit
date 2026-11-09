---
title: "A share button on every page and entity of PrompTugal.news"
by: dev.venues@PrompTugal.angelo
written: 2026-11-08
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo; built on the newsroom's dev For: dev@PrompTugal.dinis
issue: WS-08 (backlog 0o)
status: "approved by Angelo, 9 November about 09:05 UTC (All as recommended): targets LinkedIn, X, WhatsApp, Email, Copy link; counts by target in the newsroom's own observability; top of every page and the end of articles"
---
Angelo, 8 November about 16:55 UTC (relayed in the desk's db8058666, pushed from riskmandate-angelo): *"Can we add a share button on all pages and entities on PN News, maybe reviewing how other digital newspapers do it?"*

## What and why

PrompTugal.news has 1,412 pages in its sitemap (read 8 November 2026): 276 people, 252 organisations, 246 events, 121 companies, 84 places, 40 articles, 18 topics, the summit's days, the stories, the venue map and the rest. Today none has a share control. Links already look right when pasted (every page has Open Graph and X card tags, an article's own image or the site's card: `newsroom/build/lib/seo.mjs`), so the missing piece is only the button. The investors' site already has a LinkedIn share link on its articles (`newsroom/build/features/investors-site.mjs`), the one precedent.

During the summit (9 to 12 November) people will want to send a company, a session or an article to a colleague, mostly from a phone, mostly over WhatsApp, LinkedIn or email. One tap should do it.

## How six digital newspapers do it

Read on 8 November 2026 from one article page each (the page's HTML and scripts), by a sub-agent of this run. **Four of the six could not be checked**: the Guardian, the New York Times and the Financial Times answered an automated reader with a bot check or a 403, Público with a 403, and no archived copy was reachable. They are left blank rather than filled from memory. Tried again on the sixteenth run (8 November, about 18:45 UTC): the Guardian now answers, but with a "Client Challenge" page (a bot check), not the paper; the New York Times, the Financial Times and Público still answer 403. Getting past a bot check is not something we do, so these four stay blank: Angelo can glance at them on his phone, and the proposal does not depend on them (the BBC and Observador agree on every point it takes).

| Paper | Page checked | Where the control sits | Targets | Tracking, third parties |
|---|---|---|---|---|
| BBC News | bbc.com/news/articles/c5x2vw4e1gx1o | top: one "Share" button in the byline, under the headline | a pop-over: Facebook, X, LinkedIn, Email, Copy ("Link copied") | the shared address is plain (no `utm_`); the click is logged in the BBC's own analytics as `article_share` with the target; no share widget from another company. No `navigator.share` seen |
| Observador | observador.pt/2026/11/08/entre-a-chuva-e-o-despacho-de-moedas-acampada-vota-se-continua-no-rossio/ | both: in the article's toolbar by the headline, and again at the end | Copy link ("Copiado"), Email, Facebook, X, LinkedIn, WhatsApp; and "Partilhe no seu telemóvel", the phone's own sheet (`navigator.share`), shown only where the browser has it | plain addresses, links written into the page (no share widget); the page loads the Facebook Pixel for advertising, separate from sharing. Beside Share: "Oferecer artigo" (gift), save, comments, audio |
| The Guardian | an article of 8 November | could not check | | |
| The New York Times | an article of 7 November | could not check | | |
| Financial Times | an article of 8 November | could not check | | |
| Público | the front page | could not check | | |

**What the two show, and what we take from it:**
- One Share control by the headline is the main way in; Observador repeats it at the end of the article. We do both on articles.
- The same core targets: Copy link, Email, X, LinkedIn, Facebook; the Portuguese paper adds WhatsApp. We keep WhatsApp and leave out Facebook (decision 1).
- Neither uses a third-party share widget: both write plain share links into the page. Neither adds tracking parameters to the shared address. We do the same.
- The phone's own share sheet as an extra where the browser has it, with the list as the fallback (Observador). We make it the main control on phones.
- Both count share clicks in their own analytics (the BBC by target). That is decision 2 below; we would never add an advertising pixel.

**Where the phone's share sheet works** (MDN's browser data, read 8 November 2026): iPhone Safari and Chrome on Android, and on desktop Safari, Chrome 128+ and Edge; not Firefox on desktop. So desktop readers mostly get the list, which needs no script except for Copy link.

## The proposal

**One control, in the page shell, so every page has it.** `newsroom/build/lib/shell.mjs` draws every page's head (crumbs, title, summary); the share row goes there, under the summary, beside "Save for offline" where an article has it. Articles also get it again at the end ("Share this article"), as Observador does.

**On a phone: one Share button that opens the phone's own share sheet** (the Web Share API, `navigator.share`, with the page's title, summary and canonical address). The reader then picks WhatsApp, LinkedIn, Messages, AirDrop, Signal, whatever they have: we need not guess which apps they use.

**Where the browser has no share sheet** (most desktop browsers, Firefox on Android): plain links, drawn at build time, no script needed:
- LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=<address>`
- X: `https://twitter.com/intent/tweet?url=<address>&text=<title>` (the address the BBC and Observador use; it opens X)
- WhatsApp: `https://wa.me/?text=<title> <address>`
- Email: `mailto:?subject=<title>&body=<summary> <address>`
- Copy link: the one button that needs a script (the clipboard), with "Copied" said aloud to screen readers.

On a wide screen the links show in a row ("Share LinkedIn X WhatsApp Email Copy link"); on a narrow one, behind the one Share button (the sheet if the browser has one, else this list).

**What is shared:** the page's canonical address (`https://promptugal.news/...`), exactly as in its `<link rel="canonical">`, with **no tracking parameters** (no `utm_*`): the address someone receives is the address of the page, clean and permanent. The title and the summary are the page's own.

**What it never does:** no third-party script, no share counts, no tracking pixel, no icon or font loaded from another site (the icons are inline SVG), no cookie, nothing sent anywhere when the page loads. Nothing leaves the reader's browser until they tap a link, and then only to the site they chose. This is in line with the newsroom's observability rules (no IP, no cookie, no fingerprint: `assets/obs/obs.js`).

**Which pages:** every public page: articles, companies, organisations, people, events, places, topics, stories, the summit's days, the venue map, the front page and the sections. Not on: the sign-in page, the 404, account and profile pages, pages marked `noindex` (they are not meant to be passed around), or the investors' site, which keeps its own.

**Its words** in `data/site/site.json` (the shell's words already live there), so the newsroom can change them without touching code; the markdown twins get no share row (they are for agents).

## Mock-ups

Drawn on the live pages of 8 November 2026 with the row injected (`mockup.cjs` in this folder makes them again):

- Desktop, an article, light: [mockup-desktop.png](mockup-desktop.png)
- Desktop, a company page (AICEP), dark: [mockup-entity.png](mockup-entity.png)
- Phone, an article, dark: one Share button, which opens the phone's own sheet: [mockup-phone.png](mockup-phone.png)
- Phone, a browser without a share sheet: the same button opens the list: [mockup-phone-fallback.png](mockup-phone-fallback.png)

The look follows the existing "Save for offline" button (outlined pill); the one filled button is Share on a phone. designer@PrompTugal.dinis may restyle it within the brand.

## Decisions for Angelo

1. **The targets** in the fallback list: LinkedIn, X, WhatsApp, Email, Copy link (recommended: the summit's business crowd uses LinkedIn and WhatsApp). Add Facebook, as the BBC and Observador do? Recommendation: not now; the phone's sheet covers every other app, and it can be added in one line later.
2. **Counting shares.** The newsroom already counts page views in its own sealed vault (obs.js, no IP, no cookie, off under Do Not Track and Global Privacy Control). Option A: count nothing. Option B: one "share" event with the page and the target chosen (for example "whatsapp"), nothing else, through that same first-party channel, so we learn which pages travel. Recommendation: **B**, as the BBC and Observador count shares too, and this adds no third party and no identifier; it needs observability@PrompTugal.dinis's agreement, and it would be a separate small change after the button.
3. **Placement:** top of every page and the end of articles (recommended), or top only.

## Out of scope

- Posting anything for anyone: the button only opens the reader's own app or mail.
- "Gift" links or paywall sharing: PrompTugal.news has no paywall.
- Share images made per page (an article's own `image:` already becomes its card; making cards for companies or people is the designers' and a later spec).
- The investors' site's share link, which stays as it is.

## The data, and who may see it

| What | Where | Who sees it |
|---|---|---|
| The page's title, summary and canonical address | already public on the page | the reader, and whoever they send it to |
| The reader's choice of app | only in the reader's browser; with decision 2B, a count of "share, target" per page in the newsroom's sealed observability vault | counts only, in /newsroom/observability/ |

No personal data, no contact detail, nothing new about any person: a person's page shares only its public address and summary.

## The changes, by owner

All on the newsroom's `dev` (PrompTugal/PrompTugal__News__Website), by dev.venues@PrompTugal.angelo, under the five steps, its own CLAUDE.md and its gate, each commit For: dev@PrompTugal.dinis (decision 2 of spec-new-agents.md, "Happy with B"):

1. `newsroom/build/features/share.mjs`, a feature in the newsroom's feature contract: the row's HTML for a page (links built at build time from the canonical address), its words from `data/site/site.json`, and which page types get it. The shell (`newsroom/build/lib/shell.mjs`) gets one mount line in the page head; a small change to a shared file, checked against its last two hours first.
2. `assets/share/share.js` (under 2 KB, no dependency): the Share button (`navigator.share` when present, else it opens the list) and Copy link (`navigator.clipboard`, with a fallback to selecting the address). Without JavaScript the plain links still work.
3. `assets/share/share.css`, after the tokens in `assets/tokens.css`, light and dark.
4. A gate check in `share.mjs`: every public page has the row; every share link is one of the four hosts or `mailto:`; the address in each is the page's canonical one with no `utm_`; no page loads a share script from another site.
5. Browser tests at 1280 and 390 px, light and dark: the row is there, Copy link copies, the share sheet is called with the right title and address (stubbed), the list opens where it is missing.
6. With decision 2B, later and separately: one `share` event in `assets/obs/obs.js`, For: observability@PrompTugal.dinis.

## Risks

- **Clashing with other agents in the shell.** `shell.mjs` is shared: one line, pulled just before the edit, its last two hours checked; on a conflict, theirs is kept and mine goes as a draft.
- **X's and LinkedIn's share addresses change** from time to time. The gate checks the shape; dev.links@PrompTugal.angelo's crawl will report one that stops working.
- **Clutter.** Five buttons on 1,400 pages. On a phone it is one button; on desktop one quiet row.
- **WhatsApp's `wa.me` on desktop** opens WhatsApp Web or asks to install the app: acceptable, and the sheet replaces it on phones.

## How we will know it works

- Every public page has the row (the gate says so), and none loads anything from another site for it.
- On an iPhone and an Android phone, Share opens the phone's sheet with the page's title and address; on a desktop browser the links and Copy link work.
- The browser tests pass at both widths and both themes.
- With decision 2B: the observability report shows shares per page and per target from the first summit day.
