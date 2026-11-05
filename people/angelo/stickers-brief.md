---
title: "Stickers, round 2: Angelo's brief, for ChatGPT and for Claude"
summary: Angelo's ideas for the Web Summit stickers (5 November 2026), at Dinis's ask, as two briefs ready to paste. Stickers that say what RiskMandate is about in plain words, readable from a few metres away; and QR stickers with the RiskMandate mark at the centre, pointing to our meet pages.
---
**At Dinis's ask, 5 November 2026:** *"Can you give all your ideas to one of your agents and ask for a brief for ChatGPT and one for Claude."* Angelo's ideas, from his note to the team the same day, written up by conductor@web-summit.angelo. The current stickers and the vote: [/stickers/](../../stickers/index.html).

## What Angelo saw {#problem}

1. **Generic words.** Most of the funny set says *pass*, *mandate*, *authorised*, *verified* ("AGENT PASS", "MANDATE APPROVED", "ONE OF THESE HAS A MANDATE"). To someone who has never heard of RiskMandate they say nothing, so they don't make anyone stop.
2. **Too detailed to read in passing.** The creative set has a lot of fine detail; on a laptop lid two metres away it reads as texture, and it looks like generic AI art.
3. **Missing: a QR sticker.** Something small to stick around the venue and on the back of our phones, so anyone intrigued gets to us in one scan.

## The rules for every sticker {#rules}

- **Plain words a stranger gets in two seconds.** Start from what people already know (an AI agent with access to their inbox, calendar, card or company systems), then a twist. No *mandate*, *reach*, *pass*, *authorised*, *verified*, *ABP*.
- **It leaves a question** we can answer in one sentence at the stand.
- **Readable at two metres:** at most eight words, big type, one image, flat colour, thick shapes; no fine detail, no gradients, no photo-realism.
- **On brand:** the colours of riskmandate.ai/brand (ink #161615, warm white #F7F6F2, green #1A7F5A; gold #B45309 only as a small accent); the RiskMandate mark only as supplied, never redrawn by an image model. The green robot can stay, simple and flat.
- **Print:** die-cut vinyl, matt; 2 mm bleed; text at least 7 pt and 2.5 mm inside the cut.

## The ideas, as candidates {#ideas}

| # | Sticker | Words on it | The question it leaves |
|---|---|---|---|
| 1 | A phone-style permission pop-up, the robot waiting politely | **Allow AI agent to:** ☑ read your calendar ☑ draft emails ☐ wire €50,000 ☐ delete production | "Do agents really ask?" |
| 2 | Hand-lettered, on a tram-ticket shape | **Ask me what my AI isn't allowed to do.** | (an invitation) |
| 3 | A big keyring, one key tagged | **I gave my AI agent the keys. Not ALL the keys.** | "Which ones?" |
| 4 | The robot with a sticky note on its forehead, "please be careful", beside a locked door | **It's not the prompt. It's the permissions.** | "So prompts don't work?" |
| 5 | A sardine tin of tiny robots | **47 AI agents in this tin. Do you know what each one can open?** | Our core question, in plain words |
| 6 | Tram 28, the robot driving, the rails drawn bold | **Even trams stay on the rails. Do your agents?** | "What are the rails?" |
| 7 | The robot holding keys (already on the shirts and cards) | **Your AI has access. Does it have permission?** | The team's line, everywhere |

## The QR stickers {#qr}

- **Two kinds:** one per person, pointing to `https://web-summit.sgit.ai/meet/<id>/` (for the back of our phones: angelo, dinis, indi, jose, nimay, silvio, vicky); and one generic, pointing to `https://web-summit.sgit.ai/meet/` (to stick around, as Dinis chose for the garments).
- **The QR must be generated exactly, by code, never drawn by an image model** (image models make QR codes that don't scan). Error correction level H, so the mark can sit at the centre; the mark covering at most a fifth of the code's width, on a warm-white rounded square; a quiet zone of four modules; dark modules ink #161615 on white.
- **Size:** at least 30 mm for the code itself (40 mm with the frame); a round or rounded-square die-cut.
- **Words:** one short line under or around it: **Scan me: how we control our agents** (generic), or **Meet <name>: ask me how I control my agents** (per person).
- **Test before print:** every code scanned with an iPhone and an Android phone, at 30 cm and at 1 m, and the URL checked.

## The brief for ChatGPT (image model) {#chatgpt}

Paste once per sticker, replacing the bracketed parts with one row of the table above.

```
Design a laptop sticker for RiskMandate, a company that makes AI agents safe by giving each one clear permissions and checking them. It must make a stranger at a tech conference stop and read it from two metres away.

Concept: [the picture from the table]. Text, exactly as written, nothing else: "[the words from the table]".

Style: flat vector illustration, bold simple shapes, thick outlines, at most four flat colours: ink #161615, warm white #F7F6F2, green #1A7F5A, and a small accent of gold #B45309. No gradients, no textures, no fine detail, no photo-realism, no tiny background elements, no extra text, no logos. A friendly, simple green robot if a character is needed. The text is large, clear, and spelled exactly as given. Composition: one central image, the text big at the top or bottom, generous margins, a clean die-cut shape ([round / square / landscape 2:1]).

Do not draw any logo or QR code: leave them out.
```

## The brief for Claude (print-ready SVG) {#claude}

```
You are making print-ready laptop stickers for RiskMandate (Web Summit Lisbon, 9 to 12 November 2026), in the repository SGit-AI/SGit-AI__Website__Web-Summit (branch dev). Read people/angelo/stickers-brief.md (this brief, with the rules and the candidates), content/stickers.md (the current stickers and the print rules) and team/designer/print/concepts-rm/brand/SOURCE.md (the RiskMandate mark, used only as supplied).

Make, as SVG with every letter outlined, a CutContour cut line on its own layer (<g id="cutline">, a magenta hairline), 2 mm bleed, and a PNG proof of each:

1. The QR stickers: seven per-person codes to https://web-summit.sgit.ai/meet/<id>/ (angelo, dinis, indi, jose, nimay, silvio, vicky) and one generic code to https://web-summit.sgit.ai/meet/. Generate each QR with admin/build/vendor/qrcode-generator-2.0.4.mjs at error correction level H; put riskmandate-mark.svg, as supplied, at the centre on a warm-white rounded square covering at most a fifth of the code's width; a quiet zone of four modules; the code at least 30 mm, the sticker 40 mm; the line under it as in the brief. Decode every code you make (for example with a QR decoder in the browser) and check it returns exactly its URL; list the results.
2. Clean vector versions of the candidates the team picks from the table (flat, at most four colours, readable at two metres, the words exactly as given).

Keep everything in people/angelo/stickers/ until the team chooses; then propose it to designer@web-summit.indi, who owns the stickers. Commit with the convention and release with admin/tools/release.sh.
```

## Who does what {#who}

- **The stickers** are designer@web-summit.indi's (the files) and Dinis's (the vote and the order, WS-155, WS-167). These briefs are for them, and for Dinis to paste.
- **The QR stickers** can be made by any agent with the Claude brief; dev@web-summit.angelo can make them in `people/angelo/stickers/` if Dinis or Indi want that.
