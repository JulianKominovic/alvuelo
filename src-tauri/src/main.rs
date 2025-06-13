// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod command;
pub mod events;
pub mod multimedia;
pub mod window;

use multimedia::{MultimediaFrontendStruct, MultimediaTrait};
// Only on macOS
#[cfg(target_os = "macos")]
use tauri::{Listener, Manager};
use tauri_nspanel::ManagerExt;
use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};
use window::WebviewWindowExt;

const SPOTLIGHT_LABEL: &str = "main";

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![command::show, command::hide])
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_nspanel::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .setup(move |app| {
            // Set activation poicy to Accessory to prevent the app icon from showing on the dock
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let handle = app.app_handle();

            let window = handle.get_webview_window(SPOTLIGHT_LABEL).unwrap();

            // Convert the window to a spotlight panel
            let panel = window.to_spotlight_panel()?;

            handle.listen(
                format!("{}_panel_did_resign_key", SPOTLIGHT_LABEL),
                move |_| {
                    // Hide the panel when it's no longer the key window
                    // This ensures the panel doesn't remain visible when it's not actively being used
                    panel.order_out(None);
                },
            );

            Ok(())
        })
        // Register a global shortcut (⌘+K) to toggle the visibility of the spotlight panel
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_shortcut(Shortcut::new(Some(Modifiers::SUPER), Code::KeyI))
                .unwrap()
                .with_handler(|app, shortcut, event| {
                    if event.state == ShortcutState::Pressed
                        && shortcut.matches(Modifiers::SUPER, Code::KeyI)
                    {
                        let window = app.get_webview_window(SPOTLIGHT_LABEL).unwrap();

                        let panel = app.get_webview_panel(SPOTLIGHT_LABEL).unwrap();

                        if panel.is_visible() {
                            panel.order_out(None);
                        } else {
                            window.center_at_cursor_monitor().unwrap();

                            panel.show();
                        }
                    }
                })
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
