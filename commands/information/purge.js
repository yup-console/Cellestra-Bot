/** @format
 *
 * Trixo By Surya
 * Version: 2.0
 * © 2024 Indians
 */

module.exports = {
  name: "purge",
  aliases: ["c"],
  cooldown: "",
  category: "information",
  usage: "<syntex>",
  description: "Deletes a specified number of messages from the channel.",
  args: true,
  vote: true,
  new: false,
  admin: false,
  owner: false,
  botPerms: ["ManageMessages"],
  userPerms: ["ManageMessages"],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    // Validate the number of messages to delete
    const amount = parseInt(args[0]);

    if (!amount || isNaN(amount) || amount <= 0 || amount > 100) {
      return message.reply("<:cross:1376076384493113407> Please specify a valid number of messages to delete (1-100).");
    }

    try {
      // Bulk delete messages
      const deletedMessages = await message.channel.bulkDelete(amount, true);
      message.channel
        .send(`<:Tick:1376076194189152398> Successfully deleted ${deletedMessages.size} messages.`)
        .then((msg) => setTimeout(() => msg.delete(), 5000)); // Auto-delete the confirmation message
    } catch (error) {
      console.error(error);
      message.reply("<:cross:1376076384493113407> An error occurred while trying to delete messages. Ensure I have the correct permissions.");
    }
  },
};