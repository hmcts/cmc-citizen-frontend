#!/bin/bash
set -ex

ADDITIONAL_COMPOSE_FILE=docker-compose.functional-tests.yml

function shutdownDocker() {
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down
}

export CLAIM_STORE_URL=$(echo ${TEST_URL} | sed -e "s/citizen-frontend/claim-store/" -e "s/-staging//" -e "s/https/http/")
export IDAM_URL=http://betaDevBccidamAppLB.reform.hmcts.net

trap shutdownDocker INT TERM QUIT EXIT

docker-compose --version

if [[ "${1}" != "--no-build" ]]; then
  # Docker hub is slow to build we should always be using the latest version here
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} build citizen-integration-tests 
fi
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run citizen-integration-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

