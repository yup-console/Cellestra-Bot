/** @format
 *
 * Cassette By professor.fy2
 * Version: 2.0
 * © 2015 devhub™
 */

module.exports = async (client) => {
  const activities = [
    { name: ".help", type: require("discord.js").ActivityType.Playing },
    { name: ".play <query>", type: require("discord.js").ActivityType.Playing },
  ];

  let index = 0;

  // Function to set activity
  const updateActivity = () => {
    const activity = activities[index];
    client.user.setPresence({
      activities: [activity],
      status: "online", // Options: 'online', 'idle', 'dnd', 'invisible'
    });

    // Move to the next activity or loop back to the start
    index = (index + 1) % activities.length;
  };

  // Initial activity setup
  updateActivity();

  // Rotate activities every 10 seconds (adjust interval as needed)
  setInterval(updateActivity, 10000);

  let mcount = 0;
  let gcount = client.guilds.cache.size;
  client.guilds.cache.forEach((g) => {
    mcount += g.memberCount;
  });

  let eventsSize = {};
  let commandsSize = {};
  commandsSize.slash = {};
  [
    eventsSize.client,
    eventsSize.node,
    eventsSize.player,
    eventsSize.custom,
    commandsSize.message,
  ] = await Promise.all([
    require("@loaders/clientEvents.js")(client),
    require("@loaders/nodeEvents")(client),
    require("@loaders/playerEvents")(client),
    require("@loaders/customEvents.js")(client),
    require("@loaders/commands.js")(client),
  ]);

  // Invite links
  client.invite = {
    required: `https://discord.com/oauth2/authorize?client_id=1317557999015035023`,
    admin: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`,
  };

  // End embed
  client.endEmbed = new client.embed()
    .desc(
      `**Enjoying Music with me?**\n` +
        `If yes, consider [voting me on Top.gg](https://top.gg/bot/1317557999015035023/vote)`,
    )
    .thumb(client.user.displayAvatarURL())
    .setAuthor({
      iconURL: client.user.displayAvatarURL(),
      name: client.user.username,
    })
    .setFooter({ text: "Thanks For Choosing Cellestra" });

  client.log(
    `Loaded ` +
      ` Client: ${eventsSize.client} ` +
      ` Node: ${eventsSize.node} ` +
      ` Player: ${eventsSize.player} ` +
      ` Custom: ${eventsSize.custom} `,
    "event",
  );
  client.log(`Loaded ` + ` Message: ${commandsSize.message} `, "cmd");
  client.log(`Ready for ${gcount} Servers | ${mcount} Users`, "ready");

  // Owner's ID (replace with the actual owner ID)
  const ownerIDs = ["901487880067776524", "1355450594185449472"]; // Replace this with your Discord user ID.


};