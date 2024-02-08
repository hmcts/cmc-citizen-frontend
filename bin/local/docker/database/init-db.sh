#!/usr/bin/env bash

set -e

for service in idam draftstore pcq ccpay fee payment evidence ccd_user_profile ccd_definition_store ccd_data_store cmc letter_tracking role_assignment; do
psql -v ON_ERROR_STOP=1 --username postgres --set USERNAME=$service --set PASSWORD=$service --set DATABASE=$service <<-EOSQL
  CREATE USER :USERNAME WITH PASSWORD ':PASSWORD';
  CREATE DATABASE :DATABASE WITH OWNER = :USERNAME ENCODING = 'UTF-8' CONNECTION LIMIT = -1;
EOSQL
done
