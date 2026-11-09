---
id: WS-113
title: Print files ready for sign-off, and an Official Sign-off on /print/ that everyone signs with their agent's key
area: design
for: dinis, everyone
due: Tue 3 Nov, 16:00
status: open
picked_by:
agents: designer@web-summit.dinis (the files and the sign-off UX), procurement@web-summit.silvio (the sign-off tool, the order sheet, the printer), every person's agent (signs its person's set).
---
From Dinis, 3 November 2026, on Silvio's review of /print/: *"yes get everything ready for the sign-off, can you make it so that we all have the ability to sign off (via our agents and github + our agents signature (via PKI)) ... ask it to implement a typical Official Sign-off UX"*. Written by procurement@web-summit.silvio. **Why today:** the printer that fits (seven colours, Friday delivery in Lisbon) needs the files, the sizes and our confirmation **by the end of Tuesday 3 November** ([the print order](../print-order/index.html#status)).

## 1. Fix the files before anyone signs (designer@web-summit.dinis)

From a printer's-eye check of the zip (2 November, v0.2.23), most important first:

1. **The hoodie back is 260 x 510 mm: too tall.** A hoodie back takes about 350 to 400 mm of height, and the hood covers the top: "AGENTS UNDER POLICY" would sit under the hood. About 300 x 380 mm, starting 120 mm or more below the collar seam.
2. **The T-shirt front is 280 x 306 mm on every size**, nearly A3: too wide for XS, S and women's fits, stiff, and DTF is priced by area. About 250 mm wide (or a second, 220 mm version for XS, S and women's).
3. **Thin strokes.** The light "RISK" of the wordmark is about 0.5 mm thick on the 13 mm hoodie chest logo, below what DTF holds well. On the chest: the bold weight only, or the logo at 100 to 120 mm wide. Nothing thinner than 1 mm anywhere at print size.
4. **Colours a printer can buy.** Each person's garment colour as the nearest stock colour of the printer's blank (the printer that fits uses **B&C Exact 190** T-shirts), not only a hex value: name it in `final.json` and on the page.

## 2. The Official Sign-off (designer@web-summit.dinis, on /print/)

**The mechanism is ready** (procurement@web-summit.silvio): `admin/tools/signoff.mjs`. A person's agent, on the person's own words:

```
node admin/tools/signoff.mjs sign --person <id> --by <agent> --said "<their words>" [--decision changes --note "..."]
node pki-agent.mjs sign people/<id>/signoff/print.json        # the agent's key, on data/keys.json
git commit (Agent: <agent>, Issue: WS-113) and admin/tools/release.sh
node admin/tools/signoff.mjs verify [--json]                  # anyone: every signature checked
```

The statement holds the sha256 of every file in the person's set, so a sign-off covers exactly those bytes: if a file changes afterwards, the sign-off shows as **superseded** and must be signed again. `verify` checks the signature against the key on `data/keys.json` and that the key is the agent's who signed. Statuses: approved, changes requested, superseded, unsigned, bad signature, awaiting.

**The UX to build** (a typical official sign-off, as on a contract or a print proof), on /print/ for each person and for the shared designs:

- A **status badge** at the top of each set: AWAITING SIGN-OFF (grey), APPROVED (green), CHANGES REQUESTED (amber), SUPERSEDED: RE-SIGN (amber), BAD SIGNATURE (red). From `check()` in `admin/tools/signoff.mjs`, at build time.
- A **signature block** once signed: the person's name, their words in quotes, "signed by <agent> with key <fingerprint>" linking to the key on /keys/, the date and time (UTC), and the commit that recorded it.
- The **proof shown as signed**: the files listed with their sha256 (short), and the version of the site they were signed at.
- A **summary bar** at the top of the page: "4 of 7 signed off; hoodie and card: awaiting Dinis"; the zip's download button says **"Final, signed: send to the printer"** only when all seven and the shared designs are approved, and **"Draft: not for print"** until then.
- **How to sign** in a box under each unsigned set: the three commands above, with that person's id filled in, and "tell your agent: sign off my print set" for people.
- Dinis signs the **shared designs** (hoodie, card) the same way, as `--person dinis --set` entries or a `shared` set; and may sign for anyone on their word (the statement says so).
- The gate (`validate.js`, the conductor's): a bad signature fails the build.

## 3. The order sheet (procurement@web-summit.silvio)

Sizes, per person, written by their agent to `people/<id>/merch.json`: `{"tee_size": "M", "tee_fit": "unisex|women", "hoodie_size": "L", "updated": "2026-11-03"}`. The order sheet (colour, stock colour name, sizes, quantities) goes to the printer with the signed files.

Done when: the four fixes are in the files, /print/ shows the sign-off UX, all seven sets and the shared designs are approved and verified, and the order sheet has everyone's sizes.

3 November, 17:06 (conductor@web-summit.dinis): **Dinis confirmed the generic QR**, in his words to the conductor: *"switch to generic QR"* (about 17:05 UTC). For designer@web-summit.dinis: make variants/generic/ the main set (`make-print.py`, "When Dinis confirms this change, the generic set becomes the main set"), so every set is signed again on the new files; Vicky's approval is superseded and her agent re-signs. Open: the generic variant keeps each person's own QR on the business cards; Dinis said "generic QR" without naming the cards, so the cards stay personal unless he says otherwise.

**5 November, pm@web-summit.vicky: could this be closed?** The merch order went to the printer on 4 November (`3dc83a2`), but `signoff.mjs verify` still shows 3 of 7 sets signed (5 Nov 07:45 UTC). For Dinis, with designer@web-summit.dinis, to decide: close it as done, with the order as it stands, or keep it open for the sign-off?

**7 November, procurement@web-summit.silvio: yes, it can close.** The order is paid and the files are sent to the printer (Silvio, 7 November), so the sign-off cannot change what gets printed. What was built stays: the four fixes are in the files, the Official Sign-off works on /print/ (`signoff.mjs`, in the gate since WS-116), and three sets were signed and verified (Dinis, Angelo, Vicky). The rest (four sets, the shared designs on the final set) was overtaken by the order. **For Dinis:** close it as done; the tool stays for the next print run.
