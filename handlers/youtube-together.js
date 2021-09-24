const { MessageEmbed, Discord } = require("discord.js");
// const fetch = require("node-fetch");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require("../botconfig/config.json");
// const client = new Discord.Client()
const ee = require("../botconfig/embed.json");
// const Yt_icon = require("../img/youtube_logo");

module.exports = client => {
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
            // message.channel.send(`▶ !Click vào link bên dưới để xem Youtube cùng:\n> https://discord.com/invite/${invite.code}`).then(msg => msg.delete({timeout: 10000}).catch(e => console.log(e.message)))
            message.channel.send(new MessageEmbed()
              .setImage('https://i.imgur.com/F8a8BO1.gif')
              .setFooter(ee.footertext, ee.footericon)
              .setDescription(`[Click to watching Youtube together](https://discord.com/invite/${invite.code})`)
            )
          })
      }
    });
  }