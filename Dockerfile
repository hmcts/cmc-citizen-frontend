FROM node:8.9.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

RUN yarn install

COPY config /usr/src/app/config
COPY tsconfig.json gulpfile.js server.js /usr/src/app/
COPY src/main /usr/src/app/src/main

RUN yarn setup

RUN rm -rf node_modules \
    && yarn install --production \
    && yarn cache clean

EXPOSE 3000
CMD [ "yarn", "start" ]
