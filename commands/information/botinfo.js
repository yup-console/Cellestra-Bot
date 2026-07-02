const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');
const os = require('os');
const moment = require('moment');

module.exports = {
  name: 'stats',
  description: 'Displays detailed bot statistics',
  aliases: ['botinfo', 'bi'],
  category: 'information',

  execute: async (client, message) => {
    const totalGuilds = client.guilds.cache.size;
    const totalUsers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
    const totalChannels = client.channels.cache.size;
    const voiceChannels = client.channels.cache.filter(c => c.type === 2).size;
    const stageChannels = client.channels.cache.filter(c => c.type === 13).size;

    const formatDuration = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const statsEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Cellestra', iconURL: client.user.displayAvatarURL() })
      .setTitle('Cellestra Statistics')
      .setDescription(
        `Dive into a world of seamless music playback and exciting features with Cellestra!\n` +
        `### <:arrow:1395745042739630170> Bot Info\n` +
        `> Mention: ${client.user}\n` +
        `> Created At: <t:${Math.floor(client.user.createdTimestamp / 1000)}:D>\n` +
        `> Last Reboot: <t:${Math.floor(Date.now() / 1000 - process.uptime())}:R>\n` +
        `> Latency: \`${client.ws.ping}ms\`\n` +
        `> Modules: \`76\`\n` +
        `> Servers: \`${totalGuilds.toLocaleString()}\`\n` +
        `> Users: \`${totalUsers.toLocaleString()}\`\n\n` +
        `### <:arrow:1395745042739630170> Channels\n` +
        `<:channels_n:1395745267063717909> Total Channels: \`${totalChannels.toLocaleString()}\`\n` +
        `<:voice_channel:1395745293185843200> Voice Channels: \`${voiceChannels.toLocaleString()}\`\n` +
        `<:stage_channel:1395745435640922184> Stage Channels: \`${stageChannels.toLocaleString()}\`\n\n` +
        `### <:arrow:1395745042739630170> System\n` +
        `<:cpu:1395746077713502289> CPU Usage: \`${(os.loadavg()[0] * 100).toFixed(2)}%\`\n` +
        `<:memory:1395746148114759690> Memory Usage: \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)}MB\`\n` +
        `<:Platform:1395746217400467456> Platform: \`${os.platform()}\`\n` +
        `<:nodejs:1395746350364233831> Node.js: \`22.17.0\`\n` +
        `<:discordjs:1395746351710474352> discord.js: \`14.21.0\`\n`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    const teamEmbed = new EmbedBuilder()
      .setAuthor({ name: "Cellestra", iconURL: client.user.displayAvatarURL() })
      .setTitle('Cellestra Team Info')
      .setDescription(
        `<:heart4:1395782926343475312> **Our dedicated team works to enhance your Discord experience.**\n\n` +
        `<:dev:1395781603069788262>  **Developer**\n` +
        `・[1]. [! Console🥀..](https://discord.com/users/901487880067776524)\n\n` +
        `<:owner:1395783496328548352>  **Owner**\n` +
        `・[1]. [! 𝒜𝓉𝓁𝒶𝓈 💐](https://discord.com/users/1355450594185449472)`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    const linksEmbed = new EmbedBuilder()
      .setAuthor({ name: "Cellestra", iconURL: client.user.displayAvatarURL() })
      .setTitle('Cellestra Links')
      .setDescription(
        `<:SageServer:1395790692243996743> [**Support Server**](https://discord.gg/AZ48HU62vD)\nFeel free to click on the Support Server link and join our community for any assistance you may need.\n\n` +
        `<:MekoAdd:1395791192251174965> [**Bot Invite**](https://discord.com/api/oauth2/authorize?client_id=1317557999015035023)\nClick on the Bot Invite option to invite the **Cellestra** bot to any of your servers.\n\n` +
        `<:MekoTopgg:1395790747864928298> [**Top.gg**](https://top.gg/bot/1317557999015035023/)\nClick on the Top.gg option and kindly cast your valuable vote for the incredible **Cellestra**.\n\n` +
        `<:MekoManager:1395790983337087086> [**Privacy Policy**](https://cellestra-web.vercel.app/privacy)\nClick on the Privacy Policy option to check **Cellestra** bot privacy policy.\n\n` +
        `<:MekoLeveling:1395790582877519937> [**Terms Of Service**](https://cellestra-web.vercel.app/tos)\nClick on the Terms Of Service option to re-direct to **Cellestra** bot terms of service page.`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('stats')
        .setLabel('System Info')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('team')
        .setLabel('Team Info')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('links')
        .setLabel('Links')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('delete')
        .setEmoji('1395796765646651537')
        .setStyle(ButtonStyle.Danger)
    );

    const msg = await message.channel.send({ embeds: [statsEmbed], components: [row] });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (i) => {
      if (i.user.id !== message.author.id)
        return i.reply({ content: `Only ${message.author.tag} can interact with this message.`, ephemeral: true });

      await i.deferUpdate();
      if (i.customId === 'stats') {
        await msg.edit({ embeds: [statsEmbed], components: [row] });
      } else if (i.customId === 'team') {
        await msg.edit({ embeds: [teamEmbed], components: [row] });
      } else if (i.customId === 'links') {
        await msg.edit({ embeds: [linksEmbed], components: [row] });
      } else if (i.customId === 'delete') {
        await msg.delete().catch(() => {});
      }
    });

    collector.on('end', async () => {
      if (msg.editable) {
        await msg.edit({ components: [] }).catch(() => {});
      }
    });
  }
};
