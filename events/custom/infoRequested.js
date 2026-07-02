/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "infoRequested",
  run: async (client, message, command) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Reply with info about cmd requested ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    return message.reply({
      embeds: [
        new client.embed()
          .desc(
            `**Aliases :** ${
              command.aliases?.[0]
                ? `${command.aliases.join(", ")}`
                : "No aliases"
            }\n` +
              `**Usage : [${client.prefix}${command.name} ${command.usage}](${client.support})**\n` +
              `**Description :** ${
                command.description || `No description available`
              }\n\n` +
              `\`\`\`js\n` +
              `<> = required | [] = optional` +
              `\n\`\`\``,
          )
          .title(
            `Command info - ${
              command.name.charAt(0).toUpperCase() + command.name.slice(1)
            }`,
          ),
      ],
    });
  },
};
