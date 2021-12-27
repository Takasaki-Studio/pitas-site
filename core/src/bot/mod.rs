mod commands;

use std::thread;

use serenity::{framework::StandardFramework, prelude::TypeMapKey, Client};

struct Database;

impl TypeMapKey for Database {
    type Value = DatabasePool;
}

use crate::{config::get_token, database::DatabasePool};

#[tokio::main]
async fn run(db: DatabasePool) {
    let token = get_token();
    let framework = StandardFramework::new()
        .configure(|c| c.prefix("'"))
        .group(&commands::SHORTLINK_GROUP);
    let mut client = Client::builder(token).framework(framework).await.unwrap();

    {
        let mut data = client.data.write().await;
        data.insert::<Database>(db);
    }

    client.start().await.unwrap();
}

pub fn start(db: DatabasePool) {
    thread::spawn(|| {
        run(db);
    });
}
