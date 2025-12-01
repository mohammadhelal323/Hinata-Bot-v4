const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "madara",
    version: "1.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: { en: "Get 6 random Madara Uchiha images with a famous dialogue." },
    category: "naruto",
    guide: { en: "/madara - Get 6 Madara Uchiha images with dialogue" },
  },

  onStart: async function ({ api, event }) {
    try {
      const query = "Madara Uchiha"; // Fixed search query
      const count = 6;

      // Famous Madara Uchiha dialogues
      const dialogues = [
        "Madara: 'Wake up to reality! Nothing ever goes as you plan in this world.'",
        "Madara: 'im the ghost of the Uchiha Madara Uchiha.'",
        "Madara: 'The concept of peace is just an illusion.'",
        "Madara: 'When a man learns to love, he must bear the pain of losing.'",
        "Madara: 'In this world, wherever there is light – there will always be shadows.'"
      ];

      const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];

      const GITHUB_RAW = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json";
      const rawRes = await axios.get(GITHUB_RAW);
      const apiBase = rawRes.data.apiv1;

      const apiUrl = `${apiBase}/api/googleimage?query=${encodeURIComponent(query)}`;
      const res = await axios.get(apiUrl);
      const images = res.data?.images || [];

      if (!images.length)
        return api.sendMessage(`❌ No images found for "${query}"`, event.threadID, event.messageID);

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      // Shuffle images for randomness
      const shuffled = images.sort(() => 0.5 - Math.random());
      const attachments = [];

      for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        const url = shuffled[i];
        try {
          const imgRes = await axios.get(url, { responseType: "arraybuffer" });
          const imgPath = path.join(cacheDir, `madara_${i + 1}.jpg`);
          await fs.writeFile(imgPath, imgRes.data);
          attachments.push(fs.createReadStream(imgPath));
        } catch (e) {
          continue;
        }
      }

      if (!attachments.length)
        return api.sendMessage(`❌ Couldn't download any valid images for "${query}"`, event.threadID, event.messageID);

      await api.sendMessage(
        { body: `💬 ${randomDialogue}\n\nHere are 6 random Madara Uchiha images!`, attachment: attachments },
        event.threadID,
        event.messageID
      );

      // Cleanup
      if (fs.existsSync(cacheDir)) await fs.remove(cacheDir);

    } catch (err) {
      console.error("Madara Img Error:", err.message);
      return api.sendMessage("❌ Something went wrong. Try again later.", event.threadID, event.messageID);
    }
  },
};