#!/bin/bash
set -ue

ADDTIONAL_COMPOSE_FILE=docker-compose.integration-tests.yml

function shutdownDocker() {
  docker-compose -f ${ADDTIONAL_COMPOSE_FILE} down
}

trap shutdownDocker INT TERM QUIT EXIT

#docker-compose -f ${ADDTIONAL_COMPOSE_FILE} pull
docker-compose -f ${ADDTIONAL_COMPOSE_FILE} up -d remote-webdriver
docker-compose -f ${ADDTIONAL_COMPOSE_FILE} run integration-tests test --grep '@citizen-smoke-test'
docker-compose -f ${ADDTIONAL_COMPOSE_FILE} down

