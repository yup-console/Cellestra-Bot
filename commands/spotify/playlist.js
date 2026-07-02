const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "spotifyplaylists",
  aliases: ["splists", "splaylists", "playlist"],
  vote: true,
  category: "spotify",
  description: "View and play your public Spotify playlists with a clean advanced interface.",
  cooldown: 10,

  execute: async (client, message) => {
    const userData = await client.dab.get(`spotify_profile_${message.author.id}`);
    if (!userData || !userData.spotify_id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Spotify Not Linked")
            .setDescription(`Please link your Spotify using: \`${client.prefix}login <profile url>\`.`)
            .setColor("#ff5555")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        ]
      });
    }

    const getSpotifyToken = async () => {
      const creds = Buffer.from(`6c31645ffb004ab8b44d06f7b96d1b66:3618fdc0b4824cfd91a8d425dac32987`).toString("base64");
      const res = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
        headers: {
          Authorization: `Basic ${creds}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      return res.data.access_token;
    };

    let playlists = [];
    try {
      const token = await getSpotifyToken();
      const res = await axios.get(`https://api.spotify.com/v1/users/${userData.spotify_id}/playlists?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      playlists = res.data.items.filter(p => p.public || p.collaborative);
      if (!playlists.length) throw "no_playlists";
    } catch {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Playlists Found")
            .setDescription("You don't have any public or collaborative playlists available.")
            .setColor("#ff5555")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        ]
      });
    }

    let index = 0;

    const generateEmbed = (i) => {
      const p = playlists[i];
      return new EmbedBuilder()
        .setAuthor({ name: `${userData.display_name}'s Spotify Playlists`, iconURL: userData.avatar })
        .setTitle(p.name)
        .setURL(p.external_urls.spotify)
        .setThumbnail(p.images?.[0]?.url || null)
        .setImage("https://files.catbox.moe/4srfxc.jpg")
        .setDescription([
          `<:icon_author:1392550538943529001> **Owner:** ${p.owner.display_name}`,
          `<a:Musicz:1392551682961051873> **Tracks:** ${p.tracks.total}`,
          p.description ? `📝 ${p.description}` : ""
        ].join("\n"))
        .setFooter({ text: `Playlist ${i + 1} of ${playlists.length}` })
        .setColor("#1DB954");
    };

    const generateComponents = (i) => {
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("⬅️ Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(i === 0),
        new ButtonBuilder()
          .setCustomId("play")
          .setLabel("▶️ Play")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next ➡️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(i === playlists.length - 1),
        new ButtonBuilder()
          .setLabel("🎧 Open in Spotify")
          .setStyle(ButtonStyle.Link)
          .setURL(playlists[i].external_urls.spotify)
      );

      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("playlist_jump")
          .setPlaceholder("📂 Jump to a playlist")
          .addOptions(
            playlists.slice(0, 25).map((p, idx) => ({
              label: p.name.slice(0, 50),
              value: idx.toString(),
              description: `${p.tracks.total} tracks • ${p.owner.display_name}`.slice(0, 100)
            }))
          )
      );

      const linkButtons = new ActionRowBuilder().addComponents(
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

      return [buttonRow, menu, linkButtons];
    };

    const msg = await message.channel.send({
      embeds: [generateEmbed(index)],
      components: generateComponents(index)
    });

    const collector = msg.createMessageComponentCollector({
      time: 5 * 60_000,
      componentType: ComponentType.Button
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id)
        return interaction.reply({ content: "You are not allowed to use this.", ephemeral: true });

      if (interaction.customId === "prev") {
        index = Math.max(index - 1, 0);
        return interaction.update({
          embeds: [generateEmbed(index)],
          components: generateComponents(index)
        });
      }

      if (interaction.customId === "next") {
        index = Math.min(index + 1, playlists.length - 1);
        return interaction.update({
          embeds: [generateEmbed(index)],
          components: generateComponents(index)
        });
      }

      if (interaction.customId === "play") {
        const playlist = playlists[index];
        const confirmRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("confirm_play")
            .setLabel("✅ Yes, Play This")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("cancel_play")
            .setLabel("❌ Cancel")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
          content: `Are you sure you want to play **"${playlist.name}"**?`,
          components: [confirmRow],
          ephemeral: true
        });

        const confirmInt = await interaction.channel.awaitMessageComponent({
          componentType: ComponentType.Button,
          time: 15000,
          filter: (btn) => btn.user.id === message.author.id
        }).catch(() => null);

        if (!confirmInt)
          return interaction.editReply({ content: "⏱️ Timeout. Cancelled.", components: [] });

        if (confirmInt.customId === "confirm_play") {
          const playUrl = playlist.external_urls.spotify;
          message.content = `${client.prefix}play ${playUrl}`;
          await client.commands.get("play").execute(client, message, [playUrl], client.emoji);
          return confirmInt.update({ content: `🎶 Started playing **"${playlist.name}"**.`, components: [] });
        } else {
          return confirmInt.update({ content: "❌ Cancelled.", components: [] });
        }
      }
    });

    msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 5 * 60_000
    }).on("collect", async (i) => {
      if (i.user.id !== message.author.id) return;
      index = parseInt(i.values[0]);
      return i.update({
        embeds: [generateEmbed(index)],
        components: generateComponents(index)
      });
    });

    collector.on("end", () => msg.edit({ components: [] }).catch(() => {}));
  }
};
