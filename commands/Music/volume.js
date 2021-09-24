const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "volume",
    category: "Music",
    aliases: ["vol"],
    cooldown: 4,
    useage: "volume <0-200>",
    description: "Changes volume of the AIO BOT",
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
        if(client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | Vui lòng **join** Channel đầu tiên !`)
                .setDescription(`Channel-name: \`${message.guild.me.voice.channel.name}\``)
            );
        if(!args[0])
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | You didn't provided a Loop method`)
                .setDescription(`Current Volume: ${client.distube.getQueue(message)}%\`\nUsage: \`${prefix}loop <0/1/2>\``)
            );

        if(!(0 <= Number(args[0]) && Number(args[0]) <= 200))
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | Volume out of Range`)
                .setDescription(`Usage: \`${prefix}volume <0-200>\``)
            );

            client.distube.setVolume(message,Number(args[0]));
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`🔊 Changed the Volume to: ${args[0]}%`)
            ).then(msg=>msg.delete({timeout: 3000}).catch(e=>console.log(e.message)))
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
