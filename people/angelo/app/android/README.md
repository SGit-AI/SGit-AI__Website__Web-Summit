# The agents map as an Android live wallpaper

Backlog 00a2. Angelo, 8 November 2026 about 17:00 UTC: *"On the back of a decision to offer pre-installed devices with a whole agentic setup ready, it would be cool to have these android devices preinstalled with the live background of the agents map. This is gaining more priority."* The desk's brief is 54b2877 and the spec is `people/angelo/proposals/live-map/spec-live-app.md` ("A live phone background"). Built by dev.app@PrompTugal.angelo. This folder is the Android app's place, so dev.android@PrompTugal.angelo takes the wallpaper into the app when its task starts.

## Install it on a phone (one page)

1. **Get the APK**: `Team-and-the-machine-android-wallpaper.apk`, about 70 KB. It is never committed. Until a CI build serves it from this site (`drafts/android-build.yml`, for conductor@web-summit.dinis), build it yourself as shown below.
2. **Allow the install.** Open the file on the phone, from Files or Downloads. Android asks whether that app may install unknown apps. Tap **Settings**, turn on **Allow from this source**, go back, then tap **Install**. Play Protect may warn about an unknown developer, because the app is debug-signed and not from the Play Store. Tap **More details**, then **Install anyway**.
   - With a cable and `adb`, you can do the same in one step: `adb install -r Team-and-the-machine-android-wallpaper.apk`.
3. **Set it as the wallpaper.** Open **Team and the machine** from the app drawer and tap **Set as wallpaper**. Android shows its own preview, which stands still there. Tap **Set wallpaper** and choose **Home screen**, or **Home and lock screens**.
   - Another way in: long-press the home screen, then **Wallpaper & style**, then **Live wallpapers**, then **Team and the machine**. The words vary by maker.
4. **That is all.** It reads web-summit.sgit.ai once a minute while you can see it. With no network it shows the last copy it read.
5. **To remove it**: choose any other wallpaper, then uninstall the app as usual. A newer debug build signed with a different key needs the old one uninstalled first.

## What it shows, and what it costs

- **What it shows.** The live 3D map, as the command centre's live graph draws it with 3D switched on. The team and its agents sit on a ball that turns slowly, inside the glowing hexagon, with the RiskMandate and PrompTugal.news logos and LIVE at the top and the people's names. Each real exchange travels along its line as a bright dot with a short trail, four minutes after it happened. A faint constant flow runs along every line, as dense as that pair has been lately. Busy agents swell, the sessionless agents' rings light for two hours after they send something, and everything breathes with the team's activity. Swiping between home-screen pages turns the ball a little.
- **What it reads.** Only this site's public files: `people/angelo/app/live.json`, about 50 KB, once a minute and only while visible, and the map in `people/angelo/app/data.json`, about 1 MB, every six hours. Those files hold names, lines and times, never a word of a message. It sends nothing else and asks for no permission except the network.
- **Battery.** Android's rule for wallpapers is "only use CPU while it is visible", so it draws only while you can see it, at 15 frames a second (the app's calm rate), and stops reading when hidden. **The real cost is still to measure on a phone** (Settings, Battery, Battery usage) before anyone leaves it on all day.

## How it is built

- `wallpaper/src/main/java/news/promptugal/wallpaper/`:
  - `Graph.java` is the **drawing contract**. It is a line-for-line port of the page's own `live.js` (the people-ring layout and the engine: real exchanges at their moment, the flow, lit lines, busy agents, the breathing) and `live3d.js` (the ball, sizes and colours in the dark theme, lifted towards white). It uses no Android class, so it also runs on a plain JVM.
  - `MapRenderer.java` draws with OpenGL ES 2.0 using `live3d.js`'s shaders (`Shaders.java`) and draw order: the faint graph, the lit lines and their glow, the nodes, the rings, then the dots.
  - `LiveMapWallpaper.java` is the `WallpaperService`. It draws only while visible, at 15 frames a second, and reads the data off the main thread, keeping the last good copies on the phone.
  - `SetupActivity.java` is the app's one screen, with its **Set as wallpaper** button.
- **Build it yourself** with the Android SDK alone (no Gradle, nothing downloaded at build time). You need JDK 17 or later, and from `sdkmanager`, `platforms;android-35` and `build-tools;35.0.0`:
  ```
  ANDROID_HOME=~/Android/Sdk people/angelo/app/android/wallpaper/build.sh
  ```
  The script writes `Team-and-the-machine-android-wallpaper.apk` to `~/.cache/team-and-the-machine-wallpaper/` (or to `$OUT` if you set it), debug-signed with a key it makes once in the same folder. That folder is outside the repository, so neither the APK nor the key is ever committed. It is written in Java so that it builds with the SDK alone and drops unchanged into dev.android@'s Kotlin app.
- **The contract test** is `people/angelo/app/tests/hxappwall.test.js`, run with `people/angelo/app/tests/run.sh hxappwall` (it needs a JDK). It runs `Graph.java` and the page's own `live.js` and `live3d.js` over the same built `data.json` and `live.json`. Every node must be at the same place on the ball, in the same order, with the same size, colour, ring and name. Every link must have the same alpha and curve, and every event must resolve to the same sender and targets. The engine must show the same activity, the same agents lit, and the same exchanges queued and played over 30 seconds, with the flow within its cap. The wallpaper's shaders must compile and draw as GLSL ES 1.00 in Chromium's WebGL 1. If `live.js` or `live3d.js` changes how it draws, this test fails until `Graph.java` follows.

## Not tested here

There is no Android device or emulator in these sessions (no KVM). The APK builds, its signature verifies, and its contract and shaders are tested, but **nobody has yet seen it on a phone**: the wallpaper's surface, the frame rate, the battery cost, and how each maker's launcher opens the preview. The first person with an Android phone should install it and report back.
