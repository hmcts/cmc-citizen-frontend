FROM cmc-node8-chrome

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

COPY package.json yarn.lock /usr/src/app/

RUN yarn install && yarn cache clean

COPY tsconfig.json types default.conf.js saucelabs.conf.js mocha.opts /usr/src/app/
COPY ./src/test /usr/src/app/src/test
COPY ./src/main /usr/src/app/src/main
COPY ./config /usr/src/app/config

CMD [ "sh", "-c", "yarn test && yarn test:coverage && yarn test:a11y" ]
