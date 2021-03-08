import I = CodeceptJS.I
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
const claimSteps: ClaimSteps = new ClaimSteps()

Feature('Smoke tests ...')

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user
Scenario('Navigate Payment Page by providing claim details... @smoke-test', { retries: 3 }, async (I: I) => {
  await claimSteps.makeAClaimAndNavigateUpToPayment(I)
})

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user for help with fees
Scenario(' Navigate Payment Page via Providing HWF reference...  @smoke-test', { retries: 3 }, async (I: I) => {
  await claimSteps.makeAHwfClaimAndNavigateUpToPayment(I)
})
