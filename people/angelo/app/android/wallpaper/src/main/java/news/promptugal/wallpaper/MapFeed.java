package news.promptugal.wallpaper;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static news.promptugal.wallpaper.LiveMapWallpaper.*;

/**
 * What the map draws, kept up to date: the map (data.json, every six hours), the exchanges (live.json, once a minute) and the
 * level's file (workstreams.json or deliveries.json while a level is chosen), from this site only, the last good copies kept on the
 * phone; the view's settings followed as they change. Shared by the wallpaper and the full-screen view (FullScreenActivity), so
 * both show the same thing. It reads only while its owner says it is visible. Moved out of LiveMapWallpaper's engine unchanged
 * (dashboard@PrompTugal.angelo, 10 November 2026, for Angelo's "a button to show the flow full screen as a regular app").
 */
final class MapFeed implements MapRenderer.Source, SharedPreferences.OnSharedPreferenceChangeListener {
    private final Context ctx;
    private MapRenderer renderer;
    private final HandlerThread netThread; private final Handler net;
    private volatile Graph graph; private volatile List<Graph.Event> events; private volatile Bitmap[] logos, logosLight;
    private volatile Object data;   // the parsed data.json, kept so a change of view rebuilds the graph without the network
    private volatile Work work; private volatile List<Work.Row> workRows; private volatile Object workFile; private volatile String workFileLevel;
    private final Map<String, Bitmap> destLogos = new HashMap<>();
    private long mapAt = 0; private volatile boolean visible = false;
    private final Runnable poll = new Runnable() { @Override public void run() { if (!visible) return; fetch(); net.postDelayed(this, LIVE_MS); } };

    MapFeed(Context ctx) {
        this.ctx = ctx;
        netThread = new HandlerThread("live-map-net"); netThread.start(); net = new Handler(netThread.getLooper());
        net.post(() -> { Bitmap rm = asset("riskmandate-mark.png"); logos = new Bitmap[] { rm, asset("pt-news-stamp-dark.png") }; logosLight = new Bitmap[] { rm, asset("pt-news-stamp-light.png") }; loadCached(); });
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).registerOnSharedPreferenceChangeListener(this);
    }
    void attach(MapRenderer r) { renderer = r; r.orientPref = orient(ctx); r.playback = playback(ctx); }
    void setVisible(boolean v) { visible = v; net.removeCallbacks(poll); if (v) { net.post(() -> rebuild(false)); net.post(poll); } }
    void close() { visible = false; net.removeCallbacksAndMessages(null); ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).unregisterOnSharedPreferenceChangeListener(this); netThread.quitSafely(); }

    // a new choice in the settings, or the phone's dark mode changed while hidden (checked as it shows again)
    @Override public void onSharedPreferenceChanged(SharedPreferences p, String key) { if (renderer != null) { renderer.orientPref = orient(ctx); renderer.playback = playback(ctx); } net.post(() -> rebuild(true)); if (LEVEL.equals(key) && visible) net.post(this::fetch); }
    private void rebuild(boolean force) {
        Object d = data; if (d == null) return; Graph g = graph; String L = drawnLayout(ctx); Graph.Theme th = theme(ctx);
        if (!force && g != null && g.isFor(L, th)) return;
        try { graph = Graph.fromData(d, L, th); } catch (Exception e) { Log.w("LiveMap", "view rebuild failed", e); }
        levelFrom(workFile);
    }
    // the level's file: workstreams.json or deliveries.json while that level is chosen (read with live.json, once a minute)
    private String levelFile() { String v = level(ctx); return "workstreams".equals(v) ? "workstreams.json" : "deliverables".equals(v) ? "deliveries.json" : null; }
    private void levelFrom(Object f) { levelFrom(f, workFileLevel); }
    private void levelFrom(Object f, String fileLevel) {
        String v = level(ctx);
        if (levelFile() == null) { work = null; return; }
        if (f == null || !v.equals(fileLevel)) {   // the file in hand is another level's: this level's own copy on the phone, else none until it is read
            if (work != null && !v.equals(work.level)) work = null;
            String c = read(cache(levelFile())); if (c == null) return;
            try { f = Json.parse(c); } catch (Exception e) { return; }
        }
        try { Work w = work; if (w == null || !v.equals(w.level)) w = new Work(v, f); workRows = w.rows(f); work = w; workFile = f; workFileLevel = v; } catch (Exception e) { Log.w("LiveMap", v + " unreadable", e); }
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
    private Graph build(Object d) { data = d; return Graph.fromData(d, drawnLayout(ctx), theme(ctx)); }

    // ---- the data, on the network thread
    private void loadCached() {
        try { String d = read(cache("data.json")); if (d != null) graph = build(Json.parse(d)); } catch (Exception e) { Log.w("LiveMap", "cached map unreadable", e); }
        try { String l = read(cache("live.json")); if (l != null && graph != null) events = Graph.events(Json.parse(l)); } catch (Exception e) { Log.w("LiveMap", "cached live.json unreadable", e); }
        String lf = levelFile();
        try { String w = lf == null ? null : read(cache(lf)); if (w != null) levelFrom(Json.parse(w), level(ctx)); } catch (Exception e) { Log.w("LiveMap", "cached level file unreadable", e); }
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
        String lf = levelFile(), v = level(ctx);
        if (lf != null) {   // workstreams.json about 50 KB, deliveries.json about 15 KB, only while that level is chosen
            String w = get(BASE + lf);
            if (w != null) { try { Object f = Json.parse(w); write(cache(lf), w); levelFrom(f, v); confirm(BASE + lf); } catch (Exception e) { Log.w("LiveMap", lf + " unreadable", e); } }
        }
    }
    private File cache(String name) { return new File(ctx.getFilesDir(), name); }
    private Bitmap asset(String name) { try (InputStream in = ctx.getAssets().open(name)) { return BitmapFactory.decodeStream(in); } catch (Exception e) { return null; } }
}
