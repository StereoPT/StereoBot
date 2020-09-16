import { colors } from '../lib/config.json';

module.exports = {
    name: 'randomize',
    description: 'Randomize Module!',
    execute(bot, msg, args) {
        if(args[0] && args[0].toLowerCase() === 'help') {
            msg.channel.send({embed: {
                color: colors.help,
                title: "[StereoBot] Randomize Help",
                description:
                `Comando utilizado para alterar a cor de um ou todos os membros do Servidor`,
                fields: [
                    {
                        name: "Utilização:",
                        value: "stereo randomize `@membro`"
                    }
                ]
            }});
            return;
        }

        if(!msg.channel.permissionsFor(msg.guild.member(msg.author)).has('MANAGE_ROLES')) {
            msg.channel.send({embed: {
                color: colors.error, description: "**[ERROR]** Não tens **Permissões** sufecientes para utilizar esse comando!"
            }});
            
            return;
        }

        let toRandomize = msg.mentions.users.first();
        if(!toRandomize) {
            msg.guild.members.cache.forEach(async(member, id) => {
                giveRole(msg, member);
            });
            let rColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
            msg.channel.send({embed: {
                color: rColor,
                title: `[StereoBot] Randomized Color`,
                description: "**Todos** os Membros com Cores aleatórias!",
                timestamp: new Date(),
                footer: {
                    text: "Atualizado"
                }
            }});
        } else {
            let member = msg.guild.member(toRandomize)
            giveRole(msg, member);
            let rColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
            msg.channel.send({embed: {
                color: rColor,
                title: `[StereoBot] Randomized Color`,
                description: `**${member.user.username}** tem agora uma Cor Aleatória!`,
                timestamp: new Date(),
                footer: {
                    text: "Atualizado"
                }
            }});
        }

        return;
    },
};

async function giveRole(msg, member) {
    if(!member.user.bot) {
        if(!member.permissions.has("ADMINISTRATOR")) {
            let memberPerms = member.permissions.toArray();
            let randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
            
            if(!member.roles.cache.find((r) => r.name === member.user.username)) {
                //[Create & Add] Doesn't have Role
                let role = await msg.guild.roles.create({
                    data: {
                        name: member.user.username,
                        color: randomColor,
                        hoist: false,
                        permissions: memberPerms,
                        mentionable: false
                    }
                });

                await member.roles.add(role);
            } else {
                //[Edit] Has Role
                await member.roles.color.setColor(randomColor);
            }
        }  
    }
}