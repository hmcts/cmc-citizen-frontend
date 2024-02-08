#!/bin/sh

set -e

ROLES='[{"code":"ccd-import"}]'
/scripts/create-user.sh "ccd-importer@server.net" "CCD" "Importer" "Password12" "ccd-import" "${ROLES}"
ROLES='[{"code":"ccd-import"},{"code":"ccd-import-validate"}]'
/scripts/create-user.sh "servicesatcdm+cmc@gmail.com" "CCD" "Admin" "Password12" "ccd-import" "${ROLES}"