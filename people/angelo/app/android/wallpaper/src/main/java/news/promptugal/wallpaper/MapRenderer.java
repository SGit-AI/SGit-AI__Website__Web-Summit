package news.promptugal.wallpaper;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.GLUtils;
import android.opengl.Matrix;
import android.os.SystemClock;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

/**
 * Draws the live 3D map with OpenGL ES 2.0, as live3d.js draws it in WebGL: the faint graph (every line), the lit layer and
 * its glow, the nodes (one draw), the sessionless agents' rings, the moving dots with their trails; the same shaders, colours,
 * sizes and order. Over it, the hexagon's rim and floor, the two logos and LIVE (drawn once into a texture), and the people's
 * names. It only draws: the engine is Graph.step(). By dev.app@PrompTugal.angelo, 8 November 2026 (backlog 00a2).
 */
final class MapRenderer implements GLSurfaceView.Renderer {
    interface Source { Graph graph(); List<Graph.Event> takeEvents(); Bitmap[] logos(boolean light); Work work(); List<Work.Row> takeWorkRows(); Bitmap destLogo(String id, boolean light); }

    private final Source src; private final float density;
    volatile boolean still;            // the chooser's preview: no turning
    volatile float offsetX = 0.5f;     // the home screen's page, turning the ball a little
    private int progLn, progTx; private final int[] progPt = new int[4];
    private int W = 1, H = 1; private float scale = 1, lineW = 1;
    private final float[] P = new float[16], V = new float[16], Mx = new float[16], My = new float[16], Mm = new float[16], MV = new float[16];
    private double ry = 0, lastT = 0;
    private Graph built, cur; private List<Graph.Event> lastEvs;
    private Graph.Theme overlayTheme; private int nSpokes = 0;
    // battery (Angelo, 9 November: "make sure this live wallpaper is extremely efficient"): the faint graph and the spokes never
    // change between maps, so they live on the GPU (buffer objects), uploaded once per map, not copied over every frame (about
    // 690 KB a frame for today's 684 lines); and every shader variable is looked up once, not on every draw
    private final int[] vbo = new int[6];   // base lines: position, colour, alpha; spokes: position, colour, alpha
    private final Map<Integer, Map<String, Integer>> loc = new HashMap<>();   // program, then name (a literal: no key built per call)
    private final float[] v4 = new float[4], o4 = new float[4]; private String overlayKey = "";
    // the level (Workstreams): its rows, the frame's geometry for its squares, the flights' textures by colour
    private Work wk; private float fx0, fy0, fk; private int litTex = 0; private float litPx = 0;
    private final Map<String, int[]> iconTex = new HashMap<>(); private final Map<Integer, Integer> dotTex = new HashMap<>();
    private FloatBuffer sPos, sCol, sAl,
                        bPos, bCol, bAl, lPos, lCol, lAl, gPos, gCol, gSz, gAl, nPos, nCol, nSz, nAl, rPos, rCol, rSz, rAl, dPos, dCol, dSz, dAl, quad;
    private int slotsWritten = 0, nRings = 0; private final List<Graph.Node> rings = new ArrayList<>();
    private int overlayTex = 0; private final List<int[]> labelTex = new ArrayList<>(); private final List<Graph.Node> labelNodes = new ArrayList<>();
    private final double[] tmp = new double[3];
    long frames = 0;

    MapRenderer(Source src, float density) { this.src = src; this.density = density; }

    @Override public void onSurfaceCreated(GL10 unused, EGLConfig cfg) {
        progLn = program(Shaders.VS_LN, Shaders.FS_LN); progTx = program(Shaders.VS_TX, Shaders.FS_TX);
        for (int k = 0; k < 4; k++) progPt[k] = program(Shaders.VS_PTS, Shaders.fsPts(k));
        built = null; overlayTex = 0; labelTex.clear(); loc.clear(); java.util.Arrays.fill(vbo, 0);
        iconTex.clear(); dotTex.clear(); litTex = 0;   // a new context: the old textures and buffers are gone with it
        GLES20.glDisable(GLES20.GL_DEPTH_TEST); GLES20.glEnable(GLES20.GL_BLEND);
        float[] range = new float[2]; GLES20.glGetFloatv(GLES20.GL_ALIASED_LINE_WIDTH_RANGE, range, 0);
        lineW = Math.max(1, Math.min(range[1], density * 0.75f));
    }

    @Override public void onSurfaceChanged(GL10 unused, int w, int h) {
        W = Math.max(1, w); H = Math.max(1, h); GLES20.glViewport(0, 0, W, H);
        Matrix.perspectiveM(P, 0, (float) Graph.FOV, (float) W / H, 10, 8000);
        scale = (float) (H / (2 * Math.tan(Math.toRadians(Graph.FOV / 2))));
        camera(cur != null && cur.flat);
        if (overlayTex != 0) { GLES20.glDeleteTextures(1, new int[] { overlayTex }, 0); overlayTex = 0; }
    }
    // the 3D ball: a phone stands upright, so the camera backs off until the ball fits the width (the page's view is about
    // square). Flat: face on, the page's 1000-unit square exactly on the hexagon drawn by overlay() (side = 98% of the width)
    private void camera(boolean flat) {
        double dist = flat ? scale * 1000 / (Math.min(W, H) * 0.98) : Graph.DIST * Math.max(1, 0.7 / ((double) W / H));
        Matrix.setLookAtM(V, 0, 0, 0, (float) dist, 0, 0, 0, 0, 1, 0);
    }

    @Override public void onDrawFrame(GL10 unused) {
        double t0 = SystemClock.uptimeMillis(), dt = lastT > 0 ? Math.min(250, t0 - lastT) : 16; lastT = t0;
        // the engine runs on this thread only: a newer map or a new live.json, read by the wallpaper, is taken in here
        Graph ng = src.graph();
        if (ng != null && ng != cur) { ng.takeOver(cur); cur = ng; if (lastEvs != null) cur.read(lastEvs, System.currentTimeMillis(), t0); }
        Graph.Theme th = cur != null ? cur.theme : Graph.DARK; int c = th.bg;
        GLES20.glClearColor(((c >> 16) & 255) / 255f, ((c >> 8) & 255) / 255f, (c & 255) / 255f, 1); GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
        Work nw = src.work(); if (nw != wk) { if (nw != null) nw.takeOver(wk); wk = nw; }
        List<Work.Row> rows = src.takeWorkRows(); if (rows != null && wk != null) wk.read(rows, System.currentTimeMillis(), t0);
        String key = (th.light ? "L" : "D") + (wk == null ? "" : wk.level + counts(wk));
        if (overlayTex != 0 && (overlayTheme != th || !key.equals(overlayKey))) { GLES20.glDeleteTextures(1, new int[] { overlayTex }, 0); overlayTex = 0; }
        if (overlayTex == 0) { overlayTheme = th; overlayKey = key; overlayTex = texture(overlay(th)); dropLevelTextures(); }
        normal(); drawTex(overlayTex, -1, -1, 1, 1, 1);
        if (cur == null) return;
        List<Graph.Event> evs = src.takeEvents(); if (evs != null) { lastEvs = evs; cur.read(evs, System.currentTimeMillis(), t0); }
        Graph g = cur; g.step(t0, dt);
        if (g != built) build(g);
        if (g.flat) Matrix.setIdentityM(Mm, 0);   // the page's 2D map does not turn
        else {
            if (!still) ry += 2 * Math.PI / (1000 * Graph.TURN_S) * dt;
            Matrix.setRotateM(Mx, 0, (float) Math.toDegrees(Graph.RX), 1, 0, 0);
            Matrix.setRotateM(My, 0, (float) Math.toDegrees(ry + (offsetX - 0.5) * Math.PI / 3), 0, 1, 0);
            Matrix.multiplyMM(Mm, 0, Mx, 0, My, 0);
        }
        Matrix.multiplyMM(MV, 0, V, 0, Mm, 0);
        boolean light = th.light;

        // the agents ring's spokes, then the faint graph
        normal(); linesVbo(3, nSpokes * 2); linesVbo(0, g.links.size() * Graph.SEG * 2);
        // the lit layer and its glow: a slot per pair the first time it moves
        for (Graph.Line e : g.lines.values()) {
            if (e.slot >= slotsWritten) { writeSlot(e); slotsWritten = e.slot + 1; }
            // as bright as during a burst, all the time (Angelo, 9 November: "Can we have the glowy version all the time?"): a line
            // lit by the steady flow (op 0.75) draws near full, as a line lit by a real exchange (0.95) does
            float a = (float) Math.min(1, e.op * 1.25), ga = a * (light ? 0.22f : 0.3f);
            for (int j = e.slot * Graph.SEG * 2, n = j + Graph.SEG * 2; j < n; j++) lAl.put(j, a);
            for (int j = e.slot * (Graph.SEG + 1), n = j + Graph.SEG + 1; j < n; j++) gAl.put(j, ga);
        }
        glow(light); lines(lPos, lCol, lAl, slotsWritten * Graph.SEG * 2);
        points(3, gPos, gCol, gSz, gAl, slotsWritten * (Graph.SEG + 1));
        // the nodes: busy ones larger and whiter, all breathing gently with the team's activity
        double now = t0;
        for (Graph.Node n : g.nodes) {
            int i = n.index; boolean h = g.hot.containsKey(n); double b = 1 + g.breath * Math.sin(now / 1400 + i * 1.7);
            nSz.put(i, (float) (n.size * b * (h ? 1.55 : 1)));
            if (h) { nCol.put(i * 3, n.r + (1 - n.r) * 0.45f); nCol.put(i * 3 + 1, n.g + (1 - n.g) * 0.45f); nCol.put(i * 3 + 2, n.b + (1 - n.b) * 0.45f); }
            else { nCol.put(i * 3, n.r); nCol.put(i * 3 + 1, n.g); nCol.put(i * 3 + 2, n.b); }
        }
        normal(); points(0, nPos, nCol, nSz, nAl, g.nodes.size());
        for (int i = 0; i < nRings; i++) rAl.put(i, g.ran.contains(rings.get(i)) ? 0.95f : 0.45f);
        points(2, rPos, rCol, rSz, rAl, nRings);
        // the moving dots, with a short fading trail behind each real exchange
        int k = 0, cap = Graph.MAXDOTS * (Graph.TRAIL + 1);
        for (Graph.Fly f : g.fly) {
            if (k >= cap - Graph.TRAIL - 1) break; Graph.Node a = f.from;
            // the steady flow drawn as a real exchange is (a bright glowing head and a short trail), a little smaller, so the
            // graph glows between bursts too; real exchanges keep the larger head
            if (f.flow) { double fa = 0.55 + 0.4 * Math.sin(Math.PI * f.u);
                for (int j = 0; j <= 3; j++) { g.curve(a, f.to, Math.max(0, f.u - j * 0.025), tmp); dot(k++, a, j > 0 ? 20 - j * 3.5 : 34, j > 0 ? fa * 0.6 * (1 - j / 4.0) : fa); }
                continue; }
            for (int j = 0; j <= Graph.TRAIL; j++) { g.curve(a, f.to, Math.max(0, f.u - j * 0.025), tmp); dot(k++, a, j > 0 ? 26 - j * 3.5 : 48, j > 0 ? 0.65 * (1 - j / (double) (Graph.TRAIL + 1)) : 1); }
        }
        glow(light); points(1, dPos, dCol, dSz, dAl, k);
        if (wk != null) { wk.step(t0); normal(); drawLevel(g, th, t0); }
        // the people's names, where they now are
        normal(); float[] v = v4, o = o4;
        for (int i = 0; i < labelNodes.size(); i++) {
            Graph.Node n = labelNodes.get(i); int[] t = labelTex.get(i);
            v[0] = (float) n.x; v[1] = (float) n.y; v[2] = (float) n.z; v[3] = 1; Matrix.multiplyMV(o, 0, MV, 0, v, 0); Matrix.multiplyMV(v, 0, P, 0, o, 0);
            if (v[3] <= 0) continue; float x = v[0] / v[3], y = v[1] / v[3], hw = t[1] / (float) W, hh = t[2] / (float) H;
            drawTex(t[0], x - hw, y - hh, x + hw, y + hh, 1);
        }
        frames++;
    }

    private void dot(int k, Graph.Node a, double size, double alpha) {
        dPos.put(k * 3, (float) tmp[0]); dPos.put(k * 3 + 1, (float) tmp[1]); dPos.put(k * 3 + 2, (float) tmp[2]);
        dCol.put(k * 3, a.r); dCol.put(k * 3 + 1, a.g); dCol.put(k * 3 + 2, a.b); dSz.put(k, (float) size); dAl.put(k, (float) alpha);
    }

    // ---- the buffers, built once per map
    private void build(Graph g) {
        built = g; slotsWritten = 0; int nl = g.links.size() * Graph.SEG * 2;
        camera(g.flat);
        // the spokes: straight, thin and faint (.lv-spokes: opacity .18), in the person's colour
        nSpokes = g.spokes.size(); sPos = fb(nSpokes * 6); sCol = fb(nSpokes * 6); sAl = fb(nSpokes * 2);
        for (int k = 0; k < nSpokes; k++) { Graph.Link l = g.spokes.get(k); put3(sPos, k * 2, new double[] { l.from.x, l.from.y, l.from.z }); put3(sPos, k * 2 + 1, new double[] { l.to.x, l.to.y, l.to.z }); col3(sCol, k * 2, l.to); col3(sCol, k * 2 + 1, l.to); sAl.put(k * 2, 0.18f); sAl.put(k * 2 + 1, 0.18f); }
        bPos = fb(nl * 3); bCol = fb(nl * 3); bAl = fb(nl);
        double[] p = new double[3], q = new double[3];
        for (int k = 0; k < g.links.size(); k++) {
            Graph.Link l = g.links.get(k); float w = (float) g.baseAlpha(l);
            for (int s = 0; s < Graph.SEG; s++) {
                g.curve(l.from, l.to, s / (double) Graph.SEG, p); g.curve(l.from, l.to, (s + 1) / (double) Graph.SEG, q); int j = (k * Graph.SEG + s) * 2;
                put3(bPos, j, p); put3(bPos, j + 1, q); col3(bCol, j, l.from); col3(bCol, j + 1, l.from); bAl.put(j, w); bAl.put(j + 1, w);
            }
        }
        upload(0, bPos, bCol, bAl); upload(3, sPos, sCol, sAl);
        int ls = Graph.MAXPAIRS * Graph.SEG * 2, gs = Graph.MAXPAIRS * (Graph.SEG + 1);
        lPos = fb(ls * 3); lCol = fb(ls * 3); lAl = fb(ls); gPos = fb(gs * 3); gCol = fb(gs * 3); gSz = fb(gs); gAl = fb(gs);
        int nn = g.nodes.size(); nPos = fb(nn * 3); nCol = fb(nn * 3); nSz = fb(nn); nAl = fb(nn);
        rings.clear(); for (Graph.Node n : g.nodes) { put3(nPos, n.index, new double[] { n.x, n.y, n.z }); nAl.put(n.index, 0.95f); if (n.ring) rings.add(n); }
        nRings = rings.size(); rPos = fb(Math.max(1, nRings) * 3); rCol = fb(Math.max(1, nRings) * 3); rSz = fb(Math.max(1, nRings)); rAl = fb(Math.max(1, nRings));
        float[] tc = g.theme.rgb(g.theme.text);
        for (int i = 0; i < nRings; i++) { Graph.Node n = rings.get(i); put3(rPos, i, new double[] { n.x, n.y, n.z }); rCol.put(i * 3, tc[0]); rCol.put(i * 3 + 1, tc[1]); rCol.put(i * 3 + 2, tc[2]); rSz.put(i, (float) (n.size * 2.1)); rAl.put(i, 0.45f); }
        int nd = Graph.MAXDOTS * (Graph.TRAIL + 1); dPos = fb(nd * 3); dCol = fb(nd * 3); dSz = fb(nd); dAl = fb(nd);
        for (int[] t : labelTex) GLES20.glDeleteTextures(1, new int[] { t[0] }, 0);
        labelTex.clear(); labelNodes.clear();
        for (Graph.Node n : g.nodes) if (n.label != null && !n.label.isEmpty()) { labelNodes.add(n); labelTex.add(label(n.label, g.theme)); }
    }
    private void writeSlot(Graph.Line e) {
        double[] p = new double[3], q = new double[3]; int s = e.slot; Graph g = built; float gsz = g.theme.light ? 16 : 30;
        for (int k = 0; k < Graph.SEG; k++) { g.curve(e.from, e.to, k / (double) Graph.SEG, p); g.curve(e.from, e.to, (k + 1) / (double) Graph.SEG, q); int j = (s * Graph.SEG + k) * 2; put3(lPos, j, p); put3(lPos, j + 1, q); col3(lCol, j, e.from); col3(lCol, j + 1, e.from); }
        for (int k = 0; k <= Graph.SEG; k++) { g.curve(e.from, e.to, k / (double) Graph.SEG, p); int j = s * (Graph.SEG + 1) + k; put3(gPos, j, p); col3(gCol, j, e.from); gSz.put(j, gsz); }
    }

    // ---- drawing calls
    private void normal() { GLES20.glBlendFuncSeparate(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA, GLES20.GL_ONE, GLES20.GL_ONE_MINUS_SRC_ALPHA); }
    private void additive() { GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE); }
    // live3d.js: the lit lines, their glow and the dots add light in the dark; on a light page they are drawn as they are
    private void glow(boolean light) { if (light) normal(); else additive(); }
    // the static layers into buffer objects (at = 0: base lines, 3: spokes), replacing the last map's
    private void upload(int at, FloatBuffer pos, FloatBuffer col, FloatBuffer al) {
        if (vbo[at] != 0) GLES20.glDeleteBuffers(3, vbo, at);
        GLES20.glGenBuffers(3, vbo, at); FloatBuffer[] b = { pos, col, al };
        for (int i = 0; i < 3; i++) { b[i].position(0); GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, vbo[at + i]); GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER, b[i].capacity() * 4, b[i], GLES20.GL_STATIC_DRAW); }
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, 0);
    }
    private void linesVbo(int at, int n) {
        if (n <= 0 || vbo[at] == 0) return; GLES20.glUseProgram(progLn); mats(progLn); GLES20.glLineWidth(lineW);
        int[] k = { 3, 3, 1 }; String[] names = { "position", "col", "alpha" };
        for (int i = 0; i < 3; i++) { int a = attrLoc(progLn, names[i]); if (a < 0) continue; GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, vbo[at + i]); GLES20.glEnableVertexAttribArray(a); GLES20.glVertexAttribPointer(a, k[i], GLES20.GL_FLOAT, false, 0, 0); }
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, 0);
        GLES20.glDrawArrays(GLES20.GL_LINES, 0, n);
    }
    // attribute and uniform names never clash in these shaders, so one table per program serves both
    private int attrLoc(int pr, String name) { Map<String, Integer> m = loc.get(pr); if (m == null) loc.put(pr, m = new HashMap<>()); Integer v = m.get(name); if (v == null) { v = GLES20.glGetAttribLocation(pr, name); m.put(name, v); } return v; }
    private int uniLoc(int pr, String name) { Map<String, Integer> m = loc.get(pr); if (m == null) loc.put(pr, m = new HashMap<>()); Integer v = m.get(name); if (v == null) { v = GLES20.glGetUniformLocation(pr, name); m.put(name, v); } return v; }
    private void lines(FloatBuffer pos, FloatBuffer col, FloatBuffer al, int n) {
        if (n <= 0) return; GLES20.glUseProgram(progLn); mats(progLn); GLES20.glLineWidth(lineW);
        attr(progLn, "position", pos, 3); attr(progLn, "col", col, 3); attr(progLn, "alpha", al, 1);
        GLES20.glDrawArrays(GLES20.GL_LINES, 0, n);
    }
    private void points(int kind, FloatBuffer pos, FloatBuffer col, FloatBuffer sz, FloatBuffer al, int n) {
        if (n <= 0) return; int pr = progPt[kind]; GLES20.glUseProgram(pr); mats(pr);
        GLES20.glUniform1f(uniLoc(pr, "scale"), scale);
        attr(pr, "position", pos, 3); attr(pr, "col", col, 3); attr(pr, "size", sz, 1); attr(pr, "alpha", al, 1);
        GLES20.glDrawArrays(GLES20.GL_POINTS, 0, n);
    }
    private void mats(int pr) { GLES20.glUniformMatrix4fv(uniLoc(pr, "uMV"), 1, false, MV, 0); GLES20.glUniformMatrix4fv(uniLoc(pr, "uP"), 1, false, P, 0); }
    private void attr(int pr, String name, FloatBuffer b, int k) { int at = attrLoc(pr, name); if (at < 0) return; b.position(0); GLES20.glEnableVertexAttribArray(at); GLES20.glVertexAttribPointer(at, k, GLES20.GL_FLOAT, false, 0, b); }
    private void drawTex(int tex, float x0, float y0, float x1, float y1, float alpha) {
        if (quad == null) quad = fb(16);
        float[] q = { x0, y0, 0, 1, x1, y0, 1, 1, x0, y1, 0, 0, x1, y1, 1, 0 }; quad.position(0); quad.put(q);
        GLES20.glUseProgram(progTx); GLES20.glActiveTexture(GLES20.GL_TEXTURE0); GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, tex);
        GLES20.glUniform1i(uniLoc(progTx, "tex"), 0); GLES20.glUniform1f(uniLoc(progTx, "alpha"), alpha);
        int a = attrLoc(progTx, "position"), u = attrLoc(progTx, "uv");
        quad.position(0); GLES20.glEnableVertexAttribArray(a); GLES20.glVertexAttribPointer(a, 2, GLES20.GL_FLOAT, false, 16, quad);
        quad.position(2); GLES20.glEnableVertexAttribArray(u); GLES20.glVertexAttribPointer(u, 2, GLES20.GL_FLOAT, false, 16, quad);
        GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4);
    }

    // ---- the overlay: the hexagon's floor and rim, the logos and LIVE, as the page has them (lv-fill, lv-rim, lv-top)
    private Bitmap overlay(Graph.Theme th) {
        Bitmap bm = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888); Canvas cv = new Canvas(bm);
        float side = Math.min(W, H) * 0.98f, x0 = (W - side) / 2, y0 = (H - side) / 2, k = side / 1000f;
        Path hex = new Path(); float[][] pts = { { 250, 67 }, { 750, 67 }, { 1000, 500 }, { 750, 933 }, { 250, 933 }, { 0, 500 } };
        hex.moveTo(x0 + pts[0][0] * k, y0 + pts[0][1] * k); for (int i = 1; i < 6; i++) hex.lineTo(x0 + pts[i][0] * k, y0 + pts[i][1] * k); hex.close();
        Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG); fill.setColor(0xFF000000 | th.surface); fill.setAlpha((int) (255 * 0.55)); cv.drawPath(hex, fill);
        Paint rim = new Paint(Paint.ANTI_ALIAS_FLAG); rim.setStyle(Paint.Style.STROKE); rim.setStrokeJoin(Paint.Join.ROUND); rim.setStrokeWidth(3 * k); rim.setColor(0xFF000000 | th.action); rim.setAlpha((int) (255 * 0.8));
        rim.setShadowLayer(7 * k * 2, 0, 0, 0xFF000000 | th.action); cv.drawPath(hex, rim);
        fx0 = x0; fy0 = y0; fk = k;
        // the top row: the two logos, then LIVE, centred, 7.6% down the hexagon
        Bitmap[] logos = src.logos(th.light); float ls = Math.max(16 * density, Math.min(66 * density, side * 0.072f)), gap = Math.max(6 * density, side * 0.018f), ty = y0 + side * 0.076f;
        Paint live = new Paint(Paint.ANTI_ALIAS_FLAG); live.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); live.setTextSize(Math.max(8 * density, Math.min(18 * density, side * 0.022f))); live.setLetterSpacing(0.14f); live.setColor(0xFF000000 | th.live);
        float tw = live.measureText("LIVE"), pillW = tw + live.getTextSize() * 1.9f, pillH = live.getTextSize() * 1.64f;
        int nl = logos == null ? 0 : logos.length; float rowW = nl * ls + nl * gap + pillW, x = (W - rowW) / 2;
        Paint bp = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG); bp.setAlpha((int) (255 * 0.92));
        for (int i = 0; i < nl; i++) { if (logos[i] != null) cv.drawBitmap(logos[i], null, new RectF(x, ty, x + ls, ty + ls), bp); x += ls + gap; }
        float py = ty + (ls - pillH) / 2; RectF pill = new RectF(x, py, x + pillW, py + pillH);
        Paint pb = new Paint(Paint.ANTI_ALIAS_FLAG); pb.setColor(0xFF000000 | th.bg); pb.setAlpha(190); cv.drawRoundRect(pill, pillH, pillH, pb);
        Paint ps = new Paint(live); ps.setStyle(Paint.Style.STROKE); ps.setStrokeWidth(Math.max(1, density)); cv.drawRoundRect(pill, pillH, pillH, ps);
        float dr = live.getTextSize() * 0.31f; Paint dp = new Paint(live); dp.setShadowLayer(dr * 2.2f, 0, 0, 0xFF000000 | th.live); cv.drawCircle(x + live.getTextSize() * 0.5f + dr, py + pillH / 2, dr, dp);
        cv.drawText("LIVE", x + live.getTextSize() * 0.5f + dr * 2 + live.getTextSize() * 0.45f, py + pillH / 2 + live.getTextSize() * 0.36f, live);
        if (wk != null) {   // the furniture the pills keep off: the top row, in the page's units
            List<double[]> avoid = new ArrayList<>(); float rx = (W - rowW) / 2;
            avoid.add(new double[] { (rx - x0) / k - 6, (ty - y0) / k - 6, rowW / k + 12, ls / k + 12 });
            levelOverlay(cv, th, k, x0, y0, avoid);
        }
        return bm;
    }
    // a person's name, as the page writes it (600, white, with a dark halo); returns { texture, half width px, half height px }
    private int[] label(String s, Graph.Theme th) {
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG); p.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); p.setTextSize(Math.max(11 * density, Math.min(14 * density, Math.min(W, H) * 0.022f)));
        p.setColor(0xFF000000 | th.text); p.setShadowLayer(4 * density, 0, 0, 0xFF000000 | th.bg);
        int w = (int) Math.ceil(p.measureText(s) + 12 * density), h = (int) Math.ceil(p.getTextSize() * 1.6f + 8 * density);
        Bitmap bm = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888); new Canvas(bm).drawText(s, 6 * density, h / 2f + p.getTextSize() * 0.36f, p);
        return new int[] { texture(bm), w, h };
    }
    private static int texture(Bitmap bm) {
        int[] t = new int[1]; GLES20.glGenTextures(1, t, 0); GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, t[0]);
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR); GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE); GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE);
        GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, bm, 0); bm.recycle(); return t[0];
    }

    // ---- the level (Workstreams): work-draw.js's squares, pills and counts, drawn once into the overlay (again when a count changes)
    private static String counts(Work w) { StringBuilder b = new StringBuilder(); for (Work.Dest d : w.dests) b.append(',').append(d.count); return b.toString(); }
    private float sqUnits() { return (float) Math.max(Work.SQ, 26 * density / fk); }
    private void levelOverlay(Canvas cv, Graph.Theme th, float k, float x0, float y0, List<double[]> avoid) {
        double font = Math.max(Work.FONT, 12 * density / k), size = sqUnits(), lo = (0 - x0) / k + 4, hi = (W - x0) / k - 4, s = size / Work.SQ;
        Map<String, Work.Pill> pills = wk.pills(font, lo, hi, size, avoid);
        Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG); fill.setColor(0xFF000000 | th.surface);
        Paint line = new Paint(Paint.ANTI_ALIAS_FLAG); line.setStyle(Paint.Style.STROKE); line.setColor(0xFF000000 | th.border);
        Paint num = new Paint(Paint.ANTI_ALIAS_FLAG); num.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); num.setColor(0xFF000000 | th.secondary); num.setTextAlign(Paint.Align.CENTER);
        Paint txt = new Paint(Paint.ANTI_ALIAS_FLAG); txt.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); txt.setColor(0xFF000000 | th.text); txt.setTextAlign(Paint.Align.CENTER);
        Paint badge = new Paint(Paint.ANTI_ALIAS_FLAG); badge.setColor(0xFF000000 | th.action);
        Paint bt = new Paint(txt); bt.setColor(0xFFFFFFFF);
        for (Work.Dest d : wk.dests) {
            float cx = x0 + (float) d.x * k, cy = y0 + (float) d.y * k, h = (float) (Work.SQ / 2 * s) * k, r = (float) (12 * s) * k;
            RectF q = new RectF(cx - h, cy - h, cx + h, cy + h); cv.drawRoundRect(q, r, r, fill); line.setStrokeWidth((float) (2 * s) * k); cv.drawRoundRect(q, r, r, line);
            num.setTextSize((float) (22 * s) * k); Bitmap lg = d.logo ? src.destLogo(d.id, th.light) : null; float lh = (float) (18 * s) * k;
            if (!d.mark.isEmpty()) cv.drawText(d.mark, cx, cy + (float) (8 * s) * k, num);
            else if (lg != null) cv.drawBitmap(lg, null, new RectF(cx - lh, cy - lh, cx + lh, cy + lh), new Paint(Paint.FILTER_BITMAP_FLAG | Paint.ANTI_ALIAS_FLAG));
            else { Path ic = svgPath(Work.markPath(d.id), (float) (1.5 * s) * k, cx, cy); Paint m = new Paint(num); m.setStyle(Paint.Style.STROKE); m.setStrokeWidth((float) (2 * s) * k); m.setStrokeCap(Paint.Cap.ROUND); m.setStrokeJoin(Paint.Join.ROUND); cv.drawPath(ic, m); }
            if (d.count > 0) { float bx = cx + (float) ((Work.SQ / 2 - 4) * s) * k, by = cy + (float) ((-Work.SQ / 2 + 4) * s) * k; cv.drawCircle(bx, by, (float) (13 * s) * k, badge); bt.setTextSize((float) (15 * s) * k); cv.drawText(d.count > 99 ? "99+" : String.valueOf(d.count), bx, by + (float) (5 * s) * k, bt); }
            Work.Pill p = pills.get(d.id); if (p == null) continue;
            RectF pr = new RectF(x0 + (float) p.x * k, y0 + (float) p.y * k, x0 + (float) (p.x + p.w) * k, y0 + (float) (p.y + p.h) * k); float ph = (float) p.h * k / 2;
            cv.drawRoundRect(pr, ph, ph, fill); line.setStrokeWidth(1.5f * k); cv.drawRoundRect(pr, ph, ph, line);
            txt.setTextSize((float) font * k); cv.drawText(p.text, pr.centerX(), pr.centerY() + (float) font * k * 0.36f, txt);
        }
    }
    private void dropLevelTextures() {
        for (int[] t : iconTex.values()) GLES20.glDeleteTextures(1, new int[] { t[0] }, 0); iconTex.clear();
        for (int t : dotTex.values()) GLES20.glDeleteTextures(1, new int[] { t }, 0); dotTex.clear();
        if (litTex != 0) { GLES20.glDeleteTextures(1, new int[] { litTex }, 0); litTex = 0; }
    }
    // a frame point (the page's 1000 units) to the screen's -1..1
    private final double[] lp = new double[2];
    private float nx(double fx) { return (fx0 + (float) fx * fk) / W * 2 - 1; }
    private float ny(double fy) { return 1 - (fy0 + (float) fy * fk) / H * 2; }
    /** The flights: each leaves its maker's node (where it now is on screen) for its square, eased over 3 s, its trail behind it
     *  fading in and out; a landed one lights its square for 0.9 s (work-draw.js's step). */
    private void drawLevel(Graph g, Graph.Theme th, double now) {
        float[] v = v4, o = o4; double[] p = lp; float sq = sqUnits();
        if (litTex == 0) { int side = Math.max(4, Math.round(sq * fk + 8)); Bitmap b = Bitmap.createBitmap(side, side, Bitmap.Config.ARGB_8888); Paint pl = new Paint(Paint.ANTI_ALIAS_FLAG); pl.setStyle(Paint.Style.STROKE); pl.setStrokeWidth(4 * fk * sq / (float) Work.SQ); pl.setColor(0xFF000000 | th.action); float r = 12 * fk * sq / (float) Work.SQ; new Canvas(b).drawRoundRect(new RectF(4, 4, side - 4, side - 4), r, r, pl); litPx = side; litTex = texture(b); }
        for (Work.Dest d : wk.dests) if (d.litUntil > now) { float hw = litPx / W, hh = litPx / H; drawTex(litTex, nx(d.x) - hw, ny(d.y) - hh, nx(d.x) + hw, ny(d.y) + hh, 1); }
        for (Work.Flight f : wk.inAir) {
            Graph.Node from = Work.origin(g, f.maker); Work.Dest d = wk.byId.get(f.dest); if (from == null || d == null) continue;
            v[0] = (float) from.x; v[1] = (float) from.y; v[2] = (float) from.z; v[3] = 1; Matrix.multiplyMV(o, 0, MV, 0, v, 0); Matrix.multiplyMV(v, 0, P, 0, o, 0); if (v[3] <= 0) continue;
            double ax = ((v[0] / v[3] + 1) / 2 * W - fx0) / fk, ay = ((1 - v[1] / v[3]) / 2 * H - fy0) / fk;   // the maker, in frame units
            double u = (now - f.t0) / Work.FLIGHT_MS; if (u < 0 || u >= 1) continue; double e = Work.ease(u);
            int stroke = Work.strokeFor(from.color, th.light);
            // the trail: small dots from 0.25 behind, brightest in mid-flight
            int dt = dot(stroke); float tr = 3 * fk;
            for (int j = 1; j <= 6; j++) { Work.along(ax, ay, d.x, d.y, Math.max(0, e - j * 0.04), p); float al = (float) (0.85 * Math.sin(Math.PI * u) * (1 - j / 7.0)); drawTex(dt, nx(p[0]) - tr / W, ny(p[1]) - tr / H, nx(p[0]) + tr / W, ny(p[1]) + tr / H, al); }
            Work.along(ax, ay, d.x, d.y, e, p); int[] t = icon(f.icon, stroke, f.n, th);
            float hw = t[1] / (float) W, hh = t[2] / (float) H; drawTex(t[0], nx(p[0]) - hw, ny(p[1]) - hh, nx(p[0]) + hw, ny(p[1]) + hh, 1);
        }
    }
    // a flight's icon (work-draw.js): a disc in the page's background, ringed in the maker's colour, the doc stroked in it, a soft
    // glow of the same colour, and the number when several merged; cached by colour and number
    private int[] icon(String kind, int c, int n, Graph.Theme th) {
        String path = Work.ICON_PATHS.containsKey(kind) ? Work.ICON_PATHS.get(kind) : Work.DOC, key = kind + "|" + c + "|" + Math.min(n, 99); int[] t = iconTex.get(key); if (t != null) return t;
        float u = fk, side = 60 * u; Bitmap b = Bitmap.createBitmap(Math.max(4, Math.round(side)), Math.max(4, Math.round(side)), Bitmap.Config.ARGB_8888); Canvas cv = new Canvas(b);
        float cx = side / 2, cy = side / 2;
        Paint bg = new Paint(Paint.ANTI_ALIAS_FLAG); bg.setColor(0xFF000000 | th.bg); bg.setShadowLayer(6 * u, 0, 0, 0xFF000000 | c); cv.drawCircle(cx, cy, 17 * u, bg);
        Paint st = new Paint(Paint.ANTI_ALIAS_FLAG); st.setStyle(Paint.Style.STROKE); st.setColor(0xFF000000 | c); st.setStrokeWidth(2.5f * u); cv.drawCircle(cx, cy, 17 * u, st);
        st.setStrokeWidth(2.8f * u); st.setStrokeCap(Paint.Cap.ROUND); st.setStrokeJoin(Paint.Join.ROUND); cv.drawPath(svgPath(path, u, cx, cy), st);
        if (n > 1) { Paint nt = new Paint(Paint.ANTI_ALIAS_FLAG); nt.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); nt.setTextSize(15 * u); nt.setColor(0xFF000000 | th.text); cv.drawText(String.valueOf(Math.min(n, 99)), cx + 18 * u, cy - 12 * u, nt); }
        t = new int[] { texture(b), Math.round(side / 2), Math.round(side / 2) }; iconTex.put(key, t); return t;
    }
    private int dot(int c) {
        Integer t = dotTex.get(c); if (t != null) return t;
        Bitmap b = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888); Paint p = new Paint(Paint.ANTI_ALIAS_FLAG); p.setColor(0xFF000000 | c); new Canvas(b).drawCircle(8, 8, 7, p);
        int x = texture(b); dotTex.put(c, x); return x;
    }
    /** An SVG path (M, L, H, V, A, Z, absolute or relative: the icons' and marks'), scaled by k about cx, cy. */
    static Path svgPath(String d, float k, float cx, float cy) {
        Path p = new Path(); float x = 0, y = 0, sx = 0, sy = 0; char cmd = 'M'; int i = 0, n = d.length();
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("([MmLlHhVvAaZz])|(-?\\d*\\.?\\d+)").matcher(d);
        List<Object> tok = new ArrayList<>(); while (m.find()) tok.add(m.group(1) != null ? (Object) m.group(1).charAt(0) : (Object) Float.parseFloat(m.group(2)));
        while (i < tok.size()) {
            if (tok.get(i) instanceof Character) { cmd = (Character) tok.get(i++); if (cmd == 'Z' || cmd == 'z') { p.close(); x = sx; y = sy; continue; } }
            float a = (Float) tok.get(i++);
            switch (cmd) {
                case 'M': case 'm': case 'L': case 'l': { float b = (Float) tok.get(i++); boolean rel = Character.isLowerCase(cmd); x = rel ? x + a : a; y = rel ? y + b : b;
                    if (cmd == 'M' || cmd == 'm') { p.moveTo(cx + x * k, cy + y * k); sx = x; sy = y; cmd = cmd == 'M' ? 'L' : 'l'; } else p.lineTo(cx + x * k, cy + y * k); break; }
                case 'H': x = a; p.lineTo(cx + x * k, cy + y * k); break;
                case 'h': x += a; p.lineTo(cx + x * k, cy + y * k); break;
                case 'V': y = a; p.lineTo(cx + x * k, cy + y * k); break;
                case 'v': y += a; p.lineTo(cx + x * k, cy + y * k); break;
                case 'A': case 'a': {   // rx ry rotation large sweep x y: the endpoint arc as Android's centre arc (no rotation in these icons)
                    float ry = (Float) tok.get(i++); i++; boolean large = (Float) tok.get(i++) != 0, sweep = (Float) tok.get(i++) != 0;
                    float ex = (Float) tok.get(i++), ey = (Float) tok.get(i++); if (cmd == 'a') { ex += x; ey += y; }
                    arc(p, x, y, a, ry, large, sweep, ex, ey, k, cx, cy); x = ex; y = ey; break; }
                default: break;
            }
        }
        return p;
    }
    // SVG's endpoint arc (F.6.5 of the SVG spec), no rotation: its centre and angles, drawn with Path.arcTo
    private static void arc(Path p, float x1, float y1, float rx, float ry, boolean large, boolean sweep, float x2, float y2, float k, float cx, float cy) {
        double dx = (x1 - x2) / 2.0, dy = (y1 - y2) / 2.0; rx = Math.abs(rx); ry = Math.abs(ry);
        double lam = dx * dx / (rx * rx) + dy * dy / (ry * ry); if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
        double num = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx, den = rx * rx * dy * dy + ry * ry * dx * dx;
        double co = (large == sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den)), ccx = co * rx * dy / ry, ccy = co * -ry * dx / rx;
        double mx = ccx + (x1 + x2) / 2.0, my = ccy + (y1 + y2) / 2.0;
        double t1 = Math.toDegrees(Math.atan2((dy - ccy) / ry, (dx - ccx) / rx)), t2 = Math.toDegrees(Math.atan2((-dy - ccy) / ry, (-dx - ccx) / rx)), dt = t2 - t1;
        if (sweep && dt < 0) dt += 360; else if (!sweep && dt > 0) dt -= 360;
        p.arcTo(new RectF(cx + (float) (mx - rx) * k, cy + (float) (my - ry) * k, cx + (float) (mx + rx) * k, cy + (float) (my + ry) * k), (float) t1, (float) dt, false);
    }

    // ---- small helpers
    private static FloatBuffer fb(int n) { return ByteBuffer.allocateDirect(Math.max(1, n) * 4).order(ByteOrder.nativeOrder()).asFloatBuffer(); }
    private static void put3(FloatBuffer b, int i, double[] p) { b.put(i * 3, (float) p[0]); b.put(i * 3 + 1, (float) p[1]); b.put(i * 3 + 2, (float) p[2]); }
    private static void col3(FloatBuffer b, int i, Graph.Node n) { b.put(i * 3, n.r); b.put(i * 3 + 1, n.g); b.put(i * 3 + 2, n.b); }
    private static int program(String vs, String fs) {
        int p = GLES20.glCreateProgram(); GLES20.glAttachShader(p, shader(GLES20.GL_VERTEX_SHADER, vs)); GLES20.glAttachShader(p, shader(GLES20.GL_FRAGMENT_SHADER, fs)); GLES20.glLinkProgram(p);
        int[] ok = new int[1]; GLES20.glGetProgramiv(p, GLES20.GL_LINK_STATUS, ok, 0); if (ok[0] == 0) throw new RuntimeException("link: " + GLES20.glGetProgramInfoLog(p)); return p;
    }
    private static int shader(int type, String code) {
        int s = GLES20.glCreateShader(type); GLES20.glShaderSource(s, code); GLES20.glCompileShader(s);
        int[] ok = new int[1]; GLES20.glGetShaderiv(s, GLES20.GL_COMPILE_STATUS, ok, 0); if (ok[0] == 0) throw new RuntimeException("shader: " + GLES20.glGetShaderInfoLog(s)); return s;
    }
}
