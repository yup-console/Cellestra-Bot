/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "vote",
  aliases: [],
  cooldown: "10",
  category: "information",
  usage: "",
  description: "Shows bot's vote link",
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
  execute: async (client, message, args, emoji) => {
    const row = new ActionRowBuilder().addComponents(
      new client.button().link(
        "Click here to vote for me",
        client.vote || client.support,
      ),
    );
    await message.reply({
      embeds: [
        new client.embed().desc(
          `**<:topgg1:1387101630507389029> | [Considering voting me on Top.gg .](https://top.gg/bot/1317557999015035023/vote)**`,
        ),
      ],
      components: [row],
    });
  },
};
