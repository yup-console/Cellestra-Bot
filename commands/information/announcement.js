/** @format
 *
 * Kyoko By Doubiest
 * Version: 6.0.0-beta
 * © 2024 Nemesis-Dev
 */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "announcement",
  aliases: ["notice"],
  cooldown: "10",
  category: "information",
  usage: "",
  description: "Shows Announcement Made By Developers",
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
    const row = new ActionRowBuilder().addComponents(
      new client.button().link("Click to join Support Server", client.support),
    );
    await message.reply({
      embeds: [
        new client.embed()
        .title('Recent Announcement')
        .desc(
          
             
            `**[Modules Added](https://top.gg/bot/1317557999015035023/vote) :**\n` +
            `⠀• Added ignore system <:new1:1387313071042859058><:new2:1387313072645079071>\n` +
            `⠀• Added Auto-Noprefix <:new1:1387313071042859058><:new2:1387313072645079071>\n` +
            `**[Commands Added](https://top.gg/bot/1317557999015035023/vote) :**\n` +
            `⠀• .ignore (re/set ignored channels)\n` +
            `⠀• .similar (add similar songs) <:new1:1387313071042859058><:new2:1387313072645079071>\n` +
            `⠀• .buy (redeem coins for premium) <:new1:1387313071042859058><:new2:1387313072645079071>\n` +
            `⠀• .help (view help menu changes)\n` +
            `**[Bug Reporting](https://top.gg/bot/1317557999015035023/vote) :**\n` +
            `⠀• Report bugs using &report\n\n`,
        ),
      ],
      components: [row],
    });
  },
};
