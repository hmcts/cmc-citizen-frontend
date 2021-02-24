import I = CodeceptJS.I
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
const claimSteps: ClaimSteps = new ClaimSteps()

Feature('Help With Fee E2E Tests...')

Scenario('Submit claim via HWF reference @citizen', { retries: 3 }, async (I: I) => {
  claimSteps.makeAHwfClaimAndSubmit()
})

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user
Scenario('Navigate up to payment page by providing claim details @smoke-test', { retries: 3 }, async (I: I) => {
  claimSteps.makeAClaimAndNavigateUpToPayment()
})

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user for help with fees
Scenario(' Navigate up to payment page via HWF reference  @smoke-test', { retries: 3 }, async (I: I) => {
  claimSteps.makeAHwfClaimAndNavigateUpToPayment()
})
