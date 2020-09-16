import axios from 'axios';

import { colors } from '../lib/config.json';
import { data } from '../lib/distrits.json';

const defaultLocation = 'leiria';
const weatherURL = 'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/';

module.exports = {
    name: 'weather',
    description: 'Weather Module!',
    execute(bot, msg, args) {
        if(args[0] && args[0].toLowerCase() === 'help') {
            msg.channel.send({embed: {
                color: colors.help,
                title: "[StereoBot] Weather Help",
                description:
                `Comando utilizado para saber a **Temperatura Mínima e Máxima** de uma determinada localidade.`,
                fields: [
                    {
                        name: "Utilização:",
                        value: "stereo weather `localidade`"
                    }
                ]
            }});
            return;
        }

        let arg = args.join(' ') || defaultLocation;
        let found = data.find( ({local}) => local.toLowerCase() === arg.toLowerCase());

        if(!found) {
            msg.channel.send({embed: {
                color: colors.error, description: "**[ERROR]** Invalid Location!"
            }});
            return;
        }
        
        axios.get(weatherURL + found.globalIdLocal + ".json").then(({data}) => {
            arg = arg.charAt(0).toUpperCase() + arg.slice(1);

            msg.channel.send({embed: {
                color: colors.weather,
                title: `[StereoBot] Weather Report for **${arg}**`,
                fields: [
                    {
                        name: "Temperatura Mínima",
                        value: `🔅 ${data.data[0].tMin} ºC`
                    },
                    {
                        name: "Temperatura Máxima",
                        value: `🔆 ${data.data[0].tMax} ºC`
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: "Atualizado"
                }
            }});
        });

        return;
    },
};