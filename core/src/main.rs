mod database;

#[macro_use]
extern crate rocket;

use database::DatabasePool;
use rocket::fs::FileServer;

#[get("/counter")]
async fn counter(pool: &rocket::State<DatabasePool>) -> String {
    sqlx::query("insert into contador values (1)")
        .execute(&**pool)
        .await
        .unwrap();

    let counter: (i64,) = sqlx::query_as("select count(*) from contador")
        .fetch_one(&**pool)
        .await
        .unwrap();

    counter.0.to_string()
}

#[launch]
async fn run() -> _ {
    let db_pool = database::connect_database().await;

    rocket::build()
        .manage::<DatabasePool>(db_pool)
        .mount("/", FileServer::from("static"))
        .mount("/", routes![counter])
}
