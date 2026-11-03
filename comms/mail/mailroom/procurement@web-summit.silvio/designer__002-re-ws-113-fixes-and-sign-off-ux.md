From: designer@web-summit.dinis
To: procurement@web-summit.silvio
Cc: conductor@web-summit.dinis
Date: 2026-11-03 09:50 UTC
Subject: Re: WS-113: the four fixes are in the files, and the Official Sign-off is on /print/
X-Kind: reply
Issue: WS-113, WS-48

Thank you for the printer's-eye check and for the sign-off tool. Both parts of WS-113 that were mine are done; the files are final for signing from this release.

## The four fixes

1. **Hoodie back:** 300 x 380 mm, top 120 mm below the collar seam (was 260 x 510 mm). The line is smaller, so nothing sits under the hood.
2. **T-shirt front:** 250 mm wide (was 280), and a second front for XS, S and women's fits, 220 mm wide: `<id>-tee-front-small.svg/.pdf/.png` in each folder.
3. **Thin strokes:** nothing thinner than 1 mm on any garment at print size. The generator now measures every stroke and picks the lightest weight that holds 1 mm (the light "RISK" becomes a heavier weight where it would print thinner), and refuses to write a file that breaks the rule. The thinnest stroke on every set is now 1.1 mm and is printed on the page. The chest logo is now 110 mm wide.
4. **Stock colours:** each person's garment colour named in the B&C #E190 range, on the page and in `final.json`: Black, Royal Blue, Kelly Green, Orange, Radiant Purple, Red, Gold (with the nearest alternative for four of them). Taken from a distributor's B&C #E190 colour list read today, so please confirm them against the printer's own swatch, and the purple above all.

## The Official Sign-off on /print/

Drawn at every build from your `check()` (`admin/build/signoff-ui.mjs`), so the page cannot say approved when the signatures or the files say otherwise:

- a summary bar at the top ("Draft: not for print yet. 0 of 7 sets signed off ..."), and the zip button reads **"Draft: not for print"** until every set and the shared designs are approved, then **"Final, signed: send to the printer"**;
- a badge per set (AWAITING SIGN-OFF, APPROVED, CHANGES REQUESTED, SUPERSEDED: RE-SIGN, NOT YET SIGNED WITH A KEY, BAD SIGNATURE);
- once signed, the signature block: the person's words, the agent, the key linking to /keys/, the time and the commit;
- under each unsigned set, how to sign, with that person's id filled in;
- every set's files with their sha256.

## Asked of you

- **The shared designs** (hoodie H1, card C1): `signoff.mjs` has no set for them yet, so the page reads them from `final.json`'s `items_signed_off`. A `shared` set that Dinis signs would make them as verifiable as the seven.
- **Hashes and regeneration:** a sign-off covers the exact bytes, and re-rendering the PNGs may change them, so I regenerate the files only when a change is asked for. Once people sign, any change I make shows their set as superseded, as it should.
- **The gate:** a bad signature failing the build is the conductor's (`validate.js`); not done here.

designer@web-summit.dinis
