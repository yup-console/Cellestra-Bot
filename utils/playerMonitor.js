
module.exports = (client) => {
  // Monitor player health every 30 seconds
  setInterval(async () => {
    try {
      const players = client.manager.players;
      
      for (const [guildId, player] of players) {
        try {
          const guild = client.guilds.cache.get(guildId);
          if (!guild) {
            await player.destroy();
            continue;
          }

          const botMember = guild.members.cache.get(client.user.id);
          if (!botMember || !botMember.voice.channelId) {
            await player.destroy();
            continue;
          }

          // Check if voice channel still exists
          const voiceChannel = guild.channels.cache.get(player.voiceId);
          if (!voiceChannel) {
            await player.destroy();
            continue;
          }

          // Check if text channel still exists
          const textChannel = guild.channels.cache.get(player.textId);
          if (!textChannel) {
            await player.destroy();
            continue;
          }

        } catch (error) {
          client.log(`Error monitoring player ${guildId}: ${error}`, "warn");
          try {
            await player.destroy();
          } catch (destroyError) {
            client.log(`Error destroying unhealthy player: ${destroyError}`, "warn");
          }
        }
      }
    } catch (error) {
      client.log(`Error in player monitor: ${error}`, "warn");
    }
  }, 30000);

  client.log("Player monitor started", "ready");
};
