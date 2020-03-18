FROM node:12

WORKDIR /app
RUN chown node:node /app

COPY ./src/adonisjs .

RUN npm i npm

RUN npm i @adonisjs/cli

RUN npm install
USER node

#ENTRYPOINT ["tail", "-f", "/dev/null"]
CMD [ "npm", "start"]
