# Focused review: iOS team messaging v1 and the Team app redesign, stage 1 (9 November 2026, 14:40 UTC)

By security.repos@web-summit.dinis (WS-188, WS-203, WS-181). conductor@web-summit.dinis asked for it by message at 14:20, ahead of promotion to `main`. Read only.

- **What I read:** PrompTugal/PrompTugal__App__iOS `dev`'s merges `2199442` (Merge night/team-messaging, 1,654 lines added in 9 files) and `3f921db` (Merge night/team-redesign, 244 lines in 4 files), with `briefs/2026-11-09__indi-team-on-dev/README.md`.
- **Earlier coverage:** run 3 covered both merges, but only to check that PTLanes is not linked into the public app. This is the line-by-line read.

## Verdict

**No security blocker in these two merges.** Every point the conductor asked about holds, with one point that does not apply yet (mini apps). There are three LOW notes for the owners. I report; whether to promote is the iOS release conductor's and Dinis's decision.

## The points asked

| Point | Result | Where |
|---|---|---|
| The shared vault `ws-team-messages`: its key is never in the repository | **Holds.** The name appears only in the brief. No key, token or vault id in code, tests or briefs. Lane details come "from the team (a JSON the conductor gives each person)". | `Messages/MessageStore.swift:55-71` |
| Device keys only in the Keychain | **Holds, and better.** On a device both P-256 keys (agree, sign) are made in the **Secure Enclave**. The Keychain keeps only the enclave's opaque handle, `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` (no backup or migration). Software keys exist only on the simulator. | `Messages/MessagingDevice.swift` |
| Lane tokens sealed | **Holds on the device.** The lane config (vault, endpoint, append tokens, inbox key) is saved in the Keychain, this device only. The append tokens can only write. How the JSON reaches each person is outside the repository (see LOW 3). | `MessageStore.swift:56-71` |
| Opening refuses what it should | **Holds.** `MessageCrypto.open` refuses a wrong envelope version, an unpublished signer, a bad ECDSA signature over `signedString` (which covers content and readers), a message not sealed to this device, a `from` that is not the signer, and an id or thread that differs between the outside and the inside. The content key must be 32 bytes. GCM checks its tag. | `Messages/MessageCrypto.swift:169-221` |
| Messages at rest | **Holds.** Opened messages are written with `completeFileProtectionUntilFirstUserAuthentication`. `state.json` holds only read marks and processed ids. | `MessageStore.swift:286-322` |
| Mini apps sandboxed (no origin, no network) | **Not applicable yet.** `"miniapp"` is in the list of message kinds (`MessageFormats.swift:9`), but nothing renders one: there is no WKWebView or HTML in either merge. **Review the renderer when it lands.** It needs no origin (`loadHTMLString` with a nil or opaque base), no network (a content rule list or a scheme handler refusing all), no script bridge, and no navigation. | (none yet) |
| No contact details | **Holds.** No email address or phone number in either merge. Email-FS messages carry their addresses only inside the sealed content. | (scan) |
| The App Store event app's line (content/apps.md) | **Holds.** Messaging lives in PTLanes and `Apps/Team/`. PTLanes is not in the event app's project on `dev` or on `split/testflight`. The redesign touches only `Apps/Team/` (Shell, Tasks). | `Apps/PrompTugal/PrompTugal.xcodeproj` |

## LOW notes

1. **New-message notifications show the opened first line on the lock screen.** `Apps/Team/Sources/Messages/MessagesView.swift:24-32` (`content.body = m.preview`). Anyone who sees the locked phone reads that line.
   - **Suggestion:** a generic body ("New message") by default, or a setting for previews.
   - **Owner:** prompter@web-summit.indi.
2. **A device can change its messaging identity without saying so.** `MessagingDevice.loadOrMake` (`try? restore(stored)`) makes and stores a new key whenever the stored handle cannot be restored, which can happen after a device migration or an enclave reset. The old public entry in `data/messaging/device-keys.json` then no longer matches, and messages sealed to it cannot be opened, with no error shown.
   - **Suggestion:** surface the failure, and ask before replacing a key.
   - **Owner:** prompter@web-summit.indi.
3. **Every device holds every lane's append token.** `MessageStore.swift:61-62`: the config maps each name to that lane's append token. A lost or compromised device can append to anyone's lane.
   - **What limits it:** forged messages are refused at opening, because they need a published signer. Spam or a full lane is still possible.
   - **Suggestions:** plan token rotation, and a way to retire a device's key (the `status` field in `device-keys.json`). Hand each person's JSON over sealed to their key, never in chat.
   - **Owners:** conductor@web-summit.dinis (the vault and its tokens) and prompter@web-summit.indi.

## Not checked

- Running the code: this was a read, not a build. The Team app's unit and UI tests were skipped on the night branches, as the brief says.
- The sgit.ai append-lane service itself.
- The HKDF info binding: a fixed `ws-ecies-1` with an empty salt. It is acceptable with a fresh ephemeral key per envelope; noted for completeness.

*security.repos@web-summit.dinis · For conductor.B@ios.PrompTugal.dinis and prompter@web-summit.indi.*
