#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use sqlx::{Connection, Executor, PgConnection, Row};

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_tables, list_table])
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .run(context)
        .expect("error while running tauri application");
}

#[tauri::command]
async fn list_tables() -> Vec<String> {
    let mut conn = PgConnection::connect("postgres://test:testtest1234@localhost/test")
        .await
        .unwrap();
    let result = conn
        .fetch_all(
            "SELECT table_name from information_schema.tables WHERE table_schema not in ('information_schema', 'pg_catalog') and table_type = 'BASE TABLE'",
        )
        .await
        .unwrap();
    result
        .iter()
        .map(|row| row.try_get::<&str, usize>(0).unwrap())
        .map(String::from)
        .collect()
}

#[tauri::command]
async fn list_table(table_name: String) -> Vec<Vec<String>> {
    let mut conn = PgConnection::connect("postgres://test:testtest1234@localhost/test")
        .await
        .unwrap();
    let result = sqlx::query(&format!("SELECT * from {}", &table_name))
        .fetch_all(&mut conn)
        .await
        .unwrap();
    result
        .iter()
        .map(|row| {
            let mut index = 1;
            let mut result = Vec::default();
            while let Ok(entry) = row.try_get::<&str, usize>(index) {
                result.push(String::from(entry));
                index += 1;
            }
            result
        })
        .collect()
}
