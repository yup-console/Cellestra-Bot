const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "login",
  aliases: ["spotifylogin", "splogin"],
  category: "spotify",
  description: "Link your Spotify profile to your Discord account.",
  usage: "<Spotify Profile URL>",
  cooldown: 5,

  execute: async (client, message, args) => {
    const clientId = "6c31645ffb004ab8b44d06f7b96d1b66";
    const clientSecret = "3618fdc0b4824cfd91a8d425dac32987";

    const getSpotifyToken = async () => {
      const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

      const res = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${encoded}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return res.data.access_token;
    };

    const input = args[0];
    if (!input || !input.includes("spotify.com/user")) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("<:cross:1376076384493113407> Invalid Spotify URL")
            .setDescription(
              "Please provide a valid Spotify user profile URL.\n\nExample:\n`+login https://open.spotify.com/user/your_id_here`"
            )
            .setColor("#000000"),
        ],
      });
    }

    const match = input.match(/spotify\.com\/user\/([a-zA-Z0-9]+)/);
    if (!match || !match[1]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("<:cross:1376076384493113407> Malformed URL")
            .setDescription("Couldn't extract Spotify ID from the link. Please check the format.")
            .setColor("#000000"),
        ],
      });
    }

    const spotifyId = match[1];
    const dataKey = `spotify_profile_${message.author.id}`;
    const existingData = await client.dab.get(dataKey);

    if (existingData?.spotify_id === spotifyId) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("<:cross:1376076384493113407> Already Linked")
            .setDescription(
              `You're already linked to [${existingData.display_name}](${existingData.profile_url})`
            )
            .setColor("#000000"),
        ],
      });
    }

    let profile;
    try {
      const token = await getSpotifyToken();

      const res = await axios.get(
        `https://api.spotify.com/v1/users/${spotifyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      profile = res.data;
    } catch (err) {
      console.error(err?.response?.data || err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("<:cross:1376076384493113407> Fetch Failed")
            .setDescription("Couldn't fetch Spotify user data. Check your API token or the profile.")
            .setColor("#000000"),
        ],
      });
    }

    const saved = {
      spotify_id: profile.id,
      display_name: profile.display_name || "Unknown",
      followers: profile.followers?.total || 0,
      profile_url: profile.external_urls?.spotify,
      avatar: profile.images?.[0]?.url || null,
      linked_at: Date.now(),
    };

    await client.dab.set(dataKey, saved);

    // Buttons Configuration
    const mainButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("View Profile")
          .setEmoji("🔗")
          .setStyle(ButtonStyle.Link)
          .setURL(saved.profile_url),
          
        new ButtonBuilder()
          .setLabel("Unlink")
          .setEmoji("🔓")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("unlink_spotify")
      );

    const utilityButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Invite")
          .setEmoji("📩")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.com/oauth2/authorize?client_id=1317557999015035023"), // Replace with your invite link

        new ButtonBuilder()
          .setLabel("Vote")
          .setEmoji("🗳️")
          .setStyle(ButtonStyle.Link)
          .setURL("https://top.gg/bot/1317557999015035023/vote"), // Replace with vote link

        new ButtonBuilder()
          .setLabel("Premium")
          .setEmoji("💎")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/AZ48HU62vD") // Premium link added here
      );

    const embed = new EmbedBuilder()
      .setTitle("<a:Spotify:1392551799906636030> Spotify Profile Linked")
      .setDescription("Successfully linked your Spotify account!")
      .addFields(
        { name: "<:icon_author:1392550538943529001> Display Name", value: `\`\`\`${saved.display_name}\`\`\``, inline: true },
        { name: "<:follow:1392699711697326282> Followers", value: `\`\`\`${saved.followers.toLocaleString()}\`\`\``, inline: true }
      )
      .setThumbnail(saved.avatar)
      .setImage("https://files.catbox.moe/4srfxc.jpg")
      .setColor("#000000")
      .setFooter({
        text: `Linked by: ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      });

    const msg = await message.channel.send({ 
      embeds: [embed], 
      components: [mainButtons, utilityButtons] 
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 5 * 60 * 1000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "unlink_spotify") {
        if (i.user.id !== message.author.id) {
          return i.reply({ content: "<:cross:1376076384493113407> You can't unlink someone else's Spotify!", ephemeral: true });
        }

        await client.dab.delete(dataKey);

        const updatedEmbed = new EmbedBuilder()
          .setTitle("<:Tick:1376076194189152398> Spotify Unlinked")
          .setDescription("Your Spotify account has been successfully unlinked!")
          .setColor("#000000");

        return i.update({ embeds: [updatedEmbed], components: [] });
      }
    });

    collector.on("end", async () => {
      await msg.edit({ 
        components: [
          mainButtons.setComponents(mainButtons.components.map(b => b.setDisabled(true))),
          utilityButtons.setComponents(utilityButtons.components.map(b => b.setDisabled(true)))
        ] 
      }).catch(() => {});
    });
  },
};