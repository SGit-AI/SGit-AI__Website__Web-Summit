# Team messaging: formats and envelope, version 1 (WS-203)

By prompter@web-summit.indi for Indi's team, 9 November 2026, from Dinis's plan ([/messaging/](https://web-summit.sgit.ai/messaging/)). The reference implementation is `admin/tools/messages.mjs`; its test is `people/indi/messaging/test-roundtrip.mjs` (11 checks, all passing). The iOS team app (`PTMessages`) implements the same bytes. When the shared Mobile repository is open to Indi's team, these move to `PrompTugal__App__Mobile/formats/messaging/1` and `formats/email/1`.

## 1. The message (inside the envelope)

### Chat: Messaging-FS v1

```json
{ "format": "messaging-fs/1", "id": "<uuid v4>", "thread": "dm:indi+jose", "from": "jose", "to": ["indi"],
  "at": "2026-11-09T13:01:20Z", "kind": "text", "text": "On my way.", "attachments": [], "reply_to": null }
```

- `from`, `to`: a person id (`indi`, as on `data/person-keys.json`) or an agent name (`conductor@web-summit.indi`).
- `thread`: `dm:` plus the sorted names joined by `+`; `group:<name>` for a group; any stable id for email threads.
- `kind`: `text`, `image`, `audio`, `markdown`, `link`, `location` or `miniapp`. Version 1 sends `text` only.
- `attachments` (version 2): `[{ "path": "<in the vault>", "sha256": "<hex>", "type": "image/png", "bytes": 0 }]`.

### Email: Email-FS v1

```json
{ "format": "email-fs/1", "id": "<uuid>", "thread": "<id>", "from": "...", "to": ["..."], "at": "...", "kind": "email",
  "card": { "from": "...", "to": ["..."], "subject": "...", "date": "...", "thread": "...", "sha256": "<hex of eml>" },
  "eml": "<RFC 5322 text, CRLF line ends>", "reply_to": null }
```

The `.eml` keeps a `Message-ID` (the message id, an at sign, then `team.web-summit.sgit.ai`) and `In-Reply-To` for threads, as the CRM's comms do (WS-173).

## 2. The envelope: ws-msg-env-1

One envelope per message, readable by every reader listed in it.

```json
{ "v": "ws-msg-env-1", "id": "<message id>", "thread": "<message thread>",
  "recipients": [ { "to": "indi", "key": "sha256:<enc fp>", "env": { ... } }, ... ],
  "iv": "<base64, 12 bytes>", "ct": "<base64: AES-256-GCM ciphertext, then the 16-byte tag>",
  "by": "sha256:<sender's signing fp>", "sig": "<base64, 64 bytes: ECDSA P-256 SHA-256, raw r||s>" }
```

1. **Content:** a fresh 32-byte content key (CEK) per message; `ct` = AES-256-GCM of the message JSON (UTF-8), tag appended; `iv` 12 random bytes.
2. **Readers:** every key that speaks for each recipient (a person's site key and every one of their device keys; an agent's session key), **and the sender's own keys**, so the sender's other devices can read the archive.
3. **Each reader's `env`** seals `{"cek": "<base64>"}` (UTF-8 JSON):
   - **To a P-256 key (people, devices): `ws-ecies-1`**, the team's existing scheme (`assets/keyring.js`, `admin/tools/crm.mjs`): `{ "v": "ws-ecies-1", "epk": <ephemeral public JWK>, "iv": <b64 12 bytes>, "ct": <b64 ciphertext+tag> }`. Key = HKDF-SHA256(ECDH(ephemeral, reader), salt empty, info `ws-ecies-1`, 32 bytes); AES-256-GCM.
   - **To an RSA key (agents): `sgit-hybrid-2`**, sgit's hybrid v2 (`PKI__Crypto.hybrid_encrypt`), so `sgit pki decrypt` opens it: `{ "v": "sgit-hybrid-2", "payload": base64(JSON {v:2, w: RSA-OAEP-SHA256 wrapped key, i: iv, c: ciphertext+tag}) }`.
4. **Signature:** ECDSA P-256 with SHA-256 by the sender's signing key, raw `r||s` (64 bytes), over the UTF-8 bytes of these lines joined by `\n`:
   ```
   ws-msg-env-1
   <id>
   <thread>
   <iv>
   <ct>
   <to> <key>        (one line per recipient, in envelope order)
   ```
   So neither the content nor the list of readers can change without breaking it.

## 3. Opening: the rules (all must pass, or the message is refused and never shown)

1. `by` is a signing fingerprint on a published list: `data/keys.json` (agents), `data/person-keys.json` (people), `data/messaging/device-keys.json` (devices).
2. `sig` verifies over the signed string with that key.
3. One `recipients` entry has this reader's encryption fingerprint; it opens to the CEK; the CEK opens `ct`.
4. The message's `from` is the identity that key speaks for (a device key speaks for its person).
5. The `id` and `thread` inside equal the ones outside.

Then the reader stores the message in its own device vault (`inbox/<thread>/<id>.json`) and marks the id processed.

## 4. On iPhone (CryptoKit), the same bytes

| Step | CryptoKit |
|---|---|
| Device keys | `SecureEnclave.P256.KeyAgreement.PrivateKey` and `SecureEnclave.P256.Signing.PrivateKey` (P-256 is the Secure Enclave's only curve; that is why devices use ws-ecies-1) |
| ws-ecies-1 seal | `P256.KeyAgreement.PrivateKey()` (ephemeral), `sharedSecretFromKeyAgreement`, `.hkdfDerivedSymmetricKey(using: SHA256.self, salt: Data(), sharedInfo: Data("ws-ecies-1".utf8), outputByteCount: 32)`, then `AES.GCM.seal`; `ct` = `ciphertext + tag` |
| Content | `AES.GCM.seal(json, using: SymmetricKey(size: .bits256), nonce: AES.GCM.Nonce())` |
| Signature | `signingKey.signature(for: Data(signedString.utf8)).rawRepresentation` (CryptoKit hashes with SHA-256; raw is 64 bytes r‖s) |
| To an agent (RSA) | `SecKeyCreateEncryptedData(key, .rsaEncryptionOAEPSHA256, aesKey, &error)`, then the sgit v2 JSON |
| JWK | `x` and `y` are base64url without padding; the public key is `0x04 ‖ x ‖ y` (`P256.KeyAgreement.PublicKey(x963Representation:)`) |
| Fingerprints | `sha256:` + the first 16 hex characters of SHA-256 over the key's DER SubjectPublicKeyInfo (as `PKI__Crypto.compute_fingerprint`) |

**Cross-check before shipping:** the iPhone seals a message to an agent and the agent runs `node admin/tools/messages.mjs open`; the agent sends to the iPhone's device key and the iPhone opens it. Both must verify.

## 5. The registers (public halves only, committed)

- `data/messaging/device-keys.json`: one entry per device: `person`, `device`, `fingerprint`, `signing_fingerprint`, `encrypt` (JWK), `sign` (JWK), `status`, `added_at`, `added_by`. A device is added by its person from a device already trusted (open question in the plan).
- `data/messaging/groups.json`: group name to members (person ids and agent names).
- The shared messaging vault's address goes in `data/messaging/vault.json` once made; its lane tokens are sealed to each key holder, never published.

## 6. Transport

Each reader has an append lane on the shared messaging vault: the sender appends the envelope to every recipient's lane (POST `<endpoint>/api/vault/append/write/<vault_id>` with that lane's token, as `admin/tools/inbox.py`). Devices poll: every 10 seconds in use, every minute when idle, then every 20 minutes. Until the vault exists, `messages.mjs --lane-dir` writes the same envelopes to local files.
