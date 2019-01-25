# ---- Base image ----
FROM node:8.12.0-slim as base
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
ENV WORKDIR /usr/src/app
WORKDIR ${WORKDIR}
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
CMD [ "yarn", "start" ]
