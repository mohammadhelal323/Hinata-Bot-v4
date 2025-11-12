// give.js
// Command: /give <url>
// Auto detects image or text and sends accordingly
// Author: Helal (Credit Locked)

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "code",
    version: "4.0",
    author: "Helal", // ⚠️ Credit Locked
    countDown: 2,
    role: 0,
    category: "utility",
    shortDescription: "Auto show text or image from link",
    longDescription:
      "Fetches data from any link. If it's an image, sends the photo. If it's text, shows it directly.",
    guide: "{pn} <url>\n\nExample:\n/give https://pastebin-api.vercel.app/raw/B3KZjs\n/give https://i.ibb.co/xyz123/photo.jpg"
  },

  onStart: async function ({ message, args }) {
    // 🔒 Credit Lock
    if (this.config.author !== "Helal") {
      return message.reply("🚫 This command is credit locked by Helal!");
    }

    if (!args[0])
      return message.reply(
        "⚠️ Please provide a valid link.\nExample:\n/give https://pastebin-api.vercel.app/raw/B3KZjs"
      );

    const url = args[0];

    // ✅ URL validation
    if (!/^https?:\/\//.test(url))
      return message.reply("❌ Invalid URL! Must start with http or https.");

    message.reply("⏳ Fetching content...");

    try {
      // 🔍 HEAD request to detect content type
      const headRes = await axios.head(url).catch(() => null);
      const contentType = headRes?.headers?.["content-type"] || "";

      // 🎨 If image detected
      if (contentType.startsWith("image/")) {
        return message.reply({
          body: `🖼️ Image from:\n${url}`,
          attachment: await streamFromURL(url)
        });
      }

      // 📝 Otherwise treat as text
      const res = await axios.get(url, { responseType: "text", timeout: 20000 });
      const text = res.data.trim();

      if (!text) return message.reply("❌ No readable text found at this link.");

      if (text.length > 18000) {
        return message.reply(
          `⚠️ The text is too long (${text.length} characters).\nHere’s the first part:\n\n${text.slice(
            0,
            18000
          )}\n\n...⚠️ Truncated.`
        );
      }

      return message.reply(`📄 Content from:\n${url}\n\n${text}`);
    } catch (err) {
      console.error("❌ Error fetching URL:", err.message);
      return message.reply("❌ Failed to fetch content. The link might be invalid or unreachable.");
    }
  }
};

// Helper function: create stream from image URL
async function streamFromURL(url) {
  const response = await axios.get(url, { responseType: "stream" });
  const tempPath = path.join(__dirname, "cache", `img_${Date.now()}.jpg`);

  // create cache folder if not exist
  if (!fs.existsSync(path.join(__dirname, "cache"))) {
    fs.mkdirSync(path.join(__dirname, "cache"));
  }

  const writer = fs.createWriteStream(tempPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      const stream = fs.createReadStream(tempPath);
      // auto delete after 10s
      setTimeout(() => fs.unlink(tempPath, () => {}), 10000);
      resolve(stream);
    });
    writer.on("error", reject);
  });
}