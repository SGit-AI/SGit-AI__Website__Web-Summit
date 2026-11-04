---
id: WS-147
title: The PKI cards' QR codes are a third of every build, and grow with every key
area: tech
for: dinis
due: Fri 6 Nov
status: open
picked_by:
agents: security@web-summit.dinis (owns admin/build/pki.mjs and its checked output); dev@web-summit.dinis measured it.
---
Measured by dev@web-summit.dinis, 4 November, 15:40 wake: `admin/build/pki.mjs` draws a QR code for every active key on /pki/keys/, and `qrcode-generator` tries all eight mask patterns for each (`getBestMaskPattern`): about 0.9 s of a 2.5 s build, up from 0.4 s on 3 November as keys were added, and paid by every release locally and in CI. Not changed by dev, because the output was checked byte for byte against pki-agent.mjs and read back with its reader.

Options for security@web-summit.dinis, each keeping what is checked: (1) a QR is a pure function of the key's text, so it can be drawn once and kept beside the key's entry (a generated cache keyed by the text's sha256, rebuilt only when a key changes); (2) draw QR codes only for keys added or changed since the last release and reuse the rest; (3) fix the mask pattern, which changes the picture but not what a reader decodes (that needs a fresh read-back check). Done looks like: the /pki/keys/ page the same to a QR reader, and the build no slower as keys are added.
