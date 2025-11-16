const { createCanvas, loadImage } = require("canvas");
const os = require("os");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "upt3",
    version: "4.0",
    author: "Helal",
    role: 0,
    category: "system",
    shortDescription: "Advanced Neon Status Panel"
  },

  onStart: async function ({ api, event }) {
    try {
      const threadID = event.threadID;

      // -------- SYSTEM INFO ---------
      const uptime = formatTime(process.uptime());
      const total = os.totalmem();
      const free = os.freemem();
      const used = total - free;

      const ram = `${formatBytes(used)} / ${formatBytes(total)}`;
      const cpu = os.cpus()[0].model.slice(0, 25);
      const load = os.loadavg()[0].toFixed(2);
      const platform = "GitHub Server";  // <<< FIXED >>>
      const nodev = process.version;
      const cores = os.cpus().length + " Cores";
      const arch = os.arch().toUpperCase();

      // PING FIX (no blank msg)
      const pingStart = Date.now();
      await new Promise(r => setTimeout(r, 40));
      const ping = Date.now() - pingStart;

      // -------- CANVAS --------
      const width = 1080;
      const height = 720;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // BACKGROUND
      const bg = await loadImage("https://i.imgur.com/rmLtHoY.jpeg");
      ctx.drawImage(bg, 0, 0, width, height);

      // OVERLAY
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, width, height);

      // TITLE
      ctx.font = "55px sans-serif";
      ctx.fillStyle = "#00eaff";
      ctx.shadowColor = "#00eaff";
      ctx.shadowBlur = 25;
      ctx.fillText("HINATA • NEON STATUS PANEL", 170, 85);

      // --- NEON BOX FUNCTION ---
      function neonBox(x, y, w, h, color, label, value) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.strokeRect(x, y, w, h);

        ctx.restore();

        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = color;
        ctx.font = "30px sans-serif";
        ctx.fillText(label, x + 20, y + 48);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "26px sans-serif";
        ctx.fillText(value, x + 20, y + 92);
      }

      // -------- 8 NEON BOXES --------
      neonBox(60, 140, 430, 110, "#00eaff", "Uptime", uptime);
      neonBox(60, 270, 430, 110, "#ff33cc", "RAM Usage", ram);
      neonBox(60, 400, 430, 110, "#ffe066", "CPU", cpu);
      neonBox(60, 530, 430, 110, "#00ff88", "Ping", ping + " ms");

      neonBox(570, 140, 430, 110, "#00c4ff", "Platform", platform);
      neonBox(570, 270, 430, 110, "#ff8a00", "Node Version", nodev);
      neonBox(570, 400, 430, 110, "#ff006e", "CPU Cores", cores);
      neonBox(570, 530, 430, 110, "#38ffb5", "Architecture", arch);

      // SAVE FILE
      const out = path.join(process.cwd(), `neon_panel_${Date.now()}.png`);
      fs.writeFileSync(out, canvas.toBuffer());

      api.sendMessage(
        { attachment: fs.createReadStream(out) },
        threadID,
        () => fs.unlinkSync(out)
      );

    } catch (e) {
      console.log(e);
      api.sendMessage("❌ Error generating panel!", event.threadID);
    }

    // -------- HELPERS --------
    function formatBytes(bytes) {
      const units = ["B", "KB", "MB", "GB"];
      let i = 0;
      while (bytes >= 1024) { bytes /= 1024; i++; }
      return bytes.toFixed(1) + " " + units[i];
    }

    function formatTime(s) {
      s = Math.floor(s);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      return `${h}h ${m}m ${sec}s`;
    }
  }
};