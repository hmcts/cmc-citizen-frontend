FROM hmctspublic.azurecr.io/base/node:12-alpine

# Add a new user "civil_user" with user id 8877
RUN useradd -u 8877 civil_user

# Change to non-root privilege
USER civil_user

WORKDIR /usr/src/app

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

COPY --chown=hmcts:hmcts package.json yarn.lock /usr/src/app/

RUN yarn install && yarn cache clean
USER hmcts

COPY tsconfig.json types default.conf.js saucelabs.conf.js /usr/src/app/
COPY ./src/integration-test /usr/src/app/src/integration-test

ENTRYPOINT [ "yarn" ]
CMD [ "test:integration" ]
