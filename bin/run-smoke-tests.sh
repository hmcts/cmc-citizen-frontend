#!/bin/bash
set -euo pipefail

if [[ -z "${TEST_URL:-}" ]]; then
  echo "TEST_URL environment variable must be set" >&2
  exit 1
fi

health_endpoint="${TEST_URL%/}/health"

echo "Running lightweight smoke healthcheck against ${health_endpoint}"

if curl -k --fail --silent --show-error --max-time 30 "$health_endpoint" > /dev/null; then
  echo "Smoke healthcheck passed"
else
  echo "Smoke healthcheck failed" >&2
  exit 1
fi
