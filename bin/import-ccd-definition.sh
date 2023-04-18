#!/usr/bin/env bash

set -ex

dir=$(dirname ${0})

definition_input_dir=$(realpath 'ccd-definition')
definition_output_file="$(realpath ".")/build/ccd-development-config/ccd-cmc-dev.xlsx"
params="$@"
definition_processor_version=dbyccu

echo "Definition directory: ${definition_input_dir}"
echo "Definition spreadsheet ${definition_output_file}"
echo "Additional parameters: ${params}"


mkdir -p $(dirname ${definition_output_file})

if [[ ! -e ${definition_output_file} ]]; then
   touch ${definition_output_file}
fi

IMPORTER_CLAIM_STORE_URL=${CCD_DEFINITION_CLAIM_STORE_URL:-$CLAIM_STORE_URL}
docker run --rm --name json2xlsx \
  -v ${definition_input_dir}:/tmp/ccd-definition \
  -v ${definition_output_file}:/tmp/ccd-definition.xlsx \
  -e CCD_DEF_CLAIM_STORE_BASE_URL=${IMPORTER_CLAIM_STORE_URL:-http://docker.for.mac.localhost:4000} \
  hmctspublic.azurecr.io/ccd/definition-processor:${definition_processor_version} \
  json2xlsx -D /tmp/ccd-definition -o /tmp/ccd-definition.xlsx ${params}

${dir}/ccd-import-definition.sh ${definition_output_file}
