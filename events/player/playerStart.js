 /** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

 const { RateLimitManager } = require("@sapphire/ratelimits");
 const { VibeSync } = require('vibesync'); // Import VibeSync
 
 module.exports = {
   name: "playerStart",
   run: async (client, player, track) => {
     if (!track?.title) return;
 
     const premium = await client.db.premium.get(
       `${client.user.id}_${player.guildId}`,
     );
     const path =
       (await client.db.preset.get(`${client.user.id}_${player.guildId}`)) ||
       `embeds/embed3.js`;
 
     let requester = track?.requester;
 
     const data = await require(`@presets/${path}`)(
       {
         title:
           track?.title.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, 25) ||
           "Something Good",
         author:
           track?.author.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, 20) ||
           "AK",
         duration: track?.isStream
           ? "◉ LIVE"
           : client.formatTime(player.queue?.current?.length) || "06:09",
         thumbnail:
           track?.thumbnail ||
           client.user.displayAvatarURL().replace("webp", "png"),
         color: client.color || "#FFFFFF",
         progress: Math.floor(Math.random() * 60) + 10 || 70,
         source: track?.sourceName,
         requester: requester,
       },
       client,
       player,
     );
 
     await player.data.set("autoplaySystem", track);
 
     let channel = await client.channels.cache.get(player.textId);
 
     // Send track details
     const msg = await channel
       ?.send({
         embeds: data[0],
         files: data[1],
         components: data[2],
       })
       .catch(() => {});
 
     if (msg) player.data.set("message", msg);
 
     // Initialize VibeSync inside the run function
     const vcStatus = new VibeSync(client); // Initialize VibeSync
 
     // Update the voice channel status using VibeSync
     const channelId = player.voiceId;  // Assuming you have the voice channel ID from the player
     const songTitle = track?.title || "Unknown Song";  
     const status = `<a:emoji_57:1362080666581471362> **Now Playing**: ${songTitle}`;
 
     vcStatus.setVoiceStatus(channelId, status)
       
 
     await client.webhooks.player
       .send({
         username: client.user.username,
         avatarURL: client.user.displayAvatarURL(),
         embeds: [
           new client.embed().desc(
             `**Playing** ${track?.title
               .replace(/[^a-zA-Z0-9\s]/g, "")
               .substring(0, 35)} in [ ${client.guilds.cache.get(
               player.guildId,
             )} ]`,
           ),
         ],
       })
       .catch(() => {});
   },
 }; 