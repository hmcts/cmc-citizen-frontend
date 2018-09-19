FROM hmcts/cnp-java-base:openjdk-jre-8-alpine-1.4

# Mandatory!
ENV APP citizen-frontend.jar
ENV APPLICATION_TOTAL_MEMORY 1024M
ENV APPLICATION_SIZE_ON_DISK_IN_MB 66

RUN mkdir -p /usr/src/app
COPY build/libs/$APP /usr/src/app/

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
