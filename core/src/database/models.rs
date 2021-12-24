use rocket::serde::Deserialize;

#[derive(Deserialize)]
pub struct LinksDto {
    pub id: Option<String>,
    pub url: String,
}

pub struct Links {
    pub id: String,
    pub url: String,
}
