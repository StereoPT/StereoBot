import { colors } from '../lib/config.json';

export function help(msg, myEmbed) {
  return msg.channel.send({
    embed: {
      color: colors.help,
      title: myEmbed.title,
      description: myEmbed.description,
      fields: myEmbed.fields
    }
  });
}

export function error(msg, myEmbed) {
  return msg.channel.send({
    embed: {
      color: colors.error,
      description: "**[ERROR]** " + myEmbed.description
    }
  });
}