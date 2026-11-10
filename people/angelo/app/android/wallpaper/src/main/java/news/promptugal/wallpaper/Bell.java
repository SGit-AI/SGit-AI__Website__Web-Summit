package news.promptugal.wallpaper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The deliveries as a dumbbell on the wallpaper (spec: people/angelo/proposals/live-map/dumbbell/spec-dumbbell.md, approved by
 * Angelo on 9 November; the page's version by dev.work@, backlog 0c5). A line-for-line port of the page's work-bell.js: the five
 * orientations, the frame, the bell's places (the busiest in the middle, the quiet ones at the ends), each icon's abbreviation and
 * where it sits, the routes by person over seven days, their widths and curves, and where the network's circle lies. No Android
 * class here: hxwallbell.test.js runs it on a JVM against work-bell.js. By dashboard@PrompTugal.angelo, 10 November 2026 (WS-203).
 */
public final class Bell {
    public static final String[] ORIENTS = { "auto", "top", "below", "left", "right" };
    public static final Map<String, String> ABBR = new LinkedHashMap<>();
    static {
        String[][] a = { { "news", "PTN" }, { "site", "SITE" }, { "research", "RSCH" }, { "infra", "INFR" }, { "app", "APP" }, { "keys", "KEYS" }, { "crm", "CRM" }, { "email", "MAIL" }, { "linkedin", "LNKD" }, { "drafts", "DRFT" } };
        for (String[] x : a) ABBR.put(x[0], x[1]);
    }
    public static final double WEEK = 7 * 864e5;
    public static final double LW = 1700, LH = 1100, TP = 100, TALL_R = 1200, TALL_SPAN = 0.5;
    static final double NETX = 440, NETY = 550, NETR = 400;
    // the bells: { x, y, r, span } for the team on the left or right (wide), on top or below (tall, flatter)
    static final double[] WIDE = { 1770, 550, 500, Math.PI / 3 }, TALL = { 1270 + TALL_R, 550, TALL_R, TALL_SPAN };

    public static final class Place { public double x, y, nx, ny; public int row; public boolean quiet; public String abbr; }
    public static final class Layout { public String or; public double w, h, netX, netY, netR; public final Map<String, Place> places = new LinkedHashMap<>(); public String order; }
    public static final class Route { public String person, dest; public int n; }
    public static final class Routes { public final List<Route> routes = new ArrayList<>(); public final Map<String, Integer> weights = new HashMap<>(); public int max; }

    static List<Integer> slotOrder(int n) {
        double mid = (n - 1) / 2.0; List<Integer> idx = new ArrayList<>(); for (int i = 0; i < n; i++) idx.add(i);
        Collections.sort(idx, (a, b) -> { int c = Double.compare(Math.abs(a - mid), Math.abs(b - mid)); return c != 0 ? c : Integer.compare(a, b); });
        return idx;
    }
    public static String orient(String o, double w, double h) { return Arrays.asList(ORIENTS).contains(o) && !"auto".equals(o) ? o : (w > 0 && h > w ? "top" : "left"); }
    static double[] turn(String or, double x, double y) {
        if ("left".equals(or)) return new double[] { x, y };
        if ("right".equals(or)) return new double[] { LW - x, y };
        if ("top".equals(or)) return new double[] { y + TP, x };
        return new double[] { y + TP, LW - x };   // below
    }
    static double[] turnV(String or, double x, double y) { double[] a = turn(or, 0, 0), b = turn(or, x, y); return new double[] { b[0] - a[0], b[1] - a[1] }; }
    static double[] box(String or) { return "left".equals(or) || "right".equals(or) ? new double[] { LW, LH } : new double[] { LH + 2 * TP, LW }; }

    /** The destinations in the bell's places: the busiest in the middle, the quiet ones towards the ends; ties keep their order. */
    public static List<String> ordered(List<String> dests, Map<String, Integer> weights) {
        List<Integer> by = new ArrayList<>(); for (int i = 0; i < dests.size(); i++) by.add(i);
        Collections.sort(by, (a, b) -> { int wa = weights.getOrDefault(dests.get(a), 0), wb = weights.getOrDefault(dests.get(b), 0); return wa != wb ? Integer.compare(wb, wa) : Integer.compare(a, b); });
        String[] out = new String[dests.size()]; List<Integer> slots = slotOrder(dests.size());
        for (int k = 0; k < slots.size(); k++) out[slots.get(k)] = dests.get(by.get(k));
        return Arrays.asList(out);
    }

    /** The frame for an orientation: its size, the network's circle and each destination's place, facing (nx, ny) and abbreviation. */
    public static Layout layout(String or, List<String> dests, Map<String, Integer> weights, Map<String, String> names) {
        List<String> order = ordered(dests, weights); int n = order.size(); double[] B = "left".equals(or) || "right".equals(or) ? WIDE : TALL;
        Layout L = new Layout(); L.or = or; double[] bx = box(or); L.w = bx[0]; L.h = bx[1]; L.order = String.join(",", order);
        for (int i = 0; i < n; i++) {
            String d = order.get(i); double t = n > 1 ? (double) i / (n - 1) * 2 - 1 : 0, a = Math.PI + t * B[3];
            double px = B[0] + B[2] * Math.cos(a), py = B[1] - B[2] * Math.sin(a);
            double[] q = turn(or, px, py), f = turnV(or, Math.cos(a), -Math.sin(a));
            Place p = new Place(); p.x = q[0]; p.y = q[1]; p.nx = f[0]; p.ny = f[1]; p.row = i % 2; p.quiet = weights.getOrDefault(d, 0) <= 0;
            p.abbr = ABBR.containsKey(d) ? ABBR.get(d) : abbrOf(d, names == null ? null : names.get(d)); L.places.put(d, p);
        }
        double[] c = turn(or, NETX, NETY); L.netX = c[0]; L.netY = c[1]; L.netR = NETR;
        return L;
    }

    /** Where an icon's abbreviation goes, relative to the icon: { x, y (the baseline), w, h, cx, cy }; straight out from the icon,
     *  away from the team, or (stagger, on a small screen) every other one on the bell's inner side. */
    public static double[] label(Place p, double half, double font, int n, boolean stagger) {
        double w = n * font * 0.86, h = font; boolean flip = stagger && p.row == 1; double ox = flip ? p.nx : -p.nx, oy = flip ? p.ny : -p.ny;
        double g = font * 0.35, ax = Math.abs(ox) > 1e-9 ? (half + w / 2 + g) / Math.abs(ox) : Double.POSITIVE_INFINITY, ay = Math.abs(oy) > 1e-9 ? (half + h / 2 + g) / Math.abs(oy) : Double.POSITIVE_INFINITY;
        double d = Math.min(ax, ay), cx = ox * d, cy = oy * d;
        return new double[] { cx, cy + font * 0.36, w, h, cx, cy };
    }

    static final Set<String> SMALL = new HashSet<>(Arrays.asList("the", "a", "an", "of", "and", "for", "to", "in", "on", "our", "its", "with"));
    /** A workstream's abbreviation (its first word that says something, four letters); "other workstreams" is OTHR. */
    public static String abbrOf(String d, String name) {
        String t = (name == null ? d : name).replaceFirst("^WS-\\d+\\s+", "");
        if (t.matches("(?i)^other workstreams$") || "other".equals(d)) return "OTHR";
        List<String> ws = new ArrayList<>(); for (String x : t.split("[^A-Za-z0-9]+")) if (!x.isEmpty()) ws.add(x);
        String w = null; for (String x : ws) if (!SMALL.contains(x.toLowerCase())) { w = x; break; }
        if (w == null) w = ws.isEmpty() ? d : ws.get(0);
        return (w.length() > 4 ? w.substring(0, 4) : w).toUpperCase();
    }

    static final Pattern PT = Pattern.compile("^pt:([a-z0-9-]+):"), AT = Pattern.compile("@[a-z0-9-]+\\.([a-z0-9-]+)$", Pattern.CASE_INSENSITIVE), BARE = Pattern.compile("^[a-z0-9-]+$");
    /** The person a maker belongs to: pt:<person>:<agent>, <agent>@<project>.<person>, or a person's own id. */
    public static String personOf(String maker) {
        String s = maker == null ? "" : maker; Matcher m = PT.matcher(s); if (m.find()) return m.group(1).toLowerCase();
        m = AT.matcher(s); if (m.find()) return m.group(1).toLowerCase();
        return BARE.matcher(s).matches() ? s : null;
    }

    /** The last seven days' deliveries by person and destination (people the map draws only), the busiest first. */
    public static Routes routes(List<Work.Row> list, double now, Set<String> people) {
        Map<String, Integer> g = new LinkedHashMap<>(); Routes R = new Routes();
        for (Work.Row d : list) {
            if (!(d.at > now - WEEK && d.at <= now)) continue;
            String p = personOf(d.maker); if (p == null || (people != null && !people.contains(p))) continue;
            g.merge(p + "|" + d.dest, 1, Integer::sum); R.weights.merge(d.dest, 1, Integer::sum);
        }
        for (Map.Entry<String, Integer> e : g.entrySet()) { int i = e.getKey().indexOf('|'); Route r = new Route(); r.person = e.getKey().substring(0, i); r.dest = e.getKey().substring(i + 1); r.n = e.getValue(); R.routes.add(r); }
        Collections.sort(R.routes, (a, b) -> a.n != b.n ? Integer.compare(b.n, a.n) : (a.person + a.dest).compareTo(b.person + b.dest));
        for (Route r : R.routes) R.max = Math.max(R.max, r.n);
        return R;
    }
    /** A route's width in the frame's units: thin for one delivery, at most 18 for the busiest (by the square root). */
    public static double width(int n, int max) { return n > 0 && max > 0 ? Math.round((1.5 + 16.5 * Math.sqrt((double) n / max)) * 100) / 100.0 : 0; }
    /** The cubic from a person's place (ax, ay) to an icon's: leaves along the axis, arrives square on. Four points, x then y. */
    public static double[] route(String or, double ax, double ay, Place b) {
        double[] v = turnV(or, 1, 0); double L = Math.hypot(b.x - ax, b.y - ay) * 0.42;
        return new double[] { ax, ay, ax + v[0] * L, ay + v[1] * L, b.x + b.nx * L, b.y + b.ny * L, b.x, b.y };
    }
    public static void at(double[] c, double t, double[] out) {
        double u = 1 - t, k0 = u * u * u, k1 = 3 * u * u * t, k2 = 3 * u * t * t, k3 = t * t * t;
        out[0] = k0 * c[0] + k1 * c[2] + k2 * c[4] + k3 * c[6]; out[1] = k0 * c[1] + k1 * c[3] + k2 * c[5] + k3 * c[7];
    }
}
