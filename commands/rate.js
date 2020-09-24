import { colors } from '../lib/config.json';

module.exports = {
  name: 'rate',
  description: 'Rate Module!',
  execute(bot, msg, args) {
    const msgEmbed = msg.embeds[0];
    msg.delete();
    if(msgEmbed && msgEmbed.type === 'link')  {
      const rate = args[1];
      if(!isNaN(rate) && (rate > 0 && rate < 10)) {
        const title = msgEmbed.title;
        msg.channel.send({embed: {
          color: colors.weather,
          title: '[StereoBot] Rate',
          image: {
            url: msgEmbed.thumbnail.url
          }
        }});
      } else {
        msg.channel.send("Error with Rate!");
      }
    } else {
      msg.channel.send("Nothing to **Rate**");
    }
  }
};