/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = async (message, client = message.client) => {
  let [premiumUser, premiumGuild] = await Promise.all([
    await client.db.premium.get(`${client.user.id}_${message.author.id}`),
    await client.db.premium.get(`${client.user.id}_${message.guild.id}`),
  ]);
  
  if (premiumUser && premiumUser !== true && Date.now() > premiumUser) {
    await client.db.premium.delete(`${client.user.id}_${message.author.id}`);
    await message.author
      .send({
        embeds: [
          new client.embed().desc(
            `**Your premium subscription has ended**\n` +
              `Please visit **[Support Server](${client.support})** or use \`buy\` command to renew`,
          ),
        ],
      })
      .catch(() => {});
    premiumUser = false;
  }

  if (premiumGuild && premiumGuild !== true && Date.now() > premiumGuild) {
    await client.db.premium.delete(`${client.user.id}_${message.guild.id}`);
    let guildOwner = await client.users.fetch(message.guild.ownerId);
    await guildOwner
      .send({
        embeds: [
          new client.embed().desc(
            `**Your premium subscription has ended**\n` +
              `Please visit **[Support Server](${client.support})** or use \`buy\` command to renew`,
          ),
        ],
      })
      .catch(() => {});
    premiumGuild = false;
  }

  return [premiumGuild, premiumUser];
};
