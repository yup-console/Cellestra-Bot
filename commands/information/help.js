const genCommandList = require("@gen/commandList.js");
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

// Emojis
const music_emoji = "<:music1:1387085764625698937>";
const config_emoji = "<:config1:1387085524350800004>";
const giveaway_emoji = "<:gwy1:1387085303293939854>";
const information_emoji = "<:info1:1387085003288215584>";
const spotify_emoji = "<:Spotify1:1387085887917264987>";

const categoryEmojis = {
  music: music_emoji,
  config: config_emoji,
  giveaway: giveaway_emoji,
  information: information_emoji,
  spotify: spotify_emoji,
};

module.exports = {
  name: "help",
  aliases: ["h"],
  cooldown: "10",
  category: "information",
  usage: "",
  description: "Shows bot's help menu",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args) => {
    let categories = await client.categories.filter((c) => c !== "owner" && c !== "extra");
    categories = categories.sort((b, a) => b.length - a.length);

    // Get guild's custom prefix
    const guildPrefix = await client.db.pfx.get(`${client.user.id}_${message.guild.id}`) || client.prefix;

    // Create the initial embed (Home Page)
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username} Help Menu`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setImage(
        "https://files.catbox.moe/miaekk.png"
      )
      .setDescription(
        `## <:uwu_listening_to_music2:1375903820269355190> Cellestra Help Menu
**• Hey <@${message.author.id}>**
**• Jumpstart Your Music Journey.**
**• Prefix of This Server is :  ${guildPrefix}**

<:Modules:1375903434074493018> **__Commands__**
<:music1:1387085764625698937> **: Music**
<:config1:1387085524350800004> **: Config**
<:Spotify1:1387085887917264987> **: Spotify**
<:gwy1:1387085303293939854> **: Giveaway**
<:info1:1387085003288215584> **: Information**
**[Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands) | [Support](https://discord.gg/AZ48HU62vD) | [Website](https://cellestra-web.vercel.app/)**
`
      )
      .setThumbnail(client.user.displayAvatarURL());

    // Create the "All Commands" embed
    let arr = [];
    for (let cat of categories) {
      const cmnds = client.commands.filter((c) => c.category === cat);
      arr.push(cmnds.map((c) => `\`${c.name}\``));
    }

    const allCmds = categories.map(
      (cat, i) =>
        `**[${cat.charAt(0).toUpperCase() + cat.slice(1)}](${
          client.support
        })\n ${arr[i].join(", ")}**`
    );

    const all = new EmbedBuilder()
      .setDescription(allCmds.join("\n\n"))
      .setFooter({ text: "Thanks For Choosing Cellestra" });

    const img = new EmbedBuilder().setImage(
      "https://files.catbox.moe/4jdxsa.png"
    );

    // Create the dropdown menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId("menu")
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder("Select Module From Here")
      .addOptions([
        {
          label: "Home",
          value: "home",
          emoji: "<:home1:1387086008016703581>",
        },
      ]);

    // Add category options to the dropdown
categories.forEach((category) => {
  const emoji = categoryEmojis[category];
  menu.addOptions({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    value: category,
    emoji: emoji && emoji !== "" ? emoji : "<:emoji_1:1194569042040717314>",
  });
});
    // Add "Show all commands" option
    menu.addOptions([
      {
        label: "Show all commands",
        value: "all",
        emoji: "<:all1:1387085091934699582>",
      },
    ]);

    const selectMenu = new ActionRowBuilder().addComponents(menu);

    // Create buttons for Home Page, Invite, and Delete
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("home")
        .setLabel("Home")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:home_8:1362108423315128633>"),
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/oauth2/authorize?client_id=1317557999015035023`)
        .setEmoji("<:invite_9:1362109102871941192>"),
      new ButtonBuilder()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:dlt_7:1362108125762818510>"),
    );

    // Send the initial message with the embed, dropdown, and buttons
    const m = await message.reply({
      embeds: [embed],
      components: [selectMenu, buttons],
    });

    // Filter for interactions
    const filter = async (interaction) => {
      if (interaction.user.id === message.author.id) {
        return true;
      }
      await interaction.reply({
        content: `Only **${message.author.tag}** can use this menu.`,
        ephemeral: true,
      });
      return false;
    };

    // Create a collector for interactions
    const collector = m.createMessageComponentCollector({
      filter,
      time: 60000, // 1 minute
      idle: 30000,
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();

      if (interaction.isStringSelectMenu()) {
        // Handle dropdown menu
        switch (interaction.values[0]) {
          case "home":
            await m.edit({ embeds: [embed] });
            break;
          case "all":
            await m.edit({ embeds: [img, all] });
            break;
          default:
            await m.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(await genCommandList(client, interaction.values[0]))
                  .setTitle(
                    `${interaction.values[0].charAt(0).toUpperCase() + interaction.values[0].slice(1)} - Related Commands`
                  )
                  .setFooter({ text: "Thanks For Choosing Cellestra" }),
              ],
            });
            break;
        }
      } else if (interaction.isButton()) {
        // Handle buttons
        switch (interaction.customId) {
          case "home":
            await m.edit({ embeds: [embed] });
            break;
          case "delete":
            await m.delete().catch(() => {});
            break;
        }
      }
    });

    collector.on("end", async () => {
      // Disable all components
      const disabledMenu = new ActionRowBuilder().addComponents(
        menu.setDisabled(true)
      );

      const disabledButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("home")
          .setLabel("Home")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<:home_8:1362108423315128633>")
          .setDisabled(true),
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/oauth2/authorize?client_id=1317557999015035023`)
          .setEmoji("<:invite_9:1362109102871941192>")
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("delete")
          .setLabel("Delete")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<:dlt_7:1362108125762818510>")
          .setDisabled(true)
      );

      // Edit the message to disable the components
      await m.edit({ components: [disabledMenu, disabledButtons] }).catch(() => {});
    });
  },
};