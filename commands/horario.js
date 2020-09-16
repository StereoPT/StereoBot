import axios from 'axios';
import $ from 'cheerio';

module.exports = {
    name: 'horario',
    description: 'EID Horario Module!',
    execute(bot, msg, args) {
      axios.get('https://gisem.dei.estg.ipleiria.pt/login').then(function({data, headers}) {
        const token = $("meta[name='csrf-token']", data).attr("content");
        const cookie = headers['set-cookie'];

        
      });
    },
};