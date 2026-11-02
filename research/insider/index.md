# What to learn from The Ultimate Insider sites

Research by a researcher agent for the conductor, 2 November 2026: how the Ultimate Insider book and talk sites do navigation, releases, personas, infographics, animations, project management and messaging, and the prioritised list of what to bring to web-summit.sgit.ai.

Site version: v0.1.30

Read by a researcher sub-agent of conductor@web-summit.dinis from [the book's repository](https://github.com/SGit-AI/SGit-AI__Website__Book__The-Ultimate-Insider) and [the live book site](https://the-ultimate-insider.book.sgit.ai), at the operator's request. What we are doing about it is on [the board](../../briefs/index.html#issues) (WS-77 to WS-84).


Research for web-summit.sgit.ai, 2 November 2026. Sources: the read-only clone `/home/user/sgit-ai/sgit-ai__website__book__the-ultimate-insider` (HEAD `dfa40fe`, site v0.1.307), and the live sites the-ultimate-insider.book.sgit.ai, .presentation.sgit.ai (site v0.2.1) and .cold-read.sgit.ai, fetched with curl. Below, "book" means the clone and "talk" means the presentation site. The talk's repository is not cloned here, so what this note says about the talk comes from its live pages and `llms.txt`.

There are three sites. They run one machine: the talk site was built first (29 Oct), and the book and cold-read repositories copied its build, gate, admin section and team rules "rule for rule". Everything below is therefore one tested pattern, used in three places.



## 1. Navigation and information architecture

### How pages are made
- **Python, standard library only, with no client-side rendering**: `admin/build/build.py` (1296 lines) builds the whole site into `_site/`, and `admin/build/validate.py` (228 lines) is the gate. JS is used only to enhance pages (theme, countdown, board filters, mail reader).
- **Pages are fragments**: `src/pages/**.html` start with `<!--meta {"title": ..., "description": ...} -->`, followed by the body only. `{{root}}` is replaced with the path back to the site root, and `{{version}}` is stamped at build time. `Site_Build.chrome(rel, title, description, body, kind)` wraps every fragment in the same head, top bar and footer, and adds JSON-LD, canonical, og: tags and `<link rel="alternate" type="text/markdown">`.
- **Data-driven pages**: plan, roles, decisions and milestones come from `book.json` (decisions are `{id, status, by: "editor", ask, detail}`; 59 of them). Team and admin pages are built from `team/<id>/{ROLE.md,policy.json,status.json,wakes/*.json,debriefs/}`. Briefs come from `briefs/<date>/`, the manuscript from `manuscript/Book.txt`, updates from `team/conductor/editor-briefs/*.json`, and releases and commits from `git log`.
- A `.md` twin is written next to every page by an HTML-to-text pass in the same build (the `SKIP`/`BLOCK` parser, around line 123). The twins and `llms.txt` are always regenerated, so they cannot drift.

### Top nav
`site.json` is the whole config for the top bar:
```json
{"name": "...", "short": "...", "url": "...", "repo": "...", "tagline": "...",
 "nav": [["The book","book/index.html"],["Plan","plan/index.html"],["Decisions","decisions/index.html"],
         ["Team","team/index.html"], ... ["Admin","admin/index.html"]]}
```
`chrome()` marks the current item in two ways (its "design note 2"): `aria-current="page"` when the page is the nav target itself, and `aria-current="true"` when the page is inside that section, worked out by matching the directory prefix:
```python
here = rel if rel in hrefs else next((h for h in hrefs if '/' in h and rel.startswith(h.rsplit('/',1)[0] + '/')), None)
```
On a phone, `nav.main` does not wrap. It becomes one horizontally scrollable row with fade masks (`nav.main.more-l` / `.more-r` in `src/static/assets/site.css`), so the bar is always one line high. The top bar also carries the version as a link to the release notes (`admin/versions.html#vX`), a GitHub star button, and a theme toggle (`assets/theme.js`).

### Left-hand menus (the "shell")
Two sections get a side menu, built by `shell(rel, body)` (build.py lines 284-308):
- **Admin** (`in_admin`: `admin/`, `team/`, `brief/`). `side_nav()` returns groups: *Overview*; *Activity* (Dashboard, Wakes, Mail, Commits and messages, Releases, The board, The schedule); *Team* (Everyone, The roles, then one link per member, read from `team/*/policy.json`); *Keys and vaults*; *Sources of truth* (briefs, REALITY, CLAUDE.md, corrections, onboarding, wake protocol). Items appear only when their source file exists, for example `('team/schedule.html', ...) if (ROOT/'team/conductor/schedule.json').exists()`.
- **Studio** on the talk site (`studio_nav()`): The studio / programme / how it works / techniques; Briefs; The lab (every animation version).

The markup is
`<div class="shell"><aside class="side"><details open><summary>Admin menu</summary><p class="sg">GROUP</p><ul><li><a aria-current="page">…` followed by `<div class="shell-main">`.
The CSS is `.shell{display:grid;grid-template-columns:250px minmax(0,1fr)}` with small-caps group labels (`.side .sg`). On wide screens `<summary>` is hidden. On narrow screens the same `<details>` becomes a collapsible "Admin menu", so the side menu needs no JS. Member sub-pages highlight their member: `here()` matches `team/<id>/` as a prefix.

### Breadcrumbs
These are written by hand per generator: `<nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a> / <a href="index.html">The brief</a></nav>`. Each is followed by a **kicker** line that names the section and the source file, for example `<p class="kicker">The brief · 2026-10-30 · <code>briefs/2026-10-30/README.md</code></p>`. The pattern is crumb, kicker, h1, lead. Our generated breadcrumbs (`build.mjs` line 114) are already more systematic. The part worth copying is the kicker that names the source.

### How a release avoids rewriting many files
This is the biggest structural difference from our repository. In the book repository, **nothing generated is committed.** `_site/` is git-ignored. `.github/workflows/release.yml` builds with `--version pending` and gates on every push. Then, on `dev`/`main`, a single serialized job (`concurrency: release`) reads the newest tag, writes `./version`, commits `site vX.Y.Z: <pushed subject>` as GitHub Actions, tags it, rebuilds that commit, gates again, checks `_site/version.txt`, uploads `_site` with `actions/upload-pages-artifact`, deploys, and polls the live `version.txt` for up to 5 minutes. A guard fails the run if anyone except "GitHub Actions" edits `./version`. Agents never put a number in a subject.

So a release is a **one-line commit** (`version`). In ours, HEAD's release touched **349 files** because every committed page carries the version stamp. This also removes the "many committers rebase on generated files" pain that our `admin/tools/release.sh` works around.



## 2. Visual language: personas, cast, infographics, animations

### Design tokens (one file)
`src/static/assets/tokens.css` (2.4 KB) holds:
- Width rules: `--gutter: clamp(16px,3vw,48px)`, `--measure: 68ch`, `--wide-max: 1240px`, `--card-min`, `--thumb-min`.
- An eight-step type scale (`--t-xs` to `--t-0`, plus `--t-lead` and `--t-figure` for big numbers).
- Light and dark palettes (`prefers-color-scheme` plus a `[data-theme]` override). There are **three colours of meaning** (`--agent` red, `--infra` amber, `--risk` violet) and one accent (teal), each with a 10-15% tint (`--agent-t`, etc.).

The gate enforces the type scale: `check_type_scale` fails any `site.css` size that is not a token.

### The cast (the "little personas" drawn as characters)
These live in `lab/characters/`, as SVGs made by code:
- `make_cast.py` draws the talk's nine agents from **one construction** (the cast row's robot). Each agent gets one colour, one thing on its head and one in its hand, taken from its job. There are **four moods per agent** (happy, worried, stressed, unhappy), shown by the face. The conductor's face is a clock, and the clock hands are its expression. That gives 36 files, `cast/<member>-<mood>.svg`, each 20 x 25 mm with no text inside. `on_stage()` draws an "on stage now" marker.
- `make_conductor.py` makes the poses `conductor-calm` (hands at ten past ten), `-pointing` (twelve) and `-alarmed` (half past six, "at ninety-five").
- `security.svg` is a round robot with a magnifying glass. `the-hold.svg` is a stop sign with arms up, and it is the only character filled in the accent colour.
- Rules from `lab/characters/README.md`: agents and mechanisms only, with no real person drawn (the editor only "at his own word"). One fixed size in the margin. **One line each**: a speech bubble of at most 90 characters, written by the storyteller, never by the designer. Each character must be recognisable in greyscale by its silhouette (square, round, octagon). A character never carries a number.
- Experiment sheets: `lab/experiments/27-designer-the-cast/` (`sheet-cast.svg`, `sheet-moods.svg`, `sheet-scorecards.svg`, `on-stage-HHMM.svg` for who is "on stage" at each hour), `25-ruv-the-cast-strips/` and `04-ruv-meet-the-team-frames/`.

### The personas (synthetic readers)
`src/pages/personas/*.html` holds 17 fictional readers (CISO, CTO, founder, Gen Z founder, journalist, board member, plus later ones such as "event-team-member" and "newsroom-builder"), kept by `synthetic@`. Each page has: who they are; what they judge, their device, the time they give, their voice, what impresses them and what loses them; their one-sentence summary of the book; would they buy; and 1-5 scores (answer, clarity, trust, pace, buy). Every page carries a dashed-border **"SYNTHETIC READERS"** disclaimer. The index has a table across all of them, plus "where they get stuck". Linked to this are `src/pages/review/<persona>.html`: per-reader **reading paths** ("For a security leader: chapters 3, 6 and 9 ... Short of time? Read chapter 4 first"), generated by `review/tools/make_review.py` from `review/personas/<id>.json`.

### Animations (the talk site's slide engine)
The engine is `talk/engine/slide.js` (9 KB) plus `slide.css` (2 KB), Apache-2.0, fetched to the scratchpad from the live talk site. It is **one virtual clock per slide, with declarative reveals**, so a slide is mostly markup:
```
<div id="cv" data-end="40">                       length in seconds
data-in="1.5" data-out="6"                         fade/rise in and out
data-on="2 5"                                      class "on" in a window
data-count="82" data-at="2" data-dur="1.6"         count-up (data-pre, data-suf, data-dec)
data-grow="0.05" data-at="2"                       bar grows
data-draw="1 2.5"                                  SVG stroke draws itself
window.SLIDE_RENDER = function (t, S) {...}        anything data-driven, every frame
?t=4.5 freezes · ?static shows the end · reduced motion shows the end · ?theme=light
window.RUV_STEPS = [{t:0,label:'...'}]             named stops for the player
```
Each piece is drawn on a 1280 x 720 canvas, scaled to fit, and embedded in pages with `<div class="ev-frame"><iframe src=".../v1/index.html">` (16:9). Example: **M03 "Meet the team"** (`motion/lab/meet-the-team/v1/`, 7.5 KB). It shows the nine agents on an hour dial at the minute each wakes, the editor at the centre, a hand sweeping the hour while each member lights up, then counts (commits, releases, wakes, holds) read at load from `team-in-numbers.json`, and finally "the capability is the orchestration, not the model". **This maps directly onto our team and schedule.**

Other pieces (E01-E14 in the talk's `llms.txt`) each come with an `explainer` page: every frame with its time, the source behind every word, the technique, and what was left out.

The **lab overview** (`studio/lab.html`) shows every animation version as three frozen iframes at `?t=<begin>`, `?t=<middle>` and `?static`, labelled "latest", with "play it" and "full width, replay and scrub" links. The version ladder (`studio/how-it-works`) is: **Static** (SVG end state) → **Built** (data-in/draw/count) → **Driven** (from a data file, so a corrected number corrects the slide) → **Rich** (canvas/WebGL only when motion carries meaning). The checklist that goes with it: one idea; every number from a data file; "illustrative" labelled; at most three meaning colours; `?static` and reduced motion still make the point; both themes; no scripts from another host.

### Infographics (static, generated)
- `team/conductor/rc1/infographics/`: 30 SVGs (+ JPG at 2x) with a `manifest.json` (where each goes, using an anchor sentence) and `callouts.json` (50 call-outs typed CONCEPT / THE NUMBER / TAKE AWAY / WATCH OUT / TRY THIS). Several describe **the same machinery we run**: `ig14-five-step-wake.svg`, `ig15-wake-verdicts.svg`, `ig12-key-per-session.svg`, `ig36-ci-owns-version.svg`, `ig37-comms-in-git.svg`, `ig38-setup-order.svg`, `ig05-nine-staffed-agents.svg`, `ig11-commits-by-member.svg`, `ig01-the-day.svg`. They use the print palette (ink `#1f2933`, accent `#b0481a`), not the web tokens.
- `lab/tools/components/` draws figures from JSON: `timeline.py` (horizontal or vertical, to scale, with a marked break), `counters.py` (a row of number tiles), `mapnotes.py` (a map with side notes), `beats.py`. The README says it directly: "a figure is changed by changing its data, not redrawn".
- The admin **dashboard** (`admin/dashboard.html`, about 121 KB) has, per member, a grid of wake cells (`pc o-ok|o-partial|o-idle|o-failed`), each with five step verdict dots (`d v-go|v-clean|v-as-planned|v-done|v-finding`). There is also a pace flow graph (`flow_graph(pace)` from `team/conductor/pace.json`, with columns Briefs → Themes → Ideas → Requests → Artifacts → Reviews → Decisions).

### Small reusable components in `src/static/assets/`
- `countdown.js`: `data-date` milestones.
- `board.js`: board filters.
- `mail.js`: a three-pane reader for the `.eml` mail.
- `commits.js`, `dashboard.js`.
- `theme.js`: light/dark choice, and it registers the offline cache.
- `sw.js` + `sw.json`: a network-first offline cache with a kill switch (`enabled:false`) and `?nosw`.



## 3. Project management and agent structure

- **Roles** (book): conductor, librarian, historian, security, researcher, storyteller, publisher, designer, developer, ruv-sgit (visual experiments), synthetic (fake readers). The talk had conductor, deck, designer, dev, motion, researcher, ruv.sgit, security, storyteller, studio. Addresses are `<role>@book.the-ultimate-insider`. A human is the **editor** and decides only by signing a decision in `book.json`.
- **Per-role folder** `team/<id>/`: `ROLE.md`, `policy.json` (schema `the-ultimate-insider/agent-policy/v1`: mandate wanted/not_wanted capabilities, `scope.writes` globs, `holds`, `appends`, `pages`, `never` list), `status.json` (`state` as one rich sentence, `done[]`), `key.json`+`key.png`, `sessions/`, `wakes/`, `debriefs/`. `admin/build/agents.py overlaps` fails if two policies claim one path.
- **Schedule** (`team/conductor/schedule.json`): each member owns its own scheduled task in its own session (the session ids are listed). Members are staggered by minute **in the order work flows**: conductor :02 routes, librarian :09 indexes, historian :17, security :24, researcher :32, storyteller :39, publisher :47. The file records a `why_this_order`, plus active and idle crons (every 2 h, or 09:MM and 17:MM when idle). Every run's prompt is word for word the same template.
- **Wakes** (`team/conductor/WAKE.md`): five steps. A conductor sub-agent plans, a security sub-agent pre-reviews, the member works (`wake.py gate`), security post-reviews the diff, and the conductor post-checks. Each step records `{by, model, verdict, comment, at}` in `team/<id>/wakes/<stamp>.json` (schema `wake/v1`, `outcome`), and the gate checks every closed wake has all five. A start banner and an end banner come from `admin/tools/start.py`/`banner.py`. Any member can stop the team with `team/<id>/HOLD.md`, and only the editor lifts it.
- **Comms in git** (`comms/README.md`):
  - The board is `comms/issues/<you>/issues/{open,blocked,done}/NNN-slug.md` with front matter.
  - Mail is `.eml` files: `comms/mail/mailroom/<recipient>/<sender>__NNN-slug.eml` with headers `X-Kind: request|reply|update|notice` and `References`; the sender keeps a copy in `mail/<sender>/outbox/`, and the recipient moves it to `inbox/` and then `done/`.
  - There is one writer per file, letters are never edited, and `vault_check.py comms` runs before each commit.
  - Volume: 264 letters in the conductor's outbox.
- **Commits**: `@<you>: <what and why>` with the trailer `Agent: <you>@book.the-ultimate-insider` (plus Co-Authored-By / Claude-Session).
- **Updates for the human**: after every run, the conductor writes `team/conductor/editor-briefs/<stamp>.json` with `number`, `kicker`, `title`, `headline`, up to 4 `stats` tiles, `for_you` (asks with options, tick boxes and a `recommend`), `you_asked` (his quoted words, then done/where/status), `team` (who is doing what), `sections`, `images` and `next`. This is cut to HTML and PDF and published at `/updates/`. Headlines read like "Nothing needs you except the title thread" or "The night: your RC1 review, routed while you slept".
- **Labs** (`lab/`): "experiments in telling the material", each one printed, read by the editor on paper and judged *keep / change / drop*. Each experiment is a folder `lab/experiments/<nn>-<member>-<slug>/` with `experiment.json` (`id, title, tries, made_from, question, pages`), `README.md` and `pages.html`. An id ledger (`lab/tools/ids.json`, with `printed`/`reserved`/`held`) stops collisions. `build_lab.py` builds one PDF and refuses text under 9 pt or overflow. **Runs** are recorded as pairs, `lab/runs/<stamp>-<member>-<slug>.{spec,evidence}.json`: the spec holds the request with the human's words, the source path and commit, the method and the executor; the evidence holds the result. The visual rules are in `lab/README.md` (grid, palette with greyscale proof, type floor, figure captions with the source by path and commit). The talk's equivalent is the **studio**: brief → storyboard → versions (≥2) → critique → promote.
- **Truth files**: `REALITY.md` (36 KB, a heading per member), `BRIEF-CORRECTIONS.md`, and briefs published in full under `briefs/<date>__in-session/`. Every number traces to `claims/register.json`.



## 4. Messaging and presentation

- **The first screen** (book `src/pages/index.html`, talk home): a `hero` with a two-column grid.
  - Left column: a kicker (context and date), an h1 with one emphasised word (`The ultimate <em>insider</em>`), a one-line `sub`, a 3-item `ul.event` (who, how, status), and `.btns` with one primary call to action plus 3 secondary ones.
  - Right column: either a **facts panel**, a `<dl>` of 4 big numbers with one-line meanings and a `note` naming the source and that it was corrected, or (on the talk site) an **inline SVG Venn diagram** of the argument.
  - The page then continues in alternating `band` / `band alt` sections, each with an h2 and a `measure`-wide lead: "The first version is here", "Two threads, told as one story" (`ul.three` with colour classes a/r/i), "The gap it fills", and "The dates" (milestones with live countdowns).
  - The talk home embeds a **live animated slide in an iframe** under "Every slide is a live infographic", and ends with `ul.cards` "Read more".
- **Tone**: plain declarative sentences, numbers with their source, failures kept in ("The failures stay in"), labels such as "proposal", "illustrative" and "SYNTHETIC" stated openly, dates written out in full ("Monday 2 November 2026"), no em-dashes (a gate check).
- **Every page** follows the order crumb → kicker naming section and source path → h1 → `lead` → `note` (the provenance). Every page has a markdown twin.
- **For a stranger**: the cold-read site states its single constraint first ("One repository, read-only, pinned at commit 298be4e ... This team was given nothing else"). Its deliverables are a list of who made what. Review pages open with "Dear reader, would you read two chapters? ... Why you ... What we would like ... What you get back".



## 5. What to bring to web-summit.sgit.ai (prioritised, navigation first)

| # | What | From | Effort |
|---|---|---|---|
| 1 | **Left-hand section menus** on Team, Work, About (and later Lab). Add `side` groups to each entry of `SECTIONS` in `build.mjs` and wrap in `.shell` / `aside.side > details > summary`, so the menu collapses with no JS on a phone. Auto-list one link per member and per brief, and show an item only when its source file exists. | `build.py` `side_nav()`/`shell()` lines 284-308; `.shell`/`.side` rules in `src/static/assets/site.css` | M |
| 2 | **Section-aware top nav**: `aria-current="true"` for "inside this section", plus a one-row horizontally scrolling nav with fade masks on mobile instead of wrapping. Put the version (linked to the release notes) and the theme toggle in the top bar. | `chrome()` `here=` logic; `nav.main.more-l/.more-r` CSS; `theme.js` | S |
| 3 | **Crumb, kicker and lead on every page**: keep our generated breadcrumbs and add the kicker line naming the section and the source file (`content/x.md`, `data/y.json`), then a `lead`. | the pattern on every book page | S |
| 4 | **Home page rebuilt in the book/talk hero pattern**: a kicker with the dates, an h1 with one `<em>`, a sub, a 3-fact list, one primary and 3 secondary buttons, a right-hand facts `<dl>` from `data/numbers.json` with its source note, then alternating bands (the seven going; how the team works; the summit; the dates with countdown) and one embedded animation. | book `src/pages/index.html`, talk home | M |
| 5 | **Design tokens file** with the three meaning colours mapped to our domain (people / agents / companies), a type scale, width rules, and a gate check that `site.css` uses only tokens. | `src/static/assets/tokens.css`; `validate.py` `check_type_scale` | S |
| 6 | **The slide engine**, vendored with a sha256 pin and attribution, so we can make animations as markup (`data-in/count/draw`, `?static`, `?t=`, reduced motion). | live `the-ultimate-insider.presentation.sgit.ai/talk/engine/slide.js` + `slide.css` (Apache-2.0) | S |
| 7 | **"Meet the team" animation** for our home page and `/team/`: the 7 going plus the agent roles on an hour dial at their wake minute (from `team/conductor/schedule.json`), counts read at load from a `team-in-numbers.json` that the build writes from `data/team.json`, wakes and log. | talk `motion/lab/meet-the-team/v1/index.html` (M03) | M |
| 8 | **The cast**: a generator (`make_cast.py`-style) drawing each of our 8 agent roles as one robot construction with one colour and one head and hand item, in 4 moods. Use them on `/team/`, `/agents/`, the status lines (mood from `status.json`) and the board. Copy the rules too: agents only, no real people unless at their own word, one line of at most 90 characters each. | `lab/characters/make_cast.py`, `make_conductor.py`, `README.md`; `lab/experiments/27-designer-the-cast/` | M |
| 9 | **A visual dashboard of the team's work**: per role, a grid of wake cells coloured by outcome, each with five step dots, built from `team/<id>/wakes/*.json`; plus a pace flow (brief → issue → work → review → shipped). | `build.py` `wakes()`, `wakes_html()`, `flow_graph()`; live `admin/dashboard.html` | M |
| 10 | **Infographics of how we work**: adapt (recolour to our tokens) the five-step wake, comms-in-git, CI-owns-the-version, setup order and key-per-session figures, and add data-driven `timeline` and `counters` components (JSON in, SVG out) for the summit week. | `team/conductor/rc1/infographics/svg/ig14,ig36,ig37,ig38,ig12`; `lab/tools/components/timeline.py`, `counters.py` | M |
| 11 | **`/updates/`: the conductor's brief to the operator and the seven** after each run: stats tiles, "for you" asks with options and a recommendation, "you asked" replay, who is doing what, next. | `team/conductor/editor-briefs/README.md` and `build.py` `build_updates()` | M |
| 12 | **A lab** with the same rules: `lab/experiments/<nn>-<member>-<slug>/experiment.json` (tries, made_from, question, keep/change/drop), an id ledger, runs as `spec`/`evidence` JSON, and a lab page showing each animation at beginning, middle and end through `?t=` iframes. | `lab/README.md`, `lab/tools/ids.json`, `lab/runs/`; talk `studio/lab.html`, `studio/how-it-works` (version ladder and checklist) | M |
| 13 | **Synthetic personas for Web Summit audiences** (founder, investor, journalist, sponsor, attendee with their own agent), each with judges, device, time and lost-by, scoring our pages, clearly marked SYNTHETIC; plus "start here if you are a ..." reading paths. | `src/pages/personas/*.html`, `src/pages/review/*.html`, `review/personas/*.json` | M |
| 14 | **Stop committing generated output**: CI builds `_site/`, writes the version, tags, deploys through the Pages artifact, and checks the live `version.txt`. A release becomes a one-file commit instead of about 349. This changes CLAUDE.md's "commit the generated output" rule, so it is **the operator's call**. | `.github/workflows/release.yml`, `.gitignore` (`_site/`) | L |
| 15 | **Offline cache** for summit wifi: network-first, same-origin only, with an `sw.json` kill switch and `?nosw`. | `src/static/sw.js`, `sw.json`, `theme.js` | S |

**Order to do them:** 1-3 (navigation) and 5 first, since they are cheap and make the rest coherent. Then 6, 7 and 4, which together give a visual home page. 8-10 make the team's work visible. 11-13 are the process parts. 14 waits for the operator.

**Cautions:**
- Our CLAUDE.md says publish nothing about the event that is not sourced. Every number on an animation or tile must be read from `data/*.json`, the way M03 reads `team-in-numbers.json`.
- Their cast rules ban drawing real people. That fits our seven named people: draw the agents, not the humans.
- The print palette (`#1f2933`/`#b0481a`) and the web tokens are different systems. For the site, use the web tokens.
