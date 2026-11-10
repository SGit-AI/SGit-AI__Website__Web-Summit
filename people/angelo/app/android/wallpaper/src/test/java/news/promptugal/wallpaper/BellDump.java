package news.promptugal.wallpaper;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

/**
 * For hxwallbell.test.js: the wallpaper's Bell over the site's built deliveries.json or workstreams.json, printed as JSON for the
 * test to compare with work-bell.js on the same file.  java BellDump <file> <level> <nowMs> <people, comma separated>
 * By dashboard@PrompTugal.angelo, 10 November 2026 (WS-203).
 */
public final class BellDump {
    public static void main(String[] a) throws Exception {
        Object f = Json.parse(new String(Files.readAllBytes(Paths.get(a[0])), "UTF-8")); String level = a[1]; double now = Double.parseDouble(a[2]);
        Set<String> people = new LinkedHashSet<>(Arrays.asList(a[3].split(",")));
        Work w = new Work(level, f); List<String> dests = new ArrayList<>(); Map<String, String> names = new HashMap<>();
        for (Work.Dest d : w.dests) { dests.add(d.id); names.put(d.id, d.name); }
        Bell.Routes R = Bell.routes(w.rows(f), now, people);
        StringBuilder o = new StringBuilder("{\"routes\":[");
        for (int i = 0; i < R.routes.size(); i++) { Bell.Route r = R.routes.get(i); o.append(i > 0 ? "," : "").append(String.format(Locale.ROOT, "[%s,%s,%d,%.2f]", q(r.person), q(r.dest), r.n, Bell.width(r.n, R.max))); }
        o.append("],\"max\":").append(R.max).append(",\"layouts\":{");
        int k = 0;
        for (String or : new String[] { "left", "right", "top", "below" }) {
            Bell.Layout L = Bell.layout(or, dests, R.weights, names);
            o.append(k++ > 0 ? "," : "").append(q(or)).append(String.format(Locale.ROOT, ":{\"w\":%.1f,\"h\":%.1f,\"net\":[%.2f,%.2f,%.1f],\"order\":%s,\"places\":{", L.w, L.h, L.netX, L.netY, L.netR, q(L.order)));
            int j = 0;
            for (Map.Entry<String, Bell.Place> e : L.places.entrySet()) {
                Bell.Place p = e.getValue(); double[] l1 = Bell.label(p, 36, 26, p.abbr.length(), false), l2 = Bell.label(p, 36, 40, p.abbr.length(), true);
                double[] c = Bell.route(or, L.netX, L.netY, p); double[] m = new double[2]; Bell.at(c, 0.37, m);
                o.append(j++ > 0 ? "," : "").append(q(e.getKey())).append(String.format(Locale.ROOT, ":{\"x\":%.4f,\"y\":%.4f,\"nx\":%.5f,\"ny\":%.5f,\"row\":%d,\"quiet\":%b,\"abbr\":%s,\"l1\":[%.4f,%.4f],\"l2\":[%.4f,%.4f],\"mid\":[%.4f,%.4f]}",
                        p.x, p.y, p.nx, p.ny, p.row, p.quiet, q(p.abbr), l1[0], l1[1], l2[0], l2[1], m[0], m[1]));
            }
            o.append("}}");
        }
        o.append("},\"orient\":[").append(q(Bell.orient("auto", 390, 844))).append(",").append(q(Bell.orient("auto", 1280, 800))).append(",").append(q(Bell.orient("below", 1280, 800))).append("]");
        o.append(",\"person\":[").append(q(Bell.personOf("pt:angelo:dev.map"))).append(",").append(q(Bell.personOf("conductor@web-summit.dinis"))).append(",").append(q(Bell.personOf("vicky"))).append("]}");
        System.out.println(o);
    }
    static String q(String s) { if (s == null) return "null"; StringBuilder b = new StringBuilder("\""); for (char c : s.toCharArray()) { if (c == '"' || c == '\\') b.append('\\').append(c); else if (c < 32 || c > 126) b.append(String.format("\\u%04x", (int) c)); else b.append(c); } return b.append('"').toString(); }
}
