#!/bin/sh

set -e

PASSWORD="Password12"
ROLES='[{"code":"caseworker"},{"code":"caseworker-cmc"},{"code":"caseworker-cmc-anonymouscitizen"}]'
/scripts/create-user.sh "civilmoneyclaims+anonymouscitizen@gmail.com" "CMC" "AnonUser" "${PASSWORD}" "caseworker" "${ROLES}"
ROLES='[{"code":"caseworker"},{"code":"caseworker-cmc"},{"code":"caseworker-cmc-systemupdate"}]'
/scripts/create-user.sh "civilmoneyclaims+systemupdate@gmail.com" "CMC" "SystemUser" "${PASSWORD}" "caseworker" "${ROLES}"
