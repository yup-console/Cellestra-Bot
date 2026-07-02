/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "shuffle",
  aliases: ["sh"],
  cooldown: "10",
  category: "music",
  usage: "",
  description: "shuffle the queue",
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

    let emb = new client.embed().desc(`<:Tick:1376076194189152398> **Shuffled the queue**`);
    await player.queue.shuffle();
    await message
      .reply({ embeds: [emb] })
      .then(async () => {
        await client.commands
          .get("queue")
          .execute(client, message, args, client.emoji.queue);
      })
      .catch(() => {});
  },
};
