// Team and the machine, the desktop app (backlog 00a; spec: people/angelo/proposals/live-map/spec-live-app.md).
// One frameless, transparent, always-on-top window that loads the public live page in its display mode. The app holds
// no data and no key; the window-state plugin keeps only the window's size and place. Clicks outside the hexagon pass
// through to whatever is underneath (the loop in setup); inside it, a drag moves the window and a right-click opens the
// app's menu. Kept by dev.app@PrompTugal.angelo; dev@PrompTugal.angelo reviews.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod hex;

use std::sync::atomic::{AtomicBool, Ordering};
use std::{thread, time::Duration};
use tauri::menu::{CheckMenuItem, Menu, MenuEvent, MenuItem, PredefinedMenuItem, Submenu};
use tauri::{AppHandle, LogicalSize, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

/// The page: the live graph's display mode (reads live.json each minute, keeps the screen awake, recovers by itself).
/// transparent=1 asks the page for no background (dev.map@'s option in live.js); INIT below does the same until then.
const LIVE_URL: &str = "https://web-summit.sgit.ai/people/angelo/app/index.html?display=1&transparent=1#live";
const LABEL: &str = "live";

/// Run in the page before its own scripts: the page's backgrounds made transparent and everything but the graph hidden,
/// so only the hexagon shows; a left-button drag inside the hexagon moves the window; a right-click opens the menu;
/// Esc (which leaves display mode in a browser) does nothing here. The hit test mirrors hex.rs.
const INIT: &str = r#"(() => {
  const css = 'html,body{background:transparent!important}body *{visibility:hidden!important}'
    + '.lv-display,.lv-display *{visibility:visible!important}.lv-display,.lv-display .lv{background:transparent!important}'
    + '.lv-display .lv{cursor:default!important}.lv-display .lv-fill{opacity:1!important}';
  const add = () => { if (document.getElementById('hexapp-css')) return; const s = document.createElement('style'); s.id = 'hexapp-css'; s.textContent = css; (document.head || document.documentElement).appendChild(s) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  const inside = e => { const w = innerWidth, h = innerHeight, s = Math.min(w, h); const u = (e.clientX - (w - s) / 2) / s * 1000, v = (e.clientY - (h - s) / 2) / s * 1000, dv = Math.abs(v - 500); return dv <= 433 && Math.abs(u - 500) <= 500 - 250 * dv / 433 };
  const invoke = (cmd, args) => { try { return window.__TAURI_INTERNALS__.invoke(cmd, args || {}) } catch (e) { } };
  addEventListener('mousedown', e => { if (e.button === 0 && inside(e)) { e.preventDefault(); invoke('plugin:window|start_dragging', { label: 'live' }) } }, true);
  addEventListener('contextmenu', e => { e.preventDefault(); invoke('show_menu') }, true);
  addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault() } }, true);
})();"#;

static ON_TOP: AtomicBool = AtomicBool::new(true);

/// The app's menu, opened by a right-click on the hexagon.
#[tauri::command]
fn show_menu(window: WebviewWindow) -> Result<(), String> {
    let app = window.app_handle();
    let err = |e: tauri::Error| e.to_string();
    let item = |id: &str, text: &str| MenuItem::with_id(app, id, text, true, None::<&str>).map_err(err);
    let size = Submenu::with_items(app, "Size", true, &[&item("size_s", "Small")?, &item("size_m", "Medium")?, &item("size_l", "Large")?]).map_err(err)?;
    let on_top = CheckMenuItem::with_id(app, "on_top", "Always on top", true, ON_TOP.load(Ordering::Relaxed), None::<&str>).map_err(err)?;
    let sep = PredefinedMenuItem::separator(app).map_err(err)?;
    let menu = Menu::with_items(app, &[&on_top, &size, &item("reload", "Reload")?, &sep, &item("quit", "Quit")?]).map_err(err)?;
    window.popup_menu(&menu).map_err(err)
}

fn on_menu(app: &AppHandle, event: MenuEvent) {
    let Some(w) = app.get_webview_window(LABEL) else { return };
    match event.id().as_ref() {
        "on_top" => { let v = !ON_TOP.load(Ordering::Relaxed); ON_TOP.store(v, Ordering::Relaxed); let _ = w.set_always_on_top(v); }
        "size_s" => { let _ = w.set_size(LogicalSize::new(280.0, 280.0)); }
        "size_m" => { let _ = w.set_size(LogicalSize::new(420.0, 420.0)); }
        "size_l" => { let _ = w.set_size(LogicalSize::new(640.0, 640.0)); }
        "reload" => { let _ = w.eval("location.reload()"); }
        "quit" => app.exit(0),
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![show_menu])
        .on_menu_event(on_menu)
        .setup(|app| {
            let url = WebviewUrl::External(LIVE_URL.parse().expect("the live page's address"));
            let w = WebviewWindowBuilder::new(app, LABEL, url)
                .title("Team and the machine")
                .inner_size(420.0, 420.0)
                .min_inner_size(200.0, 200.0)
                .decorations(false)
                .transparent(true)
                .shadow(false)
                .always_on_top(true)
                .resizable(true)
                .initialization_script(INIT)
                .build()?;
            // click-through outside the hexagon: every 40 ms, is the pointer over the hexagon? If not, the window ignores
            // the mouse, so a click lands on the window below; the pointer's position is read globally, so it still
            // works while the window ignores the mouse
            thread::spawn(move || {
                let mut ignoring = false;
                loop {
                    thread::sleep(Duration::from_millis(40));
                    let (Ok(c), Ok(p), Ok(s)) = (w.cursor_position(), w.inner_position(), w.inner_size()) else { continue };
                    let inside = hex::inside(c.x - p.x as f64, c.y - p.y as f64, s.width as f64, s.height as f64);
                    if inside == ignoring { ignoring = !inside; let _ = w.set_ignore_cursor_events(ignoring); }
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running the app");
}
