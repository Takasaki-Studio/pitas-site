use serenity::{
    client::Context,
    framework::standard::{
        macros::{command, group},
        Args, CommandResult,
    },
    model::channel::Message,
};

use super::Database;

use crate::{
    common,
    database::{
        links,
        models::{Links, LinksDto},
    },
};

#[group]
#[commands(add_short, short_list)]
pub(super) struct ShortLink;

#[command("addshort")]
async fn add_short(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let url = args.single::<String>().ok();

    match url {
        Some(url) => {
            let name = args.rest().trim();
            let link = LinksDto {
                url,
                id: if !name.is_empty() {
                    Some(name.to_owned())
                } else {
                    None
                },
            };

            let result = {
                let data = ctx.data.read().await;
                let db = data.get::<Database>().unwrap();
                common::add_short_link(link, db).await
            };

            match result {
                Ok(id) => {
                    msg.channel_id
                        .say(&ctx, format!("Link added with id: {}", id))
                        .await?;
                }
                Err(e) => {
                    log::error!("{}", e);
                    msg.channel_id.say(&ctx, "Error adding link").await?;
                }
            }
        }
        None => {
            msg.channel_id
                .say(ctx, "Please provide a URL to shorten.")
                .await?;
            return Ok(());
        }
    }

    Ok(())
}

#[command("shortlist")]
async fn short_list(ctx: &Context, msg: &Message) -> CommandResult {
    let itens = {
        let data = ctx.data.read().await;
        let db = data.get::<Database>().unwrap();
        links::list(db, 10, 0).await
    };
    let itens = itens.iter().map(|Links { id, url }| {
        let url = if url.len() > 20 {
            format!("{}...", &url[..20])
        } else {
            url.to_owned()
        };

        format!("{} - {}", id, url)
    }).collect::<Vec<String>>();

    msg.channel_id.say(ctx, format!("{:?}", itens)).await?;

    Ok(())
}
