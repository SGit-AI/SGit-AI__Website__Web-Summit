package news.promptugal.wallpaper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The map's levels on the wallpaper (Angelo, 9 November 2026: "choosing the view as in the website"; WS-203): Workstreams, the
 * nine busiest WS issues and "other" as squares on the hexagon's rim, each commit naming one flying as a document from its
 * maker to its square at its real moment, four minutes behind, as the page's exchanges. Ported line for line from the page:
 * work.js's variant(), places(), rimPoint(), merge(), origin() and along(); work-draw.js's pillsFor() and its flight (3 s,
 * eased, a trail); work-live.js's reading (nothing older than the delay plays on opening; the counts for the last 24 hours).
 * It reads workstreams.json (built beside live.json): [minute, maker, icon, destination, repository, short sha], names and
 * times only. No Android class here: the tests run it on a plain JVM against work.js (hxwallws.test.js).
 * By dashboard@PrompTugal.angelo, 9 November 2026.
 */
public final class Work {
    public static final double S = 1000, C = 500, FLIGHT_MS = 3000, DAY_MS = 864e5, SQ = 58, FONT = 19, INSIDE = 0.28;
    // work.js's SLOTS0, in DESTS0's order: [edge, fraction along it], edges clockwise from the top; a level's destinations take them in turn
    static final double[][] SLOTS = { { 5, 0.7 }, { 1, 0.3 }, { 1, 0.6 }, { 1, 0.9 }, { 2, 0.35 }, { 2, 0.75 }, { 4, 0.25 }, { 4, 0.65 }, { 5, 0.1 }, { 5, 0.4 } };
    static final double[][] HEX = { { 250, 67 }, { 750, 67 }, { 1000, 500 }, { 750, 933 }, { 250, 933 }, { 0, 500 } };
    // the six icons a delivery flies as (work.js's ICON_PATHS), in a 24 x 24 box centred on 0,0, stroked; Workstreams flies docs
    public static final Map<String, String> ICON_PATHS = new LinkedHashMap<>();
    // the Deliverables squares' own marks (work-draw.js's MARK and MARK_PATHS: no two destinations alike), and the two with a logo
    public static final Map<String, String> MARK = new LinkedHashMap<>(), MARK_PATHS = new LinkedHashMap<>();
    public static final java.util.Set<String> LOGO = new java.util.HashSet<>(java.util.Arrays.asList("news", "linkedin"));
    // work.js's DESTS0, NAMES0 and SHORT0: the Deliverables level's ten, its names and the short ones for a phone
    static final String[] DESTS0 = { "news", "site", "research", "infra", "app", "keys", "crm", "email", "linkedin", "drafts" };
    static final Map<String, String> NAMES0 = new LinkedHashMap<>(), SHORT0 = new LinkedHashMap<>();
    static {
        String[][] ic = { { "doc", "M-6 -9h8l4 4v14h-12zM2 -9v4h4M-3 -1h6M-3 3h6" }, { "cog", "M0 -9v3M0 6v3M-9 0h3M6 0h3M-6.4 -6.4l2.1 2.1M4.3 4.3l2.1 2.1M-6.4 6.4l2.1-2.1M4.3 -4.3l2.1-2.1M0 -4a4 4 0 1 0 0.01 0" },
                { "key", "M-5 -3a4 4 0 1 0 0.01 0M-1 -3h10M5 -3v4M8 -3v3" }, { "record", "M-8 -7h16v14h-16zM-8 -2h16M-8 3h16M-3 -7v14" },
                { "envelope", "M-9 -6h18v12h-18zM-9 -6l9 7l9 -7" }, { "post", "M-8 -8h16v12h-9l-4 4v-4h-3zM-4 -4h8M-4 0h5" } };
        for (String[] x : ic) ICON_PATHS.put(x[0], x[1]);
        String[][] mk = { { "site", "site" }, { "research", "research" }, { "infra", "infra" }, { "app", "app" }, { "keys", "key" }, { "crm", "record" }, { "email", "envelope" }, { "drafts", "drafts" } };
        for (String[] x : mk) MARK.put(x[0], x[1]);
        String[][] mp = { { "site", "M-9 -7h18v14h-18zM-9 -3h18M-6.5 -5h0.5M-4 -5h0.5" }, { "research", "M-7 -3a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M1.6 0.6l6.4 6.4" },
                { "infra", "M-8 -8h16v6h-16zM-8 2h16v6h-16zM-5 -5h3M-5 5h3M4 -5h0.5M4 5h0.5" }, { "app", "M-5 -9h10v18h-10zM-2 6h4" }, { "drafts", "M-7 7l1.5 -5l9 -9l3.5 3.5l-9 9zM-5.5 2l3.5 3.5M1.5 -5l3.5 3.5" } };
        for (String[] x : mp) MARK_PATHS.put(x[0], x[1]);
        String[][] nm = { { "news", "PT News", "PT News" }, { "site", "the team site", "site" }, { "research", "research", "research" }, { "infra", "infrastructure", "infra" }, { "app", "the app", "app" },
                { "keys", "keys", "keys" }, { "crm", "the CRM", "CRM" }, { "email", "email drafts", "email" }, { "linkedin", "LinkedIn", "LinkedIn" }, { "drafts", "Drafts and proposals", "drafts" } };
        for (String[] x : nm) { NAMES0.put(x[0], x[1]); SHORT0.put(x[0], x[2]); }
    }
    public static final String DOC = ICON_PATHS.get("doc");
    /** A square's mark as a path (work-draw.js's markPath): its own, else one of the icons, else the doc. */
    public static String markPath(String dest) { String k = MARK.containsKey(dest) ? MARK.get(dest) : "doc"; return MARK_PATHS.containsKey(k) ? MARK_PATHS.get(k) : ICON_PATHS.containsKey(k) ? ICON_PATHS.get(k) : DOC; }

    public static final class Dest { public String id, name, shortName, mark; public boolean logo; public double x, y, nx, ny; public int count; public double litUntil; }
    public static final class Row { public double at; public String maker, icon, dest, key; }
    public static final class Flight { public String maker, icon, dest; public int n; public double min, t0; }

    public final List<Dest> dests = new ArrayList<>();
    public final Map<String, Dest> byId = new LinkedHashMap<>();
    public final String level;

    /** rimPoint(t): a point along the hexagon's perimeter, clockwise from the top-left corner, t in [0, 1). */
    static double[] rimPoint(double t) {
        double k = ((t % 1) + 1) % 1 * 6, f = k - Math.floor(k); int i = (int) Math.floor(k); double[] a = HEX[i], b = HEX[(i + 1) % 6];
        return new double[] { a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f };
    }

    /** A level from its file: Deliverables (deliveries.json, work.js's own ten, their names and slots) or Workstreams
     *  (workstreams.json, its own ten named in the file, work.js's variant()); each with names, short names and places (on the rim). */
    public Work(String level, Object file) {
        this.level = level; boolean ws = "workstreams".equals(level);
        Map<String, Object> W = Json.obj(file); List<Object> ds = ws ? Json.arr(W.get("dests")) : new ArrayList<>(java.util.Arrays.asList((Object[]) DESTS0)); Map<String, Object> names = Json.obj(W.get("names"));
        for (int i = 0; i < ds.size() && i < SLOTS.length; i++) {
            Dest d = new Dest(); d.id = Json.str(ds.get(i));
            if (ws) {
                String nm = Json.str(names.get(d.id)); d.name = nm == null ? d.id : nm;
                // work.js's variant(): the short name is the title without "WS-NN " (its square shows the number); "other workstreams" is "other"
                d.shortName = d.name.replaceFirst("^WS-\\d+\\s+", "").replaceFirst("(?i)^other workstreams$", "other");
            } else { d.name = NAMES0.get(d.id); d.shortName = SHORT0.get(d.id); d.logo = LOGO.contains(d.id); }
            d.mark = d.id.matches("^WS-\\d+$") ? d.id.substring(3) : "";
            double[] p = rimPoint((SLOTS[i][0] + SLOTS[i][1]) / 6); d.x = p[0]; d.y = p[1]; d.nx = (p[0] - C) / C; d.ny = (p[1] - C) / C;
            dests.add(d); byId.put(d.id, d);
        }
    }

    /** The rows of the file, with real times (ms), as work-live.js's rowsOf(): only known icons and this level's destinations. */
    public List<Row> rows(Object file) {
        Map<String, Object> W = Json.obj(file); double from = Iso.parse(Json.str(W.get("from")));
        List<Object> makers = Json.arr(W.get("makers")), icons = Json.arr(W.get("icons")), ds = Json.arr(W.get("dests")), repos = Json.arr(W.get("repos"));
        List<Row> out = new ArrayList<>();
        for (Object o : Json.arr(W.get("rows"))) {
            List<Object> r = Json.arr(o); if (r.size() < 6) continue;
            Row x = new Row(); x.at = from + Json.num(r.get(0), 0) * 6e4;
            x.maker = at(makers, r.get(1)); x.icon = at(icons, r.get(2)); x.dest = at(ds, r.get(3)); String repo = at(repos, r.get(4));
            if (x.maker == null || x.icon == null || x.dest == null || !byId.containsKey(x.dest) || !ICON_PATHS.containsKey(x.icon)) continue;
            x.key = (repo == null ? "" : repo) + ":" + Json.str(r.get(5)) + ":" + x.dest; out.add(x);
        }
        return out;
    }
    private static String at(List<Object> a, Object i) { int k = (int) Json.num(i, -1); return k >= 0 && k < a.size() ? Json.str(a.get(k)) : null; }

    /** work.js's merge(): deliveries to the same destination in the same minute make one flight with a number; its icon the most
     *  frequent kind among them, its maker the one who sent most (the first seen on a tie); in time order, then destinations' order. */
    public List<Flight> merge(List<Row> list) {
        Map<String, Flight> g = new LinkedHashMap<>(); Map<String, Map<String, Integer>> ic = new LinkedHashMap<>(), mk = new LinkedHashMap<>();
        for (Row d : list) {
            double min = Math.floor(d.at / 6e4); String k = (long) min + "|" + d.dest;
            Flight f = g.get(k); if (f == null) { f = new Flight(); f.min = min; f.dest = d.dest; g.put(k, f); ic.put(k, new LinkedHashMap<>()); mk.put(k, new LinkedHashMap<>()); }
            f.n++; ic.get(k).merge(d.icon, 1, Integer::sum); mk.get(k).merge(d.maker, 1, Integer::sum);
        }
        List<Flight> out = new ArrayList<>();
        for (Map.Entry<String, Flight> e : g.entrySet()) { Flight f = e.getValue(); f.icon = top(ic.get(e.getKey())); f.maker = top(mk.get(e.getKey())); out.add(f); }
        List<String> order = new ArrayList<>(byId.keySet());
        Collections.sort(out, (a, b) -> a.min != b.min ? Double.compare(a.min, b.min) : Integer.compare(order.indexOf(a.dest), order.indexOf(b.dest)));
        return out;
    }
    private static String top(Map<String, Integer> m) { String b = null; int n = -1; for (Map.Entry<String, Integer> e : m.entrySet()) if (e.getValue() > n) { b = e.getKey(); n = e.getValue(); } return b; }

    /** work.js's origin(): where a delivery leaves from: the maker's own node, else its person's, else nowhere. */
    public static Graph.Node origin(Graph g, String maker) {
        Graph.Node n = g.byId.get(maker); if (n != null) return n;
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("^pt:([a-z0-9-]+):").matcher(maker);
        String p = m.find() ? m.group(1) : null;
        if (p == null) { m = java.util.regex.Pattern.compile("@[a-z-]+\\.([a-z0-9-]+)$", java.util.regex.Pattern.CASE_INSENSITIVE).matcher(maker); p = m.find() ? m.group(1) : null; }
        Graph.Node P = p == null ? null : g.byId.get(p); return P != null && "p".equals(P.kind) ? P : null;
    }

    /** work.js's along(): a point on the curve from a to b bent towards the centre by pull (0.18), at t; in the page's 1000-unit frame. */
    public static void along(double ax, double ay, double bx, double by, double t, double[] out) {
        double qx = (ax + bx) / 2 + (C - (ax + bx) / 2) * 0.18, qy = (ay + by) / 2 + (C - (ay + by) / 2) * 0.18, u = 1 - t;
        out[0] = u * u * ax + 2 * u * t * qx + t * t * bx; out[1] = u * u * ay + 2 * u * t * qy + t * t * by;
    }
    /** work-draw.js's easing of a flight: in and out. */
    public static double ease(double u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }

    /** work.js's strokeFor(): in the light theme an icon's stroke is its sender's colour darkened, 5% at a time, until it reads at
     *  3:1 on white (the contrast for graphics); in the dark it is the colour as it is. */
    public static int strokeFor(int c, boolean light) {
        if (!light) return c;
        int[] o = { (c >> 16) & 255, (c >> 8) & 255, c & 255 }, rgb = o.clone(); double k = 1;
        while (contrast(rgb, new int[] { 255, 255, 255 }) < 3 && k > 0.05) { k -= 0.05; for (int i = 0; i < 3; i++) rgb[i] = (int) Math.round(o[i] * k); }
        return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
    }
    static double lum(int[] c) { double[] f = new double[3]; for (int i = 0; i < 3; i++) { double v = c[i] / 255.0; f[i] = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); } return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; }
    static double contrast(int[] a, int[] b) { double x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

    // ---------------------------------------------------------------- the pills (work-draw.js's pillsFor)
    public static final class Pill { public double x, y, w, h; public String mode, text; }
    static double wOf(String t, double font) { return Math.round(t.length() * font * 0.56 + font * 1.2); }
    static String fit(String t, double room, double font) {
        if (wOf(t, font) <= room) return t;
        int n = (int) Math.max(4, Math.floor((room - font * 1.2) / (font * 0.56)));
        return t.length() <= n ? t : t.substring(0, n - 1).replaceFirst("[\\s.,:;-]+$", "") + "…";
    }
    /** Each destination's pill: beside its square outside the rim when the frame [lo, hi] leaves room (the full name, else the
     *  short one), else inside the rim on the square's inner side, at most 28% of the drawing across; then moved apart vertically
     *  until no pill overlaps another, the furniture (avoid: boxes) or another square. In the page's 1000-unit frame. */
    public Map<String, Pill> pills(double font, double lo, double hi, double sq, List<double[]> avoid) {
        double h = Math.round(font * 1.6), gap = Math.round(font * 0.5); Map<String, Pill> out = new LinkedHashMap<>();
        for (Dest p : dests) {
            boolean right = p.x > C; Pill b = null;
            if (Math.abs(p.ny) > 0.8) { String t = fit(p.name, hi - lo, font); double w = wOf(t, font); b = pill(Math.max(lo, Math.min(hi - w, p.x - w / 2)), p.ny < 0 ? p.y - sq / 2 - gap - h : p.y + sq / 2 + gap, w, h, "beside", t); }
            else {
                double room = right ? hi - (p.x + sq / 2 + gap) : (p.x - sq / 2 - gap) - lo;
                for (String t : new String[] { p.name, p.shortName }) if (b == null && wOf(t, font) <= room) { double w = wOf(t, font); b = pill(right ? p.x + sq / 2 + gap : p.x - sq / 2 - gap - w, p.y - h / 2, w, h, "beside", t); }
                if (b == null) {
                    double inner = Math.min(INSIDE * S, right ? (p.x - sq / 2 - gap) - lo : hi - (p.x + sq / 2 + gap)); String t = fit(p.shortName, inner, font); double w = wOf(t, font);
                    b = pill(right ? p.x - sq / 2 - gap - w : p.x + sq / 2 + gap, p.y - h / 2, w, h, "inside", t);
                }
            }
            out.put(p.id, b);
        }
        List<Pill> all = new ArrayList<>(out.values()); List<String> ids = new ArrayList<>(out.keySet());
        for (int round = 0; round < 6; round++) {
            boolean moved = false;
            for (int pass = 0; pass < 6; pass++) for (int i = 0; i < all.size(); i++) for (int j = i + 1; j < all.size(); j++) {
                Pill a = all.get(i), b = all.get(j);
                if (overlap(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h)) { Pill up = a.y + a.h / 2 < b.y + b.h / 2 ? a : b, down = up == a ? b : a; double need = (up.y + up.h + 4 - down.y) / 2; up.y -= need; down.y += need; moved = true; }
            }
            for (int i = 0; i < all.size(); i++) {
                Pill a = all.get(i); List<double[]> blocks = new ArrayList<>(avoid);
                for (Dest q : dests) if (!q.id.equals(ids.get(i))) blocks.add(new double[] { q.x - sq / 2 - 2, q.y - sq / 2 - 2, sq + 4, sq + 4 });
                for (int k = 0; k < 4; k++) {
                    double[] o = null; for (double[] x : blocks) if (overlap(a.x, a.y, a.w, a.h, x[0], x[1], x[2], x[3])) { o = x; break; }
                    if (o == null) break; a.y = a.y + a.h / 2 < o[1] + o[3] / 2 ? o[1] - a.h - 4 : o[1] + o[3] + 4; moved = true;
                }
            }
            if (!moved) break;
        }
        return out;
    }
    private static Pill pill(double x, double y, double w, double h, String mode, String t) { Pill p = new Pill(); p.x = x; p.y = y; p.w = w; p.h = h; p.mode = mode; p.text = t; return p; }
    private static boolean overlap(double ax, double ay, double aw, double ah, double bx, double by, double bw, double bh) { return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah; }

    // ---------------------------------------------------------------- the level live (work-live.js): one per wallpaper

    public final List<Flight> inAir = new ArrayList<>();
    private final List<Flight> queue = new ArrayList<>();
    private final Set<String> seen = new HashSet<>();
    private final List<double[]> past = new ArrayList<>();   // { at, destination index }: for the counts
    private boolean firstRead = true;
    public double delayMs = Graph.DELAY_MS;

    /** A new copy of the file. Opening, nothing older than the delay plays; afterwards each new delivery flies at its moment plus
     *  the delay (merged by minute and destination), one that reached us later flying at once, a beat apart. */
    public void read(List<Row> list, double wallMs, double now) {
        List<Row> fresh = new ArrayList<>(); List<String> order = new ArrayList<>(byId.keySet());
        for (Row d : list) {
            if (!seen.add(d.key)) continue;
            past.add(new double[] { d.at, order.indexOf(d.dest) });
            if (firstRead && d.at <= wallMs - delayMs) continue;
            fresh.add(d);
        }
        firstRead = false; int late = 0;
        for (Flight f : merge(fresh)) { double due = f.min * 6e4 + delayMs - wallMs; f.t0 = due > 0 ? now + due : now + 350 * late++; queue.add(f); }
        Collections.sort(queue, (a, b) -> Double.compare(a.t0, b.t0));
        recount(wallMs);
    }
    /** The squares' counts: deliveries in the last 24 hours, up to the delay behind now (as work-live.js's recount). */
    public void recount(double wallMs) {
        for (Dest d : dests) d.count = 0;
        for (double[] p : past) if (p[0] > wallMs - DAY_MS && p[0] <= wallMs - delayMs && p[1] >= 0) dests.get((int) p[1]).count++;
    }
    /** One frame: due flights take off; landed ones light their square for 0.9 s. */
    public void step(double now) {
        while (!queue.isEmpty() && queue.get(0).t0 <= now) inAir.add(queue.remove(0));
        for (int i = inAir.size() - 1; i >= 0; i--) { Flight f = inAir.get(i); if (now - f.t0 >= FLIGHT_MS) { inAir.remove(i); Dest d = byId.get(f.dest); if (d != null) d.litUntil = now + 900; } }
    }
    /** Carries the counts and what has been seen over to the same level rebuilt (a change of layout or theme). */
    public void takeOver(Work old) { if (old == null || !old.level.equals(level)) return; seen.addAll(old.seen); past.addAll(old.past); firstRead = old.firstRead; for (Dest d : dests) { Dest o = old.byId.get(d.id); if (o != null) d.count = o.count; } }
    public int pending() { return queue.size(); }
}
