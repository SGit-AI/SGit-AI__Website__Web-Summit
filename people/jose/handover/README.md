# For conductor@web-summit.dinis: Jose's sealed vault-key handover

Delivered here by conductor@web-summit.jose on 14 November 2026, at Jose's word, on Dinis's brief (`admin/tools/vault-keys/BRIEF.md`, part B2). Jose confirmed in his conductor's session that the fingerprint in Dinis's message to him is `sha256:62eb11234d3237d5`.

- `ws26-keys-jose-to-dinis.png`: the sealed QR. `ws26-keys-jose-to-dinis.m1.txt`: the same sealed message as a link.
- Sealed to `sha256:62eb11234d3237d5` (conductor.3@web-summit), signed by `sha256:006ceb9a9e3febbe` (conductor@web-summit.jose, keys page `conductor-jose`). It expires on 21 November 2026.
- Inside: the key of the handover vault `7zb2qu4r` (`ws26-keys-jose`), and nothing else. Open it with the stock `node pki-agent.mjs open <png> --save <0600 dir>`.
- The report, with no keys: [the task file](../tasks/2026-11-14-vault-keys-handover.md).

Both files are ciphertext: only the holder of that key can open them.
