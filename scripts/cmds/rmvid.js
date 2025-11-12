module.exports = {
  config: {
    name: "rmvid",
    aliases: ["romanticvid", "rvid"],
    version: "2.0",
    author: "nexo_here",
    countDown: 30,
    role: 2,
    shortDescription: "Send romantic video",
    longDescription: "Send a random romantic video from Google Drive",
    category: "Romantic",
    guide: "{p}{n}",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    // Sending loading message
    const loadingMessage = await message.reply({
      body: "💞 Sending romantic video, please wait...",
    });

    // Video links list
    const link = [
      "https://drive.google.com/uc?export=download&id=1hvTD8MFBF9JmaXprwdkdgBWcCrKBw33X",
      "https://drive.google.com/uc?export=download&id=15lcnzh2rz73kOGn2ZnW2pFM6kH28mVNZ",
      "https://drive.google.com/uc?export=download&id=15fcjVNM5jnxPXff6XvrYZc66GaW2P43j",
      "https://drive.google.com/uc?export=download&id=13vMkwhKHgvFM7zWspQ6KFs7tFuz3MdQ6",
      "https://drive.google.com/uc?export=download&id=1UUkIESzxvGoct8K-4zmpaYeWWaEFdMd2",
      "https://drive.google.com/uc?export=download&id=1P0PpgyfuZlc5bj6LCnlLVJK2p2gDkHVr",
      "https://drive.google.com/uc?export=download&id=17hnqwy4_hsj-Lg7TwWeSIVkkYb4JbRup",
      "https://drive.google.com/uc?export=download&id=17EW5Et_C35A-b5EutkYOqcBuve6osyF2",
      "https://drive.google.com/uc?export=download&id=1DyoppQNPKXcyv4yz3ZG-AFzKTiEqVMXz",
      "https://drive.google.com/uc?export=download&id=1HujCGPoMZD11wqT6lPYSC2Fznl1b6OeD",
      "https://drive.google.com/uc?export=download&id=1CULeYDLbZajqXjWLMfkhWi8MPQMh9wyi",
      "https://drive.google.com/uc?export=download&id=1JedAs7BVvUqMa_ZcI3AAuTaciNgYsTrG",
      "https://drive.google.com/uc?export=download&id=1ugwLgEBIYj0DWTUMpwtVxNqySRaPj7NT",
      "https://drive.google.com/uc?export=download&id=1TdKAK1gehOa1UTT8JozNd2g2kym-h7El",
      "https://drive.google.com/uc?export=download&id=17Ghhp_xHqRGXEwjMviy3joEYmxgunZcB",
      "https://drive.google.com/uc?export=download&id=1XBQBhQmUMRqx_utDmMKp4k3daFpxLi3C",
      "https://drive.google.com/uc?export=download&id=1zak72EAP-QO1y5IIuSKSYWMJi-Z_buoK",
      "https://drive.google.com/uc?export=download&id=1NUnvgLwIUav9Egxaqrz72-k5viiPUIBN",
      "https://drive.google.com/uc?export=download&id=1L570XK6_QZ5tagduZYDMRjxfJ0r9L1ue",
      "https://drive.google.com/uc?export=download&id=1llmaq_UyZbf09kqJ8UGiOnYDB2Kuawl2",
      "https://drive.google.com/uc?export=download&id=14ux5VvbpPN3CC1tKQOmaEc80VZRetZRD",
      "https://drive.google.com/uc?export=download&id=1q59j5uIchFFtM5_s97yk7HkU3k4QFj1h",
      "https://drive.google.com/uc?export=download&id=1tRL569gUKeGNcNEqZKRlQfi_08048NlR",
      "https://drive.google.com/uc?export=download&id=1y0InuktprxFvLQhOlF2LDyJYyMy87xv9",
      "https://drive.google.com/uc?export=download&id=1Putxt3_SIEOv5ungrbFaZ54Q51wq4wMH",
      "https://drive.google.com/uc?export=download&id=1LtXjHCnEjleNC8CBMdf9BrUuy96gZZZS",
      "https://drive.google.com/uc?export=download&id=1YlB4d92Px8_bE-vO3Z6cKax-EzRCjv9A",
      "https://drive.google.com/uc?export=download&id=1wwE1NDubUUbHPtDt5AewOd61B3rbOgBe",
      "https://drive.google.com/uc?export=download&id=1e3nXpxgGGWPDNrfLvGXr5ZGhGp_9tNzu",
      "https://drive.google.com/uc?export=download&id=1uaYlzq2MQHNYXlFUlGiwUNmXg-JZW6S1",
      "https://drive.google.com/uc?export=download&id=1ph4znKxjyCKVT28ntl1CgawWPUcMC7Nw",
      "https://drive.google.com/uc?export=download&id=12w3ZVklWiWrXhA1zIk7OU2c3fpG7OTOr",
      "https://drive.google.com/uc?export=download&id=1y_Dnsll-kEmm_c-l3MIZDPvhb-Hy2APS"
    ];

    // Avoid repetition
    const availableVideos = link.filter(video => !this.sentVideos.includes(video));
    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];
    this.sentVideos.push(randomVideo);

    // Send the selected video
    if (senderID) {
      await message.reply({
        body: "❤️ Here’s your romantic video 💕",
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      // Delete the "loading" message after 5 sec
      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);
    }
  },
};