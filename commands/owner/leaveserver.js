const { inspect } = require(`util`);
const { EmbedBuilder } = require("discord.js");
module.exports = {

    name: "leaveserver",
    aliases: [],
    cooldown: "",
    category: "owner",
    usage: "<message>",
    description: "Show Server List",
    args: true, // We need arguments for this command
    vote: false,
    new: false,
    admin: false,
    owner: true,
    botPerms: [],
    userPerms: [],
    player: false,
    queue: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (client, message, args) => {
            let guild = client.guilds.cache.get(args[0]);
            if (!guild)
                return message.reply({
                    content: "Could not find the Guild to Leave",
                });
            guild
                .leave()
                .then((g) => {
                    message.channel.send({
                        content: `**<:Tick:1376076194189152398> | Successfully Removed ${client.user} From\n<:cyan_dot:1387645942379053057> Guild Name \`:\` ${g.name}\n<:cyan_dot:1387645942379053057> Guild Id \`:\` ${g.id}**`,
                    });
                })
                .catch((e) => {
                    message.reply(`${e.message ? e.message : e}`, {
                        code: "js",
                    });
                });
    }
}