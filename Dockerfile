FROM node:8

WORKDIR . /app/jacinto/casemanager

COPY ./src/adonisjs .

RUN npm i -g @adonisjs/cli
RUN npm install

CMD [ "adonis", "serve", "--dev" ]
