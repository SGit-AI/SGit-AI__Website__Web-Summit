package news.promptugal.wallpaper;

/** live3d.js's shaders in GLSL ES 1.00 (OpenGL ES 2.0, the same language as WebGL 1, so the tests compile them in Chromium). */
final class Shaders {
    static final String VS_PTS = "uniform mat4 uMV; uniform mat4 uP; uniform float scale; attribute vec3 position; attribute float size; attribute float alpha; attribute vec3 col; varying vec3 vC; varying float vA;\n"
            + "void main() { vec4 mv = uMV * vec4(position, 1.0); gl_PointSize = max(1.5, size * scale / -mv.z); gl_Position = uP * mv; vC = col; vA = alpha; }";
    // kind 0: a solid dot with a crisp edge; 1: a dot with a soft glow; 2: a ring (the sessionless agents' mark); 3: the lines' glow
    static String fsPts(int kind) {
        String a = kind == 3 ? "float a = exp(-r * r * 4.5) - 0.011;" : kind == 2 ? "float a = smoothstep(0.62, 0.72, r) * (1.0 - smoothstep(0.9, 1.0, r));"
                : kind == 1 ? "float a = max(1.0 - smoothstep(0.3, 0.4, r), 0.85 * pow(1.0 - r, 1.6));" : "float a = 1.0 - smoothstep(0.82, 1.0, r);";
        String mix = kind == 1 ? "0.35 * (1.0 - smoothstep(0.0, 0.4, r))" : "0.0";
        return "precision mediump float; varying vec3 vC; varying float vA;\nvoid main() { float r = length(gl_PointCoord - 0.5) * 2.0; if (r > 1.0) discard; " + a
                + " gl_FragColor = vec4(mix(vC, vec3(1.0), " + mix + "), vA * a); }";
    }
    static final String VS_LN = "uniform mat4 uMV; uniform mat4 uP; attribute vec3 position; attribute float alpha; attribute vec3 col; varying vec3 vC; varying float vA;\n"
            + "void main() { gl_Position = uP * uMV * vec4(position, 1.0); vC = col; vA = alpha; }";
    static final String FS_LN = "precision mediump float; varying vec3 vC; varying float vA; void main() { gl_FragColor = vec4(vC, vA); }";
    static final String VS_TX = "attribute vec2 position; attribute vec2 uv; varying vec2 vU; void main() { gl_Position = vec4(position, 0.0, 1.0); vU = uv; }";
    static final String FS_TX = "precision mediump float; uniform sampler2D tex; uniform float alpha; varying vec2 vU; void main() { vec4 c = texture2D(tex, vU); gl_FragColor = vec4(c.rgb, c.a * alpha); }";

}
