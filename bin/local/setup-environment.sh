#!/bin/sh
## initialize common variable

COMPOSE_FILES_GLOBAL_DEFINITION="-f bin/local/docker-compose.yml"
COMPOSE_FILES_LOCAL_OVERRIDE="-f bin/local/docker-compose.local.yml"
COMPOSE_FILES="${COMPOSE_FILES_GLOBAL_DEFINITION} ${COMPOSE_FILES_LOCAL_OVERRIDE}"
