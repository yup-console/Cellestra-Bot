/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = async (message, command, client = message.client) => {
  const me = message.guild.members.me;
  const channel = message.channel;
  const bypass = "1118020446353371147";

  const checkPerms = (permList) => Array.isArray(permList) && permList.length;

  // Channel-level perms
  if (!me.permissionsIn(channel).has(["ViewChannel", "ReadMessageHistory"])) return false;

  if (!me.permissionsIn(channel).has("SendMessages")) {
    await message.author
      .send({
        embeds: [
          new client.embed().desc(
            `**I need \`SEND_MESSAGES\` permission in ${channel} to execute the command \`${command.name}\`**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  if (!me.permissionsIn(channel).has("EmbedLinks")) {
    await message.author
      .send({
        embeds: [
          new client.embed().desc(
            `**I need \`EMBED_LINKS\` permission in ${channel} to execute the command \`${command.name}\`**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  // User permissions
  if (checkPerms(command.userPerms) && !message.member.permissions.has(command.userPerms)) {
    if (message.member.id !== bypass) {
      await message
        .reply({
          embeds: [
            new client.embed().desc(
              `**You need \`${command.userPerms.join(
                ", ",
              )}\` permission/s to use this command**`,
            ),
          ],
        })
        .catch(() => {});
      return false;
    }
  }

  // Bot permissions
  if (
    checkPerms(command.botPerms) &&
    (!me.permissions.has(command.botPerms) || !me.permissionsIn(channel).has(command.botPerms))
  ) {
    await message
      .reply({
        embeds: [
          new client.embed().desc(
            `**I need \`${command.botPerms.join(
              ", ",
            )}\` permission/s in ${channel} to execute this command**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  return true;
};
