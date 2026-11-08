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
import java.util.List;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

/**
 * Draws the live 3D map with OpenGL ES 2.0, as live3d.js draws it in WebGL: the faint graph (every line), the lit layer and
 * its glow, the nodes (one draw), the sessionless agents' rings, the moving dots with their trails; the same shaders, colours,
 * sizes and order. Over it, the hexagon's rim and floor, the two logos and LIVE (drawn once into a texture), and the people's
 * names. It only draws: the engine is Graph.step(). By dev.app@PrompTugal.angelo, 8 November 2026 (backlog 00a2).
 */
final class MapRenderer implements GLSurfaceView.Renderer {
    interface Source { Graph graph(); List<Graph.Event> takeEvents(); Bitmap[] logos(); }

    private final Source src; private final float density;
    volatile boolean still;            // the chooser's preview: no turning
    volatile float offsetX = 0.5f;     // the home screen's page, turning the ball a little
    private int progLn, progTx; private final int[] progPt = new int[4];
    private int W = 1, H = 1; private float scale = 1, lineW = 1;
    private final float[] P = new float[16], V = new float[16], Mx = new float[16], My = new float[16], Mm = new float[16], MV = new float[16];
    private double ry = 0, lastT = 0;
    private Graph built, cur; private List<Graph.Event> lastEvs;
    private FloatBuffer bPos, bCol, bAl, lPos, lCol, lAl, gPos, gCol, gSz, gAl, nPos, nCol, nSz, nAl, rPos, rCol, rSz, rAl, dPos, dCol, dSz, dAl, quad;
    private int slotsWritten = 0, nRings = 0; private final List<Graph.Node> rings = new ArrayList<>();
    private int overlayTex = 0; private final List<int[]> labelTex = new ArrayList<>(); private final List<Graph.Node> labelNodes = new ArrayList<>();
    private final double[] tmp = new double[3];
    long frames = 0;

    MapRenderer(Source src, float density) { this.src = src; this.density = density; }

    @Override public void onSurfaceCreated(GL10 unused, EGLConfig cfg) {
        progLn = program(Shaders.VS_LN, Shaders.FS_LN); progTx = program(Shaders.VS_TX, Shaders.FS_TX);
        for (int k = 0; k < 4; k++) progPt[k] = program(Shaders.VS_PTS, Shaders.fsPts(k));
        built = null; overlayTex = 0; labelTex.clear();
        GLES20.glDisable(GLES20.GL_DEPTH_TEST); GLES20.glEnable(GLES20.GL_BLEND);
        float[] range = new float[2]; GLES20.glGetFloatv(GLES20.GL_ALIASED_LINE_WIDTH_RANGE, range, 0);
        lineW = Math.max(1, Math.min(range[1], density * 0.75f));
    }

    @Override public void onSurfaceChanged(GL10 unused, int w, int h) {
        W = Math.max(1, w); H = Math.max(1, h); GLES20.glViewport(0, 0, W, H);
        float aspect = (float) W / H;
        // a phone stands upright: back the camera off until the ball fits the width (the page's view is about square)
        double dist = Graph.DIST * Math.max(1, 0.7 / aspect);
        Matrix.perspectiveM(P, 0, (float) Graph.FOV, aspect, 10, 8000);
        Matrix.setLookAtM(V, 0, 0, 0, (float) dist, 0, 0, 0, 0, 1, 0);
        scale = (float) (H / (2 * Math.tan(Math.toRadians(Graph.FOV / 2))));
        if (overlayTex != 0) { GLES20.glDeleteTextures(1, new int[] { overlayTex }, 0); overlayTex = 0; }
    }

    @Override public void onDrawFrame(GL10 unused) {
        int c = Graph.BG;
        GLES20.glClearColor(((c >> 16) & 255) / 255f, ((c >> 8) & 255) / 255f, (c & 255) / 255f, 1); GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
        if (overlayTex == 0) overlayTex = texture(overlay());
        normal(); drawTex(overlayTex, -1, -1, 1, 1, 1);
        double t0 = SystemClock.uptimeMillis(), dt = lastT > 0 ? Math.min(250, t0 - lastT) : 16; lastT = t0;
        // the engine runs on this thread only: a newer map or a new live.json, read by the wallpaper, is taken in here
        Graph ng = src.graph(); if (ng == null) return;
        if (ng != cur) { ng.takeOver(cur); cur = ng; if (lastEvs != null) cur.read(lastEvs, System.currentTimeMillis(), t0); }
        List<Graph.Event> evs = src.takeEvents(); if (evs != null) { lastEvs = evs; cur.read(evs, System.currentTimeMillis(), t0); }
        Graph g = cur; g.step(t0, dt);
        if (g != built) build(g);
        if (!still) ry += 2 * Math.PI / (1000 * Graph.TURN_S) * dt;
        Matrix.setRotateM(Mx, 0, (float) Math.toDegrees(Graph.RX), 1, 0, 0);
        Matrix.setRotateM(My, 0, (float) Math.toDegrees(ry + (offsetX - 0.5) * Math.PI / 3), 0, 1, 0);
        Matrix.multiplyMM(Mm, 0, Mx, 0, My, 0); Matrix.multiplyMM(MV, 0, V, 0, Mm, 0);

        // the faint graph
        normal(); lines(bPos, bCol, bAl, g.links.size() * Graph.SEG * 2);
        // the lit layer and its glow: a slot per pair the first time it moves
        for (Graph.Line e : g.lines.values()) {
            if (e.slot >= slotsWritten) { writeSlot(e); slotsWritten = e.slot + 1; }
            float a = (float) Math.min(1, e.op * 1.05), ga = a * 0.3f;
            for (int j = e.slot * Graph.SEG * 2, n = j + Graph.SEG * 2; j < n; j++) lAl.put(j, a);
            for (int j = e.slot * (Graph.SEG + 1), n = j + Graph.SEG + 1; j < n; j++) gAl.put(j, ga);
        }
        additive(); lines(lPos, lCol, lAl, slotsWritten * Graph.SEG * 2);
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
            if (f.flow) { Graph.curveAt(a, f.to, Math.max(0, f.u), tmp); dot(k++, a, 13, 0.5 + 0.45 * Math.sin(Math.PI * f.u)); continue; }
            for (int j = 0; j <= Graph.TRAIL; j++) { Graph.curveAt(a, f.to, Math.max(0, f.u - j * 0.025), tmp); dot(k++, a, j > 0 ? 26 - j * 3.5 : 48, j > 0 ? 0.65 * (1 - j / (double) (Graph.TRAIL + 1)) : 1); }
        }
        additive(); points(1, dPos, dCol, dSz, dAl, k);
        // the people's names, where they now are
        normal(); float[] v = new float[4], o = new float[4];
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
        bPos = fb(nl * 3); bCol = fb(nl * 3); bAl = fb(nl);
        double[] p = new double[3], q = new double[3];
        for (int k = 0; k < g.links.size(); k++) {
            Graph.Link l = g.links.get(k); float w = (float) g.baseAlpha(l);
            for (int s = 0; s < Graph.SEG; s++) {
                Graph.curveAt(l.from, l.to, s / (double) Graph.SEG, p); Graph.curveAt(l.from, l.to, (s + 1) / (double) Graph.SEG, q); int j = (k * Graph.SEG + s) * 2;
                put3(bPos, j, p); put3(bPos, j + 1, q); col3(bCol, j, l.from); col3(bCol, j + 1, l.from); bAl.put(j, w); bAl.put(j + 1, w);
            }
        }
        int ls = Graph.MAXPAIRS * Graph.SEG * 2, gs = Graph.MAXPAIRS * (Graph.SEG + 1);
        lPos = fb(ls * 3); lCol = fb(ls * 3); lAl = fb(ls); gPos = fb(gs * 3); gCol = fb(gs * 3); gSz = fb(gs); gAl = fb(gs);
        int nn = g.nodes.size(); nPos = fb(nn * 3); nCol = fb(nn * 3); nSz = fb(nn); nAl = fb(nn);
        rings.clear(); for (Graph.Node n : g.nodes) { put3(nPos, n.index, new double[] { n.x, n.y, n.z }); nAl.put(n.index, 0.95f); if (n.ring) rings.add(n); }
        nRings = rings.size(); rPos = fb(Math.max(1, nRings) * 3); rCol = fb(Math.max(1, nRings) * 3); rSz = fb(Math.max(1, nRings)); rAl = fb(Math.max(1, nRings));
        float[] tc = Graph.lift(Graph.TEXT);
        for (int i = 0; i < nRings; i++) { Graph.Node n = rings.get(i); put3(rPos, i, new double[] { n.x, n.y, n.z }); rCol.put(i * 3, tc[0]); rCol.put(i * 3 + 1, tc[1]); rCol.put(i * 3 + 2, tc[2]); rSz.put(i, (float) (n.size * 2.1)); rAl.put(i, 0.45f); }
        int nd = Graph.MAXDOTS * (Graph.TRAIL + 1); dPos = fb(nd * 3); dCol = fb(nd * 3); dSz = fb(nd); dAl = fb(nd);
        for (int[] t : labelTex) GLES20.glDeleteTextures(1, new int[] { t[0] }, 0);
        labelTex.clear(); labelNodes.clear();
        for (Graph.Node n : g.nodes) if (n.label != null && !n.label.isEmpty()) { labelNodes.add(n); labelTex.add(label(n.label)); }
    }
    private void writeSlot(Graph.Line e) {
        double[] p = new double[3], q = new double[3]; int s = e.slot;
        for (int k = 0; k < Graph.SEG; k++) { Graph.curveAt(e.from, e.to, k / (double) Graph.SEG, p); Graph.curveAt(e.from, e.to, (k + 1) / (double) Graph.SEG, q); int j = (s * Graph.SEG + k) * 2; put3(lPos, j, p); put3(lPos, j + 1, q); col3(lCol, j, e.from); col3(lCol, j + 1, e.from); }
        for (int k = 0; k <= Graph.SEG; k++) { Graph.curveAt(e.from, e.to, k / (double) Graph.SEG, p); int j = s * (Graph.SEG + 1) + k; put3(gPos, j, p); col3(gCol, j, e.from); gSz.put(j, 30); }
    }

    // ---- drawing calls
    private void normal() { GLES20.glBlendFuncSeparate(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA, GLES20.GL_ONE, GLES20.GL_ONE_MINUS_SRC_ALPHA); }
    private void additive() { GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE); }
    private void lines(FloatBuffer pos, FloatBuffer col, FloatBuffer al, int n) {
        if (n <= 0) return; GLES20.glUseProgram(progLn); mats(progLn); GLES20.glLineWidth(lineW);
        attr(progLn, "position", pos, 3); attr(progLn, "col", col, 3); attr(progLn, "alpha", al, 1);
        GLES20.glDrawArrays(GLES20.GL_LINES, 0, n);
    }
    private void points(int kind, FloatBuffer pos, FloatBuffer col, FloatBuffer sz, FloatBuffer al, int n) {
        if (n <= 0) return; int pr = progPt[kind]; GLES20.glUseProgram(pr); mats(pr);
        GLES20.glUniform1f(GLES20.glGetUniformLocation(pr, "scale"), scale);
        attr(pr, "position", pos, 3); attr(pr, "col", col, 3); attr(pr, "size", sz, 1); attr(pr, "alpha", al, 1);
        GLES20.glDrawArrays(GLES20.GL_POINTS, 0, n);
    }
    private void mats(int pr) { GLES20.glUniformMatrix4fv(GLES20.glGetUniformLocation(pr, "uMV"), 1, false, MV, 0); GLES20.glUniformMatrix4fv(GLES20.glGetUniformLocation(pr, "uP"), 1, false, P, 0); }
    private static void attr(int pr, String name, FloatBuffer b, int k) { int at = GLES20.glGetAttribLocation(pr, name); if (at < 0) return; b.position(0); GLES20.glEnableVertexAttribArray(at); GLES20.glVertexAttribPointer(at, k, GLES20.GL_FLOAT, false, 0, b); }
    private void drawTex(int tex, float x0, float y0, float x1, float y1, float alpha) {
        if (quad == null) quad = fb(16);
        float[] q = { x0, y0, 0, 1, x1, y0, 1, 1, x0, y1, 0, 0, x1, y1, 1, 0 }; quad.position(0); quad.put(q);
        GLES20.glUseProgram(progTx); GLES20.glActiveTexture(GLES20.GL_TEXTURE0); GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, tex);
        GLES20.glUniform1i(GLES20.glGetUniformLocation(progTx, "tex"), 0); GLES20.glUniform1f(GLES20.glGetUniformLocation(progTx, "alpha"), alpha);
        int a = GLES20.glGetAttribLocation(progTx, "position"), u = GLES20.glGetAttribLocation(progTx, "uv");
        quad.position(0); GLES20.glEnableVertexAttribArray(a); GLES20.glVertexAttribPointer(a, 2, GLES20.GL_FLOAT, false, 16, quad);
        quad.position(2); GLES20.glEnableVertexAttribArray(u); GLES20.glVertexAttribPointer(u, 2, GLES20.GL_FLOAT, false, 16, quad);
        GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4);
    }

    // ---- the overlay: the hexagon's floor and rim, the logos and LIVE, as the page has them (lv-fill, lv-rim, lv-top)
    private Bitmap overlay() {
        Bitmap bm = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888); Canvas cv = new Canvas(bm);
        float side = Math.min(W, H) * 0.98f, x0 = (W - side) / 2, y0 = (H - side) / 2, k = side / 1000f;
        Path hex = new Path(); float[][] pts = { { 250, 67 }, { 750, 67 }, { 1000, 500 }, { 750, 933 }, { 250, 933 }, { 0, 500 } };
        hex.moveTo(x0 + pts[0][0] * k, y0 + pts[0][1] * k); for (int i = 1; i < 6; i++) hex.lineTo(x0 + pts[i][0] * k, y0 + pts[i][1] * k); hex.close();
        Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG); fill.setColor(0xFF000000 | Graph.SURFACE); fill.setAlpha((int) (255 * 0.55)); cv.drawPath(hex, fill);
        Paint rim = new Paint(Paint.ANTI_ALIAS_FLAG); rim.setStyle(Paint.Style.STROKE); rim.setStrokeJoin(Paint.Join.ROUND); rim.setStrokeWidth(3 * k); rim.setColor(0xFF000000 | Graph.ACTION); rim.setAlpha((int) (255 * 0.8));
        rim.setShadowLayer(7 * k * 2, 0, 0, 0xFF000000 | Graph.ACTION); cv.drawPath(hex, rim);
        // the top row: the two logos, then LIVE, centred, 7.6% down the hexagon
        Bitmap[] logos = src.logos(); float ls = Math.max(16 * density, Math.min(66 * density, side * 0.072f)), gap = Math.max(6 * density, side * 0.018f), ty = y0 + side * 0.076f;
        Paint live = new Paint(Paint.ANTI_ALIAS_FLAG); live.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); live.setTextSize(Math.max(8 * density, Math.min(18 * density, side * 0.022f))); live.setLetterSpacing(0.14f); live.setColor(0xFF000000 | Graph.LIVE_RED);
        float tw = live.measureText("LIVE"), pillW = tw + live.getTextSize() * 1.9f, pillH = live.getTextSize() * 1.64f;
        int nl = logos == null ? 0 : logos.length; float rowW = nl * ls + nl * gap + pillW, x = (W - rowW) / 2;
        Paint bp = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG); bp.setAlpha((int) (255 * 0.92));
        for (int i = 0; i < nl; i++) { if (logos[i] != null) cv.drawBitmap(logos[i], null, new RectF(x, ty, x + ls, ty + ls), bp); x += ls + gap; }
        float py = ty + (ls - pillH) / 2; RectF pill = new RectF(x, py, x + pillW, py + pillH);
        Paint pb = new Paint(Paint.ANTI_ALIAS_FLAG); pb.setColor(0xFF000000 | Graph.BG); pb.setAlpha(190); cv.drawRoundRect(pill, pillH, pillH, pb);
        Paint ps = new Paint(live); ps.setStyle(Paint.Style.STROKE); ps.setStrokeWidth(Math.max(1, density)); cv.drawRoundRect(pill, pillH, pillH, ps);
        float dr = live.getTextSize() * 0.31f; Paint dp = new Paint(live); dp.setShadowLayer(dr * 2.2f, 0, 0, 0xFF000000 | Graph.LIVE_RED); cv.drawCircle(x + live.getTextSize() * 0.5f + dr, py + pillH / 2, dr, dp);
        cv.drawText("LIVE", x + live.getTextSize() * 0.5f + dr * 2 + live.getTextSize() * 0.45f, py + pillH / 2 + live.getTextSize() * 0.36f, live);
        return bm;
    }
    // a person's name, as the page writes it (600, white, with a dark halo); returns { texture, half width px, half height px }
    private int[] label(String s) {
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG); p.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); p.setTextSize(Math.max(11 * density, Math.min(14 * density, Math.min(W, H) * 0.022f)));
        p.setColor(0xFF000000 | Graph.TEXT); p.setShadowLayer(4 * density, 0, 0, 0xFF000000 | Graph.BG);
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
