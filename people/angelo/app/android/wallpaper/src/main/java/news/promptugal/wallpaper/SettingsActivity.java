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
    // the dumbbell's ends (spec-dumbbell.md: "orientation is a setting"), as work-bell.js names them
    static final String[][] ORIENTS = { { "auto", "Automatic", "On top when the screen stands upright, on the left when it lies" }, { "top", "Team on top", "" }, { "below", "Team below", "" }, { "left", "Team on the left", "" }, { "right", "Team on the right", "" } };
    static final String[][] THEMES = { { "dark", "Dark" }, { "light", "Light" }, { "system", "Follow the phone" } };
    // the levels, as the site's switch names them (live.js and work.js): the exchanges, and the workstreams they serve
    static final String[][] LEVELS = { { "messages", "Messages", "Who wrote to whom, as it happens" }, { "workstreams", "Workstreams", "The team at one end, the busiest WS issues at the other, each commit flying along its route" },
            { "deliverables", "Deliverables", "The team at one end, where its work went at the other: PT News, the site, research and more" } };

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        final SharedPreferences prefs = getSharedPreferences(LiveMapWallpaper.PREFS, MODE_PRIVATE);
        float d = getResources().getDisplayMetrics().density; int pad = (int) (24 * d);
        LinearLayout col = new LinearLayout(this); col.setOrientation(LinearLayout.VERTICAL); col.setPadding(pad, pad, pad, pad);
        col.setBackgroundColor(0xFF000000 | Graph.BG);
        TextView h = text("Choose the view", 24, Graph.TEXT); h.setTypeface(Typeface.DEFAULT_BOLD);
        TextView p = text("As on the website's live map. The wallpaper redraws as soon as you choose.", 15, Graph.MUTED); p.setPadding(0, pad / 3, 0, pad / 2);
        // which build this phone runs, and what it offers (Angelo, 10 November: "make sure the version is displayed in the settings")
        TextView ver = text(LiveMapWallpaper.version(this) + " \u00b7 views: 3D, People ring, Agents ring; levels: Messages, Workstreams and Deliverables as a dumbbell", 13, Graph.MUTED); ver.setPadding(0, 0, 0, pad / 2);
        col.addView(h); col.addView(p); col.addView(ver);

        col.addView(heading("Layout", pad));
        // each choice its own id across both groups (layouts from 100, themes from 200), and no saved state: the screen is
        // always drawn from the phone's stored choice, so a rotation cannot put one group's check into the other (dev.app@'s 3530f9da)
        RadioGroup lg = new RadioGroup(this); lg.setSaveEnabled(false); String L = LiveMapWallpaper.layout(this);
        for (int i = 0; i < LAYOUTS.length; i++) lg.addView(option(100 + i, LAYOUTS[i][1] + "\n" + LAYOUTS[i][2], LAYOUTS[i][0].equals(L), d));
        lg.setOnCheckedChangeListener((g, id) -> { int i = id - 100; if (i >= 0 && i < LAYOUTS.length) prefs.edit().putString(LiveMapWallpaper.LAYOUT, LAYOUTS[i][0]).apply(); });
        col.addView(lg);

        col.addView(heading("Level", pad));
        RadioGroup vg = new RadioGroup(this); vg.setSaveEnabled(false); String V = LiveMapWallpaper.level(this);
        for (int i = 0; i < LEVELS.length; i++) vg.addView(option(300 + i, LEVELS[i][1] + "\n" + LEVELS[i][2], LEVELS[i][0].equals(V), d));
        vg.setOnCheckedChangeListener((g, id) -> { int i = id - 300; if (i >= 0 && i < LEVELS.length) prefs.edit().putString(LiveMapWallpaper.LEVEL, LEVELS[i][0]).apply(); });
        col.addView(vg);

        col.addView(heading("The team's place (Workstreams and Deliverables)", pad));
        RadioGroup og = new RadioGroup(this); og.setSaveEnabled(false); String O = LiveMapWallpaper.orient(this);
        for (int i = 0; i < ORIENTS.length; i++) og.addView(option(400 + i, ORIENTS[i][1] + (ORIENTS[i][2].isEmpty() ? "" : "\n" + ORIENTS[i][2]), ORIENTS[i][0].equals(O), d));
        og.setOnCheckedChangeListener((g, id) -> { int i = id - 400; if (i >= 0 && i < ORIENTS.length) prefs.edit().putString(LiveMapWallpaper.ORIENT, ORIENTS[i][0]).apply(); });
        col.addView(og);

        col.addView(heading("Theme", pad));
        RadioGroup tg = new RadioGroup(this); tg.setSaveEnabled(false); String T = LiveMapWallpaper.themeChoice(this);
        for (int i = 0; i < THEMES.length; i++) tg.addView(option(200 + i, THEMES[i][1], THEMES[i][0].equals(T), d));
        tg.setOnCheckedChangeListener((g, id) -> { int i = id - 200; if (i >= 0 && i < THEMES.length) prefs.edit().putString(LiveMapWallpaper.THEME, THEMES[i][0]).apply(); });
        col.addView(tg);

        TextView soon = text("Under a level, the team is drawn flat (the People ring or Agents ring), as on the website.", 13, Graph.MUTED); soon.setPadding(0, pad, 0, pad / 2);
        col.addView(soon);
        Button done = new Button(this); done.setText("Done"); done.setOnClickListener(v -> finish()); col.addView(done);

        ScrollView sv = new ScrollView(this); sv.setBackgroundColor(0xFF000000 | Graph.BG); sv.setFillViewport(true); sv.addView(col);
        setContentView(sv);
    }

    private TextView text(String s, int sp, int rgb) { TextView t = new TextView(this); t.setText(s); t.setTextSize(sp); t.setTextColor(0xFF000000 | rgb); return t; }
    private TextView heading(String s, int pad) { TextView t = text(s, 17, Graph.TEXT); t.setTypeface(Typeface.DEFAULT_BOLD); t.setPadding(0, pad / 2, 0, pad / 4); return t; }
    // one choice: at least 48 dp high, as Android asks of anything a finger taps
    private RadioButton option(int id, String label, boolean on, float d) {
        RadioButton r = new RadioButton(this); r.setId(id); r.setSaveEnabled(false); r.setText(label); r.setTextSize(15); r.setTextColor(0xFF000000 | Graph.TEXT);
        r.setMinHeight((int) (48 * d)); r.setGravity(Gravity.CENTER_VERTICAL); r.setPadding((int) (8 * d), (int) (6 * d), 0, (int) (6 * d));
        r.setChecked(on); return r;
    }
}
