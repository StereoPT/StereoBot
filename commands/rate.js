import { help, error } from '../helpers/helperFunctions';

import { colors } from '../lib/config.json';

const rateHelper = {
  title: '[StereoBot] Rate Help',
  description: 'Comando utilizado para dar **Rate** a um Link.',
  fields: [
    { name: 'Utilização:', value: 'stereo rate `link` `valor`' }
  ]
}

module.exports = {
  name: 'rate',
  description: 'Rate Module!',
  execute(bot, msg, args) {
    if (args[0] && args[0].toLowerCase() === 'help') {
      return help(msg, rateHelper);
    }

    const msgEmbed = msg.embeds[0];
    msg.delete();
    if(msgEmbed && msgEmbed.type === 'link')  {
      const rate = args[1];
      if(!isNaN(rate) && (rate > 0 && rate < 10)) {
        const title = msgEmbed.title ? msgEmbed.title : 'Title Here';
        const url = msgEmbed.url ? msgEmbed.url : 'http://localhost/';
        const desc = msgEmbed.description.split('.').slice(0, 3).join('. ')
        const description = desc ? desc : 'Description Here';
        const imageUrl = msgEmbed.thumbnail ? msgEmbed.thumbnail.url : 'http://localhost/';
        const footerText = msgEmbed.provider ? msgEmbed.provider.name : " ";

        return msg.channel.send({embed: {
          color: colors.rate,
          author: { name: '[StereoBot]' },
          title: title,
          thumbnail: { url: imageUrl },
          url: url,
          description: description,
          fields: [
            { name: "Rating", value: `${rate} / 10`, }
          ],
          footer: { text: footerText }
        }});
      } else {
        error(msg, { description: "**Rate** must be between 0 and 10!" });
      }
    } else {
      error(msg, { description: "Unable to **Rate** that Link!" });
    }
  }
};