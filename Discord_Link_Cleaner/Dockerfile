FROM node:12
MAINTAINER lucknell <nice@trry.com>
RUN mkdir -p /src/bot/
WORKDIR /src/bot
RUN npm install discord.js
COPY . /src/bot
CMD ["node", "linkcleaner.js"]
