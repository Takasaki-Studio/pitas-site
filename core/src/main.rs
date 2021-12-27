#![allow(clippy::needless_lifetimes)]
mod backend;
mod bot;
mod common;
mod config;
mod database;

#[rocket::launch]
async fn start() -> _ {
    let db = database::connect_database().await;

    dotenv::dotenv().ok();
    bot::start(db.clone());
    backend::run(db).await
}
