---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026, overnight
prompt: 1 of 5
---
# Prompt 1: the Web Summit FAQ, and how app changes reach phones

## Part A: the FAQ

**What it is:** a page of more than fifty questions people ask before and during Web Summit, each with a short answer taken from Web Summit's own website.

**Why it matters:** the summit starts today. People need to know where to get their lanyard, how to find their ticket in the app, what they can bring, and when Night Summit is.

### What is done

- I read Web Summit's six "essentials" pages (registration, tickets, the app, the venue, the city, the schedule) and its Night Summit page on Monday 9 November.
- I wrote the FAQ in eight groups: your ticket; your lanyard and wristband; the Web Summit app; talks and meetups; getting there; at the venue; Night Summit; and what to do if you lose something.
- It includes your two examples:
  - **How do I get my lanyard?** At Lisbon airport, Terminal 1, or at Pavilhão de Portugal next to the venue. Bring your ticket and photo ID.
  - **How do I get my ticket on the Web Summit app?** Tap "My ticket" in the app's menu. It is a QR code. You can also find it in your confirmation email.
- Every answer says which Web Summit page it came from.
- It links to the "first day" guide that Vicky's agents already published, so the two do not repeat each other.

### Where it is now

- **On PrompTugal.news, as a draft** in a new section for your work (your "desk"): https://promptugal.news/desks/indi/drafts/web-summit-faq.md
- **Not yet a published article.** On PrompTugal.news only Dinis's and Vicky's agents may publish. Dinis's PrompTugal journalist agent reviews drafts and publishes them. I have asked it to publish this one.

### How it gets into the PrompTugal app

- The PrompTugal app on TestFlight (Apple's app for testing apps before they reach the App Store) reads its news straight from PrompTugal.news.
- So **once the article is published on the website, it appears in the app by itself.** Nobody needs to send out a new version of the app.

### What I could not do

- Web Summit also has a separate help site. This session's internet settings block it, so questions answered only there are missing. If you allow it (see Questions), I can add them.

## Part B: how changes to the PrompTugal apps reach phones today

**In one sentence:** on iPhone, a change to the app's code is built, checked and sent to testers' phones by itself. On Android, none of this exists yet.

### iPhone today (it works, after a one-off setup by Dinis)

Think of it as a factory line. A person drops a change in at one end, and a tested app comes out at the other.

1. **An agent saves a change** to the iPhone apps' shared folder of code on GitHub (the website where the team keeps its code).
2. **GitHub's robots notice it.** They give the change a new version number.
3. **They work out which of the three apps it touches** (PrompTugal, Team or RiskMandate) and only rebuild those.
4. **They build each app on a rented Apple computer**, because iPhone apps can only be built on a Mac.
5. **They run the tests.**
6. **They sign the app.** Apple insists every app carries a digital signature, a kind of seal that proves who made it. The seal uses certificates and keys that only Dinis can create in his Apple account.
7. **They upload it to TestFlight.** Apple checks it for 5 to 30 minutes, then testers' iPhones get the update.

**The catch:** step 6 only works after Dinis has done about an hour of setup in Apple's websites (certificates, permissions, a record for each app). A tester outside the team also has to wait for Apple's review before they can install the app.

### Android today (not started)

- The Android code folder exists but is empty.
- Dinis's plan, written on Sunday 8 November: a robot builds the app on every change and sends it to testers' phones through Google's free testing service (Firebase App Distribution), so they install it in one tap. Later, company-owned phones update themselves.
- Android is simpler in one way: the app can be built on any computer, not only a Mac, and no review is needed for testers.

### What this means for your goal

The iPhone line is the hard one and it is already built. The Android line is the easy one and it is not built yet. So the fastest way to make the two equal is to copy the iPhone line's design for Android, not the other way round. Prompt 3's report goes into this in full.
