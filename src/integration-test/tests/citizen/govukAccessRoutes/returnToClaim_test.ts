import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()
const userSteps: UserSteps = new UserSteps()
let claimantEmail
let claimRef

Feature('GovUK access routes - return to claim')

Before(async (I: I) => {
  claimantEmail = userSteps.getClaimantEmail()
  claimRef = await I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)
})

Scenario('I can enter a moneyclaims reference and login to see the dashboard @citizen', { retries: 3 }, async (I: I) => {
  accessRoutesSteps.returnToClaimMoneyClaims(claimRef, claimantEmail)
}).retry(2)

Scenario('I can select don’t have a claim number and choose to go to moneyclaims, login and see the dashboard @nightly', { retries: 3 }, async (I: I) => {
  accessRoutesSteps.dontHaveAReferenceMoneyClaims(claimantEmail)
})

Scenario('I can select don’t have a claim number and choose to go to MCOL @nightly', { retries: 3 }, (I: I) => {
  accessRoutesSteps.dontHaveAReferenceMcol()
})

Scenario('I can enter a CCBC reference and get sent to MCOL @nightly', { retries: 3 }, (I: I) => {
  accessRoutesSteps.returnToClaimMcol()
}).retry(2)
