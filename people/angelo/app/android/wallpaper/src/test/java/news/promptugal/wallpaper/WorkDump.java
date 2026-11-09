package news.promptugal.wallpaper;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * For hxwallws.test.js: runs the wallpaper's Work (the Workstreams level) on a plain JVM over the site's built workstreams.json and
 * prints what it would draw as JSON, for the test to compare with work.js and work-draw.js on the same file.
 *   java WorkDump <file> <level: workstreams | deliverables> <wallMs> <font> <lo> <hi> <sq>
 * By dashboard@PrompTugal.angelo, 9 November 2026 (WS-203).
 */
public final class WorkDump {
    public static void main(String[] a) throws Exception {
        Object f = Json.parse(new String(Files.readAllBytes(Paths.get(a[0])), "UTF-8"));
        double wall = Double.parseDouble(a[2]), font = Double.parseDouble(a[3]), lo = Double.parseDouble(a[4]), hi = Double.parseDouble(a[5]), sq = Double.parseDouble(a[6]);
        Work w = new Work(a[1], f); List<Work.Row> rows = w.rows(f);
        StringBuilder o = new StringBuilder("{\"dests\":[");
        for (int i = 0; i < w.dests.size(); i++) { Work.Dest d = w.dests.get(i); o.append(String.format(Locale.ROOT, "%s{\"id\":%s,\"name\":%s,\"short\":%s,\"mark\":%s,\"logo\":%b,\"path\":%s,\"x\":%.4f,\"y\":%.4f}", i > 0 ? "," : "", q(d.id), q(d.name), q(d.shortName), q(d.mark), d.logo, q(Work.markPath(d.id)), d.x, d.y)); }
        o.append("],\"rows\":").append(rows.size()).append(",\"merged\":[");
        List<Work.Flight> m = w.merge(rows);
        for (int i = 0; i < m.size(); i++) { Work.Flight x = m.get(i); o.append(String.format(Locale.ROOT, "%s[%.0f,%s,%d,%s,%s]", i > 0 ? "," : "", x.min, q(x.dest), x.n, q(x.icon), q(x.maker))); }
        o.append("],\"pills\":{");
        Map<String, Work.Pill> P = w.pills(font, lo, hi, sq, new ArrayList<>()); int k = 0;
        for (Map.Entry<String, Work.Pill> e : P.entrySet()) { Work.Pill p = e.getValue(); o.append(String.format(Locale.ROOT, "%s%s:{\"x\":%.3f,\"y\":%.3f,\"w\":%.3f,\"h\":%.3f,\"mode\":%s,\"text\":%s}", k++ > 0 ? "," : "", q(e.getKey()), p.x, p.y, p.w, p.h, q(p.mode), q(p.text))); }
        o.append("},\"icons\":{"); k = 0;
        for (Map.Entry<String, String> e : Work.ICON_PATHS.entrySet()) o.append(k++ > 0 ? "," : "").append(q(e.getKey())).append(":").append(q(e.getValue()));
        o.append("},\"strokes\":[");
        for (int i = 0; i < Graph.COL.length; i++) o.append(i > 0 ? "," : "").append(Work.strokeFor(Graph.LIGHT.col[i], true));
        // the live reading: opening at wall, nothing older than the delay queued; the counts for the last 24 hours
        w.read(rows, wall, 1000);
        o.append("],\"queued\":").append(w.pending()).append(",\"counts\":[");
        for (int i = 0; i < w.dests.size(); i++) o.append(i > 0 ? "," : "").append(w.dests.get(i).count);
        double[] p = new double[2]; Work.along(100, 200, 900, 300, 0.3, p);
        o.append(String.format(Locale.ROOT, "],\"along\":[%.5f,%.5f],\"ease\":[%.5f,%.5f]}", p[0], p[1], Work.ease(0.3), Work.ease(0.8)));
        System.out.println(o);
    }
    private static String q(String s) {
        if (s == null) return "null";
        StringBuilder b = new StringBuilder("\"");
        for (char c : s.toCharArray()) { if (c == '"' || c == '\\') b.append('\\').append(c); else if (c < 32) b.append(String.format("\\u%04x", (int) c)); else if (c > 126) b.append(String.format("\\u%04x", (int) c)); else b.append(c); }
        return b.append('"').toString();
    }
}
