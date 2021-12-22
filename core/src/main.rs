#[macro_use]
extern crate rocket;

use rocket::fs::FileServer;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn run() -> _ {
    rocket::build()
        .mount("/test", routes![index])
        .mount("/", FileServer::from("static"))
}
