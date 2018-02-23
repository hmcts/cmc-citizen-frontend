#!/bin/bash
set -ue

set -x

ADDITIONAL_COMPOSE_FILE=docker-compose.smoke-tests.yml

function shutdownDocker() {
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down
}

if [[ ${TEST_URL} = *"prod"*  ]]; then
  echo "No creating users in prod via testing support"
else
  export IDAM_URL=http://betaDevBccidamAppLB.reform.hmcts.net
fi

trap shutdownDocker INT TERM QUIT EXIT

docker-compose --version

docker-compose -f ${ADDITIONAL_COMPOSE_FILE} pull
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run integration-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

