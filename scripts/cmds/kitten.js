const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "kitten",
    version: "1.0",
    author: "Helal",
    category: "fun",
    shortDescription: "Random cute white kitten generator",
    guide: "/kitten"
  },

  onStart: async function({ api, event }) {
    try {
      const url = "https://api.thecatapi.com/v1/images/search?mime_types=jpg,png&limit=1&color=white";
      const res = await axios.get(url);

      if (!res.data || !res.data[0] || !res.data[0].url) {
        return api.sendMessage("❌ Couldn’t fetch kitten photo!", event.threadID, event.messageID);
      }

      const imgURL = res.data[0].url;

      const imgData = await axios.get(imgURL, { responseType: "arraybuffer" });

      const cache = path.join(__dirname, "cache", "kitten.png");
      fs.writeFileSync(cache, Buffer.from(imgData.data));

      return api.sendMessage(
        {
          body: "🐾 Cute Mini White Kitten Just For You! 😸💖",
          attachment: fs.createReadStream(cache)
        },
        event.threadID,
        event.messageID
      );
    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ Error while fetching kitten :(", event.threadID, event.messageID);
    }
  }
};