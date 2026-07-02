/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

const genButtons = require("@gen/playerButtons.js");
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
  const requester = data.requester;

  const embed = new client.embed()

    .desc(
      `**${
        title.charAt(0).toUpperCase() +
        title.substring(0, 25).slice(1).toLowerCase()
      }**\n\n` +
        `**<:duration1:1387725883678265384>. Duration:** ${duration}\n` +
        `**<:author:1387726001752117368>. Author**: ${
          author.charAt(0).toUpperCase() +
          author.substring(0, 15).slice(1).toLowerCase()
        }\n` +
        `**<:requester:1387726145264291932>. Requester:** ${requester}\n`,
    )
    .thumb(thumbnail)

    .img(

      "https://cdn.discordapp.com/attachments/1187965609980461096/1187975162398769152/ueWw08y.png?ex=6736ce16&is=67357c96&hm=ed0623484669f392d440b05b5c7830f8a842ab1b0c48e5f81849c2969b2103ce&",

    );

  return [[embed], [], [genButtons(client, player, 4)[0]]];
};
