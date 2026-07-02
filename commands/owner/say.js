module.exports = {

    name: "say",
    aliases: [],
    cooldown: "",
    category: "owner",
    usage: "<message>",
    description: "Repeats what the user says",
    args: true, // We need arguments for this command
    vote: false,
    new: false,
    admin: true,
    owner: true,
    botPerms: [],
    userPerms: [],
    player: false,
    queue: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (client, message, args) => {

        if (!args.length) {

            return message.reply("You need to provide a message for me to repeat!");

        }

        

        const sayMessage = args.join(" ");

        
        await message.delete()
        await message.channel.send(sayMessage).catch(() => {});

    },

};