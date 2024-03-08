#!/bin/bash

source $(dirname "${BASH_SOURCE[0]}")/setup-environment.sh

docker-compose ${COMPOSE_FILES} run --rm citizen-integration-tests "$@"
