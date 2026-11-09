package news.promptugal.wallpaper;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.ScrollView;
import android.widget.TextView;

/**
 * The wallpaper's settings: which view of the map it shows, as on the website (Angelo, 9 November 2026: "Can we enhance the
 * live wallpaper to enable choosing the view as in the website?"). Android opens it from the wallpaper picker's Settings
 * button (wallpaper.xml's settingsActivity), and the app's own screen links to it. A choice is kept on the phone and the
 * wallpaper redraws at once. Nothing leaves the phone. By dashboard@PrompTugal.angelo, 9 November 2026 (WS-203).
 */
public class SettingsActivity extends Activity {
    // the layouts the wallpaper offers, in the site's own words (live.js's LAYOUTS, and the 3D button)
    static final String[][] LAYOUTS = { { "3d", "3D", "The team as a turning ball" }, { "ring", "People ring", "Each person with their agents beside them" },
            { "agents", "Agents ring", "The people outside, their agents in one ring inside" } };
    static final String[][] THEMES = { { "dark", "Dark" }, { "light", "Light" }, { "system", "Follow the phone" } };

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        final SharedPreferences prefs = getSharedPreferences(LiveMapWallpaper.PREFS, MODE_PRIVATE);
        float d = getResources().getDisplayMetrics().density; int pad = (int) (24 * d);
        LinearLayout col = new LinearLayout(this); col.setOrientation(LinearLayout.VERTICAL); col.setPadding(pad, pad, pad, pad);
        col.setBackgroundColor(0xFF000000 | Graph.BG);
        TextView h = text("Choose the view", 24, Graph.TEXT); h.setTypeface(Typeface.DEFAULT_BOLD);
        TextView p = text("As on the website's live map. The wallpaper redraws as soon as you choose.", 15, Graph.MUTED); p.setPadding(0, pad / 3, 0, pad / 2);
        col.addView(h); col.addView(p);

        col.addView(heading("Layout", pad));
        RadioGroup lg = new RadioGroup(this); String L = LiveMapWallpaper.layout(this);
        for (int i = 0; i < LAYOUTS.length; i++) lg.addView(option(i, LAYOUTS[i][1] + "\n" + LAYOUTS[i][2], LAYOUTS[i][0].equals(L), d));
        lg.setOnCheckedChangeListener((g, id) -> prefs.edit().putString(LiveMapWallpaper.LAYOUT, LAYOUTS[id][0]).apply());
        col.addView(lg);

        col.addView(heading("Theme", pad));
        RadioGroup tg = new RadioGroup(this); String T = LiveMapWallpaper.themeChoice(this);
        for (int i = 0; i < THEMES.length; i++) tg.addView(option(i, THEMES[i][1], THEMES[i][0].equals(T), d));
        tg.setOnCheckedChangeListener((g, id) -> prefs.edit().putString(LiveMapWallpaper.THEME, THEMES[id][0]).apply());
        col.addView(tg);

        TextView soon = text("Coming next: the Agents and their work layout, and the Workstreams and Deliverables levels.", 13, Graph.MUTED); soon.setPadding(0, pad, 0, pad / 2);
        col.addView(soon);
        Button done = new Button(this); done.setText("Done"); done.setOnClickListener(v -> finish()); col.addView(done);

        ScrollView sv = new ScrollView(this); sv.setBackgroundColor(0xFF000000 | Graph.BG); sv.setFillViewport(true); sv.addView(col);
        setContentView(sv);
    }

    private TextView text(String s, int sp, int rgb) { TextView t = new TextView(this); t.setText(s); t.setTextSize(sp); t.setTextColor(0xFF000000 | rgb); return t; }
    private TextView heading(String s, int pad) { TextView t = text(s, 17, Graph.TEXT); t.setTypeface(Typeface.DEFAULT_BOLD); t.setPadding(0, pad / 2, 0, pad / 4); return t; }
    // one choice: at least 48 dp high, as Android asks of anything a finger taps
    private RadioButton option(int id, String label, boolean on, float d) {
        RadioButton r = new RadioButton(this); r.setId(id); r.setText(label); r.setTextSize(15); r.setTextColor(0xFF000000 | Graph.TEXT);
        r.setMinHeight((int) (48 * d)); r.setGravity(Gravity.CENTER_VERTICAL); r.setPadding((int) (8 * d), (int) (6 * d), 0, (int) (6 * d));
        r.setChecked(on); return r;
    }
}
