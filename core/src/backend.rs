use crate::database::{links, DatabasePool};

use rocket::{
    fs::FileServer,
    get,
    response::{status, Redirect},
    routes, Build, Rocket, State,
};

// #[post("/", data = "<data>")]
// async fn add_short_url(
//     pool: &State<DatabasePool>,
//     data: Json<LinksDto>,
// ) -> Result<status::Created<String>, status::Custom<String>> {
//     let result = common::add_short_link((*data).clone(), pool).await;
//     match result {
//         Ok(id) => Ok(status::Created::new(format!("/{}", id)).tagged_body(id)),
//         Err(e) => Err(status::Custom(
//             Status::InternalServerError,
//             format!("{}", e),
//         )),
//     }
// }

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

pub async fn run(db: DatabasePool) -> Rocket<Build> {
    // let db_pool = database::connect_database().await;

    rocket::build()
        .manage::<DatabasePool>(db)
        .mount("/", FileServer::from("static"))
        .mount("/s", routes![trigger_link])
}
