module.exports.config = {
    name: "antibot",
    version: "3.5",
    hasPermssion: 1,
    credits: "Helal",
    description: "Detect & Kick unwanted bots",
    commandCategory: "System",
    usages: "antibot on/off",
    cooldowns: 3
};

const fs = require("fs");
const path = __dirname + "/antibot.json";

// create file if not exists
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ enabled: false }));
}

module.exports.onStart = ({ api, event, args }) => {
    const data = JSON.parse(fs.readFileSync(path));

    if (!["on", "off"].includes(args[0])) {
        return api.sendMessage("⚙ Usage: /antibot on/off", event.threadID);
    }

    data.enabled = args[0] === "on";
    fs.writeFileSync(path, JSON.stringify(data));

    return api.sendMessage(
        `✅ AntiBot is now: ${data.enabled ? "ON" : "OFF"}`,
        event.threadID
    );
};

// BOT PATTERNS (Super Pattern Pack)
const botPatterns = [
    "restarting bot", "bot restarted", "successfully restart",
    "bot is online", "bot online",

    "✦━━━━━━━━━━━━━━━━━✦", "╭", "╰", "❂", "╮", "╯",
    "━━━━━━━━━━━━", "⟡", "✦", "✧", "★", "☆",

    "global prefix:", "your box:", "cmd menu:", "dev:",
    "ʙᴏx", "ᴘʀᴇғɪx", "ᴍᴇɴᴜ", "ᴅᴇᴠ",

    "usage:", "example:", "use:", "syntax:",
    "please provide", "missing arguments",
    ".ephoto", "<text> - <id>",

    "hey", "i'm", "at your service", "did you ask my prefix",
    "i am your", "your service",

    "error:", "stack trace", "undefined", "syntax error",
    "processing", "json output", "failed:", "success:",

    "uptime", "latency", "ping:", "command list",
    "help menu", "prefix:",

    "only bot admin can use", "cannot use this command",
    "admin only"
];

// 2s reply threshold
const BOT_REPLY_THRESHOLD = 2000;

const userLastMessage = {};

module.exports.onChat = async function ({ api, event }) {
    try {
        const data = JSON.parse(fs.readFileSync(path));
        if (!data.enabled) return;

        const { threadID, senderID, body } = event;
        if (!body) return;

        // save user's message time
        if (!userLastMessage[senderID]) {
            userLastMessage[senderID] = Date.now();
            return;
        }

        let timeGap = Date.now() - userLastMessage[senderID];

        // SCORE CALCULATION
        let score = 0;

        // 1 ✔ too-fast reply (<=2s)
        if (timeGap <= BOT_REPLY_THRESHOLD) score += 3;

        // 2 ✔ long structured message (bot menu)
        if (body.length > 80) score += 2;

        // 3 ✔ patterns
        for (const p of botPatterns) {
            if (body.toLowerCase().includes(p.toLowerCase())) {
                score += 3;
                break;
            }
        }

        // 4 ✔ banner style
        if (body.includes("━") || body.includes("✦") || body.includes("╭")) {
            score += 2;
        }

        // 5 ✔ heavy emojis
        if ((body.match(/[✨🎀⚠️🌊📘👑]/g) || []).length >= 3) {
            score += 2;
        }

        // bot detected?
        if (score >= 5) {
            api.removeUserFromGroup(senderID, threadID, (err) => {
                if (!err) {
                    api.sendMessage(
                        `⚠️ Bot detected and kicked!\nScore: ${score}`,
                        threadID
                    );
                }
            });
        }

        userLastMessage[senderID] = Date.now();

    } catch (e) {
        console.log("[AntiBot Error]", e);
    }
};