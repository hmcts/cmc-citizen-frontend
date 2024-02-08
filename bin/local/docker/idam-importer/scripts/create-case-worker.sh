#!/bin/sh

set -e

USER_EMAIL="civilmoneyclaims+ccd@gmail.com"
FORENAME=CMC
SURNAME=CaseWorker
PASSWORD=Password12
USER_GROUP="caseworker"
USER_ROLES='[{"code":"caseworker"},{"code":"caseworker-cmc"}]'

/scripts/create-user.sh "${USER_EMAIL}" "${FORENAME}" "${SURNAME}" "${PASSWORD}" "${USER_GROUP}" "${USER_ROLES}"
