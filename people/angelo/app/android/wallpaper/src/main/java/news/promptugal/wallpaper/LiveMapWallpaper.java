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
    static String layout(Context c) { return c.getSharedPreferences(PREFS, MODE_PRIVATE).getString(LAYOUT, "3d"); }
    /** The layout the graph is built in: the chosen one, but flat under a level's dumbbell, whose routes leave from the people's
     *  places (the 3D ball turns them away; the page's dumbbell is flat too): the People ring then. */
    static String drawnLayout(Context c) { String L = layout(c); return !"messages".equals(level(c)) && "3d".equals(L) ? "ring" : L; }
    static final String ORIENT = "orient";
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

    final class MapEngine extends Engine implements MapRenderer.Source, SharedPreferences.OnSharedPreferenceChangeListener {
        private GLSurfaceView view;
        private MapRenderer renderer;
        private final Handler ui = new Handler(Looper.getMainLooper());
        private HandlerThread netThread; private Handler net;
        private volatile Graph graph; private volatile List<Graph.Event> events; private volatile Bitmap[] logos, logosLight;
        private volatile Object data;   // the parsed data.json, kept so a change of view rebuilds the graph without the network
        private volatile Work work; private volatile List<Work.Row> workRows; private volatile Object workFile; private volatile String workFileLevel;
        private final java.util.Map<String, Bitmap> destLogos = new java.util.HashMap<>();
        private long mapAt = 0; private boolean visible = false;

        // 15 frames a second while seen; 5 with the phone's Battery Saver on (read as the wallpaper shows, not every frame); 1 in the
        // picker's preview; none while hidden or with the screen off
        private boolean saver = false;
        private final Runnable tick = new Runnable() { @Override public void run() { if (visible && view != null) { view.requestRender(); ui.postDelayed(this, isPreview() ? 1000 : saver ? SAVER_MS : FPS_MS); } } };
        private final Runnable poll = new Runnable() { @Override public void run() { if (!visible) return; fetch(); net.postDelayed(this, LIVE_MS); } };

        @Override public void onCreate(SurfaceHolder holder) {
            super.onCreate(holder);
            netThread = new HandlerThread("live-map-net"); netThread.start(); net = new Handler(netThread.getLooper());
            net.post(() -> { Bitmap rm = asset("riskmandate-mark.png"); logos = new Bitmap[] { rm, asset("pt-news-stamp-dark.png") }; logosLight = new Bitmap[] { rm, asset("pt-news-stamp-light.png") }; loadCached(); });
            getSharedPreferences(PREFS, MODE_PRIVATE).registerOnSharedPreferenceChangeListener(this);
            view = new GLSurfaceView(LiveMapWallpaper.this) { @Override public SurfaceHolder getHolder() { return MapEngine.this.getSurfaceHolder(); } };
            view.setEGLContextClientVersion(2); view.setPreserveEGLContextOnPause(true);
            renderer = new MapRenderer(this, getResources().getDisplayMetrics().density);
            renderer.still = isPreview(); renderer.orientPref = orient(LiveMapWallpaper.this);
            view.setRenderer(renderer); view.setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
        }

        // GLSurfaceView is a view: it is told of the wallpaper's surface by hand
        @Override public void onSurfaceCreated(SurfaceHolder h) { super.onSurfaceCreated(h); view.surfaceCreated(h); }
        @Override public void onSurfaceChanged(SurfaceHolder h, int f, int w, int hh) { super.onSurfaceChanged(h, f, w, hh); view.surfaceChanged(h, f, w, hh); }
        @Override public void onSurfaceDestroyed(SurfaceHolder h) { super.onSurfaceDestroyed(h); view.surfaceDestroyed(h); }

        @Override public void onVisibilityChanged(boolean v) {
            visible = v; ui.removeCallbacks(tick); net.removeCallbacks(poll);
            if (v) { try { saver = ((android.os.PowerManager) getSystemService(POWER_SERVICE)).isPowerSaveMode(); } catch (Exception e) { saver = false; }
                view.onResume(); ui.post(tick); net.post(() -> rebuild(false)); net.post(poll); } else view.onPause();
        }
        // a new choice in the settings, or the phone's dark mode changed while hidden (checked as it shows again)
        @Override public void onSharedPreferenceChanged(SharedPreferences p, String key) { if (renderer != null) renderer.orientPref = orient(LiveMapWallpaper.this); if (net != null) { net.post(() -> rebuild(true)); if (LEVEL.equals(key) && visible) net.post(this::fetch); } }
        private void rebuild(boolean force) {
            Object d = data; if (d == null) return; Graph g = graph; String L = drawnLayout(LiveMapWallpaper.this); Graph.Theme th = theme(LiveMapWallpaper.this);
            if (!force && g != null && g.isFor(L, th)) return;
            try { graph = Graph.fromData(d, L, th); } catch (Exception e) { Log.w("LiveMap", "view rebuild failed", e); }
            levelFrom(workFile);
        }
        // the level's file: workstreams.json or deliveries.json while that level is chosen (read with live.json, once a minute)
        private String levelFile() { String v = level(LiveMapWallpaper.this); return "workstreams".equals(v) ? "workstreams.json" : "deliverables".equals(v) ? "deliveries.json" : null; }
        private void levelFrom(Object f) { levelFrom(f, workFileLevel); }
        private void levelFrom(Object f, String fileLevel) {
            String v = level(LiveMapWallpaper.this);
            if (levelFile() == null) { work = null; return; }
            if (f == null || !v.equals(fileLevel)) {   // the file in hand is another level's: this level's own copy on the phone, else none until it is read
                if (work != null && !v.equals(work.level)) work = null;
                String c = read(cache(levelFile())); if (c == null) return;
                try { f = Json.parse(c); } catch (Exception e) { return; }
            }
            try { Work w = work; if (w == null || !v.equals(w.level)) w = new Work(v, f); workRows = w.rows(f); work = w; workFile = f; workFileLevel = v; } catch (Exception e) { Log.w("LiveMap", v + " unreadable", e); }
        }

        @Override public void onOffsetsChanged(float xo, float yo, float xs, float ys, int xp, int yp) { if (renderer != null) renderer.offsetX = xo; }

        @Override public void onDestroy() {
            visible = false; ui.removeCallbacks(tick); if (net != null) net.removeCallbacksAndMessages(null);
            getSharedPreferences(PREFS, MODE_PRIVATE).unregisterOnSharedPreferenceChangeListener(this);
            if (netThread != null) netThread.quitSafely();
            super.onDestroy();
        }

        @Override public Graph graph() { return graph; }
        @Override public List<Graph.Event> takeEvents() { List<Graph.Event> e = events; events = null; return e; }
        @Override public Work work() { return work; }
        @Override public Bitmap destLogo(String id, boolean light) {
            String name = "news".equals(id) ? (light ? "wl-pt-news-light.png" : "wl-pt-news-dark.png") : "linkedin".equals(id) ? "wl-linkedin.png" : null;
            if (name == null) return null; synchronized (destLogos) { if (!destLogos.containsKey(name)) destLogos.put(name, asset(name)); return destLogos.get(name); }
        }
        @Override public List<Work.Row> takeWorkRows() { List<Work.Row> r = workRows; workRows = null; return r; }
        @Override public Bitmap[] logos(boolean light) { return light && logosLight != null ? logosLight : logos; }
        private Graph build(Object d) { data = d; return Graph.fromData(d, drawnLayout(LiveMapWallpaper.this), theme(LiveMapWallpaper.this)); }

        // ---- the data, on the network thread
        private void loadCached() {
            try { String d = read(cache("data.json")); if (d != null) graph = build(Json.parse(d)); } catch (Exception e) { Log.w("LiveMap", "cached map unreadable", e); }
            try { String l = read(cache("live.json")); if (l != null && graph != null) events = Graph.events(Json.parse(l)); } catch (Exception e) { Log.w("LiveMap", "cached live.json unreadable", e); }
            String lf = levelFile();
            try { String w = lf == null ? null : read(cache(lf)); if (w != null) levelFrom(Json.parse(w), level(LiveMapWallpaper.this)); } catch (Exception e) { Log.w("LiveMap", "cached level file unreadable", e); }
        }
        private void fetch() {
            long now = System.currentTimeMillis();
            if (graph == null || now - mapAt > MAP_MS) {
                mapAt = now;   // asked: the next ask in six hours, whether it came back new, unchanged (304) or not at all
                String d = get(BASE + "data.json");
                if (d != null) { try { Graph g = build(Json.parse(d)); graph = g; mapAt = now; write(cache("data.json"), d); confirm(BASE + "data.json"); } catch (Exception e) { Log.w("LiveMap", "map unreadable", e); } }
            }
            String l = get(BASE + "live.json");
            if (l != null && graph != null) { try { events = Graph.events(Json.parse(l)); write(cache("live.json"), l); confirm(BASE + "live.json"); } catch (Exception e) { Log.w("LiveMap", "live.json unreadable", e); } }
            String lf = levelFile(), v = level(LiveMapWallpaper.this);
            if (lf != null) {   // workstreams.json about 50 KB, deliveries.json about 15 KB, only while that level is chosen
                String w = get(BASE + lf);
                if (w != null) { try { Object f = Json.parse(w); write(cache(lf), w); levelFrom(f, v); confirm(BASE + lf); } catch (Exception e) { Log.w("LiveMap", lf + " unreadable", e); } }
            }
        }
        private File cache(String name) { return new File(getFilesDir(), name); }
        private Bitmap asset(String name) { try (InputStream in = getAssets().open(name)) { return BitmapFactory.decodeStream(in); } catch (Exception e) { return null; } }
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
