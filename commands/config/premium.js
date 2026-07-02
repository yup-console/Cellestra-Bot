/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

const voucher_codes = require("voucher-code-generator");

module.exports = {
  name: "premium",
  aliases: [],
  cooldown: "10",
  category: "config",
  usage: "",
  description: "Shows your premium status",
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
    let [premiumUser, premiumGuild, owner, admin] = await Promise.all([
      await client.db.premium.get(`${client.user.id}_${message.author.id}`),
      await client.db.premium.get(`${client.user.id}_${message.guild.id}`),
      await client.owners.find((x) => x === message.author.id),
      await client.admins.find((x) => x === message.author.id),
    ]);

    const cmd = args[0] ? args[0].toLowerCase() : null;
    const type = args[1] ? args[1].toLowerCase() : null;

    switch (cmd) {
      case "gen":
        if (!owner && !admin)
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `${emoji.admin} **Only my Owner/s and Admin/s can use this command**`,
              ),
            ],
          });
        let code;
        switch (type) {
          case "guild":
            code = voucher_codes.generate({
              pattern: `CELLESTRA-####-GUILD-DUR${args[2] || 7}`,
            });
            code = code[0].toUpperCase();
            await client.db.vouchers.set(code, true);
            break;
          default:
            code = voucher_codes.generate({
              pattern: `CELLESTRA-#####-USER-DUR${args[2] || 7}`,
            });
            code = code[0].toUpperCase();
            await client.db.vouchers.set(code, true);
            break;
        }
        await message
          .reply({
            embeds: [
              new client.embed().desc(
                `<:free1:1387071102160994315> **Here's your generated code**\n` +
                  `<a:bell1:1386967785539633233> **Usage :** ${client.prefix}redeem your_code\n` +
                  `<a:nitro1:1387019662440796180> ||${code}||\n`,
              ),
            ],
          })
          .catch(() => {});
        break;
      default:
        await message
          .reply({
            embeds: [
              new client.embed()
                .setAuthor({
                  name: `Want my premium ?`,
                  iconURL: client.user.displayAvatarURL(),
                })
                .desc(
                  `ㅤ\n` +
                    `<:coin1:1387016787555520593> **For Freebies :**\n` +
                    `⠀⠀⠀Add me in 5 servers (28d)\n` +
                    `⠀⠀⠀Collect coins and redeem them\n` +
                    `<:Warning1:1386975761952542826> **For Daredevils :**\n` +
                    `⠀⠀⠀Beg ! May get u premium / blacklisted\n` +
                    `\n\n` +
                    `<:Premium:1374675107762409532> **What do you receive ?**\n` +
                    `Completely Ad-free experience in server,\n` +
                    `Badge in profile, Role in support Server,\n` +
                    `No prefix, Vote bypass, Priority in support,\n` +
                    `Volume limit increase, Early access etc. . . `,
                ),
            ],
          })
          .catch(() => {});
        break;
    }
  },
};
