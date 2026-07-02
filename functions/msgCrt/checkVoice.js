/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = async (message, command, client = message.client) => {
  if (
    (command.inVoiceChannel && !message.member.voice.channelId) ||
    (command.sameVoiceChannel &&
      message.guild.members.me.voice.channel &&
      message.guild.members.me.voice.channelId !==
        message.member.voice.channelId)
  ) {
    await message.reply({
      embeds: [
        new client.embed().desc(
          `**You must be connected to ${
            message.guild.members.me.voice.channel || `a voice channel`
          } in order to use this command**`,
        ),
      ],
    });
    return false;
  }

  if (
    ["play", "join", "radio", "search"].includes(command.name) &&
    (!message.member.voice.channel
      .permissionsFor(message.guild.members.me)
      .has(["Connect", "Speak", "ViewChannel"]) ||
      message.guild.members.me.voice.serverMute)
  ) {
    message
      .reply({
        embeds: [
          new client.embed().desc(
            `**I don't have \`VIEW_CHANNEL\` or \`CONNECT\` or \`SPEAK\` permissions in ${message.member.voice.channel}**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  const player = await client.getPlayer(message.guild.id);

  if (command.player && !player) {
    await message.reply({
      embeds: [
        new client.embed().desc(
          `**I am not connected to any voice channel right now**`,
        ),
      ],
    });
    return false;
  }

  if (command.queue && !player.queue.current) {
    await message.reply({
      embeds: [
        new client.embed().desc(
          `**Nothing is being played right now**`,
        ),
      ],
    });
    return false;
  }

  return true;
};
