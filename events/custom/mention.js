const { Collection, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: "mention",
  run: async (client, message, args, emoji) => {

    if (!message || !message.channel) {
      console.error("The 'message' object is undefined or 'message.channel' cannot be accessed.");
      return;
    }

    // Get guild's custom prefix
    const guildPrefix = await client.db.pfx.get(`${client.user.id}_${message.guild.id}`) || client.prefix;

    let msgLatency = Date.now() - message.createdTimestamp;
    let wsLatency = client.ws.ping;

    const images = [
      'https://media.discordapp.net/attachments/1257608241442066492/1273236810448769185/5bf792e6b933b6065358ff378d84eabd.jpg?ex=66bde1af&is=66bc902f&hm=3de815b2f56c3debd689bbe8305f1ae29a9a92c4b6f25e95599f942ee8540499&=&format=webp',
    ];

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setEmoji(`<:ather_addd:1373945171867074581>`)
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/oauth2/authorize?client_id=1317557999015035023'),
      new ButtonBuilder()
        .setLabel("Vote")
        .setEmoji(`<:topgg1:1387101630507389029>`)
        .setStyle(ButtonStyle.Link)
        .setURL('https://top.gg/bot/1317557999015035023/vote'), 
      new ButtonBuilder()
        .setLabel("Support")
        .setEmoji(`<:supp1:1387094161634758696>`)
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/AZ48HU62vD')
    );

    const randomImage = images[Math.floor(Math.random() * images.length)];

    let embed = new EmbedBuilder()
      .setColor('#2a2b30')
      .setDescription(`**<:raze_hi:1387776617622933536> Hey [${message.author.username}](https://discord.com/users/${client.user.id})\n\n<:Prefix:1387776860154495148> Prefix : \`${guildPrefix}\`\n<:msg1:1387092504662245508> Message Latency: \`${msgLatency}\`ms\n<:Latency1:1387777231455125506> WebSocket Latency: \`${wsLatency}\`ms\n<:member:1373928576075825182> Members : \`${message.guild.memberCount}\`\n\nYou can play music by joining a voice channel and typing in: ${guildPrefix}play. Use ${guildPrefix}help to check out my help menu.**`)
      .setImage(randomImage)
      .setAuthor({ 
        name: `${client.user.username}`, 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: "Thanks For Choosing Cellestra <3",
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });


    message.channel.send({ embeds: [embed], components: [row] });
  }
};
