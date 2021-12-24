pub mod links;
pub mod models;

use std::path::{Path, PathBuf};

use sqlx::{migrate, sqlite::SqlitePoolOptions, Pool, Sqlite};
use tokio::fs::{self, File};

pub type DatabasePool = Pool<Sqlite>;

async fn check_and_create_db_folder() -> PathBuf {
    let folder = Path::new("db").to_path_buf();

    if !folder.exists() {
        fs::create_dir(&folder).await.unwrap();
    }

    folder
}

async fn check_and_create_db_file(folder: PathBuf) -> PathBuf {
    let file = folder.join("database.db");
    if !file.exists() {
        File::create(&file).await.unwrap();
    }

    file
}

pub async fn connect_database() -> DatabasePool {
    let folder = check_and_create_db_folder().await;
    let file = check_and_create_db_file(folder).await;

    let pool = SqlitePoolOptions::new()
        .min_connections(1)
        .max_connections(10)
        .connect_lazy(file.to_str().unwrap())
        .unwrap();

    migrate!().run(&pool).await.unwrap();

    pool
}
