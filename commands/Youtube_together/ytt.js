const { Discord, MessageEmbed } = require("discord.js")
// const fetch = require("node-fetch");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
// const client = new Discord.Client()

module.exports = {
    name: "ytt",
    category: "Youtube",
    aliases: ["ytt"],
    cooldown: 2,
    useage: "ytt",
    description: "Watching youtube together",
    run: async (client, message, args, cmduser, text, prefix) => {
    try {
      client.on("message", async (message) => {
        if (!message.guild || message.author.bot || !message.content.trim().startsWith(config.prefix)) return;
        // "!ytt asda" --> "ytt asda" --> ["ytt", "asda"]
        var args = message.content.slice(config.prefix.length).trim().split(" ")
        // ["ytt", "asda"] --> cmd = "ytt" & ["asda"]
        var cmd = args.shift().toLowerCase()

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`❌ ERROR | Vui lòng **join** channel đầu tiên !`)
              .setDescription(`Channel-name: \`${message.guild.me.voice.channel.name}\``)
          );
        if (cmd == "ytt" || cmd == "youtubetogether") {
          fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
              max_age: 86400,
              max_uses: 0,
              target_application_id: "755600276941176913",
              target_type: 2,
              temporary: false,
              validate: null
            }),
            headers: {
              "Authorization": `Bot ${config.token}`,
              "Content-Type": "application/json"
            }
          }).then(res => res.json())
            .then(invite => {
              if (!invite.code) return message.reply(":x: Cannot start minigame")
              message.channel.send(`▶ !Click vào link bên dưới để xem Youtube cùng:\n> https://discord.com/invite/${invite.code}`).then(msg => msg.delete({timeout: 10000}).catch(e => console.log(e.message)))
            //   message.channel.send(new MessageEmbed()
            //   .setColor(ee.color)
            //   .setFooter(ee.footertext, ee.footericon)
            //   .setTitle(`▶ Click vào link bên dưới để xem Youtube cùng !`)
            //   .setDescription(`https://discord.com/invite/${invite.code}`)
            // );
            })
        }
      });
    } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            );
        }
    }
  }
