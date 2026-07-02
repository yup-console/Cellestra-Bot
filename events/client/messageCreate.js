/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

const { RateLimitManager } = require("@sapphire/ratelimits");
const spamRateLimitManager = new RateLimitManager(10000, 7);
const cooldownRateLimitManager = new RateLimitManager(5000);
const { afk } = require("../custom/afk");
const ignoreWarnRateLimitManager = new RateLimitManager(10000);
const coinRateLimitManager = new RateLimitManager(3600000, 15);

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (
      message.author.bot ||
      !message ||
      !message.guild ||
      !message.channel ||
      !message.content
    )
      return;
      const mentionedMember = message.mentions.members.first();
      if (mentionedMember) {
        const data = afk.get(mentionedMember.id);
        if (data) {
          const [timestamp, reason] = data;
          const allowedMentions = {
              parse: ['users'], // Allow user and role mentions
              repliedUser: false, // Mention the user being replied to
            };
          message.reply({
              content: `**${mentionedMember.user.username}** *went afk with a reason : ${reason}*`,
              allowedMentions: allowedMentions,
        });
        }
      }
      const getData = afk.get(message.author.id);
      if (getData) {
        afk.delete(message.author.id);
        message.reply(`**Welcome Back** <@${message.author.id}>, *I've Removed Your Afk*`);
      }

    let [pfxu, pfxg, ignoredChnl, blacklistUser, owner, admin] =
      await Promise.all([
        await client.db.pfx.get(`${client.user.id}_${message.author.id}`),
        await client.db.pfx.get(`${client.user.id}_${message.guild.id}`),
        (await client.db.ignore.get(`${client.user.id}_${message.guild.id}`)) ||
          [],
        await client.db.blacklist.get(`${client.user.id}_${message.author.id}`),
        await client.owners.find((x) => x === message.author.id),
        await client.admins.find((x) => x === message.author.id),
  
      ]);

    if (owner || admin) blacklistUser = false;

    if (blacklistUser == "warned") return;

    let [premiumGuild, premiumUser] = await require(
      `@functions/msgCrt/checkPremium.js`,
    )(message);

    if (message.content.toLowerCase().includes(`jsk`)) {
      client.jsk.run(message);
    }

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
      if (blacklistUser)
        return await client.emit("blUser", message, blacklistUser);
      const mentionRlBucket = spamRateLimitManager.acquire(
        `${message.author.id}`,
      );
      if (mentionRlBucket.limited && !owner && !admin)
        return client.db.blacklist.set(
          `${client.user.id}_${message.author.id}`,
          true,
        );
      try {
        mentionRlBucket.consume();
      } catch (e) {}
      return await client.emit("mention", message);
    }

    let prefix = client.prefix;

    // Build prefixes array with proper priority
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let prefixes = [];
    let allowNoPrefix = false;
    
    // Check if premium user has no prefix enabled (pfxu should be empty string for no prefix)
    if (premiumUser && (pfxu === "" || pfxu === null || pfxu === undefined)) {
      allowNoPrefix = true;
    }
    
    // Build normal prefixes
    if (pfxu && pfxu !== "") {
      prefixes.push(pfxu); // User custom prefix has highest priority
    }
    if (pfxg) {
      prefixes.push(pfxg); // Guild custom prefix has second priority
    }
    // Only add default prefix if no custom guild prefix is set
    if (!pfxg) {
      prefixes.push(client.prefix);
    }
    
    // Check for prefix match or no prefix for premium users
    let matchedPrefix = "";
    let args = [];
    let commandName = "";
    
    if (allowNoPrefix) {
      // For premium users with no prefix, first check if message starts with a command
      const trimmedContent = message.content.trim();
      const possibleCommand = trimmedContent.split(/ +/)[0].toLowerCase();
      const isValidCommand = client.commands.has(possibleCommand) || 
                            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(possibleCommand));
      
      if (isValidCommand) {
        // No prefix needed for premium users
        matchedPrefix = "";
        args = trimmedContent.split(/ +/);
        commandName = args.shift().toLowerCase();
      } else if (prefixes.length > 0) {
        // Fallback to normal prefix checking
        const prefixRegex = new RegExp(
          `^(<@!?${client.user.id}>|${prefixes.map(escapeRegex).join("|")})\\s*`,
          "i",
        );
        if (prefixRegex.test(message.content.toLowerCase())) {
          const matched = message.content.toLowerCase().match(prefixRegex);
          matchedPrefix = matched[0];
          args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
          commandName = args.shift().toLowerCase();
        } else {
          return; // No valid command found
        }
      } else {
        return; // No command found and no prefixes available
      }
    } else {
      // Normal prefix checking for non-premium users
      const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${prefixes.map(escapeRegex).join("|")})\\s*`,
        "i",
      );
      if (!prefixRegex.test(message.content.toLowerCase())) return;
      const matched = message.content.toLowerCase().match(prefixRegex);
      matchedPrefix = matched[0];
      args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      commandName = args.shift().toLowerCase();
    }
    

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );

    if (!command) return;

    if (blacklistUser) {
      return await client.emit("blUser", message, blacklistUser);
    }

    if (ignoredChnl.includes(message.channel.id) && !(admin || owner)) {
      await require(`@functions/msgCrt/ignored.js`)(
        message,
        command,
        ignoreWarnRateLimitManager,
      );
      return;
    }

    if (
      !(await require(`@functions/msgCrt/cooldown.js`)(
        message,
        command,
        spamRateLimitManager,
        cooldownRateLimitManager,
        owner,
        admin,
      ))
    )
      return;

    if (!(await require(`@functions/msgCrt/checkPerms.js`)(message, command)))
      return;

    if (args[0]?.toLowerCase() == "-h")
      return await client.emit("infoRequested", message, command);

    if (command.admin) {
      if (!owner && !admin)
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.admin} **Only my Owner/s and Admin/s can use this command**`,
            ),
          ],
        });
    }

    if (command.owner && !command.admin) {
      if (!owner)
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.king} **Only my Owner/s can use this command**`,
            ),
          ],
        });
    }
    if (command.vote && !(owner || premiumUser || premiumGuild)) {
      if (!(await require(`@functions/msgCrt/checkVote.js`)(message, command)))
        return;
    }

    if (command.args && !args.length) {
      let reply = `${client.emoji.no} **Invalid/No args provided**`;
      if (command.usage)
        reply += `\n${client.emoji.bell} Usage: \`${command.usage}\``;
      return await message.reply({
        embeds: [new client.embed().desc(reply)],
      });
    }

    if (command.srvrowner) {  

        if (message.author.id != message.guild.ownerId && !owner) {
         
        return message.channel.send(`Only the guild owner can use these commands.`).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      }).catch((err) => {});
        }
    }
      if (command.extraowner) {  
        let data = await client.dab.get(`exown_${message.guild.id}`) ? await client.dab.get(`exown_${message.guild.id}`) : []
        if (!data.includes(message.author.id) && message.author.id != message.guild.ownerId && !owner) {
         
        return message.channel.send({embeds: [new client.emb().desc(`${message.author}: These commands are only accessible by the **Guild Owner** or an **Extra Owner**`)]}).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      }).catch((err) => {});
        }
      }      

    if (!(await require(`@functions/msgCrt/checkVoice.js`)(message, command)))
      return;
    const emoji = client.emoji[command.name];
    await command.execute(client, message, args, emoji);

    await require(`@functions/msgCrt/executed.js`)(
      message,
      premiumUser,
      coinRateLimitManager,
    );
  },
};
