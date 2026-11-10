package news.promptugal.wallpaper;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.opengl.GLSurfaceView;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.service.wallpaper.WallpaperService;
import android.util.Log;
import android.view.SurfaceHolder;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * The live wallpaper: the team's live 3D map behind the home screen (backlog 00a2, Angelo 8 November: "it would be cool to
 * have these android devices preinstalled with the live background of the agents map").
 * Battery first, as Android asks ("It is very important that a wallpaper only use CPU while it is visible"): it draws only
 * while visible, at 15 frames a second (the app's calm rate), and reads live.json once a minute, only while visible; the
 * map (data.json, about 1 MB) every six hours. Both come from this site only, web-summit.sgit.ai, and the last good copies are
 * kept on the phone so it opens at once and survives a lost network. In the chooser's preview it stands still.
 * Public record only: names, lines and times. By dev.app@PrompTugal.angelo, 8 November 2026.
 */
public class LiveMapWallpaper extends WallpaperService {
    static final String BASE = "https://web-summit.sgit.ai/people/angelo/app/";
    static final long FPS_MS = 1000 / 15, SAVER_MS = 1000 / 5, LIVE_MS = 60_000, MAP_MS = 6 * 3600_000L;
    // what the server last said of each file (its ETag), so an unchanged file is not downloaded again: it answers 304, no body
    // kept only once the body has been read and stored (confirm), so a damaged body is downloaded again next time (dev.app@'s d6ad26fd)
    static final java.util.Map<String, String> etags = new java.util.concurrent.ConcurrentHashMap<>(), pending = new java.util.concurrent.ConcurrentHashMap<>();
    static void confirm(String url) { String t = pending.remove(url); if (t != null) etags.put(url, t); }
    // the view, chosen in SettingsActivity (Angelo, 9 November: "choosing the view as in the website"); kept on the phone
    static final String PREFS = "view", LAYOUT = "layout", THEME = "theme", LEVEL = "level";
    /** "Version 0.5.0 (10)", from the installed package itself, so the phone says which build it runs (Angelo, 10 November). */
    static String version(Context c) {
        try { android.content.pm.PackageInfo i = c.getPackageManager().getPackageInfo(c.getPackageName(), 0); return "Version " + i.versionName + " (" + i.versionCode + ")"; }
        catch (Exception e) { return "Version unknown"; }
    }
    static String layout(Context c) { return c.getSharedPreferences(PREFS, MODE_PRIVATE).getString(LAYOUT, "3d"); }
    /** The layout the graph is built in: the chosen one, but flat under a level's dumbbell, whose routes leave from the people's
     *  places (the 3D ball turns them away; the page's dumbbell is flat too): the People ring then. */
    static String drawnLayout(Context c) { String L = layout(c); return !"messages".equals(level(c)) && "3d".equals(L) ? "ring" : L; }
    static final String ORIENT = "orient", PLAYBACK = "playback";
    /** live, play (a replay at 1 hour a second) or ff (6 hours a second), in a loop. */
    static String playback(Context c) { return c.getSharedPreferences(PREFS, MODE_PRIVATE).getString(PLAYBACK, "live"); }
    /** Where the team sits in the dumbbell: auto (by the screen's shape), top, below, left, right. */
    static String orient(Context c) { return c.getSharedPreferences(PREFS, MODE_PRIVATE).getString(ORIENT, "auto"); }
    /** The level: "messages" (the exchanges alone, as before), "workstreams" (the WS issues' squares and their flights too) or
     *  "deliverables" (what was made and where it went: deliveries.json's ten destinations). */
    static String level(Context c) { return c.getSharedPreferences(PREFS, MODE_PRIVATE).getString(LEVEL, "messages"); }
    static String themeChoice(Context c) { return c.getSharedPreferences(PREFS, MODE_PRIVATE).getString(THEME, "dark"); }
    /** The theme to draw: the chosen one, or the phone's own when "follow the phone" is chosen. */
    static Graph.Theme theme(Context c) {
        String t = themeChoice(c);
        if ("system".equals(t)) return (c.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES ? Graph.DARK : Graph.LIGHT;
        return "light".equals(t) ? Graph.LIGHT : Graph.DARK;
    }

    @Override public Engine onCreateEngine() { return new MapEngine(); }

    final class MapEngine extends Engine {
        private GLSurfaceView view;
        private MapRenderer renderer;
        private MapFeed feed;
        private final Handler ui = new Handler(Looper.getMainLooper());
        private boolean visible = false, saver = false;
        // 15 frames a second while seen; 5 with the phone's Battery Saver on (read as the wallpaper shows, not every frame); 1 in the
        // picker's preview; none while hidden or with the screen off
        private final Runnable tick = new Runnable() { @Override public void run() { if (visible && view != null) { view.requestRender(); ui.postDelayed(this, isPreview() ? 1000 : saver ? SAVER_MS : FPS_MS); } } };

        @Override public void onCreate(SurfaceHolder holder) {
            super.onCreate(holder);
            feed = new MapFeed(LiveMapWallpaper.this);
            view = new GLSurfaceView(LiveMapWallpaper.this) { @Override public SurfaceHolder getHolder() { return MapEngine.this.getSurfaceHolder(); } };
            view.setEGLContextClientVersion(2); view.setPreserveEGLContextOnPause(true);
            renderer = new MapRenderer(feed, getResources().getDisplayMetrics().density); feed.attach(renderer);
            renderer.still = isPreview();
            view.setRenderer(renderer); view.setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
        }
        // GLSurfaceView is a view: it is told of the wallpaper's surface by hand
        @Override public void onSurfaceCreated(SurfaceHolder h) { super.onSurfaceCreated(h); view.surfaceCreated(h); }
        @Override public void onSurfaceChanged(SurfaceHolder h, int f, int w, int hh) { super.onSurfaceChanged(h, f, w, hh); view.surfaceChanged(h, f, w, hh); }
        @Override public void onSurfaceDestroyed(SurfaceHolder h) { super.onSurfaceDestroyed(h); view.surfaceDestroyed(h); }
        @Override public void onVisibilityChanged(boolean v) {
            visible = v; ui.removeCallbacks(tick); feed.setVisible(v);
            if (v) { try { saver = ((android.os.PowerManager) getSystemService(POWER_SERVICE)).isPowerSaveMode(); } catch (Exception e) { saver = false; } view.onResume(); ui.post(tick); } else view.onPause();
        }
        @Override public void onOffsetsChanged(float xo, float yo, float xs, float ys, int xp, int yp) { if (renderer != null) renderer.offsetX = xo; }
        @Override public void onDestroy() { visible = false; ui.removeCallbacks(tick); if (feed != null) feed.close(); super.onDestroy(); }
    }

    static String get(String url) {
        HttpURLConnection c = null;
        try {
            c = (HttpURLConnection) java.net.URI.create(url).toURL().openConnection(); c.setConnectTimeout(15000); c.setReadTimeout(30000); c.setUseCaches(false);
            c.setRequestProperty("User-Agent", "PrompTugal live wallpaper (web-summit.sgit.ai)");
            String tag = etags.get(url); if (tag != null) c.setRequestProperty("If-None-Match", tag);
            int code = c.getResponseCode(); if (code == 304) return null;   // unchanged since the last read: nothing downloaded
            if (code != 200) return null;
            String et = c.getHeaderField("ETag");
            String body; try (InputStream in = c.getInputStream()) { body = new String(all(in), StandardCharsets.UTF_8); }
            if (et != null) pending.put(url, et); else pending.remove(url); return body;
        } catch (Exception e) { return null; } finally { if (c != null) c.disconnect(); }
    }
    static String read(File f) { if (!f.exists()) return null; try (InputStream in = new FileInputStream(f)) { return new String(all(in), StandardCharsets.UTF_8); } catch (Exception e) { return null; } }
    static void write(File f, String s) { File t = new File(f.getPath() + ".tmp"); try (FileOutputStream o = new FileOutputStream(t)) { o.write(s.getBytes(StandardCharsets.UTF_8)); } catch (Exception e) { return; } t.renameTo(f); }
    private static byte[] all(InputStream in) throws java.io.IOException { ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[65536]; int n; while ((n = in.read(buf)) > 0) b.write(buf, 0, n); return b.toByteArray(); }
}
