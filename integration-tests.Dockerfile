FROM node:8.9.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn install && yarn cache clean

COPY ./integration-tests tsconfig.json /usr/src/app/

ENTRYPOINT [ "yarn" ]
CMD [ "test:codecept" ]
