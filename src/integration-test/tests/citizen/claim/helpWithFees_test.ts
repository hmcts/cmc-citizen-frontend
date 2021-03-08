import I = CodeceptJS.I
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
const claimSteps: ClaimSteps = new ClaimSteps()

Feature('Help With Fee E2E Tests...')

Scenario('Submit Claim via HWF Reference... @citizen', { retries: 3 }, async (I: I) => {
  await claimSteps.makeAHwfClaimAndSubmit(I)
})
