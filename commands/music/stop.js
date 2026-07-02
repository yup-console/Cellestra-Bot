/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "stop",
  aliases: [],
  cooldown: "10",
  category: "music",
  usage: "",
  description: "stop the player",
  args: false,
  vote: true,
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

    player.queue.clear();
    player.data.delete("autoplay");
    player.loop = "none";
    player.playing = false;
    player.paused = false;
    await player.skip();
    await client.sleep(500);

    let emb = new client.embed().desc(
      `${emoji.yes} **Stopped and destroyed the player**`,
    );
    message.reply({ embeds: [emb] }).catch(() => {});
  },
};
