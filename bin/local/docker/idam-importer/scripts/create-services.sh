#!/bin/sh

set -e

# CMC
/scripts/create-service.sh "Citizen" "true" "cmc_citizen" "12345678" "[\"https://localhost:3000/receiver\",\"https://www-citizen.moneyclaim.reform.hmcts.net:3000/receiver\"]" "[\"citizen\"]"
/scripts/create-service.sh "Legal" "false" "cmc_legal" "12345678" "[\"https://localhost:4000/receiver\",\"https://www-legal.moneyclaim.reform.hmcts.net:4000/receiver\"]" "[\"solicitor\"]"

# # CCD
/scripts/create-service.sh "CCDGateway" "false" "ccd_gateway" "12345678" "[\"http://localhost:3451/oauth2redirect\"]" "[\"caseworker\",\"caseworker-cmc\"]"
/scripts/create-service.sh "ccd_data_store_api" "false" "ccd_data_store_api" "idam_data_store_client_secret" "http://ccd-data-store-api/oauth2redirect" "profile openid roles manage-user"
