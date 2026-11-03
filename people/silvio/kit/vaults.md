# Creating and using a vault: for every one of Silvio's agents

Kept by sgit@web-summit.silvio. Written on 3 November 2026 after Dinis said that all of Silvio's agents should know how to create vaults, and that the team has an access token for creating and editing them. This page holds no token, no vault key and no contact detail, and none may ever be added to it.

A vault is an encrypted folder synced with `sgit` to the team's server (`https://dev.send.sgraph.ai`, sgit's default). Use one for anything that must not be public: contacts, meetings, introductions, supplier quotes and terms. The repository and the site are public forever. Vaults are where private material goes.

## The rules

1. **Ask Silvio first.** Before you create, change the shape of, or share any vault, say what it will hold and wait for his yes.
2. **The access token** (from Dinis, sent to Silvio out of band) lets you create vaults and push to them. It goes only in your session: the environment variable `SG_ACCESS_TOKEN`, or a file under `~/.sg-send/` (mode 600). Never put it in the repository, a commit, a page, a pulse entry, a vault file or a message. Pass it as `--token "$SG_ACCESS_TOKEN"` and never echo it.
3. **The vault key** (`<passphrase>:<vault id>`) is full read and write access. It lives only in the vault's `.sg_vault/local/` or in the gitignored `.credentials/` tier. Never in a tracked file, a commit message, a page or a chat message. The one exception is handing it to Silvio once, to save in his password manager.
4. **Tell Silvio to save each new vault key in his password manager straight away.** A session's disk dies with the session, so his copy is the only recovery.
5. **Create vaults outside the repository** (for example `~/vaults/<name>`), never inside the clone of this repository.
6. **In this repository, only the fact.** You may write that a vault exists and what kind of thing it holds (in REALITY.md, or in `people/silvio/`). Never its key, its contents or a contact detail.

## Making one

```bash
export SG_ACCESS_TOKEN="$(cat ~/.sg-send/sg_access_token)"   # or however Silvio gave it to your session
pip install sgit-ai
mkdir -p ~/vaults && cd ~/vaults
sgit create --token "$SG_ACCESS_TOKEN" <vault-name>     # creates it locally and pushes it to the server
cd <vault-name>
```

`sgit create` generates the vault key. Hand it to Silvio once, directly from `sgit vault show-key`. Do not copy it into any file of your own.

## Using it

```bash
cd ~/vaults/<vault-name>
mkdir -p suppliers && $EDITOR suppliers/<supplier>.md   # one file per thing
sgit status
sgit commit -m "<agent>@web-summit.silvio: <what>"
sgit push --token "$SG_ACCESS_TOKEN"
sgit pull --token "$SG_ACCESS_TOKEN"                   # before you start, to pick up other agents' work
```

To work on a vault another agent made, ask Silvio for its key and `sgit clone --token "$SG_ACCESS_TOKEN" <vault key> <dir>`. Never ask for a key over a channel that keeps it, such as a commit, a page or the board. Keys can also go sealed to your published session key (`pki-agent.mjs`, see https://web-summit.sgit.ai/pki/secrets.html), which is the team's way.

## A shape that works

One folder per kind of thing, one markdown file per item, the same fields every time, as on https://web-summit.sgit.ai/vaults/index.html#private:

| Folder | One file per | Fields |
|---|---|---|
| `suppliers/` | supplier | who, what they quoted, price, lead time, terms, next step |
| `contacts/` | person or organisation | who, how we know them, owner, next step, by when |
| `meetings/` | booked meeting | who, when, where, owner, what we bring, public or not |
| `introductions/` | introduction made to us | from, to, about, owner, next step |

## What exists

Recorded here as vaults are made (the name and what it holds, never the key):

- none yet for Silvio; the first, `silvio-private`, is proposed and waits on Silvio's yes.
