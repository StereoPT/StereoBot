import $ from 'cheerio';
import request from 'request';
import { getDay, getWeek } from 'date-fns';

import { colors } from '../lib/config.json';
const reqs = require('./reqs.json');

//Ask this Later!
const username = '2191860';
const password = 'Yl)1$Nx27';

module.exports = {
    name: 'horario',
    description: 'EID Horario Module!',
    async execute(bot, msg, args) {
      try {
        request(reqs.getLoginPage, (err, res, html) => {
          if(!err && res.statusCode == 200) {
            const token = $("meta[name='csrf-token']", html).attr("content");

            reqs.postToLogin["form"] = { "_token": token, "username": username, "password": password };
            reqs.postToLogin.headers["Cookie"] = res.headers["set-cookie"];

            request(reqs.postToLogin, (err, res, html) => {
              if(!err) {
                let token = $("meta[name='csrf-token']", html).attr("content");
                reqs.getHorarios["X-CSRF-TOKEN"] = token;
                reqs.getHorarios.headers["Cookie"] = res.headers["set-cookie"];
                              
                request(reqs.getHorarios, (err, res, html) => {
                  if(!err) {
                    const weekDay = getDay(new Date()) + 1;
                    const myClasses = JSON.parse(html).filter(iClass => iClass.diaSemana == weekDay);
                    const sortedClasses = myClasses.sort((a, b) => a.horaInicio > b.horaInicio ? 1 : -1)
                    displayClasses(msg, sortedClasses);
                  }
                });
              }
            });
          }
        });
      } catch(err) {
        console.error(err);
      }
    },
};

function displayClasses(msg, myClasses) {
  const weekYear = getWeek(new Date());

  let classReport = { embed: {
    color: colors.weather,
    title: `[StereoBot] Aulas para Hoje`,
    fields: [],
    timestamp: new Date(),
    footer: {
        text: "Atualizado"
    }
  }};

  myClasses.map((iClass) => {
    let week = iClass.semanas.substring(1).split(' ')[0].split(':');
    if(weekYear >= week[0] && weekYear <= week[1]) {
      let field = {
        name: `Aula: ${iClass.nomeUC} - ${iClass.tipoTurno}`,
        value: `**Horario:** ${iClass.horaInicio} - ${iClass.horaFim}\n` +
               `**Sala:** ${iClass.sala}\n` +
               `**Professor:** ${iClass.professor}`
      }

      classReport.embed.fields.push(field);
    }
  });

  msg.channel.send(classReport);
}