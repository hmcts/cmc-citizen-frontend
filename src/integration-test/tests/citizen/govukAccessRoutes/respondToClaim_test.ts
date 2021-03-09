import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()

Feature('GovUK Access Routes - Respond To Claim')

Scenario('I can enter a CCBC reference and get sent to MCOL @nightly', { retries: 3 }, (I: I) => {
  accessRoutesSteps.respondToClaimMcol()
})
