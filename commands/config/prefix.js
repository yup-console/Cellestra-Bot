
const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "prefix",
  aliases: ["pfx"],
  category: "config",
  usage: "<reset/prefix>",
  description: "Set or reset the bot's prefix.",
  args: true,
  execute: async (client, message, args) => {
    let newPrefix = args[0].toLowerCase() === "reset" ? client.prefix : args[0];

    if (newPrefix.length > 2) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription("You can't set a prefix with more than 2 characters!"),
        ],
      });
    }

    // Check Manage Guild permission
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("FF0000")
            .setDescription("You need **Manage Server** permission to change the guild prefix."),
        ],
      });
    }

    // Update guild prefix in database
    if (args[0].toLowerCase() === "reset") {
      await client.db.pfx.delete(`${client.user.id}_${message.guild.id}`);
      newPrefix = client.prefix; // Set to default prefix for display
    } else {
      await client.db.pfx.set(`${client.user.id}_${message.guild.id}`, newPrefix);
    }

    await message.reply({
      embeds: [
        new client.embed().desc(`**Set guild prefix to \`${newPrefix}\`**`),
      ],
    });
  },
};