/** @format
 *
 * By Surya
 * Version: v2
 * © Trixo
 */

module.exports = {
  name: "purgeuser",
  aliases: ["pu"],
  cooldown: 5, // 5-second cooldown
  category: "information",
  usage: "<@user>",
  description: "Purges messages from a mentioned user, as well as the user's own command message.",
  args: true, // This command needs a user argument
  vote: true,
  new: false,
  admin: false,
  owner: false, // Doesn't require bot owner permissions
  botPerms: ["ManageMessages"], // The bot needs "Manage Messages" permission
  userPerms: ["ManageMessages"], // The user needs "Manage Messages" permission
  execute: async (client, message, args, emoji) => {
    try {
      // Get the mentioned user or resolve a user by ID
      const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

      if (!target) {
        return message.reply({
          embeds: [
            new client.embed()
              .setDescription(`<:cross:1376076384493113407> **Please mention a valid user to purge their messages.**`)
              .setColor("00FFFF"),
          ],
        });
      }

      // Fetch the last 100 messages in the channel
      const messages = await message.channel.messages.fetch({ limit: 100 });

      // Filter messages to delete those sent by the mentioned user or the command message itself
      const messagesToDelete = messages.filter(
        (msg) => msg.author.id === target.id || msg.author.id === message.author.id
      );

      // If there are no messages to delete
      if (messagesToDelete.size === 0) {
        return message.reply({
          embeds: [
            new client.embed()
              .setDescription(`<:cross:1376076384493113407> **No messages from this user to purge or this user hasn't sent any recent messages.**`)
              .setColor("00FFFF"),
          ],
        });
      }

      // Delete the selected messages
      await message.channel.bulkDelete(messagesToDelete, true);

      // Send confirmation message in the chat
      await message.channel.send({
        embeds: [
          new client.embed()
            .setDescription(`<:Tick:1376076194189152398> **Successfully Purged messages from ${target.user.tag} and your command message.**`)
            .setColor("00FFFF")
            .setFooter({
              text: `Action performed by: ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error("Error executing the purgeuser command:", error);
      await message.reply({
        embeds: [
          new client.embed()
            .setDescription(`<:cross:1376076384493113407> **An error occurred while executing this command. Please try again later.**`)
            .setColor("00FFFF"),
        ],
      });
    }
  },
};