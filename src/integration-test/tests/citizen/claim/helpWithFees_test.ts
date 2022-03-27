import I = CodeceptJS.I
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
const claimSteps: ClaimSteps = new ClaimSteps()

// CIV-1479 : Temporary Disable Test
// Feature('Smoke Tests...')

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user
// Scenario('Navigate Payment Page by providing claim details... @smoke-test', { retries: 3 }, async (I: I) => {
//   await claimSteps.makeAClaimAndNavigateUpToPayment(I)
// })

Feature('Help With Fee E2E Tests...')

Scenario('Submit Claim via HWF Reference... @citizen', { retries: 3 }, async (I: I) => {
  await claimSteps.makeAHwfClaimAndSubmit(I)
})
