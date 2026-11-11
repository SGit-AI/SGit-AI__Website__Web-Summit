package news.promptugal.wallpaper;

import android.app.Activity;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowManager;

/**
 * The flow full screen, as a regular app (Angelo, 10 November 2026: "We need in the settings app a button to show the flow full
 * screen as a regular app"): the same drawing and the same choices as the wallpaper (layout, level, the team's place, playback,
 * theme), on the whole screen with the system bars hidden, and the screen kept on while it shows, for a phone or tablet on a stand.
 * Back closes it. It draws and reads only while it is open. By dashboard@PrompTugal.angelo (WS-203).
 */
public class FullScreenActivity extends Activity {
    private GLSurfaceView view; private MapRenderer renderer; private MapFeed feed;
    private final Handler ui = new Handler(Looper.getMainLooper()); private boolean shown = false;
    private final Runnable tick = new Runnable() { @Override public void run() { if (shown && view != null) { view.requestRender(); ui.postDelayed(this, LiveMapWallpaper.FPS_MS); } } };

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        feed = new MapFeed(this);
        view = new GLSurfaceView(this); view.setEGLContextClientVersion(2); view.setPreserveEGLContextOnPause(true);
        renderer = new MapRenderer(feed, getResources().getDisplayMetrics().density); feed.attach(renderer);
        view.setRenderer(renderer); view.setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
        setContentView(view);
    }
    @SuppressWarnings("deprecation")
    private void immersive() {
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }
    @Override public void onWindowFocusChanged(boolean f) { super.onWindowFocusChanged(f); if (f) immersive(); }
    @Override protected void onResume() { super.onResume(); immersive(); shown = true; view.onResume(); feed.setVisible(true); ui.post(tick); }
    @Override protected void onPause() { shown = false; ui.removeCallbacks(tick); feed.setVisible(false); view.onPause(); super.onPause(); }
    @Override protected void onDestroy() { if (feed != null) feed.close(); super.onDestroy(); }
}
