const Discord = require('discord.js');

const token = require('./token.js');

const leader = require('./leader.js');

const client = new Discord.Client();

const prefix = '!!!';

const image = 'https://i.imgur.com/er0bVso.png';

const helpMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('by lucknell')
    .setURL('https://lucknell.github.io')
    .setAuthor('Link Cleaner bot', image, 'https://lucknell.github.io')
    .setDescription('I am a bot that cleans links when I am called.')
    .setThumbnail(image)
    .addFields({
        name: 'Help',
        value: 'For help type *' + prefix + 'help*'
    }, {
        name: 'Clean links',
        value: 'to give me a link to clean type\n*' + prefix + 'clean https://google.com\nor\n@LinkCleaner clean https://google.com'
    }, {
        name: 'Say hi',
        value: 'to say hi type *' + prefix + 'hello*'
    }, {
        name: 'Issues? Requests?',
        value: 'Open a issue or request at https://github.com/Lucknell/Discord_Link_Cleaner_bot'
    })
    .addField('I hope to clean your links well', 'please don\'t break me')
    .setImage(image)
    .setTimestamp()
    .setFooter('send help plz\nI was last restarted', image);

client.once('ready', () => {
    console.log('Links prepare to be cleaned!');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'your links',
            type: 'LISTENING'
        }
    });
    avatar = 'https://cdn.discordapp.com/attachments/738539415843897435/741424895707054140/icon.png'
    client.user.setAvatar(avatar);
});

//check if the message is started by the bot or without the prefix
client.on('message', message => {
    if (message.author.bot) return;
    const msg = message.content;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const mention = message.content.substring(22, message.length).trim();
    let user = message.mentions.users.first();
    userId = user ? user.id : args[1];
    if (userId === client.user.id) {
        if (mention === 'good bot') {
            message.react('😄');
            message.react('🧹');
            return
        }
        if (mention === 'bad bot') {
            message.react('🖕');
            message.react('👍');
            message.channel.send('report it then.')
            return
        }
        if (args[0] === 'clean') {
            try {
                if (!cleanLink(args, message)) {
                    message.channel.send(message.author.toString() +
                        ' gave me an invalid URL.\n Please laugh at them.');
                    return;
                }
            }
            catch (ignored) {
                message.channel.send(message.author.toString() +
                    ' gave me an invalid URL.\n Please laugh at them.');
                return;
            }
        } else if (args[0] === 'set') {
            if (message.author.id !== leader.id) {
                message.channel.send({ files: ['https://cdn.discordapp.com/attachments/738539355882258515/751671486233968640/xbugs_bunny_diciendo_no.png'] });
                return;
            }
            if (args[1] === 'avatar') {
                client.user.setAvatar(args[2]);
            }
            else if (args[1] === 'status') {
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: msg.substring(33, msg.length),
                        type: "LISTENING"
                    }
                });
            }
        }
    }
    if (message.channel.type == 'dm') {
        if (validURL(msg)) {
            cleanLink(msg, message);
            return;
        }
        message.author.send(helpMessage);
        return;
    }
    if (!message.content.startsWith(prefix)) return;

    if (command === 'ping') {
        message.reply('pong!');
        return;
    } else if (command === 'clean') {
        try {
            if (!cleanLink(args, message)) {
                message.channel.send(message.author.toString() +
                    ' gave me an invalid URL.\n Please laugh at them.');
                return;
            }
        } catch (ignored) {
            message.channel.send(message.author.toString() +
                ' gave me an invalid URL.\n Please laugh at them.');
            return;
        }
    } else if (command === 'about') {
        message.channel.send('Learn more about me here https://github.com/Lucknell/Discord_Link_Cleaner_bot');
        return;
    } else if (command == 'help') {
        message.delete();
        message.channel.send(helpMessage);
        return;
    } else if (command == 'hello') {
        message.reply('Hey!');
        return;
    }
});

function validURL(str) {
    var pattern = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g);
    return !!pattern.test(str);
}

function cleanLink(args, message) {
    console.log('link provided :' + args);
    if (validURL(args)) {
        url = decodeHTMLSymbols(args);
        console.log(url);
        url = filterLink(url);
        console.log('filtered link :' + url);
        if (validURL(url)) {
            if ((new String(args)).localeCompare(url) == 0) {
                message.reply('no cleaning needed');
                return true;
            } else {
                message.delete();
                message.channel.send('🧹cleaned link for ' + message.author.toString() +
                    '\n' + url.replace(/,/gi, ' '));
                return true;
            }
        }
        return false;
    }
    return false;
}

function decodeHTMLSymbols(url) {
    var temp = url + '';
    temp = temp.replace(/%2F/gi, '/')
        .replace(/%3A/gi, ':').replace(/%3F/gi, '?')
        .replace(/%3D/gi, '=').replace(/%26/gi, '&')
        .replace(/%2B/gi, '+').replace(/%23/gi, '#')
        .replace(/%7C/gi, '|').replace(/%24/gi, '$')
        .replace(/%27/gi, "'").replace(/%25/gi, '%');
    return temp;
}

function filterLink(url) {
    defaultFilters = "Split,PARM1=,PARM1=,1\n" +
        "Split,murl=,murl=,1\n" + "Split,clicks.slickdeals.net/i.php?u1=http,u2=,1\n" +
        "Split,?gclid,&url=,0\n" + "Split,link=,link=,1\n" + "Split,u=,u=,1\n" +
        "Split,h=,h=,0\n" + "Split,utm_,utm_,0\n" + "Split,&nm_,&nm_,0\n" +
        "Split,ref=,ref=,0\n" + "Split,u1=,u1=,0\n" + "Split,u2=,u2=,1\n" + "Split,mpre=,ref=,0\n" +
        "Split,&a=,&a=,0\n" + "Split,q=,q=,1\n" + "Split,token=,token=,0\n" +
        "Split,&sa=D&,&sa=D&,0\n" + "Split,html_redirect,&html_redirect,0\n" +
        "Split,&v=,&v=,0\n" + "Split,&mpre=,&mpre=,1\n" +
        "Split,&event=,&event=,0\n" + "Split,&redir_,&redir,0\n" +
        "Replace,amp/,amp/s/,amp/s/https://\n" + "Split,amp/s,amp/s/,1\n" + "Replace,amp/,amp/,\n" +
        "Split,bhphotovideo.com,.html,0\n" + "Append,bhphotovideo.com,.html/\n" + "Replace,monoprice.com/,url=,&red=" +
        "Replace,tkqlhce.com,url=,url=https://staples.com\n" +
        "Split,dest_url=,dest_url=,1\n" + "Split,adurl=,adurl=,1\n" + "Split,url=,url=,1\n" + "Split,ved=,ved=,0\n" +
        "Split,src=,src=,0\n" + "Split,source=,source=,0\n" + "Split,&red=,&red=,1\n" + "Split,?pf_rd_r=,?pf_rd_r=,0\n" +
        "Split,d=sec,d=sec,0\n" + "Split,wmlspartner=,wmlspartner=,0\n" + "Split,&l0=,&l0=,1\n" + "Split,CID,CID,0\n";

    filters = defaultFilters.split('\n');
    for (i = 0; i < filters.length; i++) {
        params = filters[i] + '';
        filter = params.split(',');
        if (filter[0] === 'Split') {
            if (url.includes(filter[1])) {
                index = filter[3];
                var temp = url.split(filter[2]);
                url = temp[index];
            }
        }
        if (filter[0] === 'Replace') {
            if (url.includes(filter[1])) {
                if (filter.length == 3) {
                    var replace = ''
                } else {
                    var replace = filter[3]
                }
                url = url.replace(filter[2], replace);
            }
        }
        if (filter[0] === 'Prepend') {
            if (url.includes(filter[1])) {
                url = filter[2] + url;
            }
        }
        if (filter[0] === 'Append') {
            if (url.includes(filter[1])) {
                url = url + filter[2];
            }
        }
    }
    return url;
}
client.login(token.token);
