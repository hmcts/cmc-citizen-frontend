import I = CodeceptJS.I
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
const claimSteps: ClaimSteps = new ClaimSteps()

Feature('Help With Fee E2E Tests...')

Scenario('Submit Claim (via) HWF Reference... @citizen', { retries: 3 }, async (I: I) => {
  claimSteps.makeAHwfClaimAndSubmit()
})

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user
Scenario('I can enter a claim details and navigate up to payment page @smoke-test', { retries: 3 }, async (I: I) => {
  claimSteps.makeAClaimAndNavigateUpToPayment()
})

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user for help with fees
Scenario('I can enter a claim details and navigate up to payment page (Providing HWF reference number) @smoke-test', { retries: 3 }, async (I: I) => {
  claimSteps.makeAHwfClaimAndNavigateUpToPayment()
})
