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

/// Run in the page before its own scripts: the page's backgrounds made transparent and everything outside the graph
/// hidden, so only the hexagon shows (inside it the page's own hiding stands: the 3D view hides the flat graph's
/// layers, and forcing them visible drew both at once); a left-button drag inside the hexagon moves the window; a
/// right-click opens the menu; Esc (which leaves display mode in a browser) does nothing here. The hit test mirrors hex.rs.
/// Calm (the spec's battery risk): when on, the page's animation frames are held to 15 a second (the page's own clock
/// advances by real time, so the graph moves at the same speed, in fewer steps); kept in the page's localStorage, so it
/// survives a restart. The ids handed out start at 1e9, so a clearTimeout on one (replay.js does both) never hits a timer.
/// 3D (the pop-out's 3D switch, so the app and the pop-out stay in step): the page's own d3=1, remembered the same way;
/// the app reloads into it. A drag still moves the window; the 3D graph turns by itself.
const INIT: &str = r#"(() => {
  // no scroll bar (Angelo, 8 November: "there is a scroll bar appearing"): the page is wider and taller than the window
  const css = 'html,body{background:transparent!important;overflow:hidden!important;scrollbar-width:none!important}::-webkit-scrollbar{display:none!important}'
    + 'body *:not(.lv-display):not(.lv-display *):not(#hexapp-ui):not(#hexapp-ui *){visibility:hidden!important}'
    + '.lv-display{visibility:visible!important}.lv-display,.lv-display .lv{background:transparent!important}'
    + '.lv-display .lv,.lv-display .lv-3d{cursor:default!important}.lv-display .lv-fill{opacity:1!important}';
  const add = () => { if (document.getElementById('hexapp-css')) return; const s = document.createElement('style'); s.id = 'hexapp-css'; s.textContent = css; (document.head || document.documentElement).appendChild(s) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  const inside = e => { const w = innerWidth, h = innerHeight, s = Math.min(w, h); const u = (e.clientX - (w - s) / 2) / s * 1000, v = (e.clientY - (h - s) / 2) / s * 1000, dv = Math.abs(v - 500); return dv <= 433 && Math.abs(u - 500) <= 500 - 250 * dv / 433 };
  const invoke = (cmd, args) => { try { return window.__TAURI_INTERNALS__.invoke(cmd, args || {}) } catch (e) { } };
  // Calm on by default (Angelo, 8 November: "it sent my laptop's fan in high gear"); off only when chosen
  let calm = true; try { calm = localStorage.getItem('hexapp-calm') !== '0' } catch (e) { }
  const R = window.requestAnimationFrame.bind(window), C = window.cancelAnimationFrame.bind(window), ids = new Map(); let n = 1e9, lastT = 0;
  window.requestAnimationFrame = cb => { const id = ++n;
    const go = () => ids.set(id, R(ts => { ids.delete(id); if (calm && ts !== lastT && ts - lastT < 60) return later(); lastT = ts; cb(ts) }));
    const later = () => ids.set(id, -setTimeout(go, Math.max(0, lastT + 66 - performance.now())));
    calm ? later() : go(); return id };
  window.cancelAnimationFrame = id => { const r = ids.get(id); if (r === undefined) return C(id); ids.delete(id); r < 0 ? clearTimeout(-r) : C(r) };
  window.__hexapp = { calm: () => calm, setCalm: v => { calm = !!v; try { localStorage.setItem('hexapp-calm', calm ? '1' : '0') } catch (e) { } },
    d3: () => d3, set3d: v => { try { localStorage.setItem('hexapp-3d', v ? '1' : '0') } catch (e) { } ; go3d(!!v) } };
  let d3 = /(^|&)d3=1(&|$)/.test(location.search.slice(1)); try { const k = localStorage.getItem('hexapp-3d'); if (k !== null && (k === '1') !== d3) go3d(k === '1') } catch (e) { }
  function go3d(v) { if (v === d3) return; const q = location.search.slice(1).split('&').filter(x => x && x !== 'd3=1'); if (v) q.push('d3=1'); location.replace(location.pathname + '?' + q.join('&') + location.hash) }
  addEventListener('mousedown', e => { if (e.button === 0 && inside(e) && !(e.target.closest && e.target.closest('#hexapp-ui'))) { e.preventDefault(); invoke('plugin:window|start_dragging', { label: 'live' }) } }, true);
  addEventListener('contextmenu', e => { e.preventDefault(); invoke('show_menu', { calm, d3 }) }, true);
  addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); const p = document.getElementById('hexapp-panel'); if (p) p.hidden = true } }, true);
  // The control panel (Angelo, 8 November: "a little control panel to choose the view, to resize it, etc. Also to close
  // it"): a quiet gear and a close button beside the logos at the hexagon's top; the gear opens a small panel in the hexagon's middle,
  // the same choices as the right-click menu. Inside the hexagon, so its clicks reach the page; a drag never starts on it.
  const ui = () => {
    if (document.getElementById('hexapp-ui') || !document.body) return;
    const lay = (() => { try { return localStorage.getItem('ak.lvLayout') || 'ring' } catch (e) { return 'ring' } })();
    const st = document.createElement('style'); st.textContent = '#hexapp-ui,#hexapp-ui *{visibility:visible!important}#hexapp-ui #hexapp-panel[hidden]{display:none!important}#hexapp-ui{position:fixed;inset:0;pointer-events:none;z-index:2147483000;font:500 13px/1.2 system-ui,sans-serif;color:#eef3f8}'
      + '#hexapp-ui button{pointer-events:auto;cursor:pointer;border:1px solid rgba(201,214,227,.35);background:rgba(14,32,53,.88);color:#eef3f8;border-radius:999px;font:inherit}'
      + '#hexapp-ui button:hover,#hexapp-ui button:focus-visible{border-color:#05BFE9;outline:none}'
      + '#hexapp-bar{position:absolute;left:calc(50% + min(100vw,100vh)*.115);top:calc(50% - min(100vw,100vh)*.405);display:flex;gap:6px;opacity:.35;transition:opacity .2s}'
      + '#hexapp-ui:hover #hexapp-bar,#hexapp-bar:focus-within{opacity:1}#hexapp-bar button{width:26px;height:26px;padding:0;font-size:14px}'
      + '#hexapp-panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:auto;background:rgba(7,17,31,.94);border:1px solid #294A64;border-radius:14px;padding:10px 12px;display:grid;gap:8px;min-width:200px;box-shadow:0 8px 24px rgba(0,0,0,.4)}'
      + '#hexapp-panel[hidden]{display:none}#hexapp-panel b{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9EB2C7}'
      + '#hexapp-panel .r{display:flex;flex-wrap:wrap;gap:5px}#hexapp-panel .r button{padding:4px 10px}#hexapp-panel button[aria-pressed=true]{background:#05BFE9;color:#04121F;border-color:#05BFE9}';
    document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'hexapp-ui';
    const b = (id, t, on) => `<button type="button" data-a="${id}"${on === undefined ? '' : ` aria-pressed="${on}"`}>${t}</button>`;
    d.innerHTML = `<div id="hexapp-bar">${b('panel', '⚙')}${b('quit', '✕')}</div><div id="hexapp-panel" hidden role="dialog" aria-label="Controls">`
      + `<b>View</b><div class="r">${b('lv:ring', 'People ring', lay === 'ring')}${b('lv:agents', 'Agents ring', lay === 'agents')}${b('lv:work', 'Work', lay === 'work')}</div>`
      + `<div class="r">${b('2d', '2D', !d3)}${b('3d', '3D', d3)}</div>`
      + `<b>Size</b><div class="r">${b('size_s', 'S')}${b('size_m', 'M')}${b('size_l', 'L')}</div>`
      + `<b>Window</b><div class="r">${b('on_top', 'Always on top')}${b('calm', 'Calm', calm)}</div>`
      + `<div class="r">${b('browser', 'Open in browser')}${b('reload', 'Reload')}${b('quit', 'Close')}</div></div>`;
    document.body.appendChild(d);
    d.addEventListener('click', e => { const t = e.target.closest('button'); if (!t) return; const a = t.dataset.a, p = document.getElementById('hexapp-panel');
      if (a === 'panel') { p.hidden = !p.hidden; return }
      if (a.startsWith('lv:')) { try { localStorage.setItem('ak.lvLayout', a.slice(3)) } catch (e) { } location.reload(); return }
      if (a === '2d' || a === '3d') { window.__hexapp.set3d(a === '3d'); return }
      if (a === 'calm') { window.__hexapp.setCalm(!calm); t.setAttribute('aria-pressed', String(calm)); return }
      if (a === 'reload') { location.reload(); return }
      Promise.resolve(invoke('app_action', { id: a })).then(v => { if (a === 'on_top' && typeof v === 'boolean') t.setAttribute('aria-pressed', String(v)) });
      if (a === 'size_s' || a === 'size_m' || a === 'size_l') p.hidden = true });
    Promise.resolve(invoke('app_action', { id: 'on_top_state' })).then(v => { const t = d.querySelector('[data-a=on_top]'); if (t && typeof v === 'boolean') t.setAttribute('aria-pressed', String(v)) });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
})();"#;

static ON_TOP: AtomicBool = AtomicBool::new(true);

/// The full command centre, for "Open in browser".
const BROWSER_URL: &str = "https://web-summit.sgit.ai/people/angelo/app/index.html#live";

/// The app's menu, opened by a right-click on the hexagon; calm and d3 are the page's current settings (INIT keeps them).
#[tauri::command]
fn show_menu(window: WebviewWindow, calm: Option<bool>, d3: Option<bool>) -> Result<(), String> {
    let app = window.app_handle();
    let err = |e: tauri::Error| e.to_string();
    let item = |id: &str, text: &str| MenuItem::with_id(app, id, text, true, None::<&str>).map_err(err);
    let size = Submenu::with_items(app, "Size", true, &[&item("size_s", "Small")?, &item("size_m", "Medium")?, &item("size_l", "Large")?]).map_err(err)?;
    let on_top = CheckMenuItem::with_id(app, "on_top", "Always on top", true, ON_TOP.load(Ordering::Relaxed), None::<&str>).map_err(err)?;
    let calm = CheckMenuItem::with_id(app, "calm", "Calm (15 frames a second)", true, calm.unwrap_or(false), None::<&str>).map_err(err)?;
    let d3 = CheckMenuItem::with_id(app, "d3", "3D", true, d3.unwrap_or(false), None::<&str>).map_err(err)?;
    let sep = PredefinedMenuItem::separator(app).map_err(err)?;
    let sep2 = PredefinedMenuItem::separator(app).map_err(err)?;
    let menu = Menu::with_items(app, &[&on_top, &calm, &d3, &size, &sep, &item("browser", "Open in browser")?, &item("reload", "Reload")?, &sep2, &item("quit", "Quit")?]).map_err(err)?;
    window.popup_menu(&menu).map_err(err)
}

/// The control panel's actions (the same as the menu's, for the window itself); returns "always on top" afterwards.
/// Only these ids do anything; any other is ignored.
#[tauri::command]
fn app_action(app: AppHandle, id: String) -> bool {
    if id != "on_top_state" && matches!(id.as_str(), "on_top" | "size_s" | "size_m" | "size_l" | "browser" | "quit") { act(&app, &id) }
    ON_TOP.load(Ordering::Relaxed)
}

fn on_menu(app: &AppHandle, event: MenuEvent) { act(app, event.id().as_ref()) }

fn act(app: &AppHandle, id: &str) {
    let Some(w) = app.get_webview_window(LABEL) else { return };
    match id {
        "on_top" => { let v = !ON_TOP.load(Ordering::Relaxed); ON_TOP.store(v, Ordering::Relaxed); let _ = w.set_always_on_top(v); }
        "size_s" => { let _ = w.set_size(LogicalSize::new(280.0, 280.0)); }
        "size_m" => { let _ = w.set_size(LogicalSize::new(420.0, 420.0)); }
        "size_l" => { let _ = w.set_size(LogicalSize::new(640.0, 640.0)); }
        "calm" => { let _ = w.eval("window.__hexapp && __hexapp.setCalm(!__hexapp.calm())"); }
        "d3" => { let _ = w.eval("window.__hexapp && __hexapp.set3d(!__hexapp.d3())"); }
        "browser" => open_in_browser(BROWSER_URL),
        "reload" => { let _ = w.eval("location.reload()"); }
        "quit" => app.exit(0),
        _ => {}
    }
}

/// The system's own way to open an address in the default browser; no plugin, no shell permission for the page.
fn open_in_browser(url: &str) {
    #[cfg(target_os = "macos")]
    let r = std::process::Command::new("open").arg(url).spawn();
    #[cfg(target_os = "windows")]
    let r = std::process::Command::new("explorer").arg(url).spawn();
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    let r = std::process::Command::new("xdg-open").arg(url).spawn();
    let _ = r;
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![show_menu, app_action])
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
