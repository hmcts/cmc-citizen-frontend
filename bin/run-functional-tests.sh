#!/bin/bash
set -ue

set -x

ADDITIONAL_COMPOSE_FILE=docker-compose.functional-tests.yml

function shutdownDocker() {
  docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down
}

export CLAIM_STORE_URL=$(echo ${TEST_URL} | sed -e "s/citizen-frontend/claim-store/" -e "s/-staging//" -e "s/https/http/")
if [[ ${TEST_URL} = *"prod"*  ]]; then
  export IDAM_URL=http://betaPreProdccidamAppLB.reform.hmcts.net:4501
else
  export IDAM_URL=http://betaDevBccidamAppLB.reform.hmcts.net
fi

trap shutdownDocker INT TERM QUIT EXIT

docker-compose --version

docker-compose -f ${ADDITIONAL_COMPOSE_FILE} pull
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run integration-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

