FROM hmctspublic.azurecr.io/base/node:18-alpine

USER root

WORKDIR /tmp/src/app

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

COPY package.json yarn.lock /tmp/src/app/

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install && yarn cache clean
#USER hmcts

COPY tsconfig.json types default.conf.js saucelabs.conf.js /tmp/src/app/
COPY ./src/integration-test /tmp/src/app/src/integration-test

ENTRYPOINT [ "yarn" ]
CMD [ "test:integration" ]
