FROM node:12
MAINTAINER lucknell <nice@try.com>
RUN mkdir -p /src/bot/
RUN apt-get update && apt-get install -y git
WORKDIR /src/bot
COPY . /src/bot
RUN git clone https://github.com/Lucknell/Discord_Link_Cleaner_bot.git
RUN mv /src/bot/Discord_Link_Cleaner_bot/Discord_Link_Cleaner/linkcleaner.js /src/bot/.
RUN npm install discord.js
CMD ["node", "linkcleaner.js"]
