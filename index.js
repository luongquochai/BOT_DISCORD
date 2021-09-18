/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention Him / Milrato Development, when using this Code!
  * @INFO
*/
//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const fetch = require("node-fetch");
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs
//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  disableMentions: "all",
  shards: "auto",
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
client.categories = fs.readdirSync("./commands/"); //categories
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "events", "distube-handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
//login into the bot
client.login(require("./botconfig/config.json").token);

client.on("message", async (message) => {
  if(!message.guild || message.author.bot || !message.content.trim().startsWith(require("./botconfig/config.json").prefix)) return;
  // "!ytt asda" --> "ytt asda" --> ["ytt", "asda"]
  var args = message.content.slice(require("./botconfig/config.json").prefix.length).trim().split(" ")
  // ["ytt", "asda"] --> cmd = "ytt" & ["asda"]
  var cmd = args.shift().toLowerCase()

  const { channel } = message.member.voice;
  if(!channel) return message.reply("You need to join a Voice Channel")

  if(cmd == "ytt" || cmd == "youtubetogether"){
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
              "Authorization": `Bot ${require("./botconfig/config.json").token}`,
              "Content-Type": "application/json"
          }
      }).then(res => res.json())
      .then(invite =>{
          if(!invite.code) return message.reply(":x: Cannot start minigame")
          message.channel.send(`Click on the Link to watch together:\n> https://discord.com/invite/${invite.code}`)
      })
  }
})

/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention Him / Milrato Development, when using this Code!
  * @INFO
*/
