#![allow(clippy::needless_lifetimes)]
mod database;

#[macro_use]
extern crate rocket;

use base64::encode;
use database::{
    links,
    models::{Links, LinksDto},
    DatabasePool,
};
use rocket::{
    fs::FileServer,
    http::Status,
    response::{status, Redirect},
    serde::json::Json,
    State,
};
use sha2::{Digest, Sha512};

#[post("/", data = "<data>")]
async fn add_short_url(
    pool: &State<DatabasePool>,
    data: Json<LinksDto>,
) -> Result<status::Created<String>, status::Custom<String>> {
    let id = if let Some(id) = &data.id {
        id.to_owned()
    } else {
        let mut hasher = Sha512::new();
        hasher.update(data.url.as_bytes());
        let full = encode(hasher.finalize());
        full[..7].to_owned()
    };

    let url = if data.url.starts_with("http") {
        data.url.clone()
    } else {
        format!("http://{}", data.url)
    };

    let link = Links { id, url };

    let result = links::add(pool, link).await;
    match result {
        Ok(id) => Ok(status::Created::new(format!("/{}", id)).tagged_body(id)),
        Err(e) => Err(status::Custom(
            Status::InternalServerError,
            format!("{}", e),
        )),
    }
}

#[get("/<id>")]
async fn trigger_link<'a>(
    pool: &State<DatabasePool>,
    id: &'a str,
) -> Result<Redirect, status::NotFound<&'a str>> {
    let link = links::get(pool, id).await;
    match link {
        Some(link) => Ok(Redirect::to(link.url)),
        None => Err(status::NotFound(id)),
    }
}

#[launch]
async fn run() -> _ {
    let db_pool = database::connect_database().await;

    rocket::build()
        .manage::<DatabasePool>(db_pool)
        .mount("/", FileServer::from("static"))
        .mount("/s", routes![trigger_link])
        .mount("/api/links", routes![add_short_url])
}
