import $ from 'cheerio';
import request from 'request';
import { getDay, getWeek } from 'date-fns';
import { help, error } from '../helpers/helperFunctions';

import { colors } from '../lib/config.json';
const reqs = require('../lib/reqs.json');

const horarioHelper = {
  title: '[StereoBot] Horario Help',
  description: 'Comando utilizado para saber o **Horario** para o Dia de Hoje. ' +
    'O Horário vem do **Gisem**.',
  fields: [
    { name: 'Utilização:', value: 'stereo horario `username` `password`' }
  ]
}

module.exports = {
  name: 'horario',
  description: 'EID Horario Module!',
  enable: true,
  async execute(bot, msg, args) {
    if (args[0] && args[0].toLowerCase() === 'help') {
      return help(msg, horarioHelper);
    }

    msg.delete();
    
    if (args.length < 2) {
      return error(msg, { description: 'Username or Password Missing!' });
    }

    const username = args[0];
    const password = args[1];

    try {
      request(reqs.getLoginPage, (err, res, html) => {
        if (!err && res.statusCode == 200) {
          const token = $("meta[name='csrf-token']", html).attr("content");

          reqs.postToLogin["form"] = { "_token": token, "username": username, "password": password };
          reqs.postToLogin.headers["Cookie"] = res.headers["set-cookie"];

          request(reqs.postToLogin, (err, res, html) => {
            if (!err) {
              let token = $("meta[name='csrf-token']", html).attr("content");
              reqs.getHorarios["X-CSRF-TOKEN"] = token;
              reqs.getHorarios.headers["Cookie"] = res.headers["set-cookie"];

              request(reqs.getHorarios, async (err, res, html) => {
                if (!err) {
                  const weekDay = getDay(new Date()) + 1;
                  const myClasses = JSON.parse(html).filter(iClass => iClass.diaSemana == weekDay);
                  const sortedClasses = myClasses.sort((a, b) => a.horaInicio > b.horaInicio ? 1 : -1)
                  await displayClasses(msg, sortedClasses);
                }
              });
            }
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  },
};

async function displayClasses(msg, myClasses) {
  const weekYear = getWeek(new Date());

  let classReport = {
    embed: {
      color: colors.horario,
      title: `[StereoBot] Aulas para Hoje`,
      fields: [],
      timestamp: new Date(),
      footer: { text: "Atualizado" }
    }
  };

  for (const iClass of myClasses) {
    //let week = iClass.semanas.substring(1).split('; ')[0].split(':');
    //weekYear >= week[0] && weekYear <= week[1]
    let field = {
      name: `Aula: ${iClass.nomeUC} - ${iClass.tipoTurno}`,
      value: `**Horario:** ${iClass.horaInicio} - ${iClass.horaFim}\n` +
        `**Sala:** ${iClass.sala}\n` +
        `**Professor:** ${iClass.professor}`
    }
    classReport.embed.fields.push(field);
  }

  return msg.channel.send(classReport)
}