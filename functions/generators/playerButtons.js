const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = (client, player, number = 5) => {
  const isPaused = player.shoukaku.paused; // Check if the player is paused
  const autoplayEnabled = player.data.get("autoplay"); // Check autoplay status

  const row = new ActionRowBuilder();

  // Define the buttons
  const buttons = [
    new ButtonBuilder()
      .setCustomId(`${player.guildId}previous`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:emoji_52:1162226869605765131>"), // Custom emoji for previous

    new ButtonBuilder()
      .setCustomId(`${player.guildId}play_pause`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(isPaused ? "<:emoji_54:1164150904577073244>" : "<:emoji_42:1154560121129676830>"), 
    // Dynamically switch between play and pause emojis

    new ButtonBuilder()
      .setCustomId(`${player.guildId}skip`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:emoji_46:1154560368409071616>"), // Custom emoji for skip

    new ButtonBuilder()
      .setCustomId(`${player.guildId}autoplay`)
      .setStyle(autoplayEnabled ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setEmoji("<:emoji_44:1154560244513505360>"), // Custom emoji for autoplay

    new ButtonBuilder()
      .setCustomId(`${player.guildId}stop`)
      .setStyle(ButtonStyle.Danger)
      .setEmoji("<:emoji_45:1154560301904187453>"), // Custom emoji for stop
  ];

  // Add buttons dynamically based on the `number` parameter
  switch (number) {
    case 5:
      row.addComponents(buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]);
      break;
    case 4:
      row.addComponents(buttons[0], buttons[1], buttons[2], buttons[4]);
      break;
    case 3:
      row.addComponents(buttons[1], buttons[2], buttons[4]);
      break;
    default:
      throw new Error("Invalid number of buttons requested!");
  }

  // Return the action row containing the buttons
  return [row];
};