FROM node:10

WORKDIR /app

RUN npm i -g npm
RUN npm i -g @adonisjs/cli

COPY ./src/adonisjs .

RUN npm install

USER node

ENTRYPOINT ["tail", "-f", "/dev/null"]
CMD [ "npm", "start"]
