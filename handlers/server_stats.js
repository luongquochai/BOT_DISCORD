

module.exports = async (client) => {
  // client.on('guildMemberAdd', async (member) => {
  //   await client.channels.cache.get('890614127968542780').setName(`Total: ${member.guild.memberCount}`)
  //   // console.log(`client.channels.cache.get('890563585514811472').setName(`Total: ${member.guild.memberCount})`);
  //   await client.channels.cache.get('890616139674165329').setName(`Users: ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
  //   await client.channels.cache.get('890616164164706414').setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`)
  // })
  
  // client.on('guildMemberRemove', async (member) => {
  //   await client.channels.cache.get('890614127968542780').setName(`Total: ${member.guild.memberCount}`)
  //   await client.channels.cache.get('890616139674165329').setName(`Users: ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
  //   await client.channels.cache.get('890616164164706414').setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`)
  // })

  setInterval(()=> {
    const channel = client.channels.cache.get('890854064441671730');
    channel.setName(`🪐All users: ${channel.guild.memberCount}`);
    // const channelUser = client.guilds.cache.get('452139403666653194');
    // channel.setName(`Users Online:`)
    // console.log(channel.guild.members.pre);
    // let hours = d.getHours() + 7;
    // let min = d.getMinutes();
    // let sec = d.getSeconds();

    // console.log(d.toLocaleTimeString(("en-US", {timeZone: "Asia/Ho_Chi_Minh"})));
    // console.log(`${d.getHours() + 7}:${d.getMinutes()}:${d.getSeconds()}`);
    // console.log(d.toLocaleDateString(("en-US", {timeZone: "Asia/Ho_Chi_Minh"})));
    // channelUser.setName(`Users: ${channelUser.cache.filter(m => !m.user.bot).size}`)

  },1000);
}