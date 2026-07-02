/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "profile",
  aliases: ["pr"],
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
    let [pfx, premiumUser, dev, admin] = await Promise.all([
      await client.db.pfx.get(`${client.user.id}_${message.author.id}`),
      await client.db.premium.get(`${client.user.id}_${message.author.id}`),
      await client.owners.find((x) => x === message.author.id),
      await client.admins.find((x) => x === message.author.id),
    ]);

const userId = message.author.id;
const guildId = "1339607999609835530";

let member;
try {
const bdgs = await client.guilds.fetch(guildId);
member = await bdgs.members.fetch(userId).catch((e) => {
console.error(`Failed to fetch member: ${e}`);
});
} catch (error) {
console.error(`Failed to fetch guild or member: ${error}`);
return message.reply("Sorry, couldn't fetch user details.");
}
    let badges = []
    let premium =
      premiumUser == true
        ? "Lifetime"
        : premiumUser
          ? `Expiring <t:${`${premiumUser}`?.slice(0, -3)}:R>`
          : `\`Not Activated\``;
if (!member) {

badges.push(`[No badges. Join the support server to get some badges.](https://discord.gg/AZ48HU62vD)`);

} else {      
if (member.roles.cache.has('1339607999844585540')) {

badges.push(`<:Developers:1388065487686209536>: Developer`);

};

if (member.roles.cache.has('1382203247036596244')) {

badges.push(`\n<:crownup:1387856301773815909>: Owner`);

};

if (member.roles.cache.has('1339607999844585537')) {

badges.push(`\n<:manager:1388065813566718024>: Manager`);

};

if (member.roles.cache.has('1339607999844585535')) {

badges.push(`\n<:Admin:1388065905367322645>: Admin`);

};

if (member.roles.cache.has('1339607999844585534')) {

badges.push(`\n<:icons_staff:1387072753315610696>: Moderator`);

};

if (member.roles.cache.has('1339607999777341490')) {

badges.push(`\n<:bughunter2:1374587120685158471>: Bug Hunter`);

};

if (member.roles.cache.has('1339607999777341488')) {

badges.push(`\n<:hoster1:1387305598185504810>: Own Specials`);

};

if (member.roles.cache.has('1339607999609835534')) {

badges.push(`\n<:early_supporter:1374587573267071009>: Supporters`);

};

if (member.roles.cache.has('1339607999777341485')) {

badges.push(`\n<:member:1373928576075825182>: Users`);
}
    }
    await message
      .reply({
        embeds: [
          new client.embed()

            .setAuthor({
              name: `Profile Overview`,
              iconURL: client.user.displayAvatarURL(),
            })
            .desc(
              `<a:badges:1339621451640078369> **__Your Achievement/(s)__ :**\n` +
              `${badges.length ? badges.join('') : 'No Badges.'}` +
                `\n\n<a:dmnd1:1387110874354814976> **__Your Previlege/(s)__ :**\n` +
                `${
                  premiumUser ? `${emoji.premium} Premium Membership\n<:Prefix:1387776860154495148> Global No-Preifx\n\n` : ``
                }` +
                              `<:gvy1:1387302660641787977> **Subscription length: ${premium}**`,
            )

            .thumb(message.member.displayAvatarURL())
            .setFooter({
              text: `Cellestra is Love.`,
            }),
        ],
      })
      .catch(() => {});
  },
};