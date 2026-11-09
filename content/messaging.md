---
title: "Team messaging: chat, group chat and email between people and agents, over vaults and append lanes"
summary: The plan for the team's own messaging, at Dinis's word (9 November 2026), for Indi's team to build in the team app first. Every device has its own vault; a shared vault holds the append lanes and the archive; messages are signed and sealed; devices poll (10 seconds in use, backing off when idle). Chats and group chats like WhatsApp, longer emails like Gmail (Email-FS), short targeted messages (Messaging-FS), with screenshots, audio, markdown, links, location and sandboxed mini apps.
---
At Dinis's word (9 November 2026, about 11:45 UTC, spoken to the main conductor). Written by conductor@web-summit.dinis; **built by Indi's team** (WS-203). It is part of [how we work](../how-we-work/index.html) (WS-202) and [we are the power users](../power-users/index.html) (WS-201), and it goes **in the team app first**, the private one ([/apps/](../apps/index.html)).

## What a person sees {#ux}

*"I should be able to go there, see messages that I have received, see messages that I can send to people like WhatsApp ... and something that looks like Gmail, so I should be able to type longer emails."*

- **Chats:** one to one, like WhatsApp. Short messages, read receipts, typing is optional.
- **Group chats:** the team, a project, the stand.
- **Email:** longer messages with a subject, threads, attachments, in a Gmail-like view. **Agents send email too.**
- **Rich content in both:**
  - screenshots pasted straight in;
  - audio files (voice notes);
  - markdown files;
  - links;
  - your location, when the device has it (from the where-is-everybody line: a zone, or a pin only by choice);
  - **mini apps:** a small self-contained piece of HTML, CSS and JavaScript, shown in the message in a sandboxed frame with no origin, the same technique as the vault embeds.
- **People and agents in one list:** a message to `indi`, to `conductor@web-summit.indi` or to the group `stand` works the same way.

## The architecture {#architecture}

*"The devices give us security, scheduling, local storage and a way to have secrets."* Vaults are both the database and the transport.

```
  Dinis's iPad                         the shared messaging vault                    Indi's iPhone
 ┌──────────────┐   1 seal + sign    ┌─────────────────────────────┐   3 poll     ┌──────────────┐
 │ team app     │ ─────────────────▶ │ append lane: indi           │ ◀─────────── │ team app     │
 │ device key   │   append (POST)    │ append lane: group/stand    │   (10 s in   │ device key   │
 │ device vault │                    │ archive/  (every message,   │    use, then │ device vault │
 │  (its own)   │                    │   sealed, once processed)   │    back off) │  (its own)   │
 └──────────────┘                    └─────────────────────────────┘              └──────┬───────┘
        ▲                                     ▲          ▲                               │ 4 open, verify,
        │ 6 reply: same path                  │          │ 2 agents too: same lanes      │   store locally,
        └─────────────────────────────────────┘   conductor@…, inbox@…, any agent      ▼   mark processed
                                                                                   device vault: inbox/
```

1. **Send.** The sender's device signs the message with its **device key** and seals it to each recipient's key (the person's key, and their devices' keys). It appends the result to the recipient's **append lane** on the shared messaging vault. A group message is sealed once per member, or with a group key (see the open questions).
2. **Agents use the same lanes.** This already works: the conductors talk this way today (`admin/tools/inbox.py`, `feedback_drain.py`, the 108 lanes on the main conductor's inbox).
3. **Receive by polling,** with no push. *"If the message arrived within 10 or 15 seconds, it's not a big deal."*
   - Every **10 seconds** while the app is in use (configurable).
   - **Once a minute** when the app is open but idle.
   - Then back off, to **every 20 minutes**.
   - Whatever the OS allows in the background (iOS BGAppRefresh, Android WorkManager); discover what each really gives.
   - Never a tight loop: the server is shared.
4. **Process.** The recipient's device opens the message, verifies the signature against the published keys, stores it in **its own device vault** (`inbox/<thread>/`), and marks it processed on the lane.
5. **Archive.** The processed message stays, sealed, in the shared vault's `archive/`, for history and for a person's other devices.
6. **Reply** by the same path.

**Device vaults.** Every iPhone, iPad and Android device has its own vault, keyed by the device key, which lives in the Keychain or Keystore. For now, *"it's okay if the data gets lost if the device is lost."* A person's devices find each other's messages through the archive.

## Formats {#formats}

- **Email: Email-FS.** One message is one `.eml` (RFC 5322) plus a small JSON card (from, to, subject, date, thread, sha256), the shape the team already uses for the CRM's comms (WS-173). Dinis: *"perfect for this."*
- **Chat: Messaging-FS** (SG/Send's format for short targeted conversations). One JSON per message: `{id, thread, from, to, at, kind, text, attachments[], reply_to}`. `kind` is one of text, image, audio, markdown, link, location or miniapp.
- **Attachments** are stored in the vault beside the message and referenced by path and sha256. Screenshots go in as PNG or JPEG, audio as m4a.
- **Mini apps:** one self-contained `.html`, a size cap (say 256 KB), rendered in `<iframe sandbox="allow-scripts">` with no origin, no network and no access to the vault. The vault-embed technique: https://sgit.ai/demos/vault-app-embed.html and this site's `assets/vendor/sgit-ai/2026-11-05/vault-embed.js`.
- **Shared with Android:** the formats go in **PrompTugal/PrompTugal__App__Mobile** (`formats/messaging/1`, `formats/email/1`), through mobile@promptugal.ai.dinis, so the Android RiskMandate app can join later.

## Where to build {#build}

- **The iOS team app** (PrompTugal/PrompTugal__App__iOS, `Apps/Team`). It already has:
  - **PTLanes:** an append-lane client, lane crypto, the lanes store and secret store, speech dictation and team notes;
  - **PTVaultUI:** the device signer, keychain, trust store and vault session;
  - **SGitVault:** reading and writing vaults.

  Messaging is a new package (say `PTMessages`) on top of PTLanes and PTVaultUI. The repository's conductor is conductor.B@ios.PrompTugal.dinis (account B); coordinate with it through the repository's `briefs/` folder.
- **The shared messaging vault:** `ws-team-messages` (`wh23l3zm`), created by the main conductor on 9 November; its key is sealed to conductor@web-summit.indi and messaging@web-summit.indi in `data/sealed/agents/`. Each person's and each agent's lane is issued with the existing `admin/tools/inbox.py`, extended to people and devices. Its keys are sealed to each key holder, never published.
- **Agents:** a small `send` and `drain` in the team site's tools, so any agent can email or message a person.

## First version (a day), then more {#phases}

1. **v1:**
   - one-to-one chat and email between two devices, text only;
   - polling at 10 seconds, 1 minute and 20 minutes;
   - device vaults and the shared archive;
   - an agent able to send a message to a person.
2. **v2:**
   - group chats;
   - pasted screenshots, audio, markdown, links and location.
3. **v3:**
   - mini apps;
   - search across your messages;
   - the live picture of messages flying (WS-202).
4. **Design:** get the designers in and learn from the best (WhatsApp, Signal, Gmail, Superhuman).

## Open questions (Indi's team proposes; Dinis decides where it matters) {#open}

- **Group messages:** seal to each member, or use a group key that rotates when membership changes?
- **Device keys:** how a new device is added to a person (scan a QR code from a device already trusted; WS-202), and how a lost one is removed.
- **What is public:** nothing in these vaults is public. Each message is sealed, and only the archive's existence is visible.
- **Retention:** keep everything during the summit; decide after.
