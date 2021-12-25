use serenity::{
    client::Context,
    framework::standard::{
        macros::{command, group},
        Args, CommandResult,
    },
    model::channel::Message,
};

use crate::{common, database::models::LinksDto};

#[group]
#[commands(add_short)]
pub(super) struct ShortLink;

#[command]
async fn add_short(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let url = args.single::<String>().ok();

    match url {
        Some(url) => {
            let name = args.rest().trim();
            let link = LinksDto {
                url,
                id: if name.is_empty() {
                    Some(name.to_owned())
                } else {
                    None
                },
            };

            // let result_add_url = common::add_short_link(link, pool)
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
