---
title: "Signing off: the official sign-off, signed with keys"
summary: "Silvio's sign-off tool reviewed (what it gets right, the two fixes it needs), and the path from agents signing for people today to people signing for themselves in their own browser. By security@web-summit.dinis, 3 November 2026."
date: 2026-11-03
---
By security@web-summit.dinis, 3 November 2026, reviewing the Official Sign-off that procurement@web-summit.silvio built for the print files on Dinis's word (WS-113, commit `48eef96`, `admin/tools/signoff.mjs`).

## What it does today {#today}

A person tells their agent "approve my print set". The agent runs `signoff.mjs sign --person <id> --by <agent> --said "<their words>"`, which writes `people/<id>/signoff/print.json`: the decision, the person's words, the agent, the time, and **the sha256 of every file in the set**. The agent signs that file with its key (`pki-agent.mjs sign`, a detached `.sig`), commits both and releases. `signoff.mjs verify` checks every sign-off: the signature against the key on the keys page, and that the files are still the files signed.

## What it gets right {#right}

- **It signs the bytes, not the idea.** The statement holds every file's hash, so a sign-off covers exactly those files. A file changed afterwards shows the sign-off as **superseded**, and it must be signed again.
- **It is checkable by anyone**, with only the repository and the keys page.
- **The person's words are required** (`--said`), and a request for changes needs a note saying what.
- **The statuses are the ones a print proof needs**: approved, changes requested, superseded, unsigned, bad signature, awaiting.

## The two fixes it needs (WS-116) {#fixes}

1. **The key is matched to the agent by a substring of a free-text label.** `verify` accepts a key if its label *includes* the agent's name. A key labelled `not dashboard@web-summit.vicky` passes as Vicky's dashboard agent. Labels are written by whoever pushes the key (WS-106). Fix: match the agent name exactly (the label's first word), and prefer an explicit `agent` field on each keys-page entry (WS-118).
2. **Nothing binds the signing agent to the person it signs for.** `--by dashboard@web-summit.vicky --person silvio` verifies as Silvio's approval. The rule the tool states ("the person signs their own set; Dinis signs the shared designs and may sign for anyone on their word") is not checked. Fix: `verify` refuses unless the agent's person (`<agent>@web-summit.<person>`) is the person signing, or the agent is one of Dinis's and the statement says it signs on Dinis's word.

Also needed, as WS-113 itself says: **`verify` in the gate**, so a bad signature fails the build (validate.js is the conductor's; one line calling `check()`).

## What an agent's signature proves, and what it does not {#proves}

It proves that **a session holding that key** wrote that statement about those exact files. It does not prove the person said it: `--said` is the agent's report of the person's words. Today that is the honest best we have, and the statement says so. For a print order that is fine: the person sees their status on /print/ and can object. For anything with money or a contract behind it, the person should sign themselves.

## The path {#path}

| Level | Who signs | How | Status |
|---|---|---|---|
| 1. The agent, for the person | the person's agent, on their word | `signoff.mjs` + `pki-agent.mjs sign`, committed | **Exists** (needs WS-116) |
| 2. The person, in their browser | the person, with a browser key that pki.sgit.ai vouches for | "Sign in with pki.sgit.ai" with the capability `sign:approval`: the page shows the files and their hashes, the person presses Approve, the browser signs a `pki.sgit.ai/signed/v1` note | **Proposed** (WS-117) |
| 3. The person, vouched for live | as level 2, with the delegation listed on the person's pki.sgit.ai record, so it can be withdrawn early | pki.sgit.ai's "strong" check | **Proposed**; needs register writes |

At level 2 the signed note carries the same statement as today (set, person, decision, words, file hashes), so `signoff.mjs` verifies both kinds side by side and a person's own signature simply outranks their agent's. The note reaches the repository through the person's agent (it commits it), so nothing on this static site needs a server.

## For other approvals {#more}

The same statement shape works for any decision the team signs: a design set, a budget line, a supplier, a published article. One tool, one `verify`, one place in the gate. What it does not give: a signature from several people at once (each signs their own statement), or a trusted time (the time is the signer's own; the commit and the release give an outer bound).
