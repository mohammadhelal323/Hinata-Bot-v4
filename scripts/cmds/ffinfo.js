// commands/ffinfo.js
// 🎮 Free Fire Player Info - Stylish UI Edition
// 🔒 Credit Locked: Helal | Unauthorized modification prohibited!

const axios = require("axios");

module.exports = {
  config: {
    name: "ffinfo",
    version: "3.1.0",
    author: "Helal", // ⚠️ Credit Locked
    role: 0,
    guide: "/ffinfo <uid>",
    category: "game"
  },

  onStart: async function ({ api, event, args }) {
    // 🔒 Credit lock check
    if (this.config.author !== "Helal") {
      return api.sendMessage("🚫 This command is credit locked by Helal!", event.threadID);
    }

    const uid = args[0]?.trim();
    if (!uid || !/^\d+$/.test(uid)) {
      return api.sendMessage("⚠️ Please enter a valid UID!\n📘 Example: /ffinfo 9713759707", event.threadID);
    }

    const url = `https://mahbub-ullash.cyberbot.top/api/player-info?uid=${uid}`;
    api.sendMessage("⏳ Fetching player info... please wait.", event.threadID);

    try {
      const { data } = await axios.get(url, { timeout: 10000 });
      if (!data?.message?.basicInfo) {
        return api.sendMessage("❌ Player not found! Please check the UID again.", event.threadID);
      }

      const b = data.message.basicInfo;
      const c = data.message.clanBasicInfo || {};
      const s = data.message.socialInfo || {};
      const captain = data.message.captainBasicInfo || {};

      // 🏅 Rank mapping
      const rank = {
        "301": "🥉 Bronze",
        "302": "🥈 Silver",
        "303": "🥇 Gold",
        "304": "💎 Platinum",
        "305": "💠 Diamond",
        "306": "🔥 Master",
        "307": "👑 Grandmaster"
      }[b.rank] || `#${b.rank}`;

      const info = `
🎮 𝗙𝗿𝗲𝗲 𝗙𝗶𝗿𝗲 𝗣𝗹𝗮𝘆𝗲𝗿 𝗜𝗻𝗳𝗼
━━━━━━━━━━━━━━━
👤 Name: ${b.nickname || "N/A"}
🆔 UID: ${b.accountId || uid}
🌍 Region: ${b.region || "Unknown"}
⭐ Level: ${b.level || 0}
🏅 Rank: ${rank} (${b.rankingPoints || 0} RP)
💖 Likes: ${b.liked || 0}
📅 Last Login: ${b.lastLoginAt ? new Date(b.lastLoginAt * 1000).toLocaleDateString() : "N/A"}

🏰 Clan: ${c.clanName || "No Clan"}
📊 Clan Level: ${c.clanLevel || "N/A"}
👑 Captain: ${captain.nickname || "N/A"}

💬 Signature: ${s.signature || "N/A"}
📆 Season ID: ${b.seasonId || "N/A"}
━━━━━━━━━━━━━━━
🔹 ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐇𝐞𝐥𝐚𝐥 💠
`.trim();

      // Avatar Image (auto handle fail)
      const avatarUrl = `https://api.duniagames.co.id/api/content/upload/file/${b.headPic}.png`;

      try {
        const imageStream = await global.utils.getStreamFromURL(avatarUrl);
        return api.sendMessage(
          { body: info, attachment: imageStream },
          event.threadID
        );
      } catch {
        return api.sendMessage(info, event.threadID);
      }
    } catch (err) {
      console.error("FFINFO Error:", err.message);
      const status = err.response?.status;
      if (status === 500) {
        api.sendMessage("⚠️ Server Error! Please try again later.", event.threadID);
      } else if (status === 404) {
        api.sendMessage("❌ Invalid UID! Please check again.", event.threadID);
      } else {
        api.sendMessage("🚫 Failed to fetch player info. Try again later.", event.threadID);
      }
    }
  }
};