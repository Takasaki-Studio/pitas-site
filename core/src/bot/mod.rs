mod commands;

use serenity::{framework::StandardFramework, Client};

use crate::{config::get_token, database};

pub async fn start() {
    let token = get_token();
    let framework = StandardFramework::new().configure(|c| c.prefix("'"));
    let mut client = Client::builder(token).framework(framework).await.unwrap();

    client.start().await.unwrap();
}
