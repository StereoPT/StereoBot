import axios from 'axios';

const covidURL = "https://covid19-api.vost.pt/Requests/get_last_update";

module.exports = {
    name: 'covid',
    description: 'Covid-19 Module!',
    execute(bot, msg, args) {
        if(args[0] && args[0].toLowerCase() === 'help') {
            msg.channel.send("**NÃO** te consigo ajudar agora!");
            return;
        }

        axios.get(covidURL).then(({data}) => {
msg.channel.send(`Data: ${data.data}
Casos Confirmados: ${data.confirmados}
Casos Novos: ${data.confirmados_novos}
Recuperados: ${data.recuperados}
Obitos: ${data.obitos}
Internados: ${data.internados}
Internados UCI: ${data.internados_uci}`);
        });

        return;
    },
};