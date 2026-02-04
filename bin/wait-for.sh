#!/usr/bin/env bash

set -eu

selected_service=${@}

echo "params: ${selected_service}"
echo "CLAIM_STORE_URL: ${CLAIM_STORE_URL}"
echo "URL: ${URL:-}"

service_base_urls=${CLAIM_STORE_URL:-}
if [[ "${selected_service}" == 'definition-store' ]]; then
  service_base_urls=${CCD_DEFINITION_STORE_API_BASE_URL}
fi

echo "service_base_urls: ${service_base_urls}"

max_health_check_attempts=30

function checkHealth {
  for service_base_url in ${service_base_urls}; do
    uploadResponse=$(curl -k -w "\n%{http_code}" --silent ${service_base_url}/health)
    upload_http_code=$(echo "$uploadResponse" | tail -n1)
    echo $'\n' Http status: ${upload_http_code} >&2
    if [[ "${upload_http_code}" -ne '200' ]]; then
      exit 1
    fi
  done
}

until $(checkHealth); do
  current_health_check_attempt=$((${current_health_check_attempt:-1} + 1))

  if [ ${current_health_check_attempt} -gt ${max_health_check_attempts} ]; then
    echo -e "\nMax number of attempts reached"
    exit 1
  fi

  if [ ${current_health_check_attempt} -eq 2 ]; then
    printf 'Awaiting healthy services'
  else
    printf '.'
  fi

  sleep 10
done
