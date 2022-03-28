#!/usr/bin/env bash

set -eu

dir=$(dirname ${0})

definition_input_dir=$(realpath 'ccd-definition')
definition_output_file="$(realpath ".")/build/ccd-development-config/ccd-cmc-dev.xlsx"
params="$@"
definition_processor_version=latest

echo "Definition directory: ${definition_input_dir}"
echo "Definition spreadsheet ${definition_output_file}"
echo "Additional parameters: ${params}"

mkdir -p $(dirname ${definition_output_file})


docker run --rm --name json2xlsx \
  -v ${definition_input_dir}:/tmp/ccd-definition \
  -v ${definition_output_file}:/tmp/ccd-definition.xlsx \
  -e CCD_DEF_CASE_SERVICE_BASE_URL=${CCD_DEF_CASE_SERVICE_BASE_URL:-http://docker.for.mac.localhost:4000} \
  -e CCD_DEF_GEN_APP_SERVICE_BASE_URL=${CCD_DEF_GEN_APP_SERVICE_BASE_URL:-http://docker.for.mac.localhost:4550} \
  hmctspublic.azurecr.io/ccd/definition-processor:${definition_processor_version} \
  json2xlsx -D /tmp/ccd-definition -o /tmp/ccd-definition.xlsx ${params}

${dir}/ccd-import-definition.sh ${definition_output_file}
