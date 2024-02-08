#!/bin/sh

/scripts/create-services.sh
/scripts/create-roles.sh
/scripts/create-case-worker.sh
/scripts/create-importer-user.sh
/scripts/create-anonymous-users.sh
/scripts/create-ccd-data-store-users.sh

echo -e "\nRoles and Services with caseworker and ccd-import Users created\nPlease create any citizen/solicitor/judge accounts manually"
