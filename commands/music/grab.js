/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "grab",
  aliases: [],
  cooldown: "10",
  category: "music",
  usage: "",
  description: "get song info in DM",
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
    const track = player.queue.current;

    let embed = new client.embed()
      .desc(
        `**[${
          track.title.length > 30
            ? track?.title?.substring(0, 23).replace("[", "").replace("]", "")
            : `${track?.title} ${" ".repeat(
                Math.floor(25 - track?.title.length),
              )}`
        }](https://discord.gg/AZ48HU62vD)**\n` +
          `**Duration : \`${
            track?.isStream ? "◉ LIVE" : client.formatTime(track?.length)
          }\`**\n` +
          `**Author : \`${track?.author.substring(
            0,
            10,
          )}\`** \n\n`,
      )

      .setThumbnail(
        `${
          track.thumbnail
            ? track.thumbnail
            : client.user.displayAvatarURL({ format: "PNG" })
        }`,
      );

    return message.author
      .send({
        embeds: [embed],
        components: [
          new ActionRowBuilder().addComponents(
            new client.button().link(`Link to above song`, `${track.uri}`),
            new client.button().link(`Add Me`, `${client.invite.required}`),
          ),
        ],
      })
      .then(async () => {
        await message.reply({
          embeds: [
            new client.embed().desc(
              `**Sent song info to your DM**`,
            ),
          ],
        });
      })
      .catch(async () => {
        await message
          .reply({
            embeds: [
              new client.embed().desc(`**Could'nt DM you**`),
            ],
          })
          .catch(() => {});
      });
  },
};
