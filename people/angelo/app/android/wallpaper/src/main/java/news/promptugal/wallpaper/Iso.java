package news.promptugal.wallpaper;

/** An ISO 8601 time (as live.json's "from" and "built_at") in milliseconds since 1970; NaN if unreadable. */
final class Iso {
    static double parse(String s) {
        if (s == null) return Double.NaN;
        try { return java.time.OffsetDateTime.parse(s).toInstant().toEpochMilli(); } catch (Exception e) { }
        try { return java.time.Instant.parse(s).toEpochMilli(); } catch (Exception e) { return Double.NaN; }
    }
}
