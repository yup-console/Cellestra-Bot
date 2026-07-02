module.exports = {
  name: "volume",
  aliases: ["v", "vol"],
  cooldown: "10",
  category: "music",
  usage: "[ 1 - 500 ]",
  description: "set player volume",
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

    if (!args.length) {
      let emb = new client.embed().desc(
        `${emoji.bell} **Current player volume: \`[ ${
          player.volume
        }% ]\`**`,
      );
      return message.reply({ embeds: [emb] }).catch(() => {});
    }

    let volume = Number(args[0]);
    volume = volume < 0 || volume > 500 ? NaN : volume;

    if (!volume) {
      return await message
        .reply({
          embeds: [
            new client.embed().desc(
              `${emoji.no} **Volume must be greater than 0 and less than 500**`,
            ),
          ],
        })
        .catch(() => {});
    }
    await player.setVolume(volume);
    await client.sleep(500);
    return await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.yes} **Volume set to: \`[ ${volume}% ]\`**`,
          ),
        ],
      })
      .catch(() => {});
  },
};
