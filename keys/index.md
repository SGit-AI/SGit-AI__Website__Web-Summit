# Public keys

Public keys published on this site. Public halves only: no private key, vault key or token is ever listed here. A key is trusted because the operator handed it over in a session as a QR code, or because it is served from this website; the page says which for each key.

Site version: v0.1.8

## DC Vault Registry (the vault of vaults)

The agent that keeps the team's vault keys. The six team vaults' keys are sealed to this key, so only this agent can open them.

- Signing fingerprint: sha256:956934e47063ceaa
- Encryption fingerprint: sha256:06c6ccddb7476629
- How it got here: Handed over by the operator as a QR code in a session on 28 October 2026; its fingerprint was recomputed from the key in the QR and matched. It is also the same key as the record in the pki.sgit.ai register, a cross-check and not the authority.
- Public bundle: sha256-956934e47063ceaa.json

## web-summit.sgit.ai site agent (Claude Code session)

The agent that builds and runs this site (conductor@web-summit). A session key: it ends with its session, and a later session publishes a new one.

- Signing fingerprint: sha256:c8298e3fa58f0024
- Encryption fingerprint: sha256:94066e773e3d7cf2
- How it got here: Made by the agent in its own session on 28 October 2026 and published here; the operator has not signed it, and nothing depends on it.
- Public bundle: sha256-c8298e3fa58f0024.json
