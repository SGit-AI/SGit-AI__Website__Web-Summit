# content/vault-agent.md, first time through: what was wrong or unclear

By vault@web-summit.vicky, 3 November 2026, for sgit@web-summit.dinis, so the page can be corrected before Angelo, Jose and Silvio follow it. Run in a Claude Code cloud session in Vicky's account, with sgit 0.27.0, Node 22 and Python 3.13. The result: Vicky's first public vault, `k64ma7jd`, with a README and an audit note, and its read key in `people/vicky/vaults.json`.

## Wrong, and it cost something

1. **`sgit vault info` prints the vault's passphrase in clear.** Step 3 tells the agent to run it. In 0.27.0 it hides the "Vault key" line but prints `Passphrase:` in clear, and the passphrase with the vault id *is* the vault key. Its "Web URL" line also carries a key in the fragment. I ran it, so my first vault's key went into this session's transcript (not into any file, commit or page). I deleted that vault from the server (`sgit vault delete-on-remote --yes`, vault `752mduh1`, README only) and made a new one. **Fix:** remove `sgit vault info` from step 3, or say "never run it where the output is logged". Use `sgit status` to check that it is in sync, and take the vault id from `sgit create`'s `Vault ID:` line.
2. **`sgit create` prints the vault key and the read key to stdout.** The page says "give it to your person for their password manager", and the prompt says "never print a vault key". An agent cannot do both. What I did: `umask 077; sgit create <name> --token "$SG_SEND_ACCESS_TOKEN" > ~/.sg-send/private/create.out 2>&1`, then `grep -E "Vault ID|Pushed"` on that file, then I deleted it. The key stays only in `~/vaults/<name>/.sg_vault/local/vault_key`. **Fix:** put that command line in step 3.
3. **There is no route for the vault key to reach the person.** The key is now only in this session's container, and the container is reclaimed when the session ends. Vicky cannot put it in a password manager or in `SG_VAULT_KEY_<NAME>` without someone showing it to them, and no step does that. People have no key of their own on the keys page (`people/<id>/key.json` is empty for everyone), so `seal.mjs` cannot seal to a person. **Fix:** add a step "hand the vault key to your person". It could seal the key to the person's own key (they make one in the pki.sgit.ai browser app, shown as a QR code), or seal it to their conductor and open it there. The step must run *before the session ends*, otherwise the vault can only be read and never written again.

## Wrong commands or versions

4. **The version.** The page says sgit 0.21. `pip install sgit-ai` installed 0.27.0.
5. **`sgit doctor --json` outside a vault** fails with "no server to check". `sgit doctor --base-url …` is rejected because `--base-url` is a global flag. What works is `sgit --base-url https://dev.send.sgraph.ai doctor --json`. Even then it skips the token check ("no token configured"), and `/api/info` gives a "warn" that is harmless. **Fix:** use that command, and run `sgit doctor --json` again inside the vault after `sgit create`.
6. **`sgit dev derive-keys "$SG_VAULT_KEY_MY_NOTES"` has two problems.**
   (a) For a vault you just made, nobody has set that variable yet (see 3). I read the key from `.sg_vault/local/vault_key`. That puts the key on the command line, where the process list can see it.
   (b) The command prints `read_key:` as 64 bare hex characters, with no `sgit_public_read_` prefix, and it also prints `write_key:` next to it. I parsed the output in Python, took only the `read_key` line, added the prefix and wrote it into `vaults.json`, without showing it. **Fix:** say that the output must not be shown (it includes the write key), and give a parse-and-write snippet.
7. **The audit: reading every commit.** `sgit history log --patch` and `sgit history show <commit>` show content only for *modified* files. An added file appears as `+ path (N bytes)` with no content, so an audit built on them misses every new file. The second audit found this. `sgit grep -n --text -e '' <commit>` prints every line of every file at that revision. `sgit cat` cannot read an older revision, and a bare `sgit history` is not a command (use `sgit history log`). **Fix:** name `sgit grep -n --text -e '' <commit>`, run for each commit from `sgit history log`, in step 4.1.

## Unclear

8. **Getting pki-agent.mjs.** The page does not say where to put it. `seal.mjs` expects `~/.sg-send/tools/pki-agent.mjs` (or `$PKI_AGENT`), with sha256 `fcb28a1c…`. The copy served on 3 November matched.
9. **The keys page entry.** Neither page says how to build the `bundle` from `keygen --session`. I built it from `public_key.pem`, `signing_public.pem` and `metadata.json` in `~/.sg-send/keys/<fp>/`, as `{v:1, encrypt, sign, label, fingerprint, signing_fingerprint}`. **Fix:** give the snippet, or a `pki-agent.mjs` command that prints the public bundle.
10. **`sgit create` already pushes.** Its output says "Pushed 0 commit(s)", and the first real push is the one that reports "uploading vault structure". So "a vault does not exist on the server until its first push" means the first `sgit push` after a commit.
11. **The repository and the branch.** In this session the repository was already cloned, on a session branch, not on `dev`. The agent has to run `git checkout dev` before `release.sh`, which refuses any other branch.
12. **`people/vicky/agents.json`.** The page says the conductor adds the vault agent there. Until it does, `vault@web-summit.vicky` is not listed. I left it for conductor@web-summit.vicky.

## Step 5, the vault app: what I learned building one

13. **Read the guidance first:** [sgit.ai/docs/guidance](https://sgit.ai/docs/guidance/index.md). It changes the build:
    - Use a file manifest built before each commit, not a runtime walk of the vault.
    - Raw content is always one click away.
    - Put `versions/index.json` and one file per version in the vault, each naming its commit, with the version number in the top bar linking to it.
    - Use `"hud": {"mode": "minimal"}`.
    - Never assign `location.hash`.
    - Say in the README why each permission is granted.

    Step 5 links these pages, but should say to read them before writing any code.
14. **Bridge quirks**, from the published POC vault `xth1xt78`, `_docs/02-gotchas.md`:
    - `sg.vfs.list` needs an absolute path.
    - `sg.vfs.readText` failed with a leading slash in some builds.
    - Dotfiles are not tracked, so `.vault/app.json` cannot be pushed with sgit. Use the root `app.json`.
15. **`crypto.subtle` may be missing** in a frame that is not a secure context. The app carries a pure-JS SHA-256 fallback.
16. **Live, the host refuses a write with `EREADONLY`** on a read-only open, before the app's grant is checked (`EPERM`). On 3 November the real bridge exposed `sg.app, append, auth, fs, git, history (log, list, read, readText, readBlob), llm, loadCss, loadJs, on, off, state (get, set, remove, clear, keys), sync, ui, vault, vfs`.
17. **A version file cannot name its own commit.** Commit the app, then write that commit's id into `versions/vX.json` and commit again.

## What worked as written

The token in `SG_SEND_ACCESS_TOKEN` worked. Network access to `dev.send.sgraph.ai` worked. `sgit commit` and `sgit push` worked. The build refused anything but a `sgit_public_read_` key, and the gate passed. Cloning with the published read key gave the files, and `sgit push` from that clone was refused ("cloned read-only").
