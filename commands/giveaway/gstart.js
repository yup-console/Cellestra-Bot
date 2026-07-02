/** @format */

const ms = require('ms');
const { EmbedBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
  name: 'gstart',
  aliases: ['startgw'],
 category: 'giveaway',
  description: 'Start a giveaway',
  args: false,
  vote: true,
  usage: '<duration> <winners> <prize>',
  userPerms: ['ManageGuild'],
  botPerms: [],
  owner: false,

  execute: async (client, message, args, prefix) => {

    


    if (!args[0] || !args[1] || !args[2]) {
      return message.channel.send({ embeds: [new client.emb().desc(`**gstart <time> <winners> <prize>**`)] })
    }

    let time = args[0];
    
    let duration = ms(time);
    let winners = parseInt(args[1]);
    let prize = String(args.slice(2).join(" "));

    if (prize.length > 200) {
      return message.channel.send({embeds: [new client.emb().desc(`${message.author}: Prize lenght cannot be greater than 200 characters`)]})
    }

    if (winners > 10) {
      return message.channel.send({embeds: [new client.emb().desc(`${message.author}: Winner count must not be greater than 10`)]})
    }

    if (duration > 3456000000) {
      return message.channel.send({embeds: [new client.emb().desc(`${message.author}: Giveaway duration must not be longer than 40 days`)]})
    }

        

    message.delete()

    const response = await start(message.member, message.channel, duration, prize, winners, message.member);
    message.channel.send(response).then((msg) => {
      setTimeout(() => msg.delete(), 1000);
    }).catch((err) => { });

  }
}

async function start(member, giveawayChannel, duration, prize, winners, host) {

  

  try {
    let time = `${Math.round((Date.now() + duration) / 1000)}`
    await member.client.giveawaysManager.start(giveawayChannel, {
      duration: duration,
      prize,
      winnerCount: winners,
      hostedBy: member,
      messages: {
        giveaway: `<:gvy1:1387302660641787977> **Giveaway** <:gvy1:1387302660641787977>`,
        title: '{this.prize}',
        drawing: '',
        winMessage: { 
content: '{winners}',
embed: new member.client.emb().desc('You won **{this.prize}**! Kindly contact the giveaway host {this.hostedBy} to claim your reward.').setFooter({text: 'Giveaway Ended'}),
components: [new ActionRowBuilder().addComponents([new member.client.button().link(`Giveaway`, 'https://discord.com/channels/{this.guildId}/{this.channelId}/{this.messageId}')])],
replyToGiveaway: true
},
        noWinner: `Giveaway cancelled, no valid participations.`,
        giveawayEnded: `**Ended**`,
        inviteToParticipate: `\n<a:Timer1:1387305300868202606> Ends: <t:${time}:R> (<t:${time}:f>)\n<:hoster1:1387305598185504810> Hosted by: ${host}\n\n<:white_arrow:1381892299780390954> [Invite me](https://discord.com/oauth2/authorize?client_id=1317557999015035023)`,
        winners: `Winner(s):`,
        hostedBy: '',
        endedAt: 'Cellestra',
        embedFooter: '{this.winnerCount} winner | Cellestra',
      }
    }).catch(( e ) => { console.log(e) })

    return { embeds: [new EmbedBuilder().setColor(giveawayChannel.client.color).setDescription(`${member}: Giveaway started in ${giveawayChannel}`)] };
  } catch (error) {
    console.log(error)
  }
};