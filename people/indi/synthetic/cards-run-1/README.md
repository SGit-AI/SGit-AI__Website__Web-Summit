# Synthetic users: five invented people get a RiskMandate business card

Run 1, 4 November 2026, by synthetic@web-summit.indi (Indi Gupte's agent, Web Summit 2026 team).

## Everybody in here is invented

The five people below do not exist. Their names, jobs and every word attributed to them were written by a language model: one Claude sub-agent per persona, inside this agent's session, looking at images. **This is not user research.** No sentence in it is evidence about a real person.

What is measured, not narrated: the card images (rendered from the print files at trim size), the QR decodes, the page each QR opens, its screenshots on a 390 x 844 phone and its text. See `measurements.json`.

## Why

Dinis, to Indi on WhatsApp, 4 November 2026: focus synthetic users on what you are working on, for example the business cards; create personas, have Claude sub-agents act as them and see if the cards make sense; put it all in a vault published on our site. The method is that of the synthetic-users vaults on https://sgit.ai/demos/vaults/index.html (#27, #28, #54).

## The five runs

| Persona (invented) | Who | Card | Outcome | Steps | Questions | Confusions |
|---|---|---|---|---|---|---|
| Marta Ferreira | CISO, Portuguese retail bank | Dinis | pocketed | 6 | 6 | 6 |
| Kwame Mensah | co-founder, seed startup selling AI agents | Jose | will follow up | 7 | 6 | 7 |
| Hannah Lindqvist | VC partner, B2B SaaS | Nimay | pocketed | 7 | 6 | 7 |
| Rafael Ortega | tech journalist, Spanish daily | Silvio | will follow up | 7 | 7 | 6 |
| Aiko Tanaka | head of AI governance, manufacturer | Indi | will follow up | 7 | 7 | 6 |

All five scanned the QR. None booked. Totals: 34 steps, 32 questions, 32 confusions, 51 findings (6 blocking, 16 costly, 19 minor, 10 held). Angelo's and Vicky's cards were seen only in the end-of-day stack.

Findings, grouped: `findings.md`. Each run, step by step with its interview: `runs/<persona>.json`.

## What is in the vault

- `protocol.md`: the rules each persona agent followed (images only, never the DOM).
- `personas/`, `journeys/` (the expected journey, written before the runs), `runs/`.
- `findings.md`, `measurements.json`.
- `screens/`: the card images and phone screenshots the personas saw.
- `tools/`: `render.js` (cards and phone screenshots, Playwright) and `qr.py` (QR decode, OpenCV).

## Next

Run 2: the same five personas and the same protocol on the round-2 card designs (designer@web-summit.indi, `team/designer/print/concepts-rm/round2`), so the two runs can be compared.

## Where this copy lives

The vault is pushed and published: vault `nnsikio4` on dev.send.sgraph.ai, with its read key in `people/indi/vaults.json` and on /vaults/. It was audited before publication by a separate security sub-agent (every revision, read with the read key; `vault-audit.mjs` clean), recorded in the vault's `PUBLIC.md`. This folder is a copy of its text; the screenshots (6 MB) are only in the vault. They were made again on 4 November with `tools/render.js`: the card images match the print files the personas saw, and the phone screenshots show the /meet/ pages as they were at the rebuild (site v0.2.280), not at v0.2.265.
