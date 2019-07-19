FROM node:10

WORKDIR /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

RUN npm install
RUN cp .env.example .env

CMD [ "ls"]

#CMD [ "npm", "start"]
#ENTRYPOINT ["./bootstrap.sh"]
