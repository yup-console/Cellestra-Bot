/** @format
 *
 * Kyoko By Doubiest
 * Version: 6.0.0-beta
 * © 2024 Nemesis-Dev
 */

const genGraph = require("@gen/pingGraph.js");
const { afk } = require("../../events/custom/afk");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const moment = require(`moment`);
require(`moment-duration-format`);
const verificationLevels = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High"
  }
  const booster = {
    0: 'Level: 0',
    1: 'Level: 1',
    2: 'Level: 2',
    3: 'Level: 3'
  }
  const upload = {
    0: '8.00 MB',
    1: '8.00 MB',
    2: '50.00 MB',
    3: '100.00 MB'
  }
  const disabled = '<:cross:1376076384493113407>'
  const enabled = '<:Tick:1376076194189152398>'  


module.exports = {
  name: "serverinfo",
  aliases: ["si"],
  cooldown: "10",
  category: "information",
  usage: "",
  description: "Si Commands",
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
    try{
        const guild = message.guild;
    const { createdTimestamp, ownerId , description} = guild;
    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
    };
          let mfilter = '';
      if(message.guild.explicitContentFilter === 0 ) { mfilter = `${disabled}` }
      if(message.guild.explicitContentFilter === 1 ) { mfilter = 'Members Without Roles' }
      if(message.guild.explicitContentFilter === 2 ) { mfilter = 'All Members' }
      let nsfw = '';
      if(message.guild.nsfwLevel === 0 ) { nsfw = 'Default' }
      if(message.guild.nsfwLevel === 1 ) { nsfw = 'Explicit' }
      if(message.guild.nsfwLevel === 2 ) { nsfw = 'Safe' }
      if(message.guild.nsfwLevel === 3 ) { nsfw = 'Age Restricted' }
      
      let features = '';
      if(message.guild.features.includes('ANIMATED_BANNER')) features += `\n ${enabled} : Antimated Banner`;
      if(message.guild.features.includes('ANTIMATED_ICON')) features += `\n${enabled} : Animated Icon`;
      if(message.guild.features.includes('APPLICATION_COMMAND_PERMISSIONS_V2')) features += `\n${enabled} : Application Commands Permissions V2`;
      if(message.guild.features.includes('BANNER')) features += `\n${enabled} : Banner`;
      if(message.guild.features.includes('AUTO_MODERATION')) features += `\n${enabled} : Auto Moderation`;
      if(message.guild.features.includes('COMMUNITY')) features += `\n${enabled} : Community`;
      if(message.guild.features.includes('DEVELOPER_SUPPORT_SERVER')) features += `\n${enabled} : Developer Support Server`;
      if(message.guild.features.includes('DISCOVERABLE')) features += `\n${enabled} : Discoverable`;
      if(message.guild.features.includes('FEATURABLE')) features += `\n${enabled} : Featurable`;
      if(message.guild.features.includes('INVITES_DISABLED')) features += `\n$${enabled} : Invites Disabled`;
      if(message.guild.features.includes('INVITE_SPLASH')) features += `\n${enabled} : Invite Splash`;
      if(message.guild.features.includes('MEMBER_VERIFICATION_GATE_ENABLED')) features += `\n${enabled} : Member Verification Gate Enabled`;
      if(message.guild.features.includes('MONETIZATION_ENABLED')) features += `\n${enabled} : Monetization Enabled`;
      if(message.guild.features.includes('MORE_STCIKERS')) features += `\n${enabled} : More Stickers`;
      if(message.guild.features.includes('NEWS')) features += `\n${enabled} : News`;
      if(message.guild.features.includes('PARTNERED')) features += `\n${enabled} : Partnered`;
      if(message.guild.features.includes('PREVIEW_ENABLED')) features += `\n${enabled} : Preview Enabled`;
      if(message.guild.features.includes('ROLE_ICONS')) features += `\n${enabled} : Role Icons`;
      if(message.guild.features.includes('TICKETED_EVENTS_ENABLED')) features += `\n${enabled} : Ticketed Events Enabled`;
      if(message.guild.features.includes('VANITY_URL')) features += `\n${enabled} : Vanity URL`;
      if(message.guild.features.includes('VERIFIED')) features += `\n${enabled} : Verified`;
      if(message.guild.features.includes('VIP_REGIONS')) features += `\n${enabled} : Vip Regions`;
      if(message.guild.features.includes('WELCOME_SCREEN_ENABLED')) features += `\n${enabled} : Welcome Screen Enabled`;
      if(features === '') features += `\nNo features`;
    const roles = guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .slice(0, -1)
    let msg = '';
      if(message.guild.defaultMessageNotifications === `ALL_MESSAGES`) { msg = `All Messages` }
      else { msg = `Only mentions` }
    let mfa = "";
      if(message.guild.mfaLevel === `ELEVATED`) mfa = `${enabled}`;
      else { mfa = `${disabled}`}
    let rolesdisplay;
    if (roles.length < 40) {
      rolesdisplay = roles.join(' ')
      if (roles.length < 1) rolesdisplay = "None"
    } else {
      rolesdisplay = `\`Too many roles to show..\``
    }
    if(rolesdisplay.length > 1024)
      rolesdisplay = `${roles.slice(4).join(" ")} \`more..\``
    const members = guild.members.cache
    const channels = guild.channels.cache
    const emojis = guild.emojis.cache
    let emoji1 = `**Regular :** ${emojis.filter(emoji => !emoji.animated).size}/50\n**Animated :** ${emojis.filter(emoji => emoji.animated).size}/50\n**Total :** ${emojis.size}/100`;
    let emoji2 = `**Regular :** ${emojis.filter(emoji => !emoji.animated).size}/50\n**Animated :** ${emojis.filter(emoji => emoji.animated).size}/50\n**Total :** ${emojis.size}/100`;
let emoji3 = `**Regular :** ${emojis.filter(emoji => !emoji.animated).size}/150\n**Animated :** ${emojis.filter(emoji => emoji.animated).size}/150\n**Total :** ${emojis.size}/300`;
let emoji4 = `**Regular :** ${emojis.filter(emoji => !emoji.animated).size}/250\n**Animated :** ${emojis.filter(emoji => emoji.animated).size}/250\n**Total :** ${emojis.size}/500`;

    let emoji = '';
if(guild.premiumTier === 0 ) { emoji = `${emoji1}`
    } 
if(guild.premiumTier === 1 ) { emoji = `${emoji2}`
} 
if(guild.premiumTier === 2 ) { emoji = `${emoji3}`
}
if(guild.premiumTier === 3 ) { emoji = `${emoji4}`
}
let data = guild.bannerURL
    if(!data){
      return 
    }
  let embed = new EmbedBuilder()
  .setColor("#2a2e30")
  .setTitle(`${guild.name}'s Information`)
  .setThumbnail(guild.iconURL({ dynamic: true }))
  let img = new EmbedBuilder()
  .setImage(`https://files.catbox.moe/4jdxsa.png`)
    .setColor('#2a2e30') 
  let select = new SelectMenuBuilder().setCustomId(`ok`).setPlaceholder(`${guild.name} Information `).addOptions([
    {
        label : `About`,
        emoji : `<:emoji_28:1153930150640091146>`,
        value : `ok1`
    },
    {
        label : `Server Information`,
        emoji : `<:emoji_28:1153930150640091146>`,
        value : `ok2`
    },
    {
        label : `Features`,
        emoji : `<:emoji_28:1153930150640091146>`,
        value : `ok3`
    },
    {
        label : `Emoji Info`,
        emoji : `<:emoji_28:1153930150640091146>`,
        value : `ok4`
    },
    {
        label : `Boost Status`,
        emoji : `<:emoji_28:1153930150640091146>`,
        value : `ok5`
    },
    {
        label : `Server Roles`,
        emoji : `<:emoji_28:1153930150640091146>`,
        value : `ok6`
    },
]);
let ro = new ActionRowBuilder().addComponents(select);
let em1 = new EmbedBuilder().setColor('#2a2e30').setImage(guild.bannerURL({size: 4096})).addFields([{name: '__About__',value: `**Name :** ${guild.name} \n**ID :** ${guild.id} \n**Owner <:crownup:1387856301773815909> :** <@!${guild.ownerId}> (${guild.ownerId})\n**Created at :** <t:${parseInt(createdTimestamp / 1000)}:R>\n**Members :** ${message.guild.memberCount}\n**Description :** ${message.guild.description ? message.guild.description : 'No Description set.'}`}])
let em2 = new EmbedBuilder().setColor('#2a2e30').setImage(guild.bannerURL({size: 4096})).addFields([{name: '__Server Information__',value: `**Verification Level :** ${verificationLevels[guild.verificationLevel]}\n**Upload Limit :** ${upload[guild.premiumTier]}\n**NSFW Level :** ${nsfw}\n**Default Notifications :** ${msg}\n**Inactive Timeout : **${guild.afkTimeout/60} mins\n**Inactive Channel : **${guild.afkChannelId ? `<#${guild.afkChannelId}>` : `${disabled}`}\n**System Messages Channel : **${guild.systemChannelId ? `<#${guild.systemChannelId}>` : `${disabled}`}\n**Explicit Media Content Filter :** ${mfilter}\n**Boost Bar Enabled : **${guild.premiumProgressBarEnabled ? enabled : disabled}\n**2FA Requirement :** ${mfa}`}])
let em3 = new EmbedBuilder().setColor('#2a2e30').setImage(guild.bannerURL({size: 4096})).addFields([{name: '__Features__', value: ` ${features}`}])
let em4 = new EmbedBuilder().setColor('#2a2e30').setImage(guild.bannerURL({size: 4096})).addFields([{name: '__Emoji Info__',value: `${emoji}`}])
let em5 = new EmbedBuilder().setColor('#2a2e30').setImage(guild.bannerURL({size: 4096})).addFields([{name: '__Boost Status__',value: `${booster[guild.premiumTier]} [<:boosters:1387856353321685085> ${guild.premiumSubscriptionCount || '0'} Boosts]`}])
let em6 = new EmbedBuilder().setColor('#2a2e30').setImage(guild.bannerURL({size: 4096})).addFields([{name: `__Server Roles__ [${roles.length}]`,value: `${rolesdisplay}`}])


let msg2 = await message.channel.send({embeds : [img,embed],components : [ro]});
let call = await msg2.createMessageComponentCollector({
  filter:(o) =>{
      if(o.user.id === message.author.id) return true;
      else{
          return o.reply({content : `<:cross:1376076384493113407> | This is not your session run ${prefix}stats instead.`,ephemeral : true})
      }
  },
  //time : 50000,
});
call.on('collect',async(int) => {
  if(int.isButton())
  {
      if(int.customId === `m1`)
      {
          return int.update({embeds : [em1]});
      }
      if(int.customId === `m2`)
      {
          return int.update({embeds : [em2]});
      }
      if(int.customId === `m3`)
      {
          return int.update({embeds : [em3]});
      }
      
  }
  if(int.isSelectMenu())
            {
                for(const value of int.values)
                {
                    if(value === `ok1`)
                    {
                        return int.update({embeds : [em1]});
                    }
                    if(value === `ok2`)
                    {
                        return int.update({embeds : [em2]});
                    }
                    if(value === `ok3`)
                    {
                        return int.update({embeds : [em3]});
                    }
                    if(value === `ok4`)
                    {
                        return int.update({embeds : [em4]});
                    }
                    if(value === `ok5`)
                    {
                        return int.update({embeds : [em5]});
                    }
                    if(value === `ok6`)
                    {
                        return int.update({embeds : [em6]});
                    }
                
                }
            }
})
    } catch(e) { console.error(e) }
  },
};