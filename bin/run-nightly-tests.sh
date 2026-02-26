#!/bin/bash
set -ex

if [[ ${TEST_URL} = *"sprod"*  ]]; then
  echo "Not running functional tests on sprod, due to pay being skipped"
  exit 0
fi

ADDITIONAL_COMPOSE_FILE="docker-compose.nightly-functional-tests.yml -f docker-compose.yml"

if command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
elif docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
else
  echo "docker compose is not available" >&2
  exit 1
fi

function shutdownDocker() {
  "${COMPOSE_CMD[@]}" -f ${ADDITIONAL_COMPOSE_FILE} down
}

trap shutdownDocker INT TERM QUIT EXIT

"${COMPOSE_CMD[@]}" --version

if [[ "${1}" != "--no-build" ]]; then
  # Docker hub is slow to build we should always be using the latest version here
  "${COMPOSE_CMD[@]}" -f ${ADDITIONAL_COMPOSE_FILE} build citizen-integration-tests
fi
"${COMPOSE_CMD[@]}" -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
"${COMPOSE_CMD[@]}" -f ${ADDITIONAL_COMPOSE_FILE} run -u `id -u $USER` citizen-integration-tests
"${COMPOSE_CMD[@]}" -f ${ADDITIONAL_COMPOSE_FILE} down
