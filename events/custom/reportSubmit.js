const { ActionRowBuilder, WebhookClient } = require("discord.js");

module.exports = {
  name: "reportSubmit",
  run: async (client, interaction) => {
    const [command, issue, comments] = [
      interaction.fields.getTextInputValue("command"),
      interaction.fields.getTextInputValue("issue"),
      interaction.fields.getTextInputValue("comments"),
    ];

    await interaction.deferUpdate();

    // Create an action row with a button linking to the support server
    const row = new ActionRowBuilder().addComponents(
      new client.button()
        .setLabel("Join support server for more info")
        .setURL(client.support) // Assuming client.support contains the support server URL
        .setEmoji(client.emoji.helpline),
    );

    // Edit the original interaction message to confirm the report submission
    await interaction.message
      .edit({
        embeds: [
          new client.embed().setDescription(
            `${client.emoji.yes} **Successfully reported your issue**`,
          ),
        ],
        components: [row],
      })
      .catch(() => {});

    // Define the webhook client
    const webhookClient = new WebhookClient({
      url: "https://discord.com/api/webhooks/1387649402210091069/lpYG0gBJoVieEGHHC7F2H0kvo9fv5TSaN35VocUu2DIKXsDtv-QO4igdvjxAZaUSwokB", // Store webhook URL in environment variables or config
    });

    // Send the report details to the webhook
    await webhookClient
      .send({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [
          new client.embed()
            .setTitle(`Issue reported for: ${command}`)
            .setDescription(
              `**User:** ${interaction.member} [${interaction.member.id}]\n` +
                `**Guild:** ${interaction.guild.name} [${interaction.guild.id}]\n\n` +
                `**Issue:** \`\`\`\n${issue}\n\`\`\`\n` +
                `**Comments:** \`\`\`\n${comments || `No additional comments`}\n\`\`\`\n`,
            )
            .setColor("#FF0000"),
        ],
      })
      .catch((error) => {
        console.error("Failed to send the report to the webhook:", error);
      });
  },
};