import { Client, Collection } from 'discord.js';

const bot = new Client();
bot.commands = new Collection();

import botCommands from './commands';

Object.keys(botCommands).map((key) => {
  if(botCommands[key].enable === true) {
    bot.commands.set(botCommands[key].name, botCommands[key]);
  }
});

bot.login(process.env.TOKEN);

console.log("[StereoBot]");

bot.on('ready', () => {
  console.info(`Logged in as: ${bot.user.tag}!`);
});

bot.on('message', (msg) => {
  const args = msg.content.split(/ +/);
  const stereo = args.shift().toLowerCase();

  if (stereo === 'stereo') {
    const command = args.shift().toLowerCase();
    console.log(`Called Command: ${command}`);

    if (!bot.commands.has(command)) return;

    try {
      bot.commands.get(command).execute(bot, msg, args);
    } catch (error) {
      console.error(error);
      msg.reply(`[ERROR] Trying to Execute ${command} Command!`);
    }
  }
});