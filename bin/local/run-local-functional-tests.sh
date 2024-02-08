#!/bin/bash

source $(dirname "${BASH_SOURCE[0]}")/setup-environment.sh
docker logout hmctspublic.azurecr.io &>/dev/null
az acr login --name hmctsprivate --subscription 8999dec3-0104-4a27-94ee-6588559729d1


if [[ "$1" = "PULL" ]];
then
    PULL=true
    if [ ${#} -gt 0 && ${PULL}=true]
    then
    docker-compose ${COMPOSE_FILES} pull ${@}
    else
    docker-compose ${COMPOSE_FILES} pull
    fi
    shift
else
  echo "***********************************************************************"
  echo "If you would like to pull images... please add PULL in the argument...."
  echo "***********************************************************************"
  sleep 2
fi

docker-compose ${COMPOSE_FILES} run --rm citizen-integration-tests "$@"
