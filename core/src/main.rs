#![allow(clippy::needless_lifetimes)]
mod backend;
mod bot;
mod common;
mod config;
mod database;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    backend::run_http_server();
    bot::start().await;
}
