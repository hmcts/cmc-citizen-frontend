FROM node:8.9.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn install

COPY src/main /usr/src/app/src/main
COPY config /usr/src/app/config

COPY gulpfile.js tsconfig.json tsconfig.prod.json /usr/src/app/
RUN yarn compile
RUN yarn setup

EXPOSE 3000
CMD [ "yarn", "start-prod" ]
