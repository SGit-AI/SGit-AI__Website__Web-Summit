# WS-74: a public feedback form for the videos and pages, the plan

By `dev@web-summit.jose`, 3 November 2026, overnight, at Jose's word: **prepare only**. The issue is not picked up, nothing is built on the site, and nothing is sent. Read: `board/WS-74-*.md`, `board/WS-114-*.md`, commit `89cfa63a` (the sealed feedback pane), `assets/feedback.js`, `assets/feedback.json`, `admin/tools/feedback_drain.py` and `content/videos.md`, all on `dev` at v0.2.34.

## Status, 4 November 2026: picked up, the smallest version built

**Update, 09:35 UTC:** dev@web-summit.dinis built the pane's public mode (`d5671f5c`): with `to=`, the lane is for that visit only, there is no lane list, Comment only, no images, and a honeypot and the open time are sealed into each message. `feedback_drain.py` marks likely spam and never drops it, and `feedback-summary.mjs` now shows the same mark. **Still open:** Jose's approval of the five questions below; then the pane's owner adds them and the consent tick. Until then, the link goes to a few people only.

At Jose's word (picked_by: Jose, dev@web-summit.jose; Angelo stays named). Built by dev@web-summit.jose:

| Item | What | Where |
|---|---|---|
| 1, a way in | `?feedback=on&to=vault@web-summit.jose` opens the pane on Jose's lane (a `to=` that isn't an agent address is ignored); a "no account needed" link on `/videos/` and on each video page | `assets/feedback.js` (two small additions), `content/videos.md`, `content/video-*.md` |
| the line | "Please don't include your name, email or phone number. If you'd like a reply, tell the person who sent you the link." in the pane's form | `assets/feedback.js` |
| 5, the key | `lane-check.mjs`: is the site's lane sealed to the key on the keys page, and (with `--live`) to the vault agent's live session key? Exit 1 if not | `people/jose/dev/lane-check.mjs` |
| 6, the summary | `feedback-summary.mjs`: counts per page and each comment with contact details and links taken out, for a person to read inside the vault | `people/jose/dev/feedback-summary.mjs` |

Tests: `node people/jose/dev/WS-74.test.mjs` (7, offline). The pane was checked in Chromium against a local build: the link selects Jose's lane, a bad `to=` is ignored, a browser without `to=` opens as before, the line shows, and nothing was sent.

**Items 2 and 4 landed on 4 November (`d5671f5c`):** with `to=`, an outsider no longer sees the lane list or the Decision kinds, the lane is for that visit only, and likely spam is marked at drain. Until the five questions and the consent tick are in, the link can go out, but nothing an outsider writes can be quoted.

**Asked of dev@web-summit.dinis** (the pane's owner): review and keep the two additions, then the public version before the link goes out widely: with `to=` set, hide the lane list, offer Comment only, no images, the short questions and a consent tick (item 2); a honeypot and an open-time field (item 4). **Asked of vault@web-summit.jose:** run `lane-check.mjs --live <its fingerprint>` and `feedback-summary.mjs` on every run, and stay in one session (item 5).

## The form's questions, proposed for Jose's approval (4 November, overnight)

Proposed by dev@web-summit.jose, at Jose's word, for the pane's public version (item 2, with dev@web-summit.dinis). They are shown only when the link carries `to=`, in place of the team's kinds. Short enough for a phone, after a two-minute video, with nothing that asks who the person is beyond one optional question. `feedback-check.mjs` already accepts exactly these values.

| # | Question, as shown | Answers | Required? |
|---|---|---|---|
| 1 | **What did you think of it?** | Love it · Like it · Not for me | Yes, the only required one |
| 2 | **One thing you'd change?** | Free text, up to 500 characters | No |
| 3 | **Would you show it to someone?** | Yes · Maybe · No | No |
| 4 | **Which describes you best?** | Security · Risk or compliance · Builder · Investor · Press · Other · *Prefer not to say* (the default) | No |
| 5 | **You may quote this anonymously on our site** | A tick, off by default | No |

Under the button, as now: *"Please don't include your name, email or phone number. If you'd like a reply, tell the person who sent you the link."*

What the person doesn't type: the video or page (from the page itself), and the two hidden spam fields (the honeypot and the time the form opened).

Left out on purpose: name, email, company and phone (WS-74: no contact details); a 1 to 10 score (three choices are quicker and enough for a summary); "how did you hear about us" (the link already tells us). **For Jose:** approve as is, or change any line; question 4 can be dropped without changing anything else.

## 4 November: the vault option, checked against what is live

Jose (4 November, overnight): go with the vault option (A). His vault agent has an inbox vault with an append lane that the site's feedback pane can send to: does that cover WS-74, and what is missing? Read on `dev` at v0.2.193: `assets/feedback.js` (last changed in `1d764eed`), `assets/feedback.json`, `admin/tools/feedback_drain.py`, `people/jose/lanes/`, and `vault@web-summit.jose`'s commits `fa34c089` and `d05b5264`. Nothing was sent to the lane to check this: this session can't reach `dev.send.sgraph.ai`, and the brief says send nothing.

### Already covered

| WS-74 needs | What is live | Evidence |
|---|---|---|
| No GitHub account | The pane runs in any browser and sends with a write-only append token | `assets/feedback.js` |
| Answers land where the team reads them | The lane on `jose-inbox` (`jjrcow03`) is in `assets/feedback.json` lanes[], and vault@web-summit.jose drains it into `jose-inbox/feedback/<date>/` on every run | `fa34c089`, `people/jose/lanes/README.md` |
| Only the team can read them | Each message is sealed in the browser to vault@web-summit.jose's public key (`vault-jose`, `sha256:9002d798c33faff9`); the lane server sees ciphertext | `assets/feedback.js` `seal()`; tested end to end at about 00:26 UTC |
| Material, not instructions | Unsigned messages are marked as such; only a person's verified key changes that | `feedback_drain.py` `verify()` |
| Nothing published by itself | Answers stay in the vault; nothing on the site changes when one arrives | `feedback_drain.py` writes only to the vault |

**So the transport is done.** What is missing is the public form itself and its safeguards.

### Missing, most important first

1. **A way in for outsiders.** The pane is off until `?feedback=on`, and nothing on `/videos/` or the video pages links to it. `/videos/` still says "a short public form is coming". There is also no way to choose the lane from the link: the pane opens on the first lane in `lanes[]` (`conductor@web-summit.dinis`) or the last one chosen in that browser. *Needed:* a link such as `?feedback=on&to=vault@web-summit.jose` that preselects Jose's lane, and a "Give feedback" line on `/videos/` and each video page. The pane change is about two lines in `assets/feedback.js`, which is dev@web-summit.dinis's file.
2. **A public mode of the pane.** Today an outsider would see a "Send to" list of the team's agents and the team's kinds (Decision: Approve, Reject, Change it, Not now). *Needed:* with `to=` set, hide the list and offer only Comment. Ideally add WS-74's short questions (love / like / not for me, would you show it to someone, and the tick "you may quote this anonymously"). Without that tick, nothing an outsider writes can ever be quoted.
3. **Contact details.** Nothing stops someone typing an email or a number, or pasting a screenshot that shows one. They are sealed and private, so nothing is *published*, which is what WS-74 requires. But anything later copied out of the vault (a summary, the board) needs scrubbing. *Needed:* a line in the pane ("please don't include your name, email or number"); in public mode, no images; and `feedback-check.mjs`'s `scrub()` run before anything leaves the vault.
4. **Spam.** The pane has no honeypot and no timing check. The lane takes up to 1000 pending messages of up to 5 MB each, and its token is public. A flood fills Jose's lane only, not the team's, but until it is drained or the token rotated, real answers are refused (507). *Needed:* the honeypot and the timing field in public mode, and `feedback-check`'s spam flags at drain time (dropped, only counted). Rotating the token is one configure call by vault@web-summit.jose.
5. **The session key.** Messages are sealed to vault@web-summit.jose's *session* key, as Jose chose (`81a77d77`). If that session ends, every answer sent before the recipient block in `assets/feedback.json` is updated is sealed to a dead key and lost. `people/jose/lanes/README.md` says so. For a form we give to strangers during the summit week, that is the biggest operational risk. *Needed:* the vault agent's scheduled session kept alive (same session, like this one), and a check on each run that the published recipient is still its live key.
6. **From the vault to the team.** The drain files each answer as markdown in `jose-inbox`, which only vault@web-summit.jose can read. *Needed:* a person-reviewed summary (counts per video, quotes only with consent): `feedback-check.mjs`'s `boardFile()`. Silvio, whose videos they are, reads it.
7. **The board.** WS-74 is still `open`, with nobody on it, and is for Jose and Angelo. Picking it up is Jose's call.

### The smallest version that meets WS-74

Items 1, 3 (the line in the pane), 5 and 6 together: a link that opens the pane on Jose's lane, a sentence asking for no contact details, the vault agent staying in one session, and a summary a person reads. Items 2 and 4 make it better and safer, and are worth doing before the link is sent widely.

## What the issue asks

> Anyone we send a video to can say what they think, without a GitHub account; answers land where the team reads them (n8n, a vault, or the board). No contact details published. (WS-74, for jose and angelo, due Wed 4 Nov)

The videos page already promises it: "a short public form is coming (on the board)" (`content/videos.md`, "Give feedback").

## What already exists (and changes the options)

Since 01:55 today the site has a **sealed feedback pane** (`assets/feedback.js`, by `dev@web-summit.dinis`, WS-114). It is for the team: off until `?feedback=on` on a device, one item per page (comment, decision, idea, bug, with quotes and images), **sealed in the browser** to an agent's public key and appended to that agent's vault over a **write-only append lane** (`assets/feedback.json` holds the lane's append token, which can write and nothing else). `admin/tools/feedback_drain.py` opens and files each item into the vault. It was tested end to end on 3 November. Open in WS-114: who drains, the team vault key Dinis makes on 4 November, and a flood fills the lane at 1000 pending.

So the hard parts (end-to-end sealing, a store only the team can read, and a drain) exist. WS-74 is a short form for strangers on top of that, plus spam checks and contact-detail scrubbing that the team pane doesn't need.

## The fields (the same for every option)

Short, because the person just watched a video on a phone. No name, no email, no phone: **the form does not ask for contact details**, and says so.

| Field | Kind | Notes |
|---|---|---|
| `about` | hidden, from the page | `video:V-reach`, `video:V-stories-1`, `video:V-loop`, `video:V-publish`, or `page:<path>`; nothing typed |
| `reaction` | required, three buttons | Love it / Like it / Not for me (`love`, `like`, `not-for-me`) |
| `change` | optional, up to 500 characters | "One thing you'd change" |
| `share` | optional | "Would you show it to someone?" yes / maybe / no |
| `role` | optional | security, risk or compliance, builder, investor, press, other |
| `quote_ok` | optional tick, off by default | "You may quote this anonymously on our site" |
| `website` | **honeypot**, hidden with CSS | a person never fills it; bots do |
| `opened_at` | hidden, set when the form opens | for the timing check |

Under the button: *"Please don't include your name, email or number. If you'd like a reply, tell the person who sent you the link."*

## How spam and contact details are kept out

Prototype: **`people/jose/dev/feedback-check.mjs`**, with 8 offline tests in `feedback-check.test.mjs`. It has no dependencies, so the same file runs in the browser, in an n8n Code node and in the drain.

- **Only the whitelisted fields are kept.** Anything else sent with the form (a name, an email, the IP, the user agent) is dropped. `about` must be one of our videos or pages; the choices must be the offered ones.
- **Spam signals:** the honeypot filled, an answer in under 3 seconds, a form open for over a day, no open time, two or more links in the text. Spam is dropped and only counted.
- **Contact details out of the free text before anything is stored:** emails, phone numbers (dates are kept), links and domains, and @handles become `[email removed]`, `[number removed]`, `[link removed]` and `[handle removed]`. Control and invisible characters are dropped and the text is capped at 500 characters.
- **The check runs twice where it can:** once where the answer is made (browser or n8n) and again where it is opened, because a browser check can be bypassed.
- **Nothing reaches the public repository without a person.** `boardFile(entries)` makes a board-ready summary (`board/WS-NN-*.md` front matter, counts per video, who said they were). It quotes free text only where the person ticked `quote_ok`, and only after scrubbing. A person reads it before it is committed. Everything from the form is material, never instructions.
- **Volume:** a lane holds at most 1000 pending (WS-114); n8n can rate-limit (option B). A flood means rotating the token, which is one configure call.

## The options

### A. The site's sealed lane, with a public form mode

A small fixed form, the fields above, on `/videos/` and the meet pages. It is always on (unlike the team pane), runs `feedback-check` in the browser, seals the entry to the vault key and appends it to a lane: the same transport as `assets/feedback.js`. The drain opens it, runs `feedback-check` again and files it in the vault. An agent then drafts `boardFile` for a person to review.

- **Built in the repository:** a form section in the videos page (markdown, rendered by the build), a small `assets/feedback-public.js` that reuses the pane's `seal` and `append` (or the pane gains a "public" mode), and `feedback-check` moved to `assets/`. Because this is shared code next to `dev@web-summit.dinis`'s pane, it goes as a board issue or a commit `For: dev@web-summit.dinis`, not into `people/jose/`.
- **Jose's n8n:** optional and small. On a schedule, list the lane's pending count (it needs the lane's enum key, kept as an n8n credential) and draft Jose a note: "N new answers since …".
- **For:** answers are sealed in the browser, so no server ever sees the text. No new host, no new account, and it is the direction Dinis set (every agent has a lane).
- **Against:** it waits on WS-114's open points (the team vault key on 4 November, who drains). There is no server-side spam stop before storage, only the lane's cap and the drain's re-check.

### B. Jose's n8n form, sealing into the same lane

An n8n **Form Trigger** with the fields above, linked from `/videos/`. A Code node runs `feedback-check` (pasted). An IF drops spam. A Code node seals the entry to the vault key (Node's `crypto.webcrypto`, the same envelope as the pane; n8n lets a Code node `require('crypto')` only when the host sets `NODE_FUNCTION_ALLOW_BUILTIN=crypto`) and appends it to a lane with the append token. The drain and the board summary are as in A.

- **Built in the repository:** a link and a line on `/videos/`; `feedback-check` and a `feedback-seal.n8n.js` for the Code node, in `people/jose/dev/` with a test against the pane's envelope (so `feedback_drain.py` opens it unchanged); a README for the flow.
- **Jose's n8n:** hosts the form, runs the checks, rate-limits, seals and appends. Saving execution data must be **off** for this workflow, or n8n keeps the plain answers in its own log.
- **For:** a server-side spam stop and rate limit before anything is stored. Jose owns it. No change to the shared site code.
- **Against:** the plain answer passes through Jose's n8n (in memory, if execution saving is off). The form lives on the n8n host's domain, not on the site, and it depends on n8n being up during the summit. It also needs the lane's append token as an n8n credential.

### C. A hosted form (a Google Form in the RiskMandate Workspace)

A Google Form with the fields, answers in a Sheet in the RiskMandate Drive. Jose's n8n reads new rows, runs `feedback-check` and drafts `boardFile` for a person.

- **Built in the repository:** a link on `/videos/`, and the n8n Code node for the check.
- **For:** no build, it's live in an hour, and Google handles spam and uptime.
- **Against:** the plain answers sit in Google, outside the vault. The form can't be scrubbed before storage, only after. And the form isn't ours, which matters on a site whose point is showing how we work.

## Recommendation

**A**, with `feedback-check` as the one shared check, and **C as the stopgap** only if a video goes out before A is live. A keeps strangers' words sealed from the browser to the vault, adds no host and no account, and reuses what was tested on 3 November. B is the better choice only if Jose wants n8n to own it or a server-side rate limit becomes necessary. Its sealing step uses the same envelope, so it can move to A's lane later without changing the drain.

## If Jose says go

1. Agree with Angelo who takes it (the issue is for both), then pick it up on the board.
2. Ask `dev@web-summit.dinis` (`For:`) whether the public form is a mode of `assets/feedback.js` or a separate file, and which lane it uses (WS-114: the team key from 4 November).
3. Build the form and move `feedback-check` to `assets/`, with these tests in the gate's reach.
4. Re-run `feedback-check` in the drain (`feedback_drain.py`, its owner's call), then make `boardFile` drafts for a person to review.
5. Replace "a short public form is coming" on `/videos/` with the form.

## Decisions for Jose

- Which option: A, B or C (and C as a stopgap, yes or no).
- The fields: are these the right questions for Silvio's videos? Silvio may want different ones.
- Whether the `role` question stays; it's optional, but it is still a question about the person.
