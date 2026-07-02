/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = {
  name: "balance",
  aliases: ["bal"],
  cooldown: "10",
  category: "information",
  usage: "",
  description: "Check balance",
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
    let coins = parseInt(
      (await client.db.coins.get(`${message.author.id}`)) || 0,
    );

    const m = await message
      .reply({
        embeds: [
          new client.embed()
            .desc(
              `**<:purse1:1387313819839234199> You have total of ${coins || `0`} coins!** 

` +
`**Want to stack up more coins? Here’s how to do it:**

` +
`**<:coin1:1387016787555520593> For Freebies:**
` +
`⠀⠀• Use commands: *1-3 coins per command*
` +
`⠀⠀• Add me to your server: *150 coins*

` +
`**<:Warning1:1386975761952542826> For Risk-Takers:**
` +
`⠀⠀• Beg! You might strike it rich or get blacklisted. Your call.

`,
            )

            .setFooter({
              text: `This is a virtual currency for in-game use only. Play smart.`,
            }),
        ],
      })
      .catch(() => {});
  },
};
