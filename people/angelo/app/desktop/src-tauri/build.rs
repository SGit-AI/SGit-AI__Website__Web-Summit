// The one command the live page may call, besides dragging the window: show_menu (capabilities/live-page.json).
fn main() {
    tauri_build::try_build(
        tauri_build::Attributes::new().app_manifest(tauri_build::AppManifest::new().commands(&["show_menu"])),
    )
    .expect("tauri build");
}
