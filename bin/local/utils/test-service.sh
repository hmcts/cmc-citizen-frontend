#!/usr/bin/env bash

source ./bin/local/utils/functions.bash

DOCKER_SERVICE_NAME="$1"
shift

echo "Checking ${DOCKER_SERVICE_NAME} is running..."
exec=$(docker-compose exec ${DOCKER_SERVICE_NAME} echo 'UP')
while [ "_${exec}" = "_" ]; do
    echo "${DOCKER_SERVICE_NAME} is not running! PLEASE RESTART MANUALLY!"
    sleep 30
    exec=$(docker-compose exec ${DOCKER_SERVICE_NAME} echo 'UP')
done

echo "Testing ${DOCKER_SERVICE_NAME}: $@"
while ! curlTest200 "$@"; do
    echo "Waiting (restart ${DOCKER_SERVICE_NAME} if unusually long here): $@"
    sleep 30
done
