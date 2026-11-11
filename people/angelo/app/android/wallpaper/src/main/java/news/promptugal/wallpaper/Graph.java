package news.promptugal.wallpaper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The drawing contract of the live 3D map, for the Android live wallpaper (backlog 00a2; spec:
 * people/angelo/proposals/live-map/spec-live-app.md, "A live phone background"). What is drawn, where, in which colour and
 * when, ported line for line from the page's own renderer so the phone and the browser show the same graph:
 *   - where:  live.js's layout() (the people ring) and live3d.js's ball() (the ball, not a disk);
 *   - what:   data.json's collab.map (people, agents, sessionless agents, links) and live.json (who, to whom, when);
 *   - when:   live.js's engine (each exchange at its real moment, four minutes behind; the constant faint flow along every
 *             line, as dense as that pair has been lately; lit lines fading; busy agents larger; the breathing);
 *   - colour: the site's dark theme (assets/cc/app.css), lifted towards white as live3d.js does in the dark.
 * No Android class here: the tests run it on a plain JVM against the same recorded files as the page
 * (people/angelo/app/tests/hxappwall.test.js). Public record only: names, lines and times; never a word of a message.
 * By dev.app@PrompTugal.angelo, 8 November 2026.
 */
public final class Graph {
    // live.js: the map's square, the people ring's radius, how far lines bend inward
    public static final double C = 500, RP = 300, PULL = 0.55;
    // live.js's COL in the dark theme (app.css): conductor, dev, gold, video, green, outreach, orange, blue, red
    public static final int[] COL = { 0xA855F7, 0x06B6D4, 0xF5B942, 0xEC4899, 0x22C55E, 0x6366F1, 0xF97316, 0x3B82F6, 0xEF4444 };
    public static final int MUTED = 0x9EB2C7, TEXT = 0xF7FAFC, BG = 0x07111F, SURFACE = 0x0E2035, ACTION = 0x05BFE9, LIVE_RED = 0xEF4444;
    // live3d.js
    public static final int SEG = 18, TRAIL = 5, MAXPAIRS = 900, MAXDOTS = 220;
    public static final double FOV = 38, RX = -0.42, DIST = 1650;
    // live.js's engine
    public static final double TRAVEL_MS = 1600, FADE_MS = 3200, FLOW_TRAVEL_MS = 3000, FLOW_BASE = 3.5, HALF_LIFE_H = 3, DELAY_MS = 4 * 60000;
    public static final int FLOW_MAX = 70;
    // the wallpaper's own, calmer than the page (spec: "a calm frame rate, slow spin"): one turn in 80 s, not 50
    public static final double TURN_S = 80;

    // ---------------------------------------------------------------- the views (Angelo, 9 November: "choosing the view as in the website")
    /** The site's two themes (assets/cc/app.css): the page's background, surface, text, muted, action, LIVE's red and the people's colours. */
    public static final class Theme {
        public final boolean light; public final int bg, surface, text, muted, action, live, border, secondary; public final int[] col;
        Theme(boolean light, int bg, int surface, int text, int muted, int action, int gold, int border, int secondary) {
            this.light = light; this.bg = bg; this.surface = surface; this.text = text; this.muted = muted; this.action = action; this.live = LIVE_RED;
            this.border = border; this.secondary = secondary;
            col = COL.clone(); col[2] = gold;   // only the gold differs between the themes (#F5B942 dark, #976000 light)
        }
        /** live3d.js's rgb(): in the dark each colour is lifted towards white; on a light page the colours are as they are. */
        public float[] rgb(int c) { return light ? new float[] { ((c >> 16) & 255) / 255f, ((c >> 8) & 255) / 255f, (c & 255) / 255f } : lift(c); }
    }
    public static final Theme DARK = new Theme(false, 0x07111F, 0x0E2035, 0xF7FAFC, 0x9EB2C7, 0x05BFE9, 0xF5B942, 0x294A64, 0xBCCCDC);
    public static final Theme LIGHT = new Theme(true, 0xF7F8F8, 0xFFFFFF, 0x17243A, 0x56697F, 0x08769A, 0x976000, 0xD3DCE6, 0x43546B);
    /** The layouts the wallpaper offers: the page's 3D ball (live3d.js, from the people ring), and two of live.js's flat layouts. */
    public static final String[] LAYOUTS = { "3d", "ring", "agents" };
    // live.js's GEO: where the people sit, how far lines bend inward, how large the graph is inside the hexagon
    static double[] geo(String L) { return "agents".equals(L) ? new double[] { 445, 0.25, 0.74 } : new double[] { RP, PULL, 0.84 }; }

    public static final class Node {
        public String id, kind, person, label, family; public double commits;
        public double x, y, z, size; public float r, g, b; public boolean ring; public int index; public int color;   // color: the person's, as the theme has it
        double a;   // the person's angle on the ring
    }
    public static final class Link { public final Node from, to; public final double n; Link(Node f, Node t, double n) { from = f; to = t; this.n = n; } }

    public final List<Node> nodes = new ArrayList<>();
    public final Map<String, Node> byId = new LinkedHashMap<>();
    public final List<Link> links = new ArrayList<>();
    /** The agents ring's thin spokes, each agent to its person (live.js's lv-spokes); empty in the other layouts. */
    public final List<Link> spokes = new ArrayList<>();
    public double maxN = 1;
    /** Which view this graph was built for: "3d" (the ball, turning), "ring" or "agents" (flat, as the page's 2D map). */
    public final String layout; public final boolean flat; public final Theme theme; public final double pull;

    // ---------------------------------------------------------------- the model: data.json's collab.map

    /** Builds the graph from data.json (or its collab.map alone): the 3D ball in the dark, as the wallpaper first was. */
    public static Graph fromData(Object dataJson) { return fromData(dataJson, "3d", DARK); }
    /** The same, for a chosen layout ("3d", "ring" or "agents") and theme. Throws if the map is missing. */
    public static Graph fromData(Object dataJson, String layout, Theme theme) {
        Map<String, Object> d = Json.obj(dataJson);
        Map<String, Object> m = d.containsKey("collab") ? Json.obj(Json.obj(d.get("collab")).get("map")) : d;
        if (!m.containsKey("people")) throw new IllegalArgumentException("no collab.map.people in the data");
        return new Graph(m, layout, theme == null ? DARK : theme);
    }

    private Graph(Map<String, Object> M, String layout, Theme theme) {
        this.layout = "ring".equals(layout) || "agents".equals(layout) ? layout : "3d"; this.flat = !"3d".equals(this.layout); this.theme = theme;
        // live.js layout(M, L): the 3D ball starts from the people ring; "agents" puts the people outside and each person's
        // agents in their own sector of one ring inside them
        String L = flat ? this.layout : "ring"; double[] G = geo(L); double rp = G[0]; this.pull = G[1];
        List<Object> people = Json.arr(M.get("people"));
        int NP = people.size();
        Map<String, Integer> colIdx = new HashMap<>();
        LinkedHashMap<String, Node> pos = new LinkedHashMap<>();
        for (int i = 0; i < NP; i++) {
            Map<String, Object> p = Json.obj(people.get(i));
            Node n = new Node(); n.id = Json.str(p.get("id")); n.kind = "p"; n.person = n.id;
            n.a = -Math.PI / 2 + i * 2 * Math.PI / NP; n.x = C + rp * Math.cos(n.a); n.y = C + rp * Math.sin(n.a);
            String name = Json.str(p.get("name")); n.label = name == null ? n.id : name.split(" ")[0];
            colIdx.put(n.id, i % COL.length); pos.put(n.id, n);
        }
        List<Object> all = new ArrayList<>(Json.arr(M.get("agents"))); all.addAll(Json.arr(M.get("sessionless")));
        for (int i = 0; i < NP; i++) {
            String pid = Json.str(Json.obj(people.get(i)).get("id")); Node P = pos.get(pid);
            List<Map<String, Object>> mine = new ArrayList<>();
            for (Object o : all) { Map<String, Object> a = Json.obj(o); if (pid.equals(Json.str(a.get("person")))) mine.add(a); }
            Collections.sort(mine, (x, y) -> Double.compare(Json.num(y.get("commits"), 0), Json.num(x.get("commits"), 0)));   // stable, as JS's sort
            int N = mine.size(), rows = N > 16 ? 3 : 2;
            double spread = Math.min(Math.PI * (rows == 3 ? 1.3 : 0.95), (0.16 * N + 0.3) / (rows - 1));
            // the agents ring (live.js): r0 290 to r1 370, a sector 86% of the person's share, rows of at most twelve
            double width = 2 * Math.PI / NP * 0.86; int arows = Math.max(1, (int) Math.ceil(N / 12.0)), perRow = (int) Math.ceil(N / (double) arows);
            for (int k = 0; k < N; k++) {
                Map<String, Object> a = mine.get(k);
                double ax, ay;
                if ("agents".equals(L)) {
                    int row = k / perRow, c2 = k % perRow, n2 = Math.min(perRow, N - row * perRow);
                    double t = P.a + (n2 > 1 ? -width / 2 + c2 * width / (n2 - 1) : 0), rr = arows > 1 ? 290 + 80.0 * row / (arows - 1) : 330;
                    ax = C + rr * Math.cos(t); ay = C + rr * Math.sin(t);
                } else {
                    double t = P.a + (N > 1 ? -spread / 2 + k * spread / (N - 1) : 0), rr = 100 + (k % rows) * 32;
                    ax = P.x + rr * Math.cos(t); ay = P.y + rr * Math.sin(t);
                }
                String id = Json.str(a.get("id"));
                Node n = pos.containsKey(id) ? pos.get(id) : new Node();   // a repeated id keeps its first place in the order, as a JS Map
                n.id = id; n.kind = "a"; n.person = pid; n.x = ax; n.y = ay;
                n.family = Json.str(a.get("family")); n.commits = Json.num(a.get("commits"), 0); n.ring = "fresh".equals(Json.str(a.get("kind"))); n.label = "";
                pos.put(id, n);
            }
        }
        // live.js's nodes3: centred, y up, flat; colour by person; sizes as the 3D view gives them. Flat, as the page's 2D map:
        // the graph scaled into the hexagon (GEO's scale), a person 26 across in radius, an agent 4 + sqrt(commits) up to 12
        double k = flat ? G[2] : 1;
        for (Node n : pos.values()) {
            n.x = (n.x - C) * k; n.y = (C - n.y) * k; n.z = 0;
            int c = colIdx.containsKey(n.person) ? theme.col[colIdx.get(n.person)] : theme.muted;
            float[] l = theme.rgb(c); n.r = l[0]; n.g = l[1]; n.b = l[2]; n.color = c;
            n.size = flat ? k * ("p".equals(n.kind) ? 52 : !"web-summit".equals(n.family) ? 18 : 2 * (4 + Math.min(8, Math.sqrt(n.commits))))
                    : "p".equals(n.kind) ? 56 : !"web-summit".equals(n.family) ? 17 : 2 * (4 + Math.min(8, Math.sqrt(n.commits))) + 2;
            if (!"p".equals(n.kind)) n.label = "";
            n.index = nodes.size(); nodes.add(n); byId.put(n.id, n);
        }
        if (!flat) ball(nodes);
        if ("agents".equals(this.layout)) for (Node n : nodes) { Node P = byId.get(n.person); if ("a".equals(n.kind) && P != null && "p".equals(P.kind)) spokes.add(new Link(n, P, 1)); }
        for (Object o : Json.arr(M.get("links"))) {
            Map<String, Object> l = Json.obj(o); Node f = byId.get(Json.str(l.get("from"))), t = byId.get(Json.str(l.get("to")));
            double n = Json.num(l.get("n"), 1); maxN = Math.max(maxN, n == 0 ? 1 : n);
            if (f != null && t != null) links.add(new Link(f, t, n == 0 ? 1 : n));
        }
    }

    /** live3d.js's ball(): each node keeps its direction round the centre; people round the middle, agents over the sphere. */
    static void ball(List<Node> nodes) {
        double Rs = 260; List<Node> ppl = new ArrayList<>();
        for (Node n : nodes) if ("p".equals(n.kind)) { ppl.add(n); Rs = Math.max(Rs, Math.hypot(n.x, n.y)); }
        Map<String, Double> dir = new HashMap<>(); Map<String, List<Node>> mine = new LinkedHashMap<>(); Set<String> done = new HashSet<>();
        for (int i = 0; i < ppl.size(); i++) { Node n = ppl.get(i); double phi = Math.atan2(n.y, n.x); dir.put(n.id, phi); put(n, phi, (i % 2 == 1 ? 1 : -1) * 0.16, Rs); done.add(n.id); }
        for (Node n : nodes) if ("a".equals(n.kind)) mine.computeIfAbsent(n.person, k -> new ArrayList<>()).add(n);
        for (Map.Entry<String, List<Node>> e : mine.entrySet()) {
            Double pp = dir.get(e.getKey()); List<Node> list = e.getValue(); int m = list.size();
            for (int k = 0; k < m; k++) {
                Node n = list.get(k);
                double own = Math.atan2(n.y, n.x), d = pp == null ? 0 : Math.atan2(Math.sin(own - pp), Math.cos(own - pp));
                double phi = (pp == null ? own : pp + Math.max(-0.5, Math.min(0.5, d * 1.6))) + (k % 3 - 1) * 0.07;
                double f = m < 2 ? 0.5 : (double) k / (m - 1), lat = (k % 2 == 1 ? 1 : -1) * (0.3 + 0.95 * Math.abs(f - 0.5) * 2) * (m < 3 ? 0.6 : 1);
                put(n, phi, Math.max(-1.32, Math.min(1.32, lat)), Rs * (k % 2 == 1 ? 1.12 : 0.96)); done.add(n.id);
            }
        }
        for (Node n : nodes) if (!done.contains(n.id)) { double r = Math.hypot(n.x, n.y); put(n, Math.atan2(n.y, n.x), 0, "k".equals(n.kind) ? Math.min(r, Rs * 0.45) : r); }
    }
    private static void put(Node n, double phi, double lat, double r) { n.x = r * Math.cos(lat) * Math.cos(phi); n.y = r * Math.cos(lat) * Math.sin(phi); n.z = r * Math.sin(lat); }

    /** live3d.js's rgb() in the dark: each colour lifted towards white. */
    public static float[] lift(int rgb) {
        float r = ((rgb >> 16) & 255) / 255f, g = ((rgb >> 8) & 255) / 255f, b = (rgb & 255) / 255f;
        return new float[] { Math.min(1, r * 1.12f + 0.1f), Math.min(1, g * 1.12f + 0.1f), Math.min(1, b * 1.12f + 0.1f) };
    }

    /** The control point of the curve between two nodes: the midpoint pulled towards the centre (live.js's ctrl). */
    public static void curveAt(Node a, Node b, double u, double[] out) { curveAt(a, b, u, out, PULL); }
    /** The same, with this graph's own pull (the agents ring bends its lines less: GEO.agents.pull). */
    public void curve(Node a, Node b, double u, double[] out) { curveAt(a, b, u, out, pull); }
    static void curveAt(Node a, Node b, double u, double[] out, double pull) {
        double qx = (a.x + b.x) / 2 * (1 - pull), qy = (a.y + b.y) / 2 * (1 - pull), qz = (a.z + b.z) / 2 * (1 - pull), v = 1 - u;
        out[0] = v * v * a.x + 2 * v * u * qx + u * u * b.x; out[1] = v * v * a.y + 2 * v * u * qy + u * u * b.y; out[2] = v * v * a.z + 2 * v * u * qz + u * u * b.z;
    }

    /** The faint graph's alpha for a link (live3d.js's writeBase). */
    public double baseAlpha(Link l) { return 0.13 + 0.26 * Math.sqrt(l.n / maxN); }

    // ---------------------------------------------------------------- who is who in live.json

    private static final Pattern P1 = Pattern.compile("@(?:web-summit|promptugal)\\.([a-z0-9-]+)$", Pattern.CASE_INSENSITIVE), P2 = Pattern.compile("^pt:([a-z0-9-]+):", Pattern.CASE_INSENSITIVE);
    static String personOf(String n) { Matcher m = P1.matcher(n); if (m.find()) return m.group(1).toLowerCase(); m = P2.matcher(n); if (m.find()) return m.group(1).toLowerCase(); return n; }
    /** live.js's nodeOf: the agent's own node, or else its person's. */
    public Node nodeOf(String name) {
        if (name == null) return null;
        Node x = byId.get(name); if (x != null && !"k".equals(x.kind)) return x;
        Node p = byId.get(personOf(name)); return p != null && "p".equals(p.kind) ? p : null;
    }

    public static final class Event { public String sha, agent; public List<String> to = new ArrayList<>(); public double ms; }

    /** live.json's events: [minutes since from, agent index, kind, [target indexes], sha, repository index]. */
    public static List<Event> events(Object liveJson) {
        Map<String, Object> L = Json.obj(liveJson); List<Event> out = new ArrayList<>();
        double from = Iso.parse(Json.str(L.get("from")));
        List<Object> agents = Json.arr(L.get("agents")), targets = Json.arr(L.get("targets"));
        for (Object o : Json.arr(L.get("events"))) {
            List<Object> e = Json.arr(o); if (e.size() < 5) continue;
            Event ev = new Event(); ev.ms = from + Json.num(e.get(0), 0) * 6e4; ev.agent = Json.str(agents.get((int) Json.num(e.get(1), 0)));
            for (Object t : Json.arr(e.get(3))) ev.to.add(Json.str(targets.get((int) Json.num(t, 0))));
            ev.sha = (int) (e.size() > 5 ? Json.num(e.get(5), 0) : 0) + ":" + Json.str(e.get(4));
            out.add(ev);
        }
        Collections.sort(out, (x, y) -> Double.compare(x.ms, y.ms));
        return out;
    }

    // ---------------------------------------------------------------- the engine (live.js's frame), one per wallpaper

    public static final class Fly { public Node from, to; public double t0, ms, u; public boolean flow; }
    public static final class Line { public final Node from, to; public final int slot; public double at = -1e12, flowAt = 0, flowMs = 0, op = 0; Line(Node f, Node t, int s) { from = f; to = t; slot = s; } }
    private static final class Pair { final Node from, to; final double w; Pair(Node f, Node t, double w) { from = f; to = t; this.w = w; } }
    private static final class Due { final Event ev; final double at; Due(Event e, double a) { ev = e; at = a; } }

    public final List<Fly> fly = new ArrayList<>();
    public final Map<String, Line> lines = new LinkedHashMap<>();
    public final Map<Node, Double> hot = new HashMap<>();
    public Set<Node> ran = new HashSet<>();
    public double act = 1, breath = 0.035;
    private final List<Due> queue = new ArrayList<>();
    private final Set<String> seen = new HashSet<>();
    private List<Pair> weights = new ArrayList<>();
    private double wsum = 0, debt = 0;
    private int flowN = 0;
    private final Random rnd;

    public Graph seed(long s) { rnd.setSeed(s); return this; }
    { rnd = new Random(); }

    /** Carries the engine's state over to a newer map (the people and agents change rarely; the moving dots are let finish). */
    public void takeOver(Graph old) { if (old == null) return; seen.addAll(old.seen); act = old.act; }
    /** Whether this graph was built for that view (a change of view rebuilds the graph from the same data). */
    public boolean isFor(String layout, Theme theme) { return this.layout.equals("ring".equals(layout) || "agents".equals(layout) ? layout : "3d") && this.theme == theme; }

    /**
     * A new copy of live.json (about once a minute). wallMs: the wall clock now; now: the engine's own clock (monotonic ms).
     * Opening, nothing older than the delay is replayed; afterwards each new exchange plays at its real moment, DELAY_MS behind.
     */
    public void read(List<Event> evs, double wallMs, double now) {
        tally(evs, wallMs);
        boolean firstEver = seen.isEmpty(); double disp = wallMs - DELAY_MS; int late = 0;
        readQueue(evs, firstEver, disp, now, late);
    }
    // ---------------------------------------------------------------- the replay (Angelo, 10 November: "a way to make the play and
    // ff buttons work for the live wallpaper ... run in a loop"): the moment shown is t, not now; the engine's rules are the same
    /** The flow weighed as it was at moment t: only the exchanges that had happened by then. */
    public void tallyAt(List<Event> evs, double t) { List<Event> past = new ArrayList<>(); for (Event e : evs) if (e.ms <= t) past.add(e); tally(past, t); }
    /** Every exchange between moments t0 (excluded) and t1 played now, as the live engine plays one at its moment. */
    public void replay(List<Event> evs, double t0, double t1, double now) { for (Event e : evs) if (e.ms > t0 && e.ms <= t1) play(e, now); }
    /** The live queue dropped (a replay starts, or ends and live takes over again). */
    public void clearQueue() { queue.clear(); }
    private void tally(List<Event> evs, double wallMs) {
        // tally: how busy each pair has been, events weighted by their age (half-life HALF_LIFE_H hours)
        Map<String, Pair> m = new LinkedHashMap<>(); int hour = 0;
        for (Event e : evs) {
            Node from = nodeOf(e.agent); if (from == null) continue;
            double w = Math.pow(0.5, Math.max(0, wallMs - e.ms) / 36e5 / HALF_LIFE_H); if (wallMs - e.ms < 36e5) hour++;
            for (String t : e.to) { Node to = nodeOf(t); if (to != null && to != from) { String k = from.id + "|" + to.id; Pair p = m.get(k); m.put(k, new Pair(from, to, (p == null ? 0 : p.w) + w)); } }
        }
        if (m.isEmpty()) for (Link l : links) m.put(l.from.id + "|" + l.to.id, new Pair(l.from, l.to, l.n));
        weights = new ArrayList<>(m.values()); wsum = 0; for (Pair p : weights) wsum += p.w;
        act = evs.isEmpty() ? 1 : hour / (evs.size() / 48.0);
        breath = 0.035 + 0.035 * Math.min(2, act);
        Set<Node> r = new HashSet<>(); for (Event e : evs) if (wallMs - e.ms < 2 * 36e5) { Node n = nodeOf(e.agent); if (n != null) r.add(n); }
        ran = r;
    }
    private void readQueue(List<Event> evs, boolean firstEver, double disp, double now, int late) {
        for (Event e : evs) {
            if (!seen.add(e.sha)) continue;
            if (firstEver && e.ms <= disp) continue;
            queue.add(new Due(e, e.ms > disp ? now + (e.ms - disp) : now + 350 * late++));
        }
        Collections.sort(queue, (x, y) -> Double.compare(x.at, y.at));
    }

    private Line pair(Node a, Node b) {
        String k = a.id + "|" + b.id; Line e = lines.get(k);
        if (e == null) { if (lines.size() >= MAXPAIRS) return null; e = new Line(a, b, lines.size()); lines.put(k, e); }
        return e;
    }
    private void busy(Node n, double until) { hot.put(n, until + 1200); }
    private void launch(Node from, Node to, double now) {
        Line e = pair(from, to); if (e != null) e.at = now;
        Fly f = new Fly(); f.from = from; f.to = to; f.t0 = now; f.ms = TRAVEL_MS; fly.add(f);
        if (fly.size() > 160) { Fly x = fly.remove(0); if (x.flow) flowN--; }
    }
    private void flowOne(double now) {
        if (wsum <= 0 || flowN >= FLOW_MAX) return;
        double r = rnd.nextDouble() * wsum; int k = 0; while (k < weights.size() - 1 && (r -= weights.get(k).w) > 0) k++;
        Pair w = weights.get(k); Line e = pair(w.from, w.to); double ms = FLOW_TRAVEL_MS * (0.8 + rnd.nextDouble() * 0.5);
        if (e != null) { e.flowAt = now; e.flowMs = ms; }
        flowN++; Fly f = new Fly(); f.from = w.from; f.to = w.to; f.t0 = now; f.ms = ms; f.flow = true; fly.add(f);
    }
    private void play(Event ev, double now) {
        Node from = nodeOf(ev.agent); if (from == null) return;
        busy(from, now);
        for (String t : ev.to) { Node to = nodeOf(t); if (to != null && to != from) { launch(from, to, now); busy(to, now + TRAVEL_MS * 0.8); } }
    }

    /** One frame of the engine: due exchanges, the flow, the dots along their lines, the lines' brightness, who is busy. */
    public void step(double now, double dt) {
        while (!queue.isEmpty() && queue.get(0).at <= now) play(queue.remove(0).ev, now);
        debt += FLOW_BASE * (0.6 + 0.4 * Math.min(2, act)) * (1 + 0.2 * Math.sin(now / 9000)) * dt / 1000;
        while (debt >= 1) { debt -= 1; flowOne(now); }
        for (int i = fly.size() - 1; i >= 0; i--) { Fly f = fly.get(i); f.u = (now - f.t0) / f.ms; if (f.u >= 1) { if (f.flow) flowN--; fly.remove(i); } }
        for (Line e : lines.values()) {
            double age = now - e.at, fa = e.flowAt != 0 ? now - e.flowAt : 1e9;
            double fop = fa < e.flowMs ? 0.75 : Math.max(0, 0.75 * (1 - (fa - e.flowMs) / 1500));
            double op = Math.max(fop, age < TRAVEL_MS ? 0.95 : Math.max(0, 0.95 * (1 - (age - TRAVEL_MS) / FADE_MS)));
            e.op = Math.round(op * 100) / 100.0;
        }
        hot.values().removeIf(u -> u <= now);
    }

    public int pending() { return queue.size(); }
    public int flowing() { return flowN; }
}
