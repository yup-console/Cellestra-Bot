const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = async (message, command, client = message.client) => {
  if (!client.vote || !client.topGgAuth) return false;

  let voted = false;

  try {
    const res = await fetch(
      `https://top.gg/api/bots/${client.user.id}/check?userId=${message.author.id}`,
      {
        method: "GET",
        headers: { Authorization: client.topGgAuth },
      }
    );
    const json = await res.json();
    voted = json?.voted > 0;
  } catch (err) {
    client.log(`Error checking vote status: ${err}`);
  }

  if (!voted) {
    const embed = new EmbedBuilder()
      .setDescription(`**<:Premium:1374675107762409532> This Command is For Premium Users Only Because it Uses More CPU Than Other Commands.**\n` +
            `<:gvy1:1387302660641787977> You Can Purchase Premium on [Support Server](https://discord.gg/AZ48HU62vD) or You Can [Vote Me](https://top.gg/bot/1317557999015035023/vote) To Use This Command.?`);

    const voteButton = new ButtonBuilder()
      .setLabel('Vote')
      .setStyle(ButtonStyle.Link)
      .setURL('https://top.gg/bot/1317557999015035023/vote');

    const supportButton = new ButtonBuilder()
      .setLabel('Support')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/AZ48HU62vD');

    const premiumButton = new ButtonBuilder()
      .setLabel('Premium')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/AZ48HU62vD');

    const row = new ActionRowBuilder()
      .addComponents(voteButton, supportButton, premiumButton);

    await message.reply({ embeds: [embed], components: [row] });
    return false;
  }

  return true;
};
