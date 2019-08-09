FROM node:12

WORKDIR /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

COPY ./src/adonisjs .

RUN npm install

CMD [ "npm", "start"]
