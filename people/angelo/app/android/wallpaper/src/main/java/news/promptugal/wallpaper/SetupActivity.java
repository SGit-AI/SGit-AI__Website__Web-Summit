package news.promptugal.wallpaper;

import android.app.Activity;
import android.app.WallpaperManager;
import android.content.ComponentName;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * The app's one screen: what it is, and a button that opens Android's own wallpaper preview at this wallpaper, where the
 * person confirms it (no permission needed). By dev.app@PrompTugal.angelo, 8 November 2026 (backlog 00a2).
 */
public class SetupActivity extends Activity {
    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        float d = getResources().getDisplayMetrics().density; int pad = (int) (24 * d);
        LinearLayout col = new LinearLayout(this); col.setOrientation(LinearLayout.VERTICAL); col.setGravity(Gravity.CENTER); col.setPadding(pad, pad, pad, pad);
        col.setBackgroundColor(0xFF000000 | Graph.BG);
        TextView h = new TextView(this); h.setText("Team and the machine"); h.setTextSize(24); h.setTypeface(Typeface.DEFAULT_BOLD); h.setTextColor(0xFF000000 | Graph.TEXT); h.setGravity(Gravity.CENTER);
        TextView p = new TextView(this); p.setTextColor(0xFF000000 | Graph.MUTED); p.setTextSize(15); p.setGravity(Gravity.CENTER); p.setPadding(0, pad / 2, 0, pad);
        p.setText("The live 3D map of the team and its agents, as your home screen's background: every exchange travels along its line a few minutes after it happens.\n\nIt draws only while you see it, at a calm rate, and reads web-summit.sgit.ai once a minute. Names, lines and times only.");
        Button go = new Button(this); go.setText("Set as wallpaper");
        go.setOnClickListener(v -> open());
        col.addView(h); col.addView(p); col.addView(go);
        setContentView(col);
    }

    private void open() {
        Intent i = new Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER)
                .putExtra(WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT, new ComponentName(this, LiveMapWallpaper.class));
        try { startActivity(i); return; } catch (Exception e) { }
        try { startActivity(new Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER)); } catch (Exception e) { }
    }
}
