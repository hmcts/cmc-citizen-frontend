FROM node:8.9.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json types default.conf.js saucelabs.conf.js /usr/src/app/

RUN yarn config set proxy $http_proxy && yarn config set https-proxy $https_proxy

RUN yarn install && yarn cache clean

COPY ./src/integration-test /usr/src/app/src/integration-test

ENTRYPOINT [ "yarn" ]
CMD [ "test:integration" ]
