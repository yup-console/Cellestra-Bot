/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "guildCreate",
  run: async (client, guild) => {
    if (!guild.name) return;

    const { ActionRowBuilder } = require("discord.js");

    // Thank you DM to server owner
    let desc =
      `\`${client.user.username}\` has been successfully added to \`${guild.name}\`\n\n` +
      `You can report any issues at my **[Support Server](${client.support})** following the needed steps. ` +
      `You can also reach out to my **[Developers](${client.support})** if you want to know more about me.`;

    let e = new client.embed()
      .title(`Thank you for choosing ${client.user.username}!`)
      .desc(desc);

    try {
      let owner = await client.users.fetch(guild.ownerId);
      await owner.send({
        embeds: [e],
        components: [
          new ActionRowBuilder().addComponents(
            new client.button().link(`Support Server`, `${client.support}`),
            new client.button().link(`Get Premium`, `${client.support}`),
          ),
        ],
      }).catch(() => {});
    } catch (e) {}

    // Always generate a new invite link
    let inviteLink = "Invite creation failed.";
    try {
      const targetChannel = guild.systemChannel || guild.channels.cache.find(c =>
        c.isTextBased?.() && c.permissionsFor(guild.members.me).has("CreateInstantInvite")
      );

      if (targetChannel) {
        const invite = await targetChannel.createInvite({
          maxAge: 0,
          maxUses: 0,
          unique: true,
          reason: `Bot joined: ${client.user.username}`,
        });

        inviteLink = `[Click to Join](${invite.url})`;
      }
    } catch (err) {
      console.error("Failed to create invite:", err);
    }

    // Webhook Log
    await client.webhooks.server.send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [
        new client.embed()
          .title("New Guild Joined")
          .desc(
            `**Guild Name:** ${guild.name}\n` +
            `**Guild ID:** ${guild.id}\n` +
            `**Members:** ${guild.memberCount}\n` +
            `**Invite:** ${inviteLink}`
          )
          .setColor("#7ffa2d"),
      ],
    }).catch(() => {});
  },
};
