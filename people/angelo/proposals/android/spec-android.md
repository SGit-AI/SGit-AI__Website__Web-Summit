---
title: "An Android app for PrompTugal.news, in line with Dinis's iOS app"
by: dev@PrompTugal.angelo
written: 2026-11-07
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo
issue: f4e401e0 (the desk's brief)
status: for review. Nothing is built, created or scheduled before Angelo approves.
---
## What and why

Angelo, 7 November about 15:00 UTC (f4e401e0, pushed from riskmandate-angelo): *"we need a developer agent taking on designing, proposing a plan and then building the Android app for the Promptugal news site, in line with the work Dinis did for the iOS app."*

## 1. What Dinis's iOS app is

Read only, on 7 November: [PrompTugal/PrompTugal__App__iOS](https://github.com/PrompTugal/PrompTugal__App__iOS) (Apache-2.0), its README, its design briefs (`briefs/2026-11-07__native-vs-web/`) and its product site [ios.app.promptugal.news](https://ios.app.promptugal.news). Nothing was asked of anyone.

**What it is.** "SwiftUI beta for iPhone and iPad", version 0.3.1, internal beta, submitted to the App Store by Dinis (the newsroom's investors deck, 1e92d46a there). It has only Apple frameworks and no third-party packages, and targets iOS and iPadOS 18.

**What it does today:**

| Area | What it does |
|---|---|
| **The websites** | Opens promptugal.news, the team site and the other sites from a `Websites.json` list in a sidebar. Each site keeps its page and its Back history. Same-site HTTPS stays in the app; other hosts open in the browser. The list can be edited on the device. |
| **The offline reader** | Native tabs: Now, Agenda, Saved, News. They are built from the newsroom's public feeds (`/api/v1/live/agenda.json`, `/api/v1/events/{id}.json`, `feed.xml`), cached on the device, with every time in Lisbon time. |
| **Built since 0.3.1 or on its way** (`website/features.json`, 25 features) | One schedule (the website's `nr.schedule.v1` as the app's format), a bridge between site and app, reminders, the vault on the phone (a Swift vault reader, `Packages/SGitVault`) with Face ID, Ask with the reader's own key, a reading-meter top-up (StoreKit), team dashboards, "where is everyone", debug panels. |

**How it is built and released:**
- **Layout:** Xcode, one folder per feature (`PrompTugal/<Feature>/`).
- **CI on macOS runners:**
  - `ios.yml` builds and tests on every push to `dev`;
  - `ios-release.yml` builds the archives and `.ipa`;
  - `ios-submit.yml`, `ios-vault.yml` and `screens.yml` handle submission, the vault and screenshots;
  - `website.yml` builds the product site from `website/` (Python).
- **Testers:** TestFlight, internal then external.

**Its rule, which an Android app should share** (brief 02): *"The app should not rebuild any of them. It should add what a browser cannot do"*. That means alerts, the Home and Lock Screen, keys held by the device, background sync and capture, all through one small bridge. Nothing the website already does is rewritten in native code, except the vault reader. Dinis's decisions (brief 08, D1 to D7) include:
- `nr.schedule.v1` as the one schedule format;
- a shared passkey salt;
- a native vault reader;
- the key behind the device's biometrics;
- top-ups through the store;
- team features in the same app.

## 2. The Android app, "in line with" it

**The same product:** the same sites and sidebar, the same offline reader, then the same roadmap (brief 07's four phases), the same look (the newsroom's brand and the iOS app's icons), and the same rule. Android differs only where the platform does: Material components where iOS uses SF Symbols, Android's notifications, widgets and credentials.

### The approach: three options

| | Native Kotlin and Jetpack Compose | A Trusted Web Activity over promptugal.news | Shared with the iOS app |
|---|---|---|---|
| **What it is** | An app with WebViews for the sites, a native reader, then a bridge, as the iOS app is built | Chrome showing promptugal.news full screen as an app. The site already has a manifest, a service worker and an offline mode (d5df77e6 there). | One codebase for both: Kotlin Multiplatform, Flutter or React Native |
| **The iOS app's features** | All of them, one by one, on the same plan | One site only; no sidebar; no bridge (a TWA cannot inject one); no native reader, widgets or vault | All, but the iOS app would be rewritten |
| **Time to a first beta** | A day or two for the shell and the reader | Hours | Weeks |
| **Fits Dinis's decisions** | Yes: native, the same layers, the same formats | No: "native is the point" (brief 08) | No: the iOS app is native Swift and its decisions are taken |

**I recommend native Kotlin and Compose.** The two apps share **contracts, not code**:
- `Websites.json`;
- `nr.schedule.v1`;
- the newsroom's `/api/v1/` feeds;
- the bridge's `pt.*` operation names (brief 05);
- the sgit vault format, checked with the same fixtures as `Packages/SGitVault`.

A TWA is not needed: the first native beta is close behind it, and it would be thrown away.

**The stack:**
- Kotlin 2 with Jetpack Compose and Material 3.
- Minimum Android 8.0 (API 26), the widest reach for nine phones. The passkey and vault features check at runtime for what they need.
- The sites in `WebView`, one profile each where the phone's WebView supports it (androidx.webkit's multi-profile API, on recent WebView versions; checked at runtime), a shared profile otherwise.
- Kotlin coroutines; no third-party network library.
- **Later phases:** WorkManager for refresh, Jetpack Glance for widgets, Credential Manager for passkeys, and the Android Keystore for keys.
- The bundle id is `news.promptugal.reader`, as on iOS.

### What we can build and test here, and what we cannot

- **In an agent's session:**
  - Java 21 and Gradle are installed, and Google's SDK and Maven repositories are reachable (checked 7 November).
  - The agent installs the Android command-line tools and SDK into its session, builds the APK and runs the JVM unit tests (with Robolectric for the views).
  - **No emulator:** the session has no KVM.
- **In CI (GitHub Actions, Ubuntu runners):**
  - builds the APK on every push;
  - runs the unit tests;
  - runs instrumented tests on an emulator (Linux runners have KVM);
  - takes screenshots at a phone and a tablet size, as the iOS app's `screens.yml` does;
  - attaches the debug APK to each run.
- **On a real phone:** a person installs the APK. The agent cannot.

### What needs a person or money (tier 3, Angelo's)

1. **A repository**, for example `PrompTugal/PrompTugal__App__Android` (Apache-2.0, beside the iOS app).
   - Creating it is Angelo's go. He is in the PrompTugal organisation's admins.
   - Telling Dinis is a courtesy the desk can carry: it is his organisation and his iOS app.
   - The alternative is a repository in Angelo's own account.
2. **The signing key**, for release builds. It is made once and kept only as a CI secret, never in a file, a page or a message.
   - Debug builds need no key.
   - Who holds the key, and where, is Angelo's choice.
3. **Distribution of the internal beta:**
   - **(a)** A signed APK on the repository's releases page, installed by each of the team on their phone ("install unknown apps"). It is free and today.
   - **(b)** Google Play's internal testing. It needs a Google Play developer account (a one-time fee and an identity check), then a few hours of Play's processing.
   - **I recommend (a) for the summit and (b) after it.**
4. **Later, for parity:**
   - the Digital Asset Links file on promptugal.news (`/.well-known/assetlinks.json`) for links and passkeys. It is a newsroom change, For: dev@PrompTugal.dinis.
   - Play's billing for the reading meter, mirroring D6.

## 3. The plan, to an internal beta before Monday 9 November

Each step is small, built and tested before the next.

1. **Angelo:** approves the spec, creates the repository (or names one), chooses the distribution, and creates dev.android@'s scheduled task.
2. **The shell** (run 1 or 2):
   - Gradle project and CI (APK, unit tests).
   - `Websites.json` from the iOS app, the same file and format, with credit.
   - A drawer of the sites, one WebView each with its own Back history.
   - The same link policy: same-site HTTPS stays, other hosts open in the browser, only https, http, mailto and tel.
3. **The offline reader:**
   - Now, Agenda, Saved and News from the same three feeds, in Lisbon time.
   - A cache in the app's files, refreshed when the app opens.
   - Saved kept as `nr.schedule.v1`.
4. **The beta:**
   - a signed APK on the releases page (step 3(a) of section 2);
   - emulator screenshots in CI;
   - a one-page "how to install" for the team.
5. **After the beta,** the iOS roadmap's phases, in its order:
   - the bridge (`pt.*`), one schedule shared with the website, reminders and a "now and next" widget;
   - the vault reader (a Kotlin port of `SGitVault`, tested against its fixtures) with biometric unlock;
   - capture and the Lock Screen;
   - Play's internal track.

## 4. The agent: dev.android@PrompTugal.angelo

As the other dotted workers (`people/angelo/proposals/new-agents/spec-new-agents.md`):
- a fresh session each run, the shared no-secrets environment, no connectors and no key;
- the stronger model;
- every two hours at :10 (cron `10 */2 * * *`);
- in this repository it pushes only to `workers/dev.android`, its STATE and reports, which dev@PrompTugal.angelo reviews and brings onto dev;
- in the app's repository it pushes to `dev` behind that repository's CI. `main` is protected and merged only by Angelo, for a release.

**Its agents.json entry:**

```json
{ "name": "dev.android@PrompTugal.angelo", "job": "builds the Android app for PrompTugal.news in line with Dinis's iOS app (people/angelo/proposals/android/spec-android.md); dev@PrompTugal.angelo reviews its reports", "session": "a fresh Claude Code cloud session for every run, started by a scheduled task in Angelo's account; the shared no-secrets environment; no key", "schedule": "every two hours at :10 (cron 10 */2 * * *), a new session each run" }
```

**Its scheduled prompt**, after the shared preamble of the new-agents spec (`{NAME}` = dev.android@PrompTugal.angelo, `{SHORT}` = dev.android, `{REVIEWER}` = dev@PrompTugal.angelo). STATE: `people/angelo/android/STATE.md`.

```
Your job: the Android app for PrompTugal.news, as people/angelo/proposals/android/spec-android.md says, once Angelo has approved it (its status line says "approved") and its repository exists (the spec names it); until then, read it and note questions in your STATE. Read Dinis's iOS app read-only (PrompTugal/PrompTugal__App__iOS: its README and briefs/) for what the app does, and keep in line with it: the same sites, reader, formats (Websites.json, nr.schedule.v1, /api/v1/ feeds, the pt.* bridge) and roadmap; share contracts, never copy Swift. Take the next step of the spec's plan. In the app's repository, push to dev only, with its CI green (APK built, unit tests, emulator tests); main is Angelo's. Install the Android SDK into your session for builds and JVM tests; there is no emulator here, so CI runs those. Never put a signing key, keystore or password in a file, a commit, a page or a message; release signing uses the CI secret Angelo sets. Record each step in your STATE with the commit and the CI run, and what a person must do (install, test on a phone).
```

## Out of scope

- Publishing on Google Play before Angelo's choice and account (tier 3).
- Rewriting what the website already does (the iOS rule).
- Any change to the iOS app or its repository: read only.
- Any change on promptugal.news, until a phase needs one (Digital Asset Links). That is then a change For: dev@PrompTugal.dinis under the five steps.

## The data, and who may see it

- **Public:** the app and its code (Apache-2.0, as the iOS app); the newsroom's public feeds, which it reads.
- **On the device only:** the reader's saved picks, its cache and, later, the vault key behind biometrics. Nothing about a reader is sent anywhere by the app, as on iOS.
- **Secret, CI only:** the release signing key. It is never in a repository.

## Risks

- **Monday is close.** The shell and the reader are small and independent. Whatever is ready by Sunday ships as the internal beta, and the rest follows the plan.
- **No emulator in a session.** CI runs the emulator tests and screenshots; a person tests on a real phone before the beta goes to the team.
- **Drift from iOS.** Shared contracts, and the same fixtures for the vault reader. dev.android@ reads the iOS repository's changes at each run.
- **Sideloaded APKs.** Each person turns on "install unknown apps" once. Play's internal track removes that after the summit.
- **A second app in Dinis's organisation.** The desk tells Dinis before the repository is made (tier 3, Angelo's go).

## How we will know it works

- CI is green on every push: the APK, the unit tests, and the emulator tests with screenshots at phone and tablet sizes.
- On a real phone:
  - the drawer opens every site from `Websites.json`, each with its own Back history;
  - other hosts open in the browser;
  - the reader works offline after one online open;
  - Saved survives a restart;
  - times are in Lisbon time.
- The team has the beta installed before Monday, or the STATE says exactly what is missing.
