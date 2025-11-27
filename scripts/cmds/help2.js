const fs = require("fs");

module.exports = {
  config: {
    name: "help2",
    aliases: ["helpall"],
    version: "1.6",
    author: "Helal",
    role: 0,
    category: "system",
    shortDescription: "Show full command list or details of specific command"
  },

  onStart: async function ({ api, event, args }) {
    const commands = global.GoatBot?.commands || new Map();

    if (args[0]) {
      const cmdName = args[0].toLowerCase();
      const cmd = [...commands.values()].find(
        c =>
          c.config?.name?.toLowerCase() === cmdName ||
          (c.config?.aliases || []).map(a => a.toLowerCase()).includes(cmdName)
      );

      if (!cmd) return api.sendMessage(`❌ Command "${cmdName}" not found!`, event.threadID, event.messageID);

      const info =
        `┍━━━━━━━━━━━━━━━━◊\n` +
        `┋ [✦ ᴄᴏᴍᴍᴀɴᴅ ɪɴꜰᴏ ✦]\n` +
        `┕━━━━━━━━━━━━━━◊\n` +
        `┋ 🧩 ɴᴀᴍᴇ: ${cmd.config.name}\n` +
        `┋ 🏷️ ᴀʟɪᴀꜱ: ${cmd.config.aliases?.join(", ") || "None"}\n` +
        `┋ 📦 ᴠᴇʀꜱɪᴏɴ: ${cmd.config.version || "1.0"}\n` +
        `┋ 👑 ᴀᴜᴛʜᴏʀ: ${cmd.config.author || "Unknown"}\n` +
        `┋ 🧠 ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ: ${cmd.config.shortDescription || "No description"}\n` +
        `┋ 🔑 ᴘʀᴇꜰɪx: /\n` +
        `┕━━━━━━━━━━━━━━━━◊`;

      return api.sendMessage(info, event.threadID, event.messageID);
    }

    // ==========================
    // Show full command list
    // ==========================
    const categories = {};
    for (const [name, cmd] of commands.entries()) {
      const cat = cmd.config?.category?.toUpperCase() || "OTHER";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    let output =
      "┍━━━━━━━━━━━━━━━━◊\n" +
      "┋ [✦ 𝙷𝚒𝚗𝚊𝚝𝚊 𝙱𝚘𝚝 Menu ✦]\n" +
      "┕━━━━━━━━━━━━━━◊\n";

    for (const [cat, cmds] of Object.entries(categories)) {
      output += `┍━━━[ ${cat} ]\n`;
      output += cmds.map(c => `┋ 〄 ${c}`).join("\n") + "\n";
      output += "┕━━━━━━━━━━━━◊\n";
    }

    output += `\nTotal Commands: ${commands.size}\nPrefix: /\nOwner: Helal`;

    return api.sendMessage(output, event.threadID, event.messageID);
  }
};