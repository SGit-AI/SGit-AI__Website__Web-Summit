// The hexagon's hit test, shared by the click-through loop (main.rs) and the page script (INIT in main.rs mirrors it).
// The live page draws a flat-topped hexagon, live.js's HEX = M250 67 L750 67 L1000 500 L750 933 L250 933 L0 500 Z,
// in a 1000 x 1000 square centred in the window and as large as its shorter side. No dependencies, so it is tested with
// plain rustc:  rustc --edition 2021 --test src/hex.rs -o /tmp/hex && /tmp/hex

/// Is the point (x, y), in pixels from the window's top left, inside the hexagon of a window w x h?
pub fn inside(x: f64, y: f64, w: f64, h: f64) -> bool {
    let s = w.min(h);
    if s <= 0.0 { return false; }
    let u = (x - (w - s) / 2.0) / s * 1000.0;
    let v = (y - (h - s) / 2.0) / s * 1000.0;
    let dv = (v - 500.0).abs();
    dv <= 433.0 && (u - 500.0).abs() <= 500.0 - 250.0 * dv / 433.0
}

#[cfg(test)]
mod tests {
    use super::inside;
    #[test] fn centre_is_inside() { assert!(inside(210.0, 210.0, 420.0, 420.0)); }
    #[test] fn corners_are_outside() {
        for (x, y) in [(2.0, 2.0), (418.0, 2.0), (2.0, 418.0), (418.0, 418.0)] { assert!(!inside(x, y, 420.0, 420.0), "{x},{y}"); }
    }
    #[test] fn top_band_is_outside() { assert!(!inside(210.0, 10.0, 420.0, 420.0)); } // the hexagon starts 6.7% down
    #[test] fn left_and_right_points_are_inside() {
        assert!(inside(3.0, 210.0, 420.0, 420.0)); assert!(inside(417.0, 210.0, 420.0, 420.0));
    }
    #[test] fn slanted_edge() { // top-left edge runs from (250,67) to (0,500) in page units
        assert!(inside(130.0 / 1000.0 * 420.0, 300.0 / 1000.0 * 420.0, 420.0, 420.0));
        assert!(!inside(90.0 / 1000.0 * 420.0, 250.0 / 1000.0 * 420.0, 420.0, 420.0));
    }
    #[test] fn wide_window_centres_the_square() { // 800 x 400: the square is 400 wide, from x = 200
        assert!(!inside(150.0, 200.0, 800.0, 400.0)); assert!(inside(210.0, 200.0, 800.0, 400.0)); assert!(inside(400.0, 200.0, 800.0, 400.0));
    }
    #[test] fn empty_window() { assert!(!inside(0.0, 0.0, 0.0, 0.0)); }
}
