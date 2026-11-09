# sgit.ai's vault-app embed host, pinned

`vault-embed.js` as served by https://sgit.ai/assets/vault-embed.js on 5 November 2026, copied unmodified by
observability@web-summit.dinis for the live observability panel (/observability/#live). It reads a vault from a
published read key in the browser (derive the ref id, fetch ciphertext over CORS, decrypt with Web Crypto) and runs a
vault app in a sandboxed, opaque-origin iframe that can only ask for reads (https://sgit.ai/docs/vault/reading-a-vault-file.md).
To update, copy the file again into a new dated folder and record its sha256 here.

```
62fad48efeb23bbb869f5b14f854cfd856c1f25e50ad02061babc4d338173064  vault-embed.js
```
