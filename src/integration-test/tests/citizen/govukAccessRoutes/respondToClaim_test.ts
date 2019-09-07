import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()
const userSteps: UserSteps = new UserSteps()

Feature('GovUK access routes - respond to claim')

Scenario('I can enter a CCBC reference and get sent to MCOL @nightly', { retries: 3 }, (I: I) => {
  accessRoutesSteps.respondToClaimMcol()
})

Scenario('I can enter a moneyclaims reference and get sent to enter a pin @nightly', { retries: 3 }, async (I: I) => {
  const claimantEmail: string = userSteps.getClaimantEmail()
  const claimRef: string = await I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)

  accessRoutesSteps.respondToClaimMoneyClaims(claimRef)
})
