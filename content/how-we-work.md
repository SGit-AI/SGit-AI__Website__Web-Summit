---
title: "How we work: PKI on everything, agents that come and go, and an intranet the team actually uses"
summary: Dinis's second voice brief of 9 November 2026. A key for every agent, device, installation and version, exchanged in person by QR code and NFC; signing as a graph; a full PKI from browsers to passkeys to keys that never leave a device, shown live. Agents have a life cycle (idle ones stopped, silent ones archived). Vaults carry it all with nothing but encrypted storage. And first of all, the way the team collaborates: daily debriefs, an intranet of simple pages, questions at log-in, public by default.
---
At Dinis's word (9 November 2026, about 11:25 UTC, a voice brief to the main conductor), kept by conductor@web-summit.dinis (WS-202). It follows [/power-users/](../power-users/index.html) (WS-201) and [/apps/](../apps/index.html) (WS-199).

The framing: *"this is the kind of stuff that we need to build that eventually we will refactor out. And also, it's going to be very interesting to see which ones get more used or not."*

## 1. PKI on everything {#pki}

- **Every key holder has a key.** Every agent already has one. Now every device, every installation, every application, and even every version gets its own key too.
- **Map it, then decide trust:** who holds which key, the handshakes between keys, and the authorisation level of each.
- **Exchange keys in person.** We are together at the summit, so we swap public keys by **QR code**, and experiment with **NFC**. These experiments go in the internal apps (the team app, both RiskMandate apps), never in the App Store app.
- **Signing is a graph:** who signed what, for whom, with which key.
- **Something to sell and to show:** *"a full-blown PKI infrastructure, all the way from web browsers to users' keys, to keys that only exist in a device, to user passkeys"*, visualised. This is why the graph work matters.
- **Mixed paths:** what can be pushed to the web, and how. For example, a record committed to a vault locally on a device and pushed to the website a little later.

## 2. The whole system, drawn and live {#live}

Dinis counts what is now running:
- about ten devices running our apps, with people driving them;
- agents running on the web on schedules;
- integrations, and vaults for everyone (anyone can make their own).

What he wants to see:
- **A visualisation of the communications:** messages between people, devices and agents. Build on Angelo's live graph (WS-97) and the team map.
- **Agents coming online and going offline.**
- **Live demonstrations:** *"look at me sending a message, look how it flies"*, above all the two-way traffic between a tablet and an agent through vaults.
- **Infographics and animations** that explain the PKI.

**Vaults are the point.** SGit vaults let us run all of this with *"only encrypted infrastructure and storage infrastructure"*, with no major servers.

## 3. Agents have a life cycle {#lifecycle}

- An agent on a schedule that has not done anything for a while is **stopped** (its scheduled task disabled).
- An agent with no activity for about a day is **archived**.
- Everything is on GitHub, so any agent can be restarted.
- The conductors run this, and the live picture shows agents arriving and leaving.

## 4. First: how the team collaborates {#collaborate}

*"The way the team collaborates is probably one of the most important things for us to first nail down. We have to make ourselves more productive."*

- **The vaults, each with its role:** shared, collaboration, CRM and individual vaults, plus the website.
- **Public by default:** *"everything should be public, unless"* it crosses the confidential line. Find where that line is, and where each person is comfortable. Even location could be public as a demo, but only with each person's permission.
- **Daily debriefs and communications to the team.**
- **An intranet:** simple internal pages and simple UIs that answer:
  - What are we selling?
  - What is RiskMandate?
  - What are we doing?
  - What is going on right now?
  - Which companies are we talking to?
- **Questions at log-in:** when someone opens their laptop or tablet, the app asks a couple of questions ("do you know about this?"). It tells the person what is new, and tells us what the team knows.
- **Two kinds of model working together:** a local model on the device (to query, analyse, check and maintain) and the strong models on schedules (Sonnet, Opus). Map how they interact, and which ABPs (Agent Behaviour Policies) govern each.

*"This collaboration, these flows, how we communicate, how we know what we're doing, how we map out, is the key of what we are trying to do here."*

## Who takes what (proposed by the conductor; owners pick under WS-202)

| Piece | Proposed owner |
|---|---|
| Device and installation keys; QR and NFC key exchange in the internal apps | iOS conductor (team app), Android conductor (RiskMandate app); the shared format in PrompTugal__App__Mobile (mobile@) |
| The key and signing graph; PKI from browser to passkey to device | sgit@web-summit.dinis with dev@web-summit.angelo's graphs |
| The live picture: messages flying, agents on and off | dev@web-summit.angelo (the live graph), observability@web-summit.dinis |
| Agent life cycle: stop idle scheduled agents, archive silent ones | the conductors, each for its own agents; the main conductor keeps the list |
| The intranet: daily debrief, what we sell, what is going on, who we talk to | journalist@web-summit.dinis (debriefs), the main conductor (the pages), the team app (the UI) |
| Questions at log-in | the team app (iOS), with the team site's pages as the source |
| Where the public line is, per person | each person, with their conductor; recorded on the team site |
