const fs = require("fs");

module.exports = {
  config: {
    name: "help3",
    aliases: ["menu3"],
    version: "2.5",
    author: "Helal",
    role: 0,
    category: "system",
    shortDescription: "Show full command list without edit animation",
  },

  onStart: async function ({ api, event, args }) {
    const commands = global.GoatBot?.commands || new Map();

    // 🔹 /help3 <command> → show info
    if (args[0]) {
      const cmdName = args[0].toLowerCase();

      const cmd =
        commands.get(cmdName) ||
        [...commands.values()].find(c =>
          (c.config?.aliases || []).map(a => a.toLowerCase()).includes(cmdName)
        );

      if (!cmd) {
        return api.sendMessage(`❌ Command '${cmdName}' not found.`, event.threadID);
      }

      const { name, version, author, role, shortDescription, aliases } = cmd.config;

      const info =
        `🧩 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙸𝙽𝙵𝙾\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔹 Name: ${name}\n` +
        `🔹 Aliases: ${aliases?.join(", ") || "None"}\n` +
        `🔹 Version: ${version || "1.0"}\n` +
        `🔹 Role: ${role}\n` +
        `🔹 Author: ${author || "Unknown"}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 Description: ${shortDescription || "No description provided."}`;

      return api.sendMessage(info, event.threadID);
    }

    // 🔹 Full menu without edit animation
    const categories = {};
    for (const [name, cmd] of commands.entries()) {
      const cat = cmd.config?.category?.toUpperCase() || "🎲 OTHER";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    let output =
      "┍━━━━━━━━━━━━━━━━◊\n" +
      "┋ [✦𝙷𝚒𝚗𝚊𝚝𝚊 Bot Menu✦]\n" +
      "┕━━━━━━━━━━━━━━◊\n";

    for (const [cat, cmds] of Object.entries(categories)) {
      output += `┍━━━[ ${cat} ]\n`;
      for (let i = 0; i < cmds.length; i += 2) {
        const a = cmds[i] ? `🔹 ${cmds[i]}` : "";
        const b = cmds[i + 1] ? `   🔹 ${cmds[i + 1]}` : "";
        output += `┋${a}${b}\n`;
      }
      output += "┕━━━━━━━━━━━━◊\n";
    }

    output +=
      `\n📌 Total Commands: ${commands.size}\n` +
      `🔑 Prefix: /\n` +
      `👑 Owner: Helal\n` +
      `💡 Use: /help3 <command>\n` +
      "━━━━━━━━━━━━━━━━━━";

    return api.sendMessage(output, event.threadID);
  },
};