pub fn get_token() -> String {
    std::env::var("DISCORD_TOKEN").unwrap()
}
