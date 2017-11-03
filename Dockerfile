FROM node:8.9.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json tsconfig.prod.json gulpfile.js /usr/src/app/
RUN yarn install \
    && yarn compile \
    && yarn setup \
    && rm -rf node_modules \
    && yarn install --production \
    && yarn cache clean

COPY src/main /usr/src/app/src/main
COPY config /usr/src/app/config

EXPOSE 3000
CMD [ "yarn", "start-prod" ]
