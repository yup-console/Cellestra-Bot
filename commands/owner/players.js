/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "players",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "",
  description: "Shows all servers where the bot is currently playing music",
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
    const players = [...client.manager.players.values()].filter(p => p.playing);

    if (players.length === 0) {
      return message.reply({
        embeds: [
          new client.embed().desc(`**No music is currently playing in any server.**`)
        ],
      });
    }

    const list = [];

    for (const player of players) {
      const guild = client.guilds.cache.get(player.guildId);
      if (!guild) continue;

      list.push(`• \`${guild.name.substring(0, 30)}\` — \`${guild.memberCount}\` members`);
    }

    const embed = new client.embed()
      .setAuthor({
        name: `Currently Playing Servers (${list.length})`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor("#2a2e30")
      .setDescription(list.join("\n"));

    message.reply({ embeds: [embed] });
  },
};
