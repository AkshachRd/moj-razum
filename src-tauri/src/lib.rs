use tauri::{Emitter, Manager};
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default()
      .level(log::LevelFilter::Info)
      .build()
    )
    .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
      // When a second instance is attempted (e.g., via deep link),
      // focus the main window of the existing instance.
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.set_focus();
        let _ = window.show();
      }

      // Forward any deep link URLs passed as args to the existing instance
      let urls: Vec<String> = args
        .into_iter()
        .filter(|a| a.starts_with("mentem://"))
        .collect();
      if !urls.is_empty() {
        let _ = app.emit("single-instance-deep-link", urls);
      }
    }))
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_dialog::init())
    .setup(|app| {
      #[cfg(desktop)]
      {
        // Ensure the scheme is registered at runtime for desktop platforms
        use tauri_plugin_deep_link::DeepLinkExt;
        app.deep_link().register("mentem")?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
