const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "skip",
    category: "Music",
    aliases: ["sk"],
    cooldown: 4,
    useage: "skip",
    description: "Skip a track",
    run: async (client, message, args, cmduser, text, prefix) => {
    try{
        const { channel } = message.member.voice;
        if(!channel)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | Vui lòng join Channel đầu tiên !`)
            );
        if(!client.distube.getQueue(message))
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | I am not playing something !`)
                .setDescription(`The Queue is empty`)
            );
        if(client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | Vui lòng **join** Channel đầu tiên !`)
                .setDescription(`Channel-name: \`${message.guild.me.voice.channel.name}\``)
            );
        message.channel.send(new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext,ee.footericon)
            .setTitle("⏭ Skipped the Current Track")
        ).then(msg=>msg.delete({timeout: 4000}).catch(e=>console.log(e.message)))
        client.distube.skip(message);
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
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention Him / Milrato Development, when using this Code!
  * @INFO
*/
