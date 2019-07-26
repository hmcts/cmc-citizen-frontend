FROM hmctspublic.azurecr.io/base/node/stretch-slim-lts-8:8-stretch-slim

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

COPY package.json yarn.lock /usr/src/app/

RUN yarn install && yarn cache clean

COPY tsconfig.json types default.conf.js saucelabs.conf.js /usr/src/app/
COPY ./src/integration-test /usr/src/app/src/integration-test

WORKDIR /usr/src/app

ENTRYPOINT [ "yarn" ]
CMD [ "test:integration" ]
