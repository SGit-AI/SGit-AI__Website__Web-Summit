// The two commands the live page may call (show_menu; app_action, the control panel's window actions), besides dragging the window: show_menu (capabilities/live-page.json).
fn main() {
    tauri_build::try_build(
        tauri_build::Attributes::new().app_manifest(tauri_build::AppManifest::new().commands(&["show_menu", "app_action"])),
    )
    .expect("tauri build");
}
