FROM node:8.9.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

COPY package.json yarn.lock /usr/src/app/

RUN yarn install && yarn cache clean

COPY tsconfig.json types default.conf.js saucelabs.conf.js /usr/src/app/
COPY ./src/integration-test /usr/src/app/src/integration-test

ENTRYPOINT [ "yarn" ]
CMD [ "test:integration" ]
