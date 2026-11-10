# The incident site: repository, pipeline, data and dashboard (a proposal for Dinis)

> By incident.conductor@web-summit.dinis, 10 November 2026, ~19:10 UTC, for Dinis to read when he sets the repository up (BRIEF.md: "its own website and repository"; "we can't afford delays"). A proposal, not a build. Where it departs from the estate's standard (sgit.ai/docs/guidance/repositories.md) it says so, and nothing departs until Dinis says yes.

## 0. What we measured today (this repository, not a guess)

| Step (run 42879607949, push 18:52:39 UTC) | Took |
|---|---|
| queue + `validate` job (checkout `fetch-depth: 0`, blobless; the gate) | 2 min 02 s, of which **the gate 110 s** |
| `release` job (second checkout, `tag_release.sh` builds and gates again, commits and pushes the version) | 52 s |
| ... of which upload-pages-artifact / deploy-pages | 8 s / 12 s |
| **push to deployed** | **3 min 02 s** (other runs today 3 to 8 min: `concurrency: release` never cancels, so pushes queue) |
| the same build + gate on a session's machine | **7.8 s** (`node admin/build/validate.js`, 789 pages) |
| GitHub Pages' own edge cache on every page | `cache-control: max-age=600` (read on `/` at 18:59): a reader can see a page **up to 10 minutes old** after a deploy |

So the minutes are spent in CI shape (two jobs, two checkouts, two builds, a commit pushed back, a queue that never drops stale runs) and in Pages' 10-minute cache, not in building. The gate's 110 s in CI against 7.8 s locally is unexplained: incident.dev measures it first (hypothesis: the blobless full-history clone fetching objects lazily during the build; to be proved, not assumed).

## 1. The idea: two lanes

1. **The data lane (seconds).** Agents and connectors write JSON into an SG/Send vault (`sgit commit && sgit push`). The dashboard reads the vault in the browser with the vault library this estate already pins (`assets/vendor/sg-vault/2026-11-04/`, exactly how Silvio's Universe reads the public CRM vault in `assets/cc/brain.js`). **No CI, no Pages, no cache of ours in the path.** A new signal is on screen at the reader's next poll.
2. **The shell lane (under a minute).** HTML, JS, CSS and the markdown record go through git, CI and Pages. The shell changes a few times a day; it never carries the minute-by-minute data, so Pages' 10-minute cache stops mattering.

Git stays the **record**: the vault's state is mirrored into the repository (signed, every hour and at close-out), so the timeline and the evidence survive the incident and the gate checks them.

## 2. Repository layout

```
README.md  BRIEF.md  BRIEF-CORRECTIONS.md  REALITY.md  CLAUDE.md   the estate's standard files
incidents/<yyyy-mm-dd-slug>/
    README.md                  the seven steps (declaration ... close-out), as today
    timeline.json  decisions.json  facts.json        JSON first; the .md pages are rendered from them
    signals/<source>.json      what each desk read, with url and time read
    graph.json                 the decision graph: actors, decisions, lead times; F/E/H labels, FACT-Ray bands
    comms/                     drafts, one source, many audiences (a person sends)
data/
    sources.json               every source: url, owner, cadence, connector, licence, last read
    schemas/*.json             one JSON Schema per file kind, a README each
    keys.json                  the agents' public keys
connectors/<source>.mjs        one small reader per source: fetch, take only what matters, write JSON
app/                           the dashboard (static; reads JSON only)
    index.html  app.js  app.css
    panes/now.js  panes/flow.js  panes/graph.js  panes/weather.js
    vendor/live-map@<sha>/     Angelo's engine, a pinned copy (section 4)
    vendor/universe@<sha>/     Silvio's engine, a pinned copy
    vendor/sg-vault@2026-11-04/
agents/<role>/status.json      done, next, asks ("Dinis: ..." first when blocked)
board/IN-NN-*.md               one file per issue
admin/build/build.mjs  admin/build/validate.js  admin/tools/release.sh  admin/tools/mirror.mjs
.github/workflows/deploy.yml   one job (section 3)
```

No `node_modules`: zero dependencies, as here. Generated output is never committed, as here.

## 3. The shell lane: CI in under a minute

**Cut**
- **One job, not two**, one checkout, one build, one gate. The tree that passes is the tree deployed.
- **`fetch-depth: 1`.** Nothing in the incident site's build reads history. Pages that need history (who did what when) read it from the mirrored JSON, or from GitHub's API in the browser, as `brain.js` already does.
- **No commit pushed back by CI.** *Departs from the estate's "CI owns the version" as built today* (`tag_release.sh` commits version.txt, versions.json and REALITY.md). Proposal: CI still owns the number (`v0.N.<run_number>`), writes it into the artifact (`version.txt` served, `versions.json` appended in the artifact from the previous deploy's copy) and pushes a **lightweight tag** on the commit it built. One push, no rebase race, no second build. REALITY.md's version line is read from the served `version.txt`. Needs Dinis's yes (and a line in BRIEF-CORRECTIONS.md).
- **`concurrency: { group: deploy, cancel-in-progress: true }`.** The newest tree wins; every build is the whole tree, so a cancelled run loses nothing. Today's never-cancel queue is where the 8-minute releases come from.

**Cache**
- `actions/cache` keyed on the hash of `content/` and `data/` for the build's intermediate output, so a push that touches one page rebuilds one page. Small win at this size (the build is seconds); worth it only once the site has hundreds of pages.
- No `setup-node` download: `ubuntu-latest` ships a Node new enough; pin the major and fail loudly if it changes.

**Skip (but never the gate)**
- The gate stays blocking ("a red gate is no release"), with a **5-second budget**: front matter, schemas, internal links, signatures, the credentials scan. Checks that need the network or the whole history (external links, the lane check over a range, Lighthouse) move to a scheduled job every 15 minutes that opens a board item when red. They find; they do not block a push in the middle of an incident.

**Expected:** runner start ~5 to 10 s + checkout ~2 s + build and gate ~5 s + upload ~8 s + deploy ~12 s = **~35 to 40 s push to deployed.** That is the floor on GitHub Pages: the upload-and-deploy step alone is ~20 s, and readers can still be served the previous shell for up to 10 minutes (`max-age=600`, not configurable on Pages).

**Where Pages is the limit, and what to use instead**
- For the dashboard, Pages is not the limit once data moves to the vault lane: the shell can be 10 minutes stale because it does not hold data.
- If the shell itself must change in seconds (for example a new pane during the storm): deploy the artifact to **S3 + CloudFront** in the estate's AWS (SG/Send already runs there: `dev.send.sgraph.ai` is served by CloudFront, `max-age=300`), with `aws s3 sync --size-only` of the changed files, `Cache-Control: no-cache` on `*.html` and `*.json`, long cache on hashed assets, and no invalidation needed. ~10 s from the end of the build. Second choice: Cloudflare Pages direct upload (wrangler), similar speed. Either needs a deploy credential in the repository's secrets, which only Dinis can add; until then, Pages.

## 4. The data lane: the vaults and the site

```
connectors (agents' sessions, scheduled)  --write JSON-->  public incident vault   --read in the browser-->  dashboard
                                                           (read key published,      (pinned sg-vault lib;
                                                            public facts only)        polls the ref, ~30 s)
team-only material (who is where, plan B) --> private incident vault (key sealed to each person's and agent's key; never on the site)
public vault  --hourly + close-out, admin/tools/mirror.mjs-->  git: incidents/<slug>/*.json (signed) --> the gate, the record pages
```

- **Two vaults per incident.** Public: facts, evidence, signals, the decision graph, the weather series; its read key goes in `data/vaults.json` on purpose, as `data/crm.json` does today. Private: anything about a person's whereabouts or safety; sealed to keys (`admin/tools/seal.mjs` here), never rendered on the site.
- **Writers:** each agent writes only its own folder in the vault (`meteorologist/`, `researcher/`, `signals/`, `conductor/`). One writer per file, so there are no merge conflicts in the minute that matters.
- **Readers:** the dashboard; Vicky's agents (we offer them the public read key and the schemas on her conductor's inbox, as material; we never write to her desks); the work desk.
- **The mirror:** git is the record and the gate's input; the vault is the live wire. If they disagree, git wins after the incident; during it, the vault's newest signed entry is shown with its time read.
- **To measure before we rely on it (incident.dev's job 2):** vault write to browser read, end to end. The content-addressed objects can be cached for ever; the ref file must not be. If the endpoint caches the ref, we poll with a cache-buster or ask the SG/Send team for `no-cache` on refs.

## 5. The dashboard: reusing Angelo's map and Silvio's Universe

One page, four panes, all reading JSON only:

| Pane | What | Built from |
|---|---|---|
| **Now** | the facts at this minute, each with source and time read; Web Summit's Wednesday status (open / suspended / unknown) in one line; what is *not* known | `facts.json` from the vault |
| **Flow** | every signal and decision as an exchange between actors, in real time, with the replay dial back to 08:46 on 10 November | **Angelo's live map** (`people/angelo/app/live.js`, `live3d.js`, `replay.js`) |
| **Graph** | who decides what: IPMA, ANEPC, the government, the Câmara, transport, Web Summit, and our own Wednesday commitments; facts, evidence and hypotheses as node kinds, FACT-Ray bands as status | **Silvio's Universe** (`assets/cc/brain.js`, `brain-libs.js`) |
| **Weather** | IPMA's warnings as a timeline, forecast against observed at the Lisbon stations, the airport's TAF and METAR gusts | the meteorologist's JSON; plain SVG charts |

**Angelo's live map.** `live.js` is a self-contained engine that draws people on a ring and every exchange at its real moment from `live.json` (who, to whom, when; it already takes an `o.liveUrl` option), polled about once a minute, with the time dial and `replay-events.json` for the past, and `live3d.js` for the same flow in WebGL. We emit an incident-shaped `live.json`: the actors are the decision graph's nodes, an exchange is a signal or decision from one actor to the next, and `e[5]` (the repository slot) becomes the source. Copied as a **pinned vendor copy** (`app/vendor/live-map@<commit>/`, with the commit it came from), so Angelo's daily changes never break the storm's screen; a small adapter file maps our JSON to his shape. If his engine needs a hook (a node set not drawn from the team), we ask dev.map@PrompTugal.angelo in a commit with `For:`; we do not fork his logic.

**Silvio's Universe.** `brain.js` exposes `window.LiveUniverse = { agents(), summit() }`, each resolving to the node-and-link shapes the map draws, and already reads a public vault with the pinned library. We add a third loader, `incident({ vault })`, beside his two, in our pinned copy, returning the same shapes from `graph.json`. `brain-libs.js` is 1.6 MB: loaded only when the Graph pane opens. His `clean()` (session ids stripped, https links only) is kept on everything we render.

## 6. Order of work (incident.dev leads; each step is a push)

1. Measure: why the gate takes 110 s in CI; vault write-to-read latency. (Tonight.)
2. The data lane prototype here, in `team/incidents/`: a public vault for WS-214, one connector writing to it, one page reading it. (Tonight, before Wednesday 05:00, when IPMA's orange rain starts.)
3. The dashboard's Now and Flow panes on that vault. (Wednesday morning.)
4. The new repository's skeleton and the one-job CI, once Dinis creates it. (When it exists.)
5. Graph and Weather panes; the mirror; the scheduled slow checks. (Wednesday and after.)

## 7. For Dinis to decide

1. The repository's name and owner (we work in `team/incidents/` until it exists).
2. Yes or no: CI tags the version instead of committing it (section 3).
3. Yes or no: the two vaults per incident, the public one's read key published (section 4).
4. If seconds are needed for the shell too: an AWS (or Cloudflare) deploy credential in the repository's secrets (section 3).
