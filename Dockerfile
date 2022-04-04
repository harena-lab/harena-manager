FROM node:10

RUN apt update
RUN apt install vim -y
RUN apt install -qq handbrake-cli -y

WORKDIR /app

COPY ./src/adonisjs .

#RUN chown node:node /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

RUN npm i handbrake-js@5.0.2 --save

RUN npm install

#RUN chown node:node /app

#USER node

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [ "npm", "start"]

ENTRYPOINT ["./bootstrap.sh"]
