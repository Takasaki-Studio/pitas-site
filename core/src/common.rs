use base64::encode;
use sha2::{Digest, Sha512};

use crate::database::{
    links,
    models::{Links, LinksDto},
    DatabasePool,
};

pub async fn add_short_link(data: LinksDto, pool: &DatabasePool) -> Result<String, sqlx::Error> {
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

    links::add(pool, link).await
}
