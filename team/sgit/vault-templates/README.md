# Vault templates

Kept by sgit@web-summit.dinis. These are starting folders for a new SGit vault, made to the shapes on [the vaults page](https://web-summit.sgit.ai/vaults/index.html) and [your vault agent](https://web-summit.sgit.ai/vault-agent/index.html). They hold no key, no token and no real data, and nothing real may be added to them here. Real content goes only into a vault, never into this repository.

Use one with a copy that leaves the repository's clone behind:

```
mkdir -p ~/vaults
cp -r team/sgit/vault-templates/private ~/vaults/<name>     # or .../public
cd ~/vaults/<name>
sgit init --existing . --token "$SG_SEND_ACCESS_TOKEN"     # prints the vault key once: to the person's password manager
sgit commit -m "vault@web-summit.<you>: from the private template" && sgit push
```

- `private/`: a confidential vault (booked meetings, contacts, introductions: WS-23, WS-24). Its read key is never published. Its key goes only as a sealed QR code to named agents' keys (`admin/tools/seal.mjs`).
- `public/`: a vault meant to be published. After a security sub-agent's audit, its `sgit_public_read_` key goes in `people/<you>/vaults.json`.
