#!/usr/bin/env bash
# Builds the live wallpaper's APK with the Android SDK alone (no Gradle, no download at build time), debug-signed.
#   ANDROID_HOME=<sdk> people/angelo/app/android/wallpaper/build.sh   -> $OUT/Team-and-the-machine-android-wallpaper.apk
# Needs: JDK 17+, and in the SDK: platforms;android-35 and build-tools;35.0.0 (sdkmanager installs both).
# Everything it writes goes to $OUT, outside the repository (default ~/.cache/team-and-the-machine-wallpaper), so the APK and
# the debug key, made once per machine there, are never committed, and the site's gate never sees build files in the tree.
# By dev.app@PrompTugal.angelo, 8 November 2026 (backlog 00a2).
set -euo pipefail
cd "$(dirname "$0")"
SDK=${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}; [ -n "$SDK" ] || { echo "set ANDROID_HOME to the Android SDK"; exit 2; }
BT="$SDK/build-tools/${BUILD_TOOLS:-35.0.0}"; JAR="$SDK/platforms/${PLATFORM:-android-35}/android.jar"
[ -x "$BT/aapt2" ] && [ -f "$JAR" ] || { echo "missing build-tools 35.0.0 or platforms;android-35 in $SDK"; exit 2; }
OUT=${OUT:-${XDG_CACHE_HOME:-$HOME/.cache}/team-and-the-machine-wallpaper}; mkdir -p "$OUT"; rm -rf "$OUT/res" "$OUT/gen" "$OUT/classes" "$OUT/dex" "$OUT"/*.apk; mkdir -p "$OUT/res" "$OUT/gen" "$OUT/classes" "$OUT/dex"
"$BT/aapt2" compile --dir src/main/res -o "$OUT/res/res.zip"
"$BT/aapt2" link -o "$OUT/unsigned.apk" -I "$JAR" --manifest src/main/AndroidManifest.xml -A src/main/assets --java "$OUT/gen" "$OUT/res/res.zip" --auto-add-overlay
javac -source 11 -target 11 -Xlint:-options -encoding UTF-8 -classpath "$JAR" -d "$OUT/classes" $(find src/main/java "$OUT/gen" -name '*.java')
"$BT/d8" --release --min-api 26 --lib "$JAR" --output "$OUT/dex" $(find "$OUT/classes" -name '*.class')
cp "$OUT/unsigned.apk" "$OUT/with-dex.apk"; (cd "$OUT/dex" && zip -q -j ../with-dex.apk classes.dex)
"$BT/zipalign" -f -p 4 "$OUT/with-dex.apk" "$OUT/aligned.apk"
KS="$OUT/debug.keystore"
[ -f "$KS" ] || keytool -genkeypair -keystore "$KS" -storepass android -keypass android -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US" >/dev/null 2>&1
"$BT/apksigner" sign --ks "$KS" --ks-pass pass:android --key-pass pass:android --out "$OUT/Team-and-the-machine-android-wallpaper.apk" "$OUT/aligned.apk"
"$BT/apksigner" verify "$OUT/Team-and-the-machine-android-wallpaper.apk"
rm -f "$OUT/unsigned.apk" "$OUT/with-dex.apk" "$OUT/aligned.apk" "$OUT"/*.idsig
ls -l "$OUT/Team-and-the-machine-android-wallpaper.apk"
