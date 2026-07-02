/** @format
 *
 * Kyoko By Doubiest
 * Version: 6.0.0-beta
 * © 2024 Nemesis-Dev
 */

const genGraph = require("@gen/pingGraph.js");
const { ActionRowBuilder } = require("discord.js");
const { afk } = require("../../events/custom/afk");

module.exports = {
  name: "afk",
  aliases: ["busy"],
  cooldown: "10",
  category: "information",
  usage: "",
  description: "Afk Commands",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    try{
        const reason = args.join(` `) || `I'm Afk :))`;
        afk.set(message.author.id, [Date.now(), reason]);
        const allowedMentions = {
            parse: ['users'], // Allow user and role mentions
            repliedUser: false, // Mention the user being replied to
          };
        message.reply({
            content:`**<:AFK:1381908553559969844> | ${message.author.tag}**, *Your AFK is now set to:* **${reason}**`,
            allowedMentions: allowedMentions,})
    } catch(e) { console.error(e) }
  },
};