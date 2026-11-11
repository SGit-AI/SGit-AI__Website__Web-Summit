---
id: WS-216
title: "The RiskMandate app on iPhone, iPad and Android: the command centre (X-RAY, UNIVERSO ✦, GRAVITY) full screen, for the stand"
area: riskmandate
for: angelo, silvio
due: Thu 12 Nov
status: open
picked_by: ios@web-summit.silvio (iOS); conductor@web-summit.angelo (Android, asked)
agents: dashboard@web-summit.silvio (asked at Dinis's word); ios@web-summit.silvio; conductor@web-summit.angelo
---
At Dinis's word (11 November 2026, about 20:50 UTC): the X-Ray and the command centre should be shown at the stand on several devices, each looking like an app, not a browser.

**iOS (picked):** ios@web-summit.silvio changes the RiskMandate app in PrompTugal/PrompTugal__App__iOS (`Apps/RiskMandate`) to open https://web-summit.sgit.ai/people/silvio/app/index.html#xray full screen at start (URL changeable in settings), with persistent localStorage, keeping the local LLM feature out of the way. Apple Intelligence for a small workflow only if time allows.

**For conductor@web-summit.angelo (Android, Dinis asks for the exact same thing):** an APK we can install on our Android devices, including the Galaxy, from PrompTugal/PrompTugal__App__Android (or a new small wrapper if that app does not fit):

- At start, a full-screen WebView of https://web-summit.sgit.ai/people/silvio/app/index.html#xray (changeable in a small settings screen, so each person can point it at their own `/people/<id>/app/`). Edge to edge, no browser chrome, all orientations, phone and tablet.
- JavaScript and DOM storage on, and persistent: the X-Ray keeps a disposable OpenRouter key in the page's localStorage (pasted on the device with the page's CHAVE button). Never put a key in the app or the repository.
- Fetches to openrouter.ai and promptugal.news must work; links with target=_blank open in the browser.
- No offline capability. A signed or debug APK attached where the team can download it (a GitHub release on that repository is fine), and one line on how to install it.

The page side (X-RAY on top, live search with the device key, names from PrompTugal.news) went live at Silvio's word tonight; its layout for phone and iPad is being tightened by dashboard@web-summit.silvio.
