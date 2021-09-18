const Distube = require("distube");
const ee = require("../botconfig/embed.json");
const { MessageEmbed } = require("discord.js");
const { createBar, format, delay } = require("../handlers/functions");

module.exports = client => {
    client.distube = new Distube(client, {
        searchSongs: false,
        emitNewSongOnly: false,
        highWaterMark: 1024*1024*64,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        // youtubeCookie --> prevents ERRORCODE: "429"
        youtubeDL: true,
        updateYouTubeDL: true,
        customFilters: { 
            "clear": "dynaudnorm=f=200",
            "bassboost": "bass=g=20,dynaudnorm=f=200",
            "8D": "apulsator=hz=0.08",
            "vaporwave": "aresample=48000,asetrate=48000*0.8",
            "nightcore": "aresample=48000,asetrate=48000*1.25",
            "phaser": "aphaser=in_gain-0.4",
            "tremolo": "tremolo",
            "vibrato": "vibrato=f=6.5",
            "reverse": "areverse",
            "treble": "treble=g=5",
            "normalizer": "dynaudnorm=f=200",
            "surrounding": "surround",
            "pulsator": "apulsator=hz=1",
            "subboost": "asubboost",
            "karaoke": "stereotools=mlev=0.03",
            "flanger": "flanger",
            "gate": "agate",
            "haas": "haas",
            "mcompand": "mcompand"
        }
    })
    // Queue status template
    const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    // DisTube event listeners, more in the documentation page
    client.distube
        .on("playSong", (message, queue, song) => {
            message.channel.send(new MessageEmbed()
            .setTitle("Playing :notes: " + song.name)
            .setURL(song.url)
            .addField("Duration", createBar(queue.currentTime))
            .addField(`\`${song.formattedDuration}\``)
            .setColor(ee.color)
            .setThumbnail(song.thumbnail)
            .addField("QueueStatus", status(queue))
            // .addField(
            //     // song.user.displayAvatarURL({dynamic: true}),
            //     `Requested by: ${song.user}`)
            .setFooter(ee.footertext, ee.footericon)
            ).then(async msg => {
                let emojiarray = ["⏭","⏹","⏸","⏪","⏩","🔉","🔊","🔀","⏏","🔽"];
                for (const emoji of emojiarray)
                    await msg.react(emoji) 
                // msg.react("")
                // msg.react("")
                // msg.react("")

                var filter = (reaction, user) =>  emojiarray.includes(reaction.emoji.name) && user.id  !== message.client.user.id;

                var collector = await msg.createReactionCollector(filter, { time: song.duration > 0 ? song.duration * 1000 : 180000 });
                collector.on("collect", async (reaction, user) => {
                    if (!queue ) return;
                    const member = reaction.message.guild.member(user);
                    reaction.users.remove(user);
                    if(!member.voice.channel) return message.channel.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ ERROR | Please join a Voice Channel`)
                    )
                    if(member.voice.channel.id !== member.guild.voice.channel.id) return message.channel.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ ERROR | Please join my Voice Channel`)
                        .setDescription(`Channel-name: \`${member.guild.voice.channel.name}\``)
                    )

                    switch(reaction.emoji.name) {
                        case "⏭":
                            reaction.message.channel.send(new MessageEmbed()
                             .setColor(ee.color)
                             .setFooter(ee.footertext, ee.footericon)
                             .setTitle(`⏭ Chuyển bài!`)
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                            client.distube.skip(reaction.message)
                        break;
                        case "⏹":
                            reaction.message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext,ee.footericon)
                                .setTitle("⏹ Thoát👋!")
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                            client.distube.stop(reaction.message)
                        break;
                        case "⏸":
                        if(client.distube.isPaused(reaction.message)) {
                            client.distube.resume(reaction.message);
                            await delay(100);
                            client.distube.pause(message);
                            await delay(100);
                            client.distube.resume(message);
                            return reaction.message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle("⏯ Phát tiếp!")
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                        }
                            reaction.message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`⏸ Dừng!`)
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                            client.distube.pause(reaction.message)
                        break;
                        case "⏪":
                            let seektime = queue.currentTime - 15 * 1000;
                            if(seektime < 0)
                              seektime = 0;
                            if(seektime >= queue.songs[0].duration * 1000 - queue.currentTime)
                              seektime = 0;
                            client.distube.seek(message, seektime);
                            message.channel.send(new MessageEmbed()
                              .setColor(ee.color)
                              .setFooter(ee.footertext,ee.footericon)
                              .setTitle(`⏪ Lùi lại \`15 Seconds\`: ${format(seektime)}`)
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                        break;
                        case "⏩":
                            let seektime2 = queue.currentTime + 15 * 1000;
                            if(seektime2 < 0)
                                seektime2 = queue.songs[0].duration * 1000;
                            if(seektime2 >= queue.songs[0].duration * 1000)
                                seektime2 = queue.songs[0].duration * 1000 - 1000;

                            client.distube.seek(message, seektime2);

                            message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext,ee.footericon)
                                .setTitle(`⏩ Chuyển tiếp \`15 Seconds\` to: ${format(seektime2)}`)
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                        break;
                        case "🔉":
                            client.distube.setVolume(message, queue.volume - 10);
                            if(queue.volume < 10) client.distube.setVolume(message, 0);
                            return message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`🔉 Giảm âm lượng \`10%\` `)
                                .setDescription(`\`\`\`fix\nÂm lượng hiện tại: ${queue.volume}%\n\`\`\``)
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                        break;
                        case "🔊":
                            client.distube.setVolume(message, queue.volume + 10);
                            if(queue.volume > 150) client.distube.setVolume(message, 150);
                            return message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`🔊 Tăng âm lượng \`10%\``)
                                .setDescription(`\`\`\`fix\nÂm lượng hiện tại: ${queue.volume}%\n\`\`\``)
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                        break;
                        case "🔀":
                            reaction.message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext,ee.footericon)
                                .setTitle("🔀 Trộn bài hát!")
                            ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message)))
                            client.distube.shuffle(reaction.message);
                        break;
                        case "⏏":
                            reaction.message.channel.send(new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext,ee.footericon)
                                .setTitle(`⏏ Tự động chuyển bài - MODE: ${client.distube.toggleAutoplay(message) ? "✅" : "❎"}`)
                            ).then(msg=>msg.delete({timeout: 4000}).catch(e=>console.log(e.message)))
                        break;
                        case "🔽":
                            let embed = new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext,ee.footericon)
                                .setTitle(`Danh sách bài hát: ${message.guild.name}`)
                                let counter = 0;
                                for (let i=0; i < queue.songs.length; i+=20) {
                                    if(counter >= 10) break;
                                    let k = queue.songs;
                                    let songs = k.slice(i, i + 20);
                                    message.channel.send(
                                        embed.setDescription(songs.map((song,index) => 
                                        `***${index + 1 + counter *20}*** [${song.name}](${song.url}) - ${song.formattedDuration}`))
                                        ).then(msg => msg.delete({timeout: 10000}).catch(e => console.log(e.message)))
                                    counter++;
                                }
                        break;
                    }
                })
                collector.on("end", () => {
                    try{
                        msg.delete()
                    } catch {
                         
                    }
                })
            })
        }
        )

        .on("addSong", (message, queue, song) => message.channel.send(
            new MessageEmbed()
            .setTitle("Đã thêm 🎶 " + song.name)
            .setURL(song.url)
            // .addField("Duration", `\`${song.formattedDuration}\``)
            .setFooter(ee.footertext,ee.footericon)
            .setColor(ee.color)
            // .setThumbnail(song.thumbnail)
            // .setFooter(`Requested by: ${song.user}`, song.user.displayAvatarURL({dynamic: true}))
            .addField(`${queue.songs.length} Songs in the Queue`,`Duration: ${queue.duration}`)
        ).then(msg => msg.delete({timeout: 3000}).catch(e => console.log(e.message))))
        .on("playList", (message, queue, playlist, song) => message.channel.send(
            `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
        ))
        .on("addList", (message, queue, playlist) => message.channel.send(
            `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
        ))
        // DisTubeOptions.searchSongs = true
        .on("searchResult", (message, result) => {
            let i = 0;
            message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
        })
        // DisTubeOptions.searchSongs = true
        .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
        .on("error", (message, e) => {
            console.error(e)
            message.channel.send("An error encountered: " + e);
        })
        .on("initQueue", queue => {
            queue.autoplay = false;
            queue.volume = 50;
            // queue.filter="bassboost";
        });
}