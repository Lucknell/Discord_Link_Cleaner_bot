# Discord_Link_Cleaner_bot
A Docker container that will run a link cleaning bot for a Discord server.

Add [this bot](https://discordapp.com/oauth2/authorize?client_id=738537161527394354&scope=bot&permissions=97344) to your server!

## How this got started

A friend of mine asked for the bot after seeing me cleaning the links for them in the server. I had no knowledge of JS before this so there may be a few things that look unconventional at first. I am still improving my skills in JS so anything that should be done differently would be welcomed as an issue on Github.

## How to start building a Discord bot

### Getting Started
This bot is built using [Node.js](https://nodejs.org/en/download/) and the documentation for [Discord.js](https://discord.js.org/#/) can be found [here.](https://discord.js.org/#/docs/main/stable/general/welcome) At the time of this writing Discord.js is currently on version 12. To start building the bot you will need to create a new space for all the files you will be making. To initialize the Node.js workspace in your terminal of choice type `npm init` then follow the prompts to give your workspace a name, version number, and description. Entry point will be the first js file that you want to run in this project. For this bot I used `linkcleaner.js`. You do not need to enter a test command or git repository. Enter your name for the author and pick a license for the project if you like, I kept the default license. Once this is done you will have a `package.json` in your current directory.  You will now need to install `Discord.js`. To install it just run `npm install discord.js` in your terminal. Finally you will need to create the entry point file that you specified when running `npm init`. Once you have created your file you will need some bare minimum items to get the bot to log in and show as online. Below will have the bot show as online and do nothing else. 

```
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Hello World!')
});
client.login(validToken);
```

With that file you can save it and test it locally but running `node linkcleaner.js` you should see the `Hello World!` message in the terminal window and if you provided the bot with a valid token you will see the bot come online.

### Discord Registration

When you are ready to test your bot and receive a vaild token you will need to visit the [Discord dev site](https://discord.com/developers/applications) and create a new application. Once you give it a name you will need to go to the menu on the left and click Bot. Once you are on the Bot menu you will need to click create a bot. Once this action is done you will be able to get the token for your bot to log into Discord. 

### Discord Permissions

There is a [Discord site](https://discordapi.com/permissions.html) for calculating the permissions needed for a bot to function. That site only requires your bot's client id which will in the end give you a URL to add the bot to your server.

### Keeping The Bot Running

While you can run the bot by doing `node linkcleaner.js` on your local computer, you will need to keep your local computer running at all time if you want the bot to be reachable at all times. A way to get around this issue is by using [Docker](https://www.docker.com/). Docker can run on multiple platforms and can even run on a Raspberry pi which you can keep connected all the time to run your bot. In this repo I have included a Dockerfile which you can use to build this bot. The first command you will need to build the docker container is `docker build -t linkcleaner:v1 .` which will build a docker container from the docker file in the directory. The second thing you will need is to run the bot using this command `docker run -d --restart=always --name link_cleaner linkcleaner:v1`. This will ensure that if the bot crashes or the computer is restarted, that the bot will come back up so long as docker is running. 

### Troubleshooting

`console.log()` will be your best friend when trying to debug issues with the bot. To read the logs from the bot you will first need to find the container id using `docker ps -a` then copy the containter id and paste it after the word logs in `docker logs <container ID>` (removing <container ID>). this will let you look at the logs and work out your issues from there. Read the Discord.js documentation.
