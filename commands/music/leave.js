/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "leave",
  aliases: ["dc"],
  cooldown: "10",
  category: "music",
  usage: "",
  description: "leave voice channel",
  args: false,
  vote: true,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const player = await client.getPlayer(message.guild.id);

    let id = player.voiceId;

    let m = await message
      .reply({
        embeds: [
          new client.embed().desc(`**<:Tick:1376076194189152398> Leaving <#${id}> . . .**`),
        ],
      })
      .catch(() => {});

    await player.destroy();

    await m
      ?.edit({
        embeds: [new client.embed().desc(`**<:Tick:1376076194189152398> Left <#${id}>**`)],
      })
      .catch(() => {});
  },
};
