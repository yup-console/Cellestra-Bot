/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "node",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "",
  description: "Displays Lavalink node statistics",
  args: false,
  vote: false,
  new: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,

  execute: async (client, message, args, emoji) => {
    const nodes = client.manager.shoukaku.nodes;

    if (!nodes?.size) {
      return message.reply({
        embeds: [new client.embed().desc(`No Lavalink nodes are connected.`)],
      });
    }

    const lines = [];

    for (const [name, node] of nodes) {
      if (!node?.stats) continue;

      const stats = node.stats;
      lines.push(
        `**Node:** \`${name}\`\n` +
        `• Uptime: \`${formatDuration(stats.uptime)}\`\n` +
        `• Playing Players: \`${stats.playingPlayers}\`\n` +
        `• Memory: \`${(stats.memory.used / 1024 / 1024).toFixed(2)} MB / ${(stats.memory.allocated / 1024 / 1024).toFixed(2)} MB\`\n` +
        `• CPU Load: \`${(stats.cpu.systemLoad * 100).toFixed(2)}%\`\n` +
        `• Frame Stats: \`${stats.frames?.deficit ?? 0} Deficit | ${stats.frames?.nulled ?? 0} Null\`\n`
      );
    }

    const embed = new client.embed()
      .setAuthor({ name: "Lavalink Node Statistics", iconURL: client.user.displayAvatarURL() })
      .setColor("#2a2e30")
      .setDescription(lines.join("\n"));

    message.reply({ embeds: [embed] });
  },
};

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}
