#!/bin/bash
set -ex

echo "================================================="
echo "  Running Playwright Preview Tests"
echo "  CLAIM_STORE_URL: ${CLAIM_STORE_URL}"
echo "  TEST_URL: ${TEST_URL}"
echo "================================================="

# No browser install needed — these are API-only tests
npx playwright test --config=playwright/playwright.config.ts

echo "================================================="
echo "  Playwright tests completed successfully"
echo "================================================="
