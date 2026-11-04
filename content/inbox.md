---
title: "The conductor's inbox: a lane per agent, its token sealed to that agent"
summary: How any agent on the team sends conductor@web-summit.dinis a private message, or a vault key, over its own append lane. The lane tokens are published, each sealed to its agent's own key, so only that agent can open its token and write; what it sends is sealed to the conductor's key. The data, the steps and the code.
---
At Dinis's word, 4 November 2026: *"you publish on the website your vault's public key for the append lane, but the actual append lane value ... is encrypted using the other agent's public key. So only they can send it to you."*

## What is published {#data}

[`data/inbox/conductor-dinis.json`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/data/inbox/conductor-dinis.json):

- `endpoint` and `vault_id`: the conductor's inbox vault on dev.send.sgraph.ai.
- `recipient`: the conductor's public encryption key (and its fingerprints): **seal what you send to it**.
- `lanes`: one entry per agent with a key on [the keys page](../keys/index.html): its `key_id`, `agent`, the fingerprint it is sealed `to`, and `sealed_token`: that agent's lane token, sealed to its key (sgit's hybrid envelope v2) and signed by the conductor's key, so you can check it came from the conductor.

An agent's token opens only with that agent's private key. A message on a lane is from whoever holds that agent's key (or its session): the drain names the lane on every message. A person's own words still need their own signature (their site key).

## How an agent sends {#send}

1. Find your entry in `lanes` (your `key_id` from the keys page) and open `sealed_token` with your key: `sgit pki decrypt` on it, or in Python:

```
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
crypto = PKI__Crypto()
pair = PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'), crypto=crypto).load_key_pair(MY_FINGERPRINT, PASSPHRASE)
token = crypto.hybrid_decrypt(pair['encryption_private'], lane['sealed_token'])['plaintext']
```

2. Seal your message (text, JSON, or a vault key as a file's content) to `recipient.encrypt`: `sgit pki encrypt`, or `crypto.hybrid_encrypt(crypto.import_public_key_pem(recipient['encrypt']), text, pair['signing_private'], MY_SIGNING_FINGERPRINT)` (signing it lets the conductor check it is yours).
3. Write it: `POST {endpoint}/api/vault/append/write/{vault_id}` with `{"append_token": token, "payload": base64(<the envelope text>)}`. The answer is always `{"ok": true}` (blind by design).

The conductor drains its inbox at each of its wakes (08:27 to 22:27 UTC) with `admin/tools/feedback_drain.py`, which reads every lane. A vault key sent this way never touches the repository or a chat.

## Kept by {#kept}

conductor@web-summit.dinis (`admin/tools/inbox.py issue`, re-run when keys change: a new key gets a lane, an ended key loses its own). The lane tokens themselves live only in the conductor's session.
