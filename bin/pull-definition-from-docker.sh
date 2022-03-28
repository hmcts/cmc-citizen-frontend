#!/bin/bash
set -e

if (( $# < 2 )); then
    echo "Usage pull-definition-from-docker.sh ENV VERSION"
    exit 1
fi

ENV="${1:-}"
VERSION="${2:-}"

case ${ENV} in
  local)
    CLAIM_STORE_URL="http://claim-store-api:4400" # docker-compose service
  ;;
  saat|sprod|aat|ithc|prod|demo)
    CLAIM_STORE_URL="http://cmc-claim-store-${ENV}.service.core-compute-${ENV}.internal"
  ;;
  *)
    echo "$ENV not recognised"
    exit 1 ;;
esac

echo "Pulling definition version: ${VERSION}..."
docker pull hmctspublic.azurecr.io/cmc/ccd-definition-importer:${VERSION}

echo "Generating definition file..."
docker run --rm --name json2xlsx \
  -v $(pwd)/definition/releases:/tmp \
  -e "CCD_DEF_CLAIM_STORE_BASE_URL=${CLAIM_STORE_URL}" `# templated in definitions excel` \
  hmctspublic.azurecr.io/cmc/ccd-definition-importer:${VERSION} \
  sh -c "cd /opt/ccd-definition-processor && yarn json2xlsx -D /data/sheets -o /tmp/cmc-ccd.xlsx && yarn cache clean"

echo "Versioning definition file..."
mv ./definition/releases/cmc-ccd.xlsx ./definition/releases/cmc-ccd-v${VERSION}_$(echo $ENV | tr a-z A-Z).xlsx

echo "Saved: ./definition/releases/cmc-ccd-v${VERSION}_$(echo $ENV | tr a-z A-Z).xlsx"
