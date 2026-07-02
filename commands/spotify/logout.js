const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType
} = require("discord.js");

module.exports = {
  name: "unlinkspotify",
  aliases: ["unlink", "spotifyunlink", "unconnect", "logout"],
  category: "spotify",
  description: "Unlink your Spotify account from the bot.",
  usage: "unlinkspotify [force]",
  cooldown: 5,

  execute: async (client, message, args) => {
    const userId = message.author.id;
    const linkedData = await client.dab.get(`spotify_profile_${userId}`);

    if (!linkedData) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Spotify Account Linked")
            .setDescription("You have not linked any Spotify account yet.")
            .setColor("#2a2b30")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        ]
      });
    }

    const force = args[0]?.toLowerCase() === "force";
    if (force) {
      await unlinkAccount(client, userId);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Spotify Account Unlinked")
            .setDescription("<:Warning1:1386975761952542826>  **You're about to disconnect your Spotify account.**\n\n" +
      "This action will permanently remove all your Spotify data from the bot, including playlists, recent tracks, preferences, and personalized recommendations.\n\n" +
      "Once unlinked, you will no longer be able to access any Spotify features provided by the bot unless you link again.\n\n" +
      "**Are you sure you want to continue?**")
            .setColor("#2a2b30")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setImage("https://files.catbox.moe/4srfxc.jpg")
        ],
        components: [getLinksRow()]
      });
    }

    const confirmRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm_unlink")
        .setLabel("✅ Yes, Unlink")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancel_unlink")
        .setLabel("❌ Cancel")
        .setStyle(ButtonStyle.Secondary)
    );

    const confirmMsg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Unlink Spotify Account")
          .setDescription("Are you sure you want to unlink your Spotify account?\nThis will remove all stored data associated with it.")
          .setColor("#ffcc00")
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      ],
      components: [confirmRow]
    });

    const collector = confirmMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== userId)
        return interaction.reply({ content: "This confirmation is not for you.", ephemeral: true });

      if (interaction.customId === "confirm_unlink") {
        await unlinkAccount(client, userId);
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Spotify Account Unlinked")
              .setDescription("Your Spotify account has been successfully unlinked.")
              .setColor("#1DB954")
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
              .setImage("https://files.catbox.moe/4srfxc.jpg")
          ],
          components: [getLinksRow()]
        });
      }

      if (interaction.customId === "cancel_unlink") {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Cancelled")
              .setDescription("Your Spotify account is still linked.")
              .setColor("#999999")
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          ],
          components: []
        });
      }
    });

    collector.on("end", (collected, reason) => {
      if (!collected.size && confirmMsg.editable) {
        confirmMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle("Timeout")
              .setDescription("No response received. Spotify account unlink cancelled.")
              .setColor("#999999")
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          ],
          components: []
        }).catch(() => {});
      }
    });
  }
};

async function unlinkAccount(client, userId) {
  await client.dab.delete(`spotify_profile_${userId}`);
  await client.dab.delete(`spotify_cache_${userId}`);
  await client.dab.delete(`spotify_music_data_${userId}`);
}

function getLinksRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("📩 Invite")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.com/oauth2/authorize?client_id=1317557999015035023"),
    new ButtonBuilder()
      .setLabel("🗳️ Vote")
      .setStyle(ButtonStyle.Link)
      .setURL("https://top.gg/bot/1317557999015035023/vote"),
    new ButtonBuilder()
      .setLabel("💎 Premium")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/AZ48HU62vD")
  );
}
