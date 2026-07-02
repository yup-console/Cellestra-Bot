/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = async (client, category) => {
  let commands = await client.commands
    .filter((x) => x.category && x.category === category)
    .map(
      (x) =>
        `**\`${x.name}\`** ${x.new ? `${client.emoji.new}` : ""}${
          x.vote ? `${client.emoji.diamond}` : ""
        }`,
    )
    .join(", ");
  return commands || "**No commands to display**";
};
