package news.promptugal.wallpaper;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;

/**
 * For the contract test (people/angelo/app/tests/hxappwall.test.js): runs the wallpaper's Graph on a plain JVM over the
 * site's own built data.json and live.json, and prints what it would draw as JSON, for the test to compare with the page's
 * live.js and live3d.js on the same files.  java ContractDump <data.json> <live.json> <wallMs>
 * By dev.app@PrompTugal.angelo, 8 November 2026 (backlog 00a2).
 */
public final class ContractDump {
    public static void main(String[] a) throws Exception {
        Graph g = Graph.fromData(Json.parse(new String(Files.readAllBytes(Paths.get(a[0])), "UTF-8")));
        List<Graph.Event> evs = Graph.events(Json.parse(new String(Files.readAllBytes(Paths.get(a[1])), "UTF-8")));
        double wall = Double.parseDouble(a[2]);
        StringBuilder o = new StringBuilder("{\"nodes\":[");
        for (Graph.Node n : g.nodes) o.append(String.format(Locale.ROOT, "%s{\"id\":%s,\"kind\":\"%s\",\"x\":%.6f,\"y\":%.6f,\"z\":%.6f,\"size\":%.6f,\"rgb\":[%.5f,%.5f,%.5f],\"ring\":%b,\"label\":%s}",
                n.index > 0 ? "," : "", q(n.id), n.kind, n.x, n.y, n.z, n.size, n.r, n.g, n.b, n.ring, q(n.label)));
        o.append("],\"links\":[");
        for (int i = 0; i < g.links.size(); i++) { Graph.Link l = g.links.get(i); double[] m = new double[3]; Graph.curveAt(l.from, l.to, 0.5, m);
            o.append(String.format(Locale.ROOT, "%s{\"from\":%s,\"to\":%s,\"alpha\":%.6f,\"mid\":[%.4f,%.4f,%.4f]}", i > 0 ? "," : "", q(l.from.id), q(l.to.id), g.baseAlpha(l), m[0], m[1], m[2])); }
        o.append("],\"events\":[");
        for (int i = 0; i < evs.size(); i++) { Graph.Event e = evs.get(i); Graph.Node f = g.nodeOf(e.agent);
            StringBuilder to = new StringBuilder(); for (String t : e.to) { Graph.Node n = g.nodeOf(t); to.append(to.length() > 0 ? "," : "").append(n == null ? "null" : q(n.id)); }
            o.append(String.format(Locale.ROOT, "%s{\"sha\":%s,\"ms\":%.0f,\"from\":%s,\"to\":[%s]}", i > 0 ? "," : "", q(e.sha), e.ms, f == null ? "null" : q(f.id), to)); }
        // the engine: read once at wall, then 30 s of frames at 15 a second
        g.seed(1); g.read(evs, wall, 1000);
        int pending = g.pending(); StringBuilder ran = new StringBuilder(); for (Graph.Node n : g.ran) ran.append(ran.length() > 0 ? "," : "").append(q(n.id));
        int real = 0, maxFlow = 0; double t = 1000;
        for (int f = 0; f < 450; f++) { t += 1000 / 15.0; int before = g.fly.size(); g.step(t, 1000 / 15.0); for (Graph.Fly x : g.fly) if (!x.flow && x.t0 == t) real++; maxFlow = Math.max(maxFlow, g.flowing()); }
        double lit = 0; for (Graph.Line l : g.lines.values()) lit = Math.max(lit, l.op);
        o.append(String.format(Locale.ROOT, "],\"engine\":{\"act\":%.6f,\"breath\":%.6f,\"queued\":%d,\"ran\":[%s],\"realLaunched\":%d,\"maxFlow\":%d,\"lines\":%d,\"maxOp\":%.2f,\"left\":%d}",
                g.act, g.breath, pending, ran, real, maxFlow, g.lines.size(), lit, g.pending()));
        o.append(",\"shaders\":{\"vsPts\":").append(q(Shaders.VS_PTS)).append(",\"fsPts\":[");
        for (int k = 0; k < 4; k++) o.append(k > 0 ? "," : "").append(q(Shaders.fsPts(k)));
        o.append("],\"vsLn\":").append(q(Shaders.VS_LN)).append(",\"fsLn\":").append(q(Shaders.FS_LN)).append(",\"vsTx\":").append(q(Shaders.VS_TX)).append(",\"fsTx\":").append(q(Shaders.FS_TX)).append("}}");
        System.out.println(o);
    }
    private static String q(String s) {
        if (s == null) return "null";
        StringBuilder b = new StringBuilder("\"");
        for (char c : s.toCharArray()) { if (c == '"' || c == '\\') b.append('\\').append(c); else if (c == '\n') b.append("\\n"); else if (c < 32) b.append(String.format("\\u%04x", (int) c)); else b.append(c); }
        return b.append('"').toString();
    }
}
