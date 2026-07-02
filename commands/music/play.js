const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: "10",
  category: "music",
  usage: "<uri / name / file>",
  description: "Play song via query",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: ["AttachFiles"],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  execute: async (client, message, args, emoji) => {
    const yt =
      /^(?:(?:(?:https?:)?\/\/)?(?:www\.)?)?(?:youtube\.com\/(?:[^\/\s]+\/\S+\/|(?:c|channel|user)\/\S+|embed\/\S+|watch\?(?=.*v=\S+)(?:\S+&)*v=\S+)|(?:youtu\.be\/\S+)|yt:\S+)$/i;

    let [pfx, premiumUser, dev, admin] = await Promise.all([
      await client.db.pfx.get(`${client.user.id}_${message.author.id}`),
      await client.db.premium.get(`${client.user.id}_${message.author.id}`),
      await client.owners.find((x) => x === message.author.id),
      await client.admins.find((x) => x === message.author.id),
    ]);

    const { channel } = message.member.voice;
    const file = await message.attachments;
    const query = [...file]?.[0] ? [...file][0][1].attachment : args.join(" ");

    if (!query) {
      return message.reply({
        embeds: [
          new client.embed().desc(
            `${emoji.bell} **No query! Try a radio: \`${client.prefix}radio\`**`
          ),
        ],
      }).catch(() => {});
    }

    let x = null;

    if (yt.test(query)) {
      x = await message.reply({
        embeds: [
          new client.embed().desc(
            `${emoji.warn} **This provider is against ToS!** \n` +
            `${emoji.bell} Retrieving metadata to play from a different source`
          ),
        ],
      }).catch(() => {});
    }

    const loading = {
      embeds: [
        new client.embed().desc(`${emoji.search} **Searching please wait...**`)
      ],
    };

    x = x
      ? await x.edit(loading).catch(() => {})
      : await message.reply(loading).catch(() => {});

    const player = await client.manager.createPlayer({
      voiceId: channel.id,
      textId: message.channel.id,
      guildId: message.guild.id,
      shardId: message.guild.shardId,
      loadBalancer: true,
      deaf: true,
      volume: 75,
    });

    const result = await player.search(query, {
      requester: message.author,
    });

    if (!result.tracks.length) {
      return x
        ? await x.edit({
            embeds: [
              new client.embed().desc(`${emoji.no} **No results found for query**`)
            ],
          })
        : await message.reply({
            embeds: [
              new client.embed().desc(`${emoji.no} **No results found for query**`)
            ],
          });
    }

    const tracks = result.tracks;

    if (result.type === "PLAYLIST") {
      for (let track of tracks) {
        await player.queue.add(track);
      }
    } else {
      if (tracks[0].length < 10000) {
        return message.reply({
          embeds: [
            new client.embed().desc(
              `${emoji.no} **Songs of duration less than \`30s\` cannot be played!**`
            ),
          ],
        });
      }
      await player.queue.add(tracks[0]);
    }

    const added = result.type === "PLAYLIST"
      ? {
          embeds: [
            new client.embed().desc(
              `${emoji.yes} **Added ${tracks.length} from ${result.playlistName} to queue**`
            ),
          ],
        }
      : {
          embeds: [
            new client.embed().desc(
              `${emoji.yes} **Added to queue [${tracks[0].title.replace("[", "").replace("]", "")}](https://dsc.gg)**` +
              `\n<a:hp1:1387632540193521696> Elite Sound Quality: <:Tick:1376076194189152398>`
            ),
          ],
        };

    if (!player.playing && !player.paused) player.play();

    x
      ? await x.edit(added).catch(() => {})
      : await message.reply(added).catch(() => {});
  },
};
