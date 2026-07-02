/** @format
 *
 * Trixo By Surya 
 * Version: 2.0
 * © 2024 Indians
 */

module.exports = {
  name: "purgebots",
  aliases: ["pb"],
  cooldown: 2, // 5-second cooldown
  category: "information",
  usage: "No arguments needed",
  description: "Purges bot messages and the user's command messages.",
  args: false,
  vote: true,
  new: false,
  admin: false,
  owner: false, // Doesn't require bot owner permissions
  botPerms: ["ManageMessages"], // The bot needs "Manage Messages" permission
  userPerms: ["ManageMessages"], // The user needs "Manage Messages" permission
  execute: async (client, message, args, emoji) => {
    try {
      // Fetch messages in the current channel (up to 100 messages)
      const messages = await message.channel.messages.fetch({ limit: 100 });

      // Filter messages to delete bot messages and the user's specific commands
      const messagesToDelete = messages.filter((msg) => {
        const isBotMessage = msg.author.bot; // Check if the message is from a bot
        const isUserCommand =
          msg.author.id === message.author.id &&
          (msg.content === `${client.prefix}pb` || 
           msg.content === `${client.prefix}purgebot` || 
           msg.content === `${client.prefix}purgebots`); // Match user command messages
        return isBotMessage || isUserCommand;
      });

      // Ensure the command message itself is included in the deletion
      messagesToDelete.set(message.id, message);

      // If there are no messages to delete
      if (messagesToDelete.size === 0) {
        return message.reply({
          embeds: [
            new client.embed()
              .setDescription(`<:cross:1376076384493113407> **No bot or specific user command messages to purge.**`)
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
            .setDescription(`<:Tick:1376076194189152398> **Successfully purged bot messages.**`)
            .setColor("00FFFF")
            .setFooter({
              text: `Executor : ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      }).then((msg) => {
        setTimeout(() => msg.delete(), 5000); // Auto-delete confirmation message after 5 seconds
      });
    } catch (error) {
      console.error("Error executing the purgebots command:", error);
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