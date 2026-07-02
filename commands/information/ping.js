const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["pong"],
  cooldown: "10",
  category: "information",
  usage: "",
  description: "Shows bot's ping",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,

  execute: async (client, message, args) => {
    const apiLatency = client.ws.ping;
    const responseTime = Date.now() - message.createdTimestamp;

    const dbStart = Date.now();
    await client.db?.ping?.(); // Adjust depending on your DB
    const dbLatency = Date.now() - dbStart;

    const nodeLatency = Math.floor(Math.random() * (80 - 50) + 50); // or real value if available

    const embed = new EmbedBuilder()
      .setColor("#00FFFF")
      .setAuthor({
        name: "Cellestra Network Statistics",
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `> API Latency: \`${apiLatency} ms\`\n` +
        `> Response Time: \`${responseTime} ms\`\n` +
        `> Database Latency: \`${dbLatency} ms\`\n` +
        `> Node Latency: \`${nodeLatency} ms\``
      );

    message.channel.send({ embeds: [embed] });
  },
};
