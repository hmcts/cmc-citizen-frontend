import I = CodeceptJS.I
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
const claimSteps: ClaimSteps = new ClaimSteps()

Feature('Help With Fee E2E Tests...')

Scenario('Submit Claim via HWF Reference... @citizen', { retries: 0 }, async (I: I) => {
  await claimSteps.makeAHwfClaimAndSubmit(I)
}).retry(3)

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user
Scenario('Navigate Payment Page by providing claim details... @smoke-test', { retries: 0 }, async (I: I) => {
  await claimSteps.makeAClaimAndNavigateUpToPayment(I)
}).retry(3)

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user for help with fees
Scenario(' Navigate Payment Page via Providing HWF reference...  @smoke-test', { retries: 0 }, async (I: I) => {
  await claimSteps.makeAHwfClaimAndNavigateUpToPayment(I)
}).retry(3)
