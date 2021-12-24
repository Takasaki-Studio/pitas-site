use super::{models::Links, DatabasePool};

pub async fn add(pool: &DatabasePool, data: Links) -> Result<String, sqlx::Error> {
    let exists = sqlx::query_as("select id from links where id = $1 limit 1")
        .bind(&data.id)
        .fetch_one(pool)
        .await;

    match exists {
        Ok((id,)) => Ok(id),
        Err(_) => {
            let data_id = data.id.clone();
            sqlx::query("insert into links values ($1, $2)")
                .bind(data.id)
                .bind(data.url)
                .execute(pool)
                .await?;
            Ok(data_id)
        }
    }
}

pub async fn get(pool: &DatabasePool, id: &str) -> Option<Links> {
    let finded = sqlx::query_as("select id, url from links where id = $1 limit 1")
        .bind(id)
        .fetch_one(pool)
        .await;

    match finded {
        Ok((id, url)) => Some(Links { id, url }),
        Err(_) => None,
    }
}
