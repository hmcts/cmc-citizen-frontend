# ---- Base image ----
FROM hmcts.azurecr.io/hmcts/base/node/stretch-slim-lts-8 as base
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
COPY package.json yarn.lock ./
RUN yarn install --production \
  && yarn cache clean

# ---- Build image ----
FROM base as build
RUN yarn install
COPY tsconfig.json gulpfile.js server.js ./
COPY src/main ./src/main
RUN yarn setup

# ---- Runtime image ----
FROM base as runtime
COPY --from=build $WORKDIR/src/main ./src/main
COPY --from=build $WORKDIR/server.js $WORKDIR/tsconfig.json ./
COPY config ./config
EXPOSE 3000
USER hmcts
