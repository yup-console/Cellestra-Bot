/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

const genButtons = require("@gen/playerButtons.js");
const { AttachmentBuilder } = require("discord.js");

module.exports = async (data, client, player) => {
  /*
  const title = data.title;
  const author = data.author;
  const thumbnail = data.thumbnail;
  const duration = data.duration;
  const color = data.color;
  const progress = data.progress;
  const source = data.source;
  */

  const title = data.title;
  const author = data.author;
  const duration = data.duration;
  const thumbnail = data.thumbnail;

  const embed = new client.embed()
    .addFields([
      {
        name: `**<:Cellestra:1387684226748514314> Now Playing..**`,
        value:
          `**<a:musiccd:1387093758478258266>. Song :** ${title.substring(0, 20)}...\n` +
          `**<:author:1387726001752117368>. Author :** ${author}\n` +
          `**<:duration1:1387725883678265384>. Duration: **${duration}\n` +
          `**<:requester:1387726145264291932>. Requester: **${player.queue.current.requester}`,
        inline: true,
      },
    ])
    .thumb(thumbnail)
    .img(
      "https://cdn.discordapp.com/attachments/1187965609980461096/1187975162398769152/ueWw08y.png?ex=6736ce16&is=67357c96&hm=ed0623484669f392d440b05b5c7830f8a842ab1b0c48e5f81849c2969b2103ce&",
    );

  return [[embed], [], [genButtons(client, player, 5)[0]]];
};
