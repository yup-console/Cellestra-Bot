/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "voiceStateUpdate",
  run: async (client, oldState, newState) => {
    try {
      let guildId = newState.guild.id;
      
      // Check if bot was disconnected from voice channel
      if (!newState.guild.members.cache.get(client.user.id).voice.channelId) {
        await client.sleep(1500);
        const player = await client.getPlayer(guildId);
        if (player) {
          try {
            await player.destroy();
          } catch (error) {
            client.log(`Error destroying player in voiceStateUpdate: ${error}`, "warn");
          }
        }
      }

      // Handle bot being moved to different channel
      const botMember = newState.guild.members.cache.get(client.user.id);
      if (botMember && botMember.voice.channelId) {
        const player = await client.getPlayer(guildId);
        if (player && player.voiceId !== botMember.voice.channelId) {
          player.voiceId = botMember.voice.channelId;
        }
      }
    } catch (error) {
      client.log(`Error in voiceStateUpdate: ${error}`, "warn");
    }
  },
};
