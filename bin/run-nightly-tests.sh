#!/bin/bash
set -ex

if [[ ${TEST_URL} = *"sprod"*  ]]; then
  echo "Not running functional tests on sprod, due to pay being skipped"
  exit 0
fi

ADDITIONAL_COMPOSE_FILE="docker-compose.nightly-functional-tests.yml -f docker-compose.yml"

function shutdownDocker() {
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down
}

trap shutdownDocker INT TERM QUIT EXIT

docker-compose --version

if [[ "${1}" != "--no-build" ]]; then
  # Docker hub is slow to build we should always be using the latest version here
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} build citizen-integration-tests
fi
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run -u `id -u $USER` citizen-integration-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

