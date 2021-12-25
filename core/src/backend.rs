use std::thread;

use crate::{
    common,
    database::{self, links, models::LinksDto, DatabasePool},
};

use rocket::{
    fs::FileServer,
    get,
    http::Status,
    post,
    response::{status, Redirect},
    routes,
    serde::json::Json,
    State,
};

#[post("/", data = "<data>")]
async fn add_short_url(
    pool: &State<DatabasePool>,
    data: Json<LinksDto>,
) -> Result<status::Created<String>, status::Custom<String>> {
    let result = common::add_short_link((*data).clone(), pool).await;
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

#[rocket::launch]
async fn run() -> _ {
    let db_pool = database::connect_database().await;

    rocket::build()
        .manage::<DatabasePool>(db_pool)
        .mount("/", FileServer::from("static"))
        .mount("/s", routes![trigger_link])
        .mount("/api/links", routes![add_short_url])
}

pub fn run_http_server() {
    thread::spawn(main);
}
