FROM hmctspublic.azurecr.io/base/node/stretch-slim-lts-10:10-stretch-slim

USER root
WORKDIR /usr/src/app

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

COPY --chown=hmcts:hmcts package.json yarn.lock /usr/src/app/

RUN yarn install && yarn cache clean
USER hmcts

COPY tsconfig.json types default.conf.js saucelabs.conf.js /usr/src/app/
COPY ./src/integration-test /usr/src/app/src/integration-test

ENTRYPOINT [ "yarn" ]
CMD [ "test:integration" ]
