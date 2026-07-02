/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "config",
  aliases: ["cnf"],
  cooldown: "10",
  category: "config",
  usage: "",
  description: "See server configs",
  args: false,
  vote: true,
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
    let [pfx, premiumGuild, twoFourSeven] = await Promise.all([
      await client.db.pfx.get(`${client.user.id}_${message.guild.id}`),
      await client.db.premium.get(`${client.user.id}_${message.guild.id}`),
      await client.db.twoFourSeven.get(`${client.user.id}_${message.guild.id}`),
    ]);
    let e = new client.embed().desc(
      `**Fetching details please wait . . . **`,
    ); 
    let wait = await message.reply({ embeds: [e] });
    let ew = await wait.edit({ embeds: [e] });
    
                  
    premium =
      premiumGuild == true
        ? "Lifetime"
        : premiumGuild
          ? `Expiring <t:${`${premiumGuild}`?.slice(0, -3)}:R>`
          : `\`Not Activated\``;    
    
    let v = await ew.edit({
        embeds: [
          new client.embed()
            .setAuthor({
              name: `Configuration Overview`,
              iconURL: message.guild.iconURL(),
            })
            .desc(
              `**${emoji.point} Prefix for this server is \`${client.prefix}\`${
                pfx ? ` / \`${pfx}\`` : ``
              }\n` +
              `${emoji.point} Premium Guild :? ${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }\n\n` +
                `Premium features : \n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`No Ads\`\n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`Premium Guild badge\`\n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`Choosable playembed preset\`\n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`Vote-locked commands bypass\`\n\n` +
                `<:Premium:1374675107762409532> Subscription Status : ${premium}**`,
            )

            .setFooter({
              text: `Thanks For Choosing Cellestra.`,
            }),
        ],
      })
      .catch(() => {});
      }
    };    