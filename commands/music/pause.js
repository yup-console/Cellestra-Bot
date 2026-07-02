/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "pause",
  aliases: [],
  cooldown: "10",
  category: "music",
  usage: "",
  description: "pause the player",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const player = await client.getPlayer(message.guild.id);

    if (player.shoukaku.paused) {
      let emb = new client.embed().desc(
        `${emoji.no} **The player is already paused**`,
      );
      return message.reply({ embeds: [emb] }).catch(() => {});
    }

    await player.pause(true);
    await updateEmbed(client, player);
    let emb = new client.embed().desc(`<:Tick:1376076194189152398> **Successfully Paused the player**`);
    return message.reply({ embeds: [emb] }).catch(() => {});
  },
};
