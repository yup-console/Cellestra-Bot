/** @format
 *
 * By Surya
 * Version: v2
 * © Trixo
 */

module.exports = {
  name: "purgecontants",
  aliases: ["pc", "purgecontant"],
  cooldown: 5, // 5-second cooldown
  category: "information",
  usage: "<message>",
  description: "Purges messages containing a specific keyword or phrase.",
  args: true, // This command needs a message argument
  vote: true,
  new: false,
  admin: false,
  owner: false, // Doesn't require bot owner permissions
  botPerms: ["ManageMessages"], // The bot needs "Manage Messages" permission
  userPerms: ["ManageMessages"], // The user needs "Manage Messages" permission
  execute: async (client, message, args, emoji) => {
    try {
      const searchString = args.join(" ").toLowerCase();

      if (!searchString) {
        return message.reply({
          embeds: [
            new client.embed()
              .setDescription(`<:cross:1376076384493113407> **Please provide a keyword or phrase to search for.**`)
              .setColor("00FFFF"),
          ],
        });
      }

      // Fetch messages in the channel (up to 100)
      const messages = await message.channel.messages.fetch({ limit: 100 });

      // Filter messages based on whether they contain the search string (case-insensitive)
      const messagesToDelete = messages.filter(
        (msg) =>
          msg.content.toLowerCase().includes(searchString) && 
          !msg.author.bot && // User messages containing the search string
          msg.id !== message.id // Ensure the command message is not deleted
      );

      // If no messages to delete
      if (messagesToDelete.size === 0) {
        return message.reply({
          embeds: [
            new client.embed()
              .setDescription(`<:cross:1376076384493113407> **No messages containing "${searchString}" were found.**`)
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
            .setDescription(`<:Tick:1376076194189152398> **Successfully Purged messages containing "${searchString}".**`)
            .setColor("00FFFF")
            .setFooter({
              text: `Action performed by: ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error("Error executing the purgecontants command:", error);
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