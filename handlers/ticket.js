const { MessageEmbed, Discord } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const enmap = require('enmap');

const settings = new enmap({
  name: "settings",
  autoFetch: true,
  cloneLevel: "deep",
  fetchAll: true
});

module.exports = client => {
  client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        // ticket-setup #channel
        // let channel = "889801760221331496"
        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("Usage: `,ticket-setup #channel`");

        let sent = await channel.send(new MessageEmbed()
            .setAuthor('Ticket', 'https://i.imgur.com/gLC7Bf8.png')
            .setTitle("Phòng bán vé")
            .setDescription("*React để mua vé và tạo phòng.*")
            .setFooter(ee.footertext,ee.footericon)
            .setColor("ff9100")
        );

        sent.react('🎟');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("Phòng chiếu phim đã chuẩn bị xong!")
        //----
    }

    // if(command == "close") {
    //     if(!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
    //     message.channel.delete();
    // }
  });

  client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;
    // CHECK IF USER IN VOICE ROOM
    try {
      reaction.message.guild.members.fetch(user.id).then(async m => {
      let channelId = m.voice.channelID;
      if(!channelId) {
        reaction.users.remove(user);
        return client.channels.cache.get("889801760221331496").send(`❌ ERROR | Vui lòng join 1 **Voice Channel** đầu tiên !`).then(msg=>msg.delete({timeout: 5000}).catch(e=>console.log(e.message)));
      } else {
        if(reaction.message.id == ticketid && reaction.emoji.name == '🎟') {
          reaction.users.remove(user);

          let createdChannel = await reaction.message.guild.channels.create(`🍿〉〉-Phòng phim`, {
              type: 'voice', parent: '889801685021622313'
          })
          reaction.message.guild.members.fetch(user.id).then(m => {
              // console.log(member.voice.channelID);
            let channelID = m.voice.channelID;
            const channel = client.channels.cache.get(`${channelID}`);
            // const usernames = channel.members.filter(m => !m.user.bot).map(m => m.user.id);
            for (const [memberID, member] of channel.members) {
                member.voice.setChannel(createdChannel.id)
                    .then(() => console.log(`Moved ${member.user.tag}`))
                    .catch(console.error);
            }
            // If not in voice room but reaction.
            m.voice.setChannel(createdChannel.id)
                    .then(() => console.log(`Moved ${m.user.tag}`))
                    .catch(console.error);
          })
        }
      }
      })
    }
    catch (e) {
          console.log(String(e.stack).bgRed)
          return message.channel.send(new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`❌ ERROR | An error occurred`)
              .setDescription(`\`\`\`${e.stack}\`\`\``)
          );
      }
    
    
        // .then(async channel => {
        //     channel.send(`<@${user.id}>`, new MessageEmbed().setTitle("Welcome to your ticket!").setDescription("We will be with you shortly").setColor("00ff00"))
        // })
  });

  client.on('voiceStateUpdate', async (oldState) => {
    const { guild } = oldState;
    const channel = guild.channels.cache.get(oldState.channelID);
    if(channel.name === "🍿〉〉-Phòng phim" && channel.members.size  === 0) {
        channel.delete();
        client.channels.cache.get("889801760221331496").send(new MessageEmbed()
            .setColor("6aff00")
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`\`\`\`📍 Cảm ơn đã dùng dịch vụ 🤗\`\`\``)
        ).then(msg=>msg.delete({timeout: 5000}).catch(e=>console.log(e.message)));
    }
  });
}