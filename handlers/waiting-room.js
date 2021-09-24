// const { MessageEmbed, Discord } = require("discord.js");
// const config = require("../botconfig/config.json");
// // const client = new Discord.Client()
// const ee = require("../botconfig/embed.json");
// const radioexecuteadmin = require("../handlers/functions");

// module.exports = client => {
//   // client.on("ready", () => {
//   //   radioexecuteadmin(client); //call the function
//   //   client.user.setActivity("🎶 24/7 Music 🎶", { type: "PLAYING" }); //set Bot activity 
//   //   console.log(`${client.user.username} ready!`); //Log that the Bot is ready
//   // });

//   //recognise if someone joins the channel
//   client.on('voiceStateUpdate', async (oldState, newState) => {
//       try {
//           if (newState.channel.id === config.voicechannel) { // if its the channel
//               if (newState.channel.members.size > 2) return; //if there are more then 2 members return
//               if (newState.member.id === client.user.id) return; // if the member is the Bot return
//               if (newState.member.user.bot) return //if its a Bot return
//               radioexecuteadmin(); //call the function
//           }
//       }
//       catch {
//       }
//   });
//   async function radioexecuteadmin() {
//     const voiceChannel = client.guilds.cache.get(config.guildid).channels.cache.get(config.voicechannel); //define the Voice Channel
//    try{
//         await voiceChannel.leave(); // leave the channel
//         await delay(300); // wait 300ms to provent a bug
//    }catch{
//    }
   
//     var connection = await voiceChannel.join();//join the channel and
//     await connection.voice.setSelfDeaf(true); await connection.voice.setDeaf(true); //selfdeaf
//     const dispatcher = connection.play('./audiofile.mp3'); //pick the audiofile sample is in the folder
//     dispatcher.on("end", end => { radioexecuteadmin() });
// }
// }