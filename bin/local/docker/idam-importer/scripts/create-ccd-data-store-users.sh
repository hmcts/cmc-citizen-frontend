#!/bin/sh

set -e

PASSWORD="Password12"
ROLES='[{"code":"caseworker"}]'
/scripts/create-user.sh "datastoreidamsystemuser@gmail.com" "Data Store" "System User" "${PASSWORD}" "caseworker" "${ROLES}"
