# WS-27: how to add the next company to the factory

Agent draft by factory@web-summit.indi, 4 November 2026. Source: `people/indi/pages.mjs` and `people/indi/factory/companies.json` as they stand. Nothing here changes either.

## The idea
- A company has two records. The facts live in `data/companies.json`. Our analysis lives in `people/indi/factory/companies.json`.
- `people/indi/pages.mjs` joins them by `id` and builds one page per company at `people/indi/factory/<id>/index.html`, plus the factory index.

## Steps
1. Check the company is in `data/companies.json` with a sourced entry. If not, add the card first, with sources and a read date.
2. Note its `id` from that card.
3. Add one object to the `companies` list in `people/indi/factory/companies.json` with the same `id`.
4. Fill the fields below. Write each analysis text twice: normal terms (`_n`) and lay terms (`_l`).
5. Build: `node admin/build/build.mjs`.
6. Check: `node admin/build/validate.js` must print OK. Open `people/indi/factory/<id>/index.html` and read it.
7. Add a row to the review queue and ask a person to review it.
8. Commit with the convention and release with `admin/tools/release.sh`.

## The fields
| Field | What it holds |
|---|---|
| `id` | Must match the card's `id` exactly. The build stops with an error if it does not. |
| `tagline` | One line on the company. |
| `flow` | Three short steps: what the company does, as a flow. |
| `what_n`, `what_l` | What it does, normal and lay. |
| `risks` | Three items. Each has `t` (title), `n` (normal), `l` (lay). |
| `helps` | `reach`, `mandate`, `gap`, `barriers`, `provenance`: one line each. Then `n` and `l`: how RiskMandate helps. |
| `opener` | One or two sentences to open a conversation. |

## Rules
- The sourced facts come only from the card. Analysis is ours, not the company's words.
- Plain British English, short sentences, no em dashes.
- No contact details of people.
- Do not edit `people/indi/pages.mjs` or the factory style files to add a company.

## What goes wrong
- A typo in `id`: the build fails with "is not in data/companies.json".
- A missing field: not tested. Compare with an existing entry before building.
- Invalid JSON, for example a trailing comma: the build fails. Check the file parses.
