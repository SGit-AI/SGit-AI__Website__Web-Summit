package news.promptugal.wallpaper;

import android.content.Context;
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
    static final long FPS_MS = 1000 / 15, LIVE_MS = 60_000, MAP_MS = 6 * 3600_000L;

    @Override public Engine onCreateEngine() { return new MapEngine(); }

    final class MapEngine extends Engine implements MapRenderer.Source {
        private GLSurfaceView view;
        private MapRenderer renderer;
        private final Handler ui = new Handler(Looper.getMainLooper());
        private HandlerThread netThread; private Handler net;
        private volatile Graph graph; private volatile List<Graph.Event> events; private volatile Bitmap[] logos;
        private long mapAt = 0; private boolean visible = false;

        private final Runnable tick = new Runnable() { @Override public void run() { if (visible && view != null) { view.requestRender(); ui.postDelayed(this, isPreview() ? 1000 : FPS_MS); } } };
        private final Runnable poll = new Runnable() { @Override public void run() { if (!visible) return; fetch(); net.postDelayed(this, LIVE_MS); } };

        @Override public void onCreate(SurfaceHolder holder) {
            super.onCreate(holder);
            netThread = new HandlerThread("live-map-net"); netThread.start(); net = new Handler(netThread.getLooper());
            net.post(() -> { logos = new Bitmap[] { asset("riskmandate-mark.png"), asset("pt-news-stamp-dark.png") }; loadCached(); });
            view = new GLSurfaceView(LiveMapWallpaper.this) { @Override public SurfaceHolder getHolder() { return MapEngine.this.getSurfaceHolder(); } };
            view.setEGLContextClientVersion(2); view.setPreserveEGLContextOnPause(true);
            renderer = new MapRenderer(this, getResources().getDisplayMetrics().density);
            renderer.still = isPreview();
            view.setRenderer(renderer); view.setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
        }

        // GLSurfaceView is a view: it is told of the wallpaper's surface by hand
        @Override public void onSurfaceCreated(SurfaceHolder h) { super.onSurfaceCreated(h); view.surfaceCreated(h); }
        @Override public void onSurfaceChanged(SurfaceHolder h, int f, int w, int hh) { super.onSurfaceChanged(h, f, w, hh); view.surfaceChanged(h, f, w, hh); }
        @Override public void onSurfaceDestroyed(SurfaceHolder h) { super.onSurfaceDestroyed(h); view.surfaceDestroyed(h); }

        @Override public void onVisibilityChanged(boolean v) {
            visible = v; ui.removeCallbacks(tick); net.removeCallbacks(poll);
            if (v) { view.onResume(); ui.post(tick); net.post(poll); } else view.onPause();
        }

        @Override public void onOffsetsChanged(float xo, float yo, float xs, float ys, int xp, int yp) { if (renderer != null) renderer.offsetX = xo; }

        @Override public void onDestroy() {
            visible = false; ui.removeCallbacks(tick); if (net != null) net.removeCallbacksAndMessages(null);
            if (netThread != null) netThread.quitSafely();
            super.onDestroy();
        }

        @Override public Graph graph() { return graph; }
        @Override public List<Graph.Event> takeEvents() { List<Graph.Event> e = events; events = null; return e; }
        @Override public Bitmap[] logos() { return logos; }

        // ---- the data, on the network thread
        private void loadCached() {
            try { String d = read(cache("data.json")); if (d != null) graph = Graph.fromData(Json.parse(d)); } catch (Exception e) { Log.w("LiveMap", "cached map unreadable", e); }
            try { String l = read(cache("live.json")); if (l != null && graph != null) events = Graph.events(Json.parse(l)); } catch (Exception e) { Log.w("LiveMap", "cached live.json unreadable", e); }
        }
        private void fetch() {
            long now = System.currentTimeMillis();
            if (graph == null || now - mapAt > MAP_MS) {
                String d = get(BASE + "data.json");
                if (d != null) { try { Graph g = Graph.fromData(Json.parse(d)); graph = g; mapAt = now; write(cache("data.json"), d); } catch (Exception e) { Log.w("LiveMap", "map unreadable", e); } }
            }
            String l = get(BASE + "live.json");
            if (l != null && graph != null) { try { events = Graph.events(Json.parse(l)); write(cache("live.json"), l); } catch (Exception e) { Log.w("LiveMap", "live.json unreadable", e); } }
        }
        private File cache(String name) { return new File(getFilesDir(), name); }
        private Bitmap asset(String name) { try (InputStream in = getAssets().open(name)) { return BitmapFactory.decodeStream(in); } catch (Exception e) { return null; } }
    }

    static String get(String url) {
        HttpURLConnection c = null;
        try {
            c = (HttpURLConnection) java.net.URI.create(url).toURL().openConnection(); c.setConnectTimeout(15000); c.setReadTimeout(30000); c.setUseCaches(false);
            c.setRequestProperty("User-Agent", "PrompTugal live wallpaper (web-summit.sgit.ai)");
            if (c.getResponseCode() != 200) return null;
            try (InputStream in = c.getInputStream()) { return new String(all(in), StandardCharsets.UTF_8); }
        } catch (Exception e) { return null; } finally { if (c != null) c.disconnect(); }
    }
    static String read(File f) { if (!f.exists()) return null; try (InputStream in = new FileInputStream(f)) { return new String(all(in), StandardCharsets.UTF_8); } catch (Exception e) { return null; } }
    static void write(File f, String s) { File t = new File(f.getPath() + ".tmp"); try (FileOutputStream o = new FileOutputStream(t)) { o.write(s.getBytes(StandardCharsets.UTF_8)); } catch (Exception e) { return; } t.renameTo(f); }
    private static byte[] all(InputStream in) throws java.io.IOException { ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[65536]; int n; while ((n = in.read(buf)) > 0) b.write(buf, 0, n); return b.toByteArray(); }
}
