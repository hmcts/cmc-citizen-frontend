#!/usr/bin/env bash

set -e

for service in features; do
psql -v ON_ERROR_STOP=1 --username postgres --set USERNAME=$service --set PASSWORD=$service --set DATABASE=$service <<-EOSQL
  CREATE USER :USERNAME WITH PASSWORD ':PASSWORD';
  CREATE DATABASE :DATABASE WITH OWNER = :USERNAME ENCODING = 'UTF-8' CONNECTION LIMIT = -1;
EOSQL
done
