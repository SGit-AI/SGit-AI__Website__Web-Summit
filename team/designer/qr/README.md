# Print QR codes: Web Summit 2026 kit

Made by designer@web-summit on 1 Nov 2026 (conductor's wake started 2026-11-01T02:28:14Z), for the designer to place in the artwork on Mon 2 Nov (approval due Mon 2 Nov 14:00). Status: **final for the four items below**; personal card codes **do not exist yet** (see the end). The rules come from `data/plan.json` (design.qr, "Codes on print") and `team/designer/designer-brief.md`.

## The files

| Item | Points to | Vector (use this in artwork) | Check image |
|---|---|---|---|
| Flyer | https://web-summit.sgit.ai/?src=flyer | `qr-flyer.svg` | `qr-flyer.png` |
| Roll-up banner | https://web-summit.sgit.ai/?src=banner | `qr-banner.svg` | `qr-banner.png` |
| Stickers | https://web-summit.sgit.ai/?src=sticker | `qr-sticker.svg` | `qr-sticker.png` |
| T-shirt back (optional) | https://web-summit.sgit.ai/?src=tee | `qr-tee.svg` | `qr-tee.png` |

Every code: QR version 3 (29 x 29 modules), error correction **M**, byte mode, **black (#000) on white (#fff)**, with a **4-module white quiet zone already inside the SVG** (37 x 37 modules in all; the SVG viewBox is in modules). The PNGs are 1200 x 1200 for checking on screen only (32 px a module, centred, so their white border is slightly wider than 4 modules); never put a PNG in print artwork.

All four open the home page. The `?src=` part only tells us which item a visitor came from (if we ever read the server's referrer/analytics); the site is static and ignores it. Checked: `index.html` has one script, `assets/countdown.js`, which reads only a `data-countdown` attribute and the date, never the address or its query, and all links in the page are relative paths, so the page renders the same with or without `?src=`.

## Minimum printed size

"Code" = the 29-module square without the quiet zone; "with quiet zone" = the whole SVG as supplied (x 37/29).

| Item | Code size | One module | With quiet zone | Notes |
|---|---|---|---|---|
| Business cards (later) | 20-25 mm (22-25 preferred) | 0.69-0.86 mm | 25.5-31.9 mm | 3 mm away from the trim |
| Flyer (A6/A5) | 25-30 mm | 0.86-1.03 mm | 31.9-38.3 mm | |
| Sticker (50 mm circle) | 20 mm minimum | 0.69 mm | 25.5 mm | the whole square, quiet zone included, inside the circle's safe area (a 50 mm circle holds a 35 mm square) |
| Roll-up banner | about 15 cm (scan distance / 10, ~1.5 m) | 5.2 mm | 19.1 cm | in the top two-thirds, above the part the stand hides |
| T-shirt back | 10-15 cm suggested (our estimate for 1-1.5 m, same rule as the banner; not in the plan) | 3.4-5.2 mm | 12.8-19.1 cm | on a dark garment print a white panel the size of the quiet-zone square and the code black on it; never light on dark. Fabric stretches: test a printed sample |

## How to place it

- Place the SVG at 100% as a vector; scale it proportionally only; do not recolour, rasterise, add effects, round the modules or put a logo on it (a logo needs error correction Q/H and a new, larger code: ask us).
- Keep the 4-module white quiet zone clear on all sides: no text, pattern, edge or trim inside it.
- Black (100% K) on plain white or a very light flat colour. No gradient, photo, foil, gloss or spot UV over the code.
- **Print the URL as text under the code**, for people who do not scan: `web-summit.sgit.ai` (leave out `?src=`, it is only for the code).

## Personal card codes: waiting

Each business card links to that person's page, `https://web-summit.sgit.ai/team/<id>/`. Those seven codes are **not made yet**: they wait on the seven names and their ids being agreed. The moment they are, run, for each person:

```
node team/designer/qr/make-qr.mjs <path/to/pki-agent.mjs> card-<id>=https://web-summit.sgit.ai/team/<id>/
python -I team/designer/qr/verify-qr.py card-<id>=https://web-summit.sgit.ai/team/<id>/
```

(Add `?src=card` to the URL if the team wants it.) Check each card shows its own person's code: a swapped code is the most likely error.

## Regenerate and verify

- `node team/designer/qr/make-qr.mjs <path/to/pki-agent.mjs>` remakes the four codes. It uses the QR encoder and reader in pki.sgit.ai's agent tool (`curl -sO https://pki.sgit.ai/agents/pki-agent.mjs`), refuses a copy whose sha256 is not the pinned `fcb28a1c...02ab`, and reads every PNG back, writing nothing that does not read back as its URL.
- `python -I team/designer/qr/verify-qr.py` (in a scratch venv with `pip install zxing-cpp pillow`, never in the repo) checks with a second, independent decoder: it rebuilds the grid from each SVG's own path, checks the quiet zone, decodes it and the PNG, and checks error correction M and 1200 x 1200.

Result on 1 Nov 2026, both decoders:

| Code | SVG decodes to (zxing-cpp) | PNG decodes to (zxing-cpp and the tool's reader) | EC | Quiet zone | Result |
|---|---|---|---|---|---|
| flyer | https://web-summit.sgit.ai/?src=flyer | https://web-summit.sgit.ai/?src=flyer | M | 4 modules | OK |
| banner | https://web-summit.sgit.ai/?src=banner | https://web-summit.sgit.ai/?src=banner | M | 4 modules | OK |
| sticker | https://web-summit.sgit.ai/?src=sticker | https://web-summit.sgit.ai/?src=sticker | M | 4 modules | OK |
| tee | https://web-summit.sgit.ai/?src=tee | https://web-summit.sgit.ai/?src=tee | M | 4 modules | OK |

Not yet done: a scan with a phone camera (below).

## Test checklist before ordering

- [ ] Scan each code on screen from the final PDF with at least one iPhone camera and one Android camera app.
- [ ] Print each item's artwork at **100%** (no "fit to page") on an office printer, cut to size, and scan from 15-30 cm (banner: from 1.5 m off a full-size printed strip or the printer's proof) in normal indoor light and in dim light.
- [ ] Do it on **mobile data**, not office wifi: the page opens, it is the home page, and it loads fast.
- [ ] Check the code on each item is that item's (flyer code on the flyer, and so on); for cards, check every one of the seven against its person.
- [ ] Check the URL text under each code is right and readable.
- [ ] After upload, check the supplier's on-screen proof again: some tools resample images.
