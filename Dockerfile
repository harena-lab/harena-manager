FROM node:12

WORKDIR /app

COPY ./src/adonisjs .

#RUN chown node:node /app

RUN npm i npm

RUN npm i @adonisjs/cli

RUN npm install



#USER node

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [ "npm", "start"]

ENTRYPOINT ["./bootstrap.sh"]
