const Discord = require('discord.js');

const token = require('./token.js');

const client = new Discord.Client();

const prefix = '!!!';

const image = 'https://i.imgur.com/er0bVso.png';

const helpMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Link Cleaner help')
    .setURL('https://lucknell.github.io')
    .setAuthor('lucknell', image, 'https://lucknell.github.io')
    .setDescription('I am a bot that cleans links')
    .setThumbnail(image)
    .addFields({
        name: 'help',
        value: 'For help type *' + prefix + 'help*'
    }, {
        name: 'clean links',
        value: 'to clean links type\n*' + prefix + 'clean https://google.com*'
    }, {
        name: 'say Hi',
        value: 'to say hi type *' + prefix + 'hello*'
    }, )
    .addField('I hope to clean your links well', 'please don\'t break me')
    .setImage(image)
    .setTimestamp()
    .setFooter('send help plz\nI was last restarted', image);

client.once('ready', () => {
    console.log('Links prepare to be cleaned!')
});

//check if the message is started by the bot or without the prefix
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.reply('pong!');
    } else if (command === 'clean') {
        try {
            if (!cleanLink(args, message)) {
                if (cleanLink(args[1].substring(0, args[1].length - 23), message)) {} else {
                    message.channel.send(message.author.toString() +
                        " gave me an invaild URL.\n Please laugh at them.");
                }
            }
        } catch (ignored) {
            message.channel.send(message.author.toString() +
                " gave me an invaild URL.\n Please laugh at them.");
        }
    } else if (command === 'about') {
        message.channel.send("https://github.com/lucknell");
    } else if (command == 'help') {
        message.delete();
        message.channel.send(helpMessage);
    } else if (command == 'hello') {
        message.reply("Hey!");
    }
});

//https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) { //nice
    var pattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.' +
        '|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*' +
        '\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
    return !!pattern.test(str);
}

function cleanLink(args, message) {
    console.log(args);
    console.log(args[1]);
    if (validURL(args)) {
        url = decodeHTMLSymbols(args);
        console.log(url);
        url = filterLink(url);
        console.log(url);
        if (validURL(url)) {
            if ((new String(args)).localeCompare(url) == 0) {
                message.reply("no cleaning needed");
                return true;
            } else {
                message.delete();
                message.channel.send("cleaned link for " + message.author.toString() +
                    "\n" + url);
                return true;
            }
        }
        return false;
    }
    return false;
}

function decodeHTMLSymbols(url) {
    var temp = url + "";
    temp = temp.replace(/%2F/gi, '/')
        .replace(/%3A/gi, ":").replace(/%3F/gi, "?")
        .replace(/%3D/gi, "=").replace(/%26/gi, "&")
        .replace(/%2B/gi, "+").replace(/%23/gi, "#")
        .replace(/%7C/gi, "|").replace(/%24/gi, "$")
        .replace(/%27/gi, "'").replace(/%25/gi, "%");
    return temp;
}

function filterLink(url) {
    defaultFilters = "Split,PARM1=,PARM1=,1\n" +
        "Split,murl=,murl=,1\n" + "Split,clicks.slickdeals.net/i.php?u1=http,u2=,1\n" +
        "Split,?gclid,&url=,0\n" + "Split,link=,link=,1\n" + "Split,u=,u=,1\n" +
        "Split,h=,h=,0\n" + "Split,utm_,utm_,0\n" + "Split,&nm_,&nm_,0\n" +
        "Split,ref=,ref=,0\n" + "Split,u1=,u1=,0\n" + "Split,mpre=,ref=,0\n" +
        "Split,&a=,&a=,0\n" + "Split,q=,q=,1\n" + "Split,token=,token=,0\n" +
        "Split,&sa=D&,&sa=D&,0\n" + "Split,ved=,ved=,0\n" +
        "Split,html_redirect,&html_redirect,0\n" + "Split,&v=,&v=,0\n" + "Split,&mpre=,&mpre=,1\n" +
        "Split,&event=,&event=,0\n" + "Split,&redir_,&redir,0\n" +
        "Replace,amp/,amp/s/,amp/s/https://\n" + "Split,amp/s,amp/s/,1\n" + "Replace,amp/,amp/,\n" +
        "Split,bhphotovideo.com,.html,0\n" +
        "Append,bhphotovideo.com,.html/\n" + "Replace,1225267-11965372?,url=,url=https://staples.com\n" +
        "Split,url=,url=,1\n" + "Split,src=,src=,0\n" + "Split,&source=,&source=,0\n" +
        "Split,&red=,&red=,1\n" + "Split,?pf_rd_r=,?pf_rd_r=,0\n";
    filters = defaultFilters.split("\n");
    url = url + "";
    for (i = 0; i < filters.length; i++) {
        params = filters[i] + "";
        // console.log(params);
        filter = params.split(",");
        if (filter[0] === 'Split') {
            if (url.includes(filter[1])) {
                index = filter[3];
                var temp = url.split(filter[2]);
                // console.log(temp[index]);
                url = temp[index];
            }
        }
        if (filter[0] === 'Replace') {
            if (url.includes(filter[1])) {
                if (filter.length == 3) {
                    var repalce = ""
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
                url = +filter[2];
            }
        }
    }
    // console.log(filters);
    return url;
}
client.login(token.token);
