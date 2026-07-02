/** @format
 *
 * Trixo By Surya
 * Version: 2.0
 * © 2024 Indians
 */

const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "voicecontrol",
  aliases: ["vc"],
  cooldown: "60",
  category: "information",
  description: "Control voice actions in a server",
  args: false,
  admin: true,
  botPerms: ["MuteMembers", "DeafenMembers", "MoveMembers"],
  userPerms: ["MuteMembers", "DeafenMembers", "MoveMembers"],
  execute: async (client, message) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("mute_all")
        .setLabel("Mute All")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("unmute_all")
        .setLabel("Unmute All")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("deafen_all")
        .setLabel("Deafen All")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("undeafen_all")
        .setLabel("Undeafen All")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("kick_all")
        .setLabel("Kick All")
        .setStyle(ButtonStyle.Danger)
    );

    let m = await message.reply({
      embeds: [
        new client.embed().desc("<:black_timout:1374781220914728960> **Voice Control Options**"),
      ],
      components: [row],
    });

    const filter = (interaction) =>
      interaction.user.id === message.author.id;

    const collector = m.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply({
          content: "<:cross:1376076384493113407> | **You must be in a voice channel to use this command.**",
          ephemeral: true,
        });
      }

      switch (interaction.customId) {
        case "mute_all":
          voiceChannel.members.forEach((member) => {
            member.voice.setMute(true).catch(() => {});
          });
          await interaction.reply("<:Tick:1376076194189152398> **Muted all users in the voice channel.**");
          break;
        case "unmute_all":
          voiceChannel.members.forEach((member) => {
            member.voice.setMute(false).catch(() => {});
          });
          await interaction.reply("<:Tick:1376076194189152398> **Unmuted all users in the voice channel.**");
          break;
        case "deafen_all":
          voiceChannel.members.forEach((member) => {
            member.voice.setDeaf(true).catch(() => {});
          });
          await interaction.reply("<:Tick:1376076194189152398> **Deafened all users in the voice channel.**");
          break;
        case "undeafen_all":
          voiceChannel.members.forEach((member) => {
            member.voice.setDeaf(false).catch(() => {});
          });
          await interaction.reply("<:Tick:1376076194189152398> **Undeafened all users in the voice channel.**");
          break;
        case "kick_all":
          voiceChannel.members.forEach((member) => {
            member.voice.disconnect().catch(() => {});
          });
          await interaction.reply("<:Tick:1376076194189152398> **Kicked all users from the voice channel.**");
          break;
        default:
          break;
      }
    });

    collector.on("end", async () => {
      await m.edit({
        components: [],
      }).catch(() => {});
    });
  },
};