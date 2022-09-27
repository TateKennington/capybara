#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{collections::HashMap, sync::Mutex, time::Instant};

use sqlx::{Column, Executor, PgPool, Row, TypeInfo};
use tauri::State;

#[derive(Clone, serde::Serialize)]
#[serde(untagged)]
pub enum Value {
    Null,
    Number(i32),
    String(String),
}

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DbColumn {
    name: String,
    type_name: String,
}

#[derive(Clone, serde::Serialize)]
pub struct Table {
    rows: Vec<Vec<Value>>,
    columns: Vec<DbColumn>,
}

#[derive(Clone, serde::Serialize)]
pub struct DatabaseInfo {
    tables: HashMap<String, Table>,
}

#[derive(Default)]
struct DbConnection(Mutex<Option<PgPool>>);

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .manage(DbConnection(Default::default()))
        .invoke_handler(tauri::generate_handler![list_tables, connect, disconnect])
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .run(context)
        .expect("error while running tauri application");
}

#[tauri::command]
async fn connect(url: String, connection: State<'_, DbConnection>) -> Result<(), ()> {
    let pool = PgPool::connect(&url).await;
    if let Ok(pool) = pool {
        *connection.0.lock().unwrap() = Some(pool);
        Ok(())
    } else {
        eprintln!("Error: {pool:?}");
        Err(())
    }
}

#[tauri::command]
async fn disconnect(connection: State<'_, DbConnection>) -> Result<(), ()> {
    let pool = {
        let pool = connection.0.lock().unwrap();
        pool.as_ref().unwrap().clone()
    };
    pool.close().await;
    *connection.0.lock().unwrap() = None;
    Ok(())
}

#[tauri::command]
async fn list_tables(connection: State<'_, DbConnection>) -> Result<DatabaseInfo, ()> {
    let pool = {
        let pool = connection.0.lock().unwrap();
        pool.as_ref().unwrap().clone()
    };

    //let start = Instant::now();
    let result = pool
        .fetch_all(
            "SELECT table_name from information_schema.tables WHERE table_schema not in ('information_schema', 'pg_catalog') and table_type = 'BASE TABLE'",
        )
        .await
        .unwrap();
    //println!("DB schema loaded in: {}ms", start.elapsed().as_millis());
    let mut tables = HashMap::default();
    let table_names = result
        .iter()
        .map(|row| row.try_get::<&str, usize>(0).unwrap())
        .map(String::from);
    for table_name in table_names {
        tables.insert(table_name.clone(), list_table(&table_name, &pool).await);
    }
    Ok(DatabaseInfo { tables })
}

async fn list_table(table_name: &String, pool: &PgPool) -> Table {
    let mut conn = pool.acquire().await.unwrap();
    //let start = Instant::now();
    let result = sqlx::query(&format!("SELECT * from {}", &table_name))
        .fetch_all(&mut conn)
        .await
        .unwrap();
    //println!("{table_name} loaded in: {}ms", start.elapsed().as_millis());
    let mut columns = vec![];
    let rows = result
        .iter()
        .map(|row| {
            if columns.is_empty() {
                columns = row
                    .columns()
                    .iter()
                    .map(|col| DbColumn {
                        name: String::from(col.name()),
                        type_name: String::from(col.type_info().name()),
                    })
                    .collect()
            }
            row.columns()
                .iter()
                .map(|col| match col.type_info().name() {
                    "INT4" => Value::Number(row.get(col.ordinal())),
                    "VARCHAR" => Value::String(row.get(col.ordinal())),
                    col_type => {
                        eprintln!("Unsupported column type {col_type}");
                        Value::Null
                    }
                })
                .collect()
        })
        .collect();
    Table { rows, columns }
}
