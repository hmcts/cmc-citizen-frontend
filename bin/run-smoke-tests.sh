#!/bin/bash
set -ex

ADDITIONAL_COMPOSE_FILE="docker-compose.smoke-tests.yml -f docker-compose.yml"

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

if [[ "${1}" != "--no-build" ]]; then
  # Docker hub is slow to build we should always be using the latest version here
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} build citizen-integration-tests 
fi
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run citizen-integration-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

