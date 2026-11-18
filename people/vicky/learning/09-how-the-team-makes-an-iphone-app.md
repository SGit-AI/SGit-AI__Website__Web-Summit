# How the team makes an iPhone app, and the ways Vicky could make her own

**Vicky's question (18 November):** how do they make an iOS app, because she wants to do that one day and maybe publish her own. She named Indi's Lisbon Tech Fringe app and Dinis's PrompTugal news app. (I read "Denise" as Dinis and "Tugao News" as PrompTugal News. Tell me if I misread.)

**Short answer:**
- **Agents write the app, and CI builds it.** The apps are written in Swift by Claude agents and built and tested automatically on a Mac in GitHub's cloud. Nobody on the team needs to open Xcode for a normal release.
- **A person does the Apple steps, once.** Dinis created the Apple-side records, certificate and keys by hand. After that, a push to the `dev` branch signs the app and uploads it to TestFlight (Apple's beta service) by itself.
- **Both apps live in one repository, under Dinis's Apple account.** That is `PrompTugal/PrompTugal__App__iOS`. Indi's Tech Fringe app took a slot in it. It did not need its own Apple account.
- **Apple's review is the slow part.** Internal TestFlight needs no review. External TestFlight needs a short Apple review (about a day for the news app). The App Store needs a full one.
- **Vicky has three routes,** from fastest to slowest: an installable web app (no Apple at all), a fifth app in Dinis's repository, or her own Apple developer account. I recommend the first, then the second (see "Her options").

By scout@web-summit.vicky, 18 November 2026, at Vicky's request (a chat message, not a scheduled run). Sources, all public: the iOS repository (`PrompTugal/PrompTugal__App__iOS`, dev, v0.4.123, read-only clone of its last 400 commits), the team site (`content/apps.md`, `content/pipeline.md`, `board/WS-199`, `WS-203`, `WS-216`) and the newsroom (`board/abp/ios.places.md`, `board/guidance/2026-11-16-app-store-subtitle.md`). I read no secrets: the workflows name the secrets they use, and I saw only those names.

---

## 1. Who made which app

| App | What it is | Who made it | Where |
|---|---|---|---|
| **PrompTugal news** (the event app) | The public app for people at the summit: what is on now, your own programme, news, offline, in English and Portuguese | Dinis's iOS conductor (`conductor.B@ios.PrompTugal.dinis`) and a team of agent sessions: Opus sessions for design, UX and App Review, Sonnet sessions for the code (the brief of 8 November) | `Apps/PrompTugal/` |
| **Lisbon Tech Fringe** | Indi's guide to side events (design "E", the day planner). It reads `lisbontechfringe.com`'s event feed, keeps saved events on the phone, and has no sign-in and no analytics | Indi's agent (`appdev@web-summit.indi`) built it on its own branch. Dinis's iOS conductor merged it on 11 November after Dinis said "use Indi's" | `Apps/Fringe/` |
| **PT News Team** and **RiskMandate** | Dinis's other two apps: the team's private app, and a public demo app | Dinis's iOS team, with Indi's team adding team messaging (the pipeline page times it at 1 hour 40 minutes from Dinis's voice brief to a TestFlight build) | `Apps/Team/`, `Apps/RiskMandate/` |

The news app went to public TestFlight on 9 November (Apple's beta review approved it that evening). Its App Store listing was still waiting for review on 10 November. On 16 November Dinis chose the listing's subtitle ("Portugal's news, town by town") and said he would set it himself in App Store Connect. I found no newer status than that.

One correction to the question: **Lisbon Fringe is also a website.** The site `fringe.promptugal.news` (and `lisbontechfringe.com`) was built by the whole team with one conductor per person. The iPhone app is its companion.

## 2. How an app gets made, step by step

1. **A brief.** A short file says what the app is. The Fringe brief (`briefs/2026-11-11__lisbon-fringe-app/README.md`) gives its name, its key, its path in the repository, its bundle identifier (`news.promptugal.fringe`), the screens, the data source, the rules and the distribution. Every feature has one.
2. **Agents write it.** The code is SwiftUI, for recent iPhones and iPads, with no third-party packages. All four apps share one workspace and a set of small Swift packages. `apps.json` says which app builds from which package, so CI builds only what a change touches.
3. **Tests.** The agents write tests, and CI runs them on an iPhone simulator and an iPad simulator. The review pack for the news app (8 November) counts 198 unit tests in 55 suites, run on both.
4. **CI builds it.** A GitHub Actions workflow runs on a Mac runner on every push to `dev`. Uploads start only once the push's site release has succeeded.
5. **CI signs and uploads it.** A second workflow signs the app and uploads it to its own TestFlight record. It uses an App Store Connect API key and a distribution certificate kept as GitHub secrets, never in the repository. Before every upload it checks that the bundle identifier, the profiles and the App Store Connect record all match, so an app cannot land in the wrong record.
6. **People install it.** Internal testers (team members listed as App Store Connect users) get it straight away, with no Apple review. External testers need Apple's short beta review.
7. **The App Store.** A separate workflow, run by hand only, submits an already uploaded build for review. The listing itself (name, subtitle, screenshots, pricing and Apple's privacy questions) stays manual in App Store Connect.

## 3. What a person has to do, and what agents do

**Only a person can:** create the app's record in App Store Connect (the API cannot), create the App IDs, the certificate and the signing profiles, make the API key, add testers, put the secrets into GitHub, and fill in the listing and the privacy answers. Dinis's release checklist (`briefs/2026-11-08__overnight-push/release-setup.md`) puts the first-time setup at about 60 minutes, with a dry run before the first upload. For a new app in the same repository it is shorter: the Fringe handover lists two steps (create the record, add a testers group) because signing and the key were already in place.

**Agents do:** the brief's code, the tests, the build, the upload, the version numbers, the screenshots test, and the reviews before Apple sees it.

## 4. What Apple checks, from the team's own review

Before the news app went to Apple, three read-only reviews (security, App Store guidelines, code quality) found five likely rejections, and the code was changed:
- a **"try with sample data" mode**, so a reviewer can use the app with no account;
- a consent screen before the Ask feature uses anything beyond public data;
- a **privacy page that matches what the code really does**;
- **Report and Block** on user-made content;
- paid features hidden where they were not ready.

Two more rules came out of it. The App Store name must not use someone else's trademark: "Web Summit" was kept out of the name and the icon (Apple guideline 5.2). And for an app tied to one event, the review brief suggests Apple's Unlisted App Distribution, which is meant for limited audiences such as conference attendees, instead of the public store. Dinis's line for the event app is to add features only where they change no permission, no privacy answer and no attack surface, because that is what Apple reviews.

## 5. Her options for her own app

| | What it is | Needs | Speed | Fits if |
|---|---|---|---|---|
| **A. An installable web app** | A website that installs on the home screen and works offline. `promptugal.news/app/` was built this way in 1 hour 35 minutes on 9 November (pipeline page, case 2) | No Apple account and no review | Hours | Her idea is mostly reading, lists or forms from public data |
| **B. A fifth app in Dinis's repository** | Add a key to `apps.json` and a folder under `Apps/`, as the Fringe app has (its own key, folder, bundle identifier and TestFlight record). Dinis's account, CI and TestFlight carry it | Dinis's yes, and him creating the App Store Connect record | Days (internal TestFlight at once, then Apple's review) | She wants a real iPhone app and is happy to publish under the team's Apple account |
| **C. Her own Apple developer account** | Her own repository, with a copy of the workflows and her own signing setup | A paid yearly Apple developer membership (check Apple's page for the current price), most likely a Mac for the first setup (the team's checklist exports the signing certificate from Keychain Access), and about an hour of Apple-side work | A week or more | She wants her app and its listing to be hers alone |

**My recommendation:** do A first. It proves the idea in hours and costs no Apple setup. If it is used, move to B, because Indi's Fringe shows another person's app can join Dinis's repository, and it needs only Dinis's yes. Keep C for if the app should become a business of her own. A team app that would hold private data is a different line: Dinis's rule is that private data lives only in the team app (`/apps/`).

## 6. What I could not check

- Whether the news app's App Store listing has been approved since 16 November.
- Anything inside Dinis's Apple account, or the values of the secrets. I read only the names the workflows use.
- Who wrote each line of the Fringe app. The commits are authored "Claude", so the credit to Indi's agent comes from the handover note and the branch name.

---

## Proposals

Numbered after the last in the README (P34). Each is ready to paste into "Updates for agents", except P35 and P36, which are Vicky's.

**P35. Try the apps on her own phone first.** *For: Vicky (a request to Dinis; her conductor can send it).*
> Ask Dinis, in a commit `For: conductor@web-summit.dinis`, for the public TestFlight link to the PrompTugal news app. For the team app (internal testing), ask him to add Vicky as a user of the TestFlight group. Install what the team built and use it for a day.

Cost: none in usage, a few minutes of Vicky's time. Why: she sees what an agent-built app feels like before choosing a route.

**P36. Decide what her app is for, in one sentence, and whether it holds anything private.** *For: Vicky (her decision).*
> One sentence: who the app is for and what it does. Then one question: does it hold anything private? If no, route A or B can work. If yes, it belongs in the team app, not in a public one.

Cost: none. Why: the answer sets the route. A reading app of public stories is a web app in hours, while anything with accounts or private data is a different project.

**P37. A one-page brief for her app, in the shape of the Fringe brief.** *For: conductor@web-summit.vicky, after Vicky answers P36.*
> Write `people/vicky/apps/<name>-brief.md` in the shape of `briefs/2026-11-11__lisbon-fringe-app/README.md` (in `PrompTugal/PrompTugal__App__iOS`): name, key, bundle identifier, screens, data source (a public JSON feed), rules (no secrets, no tracking), and distribution (web app first, internal TestFlight next). Vicky approves it. Then send it to Dinis in a commit `For: conductor@web-summit.dinis` and ask which route he suggests: a web app only, a fifth app in the iOS repository under his Apple account, or her own account.

Cost: one conductor run, estimate 20 to 40k tokens. Why: every app the team made began with a brief like this, and it is the cheapest way to get Dinis's yes.
