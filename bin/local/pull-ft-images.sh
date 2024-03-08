#!/bin/bash

source $(dirname "${BASH_SOURCE[0]}")/setup-environment.sh
    
if [[ ${#} -gt 0 && ${PULL}=true ]]
then
docker logout hmctspublic.azurecr.io &>/dev/null
az acr login --name hmctsprivate --subscription 8999dec3-0104-4a27-94ee-6588559729d1
sleep 1
docker-compose ${COMPOSE_FILES} pull ${@}
else
docker-compose ${COMPOSE_FILES} pull
fi