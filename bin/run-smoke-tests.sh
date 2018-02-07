#!/bin/bash
set -ue

set -x

ADDITIONAL_COMPOSE_FILE=docker-compose.integration-tests.yml

function shutdownDocker() {
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down
}

trap shutdownDocker INT TERM QUIT EXIT

bash --version
docker-compose --version

#docker-compose -f ${ADDITIONAL_COMPOSE_FILE} pull
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
#docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run integration-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run integration-tests test -- --grep @citizen-smoke-test
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

