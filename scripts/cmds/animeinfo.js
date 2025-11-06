// animeinfo.js
// Command: /animeinfo <anime name>
// Fetches anime information using MyAnimeList public API (via Jikan)
// Author: Helal (Credit Locked)

const axios = require("axios");

module.exports = {
  config: {
    name: "animeinfo",
    aliases: ["aniinfo", "ainfo"],
    version: "1.1",
    author: "Helal", // 🔒 Must remain "Helal"
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: { en: "Show detailed info about an anime" },
  },

  onStart: async function ({ message, args }) {
    // 🔒 Credit Lock system
    const LOCKED_AUTHOR = "Helal";
    const myAuthor = module.exports?.config?.author || this?.config?.author || null;
    if (myAuthor !== LOCKED_AUTHOR) {
      return message.reply(
        "❌ This command is credit-locked and cannot run because its author credit was modified."
      );
    }

    try {
      if (!args[0]) {
        return message.reply("❌ | Please provide an anime name.\nExample: /animeinfo One Piece");
      }

      const query = args.join(" ");
      const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`;

      const { data } = await axios.get(url);
      if (!data.data || data.data.length === 0)
        return message.reply("❌ | No results found for: " + query);

      const anime = data.data[0];
      const title = anime.title || "Unknown";
      const type = anime.type || "Unknown";
      const episodes = anime.episodes || "N/A";
      const status = anime.status || "Unknown";
      const rating = anime.score ? `${anime.score}/10` : "N/A";
      const year = anime.year || "Unknown";
      const genres = anime.genres?.map((g) => g.name).join(", ") || "Unknown";
      const studio = anime.studios?.[0]?.name || "Unknown";
      const synopsis = anime.synopsis
        ? anime.synopsis.slice(0, 300) + "..."
        : "No synopsis available.";
      const urlMAL = anime.url || "N/A";

      // 🌍 Country flag auto detection
      let country = "🇯🇵 Japan";
      if (studio.toLowerCase().includes("donghua") || studio.toLowerCase().includes("bilibili"))
        country = "🇨🇳 China";
      else if (studio.toLowerCase().includes("netflix") || studio.toLowerCase().includes("warner"))
        country = "🇺🇸 USA";
      else if (studio.toLowerCase().includes("studio mir") || studio.toLowerCase().includes("seoul"))
        country = "🇰🇷 South Korea";

      const info = `🎌 *Anime Info: ${title}*\n\n📺 Type: ${type}\n📅 Aired: ${year}\n⭐ Rating: ${rating}\n🎞️ Episodes: ${episodes}\n📡 Status: ${status}\n🏷️ Genre: ${genres}\n🏢 Studio: ${studio}\n🌍 Country: ${country}\n\n📖 Synopsis: ${synopsis}\n🔗 MyAnimeList: ${urlMAL}`;

      message.reply(info);
    } catch (err) {
      console.error(err);
      message.reply("❌ | Error fetching anime info. Please try again later.");
    }
  },
};