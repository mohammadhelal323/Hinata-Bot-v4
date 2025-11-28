module.exports = {
  config: {
    name: "setallbox",
    aliases: ["box", "setbox"],
    version: "1.0",
    role: 1,
    author: "Helal",
    shortDescription: "Group settings manager",
    longDescription: "Change emoji, title, nickname, color, admin, poll and avatar.",
    category: "group",
    guide: {
      en: "{p}setallbox emoji\n"
        + "{p}setallbox Bname <text>\n"
        + "{p}setallbox name <name>\n"
        + "{p}setallbox avt (reply to photo)\n"
        + "{p}setallbox rcolor\n"
        + "{p}setallbox QTV <@tag or reply>\n"
        + "{p}setallbox poll <title => option1 | option2 | ...>"
    }
  },

  onStart: async function ({ api, event, args, threads }) {
    const fs = require("fs-extra");
    const request = require("request");

    // ========== EMOJI ==========
    if (args[0] === "emoji") {
      const list = ["😀", "😃", "😄", "😁", "😆", "😂", "🤣", "😊", "😍", "😎", "🤩", "😡", "😱", "😴", "🤖", "💀"];
      const chosen = args[1] ? args[1] : list[Math.floor(Math.random() * list.length)];

      try {
        api.changeThreadEmoji(chosen, event.threadID);
      } catch (e) {
        api.sendMessage(`Error: ${e.message}`, event.threadID);
      }
      return;
    }

    // ========== CHANGE GROUP NAME ==========
    if (args[0] === "Bname") {
      const newName = args.slice(1).join(" ");
      api.setTitle(newName, event.threadID);
      return;
    }

    // ========== RANDOM COLOR ==========
    if (args[0] === "rcolor") {
      const colors = [
        '196241301102133', '169463077092846', '2442142322678320',
        '234137870477637', '980963458735625', '175615189761153'
      ];

      const color = colors[Math.floor(Math.random() * colors.length)];

      api.changeThreadColor(color, event.threadID, err => {
        if (err) api.sendMessage("Unexpected error occurred!", event.threadID);
      });
      return;
    }

    // ========== CHANGE NICKNAME ==========
    if (args[0] === "name") {
      const mention = Object.keys(event.mentions)[0];
      const name = args.slice(1).join(" ");

      if (!mention) {
        api.changeNickname(name, event.threadID, event.senderID);
      } else {
        api.changeNickname(name.replace(event.mentions[mention], ""), event.threadID, mention);
      }
      return;
    }

    // ========== CHANGE GROUP AVATAR ==========
    if (args[0] === "avt") {
      if (event.type !== "message_reply") {
        return api.sendMessage("Reply to a photo!", event.threadID);
      }

      const att = event.messageReply.attachments[0];
      if (!att || att.type !== "photo") {
        return api.sendMessage("Reply must contain 1 photo!", event.threadID);
      }

      const path = __dirname + "/cache/avt.png";
      request(att.url)
        .pipe(fs.createWriteStream(path))
        .on("close", () => {
          api.changeGroupImage(fs.createReadStream(path), event.threadID, () =>
            fs.unlinkSync(path)
          );
        });
      return;
    }

    // ========== POLL MAKER ==========
    if (args[0] === "poll") {
      const text = args.join(" ");
      const title = text.slice(5, text.indexOf(" => "));
      const options = text.substring(text.indexOf(" => ") + 4).split(" | ");

      const obj = {};
      options.forEach(o => obj[o] = false);

      api.createPoll(title, event.threadID, obj, err => {
        if (err) api.sendMessage("Format: poll <title => option1 | option2 | ...>", event.threadID);
      });
      return;
    }

    // ========== ADMIN (QTV) ==========
    if (args[0] === "QTV") {
      const threadInfo = await threads.getInfo(event.threadID);
      const isAdmin = threadInfo.adminIDs.some(e => e.id === event.senderID);

      if (!isAdmin) return api.sendMessage("You are not an admin!", event.threadID);

      let target;
      if (event.type === "message_reply") {
        target = event.messageReply.senderID;
      } else {
        target = Object.keys(event.mentions)[0] || args[1];
      }

      const alreadyAdmin = threadInfo.adminIDs.some(e => e.id === target);

      api.changeAdminStatus(event.threadID, target, !alreadyAdmin);
      return;
    }

    // ========== NO SUBCOMMAND ==========
    api.sendMessage("Use: setallbox <emoji/Bname/name/avt/rcolor/QTV/poll>", event.threadID);
  }
};