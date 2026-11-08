package news.promptugal.wallpaper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A small JSON reader (objects as LinkedHashMap, arrays as ArrayList, numbers as Double), so the drawing contract
 * (Graph.java) runs the same on a phone and on a plain JVM in the tests, with no library. Read-only.
 * By dev.app@PrompTugal.angelo, 8 November 2026 (backlog 00a2).
 */
final class Json {
    private final String s; private int i;
    private Json(String s) { this.s = s; }

    static Object parse(String text) {
        Json p = new Json(text); p.ws(); Object v = p.value(); p.ws();
        if (p.i != p.s.length()) throw new IllegalArgumentException("JSON: trailing text at " + p.i);
        return v;
    }

    private void ws() { while (i < s.length() && s.charAt(i) <= ' ') i++; }

    private Object value() {
        if (i >= s.length()) throw new IllegalArgumentException("JSON: unexpected end");
        char c = s.charAt(i);
        switch (c) {
            case '{': return object();
            case '[': return array();
            case '"': return string();
            case 't': expect("true"); return Boolean.TRUE;
            case 'f': expect("false"); return Boolean.FALSE;
            case 'n': expect("null"); return null;
            default: return number();
        }
    }

    private void expect(String w) {
        if (!s.startsWith(w, i)) throw new IllegalArgumentException("JSON: expected " + w + " at " + i);
        i += w.length();
    }

    private Map<String, Object> object() {
        Map<String, Object> m = new LinkedHashMap<>(); i++; ws();
        if (s.charAt(i) == '}') { i++; return m; }
        while (true) {
            ws(); String k = string(); ws();
            if (s.charAt(i++) != ':') throw new IllegalArgumentException("JSON: expected : at " + (i - 1));
            ws(); m.put(k, value()); ws();
            char c = s.charAt(i++);
            if (c == '}') return m;
            if (c != ',') throw new IllegalArgumentException("JSON: expected , or } at " + (i - 1));
        }
    }

    private List<Object> array() {
        List<Object> a = new ArrayList<>(); i++; ws();
        if (s.charAt(i) == ']') { i++; return a; }
        while (true) {
            ws(); a.add(value()); ws();
            char c = s.charAt(i++);
            if (c == ']') return a;
            if (c != ',') throw new IllegalArgumentException("JSON: expected , or ] at " + (i - 1));
        }
    }

    private String string() {
        if (s.charAt(i) != '"') throw new IllegalArgumentException("JSON: expected a string at " + i);
        StringBuilder b = new StringBuilder(); i++;
        while (true) {
            char c = s.charAt(i++);
            if (c == '"') return b.toString();
            if (c != '\\') { b.append(c); continue; }
            char e = s.charAt(i++);
            switch (e) {
                case 'n': b.append('\n'); break;
                case 't': b.append('\t'); break;
                case 'r': b.append('\r'); break;
                case 'b': b.append('\b'); break;
                case 'f': b.append('\f'); break;
                case 'u': b.append((char) Integer.parseInt(s.substring(i, i + 4), 16)); i += 4; break;
                default: b.append(e);
            }
        }
    }

    private Double number() {
        int st = i;
        while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) i++;
        if (st == i) throw new IllegalArgumentException("JSON: unexpected '" + s.charAt(i) + "' at " + i);
        return Double.parseDouble(s.substring(st, i));
    }

    // small helpers for reading the parsed tree
    @SuppressWarnings("unchecked") static Map<String, Object> obj(Object o) { return o instanceof Map ? (Map<String, Object>) o : new LinkedHashMap<>(); }
    @SuppressWarnings("unchecked") static List<Object> arr(Object o) { return o instanceof List ? (List<Object>) o : new ArrayList<>(); }
    static String str(Object o) { return o == null ? null : String.valueOf(o); }
    static double num(Object o, double d) { return o instanceof Number ? ((Number) o).doubleValue() : d; }
}
