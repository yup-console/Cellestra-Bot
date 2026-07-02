/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "playerError",
  run: async (client, player, type, error) => {
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;
    let channel = await client.channels.cache.get(player.textId);
    await channel
      ?.send({
        embeds: [
          new client.embed().desc(
            `**Unknown error occured! Please use \`${client.prefix}report**\`\n` +
              `Join [support](${client.support}) for more information\n` +
              `\`\`\`js\n${type}\n${JSON.stringify(error)}\n\`\`\``,
          ),
        ],
      })
      .catch(() => {});
    await client.webhooks.error
      .send({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [
          new client.embed()
            .desc(
              `**Player Error** in [ ${client.guilds.cache.get(
                player.guildId,
              )} ]\n` + `\`\`\`js\n${type}\n${JSON.stringify(error)}\n\`\`\``,
            )
            .setColor("#fa7f2d"),
        ],
      })
      .catch(() => {});
    await client.sleep(1500);
    try {
      const existingPlayer = await client.getPlayer(player?.guildId);
      if (existingPlayer) {
        await existingPlayer.destroy();
      }
    } catch (error) {
      client.log(`Error destroying player after error: ${error}`, "warn");
    }
  },
};
