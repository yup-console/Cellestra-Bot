const { inspect } = require(`util`);
const { EmbedBuilder } = require("discord.js");
module.exports = {

    name: "serverlist",
    aliases: [],
    cooldown: "",
    category: "owner",
    usage: "<message>",
    description: "Show Server List",
    args: false, // We need arguments for this command
    vote: false,
    new: false,
    admin: false,
    owner: true,
    botPerms: [],
    userPerms: [],
    player: false,
    queue: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (client, message, args) => {
            try {
                let servers = [];

                client.guilds.cache
                  .sort((a, b) => b.memberCount - a.memberCount)
                  .map((r) => r)
                  .forEach((element) => {
                    servers.push(element);
                  });
        
                let serverslist = [];
                for (let i = 0; i < servers.length; i += 15) {
                  let xservers = servers.slice(i, i + 15);
                  serverslist.push(
                    xservers
                      .map(
                        (r, index) =>
                          `**${i + ++index}** - **${r.name}** | **Members ${
                            r.memberCount
                          }**\nID: \`${r.id}\``
                      )
                      .join(`\n`)
                  );
                }
                let limit = Math.round(servers.length / 15);
                let embeds = [];
                for (let i = 0; i < limit; i++) {
                  let desc = String(serverslist[i]).substr(0, 2048);
                  await embeds.push(
                    new EmbedBuilder()
                      //.setFooter(ee.footertext, ee.footericon)
                      .setColor("00ffbe")
                      .setDescription(desc)
                  );
                }
                return paginationxd(client, message, embeds, 60);
              } catch (e) {
                console.log(String(e.stack).bgRed);
                const emesdf = new EmbedBuilder()
                  .setColor("00ffbe")
                  .setAuthor(`An Error Occurred`)
                  .setDescription(`\`\`\`${e.message}\`\`\``);
                return message.channel.send({ embeds: [emesdf] });
              }
        
            async function paginationxd(client, message, embeds) {
              let currentPage = 0;
              const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
        
              let buttonrow1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle('Primary')
                  .setEmoji(`<:emoji_49:1155863920616144927>`)
                  .setCustomId("first"),
                new ButtonBuilder()
                  .setStyle('Secondary')
                  .setEmoji(`<:emoji_47:1155863808112345229>`)
                  .setCustomId("back"),
                new ButtonBuilder()
                  .setStyle('Success')
                  .setEmoji(`<:emoji_41:1155538469305729055>`)
                  .setCustomId("home"),
        
                new ButtonBuilder()
                  .setStyle('Secondary')
                  .setEmoji(`<:emoji_21:1155507067054985328>`)
                  .setCustomId("next"),
                new ButtonBuilder()
                  .setStyle('Primary')
                  .setEmoji("<:emoji_48:1155863883991486494>")
                  .setCustomId("last")
              );
        
              if (embeds.length === 1)
                return message.channel.send({ embeds: [embeds[0]] });
              const queueEmbed = await message.channel.send({
                content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                components: [buttonrow1],
                embeds: [embeds[currentPage]],
              });
        
              const collector = message.channel.createMessageComponentCollector({
                filter: (interaction) =>
                  (interaction.isButton() || interaction.isSelectMenu()) &&
                  interaction.message.author.id == client.user.id,
              });
        
              collector.on("collect", (interaction) => {
                if (interaction.customId == "next") {
                  if (currentPage < embeds.length - 1) {
                    interaction.reply({ content: `Success`, ephemeral: true });
                    currentPage++;
                    queueEmbed.edit({
                      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                      embeds: [embeds[currentPage]],
                      components: [buttonrow1],
                    });
                  } else {
                    interaction.reply({ content: `Success`, ephemeral: true });
                    currentPage = 0;
                    queueEmbed.edit({
                      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                      embeds: [embeds[currentPage]],
                      components: [buttonrow1],
                    });
                  }
                } else if (interaction.customId == "back") {
                  interaction.reply({ content: `Success`, ephemeral: true });
        
                  if (currentPage !== 0) {
                    --currentPage;
                    to;
                    queueEmbed.edit({
                      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                      embeds: [embeds[currentPage]],
                      components: [buttonrow1],
                    });
                  } else {
                    currentPage = embeds.length - 1;
                    queueEmbed.edit({
                      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                      embeds: [embeds[currentPage]],
                      components: [buttonrow1],
                    });
                  }
                } else if (interaction.customId == "first") {
                  interaction.reply({ content: `Success`, ephemeral: true });
        
                  currentPage = 0;
                  queueEmbed.edit({
                    content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                    embeds: [embeds[currentPage]],
                    components: [buttonrow1],
                  });
                  queueEmbed.edit({
                    content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                    embeds: [embeds[currentPage]],
                    components: [buttonrow1],
                  });
                  queueEmbed.edit({
                    content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                    embeds: [embeds[currentPage]],
                    components: [buttonrow1],
                  });
                } else if (interaction.customId == "last") {
                  interaction.reply({ content: `Success`, ephemeral: true });
        
                  currentPage = embeds.length - 1;
                  queueEmbed.edit({
                    content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                    embeds: [embeds[currentPage]],
                    components: [buttonrow1],
                  });
                } else if (interaction.customId == "home") {
                  interaction.reply({ content: `Success`, ephemeral: true });
                  currentPage = 0;
                  queueEmbed.edit({
                    content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                    embeds: [embeds[currentPage]],
                    components: [buttonrow1],
                  });
                }
              });
        }
    }
}